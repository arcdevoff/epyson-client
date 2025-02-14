import TagView from '@/components/screens/Tag/View';

export async function generateMetadata({ params }) {
  const tag = decodeURI(params.tag);

  return {
    title: `#${tag} — ${process.env.NEXT_PUBLIC_SITENAME}`,
    openGraph: {
      title: `#${tag} — ${process.env.NEXT_PUBLIC_SITENAME}`,
    },
  };
}

const TagViewPage = ({ params }) => {
  return <TagView tag={params.tag} />;
};

export default TagViewPage;
