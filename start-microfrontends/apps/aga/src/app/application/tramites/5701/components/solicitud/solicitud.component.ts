import {
  TITULO_MODAL_AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/terceros.enums';

import {
  ADV_BORRAR_CAMPOS,
  ADV_BORRAR_CAMPOS_LDA,
  ALFANUMERICO_ESPACIO,
  AduanaService,
  CAMPO_VACIO,
  Catalogo,
  CatalogoPaises,
  Catalogos,
  ConfiguracionColumna,
  ConsultaioQuery,
  ConsultaioState,
  CrossListLable,
  DatosAgregarFormulario,
  FechasService,
  FormulariosService,
  InputFecha,
  InputHoraComponent,
  LoginQuery,
  MENSAJE_ALERTA_NO_FECHAS,
  MSG_ALERTA_ELIMINAR_ELEMENTO,
  MSG_DATOS_GUARDADOS,
  MSG_ELIMINA_ELEMENTO,
  Notificacion,
  PROGRAMA_FOMENTO,
  PROGRAMA_IMMEX,
  PaisesService,
  REGEX_RFC,
  RFC_GENERICO,
  Recinto,
  RecintoService,
  SeccionAduanaService,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TEXTO_ACEPTAR,
  TEXTO_CANCELAR,
  TEXTO_CERRAR,
  TEXTO_ELIMINAR_SOLICITUD,
  TIPO_SOLICITUD,
  TablaSeleccion,
  TipoDespachoService,
  TipoOperacionService,
  TipoPedimentoService,
  TipoPersona,
  TipoSolicitudService,
  TipoTransporteService,
  TransporteDespacho,
  ValidaRfcService,
  ValidacionesFormularioService,
  convertirFechaDdMmYyyyAMoment,
  formatFechaServicioToDDMMYYYY,
  limpiarYDeshabilitarControl,
} from '@ng-mf/data-access-user';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
  
import {
  CONFIGURACION_ENCABEZADO_TABLA_PAGOS,
  ERR_RFC_NO_VALIDO,
  ESTATUS_PAGADO,
  ID_NAME_DD,
  ID_NAME_LDA,
  LABEL_CROSSLIST,
  LABEL_DESPACHO_DD,
  LABEL_DESPACHO_LDA,
  PATENTES_ID,
  RFC_SOLICITANTE,
  SIN_ITEMS,
  SIN_VALOR,
  SIN_VALORES,
  TIPO_DESPACHO_DDEX,
  TIPO_ENUM,
  TIPO_OPERACION_EXPORTACION,
  TRANSPORTE,
  URL_GENERAR_LINEA_CAPTURA,
  VEHICULO,
} from '../../../../core/enums/5701/tramite5701.enum';
// eslint-disable-next-line sort-imports
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  DatosComponentePedimento,
  Pedimento,
  ResponsablesDespacho,
} from '../../../../core/models/5701/tramite5701.model';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  delay,
  forkJoin,
  map,
  merge,
  switchMap,
  takeUntil,
  tap,
  throwError,
  timer,
} from 'rxjs';
import {
  Solicitud5701State,
  Tramite5701Store,
} from '../../../../core/estados/tramites/tramite5701.store';
import { BodyValidarRFCAutorizacionLDA } from '../../../../core/models/5701/validaciones-depacho.model';
import { CatalogoLista } from '@libs/shared/data-access-user/src/core/models/shared/tipo-solicitud.model';
import { CertificacionOeaService } from '../../../../core/services/5701/certificacion-oea.service';
import { CertificacionOrigenService } from '../../../../core/services/5701/certificacion-origen.service';
import { CertificacionService } from '../../../../core/services/5701/certificacion.service';
import { DatosCheckInputText } from '../../../../core/models/shared/check-input-text.model';
import { IdcService } from '../../../../core/services/5701/idc.service';
import { IndustriaAutomotrizService } from '../../../../core/services/5701/industria-automotriz.service';
import { LineaCaptura } from '../../../../core/models/5701/linea-captura.model';
import { MODALIDAD_OEA_IMPEXP } from '../../../../constantes/5701/constantes-tramite';
import { ParametroMontoService } from '../../../../core/services/5701/pago/parametro-monto.service';
import { Patente } from '../../../../core/models/5701/Patente.model';
import { PatenteApoderadoService } from '../../../../core/services/5701/patente-apoderado.service';
import { PatenteEmpresaService } from '../../../../core/services/5701/patente-empresas.service';
import { PatenteService } from '../../../../core/services/5701/patente.service';
import { PedimentoComponent } from '../pedimento/pedimento.component';
import { ServiciosExtraordinariosService } from '../../../../core/services/5701/servicios-extraordinarios.service';
import { SocioComercialService } from '../../../../core/services/5701/socio-comercial.service';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';
import { UsuarioState } from '@libs/shared/data-access-user/src/core/estados/usuario.store';
import { ValidaLineaCapturaService } from '../../../../core/services/5701/pago/valida-linea-captura.service';
import { ValidaLineaPagoService } from '../../../../core/services/5701/pago/valida-linea-pago.service';

//Estas importaciones deben eliminarse una vez que se obtengan las patentes y los rfcs de la consulta del api.
// eslint-disable-next-line @nx/enforce-module-boundaries
import patentes from 'libs/shared/theme/assets/json/5701/patentes.json';
// eslint-disable-next-line @nx/enforce-module-boundaries
import rfcs from 'libs/shared/theme/assets/json/5701/rfcs.json';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import {
  CONFIRMAR_ELIMINAR_SOLICITUD,
  MSG_ADUANA_PEDIMENTO,
  MSG_ERROR_RFC_NO_ENCONTRADO,
  MSG_ERROR_SELECCIONE_REGISTRO,
  MSG_MONTO_PAGADO_CUBIERTO,
  MSJ_ERROR_FECHAS_NO_SELECCIONADAS,
  MSJ_ERROR_FECHA_DIA,
  MSJ_ERROR_FECHA_FINAL_NO_SELECCIONADA,
  MSJ_ERROR_FECHA_INICIAL_NO_SELECCIONADA,
  MSJ_ERROR_FECHA_MES,
  MSJ_ERROR_FECHA_SEMANA,
  MSJ_ERROR_FOLIO_DDEX,
  MSJ_ERROR_HORA_FINAL_MENOR_INICIAL,
  MSJ_ERROR_ID_SOCIO_COMERCIAL,
  MSJ_ERROR_LINEA_CAPTURA,
  MSJ_ERROR_LINEA_CAPTURA_NO_VALIDA,
  MSJ_FECHA_DENTRO_DE_HORARIO_ADUANA,
  MSJ_LINEA_CAPTURA_DUPLICADA,
  MSJ_LINEA_CAPTURA_NO_PAGADA,
  MSJ_LINEA_CAPTURA_USADA,
  MSJ_NO_RELACION_ENCARGO_CONFERIDO,
} from '../../../../core/enums/5701/mensajes-modal-5701.enum';
import { BodyValidaHorario } from '../../../../core/models/5701/ValidaHorario.model';
import { BodyValidarEncargoConferido } from '../../../../core/models/5701/encargo-conferido.models';
import { CheckInputTextComponent } from '../../../../shared/components/check-input-text/check-input-text.component';
import { EncargoConferidoService } from '../../../../core/services/5701/encargo-conferido.service';
import { GuardaSolicitudService } from '../../../../core/services/5701/guardar/guarda-solicitud.service';
import { Router } from '@angular/router';
import { SIN_VALOR_SELECT } from '@libs/shared/data-access-user/src/core/enums/transporte-componente.enum';
import { ValidaDespachoService } from '../../../../core/services/5701/valida-despacho.service';
import { ValidaHorarioService } from '../../../../core/services/5701/valida-horario.service';

