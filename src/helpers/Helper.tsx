export function translateFrequency(frequency: string) {
    switch (frequency.toLowerCase()) {
        case "hourly":
            return "hodinová";
        case "daily":
            return "denná";
        case "weekly":
            return "týždenná";
        case "monthly":
            return "mesačná";
        case "quaterly":
            return "štvrťročná";
        case "yearly":
            return "ročná";
        default:
            return frequency;
    }
}

export function formatDate(date: Date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const hour = date.getHours().toString();

    return `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}-${hour.padStart(2, "0")}`;
}
