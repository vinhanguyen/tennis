import { useEffect, useState } from "react";
import { Point } from "./point";
import Score from "./Score";
import Scoreboard from "./Scoreboard";
import Controls from "./Controls";
import { addPoint, deleteAllPoints, deleteLastPoint, getLastPoint } from "./idb";

const initialState: Point = {
  points: [0, 0],
  games: [0, 0],
  p1Serve: true,
  tiebreak: false,
  p1StartTiebreak: false,
};

export default function App() {
  const [current, setCurrent] = useState(initialState);
  
  useEffect(() => {
    (async () => {
      const point = await getLastPoint();
      setCurrent(point || initialState);
    })();
  }, []);
  
  async function handlePoint(winner: 1|2) {
    let nextPoints = [...current.points];
    if (winner === 1) {
      nextPoints[0] += 1;
    } else {
      nextPoints[1] += 1;
    }

    let nextGames = [...current.games];
    let p1ServeNext = current.p1Serve;
    let tiebreakNext = current.tiebreak;
    const [p1, p2] = nextPoints;
    if (current.tiebreak) {
      if (p1 >= 7 && p1 - p2 >= 2) {
        nextGames[0] += 1;
        nextPoints = [0, 0];
        p1ServeNext = !current.p1StartTiebreak;
        tiebreakNext = false;
      } else if (p2 >= 7 && p2 - p1 >= 2) {
        nextGames[1] += 1;
        nextPoints = [0, 0];
        p1ServeNext = !current.p1StartTiebreak;
        tiebreakNext = false;
      } else if ((p1 + p2) % 2 !== 0) {
        p1ServeNext = !current.p1Serve;
      }
    } else {
      if (p1 >= 4 && p1 - p2 >= 2) {
        nextGames[0] += 1;
        nextPoints = [0, 0];
        p1ServeNext = !current.p1Serve;
      } else if (p2 >= 4 && p2 - p1 >= 2) {
        nextGames[1] += 1;
        nextPoints = [0, 0];
        p1ServeNext = !current.p1Serve;
      }
    }

    const nextPoint = {
      ...current,
      points: nextPoints,
      games: nextGames,
      p1Serve: p1ServeNext,
      tiebreak: tiebreakNext,
    };

    await addPoint(nextPoint);

    setCurrent(nextPoint);
  }

  async function handleUndo() {
    await deleteLastPoint();

    const point = await getLastPoint();
    
    setCurrent(point || initialState);
  }

  async function handleTiebreak() {
    const nextPoint = {
      ...current,
      tiebreak: true,
      p1StartTiebreak: current.p1Serve,
    };

    await addPoint(nextPoint);

    setCurrent(nextPoint);
  }

  async function handleToggleServe() {
    const nextPoint = {
      ...current,
      p1Serve: !current.p1Serve,
    };

    await addPoint(nextPoint);

    setCurrent(nextPoint);
  }

  async function handleReset() {
    if (!confirm('Reset?')) {
      return;
    }
    
    await deleteAllPoints();

    setCurrent(initialState);
  }

  return (
    <>
      <Score point={current} />
      <Scoreboard point={current} />
      <Controls
        point={current}
        onPoint={handlePoint}
        onUndo={handleUndo}
        onTiebreak={handleTiebreak}
        onToggleServe={handleToggleServe}
        onReset={handleReset}
      />
    </>
  );
}
