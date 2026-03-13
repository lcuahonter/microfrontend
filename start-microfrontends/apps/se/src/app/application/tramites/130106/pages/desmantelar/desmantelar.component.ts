import { AVISO, DatosPasos, JSONResponse, Notificacion, PASOS, doDeepCopy, esValidObject, getValidDatos, } from '@libs/shared/data-access-user/src';
import { CALCULATE_ALERT_ERROR, FORM_ERROR_ALERT, MSG_REGISTRO_EXITOSO } from '../../constantes/desmantelar.enum';
import { Component, ViewChild } from '@angular/core';
import { Solicitud130106State, Tramite130106Store } from '../../../../estados/tramites/tramite130106.store';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { DatosComponent } from '../datos/datos.component';
import { ListaPasoWizard } from '../../../110222/models/peru-certificado.module';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { OCTA_TEMPO } from '@libs/shared/data-access-user/src/core/services/130102/octava-temporal.enum';
import { Solocitud130106Service } from '../../service/service130106.service';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { take } from 'rxjs';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';


@Component({
  selector: 'app-desmantelar',
  templateUrl: './desmantelar.component.html',
})

export class DesmantelarComponent {
  /**
 * @property {ListaPasosWizard[]} pantallasPasos - Array para almacenar los pasos del wizard.
 */
  pantallasPasos: ListaPasosWizard[] = OCTA_TEMPO;
  /**
   * Referencia al componente Solicitud130106State.
   */
  solicitudState!: Solicitud130106State;

  /**
 * Identificador numérico de la solicitud actual.
 * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
 */
  idSolicitud: number = 0;
  /**
  * @property {boolean} esFormaValido
  * @description
  * Indica si el formulario del paso actual es válido.
  * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
  */
  esFormaValido: boolean = false;
  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
   * @property {number} indice - El índice actual del paso.
   */
  indice: number = 1;
  /**
   * Referencia al componente WizardComponent.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
    * Array de pasos del wizard.
    * @type {Array<ListaPasoWizard>}
    */
  pasos: ListaPasoWizard[] = PASOS;

  /**
   * Mensaje relacionado con el aviso de privacidad simplificado.
   */
  public avisoPrivacidadAlert: string = AVISO.Aviso;

  /**
* Estado del tramite Folio
*/
  public folioTemporal: number = 0;
  /**
    * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
    */
  public formErrorAlert = FORM_ERROR_ALERT;
  /**
   * Referencia a la función generadora de mensajes de error relacionados
   * con el proceso de cálculo.
   */
  public CALCULATE_ALERT_ERROR = CALCULATE_ALERT_ERROR;

  /**
       * Referencia al componente `DatosComponent`.
       * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
       */
  @ViewChild(DatosComponent, { static: false }) datosComponent!: DatosComponent;

