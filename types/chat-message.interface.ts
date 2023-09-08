export interface ChatMessage {
    user: {
        id: string,
        nickname: string
    },
    message: string
}