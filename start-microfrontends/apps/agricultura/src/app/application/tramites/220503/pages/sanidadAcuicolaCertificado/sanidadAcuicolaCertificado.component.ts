import { AccionBoton, AlertComponent, BtnContinuarComponent, DatosPasos, DocumentosFirmaStore, ListaPasosWizard, Usuario, WizardComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter,OnInit, ViewChild } from '@angular/core';
import { InspeccionFisicaPayload, InspeccionFisicaResponse, MercanciaPayload, MercanciaSagarpaItem, MercanciaTabla, PagoDerechosPayload, ProductorPayload, RepresentacionFederalPayload, ResponsableInspeccionPayload, SolicitantePayload } from '../../models/solicitud-pantallas.model';

import { Subject,combineLatest, map, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ERROR_FORMA_ALERT } from '../../../220201/constantes/certificado-zoosanitario.enum';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { PASOS } from '../../constantes/importador-exportador.enum';
import { PasoDosComponent } from '../PasoDos/PasoDos.component';
import { PasoTresComponent } from '../PasoTres/PasoTres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';

import { Solicitud220503State, Solicitud220503Store } from '../../estados/tramites220503.store';

import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';

@Component({
  selector: 'app-sanidad-acuicola-certificado',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    BtnContinuarComponent,
    PasoTresComponent,
    PasoDosComponent,
    PasoUnoComponent,
    AlertComponent
  ],
  templateUrl: './sanidadAcuicolaCertificado.component.html',
})
export class SanidadAcuicolaCertificadoComponent implements OnInit {

  /**
 * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
 * const isValid = this.pasoUnoComponent.validateForms();
 * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
 */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
  /** Lista de pasos para el wizard */
  pasos: ListaPasosWizard[] = PASOS;
     /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;

  /** Índice actual del paso que se está visualizando */
  indice: number = 1;
    datosUsuario: Usuario = USUARIO_INFO;

  /**
   * @description Indica si el formulario es válido.
   * @type {boolean}
   * @memberof SanidadAcuicolaCertificadoComponent
   * @see https://compodoc.app/
   */
  esFormaValido: boolean = false;
  /**
 * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
 */
  public formErrorAlert = ERROR_FORMA_ALERT;

   /**
   * Estado de la solicitud.
   */
   public solicitudState!: string;
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
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Objeto `datosPasos` que almacena información sobre los pasos del proceso.
   * Contiene datos como el número total de pasos, el índice actual y los textos de los botones de navegación.
   */
  datosPasos: DatosPasos = {
    /**
     * Número total de pasos en el proceso.
     * Se obtiene dinámicamente a partir de la longitud del arreglo `pasos`.
     */
    nroPasos: this.pasos.length,

    /**
     * Índice del paso actual dentro del proceso.
     */
    indice: this.indice,

    /**
     * Texto que se muestra en el botón para retroceder al paso anterior.
     */
    txtBtnAnt: 'Anterior',

    /**
     * Texto que se muestra en el botón para avanzar al siguiente paso.
     */
    txtBtnSig: 'Continuar',
  };

    /**
     * Subject para notificar la destrucción del componente y cancelar suscripciones.
     * Se utiliza para evitar fugas de memoria al destruir el componente.
     */
    private destroyNotifier$: Subject<void> = new Subject();

  /** Referencia al componente Wizard, utilizado para la navegación entre pasos */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
     * Notificación que se muestra al usuario.
     * Se utiliza para mostrar mensajes de éxito, error o información.
     */
    constructor(
      private solicitud220503Query: Solicitud220503Query,
      private documentosFirmaStore: DocumentosFirmaStore,
      private solicitudPantallasService: SolicitudPantallasService,
      private notificacionService: NotificacionesService,
      private solicitud220503Store: Solicitud220503Store
    ) {}

