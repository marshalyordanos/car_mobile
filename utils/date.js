export function makeIso(dateStr, timeStr) {
  if (!timeStr) timeStr = "00:00";

  // split and convert AM/PM
  const [time, mer] = timeStr.split(" "); // "10:30", "AM"
  let [hh, mm] = time.split(":").map(Number);

  if (mer?.toUpperCase() === "PM" && hh !== 12) hh += 12;
  if (mer?.toUpperCase() === "AM" && hh === 12) hh = 0;

  const safe = `${dateStr}T${String(hh).padStart(2, "0")}:${mm}:00`; // → ISO-like

  const d = new Date(safe); // safe on all platforms

  return d.toISOString();
}

export function isoToDate(isoStr) {
  const d = new Date(isoStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isoToTime(isoStr) {
  const d = new Date(isoStr);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12
  return `${hours}:${minutes} ${ampm}`;
}
export function isoToDisplay(isoStr) {
  const d = new Date(isoStr);

  // month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const yyyy = d.getFullYear();
  const monthName = months[d.getMonth()];
  const dd = String(d.getDate()).padStart(2, "0");

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  return `${monthName} ${dd}, ${yyyy} ${hours}:${minutes} ${ampm}`;
}

export function isoToDisplayWithOutYear(isoStr) {
  const d = new Date(isoStr);

  // month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const yyyy = d.getFullYear();
  const monthName = months[d.getMonth()];
  const dd = String(d.getDate()).padStart(2, "0");

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  return `${monthName} ${dd} ${hours}:${minutes} ${ampm}`;
}
