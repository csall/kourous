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
    id: "dhikr-33",
    name: "Tasbih 33",
    description: "33 Subhanallah • 33 Alhamdulillah • 33 Allahu Akbar",
    totalBeads: 99,
    cycles: 3,
    sequence: [
      { label: "Subḥān Allāh", transliteration: "Subhanallah", repetitions: 33 },
      { label: "Al-ḥamdu li-llāh", transliteration: "Alhamdulillah", repetitions: 33 },
      { label: "Allāhu ʾAkbar", transliteration: "Allahu Akbar", repetitions: 33 },
    ],
  },
  {
    id: "tasbih-fatima",
    name: "Tasbih de Fâtima",
    description: "34 Allahu Akbar • 33 Alhamdulillah • 33 Subhanallah",
    totalBeads: 100,
    cycles: 3,
    sequence: [
      { label: "Allāhu ʾAkbar", repetitions: 34 },
      { label: "Al-ḥamdu li-llāh", repetitions: 33 },
      { label: "Subḥān Allāh", repetitions: 33 },
    ],
  },
  {
    id: "custom-99",
    name: "Libre 99",
    description: "Template vierge pour créer son propre dhikr",
    totalBeads: 99,
    cycles: 1,
    sequence: [
      { label: "Récitation personnalisée", repetitions: 99 },
    ],
  },
];
