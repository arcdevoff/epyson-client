import UserProfileSettings from '@/components/screens/User/Profile/Settings';

export const metadata = {
  title: 'Настройки блога — ' + process.env.NEXT_PUBLIC_SITENAME,
  openGraph: {
    title: 'Настройки блога — ' + process.env.NEXT_PUBLIC_SITENAME,
  },
};

const UserProfileSettingsPage = () => {
  return <UserProfileSettings />;
};

export default UserProfileSettingsPage;
