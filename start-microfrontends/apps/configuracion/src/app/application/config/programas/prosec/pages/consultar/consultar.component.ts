import { Component } from '@angular/core';
import { InicioComponent } from '../../components/inicio/inicio.component';

@Component({
  selector: 'app-consultar',
  standalone: true,
  templateUrl: './consultar.component.html',
  imports: [InicioComponent]
})
export class ConsultarComponent {}
