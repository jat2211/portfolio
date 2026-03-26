export interface ImageVariant {
  url: string;
  width: number;
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  jpg?: ImageVariant[];
  webp?: ImageVariant[];
  avif?: ImageVariant[];
  /** Intrinsic dimensions when known (e.g. picsum); used for frame aspect in gallery. */
  width?: number;
  height?: number;
}
