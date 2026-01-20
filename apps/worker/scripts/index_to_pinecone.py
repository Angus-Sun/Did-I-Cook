import os
import pickle
import time
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv

import pinecone

# Load .env from apps/worker if present
SCRIPT_DIR = Path(__file__).resolve().parent
env_path = SCRIPT_DIR.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_ENV = os.getenv('PINECONE_ENV')
PINECONE_INDEX = os.getenv('PINECONE_INDEX', 'did-i-cook')
VECTOR_DIM = int(os.getenv('VECTOR_DIM', '384'))

if not PINECONE_API_KEY:
    raise RuntimeError('PINECONE_API_KEY is not set')

# Initialize pinecone: prefer the new `Pinecone` class API, fall back to older APIs.
try:
    # Try new API: `from pinecone import Pinecone`
    from pinecone import Pinecone

    pc = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)

    def list_indexes():
        res = pc.list_indexes()
        if hasattr(res, 'names'):
            return list(res.names())
        try:
            return list(res)
        except Exception:
            return res

    def create_index(name, dimension, metric):
        # New API may accept different params; try common signature first.
        try:
            return pc.create_index(name=name, dimension=dimension, metric=metric)
        except TypeError:
            return pc.create_index(name, dimension, metric)

    def IndexFactory(name):
        # New Pinecone API exposes `Index` (capitalized). Try that first,
        # fall back to a lowercase `index` if present.
        try:
            return pc.Index(name)
        except AttributeError:
            return pc.index(name)

except Exception:
    # Fall back to older pinecone API (pinecone.init / pinecone.Index)
    try:
        pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)
        def list_indexes():
            return pinecone.list_indexes()
        def create_index(name, dimension, metric):
            return pinecone.create_index(name, dimension=dimension, metric=metric)
        def IndexFactory(name):
            return pinecone.Index(name)
    except AttributeError as e:
        raise RuntimeError("Incompatible pinecone client installed. Please install a supported pinecone-client version or update the script.") from e

if PINECONE_INDEX not in list_indexes():
    create_index(PINECONE_INDEX, dimension=VECTOR_DIM, metric='cosine')

index = IndexFactory(PINECONE_INDEX)

data_path = SCRIPT_DIR.parent / 'chunks_and_embeddings.pkl'
with open(data_path, 'rb') as f:
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
