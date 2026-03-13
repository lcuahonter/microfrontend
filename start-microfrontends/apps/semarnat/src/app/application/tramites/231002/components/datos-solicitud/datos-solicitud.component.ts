import {
  AvisoOpcionesDeRadio,
  ResiduoPeligroso,
} from '../../models/aviso-catalogo.model';
import {
  Catalogo,
  CatalogoSelectComponent,
  InputRadioComponent,
  REGEX_POSTAL,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  CatalogoT231002Service,
  Domicilio,
} from '../../services/catalogo-t231002.service';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState, LoginQuery } from '@ng-mf/data-access-user';
import {
  ES_CONTROL_INVALIDO,
  HABILITAR_CONTROL,
} from '../../../../shared/helpers';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  RadioOpcion,
  SolicitudJson,
} from '@libs/shared/data-access-user/src/core/models/231002/solicitud.model';
import { Subject, map, takeUntil } from 'rxjs';
import { CONFIG_TABLA_RESIDUOS } from '../../models/datos-residuos.model';

import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { DatoSolicitudQuery } from '../../estados/queries/dato-solicitud.query';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { DatosResiduosPeligrososComponent } from '../datos-residuos-peligrosos/datos-residuos-peligrosos.component';

import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { ImmexResponse } from '../../../231001/models/catalogo-response';
import { MercanciasDesmontadasOSinMontarService } from '../../services/mercancias-desmontadas-o-sin-montar.service';
import { Modal } from 'bootstrap';
import { TEXTOS } from '../../constantes/aviso-retorno.enum';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';
import rawData from '@libs/shared/theme/assets/json/231002/solicitud.json';

/**
 * Constante que contiene las opciones de radio y demás datos del archivo JSON.
 */
const RADIO_OPCIONES = rawData as SolicitudJson;

/**
 * Componente que gestiona los datos de la solicitud para el proceso de reciclaje.
 *
 * Maneja múltiples formularios para capturar información sobre:
 * - Solicitud principal
 * - Empresa recicladora
 * - Lugar de reciclaje
 * - Empresa transportista
 * - Precauciones de manejo
 *
 * Integra con estado global mediante stores y queries para persistencia de datos.
 */
@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    InputRadioComponent,
    DatosResiduosPeligrososComponent,
  ],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
