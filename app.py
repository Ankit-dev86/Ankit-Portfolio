import logging
import os
import re
import smtplib
import ssl
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory


BASE_DIR = Path(__file__).resolve().parent
ALLOWED_ASSETS = {"style.css", "script.js", "cyber_bg.jpg", "resume.pdf", "profile-photo.jpeg"}
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
logging.basicConfig(level=logging.INFO)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/favicon.ico")
def favicon():
    return "", 204


@app.get("/<path:filename>")
def asset(filename):
    if filename not in ALLOWED_ASSETS:
        return jsonify(error="Not found."), 404
    return send_from_directory(BASE_DIR, filename)


def send_email_message(email_message):
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com").strip()
    smtp_username = os.environ.get("SMTP_USERNAME", "").strip()
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    try:
        preferred_port = int(os.environ.get("SMTP_PORT", "465"))
    except ValueError:
        preferred_port = 465

    ports_to_try = [preferred_port]
    for alt in (465, 587):
        if alt not in ports_to_try:
            ports_to_try.append(alt)

    last_exc = None
    for port in ports_to_try:
        try:
            context = ssl.create_default_context()
            if port == 465:
                with smtplib.SMTP_SSL(smtp_host, port, timeout=12, context=context) as smtp:
                    smtp.ehlo()
                    smtp.login(smtp_username, smtp_password)
                    smtp.send_message(email_message)
                    return
            else:
                with smtplib.SMTP(smtp_host, port, timeout=12) as smtp:
                    smtp.ehlo()
                    smtp.starttls(context=context)
                    smtp.ehlo()
                    smtp.login(smtp_username, smtp_password)
                    smtp.send_message(email_message)
                    return
        except (OSError, smtplib.SMTPException) as exc:
            last_exc = exc
            app.logger.warning("SMTP attempt on port %s failed (%s). Retrying next port...", port, exc)

    if last_exc:
        raise last_exc


@app.route("/api/contact", methods=["POST", "OPTIONS"])
def contact():
    if request.method == "OPTIONS":
        return "", 204
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Please submit the form data as JSON."), 400

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    subject = str(data.get("subject", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify(error="Name, email, and message are required."), 400
    if len(name) > 120 or len(email) > 254 or len(subject) > 200 or len(message) > 5000:
        return jsonify(error="One or more fields are too long."), 400
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return jsonify(error="Please enter a valid email address."), 400
    if "\r" in subject or "\n" in subject:
        return jsonify(error="Subject must be a single line."), 400

    smtp_host = os.environ.get("SMTP_HOST", "").strip()
    smtp_username = os.environ.get("SMTP_USERNAME", "").strip()
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    recipient = os.environ.get("CONTACT_RECIPIENT", "").strip()
    sender = os.environ.get("SMTP_FROM", smtp_username).strip()

    if not all((smtp_host, smtp_username, smtp_password, recipient, sender)):
        return jsonify(error="Contact email is not configured on the server yet."), 503

    email_message = EmailMessage()
    email_message["Subject"] = f"Portfolio skill request: {subject or 'New request'}"
    email_message["From"] = sender
    email_message["To"] = recipient
    email_message["Reply-To"] = email
    email_message.set_content(
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        f"Message:\n{message}\n"
    )

    try:
        send_email_message(email_message)
    except (OSError, smtplib.SMTPException) as exc:
        app.logger.exception("Failed to deliver contact form message: %s", exc)
        return jsonify(error="Message delivery failed. Please check server logs or email settings."), 502

    return jsonify(message="Request sent successfully."), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")))
