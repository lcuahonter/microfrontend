import { Catalogo, CatalogoSelectComponent, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, RespuestaCatalogos } from "@libs/shared/data-access-user/src";
import { Component,EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {Observable,Subject, delay, of, takeUntil } from "rxjs";
import { CertificadosOrigenService } from "../../services/certificado-origen.service";
import { CommonModule } from "@angular/common";
import { Mercancia } from "../../../../shared/models/modificacion.enum";

import { Tramite110223Query } from "../../query/tramite110223.query";
import { Tramite110223Store } from "../../estados/Tramite110223.store";

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
  labelNombre: 'Fecha de factura',
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
    InputFechaComponent,
    NotificacionesComponent
  ],
  templateUrl: './mercancias-modal.component.html',
  styleUrl: './mercancias-modal.component.scss',
})

export class MercanciasModalComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * @type {boolean}
   */
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * Indica si la alerta debe mostrarse en el modal.
   * @type {boolean}
   */
  mostrarAlerta: boolean = false;
  /**
   * @property {string} mensajeDeAlerta - La lista de mercancías mostrada solamente contiene aquellas mercancías que tienen un registro de productos vigente para el tratado/acuerdo-país/bloque y cuya fracción arancelaria no está asociada a un cupo.
   */
  mensajeDeAlerta: string = 'La lista de mercancías mostrada solamente contiene aquellas mercancías que tienen un registro de productos vigente para el tratado/acuerdo-país/bloque y cuya fracción arancelaria no está asociada a un cupo.';
  
    /**
   * @property {FormGroup} mercanciaForm
   * @description Formulario reactivo que captura los datos de la mercancía en el modal.
   */
  mercanciaForm: FormGroup= this.fb.group({
    id:[],
  fraccionArancelaria: [{ value: '', disabled: true }],  
  numeroDeRegistrodeProductos: [{ value: '', disabled: true }], 
  fechaExpedicion: [{ value: '', disabled: true }],     
  fechaVencimiento: [{ value: '', disabled: true }],    
  nombreTecnico: [{ value: '', disabled: true }],
  nombreComercial: [{ value: '', disabled: true }],
  normaOrigen: [{ value: '', disabled: true }],
  cantidad: ['', [Validators.required]],
  umc: ['', [Validators.required]],
  tipoFactura: ['', [Validators.required]],
  valorMercancia: ['', [Validators.required]],
  fechaFinalInput: ['', [Validators.required]],
  numeroFactura: ['', [Validators.required]],
  unidadMedidaMasaBruta: [''],                          
  complementoClasificacion: ['', [Validators.required]],
  complementoDescripcion: [''],                       
  fraccionNaladi: [{ value: '', disabled: true }],
  fraccionNaladiSa93: [{ value: '', disabled: true }],
  fraccionNaladiSa96: [{ value: '', disabled: true }],
  fraccionNaladiSa02: [{ value: '', disabled: true }],
  nalad: ['']                                         
});



  /**
   * @property {EventEmitter<any>} guardarClicado
   * @description Evento emitido cuando el usuario hace clic en guardar en el modal de mercancías.
   */
  @Output() guardarClicado = new EventEmitter();

  /**
   * @property {EventEmitter<any>} cerrarClicado
   * @description Evento emitido cuando el usuario hace clic en cerrar el modal de mercancías.
   */
  @Output() cerrarClicado = new EventEmitter();
  /**
   * @property {EventEmitter<any>} tablaSeleccionEvent
   * @description
   * Evento emitido cuando se realiza una selección en la tabla de mercancías del modal.
   * Permite notificar al componente padre que se ha realizado una acción de selección en la tabla.
   */
  @Output() tablaSeleccionEvent = new EventEmitter();

  


  /**
 * Array de datos a mostrar en la tabla.
 * Cada elemento de este array representa una fila de la tabla.
 *
 * @type {T[]}
 */ datosSeleccionados!: Mercancia;
  /**
   * Subject utilizado para gestionar el ciclo de vida del componente y cancelar l`as suscripciones.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Observable<Catalogo[]>} umcs$
   * @description Observable que emite la lista de UMCs disponibles.
   */
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
  facturas$!: Observable<Catalogo[]>;
  /**
   * Propiedad booleana que indica si hay mercancías disponibles.
   */
  private actualizandoFormulario = false;

    /**
   * @property {Notificacion} nuevaNotificacion
   * @description
   * Objeto que almacena la información de la notificación a mostrar en el modal de mercancías.
   * Se utiliza para mostrar mensajes de alerta, éxito o información al usuario dentro del componente.
   */
  nuevaNotificacion!: Notificacion;
    /**
     * Observable que emite los datos de la mercancia en formato tabla.
     * @type {Observable<Mercancia[]>}
     */
    datosTabla$: Observable<Mercancia[]> = of([]);

  /**
   * Constructor del componente MercanciasModalComponent.
   * 
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite110204Store} store - Store para manejar el estado del formulario de mercancía.
   * @param {Tramite110204Query} tramiteQuery - Query para obtener datos reactivos del estado.
   * @param {CertificadosOrigenGridService} certificadoService - Servicio para obtener catálogos de facturas y UMC.
   */
  constructor(
    private fb: FormBuilder,
    public store: Tramite110223Store,
    public tramiteQuery: Tramite110223Query,
    public certificadoService: CertificadosOrigenService,
  ) {

    this.tramiteQuery?.formMercancia$?.pipe(
      takeUntil(this.destroyNotifier$)).subscribe((estado) => {

      // eslint-disable-next-line dot-notation
      if (!this.actualizandoFormulario && estado && estado['fraccionNaladiSa02']) {
        this.actualizandoFormulario = true;
        this.mercanciaForm.patchValue(estado);
        this.actualizandoFormulario = false;
      }
    });
    this.facturas$ = this.tramiteQuery.selectFactura$;
    this.umcs$ = this.tramiteQuery.selectUmc$;
    this.datosTabla$ = this.tramiteQuery.selectmercanciaTabla$;
    // Suscríbete a los cambios de selectedMercancia para actualizar datosSeleccionados
    this.tramiteQuery.select(state => state.selectedMercancia)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((selected) => {
      this.datosSeleccionados = selected as Mercancia;
      this.parchearValoresDelFormulario();
      });
    

  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa el formulario reactivo de mercancías y configura las suscripciones necesarias.
   */
  ngOnInit(): void {
   
    this.parchearValoresDelFormulario();
    this.cargarFactura();
    this.cargarUmc();
    this.mercanciaForm.valueChanges.subscribe(value => {
      if (!this.actualizandoFormulario) {
        this.store.setFormMercancia(value);
      }
    });
    if(this.esFormularioSoloLectura){
      this.mercanciaForm.disable();
    }
    this.nuevaNotificacion = {} as Notificacion;
  }
  /**
   * @method parchearValoresDelFormulario
   * @description Este método parcha los valores del formulario `mercanciaForm` con los datos seleccionados (`datosSeleccionados`).
   * Si `datosSeleccionados` está definido, se actualizan los campos del formulario con los valores correspondientes de `datosSeleccionados`.
   */
  parchearValoresDelFormulario(): void {

    if (this.datosSeleccionados) {
      this.mercanciaForm.patchValue({
        id:this.datosSeleccionados.id|| 0 ,
        fraccionNaladi: this.datosSeleccionados.fraccionNaladi,
        fraccionNaladiSa93: this.datosSeleccionados.fraccionNaladiSa93,
        fraccionNaladiSa96: this.datosSeleccionados.fraccionNaladiSa96,
        fraccionNaladiSa02: this.datosSeleccionados.fraccionNaladiSa02,
        nombreComercial: this.datosSeleccionados.nombreComercial,
        nombreTecnico: this.datosSeleccionados.nombreTecnico,
        normaOrigen: this.datosSeleccionados.normaOrigen,
        cantidad: this.datosSeleccionados.cantidad,
        umc: this.datosSeleccionados.umc,
        unidadMedidaMasaBruta:this.datosSeleccionados.unidadMedidaMasaBruta,
        valorMercancia: this.datosSeleccionados.valorMercancia,
        complementoClasificacion: this.datosSeleccionados.complementoClasificacion,
        fechaFinalInput: this.datosSeleccionados.fechaFinalInput,
        numeroFactura: this.datosSeleccionados.numeroFactura,
        tipoFactura: this.datosSeleccionados.tipoFactura,
        nalad:this.datosSeleccionados.nalad,
        complementoDescripcion:this.datosSeleccionados.complementoDescripcion

      });
    }
  }
  /**
   * Establece el estado seleccionado en el store.
   * @param {Catalogo} factura El estado seleccionado.
   */
  tipoFacturasSeleccion(factura: Catalogo): void {
    this.store.setFactura([factura]);
  }
  /**
    * Establece el estado seleccionado en el store.
    * @param {Catalogo} umc El estado seleccionado.
    */
  tipoUmcSeleccion(umc: Catalogo): void {
    this.store.setUmc([umc]);
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
        },
        (error) => {
          console.error('Error al cargar los estados:', error);
        }
      );
  }
    /**
   * Cambia el valor de la fecha final en el formulario.
   * @param nuevo_valor Nuevo valor de la fecha final.
   */
    public cambioFechaFinal(nuevo_valor: string): void {
      this.mercanciaForm.get('fechaFinalInput')?.setValue(nuevo_valor);
      this.mercanciaForm.get('fechaFinalInput')?.markAsUntouched();
    }
  

  /**
   * Carga las UMC desde el servicio y las establece en el store.
   */
  cargarUmc(): void {
    this.certificadoService
      .getUMC()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data: RespuestaCatalogos) => {
          this.store.setUmc(data.data)
        },
        (error) => {
          console.error('Error al cargar los estados:', error);
        }
      );
  }

  activarModal(): void {
    if(this.mercanciaForm.invalid){
this.mercanciaForm.markAllAsTouched();
    }
    else{
    this.mostrarAlerta = true;
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: '',
      mensaje: this.mensajeDeAlerta,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
  }
  }

  /**
   * Dispara el evento para guardar los datos del formulario y muestra una alerta.
   */
  aceptar(): void {
    const FORM_VALUE: Mercancia = this.mercanciaForm.getRawValue();

    if (!FORM_VALUE.id) {
      FORM_VALUE.id = Math.floor(Math.random() * 1000); // random ID if new
    }

    this.store.upsertMercancia(FORM_VALUE);

    if (this.mostrarAlerta) {
      of(null)
        .pipe(delay(100), takeUntil(this.destroyNotifier$))
        .subscribe(() => {
          this.cerrarModal();
        });
    }
  }
  cerrarModal(): void {
    this.store.clearSelectedMercancia();
    this.mercanciaForm.reset();
    this.cerrarClicado.emit();
      this.mostrarAlerta = false;
  }

  /**
   * Cancela las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.mercanciaForm.reset();
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
