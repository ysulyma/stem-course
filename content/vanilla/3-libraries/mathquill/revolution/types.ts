export interface Settings {
  /** left endpoint */
  a: number;

  /** right endpoint */
  b: number;

  fn: (x: number) => number;

  showGraph: boolean;
  slices: number;
}
