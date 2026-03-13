import {
  AlertComponent,
  Catalogo,
  CatalogosSelect,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DESTINATARIO_CONFIGURACION_TABLA } from '../../constants/column-config.enum';
import { FilaTablaData } from '../../models/fila-modal';
import { ImportarDeRemediosHerbalsService } from '../../services/importar-de-remedios-herbals.service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReplaySubject } from 'rxjs';

import {
  TERCEROS_NACIONALIDAD_RADIO_OPTIONS,
  TEXTOS,
  TIPO_PERSONA_RADIO_OPTIONS,
} from '../../constants/constantes.enum';
import { map, takeUntil } from 'rxjs/operators';

import {
  Solicitud260919State,
  Solicitud260919Store,
} from '../../estados/tramites260919.store';
import { Solicitud260919Query } from '../../estados/tramites260919.query';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';


/**
 * Componente para gestionar los terceros relacionados en el trámite.
 * Este componente permite obtener y mostrar datos relacionados con destinatarios,
 * fabricantes, proveedores y facturadores, utilizando servicios para realizar las solicitudes.
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    TituloComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    NotificacionesComponent,
    InputRadioComponent,
  ],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
export class TercerosrelacionadosComponent implements OnInit, OnDestroy {
  /** Constantes de texto utilizadas en el componente */
  TEXTOS = TEXTOS;
  /**
   * Formulario reactivo para gestionar los datos del destinatario.
   */
  destinatarioForm!: FormGroup;

  /** Observable para manejar la destrucción del componente */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Configuración para la selección de filas en la tabla */
  destinatarioSeleccionTabla = TablaSeleccion.CHECKBOX;

  /** Configuración de las columnas de la tabla */
  destinatarioConfiguracionTabla = DESTINATARIO_CONFIGURACION_TABLA;
  /** Título del formulario */
 formTitle: string = ''; 
  /** Nombre de la tabla actual (fabricante, destinatario, proveedor, facturador) */
  currentTable: string = '';
  /** Datos de los destinatarios */
  destinatarioDatos: FilaTablaData[] = [];

  /** Datos de los fabricantes */
  fabricanteDatos: FilaTablaData[] = [];

  /** Datos de los proveedores */
  proveedorDatos: FilaTablaData[] = [];

  /** Datos de los facturadores */
  facturadorDatos: FilaTablaData[] = [];

  /** Conjunto de filas seleccionadas en la tabla */
  selectedRows: Set<number> = new Set();


  /** 
 * Conjunto de filas seleccionadas en la tabla de fabricantes.
 */
filasSeleccionadasFabricante: Set<number> = new Set();

/** 
 * Conjunto de filas seleccionadas en la tabla de destinatarios.
 */
filasSeleccionadasDestinatario: Set<number> = new Set();

/** 
 * Conjunto de filas seleccionadas en la tabla de proveedores.
 */
filasSeleccionadasProveedor: Set<number> = new Set();

/** 
 * Conjunto de filas seleccionadas en la tabla de facturadores.
 */
