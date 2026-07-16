"""VisionService — Local AI using LLaVA via Ollama."""

import base64
import json
import re
import asyncio
import requests
from typing import AsyncGenerator

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger()

def is_valid_output(output: str) -> bool:
    """Strict validation layer for AI output."""
    if not output or len(output.strip()) < 10:
        return False

    words = output.split()
    if not words:
        return False
        
    # Prevent degenerate token looping (e.g. "Birth Birth Birth")
    if len(set(words)) / len(words) < 0.3:
        return False

    return True

def generate_with_llava(image_base64: str, prompt: str) -> str:
    """Calls Ollama's local generation endpoint."""
    url = f"{settings.ollama_url}/api/generate"

    payload = {
        "model": settings.model_name,
        "prompt": prompt,
        "images": [image_base64],
        "stream": False,
        "options": {
            "temperature": 0.5,
            "num_predict": 150
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        return result.get("response", "")
    except Exception as e:
        logger.error(f"Ollama request failed: {e}")
        return ""

class VisionService:
    """Service for interacting with local LLaVA model via Ollama."""

    def __init__(self) -> None:
        self.model_name = settings.model_name
        self._lock = asyncio.Lock()
        
    async def _ensure_model(self):
        """Not required for Ollama (daemon handles it), keeping for interface compatibility."""
        pass

    def _analyze_image_sync(self, image_base64: str) -> dict:
        """Run the inference synchronously via requests."""
        
        prompt = "Describe this image clearly in 2 sentences. Be specific and accurate."
        
        debug_logs = []
        last_output = None

        for i in range(2):
            output = generate_with_llava(image_base64, prompt)

            debug_logs.append(f"Attempt {i+1}: {repr(output)}")
            
            if not output.strip():
                logger.error("Output is entirely empty. Breaking loop immediately.")
                break
                
            if output == last_output:
                logger.warning("Same output repeating, breaking loop")
                break
                
            last_output = output

            if is_valid_output(output):
                return {
                    "result": output,
                    "debug": debug_logs
                }

        logger.error("Model failed validation. Using fallback response.")
        return {
            "result": "I couldn’t analyze this image properly, but it appears to contain visual elements. Try a different prompt or image.",
            "debug": debug_logs
        }

    async def analyze_image(self, image_base64: str, mime_type: str) -> dict:
        """Analyze an image using local Ollama model."""
        await self._ensure_model()
        
        try:
            logger.info("Running LLaVA analysis via Ollama...")
            sync_result = await asyncio.to_thread(self._analyze_image_sync, image_base64)
            
            content = sync_result.get("result", "")
            debug_logs = sync_result.get("debug", [])
            logger.debug(f"Generation debug logs: {debug_logs}")
            
            if "I couldn’t analyze this image properly" in content and debug_logs:
                content += "\n\n### OLLAMA DEBUG LOGS:\n" + "\n".join(debug_logs)
                
            # Ollama doesn't return exact token counts in the same way by default, we'll estimate
            tokens_used = len(content.split()) * 2 if content else 0

            # Wrapping the response in the required JSON structure
            result = self._wrap_text_response(content)
            result["tokens_used"] = tokens_used
            logger.info("Image analysis completed", tokens_used=tokens_used)
            return result

        except Exception as e:
            logger.error("Image analysis failed", error=str(e))
            raise

    def _wrap_text_response(self, text: str) -> dict:
        """Wrap a non-JSON response in a basic analysis structure."""
        return {
            "scene_summary": text[:4000] if text else "Analysis could not be parsed",
            "objects": [],
            "ocr_text": None,
            "languages": [],
            "colors": [],
            "faces": {"count": 0, "details": None},
            "logos": [],
            "safety": {"is_safe": True, "categories": []},
            "charts": None,
            "tables": None,
            "handwriting": None,
            "confidence": 0.5,
            "quality": "medium",
            "suggested_questions": [
                "What objects can you see in this image?",
                "Can you describe the colors in this image?",
                "What is the main subject of this image?",
            ],
        }

    async def chat_stream(
        self, messages: list[dict], analysis_context: str
    ) -> AsyncGenerator[str, None]:
        """Stream a chat response about an analyzed image."""
        url = f"{settings.ollama_url}/api/chat"
        
        ollama_messages = [
            {
                "role": "system",
                "content": f"You are a helpful AI assistant analyzing an image. Use the following analysis context to answer the user's questions about the image. Keep your answers concise and helpful. Context: {analysis_context}"
            }
        ]
        
        for m in messages:
            ollama_messages.append({"role": m["role"], "content": m["content"]})
            
        payload = {
            "model": settings.model_name,
            "messages": ollama_messages,
            "stream": True,
            "options": {"temperature": 0.5}
        }
        
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                async with client.stream("POST", url, json=payload, timeout=60.0) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line:
                            data = json.loads(line)
                            content = data.get("message", {}).get("content", "")
                            if content:
                                yield content
        except ImportError:
            # Fallback for synchronous requests stream
            def sync_fetch():
                with requests.post(url, json=payload, stream=True, timeout=60) as resp:
                    resp.raise_for_status()
                    for line in resp.iter_lines():
                        if line:
                            yield json.loads(line).get("message", {}).get("content", "")
            
            for chunk in sync_fetch():
                if chunk:
                    yield chunk
                    await asyncio.sleep(0.01)
                    
        yield "\n\n[SUGGESTED_QUESTIONS: What else is in the image? | How is the lighting? | Can you describe the background?]"

    async def chat(self, messages: list[dict], analysis_context: str) -> str:
        """Non-streaming chat response."""
        url = f"{settings.ollama_url}/api/chat"
        ollama_messages = [{"role": "system", "content": f"Context: {analysis_context}"}]
        ollama_messages.extend([{"role": m["role"], "content": m["content"]} for m in messages])
        payload = {"model": settings.model_name, "messages": ollama_messages, "stream": False}
        
        def fetch():
            resp = requests.post(url, json=payload, timeout=60)
            resp.raise_for_status()
            return resp.json().get("message", {}).get("content", "")
            
        return await asyncio.to_thread(fetch)

# Singleton instance
vision_service = VisionService()
