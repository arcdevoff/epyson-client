'use client';
import { setAccessToken, setUserData, setUserDataRefresh } from '@/redux/reducers/user/slice';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

const UserConfirm = ({ token }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  React.useEffect(() => {
    UserService.confirm(token)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setAccessToken(res.data.accessToken));
          dispatch(setUserDataRefresh(true));

          router.push('/user/' + res.data.id);
        }
      })
      .catch(async () => {
        dispatch(setUserDataRefresh(true));
        router.push('/');
      });
  }, [dispatch, router, token]);

  return;
};

export default UserConfirm;
