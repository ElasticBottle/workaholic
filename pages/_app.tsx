import { AppPropsWithLayout } from "../interface/NextPageWithLayout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return <>{getLayout(<Component {...pageProps} />)}</>;
}

export default MyApp;
