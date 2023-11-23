import { Fragment } from "react";
import { POINT_NAMES, Point } from "./point";

const BALL = window.navigator.userAgent.match(/Mac/i) ? '🎾' : '●';

type ScoreboardProps = {
  point: Point,
};

export default function Scoreboard({point}: ScoreboardProps) {
  const {
    tiebreak,
    p1Serve,
    games: [p1Games, p2Games],
    points: [p1, p2],
    sets,
  } = point;

  let mappedPoints;

  if (tiebreak) {
    mappedPoints = [p1, p2].map(p => p.toString());
  } else if (p1 + p2 < 6) {
    mappedPoints = [p1, p2].map(p => POINT_NAMES[p]);
  } else if (p1 > p2) {
    mappedPoints = ['Ad', ''];
  } else if (p1 < p2) {
    mappedPoints = ['', 'Ad'];
  } else {
    mappedPoints = ['40', '40'];
  }

  const [p1Points, p2Points] = mappedPoints;

  return (
    <section>
      <div>🟥</div>
      <div>🟦</div>
      <div>{p1Serve && BALL}</div>
      <div>{!p1Serve && BALL}</div>
      {sets.map(([g1, g2], i) => (
        <Fragment key={i}>
          <div>{g1}</div>
          <div>{g2}</div>
        </Fragment>
      ))}
      <div>{p1Games}</div>
      <div>{p2Games}</div>
      <div>{p1Points}</div>
      <div>{p2Points}</div>
    </section>
  );
}
