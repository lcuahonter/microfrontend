import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AlertComponent, CatalogoSelectComponent
} from '@libs/shared/data-access-user/src';
import { PeriodoCatalogo } from '../../models/tramite319-state.model';
import {
  INFO_ALERT,
  MENOR_TEXTO,
  PERIODO_ERROR,
  PERIODO_TEXTO,
  REGISTRO_TEXTO,
  TEXTOS,
} from '../../constantes/operaciones-de-comercio-exterior.enum';
import { OperacionService } from '../../services/operacion.service';
import { Subject, takeUntil } from 'rxjs';
import { Tramite319Store } from '../../estados/tramite319Store.store';
import { Solicitar } from '../../models/personas';
import { Tramite319Query } from '../../estados/tramite319Query.query';

@Component({
  selector: 'app-periodos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AlertComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './periodos.component.html',
})
export class PeriodosComponent implements OnInit {
  /**
   * Texto para mostrar en la alerta.
   * @property {string} textos
   */
  public textos: string = '';

  /**
   * Sujeto para destruir suscripciones.
   * @property {Subject<void>} destroyNotifier$
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos de la tabla de solicitudes.
   * @property {Solicitar[]} cuerpoSolicitarTablaFila
   */
  public cuerpoSolicitarTablaFila: Solicitar[] = [];

  /**
   * Información de alerta.
   * @property {string} infoAlerta
   */
  public infoAlerta: string = INFO_ALERT;

  /**
   * Indica si el modal emergente está visible.
   * @property {boolean} modalEmergente
   */
  public modalEmergente: boolean = false;

  @Output() agregarPeriodos = new EventEmitter<Solicitar>();

  constructor(
    private fb: FormBuilder,
    public readonly operacionService: OperacionService,
    private tramite319Store: Tramite319Store,
    private tramite319Query: Tramite319Query
  ) {}

