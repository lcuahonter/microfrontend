import { AGREGAR, EDITAR, IMPORTANTE } from '../../constantes/fitosanitario.enum';
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, REGEX_PATRON_DECIMAL_12_3, REGEX_SOLO_NUMEROS, ValidacionesFormularioService } from '@ng-mf/data-access-user'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosMercanciaService } from '../../services/datos-mercancia/datos-mercancia.service';
import { MercanciaForm } from '../../models/fitosanitario.model';


/**
 * @fileoverview
 * Componente para la gestión de los datos de la mercancía fitosanitaria.
 * Permite capturar, editar, eliminar y visualizar información de mercancías, así como gestionar catálogos y el estado del formulario.
 * Cobertura compodoc 100%: cada método, propiedad y constructor está documentado.
 * @module DatosMercanciaComponent
 */

/**
 * Componente para la gestión de los datos de la mercancía fitosanitaria.
 * Permite capturar, editar, eliminar y visualizar información de mercancías, así como gestionar catálogos y el estado del formulario.
 * @component DatosMercanciaComponent
 * @selector app-datos-mercancia
 * @templateUrl ./datos-mercancia.component.html
 * @styleUrl ./datos-mercancia.component.scss
 * @implements OnInit
 * @implements OnDestroy
 * @implements AfterViewInit
 */
