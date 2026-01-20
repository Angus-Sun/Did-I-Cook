import os
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

DOCS_DIR = "../docs"
CHUNK_SIZE = 300

model = SentenceTransformer("all-MiniLM-L6-v2")

chunks = []
for frame in os.listdir(DOCS_DIR):
    with open(os.path.join(DOCS_DIR, frame), encoding='utf-8') as f:
        words = f.read().split()
        for i in range(0, len(words), CHUNK_SIZE):
            chunk = " ".join(words[i:i+CHUNK_SIZE])
            if chunk.strip():
                chunks.append({"text": chunk, "source": frame})

print(f"Total chunks: {len(chunks)}")

texts = [c["text"] for c in chunks]
embeddings = model.encode(texts, show_progress_bar=True)

import pickle
with open("chunks_and_embeddings.pkl", "wb") as f:
    pickle.dump(list(zip(chunks, embeddings)), f)

