import { Catalogo, CatalogoSelectComponent,TableBodyData, TableComponent, TablePaginationComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { NotificacionesComponent, Notificacion } from '@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component';
import { Component, EventEmitter,Input,OnDestroy, OnInit, Output } from '@angular/core';
import {ConsultaioQuery,ConsultaioState,CategoriaMensaje,TipoNotificacionEnum} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, distinctUntilChanged,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelInmueble104Query } from '../../../../core/queries/tramite104.query';
import { DatosDelInmueble104Store } from '../../../../core/estados/tramites/tramite104.store';
import { MENSAJEDE_ALERTA } from '@libs/shared/data-access-user/src/core/enums/104/104.enum';
import { TableData } from '@libs/shared/data-access-user/src/core/models/104/model-104';
import destinatarioTableData from '@libs/shared/theme/assets/json/104/table-104.json'
import dropDown from '@libs/shared/theme/assets/json/104/selector-104.json'

@Component({
  selector: 'app-datos-del-inmueble',
  standalone: true,
  imports: [CommonModule, TituloComponent,
    TableComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,TablePaginationComponent, NotificacionesComponent],
  templateUrl: './datos-del-inmueble.component.html',
  styleUrl: './datos-del-inmueble.component.scss',
})
export class DatosDelInmuebleComponent implements OnInit, OnDestroy {
  /**
     * Restaura el formulario de dirección a su estado inicial y cierra el modal.
     * Útil para el botón "Cancelar" del formulario modal.
     * @returns {void}
     */
  
    public cancelarFormularioDireccion(): void {
      this.limpiarFormularioDireccion();
      // Cierra el modal programáticamente
      setTimeout(() => {
        const modal = document.getElementById('modalAgregar');
        if (modal) {
          (window as any).bootstrap?.Modal?.getInstance(modal)?.hide();
        }
      }, 0);
    }
   /**
 * Limpia todos los campos del formulario de dirección excepto el campo 'pais'.
 *
 * - Establece los valores de todos los controles del formulario en vacío (''),
 *   excepto el control 'pais', que conserva su valor actual.
 * - Útil para el botón "Limpiar" en el formulario, permitiendo al usuario
 *   reiniciar los datos ingresados sin perder la selección de país.
 *
 * @returns {void}
 */
  public limpiarFormularioDireccion(): void {
      if (!this.formularioDireccion) return;
      const paisValue = this.formularioDireccion.get('pais')?.value;
      const emptyValues: any = {};
      Object.keys(this.formularioDireccion.controls).forEach(key => {
        if (key !== 'pais') {
          emptyValues[key] = '';
        }
      });
      this.formularioDireccion.patchValue(emptyValues);
      if (paisValue !== undefined) {
        this.formularioDireccion.patchValue({ pais: paisValue });
      }
    }
  /**
   * Indica si el formulario de establecimiento está en modo edición.
   * Cuando es true, el formulario permite modificar un registro existente en lugar de agregar uno nuevo.
   * Se utiliza para controlar el comportamiento del modal y los botones de acción.
   */
  public isEditMode: boolean = false;

  /**
   * **Evento de cierre**  
   * 
   * Se emite cuando el usuario hace clic en cerrar.  
   * Puede utilizarse para manejar el cierre del componente desde el padre.
   */
  @Output() cerrarClicado = new EventEmitter();

    /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;


  /**
   * **Formulario de Fomento a la Exportación**  
   * 
   * Contiene los campos relacionados con la solicitud de fomento a la exportación.
   */
  fomentoExportacionForm!: FormGroup;

  /**
   * **Formulario de Dirección**  
   * 
   * Almacena los datos de dirección asociados a la solicitud.
   */
  formularioDireccion!: FormGroup;

  /**
   * Subject utilizado para limpiar las suscripciones al destruir el componente.
   * Se emite un valor y se completa en ngOnDestroy para evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * **Indicador de alerta**  
   * 
   * Determina si se debe mostrar una alerta en la interfaz de usuario.
   */
  mostrarAlerta: boolean = false;


  /**
   * **Mensaje de alerta**  
   * 
   * Contiene el texto del mensaje de alerta que se mostrará en la interfaz.
   */
  mensajeDeAlerta = '';

