import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Catalogo, CatalogoSelectComponent, CategoriaMensaje, CrossListLable, CrosslistComponent, Notificacion, NotificacionesComponent, REGEX_SOLO_DIGITOS, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NO_VISIBILIDAD_UMC, PUEDE_MOSTRAR_LA_LISTA_CRUZADA_FOR_MERCANCIA } from '../../constants/datos-del-tramilte.enum';
import { Subject, takeUntil } from 'rxjs';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { MercanciaDetalle } from '../../models/datos-del-tramite.model';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * @title Datos de la Mercancía
 * @description Componente que permite capturar y emitir la información relacionada con una mercancía específica.
 * @summary Componente para gestionar los datos de la mercancía, incluyendo fracción arancelaria, país de origen, valores y unidades.
 */
@Component({
  selector: 'app-datos-mercancia',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    CrosslistComponent,
    TooltipModule,
    NotificacionesComponent
  ],
  templateUrl: './datos-mercancia.component.html',
  styleUrl: './datos-mercancia.component.scss',
})
export class DatosMercanciaComponent implements OnInit, AfterViewInit {

  /**
   * Unique identifier of the procedure associated with the request.
   * Provided by the parent component.
   */
  @Input() idProcedimiento!: number;

  /**
   * Indicates whether the form is displayed in read-only mode.
   * When true, all form controls are disabled.
   */
  @Input() esFormularioSoloLectura = false;

  /**
   * Controls whether the UMT tooltip is displayed.
   */
  @Input() mostrarTooltipUMT = false;

  /**
   * Merchandise data received from the parent component.
   */
  @Input() mercancia!: MercanciaDetalle;

  /**
   * Merchandise data used to prefill the form when editing.
   */
  @Input() formaDatos!: MercanciaDetalle | null | undefined;

  /**
   * Emits the updated list of merchandise items.
   */
  @Output() updateMercanciaDetalle =
    new EventEmitter<MercanciaDetalle[]>();

  /**
   * Emits the updated list when an existing item is modified.
   */
  @Output() actualizaExistenteEnDatosMercancias =
    new EventEmitter<MercanciaDetalle[]>();

  /**
   * Emits when the user triggers a cancel action.
   */
  @Output() cancelarEventListener =
    new EventEmitter<boolean>();

  /**
   * Reactive form used to capture merchandise data.
   */
  datosMercancia!: FormGroup;

  /**
   * Tariff fraction code associated with the merchandise.
   */
  fraccion_arancelaria?: string;

  /**
   * Transaction Unit of Measure (UMT) code.
   */
  cve_umt?: string;

  /**
   * List of registered merchandise items.
   */
  datosMercancias: MercanciaDetalle[] = [];


  /**
   * Indicates whether the cross-list component can be displayed.
   */
  public puedeMostrarLaListaCruzada = false;

  /**
   * Controls the visibility of the UMC field.
   */
  public visibilidadCampoUMC = true;

  /**
   * Catalog of tariff fractions.
   */
  fraccionesCatalogo: Catalogo[] = [];

  /**
   * Catalog of tariff fraction descriptions.
   */
  catalogoDescripcionFracciones: Catalogo[] = [];

  /**
   * Catalog of Commercial Units of Measure (UMC).
   */
  umcCatalogo: Catalogo[] = [];

  /**
   * Catalog of currency types.
   */
  monedaCatalogo: Catalogo[] = [];

  /**
   * Catalog of available countries.
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * Available country labels for selection.
   */
  public seleccionarOrigenDelPais: string[] = [];

  /**
   * Selected countries of origin.
   */
  public seleccionadasPaisDeOriginDatos: string[] = [];

  /**
   * Labels used by the cross-list component.
   */
  public paisDeOriginLabel: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen',
    derecha: 'País(es) seleccionado(s)',
  };

  /**
   * Notification shown to the user.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * Subject used to clean up subscriptions on component destroy.
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Subject used for service-related subscription cleanup.
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Component constructor.
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datosSolicitudService: DatosSolicitudService
  ) { }

/**
 * Angular lifecycle hook executed on component initialization.
 * Configura el formulario, carga catálogos y países,
 * aplica reglas de visibilidad y validación y restaura datos existentes.
 */
