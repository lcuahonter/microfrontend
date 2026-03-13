import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, Notificacion, NotificacionesComponent, REGEX_CORREO_ELECTRONICO, TablaSeleccion } from '@ng-mf/data-access-user';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Catalogo, CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CONFIGURACION_PARA_PME_ENCABEZADO_DE_TABLA } from '../../../constants/transportacion-maritima.enum';
import { PersonaMoralExtranjeraForm } from '../../../../40402/models/transportacion-maritima.model';
import { TEXTOS } from '../../../constants/transportacion-maritima.enum';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite40402Query } from '../../../estados/tramite40402.query';
import { Tramite40402Store } from '../../../estados/tramite40402.store';
import { Tramitenacionales40402State } from '../../../estados/tramite40402.store';
import { TransportacionMaritimaService } from '../../../../40402/services/transportacion-maritima/transportacion-maritima.service';

/**
 * Componente para la gestión de información de personas morales extranjeras.
 */
@Component({
  selector: 'app-persona-moral',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    NotificacionesComponent
],
  templateUrl: './persona-moral.component.html',
  styleUrl: './persona-moral.component.css',
})
export class PersonaMoralComponent implements OnInit, OnDestroy {
  /**
   * Almacena las filas seleccionadas para eliminación múltiple
   */
  filasSeleccionadas: PersonaMoralExtranjeraForm[] = [];
  /**
   * Maneja la selección de filas de la tabla (para selección múltiple)
   */
  onFilasSeleccionadas(filas: PersonaMoralExtranjeraForm[]): void {
    this.filasSeleccionadas = filas;
    if (filas.length === 0) {
      this.indiceSeleccionado = null;
    }
  }

  /**
   * Elimina los registros seleccionados de la tabla
   */
  eliminarRegistrosSeleccionados(): void {
    if (this.filasSeleccionadas.length === 0) {
      // Opcional: mostrar notificación de que no hay registros seleccionados
      return;
    }
    this.personaMoralExtranjeraTabla = this.personaMoralExtranjeraTabla.filter(
      item => !this.filasSeleccionadas.includes(item)
    );
    this.tramite40402Store.setPersonaMoralExtranjeraTabla(this.personaMoralExtranjeraTabla);
    this.filasSeleccionadas = [];
    this.indiceSeleccionado = null;
    // Mostrar modal de confirmación después de la eliminación
    setTimeout(() => {
      const MODAL = document.getElementById('confirmarEliminados');
    if (MODAL) {
        const WIN = window as unknown as { bootstrap: { Modal: new (modal: HTMLElement) => { show: () => void } } };
        const BS_MODAL: { show: () => void } = new WIN.bootstrap.Modal(MODAL);
        BS_MODAL.show();
      }
    }, 300);
  }
  /**
   * Configuración de la tabla de selección.
   * Utiliza el enum TablaSeleccion para la lógica de selección en la tabla.
   */
  TablaSeleccion = TablaSeleccion;
  /**
   * Índice del registro seleccionado en la tabla.
   * Se utiliza para identificar el registro a modificar o eliminar.
   */
  indiceSeleccionado: number | null = null;

  /**
   * Formulario reactivo para gestionar la información de personas morales extranjeras.
   * Utiliza FormGroup para la validación y manejo de datos.
   */
  personaMoralExtranjeraForm!: FormGroup;

  /**
   * Catálogo de países disponibles.
   * @type {Catalogo[]}
   * Se utiliza para el select de país en el formulario.
   */
  pais!: Catalogo[];

  /**
   * Configuración para el encabezado de tabla de personas morales extranjeras.
   * Define las columnas y textos en español para la tabla.
   */
  configuracionParaPMEEncabezadoDeTabla = CONFIGURACION_PARA_PME_ENCABEZADO_DE_TABLA;

  /**
   * Tabla de datos de personas morales extranjeras.
   * @type {PersonaMoralExtranjeraForm[]}
   * Almacena la información de las personas morales extranjeras agregadas.
   */
  personaMoralExtranjeraTabla: PersonaMoralExtranjeraForm[] = [];

  /**
   * Textos estáticos para la interfaz de usuario en español.
   */
  TEXTOS = TEXTOS;

  /**
   * Referencia al botón de cerrar modal.
   * Se utiliza para cerrar el modal de edición/agregado.
   */
  @ViewChild('cerrarModal') cerrarModal!: ElementRef;