  /**
    * Objeto que contiene los datos del paso actual del wizard.
    */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
    * Inyecta los servicios necesarios y suscribe a la validación de la forma para actualizar el estado de la sección.
    * @param seccionStore Servicio para manejar el estado de la sección.
    * @param tramiteQuery Query para consultar el estado del trámite.
    */
  constructor(
    private solocitud130106Service: Solocitud130106Service, private toastrService: ToastrService,
    private tramite130106Store: Tramite130106Store, private toastr: ToastrService
  ) { }


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
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.datosComponent?.datosDeLaSolicitud?.validarFormulario();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    }
    else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }
  }
  /**
     * Navega a través de los pasos del asistente según la acción del botón.
     * @param e Objeto que contiene la acción y el valor del índice al que se desea navegar.
     */
  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
    * Obtiene los datos del store y los guarda utilizando el servicio.
    */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.solocitud130106Service.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.solicitudState = data;
        this.guardar(data,e);
      });
  }


  /**
   * Guarda los datos proporcionados en el parámetro `item` construyendo un objeto payload y enviándolo al servicio backend.
   * El payload incluye información del solicitante, certificado, destinatario y detalles del certificado.
   *
   * @param item - Objeto que contiene todos los datos necesarios para el payload, incluyendo información del certificado, destinatario y detalles adicionales.
   *
   * @remarks
   * Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `certificadoService.guardarDatosPost`.
   * La llamada al servicio actualmente está comentada.
   */
  guardar(item: Solicitud130106State, e: AccionBoton): Promise<JSONResponse> {
    const MERCANCIA = this.solocitud130106Service.getPayloadDatos(item);
    const PAYLOAD = {
      "tipoDeSolicitud": "guardar",
      "tipo_solicitud_pexim": item.defaultSelect,
      "mercancia": {
        "cantidadComercial": 0,
        "cantidadTarifaria": Number(item.cantidad),
        "valorFacturaUSD": Number(item.valorFacturaUSD),
        "condicionMercancia": item.producto,
        "descripcion": item.descripcion,
        "usoEspecifico": item.usoEspecifico,
        "justificacionImportacionExportacion": item.justificacionImportacionExportacion,
        "observaciones": item.observaciones,
        "unidadMedidaTarifaria": {
          "clave": item.unidadMedida
        },
        "fraccionArancelaria": {
          "cveFraccion": 87012002
        },
        "partidasMercancia": MERCANCIA,
      },
      "id_solcitud": this.solicitudState.idSolicitud || 0,
      "cve_regimen": item.regimen,
      "cve_clasificacion_regimen": item.clasificacion,
      "productor": {
        "tipo_persona": true,
        "nombre": "Juan",
        "apellido_materno": "López",
        "apellido_paterno": "Norte",
        "razon_social": "Aceros Norte",
        "descripcion_ubicacion": "Calle Acero, No. 123, Col. Centro",
        "rfc": "AAL0409235E6",
        "pais": "SIN"
      },
      "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "Juan Pérez",
        "es_persona_moral": true,
        "certificado_serial_number": "string"
      },
      "representacion_federal": {
        "cve_entidad_federativa": item.entidad,
        "cve_unidad_administrativa": item.representacion
      },
      "entidades_federativas": {
        "cveEntidad": item.entidad
      },
      "lista_paises": item.fechasSeleccionadas
    };

    return new Promise((resolve, reject) => {
          let shouldNavigate = false;
          this.solocitud130106Service.guardarDatosPost(PAYLOAD).subscribe(
            (response) => {
              this.esFormaValido = false;
              if (response.codigo === '3') {
                this.esFormaValido = true;
                this.formErrorAlert = this.CALCULATE_ALERT_ERROR((response as unknown as { error: string })['error'] || '');
              }
              shouldNavigate = response.codigo === '00';
              if (shouldNavigate) {
                const API_RESPONSE = doDeepCopy(response);
                if (
                  esValidObject(API_RESPONSE) &&
                  esValidObject(API_RESPONSE.datos)
                ) {
                  if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                    const newIdSolicitud = API_RESPONSE.datos.id_solicitud;
                    this.folioTemporal = newIdSolicitud;
                    this.solicitudState.idSolicitud = newIdSolicitud;
                    this.tramite130106Store.actualizarEstado({ idSolicitud: newIdSolicitud });
                  } else {
                    this.solicitudState.idSolicitud = 0;
                    this.tramite130106Store.actualizarEstado({ idSolicitud: 0 });
                  }
                  if (e.valor > 0 && e.valor < 5) {
                    this.indice = e.valor;
    
                    if (e.valor > 0 && e.valor < 5) {
                      this.indice = e.valor;
                      if (e.accion === 'cont') {
                        this.wizardComponent.siguiente();
                        if (e.valor > 0 && e.valor < 5) {
                          this.alertaNotificacion = {
                            tipoNotificacion: 'banner',
                            categoria: 'success',
                            modo: 'action',
                            titulo: '',
                            mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
                            cerrar: true,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                          };
    
                        }
                      } else {
                        this.wizardComponent.atras();
                      }
                    }
                  }
                }
                this.toastrService.success(response.mensaje);
                resolve(response);
              } else {
                this.toastrService.error(response.mensaje);
              }
            },
            (error) => {
              reject(error);
            }
          );
        });
  }
}