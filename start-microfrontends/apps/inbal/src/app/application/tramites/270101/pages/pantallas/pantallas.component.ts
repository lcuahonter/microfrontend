import {
  AVISO,
  AccionBoton,
  DatosPasos,
  ListaPasosWizard
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  ERROR_DE_REGISTRO_ALERT,
  ERROR_FORMA_ALERT,
} from '../../constantes/exportar-ilustraciones.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantallas.enum';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
/**
 * @component PantallasComponent
 * @selector pantallas
 * @description
 * Este componente es responsable de gestionar y renderizar las pantallas del flujo de trabajo
 * en el proceso de exportación de obras de arte. Incluye un wizard para la navegación entre pasos
 * y validaciones de formularios asociados.
 *
 * Funcionalidades principales:
 * - Renderiza un wizard basado en la configuración de pasos definida.
 * - Maneja la navegación entre pasos del wizard.
 * - Valida los formularios asociados a cada paso.
 *
 * Componentes importados:
 * - `WizardComponent`: Componente para gestionar la navegación entre pasos.
 *
 * @templateUrl ./pantallas.component.html
 */
@Component({
  selector: 'pantallas',
  templateUrl: './pantallas.component.html',
})
export class PantallasComponent implements OnInit, OnDestroy {
  /**
   * compo doc
   * Lista de pasos del wizard.
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;

  /**
   * compo doc
   * Índice del paso actual.
   * @type {number}
   * @default 1
   */
  public indice: number = 1;

  /**
   * compo doc
   * Datos utilizados para el control del wizard.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * compo doc
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) public wizardComponent!: WizardComponent;

  /**
   * @property registroAlert
   * @type {string}
   * @description
   * Esta propiedad almacena el mensaje de alerta relacionado con la información de la obra de arte.
   * El valor de esta propiedad se obtiene de la constante `ERROR_DE_REGISTRO_ALERT`, que contiene el contenido
   * predefinido para mostrar en el componente de alerta.
   *
   * @example
   * console.log(this.registroAlert);
   * // Muestra el contenido de la alerta configurada en `ERROR_DE_REGISTRO_ALERT`.
   */
  public registroAlert = ERROR_DE_REGISTRO_ALERT;

  /**
   * @property itinerarioError
   * @type {boolean}
   * @description
   * Esta propiedad indica si existe un error relacionado con el itinerario en el flujo de trabajo.
   * Se utiliza para mostrar mensajes de error o manejar validaciones específicas cuando el itinerario
   * no cumple con los requisitos establecidos.
   *
   * Funcionalidad:
   * - `true`: Indica que hay un error en el itinerario.
   * - `false`: Indica que no hay errores en el itinerario.
   *
   * @default false
   *
   * @example
   * this.itinerarioError = true;
   * // Activa el estado de error del itinerario.
   */
  public itinerarioError: boolean = false;

  /**
   * @property registroAlert
   * @type {string}
   * @description
   * Esta propiedad almacena el mensaje de alerta relacionado con la información de la obra de arte.
   * El valor de esta propiedad se obtiene de la constante `ERROR_DE_REGISTRO_ALERT`, que contiene el contenido
   * predefinido para mostrar en el componente de alerta.
   *
   * @example
   * console.log(this.registroAlert);
   * // Muestra el contenido de la alerta configurada en `ERROR_DE_REGISTRO_ALERT`.
   */
  public formaErrorAlert = ERROR_FORMA_ALERT;

  /**
   * @getter formaError
   * @type {boolean}
   * @description
   * Este getter evalúa si todos los formularios asociados a las secciones del flujo de trabajo
   * son válidos. Devuelve `true` si todos los formularios son válidos, de lo contrario, devuelve `false`.
   *
   * Funcionalidad:
   * - Verifica la validez de los formularios `periodoEnElExtranjero`, `motivo`, `lugar` y `aduana`.
   * - Utiliza el método `getFormValidity` del servicio `ExportarIlustracionesService` para realizar la validación.
   *
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario.
   *
   * @example
   * if (this.formaError) {
   *   console.log('Todos los formularios son válidos.');
   * } else {
   *   console.log('Existen formularios con errores.');
   * }
   */
  get formaError(): boolean {
    return (
      this.exportarIlustracionesService.getFormValidity('periodoEnElExtranjero') &&
      this.exportarIlustracionesService.getFormValidity('motivo') &&
      this.exportarIlustracionesService.getFormValidity('lugar') &&
      this.exportarIlustracionesService.getFormValidity('aduana')
    );
  }

