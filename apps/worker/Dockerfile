FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app sources
COPY . ./

# Expose port used by the FastAPI app
EXPOSE 8000

CMD ["uvicorn", "semantic_search_api:app", "--host", "0.0.0.0", "--port", "8000"]
