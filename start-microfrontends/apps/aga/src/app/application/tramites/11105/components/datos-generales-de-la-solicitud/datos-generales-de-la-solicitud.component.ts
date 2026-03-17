import { CatalogosSelect,ConfiguracionColumna,ConsultaioQuery,ConsultaioState,InputCheckComponent,InputRadioComponent,TablaDinamicaComponent,TablaSeleccion,TituloComponent,ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Component,EventEmitter,OnDestroy,OnInit,Output } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { ReplaySubject, Subject, map, merge, takeUntil } from 'rxjs';
import { Solicitud11105State, Solicitud11105Store } from '../../estados/solicitud11105.store';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/40102/transportista-terrestre.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DATOS_GENERERALES_DE_LA_SOLICICTUD } from '../../constants/retirad-de-la-autorizacion-de-donaciones.enum';
import { DetallesDelMercancia } from '@libs/shared/data-access-user/src/core/models/11105/detalles-del-merchancia.model';
import { RetiradaDeLaAutorizacionDeDonacionesService } from '../../services/retirad-de-la-autorizacion-de-donaciones.service';
import { Solicitud11105Query } from '../../estados/solicitud11105.query';

/**
 * Texto de adjuntar para terceros.
 */
const TERCEROS_TEXTO_DE_ADJUNTAR =
  'Debes capturar la descripción de la mercancía en los mismos términos de la carta de donación';

/**
 * Componente que representa los datos generales de la solicitud.
 */
@Component({
  selector: 'app-datos-generales-de-la-solicitud',
  templateUrl: './datos-generales-de-la-solicitud.component.html',
  styleUrls: ['./datos-generales-de-la-solicitud.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
    FormsModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    InputCheckComponent
  ],
})
export class DatosGeneralesDeLaSolicitudComponent implements OnInit, OnDestroy {
 
/**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

 
  /**
   * Evento de salida que emite un valor de tipo cadena.
   * Este evento se utiliza para notificar cuando se debe continuar con una acción específica.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Subject para manejar la destrucción del componente.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Configuración de la tabla de selección.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Texto de adjuntar para terceros.
   */
  TEXTO_DE_ADJUNTAR: string = TERCEROS_TEXTO_DE_ADJUNTAR;

  /**
   * Indica si la tabla debe mostrarse.
   */
  mostrarTabla = true;

  /**
   * Indica si el popup está abierto.
   */
  isPopupOpen = false;

  /**
   * Indica si el popup está cerrado.
   */
  isPopupClose = true;

  /**
   * Lista de fines elegidos.
   */
  finesElegidos: string[] = [];

  /**
   * Lista de fines seleccionados.
   */
  elegidosSeleccionados: string[] = [];

  /**
   * Catálogo de aduanas.
   */
  public aduana: CatalogosSelect = {
    labelNombre: 'Aduana por la que ingresará la mercancía',
    required: false,
    primerOpcion: 'Seleccione un Valor',
    catalogos: [],
  };

  /**
   * Catálogo del propósito de la mercancía.
   */
  public propositoDeLaMercancia: CatalogosSelect = {
    labelNombre:
      DATOS_GENERERALES_DE_LA_SOLICICTUD.PROPOSITO_DE_LA_MERCANCIA_LABEL_NOMBRE,
    required: false,
    primerOpcion: DATOS_GENERERALES_DE_LA_SOLICICTUD.PRIMAR_OPCION,
    catalogos: [],
  };

