import styles from './PostComplain.module.scss';
import MainModalLayout from '@/components/layouts/Modal/Main';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import React from 'react';
import { ContentSerivce } from '@/services/content.service';

const complaints = [
  'Спам',
  'Оскорбление',
  'Нарушение закона',
  'Порнографический контент',
  'Насилие',
  'Авторские права',
  'Введение в заблуждение',
  'Другое',
];

const ContentComplainModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modal.content.complain?.isOpen);
  const data = useSelector((state) => state.ui.modal.content.complain?.data);
  const [reason, setReason] = React.useState(null);

  const onRequestClose = () => {
    dispatch(setModal({ modal: 'content', data: { complain: { isOpen: false } } }));
  };

  React.useEffect(() => {
    return () => {
      onRequestClose();
    };
  }, []);

  const send = () => {
    if (!reason) {
      return '';
    }

    ContentSerivce.complaint({ content: data.content, reason })
      .then(() => {
        dispatch(setModal({ modal: 'content', data: { complain: { isOpen: false } } }));
        dispatch(setMessage({ text: 'Ваша жалоба отправлена модератору', status: true }));
      })
      .catch(() => {
        dispatch(setMessage({ text: 'Ошибка', status: false }));
      });
  };

  return (
    <ReactModal
      overlayClassName="main-modal-overlay"
      className={`main-modal ${styles.root}`}
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}>
      <MainModalLayout
        titleStyle={{ textAlign: 'left' }}
        title={'Пожаловаться'}
        onClose={onRequestClose}>
        <div className={styles.complaints}>
          {complaints.map((text, key) => (
            <label key={key} className={styles.complaint}>
              <input
                type="radio"
                name="complain"
                value={text}
                onChange={(e) => setReason(e.target.value)}
              />
              <span className="custom-radio"></span>
              <span className={styles.text}>{text}</span>
            </label>
          ))}

          <button onClick={send} className={`btn-primary ${styles.sendButton}`}>
            Отправить
          </button>
        </div>
      </MainModalLayout>
    </ReactModal>
  );
};

export default ContentComplainModal;
