import { POINT_NAMES, Point } from "./point";

type ScoreProps = {
  point: Point,
};

export default function Score({point}: ScoreProps) {
  const {tiebreak, p1Serve, points: [p1, p2]} = point;

  let score;

  if (tiebreak) {
    score = p1Serve ? [p1, p2].join(' - ') : [p2, p1].join(' - ');
  } else if (p1 + p2 < 6) {
    const mappedPoints = [p1, p2].map(p => POINT_NAMES[p]);
    score = p1Serve ? mappedPoints.join(' - ') : mappedPoints.reverse().join(' - ');
  } else if (p1 > p2) {
    score = p1Serve ? 'Ad In' : 'Ad Out';
  } else if (p2 > p1) {
    score = !p1Serve ? 'Ad In' : 'Ad Out';
  } else {
    score = 'Deuce';
  }
  
  return <h1>{score}</h1>;
}
