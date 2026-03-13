import {
  Catalogo,
  CatalogoSelectComponent,
  ERROR_FORMA_ALERT,
  MaxDigitsValidator,
  REGEX_DECIMAL,
  SoloNumerosDirective,
  TituloComponent,
  esControlValido,
} from '@libs/shared/data-access-user/src';

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CatalogoT32504Service } from '../../services/catalogo-t32504.service';
import { CommonModule } from '@angular/common';
import { DatosMercanciaSubmanufactura } from '../../models/aviso.model';

/**
 * @component
 * @name AvisoComponent
 * @description Componente principal para la gestión del aviso en el trámite 32504. Permite capturar, mostrar y modificar los datos de la empresa, tipo de carga y datos manuales, así como gestionar la visualización y edición de una tabla dinámica de destinatarios.
 *
 * @property {InputConfig[]} configuracion - Configuración de los grupos y campos del formulario dinámico.
 * @property {FormularioDinamico[]} fiscal - Arreglo para la gestión de formularios dinámicos fiscales.
 * @property {FormGroup} formulario - Formulario reactivo principal del componente.
 * @property {Object} tableData - Configuración y datos de la tabla dinámica de destinatarios.
 * @property {boolean} esManualAsivoAgregarClicked - Indica si se ha hecho clic en el botón para agregar manualmente un aviso.
 * @property {typeof BotonAccionesTipos} botonAccionesTipos - Enumeración de los tipos de acciones de los botones.
 * @property {typeof TablaSeleccion} TablaSeleccion - Enumeración para la selección de filas en la tabla.
 * @property {any} evento - Objeto para almacenar eventos de interacción.
 * @property {typeof InputTypes} inputTypes - Enumeración de los tipos de input disponibles.
 * @property {Object} cargaTipo - Tipos de carga disponibles (manual o masiva).
 * @property {boolean} esFormularioSoloLectura - Indica si el formulario está en modo solo lectura.
 * @property {Subject<void>} destroyNotifier$ - Notificador para destruir suscripciones activas y evitar fugas de memoria.
 *
 **/
@Component({
  selector: 'agregar-mercancia',
  templateUrl: './agregar-mercancia.component.html',
  styleUrls: ['./agregar-mercancia.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    SoloNumerosDirective,
  ],
  providers: [],
  standalone: true,
})
export class AgregarMercanciaComponent implements OnInit, OnDestroy {
  /** Mensaje de validación para campos obligatorios. */
  mensajeCampoObligatorio: string = `<div class="text-danger">
          <small>Este campo es obligatorio</small>
        </div>`;
  /**
   * Formulario reactivo que contiene los campos de la mercancía.
   */
  mercanciaForm!: FormGroup;
  /**
   * Catálogo de fracciones arancelarias disponible para selección.
   */
  fraccionArancelariaCatalogo: Catalogo[] = [];
  /**
   * Catálogo de unidades de medida disponible para selección.
   */
  unidadMedidaCatalogo: Catalogo[] = [];
  /**
   * Mercancía que se está editando; `null` cuando se crea una nueva.
   */
  mercanciaAModificar: DatosMercanciaSubmanufactura | null | undefined = null;
  /**
   * Evento emitido cuando se agrega o edita una mercancía.
   */
  @Output() agregarMercanciaEvento =
    new EventEmitter<DatosMercanciaSubmanufactura>();

  /**
   * Configuración de alerta utilizada para mostrar errores de formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;
  /**
   * Evento emitido para solicitar el cierre del modal de mercancía.
   */
  @Output() cerrarMercanciaModalAction = new EventEmitter<void>();

  /**
   * Input que recibe la mercancía a modificar. Al establecerse,
   * precarga el formulario con los datos recibidos.
   */
  @Input() set mercanciaInput(
    mercanciaAModificar: DatosMercanciaSubmanufactura | null | undefined
  ) {
    this.mercanciaAModificar = mercanciaAModificar;
    this.procesarMercancia();
  }

  /**
   * Devuelve la mercancía actualmente cargada para edición.
   */
  get mercanciaInput(): DatosMercanciaSubmanufactura | null | undefined {
    return this.mercanciaAModificar;
  }

