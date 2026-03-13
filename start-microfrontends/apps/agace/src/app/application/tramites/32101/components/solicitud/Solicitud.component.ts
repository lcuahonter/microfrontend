import {AbstractControl,FormBuilder,FormControl,FormGroup,FormsModule,ReactiveFormsModule,ValidationErrors,Validators} from '@angular/forms';
import {Catalogo,CatalogoSelectComponent,InputFecha,InputFechaComponent,Notificacion,NotificacionesComponent,Pedimento,REGEX_LLAVE_DE_PAGO_DE_DERECHO,REGEX_NUMEROS,REGEX_REEMPLAZAR,SOLO_REGEX_NUMEROS,TablaDinamicaComponent,TablaSeleccion,TituloComponent,ValidacionesFormularioService} from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDeLaTabla, TramiteList } from '../../models/datos-tramite.model';
import { ENCABEZADO_TABLA_DATOS, Solicitud32101Enum } from '../../constants/solicitud32101.enum';
import { Solicitud32101State, Tramite32101Store } from '../../../../estados/tramites/tramite32101.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComponenteDeActualizacionComponent } from '../componente-de-actualizacion/componente-de-actualizacion.component';
import { ConsultaAvisoAcreditacionService } from '../../services/consulta-aviso-acreditacion.service';
import { FECHA_PAGO } from '../../models/registro.model';
import { Router } from '@angular/router';
import { Tramite32101Query } from '../../../../estados/queries/tramite32101.query';

