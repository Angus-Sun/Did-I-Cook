import pickle
import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PKL_PATH = SCRIPT_DIR.parent / 'chunks_and_embeddings.pkl'
OUT_PATH = SCRIPT_DIR.parent.parent / 'web' / 'public' / 'embeddings.json'

if not PKL_PATH.exists():
    print(f"Missing {PKL_PATH}. Run chunk_and_embed.py first to generate it.")
    raise SystemExit(1)

with open(PKL_PATH, 'rb') as f:
    data = pickle.load(f)

# Expecting data to be list of {'text':..., 'source':..., 'embedding': np.array(...) } or similar
embs = []
meta = []
for item in data:
    emb = item.get('embedding')
    if hasattr(emb, 'tolist'):
        emb_list = emb.tolist()
    else:
        emb_list = list(emb)
    embs.append(emb_list)
    meta.append({'text': item.get('text'), 'source': item.get('source')})

OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump({'embeddings': embs, 'meta': meta}, f)

print(f'Wrote embeddings JSON to {OUT_PATH}')
