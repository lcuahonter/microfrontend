
import { Agentes_DATOS, AgentestableDatos, MERCANCIA_TABLEDOS_TABLE_BODY_DATA } from '../../constantes/datos-del-tramite.enum';
import {
  Catalogo,
  CategoriaMensaje,
  ConsultaioQuery,
  Notificacion,
  TablaDinamicaComponent,
  TablaSeleccion,
  TableComponent,
  TipoNotificacionEnum,
  TituloComponent,
  NotificacionesComponent,
  REGEX_LLAVE_DE_PAGO_DE_DERECHO
} from '@ng-mf/data-access-user';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Solicitud105State, Tramite105Store } from '../../estados/tramite105.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { InvoCarService } from '../../services/invocar.service';
import { Tramite105Query } from '../../estados/tramite105.query';
import mercanciaTable from '@libs/shared/theme/assets/json/105/mercancia-table.json';
import { tableDatos } from '../../constantes/datos-del-tramite.enum';

/**
 * Interfaz que representa los datos del cuerpo de la tabla de mercancías.
 * 
 * @interface TableBodyData
 */
interface TableBodyData {
  /**
   * Datos del cuerpo de la tabla.
   * 
   * @type {string[]}
   * @memberof TableBodyData
   */
  tbodyData: string[];
}

/**
 * Componente para gestionar los datos del trámite dos.
 * 
 * Este componente permite capturar información relacionada con el trámite, como operaciones, mercancías, y agentes aduanales.
 * 
 * @export
 * @class DatosDelTramiteDosComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
/**
 * Componente que gestiona los datos del trámite dos.
 * 
 * Este componente incluye formularios para capturar información relacionada con el trámite,
 * como datos del agente aduanal y mercancías. También maneja la interacción con un modal
 * y la comunicación con un store para gestionar el estado de la solicitud.
 * 
 * @export
 * @class DatosDelTramiteDosComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-datos-del-tramite-dos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    TableComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    NotificacionesComponent
  ],
  templateUrl: './datos-del-tramite-dos.component.html',
  styleUrl: './datos-del-tramite-dos.component.scss',
})
export class DatosDelTramiteDosComponent implements OnInit, OnDestroy {
  /**
   * Valida el formulario principal `datosDelTramiteDos` y actualiza el estado de validez en el store.
   *
   * - Marca todos los campos del formulario como tocados para mostrar los errores de validación.
   * - Si el formulario es inválido, establece el estado de validez en `false` en el store.
   * - Si el formulario es válido, establece el estado de validez en `true` en el store.
   *
   * @returns {any} No retorna ningún valor específico, solo actualiza el estado de validez.
   */
