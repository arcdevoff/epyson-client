import Image from 'next/image';
import styles from './Popover.module.scss';

const MainPopover = ({ options, rootStyle }) => {
  return (
    <div className={styles.root} style={rootStyle ? rootStyle : {}}>
      {options.map((obj, index) => (
        <>
          {obj.isVisible !== false ? (
            <button
              onMouseDown={(e) => e.preventDefault()}
              key={index}
              style={obj.style ? obj.style : {}}
              className={`${obj.active ? styles.active : ''}`}
              onClick={obj.onClick}>
              {obj.icon && obj.icon}{' '}
              {obj.image && <Image src={obj.image} width={28} height={28} alt="image" />} {obj.text}
            </button>
          ) : (
            ''
          )}
        </>
      ))}
    </div>
  );
};

export default MainPopover;
