'use client'

import useAuthGuard from "@/lib/hook/useAuthGuard";
import { logIn } from "@/lib/http/authLib";
import { isEmail } from "@/lib/regex";
import LogInRequestDto from "@/types/dto/out/http/LogInRequestDto";
import { formOptions, useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useContext, useState } from "react";
import Loading from "../../loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GameServerContext } from "@/lib/socket/context";

export default function LogInPage(): ReactNode {
  const { loading } = useAuthGuard({ rule: 'guest', redirect: '/' })

  const [error, setError] = useState<string | undefined>()

  const router = useRouter()

  const searchParams = useSearchParams()

  const gameserver = useContext(GameServerContext)

  const queryClient = useQueryClient()
  const logInMutation = useMutation({
    mutationFn: logIn,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      await gameserver.client?.deactivate()
      router.push('/')
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const myForm = useForm({
    ...formOptions<LogInRequestDto>({
      defaultValues: {
        email: '',
        password: '',
        rememberMe: false
      }
    }),
    onSubmit: async ({ value }) => {
      logInMutation.mutate(value)
    }
  })

  const isReferredFromConfirmation = searchParams.has('ref') && searchParams.get('ref') === 'confirm'

  if (loading) return <Loading />

  return (
    <div className="flex justify-center pt-12">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            {(error && <p className="text-red-400 font-semibold">{error}</p>) || (isReferredFromConfirmation && <p className="text-green-500 font-semibold">Your account has been confirmed - you can now log in!</p>)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <form action={() => myForm.handleSubmit()} className="flex flex-col gap-y-8">
            <myForm.Field name="email" validators={{
              onChange: ({ value }) => {
                if (!isEmail(value)) {
                  return "Please enter a valid email address"
                }
              }
            }}>
              {(field) => {
                return (
                  <div>
                    <Input name={field.name} type="email" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Email" />
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                )
              }}
            </myForm.Field>

            <myForm.Field name="password">{(field) => {
              return (
                <div>
                  <Input name={field.name} type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Password" />
                </div>
              )
            }}
            </myForm.Field>

            <myForm.Field name="rememberMe">{(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox id={field.name} name={field.name} checked={field.state.value} onCheckedChange={(e) => field.handleChange(e as boolean)} />
                <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label>
              </div>
            )}</myForm.Field>

            <myForm.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div>
                  <Button variant="default" type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Log in'}
                  </Button>
                </div>
              )}
            </myForm.Subscribe>
          </form>
          <Link href='/auth/signup' className="text-sm text-gray-400 hover:text-gray-500">I need to sign up</Link>
          <Link href='/auth/forgot_password' className="text-sm text-gray-400 hover:text-gray-500">I forgot my password</Link>
          <Link href='/auth/resend_confirmation' className="text-sm text-gray-400 hover:text-gray-500">I need a new confirmation email</Link>
        </CardContent>
      </Card>
    </div>
  );
}