'use client';
import LoginModal from './Auth/Login';
import React from 'react';
import SignupModal from './Auth/Signup';
import PostCreateModal from './Post/Create';
import PostEditModal from './Post/Edit';
import ContentComplainModal from './Content/Complain';

const Modals = () => {
  return (
    <>
      <LoginModal />
      <SignupModal />
      <PostCreateModal />
      <PostEditModal />
      <ContentComplainModal />
    </>
  );
};

export default Modals;
