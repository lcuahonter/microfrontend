import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  // Generic signal to store the latest saved data (optional)
  private _data = signal<Record<string, any>>({});

  /** Save a value in sessionStorage */
  set<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      this._data.update((store) => ({ ...store, [key]: value }));
    } catch (err) {
      console.error(`Error saving to sessionStorage key "${key}":`, err);
    }
  }

  /** Retrieve a value from sessionStorage */
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (err) {
      console.error(`Error reading sessionStorage key "${key}":`, err);
      return null;
    }
  }

  /** Remove a single key */
  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
      this._data.update((store) => {
        const newStore = { ...store };
        delete newStore[key];
        return newStore;
      });
    } catch (err) {
      console.error(`Error removing sessionStorage key "${key}":`, err);
    }
  }

  /** Clear all session data */
  clear(): void {
    sessionStorage.clear();
    this._data.set({});
  }

  cleanParamsFromSessionStorage(keysToRemove: string[]): void {
    keysToRemove.forEach((key) => {
      this.remove(key);
    });
  }

  /** Optional signal for reactive access */
  get data() {
    return this._data.asReadonly();
  }
}
