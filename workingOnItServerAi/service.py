import os
import json
import base64
import re
import requests
import google.generativeai as genai
from dotenv import load_dotenv
from PyPDF2 import PdfReader  # type: ignore
# טוען את משתני הסביבה
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = "gemini-2.0-flash"  # אפשר להחליף לפי צורך
# יצירת אובייקט המודל
model = genai.GenerativeModel("gemini-2.0-flash")

# הורדת קובץ מהאינטרנט
def download_file_from_url(url, local_filename="temp_resume.pdf"):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"שגיאה בהורדת קובץ: {response.status_code}")
    with open(local_filename, "wb") as f:
        f.write(response.content)
    return local_filename

# קידוד קובץ לבסיס 64 (לא בשימוש ישיר כרגע)
def encode_file_to_base64(file_path):
    if file_path.startswith("http"):
        response = requests.get(file_path)
        response.raise_for_status()
        return base64.b64encode(response.content).decode("utf-8")
    else:
        with open(file_path, "rb") as file:
            return base64.b64encode(file.read()).decode("utf-8")


    with open(resume_file_path, "rb") as f:
        file_bytes = f.read()

    prompt = """נתח את קובץ קורות החיים וספק 4 שאלות על בסיס התוכן שבו. החזר תשובה בפורמט:
    { "questions": ["שאלה 1", "שאלה 2", "שאלה 3", "שאלה 4"] }
    """

    response = genai.GenerativeModel(model).generate_content([
        prompt,
        {"mime_type": "application/pdf", "data": file_bytes}
    ])

    try:
        return json.loads(response.text).get("questions", [])
    except json.JSONDecodeError:
        return ["שגיאה בפענוח הפלט מהמודל", response.text]

# בדיקת תשובה לשאלה מול המודל
# def check_answer_with_gamini(question, answer):
#     prompt = f"""
#     האם התשובה לשאלה הבאה נכונה?
#     שאלה: {question}
#     תשובה: {answer}

#     החזר JSON: {{"correct": true/false, "score": 0-10, "correct_answer": "..." }}
#     """

#     contents = [genai.Content(role="user", parts=[genai.Part(text=prompt)])]
#     config = genai.GenerateContentConfig(
#         temperature=1,
#         top_p=0.95,
#         top_k=40,
#         max_output_tokens=512,
#         response_mime_type="application/json",
#     )

#     response_text = ""
#     for chunk in genai.generate_content_stream(model=model, contents=contents, config=config):
#         response_text += chunk.text
#     print(response_text)
#     try:
#         return json.loads(response_text)
#     except json.JSONDecodeError:
#         return {"error": "שגיאה בפענוח תגובת המודל"}
def check_answer_with_gamini(question, answer):
    prompt = f"""
    האם התשובה לשאלה הבאה נכונה?
    שאלה: {question}
    תשובה: {answer}

   החזר JSON: {{"correct": true/false, "score": 0-10, "correct_answer": "..." }}
    """
    try:
        response = model.generate_content([prompt])
        response_text = response.text.strip()

        # ניקוי עטיפת ```json אם קיימת
        if response_text.startswith("```"):
            response_text = re.sub(r"^```(?:json)?\s*", "", response_text)
            response_text = re.sub(r"\s*```$", "", response_text)

        return json.loads(response_text)
    except Exception as e:
        print(f"שגיאה בתקשורת עם המודל: {str(e)}")
        return {"error": "שגיאה בפענוח תגובת המודל"}

# שליפת ציון מהמשוב
def extract_score(feedback):
    if isinstance(feedback, dict):
        return feedback.get("score", 0)
    if isinstance(feedback, str):
        match = re.search(r"ציון[:\s]*([0-9]{1,2})", feedback)
        return int(match.group(1)) if match else 0
    return 0

# הערכת משובים כללית
# def evaluate_feedback(feedback_list):
#     summary_prompt = f"""
#     בהתבסס על המשובים הבאים: {feedback_list}, תחזיר את התשובה במערך בגודל 2 של מערכים של מחרוזות.
#     המערך הראשון: במה המשתמש טוב (נקודות חוזקה), השני: במה המשתמש צריך להשתפר (נקודות חולשה).
#     תענה בצורה ברורה, מסודרת ומעוצבת.
#     """

