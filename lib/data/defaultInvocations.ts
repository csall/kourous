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
    {
        id: "sys-subhanallahi-adada",
        name: "Subḥāna llāhi wa bi-ḥamdihi, ʿadada khalqihi...",
        description: "Gloire et louange à Allah, autant de fois qu'il y a de créatures... (Invocation de Juwayriyah)",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-la-ilaha-illallah-wahdahu",
        name: "Lā ʾilāha ʾillā llāhu waḥdahu lā sharīka lah...",
        description: "Il n'y a de divinité qu'Allah, Seul et sans associé... 100 fois équivaut à affranchir 10 esclaves.",
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ya-hayyu-bi-rahmatika",
        name: "Yā Ḥayyu yā Qayyūm bi-raḥmatika ʾastaghīth",
        description: "Ô Vivant, Ô Subsistant, par Ta miséricorde je Te demande secours.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-bismillah-tawakkaltu",
        name: "Bismi llāhi tawakkaltu ʿalā llāh",
        description: "Au nom d'Allah, je m'en remets à Allah. Pour sortir de chez soi en toute sécurité.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-allahumma-antas-salam",
        name: "Allāhumma ʾanta s-Salām wa minka s-Salām",
        description: "Seigneur, Tu es la Paix et la Paix vient de Toi. À dire après la prière.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ilman-nafian",
        name: "Allāhumma ʾinnī ʾasʾaluka ʿilman nāfiʿan...",
        description: "Seigneur, je Te demande une science utile, une subsistance licite et une œuvre acceptée.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-subhanal-malikil-quddus",
        name: "Subḥāna l-Maliki l-Quddūs",
        description: "Gloire au Souverain, le Très Saint. À dire 3 fois après la prière du Witr.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-morning-praise",
        name: "Allāhumma bika ʾaṣbaḥnā wa bika ʾamsaynā...",
        description: "Seigneur, c'est par Toi que nous nous retrouvons au matin et au soir. Invocation matinale.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-evening-praise",
        name: "Allāhumma bika ʾamsaynā wa bika ʾaṣbaḥnā...",
        description: "Seigneur, c'est par Toi que nous nous retrouvons au soir et au matin. Invocation du soir.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-gratitude-morning",
        name: "Allāhumma mā ʾaṣbaḥa bī min niʿmatin...",
        description: "Ô Allah, tout bienfait qui m'arrive ce matin ne vient que de Toi Seul. Reconnaissance du jour.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-protection-anxiety",
        name: "Allāhumma ʾinnī ʾaʿūdhu bika minal-hammi wal-ḥazan...",
        description: "Ô Allah, je cherche protection contre les soucis, la tristesse et l'incapacité. Pour l'apaisement.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-protection-evil",
        name: "ʾAʿūdhu bi-kalimāti llāhi t-tāmmāti min sharri mā khalaq",
        description: "Je cherche protection par les paroles parfaites d'Allah contre le mal de Ses créatures.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-contentment",
        name: "Raḍītu bi-llāhi Rabban wa bil-ʾIslāmi dīnan...",
        description: "Je suis satisfait d'Allah comme Seigneur et de l'Islam comme religion. 3 fois matin et soir.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-before-sleep",
        name: "Bismika llāhumma ʾamūtu wa ʾaḥyā",
        description: "En Ton nom Ô Allah, je meurs et je vis. À dire avant de s'endormir.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-after-sleep",
        name: "Al-ḥamdu li-llāhi lladhī ʾaḥyānā baʿda mā ʾamātanā...",
        description: "Louange à Allah qui nous a rendu la vie après nous avoir fait mourir. Au réveil.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-travel",
        name: "Subḥāna lladhī sakhkhara lanā hadhā...",
        description: "Gloire à Celui qui a mis ceci à notre service. Invocation pour le voyage.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-after-prayer-help",
        name: "Allāhumma ʾaʿinnī ʿalā dhikrika wa shukrika...",
        description: "Ô Allah, aide-moi à T'évoquer, à Te remercier et à T'adorer de la meilleure manière.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-dua-light",
        name: "Allāhumma jʿal fī qalbī nūran",
        description: "Ô Allah, mets de la lumière dans mon cœur. Pour la guidance et la clarté.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-dua-parents",
        name: "Rabbi rḥamhumā kamā rabbayānī ṣaghīran",
        description: "Seigneur, fais-leur miséricorde (mes parents) comme ils m'ont élevé petit.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-barakah-food",
        name: "Allāhumma bārik lanā fīmā razaqtanā...",
        description: "Seigneur, bénis ce que Tu nous as accordé et préserve-nous du Feu. Avant le repas.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-huda-taqwa",
        name: "Allāhumma ʾinnī ʾasʾaluka l-hudā wat-tuqā...",
        description: "Seigneur, je Te demande la guidance, la piété, la pudeur et la suffisance.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-istighfar-extended",
        name: "ʾAstaghfiru llāha l-ʿAẓīm lladhī lā ʾilāha ʾillā huwa...",
        description: "Je demande pardon à Allah l'Immense... À dire 3 fois pour l'effacement des grands péchés.",
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-protect-children",
        name: "Uʿīdhukumā bi-kalimāti llāhi t-tāmmati...",
        description: "Je vous place sous la protection des paroles parfaites d'Allah contre tout démon et tout œil envieux.",
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];

