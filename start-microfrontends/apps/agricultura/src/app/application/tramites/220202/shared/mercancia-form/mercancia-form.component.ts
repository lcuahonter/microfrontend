import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Sensible,
} from '../../../../shared/models/datos-de-la-solicitue.model';
import {
  Catalogo,
  CatalogoSelectComponent,
  CrosslistComponent,
  NUMERICO_CON_PUNTO_REGEX,
  REGEX_DESCRIPCION,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import {
  AnimalesEventos,
  CrossListEtiqueta,
  DatosMercancia,
  FilaSolicitud,
  ListaDeDatosFinal,
} from '../../models/220202/fitosanitario.model';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { CatalogosService } from '../../services/220202/catalogos/catalogos.service';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { RegistroSolicitudService } from '../../services/220202/registro-solicitud/registro-solicitud.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-mercancia-form',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    ReactiveFormsModule,
    CrosslistComponent,
    TooltipModule,
  ],
  templateUrl: './mercancia-form.component.html',
  styleUrls: ['./mercancia-form.component.scss'],
})
export class MercanciaFormComponent implements OnInit, OnDestroy {
  /**
   * Representa el formulario reactivo utilizado para gestionar los datos de la mercancía
   * en el componente de detalles de animales vivos.
   *
   * @type {FormGroup}
   */
  mercanciaForm!: FormGroup;

  /**
   * Lista de referencias a todos los componentes CrosslistComponent presentes en la plantilla.
   * Utiliza ViewChildren para obtener acceso a múltiples instancias del componente CrosslistComponent
   * Esta propiedad permite interactuar con los métodos y propiedades de los componentes
   * @type {QueryList<CrosslistComponent>}
   * @see CrosslistComponent
   */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;

  /**
   * Representa el formulario reactivo utilizado para gestionar los detalles específicos
   * de los animales vivos, como número de lote, color de pelaje, edad, etc.
   *
   * @type {FormGroup}
   */
  detalleForm!: FormGroup;

  /**
   * Datos de la solicitud que se recibirán como entrada en el componente.
   * @type {DatosDeLaSolicitud}
   */
  @Input() catalogosDatos: DatosMercancia = {} as DatosMercancia;

  @Output() cerrar = new EventEmitter<void>();

  /**
   * Lista de datos sensibles que se mostrarán en la tabla de detalles de animales vivos.
   *
   * @type {Sensible[]}
   */
  @Input() sensiblesTablaDatos: Sensible[] = [];

  /**
   * Datos del formulario de solicitud de animales vivos.
   * Este objeto contiene la información relacionada con la solicitud de animales vivos,
   * como los detalles de la mercancía y los datos específicos de los animales.
   *
   * @type {AnimalesFormularioSolicitud}
   */
  @Input() formularioSolicitud!: FilaSolicitud;

  /**
   * Evento que se emite cuando se agregan datos al formulario de solicitud de animales vivos.
   * Este evento permite al componente padre recibir los datos del formulario para su procesamiento.
   *
   * @type {EventEmitter<AnimalesEventos>}
   */
  @Output() agregarDatosFormulario = new EventEmitter<AnimalesEventos>();

  /**
   * Etiquetas para la lista cruzada de normas seleccionadas.
   * @type {CrossListEtiqueta}
   */
  public usoNormaSeleccionadaLabel: CrossListEtiqueta = {
    tituluDeLaIzquierda: 'Nombre científico',
    derecha: 'Nombre científico seleccionado',
  };

  /**
   * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
   *
   * @type {Subject<void>}
   * @private
   */
  private destroy$ = new Subject<void>();

  /**
   * Define el tipo de selección de la tabla, en este caso, se utiliza un checkbox para seleccionar filas.
   *
   * @type {TablaSeleccion}
   */
  public tablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Almacena los datos sensibles seleccionados en la tabla.
   * Esta propiedad se utiliza para realizar operaciones como eliminar o procesar los datos seleccionados.
   *
   * @type {Sensible[]}
   */
  public sensiblesTablaSeleccionada: Sensible[] = [];

