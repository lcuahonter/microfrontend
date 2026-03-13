
/**
 * Componente `DatosDelCafeComponent`
 * Este componente es responsable de gestionar los datos relacionados con el café en un formulario interactivo.
 * Permite al usuario agregar, editar, eliminar y visualizar datos en una tabla.
 */
import { CommonModule } from '@angular/common';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReplaySubject,debounceTime,filter,map, takeUntil } from 'rxjs';

import { AcuseComponent, ConsultaioQuery, ConsultaioState, InputFecha, InputFechaComponent, REGEX_7_ENTEROS_3_DECIMALES, REGEX_SOLO_DIGITOS, REGEX_SOLO_NUMEROS, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Catalogo, TituloComponent } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '@libs/shared/data-access-user/src';

import { DatosDeLaSolicitudComponent } from '../datos-de-la-solicitud/datos-de-la-solicitud.component';
import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';

import { Solicitud290201State, Solicitud290201Store } from '../../../../estados/tramites/tramites290201.store';
import { FilaData } from '../../models/fila-model';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';

import { Modal } from 'bootstrap';

import { CATALOGOS, CONFIGURACION_COLUMNAS_SOLI } from '../../constants/tabla-enum';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
@Component({
  selector: 'app-datos-del-cafe',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent, TableComponent, AcuseComponent, DatosDeLaSolicitudComponent,TablaDinamicaComponent,InputFechaComponent],
  templateUrl: './datos-del-cafe.component.html',
  styleUrl: './datos-del-cafe.component.css',

})
export class DatosDelCafeComponent implements OnDestroy, OnInit {

    public isSubmitted$ = this.solicitud290201Query.isSubmitted$;

  /**
   * Observable para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Datos que se muestran en la tabla.
   */
  tableData: FilaData[] = [];

  /**
   * Formulario reactivo para gestionar los datos del café.
   */
  dataCafeForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public dataCafeState!: Solicitud290201State;

  /**
   * Modal para la confirmación de eliminación.
   */
  public envasadoenData = { ...CATALOGOS.ENVASADO };

/**
 * Datos del catálogo para el campo "¿Utilizó café como materia prima importada?".
 */
public utilizoCafeComoData = { ...CATALOGOS.UTILIZO_CAFE_COMO };

/**
 * Datos del catálogo para el campo "País de importación".
 */
public paisdeimportacionData = { ...CATALOGOS.PAIS_DE_IMPORTACION };

/**
 * Datos del catálogo para el campo "Fracción arancelaria".
 */
public fraccionarancelariaData = { ...CATALOGOS.FRACCION_ARANCELARIA };

/**
 * Datos del catálogo para el campo "Unidad de medida".
 */
public unidaddemedidaData = { ...CATALOGOS.UNIDAD_DE_MEDIDA };

/**
 * Datos del catálogo para el campo "Dólar".
 */
public dolarData = { ...CATALOGOS.DOLAR };

/**
 * Datos del catálogo para el campo "¿El café tiene características especiales?".
 */
public elcafeData = { ...CATALOGOS.EL_CAFE };

/**
 * Datos del catálogo para el campo "País de transbordo".
 */
public paisdetransbordoData = { ...CATALOGOS.PAIS_DE_TRANSBORDO };

/**
 * Datos del catálogo para el campo "Medio de transporte".
 */
public mediodetransporteData = { ...CATALOGOS.MEDIO_DE_TRANSPORTE };

  /**
   * Indica si el formulario es visible o no.
   */
  esFormularioVisible: boolean = false;

  /**
   * Contiene los índices de las filas seleccionadas en la tabla.
   */
  selectedRows: Set<number> = new Set();

 /**
 * @property {ConsultaioState} consultaDatos
 * @description Representa el estado de la consulta actual.
 */

consultaDatos!: ConsultaioState;
  /**
 * @property {boolean} esFormularioSoloLectura
 * @description Indica si el formulario está en modo de solo lectura.
 * @default false
 */
esFormularioSoloLectura: boolean = false;

/**
 * @property {boolean} isUtilizoCafeComoSi
 * @description Indica si se seleccionó "Sí" en el campo "¿Utilizó café como materia prima importada?".
 * @default false
 */
isUtilizoCafeComoSi: boolean = false;

/**
 * @property {boolean} isElCafeSi
 * @description Indica si se seleccionó "Sí" en el campo "¿El café tiene características especiales?".
 * @default false
 */
isElCafeSi: boolean = false;
    

