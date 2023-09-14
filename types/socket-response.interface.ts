export default interface SocketResponse<T> {
    status: "ok" | "error";
    message: string | null;
    data: T | null;
}