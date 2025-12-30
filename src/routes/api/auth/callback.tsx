import { createFileRoute } from "@tanstack/react-router"
import { handleCallbackRoute } from "@workos/authkit-tanstack-react-start"
import { db } from "~/db"
import { users } from "~/db/schema"
import { DatabaseError } from "~/features/todos/server/errors"

export const Route = createFileRoute("/api/auth/callback")({
  server: {
    handlers: {
      GET: handleCallbackRoute({
        onSuccess: async ({ user, organizationId }) => {
          if (!db) {
            throw new DatabaseError("Database not initialized")
          }

          await db
            .insert(users)
            .values({
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              emailVerified: user.emailVerified,
              profilePictureUrl: user.profilePictureUrl,
              organizationId: organizationId,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: users.id,
              set: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                profilePictureUrl: user.profilePictureUrl,
                organizationId: organizationId,
                updatedAt: new Date(),
              },
            })
        },
        onError: ({ error }) => {
          console.error("Authentication failed:", error)

          return new Response(
            JSON.stringify({
              error: "認証に失敗しました",
              message: "もう一度お試しください",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          )
        },
      }),
    },
  },
})
