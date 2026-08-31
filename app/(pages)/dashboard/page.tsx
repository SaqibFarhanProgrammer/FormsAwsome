import ProfileDataSetComponent from "@/components/common/ProfileDataSetComponent";
import { GetProfileService } from "@/core/services/Profile/Profile.service";
import { FormsGrid } from "@/features/dashboard/components/FormsGrid";
import { StatsCards } from "@/features/dashboard/components/StateCard";
import { SubmissionsTable } from "@/features/dashboard/components/SubmissionsTable";

export default async function DashboardPage() {
  const data = await GetProfileService();

  return (
    <>
      <ProfileDataSetComponent data={data} />
      <StatsCards />
      <FormsGrid />
      <SubmissionsTable />
    </>
  );
}
