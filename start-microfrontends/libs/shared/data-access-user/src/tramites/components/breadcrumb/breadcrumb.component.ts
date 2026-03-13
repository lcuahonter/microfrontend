import { Component } from '@angular/core';
import { InformacionUsuarioComponent } from "../informacion-usuario/informacion-usuario.component";

@Component({
  selector: 'c-breadcrumb',
  standalone: true,
  imports: [InformacionUsuarioComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

}
