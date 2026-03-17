import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

import { CAAT_CANDIDATO_MODIFICAR_ENCABEZADO_DE_TABLA, CAAT_REGISTRADO_EMPRESA_ENCABEZADO_DE_TABLA, OPCIONES_DE_BOTON_DE_RADIO, TEXTOS } from '../../constantes/modificacion-transportacion-maritima.enum';
import { Catalogo, InputRadioComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, LoginQuery } from '@ng-mf/data-access-user';
import { Tramite40202Store, TransportacionMaritima40202State } from '../../estados/tramite40202.store';
import { ModificacionTransportacionMaritimaService } from '../../services/modificacion-transportacion-maritima/modificacion-transportacion-maritima.service';
import { PersonaCaat } from '../../models/empresa-caat.model';
import { PersonaMoralExtranjeraComponent } from "../../components/persona-moral-extranjera/persona-moral-extranjera.component";
import { PersonaMoralNacionalComponent } from '../../components/persona-moral-nacional/persona-moral-nacional.component';
import { TransportistaMaritimo } from '../../models/modificar-empresa.model';

/**
 * Componente para modificar CAAT marítimo.
 */
@Component({
  selector: 'app-modificar-caat-maritimo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
    PersonaMoralNacionalComponent,
    PersonaMoralExtranjeraComponent
  ],
  templateUrl: './modificar-caat-maritimo.component.html',
  styleUrl: './modificar-caat-maritimo.component.scss',
})
export class ModificarCaatMaritimoComponent implements OnDestroy {
  /**
   * Formulario reactivo para buscar empresas CAAT.
   */
  buscarEmpresaForm!: FormGroup;

  /**
   * Empresa CAAT a modificar.
   */
  empresaAmodificar!: PersonaCaat;


  /**
   * Catálogos para los selectores.
   */
  pais!: Catalogo[];

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Vista seleccionada por el usuario.
   */
  vista: string | number = '';

  /**
   * Texto de la sección.
   */
  TEXTOS = TEXTOS;

  /**
   * Configuración para el encabezado de la tabla de CAAT registrado empresa.
   */
  caatRegistradoEmpresaEncabezadoDeTabla = CAAT_REGISTRADO_EMPRESA_ENCABEZADO_DE_TABLA;

  /**
   * Configuración para el encabezado de la tabla de candidato a modificar CAAT.
   */
  candidatoModificarCaatEncabezadoDeTabla = CAAT_CANDIDATO_MODIFICAR_ENCABEZADO_DE_TABLA;

  /**
   * Tabla de datos de CAAT registrado empresa.
   */
  caatRegistradoEmpresaTabla: PersonaCaat[] = [];

  /**
   * Tabla de datos de candidato a modificar CAAT.
   */
  candidatoModificarCaatTabla: PersonaCaat[] = [];

  /**
   * Configuración de tabla para selección de tipo checkbox.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Estado de la solicitud.
   */
  public transportacionMaritimaState!: TransportacionMaritima40202State;

  /**
   * Referencia al botón de cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Referencia al modal de agregar persona física extranjera.
   */
  @ViewChild('modal-agregar-pfe', { static: false }) modalAgregarPFE!: ElementRef;

  /**
   * Bandera para mostrar el botón de agregar seleccionado.
   */
  mostrarAgregarSeleccionado: boolean = true;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Elemento modal para mostrar información adicional.
   */
  modalElemento!: HTMLElement | null;

  /**
   * Instancia del modal de agregar persona física extranjera.
   */
  modalAgregarPFEInstance!: Modal;

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaAlertaNotificacion!: Notificacion;

  /**
   * Notificación para mostrar mensajes de selección al usuario.
   */
  public nuevaAlertaSeleccionNotificacion!: Notificacion;

  /**
   * @property {boolean} formularioDeshabilitado
   * @description Indica si el formulario está deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @property {boolean} mostrarError
   * @description Indica si se debe mostrar un mensaje de error.
   */
  mostrarError: boolean = false;



