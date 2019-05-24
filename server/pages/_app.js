import App, {Container} from 'next/app'
import Head from 'next/head'
import React from 'react'

export default class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, ...ctx.query }
  }

  render () {
    const { Component, pageProps, data: { siteInfo: { setting } } } = this.props
    return (
      <Container>
        <Head>
          <title>{setting.title}</title>
        </Head>
        <Component {...pageProps} />
      </Container>
    )
  }
}