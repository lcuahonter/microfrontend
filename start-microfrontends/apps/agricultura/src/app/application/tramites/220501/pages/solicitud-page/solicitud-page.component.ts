import { Component, EventEmitter,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, DocumentosFirmaStore, ListaPasosWizard, PASOS, SECCIONES_TRAMITE_5701, Usuario, WizardComponent } from '@ng-mf/data-access-user';
import { SeccionState, SeccionStore } from '../../../../estados/seccion.store';
import { Solicitud220501State, Solicitud220501Store } from '../../estados/tramites220501.store';
import { Subject, combineLatest, map, take, takeUntil } from 'rxjs';
import { ERROR_ALERTA } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';
import { MercanciaTabla } from '../../models/medio-transporte.model';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SagarpaService } from '../../services/sagarpa/sagarpa.service';
import { SeccionQuery } from'../../../../estados/queries/seccion.query';
import { Solicitud220501Query } from '../../estados/tramites220501.query';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';

import { InspeccionFisicaPayload, InspeccionFisicaResponse, MercanciaPayload, MercanciaSagarpaItem, PagoDerechosPayload, ProductorPayload, RepresentacionFederalPayload, ResponsableInspeccionPayload, SolicitantePayload } from '../../../220502/models/solicitud-pantallas.model';
/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;
  /**
   * El valor asociado a la acción.
   */
  valor: number;
}


/**
 * Componente para gestionar la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  standalone: false,
})
export class SolicitudPageComponent implements OnInit,OnDestroy {
 
  /**
   * Referencia al componente PasoUnoComponent
   */
   @ViewChild(PasoUnoComponent)
