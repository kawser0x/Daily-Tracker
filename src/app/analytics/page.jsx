import AnalyticsSection from "@/components/AnalyticsSection";

export const metadata = {
  title: "Analytics - DailyTrack",
  description: "Track your productivity trends and task performance statistics on DailyTrack.",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen py-6 bg-gray-50 dark:bg-gray-950">
      <AnalyticsSection />
    </div>
  );
}
