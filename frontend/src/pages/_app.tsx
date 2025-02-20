import { useEffect } from 'react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const loadPwaElements = async () => {
      if (typeof window !== 'undefined') {
        const { defineCustomElements } = await import('@ionic/pwa-elements/loader');
        defineCustomElements(window);
      }
    };
    loadPwaElements();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp; 