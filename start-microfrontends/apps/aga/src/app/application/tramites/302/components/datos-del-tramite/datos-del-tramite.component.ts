import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  DATOS_ALERT,
  DATOS_DEL_DONANTE,
  DATOS_DEL_PRODUCTO,
  DATOS_DEL_TRAMITE,
  DOMICILIO_FISCAL,
  MERCANCIAS,
  PRODUCTOS,
} from '../../constantes/datos-del-tramite.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { CertiRegistro302State } from '../../../../../application/core/estados/tramites/tramite302.store';
import { CommonModule } from '@angular/common';
import { DetallesDelProducto } from '../../models/certi-registro.model';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { Solicitud302Service } from '../../services/service302.service';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { Tramite302Query } from '../../../../../application/core/queries/tramite302.query';
import { Tramite302Store } from '../../../../../application/core/estados/tramites/tramite302.store';

/**
 * Componente Angular encargado de gestionar los datos del trámite 302.
 * 
 * Este componente permite la visualización y edición de los datos relacionados con el trámite,
 * incluyendo la gestión de productos, datos del donante y domicilio fiscal. Utiliza formularios reactivos
 * y tablas dinámicas para la captura y presentación de la información. Además, integra la funcionalidad
 * de modales para agregar, modificar y eliminar productos, así como la interacción con el store para
 * mantener el estado global del trámite.
 * 
 * Funcionalidades principales:
 * - Inicialización y configuración dinámica de formularios reactivos.
 * - Gestión de productos asociados al trámite (agregar, modificar, eliminar).
 * - Manejo de modales para la interacción del usuario.
 * - Sincronización del estado del formulario con el store global.
 * - Soporte para modo solo lectura.
 * 
 * @component
 * @selector datos-del-tramite
 * @standalone true
 * @imports [CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent, AlertComponent, FormulariosDeCertiRegistroComponent]
 * @templateUrl ./datos-del-tramite.component.html
 * @styleUrl ./datos-del-tramite.component.scss
 */
@Component({
  selector: 'datos-del-tramite',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent,
    FormasDinamicasComponent
  ],
  templateUrl: './datos-del-tramite.component.html',
  styleUrl: './datos-del-tramite.component.scss',
})


export class DatosDelTramiteComponent implements OnInit, OnDestroy {

  /**Referencia al elemento del modal para agregar productos.
   * @type {ElementRef}
   * @memberof DatosDelTramiteComponent
   */
  @ViewChild('modalAgregarProductos') public modalElement!: ElementRef;

  /**Referencia al elemento del botón para cerrar el modal.
   * @type {ElementRef}
   * @memberof DatosDelTramiteComponent
  */
  @ViewChild('closeModal') public closeModal!: ElementRef;

  /** Inicializa un formulario reactivo vacío que será configurado dinámicamente. 
   * @type {FormGroup}
   * @memberof DatosDelTramiteComponent
  */
  public form: FormGroup = this.fb.group({});

  /** Asigna la constante MERCANCIAS a la propiedad mercancia para su uso en el componente. 
   * @memberof DatosDelTramiteComponent
  */
  public datosDelTramite = DATOS_DEL_TRAMITE;

  /** Asigna la constante MERCANCIAS a la propiedad mercancia para su uso en el componente. 
   * @memberof DatosDelTramiteComponent
  */
  public mercancias = MERCANCIAS;

  /**Asigna la constante PRODUCTOS a la propiedad productos para su uso en el componente. 
   * @memberof DatosDelTramiteComponent
   * 
  */
  public productos = PRODUCTOS;

  /** Asigna la constante DATOS_DEL_DONANTE a la propiedad datosDelDonante para su uso en el componente. 
   * @memberof DatosDelTramiteComponent
   * 
  */
  public datosDelDonante = DATOS_DEL_DONANTE;

  /** Asigna la constante DOMICILIO_FISCAL a la propiedad domicilioFiscal para su uso en el componente.
   * @memberof DatosDelTramiteComponent
   */
  public domicilioFiscal = DOMICILIO_FISCAL;

  /**
   * Array que contiene los datos de las personas cargadas desde el archivo JSON.
   * @type {DetallesDelProducto[]}
   * @memberof DatosDelTramiteComponent
   */
  public detallesDelProducto: DetallesDelProducto[] = [];

  /** Asigna la clase TablaSeleccion para su uso en el componente, permitiendo la selección de filas en tablas dinámicas.
   * @memberof DatosDelTramiteComponent
   */
  public TablaSeleccion = TablaSeleccion;
    
