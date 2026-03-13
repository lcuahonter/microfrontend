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
  ERROR_NOMBRE_EXISTE,
} from './../../constantes/transportacion-maritima.enum';
import {
  CONFIGURACION_PARA_ENCABEZADO_DE_TABLA,
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
import { PersonaFisicaNacionalForm } from '../../models/transportacion-maritima.model';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { Tramite40201Query } from '../../estados/query/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';

/**
 * Componente para gestionar la información de personas físicas nacionales.
 */
@Component({
  selector: 'app-persona-fisica-nacional',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    NotificacionesComponent,
  ],
  templateUrl: './persona-fisica-nacional.component.html',
  styleUrl: './persona-fisica-nacional.component.css',
})
export class PersonaFisicaNacionalComponent implements OnInit, OnDestroy {
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

  esModificacion: boolean = false;

  indexEdicion: number | null = null;

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
   * Formulario reactivo para gestionar la información de personas físicas nacionales.
   */
  personaFisicaForm!: FormGroup;

  /**
   * País.
   * @type {Catalogo[]}
   * @description Catálogos para los campos de selección en el formulario.
   */
  pais!: Catalogo[];

  /**
   * Estado.
   * @type {Catalogo[]}
   * @description Catálogos para los campos de selección en el formulario.
   */
  estado!: Catalogo[];

  /**
   * Municipio.
   * @type {Catalogo[]}
   * @description Catálogos para los campos de selección en el formulario.
   */
  municipio!: Catalogo[];

  /**
   * Colonia.
   * @type {Catalogo[]}
   * @description Catálogos para los campos de selección en el formulario.
   */
  colonia!: Catalogo[];

  /**
   * Configuración para el encabezado de la tabla.
   */
  configuracionParaEncabezadoDeTabla = CONFIGURACION_PARA_ENCABEZADO_DE_TABLA;

  /**
   * Tabla de datos de personas físicas nacionales.
   * @type {PersonaFisicaNacionalForm[]}
   * @description Almacena la información de las personas físicas nacionales.
   */
  personaFisicaNacionalTabla: PersonaFisicaNacionalForm[] = [];

  /**
   * Cadena que representa el aviso de privacidad simplificado.
   */
  TEXTOS = TEXTOS;

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
   * Tabla de selección para mostrar los datos de personas físicas nacionales.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Indica si el formulario es de solo lectura.
   * @type {boolean}
   * @description Esta propiedad se utiliza para determinar si el formulario debe ser editable o no.
   */
  esFormularioSoloLectura: boolean = false;

  /** Lista de elementos seleccionados en la tabla */
  itemsSeleccionados: Set<number> = new Set();

