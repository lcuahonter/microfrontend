import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import {
  AlertComponent,
  BtnContinuarComponent,
  CategoriaMensaje,
  DatosPasos,
  DocumentosFirmaStore,
  SECCIONES_TRAMITE_220402,
  TipoNotificacionEnum,
  Usuario,
} from '@ng-mf/data-access-user';
import { SeccionState,SeccionStore } from '../../../../estados/seccion.store';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import {
  ERROR_FORMA_ALERT,
  MENSAJE_DE_EXITO_ETAPA_UNO,
  PASOS,
  Payload220402
} from '../../constantes/certificado-zoosanitario.enum';
import { Solicitud220402State, Solicitud220402Store } from '../../estados/tramites/tramites220402.store';
import { ListaPasosWizard } from '../../models/pantallas-captura.model';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SeccionQuery } from '../../../../estados/queries/seccion.query';
import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';

/**
 *
 * Interfaz que define la estructura de un objeto de acción de botón.
 */
interface AccionBoton {
  /**
   * @property {string} accion - El accion del paso.
   */
  accion: string;
  /**
   * @property {number} valor - El valor del paso en el asistente.
   */
  valor: number;
}

/**
 * Componente para la vista de la solicitud-page de la sección de "220402".
 */

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    AlertComponent
  ],
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;
  idSolicitud:string = '';
    activarBotonCargaArchivos: boolean = false;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   * }
   */
  esFormaValido: boolean = false;
  datosUsuario: Usuario = USUARIO_INFO;
   /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;
  /**
   * @property {ListaPasosWizard[]} pasos - Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

    /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * @property {number} indice - Índice actual del paso.
   */
  indice: number = 1;

  /**
   * Objeto con los textos de los requisitos.
   * @property {object} TEXTOS_REQUISITOS - Textos para los requisitos del certificado zoosanitario. --220201
   */
  TEXTOS = MENSAJE_DE_EXITO_ETAPA_UNO;

  /**
   * @property {SeccionState} seccion - Estado de la sección actual.
   */
  public seccion: SeccionState = {
    seccion: [],
    formaValida: [],
  };
  /**
   * @ignore
   * @private
   * @property {Subject<void>} destroyNotifier$ - Un `Subject` utilizado para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente hijo WizardComponent para controlar la navegación del asistente.
   * Permite acceder a los métodos públicos del wizard desde este componente.
   *
   * @type {WizardComponent}
   * @memberof SolicitudPageComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
   /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   * const isValid = this.pasoUnoComponent.validateForms();
   * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
  /**
   * @property {number} nroPasos - Número total de pasos.
   * @property {number} indice - Índice actual del paso.
   * @property {string} txtBtnAnt - Texto del botón para ir al paso anterior.
   * @property {string} txtBtnSig - Texto del botón para ir al siguiente paso.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @description Constructor del componente. Inyecta las dependencias necesarias.
   * @param {SeccionQuery} seccionQuery - Servicio para consultar el estado de la sección.
   * @param {SeccionStore} seccionStore - Servicio para manejar el estado de la sección.
   * @param {MediodetransporteService} medioDeTransporteService - Servicio para las llamadas API del trámite.
   * @param {Solicitud220402Query} solicitud220402Query - Query de Akita para el estado de la solicitud.
   * @param {NotificacionesService} notificaciones - Servicio para mostrar notificaciones al usuario.
   */
  constructor(
    private seccionQuery: SeccionQuery,
    private seccionStore: SeccionStore,
    private medioDeTransporteService: MediodetransporteService,
    private solicitud220402Store:Solicitud220402Store,
    private solicitud220402Query: Solicitud220402Query,
        private documentosFirmaStore: DocumentosFirmaStore,
    private notificaciones: NotificacionesService
  ) {}

  /**
   * @ignore
   * @description Método que se ejecuta al inicializar el componente.
   * Suscribe al estado de la sección y asigna las secciones.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    this.asignarSecciones();
  }

  /**
   * @description Método para seleccionar una pestaña específica.
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
 * Método para manejar el evento de carga de documentos.
 * Actualiza el estado de la sección de carga de documentos.
 *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
 * {void} No retorna ningún valor.
 */
