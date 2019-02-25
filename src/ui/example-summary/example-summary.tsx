import * as React from 'react';
import * as classNames from 'classnames';

import { Example } from '../gallery/gallery';

require('./example-summary.scss');

export interface ExampleSummaryProps extends React.Props<any> {
  example: Example;
}

export interface ExampleSummaryState {
}

export class ExampleSummary extends React.Component<ExampleSummaryProps, ExampleSummaryState> {
  constructor(props: ExampleSummaryProps, context: any) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { example } = this.props;
    const {  } = this.state;

    return <div className="hy-example-summary">
      <div className="title">{example.path.join(' > ')}</div>
    </div>;
  }
}
