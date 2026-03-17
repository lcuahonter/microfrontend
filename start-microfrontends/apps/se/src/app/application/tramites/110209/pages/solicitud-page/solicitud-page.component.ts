/**
 * Este componente maneja la lógica y la interfaz de usuario para la página de solicitud,
 */
import {
  AccionBoton,
  ERROR_FORMA_ALERT,
  PASOS,
} from '../../constantes/certificado-sgp.enum';
import { Component, ViewChild } from '@angular/core';
import {
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  WizardComponent,
} from '@libs/shared/data-access-user/src';
import { Subject, take, takeUntil } from 'rxjs';
import {
  Tramite110209State,
  Tramite110209Store,
} from '../../estados/stores/tramite110209.store';
import { esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { CapturarSolicitudComponent } from '../capturar-solicitud/capturar-solicitud.component';
import { CertificadoData } from '../../models/certificado-sgp.model';
import { Solicitud110209Service } from '../../services/solicitud-110209/solicitud-110209.service';
import { Tramite110209Query } from '../../estados/queries/tramite110209.query';
import { doDeepCopy } from '@ng-mf/data-access-user';
/**
 * Componente que representa la página de solicitud.
 */

@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent {
  /**
   * Lista de pasos del asistente.
   * @type {ListaPasosWizard[]}
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

  /**
   * Referencia al componente del asistente.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {CapturarSolicitudComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `CapturarSolicitudComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del componente que maneja el primer paso del formulario,
   * especialmente para validar todos sus formularios antes de avanzar al siguiente paso.
   */
  @ViewChild('pasoUno') pasoUnoComponent!: CapturarSolicitudComponent;

  /**
   * Índice del paso actual.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Datos de los pasos del asistente.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Indica si se debe mostrar el formulario de mercancía.
   * @type {boolean}
   */
  showMercanciaForm: boolean = false;

  /**
   * Índice del tap capturado.
   * @type {number}
   */
  capturarTapIndice = 1;
  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si hay errores de validación en los formularios que se deben mostrar.
   * Se establece a `true` cuando se intenta avanzar al siguiente paso con formularios inválidos,
   * lo que activa la visualización de mensajes de error en la interfaz.
   */
  esFormaValido: boolean = false;
  /**
   * @property {Object} formErrorAlert
   * @description
   * Objeto que contiene la configuración del mensaje de error para formularios inválidos.
   * Utiliza la constante `ERROR_FORMA_ALERT` definida en las enumeraciones del certificado SGP.
   * Define el título, mensaje y opciones de visualización para la alerta de error de validación de formularios.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Estado actual del trámite 110209.
   *
   * Se mantiene sincronizado de forma reactiva con el store mediante
   * la suscripción al observable `selectTramite110209$`.
   * Contiene toda la información necesaria para representar y manejar
   * la solicitud en curso.
   */
  solicitudState!: Tramite110209State;

  /**
   * Propiedad para almacenar el payload de búsqueda de la solicitud.
   */
  buscarDatos: CertificadoData[] = [];

  /**
   * Constructor del componente.
   *
   * Inyecta los servicios necesarios para gestionar el estado del trámite **110209**.
   * Al inicializarse, se suscribe al observable `selectTramite110209$` expuesto por
   * el `Tramite110209Query`, de manera que la propiedad `solicitudState` se mantenga
   * siempre sincronizada con el estado global gestionado por el store.
   *
   * @param {Tramite110209Store} tramiteStore - Servicio `Store` encargado de crear,
   *                                            actualizar y resetear el estado global
   *                                            del trámite 110209.
   * @param {Tramite110209Query} tramiteQuery - Servicio `Query` que expone observables
   * y selectores para consultar el estado del trámite 110209.
   */
  constructor(
    public tramiteStore: Tramite110209Store,
    public tramiteQuery: Tramite110209Query,
    private servicio110209: Solicitud110209Service
  ) {
    this.tramiteQuery.selectTramite110209$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
        this.buscarDatos = solicitud.buscarPayload ?? [];
      });
  }

  /**
   * Muestra u oculta el formulario de mercancía y captura el índice de la pestaña.
   *
   * @param $event - Indica si se debe mostrar (true) u ocultar (false) el formulario de mercancía.
   * @param ind - Índice de la pestaña que se está capturando.
   * @returns {void}
   */
  showMercancia($event: boolean, tapIndice: number): void {
    this.showMercanciaForm = $event;
    this.capturarTapIndice = tapIndice;
  }
  /**
   * Actualiza el índice del paso actual y navega al siguiente o anterior paso.
   * @param {any} e - Evento que contiene el valor del índice y la acción a realizar.
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    // Validar formularios antes de continuar desde el paso uno
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return; // Detener ejecución si los formularios son inválidos
      }
      this.obtenerDatosDelStore();
    } 

    let indiceActualizado = e.valor;
    if (e.accion === 'cont') {
      indiceActualizado = e.valor + 1;
    } else if (e.accion === 'ant') {
      indiceActualizado = e.valor - 1;
    }

    // Validar que el nuevo índice esté dentro de los límites permitidos
    if (indiceActualizado > 0 && indiceActualizado <= this.pasos.length) {
      // Actualizar el índice y datosPasos
      this.indice = indiceActualizado;
      this.datosPasos.indice = indiceActualizado;

      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else if (e.accion === 'ant') {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del componente `CapturarSolicitudComponent`.
   * Si la referencia al componente no existe, retorna `true` para permitir la navegación.
   * Llama al método `validarFormularios()` del componente hijo para verificar la validez de todos sus formularios.
   * Si algún formulario es inválido, retorna `false` para impedir el avance al siguiente paso.
   *
   * @returns {boolean} `true` si todos los formularios son válidos o si el componente no existe, `false` si algún formulario es inválido.
   * @private
   */
  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarFormularios();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }

  /**
 * Método que construye y guarda los datos de un trámite.
 * 
 * @param data - Estado del trámite a procesar.
 * @returns Una promesa con la respuesta JSON del guardado.
 * 
 * Construye diferentes secciones del certificado utilizando los métodos del servicio:
 * - TRATADOS: Información de tratados asociados.
 * - DESTINATARIO: Datos del destinatario.
 * - TRANSPORTE: Información del medio de transporte.
 * - CERTIFICADO: Datos generales del certificado.
 * - DATOS_CERTIFICADO: Detalles específicos del certificado.
 */
  guardar(data: Tramite110209State): Promise<JSONResponse> {
  const CERTIFICADO_ORIGEN = this.servicio110209.buildCertificadoOrigen(data);

  const PAYLOAD = {
   "tipoDeSolicitud": "guardar",
    "idSolicitud": this.solicitudState.idSolicitud ?? 0,
    "idTipoTramite": 110209,
    "discriminatorValue": "110209",
    "rfc_solicitante": "AAL0409235E6",
    "rfc": "AAL0409235E6",
    "cve_unidad_administrativa": "0203",
    "costoTotal": 10000.5,
    "certificado_serial_number": "1234567890ABCDEF",
    "numero_folio_tramite_original": "TRM-2023-00001",
    "nombre": "Juan",
    "apPaterno": "Pérez",
    "apMaterno": "López",
    "telefono": "5551234567",
     "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "ACEROS ALVARADO S.A. DE C.V.",
        "actividad_economica": "Fabricación de productos de hierro y acero",
        "correo_electronico": "contacto@acerosalvarado.com",
        "domicilio": {
            "pais": "México",
            "codigo_postal": "06700",
            "estado": "Ciudad de México",
            "municipio_alcaldia": "Cuauhtémoc",
            "localidad": "Centro",
            "colonia": "Roma Norte",
            "calle": "Av. Insurgentes Sur",
            "numero_exterior": "123",
            "numero_interior": "Piso 5, Oficina A",
            "lada": "",
            "telefono": "123456"
        }
    },
      "certificadoOrigen" : CERTIFICADO_ORIGEN,
      "certificadoOriginal" : this.buscarDatos[0] ?? {},
}
        return new Promise((resolve, reject) => {
          this.servicio110209.guardarDatosPost(PAYLOAD).subscribe(
            (response) => {
              const API_RESPONSE = doDeepCopy(response);
              if (
                esValidObject(API_RESPONSE) &&
                esValidObject(API_RESPONSE.datos)
              ) {
                if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                  this.tramiteStore.setTramite110209(
                    { idSolicitud: API_RESPONSE.datos.id_solicitud });
                  this.pasoNavegarPor({ accion: 'cont', valor: 2 });
                } else {
                  this.tramiteStore.setTramite110209(
                    { idSolicitud: 0 });
                }
              }
              resolve({
                id: API_RESPONSE['id'] ?? 0,
                descripcion: API_RESPONSE['descripcion'] ?? '',
                codigo: API_RESPONSE['codigo'] ?? '',
                data: API_RESPONSE['data'] ?? API_RESPONSE['datos'] ?? null,
                ...API_RESPONSE
              } as JSONResponse);
            },
            (error) => {
              reject(error);
            }
          );
      });
    }

/**
 * Método que obtiene los datos actuales del store y los procesa.
 * 
 * Se suscribe una sola vez al estado completo del servicio `servicio110209`
 * y llama al método `guardar` con los datos obtenidos.
 */
    obtenerDatosDelStore(): void {
      this.servicio110209.getAllState()
        .pipe(take(1))
        .subscribe(data => {
          this.guardar(data);
        });
    }

/**
 * Método que maneja la navegación en un componente tipo wizard según la acción del botón.
 * 
 * @param e - Objeto que contiene la acción del botón y el valor del paso.
 * 
 * Si el valor está entre 1 y 2 inclusive, actualiza el índice del paso actual y:
 * - Si `accion` es 'cont', avanza al siguiente paso.
 * - De lo contrario, retrocede al paso anterior.
 */
      pasoNavegarPor(e: AccionBoton): void {
        if (e.valor > 0 && e.valor < 3) {
          this.indice = e.valor;
          
          if (e.accion === 'cont') {
            this.wizardComponent.siguiente();
          } else {
            this.wizardComponent.atras();
          }
        }
      }
}