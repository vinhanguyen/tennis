import { Point } from "./point";

type FormatProps = {
  point: Point,
};

export default function Format({point}: FormatProps) {
  const {noAd} = point;

  return <h2>{noAd ? '🏴‍☠️' : ''}</h2>;
}
