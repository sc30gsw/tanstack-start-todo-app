export class DatabaseError extends Error {
  status = 500

  constructor(message: string = "Database error occurred") {
    super(message)
    this.name = "DatabaseError"
  }
}

export class TodoNotFoundError extends Error {
  status = 404

  constructor(id?: string) {
    super(id ? `Todo with id ${id} not found` : "Todo not found")
    this.name = "TodoNotFoundError"
  }
}