import { SolicitudDetalleModel } from '../../models/response/solicitud-detalle.model';
@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  /**
   * Índice de tabulación para el control de enfoque en la interfaz.
   * @required
   */
  @Input({ required: true }) tabindex!: number;

  /**
   * Folio de la solicitud.
   * @required
   */
  @Input() folioSolicitud!: string;

  /**
   * @description Bandera para indicar si se está editando una solicitud existente.
   */
  @Input() editarSolicitud: boolean = false;

  /**
   * @description Bandera para indicar si el formulario es editable o de solo lectura.
   */
  @Input() editable: boolean = true;

  /**
   * @description Referencia al componente hijo `InputHoraComponent` asociado con el campo de hora final.
   */
  @ViewChild('horaFinal') horaFinal!: InputHoraComponent;

  /**
   * @description Referencia al componente hijo `InputHoraComponent` asociado con el campo de hora inicial.
   */
  @ViewChild('horaInicio') horaInicio!: InputHoraComponent;

  /**
   * @description Referencia al componente de pedimento.
   */
  @ViewChild(PedimentoComponent) pedimentoComponent!: PedimentoComponent;

  /**
   * Catalogo tipos de solicitud disponibles.
   */
  tiposSolicitud!: Catalogo[];

  /**
   * Catalogos de países, para país de origen y de procedencia.
   */
  paisesOrigen!: CatalogoPaises[];
  paisesProcedencia!: CatalogoPaises[];

  /**
   * Catalogo de aduanas disponibles.
   */
  aduanas!: Catalogos[];

  /**
   * Catalogo de secciones aduaneras disponibles.
   */
  seccionAduanera!: Catalogos[];

  /**
   * Catalogo de tipos de operación.
   */
  tipoOperacion!: Catalogo[];

  /**
   * Catalogo de tipos de transporte y vehículos.
   */
  tipoTransporte!: Catalogo[];
  tipoVehiculo!: Catalogo[];

  /**
   * Catalogo de recinto aduanero.
   */
  recintoCatalogo!: Recinto[];

  /**
   * Catalogo de despacho LDA y DD.
   */
  despachoLdaCatalogo!: Catalogo[];
  despachoDDCatalogo!: Catalogo[];

  /**
   * Catalogo de despachos.
   */
  selectCatalogoDespacho!: Catalogo[];

  /**
   * Activa el catálogo de despacho LDA o DD según la selección del usuario.
   */
  activarCatalogoDespacho: boolean = false;

  /**
   * Activa o desactiva el campo sección aduanera según la selección del usuario
   */
  desactivarSelectSeccionAduanera: boolean = false;

  /**
   * Activa o desactiva el campo recinto aduanero según la selección del usuario
   */
  desactivarSelectRecinto: boolean = false;

  /**
   * Guarda el tipo de solicitud seleccionada por el usuario.
   */
  tipoSolicitudSeleccionada!: number;

  /**
   * Formulario reactivo para gestionar la solicitud.
   */
  FormSolicitud!: FormGroup;

  /**
   * Bandera para controlar si el formulario está inicializado
   */
  formularioInicializado: boolean = false;

  /**
   * Controla la visibilidad del crosslist de fechas.
   */
  colapsable: boolean = false;

  /**
   * Arreglo de cadenas que representa un rango de días para seleccionar.
   */
  selectRangoDias: string[] = [];

  /**
   * Indica si se debe mostrar el rango de fechas.
   */
  mostrarRangoFechas: boolean = false;

  /**
   * Indica si el usuario es un apoderado.
   */
  isApoderado: boolean = false;

  /**
   * Indica si esxiste más de una patente.
   */
  masDeUnaPatente: boolean = false;

  /**
   * Indica si el usuario es un apoderado de más de una empresa.
   */
  masDeUnaEmpresa: boolean = false;

  /**
   * Pedimento -crea una señal para validar
   */
  validacionPedimento?: boolean;

  /**
   * Almacena los datos que necesita el componente Patente para hacer las validaciones
   * patente: Número de patente
   * idAduanaDespacho: Número de aduana elegida
   */
  datosPedimentoComponente!: DatosComponentePedimento;

  /**
   * Variable que toma el valor true si el tipo de despacho LDA o DD ha sido seleccionado, de lo contrario es false.
   */
  despachoSeleccionado: boolean = false;

  /**
   * Variable que toma el valor de la etiqueta del tipo de despacho LDA o DD.
   */
  labelTipoDespacho!: string;

  /**
   * Variable que toma el valor que el id el input que almacena la autorizacion LDA o DD.
   */
  idNameAutorizacion!: string;

  /**
   * Variable que toma el valor de la funcion del store que almacena la autorizacion LDA o DD.
   */
  funcionStoreAutorizacion!: keyof Tramite5701Store;

  /**
   * Variable que toma el valor que tendra el id del tipo de despacho que ha sido seleccionado LDA o DD.
   */
  idTipoDespacho!: string;

  /**
   * Notificador para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la sección utilizado en el componente.
   */
  private seccion!: SeccionLibState;

  /**
   * Estado de la solicitud utilizado en el componente.
   */
  public solicitudState!: Solicitud5701State;

  /**
   * Estado del usuario firmado en la aplicación
   */
  private usuarioState!: UsuarioState;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion | null;

  /**
   * Bandera para saber el tipo de persona del usuario.
   * Por el momento esta bandera está hardcodeada, la información se deberá tomar del store de la aplicación,
   * en cuanto esa implementación esté realizada, esta línea deberá borrarse.
   */
  private tipoPersona: TipoPersona = TipoPersona.FISICA;

  /**
   * Bandera para mostrar u ocultar la sección de certificaciones.
   */
  public muestraCertificaciones: boolean = true;

  /**
   * Tipo de despacho seleccionado por el usuario.
   */
  public tipoDespacho!: string;

  /**
   * Tipo de despacho seleccionado por el usuario.
   */
  public tipoDespachoRequired: boolean = true;

  /**
   * GUarda el tipo de proceso que se eligió y de acuerdo a lo elegido se tomá decision en el modal.
   */
  public procesoModal!: string;

  /**
   * Tabla de selección para los pagos.
   */
  public tablaSeleccionPagos = TablaSeleccion;

  /**
   * Encabezado de la tabla de pagos.
   */
  public encabezadoDeTablaPagos: ConfiguracionColumna<LineaCaptura>[] = CONFIGURACION_ENCABEZADO_TABLA_PAGOS;

  /**
   * Datos de la tabla de pagos.
   */
  public datosTablaPagos: LineaCaptura[] = [];

  /**
   * @description Almacena el monto total a pagar en la solicitud.
   */
  montoACubrir: number = 0;

  /**
   * @description Almacena el monto por dia.
   */
  montoPorDia: number = 0;

  /**
   * @description Almacena los montos a pagar en la solicitud.
   */
  montoPagadoLineas: number = 0;

  /*
  * Valor del RFC obtenido del estado de login.
  */
  public rfcValor: string = '';

  /**
   * @description Mensaje de alerta que se muestra cuando no se han seleccionado fechas, en el crosslist.
   */
  readonly MENSAJE_ALERTA_CROSSLIST = MENSAJE_ALERTA_NO_FECHAS;

  /**
   * @description Label del crosslist de fechas
   */
  readonly LABEL_CROSSLIST_FECHAS: CrossListLable = LABEL_CROSSLIST;

  /***
   * @description Sin valor = -1
   */
  readonly SIN_VALOR = SIN_VALOR;

  /**
   * @description Mensaje de error cuando el RFC no es válido
   */
  readonly ERR_RFC_NO_VALIDO = ERR_RFC_NO_VALIDO;

  /**
   *@description Alamcena las lineas de capturas seleccionadas por el usuario en la tabla.
   */
  lineaCapturaSeleccionados: LineaCaptura[] = [];

  /**
   * @descripcion Checkbox para despacho lda
   */
  public activarCatalogoTipoOperacion: boolean = true;

  /**
   * @descripcion Checkbox para despacho lda
   */
  public activarRelacionSociedad: boolean = false;

  /**
   * @descripcion Checkbox para despacho lda
   */
  public activarEncargoConferido: boolean = false;

  //Estas variables se van a eliminar
  /**
   * Arreglo de patentes de la empresa, con label y value.
   */
  radioPatentes: { label: string; value: string | number; hint?: string }[] = [];
  rfcs: Catalogo[] = [];
  /**
   * @description Bandera para indicar si la hora de inicio del servicio no ha sido marcada.
   */
  horaInicioUnmarked: boolean = false;

  /**
   * @description Bandera para indicar si la hora de fin del servicio no ha sido marcada.
   */
  horaFinUnmarked: boolean = false;

  /**
   * @description Url para generar la línea de captura.
   */
  linkGeneraLineaCapturaSeguro!: SafeUrl;

  /**
   * @description Bandera para deshabilitar el campo de certificaciones.
   */
  certificacionesDisabled: boolean = true;

  /**
   * @description Bandera para deshabilitar el campo de certificación OEA.
   */
  certificacionOEADisabled: boolean = true;

  /**
   * @description Bandera para deshabilitar el campo de certificación revisión de origen.
   */
  revisionDisabled: boolean = true;

  /**
   * @description Banderas para deshabilitar los campos de tipo de empresa certificada.
   */
  tipoEmpresaCertificadaADisabled: boolean = false;
  tipoEmpresaCertificadaAADisabled: boolean = false;
  tipoEmpresaCertificadaAAADisabled: boolean = false;

  /**
   * @description Bandera para deshabilitar el campo de certificación industria automotriz.
   */
  industriaAutomotriz!: CheckInputTextComponent;

  /**
   * Referencia al componente IMMEX.
   * Debe ser asignada por @ViewChild si es un componente hijo.
   */
  programaImmex?: { isDisabled: boolean };

  /**
   * Bandera para indicar si se debe resetear la fecha de inicio del servicio.
   */
  resetearFechaInicioTouch = false;

  /**
   * Bandera para indicar si debe mostrar el select de tipo despacho.
   */
  mostarSelectTipoDespacho: boolean = false;

  readonly DatosFechaFinal: InputFecha = {
    labelNombre: 'Fecha final*',
    required: true,
    habilitado: true,
  };

  readonly DatosFechaInicio: InputFecha = {
    labelNombre: 'Fecha inicial*',
    required: true,
    habilitado: true,
  };

  tabla1 = 'tablaPagos'; 
  /**
   * @description Estado de los datos guardados de la solicitud.
   */
  guardarDatos!: ConsultaioState;

  /**
   * @description Id de la solicitud guardada.Cuando existe(en evaluar component) se usa para identificar la solicitud.
   */
  idSolicitudGuardada!: string;

  /**
   * Tramite guardado
   */
  tramiteGuardado!: string;

  /**
   * folio de la solicitud guardada.Cuando existe(en evaluar component) se usa para identificar la solicitud.
   * 
   */
  folioSolicitudGuardada!: string;

  @Output() validForm = new EventEmitter<boolean>();

  constructor(
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private tramite5701Store: Tramite5701Store,
    private tramite5701Query: Tramite5701Query,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private serviciosExtraordinariosService: ServiciosExtraordinariosService,
    private tipoSolicitudService: TipoSolicitudService,
    private readonly tipoOperacionService: TipoOperacionService,
    private readonly tipoTransporteService: TipoTransporteService,
    private readonly paisesService: PaisesService,
    private readonly tipoDespachoService: TipoDespachoService,
    private readonly aduanaService: AduanaService,
    private readonly patenteService: PatenteService,
    private readonly patenteApoderadoService: PatenteApoderadoService,
    private readonly patenteEmpresasService: PatenteEmpresaService,
    private readonly seccionAduanaService: SeccionAduanaService,
    private readonly recintoService: RecintoService,
    private readonly socioComercial: SocioComercialService,
    private readonly validaRfcService: ValidaRfcService,
    private readonly idcService: IdcService,
    private readonly certificacionService: CertificacionService,
    private readonly certificacionIndustriaAutomotrizService: IndustriaAutomotrizService,
    private readonly certificacionOrigenService: CertificacionOrigenService,
    private readonly certificacionOeaService: CertificacionOeaService,
    private readonly validaLineaPagoService: ValidaLineaPagoService,
    private readonly validaLineaCapturaService: ValidaLineaCapturaService,
    private readonly parametroMontoService: ParametroMontoService,
    private cdRef: ChangeDetectorRef,
    private validaDespachosService: ValidaDespachoService,
    private domSanitizer: DomSanitizer,
    private readonly validaHorarioService: ValidaHorarioService,
    private readonly encargoConferidoService: EncargoConferidoService,
    private readonly guardarSolicitudService: GuardaSolicitudService,
    private readonly router: Router,
    private consultaioQuery: ConsultaioQuery,
    private readonly tipoPedimentoService: TipoPedimentoService,
    private loginQuery: LoginQuery,
  ) {
    // Inicializar solicitudState con valores por defecto para evitar errores de undefined
    this.solicitudState = this.solicitudState || {
      fechasSeleccionadas: [],
      tipoSolicitud: -1,
      descripcionTipoSolicitud: '',
      RFCImportadorExportador: '',
      nombre: '',
      descripcionNumeroRegistro: '',
      programa: false,
      descripcionProgramaFomento: '',
      checkIMMEX: false,
      descripcionImmex: '',
      industriaAutomotriz: false,
      descripcionIndustrialAutomotriz: '',
      tipoEmpresaCertificada: '',
      socioComercial: false,
      certificacionOEA: false,
      revision: false,
      idSocioComercial: '',
      fechaInicio: '',
      fechaFinal: '',
      horaInicio: '',
      horaFinal: '',
      lda: false,
      autorizacionLDA: '',
      dd: false,
      autorizacionDDEX: '',
      idAduanaDespacho: '-1',
      aduanaDespacho: '',
      idSeccionDespacho: '-1',
      seccionAduanera: '',
      nombreRecinto: '-1',
      tipoDespacho: -1,
      descripcionTipoDespacho: '',
      tipoOperacion: '-1',
      patente: { patente: '', tipo_patente: '' },
      relacionSociedad: false,
      encargoConferido: false,
      domicilioDespacho: '',
      especifique: '',
      paisOrigen: -1,
      paisProcedencia: -1,
      descripcionGenerica: '',
      justificacion: '',
      pedimentos: [],
      personasResponsablesDespacho: [],
      tipoTransporte: '',
      transporte: [],
      tipoTransporteArriboSalida: '',
      transporteArriboDatos: [],
      montoPagar: 0,
      lineaCaptura: '',
      monto: 0,
      lineasCaptura: [],
      idSolicitud: 0,
      rfcGenerico: false,
      blnRevisionOrigen: false,
      blnSocioComercial: false
    };
    
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
            const prevEditable = this.guardarDatos?.solicitudEditable;
            this.guardarDatos = seccionState;            

            this.folioSolicitudGuardada=this.guardarDatos.folioTramite;
            this.idSolicitudGuardada=this.guardarDatos.id_solicitud;
            this.tramiteGuardado=this.guardarDatos.procedureId;
            
            if(this.idSolicitudGuardada && !prevEditable){
              this.guardarSolicitudService.getSolicitud(this.tramiteGuardado, this.idSolicitudGuardada).pipe(
                takeUntil(this.destroyNotifier$), 
              ).subscribe((datosSolicitud) => {
                if(datosSolicitud.datos) { 
                  this.tipoSolicitudSeleccionada = datosSolicitud.datos?.tipo_servicio?.cve_tipo_servicio || 0;
                  this.editarSolicitud = false;
                  this.setDataFormSolicitudFromModel(datosSolicitud.datos);
                  this.cdRef.detectChanges();
                }
              });
            }
            
            // Si solicitudEditable cambió a true, recargar datos
            if (seccionState.solicitudEditable && !prevEditable && this.idSolicitudGuardada) {
              setTimeout(() => {
                this.guardarSolicitudService.getSolicitud(this.tramiteGuardado, this.idSolicitudGuardada).pipe(
                  takeUntil(this.destroyNotifier$)
                ).subscribe((datosSolicitud) => {
                  if (datosSolicitud.datos) {
                    this.setDataFormSolicitudFromModel(datosSolicitud.datos);
                    this.cdRef.detectChanges();
                  }
                });
              }, 100);
            }
        })
      )
      .subscribe();
  }

  /**
   * Recarga los datos de la solicitud desde el servicio
   */
  private recargarDatosSolicitud(): void {
    if (this.idSolicitudGuardada && this.tramiteGuardado) {
      this.guardarSolicitudService.getSolicitud(this.tramiteGuardado, this.idSolicitudGuardada).pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe((datosSolicitud) => {
        if (datosSolicitud.datos) {          
          this.tipoSolicitudSeleccionada = datosSolicitud.datos?.tipo_servicio?.cve_tipo_servicio || 0;
          this.setDataFormSolicitudFromModel(datosSolicitud.datos);
          
          // Forzar actualización completa de la vista
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        }
      });
    }
  }



  ngOnInit(): void {
    this.radioPatentes = patentes?.patentes?.map((p: { label: string; value: string | number; hint?: string }) => ({
      label: p.label,
      value: p.value,
      hint: p.hint
    })) ?? [];
    this.rfcs = rfcs?.rfcs;
    this.validaTipoPersona();
    
    // Crear el formulario PRIMERO antes de cualquier otra operación
    this.crearFormSolicitud();
    this.formularioInicializado = true;

    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;          
        })
      )
      .subscribe();

    this.inicializaCatalogos();

    this.tramite5701Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          
          // Si hay fechas seleccionadas, asegurar que el crosslist sea visible
          if (this.solicitudState?.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
            this.mostrarRangoFechas = true;
            this.colapsable = true;
          }
        })
      )
      .subscribe();

    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    this.editable=this.guardarDatos?.solicitudEditable ? true : false;
    if(!this.editable) {
      this.FormSolicitud.disable();
    }
    this.cdRef.detectChanges();
   
    // Escuchar cambios en el estado de validación del formulario
    this.FormSolicitud.statusChanges.subscribe(_ => {
      this.validForm.emit(this.FormSolicitud.valid);
    });
    

    this.initializeTipoEmpresaCertificadaStates();

    this.FormSolicitud.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_) => {
          if(!this.idSolicitudGuardada)
            this.configuraSeccion();
        })
      )
      .subscribe();

    this.verificarDatosExistentesStore();
    
    // Forzar expansión si hay fechas seleccionadas después de verificar datos existentes    
      if (this.solicitudState?.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
        this.colapsable = true;
        this.mostrarRangoFechas = true;        
      }
    // Aqui se busca el nro de patente o autorizacion
    //
    this.obtenerPatente();
    this.calcularMontoTotal();
    this.linkGeneraLineaCapturaSeguro =
      this.domSanitizer.bypassSecurityTrustUrl(URL_GENERAR_LINEA_CAPTURA);
      
    // Cargar catálogos dependientes si hay aduana en el store al inicializar    
      if (this.solicitudState?.idAduanaDespacho && this.solicitudState.idAduanaDespacho !== '-1') {
        setTimeout(() => {
          this.cargarCatalogosDependientes(this.solicitudState.idAduanaDespacho);
        }, 100);
      }
      // Asegurar que colapsable esté expandido si hay fechas
      if (this.solicitudState?.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
        this.colapsable = true;
        this.mostrarRangoFechas = true;
        this.cdRef.detectChanges();
      }      
  }

  ngAfterViewInit(): void {
    // Verificar que el formulario esté inicializado antes de proceder
    if (!this.FormSolicitud || !this.formularioInicializado) {
      return;
    }
    
    // Cargar catálogos dependientes después de que la vista esté inicializada
    if (this.solicitudState?.idAduanaDespacho && this.solicitudState.idAduanaDespacho !== '-1') {
      setTimeout(() => {
        this.cargarCatalogosDependientes(this.solicitudState.idAduanaDespacho);
      }, 150);
    }
    
    // Forzar generación de fechas si hay datos pero no se generaron en verificarDatosExistentesStore    
      if (this.solicitudState?.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {        
        
        // Asegurar que el rango de fechas esté disponible
        if (this.selectRangoDias.length === 0) {
          const fechaInicio = this.datosServicio?.get('fechaInicio')?.value;
          const fechaFinal = this.datosServicio?.get('fechaFinal')?.value;
          const horaInicio = this.datosServicio?.get('horaInicio')?.value;
          const horaFinal = this.datosServicio?.get('horaFinal')?.value;
          
          if (fechaInicio && fechaFinal && horaInicio && horaFinal) {
            const rangoCompleto = FechasService.obtenerDiasEntreFechas(
              fechaInicio,
              fechaFinal,
              horaInicio,
              horaFinal
            );
            
            const fechasSeleccionadasConvertidas = this.solicitudState.fechasSeleccionadas.map(fecha => 
              this.convertirFechaParaComparacion(fecha)
            );
            
            this.selectRangoDias = rangoCompleto.filter(fecha => {
              const fechaExtraida = fecha.includes(',') ? fecha.split(',')[1].trim() : fecha;
              return !fechasSeleccionadasConvertidas.includes(fechaExtraida);
            });
          }
        }
        
        // Asegurar visibilidad del crosslist
        this.colapsable = true;
        this.mostrarRangoFechas = true;
        this.cdRef.detectChanges();
      }
  }

  setDataFormSolicitudFromModel(data: SolicitudDetalleModel): void {
    if (!this.FormSolicitud || !this.formularioInicializado) {      
      setTimeout(() => {
        this.setDataFormSolicitudFromModel(data);
      }, 100);
      return;
    }
    
    // Asegurar que tipoSolicitudSeleccionada se actualice PRIMERO
    this.tipoSolicitudSeleccionada = data.tipo_servicio.cve_tipo_servicio ?? 0;

    // Actualiza el formulario
    this.FormSolicitud.patchValue({
      folioSolicitud: this.folioSolicitudGuardada,
      tipoSolicitud: data.tipo_servicio.cve_tipo_servicio ?? null,
      descripcionTipoSolicitud: '',
      datosImportadorExportador: {
        RFCImpExp: data.importador_exportador?.rfc ?? null,
        nombre: data.importador_exportador?.nombre ?? null,
        desNumeroRegistro: data.importador_exportador?.desc_numero_registro ?? null,
        programa: data.importador_exportador?.programa_fomento ?? null,
        desProgramaFomento: data.importador_exportador?.desc_programa_fomento ?? null,
        checkIMMEX: data.importador_exportador?.immex ?? null,
        desImmex: data.importador_exportador?.desc_immex ?? null,
        industriaAutomotriz: data.importador_exportador?.industria_automotriz ?? null,
        desIndustrialAutomotriz: data.importador_exportador?.desc_industrial_automotriz ?? null,
        tipoEmpresaCertificadaA: data.importador_exportador?.certificacion_a ?? null,
        tipoEmpresaCertificadaAA: data.importador_exportador?.certificacion_aa ?? null,
        tipoEmpresaCertificadaAAA: data.importador_exportador?.certificacion_aaa ?? null,
        socioComercial: data.importador_exportador?.socio_comercial ?? null,
        certificacionOEA: data.importador_exportador?.oea ?? null,
        revision: data.importador_exportador?.revisionOrigen ?? null,
        idSocioComercial: data.importador_exportador?.id_socio_comercial ?? null,
      },
      datosServicio: {
        fechaInicio: data.despacho?.fecha_inicio ?? null,
        fechaFinal: data.despacho?.fecha_final ?? null,
        horaInicio: data.despacho?.hora_inicio ?? null,
        horaFinal: data.despacho?.hora_fin ?? null,

      },
      despacho: {
        lda: data.despacho?.bln_lda ?? null,
        rfcDespachoLDA: data.despacho?.rfc_despacho ?? null,
        dd: data.despacho?.bln_dd ?? null,
        folioDDEX: data.despacho?.folio_ddex ?? null,
        idAduanaDespacho: data.despacho?.aduana_despacho ?? null,
        aduanaDespacho: data.despacho?.aduana_despacho ?? null,
        idSeccionDespacho: data.despacho?.id_seccion_despacho ?? null,
        seccionAduanera:  null,
        idRecinto:  null,
        nombreRecinto: data.despacho?.nombre_recinto ?? null,
        tipoDespacho: data.despacho?.tipo_despacho ?? null,
        descripcionTipoDespacho:  null,
        tipoOperacion: data.despacho?.tipo_operacion ?? null,
        patente: data.patente ?? null,
        relacionSociedad: data.despacho?.relacion ?? null,
        encargoConferido: data.despacho?.encargo_conferido ?? null,
        domicilioDespacho: data.despacho?.domicilio ?? null,
        especifique: data.despacho?.especifique ?? null,
      },
      mercancia: {
        paisOrigen: data.mercancia?.pais_origen ?? '',
        paisProcedencia: data.mercancia?.pais_procedencia ?? '',
        descripcionGenerica: data.mercancia?.descripcion_generica ?? null,
        justificacion: data.mercancia?.justificacion ?? null,
      },
      // Puedes agregar aquí el mapeo de otros grupos/arreglos según el modelo completo
    });
    
    // Actualiza el store con los datos consultados usando los setters correctos
    if (data.importador_exportador) {
      this.tramite5701Store.setTipoSolicitud(this.tipoSolicitudSeleccionada);
      this.tramite5701Store.setRFCImportadorExportador(data.importador_exportador.rfc ?? '');
      this.tramite5701Store.setNombre(data.importador_exportador.nombre ?? '');
      this.tramite5701Store.setDescripcionNumeroRegistro(data.importador_exportador.desc_numero_registro ?? '');
      this.tramite5701Store.setPrograma(data.importador_exportador.programa_fomento ?? '');
      this.tramite5701Store.setDescripcionProgramaFomento(data.importador_exportador.desc_programa_fomento ?? '');
      this.tramite5701Store.setCheckIMMEX(data.importador_exportador.immex ?? false);
      this.tramite5701Store.setDescripcionImmex(data.importador_exportador.desc_immex ?? '');
      this.tramite5701Store.setIndustriaAutomotriz(data.importador_exportador.industria_automotriz ?? false);
      this.tramite5701Store.setDescripcionIndustriaAutomotriz(data.importador_exportador.desc_industrial_automotriz ?? '');
      this.tramite5701Store.setTipoEmpresaCertificada(
        data.importador_exportador.certificacion_aaa ? 'aaa' :
        data.importador_exportador.certificacion_aa ? 'aa' :
        data.importador_exportador.certificacion_a ? 'a' : ''
      );
      this.tramite5701Store.setSocioComercial(data.importador_exportador.socio_comercial ?? '');
      this.tramite5701Store.setCertificacionOEA(data.importador_exportador.oea ?? false);
      this.tramite5701Store.setRevision(data.importador_exportador.revisionOrigen ?? false);
      this.tramite5701Store.setIdSocioComercial(data.importador_exportador.id_socio_comercial ?? '');
    }
    if (data.despacho) {
      this.tramite5701Store.setFechaInicio(data.despacho.fecha_inicio ?? '');
      this.tramite5701Store.setIdSeccionDespacho(data.despacho.id_seccion_despacho.toString() ?? '');
      
      this.tramite5701Store.setFechaFinal(data.despacho.fecha_final ?? '');
      this.tramite5701Store.setHoraInicio(data.despacho.hora_inicio ?? '');
      this.tramite5701Store.setHoraFinal(data.despacho.hora_fin ?? '');
      this.tramite5701Store.setLDA (data.despacho.bln_lda ?? false);
      this.tramite5701Store.setAutorizacionLDA(data.despacho.rfc_despacho ?? '');
      this.tramite5701Store.setDD(data.despacho.bln_dd ?? false);
      this.tramite5701Store.setAutorizacionDDEX(data.despacho.folio_ddex ?? '');
      this.tramite5701Store.setIdAduanaDespacho(data.despacho.aduana_despacho ?? '');
      this.tramite5701Store.setAduanaDespacho(data.despacho.aduana_despacho ?? '');
      this.tramite5701Store.setIdSeccionDespacho(data.despacho.id_seccion_despacho.toString() ?? '');
      this.tramite5701Store.setSeccionAduanera('');
      this.tramite5701Store.setNombreRecinto(data.despacho.nombre_recinto ?? '');
      this.tramite5701Store.setTipoDespacho(parseInt(data.despacho.tipo_despacho || ''));
      this.tramite5701Store.setDescripcionTipoDespacho('');
      this.tramite5701Store.setTipoOperacion(data.despacho.tipo_operacion ?? '');
     // this.tramite5701Store.setPatente(data.patente);
      this.tramite5701Store.setRelacionSociedad(data.despacho.relacion ? true: false);
      this.tramite5701Store.setEncargoConferido(data.despacho.encargo_conferido ? true: false);
      this.tramite5701Store.setDomicilioDespacho(data.despacho.domicilio ?? '');
      this.tramite5701Store.setEspecifique(data.despacho.especifique ?? '');
      
      // Cargar catálogos dependientes si hay aduana seleccionada
      if (data.despacho.aduana_despacho) {
        this.cargarCatalogosDependientes(data.despacho.aduana_despacho.toString());
      }
    }
    if (data.mercancia) {
      this.tramite5701Store.setPaisOrigen(data.mercancia.pais_origen ?? '');
      this.tramite5701Store.setPaisProcedencia(data.mercancia.pais_procedencia ?? '');
      this.tramite5701Store.setDescripcionGenerica(data.mercancia.descripcion_generica ?? '');
      this.tramite5701Store.setJustificacion(data.mercancia.justificacion ?? '');
    }
    // Mapea y actualiza los pedimentos en el store
    if(data.pedimentos && data.pedimentos.length > 0) {
        const arregloPedimentos: Pedimento[] = [];
        data.pedimentos.forEach((pedimento) => {
          // Buscar la descripción del tipo de pedimento
          const TIPO_PEDIMENTO_ID = parseInt(pedimento.tipo_de_pedimento);
          let descTipoPedimento = 'Por evaluar'; // Valor por defecto
    
          // Buscar en el catálogo de tipos de pedimento si está disponible
          this.tipoPedimentoService.getListaTipoPedimento().subscribe(response => {
            if (response.datos && response.datos.length > 0) {
              const TIPO_ENCONTRADO = response.datos.find(tipo => tipo.id === TIPO_PEDIMENTO_ID);
              if (TIPO_ENCONTRADO) {
                descTipoPedimento = TIPO_ENCONTRADO.descripcion;
                // Actualizar el pedimento con la descripción correcta
                const pedimentoIndex = arregloPedimentos.findIndex(p => p.idPedimento === pedimento.id_pedimento);
                if (pedimentoIndex !== -1) {
                  arregloPedimentos[pedimentoIndex].descTipoPedimento = descTipoPedimento;
                  this.tramite5701Store.setPedimentos([...arregloPedimentos]);
                  this.changeAgregarPedimento([...arregloPedimentos]);
                }
              }
            }
          });
          
          arregloPedimentos.push({
            idPedimento: pedimento.id_pedimento,
            patente: pedimento.patente.toString(),
            pedimento: parseInt(pedimento.pedimento),
            aduana: parseInt(pedimento.aduana),
            tipoPedimento: TIPO_PEDIMENTO_ID,
            estadoPedimento: pedimento.estado_pedimento.toString(),
            subEstadoPedimento: pedimento.sub_estado_pedimento.toString(),
            descTipoPedimento: descTipoPedimento,
            numero: TIPO_PEDIMENTO_ID === 4 ? '' : (pedimento.numeros || pedimento.numero_pedimento || ''),
            comprobanteValor: TIPO_PEDIMENTO_ID === 4 ? (pedimento.cove || '') : '',
            pedimentoValidado: pedimento.pedimento_valido === 'true' || pedimento.pedimento_valido === "true" ? 'Si' : 'No'

        });
      });
      
      this.tramite5701Store.setPedimentos(arregloPedimentos);
      this.changeAgregarPedimento(arregloPedimentos);
    }
    
    // Forzar generación de fechas disponibles después de cargar datos    
      if (data.list_fechas_sevex && data.list_fechas_sevex.length > 0 && 
          data.despacho?.fecha_inicio && data.despacho?.fecha_final &&
          data.despacho?.hora_inicio && data.despacho?.hora_fin) {
        
        const rangoCompleto = FechasService.obtenerDiasEntreFechas(
          data.despacho.fecha_inicio,
          data.despacho.fecha_final,
          data.despacho.hora_inicio,
          data.despacho.hora_fin
        );
        
        const fechasSeleccionadas = data.list_fechas_sevex.map(fecha => fecha.fecha);
        const fechasSeleccionadasConvertidas = fechasSeleccionadas.map(fecha => 
          this.convertirFechaParaComparacion(fecha)
        );
        
        this.selectRangoDias = rangoCompleto.filter(fecha => {
          const fechaExtraida = fecha.includes(',') ? fecha.split(',')[1].trim() : fecha;
          return !fechasSeleccionadasConvertidas.includes(fechaExtraida);
        });
        
        this.mostrarRangoFechas = true;
        this.colapsable = true;                
        this.cdRef.detectChanges();
      }
    
    // Setea datos del transporte despacho
    if(data.transporte_despacho) {
      this.tramite5701Store.setTipoTransporte(data.transporte_despacho.tipo_transporte ?? '');
      this.changeSeleccionTipoVehiculo(data.transporte_despacho.tipo_transporte ?? '');
    };

    // Mapea y actualiza los pagos en la tabla
    if(data.list_pagos && data.list_pagos.length > 0) {
      const arregloPagos = data.list_pagos.map(pago => ({        
        lineaCaptura: pago.linea_captura,
        monto: pago.monto
      }));
      
      this.datosTablaPagos = arregloPagos;
    }

    if(data.list_transporte_despacho && data.list_transporte_despacho.length > 0) {
      const vehiculos: TransporteDespacho[] = [];
      const tipoTransporte = data.transporte_despacho?.tipo_transporte || '';
      
      data.list_transporte_despacho.forEach((vehiculo) => {
        const transporte: TransporteDespacho = {
          tipo_transporte: tipoTransporte,
          observaciones: vehiculo.observaciones || ''
        };

        // Mapear campos según el tipo de transporte        
        switch(tipoTransporte) {                    
          case '1': // Carretero
            transporte.emp_transportista = vehiculo.emp_transportista || '';
            transporte.fecha_porte = formatFechaServicioToDDMMYYYY(vehiculo.fecha_porte || '');
            transporte.marca_transporte = vehiculo.marca_transporte || '';
            transporte.modelo_transporte = vehiculo.modelo_transporte || '';
            transporte.numero_porte = vehiculo.numero_porte || '';
            transporte.placas_transporte = vehiculo.placas_transporte || '';
            transporte.contenedor_transporte = vehiculo.contenedor_transporte || '';
            break;
          case '2': // Ferroviario
            transporte.numero_bl = vehiculo.numero_bl || '';
            transporte.tipo_equipo = vehiculo.tipo_equipo || '';
            transporte.iniciales_equipo = vehiculo.iniciales_equipo || '';
            transporte.numero_equipo = vehiculo.numero_equipo || '';
            break;
          case '5': // Peatonal
            transporte.emp_transportista = vehiculo.emp_transportista || '';
            transporte.rfc_empresa = vehiculo.rfc_empresa || '';
            transporte.nombre_transportista = vehiculo.nombre_transportista || '';
            transporte.num_gafete = vehiculo.num_gafete || '';
            break;
          case '6': // Otro
            transporte.emp_transportista = vehiculo.emp_transportista || '';
            transporte.tipo_transporte_des = vehiculo.tipo_transporte_des || '';
            transporte.datos_transporte = vehiculo.datos_transporte || '';
            transporte.observaciones = vehiculo.observaciones || '';
            break;
          default:
            // Para otros tipos (Aéreo, Marítimo) mantener mapeo completo
            transporte.emp_transportista = vehiculo.emp_transportista || '';
            transporte.numero_porte = vehiculo.numero_porte || '';
            transporte.fecha_porte = formatFechaServicioToDDMMYYYY(vehiculo.fecha_porte || '');
            transporte.marca_transporte = vehiculo.marca_transporte || '';
            transporte.modelo_transporte = vehiculo.modelo_transporte || '';
            transporte.placas_transporte = vehiculo.placas_transporte || '';
            transporte.contenedor_transporte = vehiculo.contenedor_transporte || '';
            transporte.numero_bl = vehiculo.numero_bl || '';
            transporte.tipo_equipo = vehiculo.tipo_equipo || '';
            transporte.iniciales_equipo = vehiculo.iniciales_equipo || '';
            transporte.numero_equipo = vehiculo.numero_equipo || '';
            transporte.rfc_empresa = vehiculo.rfc_empresa || '';
            transporte.nombre_transportista = vehiculo.nombre_transportista || '';
            transporte.num_gafete = vehiculo.num_gafete || '';
            transporte.tipo_transporte_des = vehiculo.tipo_transporte_des || '';
            transporte.datos_transporte = vehiculo.datos_transporte || '';
            break;
        }
        
        vehiculos.push(transporte);
      });
      this.tramite5701Store.setTransporte(vehiculos);
      this.changeAgregarVehiculo(vehiculos, 'vehiculo');
      
    }

    if(data.unidad_arribo ) {
     this.tramite5701Store.setTipoTransporteArriboSalida(data.unidad_arribo.tipo_transporte || '');
     this.changeSeleccionTipoVehiculo(data.unidad_arribo.tipo_transporte || '');
    }

    if(data.list_unidad_arribo && data.list_unidad_arribo.length > 0) {
      const vehiculosArribo: TransporteDespacho[] = [];
      const tipoTransporte = data.unidad_arribo?.tipo_transporte || '';
      
      data.list_unidad_arribo.forEach((vehiculo) => {
        const transporteArribo: TransporteDespacho = {  
          tipo_transporte: tipoTransporte,
          placas_transporte: vehiculo.placas_transporte || '',
          contenedor_transporte: vehiculo.contenedor_transporte || '',
          observaciones: vehiculo.observaciones || '',
          modelo_transporte: vehiculo.modelo_transporte || '',
          marca_transporte: vehiculo.marca_transporte || '',  
          emp_transportista: vehiculo.emp_transportista || '',
          fecha_porte: formatFechaServicioToDDMMYYYY(vehiculo.fecha_porte || ''),
          numero_porte: vehiculo.numero_porte || '',
          numero_bl: vehiculo.numero_bl || '',
          tipo_equipo: vehiculo.tipo_equipo || '',
          iniciales_equipo: vehiculo.iniciales_equipo || '',
          descripcion_equipo: vehiculo.descripcion_equipo || '',
          numero_equipo: vehiculo.numero_equipo || '',
          arribo_pendiente_aereo: vehiculo.arribo_pendiente_aereo? true: false,
          guia_master_aereo: vehiculo.guia_master_aereo || '',
          guia_house_aereo: vehiculo.guia_house_aereo || '',
          fecha_arribo_aereo: vehiculo.fecha_arribo_aereo || '',
          hora_arribo_aereo: vehiculo.hora_arribo_aereo || '',
          guia_valida: vehiculo.guia_valida ? true: false,
          guia_house_valida: vehiculo.guia_house_valida ? true: false,
          guia_master_valida: vehiculo.guia_master_valida ? true: false,
          guia_bl_Maritimo: vehiculo.guia_bl_maritimo || '',
          guia_house_maritimo: vehiculo.guia_house_maritimo || '',
          nombre_buque_maritimo: vehiculo.nombre_buque_maritimo || '',
          contenedor_maritimo: vehiculo.contenedor_maritimo || '',
          datos_transporte: vehiculo.datos_transporte || '',
          tipo_transporte_des: vehiculo.tipo_transporte_des || '',
          mismos_datos_transporte: vehiculo.mismosDatosTransporte ? true: false

        };
        vehiculosArribo.push(transporteArribo);
      });
      this.tramite5701Store.setTransporteArriboDatos(vehiculosArribo);
      this.changeAgregarVehiculo(vehiculosArribo, 'arriboSalida');
    }

    if(data.persona_responsable) {
      const personasResponsables: ResponsablesDespacho[] = [];
      data.persona_responsable.forEach((persona) => {
        personasResponsables.push({ 
          nombre: persona.nombre,
          gafeteRespoDespacho: persona.gafete,
          primerApellido: persona.apellido_paterno,
          segundoApellido: persona.apellido_materno,
        });
      });
      this.tramite5701Store.setPersonasResponsablesDespacho(personasResponsables);
      this.changeResponsablesDespacho(personasResponsables);
    }

    if(data.list_fechas_sevex) {
      const fechasSeleccionadas: string[] = [];
      data.list_fechas_sevex.forEach((fecha) => {
        fechasSeleccionadas.push(fecha.fecha);
      });
      
      // Establecer fechas seleccionadas en el store PRIMERO
      this.tramite5701Store.setFechasSeleccionadas(fechasSeleccionadas);
      
      // Forzar mostrar el crosslist inmediatamente
      this.mostrarRangoFechas = true;
      this.colapsable = true;            
    }
    // Vuelve a deshabilitar el formulario después de cargar datos, por si patchValue habilitó algún campo
    if (!this.editable) {
      this.FormSolicitud.disable({ emitEvent: false });
    }
    
    // Forzar detección de cambios para actualizar la vista
    this.cdRef.detectChanges();
  }

  /**
   * Bandera para mostrar mensaje de error de personas responsables
   */
  mostrarErrorPersonasResponsables: boolean = false;

  /**
   * Bandera para mostrar mensaje de error de pedimentos
   */
  mostrarErrorPedimentos: boolean = false;

  // Método para forzar validación
  validarFormulario(): boolean {
    this.FormSolicitud.updateValueAndValidity();
    this.FormSolicitud.markAllAsTouched();
   
    const personas = this.solicitudState?.personasResponsablesDespacho || [];
    this.mostrarErrorPersonasResponsables = personas.length === 0;
   
    // Validar pedimentos solo si es tipo individual
    if (this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL) {
      const pedimentos = this.solicitudState?.pedimentos || [];      
      
      if (pedimentos.length === 0) {
        if (this.pedimentoComponent) {
          this.pedimentoComponent.mostrarMensajeError = true;
        }
        return false;
      }
      
      const pedimentosSinTipo = pedimentos.some(p => !p.tipoPedimento || p.tipoPedimento === 0);
      if (pedimentosSinTipo) {
        if (this.pedimentoComponent) {
          this.pedimentoComponent.mostrarMensajeError = true;
        }
        return false;
      }
      
      const pedimentosSinDatos = pedimentos.some(p => {
        if (p.tipoPedimento && p.tipoPedimento !== 0) {
          if (p.tipoPedimento === 4) {
            return !p.comprobanteValor || p.comprobanteValor.trim() === '';
          } else {
            return !p.numero || p.numero.trim() === '';
          }
        }
        return false;
      });
      
      if (pedimentosSinDatos) {
        if (this.pedimentoComponent) {
          this.pedimentoComponent.mostrarMensajeError = true;
        }
        return false;
      }
      if (this.pedimentoComponent) {
        this.pedimentoComponent.mostrarMensajeError = false;
      }
    }
   
    return this.FormSolicitud.valid && !this.mostrarErrorPersonasResponsables;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['folioSolicitud'] && changes['folioSolicitud'].currentValue) {
      this.FormSolicitud.get('folioSolicitud')?.setValue(this.folioSolicitud);
      // Se hace la peticion para obtener los datos de la solicitud
    }
  }

  /**
   * Copia de las fechas seleccionadas para el crosslist
   */
  fechasSeleccionadasCrosslist: string[] = [];

  /**
   * Método público para compatibilidad - no hace nada porque la funcionalidad ya existe
   */
  public repoblarFormularioAlRegresarAPaso1(): void {
    this.forzarRecargaDesdeStore();
  }

  /**
   * Fuerza la recarga de datos desde el store al formulario
   * Este método se usa cuando el usuario regresa al paso 1
   */
  public forzarRecargaDesdeStore(): void {    
    
    if (!this.FormSolicitud || !this.formularioInicializado) {
      return;
    }
    
    // Verificar si hay datos en el store para recargar
    if (!this.solicitudState || Object.keys(this.solicitudState).length === 0) {
      return;
    }
    
    // Actualizar tipo de solicitud seleccionada PRIMERO
    if (this.solicitudState.tipoSolicitud && this.solicitudState.tipoSolicitud !== -1) {
      this.tipoSolicitudSeleccionada = parseInt(this.solicitudState.tipoSolicitud.toString(), 10);
    }
    
    // Recargar datos básicos del formulario
    this.FormSolicitud.patchValue({
      tipoSolicitud: this.solicitudState.tipoSolicitud || -1,
      descripcionTipoSolicitud: this.solicitudState.descripcionTipoSolicitud || '',
      datosImportadorExportador: {
        RFCImpExp: this.solicitudState.RFCImportadorExportador || '',
        nombre: this.solicitudState.nombre || '',
        desNumeroRegistro: this.solicitudState.descripcionNumeroRegistro || '',
        programa: this.solicitudState.programa || false,
        desProgramaFomento: this.solicitudState.descripcionProgramaFomento || '',
        checkIMMEX: this.solicitudState.checkIMMEX || false,
        desImmex: this.solicitudState.descripcionImmex || '',
        industriaAutomotriz: this.solicitudState.industriaAutomotriz || false,
        desIndustrialAutomotriz: this.solicitudState.descripcionIndustrialAutomotriz || '',
        tipoEmpresaCertificadaA: this.solicitudState.tipoEmpresaCertificada === 'a',
        tipoEmpresaCertificadaAA: this.solicitudState.tipoEmpresaCertificada === 'aa',
        tipoEmpresaCertificadaAAA: this.solicitudState.tipoEmpresaCertificada === 'aaa',
        socioComercial: this.solicitudState.socioComercial || false,
        certificacionOEA: this.solicitudState.certificacionOEA || false,
        revision: this.solicitudState.revision || false,
        idSocioComercial: this.solicitudState.idSocioComercial || '',
      },
      datosServicio: {
        fechaInicio: this.solicitudState.fechaInicio || '',
        fechaFinal: this.solicitudState.fechaFinal || '',
        horaInicio: this.solicitudState.horaInicio || '',
        horaFinal: this.solicitudState.horaFinal || '',
      },
      despacho: {
        lda: this.solicitudState.lda || false,
        rfcDespachoLDA: this.solicitudState.autorizacionLDA || '',
        dd: this.solicitudState.dd || false,
        folioDDEX: this.solicitudState.autorizacionDDEX || '',
        idAduanaDespacho: this.solicitudState.idAduanaDespacho || '-1',
        aduanaDespacho: this.solicitudState.aduanaDespacho || '',
        idSeccionDespacho: this.solicitudState.idSeccionDespacho || '-1',
        seccionAduanera: this.solicitudState.seccionAduanera || '',
        nombreRecinto: this.solicitudState.nombreRecinto || '-1',
        tipoDespacho: this.solicitudState.tipoDespacho || -1,
        descripcionTipoDespacho: this.solicitudState.descripcionTipoDespacho || '',
        tipoOperacion: this.solicitudState.tipoOperacion || '-1',
        patente: this.solicitudState.patente?.patente || '',
        relacionSociedad: this.solicitudState.relacionSociedad || false,
        encargoConferido: this.solicitudState.encargoConferido || false,
        domicilioDespacho: this.solicitudState.domicilioDespacho || '',
        especifique: this.solicitudState.especifique || '',
      },
      mercancia: {
        paisOrigen: this.solicitudState.paisOrigen || '',
        paisProcedencia: this.solicitudState.paisProcedencia || '',
        descripcionGenerica: this.solicitudState.descripcionGenerica || '',
        justificacion: this.solicitudState.justificacion || '',
      },
    }, { emitEvent: false });
    
    // Recargar fechas seleccionadas si existen y configurar crosslist según tipo de solicitud
    if (this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
      
      // Limpiar el FormArray de fechas seleccionadas
      this.fechasSeleccionadas.clear();
      
      // Agregar las fechas seleccionadas al FormArray
      this.solicitudState.fechasSeleccionadas.forEach((fecha) => {
        // Las fechas vienen en formato "Día, DD/MM/YYYY", extraer solo la fecha
        const fechaSoloNumeros = fecha.includes(',') ? fecha.split(',')[1].trim() : fecha;
        let fechaFormat = convertirFechaDdMmYyyyAMoment(fechaSoloNumeros);
        this.fechasSeleccionadas.push(new FormControl(fechaFormat));
      });
      

      
      // Regenerar rango de fechas disponibles (excluyendo las ya seleccionadas)
      if (this.solicitudState.fechaInicio && this.solicitudState.fechaFinal && 
          this.solicitudState.horaInicio && this.solicitudState.horaFinal) {
        
        const rangoCompleto = FechasService.obtenerDiasEntreFechas(
          this.solicitudState.fechaInicio,
          this.solicitudState.fechaFinal,
          this.solicitudState.horaInicio,
          this.solicitudState.horaFinal
        );
        

        
        // Filtrar fechas ya seleccionadas del rango disponible
        this.selectRangoDias = rangoCompleto.filter(fechaRango => {
          const fechaRangoExtraida = fechaRango.includes(',') ? fechaRango.split(',')[1].trim() : fechaRango;
          return !this.solicitudState.fechasSeleccionadas.some(fechaSeleccionada => {
            const fechaSeleccionadaExtraida = fechaSeleccionada.includes(',') ? fechaSeleccionada.split(',')[1].trim() : fechaSeleccionada;
            return fechaSeleccionadaExtraida === fechaRangoExtraida;
          });
        });
        

      }
      
      // Configurar visibilidad del crosslist según el tipo de solicitud
      if (this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL) {
        // Para individual: no mostrar crosslist aunque haya fechas seleccionadas
        this.mostrarRangoFechas = false;
        this.colapsable = false;
        this.fechasSeleccionadasCrosslist = [];

      } else {
        // Para semanal/mensual: mostrar crosslist si hay fechas seleccionadas
        this.mostrarRangoFechas = true;
        this.colapsable = true;
        this.fechasSeleccionadasCrosslist = [...this.solicitudState.fechasSeleccionadas];

      }
    } else {
      // No hay fechas seleccionadas
      this.mostrarRangoFechas = false;
      this.colapsable = false;
      this.fechasSeleccionadasCrosslist = [];

    }
    
    // Recargar catálogos dependientes si hay aduana seleccionada
    if (this.solicitudState.idAduanaDespacho && this.solicitudState.idAduanaDespacho !== '-1') {
  
      this.cargarCatalogosDependientes(this.solicitudState.idAduanaDespacho);
    }
    
    // Forzar detección de cambios
    this.cdRef.detectChanges();
    
    // Si hay fechas seleccionadas y debe mostrarse el crosslist, forzar actualización después de un breve delay
    if (this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0 && this.mostrarRangoFechas) {
      setTimeout(() => {
        // Crear nueva referencia para forzar detección de cambios
        this.fechasSeleccionadasCrosslist = [...this.solicitudState.fechasSeleccionadas];
        this.cdRef.detectChanges();
      }, 100);
    }
    

  }

  /**
   * @description Valida tipo de persona y obtiene la patente si es persona física.
   * @returns {void}
   */
  private validaTipoPersona(): void {
    // Esta validación debería cambiar y validar contra el valor almacenado
    // en el store.
    if (this.tipoPersona === TipoPersona.FISICA) {
      this.obtenerPatente();
    }
  }

  /**
   * Método para actualizar las secciones una vez que contengan toda la información marcada como requerida
   */
  private configuraSeccion(): void {
    let seccion: number | null = 0;
    const FORMAS_VALIDADAS = this.seccion.formaValida;

    for (let i = 0; i < this.seccion.seccion.length; i++) {
      if (
        this.seccion.seccion[i] === true &&
        this.seccion.formaValida[i] === false
      ) {
        seccion = i;
        break;
      } else {
        seccion = null;
      }
    }

    if (seccion !== null) {
      if (this.FormSolicitud.valid) {
        FORMAS_VALIDADAS[seccion] = true;
        this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
      } else {
        FORMAS_VALIDADAS[seccion] = false;
        this.seccionStore.establecerFormaValida(FORMAS_VALIDADAS);
      }
    }
  }

  /**
   * Obtiene el grupo de formulario 'datosImportadorExportador' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'datosImportadorExportador'.
   */
  get datosImportadorExportador(): FormGroup {
    return this.FormSolicitud?.get('datosImportadorExportador') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'datosServicio' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'datosServicio'.
   */
  get datosServicio(): FormGroup {
    return this.FormSolicitud?.get('datosServicio') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'despacho' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'despacho'.
   */
  get despacho(): FormGroup {
    return this.FormSolicitud?.get('despacho') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'pedimento' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'pedimento'.
   */
  get pedimento(): FormArray {
    return this.FormSolicitud.get('pedimento') as FormArray;
  }

  /**
   * Obtiene el array del formulario 'personasResponsablesDespacho' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormArray} El array de formulario 'personasResponsablesDespacho'.
   */
  get personasResponsablesDespacho(): FormArray {
    return this.FormSolicitud.get('personasResponsablesDespacho') as FormArray;
  }

  /**
   * Obtiene el array del formulario 'lineasCaptura' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormArray} El array de formulario 'lineasCaptura'.
   */
  get lineasCaptura(): FormArray {
    return this.pagoCaptura.get('lineasCaptura') as FormArray;
  }

  /**
   * Obtiene el grupo de formulario 'mercancia' del formulario principal 'FormSolicitud'.
   */
  get mercancia(): FormGroup {
    return this.FormSolicitud.get('mercancia') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'pagoCaptura' del formulario principal 'FormSolicitud'.
   */
  get pagoCaptura(): FormGroup {
    return this.FormSolicitud.get('pagoCaptura') as FormGroup;
  }

  /**vehiculo
   * Obtiene el grupo de formulario 'vehiculo' del formulario principal 'FormSolicitud'.
   */
  get vehiculo(): FormGroup {
    return this.FormSolicitud.get('vehiculo') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'transporteArriboSalida' del formulario principal 'FormSolicitud'.
   */
  get transporteArriboSalida(): FormGroup {
    return this.FormSolicitud.get('transporteArriboSalida') as FormGroup;
  }

  /**
   * Obtiene el array del formulario 'itemsVehiculo' del grupo de formulario 'vehiculo'.
   *
   * @returns {FormArray} El array de formulario 'itemsVehiculo'.
   */
  get itemsVehiculo(): FormArray {
    return this.vehiculo.get('vehiculoDatos') as FormArray;
  }

  /**
   * Obtiene el array del formulario 'fechasSeleccionadas' del grupo de formulario  'datosServicio'.
   *
   * @returns {FormArray} El array de formulario 'fechasSeleccionadas'.
   */
  get fechasSeleccionadas(): FormArray {
    return this.datosServicio.get('fechasSeleccionadas') as FormArray;
  }

  /**
   * Valida que el FormArray tenga al menos un elemento.
   * @param min {number} - El número mínimo de elementos que debe tener el FormArray.
   * @returns {ValidatorFn} - Una función de validador que verifica la longitud del FormArray.
   */
  static minLengthArray(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray && control.length < min) {
        return {
          minLengthArray: { requiredLength: min, actualLength: control.length },
        };
      }
      return null;
    };
  }

  /**
   * Verifica si la solicitud seleccionada es de tipo individual.
   *
   * @returns {boolean} - Retorna `true` si la solicitud seleccionada es de tipo individual, de lo contrario retorna `false`.
   */
  individual(): boolean {
    return this.tipoSolicitudSeleccionada &&
      this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL
      ? true
      : false;
  }

  /**
   * Verifica si un campo específico en un formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo a validar.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} - Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  // eslint-disable-next-line class-methods-use-this
  isValid(form: FormGroup, field: string): boolean | null {
    if (!form) {
      return false;
    }
    const CONTROL = form.get(field) as FormControl;
    if (CONTROL) {
      const ERRORS = CONTROL.errors;
      return ERRORS && CONTROL.touched;
    }
    return false;
  }

  /**
   * Error pattern
   * @returns {boolean} - Retorna `true` si el campo tiene un error de patrón, de lo contrario `false`.
   */
  // eslint-disable-next-line class-methods-use-this
  isErrorPattern(form: FormGroup, field: string): boolean {
    const CONTROL = form.get(field) as FormControl;

    if (CONTROL) {
      const ERROR_PATTERN = CONTROL.hasError('pattern');
      return ERROR_PATTERN;
    }

    return false;
  }

  /**
   * Error noMenosUno
   * @returns {boolean} - Retorna `true` si el campo tiene un error de noMenosUno, de lo contrario `false`.
   */
  // eslint-disable-next-line class-methods-use-this
  isErrorNoMenosUno(form: FormGroup, field: string): boolean {
    const CONTROL = form.get(field) as FormControl;

    if (CONTROL) {
      const ERROR_NO_MENOS_UNO = CONTROL.hasError('noMenosUno');
      return ERROR_NO_MENOS_UNO && CONTROL.touched;
    }

    return false;
  }

  /**
   * Error whitespace
   * @returns {boolean} - Retorna `true` si el campo tiene un error de whitespace, de lo contrario `false`.
   */
  // eslint-disable-next-line class-methods-use-this
  isErrorWhitespace(form: FormGroup, field: string): boolean {
    const CONTROL = form.get(field) as FormControl;

    if (CONTROL) {
      const ERROR_WHITESPACE = CONTROL.hasError('whitespace');
      return ERROR_WHITESPACE && CONTROL.touched;
    }

    return false;
  }

  /**
   * Verifica si el control 'idSocioComercial' tiene el validador 'Validators.required'.
   *
   * @returns {boolean} `true` si el control es obligatorio, de lo contrario `false`.
   */
  // eslint-disable-next-line class-methods-use-this
  isRequired(form: FormGroup, field: string): boolean | null {
    const CONTROL = form.get(field) as FormControl;

    if (CONTROL) {
      const ERROR_PATTERN = CONTROL.hasError('required');
      return ERROR_PATTERN && CONTROL.touched;
    }

    return false;
  }

  /**
   * Verifica si hay un error de intervalo de fecha en los datos del servicio.
   * @returns {boolean} - `true` si hay un error de intervalo de fecha y el campo ha sido tocado, de lo contrario `false`.
   */
  intervaloFechaError(): boolean {
    return (
      this.datosServicio.hasError('invalidIntervalo') &&
      this.datosServicio.touched
    );
  }

  /**
   * Verifica si hay un error de intervalo de fecha en los datos del servicio.
   * @returns {boolean} - `true` si hay un error de intervalo de fecha y el campo ha sido tocado, de lo contrario `false`.
   */
  fechaInicioPasadaFechaFinalError(): boolean {
    return (
      this.datosServicio.hasError('endDateBeforeStartDate') &&
      this.datosServicio.touched
    );
  }

  /**
   * Obtiene los tipos de solicitud desde el catálogo y los asigna a `datosTiposSolicitud`.
   *
   * Este método realiza una solicitud al servicio `catalogosServices` para obtener el catálogo de tipos de solicitud identificado por `CATALOGOS_ID.CAT_TIPO_SOL`. Una vez que recibe la  respuesta, verifica si la respuesta contiene elementos. Si es así, asigna los datos recibidos a la propiedad `datosTiposSolicitud` con la estructura adecuada.
   */
  private inicializaCatalogos(): void {
    const CAT_TIPO_SOLICITUD$ = this.tipoSolicitudService
      .getListaTipoSolicitud()
      .pipe(
        map((datos: CatalogoLista) => {
          this.tiposSolicitud = datos.datos;
        }),
        takeUntil(this.destroyNotifier$)
      );

    const CATALOGO_PAISES$ = this.paisesService.getListaPaises().pipe(
      map((resp) => {
        this.paisesOrigen = resp.datos.sort((a, b) =>
          a.descripcion.localeCompare(b.descripcion, 'es', {
            sensitivity: 'base',
          })
        );
        this.paisesProcedencia = resp.datos.sort((a, b) =>
          a.descripcion.localeCompare(b.descripcion, 'es', {
            sensitivity: 'base',
          })
        );
      })
    );
    
    const CATALOGO_ADUANAS$ = this.aduanaService.getListaAduanasByRfc(this.rfcValor).pipe(
      map((resp) => {
        resp.datos.map((aduana: Catalogos) => {
          aduana.title = aduana.descripcion;
          aduana.descripcion =
            aduana.descripcion.length > 28
              ? `${aduana.descripcion.substring(0, 28)}...`
              : aduana.descripcion;
          aduana.descripcion = `${aduana.clave} - ${aduana.descripcion}`;
          return aduana;
        });

        this.aduanas = resp.datos;
      })
    );

    const TIPO_OPERACION$ = this.tipoOperacionService
      .getListaTipoOperacion()
      .pipe(
        map((resp) => {
          this.tipoOperacion = resp.datos;
        })
      );

    const TIPO_TRANSPORTE$ = this.tipoTransporteService
      .getListaTipoTransporte()
      .pipe(
        map((resp) => {
          const CATALOGO_TRANSPORTE = resp.datos;

          const TIPO_VEHICULO = VEHICULO;
          this.tipoVehiculo = CATALOGO_TRANSPORTE.filter((elemento: Catalogo) =>
            TIPO_VEHICULO.includes(elemento.descripcion)
          );

          const TIPO_TRANSPORTE = TRANSPORTE;
          this.tipoTransporte = CATALOGO_TRANSPORTE.filter(
            (elemento: Catalogo) =>
              TIPO_TRANSPORTE.includes(elemento.descripcion)
          );
        })
      );

    const CAT_DESPACHO_LDA$ = this.tipoDespachoService
      .getListaTipoDespacho()
      .pipe(
        map((resp) => {
          this.despachoLdaCatalogo = resp.datos;
        })
      );

    const CAT_DESPACHO_DD$ = this.tipoDespachoService
      .getListaTipoDespacho()
      .pipe(
        map((resp) => {
          this.despachoDDCatalogo = resp.datos;
        })
      );

    // Inicializar catálogos dependientes vacíos
    this.seccionAduanera = [];
    this.recintoCatalogo = [];

    merge(
      CAT_TIPO_SOLICITUD$,
      CATALOGO_PAISES$,
      CATALOGO_ADUANAS$,
      TIPO_OPERACION$,
      TIPO_TRANSPORTE$,
      CAT_DESPACHO_LDA$,
      CAT_DESPACHO_DD$
    )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe();
  }

  /**
   * Este método realiza una búsqueda de la patente en algún endpoint y luego
   * agrega el valor de la patente al formulario utilizando el servicio de formularios.
   * @return {void} No retorna ningún valor.
   * @private
   */
  private obtenerPatente(): void {
    let patente: Patente;
    this.patenteService
      .getListaPatente('SAAE5901017V9')
      .pipe(
        switchMap((pantenteResponse) => {
          if (pantenteResponse) {
            patente = pantenteResponse.datos;
            const DATOS_PATENTE: DatosAgregarFormulario = {
              form: this.despacho,
              field: 'patente',
              valor: patente?.patente,
            };
            FormulariosService.agregarValorCamposDesactivados(DATOS_PATENTE);
            this.tramite5701Store.setPatente(patente);
            return EMPTY;
          }
          return this.patenteApoderadoService.getListaPatentesApoderado(
            'SAAA980822LP1'
          );
        }),
        switchMap((patenteApoderadoResponse) => {
          if (patenteApoderadoResponse) {
            this.tramite5701Store.setPatenteApoderado(
              patenteApoderadoResponse.datos
            );
            this.isApoderado = true;
            if (patenteApoderadoResponse.datos?.length > 1) {
              this.masDeUnaPatente = true;
              return EMPTY;
            }
            this.tramite5701Store.setPatente(patenteApoderadoResponse.datos[0]);
            return this.patenteEmpresasService.getListaEmpresas(patente);
          }
          return EMPTY;
        }),
        tap((empresaResponse) => {
          if (empresaResponse) {
            if (empresaResponse.datos.length > 1) {
              this.masDeUnaEmpresa = true;
            } else {
              this.datosImportadorExportador
                .get('RFCImpExp')
                ?.setValue(empresaResponse.datos[0]);
              this.tramite5701Store.setRFCImportadorExportador(
                empresaResponse.datos[0]
              );
            }
          }
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Crea el formulario de solicitud.
   * @return {void} No retorna ningún valor.
   */
  crearFormSolicitud(): void {
    // Asegurar que solicitudState esté inicializado
    const state = this.solicitudState || {};
    
    this.FormSolicitud = this.fb.group({
      folioSolicitud: [],
      tipoSolicitud: [
        state.tipoSolicitud || -1,
        [Validators.required],
      ],
      descripcionTipoSolicitud: [state.descripcionTipoSolicitud || '', [Validators.required]],
      datosImportadorExportador: this.fb.group({
        apoderadoPatente: [],
        empresaApoderado: [],
        empresasApoderado: [],

        RFCImpExp: [
          state.RFCImportadorExportador || '',
          [Validators.required, Validators.pattern(REGEX_RFC)],
        ],
        nombre: [{ value: state.nombre || '', disabled: true }],
        desNumeroRegistro: [
          state.descripcionNumeroRegistro || '',
          [Validators.maxLength(30)],
        ],

        programa: [state.programa || false],
        desProgramaFomento: [
          {
            value: state.descripcionProgramaFomento || '',
            disabled: true,
          },
          [Validators.maxLength(300)],
        ],

        checkIMMEX: [state.checkIMMEX || false],
        desImmex: [state.descripcionImmex || ''],

        industriaAutomotriz: [state.industriaAutomotriz || false],
        desIndustrialAutomotriz: [
          {
            value: state.descripcionIndustrialAutomotriz || '',
            disabled: true,
          },
          [Validators.maxLength(25)],
        ],

        tipoEmpresaCertificadaA: [state.tipoEmpresaCertificada === 'a'],
        tipoEmpresaCertificadaAA: [state.tipoEmpresaCertificada === 'aa'],
        tipoEmpresaCertificadaAAA: [state.tipoEmpresaCertificada === 'aaa'],
        socioComercial: [state.socioComercial || false],
        certificacionOEA: [state.certificacionOEA || false],
        revision: [state.revision || false],
        idSocioComercial: [
          { value: state.idSocioComercial || '', disabled: true },
        ],
      }),

      datosServicio: this.fb.group({
        fechaInicio: [state.fechaInicio || '', [Validators.required]],
        fechaFinal: [state.fechaFinal || '', [Validators.required]],
        horaInicio: [state.horaInicio || '', Validators.required],
        horaFinal: [state.horaFinal || '', Validators.required],
        fechasSeleccionadas: this.fb.array([state.fechasSeleccionadas || []], Validators.required),
      }),

      despacho: this.fb.group({
        lda: [{ value: state.lda || false, disabled: false }],
        rfcDespachoLDA: [state.autorizacionLDA || ''],
        dd: [{ value: state.dd || false, disabled: false }],
        folioDDEX: [state.autorizacionDDEX || ''],
        idAduanaDespacho: [
          state.idAduanaDespacho || '-1',
          [Validators.required, ValidacionesFormularioService.noMenosUnoValor],
        ],
        aduanaDespacho: [state.aduanaDespacho || ''],
        idSeccionDespacho: [
          state.idSeccionDespacho || '-1',
          [ValidacionesFormularioService.noMenosUnoValor],
        ],
        seccionAduanera: [state.seccionAduanera || ''],
        idRecinto: [],
        nombreRecinto: [state.nombreRecinto || '-1'],
        tipoDespacho: [
          state.tipoDespacho || -1,
          state.lda ? [Validators.required] : []
        ],
        descripcionTipoDespacho: [state.descripcionTipoDespacho || ''],
        tipoOperacion: [
          state.tipoOperacion || '-1',
          [ValidacionesFormularioService.noMenosUnoValor],
        ],
        patente: [{ value: state.patente?.patente || '', disabled: true }],
        relacionSociedad: [
          { value: state.relacionSociedad || false, disabled: true },
        ],
        encargoConferido: [
          { value: state.encargoConferido || false, disabled: true },
        ],
        domicilioDespacho: [state.domicilioDespacho || ''],
        especifique: [state.especifique || ''],
      }),

      mercancia: this.fb.group({
        paisOrigen: [state.paisOrigen !== undefined && state.paisOrigen !== null && state.paisOrigen !== '' ? state.paisOrigen : '', 
          [Validators.required, ValidacionesFormularioService.noMenosUnoValor]
        ],
        paisProcedencia: [
          state.paisProcedencia !== undefined && state.paisProcedencia !== null && state.paisProcedencia !== '' ? state.paisProcedencia : '',
          [Validators.required, ValidacionesFormularioService.noMenosUnoValor],
        ],
        descripcionGenerica: [
          state.descripcionGenerica || '',
          [Validators.required, Validators.maxLength(500), ValidacionesFormularioService.noWhitespaceValidator],
        ],
        justificacion: [
          state.justificacion || '',
          [Validators.required, Validators.maxLength(1000), ValidacionesFormularioService.noWhitespaceValidator],
        ],
      }),

      pedimento: this.fb.array([]),

      personasResponsablesDespacho: this.fb.array([state.personasResponsablesDespacho || []], [SolicitudComponent.minLengthArray(1)]),

      vehiculo: this.fb.group({
        tipoTransporte: [state.tipoTransporte || ''],
        vehiculoDatos: this.fb.array([]),
      }),

      transporteArriboSalida: this.fb.group({
        tipoTransporte: [state.tipoTransporteArriboSalida || ''],
        transporteArriboDatos: this.fb.array([]),
      }),

      pagoCaptura: this.fb.group({
        montoAPagar: [
          { value: state.montoPagar || 0, disabled: true },
        ],
        lineaCaptura: [state.lineaCaptura || ''],
        monto: [state.monto || 0],
        lineasCaptura: this.fb.array([], Validators.required),
      }),
    });
    this.despacho.get('idSeccionDespacho')?.disable();
    this.despacho.get('nombreRecinto')?.disable();
    if( !this.editable ) {
      this.FormSolicitud.disable({ emitEvent: false });
    }
    
    // Cargar catálogos dependientes si hay aduana en el store
    if (state.idAduanaDespacho && state.idAduanaDespacho !== '-1') {
      this.cargarCatalogosDependientes(state.idAduanaDespacho);
    }
  }

  /**
   * Este validador verifica que el intervalo entre las fechas y horas de inicio y finalización
   * cumpla con las restricciones específicas según el tipo de solicitud seleccionada.
   * @returns {Function} Una función que toma un `FormGroup` y devuelve un objeto con una clave booleana indicando si el intervalo es inválido, o `null` si el intervalo es válido.
   */
  fechaIntervaloValidator(): void {
    const FECHA_INICIO_STR = this.datosServicio.get('fechaInicio')?.value;
    const FECHA_FINAL_STR = this.datosServicio.get('fechaFinal')?.value;

    const FECHA_INICIO = new Date(`${FECHA_INICIO_STR}T00:00:00`);
    const FECHA_FINAL = new Date(`${FECHA_FINAL_STR}T00:00:00`);
    const HORA_INICIO = this.datosServicio.get('horaInicio')?.value;
    const HORA_FINAL = this.datosServicio.get('horaFinal')?.value;
    const INTERVALO_DIAS = SolicitudComponent.getIntervaloDias(
      this.tipoSolicitudSeleccionada
    );

    const PRIMER_DIA_MES = FECHA_INICIO.getDate() === 1 ? true : false;

    const CAMPOS_NO_NULOS =
      [FECHA_INICIO, FECHA_FINAL, HORA_INICIO, HORA_FINAL].every(Boolean) &&
      INTERVALO_DIAS !== null;

    if (CAMPOS_NO_NULOS) {
      const FECHA_INICIO_HORA = new Date(FECHA_INICIO);
      const FECHA_FINAL_HORA = new Date(FECHA_FINAL);

      FECHA_INICIO_HORA.setHours(
        parseInt(HORA_INICIO.split(':')[0], 10),
        parseInt(HORA_INICIO.split(':')[1], 10)
      );
      FECHA_FINAL_HORA.setHours(
        parseInt(HORA_FINAL.split(':')[0], 10),
        parseInt(HORA_FINAL.split(':')[1], 10)
      );

      const DIFERENCIA_EN_TIEMPO =
        FECHA_FINAL.getTime() - FECHA_INICIO.getTime();

      const DIFERENCIA_EN_HORAS =
        (FECHA_FINAL_HORA.getTime() - FECHA_INICIO_HORA.getTime()) /
        (1000 * 3600);

      if (DIFERENCIA_EN_HORAS <= 0) {
        this.datosServicio.setErrors({ endDateBeforeStartDate: true });
        return;
      }

      if (PRIMER_DIA_MES) {
        const VALIDACION_MES =
          FECHA_INICIO.getMonth() === FECHA_FINAL.getMonth() &&
          FECHA_INICIO.getFullYear() === FECHA_FINAL.getFullYear();
        if (!VALIDACION_MES) {
          this.datosServicio.setErrors({ invalidIntervalo: true });
          return;
        }
      }

      if (
        this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL &&
        DIFERENCIA_EN_HORAS > 24
      ) {
        this.datosServicio.setErrors({ invalidIntervalo: true });
        return;
      }

      const DIFERENCIA_EN_DIAS = DIFERENCIA_EN_TIEMPO / (1000 * 3600 * 24) + 1;

      if (
        (this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.SEMANAL &&
          DIFERENCIA_EN_DIAS > 7) ||
        (this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.MENSUAL &&
          DIFERENCIA_EN_DIAS > 31)
      ) {
        this.datosServicio.setErrors({ invalidIntervalo: true });
        return;
      }

      this.tramite5701Store.update({
        fechaInicio: FECHA_INICIO_STR,
        fechaFinal: FECHA_FINAL_STR,
        horaInicio: HORA_INICIO,
        horaFinal: HORA_FINAL,
      });
      this.calcularRangoFechas();
    }
  }

  /**
   * Devuelve el número de días correspondiente a un intervalo específico.
   *
   * @param {number} intervalo - El tipo de intervalo, que puede ser uno de los valores definidos en TIPO_SOLICITUD.
   * @returns {number | null} El número de días correspondiente al intervalo proporcionado, o null si el intervalo no es válido.
   */
  static getIntervaloDias(intervalo: number): number | null {
    switch (intervalo) {
      case TIPO_SOLICITUD.INDIVIDUAL:
        return 1;
      case TIPO_SOLICITUD.SEMANAL:
        return 7;
      case TIPO_SOLICITUD.MENSUAL:
        return 30;
      default:
        return null;
    }
  }

  /**
   * Realiza la validación del RFC del importador/exportador y actualiza los campos relacionados.
   *
   * @returns {void} No retorna ningún valor.
   */
  validaRfc(): void {
    const RFC_IMP_EXP = this.datosImportadorExportador.get('RFCImpExp')?.value;
    


    if (
      RFC_IMP_EXP &&
      !this.datosImportadorExportador.get('RFCImpExp')?.valid
    ) {

      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: ERR_RFC_NO_VALIDO,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.datosImportadorExportador.get('RFCImpExp')?.setValue('');
      this.datosImportadorExportador.reset();
      this.desactivaCamposCertificaciones();
      return;
    }

    if (
      RFC_IMP_EXP === '' &&
      this.datosImportadorExportador.get('nombre')?.value
    ) {

      this.desactivaCamposCertificaciones();
      return;
    }

    if (RFC_IMP_EXP && this.datosImportadorExportador.get('RFCImpExp')?.valid) {

      // Clear previous RFC data before loading new data
      this.limpiarDatosPreviosRFC();
      
      this.validaRfcService
        .getValidacionRfc(RFC_IMP_EXP)
        .pipe(
          takeUntil(this.destroyNotifier$),
          switchMap((validacionResponse) => {

            if (validacionResponse) {
              this.muestraCertificaciones = !validacionResponse.datos;
              this.tramite5701Store.setRfcGenerico(validacionResponse.datos);

              if (validacionResponse.datos) {

                // Aqui se hará la busqueda del rfc, para obtener el nombre
                SolicitudComponent.llenarCamposDesactivados(
                  this.datosImportadorExportador,
                  'nombre',
                  RFC_GENERICO
                );
                this.tramite5701Store.setNombre(RFC_GENERICO);
                return EMPTY;
              }
              return this.idcService
                .getInformacionContribuyente(RFC_IMP_EXP)
                .pipe(tap());
            }
            return EMPTY;
          }),
          tap((idcResponse) => {
            const NOMBRE = idcResponse.datos?.nombre
              ? idcResponse.datos?.nombre
              : idcResponse.datos?.razon_social;
            if (NOMBRE) {

              this.datosImportadorExportador.get('nombre')?.setValue(NOMBRE);
              this.tramite5701Store.setNombre(NOMBRE);
              this.getCertificaciones(RFC_IMP_EXP);
            } else {

              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: TITULO_MODAL_AVISO,
                mensaje: MSG_ERROR_RFC_NO_ENCONTRADO,
                cerrar: false,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              };
            }
          })
        )
        .subscribe();
      this.tramite5701Store.setRFCImportadorExportador(RFC_IMP_EXP);
    }
    this.cdRef.detectChanges();
  }

  /**
   * Habilita temporalmente un campo de un formulario, asigna un valor predeterminado
   * y luego lo desactiva nuevamente.
   *
   * @param form - El grupo de formulario (`FormGroup`) que contiene el campo a modificar.
   * @param field - El nombre del campo dentro del formulario que será modificado.
   */
  static llenarCamposDesactivados(
    form: FormGroup,
    field: string,
    value: string
  ): void {
    form.get(field)?.enable();
    form.get(field)?.setValue(value);
    form.get(field)?.disable();
  }

  /**
   * Ejecuta la lógica específica para cargar campos según el tipo de solicitud
   * @param tipoSolicitud - El tipo de solicitud seleccionado
   */
  private ejecutarLogicaTipoSolicitud(tipoSolicitud: number): void {
    // Actualizar descripción del tipo de solicitud
    const SOLICITUD_DESCRIPCION = this.tiposSolicitud?.find(
      (tipo) => tipo.id === tipoSolicitud
    )?.descripcion;
    if (SOLICITUD_DESCRIPCION) {
      this.FormSolicitud.get('descripcionTipoSolicitud')?.setValue(SOLICITUD_DESCRIPCION, { emitEvent: false });
    }
    
    if (tipoSolicitud === TIPO_SOLICITUD.INDIVIDUAL) {
      // Para individual: configurar validadores de pedimento y ocultar crosslist
      this.pedimento.setValidators([Validators.required, SolicitudComponent.minLengthArray(1)]);
      this.pedimento.updateValueAndValidity();
      
      // Solo ocultar crosslist si no hay fechas seleccionadas previamente
      // Esto evita que se oculte cuando se recarga desde el store
      if (!this.solicitudState?.fechasSeleccionadas || this.solicitudState.fechasSeleccionadas.length === 0) {
        this.mostrarRangoFechas = false;
        this.colapsable = false;
      }
    } else {
      // Para semanal/mensual: limpiar validadores de pedimento y mostrar crosslist si hay fechas
      this.pedimento.clearValidators();
      this.pedimento.updateValueAndValidity();
      
      // Solo mostrar crosslist si hay fechas seleccionadas
      if (this.solicitudState?.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
        this.mostrarRangoFechas = true;
        this.colapsable = true;
      }
    }
    
    // Forzar detección de cambios
    this.cdRef.detectChanges();
  }

  /**
   * Selecciona el tipo de solicitud y actualiza el estado correspondiente.
   *
   * @returns {void} Esta función no retorna ningún valor.
   */
  tipoSolicitudSeleccion(): void {
    // Se obtiene el valor del tipo de solicitud seleccionado y se agrega la descripción correspondiente al formulario.
    const TIPO_SOLICITUD_VALUE = parseInt(
      this.FormSolicitud.get('tipoSolicitud')?.value,
      10
    );



    const SOLICITUD_DESRIPCION = this.tiposSolicitud.find(
      (tipo) => tipo.id === TIPO_SOLICITUD_VALUE
    )?.descripcion;
    this.FormSolicitud.get('descripcionTipoSolicitud')?.setValue(
      SOLICITUD_DESRIPCION
    );

    // Guardar el tipo anterior para comparar
    const TIPO_ANTERIOR = this.tipoSolicitudSeleccionada;
    this.tipoSolicitudSeleccionada = TIPO_SOLICITUD_VALUE;



    // Limpiar selects de transporte cuando se cambia el tipo de solicitud
    if (TIPO_ANTERIOR !== undefined && TIPO_ANTERIOR !== TIPO_SOLICITUD_VALUE) {

      this.vehiculo.get('tipoTransporte')?.setValue('');
      this.transporteArriboSalida.get('tipoTransporte')?.setValue('');
      this.tramite5701Store.setTipoTransporte('');
      this.tramite5701Store.setTipoTransporteArriboSalida('');
    }

    // Si cambió de semanal/mensual a individual, regresar fechas seleccionadas a fechas disponibles
    if ((TIPO_ANTERIOR === TIPO_SOLICITUD.SEMANAL || TIPO_ANTERIOR === TIPO_SOLICITUD.MENSUAL) && 
        TIPO_SOLICITUD_VALUE === TIPO_SOLICITUD.INDIVIDUAL) {

      this.regresarFechasSeleccionadasADisponibles();
    }

    // Ejecutar lógica específica del tipo de solicitud
    this.ejecutarLogicaTipoSolicitud(TIPO_SOLICITUD_VALUE);

    this.setValoresStore(
      this.FormSolicitud,
      'tipoSolicitud',
      'setTipoSolicitud'
    );
    this.setValoresStore(
      this.FormSolicitud,
      'descripcionTipoSolicitud',
      'setDescripcionTipoSolicitud'
    );

    const FORMA_MODIFICADA = Object.keys(this.FormSolicitud.controls).some(
      (key) => {
        if (key !== 'tipoSolicitud' && key !== 'descripcionTipoSolicitud') {
          return (
            this.FormSolicitud.controls[key].dirty ||
            this.FormSolicitud.controls[key].touched
          );
        }
        return false;
      }
    );

    if (FORMA_MODIFICADA) {

      this.fechasSeleccionadas.clear();
      this.pedimento.clear();

      this.tramite5701Store.setTransporte([]);
      this.tramite5701Store.setTransporteArriboDatos([]);

      this.fechaIntervaloValidator();
      if (this.datosServicio.hasError('endDateBeforeStartDate')) {
        this.limpiarFechasHoras();
        return;
      }

      const MSJ_ERROR_FECHA =
        this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL
          ? MSJ_ERROR_FECHA_DIA
          : this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.SEMANAL
          ? MSJ_ERROR_FECHA_SEMANA
          : MSJ_ERROR_FECHA_MES;

      if (this.datosServicio.hasError('invalidIntervalo')) {
        this.limpiarFechasHoras();
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: TITULO_MODAL_AVISO,
          mensaje: MSJ_ERROR_FECHA,
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarRangoFechas = false;
        this.colapsable = false;
      }
    }
  }

  /**
   * Regresa las fechas seleccionadas al rango de fechas disponibles
   * cuando se cambia de semanal/mensual a individual
   */
  private regresarFechasSeleccionadasADisponibles(): void {
    // Obtener las fechas actualmente seleccionadas
    const fechasSeleccionadas = this.solicitudState?.fechasSeleccionadas || [];
    
    if (fechasSeleccionadas.length > 0) {
      // Convertir fechas seleccionadas al formato del crosslist
      const fechasParaCrosslist = fechasSeleccionadas.map(fecha => {
        // Si la fecha está en formato YYYY-MM-DD, convertir a DD/MM/YYYY
        let fechaFormateada = fecha;
        if (fecha.includes('-') && fecha.length === 10) {
          const [year, month, day] = fecha.split('-');
          fechaFormateada = `${day}/${month}/${year}`;
        }
        
        // Generar el formato completo del crosslist (día, fecha)
        const fechaObj = new Date(fecha.includes('-') ? fecha : fecha.split('/').reverse().join('-'));
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const diaSemana = diasSemana[fechaObj.getDay()];
        
        return `${diaSemana}, ${fechaFormateada}`;
      });
      
      // Agregar las fechas de vuelta al rango disponible
      this.selectRangoDias = [...this.selectRangoDias, ...fechasParaCrosslist];
      
      // Limpiar las fechas seleccionadas del store y del formulario
      this.tramite5701Store.setFechasSeleccionadas([]);
      this.fechasSeleccionadas.clear();
      
      // Ocultar el componente crosslist
      this.mostrarRangoFechas = false;
      this.colapsable = false;
      
      // Forzar detección de cambios
      this.cdRef.detectChanges();
    }
  }

  /**
   * Alterna el estado de visibilidad del componente colapsable.
   *
   * @returns {void} No retorna ningún valor.
   */
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Valida el campo de la aduana en el formulario.
   *
   * @returns {void} No retorna ningún valor.
   */
  validaCampoPedimento(): void {
    const ADUANA_VALIDACION = parseInt(
      this.solicitudState?.idAduanaDespacho,
      10
    );

    if (ADUANA_VALIDACION < 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_ADUANA_PEDIMENTO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.validacionPedimento = true;
  }

  /**
   * Establece el valor de un campo en un formulario.
   *
   * @param {FormGroup} form - El formulario en el que se va a establecer el valor del campo.
   * @param {string} field - El nombre del campo en el formulario cuyo valor se va a establecer.
   * @param {string | number} valor - El valor que se va a establecer en el campo.
   * @returns {void} No retorna ningún valor.
   */
  static darValorCampoFormulario(
    form: FormGroup,
    field: string,
    valor: string | number
  ): void {
    form.get(field)?.setValue(valor);
  }

  /**
   * Activa el input de idSocioComercial si se selecciona un socio comercial.
   *
   * @returns {void} No retorna ningún valor.
   */
  checkIdSocioComercial(): void {
    const SOCIO_COMERCIAL =
      this.datosImportadorExportador.get('socioComercial')?.value;

    if (SOCIO_COMERCIAL) {
      this.datosImportadorExportador.get('idSocioComercial')?.enable();
      this.datosImportadorExportador
        .get('idSocioComercial')
        ?.setValidators([
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(ALFANUMERICO_ESPACIO),
        ]);
      this.datosImportadorExportador
        .get('idSocioComercial')
        ?.updateValueAndValidity();
    } else {
      this.datosImportadorExportador.get('idSocioComercial')?.clearValidators();
      this.datosImportadorExportador
        .get('idSocioComercial')
        ?.updateValueAndValidity();
      this.datosImportadorExportador.get('idSocioComercial')?.reset();
      this.datosImportadorExportador.get('idSocioComercial')?.disable();
      this.setValoresStore(
        this.datosImportadorExportador,
        'idSocioComercial',
        'setIdSocioComercial'
      );
    }

    this.setValoresStore(
      this.datosImportadorExportador,
      'socioComercial',
      'setSocioComercial'
    );
  }

  /**
   * Maneja el cambio de selección en los checkboxes de tipo de empresa certificada.
   * Implementa la lógica de mutua exclusión: solo un checkbox puede estar seleccionado a la vez.
   * @param value - El valor de la opción seleccionada ('a', 'aa', 'aaa')
   * @param controlName - El nombre del control del formulario que cambió
   */
  onTipoEmpresaChange(value: string, controlName: string): void {
    const IS_CHECKED = this.datosImportadorExportador.get(controlName)?.value;
    
    if (IS_CHECKED) {
      // Si se selecciona uno, deseleccionar los otros y deshabilitarlos
      const CONTROLS = ['tipoEmpresaCertificadaA', 'tipoEmpresaCertificadaAA', 'tipoEmpresaCertificadaAAA'];
      CONTROLS.forEach(ctrl => {
        if (ctrl !== controlName) {
          this.datosImportadorExportador.get(ctrl)?.setValue(false);
        }
      });
      
      // Actualizar estados disabled
      this.tipoEmpresaCertificadaADisabled = controlName !== 'tipoEmpresaCertificadaA';
      this.tipoEmpresaCertificadaAADisabled = controlName !== 'tipoEmpresaCertificadaAA';
      this.tipoEmpresaCertificadaAAADisabled = controlName !== 'tipoEmpresaCertificadaAAA';
      
      // Guardar el valor en el store
      this.tramite5701Store.setTipoEmpresaCertificada(value);
    } else {
      // Si se deselecciona, habilitar todos los checkboxes
      this.tipoEmpresaCertificadaADisabled = false;
      this.tipoEmpresaCertificadaAADisabled = false;
      this.tipoEmpresaCertificadaAAADisabled = false;
      
      // Limpiar el valor en el store
      this.tramite5701Store.setTipoEmpresaCertificada('');
    }
  }

  /**
   * Inicializa los estados de deshabilitado para los checkboxes de tipo de empresa certificada
   * basándose en el valor actual del store.
   */
  initializeTipoEmpresaCertificadaStates(): void {
    const CURRENT_VALUE = this.solicitudState?.tipoEmpresaCertificada;
    
    if (CURRENT_VALUE) {
      // Si hay un valor seleccionado, deshabilitar los otros
      this.tipoEmpresaCertificadaADisabled = CURRENT_VALUE !== 'a';
      this.tipoEmpresaCertificadaAADisabled = CURRENT_VALUE !== 'aa';
      this.tipoEmpresaCertificadaAAADisabled = CURRENT_VALUE !== 'aaa';
    } else {
      // Si no hay valor seleccionado, habilitar todos
      this.tipoEmpresaCertificadaADisabled = false;
      this.tipoEmpresaCertificadaAADisabled = false;
      this.tipoEmpresaCertificadaAAADisabled = false;
    }
  }

  /**
   * Maneja el cambio en el campo país de origen
   */
  onPaisOrigenChange(event: any): void {
    this.setValoresStore(this.mercancia, 'paisOrigen', 'setPaisOrigen');
  }

  /**
   * Maneja el cambio en el campo país de procedencia
   */
  onPaisProcedenciaChange(event: any): void {
    this.setValoresStore(this.mercancia, 'paisProcedencia', 'setPaisProcedencia');
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite5701Store
  ): void {
    const VALOR = form.get(campo)?.value;
    
    // Debug: Log para campos de país
    if (campo === 'paisOrigen' || campo === 'paisProcedencia') {
      // Los países usan códigos string, no números
      (this.tramite5701Store[metodoNombre] as (value: string) => void)(VALOR);
    } else {
      (this.tramite5701Store[metodoNombre] as (value: string) => void)(VALOR);
    }
  }

  /**
   * Cambia la hora de inicio del servicio.
   * Esta función actualiza la validez de los datos del servicio y establece
   */
  changeHoraInicio(): void {
    this.fechaIntervaloValidator();
    this.validaHorarioFechaInicio();
    this.setValoresStore(this.datosServicio, 'horaInicio', 'setHoraInicio');
    
    // Forzar actualización de fechas disponibles y limpiar selecciones previas
    this.calcularRangoFechas();
    
    // Forzar detección de cambios para actualizar la vista
    this.cdRef.detectChanges();
  }

  /**
   * Cambia la fecha de inicio del servicio.
   *
   */
  changeFechaInicio(): void {

    this.fechaIntervaloValidator();
    this.validaHorarioFechaInicio();

    const FECHA_INICIO = this.datosServicio.get('fechaInicio');

    if (!FECHA_INICIO?.dirty || !FECHA_INICIO?.touched) {

      this.setValoresStore(this.datosServicio, 'fechaInicio', 'setFechaInicio');
      return;
    }

    if (this.datosServicio.hasError('endDateBeforeStartDate')) {

      this.limpiarFechasHoras();
      return;
    }

    const MSJ_ERROR_FECHA =
      this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL
        ? MSJ_ERROR_FECHA_DIA
        : this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.SEMANAL
        ? MSJ_ERROR_FECHA_SEMANA
        : MSJ_ERROR_FECHA_MES;

    if (this.datosServicio.hasError('invalidIntervalo')) {

      this.limpiarFechasHoras();

      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSJ_ERROR_FECHA,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.resetearFechaInicioTouch = true;
      return;
    }

    this.setValoresStore(this.datosServicio, 'fechaInicio', 'setFechaInicio');
    
    // Forzar actualización de fechas disponibles y limpiar selecciones previas
    this.calcularRangoFechas();
    
    // Forzar detección de cambios para actualizar la vista
    this.cdRef.detectChanges();
  }

  /**
   * Cambia la fecha final del servicio.
   * Esta función actualiza la validez de los datos del servicio y establece
   * los valores correspondientes en el store.
   * @returns {void} No retorna ningún valor.
   */
  changeFechaFinal(): void {
    this.fechaIntervaloValidator();

    const FECHA_FINAL = this.datosServicio.get('fechaFinal');

    if (!FECHA_FINAL?.dirty || !FECHA_FINAL?.touched) {
      this.setValoresStore(this.datosServicio, 'fechaFinal', 'setFechaFinal');
      return;
    }

    if (this.datosServicio.hasError('endDateBeforeStartDate')) {
      this.limpiarFechasHoras();
      return;
    }

    const MSJ_ERROR_FECHA =
      this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL
        ? MSJ_ERROR_FECHA_DIA
        : this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.SEMANAL
        ? MSJ_ERROR_FECHA_SEMANA
        : MSJ_ERROR_FECHA_MES;

    if (this.datosServicio.hasError('invalidIntervalo')) {
      this.limpiarFechasHoras();
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSJ_ERROR_FECHA,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    this.setValoresStore(this.datosServicio, 'fechaFinal', 'setFechaFinal');
    
    // Forzar actualización de fechas disponibles y limpiar selecciones previas
    this.calcularRangoFechas();
    
    // Forzar detección de cambios para actualizar la vista
    this.cdRef.detectChanges();
  }

  /**
   * Cambia la hora de inicio del servicio.
   * Esta función actualiza la validez de los datos del servicio y establece
   * los valores correspondientes en el store. Valida el intervalo de las fechas.
   * @returns {void} No retorna ningún valor.
   */
  changeHoraFinal(): void {
    this.datosServicio.updateValueAndValidity();
    this.fechaIntervaloValidator();

    this.setValoresStore(this.datosServicio, 'horaFinal', 'setHoraFinal');

    if (
      this.fechaInicioPasadaFechaFinalError() &&
      this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL
    ) {
      this.limpiarFechasHoras();
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSJ_ERROR_HORA_FINAL_MENOR_INICIAL,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.fechaInicioPasadaFechaFinalError()) {
      this.limpiarFechasHoras();
      return;
    }

    const MSJ_ERROR_FECHA =
      this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL
        ? MSJ_ERROR_FECHA_DIA
        : this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.SEMANAL
        ? MSJ_ERROR_FECHA_SEMANA
        : MSJ_ERROR_FECHA_MES;

    if (this.datosServicio.hasError('invalidIntervalo')) {
      this.limpiarFechasHoras();
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSJ_ERROR_FECHA,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
    
    // Forzar actualización de fechas disponibles y limpiar selecciones previas
    this.calcularRangoFechas();
    
    // Forzar detección de cambios para actualizar la vista
    this.cdRef.detectChanges();
  }

  /**
   * Convierte fecha de formato YYYY-MM-DD a DD/MM/YYYY
   */
  private convertirFechaParaComparacion(fecha: string): string {
    if (fecha.includes('-') && fecha.length === 10) {
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year}`;
    }
    return fecha;
  }

  /**
   * Calcula el rango de días entre las fechas y horas seleccionadas,
   * actualiza el valor de mostrarRangoFechas y colapsable,
   * y establece los valores correspondientes en el store.
   * @returns
   */
  calcularRangoFechas(): void {

    this.rangoFechas();        
    
    // IMPORTANTE: Limpiar fechas seleccionadas cuando se recalcula el rango
    // Esto asegura que cuando se cambien las fechas/horas, se limpien las selecciones previas
    this.tramite5701Store.setFechasSeleccionadas([]);
    this.fechasSeleccionadas.clear();
    this.fechasSeleccionadasCrosslist = [];
    
    if (this.tipoSolicitudSeleccionada !== TIPO_SOLICITUD.INDIVIDUAL) {
      this.mostrarRangoFechas = true;
      this.colapsable = true;
    } else {
      this.mostrarRangoFechas = false;
      this.fechasSeleccionadas?.clear();
      if (this.selectRangoDias.length > 0) {
        this.fechasSeleccionadas.push(new FormControl(this.selectRangoDias[0]));
      }
    }
  }

  /**
   * Calcula el rango de días    entre dos fechas y horas,
   * y actualiza el estado del componente.
   */
  rangoFechas(): void {
    const FECHA_INICIAL = this.datosServicio.get('fechaInicio')?.value;
    const FECHA_FINAL = this.datosServicio.get('fechaFinal')?.value;
    const HORA_INICIO = this.datosServicio.get('horaInicio')?.value;
    const HORA_FINAL = this.datosServicio.get('horaFinal')?.value;

    this.selectRangoDias = FechasService.obtenerDiasEntreFechas(
      FECHA_INICIAL,
      FECHA_FINAL,
      HORA_INICIO,
      HORA_FINAL
    );
  }

  /**
   * Método que limpia el formulario de las fechas y horas.
   */
  limpiarFechasHoras(): void {
    this.datosServicio.reset({
      horaInicio: '',
      fechaInicio: '',
      horaFinal: '',
      fechaFinal: '',
    });
    this.despacho.markAsPristine();
    this.despacho.markAsUntouched();

    timer(5)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap(() => {
          this.datosServicio.reset({
            horaFinal: '',
          });
        })
      )
      .subscribe();

    this.selectRangoDias = [];
    this.tramite5701Store.update({
      fechaInicio: '',
      horaInicio: '',
      fechaFinal: '',
      horaFinal: '',
      fechasSeleccionadas: [],
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Cambia la sección aduanera y actualiza el estado correspondiente.
   * @returns {void} No retorna ningún valor.
   */
  changeSeccionAduanera(): void {
    const RECINTO = this.despacho.get('nombreRecinto')?.value;
    const SECCION_ADUANERA = this.despacho.get('idSeccionDespacho')?.value;

    const NOMBRE_RECINTO = this.despacho.get('nombreRecinto');

    this.desactivarSelectRecinto =
      SECCION_ADUANERA !== SIN_VALOR.toString() &&
      SECCION_ADUANERA !== SIN_ITEMS;

    NOMBRE_RECINTO?.[
      this.desactivarSelectRecinto || RECINTO === SIN_ITEMS
        ? 'disable'
        : 'enable'
    ]();

    if (!this.desactivarSelectRecinto && RECINTO !== SIN_ITEMS) {
      NOMBRE_RECINTO?.setValue(SIN_VALOR);
    }

    this.setValoresStore(
      this.despacho,
      'idSeccionDespacho',
      'setIdSeccionDespacho'
    );
  }

  /**
   * Cambia el recinto seleccionado y actualiza el estado correspondiente.
   *
   * @returns {void} No retorna ningún valor.
   */
  changeRecinto(): void {
    const RECINTO = this.despacho.get('nombreRecinto')?.value;
    const SECCION_ADUANERA = this.despacho.get('idSeccionDespacho')?.value;

    const ID_SECCION_DESPACHO = this.despacho.get('idSeccionDespacho');

    this.desactivarSelectSeccionAduanera =
      RECINTO !== SIN_VALOR.toString() && RECINTO !== SIN_ITEMS;

    ID_SECCION_DESPACHO?.[
      this.desactivarSelectSeccionAduanera || SECCION_ADUANERA === SIN_ITEMS
        ? 'disable'
        : 'enable'
    ]();

    if (
      !this.desactivarSelectSeccionAduanera &&
      SECCION_ADUANERA !== SIN_ITEMS
    ) {
      ID_SECCION_DESPACHO?.setValue(SIN_VALOR);
    }

    this.setValoresStore(this.despacho, 'nombreRecinto', 'setNombreRecinto');
  }

  /**
   * Busca la patente de un apoderado, actualiza el formulario con el valor obtenido
   * y realiza la obtención de IDs de patentes aduanales.
   *
   * @returns {void} No retorna ningún valor.
   */
  patenteApoderado(): void {
    // Busqueda de la patente a algun endpoint
    const PATENTE = this.FormSolicitud.get('apoderadoPatente')?.value;
    const DATOS_PATENTE: DatosAgregarFormulario = {
      form: this.despacho,
      field: 'patente',
      valor: PATENTE,
    };
    FormulariosService.agregarValorCamposDesactivados(DATOS_PATENTE);
    this.obtenerIdPatentesAduanales();
  }

  /**
   * Obtiene un listado de empresas asociadas a una patente.
   *
   * @returns {Observable<string[]>} Observable que emite un arreglo de cadenas con los datos de las empresas.
   */
  obtenerEmpresasPatente(): Observable<string[]> {
    return this.serviciosExtraordinariosService
      .getCatalogoById(PATENTES_ID)
      .pipe(
        map((resp) => {
          return JSON.parse(resp.data);
        })
      );
  }

  /**
   * Obtiene el catálogo de patentes aduanales mediante un servicio.
   * @returns {void} No retorna ningún valor.
   */
  obtenerIdPatentesAduanales(): void {
    this.serviciosExtraordinariosService.getCatalogoById(PATENTES_ID).pipe(
      map((resp) => {
        return JSON.parse(resp.data);
      })
    );
  }

  /**
   * Referencia al componente de Programa Fomento.
   * Debe ser asignada por @ViewChild si es un componente hijo.
   */
  programaFomento?: { isDisabled: boolean };

  /**
   * Actualiza los valores del campo Programa Fomento y almacena los cambios en el store.
   * @param valores - Objeto que contiene el estado del checkbox y el texto asociado.
   * @returns {void}
   */
  checkPrograma(valores: DatosCheckInputText): void {    
    this.datosImportadorExportador.get('programa')?.setValue(valores.checkbox);
    
    const desProgramaControl = this.datosImportadorExportador.get('desProgramaFomento');
    desProgramaControl?.enable();
    desProgramaControl?.setValue(valores.texto ?? '');
    desProgramaControl?.disable();
    
    this.setValoresStore(
      this.datosImportadorExportador,
      'programa',
      'setPrograma'
    );
    this.setValoresStore(
      this.datosImportadorExportador,
      'desProgramaFomento',
      'setDescripcionProgramaFomento'
    );
    
    // Update the component's disabled state based on the data
    if (this.programaFomento) {
      this.programaFomento.isDisabled = valores.disabled || false;
    }
  }

  /**
   * Actualiza los valores del campo IMMEX y almacena los cambios en el store.
   * @param valores - Objeto que contiene el estado del checkbox y el texto asociado.
   * @returns {void}
   */
  checkImmex(valores: DatosCheckInputText): void {    
    this.datosImportadorExportador
      .get('checkIMMEX')
      ?.setValue(valores.checkbox);
    
    const desImmexControl = this.datosImportadorExportador.get('desImmex');
    desImmexControl?.enable();
    desImmexControl?.setValue(valores.texto ?? '');
    desImmexControl?.disable();
        
    this.setValoresStore(
      this.datosImportadorExportador,
      'checkIMMEX',
      'setCheckIMMEX'
    );
    this.setValoresStore(
      this.datosImportadorExportador,
      'desImmex',
      'setDescripcionImmex'
    );
    
    // Update the component's disabled state based on the data
    if (this.programaImmex) {
      this.programaImmex.isDisabled = valores.disabled || false;
    }
  }

  /**
   * Actualiza los valores del campo automutriz y almacena los cambios en el store.
   * @param valores - Objeto que contiene el estado del checkbox y el texto asociado.
   * @returns {void}
   */
  checkAutomotriz(valores: DatosCheckInputText): void {    
    this.datosImportadorExportador
      .get('industriaAutomotriz')
      ?.setValue(valores.checkbox);
    
    const desAutomotrizControl = this.datosImportadorExportador.get('desIndustrialAutomotriz');
    desAutomotrizControl?.enable();
    desAutomotrizControl?.setValue(valores.texto ?? '');
    desAutomotrizControl?.disable();
        
    this.setValoresStore(
      this.datosImportadorExportador,
      'industriaAutomotriz',
      'setIndustriaAutomotriz'
    );
    this.setValoresStore(
      this.datosImportadorExportador,
      'desIndustrialAutomotriz',
      'setDescripcionIndustriaAutomotriz'
    );
    
    // Update the component's disabled state based on the data
    if (this.industriaAutomotriz) {
      this.industriaAutomotriz.isDisabled = valores.disabled || false;
    }
  }

  /**
   * Verifica y actualiza el estado de los campos de un formulario según el valor de un campo específico.
   * @param campoId - Identificador del campo a verificar.
   * @param campoDescripcion - Identificador del campo de descripción asociado.
   * @param form - Formulario reactivo que contiene los campos.
   * @returns {void}
   */
  verificaDatosCheckInput(
    campoId: string,
    campoDescripcion: string,
    form: FormGroup
  ): void {
    const VALOR = form.get(campoId)?.value;
    const LDA_DD = campoId.includes('lda') || campoId.includes('dd');

    if (VALOR) {
      form.get(campoDescripcion)?.enable();
      form
        .get(campoDescripcion)
        ?.setValue(
          this.solicitudState?.[campoDescripcion as keyof Solicitud5701State]
        );

      if (LDA_DD) {
        this.despachoSeleccionado = true;
        this.idNameAutorizacion = campoId === 'dd' ? ID_NAME_DD : ID_NAME_LDA;
        this.labelTipoDespacho =
          campoId === 'dd' ? LABEL_DESPACHO_DD : LABEL_DESPACHO_LDA;

        if (campoId === 'dd') {
          this.despacho.get('lda')?.disable();
        } else if (campoId === 'lda') {
          this.despacho.get('dd')?.disable();
        }
      }
    }
  }

  /**
   * Cambia los datos de transporte o vehículo según el tipo especificado.
   *
   * @param vehiculos - Lista de vehículos o datos de transporte.
   * @param tipo - Tipo de datos a actualizar ('vehiculo' o 'transporte').
   * @returns void
   */
  changeAgregarVehiculo(vehiculos: TransporteDespacho[], tipo: string): void {
    if (tipo === 'vehiculo') {
      this.tramite5701Store.setTransporte(vehiculos);
    } else if (tipo === 'transporte') {
      // Asegurar que el campo tipo_transporte_des se mapee correctamente para tipo "Otro" (6)
      const transporteCorregido = vehiculos.map(transporte => {
        if (transporte.tipo_transporte === '6' && !transporte.tipo_transporte_des) {
          // Si es tipo "Otro" y no tiene tipo_transporte_des, usar el valor del servicio
          return {
            ...transporte,
            tipo_transporte_des: transporte.tipo_transporte_des || ''
          };
        }
        return transporte;
      });
      this.tramite5701Store.setTransporteArriboDatos(transporteCorregido);
    }
  }

  /**
   * Actualiza la lista de fechas seleccionadas y las almacena en el estado.
   *
   * @param fechas - Arreglo de fechas a agregar.
   * @returns void
   */
  changeCrosslist(fechas: string[]): void {

    
    this.fechasSeleccionadas.clear();
    fechas.forEach((fecha) => {
      let fechaFormat = convertirFechaDdMmYyyyAMoment(fecha.split(',')[1].replace(/\s+/g, ''));
      this.fechasSeleccionadas.push(new FormControl(fechaFormat));
    });


    this.tramite5701Store.setFechasSeleccionadas(fechas);
    this.fechasSeleccionadasCrosslist = [...fechas]; // Actualizar copia local
    
    this.montoACubrir = this.fechasSeleccionadas.length * this.montoPorDia; // Ejemplo de cálculo, ajustar según lógica real
    this.pagoCaptura.get('montoAPagar')?.enable();
    this.pagoCaptura.get('montoAPagar')?.setValue(this.montoACubrir);
    this.pagoCaptura.get('montoAPagar')?.disable();

    this.colapsable =
      this.tipoSolicitudSeleccionada !== TIPO_SOLICITUD.INDIVIDUAL
        ? true
        : false;

    this.setValoresStore(this.pagoCaptura, 'montoAPagar', 'setMontoPagar');
  }

  /**
   * Verifica y procesa los datos existentes en el estado de la solicitud.
   *
   * @remarks
   * Realiza validaciones y configuraciones basadas en los datos del estado,
   * como programas de fomento, IMMEX, industria automotriz, y rangos de fechas.
   *
   * @returns {void} No retorna ningún valor.
   */
  verificarDatosExistentesStore(): void {
    // Asegurar que solicitudState esté inicializado
    if (!this.solicitudState) {
      return;
    }
    
    if (this.solicitudState.nombre) {
      this.datosImportadorExportador
        .get('nombre')
        ?.enable({ emitEvent: false });
      this.datosImportadorExportador
        .get('nombre')
        ?.setValue(this.solicitudState.nombre);
      this.datosImportadorExportador
        .get('nombre')
        ?.disable({ emitEvent: false });
    }
    /** Verifica si existe tipo de solicitud */
    if (this.solicitudState.tipoSolicitud !== SIN_VALOR) {
      this.tipoSolicitudSeleccionada = parseInt(
        this.FormSolicitud.get('tipoSolicitud')?.value || this.solicitudState.tipoSolicitud,
        10
      );
      
      // Configurar validadores según el tipo
      if (this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL) {
        this.pedimento.setValidators([Validators.required, SolicitudComponent.minLengthArray(1)]);
        // Para individual: solo ocultar crosslist si no hay fechas seleccionadas
        if (!this.solicitudState.fechasSeleccionadas || this.solicitudState.fechasSeleccionadas.length === 0) {
          this.mostrarRangoFechas = false;
          this.colapsable = false;
        }
      } else {
        this.pedimento.clearValidators();
        // Para semanal/mensual: mostrar crosslist si hay fechas seleccionadas
        if (this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
          this.mostrarRangoFechas = true;
          this.colapsable = true;
        }
      }
      this.pedimento.updateValueAndValidity();
      
      // Forzar detección de cambios
      this.cdRef.detectChanges();
    }
 

    /** Verifica si programa fomento esta habilitado y si tiene valor. */
    if (this.solicitudState.programa) {
      const DATOS_PROGRAMA: DatosCheckInputText = {
        checkbox: this.solicitudState.programa,
        texto: this.solicitudState.descripcionProgramaFomento,
        disabled: false,
      };
      this.checkPrograma(DATOS_PROGRAMA);
    }

    /** Verifica si el check de IMMEX esta habilitado y si tiene valor. */
    if (this.solicitudState.checkIMMEX) {
      const DATOS_IMMEX: DatosCheckInputText = {
        checkbox: this.solicitudState.checkIMMEX,
        texto: this.solicitudState.descripcionImmex,
        disabled:true
      };
      this.checkImmex(DATOS_IMMEX);
    }

    /** Verifica si el check de industria automotriz esta habilitado y si tiene valor. */
    if (this.solicitudState.industriaAutomotriz) {
      const DATOS_AUTOMOTRIZ: DatosCheckInputText = {
        checkbox: this.solicitudState.industriaAutomotriz,
        texto: this.solicitudState.descripcionIndustrialAutomotriz,
        disabled: false,
      };
      this.checkAutomotriz(DATOS_AUTOMOTRIZ);
    }

    /** Verifica que si los campos con check e input estan seleccionados y tienen valor. */
    this.verificaDatosCheckInput(
      'socioComercial',
      'idSocioComercial',
      this.datosImportadorExportador
    );
    this.verificaDatosCheckInput('lda', 'despacho', this.despacho);
    this.verificaDatosCheckInput('dd', 'despacho', this.despacho);

    // Verificar si hay fechas seleccionadas existentes y configurar la visualización
    if (this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
      // Solo mostrar crosslist para tipos semanal/mensual
      if (this.tipoSolicitudSeleccionada !== TIPO_SOLICITUD.INDIVIDUAL) {
        this.mostrarRangoFechas = true;
        this.colapsable = true;
      }
    }
    
    if (
      this.solicitudState.horaFinal &&
      this.solicitudState.horaInicio &&
      this.solicitudState.fechaInicio &&
      this.solicitudState.fechaFinal
    ) {     

      // Generar el rango completo de fechas
      this.selectRangoDias = FechasService.obtenerDiasEntreFechas(
        this.solicitudState.fechaInicio,
        this.solicitudState.fechaFinal,
        this.solicitudState.horaInicio,
        this.solicitudState.horaFinal
      );
      
      // Filtrar fechas ya seleccionadas
      if (this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
        const fechasSeleccionadasConvertidas = this.solicitudState.fechasSeleccionadas.map(fecha => 
          this.convertirFechaParaComparacion(fecha)
        );
        
        this.selectRangoDias = this.selectRangoDias.filter(fecha => {
          const fechaExtraida = fecha.includes(',') ? fecha.split(',')[1].trim() : fecha;
          return !fechasSeleccionadasConvertidas.includes(fechaExtraida);
        });
      }
      
      // Solo mostrar crosslist para tipos semanal/mensual
      if (this.tipoSolicitudSeleccionada !== TIPO_SOLICITUD.INDIVIDUAL) {
        this.mostrarRangoFechas = true;
        this.colapsable = true;
      }

    } else if (this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) {
      // Si no hay fechas de rango pero sí hay fechas seleccionadas, mostrar la sección      
      this.mostrarRangoFechas = true;
      this.colapsable = true;
      
      // Intentar generar fechas disponibles desde el store primero
      if (this.solicitudState.fechaInicio && this.solicitudState.fechaFinal && 
          this.solicitudState.horaInicio && this.solicitudState.horaFinal) {
        const rangoCompleto = FechasService.obtenerDiasEntreFechas(
          this.solicitudState.fechaInicio,
          this.solicitudState.fechaFinal,
          this.solicitudState.horaInicio,
          this.solicitudState.horaFinal
        );
        
        this.selectRangoDias = rangoCompleto.filter(
          fecha => !this.solicitudState.fechasSeleccionadas.includes(fecha)
        );
      } else {
        // Si no hay en el store, intentar desde el formulario
        const fechaInicio = this.datosServicio.get('fechaInicio')?.value;
        const fechaFinal = this.datosServicio.get('fechaFinal')?.value;
        const horaInicio = this.datosServicio.get('horaInicio')?.value;
        const horaFinal = this.datosServicio.get('horaFinal')?.value;
        
        if (fechaInicio && fechaFinal && horaInicio && horaFinal) {
          const rangoCompleto = FechasService.obtenerDiasEntreFechas(
            fechaInicio,
            fechaFinal,
            horaInicio,
            horaFinal
          );
          
          const fechasSeleccionadasConvertidas = this.solicitudState.fechasSeleccionadas.map(fecha => 
            this.convertirFechaParaComparacion(fecha)
          );

          if (this.tipoSolicitudSeleccionada !== TIPO_SOLICITUD.INDIVIDUAL) {
            this.mostrarRangoFechas = true;
          } else {
            this.mostrarRangoFechas = false;
          }
          
          this.selectRangoDias = rangoCompleto.filter(fecha => {
            const fechaExtraida = fecha.includes(',') ? fecha.split(',')[1].trim() : fecha;
            return !fechasSeleccionadasConvertidas.includes(fechaExtraida);
          });
        } else {
          this.selectRangoDias = [];
        }
      }
    }

    /** Verifica si la tabla de lineas de captura tiene datos y los agrega al formulario. */
    if (this.solicitudState.lineasCaptura && this.solicitudState.lineasCaptura.length > 0) {
       this.datosTablaPagos = this.solicitudState.lineasCaptura;
      this.solicitudState.lineasCaptura.forEach((linea) => {
        this.lineasCaptura.push(
          this.fb.group({
            lineaCaptura: [linea.lineaCaptura, Validators.required],
            monto: [linea.monto, Validators.required],
          })
        );
      });
      this.pagoCaptura.get('lineaCaptura')?.reset();
      this.pagoCaptura.get('monto')?.reset();
    }
    
    // Solo actualizar colapsable si no se ha establecido previamente por datos existentes
    if (!this.mostrarRangoFechas && !(this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0)) {
      this.colapsable =
        (this.solicitudState.fechasSeleccionadas && this.solicitudState.fechasSeleccionadas.length > 0) ||
        this.selectRangoDias.length > 0
          ? true
          : false;
    }

    const ADUANA = this.solicitudState.idAduanaDespacho;
    const RECINTO_FISCALIZADO = this.solicitudState.nombreRecinto;
    const SECCION_ADUANERA = this.solicitudState.idSeccionDespacho;

    // Cargar catálogos dependientes si hay aduana
    if (ADUANA && ADUANA !== '-1') {
      this.cargarCatalogosDependientes(ADUANA);
    }
    
    // Para tipo individual, asegurar que el crosslist esté oculto
    if(this.solicitudState.tipoSolicitud === TIPO_SOLICITUD.INDIVIDUAL) {
      this.mostrarRangoFechas = false;
      this.colapsable = false;
    }
  }

  /**
   * Obtiene la selección realizada por el usuario dentro del campo aduana,
   * filtra las listas secciones y recintos con base a la selección
   * y actualiza el estado del componente.
   */
  public changeAduana(): void {
    const ADUANA = this.despacho.get('idAduanaDespacho')?.value;
    this.datosPedimentoComponente = {
      patente: this.solicitudState?.patente.patente,
      idAduanaDespacho: ADUANA,
    };

    if (ADUANA && ADUANA !== SIN_VALOR.toString()) {
      // Limpiar valores previos de sección y recinto antes de cargar nuevos catálogos
      this.despacho.get('idSeccionDespacho')?.setValue(SIN_VALOR);
      this.despacho.get('nombreRecinto')?.setValue(SIN_VALOR);
      
      this.cargarCatalogosDependientes(ADUANA);
    } else {
      // Si no hay aduana seleccionada, limpiar y deshabilitar los selects dependientes
      this.seccionAduanera = [];
      this.recintoCatalogo = [];
      this.despacho.get('idSeccionDespacho')?.setValue(SIN_VALOR);
      this.despacho.get('nombreRecinto')?.setValue(SIN_VALOR);
      this.despacho.get('idSeccionDespacho')?.disable();
      this.despacho.get('nombreRecinto')?.disable();
    }

    this.tramite5701Store.update({
      idAduanaDespacho: ADUANA,
    });
  }

  /**
   * Carga los catálogos de sección aduanera y recinto basados en la aduana seleccionada.
   * @param aduana - ID de la aduana seleccionada
   */
  private cargarCatalogosDependientes(aduana: string): void {
    // Verificar que el formulario esté inicializado antes de proceder
    if (!this.FormSolicitud || !this.formularioInicializado) {
      return;
    }
    
    this.seccionAduanaService
      .getListaSeccionesAduanas(aduana)
      .pipe(
        switchMap((response) => {
          this.desactivarSelectSeccionAduanera =
            response && response.datos?.length > 0;
          if (this.desactivarSelectSeccionAduanera) {
            response.datos.map((seccion) => {
              seccion.title = seccion.descripcion;
              seccion.descripcion =
                seccion.descripcion.length > 28
                  ? `${seccion.descripcion.substring(0, 28)}...`
                  : seccion.descripcion;
              return seccion;
            });
            this.seccionAduanera = response?.datos;            
            
            // Establecer el valor de sección aduanera si existe en el store            
            setTimeout(() => {
              if (!this.despacho) return; // Verificación adicional
              
              const seccionValue = this.solicitudState?.idSeccionDespacho;            
                if (seccionValue && seccionValue !== '-1') {
                  this.despacho.get('idSeccionDespacho')?.setValue(seccionValue);                
                } else {
                  this.despacho.get('idSeccionDespacho')?.setValue(SIN_VALOR);
                }
              if (this.editable) {
                this.despacho.get('idSeccionDespacho')?.enable();
              } else {
                this.despacho.get('idSeccionDespacho')?.disable();
              }
            }, 0);            
          } else {
            if (this.despacho) {
              this.despacho.get('idSeccionDespacho')?.enable();
              this.despacho.get('idSeccionDespacho')?.setValue(SIN_ITEMS);
              this.despacho.get('idSeccionDespacho')?.disable();
            }
          }

          return this.recintoService.getListaRecintos(aduana);
        }),
        tap((responseRecinto) => {
          this.desactivarSelectRecinto =
            responseRecinto && responseRecinto.datos?.length > 0;

          if (this.desactivarSelectRecinto) {
            responseRecinto.datos.map((recinto) => {
              recinto.title = recinto.nombre;
              recinto.descripcion =
                recinto.descripcion.length > 28
                  ? `${recinto.descripcion.substring(0, 28)}...`
                  : recinto.descripcion;
              return recinto;
            });
            this.recintoCatalogo = responseRecinto?.datos;            
            
            // Establecer el valor de nombre del recinto si existe en el store            
            setTimeout(() => {
              if (!this.despacho) return; // Verificación adicional
              
              const recintoValue = this.solicitudState?.nombreRecinto;            
                if (recintoValue && recintoValue !== '-1') {
                  this.despacho.get('nombreRecinto')?.setValue(recintoValue);                
                } else {
                  this.despacho.get('nombreRecinto')?.setValue(SIN_VALOR);
                }
              if (this.editable) {
                this.despacho.get('nombreRecinto')?.enable();
              } else {
                this.despacho.get('nombreRecinto')?.disable();
              }
            }, 0);            
          } else {
            if (this.despacho) {
              this.despacho.get('nombreRecinto')?.enable();
              this.despacho.get('nombreRecinto')?.setValue(SIN_ITEMS);
              this.despacho.get('nombreRecinto')?.disable();
            }
          }
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Obtiene las certificaciones del RFC proporcionado y actualiza el store correspondiente.
   *
   * @param rfc - RFC del importador/exportador.
   * @returns {void} No retorna ningún valor.
   */
  private getCertificaciones(rfc: string): void {
    /** Obtiene certificacion IMMEX */
    this.certificacionService
      .getCertificacion(rfc, PROGRAMA_IMMEX)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          if (response.datos) {            
            const VALORES_IMMEX: DatosCheckInputText = {
              checkbox: response.datos?.immex || false,
              texto: response.datos?.desc_immex || '',
              disabled: true,
            };
            this.checkImmex(VALORES_IMMEX);
          } else {
            limpiarYDeshabilitarControl('desImmex', 'textbox');
            limpiarYDeshabilitarControl('checkIMMEX', 'checkbox');
            
            // Actualizar store
            this.tramite5701Store.setCheckIMMEX(false);
            this.tramite5701Store.setDescripcionImmex('');
            
          }
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe();

    this.certificacionService
      .getCertificacion(rfc, PROGRAMA_FOMENTO)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          if (response.datos) {
            const VALORES_PROGRAMA_FOMENTO: DatosCheckInputText = {
              checkbox: response.datos?.programa_fomento || false,
              texto: response.datos?.desc_programa_fomento || '',
              disabled: false,
            };
            this.checkPrograma(VALORES_PROGRAMA_FOMENTO);
          } else {
            limpiarYDeshabilitarControl('desProgramaFomento', 'textbox');
            limpiarYDeshabilitarControl('programa', 'checkbox');
            
            this.tramite5701Store.setPrograma(false);
            this.tramite5701Store.setDescripcionProgramaFomento('');
          }
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe();

    /** Obtiene certificación de industria automotriz */
    this.certificacionIndustriaAutomotrizService
      .getCertificacionAutomotriz(rfc)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          if (response.datos) {
            const VALORES_AUTOMOTRIZ: DatosCheckInputText = {
              checkbox: response.datos?.industrial_automotriz || false,
              texto: response.datos?.des_industrial_automotriz || '',
              disabled: true,
            };
            this.checkAutomotriz(VALORES_AUTOMOTRIZ);
          } else {
            limpiarYDeshabilitarControl('desIndustrialAutomotriz', 'textbox');
            limpiarYDeshabilitarControl('industriaAutomotriz', 'checkbox');
            
            this.tramite5701Store.setIndustriaAutomotriz(false);
            this.tramite5701Store.setDescripcionIndustriaAutomotriz('');
          }
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe();

    /** Obtiene certificación de origen */
    this.certificacionOrigenService
      .getCertificacionOrigen(rfc)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          this.datosImportadorExportador
            .get('revision')
            ?.setValue(response.datos);
          this.tramite5701Store.setRevision(response.datos);

          this.revisionDisabled = response.datos ? true : false;

          this.tramite5701Store.setBlnRevisionOrigen(response.datos);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe();

    /** Obtiene certificación OEA */
    const VALIDACION_OEA_IMPEXP$ =
      this.certificacionOeaService.getValidacionCertificacion(
        MODALIDAD_OEA_IMPEXP,
        rfc
      );
    const VALIDACION_OEA_CTRL$ =
      this.certificacionOeaService.getValidacionCertificacion(
        MODALIDAD_OEA_IMPEXP,
        rfc
      );
    const VALIDACION_OEA_AEREO$ =
      this.certificacionOeaService.getValidacionCertificacion(
        MODALIDAD_OEA_IMPEXP,
        rfc
      );
    const VALIDACION_OEA_SECIIT$ =
      this.certificacionOeaService.getValidacionCertificacion(
        MODALIDAD_OEA_IMPEXP,
        rfc
      );
    const VALIDACION_OEA_TEXTIL$ =
      this.certificacionOeaService.getValidacionCertificacion(
        MODALIDAD_OEA_IMPEXP,
        rfc
      );
    const VALIDACION_OEA_RFESTRATEGICO$ =
      this.certificacionOeaService.getValidacionCertificacion(
        MODALIDAD_OEA_IMPEXP,
        rfc
      );

    forkJoin([
      VALIDACION_OEA_IMPEXP$,
      VALIDACION_OEA_CTRL$,
      VALIDACION_OEA_AEREO$,
      VALIDACION_OEA_SECIIT$,
      VALIDACION_OEA_TEXTIL$,
      VALIDACION_OEA_RFESTRATEGICO$,
    ])
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((responses) => {
          const ALGUNA_TIENE_VALOR = responses.some((res) =>
            Boolean(res.datos)
          );
          if (ALGUNA_TIENE_VALOR) {
            this.datosImportadorExportador
              .get('certificacionOEA')
              ?.setValue(true);
            // Deshabilitar todos los checkboxes de tipo empresa certificada
            this.tipoEmpresaCertificadaADisabled = true;
            this.tipoEmpresaCertificadaAADisabled = true;
            this.tipoEmpresaCertificadaAAADisabled = true;
            this.certificacionOEADisabled = true;
          } else {
            this.datosImportadorExportador
              .get('certificacionOEA')
              ?.setValue(false);
            // Habilitar checkboxes según el estado actual
            this.initializeTipoEmpresaCertificadaStates();
            this.certificacionOEADisabled = false;
          }
        })
      )
      .subscribe();
  }

  /**
   * Consulta si la línea de captura es válida, ha sido usada y ya fue pagada y actualiza el store correspondiente.
   * @returns {void} No retorna ningún valor.
   */
  public agregarPagoSea(): void {
    const LINEA_PAGO: string = this.pagoCaptura.get('lineaCaptura')?.value;
    const MONTO: number = this.pagoCaptura.get('monto')?.value;
    
    if (!LINEA_PAGO || !MONTO) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSJ_ERROR_LINEA_CAPTURA,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.datosTablaPagos.some((pago) => pago.lineaCaptura === LINEA_PAGO)) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSJ_LINEA_CAPTURA_DUPLICADA,
        cerrar: false,
        txtBtnAceptar: TEXTO_ACEPTAR,
        txtBtnCancelar: '',
      };
      this.pagoCaptura.get('lineaCaptura')?.reset();
      this.pagoCaptura.get('monto')?.reset();
      return;
    }

    this.validaLineaCapturaService
      .getValidaLineaCapturaUsada(LINEA_PAGO)
      .pipe(
        takeUntil(this.destroyNotifier$),
        switchMap((responseValidaLineaCaptura) => {
          if (responseValidaLineaCaptura.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSJ_LINEA_CAPTURA_USADA,
              cerrar: false,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
            this.pagoCaptura.get('lineaCaptura')?.reset();
            this.pagoCaptura.get('monto')?.reset();
            return EMPTY;
          }
          return this.validaLineaCapturaService.getValidaLineaCaptura(
            LINEA_PAGO
          );
        }),
        tap((responseLineaCapturaPagada) => {
          if (
            responseLineaCapturaPagada.datos.pago_model.estatus !==
            ESTATUS_PAGADO
          ) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSJ_LINEA_CAPTURA_NO_PAGADA,
              cerrar: false,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
            return;
          }

          const FECHAS = this.fechasSeleccionadas.length;

          const DIAS_SERVICIO =
            this.tipoSolicitudSeleccionada === TIPO_SOLICITUD.INDIVIDUAL ||
            FECHAS === 0
              ? 1
              : this.fechasSeleccionadas.length;

          const MONTO_A_CUBRIR = DIAS_SERVICIO * this.montoPorDia;

          const PAGO = {
            lineaCaptura: LINEA_PAGO,
            monto: responseLineaCapturaPagada.datos.pago_model.importe,
          };

          if (this.montoPagadoLineas < MONTO_A_CUBRIR) {
            this.montoPagadoLineas +=
              responseLineaCapturaPagada.datos.pago_model.importe;
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSG_DATOS_GUARDADOS,
              cerrar: false,
              txtBtnAceptar: TEXTO_ACEPTAR,
              txtBtnCancelar: CAMPO_VACIO,
            };
            this.datosTablaPagos = [...this.datosTablaPagos, PAGO];
     
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSG_MONTO_PAGADO_CUBIERTO,
              cerrar: false,
              txtBtnAceptar: TEXTO_ACEPTAR,
              txtBtnCancelar: CAMPO_VACIO,
            };
            this.pagoCaptura.get('lineaCaptura')?.reset();
            this.pagoCaptura.get('monto')?.reset();
            return;
          }

          /** Actualizar el estado una vez, en lugar de en cada iteración */
          this.tramite5701Store.setLineasCaptura(this.datosTablaPagos);

          /**  Limpia los campos de la línea de captura y monto */
          this.pagoCaptura.get('lineaCaptura')?.reset();
          this.pagoCaptura.get('monto')?.reset();

          this.lineasCaptura?.clear();
          this.lineasCaptura.push(
            this.fb.group({
              lineaCaptura: [LINEA_PAGO, Validators.required],
              monto: [
                responseLineaCapturaPagada.datos.pago_model.importe,
                Validators.required,
              ],
            })
          );
        }),
        catchError((error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: TITULO_MODAL_AVISO,
            mensaje: error.error?.mensaje || MSJ_ERROR_LINEA_CAPTURA_NO_VALIDA,
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };

          this.pagoCaptura.get('lineaCaptura')?.reset();
          this.pagoCaptura.get('monto')?.reset();
          return EMPTY;
        })
      )
      .subscribe();
  }

  /**
   * Obtiene el monto a pagar desde el servicio de parámetros y lo establece en el formulario.
   * @returns {void} No retorna ningún valor.
   */
  public calcularMontoTotal(): void {
    this.parametroMontoService
      .getParametroMonto()
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((montoResponse) => {
          this.montoPorDia = montoResponse.datos;
          this.pagoCaptura.get('montoAPagar')?.enable();
          this.pagoCaptura.get('montoAPagar')?.setValue(montoResponse.datos);
          this.pagoCaptura.get('montoAPagar')?.disable();
        })
      )
      .subscribe();
  }

  // #Seccion Modal
  /**
   * Método que maneja el evento de aceptar o no una accion del componente Notificación cuando este es un modal.
   */
  confirmacionModal(confirmar: boolean): void {
    switch (this.procesoModal) {
      case 'lda_dd':
        {
          const CHECK_LDA = this.solicitudState.lda;
          const CHECK_DD = this.solicitudState.dd;

          if (CHECK_DD || CHECK_LDA) {
            if (confirmar) {
              this.despacho.get(this.tipoDespacho)?.setValue(false);
              this.limpiaCamposDdaLda();
              this.activaDesactivaCheckLDA_DDEX(this.tipoDespacho);
              this.despachoSeleccionado = false;
              this.tipoDespacho = '';
            } else {
              this.despacho.get(this.tipoDespacho)?.setValue(true);
              this.despachoSeleccionado = true;
            }
          } else {
            if (confirmar) {
              this.limpiaCamposDdaLda();
              this.activaDesactivaCheckLDA_DDEX(this.tipoDespacho);
              this.despacho.get(this.tipoDespacho)?.setValue(true);
              this.despachoSeleccionado = true;
              this.tipoDespacho = '';
            } else {
              this.despacho.get(this.tipoDespacho)?.setValue(false);
              this.despachoSeleccionado = false;
            }
          }

          this.procesoModal = '';
          this.despacho.get('rfcDespachoLDA')?.clearValidators();
          this.despacho.get('rfcDespachoLDA')?.updateValueAndValidity();
          this.despacho.get('folioDDEX')?.clearValidators();
          this.despacho.get('folioDDEX')?.updateValueAndValidity();
        }
        break;

      case 'linea_captura':
        if (confirmar) {
          this.limpiarNotificacion();
          this.datosTablaPagos = this.datosTablaPagos.filter(
            (item) =>
              !this.lineaCapturaSeleccionados.some(
                (seleccionado) =>
                  seleccionado.lineaCaptura === item.lineaCaptura
              )
          );
          this.lineaCapturaSeleccionados = [];

          timer(500)
            .pipe(
              tap(() => {
                this.nuevaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: '',
                  modo: 'action',
                  titulo: TITULO_MODAL_AVISO,
                  mensaje: MSG_ELIMINA_ELEMENTO,
                  cerrar: false,
                  txtBtnAceptar: TEXTO_ACEPTAR,
                  txtBtnCancelar: CAMPO_VACIO,
                };
              }),
              takeUntil(this.destroyNotifier$)
            )
            .subscribe();

          this.tramite5701Store.setLineasCaptura(this.datosTablaPagos);
          this.montoPagadoLineas = this.datosTablaPagos.reduce(
            (total, item) => total + item.monto,
            0
          );

          this.procesoModal = '';
        }
        break;

      case 'eliminar_solicitud':
        if (confirmar) {
          const ID_SOLICITUD = this.solicitudState.idSolicitud
            ? this.solicitudState?.idSolicitud
            : 0;
          if (ID_SOLICITUD !== 0) {
            this.peticionEliminarSolicitud(ID_SOLICITUD);
            this.limpiarNotificacion();
            this.procesoModal = '';
          }
        }
        break;
      default:
        break;
    }
  }

  // #Seccion LDA y DD

  /**
   * Muestra un cuadro de diálogo de confirmación para la selección de tipo de despacho (LDA o DD).
   * @param tipo - Tipo de despacho seleccionado ('lda' o 'dd').
   * @returns {void} No retorna ningún valor.
   */
  showConfirmDialogLDA_DD(tipoCheck: string): void {
    const CHECKED = this.despacho.get(tipoCheck)?.value;
    const ID_ADUANA_DESPACHO = this.despacho.get('idAduanaDespacho')?.value;
    const ID_SECCION_DESPACHO = this.despacho.get('idSeccionDespacho')?.value;
    this.despachoSeleccionado = !this.despachoSeleccionado;
    this.tipoDespacho = tipoCheck; // Guarda el tipo de despacho seleccionado
    const RECINTO_ESPECIFICADO = this.validaCampoRecintoEspecifique();

    if (CHECKED) {
      if(tipoCheck === 'dd'){
        this.despacho.get('seccionAduanera')?.disable();
      }
      if(tipoCheck === 'lda'){
        const tipoDespachoCtrl = this.despacho.get('tipoDespacho');
        tipoDespachoCtrl?.setValidators([Validators.required]);
        tipoDespachoCtrl?.updateValueAndValidity();
        this.tipoDespachoRequired = true;
      } else {
        const tipoDespachoCtrl = this.despacho.get('tipoDespacho');
        tipoDespachoCtrl?.clearValidators();
        tipoDespachoCtrl?.updateValueAndValidity();
        this.tipoDespachoRequired = false;
      }

      if (
        RECINTO_ESPECIFICADO ||
        ID_ADUANA_DESPACHO !== SIN_VALOR_SELECT ||
        ID_SECCION_DESPACHO !== SIN_VALOR_SELECT
      ) {
        // Modal
        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: '',
          modo: 'action',
          titulo: TITULO_MODAL_AVISO,
          mensaje: tipoCheck === 'lda' ? ADV_BORRAR_CAMPOS_LDA : ADV_BORRAR_CAMPOS,
          cerrar: false,
          txtBtnAceptar: 'Sí',
          txtBtnCancelar: 'No',
        };
        this.procesoModal = 'lda_dd';
      } else {
        this.activaDesactivaCheckLDA_DDEX(tipoCheck);
      }
    } else {
      const VALIDACION_VALORES = [
        'idAduanaDespacho',
        'idSeccionDespacho',
        'nombreRecinto',
      ].some((campo) => this.despacho.get(campo)?.value !== SIN_VALOR_SELECT);

      const RECINTO_VALORES =
        this.despacho.get('nombreRecinto')?.value !== SIN_VALOR_SELECT;

      if (VALIDACION_VALORES) {
        if (RECINTO_VALORES) {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: '',
            modo: 'action',
            titulo: TITULO_MODAL_AVISO,
            mensaje:  tipoCheck === 'lda' ? ADV_BORRAR_CAMPOS_LDA : ADV_BORRAR_CAMPOS,
            cerrar: false,
            txtBtnAceptar: 'Sí',
            txtBtnCancelar: 'No',
          };
          this.procesoModal = 'lda_dd';

          return;
        }

        this.nuevaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: TITULO_MODAL_AVISO,
          mensaje:  tipoCheck === 'lda' ? ADV_BORRAR_CAMPOS_LDA : ADV_BORRAR_CAMPOS,
          cerrar: false,
          txtBtnAceptar: 'Sí',
          txtBtnCancelar: 'No',
        };

        this.procesoModal = 'lda_dd';
      } else {
        this.activaDesactivaCheckLDA_DDEX(tipoCheck);
      }
    }
  }

  /**
   * Procesa la lógica para activar o desactivar los campos de LDA y DD en el formulario.
   * @param {tipo} string
   * @returns {void} No retorna ningún valor.
   */
  activaDesactivaCheckLDA_DDEX(tipo: string): void {
    const CONTROL = this.despacho.get(tipo);

    if (!this.despachoSeleccionado) {
      this.despacho.get('lda')?.enable();
      this.despacho.get('dd')?.enable();
      this.despacho.get('lda')?.clearValidators();
      this.despacho.get('dd')?.clearValidators();
      this.despacho.get('lda')?.updateValueAndValidity();
      this.despacho.get('dd')?.updateValueAndValidity();
      this.despacho.get('lda')?.reset();
      this.despacho.get('dd')?.reset();

      this.despacho.get('rfcDespachoLDA')?.reset();
      this.despacho.get('rfcDespachoLDA')?.clearValidators();
      this.despacho.get('rfcDespachoLDA')?.updateValueAndValidity();

      this.despacho.get('folioDDEX')?.reset();
      this.despacho.get('folioDDEX')?.clearValidators();
      this.despacho.get('folioDDEX')?.updateValueAndValidity();

      this.despacho.get('tipoDespacho')?.setValue(SIN_VALORES);
      this.despacho.get('tipoOperacion')?.setValue(SIN_VALORES);
      this.mostarSelectTipoDespacho = false;

      this.desactivarSelects(true);
    } else {
      if (CONTROL) {
        CONTROL.setValue(!CONTROL.value, { emitEvent: true }); // 🔥 Alterna el estado
      }

      if (tipo === 'lda') {
        this.despacho.get('dd')?.reset();
        this.despacho.get('dd')?.disable();

        this.selectCatalogoDespacho = this.despachoLdaCatalogo.slice(0, -1);
        this.despacho
          .get('rfcDespachoLDA')
          ?.setValidators([Validators.required]);
        this.desactivarSelects(false);
        this.despacho.get('rfcDespachoLDA')?.updateValueAndValidity();
      } else if (tipo === 'dd') {
        this.despacho.get('lda')?.reset();
        this.despacho.get('lda')?.disable();
        this.selectCatalogoDespacho = this.despachoDDCatalogo;
        this.activarCatalogoDespacho = true;
        this.despacho
          .get('folioDDEX')
          ?.setValidators([Validators.required, Validators.pattern(REGEX_RFC)]);
        this.despacho.get('folioDDEX')?.updateValueAndValidity();
        this.desactivarSelects(false);

        this.despacho.get('tipoDespacho')?.setValue(TIPO_DESPACHO_DDEX);
        this.despacho
          .get('tipoOperacion')
          ?.setValue(TIPO_OPERACION_EXPORTACION);
      }
      this.mostarSelectTipoDespacho = true;
    }

    this.cdRef.detectChanges();

    this.setValoresStore(
      this.despacho,
      tipo,
      `set${tipo.toUpperCase()}` as keyof Tramite5701Store
    );
  }

  /**
   * Limpia los campos del formulario de despacho y actualiza el store correspondiente.
   * @returns {void} No retorna ningún valor.
   */
  limpiaCamposDdaLda(): void {
    this.despacho.get('idAduanaDespacho')?.setValue(SIN_VALORES);
    this.despacho.get('aduanaDespacho')?.setValue('');
    this.despacho.get('idSeccionDespacho')?.setValue(SIN_VALORES);
    this.despacho.get('seccionAduanera')?.setValue('');
    this.despacho.get('nombreRecinto')?.setValue(SIN_VALORES);
    this.despacho.get('relacionSociedad')?.setValue(false);
    this.despacho.get('encargoConferido')?.setValue(false);
    this.despacho.get('domicilioDespacho')?.setValue('');
    this.despacho.get('tipoDespacho')?.setValue(SIN_VALORES);
    this.despacho.get('tipoDespachoDescripcion')?.setValue('');
    this.despacho.get('tipoOperacion')?.setValue(SIN_VALORES);

    this.despacho.get('idAduanaDespacho')?.markAsUntouched();

    this.setValoresStore(
      this.despacho,
      'idAduanaDespacho',
      'setIdAduanaDespacho'
    );
    this.setValoresStore(this.despacho, 'aduanaDespacho', 'setAduanaDespacho');
    this.setValoresStore(
      this.despacho,
      'idSeccionDespacho',
      'setIdSeccionDespacho'
    );
    this.setValoresStore(
      this.despacho,
      'seccionAduanera',
      'setSeccionAduanera'
    );
    this.setValoresStore(this.despacho, 'nombreRecinto', 'setNombreRecinto');
    this.setValoresStore(
      this.despacho,
      this.idNameAutorizacion,
      'setAutorizacionDDEX'
    );
    this.setValoresStore(
      this.despacho,
      'relacionSociedad',
      'setRelacionSociedad'
    );
    this.setValoresStore(
      this.despacho,
      'encargoConferido',
      'setEncargoConferido'
    );
    this.setValoresStore(
      this.despacho,
      'domicilioDespacho',
      'setDomicilioDespacho'
    );
    this.setValoresStore(this.despacho, 'tipoDespacho', 'setTipoDespacho');
    this.setValoresStore(
      this.despacho,
      'tipoDespachoDescripcion',
      'setDescripcionTipoDespacho'
    );
    this.setValoresStore(this.despacho, 'tipoOperacion', 'setTipoOperacion');
  }

  /**
   * Valida si el campo recinto y el campo especifique tienen algun valor.
   * @returns {boolean} Retorna true si el campo recinto es válido, de lo contrario false.
   */
  validaCampoRecintoEspecifique(): boolean {
    const CATALOGO_RECINTO = this.despacho.get('nombreRecinto')?.value;
    const ESPECIFIQUE_DESPACHO = this.despacho.get('especifique')?.value;

    const CATALOGO_VALIDO =
      CATALOGO_RECINTO !== null &&
      CATALOGO_RECINTO !== SIN_VALOR_SELECT &&
      CATALOGO_RECINTO !== SIN_ITEMS;
    const ESPECIFIQUE_VALIDO = Boolean(ESPECIFIQUE_DESPACHO?.toString().trim());

    return CATALOGO_VALIDO || ESPECIFIQUE_VALIDO;
  }

  /**
   * Guarda los datos del pedimento en el store.
   * @param {datosPedimento[]} Lista con los datos del pedimento.
   * @returns {void} No retorna ningún v(alor.
   */
  changeAgregarPedimento(datosPedimento: Pedimento[]): void {
    this.pedimento.clear();
    if (datosPedimento.length > 0) {
      datosPedimento.forEach((pedimento) => {
        this.pedimento.push(
          this.fb.group({
            idPedimento: [pedimento.idPedimento],
            patente: [pedimento.patente],
            pedimento: [pedimento.pedimento],
            aduana: [pedimento.aduana],
            tipoPedimento: [pedimento.tipoPedimento],
            estadoPedimento: [pedimento.estadoPedimento],
            subEstadoPedimento: [pedimento.subEstadoPedimento],
            descTipoPedimento: [pedimento.descTipoPedimento],
            numero: [pedimento.numero],
            comprobanteValor: [pedimento.comprobanteValor],
            pedimentoValidado: [pedimento.pedimentoValidado],
          })
        );
      });
    }
    this.tramite5701Store.setPedimentos(datosPedimento);
  }

  /**
   * Cambia el tipo de despacho y actualiza el store correspondiente.
   * @returns {void} No retorna ningún valor.
   */
  changeTipoDespacho(): void {
    const TIPO_DESPACHO = parseInt(
      this.despacho.get('tipoDespacho')?.value,
      10
    );

    const TIPO_DESPACHO_DESCRIPCION = this.selectCatalogoDespacho.find(
      (tipo) => tipo.id === TIPO_DESPACHO
    )?.descripcion;
    this.despacho
      .get('tipoDespachoDescripcion')
      ?.setValue(TIPO_DESPACHO_DESCRIPCION);

    this.setValoresStore(this.despacho, 'tipoDespacho', 'setTipoDespacho');
    this.setValoresStore(
      this.despacho,
      'tipoDespachoDescripcion',
      'setDescripcionTipoDespacho'
    );
  }

  /**
   * Cambia el tipo de transporte y actualiza el store correspondiente.
   * @param tipoTransporte {string} - El tipo de transporte seleccionado.
   * @returns {void} No retorna ningún valor.
   */
  changeSeleccionTipoTransporte(tipoTransporte: string): void {
    this.vehiculo.get('tipoTransporte')?.setValue(tipoTransporte);
    this.setValoresStore(this.vehiculo, 'tipoTransporte', 'setTipoTransporte');
  }

  /**
   * Cambia el tipo de transporte y actualiza el store correspondiente.
   * @param tipoTransporte {string} - El tipo de transporte seleccionado.
   * @returns {void} No retorna ningún valor.
   */
  changeSeleccionTipoVehiculo(tipoTransporte: string): void {
    this.transporteArriboSalida.get('tipoTransporte')?.setValue(tipoTransporte);
    this.setValoresStore(
      this.transporteArriboSalida,
      'tipoTransporte',
      'setTipoTransporteArriboSalida'
    );
  }

  /**
   * Cambia los responsables de despacho y actualiza el store correspondiente.
   * @param personas - Lista de responsables de despacho.
   * @returns {void} No retorna ningún valor.
   */
  changeResponsablesDespacho(personas: ResponsablesDespacho[]): void {

    
    // Crear una nueva referencia del array para forzar detección de cambios
    const personasActualizadas = [...personas];
    
    this.tramite5701Store.setPersonasResponsablesDespacho(personasActualizadas);

    this.personasResponsablesDespacho.clear();
    if (personasActualizadas.length > 0) {
      personasActualizadas.forEach((persona) => {
        this.personasResponsablesDespacho.push(
          this.fb.group({
            gafeteRespoDespacho: [persona.gafeteRespoDespacho],
            nombre: [persona.nombre],
            primerApellido: [persona.primerApellido],
            segundoApellido: [persona.segundoApellido],
          })
        );
      });
    }
    

  }

  /**
   * Elimina un elemento de la tabla de lineas de captura
   * @returns {void} No retorna ningún valor.
   */
  eliminarLineaCaptura(): void {
    if (this.lineaCapturaSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_ERROR_SELECCIONE_REGISTRO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: MSG_ALERTA_ELIMINAR_ELEMENTO,
      cerrar: false,
      txtBtnAceptar: TEXTO_ACEPTAR,
      txtBtnCancelar: TEXTO_CANCELAR,
    };
    this.procesoModal = 'linea_captura';
  }

  /**
   * Lipia el objeto de notificación y el proceso modal.
   * @returns {void} No retorna ningún valor.
   */
  limpiarNotificacion(): void {
    this.nuevaNotificacion = null;
    this.procesoModal = '';
  }

  /**
   * @description Valida el ID del socio comercial
   * @returns {void} No retorna ningún valor.
   */
  validarIDSocioComercial(): void {
    const ID_SOCIO_COMERCIAL: string =
      this.datosImportadorExportador.get('idSocioComercial')?.value;

    if (ID_SOCIO_COMERCIAL && ID_SOCIO_COMERCIAL) {
      this.socioComercial
        .getSocioComercial(ID_SOCIO_COMERCIAL)
        .pipe(
          takeUntil(this.destroyNotifier$),
          tap((response) => {
            if (!response.datos) {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: TITULO_MODAL_AVISO,
                mensaje: MSJ_ERROR_ID_SOCIO_COMERCIAL,
                cerrar: false,
                txtBtnAceptar: TEXTO_CERRAR,
                txtBtnCancelar: CAMPO_VACIO,
              };
              return EMPTY;
            }
            this.tramite5701Store.setBlnSocioComercial(response.datos);
            return response;
          }),
          catchError((_error) => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSJ_ERROR_ID_SOCIO_COMERCIAL,
              cerrar: false,
              txtBtnAceptar: TEXTO_CERRAR,
              txtBtnCancelar: CAMPO_VACIO,
            };
            return EMPTY; // Evita que el error se propague
          })
        )
        .subscribe();

      this.setValoresStore(
        this.datosImportadorExportador,
        'idSocioComercial',
        'setIdSocioComercial'
      );
    }
  }

  /**
   * @description Desactiva los select de aduana, seccion aduanera y tipo de despacho
   * @returns {void} No retorna ningún valor.
   */
  desactivarSelects(activar: boolean): void {
    this.despacho.get('idAduanaDespacho')?.[activar ? 'enable' : 'disable']();

    if (this.tipoDespacho === 'dd') {
      this.activarCatalogoTipoOperacion = activar;
      this.despacho
        .get('domicilioDespacho')
        ?.[activar ? 'enable' : 'disable']();
    }
    this.activarCatalogoDespacho = !activar;
  }

  /**
   * @desccription Detecta el cambio en el campo RFC autorizacion LDA y actualiza el store correspondiente.
   * @returns {void} No retorna ningún valor.
   */
  changeRfcAutorizacionLDA(): void {
    const RFC_AUTORIZACION_LDA = this.despacho.get('rfcDespachoLDA');

    const FECHA_INICIAL = this.datosServicio.get('fechaInicio')?.value;
    const FECHA_FINAL = this.datosServicio.get('fechaFinal')?.value;

    const MENSAJES_ERROR = {
      noFechas: MSJ_ERROR_FECHAS_NO_SELECCIONADAS,
      faltaFinal: MSJ_ERROR_FECHA_FINAL_NO_SELECCIONADA,
      faltaInicial: MSJ_ERROR_FECHA_INICIAL_NO_SELECCIONADA,
    };

    // Determinar el mensaje de error según las fechas seleccionadas
    const MENSAJE_ERROR =
      !FECHA_INICIAL && !FECHA_FINAL
        ? MENSAJES_ERROR.noFechas
        : !FECHA_FINAL
        ? MENSAJES_ERROR.faltaFinal
        : !FECHA_INICIAL
        ? MENSAJES_ERROR.faltaInicial
        : '';

    if (
      MENSAJE_ERROR &&
      RFC_AUTORIZACION_LDA?.value &&
      RFC_AUTORIZACION_LDA?.dirty
    ) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MENSAJE_ERROR,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };

      RFC_AUTORIZACION_LDA?.reset();
      RFC_AUTORIZACION_LDA?.markAsUntouched();
      return;
    }

    const HORA_FINAL = this.datosServicio.get('horaFinal')?.value ?? '00:00';
    const HORA_INICIAL = this.datosServicio.get('horaInicio')?.value ?? '00:00';

    const FECHA_INICIO = `${FECHA_INICIAL} ${HORA_INICIAL}`;
    const FECHA_FIN = `${FECHA_FINAL} ${HORA_FINAL}`;
    
    // Validar que el estado de la patente esté disponible
    const TIPO_PATENTE = this.solicitudState?.patente?.tipo_patente || '';

    const BODY: BodyValidarRFCAutorizacionLDA = {
      rfc_lda: RFC_AUTORIZACION_LDA?.value || '',
      rfc_solicitante: RFC_SOLICITANTE, // Este es el rfc del solicitante, el que vamos a tomar del store
      fecha_inicio: FECHA_INICIO,
      fecha_fin: FECHA_FIN,
      tipo_patente: TIPO_PATENTE,
    };

    if (RFC_AUTORIZACION_LDA?.value) {
      this.validaDespachosService
        .validaRFCAutorizacionLda(BODY)
        .pipe(
          takeUntil(this.destroyNotifier$),
          tap((response) => {
            if (response.datos && response.datos.length > 0) {
              // RFC is authorized - enable controls without showing error
              this.despacho.get('idAduanaDespacho')?.enable();
              this.despacho.get('tipoDespacho')?.enable();
              this.activarCatalogoDespacho = false;
            } else {
              
              this.despacho.get('idAduanaDespacho')?.enable();
              this.despacho.get('tipoDespacho')?.enable();
              this.activarCatalogoDespacho = false;
            }

            this.setValoresStore(
              this.despacho,
              'rfcDespachoLDA',
              'setAutorizacionLDA'
            );
          }),
          catchError((_error) => {
            this.despacho.get('idAduanaDespacho')?.enable();
            this.despacho.get('tipoDespacho')?.enable();
            this.activarCatalogoDespacho = false;

            return EMPTY; // Evita que el error se propague
          })
        )
        .subscribe();
    }
  }

  /**
   * @description Detecta el cambio en el campo folio DDEX y actualiza el store correspondiente.
   * @returns {void} No retorna ningún valor.
   */
  changeFolioDDEX(): void {
    const FOLIO_DDEX = this.despacho.get('folioDDEX');
    this.setValoresStore(this.despacho, 'folioDDEX', 'setAutorizacionDDEX');

    const FECHA_INICIAL = this.datosServicio.get('fechaInicio')?.value;
    const FECHA_FINAL = this.datosServicio.get('fechaFinal')?.value;

    const MENSAJES_ERROR = {
      noFechas: MSJ_ERROR_FECHAS_NO_SELECCIONADAS,
      faltaFinal: MSJ_ERROR_FECHA_FINAL_NO_SELECCIONADA,
      faltaInicial: MSJ_ERROR_FECHA_INICIAL_NO_SELECCIONADA,
    };

    // Determinar el mensaje de error según las fechas seleccionadas
    const MENSAJE_ERROR =
      !FECHA_INICIAL && !FECHA_FINAL
        ? MENSAJES_ERROR.noFechas
        : !FECHA_FINAL
        ? MENSAJES_ERROR.faltaFinal
        : !FECHA_INICIAL
        ? MENSAJES_ERROR.faltaInicial
        : '';

    if (MENSAJE_ERROR && FOLIO_DDEX?.value && FOLIO_DDEX?.dirty) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MENSAJE_ERROR,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };

      FOLIO_DDEX?.setValue(null);
      FOLIO_DDEX?.markAsUntouched();
      return;
    }

    if (FOLIO_DDEX?.hasError('pattern')) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSJ_ERROR_FOLIO_DDEX,
        cerrar: false,
        txtBtnAceptar: TEXTO_CERRAR,
        txtBtnCancelar: '',
      };

      this.despacho.get('idAduanaDespacho')?.enable();
      this.despacho.get('domicilioDespacho')?.enable();
      FOLIO_DDEX?.reset();
      FOLIO_DDEX?.markAsUntouched();
      return;
    }

    if (FOLIO_DDEX?.value) {
      this.validaDespachosService
        .validaRFCAutorizacionDDEX(FOLIO_DDEX?.value)
        .pipe(
          takeUntil(this.destroyNotifier$),
          tap((response) => {
            if (response.datos) {
              this.despacho.get('idAduanaDespacho')?.enable();
              this.despacho.get('tipoOperacion')?.enable();

              this.activarCatalogoDespacho = false;
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: TITULO_MODAL_AVISO,
                mensaje: MSJ_ERROR_FOLIO_DDEX,
                cerrar: false,
                txtBtnAceptar: TEXTO_CERRAR,
                txtBtnCancelar: '',
              };
              this.despacho.get('idAduanaDespacho')?.enable();
              this.despacho.get('domicilioDespacho')?.enable();
            }
          }),
          catchError((_error) => {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSJ_ERROR_FOLIO_DDEX,
              cerrar: false,
              txtBtnAceptar: TEXTO_CERRAR,
              txtBtnCancelar: '',
            };
            this.despacho.get('idAduanaDespacho')?.enable();
            this.despacho.get('domicilioDespacho')?.enable();
            return EMPTY; // Evita que el error se propague
          })
        )
        .subscribe();
    }
  }

  /**
   * @description Limpia los datos previos del RFC antes de cargar nueva información.
   * Este método se asegura de que no persistan datos del RFC anterior.
   * @returns {void} No retorna ningún valor.
   */
  private limpiarDatosPreviosRFC(): void {
    // Clear only the certification-related fields but keep the RFC and name
    const EMPTY_CHECKBOX_DATA: DatosCheckInputText = {
      checkbox: false,
      texto: '',
      disabled: true,
    };

    // Reset checkbox components without clearing RFC and name
    this.checkPrograma(EMPTY_CHECKBOX_DATA);
    this.checkImmex(EMPTY_CHECKBOX_DATA);
    this.checkAutomotriz(EMPTY_CHECKBOX_DATA);

    // Clear certification flags in the form
    this.datosImportadorExportador.patchValue({
      tipoEmpresaCertificadaA: false,
      tipoEmpresaCertificadaAA: false,
      tipoEmpresaCertificadaAAA: false,
      certificacionOEA: false,
      revision: false,
    });

    // Clear certification flags in the store
    this.tramite5701Store.update({
      tipoEmpresaCertificada: '',
      certificacionOEA: false,
      revision: false,
      checkIMMEX: false,
      descripcionImmex: '',
      programa: false,
      descripcionProgramaFomento: '',
      industriaAutomotriz: false,
      descripcionIndustrialAutomotriz: '',
    });
  }

  /**
   * @description Desactiva los campos de certificaciones y limpia los valores del store.
   * @returns {void} No retorna ningún valor.
   */
  desactivaCamposCertificaciones(): void {
    this.datosImportadorExportador.patchValue({
      RFCImpExp: '',
      nombre: '',
      tipoEmpresaCertificadaA: false,
      tipoEmpresaCertificadaAA: false,
      tipoEmpresaCertificadaAAA: false,
      certificacionOEA: false,
      revision: false,
      // Clear checkbox fields and their descriptions
      programa: false,
      desProgramaFomento: '',
      checkIMMEX: false,
      desImmex: '',
      industriaAutomotriz: false,
      desIndustrialAutomotriz: '',
    });

    /** Limpia store */
    this.tramite5701Store.update({
      RFCImportadorExportador: '',
      nombre: '',
      tipoEmpresaCertificada: '',
      certificacionOEA: false,
      revision: false,

      checkIMMEX: false,
      descripcionImmex: '',

      programa: false,
      descripcionProgramaFomento: '',

      industriaAutomotriz: false,
      descripcionIndustrialAutomotriz: '',
    });

    // Reset checkbox components with proper data structure
    const EMPTY_CHECKBOX_DATA: DatosCheckInputText = {
      checkbox: false,
      texto: '',
      disabled: true,
    };

    limpiarYDeshabilitarControl('desProgramaFomento','textbox');
    limpiarYDeshabilitarControl('programa','checkbox');

    limpiarYDeshabilitarControl('desImmex','textbox');
    limpiarYDeshabilitarControl('checkIMMEX','checkbox');

    limpiarYDeshabilitarControl('desIndustrialAutomotriz','textbox');
    limpiarYDeshabilitarControl('industriaAutomotriz','checkbox');

    limpiarYDeshabilitarControl('socioComercial','checkbox');

    limpiarYDeshabilitarControl('desSocioComercial','checkbox');

    limpiarYDeshabilitarControl('idSocioComercial','textbox');

    limpiarYDeshabilitarControl('desNumeroRegistro','textbox', true);

    // Reset each checkbox component programmatically
    this.checkPrograma(EMPTY_CHECKBOX_DATA);
    this.checkImmex(EMPTY_CHECKBOX_DATA);
    this.checkAutomotriz(EMPTY_CHECKBOX_DATA);

    // Deshabilitar todos los checkboxes de tipo empresa certificada
    this.tipoEmpresaCertificadaADisabled = true;
    this.tipoEmpresaCertificadaAADisabled = true;
    this.tipoEmpresaCertificadaAAADisabled = true;
    this.certificacionOEADisabled = true;
    this.revisionDisabled = true;
    this.certificacionesDisabled = true;
  }

  // eslint-disable-next-line class-methods-use-this
  cambiosInput(campo: string, form: FormGroup): void {
    const CONTROL = form.get(campo);
    if (CONTROL?.value === '') {
      CONTROL.markAsTouched(); // Para que se dispare la clase de error
      CONTROL.updateValueAndValidity(); // Revalida el campo
    }
  }

  /**
   * Valida horario de hora inicio y fecha inicio si hay aduana seleccionada
   */
  validaHorarioFechaInicio(): void {
    const FECHA_INICIO = this.datosServicio.get('fechaInicio')?.value;
    const HORA_INICIO = this.datosServicio.get('horaInicio')?.value;
    const ID_ADUANA_VALUE = this.despacho.get('idAduanaDespacho')?.value;
    const TIPO_OPERACION_VALUE = this.despacho.get('tipoOperacion')?.value;
    
    // Validar que todos los campos necesarios estén presentes y sean válidos
    if (!FECHA_INICIO || !HORA_INICIO || !ID_ADUANA_VALUE || !TIPO_OPERACION_VALUE ||
        ID_ADUANA_VALUE === '-1' || TIPO_OPERACION_VALUE === '-1') {
      return;
    }
    
    const ID_ADUANA = parseInt(ID_ADUANA_VALUE, 10);
    const TIPO_OPERACION = parseInt(TIPO_OPERACION_VALUE, 10);
    
    // Validar que la conversión a número sea exitosa
    if (isNaN(ID_ADUANA) || isNaN(TIPO_OPERACION) || ID_ADUANA <= 0 || TIPO_OPERACION <= 0) {
      return;
    }

    const FECHA_FORMATO = FECHA_INICIO.split('-');
    
    // Validar que la fecha tenga el formato correcto
    if (FECHA_FORMATO.length !== 3) {
      return;
    }

    const FECHA_FORMATO_BODY = `${FECHA_FORMATO[2]}/${FECHA_FORMATO[1]}/${FECHA_FORMATO[0]}`;

    const BODY_VALIDAR_HORARIO: BodyValidaHorario = {
      fecha: FECHA_FORMATO_BODY,
      horario: HORA_INICIO,
      cve_aduana: ID_ADUANA.toString(),
      id_seccion: this.despacho.get('idSeccionDespacho')?.value || '',
      tipo_operacion: TIPO_OPERACION.toString(),
    };

    this.validaHorarioService
      .postValidaHorario(BODY_VALIDAR_HORARIO)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((response) => {
          if (!response.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'success',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSJ_FECHA_DENTRO_DE_HORARIO_ADUANA,
              cerrar: false,
              txtBtnAceptar: TEXTO_ACEPTAR,
              txtBtnCancelar: CAMPO_VACIO,
            };
          }
        }),
        catchError((error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: TITULO_MODAL_AVISO,
            mensaje:
              error.error?.mensaje || MSJ_FECHA_DENTRO_DE_HORARIO_ADUANA,
            cerrar: false,
            txtBtnAceptar: TEXTO_CERRAR,
            txtBtnCancelar: CAMPO_VACIO,
          };
          return EMPTY;
        })
      )
      .subscribe();
  }

  /**
   * Validar si el rfc tiene encargo conferido
   */
  changeTipoOperacion(): void {
    this.setValoresStore(this.despacho, 'tipoOperacion', 'setTipoOperacion');
    
    const RFC_VALUE = this.datosImportadorExportador.get('RFCImpExp')?.value;
    const TIPO_OPERACION_VALUE = this.despacho.get('tipoOperacion')?.value;
    
    // Solo validar si ambos campos tienen valores válidos
    if (!RFC_VALUE || !TIPO_OPERACION_VALUE || TIPO_OPERACION_VALUE === '-1') {
      return;
    }
    
    const BODY: BodyValidarEncargoConferido = {
      rfc: RFC_VALUE,
      tipoOperacion: TIPO_OPERACION_VALUE,
    };
    
    this.encargoConferidoService
      .getEncargoConferido(BODY)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((response) => {
          if (response.datos && BODY.tipoOperacion === TIPO_ENUM.IMPORTACION) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSJ_NO_RELACION_ENCARGO_CONFERIDO,
              cerrar: false,
              txtBtnAceptar: TEXTO_CERRAR,
              txtBtnCancelar: CAMPO_VACIO,
            };
          }
        }),
        catchError((_error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: TITULO_MODAL_AVISO,
            mensaje: MSJ_NO_RELACION_ENCARGO_CONFERIDO,
            cerrar: false,
            txtBtnAceptar: TEXTO_CERRAR,
            txtBtnCancelar: CAMPO_VACIO,
          };
          return EMPTY;
        })
      )
      .subscribe();
  }

  /**
   * Limpia las fechas del formulario de datos del servicio.
   * Si la fecha final está vacía, se marca como no tocada y príst
   */
  limpiarFechas(): void {
    const FECHA = this.datosServicio.get('fechaFinal');

    if (FECHA?.value === '') {
      this.datosServicio.get('fechaFinal')?.markAsUntouched();
      this.datosServicio.get('fechaFinal')?.markAsPristine();
    }
  }

  /**
   * Obtiene las secciones aduaneras y recintos catalogados para una aduana específica.
   */
  obtenerSeccionRecinto(aduana: string): Observable<{
    seccionAduanera: Catalogos[];
    recintoCatalogo: Recinto[];
  }> {
    return this.seccionAduanaService.getListaSeccionesAduanas(aduana).pipe(
      map((response) => {
        const SECCION_ADUANERA = response.datos.map((seccion) => ({
          ...seccion,
          title: seccion.descripcion,
          descripcion:
            seccion.descripcion.length > 28
              ? `${seccion.descripcion.substring(0, 28)}...`
              : seccion.descripcion,
        }));
        return SECCION_ADUANERA;
      }),
      switchMap((SECCION_ADUANERA) =>
        this.recintoService.getListaRecintos(aduana).pipe(
          map((responseRecinto) => {
            const RECINTO_CATALOGO = responseRecinto.datos.map((recinto) => ({
              ...recinto,
              title: recinto.nombre,
              descripcion:
                recinto.descripcion.length > 28
                  ? `${recinto.descripcion.substring(0, 28)}...`
                  : recinto.descripcion,
            }));

            return {
              seccionAduanera: SECCION_ADUANERA,
              recintoCatalogo: RECINTO_CATALOGO,
            };
          })
        )
      )
    );
  }

  /**
   * Muestra un modal de confirmación para eliminar una solicitud.
   * @returns {void} No retorna ningún valor.
   */
  eliminarSolicitud(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: CONFIRMAR_ELIMINAR_SOLICITUD,
      cerrar: false,
      tamanioModal: 'md',
      txtBtnAceptar: TEXTO_ELIMINAR_SOLICITUD,
      txtBtnCancelar: TEXTO_CERRAR,
    };
    this.procesoModal = 'eliminar_solicitud';
  }

  /**
   * Petición para eliminar una solicitud.
   * {number} idSolicitud - ID de la solicitud a eliminar.
   */
  peticionEliminarSolicitud(idSolicitud: number): void {
    this.guardarSolicitudService
      .deleteSolicitud(idSolicitud)
      .pipe(
        takeUntil(this.destroyNotifier$),
        tap((response) => {
          if (response.datos) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'success',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: 'Solicitud eliminada correctamente',
              cerrar: false,
              txtBtnAceptar: TEXTO_CERRAR,
              txtBtnCancelar: CAMPO_VACIO,
            };
            this.tramite5701Store.limpiarSolicitud();
            this.router.navigate(['/seleccion-tramite']);
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: 'MSJ_ERROR_ELIMINAR_SOLICITUD',
              cerrar: false,
              txtBtnAceptar: TEXTO_CERRAR,
              txtBtnCancelar: CAMPO_VACIO,
            };
          }
        }),
        catchError((_error) => {
          this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: TITULO_MODAL_AVISO,
            mensaje: 'MSJ_ERROR_ELIMINAR_SOLICITUD',
            cerrar: false,
            txtBtnAceptar: TEXTO_CERRAR,
            txtBtnCancelar: CAMPO_VACIO,
          };
          return EMPTY;
        })
      )
      .subscribe();
  }
}
