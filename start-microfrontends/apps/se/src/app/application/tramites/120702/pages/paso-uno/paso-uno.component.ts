import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { ExpedicionCertificadosFronteraService } from '../../services/expedicion-certificados-frontera.service';

import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { AsignacionResponse } from '../../models/expedicion-certificados-frontera.models';
import { ExpedicionAsignacionComponent } from '../../components/expedicion-asignacion/expedicion-asignacion.component';
import { Tramite120702Store } from '../../estados/tramite120702.store';
/**
 * # Documentación - PasoUnoComponent
 *
 * ## Descripción del componente
 * `PasoUnoComponent` es un componente de Angular diseñado para gestionar la lógica de selección de pestañas en la aplicación.
 *
 * ### Selector
 * - **Selector del componente**: `app-paso-uno`
 * - **standalone**: `false`
 * - **templateUrl**: `./paso-uno.component.html`
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

/**
   * Contiene los datos de respuesta relacionados con la asignación en el formulario.
   * 
   * @type {AsignacionResponse}
   */
  asignacionFormDatos!:any ;

  @Output() public buscarDatos =
    new EventEmitter<AsignacionResponse>();

/**
 * Evento que emite un valor booleano para indicar si el monto debe estar deshabilitado
 * cuando es menor a un valor específico. 
 * 
 * @event
 * @param {boolean} isDisabled - Indica si el monto está deshabilitado (true) o habilitado (false).
 */
@Output() public isMontoDisableLessExpendir =
  new EventEmitter<boolean>();
/**
 * Indica si el campo de monto debe estar deshabilitado cuando el valor es menor a un umbral específico.
 * 
 * Cuando es `true`, el campo de monto estará deshabilitado para valores inferiores al permitido.
 * Cuando es `false`, el campo de monto permanecerá habilitado independientemente del valor.
 */
public isMontoDisableLessValue: boolean = false;

  /**
    * Referencia ViewChild al componente de asignación de datos de empresa.
    */
  @ViewChild('asignacionRef') asignacion!: ExpedicionAsignacionComponent;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /**
 * Indica si el formulario está deshabilitado.
 */
  formularioDeshabilitado: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Propiedad que almacena el estado actual de la consulta IO.  
