import { GalleryItem } from './gallery-item';

export class Gallery {
  static examples: GalleryItem[];

  static add(example: GalleryItem) {
    this.examples.push(example);
  }
}
