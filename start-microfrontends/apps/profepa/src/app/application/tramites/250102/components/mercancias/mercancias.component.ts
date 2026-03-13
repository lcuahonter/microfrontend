import { Catalogo, CatalogoSelectComponent, TablaDinamicaComponent, TablaExpandibleComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaSeleccion } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite250102State, Tramite250102Store } from '../../estados/tramite250102.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../modal/modal.component';
import { Tramite250102Query } from '../../estados/tramite250102.query';

import { 
  CONFIGURATION_TABLA, 
  CONFIGURATION_TABLA_MERCANCIAS, 
  Detalle, 
  Producto 
} from '../../models/flora-fauna.models';
import catalogoDatos from '@libs/shared/theme/assets/json/250102/banco.json';

/**
 * Componente para gestionar las mercancías en el trámite 250102.
 * Permite agregar, visualizar y gestionar productos y sus detalles,
 * así como almacenar la información en el estado global del trámite.
 * 
 * @component
 * @example
 * <app-mercancias></app-mercancias>
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
  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Formulario reactivo que gestiona la entrada de datos de mercancías.
   * @type {FormGroup}
   */
  formMercancias!: FormGroup;

  /**
   * Catálogo de descripciones de mercancías.
   * @type {Catalogo[]}
   */
  descripcion: Catalogo[] = catalogoDatos.descripcion;

  /**
   * Catálogo de fracciones arancelarias.
   * @type {Catalogo[]}
   */
  fraccion: Catalogo[] = catalogoDatos.fraccion;

  /**
   * Catálogo de unidades de medida.
   * @type {Catalogo[]}
   */
  medida: Catalogo[] = catalogoDatos.medida;

  /**
   * Catálogo de géneros biológicos.
   * @type {Catalogo[]}
   */
  genero: Catalogo[] = catalogoDatos.genero;

  /**
   * Catálogo de especies.
   * @type {Catalogo[]}
   */
  especie: Catalogo[] = catalogoDatos.especie;

  /**
   * Catálogo de nombres comunes.
   * @type {Catalogo[]}
   */
  comun: Catalogo[] = catalogoDatos.comun;

  /**
   * Catálogo de países de origen.
   * @type {Catalogo[]}
   */
  origen: Catalogo[] = catalogoDatos.origen;

  /**
   * Catálogo de países de procedencia.
   * @type {Catalogo[]}
   */
  procedencia: Catalogo[] = catalogoDatos.procedencia;

  /**
   * Arreglo que almacena los detalles de las fracciones de mercancías.
   * @type {Detalle[]}
   */
  fraccionData: Detalle[] = [];
  
  /**
   * Lista de productos agregados por el usuario.
   * @type {Producto[]}
   */
  producto: Producto[] = [];

  /**
   * Producto seleccionado actualmente en la tabla.
   * @type {Producto | null}
   */
  productoSeleccionado: Producto | null = null;

  /**
   * Enumeración para los tipos de selección de tabla.
   * @type {typeof TablaSeleccion}
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de columnas para la tabla de productos.
   * @type {ConfiguracionColumna<Producto>[]}
   */
  configuracionTabla: ConfiguracionColumna<Producto>[] = CONFIGURATION_TABLA;

  /**
   * Configuración de columnas para la tabla de detalles de mercancías.
   * @type {ConfiguracionColumna<Detalle>[]}
   */
  configuracionMercanciasTabla: ConfiguracionColumna<Detalle>[] = CONFIGURATION_TABLA_MERCANCIAS;

  /**
   * Mapa que almacena los detalles para cada producto.
   * La clave es el ID del producto y el valor es un arreglo de detalles.
   * @type {Map<number, Detalle[]>}
   */
  mapaDetalles: Map<number, Detalle[]> = new Map();

  /**
   * Indica si el modal para agregar mercancías está visible.
   * @type {boolean}
   */
  mostrarModalMercancias = false;

  /**
   * Notificador para limpiar las suscripciones al destruir el componente.
   * @type {Subject<void>}
   * @private
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud del trámite.
   * @type {Tramite250102State}
   */
  public solicitudState!: Tramite250102State;

  /**
   * Genera un ID único para los productos.
   * @type {() => number}
   * @private
   */
  private generarId = MercanciasComponent.generarId;

  /**
   * Constructor del componente. Inyecta dependencias y suscribe el modo de solo lectura.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {Tramite250102Store} tramite250102Store - Store del trámite.
   * @param {Tramite250102Query} tramite250102Query - Query del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query de consulta IO.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250102Store: Tramite250102Store,
    private tramite250102Query: Tramite250102Query,
    public consultaioQuery: ConsultaioQuery,
  ) { 
    this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.notificadorDestruccion$),
          map((seccionState) => {
            this.esFormularioSoloLectura = seccionState.readonly;
          })
        )
        .subscribe();
  }

  /**
   * Inicializa el componente, configura el formulario y obtiene el estado actual del store.
   */
  ngOnInit(): void {
    // Obtener el estado actual del store
    this.tramite250102Query.selectTramiteState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250102State;
          
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

    // Inicializa el formulario con los valores del estado
    this.formMercancias = this.fb.group({
      descripcion: [this.solicitudState?.descripcion || '', Validators.required],
      fraccion: [this.solicitudState?.fraccion || '', Validators.required],
      arancelaria: [this.solicitudState?.arancelaria || '', Validators.required],
      cantidad: [this.solicitudState?.cantidad || '', Validators.required],
      medida: [this.solicitudState?.medida || '', Validators.required],
      genero: [this.solicitudState?.genero || '', Validators.required],
      especie: [this.solicitudState?.especie || '', Validators.required],
      comun: [this.solicitudState?.comun || '', Validators.required],
      origen: [this.solicitudState?.origen || '', Validators.required],
      procedencia: [this.solicitudState?.procedencia || '', Validators.required]
    });

    // Deshabilita el campo 'arancelaria' en el formulario
    this.formMercancias.get('arancelaria')?.disable();
  }

  /**
   * Función para obtener los detalles de un producto específico.
   * @param {Producto} producto - Producto del cual se desean obtener los detalles.
   * @returns {Detalle[]} Arreglo de detalles asociados al producto.
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
   * Maneja la selección de un producto en la tabla.
   * @param {Producto} producto - Producto seleccionado.
   */
  alSeleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
  }

  /**
   * Agrega un detalle de mercancía al array fraccionData.
   * Valida el formulario antes de agregar el detalle.
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
   * Establece los valores en el store utilizando el método establecerDatos.
   * @param {FormGroup} formulario - Formulario con los valores a guardar.
   * @param {string} campo - Campo del formulario que se va a guardar.
   */
  establecerValoresStore(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    if (VALOR !== undefined) {
      // Crear un objeto con la propiedad dinámica
      const DATOS: Partial<Tramite250102State> = {
        [campo]: VALOR
      };
      
      // Actualizar el store con el método establecerDatos
      this.tramite250102Store.establecerDatos(DATOS);
    }
  }

  /**
   * Cancela la operación actual y oculta el modal de mercancías.
   * Reinicia el formulario y limpia los detalles agregados.
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
   * Guarda los datos de un producto y cierra el modal de mercancías.
   * Valida que existan detalles y una descripción antes de guardar.
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
    const COPIA_DETALLES = [...this.fraccionData.map(detalle => ({...detalle}))];
    
    // Almacenar los detalles para este producto específico
    this.mapaDetalles.set(NUEVO_ID_PRODUCTO, COPIA_DETALLES);
   
    // Crear una copia tipada correctamente de las entradas para pasar al store
    const ENTRADAS_DETALLES: [number, Detalle[]][] = Array.from(this.mapaDetalles.entries()).map(
      ([clave, valor]) => [clave, [...valor]] as [number, Detalle[]]
    );
    
    // Actualizar el store con el método establecerDatos
    this.tramite250102Store.establecerDatos({
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
   * Alterna la visibilidad del modal para agregar mercancías.
   * Reinicia el formulario y los detalles si se va a abrir el modal.
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
   * Genera un ID único para nuevos elementos.
   * @returns {number} ID único generado.
   */
  static generarId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
  
  /**
   * Limpia recursos y suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}