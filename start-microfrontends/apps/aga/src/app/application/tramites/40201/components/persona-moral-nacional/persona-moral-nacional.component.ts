import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ERROR_FORMA_ALERT,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
  esControlValido,
} from '@libs/shared/data-access-user/src';
import {
  CAMPO_OBLIGATORIO,
  CONFIGURACION_PARA_PMN_ENCABEZADO_DE_TABLA,
  ERROR_NOMBRE_EXISTE,
  TEXTOS,
} from '../../constantes/transportacion-maritima.enum';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite40201Store,
  TransportacionMaritima40201State,
} from '../../estados/store/tramite40201.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Contribuyente } from '../../models/contributente.model';
import { PersonaMoralNacionalForm } from '../../models/transportacion-maritima.model';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { Tramite40201Query } from '../../estados/query/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';

/**
 * Componente para gestionar la información de personas morales nacionales.
 */
@Component({
  selector: 'app-persona-moral-nacional',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './persona-moral-nacional.component.html',
  styleUrl: './persona-moral-nacional.component.css',
})
export class PersonaMoralNacionalComponent implements OnInit, OnDestroy {
  /**
   * Notificación para mostrar alertas generales.
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Notificación para mostrar información específica.
   * @property {Notificacion} nuevaNotificacionInfo
   */
  public nuevaNotificacionInfo!: Notificacion;

  /**
   * Nueva notificación para mostrar en el componente.
   * @property {Notificacion} nuevaAlertaNotificacion
   */
  /** Objeto de notificación para mostrar popup */
  public nuevaAlertaNotificacion: Notificacion = {} as Notificacion;

  /**
   * Indica si se debe mostrar la alerta general.
   * @property {boolean} mostrarAlerta
   */
  mostrarAlerta: boolean = false;

  /**
   * Indica si se debe mostrar la información específica.
   * @property {boolean} mostrarInfo
   */
  mostrarInfo: boolean = false;

  /**
   * Indica si el registro actual se encuentra en modo modificación.
   */
  esModificacion: boolean = false;

  /**
   * Índice de la fila que se está editando en la tabla. Null cuando no hay edición activa.
   */
  indexEdicion: number | null = null;

  /**
   * Mensaje de error global del formulario (se muestra en la UI cuando aplica).
   */
  errorFormulario = ERROR_FORMA_ALERT;
  /**
   * Mensaje de validación para campos obligatorios.
   */
  mensajeCampoObligatorio = CAMPO_OBLIGATORIO;

  /**
   * Indica si el formulario es válido.
   */
  esFormValido: boolean = true;

  /**
   * Formulario reactivo para gestionar la información de personas morales nacionales.
   */
  personaMoralForm!: FormGroup;

  /**
   * País.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de países.
   */
  pais!: Catalogo[];

  /**
   * Estado.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de estados.
   */
  estado!: Catalogo[];

  /**
   * Municipio.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de municipios.
   */
  municipio!: Catalogo[];

  /**
   * Colonia.
   * @type {Catalogo[]}
   * @description Este arreglo contiene los catálogos de colonias.
   */
  colonia!: Catalogo[];

  /**
   * Configuración para el persona moral nacional encabezado de la tabla.
   */
  configuracionParaPMNEncabezadoDeTabla =
    CONFIGURACION_PARA_PMN_ENCABEZADO_DE_TABLA;

  /**
   * Tabla de datos de personas morales nacionales.
   * @type {PersonaMoralNacionalForm[]}
   */
  personaMoralNacionalTabla: PersonaMoralNacionalForm[] = [];

  /**
   * Texto de aviso de privacidad simplificado.
   * @type {string}
   */
  TEXTOS = TEXTOS;

  /** Lista de elementos seleccionados en la tabla */
  itemsSeleccionados: Set<number> = new Set();

  /**
   * Referencia al botón de cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Estado de la solicitud.
   */
  public transportacionMaritimaState!: TransportacionMaritima40201State;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Tabla de selección para la persona moral nacional.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Indica si el formulario está en modo solo lectura
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param tramite40201Store Store para gestionar el estado del trámite 40201.
   * @param tramite40201Query Query para consultar el estado del trámite 40201.
   * @param transportacionMaritimaService Servicio para obtener los catálogos y datos relacionados con los transportacion marítima.
   */
  constructor(
    private fb: FormBuilder,
    private tramite40201Store: Tramite40201Store,
    private tramite40201Query: Tramite40201Query,
    private transportacionMaritimaService: TransportacionMaritimaService,
    private consultaioQuery: ConsultaioQuery
  ) { }

