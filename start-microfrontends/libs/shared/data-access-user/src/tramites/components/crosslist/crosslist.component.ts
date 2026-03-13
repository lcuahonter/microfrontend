import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Notificacion,
  NotificacionesComponent,
} from '../notificaciones/notificaciones.component';
import { CommonModule } from '@angular/common';
/**
 * Interfaz que representa las etiquetas de la lista cruzada.
 *
 * @property {string} tituluDeLaIzquierda - El título de la izquierda.
 * @property {string} derecha - El valor de la derecha.
 * @property {boolean} showUnoTitulo - Indica si se muestra el primer título.
 * @property {boolean} showDosTitulo - Indica si se muestra el segundo título.
 */
export interface CrossListLable {
  tituluDeLaIzquierda: string;
  derecha: string;
  showUnoTitulo?: boolean;
  showDosTitulo?: boolean;
}

/**
 * Tipos predefinidos para los botones en el componente Crosslist.
 * 
 * - 'default': Configuración predeterminada del botón.
 * - 'cambiar': Configuración para el botón de cambio.
 */
export type CrosslistButtonPreset = 'default' | 'cambiar';

@Component({
  selector: 'crosslist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './crosslist.component.html',
  styleUrl: './crosslist.component.scss',
  host: {},
})
export class CrosslistComponent implements OnInit, OnChanges {

  /**
   * Preset de configuración para los botones del componente Crosslist.
   * 
   * Este input permite especificar un conjunto predefinido de botones que se mostrarán en el componente.
   * Si es `null`, se utilizará la configuración por defecto.
   *
   * @type {CrosslistButtonPreset | null}
   */
  @Input() buttonPreset: CrosslistButtonPreset | null = null;

  /**
   * @description Boton de búsqueda que se mostrará en el componente.
   */
  @Input() botonField:
    | { btnNombre: string; class: string; funcion?: () => void }[]
    | null = null;

  /**
   * @description Lista de botones que se mostrarán en el componente.
   */
  @Input() botones:
    | { btnNombre: string; class: string; funcion?: () => void }[]
    | null = null;

  /**
   * @description Etiquetas que se mostrarán en el componente.
   */
  @Input() label: CrossListLable | undefined;

  /**
   * @description Indica si debe mostrar el inpit de buqueda del lado izquierdo
   */
  @Input() showSearchInput1: boolean = false;

  /**
   * @description Indica si debe mostrar el inpit de buqueda del lado derecho
   */
  @Input() showSearchInput2: boolean = false;

  /** Etiqueta para el campo de búsqueda del lado izquierdo de la lista cruzada. */
  @Input() searchInput1Label: string = 'País disponible';

  /** Etiqueta para el campo de búsqueda del lado derecho de la lista cruzada. */
  @Input() searchInput2Label: string = 'País seleccionado';

  /** Indica si se debe mostrar el placeholder en los campos de búsqueda de la lista cruzada. */
  @Input() showSearchPlaceholder: boolean = true;

  /**
   * @description Indica si el campo es requerido y debe mostrar el asterisco rojo cuando hay errores de validación.
   */
  @Input() required: boolean = false;

  /**
   * @description Mensaje de alerta que se mostrará cuando no se seleccione un item de la lista.
   */
  @Input() mensajeAlerta!: string;

  /**
   * @description Evento que se emite cuando las fechas seleccionadas cambian.
   */
  @Output() fechasSeleccionadasChange = new EventEmitter<string[]>();

  /**
   * @description Evento que se emite cuando las fechas seleccionadas cambian.
   */
  @Output() fechasSeleccionadasIdChange = new EventEmitter<string[]>();

  /**
   * @description Lista de fechas seleccionadas.
   */
  @Input() fechasSeleccionadas: string[] = [];

  /**
   * @description Lista de fechas que se mostrarán en el componente.
   */
  @Input() fechas: string[] = [];
  /**
   * Bandera para indicar si el control debe estar deshabilitado.
   */
  @Input() isDisabled!: boolean;

  /**
   * @description Control de formulario para la fecha seleccionada.
   */
  fecha: FormControl = new FormControl('');

  /**
   * @description Control de formulario para la fecha seleccionada.
   */
  fechaSeleccionada: FormControl = new FormControl('', [Validators.required]);

  /**
   * @description Lista de fechas que ha sido seleccionas y que se mostrarán en el slect de la derecha.
   */
  fechasDatos: string[] = [];

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si el control debe marcarse como tocado para mostrar errores de validación.
   * Útil para controlar la visualización de errores desde el componente padre.
   *
   * @type {boolean}
   * @default false
   */
  @Input() markTouched: boolean = false;

