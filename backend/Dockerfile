FROM python:3.11-slim

WORKDIR /app

# Install PostgreSQL client for health check and other dependencies
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV FLASK_APP=run.py
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8000

# Use Gunicorn as the WSGI server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "run:app"] 