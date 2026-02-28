import { motion } from "framer-motion";

interface RiskGaugeProps {
  value: number; // 0-100
  isFraud: boolean;
}

const RiskGauge = ({ value, isFraud }: RiskGaugeProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const angle = (clampedValue / 100) * 180;

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-48 h-28">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={isFraud ? "hsl(var(--destructive))" : "hsl(var(--success))"}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="251.2"
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (clampedValue / 100) * 251.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transformOrigin: "100px 100px" }}
          initial={{ rotate: -90 }}
          animate={{ rotate: angle - 90 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <circle cx="100" cy="100" r="5" fill="hsl(var(--foreground))" />
      </svg>
      <motion.span
        className="mt-1 text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ color: isFraud ? "hsl(var(--destructive))" : "hsl(var(--success))" }}
      >
        {clampedValue}%
      </motion.span>
      <span className="text-xs text-muted-foreground">Risk Score</span>
    </div>
  );
};

export default RiskGauge;