  /**
   * Constructor del componente.
   * @param registrarsolicitud Servicio para obtener datos de los catálogos.
   * @param fb Constructor de formularios reactivos.
   * @param solicitud290201Store Almacén para gestionar el estado de la solicitud.
   * @param solicitud290201Query Consulta para obtener el estado de la solicitud.
   */
  constructor(
    private registrarsolicitud: RegistrarSolicitudService,
    private fb: FormBuilder,
    private solicitud290201Store: Solicitud290201Store,
    private solicitud290201Query: Solicitud290201Query,
    private cdr: ChangeDetectorRef,
    private consultaioQuery: ConsultaioQuery,
      private NOTIF: NotificacionesService
    
  ) {
    this.getEnvasadoenData('290201');
    this.getUtilicoCafeComoData();
    this.getPaisDeImportacionData('290201');
    this.getFraccionArancelariaData('290201');
    this.getUnidadDeMedidaData('290201');
    this.getDollarData('290201');
    this.getElcafeData();
    this.getPaisDeTransbordoData('290201');
    this.getMediaDeTransporte('290201');
  }

  /**
   * Tipo de selección para la tabla de mercancías.
   * Utiliza `TablaSeleccion.CHECKBOX` para permitir la selección múltiple.
   */
  tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla `configuracionColumnasoli`.
 */

  configuracionColumnasoli = CONFIGURACION_COLUMNAS_SOLI;

  /**
   * Configuración de las columnas de la tabla `configuracionColumnasoli`.
   */
  fechaexportacion: InputFecha = {
    labelNombre: 'Fecha exportación*:',
    required: false,
    habilitado: true,
  };
  /**
 * @property {boolean} isEditMode
 * @description Indica si el formulario está en modo de edición.
 * Cuando es `true`, el formulario permite editar una fila existente en la tabla.
 * @default false
 */
isEditMode: boolean = false;

/**
 * @property {number | null} editingRowId
 * @description Almacena el ID de la fila que se está editando actualmente.
 * Si es `null`, no hay ninguna fila en modo de edición.
 * @default null
 */
editingRowId: number | null = null;



  /**
   * Método para cambiar la fecha final del formulario.
   * @param nuevo_valor Nuevo valor de la fecha de exportación.
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.datosDelTramiteRealizar.patchValue({
      fechaexportacion: nuevo_valor,
    });
    this.solicitud290201Store.setFechaexportacion(nuevo_valor);
  }
  /**
   * Crea el formulario reactivo con los campos necesarios y sus validaciones.
   */
  createForm(): void {
    this.dataCafeForm = this.fb.group({
      datosDelTramiteRealizar: this.fb.group({
        envasadoen: ['', Validators.required],
        utilizoCafeComo: ['', Validators.required],
        cantidadutilizada: [{ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_SOLO_DIGITOS)]],
        numerodepedimento: [{ value: '', disabled: true }, Validators.required],
        paisdeimportacion: [{ value: '', disabled: true }, Validators.required],
        fraccionarancelaria: [{ value: '', disabled: true }, Validators.required],
        cantidad: ['', [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)]],
        unidaddemedida: ['', Validators.required],
        precioapplicable: ['', Validators.pattern(REGEX_7_ENTEROS_3_DECIMALES)],
        dolar: ['', Validators.required],
        lote: ['',[
          Validators.required,
          Validators.pattern(REGEX_SOLO_NUMEROS) 
        ]],
        otrasmarcas: ['', [Validators.required]],
        otros: [false],
        otrasCaracteristicas:[''],
        elcafe: ['', Validators.required],
        fechaexportacion: [ '', Validators.required],
        paisdetransbordo: ['', Validators.required],
        mediodetransporte: ['', Validators.required],
        Identificadordel: ['',[
          Validators.required,
          Validators.maxLength(5) 
        ]],
        observaciones: ['', [Validators.maxLength(250)]],
        calidadEspecial: [''],
        cafePractices: [''],
        avesMigratorias: [''],
        codigoComunidad: [''],
        comercioJusto: [''],
        euregap: [''],
        rainforestAlliance: [''],
        sistemaQ: [''],
        tasqNespresso: [''],
        utzCertified: [''],
      },
     {
  validators: [
    DatosDelCafeComponent.cantidadUtilizadaValidator,
    DatosDelCafeComponent.caracteristicasEspecialesValidator
  ]
}
  ),
      
    });
   
    this.dataCafeForm.get('datosDelTramiteRealizar.utilizoCafeComo')?.valueChanges.subscribe((value) => {
      if (typeof value === 'number') {
        this.isUtilizoCafeComoSi = value === 1; 
      } else if (typeof value === 'string') {
        this.isUtilizoCafeComoSi = value === '1'; 
      } else if (typeof value === 'object' && value?.id) {
        this.isUtilizoCafeComoSi = value.id === 1; 
      } else {
        this.isUtilizoCafeComoSi = false; 
      }
    });
    this.dataCafeForm.get('datosDelTramiteRealizar.elcafe')?.valueChanges.subscribe((value) => {
      if (typeof value === 'number') {
        this.isElCafeSi = value === 1; 
      } else if (typeof value === 'string') {
        this.isElCafeSi = value === '1'; 
      } else if (typeof value === 'object' && value?.id) {
        this.isElCafeSi = value.id === 1; 
      } else {
        this.isElCafeSi = false; 
      }
    });
   
    this.dataCafeForm.get('datosDelTramiteRealizar.cantidadutilizada')?.valueChanges
    .pipe(debounceTime(300), takeUntil(this.destroyed$))
    .subscribe(() => {
      this.dataCafeForm.get('datosDelTramiteRealizar')?.updateValueAndValidity();
    });
  
  this.dataCafeForm.get('datosDelTramiteRealizar.cantidad')?.valueChanges
    .pipe(debounceTime(300), takeUntil(this.destroyed$))
    .subscribe(() => {
      this.dataCafeForm.get('datosDelTramiteRealizar')?.updateValueAndValidity();
    });
   }

