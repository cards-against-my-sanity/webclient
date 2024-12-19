'use client'

import useAuthGuard from "@/lib/hook/useAuthGuard";
import { isEmail } from "@/lib/regex";
import { formOptions, useForm } from "@tanstack/react-form";
import { ReactNode, useState } from "react";
import Loading from "../../loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SignUpRequestDto from "@/types/dto/out/http/SignUpRequestDto";
import { signUp } from "@/lib/http/authLib";
import Link from "next/link";

export default function LogInPage(): ReactNode {
  const { loading } = useAuthGuard({ rule: 'guest', redirect: '/' })

  const [error, setError] = useState<string | undefined>()
  const [finished, setFinished] = useState<boolean>(false)

  const myForm = useForm({
    ...formOptions<SignUpRequestDto>({
      defaultValues: {
        email: '',
        nickname: '',
        password: '',
        passwordConfirmation: ''
      }
    }),
    onSubmit: async ({ value }) => {
      try {
        await signUp(value)
        setFinished(true)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
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
            <CardTitle>Thanks for signing up!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You&apos;re almost ready to play. We&apos;ve sent an email to the address you gave us to verify your account. Please click it to finish activating your account and start playing.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center pt-12">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>{error && <p className="text-red-400 font-semibold">{error}</p>}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-2">
          <form action={() => myForm.handleSubmit()} className="flex flex-col gap-y-8">
            <myForm.Field name="email" validators={{
              onChange: ({ value }) => {
                if (!isEmail(value)) {
                  return "Please enter a valid email address."
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

            <myForm.Field name="nickname" validators={{
              onChange: ({ value }) => {
                if (value.length < 3) {
                  return "Your nickname should be at least 3 characters long"
                }

                if (value.length > 16) {
                  return "Your nickname should be at most 16 characters long"
                }
              }
            }}>
              {(field) => {
                return (
                  <div>
                    <Input name={field.name} type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Nickname" />
                    {field.state.meta.errors.map((error) => (
                      <p key={error as string} className="text-red-400">{error}</p>
                    ))}
                  </div>
                )
              }}
            </myForm.Field>

            <myForm.Field name="password" validators={{
              onChange: ({ value }) => {
                if (value.length < 8) {
                  return "Your password should be at least 8 characters long."
                }
              }
            }}>{(field) => {
              return (
                <div>
                  <Input name={field.name} type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Password" />
                  {field.state.meta.errors.map((error) => (
                    <p key={error as string} className="text-red-400">{error}</p>
                  ))}
                </div>
              )
            }}
            </myForm.Field>

            <myForm.Field name="passwordConfirmation" validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue('password')) {
                  return "Password confirmation does not match password"
                }
              }
            }}>{(field) => {
              return (
                <div>
                  <Input name={field.name} type="password" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} placeholder="Password Confirmation" />
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
                    {isSubmitting ? '...' : 'Sign up'}
                  </Button>
                </div>
              )}
            </myForm.Subscribe>
          </form>
          <Link href='/auth/login' className="text-sm text-gray-400 hover:text-gray-500">I already have an account</Link>
        </CardContent>
      </Card>
    </div>
  );
}