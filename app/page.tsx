import { getContent } from "@/lib/content"
import { ClientPage } from "./client-page"

export const dynamic = "force-dynamic"

export default async function Home() {
  const content = await getContent()
  
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040D18] text-[#00C9FF] font-mono">
        Failed to load portfolio content. Please check your database connection.
      </div>
    )
  }

  return <ClientPage content={content} />
}
