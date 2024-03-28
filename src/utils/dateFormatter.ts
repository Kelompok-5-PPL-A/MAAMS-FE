export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)

  let hours: number | string = date.getHours()
  let minutes: number | string = date.getMinutes()
  let day: number | string = date.getDate()
  let month: number | string = date.getMonth() + 1

  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  day = day < 10 ? '0' + day : day
  month = month < 10 ? '0' + month : month

  const year = date.getFullYear()

  return `${hours}:${minutes} ${day}/${month}/${year}`
}
