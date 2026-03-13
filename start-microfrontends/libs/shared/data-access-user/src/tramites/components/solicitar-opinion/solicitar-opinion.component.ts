
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CapturarSolictudOpinion130Component } from '../capturar-solictud-opinion-130/capturar-solictud-opinion-130.component';
import { CapturarSolictudOpinionComponent } from '../capturar-solictud-opinion/capturar-solictud-opinion.component';
import { CapturarSolictudOpinionComponent801 } from '../capturar-solictud-opinion-801/capturar-solictud-opinion-801.component';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '../../../core/estados/consulta.store';
import { RegistrarOpinionComponent } from '../registrar-opinion/registrar-opinion.component';

@Component({
  selector: 'app-solicitar-opinion',
  standalone: true,
  imports: [CommonModule, CapturarSolictudOpinionComponent, RegistrarOpinionComponent, CapturarSolictudOpinionComponent801, CapturarSolictudOpinion130Component],
  templateUrl: './solicitar-opinion.component.html',
  styleUrl: './solicitar-opinion.component.scss',
})
export class SolicitarOpinionComponent implements OnInit {
  /**
  * Índice de la pestaña seleccionada
 */
  indiceOpinion: number = 1;

  /**   * Número de trámite
   */
  @Input() tramite: number = 0;

  /**   * Identificador de la solicitud
   */
  @Input() idSolicitud!: string;

  /**   * Número de folio del trámite
   */
  @Input() numFolioTramite!: string;

  /**   * Estado de consultaio para guardar datos
   */
  @Input() guardarDatos!: ConsultaioState;

  /**   * Indica si la pestaña es requerida
   */
  public tabRequired: boolean = true;

  
  @Output() triggerSubTabs = new EventEmitter<boolean>();
  
  /**
    * Método para seleccionar la pestaña
    * @param i indica el número de la pestaña seleccionada
    */
  seleccionaTab(i: number): void {
    this.indiceOpinion = i;
  }

  /**   * Método de inicialización del componente.
   */
  ngOnInit(): void {
      if(this.tramite === 80101 || this.tramite === 80102 || this.tramite === 80103 || this.tramite === 80104 || this.tramite === 130113){
        this.tabRequired = false;
      }
  }

  emitSubTabs(event: boolean): void {
    this.triggerSubTabs.emit(event);
  } 
}