ngOnInit(): void {
  this.crearFormaulario();
  this.getPaises();
  this.visibilidadCampoUMC = NO_VISIBILIDAD_UMC.includes(this.idProcedimiento)
    ? false
    : true;
  this.campoObligatorioChange();
  this.puedeMostrarLaListaCruzada =
    PUEDE_MOSTRAR_LA_LISTA_CRUZADA_FOR_MERCANCIA.includes(
      this.idProcedimiento
    );
  if (this.formaDatos) {
    this.datosMercancia.patchValue(this.formaDatos);
    this.datosMercancia.get('descFraccion')?.setValue(this.formaDatos.descripcionFraccion);
    this.fraccion_arancelaria = this.formaDatos.fraccionArancelaria;
    this.datosMercancia.get('descFraccion')?.disable();
    this.datosMercancia.get('umt')?.setValue(this.formaDatos.unidadMedidaTarifa);
    this.datosMercancia.get('umt')?.disable();
    this.datosMercancia.enable();
  }
}

/**
 * Se ejecuta después de inicializar la vista del componente.
 * Deshabilita el formulario cuando está en modo solo lectura.
 */
ngAfterViewInit(): void {
  if (this.esFormularioSoloLectura) {
    this.datosMercancia.disable();
  }
}

/**
 * Se ejecuta al destruirse el componente.
 * Emite y completa `destroyNotifier$` para cancelar suscripciones y evitar fugas de memoria.
 */
ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}

/**
 * Crea y configura el formulario reactivo de datos de mercancía.
 * Define controles, validaciones y valores iniciales,
 * y aplica reglas condicionales según el procedimiento.
 */
crearFormaulario(): void {
  this.datosMercancia = this.fb.group({
    descripcion: ['', Validators.required],
    fraccionArancelaria: ['', { validators: Validators.required }],
    descFraccion: [
      { value: null, disabled: true },
      [Validators.required]
    ],
    cantidadUMT: [
      '',
      [Validators.required, Validators.pattern(REGEX_SOLO_DIGITOS)],
    ],
    umt: [{ value: null, disabled: true }, Validators.required],
    valorComercial: [null, Validators.required],
    umc: [null, Validators.required],
    tipoMoneda: [null, Validators.required],
    paisDeOriginDatos: [null],
  });
  this.cargarDatos();

  if (this.idProcedimiento === 240122) {
    this.datosMercancia.get('umc')?.disable();
  }
}

/**
 * Loads the catalogs required to populate the form select controls,
 * including tariff fractions, UMC, and currency catalogs.
 */
cargarDatos(): void {
  this.datosSolicitudService
    .obtenerFraccionesCatalogo(this.idProcedimiento)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      this.fraccionesCatalogo = data.datos.map((item: Catalogo) => ({
        id: item.clave,
        descripcion: item.clave
      }));
      this.catalogoDescripcionFracciones = data.datos.map((item: Catalogo) => ({
        descripcion: item.descripcion
      }));
    });

  this.datosSolicitudService
    .obtenerUMCCatalogo(this.idProcedimiento)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      this.umcCatalogo = data.datos.map((item: Catalogo) => ({
        id: item.clave,
        descripcion: item.descripcion
      }));
    });

  this.datosSolicitudService
    .obtenerMonedaCatalogo(this.idProcedimiento)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      this.monedaCatalogo = data.datos.map((item: Catalogo) => ({
        id: item.clave,
        descripcion: item.descripcion
      }));
    });
}

/**
 * Maneja la entrada del campo cantidad UMT.
 * Sanitiza y limita el formato numérico y actualiza el control del formulario.
 */
onCantidadUMTInput(event: Event): void {
  const INPUT = event.target as HTMLInputElement;
  let value = INPUT.value;
  value = value.replace(/[^0-9.]/g, '');
  const PARTS = value.split('.');
  if (PARTS.length > 2) {
    value = PARTS[0] + '.' + PARTS.slice(1).join('');
  }
  const [INTEGER_PART, DECIMAL_PART] = value.split('.');
  const LIMITED_INTEGER = INTEGER_PART.slice(0, 12);
  const LIMITED_DECIMAL = DECIMAL_PART ? DECIMAL_PART.slice(0, 3) : '';
  value = LIMITED_DECIMAL ? `${LIMITED_INTEGER}.${LIMITED_DECIMAL}` : LIMITED_INTEGER;
  INPUT.value = value;
  this.datosMercancia.get('cantidadUMT')?.setValue(value, { emitEvent: false });
}

