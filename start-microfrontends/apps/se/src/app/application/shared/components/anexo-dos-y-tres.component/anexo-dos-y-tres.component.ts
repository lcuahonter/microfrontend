import { AlertComponent, Notificacion, NotificacionesComponent } from '@ng-mf/data-access-user';
import { Anexo1y3Configuartion, DatosAnexotressUno } from '../../models/nuevo-programa-industrial.model';
import { Component, OnInit } from '@angular/core';
import { OnChanges, Output } from '@angular/core';
import { Subject, delay, takeUntil } from 'rxjs';
import { ANEXO_TRES_ALERTA } from '../../constantes/anexo-dos-y-tres.enum';
import { AnexoEncabezado } from '../../models/nuevo-programa-industrial.model';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-anexo-dos-y-tres',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    AlertComponent,
    NotificacionesComponent
  ],
  templateUrl: './anexo-dos-y-tres.component.html',
  styleUrl: './anexo-dos-y-tres.component.scss',
})
/**
 * Componente AnexoDosYTresComponent
 */
export class AnexoDosYTresComponent implements OnInit, OnChanges {
  /**
   * Formulario del Anexo Dos
   */
  public anexoDosFormGroup!: FormGroup;

  /**
   * Formulario del Anexo Tres
   */
  public anexoTresFormGroup!: FormGroup;

  /**
   * Lista de anexos
   */
  public anexoLista = [];

  /**
   * Alerta del Anexo Tres
   */
  public anexoTresAlerta = ANEXO_TRES_ALERTA;

  /**
   * Configuración de Anexo 1 y 3
   */
  @Input() anexo1y3Configuartion!: Anexo1y3Configuartion<AnexoEncabezado>;

  /**
   * Lista de tabla del Anexo Dos
   */
  @Input() anexoDosTablaLista: AnexoEncabezado[] = [];

  /**
   * Lista de tabla del Anexo Tres
   */
  @Input() anexoTresTablaLista: AnexoEncabezado[] = [];

  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Evento para devolver la llamada del Anexo Dos
   */
  @Output() obtenerAnexoDosDevolverLaLlamada: EventEmitter<AnexoEncabezado[]> =
    new EventEmitter<AnexoEncabezado[]>(true);

  /**
   * Evento para devolver la llamada del Anexo Tres
   */
  @Output() obtenerAnexoTresDevolverLaLlamada: EventEmitter<AnexoEncabezado[]> =
    new EventEmitter<AnexoEncabezado[]>(true);


  /**
   * Emite eventos que contienen datos del tipo `DatosAnexotressUno` desde el componente.
   * 
   * Este output puede ser suscrito por componentes padres para recibir actualizaciones
   * siempre que los datos relevantes cambien o se envíen dentro de este componente.
   * Los datos son emitidos cuando hay cambios en el formulario anexoDosFormGroup.
   *
   * @remarks
   * El `EventEmitter` se inicializa con `true` para indicar que es asíncrono.
   * Este evento se dispara con un retraso de 100ms después de cada cambio en el formulario
   * para evitar emisiones excesivas durante cambios rápidos.
   *
   * @example
   * ```html
   * <app-anexo-dos-y-tres
   *   (anexoTressDatos)="manejarDatosAnexo($event)">
   * </app-anexo-dos-y-tres>
   * ```
   * 
   * @see DatosAnexotressUno
   * @see anexoDosFormGroup
   * @eventProperty
   */
  @Output()
  anexoTressDatos: EventEmitter<DatosAnexotressUno> =
    new EventEmitter<DatosAnexotressUno>(true);

  @Output()
  anexoTressDatosDos: EventEmitter<DatosAnexotressUno> =
    new EventEmitter<DatosAnexotressUno>(true);

  /**
   * Emite eventos para realizar llamadas a la API del anexo tres.
   * Contiene los datos de la fracción y un callback para manejar la respuesta.
   */
  @Output() anexoTresApiCall = new EventEmitter<{
    fraccion: string,
    descripcion: string,
    callback: (success: boolean, data: DatosAnexotressUno) => void
  }>();

