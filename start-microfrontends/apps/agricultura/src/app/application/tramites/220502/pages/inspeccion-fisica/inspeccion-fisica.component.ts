import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { USUARIO_INFO } from '@libs/shared/data-access-user/src/core/enums/usuario-info.enum';

import {
  BtnContinuarComponent,
  DatosPasos,
  DocumentosFirmaStore,
  ListaPasosWizard,
  Usuario,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { InspeccionFisicaResponse, MercanciaSagarpaItem} from '../../models/solicitud-pantallas.model';

import { Subject, combineLatest, map, take, takeUntil } from 'rxjs';

import { Solicitud220502State, Solicitud220502Store } from '../../estados/tramites220502.store';
import { INSPECCION_FISICA_PASOS } from '../../enums/solicitud-pantallas.enum';

import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';

import {
  InspeccionFisicaPayload,
  MercanciaPayload,
  PagoDerechosPayload,
  ProductorPayload,
  RepresentacionFederalPayload,
  ResponsableInspeccionPayload,
  SolicitantePayload,
} from '../../models/solicitud-pantallas.model';
import { MercanciaTabla } from '../../models/medio-transporte.model';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';


/** Interfaz para definir la estructura de las acciones de los botones */
interface AccionBoton {
  /**
   * La acción que se realizará mediante el botón
   */
  accion: string;
  /**
   * El valor del índice
   */
  valor: number;
}
/**
 * Componente para gestionar la inspección física de los servicios extraordinarios.
 */
@Component({
  selector: 'app-inspeccion-fisica',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoDosComponent,
    PasoUnoComponent,
    PasoTresComponent,
    BtnContinuarComponent,
  ],
  templateUrl: './inspeccion-fisica.component.html',
  styleUrl: './inspeccion-fisica.component.scss',
})
/** Componente para gestionar la inspección física de los servicios extraordinarios */
export class InspeccionFisicaComponent implements OnInit {
  @ViewChild(PasoUnoComponent)
pasoUno!: PasoUnoComponent;
   /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;
  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
   * Se utiliza para evitar fugas de memoria al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
   /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;
   /** Carga de progreso del archivo */
  cargaEnProgreso: boolean = true;
   /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  /**
   * Estado de la solicitud.
   */
  public solicitudState!: string;

  datosUsuario: Usuario = USUARIO_INFO;
  /** Lista de pasos del asistente inicializados desde la enumeración */
  pasos: ListaPasosWizard[] = INSPECCION_FISICA_PASOS;

  /** Índice de pasos activos actuales*/
  indice: number = 1;
  /**
   * Estado de la solicitud 220502.
   * @type {Solicitud220502State}
   */
  solicitud220502State: Solicitud220502State = {} as Solicitud220502State;

