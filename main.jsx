import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

const STORAGE_KEY = "gym-tracker-v1";

const themeOptions = {
  midnight: {
    label: "Midnight",
    subtitle: "Classic gym dark",
    vars: {
      "--bg": "#08111b",
      "--accent": "#c8f135",
      "--accent-2": "#59f3c0",
      "--accent-rgb": "200 241 53",
      "--accent-2-rgb": "89 243 192",
      "--panel": "rgba(14, 22, 34, 0.88)",
      "--panel-strong": "rgba(20, 31, 47, 0.96)",
      "--border": "rgba(255, 255, 255, 0.08)",
      "--text": "#f4f7fb",
      "--text-muted": "#94a3b8",
    },
  },
  ocean: {
    label: "Ocean",
    subtitle: "Cool blue focus",
    vars: {
      "--bg": "#06141f",
      "--accent": "#74d8ff",
      "--accent-2": "#5ef0b0",
      "--accent-rgb": "116 216 255",
      "--accent-2-rgb": "94 240 176",
      "--panel": "rgba(11, 28, 41, 0.9)",
      "--panel-strong": "rgba(15, 36, 54, 0.98)",
      "--border": "rgba(116, 216, 255, 0.12)",
      "--text": "#eff9ff",
      "--text-muted": "#8ab7ce",
    },
  },
  sunset: {
    label: "Sunset",
    subtitle: "Warm motivational",
    vars: {
      "--bg": "#191018",
      "--accent": "#ffbe55",
      "--accent-2": "#ff7f6f",
      "--accent-rgb": "255 190 85",
      "--accent-2-rgb": "255 127 111",
      "--panel": "rgba(37, 22, 31, 0.9)",
      "--panel-strong": "rgba(50, 28, 40, 0.98)",
      "--border": "rgba(255, 190, 85, 0.14)",
      "--text": "#fff8f2",
      "--text-muted": "#d5b9b0",
    },
  },
  graphite: {
    label: "Graphite",
    subtitle: "Minimal monochrome",
    vars: {
      "--bg": "#0d0f13",
      "--accent": "#e5e7eb",
      "--accent-2": "#9ca3af",
      "--accent-rgb": "229 231 235",
      "--accent-2-rgb": "156 163 175",
      "--panel": "rgba(21, 24, 30, 0.9)",
      "--panel-strong": "rgba(27, 31, 38, 0.98)",
      "--border": "rgba(255, 255, 255, 0.1)",
      "--text": "#f8fafc",
      "--text-muted": "#a1a1aa",
    },
  },
};

const defaultThemeKey = "midnight";

const accent = "var(--accent)";
const accent2 = "var(--accent-2)";
const bg = "var(--bg)";
const panel = "var(--panel)";
const panelStrong = "var(--panel-strong)";
const border = "var(--border)";
const text = "var(--text)";
const textMuted = "var(--text-muted)";

const defaultProfile = {
  name: "Tonoy",
  age: 22,
  weight: 56,
  height: 162,
  goal: "Weight gain",
  goalType: "gain",
  sessionsPerWeek: 5,
  workoutType: "strength",
};

const goalOptions = [
  { value: "gain", label: "Weight gain" },
  { value: "loss", label: "Weight loss" },
  { value: "recomp", label: "Recomposition" },
];

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

const weightLossWorkoutDays = [
  {
    id: "loss-circuit-a",
    day: "Day 1",
    focus: "Fat-Loss Circuit A",
    tag: "HIIT",
    exercises: [
      { name: "Jump Rope Intervals", sets: "5 × 60 sec", calories: 48 },
      { name: "Burpees", sets: "4 × 12", calories: 42 },
      { name: "Mountain Climbers", sets: "4 × 40 sec", calories: 34 },
      { name: "Plank", sets: "3 × 60 sec", calories: 14 },
      { name: "Dumbbell Lunges", sets: "3 × 14 each leg", calories: 32 },
    ],
  },
  {
    id: "loss-upper",
    day: "Day 2",
    focus: "Upper Body + Cardio",
    tag: "Upper",
    exercises: [
      { name: "Incline Dumbbell Press", sets: "3 × 12", calories: 36 },
      { name: "Lat Pulldown", sets: "3 × 12", calories: 32 },
      { name: "Seated Cable Row", sets: "3 × 12", calories: 28 },
      { name: "Jump Rope Intervals", sets: "4 × 60 sec", calories: 38 },
      { name: "Mountain Climbers", sets: "3 × 45 sec", calories: 30 },
    ],
  },
  {
    id: "loss-lower",
    day: "Day 3",
    focus: "Lower Body Conditioning",
    tag: "Lower",
    exercises: [
      { name: "Barbell Squat", sets: "3 × 10", calories: 52 },
      { name: "Romanian Deadlift", sets: "3 × 12", calories: 38 },
      { name: "Leg Press", sets: "3 × 15", calories: 34 },
      { name: "Treadmill Incline Walk", sets: "3 × 10 min", calories: 54 },
      { name: "Plank", sets: "3 × 60 sec", calories: 14 },
    ],
  },
  {
    id: "loss-circuit-b",
    day: "Day 4",
    focus: "Fat-Loss Circuit B",
    tag: "Circuit",
    exercises: [
      { name: "Burpees", sets: "4 × 10", calories: 38 },
      { name: "Cable Chest Fly", sets: "3 × 15", calories: 24 },
      { name: "Lateral Raise", sets: "3 × 18", calories: 18 },
      { name: "Jump Rope Intervals", sets: "4 × 75 sec", calories: 42 },
      { name: "Mountain Climbers", sets: "3 × 45 sec", calories: 30 },
    ],
  },
  {
    id: "loss-full",
    day: "Day 5",
    focus: "Full Body Burn",
    tag: "Full",
    exercises: [
      { name: "Pull-Ups / Assisted Pull-Ups", sets: "3 × max reps", calories: 38 },
      { name: "Dumbbell Lunges", sets: "3 × 12 each leg", calories: 30 },
      { name: "Treadmill Incline Walk", sets: "3 × 12 min", calories: 62 },
      { name: "Plank", sets: "4 × 45 sec", calories: 16 },
      { name: "Burpees", sets: "3 × 12", calories: 34 },
    ],
  },
];

