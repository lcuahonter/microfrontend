import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { MapResponseDatos, ProgramasReporte } from '../../models/programas-reporte.model';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Solicitud150101State, Solicitud150101Store } from '../../estados/solicitud150101.store';
import { Subject, map, takeUntil } from 'rxjs';
import {DatosDeReporteAnnualComponent} from '../../components/datos-de-reporte-anual/datos-de-reporte-anual.component';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ProgramasReporteAnnualComponent} from '../../components/programas-reporte-anual/programas-reporte-anual.component';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';

/**
 * @component
 * @description Componente que maneja los datos del solicitante y la lógica del formulario para el trámite 150101.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss'
})
export class DatosComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    });
  }

  /**
   * Índice actual del subtítulo seleccionado en la interfaz.
   */
  indice: number = 1;

  /**
 * Indica si la fila de informe está seleccionada.
 */
  estaHabilitado: boolean = false;

  /**
   * Estado de la consulta, utilizado para manejar el estado del formulario.
   */
  public consultaState!: ConsultaioState;

  /** 
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;
  
    /**
     * Referencia al componente `CertificadoOrigenComponent`.
     */
    @ViewChild('datosDeComp', { static: false }) datosDeComp: DatosDeReporteAnnualComponent | undefined;
  
    /**
     * Referencia al componente `CertificadoOrigenComponent`.
     */
    @ViewChild('programasDeComp', { static: false }) programasDeComp: ProgramasReporteAnnualComponent | undefined;
    
    /**
   * Emite evento cuando se cambia de tab para ocultar error message.
   */
   @Output() cambioDePestana = new EventEmitter<void>();

   @Input() solicitudState!: Solicitud150101State;
   /** 
    * Arreglo que contiene los datos de los programas de reporte. 
    */
    public tablaDatos: ProgramasReporte[] = [];


  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**  
   * Indica si se debe mostrar la pestaña de datos.
   */
  public mostrarTab: boolean = true;

  /**
   * Constructor del componente PasoUnoComponent.
   * @param consultaQuery consultaQuery para obtener el estado de la consulta.
   * @param solicitud150101Store solicitud150101Store para manejar el estado del trámite.
   * @param solicitudService solicitudService para realizar operaciones relacionadas con la solicitud.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitud150101Store: Solicitud150101Store,
    private solicitudService: SolicitudService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.mostrarTab = !seccionState.readonly;
        })
      )
      .subscribe();

    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Método para guardar los datos del formulario.
   * Realiza una llamada al servicio `solicitudService` para obtener los datos del registro de solicitud.
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUD = this.consultaState.id_solicitud;
    this.solicitudService
      .getRegistroSolicitudDatos(ID_SOLICITUD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        const API_RESPONSE = doDeepCopy(resp);
        if (esValidObject(API_RESPONSE.datos)) {
          this.esDatosRespuesta = true;
          const DATOS: MapResponseDatos = this.mapToCorrectResponse(API_RESPONSE.datos);
          this.tablaDatos = [...this.tablaDatos,{
              folioPrograma: DATOS.folioPrograma,
              modalidad: DATOS.modalidad,
              tipoPrograma: DATOS.tipoPrograma,
              estatus: DATOS.estatus,
              idProgramaCompuesto: DATOS.idProgramaCompuesto
          }];
          const RESP_WITH_STRING_EXPORTACIONES = {
            ...DATOS,
            totalExportaciones:
              DATOS.totalExportaciones !== undefined &&
              DATOS.totalExportaciones !== null
                ? String(DATOS.totalExportaciones)
                : '',
            idSolicitud: 0,
            idProgramaCompuesto: String(DATOS.idProgramaCompuesto ?? '')
          };
          this.getFilaDeInformeSeleccionada(true);
          this.solicitud150101Store.setRegistroSolicitudAnualState(
            RESP_WITH_STRING_EXPORTACIONES
          );
        }
      });
  }


  /** 
   * Mapea los datos recibidos del servidor a la estructura correcta esperada por el formulario.
   * 
   * @param datos - Datos recibidos del servidor.
   * @returns Objeto con la estructura correcta para el formulario.
   */
private mapToCorrectResponse(datos: unknown): MapResponseDatos {
  const MAP_RESPOSNSE = datos as {
    solicitudDatosGenerales?: {
      ideGenerica1?: string;
      ideGenerica2?: string;
      observaciones?: string;
      descripcion?: string;
      descripcionClobGenerica1?: string;
      descClobGenerica2?: string;
    };
    reporteAnual?: {
      ventasTotales?: string;
      totalExportaciones?: number;
      totalImportaciones?: number;
    };
  };
  return {
    reporteAnualFechaInicio: MAP_RESPOSNSE.solicitudDatosGenerales?.ideGenerica1 ?? '',
    reporteAnualFechaFin: MAP_RESPOSNSE.solicitudDatosGenerales?.ideGenerica2 ?? '',
    folioPrograma: `${MAP_RESPOSNSE.solicitudDatosGenerales?.observaciones}, ${MAP_RESPOSNSE.solicitudDatosGenerales?.descripcion}` || '',
    modalidad: MAP_RESPOSNSE.solicitudDatosGenerales?.descripcionClobGenerica1 ?? '',
    tipoPrograma: MAP_RESPOSNSE.solicitudDatosGenerales?.descClobGenerica2 ?? '',
    estatus: '',
    ventasTotales: MAP_RESPOSNSE.reporteAnual?.ventasTotales ?? '',
    totalExportaciones: MAP_RESPOSNSE.reporteAnual?.totalExportaciones ?? 0,
    totalImportaciones: MAP_RESPOSNSE.reporteAnual?.totalImportaciones ?? 0,
    saldo: 0,
    porcentajeExportacion: 0,
    idProgramaCompuesto: 0,
  };
}

  /**
   * Método para actualizar el índice del subtítulo seleccionado.
   * 
   * @param i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.cambioDePestana.emit();
  }

  /**
   * Método para obtener el estado de la fila de informe seleccionada.
   * Actualiza el valor de `estaHabilitado` con el valor del evento.
   */
  getFilaDeInformeSeleccionada(evento: boolean): void {
    if (evento) {
      this.estaHabilitado = evento;
    }
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
     
    }
    else if(this.indice===2&& this.programasDeComp?.periodoReporteAnual.get('estatus')?.value!==''){
      this.programasDeComp?.showAlert();
      return 5;
    } else if (this.indice===1 && this.solicitudState.folioPrograma ==='' && this.solicitudState.totalExportaciones === '') {
      return 5;
    }
     return 0;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