  /**
   * Inicializa el componente.
   * Suscribe a los cambios en el estado de la sección y crea el formulario reactivo.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite40201Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
          this.personaMoralNacionalTabla =
            seccionState.personaMoralNacionalTabla || [];
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo para agregar personas morales nacionales.
   * @returns {void}
   */
  crearAgregarPMNForm(): void {
    this.personaMoralForm = this.fb.group({
      buscarRfcPMN: ['', [Validators.required, Validators.maxLength(13)]],
      rfcPMN: [{ value: '', disabled: true }, Validators.maxLength(13)],
      denominacionPMN: [
        { value: '', disabled: true },
        [Validators.maxLength(254)],
      ],
      correoPMN: [{ value: '', disabled: true }, [Validators.maxLength(320)]],
      paisPMN: [''],
      codigoPostalPMN: [
        { value: '', disabled: true },
        [Validators.maxLength(12)],
      ],
      estadoPMN: [''],
      municipioPMN: [''],
      localidadPMN: [
        { value: '', disabled: true },
        [Validators.maxLength(120)],
      ],
      coloniaPMN: [''],
      callePMN: [{ value: '', disabled: true }, [Validators.maxLength(100)]],
      numeroExteriorPMN: [
        { value: '', disabled: true },
        [Validators.maxLength(100)],
      ],
      numeroInteriorPMN: [
        { value: '', disabled: true },
        [Validators.maxLength(55)],
      ],
      nombreDirectorGeneral: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
      apellidoPaternoDirectorGeneral: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
      apellidoMaternoDirectorGeneral: ['', [Validators.maxLength(200)]],
    });
  }

  /**
   * Inicializa el estado del formulario.
   * Si el formulario es de solo lectura, guarda los datos del formulario.
   * Si no, crea el formulario reactivo.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearAgregarPMNForm();
    }
  }
  /**
   * Guarda los datos del formulario y habilita o deshabilita el formulario según el estado de solo lectura.
   * @returns {void}
   * @description Este método se utiliza para guardar los datos del formulario y habilitar o deshabilitar el formulario según el estado de solo lectura.
   */
  guardarDatosFormulario(): void {
    this.crearAgregarPMNForm();
    if (this.esFormularioSoloLectura) {
      this.personaMoralForm.disable();
    } else {
      this.personaMoralForm.enable();
    }
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  inicializaCatalogos(): void {
    this.transportacionMaritimaService
      .obtenerPaises()
      .subscribe((res) => (this.pais = res.datos || []));

    this.transportacionMaritimaService
      .obtenerEstados()
      .subscribe((res) => (this.estado = res.datos || []));
  }

  /**
   * Busca un contribuyente por su RFC.
   * @param {string} rfc - El RFC del contribuyente a buscar.
   * @returns {void}
   */
  buscarContribuyente(): void {
    const RFC_CONTROL = this.personaMoralForm.get('buscarRfcPMN');
    this.esFormValido = true;
    if (RFC_CONTROL?.invalid) {
      RFC_CONTROL.markAsTouched();
      this.esFormValido = false;
      this.errorFormulario = ERROR_FORMA_ALERT;
      return;
    }
    this.transportacionMaritimaService
      .buscarContribuyente(
        false,
        this.personaMoralForm.get('buscarRfcPMN')?.value
      )
      .subscribe({
        next: (result) => {
          if (result.datos) {
            this.setContribuyenteDatosEnFormulario(result.datos);
          } else {
            this.esFormValido = false;
            this.errorFormulario =
              `
            <div class="d-flex justify-content-center text-center">` +
              (result.mensaje || ERROR_FORMA_ALERT) +
              `</div>`;
          }
          this.personaMoralForm.get('buscarRfcPMN')?.reset();
        },
      });
  }

  /**
   * Verifica si un control específico del formulario es inválido y fue tocado.
   * @param control Nombre del control dentro del formulario.
   * @returns true si el control es inválido y ha sido tocado; false en caso contrario.
   */
  esControlInvalido(control: string): boolean {
    return esControlValido(this.personaMoralForm, control) || false;
  }

  /**
   * Establece los datos del contribuyente obtenidos en el formulario.
   * @param contribuyente Objeto Contribuyente con domicilio y datos principales.
   */
  setContribuyenteDatosEnFormulario(contribuyente: Contribuyente): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { calle, colonia, cp, delegacion_municipio, entidad_federativa, localidad, num_exterior, num_interior, pais } = contribuyente.domicilio;

    this.personaMoralForm.patchValue({
      buscarRfcPMN: '',
      rfcPMN: contribuyente.rfc,
      denominacionPMN: contribuyente.razon_social,
      correoPMN: contribuyente.correo_electronico,
      paisPMN: pais.clave,
      codigoPostalPMN: cp,
      estadoPMN: entidad_federativa.clave,
      municipioPMN: delegacion_municipio.clave,
      localidadPMN: localidad.nombre,
      coloniaPMN: colonia.clave,
      callePMN: calle,
      numeroExteriorPMN: num_exterior,
      numeroInteriorPMN: num_interior,
    });
    this.buscarMunicipio(entidad_federativa.clave);
    this.buscarColonias(delegacion_municipio.clave);
  }

