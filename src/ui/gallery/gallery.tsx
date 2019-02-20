import * as React from 'react';

export interface GalleryItem {
  component: JSX.Element;
  name: string;
  path?: string[];
}

export interface GalleryProps extends React.Props<any> {

}

export interface GalleryState {

}

export class Gallery extends React.Component<GalleryProps, GalleryState> {
  static examples: GalleryItem[] = [];

  static add(example: GalleryItem) {
    Gallery.examples.push(example);
  }

  render() {
    const examples = Gallery.examples;

    return <div className="hear-ye-gallery">
      {examples.map((e, i) => React.cloneElement(e.component, {key: e.name}))}
    </div>;
  }
}