@Component({
  selector: 'app-datos-mercancia',
  templateUrl: './datos-mercancia.component.html',
  styleUrl: './datos-mercancia.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    AlertComponent,
    CommonModule
  ]
})
export class DatosMercanciaComponent implements OnInit, OnDestroy {
  /**
   * Tipo de selección para la tabla de solicitudes.
   * @property {TablaSeleccion}
   */
  tipoSeleccionarParaTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla principal de mercancías.
   * @property {ConfiguracionColumna<MercanciaForm>[]}
   */
  configuracionParaEncabezadoDeTabla: ConfiguracionColumna<MercanciaForm>[] = [
    { encabezado: 'Fracción arancelaria', clave: (fila) => fila.fraccionArancelaria, orden: 1 },
    { encabezado: 'Descripción de la fracción', clave: (fila) => fila.descripcionFraccionArancelaria, orden: 2 },
    { encabezado: 'Descripción de la mercancía', clave: (fila) => fila.descripcion, orden: 3 },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (fila) => fila.umt, orden: 4 },
    { encabezado: 'Cantidad UMT', clave: (fila) => fila.cantidadUMT, orden: 5 },
    { encabezado: 'Unidad de medida de comercialización (UMC)', clave: (fila) => fila.umc, orden: 6 },
    { encabezado: 'Cantidad UMC', clave: (fila) => fila.cantidadUMC, orden: 7 },
    { encabezado: 'Nombre común', clave: (fila) => fila.nombreComun, orden: 8 },
    { encabezado: 'Nombre científico', clave: (fila) => fila.nombreCientifico, orden: 9 },
    { encabezado: 'Uso', clave: (fila) => fila.uso, orden: 10 },
    { encabezado: 'País de origen', clave: (fila) => fila.paisOrigen, orden: 11 },
    { encabezado: 'País de procedencia', clave: (fila) => fila.paisProcedencia, orden: 12 },
    { encabezado: 'Tipo de producto', clave: (fila) => fila.tipoProducto, orden: 13 },
  ];

  /**
   * Constante que representa la etiqueta de "Importante".
   * @property {string}
   */
  importante: string = IMPORTANTE.Importante;

  /**
   * Arreglo que contiene los datos de la mercancía para la tabla.
   * @property {MercanciaForm[]}
   */
  cuerpoTabla: MercanciaForm[] = [];

  /**
   * Formulario reactivo para la captura de datos de la mercancía.
   * @property {FormGroup}
   */
  formMercancia!: FormGroup;

  /**
   * Subject para notificar la destrucción del componente y desuscribir observables.
   * @private
   * @property {Subject<void>}
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Catálogo para el select de nombre común.
   * @property {Catalogo[]}
   */
  catalogoNombreComun: Catalogo[] = [];

  /**
   * Catálogo para el select de nombre científico.
   * @property {Catalogo[]}
   */
  catalogoNombreCientifico: Catalogo[] = [];

  /**
   * Catálogo para el select de uso.
   * @property {Catalogo[]}
   */
  catalogoUso: Catalogo[] = [];

  /**
   * Catálogo para el select de país de origen.
   * @property {Catalogo[]}
   */
  catalogoPaisOrigen: Catalogo[] = [];

  /**
   * Catálogo para el select de país de procedencia.
   * @property {Catalogo[]}
   */
  catalogoPaisProcedencia: Catalogo[] = [];

  /**
   * Catálogo para el select de tipo de producto.
   * @property {Catalogo[]}
   */
  catalogoTipoProducto: Catalogo[] = [];

  /**
   * Catálogo para el select de unidad de medida de comercialización (UMC).
   * @property {Catalogo[]}
   */
  catalogoUmc: Catalogo[] = [];

  /**
   * Lista de filas seleccionadas en la tabla.
   * @property {MercanciaForm[]}
   */
  listaDeTablasSeleccionadas: MercanciaForm[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   * @property {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Referencia al modal de mercancías.
   */
  @ViewChild('cerrarModal') cerrarModalRef!: ElementRef;

  /**
   * Constructor del componente.
   * Inyecta los servicios necesarios para la gestión de datos y formularios.
   * @param {FormBuilder} fb Servicio para la construcción de formularios reactivos.
   * @param {DatosMercanciaService} datosMercanciaService Servicio para obtener datos de la mercancía.
   * @param {ChangeDetectorRef} cdr Servicio para detectar cambios en la vista.
   * @param {ConsultaioQuery} consultaioQuery Servicio para consultar el estado de solo lectura.
   * @param validacionesService Servicio para validar formularios.
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly datosMercanciaService: DatosMercanciaService,
    private readonly cdr: ChangeDetectorRef,
    private readonly consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if(seccionState.readonly || seccionState.update) {
             this.inicializarEstadoFormulario();
          }
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario de la mercancía y suscribe a los cambios para realizar validaciones.
   * También obtiene los catálogos y los datos de la tabla.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.crearFormulario();
    this.obtenerNombreComun();
    this.obtenerNombreCientifico();
    this.obtenerUso();
    this.obtenerPaisProcedencia();
    this.obtenerTipoProducto();
    this.obtenerPaisOrigen();
    this.obtenerUmc();
    this.datosMercanciaService.obtenerDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(data => {
        if (Array.isArray(data?.datos)) {
          this.cuerpoTabla = data.datos as MercanciaForm[];
        } else {
          this.cuerpoTabla = [];
        }
      });
  }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formMercancia?.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formMercancia?.enable();
    }
  }

  /**
   * Método para crear e inicializar el formulario reactivo de la mercancía.
   * Define los controles del formulario y sus validadores.
   * @method crearFormulario
   * @returns {void}
   */
  crearFormulario(): void {
    this.formMercancia = this.fb.group({
      id: [null],
      nombreComun: ['', Validators.required],
      nombreCientifico: ['', Validators.required],
      uso: ['', Validators.required],
      paisOrigen: ['', Validators.required],
      paisProcedencia: ['', Validators.required],
      tipoProducto: ['', Validators.required],
      fraccionArancelaria: ['', [Validators.required, Validators.minLength(8), Validators.pattern(REGEX_SOLO_NUMEROS)]],
      descripcionFraccionArancelaria: ['', Validators.required],
      cantidadUMT: ['', [Validators.pattern(REGEX_PATRON_DECIMAL_12_3)]],
      umt: [''],
      cantidadUMC: ['', [Validators.required, Validators.pattern(REGEX_PATRON_DECIMAL_12_3)]],
      umc: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    this.inicializarEstadoFormulario();
  }

  /**
   * Obtiene la lista de nombres comunes desde un archivo JSON a través del servicio.
   * Suscribe al observable para actualizar el catálogo de nombres comunes.
   * @method obtenerNombreComun
   * @returns {void}
   */
  obtenerNombreComun(): void {
    this.datosMercanciaService.obtenerSelectorList('nombrecomun.json').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogoNombreComun = data;
    })
  }

  /**
   * Obtiene la lista de nombres científicos desde un archivo JSON a través del servicio.
   * Suscribe al observable para actualizar el catálogo de nombres científicos.
   * @method obtenerNombreCientifico
   * @returns {void}
   */
  obtenerNombreCientifico(): void {
    this.datosMercanciaService.obtenerSelectorList('nombrecientifico.json').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogoNombreCientifico = data;
    })
  }

  /**
   * Obtiene la lista de usos desde un archivo JSON a través del servicio.
   * Suscribe al observable para actualizar el catálogo de usos.
   * @method obtenerUso
   * @returns {void}
   */
  obtenerUso(): void {
    this.datosMercanciaService.obtenerSelectorList('uso.json').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogoUso = data;
    })
  }

  /**
   * Obtiene la lista de países de origen desde un archivo JSON a través del servicio.
   * Suscribe al observable para actualizar el catálogo de países de origen.
   * @method obtenerPaisOrigen
   * @returns {void}
   */
  obtenerPaisOrigen(): void {
    this.datosMercanciaService.obtenerSelectorList('paisorigen.json').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogoPaisOrigen = data;
    })
  }

  /**
   * Obtiene la lista de países de procedencia desde un archivo JSON a través del servicio.
   * Suscribe al observable para actualizar el catálogo de países de procedencia.
   * @method obtenerPaisProcedencia
   * @returns {void}
   */
  obtenerPaisProcedencia(): void {
    this.datosMercanciaService.obtenerSelectorList('paisprocedencia.json').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogoPaisProcedencia = data;
    })
  }

  /**
   * Obtiene la lista de tipos de producto desde un archivo JSON a través del servicio.
   * Suscribe al observable para actualizar el catálogo de tipos de producto.
   * @method obtenerTipoProducto
   * @returns {void}
   */
  obtenerTipoProducto(): void {
    this.datosMercanciaService.obtenerSelectorList('tipoproducto.json').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogoTipoProducto = data;
    })
  }

  /**
   * Obtiene la lista de unidades de medida de comercialización (UMC) desde un archivo JSON a través del servicio.
   * Suscribe al observable para actualizar el catálogo de UMCs.
   * @method obtenerUmc
   * @returns {void}
   */
  obtenerUmc(): void {
    this.datosMercanciaService.obtenerSelectorList('umc.json').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogoUmc = data;
    })
  }

  /**
   * Método para establecer valores en el formulario de mercancía basado en el campo que se modificó.
   * Actualmente, solo establece la descripción de la fracción arancelaria y la UMT si el campo es 'fraccionArancelaria'.
   * @method establecerValoresStore
   * @param {string} [campo] Campo específico que desencadenó la acción.
   * @returns {void}
   * @step Paso 1: Verifica si el campo es 'fraccionArancelaria'.
   * @step Paso 2: Si es así, actualiza los valores de descripción y UMT en el formulario.
   */
  establecerValoresStore(campo?: string): void {
    if (campo === 'fraccionArancelaria') {
      this.formMercancia.patchValue({
        descripcionFraccionArancelaria: 'CR-123456',
        umt: 'Dependencia-34'
      });
    }
  }

  /**
   * Método para almacenar los datos del formulario en la tabla de mercancías.
   * Si el nombre es 'add', agrega el valor actual del formulario al arreglo `cuerpoTabla` y cambia el estado del formulario.
   * Luego, limpia los datos del formulario.
   * Si el nombre es 'edit', actualiza el elemento correspondiente en la tabla.
   * @method almacenarDatoEnTabla
   * @param {string} nombre Acción que se va a realizar ('add' para agregar, 'edit' para editar).
   * @returns {void}
   * @step Paso 1: Cambia el estado del formulario.
   * @step Paso 2: Si la acción es agregar, genera un ID aleatorio y agrega el formulario a la tabla.
   * @step Paso 3: Si la acción es editar, actualiza el elemento correspondiente en la tabla.
   * @step Paso 4: Actualiza el servicio y limpia el formulario.
   */
  almacenarDatoEnTabla(nombre: string): void {
    if (nombre === AGREGAR) {
      this.formMercancia.patchValue({
        id: Math.floor(Math.random() * 90) + 10
      })
      this.cuerpoTabla = [...this.cuerpoTabla, this.formMercancia.value as MercanciaForm];
      this.datosMercanciaService.actualizarFormularioMovilizacion(this.cuerpoTabla as MercanciaForm[]);
      this.datosMercanciaService.botonDesactivarCampos(this.cuerpoTabla.length > 0 ? true : false)
      this.formMercancia.reset();
      this.cerrarModal();
    }
    else if (nombre === EDITAR) {
      const ARTICULOACTUALIZADO = this.formMercancia.value as MercanciaForm;
      const IDACTUALIZADO = ARTICULOACTUALIZADO.id;
      this.cuerpoTabla = this.cuerpoTabla.map(item =>
        item.id === IDACTUALIZADO ? ARTICULOACTUALIZADO : item
      );
      this.datosMercanciaService.actualizarFormularioMovilizacion(this.cuerpoTabla as MercanciaForm[]);
    }
    this.limpiarDatosFormulario();
  }

  /**
   * Cierra el modal de mercancías.
   */
  cerrarModal(): void {
    if (this.cerrarModalRef) {
      this.cerrarModalRef.nativeElement.click();
    }
  }

  /**
   * Método para resetear los valores del formulario de la mercancía.
   * @method limpiarDatosFormulario
   * @returns {void}
   * @step Paso 1: Detecta cambios en la vista.
   * @step Paso 2: Resetea el formulario a su estado inicial.
   */
  limpiarDatosFormulario(): void {
    this.cdr.detectChanges();
    this.formMercancia.reset();
  }

  /**
   * Método que recibe las filas seleccionadas de la tabla y las almacena en la propiedad `listaDeTablasSeleccionadas`.
   * @method onListaDeFilaSeleccionada
   * @param {MercanciaForm[]} filasSeleccionadas - Lista de las filas seleccionadas en la tabla.
   * @returns {void}
   * @step Paso 1: Asigna las filas seleccionadas a la propiedad correspondiente.
   */
  onListaDeFilaSeleccionada(filasSeleccionadas: MercanciaForm[]): void {
    this.listaDeTablasSeleccionadas = filasSeleccionadas;
  }

  /**
   * Método que elimina el elemento seleccionado de la tabla basado en el ID del mismo.
   * Si el ID del elemento está presente en `listaDeTablasSeleccionadas`, se realiza la eliminación tanto en la lista como en el servicio correspondiente.
   * @method eliminarElementoSeleccionado
   * @returns {void}
   * @step Paso 1: Obtiene el ID del elemento seleccionado.
   * @step Paso 2: Busca el índice del elemento en la tabla.
   * @step Paso 3: Si existe, elimina el elemento y actualiza el servicio.
   * @step Paso 4: Actualiza el estado de los campos según la cantidad de elementos.
   */
  eliminarElementoSeleccionado(): void {
    const ID = this.listaDeTablasSeleccionadas[0]?.id;
    if (ID !== undefined) {
      const INDICE = this.cuerpoTabla.findIndex(item => item.id === ID);
      if (INDICE !== -1) {
        this.cuerpoTabla.splice(INDICE, 1);
        this.datosMercanciaService.actualizarFormularioMovilizacion(this.cuerpoTabla);
        if (this.cuerpoTabla.length === 0) {
          this.datosMercanciaService.botonDesactivarCampos(false)
        }
        else {
          this.datosMercanciaService.botonDesactivarCampos(true);
        }
      }
    }
  }

  /**
   * Método que permite seleccionar un elemento de la tabla para modificar sus datos.
   * Cuando se selecciona una fila, los valores del formulario (`formMercancia`) se llenan con los datos de ese elemento.
   * @method seleccionarParaModificacion
   * @returns {void}
   * @step Paso 1: Obtiene el ID del primer elemento seleccionado en `listaDeTablasSeleccionadas`.
   * @step Paso 2: Si el ID existe, filtra el arreglo `cuerpoTabla` para encontrar el elemento correspondiente.
   * @step Paso 3: Actualiza el formulario `formMercancia` con los valores del elemento encontrado.
   */
  seleccionarParaModificacion(): void {
    const ID = this.listaDeTablasSeleccionadas[0]?.id;
    if (ID !== undefined) {
      const VALOR = this.cuerpoTabla.filter(item => item.id === ID);
      this.formMercancia.patchValue(VALOR[0]);
    }
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente es destruido.
   * Libera recursos y cancela las suscripciones.
   * @method ngOnDestroy
   * @returns {void}
   * @step Paso 1: Emite una notificación a los observadores.
   * @step Paso 2: Completa el observable para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}