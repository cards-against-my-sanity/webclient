import { use } from "react";
import { UserContext } from "../context/user.context";

export default function useCurrentUser() {
  return use(UserContext)
}