import "bootstrap/dist/css/bootstrap.css"
import "../styles/globals.scss"
import { SessionProvider } from "next-auth/react";
import { NextPage } from "next";
import { FC, ReactElement, ReactNode } from "react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import AuthGuard from "../components/authGuard/AuthGuard";
// import { wrapper } from "../store/store";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  requireAuth?: boolean;
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={pageProps.session} basePath="/dashboard/api/auth">
      <Provider store={store}>
        {
          Component.requireAuth
            ?
            <AuthGuard>
              {getLayout(<Component {...pageProps} />)}
            </AuthGuard>
            :
            getLayout(<Component {...pageProps} />)
        }
      </Provider>
    </SessionProvider>
  )
}

// const WrappedApp: FC<AppProps> = ({ Component, pageProps }: AppPropsWithLayout) => {
//   const getLayout = Component.getLayout ?? ((page) => page);
//   return (
//     <SessionProvider session={pageProps.session}>
//       {getLayout(<Component {...pageProps} />)}
//     </SessionProvider>
//   )
// }

// export default wrapper.withRedux(WrappedApp);