# NoorPath — Backend Documentation
> Version: 1.0 | Date: March 2026 | Status: Draft for Engineering Review

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Database Schema](#2-database-schema)
3. [API Endpoints](#3-api-endpoints)
4. [Business Logic & Gamification Rules](#4-business-logic--gamification-rules)
5. [Data Reset & Scheduling](#5-data-reset--scheduling)
6. [Open Questions for Engineering](#6-open-questions-for-engineering)

---

## 1. Project Overview

NoorPath is a gamified Islamic learning app for children (ages 6–14). The backend must support:

- **User management** (child profile + optional parent account)
- **Daily activity tracking** (prayers, Adhkar, Quran, Tasbih)
- **Gamification engine** (gems, streaks, achievements/badges)
- **Weekly history** (prayer grid, Quran consistency circles)
- **Lifetime stats** (total verses memorized, total gems, badges earned)

---

## 2. Database Schema

### 2.1 `users`

```sql
users (
  id              UUID PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,        -- Child's first name (e.g. "عمر")
  avatar_url      VARCHAR(255),                 -- Profile picture
  parent_id       UUID REFERENCES parents(id),  -- Optional parent link
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

---

### 2.2 `parents` *(optional — pending confirmation)*

```sql
parents (
  id              UUID PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
)
```

---

### 2.3 `gems`

```sql
gems (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id) NOT NULL,
  total           INTEGER DEFAULT 0,            -- Running lifetime total
  updated_at      TIMESTAMP DEFAULT NOW()
)
```

---

### 2.4 `prayers`

Tracks each individual prayer per day.

```sql
prayers (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id) NOT NULL,
  prayer_name     VARCHAR(20) NOT NULL,         -- "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
  status          VARCHAR(20) NOT NULL,         -- "mosque" | "home" | "missed" | "pending"
  prayed_at       DATE NOT NULL,                -- The calendar date (not timestamp)
  created_at      TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, prayer_name, prayed_at)       -- One row per prayer per day
)
```

**Status values:**
| Value | Meaning | Gem Reward |
|-------|---------|------------|
| `mosque` | Prayed in the mosque | Higher (TBD) |
| `home` | Prayed at home | Standard (TBD) |
| `missed` | Did not pray | 0 |
| `pending` | Not yet logged | — |

---

### 2.5 `adhkar_progress`

Tracks completion per Adhkar category per day.

```sql
adhkar_progress (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id) NOT NULL,
  category        VARCHAR(50) NOT NULL,         -- see values below
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMP,
  date            DATE NOT NULL,

  UNIQUE(user_id, category, date)
)
```

**Category values:**
| Value | Arabic Label |
|-------|-------------|
| `morning` | أذكار الصباح |
| `evening` | أذكار المساء |
| `sleep` | أذكار عند النوم |
| `leaving_home` | الخروج من المنزل |
| `mealtime` | عند الطعام |

---

### 2.6 `quran_sessions`

Logs each individual Quran memorization or revision session.

```sql
quran_sessions (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id) NOT NULL,
  type            VARCHAR(20) NOT NULL,         -- "memorization" | "revision"
  surah_name      VARCHAR(100) NOT NULL,        -- e.g. "سورة الفلق"
  surah_number    INTEGER,                      -- 1–114
  verse_count     INTEGER NOT NULL,             -- Number of verses in this session
  date            DATE NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
)
```

---

### 2.7 `quran_stats`

Aggregated lifetime Quran stats per user.

```sql
quran_stats (
  id                    UUID PRIMARY KEY,
  user_id               UUID REFERENCES users(id) UNIQUE NOT NULL,
  total_memorized       INTEGER DEFAULT 0,      -- Lifetime total verses memorized
  total_revised         INTEGER DEFAULT 0,      -- Lifetime total verses revised
  current_surah         VARCHAR(100),           -- Current surah being memorized
  current_surah_number  INTEGER,
  daily_memorize_goal   INTEGER DEFAULT 5,      -- Daily verse memorization target
  daily_revision_goal   INTEGER DEFAULT 15,     -- Daily revision target
  updated_at            TIMESTAMP DEFAULT NOW()
)
```

---

### 2.8 `tasbih_sessions`

```sql
tasbih_sessions (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id) NOT NULL,
  allahu_akbar    INTEGER DEFAULT 0,            -- Count (max 33)
  subhan_allah    INTEGER DEFAULT 0,            -- Count (max 33)
  alhamdulillah   INTEGER DEFAULT 0,            -- Count (max 33)
  completed       BOOLEAN DEFAULT FALSE,        -- TRUE when all 3 reach 33
  date            DATE NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, date)                         -- One Tasbih session per day
)
```

---

### 2.9 `streaks`

```sql
streaks (
  id                    UUID PRIMARY KEY,
  user_id               UUID REFERENCES users(id) UNIQUE NOT NULL,
  prayer_streak         INTEGER DEFAULT 0,      -- Consecutive days all 5 prayers done
  quran_streak          INTEGER DEFAULT 0,      -- Consecutive days Quran goal met
  tasbih_streak         INTEGER DEFAULT 0,      -- Consecutive days Tasbih completed
  adhkar_streak         INTEGER DEFAULT 0,      -- Consecutive days any Adhkar done
  last_prayer_date      DATE,
  last_quran_date       DATE,
  last_tasbih_date      DATE,
  last_adhkar_date      DATE,
  updated_at            TIMESTAMP DEFAULT NOW()
)
```

---

### 2.10 `achievements`

Master list of all possible badges.

```sql
achievements (
  id              UUID PRIMARY KEY,
  key             VARCHAR(100) UNIQUE NOT NULL, -- e.g. "fajr_knight"
  name_ar         VARCHAR(100) NOT NULL,        -- Arabic label (e.g. "فارس الفجر")
  description_ar  VARCHAR(255),
  icon_url        VARCHAR(255),
  criteria_type   VARCHAR(50),                  -- "streak" | "count" | "milestone"
  criteria_value  INTEGER                       -- e.g. 7 (days), 1000 (verses)
)
```

---

### 2.11 `user_achievements`

```sql
user_achievements (
  id              UUID PRIMARY KEY,
  user_id         UUID REFERENCES users(id) NOT NULL,
  achievement_id  UUID REFERENCES achievements(id) NOT NULL,
  earned_at       TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
)
```

**Known achievements from design:**
| Key | Name (AR) | Criteria |
|-----|-----------|----------|
| `fajr_knight` | فارس الفجر | Pray Fajr 7 days in a row |
| `hero_of_week` | بطل الأسبوع | Complete all 35 prayers in one week |
| *(more TBD)* | — | — |

---

### 2.12 Entity Relationship Summary

```
parents
  └── users (many per parent)
        ├── gems (1:1)
        ├── streaks (1:1)
        ├── quran_stats (1:1)
        ├── prayers (1:many — one per prayer per day)
        ├── adhkar_progress (1:many — one per category per day)
        ├── quran_sessions (1:many — one per session)
        ├── tasbih_sessions (1:many — one per day)
        └── user_achievements (1:many)
              └── achievements (many:many via user_achievements)
