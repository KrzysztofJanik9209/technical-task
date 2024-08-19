import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { BreakpointObserverService } from './shared/services/breakpoint-observer/breakpoint-observer.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public readonly logoSrc = 'assets/images/img.png';

  private readonly _breakpointsObserverService = inject(
    BreakpointObserverService,
  );

  public ngOnInit() {
    this._breakpointsObserverService.breakpointsListener().subscribe();
  }
}
