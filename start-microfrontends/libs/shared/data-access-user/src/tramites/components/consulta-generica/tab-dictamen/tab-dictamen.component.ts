import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictamenesComponent } from '../bandeja-dictamenes/dictamenes.component';

import { ConsultaDetalleDictamenCofepris512516Component } from '../consulta-detalle-dictamen-cofepris-512-516/consulta-detalle-dictamen-cofepris-512-516.component';
import { ConsultaDetalleDictamenCofeprisComponent } from '../consulta-detalle-dictamen-cofepris/consulta-detalle-dictamen-cofepris.component';
import { ConsultaDetalleDictamenComponent } from '../consulta-detalle-dictamen/consulta-detalle-dictamen.component';
import { ConsultaDetalleObservacionDictamenComponent } from '../consulta-detalle-observacion-dictamen/consulta-detalle-observacion-dictamen.component';
import { DetalleDictamenService } from '../../../../core/services/shared/detalleDictamen.service';
import { DictamenDetalleResponse } from '../../../../core/models/shared/dictamen-detalle-response.model';
import { DictamenesResponse } from '../../../../core/models/shared/dictamenes-response.model';
import { ObservacionDetalleResponse } from '../../../../core/models/shared/observacion-detalle-response.model';

import { CategoriaMensaje, Notificacion, NotificacionesComponent } from '../../notificaciones/notificaciones.component';
import { SERIES26030, SERIES26040, SERIES26050, SERIES26051 } from '../../../../core/enums/cofepris-core-enum';
import { ConsultaDetalleDictamenCofepris26030Component } from '../consulta-detalle-dictamen-cofepris-26030/consulta-detalle-dictamen-cofepris.component';
import { ConsultaDetalleDictamenCofepris401402Component } from '../consulta-detalle-dictamen-cofepris-401-402/consulta-detalle-dictamen-cofepris-401-402.component';
import { ConsultaDetalleDictamenCofepris501511Component } from '../consulta-detalle-dictamen-cofepris-501-511/consulta-detalle-dictamen-cofepris-501-511.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'tab-dictamen',
  standalone: true,
  imports: [CommonModule, DictamenesComponent, ConsultaDetalleDictamenComponent, ConsultaDetalleObservacionDictamenComponent, NotificacionesComponent, ConsultaDetalleDictamenCofeprisComponent, ConsultaDetalleDictamenCofepris512516Component, ConsultaDetalleDictamenCofepris501511Component,
    ConsultaDetalleDictamenCofepris401402Component, ConsultaDetalleDictamenCofepris26030Component
  ],
  templateUrl: './tab-dictamen.component.html',
  styleUrl: './tab-dictamen.component.scss',
})
export class TabDictamenComponent implements OnDestroy{
  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
  */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice de la pestaña seleccionada en la interfaz de usuario.
  */
  indice: number = 1;

  /**
    * @property {DictamenesResponse[]} dictamenes
    * @description Dictamenes de solicitud.
  */
  @Input() dictamenes: DictamenesResponse[] = [];

  @Input() departamento: string='';

  /**
 * @property {boolean} isFechasDetalleDictamenes
 * @description Indica si se deben mostrar las fechas en el detalle de los dictámenes.
 */
  @Input() isFechasDetalleDictamenes!: boolean;

  /**
    * Detalle completo del dictamen seleccionado
  */
  dictamenDetalle!: DictamenDetalleResponse;

  /**
   * ID del dictamen actualmente seleccionada
   */
  idDictamenActual!: string;

  /**
   * ID de la observacion seleccionada
   */
  idObservacionActual!: number;

  /**
    * Detalle completo de observacion del dictamen seleccionado
  */
  observacionDictamen!: ObservacionDetalleResponse;

  /**
   * @property {number} tramite
   * @description Identificador del trámite asociado a las pestañas.
  */
  @Input() tramite: number = 0;

  /**
   * URL de la página actual.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;


  /** Serie de códigos para el grupo 26040 */
  series_260514: number[] = SERIES26051;

  /** Serie de códigos para el grupo 26050 */
  series_26050: number[] = SERIES26050;

  /** Serie de códigos para el grupo 26040 */
  series_26040: number[] = SERIES26040;

  series_26030: number[] = SERIES26030

  FechaFinVigencia: number[] = [260503, 260505];
  /**
   * Constructor del componente
  */
  constructor(
    private detalleDictamenService: DetalleDictamenService

  ) {

  }

  /**
   * Maneja la selección de un dictamen
   * @param id ID del dictamen seleccionado
   */
  onIdDictamenSeleccionado(id: number): void {
    this.idDictamenActual = id.toString();
    this.seleccionaTab(2);
    this.getDetalleDictamen(this.idDictamenActual);
  }

  /**
   * Obtiene el detalle completo de un dictamen
   * @param idDictamen ID del dictamen a consultar
 */
  getDetalleDictamen(idDictamen: string): void {
    this.detalleDictamenService
      .getDetalleDictamen(this.tramite, idDictamen)
      .subscribe({
       next: (data) => {
          if (data.codigo === "00") {
          this.dictamenDetalle = data.datos ?? {} as DictamenDetalleResponse;
          this.seleccionaTab(2);
        }else{
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
          this.seleccionaTab(1);
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: data.error || 'Error detalle dictamen',
            mensaje:
              data.causa ||
              data.mensaje ||
              data.error ||
              'Ocurrió un error al consultar detalle dictamen.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }; 
        }
      },
      error: (error) => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: '',
          mensaje: error?.error?.error || 'Error inesperado en detalle dictamen.',
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
      }
    });
  }

  /**
   * Maneja la selección de una observacion
   * @param id ID de la observacion seleccionada
   */
  onIdObservacionSeleccionado(id: number): void {
    this.idObservacionActual = id;
    this.seleccionaTab(3);
    this.getObservacionDictamen(this.idObservacionActual);
  }

  /**
   * Obtiene el detalle de la observacion
   * @param idDictamen ID del dictamen a consultar
 */
  getObservacionDictamen(observacion: number): void{
    this.detalleDictamenService.getObservacionDictamen(this.tramite, observacion)
    .subscribe({
       next: (data) => {
          if (data.codigo === "00") {
            this.observacionDictamen = data.datos ?? {} as ObservacionDetalleResponse
          this.seleccionaTab(3);
        }else{
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
          this.seleccionaTab(2);
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: data.error || 'Error detalle observación dictamen',
            mensaje:
              data.causa ||
              data.mensaje ||
              data.error ||
              'Ocurrió un error al consultar detalle observación dictamen.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }; 
        }
      },
      error: (error) => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: '',
          mensaje: error?.error?.error || 'Error inesperado en detalle observación dictamen.',
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        };
      }
    });
  }

  /**
   * Ciclo de vida: OnDestroy
   * Limpia las suscripciones activas
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Cambia la pestaña seleccionada en la UI.
   * @param i Índice de la pestaña a activar.
  */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}