  /** Estado del botón borrar */
  borrarHabilitado = false;
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
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite40201Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
          this.personaFisicaNacionalTabla =
            seccionState.personaFisicaNacionalTabla || [];
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Crea el formulario reactivo para gestionar la información de personas físicas nacionales.
   */
  crearAgregarPFNForm(): void {
    this.personaFisicaForm = this.fb.group({
      buscarRfcPFN: ['', [Validators.required, Validators.maxLength(15)]],
      rfcPFN: [{ value: '', disabled: true }, [Validators.maxLength(13)]],
      nombrePFN: [{ value: '', disabled: true }, [Validators.maxLength(200)]],
      apellidoPaternoPFN: [
        { value: '', disabled: true },
        [Validators.maxLength(200)],
      ],
      apellidoMaternoPFN: [
        { value: '', disabled: true },
        [Validators.maxLength(200)],
      ],
      paisPFN: [{ value: '', disabled: true }],
      codigoPostalPFN: [
        { value: '', disabled: true },
        [Validators.maxLength(12)],
      ],
      estadoPFN: [{ value: '', disabled: true }],
      municipioPFN: [{ value: '', disabled: true }],
      localidadPFN: [
        { value: '', disabled: true },
        [Validators.maxLength(120)],
      ],
      coloniaPFN: [{ value: '', disabled: true }],
      callePFN: [{ value: '', disabled: true }, [Validators.maxLength(100)]],
      numeroExteriorPFN: [
        { value: '', disabled: true },
        [Validators.maxLength(55)],
      ],
      numeroInteriorPFN: [
        { value: '', disabled: true },
        [Validators.maxLength(55)],
      ],
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
      this.crearAgregarPFNForm();
    }
  }
  /**
   * Guarda los datos del formulario y habilita o deshabilita el formulario según el estado de solo lectura.
   * @returns {void}
   * @description Este método se utiliza para guardar los datos del formulario y habilitar o deshabilitar el formulario según el estado de solo lectura.
   */
  guardarDatosFormulario(): void {
    this.crearAgregarPFNForm();
    if (this.esFormularioSoloLectura) {
      this.personaFisicaForm.disable();
    } else {
      this.personaFisicaForm.enable();
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
   * @param {string} rfc - RFC del contribuyente a buscar.
   * @returns {void}
   * @description Este método se ejecuta cuando se busca un contribuyente por su RFC en el formulario.
   */
  buscarContribuyente(): void {
    this.esFormValido = true;
    if (this.personaFisicaForm.invalid) {
      this.personaFisicaForm.markAllAsTouched();
      this.esFormValido = false;
      this.errorFormulario = ERROR_FORMA_ALERT;
      return;
    }
    this.transportacionMaritimaService
      .buscarContribuyente(
        true,
        this.personaFisicaForm.get('buscarRfcPFN')?.value
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
          this.personaFisicaForm.get('buscarRfcPFN')?.reset();
        },
      });
  }

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
   * Obtiene y establece la lista de municipios para la clave de estado proporcionada.
   * @param cveEstado - Clave del estado para obtener los municipios.
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
   * Obtiene y establece la lista de colonias para la clave de municipio proporcionada.
   * @param cveMunicipio - Clave del municipio para obtener las colonias.
   */

  esControlInvalido(control: string): boolean {
    return esControlValido(this.personaFisicaForm, control) || false;
  }

  /**
   * Determina si un control del formulario es inválido y ha sido tocado.
   * @param control - Nombre del control dentro de `personaFisicaForm`.
   * @returns `true` si el control es inválido; de lo contrario `false`.
   */

  setContribuyenteDatosEnFormulario(contribuyente: Contribuyente): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {calle,colonia,cp,delegacion_municipio,entidad_federativa,localidad,num_exterior,num_interior,pais} = contribuyente.domicilio;

    this.personaFisicaForm.patchValue({
      buscarRfcPFN: '',
      rfcPFN: contribuyente.rfc,
      nombrePFN: contribuyente.nombre,
      apellidoPaternoPFN: contribuyente.apellido_paterno,
      apellidoMaternoPFN: contribuyente.apellido_materno,
      paisPFN: pais.clave,
      codigoPostalPFN: cp,
      estadoPFN: entidad_federativa.clave,
      municipioPFN: delegacion_municipio.clave,
      localidadPFN: localidad.nombre,
      coloniaPFN: colonia.clave,
      callePFN: calle,
      numeroExteriorPFN: num_exterior,
      numeroInteriorPFN: num_interior,
    });
    this.buscarMunicipio(entidad_federativa.clave);
    this.buscarColonias(delegacion_municipio.clave);
  }

  /**
   * Asigna los datos del contribuyente recuperado al formulario de persona física.
   * Rellena campos de RFC, nombre y domicilio y dispara la carga de municipios y colonias.
   * @param contribuyente - Objeto `Contributente` con la información a mapear.
   */

  /**
   * Agrega una nueva persona física nacional a la tabla.
   * @param {PersonaFisicaNacionalForm} personaFisicaFormDatos - Datos de la persona física nacional a agregar.
   * @returns {void}
   * @description Este método se ejecuta cuando se agrega una nueva persona física nacional en el formulario.
   */
  agregarPFN(personaFisicaFormDatos: PersonaFisicaNacionalForm): void {
    this.esFormValido = true;
    this.errorFormulario = '';
    if (!personaFisicaFormDatos.nombrePFN) {
      this.personaFisicaForm.markAllAsTouched();
      this.esFormValido = false;
      this.errorFormulario = ERROR_FORMA_ALERT;
      return;
    }

    const TABLA = [...this.personaFisicaNacionalTabla];

    const DUPLICADO = TABLA.some(
      (persona, idx) =>
        persona.rfcPFN === personaFisicaFormDatos.rfcPFN &&
        (!this.esModificacion || idx !== this.indexEdicion)
    );

    if (DUPLICADO) {
      this.esFormValido = false;
      this.errorFormulario = ERROR_NOMBRE_EXISTE(
        'RFC',
        personaFisicaFormDatos.rfcPFN
      );
      return;
    }

    const PFN = this.mapearRegistroPFE(personaFisicaFormDatos);
    if (this.esModificacion && this.indexEdicion !== null) {
      TABLA[this.indexEdicion] = PFN;
    } else {
      TABLA.push(PFN);
    }

    this.personaFisicaNacionalTabla = TABLA;
    this.tramite40201Store.setTramite40201State({
      personaFisicaNacionalTabla: TABLA,
    });
    this.actualizarFormularioState();
    this.limpiarDatosPFN();
    this.cerrarModal();
  }

