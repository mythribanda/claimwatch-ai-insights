import { motion } from "framer-motion";
import { FileText, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { HistoricalClaim } from "@/services/api";

interface StatsCardsProps {
  claims: HistoricalClaim[];
}

const StatsCards = ({ claims }: StatsCardsProps) => {
  const total = claims.length;
  const fraudulent = claims.filter((c) => c.status === "Fraud").length;
  const genuine = total - fraudulent;
  const avgRisk = total > 0 ? claims.reduce((s, c) => s + c.risk_score, 0) / total : 0;

  const stats = [
    { label: "Total Claims", value: total, icon: FileText, color: "text-primary bg-accent" },
    { label: "Fraudulent", value: fraudulent, icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
    { label: "Genuine", value: genuine, icon: CheckCircle, color: "text-success bg-success/10" },
    { label: "Avg Risk", value: `${(avgRisk * 100).toFixed(1)}%`, icon: Activity, color: "text-warning bg-warning/10" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
