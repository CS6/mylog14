import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  /**
   * @param  key repository key for Capacitor Storage Plugin
   * @param  defaultData default return value if data does not exist
   * @returns Observable<T>
   */
  getData<T>(key: string, defaultData: T): Observable<T> {
    return defer(() => Storage.get({ key })).pipe(
      map(raw => raw.value),
      map(value => (value) ? JSON.parse(value) : defaultData),
    );
  }

  /**
   * @param  data JSON-stringifiable data
   * @param  key repository key for Capacitor Storage Plugin
   * @returns Observable<T>
   */
  setData<T>(data: T, key: string): Observable<T> {
    return defer(() =>
      Storage.set({
        key,
        value: JSON.stringify(data),
      })
    ).pipe(
      map(() => data),
    );
  }
}