export default interface ResetPasswordRequestDto {
  token: string,
  newPassword: string,
  newPasswordConfirmation: string
}