/**
 * @fileoverview
 * El `ContenedorDePasosComponent` es un componente de Angular diseñado para gestionar la navegación de un wizard.
 * Este componente utiliza el `WizardComponent` y otros componentes de pasos (`PasoUnoComponent`, `PasoDosComponent`, `PasoTresComponent`)
 * para proporcionar una experiencia de navegación paso a paso.
 *
 * @module ContenedorDePasosComponent
 * @description
 * Este componente actúa como un contenedor para gestionar y actualizar los datos de navegación del wizard,
 * incluyendo el título mostrado y el índice del paso actual. También permite la navegación entre pasos
 * mediante botones o pestañas.
 */

import {
  AVISO,
  AccionBoton,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  RegistroSolicitudService,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MENSAJE_DE_VALIDACION,
  MENSAJE_DE_VALIDACION_PAGO_DERECHOS,
  PASOS,
} from '../../constants/pasos.enum';
import {
  Tramite260208State,
  Tramite260208Store,
} from '../../estados/tramite260208Store.store';
import { AlertComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { GuardarMappingAdapter } from '../../adapters/guardar-mapping.adapter';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260208Query } from '../../estados/tramite260208Query.query';
import { WizardComponent } from '@ng-mf/data-access-user';

/**
 * @component
 * @name ContenedorDePasosComponent
 * @description
 * Componente contenedor que utiliza el `WizardComponent` para gestionar la navegación paso a paso.
 * Este componente interactúa con los pasos definidos (`PasoUnoComponent`, `PasoDosComponent`, `PasoTresComponent`)
 * y actualiza dinámicamente el título y el índice del paso actual.
 *
 * @selector app-contenedor-de-pasos
 * Define el selector del componente que se utiliza en las plantillas HTML para instanciar este componente.
 *
 * @standalone true
 * Indica que este componente es independiente y no requiere un módulo Angular para ser utilizado.
 *
 * @templateUrl ./contenedor-de-pasos.component.html
 * Especifica la ubicación del archivo de plantilla HTML asociado con este componente.
 *
 * @styleUrl ./contenedor-de-paso.component.scss
 * Especifica la ubicación del archivo de estilos CSS asociado con este componente.
 *
 * @imports
 * - CommonModule: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 * - WizardComponent: Componente que gestiona la navegación del wizard.
 * - PasoUnoComponent, PasoDosComponent, PasoTresComponent: Componentes que representan los pasos del wizard.
 * - BtnContinuarComponent: Componente para gestionar los botones de navegación.
 * - AlertComponent: Componente para mostrar mensajes de alerta.
 */
@Component({
  selector: 'app-contenedor-de-pasos',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    BtnContinuarComponent,
    AlertComponent,
    NotificacionesComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
  ],
  templateUrl: './contenedor-de-pasos.component.html',
  styleUrl: './contenedor-de-paso.component.scss',
})
export class ContenedorDePasosComponent implements OnInit {
  /**
   * @property {string | null} tituloMensaje
   * @description
   * Título principal mostrado en la parte superior según el paso actual.
   */
  tituloMensaje: string | null =
    'Permiso sanitario de importación de medicamentos destinados a uso personal';

  /**
   * @property {string} TEXTOS
   * @description
   * Texto de aviso utilizado en el componente.
   */
  TEXTOS: string = AVISO.Aviso;

  /**
   * @property {string} infoAlert
   * @description
   * Clase CSS para aplicar estilos a los mensajes de información.
   */
  public infoAlert = 'alert-info  text-center';

  /**
   * @property {ListaPasosWizard[]} pasos
   * @description
   * Lista de pasos del wizard obtenidos desde una constante externa.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * @description
   * Índice actual del paso seleccionado (empieza en 1).
   */
  indice: number = 1;

  /**
   * @property {WizardComponent} wizardComponent
   * @description
   * Referencia al componente Wizard para controlar navegación entre pasos.
   */
  @ViewChild('WizardComponent') wizardComponent!: WizardComponent;

  /**
   * Clase CSS para mostrar una alerta de error.
   */
  infoError = 'alert-danger text-center';

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValido: boolean = false;

  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante
   * `@ViewChild`. Permite acceder a sus métodos y propiedades
   * desde este componente padre.
   */
  @ViewChild('PasoUnoComponent')
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /**
   * @property {boolean} requiresPaymentData
   * @description
   * Indica si se requieren datos de pago para continuar con el trámite.
   */
  public requiresPaymentData: boolean = false;

  /**
   * @property {number} confirmarSinPagoDeDerechos
   * @description
   * Indica si se ha confirmado la continuación sin pago de derechos.
   */
  public confirmarSinPagoDeDerechos: number = 0;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarFilaNotificacion!: Notificacion;