  /**
   * Busca los municipios según la clave del estado.
   * @param {string} cveEstado - La clave del estado.
   * @returns {void}
   */
  buscarMunicipio(cveEstado?: string): void {
    if (cveEstado) {
      this.transportacionMaritimaService
        .obtenerMunicipios(cveEstado)
        .subscribe((res) => {
          this.municipio = res.datos || [];
        });
    }
  }

  /**
   * Busca las colonias correspondientes a un municipio dado.
   * @param cveMunicipio Clave del municipio para obtener sus colonias.
   */
  buscarColonias(cveMunicipio?: string): void {
    if (cveMunicipio) {
      this.transportacionMaritimaService
        .obtenerColonias(cveMunicipio)
        .subscribe((res) => {
          this.colonia = res.datos || [];
        });
    }
  }

  /**
   * Agrega una nueva persona moral nacional a la tabla.
   * @param {PersonaMoralNacionalForm} personaMoralNacionalFormDatos - Los datos de la persona moral nacional a agregar.
   * @returns {void}
   */
  agregarPMN(personaMoralNacionalFormDatos: PersonaMoralNacionalForm): void {
    this.esFormValido = true;
    this.errorFormulario = '';

    if (
      !personaMoralNacionalFormDatos.denominacionPMN ||
      !this.esFormDirectorValido()
    ) {
      this.personaMoralForm.markAllAsTouched();
      this.esFormValido = false;
      this.errorFormulario = ERROR_FORMA_ALERT;
      return;
    }
    const TABLA = [...this.personaMoralNacionalTabla];

    const DUPLICADO = TABLA.some(
      (persona, idx) =>
        persona.denominacionPMN ===
        personaMoralNacionalFormDatos.denominacionPMN &&
        (!this.esModificacion || idx !== this.indexEdicion)
    );

    if (DUPLICADO) {
      this.esFormValido = false;
      this.errorFormulario = ERROR_NOMBRE_EXISTE(
        'RFC',
        personaMoralNacionalFormDatos.denominacionPMN
      );
      return;
    }
    const PFN = this.mapearRegistroPFE(personaMoralNacionalFormDatos);

    if (this.esModificacion && this.indexEdicion !== null) {
      TABLA[this.indexEdicion] = PFN;
    } else {
      TABLA.push(PFN);
    }

    this.personaMoralNacionalTabla = TABLA;
    this.tramite40201Store.setTramite40201State({
      personaMoralNacionalTabla: TABLA,
    });
    this.actualizarFormularioState();
    this.limpiarDatosPMN();
    this.cerrarModal();
  }

  /**
   * Mapea los datos del formulario a la estructura que usa la tabla, agregando descripciones legibles.
   * @param datos Datos de entrada de tipo PersonaMoralNacionalForm.
   * @returns Registro mapeado con campos de descripción y domicilio calculado.
   */
  private mapearRegistroPFE(
    datos: PersonaMoralNacionalForm
  ): PersonaMoralNacionalForm {
    const PAIS = this.obtenerDescripcionCatalogo(
      this.pais,
      datos.paisPMN || ''
    );
    const EDO = this.obtenerDescripcionCatalogo(
      this.estado,
      datos.estadoPMN || ''
    );
    const MUNICIPIO = this.obtenerDescripcionCatalogo(
      this.municipio,
      datos.municipioPMN || ''
    );
    const COLONIA = this.obtenerDescripcionCatalogo(
      this.colonia,
      datos.coloniaPMN || ''
    );

    return {
      ...datos,
      paisDesc: PAIS,
      estadoDesc: EDO,
      municipioDesc: MUNICIPIO,
      coloniaDesc: COLONIA,
      directorNombreCompleto: `${datos.nombreDirectorGeneral} ${datos.apellidoPaternoDirectorGeneral} ${datos.apellidoMaternoDirectorGeneral}`.trim(),
      domicilioPMN:
        `${datos.callePMN} ${datos.numeroExteriorPMN} ${MUNICIPIO} ${EDO} ${PAIS} ${datos.codigoPostalPMN}`.trim(),
    };
  }

  /**
   * Obtiene la descripción desde un catálogo a partir de su clave.
   * @param catalogo Arreglo de elementos del catálogo.
   * @param clave Clave a buscar en el catálogo.
   * @returns Descripción asociada a la clave o cadena vacía si no se encuentra.
   */
  obtenerDescripcionCatalogo(catalogo: Catalogo[], clave: string): string {
    if (!clave || !catalogo || catalogo.length === 0) {
      return '';
    }
    return catalogo.find((c) => c.clave === clave)?.descripcion || '';
  }

