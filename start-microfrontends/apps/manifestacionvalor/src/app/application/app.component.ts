import { Component, NgZone } from '@angular/core';
import { akitaDevtools } from '@datorama/akita';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'manifestacionvalor';

  constructor(
    private ngZone: NgZone,
  ){
    akitaDevtools(ngZone, {});
  }
}
