/* eslint-disable @typescript-eslint/naming-convention */
import {
  Catalogo,
  CatalogoSelectComponent,
  Notificacion, TituloComponent,
  esControlValido
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModificacionTransportacionMaritimaService } from '../../services/modificacion-transportacion-maritima/modificacion-transportacion-maritima.service';
import { PersonaCaat } from '../../models/empresa-caat.model';
import { Subject } from 'rxjs';
import { TEXTOS } from '../../../40201/constantes/transportacion-maritima.enum';
import { TablaSeleccion } from '@ng-mf/data-access-user';

/**
 * Componente para la captura de datos de persona moral extranjera.
 */
@Component({
  selector: 'app-persona-moral-extranjera',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './persona-moral-extranjera.component.html',
  styleUrl: './persona-moral-extranjera.component.css',
})
export class PersonaMoralExtranjeraComponent implements OnInit, OnChanges, OnDestroy {
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
   * Texto de la sección.
   */
  TEXTOS = TEXTOS;

  /**
   * Referencia al botón de cerrar el modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

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


  esMoral: boolean = false;

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
    private service: ModificacionTransportacionMaritimaService) { }


  /**
   * Evento que se emite al cerrar el modal.
   * @property {EventEmitter<boolean>} cerrar
   */
  @Output() cerrar = new EventEmitter<boolean>();

  @Output() empresaCaat = new EventEmitter<PersonaCaat>();

  /**
   * Datos de la empresa a modificar.
   * @property {PersonaCaat | null} empresaModificar
   */
  @Input() empresaModificar: PersonaCaat | null = null;

  /**
   * Se ejecuta al inicializar el componente.
   * Inicializa los catálogos y el formulario.
   */
  ngOnInit(): void {
    this.obtenerPaises();
    this.crearAgregarPMNForm();
  }

  /**
   * Detecta cambios en las propiedades de entrada del componente.
   * @param changes cambios detectados en las propiedades de entrada
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empresaModificar'] && this.empresaModificar) {
      this.crearAgregarPMNForm();
    }
  }

  /**
   * Inicializa el formulario reactivo para la captura de datos de persona moral extranjera.
   * @returns {void}
   */
  crearAgregarPMNForm(): void {
    const { nss, nombre, apellidoPaterno, apellidoMaterno, correoElectronico, razonSocial,
      clavePais, codigoPostal, ciudad, informacionExtra, calle, numeroExterior, numeroInterio,
      nombreDirector, directorApellidoPaterno, directorApellidoMaterno
    } = this.empresaModificar || {};
    this.personaMoralExtranjeraForm = this.fb.group({
      seguroNumero: [nss],
      nombrePFE: [nombre],
      apellidoPaternoPFE: [apellidoPaterno],
      apellidoMaternoPFE: [apellidoMaterno],
      correoPFE: [correoElectronico],
      denominacionPME: [razonSocial, [Validators.required, Validators.maxLength(254)]],
      correoPME: [correoElectronico, [Validators.required, Validators.maxLength(320)]],
      paisPME: [clavePais, Validators.required],
      codigoPostalPME: [codigoPostal, [Validators.required, Validators.maxLength(12)]],
      ciudadPME: [ciudad, [Validators.required, Validators.maxLength(100)]],
      estadoPME: [informacionExtra, [Validators.required, Validators.maxLength(200)]],
      callePME: [calle, [Validators.required, Validators.maxLength(100)]],
      numeroExteriorPME: [numeroExterior, [Validators.required, Validators.maxLength(55)]],
      numeroInteriorPME: [numeroInterio, [Validators.maxLength(55)]],
      nombreDG: [nombreDirector, [Validators.required, Validators.maxLength(28)]],
      apellidoPaternoDG: [directorApellidoPaterno, [Validators.required, Validators.maxLength(20)]],
      apellidoMaternoDG: [directorApellidoMaterno, [Validators.maxLength(20)]],
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
   * Obtiene el catálogo de países.
   * @returns {void}
   */
  obtenerPaises(): void {
    this.service.obtenerPaises().subscribe((res) => {
      this.pais = res.datos || [];
    });
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
   * agrega al candidato modificado y emite el evento con la empresa modificada.
   */
  agregarCandidato(): void {
    const FORM = this.personaMoralExtranjeraForm.getRawValue();
    this.empresaModificar = {
      ...this.empresaModificar,
      nss: FORM.seguroNumero,
      nombre: FORM.nombrePFE,
      apellidoPaterno: FORM.apellidoPaternoPFE,
      apellidoMaterno: FORM.apellidoMaternoPFE,
      correoElectronico: FORM.correoPFE,
      clavePais: FORM.paisPME,
      codigoPostal: FORM.codigoPostalPME,
      ciudad: FORM.ciudadPME,
      informacion_extra: FORM.estadoPME,
      calle: FORM.callePME,
      numeroExterior: FORM.numeroExteriorPME,
      numeroInterio: FORM.numeroInteriorPME,
      razonSocial: FORM.denominacionPME,
      nombreDirector: FORM.nombreDG,
      directorApellidoPaterno: FORM.apellidoPaternoDG,
      directorApellidoMaterno: FORM.apellidoMaternoDG,
    } as PersonaCaat

    this.empresaCaat.emit(this.empresaModificar);
  }


  /**
   * Emite el evento para cerrar el modal.
   * @returns {void}
   */
  cerrarModal(): void {
    this.cerrar.emit(true);
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