  ngOnInit(): void {
    this.periodoForm = this.fb.group({
      periodo: ['', [Validators.required]],
      periodoInicial: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/),
          Validators.maxLength(7),
        ],
      ],
      periodoFinal: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/),
          Validators.maxLength(7),
        ],
      ],
    });
    this.getperiodoList();
    this.obtenerEstatusSolicitud();
  }

  /**
   * Formulario para la gestión de periodos.
   * @property {FormGroup} periodoForm
   */
  public periodoForm!: FormGroup;

  /**
   * Lista de periodos para el select.
   * @property {Catalogo[]} periodoList
   */
  public periodoList: PeriodoCatalogo[] = [];

  /**
   * Indica si se muestra la alerta.
   * @property {boolean} vistaAlerta
   */
  public vistaAlerta: boolean = false;

  /**
   * Obtiene el estatus de la solicitud desde el estado del trámite.
   */
  obtenerEstatusSolicitud(): void {
    this.tramite319Query
      .select((state) => state.lista_periodos_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estatus) => {
        this.cuerpoSolicitarTablaFila = estatus || [];
      });
  }

  /**
   * Valida errores relacionados con el periodo seleccionado.
   * Verifica si existe un periodo diferente en la tabla o si las fechas ya están registradas.
   * Si no hay errores, procede con la validación de valores.
   * @method PeriodoError
   */
  public PeriodoError(): void {
    const SELECTEDPERIODODESC =
      this.periodoList.find(
        (item) => item.clave === this.periodoForm.value.periodo
      )?.descripcion || '';
    if (
      this.cuerpoSolicitarTablaFila.some(
        (item) => item.periodo_desc !== SELECTEDPERIODODESC
      )
    ) {
      this.vistaAlerta = true;
      this.textos = PERIODO_ERROR;
    }
    // Check if the fechas_sobre_el_periodo already exists in cuerpoSolicitarTablaFila
    else if (
      this.cuerpoSolicitarTablaFila.some(
        (item) =>
          item.fechas_periodo ===
          this.periodoForm.value.periodoInicial +
            ' al ' +
            this.periodoForm.value.periodoFinal
      )
    ) {
      this.vistaAlerta = true;
      this.textos = REGISTRO_TEXTO;
    } else {
      this.valorValido();
    }
  }

  /**
   * Valida que los valores del periodo sean correctos según las reglas de negocio.
   * Verifica si el periodo está fuera de rango, si las fechas son futuras o si la fecha final es anterior a la inicial.
   * Si todas las validaciones pasan, agrega el periodo a la tabla de solicitudes.
   * @method valorValido
   */
  public valorValido(): void {
    const [INITIALMONTH, INITIALYEAR] = (
      this.periodoForm.value.periodoInicial || ''
    )
      .split('/')
      .map(Number);
    const [FINALMONTH, FINALYEAR] = (this.periodoForm.value.periodoFinal || '')
      .split('/')
      .map(Number);
    const NOW = new Date();
    const CURRENTMONTH = NOW.getMonth() + 1;
    const CURRENTYEAR = NOW.getFullYear();
    const PERIODOSELECCIONADO = this.periodoList.find(
      (item) => item.clave === this.periodoForm.value.periodo
    );
    const INITIALSELECTED = this.obtieneAnioDelPeriodo(
      PERIODOSELECCIONADO?.descripcion || '',
      true
    );
    const FINALSELECTED = this.obtieneAnioDelPeriodo(
      PERIODOSELECCIONADO?.descripcion || '',
      false
    );

    if (
      this.isPeriodoOutOfRange(
        INITIALSELECTED,
        FINALSELECTED,
        PERIODOSELECCIONADO,
        INITIALYEAR,
        FINALYEAR
      )
    ) {
      this.vistaAlerta = true;
      this.textos = PERIODO_TEXTO;
    } else if (
      this.isFinalDateInFutureOrPresent(
        FINALYEAR,
        FINALMONTH,
        CURRENTYEAR,
        CURRENTMONTH
      )
    ) {
      this.vistaAlerta = true;
      this.textos = `<p style="text-align: center;">${TEXTOS} ${this.periodoForm.value.periodoFinal}</p>`;
    } else if (
      this.isFinalDateBeforeInitial(
        FINALYEAR,
        INITIALYEAR,
        FINALMONTH,
        INITIALMONTH
      )
    ) {
      this.vistaAlerta = true;
      this.textos = MENOR_TEXTO;
    } else {
      const PERIODO = {
        id_periodo_solicitud: null,
        id_solicitud: null,
        periodo_desc:
          this.periodoList.find(
            (item) => item.clave === this.periodoForm.value.periodo
          )?.descripcion || '',
        fechas_periodo:
          this.periodoForm.value.periodoInicial +
          ' al ' +
          this.periodoForm.value.periodoFinal,
        periodo_inicio: this.periodoForm.value.periodoInicial,
        periodo_fin: this.periodoForm.value.periodoFinal,
        periodo: this.periodoForm.value.periodo,
      };
      this.agregarPeriodos.emit(PERIODO);
      this.periodoForm.reset();
      this.vistaAlerta = false;
    }
  }

  /**
   * Verifica si el periodo seleccionado está fuera del rango permitido.
   * Compara los años inicial y final con los límites del periodo seleccionado.
   * @method isPeriodoOutOfRange
   * @param {number} INITIALSELECTED - Año inicial del periodo seleccionado
   * @param {number} FINALSELECTED - Año final del periodo seleccionado
   * @param {PeriodoCatalogo | undefined} PERIODOSELECCIONADO - El periodo seleccionado del catálogo
   * @param {number} INITIALYEAR - Año inicial del periodo a validar
   * @param {number} FINALYEAR - Año final del periodo a validar
   * @returns {boolean} True si el periodo está fuera de rango, false en caso contrario
   */
  private isPeriodoOutOfRange(
    INITIALSELECTED: number,
    FINALSELECTED: number,
    PERIODOSELECCIONADO: PeriodoCatalogo | undefined,
    INITIALYEAR: number,
    FINALYEAR: number
  ): boolean {
    return Boolean(
      PERIODOSELECCIONADO &&
        typeof INITIALSELECTED === 'number' &&
        typeof FINALSELECTED === 'number' &&
        (INITIALYEAR < INITIALSELECTED ||
          INITIALYEAR > FINALSELECTED ||
          FINALYEAR > FINALSELECTED ||
          FINALYEAR < INITIALSELECTED)
    );
  }

  /**
   * Verifica si la fecha final está en el futuro o es la fecha presente.
   * Compara el año y mes final con la fecha actual.
   * @method isFinalDateInFutureOrPresent
   * @param {number} FINALYEAR - Año final del periodo
   * @param {number} FINALMONTH - Mes final del periodo
   * @param {number} CURRENTYEAR - Año actual
   * @param {number} CURRENTMONTH - Mes actual
   * @returns {boolean} True si la fecha final es futura o presente, false en caso contrario
   */
  private isFinalDateInFutureOrPresent(
    FINALYEAR: number,
    FINALMONTH: number,
    CURRENTYEAR: number,
    CURRENTMONTH: number
  ): boolean {
    return (
      FINALYEAR > CURRENTYEAR ||
      (FINALYEAR === CURRENTYEAR && FINALMONTH > CURRENTMONTH) ||
      (FINALYEAR === CURRENTYEAR && FINALMONTH === CURRENTMONTH)
    );
  }

  /**
   * Agrega una nueva persona a la tabla de solicitudes si el formulario de periodo es válido.
   * Si no es válido, muestra una alerta con el mensaje correspondiente.
   * @method agregarPersona
   */
  public agregarPersona(): void {
    if (this.periodoForm.valid) {
      this.PeriodoError();
    } else {
      this.periodoForm.markAllAsTouched();
    }
  }

  /**
   * Verifica si la fecha final es anterior a la fecha inicial.
   * Compara los años y meses para determinar si el rango de fechas es válido.
   * @method isFinalDateBeforeInitial
   * @param {number} FINALYEAR - Año final del periodo
   * @param {number} INITIALYEAR - Año inicial del periodo
   * @param {number} FINALMONTH - Mes final del periodo
   * @param {number} INITIALMONTH - Mes inicial del periodo
   * @returns {boolean} True si la fecha final es anterior a la inicial, false en caso contrario
   */
  private isFinalDateBeforeInitial(
    FINALYEAR: number,
    INITIALYEAR: number,
    FINALMONTH: number,
    INITIALMONTH: number
  ): boolean {
    return (
      FINALYEAR < INITIALYEAR ||
      (FINALYEAR === INITIALYEAR && FINALMONTH < INITIALMONTH)
    );
  }

  /**
   * Obtiene la lista de periodos desde el servicio.
   * @method getperiodoList
   */
  public getperiodoList(): void {
    this.operacionService
      .obtenerPeriodoList<PeriodoCatalogo[]>()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.periodoList = data.datos || [];
      });
  }

  /**
   * @method formatPeriodoInicial
   * @description
   * Formatea automáticamente el campo de periodo inicial agregando una barra diagonal (/)
   * después de ingresar 2 dígitos para seguir el formato MM/YYYY.
   *
   * @param {Event} event - Evento del input que contiene el valor del campo.
   * @returns {void}
   */
  formatPeriodoInicial(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    let value = INPUT.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 6);
    }

    // Update the form control value
    this.periodoForm.patchValue({
      periodoInicial: value,
    });
  }

  /**
   * @method formatPeriodoFinal
   * @description
   * Formatea automáticamente el campo de periodo inicial agregando una barra diagonal (/)
   * después de ingresar 2 dígitos para seguir el formato MM/YYYY.
   *
   * @param {Event} event - Evento del input que contiene el valor del campo.
   * @returns {void}
   */
  formatPeriodoFinal(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    let value = INPUT.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 6);
    }

    // Update the form control value
    this.periodoForm.patchValue({
      periodoFinal: value,
    });
  }

  /**
   * Elimina un elemento de la tabla de pedimento si se confirma la acción.
   * @method eliminarPedimento
   * @param {boolean} borrar - Indica si se debe proceder con la eliminación.
   */
  public eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.tramite319Store.actualizarDatosForma(this.cuerpoSolicitarTablaFila);
    }
  }

  /**
   * Obtiene el año inicial o final del periodo dado.
   * @method obtieneAnioDelPeriodo
   * @param {string} periodo - Descripción del periodo.
   * @param {boolean} esInicial - Indica si se desea obtener el año inicial (true) o final (false).
   * @returns {number} El año inicial o final del periodo.
   * @throws {Error} Si el formato del periodo no es reconocido o si no se encuentra el año inicial.
   */
  public obtieneAnioDelPeriodo(periodo: string, esInicial: boolean): number {
    const CURRENT_YEAR = new Date().getFullYear();
    const NORMALIZED = periodo.toLowerCase();

    if (NORMALIZED.includes('a la fecha')) {
      const MATCH = periodo.match(/\d{4}/);
      if (!MATCH) {
        throw new Error('No se encontró año inicial');
      }

      const START_YEAR = parseInt(MATCH[0], 10);
      return esInicial ? START_YEAR : CURRENT_YEAR;
    }

    const MATCH = periodo.match(/(\d{4}).*?(\d{4})/);
    if (MATCH) {
      const START_YEAR = parseInt(MATCH[1], 10);
      const END_YEAR = parseInt(MATCH[2], 10);
      return esInicial ? START_YEAR : END_YEAR;
    }

    throw new Error('Formato no reconocido');
  }

  /**
   * reinicia el formulario de periodo.
   */
  reiniciarForm(): void {
    this.vistaAlerta = false;
    this.periodoForm.reset();
  }
}
