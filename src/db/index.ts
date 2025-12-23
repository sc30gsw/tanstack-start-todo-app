import { config } from "dotenv"
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql"
import * as schema from "~/db/schema"

export let db: LibSQLDatabase<typeof schema> | null = null

//! サーバーサイドでのみ環境変数・DBを読み込む
if (typeof window === "undefined") {
  config({ path: ".env" })

  db = drizzle({
    connection: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
    schema,
  })
}