filasSeleccionadasFacturador: Set<number> = new Set();

  /** Fila seleccionada actualmente */
  selectedRow: FilaTablaData | null = null;
  /**
   * Variable para almacenar el tipo de persona seleccionada (por ejemplo, 'fisica' o 'moral').
   */
  tipoPersonaSeleccionada: string = '';

  /**
   * Variable para almacenar el tipo de público.
   */
  tipoDePublicos: string = '';

  /**
   * Variable para almacenar el tipo de público.
   */
  tipoDePublicos1: string = '';
  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaRadioOptions = TIPO_PERSONA_RADIO_OPTIONS;
  /**
   * Opciones de radio para seleccionar la nacionalidad de los terceros.
   */
  tercerosNacionalidadRadioOptions = TERCEROS_NACIONALIDAD_RADIO_OPTIONS;
  /** 
  /** Indica si el formulario está visible */
  esFormularioVisible = false;
  /**
   * Notificación actual que se mostrará en el componente.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice del elemento que se eliminará de la lista.
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos gestionados en el componente.
   */
  pedimentos: Array<Pedimento> = [];

  /** Datos del catálogo de países */
  public paisData: CatalogosSelect = {
    labelNombre: 'Pais',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };
  /** Estado del destinatario que se está agregando */
  agregarDestinatarioState!: Solicitud260919State;

  /**
   * Datos de la tabla que se mostrarán en el componente.
   */
  tableData: FilaTablaData[] = [];

  /**
   * Identificador único para las filas de la tabla.
   */
  private nextId = 1;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /** Consulta de estado para la solicitud */
  consultaDatos!: ConsultaioState;
  /** Indica si el formulario es de solo lectura */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param importarDeRemediosHerbals - Servicio para obtener datos relacionados con terceros.
   */
  constructor(
    private importarDeRemediosHerbals: ImportarDeRemediosHerbalsService,
    private fb: FormBuilder,
    private solicitud260919Store: Solicitud260919Store,
    private solicitud260919Query: Solicitud260919Query,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama a los métodos para obtener los datos de destinatarios, fabricantes, proveedores y facturadores.
   */
  ngOnInit(): void {
    this.solicitud260919Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.agregarDestinatarioState = seccionState;
        })
      )
      .subscribe();
    this.crearFormTransporte();
    this.getFabricanteData();
    this.getDestinatarioData();
    this.getFacturadorData();
    this.getProveedorData();
    this.getPaisData();

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
   * Crea el formulario reactivo para gestionar los datos del destinatario.
   * Incluye los campos necesarios con sus validaciones correspondientes.
   */
  crearFormTransporte(): void {
    this.destinatarioForm = this.fb.group({
      agregarDestinatario: this.fb.group({
        tipoPersona: [
          this.agregarDestinatarioState?.tipoPersona,
          Validators.required,
        ],
        nacionalidad: [
          this.agregarDestinatarioState?.nacionalidad,
          Validators.required,
        ],
      }),
      datosPersonales: this.fb.group({
        nombre: [this.agregarDestinatarioState?.nombre, Validators.required],
        primerApellido: [
          this.agregarDestinatarioState?.primerApellido,
          Validators.required,
        ],
        segundoApellido: [
          this.agregarDestinatarioState?.segundoApellido,
          Validators.required,
        ],
        denominacion: [
          this.agregarDestinatarioState?.denominacion,
          Validators.required,
        ],
        pais: [this.agregarDestinatarioState?.pais, Validators.required],
        domicilio: [
          this.agregarDestinatarioState?.domicilio,
          Validators.required,
        ],
        estado: [this.agregarDestinatarioState?.estado, Validators.required],
        codigopostal: [
          this.agregarDestinatarioState?.codigopostal,
          Validators.required,
        ],
        calle: [this.agregarDestinatarioState?.calle, Validators.required],
        numeroExterior: [
          this.agregarDestinatarioState?.numeroExterior,
          Validators.required,
        ],
        numeroInterior: [
          this.agregarDestinatarioState?.numeroInterior,
          Validators.required,
        ],
        lada: [this.agregarDestinatarioState?.lada],
        telefono: [this.agregarDestinatarioState?.telefono],
        correoElectronico: [this.agregarDestinatarioState?.correoElectronico],
        rfc: [{ value: this.agregarDestinatarioState?.rfc, disabled: true }],
        curp: [{ value: this.agregarDestinatarioState?.curp, disabled: true }],
      }),
    });
  }

  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.destinatarioForm?.disable();
      this.agregarDestinatario.disable();
    } else {
      this.destinatarioForm?.enable();
      this.agregarDestinatario.enable();
    }
  }

  /**
   * Método para obtener los datos de los fabricantes.
   * Realiza una solicitud al servicio `ImportarDeRemediosHerbalsService` para obtener los datos de los fabricantes.
   * Los datos obtenidos se asignan a la propiedad `fabricanteDatos`.
   */
  getFabricanteData(): void {
    this.importarDeRemediosHerbals
      .getFabricanteData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.fabricanteDatos = data as unknown as FilaTablaData[];
      });
  }

  /**
   * Método para obtener los datos de los destinatarios.
   * Realiza una solicitud al servicio `ImportarDeRemediosHerbalsService` para obtener los datos de los destinatarios.
   * Los datos obtenidos se asignan a la propiedad `destinatarioDatos`.
   */
  getDestinatarioData(): void {
    this.importarDeRemediosHerbals
      .getDestinatarioData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.destinatarioDatos = data as unknown as FilaTablaData[];
      });
  }

  /**
   * Método para obtener los datos de los proveedores.
   * Realiza una solicitud al servicio `ImportarDeRemediosHerbalsService` para obtener los datos de los proveedores.
   * Los datos obtenidos se asignan a la propiedad `proveedorDatos`.
   */
  getProveedorData(): void {
    this.importarDeRemediosHerbals
      .getProveedorData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.proveedorDatos = data as unknown as FilaTablaData[];
      });
  }

  /**
   * Método para obtener los datos de los facturadores.
   * Realiza una solicitud al servicio `ImportarDeRemediosHerbalsService` para obtener los datos de los facturadores.
   * Los datos obtenidos se asignan a la propiedad `facturadorDatos`.
   */
  getFacturadorData(): void {
    this.importarDeRemediosHerbals
      .getFacturadorData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.facturadorDatos = data as unknown as FilaTablaData[];
      });
  }
  /** Elimina un pedimento de la lista.*/
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
      this.eliminarMercancias();
      this.abrirModal(0, true);
    }
  }
  /**
   * Abre un modal para mostrar una notificación.
   * Si `isDeleted` es verdadero, muestra un mensaje de éxito indicando que los datos fueron eliminados.
   * Si hay filas seleccionadas, muestra un mensaje de confirmación para la eliminación.
   *
   * @param i Índice del elemento a eliminar (por defecto 0).
   * @param isDeleted Indica si se debe mostrar el mensaje de éxito por eliminación.
   */
  abrirModal(i: number = 0, isDeleted: boolean = false): void {

    if (isDeleted) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'success',
        modo: 'action',
        titulo: '',
        mensaje: 'Datos eliminados correctamente',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else if (this.selectedRows && this.selectedRows.size > 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.elementoParaEliminar = i; 
    }
  
}
  /**
   * Maneja el evento de cambio de filas seleccionadas en la tabla.
   * Actualiza el conjunto de filas seleccionadas y oculta el formulario si es visible.
   *
   * @param selectedRows Filas seleccionadas en la tabla.
   */
 enCambioDeFilasSeleccionadas(selectedRows: FilaTablaData[], tableName: string): void {
  this.currentTable = tableName;
  switch (tableName) {
    case 'fabricante':
      this.filasSeleccionadasFabricante = new Set(selectedRows.map((row) => row.id));
      break;
    case 'destinatario':
      this.filasSeleccionadasDestinatario = new Set(selectedRows.map((row) => row.id));
      break;
    case 'proveedor':
      this.filasSeleccionadasProveedor = new Set(selectedRows.map((row) => row.id));
      break;
    case 'facturador':
      this.filasSeleccionadasFacturador = new Set(selectedRows.map((row) => row.id));
      break;
    default:
      console.error('Invalid table name');
  }
}
  /**
   * Maneja el evento de eliminación de filas seleccionadas.
   */
