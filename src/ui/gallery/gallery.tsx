import * as React from 'react';

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
  selectedExample?: string;

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
      selectedExample: Gallery.examples[0].id
    };
  }

  selectItem = (item: Example) => {
    this.setState({
      selectedExample: item.id
    });
  }

  render() {
    const { selectedExample } = this.state;

    const examples = Gallery.examples;

    return <div className="hy-gallery">
      <SideBar examples={examples} onClick={this.selectItem}/>
      <div className="main">
        {selectedExample
          ? examples.find(e => e.id === selectedExample).component
          : null
        }
      </div>
    </div>;
  }
}
