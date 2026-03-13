/* eslint-disable @typescript-eslint/naming-convention */
import {
  CAAT_REGISTRADO_EMPRESA_ENCABEZADO_DE_TABLA,
  ModalPaso,
  OPCIONES_DE_BOTON_DE_RADIO,
  TEXTOS,
  TIPCAAT,
  TIPCAAT_DESC,
} from '../../constantes/transportacion-maritima.enum';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmpresaMaritima, MAP_EMPRESA } from '../../constantes/mappers';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputRadioComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TablePaginationComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { PersonaFisicaExtranjeraForm, PersonaFisicaNacionalForm, PersonaMoralExtranjeraForm, PersonaMoralNacionalForm } from '../../models/transportacion-maritima.model';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite40201Store,
  TransportacionMaritima40201State,
} from '../../estados/store/tramite40201.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { EmpresasCaat } from './../../models/contributente.model';
import { Tramite40201Query } from '../../estados/query/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';

/**
 * Componente para buscar empresas CAAT.
 */
@Component({
  selector: 'app-buscar-empresa-caat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    TablePaginationComponent,
    NotificacionesComponent
  ],
  templateUrl: './buscar-empresa-caat.component.html',
  styleUrl: './buscar-empresa-caat.component.css',
})
export class BuscarEmpresaCaatComponent implements OnInit, OnDestroy {
  /**
   * Número total de elementos devueltos por la búsqueda.
   * Se usa para controlar la paginación.
   */
  public totalItems: number = 0;
  /** Cantidad de elementos por página */
  public itemsPerPage: number = 5;
  /** página actual */
  public currentPage: number = 1;
  /**
   * Formulario reactivo para buscar empresas CAAT.
   */
  empresaForm!: FormGroup;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Vista seleccionada por el usuario.
   */
  vista: string = '1';

  /**
   * Texto de la sección.
   */
  TEXTOS = TEXTOS;

  /**
   * Configuración para el encabezado de la tabla de CAAT registrado empresa.
   */
  caatRegistradoEmpresaEncabezadoDeTabla =
    CAAT_REGISTRADO_EMPRESA_ENCABEZADO_DE_TABLA;

  /**
   * Tabla de datos de CAAT registrado empresa.
   */
  caatRegistradoEmpresaTabla: EmpresasCaat[] = [];

  /**
   * Empresas CAAT paginadas según la página y elementos por página.
   */
  caatEmpresaPaginada: EmpresasCaat[] = [];

  /**
   * Configuración de tabla para selección de tipo checkbox.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Estado de la solicitud.
   */
  public transportacionMaritimaState!: TransportacionMaritima40201State;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();
  /**
   * Indica si el formulario es de solo lectura.
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Lista de empresas seleccionadas.
   */
  empresasSeleccionadas: EmpresasCaat[] = [];

  /**
   * Indica si se debe mostrar la alerta modal.
   */
  mostrarAlerta: boolean = false;

  /**
   * Enum para tipo de CAAT.
   */
  tipoMaritimo: TIPCAAT = TIPCAAT.MA;

  /**
    * Notificación para mostrar alertas generales.
    * @property {Notificacion} nuevaNotificacion
    */
  public nuevaNotificacion: Notificacion = {} as Notificacion;

  /**
  * Notificación para mostrar alertas generales.
  * @property {Notificacion} nuevaNotificacion
  */
  public nuevaNotificacionInfo: Notificacion = {} as Notificacion;


