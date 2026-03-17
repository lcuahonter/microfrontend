import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {TituloComponent } from '@ng-mf/data-access-user';
/**
 * Componente `TercerosRelacionadosFabricanteComponent`.
 * 
 * Este componente es responsable de gestionar la vista y la lógica relacionada 
 * con los terceros relacionados con el fabricante en el contexto de un trámite específico.
 * 
 * @selector `app-terceros-relacionados-fabricante`
 * @standalone Este componente es independiente y puede ser utilizado sin necesidad de un módulo.
 * @imports 
 * - `CommonModule`: Proporciona directivas y funcionalidades comunes de Angular.
 * - `TituloComponent`: Componente personalizado utilizado dentro de este componente.
 * @templateUrl Ruta al archivo de plantilla HTML asociado a este componente.
 * @styleUrl Ruta al archivo de estilos SCSS asociado a este componente.
 */
@Component({
  selector: 'app-terceros-relacionados-fabricante',
  standalone: true,
  imports: [CommonModule,TituloComponent],
  templateUrl: './terceros-relacionados-fabricante.component.html',
  styleUrl: './terceros-relacionados-fabricante.component.scss',
})
export class TercerosRelacionadosFabricanteComponent {
   validarContenedor(): boolean {
    return true;
  }
}
