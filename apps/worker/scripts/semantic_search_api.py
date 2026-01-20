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
    from fastapi import FastAPI
    from pydantic import BaseModel
    from sentence_transformers import SentenceTransformer
    import os
    import numpy as np

    app = FastAPI()
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Use Pinecone if configured, otherwise fall back to OpenSearch
    USE_PINECONE = bool(os.getenv('PINECONE_API_KEY'))
    PINECONE_INDEX = os.getenv('PINECONE_INDEX', 'did-i-cook')

    if USE_PINECONE:
        import pinecone
        PINECONE_API_KEY = os.environ['PINECONE_API_KEY']
        PINECONE_ENV = os.environ.get('PINECONE_ENV')
        pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)
        pinecone_index = pinecone.Index(PINECONE_INDEX)
    else:
        from opensearchpy import OpenSearch
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
        if USE_PINECONE:
            resp = pinecone_index.query(queries=[embedding.tolist()], top_k=query.top_k, include_metadata=True)
            matches = resp['results'][0]['matches'] if 'results' in resp else resp['matches']
            results = [
                {
                    'text': m['metadata'].get('text'),
                    'source': m['metadata'].get('source'),
                    'score': m.get('score')
                }
                for m in matches
            ]
            return {'results': results}
        else:
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
                    'text': hit['_source']['text'],
                    'source': hit['_source']['source'],
                    'score': hit.get('_score')
                }
                for hit in response['hits']['hits']
            ]
            return {'results': results}
