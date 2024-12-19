import { confirmAccount } from "@/lib/http/authLib"
import { redirect } from "next/navigation"

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const token = decodeURI((await params).token)

  try {
    await confirmAccount(token)
  } catch (error: unknown) {
    if (error instanceof Error) {
      redirect(`/error?message=Account%20confirmation%20error:%20${error.message}`)
    } else {
      redirect(`/error`)
    }
  } finally {
    redirect('/auth/login?ref=confirm')
  }
}