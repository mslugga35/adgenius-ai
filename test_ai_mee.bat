@echo off
echo ========================================
echo       AI_MEE Connection Test
echo ========================================
echo.

cd /d C:\Users\mpmmo\AI_MEE

echo Creating test script...
(
echo import requests
echo print^("Testing AI_MEE..."^)
echo API_KEY = "AIzaSyAxH7hSdT2ovnTimIeixIW8CLSh-pirRDY"
echo url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
echo headers = {'Content-Type': 'application/json', 'X-goog-api-key': API_KEY}
echo data = {"contents": [{"parts": [{"text": "Say: AI_MEE is ready!"}]}]}
echo response = requests.post^(url, headers=headers, json=data^)
echo if response.status_code == 200:
echo     print^("SUCCESS! AI_MEE is connected!"^)
echo     result = response.json^(^)
echo     if 'candidates' in result:
echo         text = result['candidates'][0]['content']['parts'][0]['text']
echo         print^(f"Gemini says: {text}"^)
echo else:
echo     print^(f"Error: {response.status_code}"^)
) > simple_test.py

echo.
echo Running test...
python simple_test.py

echo.
pause