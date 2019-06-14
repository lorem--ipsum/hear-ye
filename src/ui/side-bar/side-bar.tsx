import * as React from 'react';
import * as classNames from 'classnames';
import { Icon } from '../icon/icon';
import { arrows_keyboard_right } from 'react-icons-kit/linea/arrows_keyboard_right';

import { Deprecated } from '../deprecated/deprecated';
import { Example } from '../gallery/gallery';
import { ExampleFolder } from './example-folder';

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

  renderExample = (example: Example, index: number, level: number) => {
    const { onClick, selectedExample} = this.props;

    const hasChildren = example.examples && example.examples.length > 0;

    if (!hasChildren) {
      return <div
        className={classNames('example', {selected: selectedExample === example})}
        onClick={() => onClick(example)}
        ref={selectedExample === example ? this.selectedExampleRef : null}
        key={index}
      >
        <div className="label" style={{paddingLeft: level * 10 + 20}}>
          <Icon size={15} icon={arrows_keyboard_right}/>
          <div className="label-content">{example.label}</div>
          {example.deprecated ? <Deprecated/> : null}
        </div>
      </div>;
    }

    return <ExampleFolder
      key={index}
      label={example.label}
      className="example-folder"
      level={level}
      open={selectedExample && selectedExample.path[level] === example.label}
    >
      {sort(example.examples).map((e, i) => this.renderExample(e, i, level + 1))}

    </ExampleFolder>;
  }

  componentDidUpdate() {
    if (!this.selectedExampleRef.current) return;

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
        <input
          className="search-input"
          placeholder="Search..."
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
