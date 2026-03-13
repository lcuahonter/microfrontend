import { CommonModule } from '@angular/common';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ReplaySubject,Subscription,map, takeUntil } from 'rxjs';

import { Catalogo, ConsultaioQuery, ConsultaioState, TituloComponent } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { TableComponent } from '@libs/shared/data-access-user/src';

import { DatosDeLaSolicitudComponent, LoteResponseDto } from './datos-de-la-solicitud/datos-de-la-solicitud.component';
import { FilaData, FilaData2 } from '../models/fila-model';
import { DatosDelCafeComponent } from './datos-del-cafe/datos-del-cafe.component';
import { RegistrarSolicitudService } from '../services/registrar-solicitud.service';
import { Solicitud290201Query } from '../../../estados/queries/tramites290201.query';

import { Solicitud290201State, Solicitud290201Store } from '../../../estados/tramites/tramites290201.store';
import { CATALOGOS_CONSTANTS } from '../constants/catalogos.enum';

import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { Solicitud } from '../models/tabla-model';

/**
 * Representa un ítem de lote asociado a una mercancía.
 * Contiene información de identificación, cantidades, condiciones de almacenamiento,
 * datos comerciales, tratamiento, marcas y estatus de aceptación.
 */
export interface LoteItem {
  id_mercancia: number | string;
  id_fraccion_gob: number | string;
  generica1: string;
  cantidad_presentacion: string;
  numero_oficio_caso_especial: string;
  condicion_almacenamiento_primario: string;
  cantidad_umc: string;
  unidad_medida_comercial: string;
  importe_total_componente: string;
  moneda: string;
  numero_lote: string;
  descripcion_mercancia: string;
  boolean_generico1: boolean;
  detalles_marca: string | null;
  descripcion_otras_especificaciones: string | null;
  fecha_salida: string;
  condicion_almacenamiento_secundario: string;
  generica2: string;
  marcas_embarque: string;
  descripcion_tratamiento: string;
  aceptada: boolean;
}

/**
 * Interface que representa el Objeto de Transferencia de Datos (DTO) 
 * para la respuesta de Terceros desde el servidor.
 */
export interface TerceroResponseDto {
  id_tercero: number | null;
  persona_moral: boolean;
  nombre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  correo_electronico: string | null;
  telefono: string | null;
  calle: string | null;
  codigo_postal: string | null;
  pais_clave: string | null;
}

@Component({
  selector: 'app-datos-tramite',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TableComponent,
    DatosDelCafeComponent,
    DatosDeLaSolicitudComponent,
  ],
  templateUrl: './datosTramite.component.html',
  styleUrl: './datosTramite.component.css',
})


export class DatosTramiteComponent implements OnChanges,OnDestroy, OnInit {

  // ... tus variables actuales ...
  private submissionsSub!: Subscription; // Para manejar la suscripción

  //  MÉTODO PARA EL PADRE (validarFormulario)
  // Este método será llamado por ViewChild desde PasoUno o PantallasComponent
  public validarFormulario(): boolean {
    this.informationCafeForm.markAllAsTouched();
    const ISVALID = this.informationCafeForm.valid;
    
    // Actualizamos el store para que el componente padre sepa que esta tab es válida
    this.solicitud290201Store.update({ tabDatosTramiteValid: ISVALID });
    
    return ISVALID;
  }

/** Variable para almacenar los datos de la fila seleccionada en la tabla.*/
selectedRowData: Solicitud | null = null;

  /** Formulario para la información del café */
  informationCafeForm!: FormGroup;

  /** Estado de la información del café */
  public informationCafeState!: Solicitud290201State;

  /** Datos de la tabla */
  tableData = {
    tableBody: [],
    tableHeader: [],
  };
  
  /** Consulta de estado para la solicitud */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;
  
