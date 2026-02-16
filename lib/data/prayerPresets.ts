export type PrayerPreset = {
  id: string;
  name: string;
  description: string;
  totalBeads: number;
  cycles: number;
  sequence: Array<{
    label: string;
    repetitions: number;
    transliteration?: string;
  }>;
};

export const prayerPresets: PrayerPreset[] = [
  {
    id: "tasbih-post-priere",
    name: "Tasbih après la Prière",
    description: "La sunna classique après chaque prière obligatoire : 33 Gloire, 33 Louange et 33/34 Grandeur.",
    totalBeads: 99,
    cycles: 1,
    sequence: [
      { label: "Subḥān Allāh", transliteration: "Gloire à Allah", repetitions: 33 },
      { label: "Al-ḥamdu li-llāh", transliteration: "Louange à Allah", repetitions: 33 },
      { label: "Allāhu ʾAkbar", transliteration: "Allah est le plus Grand", repetitions: 33 },
    ],
  },
  {
    id: "tasbih-fatima",
    name: "Tasbih de Fâtima",
    description: "Recommandé avant de dormir pour la force et la sérénité intérieure.",
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
    name: "Protection du Matin",
    description: "Courtes sourates protectrices à réciter 3 fois chacune au lever du soleil.",
    totalBeads: 9,
    cycles: 1,
    sequence: [
      { label: "Al-Ikhlās (La Pureté)", repetitions: 3 },
      { label: "Al-Falaq (L'Aube)", repetitions: 3 },
      { label: "An-Nās (Les Hommes)", repetitions: 3 },
    ],
  },
];
