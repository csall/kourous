import { Invocation, InvocationGroup } from "@/lib/store/invocationStore";

// Invocations par défaut
export const defaultInvocations: Omit<Invocation, "id" | "createdAt">[] = [
    // Tasbih classique
    {
        name: "Subḥān Allāh",
        repetitions: 33,
    },
    {
        name: "Al-ḥamdu li-llāh",
        repetitions: 33,
    },
    {
        name: "Allāhu ʾAkbar",
        repetitions: 34,
    },

    // Invocations essentielles
    {
        name: "Lā ʾilāha ʾillā llāh",
        repetitions: 100,
    },
    {
        name: "ʾAstaghfiru llāh",
        repetitions: 100,
    },
    {
        name: "Lā ḥawla wa lā quwwata ʾillā bi-llāh",
        repetitions: 100,
    },

    // Salawat
    {
        name: "Ṣalāt ʿalā n-Nabī",
        repetitions: 100,
    },

    // Dhikr du matin et du soir
    {
        name: "Āyat al-Kursī",
        repetitions: 1,
    },
    {
        name: "Qul huwa llāhu ʾaḥad",
        repetitions: 3,
    },
    {
        name: "Qul ʾaʿūdhu bi-rabbi l-falaq",
        repetitions: 3,
    },
    {
        name: "Qul ʾaʿūdhu bi-rabbi n-nās",
        repetitions: 3,
    },

    // Invocations spécifiques
    {
        name: "Lā ʾilāha ʾillā llāhu waḥdahu",
        repetitions: 10,
    },
    {
        name: "Subḥāna llāhi wa bi-ḥamdihi",
        repetitions: 100,
    },
    {
        name: "Subḥāna llāhi l-ʿaẓīm",
        repetitions: 100,
    },
];

// Groupes par défaut
export const defaultGroups: Array<{
    name: string;
    description: string;
    invocationNames: Array<{ name: string; repetitions: number }>;
}> = [
        {
            name: "Tasbih après la prière",
            description: "Tasbih classique 33-33-34",
            invocationNames: [
                { name: "Subḥān Allāh", repetitions: 33 },
                { name: "Al-ḥamdu li-llāh", repetitions: 33 },
                { name: "Allāhu ʾAkbar", repetitions: 34 },
            ],
        },
        {
            name: "Tasbih de Fâtima",
            description: "Recommandé avant de dormir",
            invocationNames: [
                { name: "Allāhu ʾAkbar", repetitions: 34 },
                { name: "Al-ḥamdu li-llāh", repetitions: 33 },
                { name: "Subḥān Allāh", repetitions: 33 },
            ],
        },
        {
            name: "Adhkār du matin",
            description: "Invocations recommandées après Fajr",
            invocationNames: [
                { name: "Āyat al-Kursī", repetitions: 1 },
                { name: "Qul huwa llāhu ʾaḥad", repetitions: 3 },
                { name: "Qul ʾaʿūdhu bi-rabbi l-falaq", repetitions: 3 },
                { name: "Qul ʾaʿūdhu bi-rabbi n-nās", repetitions: 3 },
                { name: "Subḥāna llāhi wa bi-ḥamdihi", repetitions: 100 },
            ],
        },
        {
            name: "Adhkār du soir",
            description: "Invocations recommandées après Maghrib",
            invocationNames: [
                { name: "Āyat al-Kursī", repetitions: 1 },
                { name: "Qul huwa llāhu ʾaḥad", repetitions: 3 },
                { name: "Qul ʾaʿūdhu bi-rabbi l-falaq", repetitions: 3 },
                { name: "Qul ʾaʿūdhu bi-rabbi n-nās", repetitions: 3 },
                { name: "Subḥāna llāhi wa bi-ḥamdihi", repetitions: 100 },
            ],
        },
        {
            name: "Istighfar intensif",
            description: "Pour le repentir et la purification",
            invocationNames: [
                { name: "ʾAstaghfiru llāh", repetitions: 100 },
                { name: "Lā ḥawla wa lā quwwata ʾillā bi-llāh", repetitions: 100 },
            ],
        },
        {
            name: "Tahlīl 100",
            description: "La ilaha illa Allah 100 fois",
            invocationNames: [
                { name: "Lā ʾilāha ʾillā llāh", repetitions: 100 },
            ],
        },
        {
            name: "Ṣalawāt sur le Prophète",
            description: "Prières sur le Prophète ﷺ",
            invocationNames: [
                { name: "Ṣalāt ʿalā n-Nabī", repetitions: 100 },
            ],
        },
        {
            name: "Dhikr complet",
            description: "Session complète de dhikr",
            invocationNames: [
                { name: "ʾAstaghfiru llāh", repetitions: 100 },
                { name: "Ṣalāt ʿalā n-Nabī", repetitions: 100 },
                { name: "Lā ʾilāha ʾillā llāh", repetitions: 100 },
                { name: "Subḥān Allāh", repetitions: 33 },
                { name: "Al-ḥamdu li-llāh", repetitions: 33 },
                { name: "Allāhu ʾAkbar", repetitions: 34 },
            ],
        },
    ];
