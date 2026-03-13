 
/**
 * Importaciones necesarias para el funcionamiento del componente.
 */
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Catalogo,
  REGEX_SOLO_NUMEROS,  
  TituloComponent,
  ValidacionesFormularioService,
  doDeepCopy,
  esValidArray,
  getValidDatos,
} from '@ng-mf/data-access-user';
import {  NotificacionesComponent,Notificacion } from '@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component';
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {
  DEFAULT_TABLA_ORDEN,
  TERCEROS_RELACIONADOS_TABLA_BODY_DATOS,
  TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS,
} from '../../constantes/terceros-fabricante.enum';
import {
  REGEX_CORREO_ELECTRONICO,
  REGEX_CURP,
  REGEX_NOMBRE,
  REGEX_RFC_FISICA,
  REGEX_RFC_MORAL,
} from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Subject, map, takeUntil } from 'rxjs';
import { TercerosFabricanteState, TercerosFabricanteStore } from '../../estados/stores/terceros-fabricante.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';

import { ConsultaioQuery,CategoriaMensaje,TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { ModalComponent } from '../modal/modal.component';
import NacionalidadRadioOptions from '@libs/shared/theme/assets/json/260501/nacionalidad-options.json';
import SELECT_OPTIONS_DATA from '@libs/shared/theme/assets/json/260501/fabricante-select-options-data.json';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { Shared2605Service } from '../../services/shared2605/shared2605.service';
import { TablaDatos } from '../../models/terceros-fabricante.model';
import { TableComponent } from '@ng-mf/data-access-user';
import { TercerosFabricanteQuery } from '../../estados/queries/terceros-fabricante.query';
import { TercerosFabricanteService } from '../../services/terceros-fabricante.service';
import TipoPersonaRadioOptions from '@libs/shared/theme/assets/json/260501/tipo-persona-options.json';
import TipoPersonaTresRadioOptions from '@libs/shared/theme/assets/json/260501/tipo-persona-tres-options.json';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * Componente que gestiona los terceros relacionados.
 * Utiliza formularios reactivos y componentes personalizados para mostrar datos.
 */
@Component({
  selector: 'app-terceros-fabricante',
  standalone: true,
  templateUrl: './terceros-fabricante.component.html',
  styleUrls: ['./terceros-fabricante.component.scss'],
  imports: [
    CommonModule,
    TituloComponent,
    TableComponent,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    TooltipModule,
    NotificacionesComponent
  ],
})

/**
 * Componente que gestiona los terceros relacionados.
 * Utiliza formularios reactivos y componentes personalizados para mostrar datos.
 */
export class TercerosRelacionadosComponent implements OnInit, OnDestroy, OnChanges {

  /** 
   * Indicador para destruir suscripciones y evitar fugas de memoria. 
   */
  public mostrarField = {
    mostrarCodigoPostal: true,
    mostrarEstado: true
  };
   /**
     * Datos del cuerpo de la tabla de establecimientos.
     * Se utiliza para almacenar las filas seleccionadas o actualizadas.
     */
   establecimientoBodyData: any[] = [];

  /**
   * Indica si está habilitado el modo de edición para eliminar un proveedor.
   * Se utiliza para controlar la habilitación de botones o acciones de eliminación
   * cuando hay una fila seleccionada en la tabla de proveedores.
   * Valor booleano, por defecto 'false'.
   *
   * @example
   * this.isEditingEliminarProveedor = true; // Hay un proveedor seleccionado para eliminar
   * this.isEditingEliminarProveedor = false; // No hay proveedor seleccionado
   */
  isEditingEliminarProveedor = false;
    /**
   * Indica el modo actual del formulario de proveedor ("add" para agregar, "edit" para editar).
   * Se utiliza para controlar la visibilidad y el comportamiento del formulario de proveedor.
   * Valor vacío ('') por defecto.
   *
   * @example
   * this.isAddEditProveedor = 'add'; // Modo agregar proveedor
   * this.isAddEditProveedor = 'edit'; // Modo editar proveedor
   */
  isAddEditProveedor = '';
  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Evento emitido cuando la tabla es válida. */
  @Output() tableValidEvent = new EventEmitter<string>();

  /** Identificador numérico del procedimiento recibido como entrada desde el componente padre.
   * Se utiliza para cargar datos específicos relacionados con dicho procedimiento, como catálogos o listas dinámicas. */
  @Input() idProcedimiento!: number;

  /**
   * Expresión regular para validar el RFC de personas físicas.
   * @description Utiliza una expresión regular para verificar el formato del RFC.
   */
  @Input() tablaOrden: { nombre: string; orden: number; esVisible: boolean }[] =
    DEFAULT_TABLA_ORDEN;

  /**
   *  Método para validar el RFC del tercero.
   * @param control Control del formulario que contiene el RFC.
   * @returns Un objeto de error si el RFC es inválido, o `null` si es válido.
   * @description Valida el RFC del tercero utilizando expresiones regulares.
   */
  getSortedTablas(): { nombre: string; orden: number; esVisible: boolean }[] {
    return this.tablaOrden
      .filter((tabla) => tabla.esVisible) // Only include visible tables
      .sort((a, b) => a.orden - b.orden);
  }
/**
 * Indica si se está editando un fabricante.
 * Se utiliza para controlar la lógica de modificación en el formulario.
 */
isEditingFabricante = false;

/**
 * Indica si se está editando un formulador.
 * Permite diferenciar entre agregar un nuevo registro o actualizar uno existente.
 */
isEditingFormulador = false;

/**
 * Indica si se está editando un proveedor.
 * Se usa para gestionar la actualización de datos existentes en la tabla.
 */
isEditingProveedor = false;

/**
 * Índice de la fila de fabricante que se está editando.
 * Se utiliza para actualizar el elemento correcto en el arreglo de datos.
 */
editFabricanteIndex: number = -1;

/**
 * Índice de la fila de formulador que se está editando.
 * Permite reemplazar correctamente los datos en la tabla al guardar cambios.
 */
editFormuladorIndex: number = -1;

/**
 * Índice de la fila de proveedor que se está editando.
 * Se emplea para identificar y actualizar la fila correspondiente en la tabla.
 */
editProveedorIndex: number = -1;

  /**
   * Indicador de visibilidad para la sección de la tabla.
   * Inicialmente visible (`true`).
   *
   * @description Controla si se muestra o no la sección de la tabla.
   */
  showTableDiv = true;

  /**
   * Indicador de visibilidad para la sección del formulario de fabricante.
   * Inicialmente no visible (`false`).
   *
   * @description Controla si se muestra o no el formulario para agregar un fabricante.
   */
  showFabricante = false;

  /**
   * Indicador de visibilidad para la sección del formulario de formulador.
   * Inicialmente no visible (`false`).
   *
   * @description Controla si se muestra o no el formulario para agregar un formulador.
   */
  showFormulador = false;

  /**
   * Indicador de visibilidad para la sección del formulario de proveedor.
   * Inicialmente no visible (`false`).
   *
   * @description Controla si se muestra o no el formulario para agregar un proveedor.
   */
  showProveedor = false;

  /**
   * Indicador de visibilidad para los botones del formulario de fabricante.
   * Inicialmente no visible (`false`).
   *
   * @description Controla si se muestran o no los botones para el formulario de fabricante.
   */
  showFabricanteButtons = false;
  /**
 * Fila actualmente seleccionada en la tabla de formuladores.
 * Se utiliza para cargar los datos en el formulario al modificar.
 * Puede ser null si no se ha seleccionado ninguna fila.
 */
  selectedFormuladorRow: TablaDatos | null = null;
  /**
 * Fila actualmente seleccionada en la tabla de proveedores.
 * Se utiliza para cargar los datos en el formulario al modificar.
 * Puede ser null si no se ha seleccionado ninguna fila.
 */
  selectedProveedorRow: TablaDatos | null = null;
  /**
 * Fila actualmente seleccionada en la tabla de fabricantes.
 * Se utiliza para cargar los datos en el formulario al modificar.
 * Puede ser null si no se ha seleccionado ninguna fila.
 */
  selectedFabricanteRow: TablaDatos | null = null;
/**
 * Maneja la selección de una fila en la tabla de fabricantes.
 * Guarda la fila seleccionada para poder modificarla o eliminarla.
 */
 /**
     * Notificación que se muestra al usuario.
     */
  public nuevaNotificacion: Notificacion | undefined;

  /**
 * Maneja la selección de una fila en la tabla de fabricantes.
 * Guarda la fila seleccionada para poder modificarla o eliminarla.
 */
 /**
     * Notificación que se muestra al usuario.
     */
  public nuevaFormulatorNotificacion: Notificacion | undefined;

    /**
 * Maneja la selección de una fila en la tabla de fabricantes.
 * Guarda la fila seleccionada para poder modificarla o eliminarla.
 */
 /**
     * Notificación que se muestra al usuario.
     */
  public nuevaProveedorNotificacion: Notificacion | undefined;

  /**
 * Sincroniza el cuerpo de la tabla cuando cambia la selección en la tabla hija
 */
public onBodyChange(updatedBody: any[]): void {
  this.establecimientoBodyData = updatedBody;
  const selectedCount = updatedBody.filter(row => row.selected).length;
  this.isEditingEliminarProveedor = selectedCount === 1;
}

onFabricanteRowSelected(row: TablaDatos): void {
  this.selectedFabricanteRow = row;
}

/**
 * Maneja la selección de una fila en la tabla de formuladores.
 * Guarda la fila seleccionada para poder modificarla o eliminarla.
 */
onFormuladorRowSelected(row: TablaDatos): void {
  this.selectedFormuladorRow = row;
}

/**
 * Maneja la selección de una fila en la tabla de proveedores.
 * Guarda la fila seleccionada para poder modificarla o eliminarla.
 */
onProveedorRowSelected(row: TablaDatos): void {
  this.selectedProveedorRow = row;
}

 /**
   * Elimina la mercancía seleccionada de la tabla
   */
  eliminarFabricantepopup() {

      this.abrirElimninarConfirmationopup('Fabricante');
  }

   /**
   * Elimina la mercancía seleccionada de la tabla
   */
  eliminarFormuladorpopup() {

      this.abrirElimninarConfirmationopup('Formulador');
  }

   /**
   * Elimina la mercancía seleccionada de la tabla
   */
  eliminarProveedorpopup() {

      this.abrirElimninarConfirmationopup('Proveedor');
  }

  

 /**
     * @method abrirElimninarConfirmationopup
     * Abre un popup de confirmación para eliminar los registros seleccionados.
     * Si no hay registros seleccionados, no realiza ninguna acción.
     */
    abrirElimninarConfirmationopup(tipo: string): void {
      let eleinar={
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ERROR,
        modo: 'modal',
        titulo: '',
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 0,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      if(tipo === 'Fabricante') 
       {
      this.nuevaNotificacion = eleinar;
       }
       else if(tipo === 'Formulador')
       {
        this.nuevaFormulatorNotificacion = eleinar;
       }
       else{
        this.nuevaProveedorNotificacion = eleinar;
       }
      
    }
/**
 * Elimina la fila seleccionada de la tabla de fabricantes
 * y actualiza el store correspondiente.
 */
 eliminarFabricante(): void {
  if (!this.selectedFabricanteRow) {return;}

  this.fabricanteRowData = this.fabricanteRowData.filter(
    row => JSON.stringify(row.tbodyData) !== JSON.stringify(this.selectedFabricanteRow?.tbodyData)
  );
  this.tercerosFabricanteStore.setFabricante([...this.fabricanteRowData]);
  this.selectedFabricanteRow = null;
  this.showFabricanteButtons = false;
}

  /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
  onEliminarConfirmacion(confirmado: boolean) {
    if (confirmado) {
      this.eliminarFabricante();
    } else {
      this.nuevaNotificacion = undefined;
    }
  }

   /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
  onEliminarFormulatorConfirmacion(confirmado: boolean) {
    if (confirmado) {
      this.eliminarFormulador();
    } else {
      this.nuevaFormulatorNotificacion = undefined;
    }
  }
  /**
   * Maneja la respuesta del modal de confirmación de eliminación
   */
  onEliminarProveedorConfirmacion(confirmado: boolean) {
    if (confirmado) {
      this.eliminarProveedor();
    } else {
      this.nuevaProveedorNotificacion = undefined;
    }
  }

  
/**
 * Elimina la fila seleccionada de la tabla de formuladores
 * y actualiza el store correspondiente.
 */
eliminarFormulador(): void {
  if (!this.selectedFormuladorRow) {return}
  this.formuladorRowData = this.formuladorRowData.filter(
    row => JSON.stringify(row.tbodyData) !== JSON.stringify(this.selectedFormuladorRow?.tbodyData)
  );
  this.tercerosFabricanteStore.setFormulador([...this.formuladorRowData]);
  this.selectedFormuladorRow = null;
  this.showFormuladorButtons = false;
}
/**
 * Elimina la fila seleccionada de la tabla de proveedores
 * y actualiza el store correspondiente.
 */
eliminarProveedor(): void {
  if (!this.selectedProveedorRow) {return}
  this.proveedorRowData = this.proveedorRowData.filter(
    row => JSON.stringify(row.tbodyData) !== JSON.stringify(this.selectedProveedorRow?.tbodyData)
  );
  this.tercerosFabricanteStore.setProveedor([...this.proveedorRowData]);
  this.selectedProveedorRow = null;
  this.showProveedorButtons = false;
}
  onFabricanteSeleccionCambio(isChecked: boolean): void {
    this.showFabricanteButtons = isChecked;
  }
  /**
   * Indicador de visibilidad para los botones del formulario de formulador.
   * Inicialmente no visible (`false`).
   *
   * @description Controla si se muestran o no los botones para el formulario de formulador.
   */
  showFormuladorButtons = false;
  onFormuladorSeleccionCambio(isChecked: boolean): void {
    this.showFormuladorButtons = isChecked;
  }
  /**
   * Indicador de visibilidad para los botones del formulario de proveedor.
   * Inicialmente no visible (`false`).
   *
   * @description Controla si se muestran o no los botones para el formulario de proveedor.
   */
  showProveedorButtons = false;
  onProveedorSeleccionCambio(isChecked: boolean): void {
    this.showProveedorButtons = isChecked;
  }
  /**
   * Selección del tipo de persona.
   */
  tipoPersonaSelection!: string;

  /**
   * Datos generales para los dropdowns.
   * Inicialmente vacío, se llenará con datos según sea necesario.
   *
   * @description Este arreglo almacena los datos generales para los selectores.
   */
  dropdownData: Catalogo[] = [];

  /**
   * Datos para el dropdown de países.
   * Utiliza los datos predefinidos en `paisSelectData`.
   *
   * @description Este arreglo almacena las opciones para el selector de países.
   */
  paisDropdownData: Catalogo[] = [];

  /**
   * Datos para el dropdown de localidades.
   * Utiliza los datos predefinidos en `localidadSelectData`.
   *
   * @description Este arreglo almacena las opciones para el selector de localidades.
   */
  localidadDropdownData: Catalogo[] = SELECT_OPTIONS_DATA.localidadSelectData;

  /**
   * Datos para el dropdown de municipios.
   * Utiliza los datos predefinidos en `municipioSelectData`.
   *
   * @description Este arreglo almacena las opciones para el selector de municipios.
   */
  municipioDropdownData: Catalogo[] = SELECT_OPTIONS_DATA.municipioSelectData;

  /**
   * Datos para el dropdown de códigos postales.
   * Utiliza los datos predefinidos en `codigoPostalSelectData`.
   *
   * @description Este arreglo almacena las opciones para el selector de códigos postales.
   */
  codigoPostalDropdownData: Catalogo[] =
    SELECT_OPTIONS_DATA.codigoPostalSelectData;

  /**
   * Datos para el dropdown de colonias.
   * Utiliza los datos predefinidos en `coloniaSelectData`.
   *
   * @description Este arreglo almacena las opciones para el selector de colonias.
   */
  coloniaDropdownData: Catalogo[] = SELECT_OPTIONS_DATA.coloniaSelectData;

  /**
   * Formulario reactivo para agregar un fabricante.
   * Este formulario contiene los campos necesarios para ingresar los datos de un fabricante.
   *
   * @description Se utiliza para validar y procesar los datos del fabricante.
   */
  agregarFabricanteFormGroup!: FormGroup;

  /**
   * Formulario reactivo para agregar un formulador.
   * Este formulario contiene los campos necesarios para ingresar los datos de un formulador.
   *
   * @description Se utiliza para validar y procesar los datos del formulador.
   */
  agregarFormuladorFormGroup!: FormGroup;

  /**
   * Formulario reactivo para agregar un proveedor.
   * Este formulario contiene los campos necesarios para ingresar los datos de un proveedor.
   *
   * @description Se utiliza para validar y procesar los datos del proveedor.
   */
  agregarProveedorFormGroup!: FormGroup;

  /**
   * Opciones para el radio de nacionalidad.
   * Utiliza los datos predefinidos en `NacionalidadRadioOptions`.
   *
   * @description Este arreglo almacena las opciones para el selector de nacionalidad.
   */
  nacionalidadOptions = NacionalidadRadioOptions;

  /**
   * Opciones para el radio de tipo de persona.
   * Utiliza los datos predefinidos en `TipoPersonaRadioOptions`.
   *
   * @description Este arreglo almacena las opciones para el selector de tipo de persona.
   */
  tipoPersonaOptions = TipoPersonaRadioOptions;

  /**
   * Opciones para el radio de tipo de persona.
   * Utiliza los datos predefinidos en `TipoPersonaTresRadioOptions`.
   *
   * @description Este arreglo almacena las opciones para el selector de tipo de persona.
   */
  tipoPersonaTresOptions = TipoPersonaTresRadioOptions;

  /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Bandera para determinar si el formulario es de actualización.
   * Inicialmente establecido en `false`.
   *
   * @description Esta bandera se utiliza para controlar la lógica de actualización del formulario.
   */
  private esFormularioActualizacion: boolean = false;

  /**
     * Estado de la solicitud de la sección PagoBanco.
     */
    public solicitudState!: TercerosFabricanteState;

    /**
   * Formulario reactivo principal para gestionar los datos de terceros relacionados.
   */
    public tercerosForm: FormGroup = new FormGroup({});

    /** Indica si el campo de fabricante es inválido. */
    public isfabricanteInvalida: boolean = false;

    /** Indica si el campo de Proveedor es inválido. */
    public isProveedorInvalida: boolean = false;

    /** Indica si el campo de Formulador es inválido. */
    public isFormuladorInvalida: boolean = false;


    /**
     * Datos del cuerpo de la tabla de establecimientos.
     * Se utiliza para almacenar las filas seleccionadas o actualizadas.
     */
   establecimientoFabricanteBodyData: any[] = [];

  /**
   * Indica si está habilitado el modo de edición para eliminar un proveedor.
   * Se utiliza para controlar la habilitación de botones o acciones de eliminación
   * cuando hay una fila seleccionada en la tabla de proveedores.
   * Valor booleano, por defecto 'false'.
   *
   * @example
   * this.isEditingEliminarProveedor = true; // Hay un proveedor seleccionado para eliminar
   * this.isEditingEliminarProveedor = false; // No hay proveedor seleccionado
   */
  isEditingEliminarFabricante = false;
    /**
   * Indica el modo actual del formulario de proveedor ("add" para agregar, "edit" para editar).
   * Se utiliza para controlar la visibilidad y el comportamiento del formulario de proveedor.
   * Valor vacío ('') por defecto.
   *
   * @example
   * this.isAddEditProveedor = 'add'; // Modo agregar proveedor
   * this.isAddEditProveedor = 'edit'; // Modo editar proveedor
   */
  isAddEditFabricante = '';

     /**
     * Datos del cuerpo de la tabla de establecimientos.
     * Se utiliza para almacenar las filas seleccionadas o actualizadas.
     */
   establecimientoFormuladorBodyData: any[] = [];

  /**
   * Indica si está habilitado el modo de edición para eliminar un proveedor.
   * Se utiliza para controlar la habilitación de botones o acciones de eliminación
   * cuando hay una fila seleccionada en la tabla de proveedores.
   * Valor booleano, por defecto 'false'.
   *
   * @example
   * this.isEditingEliminarProveedor = true; // Hay un proveedor seleccionado para eliminar
   * this.isEditingEliminarProveedor = false; // No hay proveedor seleccionado
   */
  isEditingEliminarFormulador = false;
    /**
   * Indica el modo actual del formulario de proveedor ("add" para agregar, "edit" para editar).
   * Se utiliza para controlar la visibilidad y el comportamiento del formulario de proveedor.
   * Valor vacío ('') por defecto.
   *
   * @example
   * this.isAddEditProveedor = 'add'; // Modo agregar proveedor
   * this.isAddEditProveedor = 'edit'; // Modo editar proveedor
   */
  isAddEditFormulador = '';

  /**
   * Constructor del componente.
   * Inyecta el FormBuilder, el store del trámite y el servicio de terceros.
   *
   * @param fb Constructor de formularios para crear los formularios reactivos.
   * @param tercerosFabricanteStore Store del trámite.
   * @param service Servicio que proporciona datos de terceros.
   */
  constructor(
    private fb: FormBuilder,
    private tercerosFabricanteStore: TercerosFabricanteStore,
    private tercerosFabricanteQuery: TercerosFabricanteQuery,
    @Inject(TercerosFabricanteService)
    private service: TercerosFabricanteService,
    private consultaioQuery: ConsultaioQuery,
    private servicioDeFormularioService: ServicioDeFormularioService,
    private _sharedSvc: Shared2605Service,
    private validacionesService: ValidacionesFormularioService,
    private sharedSvc: Shared2605Service

  ) {
    // Inicializa el store del trámite.
    this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState)=>{
            this.esFormularioSoloLectura = seccionState.readonly; 
            this.esFormularioActualizacion = seccionState.update;
          })
        )
        .subscribe()
  }

  /**
   * Método para obtener datos de ejemplo para la tabla.
   * Retorna un arreglo vacío de tipo TablaDatos.
   *
   * @returns Un arreglo vacío de TablaDatos.
   */
  fetchTableDummyJson(): void {
    this.fabricanteRowData.push(TERCEROS_RELACIONADOS_TABLA_BODY_DATOS);
    this.proveedorRowData.push(TERCEROS_RELACIONADOS_TABLA_BODY_DATOS);
    this.formuladorRowData.push(TERCEROS_RELACIONADOS_TABLA_BODY_DATOS);
  }

    /**
 * Sincroniza el cuerpo de la tabla cuando cambia la selección en la tabla hija
 */
