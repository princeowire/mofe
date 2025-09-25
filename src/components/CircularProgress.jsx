export default function CircularProgress({ value, size = 120, strokeWidth = 8, color = 'blue' }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = value / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const colorClass = {
    blue: 'text-blue-500 stroke-blue-500',
    green: 'text-green-500 stroke-green-500',
    red: 'text-red-500 stroke-red-500',
    yellow: 'text-yellow-500 stroke-yellow-500'
  }[color];

  return (
    <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" className="transform -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={colorClass}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute text-2xl font-bold">{value}%</div>
    </div>
  );
}
