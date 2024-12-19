'use client'

import { ChangeEvent, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import useCurrentUser from "@/lib/hook/useCurrentUser"

export interface ChatboxInputProps {
  ready: boolean,
  sendMessage: (msg: string) => void
}

export default function ChatboxInput({ ready, sendMessage }: ChatboxInputProps) {
  const { user } = useCurrentUser()
  const [message, setMessage] = useState<string>('')

  const isDisabled = !ready || !user;

  function handleMessageChange(event: ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value)
  }

  function handleSubmit(): void {
    if (!message) return
    sendMessage(message)
    setMessage('')
  }

  return (
    <form action={handleSubmit} className="flex gap-x-2">
      <Input type="text" placeholder={isDisabled ? 'Please sign in chat' : 'Type a message...'} value={message} onChange={handleMessageChange} disabled={isDisabled} />
      <Button variant="default" type="submit" disabled={isDisabled}>Send</Button>
    </form>
  )
}