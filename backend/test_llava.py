import asyncio
import base64
import os
from app.ai.vision import generate_with_llava

def test_llava():
    # Find any image in the directory or create a dummy pixel
    dummy_pixel = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    b64_img = base64.b64encode(dummy_pixel).decode("utf-8")
    
    print("Testing LLaVA connection...")
    prompt = "Describe this image clearly in 2 sentences. Be specific and accurate."
    
    try:
        response = generate_with_llava(b64_img, prompt)
        print("Success! Response from LLaVA:")
        print(response)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_llava()
