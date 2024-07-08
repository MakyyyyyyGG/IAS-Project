import * as React from "react";
import Providers from "../../Providers";
import Script from "next/script";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Providers>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Providers>
  );
}