// Valida las características especiales del café según los campos seleccionados en el formulario
static caracteristicasEspecialesValidator(group: AbstractControl): ValidationErrors | null {
  const ELCAFE = group.get('elcafe')?.value === '1';
  if (!ELCAFE) {
    return null;
  }

  const CAMPOSE = [
    'calidadEspecial',
    'cafePractices',
    'avesMigratorias',
    'codigoComunidad',
    'comercioJusto',
    'euregap',
    'rainforestAlliance',
    'sistemaQ',
    'tasqNespresso',
    'utzCertified',
    'otros'
  ];

  const ALGUNOMACARDO = CAMPOSE.some(c => group.get(c)?.value === true);

  if (!ALGUNOMACARDO) {
    return { ningunaCaracteristicaSeleccionada: true };
  }

  // Validar el campo 'otrasCaracteristicas' solo si 'otros' está marcado
  if (group.get('otros')?.value === true) {
    const OTRAS = group.get('otrasCaracteristicas');
    if (!OTRAS?.value) {
      return { otrasCaracteristicasRequerido: true };
    }
  }

  return null;
}
  
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
ngOnInit(): void {
  // Suscribirse a los cambios de solicitud y actualizar el estado del café
  this.solicitud290201Query.selectSolicitud$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.dataCafeState = seccionState;
      }),
    )
    .subscribe();

  this.createForm();

  // Suscribirse a los cambios del estado de consulta y configurar el formulario según readonly
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
  this.sincronizarTablaConStore();

  const UTILCNTRL = this.dataCafeForm.get('datosDelTramiteRealizar.utilizoCafeComo');

  // Detectar cambios en el campo "utilizoCafeComo" para actualizar validaciones
  UTILCNTRL?.valueChanges.subscribe(value => {
    const ISSI =
      value === 1 ||
      value === '1' ||
      (typeof value === 'object' && value?.id === 1);

    this.isUtilizoCafeComoSi = ISSI;
    this.toggleUtilizoCafeValidators(ISSI);
  });

  // Inicializar estado de "utilizoCafeComo"
  const INITIALVALUE = UTILCNTRL?.value;
  const INITIALISSI =
    INITIALVALUE === 1 ||
    INITIALVALUE === '1' ||
    (typeof INITIALVALUE === 'object' && INITIALVALUE?.id === 1);

  this.isUtilizoCafeComoSi = INITIALISSI;
  this.toggleUtilizoCafeValidators(INITIALISSI);

  const OTRAS_CONTROL = this.dataCafeForm.get('datosDelTramiteRealizar.otrasCaracteristicas');
  const OTROS_CHECKBOX = this.dataCafeForm.get('datosDelTramiteRealizar.otros');

  // Detectar cambios en "elcafe" y actualizar validaciones de campos dependientes
  this.dataCafeForm.get('datosDelTramiteRealizar.elcafe')?.valueChanges.subscribe((value) => {
    const ISSI = value === '1';

    const CALIDADCNTRL = this.dataCafeForm.get('datosDelTramiteRealizar.calidadEspecial');
    const CAFEPRACTICECONTROL = this.dataCafeForm.get('datosDelTramiteRealizar.cafePractices');

    if (ISSI) {
      if (OTROS_CHECKBOX?.value) {
        OTRAS_CONTROL?.setValidators(Validators.required);
      } else {
        OTRAS_CONTROL?.clearValidators();
        OTRAS_CONTROL?.reset();
      }
    } else {
      CALIDADCNTRL?.clearValidators();
      CAFEPRACTICECONTROL?.clearValidators();
      OTRAS_CONTROL?.clearValidators();
      OTRAS_CONTROL?.reset();
    }

    CALIDADCNTRL?.updateValueAndValidity();
    CAFEPRACTICECONTROL?.updateValueAndValidity();
    OTRAS_CONTROL?.updateValueAndValidity();
  });

  // Detectar cambios en el checkbox "otros" para validar "otrasCaracteristicas"
  OTROS_CHECKBOX?.valueChanges.subscribe((checked) => {
    if (this.dataCafeForm.get('datosDelTramiteRealizar.elcafe')?.value === '1' && checked) {
      OTRAS_CONTROL?.setValidators(Validators.required);
    } else {
      OTRAS_CONTROL?.clearValidators();
      OTRAS_CONTROL?.reset();
    }
    OTRAS_CONTROL?.updateValueAndValidity();
  });

  const DATOSGRP = this.dataCafeForm.get('datosDelTramiteRealizar') as FormGroup;

  // Forzar revalidación de campos dependientes al cambiar cantidad o cantidad utilizada
  DATOSGRP.get('cantidadutilizada')?.valueChanges.subscribe(() => {
    DATOSGRP.updateValueAndValidity({ onlySelf: true });
  });

  DATOSGRP.get('cantidad')?.valueChanges.subscribe(() => {
    DATOSGRP.updateValueAndValidity({ onlySelf: true });
  });
}


