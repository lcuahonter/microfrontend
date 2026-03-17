import { AVISO, DatosPasos, JSONResponse, Notificacion, doDeepCopy, esValidObject, getValidDatos, } from '@libs/shared/data-access-user/src';
import { CALCULATE_ALERT_ERROR, FORM_ERROR_ALERT, MSG_REGISTRO_EXITOSO, PASOS_EXPORTACION } from '../../constants/exportacion-de-diamantes-en-bruto.enum';
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite130203State, Tramite130203Store } from '../../estados/tramites/tramites130203.store';
import { AccionBoton } from '../../enums/accion-botton.enum';
import { ExportacionDeDiamantesEnBrutoService } from '../../services/exportacion-de-diamantes-en-bruto.service';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite130203Query } from '../../estados/queries/tramite130203.query';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';

/**
 * @component ExportacionDeDiamantesEnBrutoComponent
 * @description Componente que gestiona el flujo de pasos para el trámite de exportación de diamantes en bruto.
 * Utiliza un asistente (wizard) para navegar entre los pasos del proceso.
 */
@Component({
  selector: 'app-exportacion-de-diamantes-en-bruto',
  templateUrl: './exportacion-de-diamantes-en-bruto.component.html',
})
export class ExportacionDeDiamantesEnBrutoComponent implements OnDestroy {
  /**
   * @property {ListaPasosWizard[]} pasosSolicitar
   * @description Lista de pasos que se deben completar en el asistente.
   * @default PASOS_EXPORTACION
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;

  /**
   * @property {number} indice
   * @description Índice del paso actual en el asistente.
   * @default 1
   */
  indice: number = 1;

  /**
   * @property {number} tabIndex
   * @description Índice de la pestaña actualmente seleccionada.
   * @default 1
   */
  tabIndex: number = 1;

  /**
   * @property {WizardComponent} wizardComponent
   * @description Referencia al componente del asistente (wizard) para controlar la navegación entre pasos.
   * @decorator @ViewChild
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
  * Indica si el botón para cargar archivos está habilitado.
  */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Datos relacionados con los pasos del asistente.
   * Incluye el número total de pasos, el índice actual y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length, // Número total de pasos
    indice: this.indice, // Índice del paso actual
    txtBtnAnt: 'Anterior', // Texto del botón "Anterior"
    txtBtnSig: 'Continuar', // Texto del botón "Continuar"
  };

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * @property {Tramite130203State} solicitudState
   * @description
   * Estado actual de la solicitud del trámite 130203.
   */
  solicitudState!: Tramite130203State;

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
     * Folio temporal de la solicitud.
     * Se utiliza para mostrar el folio en la notificación de éxito.
     */
  public alertaNotificacion!: Notificacion;

  /**
      * Constante que almacena el valor de la nota de privacidad.
      * 
      * @constant AVISO_PRIVACIDAD_ADJUNTAR - Almacena el valor definido en `NOTA.AVISO_PRIVACIDAD_ADJUNTAR`.
      * Se utiliza para adjuntar o gestionar el aviso de privacidad dentro del sistema.
      */
  AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
    * Evento que se emite para cargar archivos.
    * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
    */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
* Indica si la sección de carga de documentos está activa.
* Se inicializa en true para mostrar la sección de carga de documentos al inicio.
*/
  seccionCargarDocumentos: boolean = true;
  /**
   * Indica si la carga de documentos está en progreso.
   * Se inicializa en true para indicar que la carga está en progreso al inicio.
   */
  cargaEnProgreso: boolean = true;

  /**
   * @description
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Folio temporal de la solicitud.
   * @description
   */
  public folioTemporal: number = 0;

  /**
    * Referencia al componente `PasoUnoComponent`.
    * Se utiliza para acceder a las funcionalidades del primer paso del asistente.
    */
  @ViewChild(PasoUnoComponent, { static: false }) pasoUnoComponent!: PasoUnoComponent;

  /**
   * @description
   * Constructor de la clase.
   * @param exportacionDeDiamantesEnBrutoService
   * @param tramite130203Store
   */
  constructor(private exportacionDeDiamantesEnBrutoService: ExportacionDeDiamantesEnBrutoService, private tramite130203Store: Tramite130203Store, private tramite130203Query: Tramite130203Query, private toastrService: ToastrService) {
    this.tramite130203Query.selectSolicitud$.pipe(takeUntil(this.destroyed$)).subscribe((solicitudState) => {
      this.solicitudState = solicitudState;
    });
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
   * Método para actualizar el índice del paso actual en el asistente.
   * También navega al siguiente o al paso anterior según la acción especificada.
   *
   * Objeto de tipo `AccionBoton` que contiene:
   *  - `valor`: El nuevo índice del paso.
   *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID = this.pasoUnoComponent?.solicitudComponent?.validarFormulario();
      const KIMBERLEY_VALID = this.pasoUnoComponent?.certificadoKimberleyComponent?.validarFormularios();
      if (!ISVALID || !KIMBERLEY_VALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
   *  Maneja el evento de guardar emitido por el componente hijo.
   * @param event  Evento booleano que indica si se debe guardar.
   */
  handleGuardar(event: boolean): void {
    if (event) {
      this.getValorIndice({ valor: this.indice, accion: 'cont' });
    }
  }

  /**
    * Obtiene los datos del store y los guarda utilizando el servicio.
    */
  obtenerDatosDelStore(e: AccionBoton): void {
    this.exportacionDeDiamantesEnBrutoService.getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
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
  guardar(item: Tramite130203State, e: AccionBoton): Promise<JSONResponse> {
    const MERCANCIA = this.exportacionDeDiamantesEnBrutoService.getPayloadDatos(item);
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
          "cveFraccion": item.fraccion
        },
        "partidasMercancia": MERCANCIA,
        "numeroPermisoImportacion": item.numeroPermisoImportacion,
        "Bloque": item.bloque,
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
      "lista_paises": item.fechasSeleccionadas,
      "certificadoKimberly": {
        "idCertificadoKimberly": item.especifique,
        "idCertificadoKimberlyImportacion": item.numero,
        "certificadoKimberlyPKPais": item.tipoEmpresa,
        "certificadoKimberlyPKFolioTramite": item.nombre,
        "nombrePaisOrigenIngles": item.paisOrigen,
        "nombreExportador": item.nombreExportador,
        "direccionExportador": item.direccionExportador,
        "nombreImportador": item.nombreImportador,
        "direccionImportador": item.direccionImportador,
        "numeroEnLetraDeLosLotes": item.numeroEnLetraDeLosLotes,
        "numeroEnLetraDeLosLotesEnIngles": item.numeroEnLetraDeLosLotesEnIngles,
        "numeroDeFactura": item.numeroDeFactura,
        "cantidadEnQuilates": item.cantidadEnQuilates,
        "valorDeLosDiamantes": item.valorDeLosDiamantes
      }
    };

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.exportacionDeDiamantesEnBrutoService.guardarDatosPost(PAYLOAD).subscribe(
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
                this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
                this.tramite130203Store.actualizarEstado({ idSolicitud: API_RESPONSE.datos.id_solicitud });
              } else {
                this.tramite130203Store.actualizarEstado({ idSolicitud: 0 });
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
  * Emite un evento para cargar archivos.
  * {void} No retorna ningún valor.
  */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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
   *  Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos y restablece el estado del store asociado al trámite 130203.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.tramite130203Store.resetStore();
  }
}