enEliminado(tableName: string): void {
  this.currentTable = tableName;

  let selectedRows: Set<number>;
  switch (this.currentTable) {
    case 'fabricante':
      selectedRows = this.filasSeleccionadasFabricante;
      break;
    case 'destinatario':
      selectedRows = this.filasSeleccionadasDestinatario;
      break;
    case 'proveedor':
      selectedRows = this.filasSeleccionadasProveedor;
      break;
    case 'facturador':
      selectedRows = this.filasSeleccionadasFacturador;
      break;
    default:
      console.error('Invalid table selection:', this.currentTable);
      return;
  }

  if (selectedRows.size > 0) {
     

  this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
       this.elementoParaEliminar = 0; 

  } else {
    console.warn('No rows selected for deletion.');
  }
}
  /**
   * Abre el formulario para modificar las mercancías seleccionadas.
   */
  openModificarMercancias(): void {
  let selectedRows: Set<number>;

  switch (this.currentTable) {
    case 'fabricante':
      selectedRows = this.filasSeleccionadasFabricante;
      break;
    case 'destinatario':
      selectedRows = this.filasSeleccionadasDestinatario;
      break;
    case 'proveedor':
      selectedRows = this.filasSeleccionadasProveedor;
      break;
    case 'facturador':
      selectedRows = this.filasSeleccionadasFacturador;
      break;
    default:
      console.error('Invalid table selection:', this.currentTable);
      return;
  }

  if (selectedRows.size === 1) {
    const SELECTED_ID = Array.from(selectedRows)[0];
    let selectedRowData: FilaTablaData | undefined;

    switch (this.currentTable) {
      case 'fabricante':
        selectedRowData = this.fabricanteDatos.find((row) => row.id === SELECTED_ID);
        break;
      case 'destinatario':
        selectedRowData = this.destinatarioDatos.find((row) => row.id === SELECTED_ID);
        break;
      case 'proveedor':
        selectedRowData = this.proveedorDatos.find((row) => row.id === SELECTED_ID);
        break;
      case 'facturador':
        selectedRowData = this.facturadorDatos.find((row) => row.id === SELECTED_ID);
        break;
      default:
        console.error('Invalid table selection:', this.currentTable);
        return;
    }

    if (selectedRowData) {
      this.selectedRow = selectedRowData; 

      const PAIS_ID = this.paisData.catalogos.find(
        (catalogo) =>
          catalogo.descripcion === selectedRowData.pais ||
          String(catalogo.id) === String(selectedRowData.pais)
      )?.id;

      this.destinatarioForm.patchValue({
        agregarDestinatario: {
          tipoPersona: selectedRowData.tipoPersona || 'fisica',
        },
        datosPersonales: {
           nombre: selectedRowData.tipoPersona === 'fisica' ? selectedRowData.nombre : '',
          primerApellido: selectedRowData.tipoPersona === 'fisica' ? selectedRowData.primerApellido : '',
          segundoApellido: selectedRowData.tipoPersona === 'fisica' ? selectedRowData.segundoApellido : '',
          denominacion: selectedRowData.denominacion,
          pais: PAIS_ID || '',
          domicilio: selectedRowData.domicilio,
          estado: selectedRowData.estado,
          codigopostal: selectedRowData.codigopostal,
          calle: selectedRowData.calle,
          numeroExterior: selectedRowData.numeroExterior,
          numeroInterior: selectedRowData.numeroInterior,
          lada: selectedRowData.lada,
          telefono: selectedRowData.telefono,
          correoElectronico: selectedRowData.correoElectronico,
        },
      });

      this.tipoPersonaSeleccionada = selectedRowData.tipoPersona || 'fisica';
      this.esFormularioVisible = true; 
      console.warn('No data found for the selected row.');
    }
  } else {
    console.warn('Please select exactly one row to modify.');
  }
}
  /**
   * Abre el formulario para agregar nuevas mercancías.
   */

    agregarMercancias(tableName: string, title: string): void {
        if (!['fabricante', 'destinatario', 'proveedor', 'facturador'].includes(tableName)) {
    console.error('Invalid table name:', tableName);
    return;
  }
    this.currentTable = tableName; 
    this.formTitle = title; 
    this.esFormularioVisible = true; 
    this.destinatarioForm.reset(); 

  }
  /**
   * Obtiene los datos del catálogo de países.
   */
  getPaisData(): void {
    this.importarDeRemediosHerbals
      .getPaisData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.paisData.catalogos = data as Catalogo[];
      });
  }

  /**
   * Getter para obtener el tipo de persona seleccionado.
   */
  get selectedTipoPersona(): string | undefined {
    return this.agregarDestinatario.get('tipoPersona')?.value;
  }
  /**
   * Getter para obtener el nacionalidad seleccionado.
   */
  get selectedNacionalidad(): string | undefined {
    return this.agregarDestinatario.get('nacionalidad')?.value;
  }
  /**
   * Establece el tipo de persona seleccionado.
   * @param value Valor seleccionado (cadena o número).
   */
  setTipoPersona(value: string | number): void {
    this.tipoPersonaSeleccionada = value.toString();
  }
  /**
   * Establece la nacionalidad seleccionada.
   * @param value Valor seleccionado (cadena o número).
   */
  setNacionalidad(value: string | number): void {
    this.tipoPersonaSeleccionada = value.toString();
  }
  /**
   * Getter para obtener el formulario de agregar destinatario.
   */
  get agregarDestinatario(): FormGroup {
    return this.destinatarioForm.get('agregarDestinatario') as FormGroup;
  }

  /**
   * Guarda los datos del formulario en la tabla.
   */
