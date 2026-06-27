import fs from "fs/promises"
import path from "path"
import { MongoClient } from "mongodb"

const contentFilePath = path.join(process.cwd(), "data", "content.json")
const mongoUri = process.env.MONGODB_URI

let cachedClient: MongoClient | null = null

async function getMongoClient() {
  if (!mongoUri) return null
  if (cachedClient) return cachedClient

  try {
    const client = new MongoClient(mongoUri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 15000,
    })
    await client.connect()
    cachedClient = client
    return client
  } catch (err: any) {
    console.error("MongoDB Connection Error in lib/content:", err)
    return null
  }
}

export async function getContent() {
  try {
    if (mongoUri) {
      const client = await getMongoClient()
      if (client) {
        const db = client.db("portfolio")
        const collection = db.collection("content")
        const document = await collection.findOne({ id: "main_portfolio_content" })
        if (document) {
          const { _id, ...rest } = document
          return rest
        }
      }
    }
  } catch (err) {
    console.error("Error reading from MongoDB in lib/content:", err)
  }

  // Fallback to local content.json
  try {
    const fileContent = await fs.readFile(contentFilePath, "utf-8")
    return JSON.parse(fileContent)
  } catch (err) {
    console.error("Error reading local content.json in lib/content:", err)
    return null
  }
}

export async function setContent(content: any) {
  const client = await getMongoClient()
  if (!client) {
    throw new Error("Could not connect to MongoDB.")
  }
  const db = client.db("portfolio")
  const collection = db.collection("content")
  
  const res = await collection.replaceOne(
    { id: "main_portfolio_content" },
    { id: "main_portfolio_content", ...content },
    { upsert: true }
  )
  return res.acknowledged
}
