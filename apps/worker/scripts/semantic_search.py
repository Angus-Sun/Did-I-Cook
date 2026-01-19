from sentence_transformers import SentenceTransformer
from opensearchpy import OpenSearch

model = SentenceTransformer('all-MiniLM-L6-v2')
client = OpenSearch(hosts=[{"host": "localhost", "port": 9200}])
INDEX_NAME = "evidence_chunks"

query = "AI will create jobs."
query_emb = model.encode([query])[0]

response = client.search(index=INDEX_NAME, body={
    "size": 5,
    "query": {
        "knn": {
            "embedding": {
                "vector": query_emb.tolist(),
                "k": 5
            }
        }
    }
})

for hit in response["hits"]["hits"]:
    print(f"Score: {hit['_score']:.2f} | Source: {hit['_source']['source']}")
    print(hit["_source"]["text"])
    print("---")