/**
 * Maneja los cambios de entrada del campo valor comercial.
 * Sanitiza el valor para permitir solo números y decimales,
 * y limita la longitud de las partes entera y decimal.
 */
onCantidadvalorComercialInput(event: Event): void {
  const INPUT = event.target as HTMLInputElement;
  let value = INPUT.value;
  value = value.replace(/[^0-9.]/g, '');
  const PARTS = value.split('.');
  if (PARTS.length > 2) {
    value = PARTS[0] + '.' + PARTS.slice(1).join('');
  }
  const [INTEGER_PART, DECIMAL_PART] = value.split('.');
  const LIMITED_INTEGER = INTEGER_PART.slice(0, 12);
  const LIMITED_DECIMAL = DECIMAL_PART ? DECIMAL_PART.slice(0, 3) : '';
  value = LIMITED_DECIMAL ? `${LIMITED_INTEGER}.${LIMITED_DECIMAL}` : LIMITED_INTEGER;
  INPUT.value = value;
  this.datosMercancia.get('valorComercial')?.setValue(value, { emitEvent: false });
}

/**
 * Actualiza las validaciones del campo UMC según su visibilidad.
 */
campoObligatorioChange(): void {
  const UMC = this.datosMercancia.get('umc');
  if (!this.visibilidadCampoUMC) {
    UMC?.clearValidators();
  } else {
    UMC?.setValidators([Validators.required]);
  }
  UMC?.updateValueAndValidity();
}

/**
 * Limpia todos los campos del formulario.
 */
limpiarFormulario(): void {
  this.datosMercancia.reset();
}

/**
 * Handles the selection of a tariff fraction.
 *
 * Sets the selected tariff fraction value, resolves and assigns its full description
 * to the `descFraccion` form control, disables the description field,
 * and triggers loading of the related UMT data.
 */
onFraccionSelected(value: number | undefined): void {
  this.fraccion_arancelaria = String(value);
  const index = this.fraccionesCatalogo.findIndex(item => item.id === value);
  const fullDescription = this.catalogoDescripcionFracciones[index]?.descripcion || '';
  this.datosMercancia.get('descFraccion')?.setValue(fullDescription);
  this.datosMercancia.get('descFraccion')?.disable();
  this.setUMTValue(value?.toString() || '');
}

/**
 * Obtiene y asigna la UMT correspondiente a la fracción arancelaria seleccionada.
 * Actualiza el control del formulario con la descripción y deshabilita el campo UMT.
 */
setUMTValue(value: string): void {
  this.datosSolicitudService
    .setUMT(value, this.idProcedimiento)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      this.datosMercancia.get('umt')?.setValue(data.datos[0].descripcion);
      this.cve_umt = data.datos[0].clave;
      this.datosMercancia.get('umt')?.disable();
    });
}

/**
 * Maneja el cambio en la selección del país de origen.
 */
paisDeOriginSeleccionadasChange(events: string[]): void {
  this.seleccionadasPaisDeOriginDatos = events;
  this.datosMercancia.patchValue({
    paisDeOriginDatos: events,
  });
}

/**
 * Validates and saves the current merchandise data.
 */
