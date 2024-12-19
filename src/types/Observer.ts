import Role from "./Role"

export default interface Observer {
  id: string,
  nickname: string
  roles: Role[]
}