  /**
   * @property {string} MENSAJE_DE_ERROR
   * @description
   * Propiedad usada para almacenar el mensaje de error actual.
   * Se inicializa como cadena vacía y se actualiza en función
   * de las validaciones o errores capturados en el flujo.
   */
  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert!: string;

  /**
   * @property {Tramite260208State} storeData
   * @description Estado de la tienda para el trámite 260208.
   */
  storeData!: Tramite260208State;

  /**
   * Identificador del tipo de trámite.
   * @type {string}
   */
  idTipoTramite: string = '260208';

  /**
   * ID del estado de la solicitud.
   * @type {number | null}
   */
  idSolicitudState!: number | null;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  esMostrarAlerta: boolean = false;

  /**
   * @property {boolean} activarBotonCargaArchivos
   * @description
   * Indica si el botón para cargar archivos está habilitado. Controla la
   * disponibilidad de la funcionalidad de carga de documentos según el
   * estado actual del proceso.
   *
   * @ui_control Control de habilitación de botón
   * @file_upload_state Estado de disponibilidad de carga
   * @default false - Deshabilitado por defecto
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * @property {boolean} cargaEnProgreso
   * @description
   * Indica si hay una operación de carga en progreso. Utilizado para mostrar
   * indicadores de carga y prevenir acciones concurrentes durante procesos.
   *
   * @loading_indicator Estado de carga en progreso
   * @ui_feedback Feedback visual para usuario
   * @concurrent_prevention Prevención de operaciones concurrentes
   * @default true - Inicia con carga activa
   */
  cargaEnProgreso: boolean = true;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

  /**
   * @property {boolean} seccionCargarDocumentos
   * @description
   * Indica si la sección de carga de documentos está activa. Controla la
   * visibilidad y disponibilidad de la interfaz de carga de documentos.
   *
   * @section_visibility Control de visibilidad de sección
   * @document_upload_ui Estado de interfaz de carga
   * @default true - Activa al inicio para mostrar sección inicial
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * @property {EventEmitter<void>} cargarArchivosEvento
   * @description
   * Evento que se emite para iniciar el proceso de carga de archivos. Notifica a
   * componentes hijos o servicios que deben activar la funcionalidad de carga
   * de documentos requeridos para el trámite.
   *
   * @event_emission Emisión de evento para carga de documentos
   * @file_upload_trigger Disparador de funcionalidad de carga
   * @component_communication Comunicación entre componentes padre-hijo
   */
  cargarArchivosEvento = new EventEmitter<void>();

