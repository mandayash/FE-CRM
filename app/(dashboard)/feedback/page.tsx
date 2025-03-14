import StatisticsCards from "@/components/feedback/stats/StatisticsCards";
import FilterSearch from '@/components/feedback/FilterSearch';
import FeedbackTable from "@/components/feedback/FeedbackTable";

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <StatisticsCards />
      <FilterSearch />
      <FeedbackTable />
    </div>
  );
}