import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

const contentFilePath = path.join(process.cwd(), "data", "content.json")

// Vercel KV environment variables (injected by Vercel Integration)
const kvUrl = process.env.KV_REST_API_URL
const kvToken = process.env.KV_REST_API_TOKEN

async function getKVContent() {
  if (!kvUrl || !kvToken) return null
  try {
    const res = await fetch(`${kvUrl}/get/portfolio_content`, {
      headers: {
        Authorization: `Bearer ${kvToken}`
      },
      next: { revalidate: 0 } // Disable fetch caching
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data && typeof data.result === "string") {
      return JSON.parse(data.result)
    }
  } catch (err) {
    console.error("KV Read Error:", err)
  }
  return null
}

async function setKVContent(content: any) {
  if (!kvUrl || !kvToken) return false
  try {
    const res = await fetch(`${kvUrl}/set/portfolio_content`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`
      },
      body: JSON.stringify(JSON.stringify(content))
    })
    return res.ok
  } catch (err) {
    console.error("KV Write Error:", err)
    return false
  }
}

export async function GET() {
  // Try to load from Vercel KV
  const kvContent = await getKVContent()
  if (kvContent) {
    return NextResponse.json(kvContent)
  }

  // Fallback to local data/content.json
  try {
    const fileContent = await fs.readFile(contentFilePath, "utf-8")
    return NextResponse.json(JSON.parse(fileContent))
  } catch (err) {
    return NextResponse.json({ error: "Failed to read local content" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // If Vercel KV is configured, persist to KV
    if (kvUrl && kvToken) {
      const ok = await setKVContent(body)
      if (ok) {
        return NextResponse.json({ success: true, storage: "kv" })
      }
    }

    // In local development, write directly to the local JSON file
    await fs.writeFile(contentFilePath, JSON.stringify(body, null, 2), "utf-8")
    return NextResponse.json({ success: true, storage: "file" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save content" }, { status: 500 })
  }
}
