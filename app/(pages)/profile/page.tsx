import { GetProfileService } from "@/core/services/Profile/Profile.service";
import { ProfileHeader } from "@/features/Profile/components/ProfileHeader";
import { ProfileStats } from "@/features/Profile/components/ProfileStats";
import { QuickActions } from "@/features/Profile/components/QuickActions";
import { RecentActivity } from "@/features/Profile/components/RecentActivity";

export default async function ProfilePage() {
  const data = await GetProfileService();

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <ProfileHeader data={data} />

      <ProfileStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
