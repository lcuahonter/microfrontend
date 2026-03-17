import { ReplaySubject,map,takeUntil } from 'rxjs';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilaData2 } from '../../models/fila-model';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  Catalogo,
  CatalogosSelect,
  ConsultaioQuery,
  ConsultaioState,
  InputRadioComponent,
  TablaSeleccion,
  TableComponent,
} from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';

import {
  Solicitud290201State,
  Solicitud290201Store,
} from '../../../../estados/tramites/tramites290201.store';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';

import { Modal } from 'bootstrap';

import { CONFIGURACION_COLUMNAS_SOLI_2 } from '../../constants/tabla-enum';
import { TIPO_PERSONA_RADIO_OPTIONS } from '../../constants/octova-tempora.enum';
/**
 * Componente: TercerosRelacionadosComponent
 * Descripción: Componente para gestionar los datos de terceros relacionados en el trámite 290201.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    InputRadioComponent
  ],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.css',
})
export class TercerosRelacionadosComponent implements OnInit,OnDestroy {
    public isSubmitted$ = this.solicitud290201Query.isSubmitted$;
  /**
   * 
   * Observable para manejar la destrucción del componente.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Formulario reactivo para capturar los datos del destinatario.
   */
  destinatarioForm!: FormGroup;

  /**
   * Fila seleccionada en la tabla.
   */
  filaSeleccionada: FilaData2 | null = null;

  /**
   * Bandera para mostrar u ocultar el formulario.
   */
  esFormularioVisible = false; 
  /**
   * Estado actual del trámite obtenido del store.
   */
  public destinatarioState!: Solicitud290201State;

  /**
   * Datos de la tabla, incluyendo encabezados y cuerpo.
   */
  tableData: FilaData2[] = [];
  /**
   * Datos del catálogo de países.
   */
  public paisData: CatalogosSelect = {
    labelNombre: 'País*',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  };
  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona: string | null = null; 

  /**
   * Método para manejar el cambio de selección de tipo de persona.
   */
  filaSeleccionadas: Set<number> = new Set();

  /**
   * Estado para verificar si los datos de respuesta están disponibles.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Método para manejar el cambio de selección de tipo de persona.
   */
  tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Lista que almacena los datos de los destinatarios registrados.
   */
  newDestinatarioData: Array<FilaData2> = [];

  /**
   * Estado de consulta de datos.
   */
   consultaDatos!: ConsultaioState;
    
      /**
       * @property {boolean} soloLectura
       * @description Indica si el formulario o los campos están en modo de solo lectura.
       * @default false
       */
      esFormularioSoloLectura: boolean = false;

  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaRadioOptions = TIPO_PERSONA_RADIO_OPTIONS;

  /**
 * @property {string} tipoPersonaSeleccionada
 * @description Almacena el tipo de persona seleccionado en el formulario.
 * Este valor se utiliza para determinar la lógica de visualización y validación.
 * @default ''
 */
tipoPersonaSeleccionada: string = '';
  /**
   * Variable para almacenar el tipo de público.
   */
  tipoDePublicos: string = '';
      
  /**
 * @propiedad {CatalogosSelect} entidadFederativaData
 * @descripción
 * Datos del catálogo para la selección de la entidad federativa.
 * Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
 */
public entidadFederativaData: CatalogosSelect = {
  labelNombre: 'Entidad federativa',
  required: true,
  primerOpcion: 'Seleccione una opción',
  catalogos: [],
};

/**
* @propiedad {CatalogosSelect} alcaldiaMunicipoData
* @descripción
* Datos del catálogo para la selección de la alcaldía o municipio.
* Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
*/
public alcaldiaMunicipoData: CatalogosSelect = {
  labelNombre: 'Alcaldía o Municipio',
  required: true,
  primerOpcion: 'Seleccione una opción',
  catalogos: [],
};

