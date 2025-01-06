import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import os

def send_reset_email(to_email, reset_link):
    from_email = os.getenv('EMAIL_USERNAME')
    email_password = os.getenv('EMAIL_PASSWORD')
    subject = "Solicitud de restablecimiento de contraseña"

    # Crear el mensaje HTML
    html_content = f"""
    <html>
    <head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 20px;
        }}
        .header img {{
            max-width: 100px;
        }}
        .content {{
            margin-bottom: 20px;
        }}
        .button {{
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }}
        .button:hover {{
            background-color: #0056b3;
        }}
        .footer {{
            text-align: center;
            font-size: 0.9rem;
            color: #6c757d;
        }}
    </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:logo" alt="Logo">
            </div>
            <div class="content">
                <h2>Solicitud de restablecimiento de contraseña</h2>
                <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
                <a href="{reset_link}" class="button">Restablecer contraseña</a>
            </div>
            <div class="footer">
                <p>Si no solicitó un restablecimiento de contraseña, puede ignorar este correo.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Crear el mensaje MIME
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Adjuntar el mensaje HTML
    msg.attach(MIMEText(html_content, 'html'))

    # Adjuntar la imagen
    with open('static/img/logo.png', 'rb') as img_file:
        img_data = img_file.read()
        img = MIMEImage(img_data, name='logo.png')
        img.add_header('Content-ID', '<logo>')
        msg.attach(img)

    # Enviar el correo
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, email_password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()