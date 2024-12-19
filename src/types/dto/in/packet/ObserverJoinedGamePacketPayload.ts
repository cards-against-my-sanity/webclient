import Observer from "@/types/Observer";

export default interface ObserverJoinedGamePacketPayload {
  gameId: string,
  observer: Observer
}