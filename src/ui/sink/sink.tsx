require('./sink.scss');

import * as React from 'react';
import * as classNames from 'classnames';

export interface SinkProps extends React.Props<any> {
  customCSS?: string;
  noPadding?: boolean;
}

export class Sink extends React.PureComponent<SinkProps, {}> {
  private css: HTMLStyleElement;

  componentDidMount() {
    const { customCSS } = this.props;
    if (customCSS) this.attachCSS(customCSS);
  }

  componentWillUnmount() {
    const { customCSS } = this.props;
    if (customCSS) this.detachCSS();
  }

  componentDidUpdate(prevProps: SinkProps) {
    if (this.props === prevProps.customCSS) return;

    this.detachCSS();
    this.attachCSS(this.props.customCSS);
  }

  attachCSS(css: string) {
    var element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    element.innerHTML = css;

    document.getElementsByTagName('head').item(0).appendChild(element);
    this.css = element;
  }

  detachCSS() {
    if (!this.css) return;

    document.getElementsByTagName('head').item(0).removeChild(this.css);
  }

  render() {
    const { children, noPadding } = this.props;

    return <div className={classNames('hy-sink hy-section', {'no-padding': noPadding})}>{children}</div>;
  }
}
