import { ADUANAS_DISPONIBLES } from '../../constantes/disponibles-constante.enum';
import { CargarDatosIniciales } from '../../models/pantallas-captura.model';

import {
  Catalogo,
  ConsultaioQuery,
  ConsultaioState,
  CrosslistComponent,
} from '@ng-mf/data-access-user';
import {
  Component,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { map,takeUntil } from 'rxjs';

import { DETALLE } from '../../constantes/disponibles-constante.enum';
import { DISPONSIBLE_ADUANA_CHECKBOXES } from '../../constantes/disponibles-constante.enum';
import { FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MERCANCIAS } from '../../constantes/disponibles-constante.enum';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Solicitud } from '../../models/pantallas-captura.model';
import { Solicitud230101Query } from '../../estados/queries/tramites230101.query';
import { Solicitud230101State } from '../../estados/tramites/tramites230101.store';
import { Solicitud230101Store } from '../../estados/tramites/tramites230101.store';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { Subject } from 'rxjs';
import { TEXTOS } from '../../constantes/certificado-zoosanitario.enum';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Validators } from '@angular/forms';


/**
 * Componente para la vista de la solicitud de la sección de "230101".
 */

@Component({
  selector: 'solicitud',
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})

/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Notificador para destruir las suscripciones activas.
   * Este Subject se utiliza para emitir un evento cuando el componente se destruye,
   * permitiendo que las suscripciones se cancelen adecuadamente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de checkboxes disponibles para las aduanas.
   */
  public disponsibleAduanaCheckboxes = DISPONSIBLE_ADUANA_CHECKBOXES;

  /**
   * Constante que contiene los textos utilizados en el componente.
   * Estos textos están definidos en el archivo de constantes correspondiente.
   */
  public TEXTOS = TEXTOS;

  /**
   * Lista de mercancías disponibles.
   * Esta lista contiene las mercancías que se pueden seleccionar en el formulario.
   */
  public mercanicias = MERCANCIAS;
  /**
   * Detalle de la solicitud.
   * Esta constante contiene información detallada relacionada con la solicitud.
   */
  public detalleDatos = DETALLE;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud230101State;

  /**
   * Lista de aduanas disponibles.
   * Esta lista contiene las aduanas que se pueden seleccionar en el formulario.
   */
  public crosListaDePaises = ADUANAS_DISPONIBLES;

  /** Lista de países para seleccionar origen (primera sección) */
  seleccionarOrigenDelPais: string[] = this.crosListaDePaises;

  /** Lista de países para seleccionar origen (segunda sección) */
  seleccionarOrigenDelPaisDos: string[] = this.crosListaDePaises;

  /** Lista de países para seleccionar origen (tercera sección) */
  seleccionarOrigenDelPaisTres: string[] = this.crosListaDePaises;

  /**
   * Lista de rangos de días seleccionados para el destino.
   */
  seleccionarsRangoDiasDestino: string[] = [];

  /**
   * Lista de rangos de días seleccionados para el país de origen.
   */
  seleccionarsRangoDiasPaisOrigen: string[] = [];

  /**
   * Lista de rangos de días seleccionados para las aduanas.
   */
  seleccionarsRangoDiasAduanas: string[] = [];
  /**
   * Control de formulario para manejar una fecha individual.
   */
  fecha: FormControl = new FormControl('');

  /**
   * Control de formulario para manejar una fecha seleccionada por el usuario.
   */
  fechaSeleccionada: FormControl = new FormControl('');

  /**
   * Etiquetas para el componente CrossList que representan el país de procedencia.
   */
  public paisDeProcedenciaLabel = {
    tituluDeLaIzquierda: 'País de origen:',
    derecha: 'Paises seleccionadas*:',
  };

  /**
   * Lista de catálogos de Seleccione una opción.
   */
  options!: Catalogo[];

  /** Lista de componentes Crosslist disponibles */
  @ViewChildren(CrosslistComponent) crossList!: QueryList<CrosslistComponent>;
  /**
   * Indica si el formulario es de solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado de los datos de consulta.
   */
  consultaDatos!: ConsultaioState;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /** Variable para almacenar los datos de la fila seleccionada en la tabla.*/
  selectedRowData: Solicitud | null = null;

  /**
   * @property {Object} aduanaLabel - Etiquetas utilizadas para las secciones de aduanas en la interfaz de usuario.
   * @property {string} aduanaLabel.tituluDeLaIzquierda - Texto para la sección de aduanas disponibles.
   * @property {string} aduanaLabel.derecha - Texto para la sección de aduanas seleccionadas.
   */
  public aduanaLabel = {
    tituluDeLaIzquierda: 'Aduanas disponibles:',
    derecha: 'Aduanas seleccionadas*:',
  };

  /**
   * @property {Object} paisLabel - Etiquetas utilizadas para las secciones de países en la interfaz de usuario.
   * @property {string} paisLabel.tituluDeLaIzquierda - Texto para la sección de países disponibles.
   * @property {string} paisLabel.derecha - Texto para la sección de países seleccionadas.
   */
  public paisLabel = {
    tituluDeLaIzquierda: 'Países disponibles:',
    derecha: 'Países seleccionadas*:',
  };
  /**
   * @description Etiquetas utilizadas para los encabezados de las listas de entidades en el componente.
   * @property {string} tituluDeLaIzquierda - Texto para el encabezado de la lista de entidades disponibles.
   * @property {string} derecha - Texto para el encabezado de la lista de entidades seleccionadas.
   */
  public destinoLabel = {
    tituluDeLaIzquierda: 'Entidades disponibles:',
    derecha: 'Entidades seleccionadas*:',
  };
  /**
   * Lista de botones de acción disponibles en el componente.
   * Cada botón contiene un nombre, una clase CSS y una función asociada.
   */
  public botones: { btnNombre: string; class: string; funcion: () => void }[] =
    [];

  /**
   * Datos prellenados que se reciben como entrada en el componente.
   * Estos datos se utilizan para inicializar el formulario con valores existentes.
   */
  @Input() prefilledData: Solicitud | null = null;

  /**
   * Botones de acción para gestionar listas de países (primera sección).
   * Cada botón contiene un nombre, una clase CSS y una función asociada.
   */
  paisDeProcedenciaBotons = [
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[0].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[0].quitar('t'),
    },
  ];

  /**
   * Botones de acción para gestionar listas de países (segunda sección).
   * Cada botón contiene un nombre, una clase CSS y una función asociada.
   */
  paisDeProcedenciaBotonsDos = [
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[1].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[1].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[1].quitar('t'),
    },
  ];

  /**
   * Botones de acción para gestionar listas de países (tercera sección).
   * Cada botón contiene un nombre, una clase CSS y una función asociada.
   */
  paisDeProcedenciaBotonsTres = [
    {
      btnNombre: 'Agregar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].agregar('t'),
    },
    {
      btnNombre: 'Agregar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[2].agregar(''),
    },
    {
      btnNombre: 'Restar selección',
      class: 'btn-primary',
      funcion: (): void => this.crossList.toArray()[2].quitar(''),
    },
    {
      btnNombre: 'Restar todos',
      class: 'btn-default',
      funcion: (): void => this.crossList.toArray()[2].quitar('t'),
    },
  ];

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios.
   * @param solicitudService Servicio para gestionar las pantallas de solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudPantallasService,
    private solicitud230101Store: Solicitud230101Store,
    private solicitud230101Query: Solicitud230101Query,
    private mediodetransporteService: MediodetransporteService,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.cargarDatosIniciales();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Este método realiza las siguientes acciones:
   * 1. Inicializa los catálogos necesarios para el formulario.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializaCatalogos();
    this.solicitud230101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.crearFormulario();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.cambiarTipoRegimen();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el estado del formulario según si es de solo lectura o no.
   * Si es de solo lectura, deshabilita el formulario; de lo contrario, lo habilita.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.FormSolicitud?.disable();
    } else {
      this.FormSolicitud?.enable();
    }
  }
  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  private inicializaCatalogos(): void {
    this.mediodetransporteService
      .getMedioDeTransporte()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: Catalogo[]): void => {
        this.options = data as Catalogo[];
      });
  }

  /**
   * Formulario principal de la solicitud.
   */
  FormSolicitud!: FormGroup;

  /**
   * Historial de solicitudes.
   */
  solicitudDatos: string[] = [];

  /**
   * Datos de las solicitudes.
   */
  dSolicitud: Solicitud[] = [];

  /**
   * Obtiene el grupo de formulario 'tipoRegimen' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'tipoRegimen'.
   */
  get tipoRegimen(): FormGroup {
    return this.FormSolicitud.get('tipoRegimen') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'aduanasSalida' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'aduanasSalida'.
   */
  get aduanasSalida(): FormGroup {
    return this.FormSolicitud.get('aduanasSalida') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'selectedOptions' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'selectedOptions'.
   */
  get selectedOptions(): FormArray {
    return this.aduanasSalida.get('selectedOptions') as FormArray;
  }

  /**
   * Obtiene el grupo de formulario 'mercancia' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'mercancia'.
   */
  get mercancia(): FormGroup {
    return this.FormSolicitud.get('mercancia') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'detalle' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'detalle'.
   */
  get detalle(): FormGroup {
    return this.FormSolicitud.get('detalle') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario 'manifiestosForm' del formulario principal 'FormSolicitud'.
   *
   * @returns {FormGroup} El grupo de formulario 'manifiestosForm'.
   */
  get manifiestosForm(): FormGroup {
    return this.FormSolicitud.get('manifiestosForm') as FormGroup;
  }

  /**
 * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
 * 
 * Este método verifica si hay cambios en la propiedad `prefilledData` y, si existen,
 * llama al método `formularioprellenado` para prellenar el formulario con los datos proporcionados.
 * 
 * @param {SimpleChanges} changes - Objeto que contiene los cambios en las propiedades de entrada.
 */
ngOnChanges(changes: SimpleChanges): void {
  if (changes['prefilledData'] && this.prefilledData) {
    this.formularioprellenado(this.prefilledData);
  }
}
  /**
   * Método para crear el formulario de la solicitud.
   */
  crearFormulario(): void {
    this.FormSolicitud = this.fb.group({
      tipoRegimen: this.fb.group({
        regimen: [this.solicitudState?.regimen, Validators.required],
      }),
      aduanasSalida: this.fb.group({
        tipoProducto: [this.solicitudState?.tipoProducto, Validators.required],
        paisProcedencia: [
          this.solicitudState?.paisProcedencia,
          Validators.required,
        ],
        selectedOptions: this.fb.array(this.solicitudState?.selectedOptions),
        clasificacionMercancia: [
          this.solicitudState?.clasificacionMercancia,
          Validators.required,
        ],
        seleccionarsRangoDias: [
          this.solicitudState?.seleccionarsRangoDias,
          Validators.required,
        ],
        seleccionarsRangoDiasAduanas: [
          this.solicitudState?.seleccionarsRangoDiasAduanas,
          Validators.required,
        ],
        seleccionarsRangoDiasPaisOrigen: [
          this.solicitudState?.seleccionarsRangoDiasPaisOrigen,
          Validators.required,
        ],
        seleccionarsRangoDiasDestino: [
          this.solicitudState?.seleccionarsRangoDiasDestino,
          Validators.required,
        ],
      }),
      mercancia: this.fb.group({
        fraccionArancelaria: [
          this.solicitudState?.fraccionArancelaria,
          Validators.required,
        ],
        descFraccionArancelaria: [
          {
            value: this.solicitudState?.descFraccionArancelaria,
            disabled: true,
          },
          Validators.required,
        ],
        cantidad: [
          this.solicitudState?.cantidad,
          [Validators.required, Validators.maxLength(16)],
        ],
        cantidadLetra: [
          { value: this.solicitudState?.cantidadLetra, disabled: true },
        ],
      }),
      detalle: this.fb.group({
        genero: [this.solicitudState?.genero, Validators.required],
        especie: [this.solicitudState?.especie, Validators.required],
        nombreComun: [this.solicitudState?.nombreComun, Validators.required],
        descripcionProducto: [
          this.solicitudState?.descripcionProducto,
          Validators.required,
        ],
        cantidadUMC: [this.solicitudState?.cantidadUMC, Validators.required],
      }),
      manifiestosForm: this.fb.group({
        manifiestosYdesc: [
          this.solicitudState?.manifiestosYdesc,
          Validators.required,
        ],
      }),
    });
  }

  /**
   * Cambia el estado de una opción seleccionada y actualiza el almacén de valores.
   *
   * @param event - Evento que contiene el elemento de entrada que activó el cambio.
   * @param index - Índice de la opción seleccionada en el control de formulario.
   *
   * Este método se utiliza para manejar cambios en los controles de entrada (checkboxes)
   * y actualizar tanto el formulario reactivo como el almacén de valores correspondiente.
   */
  cambiar(event: Event, index: number): void {
    const INPUT_ELEMENT = event.target as HTMLInputElement;
    this.selectedOptions.controls[index].setValue(INPUT_ELEMENT.checked);
    this.setValoresStore(
      this.aduanasSalida,
      'selectedOptions',
      'setSelectedOptions'
    );
  }
  /**
   * Método que se ejecuta al seleccionar una fila en la tabla.
   *
   * Este método actualiza las listas de rangos de días seleccionados para aduanas, país de origen y destino,
   * y prellena el formulario con los datos de la fila seleccionada.
   *
   * @param {Solicitud} data - Datos de la fila seleccionada.
   */
  enFilaSeleccionada(data: Solicitud): void {
    const LISTA_DE_FUENTES_ADUANAS = [...this.crosListaDePaises];
    const LISTA_DE_FUENTES_PAÍS_DE_ORIGEN = [...this.crosListaDePaises];
    const LISTA_DE_ORIGEN_DESTINO = [...this.crosListaDePaises];

    const CONTEXTS = [
      {
        contextKey: 'seleccionarsRangoDiasAduanas',
        sourceList: LISTA_DE_FUENTES_ADUANAS,
        targetList: this.seleccionarsRangoDiasAduanas,
      },
      {
        contextKey: 'seleccionarsRangoDiasPaisOrigen',
        sourceList: LISTA_DE_FUENTES_PAÍS_DE_ORIGEN,
        targetList: this.seleccionarsRangoDiasPaisOrigen,
      },
      {
        contextKey: 'seleccionarsRangoDiasDestino',
        sourceList: LISTA_DE_ORIGEN_DESTINO,
        targetList: this.seleccionarsRangoDiasDestino,
      },
    ];

    CONTEXTS.forEach(({ contextKey, sourceList, targetList }) => {
      const VALUE = data[contextKey as keyof Solicitud];
      if (VALUE) {
        const INDEX =
          typeof VALUE === 'string' ? sourceList.indexOf(VALUE) : -1;
        if (INDEX > -1) {
          sourceList.splice(INDEX, 1);

          if (typeof VALUE === 'string' && !targetList.includes(VALUE)) {
            targetList.push(VALUE);
          }
        }
      }
    });

    this.formularioprellenado(data);
  }

  /**
   * Método para prellenar el formulario con los datos proporcionados.
   *
   * Este método actualiza los valores del formulario reactivo con los datos de la solicitud seleccionada
   * y ajusta la visibilidad de los checkboxes de aduanas según el tipo de régimen.
   *
   * @param {Solicitud} data - Datos de la solicitud para prellenar el formulario.
   */
  formularioprellenado(data: Solicitud): void {
    this.FormSolicitud.patchValue({
      tipoRegimen: {
        regimen: data.regimen,
      },
      aduanasSalida: {
        tipoProducto: data.tipoProducto,
        paisProcedencia: data.paisProcedencia,
        clasificacionMercancia: data.clasificacionMercancia,
        seleccionarsRangoDias: data.seleccionarsRangoDias,
        seleccionarsRangoDiasAduanas: data.seleccionarsRangoDiasAduanas,
        seleccionarsRangoDiasPaisOrigen: data.seleccionarsRangoDiasPaisOrigen,
        seleccionarsRangoDiasDestino: data.seleccionarsRangoDiasDestino,
      },

      mercancia: {
        fraccionArancelaria: data.fraccionArancelaria,
        descFraccionArancelaria: data.descFraccionArancelaria,
        cantidad: data.cantidad,
        cantidadLetra: data.cantidadLetra,
      },
      detalle: {
        genero: data.genero,
        especie: data.especie,
        nombreComun: data.nombreComun,
        descripcionProducto: data.descripcionProducto,
        cantidadUMC: data.cantidadUMC,
      },
      manifiestosForm: {
        manifiestosYdesc: data.manifiestosYdesc,
      },
    });
    if (data.regimen === 'definitivos') {
      this.disponsibleAduanaCheckboxes[0].hide = false;
      this.disponsibleAduanaCheckboxes[1].hide = false;
    } else {
      this.disponsibleAduanaCheckboxes[0].hide = true;
      this.disponsibleAduanaCheckboxes[1].hide = true;
    }
  }
  /**
   * Método para buscar y cargar datos iniciales del servicio.
   */
  cargarDatosIniciales(): void {
    this.solicitudService.getData().subscribe({
      next: (data: CargarDatosIniciales) => {
        this.solicitudDatos = data.solicitudDatos;
        this.dSolicitud = data.dSolicitud;
      },
    });
  }

  /**
   * Cambia el tipo de régimen y actualiza la visibilidad de los checkboxes de aduanas.
   *
   * Este método se activa cuando el usuario cambia el valor del campo 'regimen' en el formulario.
   * Dependiendo del valor seleccionado, muestra u oculta los checkboxes correspondientes a las aduanas.
   */
  cambiarTipoRegimen(): void {
    const VALOR = this.tipoRegimen.get('regimen')?.value;
    if (VALOR === 'definitivos') {
      this.disponsibleAduanaCheckboxes[0].hide = false;
      this.disponsibleAduanaCheckboxes[1].hide = false;
    } else {
      this.disponsibleAduanaCheckboxes[0].hide = true;
      this.disponsibleAduanaCheckboxes[1].hide = true;
    }
  }

  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud230101Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.solicitud230101Store[metodoNombre] as (
        value: string | number | boolean
      ) => void
    )(VALOR);
  }

  /**
   * Verifica si un campo específico en un formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo a validar.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} - Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Este método se utiliza para destruir la suscripción.
   * @returns destroyed$
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
