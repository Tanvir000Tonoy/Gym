import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

const STORAGE_KEY = "gym-tracker-v1";

const accent = "#c8f135";
const accent2 = "#59f3c0";
const bg = "#08111b";
const panel = "rgba(14, 22, 34, 0.88)";
const panelStrong = "rgba(20, 31, 47, 0.96)";
const border = "rgba(255, 255, 255, 0.08)";
const text = "#f4f7fb";
const textMuted = "#94a3b8";

const defaultProfile = {
  name: "Tonoy",
  age: 22,
  weight: 56,
  height: 162,
  goal: "Lean bulk",
  sessionsPerWeek: 5,
  workoutType: "strength",
};

const defaultWorkoutDays = [
  {
    id: "push",
    day: "Day 1",
    focus: "Chest & Triceps",
    tag: "Push",
    exercises: [
      { name: "Barbell Bench Press", sets: "4 × 8–10", calories: 48 },
      { name: "Incline Dumbbell Press", sets: "3 × 10–12", calories: 38 },
      { name: "Cable Chest Fly", sets: "3 × 12–15", calories: 24 },
      { name: "Tricep Rope Pushdown", sets: "3 × 12–15", calories: 20 },
      { name: "Overhead Tricep Extension", sets: "3 × 10–12", calories: 22 },
    ],
  },
  {
    id: "pull",
    day: "Day 2",
    focus: "Back & Biceps",
    tag: "Pull",
    exercises: [
      { name: "Deadlift", sets: "4 × 5–6", calories: 55 },
      { name: "Lat Pulldown", sets: "4 × 10–12", calories: 34 },
      { name: "Seated Cable Row", sets: "3 × 10–12", calories: 28 },
      { name: "Barbell Curl", sets: "3 × 10–12", calories: 18 },
      { name: "Hammer Curl", sets: "3 × 12", calories: 16 },
    ],
  },
  {
    id: "legs",
    day: "Day 3",
    focus: "Legs & Core",
    tag: "Legs",
    exercises: [
      { name: "Barbell Squat", sets: "4 × 8–10", calories: 58 },
      { name: "Romanian Deadlift", sets: "3 × 10–12", calories: 40 },
      { name: "Leg Press", sets: "3 × 12–15", calories: 34 },
      { name: "Leg Curl (Machine)", sets: "3 × 12–15", calories: 22 },
      { name: "Plank", sets: "3 × 45–60 sec", calories: 14 },
    ],
  },
  {
    id: "shoulders",
    day: "Day 4",
    focus: "Shoulders & Arms",
    tag: "Push/Pull",
    exercises: [
      { name: "Seated DB Shoulder Press", sets: "4 × 10–12", calories: 34 },
      { name: "Lateral Raise", sets: "4 × 15–20", calories: 18 },
      { name: "Face Pulls", sets: "3 × 15", calories: 20 },
      { name: "EZ-Bar Curl", sets: "3 × 10–12", calories: 16 },
      { name: "Skull Crusher", sets: "3 × 10–12", calories: 16 },
    ],
  },
  {
    id: "fullbody",
    day: "Day 5",
    focus: "Full Body & Weak Points",
    tag: "Full Body",
    exercises: [
      { name: "Pull-Ups / Assisted Pull-Ups", sets: "4 × max reps", calories: 44 },
      { name: "Dumbbell Lunges", sets: "3 × 10 each leg", calories: 30 },
      { name: "Incline DB Curl", sets: "3 × 12", calories: 16 },
      { name: "Cable Lateral Raise", sets: "3 × 15", calories: 18 },
      { name: "Calf Raise", sets: "4 × 20", calories: 16 },
    ],
  },
];

const exerciseTutorials = {
  "Barbell Bench Press": {
    videoQuery: "Barbell Bench Press tutorial",
    steps: ["Plant your feet and keep your upper back tight.", "Lower the bar to mid-chest with control.", "Press up in a stable path without bouncing."],
  },
  "Incline Dumbbell Press": {
    videoQuery: "Incline Dumbbell Press tutorial",
    steps: ["Set the bench to a 30-45 degree incline.", "Lower dumbbells to upper-chest level.", "Press up without clanking the weights together."],
  },
  "Cable Chest Fly": {
    videoQuery: "Cable Chest Fly tutorial",
    steps: ["Set the handles slightly above shoulder height.", "Bring your hands together in a wide arc.", "Keep a soft bend in the elbows throughout."],
  },
  "Tricep Rope Pushdown": {
    videoQuery: "Tricep Rope Pushdown tutorial",
    steps: ["Keep elbows pinned to your sides.", "Push the rope down and split it at the bottom.", "Return slowly without letting elbows drift forward."],
  },
  "Overhead Tricep Extension": {
    videoQuery: "Overhead Tricep Extension tutorial",
    steps: ["Brace your core and keep ribs down.", "Lower the weight behind your head.", "Extend fully while keeping elbows narrow."],
  },
  Deadlift: {
    videoQuery: "Deadlift tutorial",
    steps: ["Set your feet under the bar and brace hard.", "Push the floor away while keeping the bar close.", "Lock out by standing tall, not leaning back."],
  },
  "Lat Pulldown": {
    videoQuery: "Lat Pulldown tutorial",
    steps: ["Lean back slightly and set your chest up.", "Pull elbows down toward your hips.", "Pause briefly before controlling the return."],
  },
  "Seated Cable Row": {
    videoQuery: "Seated Cable Row tutorial",
    steps: ["Sit tall with a neutral spine.", "Row the handle to your lower ribs.", "Squeeze shoulder blades, then return slowly."],
  },
  "Barbell Curl": {
    videoQuery: "Barbell Curl tutorial",
    steps: ["Stand tall with elbows slightly in front of your body.", "Curl without swinging your torso.", "Lower fully to finish each rep."],
  },
  "Hammer Curl": {
    videoQuery: "Hammer Curl tutorial",
    steps: ["Use a neutral grip with palms facing in.", "Lift while keeping elbows pinned.", "Lower under control for the forearm and biceps."],
  },
  "Barbell Squat": {
    videoQuery: "Barbell Squat tutorial",
    steps: ["Set your feet shoulder-width and brace your core.", "Sit down between your hips with knees tracking toes.", "Drive up through mid-foot and keep your chest proud."],
  },
  "Romanian Deadlift": {
    videoQuery: "Romanian Deadlift tutorial",
    steps: ["Keep a soft bend in the knees.", "Hinge the hips back until you feel your hamstrings stretch.", "Drive hips forward to stand tall."],
  },
  "Leg Press": {
    videoQuery: "Leg Press tutorial",
    steps: ["Place your feet shoulder-width on the platform.", "Lower the sled until thighs are near your chest.", "Press through the whole foot without locking knees."],
  },
  "Leg Curl (Machine)": {
    videoQuery: "Leg Curl Machine tutorial",
    steps: ["Align your knees with the machine pivot.", "Curl your heels toward your glutes.", "Pause and lower slowly to keep tension."],
  },
  Plank: {
    videoQuery: "Plank exercise tutorial",
    steps: ["Set elbows under shoulders and squeeze glutes.", "Keep your body in a straight line.", "Breathe steadily and avoid sagging hips."],
  },
  "Seated DB Shoulder Press": {
    videoQuery: "Seated Dumbbell Shoulder Press tutorial",
    steps: ["Sit tall with dumbbells at shoulder height.", "Press overhead without flaring elbows too wide.", "Lower with control to shoulder level."],
  },
  "Lateral Raise": {
    videoQuery: "Lateral Raise tutorial",
    steps: ["Lean slightly forward and keep a soft elbow bend.", "Lift the dumbbells out to shoulder height.", "Lead with elbows, not hands."],
  },
  "Face Pulls": {
    videoQuery: "Face Pull tutorial",
    steps: ["Set the rope at upper-chest or face height.", "Pull toward your forehead with elbows high.", "Squeeze rear delts and upper back."],
  },
  "EZ-Bar Curl": {
    videoQuery: "EZ Bar Curl tutorial",
    steps: ["Grip the EZ bar comfortably and stand upright.", "Curl without swinging your torso.", "Lower slowly and fully extend."],
  },
  "Skull Crusher": {
    videoQuery: "Skull Crusher tutorial",
    steps: ["Keep elbows fixed and upper arms vertical.", "Lower the bar toward the forehead or behind it.", "Extend elbows only to finish the rep."],
  },
  "Pull-Ups / Assisted Pull-Ups": {
    videoQuery: "Pull Up tutorial",
    steps: ["Start from a dead hang with shoulders engaged.", "Pull chest toward the bar using your back.", "Lower all the way under control."],
  },
  "Dumbbell Lunges": {
    videoQuery: "Dumbbell Lunge tutorial",
    steps: ["Step forward with a stable torso.", "Lower until both knees bend around 90 degrees.", "Push through the front heel to stand."],
  },
  "Incline DB Curl": {
    videoQuery: "Incline Dumbbell Curl tutorial",
    steps: ["Set the bench to a low incline and let arms hang back.", "Curl while keeping shoulders still.", "Squeeze at the top and lower slowly."],
  },
  "Cable Lateral Raise": {
    videoQuery: "Cable Lateral Raise tutorial",
    steps: ["Set the cable low and hold the handle with a slight lean.", "Raise the arm to shoulder height.", "Control the return and keep tension on the delt."],
  },
  "Calf Raise": {
    videoQuery: "Calf Raise tutorial",
    steps: ["Use a full stretch at the bottom.", "Drive up onto the balls of your feet.", "Pause at the top and lower slowly."],
  },
};

