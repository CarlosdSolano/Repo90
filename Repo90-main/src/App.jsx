import { useEffect, useMemo, useState } from "react";

/* ---------- íconos propios (sin dependencias externas, para que la PWA
   funcione offline sin depender de que un CDN de terceros cargue bien) ---------- */
function Icon({ size = 20, color = "currentColor", strokeWidth = 2, className, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}
const Home = (p) => (
  <Icon {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </Icon>
);
const UtensilsCrossed = (p) => (
  <Icon {...p}>
    <path d="M4 3l7 7" />
    <path d="M4 10l7-7" />
    <path d="M2 21l9-9" />
    <path d="M20 3l-9 15" />
    <path d="M17 12l4 9" />
  </Icon>
);
const Dumbbell = (p) => (
  <Icon {...p}>
    <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
  </Icon>
);
const TrendingUp = (p) => (
  <Icon {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </Icon>
);
const Check = (p) => (
  <Icon {...p}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);
const Flame = (p) => (
  <Icon {...p}>
    <path d="M12 2c-2 4-6 6-6 11a6 6 0 0 0 12 0c0-2-1-3-2-5 0 2-1 3-2 3-1.5 0-2-1.5-2-3 0-2 1-4 0-6z" />
  </Icon>
);
const Moon = (p) => (
  <Icon {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Icon>
);
const Footprints = (p) => (
  <Icon {...p}>
    <ellipse cx="7" cy="16" rx="3" ry="5" transform="rotate(-18 7 16)" />
    <ellipse cx="17" cy="8" rx="3" ry="5" transform="rotate(18 17 8)" />
  </Icon>
);
const ShoppingCart = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Icon>
);
const ArrowLeftRight = (p) => (
  <Icon {...p}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Icon>
);
const RotateCcw = (p) => (
  <Icon {...p}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </Icon>
);

/* ---------- mini gráfico de línea propio (reemplaza a recharts) ---------- */
function WeightChart({ data, color, gridColor, mutedColor }) {
  const W = 320;
  const H = 140;
  const padL = 30;
  const padB = 18;
  const padT = 8;
  const padR = 8;
  if (data.length === 0) return null;

  const weights = data.map((d) => d.weight);
  const minW = Math.min(...weights) - 2;
  const maxW = Math.max(...weights) + 2;
  const minDay = data[0].day;
  const maxDay = Math.max(data[data.length - 1].day, minDay + 1);

  const x = (day) => padL + ((day - minDay) / (maxDay - minDay)) * (W - padL - padR);
  const y = (w) => padT + (1 - (w - minW) / (maxW - minW || 1)) * (H - padT - padB);

  const points = data.map((d) => `${x(d.day)},${y(d.weight)}`).join(" ");
  const gridLines = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {gridLines.map((f, i) => (
        <line
          key={i}
          x1={padL}
          x2={W - padR}
          y1={padT + f * (H - padT - padB)}
          y2={padT + f * (H - padT - padB)}
          stroke={gridColor}
          strokeDasharray="3 3"
        />
      ))}
      <text x={0} y={y(maxW) + 4} fontSize="10" fill={mutedColor}>
        {maxW.toFixed(0)}
      </text>
      <text x={0} y={y(minW) + 4} fontSize="10" fill={mutedColor}>
        {minW.toFixed(0)}
      </text>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(d.day)} cy={y(d.weight)} r="3" fill={color} />
          <text x={x(d.day)} y={H - 2} fontSize="9" fill={mutedColor} textAnchor="middle">
            D{d.day}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- tokens ---------- */
const C = {
  ink: "#15181D",
  surface: "#1D2129",
  surfaceAlt: "#262B35",
  hairline: "#333947",
  text: "#ECEEF0",
  textMuted: "#8B929E",
  move: "#B7D33B", // entrenamiento
  fuel: "#E3AE3E", // nutrición
  rest: "#8A7FBB", // descanso
};

const ROTATION_WEEKS = 4; // el mesociclo de ejercicios se repite cada 4 semanas

/* ---------- bloques de entrenamiento (gimnasio) ---------- */
/* cada "slot" tiene 4 variantes; la semana activa decide cuál se muestra,
   así el mismo grupo muscular se entrena con movimientos distintos cada semana */
const DAY_TYPES = {
  empuje: {
    title: "Pecho, hombro y tríceps",
    slots: [
      {
        variants: [
          { name: "Press de banca con barra", sets: "4×8–10", rest: "120 s" },
          { name: "Press inclinado con mancuernas", sets: "4×8–12", rest: "120 s" },
          { name: "Press en máquina Smith", sets: "4×8–10", rest: "120 s" },
          { name: "Press de banca con mancuernas", sets: "4×10–12", rest: "120 s" },
        ],
      },
      {
        variants: [
          { name: "Press inclinado con mancuernas", sets: "3×10–12", rest: "90 s" },
          { name: "Press declinado con barra", sets: "3×8–10", rest: "90 s" },
          { name: "Press en máquina Hammer", sets: "3×10–12", rest: "90 s" },
          { name: "Aperturas en polea (cruce)", sets: "3×12–15", rest: "60 s" },
        ],
      },
      {
        variants: [
          { name: "Press militar con barra", sets: "3×8–10", rest: "90 s" },
          { name: "Press Arnold con mancuernas", sets: "3×10–12", rest: "90 s" },
          { name: "Elevaciones laterales en polea", sets: "4×12–15", rest: "60 s" },
          { name: "Press de hombro en máquina", sets: "3×10–12", rest: "90 s" },
        ],
      },
      {
        variants: [
          { name: "Elevaciones laterales con mancuernas", sets: "3×12–15", rest: "60 s" },
          { name: "Elevación frontal con disco", sets: "3×12–15", rest: "60 s" },
          { name: "Pájaro (deltoide posterior)", sets: "3×12–15", rest: "60 s" },
          { name: "Elevaciones laterales en máquina", sets: "3×15", rest: "60 s" },
        ],
      },
      {
        variants: [
          { name: "Press francés con barra Z", sets: "3×10–12", rest: "90 s" },
          { name: "Extensión de tríceps en polea (cuerda)", sets: "3×12–15", rest: "60 s" },
          { name: "Fondos en paralelas asistidas", sets: "3×8–12", rest: "90 s" },
          { name: "Patada de tríceps con mancuerna", sets: "3×12–15", rest: "60 s" },
        ],
      },
    ],
  },
  pierna: {
    title: "Piernas y abdomen",
    slots: [
      {
        variants: [
          { name: "Sentadilla con barra", sets: "4×8–10", rest: "150 s" },
          { name: "Sentadilla hack en máquina", sets: "4×10–12", rest: "120 s" },
          { name: "Prensa de piernas", sets: "4×10–15", rest: "120 s" },
          { name: "Sentadilla búlgara con mancuernas", sets: "4×8–12 / pierna", rest: "120 s" },
        ],
      },
      {
        variants: [
          { name: "Peso muerto rumano con barra", sets: "4×8–10", rest: "120 s" },
          { name: "Peso muerto rumano con mancuernas", sets: "4×10–12", rest: "120 s" },
          { name: "Curl femoral en máquina", sets: "4×10–15", rest: "90 s" },
          { name: "Hip thrust con barra", sets: "4×8–12", rest: "120 s" },
        ],
      },
      {
        variants: [
          { name: "Extensión de cuádriceps en máquina", sets: "3×12–15", rest: "90 s" },
          { name: "Zancadas con mancuernas", sets: "3×10–15 / pierna", rest: "90 s" },
          { name: "Prensa a una pierna", sets: "3×10–12 / pierna", rest: "90 s" },
          { name: "Step-ups con mancuernas", sets: "3×10–15 / pierna", rest: "90 s" },
        ],
      },
      {
        variants: [
          { name: "Elevación de talones de pie en máquina", sets: "4×15–20", rest: "60 s" },
          { name: "Elevación de talones sentado", sets: "4×15–20", rest: "60 s" },
          { name: "Elevación de talones en prensa", sets: "4×15–20", rest: "60 s" },
          { name: "Elevación de talones a una pierna", sets: "3×12–15 / pierna", rest: "60 s" },
        ],
      },
      {
        variants: [
          { name: "Elevación de piernas colgado", sets: "3×10–15", rest: "60 s" },
          { name: "Crunch en polea", sets: "3×15–20", rest: "60 s" },
          { name: "Plancha", sets: "3×30–60 s", rest: "60 s" },
          { name: "Rueda abdominal", sets: "3×8–12", rest: "60 s" },
        ],
      },
    ],
  },
  tironMiercoles: {
    title: "Espalda y bíceps",
    slots: [
      {
        variants: [
          { name: "Jalón al pecho en polea", sets: "4×10–12", rest: "90 s" },
          { name: "Dominadas asistidas", sets: "4×6–10", rest: "120 s" },
          { name: "Jalón agarre ancho", sets: "4×10–12", rest: "90 s" },
          { name: "Jalón con agarre supino", sets: "4×10–12", rest: "90 s" },
        ],
      },
      {
        variants: [
          { name: "Remo con barra", sets: "4×8–10", rest: "120 s" },
          { name: "Remo en máquina Hammer", sets: "4×10–12", rest: "90 s" },
          { name: "Remo con mancuerna a una mano", sets: "4×10–12 / lado", rest: "90 s" },
          { name: "Remo en polea baja", sets: "4×10–12", rest: "90 s" },
        ],
      },
      {
        variants: [
          { name: "Pullover en polea", sets: "3×12–15", rest: "90 s" },
          { name: "Face pull en polea", sets: "3×12–15", rest: "60 s" },
          { name: "Remo Pendlay", sets: "3×8–10", rest: "90 s" },
          { name: "Straight-arm pulldown", sets: "3×12–15", rest: "60 s" },
        ],
      },
      {
        variants: [
          { name: "Curl con barra Z", sets: "4×8–12", rest: "90 s" },
          { name: "Curl con mancuernas alterno", sets: "4×10–12", rest: "90 s" },
          { name: "Curl en polea con barra recta", sets: "4×10–12", rest: "90 s" },
          { name: "Curl concentrado con mancuerna", sets: "3×10–12 / lado", rest: "90 s" },
        ],
      },
      {
        variants: [
          { name: "Curl martillo con mancuernas", sets: "3×10–15", rest: "90 s" },
          { name: "Curl en banco Scott", sets: "3×10–12", rest: "90 s" },
          { name: "Curl araña", sets: "3×10–12", rest: "60 s" },
          { name: "Curl inverso con barra", sets: "3×12–15", rest: "60 s" },
        ],
      },
    ],
  },
  tironSabado: {
    title: "Espalda y brazos",
    slots: [
      {
        variants: [
          { name: "Remo en T con barra", sets: "4×8–10", rest: "120 s" },
          { name: "Jalón agarre cerrado (V)", sets: "4×10–12", rest: "90 s" },
          { name: "Remo invertido en Smith", sets: "4×10–15", rest: "90 s" },
          { name: "Dominadas asistidas", sets: "4×6–10", rest: "120 s" },
        ],
      },
      {
        variants: [
          { name: "Pullover con mancuerna", sets: "3×10–15", rest: "90 s" },
          { name: "Remo unilateral en polea", sets: "3×10–12 / lado", rest: "90 s" },
          { name: "Extensión lumbar en banco", sets: "3×12–15", rest: "60 s" },
          { name: "Face pull en polea", sets: "3×12–15", rest: "60 s" },
        ],
      },
      {
        variants: [
          { name: "Curl con mancuernas en banco inclinado", sets: "3×10–12", rest: "90 s" },
          { name: "Curl con barra recta", sets: "3×8–12", rest: "90 s" },
          { name: "Curl en polea alta (doble)", sets: "3×12–15", rest: "60 s" },
          { name: "Curl martillo con cuerda en polea", sets: "3×12–15", rest: "60 s" },
        ],
      },
      {
        variants: [
          { name: "Press francés con mancuerna", sets: "3×10–12", rest: "90 s" },
          { name: "Extensión de tríceps en polea (cuerda)", sets: "3×12–15", rest: "60 s" },
          { name: "Fondos entre bancos con peso", sets: "3×8–12", rest: "90 s" },
          { name: "Patada de tríceps en polea", sets: "3×12–15", rest: "60 s" },
        ],
      },
    ],
  },
  descanso: { title: "Descanso", slots: [] },
};

function getWeekNumber(programDay) {
  return Math.ceil(programDay / 7);
}
function getExercisesFor(dayType, week) {
  const type = DAY_TYPES[dayType];
  const idx = (week - 1) % ROTATION_WEEKS;
  return type.slots.map((slot) => slot.variants[idx]);
}

/* ---------- plan data (comidas se mantienen igual) ---------- */
const DAYS = [
  {
    id: "lunes",
    short: "Lun",
    full: "Lunes",
    dayType: "empuje",
    meals: {
      desayuno: "3 huevos + 60 g avena + banano",
      almuerzo: "150 g pollo + 180 g arroz + verduras + 1 cdita aceite",
      merienda: "250 ml leche + 30 g maní + fruta",
      cena: "3 huevos + 200 g papa + ensalada",
    },
  },
  {
    id: "martes",
    short: "Mar",
    full: "Martes",
    dayType: "pierna",
    meals: {
      desayuno: "3 huevos + 2 arepas pequeñas + fruta",
      almuerzo: "150 g pollo + 200 g papa + lentejas + verduras",
      merienda: "Avena + leche + banano",
      cena: "1 lata de atún + 150–180 g arroz + ensalada",
    },
  },
  {
    id: "miercoles",
    short: "Mié",
    full: "Miércoles",
    dayType: "tironMiercoles",
    meals: {
      desayuno: "60 g avena + 250 ml leche + 3 huevos + banano",
      almuerzo: "150 g pollo + 180 g arroz + fríjoles + verduras",
      merienda: "2 huevos + fruta + 20 g maní",
      cena: "150 g pollo + 200 g papa + verduras",
    },
  },
  {
    id: "jueves",
    short: "Jue",
    full: "Jueves",
    dayType: "empuje",
    meals: {
      desayuno: "3 huevos + 2 arepas + fruta",
      almuerzo: "150 g pollo + 180 g arroz + lentejas + verduras",
      merienda: "Leche + avena + banano",
      cena: "3 huevos + 150 g arroz + verduras",
    },
  },
  {
    id: "viernes",
    short: "Vie",
    full: "Viernes",
    dayType: "pierna",
    meals: {
      desayuno: "3 huevos + 60 g avena + banano",
      almuerzo: "150 g pollo + 200 g papa + fríjoles + ensalada",
      merienda: "Leche + 30 g maní + fruta",
      cena: "Atún + 180 g arroz + verduras",
    },
  },
  {
    id: "sabado",
    short: "Sáb",
    full: "Sábado",
    dayType: "tironSabado",
    meals: {
      desayuno: "4 huevos + 2 arepas pequeñas + fruta",
      almuerzo: "150–180 g pollo + 180 g arroz + lentejas + verduras",
      merienda: "Avena + leche + banano",
      cena: "3 huevos + 200 g papa + verduras",
    },
  },
  {
    id: "domingo",
    short: "Dom",
    full: "Domingo",
    dayType: "descanso",
    meals: {
      desayuno: "3 huevos + avena + banano",
      almuerzo: "150–180 g pollo + arroz + fríjoles o lentejas + verduras",
      merienda: "Leche + fruta + maní",
      cena: "3 huevos + papa o arroz + verduras",
    },
  },
];

const MEAL_LABELS = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  merienda: "Merienda",
  cena: "Cena",
};

const MACROS = [
  { key: "kcal", label: "Calorías", target: 2150, range: "2.100–2.200 kcal", unit: "kcal" },
  { key: "protein", label: "Proteína", target: 157, range: "150–165 g", unit: "g" },
  { key: "carbs", label: "Carbohidratos", target: 220, range: "200–240 g", unit: "g" },
  { key: "fat", label: "Grasas", target: 62, range: "55–70 g", unit: "g" },
];

const SHOPPING_LIST = [
  "30 huevos",
  "1,5–2 kg de pollo",
  "2–3 latas de atún",
  "2 kg de arroz",
  "500 g de lentejas",
  "500 g de fríjoles",
  "500 g – 1 kg de avena",
  "2 kg de papa",
  "1–2 kg de banano",
  "2–3 L de leche",
  "250–500 g de maní",
  "Verduras económicas de temporada",
];

const SUBSTITUTIONS = [
  { item: "Pollo", subs: "Carne magra, atún, sardinas, o huevo + legumbres" },
  { item: "Arroz", subs: "Papa, pasta, plátano, yuca o arepa" },
  { item: "Maní", subs: "Aguacate, aceite o frutos secos" },
];

const PROFILE = {
  edad: "28 años",
  sexo: "Masculino",
  estatura: "169 cm",
  pesoInicial: "80 kg",
  actividad: "Ligera",
  experiencia: "Intermedio",
  lesiones: "Ninguna",
  entrenamiento: "Lunes a sábado, en el gimnasio",
  tiempo: "Más de 90 min por sesión",
  sueño: "6–8 h",
  presupuesto: "$100.000 COP / semana",
  objetivo: "Ganar músculo y verte más definido",
};

const TOTAL_DAYS = 90;
const STORAGE_KEY = "recomposicion-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible, se ignora */
  }
}

