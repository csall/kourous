export type PrayerPreset = {
  id: string;
  name: string | { fr: string; en: string };
  description: string | { fr: string; en: string };
  totalBeads: number;
  cycles: number;
  sequence: Array<{
    label: string | { fr: string; en: string };
    repetitions: number;
    transliteration?: string | { fr: string; en: string };
  }>;
};

export const prayerPresets: PrayerPreset[] = [
  {
    id: "tasbih-post-priere",
    name: { fr: "Tasbih après la Prière", en: "Tasbih after Prayer" },
    description: {
      fr: "La sunna classique après chaque prière obligatoire : 33 Gloire, 33 Louange et 33/34 Grandeur.",
      en: "The classic Sunnah after every obligatory prayer: 33 Glory, 33 Praise, and 33/34 Greatness."
    },
    totalBeads: 99,
    cycles: 1,
    sequence: [
      {
        label: "Subḥān Allāh",
        transliteration: { fr: "Gloire à Allah", en: "Glory be to Allah" },
        repetitions: 33
      },
      {
        label: "Al-ḥamdu li-llāh",
        transliteration: { fr: "Louange à Allah", en: "Praise be to Allah" },
        repetitions: 33
      },
      {
        label: "Allāhu ʾAkbar",
        transliteration: { fr: "Allah est le plus Grand", en: "Allah is the Greatest" },
        repetitions: 33
      },
    ],
  },
  {
    id: "tasbih-fatima",
    name: { fr: "Tasbih de Fâtima", en: "Tasbih of Fatima" },
    description: {
      fr: "Recommandé avant de dormir pour la force et la sérénité intérieure.",
      en: "Recommended before sleeping for strength and inner serenity."
    },
    totalBeads: 100,
    cycles: 1,
    sequence: [
      { label: "Allāhu ʾAkbar", repetitions: 34 },
      { label: "Al-ḥamdu li-llāh", repetitions: 33 },
      { label: "Subḥān Allāh", repetitions: 33 },
    ],
  },
  {
    id: "protection-matin",
    name: { fr: "Protection du Matin", en: "Morning Protection" },
    description: {
      fr: "Courtes sourates protectrices à réciter 3 fois chacune au lever du soleil.",
      en: "Short protective surahs to recite 3 times each at sunrise."
    },
    totalBeads: 9,
    cycles: 1,
    sequence: [
      { label: { fr: "Al-Ikhlās (La Pureté)", en: "Al-Ikhlas (Purity)" }, repetitions: 3 },
      { label: { fr: "Al-Falaq (L'Aube)", en: "Al-Falaq (Dawn)" }, repetitions: 3 },
      { label: { fr: "An-Nās (Les Hommes)", en: "An-Nas (Mankind)" }, repetitions: 3 },
    ],
  },
];
