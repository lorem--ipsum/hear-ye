import classNames from 'classnames';
import React from 'react';

import { StyleTag } from '../style-tag/style-tag';

export interface SinkProps extends React.Props<any> {
  customCSS?: string;
  noPadding?: boolean;
}

export class Sink extends React.PureComponent<SinkProps, {}> {
  render() {
    const { children, noPadding, customCSS } = this.props;

    return (
      <div
        className={classNames('hy-sink hy-section', {
          'no-padding': noPadding,
        })}
      >
        <StyleTag>{customCSS}</StyleTag>
        {children}
      </div>
    );
  }
}
