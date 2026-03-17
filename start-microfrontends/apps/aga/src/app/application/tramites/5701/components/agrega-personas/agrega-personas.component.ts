import {
  ADV_MAXIMO_PERSONAS,
  ERR_BUSQUEDA_GAFETE_SIN_RESULTADOS,
  ERR_CAMPOS_OBLIGATORIOS,
  ERR_INPUT_BUSQUEDA_VACIO,
  MSJ_ERROR_GAFETE_EXISTE,
} from '../../../../core/enums/5701/mensajes-modal-5701.enum';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ConfiguracionColumna,
  MSG_DATOS_GUARDADOS,
  MSG_ELIMINA_ELEMENTO,
  MSG_SELECCIONA_REGISTRO,
  Notificacion,
  NotificacionesComponent,
  SoloLetrasNumerosDirective,
  TITULO_MODAL_AVISO,
  TablaDinamicaComponent,
  TablaSeleccion,
  UppercaseDirective,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud5701State,
  Tramite5701Store,
} from '../../../../core/estados/tramites/tramite5701.store';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { CONFIGURACION_ENCABEZADO_TABLA_RESPONSABLES_DESPACHO } from '../../../../core/enums/5701/responsables-despacho.enum';
import { CommonModule } from '@angular/common';
import { ConsultaResponsableService } from '../../../../core/services/5701/consulta-responsable.service';
import { ResponsablesDespacho } from '../../../../core/models/5701/tramite5701.model';
import { TIPO_GAFETE } from '../../../../constantes/5701/constantes-tramite';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';

/**
 * Componente para agregar personas responsables de despacho en un formulario.
 */
@Component({
  selector: 'agrega-personas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UppercaseDirective,
    NotificacionesComponent,
    TablaDinamicaComponent,
    SoloLetrasNumerosDirective,
  ],
  templateUrl: './agrega-personas.component.html',
  styleUrl: './agrega-personas.component.scss',
})
/**
 * Este componente permite agregar personas responsables de despacho a un formulario.
 * Incluye funcionalidades para buscar responsables por gafete, agregar nuevos responsables,
 */