/**
 * Componente que gestiona la solicitud del trámite 31803.
 * Contiene la lógica para inicializar el formulario, manejar eventos y comunicarse con el estado global.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    FormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
    ComponenteDeActualizacionComponent,
  ],
  providers: [ConsultaAvisoAcreditacionService],
  templateUrl: './Solicitud.component.html',
  styleUrl: './Solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos de la solicitud.
   */
  registroForm!: FormGroup;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud32101State;

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de la tabla de selección.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Datos configurados para la tabla.
   */
  configuracionTablaDatos: DatosDeLaTabla[] = [];

  /**
   * Enumeración que contiene los textos utilizados en el componente.
   */
  solicitudEnum = Solicitud32101Enum;

  /**
  * Estado actual de la consulta obtenido desde el servicio.
  */
  consultaDatos!: ConsultaioState;

  /**
  * Indica si el formulario está en modo de solo lectura.
  */
  soloLectura: boolean = false;

  /**
   * Representa una lista de trámites con información adicional.
   *
   * @property {TramiteList[]} catalogos - Lista de catálogos relacionados con los trámites.
   * @property {string} labelNombre - Etiqueta que representa el nombre asociado al trámite.
   * @property {string} primerOpcion - Primera opción seleccionable en la lista de trámites.
   */
  tramiteList: {
    catalogos: TramiteList[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Lista de aduanas.
   */
  aduana: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Representa la estructura de un banco utilizado en la aplicación.
   *
   * @property {Catalogo[]} catalogos - Lista de catálogos asociados al banco.
   * @property {string} labelNombre - Etiqueta que representa el nombre del banco.
   * @property {string} primerOpcion - Primera opción predeterminada para el banco.
   */
  banco: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Representa la información relacionada con la comprobante.
   * 
   * @property {Catalogo[]} catalogos - Lista de catálogos asociados a la comprobante.
   * @property {string} labelNombre - Etiqueta que representa el nombre de la comprobante.
   * @property {string} primerOpcion - Primera opción seleccionable en el contexto de la comprobante.
   */
  comprobante: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * @property {boolean} comprobanteVisible
   * @description Indica si se debe mostrar el campo para otro nombre común.
   * @default false
   */
  comprobanteVisible = false;

  /**
   * Configuración para el campo de fecha inicial.
   */
  fechaDePago: InputFecha = FECHA_PAGO;

  /**
   * Arreglo que contiene las filas seleccionadas de la tabla.
   * Cada elemento del arreglo es de tipo `datosDeLaTabla`.
   */
  selectedRows: DatosDeLaTabla[] = [];

  /**
   * Notificación utilizada para mostrar mensajes o alertas en la interfaz.
   */
  public nuevaNotificacion!: Notificacion;

  /** 
  * Índice del pedimento marcado para eliminación.
  */
  public elementoParaEliminar!: number;

  /** 
  * Arreglo que contiene los pedimentos registrados.
  */
  public pedimentos: Array<Pedimento> = [];

  /**
   * Propiedad que almacena el encabezado de la tabla utilizado en el componente.
   * Este encabezado define los datos que se mostrarán en la tabla.
   */
  public encabezadoDeTabla = ENCABEZADO_TABLA_DATOS;

  /**
   * Referencia al componente modal de actualización
   */
  @ViewChild(ComponenteDeActualizacionComponent) modalActualizacion!: ComponenteDeActualizacionComponent;

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   *
   * @param registroSolicitud Servicio para obtener datos relacionados con la solicitud.
   * @param fb Constructor de formularios reactivos.
   * @param store Almacén global para gestionar el estado del trámite.
   * @param query Consulta para obtener el estado actual del trámite.
   * @param validacionesService Servicio para validar campos del formulario.
   */
  constructor(
    private consultaAvisoAcreditacionService: ConsultaAvisoAcreditacionService,
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    public tramite32101Store: Tramite32101Store,
    private tramite32101Query: Tramite32101Query,
    private router: Router,
    private consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    this.tramiteList = {
      catalogos: [],
      labelNombre: 'Tipo de inversión',
      primerOpcion: 'Seleccione una opción',
    };
    this.aduana = {
      catalogos: [],
      labelNombre: 'Forma de adquisicion',
      primerOpcion: 'Seleccione una opción',
    };
    this.banco = {
      catalogos: [],
      labelNombre: 'Banco',
      primerOpcion: 'Seleccione una opción',
    };
    this.comprobante = {
      catalogos: [],
      labelNombre: 'Comprobante',
      primerOpcion: 'Seleccione una opción',
    };
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * - Suscribe al observable `selectSolicitud$` para obtener el estado de la solicitud
   *   y lo asigna a la propiedad `solicitudState`.
   * - Inicializa el formulario llamando a `inicializarFormulario`.
   * - Realiza las solicitudes necesarias para obtener las listas de documentos,
   *   inversiones y bancos mediante los métodos `fetchListaDeDocumentos`,
   *   `fetchListaDeInversion` y `fetchBancoList`.
   * - Escucha los cambios en los datos del formulario desde el servicio
   *   `consultaAvisoAcreditacionService` y actualiza las filas de la tabla
   *   llamando a `updateTableRow` con los datos recibidos.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite32101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.configuracionTablaDatos = this.solicitudState.datosDelContenedor;
        })
      )
      .subscribe();
    this.inicializarFormulario();
    this.fetchListaDeDocumentos();
    this.fetchListaDeInversion();
    this.fetchBancoList();
    this.fetchListaComprobante();
    /**
    * Escuchar los datos actualizados de la fila
    */
    this.consultaAvisoAcreditacionService.formData$.pipe(takeUntil(this.destroyNotifier$)).subscribe((formData) => {
      formData.forEach((row) => this.updateTableRow(row));
      });

    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.soloLectura = this.consultaDatos.readonly;
        this.inicializarEstadoFormulario();
      })
    )
  .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario `registroForm` con los campos necesarios y sus valores predeterminados.
   *
   * Este método configura un formulario reactivo utilizando `FormBuilder` y asigna valores iniciales
   * a cada campo basado en el estado actual de `solicitudState`. También incluye validadores requeridos
   * y personalizados para ciertos campos.
   *
   * Campos del formulario:
   * - `tipoDeInversion`: Lista de documentos, requerido.
   * - `valorEnPesos`: Valor en pesos, requerido.
   * - `descripcionGeneral`: Descripción general, requerido.
   * - `listaDeDocumentos`: Lista de documentos, requerido.
   * - `manifiesto1`, `manifiesto2`, `manifiesto3`: Manifiestos opcionales.
   * - `claveDeReferencia`: Clave de referencia, deshabilitado por defecto con un valor predeterminado.
   * - `cadenaDeLaDependencia`: Cadena de la dependencia, deshabilitado por defecto con un valor predeterminado.
   * - `numeroDeOperacion`: Número de operación.
   * - `banco`: Banco asociado.
   * - `llaveDePago`: Llave de pago.
   * - `fechaInicialInput`: Fecha inicial, incluye un validador personalizado para verificar que la fecha no sea mayor a hoy.
   * - `importeDePago`: Importe de pago, deshabilitado por defecto con un valor predeterminado.
   *
   * @returns {void} No retorna ningún valor.
   */
  inicializarFormulario(): void {
    this.registroForm = this.fb.group({
      tipoDeInversion: [
        this.solicitudState?.tipoDeInversion,
        [Validators.required],
      ],
      valorEnPesos: [this.solicitudState?.valorEnPesos, [Validators.required, Validators.pattern(SOLO_REGEX_NUMEROS), Validators.maxLength(15)]],
      descripcionGeneral: [
        this.solicitudState?.descripcionGeneral,
        [Validators.required],
      ],
      listaDeDocumentos: [this.solicitudState?.listaDeDocumentos, [Validators.required]],
      comprobante: [this.solicitudState?.comprobante, [Validators.required]],
      manifiesto1: [this.solicitudState?.manifiesto1],
      manifiesto2: [this.solicitudState?.manifiesto2],
      manifiesto3: [this.solicitudState?.manifiesto3],
      claveDeReferencia: [
        {
          value: this.solicitudState?.claveDeReferencia,
          disabled: true,
        },
      ],
      cadenaDeLaDependencia: [
        {
          value: this.solicitudState?.cadenaDeLaDependencia,
          disabled: true,
        },
      ], 
      numeroDeOperacion: [this.solicitudState?.numeroDeOperacion, [Validators.required, Validators.maxLength(30), Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO)]],
      banco: [this.solicitudState?.banco, [Validators.required]],
      llaveDePago: [this.solicitudState?.llaveDePago, [Validators.required, Validators.maxLength(20), Validators.pattern(REGEX_LLAVE_DE_PAGO_DE_DERECHO)]],
      fechaInicialInput: [this.solicitudState?.fechaInicialInput, [Validators.required]],
      importeDePago: [
        { value: this.solicitudState?.importeDePago, disabled: true },
      ],
    });
    this.inicializarEstadoFormulario()
  }      
  
  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * @private
   */
  private inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.registroForm?.disable();
    } else {
      this.registroForm?.enable();
      this.registroForm?.get('claveDeReferencia')?.disable();
      this.registroForm?.get('cadenaDeLaDependencia')?.disable();
      this.registroForm?.get('importeDePago')?.disable();
    }
  }

  /**
   * Obtiene el grupo de formulario 'tipoDeInversion' del formulario principal 'FormSolicitud'.
   * @returns {FormControl} El grupo de formulario 'tipoDeInversion'.
   */
  get tipoDeInversion(): FormControl {
    return this.registroForm.get('tipoDeInversion') as FormControl;
  }
  /**
   * Obtiene el control de formulario 'valorEnPesos' del formulario principal 'FormSolicitud'.
   * @returns {FormControl} El control de formulario 'valorEnPesos'.
   */
  get valorEnPesos(): FormControl {
    return this.registroForm.get('valorEnPesos') as FormControl;
  }

  /**
   * Obtiene el grupo de formulario 'valorEnPesos' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'valorEnPesos'.
   */
  get claveDeReferencia(): FormGroup {
    return this.registroForm.get('claveDeReferencia') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'valorEnPesos' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'valorEnPesos'.
   */
  get importeDePago(): FormGroup {
    return this.registroForm.get('importeDePago') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'valorEnPesos' del formulario principal 'FormSolicitud'.
   * @returns {FormControl} El grupo de formulario 'valorEnPesos'.
   */
  get cadenaDeLaDependencia(): FormControl {
    return this.registroForm.get('cadenaDeLaDependencia') as FormControl;
  }

  /**
   * Obtiene el grupo de formulario 'valorEnPesos' del formulario principal 'FormSolicitud'.
   * @returns {FormControl} El grupo de formulario 'valorEnPesos'.
   */
  get llaveDePago(): FormControl {
    return this.registroForm.get('llaveDePago') as FormControl;
  }

  /**
   * Obtiene el grupo de formulario 'valorEnPesos' del formulario principal 'FormSolicitud'.
   * @returns {FormControl} El grupo de formulario 'valorEnPesos'.
   */
  get numeroDeOperacion(): FormControl {
    return this.registroForm.get('numeroDeOperacion') as FormControl;
  }

  /**
   * Getter para debugging - obtiene el control de fechaInicialInput
   * @returns {FormControl} El control de formulario 'fechaInicialInput'.
   */
  get fechaInicialInputControl(): FormControl {
    return this.registroForm.get('fechaInicialInput') as FormControl;
  }

  /**
   * Obtiene el grupo de formulario 'valorEnPesos' del formulario principal 'FormSolicitud'.
   * @returns {FormGroup} El grupo de formulario 'valorEnPesos'.
   */
  get descripcionGeneral(): FormGroup {
    return this.registroForm.get('descripcionGeneral') as FormGroup;
  }

  /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32101Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32101Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param {string} id El nombre del control del formulario.
   * @returns {boolean} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(id: string): boolean {
    const CONTROL = this.registroForm.get(id);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Valida que solo se permitan caracteres alfanuméricos (letras y números) en el campo.
   * Bloquea la entrada de caracteres especiales, espacios y signos negativos.
   * @param event Evento del teclado
   */
  onlyAlphanumeric(event: KeyboardEvent): void {
    const char = event.key;
    const isValidChar = /^[a-zA-Z0-9]$/.test(char);
    const isControlKey = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(char);
    
    if (!isValidChar && !isControlKey) {
      event.preventDefault();
    }
  }

  /**
   * Maneja el evento de input para campos alfanuméricos
   * @param event Evento de input
   */
  onAlphanumericInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(REGEX_REEMPLAZAR, '');
  }

  /**
   * Maneja el evento de input para campos numéricos
   * @param event Evento de input
   */
  onNumericInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(REGEX_NUMEROS, '');
  }

  /**
   * Obtiene la lista de documentos relacionados con el trámite de inversión.
   *
   * Este método realiza una solicitud al servicio `consultaAvisoAcreditacionService`
   * para obtener la lista de documentos bajo el identificador 'listaDeInversion'.
   * Los datos obtenidos se asignan al catálogo de trámites.
   *
   * @remarks
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar
   * fugas de memoria al destruir el componente.
   *
   * @example
   * ```typescript
   * this.fetchListaDeDocumentos();
   * ```
   *
   * @returns {void} No retorna ningún valor.
   */
  fetchListaDeDocumentos(): void {
    this.consultaAvisoAcreditacionService
      .getListaDeDocumentos('listaDeInversion')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.tramiteList.catalogos = respuesta.data;
      });
  }

  /**
   * Obtiene la lista de documentos de inversión desde el servicio de consulta
   * y actualiza el catálogo de aduanas con los datos recibidos.
   *
   * @remarks
   * Este método utiliza el servicio `consultaAvisoAcreditacionService` para
   * realizar una solicitud de documentos. Los datos obtenidos se asignan al
   * catálogo de aduanas (`aduana.catalogos`).
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  fetchListaDeInversion(): void {
    this.consultaAvisoAcreditacionService
      .getListaDeDocumentos('listaDeDocumentos')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.aduana.catalogos = respuesta.data;
      });
  }

  /**
   * Obtiene la lista de comprobantes desde el servicio `consultaAvisoAcreditacionService`
   * y actualiza el catálogo de comprobantes en el componente.
   * @returns {void} No retorna ningún valor.
   */
  fetchListaComprobante(): void {
    this.consultaAvisoAcreditacionService
      .getListaDeDocumentos('listaDeComprobante')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.comprobante.catalogos = respuesta.data;
      });
  }


  /**
   * Obtiene la lista de bancos desde el servicio `consultaAvisoAcreditacionService`
   * y actualiza el catálogo de bancos en el componente.
   *
   * @remarks
   * Este método utiliza el operador `takeUntil` para gestionar la suscripción
   * y asegurarse de que se complete cuando el observable `destroyNotifier$` emita un valor.
   *
   * @returns {void} No retorna ningún valor.
   */
  fetchBancoList(): void {
    this.consultaAvisoAcreditacionService
      .getListaDeDocumentos('bancoList')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.banco.catalogos = respuesta.data;
      });  }

  /**
   * Maneja el cambio en la selección de la forma de adquisición.
   * @param event - El evento o objeto que contiene la opción seleccionada del catálogo.
   */    onlistaDeDocumentosChange(event: Event | { selectedOption?: Catalogo } | Catalogo | undefined): void {
    let VALUE = '';
    let selectedOption: Catalogo | undefined;
    
    if (event) {
      if ('value' in event) {
        VALUE = (event as { value?: string }).value || '';
      } 
      else if ('selectedOption' in event) {
        selectedOption = (event as { selectedOption?: Catalogo }).selectedOption;
        VALUE = String(selectedOption?.id || '');
      } 
      else if ('id' in event && 'descripcion' in event) {
        selectedOption = event as Catalogo;
        VALUE = String(selectedOption.id || '');
      } 
      else if ((event as Event).target) {
        const target = (event as Event).target as HTMLSelectElement;
        VALUE = target?.value || '';
      }
    }
    
    const DESCRIPTION = selectedOption?.descripcion || '';
    this.setValoresStore(this.registroForm, 'listaDeDocumentos', 'setListaDeDocumentos');
    
    // Determinar si el comprobante debe ser visible
    const isCompraNacional = DESCRIPTION.toLowerCase().includes('compra nacional') || 
                             DESCRIPTION.toLowerCase().includes('nacional');
    this.comprobanteVisible = VALUE === '1' || selectedOption?.id === 1 || isCompraNacional;
    
    const COMPROBANTE_CONTROL = this.registroForm.get('comprobante');
    
    if (COMPROBANTE_CONTROL) {
      if (this.comprobanteVisible) {
        COMPROBANTE_CONTROL.setValidators([Validators.required]);
      } else {
        COMPROBANTE_CONTROL.clearValidators();
        COMPROBANTE_CONTROL.setValue(''); 
        COMPROBANTE_CONTROL.markAsUntouched();
      }
      COMPROBANTE_CONTROL.updateValueAndValidity();
    }
  }
  
  /**
   * Método para poblar una tabla con los datos ingresados en un formulario.
   *
   * Este método toma los valores del formulario `registroForm`, crea una nueva fila
   * con los datos procesados y la agrega a la tabla representada por `configuracionTablaDatos`.
   * Además, actualiza el estado de la tienda `tramite32101Store` con los datos de la tabla
   * y reinicia el formulario a su estado inicial.
   *
   * @remarks
   * - Los valores del formulario se procesan para obtener etiquetas legibles desde catálogos.
   * - El formulario se reinicia y se marca como no modificado después de agregar la fila.
   * - Se validan los campos requeridos antes de agregar la fila a la tabla.
   *
   * @example
   * // Ejemplo de uso:
   * this.poblarTabla();
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  poblarTabla(): void {
    // Validar campos requeridos antes de agregar a la tabla
    const REQUIRED_FIELDS = ['tipoDeInversion', 'valorEnPesos', 'descripcionGeneral', 'listaDeDocumentos'];
    const INVALID_FIELDS: string[] = [];

    // Verificar si los campos requeridos están vacíos o son inválidos
    REQUIRED_FIELDS.forEach(field => {
      const CONTROL = this.registroForm.get(field);
      if (!CONTROL?.value || CONTROL.invalid) {
        INVALID_FIELDS.push(field);
      }
    });

    // Si algún campo requerido es inválido, mostrar error y salir
    if (INVALID_FIELDS.length > 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      
      // Marcar todos los controles del formulario como tocados para mostrar errores de validación
      this.registroForm.markAllAsTouched();
      return;
    }    
    
    const FORM_VALUES = this.registroForm.value;
    const NEW_ROW: DatosDeLaTabla = {
      id: this.configuracionTablaDatos.length + 1,
      tipoDeInversion: SolicitudComponent.getDropdownLabel(
        FORM_VALUES.tipoDeInversion,
        this.tramiteList.catalogos
      ),
      descripcionGeneral: FORM_VALUES.descripcionGeneral,
      formaAdquisicion: SolicitudComponent.getDropdownLabel(
        FORM_VALUES.listaDeDocumentos,
        this.aduana.catalogos
      ),
      valorEnPesos: FORM_VALUES.valorEnPesos,
      comprobante: this.comprobanteVisible ? SolicitudComponent.getDropdownLabel(
        FORM_VALUES.comprobante,
        this.comprobante.catalogos
      ) : 'N/A',
    };

    this.configuracionTablaDatos = [...this.configuracionTablaDatos, NEW_ROW];
    this.tramite32101Store.setDatosDelContenedor(this.configuracionTablaDatos);
    this.abrirModal();
    this.registroForm.reset();
    this.registroForm.markAsUntouched();
    this.registroForm.markAsPristine();
  }

  /**
   * Obtiene la etiqueta de un elemento seleccionado en un catálogo desplegable.
   *
   * @param selectedId - El ID del elemento seleccionado.
   * @param catalog - Una lista de objetos del catálogo que contiene descripciones.
   * @returns La descripción del elemento seleccionado si se encuentra, de lo contrario, 'N/A'.
   */
  static getDropdownLabel(selectedId: string | number, catalog: Catalogo[]): string {
    const NUMERIC_ID = typeof selectedId === 'string' ? parseInt(selectedId, 10) : selectedId;
    const SELECTED_ITEMS = catalog.find(
      (item) => {
        return item.id === NUMERIC_ID;
      }
    );
    return SELECTED_ITEMS ? SELECTED_ITEMS.descripcion : 'N/A';
  }

  /**
   * Maneja el evento de clic en un checkbox para una fila de la tabla.
   *
   * @param row - La fila de datos seleccionada o `null` si se deselecciona.
   *
   * - Si se proporciona una fila (`row` no es `null`), se agrega a la lista de filas seleccionadas
   *   (`selectedRows`) si aún no está presente.
   * - Si `row` es `null`, se elimina de la lista de filas seleccionadas.
   */
  onCheckboxClicked(row: DatosDeLaTabla | null): void {
    if (row) {
      if (!this.selectedRows.some((selectedRow) => selectedRow.id === row.id)) {
        this.selectedRows.push(row);
      }
    } else {
      this.selectedRows = this.selectedRows.filter(
        (selectedRow) => selectedRow !== row
      );
    }
  }

  /**
  * modificar la fila seleccionada en modal popup
  */
  modificarFilaSeleccionada(): void {
    if (this.selectedRows.length !== 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione un registro.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    
    const FILA_SELECCIONADA = this.selectedRows[0];
    if (FILA_SELECCIONADA && this.modalActualizacion) {
      this.consultaAvisoAcreditacionService.setUpdatedRow([FILA_SELECCIONADA]);
      this.tramite32101Store.setAbc(FILA_SELECCIONADA);
      this.modalActualizacion.abrirModal(FILA_SELECCIONADA);
      this.selectedRows = [];
    }
  }

  /**
  * Eliminar filas seleccionadas 
  */
  eliminarFilasSeleccionadas(): void {
    if (this.selectedRows.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Seleccione un registro.',
        cerrar: true,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      this.abrirEleminarModal();
    }
  }


  /**
  * Validador personalizado para verificar si la fecha es menor o igual a la fecha actual 
  */
  static validateFechaMenorIgualHoy(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    let SELECTED_DATE: Date;
    if (typeof control.value === 'string' && control.value.includes('/')) {
      const PARTS = control.value.split('/');
      if (PARTS.length === 3) {
        const DAY = parseInt(PARTS[0], 10);
        const MONTH = parseInt(PARTS[1], 10);
        const YEAR = parseInt(PARTS[2], 10);
        SELECTED_DATE = new Date(YEAR, MONTH - 1, DAY);
      } else {
        SELECTED_DATE = new Date(control.value);
      }
    } else {
      SELECTED_DATE = new Date(control.value);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(SELECTED_DATE.getTime())) {
      return { fechaInvalida: true }; // Retorna error para fechas inválidas
    }
    
    const CURRENT_DATE = new Date();
    
    // Restablecer la hora para comparar solo las fechas
    SELECTED_DATE.setHours(0, 0, 0, 0);
    CURRENT_DATE.setHours(0, 0, 0, 0);
    
    if (SELECTED_DATE > CURRENT_DATE) {
      return { fechaInvalida: true }; // Retorna un objeto de error para fechas futuras
    }
    
    return null; // Retorna null si la fecha es válida (hoy o pasada)
  }

  /**
   * Cambia la fecha de ingreso en el formulario.
   *
   * @param nuevo_valor - El nuevo valor de la fecha en formato de cadena.
   *
   * Este método actualiza el campo 'fechaInicialInput' del formulario con el nuevo valor proporcionado
   * y marca el campo como no modificado (untouched).
   */
  public cambioFechaIngreso(nuevo_valor: string): void {
    const FECHA_CONTROL = this.registroForm.get('fechaInicialInput');
    
    FECHA_CONTROL?.setValue(nuevo_valor);
    FECHA_CONTROL?.markAsTouched();
    FECHA_CONTROL?.markAsDirty();
    
    if (nuevo_valor && nuevo_valor.trim() !== '') {
      const FECHA_INGRESADA = new Date(nuevo_valor.split('/').reverse().join('-'));
      const FECHA_ACTUAL = new Date();
      FECHA_ACTUAL.setHours(23, 59, 59, 999);
      
      if (FECHA_INGRESADA > FECHA_ACTUAL) {
        FECHA_CONTROL?.setErrors({ 'fechaFutura': true });
      } else {
        const FECHA_ERROR = FECHA_CONTROL?.errors;
        if (FECHA_ERROR && FECHA_ERROR['fechaFutura']) {
          delete FECHA_ERROR['fechaFutura'];
          const HAS_ERROR = Object.keys(FECHA_ERROR).length > 0;
          FECHA_CONTROL?.setErrors(HAS_ERROR ? FECHA_ERROR : null);
        }
      }
    } else {
      const FECHA_ERROR = FECHA_CONTROL?.errors;
      if (FECHA_ERROR && FECHA_ERROR['fechaFutura']) {
        delete FECHA_ERROR['fechaFutura'];
        const HAS_ERROR = Object.keys(FECHA_ERROR).length > 0;
        FECHA_CONTROL?.setErrors(HAS_ERROR ? FECHA_ERROR : null);
      }
    }
    
    this.tramite32101Store.setFechaInicialInput(nuevo_valor);
  }  
  
  /**
   * Restablece los campos del formulario relacionados con la operación bancaria.
   *
   * Este método verifica si todos los campos requeridos de "Pago de derecho" están llenos:
   * - `numeroDeOperacion`: Número de operación bancaria.
   * - `banco`: Banco asociado a la operación.
   * - `llaveDePago`: Llave de pago utilizada.
   * - `fechaInicialInput`: Fecha inicial de la operación.
   *
   * Solo si todos estos campos están completados, procede a resetear todo el formulario
   * y limpiar específicamente el control de fecha. De lo contrario, no realiza ninguna acción.
   */  
  borrar(): void {
    // Verificar si todos los campos requeridos de "Pago de derecho" están llenos
    const PAYMENT_FIELDS = ['numeroDeOperacion', 'banco', 'llaveDePago', 'fechaInicialInput'];
    const ALL_PAYMENT_FIELDS_FILLED = PAYMENT_FIELDS.every(fieldName => {
      const FIELD_CONTROL = this.registroForm.get(fieldName);
      return FIELD_CONTROL?.value && !FIELD_CONTROL.invalid;
    });
    
    // Solo proceder si todos los campos de pago están completados
    if (ALL_PAYMENT_FIELDS_FILLED) {
      this.registroForm.reset();
      const FECHA_CONTROL = this.registroForm.get('fechaInicialInput');
      FECHA_CONTROL?.setValue('');
      FECHA_CONTROL?.setErrors(null);
      FECHA_CONTROL?.markAsUntouched();
      FECHA_CONTROL?.markAsPristine();
      this.tramite32101Store.setFechaInicialInput('');

      this.inicializarEstadoFormulario();
      this.cdr.detectChanges();
    } else {
      // Marcar todos los campos como untouched y pristine para evitar mostrar errores de validación
      Object.keys(this.registroForm.controls).forEach(fieldName => {
        const FIELD_CONTROL = this.registroForm.get(fieldName);
        if (FIELD_CONTROL) {
          FIELD_CONTROL.markAsTouched();
          FIELD_CONTROL.markAsPristine();
        }
      });
    }
  }

  /**
   * Actualiza una fila específica en la tabla con los datos proporcionados.
   *
   * @param updatedRow - Objeto que contiene los datos actualizados de la fila.
   *                      Debe incluir un identificador único (`id`) para localizar
   *                      la fila correspondiente en la tabla.
   *
   * @remarks
   * Si no se encuentra una fila con el mismo `id` que el de `updatedRow`,
   * no se realiza ninguna actualización.
   */
  updateTableRow(updatedRow: DatosDeLaTabla): void {
    const INDEX = this.configuracionTablaDatos.findIndex(
      (row) => row.id === updatedRow.id
    );
    if (INDEX !== -1) {
      this.configuracionTablaDatos[INDEX] = updatedRow;
      this.configuracionTablaDatos = [...this.configuracionTablaDatos];
    }
  }

  /**
  * Abre el modal y configura la notificación para confirmar que se agregaron datos a la tabla. 
  */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: 'Datos agregados a la tabla correctamente',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.elementoParaEliminar = i;
  }

  /**
  * Abre el modal y configura la notificación para eliminar un pedimento. 
  */
  abrirEleminarModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seguro que desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.elementoParaEliminar = i;
  }
  /**
  * Elimina un pedimento si se confirma la acción. 
  */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.configuracionTablaDatos = this.configuracionTablaDatos.filter(
        (row) => !this.selectedRows.includes(row)
      );
      this.tramite32101Store.setDatosDelContenedor(this.configuracionTablaDatos);
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
    
    this.selectedRows = [];
  }
}
