import {
  ADMINISTRAR_RESIDUOS,
  EstadoDatoSolicitud,
} from '../../models/datos-solicitud.model';
import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputRadioComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  RadioOpcion,
  SolicitudJson,
} from '@libs/shared/data-access-user/src/core/models/231003/solicitud.model';
import { Subject, takeUntil } from 'rxjs';
import { AvisoDeReciclajeServiceService } from '../../service/aviso-de-reciclaje-service.service';
import { CatalogoT231003Service } from '../../service/catalogo-t231003.service';
import { CommonModule } from '@angular/common';
import { DatoSolicitudQuery } from '../../estados/queries/dato-solicitud.query';
import { DatoSolicitudStore } from '../../estados/tramites/dato-solicitud.store';
import { DatosResiduosPeligrososComponent } from '../datos-residuos-peligrosos/datos-residuos-peligrosos.component';
import { ES_CONTROL_INVALIDO } from '../../../../shared/helpers';
import { ImmexResponse } from '../../../231001/models/catalogo-response';
import { Modal } from 'bootstrap';
import { ResiduoPeligroso } from '../../../231002/models/aviso-catalogo.model';
import rawData from '@libs/shared/theme/assets/json/231003/solicitud.json';
import { LoginQuery } from '@ng-mf/data-access-user'

/**
 * Constante que contiene las opciones de radio y demás datos del archivo JSON.
 * Se hace un cast del JSON importado al tipo `SolicitudJson`.
 */
const RADIO_OPCIONES = rawData as SolicitudJson;

