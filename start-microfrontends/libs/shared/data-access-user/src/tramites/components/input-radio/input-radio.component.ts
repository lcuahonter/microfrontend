import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * InputRadioComponent es un componente reutilizable que renderiza un grupo de botones de radio.
 * Soporta diseños verticales y horizontales y puede configurarse para ser un campo requerido.
 */
@Component({
  selector: 'app-input-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TooltipModule],
  templateUrl: './input-radio.component.html',
  styleUrl: './input-radio.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRadioComponent), // ✅ FIX: Wrap with forwardRef()
      multi: true,
    },
  ],
})
export class InputRadioComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() description!: string; // Optional description
  @Input() showDescription: boolean = false;
  @Input() labelMargin: string = '15px'; // Dynamic label margin
  @Input() isBold: boolean = false; // Control bold label
  @Input() gap: string = '10px'; // Default spacing
  /** Grupo de formulario para los botones de radio */
  FormInputRadio!: FormGroup;
  /**
   * Array de opciones de radio, cada una con una etiqueta y un valor.
   */
  @Input() radioOptions: {
    label: string;
    value: string | number;
    hint?: string;
  }[] = [];
  /**
   * El valor actualmente seleccionado.
   * @example 'option1'
   */
  @Input() selectedValue: string | number | null = null;
  /**
   * Indica si los botones de radio son requeridos.
   * @default false
   */
  @Input() isRequired: boolean = false;
  /**
   * Diseño de los botones de radio, ya sea 'vertical' u 'horizontal'.
   * @default 'vertical'
   */
  @Input() layout: 'vertical' | 'horizontal' | 'radio-label-wrap' = 'vertical';

  /**
   * Entrada que determina la posición de la etiqueta respecto al botón de opción:
   * 'first' para mostrarla antes del input, 'last' para mostrarla después
   */
  @Input() labelName: 'first' | 'last' = 'last';

  /**
   * Indica si se debe mostrar un tooltip con la descripción del campo.
   * @default false
   */
  @Input() showTooltip: boolean = false;

  /**
 * Indica si el componente debe mostrarse en un diseño de cuadrícula (grid).
 *
 * Este `@Input` permite al componente padre habilitar o deshabilitar el
 * modo de presentación en cuadrícula.
 *
 * @example
 * <!-- En el componente padre -->
 * <app-hijo [gridLayout]="true"></app-hijo>
 *
 * @type {boolean}
 * @default false
 */
  @Input() gridLayout: boolean = false;

  /**
 * Referencia al contenedor de los botones de radio en la plantilla.
 *
 * Se obtiene mediante `@ViewChild` para manipular directamente el
 * elemento nativo del DOM que contiene los botones de radio.
 *
 * @type {ElementRef}
 */
  @ViewChild('radioContainer', { static: true }) radioContainer!: ElementRef;

  /**
 * Ancho aplicado a los botones de radio.
 *
 * Esta propiedad define el estilo de ancho que se aplicará a los botones
 * de radio en la interfaz de usuario.
 *
 * @type {string}
 * @default '100%'
 */
  public anchoDelBotonDeRadio = '100%';

  /**
 * Lista de etiquetas que deben mostrarse como deshabilitadas.
 *
 * Este `@Input` recibe desde el componente padre un arreglo de cadenas
 * que representan las opciones que no deben estar disponibles para el usuario.
 *
 * @example
 * <!-- En el componente padre -->
 * <app-hijo [disableLabel]="['Opción 1', 'Opción 2']"></app-hijo>
 *
 * @type {string[]}
 * @default []
 */
  @Input() disableLabel: string[] = [];

  /**
   * Evento emitido cuando el valor seleccionado cambia.
   */
  @Output() valueChange = new EventEmitter<string | number>();

  @Input() bloquearOpciones: boolean = false;

  /**
 * Constructor del componente.
 *
 * Inicializa el servicio `FormBuilder` que permite crear y gestionar
 * formularios reactivos dentro del componente.
 *
 * @param {FormBuilder} fb - Servicio inyectado de Angular utilizado
 * para construir instancias de `FormGroup`, `FormControl` y `FormArray`.
 */
  constructor(private fb: FormBuilder) {
    //constructor
  }

  /**
 * Ciclo de vida `ngOnChanges` de Angular.
 *
 * Se ejecuta automáticamente cuando cambia el valor de alguna
 * propiedad marcada con `@Input`.  
 * En este caso, detecta los cambios en la propiedad `disableLabel`
 * y actualiza su valor con el nuevo recibido desde el componente padre.
 *
 * @param {SimpleChanges} changes - Objeto que contiene el historial de cambios
 * de todas las propiedades vinculadas con `@Input`.
 *
 * @returns {void}
 *
 * @example
 * <!-- En el padre -->
 * <app-hijo [disableLabel]="['Opción 1']"></app-hijo>
 *
 * // En el hijo, al cambiar `disableLabel`:
 * ngOnChanges(changes: SimpleChanges): void {
 *   if (changes['disableLabel']) {
 *     this.disableLabel = changes['disableLabel'].currentValue;
 *   }
 * }
 */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disableLabel']) {
      this.disableLabel = changes['disableLabel'].currentValue;
    }
  }

  ngOnInit(): void {
    this.createFormRadio();
    this.calcularAnchoBotonDeRadio();
  }

  /**
   * Crea el grupo de formulario para los botones de radio con los validadores apropiados.
   */
  createFormRadio(): void {
    const VALIDATORS = this.isRequired ? [Validators.required] : [];
    this.FormInputRadio = this.fb.group({
      seleccion: [this.selectedValue || '', VALIDATORS],
    });

    // Escuchar cuando cambie el valor
    let alreadyDisabled = false;
    this.FormInputRadio.get('seleccion')?.valueChanges.subscribe(valor => {
      if (valor && this.bloquearOpciones && !alreadyDisabled) {
        alreadyDisabled = true;
        this.FormInputRadio.get('seleccion')?.disable({ emitEvent: false }); // bloquear después de la primera selección sin triggering valueChanges
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private onChange: (value: string | number | null) => void = () => {
    /**/
  };
  // eslint-disable-next-line class-methods-use-this
  private onTouched: () => void = () => {
    /**/
  };
  /**
   * Maneja el evento de cambio de selección y emite el nuevo valor.
   * @param value - El nuevo valor seleccionado.
   */
  onSelectionChange(value: string | number): void {
    this.selectedValue = value;
    this.valueChange.emit(value);
    this.onChange(value);
    this.onTouched();
  }

  // ✅ Implement `ControlValueAccessor`
  writeValue(value: string | number | null): void {
    this.selectedValue = value;
    if (this.FormInputRadio) {
      this.FormInputRadio.patchValue({ seleccion: value });
    }
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.FormInputRadio.disable();
    } else {
      this.FormInputRadio.enable();
    }
  }

  /**
   * @method alCambiarElTamano
   * @description
   * Este método se ejecuta cuando ocurre un evento de redimensionamiento de la ventana del navegador.
   *
   * Funcionalidad:
   * - Escucha el evento `resize` de la ventana utilizando el decorador `@HostListener`.
   * - Llama al método `calcularAnchoBotonDeRadio()` para ajustar dinámicamente el ancho de los botones de radio.
   * - Es útil en diseños responsivos para garantizar que los botones de radio se adapten al tamaño del contenedor o de la ventana.
   *
   * @example
   * // Cuando el usuario redimensiona la ventana:
   * this.alCambiarElTamano();
   * // Se recalcula el ancho de los botones de radio.
   */
  @HostListener('window:resize')
  alCambiarElTamano(): void {
    this.calcularAnchoBotonDeRadio();
  }

  /**
   * @method obtenerEstiloParaRadio
   * @description
   * Este método genera estilos dinámicos para los botones de radio en función de la configuración del diseño.
   *
   * Funcionalidad:
   * - Calcula el ancho de cada botón de radio cuando se utiliza un diseño de cuadrícula (`gridLayout`).
   * - Aplica estilos específicos para diseños horizontales (`layout: 'horizontal'`).
   * - Aplica estilos predeterminados para diseños verticales.
   *
   * @returns {Object} Un objeto con los estilos CSS aplicables a los botones de radio.
   *
   * @example
   * // Estilos para diseño de cuadrícula:
   * const estilos = this.obtenerEstiloParaRadio();
   * console.log(estilos); // { width: '33.33%', padding: '8px', ... }
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obtenerEstiloParaRadio(): { [klass: string]: any } {
    const COUNT = this.radioOptions.length || 1;

    if (this.gridLayout) {
      return {
        width: `${100 / COUNT}%`,
        padding: '8px',
        'box-sizing': 'border-box',
        'white-space': 'nowrap',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'max-width': '100%',
      };
    }

    if (this.layout === 'horizontal') {
      return {
        display: 'inline-block',
        'margin-right': '30px',
      };
    }
    if (this.layout === 'radio-label-wrap') {
      return {
        'margin-bottom': '10px',
        display: 'flex',
        'align-items': 'baseline',
        gap: '8px',
        'max-width': '100%',
      };
    }

    return {
      display: 'block',
      'margin-bottom': '10px',
    };
  }

  /**
   * @method calcularAnchoBotonDeRadio
   * @description
   * Este método calcula dinámicamente el ancho de los botones de radio cuando se utiliza un diseño de cuadrícula (`gridLayout`).
   *
   * Funcionalidad:
   * - Verifica si el diseño de cuadrícula está habilitado (`gridLayout`) y si el contenedor de los botones de radio (`radioContainer`) está disponible.
   * - Obtiene el ancho del contenedor de los botones de radio.
   * - Calcula el ancho de cada botón de radio considerando el espacio entre ellos (`SPACING`) y el número total de opciones (`COUNT`).
   * - Asigna el ancho calculado a la propiedad `radioButtonWidth`.
   *
   * @example
   * // Calcular el ancho de los botones de radio:
   * this.calcularAnchoBotonDeRadio();
   * console.log(this.radioButtonWidth); // '120px'
   */
  calcularAnchoBotonDeRadio(): void {
    if (!this.gridLayout || !this.radioContainer) {
      return;
    }

    const ANCHO_DEL_CONTENEDOR = this.radioContainer.nativeElement.offsetWidth;
    const ESPACIADO = 10;
    const CONTAR = this.radioOptions.length || 1;

    const ANCHO_POR_RELACION =
      (ANCHO_DEL_CONTENEDOR - ESPACIADO * CONTAR) / CONTAR;
    this.anchoDelBotonDeRadio = `${ANCHO_POR_RELACION}px`;
  }

  /**
   * Devuelve el orden en que se deben renderizar la etiqueta y el input de radio.
   * @returns Si labelName es 'first', la etiqueta va primero; de lo contrario, el input va primero.
   */
  getParts(): ('label' | 'input')[] {
    return this.labelName === 'first' ? ['label', 'input'] : ['input', 'label'];
  }
}
