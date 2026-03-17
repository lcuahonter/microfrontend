import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, Notificacion, NotificacionesComponent, REGEX_RFC, ValidacionesFormularioService, doDeepCopy, esValidArray, getValidDatos } from '@ng-mf/data-access-user';
import {DatosDomicilioLegalState,DatosDomicilioLegalStore,} from '../../estados/stores/datos-domicilio-legal.store';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { Shared2605Service } from '../../services/shared2605/shared2605.service';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente principal para gestionar el formulario de representante.
 */
@Component({
  selector: 'app-representante-legal-rfc',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule,NotificacionesComponent],
  templateUrl: './representante-legal-rfc.component.html',
  styleUrl: './representante-legal-rfc.component.css',
})
export class RepresentanteLegalRfcComponent implements OnInit, OnDestroy {
  @Output() formValidityChange = new EventEmitter<boolean>();
  public mostrarErroresRepresentante = {
    rfc:false,
  nombre: false,
  apellidoPaterno: false,
};

  
    @Input() public idProcedimiento!: number;
  /**
   * Estado de la solicitud.
   */
  public solicitudState!: DatosDomicilioLegalState;

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Grupo de formularios para el representante legal.
   */
  updateDatos: boolean = false;

  /**
   * Nueva notificación asociada al formulario/flujo actual del componente.
   *
   * Representa el objeto de tipo `Notificacion` que se usa para crear, editar o enviar
   * una notificación desde el componente de representante legal. Se marca con el operador
   * de aserción no nulo (`!`) porque se inicializa de forma diferida (por ejemplo, en
   * ngOnInit, al abrir un formulario o al recibir datos del servicio) antes de su uso.
   *
   * @remarks
   * - Tipo esperado: Notificacion
   * - Uso típico: almacenar los valores del formulario y pasarlos al servicio de persistencia
   *   o a la capa de presentación (modal, vista previa, etc.).
   *
   * @example
   * // Inicialización y uso
   * this.nuevaNotificacion = {
   *   titulo: 'Notificación importante',
   *   mensaje: 'Contenido de la notificación',
   *   destinatario: 'usuario@ejemplo.com'
   * };
   * this.enviarNotificacion(this.nuevaNotificacion);
   *
   * @public
   * @compodoc Descripción: Instancia de Notificacion usada por el componente para crear/editar/enviar notificaciones.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Constructor del componente.
   * @param fb
   * @param DatosDomicilioLegalStore
   * @param DatosDomicilioLegalQuery
   */
  constructor(
    private readonly fb: FormBuilder,
    private DatosDomicilioLegalStore: DatosDomicilioLegalStore,
    private DatosDomicilioLegalQuery: DatosDomicilioLegalQuery,
    private consultaioQuery: ConsultaioQuery,
    private servicioDeFormularioService: ServicioDeFormularioService,
    private validacionesService: ValidacionesFormularioService,
    private sharedSvc: Shared2605Service
  ) {

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if(seccionState){
          this.esFormularioSoloLectura = seccionState.readonly;
          }
        })
      )
      .subscribe();
    //Reservado para futuras inyecciones de dependencias o inicializaciones.
    this.DatosDomicilioLegalQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          if(!this.representante){
          this.configurarGrupoForm();
        }
        else if (this.esFormularioSoloLectura) {
          this.representante.patchValue({
          rfc: this.solicitudState?.rfc || '',
          nombre: this.solicitudState?.nombre || '',
          apellidoPaterno: this.solicitudState?.apellidoPaterno || '',
          apellidoMaterno: this.solicitudState?.apellidoMaterno || '',
        })
      }
      }
      ))
      .subscribe();
  }

  /**
   * Grupo de formularios principal.
   * @property {FormGroup} representante
   */
  representante!: FormGroup;

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    if(!this.representante){
      this.configurarGrupoForm();
    }
 
    /**
    * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    *
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - Llama a `configurarGrupoForm()` para aplicar configuraciones basadas en el estado recibido.
    * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
    */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if(seccionState){
          this.esFormularioSoloLectura = seccionState.readonly;
          this.updateDatos = seccionState.update;
           this.representante.patchValue({
          rfc: this.solicitudState?.rfc || '',
          nombre: this.solicitudState?.nombre || '',
          apellidoPaterno: this.solicitudState?.apellidoPaterno || '',
          apellidoMaterno: this.solicitudState?.apellidoMaterno || '',
        });
          }
        })
      )
      .subscribe();
       this.formValidityChange.emit(this.representante.valid);
     this.sharedSvc.representanteValidity=this.representante.valid;
  }
  /**
   * Configura el formulario reactivo.
   * @description Configura el formulario reactivo para el componente.
   */
  configurarGrupoForm(): void // Configura el formulario reactivo.
  {
const STATE = this.solicitudState ?? {};
   this.representante = this.fb.group({
    rfc: [STATE['rfc'] || '', [Validators.required, Validators.maxLength(13), Validators.pattern(REGEX_RFC)]],
    nombre: [{ value: STATE['nombre'] || '', disabled: true }, Validators.required],
    apellidoPaterno: [{ value: STATE['apellidoPaterno'] || '', disabled: true }, Validators.required],
    apellidoMaterno: [{ value: STATE['apellidoMaterno'] || '', disabled: true }],
  });

    this.servicioDeFormularioService.registerForm('representanteForm', this.representante);
    this.servicioDeFormularioService.formTouched$.subscribe((formName) => {
      if (formName === 'representanteForm') {
        this.representante.markAllAsTouched();
      }
    })

     /*
     * Si el formulario está en modo solo lectura, deshabilita todos los campos.
     * En caso contrario, habilita los campos para permitir la edición.
     * Esto asegura que el formulario refleje correctamente el estado de solo lectura.
     */
    if (this.esFormularioSoloLectura && this.representante ) {
      this.representante.disable();
    } 

    if(this.updateDatos) {
      this.obtenerValor(); // Obtiene valores predeterminados si el formulario es de solo lectura.
    }
  }
  /**
   * Obtiene el valor de un campo en el store de Tramite31601.
   */
  obtenerValor(): void {
 if(this.representante.get('rfc')?.valid){
    const PROCEDIMIENTO = String(this.idProcedimiento);
    const PAYLOAD = {
      "rfcRepresentanteLegal": this.representante.get('rfc')?.value
    }
    this.sharedSvc
      .getRepresentanteLegala(PAYLOAD, PROCEDIMIENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        const DATOS = doDeepCopy(response);
        if(esValidArray(DATOS.datos)) {
        this.mostrarErroresRepresentante.nombre = false;
        this.mostrarErroresRepresentante.apellidoPaterno = false;
          this.representante.patchValue({
              nombre: getValidDatos(DATOS.datos[0].nombre) ? DATOS.datos[0].nombre : '',
              apellidoPaterno: getValidDatos(DATOS.datos[0].apellidoPaterno) ? DATOS.datos[0].apellidoPaterno : '',
              apellidoMaterno: getValidDatos(DATOS.datos[0].apellidoMaterno) ? DATOS.datos[0].apellidoMaterno : '',
          });
          this.setValoresStore(this.representante, 'nombre', 'setNombre');
          this.setValoresStore(this.representante, 'apellidoPaterno', 'setApellidoPaterno');
          this.setValoresStore(this.representante, 'apellidoMaterno', 'setApellidoMaterno');
        }
        else{
             this.mostrarErroresRepresentante.nombre = true;
      this.mostrarErroresRepresentante.apellidoPaterno = true;
        }

      }, (error) => {
        console.error('Error al obtener los representantes legala:', error);
      });
    }
    else{
       this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'Debe ingresar el RFC.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    }
  }

  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof DatosDomicilioLegalStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (
      this.DatosDomicilioLegalStore[metodoNombre] as (
        value: string | number
      ) => void
    )(VALOR);

    this.servicioDeFormularioService.setFormValue('representanteForm', {
        [campo]: VALOR,
      });
    this.formValidityChange.emit(this.representante.valid);
  }

  /**
  * compo doc
  * @method esValido
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param campo El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.representante, campo);
  }
validarClickDeBoton(): boolean {
    let ISVALID = true;
    const FORMVALUE = this.representante.getRawValue();
    if(FORMVALUE.nombre === '' || FORMVALUE.nombre === null){
      this.mostrarErroresRepresentante.nombre = true;
      ISVALID = false;
    }
    if(FORMVALUE.apellidoPaterno === '' || FORMVALUE.apellidoPaterno === null){
      this.mostrarErroresRepresentante.apellidoPaterno = true;
      ISVALID = false;
    }
    if(this.representante.invalid){
      this.representante.markAllAsTouched();
      ISVALID = false;
    }
    return ISVALID;
}
  /**
   * Limpia los campos del formulario.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  
  eliminarPedimento(event: boolean): void {
    if (event) {
      //
    }
  }
}
