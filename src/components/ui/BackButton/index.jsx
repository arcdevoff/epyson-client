'use client';
import { IconArrowLeft } from '@tabler/icons-react';
import styles from './BackButton.module.scss';
import { useRouter } from 'next/navigation';

const BackButton = ({ style, text }) => {
  const router = useRouter();

  return (
    <div style={style ? style : {}} className={styles.root}>
      <button onClick={() => router.back()}>
        <IconArrowLeft />
      </button>

      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default BackButton;
