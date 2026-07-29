export const toStr = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function getWeeks(year, month) {
  const weeks = new Map();
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const monday = new Date(d);
      monday.setDate(d.getDate() - (dayOfWeek - 1));
      const weekKey = toStr(monday);
      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, [null, null, null, null, null]);
      }
      weeks.get(weekKey)[dayOfWeek - 1] = new Date(d);
    }

    d.setDate(d.getDate() + 1);
  }
  return [...weeks.values()];
}

export function getWeekdayOccurrence(date) {
  return Math.floor((date.getDate() - 1) / 7) + 1;
}

export function findNthWeekday(year, month, weekday, n) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (weekday - firstDay + 7) % 7;
  const nDate = 1 + offset + (n - 1) * 7;
  return nDate <= new Date(year, month + 1, 0).getDate()
    ? new Date(year, month, nDate)
    : null;
}
