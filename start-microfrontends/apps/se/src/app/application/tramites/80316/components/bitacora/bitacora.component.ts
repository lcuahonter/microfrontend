import { Component, OnDestroy } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { Solicitud80316State,Tramite80316Store} from '../../estados/tramite80316.store';
import { Subject,map,takeUntil } from 'rxjs';
import { Bitacora } from '../../models/datos-tramite.model';
import { CONFIGURACION_BITACORA_TABLA } from '../../constantes/modificacion.enum';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { SolicitudService } from '../../services/solicitud.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';
import { Tramite80316Query } from '../../estados/tramite80316.query';

/**
 * Componente `BitacoraComponent` utilizado para mostrar y gestionar la bitácora de actividades.
 * Este componente es independiente (standalone) y utiliza varios módulos y servicios.
 */
@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss',
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    TituloComponent,
    ComplementariaImmexComponent,
  ],
  providers: [ToastrService],
})
export class BitacoraComponent implements OnDestroy {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla que muestra la bitácora.
   * Esta configuración define cómo se mostrarán los datos en la tabla.
   * @type {ConfiguracionColumna<Bitacora>[]}
   */
  configuracionTabla: ConfiguracionColumna<Bitacora>[] =
    CONFIGURACION_BITACORA_TABLA;

  /**
   * Datos de la bitácora obtenidos desde el servicio.
   * Estos datos se muestran en la tabla de la bitácora.
   * @type {Bitacora[]}
   */
  datos: Bitacora[] = [];

  /**
   * Estado de la solicitud del trámite 80316.
   * @property {Solicitud80316State} solicitudState
   */
    solicitudState!: Solicitud80316State;
  

  /**
   * Constructor del componente `BitacoraComponent`.
   * Inicializa el servicio de solicitudes y el servicio de notificaciones (Toastr).
   * También realiza la suscripción para obtener los datos de la bitácora.
   *
   * @param {SolicitudService} solicitudService - Servicio para gestionar las solicitudes.
   * @param {ToastrService} toastr - Servicio para mostrar notificaciones al usuario.
   */
  constructor(
    public solicitudService: SolicitudService,
    private toastr: ToastrService,
    private tramite80316Query: Tramite80316Query,
    private tramite80316Store: Tramite80316Store
  ) {
    this.tramite80316Query.selectSolicitud$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((solicitudState) => { 
              this.solicitudState = solicitudState;
            })
          )
          .subscribe();
    
        this.loadBitacoraDatos(this.solicitudState.selectedIdPrograma);
     
  }

   /**
     * Método para cargar los datos de la bitácora desde el servicio.
     * @param idPrograma Identificador del programa para el cual se obtendrán los datos de la bitácora.
     * @return {void}
     */
    loadBitacoraDatos(idPrograma: string): void {
      this.solicitudService
        .obtenerBitacora(idPrograma)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          this.datos =
            response.datos?.map((item: Bitacora) => ({
              tipoModificacion: item.tipoModificacion,
              fechaModificacion: item.fechaModificacion,
              valoresAnteriores: item.valoresAnteriores,
              valoresNuevos: item.valoresNuevos,
            })) || [];
        });
    }
  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
