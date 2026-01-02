import { useState } from "react"
import { TodoForm } from "~/features/todos/components/todo-form"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogTrigger,
} from "~/components/ui/revola"

type TodoFormModalProps = {
  trigger: React.ReactNode
}

export function TodoFormModal({ trigger }: TodoFormModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{trigger}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-h-[90vh] p-6 bg-white">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>新しいTodoを作成</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            新しいTodoアイテムを作成します。必要な情報を入力してください。
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="overflow-y-auto mt-4">
          <TodoForm
            isEdit={false}
            onSuccess={() => {
              setOpen(false)
            }}
          />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