  /** Indica si se deben mostrar los países seleccionados en la lista cruzada. */
  @Input() mostrarPaisesSeleccionados: boolean = false; 

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * - Verifica si la propiedad `botones` está definida. Si no lo está, llama al método
   *   `setButtonDefault` para establecer un valor predeterminado.
   */
  ngOnInit(): void {
    if (!this.botones) {
      this.setButtonDefault();
    }
  }

  /**
   * @inheritdoc
   * Este método se ejecuta cuando cambian las propiedades de entrada del componente.
   *
   * @param changes - Un objeto de tipo `SimpleChanges` que contiene los cambios en las propiedades de entrada.
   *
   * ### Descripción:
   * - Si la propiedad `fechas` cambia y tiene un valor actual, se actualiza la lista de fechas.
   * - Si `fechasSeleccionadas` no tiene elementos, se asigna la lista completa de fechas a `fechasDatos`.
   * - Si `fechasSeleccionadas` tiene elementos, se filtran las fechas para excluir las seleccionadas y se asignan a `fechasDatos`.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fechas'] && changes['fechas'].currentValue) {
      this.fechas = [...changes['fechas'].currentValue];
      if (
        changes['fechasSeleccionadas'] &&
        changes['fechasSeleccionadas'].currentValue.length === 0
      ) {
        this.fechasDatos = [...this.fechas];
      } else if (
        changes['fechasSeleccionadas'] &&
        changes['fechasSeleccionadas'].currentValue.length > 0
      ) {
        this.fechasSeleccionadas = [
          ...changes['fechasSeleccionadas'].currentValue,
        ];
        this.fechasDatos = this.fechas.filter(
          (fecha) => !this.fechasSeleccionadas.includes(fecha)
        );
      } else {
        this.fechasDatos = [...changes['fechas'].currentValue];
        this.fechasSeleccionadas = [];
      }
    }

    if (changes['isDisabled']) {
      if (this.isDisabled) {
        this.fecha.disable();
        this.fechaSeleccionada.disable();
      } else {
        this.fecha.enable();
        this.fechaSeleccionada.enable();
      }
      this.fecha.updateValueAndValidity({ emitEvent: false });
      this.fechaSeleccionada.updateValueAndValidity({ emitEvent: false });
    }

    if (changes['botones'] && changes['botones'].currentValue) {
      this.botones = changes['botones'].currentValue;
    }

    if (changes['markTouched']) {
      if (this.markTouched) {
        this.fechaSeleccionada?.markAsTouched();
      } else {
        this.fechaSeleccionada?.markAsUntouched();
      }
    }
  }

  /**
   * Configura los botones predeterminados para el componente Crosslist según el valor de `buttonPreset`.
   *
   * - Si `buttonPreset` es `'cambiar'`, configura los botones para agregar y eliminar todos o elementos individuales,
   *   usando estilos de peligro para "Eliminar" y estilos primarios o por defecto para "Agregar".
   * - En caso contrario, aplica el comportamiento por defecto del crosslist, configurando los botones para agregar y quitar elementos,
   *   con estilos de peligro para "Quitar" y estilos primarios o por defecto para "Agregar".
   *
   * Cada objeto de botón incluye:
   * - `btnNombre`: El nombre que se muestra en el botón.
   * - `class`: La clase CSS para el estilo del botón.
   * - `funcion`: La función que se ejecuta al hacer clic en el botón.
   *
   * Este método actualiza la propiedad `botones` con la configuración adecuada.
   */
setButtonDefault(): void {
  // LEGACY / CAMBIAR PRESET
  if (this.buttonPreset === 'cambiar') {
    this.botones = [
      {
        btnNombre: 'Agregar todas',
        class: 'btn-default',
        funcion: (): void => this.agregar('t'),
      },
      {
        btnNombre: 'Agregar',
        class: 'btn-primary',
        funcion: (): void => this.agregar(''),
      },
      {
        btnNombre: 'Eliminar todas',
        class: 'btn-default',
        funcion: (): void => this.quitar('t'),
      },
      {
        btnNombre: 'Eliminar',
        class: 'btn-danger',
        funcion: (): void => this.quitar(''),
      },
    ];
    return;
  }

  // DEFAULT (CURRENT CROSSLIST BEHAVIOR)
  this.botones = [
    {
      btnNombre: 'Agregar',
      class: 'btn-primary',
      funcion: (): void => this.agregar(''),
    },
    {
      btnNombre: 'Agregar todas',
      class: 'btn-default',
      funcion: (): void => this.agregar('t'),
    },
    {
      btnNombre: 'Quitar',
      class: 'btn-danger',
      funcion: (): void => this.quitar(''),
    },
    {
      btnNombre: 'Quitar todas',
      class: 'btn-default',
      funcion: (): void => this.quitar('t'),
    },
  ];
}

