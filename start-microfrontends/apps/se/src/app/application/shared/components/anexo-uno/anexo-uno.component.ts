import { AlertComponent, Catalogo, Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import {
  AnexoDosConfiguartion,
  AnexoDosEncabezado,
  AnexoUnoConfiguartion,
  AnexoUnoEncabezado,
  DatosComplimento,
  RutaNombre,
} from '../../models/nuevo-programa-industrial.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OnChanges, Output } from '@angular/core';
import { Subject, delay, takeUntil } from 'rxjs';
import { ANEXO_UNO_ALERTA } from '../../constantes/anexo-dos-y-tres.enum';
import { CargaDeFraccionesComponent } from '../carga-de-fracciones/carga-de-fracciones.component';
import { CargaProveedoresClientesComponent } from '../carga-proveedores-clientes/carga-proveedores-clientes.component';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../services/complimentos.service';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-anexo-uno',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    NotificacionesComponent,
    CargaDeFraccionesComponent,
    CargaProveedoresClientesComponent
  ],
  templateUrl: './anexo-uno.component.html',
  styleUrl: './anexo-uno.component.scss',
})
export class AnexoUnoComponent implements OnInit, OnDestroy, OnChanges {
  public anexoUnoAlerta = ANEXO_UNO_ALERTA;
  public anexoUnoFormGroup!: FormGroup;
  public anexoDosFormGroup!: FormGroup;

  /**
   * Configuración de Anexo 1 y 3
   */
  @Input() anexoConfiguartion!: AnexoUnoConfiguartion<AnexoUnoEncabezado>;
  /**
   * Configuración de Anexo 1 y 3
   */
  @Input()
  anexoDosConfiguartion!: AnexoDosConfiguartion<AnexoDosEncabezado>;
  /**
   * Lista de tabla del Anexo Tres
   */
  @Input() anexoUnoTablaLista: AnexoUnoEncabezado[] = [];

  /**
   * Lista de tabla del Anexo Dos
   */
  @Input() anexoDosTablaLista: AnexoDosEncabezado[] = [];

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
    * Notificador utilizado para manejar la destrucción o desuscripción de observables.
    * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
    *
    * @property {Subject<void>} destroyNotifier$
    */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Evento para devolver la llamada del Anexo Uno
   */
  @Output() obtenerAnexoUnoDevolverLaLlamada: EventEmitter<
    AnexoUnoEncabezado[]
  > = new EventEmitter<AnexoUnoEncabezado[]>(true);

  /**
   * Evento para devolver la llamada del Anexo Dos
   */
  @Output() obtenerAnexoDosDevolverLaLlamada: EventEmitter<
    AnexoDosEncabezado[]
  > = new EventEmitter<AnexoDosEncabezado[]>(true);

  /**
   * Evento para emitir la ruta de la fracción de complemento
   * @property {EventEmitter<RutaNombre>} rutaLaFraccionDeComplemento
   */
  @Output() rutaLaFraccionDeComplemento: EventEmitter<RutaNombre> =
    new EventEmitter<RutaNombre>();

  /**
   * Evento que emite un booleano cuando hay un cambio en los datos de la tabla.
   * Útil para notificar al componente padre sobre modificaciones en la tabla.
   */
  @Output() tieneCambioDeDatosDeTabla = new EventEmitter<boolean>();

  /**
   * Emits events containing `DatosComplimento` data to notify parent components of changes or updates.
   * 
   * @remarks
   * This `EventEmitter` is used to communicate from the child component to its parent, typically when
   * the `DatosComplimento` data has been modified or needs to be sent upwards in the component hierarchy.
   *
   * @eventProperty
   * @type {EventEmitter<DatosComplimento>}
   */
  @Output()
  complimentosDatos: EventEmitter<DatosComplimento> =
    new EventEmitter<DatosComplimento>(true);

  /**
   * Emits events containing `DatosComplimento` data when relevant changes occur.
   * 
   * @remarks
   * This output can be subscribed to by parent components to receive updates.
   *
   * @eventProperty
   */
  @Output()
  complimentosDatosDos: EventEmitter<DatosComplimento> =
    new EventEmitter<DatosComplimento>(true);
  /**
    * @description
    * Objeto que representa una notificación de confirmación para agregar servicios.
    * Se utiliza para mostrar modal de confirmación al usuario.
    */
  public notificacionAgregarServicios!: Notificacion;

