import TaskSection from "@/components/TaskSection";

export const metadata = {
  title: "Tasks - DailyTrack",
  description: "View and manage your daily tasks on DailyTrack.",
};

export default function TasksPage() {
  return (
    <div className="min-h-screen py-6 bg-gray-50 dark:bg-gray-950">
      <TaskSection />
    </div>
  );
}