/**
* @propiedad {CatalogosSelect} coloniaData
* @descripción
* Datos del catálogo para la selección de la colonia.
* Incluye el nombre de la etiqueta, si es requerido, la primera opción por defecto y los datos del catálogo.
*/
public coloniaData: CatalogosSelect = {
  labelNombre: 'Colonia',
  required: true,
  primerOpcion: 'Seleccione una opción',
  catalogos: [],
};
/**
 * @propiedad {string} placeholderDomicilio
 * @descripción Texto de marcador de posición para el campo de domicilio.
 * Este texto indica el formato esperado: "Calle, No Ext, No Int, Ciudad, C.P."
 * @valor 'Calle, No Ext, No Int, Ciudad, C.P.'
 */
placeholderDomicilio: string = 'Calle, No Ext, No Int, Ciudad, C.P.';
 /**
   * Bandera para verificar si los datos del catálogo de países están cargados.
   */
 isPaisdatoscargados = false;

  /**
   * Constructor del componente.
   * @param registrarsolicitud Servicio para registrar solicitudes.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param changeDetectorRef ChangeDetectorRef para detectar cambios manualmente.
   * @param solicitud290201Store Store para gestionar el estado global del trámite.
   * @param solicitud290201Query Query para obtener datos del estado global.
   */
  constructor(
    private registrarsolicitud: RegistrarSolicitudService,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private solicitud290201Store: Solicitud290201Store,
    private solicitud290201Query: Solicitud290201Query,
    private consultaioQuery: ConsultaioQuery,
    
  ) {
    this.getPaisData();

  }

  /**
   * Configuración de la tabla para mostrar los datos de los destinatarios.
   */
  configuracionColumnasoli = CONFIGURACION_COLUMNAS_SOLI_2;


  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    

    this.solicitud290201Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.destinatarioState = seccionState;
        })
      )
      .subscribe();
      
      this.createForm();
    this.getEntidadFederativaData();
    this.getAlcaldiaMunicipo();
    this.getColonia();
this.getDestinatarioData().then(() => {
  this.tableData = this.newDestinatarioData.length > 0 ? [...this.newDestinatarioData] : [];
  this.onTabSwitch();
  });
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

    const DATOS = this.datosDelTramiteRealizar;

DATOS.get('tipoPersona')?.valueChanges
  .pipe(takeUntil(this.destroyed$))
  .subscribe((tipo: 'moral' | 'fisica') => {

    const NOMBRE = DATOS.get('nombre');
    const PRIMERAPELLIDO = DATOS.get('primerApellido');
    const DENOMINACION = DATOS.get('denominacion');

    if (tipo === 'fisica') {
      NOMBRE?.setValidators([Validators.required]);
      PRIMERAPELLIDO?.setValidators([Validators.required]);

      DENOMINACION?.clearValidators();
      DENOMINACION?.reset('', { emitEvent: false });
    }

    if (tipo === 'moral') {
      DENOMINACION?.setValidators([Validators.required]);

      NOMBRE?.clearValidators();
      PRIMERAPELLIDO?.clearValidators();

   
      NOMBRE?.reset('', { emitEvent: false });
      PRIMERAPELLIDO?.reset('', { emitEvent: false });
    }

 
    NOMBRE?.updateValueAndValidity({ emitEvent: false });
    PRIMERAPELLIDO?.updateValueAndValidity({ emitEvent: false });
    DENOMINACION?.updateValueAndValidity({ emitEvent: false });
  });
  }
 
  /**
   * Método para crear el formulario reactivo.
   */
  createForm(): void {
    this.destinatarioForm = this.fb.group({
      datosDelTramiteRealizar: this.fb.group({
        tipoPersona: [ this.destinatarioState?.tipoPersona,[Validators.required]],
        denominacion: [ this.destinatarioState?.denominacion],
        nombre: [ this.destinatarioState?.nombre],
        primerApellido: [this.destinatarioState?.primerApellido],
        segundoApellido: [ this.destinatarioState?.segundoApellido,],
        domicilio: [this.destinatarioState?.domicilio],
        pais: [this.destinatarioState?.pais],
        codigopostal: [
          this.destinatarioState?.codigopostal,
           [
    Validators.pattern('^[0-9]{5}$') 
  ]],
        telefono: [this.destinatarioState?.telefono, [Validators.maxLength(30), 
          Validators.pattern('^[a-zA-Z0-9]*$')]],
        correoelectronico: [
          this.destinatarioState?.correoelectronico,
          [Validators.email]],
        
      }),
    });

  }
  
