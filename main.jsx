import { useState } from "react";
import ReactDOM from "react-dom/client";

const accent = "#C8F135";
const dark = "#0d0d0d";
const card = "#161616";
const muted = "#2a2a2a";
const textMuted = "#888";

const styles = {
  app: {
    minHeight: "100vh",
    background: dark,
    color: "#f0f0f0",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    padding: "0 0 60px 0",
  },
  hero: {
    background: `linear-gradient(135deg, #0d0d0d 60%, #1a2200 100%)`,
    borderBottom: `1px solid ${muted}`,
    padding: "40px 24px 32px",
    position: "relative",
    overflow: "hidden",
  },
  heroAccent: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
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
    fontFamily: "'Anton', 'Impact', sans-serif",
    fontSize: 38,
    lineHeight: 1.05,
    letterSpacing: -1,
    color: "#fff",
    margin: "0 0 6px 0",
  },
  heroSub: {
    color: textMuted,
    fontSize: 13,
    marginBottom: 20,
  },
  statRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 4,
  },
  stat: {
    background: muted,
    borderRadius: 10,
    padding: "10px 16px",
    minWidth: 80,
  },
  statVal: {
    fontSize: 18,
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
    padding: "18px 24px 0",
    borderBottom: `1px solid ${muted}`,
    overflowX: "auto",
  },
  tab: (active) => ({
    background: active ? accent : "transparent",
    color: active ? dark : textMuted,
    border: "none",
    borderRadius: "8px 8px 0 0",
    padding: "9px 18px",
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    letterSpacing: 1,
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    transition: "all 0.18s",
  }),
  section: {
    padding: "24px 24px 0",
    maxWidth: 720,
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
    background: card,
    border: `1px solid ${muted}`,
    borderRadius: 14,
    padding: "18px 20px",
    marginBottom: 14,
  },
  dayLabel: {
    fontSize: 11,
    letterSpacing: 3,
    color: accent,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dayTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 12,
  },
  exerciseRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "9px 0",
    borderBottom: `1px solid ${muted}`,
  },
  exNum: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: muted,
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
    color: "#f0f0f0",
    fontWeight: 600,
    marginBottom: 2,
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
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 14,
  },
  macroCard: {
    background: card,
    border: `1px solid ${muted}`,
    borderRadius: 14,
    padding: "16px 18px",
  },
  macroVal: {
    fontFamily: "'Anton', Impact, sans-serif",
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
  mealCard: {
    background: card,
    border: `1px solid ${muted}`,
    borderRadius: 14,
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
    color: "#ccc",
    padding: "4px 0",
    borderBottom: `1px solid ${muted}`,
    display: "flex",
    justifyContent: "space-between",
  },
  tip: {
    background: `${accent}10`,
    border: `1px solid ${accent}33`,
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 10,
    fontSize: 13,
    color: "#ddd",
    lineHeight: 1.6,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  progressBar: (pct) => ({
    height: 6,
    borderRadius: 4,
    background: muted,
    margin: "8px 0 4px",
    overflow: "hidden",
    position: "relative",
  }),
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: `linear-gradient(90deg, ${accent}, #8fba00)`,
    borderRadius: 4,
    transition: "width 0.6s ease",
  }),
};

