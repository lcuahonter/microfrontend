/**
 * @description
 * Componente para gestionar los datos del certificado en el sistema VUCEM.
 * Este componente permite la captura y gestión de información relacionada con certificados,
 * incluyendo observaciones, idioma, entidad federativa y representación federal.
 *
 * @class
 * @implements {OnDestroy}
 * @implements {OnInit}
 * @implements {OnChanges}
 *
 * @example
 * ```html
 * <app-datos-certificado-de
 *   [data]="menusDesplegables"
 *   [idioma]="true"
 *   [presenta]="true"
 *   [precisa]="false"
 *   [idoPeam]="true"
 *   [idProcedimiento]="123"
 *   [idiomaDatos]="catalogoIdiomas"
 *   [entidadFederativaDatos]="catalogoEntidades"
 *   [representacionFederalDatos]="catalogoRepresentaciones"
 *   [datosFormCertificado]="datosCertificado"
 *   [esFormularioSoloLectura]="false"
 *   (formDatosCertificadoEvent)="onDatosCertificado($event)"
 *   (idiomaSeleccionEvent)="onIdiomaSeleccionado($event)"
 *   (entidadFederativaSeleccionEvent)="onEntidadSeleccionada($event)"
 *   (representacionFederalSeleccionEvent)="onRepresentacionSeleccionada($event)"
 *   (formaValida)="onFormaValida($event)">
 * </app-datos-certificado-de>
 * ```
 */

import { Catalogo, CatalogoSelectComponent, CatalogoServices, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MenusDesplegables } from '../../models/modificacion.enum';
import { SolicitanteService } from 'libs/shared/data-access-user/src/core/services/shared/solicitante/solicitante.service';

import { CertificadosOrigenGridService } from '../../../tramites/110204/services/certificadosOrigenGrid.service';
@Component({
  selector: 'app-datos-certificado-de',
  standalone: true,
  imports: [TituloComponent, ReactiveFormsModule, CatalogoSelectComponent, CommonModule],
  templateUrl: './datos-certificado-de.component.html',
  styleUrl: './datos-certificado-de.component.scss'
})
export class DatosCertificadoDeComponent implements OnDestroy, OnInit, OnChanges {
  /**
   * @description
   * Datos de los menús desplegables que se mostrarán en el componente.
   * Contiene la información necesaria para poblar los menús desplegables del formulario.
   * 
   * @type {MenusDesplegables[]}
   * @input
   * @memberof DatosCertificadoDeComponent
   * @required
   * 
   * @example
   * ```typescript
   * [
   *   { id: 1, nombre: "Opción 1" },
   *   { id: 2, nombre: "Opción 2" }
   * ]
   * ```
   */
  @Input() data!: MenusDesplegables[];

  /**
   * Bandera que indica el idioma (true/false para español/inglés u otro par de idiomas).
   * @type {boolean}
   * @input
   */
  @Input() idioma!: boolean;
  /**
   * @description
   * Propiedad que controla la visualización del contenido del componente.
   * Cuando es `true`, se muestra la sección correspondiente.
   * Esta propiedad se utiliza para gestionar dinámicamente la visibilidad
   * desde el componente padre.
   * 
   * @type {boolean}
   * @input
   * @memberof DatosCertificadoDeComponent
   * @required
   * 
   * @example
   * ```typescript
   * <app-datos-certificado-de [presenta]="true">
   * ```
   */
  @Input() presenta!: boolean;

  /**
   * Bandera que indica si se requiere precisión en los datos.
   * @type {boolean}
   * @input
   */
  @Input() precisa!: boolean;
  /**
   * Bandera que indica si se requiere precisión en los datos.
   * @type {boolean}
   * @input
   */
  @Input() idoPeam: boolean = true;


  /**
  * @Input
  * Identificador único del procedimiento asociado.
  * Este valor es requerido y se utiliza para determinar el procedimiento actual.
  *
  * @type {number}
  */
  @Input() idProcedimiento!: number;

  /**
   * Catálogo de datos de idiomas disponibles.
   * @type {Catalogo[]}
   * @input
   */
  @Input() idiomaDatos!: Catalogo[];

