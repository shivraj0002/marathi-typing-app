# Marathi InScript Typing Web App — Architecture & Design Specification

**Date:** 2026-11-24  
**Status:** Approved  
**Target Platform:** Web (Desktop-first touch typing, responsive)  
**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Zustand, Lucide React, Web Audio API  

---

## 1. Executive Summary & Goals

### 1.1 Goal
Provide a fast, friction-free learning journey for mastering Marathi touch typing using a standard English (QWERTY) physical keyboard. The application requires **zero OS-level language installation or IME switching**; users simply open the web app, press keys on their physical English keyboard, and the app intercepts and translates keystrokes directly into official Marathi InScript characters with real-time visual finger guidance and feedback.

### 1.2 Core Objectives
- **Zero Barrier to Entry**: Pure web-level InScript key interception on any modern browser.
- **Progressive "Zero-to-Hero" Curriculum**: 6 unlockable stages spanning from Home Row basics to complex compound characters (*Jodnikshar*) and full literary passages.
- **GCC-TBC Exam Simulator**: Official Maharashtra typing exam simulation (30 WPM and 40 WPM benchmark tests, strict mistake penalties, pass/distinction evaluation, and printable certificates).
- **Fast Mastery Tools**:
  - Color-coded virtual keyboard with active finger guides (which finger presses which key).
  - Weak Key Clinic: Automatic detection of error-prone characters with targeted dynamic drills.
  - Speed Sprint: Distraction-free Monkeytype-style speed training.
- **Offline-First & Privacy-Focused**: 100% client-side execution; all stats, progress, streaks, and settings persist securely in browser `localStorage`.

---

## 2. InScript Input & Translation Engine

### 2.1 Web-Level Keystroke Interception
The app intercepts the physical keyboard via standard `keydown` events (`e.code`), bypassing default text input and eliminating the need to install Marathi language packs in Windows, macOS, or Linux.

### 2.2 Key Mapping Matrix (QWERTY to InScript Devanagari)

