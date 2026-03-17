import * as moment from 'moment';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MESES, SEMANA } from '../../../core/enums/constantes-alertas.enum';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { InputFecha } from '../../../core/models/shared/components.model';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@Component({
  selector: 'input-fecha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule, TooltipModule],
  templateUrl: './input-fecha.component.html',
  styleUrl: './input-fecha.component.scss',
})
export class InputFechaComponent implements OnInit, OnChanges {

  /**
   * Indica si se debe marcar el input-fecha con un estilo de error.
   */
  @Input() marcarError: boolean = false;

  /**
   * Indica si se deben mostrar los mensajes de error en el input-fecha.
   */
  @Input() mostrarErrores: boolean = true;

  /**
   * Emite el valor seleccionado cuando cambia.
   */
  @Output() valorCambiado: EventEmitter<string> = new EventEmitter();

  /**
   * Fecha establecida desde el componente padre.
   */
  @Input() setFecha!: string;

  /**
   * Datos requeridos para inicializar el componente.
   */
  @Input({ required: true }) datos!: InputFecha;

  /**
   * Indica si sólo se requiere el campo "colón".
   *
   * @type {boolean}
   * @default false
   */
  @Input() soloDosPuntosRequeridos: boolean = false;

  /**
   * Indica si se debe mostrar el ícono de ayuda (círculo con signo de interrogación).
   */
  @Input() tooltipQuestionCircle: boolean = false;

  /**
   * Texto que se mostrará en el tooltip del ícono de ayuda.
   */
  @Input() tooltipQuestionCircleText!: string;

/**
 * Indica si se deben deshabilitar las fechas futuras en el calendario.
 * Si es `true`, el usuario no podrá seleccionar fechas posteriores a la fecha actual.
 * Valor por defecto: `false`.
 */
  @Input() deshabilitarFuturas: boolean = false;

/**
 * Indica si se deben deshabilitar las fechas pasadas en el calendario.
 * Si es `true`, el usuario no podrá seleccionar fechas anteriores a la fecha actual.
 * Valor por defecto: `false`.
 */
  @Input() deshabilitarPasadas: boolean = false;

  /**
   * Clase CSS personalizada para el asterisco de campo requerido.
   * Permite aplicar estilos específicos al asterisco que indica que el campo es obligatorio.
   * Valor por defecto: cadena vacía.
   */
  @Input() asteriskClass: string = '';

  /**
   * Arreglo con los nombres de los meses.
   */
  meses = MESES;

  /**
   * Arreglo con los días de la semana.
   */
  semana = SEMANA;

  /**
   * Lista de años disponibles para selección.
   */
  anios: number[] = [];

  /**
   * Arreglo de meses disponibles con nombre, valor numérico y semana de inicio.
   */
  mountSelect!: { name: string; value: number; indexWeek: number }[];

  /**
   * Controla si se debe mostrar o no el contenido del componente.
   */
  mostrar: boolean = false;

  /**
   * Formulario reactivo del componente.
   */
  Formulario!: FormGroup;

  /**
   * Indica si se debe mostrar un ícono decorativo.
   */
  @Input() icono: boolean = true;
  /**
   * Bandera para indicar si el control debe estar deshabilitado.
   */
  @Input() isDisabled: boolean = false;

  /**
   * Etiqueta que se muestra sobre el control de fecha.
   * Permite personalizar el texto que aparece encima del selector de fecha.
   */
  @Input() etiquetaSobreControlFecha: string = '';

  constructor(private fb: FormBuilder) {
    moment.locale('es');
    this.generaanios();
    const FECHA_ACTUAL = moment().format('DD/MM/YYYY');
    const FECHA = FECHA_ACTUAL.split('/');
    const OBJECT_DATE = moment(`${FECHA[2]}-${FECHA[1]}-${FECHA[0]}`);
    this.generarFormulario(OBJECT_DATE);
  }

  /**
 * Método del ciclo de vida `ngOnChanges` de Angular.
 *
 * Se ejecuta automáticamente cuando cambia alguna de las propiedades con decorador `@Input()` del componente.
 * En este caso, detecta cambios en la propiedad `setFecha` y actualiza internamente el valor,
 * llamando al método `setFechaEnInput()` para reflejar el cambio en la interfaz.
 *
 * @param {SimpleChanges} changes - Objeto que contiene los cambios detectados en las propiedades de entrada.
 */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setFecha']) {
      this.setFecha = changes['setFecha'].currentValue;