pasoUno!: PasoUnoComponent;
  /**
   * Procedimiento actual.
   */
  procedimiento:string='220501';
  /**
   * Lista de pasos del asistente.
   */
  /**
   * Sujeto para manejar la destrucción de suscripciones.
   */
  private sub$ = new Subject<void>();
  pasos: ListaPasosWizard[] = PASOS;
   /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;
     /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;
  /**
   * Índice del paso actual.
   */
  indice: number = 1;

    datosUsuario: Usuario = USUARIO_INFO;
      /**
   * Estado de la solicitud.
   */
  public solicitudState!: string;

  /**
 * Estado de la sección actual.
 */
  public seccion!: SeccionState;

  /**
 * Sujeto para manejar la destrucción de suscripciones.
 */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * Referencia al componente del asistente.
  */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente PasoUnoComponent
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;
 
   /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;

  /**
   * Mensaje de error a mostrar.
   */
  esValido = true;
     /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Una cadena que representa la clase CSS para una alerta de error.
   */
  infoError = 'alert-danger';

  /**
   * Asigna el mensaje de error a mostrar al atributo `ALERTA`.
   */
  ALERTA = ERROR_ALERTA;

  /**
 * Datos de los pasos del asistente.
 */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Constructor del componente.
   * @param seccionStore Almacén de secciones.
   * @param seccionQuery Consulta de secciones.
   */
  constructor(
    private seccionQuery: SeccionQuery,
    private seccionStore: SeccionStore,
     private documentosFirmaStore: DocumentosFirmaStore,
    private solicitud220501Query: Solicitud220501Query,
     private sagarpaService: SagarpaService,
       private notificacionService: NotificacionesService,
       private solicitud220501Store: Solicitud220501Store
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.seccionQuery.selectSeccionState$.pipe(
      takeUntil(this.destroyNotifier$),
      map(seccionState => {
        this.seccion = seccionState;
      })
    ).subscribe();
       this.solicitud220501Query
      .select((state) => state.id_solicitud)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((id_solicitud) => {
          this.solicitudState = id_solicitud;
        })
      )
      .subscribe();

    this.asignarSecciones();
  }

  /**
 * Método para seleccionar una pestaña.
 * @param i Índice de la pestaña a seleccionar.
 */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

 getValorIndice(evento: AccionBoton): void {
  // eslint-disable-next-line no-console
  console.log(evento,'evento');
  if (evento.accion === 'cont' && evento.valor === 1) {
    if(this.pasoUno){
       this.pasoUno.marcarPasoUno();
    }
 



    const TRAMITE$ = this.solicitud220501Query.select();

    combineLatest([TRAMITE$])
      .pipe(take(1), takeUntil(this.sub$) )
      .subscribe(([tramiteState]) => {
        const PAYLOAD = this._buildPayload(tramiteState);
        this.sagarpaService
          .guardarInspeccionFisicaSagarpa(PAYLOAD,this.procedimiento) .pipe(takeUntil(this.sub$)).subscribe((res: InspeccionFisicaResponse) => {
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
              this.solicitud220501Store.setIdSolicitud(res.datos.id_solicitud);
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

private static toYearMonthFirst(dateStr: string): string {
  const [MONTH, YEAR] = dateStr.split('/');
  return `${YEAR}-${MONTH.padStart(2, '0')}-01`;
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

  /**
   * Construye el objeto de payload para la sección de representación federal.
   * @returns El objeto de payload para representación federal.
   */
  private static _buildRepresentacionFederalPayload(): RepresentacionFederalPayload {
    return {
      cve_entidad_federativa: null, 
      cve_unidad_administrativa: null, 
    };
  }

  /**
   * Método que se ejecuta al destruir el componente.
   */
ngOnDestroy():void {
this.sub$.next();
this.sub$.unsubscribe();
}

  /**
   * Construye el objeto de payload para la API de guardar inspección física.
   * @param tramiteState El estado actual de la solicitud desde el store.
   * @returns El objeto de payload.
   */
  private _buildPayload(
    tramiteState: Solicitud220501State
  ): InspeccionFisicaPayload {
    return {
      id_solcitud:null,
      cve_regimen: tramiteState.regimen ? String(tramiteState.regimen) : '01',
      cve_clasificacion_regimen: '00',
      mercancia: SolicitudPageComponent._buildMercanciaPayload(tramiteState),
      productor: SolicitudPageComponent._buildProductorPayload(tramiteState),
      solicitante: this._buildSolicitantePayload(),
      numero_certificado: tramiteState.certificadosAutorizados || null,
      representacion_federal:
        SolicitudPageComponent._buildRepresentacionFederalPayload(),
      fecha_inspeccion:
        tramiteState.fechaInspeccion && tramiteState.horaDeInspeccion
          ? `${SolicitudPageComponent.toYearMonthFirst(tramiteState.fechaInspeccion)} ${tramiteState.horaDeInspeccion}:00`
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
        SolicitudPageComponent._buildResponsableInspeccionPayload(
          tramiteState
        ),
      ide_transporte: tramiteState.transporteIdMedio || null,
      identificacion_transporte: tramiteState.identificacionTransporte || null, 
      cve_oficina_inspeccion_agropecuaria:
 tramiteState.oficinaInspeccion || null,
      ide_contenedor: tramiteState.tipocontenedor || null,
      pago_derechos:
        SolicitudPageComponent._buildPagoDerechosPayload(tramiteState),
      mercancia_sagarpa: SolicitudPageComponent._buildMercanciasPayload( this.solicitud220501Query.getValue().mercanciaLista), 
      cveUCON: null, 
      infAdicional: null, 
      bln_generico1:false 
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

    cantidad_solicitada:
      item.saldoACapturar ??
      item.saldoACapturar ??
      0,

    clave_nico: item.nico ?? "",
    descripcion_nico:
      item.descripcion_nico ??
      item.descripcion ??
      "",
  }));
}


  /**
     * Construye el objeto de payload para la sección de pago de derechos.
     * @param tramiteState El estado actual de la solicitud desde el store.
     * @returns El objeto de payload para pago de derechos.
     */
    private static _buildPagoDerechosPayload(
      tramiteState: Solicitud220501State
    ): PagoDerechosPayload {
      return {
        excento_pago:
          tramiteState.exentoPagoNo === 1 || tramiteState.exentoPagoNo === '1'
            ? true
            : false,
        id_pago: null, 
        id_solicitud: tramiteState.id_solicitud || null,
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
   * Método para asignar las secciones existentes al stored
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMAVALIDA: boolean[] = [];
    // eslint-disable-next-line guard-for-in
    for (const LLAVESECCION of Object.keys(SECCIONES_TRAMITE_5701.PASO_1) as Array<keyof typeof SECCIONES_TRAMITE_5701.PASO_1>) {
      
      SECCIONES.push(SECCIONES_TRAMITE_5701.PASO_1[LLAVESECCION]);
      FORMAVALIDA.push(false);
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMAVALIDA);
  }

  /**
     * Construye el objeto de payload para la sección de responsable de inspección.
     * @param tramiteState El estado actual de la solicitud desde el store.
     * @returns El objeto de payload para responsable de inspección.
     */
    private static _buildResponsableInspeccionPayload(
      tramiteState: Solicitud220501State
    ): ResponsableInspeccionPayload {
      return {
        nombre: tramiteState.nombre || null,
        apellido_paterno: tramiteState.primerapellido || null,
        apellido_materno: tramiteState.segundoapellido || null,
        num_total_carros: null, 
        cve_contenedor: tramiteState.tipocontenedor
          ? String(tramiteState.tipocontenedor)
          : null,
      };
    }
    /**
     * Construye el objeto de payload para la sección de productor.
     * @param tramiteState El estado actual de la solicitud desde el store.
     * @returns El objeto de payload para productor.
     */
    private static _buildProductorPayload(
      tramiteState: Solicitud220501State
    ): ProductorPayload {
      return {
        tipo_persona: null, 
        nombre: tramiteState.nombre || null,
        apellido_materno: tramiteState.segundoapellido || null,
        apellido_paterno: tramiteState.primerapellido || null,
        razon_social: tramiteState.nombreEmpresa
          ? String(tramiteState.nombreEmpresa)
          : null,
        descripcion_ubicacion: null, 
        rfc: null,
        pais: null, 
      };
    }

    /**
     * Construye el objeto de payload para la sección de mercancía.
     * @param tramiteState El estado actual de la solicitud desde el store.
     * @returns El objeto de payload para mercancía.
     */
    private static _buildMercanciaPayload(
      tramiteState: Solicitud220501State
    ): MercanciaPayload {
      return {
        cve_fraccion_arancelaria: tramiteState.fraccionArancelaria || null, 
        cve_subdivision: tramiteState.nico || null, 
        descripcion: tramiteState.descripcion || null, 
        cve_unidad_medida_tarifaria: tramiteState.unidaddeMedidaDeUMT || null,
        cve_pais_origen: null, 
        cve_pais_destino: null, 
        cantidad_tarifaria: Number(tramiteState.cantidadTotalUMT) || null,
        valor_factura_usd: null, 
        precio_unitario: null, 
        lote: null, 
        fecha_salida: null, 
        observaciones: null, 
      };
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
    * Maneja el evento de carga en progreso emitido por un componente hijo.
    * Actualiza el estado de cargaEnProgreso según el valor recibido.
    * @param cargando Valor booleano que indica si la carga está en progreso.
    */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onCargaEnProgresoPadre(cargando: boolean) {
    this.cargaEnProgreso = cargando;
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
  
}
