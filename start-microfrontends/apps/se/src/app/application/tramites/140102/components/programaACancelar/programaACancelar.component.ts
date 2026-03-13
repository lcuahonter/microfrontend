import { Component, Input, OnDestroy,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ConsultaioQuery, InputCheckComponent, TablaDinamicaComponent, TablaSeleccion, TablePaginationComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Programa140102State, Tramite140102Store } from '../../../../estados/tramites/tramite140102.store';
import { ProgramaACancelar,TABLE_ID} from '../../../../shared/models/programa-cancelar.model';
import { PROGRAMA_TABLA } from '../../../../shared/constantes/programa.enum';
import { ProgramaACancelarService } from '../../services/programACancelar.service';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { Tramite140102Query } from '../../../../estados/queries/tramite140102.query';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src/core/services/shared/validaciones-formulario/validaciones-formulario.service';

/**
 * Componente encargado de gestionar la sección "Programa a Cancelar" dentro del trámite 140102.
 * Permite visualizar, seleccionar y confirmar la cancelación de un programa, mostrando los datos
 * en una tabla dinámica y gestionando el formulario asociado.
 *
 * - Inicializa y mantiene el estado del formulario reactivo.
 * - Carga los datos de los programas disponibles para cancelar.
 * - Permite la selección de un programa y actualiza el estado global.
 * - Soporta modo solo lectura para escenarios donde la edición no está permitida.
 * - Gestiona la suscripción y limpieza de recursos para evitar fugas de memoria.
 *
 * @example
 * <app-programa-a-cancelar [esFormularioSoloLectura]="true"></app-programa-a-cancelar>
 *
 * @see ProgramaACancelarService
 * @see Tramite140102Store
 * @see Tramite140102Query
 */
@Component({
  selector: 'app-programa-a-cancelar',
  templateUrl: './programaACancelar.component.html',
  styleUrls: ['./programaACancelar.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InputCheckComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TablePaginationComponent,
    TituloComponent
  ]
})
export class ProgramaACancelarComponent implements OnInit, OnDestroy {
  /**
   * Grupo de formularios para gestionar los controles del formulario en el componente.
   */
  public programaForm!: FormGroup;
  
  /**
   * Notificador utilizado para destruir suscripciones activas en el componente.
   * Se utiliza comúnmente en el patrón de diseño para evitar fugas de memoria
   * al desuscribirse de observables cuando el componente se destruye.
   *
   * @example
   * ```typescript
   * this.someObservable.pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe(data => {
   *   // Manejo de datos
   * });
   * ```
   *
   * @see {@link Subject}
   */
  public destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * Estado de la sección Programa A Cancelar.
   */
  public programaState!: Programa140102State;
  
  /**
   * Identificador único asociado a la tabla.
   * Este valor se inicializa con el identificador proporcionado por `TableId`.
   */
  public Id:string = TABLE_ID;
  

  /**
   * Encabezado de la tabla utilizado en el componente.
   * 
   * Esta propiedad almacena la configuración de los encabezados de la tabla
   * para el programa a cancelar, utilizando la constante `PROGRAMA_TABLA`.
   * 
   * @see PROGRAMA_TABLA
   */
  public encabezadoDeTabla = PROGRAMA_TABLA;

  /**
   * Datos que se mostrarán en la tabla.
   */
  public datosTabla: ProgramaACancelar[] = [];

  /**
   * Número total de elementos en la tabla.
   */
  public totalItems = 0;

  /**
   * Número de página actual para la paginación.
   */
  public currentPage = 1;

  /**
   * Número de elementos por página para la paginación.
   */
  public itemsPerPage = 5;

  /**
   * Enumeración para la selección de la tabla.
   */
  public tablaSeleccion = TablaSeleccion;

  /**
   * ID del botón de radio seleccionado en la tabla.
   */
  public radioId!: number;

