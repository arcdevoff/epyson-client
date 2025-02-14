import TopicView from '@/components/screens/Topic/View';
import { TopicService } from '@/services/topic.service';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const data = await TopicService.getBySlug(params.slug);

  return {
    title: `${data.name} (@${data.slug}) — ${process.env.NEXT_PUBLIC_SITENAME}`,
    description: data.description,
    openGraph: {
      title: `${data.name} (@${data.slug}) — ${process.env.NEXT_PUBLIC_SITENAME}`,
      description: data.description,
    },
  };
}

const TopicViewPage = async ({ params }) => {
  try {
    const data = await TopicService.getBySlug(params.slug);
    return <TopicView data={data} />;
  } catch (error) {
    notFound();
  }
};

export default TopicViewPage;
