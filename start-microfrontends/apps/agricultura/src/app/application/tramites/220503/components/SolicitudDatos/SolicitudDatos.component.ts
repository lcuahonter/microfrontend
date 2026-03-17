import {
  CargarDatosIniciales,
  CarrosDeFerrocarril,
  DatosDeMercancias,
  HistorialInspeccionFisica,
  MercanciaTabla,
} from '../../models/solicitud-pantallas.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MercanciaSolicitud, SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { Subject, takeUntil } from 'rxjs';
import { CarrosDeFerrocarrilComponent } from "../../shared/carros-de-ferrocarril/carros-de-ferrocarril.component";
import { CatalogosSelect } from '@ng-mf/data-access-user';

import { CommonModule } from '@angular/common';
import { DatosDelTramiteARealizarComponent } from '../../shared/datos-del-tramite-a-realizar/datos-del-tramite-a-realizar.component';
import { HistorialInspeccionFisicaComponent } from "../../shared/historial-inspeccion-fisica/historial-inspeccion-fisica.component";
import { MedioTransporteComponent } from '../../shared/medio-transporte/medio-transporte.component';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { PROCEDURE_ID } from '../../constantes/importador-exportador.enum';
import { ResponsableInspeccionEnPuntoComponent } from '../../shared/responsable-inspeccion-en-punto/responsable-inspeccion-en-punto.component';
import { Solicitud } from '../../../220503/models/solicitud-pantallas.model';
import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { Solicitud220503Store } from '../../estados/tramites220503.store';
import { SolicitudDatosTabComponent } from '../../shared/solicitud-datos/solicitud-datos.component';
export interface SolicitudTablaRow {
  id_solicitud: number;
  certificado?: string;
}


@Component({
  selector: 'app-solicitud-datos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SolicitudDatosTabComponent,
    DatosDelTramiteARealizarComponent,
    ResponsableInspeccionEnPuntoComponent,
    MedioTransporteComponent,
    CarrosDeFerrocarrilComponent,
    HistorialInspeccionFisicaComponent
],
  templateUrl: './SolicitudDatos.component.html',
})
export class SolicitudDatosComponent implements OnInit, OnDestroy {
  /** Grupo de formularios para manejar formularios reactivos.*/
  form: FormGroup;
  /** Encabezados y datos para mostrar información de mercancías. */
  hMercanciaTabla: string[] = [ "Fracción arancelaria", "Descripción de la fracción", "Nico", "Descripción Nico", "Cantidad solicitada en UMT", "Unidad de medida de tarifa (UMT)", "Cantidad total UMT" ];

  /** Datos de mercancías para mostrar en la tabla. */
  dMercanciaBody: DatosDeMercancias[] = [];

  /** Encabezados y datos para mostrar información de solicitud */
  hSolicitud: string[] = [];

  /** Datos de solicitud para mostrar en la tabla */
  dSolicitud: Solicitud[] = [];

  /** Información del catálogo para la selección del medio de transporte. */
mediodetransporte: CatalogosSelect = {
  labelNombre: 'Medio de transporte',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

  /** Matriz para contener datos para cada fila de la tabla */
  tableData = {
    tableBody: [],
    tableHeader: [],
  };

   /**
     * @property {number} procedimiento
     * @description
     * Almacena el identificador del procedimiento actual, asignado a partir de la
     * constante `PROCEDURE_ID`.
     * Se utiliza para asociar la lógica y las operaciones del componente con el
     * trámite correspondiente.
     *
     * @default PROCEDURE_ID (220502)
     */
    procedimiento: number = PROCEDURE_ID;

  /** Datos de vagones e historial de inspección física. */
  hCarroFerrocarril: string[] = [];

  /** Datos de vagones e historial de inspección física. */
  dCarrosDeFerrocarril: CarrosDeFerrocarril[] = [];

  /** Encabezados y datos para mostrar información de historial de inspección física. */
  hHistorialinspeccion: string[] = [];

  /** Datos de historial de inspección física para mostrar en la tabla. */
  dHistorialInspecciones: HistorialInspeccionFisica[] = [];

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  public destroyed$ = new Subject<void>();

  @ViewChild('datosDelTramiteARealizarRef') datosDelTramiteARealizar!: DatosDelTramiteARealizarComponent;

  @ViewChild('solicitudDatosTabRef') revisionDocumental!: SolicitudDatosTabComponent;

  @ViewChild('responsableInspeccionEnPuntoRef') responsableInspeccionEnPunto!: ResponsableInspeccionEnPuntoComponent;

  @ViewChild('medioTransporteRef') medioTransporte!: MedioTransporteComponent;

  /** Constructor para inyectar dependencias */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudPantallasService /**Servicio para obtener datos de solicitud */,
       private NOTIF: NotificacionesService,
         public solicitud220503Store: Solicitud220503Store,
         private solicitudQuery: Solicitud220503Query,
  ) {
    this.form = this.fb.group(
      {}
    ); /** Inicializar un grupo de formulario vacío y obtener datos de formulario utilizando formGroupName de un componente secundario. */
  }
  /** Gancho de ciclo de vida para cargar datos iniciales cuando se inicializa el componente */
  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.getCatalogoMedioTransporte('220503')
    this.getSolicitudes('220503');
    
