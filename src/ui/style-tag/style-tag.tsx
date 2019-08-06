/*
 * Copyright (c) 2019 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

import * as React from 'react';

export class StyleTag extends React.PureComponent {
  private css: HTMLStyleElement | undefined;

  getCss(props: { children?: React.ReactNode }) {
    const text = '' + props.children;
    if (typeof text !== 'string') {
      throw new Error('Only text, please');
    }

    return text;
  }

  componentDidMount() {
    const text = this.getCss(this.props);

    if (text) this.attachCSS(text);
  }

  componentWillUnmount() {
    if (this.css) this.detachCSS();
  }

  componentDidUpdate(prevProps: { children?: React.ReactNode }) {
    if (this.getCss(this.props) === this.getCss(prevProps)) return;

    this.detachCSS();
    this.attachCSS(this.getCss(this.props));
  }

  attachCSS(css: string | undefined) {
    if (!css) return;

    const element = document.createElement('style');
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
    delete this.css;
  }

  render() {
    return null;
  }
}