/**
   * Getter para obtener el tipo de persona seleccionado.
   */
get selectedTipoPersona(): string | undefined {
  return this.destinatarioForm.get('tipoPersona')?.value;
}

  /**
   * Establece el tipo de persona seleccionado.
   * @param value Valor seleccionado (cadena o número).
   */
  setTipoPersona(value: string | number): void {
  this.tipoPersonaSeleccionada = value.toString();
  if (this.filaSeleccionada) {
    this.filaSeleccionada.datosDelTramiteRealizar.tipoPersona = this.tipoPersonaSeleccionada;
  }
}
  /**
 * @method getEntidadFederativaData
 * @descripcion
 * Este método obtiene los datos del catálogo de entidades federativas desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `entidadFederativaData`.
 * @returns {void}
 */
  getEntidadFederativaData(): void {
    this.registrarsolicitud
      .getEntidadFederativaData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.entidadFederativaData.catalogos = data as Catalogo[];
      });
  }

  /**
 * @method getAlcaldiaMunicipo
 * @descripcion
 * Este método obtiene los datos del catálogo de alcaldías o municipios desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `alcaldiaMunicipoData`.
 * @returns {void}
 */
  getAlcaldiaMunicipo(): void {
    this.registrarsolicitud
      .getAlcaldiaMunicipo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.alcaldiaMunicipoData.catalogos = data as Catalogo[];
      });
  }

  /**
 * @method getColonia
 * @descripcion
 * Este método obtiene los datos del catálogo de colonias desde el servicio `AvisoDeMercanciaService`.
 * Utiliza el operador `takeUntil` para gestionar la destrucción de la suscripción y evitar fugas de memoria.
 * Los datos obtenidos se asignan a la propiedad `catalogos` del objeto `coloniaData`.
 * @returns {void}
 */
  getColonia(): void {
    this.registrarsolicitud
      .getColonia()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.coloniaData.catalogos = data as Catalogo[];
      });
  }
  
 

  /**
   * Método para obtener los datos del catálogo de países.
   */
  getPaisData(): void {
    this.registrarsolicitud
      .getPaisData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.paisData.catalogos = data as Catalogo[];
        this.isPaisdatoscargados = true;
      });
  }
  /**
   * Método para restaurar la selección de filas en la tabla.
   */
  getDestinatarioData(): Promise<void> {
  return new Promise((resolve) => {
    this.solicitud290201Store._select((state) => state.tableData).subscribe((data) => {
      if (data && data.length > 0) {
        this.tableData = [...data];

        this.solicitud290201Store._select((state) => state.filaSeleccionadas).subscribe((selectedIds) => {
          this.filaSeleccionadas = new Set(selectedIds || []);
          this.tableData.forEach((row) => {
            row.selected = this.filaSeleccionadas.has(row.id);
          });
        });

        this.solicitud290201Store._select((state) => state.filaSeleccionada).subscribe((selectedRow) => {
          this.filaSeleccionada = selectedRow;
        });

        
        this.newDestinatarioData = [...this.tableData];
        this.restoreSelection();
      } else {
        this.tableData = [];
      }
      resolve();
    });
  });
}
/**
 * Método para manejar el envío del formulario.
 */