validarFormularios(): any {
    this.datosDelTramiteDos.markAllAsTouched(); // Show validation errors
    this.store.setValidFormularioTramiteDo(this.datosDelTramiteDos.invalid ? false : true);
}

 /**
   * Un arreglo de objetos `tableDatos` que contiene los datos para la tabla.
   * Estos datos se inicializan como un arreglo vacío.
   */
  public mercanciTablaDatosStore: tableDatos[] = [];
  /**
   * Limita el campo numeroPatente a 4 dígitos y actualiza el valor en el formulario.
   */
  onNumeroPatenteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
    this.agenteForm.get('numeroPatente')?.setValue(input.value);
  }
  /**
   * Índice de la mercancía seleccionada en la tabla
   */
  /**
   * Índice de la mercancía seleccionada en la tabla.
   * Es null si no hay ninguna seleccionada.
   */
  public selectedMercanciaIndex: number|null = null;

  /**
   * Arreglo de filas de mercancía seleccionadas en la tabla.
   */
  public selectedMercanciaRows: AgentestableDatos[] = [];

  /**
   * Indica si el botón de eliminar debe estar habilitado (true si hay al menos una fila seleccionada).
   */
  public canDelete: boolean = false;

  /**
   * Indica si el botón de editar debe estar habilitado (true si hay exactamente una fila seleccionada).
   */
  public canEdit: boolean = false;
  /**
   * Maneja la selección de una fila de la tabla de mercancías
   */
  /**
   * Índice de la mercancía seleccionada en la tabla
   */
    /**
     * Notificación que se muestra al usuario.
     */
  public nuevaNotificacionEliminar: Notificacion | null = null;

       /**
       * Notificación que se muestra al usuario.
       */
    public nuevaNotificacion: Notificacion | null = null;
      /**
       * Notificación que se muestra al usuario.
       */
    public nuevaNotificacionAudona: Notificacion | null = null;
  

  /**
   * Notificación que se muestra al usuario cuando hay un error o alerta relacionado con la selección de filas en la tabla.
   * Por ejemplo, cuando se intenta modificar o eliminar sin seleccionar filas, o se seleccionan múltiples filas para una acción que requiere solo una.
   */
  public nuevaNotificacionRowselect: Notificacion | null = null;
  /**
   * Maneja la selección de filas en la tabla de mercancías.
   *
   * - Actualiza el arreglo de filas seleccionadas.
   * - Habilita o deshabilita los botones de eliminar y editar según la cantidad de filas seleccionadas.
   * - Si hay una sola fila seleccionada, guarda su índice para edición; si no, lo limpia.
   *
   * @param rows Arreglo de filas seleccionadas de tipo AgentestableDatos.
   */
  onMercanciaRowsSelected(rows: AgentestableDatos[]) {
    this.selectedMercanciaRows = rows;
    this.canDelete = rows.length > 0;
    this.canEdit = rows.length === 1;
    if (rows.length === 1) {
      this.selectedMercanciaIndex = this.mercanciTablaDatos.findIndex(item => item === rows[0]);
    } else {
      this.selectedMercanciaIndex = null;
    }
  }
  /**
   * Limpia el valor del dropdown 'operaciones' en el formulario datosDelTramiteDos.
   */
  public clearOperacionesDropdown(): void {
    this.datosDelTramiteDos.get('operaciones')?.setValue(null);
  }
    /**
     * @method aceptarConfirmationPopup
     * Abre un popup de confirmación para eliminar los registros seleccionados.
     * Si no hay registros seleccionados, no realiza ninguna acción.
     */
    aceptarConfirmationPopup(): void {
        if (!this.agenteForm.valid) {
      this.agenteForm.markAllAsTouched();
      return;
    }
    else{
      this.aceptarConfirmacion();
          
    }

    }

      /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
 public aceptarConfirmacion() {
        // Get the current operaciones value from the main form
        const operacionesValue = this.datosDelTramiteDos.get('operaciones')?.value;
        // Always find the label (descripcion) for the selected id using filter
        let operacionesLabel = operacionesValue;
        if (operacionesLabel &&this.operaciones && Array.isArray(this.operaciones)) {
          const filtered = this.operaciones?.filter(op => op?.clave == operacionesValue);
          if (filtered.length > 0 && filtered[0].descripcion) {
            operacionesLabel = filtered[0].descripcion;
          }
        }
        // Merge label into the new/updated row
        const MERCANCIA = { ...this.agenteForm.value, operaciones: operacionesLabel } as AgentestableDatos;
        // Check for duplicate (all fields must match, except for the row being updated)
        // List the fields to compare for duplicates
        const compareFields: (keyof AgentestableDatos)[] = ['nombres', 'primerApellido', 'segundoApellido', 'numeroPatente', 'operaciones'];
        const isDuplicate = this.mercanciTablaDatos.some((row, idx) => {
          if (this.selectedMercanciaIndex !== null && this.selectedMercanciaIndex > -1 && idx === this.selectedMercanciaIndex) {
            return false; // skip self when updating
          }
          return compareFields.every(key => row[key] === MERCANCIA[key]);
        });
        if (isDuplicate) {
          this.cerrarModal();
          this.nuevaNotificacion = {
            tipoNotificacion: TipoNotificacionEnum.ALERTA,
            categoria: CategoriaMensaje.ERROR,
            modo: 'modal',
            titulo: '',
            mensaje: 'Esta patente ya fue capturada.',
            cerrar: false,
            txtBtnAceptar: 'Aceptar',
            txtBtnCancelar: '',
          };
          return;
        }
        if (this.selectedMercanciaIndex !== null && this.selectedMercanciaIndex > -1) {
          // Update existing
          this.mercanciTablaDatos[this.selectedMercanciaIndex] = MERCANCIA;
          this.selectedMercanciaIndex = null;
        } else {
          // Add new
          this.mercanciTablaDatos.push(MERCANCIA);
        }
        this.mercanciTablaDatos = [...this.mercanciTablaDatos];
        this.store.setValidFormularioMerciniaDos(this.mercanciTablaDatos);
        this.agenteForm.reset();
        this.clearOperacionesDropdown()
        if(!isDuplicate)
        {
        let addAccept='El agente aduanal fue agregado correctamente.';
       if (this.selectedMercanciaIndex !== null && this.selectedMercanciaIndex > -1) {
        addAccept='Datos guardados correctamente.';
       }
      this.cerrarModal();
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: addAccept,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
        }
  }

  /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
  onEliminarConfirmacion(confirmado: boolean) {
    if (confirmado) {
      this.confirmarEliminarMercancia();
    } else {
      this.nuevaNotificacionEliminar = null;
    }
  }

    /**
   * Cierra el modal de confirmación y limpia el formulario de agregar mercancía.
   */
  public aceptarConfirmacionClose(): void {
    this.cerrarModal();
  }

   /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
  onEliminarRowselect(confirmado: boolean) {
    this.nuevaNotificacionRowselect = null;
  
  }
  /**
   * @method abrirElimninarConfirmationopup
   * Abre un popup de confirmación para eliminar los registros seleccionados.
   * Si no hay registros seleccionados, no realiza ninguna acción.
   */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacionEliminar = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }

  /**
   * Confirma la eliminación después de aceptar en el popup
   */
  confirmarEliminarMercancia() {
    if (this.selectedMercanciaRows && this.selectedMercanciaRows.length > 0) {
      this.selectedMercanciaRows.forEach(row => {
        const idx = this.mercanciTablaDatos.findIndex(item => item === row);
        if (idx > -1) {
          this.mercanciTablaDatos.splice(idx, 1);
        }
      });
      this.mercanciTablaDatos = [...this.mercanciTablaDatos];
      // Clear selection and disable buttons
      this.canDelete = false;
      this.canEdit = false;
      this.nuevaNotificacionEliminar = null;
    }
  }

  /**
   * Elimina la mercancía seleccionada de la tabla
   */
  eliminarMercancia() {
    if (this.selectedMercanciaRows && this.selectedMercanciaRows.length > 0) {
      this.abrirElimninarConfirmationopup();
    }
    else{
      this.nuevaNotificacionRowselect = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ERROR,
        modo: 'modal',
        titulo: 'Alerta',
        mensaje: 'Por favor seleccione un elemento para eliminar.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Modifica la mercancía seleccionada (carga los datos en el formulario)
   */
  modificarMercancia() {
    if (this.selectedMercanciaRows && this.selectedMercanciaRows.length === 1) {
      const index = this.mercanciTablaDatos.findIndex(item => item === this.selectedMercanciaRows[0]);
      if (index !== -1) {
        const mercancia = this.mercanciTablaDatos[index];
        this.agenteForm.patchValue(mercancia);
        // Abrir modal si es necesario
        const modal = document.getElementById('modalAgregar');
        if (modal && (window as any).bootstrap?.Modal) {
          (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
        }
      }
    } else if (this.selectedMercanciaRows && this.selectedMercanciaRows.length > 1) {
      this.nuevaNotificacionRowselect = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ERROR,
        modo: 'modal',
        titulo: '',
        mensaje: 'Selecciona sólo un registro para modificar.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      this.nuevaNotificacionRowselect = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ERROR,
        modo: 'modal',
        titulo: '',
        mensaje: 'Selecciona un registro.',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }
  /**
   * Formulario principal para los datos del trámite dos.
   * 
   * @type {FormGroup}
   * @memberof DatosDelTramiteDosComponent
   */
  public datosDelTramiteDos!: FormGroup;

  /**
   * Formulario para los datos del agente aduanal.
   * 
   * @type {FormGroup}
   * @memberof DatosDelTramiteDosComponent
   */
  public agenteForm!: FormGroup;

  /**
   * Formulario para agregar mercancías.
   * 
   * @type {FormGroup}
   * @memberof DatosDelTramiteDosComponent
   */
  public agregarForm!: FormGroup;

  /**
   * Estado del modal.
   * 
   * @type {string}
   * @memberof DatosDelTramiteDosComponent
   */
  public modal: string = 'modal';

  /**
   * Sujeto para notificar la destrucción del componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof DatosDelTramiteDosComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud.
   * 
   * @type {Solicitud105State}
   * @memberof DatosDelTramiteDosComponent
   */
  public solicitudState!: Solicitud105State;

  /**
   * Referencia al elemento del modal.
   * 
   * @type {ElementRef}
   * @memberof DatosDelTramiteDosComponent
   */
  @ViewChild('modal') modalElement!: ElementRef;

  /**
   * Referencia al botón de cerrar modal.
   * 
   * @type {ElementRef}
   * @memberof DatosDelTramiteDosComponent
   */
  @ViewChild('closeModal') closeModal!: ElementRef;
  


  /**
   * Catálogo de operaciones.
   * 
   * @type {CatalogosSelect}
   * @memberof DatosDelTramiteDosComponent
   */
  operaciones: Catalogo[] = []



  /**
   * Datos de la tabla de mercancías.
   * 
   * @type {any}
   * @memberof DatosDelTramiteDosComponent
   */
  public getMercanciaTableData = mercanciaTable;

  /**
   * Encabezado de la tabla de mercancías.
   * 
   * @type {string[]}
   * @memberof DatosDelTramiteDosComponent
   */
  public mercanciaHeaderData: string[] = [];

  /**
   * Cuerpo de la tabla de mercancías.
   * 
   * @type {TableBodyData[]}
   * @memberof DatosDelTramiteDosComponent
   */
  public mercanciaBodyData: TableBodyData[] = [];

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Constructor de formularios.
   * @param {Tramite105Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite105Query} query - Query para obtener datos del estado.
   * @param {InvoCarService} invoCarService - Servicio para obtener datos de catálogos.
   * @memberof DatosDelTramiteDosComponent
   */



/**
     * Configuración de la tabla utilizada en el componente para mostrar los datos del acuse.
     * 
     * @remarks
     * Esta propiedad almacena la configuración de columnas, formato y otros parámetros
     * necesarios para renderizar la tabla de datos del acuse en la interfaz de usuario.
     * 
     * @see ACUSE_DATOS para la definición de la configuración.
     */
  public configuracionTabla = Agentes_DATOS;

  /**
   * Un arreglo de objetos `AcuseTablaDatos` que contiene los datos para la tabla.
   * Estos datos se inicializan a partir de la constante `TablaDatos`.
   */
  public mercanciTablaDatos: AgentestableDatos[] = [];


  /**
   * Representa el tipo de selección de checkbox utilizado en el componente.
   * Esto se establece al valor de `TablaSeleccion.CHECKBOX`.
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Tramite105Store,
    private query: Tramite105Query,
    private invoCarService: InvoCarService,
    private consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (seccionState.update) {
            this.fetchTableDummyJson();
          }
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * @memberof DatosDelTramiteDosComponent
   */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })

      )
      .subscribe();

    this.getOperaciones();
    this.obtenerMercancia();
    this.crearFormularios()
    this.inicializarEstadoFormulario();
    this.clearOperacionesDropdown();
  }
  /**
     * Evalúa si se debe inicializar o cargar datos en el formulario.  
     * Además, obtiene la información del catálogo de mercancía.
     */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe()
    this.crearFormularios();
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosDelTramiteDos.disable();
      this.agenteForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.datosDelTramiteDos.enable();
      this.agenteForm.enable();
    }
  }

  /**
 * Método para obtener datos de ejemplo para la tabla.
 * Retorna un arreglo vacío de tipo TablaDatos.
 *
 * @returns Un arreglo vacío de TablaDatos.
 */
  fetchTableDummyJson(): void {
    this.mercanciaBodyData.push(MERCANCIA_TABLEDOS_TABLE_BODY_DATA);
  }

  /**
   * Inicializa y crea los formularios reactivos utilizados en el componente.
   * 
   * Este método configura dos formularios:
   * - `datosDelTramiteDos`: Contiene los campos relacionados con el trámite, 
   *   inicializados con valores provenientes del estado de la solicitud y con validadores requeridos.
   * - `agenteForm`: Contiene los campos para los datos del agente, todos con validadores requeridos.
   * 
   * @returns {void} No retorna ningún valor.
   */
  crearFormularios(): void {
    this.datosDelTramiteDos = this.fb.group({
      procedimientoCargaDescarga: [this.solicitudState?.procedimientoCargaDescarga, [Validators.required, Validators.maxLength(200)]],
      sistemasMedicionUbicacion: [this.solicitudState?.sistemasMedicionUbicacion, [Validators.required, Validators.maxLength(200)]],
      motivoNoDespachoAduana: [this.solicitudState?.motivoNoDespachoAduana, [Validators.required, Validators.maxLength(200)]],
      operaciones: [this.solicitudState?.operaciones],
    });

    this.agenteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(200)]],
      segundoApellido: ['', [Validators.required, Validators.maxLength(200)]],
      numeroPatente: ['', [Validators.required, Validators.maxLength(4)]],
    });

  }
  /**
   * Cierra el modal.
   * 
   * @memberof DatosDelTramiteDosComponent
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Obtiene los datos de mercancías.
   * 
   * @memberof DatosDelTramiteDosComponent
   */
  public obtenerMercancia(): void {
    this.mercanciaHeaderData = this.getMercanciaTableData.mercanciaTabledos.tableHeader;
  }

  /**
   * Establece valores en el store.
   * 
   * @param {FormGroup} form - Formulario.
   * @param {string} campo - Nombre del campo.
   * @param {keyof Tramite105Store} metodoNombre - Nombre del método del store.
   * @memberof DatosDelTramiteDosComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite105Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
    this.store.setValidFormularioTramiteDo(this.datosDelTramiteDos.invalid ? false : true);
  }

  /**
   * Abre el modal.
   * 
   * @memberof DatosDelTramiteDosComponent
   */
  public abrirModal(): void {
    const operacionesValue = this.datosDelTramiteDos.get('operaciones')?.value;
  if (operacionesValue === null || operacionesValue === undefined || operacionesValue === '') {
    this.nuevaNotificacionAudona = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Por favor seleccione un elemento para eliminar.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    // Do NOT open the modal
    return;
  }

  // Open the modal using Bootstrap JS API
  const modalElement = document.getElementById('modalAgregar');
  if (modalElement && (window as any).bootstrap?.Modal) {
    (window as any).bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }
    
  }


  
  /**
   * Obtiene las operaciones desde el servicio.
   * 
   * @memberof DatosDelTramiteDosComponent
   */
  getOperaciones(): void {
     this.invoCarService.tipoDeFigura().pipe(takeUntil(this.destroyNotifier$)).subscribe((resp) => {
       if (resp.datos) {
        const RESPONSE = resp.datos;
        this.operaciones = RESPONSE;
      }
    });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * @memberof DatosDelTramiteDosComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.modal = 'modal';
  }
}