  constructor(
    private toastrService: ToastrService,
    private registroSolicitudService: RegistroSolicitudService,
    public tramiteQuery: Tramite260208Query,
    public tramite260208Store: Tramite260208Store
  ) {}

  ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * @property {DatosPasos} datosPasos
   * @description
   * Objeto de configuración utilizado por el componente wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @method seleccionaTab
   * @description
   * Cambia el índice actual del wizard manualmente.
   *
   * @param {number} i - Índice del paso al que se desea cambiar.
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * ```typescript
   * this.seleccionaTab(2); // Cambia al paso 2
   * ```
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * @description Actualiza el índice y el título del mensaje según la acción del botón.
   * Navega hacia adelante o hacia atrás en el wizard.
   * @param {AccionBoton} e - Objeto que contiene el valor del índice y la acción ('cont' o 'atras').
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarPasoUno();
      }

      if (
        !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() &&
        this.requiresPaymentData
      ) {
        this.confirmarSinPagoDeDerechos = 2;
      } else {
        this.confirmarSinPagoDeDerechos = 3;
      }

      if (!this.requiresPaymentData) {
        if (
          !this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor()
        ) {
          this.mostrarAlerta = true;
          this.seleccionarFilaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE_DE_VALIDACION_PAGO_DERECHOS,
            cerrar: true,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'SI',
            txtBtnCancelar: 'NO',
            alineacionBtonoCerrar: 'flex-row-reverse',
          };
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        } else if (
          this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() &&
          !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor()
        ) {
          this.confirmarSinPagoDeDerechos = 2;
        } else if (
          this.pasoUnoComponent.pagoDeDerechosContenedoraComponent.validarContenedor() &&
          this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() &&
          !this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()
        ) {
          this.confirmarSinPagoDeDerechos = 3;
        }
      }

      if (!isValid) {
        this.formErrorAlert = this.MENSAJE_DE_ERROR;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      const PAYLOAD = GuardarMappingAdapter.toFormPayload(this.storeData);
      let shouldNavigate = false;
      this.registroSolicitudService
        .postGuardarDatos(this.idTipoTramite, PAYLOAD)
        .subscribe((response) => {
          shouldNavigate = response.codigo === '00';
          if (!shouldNavigate) {
            const ERROR_MESSAGE =
              response.mensaje || 'Error desconocido en la solicitud';
            this.formErrorAlert =
              ContenedorDePasosComponent.generarAlertaDeError(ERROR_MESSAGE);
            this.esFormaValido = true;
            this.indice = 1;
            this.datosPasos.indice = 1;
            this.wizardComponent.indiceActual = 1;
            setTimeout(
              () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              0
            );
            return;
          }
          if (shouldNavigate) {
            if (esValidObject(response) && esValidObject(response.datos)) {
              this.esFormaValido = false;
              const DATOS = response.datos as { id_solicitud?: number };
              const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud)
                ? DATOS.id_solicitud ?? 0
                : 0;
              this.idSolicitudState = ID_SOLICITUD;
              this.tramite260208Store.setIdSolicitud(ID_SOLICITUD);
            }
            // Calcular el nuevo índice basado en la acción
            let indiceActualizado = e.valor;
            if (e.accion === 'cont') {
              indiceActualizado = e.valor;
            }
            this.toastrService.success(response.mensaje);
            if (indiceActualizado > 0 && indiceActualizado < 5) {
              this.indice = indiceActualizado;
              this.datosPasos.indice = indiceActualizado;
              if (e.accion === 'cont') {
                this.wizardComponent.siguiente();
              } else {
                this.wizardComponent.atras();
              }
            }
          } else {
            this.toastrService.error(response.mensaje);
          }
        });
    } else {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }

  /**
   * @method cargaRealizada
   * @description
   * Método para manejar el evento de finalización del proceso de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos basado en el resultado
   * de la operación de carga.
   *
   * @param {boolean} cargaRealizada - Indica si la carga de documentos se realizó
   *                                  correctamente (true) o falló (false)
   *
   * @state_management
   * Actualiza `seccionCargarDocumentos`:
   * - `false` si la carga fue exitosa (oculta sección)
   * - `true` si la carga falló (mantiene sección visible)
   *
   * @ui_control
   * Controla la visibilidad de:
   * - Sección de carga de documentos
   * - Botones de acción relacionados
   * - Indicadores de estado de carga
   *
   * @workflow_progression
   * Permite progresión del flujo:
   * - Oculta sección al completar carga exitosa
   * - Mantiene accesible para retry en caso de fallo
   *
   * @param {boolean} cargaRealizada
   * @returns {void}
   * @document_upload_handler
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * @method manejaEventoCargaDocumentos
   * @description
   * Método para manejar eventos relacionados con el estado de carga de documentos.
   * Actualiza el estado del botón de carga de archivos basado en la disponibilidad
   * o progreso de la funcionalidad de carga.
   *
   * @param {boolean} carga - Indica si la funcionalidad de carga de documentos
   *                         está activa (true) o inactiva (false)
   *
   * @button_state_control
   * Actualiza `activarBotonCargaArchivos` para:
   * - Habilitar botón cuando carga está disponible
   * - Deshabilitar durante procesos o cuando no aplique
   * - Proporcionar feedback visual al usuario
   *
   * @user_interaction
   * Controla la interacción del usuario con:
   * - Botones de carga de archivos
   * - Elementos de UI relacionados con documentos
   * - Estados de habilitación/deshabilitación
   *
   * @workflow_coordination
   * Coordina el flujo de trabajo:
   * - Habilita carga cuando es apropiado
   * - Previene acciones durante procesos
   * - Sincroniza estado con otros componentes
   *
   * @param {boolean} carga
   * @returns {void}
   * @ui_state_manager
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * @method siguiente
   * @description
   * Método para navegar programáticamente al siguiente paso del wizard.
   * Ejecuta la transición forward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   *
   * @navigation_forward
   * Realiza navegación que:
   * - Ejecuta validación de documentos cargados (comentario indica validación futura)
   * - Avanza al siguiente paso usando `wizardComponent.siguiente()`
   * - Actualiza índice local basado en posición del wizard
   * - Sincroniza datos de pasos con nueva posición
   *
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component
   * - Datos de configuración de pasos
   * - Estado visual de la UI
   *
   * @future_validation
   * Comentario indica que se implementará:
   * - Validación de documentos cargados
   * - Verificación de completitud de adjuntos
   * - Control de calidad de archivos
   *
   * @state_update
   * Actualiza:
   * - `indice`: Posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   *
   * @void
   * @programmatic_navigation
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * @method blancoObligatoria
   * @description Método para manejar el evento de documentos obligatorios en blanco.
   * Actualiza la bandera `isSaltar` basada en el estado recibido.
   * @param {boolean} enBlanco - Indica si hay documentos obligatorios en blanco.
   * @return {void}
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * @method saltar
   * @description
   * Método para saltar directamente al paso de firma en el wizard.
   * Actualiza los índices correspondientes y ejecuta la transición
   * forward en el componente wizard.
   */
  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }

  /**
   * @method anterior
   * @description
   * Método para navegar programáticamente al paso anterior del wizard.
   * Ejecuta la transición backward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   *
   * @navigation_backward
   * Realiza navegación que:
   * - Retrocede al paso anterior usando `wizardComponent.atras()`
   * - Actualiza índice local basado en nueva posición del wizard
   * - Sincroniza datos de pasos con posición actualizada
   * - Mantiene consistencia de estado durante retroceso
   *
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component
   * - Datos de configuración de pasos
   * - Estado visual de navegación
   *
   * @state_preservation
   * Durante retroceso:
   * - Preserva datos capturados en pasos anteriores
   * - Mantiene validaciones ya realizadas
   * - Conserva estado de formularios
   *
   * @state_update
   * Actualiza:
   * - `indice`: Nueva posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   *
   * @void
   * @backward_navigation
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * @method onClickCargaArchivos
   * @description
   * Método de manejo de eventos para el click en botón de carga de archivos.
   * Emite evento que notifica a componentes interesados que deben activar
   * la funcionalidad de carga de documentos.
   *
   * @event_emission
   * Emite evento:
   * - `cargarArchivosEvento`: Sin parámetros (void)
   * - Notifica inicio de proceso de carga
   * - Activa funcionalidad en componentes suscritos
   *
   * @component_communication
   * Facilita comunicación:
   * - Entre componente padre e hijos
   * - Con servicios de carga de archivos
   * - Con sistemas de gestión de documentos
   *
   * @user_interaction
   * Responde a:
   * - Click en botón de carga
   * - Acción intencional del usuario
   * - Iniciación de flujo de documentos
   *
   * @workflow_trigger
   * Desencadena:
   * - Apertura de dialogo de archivos
   * - Activación de componentes de carga
   * - Inicio de proceso de validación de documentos
   *
   * @void
   * @event_handler
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * @method onCargaEnProgreso
   * @description
   * Método para manejar el estado de progreso de carga de archivos.
   * Actualiza la bandera de carga en progreso para controlar UI y
   * prevenir acciones concurrentes durante procesos de carga.
   *
   * @param {boolean} carga - Indica si hay una operación de carga en progreso
   *                         (true) o si ha terminado (false)
   *
   * @loading_state_management
   * Controla estado de carga para:
   * - Mostrar/ocultar indicadores de progreso
   * - Habilitar/deshabilitar botones durante carga
   * - Prevenir acciones concurrentes
   * - Proporcionar feedback visual al usuario
   *
   * @ui_feedback
   * Actualiza `cargaEnProgreso` para:
   * - Mostrar spinners o barras de progreso
   * - Deshabilitar botones durante operaciones
   * - Indicar estado de procesamiento
   * - Mejorar experiencia de usuario
   *
   * @concurrent_operation_control
   * Previene:
   * - Múltiples cargas simultáneas
   * - Navegación durante procesos
   * - Acciones conflictivas
   * - Corrupción de datos
   *
   * @param {boolean} carga
   * @returns {void}
   * @loading_indicator_controller
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description
   * Devuelve el título a mostrar según el número de paso.
   *
   * @param {number} valor - Índice del paso actual.
   * @returns {string} - Título correspondiente.
   *
   * @example
   * ```typescript
   * const titulo = ContenedorDePasosComponent.obtenerNombreDelTítulo(2);
   * console.log(titulo); // 'Anexar requisitos'
   * ```
   */
  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return 'Permiso sanitario de importación de medicamentos con registro sanitario';
      case 2:
        return 'Anexar requisitos';
      case 3:
        return 'Firmar solicitud';
      default:
        return 'Permiso sanitario de importación de medicamentos con registro sanitario';
    }
  }

  /**   * @method cerrarModal
   * @description
   * Maneja el cierre del modal de alerta y actualiza el estado según la respuesta del usuario.
   * @param {boolean} value - Indica si se confirmó la acción (true) o se canceló (false).
   */
  cerrarModal(value: boolean): void {
    if (value) {
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
      if (
        !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validarContenedor() &&
        this.requiresPaymentData
      ) {
        this.confirmarSinPagoDeDerechos = 2;
      } else {
        this.confirmarSinPagoDeDerechos = 3;
      }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
  }

  /**
   * Genera una alerta de error con los mensajes proporcionados.
   * @param mensajes Mensajes de error a mostrar en la alerta.
   * @returns HTML de la alerta de error.
   */
  static generarAlertaDeError(mensajes: string): string {
    const ALERTA = `
      <div class="row">
<div class="col-md-12 justify-content-center text-center">
  <div class="row">
    <div class="col-md-12">
    <p>Corrija los siguientes errores:</p>
    <ol>
    <li>${mensajes}</li>
    </ol>
    </div>
  </div>
</div>
</div>
`;
    return ALERTA;
  }
}