  /** Sujeto para manejar la destrucción del componente */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
/** 
 * @property {CatalogosSelect} tiposData
 * @description Configuración de datos para el campo "Tipos".
 */
public tiposData = CATALOGOS_CONSTANTS.TIPOS;

/** 
 * @property {CatalogosSelect} formasdelcafeData
 * @description Configuración de datos para el campo "Formas del café".
 */
public formasdelcafeData = CATALOGOS_CONSTANTS.FORMAS_DEL_CAFE;

/** 
 * @property {CatalogosSelect} calidadData
 * @description Configuración de datos para el campo "Calidad".
 */
public calidadData = CATALOGOS_CONSTANTS.CALIDAD;

/** 
 * @property {CatalogosSelect} procesosData
 * @description Configuración de datos para el campo "Procesos".
 */
public procesosData = CATALOGOS_CONSTANTS.PROCESOS;

/** 
 * @property {CatalogosSelect} certificationsData
 * @description Configuración de datos para el campo "Certificaciones".
 */
public certificationsData = CATALOGOS_CONSTANTS.CERTIFICACIONES;

/** 
 * @property {CatalogosSelect} adunadesalidaData
 * @description Configuración de datos para el campo "Aduana de salida".
 */
public adunadesalidaData = CATALOGOS_CONSTANTS.ADUANA_DE_SALIDA;

/** 
 * @property {CatalogosSelect} paisdestinoData
 * @description Configuración de datos para el campo "País destino".
 */
public paisdestinoData = CATALOGOS_CONSTANTS.PAIS_DESTINO;

/** 
 * @property {CatalogosSelect} entidaddeprocedenciaData
 * @description Configuración de datos para el campo "Entidad de procedencia".
 */
public entidaddeprocedenciaData = CATALOGOS_CONSTANTS.ENTIDAD_DE_PROCEDENCIA;

/** 
 * @property {CatalogosSelect} ciclocafetaleroData
 * @description Configuración de datos para el campo "Ciclo cafetalero".
 */
public ciclocafetaleroData = CATALOGOS_CONSTANTS.CICLO_CAFETALERO;

/** 
 * @property {CatalogosSelect} certificacionsData
 * @description Configuración de datos para el campo "Certificación".
 */
public certificacionsData = CATALOGOS_CONSTANTS.CERTIFICACION;

/** 
 * @property {Solicitud | null} prefilledData
 * @description Datos prellenados que se pueden pasar al componente para inicializar el formulario.
 * @default null
 */
@Input() prefilledData: Solicitud | null = null;

  constructor(
    /** Servicio para registrar solicitudes */
    private registrarsolicitud: RegistrarSolicitudService,

    /** Constructor del formulario */
    private fb: FormBuilder,

    /** Almacén de estado para la solicitud */
    private solicitud290201Store: Solicitud290201Store,

    /** Consulta de estado para la solicitud */
    private solicitud290201Query: Solicitud290201Query,

    /**  */
    private consultaioQuery: ConsultaioQuery,
    private NOTIF: NotificacionesService
  ) {}

  /**
 * @method onRowSelected
 * @description Maneja la selección de una fila en la tabla.
 * Actualiza la variable `selectedRowData` con los datos de la fila seleccionada
 * y prellena el formulario con dichos datos.
 * @param {Solicitud} data - Datos de la fila seleccionada.
 */
  onRowSelected(data: Solicitud): void {
    this.selectedRowData = data; 
    this.prefillForm(data); 
  }
  /** Crea el formulario para la información del café */
  createForm(): void{
    this.informationCafeForm = this.fb.group({
      datosDelTramiteRealizar: this.fb.group({
        formasdelcafe: [this.informationCafeState?.formasdelcafe, Validators.required],
        tipos: [this.informationCafeState?.tipos, Validators.required],
        calidad: [this.informationCafeState?.calidad, Validators.required],
        procesos: [this.informationCafeState?.procesos, Validators.required],
        nombredeagencia: [this.informationCafeState?.nombredeagencia, Validators.required],
        certifications: [this.informationCafeState?.certifications, Validators.required],
        adunadesalida: [this.informationCafeState?.adunadesalida, Validators.required],
        paisdestino: [this.informationCafeState?.paisdestino, Validators.required],
        entidaddeprocedencia: [this.informationCafeState?.entidaddeprocedencia, Validators.required],
        ciclocafetalero: [this.informationCafeState?.ciclocafetalero, Validators.required],
      }),
    });
  }
  public isSubmitted$ = this.solicitud290201Query.isSubmitted$;

  /** Inicializa el componente */
  ngOnInit(): void {
    this.solicitud290201Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.informationCafeState = seccionState;
        })
      )
      .subscribe();
      

    this.createForm();

    //  ESCUCHAR EL ESTADO GLOBAL DE "SUBMITTED"
    // Si el usuario da click en 'Continuar' desde otra tab, este observable 
    // se activará y marcará todos los campos en rojo inmediatamente.