// Sincroniza la tabla local con los datos guardados en el store
sincronizarTablaConStore(): void {
  this.solicitud290201Query
    .select('datosCafeGuardados')
    .pipe(
      filter(Boolean),
      takeUntil(this.destroyed$)
    )
    .subscribe((data: FilaData[]) => {
      // Actualiza la tabla local con los datos del store
      this.tableData = [...data];
    });
}

// Activa o desactiva validaciones de los campos relacionados con "utilizoCafeComo"
toggleUtilizoCafeValidators(isSi: boolean): void {
  const FORM = this.dataCafeForm.get('datosDelTramiteRealizar') as FormGroup;

  const CONTROLES = [
    'numerodepedimento',
    'cantidadutilizada',
    'paisdeimportacion',
    'fraccionarancelaria'
  ];

  CONTROLES.forEach(nombre => {
    const CTRL = FORM.get(nombre);
    if (!CTRL) {
      return;
    }

    if (isSi) {
      CTRL.enable();
      CTRL.setValidators([Validators.required]);
    } else {
      CTRL.clearValidators();
      CTRL.reset();
      CTRL.disable();
    }

    // Actualiza el estado de validación sin emitir eventos
    CTRL.updateValueAndValidity({ emitEvent: false });
  });
}

// Activa o desactiva las validaciones del campo "otrasmarcas"
toggleOtrasMarcasValidators(isRequired: boolean): void {
  const CTRL = this.dataCafeForm.get('datosDelTramiteRealizar.otrasmarcas');

  if (!CTRL) {
    return;
  }

  if (isRequired) {
    // Establece validaciones: requerido y solo números
    CTRL.setValidators([
      Validators.required,
      Validators.pattern(/^\d+$/)
    ]);
  } else {
    // Limpia validaciones y reinicia el campo
    CTRL.clearValidators();
    CTRL.reset();
  }

  // Actualiza el estado de validación sin emitir eventos
  CTRL.updateValueAndValidity({ emitEvent: false });
}

 
  /**
   * Obtiene los datos del catálogo "Envasado".
   */
  getEnvasadoenData(tramite: string): void {
  this.registrarsolicitud
    .getEnvasadoenData(tramite)
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
      this.envasadoenData.catalogos = data.datos;
    });
}

  /**
   * Obtiene los datos del catálogo "¿Utilizó café como materia prima importada?".
   */
  getUtilicoCafeComoData(): void {
    this.registrarsolicitud.getUtilicoCafeComoData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.utilizoCafeComoData.catalogos = data as Catalogo[];
      });
  }

  /**
   * Obtiene los datos del catálogo "País de importación".
   */

   getPaisDeImportacionData(tramite: string): void {
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
      this.paisdeimportacionData.catalogos = data.datos;
    });
}

  /**
   * Obtiene los datos del catálogo "Fracción arancelaria".
   */
 getFraccionArancelariaData(tramite: string): void {
  this.registrarsolicitud
    .getFraccionArancelariaData(tramite)
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

     
      this.fraccionarancelariaData.catalogos = data.datos;
    });
}
  /**
   * Obtiene los datos del catálogo "Unidad de medida".
   */
 getUnidadDeMedidaData(tramite: string): void {
  this.registrarsolicitud
    .getUnidadDeMedidaData(tramite)
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
      this.unidaddemedidaData.catalogos = data.datos;
    });
}

  /**
   * Obtiene los datos del catálogo "Dólar".
   */
  getDollarData(tramite: string): void {
  this.registrarsolicitud
    .getDollarData(tramite)
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

  
      this.dolarData.catalogos = data.datos;
    });
}

  /**
   * Obtiene los datos del catálogo "¿El café tiene características especiales?".
   */
  getElcafeData(): void {
    this.registrarsolicitud.getUtilicoCafeComoData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.elcafeData.catalogos = data as Catalogo[];
      });
  }

  /**
   * Obtiene los datos del catálogo "País de transbordo".
   */

   getPaisDeTransbordoData(tramite: string): void {
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
      this.paisdetransbordoData.catalogos = data.datos;
    });
}

  /**
   * Obtiene los datos del catálogo "Medio de transporte".
   */
  getMediaDeTransporte(tramite: string): void {
  this.registrarsolicitud
    .getMediaDeTransporte(tramite)
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
      this.mediodetransporteData.catalogos = data.datos;
    });
}
/**
 * Este método se ejecuta al enviar el formulario.
 * Procesa los datos ingresados, los transforma según los catálogos
 * y los agrega o actualiza en la tabla de datos.
 */
