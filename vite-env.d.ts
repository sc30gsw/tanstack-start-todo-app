interface ViteTypeOptions {
  // この行を追加することで ImportMetaEnv の型を厳密にし、不明なキーを許可しないように
  // できます。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly TURSO_DATABASE_URL: string
  readonly TURSO_AUTH_TOKEN: string
  readonly APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
