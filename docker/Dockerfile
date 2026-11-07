FROM python:3.13-slim

WORKDIR /app/apps/api

COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api/ .

EXPOSE 8000

# Listen on 0.0.0.0: Railway's public edge requires IPv4, and private
# networking resolves both IPv4 and IPv6 (api.railway.internal).
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
