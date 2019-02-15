import * as React from 'react';

export interface GalleryItemProps extends React.ComponentProps<any> {

}

export interface GalleryItemState {

}

export class GalleryItem extends React.Component<GalleryItemProps, GalleryItemState> {
  constructor(props: GalleryItemProps, context: any) {
    super(props, context);

    this.state = {};
  }

  render() {
    return <div/>;
  }
}
