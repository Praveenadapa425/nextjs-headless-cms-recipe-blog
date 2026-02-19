import { Html, Head, Main, NextScript } from "next/document";
import { DocumentContext } from "next/document";

interface DocumentProps {
  locale: string;
}

export default function Document({ locale }: DocumentProps) {
  return (
    <Html lang={locale || "en"}>
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await ctx.defaultGetInitialProps(ctx);
  const locale = ctx.locale || "en";
  
  return {
    ...initialProps,
    locale,
  };
};