    // Se suscribe al observable `certificadosAutorizados$` del query de solicitud.
// Este observable emite el número o identificador del certificado autorizado.
     this.solicitudQuery.certificadosAutorizados$.subscribe(value => {
        if (value) {
          this.getHistInspFisica(String(value));
           this.obtenerHistorialCarrosFerrocarri(String(value));
        }
      })
  }

  /**
   * Método para buscar y cargar datos iniciales del servicio.
   */
  cargarDatosIniciales(): void {
    this.solicitudService
      .getData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data: CargarDatosIniciales) => {
          this.hHistorialinspeccion = data.hHistorialinspeccion;
          this.hCarroFerrocarril = data.hCarroFerrocarril;
          this.hSolicitud = data.hSolicitud;
                    
        },
      });
  }

      /**
 * Obtiene historial de carros de ferrocarril desde el servicio
 * y transforma la respuesta en un formato compatible con <ng-table>.
 */
obtenerHistorialCarrosFerrocarri(certificado: string): void {
  this.solicitudService
    .obtenerHistorialCarrosFerrocarri(certificado,this.procedimiento.toString())
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {

      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }

      const DATOS = data.datos ?? [];

this.dCarrosDeFerrocarril = DATOS.map((item) => ({
  idInspeccionFisica: item.idSolicitud ?? 0,
  numeroAutorizacion: '',
  numeroPartidaMercancia: String(item.numeroPartidaMercancia),
  numeroTotalCarros: item.numTotalCarros,
  tbodyData: [
    String(item.numeroPartidaMercancia),
    String(item.numTotalCarros)
  ]
}));
    });
}


    /**
 * Obtiene el historial de inspección física desde el servicio
 * y agrega el arreglo `tbodyData` para mostrar los datos en la tabla.
 */
  getHistInspFisica(certificado: string): void {
  this.solicitudService
    .getHistorialInspeccionFisica(certificado,this.procedimiento.toString())
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {

      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }

      this.dHistorialInspecciones = data.datos.map(item => ({
        ...item,
        tbodyData: [
          item.numeroPartidaMercancia,
          item.fraccionArancelaria,
          item.nico,
          item.cantidadUmt,
          item.cantidadInspeccion,
          item.saldoPendiente,
          item.fechaInspeccionString
        ]
      }));
    });
}


  /**
 * Carga el catálogo de medios de transporte y asigna los datos
 * a la propiedad correspondiente del componente.
 *
 * @param tramite - Identificador del trámite.
 */
getCatalogoMedioTransporte(tramite: string): void {
  this.solicitudService
    .getCatalogoMedioTransporte(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.mediodetransporte.catalogos = data.datos.flat();
    });
}





/**
 * Carga la lista de solicitudes del trámite indicado
 * y las asigna a la tabla.
 */
