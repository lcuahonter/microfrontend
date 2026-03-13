import { CatalogoSelectComponent, ConfiguracionColumna, InputCheckComponent, Notificacion, NotificacionesComponent, REGEX_CANTIDAD_15_4, REGEX_CORREO_ELECTRONICO, REGEX_NUMERO_INTERIOR, REGEX_NUMERO_PROGRAMA_IMMEX, REGEX_POSTAL, REGEX_RFC, REGEX_TELEFONO_DIGITOS, REGEX_TELEFONO_OPCIONAL, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, map, merge, takeUntil } from 'rxjs';
import { Catalogo } from '../../estados/tramite11102.store';
import { CommonModule } from '@angular/common';
import { DatosDelMercancia } from '../../models/modificacion-donaciones-immex.model';
import { MERCANCIA_TABLA_CONFIGURACION } from '../../constants/modificacion-donaciones-immex.enum';
import { Modal } from 'bootstrap';
import { ModificacionDonacionesImmexService } from '../../services/modificacion-donaciones-immex.service';
import { Solicitud11102State } from '../../estados/tramite11102.store';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite11102Query } from '../../estados/tramite11102.query';
import { Tramite11102Store } from '../../estados/tramite11102.store';
import mercanciaTable from '@libs/shared/theme/assets/json/11102/mercancia-table.json';

/**
 * Componente que representa la funcionalidad de datos del trámite.
 */
@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    TablaDinamicaComponent,
    InputCheckComponent,
    TooltipModule,
    NotificacionesComponent,
  ],
  templateUrl: './datos-del-tramite.component.html',
  styleUrls: ['./datos-del-tramite.component.scss'],
})
export class DatosDelTramiteComponent implements OnInit, OnDestroy {
  /**
   * Suscripciones a observables.
   */
  private subscriptions: Subscription[] = [];

  /**
   * Suscripción para obtener el catálogo de aduanas.
   */
  getAduanaIngresaraSubscription!: Subscription;

  /**
   * Suscripción para obtener el catálogo de años.
   */
  getAnoSubscription!: Subscription;

  /**
   * Suscripción para obtener el catálogo de condiciones.
   */
  getCondicionSubscription!: Subscription;

  /**
   * Suscripción para obtener el catálogo de países.
   */
  getPaisSubscription!: Subscription;

  /**
   * Clase CSS utilizada para mostrar mensajes de alerta informativos en la interfaz.
   */
  infoAlert: string = 'info-alert';
  /**
   * Formulario principal del trámite.
   */
  tramiteForm!: FormGroup;

  /**
   * Formulario para agregar mercancías.
   */
  agregarMercanciasForm!: FormGroup;

  /**
   * Sujeto para manejar la destrucción de observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud11102State;

  /**
   * Encabezado de la tabla de mercancías.
   */
  public mercanciaHeaderData: string[] = [];

  /**
   * Cuerpo de la tabla de mercancías.
   */
  public mercanciaBodyData: DatosDelMercancia[] = [];

  /**
   * Datos de la tabla de mercancías.
   */
  public getMercanciaTableData = mercanciaTable;

  /**
   * Catálogos seleccionados.
   * @type {Catalogo[]}
   */
  fechasSeleccionadas: Catalogo[] = [];

  /**
   * Lista de tipos de mercancía disponibles.
   * @type {Catalogo[]}
   */
  tipoDeMercancia!: Catalogo[];

  /**
   * Lista de condiciones de mercancía disponibles.
   * @type {Catalogo[]}
   */
  condicionMercancia!: Catalogo[];

  /**
   * Lista de unidades de medida disponibles.
   * @type {Catalogo[]}
   */
  unidadMedida!: Catalogo[];

  /**
   * Lista de años disponibles.
   * @type {Catalogo[]}
   */
  ano!: Catalogo[];

  /**
   * Lista de países disponibles.
   * @type {Catalogo[]}
   */
  pais!: Catalogo[];

