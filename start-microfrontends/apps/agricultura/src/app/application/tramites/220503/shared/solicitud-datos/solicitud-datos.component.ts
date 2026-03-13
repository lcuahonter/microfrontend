import { AlertComponent, ConsultaioQuery, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Subject,map,takeUntil } from 'rxjs';
import { CONFIGURACION_COLUMNA_SOLICITUD } from '../../enums/sagarpa.enum';
import { Solicitud } from '../../models/solicitud-pantallas.model';
import { TEXTOS } from '../../enums/texto-enum';

/**
 * Componente que representa los datos de la solicitud.
 */
@Component({
  selector: 'app-tab-solicitud-datos',
  standalone: true,
  imports: [ AlertComponent,TablaDinamicaComponent],
  templateUrl: './solicitud-datos.component.html',
  styleUrl: './solicitud-datos.component.scss',
})
/**
 * Componente que representa los datos de la solicitud
 */
export class SolicitudDatosTabComponent {
  /**
   * Indica si el formulario es de solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   * @type {boolean}
   */
  esFormularioSoloLectura:boolean=false;
  /**
   * Obtiene los datos de enumeración y establece valores de TEXTOS
   */
  TEXTOS = TEXTOS;
  /**
   * Controla la visibilidad del panel plegable.
   * El valor predeterminado está establecido en verdadero (ampliado)
   */
  colapsable: boolean = true;
  /**
   * Recibe la lista de solicitudes como datos de fila de la tabla.
   */
  @Input() tablaFilaDatos: Solicitud[] = [];


  configuracionColumnaSolicitud = CONFIGURACION_COLUMNA_SOLICITUD;
constructor(private consultaioQuery: ConsultaioQuery){
     this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState)=>{
          this.esFormularioSoloLectura = seccionState.readonly; 
        })
      )
      .subscribe()
}

  /**
   * Alterna el panel plegable (expandir/contraer)
   */
  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }
 
  
  /** * Evento que emite el identificador de la fila seleccionada al componente padre.
   * Se utiliza para notificar qué solicitud debe ser procesada o visualizada.
   */
  @Output() rowSelected = new EventEmitter<number | string>();

  /**
   * Maneja el evento de selección de una fila en la tabla.
   * @param id El identificador único (ID) de la solicitud seleccionada.
   */
  alClicFila(id: number | string): void {
    this.rowSelected.emit(id);
  }
      
}