     /**
       * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
       * Se suscribe al estado de la sección y obtiene la URL actual.
       * Si el estado de la consulta indica que hay datos actualizados, se guardan los datos del formulario.
       * Si no, se establece que hay datos de respuesta disponibles.
       */
      ngOnInit(): void {
        this.solicitud220503Query
          .select((state) => state.id_solicitud)
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((id_solicitud) => {
              this.solicitudState = id_solicitud.toString();
            })
          )
          .subscribe();
      }
 
   getValorIndice(evento: AccionBoton): void {
    this.esFormaValido = false;
    if (evento.accion === 'cont' && evento.valor === 1) {
        const ISVALID = this.validarTodosFormulariosPasoUno();
    if (!ISVALID) {
      this.esFormaValido = true;
      this.notificacionService.showNotification({
        tipoNotificacion: 'toastr',
        categoria: 'danger',
        mensaje: 'Por favor, complete todos los campos requeridos correctamente.',
        titulo: 'Error de validación',
        modo: '',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      });
      return;
    }

    // Validar que exista al menos una mercancía
    const MERANCIA_LISTA = this.solicitud220503Query.getValue().mercanciaLista || [];
    if (MERANCIA_LISTA.length === 0) {
      this.notificacionService.showNotification({
        tipoNotificacion: 'toastr',
        categoria: 'danger',
        mensaje: 'Debe agregar al menos una mercancía',
        titulo: 'Error de validación',
        modo: '',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      });
      return;
    }

    // Validar que todas las mercancías tengan cantidad_solicitada mayor o igual a 1
    const MERANCIA_CON_CANTIDAD_INVALIDA = MERANCIA_LISTA.find(item => {
      const CANTIDAD_SOLICITADA = item.cant_soli_umt 
        ? Number(item.cant_soli_umt) 
        : 0;
      return CANTIDAD_SOLICITADA < 1;
    });

    if (MERANCIA_CON_CANTIDAD_INVALIDA) {
      this.notificacionService.showNotification({
        tipoNotificacion: 'toastr',
        categoria: 'danger',
        mensaje: 'Saldo insuficiente',
        titulo: 'Cantidad insuficiente',
        modo: '',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      });
      return;
    }
  
      const TRAMITE$ = this.solicitud220503Query.select();
  
      combineLatest([TRAMITE$])
        .pipe(take(1))
        .subscribe(([tramiteState]) => {
          const PAYLOAD = this._buildPayload(tramiteState);
          this.solicitudPantallasService
            .guardarSolicitud(PAYLOAD)
            .subscribe((res: InspeccionFisicaResponse) => {
              if (res.codigo !== '00') {
  
                // Mostrar error
                this.notificacionService.showNotification({
                  tipoNotificacion: 'toastr',
                  categoria: 'danger',
                  mensaje: res.mensaje ? res.mensaje : '',
                  titulo: 'Error',
                  modo: '',
                  cerrar: true,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: 'Cancelar',
                });
                this.indice = 1;
  
                return; // ← No avanzar
              }
  
              //  Caso exitoso: guardar id si existe
              if (res.datos?.id_solicitud) {
                this.solicitud220503Store.setIdSolicitud(Number(res.datos.id_solicitud));
              }
  
              //  Ahora sí, avanzar a paso 2
              this.indice = 2;
              this.wizardComponent.siguiente();
            });
        });
  
      return; //  Importante: NO continuar en el flujo normal
    }
  
    this.indice = evento.valor;
  
    if (evento.accion === 'cont') {
      this.wizardComponent.siguiente();
    } else {
      this.wizardComponent.atras();
    }
  
    if (this.indice === 3 && evento.accion === 'ant') {
       this.indice = 2;
      this.seccionCargarDocumentos = true;
      this.documentosFirmaStore.update({ documentos: [] });
    }
  }

  /**
* Valida todos los formularios del primer paso antes de permitir continuar al siguiente paso.
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
     * Construye el objeto de payload para la API de guardar inspección física.
     * @param tramiteState El estado actual de la solicitud desde el store.
     * @returns El objeto de payload.
     */
    private _buildPayload(
      tramiteState: Solicitud220503State
    ): InspeccionFisicaPayload {
    
      return {
        id_solcitud:  null,
        cve_regimen: tramiteState.regimen ? String(tramiteState.regimen) : '01',
        cve_clasificacion_regimen: '00',
        productor: SanidadAcuicolaCertificadoComponent._buildProductorPayload(tramiteState),
        solicitante: this._buildSolicitantePayload(),
        numero_certificado: tramiteState.certificadosAutorizados || null,
        representacion_federal:
          SanidadAcuicolaCertificadoComponent._buildRepresentacionFederalPayload(),
        fecha_inspeccion:
          tramiteState.fechaDeInspeccion && tramiteState.horaDeInspeccion
            ? `${SanidadAcuicolaCertificadoComponent.toYearMonthFirst(tramiteState.fechaDeInspeccion)} ${tramiteState.horaDeInspeccion}:00`
            : null,
        hora_inspeccion: tramiteState.horaDeInspeccion || null,
        clave_aduana_ingreso:
          tramiteState.aduanaDeIngreso || tramiteState.aduanaIngreso || null,
        clave_oisa:
          tramiteState.sanidadAgropecuaria ||
          tramiteState.oficinaInspeccion ||
          null,
        punto_inspeccion:
          tramiteState.puntoDeInspeccion || tramiteState.puntoInspeccion || null,
        toat_guias: tramiteState.totalDeGuiasAmparadas || null,
        responsable_inspeccion:
          SanidadAcuicolaCertificadoComponent._buildResponsableInspeccionPayload(
            tramiteState
          ),
        ide_transporte: tramiteState.transporteIdMedio || null,
        identificacion_transporte: tramiteState.identificacionTransporte || null, 
        cve_oficina_inspeccion_agropecuaria:
   tramiteState.oficinaInspeccion || null,
        ide_contenedor: tramiteState.tipocontenedor || null,
        pago_derechos:
          SanidadAcuicolaCertificadoComponent._buildPagoDerechosPayload(tramiteState),
        mercancia_sagarpa: SanidadAcuicolaCertificadoComponent._buildMercanciasPayload(
    this.solicitud220503Query.getValue().mercanciaLista
  ), 

        cveUCON: null, 
        infAdicional: null, 
        bln_generico1: tramiteState.esSolicitudFerros === 'si'
          ? true
          : false,
      };
    }

    /**
       * Construye el objeto de payload para la sección de productor.
       * @param tramiteState El estado actual de la solicitud desde el store.
       * @returns El objeto de payload para productor.
       */
      private static _buildProductorPayload(
        tramiteState: Solicitud220503State
      ): ProductorPayload {
        return {
          tipo_persona: true, 
          tipoPersona: 'FISICA',
          nombre: tramiteState.nombre || 'N/A',
          apellido_materno: tramiteState.segundoapellido || 'N/A',
          apellido_paterno: tramiteState.primerapellido || 'N/A',
          razon_social: tramiteState.nombreEmpresa
            ? String(tramiteState.nombreEmpresa)
            : null,
          descripcion_ubicacion: 'SIN DESCRIPCIÓN', 
          rfc: 'XAXX010101000',
          pais: 'MX', 
        };
      }

       /**
         * Construye el objeto de payload para la sección de solicitante.
         * @returns El objeto de payload para solicitante.
         */
        private _buildSolicitantePayload(): SolicitantePayload {
          return {
            rfc: this.datosUsuario.persona.rfc || null, 
            nombre: this.datosUsuario.persona.nombre || null, 
            es_persona_moral: true, 
            certificado_serial_number: null, 
          };
        }

        private static toYearMonthFirst(dateStr: string): string {
  const [MONTH, YEAR] = dateStr.split('/');
  return `${YEAR}-${MONTH.padStart(2, '0')}-01`;
}
          /**
           * Construye el objeto de payload para la sección de representación federal.
           * @returns El objeto de payload para representación federal.
           */
          private static _buildRepresentacionFederalPayload(): RepresentacionFederalPayload {
            return {
              cve_entidad_federativa: '09', 
              cve_unidad_administrativa:  '001', 
            };
          }

          /**
             * Construye el objeto de payload para la sección de responsable de inspección.
             * @param tramiteState El estado actual de la solicitud desde el store.
             * @returns El objeto de payload para responsable de inspección.
             */
            private static _buildResponsableInspeccionPayload(
              tramiteState: Solicitud220503State
            ): ResponsableInspeccionPayload {
              return {
                nombre: tramiteState.nombre || null,
                apellido_paterno: tramiteState.primerapellido || null,
                apellido_materno: tramiteState.segundoapellido || null,
                num_total_carros: Number(tramiteState. mercancia) || null,
                cve_contenedor: tramiteState.tipocontenedor
                  ? String(tramiteState.tipocontenedor)
                  : null,
              };
            }

            /**
               * Construye el objeto de payload para la sección de pago de derechos.
               * @param tramiteState El estado actual de la solicitud desde el store.
               * @returns El objeto de payload para pago de derechos.
               */
              private static _buildPagoDerechosPayload(
                tramiteState: Solicitud220503State
              ): PagoDerechosPayload {
                return {
                  excento_pago:
                    tramiteState.exentoPagoNo === 1 || tramiteState.exentoPagoNo === '1'
                      ? true
                      : false,
                  id_pago: null, 
                  id_solicitud: String(tramiteState.id_solicitud) || null,
                  clave_banco: String(tramiteState.banco) || null,
                  ide_tipo_pago: null, 
                  importe_pago: Number(tramiteState.importePago) || null,
                  ref_bancaria: null, 
                  fecha_pago: tramiteState.fetchapago || null,
                  llave_pago: tramiteState.llavePago || null,
                  clave_referencia: tramiteState.claveReferencia || null,
                  cadena_pago_dependencia: tramiteState.cadenaDependencia || null,
                  motivo_excento_pago: tramiteState.justificacion || null,
                };
              }

               /**
               * Transforma el arreglo de mercancías obtenidas en el formato requerido por el backend.
               * @param items Arreglo original de mercancías.
               * @returns Arreglo transformado con el formato esperado.
               */
              private static _buildMercanciasPayload(
                items: MercanciaTabla[]
              ): MercanciaSagarpaItem[] {
                return items.map((item, index) => ({
                  id_solicitud: item.id_solicitud ?? 0,
                  num_permiso_importacion: item.num_permiso_importacion ?? "",
                  id_mercancia_gob: item.id_mercancia_gob ?? 0,
              
                  cantidad_umt:
                    item.cant_total_umt ??
                    item.cantidadTotalUMT ??
                    0,
              
                  numero_partida: item.numero_partida ?? index + 1,
              
                  feaccion_arancelaria:
                    item.fraccion_arancelaria ??
                    item.fraccionArancelaria ??
                    "",
              
                  descripcion_arancelaria:
                    item.descripcion_de_la_fraccion ??
                    item.descripcionFraccion ??
                    "",
              
                  descripcion_unidad_medida:
                    item.uni_medida_tar ??
                    item.unidaddeMedidaDeUMT ??
                    "",
              
                  cantidad_inspeccionada: 0,
              
                  // Mapea solo el valor ingresado en el modal (Cantidad Solicitada en UMT)
                  // Prioriza cant_soli_umt (valor guardado), luego saldoACapturar, si no existe se asigna 0
                  cantidad_solicitada: item.cant_soli_umt 
                    ? Number(item.cant_soli_umt) 
                    : item.saldoACapturar 
                    ? Number(item.saldoACapturar) 
                    : 0,
                 
              
                  clave_nico: item.nico ?? "",
                  descripcion_nico:
                    item.descripcion_nico ??
                    item.descripcion ??
                    "",
                }));
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
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;
  /**
* Método para manejar el evento de carga de documentos.
* Actualiza el estado del botón de carga de archivos.
*  carga - Indica si la carga de documentos está activa o no.
* {void} No retorna ningún valor.
*/
manejaEventoCargaDocumentos(carga: boolean): void {
  this.activarBotonCargaArchivos = carga;
}
/** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;
  /**
    * Maneja el evento de carga en progreso emitido por un componente hijo.
    * Actualiza el estado de cargaEnProgreso según el valor recibido.
    * @param cargando Valor booleano que indica si la carga está en progreso.
    */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
  }
    
}