  /**
  * Referencia al elemento del DOM del modal para  agregar mercancías.
  */
  @ViewChild('modalAgregarEmpresa') modalElement!: ElementRef;


  /**
   * Referencia al elemento del DOM del modal para  agregar empresa extranjera.
   */
  @ViewChild('modalAgregarEmpresaExtranjera') modalElementExtranjero!: ElementRef;

  /**
   * Empresas seleccionadas en la tabla.
   */
  empresasSeleccionadas: PersonaCaat[] = [];

  /**
   * RFC del usuario logueado.
   */
  rfcLogueado: string = '';

  /**
   * Indica si se debe mostrar la información de notificación.
   */
  mostrarInfo: boolean = false;
  /**
   * Notificación de información.
   */
  nuevaNotificacionInfo!: Notificacion;
  /**
   * Empresas a modificar seleccionadas.
   */
  empresasAmodificarSeleccionadas: PersonaCaat[] = [];



  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param tramite40202Store Store para gestionar el estado del trámite 40202.
   * @param tramite40202Query Query para consultar el estado del trámite 40202.
   * @param consultaioQuery - Query para consultar el estado de la consulta.
   * @param transportacionMaritimaService Servicio para obtener los catálogos y datos relacionados con los transportacion marítima.
   */
  constructor(
    private fb: FormBuilder,
    private tramite40202Store: Tramite40202Store,
    private consultaioQuery: ConsultaioQuery,
    private modificacionTransportacionMaritimaService: ModificacionTransportacionMaritimaService,
    private loginQuery: LoginQuery
  ) {
    this.obtenerEstadoLogin();
    // Inicializar el formulario principal
    this.crearTipoDeEmpresaForm();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.inicializaCatalogos();
  }

