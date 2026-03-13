import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { DatosPasos, JSONResponse, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import {ERROR_FORMA_ALERT, ERROR_PRECISA_REQUIRED} from '../../constant/destinatario.enum';
import {
  Solicitud110203State,
  Tramite110203Store,
} from '../../../../estados/tramites/tramite110203.store';
import { Subject, take, takeUntil } from 'rxjs';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { CertificadoData } from '../../models/datos-tramite.model';
import { DatosComponent } from '../datos/datos.component';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { OCTA_TEMPO } from '@libs/shared/data-access-user/src/core/services/130102/octava-temporal.enum';
import { Solocitud110203Service } from '../../service/service110203.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { doDeepCopy } from '@ng-mf/data-access-user';

@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.component.html',
})
export class TecnicosComponent implements OnDestroy {
  /**
   * @property {ListaPasosWizard[]} pantallasPasos - Array para almacenar los pasos del wizard.
   */
  pantallasPasos: ListaPasosWizard[] = OCTA_TEMPO;

  /**
   * @property {number} indice - El índice actual del paso.
   */
  indice: number = 1;
  /**
   * Referencia al componente hijo `WizardComponent`.
   *
   * Usando el decorador `@ViewChild`, Angular inyecta una instancia del componente
   * `WizardComponent` presente en la plantilla.
   * Esto permite controlar su ciclo de vida, invocar métodos públicos
   * y acceder a sus propiedades directamente desde el componente padre.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Estado de la solicitud 110203.
   *
   * Este objeto contiene toda la información necesaria para representar el estado
   * de una solicitud: identificador, estado actual, metadatos y cualquier dato
   * adicional requerido por la lógica de negocio.
   *
   * Propiedades comunes del tipo `Solicitud110203State` (ejemplo):
   * - `id: string` — Identificador único de la solicitud.
   * - `estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'` — Estado actual.
   * - `datos: Record<string, any>` — Objeto con los datos específicos de la solicitud.
   */
  solicitudState!: Solicitud110203State;

    /**
     * Referencia al componente `PasoUnoComponent`.
     */
    @ViewChild('pasoUnoRef') datosComponent!: DatosComponent;


  /**
   * Objeto que contiene la información de los pasos del asistente (wizard).
   *
   * Este objeto define la configuración de la navegación paso a paso dentro del flujo.
   * Se utiliza para controlar el número total de pasos, el índice actual
   * y los textos de los botones de navegación.
   *
   * @type {DatosPasos}
   * @public
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

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
 * Indica si el formulario actual es válido (`true`) o no (`false`).
 */
  esFormaValido: boolean = false;

/**
 * Estado que indica si el botón de continuar está habilitado (`true`) o deshabilitado (`false`).
 */
  btnContinuar: boolean = false;

/**
 * Contiene la plantilla HTML para la alerta de error en el formulario.
 */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Propiedad para almacenar el payload de búsqueda de la solicitud.
   */
  buscarDatos: CertificadoData[] = [];

  /**
   * Constructor del componente.
   *
   * Inyecta las dependencias necesarias para gestionar el estado y las consultas
   * relacionadas con el trámite **110203**.
   * Además, establece una suscripción al observable `selectSolicitud$`
   * para mantener actualizada la propiedad `solicitudState` en función de los
   * cambios del estado en el store.
   *
   * @param {Tramite110203Query} tramite110203Query - Servicio de consulta (Query) que expone los observables
   *                                                  relacionados con el estado del trámite.
   * @param {Tramite110203Store} tramite110203Store - Servicio de almacenamiento (Store) encargado de gestionar
   *                                                  el estado global del trámite.
   */
  constructor(
    private tramite110203Query: Tramite110203Query,
    private tramite110203Store: Tramite110203Store,
    private servicio110203: Solocitud110203Service,
    private toastrService: ToastrService,
  ) {
    this.tramite110203Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
        this.buscarDatos = solicitud.buscarPayload ?? [];
      });
  }

  /**
   * Actualiza la propiedad `indice` según el valor del objeto `AccionBoton` proporcionado.
   * Si la propiedad `valor` de `AccionBoton` está entre 1 y 4 (inclusive), establece `indice` en `valor`.
   * Dependiendo de la propiedad `accion` de `AccionBoton`, mueve el componente del asistente hacia adelante o hacia atrás.
   *
   * @param {AccionBoton} e - El objeto del botón de acción que contiene las propiedades `valor` y `accion`.
   * @returns {void}
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
      if (indiceActualizado > 0 && indiceActualizado <= this.pantallasPasos.length) {
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
 * Valida todos los formularios del primer paso si el componente de datos está disponible.
 *
 * @returns `true` si todos los formularios son válidos o si el componente no está definido; `false` si algún formulario es inválido.
 */
    public validarTodosFormulariosPasoUno(): boolean {
    if (!this.datosComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.datosComponent.validarFormularios();

    if (!ISFORM_VALID_TOUCHED) {
      if(this.datosComponent.datosCertificadoComponent?.isPrecisaEmpty()){
        this.formErrorAlert = ERROR_PRECISA_REQUIRED;
      }
      return false;
    }
    return true;
  }

/**
 * Desactiva el botón de continuar estableciendo su estado en falso.
 */
  btnContinuarNotificacion(): void {
    this.btnContinuar = false;
  }

/**
 * Construye y envía la información completa de la solicitud 110203 al servicio correspondiente.
 * Genera los objetos necesarios (tratados, destinatario, transporte, certificado y datos del certificado).
 * Envía el payload al backend mediante una petición POST y actualiza el ID de solicitud en el store.
 * Devuelve una promesa con la respuesta del servidor en formato JSONResponse.
 */
  guardar(data: Solicitud110203State): Promise<JSONResponse> {
    const CERTIFICADO_ORIGEN = this.servicio110203.buildCertificadoOrigen(data);
    const PAYLOAD = {
    "tipoDeSolicitud": "guardar",
    "idSolicitud": this.solicitudState.idSolicitud ?? 0,
    "idTipoTramite": 110203,
    "discriminatorValue": "110203",
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
    };

      return new Promise((resolve, reject) => {
        this.servicio110203.guardarDatosPost(PAYLOAD).subscribe(
          (response) => {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.tramite110203Store.setIdSolicitud(
                  API_RESPONSE.datos.id_solicitud
                );
                this.pasoNavegarPor({ accion: 'cont', valor: 2 });
              } else {
                this.tramite110203Store.setIdSolicitud(0);
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
 * Obtiene los datos almacenados en el estado (store) mediante el servicio correspondiente.
 * Realiza una única suscripción al observable usando 'take(1)'.
 * Al recibir los datos, los guarda mediante el método 'guardar'.
 */
  obtenerDatosDelStore(): void {
    this.servicio110203.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }

    /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
   */
  pasoNavegarPor(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Método de ciclo de vida de Angular, se ejecuta al destruir el componente.
   * Cancela todas las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}