public onBodyFabricanteChange(updatedBody: any[]): void {
  this.establecimientoFabricanteBodyData = updatedBody;
  const selectedCount = updatedBody.filter(row => row.selected).length;
  this.isEditingEliminarFabricante = selectedCount === 1;
}

    /**
 * Sincroniza el cuerpo de la tabla cuando cambia la selección en la tabla hija
 */
public onBodyFormuladorChange(updatedBody: any[]): void {
  this.establecimientoFormuladorBodyData = updatedBody;
  const selectedCount = updatedBody.filter(row => row.selected).length;
  this.isEditingEliminarFormulador = selectedCount === 1;
}


  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
    if(this.esFormularioSoloLectura || this.esFormularioActualizacion) {
    }
  }

    /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
    inicializarFormulario(): void {
      this.tercerosFabricanteQuery.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
            const normalize = (arr: any[]) => arr.map(val => (val === null || val === undefined || val === "") ? "" : String(val));
            const PROVEEDOR_DATA = seccionState.Proveedor ?? [];
            PROVEEDOR_DATA.forEach((item: {tbodyData: string[]}) => {
              if (Array.isArray(item.tbodyData)) {
                const NEW_DATA = normalize(item.tbodyData);
                const EXISTS = this.proveedorRowData.some(existing =>
                  JSON.stringify(normalize(existing.tbodyData)) === JSON.stringify(NEW_DATA)
                );

                if (!EXISTS) {
                  this.proveedorRowData.push({ tbodyData: NEW_DATA });
                }
              }
            });

            const FABRICANTE_DATA = seccionState.Fabricante ?? [];
            FABRICANTE_DATA.forEach((item: {tbodyData: string[]}) => {
              if (Array.isArray(item.tbodyData)) {
                const NEW_DATA = normalize(item.tbodyData);
                const EXISTS = this.fabricanteRowData.some(existing =>
                  JSON.stringify(normalize(existing.tbodyData)) === JSON.stringify(NEW_DATA)
                );

                if (!EXISTS) {
                  this.fabricanteRowData.push({ tbodyData: NEW_DATA });
                }
              }
            });

            const FORMULADOR_DATA = seccionState.Formulador ?? [];
            FORMULADOR_DATA.forEach((item: {tbodyData: string[]}) => {
              if (Array.isArray(item.tbodyData)) {
                const NEW_DATA = normalize(item.tbodyData);
                const EXISTS = this.formuladorRowData.some(existing =>
                  JSON.stringify(normalize(existing.tbodyData)) === JSON.stringify(NEW_DATA)
                );

                if (!EXISTS) {
                  this.formuladorRowData.push({ tbodyData: NEW_DATA });
                }
              }
            });

          })
        )
        .subscribe();
    }

  /**
   * Carga datos y deshabilita el formulario si es solo lectura.
  */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
  }

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Verifica si el control 'pais' dentro de un FormGroup ha sido tocado (touched).
 * @param formGroup Grupo de formulario que contiene el control 'pais'.
 * @returns `true` si el control 'pais' ha sido tocado; de lo contrario `false`.
 */
  public markPaisTouched!: ((formGroup: FormGroup) => boolean);

  /**
   * Ciclo de vida que se ejecuta al iniciar el componente.
   * Obtiene los datos para los selectores desde el servicio y inicializa los formularios.
   */
  ngOnInit(): void {

    if(this.idProcedimiento === 260504) {
      this.mostrarField.mostrarCodigoPostal = false;
      this.mostrarField.mostrarEstado = false;
    }
    this.markPaisTouched = (formGroup: FormGroup): boolean => {
      return Boolean(formGroup?.get('pais')?.touched);
    };
    
    
    if (this.idProcedimiento) {
      this.obtenerPaisList();
    } else {
    this.service
      .getData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.dropdownData = data;
      });
    }

    /**
     * Inicializa los formularios reactivos para agregar terceros.
     */
    this.initializeAgregarFabricanteFormGroup();
    this.initializeAgregarFormuladorFormGroup();
    this.initializeAgregarProveedorFormGroup();

    this.inicializarEstadoFormulario();
    this.servicioDeFormularioService.registerForm('tercerosForm', this.tercerosForm);
    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === 'tercerosForm') {
        this.tercerosForm.markAllAsTouched();
      }
    })
    if(this.fabricanteRowData.length>0){
      this.tableValidEvent.emit('fabricante');
      this.sharedSvc.fabricanteValidity=true;
    }
    if(this.formuladorRowData.length>0){
      this.tableValidEvent.emit('formulador');
       this.sharedSvc.formuladorValidity=true;
    }
    if(this.proveedorRowData.length>0){
      this.tableValidEvent.emit('proveedor');
       this.sharedSvc.proveedorValidity=true;
    }
  }

  /**
 * Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
 * Utiliza Promise.resolve() para asegurar que la validación se ejecute en el próximo ciclo del event loop.
 */
  ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.markTouched();
      });
    }
  }

  /**
   * Obtiene la lista de países para el desplegable según el procedimiento actual.
   * Si existe un id de procedimiento, se realiza una petición al servicio para obtener los datos.
   * En caso contrario, se asigna una lista de países por defecto.
   */
  obtenerPaisList(): void {
    if (this.idProcedimiento) {
      this.service
      .getPaisList(this.idProcedimiento?.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.paisDropdownData = data.datos ?? [];
      });
    } else {
      this.paisDropdownData = SELECT_OPTIONS_DATA.paisSelectData;
    }
  }

  /**
   * Inicializa el formulario para agregar un fabricante.
   * Configura los campos del formulario con validaciones y comportamientos específicos.
   */
  initializeAgregarFabricanteFormGroup(): void {
    /**
     * Crea el formulario reactivos para agregar un fabricante.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarFabricanteFormGroup = this.fb.group({
      /**
       * Nacionalidad del tercero.
       */
      tercerosNacionalidad: new FormControl('', [Validators.required]),
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl('', [Validators.required]),
      /**
       * RFC del tercero.
       * Requiere validación adicional mediante `rfcValidator`.
       */
      rfc: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(15),
        TercerosRelacionadosComponent.rfcValidator,
      ]),
      /**
       * CURP del tercero.
       * Requiere validación adicional mediante `curpValidator`.
       */
      curp: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(18),
        TercerosRelacionadosComponent.curpValidator,
      ]),
      /**
       * Control del formulario para el nombre del usuario.
       * Este campo es obligatorio.
       */
      nombre: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Control del formulario para el primer apellido del usuario.
       * Este campo es obligatorio.
       */
      primerApellido: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Control del formulario para el segundo apellido del usuario.
       * Este campo es obligatorio.
       */
      segundoApellido: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Denominación o razón social del tercero.
       */
      denominacionRazonSocial: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(REGEX_NOMBRE),
        Validators.maxLength(254)
      ]),
      /**
       * País del tercero.
       * Requiere validación adicional mediante `requiredPaisValidator`.
       */
      pais: new FormControl({ value: '', disabled: true }, [
        Validators.required,
         Validators.maxLength(120),
        TercerosRelacionadosComponent.requiredPaisValidator,
      ]),
      /**
       * Estado o localidad del tercero.
       */
      estadoLocalidad: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(255)]),
      /**
       * Municipio o alcaldía del tercero.
       */
      municipioAlcaldia: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(120)]),
      /**
       * Localidad del tercero.
       */
      localidad: new FormControl({ value: '', disabled: true },[Validators.maxLength(120)]),
      /**
       * Entidad federativa del tercero.
       */
      entidadFederativa: new FormControl({ value: '', disabled: true }, [Validators.required]),
      /**
       * Código postal del tercero.
       */
      codigoPostaloEquivalente: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(12), Validators.pattern(/^[a-zA-Z0-9]*$/)]),
      /**
       * Colonia del tercero.
       */
      colonia: new FormControl({ value: '', disabled: true }),
      /**
       * Colonia equivalente del tercero.
       */
      coloniaoEquivalente: new FormControl({ value: '', disabled: true },[Validators.maxLength(100)]),
      /**
       * Calle del tercero.
       */
      calle: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(100)]),
      /**
       * Número exterior del tercero.
       */
      numeroExterior: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(55)]),
      /**
       * Número interior del tercero.
       */
      numeroInterior: new FormControl({ value: '', disabled: true },[Validators.maxLength(55),Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Lada del tercero.
       */
      lada: new FormControl({ value: '', disabled: true },[
        Validators.pattern(REGEX_NOMBRE),
      ]),
      /**
       * Teléfono del tercero.
       * Requiere validación adicional mediante `telefonoValidator`.
       */
      telefono: new FormControl({ value: '', disabled: true }, [
        TercerosRelacionadosComponent.telefonoValidator,
         Validators.pattern(REGEX_SOLO_NUMEROS),
         Validators.maxLength(30)
      ]),
      /**
       * Correo electrónico del tercero.
       */
      correoElectronico: new FormControl({ value: '', disabled: true },[Validators.maxLength(320),Validators.pattern(REGEX_CORREO_ELECTRONICO)]),
      /**
       * Código del extranjero.
       */
      extranjeroCodigo: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Estado del extranjero.
       */
      extranjeroEstado: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Colonia del extranjero.
       */
      extranjeroColonia: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }

  /**
   * Inicializa el formulario para agregar un formulador.
   * Configura los campos del formulario con validaciones y comportamientos específicos.
   */
  initializeAgregarFormuladorFormGroup(): void {
    /**
     * Crea el formulario reactivos para agregar un formulador.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarFormuladorFormGroup = this.fb.group({
      /**
       * Nacionalidad del tercero.
       */
      tercerosNacionalidad: new FormControl('', [Validators.required]),
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl('', [Validators.required]),
      /**
       * RFC del tercero.
       * Requiere validación adicional mediante `rfcValidator`.
       */
      rfc: new FormControl({ value: '', disabled: true }, [
        Validators.required,
         Validators.maxLength(15),
        TercerosRelacionadosComponent.rfcValidator,
      ]),
      /**
       * CURP del tercero.
       * Requiere validación adicional mediante `curpValidator`.
       */
      curp: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(18),
        TercerosRelacionadosComponent.curpValidator,
      ]),
      /**
       * Control del formulario para el nombre del usuario.
       * Este campo es obligatorio.
       */
      nombre: new FormControl({value:'',disabled:true}, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(200)]),
      /**
       * Control del formulario para el primer apellido del usuario.
       * Este campo es obligatorio.
       */
      primerApellido: new FormControl({value:'',disabled:true}, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Control del formulario para el segundo apellido del usuario.
       * Este campo es obligatorio.
       */
      segundoApellido: new FormControl({value:'',disabled:true}, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Denominación o razón social del tercero.
       */
      denominacionRazonSocial: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(REGEX_NOMBRE),
        Validators.maxLength(254)
      ]),
      /**
       * País del tercero.
       * Requiere validación adicional mediante `requiredPaisValidator`.
       */
      pais: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(120),
        TercerosRelacionadosComponent.requiredPaisValidator,
      ]),
      /**
       * Estado o localidad del tercero.
       */
      estadoLocalidad: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(255)]),
      /**
       * Municipio o alcaldía del tercero.
       */
      municipioAlcaldia: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(120)]),
      /**
       * Localidad del tercero.
       */
      localidad: new FormControl({ value: '', disabled: true },[Validators.maxLength(120)]),
      /**
       * Entidad federativa del tercero.
       */
      entidadFederativa: new FormControl({ value: '', disabled: true }, [Validators.required]),
      /**
       * Código postal del tercero.
       */
      codigoPostaloEquivalente: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(12)]),
      /**
       * Colonia del tercero.
       */
      colonia: new FormControl({ value: '', disabled: true }),
      /**
       * Colonia equivalente del tercero.
       */
      coloniaoEquivalente: new FormControl({ value: '', disabled: true },[Validators.maxLength(100)]),
      /**
       * Calle del tercero.
       */
      calle: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(100)]),
      /**
       * Número exterior del tercero.
       */
      numeroExterior: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(55)]),
      /**
       * Número interior del tercero.
       */
      numeroInterior: new FormControl({ value: '', disabled: true },[Validators.pattern(REGEX_NOMBRE),Validators.maxLength(55)]),
      /**
       * Lada del tercero.
       */
      lada: new FormControl({ value: '', disabled: true },[
        Validators.pattern(REGEX_NOMBRE),
      ]),
      /**
       * Teléfono del tercero.
       * Requiere validación adicional mediante `telefonoValidator`.
       */
      telefono: new FormControl({ value: '', disabled: true }, [
        TercerosRelacionadosComponent.telefonoValidator,
         Validators.pattern(REGEX_SOLO_NUMEROS),
        Validators.maxLength(30)
      ]),
      /**
       * Correo electrónico del tercero.
       */
      correoElectronico: new FormControl({ value: '', disabled: true },[Validators.maxLength(320),Validators.pattern(REGEX_CORREO_ELECTRONICO),]),
      /**
       * Código del extranjero.
       */
      extranjeroCodigo: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Estado del extranjero.
       */
      extranjeroEstado: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Colonia del extranjero.
       */
      extranjeroColonia: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }

  /**
   * Valida el RFC del tercero.
   * Utiliza expresiones regulares para verificar el formato correcto.
   *
   * @param control Control del formulario que contiene el RFC.
   * @returns Un objeto de error si el RFC es inválido, o `null` si es válido.
   */
  onTipoPersonaChange(formGroup: FormGroup): void {
    this.tipoPersonaSelection = formGroup.get('tipoPersona')?.value || '';
    const TIPO_PERSONA_CONTROL = formGroup.get('tipoPersona');
    this.resetAllExcept(formGroup, ['tercerosNacionalidad', 'tipoPersona']);
    if (TIPO_PERSONA_CONTROL?.value && this.nacional && !this.extranjero) {
      if(this.fisica || this.moral) {
          formGroup.get('rfc')?.enable();
          formGroup.get('curp')?.disable();
      } else if(this.noContribuyente) {
          formGroup.get('rfc')?.disable();
          formGroup.get('curp')?.enable();
          
          [
            'pais', 'estadoLocalidad', 'municipioAlcaldia', 'localidad', 'codigoPostaloEquivalente',
            'colonia', 'calle', 'numeroExterior', 'numeroInterior', 'lada', 'telefono', 'correoElectronico'
          ].forEach(key => formGroup.get(key)?.enable());
      } else {
          formGroup.get('rfc')?.enable();
          formGroup.get('curp')?.enable();
      }
    } else {
      formGroup.enable();
    }  
  }

  /**
   * Inicializa el formulario para agregar un proveedor.
   * Configura los campos del formulario con validaciones y comportamientos específicos.
   */
  initializeAgregarProveedorFormGroup(): void {
    /**
     * Crea el formulario reactivos para agregar un proveedor.
     * Cada campo tiene sus propias validaciones.
     */
    this.agregarProveedorFormGroup = this.fb.group({
      /**
       * Nacionalidad del tercero.
       */
      tercerosNacionalidad: new FormControl('', [Validators.required]),
      /**
       * Tipo de persona (física o moral).
       */
      tipoPersona: new FormControl('', [Validators.required]),
      /**
       * RFC del tercero.
       * Requiere validación adicional mediante `rfcValidator`.
       */
      rfc: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(15),
        TercerosRelacionadosComponent.rfcValidator,
      ]),
      /**
       * CURP del tercero.
       * Requiere validación adicional mediante `curpValidator`.
       */
      curp: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(18),
        TercerosRelacionadosComponent.curpValidator,
      ]),
      /**
       * Control del formulario para el nombre del usuario.
       * Este campo es obligatorio.
       */
      nombre: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Control del formulario para el primer apellido del usuario.
       * Este campo es obligatorio.
       */
      primerApellido: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Control del formulario para el segundo apellido del usuario.
       * Este campo es obligatorio.
       */
      segundoApellido: new FormControl({ value: '', disabled: true }, [Validators.required]),
      /**
       * Denominación o razón social del tercero.
       */
      denominacionRazonSocial: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(REGEX_NOMBRE),
        Validators.maxLength(254)
      ]),
      /**
       * País del tercero.
       * Requiere validación adicional mediante `requiredPaisValidator`.
       */
      pais: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.maxLength(120),
        TercerosRelacionadosComponent.requiredPaisValidator,
      ]),
      /**
       * Estado o localidad del tercero.
       */
      estadoLocalidad: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(255)]),
      /**
       * Municipio o alcaldía del tercero.
       */
      municipioAlcaldia: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(120)]),
      /**
       * Localidad del tercero.
       */
      localidad: new FormControl({ value: '', disabled: true },[Validators.maxLength(120)]),
      /**
       * Entidad federativa del tercero.
       */
      entidadFederativa: new FormControl({ value: '', disabled: true }, [Validators.required]),
      /**
       * Código postal del tercero.
       */
      codigoPostaloEquivalente: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.maxLength(12)]),
      /**
       * Colonia del tercero.
       */
      colonia: new FormControl({ value: '', disabled: true }),
      /**
       * Colonia equivalente del tercero.
       */
      coloniaoEquivalente: new FormControl({ value: '', disabled: true },[Validators.maxLength(100)]),
      /**
       * Calle del tercero.
       */
      calle: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(100)]),
      /**
       * Número exterior del tercero.
       */
      numeroExterior: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE),Validators.maxLength(55)]),
      /**
       * Número interior del tercero.
       */
      numeroInterior: new FormControl({ value: '', disabled: true },[Validators.pattern(REGEX_NOMBRE),Validators.maxLength(55)]),
      /**
       * Lada del tercero.
       */
      lada: new FormControl({ value: '', disabled: true },[
        Validators.pattern(REGEX_NOMBRE),
      ]),
      /**
       * Teléfono del tercero.
       * Requiere validación adicional mediante `telefonoValidator`.
       */
      telefono: new FormControl({ value: '', disabled: true }, [
        TercerosRelacionadosComponent.telefonoValidator,
         Validators.pattern(REGEX_SOLO_NUMEROS),
        Validators.maxLength(30)
      ]),
      /**
       * Correo electrónico del tercero.
       */
      correoElectronico: new FormControl({ value: '', disabled: true },[Validators.maxLength(320),Validators.pattern(REGEX_CORREO_ELECTRONICO)]),
      /**
       * Código del extranjero.
       */
      extranjeroCodigo: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Estado del extranjero.
       */
      extranjeroEstado: new FormControl({ value: '', disabled: true }, [Validators.required,Validators.pattern(REGEX_NOMBRE)]),
      /**
       * Colonia del extranjero.
       */
      extranjeroColonia: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }

  /**
   * Encabezados para la tabla de fabricantes.
   * Utiliza los mismos encabezados definidos en `TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS`.
   *
   * @description Estos encabezados definen las columnas que se mostrarán en la tabla de fabricantes.
   */
  fabricanteHeaderData = TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS;

  /**
   * Encabezados para la tabla de formuladors.
   * Utiliza los mismos encabezados definidos en `TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS`.
   *
   * @description Estos encabezados definen las columnas que se mostrarán en la tabla de formuladors.
   */
  formuladorHeaderData = TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS;

  /**
   * Encabezados para la tabla de proveedores.
   * Utiliza los mismos encabezados definidos en `TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS`.
   *
   * @description Estos encabezados definen las columnas que se mostrarán en la tabla de proveedores.
   */
  proveedorHeaderData = TERCEROS_RELACIONADOS_TABLA_HEADER_DATOS;

  public nacional = false;

  public extranjero = false;

  public noContribuyente = false;

  /**
   * Indicador para determinar si se ha seleccionado una persona física.
   * Inicialmente establecido en `false`.
   *
   * @description Este indicador se utiliza para controlar la lógica relacionada con personas físicas.
   */
  public fisica = false;

  /**
   * Indicador para determinar si se ha seleccionado una persona moral.
   * Inicialmente establecido en `false`.
   *
   * @description Este indicador se utiliza para controlar la lógica relacionada con personas morales.
   */
  public moral = false;

  /**
   * Datos de las filas para la tabla de fabricantes.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de fabricantes.
   */
  fabricanteRowData: TablaDatos[] = [];

  /**
   * Datos de las filas para la tabla de formuladors.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de formuladors.
   */
  formuladorRowData: TablaDatos[] = [];

  /**
   * Datos de las filas para la tabla de proveedores.
   * Inicialmente vacío, se llenará con los datos agregados por el usuario.
   *
   * @description Este arreglo almacena las filas que se mostrarán en la tabla de proveedores.
   */
  proveedorRowData: TablaDatos[] = [];

  /**
   * Maneja el cambio en los checkboxes para seleccionar el tipo de persona.
   * Actualiza los indicadores `fisica` y `moral` según el checkbox seleccionado.
   *
   * @param checkBoxName Nombre del checkbox seleccionado (fisica o moral).
   */
  public inputChecked(checkBoxName: string, formGroup?: FormGroup): void {
    if (checkBoxName === 'fisica') {
      this.fisica = true;
      this.moral = false;
      this.noContribuyente = false;
      if(this.extranjero){
        this.agregarFormuladorFormGroup.enable();
        this.agregarProveedorFormGroup.enable();
      }else{
        this.agregarFormuladorFormGroup.disable();
        this.agregarProveedorFormGroup.disable();
        this.agregarFormuladorFormGroup.get('tercerosNacionalidad')?.enable();
        this.agregarFormuladorFormGroup.get('tipoPersona')?.enable();
        this.agregarProveedorFormGroup.get('tercerosNacionalidad')?.enable();
        this.agregarProveedorFormGroup.get('tipoPersona')?.enable();
      }
    } else if (checkBoxName === 'moral') {
      this.fisica = false;
      this.moral = true;
      this.noContribuyente = false;
      if(this.extranjero){
        this.agregarFormuladorFormGroup.enable();
        this.agregarProveedorFormGroup.enable();
      }else{
        this.agregarFormuladorFormGroup.disable();
        this.agregarProveedorFormGroup.disable();
        this.agregarFormuladorFormGroup.get('tercerosNacionalidad')?.enable();
        this.agregarFormuladorFormGroup.get('tipoPersona')?.enable();
        this.agregarProveedorFormGroup.get('tercerosNacionalidad')?.enable();
        this.agregarProveedorFormGroup.get('tipoPersona')?.enable();
      }
    } else {
      this.noContribuyente = true;
      this.fisica = false;
      this.moral = false;
    }

    // Condition for updating the validitity on tipo persona change
    if (this.extranjero && (this.fisica || this.moral) && formGroup) {
      if(!this.mostrarField.mostrarEstado) {
        formGroup.get('extranjeroEstado')?.clearValidators();
      }
      if (this.fisica) {
        ['rfc', 'curp', 'denominacionRazonSocial', 'codigoPostaloEquivalente', 'entidadFederativa','municipioAlcaldia', 'extranjeroCodigo', 'extranjeroColonia', 'estadoLocalidad'].forEach(key => formGroup.get(key)?.clearValidators());
        ['nombre', 'primerApellido', 'segundoApellido'].forEach(key => formGroup.get(key)?.setValidators([Validators.required]));
      } else if (this.moral) {
             ['rfc', 'curp', 'entidadFederativa', 'codigoPostaloEquivalente', 'municipioAlcaldia','extranjeroCodigo', 'extranjeroColonia', 'nombre', 'primerApellido', 'segundoApellido', 'estadoLocalidad'].forEach(key => formGroup.get(key)?.clearValidators());
        ['denominacionRazonSocial'].forEach(key => formGroup.get(key)?.setValidators([Validators.required]));
      }
      formGroup.updateValueAndValidity();
    }
    if (this.nacional && (this.fisica || this.moral) && formGroup) {
      ['rfc'].forEach(key => formGroup.get(key)?.setValidators([Validators.required, Validators.maxLength(15), TercerosRelacionadosComponent.rfcValidator,]));
      ['curp'].forEach(key => formGroup.get(key)?.clearValidators());
      formGroup.updateValueAndValidity();
    }
    if (this.nacional && this.noContribuyente && formGroup) {
      ['curp'].forEach(key => formGroup.get(key)?.setValidators([Validators.required, Validators.maxLength(18), TercerosRelacionadosComponent.curpValidator,]));
      ['rfc'].forEach(key => formGroup.get(key)?.clearValidators());
      formGroup.updateValueAndValidity();
    }
  }

  public tercerosInputChecked(checkBoxName: string): void {
    this.fisica = false;
    this.moral = false;
    this.noContribuyente = false;
    if (checkBoxName === 'nacional') {
      this.nacional = true;
      this.extranjero = false;
    } else {
      this.nacional = false;
      this.extranjero = true;
    }
  }

  /**
   * Cambia la visibilidad del formulario de Fabricante.
   * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
   */
  toggleDivFabricante(value:any): void {
     this.isAddEditFabricante = value;
    this.fisica = false;
    this.moral = false;
    this.showTableDiv = !this.showTableDiv;
    this.showFabricante = !this.showFabricante;
  }

  /**
   * Cambia la visibilidad del formulario de Formulador.
   * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
   */
  toggleDivFormulador(value:any): void {
    this.isAddEditFormulador = value;
    this.fisica = false;
    this.moral = false;
    this.showTableDiv = !this.showTableDiv;
    this.showFormulador = !this.showFormulador;
  }

  /**
   * Cambia la visibilidad del formulario de Proveedor.
   * Oculta la tabla principal y muestra el formulario, también resetea los valores de persona física y moral.
   */
 toggleDivProveedor(value:any): void {
   this.isAddEditProveedor = value;
    this.fisica = false;
    this.moral = false;
    this.showTableDiv = !this.showTableDiv;
    this.showProveedor = !this.showProveedor;
  }
