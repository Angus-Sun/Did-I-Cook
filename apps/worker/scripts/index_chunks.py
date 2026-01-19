import pickle
from opensearchpy import OpenSearch

INDEX_NAME = "evidence_chunks"
VECTOR_DIM = 384  # for all-MiniLM-L6-v2

client = OpenSearch(hosts=[{"host": "localhost", "port": 9200}])
client.indices.create(index=INDEX_NAME, ignore=400, body={
    "mappings": {
        "properties": {
            "text": {"type": "text"},
            "source": {"type": "keyword"},
            "embedding": {"type": "dense_vector", "dims": VECTOR_DIM}
        }
    }
})

with open("chunks_and_embeddings.pkl", "rb") as f:
    data = pickle.load(f)

for chunk, emb in data:
    client.index(index=INDEX_NAME, body={
        "text": chunk["text"],
        "source": chunk["source"],
        "embedding": emb.tolist()
    })