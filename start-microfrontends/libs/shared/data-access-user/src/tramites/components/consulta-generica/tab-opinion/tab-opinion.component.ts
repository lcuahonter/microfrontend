import { CommonModule } from '@angular/common';

import { Component, Input, OnDestroy} from '@angular/core';

import { OpinionComponent } from "../consulta-opinion/opiniones.component";

import { DetalleOpinionComponent } from '../consulta-detalle-opinion/detalle-opinion.component';
import { DetalleOpinonService } from '../../../../core/services/shared/detalleOpinion.service';
import { OpinionDetalleResponse } from '../../../../core/models/shared/opinion-detalle-response.model';
import { OpinionResponse } from '../../../../core/models/shared/opinion-response.model';
import { Subject } from 'rxjs';

import { CategoriaMensaje, Notificacion, NotificacionesComponent } from '../../notificaciones/notificaciones.component';


@Component({
  selector: 'tab-opinion',
  standalone: true,
  imports: [CommonModule, OpinionComponent, DetalleOpinionComponent, NotificacionesComponent],
  templateUrl: './tab-opinion.component.html',
  styleUrl: './tab-opinion.component.scss',
})
export class TabOpinionComponent implements OnDestroy{

  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice de la pestaña seleccionada en la interfaz de usuario.
   */
  indice: number = 1;

  /** Listado de opiniones (input desde componente padre) */
  @Input() opinion: OpinionResponse[] = [];

  /**
   * Detalle completo de la solicitud/opinión seleccionada
   */
  solicitud!: OpinionDetalleResponse;

  /**
   * ID de la opinión actualmente seleccionada
   */
  idOpinionActual!: string;

  /**
   * @property {number} tramite
   * @description Identificador del trámite asociado a las pestañas.
   */
  @Input() tramite!: number;

  /**
   * URL de la página actual.
  */
  public nuevaNotificacion: Notificacion | null = null;
  
  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
  */
  public alertaNotificacion!: Notificacion;

  /**
   * Constructor del componente
   * @param detalleOpinonService Servicio para obtener detalles de opiniones
   */
  constructor(
        private detalleOpinonService: DetalleOpinonService
  ) { }

  
  /**
   * Maneja la selección de una opinión
   * @param id ID de la opinión seleccionada
   */
  onIdOpinionSeleccionada(id: number): void {
    this.idOpinionActual = id.toString();
    this.seleccionaTab(2); 
     this.getSolicitud(this.idOpinionActual);
  }

  /**
   * Obtiene el detalle completo de una solicitud/opinión
   * @param idOpinion ID de la opinión a consultar
   */
  getSolicitud(idOpinion: string): void {
    this.detalleOpinonService
      .getDetalleOpinion(this.tramite, idOpinion)
      .subscribe({
        next: (data) => {
          if (data.codigo === "00") {
            this.solicitud = data.datos ?? {} as OpinionDetalleResponse;
            this.seleccionaTab(2);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.seleccionaTab(1);
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: data.error || 'Error detalle opinión',
              mensaje:
                data.causa ||
                data.mensaje ||
                data.error ||
                'Ocurrió un error al consultar detalle opinión.',
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
            mensaje: error?.error?.error || 'Error inesperado en detalle opinión.',
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
