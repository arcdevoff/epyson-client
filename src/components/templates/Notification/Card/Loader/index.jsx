import ContentLoader from 'react-content-loader';

const NotificationLoader = () => {
  return (
    <div style={{ marginTop: 14 }}>
      <ContentLoader
        speed={2}
        width={'100%'}
        height={'35'}
        uniqueKey={Math.random(1, 1000000000000)}
        backgroundColor="#b7b7b730"
        foregroundColor="#6d6d6d30">
        <rect x="0" y="0" rx="100" ry="100" width="35" height="35" />
        <rect x="50" y="4" rx="4" ry="4" width="100%" height="13" />
        <rect x="50" y="21" rx="4" ry="4" width="92" height="12" />
      </ContentLoader>
    </div>
  );
};

export default NotificationLoader;
