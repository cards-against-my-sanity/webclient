export default interface SocketResponse<T> {
    status: "ok" | "error";
    message: string;
    data: T | null;
}