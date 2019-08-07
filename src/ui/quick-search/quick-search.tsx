import classNames from 'classnames';
import Fuse from 'fuse.js';
import React from 'react';

import { Example } from '../models';

import './quick-search.scss';

interface QuickSearchProps extends React.Props<any> {
  examples: Example[];
  onSelect: (example: Example) => void;
}

interface QuickSearchState {
  flatExamples: Example[];
  searchString: string;
  hoveredIndex: number;
}

function flatten(examples: Example[]) {
  const flatExamples: Example[] = [];

  for (let i = 0; i < examples.length; i++) {
    const e = examples[i];

    if (e.examples.length === 0) {
      flatExamples.push(e);
    } else {
      flatExamples.push(...flatten(e.examples));
    }
  }

  return flatExamples;
}

export class QuickSearch extends React.PureComponent<QuickSearchProps, QuickSearchState> {
  static getDerivedStateFromProps(props: QuickSearchProps) {
    return {
      flatExamples: flatten(props.examples),
    };
  }

  private input = React.createRef<HTMLInputElement>();
  private examplesContainer = React.createRef<HTMLDivElement>();
  private mounted = false;

  constructor(props: QuickSearchProps, context: any) {
    super(props, context);
    this.state = {
      flatExamples: flatten(props.examples),
      searchString: '',
      hoveredIndex: -1,
    };
  }

  getFilteredExamples() {
    const { flatExamples, searchString } = this.state;

    if (!searchString) return flatExamples;

    const fuse = new Fuse(flatExamples, {
      keys: ['label', 'path'],
      threshold: 0.5,
    });

    return fuse.search(searchString);
  }

  renderExamples() {
    const { onSelect } = this.props;
    const { hoveredIndex } = this.state;

    const examples = this.getFilteredExamples();

    return examples.map((e, i) => {
      return (
        <div
          className={classNames('example', { active: i === hoveredIndex })}
          key={e.path.join('/')}
          onClick={() => onSelect(e)}
        >
          <div className="label">{e.label}</div>
          <div className="path">{e.path.join(' > ')}</div>
        </div>
      );
    });
  }

  componentDidMount() {
    this.mounted = true;

    if (this.input.current) this.input.current.focus();
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);

    this.mounted = false;
  }

  componentDidUpdate() {
    const { hoveredIndex } = this.state;

    if (hoveredIndex >= 0 && this.examplesContainer.current) {
      const exampleToScrollTo = this.examplesContainer.current.children[hoveredIndex];
      if (exampleToScrollTo) exampleToScrollTo.scrollIntoView({ block: 'center' });
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    const { onSelect } = this.props;
    const { hoveredIndex } = this.state;
    const examples = this.getFilteredExamples();

    if (!this.mounted) return;

    if (event.key === 'Enter') {
      onSelect(examples[hoveredIndex]);
      return;
    }

    let newHoveredIndex: number | undefined;

    if (event.key === 'ArrowDown') {
      newHoveredIndex = hoveredIndex + 1;
    } else if (event.key === 'ArrowUp') {
      newHoveredIndex = hoveredIndex - 1;
    }

    if (newHoveredIndex === undefined) return;

    if (newHoveredIndex < 0) newHoveredIndex = examples.length - 1;
    if (newHoveredIndex > examples.length - 1) newHoveredIndex = 0;

    this.setState({
      hoveredIndex: newHoveredIndex,
    });
  };

  onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchString: event.target.value,
      hoveredIndex: 0,
    });
  };

  render() {
    const {} = this.props;
    const { searchString } = this.state;

    return (
      <div className="quick-search">
        <input
          className="search-input"
          placeholder="Search..."
          ref={this.input}
          value={searchString}
          onChange={this.onSearch}
        />
        <div className="examples" ref={this.examplesContainer}>
          {this.renderExamples()}
        </div>
      </div>
    );
  }
}
