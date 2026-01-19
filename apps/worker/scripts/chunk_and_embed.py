import os
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

DOCS_DIR = "../docs"
CHUNK_SIZE = 300

model = SentenceTransformer("all-MiniLM-L^-v2")

chunks = []
for frame in os.listdir(DOCS_DIR):
    with open(os.path.join(DOCS_DIR, fname), encoding='utf-8') as f:
        words = f.read().split()
        for i in range(0, len(words), CHUNK_SIZE):
            chunk = " ".join(words[i:i+CHUNK_SIZE])
            if chunk.strip():
                chunks.append({"text": chunk, "source": fname})

print(f"Total chunks:" {len(chunks)})

texts = [c["text"] for c in chunks]
embeddings = model.encode(texts, show_progress_bar=True)

import pickle
with open("chunks_and_embeddings.pk1", "wb") as f:
    pickle.dump(list(zip(chunks, embeddings)), f)

