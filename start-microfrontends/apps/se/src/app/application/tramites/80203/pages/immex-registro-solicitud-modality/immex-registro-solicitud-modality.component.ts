/**
 * @component ImmexRegistroSolicitudModalityComponent
 * @description Este componente es responsable de manejar el flujo de pasos para el registro de solicitud IMMEX.
 * Incluye la lógica para la navegación entre pasos y la obtención de títulos.
 */
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, RegistroSolicitudService, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { ERROR_ALERT, ERROR_DETALLE_ALERT, ERROR_FRACCION_ALERT, PASOS } from '../../constantes/immex-registro-de-solicitud-modality.enums';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';

import { ImmexRegistroState, ImmexRegistroStore } from '../../estados/tramites/tramite80203.store';
import { ImmexRegistroQuery } from '../../estados/queries/tramite80203.query';
import { buildGuardarPayload } from '../../mappers/guardar.mapper';

/**
 * @interface AccionBoton
 * @description Interfaz que define la estructura de un objeto que representa la acción y el valor 
 * asociado a un botón del asistente de pasos. Esta interfaz se utiliza para controlar la 
 * navegación entre los diferentes pasos del wizard.
 *
 * @property {string} accion - Tipo de acción a realizar. Los valores posibles son:
 *                            - 'cont': Para avanzar al siguiente paso
 *                            - 'atras': Para retroceder al paso anterior
 * @property {number} valor - Índice numérico del paso al que se desea navegar. 
 *                           Debe estar en el rango válido de pasos (1-4)
 * @since 1.0.0
 * @author Equipo de Desarrollo
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * @class ImmexRegistroSolicitudModalityComponent
 * @description Componente Angular responsable de gestionar el flujo de pasos (wizard) para el 
 * registro de solicitudes IMMEX (Industria Manufacturera, Maquiladora y de Servicios de 
 * Exportación). Este componente proporciona una interfaz de usuario interactiva que guía 
 * al usuario a través de múltiples pasos para completar el proceso de registro.
 * 
 * Funcionalidades principales:
 * - Navegación entre pasos del asistente
 * - Validación de índices de pasos
 * - Gestión del estado del wizard
 * - Control de botones de navegación
 * 
 * @implements OnInit (implícito)
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 * @version 1.0.0
 */
@Component({
  selector: 'app-immex-registro-solicitud-modality',
  templateUrl: './immex-registro-solicitud-modality.component.html',
})
export class ImmexRegistroSolicitudModalityComponent implements OnInit {

  /**
   * @property {Array<ListaPasosWizard>} pasos
   * @description Arreglo que contiene la configuración y estructura de todos los pasos que 
   * conforman el asistente (wizard) de registro IMMEX. Cada elemento del arreglo representa 
   * un paso específico con su título, descripción, estado de validación y otros metadatos 
   * necesarios para la navegación del wizard.
   * 
   * Los pasos se obtienen de la constante PASOS importada desde el archivo de enums.
   * Esta estructura permite mantener un control ordenado y secuencial del flujo de trabajo.
   * 
   * @type {Array<ListaPasosWizard>}
   * @default PASOS (constante importada)
   * @memberof ImmexRegistroSolicitudModalityComponent
   * @since 1.0.0
   * @see {@link PASOS} - Constante que define los pasos del wizard
   */
  pasos: Array<ListaPasosWizard> = PASOS;

