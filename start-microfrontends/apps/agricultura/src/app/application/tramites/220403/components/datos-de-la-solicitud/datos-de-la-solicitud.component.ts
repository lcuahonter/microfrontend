/**
 * Componente para gestionar los datos de la solicitud en el trámite.
 */
import {
  AlertComponent,
  CatalogosService,
  ConfiguracionColumna,
  ConsultaioQuery,
  ConsultaioState,
  FormularioDinamico,
  InputConfig,
  InputFechaComponent,
  InputTypes,
  LabelValueDatos,
  MenuConfig,
  Props,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  CatalogoSelectComponent,
  InputRadioComponent,
} from '@libs/shared/data-access-user/src';
import {
  ColumnasTabla,
  CombinacionRequerida,
  ConsultarEmpresaProductora,
  DatosRealizar,
  FilaSolicitud,
  FilaSolicitudRespuesta,
  FormularioGrupo,
} from '../../models/acuicola.module';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DATOS_COMBINACION_REQUERIDA,
  DATOS_TRAMITE_REALIZAR,
} from '../../constants/input-datos-config';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExportaccionAcuicolaService } from '../../services/exportaccion-acuicola.service';
import { MENSAJE_DOBLE_CLIC } from '../../constants/acuicola.module';
import { Modal } from 'bootstrap';
import { Tramite220403Query } from '../../estados/tramite220403.query';
import { Tramite220403Store } from '../../estados/tramite220403.store';

