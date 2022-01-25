import Head from "next/head";
import React from "react";

export default function Meta() {
  return (
    <Head>
      <title>Who&apos;s the biggest workaholic</title>
      <meta name="description" content="visualizing how we spend our time" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="favicon-16x16.png"
      />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
}