export class DatosSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario actual es válido.
   */
  esControlInvalido = ES_CONTROL_INVALIDO;

  /** Indica si el formulario es válido */
  @Input() esFormValido!: boolean;

  /** Referencia al elemento modal para agregar mercancías */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /** Formulario principal de la solicitud */
  solicitudForm!: FormGroup;

  /** Formulario para datos de empresa recicladora */
  formularioEmpresaReciclaje!: FormGroup;

  /** Formulario para datos del lugar de reciclaje */
  formularioLugarReciclaje!: FormGroup;

  /** Formulario para datos de empresa transportista */
  formularioEmpresaTransportista!: FormGroup;

  /** Formulario para precauciones de manejo */
  formularioPrecaucionesManejo!: FormGroup;

  formularioDatosDestinatario!: FormGroup;

  /** Opciones de radio obtenidas del JSON estático */
  radioOptions: RadioOpcion[] = RADIO_OPCIONES?.radioOptions;

  /** Subject para gestionar la destrucción de suscripciones */
  private destroyed$ = new Subject<void>();

  /** Opciones de radio para avisos dinámicos */
  avisoOpcionesDeRadio: AvisoOpcionesDeRadio = {} as AvisoOpcionesDeRadio;

  /** Tipo de aviso actualmente seleccionado */
  tipoAviso: string | number = 'por defecto';

  /** Textos estáticos para la interfaz de usuario */
  TEXTOS = TEXTOS;

  /** Etiquetas y configuraciones de formulario desde JSON */
  etiquetasForm = RADIO_OPCIONES;

  /** Estado actual de la consulta (lectura/edición) */
  public consultaState!: ConsultaioState;

  /** Bandera que indica si el formulario es de solo lectura */
  public esFormularioSoloLectura: boolean = false;

  /** Configuración de columnas para la tabla dinámica */
  configuracionTabla: ConfiguracionColumna<ResiduoPeligroso>[] =
    CONFIG_TABLA_RESIDUOS;

  /** Datos para la tabla dinámica */
  datosTabla: ResiduoPeligroso[] = [];

  /** Enum de tipos de selección de tabla para uso en template */
  TablaSeleccion = TablaSeleccion;

  /** Lista de índices de filas seleccionadas en la tabla */
  filasSeleccionadas: Set<number> = new Set();

  /** catalogo immex para llenar el combo */
  immexCatalogo: Catalogo[] = [];

  /** Catálogo de direcciones asociadas a IMMEX */
  direccionesCatalogo: Catalogo[] = [];

  /** Catálogo de aduanas de salida */
  aduanasSalida: Catalogo[] = [];

  /** Cátalogo de pases de salida */
  paisesSalidaCatalogo: Catalogo[] = [];

  /** Getter para verificar si hay filas seleccionadas */
  get hayFilasSeleccionadas(): boolean {
    return this.filasSeleccionadas.size > 0;
  }

  /**
   * Rfc de la persona que inició sesión
   */
  rfcLogueado: string = '';

  /**
   * Constructor para inyección de dependencias.
   *
   * @param fb - FormBuilder para construir formularios reactivos.
   * @param datoSolicitudStore - Store para persistir cambios locales del formulario.
   * @param datoSolicitudQuery - Query para leer el estado actual del store.
   * @param consultaQuery - Query que provee el estado de solo lectura/edición de la aplicación.
   * @param mercanciasDesmontadasOSinMontarService - Servicio que provee opciones de radio y catálogos.
   *
   * El constructor además inicializa la carga de opciones de radio llamando a obtenerAvisoOpcionesDeRadio().
   */
  constructor(
    public fb: FormBuilder,
    private datoSolicitudStore: DatoSolicitudStore,
    private datoSolicitudQuery: DatoSolicitudQuery,
    private consultaQuery: ConsultaioQuery,
    public mercanciasDesmontadasOSinMontarService: MercanciasDesmontadasOSinMontarService,
    private catalogosService: CatalogoT231002Service,
    private loginQuery: LoginQuery
  ) {
    this.obtenerAvisoOpcionesDeRadio();
  }

  /**
   * Inicialización del componente:
   * - Crea formularios
   * - Recupera estado guardado
   * - Configura suscripción para estado de solo lectura
   */
  ngOnInit(): void {
    this.inicializarSolicitudForm();
    this.inicializarFormularioEmpresaReciclaje();
    this.inicializarFormularioLugarReciclaje();
    this.inicializarFormularioEmpresaTransportista();
    this.inicializarFormularioPrecaucionesManejo();
    this.recuperarValoresDesdeStore();
    this.configurarSuscripcionEstadoConsulta();
    this.obtenerAduanasSalida();
    this.obtenerPaisesSalida();
    this.validaEsFormularioValido();
    this.validaCamposEmpresaReciclaje();
    this.obtenerDatosRfc();
  }

  /**
   * Valida si el formulario es válido y marca los campos como tocados si no lo es.
   */
  validaEsFormularioValido(): void {
    if (!this.esFormValido) {
      this.marcarCamposComoTocados();
    }
  }


  /**
   * Obtiene los datos IMMEX del solicitante.
   */
  obtenerDatosRfc(): void {
    this.loginQuery.selectRfc$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.rfcLogueado = res;
        this.obtenerDatosImmex();
      });
  }


  /**
   * Configura la suscripción al estado de consulta para controlar modo lectura/edición
   */
  private configurarSuscripcionEstadoConsulta(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = seccionState.readonly;
          this.actualizarEstadoFormularios();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario principal de solicitud con validadores
   */
  private inicializarSolicitudForm(): void {
    this.solicitudForm = this.fb.group({
      ideGenerica1: ['primera_vez', Validators.required],
      numeroRegistroAmbiental: ['', Validators.required],
      descripcionGenerica1: ['', Validators.required],
      numeroProgramaImmex: ['', Validators.required],
      domicilio: [''],
    });
  }

  /**
   * Valida todos los formularios y la existencia de al menos una fila en la tabla.
   * Marca los campos como tocados si la validación falla.
   *
   * @returns true si todos los formularios son válidos y existen datos en la tabla; false en caso contrario.
   */
  validarFormulario(): boolean {
    const IS_VALID =
      this.solicitudForm.valid &&
      this.formularioEmpresaReciclaje.valid &&
      this.formularioLugarReciclaje.valid &&
      this.formularioEmpresaTransportista.valid &&
      this.formularioPrecaucionesManejo.valid &&
      this.datosTabla.length > 0;

    if (!IS_VALID) {
      this.marcarCamposComoTocados();
    }

    return IS_VALID;
  }

  /**
   * Marca todos los campos relevantes como "touched" para forzar la aparición
   * de mensajes de validación en la UI.
   *
   * Se usa cuando la validación global falla para que el usuario identifique
   * los campos que requieren atención.
   */
  marcarCamposComoTocados(): void {
    this.solicitudForm.markAllAsTouched();
    this.formularioEmpresaReciclaje.markAllAsTouched();
    this.formularioLugarReciclaje.markAllAsTouched();
    this.formularioEmpresaTransportista.markAllAsTouched();
    this.formularioPrecaucionesManejo.markAllAsTouched();
  }

  /**
   * Inicializa el formulario de empresa recicladora con validadores
   */
  private inicializarFormularioEmpresaReciclaje(): void {
    this.formularioEmpresaReciclaje = this.fb.group({
      requiereEmpresa: ['', Validators.required],
      nombreEmpresa: ['', Validators.required],
      representanteLegal: ['', Validators.required],
      telefono: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Inicializa el formulario de lugar de reciclaje con validadores
   */
  private inicializarFormularioLugarReciclaje(): void {
    this.formularioLugarReciclaje = this.fb.group({
      razonSocial: ['', Validators.required],
      pais: ['', Validators.required],
      destinoDomicilio: ['', Validators.required],
      codigoPostal: [
        '',
        [
          Validators.required,
          Validators.pattern(REGEX_POSTAL),
          Validators.maxLength(8),
        ],
      ],
    });
  }

  /**
   * Inicializa el formulario de empresa transportista con validadores
   */
  private inicializarFormularioEmpresaTransportista(): void {
    this.formularioEmpresaTransportista = this.fb.group({
      nombreEmpresaTransportistaResiduos: ['', Validators.required],
      numeroAutorizacionSemarnat: ['', Validators.required],
    });
  }

  /**
   * Inicializa el formulario de precauciones de manejo con validadores
   */
  private inicializarFormularioPrecaucionesManejo(): void {
    this.formularioPrecaucionesManejo = this.fb.group({
      clave: ['', Validators.required],
      precaucionesManejo: ['', Validators.required],
    });
  }

  /**
   * Maneja cambios en el campo "requiereEmpresa" para habilitar/deshabilitar campos relacionados
   * @param valor Valor seleccionado ('Si' o 'No')
   */
  onRequiereEmpresaChange(): void {
    this.validaCamposEmpresaReciclaje();
  }

  /**
   * Recupera valores guardados en el store y los aplica a los formularios
   */
  private recuperarValoresDesdeStore(): void {
    const ESTADO = this.datoSolicitudQuery.getValue();
    this.datosTabla = ESTADO.residuos ? [...ESTADO.residuos] : [];
    this.solicitudForm.patchValue(ESTADO.solicitudForm, { emitEvent: false });

    this.formularioEmpresaReciclaje.patchValue(ESTADO.empresaReciclaje, {
      emitEvent: false,
    });
    this.formularioLugarReciclaje.patchValue(ESTADO.lugarReciclaje, {
      emitEvent: false,
    });
    this.formularioEmpresaTransportista.patchValue(
      ESTADO.empresaTransportista,
      { emitEvent: false }
    );
    this.formularioPrecaucionesManejo.patchValue(ESTADO.precaucionesManejo, {
      emitEvent: false,
    });
  }

  /**
   * Actualiza un campo específico del formulario principal en el store
   * @param campo Nombre del campo a actualizar
   */
  actualizarCampoSolicitudForm(
    campo: keyof EstadoDatoSolicitud['solicitudForm']
  ): void {
    const VALOR = this.solicitudForm.get(campo)?.value;
    this.datoSolicitudStore.actualizarSolicitudForm({
      ...this.solicitudForm.getRawValue(),
      [campo]: VALOR,
    });
  }

  /**
   * Actualiza un campo específico del formulario de empresa recicladora en el store
   * @param campo Nombre del campo a actualizar
   */
  actualizarCampoEmpresaReciclaje(
    campo: keyof EstadoDatoSolicitud['empresaReciclaje']
  ): void {
    const VALOR = this.formularioEmpresaReciclaje.get(campo)?.value;

    if (campo === 'requiereEmpresa') {
      this.onRequiereEmpresaChange();
    }

    this.datoSolicitudStore.actualizarEmpresaReciclaje({
      ...this.formularioEmpresaReciclaje.getRawValue(),
      [campo]: VALOR,
    });
  }

  /**
   * Actualiza un campo específico del formulario de empresa transportista en el store
   * @param campo Nombre del campo a actualizar
   */
  actualizarCampoEmpresaTransportista(
    campo: keyof EstadoDatoSolicitud['empresaTransportista']
  ): void {
    const VALOR = this.formularioEmpresaTransportista.get(campo)?.value;
    this.datoSolicitudStore.actualizarEmpresaTransportista({
      ...this.formularioEmpresaTransportista.getRawValue(),
      [campo]: VALOR,
    });
  }

  /**
   * Actualiza un campo específico del formulario de precauciones en el store
   * @param campo Nombre del campo a actualizar
   */
  actualizarCampoPrecaucionesManejo(
    campo: keyof EstadoDatoSolicitud['precaucionesManejo']
  ): void {
    const VALOR = this.formularioPrecaucionesManejo.get(campo)?.value;
    this.datoSolicitudStore.actualizarPrecaucionesManejo({
      ...this.formularioPrecaucionesManejo.getRawValue(),
      [campo]: VALOR,
    });
  }

  /**
   * Muestra el modal para agregar operaciones de importación
   */
  agregarOperacionImp(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Establece el tipo de aviso seleccionado
   * @param evento Valor del tipo de aviso
   */
  setTipoDeAviso(evento: string | number): void {
    this.tipoAviso = evento;
    const MOSTRAR_COMBO_DOMICILIO = this.tipoAviso === 'primera_vez';
    HABILITAR_CONTROL(
      this.solicitudForm.get('domicilio'),
      MOSTRAR_COMBO_DOMICILIO
    );
  }

  /**
   * Determina si se debe mostrar el combo de domicilios IMMEX
   */
  get mostrarComboDomicilioImmex(): boolean {
    return this.tipoAviso === 'primera_vez';
  }

  /**
   * Obtiene opciones de radio para avisos desde el servicio
   */
  obtenerAvisoOpcionesDeRadio(): void {
    this.mercanciasDesmontadasOSinMontarService
      .obtenerAvisoOpcionesDeRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (respuesta: AvisoOpcionesDeRadio) => {
          this.avisoOpcionesDeRadio = respuesta;
        },
      });
  }

  /**
   * Actualiza el estado de habilitación de los formularios según el modo (lectura/edición)
   */
  private actualizarEstadoFormularios(): void {
    if (this.esFormularioSoloLectura) {
      if (!this.formularioEmpresaReciclaje.get('nombreEmpresa')?.value) {
        this.formularioEmpresaReciclaje.get('requiereEmpresa')?.setValue('No');
      }
      this.deshabilitarFormularios();
    } else {
      this.habilitarFormularios();
    }
  }

  /**
   * Deshabilita todos los formularios para modo de solo lectura
   */
  private deshabilitarFormularios(): void {
    this.solicitudForm.disable();
    this.formularioEmpresaReciclaje.disable();
    this.formularioLugarReciclaje.disable();
    this.formularioEmpresaTransportista.disable();
    this.formularioPrecaucionesManejo.disable();
  }

  /**
   * Habilita todos los formularios para modo de edición
   */
  private habilitarFormularios(): void {
    this.solicitudForm.enable();
    this.formularioEmpresaReciclaje.enable();
    this.formularioLugarReciclaje.enable();
    this.formularioEmpresaTransportista.enable();
    this.formularioPrecaucionesManejo.enable();
  }

  /**
   * Maneja el evento cuando se agrega un residuo peligroso desde el modal
   * @param residuoData Datos del residuo peligroso agregado
   */
  onResiduoAgregado(residuoData: ResiduoPeligroso): void {
    // Agregar el nuevo residuo directamente a los datos de la tabla
    this.datosTabla = [...this.datosTabla, residuoData];
    this.datoSolicitudStore.actualizarResiduosPeligrosos(this.datosTabla);
  }

  /**
   * Maneja la selección de filas en la tabla dinámica
   * @param filasSeleccionadas Array de elementos seleccionados
   */
  onFilasSeleccionadas(filasSeleccionadas: ResiduoPeligroso[]): void {
    // Limpiar selecciones previas
    this.filasSeleccionadas.clear();

    // Encontrar los índices de las filas seleccionadas
    filasSeleccionadas.forEach((filaSeleccionada) => {
      const INDEX = this.datosTabla.findIndex(
        (fila) =>
          fila.nicoCve === filaSeleccionada.nicoCve &&
          fila.fraccionCve === filaSeleccionada.fraccionCve &&
          fila.numeroManifiesto === filaSeleccionada.numeroManifiesto
      );
      if (INDEX !== -1) {
        this.filasSeleccionadas.add(INDEX);
      }
    });
  }

  /**
   * Borra las filas seleccionadas de la tabla
   */
  borrarFilasSeleccionadas(): void {
    if (this.filasSeleccionadas.size === 0) {
      return;
    }

    // Convertir a array y ordenar de mayor a menor para eliminar correctamente
    const INDICES_A_ELIMINAR = Array.from(this.filasSeleccionadas).sort(
      (a, b) => b - a
    );

    INDICES_A_ELIMINAR.forEach((index) => {
      this.datosTabla.splice(index, 1);
    });

    // Limpiar selecciones
    this.filasSeleccionadas.clear();

    // Forzar actualización de la tabla
    this.datosTabla = [...this.datosTabla];
  }

  /**
   * Actualiza un campo específico del formulario de lugar de reciclaje en el store.
   *
   * @param campo - Nombre del campo a actualizar dentro de `lugarReciclaje`.
   *
   * Toma el valor actual del control correspondiente y lo persiste en el store.
   */
  actualizarDatosDestinatario(
    campo: keyof EstadoDatoSolicitud['lugarReciclaje']
  ): void {
    const VALOR = this.formularioLugarReciclaje.get(campo)?.value;

    this.datoSolicitudStore.actualizarLugarReciclaje({
      ...this.formularioLugarReciclaje.getRawValue(),
      [campo]: VALOR,
    });
  }

  /**
   * Obtiene los datos IMMEX desde el servicio y los asigna al catálogo correspondiente.
   * Se utiliza un RFC estático para pruebas en lo que se termina el servicio de autenticación.
   */
  obtenerDatosImmex(): void {
    const RFC_SOLICITANTE = this.datoSolicitudQuery.getValue().rfc_solicitante;
    const RFC = RFC_SOLICITANTE ? RFC_SOLICITANTE
      : this.rfcLogueado;
    this.catalogosService
      .obtenerDatosImmexByRfc(RFC)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.immexCatalogo = data.datos.map((item: ImmexResponse) => ({
          id: item.id_prog_autorizado,
          descripcion: item.num_folio_tramite,
        }));
      });
  }

  /**
   *
   * @param numeroProgramaImmex
   */
  obtenerDireccionPortImmex(numeroProgramaImmex: string): void {
    this.catalogosService
      .obtenerDirecciones(numeroProgramaImmex)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.direccionesCatalogo = data.datos.map((item: Domicilio) => ({
          id: Number(item.clave),
          clave: item.clave?.toString(),
          descripcion: item.domicilio,
        }));
      });
  }

  /**
   * Maneja el cambio en la selección de IMMEX para actualizar las direcciones asociadas.
   */
  onImmexChange(): void {
    const NUMERO_PROGRAMA_IMMEX = this.solicitudForm.get('numeroProgramaImmex')
      ?.value as string;
    this.obtenerDireccionPortImmex(NUMERO_PROGRAMA_IMMEX);
  }

  /**
   * Obtiene las aduanas de salida disponibles y las asigna al catálogo correspondiente.
   */
  obtenerAduanasSalida(): void {
    this.catalogosService
      .obtenerAduanaSalida()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.aduanasSalida = data.datos;
      });
  }

  /**
   * Obtiene los países de salida disponibles y los asigna al catálogo correspondiente.
   */
  obtenerPaisesSalida(): void {
    this.catalogosService
      .obtenerPaisesDestino()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.paisesSalidaCatalogo = data.datos;
      });
  }

  /**
   * Valida los campos del formulario de empresa reciclaje, si el requisito es "Sí", habilita el formulario.
   */
  validaCamposEmpresaReciclaje(): void {
    const REQUIERE_EMPRESA = this.formularioEmpresaReciclaje.get('requiereEmpresa')?.value;
    const CAMPOS = [
      'nombreEmpresa',
      'representanteLegal',
      'telefono',
      'correoElectronico',
    ];
    if (!this.esFormularioSoloLectura) {
      CAMPOS.forEach((campo) => {
        const CONTROL = this.formularioEmpresaReciclaje.get(campo);
        if (CONTROL) {
          if (REQUIERE_EMPRESA && REQUIERE_EMPRESA === 'No') {
            CONTROL.disable();
          } else {
            CONTROL.enable();
          }
        }
      });
    }
  }

  /**
   * Limpieza al destruir el componente:
   * - Completa los subjects de destrucción
   * - Cancela suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
