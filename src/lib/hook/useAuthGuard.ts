
import { useRouter } from "next/navigation";
import useCurrentUser from "./useCurrentUser"
import { useEffect } from "react";

export interface AuthGuardProps {
  rule: 'guest' | 'auth',
  redirect?: string | undefined
}

export default function useAuthGuard({ rule, redirect }: AuthGuardProps) {
  const router = useRouter();
  const { user, loading, error } = useCurrentUser();

  useEffect(() => {
    if (error) {
      router.push('/error')
    }
    
    if (!loading) {
      if (rule === 'guest' && user && redirect) {
        router.push(redirect);
      } else if (rule === 'auth' && !user) {
        if (redirect) {
          router.push(redirect);
        } else {
          throw new Error('Authentication guard used; expected user but none and no redirect specified.');
        }
      }
    }
  }, [error, loading, rule, user, redirect, router]);

  return { user, loading };
}