const workoutPlan = [
  {
    day: "Day 1",
    focus: "Chest & Triceps",
    tag: "Push",
    exercises: [
      { name: "Barbell Bench Press", sets: "4 × 8–10", tip: "Arch slightly, retract scapula, controlled descent" },
      { name: "Incline Dumbbell Press", sets: "3 × 10–12", tip: "30–45° incline, feel the upper chest stretch" },
      { name: "Cable Chest Fly", sets: "3 × 12–15", tip: "Squeeze at peak contraction" },
      { name: "Tricep Rope Pushdown", sets: "3 × 12–15", tip: "Keep elbows fixed, spread rope at bottom" },
      { name: "Overhead Tricep Extension", sets: "3 × 10–12", tip: "Full stretch overhead, slow eccentric" },
    ],
  },
  {
    day: "Day 2",
    focus: "Back & Biceps",
    tag: "Pull",
    exercises: [
      { name: "Deadlift", sets: "4 × 5–6", tip: "Hinge at hips, bar stays close, brace core" },
      { name: "Lat Pulldown", sets: "4 × 10–12", tip: "Lean back slightly, drive elbows to hips" },
      { name: "Seated Cable Row", sets: "3 × 10–12", tip: "Chest up, squeeze shoulder blades" },
      { name: "Barbell Curl", sets: "3 × 10–12", tip: "No swinging, full extension at bottom" },
      { name: "Hammer Curl", sets: "3 × 12", tip: "Neutral grip, targets brachialis" },
    ],
  },
  {
    day: "Day 3",
    focus: "Legs & Core",
    tag: "Legs",
    exercises: [
      { name: "Barbell Squat", sets: "4 × 8–10", tip: "Knees track toes, hit parallel or below" },
      { name: "Romanian Deadlift", sets: "3 × 10–12", tip: "Hinge at hips, big hamstring stretch" },
      { name: "Leg Press", sets: "3 × 12–15", tip: "Feet shoulder-width, don't lock knees" },
      { name: "Leg Curl (Machine)", sets: "3 × 12–15", tip: "Slow eccentric, flex hamstrings hard" },
      { name: "Plank", sets: "3 × 45–60 sec", tip: "Squeeze glutes and abs, neutral spine" },
    ],
  },
  {
    day: "Day 4",
    focus: "Shoulders & Arms",
    tag: "Push/Pull",
    exercises: [
      { name: "Seated DB Shoulder Press", sets: "4 × 10–12", tip: "Don't flare elbows excessively" },
      { name: "Lateral Raise", sets: "4 × 15–20", tip: "Lead with elbows, avoid shrugging" },
      { name: "Face Pulls", sets: "3 × 15", tip: "Great for rear delts & shoulder health" },
      { name: "EZ-Bar Curl", sets: "3 × 10–12", tip: "Supinate at top for peak contraction" },
      { name: "Skull Crusher", sets: "3 × 10–12", tip: "Lower to forehead, elbows fixed" },
    ],
  },
  {
    day: "Day 5",
    focus: "Full Body & Weak Points",
    tag: "Full Body",
    exercises: [
      { name: "Pull-Ups / Assisted Pull-Ups", sets: "4 × max reps", tip: "Full ROM, dead hang at bottom" },
      { name: "Dumbbell Lunges", sets: "3 × 10 each leg", tip: "Keep torso upright" },
      { name: "Incline DB Curl", sets: "3 × 12", tip: "Full stretch for long head of bicep" },
      { name: "Cable Lateral Raise", sets: "3 × 15", tip: "Single arm, constant tension" },
      { name: "Calf Raise", sets: "4 × 20", tip: "Full range, pause at top & bottom" },
    ],
  },
];

const meals = [
  {
    time: "7:00 AM",
    title: "Breakfast",
    emoji: "🍳",
    items: [
      ["4 whole eggs + 2 egg whites scrambled", "~28g protein"],
      ["2 slices whole grain toast", "~30g carbs"],
      ["1 banana", "~27g carbs"],
      ["Glass of whole milk", "~8g protein"],
    ],
  },
  {
    time: "10:30 AM",
    title: "Mid-Morning Snack",
    emoji: "🥤",
    items: [
      ["Whey protein shake (1 scoop)", "~25g protein"],
      ["1 cup oats with honey", "~50g carbs"],
      ["Handful of almonds", "~6g protein, healthy fats"],
    ],
  },
  {
    time: "1:00 PM",
    title: "Lunch",
    emoji: "🍗",
    items: [
      ["200g chicken breast grilled", "~46g protein"],
      ["1.5 cups white rice", "~65g carbs"],
      ["Mixed veggies (broccoli, peppers)", "~fiber & micros"],
      ["1 tbsp olive oil dressing", "~healthy fats"],
    ],
  },
  {
    time: "4:00 PM",
    title: "Pre-Workout",
    emoji: "⚡",
    items: [
      ["1 apple + 1 tbsp peanut butter", "~25g carbs, 4g protein"],
      ["Creatine monohydrate 5g", "~performance boost"],
    ],
  },
  {
    time: "7:00 PM",
    title: "Post-Workout / Dinner",
    emoji: "🥩",
    items: [
      ["200g salmon or lean beef", "~40–46g protein"],
      ["Sweet potato (200g)", "~40g carbs"],
      ["Salad with olive oil", "~antioxidants & fats"],
    ],
  },
  {
    time: "9:30 PM",
    title: "Night Snack",
    emoji: "🌙",
    items: [
      ["Casein protein or Greek yogurt (200g)", "~20–25g slow protein"],
      ["Handful of walnuts", "~omega-3 fats"],
    ],
  },
];

