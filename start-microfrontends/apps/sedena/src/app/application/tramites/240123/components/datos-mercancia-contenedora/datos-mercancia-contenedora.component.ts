import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosMercanciaComponent } from '../../../../shared/components/datos-mercancia/datos-mercancia.component';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { ID_PROCEDIMIENTO } from '../../constants/exportacion-sustancias-quimicas.enum';
import { Location } from '@angular/common';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { ReactiveFormsModule } from '@angular/forms';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite240123Store } from '../../estados/tramite240123Store.store';

/**
 * @title Datos de la Mercancía Contenedora
 * @description Componente contenedor encargado de recibir los datos de mercancía y actualizar el estado global del trámite.
 * @summary Actúa como puente entre el componente de datos de mercancía y el store de Akita.
 */
@Component({
  selector: 'app-datos-mercancia-contenedora',
  standalone: true,
imports: [CommonModule, CatalogoSelectComponent, ReactiveFormsModule, TituloComponent],
  templateUrl: './datos-mercancia-contenedora.component.html',
  styleUrl: './datos-mercancia-contenedora.component.scss',
})
export class DatosMercanciaContenedoraComponent implements OnInit, OnDestroy,AfterViewInit {
  
  /**
   * Evento que se emite cuando se actualiza la tabla de mercancías o se requiere cerrar el componente.
   * 
   * @event cerrar
   * @type {EventEmitter<void>}
   * @memberof DatosMercanciaContenedoraComponent
   * @description
   * Este evento se utiliza para notificar al componente padre que se debe cerrar el componente actual,
   * por ejemplo, después de guardar o actualizar los datos de la mercancía.
   */
  @Output() cerrar = new EventEmitter<void>();

  /**
   * Observable para controlar el ciclo de vida de las suscripciones.
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Lista de mercancías registradas.
   * @property {MercanciaDetalle[]} datosMercancias
   */
  datosMercancias: MercanciaDetalle[] = [];

  /**
   * @property
   * @name idProcedimiento
   * @type {number}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Formulario reactivo para capturar los datos de la mercancía.
   * @property {FormGroup} datosMercancia
   */
  datosMercancia!: FormGroup;

  /**
   * Catálogo de fracciones arancelarias.
   * @property {Catalogo[]} fraccionesCatalogo
   */
  fraccionesCatalogo: Catalogo[] = [];

  /**
   * Catálogo de unidades de medida comercial (UMC).
   * @property {Catalogo[]} umcCatalogo
   */
  umcCatalogo: Catalogo[] = [];

  /**
   * Catálogo de tipos de moneda.
   * @property {Catalogo[]} monedaCatalogo
   */
  monedaCatalogo: Catalogo[] = [];

