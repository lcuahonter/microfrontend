import {
  CONFIGURACION_PARA_PME_ENCABEZADO_DE_TABLA,
  ERROR_SEGURO_EXISTE,
} from '../../constantes/transportacion-maritima.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
  esControlValido,
} from '@libs/shared/data-access-user/src';
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
import { PersonaMoralExtranjeraForm } from '../../models/transportacion-maritima.model';
import { TEXTOS } from '../../constantes/transportacion-maritima.enum';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';

import { Tramite40201Query } from '../../estados/query/tramite40201.query';

/**
 * Componente para la captura de datos de persona moral extranjera.
 */
@Component({
  selector: 'app-persona-moral-extranjera',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
    NotificacionesComponent,
  ],
  templateUrl: './persona-moral-extranjera.component.html',
  styleUrl: './persona-moral-extranjera.component.css',
})
export class PersonaMoralExtranjeraComponent implements OnInit, OnDestroy {
  /** Mensaje de validación para campos obligatorios. */
  mensajeCampoObligatorio: string = `<div class="text-danger">
          <small>Este campo es obligatorio</small>
        </div>`;

  /**
   * Formulario reactivo para la captura de datos de persona moral extranjera.
   */
  personaMoralExtranjeraForm!: FormGroup;

  /**
   * Catálogo de países.
   * @type {Catalogo[]}
   * @description Este catálogo se utiliza para seleccionar el país de la persona moral extranjera.
   */
  pais!: Catalogo[];

  /**
   * Configuración para el persona moral extranjera encabezado de la tabla.
   */
  configuracionParaPMEEncabezadoDeTabla =
    CONFIGURACION_PARA_PME_ENCABEZADO_DE_TABLA;

  /**
   * Tabla de datos de persona moral extranjera.
   * @type {PersonaMoralExtranjeraForm[]}
   * @description Esta tabla se utiliza para mostrar los datos de las personas morales extranjeras capturadas.
   */
  personaMoralExtranjeraTabla: PersonaMoralExtranjeraForm[] = [];

  /**
   * Texto de la sección.
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
   * Tabla de selección para la persona moral extranjera.
   */
  TablaSeleccion = TablaSeleccion;
  /**
   * Indica si el formulario está en modo solo lectura
   */
  esFormularioSoloLectura: boolean = false;

  /** Lista de elementos seleccionados en la tabla */
  itemsSeleccionados: Set<number> = new Set();

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
   * Indica si el formulario está en modo de modificación (edición de un registro existente).
   * true cuando se está editando un elemento de la tabla.
   */
  esModificacion: boolean = false;

  /**
   * Índice del registro que se está editando en la tabla.
   * Null cuando no hay edición en curso.
   */
  indexEdicion: number | null = null;

  /**
   * Indicador de validez general del formulario utilizado para mostrar errores globales.
   * true cuando el formulario es considerado válido.
   */
  validForm: boolean = true;