onGuardar(): void {
  const FORM_DATA = this.destinatarioForm.value;
  let targetTable: FilaTablaData[] = [];
  switch (this.currentTable) {
    case 'fabricante':
      targetTable = this.fabricanteDatos;
      break;
    case 'destinatario':
      targetTable = this.destinatarioDatos;
      break;
    case 'proveedor':
      targetTable = this.proveedorDatos;
      break;
    case 'facturador':
      targetTable = this.facturadorDatos;
      break;
    default:
      console.error('Invalid table selection');
      return;
  }

  if (this.selectedRow) {
    const INDEX = targetTable.findIndex((row) => row.id === this.selectedRow?.id);
    if (INDEX !== -1) {
      const UPDATED_ROW = {
        ...targetTable[INDEX],
        ...FORM_DATA.agregarDestinatario,
        ...FORM_DATA.datosPersonales,
      };
      targetTable[INDEX] = UPDATED_ROW;

      if (this.currentTable === 'fabricante') {
        this.fabricanteDatos = [...targetTable];
      } else if (this.currentTable === 'destinatario') {
        this.destinatarioDatos = [...targetTable];
      } else if (this.currentTable === 'proveedor') {
        this.proveedorDatos = [...targetTable];
      } else if (this.currentTable === 'facturador') {
        this.facturadorDatos = [...targetTable];
      }
    }
  } else {
    const NEW_ID =
      targetTable.length > 0
        ? Math.max(...targetTable.map((row) => row.id || 0)) + 1
        : 1;
    const NEW_ROW = {
      id: NEW_ID,
      ...FORM_DATA.agregarDestinatario,
      ...FORM_DATA.datosPersonales,
    };

    if (this.currentTable === 'fabricante') {
      this.fabricanteDatos = [...this.fabricanteDatos, NEW_ROW];
    } else if (this.currentTable === 'destinatario') {
      this.destinatarioDatos = [...this.destinatarioDatos, NEW_ROW];
    } else if (this.currentTable === 'proveedor') {
      this.proveedorDatos = [...this.proveedorDatos, NEW_ROW];
    } else if (this.currentTable === 'facturador') {
      this.facturadorDatos = [...this.facturadorDatos, NEW_ROW];
    }
  }

  this.destinatarioForm.reset();
  this.esFormularioVisible = false;
  this.selectedRow = null; 
}
  /**
   * Elimina las mercancías seleccionadas de la tabla.
   */
