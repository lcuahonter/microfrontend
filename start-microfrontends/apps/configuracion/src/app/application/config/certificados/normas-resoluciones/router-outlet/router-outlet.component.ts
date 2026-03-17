import { AppRoutingModule } from "../../../../app-routing.module";
import { Component } from '@angular/core';

@Component({
    selector: 'app-router-outlet',
    standalone: true,
    template: '<router-outlet></router-outlet>',
    imports: [AppRoutingModule]
})
export class RouterOutletComponent {
}