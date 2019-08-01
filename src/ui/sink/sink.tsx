require('./sink.scss');

import React from 'react';
import classNames from 'classnames';

export interface SinkProps extends React.Props<any> {
  customCSS?: string;
  noPadding?: boolean;
}

export class Sink extends React.PureComponent<SinkProps, {}> {
  private css: HTMLStyleElement | undefined;

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

  attachCSS(css: string | undefined) {
    if (!css) return;

    var element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    element.innerHTML = css;

    const head = document.getElementsByTagName('head');

    if (!head) return;

    const item = head.item(0);

    if (!item) return;

    item.appendChild(element);

    this.css = element;
  }

  detachCSS() {
    if (!this.css) return;

    const head = document.getElementsByTagName('head');

    if (!head) return;

    const item = head.item(0);

    if (!item) return;

    item.removeChild(this.css);
  }

  render() {
    const { children, noPadding } = this.props;

    return (
      <div
        className={classNames('hy-sink hy-section', {
          'no-padding': noPadding,
        })}
      >
        {children}
      </div>
    );
  }
}
