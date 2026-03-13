import { BienesProducidos, MapResponseDatos, ProgramasReporte } from '../../models/programas-reporte.model';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject } from "@ng-mf/data-access-user";
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DatosDeReporteAnnualComponent } from '../../components/datos-de-reporte-annual/datos-de-reporte-annual.component';
import { ProgramasReporteAnnualComponent } from '../../components/programas-reporte-annual/programas-reporte-annual.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';


/**  -------------------- INTERFACE ------------------------- */
/**
 * Representa la estructura de un reporte de programas.
 * */
    interface SolicitudDatosGenerales {
      ideGenerica1?: string;
      ideGenerica2?: string;
      observaciones?: string;
      descripcion?: string;
      descripcionClobGenerica1?: string;
      descClobGenerica2?: string;
    }

    /** Interfaz que representa la estructura del reporte anual. */
    interface ReporteAnual {
      ventasTotales?: number | string;
      totalExportaciones?: number | string;
      totalImportaciones?: number | string;
    }

    /** Interfaz que representa la estructura de un bien producido. */
    interface BienProducido {
      idBienesProducidos?: string;
      claveSector?: string;
      sector?: string;
      cveFraccion?: string;
      unidadMedida?: string;
      totalBienesProducidos?: number;
      volumenMercadoNacional?: number;
      volumenExportaciones?: number;
    }

/** -------------------- INTERFACE ------------------------- */
/**
 * @description Componente encargado de gestionar y mostrar los datos relacionados con la aplicación.
 * Implementa la interfaz `AfterViewInit` para realizar acciones adicionales después de que la vista ha sido inicializada.
 */
@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    ProgramasReporteAnnualComponent,
    DatosDeReporteAnnualComponent,
  ],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss',
})
export class DatosComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;
  /** 
   * Arreglo que contiene los datos de los bienes producidos. 
   */
  public mostrarBienesProducidos: BienesProducidos[] = [];

      /**
     * Referencia al componente `CertificadoOrigenComponent`.
     */
    @ViewChild('datosDeComp') datosDeComp!: DatosDeReporteAnnualComponent;
  
    /**
     * Referencia al componente `CertificadoOrigenComponent`.
     */
    @ViewChild('programasDeComp') programasDeComp!: ProgramasReporteAnnualComponent;
    
    /**
   * Emite evento cuando se cambia de tab para ocultar error message.
   */
   @Output() cambioDePestana = new EventEmitter<void>();
   /** Arreglo que contiene los datos de los programas de reporte. */
   public tablaDatos: ProgramasReporte[] = [];
  /**  
   * Indica si se debe mostrar la pestaña de datos.
   */
  public mostrarTab: boolean = true;

  /**
   * Constructor del componente.
   *
   * Inyecta las dependencias necesarias para consultar el estado de la solicitud y
   * acceder a los servicios relacionados con el formulario.
   *
   * @param consultaQuery - Query para obtener datos reactivos desde el estado de la solicitud.
   * @param solicitudService - Servicio que maneja operaciones relacionadas con la solicitud.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    public solicitudService: SolicitudService
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
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
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const ID_SOLICITUDE = this.consultaState.id_solicitud;
    this.solicitudService
      .guardarDatosFormulario(ID_SOLICITUDE)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        const API_RESPONSE = doDeepCopy(resp);
        if (esValidObject(API_RESPONSE.datos)) {
          this.esDatosRespuesta = true;
          const DATOS = this.mapResponseFromDatos(API_RESPONSE.datos);
          this.tablaDatos = [...this.tablaDatos,{
              folioPrograma: DATOS.folioPrograma,
              modalidad: DATOS.modalidad,
              tipoPrograma: DATOS.tipoPrograma,
              estatus: DATOS.estatus,
              idProgramaCompuesto: String(DATOS.idProgramaCompuesto)
        }];
          const RESP_DATOS = {
            ...DATOS,
            ventasTotales: String(DATOS.ventasTotales ?? ''),
            totalExportaciones: String(DATOS.totalExportaciones ?? ''),
            totalImportaciones: String(DATOS.totalImportaciones ?? ''),
            saldo: String(DATOS.saldo ?? ''),
            porcentajeExportacion: String(DATOS.porcentajeExportacion ?? '')
          }
          this.solicitudService.actualizarEstadoFormulario(RESP_DATOS);
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
    this.mostrarBienesProducidos = [...this.mostrarBienesProducidos,{
      bienProducido: String(BIENES_PRODUCIDOS[0]?.idBienesProducidos),
      claveSector: String(BIENES_PRODUCIDOS[0]?.claveSector),
      sector: String(BIENES_PRODUCIDOS[0]?.sector),
      fraccion: String(BIENES_PRODUCIDOS[0]?.cveFraccion),
      unidadMedida: String(BIENES_PRODUCIDOS[0]?.unidadMedida),
      totalBienesProducidos: String(BIENES_PRODUCIDOS[0]?.totalBienesProducidos),
      mercadoNacional: String(BIENES_PRODUCIDOS[0]?.volumenMercadoNacional),
      exportaciones: String(BIENES_PRODUCIDOS[0]?.volumenExportaciones),
    }];
    return {
      inicio: GENERALES.ideGenerica1 || '',
      fin: GENERALES.ideGenerica2 || '',
      folioPrograma: `${GENERALES.observaciones}, ${GENERALES.descripcion}` || '',
      modalidad: GENERALES.descripcionClobGenerica1 || '',
      tipoPrograma: GENERALES.descClobGenerica2 || '',
      estatus: '',
      ventasTotales: Number(REPORTE.ventasTotales) || 0,
      totalExportaciones: Number(REPORTE.totalExportaciones) || 0,
      totalImportaciones: Number(REPORTE.totalImportaciones) || 0,
      saldo: 0,
      porcentajeExportacion: 0,
      idProgramaCompuesto: 0
    };
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
   * Método para actualizar el índice del subtítulo seleccionado.
   *
   * @param i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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
    else if(this.indice===2&& this.programasDeComp?.formProgrmasReporte.get('estatus')?.value!==''){
      this.programasDeComp?.showAlert();
      return 5;
    }
    return 0;
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
