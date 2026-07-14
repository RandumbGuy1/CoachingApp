import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  badge?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items$ = new BehaviorSubject<CartItem[]>([]);

  readonly items$ = this._items$.asObservable();
  readonly count$ = this._items$.pipe(map(items => items.length));
  readonly total$ = this._items$.pipe(map(items => items.reduce((s, i) => s + i.price, 0).toFixed(2)));

  add(item: CartItem): void {
    const current = this._items$.getValue();
    if (!current.find(i => i.id === item.id)) {
      this._items$.next([...current, item]);
    }
  }

  remove(id: string): void {
    this._items$.next(this._items$.getValue().filter(i => i.id !== id));
  }

  isInCart(id: string): boolean {
    return this._items$.getValue().some(i => i.id === id);
  }

  clear(): void {
    this._items$.next([]);
  }
}
