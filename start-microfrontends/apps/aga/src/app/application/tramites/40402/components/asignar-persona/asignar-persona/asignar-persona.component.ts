import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonaFisicaComponent } from '../persona-fisica/persona-fisica.component';
import { PersonaMoralComponent } from '../persona-moral/persona-moral.component';

/**
 * @component
 * @name AsignarPersonaComponent
 * @description Componente para asignar una persona, ya sea física o moral.
 * Permite alternar entre pestañas para seleccionar el tipo de persona.
 */
@Component({
  selector: 'app-asignar-persona',
  standalone: true,
  imports: [
    CommonModule,
    PersonaFisicaComponent,
    PersonaMoralComponent,
  ],
  templateUrl: './asignar-persona.component.html',
  styleUrl: './asignar-persona.component.css',
})
export class AsignarPersonaComponent {
  /**
   * @property {number} indice
   * @description Índice de la pestaña seleccionada. Por defecto, es 1.
   */
  indice: number = 1;

  /**
   * @method seleccionaTab
   * @description Cambia el índice de la pestaña seleccionada.
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}