enEnviar(): void {

  const OTRAS_CARACTERISTICAS_CONTROL = this.dataCafeForm.get('datosDelTramiteRealizar.otrasCaracteristicas');
  const DATOS_FORM = this.dataCafeForm.get('datosDelTramiteRealizar') as FormGroup;
  const OTROS_CHECKBOX = DATOS_FORM.get('otros');

  // Validar 'otras características' si 'otros' está marcado
  if (this.isElCafeSi && OTROS_CHECKBOX?.value && 
      (OTRAS_CARACTERISTICAS_CONTROL?.invalid || !OTRAS_CARACTERISTICAS_CONTROL?.value)) {
    OTRAS_CARACTERISTICAS_CONTROL?.markAsTouched();
    this.showModal();
    return;
  }

  // Validar todo el formulario
  if (this.dataCafeForm.invalid) {
    this.dataCafeForm.markAllAsTouched();
    this.marcarControlesComoTocados();
    return;
  }

const RAW = this.dataCafeForm.getRawValue();

this.dataCafeForm
  .get('datosDelTramiteRealizar.envasadoen')
  ?.setValue(RAW.datosDelTramiteRealizar.envasadoen);
  // Preparar datos para la tabla
  const FORM_DATA = { id: this.editingRowId || this.tableData.length + 1, ...this.dataCafeForm.getRawValue() };

  // Transformar valores usando los catálogos
FORM_DATA.datosDelTramiteRealizar.envasadoen = this.envasadoenData.catalogos.find(
  (item: Catalogo) => String(item.clave) === String(FORM_DATA.datosDelTramiteRealizar.envasadoen))
  ?.descripcion ?? FORM_DATA.datosDelTramiteRealizar.envasadoen;

  FORM_DATA.datosDelTramiteRealizar.utilizoCafeComo = this.utilizoCafeComoData.catalogos.find(
    (item: Catalogo) => String(item.id) === String(FORM_DATA.datosDelTramiteRealizar.utilizoCafeComo)
  )?.descripcion;

  // Editar fila existente o agregar nueva fila
  if (this.isEditMode && this.editingRowId !== null) {
    const INDEX = this.tableData.findIndex(row => row.id === this.editingRowId);
    if (INDEX !== -1) {
      this.tableData[INDEX] = FORM_DATA;
    }
  } else {
    FORM_DATA.id = this.tableData.length > 0 
      ? Math.max(...this.tableData.map(row => row.id)) + 1 
      : 1;
    this.tableData = [...this.tableData, FORM_DATA];
  }

  // Guardar en el store
  this.solicitud290201Store.addOrUpdateDatosCafe(FORM_DATA);

  // Reiniciar formulario sin afectar el modal
  this.resetDataCafeForm();

  // Ocultar modal
  this.hideModal();
}
// Indica si se deben mostrar los errores de los campos tipo catálogo
markCatalogoTouched = false;

// Marca como tocados los controles específicos para forzar la visualización de errores
marcarControlesComoTocados(): void {
  // Activar flag para mostrar errores en campos tipo catálogo
  this.markCatalogoTouched = true;

  const CAMPOS: string[] = [
    'envasadoen',
    'utilizoCafeComo',
    'unidaddemedida',
    'dolar',
    'elcafe',
    'mediodetransporte',
    'paisdetransbordo'
  ];

  // Marcar cada campo como tocado y sucio, y actualizar su validez
  CAMPOS.forEach((campo) => {
    const CONTROL = this.dataCafeForm.get(`datosDelTramiteRealizar.${campo}`);

    if (!CONTROL) {
      return;
    }

    CONTROL.markAsTouched({ onlySelf: true });
    CONTROL.markAsDirty({ onlySelf: true });
    CONTROL.updateValueAndValidity({ onlySelf: true });
  });
}

// Reinicia el formulario de café y su estado asociado
resetDataCafeForm(): void {
  // Resetear estado de UI
  this.isEditMode = false;
  this.editingRowId = null;
  this.isElCafeSi = false;
  this.isUtilizoCafeComoSi = false;

  // Reiniciar valores del formulario sin disparar valueChanges
  this.dataCafeForm.reset(
    {
      datosDelTramiteRealizar: {
        cantidadutilizada: '',
        numerodepedimento: '',
        paisdeimportacion: '',
        fraccionarancelaria: '',
        cantidad: '',
        precioapplicable: '',
        lote: '',
        otrasmarcas: '',
        otros: false,
        otrasCaracteristicas: '',
        fechaexportacion: null,
        Identificadordel: '',
        observaciones: '',
        calidadEspecial: false,
        cafePractices: false,
        avesMigratorias: false,
        codigoComunidad: false,
        comercioJusto: false,
        euregap: false,
        rainforestAlliance: false,
        sistemaQ: false,
        tasqNespresso: false,
        utzCertified: false,
      }
    },
    { emitEvent: false }
  );

  // Recalcular validez del formulario sin emitir eventos
  this.dataCafeForm.updateValueAndValidity({ emitEvent: false });
}