this.submissionsSub = this.solicitud290201Query.isSubmitted$
  .pipe(takeUntil(this.destroyed$))
  .subscribe(submitted => {
    if (Boolean(submitted) && this.informationCafeForm) {
      
      this.informationCafeForm.markAllAsTouched();
      this.informationCafeForm.markAsDirty();

      Object.values(this.datosDelTramiteRealizar.controls).forEach(control => {
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity({ emitEvent: false });
      });
    }
  });
  
    this.getCatalogoFormasData('290201');
 
    this.getAduanadesalidaData('290201');
    this.getEntidadDeProcedenciaData('290201');
    this.getCiclocafetaleroData('290201');
    this.getPaisDestinoData('290201');
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      this.inicializarEstadoFormulario();
  }

  /**
 * @method ngOnChanges
 * @description Detecta cambios en las propiedades de entrada del componente.
 * Si hay cambios en `prefilledData` y contiene datos, prellena el formulario con dichos datos.
 * @param {SimpleChanges} changes - Cambios detectados en las propiedades de entrada.
 */
ngOnChanges(changes: SimpleChanges): void {
    if (changes['prefilledData'] && this.prefilledData) {
      this.prefillForm(this.prefilledData);
    }
}

/**
 * @method prefillForm
 * @description Prellena el formulario con los datos proporcionados.
 * Asigna valores a los campos del formulario basándose en los datos de la solicitud.
 * @param {Solicitud} data - Datos de la solicitud para prellenar el formulario.
 */

prefillForm(data: Solicitud): void {
  if (!data) {return;}


  this.datosDelTramiteRealizar.patchValue({
    formasdelcafe: data.formasdelcafe,
    adunadesalida: data.adunadesalida,
    paisdestino: data.paisdestino,
    entidaddeprocedencia: data.entidaddeprocedencia,
    nombredeagencia: data.nombredeagencia,
    ciclocafetalero: data.ciclocafetalero
  }, { emitEvent: false });


  if (data.formasdelcafe) {
    this.getTiposData('290201', data.formasdelcafe);
    this.datosDelTramiteRealizar.get('tipos')?.setValue(data.tipos);
    this.solicitud290201Store.setFormasDelCafe(data.formasdelcafe);
  }

  if (data.tipos) {
    this.getCalidadData('290201', data.tipos);
    this.datosDelTramiteRealizar.get('calidad')?.setValue(data.calidad);
    this.solicitud290201Store.setTipos(data.tipos);
  }

  if (data.calidad) {
    this.getProcesosData('290201', data.calidad);
    this.datosDelTramiteRealizar.get('procesos')?.setValue(data.procesos);
    this.solicitud290201Store.setCalidad(data.calidad);
  }

  if (data.procesos) {
    this.getCertificacionData('290201', data.procesos);
    this.datosDelTramiteRealizar.get('certifications')?.setValue(data.certifications);
    this.solicitud290201Store.setProcesos(data.procesos??'');
  }

 this.prefillTerceros(data?.terceros??[])
  this.solicitud290201Store.setCertifications(data.certifications??'');
  this.solicitud290201Store.setAdunadesalida(data.adunadesalida??'');
  this.solicitud290201Store.setPaisdestino(data.paisdestino??'');
  this.solicitud290201Store.setEntidaddeprocedencia(data.entidaddeprocedencia??'');
  this.solicitud290201Store.setCiclocafetalero(data.ciclocafetalero??'');
  this.solicitud290201Store.setNombredeagencia(data.nombredeagencia??"");



if (data.lote && data.lote.length > 0) {
  data.lote.forEach((loteItem) => {
    
      interface LOTEDATA {
      id_mercancia: number;
      numero_lote: string;
      cantidad_umc: string;
      unidad_medida_comercial: string;
      importe_total_componente: string;
      moneda: string;
      boolean_generico1: boolean;
      fecha_salida: string;
      generica1: string;
      condicion_almacenamiento_secundario: string;
      generica2: string;
      marcas_embarque: string;
      descripcion_tratamiento: string;
      cantidad_presentacion: string;
      numero_oficio_caso_especial: string;
      condicion_almacenamiento_primario: string;
      descripcion_otras_especificaciones: string;
      id_fraccion_gob: number | string;
    }

    const ITEM = loteItem as unknown as LOTEDATA;

    const MAPPED_ROW: FilaData = {
      id: Number(ITEM.id_mercancia),
      datosDelTramiteRealizar: {
      
        lote: ITEM.numero_lote ?? '',
        cantidad: ITEM.cantidad_umc ?? '',
        unidaddemedida: ITEM.unidad_medida_comercial ?? '',
        precioapplicable: ITEM.importe_total_componente ?? '',
        dolar: ITEM.moneda ?? '',
        
        elcafe: ITEM.boolean_generico1 ? '1' : '0', 
        fechaexportacion: ITEM.fecha_salida ?? '',
        Identificadordel: ITEM.generica1 ?? '',
        
        paisdetransbordo: ITEM.condicion_almacenamiento_secundario ?? '',
        mediodetransporte: ITEM.generica2 ?? '',
        otrasmarcas: ITEM.marcas_embarque ?? '',
        observaciones: ITEM.descripcion_tratamiento ?? '',

        cantidadutilizada: ITEM.cantidad_presentacion ?? '',
        numerodepedimento: ITEM.numero_oficio_caso_especial ?? '',
        paisdeimportacion: ITEM.condicion_almacenamiento_primario ?? '',
        otrasCaracteristicas: ITEM.descripcion_otras_especificaciones ?? '',
        fraccionarancelaria: ITEM.id_fraccion_gob?.toString() ?? '',

        envasadoen: '',
        utilizoCafeComo: ''
      }
    };

    this.solicitud290201Store.addOrUpdateDatosCafe(MAPPED_ROW);
  });
}
}