guardar(): void {
  const FORM_VALUE = this.datosMercancia.getRawValue();
  if (this.datosMercancia.invalid) {
    this.datosMercancia.markAllAsTouched();
    return;
  }

  const paisesClaveSeleccionados: string[] =
    this.seleccionadasPaisDeOriginDatos
      .map(desc => this.paisesDatos.find(p => p.descripcion === desc)?.id.toString())
      .filter((id): id is string => !!id);

  const umc = this.umcCatalogo.find((b: Catalogo) => b.id === FORM_VALUE.umc);
  const Tipo = this.monedaCatalogo.find((b: Catalogo) => b.id === FORM_VALUE.tipoMoneda);
  const mercancia = {
    fraccion_arancelaria: this.fraccion_arancelaria,
    descripcion_fraccion: FORM_VALUE.descFraccion,
    descripcion_mercancia: FORM_VALUE.descripcion,
    cantidad_umt: FORM_VALUE.cantidadUMT,
    umt: FORM_VALUE.umt,
    cve_umt: this.cve_umt || '1',
    valor_comercial: FORM_VALUE.valorComercial,
    umc: umc ? umc.descripcion : '',
    cve_umc: FORM_VALUE.umc || '1',
    tipoMonedaDescripcion: Tipo ? Tipo.descripcion : '',
    tipo_moneda: FORM_VALUE.tipoMoneda || '',
    pais_origen: paisesClaveSeleccionados
  };
  const payload = { mercancias: [mercancia] };

  this.datosSolicitudService.validarMercancias(payload, this.idProcedimiento)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (respuesta) => {
        if (respuesta.codigo !== '00') {
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: respuesta.error || 'Error al generar la cadena original.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
          return;
        } else {
          const EXISTING_INDEX = this.datosMercancias.findIndex(
            d => d.id === FORM_VALUE.id
          );
          const MERCANCIA_DETAIL: MercanciaDetalle = {
            id: EXISTING_INDEX !== -1
              ? this.datosMercancias[EXISTING_INDEX].id
              : this.datosMercancias.length + 1,
            descripcion: FORM_VALUE.descripcion || '',
            fraccionArancelaria: this.fraccion_arancelaria || '',
            descripcionFraccion: FORM_VALUE.descFraccion || '',
            cantidadUMT: FORM_VALUE.cantidadUMT || '',
            umc: umc ? umc.descripcion : '',
            cve_umc: FORM_VALUE.umc || '1',
            cve_umt: this.cve_umt || '1',
            valorComercial: FORM_VALUE.valorComercial || '',
            tipoMoneda: Tipo ? Tipo.descripcion : '',
            tipo_moneda: FORM_VALUE.tipoMoneda || '',
            unidadMedidaTarifa: FORM_VALUE.umt || '',
            cve_paisOrigen: paisesClaveSeleccionados.length
              ? JSON.stringify(paisesClaveSeleccionados)
              : '',
            paisOrigen: this.seleccionadasPaisDeOriginDatos.length
              ? this.seleccionadasPaisDeOriginDatos.join(', ')
              : ''
          };
          if (EXISTING_INDEX !== -1) {
            this.datosMercancias[EXISTING_INDEX] = MERCANCIA_DETAIL;
          } else {
            this.datosMercancias = [...this.datosMercancias, MERCANCIA_DETAIL];
          }
          this.updateMercanciaDetalle.emit(this.datosMercancias);
          this.formaDatos = null;
          this.datosMercancia.reset();
          this.datosMercancia.patchValue({ id: null })
        }
      },
      error: (err) => {
        const MENSAJE = err?.error?.error || 'Error inesperado al iniciar trámite.';
        this.nuevaNotificacion = {
          tipoNotificacion: 'toastr',
          categoria: CategoriaMensaje.ERROR,
          modo: 'action',
          titulo: '',
          mensaje: MENSAJE,
          cerrar: false,
          txtBtnAceptar: '',
          txtBtnCancelar: '',
        }
      }
    });
}

/**
 * Navega hacia la ruta relativa proporcionada.
 */
irAAcciones(accionesPath: string): void {
  this.router.navigate([accionesPath], {
    relativeTo: this.activatedRoute,
  });
}

/**
 * Emite un evento de cancelación para notificar al componente padre.
 */
cancelar(): void {
  this.cancelarEventListener.emit(true);
}

/**
 * Obtiene la lista de países y prepara los catálogos de origen.
 */
getPaises(): void {
  this.datosSolicitudService
    .getPaises(this.idProcedimiento)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((respuesta) => {
      this.paisesDatos = respuesta.datos.map((item: Catalogo) => ({
        id: item.clave,
        descripcion: item.descripcion
      }));
      this.seleccionarOrigenDelPais = respuesta.datos.map(
        (item: any) => item.descripcion
      );
    });
}
}