  /**
   * Actualiza el estado del formulario en el store.
   * @returns {void}
   * @description Este método se utiliza para actualizar el estado del formulario en el store de tramite40201.
   */
  actualizarFormularioState(): void {
    const VALUES = this.personaMoralForm.value;
    this.tramite40201Store.setTramite40201State(VALUES);
  }
  /**
   * Limpia los datos del formulario de persona moral nacional.
   * @returns {void}
   * @description Este método se utiliza para limpiar los datos del formulario de persona moral nacional.
   */
  limpiarDatosPMN(): void {
    this.itemsSeleccionados.clear();
    this.esFormValido = true;
    this.esModificacion = false;
    this.indexEdicion = null;
    this.errorFormulario = '';
    this.personaMoralForm.reset();
    this.actualizarFormularioState();
  }

  /**
   * verifica si el formulario de director general es válido.
   * @returns boolean - true si el formulario es válido, false en caso contrario.
   */
  esFormDirectorValido(): boolean {
    this.personaMoralForm.markAllAsTouched();
    const CONTROLES = [
      'nombreDirectorGeneral',
      'apellidoPaternoDirectorGeneral',
    ];
    for (const CONTROL of CONTROLES) {
      if (esControlValido(this.personaMoralForm, CONTROL)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Maneja la selección de filas desde la tabla dinámica (selección mediante checkbox).
   * @param filasSeleccionadas Arreglo con las filas seleccionadas a procesar.
   */
  onFilasSeleccionadas(filasSeleccionadas: PersonaMoralNacionalForm[]): void {
    // Limpiar selecciones previas
    this.itemsSeleccionados.clear();
    // Agregar nuevas selecciones
    filasSeleccionadas.forEach((materia) => {
      const INDEX = this.personaMoralNacionalTabla.findIndex(
        (m) => m.denominacionPMN === materia.denominacionPMN
      );
      if (INDEX !== -1) {
        this.itemsSeleccionados.add(INDEX);
        this.indexEdicion = INDEX;
      }
    });
  }

  /**
   * Elimina los periodos seleccionados de la tabla de solicitudes.
   * @method eliminarPersonaPorId
   */
  public eliminarPersonaPorId(): void {
    if (this.personaMoralNacionalTabla.length === 0) {
      this.mostrarAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Sin informacion.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else if (
      this.personaMoralNacionalTabla.length > 0 &&
      this.itemsSeleccionados.size === 0
    ) {
      this.mostrarAlerta = true;
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona un registro.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    } else {
      this.mostrarAlerta = false;
      this.mostrarInfo = true;
      this.nuevaNotificacionInfo = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: '¿Deseas borrar el(los) elemento(s) seleccionado(s)?.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
    }
  }

  /**
   * Cierra la alerta modal.
   * @method aceptar
   */
  aceptar(): void {
    this.mostrarAlerta = false;
  }

  /**
   * Maneja la acción de aceptar en la información mostrada.
   * @param event Evento que indica si se aceptó la acción.
   */
  aceptarInfo(event: boolean): void {
    if (event) {
      this.mostrarInfo = false;

      if (this.itemsSeleccionados.size === 0) {
        return;
      }
      // Convertir a array y ordenar de mayor a menor para eliminar correctamente
      const INDICES_A_ELIMINAR = Array.from(this.itemsSeleccionados).sort(
        (a, b) => b - a
      );
      INDICES_A_ELIMINAR.forEach((index) => {
        this.personaMoralNacionalTabla.splice(index, 1);
      });
      this.itemsSeleccionados.clear();
      this.personaMoralNacionalTabla = [...this.personaMoralNacionalTabla];

      this.tramite40201Store.update({
        personaMoralNacionalTabla: this.personaMoralNacionalTabla,
      });
    }
  }

  /**
   * Inicia el flujo para modificar la persona seleccionada en la tabla.
   * Si hay exactamente una selección, carga sus datos en el formulario para edición.
   */
  modificarPersona(): void {
    this.esModificacion = true;
    if (this.itemsSeleccionados.size !== 1) {
      this.mostrarAlerta = true;
    } else {
      const INDEX = Array.from(this.itemsSeleccionados)[0];
      const PFE_A_MODIFICAR = this.personaMoralNacionalTabla[INDEX];
      this.personaMoralForm.patchValue(PFE_A_MODIFICAR);
    }
  }

  /**
   * Prepara el formulario para agregar una nueva persona (reseteo y modo no modificación).
   */
  agregarPersona(): void {
    this.esModificacion = false;
    this.limpiarDatosPMN();
  }

  /**
   * Cierra el modal.
   *
   * @returns {void}
   */
  cerrarModal(): void {
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  /**
   * Establece los valores en el store de tramite40201.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: keyof TransportacionMaritima40201State
  ): void {
    const VALOR = form.get(campo)?.value;
    this.tramite40201Store.setTramite40201State({ [campo]: VALOR });
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}