eliminarMercancias(): void {
  let selectedRows: Set<number>;

  switch (this.currentTable) {
    case 'fabricante':
      selectedRows = this.filasSeleccionadasFabricante;
      this.fabricanteDatos = this.fabricanteDatos.filter(
        (row) => !selectedRows.has(row.id)
      );
      break;
    case 'destinatario':
      selectedRows = this.filasSeleccionadasDestinatario;
      this.destinatarioDatos = this.destinatarioDatos.filter(
        (row) => !selectedRows.has(row.id)
      );
      break;
    case 'proveedor':
      selectedRows = this.filasSeleccionadasProveedor;
      this.proveedorDatos = this.proveedorDatos.filter(
        (row) => !selectedRows.has(row.id)
      );
      break;
    case 'facturador':
      selectedRows = this.filasSeleccionadasFacturador;
      this.facturadorDatos = this.facturadorDatos.filter(
        (row) => !selectedRows.has(row.id)
      );
      break;
    default:
      console.error('Invalid table selection:', this.currentTable);
      return;
  }

  selectedRows.clear();

  this.nuevaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'success',
    modo: 'action',
    titulo: '',
    mensaje: 'Datos eliminados correctamente',
    cerrar: false,
    tiempoDeEspera: 0,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: '',
  };

}
  /**
   * Limpia los datos del formulario.
   */
  limpiarFormulario(): void {
    this.destinatarioForm.reset();
  }

  /**
   * Cancela la visualización del formulario.
   */
  cancelarFormulario(): void {
    this.esFormularioVisible = false;
  }

  /**
   * Establece valores en el store a partir del formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Método del store para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud260919Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud260919Store[metodoNombre] as (value: unknown) => void)(
      VALOR
    );
  }
  /**
   * Método que se ejecuta al destruir el componente.
   * Marca el observable `destroyed$` como completado para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