/* ---------- small building blocks ---------- */

function SectionLabel({ children }) {
  return (
    <p className="text-sm mb-2" style={{ color: C.textMuted }}>
      {children}
    </p>
  );
}

function DayPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5 px-4 pt-3 pb-1 overflow-x-auto">
      {DAYS.map((d, i) => {
        const active = i === value;
        return (
          <button
            key={d.id}
            onClick={() => onChange(i)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition"
            style={{
              backgroundColor: active ? C.surfaceAlt : "transparent",
              color: active ? C.text : C.textMuted,
              border: `1px solid ${active ? C.hairline : "transparent"}`,
            }}
          >
            {d.short}
          </button>
        );
      })}
    </div>
  );
}

function ProgressBar({ value, max, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.surfaceAlt }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ---------- screens ---------- */

function TodayScreen({ programDay, week, streak, weekdayIndex, completedMeals, completedExercises, macroValues, goToTab, onCompleteDay, dayComplete }) {
  const day = DAYS[weekdayIndex];
  const exercises = getExercisesFor(day.dayType, week);
  const title = DAY_TYPES[day.dayType].title;
  const isRest = exercises.length === 0;
  const mealsChecked = Object.keys(MEAL_LABELS).filter((k) => completedMeals[`${weekdayIndex}-${k}`]).length;
  const exChecked = exercises.filter((_, i) => completedExercises[`${weekdayIndex}-${i}`]).length;

  return (
    <div className="px-4 pb-6 pt-4 space-y-5">
      {/* header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm" style={{ color: C.textMuted }}>
            {day.full} · semana {week} · plan de 90 días
          </p>
          <p className="mt-1" style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-4xl font-bold">Día {programDay}</span>
            <span className="text-lg" style={{ color: C.textMuted }}>
              {" "}
              / {TOTAL_DAYS}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: C.surfaceAlt }}>
          <Flame size={16} color={C.fuel} />
          <span className="text-sm font-semibold" style={{ color: C.text }}>
            {streak}
          </span>
        </div>
      </div>

      <ProgressBar value={programDay} max={TOTAL_DAYS} color={C.move} />

      {/* training card */}
      <button
        onClick={() => goToTab("entreno")}
        className="w-full text-left rounded-xl p-4 transition active:scale-[0.98]"
        style={{ backgroundColor: C.surface, borderLeft: `3px solid ${isRest ? C.rest : C.move}` }}
      >
        <div className="flex items-center justify-between">
          <SectionLabel>Entrenamiento de hoy</SectionLabel>
          {!isRest && (
            <span className="text-xs" style={{ color: C.textMuted }}>
              {exChecked}/{exercises.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRest ? <Moon size={18} color={C.rest} /> : <Dumbbell size={18} color={C.move} />}
          <p className="font-semibold" style={{ color: C.text }}>
            {title}
          </p>
        </div>
      </button>

      {/* meals card */}
      <div className="rounded-xl p-4" style={{ backgroundColor: C.surface, borderLeft: `3px solid ${C.fuel}` }}>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Comidas de hoy</SectionLabel>
          <span className="text-xs" style={{ color: C.textMuted }}>
            {mealsChecked}/4
          </span>
        </div>
        <div className="space-y-2">
          {Object.entries(MEAL_LABELS).map(([key, label]) => {
            const checked = !!completedMeals[`${weekdayIndex}-${key}`];
            return (
              <div key={key} className="flex items-start gap-2">
                <div
                  className="w-4 h-4 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: checked ? C.fuel : "transparent",
                    border: `1.5px solid ${checked ? C.fuel : C.hairline}`,
                  }}
                >
                  {checked && <Check size={11} color={C.ink} strokeWidth={3} />}
                </div>
                <p className="text-sm" style={{ color: checked ? C.textMuted : C.text }}>
                  <span className="font-medium">{label}: </span>
                  {day.meals[key]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* macros */}
      <div className="rounded-xl p-4" style={{ backgroundColor: C.surface }}>
        <SectionLabel>Progreso nutricional estimado</SectionLabel>
        <div className="space-y-3 mt-1">
          {MACROS.map((m) => (
            <div key={m.key}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: C.text }}>{m.label}</span>
                <span style={{ color: C.textMuted }}>
                  {macroValues[m.key]} / {m.range}
                </span>
              </div>
              <ProgressBar value={macroValues[m.key]} max={m.target} color={C.fuel} />
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: C.textMuted }}>
          Estimado según las comidas marcadas, no calculado ingrediente por ingrediente.
        </p>
      </div>

      <button
        onClick={onCompleteDay}
        disabled={programDay >= TOTAL_DAYS}
        className="w-full py-3.5 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-50"
        style={{ backgroundColor: dayComplete ? C.move : C.surfaceAlt, color: dayComplete ? C.ink : C.text }}
      >
        {programDay >= TOTAL_DAYS ? "Plan completado 🎉" : "Completar día y avanzar"}
      </button>
    </div>
  );
}

function MealsScreen({ viewDay, setViewDay, isToday, completedMeals, toggleMeal, showList, setShowList }) {
  const day = DAYS[viewDay];
  return (
    <div className="pb-6">
      <DayPicker value={viewDay} onChange={setViewDay} />
      <div className="px-4 pt-3">
        <div className="flex rounded-lg p-1 mb-4" style={{ backgroundColor: C.surfaceAlt }}>
          {[
            { key: false, label: "Menú del día" },
            { key: true, label: "Mercado semanal" },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => setShowList(t.key)}
              className="flex-1 py-2 rounded-md text-sm font-medium transition"
              style={{
                backgroundColor: showList === t.key ? C.surface : "transparent",
                color: showList === t.key ? C.text : C.textMuted,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!showList ? (
          <div className="space-y-3">
            <p className="font-semibold" style={{ color: C.text }}>
              {day.full}
            </p>
            {Object.entries(MEAL_LABELS).map(([key, label]) => {
              const checked = !!completedMeals[`${viewDay}-${key}`];
              return (
                <div
                  key={key}
                  className="rounded-xl p-3.5 flex items-start gap-3"
                  style={{ backgroundColor: C.surface, borderLeft: `3px solid ${C.fuel}` }}
                >
                  <button
                    disabled={!isToday}
                    onClick={() => toggleMeal(viewDay, key)}
                    className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                    style={{
                      backgroundColor: checked ? C.fuel : "transparent",
                      border: `1.5px solid ${checked ? C.fuel : C.hairline}`,
                    }}
                  >
                    {checked && <Check size={12} color={C.ink} strokeWidth={3} />}
                  </button>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: C.textMuted }}>
                      {label}
                    </p>
                    <p className="text-sm" style={{ color: C.text }}>
                      {day.meals[key]}
                    </p>
                  </div>
                </div>
              );
            })}
            {!isToday && (
              <p className="text-xs text-center pt-1" style={{ color: C.textMuted }}>
                Solo puedes marcar las comidas del día actual.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ backgroundColor: C.surface }}>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart size={16} color={C.fuel} />
                <p className="font-semibold text-sm" style={{ color: C.text }}>
                  Compra semanal
                </p>
              </div>
              <ul className="space-y-1.5">
                {SHOPPING_LIST.map((item) => (
                  <li key={item} className="text-sm" style={{ color: C.text }}>
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: C.surface }}>
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight size={16} color={C.fuel} />
                <p className="font-semibold text-sm" style={{ color: C.text }}>
                  Sustituciones
                </p>
              </div>
              <div className="space-y-2.5">
                {SUBSTITUTIONS.map((s) => (
                  <p key={s.item} className="text-sm" style={{ color: C.text }}>
                    <span className="font-medium">{s.item}: </span>
                    <span style={{ color: C.textMuted }}>{s.subs}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrainingScreen({ viewDay, setViewDay, isToday, week, completedExercises, toggleExercise }) {
  const day = DAYS[viewDay];
  const exercises = getExercisesFor(day.dayType, week);
  const title = DAY_TYPES[day.dayType].title;
  const isRest = exercises.length === 0;
  const cycleWeek = ((week - 1) % ROTATION_WEEKS) + 1;

  return (
    <div className="pb-6">
      <DayPicker value={viewDay} onChange={setViewDay} />
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold" style={{ color: C.text }}>
            {day.full} · {title}
          </p>
          {!isRest && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: C.surfaceAlt, color: C.textMuted }}>
              semana {week} · rotación {cycleWeek}/{ROTATION_WEEKS}
            </span>
          )}
        </div>

        {isRest ? (
          <div className="rounded-xl p-6 text-center" style={{ backgroundColor: C.surface }}>
            <Moon size={28} color={C.rest} className="mx-auto mb-2" />
            <p className="font-medium" style={{ color: C.text }}>
              Día de descanso
            </p>
            <p className="text-sm mt-1" style={{ color: C.textMuted }}>
              Aprovecha para dormir bien y llegar fresco al lunes.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {exercises.map((ex, i) => {
              const checked = !!completedExercises[`${viewDay}-${i}`];
              return (
                <button
                  key={`${viewDay}-${i}-${ex.name}`}
                  disabled={!isToday}
                  onClick={() => toggleExercise(viewDay, i)}
                  className="w-full flex items-center gap-3 rounded-xl p-3.5 text-left transition active:scale-[0.98] disabled:opacity-60"
                  style={{ backgroundColor: C.surface, borderLeft: `3px solid ${C.move}` }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: checked ? C.move : "transparent",
                      border: `1.5px solid ${checked ? C.move : C.hairline}`,
                    }}
                  >
                    {checked && <Check size={12} color={C.ink} strokeWidth={3} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: checked ? C.textMuted : C.text }}>
                      {ex.name}
                    </p>
                    <p className="text-xs" style={{ color: C.textMuted }}>
                      {ex.sets} · descanso {ex.rest}
                    </p>
                  </div>
                </button>
              );
            })}
            <div className="flex items-center gap-2 rounded-xl p-3.5 mt-3" style={{ backgroundColor: C.surfaceAlt }}>
              <Footprints size={16} color={C.move} />
              <p className="text-xs" style={{ color: C.textMuted }}>
                Cardio extra: camina 30–40 min a paso rápido, en cinta o al aire libre, después de entrenar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressScreen({ weightLog, programDay, addWeight, onReset }) {
  const [newWeight, setNewWeight] = useState("");
  const latest = weightLog[weightLog.length - 1];
  const first = weightLog[0];
  const diff = (latest.weight - first.weight).toFixed(1);

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      <div className="rounded-xl p-4" style={{ backgroundColor: C.surface }}>
        <div className="flex justify-between items-baseline mb-3">
          <SectionLabel>Peso corporal</SectionLabel>
          <span className="text-xs" style={{ color: diff <= 0 ? C.move : C.fuel }}>
            {diff > 0 ? "+" : ""}
            {diff} kg desde el inicio
          </span>
        </div>
        <div style={{ width: "100%" }}>
          <WeightChart data={weightLog} color={C.move} gridColor={C.hairline} mutedColor={C.textMuted} />
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="number"
            step="0.1"
            placeholder={`Peso hoy (día ${programDay})`}
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: C.surfaceAlt, color: C.text, border: `1px solid ${C.hairline}` }}
          />
          <button
            onClick={() => {
              const val = parseFloat(newWeight);
              if (!isNaN(val) && val > 0) {
                addWeight(val);
                setNewWeight("");
              }
            }}
            className="px-4 rounded-lg text-sm font-semibold transition active:scale-95"
            style={{ backgroundColor: C.move, color: C.ink }}
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: C.surface }}>
        <SectionLabel>Tu perfil</SectionLabel>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-1">
          {Object.entries(PROFILE).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs capitalize" style={{ color: C.textMuted }}>
                {k}
              </p>
              <p className="text-sm" style={{ color: C.text }}>
                {v}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition active:scale-[0.98]"
        style={{ backgroundColor: C.surfaceAlt, color: C.textMuted }}
      >
        <RotateCcw size={14} />
        Reiniciar demo
      </button>
    </div>
  );
}

/* ---------- app shell ---------- */

const TABS = [
  { key: "hoy", label: "Hoy", icon: Home },
  { key: "comidas", label: "Comidas", icon: UtensilsCrossed },
  { key: "entreno", label: "Entreno", icon: Dumbbell },
  { key: "progreso", label: "Progreso", icon: TrendingUp },
];

function App() {
  const saved = useMemo(loadState, []);
  const [tab, setTab] = useState("hoy");
  const [programDay, setProgramDay] = useState(saved?.programDay ?? 1);
  const [streak, setStreak] = useState(saved?.streak ?? 0);
  const [completedMeals, setCompletedMeals] = useState(saved?.completedMeals ?? {});
  const [completedExercises, setCompletedExercises] = useState(saved?.completedExercises ?? {});
  const [showList, setShowList] = useState(false);
  const [weightLog, setWeightLog] = useState(saved?.weightLog ?? [{ day: 1, weight: 80 }]);

  const weekdayIndex = (programDay - 1) % 7;
  const week = getWeekNumber(programDay);
  const [viewDay, setViewDay] = useState(weekdayIndex);

  useEffect(() => {
    saveState({ programDay, streak, completedMeals, completedExercises, weightLog });
  }, [programDay, streak, completedMeals, completedExercises, weightLog]);

  const today = DAYS[weekdayIndex];
  const todayExercises = getExercisesFor(today.dayType, week);
  const mealsChecked = Object.keys(MEAL_LABELS).filter((k) => completedMeals[`${weekdayIndex}-${k}`]).length;
  const exTotal = todayExercises.length;
  const exChecked = todayExercises.filter((_, i) => completedExercises[`${weekdayIndex}-${i}`]).length;
  const dayComplete = mealsChecked === 4 && (exTotal === 0 || exChecked === exTotal);

  const macroValues = useMemo(() => {
    const frac = mealsChecked / 4;
    const round = (n) => Math.round(n * frac);
    return {
      kcal: round(MACROS[0].target),
      protein: round(MACROS[1].target),
      carbs: round(MACROS[2].target),
      fat: round(MACROS[3].target),
    };
  }, [mealsChecked]);

  function toggleMeal(dayIdx, key) {
    setCompletedMeals((prev) => ({ ...prev, [`${dayIdx}-${key}`]: !prev[`${dayIdx}-${key}`] }));
  }
  function toggleExercise(dayIdx, i) {
    setCompletedExercises((prev) => ({ ...prev, [`${dayIdx}-${i}`]: !prev[`${dayIdx}-${i}`] }));
  }
  function handleCompleteDay() {
    setStreak((s) => (dayComplete ? s + 1 : 0));
    const next = Math.min(programDay + 1, TOTAL_DAYS);
    setProgramDay(next);
    setCompletedMeals({});
    setCompletedExercises({});
    setViewDay((next - 1) % 7);
  }
  function addWeight(val) {
    setWeightLog((prev) => {
      const withoutToday = prev.filter((e) => e.day !== programDay);
      return [...withoutToday, { day: programDay, weight: val }].sort((a, b) => a.day - b.day);
    });
  }
  function handleReset() {
    setProgramDay(1);
    setStreak(0);
    setCompletedMeals({});
    setCompletedExercises({});
    setWeightLog([{ day: 1, weight: 80 }]);
    setViewDay(0);
    setTab("hoy");
  }

  return (
    <div
      className="w-full flex justify-center"
      style={{ backgroundColor: "#0A0B0D", minHeight: "100dvh" }}
    >
      <style>{`
        * { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; box-sizing: border-box; }
        html, body, #root { height: 100%; margin: 0; }
      `}</style>

      <div
        className="relative w-full overflow-hidden flex flex-col"
        style={{
          maxWidth: 480,
          height: "100dvh",
          backgroundColor: C.ink,
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {/* screen content */}
        <div className="overflow-y-auto flex-1">
          {tab === "hoy" && (
            <TodayScreen
              programDay={programDay}
              week={week}
              streak={streak}
              weekdayIndex={weekdayIndex}
              completedMeals={completedMeals}
              completedExercises={completedExercises}
              macroValues={macroValues}
              goToTab={setTab}
              onCompleteDay={handleCompleteDay}
              dayComplete={dayComplete}
            />
          )}
          {tab === "comidas" && (
            <MealsScreen
              viewDay={viewDay}
              setViewDay={setViewDay}
              isToday={viewDay === weekdayIndex}
              completedMeals={completedMeals}
              toggleMeal={toggleMeal}
              showList={showList}
              setShowList={setShowList}
            />
          )}
          {tab === "entreno" && (
            <TrainingScreen
              viewDay={viewDay}
              setViewDay={setViewDay}
              isToday={viewDay === weekdayIndex}
              week={week}
              completedExercises={completedExercises}
              toggleExercise={toggleExercise}
            />
          )}
          {tab === "progreso" && (
            <ProgressScreen weightLog={weightLog} programDay={programDay} addWeight={addWeight} onReset={handleReset} />
          )}
        </div>

        {/* tab bar */}
        <div
          className="flex justify-around items-center flex-shrink-0"
          style={{
            height: 66,
            paddingBottom: "env(safe-area-inset-bottom)",
            backgroundColor: C.surface,
            borderTop: `1px solid ${C.hairline}`,
          }}
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className="flex flex-col items-center gap-1 flex-1 py-1">
                <Icon size={20} color={active ? C.move : C.textMuted} strokeWidth={active ? 2.4 : 2} />
                <span className="font-medium" style={{ color: active ? C.text : C.textMuted, fontSize: 10 }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
