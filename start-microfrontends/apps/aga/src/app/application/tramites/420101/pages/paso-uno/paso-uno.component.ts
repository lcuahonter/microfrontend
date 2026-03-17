import { Component, OnDestroy, OnInit } from '@angular/core';

import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import { map } from 'rxjs';
import { takeUntil} from 'rxjs';

import { RegistrarProveedoresService } from '../../service/registrar-proveedores.service';
import { Subject} from 'rxjs';
import { Tramite420101Query } from '../../estados/tramite420101Query.query';
import { Tramite420101Store } from '../../estados/tramite420101Store.store';

/**
 * @class PasoUnoComponent
 * @description Componente que representa el paso uno del trámite 420102.
 * Este paso incluye la funcionalidad para gestionar la información del solicitante
 * y concluir la relación asociada al trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnInit {

  /**
   * Índice utilizado para realizar selecciones o identificaciones de elementos.
   * Puede ser un número o estar indefinido.
   * @type {number | undefined}
   */
  indice: number | undefined = 1;

  /**
   * Notificador para gestionar la destrucción de observables y evitar fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;
  
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor del componente que inicializa las dependencias necesarias para el manejo del trámite 420101.
   * @param tramite420101Query - Servicio de consulta para datos relacionados con el trámite 420101.
   * @param tramite420101Store - Servicio de almacenamiento para datos relacionados con el trámite 420101.
   */
  constructor(
    private tramite420101Query: Tramite420101Query,
    private tramite420101Store: Tramite420101Store,
    private consultaQuery: ConsultaioQuery,
    private registrarProveedoresService: RegistrarProveedoresService

  ) {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })).subscribe();
    }

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al flujo de datos `getTabSeleccionado$` para obtener el índice de la pestaña seleccionada
   * y actualizar el valor de `indice`. Se utiliza `takeUntil` para desuscribirse cuando el componente se destruya.
   *
   * @returns {void}
   */
  ngOnInit(): void {
     if (this.consultaState && this.consultaState.procedureId === '420101' &&
      this.consultaState.update || 1<2) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    this.tramite420101Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
  }

  /**
 * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
 * Luego reinicializa el formulario con los valores actualizados desde el store.
 */
  guardarDatosFormulario(): void {
    this.registrarProveedoresService.getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)).subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.tramite420101Store.actualizarEstadoFormulario(resp);
          }
        });
  }

  /**
   * Método para seleccionar una pestaña. Actualiza el estado de la pestaña seleccionada en el store.
   *
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.tramite420101Store.updateTabSeleccionado(i);
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}