const recompositionWorkoutDays = [
  {
    id: "recomp-upper-a",
    day: "Day 1",
    focus: "Upper Body A",
    tag: "Upper",
    exercises: [
      { name: "Barbell Bench Press", sets: "4 × 6–8", calories: 50 },
      { name: "Lat Pulldown", sets: "4 × 10", calories: 34 },
      { name: "Seated DB Shoulder Press", sets: "3 × 10", calories: 30 },
      { name: "Barbell Curl", sets: "3 × 12", calories: 18 },
      { name: "Tricep Rope Pushdown", sets: "3 × 12", calories: 20 },
    ],
  },
  {
    id: "recomp-lower-a",
    day: "Day 2",
    focus: "Lower Body A",
    tag: "Lower",
    exercises: [
      { name: "Barbell Squat", sets: "4 × 6–8", calories: 56 },
      { name: "Romanian Deadlift", sets: "3 × 10", calories: 40 },
      { name: "Leg Press", sets: "3 × 12", calories: 32 },
      { name: "Leg Curl (Machine)", sets: "3 × 12", calories: 22 },
      { name: "Plank", sets: "3 × 60 sec", calories: 14 },
    ],
  },
  {
    id: "recomp-metcon",
    day: "Day 3",
    focus: "Conditioning",
    tag: "Hybrid",
    exercises: [
      { name: "Jump Rope Intervals", sets: "5 × 60 sec", calories: 48 },
      { name: "Mountain Climbers", sets: "4 × 40 sec", calories: 34 },
      { name: "Burpees", sets: "4 × 10", calories: 36 },
      { name: "Pull-Ups / Assisted Pull-Ups", sets: "3 × max reps", calories: 38 },
      { name: "Plank", sets: "3 × 60 sec", calories: 14 },
    ],
  },
  {
    id: "recomp-upper-b",
    day: "Day 4",
    focus: "Upper Body B",
    tag: "Upper",
    exercises: [
      { name: "Incline Dumbbell Press", sets: "4 × 8–10", calories: 38 },
      { name: "Seated Cable Row", sets: "4 × 10", calories: 30 },
      { name: "Lateral Raise", sets: "4 × 15", calories: 18 },
      { name: "EZ-Bar Curl", sets: "3 × 12", calories: 16 },
      { name: "Skull Crusher", sets: "3 × 12", calories: 16 },
    ],
  },
  {
    id: "recomp-lower-b",
    day: "Day 5",
    focus: "Lower Body B",
    tag: "Lower",
    exercises: [
      { name: "Deadlift", sets: "4 × 5", calories: 54 },
      { name: "Dumbbell Lunges", sets: "3 × 12 each leg", calories: 30 },
      { name: "Calf Raise", sets: "4 × 20", calories: 16 },
      { name: "Treadmill Incline Walk", sets: "3 × 10 min", calories: 54 },
      { name: "Plank", sets: "3 × 60 sec", calories: 14 },
    ],
  },
];

const workoutDaysByGoalType = {
  gain: defaultWorkoutDays,
  loss: weightLossWorkoutDays,
  recomp: recompositionWorkoutDays,
};

const inferGoalTypeFromGoalText = (goalText) => {
  const goal = String(goalText ?? "").toLowerCase();
  if (goal.includes("loss") || goal.includes("fat") || goal.includes("cut")) {
    return "loss";
  }
  if (goal.includes("recomp") || goal.includes("maintain")) {
    return "recomp";
  }
  return "gain";
};

const getGoalLabel = (goalType) => goalOptions.find((option) => option.value === goalType)?.label ?? "Weight gain";

const getWorkoutDaysForGoalType = (goalType) => workoutDaysByGoalType[goalType] ?? defaultWorkoutDays;

const allWorkoutDays = Object.values(workoutDaysByGoalType).flat();

const recommendedSessionsByGoalType = {
  gain: 5,
  loss: 4,
  recomp: 4,
};

const recommendedWorkoutTypeByGoalType = {
  gain: "strength",
  loss: "cardio",
  recomp: "mixed",
};

const getRecommendedPlanForGoal = (goalType, availableDaysCount) => ({
  sessionsPerWeek: Math.min(
    Math.max(1, recommendedSessionsByGoalType[goalType] ?? availableDaysCount),
    availableDaysCount
  ),
  workoutType: recommendedWorkoutTypeByGoalType[goalType] ?? "mixed",
});

