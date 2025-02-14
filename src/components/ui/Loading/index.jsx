'use client';
import Image from 'next/image';
import styles from './Loading.module.scss';

const Loading = ({ style, type }) => {
  let src;

  if (type === 'circle') {
    src = '/images/other/circle-loading.png';
  } else {
    src = '/images/other/loading.png';
  }

  return (
    <div style={style ? style : {}} className={styles.root}>
      <Image src={src} width={50} height={50} alt="Loading..." title="Loading..." />
    </div>
  );
};

export default Loading;
