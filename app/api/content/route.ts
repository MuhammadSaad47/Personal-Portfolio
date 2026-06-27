import { NextResponse } from "next/server"
import { getContent, setContent } from "@/lib/content"
import fs from "fs/promises"
import path from "path"

export const dynamic = "force-dynamic"

const contentFilePath = path.join(process.cwd(), "data", "content.json")
const mongoUri = process.env.MONGODB_URI

export async function GET() {
  try {
    const data = await getContent()
    if (!data) {
      return NextResponse.json({ error: "Failed to load content" }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load content" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (mongoUri) {
      const success = await setContent(body)
      if (!success) {
        throw new Error("MongoDB write request was not acknowledged.")
      }
      return NextResponse.json({ success: true, storage: "mongodb" })
    }

    // Otherwise, fallback to writing directly to local JSON file
    await fs.writeFile(contentFilePath, JSON.stringify(body, null, 2), "utf-8")
    return NextResponse.json({ success: true, storage: "file" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save content" }, { status: 500 })
  }
}
