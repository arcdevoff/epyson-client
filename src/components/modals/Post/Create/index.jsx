'use client';
import React, { useState } from 'react';
import MainModalLayout from '@/components/layouts/Modal/Main';
import ReactModal from 'react-modal';
import styles from './PostCreate.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setModal, setShowSidebar } from '@/redux/reducers/ui/slice';
import { WithContext as ReactTags } from 'react-tag-input';
import MainEditor from '@/components/ui/Main/Editor';
import Image from 'next/image';
import MainPopover from '@/components/ui/Main/Popover';
import { IconUpload, IconX } from '@tabler/icons-react';
import { UploadService } from '@/services/upload.service';
import getApiMessage from '@/utils/getApiMessage';
import Loading from '@/components/ui/Loading';
import { PostService } from '@/services/post.service';
import { useRouter } from 'next/navigation';

const PostCreateModal = () => {
  const { topics } = useSelector((state) => state.topic);
  const [formLoading, setFormLoading] = React.useState(false);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.modal.post.create?.isOpen);
  const router = useRouter();

  const [uploadLoading, setUploadLoading] = useState(false);
  const [text, setText] = useState();
  const [title, setTitle] = useState();
  const [topic, setTopic] = useState();
  const [topicsShow, setTopicsShow] = useState(false);
  const [tags, setTags] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const onRequestClose = () => {
    dispatch(setModal({ modal: 'post', data: { create: { isOpen: false } } }));
  };

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

  const handlPickFile = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    let msg;

    if (file) {
      setUploadLoading(true);

      if (file.type.includes('image')) {
        formData.append('image', file);

        UploadService.image(formData)
          .then(({ data }) => {
            const image = process.env.NEXT_PUBLIC_STORAGE_URL + data.url;

            setAttachments([
              ...attachments,
              {
                url: image,
                type: 'image',
              },
            ]);
          })
          .catch((error) => {
            msg = getApiMessage(error.response);
          })
          .finally(() => {
            setUploadLoading(false);
          });
      } else if (file.type.includes('video')) {
        formData.append('video', file);

        UploadService.video(formData)
          .then(({ data }) => {
            const video = process.env.NEXT_PUBLIC_STORAGE_URL + data.video;
            const poster = process.env.NEXT_PUBLIC_STORAGE_URL + data.poster;

            setAttachments([
              ...attachments,
              {
                poster: poster,
                url: video,
                type: 'video',
              },
            ]);
          })
          .catch((error) => {
            msg = getApiMessage(error.response);
          })
          .finally(() => {
            setUploadLoading(false);
          });
      }

      if (msg) {
        dispatch(setMessage(msg));
      }
    }
  };

  const handleDeleteAttachment = (index) => {
    const updatedAttachments = attachments.filter((_, key) => key !== index);
    setAttachments(updatedAttachments);
  };

  const onSubmit = () => {
    setFormLoading(true);
    PostService.create({
      title,
      topic_id: topic.id,
      text,
      attachments,
      tags,
    })
      .then(({ data }) => {
        setTitle('');
        setTags([]);
        setText('');
        setAttachments([]);

        dispatch(setModal({ modal: 'post', data: { create: { isOpen: false } } }));

        router.push('/post/' + data.id);
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
      <MainModalLayout title={'Новый пост'} onClose={onRequestClose}>
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

          <button disabled={uploadLoading} className={styles.pickFileButton}>
            {uploadLoading ? (
              <Loading />
            ) : (
              <>
                <IconUpload />
                <input
                  type="file"
                  onChange={handlPickFile}
                  accept="image/png, image/jpeg, image/webp, application/pdf, video/mp4"
                />
                Прикрепить файл
              </>
            )}
          </button>

          {attachments[0] && (
            <div className={`${styles.attachments} scroll`}>
              {attachments.map((obj, index) => {
                return (
                  <div className={styles.attachment} key={index}>
                    <button onClick={() => handleDeleteAttachment(index)} className={styles.delete}>
                      <IconX />
                    </button>

                    {obj.type === 'image' && (
                      <Image src={obj.url} width={100} height={100} alt="image" />
                    )}
                    {obj.type === 'video' && (
                      <video controls={true} key={index} src={obj.url} poster={obj.poster} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

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
          />

          <button onClick={onSubmit} disabled={formLoading} className="btn-primary" type="submit">
            Опубликовать
          </button>
        </div>
      </MainModalLayout>
    </ReactModal>
  );
};

export default PostCreateModal;
