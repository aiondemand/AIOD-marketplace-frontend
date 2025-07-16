import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerVisibilitySubject = new BehaviorSubject<boolean>(false);
  private spinnerMessageSubject = new BehaviorSubject<string>('');

  public visibility$: Observable<boolean> =
    this.spinnerVisibilitySubject.asObservable();
  public message$: Observable<string> =
    this.spinnerMessageSubject.asObservable();

  show(message = ''): void {
    this.spinnerMessageSubject.next(message);
    this.spinnerVisibilitySubject.next(true);
  }

  hide(): void {
    this.spinnerVisibilitySubject.next(false);
  }

  updateMessage(message: string): void {
    this.spinnerMessageSubject.next(message);
  }
}
