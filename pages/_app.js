import { useEffect } from 'react';
import { setupWorkers } from '../lib/workerSetup';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Setup worker handlers once when the app starts
    setupWorkers();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;