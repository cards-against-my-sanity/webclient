export default async function Error({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const messageParam = (await searchParams)['message']

  if (!messageParam) {
    return <p>An unexpected error has occurred.</p>
  } else if (Array.isArray(messageParam)) {
    return messageParam.map(message => (
      <p key={message}>{message}</p>
    ))
  } else {
    return <p>{messageParam}</p>
  }
}