/**
 * Permite modificar un Formulador existente.
 * Rellena el formulario con los datos seleccionados.
 * Activa el modo edición y oculta la tabla.
 */
  modificarFormulador(value:any): void {
    this.isAddEditFormulador = value;
  if (!this.selectedFormuladorRow) { return; }

  // Find the index of the selected row
  this.editFormuladorIndex = this.formuladorRowData.findIndex(
    row => JSON.stringify(row.tbodyData) === JSON.stringify(this.selectedFormuladorRow?.tbodyData)
  );

  if (this.editFormuladorIndex === -1) { return; }

  const SELECTED_ROW = this.selectedFormuladorRow.tbodyData;

  this.agregarFormuladorFormGroup.patchValue({
    denominacionRazonSocial: SELECTED_ROW[0],
    rfc: SELECTED_ROW[1],
    curp: SELECTED_ROW[2],
    telefono: SELECTED_ROW[3],
    correoElectronico: SELECTED_ROW[4],
    calle: SELECTED_ROW[5],
    numeroExterior: SELECTED_ROW[6],
    numeroInterior: SELECTED_ROW[7],
    pais: SELECTED_ROW[8],
    colonia: SELECTED_ROW[9],
    municipioAlcaldia: SELECTED_ROW[10],
    localidad: SELECTED_ROW[11],
    entidadFederativa: SELECTED_ROW[12],
    estadoLocalidad: SELECTED_ROW[13],
    codigoPostaloEquivalente: SELECTED_ROW[14],
  });

  this.showFormulador = true;
  this.showTableDiv = false;
  this.isEditingFormulador = true;
}
/**
 * Permite modificar un Proveedor existente.
 * Rellena el formulario con los datos seleccionados.
 * Activa el modo edición y oculta la tabla.
 */
  modificarProveedor(value:any): void {
     this.isAddEditProveedor = value;
  if (!this.selectedProveedorRow) { return; }  
  this.editProveedorIndex = this.proveedorRowData.findIndex(
    row => JSON.stringify(row.tbodyData) === JSON.stringify(this.selectedProveedorRow?.tbodyData)
  );
  if (this.editProveedorIndex === -1) { return; }
  const SELECTED_ROW = this.selectedProveedorRow.tbodyData;
  this.agregarProveedorFormGroup.patchValue({
    denominacionRazonSocial: SELECTED_ROW[0],
    rfc: SELECTED_ROW[1],
    curp: SELECTED_ROW[2],
    telefono: SELECTED_ROW[3],
    correoElectronico: SELECTED_ROW[4],
    calle: SELECTED_ROW[5],
    numeroExterior: SELECTED_ROW[6],
    numeroInterior: SELECTED_ROW[7],
    pais: SELECTED_ROW[8],
    colonia: SELECTED_ROW[9],
    municipioAlcaldia: SELECTED_ROW[10],
    localidad: SELECTED_ROW[11],
    entidadFederativa: SELECTED_ROW[12],
    estadoLocalidad: SELECTED_ROW[13],
    codigoPostaloEquivalente: SELECTED_ROW[14],
  });
  this.showProveedor = true;
  this.showTableDiv = false;
  this.isEditingProveedor = true;
}
/**
 * Permite modificar un Fabricante existente.
 * Rellena el formulario con los datos seleccionados.
 * Activa el modo edición y oculta la tabla.
 */
