export interface League {
  leagueId: number;
  leagueName: string;
}

export interface Team {
  teamId: number;
  teamName: string;
  leagueId: number;
}
