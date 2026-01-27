import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiMap } from './api-map';
import { Logger } from '../logger/logger.service';
import { HttpHeaders } from '@angular/common/http';

const log = new Logger('ApiHandlerService');
@Injectable({
  providedIn: 'root'
})

export class ApiHandlerService {

  constructor(private httpClient: HttpClient) { }
  /**
   * This function is to call apis on the basis of below parameters
   * @param topic api mapping key e.g. login, register
   * @param method is the HTTP verbs e.g. post | get | put | delete ...
   * @param query any query string to api call
   * @param params any parameters to api call
   * @param data is the payload data to be passed
   */
  apiHandler(topic: string, method: string, query: any = {}, params: any = {}, data: any = {}, headers: any = {}   ): Observable<any> {
    method = method.toLocaleLowerCase();
    const url: string = this.getUrls(topic, query, params);
    // log.debug(topic, method, query, params, data, url);
    let resp;
    const httpOptions = {
  headers: new HttpHeaders(headers)
};
    switch (method) {
      case 'get':
        resp = this.httpClient.get<Observable<any>>(url,httpOptions);
        break;
      case 'post':
        resp = this.httpClient.post<Observable<any>>(url, data,httpOptions);
        break;
      case 'delete':
        resp = this.httpClient.delete<Observable<any>>(url, data,
        );
        break;
      case 'put':
        resp = this.httpClient.put<Observable<any>>(url, data,httpOptions);
        break;
    }
    return resp;
  }

  getUrls(topic, query, params): string {
    try {
      let url = apiMap[topic];
      if (!url)
        return '';
      return `${url}`; // convert to string;
    } catch (error) {
      log.debug(error);
      return '';
    }
  }
}
