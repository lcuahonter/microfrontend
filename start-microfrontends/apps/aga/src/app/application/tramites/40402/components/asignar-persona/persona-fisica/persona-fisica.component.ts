import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Subject, map, merge, takeUntil } from 'rxjs';

import {
  Catalogo,
  CatalogoSelectComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_CORREO_ELECTRONICO,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import {
  ConsultaioQuery,
  ConsultaioState
} from '@ng-mf/data-access-user';

import { PersonaFisicaExtranjeraForm } from '../../../../40402/models/transportacion-maritima.model';
import { TransportacionMaritimaService } from '../../../../40402/services/transportacion-maritima/transportacion-maritima.service';

import {
  CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA,
  TEXTOS
} from '../../../constants/transportacion-maritima.enum';
import { Tramite40402Query } from '../../../estados/tramite40402.query';

import {
  Tramite40402Store,
  Tramitenacionales40402State
} from '../../../estados/tramite40402.store';


/**
 * Componente para gestionar la información de personas físicas extranjeras.
 */
@Component({
  selector: 'app-persona-fisica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    TooltipModule,
    NotificacionesComponent
],
  templateUrl: './persona-fisica.component.html',
  styleUrl: './persona-fisica.component.css',
})
export class PersonaFisicaComponent implements OnInit, OnDestroy {
  /**
   * Índice del registro seleccionado en la tabla.
   * Se utiliza para identificar el registro a modificar o eliminar.
   */
  indiceSeleccionado: number | null = null;

  /**
   * Configuración de la tabla de selección.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Almacena las filas seleccionadas para eliminación múltiple
   */
  selectedRows: PersonaFisicaExtranjeraForm[] = [];
  
  /**
   * Formulario reactivo para gestionar la información de personas físicas extranjeras.
   */
  personaFisicaExtranjeraForm!: FormGroup;

  /**
   * Catálogos para los selectores.
   */
  pais!: Catalogo[];

  /**
   * Configuración para el encabezado de tabla de personas físicas extranjeras.
   */
  configuracionParaPFEEncabezadoDeTabla = CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA;

  /**
   * Tabla de datos de personas físicas extranjeras.
   * @description Esta tabla almacena la información de las personas físicas extranjeras que se han agregado.
   */
  personaFisicaExtranjeraTabla: PersonaFisicaExtranjeraForm[] = [];

  /**
   * Texto de aviso de privacidad simplificado.
   */
  TEXTOS = TEXTOS;

  /**
   * Referencia al botón de cerrar el modal.
   * Se utiliza para cerrar el modal de edición/agregado.
   */
  @ViewChild('cerrarModal') cerrarModal!: ElementRef;

