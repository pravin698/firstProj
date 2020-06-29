import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CsrfService } from './services/csrf/csrf.service';
import 'rxjs/add/operator/mergeMap';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
import xml2js from 'xml2js';
import * as _ from 'lodash';   

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected http: HttpClient, protected csrfService: CsrfService) { }
  /**
 * Common request function with basic mapping.
 * @param url Request URL.
 * @param body Body of the request if any
 * @param options An optional extra information object as per the request method.
 * @param method Request method.
 */
  _makeRequest<T>(
    url: string,
    body?: any,
    method: HttpMethod = 'GET',
    options?: {
      skipMap?: boolean;
      responseType?: string;
      headers?: HttpHeaders;
      params?: HttpParams;
      observe?: 'body' | 'events' | 'response';
    }): Observable<T> {

    const http = this.http;
    const mapper = (res) => <T>res;
    let request;

    switch (method) {
      case 'POST': request = http.post(url,body,{headers:options.headers,responseType:'text'});
      // case 'PUT':
      // case 'DELETE':
      //   const requestOptions = {
      //     responseType: options && options.responseType as any || 'json',
      //     headers: options && options.headers || new HttpHeaders(),
      //     params: options && options.params || null,
      //     observe: options && options.observe || 'body'
      //   };
      //   const args = (method === 'DELETE') ? [url, requestOptions] : [url, body, requestOptions];

      //   // if (!this.csrfService.csrfNonce) {
      //   //   request = this.csrfService.getNonce()
      //   //     .mergeMap(nonce => {
      //   //       requestOptions.headers = requestOptions.headers.set(this.csrfService.csrfHeaderName, nonce);
      //   //       this.csrfService.csrfNonce = nonce;
      //   //       return this._getHttpFn(method).apply(http, args);
      //   //     });
      //   // } else {
      //     // requestOptions.headers = requestOptions.headers.set(this.csrfService.csrfHeaderName, this.csrfService.csrfNonce);
      //     request = this._getHttpFn(method).apply(http, args);
      //   // }
        break;
      case 'GET': request = http.get(url,{headers:options.headers,params:options.params,responseType: "text"});
      default:
        request = http.get(url,{headers:options.headers,responseType: "text"});
    }

    return options && options.skipMap ? request : request.map(mapper);
  }

  _getHttpFn(method: HttpMethod) {
    const http = this.http;
    let fn = this.http.post;

    switch (method) {
      case 'POST':
        fn = http.post;
        break;
      case 'PUT':
        fn = http.put;
        break;
      case 'DELETE':
        fn = http.delete;
    }

    return fn;
  } 

// Random APLHANUMERIC string geneartion function
 randomStr() { 
  return Math.random().toString(36).substr(2);
} 

//For Headers
 getHeaders(){
  var headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'must-revalidate, no-cache, no-store',
    'Content-Security-Policy': "default-src 'self'" ,
    'Access-Control-Allow-Methods': 'GET,POST',
    'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Request-Method"
  });
  return headers;
 }
}
