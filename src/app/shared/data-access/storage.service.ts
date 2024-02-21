import { Inject, Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => {
    return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
  }
});

@Injectable({
    providedIn: 'root'
})
export class StorageService {
  
  private storage = inject(BROWSER_STORAGE);

  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}