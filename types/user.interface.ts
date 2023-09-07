import { PermissionType } from "./permission.interface";

export interface UserType {
    id: string,
    nickname: string,
    email?: string | null,
    permissions: PermissionType
}