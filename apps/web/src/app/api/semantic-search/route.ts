import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

let EMBEDDINGS: number[][] | null = null
let META: { text?: string; source?: string }[] | null = null

function loadEmbeddings() {
  if (EMBEDDINGS) return
  const filePath = path.join(process.cwd(), 'public', 'embeddings.json')
  if (!fs.existsSync(filePath)) {
    throw new Error('Missing embeddings.json — run apps/worker/scripts/export_embeddings_json.py locally and commit the file to apps/web/public')
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = JSON.parse(raw)
  EMBEDDINGS = parsed.embeddings
  META = parsed.meta
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

export async function POST(req: NextRequest) {
  try {
    loadEmbeddings()
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  const body = await req.json()
  const embedding: number[] | undefined = body.embedding
  const top_k: number = body.top_k || 5
  if (!embedding) {
    return NextResponse.json({ error: 'Request must include an `embedding` array' }, { status: 400 })
  }

  if (!EMBEDDINGS || !META) {
    return NextResponse.json({ error: 'Embeddings not loaded' }, { status: 500 })
  }

  const scores: Array<{ idx: number; score: number }> = []
  for (let i = 0; i < EMBEDDINGS.length; i++) {
    const s = cosineSimilarity(embedding, EMBEDDINGS[i])
    scores.push({ idx: i, score: s })
  }
  scores.sort((a, b) => b.score - a.score)
  const top = scores.slice(0, top_k).map((s) => ({ score: s.score, ...META![s.idx] }))

  return NextResponse.json({ results: top })
}