  /**
   * **Encabezados de la tabla de establecimientos**  
   * 
   * Almacena los nombres de las columnas de la tabla de establecimientos.
   */
  public establecimientoHeaderData: string[] = [];
  /**
   * Devuelve true si exactamente una fila está seleccionada
   */
  public get isSingleRowSelected(): boolean {
    return this.establecimientoBodyData.filter(r => r.selected).length === 1;
  }
     /**
     * Notificación que se muestra al usuario.
     */
  public nuevaNotificacion: Notificacion | undefined;

  /**
   * **Datos del cuerpo de la tabla de establecimientos**  
   * 
   * Contiene la información detallada de los establecimientos.  
   * Se usa `TableBodyData[]` hasta definir su estructura específica.
   */
  public establecimientoBodyData: TableBodyData[] = [];
  /**
   * Índice de la fila seleccionada en la tabla de establecimientos.
   *
   * Se utiliza para identificar qué establecimiento está seleccionado para editar o eliminar.
   * Si es null, no hay ninguna fila seleccionada.
   */
  public selectedEstablecimientoIndex: number | null = null;
  /**
   * Selecciona un establecimiento de la tabla
   * @param index Índice del establecimiento seleccionado
   */
  seleccionarEstablecimiento(index: number): void {
    this.selectedEstablecimientoIndex = index;
    // Optionally, patch the form with selected data for editing
    const selected = this.establecimientoBodyData[index];
    if (selected) {
      this.formularioDireccion.patchValue(selected);
    }
  }
 
  /**
   * Edita el establecimiento seleccionado con los datos del formulario
   */
  editarEstablecimiento(): void {
  this.isEditMode = true;
  if (this.selectedEstablecimientoIndex !== null) {
    // Patch the form with the selected row's data, ensuring all dropdowns are bound to their catalog objects
    const selected = this.establecimientoBodyData[this.selectedEstablecimientoIndex];
    if (selected && selected.tbodyData) {
      // Catalogs for dropdowns
      const paisCatalog = this.configuracionesFormularioDropdown[0]?.catalogos || [];
      const entidadCatalog = this.configuracionesFormularioDropdown[1]?.catalogos || [];
      const municipioCatalog = this.configuracionesFormularioDropdown[2]?.catalogos || [];
      const coloniaCatalog = this.configuracionesFormularioDropdown[3]?.catalogos || [];
      const localidadCatalog = this.configuracionesFormularioDropdown[4]?.catalogos || [];

      // Helper to find catalog object or empty string
      const findCatalogObj = (catalog: any[], value: any) => {
        return (
          catalog.find((c: any) => c?.id == value || c?.clave == value || c?.descripcion == value) ||
          catalog.find((c: any) => String(c?.id) === String(value) || String(c?.clave) === String(value) || String(c?.descripcion) === String(value)) ||
          ''
        );
      };
      // Map dropdown fields to catalog objects or empty string, but patch with id/clave for select binding
      const paisObj = findCatalogObj(paisCatalog, selected.tbodyData[9]);
      const entidadObj = findCatalogObj(entidadCatalog, selected.tbodyData[8]);
      const municipioObj = findCatalogObj(municipioCatalog, selected.tbodyData[5]);
      const coloniaObj = findCatalogObj(coloniaCatalog, selected.tbodyData[4]);
      const localidadObj = findCatalogObj(localidadCatalog, selected.tbodyData[6]);
      const patchObj: any = {
        calle: selected.tbodyData[1],
        numeroExterior: selected.tbodyData[2],
        numeroInterior: selected.tbodyData[3],
        colonia: coloniaObj ? (coloniaObj.id ?? coloniaObj.clave ?? '') : '',
        municipioDelegacion: municipioObj ? (municipioObj.id ?? municipioObj.clave ?? '') : '',
        localidad: localidadObj ? (localidadObj.id ?? localidadObj.clave ?? '') : '',
        codigoPostal: selected.tbodyData[7],
        entidadFederativa: entidadObj ? (entidadObj.id ?? entidadObj.clave ?? '') : '',
        pais: paisObj ? (paisObj.id ?? paisObj.clave ?? '') : ''
      };
      // Enable dropdown controls if disabled (for patching)
      const controlsToEnable = ['pais', 'entidadFederativa', 'municipioDelegacion', 'colonia', 'localidad'];
      const wasDisabled: Record<string, boolean> = {};
      controlsToEnable.forEach(key => {
        const ctrl = this.formularioDireccion.get(key);
        wasDisabled[key] = !!ctrl?.disabled;
        if (wasDisabled[key]) ctrl?.enable({ emitEvent: false });
      });
      this.formularioDireccion.patchValue(patchObj, { emitEvent: false });
      // Restore disabled state
      controlsToEnable.forEach(key => {
        const ctrl = this.formularioDireccion.get(key);
        if (wasDisabled[key]) ctrl?.disable({ emitEvent: false });
      });
    }
    // Open the modal for editing
    setTimeout(() => {
      const modal = document.getElementById('modalAgregar');
      if (modal) {
        (window as any).bootstrap?.Modal?.getOrCreateInstance(modal)?.show();
      }
    }, 0);
  }
}
  /**
   * Selecciona un establecimiento por objeto (usado por rowSelected)
   */
  seleccionarEstablecimientoPorObjeto(row: TableBodyData): void {
    const idx = this.establecimientoBodyData.findIndex(r =>
      Array.isArray(r.tbodyData) && Array.isArray(row.tbodyData) &&
      r.tbodyData.length === row.tbodyData.length &&
      r.tbodyData.every((val, i) => val === row.tbodyData[i])
    );
    if (idx !== -1) {
      this.selectedEstablecimientoIndex = idx;
      // Patch the form with the selected row's data
      const selected = this.establecimientoBodyData[idx];
      if (selected && selected.tbodyData) {
        this.formularioDireccion.patchValue({
          calle: selected.tbodyData[1],
          numeroExterior: selected.tbodyData[2],
          numeroInterior: selected.tbodyData[3],
          colonia: selected.tbodyData[4],
          municipioDelegacion: selected.tbodyData[5],
          localidad: selected.tbodyData[6],
          codigoPostal: selected.tbodyData[7],
          entidadFederativa: selected.tbodyData[8],
          pais: selected.tbodyData[9]
        });
      }
    }
  }