  /**
   * Catálogo de datos de entidades federativas disponibles.
   * @type {Catalogo[]}
   * @input
   */
  @Input() entidadFederativaDatos!: Catalogo[];

  /**
   * Catálogo de datos de representaciones federales disponibles.
   * @type {Catalogo[]}
   * @input
   */
  @Input() representacionFederalDatos!: Catalogo[];

  /**
   * Evento que emite cuando se completan los datos del certificado.
   * @type {EventEmitter<undefined>}
   * @output
   */
  @Output() formDatosCertificadoEvent: EventEmitter<{ formGroupName: string; campo: string; valor: undefined; storeStateName: string }> = new EventEmitter<{ formGroupName: string; campo: string; valor: undefined; storeStateName: string }>();

  /**
   * Evento que emite cuando se selecciona un idioma.
   * @type {EventEmitter<Catalogo>}
   * @output
   */
  @Output() idiomaSeleccionEvent: EventEmitter<Catalogo> = new EventEmitter<Catalogo>();

  /**
   * Evento que emite cuando se selecciona una entidad federativa.
   * @type {EventEmitter<Catalogo>}
   * @output
   */
  @Output() entidadFederativaSeleccionEvent: EventEmitter<Catalogo> = new EventEmitter<Catalogo>();

  /**
   * Evento que emite cuando se selecciona una representación federal.
   * @type {EventEmitter<Catalogo>}
   * @output
   */
  @Output() representacionFederalSeleccionEvent: EventEmitter<Catalogo> = new EventEmitter<Catalogo>();

  /**
   * Objeto que contiene los datos del formulario del certificado.
   * @type {{ [key:string]: unknown }}
   * @input
   */
  @Input() datosFormCertificado!: { [key: string]: unknown };

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /**
   * Emisor de eventos para indicar si el formulario es válido.
   * @type {EventEmitter<boolean>}
   */
  @Output() formaValida: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /**
   * Formulario reactivo que contiene los datos del certificado.
   * Utilizado para la validación y gestión de los datos en el formulario.
   */
  formDatosCertificado!: FormGroup;

  /**
   * Subject utilizado para gestionar el ciclo de vida del componente y cancelar las suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Observable que contiene la lista de idiomas disponibles.
   */
  idioma$: Catalogo[] = [];

  /**
   * Observable que contiene la lista de entidades federativas disponibles.
   */
  entidadFederativas$: Catalogo[] = [];

  /**
   * Observable que contiene la lista de representaciones federales disponibles.
   */
  representacionFederal$: Catalogo[] = [];
  /**
 * Indica si el formulario debe mostrarse solo en modo de lectura.
 * @type {boolean}
 */
  @Input() esFormularioSoloLectura!: boolean;

  /**  
   * Estado de la consulta asociado al trámite.
   */
  @Input() consultaioState!: boolean;
  /**
   * @description
   * Constructor del componente que inicializa el formulario y sus dependencias.
   * Inyecta el servicio FormBuilder necesario para la creación del formulario reactivo.
   * 
   * @constructor
   * @param {FormBuilder} fb - Servicio de Angular para la construcción de formularios reactivos
   * @memberof DatosCertificadoDeComponent
   * 
   * @example
   * ```typescript
   * constructor(private fb: FormBuilder) {
   *   // Inicialización del componente
   * }
   * ```
   */

  private actualizandoFormulario = false;