    /**
     * Configuración de la tabla utilizada para mostrar los datos del producto en el trámite.
     * 
     * Esta propiedad almacena la configuración específica definida en `DATOS_DEL_PRODUCTO`,
     * que determina las columnas, formato y comportamiento de la tabla en el componente.
     */
    public configuracionTabla = DATOS_DEL_PRODUCTO;
  /** Variable que controla el estado del modal (abierto o cerrado). 
   * @type {string}
   * @memberof DatosDelTramiteComponent
  */
  public modal: string = 'modal';

  /** Variable que controla el estado del modal de confirmación (abierto o cerrado). 
   * @type {string}
   * @memberof DatosDelTramiteComponent
  */
  public modalConfirmacion: string = 'modal';

  /**
   * Formulario reactivo para agregar productos.
   * Este formulario se inicializa vacío y se configura dinámicamente
   * con los campos necesarios para capturar los datos de los productos.
   * @type {FormGroup}
   * @memberof DatosDelTramiteComponent
   */
  public formAgregarProductos: FormGroup = this.fb.group({});

  /**
   * Formulario reactivo para capturar los datos del donante.
   * Este formulario se inicializa vacío y se configura dinámicamente
   * con los campos necesarios para capturar la información del donante.
   * @type {FormGroup}
   * @memberof DatosDelTramiteComponent
   */
  public formDatosMercancias: FormGroup = this.fb.group({});

  /**
   * Formulario reactivo para capturar los datos del donante.
   * Este formulario se inicializa vacío y se configura dinámicamente
   * con los campos necesarios para capturar la información del donante.
   * @type {FormGroup}
   * @memberof DatosDelTramiteComponent
   */
  public formDatosDelDonante: FormGroup = this.fb.group({});

  /**
   * Formulario reactivo para capturar los datos del domicilio fiscal.
   * Este formulario se inicializa vacío y se configura dinámicamente
   * con los campos necesarios para capturar la información del domicilio fiscal.
   * @type {FormGroup}
   * @memberof DatosDelTramiteComponent
   */
  public formDomicilioFiscal: FormGroup = this.fb.group({});

  /**
   * Constantes importadas desde el archivo de enumeración que contienen textos importantes y de advertencia.
   *
   * @type {DATOS_ALERT}
   * @memberof DatosDelTramiteComponent
   */
  public DATOS_ALERT = DATOS_ALERT.message;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud de la sección 301.
   * @type {CertiRegistro302State}
   * @memberof DatosDelTramiteComponent
   */
  public certiRegistroState!: CertiRegistro302State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   * 
   * @type {boolean}
   * @memberof DatosDelTramiteComponent
   */
  @Input() public soloLectura: boolean = false;

  /**
   * Arreglo que contiene los productos seleccionados con sus detalles.
   * 
   * Cada elemento del arreglo es una instancia de `DetallesDelProducto`, que representa
   * la información detallada de un producto seleccionado en el trámite actual.
   */
  public selectedProducto: DetallesDelProducto[] = [];

  /**
   * Constructor del componente.
   * 
   * @param fb - Servicio para la creación y manipulación de formularios reactivos.
   * @param tramite302Store - Store para gestionar el estado del trámite 302.
   * @param tramite302Query - Query para consultar el estado del trámite 302.
   */
  constructor(
    private fb: FormBuilder,
    private tramite302Store: Tramite302Store,
    private tramite302Query: Tramite302Query,
    private service: Solicitud302Service
  )
  {}

