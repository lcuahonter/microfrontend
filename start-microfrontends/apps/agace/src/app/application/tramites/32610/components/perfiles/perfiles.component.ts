/**
 * @fileoverview Componente principal para gestionar la sección de perfiles de mensajería
 * del trámite 31616. Administra la visibilidad de múltiples secciones temáticas relacionadas
 * a los perfiles de seguridad, logística y procesos de una empresa.
 *
 * Este archivo contiene toda la lógica para inicializar el formulario y controlar
 * la interfaz de usuario a través de banderas booleanas.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  REGEX_VALORES_NUMERICOS,
} from '@libs/shared/data-access-user/src';
import { PERFILES_FECHA_DE_PAGO, PERFILES_FECHA_INPUT } from '../../constants/perfiles.enum';
import {
  Solicitud32610State,
  Solicitud32610Store,
} from '../../estados/solicitud32610.store';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CapacitacionSeguridadComponent } from './capacitacion-seguridad/capacitacion-seguridad.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ControlesFisicoComponent } from './controles-fisico/controles-fisico.component';
import { GestionAduaneraComponent } from './gestion-aduanera/gestion-aduanera.component';
import { ManejoInvestigacionComponent } from './manejo-investigacion/manejo-investigacion.component';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../constants/oea-textil-registro.enum';
import { PlaneacionDelaSeguridadComponent } from './planeacion-de-la-seguridad/planeacion-de-la-seguridad.component';
import { SeguridadFisicaComponent } from './seguridad-fisica/seguridad-fisica.component';
import { SeguridadInformacionDocumentacionComponent } from './seguridad-informacion-documentacion/seguridad-informacion-documentacion.component';
import { SeguridadLosVehiculosComponent } from './seguridad-los-vehiculos/seguridad-los-vehiculos.component';
import { SeguridadPersonalComponent } from './seguridad-personal/seguridad-personal.component';
import { SeguridadProcesosComponent } from './seguridad-procesos/seguridad-procesos.component';
import { SociosComercialesComponent } from './socios-comerciales/socios-comerciales.component';
import { Solicitud32610Query } from '../../estados/solicitud32610.query';
import { TEXTOS_ESTATICOS_MENSAJERIA } from '../../constants/texto-estatico.enum';


/**
 * Componente principal para la sección de perfiles de mensajería del trámite 31616.
 *
 * Este componente se encarga de centralizar la lógica y visibilidad de las distintas
 * secciones del formulario relacionadas al perfil de la empresa.
 *
 * @export
 * @class PerfilesComponent
 */
@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PlaneacionDelaSeguridadComponent,
    SeguridadFisicaComponent,
    ControlesFisicoComponent,
    SociosComercialesComponent,
    SeguridadProcesosComponent,
    GestionAduaneraComponent,
    SeguridadLosVehiculosComponent,
    SeguridadPersonalComponent,
    SeguridadInformacionDocumentacionComponent,
    CapacitacionSeguridadComponent,
    ManejoInvestigacionComponent,
    InputFechaComponent,
    InputRadioComponent,
  ],
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss'],
})
export class PerfilesComponent implements OnInit, OnDestroy {
    /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_MENSAJERIA
  /**
   * Formulario reactivo que agrupa los campos principales del perfil de mensajería.
   *
   * @type {FormGroup}
   * @memberof PerfilesComponent
   */
  profileForm!: FormGroup;

  /**
   * Indica si se debe mostrar la sección de contenido general.
   * @type {boolean}
   * @public
   */
  public mostrarContenido:boolean = false;

  /**
   * Indica si se debe mostrar la sección de seguridad física.
   * @type {boolean}
   * @public
   */
  public mostrarSeguridad:boolean = false;

  /**
   * Indica si se debe mostrar la sección de controles de acceso físico.
   * @type {boolean}
   * @public
   */
  public mostrarAccesoFisico:boolean = false;

  /**
   * Indica si se debe mostrar la sección de socios comerciales.
   * @type {boolean}
   * @public
   */
  public mostrarSociosComeciales:boolean = false;

  /**
   * Indica si se debe mostrar la sección de seguridad en los procesos.
   * @type {boolean}
   * @public
   */
  public mostrarSeguridadProcesos:boolean = false;

  /**
   * Indica si se debe mostrar la sección de gestión aduanera.
   * @type {boolean}
   * @public
   */
  public mostrarGestionAduanera:boolean = false;

