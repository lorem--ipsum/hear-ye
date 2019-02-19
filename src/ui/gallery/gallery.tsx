import * as React from 'react';

import { GalleryItem } from '../gallery-item/gallery-item';

export interface GalleryProps extends React.Props<any> {

}

export interface GalleryState {

}

export class Gallery extends React.Component<GalleryProps, GalleryState> {
  static examples: JSX.Element[] = [];

  static add(example: JSX.Element) {
    Gallery.examples.push(example);
  }

  render() {
    const examples = Gallery.examples;

    return <div className="hear-ye-gallery">
      {examples.map((e, i) => React.cloneElement(e, {key: i}))}
    </div>;
  }
}