  private mapearRegistroPFE(
    datos: PersonaFisicaNacionalForm
  ): PersonaFisicaNacionalForm {
    const PAIS = this.obtenerDescripcionCatalogo(
      this.pais,
      datos.paisPFN || ''
    );
    const EDO = this.obtenerDescripcionCatalogo(
      this.estado,
      datos.estadoPFN || ''
    );
    const MUNICIPIO = this.obtenerDescripcionCatalogo(
      this.municipio,
      datos.municipioPFN || ''
    );
    const COLONIA = this.obtenerDescripcionCatalogo(
      this.colonia,
      datos.coloniaPFN || ''
    );
    return {
      ...datos,
      nombreCompleto:
        `${datos.nombrePFN} ${datos.apellidoPaternoPFN} ${datos.apellidoMaternoPFN}`.trim(),
      paisDesc: PAIS,
      estadoDesc: EDO,
      municipioDesc: MUNICIPIO,
      coloniaDesc: COLONIA,
      domicilioPFN:
        `${datos.callePFN} ${datos.numeroExteriorPFN} ${MUNICIPIO} ${EDO} ${PAIS} ${datos.codigoPostalPFN}`.trim(),
    };
  }

  /**
   * Mapea los valores del formulario a la estructura usada en la tabla, agregando
   * descripciones legibles de catálogos y una representación del domicilio completo.
   * @param datos - Valores del formulario de tipo `PersonaFisicaNacionalForm`.
   * @returns Registro mapeado listo para mostrarse en la tabla.
   */

  // eslint-disable-next-line class-methods-use-this
  obtenerDescripcionCatalogo(catalogo: Catalogo[], clave: string): string {
    if (!clave || !catalogo || catalogo.length === 0) {
      return '';
    }
    return catalogo.find((c) => c.clave === clave)?.descripcion || '';
  }

  /**
   * Busca en un catálogo la descripción correspondiente a una clave.
   * @param catalogo - Array de `Catalogo` donde buscar.
   * @param clave - Clave cuyo `descripcion` se desea obtener.
   * @returns La descripción encontrada o cadena vacía si no existe.
   */

  /**
   * Actualiza el estado del formulario en el store.
   * @returns {void}
   * @description Este método se ejecuta para actualizar el estado del formulario en el store de tramite40201.
   */

  actualizarFormularioState(): void {
    const VALUES = this.personaFisicaForm.value;
    this.tramite40201Store.setTramite40201State(VALUES);
  }
  /**
   * Limpia los datos del formulario de persona física nacional.
   * @returns {void}
   * @description Este método se ejecuta para limpiar los datos del formulario de persona física nacional.
   */
  limpiarDatosPFN(): void {
    this.actualizarFormularioState();
    this.personaFisicaForm.reset();
    this.itemsSeleccionados.clear();
    this.esFormValido = true;
    this.esModificacion = false;
    this.indexEdicion = null;
    this.errorFormulario = '';
  }

  /**
   * Maneja la selección de filas desde la tabla dinámica (checkbox selection)
   */
  onFilasSeleccionadas(filasSeleccionadas: PersonaFisicaNacionalForm[]): void {
    // Limpiar selecciones previas
    this.itemsSeleccionados.clear();
    // Agregar nuevas selecciones
    filasSeleccionadas.forEach((materia) => {
      const INDEX = this.personaFisicaNacionalTabla.findIndex(
        (m) => m.rfcPFN === materia.rfcPFN
      );
      if (INDEX !== -1) {
        this.itemsSeleccionados.add(INDEX);
        this.indexEdicion = INDEX;
      }
    });
    // Actualizar estado del botón borrar
    this.borrarHabilitado = this.itemsSeleccionados.size > 0;
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
   * Elimina los periodos seleccionados de la tabla de solicitudes.
   * @method eliminarPersonaPorId
   */
  public eliminarPersonaPorId(): void {
    if (this.personaFisicaNacionalTabla.length === 0) {
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
      this.personaFisicaNacionalTabla.length > 0 &&
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
        this.personaFisicaNacionalTabla.splice(index, 1);
      });
      this.itemsSeleccionados.clear();
      this.personaFisicaNacionalTabla = [...this.personaFisicaNacionalTabla];

      this.tramite40201Store.update({
        personaFisicaNacionalTabla: this.personaFisicaNacionalTabla,
      });
    }
  }

  modificarPersona(): void {
    this.esModificacion = true;
    if (this.itemsSeleccionados.size !== 1) {
      this.mostrarAlerta = true;
    } else {
      const INDEX = Array.from(this.itemsSeleccionados)[0];
      const PFE_A_MODIFICAR = this.personaFisicaNacionalTabla[INDEX];
      this.personaFisicaForm.patchValue(PFE_A_MODIFICAR);
    }
  }

  /**
   * Prepara el formulario para modificar la persona seleccionada.
   * Si no hay exactamente una selección, muestra una alerta.
   */

  agregarPersona(): void {
    this.esModificacion = false;
    this.limpiarDatosPFN();
  }

  /**
   * Inicializa el formulario para agregar una nueva persona física nacional.
   * Restablece el estado de modificación y limpia los datos previos.
   */

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