  /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los elementos del componente no serán editables.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Identificador del tipo de trámite que se está procesando.
   * Este valor se utiliza para determinar el contexto específico del trámite
   * y realizar las operaciones correspondientes según el tipo.
   * 
   * @type {string}
   * @example
   * ```html
   * <app-programa-a-cancelar [idTipoTramite]="'140102'"></app-programa-a-cancelar>
   * ```
   */
  @Input() idTipoTramite!: string;
   /**


  /**
   * Constructor del componente ProgramaACancelar.
   * 
   * Inicializa todas las dependencias necesarias para el funcionamiento del componente,
   * incluyendo servicios para manejo de formularios, estado, validaciones y comunicación con el servidor.
   * 
   * @param {FormBuilder} fb - Servicio para la creación y gestión de formularios reactivos.
   * @param {ProgramaACancelarService} programaACancelarService - Servicio encargado de la lógica relacionada con el programa a cancelar.
   * @param {ValidacionesFormularioService} formValidator - Servicio para validaciones personalizadas de formularios.
   * @param {Tramite140102Store} tramite140102Store - Almacén de estado para el trámite 140102.
   * @param {Tramite140102Query} tramite140102Query - Consultas y selectores para el estado del trámite 140102.
   * @param {ServiciosService} serviciosService - Servicio para operaciones generales y comunicación con APIs.
   * 
   * @example
   * ```typescript
   * // El constructor se inyecta automáticamente por Angular
   * constructor(
   *   private fb: FormBuilder,
   *   private programaACancelarService: ProgramaACancelarService,
   *   // ... otros servicios
   * ) {}
   * ```
   */
  constructor(
    private fb: FormBuilder,
    private programaACancelarService: ProgramaACancelarService,
    private formValidator: ValidacionesFormularioService,
    private tramite140102Store: Tramite140102Store,
    private tramite140102Query: Tramite140102Query,
    private serviciosService: ServiciosService,
     private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
   // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Hook del ciclo de vida de Angular que se ejecuta después de que el componente se inicializa.
   * 
   * Ejecuta las operaciones necesarias para preparar el componente:
   * - Carga los datos iniciales desde el servidor
   * - Inicializa el formulario reactivo con validaciones
   * 
   * @returns {void}
   * @lifecycle
   * @implements {OnInit}
   */
  ngOnInit(): void {
 
    this.cargarDatos();

    this.inicializarEstadoFormulario();

    
  }
  
    /**
 * Inicializa el estado de los formularios según el modo de solo lectura.
 *
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), llama a `guardarDatosFormulario()`
 * para deshabilitar todos los controles. En caso contrario, inicializa los formularios normalmente.
 */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

   /**
 * Guarda y actualiza el estado de los formularios según el modo de solo lectura.
 *
 * Inicializa los formularios y luego los deshabilita si el formulario está en modo solo lectura,
 * o los habilita si está en modo edición.
 */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.programaForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.programaForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

   /**
   * Suscribe al observable `selectSolicitud$` del query `tramite120501Query` para obtener el estado actual de la solicitud y actualizar la propiedad `seccionState` con los datos recibidos. La suscripción se mantiene activa hasta que se emite un valor en `destroyed$`, evitando fugas de memoria.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite140102Query.selectSolicitud$?.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: Programa140102State) => {
        this.programaState = data;
      });
  }
  /**
   * Inicializa el formulario reactivo `ProgramaForm` con los valores actuales del estado.
   * 
   * Funcionalidades principales:
   * - Se suscribe al observable `selectSolicitud$` para mantener sincronización con el estado
   * - Crea controles de formulario con validaciones específicas
   * - Configura campos como solo lectura según el contexto
   * - Aplica modo de solo lectura si está habilitado
   * 
   * @returns {void}
   * @private
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente en ngOnInit
   * this.inicializarFormulario();
   * ```
   * 
   * @see {@link FormBuilder} - Para la creación del formulario
   * @see {@link Validators} - Para las validaciones aplicadas
   */
  inicializarFormulario(): void {
     this.obtenerEstadoSolicitud();
      this.programaForm = this.fb.group({
      folioPrograma: [{ value: this.programaState?.programaACancelar?.folioPrograma, disabled: true }],
      idProgramaSeleccionado: [this.programaState?.programaACancelar?.idProgramaSeleccionado],
      modalidad: [{ value: this.programaState?.programaACancelar?.modalidad, disabled: true }],
      representacionFederal: [{ value: this.programaState?.programaACancelar?.representacionFederal, disabled: true }],
      tipoPrograma: [{ value: this.programaState?.programaACancelar?.tipoPrograma, disabled: true }],
      estatus: [{ value: this.programaState?.programaACancelar?.estatus, disabled: true }],
      solicitudObservaciones: [this.programaState?.solicitudObservaciones, [Validators.required, Validators.maxLength(255)]],
      confirmar: [this.programaState?.confirmar, Validators.requiredTrue],
    });

    this.radioId = this.programaState?.radio;
    this.datosTabla = this.programaState?.datos;
   
  }

  /**
   * Carga los datos de programas disponibles para cancelar desde el servidor.
   * 
   * Proceso de carga:
   * 1. Construye el payload con RFC y discriminador del tipo de trámite
   * 2. Realiza llamada al servicio para obtener datos
   * 3. Actualiza la tabla de datos local
   * 4. Sincroniza con el store de Akita
   * 
   * @returns {void}
   * @private
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente en ngOnInit
   * this.cargarDatos();
   * ```
   * 
   * @throws {Error} Si hay errores en la comunicación con el servidor
   * @see {@link ServiciosService.obtenerDatos} - Servicio utilizado para la carga
   */
    cargarDatos(): void {
      this.serviciosService.obtenerDatos('140102', "AAL0409235E6")
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosTabla = data.datos ?? [];
        this.tramite140102Store.setDatosData(this.datosTabla);
        

        if(this.programaState &&this.programaState.programaACancelar){
          this.valorDeAlternancia(this.programaState.programaACancelar);
        }
     
      });
  }

  /**
   * Actualiza el store con el valor de un campo específico del formulario.
   * 
   * Este método facilita la sincronización entre el estado del formulario
   * y el store de Akita, garantizando que los datos se mantengan actualizados
   * en la gestión centralizada de estado.
   * 
   * @param {FormGroup} form - El grupo de formularios que contiene el campo a actualizar
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener
   * @param {keyof Tramite140102Store} metodoNombre - El nombre del método del store que se va a invocar para actualizar el estado
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Actualizar el campo 'folioPrograma' en el store
   * this.setValoresStore(this.programaForm, 'folioPrograma', 'setFolioPrograma');
   * ```
   * 
   * @throws {Error} Si el campo no existe en el formulario o el método no está disponible en el store
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite140102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite140102Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Verifica si un campo específico del formulario es válido.
   * 
   * Utiliza el servicio FormValidator para determinar el estado de validación
   * de un campo particular dentro del formulario del programa.
   *
   * @param {string} field - El nombre del campo del formulario a validar
   * @returns {boolean | null} `true` si el campo es válido, `false` si no lo es, o `null` si no se puede determinar
   * 
   * @example
   * ```typescript
   * // Verificar si el campo 'folioPrograma' es válido
   * const esValido = this.isValid('folioPrograma');
   * if (esValido) {
   *   console.log('El folio del programa es válido');
   * }
   * ```
   * 
   * @see {@link FormValidator.isValid} - Método utilizado para la validación
   */
  isValid(field: string): boolean | null {
    return this.formValidator.isValid(this.programaForm, field);
  }

  /**
   * Maneja la selección de una fila en la tabla de programas.
   * 
   * Cuando un usuario selecciona una fila en la tabla, este método:
   * 1. Actualiza el store con el programa seleccionado
   * 2. Encuentra el índice de la fila en los datos de la tabla
   * 3. Actualiza el identificador del radio button seleccionado
   * 4. Sincroniza la selección con el store
   * 5. Rellena el formulario con los datos del programa seleccionado
   * 
   * @param {ProgramaACancelar} row - Los datos del programa seleccionado en la tabla
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente cuando el usuario hace clic en una fila
   * onRowSelect(programaSeleccionado) {
   *   this.valorDeAlternancia(programaSeleccionado);
   * }
   * ```
   * 
   * @see {@link ProgramaACancelar} - Interfaz del objeto programa
   */
  valorDeAlternancia(row: ProgramaACancelar): void {
    this.tramite140102Store.setPrograma(row);
    const INDEX = this.datosTabla.findIndex((x) => x.idProgramaAutorizado === row.idProgramaAutorizado);
    this.radioId = INDEX;
    this.tramite140102Store.setRadioSelection(INDEX);
    this.programaForm.patchValue({
      folioPrograma: row.folioPrograma,
      idProgramaSeleccionado: row.idProgramaSeleccionado,
      modalidad: row.modalidad,
      representacionFederal: row.representacionFederal,
      tipoPrograma: row.tipoPrograma,
      estatus: row.estatus,
    });
  }


  /**
   * Verifica si el formulario completo es válido.
   * 
   * Realiza una validación completa del formulario del programa.
   * Si el formulario no es válido, marca todos los campos como tocados
   * para mostrar los mensajes de error correspondientes.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario
   * 
   * @example
   * ```typescript
   * // Validar antes de enviar datos
   * if (this.isFormValido()) {
   *   this.enviarDatos();
   * } else {
   *   console.log('Formulario contiene errores');
   * }
   * ```
   * 
   * @see {@link FormGroup.valid} - Propiedad utilizada para verificar validez
   * @see {@link FormGroup.markAllAsTouched} - Método para marcar campos como tocados
   */

  public isFormValido(): boolean {
    if(this.programaForm.valid) {
      return true;
    }
    this.programaForm.markAllAsTouched();
    return false;
  }

  /**
   * Verifica si un control específico del formulario es inválido.
   * 
   * Determina si un campo del formulario tiene errores de validación
   * y además ha sido interactuado por el usuario (tocado o modificado).
   * Esto es útil para mostrar mensajes de error solo después de que
   * el usuario haya intentado interactuar con el campo.
   * 
   * @param {string} nombreControl - Nombre del control en el formulario a verificar
   * @returns {boolean} Verdadero si el control es inválido y ha sido tocado/modificado, falso en caso contrario
   * 
   * @example
   * ```typescript
   * // Verificar si mostrar error en el template
   * <div *ngIf="esInvalido('folioPrograma')" class="error">
   *   El folio del programa es requerido
   * </div>
   * ```
   * 
   * @see {@link FormControl.invalid} - Propiedad para verificar invalidez
   * @see {@link FormControl.touched} - Propiedad para verificar si fue tocado
   * @see {@link FormControl.dirty} - Propiedad para verificar si fue modificado
   */
  esInvalido(nombreControl: string): boolean {
    const CONTROL = this.programaForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * Hook del ciclo de vida que se ejecuta cuando el componente se destruye.
   * 
   * Implementa la limpieza necesaria para evitar memory leaks:
   * - Notifica a todos los observables que el componente se está destruyendo
   * - Completa el subject destroyNotifier$ para cancelar suscripciones activas
   * 
   * Este método es parte del patrón de gestión de suscripciones usando takeUntil()
   * que garantiza que todas las suscripciones se cancelen automáticamente.
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // El Angular framework llama automáticamente este método
   * // cuando el componente es removido del DOM
   * ```
   * 
   * @see {@link OnDestroy} - Interfaz implementada para el lifecycle hook
   * @see {@link takeUntil} - Operador RxJS utilizado para cancelar suscripciones
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
