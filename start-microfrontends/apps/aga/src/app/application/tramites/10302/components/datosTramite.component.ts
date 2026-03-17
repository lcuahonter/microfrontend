import {
  AlertComponent,
  CatalogoSelectComponent,
  InputCheckComponent,
  REGEX_POSTAL,
  REGEX_TELEFONO_DIGITOS,
  TableBodyData,
  TableComponent,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import {
  Catalogo,
  Solicitud10302State,
  Tramite10302Store,
} from '../estados/tramite10302.store';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelMercancia } from '../models/exencion-impuestos.model';
import { ExencionImpuestosService } from '../services/exencion-impuestos.service';
import { MercanciaTableRow } from '../models/exencion-impuestos.model';
import { Modal } from 'bootstrap';
import { Tramite10302Query } from '../estados/tramite10302.query';
import mercanciaTable from '@libs/shared/theme/assets/json/10302/mercancia-table.json';

/**
 * Componente que representa la funcionalidad de datos del trámite.
 */
@Component({
  selector: 'app-datos-tramite',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TituloComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    InputCheckComponent
  ],
  templateUrl: './datosTramite.component.html',
  styleUrl: './datosTramite.component.scss',
})
export class DatosTramiteComponent implements OnInit, OnDestroy {
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
  public solicitudState!: Solicitud10302State;

  /**
   * Encabezado de la tabla de mercancías.
   */
  public mercanciaHeaderData: string[] = [];

  /**
   * Cuerpo de la tabla de mercancías.
   */
  public mercanciaBodyData: TableBodyData[] = [];

  /**
   * Datos de la tabla de mercancías.
   */
  public getMercanciaTableData: {
    mercanciaTable: {
      tableHeader: string[];
      tableBody: MercanciaTableRow[];
    };
  } = mercanciaTable as any;

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
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param exencionImpuestoService Servicio para manejar la lógica de exención de impuestos.
   * @param store Almacén para manejar el estado del trámite.
   * @param query Consulta para obtener el estado del trámite.
   * @param fb Constructor de formularios reactivos.
   * @param validacionesService Servicio para manejar validaciones de formularios.
   */
  constructor(
    public exencionImpuestoService: ExencionImpuestosService,
    public store: Tramite10302Store,
    private query: Tramite10302Query,
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {}

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
    this.donanteDomicilio();
    this.obtenerMercancia();
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  private inicializaCatalogos(): void {
    const ADUANA$ = this.exencionImpuestoService.getAduana().pipe(
      map((resp) => {
        this.aduana = resp.data;
      })
    );

    const TIPO_DE_MERCANCIA$ = this.exencionImpuestoService
      .getTipoDeMercancia()
      .pipe(
        map((resp) => {
          this.tipoDeMercancia = resp.data;
        })
      );

    const CONDICION_MERCANCIA$ = this.exencionImpuestoService
      .getCondicionMercancia()
      .pipe(
        map((resp) => {
          this.condicionMercancia = resp.data;
        })
      );

    const UNIDAD_MEDIDA$ = this.exencionImpuestoService.getUnidadMedida().pipe(
      map((resp) => {
        this.unidadMedida = resp.data;
      })
    );

    const ANO$ = this.exencionImpuestoService.getAno().pipe(
      map((resp) => {
        this.ano = resp.data;
      })
    );

    const PAIS$ = this.exencionImpuestoService.getPais().pipe(
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
      .subscribe();
  }

  /**
   * Inicializa el formulario de donante y domicilio.
   */
  donanteDomicilio(): void {
    this.tramiteForm = this.fb.group({
      exencionImpuestos: this.fb.group({
        aduana: [this.solicitudState?.aduana, [Validators.required]],
        organismoPublico: [
          this.solicitudState?.organismoPublico,
          Validators.required,
        ],
        usoEspecifico: [
          this.solicitudState?.usoEspecifico,
          [Validators.required, Validators.maxLength(512)],
        ],
        pais: [this.solicitudState?.pais, Validators.required],
        rfc: [this.solicitudState?.rfc, Validators.required],
        numeroProgramaImmex: [
          this.solicitudState?.numeroProgramaImmex,
          Validators.required,
        ],
        razonSocial: [
          { value: this.solicitudState?.razonSocial, disabled: true },
          [Validators.required],
        ],
        correoElectronicoOpcional: [
          this.solicitudState?.correoElectronicoOpcional,
          [Validators.required, Validators.email, Validators.maxLength(50)],
        ],
        telefonoOpcional: [
          this.solicitudState?.telefonoOpcional,
          [Validators.required, Validators.maxLength(30)],
        ],
        calle: [
          { value: this.solicitudState?.calle, disabled: true },
          [Validators.required, Validators.maxLength(80)],
        ],
        numeroExterior: [
          { value: this.solicitudState?.numeroExterior, disabled: true },
          [Validators.required, Validators.maxLength(40)],
        ],
        numeroInterior: [
          { value: this.solicitudState?.numeroInterior, disabled: true },
          [Validators.maxLength(30)],
        ],
        telefono: [
          { value: this.solicitudState?.telefono, disabled: true },
          [Validators.required, Validators.pattern(REGEX_TELEFONO_DIGITOS)],
        ],
        correoElectronico: [
          { value: this.solicitudState?.correoElectronico, disabled: true },
          [Validators.required, Validators.email, Validators.maxLength(50)],
        ],
        codigoPostal: [
          { value: this.solicitudState?.codigoPostal, disabled: true },
          [
            Validators.required,
            Validators.pattern(REGEX_POSTAL),
            Validators.maxLength(8),
          ],
        ],
        estado: [
          { value: this.solicitudState?.estado, disabled: true },
          [Validators.required, Validators.maxLength(80)],
        ],
        colonia: [
          { value: this.solicitudState?.colonia, disabled: true },
          [Validators.required, Validators.maxLength(50)],
        ],
      }),
    });

    this.agregarMercanciasForm = this.fb.group({
      datosMercancia: this.fb.group({
        tipoDeMercancia: [
          this.solicitudState?.tipoDeMercancia,
          Validators.required,
        ],
        condicionMercancia: [
          this.solicitudState?.condicionMercancia,
          Validators.required,
        ],
        unidadMedida: [this.solicitudState?.unidadMedida, Validators.required],
        ano: [this.solicitudState?.ano, Validators.required],
        cantidad: [this.solicitudState?.cantidad, Validators.required],
        marca: [this.solicitudState?.marca],
        modelo: [this.solicitudState?.modelo],
        serie: [this.solicitudState?.serie]
      }),
    });
    this.inicializarEstadoFormulario();
  }

  /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.tramiteForm?.disable();
    } else {
      this.tramiteForm?.enable();
      const CAMPOS_DESHABILITADOS = [
        'razonSocial',
        'calle',
        'numeroExterior',
        'numeroInterior',
        'telefono',
        'correoElectronico',
        'codigoPostal',
        'estado',
        'colonia'
      ];
      const GRUPO = this.tramiteForm.get('exencionImpuestos');
      CAMPOS_DESHABILITADOS.forEach(campo => GRUPO?.get(campo)?.disable());
    }
  }

