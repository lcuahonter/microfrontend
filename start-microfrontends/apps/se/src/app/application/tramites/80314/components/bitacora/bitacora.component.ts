import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
} from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { Bitacora } from '../../estados/models/plantas-consulta.model';
import { CONFIGURACION_BITACORA_TABLA } from '../../constantes/modificacion.enum';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';

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
  providers: [ImmerModificacionService, ToastrService],
})
export class BitacoraComponent implements OnDestroy, OnInit {
  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones al destruir el componente.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de las columnas de la tabla que muestra la bitácora.
   * @type {ConfiguracionColumna<Bitacora>[]}
   */
  configuracionTabla: ConfiguracionColumna<Bitacora>[] =
    CONFIGURACION_BITACORA_TABLA;

  /**
   * Datos de la bitácora obtenidos desde el servicio.
   * @type {Bitacora[]}
   */
  datos: Bitacora[] = [];

  /**
   * Constructor de la clase BitacoraComponent.
   *
   * @param modificionService - Servicio utilizado para obtener y manejar la bitácora de solicitudes.
   * @param toastr - Servicio para mostrar notificaciones al usuario.
   *
   * Este constructor inicializa el componente y realiza una suscripción al método `obtenerBitacora` del servicio
   * `ImmerModificacionService`. Los datos obtenidos se almacenan en la variable `datos`. En caso de error,
   * se muestra una notificación al usuario utilizando el servicio `ToastrService`.
   */
  constructor(
    public modificionService: ImmerModificacionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.modificionService
      .obtenerBitacora()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data: Bitacora[]) => {
          this.datos = [...data];
        },
        () => {
          this.toastr.error('Error al cargar los estados'); // Manejo de errores.
        }
      );
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
