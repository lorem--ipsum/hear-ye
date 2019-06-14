import * as React from 'react';

import { SideBar } from '../side-bar/side-bar';
import { ExampleSummary } from '../example-summary/example-summary';
import { QuickSearch } from '../quick-search/quick-search';
import { Example } from '../models';

import './gallery.scss';

interface ProjectInfo {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
}


interface GalleryProps {
  projectInfo: ProjectInfo;
  hearYeVersion: string;

  strict: boolean;
  standalone: boolean;
  noNiceCss: boolean;
}

interface GalleryState {
  exampleId?: string;
  quickSearchVisible?: boolean;
}

export class Gallery extends React.Component<GalleryProps, GalleryState> {
  static examples: Example[] = [];

  static add(example: {component: JSX.Element; path: string[]; deprecated?: boolean}) {
    const { path } = example;

    const p = path.map(p => p.replace(/\/+/, ' '));

    let examples = Gallery.examples;
    let _p = p.shift();
    while (_p && p.length >= 0) {
      const found = examples.find(e => e.label === _p);
      if (found) {
        examples = found.examples;
      } else {

        if (p.length === 0) {
          examples.push({
            label: _p,
            path,
            component: example.component,
            deprecated: example.deprecated
          });
          break;

        } else {
          examples.push({
            label: _p,
            examples: [] as Example[],
            deprecated: example.deprecated
          });

          examples = examples[examples.length - 1].examples;
        }
      }

      _p = p.shift();
    }
  }

  private mounted: boolean;

  constructor(props: GalleryProps, context: any) {
    super(props, context);
    this.state = {};

    this.setTitle();
  }

  setTitle = () => {
    const { projectInfo } = this.props;
    const { exampleId } = this.state;

    const example = exampleId ? this.getExampleForId(exampleId) : null;

    const projectNameBits = projectInfo.name.split('/');

    const titleBits = [
      projectNameBits[projectNameBits.length - 1] + '@' + projectInfo.version,
      example ? example.label : null
    ];

    window.document.title = titleBits.filter(Boolean).join(' | ');
  }

  componentDidMount() {
    this.mounted = true;

    window.addEventListener('hashchange', this.onHashChange);
    window.addEventListener('keydown', this.onKeyDown);
    this.onHashChange();
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange);
    window.removeEventListener('keydown', this.onKeyDown);
    this.mounted = false;
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'O' && event.metaKey && event.shiftKey) {
      this.setState({
        quickSearchVisible: true
      });
    } else if (event.key === 'Escape') {
      this.setState({
        quickSearchVisible: false
      });
    }
  }

  onHashChange = () => {
    const hash = window.location.hash.replace(/^#/, '');
    this.setState({
      exampleId: hash
    }, this.setTitle);
  }

  goToExample = (item: Example) => {
    const url = item.path.map(encodeURI).join('/');

    window.location.hash = url;
  }

  getExampleForId(id: string): Example {
    if (!id) return null;

    const path = id.split('/').map(decodeURI);

    let examples = Gallery.examples;
    let p = path.shift();

    while(p && path.length >= 0) {
      const example = examples.find(e => e.label === p)
      if (path.length === 0) return example;
      examples = example.examples;
      p = path.shift();
    }

    return null;
  }

  renderMain() {
    const { projectInfo, hearYeVersion } = this.props;
    const { exampleId } = this.state;

    if (!exampleId) {
      const { name, description, keywords, version } = projectInfo;
      return <div className="main nothing-to-show">
        <div className="vertically-centered">
          <div className="name">{name}@{version}</div>
          <div className="description">{description}</div>
          {keywords ? <div className="keywords">{keywords.map((k, i) => <span key={i} className="keyword">{k}</span>)}</div> : null}
        </div>
        <a href="https://github.com/lorem--ipsum/hear-ye" target="_blank" className="footer">Powered by hear-ye@{hearYeVersion}</a>
      </div>;
    }

    const example = exampleId ? this.getExampleForId(exampleId) : null;

    if (!example) {
      return <div className="main">
        404, I guess?
      </div>;
    }

    return <div className="main">
      <ExampleSummary example={example}/>
      {example.component}
    </div>;
  }

  render() {
    const { strict } = this.props;
    const { exampleId, quickSearchVisible } = this.state;

    const openExample = (example: Example) => {
      this.setState({
        quickSearchVisible: false
      });

      this.goToExample(example);
    }

    const examples = Gallery.examples;

    const content = <div className="hy-gallery">
      <SideBar
        examples={examples}
        onClick={this.goToExample}
        selectedExample={this.getExampleForId(exampleId)}
      />

      { this.renderMain() }

      { quickSearchVisible && <QuickSearch examples={examples} onSelect={openExample}/> }
    </div>;

    if (!strict) return content;

    return <React.StrictMode>
      {content}
    </React.StrictMode>;
  }
}
