export interface Message {
    type: "chat" | "system",
    user?: {
        id: string,
        nickname: string
    },
    received: string,
    message: string
}