import { POINT_NAMES, Point } from "./point";

type ScoreboardProps = {
  point: Point,
};

export default function Scoreboard({point}: ScoreboardProps) {
  const {
    tiebreak,
    p1Serve,
    games: [p1Games, p2Games],
    points: [p1, p2],
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
    <table>
      <tbody>
        <tr>
          <td>Player 1</td>
          <td>{p1Serve && <span>&#9679;</span>}</td>
          <td>{p1Games}</td>
          <td>{p1Points}</td>
        </tr>
        <tr>
          <td>Player 2</td>
          <td>{!p1Serve && <span>&#9679;</span>}</td>
          <td>{p2Games}</td>
          <td>{p2Points}</td>
        </tr>
      </tbody>
    </table>
  );
}