  /**
   * Configuración de la tabla.
   */
  configuracionTabla: ConfiguracionColumna<DetallesDelMercancia>[] = [
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.TIO_DE_MERCANCIA,
      clave: (item: DetallesDelMercancia) => item.tipoDeMercancia,
      orden: 1,
    },
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.CANTIDAD,
      clave: (item: DetallesDelMercancia) => item.cantidad,
      orden: 2,
    },
    {
      encabezado:
        DATOS_GENERERALES_DE_LA_SOLICICTUD.UNIDAD_DE_MEDIDA_DE_COMERCIALIZACION,
      clave: (item: DetallesDelMercancia) => item.unidadDeMedida,
      orden: 3,
    },
    {
      encabezado:
        DATOS_GENERERALES_DE_LA_SOLICICTUD.ANO_DE_IMPORTACION_TEMPORAL,
      clave: (item: DetallesDelMercancia) => item.anoDeImportacionTemporal,
      orden: 4,
    },
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.MODEL,
      clave: (item: DetallesDelMercancia) => item.modelo,
      orden: 5,
    },
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.MARCA,
      clave: (item: DetallesDelMercancia) => item.marca,
      orden: 6,
    },
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.NUMBERO_DE_SERIE,
      clave: (item: DetallesDelMercancia) => item.numeroDeSerie,
      orden: 7,
    },
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.USO_ESPECIFICO_DE_LA_MERCANCIA,
      clave: (item: DetallesDelMercancia) => item.usoEspecifico,
      orden: 8,
    },
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.CONDICION_DE_LA_MERCANCIA,
      clave: (item: DetallesDelMercancia) => item.condicionMercancia,
      orden: 9,
    },
    {
      encabezado: DATOS_GENERERALES_DE_LA_SOLICICTUD.VEHICULO,
      clave: (item: DetallesDelMercancia) => item.vehiculo,
      orden: 10,
    },
  ];

  /**
   * Formulario de trámite.
   */
  tramiteForm!: FormGroup;

  /**
   * Valor seleccionado del radio.
   */
  valorSeleccionado!: string;

  /**
   * Datos configurados para la tabla.
   */
  configuracionTablaDatos: DetallesDelMercancia[] = [];

  /**
   * Opciones para el radio button.
   */
  radioOpcions = [
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' },
  ];

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud11105State;

  /**
   * Lista de países.
   */
  pais!: Catalogo[];

  /**
   * Constructor de la clase.
   * @param retiradaDeLaAutorizacionDeDonacionesService Servicio para manejar datos relacionados con la autorización de donaciones.
   * @param formBuilder FormBuilder para construir formularios reactivos.
   * @param validacionesService Servicio para manejar validaciones de formularios.
   */
  constructor(
    private retiradaDeLaAutorizacionDeDonacionesService: RetiradaDeLaAutorizacionDeDonacionesService,
    public formBuilder: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
    private store: Solicitud11105Store,
    private query: Solicitud11105Query,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.query.seleccionarSolicitud$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((seccionState) => {
              this.solicitudState = seccionState;
              this.donanteDomicilio();
            })
          )
          .subscribe();

    this.buscarAduanaDatos();
    this.buscarpropositoDeLaMercanciaDatos();
    this.buscarDetallesDelMercanciaDatos();
    this.paisSeleccion();

    
     this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.domecilioFormulario();
        })
      )
      .subscribe();
  }

  /**
     * Inicializa los catálogos de países y documentos de residencia.
     * @returns {void}
     */
    private inicializaCatalogos(): void {
      const PAIS$ = this.retiradaDeLaAutorizacionDeDonacionesService
        .getPaisCatalogo()
        .pipe(
          map((resp) => {
            this.pais = resp.data;
          })
        );
  
      merge(
        PAIS$
      )
        .pipe(takeUntil(this.destroyed$))
        .subscribe();
    }

    /**
   * Configura el formulario del destinatario según el estado de la solicitud.
   *  Si el formulario está en modo solo lectura, deshabilita los campos del formulario.
   *  @returns {void}
   */
    domecilioFormulario(): void {
    if (this.soloLectura) {
      this.tramiteForm.disable();
    }
  }

  /**
   * Busca los datos de la aduana.
   */
  buscarAduanaDatos(): void {
    this.retiradaDeLaAutorizacionDeDonacionesService
      .getAduanaIngresara()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.aduana.catalogos = response as Catalogo[];
      });
  }

  /**
   * Busca los datos del propósito de la mercancía.
   */
  buscarpropositoDeLaMercanciaDatos(): void {
    this.retiradaDeLaAutorizacionDeDonacionesService
      .getAduanaIngresara()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.propositoDeLaMercancia.catalogos = response as Catalogo[];
      });
  }

  /**
   * Busca los detalles de la mercancía.
   */
  buscarDetallesDelMercanciaDatos(): void {
    this.retiradaDeLaAutorizacionDeDonacionesService
      .getDetallesDelMercanciaDatos()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: DetallesDelMercancia) => {
        this.configuracionTablaDatos = [datos];
      });
  }

  /**
   * Selecciona el país del formulario y lo guarda en el estado global.
   * @returns {void}
   */
  paisSeleccion(): void {
    const PAIS = this.tramiteForm.get('pais')?.value;
    this.store.setPais(PAIS);
  }

  /**
   * Cambia el valor seleccionado del radio button.
   * @param value Valor seleccionado.
   */
  cambiarRadio(value: string | number): void {
    this.valorSeleccionado = value as string;
  }

  /**
   * Abre el popup.
   */
  openPopup(): void {
    this.isPopupOpen = true;
  }

  /**
   * Cierra el popup.
   */
  closePopup(): void {
    this.isPopupOpen = false;
    this.isPopupClose = false;
  }

  /**
   * Muestra la siguiente tabla.
   */
  nextTabla(): void {
    this.mostrarTabla = false;
  }

  /**
   * Valida si un campo del formulario es válido.
   * @param form Formulario reactivo.
   * @param field Nombre del campo.
   * @returns `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Obtiene el grupo de formulario de importador/exportador.
   */
  get retiradaDeDonaciones(): FormGroup {
    return this.tramiteForm.get('retiradaDeDonaciones') as FormGroup;
  }

  /**
   * Inicializa el formulario de donante y domicilio con los valores del estado de la solicitud.
   */
  donanteDomicilio(): void {
    this.tramiteForm = this.formBuilder.group({
        aduana: [{ value: this.solicitudState?.aduana, disabled: true }],
        organismoPublico: [{ value: this.solicitudState?.organismoPublico, disabled: true }],
        nombre: [{ value:this.solicitudState?.nombre, disabled: true }],
        personaFisica: [{ value: this.solicitudState?.personaFisica, disabled: true }],
        tipoMercancia: [
          { value: this.solicitudState?.tipoMercancia, disabled: true },
          [Validators.required, Validators.maxLength(100)],
        ],
        usoEspecifico: [
          { value: this.solicitudState?.usoEspecifico, disabled: true },
          [Validators.required, Validators.maxLength(512)],
        ],
        condicion: [{ value: this.solicitudState?.condicion, disabled: true }, Validators.required],
        marca: [
          { value: this.solicitudState?.marca, disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        ano: [{ value: this.solicitudState?.ano, disabled: true }, [Validators.required]],
        modelo: [
          { value: this.solicitudState?.modelo, disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        serie: [
          { value: this.solicitudState?.serie, disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        manifesto: [{ value: this.solicitudState?.manifesto, disabled: true }],
        calle: [
          { value: this.solicitudState?.calle, disabled: true }
        ],
        numeroExterior: [
          { value: this.solicitudState?.numeroExterior, disabled: true }
        ],
        numeroInterior: [
          { value: this.solicitudState?.numeroInterior, disabled: true }
        ],
        telefono: [
          { value: this.solicitudState?.telefono, disabled: true },
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        correoElectronico: [
          { value: this.solicitudState?.correoElectronico, disabled: true },
          [Validators.required, Validators.email],
        ],
        pais: [{ value: this.solicitudState?.pais, disabled: true }],
        codigoPostal: [
          { value: this.solicitudState?.codigoPostal, disabled: true },
          [Validators.required, Validators.pattern(/^\d{5}$/)],
        ],
        estado: [
          { value: this.solicitudState?.estado, disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        colonia: [
          { value: this.solicitudState?.colonia, disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
        opcion: [{ value: this.solicitudState?.opcion, disabled: true }],
    });
     this.domecilioFormulario();
  }

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo a actualizar.
   * @param metodoNombre Nombre del método del almacén para actualizar el estado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud11105Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Valida el formulario del destinatario.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  validarDestinatarioFormulario(): void {
    if (this.tramiteForm.invalid) {
      this.tramiteForm.markAllAsTouched();
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Método que emite un evento para continuar con el flujo de la solicitud.
   * Este evento no envía ningún dato adicional, solo notifica que se debe proceder.
   */
  continuar(): void {
    this.continuarEvento.emit('');
  }
}