enEnviar(EVENT: Event): void {
  EVENT.preventDefault();
  EVENT.stopPropagation();

  this.destinatarioForm.markAllAsTouched();

  if (this.destinatarioForm.invalid) {return;}

  const FORM_DATA = this.destinatarioForm.getRawValue();
  if (!FORM_DATA?.datosDelTramiteRealizar) {return;}
  const PAIS_DESC = this.paisData.catalogos.find(
    ITEM => String(ITEM.id) === String(FORM_DATA.datosDelTramiteRealizar.pais)
  )?.descripcion ?? '';

  FORM_DATA.datosDelTramiteRealizar.pais = PAIS_DESC;

  if (this.filaSeleccionada) {
    const INDEX = this.tableData.findIndex(ROW => ROW.id === this.filaSeleccionada!.id);
    if (INDEX !== -1) {
      this.tableData[INDEX] = { ...this.tableData[INDEX], ...FORM_DATA };
      this.newDestinatarioData[INDEX] = this.tableData[INDEX];
    }
  } else {
    const NEW_ID = this.tableData.length > 0 ? Math.max(...this.tableData.map(R => R.id || 0)) + 1 : 1;
    const NEW_ROW: FilaData2 = { ...FORM_DATA, id: NEW_ID };
    this.tableData = [...this.tableData, NEW_ROW];
    this.newDestinatarioData = [...this.newDestinatarioData, NEW_ROW];
  }

  this.solicitud290201Store.setDatosDeTabla(this.tableData);
  this.solicitud290201Store.setFilaSeleccionada(null);
  this.solicitud290201Store.setFilaSeleccionadas([]);

  
  this.closeModal();

  setTimeout(() => {
    this.destinatarioForm.reset();
    this.esFormularioVisible = false;
    this.filaSeleccionada = null;
    this.tipoPersonaSeleccionada = '';
    this.changeDetectorRef.detectChanges();
    
  
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }, 350);
}
 /**
 * Método para limpiar el formulario.
 */
onLimpiar(): void {
  this.destinatarioForm.reset();
  this.destinatarioForm.patchValue({
    datosDelTramiteRealizar: {
      pais: '',
    },
  });

  /**
   * Recorre todos los controles del formulario `destinatarioForm` y marca cada uno como "no tocado".
   * Si el control es un `FormGroup`, también recorre sus controles secundarios y los marca como "no tocados".
   * Esto asegura que todos los campos del formulario no muestren mensajes de validación después de limpiar.
   */
  Object.keys(this.destinatarioForm.controls).forEach((key) => {
    const CONTROL = this.destinatarioForm.get(key);
    if (CONTROL instanceof FormGroup) {
      Object.keys(CONTROL.controls).forEach((subKey) => {
        CONTROL.get(subKey)?.markAsUntouched();
      });
    } else {
      CONTROL?.markAsUntouched();
    }
  });
  this.destinatarioForm.get('datosDelTramiteRealizar.pais')?.markAsUntouched();
  this.tipoPersonaSeleccionada = '';
    this.changeDetectorRef.detectChanges();
}
  /**
   * Método para seleccionar una fila de la tabla.
   * @param item Fila seleccionada.
   * @param event Evento del checkbox.
   */
 onfilaSeleccionadasChange(filaSeleccionadas: FilaData2[]): void {

  this.filaSeleccionadas = new Set(filaSeleccionadas.map((row) => row.id));
  this.filaSeleccionada = filaSeleccionadas.length > 0 ? filaSeleccionadas[0] : null;

  this.tableData.forEach((row) => {
    row.selected = this.filaSeleccionadas.has(row.id);
  });
this.solicitud290201Store.setFilaSeleccionada(this.filaSeleccionada);
  this.solicitud290201Store.setFilaSeleccionadas(Array.from(this.filaSeleccionadas));
  this.changeDetectorRef.detectChanges();
}
  /**
 * Método para restaurar la selección de filas en la tabla.
 * Utiliza los datos del store para restaurar las filas seleccionadas y actualiza el estado del componente.
 */
restoreSelection(): void {

  this.solicitud290201Store._select((state) => state.filaSeleccionadas).subscribe((selectedIds) => {

    this.filaSeleccionadas = new Set(selectedIds || []);
    this.tableData.forEach((row) => {
      row.selected = this.filaSeleccionadas.has(row.id);
    });
  });

   this.onfilaSeleccionadasChange(this.tableData.filter((row) => row.selected));


        this.changeDetectorRef.detectChanges(); 

  this.solicitud290201Store._select((state) => state.filaSeleccionada).subscribe((selectedRow) => {
    this.filaSeleccionada = selectedRow;


  });
  this.populateFormWithSelectedRow();
}


