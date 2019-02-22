require('./sink.scss');

import * as React from 'react';
import * as classNames from 'classnames';

export interface SinkProps extends React.Props<any> {
  customCSS?: string;
}

export interface SinkState {
}

export class Sink extends React.Component<SinkProps, SinkState> {
  private css: HTMLStyleElement;

  constructor(props: SinkProps, context: any) {
    super(props, context);
    this.state = {};
  }

  componentWillMount() {
    const { customCSS } = this.props;

    if (customCSS) this.attachCSS(customCSS);
  }

  componentWillUnmount() {
    const { customCSS } = this.props;
    if (customCSS) this.detachCSS(customCSS);
  }


  attachCSS(css: string) {
    var element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    element.innerHTML = css;

    document.getElementsByTagName('head').item(0).appendChild(element);
    this.css = element;
  }

  detachCSS(css: string) {
    if (!this.css) return;

    document.getElementsByTagName('head').item(0).removeChild(this.css);
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
