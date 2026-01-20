import pickle
from opensearchpy import OpenSearch
from tqdm import tqdm

INDEX_NAME = "evidence_chunks"
VECTOR_DIM = 384  # for all-MiniLM-L6-v2

client = OpenSearch(hosts=[{"host": "localhost", "port": 9200}])
print("Deleting existing index if present...")
client.indices.delete(index=INDEX_NAME, ignore=[400, 404])
print("Creating index...")
client.indices.create(index=INDEX_NAME, ignore=400, body={
    "mappings": {
        "properties": {
            "text": {"type": "text"},
            "source": {"type": "keyword"},
            "embedding": {"type": "knn_vector", "dimension": VECTOR_DIM}
        }
    }
})

with open("chunks_and_embeddings.pkl", "rb") as f:
    data = pickle.load(f)

print(f"Indexing {len(data)} chunks...")
for chunk, emb in tqdm(data):
    client.index(index=INDEX_NAME, body={
        "text": chunk["text"],
        "source": chunk["source"],
        "embedding": emb.tolist()
    })

print("Indexing complete!")