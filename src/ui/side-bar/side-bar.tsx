import * as React from 'react';
import * as classNames from 'classnames';
import { Example } from '../gallery/gallery';

require('./side-bar.scss');

export interface SideBarProps extends React.Props<any> {
  examples: Example[];
  onClick: (example: Example) => void;
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

    let components: Record<string, Example[]> = {};

    examples.forEach(example => {
      const a = components[example.componentLabel] || [];
      a.push(example);
      components[example.componentLabel] = a;
    });

    const elements: JSX.Element[] = [];

    Object.keys(components).forEach(key => {
      const c = components[key];

      if (!c.length) return;

      if (c.length === 1) {
        elements.push(<div className="component" key={key} onClick={() => onClick(c[0])}>
          <div className="label">{key}</div>
        </div>);
        return;
      }

      elements.push(<div className="component" key={key} onClick={c.length === 1 ? () => onClick(c[0]) : null}>
        <div className="label">{key}</div>
        {c.map(this.renderExample)}
      </div>);
    });

    return elements;
  }

  renderExample = (example: Example, index: number) => {
    const { onClick } = this.props;

    return <div
      key={index}
      className="example"
      onClick={() => onClick(example)}
    >
      {example.exampleLabel}
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