getSolicitudes(tramite: string): void {
  this.solicitudService
    .getSolicitudesData(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      this.dSolicitud = resp.datos.map((item) => ({
         id_solicitud: item.id_solicitud, 
        fechaCreacion: SolicitudDatosComponent.formatearFecha(item.fecha_creation),
        mercancia: item.mercancia,
        cantidad: String(item.cantidad),
        proovedor: item.proveedor,
      }));
    });
}
claveSeleccionada:string=''
medioDeTransporte:string=''
onCertificadoResultado(
  event: { clave: string; medioDeTransporte?: string }
): void {
  
  // Se guarda la clave actual en el componente
  this.claveSeleccionada = event.clave;
  

  if (event.medioDeTransporte) {
      this.solicitud220503Store.setTransporteIdMedio(event.medioDeTransporte??'');
   
    this.medioDeTransporte = event.medioDeTransporte;
     this.medioTransporte?.setTransporteIdMedioForm
     
     
     
     
     (
      event.medioDeTransporte
    );
  } else {
    this.claveSeleccionada = event.clave;
  }
  this.getDatosDeMercancias('220503', this.claveSeleccionada )
}
/**
 * Formatea la fecha del backend a un formato legible.
 */
private static formatearFecha(fecha: string): string {
  return fecha
    ? new Date(fecha).toISOString().replace('T', ' ').substring(0, 19)
    : '';
}


/**
 * Carga y transforma los datos de las mercancías
 * asociadas a un certificado para mostrarlos en la tabla.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave del certificado.
 */
getDatosDeMercancias(tramite: string, clave: string): void {
  this.solicitudService
    .getMercanciaSolicitudDatos(tramite, clave)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

  this.dMercanciaBody = resp.datos.flat().map((item: MercanciaSolicitud) => ({
  fraccionArancelaria: item.fraccion_arancelaria,
  descripcionFraccion: item.descripcion_de_la_fraccion,
  nico: item.nico,
  nicoDescripcion: item.descripcion_nico,
  cantidadSolicitadaUMT: item.cant_soli_umt,
  unidadMedidaUMT: item.uni_medida_tar,
  cantidadTotalUMT: item.cant_total_umt,
  saldoPendiente: item.saldo_pendiente ?? 0,
  idMercancioGob: item.id_mercancia_gob ,
  numPermisoImportacion: item.num_permiso_importacion ?? '',
  selected: false,
}));

    
    });
     this.solicitud220503Store.setMercanciaLista(SolicitudDatosComponent.mapDatosDeMercanciasToMercanciaTabla(this.dMercanciaBody) );
}



private static mapDatosDeMercanciasToMercanciaTabla(
  data: DatosDeMercancias[]
): MercanciaTabla[] {
  return data.map((item, index) => ({

    id: index + 1,


    fraccionArancelaria: item.fraccionArancelaria,
    descripcionFraccion: item.descripcionFraccion,
    nico: item.nico,
    descripcion: item.nicoDescripcion,


    unidaddeMedidaDeUMT: item.unidadMedidaUMT,
    cantidadTotalUMT: item.cantidadTotalUMT,
    saldoPendiente: item.cantidadSolicitadaUMT,


    fraccion_arancelaria: item.fraccionArancelaria,
    descripcion_de_la_fraccion: item.descripcionFraccion,
    descripcion_nico: item.nicoDescripcion,
    uni_medida_tar: item.unidadMedidaUMT,

 
    cant_total_umt: item.cantidadTotalUMT,
    num_permiso_importacion: item.numPermisoImportacion,
    id_mercancia_gob:item.idMercancioGob,
    saldo_pendiente: item.saldoPendiente
  }));
}



  validarFormularios(): boolean {
    let isValid = true;

    if (this.datosDelTramiteARealizar) {
      if (!this.datosDelTramiteARealizar.validarFormularios()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.responsableInspeccionEnPunto) {
      if (!this.responsableInspeccionEnPunto.validarFormularios()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.medioTransporte) {
      if (!this.medioTransporte.validarFormularios()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  iniciarSolicitud(tramite: string, idSolicitudPrellenado: number | string): void {
  this.solicitudService
    .iniciarInspeccionFisica(tramite, idSolicitudPrellenado)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }
this.solicitud220503Store.hydrateFromTableSelection(resp.datos);
        
       
        this.getDatosDeMercancias('220503', resp.datos.certificado);
    });
}

handleTableSelection(row: string|number): void {
  if (!row) {
    return;
  }

  this.iniciarSolicitud('220503', row);
}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe el componente de todos los observables.
   * @returns {void}
   * */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
