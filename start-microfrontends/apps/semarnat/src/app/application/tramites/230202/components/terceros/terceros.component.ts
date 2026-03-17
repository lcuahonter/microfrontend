import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Catalogo, Solicitud230202State, Tramite230202Store } from '../../estados/tramite230202.store';
import {
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputRadioComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DESTINARIO_INFO, DESTINATARIO_TABLA_CONFIGURACION, DestinatarioConfiguracionItem, NACIONALIDAD_OPCIONES, TIPO_PERSONA_OPCIONES } from '../../../230202/enum/destinatario-tabla.enum';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MetaInfo } from '../../models/datos-tramite.model';
import { PhytosanitaryReexportacionService } from '../../services/phytosanitary-reexportacion.service';
import { Tramite230202Query } from '../../estados/tramite230202.query';

/**
 * Componente que gestiona los datos relacionados con terceros en el trámite "230202".
 * Incluye la configuración de formularios, tablas dinámicas y la interacción con servicios
 * relacionados con autorizaciones de vida silvestre.
 */
@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    CatalogoSelectComponent
  ],
  providers: [BsModalService],
})
export class TercerosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para capturar la entidad federativa del destinatario.
   */
  formularioDestinatario!: FormGroup;

  /**
   * Una instancia de FormGroup utilizada para gestionar los controles del formulario
   * y la validación para agregar "mercancías" en la aplicación.
   */
  agregarMercanciasForm!: FormGroup;

  /**
   * Estado actual de la solicitud "230202".
   * Este estado se actualiza al suscribirse al observable selectSolicitud$.
   */
  solicitudState!: Solicitud230202State;

  /**
   * Observable utilizado para limpiar las suscripciones al destruir el componente.
   */
  notificadorDestruccion$ = new Subject<void>();

  /**
   * Indica si el popup está abierto.
   */
  popupAbierto = false;

  /**
   * Indica si el popup está cerrado.
   */
  popupCerrado = true;

  /**
   * Configuración de las columnas de la tabla de terceros.
   * Define cómo se mostrarán los datos en la tabla.
   */
  configuracionColumnas: ConfiguracionColumna<DestinatarioConfiguracionItem>[] = DESTINATARIO_TABLA_CONFIGURACION;

  /**
   * Tipo de selección de la tabla (por ejemplo, selección por checkbox).
   */
  tipoSeleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Datos que se mostrarán en la tabla de terceros.
   * Inicialmente está vacío y se llena al cambiar la entidad federativa.
   */
  datosTabla: DestinatarioConfiguracionItem[] = [];

  /**
   * Indica si el botón de modificar está habilitado.
   */
  botonModificarHabilitado: boolean = false;

  /**
   * Datos de catálogo de países.
   * @property {Catalogo[]} paisesDatos
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * Un arreglo que contiene las filas seleccionadas de tipo `DestinatarioConfiguracionItem`.
   * Esto se utiliza para gestionar los elementos seleccionados en el contexto del componente.
   */
  filaSeleccionada: DestinatarioConfiguracionItem[] = [];


  /**
   * Referencia al elemento del modal de Bootstrap.
   * @property {ElementRef} modalRef
   */
  modalRef!: BsModalRef | null;

  /**
   * Referencia al elemento del modal de Bootstrap para agregar mercancías.
   * @property {TemplateRef} agregarModal
   */
  @ViewChild('modalAgregarMercancias', { static: false }) agregarModal!: TemplateRef<Element>;

  /**
   * Opciones disponibles para el tipo de persona.
   * Estas opciones se utilizan en el formulario para seleccionar si el destinatario
   * es una persona física o moral.
   * 
   * @type {typeof TIPO_PERSONA_OPCIONES}
   */
  tipoPersona = TIPO_PERSONA_OPCIONES;

  /**
   * Opciones disponibles para la nacionalidad.
   * Estas opciones se utilizan en el formulario para seleccionar la nacionalidad del destinatario.
   * 
   * @type {typeof NACIONALIDAD_OPCIONES}
   */
  nacionalidad = NACIONALIDAD_OPCIONES;

  /**
   * Información meta utilizada para configurar los campos del formulario.
   * Contiene etiquetas y configuraciones específicas para los campos relacionados con el destinatario.
   * 
   * @type {MetaInfo}
   */
  metaInfo: MetaInfo = DESTINARIO_INFO;

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
  soloLectura: boolean = false;
  destinatarios: never[] | undefined;

  /**
   * Constructor del componente TercerosComponent.
   * Inicializa los servicios y dependencias necesarias para gestionar el estado
   * y los datos relacionados con terceros.
   */
  constructor(
    private phytosanitaryReexportacionService: PhytosanitaryReexportacionService,
    private tramite230202Store: Tramite230202Store,
    private tramite230202Query: Tramite230202Query,
    private consultaioQuery: ConsultaioQuery,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa los catálogos de datos de terceros, se suscribe al estado de la solicitud
   * y crea el formulario del destinatario.
   */
  ngOnInit(): void {
    this.tramite230202Query.selectSolicitud$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((state) => {
          this.solicitudState = state;
        })
      )
      .subscribe();

    this.crearFormularioDestinatario();
    this.cargarDatos();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.updateEstadoFormulario();
        })
      )
      .subscribe();

    this.updateEstadoFormulario();
  }


  /**
   * Actualiza el estado de los formularios del componente según el modo de solo lectura.
   *
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los formularios asociados
   * (`solicitudForm`, `agregarMercanciasForm`, `exportacionForm`, y `datosMercancia`).
   * Si es falsa, habilita dichos formularios para permitir la edición.
   */
  updateEstadoFormulario(): void {
    if (this.soloLectura) {
      this.formularioDestinatario?.disable();
      this.agregarMercanciasForm?.disable();
    } else {
      this.formularioDestinatario?.enable();
      this.agregarMercanciasForm?.enable();
    }
  }

  /**
   * Recupera varias listas de datos del servicio `phytosanitaryReexportacionService` y
   * las asigna a propiedades locales.
   */
  cargarDatos(): void {
    this.phytosanitaryReexportacionService
      .getMetaInfo()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((req) => {
        this.metaInfo = req.datos;
      });

    this.phytosanitaryReexportacionService
      .getPais()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((req) => {
        this.paisesDatos = req.data;
      });
  }

  /**
   * Crea el formulario reactivo para capturar la entidad federativa del destinatario.
   * Inicializa el valor del formulario con el estado actual de la solicitud.
   */
  crearFormularioDestinatario(): void {
    this.formularioDestinatario = this.formBuilder.group({});
    this.agregarMercanciasForm = this.formBuilder.group({
      nacionalidad: [{ value: 'nacional', disabled: true }, Validators.required],
      entidadFederativa: ['', Validators.required],
      tipoPersona: ['', Validators.required],
      razonSocial: ['', Validators.maxLength(250)],
      nombre: ['', Validators.maxLength(200)],
      apellidoPaterno: ['', Validators.maxLength(200)],
      apellidoMaterno: [''],
      codigoPostal: ['', [Validators.required, Validators.maxLength(15)]],
      paisSinMexico: [''],
      pais: ['', Validators.required],
      descripcionPais: [''],
      ciudad: ['', [Validators.required, Validators.maxLength(120)]],
      domicilio: ['', Validators.required],
    });

    this.filaSeleccionada.push(this.solicitudState.destinatarios[0]);
  }

  /**
   * Maneja el cambio en el tipo de persona (física o moral) y actualiza las validaciones
   * del formulario en consecuencia.
   * @param event El valor seleccionado para el tipo de persona.
   */
  onTipoPersonaChange(event: unknown): void {
    const IS_FISICA = event === 'fisica';
    const NOMBRES = this.agregarMercanciasForm.get('nombre');
    const PRIMER_APELLIDO = this.agregarMercanciasForm.get('apellidoPaterno');
    const SEGUNDO_APELLIDO = this.agregarMercanciasForm.get('segundoApellido');
    const DENOMINACION_RAZON = this.agregarMercanciasForm.get('razonSocial');
    if (IS_FISICA) {
      NOMBRES?.setValidators([Validators.required, Validators.maxLength(200)]);
      PRIMER_APELLIDO?.setValidators([Validators.required, Validators.maxLength(200)]);
      SEGUNDO_APELLIDO?.setValidators([Validators.required, Validators.maxLength(200)]);
      DENOMINACION_RAZON?.clearValidators();
    } else {
      NOMBRES?.clearValidators();
      PRIMER_APELLIDO?.clearValidators();
      SEGUNDO_APELLIDO?.clearValidators();
      DENOMINACION_RAZON?.setValidators([Validators.required, Validators.maxLength(250)]);
    }

    NOMBRES?.updateValueAndValidity();
    PRIMER_APELLIDO?.updateValueAndValidity();
    SEGUNDO_APELLIDO?.updateValueAndValidity();
    DENOMINACION_RAZON?.updateValueAndValidity();
  }

  /**
   * Maneja los cambios en la entidad federativa seleccionada.
   * Abre un modal si la entidad federativa es válida.
   */
  manejarCambioEntidadFederativa(): void {
    if (this.modalRef) {
      this.modalRef = this.modalService.show(this.agregarModal, { class: 'modal-lg' });
    }
  }

  /**
   * Maneja la fila seleccionada en la tabla de terceros.
   * Habilita o deshabilita el botón de modificar según la selección.
   * @param filaSeleccionada Las filas seleccionadas en la tabla.
   */
  manejarFilaSeleccionada(filaSeleccionada: DestinatarioConfiguracionItem[]): void {
    this.botonModificarHabilitado = filaSeleccionada.length > 0;
    this.filaSeleccionada = filaSeleccionada;
  }

  /**
   * Abre el popup si el botón de modificar está habilitado.
   */
  abrirPopup(): void {
    if (this.botonModificarHabilitado) {
      this.popupAbierto = true;
      this.tramite230202Store.setTercerosPopupState(this.popupAbierto);
    }
  }

  /**
   * Cierra el popup.
   */
  cerrarPopup(): void {
    this.popupAbierto = false;
    this.popupCerrado = false;
    this.tramite230202Store.setTercerosPopupState(this.popupAbierto);
    this.tramite230202Store.setTercerosPopupState(this.popupCerrado);
  }

  /**
   * Abre un modal con el contenido proporcionado.
   * @param template La plantilla del modal.
   */
  abrirModal(template: TemplateRef<unknown>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  /**
   * Abre un modal para editar datos si hay una fila seleccionada.
   * @param template La plantilla del modal.
   */
  editDataModal(template: TemplateRef<unknown>): void {
    if (this.filaSeleccionada?.length > 0) {
      this.agregarMercanciasForm.patchValue(this.filaSeleccionada[0]);
      this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    }
  }

  /**
   * Cierra el modal y restablece el formulario.
   */
  cerrarModal(): void {
    this.agregarMercanciasForm.markAsUntouched();
    this.agregarMercanciasForm.updateValueAndValidity();
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  /**
   * Elimina las filas seleccionadas de la tabla y restablece el formulario.
   */
  eleminarSeleccionados(): void {
    this.datosTabla = [];
    this.filaSeleccionada = [];
    this.tramite230202Store.setDatosDestinatario(this.datosTabla);
    this.agregarMercanciasForm.reset();
    this.formularioDestinatario.reset();
    this.botonModificarHabilitado = false;
  }

  /**
   * Guarda los datos del destinatario en la tabla y actualiza el estado del almacén.
   */
  guardarDestinatario(): void {
    this.agregarMercanciasForm.markAllAsTouched();
    this.agregarMercanciasForm.updateValueAndValidity();

    if (this.agregarMercanciasForm.valid) {
      const DATA = this.agregarMercanciasForm.value;
      const TABLE_DATA = {
        ...DATA,
        paisStr: this.paisesDatos.find((pais) => pais.id === DATA.pais)?.descripcion,
      };
      if (this.datosTabla.length > 0) {
        this.datosTabla.pop();
      }
      this.datosTabla.push(TABLE_DATA);
      this.tramite230202Store.setDatosDestinatario(this.datosTabla);
      this.cerrarModal();
    }
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param controlName El nombre del control del formulario.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(controlName: string): boolean | null {
    const CONTROL = this.agregarMercanciasForm.get(controlName);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : null;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}