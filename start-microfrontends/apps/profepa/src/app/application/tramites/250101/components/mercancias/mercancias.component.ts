import { CONFIGURATION_TABLA, CONFIGURATION_TABLA_MERCANCIAS,Detalle,Producto } from '../../models/flora-fauna.models';
import { Catalogo,CatalogoSelectComponent,ConfiguracionColumna,TablaDinamicaComponent,TablaSeleccion,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component,OnDestroy,OnInit} from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { Subject,map,takeUntil } from 'rxjs';
import { Tramite250101State,Tramite250101Store } from '../../estados/tramite250101.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../modal/modal.component';
import { Tramite250101Query } from '../../estados/tramite250101.query';
import catalogoDatos from '@libs/shared/theme/assets/json/250101/banco.json';

/**
 * Componente encargado de gestionar la sección de mercancías dentro del trámite 250101.
 * Este componente permite al usuario gestionar el formulario relacionado con los productos,
 * incluyendo la información sobre la descripción, fracción arancelaria, cantidad, unidad de medida,
 * y otros detalles relevantes sobre la mercancía. Además, gestiona la visualización del modal para 
 * agregar nuevos productos y guarda estos datos en el store de la aplicación.
 * 
 * Implementa las interfaces `OnInit` y `OnDestroy` para gestionar el ciclo de vida del componente, 
 * lo que incluye la inicialización de datos y la limpieza de suscripciones cuando el componente es destruido.
 * 
 * @export
 * @class MercanciasComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-mercancias',
  standalone: true,
  imports: [ModalComponent, TituloComponent, CatalogoSelectComponent, TablaDinamicaComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './mercancias.component.html',
  styleUrl: './mercancias.component.scss'
})
/**
 * Componente principal de la aplicación encargado de gestionar las mercancías.
 * Implementa las interfaces `OnInit` y `OnDestroy` para gestionar el ciclo de vida del componente.
 * 
 * @export
 * @class MercanciasComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export class MercanciasComponent implements OnInit, OnDestroy {
  /**
   * Indica si el modal para agregar mercancías está visible o no.
   * @type {boolean}
   */
 public showMercanciasModal = false;
  
  /**
 * Configuración de columnas para la tabla de productos.
 * Basada en una constante que define el formato y comportamiento de cada columna.
 */
 public configuracionTabla: ConfiguracionColumna<Producto>[] = CONFIGURATION_TABLA;
  
  /**
 * Configuración de columnas para la tabla de mercancías.
 * Utiliza una constante predefinida con el formato de cada columna.
 */
 public configuracionMercanciasTabla: ConfiguracionColumna<Detalle>[] = CONFIGURATION_TABLA_MERCANCIAS;

  /**
 * Formulario reactivo para gestionar los datos de las mercancías.
 * Contiene los controles y validaciones relacionados con el trámite.
 */
 public formMercancias!: FormGroup;
  /**
   * Configuración de las columnas de la tabla de exportadores.
   * Define el encabezado, clave y el orden de las columnas para la tabla de exportadores.
   */
  public checkbox = TablaSeleccion.CHECKBOX;
  /**
 * Catálogo de descripciones. Usado para seleccionar la descripción de la mercancía.
 */
public descripcion: Catalogo[] =catalogoDatos.descripcion;
/**
 * Catálogo de fracciones arancelarias. Se utiliza para seleccionar la fracción correspondiente.
 */
public fraccion: Catalogo[] = catalogoDatos.fraccion;
/**
 * Catálogo de unidades de medida. Permite seleccionar la unidad en la que se mide la mercancía.
 */
public medida: Catalogo[] = catalogoDatos.medida;
/**
 * Catálogo de géneros. Se usa para seleccionar el género biológico de la especie.
 */
public genero: Catalogo[] = catalogoDatos.genero;
/**
 * Catálogo de especies. Permite seleccionar la especie correspondiente del producto.
 */
public especie: Catalogo[] = catalogoDatos.especie;
/**
 * Catálogo de nombres comunes. Se utiliza para seleccionar el nombre común de la especie o mercancía.
 */
public comun: Catalogo[] =catalogoDatos.comun;

/**
 * Catálogo del origen de la mercancía. Indica si es nacional o extranjero, entre otras opciones.
 */