 /**
   * Elimina la mercancía seleccionada de la tabla
   */
  eliminarMercancia() {
      this.abrirElimninarConfirmationopup();
  }

    /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
  onEliminarConfirmacion(confirmado: boolean) {
    if (confirmado) {
      this.eliminarEstablecimiento();
    } else {
      this.nuevaNotificacion = undefined;
    }
  }

  /**
     * @method abrirElimninarConfirmationopup
     * Abre un popup de confirmación para eliminar los registros seleccionados.
     * Si no hay registros seleccionados, no realiza ninguna acción.
     */
    abrirElimninarConfirmationopup(): void {
      this.nuevaNotificacion = {
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
   * Elimina el establecimiento seleccionado
   */
  eliminarEstablecimiento(): void {
    // Remove all rows with selected === true (multi-row delete)
    const anySelected = this.establecimientoBodyData.some(row => row.selected);
    if (anySelected) {
      const updatedRows = this.establecimientoBodyData.filter(row => !row.selected);
      // Re-number the rows in the first column and clear selection
      this.establecimientoBodyData = updatedRows.map((row, idx) => ({
        ...row,
        tbodyData: [
          (idx + 1).toString(),
          ...row.tbodyData.slice(1)
        ],
        selected: false
      }));
      this.totalItems = this.establecimientoBodyData.length;
      this.selectedEstablecimientoIndex = null;
      this.rowSelected = false;
    } else if (this.selectedEstablecimientoIndex !== null) {
      // Fallback: remove the single selected index if no .selected property is set
      const updatedRows = this.establecimientoBodyData.filter((_, idx) => idx !== this.selectedEstablecimientoIndex);
      this.establecimientoBodyData = updatedRows.map((row, idx) => ({
        ...row,
        tbodyData: [
          (idx + 1).toString(),
          ...row.tbodyData.slice(1)
        ],
        selected: false
      }));
      this.totalItems = this.establecimientoBodyData.length;
      this.selectedEstablecimientoIndex = null;
      this.rowSelected = false;
    }
  }

  /**
   * **Datos de la tabla de destinatarios**  
   * 
   * Contiene los encabezados y el cuerpo de la tabla de destinatarios.
   */
  destinatarioTableData: TableData = { encabezadoDeTabla: [], cuerpoTabla: [] };

  /**
   * **Catálogo de folios de autorización**
   * 
   * Almacena las opciones disponibles para el campo de folio de autorización en el formulario.
   */
  catalogoFolioAutorizacion: Catalogo[] = [];

  
  //  Controla la visibilidad del panel plegable.
  //  El valor predeterminado está establecido en verdadero (panel ampliado).
   
  public colapsable = true;


    /**
   * Número total de elementos en la tabla.
   */
  totalItems: number = 0;

  /**
   * Página actual de la paginación.
   */
  currentPage: number = 1;

  /**
   * Cantidad de elementos por página en la paginación.
   */
  itemsPerPage: number = 5;

    /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 


  /**
   * **Constructor del componente**  
   * 
   * - Inicializa el `FormBuilder` para la creación de formularios reactivos.
   */

  constructor(private fb: FormBuilder, private datosDelInmueble104Store: DatosDelInmueble104Store, private datosDelInmueble104Query: DatosDelInmueble104Query,private consultaioQuery: ConsultaioQuery,) {
    // Inicializa
  }

  /**
   * **Método de inicialización**  
   * 
   * Este método se ejecuta cuando el componente se inicializa. Realiza las siguientes acciones:
   * 1. Llama a `inicializarFormularioTratados` para configurar el formulario de tratados.
   * 2. Llama a `inicializarFormulario` para configurar el formulario principal.
   * 3. Asigna los datos de la tabla de destinatarios a `destinatarioTableData`.
   * 4. Llama a `getEstablecimiento` para obtener la información necesaria de los establecimientos.
   * 5. Se suscribe a los cambios del campo `tipoPrograma` del formulario `fomentoExportacionForm`.  
   *    Si el valor cambia a `'1'`, se muestra una alerta con el mensaje correspondiente.
   */
  ngOnInit(): void {
    this.inicializarFormularioTratados(); // Inicializa el formulario de tratados.
    this.inicializarFormulario(); // Inicializa el formulario principal.
    this.destinatarioTableData.encabezadoDeTabla = destinatarioTableData?.encabezadoDeTabla; // Asigna los encabezados de la tabla de destinatarios.
    /**
     * Inicializa los datos de tablas según si la vista es de solo lectura o editable.
     * Asigna datos de destinatarios o limpia y prepara la tabla de establecimientos.
    */
    if (this.consultaState?.readonly) {
    this.destinatarioTableData.cuerpoTabla = destinatarioTableData?.cuerpoTabla; // Asigna los datos del cuerpo de la tabla de destinatarios.
    this.getEstableCimiento(); // Obtiene la información de los establecimientos.
    } else {
      this.establecimientoHeaderData = this.destinatarioTableData?.encabezadoDeTabla; 
      this.establecimientoBodyData = []; 
    }

    this.fomentoExportacionForm.get('tipoPrograma')?.valueChanges.subscribe(value => { // Se suscribe a los cambios en 'tipoPrograma' del formulario.
      if (value === '1') {
        this.mostrarAlerta = true; // Muestra la alerta si el valor es '1'.
        this.mensajeDeAlerta = MENSAJEDE_ALERTA.ADJUNTAR; // Asigna el mensaje de alerta correspondiente.
      }
      this.catalogoFolioAutorizacion=dropDown?.folioAutorizacion;
    });
    this.cargarDatosGuardados(); // Carga los datos guardados en el formulario.
    this.escucharCambiosFormulario();
    this.deshabilitarFormularios(); // Guarda los datos del formulario en el store.
  }


  /**
   * **Inicializa el formulario de Tratados**  
   * 
   * Este método configura el formulario `fomentoExportacionForm` utilizando `FormBuilder`. 
   * Se definen dos campos:
   * - `tipoPrograma`: Un campo obligatorio que representa el tipo de programa.
   * - `folioAutorizacion`: Un campo obligatorio que representa el número de folio de autorización.
   */
  inicializarFormularioTratados(): void {
    this.fomentoExportacionForm = this.fb.group({
      tipoPrograma: ['', Validators.required], // Campo obligatorio para el tipo de programa.
      folioAutorizacion: ['', Validators.required], // Campo obligatorio para el folio de autorización.
    });
  }

  /**
   * **Configuraciones de dropdown**  
   * 
   * Define un arreglo de configuraciones para los dropdowns. Cada objeto contiene 
   * un catálogo de opciones que se utilizará para llenar los dropdowns en el formulario.
   * - `tipoPrograma`: Opciones disponibles para el tipo de programa.
   * - `folioAutorizacion`: Opciones disponibles para el folio de autorización.
   */
  configuracionesDropdown = [
    { catalogos: dropDown?.tipoPrograma }, // Dropdown para el tipo de programa.
    { catalogos: dropDown?.folioAutorizacion }, // Dropdown para el folio de autorización.
  ];

  /**
   * **Obtiene los datos de establecimiento**  
   * 
   * Este método asigna los datos de los encabezados y cuerpos de tabla a las propiedades 
   * `establecimientoHeaderData` y `establecimientoBodyData`, respectivamente. 
   * Estos datos se usan para visualizar la tabla de destinatarios.
   */
  private getEstableCimiento(): void {
    this.establecimientoHeaderData = this.destinatarioTableData?.encabezadoDeTabla; // Asigna los encabezados de la tabla.
    this.establecimientoBodyData = this.destinatarioTableData?.cuerpoTabla; // Asigna el cuerpo de la tabla.
  }


  /**
   * **Cerrar el modal**  
   * 
   * Este método emite un evento para cerrar el modal y cambia el estado de la alerta 
   * a `false`, ocultando cualquier mensaje de alerta mostrado anteriormente.
   */
  cerrarModal(): void {
    this.cerrarClicado.emit(); // Emite el evento para cerrar el modal.
    this.mostrarAlerta = false; // Oculta la alerta.
  }

  /**
   * **Inicializar el formulario de dirección**  
   * 
   * Este método crea un formulario reactivo (`formularioDireccion`) con varios 
   * campos para capturar la dirección del usuario. Se definen validaciones para 
   * asegurar que los campos obligatorios sean completados correctamente.
   */
  private inicializarFormulario(): void {
    this.formularioDireccion = this.fb.group({
      calle: ['', [Validators.required, Validators.maxLength(100)]],
      numeroExterior: ['', [Validators.required, Validators.maxLength(55)]],
      numeroInterior: ['', [Validators.maxLength(55)]],
      pais: ['', Validators.required],
      entidadFederativa: ['', Validators.required],
      municipioDelegacion: ['', Validators.required],
      colonia: [''],
      localidad: [''],
      codigoPostal: ['', [Validators.required,Validators.maxLength(12)]],
    });
  }


  /**
   * **Configuraciones del formulario para los dropdowns**  
   * 
   * Esta variable contiene un array de objetos que representan los diferentes dropdowns 
   * que se utilizan en el formulario. Cada objeto tiene un campo `catalogos`, que se 
   * corresponde con los valores a mostrar en los dropdowns.
   * 
   * Se utiliza para inicializar los selectores del formulario con los datos provenientes 
   * de las variables `dropDown.pais`, `dropDown.entidadFederativa`, etc.
   */
  configuracionesFormularioDropdown = [
    { catalogos: dropDown?.pais }, // Dropdown para seleccionar el país.
    { catalogos: dropDown?.entidadFederativa }, // Dropdown para seleccionar la entidad federativa.
    { catalogos: dropDown?.municipioDelegacion }, // Dropdown para seleccionar el municipio o delegación.
    { catalogos: dropDown?.entidadFederativa }, // Repetido para entidad federativa, ¿es necesario?
    { catalogos: dropDown?.localidad } // Dropdown para seleccionar la localidad.
  ];


  /**
   * **Carga los datos guardados en el store y los aplica a los formularios**  
   * 
   * - Se suscribe a los valores almacenados en `fomentoExportacion$` y `direccion$` dentro del store.  
   * - Si existen datos en el estado, se actualizan los formularios sin disparar eventos (`emitEvent: false`).  
   * - La suscripción se gestiona con `takeUntil(this.destroy$)` para evitar fugas de memoria cuando el componente se destruye.
   */
  cargarDatosGuardados(): void {
    this.datosDelInmueble104Query.fomentoExportacion$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.fomentoExportacionForm.patchValue(data, { emitEvent: false });
        }
      });

