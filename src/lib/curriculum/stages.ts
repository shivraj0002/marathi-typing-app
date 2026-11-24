export interface Lesson {
  id: string;
  stageId: number;
  title: string;
  description: string;
  keysFocus: string[];
  targetText: string;
  minWpm: number;
  minAccuracy: number;
}

export interface StageDefinition {
  id: number;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const STAGES: StageDefinition[] = [
  {
    id: 1,
    title: "Stage 1: Home Row Foundations",
    subtitle: "Master the center resting position for left & right hands",
    lessons: [
      {
        id: "stage-1-lesson-1",
        stageId: 1,
        title: "Right Hand Consonants (प, र, क, त, च)",
        description: "Place your right fingers on H, J, K, L, ; keys.",
        keysFocus: ["प", "र", "क", "त", "च"],
        targetText: "प र क त च पर करत चर पत तर कप पक चत रच परक तरक",
        minWpm: 12,
        minAccuracy: 95,
      },
      {
        id: "stage-1-lesson-2",
        stageId: 1,
        title: "Left Hand Matras (ो, े, ्, ि, ु)",
        description: "Place your left fingers on A, S, D, F, G keys.",
        keysFocus: ["ो", "े", "्", "ि", "ु"],
        targetText: "के ते पो रो चे कि पि ति रि कु पु तु रु",
        minWpm: 12,
        minAccuracy: 95,
      },
      {
        id: "stage-1-lesson-3",
        stageId: 1,
        title: "Home Row Word Practice",
        description: "Combine consonants and matras to type basic words.",
        keysFocus: ["क", "र", "त", "प", "च", "े", "ि", "ो", "ु"],
        targetText: "करून पोच तेथे चित्त परतु पिकू पेरू केरकचरा तुकडे",
        minWpm: 15,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 2,
    title: "Stage 2: Upper Row Mastery",
    subtitle: "Reach upward for vowels, matras, and consonants",
    lessons: [
      {
        id: "stage-2-lesson-1",
        stageId: 2,
        title: "Upper Consonants (ह, ग, द, ज, ड)",
        description: "Reach index, middle, ring, pinky upward to U, I, O, P, [.",
        keysFocus: ["ह", "ग", "द", "ज", "ड"],
        targetText: "ह ग द ज ड हज गद जग दह गड दज गज हक जद",
        minWpm: 15,
        minAccuracy: 95,
      },
      {
        id: "stage-2-lesson-2",
        stageId: 2,
        title: "Upper Matras (ौ, ै, ा, ी, ू)",
        description: "Reach left hand upward to Q, W, E, R, T.",
        keysFocus: ["ौ", "ै", "ा", "ी", "ू"],
        targetText: "गा जा हा दा डा गीत हात झाड पाऊस बैल हौस",
        minWpm: 15,
        minAccuracy: 95,
      },
      {
        id: "stage-2-lesson-3",
        stageId: 2,
        title: "Two-Row Word Builder",
        description: "Fluidly move between the home row and top row.",
        keysFocus: ["ह", "ग", "ा", "ी", "क", "र"],
        targetText: "दुकान गाडी हात जोडून घरदार दिवस पाणी जीवन",
        minWpm: 18,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 3,
    title: "Stage 3: Bottom Row & Marathi Specials",
    subtitle: "Conquer the lower row, Anusvara, and Marathi ळ & ण",
    lessons: [
      {
        id: "stage-3-lesson-1",
        stageId: 3,
        title: "Bottom Consonants (ल, स, म, न, व, य)",
        description: "Reach fingers down to N, M, C, V, B, /.",
        keysFocus: ["ल", "स", "म", "न", "व", "य"],
        targetText: "ल स म न व य मन सम वन लय नव मल सय वल",
        minWpm: 18,
        minAccuracy: 95,
      },
      {
        id: "stage-3-lesson-2",
        stageId: 3,
        title: "Marathi ळ, ण, and Anusvara (ं)",
        description: "Special Marathi letters on Shift+N (ळ) and Shift+C (ण), X (ं).",
        keysFocus: ["ळ", "ण", "ं"],
        targetText: "कमळ बाळ पाणी रंग गंध पतंग सुंदर पाळणा बाण",
        minWpm: 18,
        minAccuracy: 95,
      },
      {
        id: "stage-3-lesson-3",
        stageId: 3,
        title: "Three-Row Mixed Vocabulary",
        description: "Complete coverage of all three primary rows.",
        keysFocus: ["स", "म", "न", "ळ", "क", "र"],
        targetText: "सकाळ शांत शाळा मानवी जीवन नियम आणि कायदे",
        minWpm: 20,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 4,
    title: "Stage 4: Shift Keys & Independent Vowels",
    subtitle: "Aspirated consonants (ख, घ, थ, ध) and full vowels (अ, आ, इ)",
    lessons: [
      {
        id: "stage-4-lesson-1",
        stageId: 4,
        title: "Aspirated Consonants",
        description: "Shift + K (ख), Shift + I (घ), Shift + L (थ), Shift + O (ध).",
        keysFocus: ["ख", "घ", "थ", "ध", "फ", "भ"],
        targetText: "खत घर कथा धन फळ भाषा भारत धर्म विचार",
        minWpm: 20,
        minAccuracy: 95,
      },
      {
        id: "stage-4-lesson-2",
        stageId: 4,
        title: "Independent Vowels",
        description: "Shift + D (अ), Shift + E (आ), Shift + F (इ), Shift + S (ए).",
        keysFocus: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए"],
        targetText: "आई आज एकत्र एकटा उत्सव आकाश ईश्वर ऊर्जा",
        minWpm: 20,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 5,
    title: "Stage 5: Compound Characters (Jodnikshar)",
    subtitle: "Virama rules and complex Devanagari ligatures",
    lessons: [
      {
        id: "stage-5-lesson-1",
        stageId: 5,
        title: "Halant Mechanics (्)",
        description: "Learn to join letters using Key D (्).",
        keysFocus: ["्"],
        targetText: "क्य च्या स्य न्य त्य स्त स्प स्म प्र क्र",
        minWpm: 22,
        minAccuracy: 95,
      },
      {
        id: "stage-5-lesson-2",
        stageId: 5,
        title: "Special Ligatures (क्ष, ज्ञ, त्र, श्र)",
        description: "Master the essential Indian script conjuncts.",
        keysFocus: ["क्ष", "ज्ञ", "त्र", "श्र"],
        targetText: "क्षत्रिय ज्ञान मित्र आश्रम परीक्षा ज्ञानेश्वर श्रीमंत",
        minWpm: 22,
        minAccuracy: 95,
      },
      {
        id: "stage-5-lesson-3",
        stageId: 5,
        title: "Common Compound Words",
        description: "Practice frequently encountered Marathi compound words.",
        keysFocus: ["महाराष्ट्र", "विद्यार्थी", "पुस्तके", "स्वातंत्र्य"],
        targetText: "महाराष्ट्र राज्य विद्यार्थी अभ्यासक्रम पुस्तक राष्ट्रीय स्वातंत्र्य",
        minWpm: 25,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 6,
    title: "Stage 6: Real Passages & Flow",
    subtitle: "Develop sustained touch-typing speed with Marathi literature",
    lessons: [
      {
        id: "stage-6-lesson-1",
        stageId: 6,
        title: "Marathi Proverbs & Wisdom",
        description: "Type famous Marathi sayings smoothly.",
        keysFocus: ["full-keyboard"],
        targetText: "प्रयत्नांती परमेश्वर लाभतो. वाचाल तर वाचाल. जे का रंजले गांजले त्यांसी म्हणे जो आपुले.",
        minWpm: 25,
        minAccuracy: 95,
      },
      {
        id: "stage-6-lesson-2",
        stageId: 6,
        title: "Cultural & Natural Maharashtra",
        description: "A continuous passage celebrating the geography of Maharashtra.",
        keysFocus: ["full-keyboard"],
        targetText: "सह्याद्रीच्या रांगा आणि अरबी समुद्राचा किनारा लाभलेला महाराष्ट्र हा संतांची आणि शूरवीरांची पावन भूमी आहे.",
        minWpm: 28,
        minAccuracy: 95,
      },
    ],
  },
];

export function getNextLessonId(currentLessonId: string): string | null {
  const allLessons = STAGES.flatMap((s) => s.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === allLessons.length - 1) return null;
  return allLessons[currentIndex + 1].id;
}