private MODAL_ELEMENT: HTMLElement | null = null;
private MODAL_INSTANCE: Modal | null = null;
private isModalOpen: boolean = false;

// Obtiene el elemento DOM del modal de café
private getModalElement(): HTMLElement {
  if (!this.MODAL_ELEMENT) {
    const EL = document.getElementById('datosCafeModal');
    if (!EL) {
      throw new Error('Elemento del modal no encontrado');
    }
    this.MODAL_ELEMENT = EL;
  }
  return this.MODAL_ELEMENT;
}
// Obtiene o crea una instancia del modal de Bootstrap
private getModalInstance(): Modal {
  if (!this.MODAL_INSTANCE) {
    const EL = this.getModalElement();
    this.MODAL_INSTANCE = Modal.getInstance(EL) || new Modal(EL, { backdrop: 'static' });

    // Escuchar eventos de apertura y cierre del modal
    EL.addEventListener('shown.bs.modal', () => {
      this.isModalOpen = true;
    });

    EL.addEventListener('hidden.bs.modal', () => {
      this.isModalOpen = false;

      // Eliminar posibles backdrops sobrantes
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());

      // Restaurar scroll del body
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    });
  }
  return this.MODAL_INSTANCE;
}
// Muestra el modal de café
showModal(): void {
  const MODAL = this.getModalInstance();
  const EL = this.getModalElement();

  if (this.isModalOpen) {
    // Si el modal ya está abierto, forzar su cierre y volver a abrirlo
    MODAL.hide();
    EL.addEventListener(
      'hidden.bs.modal',
      () => {
        MODAL.show();
      },
      { once: true }
    );
    return;
  }

  MODAL.show();
}
// Oculta el modal de café
hideModal(): void {
  const MODAL = this.getModalInstance();
  const EL = this.getModalElement();

  if (!this.isModalOpen) {
    return;
  }

  // Listener de limpieza una sola vez en caso de que queden backdrops
  EL.addEventListener(
    'hidden.bs.modal',
    () => {
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    },
    { once: true }
  );

  MODAL.hide();
}
/*
 * Este método se utiliza para mostrar el formulario al usuario.
 */
onAgregar(): void {
this.esFormularioVisible = true;
  this.showModal();
}
  /**
   * Este método se ejecuta cuando el usuario selecciona una fila de la tabla. Su propósito es
 */
  onRowClick( rowData: FilaData): void {
    this.isEditMode = true; 
    this.editingRowId = rowData.id;
   
    if (!rowData.datosDelTramiteRealizar) {
      return;
    }
    const TARGET = event?.target as HTMLElement;
    if (TARGET.tagName === 'INPUT' && TARGET.getAttribute('type') === 'checkbox') {
      return; 
    }
  
    if (this.selectedRows.has(rowData.id)) {
      return;
    }
 
    this.dataCafeForm.patchValue({
      datosDelTramiteRealizar: {
        envasadoen: this.envasadoenData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.envasadoen,
      )?.id || '',
      utilizoCafeComo: this.utilizoCafeComoData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.utilizoCafeComo,
      )?.id || '',
      paisdeimportacion: this.paisdeimportacionData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.paisdeimportacion,
      )?.id || '',
      fraccionarancelaria: this.fraccionarancelariaData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.fraccionarancelaria,
      )?.id || '',
      unidaddemedida: this.unidaddemedidaData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.unidaddemedida,
      )?.id || '',
      dolar: this.dolarData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.dolar,
      )?.id || '',
      elcafe: this.elcafeData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.elcafe,
      )?.id || '',
      paisdetransbordo: this.paisdetransbordoData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.paisdetransbordo,
      )?.id || '',
      mediodetransporte: this.mediodetransporteData.catalogos.find(
        (item: Catalogo) => item.descripcion === rowData.datosDelTramiteRealizar.mediodetransporte,
      )?.id || '',
    }
    });
    this.esFormularioVisible = true;

    const MODAL_ELEMENT = document.getElementById('datosCafeModal');
    if (MODAL_ELEMENT) {
      const MODAL_INSTANCE = new Modal(MODAL_ELEMENT); 
      MODAL_INSTANCE.show();
    }
  }
 /**
  * Este método se utiliza para eliminar las filas seleccionadas de la tabla.
  *  */ 
 onDeleteSelectedRows(): void {
  if (this.selectedRows.size > 0) {
    this.tableData = this.tableData.filter(
      (row: { id: number }) => !this.selectedRows.has(row.id)
    );
    this.selectedRows.clear();
    this.dataCafeForm.reset();
    this.esFormularioVisible = false;
  }
}
  /**
   * 
   * @param selectedRows Este método se utiliza para actualizar las filas seleccionadas en la tabla.
   */
  onSelectedRowsChange(selectedRows: FilaData[]): void {
    
    this.selectedRows = new Set(selectedRows.map((row) => row.id)); 
    this.esFormularioVisible = false; 
    
    const MODAL_ELEMENT = document.getElementById('datosCafeModal');
    if (MODAL_ELEMENT) {
        const MODAL_INSTANCE = Modal.getInstance(MODAL_ELEMENT);
        if (MODAL_INSTANCE) {
            MODAL_INSTANCE.hide();
        }
    }
  }

  
