import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {Search} from "./search";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private readonly http: HttpClient) {
  }

  getSearchResults(search: string): Observable<Search> {
    return this.http.get<Search>(`${environment.apiUrl}/search/titles/results/?terms=${search}&format=json`)
  }
}
