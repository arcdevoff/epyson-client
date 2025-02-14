import MainModalLayout from '@/components/layouts/Modal/Main';
import ReactModal from 'react-modal';
import styles from './SubscribersModal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '@/redux/reducers/ui/slice';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useIsVisible from '@/hooks/useIsVisible';

const SubscribersModal = ({ getSubscribers, pages }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modal.subscribers.isOpen);
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loaderRef, loaderVisible, onScrollSubscribers] = useIsVisible(100, 100);

  const onRequestClose = () => {
    dispatch(setModal({ modal: 'subscribers', data: { isOpen: false } }));
  };

  React.useEffect(() => {
    if (isOpen) {
      getSubscribers({ page }).then((newData) => {
        setData([...data, ...newData]);
      });
    }
  }, [getSubscribers, isOpen, page]);

  React.useEffect(() => {
    if (!isOpen) {
      setPage(1);
      setData([]);
    }
  }, [isOpen]);

  React.useEffect(() => {
    return () => {
      onRequestClose();
    };
  }, []);

  React.useEffect(() => {
    if (loaderVisible) {
      setPage(page + 1);
    }
  }, [loaderVisible]);

  return (
    <ReactModal
      overlayClassName="main-modal-overlay"
      className={`main-modal ${styles.root}`}
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}>
      <MainModalLayout
        titleStyle={{ textAlign: 'left' }}
        title={'Подписчики'}
        onClose={onRequestClose}>
        <div onScroll={onScrollSubscribers} className={`scroll ${styles.users}`}>
          {data.map((obj, index) => (
            <Link href={`/user/${obj.id}`} className={styles.user} key={index}>
              <Image
                className={styles.avatar}
                src={obj.avatar}
                alt={obj.name}
                width={40}
                height={40}
              />
              <span className={styles.name}>{obj.name}</span>
            </Link>
          ))}

          {page < pages && <div ref={loaderRef}></div>}
        </div>
      </MainModalLayout>
    </ReactModal>
  );
};

export default SubscribersModal;
