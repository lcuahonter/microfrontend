import { Component, OnDestroy } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { PantallasActionService } from '../../services/pantallas-action.service';
import { SECCIONES_TRAMITE_230401 } from '../../enum/pantallas-constante.enum';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';

/**
 * Componente que representa el segundo paso en el flujo de trámites.
 * 
 * Este componente contiene un objeto con los textos de los requisitos necesarios
 * para completar el trámite. Los textos son accesibles a través de la propiedad `TEXTOS`.
 *
 * Se espera que sea utilizado dentro de un flujo paso a paso para visualizar
 * los requisitos necesarios antes de continuar con la solicitud.
 *
 * @class PasoUnoCsComponent
 */
@Component({
  selector: 'app-paso-uno-cs',
  templateUrl: './paso-uno-cs.component.html',
})
/**
 * Componente Angular que representa el paso uno del trámite 230401.
 * 
 * Este componente se encarga de gestionar la lógica relacionada con el subtítulo del asistente,
 * la asignación de secciones y la carga de datos desde el servidor para actualizar el formulario.
 * 
 * Propiedades:
 * - `indice`: Índice de la pestaña seleccionada en el asistente.
 * - `consultaState`: Estado de consulta obtenido desde el store.
 * - `esDatosRespuesta`: Indica si se han recibido datos de respuesta del servidor.
 * - `destroyNotifier$`: Observable utilizado para notificar la destrucción del componente.
 * 
 * Métodos:
 * - `seleccionaTab(i: number)`: Cambia el índice de la pestaña seleccionada.
 * - `asignarSecciones()`: Asigna las secciones existentes al store.
 * - `guardarDatosFormulario()`: Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
 * - `ngOnDestroy()`: Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
 * 
 * Constructor:
 * - Inicializa las propiedades del componente y configura las suscripciones necesarias para gestionar el estado.
 */
export class PasoUnoCsComponent implements OnDestroy {

  /**
   * Esta variable se utiliza para almacenar el índice de la pestaña seleccionada.
   * Por defecto, se inicia en 1, lo que indica que la primera pestaña está activa.
   */
  indice: number = 1;


  /**
   * Representa el estado de consulta utilizado en el componente.
   * 
   * Esta propiedad es de tipo `ConsultaioState` y se utiliza para 
   * gestionar el estado relacionado con las operaciones de consulta 
   * dentro del componente `paso-uno-cs`.
   * 
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si los datos de respuesta están disponibles o no.
   * 
   * Esta propiedad booleana se utiliza para determinar si se han recibido 
   * datos de respuesta en el contexto de la aplicación. Su valor inicial 
   * es `false`, lo que significa que no hay datos de respuesta disponibles 
   * al momento de la inicialización.
   */
  public esDatosRespuesta: boolean = false;


  /**
   * Notificador utilizado para gestionar la destrucción de observables y prevenir fugas de memoria.
   * Este Subject emite un valor cuando el componente se destruye, indicando que los suscriptores deben finalizar.
   * 
   * @private
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor de la clase `PasoUnoCsComponent`.
   * 
   * Este constructor inicializa los servicios necesarios y configura la lógica inicial 
   * para el estado de consulta y las secciones relacionadas con el componente.
   * 
   * @param seccionStore - Servicio para manejar el estado de las secciones.
   * @param consultaQuery - Servicio para consultar el estado de `Consultaio`.
   * @param pantallasActionService - Servicio para manejar acciones relacionadas con las pantallas.
   * 
   * La lógica dentro del constructor realiza las siguientes acciones:
   * - Se suscribe al estado de `Consultaio` utilizando un observable, y actualiza la propiedad `consultaState` 
   *   con el estado actual.
   * - Verifica si el `procedureId` es igual a '230401' y si la propiedad `update` está activa. 
   *   Si ambas condiciones se cumplen, llama al método `guardarDatosFormulario()`. 
   *   En caso contrario, establece la propiedad `esDatosRespuesta` como `true`.
   * - Llama al método `asignarSecciones()` para configurar las secciones iniciales del componente.
   */
  constructor(private seccionStore: SeccionLibStore,
    private consultaQuery: ConsultaioQuery,
    public pantallasActionService: PantallasActionService
  ){
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState && this.consultaState.procedureId === '230401' &&
      this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    this.asignarSecciones();

  }


 
  /**
   * Selecciona una pestaña específica en la interfaz de usuario.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   * 
   * Este método actualiza el valor de `indice` con el índice proporcionado,
   * lo que permite cambiar la pestaña activa en la vista.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }


  /**
   * Método privado que asigna las secciones y establece su validez en el estado de la aplicación.
   * 
   * Este método utiliza las secciones predefinidas del trámite `SECCIONES_TRAMITE_230401` para inicializar
   * dos arreglos: uno que contiene las secciones y otro que indica si cada sección es válida. Posteriormente,
   * actualiza el estado de la aplicación mediante el `seccionStore`.
   * 
   * @remarks
   * - Utiliza un bucle `for-in` para iterar sobre las claves de las secciones predefinidas en `PASO_1`.
   * - Se verifica la propiedad con `Object.prototype.hasOwnProperty.call` para evitar iterar sobre propiedades heredadas.
   * - Se utiliza `@ts-expect-error` para ignorar temporalmente errores de tipo en la asignación de valores de las secciones.
   * 
   * @throws Este método no lanza excepciones directamente, pero los métodos `establecerSeccion` y `establecerFormaValida`
   * podrían generar errores si el estado de la aplicación no está correctamente configurado.
   * 
   * @see SECCIONES_TRAMITE_230401 - Contiene las configuraciones predefinidas de las secciones del trámite.
   * @see seccionStore.establecerSeccion - Método para establecer las secciones en el estado de la aplicación.
   * @see seccionStore.establecerFormaValida - Método para establecer la validez de las secciones en el estado de la aplicación.
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    const PREDETERMINADO = SECCIONES_TRAMITE_230401
    for (const LLAVE_SECCION in PREDETERMINADO.PASO_1) {
      if (Object.prototype.hasOwnProperty.call(PREDETERMINADO.PASO_1, LLAVE_SECCION)) {
        // @ts-expect-error - fix this
        SECCIONES.push(PREDETERMINADO.PASO_1[LLAVE_SECCION]);
        FORMA_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }


    /**
     * Guarda los datos del formulario y actualiza el estado del formulario 
     * basado en la respuesta obtenida del servicio `pantallasActionService`.
     * 
     * Este método realiza una solicitud al servicio `getRegistroTomaMuestrasMercanciasData`
     * y se suscribe a la respuesta. Si se recibe una respuesta válida, se actualiza el estado
     * del formulario utilizando el método `actualizarEstadoFormulario` del servicio.
     * 
     * Además, utiliza un operador `takeUntil` para gestionar la suscripción y evitar
     * fugas de memoria, deteniendo la suscripción cuando el observable `destroyNotifier$`
     * emite un valor.
     * 
     * @remarks
     * Este método es útil para sincronizar los datos del formulario con el estado
     * del backend y garantizar que los datos estén actualizados.
     * 
     * @example
     * // Llamar al método para guardar los datos del formulario
     * this.guardarDatosFormulario();
     */
    guardarDatosFormulario(): void {
      this.pantallasActionService
        .getRegistroTomaMuestrasMercanciasData().pipe(
          takeUntil(this.destroyNotifier$)
        )
        .subscribe((resp) => {
          if(resp){
          this.esDatosRespuesta = true;
          this.pantallasActionService.actualizarEstadoFormulario(resp);
          }
        });
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
