import PropTypes from 'prop-types'
import { Component } from 'react'
import { withRuntimeContext } from 'render'
import { Pixel } from 'vtex.pixel-manager/PixelContext'

class PageViewPixel extends Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    runtime: PropTypes.object.isRequired,
  }

  sendPageViewEvent() {
    this.props.push({
      event: 'pageView',
      pageTitle: document.title,
      pageUrl: location.href,
      accountName: this.props.runtime.account,
    })
  }

  componentDidMount() {
    this.sendPageViewEvent()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.runtime.route.path !== this.props.runtime.route.path) {
      this.sendPageViewEvent()
    }
  }

  render() {
    return null
  }
}

export default Pixel(withRuntimeContext(PageViewPixel))
