import * as React from 'react';

import { StateRouter as Router, Route } from '@implydata/caladan';

import { SideBar } from '../side-bar/side-bar';

import './gallery.scss';

export interface Example {
  component: JSX.Element;
  componentLabel: string;
  exampleLabel?: string;
  id?: string;
}

export interface GalleryProps extends React.Props<any> {

}

export interface GalleryState {

}

export class Gallery extends React.Component<GalleryProps, GalleryState> {
  static examples: Example[] = [];

  static add(example: Example) {
    const { componentLabel, exampleLabel } = example;

    if (!example.id) {

      example.id = componentLabel.toLowerCase().replace(/\s+/g, '_');

      if (exampleLabel) {
        example.id += '-' + exampleLabel.toLowerCase().replace(/\s+/g, '_');
      }
    }

    if (Gallery.examples.find(e => e.id === example.id)) {
      throw new Error('An example with this id already exists: ' + example.id);
    }

    Gallery.examples.push(example);
  }

  constructor(props: GalleryProps, context: any) {
    super(props, context);

    this.state = {
    };
  }

  selectItem = (item: Example) => {
    window.history.pushState(null, '', item.id);
  }

  render() {
    const {  } = this.state;

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
        <Route fragment=":exampleId" renderer={(v, redirect) => {

          const example = examples.find(e => e.id === v.exampleId);
          if (!example) redirect('');

          return <>
            <SideBar examples={examples} onClick={this.selectItem} selectedExample={example}/>
            <div className="main">
              {example.component}
            </div>
          </>;
        }}/>
      </Router>
    </div>;
  }
}
