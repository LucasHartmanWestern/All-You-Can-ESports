import { Component, OnInit } from '@angular/core';
import { DataService } from "../../../services/data.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.newSearch$.next({search: {type: 'org'}});
  }

  setSearch(searchType: any) {
    if (searchType === 'org' || searchType === 'game') {
      this.dataService.newSearch$.next({search: {type: searchType}});
    }
  }

  searchTeam(event: any, teamName: string, orgName: string, gameName: string): void {
    event.preventDefault();
    this.dataService.newSearch$.next({search: {type: 'team', criteria: {
          team_name: teamName || null,
          org_name: orgName || null,
          game_name: gameName || null
        }
      }
    });
  }

  searchMatch(event: any, match: string, teamName: string, location: string, tournament: string): void {
    event.preventDefault();
    this.dataService.newSearch$.next({search: {type: 'match', criteria: {
          match_date: match || null,
          team_mame: teamName || null,
          location: location || null,
          tournament: tournament || null
        }
      }
    });
  }
}
