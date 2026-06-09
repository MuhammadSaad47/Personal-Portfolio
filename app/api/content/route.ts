import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { MongoClient } from "mongodb"

export const dynamic = "force-dynamic"

const contentFilePath = path.join(process.cwd(), "data", "content.json")
const mongoUri = process.env.MONGODB_URI

// Cache connection globally to reuse it in serverless environment
let cachedClient: MongoClient | null = null

async function getMongoClient() {
  if (!mongoUri) return null
  if (cachedClient) return cachedClient

  try {
    const client = new MongoClient(mongoUri, {
      connectTimeoutMS: 5000, // Short timeout for serverless
      socketTimeoutMS: 15000,
    })
    await client.connect()
    cachedClient = client
    return client
  } catch (err: any) {
    console.error("MongoDB Connection Error:", err)
    throw new Error(`Database Connection Error: ${err.message || err}`)
  }
}

async function getMongoDBContent() {
  const client = await getMongoClient()
  if (!client) return null
  try {
    const db = client.db("portfolio")
    const collection = db.collection("content")
    
    const document = await collection.findOne({ id: "main_portfolio_content" })
    if (document) {
      const { _id, ...rest } = document
      return rest
    }
  } catch (err: any) {
    throw new Error(`Database Read Error: ${err.message || err}`)
  }
  return null
}

async function setMongoDBContent(content: any) {
  const client = await getMongoClient()
  if (!client) {
    throw new Error("Could not connect to MongoDB. Verify your connection string and credentials.")
  }
  try {
    const db = client.db("portfolio")
    const collection = db.collection("content")
    
    const res = await collection.replaceOne(
      { id: "main_portfolio_content" },
      { id: "main_portfolio_content", ...content },
      { upsert: true }
    )
    if (!res.acknowledged) {
      throw new Error("MongoDB write request was not acknowledged.")
    }
    return true
  } catch (err: any) {
    throw new Error(`Database Write Error: ${err.message || err}`)
  }
}

export async function GET() {
  try {
    // Try to load from MongoDB if URI is configured
    if (mongoUri) {
      const dbContent = await getMongoDBContent()
      if (dbContent) {
        return NextResponse.json(dbContent)
      }
    }

    // Fallback to local data/content.json file
    const fileContent = await fs.readFile(contentFilePath, "utf-8")
    return NextResponse.json(JSON.parse(fileContent))
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load content" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // If MongoDB URI is configured, persist to cloud database
    if (mongoUri) {
      await setMongoDBContent(body)
      return NextResponse.json({ success: true, storage: "mongodb" })
    }

    // Otherwise, fallback to writing directly to local JSON file
    await fs.writeFile(contentFilePath, JSON.stringify(body, null, 2), "utf-8")
    return NextResponse.json({ success: true, storage: "file" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save content" }, { status: 500 })
  }
}