```

---

## 3. API Endpoints

> Base URL: `/api/v1`
> Auth: Bearer token (JWT) in `Authorization` header
> All responses return `{ success: boolean, data: {...}, error?: string }`

---

### 3.1 Auth

#### `POST /auth/register`
Register a new user (child or parent).

**Request:**
```json
{
  "name": "عمر",
  "role": "child",
  "parent_email": "parent@example.com",   // optional
  "parent_password": "secret"             // optional — if creating parent account
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "token": "jwt_token"
  }
}
```

---

#### `POST /auth/login`
```json
// Request
{ "email": "parent@example.com", "password": "secret" }

// Response
{ "success": true, "data": { "token": "jwt_token", "user_id": "uuid" } }
```

---

### 3.2 User

#### `GET /users/:id`
Get user profile + current gem total.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "عمر",
    "avatar_url": "...",
    "gems": 100
  }
}
```

---

#### `PATCH /users/:id`
Update name or avatar.

```json
// Request
{ "name": "عمر", "avatar_url": "https://..." }
```

---

### 3.3 Daily Dashboard

#### `GET /dashboard/:user_id`
Returns a complete snapshot of today's progress for the dashboard screen.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "name": "عمر", "gems": 100 },
    "date": "2026-03-30",
    "progress": {
      "prayers_completed": 1,
      "prayers_total": 5,
      "adhkar_percent": 10,
      "verses_percent": 75,
      "today_percent": 20
    },
    "prayers": [
      { "name": "fajr",    "status": "mosque" },
      { "name": "dhuhr",   "status": "home" },
      { "name": "asr",     "status": "pending" },
      { "name": "maghrib", "status": "pending" },
      { "name": "isha",    "status": "pending" }
    ],
    "dhikr": {
      "allahu_akbar": 1,
      "subhan_allah": 1,
      "alhamdulillah": 1
    },
    "quran_daily": {
      "goal": 5,
      "completed": 3
    }
  }
}
```

---

### 3.4 Prayers

#### `POST /prayers/log`
Log a single prayer.

**Request:**
```json
{
  "user_id": "uuid",
  "prayer_name": "maghrib",
  "status": "mosque",
  "date": "2026-03-30"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prayer": { "prayer_name": "maghrib", "status": "mosque" },
    "gems_awarded": 0,
    "milestone_reached": false,
    "all_five_complete": false
  }
}
```

> **Note:** When `all_five_complete: true`, the frontend should trigger the prayer completion modal (+5 gems).

---

#### `GET /prayers/weekly/:user_id`
Returns the full 5×7 prayer grid for the current week.

**Response:**
```json
{
  "success": true,
  "data": {
    "week_start": "2026-03-24",
    "week_end": "2026-03-30",
    "total_prayed": 20,
    "total_possible": 35,
    "grid": {
      "fajr":   ["mosque", "home", "missed", "pending", "pending", "pending", "pending"],
      "dhuhr":  ["mosque", "mosque", "home", "pending", "pending", "pending", "pending"],
      "asr":    ["home", "missed", "pending", "pending", "pending", "pending", "pending"],
      "maghrib":["mosque", "mosque", "mosque", "mosque", "pending", "pending", "pending"],
      "isha":   ["home", "home", "home", "pending", "pending", "pending", "pending"]
    }
  }
}
```

> Array index 0 = Saturday (السبت), index 6 = Friday (الجمعة) — RTL week order.

---

### 3.5 Adhkar

#### `POST /adhkar/complete`
Mark an Adhkar category as completed for today.

**Request:**
```json
{
  "user_id": "uuid",
  "category": "morning",
  "date": "2026-03-30"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "morning",
    "gems_awarded": 4,
    "new_gem_total": 104,
    "streak": 3
  }
}
```

---

#### `GET /adhkar/progress/:user_id`
Get today's Adhkar completion status across all categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-30",
    "categories": {
      "morning":      { "completed": true,  "completed_at": "2026-03-30T07:30:00Z" },
      "evening":      { "completed": false, "completed_at": null },
      "sleep":        { "completed": false, "completed_at": null },
      "leaving_home": { "completed": false, "completed_at": null },
      "mealtime":     { "completed": false, "completed_at": null }
    },
    "overall_percent": 20
  }
}
```

