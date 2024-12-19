import PacketType from "./PacketType";

export default interface Packet<T> {
  type: PacketType,
  payload: T
}