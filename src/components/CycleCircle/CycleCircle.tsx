import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface CycleCircleProps {
  averageCycleLength: number;
  currentCycleDay: number;
  periodDays: number[];
  SPMDays: number[];
  onSelectedDayChange?: (day: number) => void; // ✅ fonction optionnelle
}

export function CycleCircle(props: CycleCircleProps) {
  const {
    averageCycleLength,
    currentCycleDay,
    periodDays,
    SPMDays,
    onSelectedDayChange,
  } = props;

  const radius = 150;
  const dotSize = 13;
  const padding = dotSize + 8; // espace supplémentaire pour contour vert
  const center = radius + padding;

  const [selectedDay, setSelectedDay] = useState(currentCycleDay);

  // Met à jour le parent quand selectedDay change
  useEffect(() => {
    onSelectedDayChange?.(selectedDay);
  }, [selectedDay, onSelectedDayChange]);

  const getColorAndPhase = (dayNumber: number) => {
    const periodStart = 1;
    const periodEnd = periodDays.length;
    const fertileStart = periodStart + 9;
    const fertileEnd = fertileStart + 7;
    const ovulationDay = periodStart + 14;

    if (dayNumber >= periodStart && dayNumber <= periodEnd)
      return { color: "#ef4444", phase: "Règles" };

    if (dayNumber === ovulationDay)
      return { color: "#3b82f6", phase: "Ovulation" };

    if (dayNumber >= fertileStart && dayNumber <= fertileEnd)
      return { color: "#22c55e", phase: "Fertile" };

    if (SPMDays?.includes(dayNumber)) return { color: "#facc15", phase: "SPM" };

    return { color: "#9ca3af", phase: "" };
  };

  const selectedInfo = getColorAndPhase(selectedDay);

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <svg width={radius * 2 + padding * 2} height={radius * 2 + padding * 2}>
        <defs>
          {Array.from({ length: averageCycleLength }).map((_, i) => {
            const dayNumber = i + 1;
            const { color } = getColorAndPhase(dayNumber);
            return (
              <radialGradient
                id={`grad-${dayNumber}`}
                key={`grad-${dayNumber}`}
                cx="50%"
                cy="50%"
                r="50%"
                fx="30%"
                fy="30%"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.6" />
              </radialGradient>
            );
          })}
        </defs>

        {Array.from({ length: averageCycleLength }).map((_, i) => {
          const angle = (i / averageCycleLength) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const dayNumber = i + 1;
          const isSelected = dayNumber === selectedDay;
          const r = dotSize - 4;

          return (
            <g key={dayNumber}>
              {/* Contour vert si sélectionné */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r={dotSize + 3}
                  fill="none"
                  stroke="#84cf9fff"
                  strokeWidth={3}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r={isSelected ? dotSize : r}
                fill={`url(#grad-${dayNumber})`}
                whileHover={{ scale: 1.3 }}
                onClick={() => handleSelectDay(dayNumber)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}

        {/* Texte centré */}
        {/* <motion.text
          key={`day-${selectedDay}`}
          x={center}
          y={center - 8}
          textAnchor="middle"
          fontSize="18"
          fontWeight="600"
          fill="#111827"
          variants={textVariants}
        >
          Jour {selectedDay}
        </motion.text> */}

        <motion.text
          key={`phase-${selectedDay}`}
          x={center}
          y={center + 10}
          textAnchor="middle"
          fontSize="24"
          fontWeight="500"
          fill={
            selectedInfo.color === "#ef4444"
              ? "#ef4444"
              : selectedInfo.color === "#22c55e"
              ? "#22c55e"
              : selectedInfo.color === "#3b82f6"
              ? "#3b82f6"
              : selectedInfo.color === "#facc15"
              ? "#facc15"
              : "#9ca3af"
          }
          initial="initial"
          animate="animate"
          exit="exit"
          variants={textVariants}
          transition={{ duration: 0.3 }}
        >
          {selectedInfo.phase}
        </motion.text>

        {/* Bouton "Aujourd'hui" */}
        {selectedDay !== currentCycleDay && (
          <foreignObject
            x={center - 60}
            y={center + 14}
            width={120}
            height={30}
          >
            <button
              onClick={() => handleSelectDay(currentCycleDay)}
              className="flex items-center justify-center w-full h-full text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Aujourd'hui
            </button>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}
