import { inject, Injectable, Signal, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, tap } from 'rxjs';

const displayNameMap = new Map([
  [Breakpoints.XSmall, 'XSmall'],
  [Breakpoints.Small, 'Small'],
  [Breakpoints.Medium, 'Medium'],
  [Breakpoints.Large, 'Large'],
  [Breakpoints.XLarge, 'XLarge'],
]);

@Injectable({
  providedIn: 'root',
})
export class BreakpointObserverService {
  private readonly _breakpointObserver = inject(BreakpointObserver);

  public get isMobile(): Signal<boolean> {
    return this._isMobile.asReadonly();
  }

  private _isMobile = signal<boolean>(false);
  private _currentScreenSize: string;

  public breakpointsListener(): Observable<string> {
    return this._breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(
        map((result) => {
          const activeBreakpoints = Object.keys(result.breakpoints).filter(
            (key) => result.breakpoints[key],
          );
          return displayNameMap.get(activeBreakpoints[0]) ?? 'Unknown';
        }),
        tap((screenSize: string) => (this._currentScreenSize = screenSize)),
        tap((screenSize: string) => this._setIsMobile(screenSize)),
      );
  }

  private _setIsMobile(breakpoint: string): void {
    this._isMobile.set(breakpoint === 'XSmall' || breakpoint === 'Small');
  }
}
