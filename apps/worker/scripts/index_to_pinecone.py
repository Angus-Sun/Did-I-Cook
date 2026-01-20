import os
import pickle
import time
from tqdm import tqdm

import pinecone

PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENV = os.getenv('PINECONE_ENV')
PINECONE_INDEX = os.getenv('PINECONE_INDEX', 'did-i-cook')
VECTOR_DIM = int(os.getenv('VECTOR_DIM', '384'))

if not PINECONE_API_KEY:
    raise RuntimeError('PINECONE_API_KEY is not set')

pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)

if PINECONE_INDEX not in pinecone.list_indexes():
    pinecone.create_index(PINECONE_INDEX, dimension=VECTOR_DIM, metric='cosine')

index = pinecone.Index(PINECONE_INDEX)

with open('chunks_and_embeddings.pkl', 'rb') as f:
    data = pickle.load(f)

batch_size = 100
records = []
print(f'Preparing {len(data)} items for upsert...')
for i, (chunk, emb) in enumerate(tqdm(data)):
    rec_id = f'chunk-{i}'
    metadata = {'text': chunk['text'], 'source': chunk['source']}
    records.append((rec_id, emb.tolist(), metadata))
    if len(records) >= batch_size:
        index.upsert(vectors=records)
        records = []
        time.sleep(0.1)

if records:
    index.upsert(vectors=records)

print('Upsert complete.')