  /**
   * Indica si se debe mostrar la sección de seguridad en los vehículos.
   * @type {boolean}
   * @public
   */
  public mostrarSeguridadVehiculos:boolean = false;

  /**
   * Indica si se debe mostrar la sección de seguridad del personal.
   * @type {boolean}
   * @public
   */
  public mostrarSeguridadPersonal:boolean = false;

  /**
   * Indica si se debe mostrar la sección de seguridad de la información y documentación.
   * @type {boolean}
   * @public
   */
  public mostrarSeguridadInformacion:boolean = false;

  /**
   * Indica si se debe mostrar la sección de capacitación en seguridad.
   * @type {boolean}
   * @public
   */
  public mostrarCapacitacionSeguridad:boolean = false;

  /**
   * Indica si se debe mostrar la sección de manejo e investigación de incidentes.
   * @type {boolean}
   * @public
   */
  public mostrarManejoInvestigacion:boolean = false;

  /**
   * Indica si se permite agregar secciones adicionales.
   *
   * @type {boolean}
   * @memberof PerfilesComponent
   */
  public hasAgregar:boolean = false;

  /**
   * Estado interno de la solicitud, utilizado para manejar los datos relacionados a perfiles y mensajería.
   */
  private solicitudState!: Solicitud32610State;

  /**
   * Subject utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria (memory leaks).
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Valor de fecha de inicio seleccionado, inicializado con la constante `PERFILES_FECHA_DE_PAGO`.
   */
  fechaInicioInput: InputFecha = PERFILES_FECHA_DE_PAGO;

  /**
   * Valor de fecha de inicio seleccionado, inicializado con la constante `PERFILES_FECHA_DE_PAGO`.
   */
  fechaInputDatos: InputFecha = PERFILES_FECHA_INPUT;

