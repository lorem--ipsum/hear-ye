import * as React from 'react';

export interface ExampleProps extends React.ComponentProps<any> {

}

export interface ExampleState {

}

export class Example extends React.Component<ExampleProps, ExampleState> {
  constructor(props: ExampleProps, context: any) {
    super(props, context);

    this.state = {};
  }

  render() {
    return <div/>;
  }
}
