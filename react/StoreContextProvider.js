import React, { Component } from 'react'
import { Helmet, withRuntimeContext, ExtensionPoint } from 'render'
import PropTypes from 'prop-types'

import GtmScripts from './components/GtmScripts'
import PageViewPixel from './components/PageViewPixel'
import { OrderFormProvider } from './OrderFormContext'
import { DataLayerProvider } from './components/withDataLayer'
import { PixelProvider } from './PixelContext'

const APP_LOCATOR = 'vtex.store'
const CONTENT_TYPE = 'text/html;charset=utf-8'
const META_ROBOTS = 'index, follow'

class StoreContextProvider extends Component {
  static propTypes = {
    runtime: PropTypes.shape({
      prefetchPage: PropTypes.func.isRequired,
      culture: PropTypes.shape({
        country: PropTypes.string,
        locale: PropTypes.string,
        currency: PropTypes.string,
      }),
    }),
    children: PropTypes.element,
    push: PropTypes.func,
  }

  componentDidMount() {
    const { prefetchPage } = this.props.runtime
    prefetchPage('store/home')
    prefetchPage('store/product')
    prefetchPage('store/category')
    prefetchPage('store/brand')
    prefetchPage('store/department')
    prefetchPage('store/search')
    prefetchPage('store/checkout')
    prefetchPage('store/checkout/cart')
  }

  render() {
    const { country, locale, currency } = this.props.runtime.culture
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    const {
      gtmId,
      titleTag,
      metaTagDescription,
      metaTagKeywords,
      metaTagRobots,
      storeName,
    } = settings

    window.dataLayer = window.dataLayer || []

    return (
      <PixelProvider>
        <DataLayerProvider value={{ dataLayer: window.dataLayer }}>
          <GtmScripts gtmId={gtmId} />
          <ExtensionPoint id="store/pixel" />
          <PageViewPixel />
          <Helmet>
            <title>{titleTag}</title>
            <meta name="description" content={metaTagDescription} />
            <meta name="keywords" content={metaTagKeywords} />
            <meta name="copyright" content={storeName} />
            <meta name="author" content={storeName} />
            <meta name="country" content={country} />
            <meta name="language" content={locale} />
            <meta name="currency" content={currency} />
            <meta name="robots" content={metaTagRobots || META_ROBOTS} />
            <meta httpEquiv="Content-Type" content={CONTENT_TYPE} />
          </Helmet>
          <OrderFormProvider>
            <div className="vtex-store__template">{this.props.children}</div>
          </OrderFormProvider>
        </DataLayerProvider>
      </PixelProvider>
    )
  }
}

StoreContextProvider.contextTypes = {
  getSettings: PropTypes.func,
}

export default withRuntimeContext(StoreContextProvider)