  /**
   * Subject que notifica la destrucción del componente para cancelar suscripciones.
   */
  destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para construir formularios reactivos.
   * @param catalogoService - Servicio para obtener catálogos del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private catalogoService: CatalogoT32504Service
  ) {}

  /**
   * Inicializa el componente y carga los catálogos necesarios.
   * @return void
   *
   */
  ngOnInit(): void {
    this.obtenerFracciones();
    this.obtenerUnidadesMedida();
  }

  /**
   * Inicializa el componente y carga los catálogos necesarios.
   */

  obtenerFracciones(): void {
    this.catalogoService
      .obtenerFraccionArancelarias()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.fraccionArancelariaCatalogo = res.datos ?? [];
      });
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias desde el servicio.
   */

  obtenerUnidadesMedida(): void {
    this.catalogoService
      .obtenerUnidadesMedida()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.unidadMedidaCatalogo = res.datos ?? [];
      });
  }

  /**
   * Obtiene el catálogo de unidades de medida desde el servicio.
   */

  /**
   * Crea el formulario reactivo para capturar los datos de la mercancía.
   */
  crearMercanciaForm(): void {
    this.mercanciaForm = this.fb.group({
      fraccionArancelaria: ['', Validators.required],
      nico: ['', Validators.required],
      unidadMedida: ['', Validators.required],
      cantidad: [
        '',
        [
          Validators.required,
          Validators.pattern(REGEX_DECIMAL),
          MaxDigitsValidator(),
        ],
      ],
      valorUSD: [
        '',
        [
          Validators.required,
          Validators.pattern(REGEX_DECIMAL),
          MaxDigitsValidator(),
        ],
      ],
      descMercancia: ['', Validators.required],
    });
  }

  agregarMercancia(): void {
    if (this.validarFormulario()) {
      const MERCANCIA: DatosMercanciaSubmanufactura = {
        idTemporal:
          this.mercanciaAModificar?.idTemporal ??
          Math.floor(Math.random() * 100),
        clave_fraccion_arancelaria: this.mercanciaForm.get(
          'fraccionArancelaria'
        )?.value,
        descFraccion: AgregarMercanciaComponent.obtenerDescripcion(
          this.fraccionArancelariaCatalogo,
          this.mercanciaForm.get('fraccionArancelaria')?.value
        ),
        nico: this.mercanciaForm.get('nico')?.value,
        descUnidadMedida: AgregarMercanciaComponent.obtenerDescripcion(
          this.unidadMedidaCatalogo,
          this.mercanciaForm.get('unidadMedida')?.value
        ),
        clave_unidad_medida: this.mercanciaForm.get('unidadMedida')?.value,
        cantidad: this.mercanciaForm.get('cantidad')?.value,
        valor_usd: this.mercanciaForm.get('valorUSD')?.value,
        descripcion_mercancia: this.mercanciaForm.get('descMercancia')?.value,
      };
      this.agregarMercanciaEvento.emit(MERCANCIA);
      this.mercanciaForm.reset();
    }
  }

  /**
   * Valida el formulario y emite el evento con la mercancía construida.
   * Si el formulario no es válido no se emite el evento.
   */

  controlValido(control: string): boolean {
    return esControlValido(this.mercanciaForm, control) ?? false;
  }

  /**
   * Indica si un control del formulario es válido y ha sido tocado.
   * @param control - Nombre del control a evaluar.
   * @returns `true` si el control es válido.
   */

  validarFormulario(): boolean {
    const ES_FORM_VALIDO = this.mercanciaForm.valid;
    if (!ES_FORM_VALIDO) {
      this.mercanciaForm.markAllAsTouched();
    }
    return ES_FORM_VALIDO;
  }

  /**
   * Valida el formulario y marca todos los controles como tocados si es inválido.
   * @returns `true` si el formulario es válido.
   */

  static obtenerDescripcion(catalogo: Catalogo[], clave: string): string {
    return catalogo.find((item) => item.clave === clave)?.descripcion || '';
  }

  /**
   * Busca la descripción asociada a una clave dentro de un catálogo.
   * @param catalogo - Array de `Catalogo` donde buscar la clave.
   * @param clave - Clave a buscar en el catálogo.
   * @returns La descripción correspondiente o cadena vacía si no existe.
   */

  procesarMercancia(): void {
    this.crearMercanciaForm();
    if (this.mercanciaAModificar) {
      this.mercanciaForm.patchValue({
        idTemporal: Math.floor(Math.random() * 100),
        fraccionArancelaria:
          this.mercanciaAModificar.clave_fraccion_arancelaria,
        nico: this.mercanciaAModificar.nico,
        unidadMedida: this.mercanciaAModificar.clave_unidad_medida,
        cantidad: this.mercanciaAModificar.cantidad,
        valorUSD: this.mercanciaAModificar.valor_usd,
        descMercancia: this.mercanciaAModificar.descripcion_mercancia,
      });
    }
  }

  /**
   * Cancelar modal de agregar mercancía y resetear el formulario.
   */
  cancelar(): void {
    this.mercanciaForm.reset();
    this.cerrarMercanciaModalAction.emit();
  }

  /**
   * Realiza la limpieza de suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.mercanciaForm.reset();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
