import * as React from 'react';

export interface ExampleProps extends React.Props<any> {
  label?: string;
}

export interface ExampleState {

}

export class Example extends React.Component<ExampleProps, ExampleState> {
  constructor(props: ExampleProps, context: any) {
    super(props, context);

    this.state = {};
  }

  render() {
    const { label, children } = this.props;

    return <div className="example">
      <div className="label">{label}</div>
      {children}

    </div>;
  }
}
