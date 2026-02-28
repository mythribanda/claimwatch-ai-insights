import { motion } from "framer-motion";
import PredictionForm from "@/components/PredictionForm";

const Predict = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
      <h1 className="text-3xl font-bold">Analyze Claim</h1>
      <p className="mt-2 text-muted-foreground">
        Enter the claim details below and our ML model will assess the fraud risk in real-time.
      </p>
    </motion.div>
    <PredictionForm />
  </div>
);

export default Predict;
