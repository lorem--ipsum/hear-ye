/*
 * Copyright (c) 2018 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

require('./controls.scss');

import * as React from 'react';
import * as classNames from 'classnames';

export interface ControlsProps extends React.Props<any> {
}

export interface ControlsState {
}

export class Controls extends React.Component<ControlsProps, ControlsState> {
  constructor(props: ControlsProps, context: any) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { children } = this.props;

    return <div className="hy-controls">
      <div className="title">Controls</div>
      <div className="content">{children}</div>
    </div>;
  }
}
