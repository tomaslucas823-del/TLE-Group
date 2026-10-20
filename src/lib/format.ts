export function mznFromCents(cents: number) {
  return (cents / 100).toLocaleString("pt-MZ", {
    style: "currency",
    currency: "MZN",
  });
}

/** Alias kept so older call sites still render meticais. */
export const brlFromCents = mznFromCents;

export function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("pt-MZ", { dateStyle: "short", timeStyle: "short" });
}

function stamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

export function googleCalendarUrl(title: string, startsAt: string, place: string) {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    location: place,
    details: "Reunião agendada pela TLE Arquitetura",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function meetingIcs(title: string, startsAt: string, place: string, notes: string) {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TLE Arquitetura//Agenda//PT",
    "BEGIN:VEVENT",
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${place}`,
    `DESCRIPTION:${notes}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
