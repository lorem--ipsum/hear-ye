/*
 * Copyright (c) 2019 Imply Data, Inc. All rights reserved.
 *
 * This software is the confidential and proprietary information
 * of Imply Data, Inc.
 */

import * as React from 'react';

import './header-bar.scss';

interface HeaderBarProps extends React.Props<any> {
  label: string;
}

export class HeaderBar extends React.Component<HeaderBarProps, {}> {
  render() {
    const { label, children } = this.props;

    return (
      <div className="hy-header-bar">
        <div className="left">
          <div className="label">{label}</div>
        </div>
        <div className="right">{children}</div>
      </div>
    );
  }
}