modificarFabricante(value:any): void {
    this.isAddEditFabricante = value;
  if (!this.selectedFabricanteRow) {return}    
this.editFabricanteIndex = this.fabricanteRowData.findIndex(
  row => JSON.stringify(row.tbodyData) === JSON.stringify(this.selectedFabricanteRow?.tbodyData)
);
  if (this.editFabricanteIndex === -1) {return}
  const SELECTED_ROW = this.selectedFabricanteRow.tbodyData; 
  this.agregarFabricanteFormGroup.patchValue({
    denominacionRazonSocial: SELECTED_ROW[0],
    rfc: SELECTED_ROW[1],
    curp: SELECTED_ROW[2],
    telefono: SELECTED_ROW[3],
    correoElectronico: SELECTED_ROW[4],
    calle: SELECTED_ROW[5],
    numeroExterior: SELECTED_ROW[6],
    numeroInterior: SELECTED_ROW[7],
    pais: SELECTED_ROW[8],
    colonia: SELECTED_ROW[9],
    municipioAlcaldia: SELECTED_ROW[10],
    localidad: SELECTED_ROW[11],
    entidadFederativa: SELECTED_ROW[12],
    estadoLocalidad: SELECTED_ROW[13],
    codigoPostaloEquivalente: SELECTED_ROW[14],
  });
  this.showFabricante = true;
  this.showTableDiv = false;
  this.isEditingFabricante = true;
}
  /**
   * Envía el formulario de Formulador y actualiza los datos en el store.
   * Obtiene los valores seleccionados de los dropdowns y crea una nueva fila para la tabla.
   *
   * @description Este método es llamado al enviar el formulario de agregar un formulador.
   */
  submitFabricanteForm(forma: FormGroup): void {
   this.applyProveedorTelefonoValidators(this.agregarFabricanteFormGroup);
    if (this.agregarFabricanteFormGroup.valid) {
      /**
     * Obtiene el valor de la localidad seleccionada en el formulario.
     */
  const LOCALIDAD_VALOR = this.localidadDropdownData.find(
    item => item.id === this.agregarFabricanteFormGroup.value.localidad
  )?.descripcion || this.agregarFabricanteFormGroup.get('localidad')?.value;

  const MUNICIPIO_VALOR = this.municipioDropdownData.find(
    item => item.id === this.agregarFabricanteFormGroup.value.municipioAlcaldia
  )?.descripcion || this.agregarFabricanteFormGroup.get('municipioAlcaldia')?.value;

  const CODIGO_POSTAL_VALOR = this.codigoPostalDropdownData.find(
    item => item.id === this.agregarFabricanteFormGroup.value.codigoPostaloEquivalente
  )?.descripcion || this.agregarFabricanteFormGroup.get('codigoPostaloEquivalente')?.value;

  const COLONIA_VALOR = this.coloniaDropdownData.find(
    item => item.id === this.agregarFabricanteFormGroup.value.colonia
  )?.descripcion || this.agregarFabricanteFormGroup.get('colonia')?.value ;

  const NOMBRE = this.agregarFabricanteFormGroup.get('nombre')?.value + ' ' +
    this.agregarFabricanteFormGroup.get('primerApellido')?.value + ' ' +
    this.agregarFabricanteFormGroup.get('segundoApellido')?.value;

 
  const FABRICANTE_FILA = {
    tbodyData: [
      this.agregarFabricanteFormGroup.get('denominacionRazonSocial')?.value ? this.agregarFabricanteFormGroup.get('denominacionRazonSocial')?.value : NOMBRE,
      this.agregarFabricanteFormGroup.get('rfc')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('curp')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('telefono')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('correoElectronico')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('calle')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('numeroExterior')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('numeroInterior')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('pais')?.value ?? '---',
      COLONIA_VALOR,
      MUNICIPIO_VALOR,
      LOCALIDAD_VALOR,
      this.agregarFabricanteFormGroup.get('entidadFederativa')?.value ?? '---',
      this.agregarFabricanteFormGroup.get('estadoLocalidad')?.value ?? '---',
      CODIGO_POSTAL_VALOR ?? '---',
    ],
  };

   if (this.isEditingFabricante && this.editFabricanteIndex > -1) {    
    this.fabricanteRowData[this.editFabricanteIndex] = FABRICANTE_FILA;
     this.tercerosFabricanteStore.setFabricante([...this.fabricanteRowData]);
    this.isEditingFabricante = false;   
  } else {    
    this.tercerosFabricanteStore.setFabricante([FABRICANTE_FILA]);
  }  
  this.tableValidEvent.emit('fabricante');
  this.selectedFabricanteRow = null;
  this.showFabricanteButtons = false;
  this.showTableDiv = !this.showTableDiv;
  this.showFabricante = !this.showFabricante;  
    this.limpiar(forma);
    } else {
      this.agregarFabricanteFormGroup.markAllAsTouched();
    }
    
}  