  /**
   * Agrega fechas seleccionadas o actualiza las listas de fechas según el tipo especificado.
   *
   * @param type - Un string que indica el tipo de operación a realizar:
   *               - 't': Copia todas las fechas actuales a la lista de fechas seleccionadas y limpia la lista de datos de fechas.
   *               - Cualquier otro valor: Agrega una fecha seleccionada desde la lista de datos de fechas y la elimina de esta última.
   *
   * Este método actualiza las propiedades internas `fechasSeleccionadas` y `fechasDatos`,
   * y sincroniza estos cambios con el estado del `crosslistStore`. Además, emite un evento
   * para notificar los cambios en las fechas seleccionadas.
   */
  agregar(type: string): void {
    this.fecha.markAsTouched();
    this.fechaSeleccionada.markAsTouched();
    
    if (type === 't') {
      this.fechasSeleccionadas = [...this.fechas];
      this.fechasDatos = [];
    } else {
      if (this.fecha.value === '' || this.fecha.value === null) {
        // eslint-disable-next-line no-unused-expressions
        this.mensajeAlerta &&
          (this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: '',
            modo: 'action',
            titulo: 'Aviso',
            mensaje: this.mensajeAlerta,
            cerrar: false,
            txtBtnAceptar: 'Cerrar',
            txtBtnCancelar: '',
          });

        return;
      }

      const FECHA_VALOR = this.fecha.value.map(Number); //Fechas seleccionadas en el select

      const FECHAS_SELECCIONADAS = FECHA_VALOR.map(
        (index: number) => this.fechasDatos[index]
      );

      this.fechasSeleccionadas =
        this.fechasSeleccionadas.length > 0
          ? this.fechasSeleccionadas.concat(FECHAS_SELECCIONADAS)
          : FECHAS_SELECCIONADAS;
      this.fechasDatos = this.fechasDatos.filter(
        (_, index) => !FECHA_VALOR.includes(index)
      );

      this.fecha.setValue('');
    }

    this.fechasSeleccionadasChange.emit(this.fechasSeleccionadas);
  }

  /**
   * Quita elementos de las listas según el tipo especificado.
   *
   * @param type - Tipo de operación ('t' para reiniciar fechas, otro valor para modificar las listas).
   * @returns void
   */
  quitar(type: string = ''): void {
    this.fecha.markAsTouched();
    this.fechaSeleccionada.markAsTouched();
    
    if (type === 't') {
      this.fechasDatos = [...this.fechas];
      this.fechasSeleccionadas = [];
    } else {
      if (
        this.fechaSeleccionada.value === '' ||
        this.fechaSeleccionada.value === null ||
        this.fechaSeleccionada.value === '-1'
      ) {
        // eslint-disable-next-line no-unused-expressions
        this.mensajeAlerta &&
          (this.nuevaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: '',
            modo: 'action',
            titulo: 'Aviso',
            mensaje: this.mensajeAlerta,
            cerrar: false,
            txtBtnAceptar: 'Cerrar',
            txtBtnCancelar: '',
          });
        return;
      }

      const FECHA_VALOR = this.fechaSeleccionada.value.map(Number);

      const FECHAS_SELECCIONADAS = FECHA_VALOR.map(
        (index: number) => this.fechasSeleccionadas[index]
      );

      this.fechasDatos =
        this.fechasDatos.length > 0
          ? this.fechasDatos.concat(FECHAS_SELECCIONADAS)
          : FECHAS_SELECCIONADAS;

      this.fechasSeleccionadas = this.fechasSeleccionadas.filter(
        (_, index) => !FECHA_VALOR.includes(index)
      );

      this.fechaSeleccionada.setValue('-1');
    }

    this.fechasSeleccionadasChange.emit(this.fechasSeleccionadas);
  }

  /**
   * Verifica si el control de crosslist es inválido y debe mostrar errores.
   *
   * @returns {boolean | null} - Devuelve `true` si el control es inválido (no hay elementos seleccionados) y ha sido tocado,
   * `false` si es válido, o `null` si no hay un control definido.
   */
  isInvalid(): boolean | null {
    const CONTROL = this.fechaSeleccionada;
    if (!CONTROL) {return null;}
    
    // For crosslist, we consider it invalid if it's required and no items are selected (fechasSeleccionadas is empty)
    const hasNoSelection = this.required && this.fechasSeleccionadas.length === 0;
    const isTouched = CONTROL.touched;
    
    return hasNoSelection && isTouched;
  }

  /**
   * Establece el estado deshabilitado del control.
   * @param isDisabled - Indica si el control debe estar deshabilitado.
   * @returns void
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Marca los controles de formulario como tocados para activar la visualización de errores de validación.
   * Este método debe ser llamado desde el componente padre para activar la validación.
   * @returns void
   */
  markControlsAsTouched(): void {
    this.fecha.markAsTouched();
    this.fechaSeleccionada.markAsTouched();
  }
}
