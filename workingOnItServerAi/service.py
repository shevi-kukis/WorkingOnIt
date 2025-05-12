import os
import json
import base64
import re
from dotenv import load_dotenv
import google.generativeai as genai  # מתקן את ה-import של google.generativeai

load_dotenv()
gemini_api_key = os.getenv('GEMINI_API_KEY')

# היצירה של ה-client צריכה להיות עם api_key ישירות
genai.configure(api_key=gemini_api_key)  # Configure the client with your API key

model = "gemini-2.0-flash"

def encode_file_to_base64(file_path):
    with open(file_path, "rb") as file:
        return base64.b64encode(file.read()).decode("utf-8")

def analyze_resume(resume_file_path):
    print(f"gemini_key: {gemini_api_key}")
    encoded_resume = encode_file_to_base64(resume_file_path)
    prompt = """שים לב לשאול שאלות על הידע שיש בקורות חיים. 
    נתח את הקובץ וספק רשימה של 4 שאלות בפורמט: { "questions": ["שאלה 1", ...] }"""

    contents = [
        genai.Content(
            role="user",
            parts=[
                genai.Part(text=prompt),
                genai.Part(inline_data=genai.Blob(mime_type="application/pdf", data=base64.b64decode(encoded_resume))),
            ],
        ),
    ]

    config = genai.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        response_mime_type="application/json",
    )

    response_text = ""
    for chunk in genai.generate_content_stream(model=model, contents=contents, config=config):
        response_text += chunk.text

    try:
        response_json = json.loads(response_text)
        return response_json.get("questions", [])
    except json.JSONDecodeError:
        return ["שגיאה בפענוח הפלט מהמודל"]

def check_answer_with_gamini(question, answer):
    prompt = f"""
    האם התשובה לשאלה הבאה נכונה?
    שאלה: {question}
    תשובה: {answer}

    החזר JSON: {{"correct": true/false, "score": 0-10, "correct_answer": "..." }}
    """

    contents = [genai.Content(role="user", parts=[genai.Part(text=prompt)])]
    config = genai.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=512,
        response_mime_type="application/json",
    )

    response_text = ""
    for chunk in genai.generate_content_stream(model=model, contents=contents, config=config):
        response_text += chunk.text

    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        return {"error": "שגיאה בפענוח תגובת המודל"}

def extract_score(feedback):
    if isinstance(feedback, dict):
        return feedback.get("score", 0)
    if isinstance(feedback, str):
        match = re.search(r"ציון[:\s]*([0-9]{1,2})", feedback)
        return int(match.group(1)) if match else 0
    return 0

def evaluate_feedback(feedback_list):
    summary_prompt = f" בהתבסס על המשובים הבאים: {feedback_list}, תחזיר את התשובה במערך בגודל 2 של מערכים של מחרוזות , המערך הראשוןן יהיה מערך של הדברים שהמשתמש טוב בהם והמערך השני דברים שהמשתמש צריך ללמוד עוד תפרט קצת המחרוזת הרשונה תהיה במה הוא טוב תפרט במה המשתמש טוב ובמה כדי לו להשתפר מהם נקודות החוזקה והחולשה של הנבחן? - תענה על התשובה בצורה מסודרת ומעוצבת"
    
    config = genai.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        top_k=40,
        max_output_tokens=512,
        response_mime_type="application/json",
    )

    summary_text = ""
    for chunk in genai.generate_content_stream(model=model, contents=summary_prompt, config=config):
        summary_text += chunk.text

    return summary_text
