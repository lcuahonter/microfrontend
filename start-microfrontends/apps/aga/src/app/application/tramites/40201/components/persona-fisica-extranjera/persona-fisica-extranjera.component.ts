import {
  CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA,
  ERROR_NOMBRE_EXISTE,
  ERROR_SEGURO_EXISTE,
  TEXTOS,
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
import { PersonaFisicaExtranjeraForm } from '../../models/transportacion-maritima.model';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { Tramite40201Query } from '../../estados/query/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';

/**
 * Componente para gestionar la información de personas físicas extranjeras.
 */
@Component({
  selector: 'app-persona-fisica-extranjera',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
  ],
  templateUrl: './persona-fisica-extranjera.component.html',
  styleUrl: './persona-fisica-extranjera.component.css',
})
export class PersonaFisicaExtranjeraComponent implements OnInit, OnDestroy {
  /** Mensaje de validación para campos obligatorios. */
  mensajeCampoObligatorio: string = `<div class="text-danger">
          <small>Este campo es obligatorio</small>
        </div>`;

  /**
   * Formulario reactivo para gestionar la información de personas físicas extranjeras.
   */
  personaFisicaExtranjeraForm!: FormGroup;

  /**
   * Catálogos para los selectores.
   */
  pais!: Catalogo[];

  /**
   * Configuración para el persona moral nacional encabezado de la tabla.
   */
  configuracionParaPFEEncabezadoDeTabla =
    CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA;

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
   * Tabla de selección para mostrar la información de personas físicas extranjeras.
   */
  TablaSeleccion = TablaSeleccion;
  /**
   * Indica si el formulario está en modo solo lectura
   */
  esFormularioSoloLectura: boolean = false;

  seguroDuplicado: string = '';

  validForm: boolean = true;

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

  esModificacion: boolean = false;