#### Number / Top Row
| QWERTY Key | Normal (Unshifted) | Shifted |
|---|---|---|
| `Backquote` (`` ` ``) | ` ` (ZWNJ / Zero Width Non-Joiner) | ` ` (ZWJ) |
| `Digit1` (`1`) | `१` | `ऍ` |
| `Digit2` (`2`) | `२` | `ॅ` |
| `Digit3` (`3`) | `३` | `्र` (Pre-base ra) |
| `Digit4` (`4`) | `४` | `र्` (Reph) |
| `Digit5` (`5`) | `५` | `ज्ञ` |
| `Digit6` (`6`) | `६` | `त्र` |
| `Digit7` (`7`) | `७` | `क्ष` |
| `Digit8` (`8`) | `८` | `श्र` |
| `Digit9` (`9`) | `९` | `(` |
| `Digit0` (`0`) | `०` | `)` |
| `Minus` (`-`) | `-` | `ः` (Visarga) |
| `Equal` (`=`) | `ृ` (Vocalic r matra) | `ऋ` (Vocalic r) |

#### Upper Row
| QWERTY Key | Normal (Unshifted) | Shifted |
|---|---|---|
| `KeyQ` (`q`) | `ौ` | `औ` |
| `KeyW` (`w`) | `ै` | `ऐ` |
| `KeyE` (`e`) | `ा` | `आ` |
| `KeyR` (`r`) | `ी` | `ई` |
| `KeyT` (`t`) | `ू` | `ऊ` |
| `KeyY` (`y`) | `ब` | `भ` |
| `KeyU` (`u`) | `ह` | `ङ` |
| `KeyI` (`i`) | `ग` | `घ` |
| `KeyO` (`o`) | `द` | `ध` |
| `KeyP` (`p`) | `ज` | `झ` |
| `BracketLeft` (`[`) | `ड` | `ढ` |
| `BracketRight` (`]`) | `़` (Nukta) | `ञ` |
| `Backslash` (`\`) | `ॉ` | `ऑ` |

#### Home Row
| QWERTY Key | Normal (Unshifted) | Shifted | Finger Assignment |
|---|---|---|---|
| `KeyA` (`a`) | `ो` | `ओ` | Left Pinky |
| `KeyS` (`s`) | `े` | `ए` | Left Ring |
| `KeyD` (`d`) | `्` (Halant / Virama) | `अ` | Left Middle |
| `KeyF` (`f`) | `ि` | `इ` | Left Index |
| `KeyG` (`g`) | `ु` | `उ` | Left Index (stretch) |
| `KeyH` (`h`) | `प` | `फ` | Right Index (stretch) |
| `KeyJ` (`j`) | `र` | `ऱ` (Eyelash ra) | Right Index |
| `KeyK` (`k`) | `क` | `ख` | Right Middle |
| `KeyL` (`l`) | `त` | `थ` | Right Ring |
| `Semicolon` (`;`) | `च` | `छ` | Right Pinky |
| `Quote` (`'`) | `ट` | `ठ` | Right Pinky (reach) |

#### Bottom Row
| QWERTY Key | Normal (Unshifted) | Shifted | Finger Assignment |
|---|---|---|---|
| `KeyZ` (`z`) | ` ` (Virama shortcut) | ` ` | Left Pinky |
| `KeyX` (`x`) | `ं` (Anusvara) | `ँ` (Candrabindu) | Left Ring |
| `KeyC` (`c`) | `म` | `ण` | Left Middle |
| `KeyV` (`v`) | `न` | ` ` | Left Index |
| `KeyB` (`b`) | `व` | ` ` | Left Index |
| `KeyN` (`n`) | `ल` | `ळ` (Marathi Specific) | Right Index |
| `KeyM` (`m`) | `स` | `श` | Right Index |
| `Comma` (`,`) | `,` | `ष` | Right Middle |
| `Period` (`.`) | `.` | `।` (Purna Viram) | Right Ring |
| `Slash` (`/`) | `य` | `?` | Right Pinky |

*Spacebar (`Space`)* is operated by either thumb.

### 2.3 Devanagari Conjunct (*Jodnikshar*) Engine
- **Virama Logic**: Any consonant followed by `्` (Key `D`) becomes a half-consonant, bonding with the following consonant.
  - Example: `क` (`k`) + `्` (`d`) + `य` (`/`) = `क्य`.
  - Example: `स` (`m`) + `्` (`d`) + `व` (`b`) = `स्व`.
- **Special Marathi Ligatures**:
  - `क` (`k`) + `्` (`d`) + `ष` (`Shift+,`) = `क्ष` (or direct shortcut `Shift+7`).
  - `ज` (`p`) + `्` (`d`) + `ञ` (`Shift+]`) = `ज्ञ` (or direct shortcut `Shift+5`).
  - `त` (`l`) + `्` (`d`) + `र` (`j`) = `त्र` (or direct shortcut `Shift+6`).
  - `श` (`Shift+m`) + `्` (`d`) + `र` (`j`) = `श्र` (or direct shortcut `Shift+8`).
- **Grapheme & Unicode Normalization**:
  All target texts and typed buffer comparisons execute under `String.prototype.normalize('NFC')`. Character evaluation uses `Intl.Segmenter('mr', { granularity: 'grapheme' })` to ensure compound glyphs are highlighted and scored cleanly without breaking matras from base consonants.

---

## 3. Curriculum Structure & Practice Modes

### 3.1 Academy (6 Structured Stages)
1. **Stage 1: Home Row Foundations**
   - Lesson 1.1: Right Hand Consonants (`प`, `र`, `क`, `त`, `च`)
   - Lesson 1.2: Left Hand Basic Matras (`ो`, `े`, `्`, `ि`, `ु`)
   - Lesson 1.3: Home Row Blends (`कर`, `पर`, `कत`, `तो`, `ते`, `कि`, `के`, `पो`)
2. **Stage 2: Upper Row Mastery**
   - Lesson 2.1: Upper Consonants (`ह`, `ग`, `द`, `ज`, `ड`)
   - Lesson 2.2: Upper Matras (`ौ`, `ै`, `ा`, `ी`, `ू`)
   - Lesson 2.3: Cross-Row Common Words (`हात`, `घर`, `झाड`, `पाऊस`, `गीत`)
3. **Stage 3: Bottom Row & Marathi Specials**
   - Lesson 3.1: Bottom Consonants (`ल`, `स`, `म`, `न`, `व`, `य`)
   - Lesson 3.2: Marathi Special Letters (`ळ`, `ण`, `श`, `ष`) & Anusvara (`ं`)
   - Lesson 3.3: Rich Vocabulary Drills (`कमळ`, `ससा`, `मित्र`, `महाराष्ट्र`, `सण`)
4. **Stage 4: Shift Keys & Independent Vowels**
   - Lesson 4.1: Aspirated Letters (`ख`, `घ`, `छ`, `झ`, `थ`, `ध`, `फ`, `भ`)
   - Lesson 4.2: Independent Vowels (`अ`, `आ`, `इ`, `ई`, `उ`, `ऊ`, `ए`, `ऐ`, `ओ`, `औ`)
5. **Stage 5: Compound Characters (*Jodnikshar*)**
   - Lesson 5.1: Halant mechanics and half letters
   - Lesson 5.2: Complex conjuncts (`क्ष`, `ज्ञ`, `त्र`, `श्र`, `ष्ट`, `प्र`, `क्र`, `र्य`)
   - Lesson 5.3: Advanced Word Mastery (`विद्यार्थी`, `पुस्तके`, `कार्यक्रम`, `स्वातंत्र्य`)
6. **Stage 6: Real Passages & Flow**
   - Lesson 6.1: Famous Marathi quotes, proverbs, and poetry
   - Lesson 6.2: News and essay paragraphs

*Unlock Rule*: Stage lessons require **>= 95% accuracy** and a minimum of 15 WPM to unlock subsequent lessons.

### 3.2 Speed Sprint Mode (Monkeytype Style)
- Time Options: 15s, 30s, 60s, 120s.
- Word Options: 25, 50, 100 words.
- Live WPM ticker, minimal HUD, zero distractions.

### 3.3 GCC-TBC Exam Simulator (Maharashtra State Standard)
- **Tiers**:
  - **30 WPM Test**: 7 minutes duration (~300 words). Passing standard: Net Speed >= 30 WPM with >= 90% accuracy.
  - **40 WPM Test**: 7 minutes duration (~400 words). Passing standard: Net Speed >= 40 WPM with >= 90% accuracy.
- **Scoring Formula**:
  - $\text{Gross WPM} = \frac{\text{Total Characters Typed} / 5}{\text{Time (Minutes)}}$
  - $\text{Net WPM} = \text{Gross WPM} - (\text{Mistake Count} \times \text{Error Penalty Factor})$
  - Grading:
    - **First Class with Distinction**: >= 95% accuracy & Net WPM >= Target + 5
    - **First Class**: >= 90% accuracy & Net WPM >= Target
    - **Second Class / Pass**: >= 85% accuracy & Net WPM >= Target - 2
    - **Fail**: < 85% accuracy or Net WPM < Target - 2
- **Certificate**: Downloadable/printable official-style Certificate of Completion showing candidate name, date, speed, accuracy, and grade.

### 3.4 Weak Key Clinic (Adaptive Drill Generator)
- Tracks character miss frequency: $\text{Error Rate} = \frac{\text{Mistakes on Char } c}{\text{Occurrences of Char } c}$.
- Automatically generates custom drill exercises composed of high-frequency words containing the user's top 5 weakest characters.

---

## 4. UI/UX & Layout Architecture

### 4.1 On-Screen Virtual Keyboard
- Visual 5-row standard layout with dual labels: English QWERTY letter (small, top-left) and InScript Devanagari character (bold, center).
- Dynamic Shift state: pressing physical `Shift` flips keycaps to their shifted Marathi letters in real time.
- Finger Color-Coding:
  - Little finger: Emerald / Violet
  - Ring finger: Blue
  - Middle finger: Amber
  - Index finger: Orange / Coral
  - Thumb: Neutral slate
- Active pulsing ring on the next expected physical key.
- Live Hands Indicator: Minimalist hand silhouettes indicating which hand and finger to move.

### 4.2 Interactive Typing Area
- Smooth caret animation.
- Color feedback: Correct characters = crisp emerald green; incorrect characters = crimson red; untyped = muted gray.
- Real-time stat bar showing WPM, Accuracy, CPM, and elapsed/remaining time.

### 4.3 Audio Feedback (Web Audio API Synthesizer)
- Mechanical switch clicks (Cherry MX Blue / Brown sound profiles synthesized in pure audio nodes).
- Soft error thud on missed characters.
- Lesson success fanfare.
- Instant mute/unmute toggle in header.

---

## 5. Technology Stack & Directory Structure

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS, Lucide React icons
- **State Store**: Zustand with `persist` middleware (`localStorage`)

```
marathi-typing/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Dashboard & Quick Play
│   │   ├── academy/page.tsx       # 6-Stage Guided Academy
│   │   ├── academy/[id]/page.tsx  # Interactive Lesson Runner
│   │   ├── sprint/page.tsx        # Monkeytype Speed Sprint
│   │   ├── exam/page.tsx          # GCC-TBC Exam Simulator
│   │   ├── clinic/page.tsx        # Weak Key Adaptive Clinic
│   │   └── stats/page.tsx         # Heatmap, History & Trends
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── keyboard/
│   │   │   ├── VirtualKeyboard.tsx
│   │   │   ├── KeyCap.tsx
│   │   │   └── HandsGuide.tsx
│   │   ├── typing/
│   │   │   ├── TypingArea.tsx
│   │   │   ├── LiveStatsBar.tsx
│   │   │   └── ResultModal.tsx
│   │   └── exam/
│   │       └── ExamCertificate.tsx
│   └── lib/
│       ├── inscript/
│       │   ├── keymap.ts          # Complete QWERTY -> InScript mapping table
│       │   ├── conjuncts.ts       # Halant & compound rules
│       │   └── graphemes.ts       # Normalization and cluster segmentation
│       ├── curriculum/
│       │   ├── stages.ts          # Stages 1 to 6 lesson definitions
│       │   ├── words.ts           # Vocabulary database for drills
│       │   └── examPassages.ts    # 30 & 40 WPM GCC-TBC passages
│       ├── store/
│       │   └── useTypingStore.ts  # Zustand store with persistence
│       └── audio/
│           └── soundEffects.ts    # Web Audio sound generator
```

---

## 6. Verification & Test Plan

1. **InScript Keymap Coverage Test**:
   - Comprehensive test verifying every single QWERTY `e.code` in both unshifted and shifted states matches official InScript standard.
2. **Devanagari Conjunct (*Jodnikshar*) Test**:
   - Test proper sequential input and character grouping for words like `महाराष्ट्र`, `कार्यक्रम`, `विद्यार्थी`, `क्षत्रिय`, `ज्ञानेश्वर`.
3. **Scoring Accuracy Test**:
   - Verify calculation formulas for Gross WPM, Net WPM, and GCC-TBC grade thresholds.
4. **Persistence & Hydration Test**:
   - Verify zero hydration errors on Next.js page reloads while reading progress from `localStorage`.
5. **Production Build**:
   - Execute `npm run build` and `npm run test` with zero warnings or errors.