const tips = [
  { icon: "📈", text: "Progressive overload is your #1 tool. Add 2.5–5 kg or 1–2 reps to each lift every 1–2 weeks. This is how muscles grow." },
  { icon: "😴", text: "Sleep 8–9 hours. Most muscle is built during sleep — GH and testosterone peak at night. Don't sacrifice recovery." },
  { icon: "💧", text: "Drink 3–4 liters of water daily. Dehydration reduces strength by up to 10% and impairs recovery." },
  { icon: "⚖️", text: "Aim to gain 0.5–1 kg per month. Faster than that means excess fat. Weigh yourself weekly (same time, same conditions)." },
  { icon: "🔁", text: "Stick to the plan for 12 weeks before changing anything. Consistency beats novelty — beginners gain fast when they stay the course." },
  { icon: "💊", text: "Supplements that actually work: Creatine monohydrate (5g/day), Whey protein (to hit protein goals), Vitamin D3 + Zinc." },
];

const getExerciseInfoUrl = (exerciseName) =>
  `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(`${exerciseName} exercise`)}`;

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState("workout");
  const [expandedDay, setExpandedDay] = useState(0);

  // BMI & TDEE
  const bmi = (56 / (1.62 * 1.62)).toFixed(1);
  const tdee = Math.round(56 * 10 + 162 * 6.25 - 22 * 5 + 5) * 1.55; // Mifflin, moderate activity
  const targetCalories = Math.round(tdee + 350);
  const protein = Math.round(56 * 2.2);
  const carbs = Math.round((targetCalories * 0.45) / 4);
  const fats = Math.round((targetCalories * 0.25) / 9);

  return (
    <div style={styles.app}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroAccent} />
        <div style={styles.heroLabel}>// Bulk Program — 2026</div>
        <h1 style={styles.heroTitle}>
          My<br />PHYSIQUE<br />PLAN
        </h1>
        <div style={styles.heroSub}>Male · 22yrs · Beginner · Aesthetic Bulk </div>
        <div style={styles.statRow}>
          {[
            { key: "Weight", val: "56 kg" },
            { key: "Height", val: "162 cm" },
            { key: "BMI", val: bmi },
            { key: "Target kcal", val: `${targetCalories}` },
          ].map((s) => (
            <div key={s.key} style={styles.stat}>
              <span style={styles.statVal}>{s.val}</span>
              <span style={styles.statKey}>{s.key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { id: "workout", label: "Workout" },
          { id: "nutrition", label: "Nutrition" },
          { id: "tips", label: "Tips & Recovery" },
        ].map((t) => (
          <button key={t.id} style={styles.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Workout Tab */}
      {activeTab === "workout" && (
        <div style={styles.section}>
          <div style={{ ...styles.card, marginTop: 24, background: `${accent}0d`, border: `1px solid ${accent}33` }}>
            <div style={{ fontSize: 12, color: accent, marginBottom: 6, letterSpacing: 2 }}>WEEKLY SPLIT</div>
            <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.7 }}>
              <b style={{ color: "#fff" }}>Mon</b> Chest & Tris · <b style={{ color: "#fff" }}>Tue</b> Back & Bis · <b style={{ color: "#fff" }}>Wed</b> Legs & Core · <b style={{ color: "#fff" }}>Thu</b> REST · <b style={{ color: "#fff" }}>Fri</b> Shoulders & Arms · <b style={{ color: "#fff" }}>Sat</b> Full Body · <b style={{ color: "#fff" }}>Sun</b> REST
            </div>
          </div>

          {workoutPlan.map((day, i) => (
            <div key={i} style={styles.card}>
              <div
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
              >
                <div>
                  <div style={styles.dayLabel}>{day.day} <span style={styles.badge}>{day.tag}</span></div>
                  <div style={styles.dayTitle}>{day.focus}</div>
                  <div style={{ fontSize: 11, color: textMuted }}>{day.exercises.length} exercises</div>
                </div>
                <div style={{ color: accent, fontSize: 18, transition: "transform 0.2s", transform: expandedDay === i ? "rotate(180deg)" : "none" }}>▾</div>
              </div>

              {expandedDay === i && (
                <div style={{ marginTop: 14 }}>
                  {day.exercises.map((ex, j) => (
                    <div key={j} style={{ ...styles.exerciseRow, borderBottom: j < day.exercises.length - 1 ? `1px solid ${muted}` : "none" }}>
                      <div style={styles.exNum}>{j + 1}</div>
                      <div style={{ flex: 1 }}>
                        <a href={getExerciseInfoUrl(ex.name)} target="_blank" rel="noreferrer" style={{ ...styles.exName, ...styles.exLink }}>
                          {ex.name}
                        </a>
                        <div style={styles.exDetail}>{ex.sets} · {ex.tip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === "nutrition" && (
        <div style={styles.section}>
          <div style={{ marginTop: 24, marginBottom: 4, ...styles.sectionTitle }}>Daily Macro Targets</div>
          <div style={styles.macroGrid}>
            {[
              { key: "Calories", val: targetCalories, unit: "kcal", pct: 100 },
              { key: "Protein", val: protein, unit: "g", pct: 85 },
              { key: "Carbs", val: carbs, unit: "g", pct: 70 },
              { key: "Fats", val: fats, unit: "g", pct: 55 },
            ].map((m) => (
              <div key={m.key} style={styles.macroCard}>
                <div style={styles.macroVal}>{m.val}<span style={{ fontSize: 14, color: textMuted }}> {m.unit}</span></div>
                <div style={styles.macroKey}>{m.key}</div>
                <div style={styles.progressBar(m.pct)}>
                  <div style={styles.progressFill(m.pct)} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...styles.tip, marginBottom: 20 }}>
            <span style={styles.tipIcon}>🧮</span>
            Your TDEE is estimated at <b style={{ color: accent }}>{Math.round(tdee)} kcal</b>. Add a <b style={{ color: accent }}>~350 kcal surplus</b> for lean bulk. Adjust up/down based on weekly scale changes.
          </div>

          <div style={styles.sectionTitle}>Meal Plan</div>
          {meals.map((meal, i) => (
            <div key={i} style={styles.mealCard}>
              <div style={styles.mealTitle}>
                <span>{meal.emoji}</span>
                <span>{meal.title}</span>
                <span style={styles.mealTime}>{meal.time}</span>
              </div>
              {meal.items.map(([food, macro], j) => (
                <div key={j} style={{ ...styles.mealItem, borderBottom: j < meal.items.length - 1 ? `1px solid ${muted}` : "none" }}>
                  <span>{food}</span>
                  <span style={{ color: accent, fontSize: 11, flexShrink: 0, marginLeft: 8 }}>{macro}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ ...styles.tip, marginTop: 6 }}>
            <span style={styles.tipIcon}>🥚</span>
            <b>Protein is king.</b> Hit <b style={{ color: accent }}>{protein}g/day</b> (2.2g per kg bodyweight). Prioritize whole foods — chicken, eggs, fish, dairy, lentils.
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === "tips" && (
        <div style={styles.section}>
          <div style={{ marginTop: 24, marginBottom: 4, ...styles.sectionTitle }}>Beginner Rules</div>
          {tips.map((tip, i) => (
            <div key={i} style={styles.tip}>
              <span style={styles.tipIcon}>{tip.icon}</span>
              {tip.text}
            </div>
          ))}

          <div style={{ ...styles.sectionTitle, marginTop: 24 }}>12-Week Milestones</div>
          {[
            { week: "Week 1–3", milestone: "Learn form on all compound lifts. Focus on technique, not weight.", pct: 15 },
            { week: "Week 4–6", milestone: "Start adding weight systematically. Track every session.", pct: 40 },
            { week: "Week 7–9", milestone: "Visible upper body pump. Strength numbers climbing.", pct: 65 },
            { week: "Week 10–12", milestone: "2–3 kg gained, noticeably fuller physique. Recalibrate calories.", pct: 90 },
          ].map((m, i) => (
            <div key={i} style={styles.card}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: accent, textTransform: "uppercase", marginBottom: 4 }}>{m.week}</div>
              <div style={{ fontSize: 13, color: "#ddd" }}>{m.milestone}</div>
              <div style={styles.progressBar(m.pct)}>
                <div style={styles.progressFill(m.pct)} />
              </div>
              <div style={{ fontSize: 10, color: textMuted }}>{m.pct}% through program</div>
            </div>
          ))}

          <div style={{ ...styles.tip, marginTop: 8 }}>
            <span style={styles.tipIcon}>🩺</span>
            <b>Note:</b> This plan is a general guide. Consult a doctor before starting if you have any health concerns. Listen to your body — pain (not soreness) is a signal to stop.
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FitnessApp />);