/**
 * Getter para verificar si el campo 'Identificadordel' es inválido y ha sido tocado.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'Identificadordel' es inválido y ha sido tocado, de lo contrario, devuelve `false`.
 */
get isIdentificadorDelInvalid(): boolean {
  return (
    (this.dataCafeForm.get('datosDelTramiteRealizar.Identificadordel')?.invalid ?? false) &&
    (this.dataCafeForm.get('datosDelTramiteRealizar.Identificadordel')?.touched ?? false)
  );
}


/**
 * Getter para verificar si el campo 'precioapplicable' es inválido y ha sido tocado.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'precioapplicable' es inválido y ha sido tocado, de lo contrario, devuelve `false`.
 */
get esPrecioAplicableInvalido(): boolean {
  return (
    (this.dataCafeForm.get('datosDelTramiteRealizar.precioapplicable')?.invalid ?? false) &&
    (this.dataCafeForm.get('datosDelTramiteRealizar.precioapplicable')?.touched ?? false)
  );
}
/**
 * Getter para verificar si el campo 'cantidad' es inválido y ha sido tocado.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'cantidad' es inválido y ha sido tocado, de lo contrario, devuelve `false`.
 */
get isCantidadInvalid(): boolean {
  return (
    (this.dataCafeForm.get('datosDelTramiteRealizar.cantidad')?.invalid ?? false) &&
    (this.dataCafeForm.get('datosDelTramiteRealizar.cantidad')?.touched ?? false)
  );
}
/** Getter para verificar si el campo 'cantidadutilizada' es inválido y ha sido tocado.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'cantidadutilizada' es inválido y ha sido tocado, de lo contrario, devuelve `false`.
 */
get isCantidadUtilizadaInvalid(): boolean {
  return (
    (this.dataCafeForm.get('datosDelTramiteRealizar.cantidadutilizada')?.invalid ?? false) &&
    (this.dataCafeForm.get('datosDelTramiteRealizar.cantidadutilizada')?.touched ?? false)
  );
}

/**
 * Getter to check if the 'otrasCaracteristicas' field is required and has been touched.
 * 
 * @returns {boolean} Returns `true` if the 'otrasCaracteristicas' field is required and touched, otherwise `false`.
 */
get isOtrasCaracteristicasRequired(): boolean {
  return (
    (this.dataCafeForm.get('datosDelTramiteRealizar.otrasCaracteristicas')?.touched ?? false)&&
    (this.dataCafeForm.get('datosDelTramiteRealizar.otrasCaracteristicas')?.hasError('required') ?? false)
  );
 
}
/**
 * Getter para verificar si el campo 'lote' es inválido y ha sido tocado.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'lote' es inválido y ha sido tocado, de lo contrario, devuelve `false`.
 */
get isLoteInvalid(): boolean {
  return (
    (this.dataCafeForm.get('datosDelTramiteRealizar.lote')?.invalid ?? false) &&
    (this.dataCafeForm.get('datosDelTramiteRealizar.lote')?.touched ?? false)
  );
}
/**
 * Getter para verificar si el campo 'cantidad' tiene un error de patrón.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'cantidad' tiene un error de patrón, de lo contrario, devuelve `false`.
 */
get isCantidadPatternInvalid(): boolean {
  return this.dataCafeForm.get('datosDelTramiteRealizar.cantidad')?.errors?.['pattern'] ?? false;
}

/**
 * Getter para verificar si el campo 'cantidadutilizada' tiene un error de patrón.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'cantidadutilizada' tiene un error de patrón, de lo contrario, devuelve `false`.
 */
get isCantidadUtilizadaPatternInvalid(): boolean {
  return this.dataCafeForm.get('datosDelTramiteRealizar.cantidadutilizada')?.errors?.['pattern'] ?? false;
}
/**
 * Getter para verificar si el campo 'precioapplicable' tiene un error de patrón.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'precioapplicable' tiene un error de patrón, de lo contrario, devuelve `false`.
 */
get isPrecioApplicablePatternInvalid(): boolean {
  return this.dataCafeForm.get('datosDelTramiteRealizar.precioapplicable')?.errors?.['pattern'] ?? false;
}

/**
 * Getter para verificar si el campo 'lote' tiene un error de patrón.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'lote' tiene un error de patrón, de lo contrario, devuelve `false`.
 */
get isLotePatternInvalid(): boolean {
  return this.dataCafeForm.get('datosDelTramiteRealizar.lote')?.errors?.['pattern'] ?? false;
}

/**
 * Getter para verificar si el campo 'Identificadordel' tiene un error de longitud máxima.
 * 
 * @returns {boolean} Devuelve `true` si el campo 'Identificadordel' tiene un error de longitud máxima, de lo contrario, devuelve `false`.
 */