  /**
   * @description Sujeto privado que notifica la destrucción del componente.
   * @type {Subject<void>}
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * @description Arreglo público que almacena una lista de datos para uso en la funcionalidad de lista cruzada.
   * @type {string[]}
   */
  public usoCrossListDatos: string[] = [];
  public usoCrossListDatosElegidos: string[] = [];

  /**
   * Indica si el formulario tiene errores de validación.
   *
   * Se utiliza para mostrar/ocultar el alert de errores en el modal.
   */
  esFormaValido: boolean = false;

  /**
   * Mensaje de error del formulario para mostrar en el alert.
   *
   * Contiene el HTML del mensaje de error a mostrar cuando hay validaciones fallidas.
   */
  formErrorAlert: string =
    '<strong>¡Error de registro! </strong> Faltan campos por capturar';

  /**
   * Marca para rastrear si se intentó enviar el formulario.
   * Se utiliza para controlar cuándo mostrar errores de validación en campos deshabilitados.
   */
  formSubmissionAttempted: boolean = false;

  /**
   * Marcar para rastrear si se  selecciona "Inspección Ocular"
   * Se utiliza para ocultar/mostrar el campo "Requisito"
   */
  isInspeccionOcularSelected: boolean = false;

  /**
   * Arreglo que almacena el catálogo de tipos de requisito.
   */
  tipoRequisitoList: Catalogo[] = [];
  /**
   * Arreglo que almacena el catálogo de vida silvestre.
   */
  vidaSilvestreLista: Catalogo[] = [];

  /**
   * Arreglo que almacena la descripcion vida silvestre.
   */
  vidaSilvestreListaTextos: string[] = [];

  /**
   * Arreglo que almacena los elegidos de vida silvestre.
   */
  vidaSilvestreElegidos: Catalogo[] = [];

  /**
   * @description Lista de paises.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de paises en el formulario.
   */
  catalogosDatosPaisOrigenList: Catalogo[] = [];

  /**
   * @description Lista de pais Destino.
   * Este array contiene los objetos `Catalogo` que se utilizan para poblar el selector de pais Destino en el formulario.
   */
  catalogosDatosPaisDestinoList: Catalogo[] = [];

