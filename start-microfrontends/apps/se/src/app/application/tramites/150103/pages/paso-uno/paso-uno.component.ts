import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { doDeepCopy, esValidObject, FormularioDinamico, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Solicitud150103State, Solicitud150103Store } from '../../estados/solicitud150103.store';
import { Subject,map, takeUntil } from 'rxjs';
import { DatosDeReporteAnualComponent } from '../../components/datos-de-reporte-anual/datos-de-reporte-anual.component';
import { InformeAnualProgramaService } from '../../services/informe-anual-programa.service';
import { ProgramasReporteAnualComponent } from '../../components/programas-reporte-anual/programas-reporte-anual.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Solicitud150103Query } from '../../estados/solicitud150103.query';

/**
 * Interfaz que representa la estructura de los datos generales de una solicitud.
 */
interface SolicitudDatosGenerales {
  ideGenerica1?: string;
  ideGenerica2?: string;
  observaciones?: string;
  descripcion?: string;
  descripcionClobGenerica1?: string;
  descClobGenerica2?: string;
  estatus?: string;
}

/**
 * Interfaz que representa la estructura de un reporte anual.
 */
interface ReporteAnual {
  ventasTotales?: number;
  totalExportaciones?: number;
  totalImportaciones?: number;
  saldo?: number;
  porcentajeExportacion?: number;
}

/**
 * Interfaz que representa la estructura de un bien producido.
 */
interface BienProducido {
  idBienesProducidos?: number;
  claveSector?: string;
  sector?: string;
  cveFraccion?: string;
  unidadMedida?: string;
  totalBienesProducidos?: number;
  volumenMercadoNacional?: number;
  volumenExportaciones?: number;
}

/**
 * Interfaz que representa la estructura de response datos.
 */
interface MapResponseDatos {
  inicio: string;
  fin: string;
  folioPrograma: string;
  modalidad: string;
  tipoPrograma: string;
  estatus: string;
  ventasTotales: number;
  totalExportaciones: number;
  totalImportaciones: number;
  saldo: number;
  porcentajeExportacion: number;
  idProgramaCompuesto: number;
}

/**
 * Componente que representa el primer paso del trámite.
 *
 * Este componente agrupa los subcomponentes de solicitante, datos de la solicitud,
 * pago de derechos, terceros relacionados y trámites asociados, y administra la
 * navegación entre las pestañas del asistente.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  
})
export class PasoUnoComponent implements AfterViewInit,OnInit,OnDestroy {

  /**
   * Constructor del componente.
   *
   * Se utiliza para la inyección de dependencias.
   */
  constructor(
    public solicitud150103Store: Solicitud150103Store,
    public solicitud150103Query: Solicitud150103Query,
    public informaAnualPrograma: InformeAnualProgramaService,
    public consultaQuery: ConsultaioQuery,
  ) {
     
  }

  /**
   * Referencia al componente de Solicitante.
   *
   * Se utiliza para acceder a métodos y propiedades del SolicitanteComponent.
   */
  @ViewChild(SolicitanteComponent)
  solicitante!: SolicitanteComponent;

  /**
   * Tipo de persona seleccionada.
   *
   * Representa el tipo de persona (por ejemplo, física o moral) que se selecciona.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona.
   *
   * Es un arreglo de objetos de tipo FormularioDinamico que define los campos y validaciones
   * para el formulario de persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   *
   * Es un arreglo de objetos de tipo FormularioDinamico que define los campos y validaciones
   * para el formulario del domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña actual del asistente.
   */
  indice: number = 1;
  
/**
 * Indica si el botón o funcionalidad está habilitado.
 */
estaHabilitado: boolean = false;
/**
 * @property {boolean} esDatosRespuesta
 * @description Indica si los datos de respuesta están disponibles para el formulario.
 * @default false
 */
