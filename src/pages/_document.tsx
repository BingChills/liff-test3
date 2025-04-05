import { Html, Head, Main, NextScript } from 'next/document';

// A basic Next.js component entry point. It is used to define the `<html>` and `<body>` tags and other globally shared UI.
export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