export const defaultGroups: InvocationGroup[] = [
    {
        id: "sys-grp-post-prayer",
        name: "Après la Prière (Complet)",
        description: "Invocation complète de la sunna après chaque prière.",
        invocations: [
            { invocationId: "sys-astaghfirullah", repetitions: 3 },
            { invocationId: "sys-allahumma-antas-salam", repetitions: 1 },
            { invocationId: "sys-subhan-allah", repetitions: 33 },
            { invocationId: "sys-alhamdulillah", repetitions: 33 },
            { invocationId: "sys-allahu-akbar", repetitions: 33 },
            { invocationId: "sys-la-ilaha-illallah-wahdahu", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-high-rewards",
        name: "Récompenses Immenses",
        description: "Les formules les plus riches en hassanates selon les hadiths authentiques.",
        invocations: [
            { invocationId: "sys-la-ilaha-illallah-wahdahu", repetitions: 100 },
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-subhanallahi-adada", repetitions: 3 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-leave-home",
        name: "Sortie de la Maison",
        description: "Protection et guidance au moment de sortir.",
        invocations: [
            { invocationId: "sys-bismillah-tawakkaltu", repetitions: 1 },
            { invocationId: "sys-la-hawla", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-morning-light",
        name: "Lumière du Matin",
        description: "Pour illuminer son cœur dès le lever du jour.",
        invocations: [
            { invocationId: "sys-ilman-nafian", repetitions: 1 },
            { invocationId: "sys-ya-hayyu-bi-rahmatika", repetitions: 3 },
            { invocationId: "sys-afiyah", repetitions: 3 },
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
    },
    {
        id: "sys-grp-morning-hizb",
        name: "Matin Complet (Sunna)",
        description: "Le pack complet des invocations matinales authentiques.",
        invocations: [
            { invocationId: "sys-after-sleep", repetitions: 1 },
            { invocationId: "sys-ayat-al-kursi", repetitions: 1 },
            { invocationId: "sys-ikhlas", repetitions: 3 },
            { invocationId: "sys-falaq", repetitions: 3 },
            { invocationId: "sys-nas", repetitions: 3 },
            { invocationId: "sys-morning-praise", repetitions: 1 },
            { invocationId: "sys-gratitude-morning", repetitions: 1 },
            { invocationId: "sys-hasbiyallah", repetitions: 7 },
            { invocationId: "sys-subhanallahi-adada", repetitions: 3 },
            { invocationId: "sys-contentment", repetitions: 3 },
            { invocationId: "sys-bismillah-ladi", repetitions: 3 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-evening-hizb",
        name: "Soir Complet (Protection)",
        description: "La citadelle du croyant pour une nuit sous protection.",
        invocations: [
            { invocationId: "sys-evening-praise", repetitions: 1 },
            { invocationId: "sys-ayat-al-kursi", repetitions: 1 },
            { invocationId: "sys-ikhlas", repetitions: 3 },
            { invocationId: "sys-falaq", repetitions: 3 },
            { invocationId: "sys-nas", repetitions: 3 },
            { invocationId: "sys-protection-evil", repetitions: 3 },
            { invocationId: "sys-bismillah-ladi", repetitions: 3 },
            { invocationId: "sys-contentment", repetitions: 3 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-sleep-routine",
        name: "Rituel du Sommeil",
        description: "Pour un sommeil paisible et protégé des cauchemars.",
        invocations: [
            { invocationId: "sys-ayat-al-kursi", repetitions: 1 },
            { invocationId: "sys-ikhlas", repetitions: 3 },
            { invocationId: "sys-falaq", repetitions: 3 },
            { invocationId: "sys-nas", repetitions: 3 },
            { invocationId: "sys-before-sleep", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-distress-relief",
        name: "Soulagement & Paix",
        description: "Pack pour évacuer le stress et les angoisses.",
        invocations: [
            { invocationId: "sys-yunus-dua", repetitions: 10 },
            { invocationId: "sys-protection-anxiety", repetitions: 1 },
            { invocationId: "sys-hasbunallah", repetitions: 10 },
            { invocationId: "sys-la-hawla", repetitions: 10 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-travel-kit",
        name: "Protection Voyage",
        description: "À réciter au moment du départ.",
        invocations: [
            { invocationId: "sys-travel", repetitions: 1 },
            { invocationId: "sys-bismillah-tawakkaltu", repetitions: 1 },
            { invocationId: "sys-la-hawla", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-family-blessing",
        name: "Foyer & Famille",
        description: "Pour la bénédiction de la maison et la protection des enfants.",
        invocations: [
            { invocationId: "sys-protect-children", repetitions: 1 },
            { invocationId: "sys-dua-parents", repetitions: 1 },
            { invocationId: "sys-barakah-food", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];
