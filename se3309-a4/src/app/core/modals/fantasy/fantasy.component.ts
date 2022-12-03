import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DataService } from "../../services/data.service";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-fantasy',
  templateUrl: './fantasy.component.html',
  styleUrls: ['./fantasy.component.scss']
})
export class FantasyComponent implements OnInit {

  helper = new JwtHelperService();
  user: any = this.helper.decodeToken(localStorage.getItem('token') || undefined);

  allPlayers: { id: number, name: string, wins: number, losses: number }[] = [];
  fantasyRoster: { id: number, name: string, wins: number, losses: number }[] = [];
  userTeams: {team_name: string, game_name: string}[] = [];
  selectedTeam: {team_name: string, game_name: string} | null = null;
  games: {name: string}[] = [];

  createForm: boolean = false;
  playerFilter: string | null = null;

  constructor(private dataService: DataService, public activeModal: NgbActiveModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.dataService.getPlayers().subscribe(res => {
      this.allPlayers = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      alert(error);
    });

    this.dataService.searchFantasyTeam(this.user.user_id).subscribe(res => {
      this.userTeams = res;
      this.spinner.hide();
      if (this.userTeams?.length) {
        this.selectTeam(this.userTeams[0].team_name);
      }
    }, error => {
      this.spinner.hide();
      alert(error);
    });

    this.dataService.getGames().subscribe(res => {
      this.games = res;
    });
  }

  getFilteredPlayers(): any[] {
    return this.allPlayers.filter(player => {
      return player.name.toLowerCase().includes(this.playerFilter?.toLowerCase() || '');
    });
  }

  selectTeam(team_name: string): void {
    this.spinner.show();
    this.selectedTeam = this.userTeams[this.userTeams.findIndex(t => t.team_name === team_name)];
    this.dataService.getTeamPlayers(team_name).subscribe(players => {
      this.fantasyRoster = players;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      alert(error);
    });
  }

  createNewTeam(event: any, team_name: string, game_name: string): void {
    event.preventDefault();
    if (!team_name) return;
    this.createForm = false;
    this.userTeams.push({team_name: team_name, game_name: game_name});
    this.selectedTeam = this.userTeams[this.userTeams.length - 1];
    this.fantasyRoster = [];
  }

  selectPlayer(player: { id: number, name: string, wins: number, losses: number }): void {
    let index = this.fantasyRoster.findIndex(p => p.id === player.id);
    index === -1 ? this.fantasyRoster.push(player) : this.fantasyRoster.splice(index, 1);
  }

  isOnTeam(player: { id: number, name: string, wins: number, losses: number }): boolean {
    return this.fantasyRoster.findIndex(p => p.id === player.id) !== -1;
  }

  saveTeam(): void {
    if (this.selectedTeam) {
      this.spinner.show();
      this.dataService.saveTeam(this.selectedTeam.team_name, this.selectedTeam.game_name, null, this.user.user_id, this.fantasyRoster.map(player => player.id)).subscribe(res => {
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        alert(error);
      });
    }

    this.close();
  }

  close(): void {
    this.activeModal.close();
  }

}
