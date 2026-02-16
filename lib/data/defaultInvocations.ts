import { Invocation } from "@/lib/store/invocationStore";

export const defaultInvocations: Omit<Invocation, "id" | "createdAt">[] = [
    // LES BASIQUES (Tahlil, Tasbih, Tahmid, Takbir)
    {
        name: "Subḥān Allāh",
        description: "Gloire à Allah. Pour exalter la perfection divine et purifier son cœur.",
        repetitions: 33,
    },
    {
        name: "Al-ḥamdu li-llāh",
        description: "Louange à Allah. Expression de gratitude infinie pour tous les bienfaits reçus.",
        repetitions: 33,
    },
    {
        name: "Allāhu ʾAkbar",
        description: "Allah est le plus Grand. Rappelle que Dieu transcende tout souci ou difficulté.",
        repetitions: 33,
    },
    {
        name: "Lā ʾilāha ʾillā llāh",
        description: "Il n'y a de divinité qu'Allah. La meilleure des paroles et la clé du Paradis.",
        repetitions: 100,
    },

    // REPENTIR & PARDON (Istighfar)
    {
        name: "ʾAstaghfiru llāh",
        description: "Je demande pardon à Allah. Ouvre les portes de la subsistance et apaise l'esprit.",
        repetitions: 100,
    },
    {
        name: "Rabbi ighfir lī wa tub ʿalayya",
        description: "Seigneur pardonne-moi et accepte mon repentir. Une formule prophétique répétée souvent.",
        repetitions: 100,
    },
    {
        name: "Lā ʾilāha ʾillā ʾanta subḥānaka ʾinnī kuntu mina ẓ-ẓālimīn",
        description: "Invocation de Jonas (Yunus). Pour la délivrance des situations de détresse.",
        repetitions: 100,
    },

    // FORCE & PROTECTION
    {
        name: "Lā ḥawla wa lā quwwata ʾillā bi-llāh",
        description: "Il n'y a de force ni de puissance qu'en Allah. Un trésor du Paradis pour surmonter les épreuves.",
        repetitions: 100,
    },
    {
        name: "Ḥasbunā llāhu wa niʿma l-wakīl",
        description: "Allah nous suffit, Il est le meilleur garant. Pour la confiance totale en Dieu face aux difficultés.",
        repetitions: 100,
    },

    // LOUANGES SPÉCIFIQUES
    {
        name: "Subḥāna llāhi wa bi-ḥamdihi",
        description: "Gloire et louange à Allah. Celui qui le dit 100 fois par jour, ses péchés sont effacés.",
        repetitions: 100,
    },
    {
        name: "Subḥāna llāhi l-ʿAẓīm",
        description: "Gloire à Allah l'Immense. Une parole légère sur la langue mais lourde sur la balance.",
        repetitions: 100,
    },

    // SALAWAT (Prières sur le Prophète)
    {
        name: "Allāhumma ṣalli ʿalā Sayyidinā Muḥammad",
        description: "Prières sur le Prophète ﷺ. Source de bénédictions et d'apaisement des soucis.",
        repetitions: 100,
    },
];

export const defaultGroups: Array<{
    name: string;
    description: string;
    invocationNames: Array<{ name: string; repetitions: number }>;
}> = [
        {
            name: "Matin Paisible",
            description: "Pour commencer la journée avec sérénité et protection.",
            invocationNames: [
                { name: "Subḥāna llāhi wa bi-ḥamdihi", repetitions: 100 },
                { name: "Lā ʾilāha ʾillā llāh", repetitions: 100 },
                { name: "Allāhumma ṣalli ʿalā Sayyidinā Muḥammad", repetitions: 10 },
            ],
        },
        {
            name: "Purification du Cœur",
            description: "Une session intense pour le repentir et l'allègement du cœur.",
            invocationNames: [
                { name: "ʾAstaghfiru llāh", repetitions: 100 },
                { name: "Rabbi ighfir lī wa tub ʿalayya", repetitions: 100 },
                { name: "Lā ʾilāha ʾillā ʾanta subḥānaka ʾinnī kuntu mina ẓ-ẓālimīn", repetitions: 33 },
            ],
        },
        {
            name: "Force et Confiance",
            description: "Pour trouver du courage et s'en remettre à Dieu dans les moments difficiles.",
            invocationNames: [
                { name: "Lā ḥawla wa lā quwwata ʾillā bi-llāh", repetitions: 100 },
                { name: "Ḥasbunā llāhu wa niʿma l-wakīl", repetitions: 100 },
            ],
        },
        {
            name: "Gratitude Infinie",
            description: "Remercier Allah pour Ses bienfaits innombrables.",
            invocationNames: [
                { name: "Al-ḥamdu li-llāh", repetitions: 100 },
                { name: "Subḥāna llāhi wa bi-ḥamdihi", repetitions: 100 },
                { name: "Allāhu ʾAkbar", repetitions: 33 },
            ],
        },
        {
            name: "Les Trésors Légers",
            description: "Des paroles légères sur la langue mais lourdes sur la balance.",
            invocationNames: [
                { name: "Subḥāna llāhi wa bi-ḥamdihi", repetitions: 100 },
                { name: "Subḥāna llāhi l-ʿAẓīm", repetitions: 100 },
                { name: "Lā ʾilāha ʾillā llāh", repetitions: 100 },
            ],
        }
    ];
