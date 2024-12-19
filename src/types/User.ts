import Role from "./Role";
import Session from "./Session";

export default interface User {
  nickname: string,
  roles: Role[],
  sessions: Session[]
}