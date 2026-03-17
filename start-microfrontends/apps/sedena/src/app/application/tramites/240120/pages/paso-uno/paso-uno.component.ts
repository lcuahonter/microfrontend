import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PermisoExportacionPirotecniaService } from '../../services/permiso-exportacion-pirotecnia.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240120Query } from '../../estados/tramite240120Query.query';
import { Tramite240120Store } from '../../estados/tramite240120Store.store';

/**
 * @title Paso Uno
 * @description Componente que representa el primer paso del flujo de solicitud. Contiene los datos del solicitante, datos del trámite, terceros relacionados y pago de derechos.
 * @summary Agrupa los subcomponentes necesarios para capturar la información inicial del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosDelTramiteContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    PagoDeDerechosContenedoraComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnInit {
  /**
   * @propiedad indice
   * @descripcion Indica el índice de la pestaña seleccionada dentro del paso del formulario.
   * @tipo {number | undefined}
   */
  public indice: number | undefined = 1;

  /**
   * @propiedad destroyNotifier$
   * @descripcion Observable utilizado para cancelar suscripciones activas cuando el componente es destruido.
   * Ayuda a prevenir fugas de memoria.
   * @tipo {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
  * Esta variable se utiliza para almacenar el índice del subtítulo.
  */
  public consultaState!: ConsultaioState;
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
 /**
   * @constructor
   * @descripcion Inicializa el componente con las dependencias necesarias para la gestión del estado.
   * @param tramite240120Query Query para acceder al estado del trámite.
   * @param tramite240120Store Store para actualizar el estado del trámite.
   * @param consultaQuery Query para acceder al estado de la consulta.
   * @param permisoExportacionPirotecniaService Servicio para manejar la lógica de permisos de exportación de pirotecnia.
   */
  constructor(
    private tramite240120Query: Tramite240120Query,
    private tramite240120Store: Tramite240120Store,
    public consultaQuery: ConsultaioQuery,
    public permisoExportacionPirotecniaService: PermisoExportacionPirotecniaService
  ) {}

  /**
   * @método ngOnInit
   * @descripcion Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a la pestaña seleccionada desde el estado y actualiza `indice`.
   * @retorna {void}
   */
  ngOnInit(): void {
    this.tramite240120Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState && this.consultaState.procedureId === ID_PROCEDIMIENTO.toString() &&
      this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
    /**
* Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
* Luego reinicializa el formulario con los valores actualizados desde el store.
*/
  guardarDatosFormulario(): void {
    this.permisoExportacionPirotecniaService
      .obtenerRegistroTomarMuestrasDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoExportacionPirotecniaService.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * @método seleccionaTab
   * @descripcion Actualiza el índice de la pestaña seleccionada en el store.
   * @param i Índice de la pestaña seleccionada.
   * @retorna {void}
   */
  public seleccionaTab(i: number): void {
    this.tramite240120Store.updateTabSeleccionado(i);
  }

  /**
   * @método ngOnDestroy
   * @descripcion Método del ciclo de vida de Angular que se ejecuta justo antes de que el componente sea destruido.
   * Emite y completa el observable `destroyNotifier$` para cancelar las suscripciones.
   * @retorna {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
