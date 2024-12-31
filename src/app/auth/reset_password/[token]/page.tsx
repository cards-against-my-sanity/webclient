import ResetPasswordForm from "./form";

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ResetPasswordForm token={decodeURIComponent(token)} />
}