public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!:ConsultaioState;

  /** Estado de la solicitud 150103 que se obtiene del store. */
  @Input() solicitudState!: Solicitud150103State;
  /**
   * Referencia al componente `CertificadoOrigenComponent`.
   */
  @ViewChild('datosDeComp', { static: false }) datosDeComp: DatosDeReporteAnualComponent | undefined;

  /**
   * Referencia al componente `CertificadoOrigenComponent`.
   */
  @ViewChild('programasDeComp', { static: false }) programasDeComp: ProgramasReporteAnualComponent | undefined;

  /** Arreglo que contiene los datos de los programas de reporte. */
  public tablaDatos: any[] = [];

  /** Arreglo que contiene los datos de los bienes producidos. */
  public mostrarBienesProducidos: any[] = [];

  /**  
   * Indica si se debe mostrar la pestaña de datos.
   */
  public mostrarTab: boolean = true;
    
  /**
   * Método del ciclo de vida que se ejecuta después de la inicialización de la vista.
   *
   * Inicializa las configuraciones de los formularios dinámicos y establece el tipo de persona
   * en el componente Solicitante.
   */
  ngAfterViewInit(): void {
    // Llama al método del componente Solicitante para establecer el tipo de persona.
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }
  
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
        this.consultaState = seccionState;
        this.solicitud150103Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
        this.mostrarTab = !seccionState.readonly;
      })).subscribe();
      if(this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUD = this.consultaState.id_solicitud;
    this.informaAnualPrograma
      .guardarDatosFormulario(ID_SOLICITUD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        const API_RESPONSE = doDeepCopy(resp);
        if (esValidObject(API_RESPONSE.datos)) {
          this.esDatosRespuesta = true;
          const DATOS = this.mapResponseFromDatos(API_RESPONSE.datos);
          this.tablaDatos = [...this.tablaDatos, {
            folioPrograma: DATOS.folioPrograma,
            modalidad: DATOS.modalidad,
            tipoPrograma: DATOS.tipoPrograma,
            estatus: DATOS.estatus,
            idProgramaCompuesto: String(DATOS.idProgramaCompuesto)
          }];
          const RESP_DATOS: Solicitud150103State = {
            ...DATOS,
            idSolicitud: 0,
            ventasTotales: String(DATOS.ventasTotales ?? ''),
            totalExportaciones: String(DATOS.totalExportaciones ?? ''),
            totalImportaciones: String(DATOS.totalImportaciones ?? ''),
            saldo: String(DATOS.saldo ?? ''),
            porcentajeExportacion: String(DATOS.porcentajeExportacion ?? ''),
            indiceDeRegistroDelPrograma: 0
          };
          this.informaAnualPrograma.actualizarEstadoFormulario(RESP_DATOS);
          this.getFilaDeInformeSeleccionada(true);
        } 
      });
  }

  /**
   * Maps the received response to the required correct response format.
   * @param resp The response object to map.
   * @returns The mapped object in the correct response format.
   */
  mapResponseFromDatos(datos: unknown): MapResponseDatos {
    const API_DATOS = (datos || {}) as {
      solicitudDatosGenerales?: SolicitudDatosGenerales;
      reporteAnual?: ReporteAnual;
      bienesProducidos?: BienProducido[];
    };
    const GENERALES = API_DATOS.solicitudDatosGenerales || {};
    const REPORTE = API_DATOS.reporteAnual || {};
    const BIENES_PRODUCIDOS = API_DATOS.bienesProducidos || [];
    
    this.mostrarBienesProducidos = [...this.mostrarBienesProducidos, {
      bienProducido: String(BIENES_PRODUCIDOS[0]?.idBienesProducidos || ''),
      claveSector: String(BIENES_PRODUCIDOS[0]?.claveSector || ''),
      sector: String(BIENES_PRODUCIDOS[0]?.sector || ''),
      fraccion: String(BIENES_PRODUCIDOS[0]?.cveFraccion || ''),
      unidadMedida: String(BIENES_PRODUCIDOS[0]?.unidadMedida || ''),
      totalBienesProducidos: String(BIENES_PRODUCIDOS[0]?.totalBienesProducidos || ''),
      mercadoNacional: String(BIENES_PRODUCIDOS[0]?.volumenMercadoNacional || ''),
      exportaciones: String(BIENES_PRODUCIDOS[0]?.volumenExportaciones || ''),
    }];
      const folioPrograma = [GENERALES.observaciones, GENERALES.descripcion].filter(Boolean).join(', ') || '';
      const RESULT = {
      inicio: GENERALES.ideGenerica1 || '',
      fin: GENERALES.ideGenerica2 || '',
      folioPrograma: folioPrograma,
      modalidad: GENERALES.descripcionClobGenerica1 || '',
      tipoPrograma: GENERALES.descClobGenerica2 || '',
      estatus: GENERALES.estatus || '',
      ventasTotales: Number(REPORTE.ventasTotales) || 0,
      totalExportaciones: Number(REPORTE.totalExportaciones) || 0,
      totalImportaciones: Number(REPORTE.totalImportaciones) || 0,
      saldo: Number(REPORTE.saldo) || 0,
      porcentajeExportacion: Number(REPORTE.porcentajeExportacion) || 0,
      idProgramaCompuesto: 0
    };
    
    this.solicitud150103Store.actualizarInicio(RESULT.inicio);
    this.solicitud150103Store.actualizarFin(RESULT.fin);
    this.solicitud150103Store.actualizarFolioPrograma(RESULT.folioPrograma);
    this.solicitud150103Store.actualizarModalidad(RESULT.modalidad);
    this.solicitud150103Store.actualizarTipoPrograma(RESULT.tipoPrograma);
    this.solicitud150103Store.actualizarEstatus(RESULT.estatus);
    
    return RESULT;
  }

  /**
   * Selecciona una pestaña del asistente.
   *
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Actualiza el estado de habilitación basado en el evento recibido.
   *
   * Este método se ejecuta cuando se selecciona una fila del informe y
   * actualiza la propiedad `estaHabilitado` según el valor del evento.
   *
   * @param evento Valor booleano que indica si la fila ha sido seleccionada.
   */
  getFilaDeInformeSeleccionada(evento: boolean): void {
    if (evento) {
      this.estaHabilitado = evento;
    }
  }  

  /**
   * Valida todos los formularios del componente.
   * @returns true si todos los formularios son válidos, false en caso contrario.
   */
  validarFormularios(): boolean {
    if (!this.solicitante) {
      return false;
    }
    
    // Por ahora retornamos true ya que el componente SolicitanteComponent
    // maneja su propia validación internamente
    return true;
  }

  /**
   * Valida todos los formularios del paso uno.
   * 
   * Este método valida principalmente el formulario de solicitante que es el único
   * obligatorio. Los otros formularios solo se validan si están disponibles.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario.
   */
  public validarTodosLosFormularios(): number {
    if (this.indice >= 2 && this.datosDeComp && this.datosDeComp.formReporteAnnual) {
      this.datosDeComp.formReporteAnnual.markAllAsTouched();
      if((this.datosDeComp.formReporteAnnual.get('ventasTotales')?.value===''||this.datosDeComp.formReporteAnnual.get('ventasTotales')?.value===null) &&(this.datosDeComp.formReporteAnnual.get('totalExportaciones')?.value===null||this.datosDeComp.formReporteAnnual.get('totalExportaciones')?.value==='')){
        return 1;
      }
      else if((this.datosDeComp.formReporteAnnual.get('ventasTotales')?.value===''||this.datosDeComp.formReporteAnnual.get('ventasTotales')?.value===null) &&this.datosDeComp.formReporteAnnual.get('totalExportaciones')?.value>=0){
        this.datosDeComp.diferenciaTotal();
        return 2;

      }
      else if(Number(this.datosDeComp.formReporteAnnual.get('ventasTotales')?.value) < Number(this.datosDeComp.formReporteAnnual.get('totalExportaciones')?.value)){
       this.datosDeComp.diferenciaTotal();
        return 3;
      }
      else if(this.datosDeComp.formReporteAnnual.get('ventasTotales')?.value>=0 && (this.datosDeComp.formReporteAnnual.get('totalExportaciones')?.value===null||this.datosDeComp.formReporteAnnual.get('totalExportaciones')?.value==='')){
        return 4;
      }
     
    } else if(this.indice===2&& this.programasDeComp?.formProgrmasReporte.get('estatus')?.value!==''){
      this.programasDeComp?.showAlert();
      return 5;
    } else if (this.indice===1 && this.solicitudState.folioPrograma ==='' && this.solicitudState.totalExportaciones === '') {
      return 5;
    }
     return 0;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); 
    this.destroyNotifier$.complete(); 
  }
}