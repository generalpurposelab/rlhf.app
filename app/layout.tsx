// import './globals.css';
import '@radix-ui/themes/styles.css';
import { Inter } from 'next/font/google';
import { Theme } from '@radix-ui/themes';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'rlhf.app',
  description: 'rlhf.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Theme appearance="light" accentColor="gray" grayColor="slate" radius="small">
        {children}
        </Theme>
        </body>
    </html>
  );
}
