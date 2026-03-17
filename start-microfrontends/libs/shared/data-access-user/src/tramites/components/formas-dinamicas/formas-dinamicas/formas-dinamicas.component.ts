import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit, Output, TemplateRef, forwardRef } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ModeloDeFormaDinamica, Validadores } from '../../../../core/models/shared/forms-model';
import { CatalogoSelectComponent } from '../../catalogo-select/catalogo-select.component';
import { EventEmitter } from '@angular/core';
import { InputFecha } from '../../../../../src/core/models/shared/components.model';
import { InputFechaComponent } from '../../input-fecha/input-fecha.component';
import { InputRadioComponent } from '../../input-radio/input-radio.component';
import { TituloComponent } from '../../titulo/titulo.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ValidacionesFormularioService } from '../../../../core/services/shared/validaciones-formulario/validaciones-formulario.service';
import { ValidadoresDeFormulariosComponent } from '../../validadores-de-formularios/validadores-de-formularios/validadores-de-formularios.component';

/**
 * FormasDinamicasComponent es un componente que permite la creación y gestión
 * de formularios dinámicos en el contexto de trámites. Este componente utiliza
 * formularios reactivos de Angular para manejar y validar los datos de manera
 * eficiente. Además, soporta la integración con servicios y estados para obtener
 * datos dinámicos y mantener la sincronización con el estado global de la aplicación.
 * 
 * @component
 * @selector formas-dinamicas
 * @standalone true
 * @imports [
 *   CommonModule,
 *   ReactiveFormsModule,
 *   ValidadoresDeFormulariosComponent,
 *   CatalogoSelectComponent,
  *  InputRadioComponent,
      TituloComponent,
      InputFechaComponent
 * ]
 * @templateUrl ./formas-dinamicas.component.html
 * @styleUrl ./formas-dinamicas.component.scss
 */
@Component({
  selector: 'formas-dinamicas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidadoresDeFormulariosComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    TituloComponent,
    InputFechaComponent,
    NgTemplateOutlet,
    TooltipModule
  ],
  templateUrl: './formas-dinamicas.component.html',
  styleUrl: './formas-dinamicas.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormasDinamicasComponent),
      multi: true
    }
  ]

})

export class FormasDinamicasComponent implements ControlValueAccessor, OnInit {

  /**
  * compo doc
  * @input formularioTitulo
  * @type {string}
  * @memberof FormasDinamicasComponent
  * @description
  * Entrada para manejar el título del formulario
  */
  @Input() public formularioTitulo!: string;

  /**
   * Subtítulo del formulario, generalmente utilizado para proporcionar contexto adicional
   * o información sobre el propósito o contenido del formulario.
   */
  @Input() public formularioSubtitulo!: string;

  /**
  * compo doc
  * @input forma
  * @type {FormGroup}
  * @memberof FormasDinamicasComponent
  * @description
  * Este es un formulario reactivo de Angular representado por un FormGroup.
  * Se utiliza para manejar y validar los datos del formulario en el componente.
  */
  @Input() public forma!: FormGroup;

  /**
  * compo doc
  * @input formularioDatos
  * @type {ModeloDeFormaDinamica[]}
  * @memberof FormasDinamicasComponent
  * @description
  * Este es un arreglo de objetos de tipo FormularioDinamico.
  * Se utiliza para definir la estructura y configuración de los formularios dinámicos en el componente.
  */
  @Input() public formularioDatos!: ModeloDeFormaDinamica[];

  /**
  * compo doc
  * @input estado
  * @type {{[key: string]: unknown}}
  * @memberof FormasDinamicasComponent
  * @description
  * Este es un objeto que representa el estado actual del formulario.
  * Se utiliza para almacenar valores dinámicos que pueden ser utilizados
  * para inicializar o actualizar los controles del formulario.
  */
  @Input() estado!: {[key: string]: unknown};

