import * as React from 'react';

import { StateRouter as Router, Route } from '@implydata/caladan';

import { SideBar } from '../side-bar/side-bar';
import { ExampleSummary } from '../example-summary/example-summary';
import { ErrorOverlay } from '../error-overlay/error-overlay';

const socket = require('webpack-dev-server/client/socket.js');
const ansiRegex = require('ansi-regex/index.js')();

import './gallery.scss';

export type Example = {
  label: string;
  path?: string[];
  examples?: Example[];
  component?: JSX.Element;
}

export interface GalleryState {
  errors?: string[];
}

export class Gallery extends React.Component<{}, GalleryState> {
  static examples: Example[] = [];

  static add(example: {component: JSX.Element; path: string[]}) {
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
            component: example.component
          });
          break;

        } else {
          examples.push({
            label: _p,
            examples: [] as Example[]
          });

          examples = examples[examples.length - 1].examples;
        }
      }

      _p = p.shift();
    }
  }

  private mounted: boolean;

  constructor(props: {}, context: any) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;

    socket('http://localhost:1234/sockjs-node', {
      errors: (_errors: string[]) => {
        if (!this.mounted) return;
        this.setState({
          errors: _errors.map(str => str.replace(ansiRegex, ''))
        });
      },
      ok: () => {
        if (!this.mounted) return;
        this.setState({
          errors: null
        });
      },
      close: () => {}
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  selectItem = (item: Example) => {
    const url = item.path.map(encodeURI).join('/');

    window.history.pushState(null, '', '/' + url);
  }

  getExampleForId(id: string): Example {
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

  render() {
    const { errors } = this.state;

    const examples = Gallery.examples;

    return <div className="hy-gallery">
      <Router>
        <Route fragment="">
          <>
            <SideBar examples={examples} onClick={this.selectItem}/>
            <div className="main">
              Nothing to show, move along.
            </div>
          </>
        </Route>
        <Route fragment=":$exampleId" renderer={(v, redirect) => {

          const example = this.getExampleForId(v.exampleId);

          if (!example) {
            console.log('Could not find example with id ' + v.exampleId);
            redirect('');
            return null;
          }

          return <>
            {<SideBar examples={examples} onClick={this.selectItem} selectedExample={example}/>}
            <div className="main">
              <ExampleSummary example={example}/>
              {example.component}
            </div>
          </>;
        }}/>
      </Router>
      {
        errors
        ? <ErrorOverlay errors={errors}/>
        : null
      }
    </div>;
  }
}