export class AgregaPersonasComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Lista de personas responsables de despacho seleccionadas.
   * Esta propiedad se utiliza para mostrar los responsables de despacho que ya han sido seleccionados.
   */
  @Input() personasResponsablesDespachoSeleccionados: ResponsablesDespacho[] =
    [];

    /**
     * Indica si el formulario está deshabilitado.
     */
  @Input() isDisabled?: boolean = false;

  /**
   * Emite un evento cuando la lista de responsables de despacho cambia.
   * Este evento se utiliza para notificar a otros componentes que la lista de responsables ha sido
   */
  @Output() responsablesDespachoChange: EventEmitter<ResponsablesDespacho[]> =
    new EventEmitter<ResponsablesDespacho[]>();

  /**
   * Flag para mostrar el mensaje de error desde el padre.
   */
  @Input() mostrarMensajeError?: boolean = false;

  /**
   * Configuración de la tabla de responsables del despacho.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * Encabezado de la tabla de responsables del despacho.
   */
  encabezadoDeTablaResponsablesDespacho: ConfiguracionColumna<ResponsablesDespacho>[] =
    CONFIGURACION_ENCABEZADO_TABLA_RESPONSABLES_DESPACHO;

  /**
   * Campo de formulario para el gafete del responsable de despacho.
   */
  gafeteRespoDespacho: FormControl = new FormControl('', [
    Validators.maxLength(25),
  ]);

  /**
   * Formulario reactivo que contiene los campos de nombre, primer apellido y segundo apellido del responsable de despacho.
   * Los campos están inicialmente deshabilitados.
   * Se utilizan validaciones para asegurarse de que los campos sean obligatorios y no excedan una longitud máxima de 30 caracteres.
   */
  personaForm: FormGroup = this.fb.group({
    nombreRespoDespacho: [{ value: '', disabled: true }],
    paternoRespoDespacho: [{ value: '', disabled: true }],
    maternoRespoDespacho: [{ value: '', disabled: true }],
  });

  /**
   * Objeto que representa a una persona responsable de despacho.
   * Se inicializa como un objeto vacío y se espera que contenga los datos del responsable de despacho.
   */
  persona!: ResponsablesDespacho;

  /**
   * Lista de personas responsables de despacho.
   * Se inicializa como un arreglo vacío y se espera que contenga múltiples objetos de tipo ResponsablesDespacho.
   */
  personas: ResponsablesDespacho[] = [];

  /**
   * Estado de la solicitud 5701.
   */
  public solicitudState!: Solicitud5701State;

  /**
   * Subject que se utiliza para notificar la destrucción del componente.
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   *
   * Arreglo para almacenar los terceros seleccionados.
   */
  responsableSeleccionado: ResponsablesDespacho[] = [];

  /**
   *
   * Clase para indicar si el formulario es inválido.
   */
  claseFormaNovalida = false;

  /**
   * Flag para rastrear si el usuario ha interactuado con el formulario.
   * Se utiliza para mostrar mensajes de validación solo después de la interacción del usuario.
   */
  public userHasInteracted = false;

  /**
   * Constructor del componente `AgregaPersonasComponent`.
   * Se inyectan los servicios necesarios para la funcionalidad del componente.
   *   fb
   *   validacionesService
   *   tramite5701Query
   *   tramite5701Store
   *   consultaResponsableService
   */
  constructor(
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private tramite5701Query: Tramite5701Query,
    private tramite5701Store: Tramite5701Store,
    private consultaResponsableService: ConsultaResponsableService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al observable `selectSolicitud$` del `tramite5701Query
   */
  ngOnInit(): void {
    this.tramite5701Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.solicitudState = state;
        })
      )
      .subscribe();

    if (this.solicitudState.personasResponsablesDespacho.length > 0) {
      this.personas = this.solicitudState.personasResponsablesDespacho;
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando se detectan cambios en las propiedades de entrada del componente.
   * changes : SimpleChanges - Objeto que contiene los cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['personasResponsablesDespachoSeleccionados'] &&
      changes['personasResponsablesDespachoSeleccionados'].currentValue
    ) {
      this.personas = [
        ...changes['personasResponsablesDespachoSeleccionados'].currentValue,
      ];
    }
    
    // Forzar actualización de la tabla cuando cambian las personas
    if (changes['personasResponsablesDespachoSeleccionados']) {
      const currentValue = changes['personasResponsablesDespachoSeleccionados'].currentValue;
      if (currentValue && Array.isArray(currentValue)) {
        this.personas = [...currentValue];
      }
    }
  }

  /**
   * Verifica si un campo específico en el formulario de persona es válido.
   *
   *   {string} field - El nombre del campo a validar.
   * {boolean | null} - Devuelve `true` si el campo es válido, `false` si no lo es,
   * o `null` si no se puede determinar la validez.
   */
  isValid(field: string): boolean | null | undefined {
    const CONTROL = this.personaForm.get(field);
    return CONTROL ? Boolean(CONTROL.errors) && CONTROL.touched : null;
  }

  /**
   * Verifica si el gafete es válido.
   *
   * {boolean | null} - Devuelve `true` si el gafete tiene errores y ha sido tocado,
   *                             `false` si no tiene errores o no ha sido tocado,
   *                             o `null` si no se puede determinar.
   */
  get gafeteIsValid(): boolean | null {
    return this.gafeteRespoDespacho.errors && this.gafeteRespoDespacho.touched;
  }

  /**
   * Busca un gafete en un endpoint y maneja los resultados de la búsqueda.
   *
   * - Si el valor del gafete está vacío, muestra un modal con un mensaje de error.
   * - Si no se encuentra una persona asociada al gafete, muestra un modal con un mensaje de error y habilita los campos del formulario.
   */
  buscarGafete(): void {
    this.mostrarMensajeError = true;
    const GAFETE = this.gafeteRespoDespacho.value;

    if (!GAFETE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: ERR_INPUT_BUSQUEDA_VACIO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };

      return;
    }

    this.consultaResponsableService
      .getGafeteResponsable(GAFETE, TIPO_GAFETE)
      .pipe(
        tap((response) => {
          if (response.datos) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { nombre, apellido_paterno, apellido_materno } =
              response.datos;

            this.personaForm.get('nombreRespoDespacho')?.enable();
            this.personaForm.get('nombreRespoDespacho')?.setValue(nombre);
            this.personaForm.get('nombreRespoDespacho')?.disable();

            this.personaForm.get('paternoRespoDespacho')?.enable();
            this.personaForm
              .get('paternoRespoDespacho')
              ?.setValue(apellido_paterno);
            this.personaForm.get('paternoRespoDespacho')?.disable();

            this.personaForm.get('maternoRespoDespacho')?.enable();
            this.personaForm
              .get('maternoRespoDespacho')
              ?.setValue(apellido_materno);
            this.personaForm.get('maternoRespoDespacho')?.disable();
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: '',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: ERR_BUSQUEDA_GAFETE_SIN_RESULTADOS,
              cerrar: false,
              txtBtnAceptar: 'Cerrar',
              txtBtnCancelar: '',
            };

            this.habilitarCamposFormulario();
            this.personaForm.reset();
          }
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Habilita todos los campos del formulario `personaForm`.
   *
   * Recorre cada uno de los controles del formulario y les aplica las siguientes configuraciones:
   * - Habilita el control.
   * - Establece los validadores `Validators.required` y `Validators.maxLength(30)`.
   * - Actualiza el estado y la validez del control.
   */
  habilitarCamposFormulario(): void {
    Object.keys(this.personaForm.controls).forEach((campo) => {
      const CONTROL = this.personaForm.get(campo);
      CONTROL?.enable();
      CONTROL?.setValidators([Validators.required, Validators.maxLength(30)]);
      CONTROL?.updateValueAndValidity();
    });
  }

  /**
   * Agrega una persona a la lista de personas.
   *
   * - Valida que el campo 'gafete' y el formulario 'personaForm' sean válidos.
   * - Si alguno de los campos es inválido, muestra un modal con un mensaje de error y marca todos los campos como tocados.
   * - Si ya hay 5 personas en la lista, muestra un modal con un mensaje de advertencia.
   * - Si todas las validaciones pasan, crea un objeto 'responsable' con los datos del formulario y lo agrega a la lista de personas.
   * - Resetea el campo 'gafete' y el formulario 'personaForm' después de agregar la persona.
   */
  agregarPersona(): void {
    this.userHasInteracted = true;
    this.mostrarMensajeError = true;
    this.gafeteRespoDespacho.setValidators([
      Validators.required,
      Validators.maxLength(25),
    ]);
    this.gafeteRespoDespacho.updateValueAndValidity();

    const DATOS_RESPONSABLE = this.personaForm.getRawValue();
    const ES_VALIDO_RESPONSABLE = Object.values({
      nombreRespoDespacho: DATOS_RESPONSABLE.nombreRespoDespacho,
      paternoRespoDespacho: DATOS_RESPONSABLE.paternoRespoDespacho,
      maternoRespoDespacho: DATOS_RESPONSABLE.maternoRespoDespacho,
    }).some((valor) => valor !== null && valor !== undefined && valor !== '');

    if (this.gafeteRespoDespacho.invalid) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: ERR_CAMPOS_OBLIGATORIOS,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };

      this.gafeteRespoDespacho.markAllAsTouched();
      this.personaForm.setErrors({ required: true });
      this.claseFormaNovalida = true;

      return;
    }

    if (this.personaForm.invalid || !ES_VALIDO_RESPONSABLE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: ERR_CAMPOS_OBLIGATORIOS,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      this.personaForm.markAllAsTouched();
      return;
    }

    if (this.personas.length >= 5) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: ADV_MAXIMO_PERSONAS,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    let responsable: ResponsablesDespacho | null = {
      gafeteRespoDespacho: this.gafeteRespoDespacho.value,
      nombre: this.personaForm.get('nombreRespoDespacho')?.getRawValue(),
      primerApellido: this.personaForm
        .get('paternoRespoDespacho')
        ?.getRawValue(),
      segundoApellido: this.personaForm
        .get('maternoRespoDespacho')
        ?.getRawValue(),
    };

    const EXISTE_RESPONSABLE = this.personas.some(
      (persona) =>
        persona.gafeteRespoDespacho === this.gafeteRespoDespacho.value
    );

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: EXISTE_RESPONSABLE
        ? MSJ_ERROR_GAFETE_EXISTE
        : MSG_DATOS_GUARDADOS,
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    };

    if (responsable !== null && !EXISTE_RESPONSABLE) {
      this.personas.push(responsable);
      this.tramite5701Store.setPersonasResponsablesDespacho(this.personas);
      this.responsablesDespachoChange.emit(this.personas);

      // Only reset form fields when person is successfully added
      this.gafeteRespoDespacho.setValue('');
      responsable = null;
      this.gafeteRespoDespacho.reset();
      this.claseFormaNovalida = false;
      this.personaForm.get('nombreRespoDespacho')?.disable();
      this.personaForm.get('paternoRespoDespacho')?.disable();
      this.personaForm.get('maternoRespoDespacho')?.disable();
      this.personaForm.reset();
    }
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   *   {FormGroup} form - El formulario del cual se obtiene el valor.
   *   {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   *   {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite5701Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite5701Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Elimina los terceros seleccionados del arreglo `personas`.
   * Si no hay terceros seleccionados, muestra una notificación de aviso.
   */
  eliminarResponsables(): void {
    if (this.responsableSeleccionado.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_SELECCIONA_REGISTRO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    this.personas = this.personas.filter(
      (persona) =>
        !this.responsableSeleccionado.some(
          (seleccionado) =>
            seleccionado.gafeteRespoDespacho === persona.gafeteRespoDespacho
        )
    );

    this.tramite5701Store.setPersonasResponsablesDespacho(this.personas);

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: MSG_ELIMINA_ELEMENTO,
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    };
    this.responsablesDespachoChange.emit(this.personas);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Notifica y completa el observable `destroyNotifier$` para limpiar suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