  /**
  * @input soloLectura
  * @type {boolean}
  * @memberof FormasDinamicasComponent
  * @description
  * Indica si el formulario debe mostrarse en modo solo lectura.
  * Si es `true`, los campos del formulario estarán deshabilitados para edición.
  * Por defecto es `false`.
  */
  @Input() soloLectura: boolean = false;
  /**
  * @input templateMap
  * @type {Record<string, TemplateRef<unknown>>}
  * @memberof FormasDinamicasComponent
  * @description
  * Mapa que asocia identificadores de plantilla (`string`) con sus respectivas referencias (`TemplateRef`).
  * Permite renderizar dinámicamente diferentes bloques de contenido en función del contexto del formulario.
  * Es un objeto vacío por defecto, pero puede ser poblado con referencias a plantillas personalizadas.
  */
  @Input() templateMap: Record<string, TemplateRef<unknown>> = {};

  /**
  * compo doc
  * @output emitirEventoDeClic
  * @type {EventEmitter<ModeloDeFormaDinamica>}
  * @memberof FormasDinamicasComponent
  * @description
  * Este es un EventEmitter que emite un evento cuando se hace clic en un botón
  * asociado a un campo dinámico del formulario. El evento emite un objeto de tipo
  * `ModeloDeFormaDinamica`, que contiene información sobre el campo dinámico
  * relacionado con el botón clicado.
  */
  @Output() emitirEventoDeClic: EventEmitter<ModeloDeFormaDinamica> = new EventEmitter<ModeloDeFormaDinamica>();

  /**
  * compo doc
  * @output emitirCambioDeValor
  * @type {EventEmitter<ModeloDeFormaDinamica>}
  * @memberof FormasDinamicasComponent
  * @description
  * Este es un EventEmitter que emite un evento cuando se hace clic en un botón
  * asociado a un campo dinámico del formulario. El evento emite un objeto de tipo
  * `ModeloDeFormaDinamica`, que contiene información sobre el campo dinámico
  * relacionado con el botón clicado.
  */
  // Se agregó 'type' porque el valor puede ser de cualquier tipo (string, number, boolean, etc.).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() emitirCambioDeValor: EventEmitter<{ campo: string; valor: any}> = new EventEmitter<{ campo: string; valor: any}>();

  /**
  * compo doc
  * valor del ancho de la pantalla.
  * @type {number}
  * @memberof FormasDinamicasComponent
  */
  public anchoDePantalla!: number;