public origen: Catalogo[] = catalogoDatos.origen;
/**
 * Catálogo de procedencias. Describe el lugar de origen más específico de la mercancía (ej. país, región).
 */
public procedencia: Catalogo[] = catalogoDatos.procedencia;
/**
 * Lista de productos agregados por el usuario. Cada elemento representa una mercancía distinta.
 */
 public producto: Producto[] = [];
 /**
 * Arreglo que almacena los detalles de las fracciones de mercancías.
 * 
 * @type {Detalle[]}
 * @description Este arreglo se llena con los datos de las fracciones arancelarias de las mercancías 
 * que se van a procesar o que se encuentran registradas en el sistema.
 */
public fraccionData: Detalle[] = [];

/**
 * Estado de la solicitud que contiene información relevante sobre el trámite.
 * 
 * @type {Tramite250101State}
 * @description Esta variable mantiene el estado de la solicitud del trámite y se utiliza para 
 * obtener los datos relacionados con la mercancía en el formulario, como descripción, fracción, cantidad, etc.
 */
public solicitudState!: Tramite250101State;
/**
 * Notificador para manejar el ciclo de vida del componente y limpiar las suscripciones.
 * 
 * @type {Subject<void>}
 * @description Este Subject es utilizado para notificar cuando el componente debe 
 * destruirse y limpiar las suscripciones a observables, evitando fugas de memoria.
 */
private destroyNotifier$: Subject<void> = new Subject();
 /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
public esFormularioSoloLectura: boolean = false;

/**
 * Constructor que inyecta las dependencias necesarias para el componente.
 * 
 * @param {FormBuilder} fb - Servicio utilizado para construir formularios reactivos en Angular.
 * @param {Tramite250101Store} tramite250101Store - Store encargado de manejar el estado de la solicitud y la lógica de negocio asociada.
 * @param {Tramite250101Query} tramite250101Query - Servicio que permite consultar el estado de la solicitud y los datos relacionados en el store.
 */
  constructor(
    private fb: FormBuilder,
    private tramite250101Store: Tramite250101Store,
    private tramite250101Query: Tramite250101Query, //Store encargado de manejar el estado de la solicitud y la lógica de negocio asociada.
    private consultaioQuery: ConsultaioQuery
  ) {
    // Constructor que inyecta las dependencias necesarias
  }

  /**
   * Método que alterna la visibilidad del modal para agregar mercancías.
   * 
   * @returns {void}
   */
  mercancias(): void {
    this.showMercanciasModal = !this.showMercanciasModal;
  }
  /**
   * Inicializa el formulario y obtiene el estado actual de la solicitud
   * del store utilizando la consulta del estado de la solicitud.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
     // Suscribe al estado del trámite y restaura las filas de la tabla si existen
    this.tramite250101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250101State;
        })
      )
      .subscribe();

  /**
 * Si no hay productos registrados, se agrega uno con la descripción del catálogo.
 * Usa el primer elemento del catálogo o una cadena vacía por defecto.
 */
      if(this.producto.length === 0){
       const PRODUCTO_FORMDATA = {
       descripcion: catalogoDatos.descripcion[0]?.descripcion ?? '',
       };
       this.producto.push(PRODUCTO_FORMDATA);
      }
/**
 * Inicializa el formulario `formMercancias` con los valores de estado de la solicitud.
 * El formulario está compuesto por varios campos, todos ellos requeridos. 
 * Estos campos corresponden a la información de la mercancía, como descripción, fracción arancelaria, 
 * cantidad, medida, entre otros, que provienen del estado de la solicitud (`solicitudState`).
 * 
 * @memberof MercanciasComponent
 */
    this.formMercancias = this.fb.group({
      descripcion: [this.solicitudState.descripcion, Validators.required],
      fraccion: [this.solicitudState.fraccion, Validators.required],
      arancelaria: [this.solicitudState.arancelaria, Validators.required],
      cantidad: [this.solicitudState.cantidad, Validators.required],
      medida: [this.solicitudState.medida, Validators.required],
      genero: [this.solicitudState.genero, Validators.required],
      especie: [this.solicitudState.especie, Validators.required],
      comun: [this.solicitudState.comun, Validators.required],
      origen: [this.solicitudState.origen, Validators.required],
      procedencia: [this.solicitudState.procedencia, Validators.required]
    });

    // Deshabilita el campo 'arancelaria' en el formulario.
    this.formMercancias.get('arancelaria')?.disable();