  @Input() data!: MercanciaDetalle;
  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite240123Store} tramiteStore - Store de Akita para actualizar el estado de la tabla de mercancías.
   * @param {Location} ubicaccion - Servicio para navegación hacia atrás.
   * @returns {void}
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,  
    private tramiteStore: Tramite240123Store,
    private ubicaccion: Location,
  ) {}

  /**
   * Carga los catálogos necesarios para llenar los selectores del formulario.
   * @method cargarDatos
   * @returns {void}
   */
  cargarDatos(): void {
    this.datosSolicitudService
      .obtenerFraccionesCatalogo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.fraccionesCatalogo = data;
      });

    this.datosSolicitudService
      .obtenerMonedaCatalogo()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.monedaCatalogo = data;
      });
  }
  /**
   * Inicializa los valores del formulario después de que la vista del componente haya sido inicializada.
   * 
   * Este método se ejecuta después de que Angular haya completado la inicialización de la vista del componente
   * y sus vistas hijas. Si existe información de datos (this.data), actualiza el formulario reactivo
   * datosMercancia con los valores correspondientes de la mercancía contenedora.
   * 
   * @memberof DatosMercanciaContenedoraComponent
   * @since 1.0.0
   * @example
   * ```typescript
   * // El método se ejecuta automáticamente después de la inicialización de la vista
   * // No requiere llamada manual
   * ```
   */
  ngAfterViewInit(): void {
    if (this.data) {
        this.datosMercancia.patchValue({
          descripcion: this.data.descripcion,
          fraccionArancelaria: this.data.fraccionArancelaria,
          descFraccion: this.data.descripcionFraccion,
          cantidadUMT: this.data.cantidadUMT,
          umt: this.data.unidadMedidaTarifa,
          valorComercial: this.data.valorComercial,
          umc: this.data.umc,
          tipoMoneda: this.data.tipoMoneda,
          id:this.data.id
        });
    }
  }

  /**
   * Guarda los datos de la mercancía actual, los emite al componente padre y resetea el formulario.
   * @method guardar
   * @returns {void}
   */
  guardar(): void {
    const FORM_ID = this.datosMercancia.get('id')?.getRawValue() || 0;
const DATOS_MERCANCIA: MercanciaDetalle = {
      id: FORM_ID === 0 ? Math.floor(Math.random() * 1000000) : FORM_ID,
      fraccionArancelaria: this.datosMercancia.get('fraccionArancelaria')?.getRawValue(),
      descripcionFraccion: this.datosMercancia.get('descFraccion')?.getRawValue(),
      unidadMedidaTarifa: this.datosMercancia.get('umt')?.getRawValue(),
      cantidadUMT: this.datosMercancia.get('cantidadUMT')?.getRawValue(),
      valorComercial: this.datosMercancia.get('valorComercial')?.getRawValue(),
      tipoMoneda: this.datosMercancia.get('tipoMoneda')?.getRawValue(),
      descripcion: this.datosMercancia.get('descripcion')?.getRawValue(),
      tipo_moneda: ''
    };
    this.datosMercancias.push(DATOS_MERCANCIA);
 if (FORM_ID === 0) {
      this.updateMercanciaDetalle(this.datosMercancias);
    } else {
      this.tramiteStore.updateListMercanciaTablaDatos(this.datosMercancias);
    }
        this.datosMercancia.reset();
    this.cerrar.emit();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Llama a la creación del formulario y carga los datos necesarios.
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.crearFormaulario();
    this.cargarDatos();
  }

  /**
   * Actualiza los datos de la tabla de mercancía en el store.
   *
   * @method updateMercanciaDetalle
   * @param {MercanciaDetalle[]} event - Lista de mercancías actualizada desde el formulario.
   * @returns {void}
   */
  updateMercanciaDetalle(event: MercanciaDetalle[]): void {
    this.tramiteStore.updateMercanciaTablaDatos(event);
    this.cerrar.emit();
  }

  /**
   * Crea el formulario reactivo `datosMercancia` utilizando `FormBuilder`.
   * Define los campos y sus validaciones.
   * @method crearFormaulario
   * @returns {void}
   */
  crearFormaulario(): void {
    this.datosMercancia = this.fb.group({
      descripcion: ['PRUEBA QA', Validators.required],
      fraccionArancelaria: ['25030002', Validators.required],
      descFraccion: [
        {
          value: 'Azufre de cualquier clase, excepto el sublimado, el precipitado y el coloidal.',
          disabled: true,
        },
        Validators.required,
      ],
      cantidadUMT: [null, Validators.required],
      umt: [{ value: 'Kilogramo', disabled: true }, Validators.required],
      valorComercial: [null, Validators.required],
      umc: [null, Validators.required],
      tipoMoneda: [null, Validators.required],
      id:[0,Validators.required]
    });
    this.cargarDatos();
  }

  /**
   * Limpia todos los campos del formulario.
   * @method limpiarFormulario
   * @returns {void}
   */
  limpiarFormulario(): void {
    this.datosMercancia.reset({
      descripcion: null,   
      fraccionArancelaria: null,   
      cantidadUMT: null,   
      umc: null,
      valorComercial: null,  
      tipoMoneda: null,   
    });
  }

  /**
   * @method cancelar
   * @description Navega hacia la vista anterior utilizando el servicio de ubicación (`Location`).
   * @returns {void}
   */
  cancelar(): void {
this.cerrar.emit();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
