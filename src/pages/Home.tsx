import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Activity, BarChart3, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

const features = [
  { icon: Activity, title: "Real-time Risk Scoring", desc: "Instant fraud probability assessment using trained ML models." },
  { icon: BarChart3, title: "Fraud Probability Analysis", desc: "Detailed breakdown of risk factors and contributing features." },
  { icon: Shield, title: "Historical Claim Tracking", desc: "Full audit trail of analyzed claims with status history." },
  { icon: Brain, title: "ML Explainability", desc: "Transparent AI explanations for every prediction made." },
];

const Home = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden gradient-hero min-h-[85vh] flex items-center">
      <div className="absolute inset-0 opacity-20">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-foreground/80">
            <Shield className="h-4 w-4" /> AI-Powered Protection
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            AI-Powered Insurance{" "}
            <span className="text-gradient">Fraud Detection</span>
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/70 max-w-xl">
            Real-time fraud analysis using machine learning. Protect your business with intelligent claim scoring and transparent risk assessment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="gradient-primary text-primary-foreground rounded-xl px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow">
              <Link to="/predict">
                Analyze Claim <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8 py-6 text-base font-semibold border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold">Powerful Features</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          Everything you need to detect, analyze, and prevent insurance fraud at scale.
        </p>
      </motion.div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
        Built with MERN + FastAPI ML · ClaimWatch © 2026
      </div>
    </footer>
  </div>
);

export default Home;
