'use client'

import useAuthGuard from "@/lib/hook/useAuthGuard";
import { resendConfirmationEmail } from "@/lib/http/authLib";
import { isEmail } from "@/lib/regex";
import { formOptions, useForm } from "@tanstack/react-form";
import { ReactNode, useState } from "react";
import Loading from "../../loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmailRequestBodyDto from "@/types/dto/out/http/EmailRequestBodyDto";

export default function ResendConfirmationEmailPage(): ReactNode {
  const { loading } = useAuthGuard({ rule: 'guest', redirect: '/' })

  const [error, setError] = useState<string | undefined>()
  const [sent, setSent] = useState<boolean>(false)

  const myForm = useForm({
    ...formOptions<EmailRequestBodyDto>({
      defaultValues: {
        email: ''
      }
    }),
    onSubmit: async ({ value }) => {
      try {
        await resendConfirmationEmail(value.email)
        setSent(true)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        }
      }
    }
  })

  if (loading) return <Loading />

  if (sent) {
    return (
      <div className="flex justify-center pt-12">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If that email has an account registered to it, you will find a new message there with a link to confirm your account. Best of luck with your onward journey!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center pt-12">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Resend account confirmation email</CardTitle>
          <CardDescription className="flex flex-col gap-y-2">
            <p>Never received an account confirmation email? Our bad. Just fill up the form below and we&apos;ll fix that right up.</p>
            {error && <p className="text-red-400 font-semibold">{error}</p>}
          </CardDescription>
        </CardHeader>
        <CardContent>
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

            <myForm.Subscribe selector={(formState) => [formState.canSubmit, formState.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div>
                  <Button variant="default" type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Get a new confirmation email'}
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