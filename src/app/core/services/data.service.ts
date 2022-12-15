import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Response } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class DataService<T> {
  constructor(private http: HttpClient) {}

  get(url: string): Observable<Response<T[]>> {
    return this.http
      .get(url)
      .pipe(catchError(this.handleError))
      .pipe(map((res) => res as Response<T[]>));
  }

  create(url: string, body: T): Observable<Response<T[]>> {
    return this.http
      .post(url, body)
      .pipe(map((res) => res as Response<T[]>))
      .pipe(catchError(this.handleError));
  }

  update(url: string, body: T): Observable<Response<T[]>> {
    return this.http
      .put(url, body)
      .pipe(map((res) => res as Response<T[]>))
      .pipe(catchError(this.handleError));
  }

  delete(url: string): Observable<Response<T[]>> {
    return this.http
      .delete(url)
      .pipe(map((res) => res as Response<T[]>))
      .pipe(catchError(this.handleError));
  }

  handleError(error: any) {
    debugger;

    let response: any;
    if (error.error != null) {
      let err: any = error.error;
      response = {
        results: err.results,
        status: err.status,
        messages: err.messages,
      };
    } else response = { status: 500, messages: [error.message as string] };
    return of(response);
  }
}
