'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function YandexAds({ styles, blockID }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.yaContextCb.push(() => {
      Ya.Context.AdvManager.render({
        blockId: `R-A-9648108-${blockID}`,
        renderTo: `yandex_rtb_R-A-9648108-${blockID}`,
        async: true,
      });
    });
  }, [pathname, searchParams, blockID]);

  return (
    <div style={styles ? styles : {}}>
      <div id={`yandex_rtb_R-A-9648108-${blockID}`}></div>
    </div>
  );
}
