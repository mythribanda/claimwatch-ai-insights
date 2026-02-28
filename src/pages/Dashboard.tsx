import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend } from "recharts";
import { getClaims, HistoricalClaim } from "@/services/api";
import StatsCards from "@/components/StatsCards";
import DashboardTable from "@/components/DashboardTable";
import { useToast } from "@/hooks/use-toast";

const FRAUD_COLOR = "hsl(0, 84%, 60%)";
const GENUINE_COLOR = "hsl(152, 69%, 40%)";

// Mock data for demo when backend unavailable
const mockClaims: HistoricalClaim[] = Array.from({ length: 20 }, (_, i) => {
  const isFraud = Math.random() > 0.65;
  return {
    id: `CLM-${1000 + i}`,
    date: new Date(2026, 0, Math.floor(Math.random() * 58) + 1).toISOString().split("T")[0],
    claim_amount: Math.floor(Math.random() * 50000) + 1000,
    fraud_probability: isFraud ? 0.6 + Math.random() * 0.39 : Math.random() * 0.4,
    risk_score: isFraud ? 0.55 + Math.random() * 0.44 : Math.random() * 0.45,
    status: isFraud ? "Fraud" : "Genuine",
  };
});

const Dashboard = () => {
  const [claims, setClaims] = useState<HistoricalClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getClaims()
      .then(setClaims)
      .catch(() => {
        setClaims(mockClaims);
        toast({ title: "Using demo data", description: "Backend unavailable — showing sample claims.", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  const fraudCount = claims.filter((c) => c.status === "Fraud").length;
  const genuineCount = claims.length - fraudCount;

  const pieData = [
    { name: "Fraud", value: fraudCount },
    { name: "Genuine", value: genuineCount },
  ];

  const riskBuckets = [
    { range: "0-20%", count: claims.filter((c) => c.risk_score <= 0.2).length },
    { range: "20-40%", count: claims.filter((c) => c.risk_score > 0.2 && c.risk_score <= 0.4).length },
    { range: "40-60%", count: claims.filter((c) => c.risk_score > 0.4 && c.risk_score <= 0.6).length },
    { range: "60-80%", count: claims.filter((c) => c.risk_score > 0.6 && c.risk_score <= 0.8).length },
    { range: "80-100%", count: claims.filter((c) => c.risk_score > 0.8).length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Overview of all analyzed insurance claims.</p>
      </motion.div>

      <StatsCards claims={claims} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <h3 className="mb-4 text-base font-semibold">Fraud vs Genuine</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                <Cell fill={FRAUD_COLOR} />
                <Cell fill={GENUINE_COLOR} />
              </Pie>
              <Legend />
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border bg-card p-6 shadow-card"
        >
          <h3 className="mb-4 text-base font-semibold">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={riskBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ReTooltip />
              <Bar dataKey="count" fill="hsl(234, 89%, 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <DashboardTable claims={claims} />
    </div>
  );
};

export default Dashboard;