  /**
   * Emite eventos para realizar llamadas a la API del anexo tres.
   * Contiene los datos de la fracción y un callback para manejar la respuesta.
   */
  @Output() anexoDosApiCall = new EventEmitter<{
    fraccion: string,
    descripcion: string,
    callback: (success: boolean, data: DatosAnexotressUno) => void
  }>();

  /**
   * Establece el formulario de datos del subcontratista.
   * @param valor - Formulario reactivo con los datos del subcontratista.
   */
  @Input()
  set formularioDatosSubcontratista(valor: FormGroup) {
    this.anexoDosFormGroup.setValue(valor.value);
  }

  /**
   * Obtiene el formulario de datos del subcontratista.
   * @returns Formulario reactivo con los datos del subcontratista.
   */
  get formularioDatosSubcontratista(): FormGroup {
    return this.anexoDosFormGroup;
  }

  /**
   * Establece el formulario de datos del subcontratista.
   * @param valor - Formulario reactivo con los datos del subcontratista.
   */
  @Input()
  set formularioDatosDosSubcontratista(valor: FormGroup) {
    this.anexoTresFormGroup.setValue(valor.value);
  }

  /**
   * Obtiene el formulario de datos del subcontratista.
   * @returns Formulario reactivo con los datos del subcontratista.
   */
  get formularioDatosDosSubcontratista(): FormGroup {
    return this.anexoTresFormGroup;
  }
  /**
* Notificador utilizado para manejar la destrucción o desuscripción de observables.
* Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
*
* @property {Subject<void>} destroyNotifier$
*/
  private destroyNotifier$: Subject<void> = new Subject();

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
  public nuevaTresNotificacion!: Notificacion;

  /**
   * @description
   * Objeto que representa una notificación de validación para campos requeridos.
   * Se utiliza para mostrar mensajes cuando no se proporcionan la fracción y descripción.
   */
  public NotValidRfcNotificacion!: Notificacion;

  /** Inventarios seleccionados por el usuario */
  public seleccionarDosTablaData: AnexoEncabezado[] = [] as AnexoEncabezado[];

  /** Inventarios seleccionados por el usuario */
  public seleccionarTresTablaData: AnexoEncabezado[] = [] as AnexoEncabezado[];

