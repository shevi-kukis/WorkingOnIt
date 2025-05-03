FROM python:3.11.9-slim

# הגדרת תיקיית עבודה בקונטיינר
WORKDIR /app

# העתקת קבצים לתוך הקונטיינר
COPY . /app

# התקנת התלויות מתוך requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# הפעלת האפליקציה
CMD ["python", "app.py"]
