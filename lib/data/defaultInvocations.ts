import { Invocation, InvocationGroup } from "@/lib/store/invocationStore";

export const defaultInvocations: Invocation[] = [
    // LES BASIQUES (Tahlil, Tasbih, Tahmid, Takbir)
    {
        id: "sys-subhan-allah",
        name: "Subḥān Allāh",
        description: "Gloire à Allah. Pour exalter la perfection divine et purifier son cœur.",
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-alhamdulillah",
        name: "Al-ḥamdu li-llāh",
        description: "Louange à Allah. Expression de gratitude infinie pour tous les bienfaits reçus.",
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-allahu-akbar",
        name: "Allāhu ʾAkbar",
        description: "Allah est le plus Grand. Rappelle que Dieu transcende tout souci ou difficulté.",
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-la-ilaha-illallah",
        name: "Lā ʾilāha ʾillā llāh",
        description: "Il n'y a de divinité qu'Allah. La meilleure des paroles et la clé du Paradis.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // REPENTIR & PARDON (Istighfar)
    {
        id: "sys-astaghfirullah",
        name: "ʾAstaghfiru llāh",
        description: "Je demande pardon à Allah. Ouvre les portes de la subsistance et apaise l'esprit.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-rabbi-ighfir-li",
        name: "Rabbi ighfir lī wa tub ʿalayya",
        description: "Seigneur pardonne-moi et accepte mon repentir. Une formule prophétique répétée souvent.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-yunus-dua",
        name: "Lā ʾilāha ʾillā ʾanta subḥānaka ʾinnī kuntu mina ẓ-ẓālimīn",
        description: "Invocation de Jonas (Yunus). Pour la délivrance des situations de détresse.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // FORCE & PROTECTION
    {
        id: "sys-la-hawla",
        name: "Lā ḥawla wa lā quwwata ʾillā bi-llāh",
        description: "Il n'y a de force ni de puissance qu'en Allah. Un trésor du Paradis pour surmonter les épreuves.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-hasbunallah",
        name: "Ḥasbunā llāhu wa niʿma l-wakīl",
        description: "Allah nous suffit, Il est le meilleur garant. Pour la confiance totale en Dieu face aux difficultés.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // LOUANGES SPÉCIFIQUES
    {
        id: "sys-subhanallahi-wa-bihamdihi",
        name: "Subḥāna llāhi wa bi-ḥamdihi",
        description: "Gloire et louange à Allah. Celui qui le dit 100 fois par jour, ses péchés sont effacés.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-subhanallahil-azim",
        name: "Subḥāna llāhi l-ʿAẓīm",
        description: "Gloire à Allah l'Immense. Une parole légère sur la langue mais lourde sur la balance.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // SALAWAT (Prières sur le Prophète)
    {
        id: "sys-salawat-short",
        name: "Allāhumma ṣalli ʿalā Sayyidinā Muḥammad",
        description: "Prières sur le Prophète ﷺ. Source de bénédictions et d'apaisement des soucis.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-salawat-ibrahimiyyah",
        name: "As-ṣalātu l-Ibrāhīmiyyah",
        description: "La prière Abrahamique complète, telle que récitée dans le Tashahhud.",
        repetitions: 10,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // MAÎTRE DU PARDON
    {
        id: "sys-sayyid-al-istighfar",
        name: "Sayyid al-Istighfār",
        description: "Le maître de la demande de pardon. Une invocation immense pour le Paradis.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // CORAN (Sourates Protectrices)
    {
        id: "sys-ayat-al-kursi",
        name: "Āyat al-Kursī",
        description: "Le Verset du Trône. Le plus grand verset du Coran pour une protection totale.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ikhlas",
        name: "Al-Ikhlās (La Pureté)",
        description: "Dis : Il est Allah, Unique. Sourate 112.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-falaq",
        name: "Al-Falaq (L'Aube)",
        description: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante. Sourate 113.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-nas",
        name: "An-Nās (Les Hommes)",
        description: "Dis : Je cherche protection auprès du Seigneur des hommes. Sourate 114.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // PROTECTION & PRÉSERVATION
    {
        id: "sys-bismillah-ladi",
        name: "Bismi llāhi lladhī lā yaḍurru...",
        description: "Au nom d'Allah dont le nom protège de tout mal sur terre et au ciel.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ya-hayyu",
        name: "Yā Ḥayyu yā Qayyūm",
        description: "Ô Vivant, Ô Subsistant par Soi-même. Pour la demande de secours divin.",
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-hasbiyallah",
        name: "Ḥasbiya llāhu lā ʾilāha ʾillā huwa",
        description: "Allah me suffit, Il est mon seul Dieu. 7 fois matin et soir suffit contre les soucis.",
        repetitions: 7,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-afiyah",
        name: "Allāhumma ʾinnī ʾasʾaluka l-ʿāfiyah",
        description: "Seigneur, je Te demande la préservation (Santé, Foi, Vie).",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-mashallah",
        name: "Mā shāʾa llāh, lā quwwata ʾillā bi-llāh",
        description: "Ce qu'Allah veut [se produit], il n'est de force que par Allah.",
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
];

export const defaultGroups: InvocationGroup[] = [
    {
        id: "sys-grp-post-prayer",
        name: "Tasbih après la Prière",
        description: "La sunna classique après chaque prière obligatoire.",
        invocations: [
            { invocationId: "sys-subhan-allah", repetitions: 33 },
            { invocationId: "sys-alhamdulillah", repetitions: 33 },
            { invocationId: "sys-allahu-akbar", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-baqiyat",
        name: "Les \"Bāqiyāt aṣ-Ṣāliḥāt\"",
        description: "Les œuvres durables et les paroles les plus aimées d'Allah.",
        invocations: [
            { invocationId: "sys-subhan-allah", repetitions: 33 },
            { invocationId: "sys-alhamdulillah", repetitions: 33 },
            { invocationId: "sys-la-ilaha-illallah", repetitions: 33 },
            { invocationId: "sys-allahu-akbar", repetitions: 33 },
            { invocationId: "sys-la-hawla", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-morning-prot",
        name: "Protection du Matin",
        description: "Verset du Trône et sourates protectrices.",
        invocations: [
            { invocationId: "sys-ayat-al-kursi", repetitions: 1 },
            { invocationId: "sys-ikhlas", repetitions: 3 },
            { invocationId: "sys-falaq", repetitions: 3 },
            { invocationId: "sys-nas", repetitions: 3 },
            { invocationId: "sys-bismillah-ladi", repetitions: 3 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-evening-serenity",
        name: "Soirée de Sérénité",
        description: "Protection et rappel pour finir la journée en paix.",
        invocations: [
            { invocationId: "sys-sayyid-al-istighfar", repetitions: 1 },
            { invocationId: "sys-hasbiyallah", repetitions: 7 },
            { invocationId: "sys-salawat-short", repetitions: 10 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-night-prot",
        name: "Protection Nocturne",
        description: "À réciter avant le sommeil pour une nuit sous protection divine.",
        invocations: [
            { invocationId: "sys-ayat-al-kursi", repetitions: 1 },
            { invocationId: "sys-subhan-allah", repetitions: 33 },
            { invocationId: "sys-alhamdulillah", repetitions: 33 },
            { invocationId: "sys-allahu-akbar", repetitions: 34 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-essential-dhikr",
        name: "Dhikr Essentiel",
        description: "Les formules capitales pour la purification du cœur.",
        invocations: [
            { invocationId: "sys-la-ilaha-illallah", repetitions: 100 },
            { invocationId: "sys-astaghfirullah", repetitions: 100 },
            { invocationId: "sys-salawat-ibrahimiyyah", repetitions: 10 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-fatima",
        name: "Tasbih de Fâtima",
        description: "Recommandé avant de dormir pour la force et la sérénité.",
        invocations: [
            { invocationId: "sys-allahu-akbar", repetitions: 34 },
            { invocationId: "sys-alhamdulillah", repetitions: 33 },
            { invocationId: "sys-subhan-allah", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-peaceful-morning",
        name: "Matin Paisible",
        description: "Pour commencer la journée avec sérénité et protection.",
        invocations: [
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-la-ilaha-illallah", repetitions: 100 },
            { invocationId: "sys-salawat-short", repetitions: 10 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-heart-purif",
        name: "Purification du Cœur",
        description: "Une session intense pour le repentir et l'allègement du cœur.",
        invocations: [
            { invocationId: "sys-astaghfirullah", repetitions: 100 },
            { invocationId: "sys-rabbi-ighfir-li", repetitions: 100 },
            { invocationId: "sys-yunus-dua", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-force-trust",
        name: "Force et Confiance",
        description: "Pour trouver du courage et s'en remettre à Dieu dans les moments difficiles.",
        invocations: [
            { invocationId: "sys-la-hawla", repetitions: 100 },
            { invocationId: "sys-hasbunallah", repetitions: 100 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-inf-gratitude",
        name: "Gratitude Infinie",
        description: "Remercier Allah pour Ses bienfaits innombrables.",
        invocations: [
            { invocationId: "sys-alhamdulillah", repetitions: 100 },
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-allahu-akbar", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-light-treasures",
        name: "Les Trésors Légers",
        description: "Des paroles légères sur la langue mais lourdes sur la balance.",
        invocations: [
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-subhanallahil-azim", repetitions: 100 },
            { invocationId: "sys-la-ilaha-illallah", repetitions: 100 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];
