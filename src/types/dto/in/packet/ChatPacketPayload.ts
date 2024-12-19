import User from "@/types/User";

export default interface ChatPacketPayload {
  message: string,
  sender: User
}