import { Component, OnInit } from '@angular/core';
import { DataService } from "../../core/services/data.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private dataService: DataService) { }

  games: { game_name: string }[] = [];
  orgs: { org_name: string, team_count: number }[] = [];
  matches: { match_date: string, team1_name: string, team2_name: string, location: string, tournament: string | null, winner: number }[] = [];
  teams: { name: string, wins: number, losses: number, organization: string }[] = [];

  ngOnInit(): void {
    this.dataService.newSearch$.subscribe((res: any) => {
      this.games = [];
      this.orgs = [];
      this.matches = [];
      this.teams = [];

      if (res?.search?.type === 'org') this.dataService.getOrgs().subscribe(orgs => this.orgs = orgs);
      if (res?.search?.type === 'game') this.dataService.getGames().subscribe(games => this.games = games);
      if (res?.search?.type === 'match') this.dataService.getMatches(res?.search?.criteria?.match_date, res?.search?.criteria?.team_name, res?.search?.criteria?.location, res?.search?.criteria?.tournament)
        .subscribe(matches => this.matches = matches);
      if (res?.search?.type === 'team') this.dataService.getTeams(res?.search?.criteria?.team_name, res?.search?.criteria?.game_name, res?.search?.criteria?.org_name)
        .subscribe(teams => this.teams = teams);
    });
  }

  setDetails(type: string, details: any): void {
    this.dataService.details$.next({type: type, details: details});
  }

  getTeamsByGame(gameName: string): void {
    this.games = [];
    this.dataService.getTeams('', gameName, '')
      .subscribe(teams => this.teams = teams);
  }
}
