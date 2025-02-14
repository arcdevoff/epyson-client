'use client';
import { createRef, useState } from 'react';
import throttle from 'lodash.throttle';

export default function useIsVisible(offset = 0, throttleMilliseconds = 100) {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = createRef();

  const onScroll = throttle((e) => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }

    const height = e.target.scrollHeight
      ? e.target.scrollHeight
      : document.documentElement.clientHeight;
    const top = currentElement.current.getBoundingClientRect().top;
    setIsVisible(top + offset >= 0 && top - offset <= height);
  }, throttleMilliseconds);

  return [currentElement, isVisible, onScroll];
}
