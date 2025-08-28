import os
import requests

API_KEY = "AIzaSyAxH7hSdT2ovnTimIeixIW8CLSh-pirRDY"

print("Testing AI_MEE with Gemini API...")

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

headers = {
    'Content-Type': 'application/json',
    'X-goog-api-key': API_KEY
}

data = {
    "contents": [{
        "parts": [{"text": "Say: AI_MEE is ready!"}]
    }]
}

try:
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        print("SUCCESS! API is working!")
        result = response.json()
        if 'candidates' in result:
            text = result['candidates'][0]['content']['parts'][0]['text']
            print(f"Gemini says: {text}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")