  /**
   * Cola de mensajes de error que se mostrarán en el modal.
   */
  colaErrores: string[] = [];
  /**
   * Cola de empresas que requieren confirmación antes de asignar.
   */
  colaConfirmaciones: EmpresasCaat[] = [];
  /**
   * Paso actual del modal (por ejemplo 'ERROR' o 'CONFIRMACION').
   */
  pasoActual: ModalPaso = null;
  /**
   * Empresa actualmente en proceso de confirmación.
   */
  empresaConfirmacionActual?: EmpresasCaat;
  /**
   * Indica si se debe mostrar el modal de información/confirmación.
   */
  mostrarInfo: boolean = false;

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
   * Suscribe a los cambios en el estado de la sección y crea el formulario reactivo.
   */
  ngOnInit(): void {
    this.tramite40201Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
        })
      )
      .subscribe();
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
      this.crearTipoDeEmpresaForm();
    }
  }

  /**
   * Guarda los datos del formulario y habilita o deshabilita el formulario según el estado de solo lectura.
   * @returns {void}
   * @description Este método se utiliza para guardar los datos del formulario y habilitar o deshabilitar el formulario según el estado de solo lectura.
   */
  guardarDatosFormulario(): void {
    this.crearTipoDeEmpresaForm();
    if (this.esFormularioSoloLectura) {
      this.empresaForm.disable();
    } else {
      this.empresaForm.enable();
    }
  }
  /**
   * Inicializa el formulario reactivo
   * @returns {void}
   */
  crearTipoDeEmpresaForm(): void {
    this.empresaForm = this.fb.group({
      tipoDeEmpresa: ['1'],
      buscarPorRFCNa: ['', [Validators.maxLength(20)]],
      buscarPorDenominacionNa: ['', [Validators.maxLength(50)]],
      folioCaatBusquedaNa: ['', [Validators.maxLength(50)]],
      buscarPorDenominacionEx: ['', [Validators.maxLength(50)]],
      folioCaatBusquedaEx: ['', [Validators.maxLength(50)]],
    });
  }

  /**
   * Obtiene el formulario de tipo de empresa.
   * @returns {FormGroup} El formulario de tipo de empresa.
   */
  get tipoDeEmpresa(): FormGroup {
    return this.empresaForm.get('tipoDeEmpresa') as FormGroup;
  }

  /**
   * Obtiene el formulario de tipo de empresa nacional.
   * @returns {FormGroup} El formulario de tipo de empresa nacional.
   */
  get tipoDeEmpresaNacional(): FormGroup {
    return this.empresaForm.get('tipoDeEmpresaNacional') as FormGroup;
  }

  /**
   * Obtiene el formulario de tipo de empresa extranjera.
   * @returns {FormGroup} El formulario de tipo de empresa extranjera.
   */
  get tipoDeEmpresaExtranjera(): FormGroup {
    return this.empresaForm.get('tipoDeEmpresaExtranjera') as FormGroup;
  }

  /**
   * Método que se ejecuta cuando el usuario selecciona una opción de tipo de empresa.
   * @returns {void}
   * @param valor - Valor seleccionado por el usuario.
   * @description Este método se ejecuta cuando el usuario selecciona una opción de tipo de empresa.
   */
  enCambioDeValor(valor: string): void {
    if (valor === '1') {
      this.empresaForm.get('buscarPorDenominacionEx')?.reset();
      this.empresaForm.get('folioCaatBusquedaEx')?.reset();
    } else {
      this.empresaForm.get('buscarPorRFCNa')?.reset();
      this.empresaForm.get('buscarPorDenominacionNa')?.reset();
      this.empresaForm.get('folioCaatBusquedaNa')?.reset();
    }
    this.vista = valor;
    this.tipoDeEmpresa.get('tipoDeEmpresaOpcion')?.setValue(valor);
  }


  /**
   * Obtiene la lista de empresas CAAT registradas.
   * @returns {void}
   * @description Este método se utiliza para obtener la lista de empresas CAAT registradas.
   */
  obtenerBuscarEmpresaCaat(): void {
    this.caatEmpresaPaginada = [];
    const EXTRANJERO = this.empresaForm.get('tipoDeEmpresa')?.value === '2';
    let rfc, razonSocial, caat;

    if (EXTRANJERO) {
      razonSocial = this.empresaForm.get('buscarPorDenominacionEx')?.value;
      caat = this.empresaForm.get('folioCaatBusquedaEx')?.value;
    } else {
      rfc = this.empresaForm.get('buscarPorRFCNa')?.value;
      caat = this.empresaForm.get('folioCaatBusquedaNa')?.value;
      razonSocial = this.empresaForm.get('buscarPorDenominacionNa')?.value;
    }

    this.transportacionMaritimaService
      .obtenerBuscarEmpresaCaat(EXTRANJERO, rfc, razonSocial, caat)
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (result) => {
          if (!this.validarBusquedaEmpresa(result.datos)) {
            return;
          }
          const TABLA_DATOS = result.datos;
          this.caatRegistradoEmpresaTabla = TABLA_DATOS;
          this.totalItems = TABLA_DATOS.length;
          this.updatePagination();
        },
      });
  }

  /**
   * Valida el resultado de la búsqueda de empresas CAAT.
   * @param empresas Lista de empresas retornadas por la búsqueda.
   * @returns `true` si la búsqueda es válida y contiene resultados aceptables, `false` en caso contrario.
   */
  validarBusquedaEmpresa(empresas: EmpresasCaat[]): boolean {
    if (empresas.length > 30) {
      this.mostrarAlertaModal('El número de registros es mayor a 30, especifique su busqueda.', 'Alerta');
      return false;
    } if (!empresas || empresas.length === 0) {
      this.mostrarAlertaModal('No hay resultados para el criterio de la busqueda.', 'Alerta');
      return false;
    }
    return true;
  }


  /**
   * Verifica si una empresa puede agregarse o si ya tiene perfiles/CAAT conflictivos.
   * @param empresa Empresa a validar.
   * @returns Un mensaje de error si existe un conflicto, o `null` si puede agregarse.
   */
  validarAgregarEmpresa(empresa: EmpresasCaat): string | null {
    const { razon_social, nombre, clave_folio_maritimo, fec_ini_vigencia } = empresa;
    const ES_MARITIMO = empresa.tipo_maritimo === this.tipoMaritimo;
    const CAAT_ES_MARITIMO = this.caatRegistradoEmpresaTabla.some(e =>
      e.clave_folio_maritimo === empresa.clave_folio_maritimo &&
      e.tipo_maritimo === this.tipoMaritimo
    );

    if (ES_MARITIMO || CAAT_ES_MARITIMO) {
      return `${razon_social ?? nombre}
      ya cuenta con el número de CAAT: ${clave_folio_maritimo}
      con perfil marítimo asociado desde ${fec_ini_vigencia}`;
    }
    return null;
  }


  /**
   * Recorre las empresas seleccionadas y genera colas de errores o confirmaciones
   * dependiendo de las validaciones aplicadas a cada empresa.
   */
  asignarEmpresas(): void {
    this.colaErrores = [];
    this.colaConfirmaciones = [];

    for (const EMPRESA of this.empresasSeleccionadas) {
      const ERROR = this.validarAgregarEmpresa(EMPRESA);

      if (ERROR) {
        this.colaErrores.push(ERROR);
      } else {
        this.colaConfirmaciones.push(EMPRESA);
      }
    }

    if (this.colaErrores.length > 0) {
      this.pasoActual = 'ERROR';
      this.mostrarSiguienteError();
    } else if (this.colaConfirmaciones.length > 0) {
      this.pasoActual = 'CONFIRMACION';
      this.mostrarSiguienteConfirmacion();
    }
  }

  /**
   * Muestra el siguiente mensaje de error de la cola `colaErrores` en un modal.
   * Si no quedan errores, avanza al flujo de confirmaciones.
   */
  mostrarSiguienteError(): void {
    if (this.colaErrores.length === 0) {
      this.mostrarAlerta = false;
      this.pasoActual = 'CONFIRMACION';
      this.mostrarSiguienteConfirmacion();
      return;
    }

    const MENSAJE = this.colaErrores.shift();

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: 'Alerta',
      mensaje: MENSAJE || '',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.mostrarAlerta = true;
  }


  /**
   * Muestra la siguiente empresa que requiere confirmación en `colaConfirmaciones`.
   * Prepara la `nuevaNotificacionInfo` con el mensaje correspondiente.
   */
  mostrarSiguienteConfirmacion(): void {
    if (this.colaConfirmaciones.length === 0) {
      this.mostrarInfo = false;
      return;
    }
    this.empresaConfirmacionActual = this.colaConfirmaciones.shift();
    const { rfc, razon_social, nombre, clave_folio_maritimo, tipo_maritimo, fec_ini_vigencia } = this.empresaConfirmacionActual!;
    const TIPO_CAAT = TIPCAAT_DESC[tipo_maritimo];
    const MENSAJE = `${razon_social ?? nombre ?? rfc} ya cuenta con el número de CAAT: ${clave_folio_maritimo} con perfil ${TIPO_CAAT} asociado desde ${fec_ini_vigencia}. Se asignará el perfil marítimo para el mismo número de CAAT.`;

    this.nuevaNotificacionInfo = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Alerta',
      mensaje: MENSAJE,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.mostrarInfo = true;
  }


  /**
   * Maneja la acción del usuario en el modal de información/confirmación.
   * @param event Indica si el usuario aceptó (`true`) o canceló (`false`).
   */
  aceptarInfo(event: boolean): void {
    this.mostrarInfo = false;

    if (event && this.empresaConfirmacionActual) {
      const EMPRESA_MAPPED = MAP_EMPRESA(this.empresaConfirmacionActual);
      this.agregarEmpresa(EMPRESA_MAPPED);
    }
    setTimeout(() => this.mostrarSiguienteConfirmacion());
  }


  /**
   * Acción para aceptar un mensaje de alerta del modal de errores
   * y continuar mostrando el siguiente error si existe.
   */
  aceptar(): void {
    this.mostrarAlerta = false;
    setTimeout(() => {
      this.mostrarSiguienteError();
    });
  }


  /**
   * Muestra el modal de alerta con el mensaje proporcionado.
   * @param mensaje mensaje a mostrar
   */
  mostrarAlertaModal(mensaje: string, titulo: string = ''): void {
    this.mostrarAlerta = true;
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Recibe la lista de empresas seleccionadas desde la tabla y la asigna al estado local.
   * @param empresaSeleccionada Array de empresas seleccionadas.
   */
  empresaSeleccionada(empresaSeleccionada: EmpresasCaat[]): void {
    this.empresasSeleccionadas = empresaSeleccionada;
  }

  /** Actualiza los elementos paginados según la página e ítems por página seleccionados */
  public updatePagination(): void {
    const STARTINDEX = (this.currentPage - 1) * this.itemsPerPage;
    const ENDINDEX = STARTINDEX + this.itemsPerPage;
    this.caatEmpresaPaginada = this.caatRegistradoEmpresaTabla.slice(
      STARTINDEX,
      ENDINDEX
    );
  }

  /**
   * Maneja el cambio de página
   * @param page Página seleccionada
   */
  public cambioDePagina(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  /**
   * Maneja el cambio de número de ítems por página
   * @param itemsPerPage Nuevo valor de ítems por página
   */
  public elementosPorCambioDePagina(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }



  /**
   * Agrega una empresa mapeada al store según su tipo (PFN, PMN, PME, PFE).
   * Evita duplicados mostrando una alerta si la empresa ya fue agregada.
   * @param empresa Empresa mapeada al formato de formulario.
   */
  agregarEmpresa(empresa: EmpresaMaritima): void {
    if (empresa.tipo === 'PFN') {
      const CAST_EMPRESA = empresa as PersonaFisicaNacionalForm;
      const EXISTE = this.transportacionMaritimaState.personaFisicaNacionalTabla
        .some(empresaGuardada => empresaGuardada.rfcPFN === CAST_EMPRESA.rfcPFN || empresaGuardada.nombreCompleto === CAST_EMPRESA.nombreCompleto);
      if (EXISTE) {
        this.mostrarAlertaModal('Usted ya agregó la empresa seleccionada', 'Alerta');
        return;
      }
      this.tramite40201Store.update({
        personaFisicaNacionalTabla: [
          ...this.transportacionMaritimaState.personaFisicaNacionalTabla,
          empresa as PersonaFisicaNacionalForm,
        ]
      });
    }
    if (empresa.tipo === 'PMN') {
      const CAST_EMPRESA = empresa as PersonaMoralNacionalForm;
      const EXISTE = this.transportacionMaritimaState.personaMoralNacionalTabla
        .some(empresaGuardada => empresaGuardada.rfcPMN === CAST_EMPRESA.rfcPMN);
      if (EXISTE) {
        this.mostrarAlertaModal('Usted ya agregó la empresa seleccionada', 'Alerta');
        return;
      }
      this.tramite40201Store.update({
        personaMoralNacionalTabla: [
          ...this.transportacionMaritimaState.personaMoralNacionalTabla,
          empresa as PersonaMoralNacionalForm,
        ]
      });
    }

    if (empresa.tipo === 'PME') {
      const CAST_EMPRESA = empresa as PersonaMoralExtranjeraForm;
      const EXISTE = this.transportacionMaritimaState.personaMoralExtranjeraTabla
        .some(empresaGuardada => empresaGuardada.denominacionPME === CAST_EMPRESA.denominacionPME);
      if (EXISTE) {
        this.mostrarAlertaModal('Usted ya agregó la empresa seleccionada', 'Alerta');
        return;
      }
      this.tramite40201Store.update({
        personaMoralExtranjeraTabla: [
          ...this.transportacionMaritimaState.personaMoralExtranjeraTabla,
          empresa as PersonaMoralExtranjeraForm,
        ]
      });
    }

    if (empresa.tipo === 'PFE') {
      const CAST_EMPRESA = empresa as PersonaFisicaExtranjeraForm;
      const EXISTE = this.transportacionMaritimaState.personaFisicaExtranjeraTabla
        .some(empresaGuardada => empresaGuardada.nombreCompleto === CAST_EMPRESA.nombreCompleto);
      if (EXISTE) {
        this.mostrarAlertaModal('Usted ya agregó la empresa seleccionada', 'Alerta');
        return;
      }
      this.tramite40201Store.update({
        personaFisicaExtranjeraTabla: [
          ...this.transportacionMaritimaState.personaFisicaExtranjeraTabla,
          empresa as PersonaFisicaExtranjeraForm,
        ]
      });
    }

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