  /**
   * Obtiene el grupo de formulario 'fechaInicial' del formulario principal.
   * @returns {FormGroup}
   */
  get fechaInicial(): FormGroup {
    return this.forma.get('fechaInicial') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'fechaFinal' del formulario principal.
   * @returns {FormGroup}
  */
  get fechaFinal(): FormGroup {
    return this.forma.get('fechaFinal') as FormGroup;
  }
  
  /**
   * compo doc
 * @property onChange
 * @description
 * Función estática que actúa como un callback para manejar los cambios en los valores del formulario dinámico.
 * 
 * Funcionalidad:
 * - Se registra mediante el método `registerOnChange` como parte de la implementación de la interfaz `ControlValueAccessor`.
 * - Se ejecuta automáticamente cada vez que los valores del formulario cambian.
 * - Inicialmente, es una función vacía que puede ser sobrescrita al registrar un callback.
 * 
 * @type {(value: Record<string, unknown>) => void}
 * 
 * @example
 * FormasDinamicasComponent.onChange = (value) => {
 *   console.log('Valores del formulario cambiaron:', value);
 * };
 */
  public static onChange: (value: Record<string, unknown>) => void = () => {
  // 
  };
  
  /**
   * compo doc
 * @property onTouched
 * @description
 * Función estática que actúa como un callback para manejar el estado de "tocado" en el formulario dinámico.
 * 
 * Funcionalidad:
 * - Se registra mediante el método `registerOnTouched` como parte de la implementación de la interfaz `ControlValueAccessor`.
 * - Se ejecuta automáticamente cuando el control del formulario es marcado como "tocado".
 * - Inicialmente, es una función vacía que puede ser sobrescrita al registrar un callback.
 * 
 * @type {() => void}
 * 
 * @example
 * FormasDinamicasComponent.onTouched = () => {
 *   console.log('El formulario ha sido marcado como tocado.');
 * };
 */
  public static onTouched: () => void = () => {
  // 
  };
  
  /**
  * compo doc
  * @constructor
  * Inicializa una nueva instancia del componente `FormulariosDeCertiRegistroComponent`.
  * @param fb un servicio que simplifica la creación de formularios reactivos
  * @param validacionesService servicio que procesa todas las validaciones
  */
  constructor(
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private cdr: ChangeDetectorRef
  ) {
      this.anchoDePantalla = window.innerWidth;
    }

  /**
   * compo doc
  * @method enCambiarTamano
  * @description
  * Este método es un manejador de eventos que se ejecuta cuando la ventana del navegador cambia de tamaño.
  * Utiliza el decorador `@HostListener` para escuchar el evento `resize` del objeto `window`.
  * Actualiza el valor de la propiedad `anchoDePantalla` con el ancho actual de la ventana. 
  * @param event - El evento de cambio de tamaño (`resize`) que contiene información sobre el nuevo tamaño de la ventana.
  */
  @HostListener('window:resize', ['$event'])
  enCambiarTamano(event: Event): void {
    this.anchoDePantalla = (event.target as Window).innerWidth;
  }

  /**
   * compo doc
  * @method obtenerClaseResponsiva
  * @description
  * Este método devuelve una clase CSS basada en el ancho de la pantalla.
  * Si el ancho de la pantalla está entre 768 y 991 píxeles, devuelve 'col-12'.
  * Si el ancho de la pantalla es mayor a 991 píxeles, devuelve la clase proporcionada como parámetro.
  * En cualquier otro caso, devuelve 'col-12'.
  * @param {string} clase - La clase CSS que se debe devolver si el ancho de la pantalla es mayor a 991 píxeles.
  * @returns {string} - La clase CSS correspondiente según el ancho de la pantalla.
  */
  obtenerClaseResponsiva(clase: string): string {
    if (this.anchoDePantalla >= 768 && this.anchoDePantalla <= 991) {
      return 'col-12';
    } else if (this.anchoDePantalla > 991) {
      return clase;
    }
    return 'col-12';
  }

  /**
  * compo doc
  * @method ngOnInit
  * @description 
  * El gancho ngOnInit se llama para inicializar el formulario
  * @memberof FormasDinamicasComponent
  */
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  /** compo doc
  * @method inicializarFormulario
  * @description La función inicializarFormulario se utiliza para crear el formulario 
  * utilizando los datos del formulario pasados como entrada a este componente
  */
  inicializarFormulario(): void {
    if (!this.formularioDatos || !Array.isArray(this.formularioDatos) || this.formularioDatos.length === 0) {
      return;
    }
  
    const FORMGROUP: { [key: string]: ReturnType<FormBuilder['control']> } = {};
    this.formularioDatos.forEach(campo => {
      if (!campo || !campo.campo || campo.tipoInput === 'button' || campo.tipoInput === '') {
        return;
      }

      campo.maxlength = campo?.maxlength ?? FormasDinamicasComponent.obtenerMaxlength(campo.validadores);

      if (!this.forma?.contains(campo.campo)) {
        const VALIDADORES = FormasDinamicasComponent.obtenerValidadores(campo.validadores ?? []);
        const DESACTIVADO = this.establecerDesactivar(campo.desactivado);
        const CONTROL = this.fb.control(
        { value: this.estado && this.estado[campo.campo] ? this.estado[campo.campo] : campo.valorPredeterminado, disabled: DESACTIVADO },
        { validators: VALIDADORES }
      );

        FORMGROUP[campo.campo] = CONTROL;
        const VALIDATOR_RESULT = CONTROL.validator ? CONTROL.validator({} as AbstractControl) : null;
        campo.esRequerido = Boolean(VALIDATOR_RESULT?.['required']);
      }
    });

    Object.keys(FORMGROUP).forEach(controlName => {
      if (!this.forma?.get(controlName)) {
        this.forma.addControl(controlName, FORMGROUP[controlName]);
      }
    });  
  }

  /**
  * compo doc
  * @method obtenerValidadores
  * @description
  * Esta función estática se utiliza para generar una lista de validadores de Angular
  * basados en una lista de validadores proporcionada como entrada.
  * 
  * @param {string[]} listaDeValidadores - Un arreglo de cadenas que representan los nombres
  * de los validadores que se deben aplicar a un campo del formulario.
  * 
  * @returns {ValidatorFn[]} - Un arreglo de funciones de validación (`ValidatorFn`) que
  * pueden ser utilizadas en un formulario reactivo de Angular.
  * 
  * @example
  * const validadores = FormasDinamicasComponent.obtenerValidadores(['required']);
  * // validadores contendrá [Validators.required]
  */
  static obtenerValidadores(listaDeValidadores: Validadores[]): ValidatorFn[] {
    const VALIDATORS: ValidatorFn[] = [];

    listaDeValidadores.forEach((validadore: Validadores) => {
      if (!validadore || !validadore.tipo) {
        return;
      }
      if (validadore.tipo.includes('required')) {
        VALIDATORS.push(Validators.required);
      }
      if (validadore.tipo.includes('minlength') && typeof validadore.valor === 'number') {
        VALIDATORS.push(Validators.minLength(validadore.valor));
      }
      if (validadore.tipo.includes('customMaxlength') && typeof validadore.valor === 'number') {
        VALIDATORS.push((control: AbstractControl): ValidationErrors | null => {
          const VALUE = control.value;
          if (VALUE && typeof validadore.valor === 'number' && VALUE.length > validadore.valor) {
            return { customMaxlength: validadore.mensaje };
          }
          return null;
        });
      }
    });

    const PATTERN_VALIDATORS = listaDeValidadores.filter(v => v.tipo === 'pattern');
    if (PATTERN_VALIDATORS.length > 0) {
    VALIDATORS.push((control: AbstractControl): ValidationErrors | null => {
      const VALOR = control.value;
      if (VALOR === null || VALOR === '') {
        return null;
      }

      for (const VALIDADOR of PATTERN_VALIDATORS) {
        if (VALIDADOR.valor instanceof RegExp && !VALIDADOR.valor.test(VALOR)) {
          const ERROR_KEY = VALIDADOR.tipo + '_' + (VALIDADOR.valor.toString().replace(/\W/g, ''));
          return { [ERROR_KEY]: VALIDADOR.mensaje };
        }
      }

      return null;
    });
    }

    return VALIDATORS;
  }

  /**
 * @method establecerDesactivar
 * @description
 * Determina si un campo del formulario debe estar deshabilitado.
 * @param {boolean} desactivado - Indica si el campo debe estar deshabilitado por configuración individual.
 * @returns {boolean} `true` si el campo debe estar deshabilitado, `false` en caso contrario.
 */
  public establecerDesactivar(desactivado: boolean): boolean {
    if (desactivado || this.soloLectura) {
      return true;
    }
    return false;
  }

  /**
  * compo doc
  * @method isValid
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param field El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.forma, campo);
  }

  /**
  * compo doc
  * @method seRequiere
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param item El nombre del campo que se desea validar.
  * @returns {boolean} Un valor booleano que indica si el campo es válido.
  */
  public seRequiere(campo: string): boolean {
    const CONTROL = this.forma.get(campo);
    if (CONTROL && CONTROL.validator) {
      const VALIDATOR = CONTROL.validator({} as AbstractControl);
      return Boolean(VALIDATOR?.['required']);
    }
    return false;
  }

  /**
  * compo doc
  * @method onButtonClick
  * @description
  * Este método se ejecuta cuando se hace clic en un botón asociado a un campo dinámico.
  * Verifica si el campo tiene un valor vinculado a otro campo (campo padre).
  * Si existe un campo padre con valores predefinidos para sus hijos, actualiza los valores
  * de los campos hijos en el formulario y en el estado de la tienda.
  * 
  * @param item - Un objeto de tipo `ModeloDeFormaDinamica` que representa el campo dinámico
  * asociado al botón que se ha clicado.
  */
  public alHacerClicEnElBoton(item: ModeloDeFormaDinamica): void {
    if (item) {
      this.emitirEventoDeClic.emit(item);
    }
  }

  /**
  * compo doc
  * @method eventoDeCambioDeValor
  * @description
  * Este método se ejecuta cuando ocurre un cambio en el valor de un campo del formulario.
  * Detecta el valor del evento, ya sea desde un elemento HTML o directamente desde el evento,
  * y emite un objeto que contiene el nombre del campo y su nuevo valor.
  * 
  * @param event - El evento que contiene el nuevo valor del campo. Puede ser un evento de entrada
  * (como un cambio en un campo de texto) o un valor directo.
  * @param campo - El nombre del campo del formulario que ha cambiado.
  * 
  * @example
  * eventoDeCambioDeValor({ target: { value: 'nuevo valor' } }, 'nombreCampo');
  * // Emitirá: { campo: 'nombreCampo', valor: 'nuevo valor' }
  */
  // Se agregó 'type' porque el valor puede ser de cualquier tipo (string, number, boolean, etc.).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
public eventoDeCambioDeValor(event: any, campo: string, tipo?: string): void {
  let VALOR;

  if (event?.target) {
    const INPUT = event.target as HTMLInputElement;

    if (INPUT.type === 'checkbox') {
      VALOR = INPUT.checked; // Booleano verdadero/falso
    } else {
      VALOR = INPUT.value; // Texto, fecha, número, etc.
    }
  } else {
    VALOR = event; // Para componentes personalizados o valores directos
  }

  if (tipo === 'date') {
    this.forma.get(campo)?.setValue(event);
  }

  if (campo) {
    // Marcar el campo como tocado para que se muestren los errores de validación
    this.forma.get(campo)?.markAsTouched();
    this.emitirCambioDeValor.emit({ campo: campo, valor: VALOR });
  }
}

  /**
   * Marca un campo como tocado para mostrar errores de validación
   */
  public marcarComoTocado(campo: string): void {
    const CONTROL = this.forma.get(campo);
    if (CONTROL) {
      CONTROL.markAsTouched();
      this.cdr.detectChanges(); // Detección de cambio forzada
    }
  }


  /**
  * compo doc
  * @method writeValue
  * @description
  * Este método se utiliza para escribir valores en el formulario reactivo del componente.
  * Es parte de la implementación de la interfaz `ControlValueAccessor` y permite sincronizar
  * los valores del modelo externo con los controles del formulario interno.
  * 
  * @param value - Un objeto que contiene los valores a escribir en el formulario. Cada clave
  * representa el nombre de un control, y su valor asociado es el valor que se asignará.
  * 
  * @example
  * Si se pasa el objeto `{ nombre: 'Juan', edad: 30 }`, el método añadirá controles llamados
  * `nombre` y `edad` al formulario (si no existen) y les asignará los valores `'Juan'` y `30`.
  */
  writeValue(value: Record<string, unknown>): void {
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        const CONTROL = this.forma.get(key);
        if (!CONTROL) {
          this.forma.addControl(key, new FormControl(value[key] || null));
        } else if (value[key] !== undefined) {
          CONTROL.setValue(value[key], { emitEvent: false });
        }
      });
    }
  }
  
  /**
   * compo doc
 * @method registerOnChange
 * @description
 * Este método registra una función de devolución de llamada que se ejecutará cada vez que
 * los valores del formulario reactivo cambien. Es parte de la implementación de la interfaz
 * `ControlValueAccessor` y permite la sincronización entre el modelo externo y los valores
 * internos del formulario.
 * 
 * @param fn - Una función de devolución de llamada que recibe como parámetro un objeto
 * que representa los valores actuales del formulario. Esta función será invocada automáticamente
 * cuando ocurra un cambio en los valores del formulario.
 * 
 * @example
 * registerOnChange((value) => {
 *   console.log('Valores del formulario:', value);
 * });
 * 
 * @memberof FormasDinamicasComponent
 */
