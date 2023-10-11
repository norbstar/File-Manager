import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

import { KeyValuePair } from "../models/data.model";

@Injectable()
export class HttpService {
    constructor(private httpClient: HttpClient) { }

    getRaw(url: string): Observable<any> {
        return this.httpClient.get(url, {responseType: 'text'});
    }

    get(url: string, headers: KeyValuePair[]): any {
        return this.http('GET', url, null, headers);
    }

    put(url: string, body: string, headers: KeyValuePair[]): any {
        return this.http('PUT', url, body, headers);
    }

    patch(url: string, body: string, headers: KeyValuePair[]): any {
        return this.http('PATCH', url, body, headers);
    }

    post(url: string, body: string, headers: KeyValuePair[]): any {
        return this.http('POST', url, body, headers);
    }

    http(method: string, url: string, body: string, headers: KeyValuePair[]): any {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();           
            xhr.open(method, url, true);
            
            if ((headers !== undefined) && (headers !== null)) {
                headers.forEach((header: KeyValuePair) => { xhr.setRequestHeader(header.key, header.value); });
            }

            if (body !== null) {
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify(body));
            } else {
                xhr.send();
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState != 4) return;

                if (xhr.status === 200) {
                    if (xhr.response.length > 0) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        resolve({});
                    }
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        description: xhr.response
                    })
                }
            }
        });
    }
}