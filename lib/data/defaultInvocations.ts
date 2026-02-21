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
    {
        name: "As-ṣalātu l-Ibrāhīmiyyah",
        description: "La prière Abrahamique complète, telle que récitée dans le Tashahhud.",
        repetitions: 10,
    },

    // MAÎTRE DU PARDON
    {
        name: "Sayyid al-Istighfār",
        description: "Le maître de la demande de pardon. Une invocation immense pour le Paradis.",
        repetitions: 3,
    },

    // CORAN (Sourates Protectrices)
    {
        name: "Āyat al-Kursī",
        description: "Le Verset du Trône. Le plus grand verset du Coran pour une protection totale.",
        repetitions: 1,
    },
    {
        name: "Al-Ikhlās (La Pureté)",
        description: "Dis : Il est Allah, Unique. Sourate 112.",
        repetitions: 3,
    },
    {
        name: "Al-Falaq (L'Aube)",
        description: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante. Sourate 113.",
        repetitions: 3,
    },
    {
        name: "An-Nās (Les Hommes)",
        description: "Dis : Je cherche protection auprès du Seigneur des hommes. Sourate 114.",
        repetitions: 3,
    },

    // PROTECTION & PRÉSERVATION
    {
        name: "Bismi llāhi lladhī lā yaḍurru...",
        description: "Au nom d'Allah dont le nom protège de tout mal sur terre et au ciel.",
        repetitions: 3,
    },
    {
        name: "Yā Ḥayyu yā Qayyūm",
        description: "Ô Vivant, Ô Subsistant par Soi-même. Pour la demande de secours divin.",
        repetitions: 33,
    },
    {
        name: "Ḥasbiya llāhu lā ʾilāha ʾillā huwa",
        description: "Allah me suffit, Il est mon seul Dieu. 7 fois matin et soir suffit contre les soucis.",
        repetitions: 7,
    },
    {
        name: "Allāhumma ʾinnī ʾasʾaluka l-ʿāfiyah",
        description: "Seigneur, je Te demande la préservation (Santé, Foi, Vie).",
        repetitions: 3,
    },
    {
        name: "Mā shāʾa llāh, lā quwwata ʾillā bi-llāh",
        description: "Ce qu'Allah veut [se produit], il n'est de force que par Allah.",
        repetitions: 33,
    },
];

export const defaultGroups: Array<{
    name: string;
    description: string;
    invocationNames: Array<{ name: string; repetitions: number }>;
}> = [
        {
            name: "Tasbih après la Prière",
            description: "La sunna classique après chaque prière obligatoire.",
            invocationNames: [
                { name: "Subḥān Allāh", repetitions: 33 },
                { name: "Al-ḥamdu li-llāh", repetitions: 33 },
                { name: "Allāhu ʾAkbar", repetitions: 33 },
            ],
        },
        {
            name: "Les \"Bāqiyāt aṣ-Ṣāliḥāt\"",
            description: "Les œuvres durables et les paroles les plus aimées d'Allah.",
            invocationNames: [
                { name: "Subḥān Allāh", repetitions: 33 },
                { name: "Al-ḥamdu li-llāh", repetitions: 33 },
                { name: "Lā ʾilāha ʾillā llāh", repetitions: 33 },
                { name: "Allāhu ʾAkbar", repetitions: 33 },
                { name: "Lā ḥawla wa lā quwwata ʾillā bi-llāh", repetitions: 33 },
            ],
        },
        {
            name: "Protection du Matin",
            description: "Verset du Trône et sourates protectrices.",
            invocationNames: [
                { name: "Āyat al-Kursī", repetitions: 1 },
                { name: "Al-Ikhlās (La Pureté)", repetitions: 3 },
                { name: "Al-Falaq (L'Aube)", repetitions: 3 },
                { name: "An-Nās (Les Hommes)", repetitions: 3 },
                { name: "Bismi llāhi lladhī lā yaḍurru...", repetitions: 3 },
            ],
        },
        {
            name: "Soirée de Sérénité",
            description: "Protection et rappel pour finir la journée en paix.",
            invocationNames: [
                { name: "Sayyid al-Istighfār", repetitions: 1 },
                { name: "Ḥasbiya llāhu lā ʾilāha ʾillā huwa", repetitions: 7 },
                { name: "Allāhumma ṣalli ʿalā Sayyidinā Muḥammad", repetitions: 10 },
            ],
        },
        {
            name: "Protection Nocturne",
            description: "À réciter avant le sommeil pour une nuit sous protection divine.",
            invocationNames: [
                { name: "Āyat al-Kursī", repetitions: 1 },
                { name: "Subḥān Allāh", repetitions: 33 },
                { name: "Al-ḥamdu li-llāh", repetitions: 33 },
                { name: "Allāhu ʾAkbar", repetitions: 34 },
            ],
        },
        {
            name: "Dhikr Essentiel",
            description: "Les formules capitales pour la purification du cœur.",
            invocationNames: [
                { name: "Lā ʾilāha ʾillā llāh", repetitions: 100 },
                { name: "ʾAstaghfiru llāh", repetitions: 100 },
                { name: "As-ṣalātu l-Ibrāhīmiyyah", repetitions: 10 },
            ],
        },
        {
            name: "Tasbih de Fâtima",
            description: "Recommandé avant de dormir pour la force et la sérénité.",
            invocationNames: [
                { name: "Allāhu ʾAkbar", repetitions: 34 },
                { name: "Al-ḥamdu li-llāh", repetitions: 33 },
                { name: "Subḥān Allāh", repetitions: 33 },
            ],
        },
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