cargaRealizada(cargaRealizada: boolean): void {
  this.seccionCargarDocumentos = cargaRealizada ? false : true;
}
/**
    * Maneja el evento de carga en progreso emitido por un componente hijo.
    * Actualiza el estado de cargaEnProgreso según el valor recibido.
    * @param cargando Valor booleano que indica si la carga está en progreso.
    */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }

  /**
   * Actualiza el índice basado en el valor de la acción proporcionada y navega en el componente wizard.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor y la acción del botón.
   * @param {number} e.valor - Valor del índice que debe estar entre 1 y 4.
   * @param {string} e.accion - Acción a realizar, puede ser 'cont' para avanzar o cualquier otro valor para retroceder.
   *
   * @returns {void}
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      if (this.indice === 1) {
        // Llama al nuevo método de validación centralizado.
        if (!this.areAllTabsValid()) {
          this.esFormaValido = true;
          // Activa la bandera en el store para que los componentes muestren errores.
          this.solicitud220402Store.setMarkAllAsTouched();
          // Llama a un método en el componente de pestañas para que muestre los errores inmediatamente.
          this.pasoUnoComponent.mostrarErroresEnPestanas();
          this.actualizarDatosPasos();
          return;
        }


        this.esFormaValido = false;
        this.solicitud220402Query.selectSolicitud$.pipe(take(1)).subscribe((solicitudState) => {
          const PAYLOAD = SolicitudPageComponent.buildPayload(solicitudState as Solicitud220402State);
          this.medioDeTransporteService.guardarDatosTramite(PAYLOAD).subscribe(
            (res) => {
              if (res?.codigo === '00') {
                this.indice = e.valor;
                this.actualizarDatosPasos();
                this.wizardComponent?.siguiente();
                this.solicitud220402Store.setIdSolicitud(res?.datos?.id_solicitud || null);
                this.idSolicitud = res?.datos?.id_solicitud.toString() || '';
              } else {
                this.notificaciones.showNotification({
                  tipoNotificacion: 'toastr',
                  categoria: 'danger',
                  mensaje: res?.mensaje || 'Ocurrió un error al guardar.',
                  titulo: 'Error',
                  modo: 'dismissible',
                  cerrar: true,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: '',
                });
              }
            },
            () => {
              this.notificaciones.showNotification({
                tipoNotificacion: TipoNotificacionEnum.ALERTA,
                categoria: CategoriaMensaje.ERROR,
                modo: 'modal-md',
                titulo: 'Error de comunicación',
                mensaje: 'No se pudo comunicar con el servidor. Por favor, intente de nuevo.',
                cerrar: false,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              });
            }
          );
        });
        return;
      }
      this.indice = e.valor;
      this.actualizarDatosPasos();
      this.wizardComponent?.siguiente();
      return;
    }

    this.indice = e.valor;
    this.actualizarDatosPasos();
    this.wizardComponent?.atras();

    if (this.indice === 3 && e.accion === "ant") {
     this.indice = 2;
    this.seccionCargarDocumentos = true;
    this.documentosFirmaStore.update({ documentos: [] });
  }

  }

    /**
 * Emite un evento para cargar archivos.
 * {void} No retorna ningún valor.
 */