  /**
   * Opciones de botón de radio.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Subject utilizado para indicar la destrucción del componente y limpiar suscripciones.
   * Se utiliza en los operadores RxJS para evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Crea una instancia de PerfilesComponent.
   *
   * Inicializa el formulario `profileForm` con los campos requeridos.
   *
   * @param {FormBuilder} fb Inyección del servicio FormBuilder para construir el formulario.
   * @memberof PerfilesComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite32610Store: Solicitud32610Store,
    private tramite32610Query: Solicitud32610Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * Determina si debe guardar datos existentes o inicializar un formulario nuevo.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormularioProfileForm();
    }
  }

   /**
   * Guarda los datos del formulario y establece el estado de solo lectura.
   * Deshabilita todos los controles del formulario cuando está en modo consulta.
   */
  guardarDatosFormulario(): void {
    this.crearFormularioProfileForm();
    if (this.esFormularioSoloLectura) {
      this.profileForm.disable();
    } else {
      this.profileForm.enable();
    }
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario y suscribe al estado de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Obtiene el estado actual de la solicitud desde el store.
   * Se suscribe a los cambios del estado y actualiza la tabla de datos.
   * Mantiene sincronizada la información entre el store y el componente.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite32610Query.selectSolicitud$?.pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: Solicitud32610State) => {
        this.solicitudState = data;
         if (!this.profileForm) {
          this.crearFormularioProfileForm();
        } else {
          this.actualizarFormularioConEstado();
        }
      });
  }
  
  /**
   * @method crearFormularioProfileForm
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para los controles físicos.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioProfileForm(): void {
    this.obtenerEstadoSolicitud();
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.profileForm = this.fb.group({
      domicilioDeLaInstalacion: [PERFILES.domicilioDeLaInstalacion, [Validators.required]],
      antiguedad: [PERFILES.antiguedad || '', [Validators.required, Validators.pattern(REGEX_VALORES_NUMERICOS)]],
      productos: [PERFILES.productos || '', [Validators.required, Validators.pattern(REGEX_VALORES_NUMERICOS)]],
      embarquesExp: [PERFILES.embarquesExp || '', [Validators.required, Validators.pattern(REGEX_VALORES_NUMERICOS)]],
      embarquesImp: [PERFILES.embarquesImp || '', [Validators.required, Validators.pattern(REGEX_VALORES_NUMERICOS)]],
      empleados: [PERFILES.empleados || '', [Validators.required, Validators.pattern(REGEX_VALORES_NUMERICOS)]],
      superficie: [PERFILES.superficie || '', [Validators.required, Validators.pattern(REGEX_VALORES_NUMERICOS)]],

      blCtpat: [PERFILES.blCtpat ?? '', Validators.required],
      niverCertificado: [PERFILES.niverCertificado || ''],
      ctpatAccountNumber: [PERFILES.ctpatAccountNumber || ''],
      codigoMid: [PERFILES.codigoMid],
      fecUltimaCtapt: [null],
      blnPip: [PERFILES.blnPip, Validators.required],
      numRegistroPip: [PERFILES.numRegistroPip],
      blnOea: [PERFILES.blnOea, Validators.required],
      nomProgramapaisOea: [PERFILES.nomProgramapaisOea],
      numRegistroOea: [PERFILES.numRegistroOea],
      blnOtrosProgramasSegu: [PERFILES.blnOtrosProgramasSegu, Validators.required],
      nombreProgramaOtros: [PERFILES.nombreProgramaOtros],
      numRegistroOtros: [PERFILES.numRegistroOtros],
      fechaVigenciaOtros: [null],

      nombre: [PERFILES.nombre || '', Validators.required],
      categoria: [PERFILES.categoria || '', Validators.required],
      vigencia: [PERFILES.vigencia || '', Validators.required],
      nombre2: [PERFILES.nombre2 || '', Validators.required],
      categoria2: [PERFILES.categoria2 || '', Validators.required],
      vigencia2: [PERFILES.vigencia2 || '', Validators.required],
      nombre3: [PERFILES.nombre3 || '', Validators.required],
      categoria3: [PERFILES.categoria3 || '', Validators.required],
      vigencia3: [PERFILES.vigencia3 || '', Validators.required],
    });
  }

  /**
   * @method actualizarFormularioConEstado
   * @description
   * Actualiza los valores del formulario con los datos del estado actual.
   * Se ejecuta cuando el estado cambia después de la inicialización del formulario.
   */
  actualizarFormularioConEstado(): void {
    if (!this.profileForm || !this.solicitudState?.perfiles) {
      return;
    }

    const PERFILES = this.solicitudState.perfiles;
    
    // Update form controls with current state values
    Object.keys(this.profileForm.controls).forEach(fieldName => {
      const CONTROL = this.profileForm.get(fieldName);
      const STATE_VALUE = PERFILES[fieldName as keyof typeof PERFILES];
      
      // Update control if state has a value and it's different from current form value
      if (CONTROL && STATE_VALUE !== undefined && STATE_VALUE !== null && STATE_VALUE !== '') {
        if (CONTROL.value !== STATE_VALUE) {
          CONTROL.setValue(STATE_VALUE, { emitEvent: false });
        }
      }
    });
  }

  /**
   * Alterna la visibilidad de la sección "Contenido general".
   */
  alternarContenido(): void {
    this.mostrarContenido = !this.mostrarContenido;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad física".
   */
  alternarSeguridad(): void {
    this.mostrarSeguridad = !this.mostrarSeguridad;
  }

  /**
   * Alterna la visibilidad de la sección "Acceso físico".
   */
  alternarAccesoFisico(): void {
    this.mostrarAccesoFisico = !this.mostrarAccesoFisico;
  }

  /**
   * Alterna la visibilidad de la sección "Socios comerciales".
   */
  alternarSociosComerciales(): void {
    this.mostrarSociosComeciales = !this.mostrarSociosComeciales;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad en procesos".
   */
  alternarSeguridadProcesos(): void {
    this.mostrarSeguridadProcesos = !this.mostrarSeguridadProcesos;
  }

  /**
   * Alterna la visibilidad de la sección "Gestión aduanera".
   */
  alternarGestionAduanera(): void {
    this.mostrarGestionAduanera = !this.mostrarGestionAduanera;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad en vehículos".
   */
  alternarSeguridadVehiculos(): void {
    this.mostrarSeguridadVehiculos = !this.mostrarSeguridadVehiculos;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad del personal".
   */
  alternarSeguridadPersonal(): void {
    this.mostrarSeguridadPersonal = !this.mostrarSeguridadPersonal;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad de la información".
   */
  alternarSeguridadInformacion(): void {
    this.mostrarSeguridadInformacion = !this.mostrarSeguridadInformacion;
  }

  /**
   * Alterna la visibilidad de la sección "Capacitación en seguridad".
   */
  alternarCapacitacionSeguridad(): void {
    this.mostrarCapacitacionSeguridad = !this.mostrarCapacitacionSeguridad;
  }

  /**
   * Alterna la visibilidad de la sección "Manejo e investigación de incidentes".
   */
  alternarManejoInvestigacion(): void {
    this.mostrarManejoInvestigacion = !this.mostrarManejoInvestigacion;
  }

  /**
   * Establece valores en el store desde un control de formulario específico.
   * Actualiza el estado global con el valor del campo si no es nulo o indefinido.
   * 
   * param form - Formulario que contiene el control
   * param campo - Nombre del campo a actualizar en el store
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite32610Store.actualizarEstado({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * Actualiza el valor de la antigüedad desde el formulario al estado global (`store`).
   *
   * Obtiene el valor del campo `antiguedad` desde `profileForm` y lo envía al store mediante `setAntiguedad`.
   */
  actualizarAntiguedad(): void {
    const ANTIGUEDAD = this.profileForm.get('antiguedad')?.value;
    this.tramite32610Store.actualizarEstado({ perfiles: { antiguedad: ANTIGUEDAD } });
  }

  /**
   * Actualiza el número de productos desde el formulario al estado global (`store`).
   *
   * Obtiene el valor del campo `productos` desde `profileForm` y lo actualiza usando `setProductos`.
   */
  actualizarProductos(): void {
    const PRODUCTOS = this.profileForm.get('productos')?.value;
    this.tramite32610Store.actualizarEstado({ perfiles: { productos: PRODUCTOS } });
  }

  /**
   * Actualiza la cantidad de embarques de exportación desde el formulario al store.
   *
   * Obtiene el valor del campo `embarquesExp` y lo guarda en el estado mediante `setEmbarquesExp`.
   */
  actualizarEmbarquesExp(): void {
    const EMBARQUES_EXP = this.profileForm.get('embarquesExp')?.value;
    this.tramite32610Store.actualizarEstado({ perfiles: { embarquesExp: EMBARQUES_EXP } });
  }

  /**
   * Actualiza la cantidad de embarques de importación desde el formulario al store.
   *
   * Obtiene el valor del campo `embarquesImp` y lo actualiza en el estado a través de `actualizarEstado`.
   */
  actualizarEmbarquesImp(): void {
    const EMBARQUES_IMP = this.profileForm.get('embarquesImp')?.value;
    this.tramite32610Store.actualizarEstado({ perfiles: { embarquesImp: EMBARQUES_IMP } });
  }

  /**
   * Actualiza el número de empleados desde el formulario al estado global.
   *
   * Toma el valor del campo `empleados` y lo establece en el estado usando `actualizarEstado`.
   */
  actualizarEmpleados(): void {
    const EMPLEADOS = this.profileForm.get('empleados')?.value;
    this.tramite32610Store.actualizarEstado({ perfiles: { empleados: EMPLEADOS } });
  }

  /**
   * Actualiza el valor de la superficie desde el formulario al estado global (`store`).
   *
   * Obtiene el valor del campo `superficie` desde `profileForm` y lo envía al store mediante `actualizarEstado`.
   */
  actualizarSuperficie(): void {
    const SUPERFICIE = this.profileForm.get('superficie')?.value;
    this.tramite32610Store.actualizarEstado({ perfiles: { superficie: SUPERFICIE } });
  }

  /**
   * Establece la primera vigencia seleccionada en el estado global.
   *
   * @param evento - Valor de la vigencia seleccionada, recibido desde un evento (por ejemplo, de un `<select>` o `<radio>`).
   */
  seleccionarVigenciaUno(evento: string): void {
    this.tramite32610Store.actualizarEstado({ perfiles: { vigencia: evento } });
  }

  /**
   * Establece la segunda vigencia seleccionada en el estado global.
   *
   * @param evento - Valor de la segunda vigencia seleccionada.
   */
  seleccionarVigenciaDos(evento: string): void {
    this.tramite32610Store.actualizarEstado({ perfiles: { vigencia2: evento } });
  }

  /**
   * Establece la tercera vigencia seleccionada en el estado global.
   *
   * @param evento - Valor de la tercera vigencia seleccionada.
   */
  seleccionarVigenciaTres(evento: string): void {
    this.tramite32610Store.actualizarEstado({ perfiles: { vigencia3: evento } });
  }


  /**
   * Actualiza el valor de la fecha de inicio de comercio en el formulario.
   * Establece el valor y marca el campo como no tocado.
   * 
   * param nuevo_valor - Nuevo valor de la fecha en formato string
   */
  actualizarFecha(nuevo_valor: string, compo:string): void {
    this.profileForm.get(compo)?.setValue(nuevo_valor);
    this.profileForm.get(compo)?.markAsUntouched();
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