/**
 * Método para inicializar el estado del formulario.
 */
onTabSwitch(): void {
  if (this.tableData.length === 0) {
    this.getDestinatarioData().then(() => {
      if (this.tableData.length > 0) {
        this.restoreSelection();
      }
      
    });
    return;
  }

  this.restoreSelection();
}

/**
 * Populates the form with the selected row's data if a row is selected.
 */
private populateFormWithSelectedRow(): void {
  if (this.filaSeleccionada) {

    this.destinatarioForm.patchValue({
      datosDelTramiteRealizar: {
        tipoPersona: this.filaSeleccionada.datosDelTramiteRealizar.tipoPersona || 'moral',

    denominacion: this.filaSeleccionada.datosDelTramiteRealizar.tipoPersona === 'moral'
          ? this.filaSeleccionada.datosDelTramiteRealizar.denominacion
          : '',
                  nombre: this.filaSeleccionada.datosDelTramiteRealizar.nombre,
        primerApellido: this.filaSeleccionada.datosDelTramiteRealizar.primerApellido,
        segundoApellido: this.filaSeleccionada.datosDelTramiteRealizar.segundoApellido,
        domicilio: this.filaSeleccionada.datosDelTramiteRealizar.domicilio,
        pais: this.paisData.catalogos.find(
          (item: Catalogo) =>
            this.filaSeleccionada &&
            this.filaSeleccionada.datosDelTramiteRealizar &&
            item.descripcion === this.filaSeleccionada.datosDelTramiteRealizar.pais
        )?.id || '',
        codigopostal: this.filaSeleccionada.datosDelTramiteRealizar.codigopostal,
        telefono: this.filaSeleccionada.datosDelTramiteRealizar.telefono,
        correoelectronico: this.filaSeleccionada.datosDelTramiteRealizar.correoelectronico,
      },
    });

    this.tipoPersonaSeleccionada = this.filaSeleccionada.datosDelTramiteRealizar.tipoPersona || 'moral';

    if (this.tipoPersonaSeleccionada === 'moral') {
      this.destinatarioForm.get('datosDelTramiteRealizar.denominacion')?.setValidators([Validators.required]);
    } else {
      this.destinatarioForm.get('datosDelTramiteRealizar.denominacion')?.clearValidators();
    }
    this.destinatarioForm.get('datosDelTramiteRealizar.denominacion')?.updateValueAndValidity();


    this.esFormularioVisible = true; 
  } 
}
  /**
   * Método para modificar los datos de una fila seleccionada.
   */
  enModificar(): void {

  this.esFormularioVisible = true; 

   setTimeout(() => {
     this.openModal();

   
  });

  if (!this.isPaisdatoscargados) {
    return;
  }

  if (!this.filaSeleccionada) {
    return;
  }


  const PAIS_ID = this.paisData.catalogos.find(
    (item: Catalogo) =>
      item.descripcion === this.filaSeleccionada?.datosDelTramiteRealizar?.pais ||
      String(item.id) === String(this.filaSeleccionada?.datosDelTramiteRealizar?.pais)
  )?.id;


  this.destinatarioForm.patchValue({
    datosDelTramiteRealizar: {
      tipoPersona: this.filaSeleccionada.datosDelTramiteRealizar.tipoPersona || 'moral',
denominacion: this.filaSeleccionada.datosDelTramiteRealizar.tipoPersona === 'moral'
        ? this.filaSeleccionada.datosDelTramiteRealizar.denominacion
        : '',
        nombre: this.filaSeleccionada.datosDelTramiteRealizar.nombre, 
      primerApellido: this.filaSeleccionada.datosDelTramiteRealizar.primerApellido,
      domicilio: this.filaSeleccionada.datosDelTramiteRealizar.domicilio,
      pais: PAIS_ID || '',
      codigopostal: this.filaSeleccionada.datosDelTramiteRealizar.codigopostal,
      telefono: this.filaSeleccionada.datosDelTramiteRealizar.telefono,
      correoelectronico: this.filaSeleccionada.datosDelTramiteRealizar.correoelectronico,
    },
  });

  this.tipoPersonaSeleccionada = this.filaSeleccionada.datosDelTramiteRealizar.tipoPersona || 'moral';

  this.changeDetectorRef.detectChanges();
}
 
 /**
 * Método para eliminar una fila seleccionada.
 */
 onDeletefilaSeleccionadas(): void {
  if (this.filaSeleccionadas.size > 0) {

       this.tableData = this.tableData.filter(
      (row: { id: number }) => !this.filaSeleccionadas.has(row.id)
    );
    this.filaSeleccionadas.clear();
    this.destinatarioForm.reset();
    this.esFormularioVisible = false;
  }
}
/**
 * @method onCancelar
 * @description Método para cerrar el modal de destinatarios y ocultar el formulario.
 * @returns {void}
 */