      if (this.setFecha === null) {
        this.Formulario.get('fechaString')?.reset();
      } else {
        this.setFechaEnInput();
      }
    }
    if (changes['isDisabled']) {
      const IS_DISABLED = changes['isDisabled'].currentValue;
      if (IS_DISABLED) {
        this.Formulario.disable();
      } else {
        this.Formulario.enable();
      }
    }
  }
  /**
   * Verifica si el campo de fecha es inválido y ha sido tocado.
   * @returns {boolean} true si es requerido, está vacío y ha sido tocado.
   */
  isInvalid(): boolean {
    const CONTROL = this.Formulario?.get('fechaString');
    return CONTROL ? CONTROL.invalid && CONTROL.touched : this.marcarError;
  }

  /**
 * Método del ciclo de vida `ngOnInit` de Angular.
 *
 * Se ejecuta una vez que el componente ha sido inicializado.
 * En este caso, llama al método `setFechaEnInput()` para establecer el valor inicial
 * del campo de fecha basado en el valor recibido por el `@Input`.
 */
  ngOnInit(): void {
    this.setFechaEnInput();
  }

  /**
 * Establece el valor inicial del campo de fecha en el formulario.
 *
 * Si `setFecha` contiene una fecha válida en formato `DD/MM/YYYY`, la convierte
 * a un objeto `moment`, inicializa el formulario con esa fecha y actualiza
 * el campo `fechaString`. El campo se habilita temporalmente para asignar el valor
 * y luego se desactiva nuevamente para mantener el modo de solo lectura.
 *
 * Si `setFecha` está vacío o no es válida, limpia el campo y lo desactiva.
 */
  setFechaEnInput(): void {
    if (this.setFecha) {
      const FECHA = this.setFecha.split('/');
      if (FECHA.length === 3) {
        const OBJECT_DATE = moment(`${FECHA[2]}-${FECHA[1]}-${FECHA[0]}`);
        this.generarFormulario(OBJECT_DATE);
        this.Formulario.controls['fechaString'].enable();
        this.Formulario.get('fechaString')?.setValue(
          moment(OBJECT_DATE).format('DD/MM/YYYY')
        );
      }
      this.Formulario.controls['fechaString'].disable();
    } else {
      this.Formulario.controls['fechaString'].enable();
      this.Formulario.get('fechaString')?.setValue('');
      this.Formulario.controls['fechaString'].disable();
    }
  }

  get fechaString(): string {
    return this.Formulario.get('fechaString')?.value;
  }

  generarFormulario(fechaActual: moment.Moment): void {
    this.Formulario = this.fb.group({
      dia: [fechaActual.date()],
      mes: [fechaActual.month() + 1],
      anio: [fechaActual.year()],
      fechaString: [],
      fechaSeleccionada: [fechaActual],
    });
    this.Formulario.controls['fechaString'].disable();
    this.getDayFromDate(
      this.Formulario.get('mes')?.value,
      this.Formulario.get('anio')?.value
    );
  }

  cambioAnio(event: Event): void {
    this.Formulario.get('anio')?.setValue(
      (event.target as HTMLInputElement).value
    );
    const OBJECT_DATE = moment(
      `${this.Formulario.get('anio')?.value}-${this.Formulario.get('mes')
        ?.value.toString()
        .padStart(2, '0')}-01`
    );
    this.Formulario.get('fechaSeleccionada')?.setValue(OBJECT_DATE);

    this.getDayFromDate(
      this.Formulario.get('mes')?.value,
      this.Formulario.get('anio')?.value
    );
  }

  cambioMes(event: Event): void {
    this.Formulario.get('mes')?.setValue(
      (event.target as HTMLInputElement).value
    );
    const OBJECT_DATE = moment(
      `${this.Formulario.get('anio')?.value}-${this.Formulario.get('mes')
        ?.value.toString()
        .padStart(2, '0')}-01`
    );
    this.Formulario.get('fechaSeleccionada')?.setValue(OBJECT_DATE);

    this.getDayFromDate(
      this.Formulario.get('mes')?.value,
      this.Formulario.get('anio')?.value
    );
  }

  generaanios(): void {
    const YEAR = moment().year();
    const INICIO = YEAR - 100;
    const FINAL = YEAR + 100;
    let CONTADOR = INICIO;
    do {
      CONTADOR++;
      this.anios.push(CONTADOR);
    } while (CONTADOR !== FINAL);
  }

  getDayFromDate(mount: number, year: number): void {
    const START_DATE = moment(
      `${year}-${mount.toString().padStart(2, '0')}-01`
    );
    const END_DATE = START_DATE.clone().endOf('month');
    const DIFF_DAYS = END_DATE.diff(START_DATE, 'days', true);
    const NUMBER_DAYS = Math.round(DIFF_DAYS);
    const ARRAY_DAYS = Object.keys([...Array(NUMBER_DAYS)]).map((a: string) => {
      // eslint-disable-next-line radix, no-param-reassign
      const IN = parseInt(a) + 1;
      const DIA_FORMATO = IN > 9 ? IN : '0' + IN;
      const DAY_OBJECT = moment(
        `${year}-${mount.toString().padStart(2, '0')}-${DIA_FORMATO}`
      );
      return {
        name: DAY_OBJECT.format('dddd'),
        value: IN,
        indexWeek: DAY_OBJECT.isoWeekday(),
      };
    });
    this.mountSelect = ARRAY_DAYS;
  }

  changeMount(flag: number): void {
    if (flag < 0) {
      const PREV_DATE = this.Formulario.get('fechaSeleccionada')
        ?.value.clone()
        .subtract(1, 'month');
      this.Formulario.get('mes')?.setValue(PREV_DATE.format('M'));
      this.Formulario.get('anio')?.setValue(PREV_DATE.format('YYYY'));
      const OBJECT_DATE = moment(
        `${this.Formulario.get('anio')?.value}-${this.Formulario.get('mes')
          ?.value.toString()
          .padStart(2, '0')}-01`
      );
      this.Formulario.get('fechaSeleccionada')?.setValue(OBJECT_DATE);

      this.getDayFromDate(
        this.Formulario.get('mes')?.value,
        this.Formulario.get('anio')?.value
      );
    } else {
      const NEXT_DATE = this.Formulario.get('fechaSeleccionada')
        ?.value.clone()
        .add(1, 'month');
      this.Formulario.get('mes')?.setValue(NEXT_DATE.format('M'));
      this.Formulario.get('anio')?.setValue(NEXT_DATE.format('YYYY'));
      const OBJECT_DATE = moment(
        `${this.Formulario.get('anio')?.value}-${this.Formulario.get('mes')
          ?.value.toString()
          .padStart(2, '0')}-01`
      );
      this.Formulario.get('fechaSeleccionada')?.setValue(OBJECT_DATE);

      this.getDayFromDate(
        this.Formulario.get('mes')?.value,
        this.Formulario.get('anio')?.value
      );
    }
  }


  clickDay(day: { name: string; value: number; indexWeek: number }): void {
    const MOUNT_YEAR =
      this.Formulario.get('fechaSeleccionada')?.value.format('YYYY-MM');
    const DIA = day.value > 9 ? day.value : '0' + day.value;
    const PARSE = `${MOUNT_YEAR}-${DIA}`;
    const OBJECT_DATE = moment(PARSE);
    this.Formulario.get('dia')?.setValue(day.value);
    this.Formulario.controls['fechaString'].enable();
    this.Formulario.get('fechaString')?.setValue(
      moment(OBJECT_DATE).format('DD/MM/YYYY')
    );
    this.Formulario.controls['fechaString'].disable();
    this.Formulario.get('fechaSeleccionada')?.setValue(OBJECT_DATE);
    this.mostrar = false;

    this.valorCambiado.emit(this.Formulario.get('fechaString')?.value);
  }

  mostrarCalendario(): void {
    if (this.datos.habilitado) {
      this.mostrar = true;
    }
  }

  /**
   * @method onDocumentClick
   * @description
   * Este método escucha eventos de clic en el documento para determinar si el usuario hizo clic fuera del calendario.
   * Si el clic ocurre fuera del calendario, se oculta el componente del calendario.
   *
   * Funcionalidad:
   * - Verifica si el calendario está visible (`mostrar`).
   * - Comprueba si el clic ocurrió fuera del elemento del calendario.
   * - Si el clic es externo, cambia la propiedad `mostrar` a `false` para ocultar el calendario.
   *
   * @param {Event} event - Evento de clic en el documento.
   *
   * @example
   * // Si el usuario hace clic fuera del calendario:
   * this.onDocumentClick(event);
   * // El calendario se oculta.
   */
  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.mostrar) {
      return;
    }
    const ELEMENTO_OBJETIVO = event.target as HTMLElement;
    const CALENDARIO = document.querySelector('#calendario');

    if (CALENDARIO && !CALENDARIO.contains(ELEMENTO_OBJETIVO)) {
      this.mostrar = false;
    }
  }

  isFutureDate(day: { value: number; indexWeek: number }): boolean {
    if (!this.deshabilitarFuturas) {
      return false;
    }

    const SELECTED_YEAR = this.Formulario.get('anio')?.value;
    const SELECTMONTH = this.Formulario.get('mes')?.value;
    const DAYVALUE = day.value;

    const FECHADIA = moment(`${SELECTED_YEAR}-${SELECTMONTH}-${DAYVALUE}`, 'YYYY-M-D');
    const HOY = moment().startOf('day');

    return FECHADIA.isAfter(HOY);
  }

  isPastDate(day: { value: number; indexWeek: number }): boolean {
  if (!this.deshabilitarPasadas){
    return false;
  } 

  const SELECTED_YEAR = this.Formulario.get('anio')?.value;
  const SELECTMONTH = this.Formulario.get('mes')?.value;
  const DAYVALUE = day.value;

  const FECHADIA = moment(`${SELECTED_YEAR}-${SELECTMONTH}-${DAYVALUE}`, 'YYYY-M-D');
  const HOY = moment().startOf('day');

  return FECHADIA.isBefore(HOY);}

isDisabledDay(day: { value: number; indexWeek: number }): boolean {
  return this.isFutureDate(day) || this.isPastDate(day);
}

}