  constructor(
    private fb: FormBuilder,
    private catalogoServices: CatalogoServices,
    private certificadosOrigenGridService: CertificadosOrigenGridService,
    private solicitanteService: SolicitanteService,
     private validacionesService: ValidacionesFormularioService
  ) {
  }
  /**
 * @inheritdoc
 * 
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * Inicializa el estado del formulario llamando a `inicializarEstadoFormulario()`.
 */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.cargarIdioma(this.idProcedimiento.toString());
    this.cargarEntidadFederativa();
    if (this.datosFormCertificado['EntidadFederativaDates']) {
      const ENTIDAD_FEDERATIVA = { clave: String(this.datosFormCertificado['EntidadFederativaDates']), descripcion:  DatosCertificadoDeComponent.obtenerDescripcion(this.entidadFederativaDatos, String(this.datosFormCertificado['EntidadFederativaDates'])) };
      this.getRepresentacionDatos(ENTIDAD_FEDERATIVA);
      this.formDatosCertificado.patchValue({
        representacionFederalDates: this.datosFormCertificado['representacionFederalDates']
      })
    }
  }
  /**
* Evalúa si se debe inicializar o cargar datos en el formulario.
*/
  inicializarEstadoFormulario(): void {
    if (!this.formDatosCertificado) {
      this.createForm();
    }
    if (this.esFormularioSoloLectura) {
      this.formDatosCertificado.disable();
    }

    if (this.consultaioState) {
      this.formDatosCertificado.get('EntidadFederativaDates')?.valueChanges
        .pipe(take(1))
        .subscribe(value => {
          if (value) { this.getRepresentacionDatos(value, true); }
        });
    }
  }

  /**
   * @description
   * Establece el valor por defecto para el campo idiomaDates después de cargar los datos.
   */
  private setDefaultIdiomaValue(): void {
    if (this.formDatosCertificado && this.idiomaDatos && this.idiomaDatos.length > 0) {
      const CURRENT_VALUE = this.formDatosCertificado.get('idiomaDates')?.value;
      if (!CURRENT_VALUE || CURRENT_VALUE === '' || CURRENT_VALUE === -1 || CURRENT_VALUE === '-1') {
        const DEFAULT_VALUE = this.idiomaDatos[0].id || this.idiomaDatos[0].clave;
        if (DEFAULT_VALUE) {
          this.formDatosCertificado.get('idiomaDates')?.setValue(DEFAULT_VALUE, { emitEvent: false });
          this.setValoresStore('formDatosCertificado', 'idiomaDates', 'setFormDatosCertificado');
        }
      }
    }
  }

  /**
   * @description
   * Crea e inicializa el formulario reactivo `formDatosCertificado` con sus controles y validaciones.
   * 
   * @method
   * @private
   * @memberof DatosCertificadoDeComponent
   * 
   * @remarks
   * Este método configura los siguientes campos del formulario:
   * - observacionesDates: Campo de texto libre sin validaciones
   * - presenta: Campo booleano sin validaciones
   * - idiomaDates: Campo requerido con validación de valor mínimo si idoPeam es true
   * - EntidadFederativaDates: Campo requerido con validación de valor mínimo
   * - representacionFederalDates: Campo requerido con validación de valor mínimo
   * - precisaDates: Campo requerido solo si precisa es true
   * 
   * @example
   * ```typescript
   * private createForm(): void {
   *   this.formDatosCertificado = this.fb.group({
   *     observacionesDates: [''],
   *     presenta: [''],
   *     idiomaDates: ['', this.idoPeam ? [Validators.required, Validators.min(0)] : []],
   *     EntidadFederativaDates: ['', [Validators.required, Validators.min(0)]],
   *     representacionFederalDates: ['', [Validators.required, Validators.min(0)]],
   *     precisaDates: ['', this.precisa ? [Validators.required] : []]
   *   });
   * }
   * ```
   */
  createForm(): void {
    this.formDatosCertificado = this.fb.group({
      observacionesDates: ['', [Validators.maxLength(500)]],
      presenta: [''],
      idiomaDates: ['', this.idoPeam ? [Validators.required, Validators.min(0)] : []],
      EntidadFederativaDates: ['', [Validators.required, Validators.min(0)]],
      representacionFederalDates: ['', [Validators.required, Validators.min(0)]],
      precisaDates: ['', this.precisa ? [Validators.required] : []]
    });
    this.formDatosCertificado.patchValue(this.datosFormCertificado);
    queueMicrotask(() => {
      this.formDatosCertificado.updateValueAndValidity({ emitEvent: false });
      this.formaValida.emit(this.formDatosCertificado.valid);
    });
  }

   /**
 * @method obtenerDescripcion
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public static obtenerDescripcion(array: Catalogo[], clave: string): string {
    const DESCRIPCION = array.find((ele: Catalogo) => ele.clave === clave)?.descripcion;
    return DESCRIPCION ?? '';
  }


 /**
   * @method ngOnChanges
   * @description
   * Método del ciclo de vida que se llama cuando cambia alguna propiedad enlazada por datos.
   * Específicamente, verifica si el input `datosForm` ha cambiado. Si es así, actualiza el
   * formulario `formDatosDelDestinatario` con los nuevos valores de `datosForm`. Si el formulario
   * no existe, lo crea.
   * 
   * @param changes - Objeto con pares clave/valor de las propiedades que han cambiado.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosFormCertificado'] && this.datosFormCertificado) {
      if (this.formDatosCertificado) {
        this.formDatosCertificado.patchValue(this.datosFormCertificado);
      } else {
        this.createForm();
      }
    }

    if (this.isContinuarTriggered) { 
      Promise.resolve().then(() => {
        this.validarFormularios();
      });
    }
  }
  /**
   * Getter para acceder al control del formulario, utilizado para la validación.
   * @returns FormControl del formulario.
   */
  get formularioControl(): FormControl {
    return this.formDatosCertificado.get('') as FormControl;
  }

  /**
    * Establece valores en el store y emite eventos relacionados con el formulario.
    *
    * @param formGroupName - El nombre del grupo de formulario al que pertenece el campo.
    * @param campo - El nombre del campo cuyo valor se desea obtener y procesar.
    * @param storeStateName - El nombre del estado en el store asociado al campo.
    * 
    * @remarks
    * Este método obtiene el valor de un campo específico del formulario `formDatosDelDestinatario`,
    * emite un evento para indicar si el formulario es válido y otro evento con los datos del campo
    * y su estado asociado en el store.
    */
  setValoresStore(formGroupName: string, campo: string, storeStateName: string): void {
    const VALOR = this.formDatosCertificado.get(campo)?.value;
    this.formaValida.emit(this.formDatosCertificado.valid);
    this.formDatosCertificadoEvent.emit({ formGroupName, campo, valor: VALOR, storeStateName });
  }


  /**
   * Método que selecciona un idioma y actualiza el estado en el store.
   * @param estado El estado del idioma seleccionado.
   */
  idiomaSeleccion(estado: Catalogo): void {
    this.idiomaSeleccionEvent.emit(estado);
  }

  /**
   * Método que selecciona una entidad federativa y actualiza el estado en el store.
   * @param estado El estado de la entidad federativa seleccionada.
   */
  entidadFederativaSeleccion(estado: Catalogo): void {
    this.entidadFederativaSeleccionEvent.emit(estado);
  }

  /**
   * Método que selecciona una representación federal y actualiza el estado en el store.
   * @param estado El estado de la representación federal seleccionada.
   */
  representacionFederalSeleccion(estado: Catalogo): void {
    this.representacionFederalSeleccionEvent.emit(estado);
  }

  /**
 * Método para cargar la lista de idiomas desde el servicio global.
 */
  cargarIdioma(tramite: string): void {
    if (this.idioma === true) {
      this.catalogoServices
        .catalogoIdioma(tramite)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(
          (data) => {
            this.idiomaDatos = data.datos as Catalogo[];
            this.setDefaultIdiomaValue();
          }
        );
    }
  }

  /**
 * Método para cargar la lista de entidades federativas desde el servicio global.
 */
  cargarEntidadFederativa(): void {
    this.catalogoServices
      .entidadesFederativasCatalogo(this.idProcedimiento.toString())
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          this.entidadFederativaDatos = data.datos as Catalogo[];
        }
      );
  }

  /**
   * Maneja el evento de cambio cuando se selecciona una nueva entidad federativa.
   * Actualiza la lista de representaciones federales basándose en la entidad seleccionada.
   * @param event - Objeto Catalogo que representa la entidad seleccionada.
   */
  onChangeEntidad(event: Catalogo): void {
    this.certificadosOrigenGridService.catalogo=event.descripcion;
    this.solicitanteService.catalogoEntidad=event.descripcion;
    const ENTIDAD_SELECCIONADA = event;
    this.getRepresentacionDatos({
      clave: ENTIDAD_SELECCIONADA.clave ?? '',
      descripcion: ENTIDAD_SELECCIONADA.descripcion ?? ''
    }, false);
    this.entidadFederativaSeleccionEvent.emit(ENTIDAD_SELECCIONADA);
  }

  /**
   * Obtiene los datos del catálogo de representaciones federales basado en la clave de entidad proporcionada.
   * Los datos recuperados se asignan a la propiedad `representacionFederal$`.
   * La suscripción al observable se cancela automáticamente cuando el componente se destruye.
   * @param cveEntidad - Clave de la entidad para filtrar las representaciones federales.
   */
  getRepresentacionDatos(
    cveEntidad: { clave: string; descripcion: string },
    flag: boolean = false
  ): void {

    this.catalogoServices
      .representacionFederalCatalogo(
        this.idProcedimiento.toString(),
        cveEntidad.clave ?? cveEntidad
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((res) => {
        const CATALOGOS = res.datos ?? [];

        let MATCHED: Catalogo | undefined;
        let OTHERS: Catalogo[];

        if (flag === true) {
          const VALUE = (this.datosFormCertificado['representacionFederalDates'] !== undefined && this.datosFormCertificado['representacionFederalDates'] !== null)
            ? this.datosFormCertificado['representacionFederalDates'].toString().trim().toLowerCase()
            : '';

          MATCHED = CATALOGOS.find(
            (item) =>
              (item.clave ?? '').toString().trim().toLowerCase() === VALUE
          );

          OTHERS = CATALOGOS.filter(
            (item) =>
              (item.descripcion ?? '').toString().trim().toLowerCase() !== VALUE
          );
        }

        else {
          const DESC = (cveEntidad.descripcion ?? '')
            .toString()
            .trim()
            .toLowerCase();

          MATCHED = CATALOGOS.find(
            (item) =>
              (item.descripcion ?? '').toString().trim().toLowerCase() === DESC
          );

          OTHERS = CATALOGOS.filter(
            (item) =>
              (item.descripcion ?? '').toString().trim().toLowerCase() !== DESC
          );
        }

        this.formDatosCertificado
          .get('representacionFederalDates')
          ?.setValue(MATCHED && MATCHED.clave ? MATCHED.clave : null);

        this.representacionFederal$ = MATCHED ? [MATCHED, ...OTHERS] : OTHERS;

        this.setValoresStore('', 'representacionFederalDates', '');
      });
  }



  /** Método público para marcar todos los campos como tocados y mostrar errores */
  public markAllFieldsTouched(): void {
    if (this.formDatosCertificado) {
      this.formDatosCertificado.markAllAsTouched();
    }
  }

    /**
   * Valida un campo del formulario.
   *
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }
  /**
   * @description
   * Valida el estado completo del formulario de datos del certificado.
   * Si el formulario no es válido, marca todos los campos como tocados para mostrar los errores.
   * 
   * @method
   * @public
   * @memberof DatosCertificadoDeComponent
   * @returns {boolean} - Retorna true si el formulario es válido, false en caso contrario
   * 
   * @example
   * ```typescript
   * if (this.validarFormularios()) {
   *   // Proceder con el envío del formulario
   * } else {
   *   // Mostrar mensaje de error
   * }
   * ```
   */
  validarFormularios(): boolean {
    if (this.formDatosCertificado.valid) {
      return true;
    }
    this.formDatosCertificado.markAllAsTouched();
    return false;
  }
  /**
   * @description
   * Método del ciclo de vida que se ejecuta cuando el componente va a ser destruido.
   * Se encarga de limpiar las suscripciones y recursos para evitar fugas de memoria.
   * 
   * @method
   * @public
   * @memberof DatosCertificadoDeComponent
   * @implements {OnDestroy}
   * 
   * @example
   * ```typescript
   * // La implementación completa del método
   * ngOnDestroy(): void {
   *   this.destroyNotifier$.next();
   *   this.destroyNotifier$.complete();
   * }
   * ```
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
