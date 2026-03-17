import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { FormGroup } from '@angular/forms';

/**
 * @component PasoUnoComponent
 * @selector paso-uno
 * @description
 * Este componente es responsable de gestionar y renderizar la primera sección del flujo de trabajo
 * en el proceso de exportación de obras de arte. Incluye la lógica para manejar eventos del formulario
 * y la navegación entre subtítulos.
 *
 * Funcionalidades principales:
 * - Emite eventos relacionados con el formulario utilizando `formaEventoEmitir`.
 * - Gestiona la activación o desactivación de pestañas en función de los valores del formulario.
 * - Permite la navegación entre subtítulos mediante el índice seleccionado.
 *
 * @templateUrl ./paso-uno.component.html
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * @property formaEventoEmitir
   * @type {EventEmitter<FormGroup>}
   * @description
   * Este `EventEmitter` se utiliza para emitir eventos relacionados con el formulario
   * hacia componentes padres. Permite la comunicación de los datos del formulario
   * desde este componente hacia otros componentes que lo contienen.
   *
   * Funcionalidad:
   * - Emite el formulario reactivo (`FormGroup`) cuando se producen cambios o eventos relevantes.
   *
   * @example
   * this.formaEventoEmitir.emit(this.forma);
   * // Emite el formulario actual hacia el componente padre.
   */
  @Output() public formaEventoEmitir: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();

  /**
   * @property desactivarPestana
   * @type {boolean}
   * @description
   * Esta propiedad indica si una pestaña debe estar desactivada en función de los valores del formulario.
   * Se actualiza dinámicamente según la lógica implementada en el método `formularioEventoEmitir`.
   *
   * Funcionalidad:
   * - `true`: La pestaña está desactivada.
   * - `false`: La pestaña está activa.
   *
   * @default false
   *
   * @example
   * this.desactivarPestana = true;
   * // Desactiva la pestaña.
   */
  public desactivarPestana: boolean = false;
  /**
   * compo doc
   * Índice del subtítulo seleccionado.
   * Se utiliza para determinar qué sección de datos se muestra.
   * Inicialmente, el valor es 1.
   */
  public indice: number = 1;

  /**
   * compo doc
   * Emisor de eventos que notifica el cambio de pestaña.
   * Emite un número correspondiente al índice de la pestaña seleccionada.
   * 
   * @type {EventEmitter<number>}
   * @memberof PasoUnoComponent
   */
  @Output() pestanaCambiado = new EventEmitter<number>();

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property desactivarPagoDerechos
   * @type {boolean}
   * @description
   * Propiedad de entrada (`@Input`) que indica si la pestaña correspondiente al "Pago de derechos" debe estar desactivada.
   * @default false
   */
  @Input() desactivarPagoDerechos: boolean = false;

  /**
     * @constructor
     * @description
     * Este constructor inicializa el componente `DatosDeLaSolicitudComponent` e inyecta los servicios necesarios
     * para gestionar los datos y validaciones del formulario.
     *
     * Servicios inyectados:
     * - `ExportarIlustracionesService`: Servicio utilizado para obtener datos relacionados con monedas y fracciones arancelarias.
     *
     * @param {ExportarIlustracionesService} exportarIlustracionesService - Servicio para gestionar datos de exportación.
     */
    constructor(
      public exportarIlustracionesService: ExportarIlustracionesService,
      private changeDetectorRef: ChangeDetectorRef
        ) {
      //
    }

    /**
   * @method ngOnInit
   * @description
   * Método de inicialización del componente `DatosComponent`.
   * 
   * Detalles:
   * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `consultaState` con el estado recibido.
   * - Si la propiedad `update` del estado es verdadera, llama al método `guardarDatosFormulario()`.
   * - Si no, establece la bandera `esDatosRespuesta` en `true` para indicar que se deben mostrar los datos de respuesta.
   * 
   * @example
   * this.ngOnInit();
   * // Inicializa el componente y gestiona el flujo de datos según el estado de la consulta.
   */
  ngOnInit(): void {
    if(this.consultaState?.update) {
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
    this.exportarIlustracionesService
      .getExportarIlustracionesData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          Object.entries(resp).forEach(([key, value]) => {
            this.exportarIlustracionesService.actualizarEstadoFormulario(key, value);
          });
        }
      });
  }

  /**
   * compo doc
   * Método para cambiar el índice del subtítulo seleccionado.
   *
   * @param i - Índice del nuevo subtítulo seleccionado.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.pestanaCambiado.emit(this.indice);
  }

  /**
 * @method ngAfterViewInit
 * @description
 * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido completamente inicializada
 */
  ngAfterViewInit(): void {
    if (this.desactivarPagoDerechos) {
      this.desactivarPestana=this.desactivarPagoDerechos;
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * @method formularioEventoEmitir
   * @description
   * Este método se utiliza para manejar los eventos relacionados con el formulario.
   * Evalúa el valor del campo `extentoPago` y actualiza la propiedad `desactivarPestana`
   * en función de su valor.
   *
   * Funcionalidad:
   * - Si el campo `extentoPago` tiene un valor verdadero, desactiva la pestaña (`desactivarPestana = true`).
   * - Si el campo `extentoPago` tiene un valor falso, activa la pestaña (`desactivarPestana = false`).
   *
   * @param {FormGroup} event - El formulario reactivo que emite el evento.
   *
   * @example
   * this.formularioEventoEmitir(formulario);
   * // Actualiza el estado de `desactivarPestana` según el valor de `extentoPago`.
   */
  formularioEventoEmitir(event: FormGroup): void {
    if (event.get('extentoPago')?.value) {
      this.desactivarPestana = true;
    } else {
      this.desactivarPestana = false;
    }
    this.changeDetectorRef.detectChanges();
  }

  /**
 * @method ngOnDestroy
 * @description
 * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
 * 
 * Detalles:
 * - Emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores que el componente está siendo destruido.
 * - Completa el observable para liberar recursos y evitar fugas de memoria.
 * 
 * @returns {void} No retorna ningún valor.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
