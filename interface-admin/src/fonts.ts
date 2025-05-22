import localFont from 'next/font/local';

const geist = localFont({
  src: [
    {
      path: './fonts/Geist-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Geist-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Geist-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
});

export { geist };