  /**
   * Constructor del componente
   * @param fb FormBuilder para crear formularios
   */
  constructor(
    private fb: FormBuilder,
    private servicioDeFormularioService: ServicioDeFormularioService,
  ) {
    this.crearFormularioAnexoDos();
    this.crearFormularioAnexoTres();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Si el formulario está deshabilitado (`formularioDeshabilitado` es verdadero),
   * deshabilita los grupos de formularios `anexoDosFormGroup` y `anexoTresFormGroup`.
   */
  ngOnInit(): void {
    if (this.formularioDeshabilitado) {
      this.anexoDosFormGroup.disable();
      this.anexoTresFormGroup.disable();
    }

    this.anexoDosFormGroup.valueChanges
      .pipe(delay(100))
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((_) => {
        this.anexoTressDatos.emit(this.anexoDosFormGroup.value);
      });
    this.anexoTresFormGroup.valueChanges
      .pipe(delay(100))
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((_) => {
        this.anexoTressDatosDos.emit(this.anexoTresFormGroup.value);
      });
  }

  /** Sincroniza los datos de las tablas de Anexo Dos y Tres con el servicio de formularios al detectar cambios. */
  ngOnChanges(): void {
    if (this.anexoDosTablaLista.length === 0) {
      this.servicioDeFormularioService.registerArray('anexoDosTablaLista', this.anexoDosTablaLista);
    } else {
      this.servicioDeFormularioService.setArray('anexoDosTablaLista', this.anexoDosTablaLista);
    }

    if (this.anexoTresTablaLista.length === 0) {
      this.servicioDeFormularioService.registerArray('anexoTresTablaLista', this.anexoTresTablaLista);
    } else {
      this.servicioDeFormularioService.setArray('anexoTresTablaLista', this.anexoTresTablaLista);
    }
  }

  /**
   * Crea el formulario del Anexo Dos
   */
  crearFormularioAnexoDos(): void {
    this.anexoDosFormGroup = this.fb.group({
      fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  /**
   * Crea el formulario del Anexo Tres
   */
  crearFormularioAnexoTres(): void {
    this.anexoTresFormGroup = this.fb.group({
      fraccionArancelaria: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  /**
   * Elimina elementos del Anexo Dos que no tienen estatus
   */
  eliminarAnexoDos(): void {
    // Si hay elementos seleccionados, mostrar popup de confirmación
    if (this.seleccionarDosTablaData.length > 0) {
      // Si el popup no está abierto, abrirlo
      if (!this.nuevaDosNotificacion || !this.nuevaDosNotificacion.cerrar) {
        this.abrirDosModal();
        return;
      }
    }
    else {
      this.abrirDosModal();
      return;
    }

    // Proceder con la eliminación
    this.anexoDosTablaLista = this.anexoDosTablaLista.filter((idx) => {
      return !idx.estatus;
    });

    if (this.nuevaDosNotificacion) {
      this.nuevaDosNotificacion.cerrar = false;
    }

    if (this.seleccionarDosTablaData.length > 0) {
      this.anexoDosTablaLista = this.anexoDosTablaLista.filter(item => {
        return !this.seleccionarDosTablaData.some(selectedItem =>
          selectedItem.encabezadoFraccion === item.encabezadoFraccion &&
          selectedItem.encabezadoDescripcion === item.encabezadoDescripcion
        );
      });

      this.seleccionarDosTablaData = [];
      this.obtenerAnexoDosDevolverLaLlamada.emit(this.anexoDosTablaLista);
    }
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
      mensaje: this.seleccionarDosTablaData.length > 0 ? '¿Está seguro de eliminar el registro de los anexos?' : 'Seleccione el anexo que desea eliminar.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: this.seleccionarDosTablaData.length > 0 ? 'Cancelar' : '',
    };
  }

  /**
   * Agrega un nuevo elemento al Anexo Dos
   */
  agregarAnexoDos(): void {
    const OBJECTO_IDX: AnexoEncabezado = {
      encabezadoFraccion: this.anexoDosFormGroup.get('fraccionArancelaria')
        ?.value,
      encabezadoDescripcion: this.anexoDosFormGroup.get('descripcion')?.value?.toUpperCase() || '',
      estatus: false,
    };
    
    // Validar campos vacíos
    if (OBJECTO_IDX.encabezadoFraccion.trim() === '' || OBJECTO_IDX.encabezadoDescripcion.trim() === '') {
      this.showValidationNotification();
      return; // No agregar si los campos están vacíos
    }
    
    // Validar formato de fracción arancelaria (solo números y puntos, sin caracteres especiales)
    const FRACCION_PATTERN = /^[0-9]{8}$/;
    if (!FRACCION_PATTERN.test(OBJECTO_IDX.encabezadoFraccion.trim())) {
      this.showInvalidFraccionNotification();
      return; // No agregar si la fracción tiene formato inválido
    }

    // Validar si la fracción arancelaria ya existe en la tabla
    const FRACCION_EXISTENTE = this.anexoDosTablaLista.some(item => 
      item.encabezadoFraccion?.trim() === OBJECTO_IDX.encabezadoFraccion.trim()
    );
    
    if (FRACCION_EXISTENTE) {
      this.showDuplicateFraccionNotification();
      return; // No agregar si ya existe la fracción
    }

    this.anexoDosApiCall.emit({
      fraccion: OBJECTO_IDX.encabezadoFraccion,
      descripcion: OBJECTO_IDX.encabezadoDescripcion,
      callback: (success: boolean) => {
        if (success) {
          const NUEVO_ITEM: AnexoEncabezado = {
            encabezadoFraccion: OBJECTO_IDX.encabezadoFraccion,
            encabezadoDescripcion: OBJECTO_IDX.encabezadoDescripcion,
            estatus: false,
          };
          this.anexoDosTablaLista = [...this.anexoDosTablaLista, NUEVO_ITEM];
          this.obtenerAnexoDosDevolverLaLlamada.emit(this.anexoDosTablaLista);
          this.anexoDosFormGroup.reset();
        } else {
          this.showInvalidFraccionNotification();
        }
      }
    });
    this.anexoDosFormGroup.reset();
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
  abrirTresModal(): void {
    this.nuevaTresNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        this.seleccionarTresTablaData.length > 0 ? '¿Está seguro de eliminar el registro de los anexos?' : 'Seleccione el registro que desea eliminar.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: this.seleccionarTresTablaData.length > 0 ? ' Cancelar' : '',
    };
  }

  /**
   * Elimina elementos del Anexo Tres que no tienen estatus
   */
  eliminarAnexoTres(): void {
    // Si hay elementos seleccionados, mostrar popup de confirmación
    if (this.seleccionarTresTablaData.length > 0) {
      // Si el popup no está abierto, abrirlo
      if (!this.nuevaTresNotificacion || !this.nuevaTresNotificacion.cerrar) {
        this.abrirTresModal();
        return;
      }
    }
    else if (this.seleccionarTresTablaData.length === 0) {
      this.abrirTresModal();
      return;
    }

    // Proceder con la eliminación
    this.anexoTresTablaLista = this.anexoTresTablaLista.filter((idx) => {
      return !idx.estatus;
    });

    if (this.nuevaTresNotificacion) {
      this.nuevaTresNotificacion.cerrar = false;
    }

    if (this.seleccionarTresTablaData.length > 0) {
      this.anexoTresTablaLista = this.anexoTresTablaLista.filter(item => {
        return !this.seleccionarTresTablaData.some(selectedItem =>
          selectedItem.encabezadoFraccion === item.encabezadoFraccion &&
          selectedItem.encabezadoDescripcion === item.encabezadoDescripcion
        );
      });

      this.seleccionarTresTablaData = [];
      this.obtenerAnexoTresDevolverLaLlamada.emit(this.anexoTresTablaLista);
    }

    this.anexoTresTablaLista = this.anexoTresTablaLista.filter((idx) => {
      return !idx.estatus;
    });
    this.obtenerAnexoTresDevolverLaLlamada.emit(this.anexoTresTablaLista);
  }

  /**
   * Agrega un nuevo elemento al Anexo Tres
   */
  agregarAnexoTres(): void {
    const FRACCION = this.anexoTresFormGroup.get('fraccionArancelaria')?.value;
    const DESCRIPCION = this.anexoTresFormGroup.get('descripcion')?.value?.toUpperCase() || '';

    if (FRACCION.trim() === '' || DESCRIPCION.trim() === '') {
      this.showValidationNotification();
      return;
    }

    const FRACCION_PATTERN = /^[0-9]{8}$/;
    if (!FRACCION_PATTERN.test(FRACCION.trim())) {
      this.showInvalidFraccionNotification();
      return;
    }

    // Validar si la fracción arancelaria ya existe en la tabla
    const FRACCION_EXISTENTE = this.anexoTresTablaLista.some(item => 
      item.encabezadoFraccion?.trim() === FRACCION.trim()
    );
    
    if (FRACCION_EXISTENTE) {
      this.showDuplicateFraccionNotification();
      return; // No agregar si ya existe la fracción
    }

    this.anexoTresApiCall.emit({
      fraccion: FRACCION,
      descripcion: DESCRIPCION,
      callback: (success: boolean) => {
        if (success) {
          const OBJECTO_IDX: AnexoEncabezado = {
            encabezadoFraccion: FRACCION,
            encabezadoDescripcion: DESCRIPCION,
            estatus: false,
          };
          this.anexoTresTablaLista = [...this.anexoTresTablaLista, OBJECTO_IDX];
          this.obtenerAnexoTresDevolverLaLlamada.emit(this.anexoTresTablaLista);
          this.anexoTresFormGroup.reset();
        } else {
          this.showInvalidFraccionNotification();
        }
      }
    });
  }

  /**
   * Establece la lista del Anexo Dos
   * @param event Lista de encabezados del Anexo Dos
   */
  setAnexoDosLista(event: AnexoEncabezado[]): void {
    this.seleccionarDosTablaData = event;
    this.obtenerAnexoDosDevolverLaLlamada.emit(this.anexoDosTablaLista);
  }

  /**
   * Establece la lista del Anexo Tres
   * @param event Lista de encabezados del Anexo Tres
   */
  setAnexoTresLista(event: AnexoEncabezado[]): void {
    this.seleccionarTresTablaData = event;
    this.obtenerAnexoTresDevolverLaLlamada.emit(this.anexoTresTablaLista);
  }

  /**
   * Convierte el texto a mayúsculas en tiempo real
   * @param event Evento del input
   * @param formulario Tipo de formulario ('anexoDos' o 'anexoTres')
   */
  convertirAMayusculas(event: Event, formulario: 'anexoDos' | 'anexoTres'): void {
    const TARGET = event.target as HTMLTextAreaElement;
    const VALORMAYUSCULA = TARGET.value.toUpperCase();

    if (formulario === 'anexoDos') {
      this.anexoDosFormGroup.get('descripcion')?.setValue(VALORMAYUSCULA, { emitEvent: false });
    } else if (formulario === 'anexoTres') {
      this.anexoTresFormGroup.get('descripcion')?.setValue(VALORMAYUSCULA, { emitEvent: false });
    }

    // Mantener la posición del cursor
    const CURSORPOSITION = TARGET.selectionStart;
    setTimeout(() => {
      TARGET.setSelectionRange(CURSORPOSITION, CURSORPOSITION);
    });
  }

  /**
   * Confirma la eliminación del Anexo Dos después de la confirmación del modal
   */
  confirmarEliminacionDos(confirmado: boolean): void {
    // Cerrar el modal
    this.nuevaDosNotificacion.cerrar = false;

    // Proceder con la eliminación
    if (confirmado && this.seleccionarDosTablaData.length > 0) {
      this.anexoDosTablaLista = this.anexoDosTablaLista.filter(item => {
        return !this.seleccionarDosTablaData.some(selectedItem =>
          selectedItem.encabezadoFraccion === item.encabezadoFraccion &&
          selectedItem.encabezadoDescripcion === item.encabezadoDescripcion
        );
      });

      this.seleccionarDosTablaData = [];
      this.obtenerAnexoDosDevolverLaLlamada.emit(this.anexoDosTablaLista);
    }
  }

  /**
   * Confirma la eliminación del Anexo Tres después de la confirmación del modal
   */
  confirmarEliminacionTres(confirmado: boolean): void {
    // Cerrar el modal
    this.nuevaTresNotificacion.cerrar = false;
    if (confirmado) {
      // Proceder con la eliminación
      if (this.seleccionarTresTablaData.length > 0) {
        this.anexoTresTablaLista = this.anexoTresTablaLista.filter(item => {
          return !this.seleccionarTresTablaData.some(selectedItem =>
            selectedItem.encabezadoFraccion === item.encabezadoFraccion &&
            selectedItem.encabezadoDescripcion === item.encabezadoDescripcion
          );
        });

        this.seleccionarTresTablaData = [];
        this.obtenerAnexoTresDevolverLaLlamada.emit(this.anexoTresTablaLista);
      }
    }
  }

  /**
   * Muestra una notificación de validación cuando no se proporcionan la fracción y la descripción.
   * 
   * La notificación es de tipo "alerta" y categoría "peligro", con modo de acción. 
   * El mensaje indica que debe proporcionar la fracción y la descripción.
   */
  showValidationNotification(): void {
    this.NotValidRfcNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe proporcionar la fraación y la descripción.',
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Muestra una notificación cuando la fracción arancelaria tiene un formato inválido.
   * 
   * La notificación es de tipo "alerta" y categoría "peligro", con modo de acción. 
   * El mensaje indica que la fracción arancelaria no es válida o no está vigente.
   */
  showInvalidFraccionNotification(): void {
    this.NotValidRfcNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'La fracción arancelaria no es válida o no está vigente',
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra una notificación cuando la fracción arancelaria ya existe en la lista.
   * 
   * La notificación es de tipo "alerta" y categoría "peligro", con modo de acción. 
   * El mensaje indica que la fracción arancelaria que desea agregar a la lista ya existe.
   */
  showDuplicateFraccionNotification(): void {
    this.NotValidRfcNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El registro que intenta agregar ya se encuentra agregado',
      cerrar: true,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}