#     contents = [genai.Content(role="user", parts=[genai.Part(text=summary_prompt)])]
#     config = genai.GenerateContentConfig(
#         temperature=1,
#         top_p=0.95,
#         top_k=40,
#         max_output_tokens=512,
#         response_mime_type="text/plain",
#     )

#     response_text = ""
#     for chunk in genai.generate_content_stream(model=model, contents=contents, config=config):
#         response_text += chunk.text

#     return {"summary": response_text}
def evaluate_feedback(feedback_list):
    summary_prompt = f"""
    בהתבסס על המשובים הבאים: {feedback_list}, תחזיר תשובה בפורמט הבא:
    {{
        "strengths": ["נקודה חזקה 1", "נקודה חזקה 2"],
        "weaknesses": ["נקודת שיפור 1", "נקודת שיפור 2"]
    }}
    אל תוסיף הסברים או טקסט נוסף.
    """

    try:
        response = model.generate_content([summary_prompt])
        response_text = response.text.strip()

        if response_text.startswith("```"):
            response_text = re.sub(r"^```(?:json)?\s*", "", response_text)
            response_text = re.sub(r"\s*```$", "", response_text)

        return json.loads(response_text)
    except Exception as e:
        print(f"שגיאה בתקשורת עם המודל: {str(e)}")
        return {"error": "שגיאה בפענוח תגובת המודל"}

# פונקציה עוטפת לניתוח קורות חיים מקישור
def analyze_resume_from_url(resume_url):
    local_file = download_file_from_url(resume_url)
    
    try:
        return analyze_resume(local_file)
    finally:
        if os.path.exists(local_file):
            os.remove(local_file)


def pdf_to_text(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text



    with open(resume_file_path, "rb") as f:
        file_bytes = f.read()

    prompt = """נתח את קובץ קורות החיים וספק 4 שאלות על בסיס התוכן שבו. החזר תשובה בפורמט:
    { "questions": ["שאלה 1", "שאלה 2", "שאלה 3", "שאלה 4"] }
    """

    try:
       
        response = genai.GenerativeModel(model).generate_content([
    {"role": "user", "parts": [
        {"text": prompt},
        {"mime_type": "application/pdf", "data": file_bytes}
    ]}
])


        questions = json.loads(response.text).get("questions", [])
        if not questions:
            raise ValueError("לא התקבלו שאלות מהמודל.")
        print(questions)
        return questions

    except (json.JSONDecodeError, ValueError) as e:
        print(f"שגיאה בפענוח הפלט: {str(e)}")
        return ["שגיאה בפענוח הפלט מהמודל", response.text]



import mimetypes

import google.generativeai as genai
import mimetypes
import json
import re



def analyze_resume(resume_file_path: str) -> list:
    # ניחוש סוג MIME
    mime_type, _ = mimetypes.guess_type(resume_file_path)
    if not mime_type:
        return ["שגיאה: לא ניתן לזהות את סוג הקובץ."]

    # קריאת הקובץ
    try:
        with open(resume_file_path, "rb") as f:
            file_bytes = f.read()
    except Exception as e:
        return [f"שגיאה בפתיחת קובץ: {str(e)}"]

    # הגדרת הפרומפט
    prompt = (
        "נתח את קובץ קורות החיים וספק בדיוק 4 שאלות לראיון עבודה על בסיס התוכן שבו. "
        "החזר תשובה בפורמט JSON בלבד בלי הסברים ובלי עטיפות קוד:\n"
        "{\"questions\": [\"שאלה 1\", \"שאלה 2\", \"שאלה 3\", \"שאלה 4\"]}"
    )

 

    try:
     
        response = model.generate_content([{"mime_type": mime_type, "data": file_bytes}, prompt])

        raw_text = response.text.strip()

        # ניקוי עטיפת ```json אם קיימת
        if raw_text.startswith("```"):
            raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
            raw_text = re.sub(r"\s*```$", "", raw_text)

        # ניסיון לפענח JSON
        try:
          questions = json.loads(raw_text).get("questions", [])
          if not questions:
            raise ValueError("לא נמצאו שאלות תקפות בתשובת המודל.")
          return questions
        except json.JSONDecodeError:
         return ["שגיאה בפענוח הפלט מהמודל", raw_text]

    except Exception as e:
        return ["שגיאה בפענוח הפלט מהמודל", str(e)]

