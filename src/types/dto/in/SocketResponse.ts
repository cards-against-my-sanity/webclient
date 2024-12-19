import SocketResponseType from "./SocketResponseType"

export default interface SocketResponse<T> {
  type: SocketResponseType,
  data: T,
  isError: boolean,
  error: {
    title: string,
    message: string
  }
}