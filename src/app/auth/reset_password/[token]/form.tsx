'use client'

import useAuthGuard from "@/lib/hook/useAuthGuard";
import { formOptions, useForm } from "@tanstack/react-form";
import { ReactNode, useState } from "react";
import Loading from "../../../loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResetPasswordRequestDto from "@/types/dto/out/http/ResetPasswordRequestDto";
import Link from "next/link";
import { resetPassword } from "@/lib/http/authLib";

export default function ResetPasswordForm({ token }: { token: string }): ReactNode {
  const { loading } = useAuthGuard({ rule: 'guest', redirect: '/' })

  const [error, setError] = useState<string | undefined>()
  const [finished, setFinished] = useState<boolean>(false)

  const myForm = useForm({
    ...formOptions<ResetPasswordRequestDto>({
      defaultValues: {
        token,
        newPassword: '',
        newPasswordConfirmation: ''
      }
    }),
    onSubmit: async ({ value }) => {
      try {
        await resetPassword(value)
        setFinished(true)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        }
      }
    }
  })

  if (loading) return <Loading />

  if (finished) {
    return (
      <div className="flex justify-center pt-12">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Your password has been reset</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Congratulations! Your password has been successfully reset. You can now <Link href="/auth/login" className="text-gray-400 hover:text-gray-500">log in</Link> to your account with your new password.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center pt-12">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription className="flex flex-col gap-y-2">
            <p>You&apos;re almost there! Please choose a new password and confirm it by typing it again.</p>
            {error && <p className="text-red-400 font-semibold">{error}</p>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={() => myForm.handleSubmit()} className="flex flex-col gap-y-8">
            <myForm.Field name="token">
              {(field) => (
                <div className="hidden">
                  <input type="hidden" value={field.state.value} />
                </div>
              )}
            </myForm.Field>

            <myForm.Field name="newPassword" validators={{
              onChange: ({ value }) => {
                if (value.length < 8) {
                  return "Your new password should be at least 8 characters long."
                }
              }
            }}>{(field) => {
              return (
                <div>
                  <Input name={field.name} type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="New Password" />
                  {field.state.meta.errors.map((error) => (
                    <p key={error as string} className="text-red-400">{error}</p>
                  ))}
                </div>
              )
            }}
            </myForm.Field>

            <myForm.Field name="newPasswordConfirmation" validators={{
              onChangeListenTo: ['newPassword'],
              onChange: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue('newPassword')) {
                  return "New password confirmation does not match new password"
                }
              }
            }}>{(field) => {
              return (
                <div>
                  <Input name={field.name} type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="New Password Confirmation" />
                  {field.state.meta.errors.map((error) => (
                    <p key={error as string} className="text-red-400">{error}</p>
                  ))}
                </div>
              )
            }}
            </myForm.Field>

            <myForm.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div>
                  <Button variant="default" type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Reset password'}
                  </Button>
                </div>
              )}
            </myForm.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}