  /**
   * Texto que describe el error cuando existe una denominación duplicada o errores de validación relacionados.
   */
  denominacionDuplicado: string = '';

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite40201Store} tramite40201Store - Store para gestionar el estado del trámite 40201.
   * @param {Tramite40201Query} tramite40201Query - Query para consultar el estado del trámite 40201.
   * @param {TransportacionMaritimaService} transportacionMaritimaService - Servicio para obtener datos de transportación marítima.
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
   * Se ejecuta al inicializar el componente.
   * Inicializa los catálogos y el formulario.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite40201Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
          this.personaMoralExtranjeraTabla =
            seccionState.personaMoralExtranjeraTabla || [];
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo para la captura de datos de persona moral extranjera.
   * @returns {void}
   */
  crearAgregarPMNForm(): void {
    this.personaMoralExtranjeraForm = this.fb.group({
      denominacionPME: ['', [Validators.required, Validators.maxLength(254)]],
      correoPME: ['', [Validators.required, Validators.maxLength(320)]],
      paisPME: ['', Validators.required],
      codigoPostalPME: ['', [Validators.required, Validators.maxLength(12)]],
      ciudadPME: ['', [Validators.required, Validators.maxLength(100)]],
      estadoPME: ['', [Validators.required, Validators.maxLength(200)]],
      callePME: ['', [Validators.required, Validators.maxLength(100)]],
      numeroExteriorPME: ['', [Validators.required, Validators.maxLength(55)]],
      numeroInteriorPME: ['', [Validators.maxLength(55)]],
      nombreDG: ['', [Validators.required, Validators.maxLength(28)]],
      apellidoPaternoDG: ['', [Validators.required, Validators.maxLength(20)]],
      apellidoMaternoDG: ['', [Validators.maxLength(20)]],
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
      this.personaMoralExtranjeraForm.disable();
    } else {
      this.personaMoralExtranjeraForm.enable();
    }
  }
  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  inicializaCatalogos(): void {
    this.transportacionMaritimaService.obtenerPaises().subscribe((resp) => {
      this.pais = resp.datos ?? [];
    });
  }

  /**
   * Agrega una nueva persona moral extranjera a la tabla.
   * @param personaMoralExtranjeraFormDatos - Datos de la persona moral extranjera.
   * @returns {void}
   */
  agregarPME(
    personaMoralExtranjeraFormDatos: PersonaMoralExtranjeraForm
  ): void {
    this.validForm = true;
    if (this.personaMoralExtranjeraForm.invalid) {
      this.personaMoralExtranjeraForm.markAllAsTouched();
      this.validForm = false;
      this.denominacionDuplicado = 'Faltan campos por capturar.';
      return;
    }

    const TABLA = [...this.personaMoralExtranjeraTabla];
    const EXISTE_SEGURO = TABLA.some(
      (pme, index) =>
        pme.denominacionPME ===
          personaMoralExtranjeraFormDatos.denominacionPME &&
        (!this.esModificacion || index !== this.indexEdicion)
    );

    if (EXISTE_SEGURO) {
      this.validForm = false;
      this.denominacionDuplicado = ERROR_SEGURO_EXISTE(
        personaMoralExtranjeraFormDatos.denominacionPME
      );
      return;
    }

    const PFE = this.mapearRegistroPME(personaMoralExtranjeraFormDatos);

    if (this.esModificacion && this.indexEdicion !== null) {
      TABLA[this.indexEdicion] = PFE;
    } else {
      TABLA.push(PFE);
    }

    this.personaMoralExtranjeraTabla = TABLA;
    this.tramite40201Store.setTramite40201State({
      personaMoralExtranjeraTabla: TABLA,
    });

    this.cerrarModal();
    this.esModificacion = false;
    this.indexEdicion = null;
    this.limpiarDatosPME();
    this.cerrarModal();
  }

  /**
   * Mapea los datos del formulario de persona moral extranjera.
   * @param datos datos del formulario de persona moral extranjera
   * @returns persona moral extranjera mapeada
   */
  private mapearRegistroPME(
    datos: PersonaMoralExtranjeraForm
  ): PersonaMoralExtranjeraForm {
    const PAIS =
      this.pais.find((p) => p.clave === datos.paisPME)?.descripcion ?? '';

    return {
      ...datos,
      paisDesc: PAIS,
      domicilioPME:
        `${datos.callePME} ${datos.numeroExteriorPME} ${datos.ciudadPME} ${datos.estadoPME} ${PAIS} ${datos.codigoPostalPME}`.trim(),
    };
  }

  /**
   * Actualiza el estado del formulario en el store de tramite40201.
   * @returns {void}
   * @description Este método se utiliza para actualizar el estado del formulario en el store de tramite40201.
   */
  actualizarFormularioState(): void {
    const VALUES = this.personaMoralExtranjeraForm.value;
    this.tramite40201Store.setTramite40201State(VALUES);
  }

  /**
   * Reinicia el formulario y prepara el componente para agregar una nueva persona.
   */
  agregarPersona(): void {
    this.esModificacion = false;
    this.limpiarDatosPME();
  }

  /**
   * Activa el modo de modificación para el registro seleccionado.
   * Si no hay exactamente un elemento seleccionado mostrará la alerta correspondiente.
   */
  modificarPersona(): void {
    this.esModificacion = true;
    if (this.itemsSeleccionados.size !== 1) {
      this.mostrarAlerta = true;
    } else {
      const INDEX = Array.from(this.itemsSeleccionados)[0];
      const PFE_A_MODIFICAR = this.personaMoralExtranjeraTabla[INDEX];
      this.personaMoralExtranjeraForm.patchValue(PFE_A_MODIFICAR);
    }
  }

  /**
   * Limpia los datos del formulario de persona moral extranjera.
   * @returns {void}
   */
  limpiarDatosPME(): void {
    this.actualizarFormularioState();
    this.personaMoralExtranjeraForm.reset();
    this.validForm = true;
    this.denominacionDuplicado = '';
    this.esModificacion = false;
    this.indexEdicion = null;
    this.itemsSeleccionados.clear();
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
   * Valida si un campo específico dentro de un grupo de formularios es válido.
   * @method esCampoValido
   * @param nombreCampo nombre del campo a validar
   * @param nombreGrupo nombre del grupo al que pertenece el campo
   * @returns true si el campo es válido, false si no lo es, o null si el campo no existe
   */
  campoInvalido(nombreCampo: string): boolean | undefined {
    return esControlValido(this.personaMoralExtranjeraForm, nombreCampo);
  }

  /**
   * Maneja la selección de filas en la tabla.
   * Actualiza el conjunto de índices seleccionados y el índice de edición.
   * @param filasSeleccionadas Lista de filas seleccionadas provenientes de la tabla dinámica.
   */
  public onListaDeFilaSeleccionada(
    filasSeleccionadas: PersonaMoralExtranjeraForm[]
  ): void {
    this.itemsSeleccionados.clear();
    filasSeleccionadas.forEach((materia) => {
      const INDEX = this.personaMoralExtranjeraTabla.findIndex(
        (m) => m.denominacionPME === materia.denominacionPME
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
    if (this.personaMoralExtranjeraTabla.length === 0) {
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
      this.personaMoralExtranjeraTabla.length > 0 &&
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
        this.personaMoralExtranjeraTabla.splice(index, 1);
      });
      this.itemsSeleccionados.clear();
      this.personaMoralExtranjeraTabla = [...this.personaMoralExtranjeraTabla];

      this.tramite40201Store.update({
        personaMoralExtranjeraTabla: this.personaMoralExtranjeraTabla,
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