  /** Referencia al componente secundario Wizard */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Estructura de datos para gestionar las propiedades de los pasos del asistente */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
 /**
   * Notificación que se muestra al usuario.
   * Se utiliza para mostrar mensajes de éxito, error o información.
   */
  constructor(
    private solicitud220502Query: Solicitud220502Query,
    private documentosFirmaStore: DocumentosFirmaStore,
    private solicitudPantallasService: SolicitudPantallasService,
    private notificacionService: NotificacionesService,
    private solicitud220502Store: Solicitud220502Store
  ) {}
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la sección y obtiene la URL actual.
   * Si el estado de la consulta indica que hay datos actualizados, se guardan los datos del formulario.
   * Si no, se establece que hay datos de respuesta disponibles.
   */
  ngOnInit(): void {
    this.solicitud220502Query
      .select((state) => state.id_solicitud)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((id_solicitud) => {
          this.solicitudState = id_solicitud;
        })
      )
      .subscribe();
  }

  /**
   * Maneja la navegación entre los pasos del asistente según las acciones de los botones.
   * @param e - La acción del botón que contiene el tipo de acción y el valor del índice.
   */
  
 getValorIndice(evento: AccionBoton): void {
  if (evento.accion === 'cont' && evento.valor === 1) {
    if( this.pasoUno){
     this.pasoUno.marcarPasoUno();
    }
    const TRAMITE$ = this.solicitud220502Query.select();

    combineLatest([TRAMITE$])
      .pipe(take(1))
      .subscribe(([tramiteState]) => {
        const PAYLOAD = this._buildPayload(tramiteState);
        this.solicitudPantallasService
          .guardarInspeccionFisicaSagarpa(PAYLOAD)
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
              this.solicitud220502Store.setIdSolicitud(res.datos.id_solicitud);
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
   * Construye el objeto de payload para la sección de mercancía.
   * @param tramiteState El estado actual de la solicitud desde el store.
   * @returns El objeto de payload para mercancía.
   */
  private static _buildMercanciaPayload(
    tramiteState: Solicitud220502State
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
   * Construye el objeto de payload para la sección de productor.
   * @param tramiteState El estado actual de la solicitud desde el store.
   * @returns El objeto de payload para productor.
   */
  private static _buildProductorPayload(
    tramiteState: Solicitud220502State
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
      item.saldo_pendiente ??
      item.saldoPendiente ??
      0,

    clave_nico: item.nico ?? "",
    descripcion_nico:
      item.descripcion_nico ??
      item.descripcion ??
      "",
  }));
}

  /**
   * Construye el objeto de payload para la sección de responsable de inspección.
   * @param tramiteState El estado actual de la solicitud desde el store.
   * @returns El objeto de payload para responsable de inspección.
   */
  private static _buildResponsableInspeccionPayload(
    tramiteState: Solicitud220502State
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
   * Construye el objeto de payload para la sección de pago de derechos.
   * @param tramiteState El estado actual de la solicitud desde el store.
   * @returns El objeto de payload para pago de derechos.
   */
  private static _buildPagoDerechosPayload(
    tramiteState: Solicitud220502State
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
   * Construye el objeto de payload para la API de guardar inspección física.
   * @param tramiteState El estado actual de la solicitud desde el store.
   * @returns El objeto de payload.
   */
  private _buildPayload(
    tramiteState: Solicitud220502State
  ): InspeccionFisicaPayload {
    return {
      id_solcitud: tramiteState.id_solicitud || null,
      cve_regimen: tramiteState.regimen ? String(tramiteState.regimen) : '01',
      cve_clasificacion_regimen: '00',
      mercancia: InspeccionFisicaComponent._buildMercanciaPayload(tramiteState),
      productor: InspeccionFisicaComponent._buildProductorPayload(tramiteState),
      solicitante: this._buildSolicitantePayload(),
      numero_certificado: tramiteState.certificadosAutorizados || null,
      representacion_federal:
        InspeccionFisicaComponent._buildRepresentacionFederalPayload(),
      fecha_inspeccion:
        tramiteState.fechaInspeccion && tramiteState.horaDeInspeccion
          ? `${InspeccionFisicaComponent.toYearMonthFirst(tramiteState.fechaInspeccion)} ${tramiteState.horaDeInspeccion}:00`
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
        InspeccionFisicaComponent._buildResponsableInspeccionPayload(
          tramiteState
        ),
      ide_transporte: tramiteState.transporteIdMedio || null,
      identificacion_transporte: tramiteState.identificacionTransporte || null, 
      cve_oficina_inspeccion_agropecuaria:
 tramiteState.oficinaInspeccion || null,
      ide_contenedor: tramiteState.tipocontenedor || null,
      pago_derechos:
        InspeccionFisicaComponent._buildPagoDerechosPayload(tramiteState),
      mercancia_sagarpa: InspeccionFisicaComponent._buildMercanciasPayload( this.solicitud220502Query.getValue().mercanciaLista), 
      cveUCON: null, 
      infAdicional: null, 
      bln_generico1:false 
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
/**
 * Indica si el paso uno es válido.
 */
get pasoUnoValido(): boolean {
    return this.pasoUno?.pasoUnoValido ()?? false;
  }

}
