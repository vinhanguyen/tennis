export const POINT_NAMES = ['0', '15', '30', '40'];

export interface Point {
  points: number[];
  games: number[];
  sets: number[][];
  p1Serve: boolean;
  tiebreak: boolean;
  p1StartTiebreak: boolean;
}