const getRecommendedDayFromSplit = (days) => {
  if (!Array.isArray(days) || days.length === 0) {
    return null;
  }

  // Monday-first rotation; loops within available split days.
  const mondayFirstIndex = (new Date().getDay() + 6) % 7;
  return days[mondayFirstIndex % days.length];
};

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
  "Jump Rope Intervals": {
    videoQuery: "Jump Rope Intervals tutorial",
    steps: ["Keep elbows close and rotate from your wrists.", "Stay light on your feet and breathe rhythmically.", "Use work-rest intervals and maintain a steady cadence."],
  },
  "Mountain Climbers": {
    videoQuery: "Mountain Climbers tutorial",
    steps: ["Start in a strong plank with shoulders over wrists.", "Drive knees toward chest one at a time without bouncing hips.", "Keep core braced and pace consistent."],
  },
  Burpees: {
    videoQuery: "Burpees exercise tutorial",
    steps: ["Drop into a squat and place hands on the floor.", "Kick feet back to plank, then return to squat.", "Jump up softly and repeat with control."],
  },
  "Treadmill Incline Walk": {
    videoQuery: "Treadmill Incline Walk technique",
    steps: ["Set an incline you can maintain with good posture.", "Keep a natural arm swing and avoid leaning on rails.", "Walk at a brisk pace with controlled breathing."],
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
    padding: "24px 24px 20px",
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
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    marginBottom: 8,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: "50%",
    border: `2px solid ${accent}`,
    background: "rgba(255,255,255,0.06)",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarFallback: {
    width: 84,
    height: 84,
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
  filePickerCard: {
    borderRadius: 18,
    padding: 16,
    background: panelStrong,
    border: `1px solid ${border}`,
  },
  filePickerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  filePickerTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: text,
    marginBottom: 4,
  },
  filePickerHint: {
    fontSize: 12,
    color: textMuted,
    lineHeight: 1.6,
  },
  filePickerMeta: {
    marginTop: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  fileBadge: {
    borderRadius: 999,
    border: `1px solid ${border}`,
    background: "rgba(255,255,255,0.04)",
    color: textMuted,
    padding: "7px 12px",
    fontSize: 12,
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

const getNutritionSuggestions = (profile, targetCalories) => {
  const goalType = profile.goalType ?? inferGoalTypeFromGoalText(profile.goal);
  const suggestions = [];

  if (goalType === "gain") {
    suggestions.push(`Aim for a ~250 kcal daily surplus (target ~${targetCalories} kcal).`);
    suggestions.push("Prioritise ~2.0–2.4 g protein per kg bodyweight to support muscle growth.");
    suggestions.push("Focus carbs around training and include whole-food calorie-dense options: oats, rice, nuts, whole-milk yogurt.");
  } else if (goalType === "loss") {
    suggestions.push(`Create a modest calorie deficit while keeping protein high (~2.0–2.4 g/kg).`);
    suggestions.push("Prefer high-volume vegetables, lean protein, and time carbs around workouts to preserve performance.");
    suggestions.push("Track progress weekly and avoid drops >0.7–1% bodyweight per week.");
  } else {
    suggestions.push(`Target roughly ${targetCalories} kcal/day as a starting point and adjust from there.`);
    suggestions.push("Keep protein around 1.6–2.2 g/kg, and prioritise whole foods over processed snacks.");
    suggestions.push("Drink water, sleep well, and follow progressive overload for steady results.");
  }

  suggestions.push("Sample high-protein choices: eggs, chicken breast, Greek yogurt, cottage cheese, lentils.");
  return suggestions;
};

const getPlannedSetCount = (setLabel) => {
  const parsed = Number.parseInt(String(setLabel ?? "").match(/\d+/)?.[0] ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const getCompletedSetsForExercise = (session, exerciseName, plannedSets) => {
  const fromSetMap = session?.completedSetsByExercise?.[exerciseName];
  if (typeof fromSetMap === "number" && Number.isFinite(fromSetMap)) {
    return Math.max(0, Math.min(plannedSets, fromSetMap));
  }

  // Backward compatibility for old session shape where exercises were only checked on/off.
  if (Array.isArray(session?.completedExerciseIds) && session.completedExerciseIds.includes(exerciseName)) {
    return plannedSets;
  }

  return 0;
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
    completedSetsByExercise: {},
    repsLogByExercise: {},
    notes: "",
    profileSnapshot: {
      name: profile.name,
      weight: profile.weight,
      workoutType: profile.workoutType,
      goalType: profile.goalType ?? inferGoalTypeFromGoalText(profile.goal),
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

const defaultSplashState = true;

export default function FitnessApp() {
  const storedState = loadState();
  const initialGoalType = storedState?.profile?.goalType ?? inferGoalTypeFromGoalText(storedState?.profile?.goal ?? defaultProfile.goal);
  const initialWorkoutDays = getWorkoutDaysForGoalType(initialGoalType);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 0 : window.innerWidth));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedDay, setExpandedDay] = useState(0);
  const [profile, setProfile] = useState(storedState?.profile ?? defaultProfile);
  const [profilePhoto, setProfilePhoto] = useState(storedState?.profilePhoto ?? "");
  const [sessions, setSessions] = useState(storedState?.sessions ?? []);
  const [sessionSummary, setSessionSummary] = useState(storedState?.summary ?? defaultSessionSummary);
  const [activeSession, setActiveSession] = useState(storedState?.activeSession ?? null);
  const [selectedDayId, setSelectedDayId] = useState(storedState?.selectedDayId ?? initialWorkoutDays[0].id);
  const [sessionNotes, setSessionNotes] = useState("");
  const [customName, setCustomName] = useState(profile.name);
  const [customWeight, setCustomWeight] = useState(String(profile.weight));
  const [customHeight, setCustomHeight] = useState(String(profile.height));
  const [customGoalType, setCustomGoalType] = useState(profile.goalType ?? inferGoalTypeFromGoalText(profile.goal));
  const [customSessionsPerWeek, setCustomSessionsPerWeek] = useState(String(profile.sessionsPerWeek));
  const [customWorkoutType, setCustomWorkoutType] = useState(profile.workoutType);
  const [selectedExerciseName, setSelectedExerciseName] = useState(initialWorkoutDays[0].exercises[0].name);
  const [backupFileName, setBackupFileName] = useState("No file chosen");
  const [profilePhotoFileName, setProfilePhotoFileName] = useState("No image chosen");
  const tickRef = useRef(null);
  const profilePhotoInputRef = useRef(null);
  const backupInputRef = useRef(null);
  const isDesktop = viewportWidth >= 960;
  const [themeKey, setThemeKey] = useState(storedState?.themeKey ?? defaultThemeKey);
  const [hideSplash, setHideSplash] = useState(storedState?.hideSplash ?? false);
  const [showSplash, setShowSplash] = useState(storedState?.hideSplash ? false : defaultSplashState);
  const [autoPlanEnabled, setAutoPlanEnabled] = useState(storedState?.autoPlanEnabled ?? false);
  const theme = themeOptions[themeKey] ?? themeOptions[defaultThemeKey];
  const activeGoalType = profile.goalType ?? inferGoalTypeFromGoalText(profile.goal);
  const goalWorkoutDays = getWorkoutDaysForGoalType(activeGoalType);
  const sessionsPerWeekTarget = Math.min(Math.max(1, Number(profile.sessionsPerWeek) || 1), goalWorkoutDays.length);
  const workoutDays = goalWorkoutDays.slice(0, sessionsPerWeekTarget);
  const workoutDayIds = workoutDays.map((day) => day.id).join("|");
  const recommendedDay = getRecommendedDayFromSplit(workoutDays) ?? workoutDays[0];

  const themeStyles = {
    "--bg": theme.vars["--bg"],
    "--accent": theme.vars["--accent"],
    "--accent-2": theme.vars["--accent-2"],
    "--accent-rgb": theme.vars["--accent-rgb"],
    "--accent-2-rgb": theme.vars["--accent-2-rgb"],
    "--panel": theme.vars["--panel"],
    "--panel-strong": theme.vars["--panel-strong"],
    "--border": theme.vars["--border"],
    "--text": theme.vars["--text"],
    "--text-muted": theme.vars["--text-muted"],
  };

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
      JSON.stringify({
        profile,
        profilePhoto,
        sessions,
        summary: sessionSummary,
        activeSession,
        selectedDayId,
        themeKey,
        hideSplash,
        autoPlanEnabled,
      })
    );
  }, [profile, profilePhoto, sessions, sessionSummary, activeSession, selectedDayId, themeKey, hideSplash, autoPlanEnabled]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (hideSplash) return undefined;
    const timer = window.setTimeout(() => setShowSplash(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentDay = workoutDays.find((day) => day.id === selectedDayId) ?? workoutDays[0];
    if (!currentDay) {
      return;
    }

    if (currentDay.id !== selectedDayId) {
      setSelectedDayId(currentDay.id);
      return;
    }

    const currentExerciseExists = currentDay.exercises.some((exercise) => exercise.name === selectedExerciseName);
    if (!currentExerciseExists) {
      setSelectedExerciseName(currentDay.exercises[0].name);
    }
  }, [selectedDayId, selectedExerciseName, workoutDayIds]);

  const bmi = calculateBmi(profile.weight, profile.height);
  const tdee = getTdee(profile);
  const targetCalories = Math.round(tdee + 250);
  const protein = Math.round(profile.weight * 2.2);
  const carbs = Math.round((targetCalories * 0.45) / 4);
  const fats = Math.round((targetCalories * 0.25) / 9);
  const activeDay = workoutDays.find((day) => day.id === selectedDayId) ?? workoutDays[0];
  const sessionDay = activeSession
    ? allWorkoutDays.find((day) => day.id === activeSession.dayId) ?? activeDay
    : activeDay;
  const weeklyAnalytics = buildWeeklyAnalytics(sessions);
  const streakDays = calculateStreakDays(sessions);
  const fallbackTutorial = {
    videoQuery: `${selectedExerciseName || "exercise"} tutorial`,
    steps: [
      "Set up with stable posture and brace your core.",
      "Move through a controlled full range of motion.",
      "Keep tempo consistent and stop the set before form breaks.",
    ],
  };
  const selectedExercise =
    exerciseTutorials[selectedExerciseName] ??
    exerciseTutorials[activeDay.exercises[0].name] ??
    fallbackTutorial;
  const weeklySessionTarget = Math.min(Math.max(1, Number(profile.sessionsPerWeek) || 1), workoutDays.length);
  const weeklySessionDone = Math.min(weeklyAnalytics.totalSessions, weeklySessionTarget);

  const totalExercisesDone = sessions.reduce((sum, session) => sum + session.completedExerciseIds.length, 0);
  const currentDuration = activeSession?.elapsedSeconds ?? 0;
  const currentCalories = activeSession?.caloriesBurned ?? 0;
  const completionTargetCount = sessionDay.exercises.reduce((sum, exercise) => sum + getPlannedSetCount(exercise.sets), 0);
  const activeCompletedSets = activeSession
    ? sessionDay.exercises.reduce(
        (sum, exercise) => sum + getCompletedSetsForExercise(activeSession, exercise.name, getPlannedSetCount(exercise.sets)),
        0
      )
    : 0;
  const totalRepsLogged = activeSession
    ? Object.values(activeSession.repsLogByExercise ?? {}).reduce(
        (sum, repsList) => sum + (Array.isArray(repsList) ? repsList.reduce((acc, reps) => acc + (Number.isFinite(reps) ? reps : 0), 0) : 0),
        0
      )
    : 0;
  const completionRate = activeSession && completionTargetCount > 0 ? Math.round((activeCompletedSets / completionTargetCount) * 100) : 0;

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

  const markSetDone = (exercise) => {
    if (!activeSession) {
      return;
    }

    const confirmed = window.confirm(`Did you complete one set of ${exercise.name}?`);
    if (!confirmed) {
      return;
    }

    const repsInput = window.prompt(`How many reps did you complete for this set of ${exercise.name}? (optional)`, "");
    const parsedReps = Number.parseInt(String(repsInput ?? "").trim(), 10);
    const repsValue = Number.isFinite(parsedReps) && parsedReps > 0 ? parsedReps : null;

    setActiveSession((current) => {
      if (!current) {
        return current;
      }

      const plannedSets = getPlannedSetCount(exercise.sets);
      const previousSets = getCompletedSetsForExercise(current, exercise.name, plannedSets);
      if (previousSets >= plannedSets) {
        return current;
      }

      const nextSets = previousSets + 1;
      const existingReps = Array.isArray(current.repsLogByExercise?.[exercise.name]) ? current.repsLogByExercise[exercise.name] : [];
      const nextReps = repsValue ? [...existingReps, repsValue] : existingReps;

      const completedIds = new Set(current.completedExerciseIds ?? []);
      if (nextSets >= plannedSets) {
        completedIds.add(exercise.name);
      }

      return {
        ...current,
        completedExerciseIds: [...completedIds],
        completedSetsByExercise: {
          ...(current.completedSetsByExercise ?? {}),
          [exercise.name]: nextSets,
        },
        repsLogByExercise: {
          ...(current.repsLogByExercise ?? {}),
          [exercise.name]: nextReps,
        },
      };
    });
  };

  const undoSetDone = (exercise) => {
    if (!activeSession) {
      return;
    }

    setActiveSession((current) => {
      if (!current) {
        return current;
      }

      const plannedSets = getPlannedSetCount(exercise.sets);
      const previousSets = getCompletedSetsForExercise(current, exercise.name, plannedSets);
      if (previousSets <= 0) {
        return current;
      }

      const nextSets = previousSets - 1;
      const existingReps = Array.isArray(current.repsLogByExercise?.[exercise.name]) ? current.repsLogByExercise[exercise.name] : [];
      const nextReps = existingReps.length ? existingReps.slice(0, -1) : existingReps;

      const completedIds = new Set(current.completedExerciseIds ?? []);
      if (nextSets < plannedSets) {
        completedIds.delete(exercise.name);
      }

      return {
        ...current,
        completedExerciseIds: [...completedIds],
        completedSetsByExercise: {
          ...(current.completedSetsByExercise ?? {}),
          [exercise.name]: nextSets,
        },
        repsLogByExercise: {
          ...(current.repsLogByExercise ?? {}),
          [exercise.name]: nextReps,
        },
      };
    });
  };

  const finishSession = () => {
    if (!activeSession) {
      return;
    }

    const endedAt = new Date().toISOString();
    const performedDay = allWorkoutDays.find((day) => day.id === activeSession.dayId) ?? activeDay;
    const exercisePerformance = performedDay.exercises.map((exercise) => {
      const plannedSets = getPlannedSetCount(exercise.sets);
      const completedSets = getCompletedSetsForExercise(activeSession, exercise.name, plannedSets);
      const repsLog = Array.isArray(activeSession.repsLogByExercise?.[exercise.name]) ? activeSession.repsLogByExercise[exercise.name] : [];
      return {
        name: exercise.name,
        setScheme: exercise.sets,
        plannedSets,
        completedSets,
        repsLog,
      };
    });

    const completedSession = {
      ...activeSession,
      endedAt,
      elapsedSeconds: Math.max(0, activeSession.elapsedSeconds),
      caloriesBurned: estimateCaloriesBurned(activeSession.elapsedSeconds, profile.weight, profile.workoutType),
      exercisePerformance,
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
    const planDays = getWorkoutDaysForGoalType(customGoalType);
    const recommended = getRecommendedPlanForGoal(customGoalType, planDays.length);
    const parsedSessions = Number(customSessionsPerWeek) || defaultProfile.sessionsPerWeek;
    const clampedSessions = autoPlanEnabled
      ? recommended.sessionsPerWeek
      : Math.min(Math.max(1, parsedSessions), planDays.length);
    const nextWorkoutType = autoPlanEnabled ? recommended.workoutType : customWorkoutType;
    const nextProfile = {
      name: customName.trim() || defaultProfile.name,
      age: defaultProfile.age,
      weight: Number(customWeight) || defaultProfile.weight,
      height: Number(customHeight) || defaultProfile.height,
      goalType: customGoalType,
      goal: getGoalLabel(customGoalType),
      sessionsPerWeek: clampedSessions,
      workoutType: nextWorkoutType,
    };

    if (autoPlanEnabled) {
      setCustomSessionsPerWeek(String(clampedSessions));
      setCustomWorkoutType(nextWorkoutType);
    }

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
                goalType: nextProfile.goalType,
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
      themeKey,
      hideSplash,
      autoPlanEnabled,
      exportedAt: new Date().toISOString(),
    });
  };

  const exportAsPdf = () => {
    setActiveTab("report");
    window.setTimeout(() => window.print(), 150);
  };

  const applyTheme = (nextThemeKey) => {
    setThemeKey(nextThemeKey);
  };

  const applyAutoGeneratedPlan = (goalTypeValue, syncProfile = false) => {
    const templateDays = getWorkoutDaysForGoalType(goalTypeValue);
    const recommended = getRecommendedPlanForGoal(goalTypeValue, templateDays.length);
    const generatedDays = templateDays.slice(0, recommended.sessionsPerWeek);
    const suggestedDay = getRecommendedDayFromSplit(generatedDays) ?? generatedDays[0];

    setCustomSessionsPerWeek(String(recommended.sessionsPerWeek));
    setCustomWorkoutType(recommended.workoutType);

    if (syncProfile) {
      setProfile((current) => ({
        ...current,
        goalType: goalTypeValue,
        goal: getGoalLabel(goalTypeValue),
        sessionsPerWeek: recommended.sessionsPerWeek,
        workoutType: recommended.workoutType,
      }));
    }

    if (suggestedDay) {
      setSelectedDayId(suggestedDay.id);
      setSelectedExerciseName(suggestedDay.exercises[0].name);
    }
  };

  const toggleAutoPlan = () => {
    const nextEnabled = !autoPlanEnabled;
    setAutoPlanEnabled(nextEnabled);
    if (nextEnabled) {
      applyAutoGeneratedPlan(customGoalType, true);
    }
  };

  useEffect(() => {
    if (!autoPlanEnabled) {
      return;
    }

    applyAutoGeneratedPlan(customGoalType, true);
  }, [autoPlanEnabled, customGoalType]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setProfilePhoto(dataUrl);
    setProfilePhotoFileName(file.name);
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
      const restoredGoalType = nextProfile.goalType ?? inferGoalTypeFromGoalText(nextProfile.goal);
      const normalizedProfile = {
        ...nextProfile,
        goalType: restoredGoalType,
        goal: nextProfile.goal ?? getGoalLabel(restoredGoalType),
      };
      const restoredDays = getWorkoutDaysForGoalType(restoredGoalType);
      setProfile(normalizedProfile);
      setCustomName(normalizedProfile.name ?? defaultProfile.name);
      setCustomWeight(String(normalizedProfile.weight ?? defaultProfile.weight));
      setCustomHeight(String(normalizedProfile.height ?? defaultProfile.height));
      setCustomGoalType(restoredGoalType);
      setCustomSessionsPerWeek(String(normalizedProfile.sessionsPerWeek ?? defaultProfile.sessionsPerWeek));
      setCustomWorkoutType(normalizedProfile.workoutType ?? defaultProfile.workoutType);

      setProfilePhoto(imported.profilePhoto ?? "");
      setProfilePhotoFileName(imported.profilePhoto ? "Restored from backup" : "No image chosen");
      setSessions(Array.isArray(imported.sessions) ? imported.sessions : []);
      setSessionSummary(imported.summary ?? defaultSessionSummary);
      setSelectedDayId(imported.selectedDayId ?? restoredDays[0].id);
      setThemeKey(imported.themeKey ?? defaultThemeKey);
      setHideSplash(Boolean(imported.hideSplash));
      setAutoPlanEnabled(Boolean(imported.autoPlanEnabled));
      setActiveSession(null);
      setSessionNotes("");
      setBackupFileName(file.name);
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
    <div style={{ ...styles.app, ...themeStyles }}>
      {showSplash && (
        <div
          className="no-print"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            background:
              "radial-gradient(circle at top, rgb(var(--accent-2-rgb) / 0.14), transparent 34%), linear-gradient(180deg, rgb(6 9 14 / 0.94), rgb(8 17 27 / 0.99))",
            backdropFilter: "blur(8px)",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 28,
              border: `1px solid rgb(var(--accent-rgb) / 0.22)`,
              background: "linear-gradient(180deg, rgb(20 31 47 / 0.98), rgb(11 17 27 / 0.98))",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
              padding: 28,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 4, color: accent, textTransform: "uppercase", marginBottom: 12 }}>
              Personal training app
            </div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 42, lineHeight: 0.95, marginBottom: 12 }}>
              Tanvir R Tonoy
            </div>
            <div style={{ color: textMuted, fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>
              Built for personal use only.<br />All rights reserved.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button style={styles.primaryButton} onClick={() => setShowSplash(false)}>
                Enter app
              </button>
              <button style={styles.secondaryButton} onClick={() => setShowSplash(false)}>
                Skip splash
              </button>
            </div>
          </div>
        </div>
      )}
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
              <div style={{ color: textMuted, fontSize: 12, marginTop: 8 }}>
                Recommended today: <b style={{ color: accent }}>{recommendedDay?.focus ?? activeDay.focus}</b>
              </div>
              <div style={styles.buttonRow}>
                <button style={styles.primaryButton} onClick={beginSession} disabled={Boolean(activeSession)}>
                  {activeSession ? "Session running" : "Start workout"}
                </button>
                <button style={styles.secondaryButton} onClick={() => setActiveTab("workout")}>
                  Open workout
                </button>
                <button
                  style={styles.secondaryButton}
                  onClick={() => {
                    if (!recommendedDay) {
                      return;
                    }
                    setSelectedDayId(recommendedDay.id);
                    setSelectedExerciseName(recommendedDay.exercises[0].name);
                    setActiveTab("workout");
                  }}
                >
                  Go to today&apos;s plan
                </button>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.sectionTitle}>Progress</div>
              <div style={{ ...styles.macroGrid, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                {[
                  { key: "Workouts", val: sessionSummary.totalSessions, unit: "sessions" },
                  { key: "Minutes", val: sessionSummary.totalMinutes, unit: "min" },
                  { key: "Calories", val: sessionSummary.totalCalories, unit: "kcal" },
                  { key: "Streak", val: streakDays || sessionSummary.streakDays, unit: "days" },
                ].map((stat) => (
                  <div key={stat.key} style={{ ...styles.macroCard, padding: "14px 12px", minWidth: 0 }}>
                    <div style={{ ...styles.macroVal, fontSize: 24, lineHeight: 1.05, overflowWrap: "anywhere" }}>
                      {stat.val}
                      <span style={{ display: "block", fontSize: 11, color: textMuted, marginTop: 4, letterSpacing: 1 }}>{stat.unit}</span>
                    </div>
                    <div style={{ ...styles.macroKey, lineHeight: 1.2, wordBreak: "break-word" }}>{stat.key}</div>
                  </div>
                ))}
              </div>
              <div style={styles.tip}>
                <span style={styles.tipIcon}>📅</span>
                Last workout: <b style={{ color: accent }}>{formatDate(sessionSummary.lastWorkoutDate)}</b>. Weekly target: <b style={{ color: accent }}>{weeklySessionDone}/{weeklySessionTarget}</b> sessions.
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
                      <div style={styles.metaKey}>Sets done</div>
                      <div style={styles.metaVal}>
                        {activeCompletedSets}/{completionTargetCount}
                      </div>
                    </div>
                    <div style={styles.metaChip}>
                      <div style={styles.metaKey}>Reps logged</div>
                      <div style={styles.metaVal}>{totalRepsLogged}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, color: textMuted, fontSize: 12 }}>
                    Completion: <b style={{ color: accent }}>{completionRate}%</b> of planned sets.
                  </div>
                  <div style={styles.buttonRow}>
                    <button style={styles.primaryButton} onClick={activeSession ? finishSession : beginSession}>
                      {activeSession ? "Finish & save" : "Start session"}
                    </button>
                    <button style={styles.secondaryButton} onClick={pauseSession} disabled={!activeSession || activeSession.isPaused}>
                      Pause
                    </button>
                    <button style={styles.secondaryButton} onClick={resumeSession} disabled={!activeSession || !activeSession.isPaused}>
                      Resume
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
              <div style={{ marginBottom: 12, color: textMuted, fontSize: 12 }}>
                Goal template: <b style={{ color: accent }}>{getGoalLabel(activeGoalType)}</b> · Active split days: {workoutDays.length}
              </div>
              <div style={styles.buttonRow}>
                {workoutDays.map((day) => (
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
                  const plannedSets = getPlannedSetCount(exercise.sets);
                  const completedSets = activeSession ? getCompletedSetsForExercise(activeSession, exercise.name, plannedSets) : 0;
                  const isDone = completedSets >= plannedSets;
                  const repsForExercise = Array.isArray(activeSession?.repsLogByExercise?.[exercise.name])
                    ? activeSession.repsLogByExercise[exercise.name]
                    : [];
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
                      <div
                        style={{
                          ...styles.exNum,
                          border: isDone ? `1px solid ${accent}` : "1px solid transparent",
                        }}
                      >
                        {isDone ? "✓" : index + 1}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ ...styles.exName, textDecoration: isDone ? "line-through" : "none" }}>{exercise.name}</div>
                        <div style={styles.exDetail}>
                          Plan: {exercise.sets} · Done: {completedSets}/{plannedSets} sets
                        </div>
                        {repsForExercise.length > 0 && (
                          <div style={{ ...styles.exDetail, marginTop: 4 }}>Reps: {repsForExercise.join(", ")}</div>
                        )}
                      </div>
                      <div style={{ textAlign: "right", minWidth: 122 }}>
                        <div style={{ color: accent2, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", marginBottom: 8 }}>{exercise.calories} kcal</div>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              markSetDone(exercise);
                            }}
                            disabled={!activeSession || completedSets >= plannedSets}
                            style={{
                              ...styles.secondaryButton,
                              padding: "6px 10px",
                              fontSize: 11,
                              opacity: !activeSession || completedSets >= plannedSets ? 0.6 : 1,
                            }}
                          >
                            Done set
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              undoSetDone(exercise);
                            }}
                            disabled={!activeSession || completedSets <= 0}
                            style={{
                              ...styles.ghostButton,
                              padding: "6px 10px",
                              fontSize: 11,
                              opacity: !activeSession || completedSets <= 0 ? 0.6 : 1,
                            }}
                          >
                            Undo
                          </button>
                        </div>
                      </div>
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
                    {Array.isArray(session.exercisePerformance) && session.exercisePerformance.length > 0 ? (
                      <div>
                        <div style={{ marginBottom: 8, color: text }}>Exercise log</div>
                        {session.exercisePerformance.map((item) => (
                          <div key={`${session.id}-${item.name}`} style={{ marginBottom: 6 }}>
                            <b style={{ color: text }}>{item.name}</b>: {item.completedSets}/{item.plannedSets} sets
                            {Array.isArray(item.repsLog) && item.repsLog.length > 0 ? ` · reps ${item.repsLog.join(", ")}` : ""}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>Completed exercises: {session.completedExerciseIds.length}</div>
                    )}
                    <div style={{ marginTop: 6 }}>{session.notes ? `Notes: ${session.notes}` : "No notes added."}</div>
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

            <div style={{ ...styles.card }}>
              <div style={styles.sectionTitle}>Nutrition Suggestions</div>
              <div style={{ color: textMuted, fontSize: 13, lineHeight: 1.7 }}>
                {getNutritionSuggestions(profile, targetCalories).map((sugg) => (
                  <div key={sugg} style={{ marginBottom: 8 }}>• {sugg}</div>
                ))}
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
                  <div style={styles.filePickerCard}>
                    <div style={styles.filePickerHeader}>
                      <div>
                        <div style={styles.filePickerTitle}>Profile photo</div>
                        <div style={styles.filePickerHint}>Choose an image to personalize the dashboard and report.</div>
                      </div>
                      <button type="button" style={styles.secondaryButton} onClick={() => profilePhotoInputRef.current?.click()}>
                        Choose image
                      </button>
                    </div>
                    <input
                      ref={profilePhotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: "none" }}
                    />
                    <div style={styles.filePickerMeta}>
                      <span style={styles.fileBadge}>{profilePhotoFileName}</span>
                    </div>
                  </div>
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
                <select id="goal" value={customGoalType} onChange={(event) => setCustomGoalType(event.target.value)} style={styles.input}>
                  {goalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                  disabled={autoPlanEnabled}
                />
                <div style={{ marginTop: 6, fontSize: 12, color: textMuted }}>
                  Current plan for {getGoalLabel(customGoalType)} supports up to {getWorkoutDaysForGoalType(customGoalType).length} workout days.
                </div>
              </div>
              <div>
                <label style={styles.label} htmlFor="workoutType">
                  Workout type
                </label>
                <select
                  id="workoutType"
                  value={customWorkoutType}
                  onChange={(event) => setCustomWorkoutType(event.target.value)}
                  style={styles.input}
                  disabled={autoPlanEnabled}
                >
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
              <button
                style={
                  autoPlanEnabled
                    ? {
                        ...styles.primaryButton,
                        boxShadow: "0 0 0 1px rgb(var(--accent-rgb) / 0.65), 0 0 24px rgb(var(--accent-rgb) / 0.35)",
                        border: "1px solid rgb(var(--accent-rgb) / 0.8)",
                      }
                    : styles.secondaryButton
                }
                onClick={toggleAutoPlan}
              >
                Auto-plan: {autoPlanEnabled ? "ON" : "OFF"}
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
            <div style={{ marginTop: 10, fontSize: 12, color: textMuted, lineHeight: 1.6 }}>
              {autoPlanEnabled
                ? "Auto-plan is ON: sessions/week and workout type are managed automatically for the selected goal."
                : "Auto-plan is OFF: you can manually choose sessions/week and workout type."}
            </div>
            <div style={{ marginTop: 18, ...styles.filePickerCard }}>
              <div style={styles.filePickerHeader}>
                <div>
                  <div style={styles.filePickerTitle}>Theme selection</div>
                  <div style={styles.filePickerHint}>Choose a look that fits your mood. The selection is saved on this device.</div>
                </div>
                <span style={styles.fileBadge}>{theme.label}</span>
              </div>
              <div style={{ ...styles.tutorialPills, marginTop: 16 }}>
                {Object.entries(themeOptions).map(([key, option]) => (
                  <button
                    key={key}
                    type="button"
                    style={{
                      ...styles.tutorialPill,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 12,
                      background: themeKey === key ? "rgb(var(--accent-rgb) / 0.12)" : "transparent",
                      borderColor: themeKey === key ? "rgb(var(--accent-rgb) / 0.35)" : border,
                    }}
                    onClick={() => applyTheme(key)}
                  >
                    <div style={{ width: 56, height: 36, borderRadius: 8, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)", border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0, overflow: "hidden" }}>
                      <div style={{ width: "100%", height: "100%", background: `linear-gradient(90deg, ${option.vars["--accent"]}, ${option.vars["--accent-2"]})` }} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 700 }}>{option.label}</div>
                      <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{option.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={hideSplash}
                  onChange={(e) => {
                    const next = Boolean(e.target.checked);
                    setHideSplash(next);
                    if (next) setShowSplash(false);
                  }}
                />
                <div style={{ fontSize: 13 }}>Don't show splash again</div>
              </label>
            </div>
            <input
              ref={backupInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleBackupImport}
              style={{ display: "none" }}
            />
            <div style={{ ...styles.filePickerCard, marginTop: 16 }}>
              <div style={styles.filePickerHeader}>
                <div>
                  <div style={styles.filePickerTitle}>Backup import</div>
                  <div style={styles.filePickerHint}>Pick a JSON backup file to restore your workout data.</div>
                </div>
                <button type="button" style={styles.secondaryButton} onClick={triggerBackupImport}>
                  Choose file
                </button>
              </div>
              <div style={styles.filePickerMeta}>
                <span style={styles.fileBadge}>{backupFileName}</span>
              </div>
            </div>
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
