import { Component } from '@angular/core';
import { InicioComponent } from '../../components/inicio/inicio.component';

@Component({
  selector: 'app-modificar',
  standalone: true,
  templateUrl: './modificar.component.html',
  imports: [InicioComponent]
})
export class ModificarComponent {}