  /**
   * Lista de aduanas disponibles.
   * @type {Catalogo[]}
   */
  aduana!: Catalogo[];

  /**
   * Referencia al elemento del modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
   * Referencia al modal de confirmación.
   */
  @ViewChild('confirmarModal') confirmarModalElement!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal de confirmación.
   */
  @ViewChild('closeConfirmarModal') closeConfirmarModal!: ElementRef;

  /**
   * Datos de las mercancías.
   */
  public datosDelMercancia: DatosDelMercancia[] = [];

  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Si es `true`, los controles del formulario estarán deshabilitados para evitar modificaciones.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Tipo de selección de la tabla.
   * @property {TablaSeleccion} tablaSeleccion
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla MERCANCÍA.
   */
  configuracionTablaMercancia: ConfiguracionColumna<DatosDelMercancia>[] =
    MERCANCIA_TABLA_CONFIGURACION;

  /**
   * Lista de mercancías seleccionadas.
   * @type {DatosDelMercancia[]}
   */
  mercanciaSeleccionados: DatosDelMercancia[] = [];

  /**
   * @property moduloEmergente
   * @description Indica si el módulo emergente está activo.
   * @type {boolean}
   */
  public moduloEmergente: boolean = false;

  /**
   * @property moduloExitoso
   * @description Indica si el módulo de éxito está activo.
   * @type {boolean}
   * @default false
   */
  public moduloExitoso: boolean = false;

