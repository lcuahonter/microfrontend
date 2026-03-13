import { Catalogo, CatalogoSelectComponent, TablaDinamicaComponent, TablaExpandibleComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, TablaSeleccion } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite250103State, Tramite250103Store } from '../../estados/tramite250103.store';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { Tramite250103Query } from '../../estados/tramite250103.query';

import {
  CONFIGURATION_TABLA,
  CONFIGURATION_TABLA_MERCANCIAS,
  Detalle,
  Producto
} from '../../models/embalaje-de-madera.models';
import catalogoDatos from '@libs/shared/theme/assets/json/250103/banco.json';


/**
 * Componente para gestionar las mercancías en el trámite 250103.
 * Permite agregar, visualizar y gestionar productos y sus detalles.
 */
@Component({
  selector: 'app-mercancias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    TablaExpandibleComponent,
    TituloComponent
  ],
  templateUrl: './mercancias.component.html',
  styleUrls: ['./mercancias.component.scss']
})
export class MercanciasComponent implements OnInit, OnDestroy {

  /** Formulario reactivo que gestiona la entrada de datos de mercancías */
  formMercancias!: FormGroup;

  /** Catálogo de descripciones de mercancías */
  descripcion: Catalogo[] = catalogoDatos.descripcion;

  /** Catálogo de fracciones arancelarias */
  fraccion: Catalogo[] = catalogoDatos.fraccion;

  /** Catálogo de unidades de medida */
  medida: Catalogo[] = catalogoDatos.medida;

  /** Catálogo de géneros biológicos */
  genero: Catalogo[] = catalogoDatos.genero;

  /** Catálogo de especies */
  especie: Catalogo[] = catalogoDatos.especie;

  /** Catálogo de nombres comunes */
  comun: Catalogo[] = catalogoDatos.comun;

  /** Catálogo de países de origen */
  origen: Catalogo[] = catalogoDatos.origen;

  /** Catálogo de países de procedencia */
  procedencia: Catalogo[] = catalogoDatos.procedencia;

  /** Arreglo que almacena los detalles de las fracciones de mercancías */
  fraccionData: Detalle[] = [];

  /** Lista de productos agregados por el usuario */
  producto: Producto[] = [];

  /** Producto seleccionado actualmente en la tabla */
  productoSeleccionado: Producto | null = null;

  /** Enumeración para los tipos de selección de tabla */
  TablaSeleccion = TablaSeleccion;

  /** Configuración de columnas para la tabla de productos */
  configuracionTabla: ConfiguracionColumna<Producto>[] = CONFIGURATION_TABLA;

  /** Configuración de columnas para la tabla de detalles de mercancías */
  configuracionMercanciasTabla: ConfiguracionColumna<Detalle>[] = CONFIGURATION_TABLA_MERCANCIAS;

  /** Mapa que almacena los detalles para cada producto */
  mapaDetalles: Map<number, Detalle[]> = new Map();

  /** Indica si el modal para agregar mercancías está visible */
  mostrarModalMercancias = false;

  /** Notificador para limpiar las suscripciones */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /** Estado de la solicitud del trámite */
  public solicitudState!: Tramite250103State;