  /**
   * Datos seleccionados de importación
   * @property {AnexoDosEncabezado | AnexoUnoEncabezado} datosImportacionSeleccionados
   */
  public datosImportacionSeleccionados!:
    | AnexoDosEncabezado
    | AnexoUnoEncabezado;

  /**
   * Establece el formulario de datos del subcontratista.
   * @param valor - Formulario reactivo con los datos del subcontratista.
   */
  @Input()
  set formularioDatosSubcontratista(valor: FormGroup) {
    this.anexoUnoFormGroup.setValue(valor.value);
  }

  /** Obtiene el formulario de datos del subcontratista.
   * @returns Formulario reactivo con los datos del subcontratista.
   */
  get formularioDatosSubcontratista(): FormGroup {
    return this.anexoUnoFormGroup;
  }

  /**
   * Establece el formulario de datos del subcontratista.
   * @param valor - Formulario reactivo con los datos del subcontratista.
   */
  @Input() set formularioDatosSubcontratistaDos(valor: FormGroup) {
    this.anexoDosFormGroup.setValue(valor.value);
  }

  /** Obtiene el formulario de datos del subcontratista dos.
   * @returns Formulario reactivo con los datos del subcontratista dos.
   */
  get formularioDatosSubcontratistaDos(): FormGroup {
    return this.anexoDosFormGroup;
  }

  /**
   * Datos seleccionados de exportación
   * @property {AnexoDosEncabezado | AnexoUnoEncabezado} datosExportacionSeleccionados
   */
  public datosExportacionSeleccionados!:
    | AnexoDosEncabezado
    | AnexoUnoEncabezado;

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaDosNotificacion!: Notificacion;

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaUnoNotificacion!: Notificacion;

  /**
   * Indica si la tabla actualmente tiene datos.
   * Se utiliza para controlar la visualización o lógica relacionada con el contenido de la tabla.
   */
  public tenerDatosDeTabla: boolean = false;

  /**
  * Controla la visibilidad del modal para la carga de datos por archivo.
  * Se utiliza para mostrar u ocultar el modal de carga por archivo según sea necesario.
  */
  public mostrarCargaPorArchivoModal = false;

  /**
  * Controla la visibilidad del popup para la carga de fracciones.
  * Se utiliza para mostrar u ocultar el popup relacionado con la carga de fracciones en la interfaz.
  */
  public mostrarCargaDeFraccionesPopup: boolean = false;

  /**
  * Controla la visibilidad del popup de proveedor-clientes.
  * Se utiliza para mostrar u ocultar el popup relacionado con la gestión de proveedores y clientes.
  */
  public mostrarProveedorClientesPopup: boolean = false;

  /**
   * Arreglo que contiene las categorías del catálogo de tipo `Catalogo`.
   * Se utiliza para almacenar y gestionar las diferentes categorías disponibles en el componente.
   */
  TipCategoriaCatalogo: Catalogo[] = [];
  /**
   * Catálogo de fracción seleccionado.
   * Se utiliza para almacenar la fracción seleccionada del catálogo.
   */
  @Input() catalogoFraccionSeleccionado: string | null = null;

  /**
   * Notificación para indicar que no se tiene permiso para abrir una pestaña.
   * @property {Notificacion} notificacionSinPermiso
   */
  public notificacionSinPermiso!: Notificacion;
  /**
   * Constructor de la clase AnexoUnoComponent
   * @param {FormBuilder} fb - Constructor para crear formularios reactivos
   */
  constructor(
    private fb: FormBuilder,
    private complimentosService: ComplimentosService,
    private servicioDeFormularioService: ServicioDeFormularioService,) {
    this.crearFormularioAnexoUno();
    this.crearFormularioAnexoDos();
  }