---

### 3.6 Quran

#### `POST /quran/log`
Log a Quran memorization or revision session.

**Request:**
```json
{
  "user_id": "uuid",
  "type": "memorization",
  "surah_name": "سورة النبأ",
  "surah_number": 78,
  "verse_count": 6,
  "date": "2026-03-30"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session_id": "uuid",
    "type": "memorization",
    "verse_count": 6,
    "total_memorized_today": 6,
    "daily_goal": 5,
    "goal_reached": true,
    "gems_awarded": 8,
    "new_gem_total": 112,
    "streak": 12,
    "lifetime_total": 1006
  }
}
```

> **Note:** When `goal_reached: true`, frontend triggers the Quran goal modal.

---

#### `GET /quran/stats/:user_id`
Get full Quran stats for the Quran screen.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_memorized": 1000,
    "total_revised": 450,
    "current_surah": "سورة النبأ",
    "current_surah_number": 78,
    "daily_memorize_goal": 5,
    "daily_revision_goal": 15,
    "memorized_today": 3,
    "revised_today": 0,
    "weekly_activity": [false, false, false, false, true, true, true]
  }
}
```

> `weekly_activity`: array of 7 booleans — index 0 = Saturday, index 6 = Friday.

---

### 3.7 Tasbih

#### `POST /tasbih/update`
Update Tasbih counter (called on each tap).

**Request:**
```json
{
  "user_id": "uuid",
  "type": "allahu_akbar",
  "date": "2026-03-30"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "allahu_akbar": 15,
    "subhan_allah": 33,
    "alhamdulillah": 33,
    "completed": false,
    "gems_awarded": 0
  }
}
```

> **Note:** When all three reach 33 (`completed: true`), gems are awarded and frontend triggers the Tasbih completion modal.

---

#### `GET /tasbih/:user_id`
Get current Tasbih state for today.

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-03-30",
    "allahu_akbar": 15,
    "subhan_allah": 33,
    "alhamdulillah": 33,
    "completed": false
  }
}
```