  indexEdicion: number | null = null;
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
  ) {}

  /**
   * Se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite40201Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.transportacionMaritimaState = seccionState;
          this.personaFisicaExtranjeraTabla =
            seccionState.personaFisicaExtranjeraTabla || [];
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Crea el formulario reactivo para agregar o editar personas físicas extranjeras.
   * @description Este método inicializa el formulario con los valores del estado de la solicitud.
   */
  crearAgregarPFEForm(): void {
    this.personaFisicaExtranjeraForm = this.fb.group({
      seguroNumero: ['', [Validators.required, Validators.maxLength(11)]],
      nombrePFE: ['', [Validators.required, Validators.maxLength(200)]],
      apellidoPaternoPFE: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
      apellidoMaternoPFE: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
      correoPFE: [
        '',
        [Validators.required, Validators.maxLength(320), Validators.email],
      ],
      paisPFE: ['', Validators.required],
      codigoPostalPFE: ['', [Validators.required, Validators.maxLength(12)]],
      ciudadPFE: ['', [Validators.required, Validators.maxLength(120)]],
      estadoPFE: ['', [Validators.required, Validators.maxLength(200)]],
      callePFE: ['', [Validators.required, Validators.maxLength(100)]],
      numeroExteriorPFE: ['', [Validators.required, Validators.maxLength(55)]],
      numeroInteriorPFE: ['', [Validators.maxLength(55)]],
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
      this.crearAgregarPFEForm();
    }
  }
  /**
   * Guarda los datos del formulario y habilita o deshabilita el formulario según el estado de solo lectura.
   * @returns {void}
   * @description Este método se utiliza para guardar los datos del formulario y habilitar o deshabilitar el formulario según el estado de solo lectura.
   */
  guardarDatosFormulario(): void {
    this.crearAgregarPFEForm();
    if (this.esFormularioSoloLectura) {
      this.personaFisicaExtranjeraForm.disable();
    } else {
      this.personaFisicaExtranjeraForm.enable();
    }
  }
  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  inicializaCatalogos(): void {
    this.transportacionMaritimaService
      .obtenerPaises()
      .subscribe((res) => (this.pais = res.datos ?? []));
  }

  /**
   * Agrega una nueva persona física extranjera a la tabla.
   * @description Este método se ejecuta cuando se hace clic en el botón "Agregar" en el formulario.
   * @param personaFisicaExtranjeraFormDatos - Los datos de la persona física extranjera a agregar.
   * @returns {void}
   */
  agregarPFE(
    personaFisicaExtranjeraFormDatos: PersonaFisicaExtranjeraForm
  ): void {
    this.validForm = true;
    if (this.personaFisicaExtranjeraForm.invalid) {
      this.personaFisicaExtranjeraForm.markAllAsTouched();
      this.validForm = false;
      this.seguroDuplicado = 'Faltan campos por capturar.';
      return;
    }
    const TABLA = [...this.personaFisicaExtranjeraTabla];
    const EXISTE_SEGURO = TABLA.some(
      (pfe, index) =>
        pfe.seguroNumero === personaFisicaExtranjeraFormDatos.seguroNumero &&
        (!this.esModificacion || index !== this.indexEdicion)
    );

    if (EXISTE_SEGURO) {
      this.validForm = false;
      this.seguroDuplicado = ERROR_SEGURO_EXISTE(
        personaFisicaExtranjeraFormDatos.seguroNumero
      );
      return;
    }
    const EXISTE_NOMBRE = TABLA.some(
      (pfe, index) =>
        pfe.nombrePFE === personaFisicaExtranjeraFormDatos.nombrePFE &&
        pfe.apellidoPaternoPFE ===
          personaFisicaExtranjeraFormDatos.apellidoPaternoPFE &&
        pfe.apellidoMaternoPFE ===
          personaFisicaExtranjeraFormDatos.apellidoMaternoPFE &&
        (!this.esModificacion || index !== this.indexEdicion)
    );
    if (EXISTE_NOMBRE) {
      this.validForm = false;
      this.seguroDuplicado = ERROR_NOMBRE_EXISTE(
        'nombre/razon social',
        `${personaFisicaExtranjeraFormDatos.nombrePFE} ` +
          `${personaFisicaExtranjeraFormDatos.apellidoPaternoPFE} ` +
          `${personaFisicaExtranjeraFormDatos.apellidoMaternoPFE}`.trim()
      );
      return;
    }
    const PFE = this.mapearRegistroPFE(personaFisicaExtranjeraFormDatos);
    if (this.esModificacion && this.indexEdicion !== null) {
      TABLA[this.indexEdicion] = PFE;
    } else {
      TABLA.push(PFE);
    }

    this.personaFisicaExtranjeraTabla = TABLA;
    this.tramite40201Store.setTramite40201State({
      personaFisicaExtranjeraTabla: TABLA,
    });

    this.limpiarDatosPFE();
    this.cerrarModal();
  }

  /**
   * Mapea los datos del formulario de persona física extranjera.
   * @param datos datos del formulario de persona física extranjera
   * @returns formulario mapeado con nombre completo, descripción del país y domicilio completo
   */
  private mapearRegistroPFE(
    datos: PersonaFisicaExtranjeraForm
  ): PersonaFisicaExtranjeraForm {
    const PAIS =
      this.pais.find((p) => p.clave === datos.paisPFE)?.descripcion ?? '';

    return {
      ...datos,
      nombreCompleto:
        `${datos.nombrePFE} ${datos.apellidoPaternoPFE} ${datos.apellidoMaternoPFE}`.trim(),
      paisDesc: PAIS,
      domicilioPFE:
        `${datos.callePFE} ${datos.numeroExteriorPFE} ${datos.ciudadPFE} ${datos.estadoPFE} ${PAIS} ${datos.codigoPostalPFE}`.trim(),
    };
  }

  /**
   * Actualiza el estado del formulario en el store.
   * @description Este método se utiliza para actualizar el estado del formulario en el store de tramite40201.
   * @returns {void}
   */
  actualizarFormularioState(): void {
    const VALUES = this.personaFisicaExtranjeraForm.value;
    this.tramite40201Store.setTramite40201State(VALUES);
  }
  /**
   * Limpia los datos del formulario de persona física extranjera.
   * @description Este método se ejecuta cuando se hace clic en el botón "Limpiar" en el formulario.
   * @returns {void}
   */
  limpiarDatosPFE(): void {
    this.personaFisicaExtranjeraForm.reset();
    this.actualizarFormularioState();
    this.validForm = true;
    this.seguroDuplicado = '';
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
    return esControlValido(this.personaFisicaExtranjeraForm, nombreCampo);
  }

  /**
   * Metodo que se ejecuta cuando se seleccionan filas en la tabla.
   * @param filasSeleccionadas lista de filas seleccionadas
   */
  public onListaDeFilaSeleccionada(
    filasSeleccionadas: PersonaFisicaExtranjeraForm[]
  ): void {
    this.itemsSeleccionados.clear();
    filasSeleccionadas.forEach((materia) => {
      const INDEX = this.personaFisicaExtranjeraTabla.findIndex(
        (m) => m.seguroNumero === materia.seguroNumero
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
    if (this.personaFisicaExtranjeraTabla.length === 0) {
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
      this.personaFisicaExtranjeraTabla.length > 0 &&
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
        this.personaFisicaExtranjeraTabla.splice(index, 1);
      });
      this.itemsSeleccionados.clear();
      this.personaFisicaExtranjeraTabla = [
        ...this.personaFisicaExtranjeraTabla,
      ];

      this.tramite40201Store.update({
        personaFisicaExtranjeraTabla: this.personaFisicaExtranjeraTabla,
      });
    }
  }

  /**
   * Inicia la modificación de una persona física extranjera.
   * @method modificarPersona
   * @return {void}
   */
  modificarPersona(): void {
    this.esModificacion = true;
    if (this.itemsSeleccionados.size !== 1) {
      this.mostrarAlerta = true;
    } else {
      const INDEX = Array.from(this.itemsSeleccionados)[0];
      const PFE_A_MODIFICAR = this.personaFisicaExtranjeraTabla[INDEX];
      this.personaFisicaExtranjeraForm.patchValue(PFE_A_MODIFICAR);
    }
  }

  /**
   * Inicia el proceso para agregar una nueva persona física extranjera.
   * @method agregarPersona
   * @return {void}
   */
  agregarPersona(): void {
    this.esModificacion = false;
    this.limpiarDatosPFE();
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
