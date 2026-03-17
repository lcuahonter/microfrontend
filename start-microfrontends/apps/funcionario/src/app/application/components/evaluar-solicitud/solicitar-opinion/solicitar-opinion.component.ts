import { CapturarSolictudOpinionComponent } from '../capturar-solictud-opinion/capturar-solictud-opinion.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegistrarOpinionComponent } from '../registrar-opinion/registrar-opinion.component';

@Component({
  selector: 'app-solicitar-opinion',
  standalone: true,
  imports: [CommonModule, CapturarSolictudOpinionComponent, RegistrarOpinionComponent],
  templateUrl: './solicitar-opinion.component.html',
  styleUrl: './solicitar-opinion.component.scss',
})
export class SolicitarOpinionComponent {
   /**
   * Índice de la pestaña seleccionada
  */
   indiceOpinion: number = 1;

  /**
  /**
    * Método para seleccionar la pestaña
    * @param i indica el número de la pestaña seleccionada
    */
  seleccionaTab(i: number): void {
    this.indiceOpinion = i;
  }
}
