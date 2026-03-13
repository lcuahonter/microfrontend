import { AsignacionResponse, DetalleCertificado, DetalleCertificadoCertificado, Monto, MontoExpedirTablaDatos, TablaDatos } from '../../models/expedicion-certificados-frontera.models';
import {
  CONFIGURATION_TABLA_MONTO,
  DETALLE_CERTIFICADO,
  DETALLE_CERTIFICADO_CERTIFICADO,
  INPUT_FECHA_FIN,
  INPUT_FECHA_INICIO,
} from '../../constantes/expedicion-certificados-frontera.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogoServices,
  ConfiguracionColumna,
  InputFechaComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TableComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Solicitud120702State, Tramite120702Store } from '../../estados/tramite120702.store';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatePipe } from '@angular/common';
import { DescripcionCupoComponent } from '../descripcion-cupo/descripcion-cupo.component';
import { ExpedicionCertificadosFronteraService } from '../../services/expedicion-certificados-frontera.service';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { Tramite120702Query } from '../../estados/tramite120702.query';

@Component({
  selector: 'app-expedicion-asignacion',
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    DescripcionCupoComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TableComponent,
    TablaDinamicaComponent,
    CommonModule
  ],
  providers: [DatePipe],
  templateUrl: './expedicion-asignacion.component.html',
  styleUrl: './expedicion-asignacion.component.scss',
})
export class ExpedicionAsignacionComponent implements OnInit, OnDestroy, OnChanges {
  /**
  * Validador personalizado para verificar que el monto a expedir no sea mayor al monto disponible.
  * @param control - Control del formulario (montoAExpedir)
  * @returns ValidationErrors | null
  */
  private static montoNoMayorDisponibleValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) return null;
    const montoAExpedir = Number(control.value);
    const montoADisponible = Number(control.parent.get('montoADisponible')?.value);
    if (
      !isNaN(montoAExpedir) &&
      !isNaN(montoADisponible) &&
      montoAExpedir > montoADisponible
    ) {
      return { mayorQueDisponible: true };
    }
    return null;
  }



  /**
   * Establece los valores predeterminados de los campos definidos en `INFORMACION_DESCRIPCION_CUPO`
   * utilizando los datos proporcionados en el objeto `formDatos`.
   * 
   * @param value - Objeto que contiene la información relevante para asignar los valores predeterminados
   *                de los campos del formulario de descripción de cupo. Debe incluir propiedades como
   *                `añoAutorizacion`, `cantidadAprobada`, `idAsignacion`, `impTotalAprobado`, y un objeto
   *                `participante.licitacionPublica` con las propiedades `cantidadMaxima`, `idMecanismoAsignacion`,
   *                `ideTipoConstancia` e `ideTipoLicitacion`.
   * 
   * @remarks
   * Este método recorre la constante `INFORMACION_DESCRIPCION_CUPO` y asigna el valor correspondiente
   * a cada campo según la información recibida en `formDatos`. Es importante que la estructura de
   * `formDatos` cumpla con los requisitos esperados para evitar errores de acceso a propiedades.
   */
  private _formDatos!: AsignacionResponse;

  @Input()
  /**
   * Obtiene los datos del formulario de asignación.
   *
   * @returns {AsignacionResponse} Los datos actuales del formulario.
   */
  get formDatos(): AsignacionResponse {
    return this._formDatos;
  }
  /**
   * Establece el valor de `formDatos` y actualiza los campos de la constante `INFORMACION_DESCRIPCION_CUPO`
   * con los valores correspondientes del objeto proporcionado.
   * 
   * Por cada campo en `INFORMACION_DESCRIPCION_CUPO`, asigna el valor predeterminado según la propiedad
   * específica de `value`. Para los campos relacionados con el participante y licitación pública, accede
   * a las propiedades anidadas dentro de `value.participante.licitacionPublica`.
   * 
   * @param value - Objeto que contiene los datos del formulario, utilizado para actualizar los valores predeterminados
   *                de los campos en la descripción del cupo.
   */
  set formDatos(value: any) {
    this._formDatos = value;
    if (value) {
      this.cargarDatosAsignacion(value);
      this.asignacionFormDatos = value;
    }
  }

  /**
   * Arreglo de montos que representa las filas de la tabla.
   * Each element corresponds to a record of type `Monto`.
   * Initialize as empty array instead of MONTO_DATOS
   */

  @Output() public formaDatos =
    new EventEmitter<AsignacionResponse>();

  saldo: Monto[] = []; // Changed from MONTO_DATOS to empty array

  /**
   * Evento que emite un valor booleano para indicar si el monto debe estar deshabilitado
   * cuando es menor a un valor específico. 
   * 
   * @event
   * @param {boolean} isDisabled - Indica si el monto está deshabilitado (true) o habilitado (false).
   */
  @Output() public isMontoDisableLess =
    new EventEmitter<boolean>();
  /**
   * Indica si el campo de monto debe estar deshabilitado cuando el valor es menor a un umbral específico.
   * 
   * Cuando es `true`, el campo de monto estará deshabilitado para valores inferiores al permitido.
   * Cuando es `false`, el campo de monto permanecerá habilitado independientemente del valor.
   */
  public isMontoDisableLessValue: boolean = false;

  /**
   * Arreglo que contiene los detalles de los certificados asociados al saldo.
   * Cada elemento representa un certificado con su información correspondiente.
   */
  detalleSaldo: DetalleCertificado[] = [];

  /**
   * Arreglo que contiene los detalles de los certificados de saldo.
   * Cada elemento representa una instancia de DetalleCertificadoCertificado,
   * que almacena la información relevante de un certificado específico.
   */
  detalleCertificadoSaldo: DetalleCertificadoCertificado[] = [];

  /**
   * Evento de salida que emite la cantidad de elementos presentes en la tabla.
   * 
   * @event
   * @type {EventEmitter<number>}
   * @description Emite un número que representa la longitud actual de la tabla.
   */
  @Output() public TablaLength =
    new EventEmitter<number>();

  /**
   * Evento de salida que emite un valor booleano indicando si los datos están vacíos.
   * 
   * @event
   * @type {EventEmitter<boolean>}
   * @description
   * Emitido cuando se detecta que los datos requeridos están vacíos o completos.
   * Un valor `true` indica que los datos están vacíos, mientras que `false` indica lo contrario.
   */
  @Output() public emptyDatos =
    new EventEmitter<boolean>();
  /**
   * Configuración de las columnas de la tabla dinámica.
   * Define encabezados, claves de acceso a los datos y orden de cada columna.
   * Utiliza la constante `CONFIGURATION_TABLA_MONTO` para la inicialización.
   */configuracionTablas: ConfiguracionColumna<Monto>[] = CONFIGURATION_TABLA_MONTO;

  /**
   * Arreglo que contiene la configuración de las columnas para la tabla de detalles de certificados.
   * Cada elemento define las propiedades de visualización y comportamiento de una columna específica.
   * 
   * @type {ConfiguracionColumna<DetalleCertificado>[]}
   * @see DETALLE_CERTIFICADO - Configuración base de las columnas.
   */
  configuracionDitalleTabla: ConfiguracionColumna<DetalleCertificado>[] = DETALLE_CERTIFICADO;

  /**
   * Arreglo de configuraciones de columnas para la entidad `DetalleCertificadoCertificado`.
   * Utiliza la constante `DETALLE_CERTIFICADO_CERTIFICADO` como fuente de configuración.
   * 
   * @type {ConfiguracionColumna<DetalleCertificadoCertificado>[]}
   * @description Define las columnas que se mostrarán en la tabla de detalles del certificado,
   * especificando propiedades como el nombre, tipo de dato y formato de cada columna.
   */
  configurationDetalleCertificadoCertificado: ConfiguracionColumna<DetalleCertificadoCertificado>[] = DETALLE_CERTIFICADO_CERTIFICADO;

  /**
  * Propiedad que almacena un arreglo de objetos de tipo `Mercancia` seleccionados para ser guardados.
  * @type {Monto[]}
  */
  public seleccionadaguardarClicado: Monto[] = [];
  /**
  * Configuración de las columnas de la tabla de exportadores.
  * Define el encabezado, clave y el orden de las columnas para la tabla de exportadores.
  */
  public checkbox = TablaSeleccion.CHECKBOX;
  /**
 * Controla la visibilidad del modal de confirmación
 */
  public mostrarModalConfirmacion = false;

  /**
   * Mensaje de error para mostrar cuando no hay selección
   */
  public mensajeError = '';

  /**
   * Controla la visibilidad del mensaje de error
   */
  public mostrarError = false;

  /**
   * Bandera para mostrar u ocultar secciones después del botón "Buscar".
   */
  mostrarSecciones = false;

  /**
   * Indica si el formulario está deshabilitado.
   * Cuando es `true`, el usuario no puede interactuar con los campos del formulario.
   */
  formularioDeshabilitado: boolean = false;
  /**
   * Estado de la consulta recibido como entrada desde el componente padre.
   */
  @Input({ required: true }) consultaState!: ConsultaioState;

  /**
   * Formulario reactivo que contiene los campos del formulario de asignación.
   */
  public asignacionForm!: FormGroup;

  /**
   * Subject utilizado para destruir suscripciones al destruir el componente.
   */
  private destroy$ = new Subject<void>();

  /**
   * Valor por defecto del monto disponible.
   */
  private defaultMontoDisponible = 370;

  /**
   * Texto para la etiqueta del campo fecha de inicio.
   */
  public fechaIncicioAsignacion = INPUT_FECHA_INICIO;

  /**
   * Texto para la etiqueta del campo fecha fin.
   */
  public fechaFinAsignacion = INPUT_FECHA_FIN;

  /**
   * Datos de catálogo para el año del oficio.
   */
  public anoOficioDatos: Catalogo[] = [];

  /**
   * Nombres de las columnas para la tabla de montos.
   */
  public montoTablaDatos: string[] = [];

  /**
   * Filas de datos para la tabla de montos a expedir.
   */
  public montoTablaFilaDatos: TablaDatos[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /** Estado de la solicitud tipo 40302. 
*  Contiene información y progreso de la solicitud. */
  public solicitudState!: Solicitud120702State;

  /**
   * Identificador del trámite actual.
   * 
   * @remarks
   * Este valor representa el código único asociado al trámite de expedición y asignación.
   */
  tramites: string = "120702"

  /**
   * Contiene los datos de respuesta relacionados con la asignación en el formulario.
   * 
   * @type {AsignacionResponse}
   */
  asignacionFormDatos!: AsignacionResponse;

  /**
   * Indica si se ha activado la acción de continuar.
   * 
   * Esta propiedad se utiliza para controlar el flujo del componente cuando el usuario
   * ha iniciado el proceso de continuar. Su valor por defecto es `false`.
   * 
   * @input
   */
  @Input() isContinuarTriggered: boolean = false;

  /**
   * Cantidad total de elementos que están pendientes de ser expedidos.
   * Este valor representa el número acumulado de items que requieren procesamiento
   * para su expedición en el sistema de trámites.
   */
  totalAExpedir: number = 0;

  /**
   * Cantidad restante de elementos por expedir.
   * Representa el número de items pendientes de expedición en el proceso actual.
   */
  remianingExpedir: number = 0;

  /**
   * Indica si la tabla es válida o no.
   * 
   * Esta propiedad se utiliza para controlar el estado de validación de la tabla en el componente.
   * Si es `true`, la tabla cumple con los criterios de validación requeridos; si es `false`, no los cumple.
   */
  public tablaValida: boolean = false;

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios.
   * @param tramite120702Store Store de estado del trámite.
   * @param tramite120702Query Query para observar el estado del trámite.
   * @param expedicionCertificadosFronteraService Servicio para obtener datos estáticos de apoyo.
   */
  constructor(
    private fb: FormBuilder,
    private tramite120702Store: Tramite120702Store,
    private tramite120702Query: Tramite120702Query,
    private expedicionCertificadosFronteraService: ExpedicionCertificadosFronteraService,
    private consultaioQuery: ConsultaioQuery,
    private catalogoServices: CatalogoServices,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter,
    private datePipe: DatePipe
  ) { }

  /**
   * Inicializa el componente y configura el formulario y los datos requeridos.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
        if (seccionState.update) {
          this.mostrarSecciones = true;
        }
        if (this.esFormularioSoloLectura) {
          this.mostrarSecciones = true;
        }
        if (!this.asignacionForm) {
          this.establecerAsignacionFormGroup();
        }
        this.inicializarEstadoFormulario();
      });

    // Fix: Update montoAExpedir validity when montoDisponible changes
    setTimeout(() => {
      const montoDisponibleCtrl = this.asignacionForm.get('montoDisponible');
      const montoAExpedirCtrl = this.asignacionForm.get('montoAExpedir');
      if (montoDisponibleCtrl && montoAExpedirCtrl) {
        montoDisponibleCtrl.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            montoAExpedirCtrl.updateValueAndValidity();
          });
      }
    });
    this.getAnoOficioDatos();

    this.expedicionCertificadosFronteraService
      .getMontoExpedirTabla()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: MontoExpedirTablaDatos) => {
        this.montoTablaDatos = data.columns;
      });
    this.emitTablaLength()
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando cambian las propiedades de entrada del componente.
   * 
   * Si la bandera `isContinuarTriggered` está activada, valida el estado de la propiedad `saldo`:
   * - Si `saldo` no está vacío, establece `tablaValida` en `false`.
   * - Si `saldo` está vacío, establece `tablaValida` en `true`.
   * 
   * @remarks
   * Este método asegura que la tabla solo sea válida cuando no existan elementos en `saldo` al continuar el proceso.
   */
  public ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      if (this.saldo?.length !== 0) {
        this.tablaValida = false;
      } else if (this.saldo?.length === 0) {
        this.tablaValida = true;
      }
    }
  }

  /**
   * Obtiene los datos del catálogo de año de oficio relacionados con los trámites actuales.
   * Realiza una solicitud al servicio de catálogo utilizando los trámites seleccionados,
   * y asigna la respuesta al arreglo `anoOficioDatos` como una lista de objetos `Catalogo`.
   * La suscripción se cancela automáticamente al destruir el componente.
   */
  getAnoOficioDatos(): void {
    this.catalogoServices
      .asignacionCatalogo(this.tramites)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.anoOficioDatos = res.datos as Catalogo[];
      });

  }

  /**
   * Emite la longitud actual del arreglo `saldo` a través del evento `TablaLength`.
   * 
   * Este método calcula la cantidad de elementos presentes en el arreglo `saldo`
   * y emite ese valor para notificar a otros componentes o servicios interesados
   * en la longitud de la tabla.
   */
  private emitTablaLength(): void {
    const LENGTH = this.saldo.length;
    this.TablaLength.emit(LENGTH);
  }


  /**
    * Determina si se debe cargar un formulario nuevo o uno existente.  
    * Ejecuta la lógica correspondiente según el estado del componente.
    */
  inicializarEstadoFormulario(): void {
    if (!this.asignacionForm) { return }
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.asignacionForm.enable();
      this.asignacionForm.get('estado')?.disable();
      this.asignacionForm.get('representacionFederal')?.disable();
      this.asignacionForm.get('montoAsignado')?.disable();
      this.asignacionForm.get('montoExpedido')?.disable();
      this.asignacionForm.get('montoDisponible')?.disable();
      this.asignacionForm.get('datosNumeroOficio')?.disable();
      this.asignacionForm.get('fechaInicioVigencia')?.disable();
      this.asignacionForm.get('fechaFinVigencia')?.disable();
      this.asignacionForm.get('montoADisponible')?.disable();
      this.asignacionForm.get('totalAExpedir')?.disable();
    }
  }

  /**
  * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
  * Luego reinicializa el formulario con los valores actualizados desde el store.
  */
  guardarDatosFormulario(): void {
    if (!this.asignacionForm) { return }
    if (this.esFormularioSoloLectura) {
      this.asignacionForm.disable();
      if (this.montoTablaFilaDatos.length === 0) {
        const OBRA_DE_ARTE_ROW: TablaDatos = {
          tbodyData: ["10"],
        };
        this.montoTablaFilaDatos.push(OBRA_DE_ARTE_ROW);
      }
    } else if (!this.esFormularioSoloLectura) {
      this.asignacionForm.enable();
    }
  }

  /**
   * Establece la estructura inicial del formulario reactivo de asignación.
   */
  establecerAsignacionFormGroup(): void {
    this.asignacionForm = this.fb.group({

      anoDelOficio: ['', [Validators.required]],
      numeroOficio: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(15)]],
      montoAExpedir: ['', [
        Validators.pattern(/^\d+(\.\d+)?$/),
        Validators.maxLength(15),
        Validators.min(0.0000001),
        ExpedicionAsignacionComponent.montoNoMayorDisponibleValidator
      ]],
      montoADisponible: [''],
      fechaInicioVigencia: [''],
      fechaFinVigencia: [''],
      estado: [''],
      representacionFederal: [''],
      montoAsignado: [''],
      montoExpedido: [''],
      montoDisponible: [''],
      datosNumeroOficio: [''],
      totalAExpedir: ['']
    });

  }

  /**
   * Método para forzar la validación de todos los campos del formulario
   */
  public forzarValidacion(): void {
    if (this.asignacionForm) {
      Object.keys(this.asignacionForm.controls).forEach(key => {
        const CONTROL = this.asignacionForm.get(key);
        if (CONTROL) {
          CONTROL.markAsTouched();
          CONTROL.updateValueAndValidity();
        }
      });

      Object.keys(this.asignacionForm.controls).forEach(key => {
        const CONTROL = this.asignacionForm.get(key);
        if (CONTROL && CONTROL.errors) {
          // El control tiene errores de validación; manejar o registrar si es necesario
        }
      });
    }
  }

  /**
   * Actualiza un valor del formulario en el store mediante un método dinámico.
   * @param form Formulario de donde se toma el valor.
   * @param campo Nombre del campo a obtener.
   * @param metodoNombre Nombre del método en el store que será invocado.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite120702Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite120702Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Cambia el valor de la fecha de inicio en el formulario y actualiza el store.
   * @param nuevo_valor Nuevo valor de la fecha de inicio.
   */
  cambioFechaInicio(nuevo_valor: string): void {
    this.asignacionForm.patchValue({
      fechaInicioVigencia: nuevo_valor,
    });
    this.tramite120702Store.setFechaInicio(nuevo_valor);
  }

  /**
   * Cambia el valor de la fecha de fin en el formulario y actualiza el store.
   * @param nuevo_valor Nuevo valor de la fecha de fin.
   */
  cambioFechaFin(nuevo_valor: string): void {
    this.asignacionForm.patchValue({
      fechaFinVigencia: nuevo_valor,
    });
    this.tramite120702Store.setFechaFin(nuevo_valor);
  }
  /**
  * Método que asigna un objeto de tipo `Mercancia` al arreglo de mercancías seleccionadas para guardar.
  * @param {Mercancia} evento - Objeto de tipo `Mercancia` que ha sido seleccionado.
  */
  obtenerSeleccionadoMercancia(filas: Monto[]): void {
    this.seleccionadaguardarClicado = filas;
  }
  /**
  * Método que elimina los objetos seleccionados del arreglo de mercancías guardadas.
  * @remarks
  * Este método verifica si hay elementos seleccionados antes de vaciar el arreglo `guardarClicado`.
  */
  eliminarSeleccionados(): void {
    if (this.seleccionadaguardarClicado.length === 0) {
      this.mensajeError = 'Debe seleccionar al menos un registro para eliminar.';
      this.mostrarError = true;
      this.mostrarModalConfirmacion = true;
      return;
    }

    this.mensajeError = `¿Está seguro que desea eliminar ${this.seleccionadaguardarClicado.length} registro(s)?`;
    this.mostrarModalConfirmacion = true;
  }

  /**
   * Confirma la eliminación de los registros seleccionados
   */
  confirmarEliminacion(): void {
    if (this.seleccionadaguardarClicado.length > 0) {

      this.saldo = this.saldo.filter(item =>
        !this.seleccionadaguardarClicado.some(selected =>
          selected.Montoaexpedir === item.Montoaexpedir
        )
      );


      this.seleccionadaguardarClicado = [];


      this.calcularTotalAExpedir();
    }

    this.mostrarModalConfirmacion = false;
  }

  /**
   * Cancela la eliminación y cierra el modal
   */
  cancelarEliminacion(): void {
    this.mostrarModalConfirmacion = false;
    this.mostrarError = false;
  }

  /**
   * Calcula el total de los montos a expedir y actualiza el campo totalAExpedir
   */
  public calcularTotalAExpedir(): void {
    const TOTAL = this.saldo.reduce((sum, item) => {
      const MONTO = parseFloat(item.Montoaexpedir) || 0;
      return sum + MONTO;
    }, 0);
    if(TOTAL < this.totalAExpedir){
      this.totalAExpedir=this.totalAExpedir-this.remianingExpedir;
      this.remianingExpedir = this.totalAExpedir - TOTAL;
    }
    const MONDODISPONIBLE = this.asignacionForm.get('montoADisponible')?.value;
    this.asignacionForm.get('montoADisponible')?.setValue(MONDODISPONIBLE + this.remianingExpedir);
    this.asignacionForm.get('totalAExpedir')?.setValue(TOTAL);
  }

  /**
   * Procesa el valor del campo montoAExpedir y actualiza la tabla y valores dependientes.
   */
  public enviarMontoFormulario(): void {

    const MONTOEXPEDIR = this.asignacionForm.get('montoAExpedir')?.value;
    const MONTOADISPONIBLE = this.asignacionForm.get('montoADisponible')?.value;
    if (MONTOEXPEDIR > MONTOADISPONIBLE) {
      this.isMontoDisableLessValue = true;
      this.isMontoDisableLess.emit(this.isMontoDisableLessValue);
      return;
    } else if (MONTOEXPEDIR <= MONTOADISPONIBLE) {
      this.isMontoDisableLessValue = false;
      this.isMontoDisableLess.emit(this.isMontoDisableLessValue);
    }
    if (MONTOEXPEDIR === null || MONTOEXPEDIR === undefined || MONTOEXPEDIR === '' || MONTOEXPEDIR === '0') {
        this.isMontoDisableLessValue = true;
      this.isMontoDisableLess.emit(this.isMontoDisableLessValue);
      return;
    }

    const PARSEDVALUE = parseFloat(MONTOEXPEDIR);
    if (isNaN(PARSEDVALUE)) {
      return;
    }

    const NUEVOMONTO: Monto = {
      Montoaexpedir: PARSEDVALUE.toString()
    };
     this.totalAExpedir=PARSEDVALUE + this.totalAExpedir;
    this.saldo.push(NUEVOMONTO);
    this.saldo = [...this.saldo];
    this.asignacionForm.get('montoAExpedir')?.setValue('');
    this.asignacionForm.get('montoAExpedir')?.clearValidators();
    this.asignacionForm.get('montoAExpedir')?.updateValueAndValidity();
    // Only subtract the last added value
    const montoADisponible = parseFloat(this.asignacionForm.get('montoADisponible')?.value || '0');
    this.asignacionForm.get('montoADisponible')?.setValue(montoADisponible - PARSEDVALUE);
    this.calcularTotalAExpedir();
    this.emitTablaLength();
  }
  /**
   * Método que se ejecuta al hacer clic en el botón "Buscar".
   * Valida que los campos requeridos tengan valores antes de mostrar las secciones.
   */
  onBuscarClick(): void {

    this.asignacionForm.get('anoDelOficio')?.markAsTouched();
    this.asignacionForm.get('numeroOficio')?.markAsTouched();


    const ANODELOFICIO = this.asignacionForm.get('anoDelOficio')?.value;
    const NUMEROOFICIO = this.asignacionForm.get('numeroOficio')?.value;
    const ISANOOFICIOVALID = ANODELOFICIO && ANODELOFICIO.trim() !== '';
    const ISNUMEROOFICIOVALID = NUMEROOFICIO &&
      NUMEROOFICIO.trim() !== '' &&
      this.asignacionForm.get('numeroOficio')?.valid;

  }

  /**
   * Obtiene y busca los datos relacionados con la asignación de certificados de frontera.
   *
   * Marca los campos 'anoDelOficio' y 'numeroOficio' como tocados para activar la validación.
   * Verifica que ambos campos sean válidos y no estén vacíos. Si son válidos, muestra las secciones correspondientes.
   * Construye los parámetros necesarios y realiza una petición al servicio `expedicionCertificadosFronteraService`
   * para obtener los datos asociados. Al recibir la respuesta, emite los datos obtenidos, los carga en el formulario
   * y los asigna a la variable local.
   *
   * @remarks
   * Este método depende de la validez de los campos del formulario y realiza una petición asíncrona.
   *
   * @returns {void}
   */
  obtenerBuscarDatos(): void {
    this.asignacionForm.get('anoDelOficio')?.markAsTouched();
    this.asignacionForm.get('numeroOficio')?.markAsTouched();
    const ANODELOFICIO = this.asignacionForm.get('anoDelOficio')?.value;
    const NUMEROOFICIO = this.asignacionForm.get('numeroOficio')?.value;
    const URL_PARAM = {
      rfcSolicitante: "MAVL621207C95",
      numFolioAsignacion: NUMEROOFICIO,
      anioAutorizacion: ANODELOFICIO
    };

    this.expedicionCertificadosFronteraService.getBuscarDatos(URL_PARAM)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (!response.datos) {
          this.mostrarSecciones = false;
          this.emptyDatos.emit(true);
        } else {
          this.mostrarSecciones = true;
          this.emptyDatos.emit(false);
        }
        this.formaDatos.emit(response.datos);
        this.cargarDatosAsignacion(response.datos);
        this.asignacionFormDatos = response.datos;
      });
  }


  /**
   * Carga los datos de la asignación cuando la búsqueda es exitosa.
   * Este método puede ser expandido para cargar datos reales desde un servicio.
   */
  private cargarDatosAsignacion(dato: any): void {
    let datos = {} as any;
    if (dato?.asignacion) {
      datos = dato?.asignacion;
    } else {
      datos = dato;
    }
    if (!this.asignacionForm) {
      this.establecerAsignacionFormGroup();
    }
    const FECHA_INOCIO = this.formatDate(datos?.fechaInicioVigencia || '');
    const FECHA_FIN = this.formatDate(datos?.fechaFinVigenciaAprobada || datos?.fechaFinVigenciaSolicitada);
    this.asignacionForm.patchValue({
      estado: datos?.solicitud?.unidadAdministrativaRepresentacionFederal?.entidadFederativa?.nombre || 'N/A',
      representacionFederal: datos?.solicitud?.unidadAdministrativaRepresentacionFederal?.nombre || 'N/A',
      montoAsignado: datos?.participante?.montoAdjudicado || '1000.00',
      montoExpedido: datos?.montoExpedido || datos?.impTotalExpedido,
      montoADisponible: datos?.montoDisponible,
      datosNumeroOficio: this.asignacionForm.get('numeroOficio')?.value || datos?.numFolioAsignacion,
      anoDelOficio: datos?.idAsignacion,
      numeroOficio: datos?.añoAutorizacion,
      fechaInicioVigencia: FECHA_INOCIO,
      fechaFinVigencia: FECHA_FIN,
      montoDisponible: datos?.montoDisponible,
    });
  }

  /**
   * Formatea una cadena de fecha a formato 'dd/MM/yyyy'.
   *
   * @param dateString - La fecha en formato de cadena que se desea formatear.
   * @returns La fecha formateada como 'dd/MM/yyyy', o una cadena vacía si la transformación falla.
   */
  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd/MM/yyyy') || '';
  }

  /**
     * Método del ciclo de vida Angular que se ejecuta al destruir el componente.
     * Libera las suscripciones activas.
     */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