const styles = {
  app: {
    minHeight: "100vh",
    background: `radial-gradient(circle at top, rgba(89, 243, 192, 0.12), transparent 28%), radial-gradient(circle at right, rgba(200, 241, 53, 0.1), transparent 18%), ${bg}`,
    color: text,
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "0 0 40px",
  },
  hero: {
    background: `linear-gradient(145deg, rgba(10, 18, 29, 0.98), rgba(13, 27, 43, 0.92))`,
    borderBottom: `1px solid ${border}`,
    padding: "24px 16px 20px",
    position: "relative",
    overflow: "hidden",
  },
  heroAccent: {
    position: "absolute",
    inset: "auto -120px -100px auto",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: `radial-gradient(circle, rgba(200, 241, 53, 0.18) 0%, transparent 68%)`,
    pointerEvents: "none",
  },
  heroLabel: {
    fontSize: 11,
    letterSpacing: 4,
    color: accent,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 34,
    lineHeight: 0.95,
    letterSpacing: -1.5,
    color: text,
    margin: "0 0 6px 0",
  },
  heroSub: {
    color: textMuted,
    fontSize: 14,
    marginBottom: 18,
  },
  heroTop: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 8,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: "50%",
    border: `2px solid ${accent}`,
    background: "rgba(255,255,255,0.06)",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: "50%",
    border: `2px solid ${accent}`,
    background: `linear-gradient(135deg, rgba(200,241,53,0.24), rgba(89,243,192,0.14))`,
    color: text,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 800,
    flexShrink: 0,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
    marginTop: 18,
  },
  statRow: {
    display: "flex",
    gap: 12,
    flexDirection: "column",
    marginTop: 4,
  },
  stat: {
    background: panel,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: "12px 14px",
  },
  statVal: {
    fontSize: 19,
    fontWeight: 700,
    color: accent,
    display: "block",
  },
  statKey: {
    fontSize: 10,
    color: textMuted,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  tabs: {
    display: "flex",
    gap: 4,
    padding: "14px 16px 12px",
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: bg,
    borderBottom: `1px solid ${border}`,
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
    overflowX: "auto",
  },
  tab: (active) => ({
    background: active ? accent : "transparent",
    color: active ? bg : textMuted,
    border: "none",
    borderRadius: "12px 12px 0 0",
    padding: "10px 16px",
    fontFamily: "inherit",
    fontSize: 12,
    letterSpacing: 1,
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    transition: "all 0.18s",
  }),
  section: {
    padding: "28px 16px 0",
    maxWidth: 1080,
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 4,
    color: accent,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  card: {
    background: panel,
    border: `1px solid ${border}`,
    borderRadius: 18,
    padding: "16px",
    marginBottom: 14,
    boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
  },
  dayLabel: {
    fontSize: 11,
    letterSpacing: 3,
    color: accent,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: text,
    marginBottom: 12,
  },
  exerciseRow: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    alignItems: "flex-start",
    gap: 12,
    padding: "9px 0",
    borderBottom: `1px solid ${border}`,
  },
  exNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    color: accent,
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  exName: {
    fontSize: 14,
    color: text,
    fontWeight: 600,
    marginBottom: 2,
    overflowWrap: "anywhere",
  },
  exLink: {
    color: accent,
    textDecoration: "none",
    cursor: "pointer",
  },
  exDetail: {
    fontSize: 11,
    color: textMuted,
  },
  tutorialPanel: {
    marginTop: 16,
    background: `linear-gradient(180deg, rgba(200,241,53,0.08), rgba(14,22,34,0.96))`,
    border: `1px solid rgba(200,241,53,0.18)`,
    borderRadius: 18,
    padding: 16,
  },
  tutorialHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: text,
    marginBottom: 4,
  },
  tutorialSubtitle: {
    fontSize: 13,
    color: textMuted,
    lineHeight: 1.6,
  },
  tutorialPills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tutorialPill: {
    borderRadius: 999,
    border: `1px solid ${border}`,
    padding: "8px 12px",
    background: "transparent",
    color: text,
    cursor: "pointer",
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  tutorialSteps: {
    display: "grid",
    gap: 8,
    marginTop: 14,
  },
  tutorialStep: {
    borderRadius: 14,
    padding: "12px 14px",
    background: panelStrong,
    border: `1px solid ${border}`,
    color: text,
    fontSize: 13,
    lineHeight: 1.55,
  },
  tutorialActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
  },
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
  },
  reportHero: {
    padding: 20,
    borderRadius: 22,
    background: `linear-gradient(135deg, rgba(200,241,53,0.09), rgba(89,243,192,0.07))`,
    border: `1px solid rgba(200,241,53,0.18)`,
  },
  reportTitle: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 30,
    lineHeight: 1,
    marginBottom: 8,
  },
  reportMeta: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  },
  reportCard: {
    background: panel,
    border: `1px solid ${border}`,
    borderRadius: 18,
    padding: 16,
  },
  reportLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: textMuted,
    marginBottom: 6,
  },
  reportValue: {
    fontSize: 18,
    fontWeight: 700,
    color: text,
  },
  badge: {
    display: "inline-block",
    background: `${accent}18`,
    color: accent,
    border: `1px solid ${accent}44`,
    borderRadius: 6,
    fontSize: 10,
    padding: "2px 8px",
    letterSpacing: 1,
    marginLeft: 8,
    textTransform: "uppercase",
    verticalAlign: "middle",
  },
  macroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
    marginBottom: 14,
  },
  weeklyBars: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  },
  weeklyBarCard: {
    background: panelStrong,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: 12,
  },
  weeklyBarMeta: {
    fontSize: 11,
    color: textMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  weeklyBarTrack: {
    height: 120,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${border}`,
    display: "flex",
    alignItems: "end",
    padding: 6,
    overflow: "hidden",
  },
  weeklyBarTrackSecondary: {
    height: 56,
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${border}`,
    display: "flex",
    alignItems: "end",
    padding: 4,
    marginTop: 8,
    overflow: "hidden",
  },
  weeklyBarFill: {
    width: "100%",
    borderRadius: 10,
    background: `linear-gradient(180deg, ${accent}, rgba(200, 241, 53, 0.28))`,
    minHeight: 18,
  },
  weeklyBarFillSecondary: {
    width: "100%",
    borderRadius: 8,
    background: `linear-gradient(180deg, ${accent2}, rgba(89, 243, 192, 0.28))`,
    minHeight: 18,
  },
  macroCard: {
    background: panel,
    border: `1px solid ${border}`,
    borderRadius: 18,
    padding: "16px 18px",
  },
  macroVal: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 28,
    color: accent,
    lineHeight: 1,
    marginBottom: 2,
  },
  macroKey: {
    fontSize: 11,
    color: textMuted,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
  },
  splitGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  },
  input: {
    width: "100%",
    borderRadius: 12,
    background: panelStrong,
    color: text,
    border: `1px solid ${border}`,
    padding: "12px 13px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    fontSize: 11,
    letterSpacing: 2,
    color: textMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    border: "none",
    borderRadius: 12,
    background: accent,
    color: bg,
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    border: `1px solid ${border}`,
    borderRadius: 12,
    background: "transparent",
    color: text,
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostButton: {
    border: `1px solid ${border}`,
    borderRadius: 999,
    background: "transparent",
    color: textMuted,
    padding: "8px 12px",
    cursor: "pointer",
  },
  timerBox: {
    borderRadius: 20,
    padding: 20,
    background: `linear-gradient(180deg, rgba(89,243,192,0.12), rgba(14,22,34,0.96))`,
    border: `1px solid rgba(89,243,192,0.2)`,
  },
  timerValue: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 52,
    lineHeight: 1,
    margin: "6px 0 4px",
  },
  timerMeta: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
    marginTop: 14,
  },
  metaChip: {
    borderRadius: 14,
    background: panelStrong,
    border: `1px solid ${border}`,
    padding: "12px 14px",
  },
  metaKey: {
    fontSize: 10,
    color: textMuted,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaVal: {
    fontSize: 18,
    fontWeight: 700,
    color: text,
  },
  mealCard: {
    background: panel,
    border: `1px solid ${border}`,
    borderRadius: 18,
    padding: "16px 20px",
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  mealTime: {
    fontSize: 10,
    color: textMuted,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  mealItem: {
    fontSize: 12,
    color: "#cbd5e1",
    padding: "4px 0",
    borderBottom: `1px solid ${border}`,
    display: "flex",
    justifyContent: "space-between",
  },
  tip: {
    background: `linear-gradient(135deg, rgba(200,241,53,0.08), rgba(89,243,192,0.05))`,
    border: `1px solid rgba(200,241,53,0.18)`,
    borderRadius: 16,
    padding: "14px 18px",
    marginBottom: 10,
    fontSize: 13,
    color: "#dbe4ef",
    lineHeight: 1.6,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  progressBar: (pct) => ({
    height: 6,
    borderRadius: 4,
    background: "rgba(255,255,255,0.08)",
    margin: "8px 0 4px",
    overflow: "hidden",
    position: "relative",
  }),
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${accent}, ${accent2})`,
    borderRadius: 4,
    transition: "width 0.6s ease",
  }),
};

const secondsToClock = (seconds) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainder = totalSeconds % 60;
  return [hours, minutes, remainder].map((value) => String(value).padStart(2, "0")).join(":");
};

const formatDate = (isoValue) => {
  if (!isoValue) {
    return "No session yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoValue));
};

const formatDayShort = (isoValue) => new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(isoValue));

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const calculateStreakDays = (sessionsList) => {
  if (!sessionsList.length) {
    return 0;
  }

  const uniqueDays = [...new Set(sessionsList.map((session) => startOfDay(session.endedAt ?? session.startedAt).getTime()))].sort(
    (left, right) => right - left
  );

  let streak = 1;
  let expectedDay = new Date(uniqueDays[0]);

  for (let index = 1; index < uniqueDays.length; index += 1) {
    expectedDay = new Date(expectedDay);
    expectedDay.setDate(expectedDay.getDate() - 1);

    if (uniqueDays[index] !== expectedDay.getTime()) {
      break;
    }

    streak += 1;
  }

  return streak;
};

const buildWeeklyAnalytics = (sessionsList) => {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      label: formatDayShort(date),
      key: date.toDateString(),
      sessions: 0,
      minutes: 0,
      calories: 0,
    };
  });

  const lookup = new Map(days.map((day) => [day.key, day]));

  sessionsList.forEach((session) => {
    const dayKey = startOfDay(session.endedAt ?? session.startedAt).toDateString();
    const bucket = lookup.get(dayKey);
    if (!bucket) {
      return;
    }

    bucket.sessions += 1;
    bucket.minutes += Math.max(1, Math.round(session.elapsedSeconds / 60));
    bucket.calories += session.caloriesBurned;
  });

  return {
    days,
    maxMinutes: Math.max(1, ...days.map((day) => day.minutes)),
    maxCalories: Math.max(1, ...days.map((day) => day.calories)),
    totalSessions: days.reduce((sum, day) => sum + day.sessions, 0),
    totalMinutes: days.reduce((sum, day) => sum + day.minutes, 0),
    totalCalories: days.reduce((sum, day) => sum + day.calories, 0),
  };
};

const downloadJson = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });

const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read backup file."));
    reader.readAsText(file);
  });

const createSession = (day, profile) => {
  const startedAt = new Date().toISOString();
  return {
    id: `${day.id}-${Date.now()}`,
    dayId: day.id,
    dayLabel: day.day,
    focus: day.focus,
    startedAt,
    endedAt: null,
    elapsedSeconds: 0,
    caloriesBurned: 0,
    completedExerciseIds: [],
    notes: "",
    profileSnapshot: {
      name: profile.name,
      weight: profile.weight,
      workoutType: profile.workoutType,
    },
  };
};

const estimateCaloriesBurned = (seconds, weight, workoutType) => {
  const intensityMap = {
    strength: 0.062,
    cardio: 0.095,
    mixed: 0.078,
  };
  const factor = intensityMap[workoutType] ?? intensityMap.strength;
  return Math.max(0, Math.round((seconds / 60) * weight * factor));
};

const calculateBmi = (weight, height) => (weight / ((height / 100) * (height / 100))).toFixed(1);

const getTdee = (profile) => {
  const base = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  const activityMultiplier = {
    strength: 1.5,
    cardio: 1.55,
    mixed: 1.6,
  }[profile.workoutType] ?? 1.5;
  return Math.round(base * activityMultiplier);
};

const loadState = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
};

const defaultSessionSummary = {
  totalSessions: 0,
  totalCalories: 0,
  totalMinutes: 0,
  streakDays: 0,
  lastWorkoutDate: null,
};

export default function FitnessApp() {
  const storedState = loadState();
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 0 : window.innerWidth));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedDay, setExpandedDay] = useState(0);
  const [profile, setProfile] = useState(storedState?.profile ?? defaultProfile);
  const [profilePhoto, setProfilePhoto] = useState(storedState?.profilePhoto ?? "");
  const [sessions, setSessions] = useState(storedState?.sessions ?? []);
  const [sessionSummary, setSessionSummary] = useState(storedState?.summary ?? defaultSessionSummary);
  const [activeSession, setActiveSession] = useState(storedState?.activeSession ?? null);
  const [selectedDayId, setSelectedDayId] = useState(storedState?.selectedDayId ?? defaultWorkoutDays[0].id);
  const [sessionNotes, setSessionNotes] = useState("");
  const [customName, setCustomName] = useState(profile.name);
  const [customWeight, setCustomWeight] = useState(String(profile.weight));
  const [customHeight, setCustomHeight] = useState(String(profile.height));
  const [customGoal, setCustomGoal] = useState(profile.goal);
  const [customSessionsPerWeek, setCustomSessionsPerWeek] = useState(String(profile.sessionsPerWeek));
  const [customWorkoutType, setCustomWorkoutType] = useState(profile.workoutType);
  const [selectedExerciseName, setSelectedExerciseName] = useState(defaultWorkoutDays[0].exercises[0].name);
  const tickRef = useRef(null);
  const backupInputRef = useRef(null);
  const isDesktop = viewportWidth >= 960;

  useEffect(() => {
    if (!activeSession) {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }

    tickRef.current = window.setInterval(() => {
      setActiveSession((current) => {
        if (!current || current.isPaused) {
          return current;
        }

        const nextElapsed = current.elapsedSeconds + 1;
        const caloriesBurned = estimateCaloriesBurned(nextElapsed, profile.weight, profile.workoutType);
        return {
          ...current,
          elapsedSeconds: nextElapsed,
          caloriesBurned,
        };
      });
    }, 1000);

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [activeSession, profile.weight, profile.workoutType]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, profilePhoto, sessions, summary: sessionSummary, activeSession, selectedDayId })
    );
  }, [profile, profilePhoto, sessions, sessionSummary, activeSession, selectedDayId]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const currentDay = defaultWorkoutDays.find((day) => day.id === selectedDayId) ?? defaultWorkoutDays[0];
    const currentExerciseExists = currentDay.exercises.some((exercise) => exercise.name === selectedExerciseName);
    if (!currentExerciseExists) {
      setSelectedExerciseName(currentDay.exercises[0].name);
    }
  }, [selectedDayId, selectedExerciseName]);

  const bmi = calculateBmi(profile.weight, profile.height);
  const tdee = getTdee(profile);
  const targetCalories = Math.round(tdee + 250);
  const protein = Math.round(profile.weight * 2.2);
  const carbs = Math.round((targetCalories * 0.45) / 4);
  const fats = Math.round((targetCalories * 0.25) / 9);
  const activeDay = defaultWorkoutDays.find((day) => day.id === selectedDayId) ?? defaultWorkoutDays[0];
  const weeklyAnalytics = buildWeeklyAnalytics(sessions);
  const streakDays = calculateStreakDays(sessions);
  const selectedExercise = exerciseTutorials[selectedExerciseName] ?? exerciseTutorials[activeDay.exercises[0].name];

  const totalExercisesDone = sessions.reduce((sum, session) => sum + session.completedExerciseIds.length, 0);
  const currentDuration = activeSession?.elapsedSeconds ?? 0;
  const currentCalories = activeSession?.caloriesBurned ?? 0;
  const completionRate = activeSession
    ? Math.round((activeSession.completedExerciseIds.length / activeDay.exercises.length) * 100)
    : 0;

  const beginSession = () => {
    if (activeSession) {
      return;
    }

    setSessionNotes("");
    setActiveSession(createSession(activeDay, profile));
    setActiveTab("workout");
  };

  const pauseSession = () => {
    setActiveSession((current) => (current ? { ...current, isPaused: true } : current));
  };

  const resumeSession = () => {
    setActiveSession((current) => (current ? { ...current, isPaused: false } : current));
  };

  const toggleExerciseDone = (exerciseName) => {
    setActiveSession((current) => {
      if (!current) {
        return current;
      }

      const isCompleted = current.completedExerciseIds.includes(exerciseName);
      return {
        ...current,
        completedExerciseIds: isCompleted
          ? current.completedExerciseIds.filter((item) => item !== exerciseName)
          : [...current.completedExerciseIds, exerciseName],
      };
    });
  };

  const finishSession = () => {
    if (!activeSession) {
      return;
    }

    const endedAt = new Date().toISOString();
    const completedSession = {
      ...activeSession,
      endedAt,
      elapsedSeconds: Math.max(0, activeSession.elapsedSeconds),
      caloriesBurned: estimateCaloriesBurned(activeSession.elapsedSeconds, profile.weight, profile.workoutType),
      notes: sessionNotes,
      isPaused: false,
    };

    setSessions((current) => [completedSession, ...current]);
    setSessionSummary((current) => ({
      totalSessions: current.totalSessions + 1,
      totalCalories: current.totalCalories + completedSession.caloriesBurned,
      totalMinutes: current.totalMinutes + Math.round(completedSession.elapsedSeconds / 60),
      streakDays: calculateStreakDays([completedSession, ...sessions]),
      lastWorkoutDate: endedAt,
    }));
    setActiveSession(null);
    setSessionNotes("");
  };

  const saveProfile = () => {
    const nextProfile = {
      name: customName.trim() || defaultProfile.name,
      age: defaultProfile.age,
      weight: Number(customWeight) || defaultProfile.weight,
      height: Number(customHeight) || defaultProfile.height,
      goal: customGoal.trim() || defaultProfile.goal,
      sessionsPerWeek: Number(customSessionsPerWeek) || defaultProfile.sessionsPerWeek,
      workoutType: customWorkoutType,
    };

    setProfile(nextProfile);
    if (activeSession) {
      setActiveSession((current) =>
        current
          ? {
              ...current,
              profileSnapshot: {
                name: nextProfile.name,
                weight: nextProfile.weight,
                workoutType: nextProfile.workoutType,
              },
            }
          : current
      );
    }
  };

  const clearProgress = () => {
    setSessions([]);
    setSessionSummary(defaultSessionSummary);
    setActiveSession(null);
    setSessionNotes("");
  };

  const exportProgress = () => {
    downloadJson("gym-progress-backup.json", {
      profile,
      profilePhoto,
      sessions,
      summary: sessionSummary,
      selectedDayId,
      exportedAt: new Date().toISOString(),
    });
  };

  const exportAsPdf = () => {
    setActiveTab("report");
    window.setTimeout(() => window.print(), 150);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setProfilePhoto(dataUrl);
    event.target.value = "";
  };

  const handleBackupImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const rawText = await readFileAsText(file);
      const imported = JSON.parse(rawText);

      if (!imported || typeof imported !== "object") {
        throw new Error("Invalid backup format.");
      }

      const shouldRestore = window.confirm(
        "Importing this backup will replace your current profile, photo, workout sessions, and summary data. Do you want to continue?"
      );

      if (!shouldRestore) {
        return;
      }

      const nextProfile = imported.profile ?? defaultProfile;
      setProfile(nextProfile);
      setCustomName(nextProfile.name ?? defaultProfile.name);
      setCustomWeight(String(nextProfile.weight ?? defaultProfile.weight));
      setCustomHeight(String(nextProfile.height ?? defaultProfile.height));
      setCustomGoal(nextProfile.goal ?? defaultProfile.goal);
      setCustomSessionsPerWeek(String(nextProfile.sessionsPerWeek ?? defaultProfile.sessionsPerWeek));
      setCustomWorkoutType(nextProfile.workoutType ?? defaultProfile.workoutType);

      setProfilePhoto(imported.profilePhoto ?? "");
      setSessions(Array.isArray(imported.sessions) ? imported.sessions : []);
      setSessionSummary(imported.summary ?? defaultSessionSummary);
      setSelectedDayId(imported.selectedDayId ?? defaultWorkoutDays[0].id);
      setActiveSession(null);
      setSessionNotes("");
      setActiveTab("report");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to import backup.");
    } finally {
      event.target.value = "";
    }
  };

  const triggerBackupImport = () => {
    backupInputRef.current?.click();
  };

  const workoutHistory = sessions.slice(0, 6);
  const sectionStyle = {
    ...styles.section,
    padding: isDesktop ? "24px 24px 0" : styles.section.padding,
  };
  const heroStyle = {
    ...styles.hero,
    padding: isDesktop ? "36px 24px 28px" : styles.hero.padding,
  };
  const heroTitleStyle = {
    ...styles.heroTitle,
    fontSize: isDesktop ? 46 : styles.heroTitle.fontSize,
  };
  const statRowStyle = {
    ...styles.statRow,
    flexDirection: isDesktop ? "row" : "column",
    flexWrap: isDesktop ? "wrap" : "nowrap",
  };
  const dashboardGridStyle = {
    ...styles.dashboardGrid,
    gridTemplateColumns: isDesktop ? "minmax(0, 1.2fr) minmax(0, 0.8fr)" : styles.dashboardGrid.gridTemplateColumns,
  };
  const splitGridStyle = {
    ...styles.splitGrid,
    gridTemplateColumns: isDesktop ? "repeat(2, minmax(0, 1fr))" : styles.splitGrid.gridTemplateColumns,
  };
  const formGridStyle = {
    ...styles.formGrid,
    gridTemplateColumns: isDesktop ? "repeat(2, minmax(0, 1fr))" : styles.formGrid.gridTemplateColumns,
  };
  const macroGridStyle = {
    ...styles.macroGrid,
    gridTemplateColumns: isDesktop ? "repeat(4, minmax(0, 1fr))" : styles.macroGrid.gridTemplateColumns,
  };
  const weeklyBarsStyle = {
    ...styles.weeklyBars,
    gridTemplateColumns: isDesktop ? "repeat(7, minmax(0, 1fr))" : styles.weeklyBars.gridTemplateColumns,
  };
  const timerMetaStyle = {
    ...styles.timerMeta,
    gridTemplateColumns: isDesktop ? "repeat(3, minmax(0, 1fr))" : styles.timerMeta.gridTemplateColumns,
  };

  return (
    <div style={styles.app}>
      <div style={heroStyle}>
        <div style={styles.heroAccent} />
        <div style={styles.heroLabel}>// Personalized training dashboard</div>
          <div style={styles.heroTop}>
            {profilePhoto ? (
              <img src={profilePhoto} alt={`${profile.name}'s profile`} style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>{profile.name.charAt(0).toUpperCase()}</div>
            )}
            <h1 style={heroTitleStyle}>
              {profile.name}
              <br />
              WORKOUT
              <br />
              LOG
            </h1>
          </div>
        <div style={styles.heroSub}>
          Track every session, keep your timer running, and save your progress locally on this device.
        </div>
        <div style={statRowStyle}>
          {[
            { key: "Weight", val: `${profile.weight} kg` },
            { key: "Height", val: `${profile.height} cm` },
            { key: "BMI", val: bmi },
            { key: "Target kcal", val: `${targetCalories}` },
          ].map((stat) => (
            <div key={stat.key} style={styles.stat}>
              <span style={styles.statVal}>{stat.val}</span>
              <span style={styles.statKey}>{stat.key}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="no-print" style={styles.tabs}>
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "workout", label: "Workout" },
          { id: "history", label: "History" },
          { id: "nutrition", label: "Nutrition" },
          { id: "report", label: "Report" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button key={tab.id} style={styles.tab(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div style={sectionStyle}>
          <div style={dashboardGridStyle}>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Today&apos;s Session</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{activeDay.focus}</div>
              <div style={{ color: textMuted, fontSize: 13, lineHeight: 1.6 }}>
                Start a live workout, track elapsed time, and save your completed session with calories burned.
              </div>
              <div style={styles.buttonRow}>
                <button style={styles.primaryButton} onClick={beginSession} disabled={Boolean(activeSession)}>
                  {activeSession ? "Session running" : "Start workout"}
                </button>
                <button style={styles.secondaryButton} onClick={() => setActiveTab("workout")}>
                  Open workout
                </button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Progress</div>
              <div style={macroGridStyle}>
                {[
                  { key: "Workouts", val: sessionSummary.totalSessions, unit: "sessions" },
                  { key: "Minutes", val: sessionSummary.totalMinutes, unit: "min" },
                  { key: "Calories", val: sessionSummary.totalCalories, unit: "kcal" },
                  { key: "Streak", val: streakDays || sessionSummary.streakDays, unit: "days" },
                ].map((stat) => (
                  <div key={stat.key} style={styles.macroCard}>
                    <div style={styles.macroVal}>
                      {stat.val}
                      <span style={{ fontSize: 14, color: textMuted }}> {stat.unit}</span>
                    </div>
                    <div style={styles.macroKey}>{stat.key}</div>
                  </div>
                ))}
              </div>
              <div style={styles.tip}>
                <span style={styles.tipIcon}>📅</span>
                Last workout: <b style={{ color: accent }}>{formatDate(sessionSummary.lastWorkoutDate)}</b>. Your progress is stored in localStorage.
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Weekly Momentum</div>
            <div style={{ color: textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
              This week you trained {weeklyAnalytics.totalSessions} times for {weeklyAnalytics.totalMinutes} minutes and burned {weeklyAnalytics.totalCalories} kcal.
            </div>
            <div style={weeklyBarsStyle}>
              {weeklyAnalytics.days.map((day) => {
                const calorieHeight = Math.max(18, (day.calories / weeklyAnalytics.maxCalories) * 100);
                const minuteHeight = Math.max(18, (day.minutes / weeklyAnalytics.maxMinutes) * 100);

                return (
                  <div key={day.key} style={styles.weeklyBarCard}>
                    <div style={styles.weeklyBarMeta}>{day.label}</div>
                    <div style={styles.weeklyBarTrack}>
                      <div style={{ ...styles.weeklyBarFill, height: `${calorieHeight}%` }} />
                    </div>
                    <div style={styles.weeklyBarTrackSecondary}>
                      <div style={{ ...styles.weeklyBarFillSecondary, height: `${minuteHeight}%` }} />
                    </div>
                    <div style={{ color: textMuted, fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
                      {day.sessions} session{day.sessions === 1 ? "" : "s"} · {day.minutes} min · {day.calories} kcal
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "workout" && (
        <div style={sectionStyle}>
          <div style={splitGridStyle}>
            <div>
              <div style={styles.card}>
                <div style={styles.sectionTitle}>Live Session</div>
                <div style={styles.timerBox}>
                  <div style={{ color: textMuted, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                    {activeSession ? `${activeSession.dayLabel} · ${activeSession.focus}` : `Ready for ${activeDay.focus}`}
                  </div>
                  <div style={styles.timerValue}>{secondsToClock(currentDuration)}</div>
                  <div style={{ color: textMuted, fontSize: 13 }}>
                    Calories burned: <b style={{ color: accent }}>{currentCalories} kcal</b>
                  </div>
                  <div style={timerMetaStyle}>
                    <div style={styles.metaChip}>
                      <div style={styles.metaKey}>Status</div>
                      <div style={styles.metaVal}>{activeSession ? (activeSession.isPaused ? "Paused" : "Running") : "Idle"}</div>
                    </div>
                    <div style={styles.metaChip}>
                      <div style={styles.metaKey}>Done</div>
                      <div style={styles.metaVal}>
                        {activeSession ? activeSession.completedExerciseIds.length : 0}/{activeDay.exercises.length}
                      </div>
                    </div>
                    <div style={styles.metaChip}>
                      <div style={styles.metaKey}>Completion</div>
                      <div style={styles.metaVal}>{completionRate}%</div>
                    </div>
                  </div>
                  <div style={styles.buttonRow}>
                    <button style={styles.primaryButton} onClick={beginSession} disabled={Boolean(activeSession)}>
                      Start session
                    </button>
                    <button style={styles.secondaryButton} onClick={pauseSession} disabled={!activeSession || activeSession.isPaused}>
                      Pause
                    </button>
                    <button style={styles.secondaryButton} onClick={resumeSession} disabled={!activeSession || !activeSession.isPaused}>
                      Resume
                    </button>
                    <button style={styles.secondaryButton} onClick={finishSession} disabled={!activeSession}>
                      Finish & save
                    </button>
                  </div>
                </div>
                {activeSession && (
                  <div style={{ marginTop: 14 }}>
                    <label style={styles.label} htmlFor="session-notes">
                      Session notes
                    </label>
                    <textarea
                      id="session-notes"
                      value={sessionNotes}
                      onChange={(event) => setSessionNotes(event.target.value)}
                      placeholder="Add notes about form, energy, weight used, or anything you want to remember."
                      style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Workout Split</div>
              <div style={{ marginBottom: 14, color: textMuted, fontSize: 13, lineHeight: 1.6 }}>
                Pick a day, start a timer, then tick off the exercises you complete. Everything is saved automatically.
              </div>
              <div style={styles.buttonRow}>
                {defaultWorkoutDays.map((day) => (
                  <button
                    key={day.id}
                    style={{
                      ...styles.ghostButton,
                      color: selectedDayId === day.id ? bg : text,
                      background: selectedDayId === day.id ? accent : "transparent",
                    }}
                    onClick={() => setSelectedDayId(day.id)}
                  >
                    {day.tag}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={styles.dayLabel}>
                  {activeDay.day} <span style={styles.badge}>{activeDay.tag}</span>
                </div>
                <div style={styles.dayTitle}>{activeDay.focus}</div>
                {activeDay.exercises.map((exercise, index) => {
                  const isDone = activeSession?.completedExerciseIds.includes(exercise.name);
                  const isSelected = selectedExerciseName === exercise.name;
                  return (
                    <div
                      key={exercise.name}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedExerciseName(exercise.name)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedExerciseName(exercise.name);
                        }
                      }}
                      style={{
                        ...styles.exerciseRow,
                        borderBottom: index < activeDay.exercises.length - 1 ? `1px solid ${border}` : "none",
                        opacity: isDone ? 0.8 : 1,
                        cursor: "pointer",
                        background: isSelected ? "rgba(200,241,53,0.05)" : "transparent",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleExerciseDone(exercise.name)}
                        disabled={!activeSession}
                        style={{
                          ...styles.exNum,
                          border: isDone ? `1px solid ${accent}` : "1px solid transparent",
                          cursor: activeSession ? "pointer" : "not-allowed",
                        }}
                      >
                        {isDone ? "✓" : index + 1}
                      </button>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ ...styles.exName, textDecoration: isDone ? "line-through" : "none" }}>{exercise.name}</div>
                        <div style={styles.exDetail}>{exercise.sets}</div>
                      </div>
                      <div style={{ color: accent2, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", textAlign: "right" }}>{exercise.calories} kcal</div>
                    </div>
                  );
                })}
              </div>

              <div style={styles.tutorialPanel}>
                <div style={styles.tutorialHeader}>
                  <div>
                    <div style={styles.sectionTitle}>Exercise Tutorial</div>
                    <div style={styles.tutorialTitle}>{selectedExerciseName}</div>
                    <div style={styles.tutorialSubtitle}>
                      Pick any exercise above to see a short coaching guide and a YouTube search for newer video examples.
                    </div>
                  </div>
                  <div style={{ color: textMuted, fontSize: 12, textAlign: "right" }}>
                    Step-by-step guide
                  </div>
                </div>

                <div style={styles.tutorialSteps}>
                  {selectedExercise.steps.map((step, stepIndex) => (
                    <div key={step} style={styles.tutorialStep}>
                      <b style={{ color: accent, marginRight: 8 }}>0{stepIndex + 1}</b>
                      {step}
                    </div>
                  ))}
                </div>

                <div style={styles.tutorialActions}>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedExercise.videoQuery)}&sp=CAI%253D`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...styles.secondaryButton, textDecoration: "none" }}
                  >
                    Watch on YouTube
                  </a>
                  <button type="button" style={styles.secondaryButton} onClick={() => setSelectedExerciseName(activeDay.exercises[0].name)}>
                    Reset to first exercise
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={styles.sectionTitle}>Workout Details</div>
            <div style={{ color: textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
              {activeSession
                ? `Tracking ${activeSession.dayLabel} right now. Timer, calorie estimate, and exercise progress are all updating live.`
                : "Start a session to begin logging your workout in real time."}
            </div>
            <div style={styles.tip}>
              <span style={styles.tipIcon}>🔥</span>
              Estimated calories use your body weight, workout type, and elapsed time. You can change those values in Settings.
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div style={sectionStyle}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Saved Sessions</div>
            {workoutHistory.length === 0 ? (
              <div style={{ color: textMuted, fontSize: 14, lineHeight: 1.7 }}>
                No saved workouts yet. Finish a session to create your first log entry.
              </div>
            ) : (
              workoutHistory.map((session) => (
                <div key={session.id} style={{ ...styles.mealCard, marginBottom: 12 }}>
                  <div style={styles.mealTitle}>
                    <span>🏋️</span>
                    <span>{session.focus}</span>
                    <span style={styles.mealTime}>{formatDate(session.endedAt ?? session.startedAt)}</span>
                  </div>
                  <div style={splitGridStyle}>
                    <div>
                      <div style={styles.metaKey}>Duration</div>
                      <div style={styles.metaVal}>{secondsToClock(session.elapsedSeconds)}</div>
                    </div>
                    <div>
                      <div style={styles.metaKey}>Calories</div>
                      <div style={styles.metaVal}>{session.caloriesBurned} kcal</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, color: textMuted, fontSize: 13, lineHeight: 1.6 }}>
                    Completed exercises: {session.completedExerciseIds.length}. {session.notes ? `Notes: ${session.notes}` : "No notes added."}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "nutrition" && (
        <div style={sectionStyle}>
          <div style={dashboardGridStyle}>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Macro Targets</div>
              <div style={macroGridStyle}>
                {[
                  { key: "Calories", val: targetCalories, unit: "kcal", pct: 100 },
                  { key: "Protein", val: protein, unit: "g", pct: 85 },
                  { key: "Carbs", val: carbs, unit: "g", pct: 70 },
                  { key: "Fats", val: fats, unit: "g", pct: 55 },
                ].map((macro) => (
                  <div key={macro.key} style={styles.macroCard}>
                    <div style={styles.macroVal}>
                      {macro.val}
                      <span style={{ fontSize: 14, color: textMuted }}> {macro.unit}</span>
                    </div>
                    <div style={styles.macroKey}>{macro.key}</div>
                    <div style={styles.progressBar(macro.pct)}>
                      <div style={styles.progressFill(macro.pct)} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.tip}>
                <span style={styles.tipIcon}>🧮</span>
                Your TDEE estimate is <b style={{ color: accent }}>{tdee} kcal</b>. A small surplus is already baked into the target.
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Daily Notes</div>
              <div style={styles.tip}>
                <span style={styles.tipIcon}>🥚</span>
                Hit <b style={{ color: accent }}>{protein}g/day</b> protein, keep hydration high, and use the workout log to compare energy and recovery across sessions.
              </div>
              <div style={styles.tip}>
                <span style={styles.tipIcon}>⚖️</span>
                If bodyweight stalls for 2 weeks, increase calories by 150-200 kcal/day. If you gain too quickly, reduce the surplus.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div style={sectionStyle}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Personal Profile</div>
            <div style={{ ...styles.reportGrid, marginBottom: 16 }}>
              <div style={styles.reportHero}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={`${profile.name}'s profile preview`} style={styles.avatar} />
                  ) : (
                    <div style={styles.avatarFallback}>{profile.name.charAt(0).toUpperCase()}</div>
                  )}
                  <div>
                    <div style={styles.reportTitle}>{profile.name}</div>
                    <div style={styles.tutorialSubtitle}>Upload a profile image to personalize your training dashboard and report.</div>
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={styles.label} htmlFor="profile-photo">
                    Profile photo
                  </label>
                  <input id="profile-photo" type="file" accept="image/*" onChange={handlePhotoUpload} style={styles.input} />
                </div>
              </div>
            </div>
            <div style={formGridStyle}>
              <div>
                <label style={styles.label} htmlFor="name">
                  Name
                </label>
                <input id="name" value={customName} onChange={(event) => setCustomName(event.target.value)} style={styles.input} />
              </div>
              <div>
                <label style={styles.label} htmlFor="goal">
                  Goal
                </label>
                <input id="goal" value={customGoal} onChange={(event) => setCustomGoal(event.target.value)} style={styles.input} />
              </div>
              <div>
                <label style={styles.label} htmlFor="weight">
                  Weight (kg)
                </label>
                <input id="weight" type="number" value={customWeight} onChange={(event) => setCustomWeight(event.target.value)} style={styles.input} />
              </div>
              <div>
                <label style={styles.label} htmlFor="height">
                  Height (cm)
                </label>
                <input id="height" type="number" value={customHeight} onChange={(event) => setCustomHeight(event.target.value)} style={styles.input} />
              </div>
              <div>
                <label style={styles.label} htmlFor="sessionsPerWeek">
                  Sessions per week
                </label>
                <input
                  id="sessionsPerWeek"
                  type="number"
                  value={customSessionsPerWeek}
                  onChange={(event) => setCustomSessionsPerWeek(event.target.value)}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label} htmlFor="workoutType">
                  Workout type
                </label>
                <select id="workoutType" value={customWorkoutType} onChange={(event) => setCustomWorkoutType(event.target.value)} style={styles.input}>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
            <div style={styles.buttonRow}>
              <button style={styles.primaryButton} onClick={saveProfile}>
                Save profile
              </button>
              <button style={styles.secondaryButton} onClick={exportProgress}>
                Export backup
              </button>
              <button style={styles.secondaryButton} onClick={triggerBackupImport}>
                Import backup
              </button>
              <button style={styles.secondaryButton} onClick={exportAsPdf}>
                Export as PDF / Share report
              </button>
              <button style={styles.secondaryButton} onClick={clearProgress}>
                Clear saved progress
              </button>
            </div>
            <input
              ref={backupInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleBackupImport}
              style={{ display: "none" }}
            />
            <div style={{ marginTop: 16, color: textMuted, fontSize: 13, lineHeight: 1.7 }}>
              Saved locally on this browser. Use Export backup to download your data and Import backup to restore it later. Clearing progress removes workout history and summary stats, but keeps your profile defaults in the form.
            </div>
          </div>
        </div>
      )}

      {activeTab === "report" && (
        <div style={sectionStyle}>
          <div style={styles.card}>
            <div className="no-print" style={styles.buttonRow}>
              <button style={styles.primaryButton} onClick={exportAsPdf}>
                Print / Save as PDF
              </button>
              <button style={styles.secondaryButton} onClick={exportProgress}>
                Download JSON backup
              </button>
              <button style={styles.secondaryButton} onClick={triggerBackupImport}>
                Import JSON backup
              </button>
            </div>

            <div style={styles.reportGrid}>
              <div style={styles.reportHero}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={`${profile.name}'s report photo`} style={styles.avatar} />
                  ) : (
                    <div style={styles.avatarFallback}>{profile.name.charAt(0).toUpperCase()}</div>
                  )}
                  <div>
                    <div style={styles.sectionTitle}>Workout Report</div>
                    <div style={styles.reportTitle}>{profile.name}</div>
                    <div style={styles.tutorialSubtitle}>A compact report you can print to PDF or share with someone else.</div>
                  </div>
                </div>
              </div>

              <div style={dashboardGridStyle}>
                <div style={styles.reportCard}>
                  <div style={styles.reportLabel}>Profile</div>
                  <div style={styles.reportValue}>{profile.goal}</div>
                  <div style={{ marginTop: 10, color: textMuted, fontSize: 13, lineHeight: 1.7 }}>
                    Weight: {profile.weight} kg · Height: {profile.height} cm · Sessions/week: {profile.sessionsPerWeek} · Training type: {profile.workoutType}
                  </div>
                </div>
                <div style={styles.reportCard}>
                  <div style={styles.reportLabel}>Progress</div>
                  <div style={styles.reportValue}>{sessionSummary.totalSessions} workouts</div>
                  <div style={{ marginTop: 10, color: textMuted, fontSize: 13, lineHeight: 1.7 }}>
                    {sessionSummary.totalMinutes} minutes · {sessionSummary.totalCalories} kcal burned · {streakDays || sessionSummary.streakDays} day streak
                  </div>
                </div>
              </div>

              <div style={styles.reportCard}>
                <div style={styles.reportLabel}>Weekly momentum</div>
                <div style={{ color: textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
                  {weeklyAnalytics.totalSessions} sessions this week · {weeklyAnalytics.totalMinutes} min · {weeklyAnalytics.totalCalories} kcal
                </div>
                <div style={weeklyBarsStyle}>
                  {weeklyAnalytics.days.map((day) => (
                    <div key={day.key} style={styles.weeklyBarCard}>
                      <div style={styles.weeklyBarMeta}>{day.label}</div>
                      <div style={styles.weeklyBarTrack}>
                        <div style={{ ...styles.weeklyBarFill, height: `${Math.max(18, (day.calories / weeklyAnalytics.maxCalories) * 100)}%` }} />
                      </div>
                      <div style={{ color: textMuted, fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
                        {day.sessions} session{day.sessions === 1 ? "" : "s"} · {day.minutes} min · {day.calories} kcal
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.reportCard}>
                <div style={styles.reportLabel}>Recent sessions</div>
                {workoutHistory.length === 0 ? (
                  <div style={{ color: textMuted, fontSize: 13, lineHeight: 1.7 }}>No completed sessions yet.</div>
                ) : (
                  workoutHistory.map((session) => (
                    <div key={session.id} style={{ ...styles.mealCard, marginBottom: 10 }}>
                      <div style={styles.mealTitle}>
                        <span>🏋️</span>
                        <span>{session.focus}</span>
                        <span style={styles.mealTime}>{formatDate(session.endedAt ?? session.startedAt)}</span>
                      </div>
                      <div style={splitGridStyle}>
                        <div>
                          <div style={styles.metaKey}>Duration</div>
                          <div style={styles.metaVal}>{secondsToClock(session.elapsedSeconds)}</div>
                        </div>
                        <div>
                          <div style={styles.metaKey}>Calories</div>
                          <div style={styles.metaVal}>{session.caloriesBurned} kcal</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={styles.reportCard}>
                <div style={styles.reportLabel}>Summary notes</div>
                <div style={{ color: textMuted, fontSize: 13, lineHeight: 1.8 }}>
                  Target calories: {targetCalories} kcal. Protein target: {protein}g/day. Use this report as a quick snapshot of the current plan, recent training load, and local progress stored in this browser.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FitnessApp />);
