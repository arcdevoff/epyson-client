'use client';
import React, { useState } from 'react';
import MainModalLayout from '@/components/layouts/Modal/Main';
import ReactModal from 'react-modal';
import styles from '../Create/PostCreate.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import { WithContext as ReactTags } from 'react-tag-input';
import MainEditor from '@/components/ui/Main/Editor';
import Image from 'next/image';
import MainPopover from '@/components/ui/Main/Popover';
import getApiMessage from '@/utils/getApiMessage';
import { PostService } from '@/services/post.service';
import { useRouter } from 'next/navigation';

const PostEditModal = () => {
  const { topics } = useSelector((state) => state.topic);
  const [formLoading, setFormLoading] = React.useState(false);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modal.post.edit?.isOpen);
  const data = useSelector((state) => state.ui.modal.post.edit?.data);
  const router = useRouter();

  const [text, setText] = useState();
  const [title, setTitle] = useState();
  const [topic, setTopic] = useState();
  const [topicsShow, setTopicsShow] = useState(false);
  const [tags, setTags] = useState();

  const onRequestClose = () => {
    dispatch(setModal({ modal: 'post', data: { edit: { isOpen: false, data: null } } }));
  };

  React.useEffect(() => {
    if (data) {
      setTitle(data.title);
      setText(data.text);
      setTopic(data.topic);

      if (data.tags[0].text) {
        const newTags = [];
        data.tags.map((obj) => {
          newTags.push({ id: obj.text, text: obj.text });
        });
        setTags(newTags);
      } else {
        setTags([]);
      }
    }
  }, [data]);

  React.useEffect(() => {
    setTopic(topics[0]);
  }, [topics]);

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAdditionTag = (tag) => {
    const newTag = tag;
    newTag.id = tag.id
      .replace(/\s/g, '')
      .toLowerCase()
      .replace(/[^A-Za-zА-Яа-я0-9_]/g, '');
    newTag.text = tag.text
      .replace(/\s/g, '')
      .toLowerCase()
      .replace(/[^A-Za-zА-Яа-я0-9_]/g, '');
    setTags([...tags, newTag]);
  };

  const handleDragTag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleUpdate = () => {
    setFormLoading(true);
    console.log(topic);
    PostService.updateById({
      id: data.id,
      title,
      topic_id: topic.id,
      text,
      tags,
    })
      .then(() => {
        setTitle('');
        setTags([]);
        setText('');

        dispatch(setMessage({ text: 'Готово', status: true }));
        dispatch(setModal({ modal: 'post', data: { edit: { isOpen: false, data: null } } }));
        router.push(`/post/${data.id}`);
        router.refresh();
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
      <MainModalLayout title={'Редактировать пост'} onClose={onRequestClose}>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <MainEditor placeholder={'Текст...'} value={text} setValue={setText} />

          <div className={styles.topics}>
            {topic && (
              <button
                onBlur={() => setTopicsShow(false)}
                onClick={() => setTopicsShow(!topicsShow)}
                className={styles.select}>
                <Image src={topic.avatar} width={30} height={30} alt="topic" />
                <span>{topic.name}</span>
              </button>
            )}

            {topicsShow && (
              <MainPopover
                rootStyle={{
                  bottom: 54,
                  height: '10rem',
                  overflowY: 'auto',
                }}
                options={topics.map((obj) => ({
                  text: obj.name,
                  onClick: () => {
                    setTopic(obj);
                    setTopicsShow(false);
                  },
                  image: obj.avatar,
                  active: topic?.name === obj.name,
                }))}
              />
            )}
          </div>

          <ReactTags
            maxTags={10}
            tags={tags}
            handleDelete={handleDeleteTag}
            handleAddition={handleAdditionTag}
            handleDrag={handleDragTag}
            inputFieldPosition="top"
            classNames={{
              tags: styles.tags,
              tagInput: styles.tagInput,
              tagInputField: styles.tagInputField,
              selected: styles.tagSelected,
              tag: styles.tag,
            }}
            placeholder="Нажмите enter, чтобы добавить новый тег"
            autocomplete
            autofocus={false}
          />

          <button
            onClick={handleUpdate}
            disabled={formLoading}
            className="btn-primary"
            type="submit">
            Сохранить
          </button>
        </div>
      </MainModalLayout>
    </ReactModal>
  );
};

export default PostEditModal;
