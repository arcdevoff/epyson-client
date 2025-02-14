import ContentLoader from 'react-content-loader';

const CommentLoader = () => {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <ContentLoader
        speed={2}
        width={'100%'}
        height={'88'}
        uniqueKey={Math.random(1, 1000000000000)}
        backgroundColor="#b7b7b730"
        foregroundColor="#6d6d6d30">
        <rect x="0" y="0" rx="100" ry="100" width="44" height="44" />
        <rect x="53" y="8" rx="4" ry="4" width="75" height="13" />
        <rect x="53" y="26" rx="4" ry="4" width="105" height="13" />
        <rect x="2" y="53" rx="4" ry="4" width="100%" height="11" />
        <rect x="2" y="72" rx="4" ry="4" width="60%" height="11" />
      </ContentLoader>
    </div>
  );
};

export default CommentLoader;