  /**
   * @property {string | null} tituloMensaje
   * @description Propiedad que almacena el título principal que se muestra en la interfaz del 
   * asistente. Este título proporciona contexto al usuario sobre el tipo de trámite que está 
   * realizando. Puede ser null en caso de que no se haya definido un título específico.
   * 
   * Por defecto se establece con el valor 'Zoosanitario para importación', pero puede ser 
   * modificado dinámicamente según las necesidades del proceso o el tipo de solicitud.
   * 
   * @type {string | null}
   * @default 'Zoosanitario para importación'
   * @memberof ImmexRegistroSolicitudModalityComponent
   * @since 1.0.0
   * @example
   * // Cambiar el título dinámicamente
   * this.tituloMensaje = 'Nuevo título del proceso';
   */
  tituloMensaje: string | null = 'Zoosanitario para importación';

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente hijo WizardComponent obtenida mediante ViewChild.
   * Esta referencia permite al componente padre interactuar directamente con los métodos 
   * y propiedades del wizard, especialmente para controlar la navegación programática 
   * entre pasos.
   * 
   * A través de esta referencia se pueden invocar métodos como siguiente() y atras() 
   * para navegar entre los pasos del asistente. El signo de exclamación (!) indica 
   * que la propiedad será inicializada por Angular después de la construcción del componente.
   * 
   * @type {WizardComponent}
   * @decorator @ViewChild(WizardComponent)
   * @memberof ImmexRegistroSolicitudModalityComponent
   * @since 1.0.0
   * @see {@link WizardComponent} - Componente hijo que maneja la lógica del wizard
   * @example
   * // Navegar al siguiente paso
   * this.wizardComponent.siguiente();
   * 
   * // Navegar al paso anterior
   * this.wizardComponent.atras();
   */
  @ViewChild('wizzard') wizardComponent!: WizardComponent;
  /**
   * @property {PasoUnoComponent} pasoUno
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente,
   * especialmente para validar todos sus formularios antes de avanzar al siguiente paso.
   */
  @ViewChild('pasoUno') pasoUno!: PasoUnoComponent;

  /**
   * @property {boolean} isValid
   * @description
   * Indica si la validación general del paso actual es correcta.
   * Se utiliza para controlar la navegación entre pasos del wizard.
   * Se establece a `false` cuando hay errores de validación que impiden el avance.
   */
  isValid: boolean = true;

  /**
   * @property {string} errorAlerta
   * @description
   * Contiene el mensaje HTML de error que se muestra al usuario cuando la validación falla.
   * Puede contener diferentes tipos de alertas según el tipo de error:
   * - ERROR_ALERT: Cuando faltan tanto permisos IMMEX como fracciones
   * - ERROR_FRACCION_ALERT: Cuando faltan fracciones arancelarias
   * - ERROR_DETALLE_ALERT: Cuando falta información del detalle de mercancía
   */
  public errorAlerta!:string

  /**
   * @property {number} indice
   * @description Propiedad que mantiene el índice del paso actual en el que se encuentra 
   * el usuario dentro del asistente. Este valor se utiliza para controlar la posición 
   * actual en el flujo del wizard y determinar qué contenido mostrar.
   * 
   * El índice es base 1 (comienza en 1, no en 0) y debe mantenerse dentro del rango 
   * válido de pasos disponibles. Se actualiza automáticamente cuando el usuario 
   * navega entre pasos.
   * 
   * @type {number}
   * @default 1
   * @memberof ImmexRegistroSolicitudModalityComponent
   * @since 1.0.0
   * @range 1-4 (según validación en getValorIndice)
   * @example
   * // Establecer el paso actual
   * this.indice = 2; // Usuario en el segundo paso
   */
  indice: number = 1;

  /**
   * @property {DatosPasos} datosPasos
   * @description Objeto que encapsula toda la información necesaria para la configuración 
   * y funcionamiento del asistente de pasos. Contiene metadatos como el número total de 
   * pasos, el índice actual, y los textos de los botones de navegación.
   * 
   * Esta configuración se pasa al componente wizard hijo para que pueda renderizar 
   * correctamente la interfaz de usuario y manejar la navegación. Se inicializa con 
   * valores por defecto basados en las propiedades del componente.
   * 
   * Propiedades incluidas:
   * - nroPasos: Número total de pasos en el wizard
   * - indice: Paso actual (sincronizado con this.indice)
   * - txtBtnAnt: Texto del botón para retroceder
   * - txtBtnSig: Texto del botón para avanzar
   * 
   * @type {DatosPasos}
   * @memberof ImmexRegistroSolicitudModalityComponent
   * @since 1.0.0
   * @see {@link DatosPasos} - Interfaz que define la estructura de los datos
   * @example
   * // Actualizar el texto de los botones
   * this.datosPasos.txtBtnAnt = 'Regresar';
   * this.datosPasos.txtBtnSig = 'Siguiente';
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Evento que se emite para regresar a la sección de carga de documentos.
   * Este evento se utiliza para notificar a otros componentes que se debe regresar a la sección de carga de documentos.
   */
  regresarSeccionCargarDocumentoEvento = new EventEmitter<void>();

