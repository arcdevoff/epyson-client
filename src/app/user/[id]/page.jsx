import UserProfile from '@/components/screens/User/Profile';
import { UserService } from '@/services/user.service';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { data } = await UserService.getById(params.id);

  return {
    title: `${data.name} (@id${data.id}) — Блог на ${process.env.NEXT_PUBLIC_SITENAME}`,
    description: data.description,
    openGraph: {
      title: `${data.name} (@id${data.id}) — Блог на ${process.env.NEXT_PUBLIC_SITENAME}`,
      description: data.description,
    },
  };
}

const UserProfilePage = async ({ params }) => {
  try {
    const { data } = await UserService.getById(params.id);
    return <UserProfile data={data} />;
  } catch (error) {
    notFound();
  }
};

export default UserProfilePage;
