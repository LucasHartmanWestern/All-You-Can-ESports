import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject, throwError } from "rxjs";
import { Constants } from "../constants/constants";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  newSearch$: Subject <{ search: any }> = new Subject<{ search: any }>();
  details$: Subject <{ type: string, details: any } | null> = new Subject<{ type: string, details: any } | null>();

  httpHeaders = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || 'N/A'
  });

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
  }

  getOrgs(): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.default}/orgs`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getGames(): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.default}/games`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getTeams(team_name: string, game_name: string, org_name: string): Observable<any> {
    let params = `${team_name ? 'team_name=' + team_name : ''}${team_name && (game_name || org_name) ? '&' : ''}${game_name ? 'game_name=' + game_name : ''}${game_name && org_name ? '&' : ''}${org_name ? 'org_name=' + org_name : ''}`;
    console.log(params);
    return this.http.get<any>(`${Constants.apiPaths.default}/team?${params}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  getMatches(match_date: string, team_name: string, location: string, tournament: string): Observable<any> {
    let params = `${match_date ? 'match_date=' + match_date : ''}${match_date && (team_name || location || tournament) ? '&' : ''}${team_name ? 'team_name=' + team_name : ''}${team_name && (location || tournament) ? '&' : ''}${location ? 'location=' + location : ''}${location && tournament ? '&' : ''}${tournament ? 'tournament=' + tournament : ''}`;
    return this.http.get<any>(`${Constants.apiPaths.default}/match?${params}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }


  private handleError(err: HttpErrorResponse) {


    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(err.error);
  }
}