onCancelar(): void {
   this.closeModal()
  this.esFormularioVisible = false; 
}
  /**
   * Método para manejar el clic en una fila de la tabla.
   * @param rowData Fila seleccionada.
   */
  onRowClick(rowData: FilaData2): void {
    this.destinatarioForm.patchValue({
      datosDelTramiteRealizar: {
        tipoPersona: rowData.datosDelTramiteRealizar.tipoPersona,
        denominacion: rowData.datosDelTramiteRealizar.denominacion,
        domicilio: rowData.datosDelTramiteRealizar.domicilio,
        pais:
          this.paisData.catalogos.find(
            (item: Catalogo) =>
              item.descripcion === rowData.datosDelTramiteRealizar.pais
          )?.id || '',
        codigopostal: rowData.datosDelTramiteRealizar.codigopostal,
        telefono: rowData.datosDelTramiteRealizar.telefono,
        correoelectronico: rowData.datosDelTramiteRealizar.correoelectronico,
      },
    });
    this.filaSeleccionada = rowData;
    this.esFormularioVisible = true;
    
  }

  /**
   * Getter para obtener el grupo de datos del trámite a realizar.
   */
  get datosDelTramiteRealizar(): FormGroup {
    return this.destinatarioForm.get('datosDelTramiteRealizar') as FormGroup;
  }

  /**
   * Método para inicializar el estado del formulario según si es de solo lectura o no.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.destinatarioForm?.disable();
    }
    else {
      this.destinatarioForm?.enable();
    }
}
/**
 * Getter to check if the 'pais' field is required.
 * 
 * @returns {boolean} Returns `true` if the 'pais' field has a 'required' error, otherwise `false`.
 */
get isPaisRequired(): boolean {
  return this.destinatarioForm.get('pais')?.errors?.['required'] ?? false;
}

/**
 * Getter to check if the 'codigopostal' field has a 'maxlength' error.
 * 
 * @returns {boolean} Returns `true` if the 'codigopostal' field has a 'maxlength' error, otherwise `false`.
 */
get isCodigoPostalMaxLengthExceeded(): boolean {
  return this.destinatarioForm.get('datosDelTramiteRealizar.codigopostal')?.errors?.['maxlength'] ?? false;
}
/**
 * Getter to check if the 'telefono' field has a 'pattern' error.
 * 
 * @returns {boolean} Returns `true` if the 'telefono' field has a 'pattern' error, otherwise `false`.
 */
get isTelefonoPatternInvalid(): boolean {
  return this.destinatarioForm.get('datosDelTramiteRealizar.telefono')?.errors?.['pattern'] ?? false;
}
/**
 * Getter to check if the 'correoelectronico' field has an 'email' error.
 * 
 * @returns {boolean} Returns `true` if the 'correoelectronico' field has an 'email' error, otherwise `false`.
 */
get isCorreoElectronicoInvalid(): boolean {
  return this.destinatarioForm.get('datosDelTramiteRealizar.correoelectronico')?.errors?.['email'] ?? false;
}
/**
 * Getter to check if the 'pais' field is touched and invalid.
 * 
 * @returns {boolean} Returns `true` if the 'pais' field is touched and invalid, otherwise `false`.
 */
