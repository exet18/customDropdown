import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private readonly http: HttpClient) {
  }

  getSearchResults(search: string) {
    this.http.get(`${environment.apiUrl}/search/titles/results/?terms=${search}&format=json`)
  }
}
