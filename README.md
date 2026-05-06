# EdUmbrella 🎓

**EdUmbrella** is a full-stack CBSE learning platform for students in Classes 6–12. It provides multilingual video lectures sourced directly from DIKSHA (India's national education platform), class-aligned educational games, quizzes, gamification with XP and streaks, and a teacher portal for content management.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Seeding Data](#seeding-data)
- [Key Pages & Components](#key-pages--components)
- [Games](#games)
- [Video Lectures](#video-lectures)
- [Gamification](#gamification)
- [Teacher Portal](#teacher-portal)

---

## Features

### Students
- **Multilingual Video Lectures** — Real NCERT/CBSE video lectures from DIKSHA (diksha.gov.in) with English and Hindi language switching. Videos are direct MP4 streams hosted on DIKSHA's CDN (no YouTube dependency).
- **Language Switcher** — Switch between English and Hindi mid-lecture via pill buttons above the video player. Preference is saved to localStorage.
- **Topic Thumbnails** — Each lecture card shows a topic-relevant image (food for nutrition, wheat for crop production, circuit board for electricity, etc.).
- **Class-Filtered Games** — Every class from 6 to 12 gets exactly 2 curriculum-aligned games. A Class 6 student sees Pizza Fractions + Nutrition Quest; Class 12 sees Calculus Climber + Genetics Lab.
- **Quizzes** — Traditional and class-filtered MCQ quizzes with score tracking.
- **XP & Streaks** — Students earn XP for completing quizzes and games. Consecutive daily logins build streaks.
- **Leaderboard** — Global ranking by XP points.
- **Dashboard** — Overview of quizzes completed, average score, best score, and time played.
- **Profile** — Student profile with class, name, and activity history.
- **Calendar** — View scheduled lectures and quiz deadlines.

### Teachers
- **Teacher Dashboard** — Overview of class activity and student performance.
- **Quiz Builder** — Create and publish quizzes that students see immediately.
- **Content Upload** — Add video lectures (YouTube or DIKSHA URL) with subject and class tagging.
- **Schedule Manager** — Schedule classes and set quiz deadlines for specific class levels.
- **Class Management** — View student roster per class.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Tailwind CSS |
| UI Components | Radix UI, shadcn/ui, Lucide React icons |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Video | DIKSHA CDN (direct MP4 via `obj.diksha.gov.in`) — HTML5 `<video>` tag |
| Auth | Supabase Auth (email + password) with role-based access (student / teacher) |
| Hosting | Vercel (frontend) / Supabase (backend) |

---

## Project Structure

```
EdUmbrella/
├── Frontend/                        # React app
│   ├── src/
│   │   ├── api.js                   # All Supabase API calls (single service class)
│   │   ├── supabaseClient.js        # Supabase client initialisation
│   │   ├── App.js                   # Routes (React Router)
│   │   ├── index.css                # Global styles + Tailwind config
│   │   ├── pages/
│   │   │   ├── Auth.js              # Login / Signup
│   │   │   ├── StudentDashboard.js  # Student home
│   │   │   ├── Lectures.js          # Subject selection page
│   │   │   ├── SubjectLectures.js   # Video lecture list + player
│   │   │   ├── Quizzes.js           # Quiz list
│   │   │   ├── QuizTaking.js        # Active quiz session
│   │   │   ├── Games.js             # Game arcade (class-filtered)
│   │   │   ├── Leaderboards.js      # XP leaderboard
│   │   │   ├── Calendar.js          # Schedule / events
│   │   │   ├── Profile.js           # Student profile
│   │   │   ├── TeacherDashboard.js
│   │   │   ├── TeacherQuizzes.js
│   │   │   ├── TeacherContent.js
│   │   │   ├── TeacherSchedule.js
│   │   │   ├── TeacherClasses.js
│   │   │   └── games/               # Individual game components
│   │   │       ├── pizza.js         # Pizza Fractions (Class 6 Math)
│   │   │       ├── nutrition.js     # Nutrition Quest (Class 6 Science)
│   │   │       ├── integer-battle.js # Integer Battle (Class 7 Math)
│   │   │       ├── photosynthesis.js # Photosynthesis Sim (Class 7 Science)
│   │   │       ├── equation-unlock.js # Equation Unlock (Class 8 Math)
│   │   │       ├── cell-explorer.js  # Cell Explorer (Class 8 Science)
│   │   │       ├── triangle-theorem.js # Triangle Theorem (Class 9 Math)
│   │   │       ├── atom-builder.js   # Atom Builder (Class 9 Chemistry)
│   │   │       ├── circuit.js        # Circuit Designer (Class 10 Physics)
│   │   │       ├── trig-tower.js     # Trigonometry Tower (Class 10 Math)
│   │   │       ├── vector-voyage.js  # Vector Voyage (Class 11 Physics)
│   │   │       ├── periodic-quest.js # Periodic Quest (Class 11 Chemistry)
│   │   │       ├── calculus-climber.js # Calculus Climber (Class 12 Math)
│   │   │       └── genetics-lab.js   # Genetics Lab (Class 12 Biology)
│   │   └── components/
│   │       ├── VideoPlayer.js       # Custom HTML5 player with language switching
│   │       ├── StudentSidebar.js
│   │       ├── TeacherSidebar.js
│   │       ├── SubjectIcon.js
│   │       └── ui/                  # shadcn/ui primitives
│   └── public/
├── Backend/
│   ├── .env                         # Supabase credentials (gitignored)
│   ├── supabase_migration.sql       # Full DB schema (run once)
│   ├── seed_data/
│   │   └── diksha_videos.json       # 44 curated DIKSHA lecture records
│   ├── seed_demo_lectures.js        # Seeds lectures + lecture_videos from diksha_videos.json
│   ├── fetch_diksha_curated.js      # Fetches real DIKSHA MP4 URLs via their API
│   └── fetch_thumbnails.js          # Fetches Wikipedia thumbnails for lectures
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/EdUmbrella.git
cd EdUmbrella
```

### 2. Frontend setup

```bash
cd Frontend
npm install
cp .env.example .env     # fill in your Supabase URL + anon key
npm start                # runs on http://localhost:3000
```

### 3. Backend / database setup

```bash
cd Backend
npm install
cp .env.example .env     # fill in SUPABASE_URL + SUPABASE_SERVICE_KEY
```

Run the migration in Supabase SQL Editor (copy-paste `supabase_migration.sql`), then seed the data:

```bash
node seed_demo_lectures.js   # seeds 44 NCERT lectures with bilingual DIKSHA videos
```

---

## Environment Variables

### Frontend (`Frontend/.env`)

```
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (`Backend/.env`)

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

---

## Database Schema

### Core tables

| Table | Purpose |
|-------|---------|
| `users` | Student and teacher profiles (role, class, xp_points, current_streak, level) |
| `subjects` | Subject catalogue (Mathematics, Science, Physics, Chemistry, Biology, English, Hindi, Social Science) |
| `lectures` | Lecture metadata (title, description, class_level, subject_id, chapter_number, thumbnail_url) |
| `lecture_videos` | One row per (lecture, language) — stores direct MP4 URL from DIKSHA |
| `student_lecture_progress` | Tracks which lectures each student has watched |
| `quizzes` | Both traditional quizzes and games (`quiz_type = 'traditional'` or `'game'`) |
| `quiz_questions` | MCQ questions linked to a quiz |
| `quiz_attempts` | Student quiz session results |
| `game_scores` | Game completion scores per student |
| `xp_events` | Audit log of every XP award |
| `achievements` | Badge definitions with tier and criteria |
| `user_achievements` | Which badges each student has earned |
| `calendar_events` | Teacher-scheduled events visible to a class level |

### RLS
All tables have Row Level Security enabled. Students can only read/write their own data. Lectures and quizzes are public-readable where `is_active = true`.

---

## Seeding Data

### Lectures (DIKSHA NCERT videos)

```bash
cd Backend
node seed_demo_lectures.js
```

This reads `seed_data/diksha_videos.json` which contains 44 curated lectures covering:
- Classes 6–10: Mathematics, Science, Social Science, English
- Classes 11–12: Mathematics, Physics, Chemistry, Biology, English

Each lecture has an English and Hindi MP4 URL sourced directly from DIKSHA (India's official NCERT content platform). Videos are served from `obj.diksha.gov.in` with open CORS headers.

To refresh the DIKSHA video data:

```bash
node fetch_diksha_curated.js   # re-fetches from DIKSHA API, saves to diksha_videos.json
node seed_demo_lectures.js     # re-seeds the DB
```

---

## Key Pages & Components

### `VideoPlayer.js`
Custom HTML5 video player with:
- Language pill switcher (English / Hindi) — switches the `<video src>` seamlessly
- Play/pause, mute, seek bar, restart, fullscreen controls
- Poster image shown while loading
- Saves language preference to `localStorage`

### `SubjectLectures.js`
- Fetches lectures + `lecture_videos` rows for the student's class and selected subject
- Builds `videosByLanguage` map `{ english: mp4Url, hindi: mp4Url }`
- Passes map to `VideoPlayer` which handles language switching
- Topic-relevant thumbnail images via Unsplash CDN

### `Games.js`
- Calls `api.getQuizzes({ type: 'game', class_level: studentClass })`
- Each class level sees exactly its 2 assigned games
- Routes to the correct game component on "Play Now"

### `api.js`
Single `ApiService` class wrapping all Supabase queries. Key methods:
- `getLecturesBySubject(subjectId, classLevel)` — returns lectures + nested `lecture_videos`
- `markLectureWatched(lectureId, studentEmail)` — upserts progress + awards 10 XP
- `submitQuiz(...)` — saves attempt + awards XP based on score and difficulty
- `saveGameScore(studentEmail, gameName, scoreData)` — saves score + awards 30 XP on completion
- `awardXP(userEmail, sourceType, sourceId, amount)` — increments `users.xp_points` and `level`
- `updateStreak(userEmail)` — increments streak on consecutive daily logins

---

## Games

| Class | Game | Subject | Description |
|-------|------|---------|-------------|
| 6 | Pizza Fractions | Mathematics | Cut pizzas into equal parts to learn fractions |
| 6 | Nutrition Quest | Science | Match foods to nutrient groups |
| 7 | Integer Battle | Mathematics | Solve integer operations under a timer |
| 7 | Photosynthesis Simulator | Science | Control sunlight, CO₂, and water to grow plants |
| 8 | Equation Unlock | Mathematics | Solve linear equations to crack combination locks |
| 8 | Cell Explorer | Science | Identify cell organelles and their functions |
| 9 | Triangle Theorem Proof | Mathematics | Use SAS, ASA, SSS, RHS to prove triangle congruence |
| 9 | Atom Builder Lab | Chemistry | Place protons, neutrons, and electrons to build elements |
| 10 | Circuit Designer | Physics | Wire up components and complete electrical circuits |
| 10 | Trigonometry Tower | Mathematics | Use sin/cos/tan to solve angle-of-elevation puzzles |
| 11 | Vector Voyage | Physics | Navigate by drawing vectors and finding resultants |
| 11 | Periodic Quest | Chemistry | Identify elements from periodic table clues in a speed round |
| 12 | Calculus Climber | Mathematics | Solve derivatives to climb the mountain peak |
| 12 | Genetics Lab | Biology | Complete Punnett squares and predict offspring traits |

---

## Video Lectures

Lectures are sourced from **DIKSHA** (Digital Infrastructure for Knowledge Sharing), India's official government education platform built on NCERT content.

- API: `GET https://diksha.gov.in/api/content/v1/read/{do_id}` returns `artifactUrl` (direct MP4)
- CORS: `access-control-allow-origin: *` — works from any frontend
- Coverage: 44 curated lectures across classes 6–12, all bilingual (English + Hindi)
- No YouTube dependency — videos play via native HTML5 `<video>` tag

---

## Gamification

| Action | XP Awarded |
|--------|-----------|
| Watch a lecture | 10 XP |
| Pass a quiz (≥60%) | 50 XP |
| Complete a game | 30 XP |
| Daily login streak | 5 XP/day |

- **Level** = `floor(xp / 500) + 1`
- **Streak** increments when `last_activity_date` was yesterday; resets if more than 1 day has passed
- XP events are logged to `xp_events` table for full audit history

---

## Teacher Portal

Teachers sign up with `role = 'teacher'`. The teacher portal includes:

- **Dashboard** — Class activity overview
- **Quiz Builder** — Create MCQ quizzes with title, subject, class level, difficulty, and questions. Published quizzes appear immediately for students in that class.
- **Content Manager** — Add lecture entries with YouTube or DIKSHA video URLs, subject, class, and chapter metadata.
- **Schedule** — Create calendar events (lectures, quizzes, assignments) for specific class levels.
- **Classes** — View enrolled students per class.

---

## License

MIT — free to use, modify, and distribute for educational purposes.