/**
   * Envía el formulario de Formulador y actualiza los datos en el store.
   * Obtiene los valores seleccionados de los dropdowns y crea una nueva fila para la tabla.
   *
   * @description Este método es llamado al enviar el formulario de agregar un formulador.
   */
  submitFormuladorForm(forma: FormGroup): void {
   this.applyProveedorTelefonoValidators(this.agregarFormuladorFormGroup);
    if (this.agregarFormuladorFormGroup.valid) {
      /**
     * Obtiene el valor de la localidad seleccionada en el formulario.
     */
    const LOCALIDAD_VALOR = this.localidadDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarFormuladorFormGroup.value.localidad
    )?.descripcion || this.agregarFormuladorFormGroup.get('localidad')?.value;

    /**
     * Obtiene el valor del municipio seleccionado en el formulario.
     */
    const MUNICIPIO_VALOR = this.municipioDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarFormuladorFormGroup.value.municipioAlcaldia
    )?.descripcion || this.agregarFormuladorFormGroup.get('municipioAlcaldia')?.value;

    /**
     * Obtiene el valor del código postal seleccionado en el formulario.
     */
    const CODIGO_POSTAL_VALOR = this.codigoPostalDropdownData.find(
      (item: Catalogo) =>
        item.id ===
        this.agregarFormuladorFormGroup.value.codigoPostaloEquivalente
    )?.descripcion || this.agregarFormuladorFormGroup.get('codigoPostaloEquivalente')?.value;

    /**
     * Obtiene el valor de la colonia seleccionada en el formulario.
     */
    const COLONIA_VALOR = this.coloniaDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarFormuladorFormGroup.value.colonia
    )?.descripcion || this.agregarFormuladorFormGroup.get('colonia')?.value;

    const NOMBRE = this.agregarFormuladorFormGroup.get('nombre')?.value + ' ' +
    this.agregarFormuladorFormGroup.get('primerApellido')?.value + ' ' +
    this.agregarFormuladorFormGroup.get('segundoApellido')?.value;

    /**
     * Crea una nueva fila para la tabla de formuladors.
     * Esta fila contiene los datos del formulario de agregar un formulador.
     *
     * @description Esta fila se agrega a la lista de filas del formulador.
     */
    const FORMULADOR_FILA = {
      /**
       * Datos de la fila que se mostrarán en la tabla.
       * Cada elemento del arreglo corresponde a una columna de la tabla.
       */
      tbodyData: [
        /**
         * Denominación o razón social del formulador.
         */
        this.agregarFormuladorFormGroup.get('denominacionRazonSocial')?.value ?? NOMBRE,

        /**
         * RFC del formulador.
         */
        this.agregarFormuladorFormGroup.get('rfc')?.value ?? '---',

        /**
         * CURP del formulador.
         */
        this.agregarFormuladorFormGroup.get('curp')?.value ?? '---',

        /**
         * Teléfono del formulador, incluyendo lada.
         */
        this.agregarFormuladorFormGroup.get('telefono')?.value ?? '---',

        /**
         * Correo electrónico del formulador.
         */
        this.agregarFormuladorFormGroup.get('correoElectronico')?.value ?? '---',

        /**
         * Calle del formulador.
         */
        this.agregarFormuladorFormGroup.get('calle')?.value ?? '---',

        /**
         * Número exterior del formulador.
         */
        this.agregarFormuladorFormGroup.get('numeroExterior')?.value ?? '---',

        /**
         * Número interior del formulador.
         */
        this.agregarFormuladorFormGroup.get('numeroInterior')?.value ?? '---',

        /**
         * País del formulador.
         */
        this.agregarFormuladorFormGroup.get('pais')?.value ?? '---',

        /**
         * Colonia del formulador.
         */
        COLONIA_VALOR,

        /**
         * Municipio del formulador.
         */
        MUNICIPIO_VALOR,

        /**
         * Localidad del formulador.
         */
        LOCALIDAD_VALOR,

        /**
         * Entidad federativa del formulador.
         */
        this.agregarFormuladorFormGroup.get('entidadFederativa')?.value ?? '---',

        /**
         * Estado o localidad del formulador.
         */
        this.agregarFormuladorFormGroup.get('estadoLocalidad')?.value ?? '---',

        /**
         * Código postal del formulador.
         */
        CODIGO_POSTAL_VALOR,
      ],
    };


     if (this.isEditingFormulador && this.editFormuladorIndex > -1) {    
    this.formuladorRowData[this.editFormuladorIndex] = FORMULADOR_FILA;
     this.tercerosFabricanteStore.setFormulador([...this.formuladorRowData]);
    this.isEditingFormulador = false;   
  } else {    
    this.tercerosFabricanteStore.setFormulador([FORMULADOR_FILA]);
  } 
    /**
     * Actualiza el estado del store con los nuevos datos del proveedor.
     */
    this.selectedFormuladorRow = null;
   this.showFormuladorButtons = false;   
    this.tableValidEvent.emit('formulador');
    this.showTableDiv = !this.showTableDiv;
    this.showFormulador = !this.showFormulador;
    this.limpiar(forma);
    } else {
      this.agregarFormuladorFormGroup.markAllAsTouched();
    }
    
  }
 /**
   * Aplica los validadores de teléfono estándar al control 'telefono' del form group de proveedor.
   */
  private applyProveedorTelefonoValidators(formBinding: FormGroup): void {
    if ((this.extranjero && this.fisica) || (this.extranjero && this.moral)) {
    const telefonoControl = formBinding.get('telefono');
    telefonoControl?.clearValidators();
    telefonoControl?.setValidators([Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(30)]);
    telefonoControl?.updateValueAndValidity();
      }
  }
  /**
   * Envía el formulario de Proveedor y actualiza los datos en el store.
   * Crea una nueva fila para la tabla con los datos del formulario.
   *
   * @description Este método es llamado al enviar el formulario de agregar un proveedor.
   */
  submitProveedorForm(forma: FormGroup): void {
    if ((this.extranjero && this.fisica) || (this.extranjero && this.moral)) {
     const segundoApellidoControl = this.agregarProveedorFormGroup.get('segundoApellido');
    segundoApellidoControl?.clearValidators();
    segundoApellidoControl?.setValidators([Validators.pattern(REGEX_NOMBRE)]);
    segundoApellidoControl?.updateValueAndValidity();
   }
    else{
    const segundoApellidoControl = this.agregarProveedorFormGroup.get('segundoApellido');
    segundoApellidoControl?.setValidators([Validators.required,Validators.pattern(REGEX_NOMBRE)]);
    segundoApellidoControl?.updateValueAndValidity();
    }
    this.applyProveedorTelefonoValidators(this.agregarProveedorFormGroup);
    if (this.agregarProveedorFormGroup.valid) {
      /**
     * Obtiene el valor de la localidad seleccionada en el formulario.
     */
    const LOCALIDAD_VALOR = this.localidadDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarProveedorFormGroup.value.localidad
    )?.descripcion || this.agregarFormuladorFormGroup.get('localidad')?.value;

    /**
     * Obtiene el valor del municipio seleccionado en el formulario.
     */
    const MUNICIPIO_VALOR = this.municipioDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarProveedorFormGroup.value.municipioAlcaldia
    )?.descripcion || this.agregarFormuladorFormGroup.get('municipioAlcaldia')?.value;

    /**
     * Obtiene el valor del código postal seleccionado en el formulario.
     */
    const CODIGO_POSTAL_VALOR = this.codigoPostalDropdownData.find(
      (item: Catalogo) =>
        item.id ===
        this.agregarProveedorFormGroup.value.codigoPostaloEquivalente
    )?.descripcion || this.agregarFormuladorFormGroup.get('codigoPostaloEquivalente')?.value;

    /**
     * Obtiene el valor de la colonia seleccionada en el formulario.
     */
    const COLONIA_VALOR = this.coloniaDropdownData.find(
      (item: Catalogo) =>
        item.id === this.agregarProveedorFormGroup.value.colonia
    )?.descripcion || this.agregarProveedorFormGroup.get('colonia')?.value;

    const NOMBRE = this.agregarProveedorFormGroup.get('nombre')?.value + ' ' +
    this.agregarProveedorFormGroup.get('primerApellido')?.value + ' ' +
    (this.agregarProveedorFormGroup.get('segundoApellido')?.value ? this.agregarProveedorFormGroup.get('segundoApellido')?.value : '');
    /**
     * Crea una nueva fila para la tabla de proveedor.
     * Esta fila contiene los datos del formulario de agregar un proveedor.
     *
     * @description Esta fila se agrega a la lista de filas del proveedor.
     */
    const PROVEEDOR_FILA = {
      /**
       * Datos de la fila que se mostrarán en la tabla.
       * Cada elemento del arreglo corresponde a una columna de la tabla.
       */
      tbodyData: [
        /**
         * Denominación o razón social del proveedor.
         */
        this.agregarProveedorFormGroup.get('denominacionRazonSocial')?.value ?? NOMBRE,

        /**
         * RFC del proveedor.
         */
        this.agregarProveedorFormGroup.get('rfc')?.value ?? '---',

        /**
         * CURP del proveedor.
         */
        this.agregarProveedorFormGroup.get('curp')?.value ?? '---',

        /**
         * Teléfono del proveedor, incluyendo lada.
         */
        this.agregarProveedorFormGroup.get('telefono')?.value ?? '---',

        /**
         * Correo electrónico del proveedor.
         */
        this.agregarProveedorFormGroup.get('correoElectronico')?.value ?? '---',

        /**
         * Calle del proveedor.
         */
        this.agregarProveedorFormGroup.get('calle')?.value ?? '---',

        /**
         * Número exterior del proveedor.
         */
        this.agregarProveedorFormGroup.get('numeroExterior')?.value ?? '---',

        /**
         * Número interior del proveedor.
         */
        this.agregarProveedorFormGroup.get('numeroInterior')?.value ?? '---',

        /**
         * País del proveedor.
         */
        this.agregarProveedorFormGroup.get('pais')?.value ?? '---',

        /**
         * Colonia del proveedor.
         */
        COLONIA_VALOR,

        /**
         * Municipio del proveedor.
         */
        MUNICIPIO_VALOR,

        /**
         * Localidad del proveedor.
         */
        LOCALIDAD_VALOR,

        /**
         * Entidad federativa del proveedor.
         */
        this.agregarProveedorFormGroup.get('entidadFederativa')?.value ?? '---',

        /**
         * Estado o localidad del proveedor.
         */
        this.agregarProveedorFormGroup.get('estadoLocalidad')?.value ?? '---',

        /**
         * Código postal del proveedor.
         */
        CODIGO_POSTAL_VALOR,
      ],
    };
    if (this.isEditingProveedor && this.editProveedorIndex > -1) {    
    this.proveedorRowData[this.editProveedorIndex] = PROVEEDOR_FILA;
     this.tercerosFabricanteStore.setProveedor([...this.proveedorRowData]);
    this.isEditingProveedor = false;   
  } else {    
     this.tercerosFabricanteStore.setProveedor([PROVEEDOR_FILA]);
  }     
    /**
     * Actualiza el estado del store con los nuevos datos del proveedor.
     */
  
    this.tableValidEvent.emit('proveedor');
    /**
     * Cambia la visibilidad de las secciones del componente.
     */
    this.showTableDiv = !this.showTableDiv;
    this.showProveedor = !this.showProveedor;
    this.selectedProveedorRow = null;
    this.showProveedorButtons = false; 
    this.limpiar(forma);
    } else {
      this.agregarProveedorFormGroup.markAllAsTouched();
    }
    
  }

  /**
   * Validador personalizado para verificar que el país seleccionado no esté vacío ni sea '-1'.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si el valor es válido, de lo contrario devuelve un objeto con la propiedad `requiredPais`.
   */
  static requiredPaisValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    return control.value !== '' && control.value !== '-1'
      ? null
      : { requiredPais: true };
  }

  /**
   * Validador para verificar que el RFC sea válido.
   * Utiliza expresiones regulares para validar tanto RFC de personas físicas como morales.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si el RFC es válido, de lo contrario devuelve un objeto con la propiedad `invalidRFC`.
   */
  static rfcValidator(control: AbstractControl): ValidationErrors | null {
    return REGEX_RFC_FISICA.test(control.value) ||
      REGEX_RFC_MORAL.test(control.value)
      ? null
      : { invalidRFC: true };
  }

  /**
   * Validador para verificar que la CURP sea válida.
   * Utiliza una expresión regular para validar el formato de la CURP.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si la CURP es válida, de lo contrario devuelve un objeto con la propiedad `invalidCURP`.
   */
  static curpValidator(control: AbstractControl): ValidationErrors | null {
    return REGEX_CURP.test(control.value) ? null : { invalidCURP: true };
  }

  /**
   * Validador para verificar que el teléfono sea válido.
   * Utiliza una expresión regular que permite números, letras, guiones, paréntesis y espacios.
   *
   * @param control Control del formulario a validar.
   * @returns Nulo si el teléfono es válido, de lo contrario devuelve un objeto con la propiedad `invalidTelefono`.
   */
  static telefonoValidator(control: AbstractControl): ValidationErrors | null {
    const PATTERN = REGEX_SOLO_NUMEROS;
    return PATTERN.test(control.value) ? null : { invalidTelefono: true };
  }

  /**
   * Cambia el valor del radio button seleccionado.
   *
   * @param value Valor seleccionado del radio button.
   */
  cambiarRadio(value: string | number, formGroup: FormGroup): void {
    const VALOR_SELECCIONADO = value as string;
    this.resetAllExcept(formGroup, ['tercerosNacionalidad']);
    this.disableAllExcept(formGroup, ['tercerosNacionalidad', 'tipoPersona']);
    this.tercerosInputChecked(VALOR_SELECCIONADO);
  }

  /**
 * Reinicia todos los controles del formulario excepto los especificados en el arreglo de exclusiones.
 * Maneja de forma recursiva los FormGroup anidados para garantizar un reinicio completo.
 * @param formGroup El grupo de formulario a reiniciar.
 * @param except Arreglo de nombres de controles que deben ser excluidos del reinicio.
 */
  disableAllExcept(formGroup: FormGroup, except: string[]): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (except.includes(key)) {
        return;
      }
      const CONTROL = formGroup.get(key);
      if (CONTROL instanceof FormGroup) {
        this.disableAllExcept(CONTROL, except);
      } else {
        CONTROL?.disable();
      }
    });
  }


  /**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param {string} nombreControl - Nombre del control a verificar.
   * @returns {boolean} - True si el control es inválido, de lo contrario false.
   */
   public esInvalido(nombreControl: string): boolean {
    const FABRICANTECONTROL = this.agregarFabricanteFormGroup.get(nombreControl);
    const FORMULADORCONTROL = this.agregarFormuladorFormGroup.get(nombreControl);
    const PROVEEDORCONTROL = this.agregarProveedorFormGroup.get(nombreControl);

    const CONTROL = FABRICANTECONTROL || FORMULADORCONTROL || PROVEEDORCONTROL;
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

/**
 * Reinicia todos los controles del formulario excepto los especificados en el arreglo de exclusiones.
 * Maneja de forma recursiva los FormGroup anidados para garantizar un reinicio completo.
 * @param formGroup El grupo de formulario a reiniciar.
 * @param except Arreglo de nombres de controles que deben ser excluidos del reinicio.
 */
  resetAllExcept(formGroup: FormGroup, except: string[]): void {
    Object.keys(formGroup.controls).forEach(key => {
      if (except.includes(key)) {
        return;
      }
      const CONTROL = formGroup.get(key);
      if (CONTROL instanceof FormGroup) {
        this.resetAllExcept(CONTROL, except);
      } else {
        CONTROL?.reset();
      }
    });
  }


  /**
   * Cambia el valor del radio button seleccionado.
   *
   * @param value Valor seleccionado del radio button.
   */
  cambiarRadioFisica(value: string | number, formGroup?: FormGroup): void {
    const VALOR_SELECCIONADO = value as string;
    this.inputChecked(VALOR_SELECCIONADO, formGroup);
  }

  /**
  * @method limpiar
  * @description
  * Método que limpia los valores de un formulario reactivo.
  */
  // eslint-disable-next-line class-methods-use-this
  public limpiar(forma: FormGroup): void {
    forma.reset();
  }

  /**
  * @method mapApiResponseToForm
  * @description
  * Método estático que mapea la respuesta de una API a un objeto compatible con el formulario.
  * @param apiResponse Respuesta de la API que contiene los datos del tercero.
  * @returns Objeto con los campos mapeados para el formulario.
  */
 static mapApiResponseToForm(apiResponse: Record<string, unknown>): Record<string, unknown> {
   const CONTRIBUYENTE: unknown = apiResponse?.['contribuyente'] || {};
   const DOMICILIO =
     typeof CONTRIBUYENTE === 'object' && CONTRIBUYENTE !== null && 'domicilio' in CONTRIBUYENTE
       ? (CONTRIBUYENTE as { domicilio?: unknown }).domicilio || {}
       : {};

   return {
     ...TercerosRelacionadosComponent.mapPersonFields(apiResponse, CONTRIBUYENTE as {
       curp?: string;
       nombre?: string;
       apellido_paterno?: string;
       apellido_materno?: string;
       razon_social?: string;
       telefono?: string;
       correo_electronico?: string;
     }),
     ...TercerosRelacionadosComponent.mapAddressFields(DOMICILIO),
     lada: '',
     extranjeroCodigo: '',
     extranjeroEstado: '',
     extranjeroColonia: '',
   };
 }

 /**
  *  @method mapPersonFields
  * @description
  * Método estático que mapea los campos personales de la respuesta de la API y del contribuyente.
  * @param apiResponse Respuesta de la API que contiene los datos del tercero.
  * @param CONTRIBUYENTE Objeto que contiene los datos del contribuyente.
  * @returns Objeto con los campos personales mapeados.
  */
  private static mapPersonFields(
    apiResponse: { curp?: string; nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string } = {},
    CONTRIBUYENTE: { curp?: string; nombre?: string; apellido_paterno?: string; apellido_materno?: string; razon_social?: string; telefono?: string; correo_electronico?: string } = {}
  ): Record<string, unknown> {
    return {
      curp: apiResponse.curp ?? CONTRIBUYENTE.curp ?? '',
      nombre: apiResponse.nombre ?? CONTRIBUYENTE.nombre ?? '',
      primerApellido: apiResponse.apellidoPaterno ?? CONTRIBUYENTE.apellido_paterno ?? '',
      segundoApellido: apiResponse.apellidoMaterno ?? CONTRIBUYENTE.apellido_materno ?? '',
      denominacionRazonSocial: CONTRIBUYENTE.razon_social ?? '',
      telefono: CONTRIBUYENTE.telefono ?? '',
      correoElectronico: CONTRIBUYENTE.correo_electronico ?? '',
    };
  }

  /**
   * @method mapAddressFields
   * @description Método estático que mapea los campos de dirección de la respuesta de la API.
   * @param DOMICILIO Objeto que contiene los datos de la dirección.
   * @returns Objeto con los campos de dirección mapeados.
   */
  private static mapAddressFields(DOMICILIO: {
    pais?: { nombre?: string };
    entidad_federativa?: { nombre?: string };
    delegacion_municipio?: { nombre?: string };
    localidad?: { nombre?: string };
    cp?: string;
    colonia?: { nombre?: string };
    calle?: string;
    num_exterior?: string;
    num_interior?: string;
  } = {}): Record<string, unknown> {
    return {
      pais: DOMICILIO?.pais?.nombre ?? '',
      estadoLocalidad: DOMICILIO?.entidad_federativa?.nombre ?? '',
      municipioAlcaldia: DOMICILIO?.delegacion_municipio?.nombre ?? '',
      localidad: DOMICILIO?.localidad?.nombre ?? '',
      entidadFederativa: DOMICILIO?.entidad_federativa?.nombre ?? '',
      codigoPostaloEquivalente: DOMICILIO?.cp ?? '',
      colonia: DOMICILIO?.colonia?.nombre ?? '',
      coloniaoEquivalente: '',
      calle: DOMICILIO?.calle ?? '',
      numeroExterior: DOMICILIO?.num_exterior ?? '',
      numeroInterior: DOMICILIO?.num_interior ?? '',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  buscar(form: FormGroup): void {
    const PROCEDIMIENTO = String(this.idProcedimiento);
    let DATOS: Record<string, unknown> = {};
    if (form.get('rfc')?.valid && getValidDatos(form.get('rfc')?.value)) {
      const PAYLOAD = {
        "rfcRepresentanteLegal": form.get('rfc')?.value
      }
      this._sharedSvc.getRepresentanteLegala(PAYLOAD, PROCEDIMIENTO).pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const API_RESPONSE = doDeepCopy(response);
        if(esValidArray(API_RESPONSE.datos)) {
          DATOS = TercerosRelacionadosComponent.mapApiResponseToForm(API_RESPONSE.datos[0]);
          form.patchValue(DATOS);
        }
      });
    } else if (form.get('curp')?.valid && getValidDatos(form.get('curp')?.value)) {
       const CURP = form.get('curp')?.value;
       this._sharedSvc.getCURP(CURP, PROCEDIMIENTO).pipe(takeUntil(this.destroyNotifier$))
       .subscribe((response) => {
          const API_RESPONSE = doDeepCopy(response);
          if(esValidArray(API_RESPONSE.datos)) {
            DATOS = TercerosRelacionadosComponent.mapApiResponseToForm(API_RESPONSE.datos[0]);
            form.patchValue(DATOS);
          }
       });
    } else {
      form.get('rfc')?.markAsTouched();
      form.get('curp')?.markAsTouched();
    }
  }

  /** Marca como inválidos los campos si no contienen datos. */
  markTouched(): void {
    if (this.fabricanteRowData.length===0) {
      this.isfabricanteInvalida=true;
    } else {
      this.isfabricanteInvalida=false;
    }
    if (this.formuladorRowData.length===0) {
      this.isFormuladorInvalida=true; 
    } else {
      this.isFormuladorInvalida=false;
    }
    if (this.proveedorRowData.length===0) {
      this.isProveedorInvalida=true;
    } else {
      this.isProveedorInvalida=false;
    }
  }

  /**
   * compo doc
   * @method esValido
   * @description
   * Verifica si un campo específico del formulario es válido.
   * @param campo El nombre del campo que se desea validar.
   * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
   */
  public esValido(campo: string, form: FormGroup): boolean | null {
    return this.validacionesService.isValid(form, campo);
  }

  /**
 * Llama dinámicamente al método correspondiente del store para actualizar el país seleccionado.
 * @param event Objeto de tipo Catalogo que representa el país seleccionado.
 * @param metodoNombre Nombre del método del store que se debe invocar.
 */
  onPaisChange(event: Catalogo, metodoNombre: keyof TercerosFabricanteStore): void {
    if (event) {
    (
      this.tercerosFabricanteStore[metodoNombre] as (
        value: Catalogo
      ) => void
    )(event);
    }
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
