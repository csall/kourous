import { Invocation, InvocationGroup } from "@/lib/store/invocationStore";

export const defaultInvocations: Invocation[] = [
    // LES BASIQUES (Tahlil, Tasbih, Tahmid, Takbir)
    {
        id: "sys-subhan-allah",
        name: "Subḥān Allāh",
        description: {
            fr: "Gloire à Allah. Pour exalter la perfection divine et purifier son cœur.",
            en: "Glory be to Allah. To exalt divine perfection and purify the heart."
        },
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-alhamdulillah",
        name: "Al-ḥamdu li-llāh",
        description: {
            fr: "Louange à Allah. Expression de gratitude infinie pour tous les bienfaits reçus.",
            en: "Praise be to Allah. Expression of infinite gratitude for all blessings received."
        },
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-allahu-akbar",
        name: "Allāhu ʾAkbar",
        description: {
            fr: "Allah est le plus Grand. Rappelle que Dieu transcende tout souci ou difficulté.",
            en: "Allah is the Greatest. Reminds that God transcends every worry or difficulty."
        },
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-la-ilaha-illallah",
        name: "Lā ʾilāha ʾillā llāh",
        description: {
            fr: "Il n'y a de divinité qu'Allah. La meilleure des paroles et la clé du Paradis.",
            en: "There is no god but Allah. The best of words and the key to Paradise."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // REPENTIR & PARDON (Istighfar)
    {
        id: "sys-astaghfirullah",
        name: "ʾAstaghfiru llāh",
        description: {
            fr: "Je demande pardon à Allah. Ouvre les portes de la subsistance et apaise l'esprit.",
            en: "I seek forgiveness from Allah. Opens the doors of sustenance and calms the mind."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-rabbi-ighfir-li",
        name: "Rabbi ighfir lī wa tub ʿalayya",
        description: {
            fr: "Seigneur pardonne-moi et accepte mon repentir. Une formule prophétique répétée souvent.",
            en: "Lord forgive me and accept my repentance. A prophetic formula often repeated."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-yunus-dua",
        name: "Lā ʾilāha ʾillā ʾanta subḥānaka ʾinnī kuntu mina ẓ-ẓālimīn",
        description: {
            fr: "Invocation de Jonas (Yunus). Pour la délivrance des situations de détresse.",
            en: "Invocation of Jonah (Yunus). For deliverance from distressful situations."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // FORCE & PROTECTION
    {
        id: "sys-la-hawla",
        name: "Lā ḥawla wa lā quwwata ʾillā bi-llāh",
        description: {
            fr: "Il n'y a de force ni de puissance qu'en Allah. Un trésor du Paradis pour surmonter les épreuves.",
            en: "There is no power nor strength except with Allah. A treasure of Paradise to overcome trials."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-hasbunallah",
        name: "Ḥasbunā llāhu wa niʿma l-wakīl",
        description: {
            fr: "Allah nous suffit, Il est le meilleur garant. Pour la confiance totale en Dieu face aux difficultés.",
            en: "Allah is sufficient for us, and He is the best disposer of affairs. For total trust in God facing difficulties."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // LOUANGES SPÉCIFIQUES
    {
        id: "sys-subhanallahi-wa-bihamdihi",
        name: "Subḥāna llāhi wa bi-ḥamdihi",
        description: {
            fr: "Gloire et louange à Allah. Celui qui le dit 100 fois par jour, ses péchés sont effacés.",
            en: "Glory and praise be to Allah. Whoever says it 100 times a day, their sins are wiped away."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-subhanallahil-azim",
        name: "Subḥāna llāhi l-ʿAẓīm",
        description: {
            fr: "Gloire à Allah l'Immense. Une parole légère sur la langue mais lourde sur la balance.",
            en: "Glory be to Allah, the Magnificent. A word light on the tongue but heavy on the scales."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // SALAWAT (Prières sur le Prophète)
    {
        id: "sys-salawat-short",
        name: "Allāhumma ṣalli ʿalā Sayyidinā Muḥammad",
        description: {
            fr: "Prières sur le Prophète ﷺ. Source de bénédictions et d'apaisement des soucis.",
            en: "Prayers upon the Prophet ﷺ. A source of blessings and relief from worries."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-salawat-ibrahimiyyah",
        name: "As-ṣalātu l-Ibrāhīmiyyah",
        description: {
            fr: "La prière Abrahamique complète, telle que récitée dans le Tashahhud.",
            en: "The complete Abrahamic prayer, as recited in the Tashahhud."
        },
        repetitions: 10,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // MAÎTRE DU PARDON
    {
        id: "sys-sayyid-al-istighfar",
        name: "Sayyid al-Istighfār",
        description: {
            fr: "Le maître de la demande de pardon. Une invocation immense pour le Paradis.",
            en: "The master of seeking forgiveness. A momentous invocation for Paradise."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // CORAN (Sourates Protectrices)
    {
        id: "sys-ayat-al-kursi",
        name: "Āyat al-Kursī",
        description: {
            fr: "Le Verset du Trône. Le plus grand verset du Coran pour une protection totale.",
            en: "The Throne Verse. The greatest verse of the Quran for total protection."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ikhlas",
        name: "Al-Ikhlās (La Pureté)",
        description: {
            fr: "Dis : Il est Allah, Unique. Sourate 112.",
            en: "Say: He is Allah, the One. Surah 112."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-falaq",
        name: "Al-Falaq (L'Aube)",
        description: {
            fr: "Dis : Je cherche protection auprès du Seigneur de l'aube naissante. Sourate 113.",
            en: "Say: I seek refuge with the Lord of the dawn. Surah 113."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-nas",
        name: "An-Nās (Les Hommes)",
        description: {
            fr: "Dis : Je cherche protection auprès du Seigneur des hommes. Sourate 114.",
            en: "Say: I seek refuge with the Lord of mankind. Surah 114."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },

    // PROTECTION & PRÉSERVATION
    {
        id: "sys-bismillah-ladi",
        name: "Bismi llāhi lladhī lā yaḍurru",
        description: {
            fr: "Au nom d'Allah dont le nom protège de tout mal sur terre et au ciel.",
            en: "In the name of Allah, whose name protects from all harm on earth and in heaven."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ya-hayyu",
        name: "Yā Ḥayyu yā Qayyūm",
        description: {
            fr: "Ô Vivant, Ô Subsistant par Soi-même. Pour la demande de secours divin.",
            en: "O Ever-Living, O Self-Sustaining. To seek divine help."
        },
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-hasbiyallah",
        name: "Ḥasbiya llāhu lā ʾilāha ʾillā huwa",
        description: {
            fr: "Allah me suffit, Il est mon seul Dieu. 7 fois matin et soir suffit contre les soucis.",
            en: "Allah is sufficient for me, He is my only God. 7 times morning and evening is enough against worries."
        },
        repetitions: 7,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-afiyah",
        name: "Allāhumma ʾinnī ʾasʾaluka l-ʿāfiyah",
        description: {
            fr: "Seigneur, je Te demande la préservation (Santé, Foi, Vie).",
            en: "O Allah, I ask You for well-being (Health, Faith, Life)."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-mashallah",
        name: "Mā shāʾa llāh, lā quwwata ʾillā bi-llāh",
        description: {
            fr: "Ce qu'Allah veut [se produit], il n'est de force que par Allah.",
            en: "What Allah wills [happens], there is no power except through Allah."
        },
        repetitions: 33,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-subhanallahi-adada",
        name: "Subḥāna llāhi wa bi-ḥamdihi, ʿadada khalqihi",
        description: {
            fr: "Gloire et louange à Allah, autant de fois qu'il y a de créatures... (Invocation de Juwayriyah)",
            en: "Glory and praise be to Allah, as many times as the number of His creation... (Invocation of Juwayriyah)"
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-la-ilaha-illallah-wahdahu",
        name: "Lā ʾilāha ʾillā llāhu waḥdahu lā sharīka lah",
        description: {
            fr: "Il n'y a de divinité qu'Allah, Seul et sans associé... 100 fois équivaut à affranchir 10 esclaves.",
            en: "There is no god but Allah, alone and without partner... 100 times is equivalent to freeing 10 slaves."
        },
        repetitions: 100,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ya-hayyu-bi-rahmatika",
        name: "Yā Ḥayyu yā Qayyūm bi-raḥmatika ʾastaghīth",
        description: {
            fr: "Ô Vivant, Ô Subsistant, par Ta miséricorde je Te demande secours.",
            en: "O Ever-Living, O Self-Sustaining, by Your mercy I seek help."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-bismillah-tawakkaltu",
        name: "Bismi llāhi tawakkaltu ʿalā llāh",
        description: {
            fr: "Au nom d'Allah, je m'en remets à Allah. Pour sortir de chez soi en toute sécurité.",
            en: "In the name of Allah, I put my trust in Allah. To leave the house in safety."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-allahumma-antas-salam",
        name: "Allāhumma ʾanta s-Salām wa minka s-Salām",
        description: {
            fr: "Seigneur, Tu es la Paix et la Paix vient de Toi. À dire après la prière.",
            en: "O Allah, You are Peace and from You comes peace. To be said after prayer."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-ilman-nafian",
        name: "Allāhumma ʾinnī ʾasʾaluka ʿilman nāfiʿan",
        description: {
            fr: "Seigneur, je Te demande une science utile, une subsistance licite et une œuvre acceptée.",
            en: "O Allah, I ask You for beneficial knowledge, lawful provision and acceptable deeds."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-subhanal-malikil-quddus",
        name: "Subḥāna l-Maliki l-Quddūs",
        description: {
            fr: "Gloire au Souverain, le Très Saint. À dire 3 fois après la prière du Witr.",
            en: "Glory be to the Sovereign, the Most Holy. To be said 3 times after the Witr prayer."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-morning-praise",
        name: "Allāhumma bika ʾaṣbaḥnā wa bika ʾamsaynā",
        description: {
            fr: "Seigneur, c'est par Toi que nous nous retrouvons au matin et au soir. Invocation matinale.",
            en: "O Allah, by You we enter the morning and by You we enter the evening. Morning invocation."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-evening-praise",
        name: "Allāhumma bika ʾamsaynā wa bika ʾaṣbaḥnā",
        description: {
            fr: "Seigneur, c'est par Toi que nous nous retrouvons au soir et au matin. Invocation du soir.",
            en: "O Allah, by You we enter the evening and by You we enter the morning. Evening invocation."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-gratitude-morning",
        name: "Allāhumma mā ʾaṣbaḥa bī min niʿmatin",
        description: {
            fr: "Ô Allah, tout bienfait qui m'arrive ce matin ne vient que de Toi Seul. Reconnaissance du jour.",
            en: "O Allah, whatever blessing has come to me this morning is from You alone. Daily gratitude."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-protection-anxiety",
        name: "Allāhumma ʾinnī ʾaʿūdhu bika minal-hammi wal-ḥazan",
        description: {
            fr: "Ô Allah, je cherche protection contre les soucis, la tristesse et l'incapacité. Pour l'apaisement.",
            en: "O Allah, I seek refuge in You from anxiety, sorrow, and helplessness. For inner peace."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-protection-evil",
        name: "ʾAʿūdhu bi-kalimāti llāhi t-tāmmāti min sharri mā khalaq",
        description: {
            fr: "Je cherche protection par les paroles parfaites d'Allah contre le mal de Ses créatures.",
            en: "I seek refuge in the perfect words of Allah from the evil of what He has created."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-contentment",
        name: "Raḍītu bi-llāhi Rabban wa bil-ʾIslāmi dīnan",
        description: {
            fr: "Je suis satisfait d'Allah comme Seigneur et de l'Islam comme religion. 3 fois matin et soir.",
            en: "I am pleased with Allah as my Lord and with Islam as my religion. 3 times morning and evening."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-before-sleep",
        name: "Bismika llāhumma ʾamūtu wa ʾaḥyā",
        description: {
            fr: "En Ton nom Ô Allah, je meurs et je vis. À dire avant de s'endormir.",
            en: "In Your name, O Allah, I die and I live. To be said before falling asleep."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-after-sleep",
        name: "Al-ḥamdu li-llāhi lladhī ʾaḥyānā baʿda mā ʾamātanā",
        description: {
            fr: "Louange à Allah qui nous a rendu la vie après nous avoir fait mourir. Au réveil.",
            en: "Praise be to Allah who has given us life after causing us to die. Upon waking up."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-travel",
        name: "Subḥāna lladhī sakhkhara lanā hadhā",
        description: {
            fr: "Gloire à Celui qui a mis ceci à notre service. Invocation pour le voyage.",
            en: "Glory be to Him Who has placed this at our service. Invocation for travel."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-after-prayer-help",
        name: "Allāhumma ʾaʿinnī ʿalā dhikrika wa shukrika",
        description: {
            fr: "Ô Allah, aide-moi à T'évoquer, à Te remercier et à T'adorer de la meilleure manière.",
            en: "O Allah, help me to remember You, to thank You, and to worship You in the best manner."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-dua-light",
        name: "Allāhumma jʿal fī qalbī nūran",
        description: {
            fr: "Ô Allah, mets de la lumière dans mon cœur. Pour la guidance et la clarté.",
            en: "O Allah, place light in my heart. For guidance and clarity."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-dua-parents",
        name: "Rabbi rḥamhumā kamā rabbayānī ṣaghīran",
        description: {
            fr: "Seigneur, fais-leur miséricorde (mes parents) comme ils m'ont élevé petit.",
            en: "My Lord, have mercy upon them (my parents) as they brought me up when I was small."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-barakah-food",
        name: "Allāhumma bārik lanā fīmā razaqtanā",
        description: {
            fr: "Seigneur, bénis ce que Tu nous as accordé et préserve-nous du Feu. Avant le repas.",
            en: "O Allah, bless us in what You have provided us and save us from the punishment of the Fire. Before meals."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-huda-taqwa",
        name: "Allāhumma ʾinnī ʾasʾaluka l-hudā wat-tuqā",
        description: {
            fr: "Seigneur, je Te demande la guidance, la piété, la pudeur et la suffisance.",
            en: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-istighfar-extended",
        name: "ʾAstaghfiru llāha l-ʿAẓīm lladhī lā ʾilāha ʾillā huwa",
        description: {
            fr: "Je demande pardon à Allah l'Immense... À dire 3 fois pour l'effacement des grands péchés.",
            en: "I seek forgiveness from Allah the Magnificent... To be said 3 times for the erasure of major sins."
        },
        repetitions: 3,
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-protect-children",
        name: "Uʿīdhukumā bi-kalimāti llāhi t-tāmmati...",
        description: {
            fr: "Je vous place sous la protection des paroles parfaites d'Allah contre tout démon et tout œil envieux.",
            en: "I seek protection for you in the perfect words of Allah from every devil and every envious eye."
        },
        repetitions: 1,
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];

export const defaultGroups: InvocationGroup[] = [
    {
        id: "sys-grp-post-prayer",
        name: { fr: "Après la Prière (Complet)", en: "After Prayer (Complete)" },
        description: {
            fr: "Invocation complète de la sunna après chaque prière.",
            en: "Complete Sunnah invocation after every prayer."
        },
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
        name: { fr: "Récompenses Immenses", en: "Immense Rewards" },
        description: {
            fr: "Les formules les plus riches en hassanates selon les hadiths authentiques.",
            en: "The formulas richest in rewards according to authentic hadiths."
        },
        invocations: [
            { invocationId: "sys-la-ilaha-illallah-wahdahu", repetitions: 100 },
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-subhanallahi-adada", repetitions: 3 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-leave-home",
        name: { fr: "Sortie de la Maison", en: "Leaving Home" },
        description: {
            fr: "Protection et guidance au moment de sortir.",
            en: "Protection and guidance when leaving the house."
        },
        invocations: [
            { invocationId: "sys-bismillah-tawakkaltu", repetitions: 1 },
            { invocationId: "sys-la-hawla", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-morning-light",
        name: { fr: "Lumière du Matin", en: "Morning Light" },
        description: {
            fr: "Pour illuminer son cœur dès le lever du jour.",
            en: "To illuminate the heart from the break of day."
        },
        invocations: [
            { invocationId: "sys-ilman-nafian", repetitions: 1 },
            { invocationId: "sys-ya-hayyu-bi-rahmatika", repetitions: 3 },
            { invocationId: "sys-afiyah", repetitions: 3 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-baqiyat",
        name: { fr: "Les \"Bāqiyāt aṣ-Ṣāliḥāt\"", en: "The \"Baqiyat as-Salihat\"" },
        description: {
            fr: "Les œuvres durables et les paroles les plus aimées d'Allah.",
            en: "Enduring good deeds and the words most beloved to Allah."
        },
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
        name: { fr: "Protection du Matin", en: "Morning Protection" },
        description: {
            fr: "Verset du Trône et sourates protectrices.",
            en: "Throne Verse and protective surahs."
        },
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
        name: { fr: "Soirée de Sérénité", en: "Evening Serenity" },
        description: {
            fr: "Protection et rappel pour finir la journée en paix.",
            en: "Protection and remembrance to end the day in peace."
        },
        invocations: [
            { invocationId: "sys-sayyid-al-istighfar", repetitions: 1 },
            { invocationId: "sys-hasbiyallah", repetitions: 7 },
            { invocationId: "sys-salawat-short", repetitions: 10 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-night-prot",
        name: { fr: "Protection Nocturne", en: "Night Protection" },
        description: {
            fr: "À réciter avant le sommeil pour une nuit sous protection divine.",
            en: "To be recited before sleep for a night under divine protection."
        },
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
        name: { fr: "Dhikr Essentiel", en: "Essential Dhikr" },
        description: {
            fr: "Les formules capitales pour la purification du cœur.",
            en: "Capital formulas for the purification of the heart."
        },
        invocations: [
            { invocationId: "sys-la-ilaha-illallah", repetitions: 100 },
            { invocationId: "sys-astaghfirullah", repetitions: 100 },
            { invocationId: "sys-salawat-ibrahimiyyah", repetitions: 10 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-fatima",
        name: { fr: "Tasbih de Fâtima", en: "Tasbih of Fatima" },
        description: {
            fr: "Recommandé avant de dormir pour la force et la sérénité.",
            en: "Recommended before sleeping for strength and serenity."
        },
        invocations: [
            { invocationId: "sys-allahu-akbar", repetitions: 34 },
            { invocationId: "sys-alhamdulillah", repetitions: 33 },
            { invocationId: "sys-subhan-allah", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-peaceful-morning",
        name: { fr: "Matin Paisible", en: "Peaceful Morning" },
        description: {
            fr: "Pour commencer la journée avec sérénité et protection.",
            en: "To start the day with serenity and protection."
        },
        invocations: [
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-la-ilaha-illallah", repetitions: 100 },
            { invocationId: "sys-salawat-short", repetitions: 10 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-heart-purif",
        name: { fr: "Purification du Cœur", en: "Heart Purification" },
        description: {
            fr: "Une session intense pour le repentir et l'allègement du cœur.",
            en: "An intense session for repentance and lightening the heart."
        },
        invocations: [
            { invocationId: "sys-astaghfirullah", repetitions: 100 },
            { invocationId: "sys-rabbi-ighfir-li", repetitions: 100 },
            { invocationId: "sys-yunus-dua", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-force-trust",
        name: { fr: "Force et Confiance", en: "Strength and Trust" },
        description: {
            fr: "Pour trouver du courage et s'en remettre à Dieu dans les moments difficiles.",
            en: "To find courage and rely on God during difficult times."
        },
        invocations: [
            { invocationId: "sys-la-hawla", repetitions: 100 },
            { invocationId: "sys-hasbunallah", repetitions: 100 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-inf-gratitude",
        name: { fr: "Gratitude Infinie", en: "Infinite Gratitude" },
        description: {
            fr: "Remercier Allah pour Ses bienfaits innombrables.",
            en: "Thanking Allah for His countless blessings."
        },
        invocations: [
            { invocationId: "sys-alhamdulillah", repetitions: 100 },
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-allahu-akbar", repetitions: 33 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-light-treasures",
        name: { fr: "Les Trésors Légers", en: "Light Treasures" },
        description: {
            fr: "Des paroles légères sur la langue mais lourdes sur la balance.",
            en: "Words light on the tongue but heavy on the scales."
        },
        invocations: [
            { invocationId: "sys-subhanallahi-wa-bihamdihi", repetitions: 100 },
            { invocationId: "sys-subhanallahil-azim", repetitions: 100 },
            { invocationId: "sys-la-ilaha-illallah", repetitions: 100 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-morning-hizb",
        name: { fr: "Matin Complet (Sunna)", en: "Complete Morning (Sunnah)" },
        description: {
            fr: "Le pack complet des invocations matinales authentiques.",
            en: "The complete set of authentic morning invocations."
        },
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
        name: { fr: "Soir Complet (Protection)", en: "Complete Evening (Protection)" },
        description: {
            fr: "La citadelle du croyant pour une nuit sous protection.",
            en: "The fortress of the believer for a night under protection."
        },
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
        name: { fr: "Rituel du Sommeil", en: "Sleep Ritual" },
        description: {
            fr: "Pour un sommeil paisible et protégé des cauchemars.",
            en: "For a peaceful sleep protected from nightmares."
        },
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
        name: { fr: "Soulagement & Paix", en: "Relief & Peace" },
        description: {
            fr: "Pack pour évacuer le stress et les angoisses.",
            en: "Pack to release stress and anxiety."
        },
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
        name: { fr: "Protection Voyage", en: "Travel Protection" },
        description: {
            fr: "À réciter au moment du départ.",
            en: "To be recited upon departure."
        },
        invocations: [
            { invocationId: "sys-travel", repetitions: 1 },
            { invocationId: "sys-bismillah-tawakkaltu", repetitions: 1 },
            { invocationId: "sys-la-hawla", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "sys-grp-family-blessing",
        name: { fr: "Foyer & Famille", en: "Home & Family" },
        description: {
            fr: "Pour la bénédiction de la maison et la protection des enfants.",
            en: "For the blessing of the home and protection of children."
        },
        invocations: [
            { invocationId: "sys-protect-children", repetitions: 1 },
            { invocationId: "sys-dua-parents", repetitions: 1 },
            { invocationId: "sys-barakah-food", repetitions: 1 },
        ],
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];
