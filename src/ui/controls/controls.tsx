import * as React from 'react';
import * as classNames from 'classnames';

require('./controls.scss');

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

    return <div className="hy-controls hy-section">
      <div className="title">Controls</div>
      <div className="content">{children}</div>
    </div>;
  }
}
