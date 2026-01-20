#!/usr/bin/env python3
"""Compute a query embedding locally and POST it to the static serverless endpoint.

Usage:
  python query_with_local_embedding.py "What is a hot dog?" --url http://localhost:3000/api/semantic-search --top_k 5

This script uses the same `all-MiniLM-L6-v2` model as the indexer so embeddings are compatible.
"""
import sys
import argparse
import requests
from sentence_transformers import SentenceTransformer
from pathlib import Path


def main():
    p = argparse.ArgumentParser()
    p.add_argument('text', help='Query text')
    p.add_argument('--url', default='http://localhost:3000/api/semantic-search', help='Serverless semantic-search endpoint')
    p.add_argument('--top_k', type=int, default=5, help='Number of results to request')
    args = p.parse_args()

    model = SentenceTransformer('all-MiniLM-L6-v2')
    emb = model.encode(args.text)
    payload = {'embedding': emb.tolist(), 'top_k': args.top_k}

    print(f'Posting embedding to {args.url} (top_k={args.top_k})...')
    resp = requests.post(args.url, json=payload)
    try:
        print('Status:', resp.status_code)
        print(resp.json())
    except Exception:
        print('Response text:', resp.text)


if __name__ == '__main__':
    main()