  /**
   * Estado actual del trámite de transporte marítimo.
   * Almacena los datos globales del trámite.
   */
  public transportacionMaritimaState!: Tramitenacionales40402State;

  /**
   * Subject para gestionar la destrucción de suscripciones.
   * Evita fugas de memoria en el ciclo de vida del componente.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaDatos
   * Datos de consulta obtenidos del estado global.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} esDatosRespuesta
   * Indica si los datos son de respuesta y deben mostrarse.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * @property {boolean} soloLectura
   * Bandera que indica si el formulario debe estar en modo solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos
   * @param tramite40402Store Almacenamiento del estado del trámite
   * @param tramite40402Query Consulta del estado del trámite
   * @param transportacionMaritimaService Servicio para transporte marítimo
   * @param consultaioQuery Consulta de datos globales
   */
  constructor(
    private fb: FormBuilder,
    private tramite40402Store: Tramite40402Store,
    private tramite40402Query: Tramite40402Query,
    private transportacionMaritimaService: TransportacionMaritimaService,
    private consultaioQuery: ConsultaioQuery
  ) {
    // El constructor se utiliza para la inyección de dependencias
  }

  /**
   * Método del ciclo de vida OnInit.
   * @description Inicializa catálogos, formularios y suscripciones.
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite40402Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
          this.personaMoralExtranjeraTabla = seccionState.personaMoralExtranjeraTabla || [];
        })
      )
      .subscribe();

    this.crearAgregarPMNForm();
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
   * Crea el formulario reactivo para personas morales extranjeras.
   * @description Inicializa el formulario con valores del estado actual.
   * @returns {void}
   */
  crearAgregarPMNForm(): void {
    this.personaMoralExtranjeraForm = this.fb.group({
      denominacionPME: [
        this.transportacionMaritimaState?.denominacionPME,
        [
          Validators.required,
          Validators.maxLength(254)
        ]
      ],
      correoPME: [
        this.transportacionMaritimaState?.correoPME,
        [
          Validators.required,
          Validators.maxLength(320),
          Validators.pattern(REGEX_CORREO_ELECTRONICO)
        ]
      ],
      paisPME: [
        this.transportacionMaritimaState?.paisPME,
      ],
      codigoPostalPME: [
        this.transportacionMaritimaState?.codigoPostalPME,
        [
          Validators.required,
          Validators.maxLength(12)
        ]
      ],
      ciudadPME: [
        this.transportacionMaritimaState?.ciudadPME,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      estadoPME: [
        this.transportacionMaritimaState?.estadoPME,
        [
          Validators.required,
          Validators.maxLength(200)
        ]
      ],
      callePME: [
        this.transportacionMaritimaState?.callePME,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      numeroExteriorPME: [
        this.transportacionMaritimaState?.numeroExteriorPME,
        [
          Validators.required,
          Validators.maxLength(55)
        ]
      ],
      numeroInteriorPME: [
        this.transportacionMaritimaState?.numeroInteriorPME,
        [
          Validators.maxLength(55)
        ]
      ],
      nombreDG: [
        this.transportacionMaritimaState?.nombreDG,
        [
          Validators.required,
          Validators.maxLength(28)
        ]
      ],
      apellidoPaternoDG: [
        this.transportacionMaritimaState?.apellidoPaternoDG,
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],
      apellidoMaternoDG: [
        this.transportacionMaritimaState?.apellidoMaternoDG,
        [
          Validators.maxLength(20)
        ]
      ]
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa los catálogos necesarios para el componente.
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

    merge(PAIS$)
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe();
  }

  /**
   * Maneja la selección de país.
   * @description Actualiza el store con el país seleccionado.
   * @returns {void}
   */
  paisSeleccion(): void {
    const PAIS = this.personaMoralExtranjeraForm.get('paisPME')?.value;
    this.tramite40402Store.setPaisPME(PAIS);
  }
  /**
   * Agrega una nueva persona moral extranjera a la tabla.
   * @param personaMoralExtranjeraFormDatos Datos del formulario
   * @returns {void}
   */
  agregarPME(personaMoralExtranjeraFormDatos: PersonaMoralExtranjeraForm): void {
    this.personaMoralExtranjeraForm.markAllAsTouched();
    this.personaMoralExtranjeraForm.updateValueAndValidity();

    if (this.personaMoralExtranjeraForm.valid) {
      const PAIS = this.pais?.find((pais) => pais.id === Number(personaMoralExtranjeraFormDatos.paisPME))?.descripcion;
      const REGISTRO = {
        denominacionPME: personaMoralExtranjeraFormDatos.denominacionPME,
        paisPME: PAIS ?? '',
        estadoPME: personaMoralExtranjeraFormDatos.estadoPME,
        codigoPostalPME: personaMoralExtranjeraFormDatos.codigoPostalPME,
        ciudadPME: personaMoralExtranjeraFormDatos.ciudadPME,
        callePME: personaMoralExtranjeraFormDatos.callePME,
        numeroExteriorPME: personaMoralExtranjeraFormDatos.numeroExteriorPME,
        numeroInteriorPME: personaMoralExtranjeraFormDatos.numeroInteriorPME,
        correoPME: personaMoralExtranjeraFormDatos.correoPME,
        nombreDG: personaMoralExtranjeraFormDatos.nombreDG,
        apellidoPaternoDG: personaMoralExtranjeraFormDatos.apellidoPaternoDG,
        apellidoMaternoDG: personaMoralExtranjeraFormDatos.apellidoMaternoDG,
        domicilioPME: `${personaMoralExtranjeraFormDatos.callePME} ${personaMoralExtranjeraFormDatos.numeroExteriorPME} ${personaMoralExtranjeraFormDatos.estadoPME} ${PAIS} ${personaMoralExtranjeraFormDatos.codigoPostalPME}`.trim()
      };
      const NUEVO_CUERPO_TABLA = [...this.personaMoralExtranjeraTabla];
      if (this.indiceSeleccionado !== null) {
        NUEVO_CUERPO_TABLA[this.indiceSeleccionado] = REGISTRO;
      } else {
        NUEVO_CUERPO_TABLA.push(REGISTRO);
      }
      this.personaMoralExtranjeraTabla = NUEVO_CUERPO_TABLA;
      this.tramite40402Store.setPersonaMoralExtranjeraTabla(this.personaMoralExtranjeraTabla);
      this.limpiarDatosPME();
      this.indiceSeleccionado = null;
      this.cerrarModalFunc();
      // Mostrar notificación después de cerrar modal
      setTimeout(() => {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'INFORMACION',
          modo: 'action',
          titulo: 'Alerta',
          mensaje: 'Datos guardados correctamente',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.mostrarNotificacion = true;
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
   * Alerta de notificación para mostrar mensajes al usuario.
   * @type {Notificacion}
   */
  public alertaNotificacion!: Notificacion;
  
  /**
   * Bandera para mostrar la notificación de alerta en la interfaz.
   * Cuando es true, se despliega el componente de notificación.
   */
  mostrarNotificacion: boolean = false;
  /**
   * Manejador para el evento de clic en el botón "Agregar".
   * Si ya existe un registro en la tabla, muestra una notificación y no abre el modal.
   * @param evento Evento de clic del botón
   */
  enAgregarClic(evento: Event): void {
    if (this.personaMoralExtranjeraTabla.length > 0) {
      evento.preventDefault();
      evento.stopPropagation();
      this.alertaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'INFORMACION',
        modo: 'action',
        titulo: 'Registro existente',
        mensaje: 'Ya ha sido agregada a la solicitud una persona moral extranjera.',
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
   * Selecciona un registro de la tabla para modificar o eliminar.
   */
  /**
   * Selecciona un registro de la tabla para modificar o eliminar.
   * Puede recibir el índice o el objeto del registro.
   */
  seleccionarRegistro(registro: PersonaMoralExtranjeraForm | number): void {
    if (typeof registro === 'number') {
      this.indiceSeleccionado = registro;
    } else {
      const INDICE = this.personaMoralExtranjeraTabla.indexOf(registro);
      this.indiceSeleccionado = INDICE !== -1 ? INDICE : null;
    }
  }

  /**
   * Elimina el registro seleccionado de la tabla.
   */
  eliminarRegistro(): void {
    if (this.indiceSeleccionado !== null || this.filasSeleccionadas.length > 0) {
      const DENOMINACIONES_A_ELIMINAR = new Set(this.filasSeleccionadas.map(p => p.denominacionPME).filter(Boolean));
      const CORREOS_A_ELIMINAR = new Set(this.filasSeleccionadas.map(p => p.correoPME).filter(Boolean));
      const COMBO_CORREO_DENOMINACION_A_ELIMINAR = new Set(
        this.filasSeleccionadas
          .filter(p => p.correoPME && p.denominacionPME)
          .map(p => `${p.correoPME}|${p.denominacionPME}`)
      );

      this.personaMoralExtranjeraTabla = this.personaMoralExtranjeraTabla.filter(persona => {
        if (persona.denominacionPME && DENOMINACIONES_A_ELIMINAR.has(persona.denominacionPME)) {
          return false;
        }
        if (persona.correoPME && CORREOS_A_ELIMINAR.has(persona.correoPME)) {
          return false;
        }
        if (persona.correoPME && persona.denominacionPME) {
          const COMBO_ID = `${persona.correoPME}|${persona.denominacionPME}`;
          if (COMBO_CORREO_DENOMINACION_A_ELIMINAR.has(COMBO_ID)) {
            return false;
          }
        }
        return !this.filasSeleccionadas.includes(persona);
      });
      this.filasSeleccionadas = [];
      this.indiceSeleccionado = null;
      if (this.personaMoralExtranjeraForm) {
        this.personaMoralExtranjeraForm.reset();
      }
      this.tramite40402Store.setPersonaMoralExtranjeraTabla(this.personaMoralExtranjeraTabla);  
    }
  }

  /**
   * Abre el modal de modificación con los datos pre-cargados.
   */
  modificarRegistro(): void {
    if (this.indiceSeleccionado !== null) {
      const REGISTRO = this.personaMoralExtranjeraTabla[this.indiceSeleccionado];
      this.personaMoralExtranjeraForm.patchValue({
        denominacionPME: REGISTRO.denominacionPME,
        correoPME: REGISTRO.correoPME,
        paisPME: this.pais?.find(p => p.descripcion === REGISTRO.paisPME)?.id ?? '',
        codigoPostalPME: REGISTRO.codigoPostalPME,
        ciudadPME: REGISTRO.ciudadPME,
        estadoPME: REGISTRO.estadoPME,
        callePME: REGISTRO.callePME,
        numeroExteriorPME: REGISTRO.numeroExteriorPME,
        numeroInteriorPME: REGISTRO.numeroInteriorPME,
            nombreDG: REGISTRO.nombreDG,
            apellidoPaternoDG: REGISTRO.apellidoPaternoDG,
            apellidoMaternoDG: REGISTRO.apellidoMaternoDG,
      });
    }
  }

  /**
   * Actualiza el estado global con los valores del formulario.
   * @returns {void}
   */
  actualizarFormularioState(): void {
    this.setValoresStore(this.personaMoralExtranjeraForm, 'paisPME', 'setPaisPME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'codigoPostalPME', 'setCodigoPostalPME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'ciudadPME', 'setCiudadPME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'estadoPME', 'setEstadoPME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'callePME', 'setCallePME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'numeroExteriorPME', 'setNumeroExteriorPME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'numeroInteriorPME', 'setNumeroInteriorPME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'nombreDG', 'setNombreDG');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'apellidoPaternoDG', 'setApellidoPaternoDG');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'apellidoMaternoDG', 'setApellidoMaternoDG');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'denominacionPME', 'setDenominacionPME');
    this.setValoresStore(this.personaMoralExtranjeraForm, 'correoPME', 'setCorreoPME');
  }

  /**
   * Limpia los datos del formulario.
   * @returns {void}
   */
  limpiarDatosPME(): void {
    this.personaMoralExtranjeraForm.reset();
    this.actualizarFormularioState();
  }

  /**
   * Cierra el modal mediante programación.
   * @returns {void}
   */
  /**
   * Cierra el modal mediante programación.
   * @returns {void}
   */
  cerrarModalFunc(): void {
    if (this.cerrarModal) {
      this.cerrarModal.nativeElement.click();
    }
  }

  /**
   * Establece valores en el store del trámite.
   * @param form Grupo de formulario
   * @param campo Nombre del campo
   * @param metodoNombre Método del store a invocar
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite40402Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite40402Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida OnDestroy.
   * @description Cancela todas las suscripciones activas.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }

  /**
   * Inicializa el estado de habilitación del formulario.
   * @description Habilita/deshabilita según el modo solo lectura.
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.personaMoralExtranjeraForm?.disable();
    } else {
      this.personaMoralExtranjeraForm?.enable();
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