    this.datosDelInmueble104Query.direccion$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data && data.pais !== undefined) {
          this.formularioDireccion.patchValue({ pais: data.pais }, { emitEvent: false });
        }
      });
  }

  /**
   * **Escucha cambios en los formularios y actualiza el store**  
   * 
   * - Se suscribe a `valueChanges` de ambos formularios (`fomentoExportacionForm` y `formularioDireccion`).  
   * - Utiliza `distinctUntilChanged()` para evitar actualizaciones innecesarias cuando los valores no cambian.  
   * - Al detectar cambios, actualiza los valores en el store.  
   * - `takeUntil(this.destroy$)` asegura que la suscripción se cancele cuando el componente se destruya.  
   */
  escucharCambiosFormulario(): void {
    this.fomentoExportacionForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe((formData) => {
        this.datosDelInmueble104Store.setFomentoExportacion(formData);
      });

    this.formularioDireccion.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe((formData) => {
        this.datosDelInmueble104Store.setDireccion(formData);
      });
  }

  /**
 * Muestra u oculta el panel plegable.
 * Cambia el estado de la propiedad `colapsable`.
 */
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Actualiza la paginación de la tabla de establecimientos.
   * Corta los datos de la tabla según la página actual y el número de elementos por página.
   */
  updatePagination():void{
    const STARTINDEX = (this.currentPage - 1) * this.itemsPerPage;
    this.establecimientoBodyData = this.establecimientoBodyData.slice(
      STARTINDEX,
      STARTINDEX + this.itemsPerPage
    );
  }

  /**
   * Método que se ejecuta cuando se cambia de página en la paginación.
   * @param {number} page - Número de la página seleccionada.
   */
  onPageChange(page: number):void {
    this.currentPage = page;
    this.updatePagination();
  }


  /**
   * Método que se ejecuta cuando cambia el número de elementos por página.
   * @param {number} itemsPerPage - Número de elementos a mostrar por página.
   */
  onItemsPerPageChange(itemsPerPage: number):void{
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Habilita o deshabilita los formularios según el estado de solo lectura.
   * 
   * Si `consultaState.readonly` es verdadero, deshabilita ambos formularios para que no puedan ser editados.
   * Si es falso, los habilita para permitir la edición.
   */
  deshabilitarFormularios(): void {
    if (this.consultaState?.readonly) {
      // Deshabilita los formularios si el estado es solo lectura
      this.fomentoExportacionForm.disable();
      this.formularioDireccion.disable();
    } else {
      // Habilita los formularios si el estado permite edición
      this.fomentoExportacionForm.enable();
      this.formularioDireccion.enable();

      this.formularioDireccion.get('pais')?.disable(); // Deshabilita el campo 'pais' del formulario de dirección.
    }
  }

  /**
   * **Limpia las suscripciones al destruir el componente**  
   * 
   * - `this.destroy$.next();` emite un valor para completar las suscripciones activas.  
   * - `this.destroy$.complete();` marca el `Subject` como completo, evitando nuevas emisiones.  
   * - Esto previene fugas de memoria al asegurarse de que las suscripciones se finalizan correctamente.  
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Agrega un nuevo establecimiento usando los datos del formulario
   */
  agregarEstablecimiento(): void {
    if (this.formularioDireccion && this.formularioDireccion.valid) {
      const values = this.formularioDireccion.getRawValue();
      const hasData = Object.keys(values).some(key => {
        const v = values[key];
        return v !== null && v !== undefined && v !== '';
      });
      if (!hasData) {
        return;
      }
      // Ensure row number column exists in header
      if (!this.establecimientoHeaderData.includes('No.')) {
        this.establecimientoHeaderData = ['No.', ...this.establecimientoHeaderData];
      }
      // Get display value for pais and other catalog fields
      const getDescripcion = (value: any, catalog: any[]) => {
        if (value && typeof value === 'object' && value.descripcion) {
          return value.descripcion;
        } else if (value) {
          const found = catalog.find((c: any) => c.id == value || c.clave === value);
          return found ? found.descripcion : value;
        }
        return '';
      };
      const paisCatalog = this.configuracionesFormularioDropdown[0]?.catalogos || [];
      const entidadCatalog = this.configuracionesFormularioDropdown[1]?.catalogos || [];
      const municipioCatalog = this.configuracionesFormularioDropdown[2]?.catalogos || [];
      const coloniaCatalog = this.configuracionesFormularioDropdown[3]?.catalogos || [];
      const localidadCatalog = this.configuracionesFormularioDropdown[4]?.catalogos || [];
      const paisDisplay = getDescripcion(values.pais, paisCatalog);
      const entidadDisplay = getDescripcion(values.entidadFederativa, entidadCatalog);
      const municipioDisplay = getDescripcion(values.municipioDelegacion, municipioCatalog);
      const coloniaDisplay = getDescripcion(values.colonia, coloniaCatalog);
      const localidadDisplay = getDescripcion(values.localidad, localidadCatalog);
      if (this.isEditMode && this.selectedEstablecimientoIndex !== null) {
        // Edit mode: update the selected row
        const tbodyData = [
          (this.selectedEstablecimientoIndex + 1).toString(),
          values.calle || '',
          values.numeroExterior || '',
          values.numeroInterior || '',
          coloniaDisplay,
          municipioDisplay,
          localidadDisplay,
          values.codigoPostal || '',
          entidadDisplay,
          paisDisplay
        ];
        const updatedRows = [...this.establecimientoBodyData];
        updatedRows[this.selectedEstablecimientoIndex] = { tbodyData };
        this.establecimientoBodyData = updatedRows;
        this.isEditMode = false;
        this.selectedEstablecimientoIndex = null;
      } else {
        // Add mode: add a new row
        const tbodyData = [
          (this.establecimientoBodyData.length + 1).toString(),
          values.calle || '',
          values.numeroExterior || '',
          values.numeroInterior || '',
          coloniaDisplay,
          municipioDisplay,
          localidadDisplay,
          values.codigoPostal || '',
          entidadDisplay,
          paisDisplay
        ];
        const newRow = { tbodyData };
        this.establecimientoBodyData = [...this.establecimientoBodyData, newRow];
      }
      this.totalItems = this.establecimientoBodyData.length;
      // Close modal after adding or editing
      const modal = document.getElementById('modalAgregar');
      if (modal) {
        (window as any).bootstrap?.Modal?.getInstance(modal)?.hide();
      }
      // Clear form except for pais
      const paisValueToKeep = this.formularioDireccion.get('pais')?.value;
      const emptyValues: any = {};
      Object.keys(this.formularioDireccion.controls).forEach(key => {
        if (key !== 'pais') {
          emptyValues[key] = '';
        }
      });
      this.formularioDireccion.patchValue(emptyValues);
      if (paisValueToKeep !== undefined) {
        this.formularioDireccion.patchValue({ pais: paisValueToKeep });
      }
    }
  }

    /**
     * Indica si al menos una fila de la tabla de establecimientos está seleccionada.
     * Se utiliza para habilitar o deshabilitar los botones de edición y eliminación.
     * Se actualiza automáticamente cuando cambia la selección de filas en la tabla.
     */
    public rowSelected: boolean = false;

  /**
   * Cambia el estado de selección de una fila (para selección múltiple)
   * Llama este método desde el checkbox de cada fila en la tabla:
   * <input type="checkbox" [checked]="row.selected" (change)="toggleSeleccionFila(row, $event.target.checked)">
   * @param row Fila a modificar
   * @param selected true si se selecciona, false si se deselecciona
   */
  toggleSeleccionFila(row: TableBodyData, selected: boolean): void {
    row.selected = selected;
    // Actualiza rowSelected para habilitar/deshabilitar botones
    this.rowSelected = this.establecimientoBodyData.some(r => r.selected);
  }

/**
 * Habilita o deshabilita los botones de editar/eliminar según la selección
 */
onSeleccionCambio(selected: boolean): void {
  this.rowSelected = selected;
  if (selected) {
    // Find the first selected row and update selectedEstablecimientoIndex
    const idx = this.establecimientoBodyData.findIndex(row => row.selected);
    this.selectedEstablecimientoIndex = idx !== -1 ? idx : null;
  } else {
    this.selectedEstablecimientoIndex = null;
  }
}

/**
 * Sincroniza el cuerpo de la tabla cuando cambia la selección en la tabla hija
 */
onBodyChange(updatedBody: TableBodyData[]): void {
  this.establecimientoBodyData = updatedBody;
  this.rowSelected = this.establecimientoBodyData.some(r => r.selected);
  if (this.rowSelected) {
    const idx = this.establecimientoBodyData.findIndex(row => row.selected);
    this.selectedEstablecimientoIndex = idx !== -1 ? idx : null;
  } else {
    this.selectedEstablecimientoIndex = null;
  }
}
}
