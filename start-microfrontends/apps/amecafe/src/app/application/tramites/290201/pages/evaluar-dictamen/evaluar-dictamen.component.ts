import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluar-dictamen',
  templateUrl: './evaluar-dictamen.component.html',
  styleUrl: './evaluar-dictamen.component.scss'
})
export class EvaluarDictamenComponent {
  /**
   * Índice de la pestaña seleccionada
   */
  indice: number = 1;
  /**
   * Variable para firmar
   */
  firmar: boolean = false;

  /**
   * Método para seleccionar la pestaña
   * @param i indica el número de la pestaña seleccionada
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /*
   * Método que se ejecuta para guardar y firmar
  */
  guardarFirmar(): void { 
    this.firmar = true;
  }

  

}