* Se inicializa posteriormente con datos del store o de un observable. */
  public consultaState!: ConsultaioState;

  /**
 * ## Propiedad: indice
 * Define el índice actualmente seleccionado. Se inicializa con el valor `1`.
 */
  indice: number = 1;

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se ha activado la acción de continuar.
   * Esta bandera se utiliza para controlar el flujo cuando el usuario
   * ha iniciado el proceso de continuar al siguiente paso del trámite.
   */
  @Input() isContinuarTriggered: boolean = false;

  /**
 * Evento de salida que emite la cantidad de elementos presentes en la tabla.
 * 
 * @event
 * @type {EventEmitter<number>}
 * @description Emite un número que representa la longitud actual de la tabla.
 */
  @Output() public TablaLength =
    new EventEmitter<number>();

  /**
   * Evento de salida que emite un valor booleano para indicar si los datos de búsqueda están vacíos.
   * 
   * @event
   * @type {boolean}
   * @description
   * Emitido como `true` cuando no hay datos de búsqueda disponibles, y como `false` en caso contrario.
   */
  @Output() public emptyDatosBuscar =
    new EventEmitter<boolean>();

  /**
 * ## Método: seleccionaTab
 * Este método actualiza el índice en función del número proporcionado como argumento.
 *
 * #### Parámetros
 * - **i**: Número que representa el índice de la pestaña seleccionada.
 *
 * #### Implementación
 * ```typescript
 * seleccionaTab(i: number): void {
 *   this.indice = i;
 * }
 * ```
 */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Valida el formulario del tab actualmente seleccionado.
   * @returns true si el formulario es válido, false en caso contrario.
   */
  public validarTabActual(): boolean {
    // Si estamos en el tab 2 (Expedición certificados), validar el formulario
    if (this.indice === 2 && this.asignacion && this.asignacion.asignacionForm) {
      // Marcar todos los campos como touched para mostrar errores
      this.asignacion.asignacionForm.markAllAsTouched();

      // Validar campos específicos requeridos
      const ANODELOFICIO = this.asignacion.asignacionForm.get('anoDelOficio');
      const NUMEROOFICIO = this.asignacion.asignacionForm.get('numeroOficio');
      const MONTOAEXPEDIR = this.asignacion.asignacionForm.get('montoAExpedir');

      return (ANODELOFICIO?.valid || false) &&
        (NUMEROOFICIO?.valid || false) &&
        (MONTOAEXPEDIR?.valid || false);
    }

    // Para otros tabs, retornar true (no hay validación específica)
    return true;
  }

  /**
   * Método público para validar el formulario independientemente del tab actual.
   * Utilizado por el componente padre para validar antes de continuar al siguiente paso.
   */
  public validarFormularioCompleto(): boolean {
    // Only validate if we're on tab 2 (where the form is visible)
    if (this.indice === 2) {
      if (this.asignacion && this.asignacion.asignacionForm) {
        // Forzar validación usando el método del componente hijo
        if (this.asignacion.forzarValidacion) {
          this.asignacion.forzarValidacion();
        }

        // Marcar todos los campos como touched
        this.asignacion.asignacionForm.markAllAsTouched();

        // Validar solo los campos requeridos específicos
        const ANODELOFICIO = this.asignacion.asignacionForm.get('anoDelOficio');
        const NUMEROOFICIO = this.asignacion.asignacionForm.get('numeroOficio');
        const MONTOAEXPEDIR = this.asignacion.asignacionForm.get('montoAExpedir');

        const ISVALID = (ANODELOFICIO?.valid || false) &&
          (NUMEROOFICIO?.valid || false) &&
          (MONTOAEXPEDIR?.valid || false);
        return ISVALID;
      }
      return true;
    }
    return true;
  }

  /**
 * Constructor de la clase.
 * Inyecta los servicios ExpedicionCertificadosFronteraService y ConsultaioQuery.
 * La inicialización de datos no se realiza en el constructor, sino en métodos específicos según sea necesario.
 */
  constructor(private expedicionService: ExpedicionCertificadosFronteraService, private consultaQuery: ConsultaioQuery,
    private registroSolicitudService: RegistroSolicitudService,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter,
    private tramite120702Store: Tramite120702Store
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }


  /**
 * Inicializa la suscripción al estado de la consulta y actualiza el formulario
 * según el valor de `update`. Utiliza `takeUntil` para gestionar la cancelación
 * de la suscripción al destruir el componente.
 */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
        this.esFormularioSoloLectura=this.consultaState.readonly;
        if (this.consultaState.update) {
          this.formularioDeshabilitado = false;
          this.monstrarDatosFormulario();
        } else if (this.consultaState.readonly) {         
          this.formularioDeshabilitado = true;
        }
        if (!(this.consultaState && this.consultaState.procedureId === '120702' && this.consultaState.update)) {
          this.esDatosRespuesta = true;
        }
      })
  }

  /**
   * Maneja el evento de recepción de datos del formulario.
   * 
   * @param event - Datos emitidos por el formulario.
   * @remarks
   * Este método emite los datos recibidos a través del evento `buscarDatos`.
   */
  handleFormaDatos(event: AsignacionResponse): void {
    this.buscarDatos.emit(event);
  }


  /**
   * Muestra los datos del formulario para la solicitud actual.
   *
   * Obtiene el ID de la solicitud desde el estado de consulta y realiza una petición
   * al servicio `registroSolicitudService` para obtener las opciones prellenadas asociadas
   * al trámite con código 120702. Si la respuesta contiene datos, los adapta y muestra
   * utilizando el adaptador `ampliacionServiciosAdapter`. Finalmente, marca la bandera
   * `esDatosRespuesta` como verdadera para indicar que los datos han sido recibidos.
   */
  monstrarDatosFormulario(): void {
    const SOLICITUDE_ID = Number(this.consultaState.id_solicitud)
    this.registroSolicitudService.parcheOpcionesPrellenadas(120702, SOLICITUDE_ID).pipe(
      takeUntil(this.destroyNotifier$)
    )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          const MOSTARDATOS = this.ampliacionServiciosAdapter.obtenerMostrarDatos(resp.datos as unknown as Record<string, unknown>);
          this.asignacionFormDatos=resp.datos as unknown as Record<string, unknown> ;
          this.tramite120702Store.update(MOSTARDATOS);
        }
      });
    this.esDatosRespuesta = true;
  }

  /**
   * Maneja el cambio de longitud de la tabla.
   * 
   * @param event - Nuevo valor de la longitud de la tabla.
   * @remarks
   * Este método emite el valor recibido a través del evento `TablaLength`.
   */
  public handleTablaLength(event: number): void {
    this.TablaLength.emit(event);
  }


  /**
   * Emite un evento indicando si los datos de búsqueda están vacíos.
   *
   * @param event - Valor booleano que indica si los datos de búsqueda están vacíos (`true`) o no (`false`).
   */
  public handleEmptyDatos(event: boolean): void {
    this.emptyDatosBuscar.emit(event);
  }

  /**
   * Maneja el evento que indica si el monto debe estar deshabilitado o no.
   * 
   * @param event - Valor booleano que determina si el monto debe estar deshabilitado.
   * 
   * Asigna el valor recibido a `isMontoDisableLessValue` y emite el nuevo valor a través del evento `isMontoDisableLessExpendir`.
   */
  public handleIsMontoDisableLess(event: boolean): void {
    this.isMontoDisableLessValue=event;
    this.isMontoDisableLessExpendir.emit(this.isMontoDisableLessValue);
  }

  /**
* Método del ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
* 
* Este método se utiliza para limpiar recursos, específicamente para completar
* el `Subject` `destroyNotifier$`, el cual es usado en combinación con el operador `takeUntil`
* para cancelar automáticamente las suscripciones a observables y evitar fugas de memoria.
* 
*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