  /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

  /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Estado del formulario de registro IMMEX.
   */
  storeData!: ImmexRegistroState;

  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
   public formErrorAlert!:string;

  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger';

  /**
   * @property {boolean} IMMEXTablaError
   * @description
   * Indica si existe un error relacionado con la tabla de permisos IMMEX.
   * Se establece a `true` cuando la tabla de permisos IMMEX está vacía y es requerida para la validación.
   * Utilizado para mostrar mensajes de error específicos al usuario.
   */
  IMMEXTablaError!: boolean;

  /**
   * @property {boolean} fraccionTablaError
   * @description
   * Indica si existe un error relacionado con la tabla de fracciones arancelarias.
   * Se establece a `true` cuando la tabla de fracciones arancelarias está vacía y es requerida para la validación.
   * Utilizado para mostrar mensajes de error específicos al usuario.
   */
  fraccionTablaError!: boolean;

  /**
   * @property {boolean} mercanciaImportacionFormError
   * @description
   * Indica si existe un error relacionado con el formulario de mercancía de importación.
   * Se establece a `true` cuando el formulario de mercancía de importación es inválido.
   * Utilizado para mostrar mensajes de error específicos al usuario.
   */
  mercanciaImportacionFormError: boolean = false;

  constructor(public immexRegistroQuery: ImmexRegistroQuery, public immexRegistroStore: ImmexRegistroStore, public registroSolicitudService: RegistroSolicitudService, private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.immexRegistroQuery.selectImmexRegistro$.pipe().subscribe((data) => {
      this.storeData = data;
      this.IMMEXTablaError = data.IMMEXTablaError;
      this.fraccionTablaError = data.fraccionTablaError;
      this.mercanciaImportacionFormError = data.mercanciaImportacionFormError;
    }); 


  }

