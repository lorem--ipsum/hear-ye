import * as React from 'react';
import * as classNames from 'classnames';

import { Deprecated } from '../deprecated/deprecated';
import { Example } from '../gallery/gallery';

require('./example-summary.scss');

export interface ExampleSummaryProps extends React.Props<any> {
  example: Example;
}

export class ExampleSummary extends React.Component<ExampleSummaryProps, {}> {
  constructor(props: ExampleSummaryProps, context: any) {
    super(props, context);
    this.state = {};
  }

  render() {
    const { example } = this.props;

    return <div className="hy-example-summary">
      <div className="title">{example.path.join(' > ')}{example.deprecated ? <Deprecated/> : null}</div>
    </div>;
  }
}
