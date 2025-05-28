import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item!);
    } catch {
      return item;
    }
  }

  setItem(key: string, value: any): void {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

}