import { ConnectedAccounts } from "@/features/Profile/components/ConnectedAccounts";
import { CurrentPlan } from "@/features/Profile/components/CurrentPlan";
import { PersonalInfo } from "@/features/Profile/components/PersonalInfo";
import { ProfileHeader } from "@/features/Profile/components/ProfileHeader";
import { ProfileStats } from "@/features/Profile/components/ProfileStats";
import { QuickActions } from "@/features/Profile/components/QuickActions";
import { RecentActivity } from "@/features/Profile/components/RecentActivity";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <ProfileHeader />
      <ProfileStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfo />
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <CurrentPlan />
          <QuickActions />
          <ConnectedAccounts />
        </div>
      </div>
    </div>
  );
}
