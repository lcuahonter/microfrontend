import { Catalogo, CatalogoSelectComponent, InputFecha, InputFechaComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, delay, of, takeUntil } from 'rxjs';
import { CertificadoValidacionService } from '../../services/certificado-validacion.service';
import { CommonModule } from '@angular/common';

import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { Tramite110202Query } from '../../estados/tramite110202.query';
import { Tramite110202Store } from '../../estados/tramite110202.store';
/**
 * Constante que representa la configuración de la fecha final.
 * 
 * @constant
 * @type {Object}
 * @property {string} labelNombre - El nombre de la etiqueta para la fecha final.
 * @property {boolean} required - Indica si el campo de fecha final es obligatorio.
 * @property {boolean} habilitado - Indica si el campo de fecha final está habilitado.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha fin',
  required: true,
  habilitado: true,
};
@Component({
  selector: 'app-mercancias-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CatalogoSelectComponent,
    CommonModule,
    InputFechaComponent],
  templateUrl: './mercancias-modal.component.html',
  styleUrl: './mercancias-modal.component.scss',
})

export class MercanciasModalComponent implements OnInit, OnDestroy {
  mostrarAlerta: boolean = false;
  /**
   * @property {string} mensajeDeAlerta - La lista de mercancías mostrada solamente contiene aquellas mercancías que tienen un registro de productos vigente para el tratado/acuerdo-país/bloque y cuya fracción arancelaria no está asociada a un cupo.
   */
  mensajeDeAlerta: string = 'La lista de mercancías mostrada solamente contiene aquellas mercancías que tienen un registro de productos vigente para el tratado/acuerdo-país/bloque y cuya fracción arancelaria no está asociada a un cupo.';
  mercanciaForm!: FormGroup;
  @Output()tablaSeleccionEvent = new EventEmitter();
  @Output() guardarClicado = new EventEmitter();
  @Output() cerrarClicado = new EventEmitter();


  /**
 * Array de datos a mostrar en la tabla.
 * Cada elemento de este array representa una fila de la tabla.
 *
 * @type {T[]}
 */
  @Input() datosSeleccionados!: Mercancia;
  /**
   * Subject utilizado para gestionar el ciclo de vida del componente y cancelar l`as suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

  public fechaFinalInput: InputFecha = FECHA_FINAL;


  /**
   * Observable que emite la lista de estados disponibles.
   * @type {Observable<Catalogo[]>}
   */
  umcs$!: Observable<Catalogo[]>;

  /**
   * Observable que emite la lista de estados disponibles.
   * @type {Observable<Catalogo[]>}
   */
  masaBrutas$!: Observable<Catalogo[]>;

  /**
* Observable que emite la lista de estados disponibles.
* @type {Observable<Catalogo[]>}
*/
  facturas$!: Observable<Catalogo[]>;
  private actualizandoFormulario = false;

  constructor(private fb: FormBuilder, public store: Tramite110202Store,
    public tramiteQuery: Tramite110202Query, public certificadoService: CertificadoValidacionService,
  ) {

    this.tramiteQuery?.formMercancia$?.pipe(
      delay(100),
      takeUntil(this.destroyNotifier$)).subscribe((estado) => {
        if (!this.actualizandoFormulario && estado && estado['fraccionArancelaria']) {
          this.actualizandoFormulario = true;
          this.mercanciaForm.patchValue(estado);
          this.actualizandoFormulario = false;
        }
      });
    this.facturas$ = this.tramiteQuery.selectFactura$ as Observable<Catalogo[]>;
    this.umcs$ = this.tramiteQuery.selectUmc$ as Observable<Catalogo[]>;
    this.masaBrutas$ = this.tramiteQuery.selectMasaBruta$ as Observable<Catalogo[]>;

  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario `mercanciaForm` con sus campos y validaciones.
   * También parcha los valores del formulario con los datos seleccionados y carga las facturas y UMC.
   */
  ngOnInit(): void {
    this.mercanciaForm = this.fb.group({
      fraccionArancelaria: [{ value: '', }],
      nombreComercialMercancia: [{ value: '', disabled: true }],
      nombreTecnico: [{ value: '', disabled: true }],
      nombreIngles: [{ value: '', disabled: true }],
      criterioClasificacion: [{ value: '', disabled: true }],
      marca: [''],
      cantidad: [''],
      umc: ['', Validators.required],
      valorMercancia: ['', [Validators.required, Validators.min(0)]],
      complementoClasificacion: ['', Validators.required],
      masaBruta: ['', [Validators.required, Validators.min(0)]],
      unidadMedidaMasaBruta: ['', Validators.required],
      numeroFactura: [''],
      tipoFactura: [''],
      fechaFinal: ['', Validators.required]
    });

    // Parchea los valores del formulario con los datos seleccionados
    this.parchearValoresDelFormulario();

    // Carga las facturas disponibles
    this.cargarFactura();

    // Carga las UMC disponibles
    this.cargarUmc();
  }

  /**
   * @method parchearValoresDelFormulario
   * @description Este método parcha los valores del formulario `mercanciaForm` con los datos seleccionados (`datosSeleccionados`).
   * Si `datosSeleccionados` está definido, se actualizan los campos del formulario con los valores correspondientes de `datosSeleccionados`.
   */
  parchearValoresDelFormulario(): void {

    if (this.datosSeleccionados) {
      this.mercanciaForm.patchValue({
        fraccionArancelaria: this.datosSeleccionados.fraccionArancelaria,
        nombreComercialMercancia: this.datosSeleccionados.nombreComercial,
        nombreTecnico: this.datosSeleccionados.nombreTecnico,
        nombreIngles: this.datosSeleccionados.nombreTecnico,
        criterioClasificacion: this.datosSeleccionados.complementoDescripcion,
        marca: this.datosSeleccionados.normaOrigen,
        cantidad: this.datosSeleccionados.cantidad,
        umc: this.datosSeleccionados.umc,
        valorMercancia: this.datosSeleccionados.valorMercancia,
        complementoClasificacion: this.datosSeleccionados.complementoClasificacion,
        masaBruta: this.datosSeleccionados.fechaVencimiento,
        unidadMedidaMasaBruta: this.datosSeleccionados.unidadMedidaMasaBruta,
        numeroFactura: this.datosSeleccionados.numeroFactura,
        tipoFactura: this.datosSeleccionados.tipoFactura,
        fechaFinal: this.datosSeleccionados.fechaFinalInput,
        normaOrigen: this.datosSeleccionados.normaOrigen,
        id: this.datosSeleccionados.id,
      });
    }
  }
  /**
   * Establece el estado seleccionado en el store.
   * @param {Catalogo} factura El estado seleccionado.
   */
  tipoFacturasSeleccion(factura: Catalogo): void {
    this.store.setFacturasSeleccion(factura);
  }
  /**
    * Establece el estado seleccionado en el store.
    * @param {Catalogo} umc El estado seleccionado.
    */
  tipoUmcSeleccion(umc: Catalogo): void {
    this.store.setUmcSeleccion(umc);
  }

  /**
   * Establece el estado seleccionado en el store.
   * @param {Catalogo} masaBruta El estado seleccionado.
   */
  tipoMasaBrutaSeleccion(masaBruta: Catalogo): void {
    this.store.setMasaBrutaSeleccion(masaBruta);
  }
  /**
   * Carga las facturas desde el servicio y las establece en el store.
   */
  cargarFactura(): void {
    this.certificadoService
      .obtenerFacturas()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data: Catalogo[]) => {
          this.store.setFactura(data)
        }
      );
  }
  /**
 * Cambia el valor de la fecha final en el formulario.
 * @param nuevo_valor Nuevo valor de la fecha final.
 */
  public cambioFechaFinal(nuevo_valor: string): void {

    this.mercanciaForm.get('fechaFinal')?.setValue(nuevo_valor);
    this.mercanciaForm.get('fechaFinal')?.markAsUntouched();
  }


  /**
   * Carga las UMC desde el servicio y las establece en el store.
   */
  cargarUmc(): void {
    this.certificadoService
      .obtenerUmc()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data: Catalogo[]) => {
          this.store.setUmc(data)
          this.store.setMasaBruta(data);
        }
      );
  }

  /**
   * Dispara el evento para guardar los datos del formulario y muestra una alerta.
   */
  activarModal(): void {
    this.mostrarAlerta = true;
  }

  /**
   * Acepta los datos del formulario, los guarda en el store y cierra el modal si es necesario.
   * También emite eventos relacionados con la tabla y el cierre del modal.
   */
  aceptar(): void {
    // Guardar los datos del formulario en el store
    this.store.setFormMercancia(this.mercanciaForm.value);
    // Emitir los datos del formulario al evento guardarClicado
    this.guardarClicado.emit(this.mercanciaForm.value);
    // Guardar los datos del formulario en el store
    this.store.setmercanciaTabla([this.mercanciaForm.value]);

    // Si la alerta está activa, cerrar el modal y emitir el evento de selección de tabla
    if (this.mostrarAlerta) {
      of(null).pipe(delay(100)).subscribe(() => {
        this.cerrarModal();
        this.tablaSeleccionEvent.emit(true);
      });
    }
  }

  /**
   * Dispara el evento para cerrar el modal y oculta la alerta.
   */
  cerrarModal(): void {
    this.cerrarClicado.emit();
    this.mostrarAlerta = false;
  }
  
  /**
   * Cancela las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