/**
 * Se suscribe al estado de la sección para actualizar el modo de solo lectura del formulario.
 * Finaliza la suscripción automáticamente al destruirse el componente.
 */
    this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((seccionState) => {
      this.esFormularioSoloLectura = seccionState.readonly;
      this.inicializarEstadoFormulario();
    });
  }


   /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
       this.formMercancias.enable();
        this.formMercancias.get('arancelaria')?.disable();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
public guardarDatosFormulario(): void {
    this.detalleData();
    if (this.esFormularioSoloLectura) {
      this.formMercancias.disable();
      this.formMercancias.get('arancelaria')?.disable();
      if(this.producto.length === 0){
       const PRODUCTO_FORMDATA = {
       descripcion: catalogoDatos.descripcion[0]?.descripcion ?? '',
       };
       this.producto.push(PRODUCTO_FORMDATA);
      }
    } else if (!this.esFormularioSoloLectura) {
      this.formMercancias.enable();
      this.formMercancias.get('arancelaria')?.disable();
    } 
  }


  /**
   * Método que agrega un detalle de mercancía al array `fraccionData`.
   * Obtiene los valores del formulario y los mapea a los valores correspondientes 
   * de los catálogos de fracción, medida, etc.
   * 
   * @returns {void}
   */
 public detalleData(): void {
    if (!this.formMercancias) {return}
    const DETALLE_FORMDATA = {
      fraccionArancelaria: this.fraccion.find(item => item.id === Number(this.formMercancias.value.fraccion))?.descripcion,
      cantidad: this.solicitudState.cantidad,
      unidadMedida: this.medida.find(item => item.id === Number(this.formMercancias.value.medida))?.descripcion,
      nombreCientifico: this.genero.find(item => item.id === Number(this.formMercancias.value.genero))?.descripcion,
      nombreComun: this.comun.find(item => item.id === Number(this.formMercancias.value.comun))?.descripcion,
      paisOrigen: this.origen.find(item => item.id === Number(this.formMercancias.value.origen))?.descripcion,
      paisProcedencia: this.procedencia.find(item => item.id === Number(this.formMercancias.value.procedencia))?.descripcion,
    }
    /**
 * Agrega un nuevo objeto de tipo `Detalle` al arreglo `fraccionData`.
 * Este arreglo contiene la información detallada de cada fracción arancelaria registrada.
 * 
 * @example
 * // Agrega un nuevo detalle generado a partir del formulario
 * this.fraccionData.push(DETALLE_FORMDATA);
 */
    this.fraccionData.push(DETALLE_FORMDATA);
  }
  /**
   * Método que establece los valores en el store correspondiente, 
   * utilizando un método de store basado en el campo y el valor del formulario.
   * 
   * @param {FormGroup} form - El formulario con los valores a guardar.
   * @param {string} campo - El campo del formulario que se va a guardar en el store.
   * @param {keyof Tramite250101Store} metodoNombre - El nombre del método en el store que se ejecutará.
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite250101Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite250101Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /**
   * Método que cancela la operación actual y oculta el modal de mercancías.
   * 
   * @returns {void}
   */
 public detalleCancelar(): void {
    // Muestra u oculta el modal de mercancías
    this.showMercanciasModal = !this.showMercanciasModal;
  }
  /**
   * Método que guarda los datos de un producto y cierra el modal de mercancías.
   * 
   * @returns {void}
   */
 public detalleGuardar(): void {
    const PRODUCTO_FORMDATA = {
      descripcion: this.descripcion.find(item => item.id === Number(this.formMercancias.value.descripcion))?.descripcion,
    }
    /**
 * Agrega un nuevo objeto de tipo `Producto` al arreglo `producto`.
 * Este arreglo almacena los productos que el usuario ha agregado en el formulario.
 * 
 * @example
 * // Agrega un nuevo producto generado a partir del formulario
 * this.producto.push(PRODUCTO_FORMDATA);
 */
    this.producto.push(PRODUCTO_FORMDATA);
    // Muestra u oculta el modal de mercancías
    this.showMercanciasModal = !this.showMercanciasModal;
  }
  /**
   * Método que limpia los recursos cuando el componente es destruido.
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
