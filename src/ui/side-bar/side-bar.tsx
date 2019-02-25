import * as React from 'react';
import * as classNames from 'classnames';
import { Example } from '../gallery/gallery';

require('./side-bar.scss');

export interface SideBarProps extends React.Props<any> {
  examples: Example[];
  onClick: (example: Example) => void;
  selectedExample?: Example;
}

export interface SideBarState {
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
  constructor(props: SideBarProps, context: any) {
    super(props, context);
    this.state = {};
  }

  renderExamples() {
    const { examples, onClick } = this.props;

    return examples.map((e, i) => this.renderExample(e, i, 0));
  }

  renderExample = (example: Example, index: number, nestedness: number) => {
    const { onClick, selectedExample} = this.props;

    const hasChildren = example.examples && example.examples.length > 0;

    return <div
      key={index}
      className={classNames('example', {selected: selectedExample && selectedExample === example})}
      onClick={hasChildren ? null : () => onClick(example)}
      style={{paddingLeft: nestedness*20 + 10}}
    >
      <div className="label">{example.label}</div>
      {example.examples ? example.examples.map((e, i) => this.renderExample(e, i, nestedness + 1)) : null}
    </div>;
  }

  render() {
    const { examples } = this.props;
    const {  } = this.state;

    return <div className="hy-side-bar">
      {this.renderExamples()}
    </div>;
  }
}
