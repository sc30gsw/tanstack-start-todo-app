import { relations } from "drizzle-orm"
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
    profilePictureUrl: text("profile_picture_url"),
    organizationId: text("organization_id"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("index_users_on_email").on(table.email),
    index("index_users_on_first_name").on(table.firstName),
    index("index_users_on_last_name").on(table.lastName),
    index("index_users_on_email_verified").on(table.emailVerified),
    index("index_users_on_organization_id").on(table.organizationId),
  ],
)

export const todos = sqliteTable("todos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  text: text("text").notNull(),
  completed: integer("completed", { mode: "boolean" }).default(false),
  user_id: text("user_id").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
})

export const userRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}))

export const todoRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.user_id],
    references: [users.id],
  }),
}))

export const table = {
  todos,
} as const

export type Table = typeof table
