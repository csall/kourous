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
    },
    {
        text: "Cherche l'aide d'Allah et ne baisse pas les bras.",
        source: "Hadith"
    },
    {
        text: "Le sourire envers ton frère est une aumône.",
        source: "Hadith"
    },
    {
        text: "Si vous saviez ce que je sais, vous ririez peu et pleureriez beaucoup.",
        source: "Hadith"
    },
    {
        text: "Certes, Allah est Doux et Il aime la douceur.",
        source: "Hadith"
    },
    {
        text: "Craignez Allah là où que vous soyez.",
        source: "Hadith"
    },
    {
        text: "Et quiconque place sa confiance en Allah, Il lui suffit.",
        source: "Coran 65:3"
    },
    {
        text: "Allah facilitera les choses à quiconque facilite celles d'autrui.",
        source: "Hadith"
    },
    {
        text: "Certes, avec la difficulté vient la facilité.",
        source: "Coran 94:6"
    },
    {
        text: "Et patiente, car Allah ne laisse pas perdre la récompense des gens bienfaisants.",
        source: "Coran 11:115"
    },
    {
        text: "Allah est le meilleur des protecteurs.",
        source: "Coran 12:64"
    },
    {
        text: "Ô Allah, je Te demande un savoir utile, un rizq licite et des œuvres agréées.",
        source: "Invocation"
    },
    {
        text: "Le bonheur est dans la satisfaction de ce qu'Allah nous a accordé.",
        source: "Sagesse"
    },
    {
        text: "Ta langue doit rester humide par le rappel d'Allah.",
        source: "Hadith"
    },
    {
        text: "Le monde n'est qu'un pont, traverse-le mais n'y bâtis rien.",
        source: "Sagesse"
    },
    {
        text: "Fais du bien, même si c'est peu, car tu ne sais pas quelle œuvre te fera entrer au Paradis.",
        source: "Sagesse"
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

export function getRandomQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * religiousQuotes.length);
    return religiousQuotes[randomIndex];
}
