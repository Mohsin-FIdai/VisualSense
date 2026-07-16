"""Context building utilities for AI chat conversations."""

import re
from typing import Any


def build_analysis_context(analysis: dict) -> str:
    """Format analysis data into readable text for chat context."""
    parts = ["Image Analysis Summary:"]

    scene = analysis.get("scene_summary")
    if scene:
        parts.append(f"\nScene: {scene}")

    objects = analysis.get("objects")
    if objects and isinstance(objects, list):
        parts.append(f"\nDetected Objects: {', '.join(str(o) for o in objects)}")

    ocr = analysis.get("ocr_text")
    parts.append(f"\nText Found (OCR): {ocr or 'None'}")

    languages = analysis.get("languages")
    if languages and isinstance(languages, list):
        parts.append(f"\nLanguages: {', '.join(str(l) for l in languages)}")

    colors = analysis.get("colors")
    if colors and isinstance(colors, list):
        parts.append(f"\nDominant Colors: {', '.join(str(c) for c in colors)}")

    faces = analysis.get("faces")
    if faces:
        if isinstance(faces, dict):
            count = faces.get("count", 0)
            details = faces.get("details", "None")
            parts.append(f"\nFaces: {count} detected. {details or ''}")
        else:
            parts.append(f"\nFaces: {faces}")

    logos = analysis.get("logos")
    if logos and isinstance(logos, list):
        parts.append(f"\nLogos: {', '.join(str(l) for l in logos)}")
    else:
        parts.append("\nLogos: None")

    safety = analysis.get("safety")
    if safety and isinstance(safety, dict):
        is_safe = safety.get("is_safe", True)
        categories = safety.get("categories", [])
        parts.append(f"\nSafety: {'Safe' if is_safe else 'Flagged'}")
        if categories:
            parts.append(f" (Categories: {', '.join(str(c) for c in categories)})")

    charts = analysis.get("charts")
    parts.append(f"\nCharts/Graphs: {charts or 'None'}")

    tables = analysis.get("tables")
    parts.append(f"\nTables: {tables or 'None'}")

    handwriting = analysis.get("handwriting")
    parts.append(f"\nHandwriting: {handwriting or 'None'}")

    confidence = analysis.get("confidence")
    if confidence is not None:
        parts.append(f"\nConfidence: {confidence}")

    quality = analysis.get("quality")
    if quality:
        parts.append(f"\nQuality: {quality}")

    return "".join(parts)


def build_chat_messages(
    history: list[Any], analysis_context: str, new_message: str
) -> list[dict]:
    """Build OpenAI message format from conversation history."""
    messages = []
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": new_message})
    return messages


def extract_suggested_questions(response_text: str) -> tuple[str, list[str]]:
    """Parse [SUGGESTED_QUESTIONS: q1 | q2 | q3] from response text.

    Returns:
        A tuple of (clean_text, list_of_questions).
    """
    pattern = r"\[SUGGESTED_QUESTIONS:\s*(.+?)\]"
    match = re.search(pattern, response_text)

    if match:
        questions_str = match.group(1)
        questions = [q.strip() for q in questions_str.split("|") if q.strip()]
        clean_text = response_text[: match.start()].rstrip()
        return clean_text, questions

    return response_text, []