  /**
   * Representa una nueva notificación que será utilizada en el componente.
   * @type {Notificacion}
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Constructor de la clase DatosDelTramiteComponent.
   *
   * @param service11102 Servicio para manejar las modificaciones de donaciones IMMEX.
   * @param store Almacén de estado específico para el trámite 11102.
   * @param query Consulta para obtener datos del estado del trámite 11102.
   * @param formBuilder Constructor de formularios reactivos.
   * @param validacionesService Servicio para realizar validaciones personalizadas en formularios.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    private service11102: ModificacionDonacionesImmexService,
    private store: Tramite11102Store,
    private query: Tramite11102Query,
    public formBuilder: FormBuilder,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
  }

  /**
   * Inicializa el estado del formulario según si es de solo lectura o no.
   * Si es de solo lectura, guarda los datos del formulario; de lo contrario, inicializa el formulario con los datos del donante y domicilio.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosDelFormulario();
    } else {
      this.datosDeAvisoForm();
    }
  }
  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  private inicializaCatalogos(): void {
    const ADUANA$ = this.service11102.getAduana().pipe(
      map((resp) => {
        this.aduana = resp.data;
      })
    );

    const TIPO_DE_MERCANCIA$ = this.service11102.getTipoDeMercancia().pipe(
      map((resp) => {
        this.tipoDeMercancia = resp.data;
      })
    );

    const CONDICION_MERCANCIA$ = this.service11102.getCondicionMercancia().pipe(
      map((resp) => {
        this.condicionMercancia = resp.data;
      })
    );

    const UNIDAD_MEDIDA$ = this.service11102.getUnidadMedida().pipe(
      map((resp) => {
        this.unidadMedida = resp.data;
      })
    );

    const ANO$ = this.service11102.getAno().pipe(
      map((resp) => {
        this.ano = resp.data;
      })
    );

    const PAIS$ = this.service11102.getPais().pipe(
      map((resp) => {
        this.pais = resp.data;
      })
    );

    merge(
      ADUANA$,
      TIPO_DE_MERCANCIA$,
      CONDICION_MERCANCIA$,
      UNIDAD_MEDIDA$,
      ANO$,
      PAIS$
    )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        complete: () => {
          this.obtenerMercancia();
        },
      });
  }

  /**
   * Método que inicializa los formularios `tramiteForm` y `agregarMercanciasForm`
   * con los datos del estado de la solicitud (`solicitudState`).
   *
   * - Establece los valores iniciales de los controles del formulario.
   * - Aplica validadores de Angular para garantizar la validez de los datos ingresados.
   * - Algunos campos se inicializan como deshabilitados para evitar su edición directa.
   * - Se aplica formato específico a los campos como correo electrónico, teléfono, código postal, etc.
   * - Al finalizar, se invoca `inicializarEstadoFormulario()` para configurar el estado general del formulario.
   */
  donanteDomicilio(): void {
    this.tramiteForm = this.formBuilder.group({
      modificacionDonacionesImmex: this.formBuilder.group({
        aduana: [this.solicitudState?.aduana, [Validators.required]],
        organismoPublico: [
          [{ value: this.solicitudState?.organismoPublico, disabled: true }],
        ],
        usoEspecifico: [
          this.solicitudState?.usoEspecifico,
          [Validators.maxLength(4000)],
        ],
        pais: [
          { value: this.solicitudState?.pais, disabled: true },
          Validators.required,
        ],
        rfc: [
          this.solicitudState?.rfc,
          [Validators.required, Validators.pattern(REGEX_RFC)],
        ],
        numeroProgramaImmex: [
          this.solicitudState?.numeroProgramaImmex,
          [Validators.required, Validators.maxLength(11), Validators.pattern(REGEX_NUMERO_PROGRAMA_IMMEX)],
        ],
        razonSocial: [
          { value: this.solicitudState?.razonSocial, disabled: true },
          [Validators.required],
        ],
        correoElectronicoOpcional: [
          this.solicitudState?.correoElectronicoOpcional,
          [
            Validators.pattern(REGEX_CORREO_ELECTRONICO),
            Validators.maxLength(50),
          ],
        ],
        telefonoOpcional: [
          this.solicitudState?.telefonoOpcional,
          [
            Validators.maxLength(30),
            Validators.pattern(REGEX_TELEFONO_OPCIONAL),
          ],
        ],
        calle: [
          { value: this.solicitudState?.calle, disabled: true },
          [Validators.maxLength(80)],
        ],
        numeroExterior: [
          { value: this.solicitudState?.numeroExterior, disabled: true },
          [Validators.maxLength(40)],
        ],
        numeroInterior: [
          { value: this.solicitudState?.numeroInterior, disabled: true },
          [Validators.maxLength(30), Validators.pattern(REGEX_NUMERO_INTERIOR)],
        ],
        telefono: [
          { value: this.solicitudState?.telefono, disabled: true },
          [Validators.required, Validators.pattern(REGEX_TELEFONO_DIGITOS)],
        ],
        correoElectronico: [
          { value: this.solicitudState?.correoElectronico, disabled: true },
          [Validators.maxLength(50)],
        ],
        codigoPostal: [
          { value: this.solicitudState?.codigoPostal, disabled: true },
          [Validators.pattern(REGEX_POSTAL), Validators.maxLength(8)],
        ],
        estado: [
          { value: this.solicitudState?.estado, disabled: true },
          [Validators.maxLength(80)],
        ],
        colonia: [
          { value: this.solicitudState?.colonia, disabled: true },
          [Validators.maxLength(50)],
        ],
      }),
    });

    this.agregarMercanciasForm = this.formBuilder.group({
      datosMercancia: this.formBuilder.group({
        tipoDeMercancia: [
          this.solicitudState?.tipoDeMercancia,
          [Validators.required, Validators.maxLength(200)],
        ],
        condicionMercancia: [
          { value: this.solicitudState?.condicionMercancia, disabled: true },
          Validators.required,
        ],
        unidadMedida: [this.solicitudState?.unidadMedida, Validators.required],
        ano: [this.solicitudState?.ano, Validators.required],
        cantidad: [
          this.solicitudState?.cantidad,
          [Validators.required, Validators.pattern(REGEX_CANTIDAD_15_4)],
        ],
        marca: [this.solicitudState?.marca, Validators.maxLength(60)],
        modelo: [this.solicitudState?.modelo, Validators.maxLength(80)],
        serie: [this.solicitudState?.serie, Validators.maxLength(30)],
      }),
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Obtiene el grupo de formulario de exención de impuestos.
   */
  get modificacionDonacionesImmex(): FormGroup {
    return this.tramiteForm.get('modificacionDonacionesImmex') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario de datos de mercancía.
   */
  get datosMercancia(): FormGroup {
    return this.agregarMercanciasForm.get('datosMercancia') as FormGroup;
  }

  /**
   * Maneja la selección de aduana.
   */
  aduanaSeleccion(): void {
    const ADUANA = this.tramiteForm.get(
      'modificacionDonacionesImmex.aduana'
    )?.value;
    this.store.setAduana(ADUANA);
  }

  /**
   * Maneja la selección del tipo de mercancía.
   */
  tipoDeMercanciaSeleccion(): void {
    const TIPO_DE_MERCANCIA = this.agregarMercanciasForm.get(
      'datosMercancia.tipoDeMercancia'
    )?.value;
    this.store.setTipoDeMercancia(TIPO_DE_MERCANCIA);
  }

  /**
   * Maneja la selección de la condición de mercancía.
   */
  condicionMercanciaSeleccion(): void {
    const CONDICION_MERCANCIA = this.agregarMercanciasForm.get(
      'datosMercancia.condicionMercancia'
    )?.value;
    this.store.setCondicionMercancia(CONDICION_MERCANCIA);
  }

  /**
   * Maneja la selección de la unidad de medida.
   */
  unidadMedidaSeleccion(): void {
    const UNIDAD_MEDIDA = this.agregarMercanciasForm.get(
      'datosMercancia.unidadMedida'
    )?.value;
    this.store.setUnidadMedida(UNIDAD_MEDIDA);
  }

  /**
   * Maneja la selección del año.
   */
  anoSeleccion(): void {
    const ANO = this.agregarMercanciasForm.get('datosMercancia.ano')?.value;
    this.store.setAno(ANO);
  }

  /**
   * Maneja la selección del país.
   */
  paisSeleccion(): void {
    const PAIS = this.tramiteForm.get(
      'modificacionDonacionesImmex.pais'
    )?.value;
    this.store.setPais(PAIS);
  }

  /**
   * Actualiza el indicador de aviso de funcionamiento en el Store.
   * @param evento - Evento que contiene el valor del indicador.
   */
  organismoPublico(): void {
    const ORGANISMOPUBLICO = this.tramiteForm.get(
      'modificacionDonacionesImmex.organismoPublico'
    )?.value;
    this.store.setOrganismoPublico(ORGANISMOPUBLICO);
  }
  /**
   * Valida el formulario de destinatario.
   */
  validarDestinatarioFormulario(): void {
    if (this.tramiteForm.invalid) {
      this.tramiteForm.markAllAsTouched();
    }
  }

  /**
   * Establece valores en el store del trámite.
   * @param form Formulario del cual se obtiene el valor.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite11102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Cierra el modal actual.
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Abre el modal de confirmación si el formulario es válido.
   */
  modificarConfirmarModal(): void {
    const DATOS_ACTUALIZADOS = this.datosMercancia.getRawValue();

    const TABLA_DATOS = {
      ...DATOS_ACTUALIZADOS,
      ano:
        this.ano.find((x) => String(x.id) === String(DATOS_ACTUALIZADOS.ano))
          ?.descripcion ?? DATOS_ACTUALIZADOS.ano,
      unidadMedida:
        this.unidadMedida.find(
          (x) => String(x.id) === String(DATOS_ACTUALIZADOS.unidadMedida)
        )?.descripcion ?? DATOS_ACTUALIZADOS.unidadMedida,
      condicionMercancia:
        this.condicionMercancia.find(
          (x) => String(x.id) === String(DATOS_ACTUALIZADOS.condicionMercancia)
        )?.descripcion ?? DATOS_ACTUALIZADOS.condicionMercancia,
    };

    const SELECCIONADO = this.mercanciaSeleccionados[0];
    const INDICE = this.mercanciaBodyData.findIndex(
      (item) =>
        item.tipoDeMercancia === SELECCIONADO.tipoDeMercancia &&
        item.cantidad === SELECCIONADO.cantidad &&
        item.unidadMedida === SELECCIONADO.unidadMedida &&
        item.ano === SELECCIONADO.ano &&
        item.modelo === SELECCIONADO.modelo &&
        item.marca === SELECCIONADO.marca &&
        item.serie === SELECCIONADO.serie &&
        item.condicionMercancia === SELECCIONADO.condicionMercancia
    );

    if (INDICE !== -1) {
      this.mercanciaBodyData[INDICE] = {
        ...this.mercanciaBodyData[INDICE],
        ...TABLA_DATOS,
      };
      this.mercanciaBodyData = [...this.mercanciaBodyData];
      this.store.setDelMercancia(this.mercanciaBodyData);
      
      // Mostrar notificación de éxito después de actualizar los datos
      this.mostrarNotificacionExito();
      this.moduloExitoso = true;
    }

    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * @method modifySeleccionada
   * @description Muestra un modal utilizando la instancia de `Modal` si el elemento del modal está disponible.
   * Si no hay elementos seleccionados, muestra una notificación de error.
   *
   * @example
   * // Supongamos que `modalElement` está definido:
   * this.modifySeleccionada();
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  modifySeleccionada(): void {
    if (this.mercanciaSeleccionados.length === 0) {
      this.mostrarNotificacionSeleccion();
      this.moduloEmergente = true;
      return;
    }

    if (this.mercanciaSeleccionados.length > 0) {
      const DATOS = this.mercanciaSeleccionados[0];

      const MAPPED_DATOS = {
        ...DATOS,
        unidadMedida:
          this.unidadMedida.find((x) => x.descripcion === DATOS.unidadMedida)
            ?.id ?? DATOS.unidadMedida,
        ano: this.ano.find((x) => x.descripcion === DATOS.ano)?.id ?? DATOS.ano,
        condicionMercancia:
          this.condicionMercancia.find(
            (x) => x.descripcion === DATOS.condicionMercancia
          )?.id ?? DATOS.condicionMercancia,
      };

      this.datosMercancia.patchValue({
        tipoDeMercancia: MAPPED_DATOS.tipoDeMercancia,
        cantidad: MAPPED_DATOS.cantidad,
        unidadMedida: MAPPED_DATOS.unidadMedida,
        ano: MAPPED_DATOS.ano,
        modelo: MAPPED_DATOS.modelo,
        marca: MAPPED_DATOS.marca,
        serie: MAPPED_DATOS.serie,
        condicionMercancia: MAPPED_DATOS.condicionMercancia,
      });

      if (this.modalElement) {
        const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
        MODAL_INSTANCE.show();
      }
    }
  }

  /**
   * Obtiene los datos de mercancías.
   */
  public obtenerMercancia(): void {
    this.service11102
      .obtenerMercanciaDatos()
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((resp) =>
          resp.map((item) => ({
            ...item,
            ano:
              this.ano.find((x) => x.id === item.ano)?.descripcion ?? item.ano,
            unidadMedida:
              this.unidadMedida.find((x) => x.id === item.unidadMedida)
                ?.descripcion ?? item.unidadMedida,
            condicionMercancia:
              this.condicionMercancia.find(
                (x) => x.id === item.condicionMercancia
              )?.descripcion ?? item.condicionMercancia,
          }))
        )
      )
      .subscribe((mappedData) => {
        this.mercanciaBodyData = mappedData;
      });
  }

  /**
   * Habilita o deshabilita el formulario según el modo de solo lectura.
   *
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es `true`),
   * deshabilita todos los controles del formulario para evitar modificaciones.
   * Si no está en modo solo lectura, habilita todos los controles del formulario para permitir la edición.
   */
  guardarDatosDelFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.tramiteForm.disable();
    } else {
      this.tramiteForm.enable();
    }
  }

  /**
   * Método que configura el formulario en modo solo lectura si la propiedad `esFormularioSoloLectura` es verdadera.
   * Se deshabilitan los campos del formulario `tramiteForm` y `agregarMercanciasForm` relacionados con el aviso de modificación de donaciones IMMEX.
   * Esto se utiliza para evitar modificaciones en un formulario que solo debe visualizarse.
   */
  datosDeAvisoForm(): void {
    if (
      this.esFormularioSoloLectura &&
      this.tramiteForm &&
      this.agregarMercanciasForm
    ) {
      this.tramiteForm.get('modificacionDonacionesImmex.aduana')?.disable();
      this.tramiteForm.get('modificacionDonacionesImmex.pais')?.disable();
      this.tramiteForm.get('modificacionDonacionesImmex.rfc')?.disable();
      this.tramiteForm
        .get('modificacionDonacionesImmex.pnumeroProgramaImmex')
        ?.disable();
      this.tramiteForm
        .get('modificacionDonacionesImmex.correoElectronicoOpcional')
        ?.disable();
      this.tramiteForm
        .get('modificacionDonacionesImmex.telefonoOpcional')
        ?.disable();
      this.tramiteForm.get('modificacionDonacionesImmex.calle')?.disable();
      this.tramiteForm
        .get('modificacionDonacionesImmex.numeroExterior')
        ?.disable();
      this.tramiteForm
        .get('modificacionDonacionesImmex.numeroInterior')
        ?.disable();
      this.tramiteForm
        .get('modificacionDonacionesImmex.correoElectronico')
        ?.disable();
      this.tramiteForm.get('modificacionDonacionesImmex.telefono')?.disable();
      this.tramiteForm.get('modificacionDonacionesImmex.estado')?.disable();
      this.tramiteForm
        .get('modificacionDonacionesImmex.codigoPostal')
        ?.disable();
      this.tramiteForm.get('modificacionDonacionesImmex.colonia')?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.tipoDeMercancia')
        ?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.cantidad')
        ?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.unidadMedida')
        ?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.ano')
        ?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.modelo')
        ?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.marca')
        ?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.serie')
        ?.disable();
      this.agregarMercanciasForm
        .get('modificacionDonacionesImmex.datosMercancia.condicionMercancia')
        ?.disable();
    }
  }

  /**
   * Método para seleccionar las mercancías.
   * @param mercancia Lista de mercancías seleccionadas.
   */
  seleccionarMercancias(mercancia: DatosDelMercancia[]): void {
    this.mercanciaSeleccionados = mercancia;
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  esValido(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }

  /**
   * @description
   * Genera una notificación de éxito cuando los datos se han guardado correctamente.
   * Esta función crea una notificación modal con un mensaje de éxito.
   * @method mostrarNotificacionExito
   * @returns {void} No retorna ningún valor, pero actualiza la propiedad `nuevaNotificacion`
   */
  mostrarNotificacionExito(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: 'Datos guardados correctamente',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Maneja la confirmación del modal de notificación de éxito.
   * @method cerrarNotificacionExito
   * @param _confirmar - Indica si se confirmó o canceló la acción.
   */
  cerrarNotificacionExito(_confirmar: boolean): void {
    this.moduloExitoso = false;
  }

  /**
   * @description
   * Genera una notificación de error cuando no se ha seleccionado ningún registro.
   * Esta función crea una notificación modal con un mensaje informativo.
   * @method mostrarNotificacionSeleccion
   * @returns {void} No retorna ningún valor, pero actualiza la propiedad `nuevaNotificacion`
   */
  mostrarNotificacionSeleccion(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Seleccione un registro',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Maneja la confirmación del modal de notificación.
   * @method cerrarNotificacion
   * @param _confirmar - Indica si se confirmó o canceló la acción.
   */
  cerrarNotificacion(_confirmar: boolean): void {
    this.moduloEmergente = false;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}