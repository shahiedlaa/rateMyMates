export interface Gameweek {
  team_id: string,
  weeksArray: weeks[]
};

interface weeks {
  week: number,
  players: player[]
};

interface player {
  name: string,
  rating: number
};

