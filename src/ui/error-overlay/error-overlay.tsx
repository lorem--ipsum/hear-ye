import * as React from 'react';
import * as classNames from 'classnames';

require('./error-overlay.scss');

export interface ErrorOverlayProps extends React.Props<any> {
  errors: string[];
}

export interface ErrorOverlayState {
}

export class ErrorOverlay extends React.Component<ErrorOverlayProps, ErrorOverlayState> {
  constructor(props: ErrorOverlayProps, context: any) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { errors } = this.props;

    return <div className="hy-error-overlay">
      {errors.map((e, i) => {
        return <div key={i} className="error"><pre>{e}</pre></div>;
      })}
    </div>;
  }
}
