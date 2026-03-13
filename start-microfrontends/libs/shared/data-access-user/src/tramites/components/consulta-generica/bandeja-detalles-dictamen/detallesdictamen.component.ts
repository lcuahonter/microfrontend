import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DictamenesComponent } from "../bandeja-dictamenes/dictamenes.component";

@Component({
  selector: 'lib-detallesdictamen',
  standalone: true,
  imports: [CommonModule, DictamenesComponent],
  templateUrl: './detallesdictamen.component.html',
  styleUrl: './detallesdictamen.component.scss',
})
export class DetallesdictamenComponent {  
  /**
   * Índice de la pestaña seleccionada
   */
  indice: number = 1;
  
  /**
   * Método para seleccionar la pestaña
   * @param i indica el número de la pestaña seleccionada
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}