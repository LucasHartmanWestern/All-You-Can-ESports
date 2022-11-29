import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, throwError } from "rxjs";
import { Constants } from "../constants/constants";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  httpHeaders = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || 'N/A'
  });

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) {
  }

  getTeams(): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.credentials}/guest`, {headers: this.httpHeaders}).pipe(
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
