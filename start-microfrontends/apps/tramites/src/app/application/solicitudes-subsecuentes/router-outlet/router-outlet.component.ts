import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-router-outlet',
  standalone: true,
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet]
})
export class RouterOutletComponent {
}