import { AppShell } from '@/components/aisle/app-shell'
import { ProfileScreen } from '@/components/aisle/profile-screen'

export default function ProfilePage() {
  return (
    <AppShell title="My Profile">
      <ProfileScreen />
    </AppShell>
  )
}
