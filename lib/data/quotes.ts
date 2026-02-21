export interface Quote {
    text: string;
    source: string;
}

export const religiousQuotes: Quote[] = [
    {
        text: "En vérité, c'est par le rappel d'Allah que les cœurs s'apaisent.",
        source: "Coran 13:28"
    },
    {
        text: "Quiconque craint Allah, Il lui donnera une issue favorable.",
        source: "Coran 65:2"
    },
    {
        text: "Allah est avec ceux qui sont patients.",
        source: "Coran 2:153"
    },
    {
        text: "Point de divinité à part Toi ! Pureté à Toi ! J'ai été vraiment du nombre des injustes.",
        source: "Coran 21:87"
    },
    {
        text: "Ô Seigneur ! Accorde-nous belle part ici-bas, et belle part dans l'au-delà.",
        source: "Coran 2:201"
    },
    {
        text: "Mon Seigneur, augmente ma science.",
        source: "Coran 20:114"
    },
    {
        text: "Le meilleur d'entre vous est celui qui est le meilleur envers sa famille.",
        source: "Hadith"
    },
    {
        text: "La patience est une lumière.",
        source: "Hadith"
    },
    {
        text: "Allah ne regarde pas vos corps ni vos images, mais Il regarde vos cœurs.",
        source: "Hadith"
    },
    {
        text: "Rends-toi utile aux autres, car l'homme le plus aimé d'Allah est le plus utile aux autres.",
        source: "Hadith"
    }
];

export function getDailyQuote(): Quote {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    return religiousQuotes[dayOfYear % religiousQuotes.length];
}
