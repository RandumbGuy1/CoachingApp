import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({ providedIn: 'root' })
export class ForgotPasswordModalService {
  private visible = new BehaviorSubject<boolean>(false);
  readonly visible$ = this.visible.asObservable();

  open() { this.visible.next(true); }
  close() { this.visible.next(false); }
}