  /**
   * Obtiene el grupo de formulario de exención de impuestos.
   */
  get exencionImpuestos(): FormGroup {
    return this.tramiteForm.get('exencionImpuestos') as FormGroup;
  }

  /**
   * Obtiene el grupo de formulario de datos de mercancía.
   */
  get datosMercancia(): FormGroup {
    return this.tramiteForm.get('datosMercancia') as FormGroup;
  }

  /**
   * Maneja la selección de aduana.
   */
  aduanaSeleccion(): void {
    const ADUANA = this.tramiteForm.get('exencionImpuestos.aduana')?.value;
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
    const PAIS = this.tramiteForm.get('exencionImpuestos.pais')?.value;
    this.store.setPais(PAIS);
  }

  /**
   * Actualiza el indicador de aviso de funcionamiento en el Store.
   * @param evento - Evento que contiene el valor del indicador.
   */
  organismoPublico(): void {
    const ORGANISMOPUBLICO = this.tramiteForm.get('exencionImpuestos.organismoPublico')?.value;
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
    metodoNombre: keyof Tramite10302Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Abre el modal para agregar mercancías.
   */
  abrirDialogoMercancias(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
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
   * Agrega mercancías al formulario y cierra el modal.
   */
  agregarMercancias(): void {
    if (!this.agregarMercanciasForm.valid) {
      this.agregarMercanciasForm.markAllAsTouched();
    } else {
      this.exencionImpuestoService
        .agregarMercancias()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((respuesta) => {
          if (respuesta?.success) {
            respuesta.datos.id = this.datosDelMercancia.length + 1;
            this.datosDelMercancia.push(respuesta.datos);
            (
              this.store.setDelMercancia as (valor: DatosDelMercancia[]) => void
            )(this.datosDelMercancia);
            const DATOS = {
              tbodyData: [
                respuesta.datos.tipoDeMercancia,
                respuesta.datos.cantidad.toString(),
                respuesta.datos.unidadMedida,
                respuesta.datos.ano.toString(),
                respuesta.datos.modelo,
                respuesta.datos.marca,
                respuesta.datos.serie,
                respuesta.datos.condicionMercancia,
              ],
            };
            if (!Array.isArray(this.getMercanciaTableData.mercanciaTable.tableBody)) {
              this.getMercanciaTableData.mercanciaTable.tableBody = [];
            }
            this.getMercanciaTableData.mercanciaTable.tableBody.push(DATOS);
            this.mercanciaBodyData = [...this.getMercanciaTableData.mercanciaTable.tableBody];
          }
          this.agregarMercanciasForm.reset();
          this.agregarMercanciasForm.markAsUntouched();
          this.agregarMercanciasForm.markAsPristine();
          this.cerrarModal();
        });
    }
  }

  /**
   * Limpia los datos de mercancías.
   */
  // eslint-disable-next-line class-methods-use-this
  limpiarMercancias(): void {
    // Implementar la lógica para limpiar las mercancías.
  }

  /**
   * Abre el modal de confirmación si el formulario es válido.
   */
  agregarConfirmarModal(): void {
    if (this.agregarMercanciasForm.valid === true) {
      if (this.confirmarModalElement) {
        const MODAL_INSTANCE = new Modal(
          this.confirmarModalElement.nativeElement
        );
        this.cerrarModal();
        MODAL_INSTANCE.show();
      }
    } else {
      this.agregarMercanciasForm.markAllAsTouched();
    }
  }

  /**
   * Obtiene los datos de mercancías.
   */
  public obtenerMercancia(): void {
    this.mercanciaHeaderData =
      this.getMercanciaTableData?.mercanciaTable?.tableHeader;
    this.mercanciaBodyData =
      this.getMercanciaTableData?.mercanciaTable?.tableBody;
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
