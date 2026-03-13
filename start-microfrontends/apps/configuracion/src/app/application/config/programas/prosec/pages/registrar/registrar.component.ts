import { Component } from '@angular/core';
import { InicioComponent } from '../../components/inicio/inicio.component';

@Component({
  selector: 'app-registrar',
  standalone: true,
  templateUrl: './registrar.component.html',
  imports: [InicioComponent]
})
export class RegistrarComponent {}
