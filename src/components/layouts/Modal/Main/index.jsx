'use client';
import { IconX } from '@tabler/icons-react';
import styles from './MainModalLayout.module.scss';

const MainModalLayout = ({ children, title, titleStyle, onClose }) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div style={titleStyle ? titleStyle : {}} className={styles.title}>
          {title}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          <IconX />
        </button>
      </div>

      {children}
    </div>
  );
};

export default MainModalLayout;
