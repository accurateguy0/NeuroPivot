# NeuroPivot ("no bs") 🧠⚡

> **Strip the noise. Elevate your cognition.**  
> A zero-cost, science-backed neurobiology, cognitive performance, and habit optimization platform.

---

## 📌 Overview

**NeuroPivot** (known as **"no bs"**) is an interactive web platform designed to translate cutting-edge neurobiology, endocrinology, and behavioral neuroscience into actionable, zero-cost protocols. 

Built with **.NET 9** and **Blazor**, the application equips users with evidence-based tools to master sleep hygiene, overcome addiction friction, sharpen focus, balance stress, optimize metabolic nutrition, and fine-tune physical performance.

---

## ✨ Core Features

### 📚 1. Curated Scientific Articles & Fact Quotes
A dynamic, searchable knowledge repository spanning **17 core physiological and psychological categories**, complete with peer-reviewed citations and DOI references:
- **Focus & Attention**: Dopamine dynamics, ultradian cycles, visual fixation training, and cognitive enhancers.
- **Stress & Autonomic Regulation**: Physiological sighs, cyclic hyperventilation (Wim Hof / Tummo), letdown effect, and burnout latency.
- **Sleep & Circadian Biology**: Slow-wave memory replay, REM emotional depotentiation, blue-light evening suppression, and sleep deficit compensation.
- **Eating & Metabolism**: Whole-food macronutrient-to-micronutrient pairing, enteric neuropod sensing, and fasting physiology.
- **Exercise & Performance**: Hypertrophy mechanics, exercise snacks, endurance adaptations, and palmar cooling.
- **Hormones & Fertility**: Testosterone replacement therapy insights, HPG axis feedback, and hCG fertility preservation.
- **Emotions & Attachment**: Infant-parent relational safety, non-impingement, and emotional regulation.
- **Carl Jung & Depth Psychology**: Individuation, complexes, active imagination, and psychic energy systems.
- **Additional Domains**: Vision & Optic Health, Hearing & Auditory Entrainment, Spine Biomechanics, Neuroprotection & Stroke, Dermal Photobiology, Olfaction, and Gustation.

### 🧪 2. Diagnostic Questionnaires & Assessments
- **Focus & Cognitive State Assessment**: Evaluates attentional fragmentation and baseline focus.
- **Sleep Quality Diagnostic**: Analyzes sleep timing, sleep onset friction, and sleep architecture disruptors.
- **Habit & Addiction Friction Questionnaire**: Identifies compulsive behavioral loops and dopaminergic baseline crashes.
- **Nutrition & Eating Assessment**: Assesses relationship with whole foods vs. ultra-processed triggers.

### 📋 3. Habit Tracker & Daily Protocol Execution
- Interactive daily habit dashboard with real-time completion tracking.
- Goal-based protocol adaptation (*Action* vs. *Rest* thematic states).
- Customizable audio feedback and interactive haptic feel.

### 🎨 4. Mindful Design & Architecture
- **Bilingual Theming**: Dark Mode (default) and Light Mode with smooth state transitions.
- **Autonomic-Aligned UI Modes**: Mint/Rest vs. High-Alert/Action dynamic colorways.
- **Offline & Local Persistence**: Full session hydration and account management using browser local storage.

---

## 🛠️ Tech Stack

- **Framework**: [.NET 9.0](https://dotnet.microsoft.com/download/dotnet/9.0)
- **UI Architecture**: Blazor Web App (Interactive Components / Single Page Application)
- **Language**: C# 13, Razor, HTML5, CSS3
- **Client Interop**: JavaScript Interop for audio synthesis and browser history/theme integration
- **Styling**: Pure custom CSS design system with CSS custom properties (variables)

---

## 🚀 Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) or higher installed.

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/accurateguy0/NeuroPivot.git
   cd NeuroPivot
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run the application:**
   ```bash
   dotnet run --project NeuroPivot
   ```

4. **Access the application:**
   Open your browser and navigate to `https://localhost:5001` or `http://localhost:5000`.

---

## 📂 Project Structure

```text
NeuroPivot/
├── Components/
│   ├── Layout/                # MainLayout, navigation bars, and structural templates
│   └── Pages/
│       ├── About/             # Origin story, founder journey, and Science Council
│       ├── Articles/          # Minimalist Quote Square knowledge base & models
│       ├── Authentication/    # Login, signup, and guest session handling
│       ├── ChangeGoal/        # Goal reassignment & preference settings
│       ├── EatingQuestionnaire/
│       ├── FocusQuestionnaire/
│       ├── HabitQuestionnaire/
│       ├── SleepQuestionnaire/
│       ├── List/              # Daily habit tracker table & progress components
│       ├── Profile/           # User dashboard, profile settings, and session stats
│       └── Home.razor         # Core dynamic view router
├── Services/
│   ├── AppState.cs            # Global reactive application state & session management
│   ├── AccountService.cs      # User account persistence & role management
│   └── LocalStorageService.cs # JS-interop local storage abstraction
└── wwwroot/                   # Static assets, CSS stylesheets, audio cues, and fonts
```

---

## 👥 Authors & Origin

- **Dawid Kowalski** — Founder & Creator (Cybersecurity Student at SGGW, Warsaw)
- **Fabian Oleksiuk** — Engineering Partner

*NeuroPivot was built to provide students and high-performers worldwide with transparent, zero-cost access to practical neuroscience.*