  /**
   * Constructor del componente.
   *
   * @param fb FormBuilder para crear formularios reactivos.
   * @param ubicaccion Servicio de ubicación para navegar entre rutas.
   * @param route Ruta activa para obtener parámetros de la URL.
   * @param agriculturaApiService Servicio para interactuar con la API de Agricultura.
   * @param fitosanitarioQuery Consulta para obtener datos relacionados con fitosanitarios.
   */
  constructor(
    private fb: FormBuilder,
    private ubicaccion: Location,
    private route: ActivatedRoute,
    private readonly agriculturaApiService: AgriculturaApiService,
    private readonly fitosanitarioQuery: FitosanitarioQuery,
    private registroSolicitudService: RegistroSolicitudService,
    private catalogosService: CatalogosService
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se crea el formulario reactivo y se configuran los campos necesarios.
   */
  ngOnInit(): void {
    this.obtenerCatalogos();
    this.crearFormulario();

    this.fitosanitarioQuery
      .select((state: ListaDeDatosFinal) => state.usoCrossListDatos)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: string[]) => {
        this.usoCrossListDatosElegidos = [...datos];
      });
  }

  /**
   * Metodo que englobará todos los catalogos a obtener.
   * @returns void
   */
  obtenerCatalogos(): void {
    this.obtenerCatalogoRestricciones();
    this.obtenerCtalogosMercancia();
    this.obtieneCatalogoVidaSilvestre();
  }

  /**
   * Obtiene el catálogo de restricciones del servicio correspondiente.
   * Realiza una llamada al servicio de catálogos para obtener las restricciones
   * asociadas al trámite 220202.
   * Los datos obtenidos se almacenan en la propiedad tipoRequisitoList.
   * La suscripción se cancela automáticamente cuando el componente se destruye
   * mediante el uso de takeUntil.
   * @returns void
   */
  obtenerCatalogoRestricciones(): void {
    this.catalogosService
      .obtieneCatalogoRestricciones(220202)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.tipoRequisitoList = data.datos ?? [];
      });
  }

  /**
   * Obtiene el catálogo de vida silvestre.
   * Realiza una llamada al servicio de catálogos para crosslist de vida silvestre
   * asociadas al trámite 220202.
   * Los datos obtenidos se almacenan en la propiedad tipoRequisitoList.
   * La suscripción se cancela automáticamente cuando el componente se destruye
   * mediante el uso de takeUntil.
   * @returns void
   */
  obtieneCatalogoVidaSilvestre(): void {
    this.catalogosService
      .obtieneCatalogoVidaSilvestre(220202)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (data) => {
          this.vidaSilvestreLista = data.datos ?? [];
          if (data.datos !== undefined) {
            this.vidaSilvestreListaTextos =
              data.datos.map((dt) => dt.descripcion) ?? [];
            this.usoCrossListDatos = [...this.usoCrossListDatos];
          }
        },
      });
  }

  crearFormulario(): void {
    this.mercanciaForm = this.fb.group({
      id: [0],
      tipoRequisito: ['', Validators.required],
      requisito: ['', Validators.required],
      descripcionTipoRequisito: [''],
      numeroCertificadoInternacional: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(REGEX_DESCRIPCION),
        ],
      ],
      fraccionArancelaria: ['', Validators.required],
      descripcionFraccion: [{ value: '', disabled: true }, Validators.required],
      idDescripcionFraccion: [0],
      nico: ['', Validators.required],
      descripcionNico: [{ value: '', disabled: true }],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.maxLength(1000),
        ],
      ],
      cantidadUMT: [
        '',
        [
          Validators.required,
          Validators.pattern(NUMERICO_CON_PUNTO_REGEX),
          MercanciaFormComponent.maxDecimalsValidator,
          MercanciaFormComponent.maxWholeNumbersValidator,
        ],
      ],
      umt: [{ value: '', disabled: true }, Validators.required],
      descripcionUMT: [{ value: '', disabled: true }, Validators.required],
      cantidadUMC: [
        '',
        [
          Validators.required,
          Validators.pattern(NUMERICO_CON_PUNTO_REGEX),
          MercanciaFormComponent.maxDecimalsValidator,
          MercanciaFormComponent.maxWholeNumbersValidator,
        ],
      ],
      umc: ['', Validators.required],
      descripcionUMC: [''],
      uso: ['', Validators.required],
      descripcionUso: [''],
      paisDeOrigen: ['', Validators.required],
      descripcionPaisDeOrigen: [''],
      paisDeProcedencia: ['', Validators.required],
      descripcionPaisDeProcedencia: [''],
      tipoDeProducto: [''],
      descripcionTipoDeProducto: [''],
      numeroDeLote: [''],
      detalleVidaSilvestre: [[]],
    });

    if (this.formularioSolicitud) {
      this.mercanciaForm.patchValue({
        ...this.formularioSolicitud,
      });
      if (this.formularioSolicitud.detalleVidaSilvestre !== undefined) {
        this.usoCrossListDatosElegidos =
          this.formularioSolicitud.detalleVidaSilvestre.map(
            (detalle) => detalle.nombreCientifico
          );
        this.usoCrossListDatos = [...this.usoCrossListDatosElegidos];
      }

      const TIPO_REQUISITO_VALUE = this.formularioSolicitud.tipoRequisito;
      if (TIPO_REQUISITO_VALUE) {
        const SELECTED_TIPO = this.catalogosDatos.tipoRequisitoList?.find(
          (tipo) => tipo.id.toString() === TIPO_REQUISITO_VALUE.toString()
        );
        if (SELECTED_TIPO?.descripcion === 'Inspección Ocular') {
          this.isInspeccionOcularSelected = true;
          const REQUISITO_CONTROL = this.mercanciaForm.get('requisito');
          REQUISITO_CONTROL?.clearValidators();
          REQUISITO_CONTROL?.updateValueAndValidity();
        }
      }
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Aquí se completa el sujeto de destrucción para evitar fugas de memoria.
   */
  tipoSelecionada(event: Catalogo): void {
    this.isInspeccionOcularSelected = event.descripcion === 'Inspección Ocular';
    const REQUISITO_CONTROL = this.mercanciaForm.get('requisito');
    if (this.isInspeccionOcularSelected) {
      REQUISITO_CONTROL?.clearValidators();
      REQUISITO_CONTROL?.setValue('');
    } else {
      REQUISITO_CONTROL?.setValidators([Validators.required]);
    }
    REQUISITO_CONTROL?.updateValueAndValidity();

    this.mercanciaForm.patchValue({
      descripcionTipoRequisito: event.descripcion
    });
  }

  /**
   * Maneja la selección de fracción arancelaria.
   * Actualiza automáticamente los campos relacionados cuando se selecciona una fracción arancelaria.
   * @param event - El objeto de catálogo seleccionado que contiene la información de la fracción arancelaria
   */
  fraccionArancelariaSeleccionada(event: Catalogo): void {
    this.registroSolicitudService
      .obtieneFraccionArancelariaDescripcion(220202, event.clave!)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.getNicoFraccionArancelariaLista(event);
        this.getUnidadMedida(event);
        this.mercanciaForm.patchValue({
          descripcionFraccion: data.datos?.descripcion ?? 'Sin descripción',
          idDescripcionFraccion: data.datos?.id_fraccion ?? 0,
        });
      });
  }
  /**
   * @description Obtiene la lista de fraccion arancelaria desde un archivo JSON.
   * @method getFraccionArancelariaLista
   * @returns {void}
   */
  getNicoFraccionArancelariaLista(event: Catalogo): void {
    this.catalogosService
      .obtieneCatalogoNicoFraccionArancelaria(220202, event.clave!)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.catalogosDatos.nicoList = data.datos ?? [];
      });
  }

  /**
   * Maneja la selección de un elemento del catálogo NICO.
   * Busca el elemento NICO seleccionado en la lista de catálogos y actualiza
   * @param event - El objeto de catálogo seleccionado que contiene la información del NICO
   */
  nicoSeleccionado(event: Catalogo): void {
    this.registroSolicitudService
      .obtieneNicoDescripcion(
        220202,
        this.mercanciaForm.get('fraccionArancelaria')?.value,
        event.clave!
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.mercanciaForm.patchValue({
          descripcionNico: data.datos ?? 'Sin descripción',
        });
      });
  }

  /**
 * asigna la descripcion al modelo
    */
  selectUMC(event: Catalogo): void {
    console.log('que paso', event);
    this.mercanciaForm.patchValue({
      descripcionUMC: event.descripcion
    });
  }

  /**
* asigna la descripcion al modelo
  */
  selectUso(event: Catalogo): void {
    console.log('que paso', event);

    this.mercanciaForm.patchValue({
      descripcionUso: event.descripcion
    });
  }

  /**
* asigna la descripcion al modelo
*/
  selectTipoProducto(event: Catalogo): void {
    console.log('que paso', event);

    this.mercanciaForm.patchValue({
      descripcionTipoDeProducto: event.descripcion
    });
  }

  /**
* asigna la descripcion al modelo
*/
  selectPaisOrigen(event: Catalogo): void {
    this.mercanciaForm.patchValue({
      descripcionPaisDeOrigen: event.descripcion
    });
  }

  /**
* asigna la descripcion al modelo
*/
  selectPaisProcedencia(event: Catalogo): void {
    this.mercanciaForm.patchValue({
      descripcionPaisDeProcedencia: event.descripcion
    });
  }



  /**
   * @description Obtiene la descripcion de unidad de medida.
   * @method getUnidadMedida
   * @returns {void}
   */
  getUnidadMedida(event: Catalogo): void {
    this.registroSolicitudService
      .obtieneUnidadMedida(220202, event.clave!)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.mercanciaForm.patchValue({
          umt: data.datos?.clave ?? 'sin clave',
          descripcionUMT: data.datos?.descripcion ?? 'Sin descripción',
        });
      });
  }

  /**
   * @description Arreglo de objetos que define los botones para la funcionalidad de entrada de aduanas.
   * Cada objeto contiene el nombre del botón, la clase CSS para su estilo y la función asociada que se ejecuta al hacer clic.
   * @type {Array<{btnNombre: string, class: string, funcion: () => void}>}
   */
  aduanasEntradaBotons = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn btn-default',
      funcion: (): void => this.crossList.toArray()[0].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn btn-primary',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Limpia los datos relacionados con los animales vivos.
   * Este método vacía el arreglo `sensiblesTablaDatos` y reinicia el formulario `mercanciaForm`,
   * dejando ambos en su estado inicial. Útil para restablecer el formulario y los datos de la tabla
   * cuando se requiere comenzar una nueva operación o descartar los cambios actuales.
   */
  limpiarAnimalesVivo(): void {
    this.mercanciaForm.reset();
  }

  /**
   * Navega a la ubicación anterior en el historial de navegación.
   * Utiliza el servicio de ubicación para retroceder una página.
   */
  cancelar(): void {
    this.formSubmissionAttempted = false;
    this.cerrar.emit();
  }

  /**
   * Método para agregar animales a la lista de datos sensibles.
   * Actualmente no implementa ninguna funcionalidad, pero se puede extender en el futuro.
   */
  agregarAnimales(): void {
    this.formSubmissionAttempted = true;

    if (this.mercanciaForm.invalid) {
      this.mercanciaForm.markAllAsTouched();
      this.esFormaValido = true;
    } else {
      const DATA_FORM = this.mercanciaForm.getRawValue();
      // this.agregarDatosFormulario.emit(DATA_FORM);
      this.agregarDatosFormulario.emit({
        formulario: {
          ...this.mercanciaForm.getRawValue(),
          nombresCientificos: this.vidaSilvestreElegidos,
        },
        tablaDatos: this.sensiblesTablaDatos,
      });
      this.cerrar.emit();
      this.esFormaValido = false;
    }
  }

  /**
   * Validador personalizado para verificar si el número tiene más de 3 decimales
   * @param control - Control del formulario a validar
   * @returns ValidationErrors si tiene más de 3 decimales, null si es válido
   */
  static maxDecimalsValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }

    const STRING_VALUE = VALUE.toString();
    const DECIMAL_PART = STRING_VALUE.split('.')[1];

    if (DECIMAL_PART && DECIMAL_PART.length > 3) {
      return { maxDecimals: true };
    }

    return null;
  }

  /**
   * Validador personalizado para verificar si el número tiene más de 12 números enteros
   * @param control - Control del formulario a validar
   * @returns ValidationErrors si tiene más de 12 números enteros, null si es válido
   */
  static maxWholeNumbersValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }

    const STRING_VALUE = VALUE.toString();
    const WHOLE_PART = STRING_VALUE.split('.')[0];

    if (WHOLE_PART.length > 12) {
      return { maxWholeNumbers: true };
    }

    return null;
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de destruir el componente.
   * Emite una señal a través del observable `destroy$` para notificar a los suscriptores que deben limpiar recursos y cancelar suscripciones.
   * Posteriormente, completa el observable para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @description Obtiene la lista de paises desde un archivo JSON.
   * @method getcatalogosDatospaisOrigenLista
   * @returns {void}
   */

  obtenerCtalogosMercancia(): void {
    this.getcatalogosDatospaisOrigenLista();
    this.getcatalogosDatospaisDestinoLista();
  }

  /**
   * Realiza una petición para obtener el catálogo de pais Destino.
   */
  getcatalogosDatospaisOrigenLista(): void {
    this.catalogosService
      .obtieneCatalogoPaises(220202)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.catalogosDatos.paisOrigenList = data.datos ?? [];
      });
  }

  /**
   * Realiza una petición para obtener el catálogo de pais Destino.
   */
  getcatalogosDatospaisDestinoLista(): void {
    this.catalogosService
      .obtieneCatalogoPaisesD(220202)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.catalogosDatos.paisDeProcedenciaList = data.datos?.filter(f => f.clave !== 'MEX') ?? [];
      });
  }

  valoresCrossLista(event: string[]): void {
    const ELEGIDOS: Catalogo[] = event.map((elemento: string): Catalogo => {
      const ENCONTRADO = this.vidaSilvestreLista.find(
        (vida) => vida.descripcion === elemento
      );
      if (ENCONTRADO !== undefined) {
        return ENCONTRADO;
      }
      return {} as Catalogo;
    });
    if (ELEGIDOS !== undefined) {
      this.vidaSilvestreElegidos = ELEGIDOS as Catalogo[];
    }
  }
}
