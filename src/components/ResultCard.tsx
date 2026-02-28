import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import RiskGauge from "./RiskGauge";
import { PredictionResult } from "@/services/api";
import { Progress } from "@/components/ui/progress";

interface ResultCardProps {
  result: PredictionResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const isFraud = result.prediction === "Fraud" || result.fraud_probability > 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-2xl border-2 bg-card p-8 shadow-elevated ${
        isFraud ? "border-destructive/40" : "border-success/40"
      }`}
      style={{
        borderImage: isFraud
          ? "var(--gradient-fraud) 1"
          : "var(--gradient-genuine) 1",
      }}
    >
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Icon + Status */}
        <div className="flex flex-col items-center gap-3 text-center md:min-w-[200px]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isFraud ? "bg-destructive/10" : "bg-success/10"
            }`}
          >
            {isFraud ? (
              <AlertTriangle className="h-8 w-8" style={{ color: "hsl(var(--destructive))" }} />
            ) : (
              <CheckCircle className="h-8 w-8" style={{ color: "hsl(var(--success))" }} />
            )}
          </motion.div>
          <h3 className="text-lg font-bold">
            {isFraud ? "⚠️ Fraudulent Claim Detected" : "✅ Genuine Claim"}
          </h3>
          <RiskGauge value={Math.round(result.risk_score * 100)} isFraud={isFraud} />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-5 w-full">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fraud Probability</span>
              <span className="font-semibold">{(result.fraud_probability * 100).toFixed(1)}%</span>
            </div>
            <Progress
              value={result.fraud_probability * 100}
              className="h-3"
              style={{
                ["--progress-color" as string]: isFraud
                  ? "hsl(var(--destructive))"
                  : "hsl(var(--success))",
              }}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk Score</span>
              <span className="font-semibold">{(result.risk_score * 100).toFixed(1)}%</span>
            </div>
            <Progress
              value={result.risk_score * 100}
              className="h-3"
              style={{
                ["--progress-color" as string]: isFraud
                  ? "hsl(var(--destructive))"
                  : "hsl(var(--success))",
              }}
            />
          </div>

          {result.explanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="rounded-lg bg-muted p-4 text-sm text-muted-foreground"
            >
              <span className="font-medium text-foreground">Analysis: </span>
              {result.explanation}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
