import Role from "./Role";
import Session from "./Session";

export default interface User {
  id: string,
  nickname: string,
  roles: Role[],
  sessions: Session[]
}