---

### 3.8 Gems

#### `GET /gems/:user_id`
Get current gem total.

```json
{ "success": true, "data": { "total": 100 } }
```

---

#### `POST /gems/award`
Internal endpoint — award gems for a completed activity.

**Request:**
```json
{
  "user_id": "uuid",
  "activity": "prayer_all_five",
  "amount": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": { "previous": 95, "awarded": 5, "new_total": 100 }
}
```

**Activity values:**
| Activity Key | Gems |
|---|---|
| `prayer_all_five` | +5 |
| `quran_daily_goal` | +8 |
| `tasbih_complete` | +3 |
| `adhkar_morning` | +4 |
| `adhkar_evening` | TBD |
| `adhkar_sleep` | TBD |
| `adhkar_leaving_home` | TBD |
| `adhkar_mealtime` | TBD |

---

### 3.9 Streaks

#### `GET /streaks/:user_id`

```json
{
  "success": true,
  "data": {
    "prayer_streak": 7,
    "quran_streak": 12,
    "tasbih_streak": 5,
    "adhkar_streak": 3
  }
}
```

---

### 3.10 Achievements

#### `GET /achievements/:user_id`
Get all achievements earned by user.

```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "key": "fajr_knight",
        "name_ar": "فارس الفجر",
        "icon_url": "...",
        "earned_at": "2026-03-20T06:00:00Z"
      }
    ],
    "total_earned": 2
  }
}
```

---

#### `POST /achievements/check`
Internal endpoint — runs after any activity to check if new badges were earned.

**Request:**
```json
{ "user_id": "uuid", "trigger": "prayer_logged" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "new_achievements": [
      { "key": "fajr_knight", "name_ar": "فارس الفجر", "gems_bonus": 0 }
    ]
  }
}
```

---

## 4. Business Logic & Gamification Rules

### 4.1 Daily Progress Calculation (`today_percent`)

```
today_percent = average of:
  - prayers_percent   = (prayers_completed / 5) * 100
  - adhkar_percent    = (adhkar_categories_done / 5) * 100
  - verses_percent    = min((verses_memorized_today / daily_goal) * 100, 100)
  - tasbih_percent    = tasbih_completed ? 100 : (total_counts / 99) * 100
```

---

### 4.2 Gem Award Rules

Gems are awarded **once per activity per day**. Re-completing does not award additional gems.

```
prayer_all_five:    +5 gems  → triggered when 5th prayer of the day is logged (any status except "missed")
quran_daily_goal:   +8 gems  → triggered when verse_count_today >= daily_memorize_goal
tasbih_complete:    +3 gems  → triggered when allahu_akbar=33 AND subhan_allah=33 AND alhamdulillah=33
adhkar_morning:     +4 gems  → triggered when morning category marked complete
adhkar_*:           TBD      → pending gem values from product
```

---

### 4.3 Streak Logic

Run this check after **each** activity log:

```python
def update_streak(user_id, activity_type, today):
    last_date = get_last_activity_date(user_id, activity_type)

    if last_date is None:
        set_streak(user_id, activity_type, 1)
    elif last_date == today - 1 day:
        increment_streak(user_id, activity_type)
    elif last_date == today:
        pass  # Already logged today — no change
    else:
        reset_streak(user_id, activity_type, 1)  # Streak broken

    set_last_activity_date(user_id, activity_type, today)
```

---

### 4.4 Achievement Check Logic

Run `POST /achievements/check` after every activity. Check criteria:

```python
# فارس الفجر — Fajr Knight
if fajr_streak >= 7:
    award_achievement(user_id, "fajr_knight")

# بطل الأسبوع — Hero of the Week
if weekly_prayers_count == 35:  # All 5 prayers × 7 days
    award_achievement(user_id, "hero_of_week")

# تاج الحافظ milestones — pending full criteria list
if total_memorized >= 100:
    award_achievement(user_id, "memorizer_100")
# ... etc
```

> Always use `INSERT ... ON CONFLICT DO NOTHING` — achievements are never awarded twice.

---

### 4.5 Weekly Prayer Grid Population

- Week definition: **Saturday → Friday** (matches Islamic/Arabic calendar convention)
- `prayers` table rows are queried by `prayed_at` between `week_start` and `week_end`
- Missing rows for a day = `"pending"` status
- Display order in grid: `fajr | dhuhr | asr | maghrib | isha` (rows), `sat→fri` (columns)

---

### 4.6 Quran Daily Goal Logic

```
memorized_today  = SUM(verse_count) WHERE user_id=X AND type='memorization' AND date=today
revised_today    = SUM(verse_count) WHERE user_id=X AND type='revision' AND date=today

goal_reached = memorized_today >= daily_memorize_goal
```

Multiple sessions per day are **additive** — child can log 3 verses, then 2 more, to hit a goal of 5.

---

## 5. Data Reset & Scheduling

| Data | Reset Frequency | Logic |
|------|----------------|-------|
| Prayer statuses (daily) | Daily at midnight | New rows inserted each day — old rows remain for history |
| Adhkar completion | Daily at midnight | New rows for each new day |
| Tasbih session | Daily at midnight | New row for each new day |
| Quran daily verse count | Daily at midnight | Calculated from `quran_sessions` filtered by date |
| Streaks | Never reset manually | Broken automatically if no activity logged the previous day |
| Gem total | Never reset | Lifetime running total |
| Achievements | Never reset | Once earned, permanent |
| Weekly grids | Archived weekly | Current week = `date BETWEEN week_start AND week_end` |

> **Important:** No actual deletion of historical data. All records are kept.
> Daily "reset" means a new day's records simply don't exist yet — frontend interprets missing records as `pending`.

---

## 6. Open Questions for Engineering

| # | Area | Question | Priority |
|---|------|----------|----------|
| 1 | Auth | Is there a parent account system? Or is it single-user per device with no login? | 🔴 High |
| 2 | Prayer Times | How are prayer times calculated — GPS, city selection, or not tracked at all? | 🔴 High |
| 3 | Prayer Gems | Do mosque vs. home prayers give different gem amounts? | 🔴 High |
| 4 | Adhkar Interaction | How does a child mark a single Adhkar card as "read"? Tap or button? | 🔴 High |
| 5 | Adhkar Gems | What are the gem rewards for each of the 5 Adhkar categories? | 🔴 High |
| 6 | Surah List | Provide the full Surah list (name + number + verse count) for the Quran dropdown | 🔴 High |
| 7 | Tasbih | Is the Tasbih counter persisted to the backend per tap, or only on completion? | 🟡 Medium |
| 8 | Quran Goals | Are daily memorization/revision goals fixed (5/15) or user-configurable? | 🟡 Medium |
| 9 | Achievement Criteria | Full list of all achievement badges and their unlock criteria | 🟡 Medium |
| 10 | تاج الحافظ | Is this a level system with tiers? Or a single title earned once? | 🟡 Medium |
| 11 | Gem Spending | Can gems be spent on anything, or are they only a score display? | 🟡 Medium |
| 12 | Offline Mode | Should Tasbih/Adhkar work offline and sync later? | 🟢 Low |
| 13 | Notifications | Backend push notification support needed for prayer time reminders? | 🟡 Medium |
| 14 | Tasbih Screen | Tasbih screen designs not yet provided — needed before finalizing this table | 🔴 High |
| 15 | Week Start Day | Confirm: does the week start on Saturday (السبت) or Sunday (الأحد)? | 🔴 High |

---

*End of Document — NoorPath Backend Documentation v1.0*
*Prepared based on UI/UX design screens. All values marked TBD require product confirmation before implementation.*
