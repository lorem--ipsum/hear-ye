import * as React from 'react';
import * as classNames from 'classnames';

import { Input } from '@smooth-ui/core-sc';

import { Example } from '../gallery/gallery';

require('./side-bar.scss');

function sort(examples: Example[]) {
  return [...examples].sort((a, b) => {
    if (a.label > b.label) return 1;
    if (a.label < b.label) return -1;
    return 0;
  });
}

export interface SideBarProps extends React.Props<any> {
  examples: Example[];
  onClick: (example: Example) => void;
  selectedExample?: Example;
}

export interface SideBarState {
  searchString?: string;
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
  private selectedExampleRef: React.RefObject<HTMLDivElement>;

  constructor(props: SideBarProps, context: any) {
    super(props, context);
    this.state = {
      searchString: ''
    };

    this.selectedExampleRef = React.createRef();
  }

  renderExamples() {
    const { examples, onClick } = this.props;
    const { searchString } = this.state;

    return sort(examples)
      .filter(e => searchString ? e.label.toLowerCase().includes(searchString.toLowerCase()) : true)
      .map((e, i) => this.renderExample(e, i, 0));
  }

  renderExample = (example: Example, index: number, nestedness: number) => {
    const { onClick, selectedExample} = this.props;

    const hasChildren = example.examples && example.examples.length > 0;

    return <div
      key={index}
      className={classNames('example', {selected: selectedExample === example, deaf: hasChildren})}
      onClick={hasChildren ? null : () => onClick(example)}
      ref={selectedExample === example ? this.selectedExampleRef : null}
    >
      <div
        className="label"
        style={{paddingLeft: nestedness*20 + 10}}
      >{example.label}
      </div>

      {example.examples ? sort(example.examples).map((e, i) => this.renderExample(e, i, nestedness + 1)) : null}

    </div>;
  }

  componentDidUpdate() {
    if (!this.selectedExampleRef) return;

    const { top, bottom } = this.selectedExampleRef.current.getBoundingClientRect();

    if (top < 0 || bottom > window.innerHeight) {
      this.selectedExampleRef.current.scrollIntoView();
    }
  }

  render() {
    const { examples } = this.props;
    const { searchString } = this.state;

    return <div className="hy-side-bar">
      <div className="search">
        <Input
          placeholder="Search..."
          size="sm"
          value={searchString}
          onChange={e => this.setState({searchString: (e.target as any).value})}
        />
      </div>
      <div className="examples">
        {this.renderExamples()}
      </div>
    </div>;
  }
}
