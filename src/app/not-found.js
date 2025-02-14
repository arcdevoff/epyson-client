import Image from 'next/image';

const notFound = () => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '2rem' }}>
      <Image src="/images/emojis/camping.webp" width={110} height={110} alt="404" />
      <span style={{ fontSize: 20, marginTop: 6 }}>Страница не найдена</span>
    </div>
  );
};

export default notFound;