onClickCargaArchivos(): void {
  this.cargarArchivosEvento.emit();
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
   * Construye el payload para guardar el trámite.
   *
   * Este método estático recolecta la información del estado de la solicitud
   * y la transforma en el objeto `Payload220402` que espera la API.
   *
   * @param {Solicitud220402State} state - El estado actual de la solicitud del trámite.
   * @returns {Payload220402} El payload listo para ser enviado.
   */
  // eslint-disable-next-line complexity
  private static buildPayload(state: Solicitud220402State): Payload220402 {
    const MERCANCIASREQUEST = (state.datosGeneralesArr ?? []).map(mercancia => {
      return {
        id_nombre_comun: mercancia.nombreComun,
        id_nombre_cientifico: Number(mercancia.nombreCientifico),
        descripcion_producto: mercancia.descripcionProducto,
        fraccion_arancelaria: mercancia.fraccionArancelaria,
        cantidad_umt: mercancia.cantidadUMT,
        cantidad_umc: mercancia.cantidadUMC,
        umc_clave: mercancia.UMC,
        cve_pais_procedencia: mercancia.paisdeOrigen,
        entidad_origen_clave: mercancia.origenes?.[0]?.federativaOrigen || '',
        marcas_distintivas: mercancia.marcasDistintivas,
        id_uso: Number(mercancia.USO),
        numero: mercancia.numero,
        cve_catalogo_empaques: mercancia.empaques,
        municipios_origen: (mercancia.origenes ?? []).map(origen => ({
          entidad_origen_clave: origen.federativaOrigen,
          municipio_origen_clave: origen.origen
        }))
      };
    });

    const DESTINATARIOSREQUEST = (state.destinatario ?? []).map(dest => {
      const ISMORAL = !dest.nombre;
      return {
        id_persona_solicitud: null,
        persona_moral: ISMORAL,
        nombre: dest.nombre ?? "",
        primer_apellido: dest.primerApellido ?? "",
        segundo_apellido: dest.segundoApellido ?? "",
        razon_social: ISMORAL ? dest.nombreDenominacionORazonSocial : "",
        cve_pais: dest.pais ?? "",
        domicilio: dest.domicilio ?? "",
        lada: dest.lada,
        telefono: dest.telefono,
        correo_electronico: dest.correoElectronico
      };
    });

    return {
      id_solicitud: null,
      tipo_certificado: state.tipoDeCertificado ?? '',
      aduana_de_salida: state.seccionAduanera ?? '',
      punto_ingreso: state.puntoDestino ?? '',
      pais_destino: state.paisDeDestino ?? '',
      pais_procedencia: state.paisDeProcedencia ?? '',
      fecha_inspeccion: state.fechaInicio ?? '',
      nombre_unidad: state.unidadDeVerificar ?? '',
      nombre_tercero: state.terceroEspecialista ?? '',
      entidad_federativa: state.entidadFederative ?? '',
      modulo_certificado: state.fitosanitario ?? '',
      medio_transporte: state.mediodeTransporte ?? '',
      identificacion_transporte: state.identificacionDelTransporte ?? '',
      excento_pago: state.exentoDePago === 'Si',
      justificacion: state.justificacion ?? '',
      cadena_pago_dependencia: state.cadenaDependencia ?? '',
      clave_banco: state.banco ?? '',
      llave_pago: state.llaveDePago ?? '',
      fecha_pago: state.fechaPago ?? '',
      destinatarios: DESTINATARIOSREQUEST,
      mercancias: MERCANCIASREQUEST,
    };
  }

  /**
   * Actualiza el objeto de datos de los pasos del wizard.
   *
   * Este método se asegura de que el objeto `datosPasos` se actualice
   * de forma inmutable, lo cual es una buena práctica para la detección
   * de cambios en Angular. También centraliza la lógica de
   * actualización del índice para mantener la consistencia.
   */
  /**
   * Verifica la validez de los formularios en todas las pestañas relevantes.
   *
   * Lee el estado de validación de cada formulario desde el store de Akita.
   * Omite la validación de la pestaña 'solicitante' por ser un componente compartido.
   * Un formulario se considera inválido si su estado es `false` (inválido) o `null` (no visitado).
   *
   * @returns {boolean} `true` si todos los formularios verificados son válidos, de lo contrario `false`.
   */
  areAllTabsValid(): boolean {
    const FORMSTATUS = this.solicitud220402Query.getValue().formStatus;

    // NOTA: Se omite 'solicitante' intencionadamente porque es un componente compartido
    // y no se puede modificar sin riesgo de afectar otros trámites.
    const TABSTOVALIDATE: (keyof (typeof FORMSTATUS))[] = [
      'datosSolicitud',
      'transporte',
      'pagoDerechos',
      'destinatario'
    ];

    for (const KEY of TABSTOVALIDATE) {
      if (FORMSTATUS[KEY] === false || FORMSTATUS[KEY] === null) {
        console.error(`Validación falló en la pestaña: ${KEY}`);
        return false; // Se encontró una pestaña inválida o sin visitar.
      }
    }

    return true; // Todas las pestañas verificadas son válidas.
  }

  private actualizarDatosPasos(): void {
    this.datosPasos = {
      ...this.datosPasos,
      indice: this.indice,
    };
  }

  /**
   * Método para asignar las secciones existentes al stored
   */
  asignarSecciones(): void {
    const SECCIONES: boolean[] = Object.values(SECCIONES_TRAMITE_220402.PASO_1);
    const FORM_VALIDA: boolean[] = [];
    for (const LLAVESECCIONE in SECCIONES_TRAMITE_220402.PASO_1) {
      if (LLAVESECCIONE) {
        FORM_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORM_VALIDA);
  }
  /**
   * Guarda los datos actuales y retrocede al paso anterior en el asistente.
   *
   * Este método utiliza el método `getValorIndice` para establecer el índice del paso anterior
   * en el asistente y navegar hacia él.
   *
   * @param {void} _ev - Evento que dispara la acción de guardar (actualmente no utilizado).
   */
  guardar(_ev: void): void {
    this.getValorIndice({ accion: 'cont', valor: 1 });
  }

  /**
   * Valida todos los formularios del primer paso antes de permitir continuar al siguiente paso.
   */
  // El método de validación de formularios paso uno ya no es necesario con el nuevo flujo
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   *
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar todas las suscripciones activas, evitando fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}