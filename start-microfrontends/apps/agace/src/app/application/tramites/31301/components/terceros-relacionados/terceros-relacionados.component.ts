import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { HttpClientModule } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { RECIBIR_NOTIFICACIONES_CONFIGURACION } from '../../constants/solicitud.enum';
import { RecibirNotificaciones } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { takeUntil } from 'rxjs';

/**
 * Componente encargado de mostrar la lista de terceros relacionados
 * que pueden recibir notificaciones. Utiliza una tabla dinámica para
 * mostrar los datos obtenidos del servicio `SolicitudService`.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    HttpClientModule,
  ],
  providers: [SolicitudService],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
/**
 * Componente encargado de mostrar la lista de terceros relacionados
 * que pueden recibir notificaciones. Utiliza una tabla dinámica para
 * mostrar los datos obtenidos del servicio `SolicitudService`.
 */
export class TercerosRelacionadosComponent implements OnDestroy {
  /** Tipo de selección para la tabla (por defecto: UNDEFINED) */
  tipoSeleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Configuración de columnas que se mostrarán en la tabla.
   * Cada columna tiene un encabezado, una clave para obtener
   * el valor desde el modelo y un orden para su disposición.
   */
  configuracionColumnas: ConfiguracionColumna<RecibirNotificaciones>[] = RECIBIR_NOTIFICACIONES_CONFIGURACION;

  /** Lista de objetos `RecibirNotificaciones` que se mostrarán en la tabla */
  orecibirNotificacionesLista: RecibirNotificaciones[] =
    [] as RecibirNotificaciones[];

  /** Subject utilizado para gestionar la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Constructor que inyecta el servicio `SolicitudService` y
   * realiza la carga inicial de los datos.
   * @param solicitudService Servicio para obtener datos de terceros
   */
  constructor(public solicitudService: SolicitudService) {
    this.conseguirRecibirNotificaciones();
  }

  /**
   * Método que obtiene la lista de terceros relacionados que
   * pueden recibir notificaciones a través del servicio.
   * Utiliza `takeUntil` para limpiar la suscripción cuando
   * el componente se destruye.
   */
  conseguirRecibirNotificaciones(): void {
    this.solicitudService
      .conseguirRecibirNotificaciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: RecibirNotificaciones[]) => {
        this.orecibirNotificacionesLista = respuesta;
      });
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Se encarga de emitir y completar el subject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
