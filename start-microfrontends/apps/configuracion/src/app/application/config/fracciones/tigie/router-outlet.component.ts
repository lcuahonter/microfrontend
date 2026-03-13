import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-router-outlet',
    template: '<router-outlet></router-outlet>',
    standalone: true,
    imports: [RouterOutlet]
})
export class RouterOutletComponent {
}