registerOnChange(fn: (value: Record<string, unknown>) => void): void {
  FormasDinamicasComponent.onChange = fn;
  this.forma.valueChanges.subscribe(value => {
    fn(value);
  });
}

  /**
   * compo doc
  * @method registerOnTouched
  * @description
  * Este método registra una función de devolución de llamada que se ejecutará cuando
  * el control del formulario sea marcado como "tocado". Es parte de la implementación
  * de la interfaz `ControlValueAccessor` y permite la sincronización entre el modelo
  * externo y el estado de "tocado" del formulario.
  * 
  * @param fn - Una función de devolución de llamada que se invocará cuando el control
  * sea marcado como "tocado". Esta función no recibe parámetros.
  * 
  * @example
  * registerOnTouched(() => {
  *   console.log('El control ha sido tocado');
  * });
  * 
  * @memberof FormasDinamicasComponent
  */
  /** // Si eliminas esta regla ESLint, marcará error porque el método no utiliza 'this', pero es 
   * necesario para implementar la interfaz 'ControlValueAccessor'. */
  // eslint-disable-next-line class-methods-use-this
  registerOnTouched(fn: () => void): void {
    FormasDinamicasComponent.onTouched = fn;
  }

  /**
   * compo doc
  * @method obtenerInformacionDeFecha
  * @description
  * Este método se utiliza para obtener la información de configuración de un campo de tipo fecha 
  * en el formulario dinámico. Devuelve un objeto que contiene las propiedades necesarias para 
  * configurar el campo, como el nombre de la etiqueta, si es requerido y si está habilitado.
  * 
  * Funcionalidad:
  * - Verifica si el evento contiene datos válidos.
  * - Extrae las propiedades `labelNombre`, `required` y `habilitado` del evento.
  * - Devuelve un objeto con la configuración del campo de fecha.
  * - Si el evento no es válido, devuelve un objeto con valores predeterminados.
  * 
  * @param {ModeloDeFormaDinamica} event - Objeto que contiene la configuración del campo dinámico.
  * @returns {InputFecha} Objeto con la configuración del campo de fecha.
  * 
  * @example
  * const configuracionFecha = this.obtenerInformacionDeFecha(campoFecha);
  * console.log(configuracionFecha);
  * // { labelNombre: 'Fecha de inicio', required: true, habilitado: false }
  */
  obtenerInformacionDeFecha(event: ModeloDeFormaDinamica): InputFecha {
    if (event) {
      const DATOS = {
        labelNombre: event.labelNombre, 
        required: this.seRequiere(event.campo),
        habilitado: event.habilitado ?? false,
      };
      return DATOS;
    }
    return { labelNombre: '', required: false, habilitado: false };
  }

  /**
  * @method enCheckboxMultipleCambiar
  * @description
  * Este método se utiliza para manejar los cambios en los campos de tipo checkbox múltiple en un formulario dinámico.
  * 
  * Funcionalidad:
  * - Obtiene el control del formulario asociado al campo especificado.
  * - Si el control no existe, termina la ejecución.
  * - Verifica si el checkbox fue marcado o desmarcado.
  * - Si fue marcado, agrega el valor al arreglo de valores actuales.
  * - Si fue desmarcado, elimina el valor del arreglo de valores actuales.
  * - Actualiza el valor del control del formulario con el nuevo arreglo de valores.
  * - Emite un evento con el nuevo valor del campo.
  * 
  * @param {Event} event - El evento de cambio generado por el checkbox.
  * @param {string} campo - El nombre del campo del formulario asociado al checkbox.
  * @param {string} value - El valor del checkbox que se está modificando.
  * 
  * @example
  * // Cuando se marca un checkbox:
  * this.enCheckboxMultipleCambiar(event, 'intereses', 'deporte');
  * // El valor 'deporte' se agrega al arreglo de valores del campo 'intereses'.
  */
  public enCheckboxMultipleCambiar(event: Event, campo: string, value: string): void {
    const CONTROL = this.forma.get(campo);
    if (!CONTROL) {
      return;
    }
    let valoresActuales: string[] = CONTROL.value || [];
  
    if ((event.target as HTMLInputElement).checked) {
      if (!valoresActuales.includes(value)) {
        valoresActuales = [...valoresActuales, value];
      }
    } else {
      valoresActuales = valoresActuales.filter(v => v !== value);
    }
  
    CONTROL.setValue(valoresActuales);
    this.eventoDeCambioDeValor(valoresActuales, campo);
  }
  
  

  /**
   * compo doc
  * @method obtenerFilas
  * @description
  * Este método obtiene un arreglo de números que representan las filas únicas definidas en los datos del formulario dinámico.
  * 
  * Funcionalidad:
  * - Recorre los datos del formulario (`formularioDatos`) y extrae el valor de la propiedad `row` de cada control.
  * - Si el valor de `row` no está definido, se asigna el valor predeterminado de `0`.
  * - Utiliza un conjunto (`Set`) para garantizar que las filas sean únicas.
  * - Convierte el conjunto en un arreglo y lo devuelve.
  * 
  * @returns {number[]} Un arreglo de números que representan las filas únicas en el formulario dinámico.
  * 
  * @example
  * const filas = this.obtenerFilas();
  * console.log(filas); // Salida: [0, 1, 2]
  */
  public obtenerFilas(): number[] {
    const FILAS = new Set<number>();
    this.formularioDatos.forEach(control => {
      FILAS.add(control.row !== undefined ? control.row : 0);
    });
    return Array.from(FILAS);
  }

  /**
   * compo doc
  * @method obtenerControlsPorFilas
  * @description
  * Este método obtiene un arreglo de controles dinámicos que pertenecen a una fila específica en el formulario dinámico.
  * 
  * Funcionalidad:
  * - Filtra los datos del formulario (`formularioDatos`) para encontrar los controles que coinciden con la fila especificada.
  * - Si la propiedad `row` de un control no está definida, se asigna el valor predeterminado de `0`.
  * - Devuelve un arreglo de controles que pertenecen a la fila especificada.
  * 
  * @param {number} row - Número de la fila para la cual se desean obtener los controles.
  * @returns {ModeloDeFormaDinamica[]} Un arreglo de controles dinámicos que pertenecen a la fila especificada.
  * 
  * @example
  * const controles = this.obtenerControlsPorFilas(1);
  * console.log(controles); // Salida: [{ campo: 'nombre', row: 1 }, { campo: 'apellido', row: 1 }]
  */
  public obtenerControlsPorFilas(row: number): ModeloDeFormaDinamica[] {
    return this.formularioDatos.filter(control => (control.row !== undefined ? control.row : 0) === row);
  }
  /**
 * Obtiene el valor máximo de caracteres permitido (maxlength) de la lista de validadores de un campo.
 * @param validadores - Arreglo de validadores asociados al campo.
 * @returns El valor de maxlength si existe, o null en caso contrario.
 */
  public static obtenerMaxlength(validadores: Validadores[] | undefined): number | null {
    if (validadores?.length) {
      const MAXLENGTH = validadores.find(v => v.tipo === 'maxlength');
      return MAXLENGTH && typeof MAXLENGTH.valor === 'number' ? MAXLENGTH.valor : null;
    }
    return null;
  }

  /**
   * Filtra los caracteres de entrada basándose en el patrón de expresión regular proporcionado.
   * Permite teclas especiales de navegación y edición, y bloquea caracteres no permitidos.
   * 
   * @param event - Evento de teclado del input o textarea
   * @param inputFilter - Patrón de expresión regular que define los caracteres permitidos
   */
  public filtrarCaracteres(event: KeyboardEvent, inputFilter?: RegExp): void {
    if (!inputFilter) {
      return;
    }

    const CARACTER = event.key;

    // Permitir teclas especiales de navegación y edición
    const TECLAS_ESPECIALES = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
      'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'PageUp', 'PageDown', 'Insert'
    ];

    if (event.ctrlKey || event.metaKey) {
      return;
    }
    if (TECLAS_ESPECIALES.includes(CARACTER)) {
      return;
    }
    // Verificar si el carácter coincide con el patrón del filtro
    if (!inputFilter.test(CARACTER)) {
      event.preventDefault();
    }
  }
}
