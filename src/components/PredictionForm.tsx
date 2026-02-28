import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ClaimData, predictClaim, PredictionResult } from "@/services/api";
import ResultCard from "./ResultCard";
import { useToast } from "@/hooks/use-toast";

const initialForm: ClaimData = {
  months_as_customer: 12,
  policy_state: "OH",
  policy_deductable: 500,
  policy_annual_premium: 1200,
  umbrella_limit: 0,
  insured_age: 35,
  insured_sex: "MALE",
  insured_education_level: "MD",
  insured_occupation: "exec-managerial",
  insured_relationship: "husband",
  incident_type: "Single Vehicle Collision",
  incident_severity: "Minor Damage",
  collision_type: "Side Collision",
  incident_hour_of_the_day: 12,
  number_of_vehicles_involved: 1,
  property_damage: "NO",
  police_report_available: "NO",
  total_claim_amount: 5000,
  injury_claim: 1000,
  property_claim: 2000,
  vehicle_claim: 2000,
};

const FieldTip = ({ tip }: { tip: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-xs text-xs">{tip}</TooltipContent>
  </Tooltip>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border bg-card p-6 shadow-card space-y-4"
  >
    <h3 className="text-base font-semibold text-foreground">{title}</h3>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </motion.div>
);

const PredictionForm = () => {
  const [form, setForm] = useState<ClaimData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const set = (key: keyof ClaimData, value: string | number) =>
    setForm((p) => ({ ...p, [key]: value }));

  const numField = (
    key: keyof ClaimData,
    label: string,
    tip: string
  ) => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm">{label}</Label>
        <FieldTip tip={tip} />
      </div>
      <Input
        type="number"
        value={form[key] as number}
        onChange={(e) => set(key, Number(e.target.value))}
      />
    </div>
  );

  const selectField = (
    key: keyof ClaimData,
    label: string,
    options: string[],
    tip: string
  ) => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm">{label}</Label>
        <FieldTip tip={tip} />
      </div>
      <Select value={form[key] as string} onValueChange={(v) => set(key, v)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const toggleField = (key: keyof ClaimData, label: string, tip: string) => (
    <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm">{label}</Label>
        <FieldTip tip={tip} />
      </div>
      <Switch
        checked={form[key] === "YES"}
        onCheckedChange={(v) => set(key, v ? "YES" : "NO")}
      />
    </div>
  );

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await predictClaim(form);
      setResult(res);
      toast({
        title: "Analysis Complete",
        description: res.prediction === "Fraud" ? "High risk claim detected!" : "Claim appears genuine.",
      });
    } catch {
      // Fallback to demo result when backend is unavailable
      const isFraud = form.total_claim_amount > 20000 || form.incident_severity === "Total Loss";
      const demoResult: PredictionResult = {
        prediction: isFraud ? "Fraud" : "Genuine",
        fraud_probability: isFraud ? 0.82 : 0.15,
        risk_score: isFraud ? 0.87 : 0.12,
        explanation: isFraud
          ? "High claim amount combined with incident severity and policy age suggest elevated fraud risk. Key factors: total claim amount, incident severity, months as customer."
          : "Claim parameters fall within normal ranges. Low-risk profile based on policy history and incident details.",
      };
      setResult(demoResult);
      toast({
        title: "Demo Mode",
        description: "Backend unavailable — showing sample prediction result.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Policy Details">
          {numField("months_as_customer", "Months as Customer", "Duration of customer relationship")}
          {selectField("policy_state", "Policy State", ["OH", "IL", "IN"], "State where policy was issued")}
          {numField("policy_deductable", "Policy Deductible", "Amount paid before insurance kicks in")}
          {numField("policy_annual_premium", "Annual Premium", "Yearly premium amount")}
          {numField("umbrella_limit", "Umbrella Limit", "Extra liability coverage limit")}
        </Section>

        <Section title="Insured Details">
          {numField("insured_age", "Age", "Age of the insured person")}
          {selectField("insured_sex", "Gender", ["MALE", "FEMALE"], "Gender of insured")}
          {selectField("insured_education_level", "Education", ["MD", "PhD", "Associate", "Masters", "High School", "College", "JD"], "Highest education level")}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm">Occupation</Label>
              <FieldTip tip="Current occupation of insured" />
            </div>
            <Input value={form.insured_occupation} onChange={(e) => set("insured_occupation", e.target.value)} />
          </div>
          {selectField("insured_relationship", "Relationship", ["husband", "wife", "own-child", "unmarried", "not-in-family", "other-relative"], "Relationship to policyholder")}
        </Section>

        <Section title="Incident Details">
          {selectField("incident_type", "Incident Type", ["Single Vehicle Collision", "Vehicle Theft", "Multi-vehicle Collision", "Parked Car"], "Type of incident")}
          {selectField("incident_severity", "Severity", ["Minor Damage", "Major Damage", "Total Loss", "Trivial Damage"], "Severity of the incident")}
          {selectField("collision_type", "Collision Type", ["Side Collision", "Rear Collision", "Front Collision", "?"], "Direction of collision")}
          {numField("incident_hour_of_the_day", "Incident Hour (0–23)", "Hour when incident occurred")}
          {numField("number_of_vehicles_involved", "Vehicles Involved", "Number of vehicles in incident")}
          {toggleField("property_damage", "Property Damage", "Was property damaged?")}
          {toggleField("police_report_available", "Police Report Available", "Was a police report filed?")}
        </Section>

        <Section title="Claim Details">
          {numField("total_claim_amount", "Total Claim Amount", "Total claimed amount in USD")}
          {numField("injury_claim", "Injury Claim", "Portion for injuries")}
          {numField("property_claim", "Property Claim", "Portion for property damage")}
          {numField("vehicle_claim", "Vehicle Claim", "Portion for vehicle damage")}
        </Section>
      </div>

      <motion.div className="flex justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={loading}
          className="gradient-primary text-primary-foreground px-10 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" /> Analyze Claim
            </>
          )}
        </Button>
      </motion.div>

      {result && <ResultCard result={result} />}
    </div>
  );
};

export default PredictionForm;
