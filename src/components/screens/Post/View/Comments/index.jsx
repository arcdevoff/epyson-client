'use client';
import React from 'react';
import MainEditor from '@/components/ui/Main/Editor';
import styles from './PostComments.module.scss';
import { PostService } from '@/services/post.service';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, setModal } from '@/redux/reducers/ui/slice';
import PostComment from '@/components/templates/Post/Comment';
import unixToDateTime from '@/utils/unixToDateTime';
import { useRouter } from 'next/navigation';
import { IconAdjustmentsHorizontal, IconFilter, IconX } from '@tabler/icons-react';
import MainPopover from '@/components/ui/Main/Popover';
import copyText from '@/utils/copyText';
import CommentLoader from '@/components/templates/Post/Comment/Loader';

const limit = 3;
const PostComments = ({ authorized, count, postId, repliesComments }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [text, setText] = React.useState('');
  const [replies, setReplies] = React.useState(repliesComments);
  const [comments, setComments] = React.useState();
  const [commentsStatus, setCommentsStatus] = React.useState('loading');
  const [filter, setFilter] = React.useState('ASC');
  const [filterShow, setFilterShow] = React.useState(false);
  const [parentComment, setParentComment] = React.useState(null);
  const [refetch, setRefetch] = React.useState(true);

  const addComment = () => {
    if (!text) {
      return;
    }

    if (!authorized) {
      return dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    }

    PostService.addComment({
      post_id: postId,
      text,
      parent_id: parentComment?.id ? parentComment.id : null,
      parent_user_id: parentComment?.id ? parentComment.user_id : null,
    })
      .then((result) => {
        let data = result;
        data.author = {
          name: user.name,
          avatar: user.avatar,
        };

        if (!parentComment?.id) {
          let newComments = { ...comments };
          newComments.data = [data, ...comments.data];
          setComments(newComments);
        } else {
          let newReplies = { ...replies };
          newReplies = [data, ...replies];
          setReplies(newReplies);
        }

        setText('');
        // router.push(`#comment-${data.id}`);
      })
      .catch(() => {
        dispatch(setMessage({ text: 'Ошибка', status: false }));
      });
  };

  const getComments = ({ page, filter }) => {
    setCommentsStatus('loading');

    PostService.getComments({
      id: postId,
      page,
      filter,
      limit,
    })
      .then((data) => {
        if (comments?.data.length) {
          let newComments = { ...comments };
          let newData = { ...data };

          newComments.data = Array.from(
            new Set([...comments.data, ...newData.data].map((item) => item.id)),
          ).map((id) => ({
            id,
            ...comments.data.find((item) => item.id === id),
            ...newData.data.find((item) => item.id === id),
          }));

          setComments(newComments);
        } else {
          if (typeof window !== 'undefined') {
            let newComments = { ...data };

            const url = window.location.href;
            if (url.includes('#comment-')) {
              const comment_id = url.split('#comment-')[1];

              PostService.getCommentById({ comment_id })
                .then((comment) => {
                  let newComment = [...comment];
                  newComment[0].linked = true;
                  newComment[0].parent_id = null;

                  newComments.data = [...newComment, ...newComments.data];

                  setComments(newComments);
                })
                .catch(() => {
                  setComments(newComments);
                });
            } else {
              setComments(newComments);
            }
          }
        }

        setCommentsStatus('success');
      })
      .catch(() => {
        setCommentsStatus('error');
        dispatch(setMessage({ text: 'Ошибка при получении комментариев', status: false }));
      });
  };

  const getCommentReplies = (comment_id) => {
    if (replies[0]) {
      const result = replies.filter((obj) => obj.parent_id === comment_id);
      return result;
    }

    return [];
  };

  const handleChangeFilter = (f) => {
    setFilter(f);
    setPage(1);
    setComments();
    setRefetch(true);
  };

  const onClickDeleteComment = (comment) => {
    if (window.confirm('Вы уверены?')) {
      PostService.deleteCommentById({ comment_id: comment.id }).then(() => {
        setRefetch(true);
        if (comment.parent_id) {
          const updatedReplies = replies.filter((item) => item.id !== comment.id);
          setReplies(updatedReplies);
        } else {
          const { pages, data } = comments;
          const updatedComments = data.filter((item) => item.id !== comment.id);
          setComments({ pages, data: updatedComments });
        }
      });
    }
  };

  const onClickReply = (parent) => {
    setParentComment(parent);
    router.push('#comments');
  };

  const onLoadComments = () => {
    if (window.location.href.includes('#comment')) {
      const violation = document.getElementById('comments');
      if (violation?.offsetTop) {
        window.scrollTo({
          top: violation.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  };

  React.useEffect(() => {
    if (refetch) {
      getComments({ page, filter });
      setRefetch(false);
    }
  }, [refetch]);

  return (
    <div onLoad={onLoadComments} id="comments" className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>{count} комментариев</div>

        <div className={styles.actions}>
          <button onBlur={() => setFilterShow(false)} onClick={() => setFilterShow(!filterShow)}>
            <IconAdjustmentsHorizontal />
          </button>
        </div>

        {filterShow && (
          <MainPopover
            rootStyle={{ right: 0, top: 30 }}
            options={[
              {
                active: filter === 'ASC',
                text: 'Сначала старые',
                onClick: () => handleChangeFilter('ASC'),
              },
              {
                active: filter === 'DESC',
                text: 'Сначала новые',
                onClick: () => handleChangeFilter('DESC'),
              },
            ]}
          />
        )}
      </div>

      <div className={styles.form}>
        <MainEditor placeholder="Написать комментарий..." value={text} setValue={setText} />

        {parentComment?.id && (
          <div className={styles.reply}>
            <span className={styles.name}>Ответить ({parentComment.name})</span>
            <button onClick={() => setParentComment()} className={styles.cancelButton}>
              <IconX />
            </button>
          </div>
        )}

        <div className={styles.panel}>
          <button onClick={addComment} className={`btn-primary ${styles.submit}`}>
            Отправить
          </button>
        </div>
      </div>

      {commentsStatus === 'loading' &&
        Array(3)
          .fill()
          .map((_, key) => <CommentLoader key={key} />)}

      {commentsStatus === 'success' && comments?.data && (
        <>
          {comments.data
            .filter((obj) => obj.parent_id === null)
            .map((obj) => (
              <PostComment
                dispatch={dispatch}
                user={user}
                unixToDateTime={unixToDateTime}
                onClickReply={onClickReply}
                onClickDeleteComment={onClickDeleteComment}
                key={obj.id}
                replies={getCommentReplies}
                comment={obj}
                copyText={copyText}
              />
            ))}

          {page < comments.pages && (
            <button
              className={`${styles.showMoreButton} btn-primary`}
              onClick={() => {
                setPage(page + 1);
                setRefetch(true);
              }}>
              Показать еще ({page}-{comments.pages})
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PostComments;
