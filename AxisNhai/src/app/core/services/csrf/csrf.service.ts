import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import { Url } from '../url';
import 'rxjs/add/operator/map';
/**
 * A service which makes a GET request to get a nonce for the write access to the server.
 * This is to be used for POST, PUT and DELETE requests.
 */
@Injectable()
export class CsrfService {
    private _csrfUrl = `${Url.readXmlUrl}`;

    csrfHeaderName = 'CSRF_NONCE';
    csrfNonce:string=null;
    constructor(private http: HttpClient) { }

    getNonce(): Observable<string> {
        return this.http.get(this._csrfUrl, { responseType: 'json'})
            .map((response: any) => response.items && response.items[0].attributes.nonce);
    }
}