  /** Generar un ID único para los productos */
  private generarId = MercanciasComponent.generarId;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente
   */
  constructor(
    private fb: FormBuilder,
    private tramite250103Store: Tramite250103Store,
    private tramite250103Query: Tramite250103Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el componente, configura el formulario y obtiene el estado
   */
  ngOnInit(): void {
    // Obtener el estado actual del store
    this.tramite250103Query.selectTramiteState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250103State;

          // Si tenemos productos en el estado, los cargamos
          if (this.solicitudState.productos && this.solicitudState.productos.length > 0) {
            this.producto = [...this.solicitudState.productos];
          }

          // Si tenemos detalles en el estado, los cargamos
          if (this.solicitudState.detalles) {
            this.mapaDetalles = new Map(this.solicitudState.detalles);
          }
        })
      )
      .subscribe();

    this.crearFormulario();
  }

  /**
   * Función para obtener los detalles de un producto específico
   */
  obtenerDatosAnidados = (producto: Producto): Detalle[] => {
    if (!producto || !producto.id) {
      console.warn('Producto o ID de producto inválido:', producto);
      return [];
    }

    const DETALLES = this.mapaDetalles.get(producto.id);

    if (!DETALLES || DETALLES.length === 0) {
      return [];
    }

    return DETALLES;
  };

  /**
   * Maneja la selección de un producto en la tabla
   */
  alSeleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
  }

  /**
   * Agrega un detalle de mercancía al array fraccionData
   */
  agregarDetalle(): void {
    // Validar valores del formulario
    if (!this.formMercancias.valid) {
      console.error('El formulario no es válido');
      return;
    }

    const DETALLE_FORMDATA: Detalle = {
      fraccionArancelaria: this.fraccion.find(item => item.id === Number(this.formMercancias.value.fraccion))?.descripcion || '',
      cantidad: this.formMercancias.value.cantidad.toString(),
      unidadMedida: this.medida.find(item => item.id === Number(this.formMercancias.value.medida))?.descripcion || '',
      nombreCientifico: this.genero.find(item => item.id === Number(this.formMercancias.value.genero))?.descripcion || '',
      nombreComun: this.comun.find(item => item.id === Number(this.formMercancias.value.comun))?.descripcion || '',
      paisOrigen: this.origen.find(item => item.id === Number(this.formMercancias.value.origen))?.descripcion || '',
      paisProcedencia: this.procedencia.find(item => item.id === Number(this.formMercancias.value.procedencia))?.descripcion || '',
    };

    this.fraccionData.push(DETALLE_FORMDATA);
  }

  /**
   * Establece los valores en el store utilizando el método establecerDatos
   * @param formulario Formulario con los valores a guardar
   * @param campo Campo del formulario que se va a guardar
   */
  establecerValoresStore(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    if (VALOR !== undefined) {
      // Crear un objeto con la propiedad dinámica
      const DATOS: Partial<Tramite250103State> = {
        [campo]: VALOR
      };

      // Actualizar el store con el método establecerDatos
      this.tramite250103Store.establecerDatos(DATOS);
    }
  }

  /**
   * Cancela la operación actual y oculta el modal de mercancías
   */
  cancelarDetalle(): void {
    // Reiniciar el formulario
    this.formMercancias.reset();
    // Limpiar el array de fraccionData
    this.fraccionData = [];
    // Mostrar u ocultar el modal de mercancías
    this.mostrarModalMercancias = !this.mostrarModalMercancias;
  }

  /**
   * Guarda los datos de un producto y cierra el modal de mercancías
   */
  guardarDetalle(): void {
    if (this.fraccionData.length === 0) {
      console.error('No hay detalles para guardar');
      return;
    }

    // Validar que tengamos una descripción seleccionada
    if (!this.formMercancias.value.descripcion) {
      console.error('No se ha seleccionado una descripción');
      return;
    }

    const NUEVO_ID_PRODUCTO = this.generarId();

    const PRODUCTO_FORMDATA: Producto = {
      id: NUEVO_ID_PRODUCTO,
      descripcion: this.descripcion.find(item => item.id === Number(this.formMercancias.value.descripcion))?.descripcion || '',
    };

    // Agregar el nuevo producto al array
    this.producto.push(PRODUCTO_FORMDATA);

    // Crear una copia profunda del array fraccionData
    const COPIA_DETALLES = [...this.fraccionData.map(detalle => ({ ...detalle }))];

    // Almacenar los detalles para este producto específico
    this.mapaDetalles.set(NUEVO_ID_PRODUCTO, COPIA_DETALLES);

    // Crear una copia tipada correctamente de las entradas para pasar al store
    const ENTRADAS_DETALLES: [number, Detalle[]][] = Array.from(this.mapaDetalles.entries()).map(
      ([clave, valor]) => [clave, [...valor]] as [number, Detalle[]]
    );

    // Actualizar el store con el método establecerDatos
    this.tramite250103Store.establecerDatos({
      productos: [...this.producto],
      detalles: ENTRADAS_DETALLES
    });

    // Reiniciar el formulario
    this.formMercancias.reset();

    // Limpiar el array de fraccionData
    this.fraccionData = [];

    // Mostrar u ocultar el modal de mercancías
    this.mostrarModalMercancias = !this.mostrarModalMercancias;
  }

  /**
   * Alterna la visibilidad del modal para agregar mercancías
   */
  abrirModalMercancias(): void {
    // Reiniciar el formulario al abrir el modal
    if (!this.mostrarModalMercancias) {
      this.formMercancias.reset();
      this.fraccionData = [];
    }
    this.mostrarModalMercancias = !this.mostrarModalMercancias;
  }

  /**
   * Genera un ID único para nuevos elementos
   */
  static generarId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  /**
   * Limpia recursos al destruir el componente
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
  /**
 * Evalúa si se debe inicializar o cargar datos en el formulario.
 * Además, obtiene la información del catálogo de mercancía.
 */
  inicializarEstadoFormulario(): void {
    this.guardarDatosFormulario();
  }



  /**
 * @method
 * @name guardarDatosFormulario
 * @description
 * Inicializa los formularios y obtiene los datos de la tabla.
 * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
 * deshabilita o habilita todos los formularios del componente.
 * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
 * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
 *
 * @returns {void}
 */
  guardarDatosFormulario(): void {
    // Inicializa el formulario con los valores del estado
    this.tramite250103Query.selectTramiteState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe()
    this.crearFormulario();
  }

  /**
   * @method crearFormulario
   * @description
   * Este método inicializa el formulario reactivo `formMercancias` con los valores del estado actual (`solicitudState`).
   * Cada campo del formulario está asociado a una propiedad del estado y tiene validaciones específicas.
   * Además, dependiendo del modo de solo lectura (`esFormularioSoloLectura`), habilita o deshabilita los campos del formulario.
   *
   * @returns {void}
   *
   * @example
   * // Ejemplo de uso:
   * this.crearFormulario();
   *
   * @fields
   * - descripcion: Campo obligatorio que almacena la descripción de la mercancía.
   * - fraccion: Campo obligatorio que almacena la fracción arancelaria.
   * - arancelaria: Campo obligatorio y deshabilitado que almacena la información arancelaria.
   * - cantidad: Campo obligatorio que almacena la cantidad de mercancía.
   * - medida: Campo obligatorio que almacena la unidad de medida.
   * - genero: Campo obligatorio que almacena el género biológico.
   * - especie: Campo obligatorio que almacena la especie biológica.
   * - comun: Campo obligatorio que almacena el nombre común de la mercancía.
   * - origen: Campo obligatorio que almacena el país de origen.
   * - procedencia: Campo obligatorio que almacena el país de procedencia.
   *
   * @logic
   * - Si `esFormularioSoloLectura` es `true`, todos los campos del formulario se deshabilitan.
   * - Si `esFormularioSoloLectura` es `false`, todos los campos del formulario se habilitan.
   */
  crearFormulario(): void {
    this.formMercancias = this.fb.group({
      descripcion: [this.solicitudState?.descripcion || '', Validators.required],
      fraccion: [this.solicitudState?.fraccion || '', Validators.required],
      arancelaria: [{ value: this.solicitudState?.arancelaria || '', disabled: true }, Validators.required],
      cantidad: [this.solicitudState?.cantidad || '', Validators.required],
      medida: [this.solicitudState?.medida || '', Validators.required],
      genero: [this.solicitudState?.genero || '', Validators.required],
      especie: [this.solicitudState?.especie || '', Validators.required],
      comun: [this.solicitudState?.comun || '', Validators.required],
      origen: [this.solicitudState?.origen || '', Validators.required],
      procedencia: [this.solicitudState?.procedencia || '', Validators.required]
    });

    if (this.esFormularioSoloLectura) {
      this.formMercancias.disable();
    } else {
      this.formMercancias.enable();
    }
  }
}
