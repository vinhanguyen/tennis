import { Point } from "./point";

type ControlsProps = {
  point: Point;
  onPoint: (winner: 1|2) => void;
  onUndo: () => void;
  onTiebreak: () => void;
  onToggleServe: () => void;
  onReset: () => void;
};

export default function Controls({
  point: {tiebreak, games, points},
  onPoint,
  onUndo,
  onTiebreak,
  onToggleServe,
  onReset,
}: ControlsProps) {
  const gamesPlayed = games.reduce((sum, g) => sum + g, 0);
  const pointsPlayed = points.reduce((sum, p) => sum + p, 0);
  const newGame = pointsPlayed === 0;
  const newMatch = newGame && gamesPlayed === 0;

  return (
    <footer>
      <button onClick={() => onPoint(1)}>🟥</button>
      <button onClick={onUndo}>↩</button>
      <button onClick={() => onPoint(2)}>🟦</button>
      <button disabled={tiebreak || !newGame} onClick={onTiebreak}>Play Tiebreak</button>
      <button disabled={!newMatch || tiebreak} onClick={onToggleServe}>Toggle Serve</button>
      <button onClick={onReset}>Reset</button>
    </footer>
  );
}
