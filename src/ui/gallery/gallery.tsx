import React from 'react';

import { ExampleSummary } from '../example-summary/example-summary';
import { HeaderBar } from '../header-bar/header-bar';
import { Example } from '../models';
import { QuickSearch } from '../quick-search/quick-search';
import { SideBar } from '../side-bar/side-bar';

import { StaticListenerDelegate } from './static-listener-delegate';

import './gallery.scss';

interface ProjectInfo {
  name: string;
  version: string;
  description: string;
  keywords: string[];
}

interface GalleryProps {
  projectInfo: ProjectInfo;
  hearYeVersion: string;

  strict: boolean;
  standalone: boolean;
  noNiceCss: boolean;
}

interface GalleryState {
  hoveredExample?: Example;
  exampleId?: string;
  quickSearchVisible?: boolean;
  wrapper?: JSX.Element;
}

interface StaticProps {
  wrapper?: JSX.Element;
}

export class Gallery extends React.Component<GalleryProps, GalleryState> {
  static getDerivedStateFromProps() {
    return {
      wrapper: Gallery.props.wrapper,
    };
  }

  static headerBarControls: JSX.Element[] = [];

  static props: StaticProps = {};
  static propsListener = new StaticListenerDelegate<StaticProps>();

  static setWrapper(wrapper: JSX.Element | undefined) {
    this.props.wrapper = wrapper;

    this.propsListener.dispatch(this.props);
  }

  static examples: Example[] = [];

  static add(example: { component: JSX.Element; path: string[]; deprecated?: boolean }) {
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
            deprecated: example.deprecated,
            examples: [],
          });
          break;
        } else {
          examples.push({
            label: _p,
            path,
            examples: [] as Example[],
            deprecated: example.deprecated,
          });

          examples = examples[examples.length - 1].examples;
        }
      }

      _p = p.shift();
    }
  }

  constructor(props: GalleryProps, context: any) {
    super(props, context);
    this.state = {};

    this.setTitle();
  }

  onStaticPropsChange = (newStaticProps: StaticProps) => {
    this.setState({
      wrapper: newStaticProps.wrapper,
    });
  };

  getProjectId() {
    const { projectInfo } = this.props;

    const projectNameBits = projectInfo.name.split('/');

    const projectName = projectNameBits[projectNameBits.length - 1];
    const projectNameSpace = projectNameBits[0];

    return {
      name: projectName,
      namespace: projectName !== projectNameSpace ? projectNameSpace : undefined,
      version: projectInfo.version,
    };
  }

  setTitle = () => {
    const { exampleId } = this.state;

    const example = exampleId ? this.getExampleForId(exampleId) : undefined;

    const { name, version } = this.getProjectId();

    const titleBits = [name + '@' + version, example ? example.label : undefined];

    window.document.title = titleBits.filter(Boolean).join(' | ');
  };

  componentDidMount() {
    Gallery.propsListener.add(this.onStaticPropsChange);
    window.addEventListener('hashchange', this.onHashChange);
    window.addEventListener('keydown', this.onKeyDown);
    this.onHashChange();
  }

  componentWillUnmount() {
    Gallery.propsListener.remove(this.onStaticPropsChange);
    window.removeEventListener('hashchange', this.onHashChange);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 79 && event.metaKey && event.shiftKey) {
      // cmd + shift + o
      this.setState({
        quickSearchVisible: true,
      });
    } else if (event.keyCode === 27) {
      // Escape
      this.setState({
        quickSearchVisible: false,
        hoveredExample: undefined,
      });
    }
  };

  onHashChange = () => {
    const hash = window.location.hash.replace(/^#/, '');
    this.setState(
      {
        exampleId: hash,
        hoveredExample: undefined,
      },
      this.setTitle,
    );
  };

  goToExample = (item: Example) => {
    const url = item.path.map(encodeURI).join('/');

    window.location.hash = url;
  };

  previewExample = (item: Example | undefined) => {
    this.setState({
      hoveredExample: item,
    });
  };

  getExampleForId(id: string): Example | undefined {
    if (!id) return;

    const path = id.split('/').map(decodeURI);

    let examples = Gallery.examples;
    let p = path.shift();

    while (p && path.length >= 0) {
      const example = examples.find(e => e.label === p);

      if (!example) {
        throw new Error('Could not find example for id ' + id);
      }

      if (path.length === 0) return example;
      examples = example.examples;
      p = path.shift();
    }

    return;
  }

  renderMain() {
    const { projectInfo, hearYeVersion } = this.props;
    const { exampleId, hoveredExample } = this.state;

    if (!exampleId) {
      const { name, description, keywords, version } = projectInfo;
      return (
        <div className="main nothing-to-show">
          <div className="vertically-centered">
            <div className="name">
              {name}@{version}
            </div>
            <div className="description">{description}</div>
            {keywords ? (
              <div className="keywords">
                {keywords.map((k, i) => (
                  <span key={i} className="keyword">
                    {k}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <a href="https://github.com/lorem--ipsum/hear-ye" target="_blank" className="footer">
            Powered by hear-ye@{hearYeVersion}
          </a>
        </div>
      );
    }

    let example = exampleId ? this.getExampleForId(exampleId) : null;

    if (hoveredExample) {
      example = hoveredExample;
    }

    if (!example) {
      return <div className="main">404, I guess?</div>;
    }

    return (
      <div className="main">
        <ExampleSummary example={example} />
        {example.component}
      </div>
    );
  }

  wrap(content: JSX.Element) {
    const { wrapper } = this.state;

    if (!wrapper) return content;

    return React.cloneElement(wrapper, { children: content });
  }

  render() {
    const { strict } = this.props;
    const { exampleId, quickSearchVisible } = this.state;

    const openExample = (example: Example) => {
      this.setState({
        quickSearchVisible: false,
      });

      this.goToExample(example);
    };

    const examples = Gallery.examples;

    const { name, version } = this.getProjectId();

    const content = (
      <div className="hy-gallery">
        <HeaderBar label={`${name}@${version}`}>{Gallery.headerBarControls}</HeaderBar>

        <SideBar
          examples={examples}
          onClick={this.goToExample}
          selectedExample={exampleId ? this.getExampleForId(exampleId) : undefined}
        />

        {this.renderMain()}

        {quickSearchVisible && (
          <QuickSearch examples={examples} onSelect={openExample} onHover={this.previewExample} />
        )}
      </div>
    );

    if (!strict) return this.wrap(content);

    return <React.StrictMode>{this.wrap(content)}</React.StrictMode>;
  }
}
