import AutomationDashboard from "../../components/workflow/AutomationDashboard";
import QuickActionsPanel from "../../components/workflow/QuickActionsPanel";
import SmartFiltersPanel from "../../components/workflow/SmartFiltersPanel";
import Card from "../../components/ui/Card";
import { FiZap, FiTrendingUp } from "react-icons/fi";

/**
 * Workflow Automation Page
 * Centralized hub for all automation and workflow features
 */
export default function WorkflowAutomation() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-500/30">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3 mb-2">
              <FiZap size={32} className="text-blue-600" />
              Workflow Automation
            </h1>
            <p className="text-[var(--text-secondary)] max-w-2xl">
              Streamline your fleet operations with intelligent automation.
              Reduce manual work, minimize errors, and focus on what matters
              most.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-green-600">
              <FiTrendingUp size={20} />
              <span className="font-semibold">87% efficiency increase</span>
            </div>
            <span className="text-sm text-[var(--text-tertiary)]">
              Based on last 30 days
            </span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <QuickActionsPanel />

      {/* Smart Filters */}
      <SmartFiltersPanel
        onApplyFilter={(filters) => console.log("Applied:", filters)}
      />

      {/* Automation Rules Dashboard */}
      <AutomationDashboard />

      {/* Tips & Best Practices */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
          💡 Automation Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
              Maximize Efficiency
            </h4>
            <ul className="space-y-1 text-[var(--text-secondary)]">
              <li>• Enable auto-assignment during peak hours</li>
              <li>• Use smart filters to quickly access common views</li>
              <li>• Save templates for recurring tasks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
              Best Practices
            </h4>
            <ul className="space-y-1 text-[var(--text-secondary)]">
              <li>• Review automation rules weekly</li>
              <li>• Monitor triggered automation stats</li>
              <li>• Adjust rules based on performance data</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
