import * as React from 'react';

export interface GalleryItemProps extends React.ComponentProps<any> {

}

export interface GalleryItemState {

}

export class GalleryItem<S extends GalleryItemState = {}> extends React.Component<GalleryItemProps, S> {
  constructor(props: GalleryItemProps, context: any) {
    super(props, context);

    this.state = {} as any;
  }

  render() {
    return <div/>;
  }
}
