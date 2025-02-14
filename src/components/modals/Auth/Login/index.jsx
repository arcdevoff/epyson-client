'use client';
import React from 'react';
import styles from '../AuthModal.module.scss';
import MainModalLayout from '@/components/layouts/Modal/Main';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import { setAccessToken, setUserDataRefresh } from '@/redux/reducers/user/slice';
import { AuthService } from '@/services/auth.service';
import getApiMessage from '@/utils/getApiMessage';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { queryClient } from '@/components/providers/MainProvider';

const LoginModal = () => {
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = React.useState(false);
  const isOpen = useSelector((state) => state.ui.modal.auth.login?.isOpen);
  const router = useRouter();

  const onRequestClose = () => {
    dispatch(setModal({ modal: 'auth', data: { login: { isOpen: false } } }));
  };

  const onSubmit = (values) => {
    setFormLoading(true);
    AuthService.login(values)
      .then((res) => {
        dispatch(setAccessToken(res.data.accessToken));
        dispatch(setUserDataRefresh(true));
        onRequestClose();
        queryClient.refetchQueries({ queryKey: ['topics'] });

        router.push('/user/' + res.data.id);
      })
      .catch((error) => {
        const msg = getApiMessage(error.response);

        if (msg) {
          dispatch(setMessage(msg));
        }
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  return (
    <ReactModal
      overlayClassName="main-modal-overlay"
      className={`main-modal ${styles.root}`}
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={onRequestClose}>
      <MainModalLayout title={'Вход в аккаунт'} onClose={onRequestClose}>
        <Formik onSubmit={onSubmit} initialValues={{ email: '', password: '' }}>
          <Form>
            <Field name="email" type="email" placeholder="Эл. почта" />
            <Field name="password" type="password" placeholder="Пароль" />

            <button disabled={formLoading} className="btn-primary" type="submit">
              Войти
            </button>
          </Form>
        </Formik>

        <div className={styles.secondary}>
          Нет аккаунта?{' '}
          <button
            onClick={() =>
              dispatch(
                setModal({
                  modal: 'auth',
                  data: { login: { isOpen: false }, signup: { isOpen: true } },
                }),
              )
            }>
            Регистрация
          </button>
        </div>
      </MainModalLayout>
    </ReactModal>
  );
};

export default LoginModal;
