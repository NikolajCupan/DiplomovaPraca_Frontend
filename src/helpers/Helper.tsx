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
