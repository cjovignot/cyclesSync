import type { CycleCircleProps } from "../../types";

export function CycleCircle({
  averageCycleLength,
  currentCycleDay,
  periodDays,
  predictedPeriodDays,
  ovulationDay,
  fertileWindow,
}: CycleCircleProps) {
  const size = 250; // taille du cercle
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const degreePerDay = 360 / averageCycleLength;

  // Générer les arcs pour les périodes
  const getArc = (day: number, color: string) => {
    const startAngle = (day - 1) * degreePerDay - 90;
    const endAngle = day * degreePerDay - 90;
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return (
      <path
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number
  ) {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  return (
    <div className="flex justify-center">
      <svg width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Période passée */}
        {periodDays.map((day) => getArc(day, "#f87171"))}

        {/* Période prédite */}
        {predictedPeriodDays.map((day) => getArc(day, "#fca5a5"))}

        {/* Fenêtre fertile */}
        {Array.from(
          { length: fertileWindow.end - fertileWindow.start + 1 },
          (_, i) => getArc(fertileWindow.start + i, "#34d399")
        )}

        {/* Ovulation */}
        {getArc(ovulationDay, "#3b82f6")}

        {/* Jour actuel */}
        {getArc(currentCycleDay, "#facc15")}
      </svg>
    </div>
  );
}
