import { Component, NgZone } from '@angular/core';
import { akitaDevtools } from '@datorama/akita';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vucem-3.0-frontend';

  constructor(
    private ngZone: NgZone,
  ){
    akitaDevtools(ngZone, {});
  }
}
