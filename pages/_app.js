// admin/pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Landing page (/) dan login page (/login) tidak pakai Layout
  if (router.pathname === '/' ||router.pathname === '/privacy' ||router.pathname === '/tos' ||router.pathname === '/delete' || router.pathname === '/login') {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}