  /**
   * Inicializa el formulario reactivo
   * @returns {void}
   */
  crearTipoDeEmpresaForm(): void {
    this.buscarEmpresaForm = this.fb.group({
      tipoDeEmpresa: ['1', Validators.required],
      razonSocialRFC: [''],
      rfc: [''],
      caat: ['']
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Obtiene el estado del usuario logueado.
   * @method obtenerEstadoLogin
   */
  obtenerEstadoLogin(): void {
    this.loginQuery.select().subscribe(res => {
      this.rfcLogueado = res.rfc || '';
    });
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario `personaFisicaExtranjeraForm & buscarEmpresaForm` basado en si el formulario está deshabilitado o no.
   * Si el formulario está deshabilitado, se deshabilita el campo `personaFisicaExtranjeraForm & buscarEmpresaForm`.
   * Si no está deshabilitado, se habilita el campo `personaFisicaExtranjeraForm & buscarEmpresaForm`.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
      this.buscarEmpresaForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.buscarEmpresaForm.enable();
    }
  }


  /**
   * Abre el modal para agregar una empresa seleccionada.
   */
  agregarEmpresa(): void {
    if (this.empresasSeleccionadas.length > 1) {
      this.abrirAlertaModal('Selecciona solo un elemento.');
    } else {
      this.empresaAmodificar = this.empresasSeleccionadas[0];
      if (this.empresaAmodificar.extranjero) {
        this.abrirModalEmpresaExtranjera();
      } else {
        this.abrirModalEmpresa();
      }
    }
  }

  /**
   * Abre el modal de agregar/editar domicilios.
   */
  abrirModalEmpresa(): void {
    const MODAL = new Modal(this.modalElement.nativeElement);
    MODAL.show();
  }

  /**
  * Cierra el modal de agregar/editar domicilios y limpia la selección actual en la tabla.
  */
  cerrarModal(): void {
    const MODAL = Modal.getInstance(this.modalElement.nativeElement);
    MODAL?.hide();
  }


  /**
   * Abre el modal de agregar/editar domicilios.
   */
  abrirModalEmpresaExtranjera(): void {
    const MODAL = new Modal(this.modalElementExtranjero.nativeElement);
    MODAL.show();
  }

  /**
  * Cierra el modal de agregar/editar domicilios y limpia la selección actual en la tabla.
  */
  cerrarModalExtranjero(): void {
    const MODAL = Modal.getInstance(this.modalElementExtranjero.nativeElement);
    MODAL?.hide();
  }


  /**
   * Actualiza la lista de empresas seleccionadas en la tabla.
   * @param empresas - Array de empresas seleccionadas.
   */
  onSelectEmpresaCaatRegistrada(empresas: PersonaCaat[]): void {
    this.empresasSeleccionadas = [...empresas];
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  inicializaCatalogos(): void {
    const PAIS$ = this.modificacionTransportacionMaritimaService
      .obtenerPaises()
      .pipe(
        map((resp) => {
          this.pais = resp.datos || [];
        })
      );

    merge(
      PAIS$
    )
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe();
  }


  /**
   * Método que se ejecuta cuando el usuario selecciona una opción de tipo de empresa.
   * @returns {void}
   * @param valor - Valor seleccionado por el usuario.
   * @description Este método se ejecuta cuando el usuario selecciona una opción de tipo de empresa.
   */
  enCambioDeValor(valor: string | number): void {
    this.vista = valor;
    this.caatRegistradoEmpresaTabla = [];
    this.empresasSeleccionadas = [];
  }

  /**
   * Método que se ejecuta al hacer clic en el botón de buscar empresa.
   * @returns {void}
   * @description Este método se ejecuta cuando el usuario hace clic en el botón de buscar empresa.
   */
  buscarEmpresa(): void {
    const EXTRANJERO = this.buscarEmpresaForm.get('tipoDeEmpresa')?.value === '2';
    const RFC = this.buscarEmpresaForm.get('rfc')?.value;
    const RAZON_SOCIAL_RFC = this.buscarEmpresaForm.get('razonSocialRFC')?.value;
    const CAAT = this.buscarEmpresaForm.get('caat')?.value;
    this.modificacionTransportacionMaritimaService.obtenerBuscarEmpresaCaat(this.rfcLogueado, EXTRANJERO, RFC, RAZON_SOCIAL_RFC, CAAT)
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe(res => (this.caatRegistradoEmpresaTabla = res.datos || []));
  }


  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   * 
   * @param {number} i - El índice del elemento a eliminar.
   * 
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
  abrirAlertaModal(mensaje: string): void {
    this.nuevaAlertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Alerta',
      mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
  }

  /**
   * Muestra una alerta de selección de elemento.
   * @description Este método se ejecuta cuando no se selecciona ningún elemento en la tabla de empresas CAAT registradas.
   * @returns {void}
   */
  abrirAlertaSeleccionModal(): void {
    this.nuevaAlertaSeleccionNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Alerta',
      mensaje: 'Selecciona un elemento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
  }

  /**
   * Muestra un modal específico.
   * @param id - El ID del modal que se va a mostrar.
   * @returns {void}
   */
  mostrarModal(id: string): void {
    this.modalElemento = document.getElementById(id);
    if (this.modalElemento) {
      const MODAL = Modal.getOrCreateInstance(this.modalElemento);
      MODAL.show();
    }
  }


  /**
   * Método para validar el formulario.
   * @returns {boolean} Verdadero si el formulario es válido, falso en caso contrario.
   */
  validarFormulario(): boolean {
    if (this.candidatoModificarCaatTabla.length === 0) {
      this.mostrarError = true;
      return false;
    }
    this.mostrarError = false;
    return true;
  }

  /**
   * Recibe la empresa seleccionada desde la tabla y abre el modal correspondiente para modificarla.
   */
  modificarSeleccionado(): void {
    this.empresaAmodificar = this.candidatoModificarCaatTabla[0];
    if (this.empresaAmodificar.extranjero) {
      this.abrirModalEmpresaExtranjera();
    } else {
      this.abrirModalEmpresa();
    }
  }


  /**
   * recibe la empresa modificada desde el componente hijo y la muestra en consola.
   * @param empresaModificada empresa modificada
   */
  agregarSeleccionado(empresaModificada: PersonaCaat): void {
    this.construyePersonaCaatDesdeFormulario(empresaModificada);
    this.candidatoModificarCaatTabla = [empresaModificada];
    if (empresaModificada.extranjero) {
      this.cerrarModalExtranjero();
    } else {
      this.cerrarModal();
    }
  }


  /**
   * Mapea los datos del formulario a la estructura de PersonaCaat y actualiza el store.
   * @param empresaModificada empresa modificada
   */
  construyePersonaCaatDesdeFormulario(empresaModificada: PersonaCaat): void {
    const EMPRESA_MODIFICADA: TransportistaMaritimo = {
      id_persona_solicitud: empresaModificada.idPersonaCaat || 0,
      persona_moral: empresaModificada.moral || false,
      boolean_extranjero: empresaModificada.extranjero || false,
      nombre: empresaModificada.nombre,
      apellido_paterno: empresaModificada.apellidoPaterno,
      apellido_materno: empresaModificada.apellidoMaterno,
      rfc: empresaModificada.rfc,
      nss: empresaModificada.nss,
      correo_electronico: empresaModificada.correoElectronico,
      razon_social: empresaModificada.razonSocial,
      domicilio_calle: empresaModificada.calle,
      domicilio: {
        calle: empresaModificada.calle,
        numero_exterior: empresaModificada.numeroExterior,
        numero_interior: empresaModificada.numeroInterio,
        codigo_postal: empresaModificada.codigoPostal,
        ciudad: empresaModificada.ciudad,
        informacion_extra: empresaModificada.informacionExtra,
        colonia: empresaModificada.claveColonia,
        delegacion_municipio: empresaModificada.claveDelegacionMunicipio,
        entidad_federativa: empresaModificada.claveEntidad,
        pais: empresaModificada.clavePais
      }
    };

    if (empresaModificada.moral && (empresaModificada.nombreDirector || empresaModificada.directorApellidoMaterno)) {
      EMPRESA_MODIFICADA.director_general = {
        nombre: empresaModificada.nombreDirector,
        apellido_paterno: empresaModificada.directorApellidoPaterno,
        apellido_materno: empresaModificada.directorApellidoMaterno
      };
    }
    const TRANSPORTES = [EMPRESA_MODIFICADA]
    this.tramite40202Store.update({
      transportistas_maritimos: TRANSPORTES
    });
  }


  /**
   * cierra el modal correspondiente según si la empresa es extranjera o no.
   * @param esExtranjero bandera que indica si la empresa es extranjera.
   */
  cerrarModalEvent(esExtranjero: boolean): void {
    if (esExtranjero) {
      this.cerrarModalExtranjero();
    } else {
      this.cerrarModal();
    }
  }


  /**
  * Pregunta al usuario si desea borrar el domicilio seleccionado.
  * @returns nada
  */
  preguntarBorrarEmpresa(): void {
    if (this.empresasAmodificarSeleccionadas.length === 0) {
      return;
    }
    this.mostrarInfo = true;
    this.nuevaNotificacionInfo = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }


  /**
   * maneja el evento de selección de candidatos a modificar CAAT.
   * @param event evento con la lista de personas CAAT seleccionadas.
   */
  onSelectCandidatos(event: PersonaCaat[]): void {
    this.empresasAmodificarSeleccionadas = event;
  }

  /**
  * Maneja la acción de aceptar en la información mostrada.
  * @param event Evento que indica si se aceptó la acción.
  */
  aceptarInfo(event: boolean): void {
    if (event) {
      this.mostrarInfo = false;
      this.candidatoModificarCaatTabla = [];
      this.empresasAmodificarSeleccionadas = [];
    } else {
      this.mostrarInfo = false;
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