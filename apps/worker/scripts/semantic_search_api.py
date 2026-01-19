from fastapi import FastAPI, Request
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from opensearchpy import OpenSearch
import numpy as np

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')
client = OpenSearch(hosts=[{"host": "localhost", "port": 9200}])
INDEX_NAME = "evidence_chunks"

class Query(BaseModel):
    query: str
    top_k: int = 5

@app.post("/search")
def search(query: Query):
    embedding = model.encode(query.query)
    script_query = {
        "size": query.top_k,
        "query": {
            "script_score": {
                "query": {"match_all": {}},
                "script": {
                    "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                    "params": {"query_vector": embedding.tolist()}
                }
            }
        }
    }
    response = client.search(index=INDEX_NAME, body=script_query)
    results = [
        {
            "text": hit["_source"]["text"],
            "source": hit["_source"]["source"],
            "score": hit["_score"]
        }
        for hit in response["hits"]["hits"]
    ]
    return {"results": results}