get isPaisInvalid(): boolean {
  return (
    (this.destinatarioForm.get('datosDelTramiteRealizar.pais')?.touched ?? false)&&
    (this.destinatarioForm.get('datosDelTramiteRealizar.pais')?.invalid ?? false)
  );
}



/**
 * Getter to check if the 'codigopostal' field is invalid due to 'maxlength'.
 * 
 * @returns {boolean} Returns `true` if the 'codigopostal' field has a 'maxlength' error, otherwise `false`.
 */
get isCodigoPostalInvalid(): boolean {
      return this.destinatarioForm.get('datosDelTramiteRealizar.codigopostal')?.errors?.['maxlength'] ?? false;
}

/**
 * Getter to check if the 'codigopostal' field is invalid due to 'pattern'.
 * 
 * @returns {boolean} Returns `true` if the 'codigopostal' field has a 'pattern' error, otherwise `false`.
 */
get isCodigoPostalPatternInvalid(): boolean {
  const CONTROL = this.destinatarioForm.get('datosDelTramiteRealizar.codigopostal');
  return CONTROL?.hasError('pattern') ?? false; 

}

/**
 * Método para mostrar el formulario de destinatarios.
 * 
 * Este método establece la bandera `esFormularioVisible` en `true`,
 * lo que permite que el formulario sea visible en la interfaz de usuario.
 */
onAgregar(): void {
    this.esFormularioVisible = true;
    this.destinatarioForm.reset();
    this.destinatarioForm.patchValue({
        datosDelTramiteRealizar: {
            tipoPersona: '',
            denominacion: '',
             nombre: '',
      primerApellido: '',
      segundoApellido: '',
            domicilio: '',
            pais: '',
            codigopostal: '',
            telefono: '',
            correoelectronico: '',
        },
    });

    this.filaSeleccionada = null;
    
    Object.keys(this.destinatarioForm.controls).forEach((key) => {
        const CONTROL = this.destinatarioForm.get(key);
        if (CONTROL instanceof FormGroup) {
            Object.keys(CONTROL.controls).forEach((subKey) => {
                CONTROL.get(subKey)?.markAsUntouched();
            });
        } else {
            CONTROL?.markAsUntouched();
        }
    });
    this.destinatarioForm.get('datosDelTramiteRealizar.pais')?.markAsUntouched();
        this.tipoPersonaSeleccionada = '';
    
    this.changeDetectorRef.detectChanges();
    this.openModal()

}
  /**
   * Método para establecer valores en el store.
   * @param form Formulario reactivo.
   * @param campo Campo del formulario.
   * @param metodoNombre Método del store a invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud290201Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud290201Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

 


// Instancia del modal de Bootstrap, inicialmente nula
private modalInstance: Modal | null = null;

// Método para abrir el modal
private openModal(): void {
  // Obtener el elemento del DOM del modal
  const ELEMENT = document.getElementById('tercerosRelacionadosModal');
  if (!ELEMENT) { return; }

  // Crear la instancia del modal si aún no existe
  if (!this.modalInstance) {
    this.modalInstance = new Modal(ELEMENT, {
      backdrop: 'static', // El fondo no cierra el modal al hacer clic
      keyboard: false // No se cierra con la tecla ESC
    });
  }

  // Mostrar el modal
  this.modalInstance.show();
}

// Método para cerrar el modal
private closeModal(): void {
  if (!this.modalInstance) {return;}


  this.modalInstance.hide();


  setTimeout(() => {
    const BODY = document.body;
    const BACKDROPS = document.querySelectorAll('.modal-backdrop');

   
    BODY.classList.remove('modal-open');
    BODY.style.overflow = '';
    BODY.style.paddingRight = '';

 
    BACKDROPS.forEach(ELEMENT => ELEMENT.remove());
    
  
    this.modalInstance = null;
  }, 300);
}

// Método público para cerrar el modal desde la plantilla
close(): void {
  this.closeModal();
}
  /**
   * Método para limpiar los observables al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();

   
  const BODY = document.body;
  BODY.classList.remove('modal-open');
  BODY.style.overflow = '';
  
 
  if (this.modalInstance) {
    this.modalInstance.dispose();
  }
  }
}
