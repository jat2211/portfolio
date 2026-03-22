export interface Photo {
  id: string;
  url: string;
  title: string;
  /** Intrinsic dimensions when known (e.g. picsum); used for frame aspect in gallery. */
  width?: number;
  height?: number;
}
