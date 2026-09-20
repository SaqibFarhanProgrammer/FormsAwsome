import {
  LazyProfileHeader,
  LazyProfileStats,
  LazyQuickActions,
  LazyRecentActivity,
} from "@/components/lazy/LazyComponents";
import { GetProfileService } from "@/core/services/profile/profile.service";

export default async function ProfilePage() {
  const data = await GetProfileService();

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <LazyProfileHeader data={data} />

      <LazyProfileStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LazyRecentActivity />
        </div>
        <div className="space-y-6">
          <LazyQuickActions />
        </div>
      </div>
    </div>
  );
}