  /**
   * @method ngOnInit
   * @description 
   * /**
     * Método del ciclo de vida que se ejecuta al inicializar el componente.
     * 
     * Funcionalidades principales:
     * - Suscribe al estado global del trámite 302 para obtener datos iniciales.
     * - Inicializa los formularios reactivos con validaciones dinámicas basadas en las constantes.
     * 
     * Pasos:
     * 1. Suscripción al estado global del trámite 302 (`tramite302Query.selectRegistro$`).
     * 2. Configuración de los formularios reactivos (`form`, `formAgregarProductos`, `formDatosDelDonante`, `formDomicilioFiscal`).
   * @memberof DatosDelTramiteComponent
   */
  ngOnInit(): void {
  this.tramite302Query.selectRegistro$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.certiRegistroState = seccionState;
      })
    )
    .subscribe();

    this.getProductosSeleccionados();
    this.detallesDelProducto = this.certiRegistroState['detallesDelProducto'] || [];
    this.obtenerAduanaOpciones();
    this.obtenerUnidadDeMedidaOpciones();
    this.obtenerImportacionTemporalOpciones();
  }

  /** Obtiene y asigna las opciones de aduana al campo correspondiente en el formulario de productos. */
  obtenerAduanaOpciones(): void {
    this.service
      .getAduanaData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        const ADUANA_FIELD = this.datosDelTramite.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'aduana'
        ) as ModeloDeFormaDinamica;

        if (ADUANA_FIELD) {
          const ADUANA_ARRAY = Array.isArray(resp) ? resp : [resp];
          ADUANA_FIELD.opciones = ADUANA_ARRAY.map((item: { id: number; descripcion: string }) => ({
            descripcion: item.descripcion,
            id: item.id,
          }));
        }
      });
  }

  /** Obtiene y asigna las opciones de aduana al campo correspondiente en el formulario de productos. */
  obtenerUnidadDeMedidaOpciones(): void {
    this.service
    .getUnidadDeMedidaData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        const UNIDAD_FIELD = this.productos.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'unidadDeMedida'
        ) as ModeloDeFormaDinamica;

        if (UNIDAD_FIELD) {
          const UNIDAD_ARRAY = Array.isArray(resp) ? resp : [resp];
          UNIDAD_FIELD.opciones = UNIDAD_ARRAY.map((item: { id: number; descripcion: string }) => ({
            descripcion: item.descripcion,
            id: item.id,
          }));
        }
      });
  }

  /** Obtiene y asigna las opciones de aduana al campo correspondiente en el formulario de productos. */
  obtenerImportacionTemporalOpciones(): void {
    this.service
    .getImportacionTemporalData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        const IMPORTACION_TEMPORAL_FIELD = this.productos.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'anoDeImportacionTemporal'
        ) as ModeloDeFormaDinamica;

        if (IMPORTACION_TEMPORAL_FIELD) {
          const IMPORTACION_TEMPORAL_ARRAY = Array.isArray(resp) ? resp : [resp];
          IMPORTACION_TEMPORAL_FIELD.opciones = IMPORTACION_TEMPORAL_ARRAY.map((item: { id: number; descripcion: string }) => ({
            descripcion: item.descripcion,
            id: item.id,
          }));
        }
      });
  }

  /**
   * compo doc
   * @method abrirModal
   * @description
   * Abre un modal estableciendo su estado a 'show'.
   * Este método se utiliza para mostrar el modal en la interfaz de usuario.
   */
  public abrirModal(): void {
    this.modal = 'show';
  }

  /**
   * compo doc
   * @method cerrarModal
   * @description
   * Cierra el modal utilizando una referencia al botón de cierre.
   * Este método simula un clic en el botón de cierre del modal para ocultarlo.
   */
  public cerrarModal(): void {
    this.closeModal.nativeElement.click();
  }

  /**
   * compo doc
   * @method agregarProductos
   * @description
   * Agrega un nuevo agente a la lista de detalles del producto.
   * Si el formulario es válido, se toma el valor del formulario,
   * se agrega a la lista `detallesDelProducto`, se reinicia el formulario,
   * se cierra el modal y se muestra el modal de confirmación.
   */
  public agregarProductos(): void {
    if (this.formAgregarProductos.valid) {
      const PRODUCTOS = this.formAgregarProductos?.value;
      this.detallesDelProducto?.push(PRODUCTOS);
      this.tramite302Store.setDynamicFieldValue('detallesDelProducto', this.detallesDelProducto);
      this.formAgregarProductos.reset();
      this.cerrarModal();
      this.modalConfirmacion = 'show';
    } else {
      this.formAgregarProductos.markAllAsTouched();
    }
  }

  /**
   * Modifica un producto existente en la lista de detalles del producto.
   *
   * Si el formulario `formAgregarProductos` es válido, busca el producto seleccionado en la lista
   * `detallesDelProducto` y lo reemplaza con los nuevos valores del formulario. Posteriormente,
   * actualiza el estado en el store, limpia la selección y el formulario, cierra el modal y muestra
   * la confirmación.
   *
   * @remarks
   * - Utiliza la comparación de todas las propiedades del producto seleccionado para encontrar el índice.
   * - Si no se encuentra el producto, no realiza ninguna modificación.
   *
   * @returns {void}
   */
  public modificarProductos(): void {
    if (this.formAgregarProductos.valid) {
      const PRODUCTOS = this.formAgregarProductos?.value;
       const INDICE_BORROR = this.detallesDelProducto.findIndex((ele) =>
        Object.entries(this.selectedProducto[0] || {}).every(
          ([key, value]) => ele[key as keyof DetallesDelProducto] === value
        )
      );

    if (INDICE_BORROR !== -1) {
      this.detallesDelProducto[INDICE_BORROR] = PRODUCTOS;
      this.tramite302Store.setDynamicFieldValue('detallesDelProducto', this.detallesDelProducto);
    }
      this.selectedProducto = [];
      this.formAgregarProductos.reset();
      this.cerrarModal();
      this.modalConfirmacion = 'show';
    }
  }

  /**
   * compo doc
   * @method eliminarProducto
   * @description
   * Elimina un producto de la lista de detalles del producto.
   * Si hay un producto seleccionado, busca su índice en la lista,
   * lo elimina y actualiza el store. Luego, limpia la selección
   * y muestra el modal de confirmación.
   */
  public eliminarProducto(): void {
    if (this.selectedProducto.length > 0) {
      const INDICE_BORROR = this.detallesDelProducto.findIndex((ele) =>
        Object.entries(this.selectedProducto[0] || {}).every(
          ([key, value]) => ele[key as keyof DetallesDelProducto] === value
        )
      );
      if (INDICE_BORROR !== -1) {
        this.detallesDelProducto.splice(INDICE_BORROR, 1);
        this.tramite302Store.setDynamicFieldValue('detallesDelProducto', this.detallesDelProducto);
      }
      this.selectedProducto = [];
      this.modalConfirmacion = 'show';
    }
  }

  /** Actualiza el valor dinámico de un campo en el store cuando ocurre un cambio en el formulario. */
  establecerCambioDeValor(event: {campo: string, valor: string | number | object}): void {
     if (event) {
      this.tramite302Store.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /**
   * compo doc
   * @method setValoresStore
   * @description
   * Actualiza un valor dinámico en el store basado en el campo y el formulario proporcionados.
   * Obtiene el valor del campo especificado en el formulario y lo envía al store.
   *
   * @param event Objeto que contiene el nombre del campo y el formulario reactivo.
   */
  public setValoresStore(event: {campo: string, forma: FormGroup}): void {
    const VALOR = event.forma.get(event.campo)?.value;
    this.tramite302Store.setDynamicFieldValue(event.campo, VALOR);
  }

   /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene los productos seleccionados llamando al servicio correspondiente.
   * Suscribe al observable devuelto por `getProductos()` y asigna los datos recibidos
   * a la propiedad `detallesDelProducto`. Si los datos no son un arreglo, los convierte en uno.
   * La suscripción se cancela automáticamente cuando se emite un valor en `destroyNotifier$`.
   *
   * @remarks
   * Este método se utiliza para cargar los detalles de los productos seleccionados
   * y asegurar que la suscripción se gestione correctamente para evitar fugas de memoria.
   */
  getProductosSeleccionados(): void {
    this.service.getProductos().pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(
      (datos:DetallesDelProducto) => {
        this.detallesDelProducto = Array.isArray(datos) ? datos : [datos];
        this.tramite302Store.setDynamicFieldValue('detallesDelProducto', this.detallesDelProducto);
      })
}

 /**
   * Maneja la selección de una fila en la tabla.
   * Actualiza el formulario y el store con los datos de la fila seleccionada.
   * 
   * @param row - Los datos de la fila seleccionada.
   */
  valorDeAlternancia(row:DetallesDelProducto[]): void {
   this.selectedProducto = row;
  }

  /**
   * Muestra un modal para modificar un producto seleccionado.
   * 
   * Si hay al menos un producto seleccionado en `selectedProducto`, 
   * muestra el modal, actualiza el formulario `formAgregarProductos` 
   * con los datos del primer producto seleccionado, limpia la selección 
   * y cierra el modal.
   */
  modificarModal(): void {
    if (Array.isArray(this.selectedProducto) && this.selectedProducto.length > 0) {
      this.modal = 'show';
      this.formAgregarProductos.patchValue(this.selectedProducto[0]);
      this.selectedProducto = [];
      this.cerrarModal();
    }
  }

  /**
 * Limpia el formulario de productos, restableciendo todos sus campos a su estado inicial.
 */
  limpiarProductos(): void {
    this.formAgregarProductos.reset();
  }
}
