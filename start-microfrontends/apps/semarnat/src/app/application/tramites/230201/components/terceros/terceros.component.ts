import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Catalogo, Solicitud230201State, Tramite230201Store } from '../../estados/tramite230201.store';
import {
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DESTINARIO_INFO, DESTINATARIO_TABLA_CONFIGURACION, DestinatarioConfiguracionItem, NACIONALIDAD_OPCIONES, TIPO_PERSONA_OPCIONES } from '../../../230201/enum/destinatario-tabla.enum';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MetaInfo } from '../../models/datos-tramite.model';
import { PhytosanitaryExportacionService } from '../../services/phytosanitary-exportacion.service';
import { Tramite230201Query } from '../../estados/tramite230201.query';

/**
 * Componente que gestiona los datos relacionados con terceros en el trámite "230201".
 * Incluye la configuración de formularios, tablas dinámicas y la interacción con servicios
 * relacionados con autorizaciones de vida silvestre.
 */
@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrl: './terceros.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    NotificacionesComponent
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
   * Estado actual de la solicitud "230201".
   * Este estado se actualiza al suscribirse al observable selectSolicitud$.
   */
  solicitudState!: Solicitud230201State;

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

  /**
   * @property moduloEmergente
   * @description Indica si el módulo emergente está activo.
   */
  public moduloEmergente: boolean = false;

  /**
   * @property nuevaNotificacion
   * @description Objeto que contiene la configuración de la notificación a mostrar.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property isEditMode
   * @description Indica si el formulario está en modo edición (true) o modo agregar (false).
   */
  public isEditMode: boolean = false;


  /**
   * Constructor del componente TercerosComponent.
   * Inicializa los servicios y dependencias necesarias para gestionar el estado
   * y los datos relacionados con terceros.
   */
  constructor(
    private phytosanitaryReexportacionService: PhytosanitaryExportacionService,
    private tramite230201Store: Tramite230201Store,
    private tramite230201Query: Tramite230201Query,
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
    this.tramite230201Query.selectSolicitud$
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
      

      this.agregarMercanciasForm?.get('nacionalidad')?.disable();
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
      nacionalidad: [{ value: 'extranjero', disabled: true }],
      tipoPersona: ['', Validators.required],
      razonSocial: ['', Validators.maxLength(250)],
      nombre: ['', Validators.maxLength(200)],
      apellidoPaterno: ['', Validators.maxLength(200)],
      apellidoMaterno: [''],
      codigoPostal: ['', [Validators.required, Validators.maxLength(12)]],
      paisSinMexico: [''],
      pais: ['', Validators.required],
      descripcionPais: [''],
      ciudad: ['', [Validators.required]],
      domicilio: ['', [Validators.required, Validators.maxLength(1000)]],
    });

   
    if (this.solicitudState?.destinatarios?.length > 0) {
      this.filaSeleccionada.push(this.solicitudState.destinatarios[0]);
    }
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
    const MATERNO_APELLIDO = this.agregarMercanciasForm.get('apellidoMaterno');
    const DENOMINACION_RAZON = this.agregarMercanciasForm.get('razonSocial');
    if (IS_FISICA) {
      NOMBRES?.setValidators([Validators.required, Validators.maxLength(200)]);
      PRIMER_APELLIDO?.setValidators([Validators.required, Validators.maxLength(200)]);
      MATERNO_APELLIDO?.setValidators([Validators.maxLength(200)]); // No required for apellido materno
      DENOMINACION_RAZON?.clearValidators();
    } else {
      NOMBRES?.clearValidators();
      PRIMER_APELLIDO?.clearValidators();
      MATERNO_APELLIDO?.clearValidators();
      DENOMINACION_RAZON?.setValidators([Validators.required, Validators.maxLength(250)]);
    }

    NOMBRES?.updateValueAndValidity();
    PRIMER_APELLIDO?.updateValueAndValidity();
    MATERNO_APELLIDO?.updateValueAndValidity();
    DENOMINACION_RAZON?.updateValueAndValidity();
  }

  /**
   * Maneja los cambios en la entidad federativa seleccionada.
   * Abre un modal si la entidad federativa es válida.
   */
  manejarCambioEntidadFederativa(): void {
    this.modalRef = this.modalService.show(this.agregarModal, { class: 'modal-lg' });
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
      this.tramite230201Store.setTercerosPopupState(this.popupAbierto);
    }
  }

  /**
   * Cierra el popup.
   */
  cerrarPopup(): void {
    this.popupAbierto = false;
    this.popupCerrado = false;
    this.tramite230201Store.setTercerosPopupState(this.popupAbierto);
    this.tramite230201Store.setTercerosPopupState(this.popupCerrado);
  }

  /**
   * Abre un modal con el contenido proporcionado.
   * @param template La plantilla del modal.
   */
  abrirModal(template: TemplateRef<unknown>): void {
    this.isEditMode = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  /**
   * Abre un modal para editar datos si hay una fila seleccionada.
   * Si no hay filas seleccionadas, muestra una notificación de alerta.
   * @param template La plantilla del modal.
   */
  editDataModal(template: TemplateRef<unknown>): void {
    if (this.filaSeleccionada?.length > 0) {
      this.isEditMode = true;
      this.agregarMercanciasForm.patchValue(this.filaSeleccionada[0]);
      this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    } else {
      this.eliminarMercanciaNotification();
    }
  }

  /**
   * Muestra una notificación de alerta cuando no se ha seleccionado ningún registro para modificar.
   */
  eliminarMercanciaNotification(): void {
    const SELECTED_DATA = this.filaSeleccionada;
    const TABLE_DATA = this.solicitudState.destinatarios;
    
    let mensaje = 'Selecciona sólo un registro para modificar.';
    
    // Si no hay registros en la tabla
    if (!TABLE_DATA || TABLE_DATA.length === 0) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }
    // Si no hay registros seleccionados pero hay registros en la tabla
    else if (!SELECTED_DATA || SELECTED_DATA.length === 0) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }
    // Si hay múltiples registros seleccionados
    else if (SELECTED_DATA.length > 1) {
      mensaje = 'Selecciona sólo un registro para modificar.';
    }
    
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.moduloEmergente = true;
  }

  /**
   * Maneja la confirmación del modal de notificación.
   * @param _confirmacion Indica si se confirmó o canceló la acción.
   */
  eliminarPedimento(_confirmacion: boolean): void {
    this.moduloEmergente = false;
  }

  /**
   * Cierra el modal y restablece el formulario.
   */
  cerrarModal(): void {
    this.agregarMercanciasForm.markAsUntouched();
    this.agregarMercanciasForm.updateValueAndValidity();
    this.agregarMercanciasForm.reset();
    this.isEditMode = false;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  /**
   * Elimina las filas seleccionadas de la tabla y restablece el formulario.
   */
  eliminarSeleccionados(): void {
 
    const CURRENT_DESTINATARIOS = [...this.solicitudState.destinatarios];
    const FILTERED_DESTINATARIOS = CURRENT_DESTINATARIOS.filter(
      (destinatario) => !this.filaSeleccionada.includes(destinatario)
    );
    
  
    this.tramite230201Store.setDatosDestinatario(FILTERED_DESTINATARIOS);
    
 
    this.filaSeleccionada = [];
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
      const DATA = this.agregarMercanciasForm.getRawValue(); 
      const TABLE_DATA = {
        ...DATA,
        paisStr: this.paisesDatos.find((pais) => pais.id === DATA.pais)?.descripcion,
      };
      
   
      const CURRENT_DESTINATARIOS = [...this.solicitudState.destinatarios];
      
      if (this.isEditMode && this.filaSeleccionada.length > 0) {

        const INDEX = CURRENT_DESTINATARIOS.findIndex(
          (destinatario) => destinatario === this.filaSeleccionada[0]
        );
        if (INDEX !== -1) {
          CURRENT_DESTINATARIOS[INDEX] = TABLE_DATA;
        }
      } else {
        CURRENT_DESTINATARIOS.push(TABLE_DATA);
      }
      
      // Actualizar la tienda con la lista nueva/actualizada
      this.tramite230201Store.setDatosDestinatario(CURRENT_DESTINATARIOS);
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