  /**
   * Estado de la solicitud.
   */
  public transportacionMaritimaState!: Tramitenacionales40402State;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
    indiceSeleccionado: number | null = null;
   * @description
   * Datos de consulta del trámite almacenados en el estado global.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} esDatosRespuesta
   * @description
   * Bandera que indica si los datos ya fueron obtenidos y se deben mostrar directamente.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * Alerta de notificación para mostrar mensajes al usuario.
   * @type {Notificacion}
   */
  public alertaNotificacion!: Notificacion;

  /**
   * Bandera para mostrar la notificación.
   */
  mostrarNotificacion: boolean = false;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param tramite40402Store Store para gestionar el estado del trámite 40402.
   * @param tramite40402Query Query para consultar el estado del trámite 40402.
   * @param transportacionMaritimaService Servicio para obtener catálogos de transporte marítimo.
   * @param consultaioQuery Query para consultar datos globales
   */
  constructor(
    private fb: FormBuilder,
    private tramite40402Store: Tramite40402Store,
    private tramite40402Query: Tramite40402Query,
    private transportacionMaritimaService: TransportacionMaritimaService,
    private consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    // El constructor se utiliza para la inyección de dependencias
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite40402Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
          this.personaFisicaExtranjeraTabla = seccionState.personaFisicaExtranjeraTabla || [];
        })
      )
      .subscribe();

    this.crearAgregarPFEForm();
    this.paisSeleccion();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Maneja la selección de filas de la tabla (para selección múltiple)
   */
  onFilasSeleccionadas(filas: PersonaFisicaExtranjeraForm[]): void {
    this.selectedRows = filas;
    if (filas.length === 0) {
      this.indiceSeleccionado = null;
    }
  }

  /**
   * Elimina los registros seleccionados de la tabla
   */
  eliminarRegistrosSeleccionados(): void {
    if (this.selectedRows.length === 0) {
      // Opcional: mostrar notificación de que no hay registros seleccionados
      return;
    }
    this.personaFisicaExtranjeraTabla = this.personaFisicaExtranjeraTabla.filter(
      item => !this.selectedRows.includes(item)
    );
    this.tramite40402Store.setPersonaFisicaExtranjeraTabla(this.personaFisicaExtranjeraTabla);
    this.selectedRows = [];
    this.indiceSeleccionado = null;
  }

  /**
   * Crea el formulario reactivo para agregar o editar personas físicas extranjeras.
   * @description Este método inicializa el formulario con los valores del estado de la solicitud.
   * @returns {void}
   */
  crearAgregarPFEForm(): void {
    this.personaFisicaExtranjeraForm = this.fb.group({
      seguroNumero: [
        this.transportacionMaritimaState?.seguroNumero,
        [
          Validators.required,
          Validators.maxLength(11)
        ]
      ],
      nombrePFE: [
        this.transportacionMaritimaState?.nombrePFE,
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],
      apellidoPaternoPFE: [
        this.transportacionMaritimaState?.apellidoPaternoPFE,
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],
      apellidoMaternoPFE: [
        this.transportacionMaritimaState?.apellidoMaternoPFE,
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],
      correoPFE: [
        this.transportacionMaritimaState?.correoPFE,
        [
          Validators.required,
          Validators.maxLength(320),
          Validators.pattern(REGEX_CORREO_ELECTRONICO)
        ]
      ],
      paisPFE: [
        this.transportacionMaritimaState?.paisPFE,
        Validators.required
      ],
      codigoPostalPFE: [
        this.transportacionMaritimaState?.codigoPostalPFE,
        [
          Validators.required,
          Validators.maxLength(12)
        ]
      ],
      ciudadPFE: [
        this.transportacionMaritimaState?.ciudadPFE,
        [
          Validators.required,
          Validators.maxLength(120)
        ]
      ],
      estadoPFE: [
        this.transportacionMaritimaState?.estadoPFE,
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],
      callePFE: [
        this.transportacionMaritimaState?.callePFE,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      numeroExteriorPFE: [
        this.transportacionMaritimaState?.numeroExteriorPFE,
        [
          Validators.required,
          Validators.maxLength(55)
        ]
      ],
      numeroInteriorPFE: [
        this.transportacionMaritimaState?.numeroInteriorPFE,
        [
          Validators.maxLength(55)
        ]
      ],
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   * @returns {void}
   */
  inicializaCatalogos(): void {
    const PAIS$ = this.transportacionMaritimaService
      .getPaisCatalogo()
      .pipe(
        map((resp) => {
          this.pais = resp.data;
        })
      );

    merge(
      PAIS$
    )
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe();
  }

  /**
   * Selecciona el país de la persona física extranjera y lo guarda en el store.
   * @description Este método se ejecuta cuando se selecciona un país en el formulario.
   * @returns {void}
   */
  paisSeleccion(): void {
    const PAIS = this.personaFisicaExtranjeraForm.get('paisPFE')?.value;
    this.tramite40402Store.setPaisPFE(PAIS);
  }

  /**
   * Agrega una nueva persona física extranjera a la tabla.
   * @description Este método se ejecuta al hacer clic en el botón "Agregar".
   * @param personaFisicaExtranjeraFormDatos - Datos del formulario a agregar
   * @returns {void}
   */
  agregarPFE(personaFisicaExtranjeraFormDatos: PersonaFisicaExtranjeraForm): void {
    this.personaFisicaExtranjeraForm.markAllAsTouched();
    this.personaFisicaExtranjeraForm.updateValueAndValidity();

    if (this.personaFisicaExtranjeraForm.valid) {
      const PAIS = this.pais?.find((pais) => pais.id === Number(personaFisicaExtranjeraFormDatos.paisPFE))?.descripcion;
      const REGISTRO = {
        nombrePFE: personaFisicaExtranjeraFormDatos.nombrePFE,
        apellidoPaternoPFE: personaFisicaExtranjeraFormDatos.apellidoPaternoPFE,
        apellidoMaternoPFE: personaFisicaExtranjeraFormDatos.apellidoMaternoPFE,
        seguroNumero: personaFisicaExtranjeraFormDatos.seguroNumero,
        estadoPFE: personaFisicaExtranjeraFormDatos.estadoPFE,
        correoPFE: personaFisicaExtranjeraFormDatos.correoPFE,
        paisPFE: PAIS || '',
        codigoPostalPFE: personaFisicaExtranjeraFormDatos.codigoPostalPFE,
        ciudadPFE: personaFisicaExtranjeraFormDatos.ciudadPFE,
        callePFE: personaFisicaExtranjeraFormDatos.callePFE,
        numeroExteriorPFE: personaFisicaExtranjeraFormDatos.numeroExteriorPFE,
        numeroInteriorPFE: personaFisicaExtranjeraFormDatos.numeroInteriorPFE,
        domicilioPFE: `${personaFisicaExtranjeraFormDatos.callePFE} ${personaFisicaExtranjeraFormDatos.numeroExteriorPFE} ${personaFisicaExtranjeraFormDatos.ciudadPFE} ${personaFisicaExtranjeraFormDatos.estadoPFE} ${PAIS} ${personaFisicaExtranjeraFormDatos.codigoPostalPFE}`.trim()
      };
      const NUEVO_CUERPO_TABLA = [...this.personaFisicaExtranjeraTabla];
      if (this.indiceSeleccionado !== null) {
        NUEVO_CUERPO_TABLA[this.indiceSeleccionado] = REGISTRO;
      } else {
        NUEVO_CUERPO_TABLA.push(REGISTRO);
      }
      this.personaFisicaExtranjeraTabla = NUEVO_CUERPO_TABLA;
      this.tramite40402Store.setPersonaFisicaExtranjeraTabla(this.personaFisicaExtranjeraTabla);
      this.limpiarDatosPFE();
      this.indiceSeleccionado = null;
      this.cerrarModalFunc();

      // Mostrar notificación después de cerrar modal
      setTimeout(() => {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'INFORMACION',
          modo: 'html',
          titulo: 'Alerta',
          mensaje: 'Datos guardados correctamente',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarNotificacion = true;
        this.cdr.detectChanges();
      }, 100);
    } else {
      // Mostrar notificación de alerta si el formulario no es válido
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'INFORMACION',
        modo: 'action',
        titulo: 'Formulario inválido',
        mensaje: 'Por favor verifique los campos obligatorios.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarNotificacion = true;
    }
}
    /**
     * Bandera para mostrar la notificación cuando ya existe un Alerta.
     * @type {boolean}
     */
  mostrarNotificacionYaAgregada: boolean = false;
    /**
     * Objeto de notificación que se muestra cuando ya existe un Alerta.
     * @type {Notificacion}
     */
  notificacionYaAgregada!: Notificacion;
  

  /**
   * Maneja el evento de clic en el botón "Agregar".
   * Si ya existe un registro, muestra una notificación en vez de abrir el modal.
   * @param event Evento de clic del botón
   * @returns {void}
   */
enAgregarClic(event: Event): void {
    if (this.personaFisicaExtranjeraTabla.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'INFORMACION',
        modo: 'action',
        titulo: 'Registro existente',
        mensaje: 'Ya ha sido agregada a la solicitud una persona física extranjera.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.mostrarNotificacion = true;
    } else {
      this.indiceSeleccionado = null;
    }
  }
  /**
   * Cierra el modal mediante programación.
   * @returns {void}
   */
  cerrarModalFunc(): void {
    // Blur the currently focused element (likely inside the modal)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (this.cerrarModal) {
      this.cerrarModal.nativeElement.click();
      // Move focus to notification button after modal closes for accessibility
      setTimeout(() => {
        const NOTIF_BTN = document.querySelector('.btn-aceptar-notificacion') as HTMLElement;
        if (NOTIF_BTN) { NOTIF_BTN.focus(); }
      }, 100);
    }
  }

  /**
   * Selecciona un registro de la tabla para modificar o eliminar.
   */
  /**
   * Selecciona un registro de la tabla para modificar o eliminar.
   * Puede recibir el índice o el objeto del registro.
   */
  seleccionarRegistro(registro: PersonaFisicaExtranjeraForm | number): void {
    if (typeof registro === 'number') {
      this.indiceSeleccionado = registro;
    } else {
      const INDICE = this.personaFisicaExtranjeraTabla.indexOf(registro);
      this.indiceSeleccionado = INDICE !== -1 ? INDICE : null;
    }
  }

  /**
   * Elimina el registro seleccionado de la tabla.
   */
  eliminarRegistro(): void {
    if (this.indiceSeleccionado !== null || this.selectedRows.length > 0) {
      const NOMBRES_A_ELIMINAR = new Set(this.selectedRows.map(p => p.nombrePFE).filter(Boolean));
      const NSS_A_ELIMINAR = new Set(this.selectedRows.map(p => p.seguroNumero).filter(Boolean));
      const COMBO_CORREO_NOMBRE_A_ELIMINAR = new Set(
        this.selectedRows
          .filter(p => p.correoPFE && p.nombrePFE)
          .map(p => `${p.correoPFE}|${p.nombrePFE}`)
      );

      this.personaFisicaExtranjeraTabla = this.personaFisicaExtranjeraTabla.filter(persona => {
        if (persona.nombrePFE && NOMBRES_A_ELIMINAR.has(persona.nombrePFE)) {
          return false;
        }
        if (persona.seguroNumero && NSS_A_ELIMINAR.has(persona.seguroNumero)) {
          return false;
        }
        if (persona.correoPFE && persona.nombrePFE) {
          const COMBO_ID = `${persona.correoPFE}|${persona.nombrePFE}`;
          if (COMBO_CORREO_NOMBRE_A_ELIMINAR.has(COMBO_ID)) {
            return false;
          }
        }
        return !this.selectedRows.includes(persona);
      });
      this.selectedRows = [];
      this.indiceSeleccionado = null;
      if (this.personaFisicaExtranjeraForm) {
        this.personaFisicaExtranjeraForm.reset();
      }
      this.tramite40402Store.setPersonaFisicaExtranjeraTabla(this.personaFisicaExtranjeraTabla);
      // Mostrar modal de confirmación después de la eliminación
      setTimeout(() => {
        const MODAL = document.getElementById('confirmarEliminados');
        if (MODAL) {
          interface BootstrapModal { show: () => void; }
          const BS_MODAL: BootstrapModal = new ((window as unknown) as { bootstrap: { Modal: new (el: HTMLElement) => BootstrapModal } }).bootstrap.Modal(MODAL);
          BS_MODAL.show();
        }
      }, 300);
    }
  }

  /**
   * Abre el modal de modificación con los datos pre-cargados.
   */
  modificarRegistro(): void {
    if (this.indiceSeleccionado !== null) {
      const REGISTRO = this.personaFisicaExtranjeraTabla[this.indiceSeleccionado];
      this.personaFisicaExtranjeraForm.patchValue({
        nombrePFE: REGISTRO.nombrePFE,
        apellidoPaternoPFE: REGISTRO.apellidoPaternoPFE,
        apellidoMaternoPFE: REGISTRO.apellidoMaternoPFE,
        seguroNumero: REGISTRO.seguroNumero,
        estadoPFE: REGISTRO.estadoPFE,
        correoPFE: REGISTRO.correoPFE,
        paisPFE: this.pais?.find(p => p.descripcion === REGISTRO.paisPFE)?.id ?? '',
        codigoPostalPFE: REGISTRO.codigoPostalPFE,
        ciudadPFE: REGISTRO.ciudadPFE,
        callePFE: REGISTRO.callePFE,
        numeroExteriorPFE: REGISTRO.numeroExteriorPFE,
        numeroInteriorPFE: REGISTRO.numeroInteriorPFE,
      });
      // Abrir modal (puede requerir lógica adicional si no se abre automáticamente)
    }
  }

  /**
   * Actualiza el estado del formulario en el store.
   * @description Sincroniza los valores del formulario con el estado global.
   * @returns {void}
   */
  actualizarFormularioState(): void {
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'nombrePFE', 'setNombrePFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'seguroNumero', 'setSeguroNumero');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'apellidoPaternoPFE', 'setApellidoMaternoPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'apellidoMaternoPFE', 'setApellidoMaternoPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'correoPFE', 'setCorreoPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'paisPFE', 'setPaisPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'codigoPostalPFE', 'setCodigoPostalPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'ciudadPFE', 'setCiudadPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'estadoPFE', 'setEstadoPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'callePFE', 'setCallePFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'numeroExteriorPFE', 'setNumeroExteriorPFE');
    this.setValoresStore(this.personaFisicaExtranjeraForm, 'numeroInteriorPFE', 'setNumeroInteriorPFE');
  }

  /**
   * Limpia los datos del formulario de persona física extranjera.
   * @returns {void}
   */
  limpiarDatosPFE(): void {
    this.personaFisicaExtranjeraForm.reset();
    this.actualizarFormularioState();
  }

  /**
   * Cierra el modal mediante programación.
   * @returns {void}
   */

  /**
   * Establece valores en el store del trámite.
   * @param form - Instancia del FormGroup
   * @param campo - Nombre del campo en el formulario
   * @param metodoNombre - Nombre del método en el store a invocar
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite40402Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite40402Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * @description Cancela todas las suscripciones activas.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }

  /**
   * Inicializa el estado del formulario (habilitado/deshabilitado) basado en el modo de solo lectura.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.personaFisicaExtranjeraForm?.disable();
    } else {
      this.personaFisicaExtranjeraForm?.enable();
    }
  }

  /**
   * Verifica si el control 'idSocioComercial' tiene el validador 'Validators.required'.
   *
   * @returns {boolean} `true` si el control es obligatorio, de lo contrario `false`.
   */
  // eslint-disable-next-line class-methods-use-this
  isRequired(form: FormGroup, field: string): boolean | null {
    const CONTROL = form.get(field) as FormControl;
    if (CONTROL) {
      const ERROR_PATTERN = CONTROL.hasError('required');
      return ERROR_PATTERN && CONTROL.touched;
    }
    return false;
  }

}