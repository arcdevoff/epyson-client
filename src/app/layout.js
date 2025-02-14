import { Inter } from 'next/font/google';
import '@/styles/global.scss';
import { ThemeProvider } from 'next-themes';
import AsideLeft from '@/components/ui/Aside/Left';
import AsideRight from '@/components/ui/Aside/Right';
import Header from '@/components/ui/Header';
import MainProvider from '@/components/providers/MainProvider';
import Message from '@/components/ui/Message';
import Modals from '@/components/modals';
import TabBar from '@/components/ui/TabBar';
import Script from 'next/script';
import { Suspense } from 'react';
import YandexMetrika from '@/components/ui/Yandex/Metrika';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITENAME + ' — Информационно-развлекательное сообщество',
  description:
    'Информационно-развлекательное сообщество, где каждый найдет что-то интересное для себя! Здесь мы обсуждаем разные темы - от кино и музыки до науки и путешествий. Присоединяйтесь к нам, чтобы узнать что-то новое, поделиться своими знаниями и просто хорошо провести время.',
  openGraph: {
    title: process.env.NEXT_PUBLIC_SITENAME + ' — Информационно-развлекательное сообщество',
    description:
      'Информационно-развлекательное сообщество, где каждый найдет что-то интересное для себя! Здесь мы обсуждаем разные темы - от кино и музыки до науки и путешествий. Присоединяйтесь к нам, чтобы узнать что-то новое, поделиться своими знаниями и просто хорошо провести время.',
    url: process.env.NEXT_PUBLIC_DOMAIN,
    images: [
      {
        url: process.env.NEXT_PUBLIC_DOMAIN + '/images/other/cover.png',
        width: 600,
        height: 315,
      },
    ],
  },
};

export default async function RootLayout({ children }) {
  return (
    <MainProvider>
      <html lang="ru" suppressHydrationWarning>
        <body className={inter.className}>
          <GoogleAnalytics gaId="G-097WLMJELF" />

          <Script id="yandex-ads">{`window.yaContextCb=window.yaContextCb||[]`}</Script>
          <Script src="https://yandex.ru/ads/system/context.js" strategy="afterInteractive" />

          <Script id="metrika-counter" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(97598363, "init", {
                  defer: true,
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
              });`}
          </Script>

          <Suspense fallback={<></>}>
            <YandexMetrika />
          </Suspense>

          <div className="container">
            <ThemeProvider attribute="class">
              <Modals />
              <Message />
              <Header />
              <TabBar />

              <div className="grid">
                <AsideLeft />
                {children}
                <AsideRight />
              </div>
            </ThemeProvider>
          </div>
        </body>
      </html>
    </MainProvider>
  );
}