  /**
 * Abre un modal con una notificación configurada para confirmar una acción de eliminación.
 * 
 * Este método inicializa un objeto de notificación con los siguientes parámetros:
 * - `tipoNotificacion`: Define el tipo de notificación como "alerta".
 * - `categoria`: Establece la categoría de la notificación como "peligro".
 * - `modo`: Configura el modo de la notificación como "acción".
 * - `titulo`: Campo para el título de la notificación (vacío por defecto).
 * - `mensaje`: Mensaje que se muestra en la notificación, en este caso,
 *   pregunta si el usuario está seguro de que desea eliminar.
 * - `cerrar`: Indica si la notificación puede cerrarse manualmente (true).
 * - `tiempoDeEspera`: Tiempo en milisegundos antes de que la notificación desaparezca automáticamente (2000 ms).
 * - `txtBtnAceptar`: Texto del botón de aceptación ("Aceptar").
 * - `txtBtnCancelar`: Texto del botón de cancelación (vacío por defecto).
 * 
 * @returns {void} Este método no devuelve ningún valor.
 */
  abrirUnoModal(): void {
    this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        '¿Estás seguro de que deseas eliminar?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Abre un modal con una notificación configurada para confirmar una acción de eliminación.
   * 
   * Este método inicializa un objeto de notificación con los siguientes parámetros:
   * - `tipoNotificacion`: Define el tipo de notificación como "alerta".
   * - `categoria`: Establece la categoría de la notificación como "peligro".
   * - `modo`: Configura el modo de la notificación como "acción".
   * - `titulo`: Campo para el título de la notificación (vacío por defecto).
   * - `mensaje`: Mensaje que se muestra en la notificación, en este caso,
   *   pregunta si el usuario está seguro de que desea eliminar.
   * - `cerrar`: Indica si la notificación puede cerrarse manualmente (true).
   * - `tiempoDeEspera`: Tiempo en milisegundos antes de que la notificación desaparezca automáticamente (2000 ms).
   * - `txtBtnAceptar`: Texto del botón de aceptación ("Aceptar").
   * - `txtBtnCancelar`: Texto del botón de cancelación (vacío por defecto).
   * 
   * @returns {void} Este método no devuelve ningún valor.
   */
  abrirDosModal(): void {
    this.nuevaDosNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        '¿Estás seguro de que deseas eliminar?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Si el formulario está deshabilitado (`formularioDeshabilitado` es verdadero),
   * deshabilita los grupos de formularios `anexoUnoFormGroup` y `anexoDosFormGroup`.
   */
  ngOnInit(): void {
    this.obtenerTipCategoria('ENU_TIPO_CATEGORIA')
    if (this.formularioDeshabilitado) {
      this.anexoUnoFormGroup.disable();
      this.anexoDosFormGroup.disable();
    }
    this.anexoUnoFormGroup.valueChanges
      .pipe(delay(100))
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((_) => {
        this.complimentosDatos.emit(this.anexoUnoFormGroup.value);
      });

    this.anexoDosFormGroup.valueChanges
      .pipe(delay(100))
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((_) => {
        this.complimentosDatosDos.emit(this.anexoDosFormGroup.value);
      });
  }
  /** Sincroniza los datos de las tablas de Anexo Dos y Tres con el servicio de formularios al detectar cambios. */
  ngOnChanges(): void {
    if (this.anexoUnoTablaLista.length === 0) {
      this.servicioDeFormularioService.registerArray('anexoUnoTabla1', this.anexoUnoTablaLista);
    } else {
      this.servicioDeFormularioService.setArray('anexoUnoTabla1', this.anexoUnoTablaLista);
    }

    if (this.anexoDosTablaLista.length === 0) {
      this.servicioDeFormularioService.registerArray('anexoUnoTabla2', this.anexoDosTablaLista);
    } else {
      this.servicioDeFormularioService.setArray('anexoUnoTabla2', this.anexoDosTablaLista);
    }
  }

  /**
   * Crea el formulario del Anexo Uno
   * @returns {void}
   */
  crearFormularioAnexoUno(): void {
    this.anexoUnoFormGroup = this.fb.group({
      fraccionArancelaria: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern('^[0-9]+$')
        ]
      ],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  /**
   * Crea el formulario del Anexo Dos
   */
  crearFormularioAnexoDos(): void {
    this.anexoDosFormGroup = this.fb.group({
      fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }
  /**
   * Elimina elementos del Anexo Tres que no tienen estatus
   */
  eliminarAnexoUno(): void {
    this.anexoUnoTablaLista = this.anexoUnoTablaLista.filter((idx) => {
      return idx !== this.datosImportacionSeleccionados;
    });
    this.tenerDatosDeTabla = this.anexoUnoTablaLista.length > 0;
    this.tieneCambioDeDatosDeTabla.emit(this.tenerDatosDeTabla);
    this.obtenerAnexoUnoDevolverLaLlamada.emit(this.anexoUnoTablaLista);
  }

  /**
   * Elimina elementos del Anexo Tres que no tienen estatus
   */
  eliminarAnexoDos(): void {
    this.anexoDosTablaLista = this.anexoDosTablaLista.filter((idx) => {
      return idx !== this.datosExportacionSeleccionados;
    });
    this.obtenerAnexoDosDevolverLaLlamada.emit(this.anexoDosTablaLista);
  }

  /**
   * Agrega un nuevo elemento al Anexo Uno
   */
  agregarAnexoUno(): void {
    const FRACCION_CONTROL = this.anexoUnoFormGroup.get('fraccionArancelaria');
    const DESCRIPCION_CONTROL = this.anexoUnoFormGroup.get('descripcion');
    const FRACCION_PATTERN = /^[0-9]{8}$/;

    if (!FRACCION_CONTROL?.value || !DESCRIPCION_CONTROL?.value) {
      this.notificacionAgregarServicios = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Tiene que introducir la Fracción arancelaria',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.anexoUnoFormGroup.markAllAsTouched();
      return;
    }

    if (!FRACCION_PATTERN.test(FRACCION_CONTROL.value.trim())) {
      this.mostrarNotificacionFraccionInvalida();
      this.anexoUnoFormGroup.reset();
      return;
    }

    const PAYLOAD = {
      fraccion: FRACCION_CONTROL.value,
      descFraccion: DESCRIPCION_CONTROL.value,
      servicio: null,
      servicio_padre: null
    };

    this.complimentosService.getfraccionArancelariaExportacion(PAYLOAD).subscribe(
      (res: any) => {
        if (res) {
          const SERIAL = this.anexoUnoTablaLista.length + 1;
          const OBJECTO_IDX: AnexoUnoEncabezado = {
            encabezadoFraccion: SERIAL.toString(),
            encabezadoDescripcionComercial: (DESCRIPCION_CONTROL.value ?? '').toUpperCase(),
            estatus: false,
            encabezadoFraccionArancelaria: FRACCION_CONTROL.value,
            encabezadoAnexoII: 'NO SENSIBLE',
            encabezadoTipo: 'EXPORTACION',
            encabezadoUmt: 'Kilogramo',
            encabezadoCategoria: '',
            encabezadoValorEnMercado: '',
            encabezadoValorEnMonedaMensual: 0,
            encabezadoValorEnMonedaAnual: 0,
            encabezadoVolumenMensual: 0,
            encabezadoVolumenAnual: 0,
          };
          this.anexoUnoFormGroup.reset();
          this.anexoUnoTablaLista = [...this.anexoUnoTablaLista, OBJECTO_IDX];
          this.tenerDatosDeTabla = this.anexoUnoTablaLista.length > 0;
          this.tieneCambioDeDatosDeTabla.emit(this.tenerDatosDeTabla);
          this.obtenerAnexoUnoDevolverLaLlamada.emit(this.anexoUnoTablaLista);
        }
        else {
          this.mostrarNotificacionFraccionInvalida();
        }
      }
    );
  }

  /**
   * Muestra una notificación indicando que la fracción arancelaria es inválida o no está vigente.
   * @return {void} No devuelve ningún valor.
   */
  mostrarNotificacionFraccionInvalida(): void {
    this.notificacionAgregarServicios = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'La fracción arancelaria no es válida o no esta vigente.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Agrega un nuevo elemento al Anexo Dos
   */
  agregarAnexoDos(): void {

    const FRACCION_CONTROL = this.anexoDosFormGroup.get('fraccionArancelaria');
    const DESCRIPCION_CONTROL = this.anexoDosFormGroup.get('descripcion');
    const FRACCION_PATTERN = /^[0-9]{8}$/;
    if (!FRACCION_CONTROL?.value || !DESCRIPCION_CONTROL?.value) {
      this.notificacionAgregarServicios = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Tiene que introducir la Fracción arancelaria y su descripción',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.anexoDosFormGroup.markAllAsTouched();
      return;
    }

    if (!FRACCION_PATTERN.test(FRACCION_CONTROL.value.trim())) {
      this.mostrarNotificacionFraccionInvalidaDos();
      this.anexoDosFormGroup.reset();
      return;
    }

    if (this.anexoDosFormGroup.invalid) {
      this.anexoDosFormGroup.markAllAsTouched();
      return;
    }

    const PAYLOAD = {
      fraccion: FRACCION_CONTROL.value,
      descFraccion: DESCRIPCION_CONTROL.value,
      servicio: null,
      servicio_padre: null
    };

    this.complimentosService.getfraccionArancelariaImportacion(PAYLOAD).subscribe(
      (res: any) => {
        if (res) {
          const SERIAL = this.anexoDosTablaLista.length + 1;
          const OBJECTO_IDX: AnexoDosEncabezado = {
            encabezadoFraccion: SERIAL.toString(),
            encabezadoDescripcionComercial:
              (DESCRIPCION_CONTROL.value ?? '').toUpperCase(),
            estatus: false,
            encabezadoFraccionExportacion: FRACCION_CONTROL.value,
            encabezadoFraccionImportacion: '',
            encabezadoDescripcionComercialImportacion: '',
            encabezadoAnexoII: 'NO SENSIBLE',
            encabezadoTipo: 'IMPORTACION',
            encabezadoUmt: 'Kilogramo',
            encabezadoCategoria: '',
            encabezadoValorEnMonedaMensual: 0,
            encabezadoValorEnMonedaAnual: 0,
            encabezadoVolumenMensual: 0,
            encabezadoVolumenAnual: 0,
          };
          this.anexoDosFormGroup.reset();
          this.anexoDosTablaLista = [...this.anexoDosTablaLista, OBJECTO_IDX];
          this.obtenerAnexoDosDevolverLaLlamada.emit(this.anexoDosTablaLista);
        } else {
          this.mostrarNotificacionFraccionInvalidaDos();
        }
      },
      () => {
        this.mostrarNotificacionFraccionInvalidaDos();
      }
    );
  }
  /**
   * Muestra una notificación indicando que la fracción de exportación es inválida.
   * @return {void} No devuelve ningún valor.
   */
mostrarNotificacionFraccionInvalidaDos(): void {
     this.notificacionAgregarServicios = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar una fracción de exportación',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  /**
   * Establece la lista de Anexo Uno y emite un evento con la lista seleccionada.
   *
   * @param {AnexoUnoEncabezado[]} event - La lista de encabezados de Anexo Uno.
   * Si no se proporciona, se utilizará una lista vacía.
   * @returns {void}
   */
  setAnexoUnoLista(event: AnexoUnoEncabezado): void {
    this.datosImportacionSeleccionados = event;
    this.complimentosService.setAnexoUnoFilaSeleccionada(event);
    this.complimentosService.setAnexoDosFilaSeleccionada(null);
    //this.obtenerAnexoUnoDevolverLaLlamada.emit(LISTA_SELECCIONADA);
  }

  /**
   * Establece la lista de Anexo Dos y emite un evento con la lista seleccionada.
   *
   * @param {AnexoDosEncabezado[]} event - La lista de encabezados de importación de anexo.
   * Si no se proporciona, se utilizará una lista vacía.
   * @returns {void}
   */
  setAnexoDosLista(event: AnexoDosEncabezado): void {
    this.datosExportacionSeleccionados = event;
    this.complimentosService.setAnexoDosFilaSeleccionada(event);
    this.complimentosService.setAnexoUnoFilaSeleccionada(null);
  }

  /**
   * Maneja el evento de clic en el proyecto IMMEX.
   * @returns
   * {void} No devuelve ningún valor. 
   */
  onProyectoImmexClick(): void {
    if (!this.catalogoFraccionSeleccionado) {
      this.notificacionSinPermiso = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Solo se permiten fracciones de exportación de producto terminado.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (this.catalogoFraccionSeleccionado !== 'TICAT.PT') {
      this.notificacionSinPermiso = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar la fracción arancelaria del producto.',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.setRuta('proyecto-immex', 'IMPORT');
  }
  /**
   * Establece la ruta con el nombre proporcionado y emite el evento `rutaLaFraccionDeComplemento`.
   *
   * @param {string} nombre - El nombre de la categoría para establecer la ruta.
   * @returns {void}
   */
  setRuta(nombre: string, id: string): void {
    if (id === 'IMPORT' && !this.datosImportacionSeleccionados) {
      this.nuevaUnoNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje:
          'Debe seleccionar la fracción arancelaria del producto',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (id === 'EXPORT' && !this.datosExportacionSeleccionados) {
      this.nuevaDosNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje:
          'Debe seleccionar la fracción arancelaria del producto',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (nombre) {
      if (id === 'IMPORT') {
        if (
          this.datosImportacionSeleccionados &&
          'encabezadoFraccionArancelaria' in this.datosImportacionSeleccionados
        ) {
          this.complimentosService.setAnexoUnoFilaSeleccionada(this.datosImportacionSeleccionados as AnexoUnoEncabezado);
        } else {
          this.complimentosService.setAnexoUnoFilaSeleccionada(null);
        }
        this.complimentosService.setAnexoDosFilaSeleccionada(null);
      } else if (id === 'EXPORT') {
        if (this.datosExportacionSeleccionados && 'encabezadoFraccionExportacion' in this.datosExportacionSeleccionados) {
          this.complimentosService.setAnexoDosFilaSeleccionada(this.datosExportacionSeleccionados as AnexoDosEncabezado);
        } else {
          this.complimentosService.setAnexoDosFilaSeleccionada(null);
        }
        this.complimentosService.setAnexoUnoFilaSeleccionada(null);
      }
      const RUTA_NOMBRE: RutaNombre = {
        catagoria: nombre,
        id: id,
        datos:
          id === 'IMPORT'
            ? this.datosImportacionSeleccionados
            : this.datosExportacionSeleccionados,
      };
      this.rutaLaFraccionDeComplemento.emit(RUTA_NOMBRE);
    }
  }

  /**
   * Obtiene el catálogo de TipCategoria según el valor de la clave enumerada proporcionada.
   * 
   * @param cveEnum - Clave del enumerado para buscar el tipo de categoría.
   * 
   * Realiza una petición al servicio `complimentosService` para obtener los datos correspondientes
   * y los asigna a la propiedad `TipCategoriaCatalogo`. La suscripción se gestiona para finalizar
   * automáticamente cuando el componente se destruye.
   */
  obtenerTipCategoria(cveEnum: string): void {
    this.complimentosService.getTipCategoria(cveEnum).pipe(takeUntil(this.destroyNotifier$)).subscribe((res) => {
      this.TipCategoriaCatalogo = res.datos
    });
  }

  /**
  * Abre el modal para la carga de datos por archivo.
  * Establece la propiedad `mostrarCargaPorArchivoModal` en `true` para mostrar el modal correspondiente.
  */
  abrirCargaPorArchivo(): void {
    this.mostrarCargaPorArchivoModal = true;
  }

  /**
   * Abre el popup para la carga de proveedores y clientes.
   * 
   * Si no se han seleccionado datos de importación (`datosImportacionSeleccionados` es falsy),
   * muestra una notificación de alerta indicando que se deben ingresar primero
   * las fracciones del producto y la mercancía.
   * 
   * Si los datos están presentes, establece `mostrarProveedorClientesPopup` en `true`
   * para mostrar el popup correspondiente.
   */
  abrirCargaProveedoresClientesPopup(): void {
    //this.mostrarProveedorClientesPopup = false;
    this.nuevaUnoNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe ingresar las fracciones del producto y de la mercancia previamente.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

  }

  /**
    * Maneja la acción de aceptar la carga por archivo.
    * 
    * Cierra el modal de carga por archivo (`mostrarCargaPorArchivoModal`)
    * y abre el popup para la carga de fracciones (`mostrarCargaDeFraccionesPopup`).
    */
  onAceptarCargaPorArchivo(): void {
    this.mostrarCargaPorArchivoModal = false;
    this.mostrarCargaDeFraccionesPopup = true;
  }

  /**
   * Maneja la acción de cancelar la carga por archivo.
   * 
   * Cierra el modal de carga por archivo estableciendo `mostrarCargaPorArchivoModal` en `false`.
  */
  onCancelarCargaPorArchivo(): void {
    this.mostrarCargaPorArchivoModal = false;
  }

  /**
   * Cierra el popup de carga de fracciones.
   * 
   * Establece `mostrarCargaDeFraccionesPopup` en `false` para ocultar el popup correspondiente.
   */
  cerrarCargaDeFracciones(): void {
    this.mostrarCargaDeFraccionesPopup = false;
  }

  /**
   * Cierra el popup de proveedores y clientes.
   * 
   * Establece `mostrarProveedorClientesPopup` en `false` para ocultar el popup correspondiente.
   */
  cerrarProveedorClientesPopup(): void {
    this.mostrarProveedorClientesPopup = false;
  }


  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos notificando a los observables que deben finalizar suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


}
