import ContentLoader from 'react-content-loader';
import styles from '../PostCard.module.scss';

const PostLoader = () => {
  return (
    <div className={styles.root}>
      <ContentLoader
        speed={2}
        width={'100%'}
        height={'270'}
        uniqueKey={Math.random(1, 1000000000000)}
        backgroundColor="#b7b7b730"
        foregroundColor="#6d6d6d30">
        <rect x="0" y="0" rx="100" ry="100" width="35" height="35" />
        <rect x="43" y="3" rx="3" ry="3" width="68" height="12" />
        <rect x="43" y="21" rx="3" ry="3" width="43" height="11" />
        <rect x="93" y="21" rx="3" ry="3" width="60" height="11" />

        <rect x="0" y="56" rx="3" ry="3" width={'100%'} height="10" />
        <rect x="0" y="76" rx="3" ry="3" width={'70%'} height="10" />
        <rect x="0" y="96" rx="3" ry="3" width={'80%'} height="10" />
        <rect x="0" y="116" rx="3" ry="3" width={'40%'} height="10" />
        <rect x="0" y="139" rx="3" ry="3" width={'87%'} height="10" />
        <rect x="0" y="162" rx="3" ry="3" width={'32%'} height="10" />
        <rect x="0" y="185" rx="3" ry="3" width={'56%'} height="10" />
        <rect x="0" y="208" rx="3" ry="3" width={'15%'} height="10" />

        <rect x="0" y="240" rx="100" ry="100" width="30" height="30" />
        <rect x="40" y="240" rx="100" ry="100" width="30" height="30" />
        <rect x="calc(100% - 30px)" y="240" rx="100" ry="100" width="30" height="30" />
      </ContentLoader>
    </div>
  );
};

export default PostLoader;
