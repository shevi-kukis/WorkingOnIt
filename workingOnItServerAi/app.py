import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests

from service import analyze_resume, analyze_resume_from_url, check_answer_with_gamini, evaluate_feedback

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # בינתיים, פתוח לכולם

@app.route("/upload_resume", methods=["POST"])
def upload_resume():
    
    data = request.get_json()
    print(data)
    file_url = data.get("filePath")
    if not file_url:
        return jsonify({"error": "Invalid or missing file path"}), 400

    temp_path = "temp_resume.pdf"
    try:
        
       

        # questions = analyze_resume(file_url)  # ✅ שולחת את ה־URL המקור
        questions = analyze_resume_from_url(file_url)
        print(questions)
        return jsonify({"questions": questions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route("/check_answer", methods=["POST"])
def check_answer():
    data = request.json
    question = data.get('question')
    answer = data.get('answer')
    
    if not question or not answer:
        return jsonify({"error": "Question and answer must be provided"}), 400

    feedback = check_answer_with_gamini(question, answer)
    return jsonify({"feedback": feedback}), 200

@app.route("/evaluate_responses", methods=["POST"])
def evaluate_responses():
    try:
        data = request.json
        feedback_list = data.get('feedback_list', [])
        if not feedback_list:
            return jsonify({"error": "Feedback list must be provided"}), 400

        summary = evaluate_feedback(feedback_list)
        return jsonify({"summary": summary}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

