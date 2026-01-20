from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from pathlib import Path
from dotenv import load_dotenv
import os
import numpy as np
from opensearchpy import OpenSearch

app = FastAPI()

SCRIPT_DIR = Path(__file__).resolve().parent
# Load .env from apps/worker if present
env_path = SCRIPT_DIR.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

model = SentenceTransformer('all-MiniLM-L6-v2')

# OpenSearch configuration
OPENSEARCH_URL = os.getenv('OPENSEARCH_URL', 'http://localhost:9200')
# OPENSEARCH_URL expected in form http(s)://host:port
host = OPENSEARCH_URL.replace('http://', '').replace('https://', '').split(':')[0]
port = int(OPENSEARCH_URL.split(':')[-1]) if ':' in OPENSEARCH_URL else 9200
client = OpenSearch(hosts=[{"host": host, "port": port}])
INDEX_NAME = os.getenv('OPENSEARCH_INDEX', 'evidence_chunks')


class Query(BaseModel):
    query: str
    top_k: int = 5


@app.post('/search')
def search(query: Query):
    embedding = model.encode(query.query)

    script_query = {
        'size': query.top_k,
        'query': {
            'knn': {
                'embedding': {
                    'vector': embedding.tolist(),
                    'k': query.top_k
                }
            }
        }
    }

    response = client.search(index=INDEX_NAME, body=script_query)
    results = [
        {
            'text': hit['_source'].get('text'),
            'source': hit['_source'].get('source'),
            'score': hit.get('_score')
        }
        for hit in response['hits']['hits']
    ]
    return {'results': results}