get isIdentificadorDelPatternInvalid(): boolean {
  return this.dataCafeForm.get('datosDelTramiteRealizar.Identificadordel')?.errors?.['maxlength'] ?? false;
}
/**
 * Getter to check if the 'observaciones' field has a 'maxlength' error.
 * 
 * @returns {boolean} Returns `true` if the 'observaciones' field has a 'maxlength' error, otherwise `false`.
 */
get isObservacionesMaxLengthExceeded(): boolean {
  return this.dataCafeForm.get('datosDelTramiteRealizar.observaciones')?.hasError('maxlength') ?? false;
}

  /**
 * Getter para acceder al grupo de formularios 'datosDelTramiteRealizar'.
 * 
 * @returns {FormGroup} El grupo de formularios 'datosDelTramiteRealizar' dentro del formulario principal.
 */
get datosDelTramiteRealizar(): FormGroup {
  return this.dataCafeForm.get('datosDelTramiteRealizar') as FormGroup;
}

  /**
   * Este método se utiliza para inicializar el estado del formulario según si es de solo lectura o no.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.dataCafeForm?.disable();
    }
    else {
      this.dataCafeForm?.enable();
    }
}

/**
 * Validador estático para verificar que la cantidad utilizada no exceda la cantidad disponible.
 * 
 * @param {AbstractControl} group - Grupo de controles del formulario que contiene los campos `cantidadutilizada` y `cantidad`.
 * @returns { { [key: string]: boolean } | null } - Devuelve un objeto con la clave `cantidadUtilizadaExceeds` si la cantidad utilizada excede la cantidad disponible, o `null` si es válido.
 */
static cantidadUtilizadaValidator(group: AbstractControl): { [key: string]: boolean } | null {
  const CANTIDAD_UTILIZADA = group.get('cantidadutilizada')?.value;
  const CANTIDAD = group.get('cantidad')?.value;

  if (
    CANTIDAD_UTILIZADA !== null && CANTIDAD !== null &&
    CANTIDAD_UTILIZADA !== '' && CANTIDAD !== '' &&
    !isNaN(CANTIDAD_UTILIZADA) && !isNaN(CANTIDAD) &&
    Number(CANTIDAD_UTILIZADA) > Number(CANTIDAD)
  ) {
    return { cantidadUtilizadaExceeds: true };
  }

  return null;
}

/**
 * Getter para verificar si la cantidad utilizada excede la cantidad disponible.
 * 
 * @returns {boolean} Devuelve `true` si el validador `cantidadUtilizadaExceeds` está presente en el grupo de formularios
 * `datosDelTramiteRealizar` y el campo `cantidadutilizada` ha sido tocado. De lo contrario, devuelve `false`.
 */
get esCantidadUtilizadaExcede(): boolean {
  return (
    this.dataCafeForm.get('datosDelTramiteRealizar')?.errors?.['cantidadUtilizadaExceeds'] &&
    this.dataCafeForm.get('datosDelTramiteRealizar.cantidadutilizada')?.touched
  );
}

  /**
   * Este método se utiliza para actualizar un valor específico en el store de la solicitud.
   * @param form 
   * @param campo 
   * @param metodoNombre 
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud290201Store): void {
    const VALOR = form.get(campo)?.value;

    (this.solicitud290201Store[metodoNombre] as (value: string | number | boolean | null) => void)(VALOR);
    
  }

  /**
   * Valida si existe el valor de "Formas del café" en el store antes de permitir ingresar cantidad.
   */
  validarFormaCafe(): void {
    const STATE = this.solicitud290201Query.getValue();
    const FORMAS_DEL_CAFE = STATE?.formasdelcafe;

    if (!FORMAS_DEL_CAFE || FORMAS_DEL_CAFE === '' || FORMAS_DEL_CAFE === null || FORMAS_DEL_CAFE === undefined) {
      this.NOTIF.showNotification({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        mensaje: 'Debe escoger forma de cafe,en la seccion Informacion del cafe',
        titulo: 'Validación',
        modo: 'action',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
      this.hideModal();
    }
  }

  /**
   * Valida si existe el valor de "Ciclo cafetalero" en el store antes de permitir ingresar lote.
   */
  validarCicloCafetalero(): void {
    const STATE = this.solicitud290201Query.getValue();
    const CICLO_CAFETALERO = STATE?.ciclocafetalero;

    if (!CICLO_CAFETALERO || CICLO_CAFETALERO === '' || CICLO_CAFETALERO === null || CICLO_CAFETALERO === undefined) {
      this.NOTIF.showNotification({
        tipoNotificacion: 'alert',
        categoria: 'danger',
        mensaje: 'Debe escoger un ciclo cafetalero ,en la seccion Ciclo cafetalero',
        titulo: 'Validación',
        modo: 'action',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
      this.hideModal();
    }
  }
/**
 * Este método forma parte del ciclo de vida de los componentes en Angular y se ejecuta
 * cuando el componente está a punto de ser destruido.
 */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}



