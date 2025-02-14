import PostView from '@/components/screens/Post/View';
import { PostService } from '@/services/post.service';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const data = await PostService.getById({ id: params.id });
  let metadata = {
    title: '',
    description: '',
    openGraph: {
      title: '',
      description: '',
      images: [],
    },
  };

  let cleanText = data.text.replace(/<[^>]*>/g, '');
  cleanText = cleanText.trim();

  metadata.title = data.title + ' — ' + process.env.NEXT_PUBLIC_SITENAME;
  metadata.description = cleanText.substr(0, 350);
  metadata.openGraph.title = data.title + ' — ' + process.env.NEXT_PUBLIC_SITENAME;
  metadata.openGraph.description = cleanText.substr(0, 350);

  if (data.attachments.length > 0) {
    let imageElement = data.attachments.find((item) => item.type === 'image');
    if (imageElement) {
      metadata.openGraph['images'] = [
        {
          url: imageElement.url,
        },
      ];
    }
  }

  return metadata;
}

const PostViewPage = async ({ params }) => {
  try {
    const ip = headers().get('x-forwarded-for');
    const data = await PostService.getById({ id: params.id, ip });
    const repliesComments = await PostService.getRepliesComments(params.id);
    return <PostView data={data} repliesComments={repliesComments} />;
  } catch (error) {
    notFound();
  }
};

export default PostViewPage;