  /**
   * @method getValorIndice
   * @description Método principal para manejar la navegación entre pasos del asistente.
   * Recibe un objeto AccionBoton que contiene la acción a realizar y el índice del paso
   * de destino. Realiza validaciones de rango y ejecuta la navegación correspondiente
   * a través del componente wizard.
   * 
   * El método valida que el índice esté dentro del rango permitido (1-4) antes de 
   * proceder con la navegación. Actualiza el índice actual y delega la navegación 
   * física al componente WizardComponent.
   * 
   * Acciones soportadas:
   * - 'cont': Avanza al siguiente paso usando wizardComponent.siguiente()
   * - 'atras': Retrocede al paso anterior usando wizardComponent.atras()
   * - Cualquier otra acción: Retrocede por defecto
   * 
   * @param {AccionBoton} e - Objeto que encapsula la acción y el valor del paso destino
   * @param {string} e.accion - Tipo de acción: 'cont' para avanzar, 'atras' para retroceder
   * @param {number} e.valor - Índice del paso destino (debe estar entre 1 y 4)
   * 
   * @returns {void}
   * @memberof ImmexRegistroSolicitudModalityComponent
   * @since 1.0.0
   * @throws {Error} No lanza errores explícitos, pero ignora valores fuera de rango
   * 
   * @example
   * // Avanzar al paso 2
   * this.getValorIndice({ accion: 'cont', valor: 2 });
   * 
   * // Retroceder al paso 1
   * this.getValorIndice({ accion: 'atras', valor: 1 });
   * 
   * @see {@link AccionBoton} - Interfaz del parámetro de entrada
   * @see {@link WizardComponent.siguiente} - Método para avanzar pasos
   * @see {@link WizardComponent.atras} - Método para retroceder pasos
   */
  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const ISVALID = this.validarTodosFormulariosPasoUno() ?? false;
      this.isValid = ISVALID;
      if (!this.isValid) {
        if(this.IMMEXTablaError && this.fraccionTablaError){
          this.errorAlerta = ERROR_ALERT;
        }
        else if(this.fraccionTablaError){
          this.errorAlerta = ERROR_FRACCION_ALERT;
        }
        else if(this.mercanciaImportacionFormError){
          this.errorAlerta = ERROR_DETALLE_ALERT;
        }
        this.datosPasos.indice = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

    const PAYLOAD = buildGuardarPayload(this.storeData);
    let shouldNavigate = false;
    this.registroSolicitudService.postGuardarDatos('80203', PAYLOAD).subscribe(response => {
      shouldNavigate = response.codigo === '00';
      if (!shouldNavigate) {
        const ERROR_MESSAGE = response.error || 'Error desconocido en la solicitud';
        this.formErrorAlert = ImmexRegistroSolicitudModalityComponent.generarAlertaDeError(ERROR_MESSAGE);
        this.isValid = false;
        this.indice = 1;
        this.datosPasos.indice = 1;
        this.wizardComponent.indiceActual = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      if(shouldNavigate) {
        if(esValidObject(response) && esValidObject(response.datos)) {
          const DATOS = response.datos as { id_solicitud?: number };
          if(getValidDatos(DATOS.id_solicitud)) {
            this.immexRegistroStore.setIdSolicitud(DATOS.id_solicitud ?? 0);
          } else {
            this.immexRegistroStore.setIdSolicitud(0);
          }
        }
        // Calcular el nuevo índice basado en la acción
        let indiceActualizado = e.valor;
        if (e.accion === 'cont') {
          indiceActualizado = e.valor;
          this.indice = indiceActualizado;
        }
        this.toastrService.success(response.mensaje);
        
      } else {
        this.toastrService.error(response.mensaje);
      }
    })
    }
    else {
      if (e.valor > 0 && e.valor < 5) {
        this.indice = e.valor;
        if (e.accion === 'cont') {
          this.wizardComponent.siguiente();
        } else {
          this.wizardComponent.atras();
        }
      }
    }
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
  * Método para manejar el evento de carga de documentos.
  * Actualiza el estado del botón de carga de archivos.
  *  carga - Indica si la carga de documentos está activa o no.
  * {void} No retorna ningún valor.
  */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

   public static generarAlertaDeError(mensajes:string): string {
    const ALERTA = `
      <div class="d-flex justify-content-center text-center">
        <div class="col-md-12 p-3  border-danger  text-danger rounded">
          <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

          <div class="d-flex justify-content-start mb-1">
            <span class="me-2">1.</span>
            <span class="flex-grow-1 text-center">${mensajes}</span>
          </div>  
        </div>
      </div>
      `;
      return ALERTA;
  }

  /**
   * @method validarTodosFormulariosPasoUno
   * @description Método privado que valida todos los formularios del primer paso del asistente IMMEX.
   * Este método verifica si el componente `PasoUnoComponent` está disponible y si todos sus 
   * formularios han sido correctamente validados antes de permitir el avance al siguiente paso.
   * 
   * El método implementa una validación defensiva que retorna `true` si el componente pasoUno
   * no está disponible (caso de gracia), y delega la validación real al método 
   * `validarFormularios()` del componente hijo.
   * 
   * Este método es crucial para mantener la integridad del flujo del wizard, asegurando que
   * solo se permita avanzar cuando todos los datos requeridos hayan sido ingresados correctamente.
   * 
   * @private
   * @returns {boolean} Resultado de la validación:
   *                   - `true`: Si no hay componente pasoUno (caso de gracia) o si todos los formularios son válidos
   *                   - `false`: Si algún formulario del paso uno es inválido o no ha sido completado
   * @memberof ImmexRegistroSolicitudModalityComponent
   * @since 1.0.0
   * @see {@link PasoUnoComponent.validarFormularios} - Método que realiza la validación de los formularios
   * @see {@link getValorIndice} - Método que utiliza esta validación para controlar la navegación
   * 
   * @example
   * ```typescript
   * // Uso interno en el método getValorIndice
   * if (this.indice === 1) {
   *   const ISVALID = this.validarTodosFormulariosPasoUno() ?? false;
   *   this.isValid = ISVALID;
   *   if (!this.isValid) {
   *     // Mostrar errores y no avanzar
   *     return;
   *   }
   * }
   * ```
   * 
   * @throws No lanza excepciones directas, pero depende del comportamiento del componente hijo
   * @complexity O(1) - Operación de complejidad constante
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUno) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUno.validarFormularios();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }
}