/**
 * @method prefillTerceros
 * @description Realiza el mapeo inverso del arreglo 'terceros' a la interfaz estricta FilaData2.
 * @param {any[]} TERCEROS_DATA - Arreglo crudo de la respuesta del backend.
 */
private prefillTerceros(TERCEROS_DATA: TerceroResponseDto[]): void {
  // 1. Limpiar la tabla en el store si no existen datos
  if (!TERCEROS_DATA || TERCEROS_DATA.length === 0) {
    this.solicitud290201Store.setDatosDeTabla([]);
    return;
  }

  // 2. Interfaz local para la estructura de datos del backend
  interface TERCERODTO {
    id_tercero: number | null;
    persona_moral: boolean;
    nombre: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    correo_electronico: string | null;
    telefono: string | null;
    calle: string | null;
    codigo_postal: string | null;
    pais_clave: string | null;
  }

  // 3. Mapeo estricto al formato FilaData2
  const MAPPED_TERCEROS: FilaData2[] = TERCEROS_DATA.map((TERCERO_ITEM) => {
    const T_ITEM = TERCERO_ITEM as unknown as TERCERODTO;
    const ES_MORAL = T_ITEM.persona_moral === true;

    return {
      id: Number(T_ITEM.id_tercero) || Math.floor(Math.random() * 1000),
      datosDelTramiteRealizar: {
        tipoPersona: ES_MORAL ? 'moral' : 'fisica',
        denominacion: ES_MORAL ? T_ITEM.nombre ?? '' : '',
        nombre: ES_MORAL ? '' : T_ITEM.nombre ?? '',
        primerApellido: T_ITEM.apellido_paterno ?? '',
        segundoApellido: T_ITEM.apellido_materno ?? '',
        domicilio: T_ITEM.calle ?? '',
        correoelectronico: T_ITEM.correo_electronico ?? '',
        
        // --- Solución para TS(2345): Propiedad obligatoria faltante ---
        pais: T_ITEM.pais_clave ?? 'MEX', 

        // --- Solución para TS(2345): Conversión de tipos (string a number) ---
        codigopostal: Number(T_ITEM.codigo_postal) || 0,
        telefono: Number(T_ITEM.telefono) || 0,

        // Campos opcionales: Asegúrate de que existan en FilaData2 o elimentalos
        rfc: '',
        curp: ''
      }
    };
  });

  // 4. Actualizar el Store con el arreglo debidamente tipado
  this.solicitud290201Store.setDatosDeTabla(MAPPED_TERCEROS);
}





  /** Obtiene los datos para el campo "Tipos" */
 getTiposData(tramite: string, claveForma: string): void {
  this.registrarsolicitud
    .getTiposData(tramite, claveForma)
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

      this.tiposData.catalogos = data.datos;
    });
}

  /** Obtiene los datos para el campo "Formas del café" */
 getCatalogoFormasData(tramite: string): void {
  this.registrarsolicitud
    .getFormasdelcafeData(tramite)
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
      this.formasdelcafeData.catalogos = data.datos;
    });
}

  /** Obtiene los datos para el campo "Calidad" */
 getCalidadData(tramite: string, claveTipos: string): void {
  this.registrarsolicitud
    .getCalidadData(tramite, claveTipos)
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

      this.calidadData.catalogos = data.datos;
    });
}

  /** Obtiene los datos para el campo "Procesos" */
  getProcesosData(tramite: string, claveCalidad: string): void {
  this.registrarsolicitud
    .getProcesosData(tramite, claveCalidad)
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

      this.procesosData.catalogos = data.datos;
    });
}

  /** Obtiene los datos para el campo "Aduana de salida" */
 getAduanadesalidaData(tramite: string): void {
  this.registrarsolicitud
    .getAduanadesalidaData(tramite)
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
      this.adunadesalidaData.catalogos = data.datos;
    });
}
  /** Obtiene los datos para el campo "Entidad de procedencia" */
 getEntidadDeProcedenciaData(tramite: string): void {
  this.registrarsolicitud
    .getEntidadDeProcedenciaData(tramite)
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

  
      this.entidaddeprocedenciaData.catalogos = data.datos;
    });
}

  /** Obtiene los datos para el campo "Ciclo cafetalero" */
 getCiclocafetaleroData(tramite: string): void {
  this.registrarsolicitud
    .getCiclocafetaleroData(tramite)
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

      this.ciclocafetaleroData.catalogos = data.datos;
    });
}
  /**
 * @method getPaisDestinoData
 * @description Obtiene los datos del catálogo "País destino" y los asigna al campo correspondiente.
 */
 getPaisDestinoData(tramite: string): void {
  this.registrarsolicitud
    .getPaisDestinoData(tramite)
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

      // Aplanar en caso de que el backend devuelva Catalogo[][]
      this.paisdestinoData.catalogos = data.datos;
    });
}

  /**
 * @method getCertificacionData
 * @description Obtiene los datos del catálogo "Certificación" y los asigna al campo correspondiente.
 */
  getCertificacionData(tramite: string, claveProcesos: string): void {
  this.registrarsolicitud
    .getCertificacionData(tramite, claveProcesos)
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

    this.certificacionsData.catalogos = data.datos;
    });
}
  
  /** Obtiene el formulario anidado "datosDelTramiteRealizar" */
  get datosDelTramiteRealizar(): FormGroup {
    return this.informationCafeForm.get('datosDelTramiteRealizar') as FormGroup;
  }

  /**
 * @method inicializarEstadoFormulario
 * @description Inicializa el estado del formulario, habilitándolo o deshabilitándolo según el modo de solo lectura.
 */
 inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.informationCafeForm?.disable();
    }
    else {
      this.informationCafeForm?.enable();
    }
}
  /**
   * Establece valores en el almacén de estado
   * @param form Formulario del cual se obtiene el valor
   * @param campo Campo del formulario
   * @param metodoNombre Método del almacén de estado
   */
   setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud290201Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud290201Store[metodoNombre] as (value: string | number | boolean) => void)(VALOR);
    this.handleCascadeChanges(campo, VALOR);

    // Actualizamos la bandera de validez de esta pestaña en el store
    this.solicitud290201Store.update({ 
        tabDatosTramiteValid: this.informationCafeForm.valid 
    });
  }
  /**
 * Maneja la carga de catálogos en cascada
 * según el campo modificado en el formulario.
 *
 * @param campo - Campo que cambió.
 * @param valor - Valor seleccionado.
 */

  private handleCascadeChanges(campo: string, valor: string ): void {
  switch (campo) {
    case 'formasdelcafe':
        this.tiposData.catalogos = [];
            this.calidadData.catalogos =[]
              this.procesosData.catalogos=[]
                    this.certificacionsData.catalogos=[]
      this.getTiposData('290201', valor);
      break;

    case 'tipos':
      this.calidadData.catalogos =[]
      this.getCalidadData('290201', valor);
      break;

     case 'calidad':
      this.procesosData.catalogos=[]
      this.getProcesosData('290201', valor);
      break;
      
     case 'procesos':
      this.certificacionsData.catalogos=[]
      this.getCertificacionData('290201', valor);
      break;
      

    default:
      break;
  }
}

  /** Limpia los recursos al destruir el componente */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if (this.submissionsSub) {
      this.submissionsSub.unsubscribe();
    }

    // Al destruir (cambiar de tab), guardamos el estado de validez
    this.solicitud290201Store.update({ 
        tabDatosTramiteValid: this.informationCafeForm.valid 
    });
  
  }
}