@Component({
  selector: 'app-datos-de-la-solicitud',
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * @input
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario debe estar deshabilitado. Cuando es `true`, los controles del formulario estarán inactivos y no permitirán la edición por parte del usuario.
   * @type {boolean}
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @descripcion
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los controles del formulario estarán deshabilitados.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @private
   * @description
   * Notificador para la destrucción del componente y la cancelación de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {DatosRealizar} datosRealizar
   * @description
   * Datos del trámite a realizar.
   */
  datosRealizar!: DatosRealizar;

  /**
   * @property {CombinacionRequerida} combinacionRequerida
   * @description Propiedad que representa la combinación requerida para el trámite.
   * @memberof DatosDeLaSolicitudComponent
   * @compodoc
   */
  combinacionRequerida!: CombinacionRequerida;

  /**
   * @property {boolean} colapsable
   * @description Indica si la sección es colapsable.
   * @type {boolean}
   */
  colapsable: boolean = true;

  /**
   * @property {string} alertMessage
   * @description Mensaje que se muestra en una alerta al hacer doble clic.
   * @type {string}
   */
  alertMessage: string = MENSAJE_DOBLE_CLIC;

  /**
   * @property {LabelValueDatos[]}
   * @description Tipo de selección para la tabla de solicitudes.
   * @type {TablaSeleccion}
   */
  tipoSeleccionsoli: TablaSeleccion = TablaSeleccion.UNDEFINED;

  /**
   * @property {ConfiguracionColumna<FilaSolicitud>[]}
   * @description
   * Configuración de columnas para la tabla de solicitudes.
   * @type {ConfiguracionColumna<FilaSolicitud>[]}
   */
  configuracionColumnasoli: ConfiguracionColumna<FilaSolicitud>[] = [
    {
      encabezado: 'Fecha Creación',
      clave: (fila) => fila.fechaCreacion,
      orden: 1,
    },
    { encabezado: 'Mercancía', clave: (fila) => fila.mercancia, orden: 2 },
    {
      encabezado: 'Cantidad',
      clave: (fila) => fila.cantidad.toString(),
      orden: 3,
    },
    { encabezado: 'Proovedor', clave: (fila) => fila.proveedor, orden: 4 },
  ];

  /**
   * Configuración de los inputs del formulario.
   */
  configuracion: InputConfig[] = [
    {
      title: 'Datos del trámite a realizar',
      formGroupName: 'datosRealizar',
      menu: [
        {
          inputType: InputTypes.RADIO,
          props: DATOS_TRAMITE_REALIZAR[0] as unknown as Props,
          class: 'col-md-8',
        },
        {
          inputType: InputTypes.BREAK_CONTENT,
          props: [] as unknown as Props,
          class: '',
        },
        {
          inputType: InputTypes.SELECT,
          props: DATOS_TRAMITE_REALIZAR[1] as unknown as Props,
          class: 'col-md-8',
        },
        {
          inputType: InputTypes.BREAK_CONTENT,
          props: [] as unknown as Props,
          class: '',
        },
        {
          inputType: InputTypes.TEXT,
          props: DATOS_TRAMITE_REALIZAR[2] as unknown as Props,
          class: 'col-md-8',
        },
        {
          inputType: InputTypes.BREAK_CONTENT,
          props: [] as unknown as Props,
          class: '',
        },
        {
          inputType: InputTypes.SELECT,
          props: DATOS_TRAMITE_REALIZAR[3] as unknown as Props,
          class: 'col-md-8',
        },
        {
          inputType: InputTypes.SELECT,
          props: DATOS_TRAMITE_REALIZAR[4] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.SELECT,
          props: DATOS_TRAMITE_REALIZAR[5] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.BREAK_CONTENT,
          props: [] as unknown as Props,
          class: '',
        },
        {
          inputType: InputTypes.TEXT,
          props: DATOS_TRAMITE_REALIZAR[6] as unknown as Props,
          class: 'col-md-8',
        }
      ],
    },
    {
      title: 'Combinación requerida',
      formGroupName: 'combinacionRequerida',
      menu: [
        {
          inputType: InputTypes.SELECT,
          props: DATOS_COMBINACION_REQUERIDA[0] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.SELECT,
          props: DATOS_COMBINACION_REQUERIDA[1] as unknown as Props,
          class: 'col-md-4',
        },
        {
          inputType: InputTypes.BREAK_CONTENT,
          props: [] as unknown as Props,
          class: '',
        },
        {
          inputType: InputTypes.SELECT,
          props: DATOS_COMBINACION_REQUERIDA[2] as unknown as Props,
          class: 'col-md-10',
        },
        {
          inputType: InputTypes.BUTTON,
          props: DATOS_COMBINACION_REQUERIDA[3] as unknown as Props,
          class: 'col-md-2',
        },
      ],
    },
  ];
  tableData: {
    headers: {
      encabezado: string;
      clave: (ele: ColumnasTabla) => string;
      orden: number;
    }[];
    data: ColumnasTabla[];
  } = {
    headers: [
      {
        encabezado: 'No.partida',
        clave: (ele: ColumnasTabla) => ele.noPartida,
        orden: 1,
      },
      {
        encabezado: 'Fracción arancelaria',
        clave: (ele: ColumnasTabla) => ele.fraccionArancelaria,
        orden: 2,
      },
      {
        encabezado: 'Descripción de la fracción',
        clave: (ele: ColumnasTabla) => ele.descripcionFrccion,
        orden: 3,
      },
      {
        encabezado: 'Descripción',
        clave: (ele: ColumnasTabla) => ele.descripcion,
        orden: 4,
      },
      {
        encabezado: 'Unidad de medida de tarifa (UMT)',
        clave: (ele: ColumnasTabla) => ele.undidadUmt,
        orden: 5,
      },
      {
        encabezado: 'Cantidad UMT',
        clave: (ele: ColumnasTabla) => ele.cantidadUmt,
        orden: 5,
      },
      {
        encabezado: 'Unidad de medida de comercialización (UMC)',
        clave: (ele: ColumnasTabla) => ele.unidadUmc,
        orden: 5,
      },
      {
        encabezado: 'Cantidad UMC',
        clave: (ele: ColumnasTabla) => ele.cantidadUmc,
        orden: 5,
      },
      {
        encabezado: 'Tipo de mercancía',
        clave: (ele: ColumnasTabla) => ele.tipoMercancia,
        orden: 5,
      },
      {
        encabezado: 'Uso',
        clave: (ele: ColumnasTabla) => ele.uso,
        orden: 5,
      },
      {
        encabezado: 'Nombre científíco',
        clave: (ele: ColumnasTabla) => ele.nombreCientifico,
        orden: 5,
      },
      {
        encabezado: 'Nombre común',
        clave: (ele: ColumnasTabla) => ele.nombreComun,
        orden: 5,
      },
      {
        encabezado: 'Fase de desarrollo',
        clave: (ele: ColumnasTabla) => ele.faseDesarrollo,
        orden: 5,
      },
      {
        encabezado: 'Presentacíon',
        clave: (ele: ColumnasTabla) => ele.presentacion,
        orden: 5,
      },
      {
        encabezado: 'País de procedencia',
        clave: (ele: ColumnasTabla) => ele.paisProcedencia,
        orden: 5,
      },
    ],
    data: [],
  };
  /**
   * Almacena la configuración de la tabla de selección utilizada en el formulario.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Arreglo que almacena la configuración del formulario dinámico fiscal.
   */
  fiscal: FormularioDinamico[] = [];

  /**
   * Representa el formulario principal del componente.
   */
  formulario!: FormGroup;

  /**
   * @property {FormGroup} consultarEmpresaProductoraForm
   * @description
   * Formulario reactivo utilizado para consultar los datos de la empresa productora en el trámite.
   */
  consultarEmpresaProductoraForm!: FormGroup;

  /**
   * Objeto utilizado para almacenar eventos dentro del componente.
   */
  evento = {};

  /**
   * Enum que contiene los diferentes tipos de inputs disponibles en el formulario.
   */
  inputTypes = InputTypes;

  /**
   * @private
   * @property {SeccionLibState} seccionState
   * @description Estado de la sección utilizado para manejar el estado interno del componente.
   * @see SeccionLibState
   */
  public seccionState!: SeccionLibState;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Almacena los datos de la solicitud.
   * @type {FilaSolicitud[]}
   */
  solicitudDatos: FilaSolicitud[] = [];

  /**
   * Referencia al elemento del modal.
   */
  @ViewChild('modalAgregarImportador') modalElement!: ElementRef;

  /**
   * Referencia al botón de cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Constructor del componente DatosDeLaSolicitudComponent.
   * Inicializa los servicios y dependencias necesarias para el funcionamiento del componente.
   *
   * @param fb - Servicio FormBuilder para la creación y gestión de formularios reactivos.
   * @param catalogosServicios - Servicio para la obtención de catálogos.
   * @param exportaccionAcuicolaServcios - Servicio específico para operaciones de exportación acuícola.
   * @param tramite220403Query - Query para la gestión del estado del trámite 220403.
   * @param tramite220403store - Store para la gestión del estado del trámite 220403.
   * @param seccionStore - Store para la gestión del estado de la sección.
   * @param seccionQuery - Query para la gestión del estado de la sección.
   * @param {ConsultaioQuery} consultaQuery - Query para consultar el estado de la consulta actual.
   */
  constructor(
    private fb: FormBuilder,
    private catalogosServicios: CatalogosService,
    private exportaccionAcuicolaServcios: ExportaccionAcuicolaService,
    private tramite220403Query: Tramite220403Query,
    private tramite220403store: Tramite220403Store,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private consultaQuery: ConsultaioQuery
  ) {
    this.obtenerSolicitudDatos();
    this.crearFormulario();
    this.configuracion.forEach(
      (eachConfig: InputConfig, groupIndex: number) => {
        this.inicializarFormGroup(
          eachConfig.menu,
          eachConfig.formGroupName,
          groupIndex
        );
      }
    );
  }

  /**
   * @method ngOnDestroy
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se inicializan las suscripciones a los estados y se configuran los valores iniciales del formulario.
   * @memberof DatosDeLaSolicitudComponent
   */
  ngOnInit(): void {
    this.configuracion.forEach(
      (eachConfig: InputConfig, groupIndex: number) => {
        this.inicializarFormGroup(
          eachConfig.menu,
          eachConfig.formGroupName,
          groupIndex
        );
      }
    );
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();

    this.tramite220403Query.setDatosRealizar$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.formulario.get('datosRealizar')?.patchValue(state);
        })
      )
      .subscribe();

    this.tramite220403Query.setCombinacionRequerida$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.formulario.get('combinacionRequerida')?.patchValue(state);
        })
      )
      .subscribe();
    this.formulario.statusChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(() => {
        this.tramite220403store.setDatosRealizar(
          this.formulario.get('datosRealizar')?.value
        );
        this.tramite220403store.setCombinacionRequerida(
          this.formulario.get('combinacionRequerida')?.value
        );
        if (
          this.formulario.get('datosRealizar')?.valid &&
          this.formulario.get('combinacionRequerida')?.valid
        ) {
          const VALIDA = this.formulario.get('datosRealizar')?.valid
            ? true
            : false;
          this.tramite220403store.setDatosRealizarValidada(VALIDA);
          this.tramite220403store.setCombinacionRequeridaValidada(VALIDA);
        }
      });

    if (this.formularioDeshabilitado) {
      this.esFormularioSoloLectura = true;
      this.inicializarEstadoFormulario();
    }
  }

  /**
   * Inicializa el estado del formulario según si está en modo solo lectura o editable.
   * Si el formulario está en modo solo lectura, deshabilita todos los controles.
   * Si no, habilita los controles para permitir la edición.
   *
   * @method inicializarEstadoFormulario
   * @memberof CertificadoOrigenComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
    } else {
      this.formulario.enable();
    }
  }

  /**
   * @method crearFormulario
   * @description
   * Crea el formulario principal e inicializa los subgrupos.
   */
  crearFormulario(): void {
    this.formulario = this.fb.group({
      datosRealizar: this.fb.group({}),
      combinacionRequerida: this.fb.group({}),
    });
    this.consultarEmpresaProductoraForm = this.fb.group({
      razonSocial: [{ value: '', disabled: true }],
      codigoPostal: [{ value: '', disabled: true }, Validators.required],
      pais: [{ value: '', disabled: true }, Validators.required],
      estado: [{ value: '', disabled: true }],
      calle: [{ value: '', disabled: true }, Validators.required],
      numeroExterior: [{ value: '', disabled: true }, Validators.required],
      numeroInterior: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      correoElectronico: [{ value: '', disabled: true }]
    });
  }

  /**
   * @method inicializarFormGroup
   * Inicializa un grupo de formularios con controles basados en la configuración proporcionada.
   * @param configuracion - La configuración para los controles del formulario.
   * @param nombreGrupo - El nombre del grupo de formularios.
   * @param indiceGrupo - El índice del grupo en la matriz de configuración.
   */
  inicializarFormGroup(
    configuracion: MenuConfig[],
    nombreGrupo: string,
    indiceGrupo: number
  ): void {
    const GRUPO = this.formulario.get(nombreGrupo) as FormGroup;
    configuracion.forEach((campo: MenuConfig, menuIndex: number) => {
      if (
        campo.inputType !== InputTypes.BREAK_CONTENT &&
        campo.inputType !== InputTypes.BUTTON
      ) {
        const VALIDATORS = campo.props.validators
          ? DatosDeLaSolicitudComponent.getValidators(campo.props.validators)
          : [];
        const CONTROL_NAME = campo.props.campo;
        GRUPO.addControl(
          CONTROL_NAME,
          this.fb.control(
            { value: campo?.value || '', disabled: campo.props.disabled },
            VALIDATORS
          )
        );
        if (campo.inputType === InputTypes.SELECT) {
          this.obtenerValoresCatalogo(indiceGrupo, menuIndex, CONTROL_NAME);
        }
        if (campo.inputType === InputTypes.RADIO) {
          this.getRadioData(campo.props.jsonDataFileName, (data) => {
            this.configuracion[0].menu[0].props.radioOptions = data;
            this.configuracion[0].menu[0].props.radioSelectedValue =
              data[0].value;
          });
        }
      }
    });
  }

  /**
   * @method getRadioData
   * Obtenga las opciones de entrada de radio del servicio
   * @param fileName - Este es el nombre del archivo json que necesitamos para las opciones
   * @param callback - Función de devolución de llamada donde se establece la opción en el menú
   */
  getRadioData(
    fileName: string,
    callback: (data: LabelValueDatos[]) => void
  ): void {
    this.exportaccionAcuicolaServcios.getDatos(fileName).subscribe((data) => {
      callback(data);
    });
  }

  /**
   * @method obtenerValoresCatalogo
   * Obtiene los valores del catálogo y actualiza la configuración.
   * @param indiceGrupo - El índice del grupo en la matriz de configuración.
   * @param indiceMenu - El índice del menú en el grupo.
   * @param clave - La clave para obtener los valores del catálogo.
   */
  obtenerValoresCatalogo(
    indiceGrupo: number,
    indiceMenu: number,
    clave: string
  ): void {
    this.exportaccionAcuicolaServcios
      .obtenerMenuDesplegable(clave)
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((resp) => {
          if (resp.length > 0) {
            this.configuracion[indiceGrupo].menu[indiceMenu].props.catalogos =
              resp;
          }
        })
      )
      .subscribe();
  }

  /**
   * Genera una matriz de validadores de formularios basada en los patrones proporcionados.
   * @param validadores - Una matriz de patrones regex que se utilizarán para la validación.
   * @returns Una matriz de validadores de formularios.
   */
  static getValidators(validadores: string[]): ValidatorFn[] {
    const FORM_VALIDATORS: ValidatorFn[] = [];
    validadores.forEach((validadore) => {
      if (validadore === 'required') {
        FORM_VALIDATORS.push(Validators.required);
      } else if (validadore.includes('maxLength')) {
        const MAX = validadore.split(':')[1];
        FORM_VALIDATORS.push(Validators.maxLength(Number(MAX)));
      } else if (validadore.includes('pattern')) {
        const PATTERN = validadore.split(':')[1];
        FORM_VALIDATORS.push(Validators.pattern(PATTERN));
      }
    });
    return FORM_VALIDATORS;
  }

  /**
   * @method fechaCambiado
   * Maneja el evento de cambio para la entrada de fecha.
   * @param evento - El nuevo valor de la fecha como cadena.
   */
  fechaCambiado(evento: string): void {
    // Manejar cambio de fecha
    this.evento = evento;
  }

  /**
   * @method seleccionCatalogo
   * Maneja el evento de selección para un catálogo.
   * @param nombreControlFormulario - El nombre del control del formulario a actualizar.
   * @param evento - El valor seleccionado del catálogo.
   */
  seleccionCatalogo(nombreControlFormulario: string, evento: Event): void {
    this.formulario.get(nombreControlFormulario)?.setValue(evento);
  }

  /**
   * @method cambioValorRadio
   * Maneja el evento de cambio para una entrada de radio.
   * @param claveRadio - La clave de la entrada de radio.
   * @param evento - El nuevo valor de la entrada de radio.
   */
  cambioValorRadio(
    claveRadio: string,
    groupIndex: number,
    menuIndex: number,
    evento: string | number
  ): void {
    this.configuracion[groupIndex].menu[menuIndex].props.radioSelectedValue =
      evento;
  }

  /**
   * @method ngOnDestroy
   * @inheritdoc
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera recursos y cancela suscripciones para evitar fugas de memoria.
   * @memberof DatosDeLaSolicitudComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * @method mostrar_colapsable
   * @description
   * Muestra o esconde la sección colapsable.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Método para obtener los datos de la solicitud y almacenarlos en `solicitudDatos`.
   * @returns {void}
   */
  obtenerSolicitudDatos(): void {
    this.exportaccionAcuicolaServcios
      .obtenerSolicitudDatos()
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((resultado: FilaSolicitudRespuesta) => {
          this.solicitudDatos = resultado.data;
        })
      )
      .subscribe();
  }

  /**
   *
   * @param event Evento que se dispara al seleccionar una fila en la tabla.
   * @description
   * Maneja la selección de una fila en la tabla y obtiene el certificado de exportación correspondiente.
   * @returns {void}
   */
  filaSeleccionada(): void {
    this.exportaccionAcuicolaServcios
      .certificadoExportacion()
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((certificado: FormularioGrupo) => {
          this.formulario
            .get('datosRealizar')
            ?.patchValue(certificado.datosRealizar);
          this.formulario
            .get('combinacionRequerida')
            ?.patchValue(certificado.combinacionRequerida);
          this.tableData.data = certificado.mercanciasTablaDatos || [];
          this.tramite220403store.setDatosRealizar(certificado.datosRealizar);
          this.tramite220403store.setCombinacionRequerida(
            certificado.combinacionRequerida
          );
          this.tramite220403store.setTransporte(certificado.transporte);
          this.tramite220403store.setPagoDerechos(certificado.pagoDerechos);
          this.tramite220403store.setMercanciasTablaDatos(
            certificado.mercanciasTablaDatos || []
          );
          this.tramite220403store.setImportadorDatos(
            certificado.importadorDatos || []
          );
        })
      )
      .subscribe();
  }

  /**
   * Abre el diálogo para consultar los datos de la empresa.
   * @returns {void}
   */
  abrirDialogoConsultar(): void {
    this.exportaccionAcuicolaServcios.obtenerConsultarEmpresaDatos()
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((resultado: ConsultarEmpresaProductora) => {
        this.consultarEmpresaProductoraForm.patchValue({
          razonSocial: resultado.razonSocial || '',
          codigoPostal: resultado.codigoPostal || '',
          pais: resultado.pais || '',
          estado: resultado.estado || '',
          calle: resultado.calle || '',
          numeroExterior: resultado.numeroExterior || '',
          numeroInterior: resultado.numeroInterior || '',
          telefono: resultado.telefono || '',
          correoElectronico: resultado.correoElectronico || ''
        })
      })
    )
    .subscribe();
    
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }
}