# मराठी टायपिंग अकॅडमी (Marathi InScript Typing Academy)

> **इंग्रजी कीबोर्डवर मराठी इन्स्क्रिप्ट टायपिंग जलद आणि अचूक शिका!**  
> Learn Marathi InScript touch typing fast using your standard physical English (QWERTY) keyboard without installing any external OS-level language packs or switching system IMEs.

---

## 🌟 वैशिष्ट्ये (Key Features)

### 1. थेट इन-ब्राउझर इन्स्क्रिप्ट ट्रान्सलेशन (Pure In-Browser Mapping)
- संगणकावर कोणतीही लँग्वेज सेटिंग न बदलता थेट मानक इंग्रजी (QWERTY) कीबोर्डवरून मराठी इन्स्क्रिप्ट अक्षरे टाईप करा.
- सर्व सामान्य व शिफ्ट अक्षरे, विशेष मराठी अक्षरे (`ळ`, `ऱ`, `ण`, `ं`, `्`, `ऑ`, `ॅ`) आणि जोडनिबंध शॉर्टकट्स (`ज्ञ`, `त्र`, `क्ष`, `श्र`) चे संपूर्ण समर्थन.

### 2. ६ टप्प्यांचा परिपूर्ण अभ्यासक्रम (6-Stage Guided Academy)
- **टप्पा १ (Home Row)**: हातांची विश्राम स्थिती (`प`, `र`, `क`, `त`, `च` आणि मात्रा `ो`, `े`, `्`, `ि`, `ु`).
- **टप्पा २ (Upper Row)**: वरची अक्षरे व मात्रा (`ह`, `ग`, `द`, `ज`, `ड`, `ा`, `ी`, `ू`).
- **टप्पा ३ (Bottom Row & Marathi Specials)**: खालची अक्षरे, अनुस्वार आणि मराठी विशेष `ळ` व `ण`.
- **टप्पा ४ (Shift Keys & Vowels)**: महाप्राण अक्षरे (`ख`, `घ`, `थ`, `ध`) आणि स्वतंत्र स्वर (`अ`, `आ`, `इ`, `ई`).
- **टप्पा ५ (Jodnikshar Mastery)**: हलंत नियम आणि क्लिष्ट जोडनिबंध (`महाराष्ट्र`, `विद्यार्थी`, `स्वातंत्र्य`).
- **टप्पा ६ (Literature & Flow)**: मराठी म्हणी, सुविचार आणि साहित्यिक परिच्छेद.
- **प्रगती निकष**: पुढील धडा अनलॉक करण्यासाठी किमान **९५% अचूकता** आणि लक्ष्यित वेग आवश्यक.

### 3. GCC-TBC शासकीय परीक्षा सिम्युलेटर (Exam Simulator)
- महाराष्ट्र राज्य शासकीय संगणक टंकलेखन परीक्षा (GCC-TBC) प्रमाणे **३० WPM** आणि **४० WPM** ची ७ मिनिटांची टेस्ट.
- अधिकृत गुणपद्धती: Net WPM = Gross WPM − (Mistakes × Penalty Factor).
- उत्तीर्ण झाल्यावर डिजिटल आणि मुद्रणक्षम (Printable) **गुणवत्ता प्रमाणपत्र (Certificate of Proficiency)**.

### 4. वीक की क्लिनिक (Adaptive Weak Key Clinic)
- आपल्या सर्वाधिक चुकणाऱ्या अक्षरांचा स्वयंचलित अभ्यास करून फक्त त्या अक्षरांवर आधारित विशेष सराव परिच्छेद तयार करतो.

### 5. स्पीड स्प्रिंट (Speed Sprint)
- मंकीटाइप (Monkeytype) शैलीत १५, ३०, ६०, १२० सेकंदांचा विचलित-मुक्त जलद टायपिंग सराव.

### 6. परस्परसंवादी कीबोर्ड व ध्वनी (Virtual Keyboard & Audio)
- रंगाने दर्शविलेले बोटांचे मार्गदर्शक (Pinky, Ring, Middle, Index, Thumb).
- Web Audio API द्वारे तयार केलेले मॅकॅनिकल कीबोर्ड क्लिक्स आणि ध्वनी प्रभाव (कोणत्याही बाह्य ऑडिओ फाईल्सशिवाय).

### 7. ऑफलाइन-प्रथम (Offline-First & Privacy)
- १००% सुरक्षित आणि क्लायंट-साइड: आपली सर्व प्रगती, स्कोअर आणि इतिहास ब्राउझरच्या `localStorage` मध्ये जतन होतो.

---

## 🛠️ तंत्रज्ञान (Tech Stack)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with LocalStorage persistence
- **Testing**: [Vitest](https://vitest.dev/) (58 Automated Unit & E2E Tests)
- **Audio**: Web Audio API Synthesizer

---

## 🚀 सुरू कसे करावे (Getting Started)

### आवश्यकता (Prerequisites)
- [Node.js](https://nodejs.org/) (v18.18.0 किंवा अधिक, शिफारस: Node v20+)
- npm किंवा yarn किंवा pnpm

### इन्स्टॉलेशन (Installation)

```bash
# रिपॉझिटरी क्लोन करा
git clone https://github.com/shivraj0002/marathi-typing-app.git

# डिरेक्टरीमध्ये जा
cd marathi-typing-app

# डिपेंडन्सीज इन्स्टॉल करा
npm install
```

### डेव्हलपमेंट सर्व्हर (Run Dev Server)

```bash
npm run dev
```

ब्राउझरमध्ये [http://localhost:3000](http://localhost:3000) उघडा.

### चाचण्या चालवा (Run Tests)

```bash
npm test
```

### प्रॉडक्शन बिल्ड (Production Build)

```bash
npm run build
npm start
```

---

## 📄 परवाना (License)

हा प्रकल्प MIT परवान्याअंतर्गत उपलब्ध आहे.
