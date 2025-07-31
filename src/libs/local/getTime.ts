export function getHour(): string {
  const d = new Date();
  let h = d.getHours();
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return h < 10 ? "0" + h : h.toString();
}

export function getMinute(): string {
  const d = new Date();
  const m = d.getMinutes();
  return m < 10 ? "0" + m : m.toString();
}

export function getSecond(): string {
  const d = new Date();
  const s = d.getSeconds();
  return s < 10 ? "0" + s : s.toString();
}

export function getAmPm(): "am" | "pm" {
  const d = new Date();
  return d.getHours() >= 12 ? "pm" : "am";
}

export function getTimeString(includeAmPm = false): string {
  const h = getHour();
  const m = getMinute();
  const s = getSecond();
  const ampm = getAmPm();
  return includeAmPm ? `${h}:${m}:${s} ${ampm}` : `${h}:${m}:${s}`;
}
