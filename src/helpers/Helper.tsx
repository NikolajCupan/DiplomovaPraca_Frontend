export function translateFrequency(frequency: string): string {
    switch (frequency.toLowerCase()) {
        case "hourly":
            return "hodinová";
        case "daily":
            return "denná";
        case "weekly":
            return "týždenná";
        case "monthly":
            return "mesačná";
        case "quarterly":
            return "štvrťročná";
        case "yearly":
            return "ročná";
        default:
            return frequency;
    }
}

export function formatDate(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const hour = date.getHours().toString();

    return `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}-${hour.padStart(2, "0")}`;
}

export function getPreviousDate(date: Date, frequency: string): Date {
    const newDate = new Date(date);

    switch (frequency.toLowerCase()) {
        case "hourly":
            newDate.setHours(newDate.getHours() - 1);
            break;
        case "daily":
            newDate.setDate(newDate.getDate() - 1);
            break;
        case "weekly":
            newDate.setDate(newDate.getDate() - 7);
            break;
        case "monthly":
            newDate.setMonth(newDate.getMonth() - 1);
            break;
        case "quarterly":
            newDate.setMonth(newDate.getMonth() - 3);
            break;
        case "yearly":
            newDate.setFullYear(newDate.getFullYear() - 1);
            break;
        default:
            throw new Error(`Invalid frequency: ${frequency}`);
    }

    return newDate;
}

export function getNextDate(date: Date, frequency: string): Date {
    const newDate = new Date(date);

    switch (frequency.toLowerCase()) {
        case "hourly":
            newDate.setHours(newDate.getHours() + 1);
            break;
        case "daily":
            newDate.setDate(newDate.getDate() + 1);
            break;
        case "weekly":
            newDate.setDate(newDate.getDate() + 7);
            break;
        case "monthly":
            newDate.setMonth(newDate.getMonth() + 1);
            break;
        case "quarterly":
            newDate.setMonth(newDate.getMonth() + 3);
            break;
        case "yearly":
            newDate.setFullYear(newDate.getFullYear() + 1);
            break;
        default:
            throw new Error(`Invalid frequency: ${frequency}`);
    }

    return newDate;
}

export function stringToDate(string: string): Date {
    const year = Number(string.substring(0, 4));
    const month = Number(string.substring(5, 7));
    const day = Number(string.substring(8, 10));
    const hour = Number(string.substring(11, 13));

    let date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour);

    return date;
}

export function timeout(delayMs: number) {
    return new Promise((res) => setTimeout(res, delayMs));
}
