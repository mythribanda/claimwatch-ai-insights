import { useState, useMemo } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { HistoricalClaim } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

interface DashboardTableProps {
  claims: HistoricalClaim[];
}

const DashboardTable = ({ claims }: DashboardTableProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Fraud" | "Genuine">("all");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = claims;
    if (filter !== "all") result = result.filter((c) => c.status === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.date.toLowerCase().includes(q) ||
          c.claim_amount.toString().includes(q)
      );
    }
    return [...result].sort((a, b) =>
      sortAsc ? a.risk_score - b.risk_score : b.risk_score - a.risk_score
    );
  }, [claims, search, filter, sortAsc]);

  const filterButtons: Array<{ label: string; value: "all" | "Fraud" | "Genuine" }> = [
    { label: "All", value: "all" },
    { label: "Fraud", value: "Fraud" },
    { label: "Genuine", value: "Genuine" },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search claims..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {filterButtons.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f.value
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Claim Amount</TableHead>
              <TableHead>Fraud Prob.</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-foreground"
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  Risk Score <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No claims found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((claim, i) => (
                <motion.tr
                  key={claim.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="text-sm">{claim.date}</TableCell>
                  <TableCell className="font-medium">${claim.claim_amount.toLocaleString()}</TableCell>
                  <TableCell>{(claim.fraud_probability * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          claim.risk_score > 0.7
                            ? "hsl(var(--destructive))"
                            : claim.risk_score > 0.4
                            ? "hsl(var(--warning))"
                            : "hsl(var(--success))",
                      }}
                    >
                      {(claim.risk_score * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={claim.status === "Fraud" ? "destructive" : "default"}
                      className={
                        claim.status === "Genuine"
                          ? "bg-success/10 text-success hover:bg-success/20 border-0"
                          : ""
                      }
                    >
                      {claim.status}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardTable;