/**
 * Componente que representa la sección de datos de la solicitud.
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
  /** Mensaje de validación para campos obligatorios. */
  mensajeCampoObligatorio: string = `<div class="text-danger">
          <small>Este campo es obligatorio</small>
        </div>`;

  /** Indica si el formulario es válido */
  @Input() esFormValido!: boolean;

  /** Verifica si algún campo del formulario es inválido. */
  esControlInvalido = ES_CONTROL_INVALIDO;

  /** Indica si el botón de borrar (acciones en tabla) está habilitado. */
  borrarHabilitado: boolean = false;

  /** Conjunto de índices de residuos seleccionados en la tabla para acciones en lote. */
  residuoSeleccionado: Set<number> = new Set();
  /**
   * Referencia al elemento del DOM del modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;
  /**
   * Formulario principal de solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Formulario con datos de la empresa de reciclaje.
   */
  formularioEmpresaReciclaje!: FormGroup;

  /**
   * Formulario con información del lugar de reciclaje.
   */
  formularioLugarReciclaje!: FormGroup;

  /**
   * Formulario con información de la empresa transportista.
   */
  formularioEmpresaTransportista!: FormGroup;

  /**
   * Formulario con las precauciones de manejo.
   */
  formularioPrecaucionesManejo!: FormGroup;

  /**
   * Opciones de radio generales para el formulario.
   */
  radioOptions: RadioOpcion[] = RADIO_OPCIONES?.radioOptions;

  /**
   * Opciones de radio utilizadas en el formulario para etiquetar residuos.
   */
  public etiquetasForm = RADIO_OPCIONES;


  /**
   * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Almacena la configuración de la tabla para el tipo de dato "Administrar".
   * Utiliza la configuración de columnas predefinida de `ADMINISTRAR_RESIDUOS`.
   */
  public configuracionTabla: ConfiguracionColumna<ResiduoPeligroso>[] =
    ADMINISTRAR_RESIDUOS;
  /**
   * Arreglo que contiene la lista de objetos `Administrar` que representan los registros de gestión de residuos
   * asociados a la solicitud actual.
   */
  public administrarResiduos: ResiduoPeligroso[] = [];
  /**
   * Especifica el modo de selección de la tabla como selección por casilla de verificación (checkbox).
   */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Indica si actualmente hay una fila seleccionada en la tabla.
   * Se utiliza para controlar el comportamiento de la interfaz según el estado de selección de la fila de la tabla.
   */

  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  esLectura: boolean = false;



  /**
   * Catálogo de programas IMMEX para el formulario.
   */
  immexCatalogo!: Catalogo[];

  /** Indica si hay una fila seleccionada en la tabla */
  public tieneTablaRowSeleccionado: boolean = false;

  /** RFC del usuario logueado */
  rfcLogueado: string = '';
  /**
   * Constructor del componente. Inyecta el FormBuilder, el store y el query de Akita.
   */
  constructor(
    public fb: FormBuilder,
    private datoSolicitudStore: DatoSolicitudStore,
    private datoSolicitudQuery: DatoSolicitudQuery,
    private avisoDeReciclajeSvc: AvisoDeReciclajeServiceService,
    private catalogoService: CatalogoT231003Service,
    private loginQuery: LoginQuery
  ) {
    // Lógica del constructor si se necesita
  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos del componente.
   *
   * - Inicializa múltiples formularios relacionados con la solicitud, empresa de reciclaje, lugar de reciclaje, empresa transportista y precauciones de manejo.
   * - Recupera valores almacenados desde el store de gestión de estado para poblar los formularios.
   * - Se suscribe al estado de consulta y actualiza el estado local en consecuencia.
   * - Deshabilita los formularios si el estado de consulta está en modo solo lectura.
   * - Deshabilita controles específicos en el formulario de lugar de reciclaje según su valor.
   * - Invoca el método para obtener los datos de gestión de residuos.
   */
  ngOnInit(): void {
    /** Obtiene los datos del usuario logueado */
    this.obtenerDatosRfc();

    /** */
    this.obtenerDatosTramite();
    /**
     * Inicializa el formulario principal de solicitud.
     */
    this.inicializarSolicitudForm();

    /**
     * Inicializa el formulario con los datos de la empresa de reciclaje.
     */
    this.inicializarFormularioEmpresaReciclaje();

    /**
     * Inicializa el formulario con los datos del lugar de reciclaje.
     */
    this.inicializarFormularioLugarReciclaje();

    /**
     * Inicializa el formulario con los datos de la empresa transportista.
     */
    this.inicializarFormularioEmpresaTransportista();

    /**
     * Inicializa el formulario de precauciones de manejo.
     */
    this.inicializarFormularioPrecaucionesManejo();

    /**
     * Recupera valores almacenados en el store para rellenar los formularios.
     */
    this.recuperarValoresDesdeStore();

    /**
     * Obtiene los datos de gestión de residuos asociados a la solicitud.
     */
    this.obtenerImmex();

    /** Valida si el formulario es válido al iniciar. */
    this.validaEsFormularioValido();

    /** habilita o deshabilita el form dependiendo del tipo de accion */
    this.deshabilitarFormularios();

    if (
      this.formularioLugarReciclaje.get('reciclajeInstalaciones')?.value ===
      'Si'
    ) {
      this.formularioLugarReciclaje.get('lugarReciclaje')?.disable();
      this.formularioLugarReciclaje
        .get('numeroAutorizacionEmpresaReciclaje')
        ?.disable();
    }
  }


  /**
   * Obtiene los datos IMMEX del solicitante.
   */
  obtenerDatosRfc(): void {
    this.loginQuery.selectRfc$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.rfcLogueado = res;
      });
  }

  /**
   * Obtiene los datos del catálogo IMMEX desde el servicio y los asigna a `immexCatalogo`.
   */
  obtenerDatosTramite(): void {
    this.datoSolicitudQuery.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.esLectura = res.esLecutra || false;
      });
  }

  /**
   * Inicializa el formulario principal de solicitud con sus respectivos campos y validaciones.
   */
  private inicializarSolicitudForm(): void {
    this.solicitudForm = this.fb.group({
      /** Número de registro ambiental del residuo */
      numeroRegistroAmbiental: ['', Validators.required],

      /** Descripción genérica del residuo */
      descripcionGenerica1: ['', Validators.required],

      /** Número del programa IMMEX asociado */
      numeroProgramaImmex: ['', Validators.required],
    });
  }

  /**
   * Inicializa el formulario con los datos de la empresa de reciclaje,
   * incluyendo campos obligatorios y validaciones.
   */
  private inicializarFormularioEmpresaReciclaje(): void {
    this.formularioEmpresaReciclaje = this.fb.group({
      /** Indica si se requiere empresa de reciclaje (valor por defecto: "Si") */
      requiereEmpresa: ['', Validators.required],

      /** Nombre de la empresa recicladora */
      nombreEmpresa: ['', Validators.required],

      /** Nombre del representante legal */
      representanteLegal: ['', Validators.required],

      /** Teléfono de contacto de la empresa */
      telefono: ['', Validators.required],

      /** Correo electrónico con validación de formato */
      correoElectronico: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Inicializa el formulario con los datos de la empresa transportista de residuos,
   * estableciendo validaciones requeridas para cada campo.
   */
  private inicializarFormularioEmpresaTransportista(): void {
    this.formularioEmpresaTransportista = this.fb.group({
      /** Nombre de la empresa que transporta los residuos */
      nombreEmpresaTransportistaResiduos: ['', Validators.required],

      /** Número de autorización otorgado por SEMARNAT */
      numeroAutorizacionSemarnat: ['', Validators.required],
    });
  }

  /**
   * Inicializa el formulario de precauciones de manejo,
   * obligatorio para especificar medidas de seguridad o manejo especial del residuo.
   */
  private inicializarFormularioPrecaucionesManejo(): void {
    this.formularioPrecaucionesManejo = this.fb.group({
      /** Descripción de las precauciones de manejo del residuo */
      precaucionesManejo: ['', Validators.required],
    });
  }

  /**
   * Habilita o deshabilita los campos del formulario de empresa de reciclaje
   * dependiendo del valor seleccionado en el campo "requiereEmpresa".
   *
   * @param valor Valor seleccionado, debe ser "Si" o "No".
   */
  onRequiereEmpresaChange(valor: string): void {
    const DEBE_HABILITAR: boolean = valor === 'Si';

    const CAMPOS_A_CONTROLAR: string[] = [
      'nombreEmpresa',
      'representanteLegal',
      'telefono',
      'correoElectronico',
    ];

    CAMPOS_A_CONTROLAR.forEach((campo: string): void => {
      const CONTROL_CAMPO = this.formularioEmpresaReciclaje.get(campo);
      if (CONTROL_CAMPO) {
        if (DEBE_HABILITAR) {
          CONTROL_CAMPO.enable();
        } else {
          CONTROL_CAMPO.disable();
        }
      }
    });
  }

  /**
   * Inicializa el formulario de lugar de reciclaje con sus respectivos campos y validaciones.
   *
   * Campos:
   * - reciclajeInstalaciones: Indica si el reciclaje se realiza en las instalaciones (valor por defecto: 'Si').
   * - lugarReciclaje: Campo obligatorio para especificar el lugar de reciclaje.
   * - numeroAutorizacionEmpresaReciclaje: Campo obligatorio para registrar el número de autorización de la empresa recicladora.
   */
  private inicializarFormularioLugarReciclaje(): void {
    this.formularioLugarReciclaje = this.fb.group({
      reciclajeInstalaciones: ['Si', Validators.required],
      lugarReciclaje: ['', Validators.required],
      numeroAutorizacionEmpresaReciclaje: ['', Validators.required],
    });
  }

  /**
   * Recupera los valores almacenados en el estado de Akita mediante el query
   * y los aplica a los formularios correspondientes sin emitir eventos.
   *
   * Esto permite repoblar los formularios cuando se recarga el componente
   * o se navega entre pantallas sin perder la información ingresada.
   */
  private recuperarValoresDesdeStore(): void {
    const ESTADO = this.datoSolicitudQuery.getValue();

    this.administrarResiduos = ESTADO.residuos ? [...ESTADO.residuos] : [];

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
   * Actualiza un campo específico del formulario de solicitud en el store.
   *
   * @param campo - Nombre del campo del formulario de solicitud a actualizar.
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
   * Actualiza un campo específico del formulario de empresa de reciclaje en el store.
   * Si el campo actualizado es 'requiereEmpresa', se habilitan o deshabilitan dinámicamente
   * los campos relacionados según el valor seleccionado.
   *
   * @param campo - Nombre del campo del formulario de empresa reciclaje a actualizar.
   */
  actualizarCampoEmpresaReciclaje(
    campo: keyof EstadoDatoSolicitud['empresaReciclaje']
  ): void {
    const VALOR = this.formularioEmpresaReciclaje.get(campo)?.value;

    // Si el campo actualizado es 'requiereEmpresa', se evalúa si se deben habilitar o deshabilitar otros campos
    if (campo === 'requiereEmpresa') {
      const DEBE_HABILITAR = VALOR === 'Si';
      const CAMPOS = [
        'nombreEmpresa',
        'representanteLegal',
        'telefono',
        'correoElectronico',
      ];

      CAMPOS.forEach((campoExtra): void => {
        const CONTROL = this.formularioEmpresaReciclaje.get(campoExtra);
        if (CONTROL) {
          if (DEBE_HABILITAR) {
            CONTROL.enable();
          } else {
            CONTROL.disable();
          }
        }
      });
    }

    // Actualiza el estado del formulario de empresa reciclaje en el store
    this.datoSolicitudStore.actualizarEmpresaReciclaje({
      ...this.formularioEmpresaReciclaje.getRawValue(),
      [campo]: VALOR,
    });
  }

  /**
   * Actualiza un campo específico del formulario de lugar de reciclaje en el store.
   * Si el campo actualizado es 'reciclajeInstalaciones', se habilitan o deshabilitan dinámicamente
   * los campos adicionales dependiendo de si se seleccionó "Sí" o "No".
   *
   * @param campo - Nombre del campo del formulario de lugar de reciclaje a actualizar.
   */
  actualizarCampoLugarReciclaje(
    campo: keyof EstadoDatoSolicitud['lugarReciclaje']
  ): void {
    const VALOR = this.formularioLugarReciclaje.get(campo)?.value;

    // Si el campo actualizado es 'reciclajeInstalaciones', controla la habilitación de campos relacionados
    if (campo === 'reciclajeInstalaciones') {
      const DEBE_HABILITAR = VALOR === 'No';
      const CAMPOS_A_CONTROLAR = [
        'lugarReciclaje',
        'numeroAutorizacionEmpresaReciclaje',
      ];

      CAMPOS_A_CONTROLAR.forEach((campoExtra: string): void => {
        const CONTROL = this.formularioLugarReciclaje.get(campoExtra);
        if (CONTROL) {
          if (DEBE_HABILITAR) {
            CONTROL.enable();
          } else {
            CONTROL.disable();
          }
        }
      });
    }

    // Actualiza el estado del formulario de lugar de reciclaje en el store
    this.datoSolicitudStore.actualizarLugarReciclaje({
      ...this.formularioLugarReciclaje.getRawValue(),
      [campo]: VALOR,
    });
  }

  /**
   * Actualiza un campo específico del formulario de empresa transportista en el store.
   *
   * @param campo - Nombre del campo del formulario de empresa transportista a actualizar.
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
   * Actualiza un campo específico del formulario de precauciones de manejo en el store.
   *
   * @param campo - Nombre del campo del formulario de precauciones de manejo a actualizar.
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
   * Muestra el modal para agregar una operación de importación.
   * Se utiliza el componente de Bootstrap Modal con una referencia al elemento del DOM.
   */
  agregarOperacionImp(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement?.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Establece el estado de selección de la fila de la tabla.
   * Actualiza la propiedad `tieneTablaRowSeleccionado` según si hay filas seleccionadas.
   *
   * @param rowSeleccion - Un arreglo de objetos `Administrar` que representan las filas seleccionadas.
   */
  onFilasSeleccionadas(filasSeleccionadas: ResiduoPeligroso[]): void {
    // Limpiar selecciones previas
    this.residuoSeleccionado.clear();

    // Agregar nuevas selecciones
    filasSeleccionadas.forEach((materia) => {
      const INDEX = this.administrarResiduos.findIndex(
        (m) => m.id === materia.id
      );
      if (INDEX !== -1) {
        this.residuoSeleccionado.add(INDEX);
      }
    });

    // Actualizar estado del botón borrar
    this.borrarHabilitado = this.residuoSeleccionado.size > 0;
  }

  /**
   * Habilita o deshabilita todos los formularios según el estado de solo lectura.
   * Si el estado es de solo lectura, deshabilita todos los formularios para evitar edición.
   * Si el estado permite edición, habilita todos los formularios.
   */
  deshabilitarFormularios(): void {
    if (this.datoSolicitudQuery.getValue().esLecutra) {

      if (!this.formularioEmpresaReciclaje.get('nombreEmpresa')?.value) {
        this.formularioEmpresaReciclaje.get('requiereEmpresa')?.setValue('No');
      }

      // Deshabilita los formularios si el estado es solo lectura
      this.solicitudForm.disable();
      this.formularioEmpresaReciclaje.disable();
      this.formularioLugarReciclaje.disable();
      this.formularioEmpresaTransportista.disable();
      this.formularioPrecaucionesManejo.disable();
    } else {
      // Habilita los formularios si el estado permite edición
      this.solicitudForm.enable();
      this.formularioEmpresaReciclaje.enable();
      this.formularioLugarReciclaje.enable();
      this.formularioEmpresaTransportista.enable();
      this.formularioPrecaucionesManejo.enable();
    }
  }

  /**
   * Obtiene los datos del aviso de reciclaje desde el servicio y los asigna a `administrarResiduos`.
   *
   * Se suscribe al observable `obtenerAvisoDeReciclajeDatos` de `avisoDeReciclajeSvc`,
   * asegurando que la suscripción se limpie correctamente usando `takeUntil(this.destroy$)`.
   * La respuesta se copia profundamente antes de asignarla para evitar problemas de referencia.
   */
  public getAdministrarResiduos(): void {
    this.avisoDeReciclajeSvc
      .obtenerAvisoDeReciclajeDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        const API_DATOS = JSON.parse(JSON.stringify(response));
        this.administrarResiduos = API_DATOS;
      });
  }

  /**
   * Elimina los residuos seleccionados de la lista `administrarResiduos`.
   *
   * Ordena los índices de mayor a menor para evitar desajustes al eliminar.
   * Actualiza la tabla y el estado de la selección/botón borrar.
   */
  borrarResiduo(): void {
    if (this.residuoSeleccionado.size === 0) {
      return;
    }

    // Convertir a array y ordenar de mayor a menor para eliminar correctamente
    const INDICES_A_ELIMINAR = Array.from(this.residuoSeleccionado).sort(
      (a, b) => b - a
    );

    INDICES_A_ELIMINAR.forEach((index) => {
      this.administrarResiduos.splice(index, 1);
    });

    // Limpiar selecciones y actualizar tabla
    this.residuoSeleccionado.clear();
    this.borrarHabilitado = false;
    this.administrarResiduos = [...this.administrarResiduos];
  }

  /**
   * Maneja la llegada de un residuo peligroso agregado desde el componente hijo.
   * Persiste localmente en la lista `administrarResiduos` y actualiza el store.
   *
   * @param residuoData - Objeto con la información del residuo agregado.
   */
  onResiduoAgregado(residuoData: ResiduoPeligroso): void {
    this.administrarResiduos = [...this.administrarResiduos, residuoData];
    this.datoSolicitudStore.actualizarResiduos(this.administrarResiduos);
  }

  /**
   * Valida todos los formularios del componente.
   * @returns Un valor booleano que indica si todos los formularios son válidos.
   */
  /**
   * Valida si el formulario es válido y marca los campos como tocados si no lo es.
   */
  validaEsFormularioValido(): boolean {
    if (!this.esFormValido) {
      this.marcarCamposcomoTocados();
    }
    return (
      this.solicitudForm.valid &&
      this.formularioEmpresaTransportista.valid &&
      this.formularioEmpresaReciclaje.valid &&
      this.formularioPrecaucionesManejo.valid &&
      this.formularioLugarReciclaje.valid &&
      this.administrarResiduos.length > 0
    );
  }

  /**
   * Marca todos los campos de los formularios como tocados para activar las validaciones visuales.
   */
  marcarCamposcomoTocados(): void {
    this.solicitudForm.markAllAsTouched();
    this.formularioEmpresaTransportista.markAllAsTouched();
    this.formularioEmpresaReciclaje.markAllAsTouched();
    this.formularioPrecaucionesManejo.markAllAsTouched();
    this.formularioLugarReciclaje.markAllAsTouched();
  }

  /**
   * Obtiene los datos del catálogo IMMEX desde el servicio y los asigna a `immexCatalogo`.
   * Se deja RFC en duro para pruebas, en lo que se integra con autenticación, se debe obtener dinámicamente.
   */
  obtenerImmex(): void {
    const RFC_SOLICITANTE = this.datoSolicitudQuery.getValue().rfc_solicitante;

    const RFC = RFC_SOLICITANTE ? RFC_SOLICITANTE
      : this.rfcLogueado;
    this.catalogoService
      .obtenerDatosImmexByRfc(RFC)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.immexCatalogo = data.datos.map((item: ImmexResponse) => ({
          id: item.id_prog_autorizado,
          descripcion: item.num_folio_tramite,
        }));
      });
  }

  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroy$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
