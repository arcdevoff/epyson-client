import Image from 'next/image';
import styles from './Empty.module.scss';

const Empty = ({ text, image, imageWidth, imageHeight, style }) => {
  return (
    <div style={style ? style : {}} className={styles.root}>
      <Image src={image} width={imageWidth} height={imageHeight} alt="empty" />
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default Empty;