  /**
   * @property esValido
   * @type {boolean}
   * @description
   * Esta propiedad indica si todos los formularios asociados al flujo de trabajo son válidos.
   * Se actualiza en función de las validaciones realizadas en el método `esElFormularioValido`.
   *
   * Funcionalidad:
   * - `true`: Indica que todos los formularios son válidos.
   * - `false`: Indica que existen formularios con errores.
   *
   * @example
   * this.esValido = true;
   * // Indica que todos los formularios son válidos.
   */
  public esValido!: boolean;

  /**
  * compo doc
  * variable para contener el índice de la pestaña seleccionada
  * @type {number}
  */
  public indiceDePestanaSeleccionada: number = 1;

  /**
  * compo doc
  * Mensaje relacionado con el aviso de privacidad simplificado.
  * 
  * @type {string}
  * @memberof PantallasComponent
  */
  public avisoPrivacidadAlert: string = AVISO.Aviso;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  public consultaState!: ConsultaioState;

  /**
 * @property desactivarPagoDerechos
 * @type {boolean}
 * @description
 * Esta propiedad indica si la pestaña correspondiente al "Pago de derechos" debe estar desactivada.
 * @default false
 */
  public desactivarPagoDerechos: boolean = false;

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
    private consultaQuery: ConsultaioQuery
  ) {
    //
  }

  /**
   * compo doc
   * @method ngOnInit
   * @description
   * Método de inicialización del componente `DatosComponent`.
   * 
   * Detalles:
   * - Se suscribe al observable `selectConsultaioState$` del store `ConsultaioQuery` para obtener el estado actual de la consulta.
   * - Utiliza `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
   * - Actualiza la propiedad `consultaState` con el estado recibido.
   * - Si la propiedad `update` del estado es verdadera, llama al método `guardarDatosFormulario()`.
   * 
   * @example
   * this.ngOnInit();
   * // Inicializa el componente y gestiona el flujo de datos según el estado de la consulta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState.readonly) {
        this.desactivarPagoDerechos = true;
    }
      })
    ).subscribe();
  }

  /**
   * compo doc
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  public getValorIndice(e: AccionBoton): void {
    if (!this.consultaState.readonly) {
      this.esElFormularioValido();
      if (
        this.exportarIlustracionesService.aduanaArray.length > 1 &&
        this.exportarIlustracionesService.datosDeSolicitudArray.length
      ) {
        if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
          this.indice = e.valor;
          this.datosPasos.indice = e.valor;

          if (e.accion === 'cont') {
            this.wizardComponent.siguiente();
          } else {
            this.wizardComponent.atras();
          }
          if (e.valor!==1) {
            this.indiceDePestanaSeleccionada=1;
          }
        }
      }
    } else {
      if (e.valor > 0 && e.valor < this.pantallasPasos.length) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent?.siguiente();
      } else {
        this.wizardComponent?.atras();
      }
    }
    }
  }

  /**
   * @method esElFormularioValido
   * @description
   * Este método valida si los formularios asociados al flujo de trabajo son válidos y actualiza
   * el estado de error del itinerario y la propiedad `esValido`.
   *
   * Funcionalidad:
   * - Verifica si el arreglo `aduanaArray` tiene más de un elemento.
   * - Actualiza la propiedad `itinerarioError` en función de la validación del itinerario.
   * - Actualiza la propiedad `esValido` en función de la validez de los formularios evaluados por `formaError`.
   *
   * @example
   * this.esElFormularioValido();
   * // Valida los formularios y actualiza los estados correspondientes.
   */
  esElFormularioValido(): void {
    if (this.exportarIlustracionesService.aduanaArray.length > 1) {
      this.itinerarioError = false;
    } else {
      this.itinerarioError = true;
    }
    this.esValido = this.formaError;
  }

  /**
   * compo doc
   * Función que obtiene el índice de la pestaña seleccionada
   * @param {number} event - evento de numero
   * @returns {void}
   */
  pestanaCambiado(event: number): void {
    if (event !== undefined && event !== null && !isNaN(event)) {
      this.indiceDePestanaSeleccionada = event;
    } else {
      this.indiceDePestanaSeleccionada = 1;
    }
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
