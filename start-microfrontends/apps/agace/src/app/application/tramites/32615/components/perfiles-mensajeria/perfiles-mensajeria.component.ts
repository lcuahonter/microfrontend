/**
 * @fileoverview Componente principal para gestionar la sección de perfiles de mensajería
 * del trámite 32615. Administra la visibilidad de múltiples secciones temáticas relacionadas
 * a los perfiles de seguridad, logística y procesos de una empresa.
 *
 * Este archivo contiene toda la lógica para inicializar el formulario y controlar
 * la interfaz de usuario a través de banderas booleanas.
 */
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// Componentes hijos que forman las distintas secciones del formulario
import {
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
} from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO, VIGENCIA } from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';
import {
  Solicitud32615PerfilesMensajeriaState,
  Tramite32615PerfilesMensajeriaStore,
} from '../../../../estados/tramites/tramite32615_perfilesMensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CapacitacionSeguridadComponent } from '../capacitacion-seguridad/capacitacion-seguridad.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ControlesFisicoComponent } from '../controles-fisico/controles-fisico.component';
import { FECHA_DE_PAGO } from '../../constantes/perfiles.enum';
import { GestionAduaneraComponent } from '../gestion-aduanera/gestion-aduanera.component';
import { ManejoInvestigacionComponent } from '../manejo-investigacion/manejo-investigacion.component';
import { PlaneacionDelaSeguridadComponent } from '../planeacion-de-la-seguridad/planeacion-de-la-seguridad.component';
import { SeguridadFisicaComponent } from '../seguridad-fisica/seguridad-fisica.component';
import { SeguridadInformacionDocumentacionComponent } from '../seguridad-informacion-documentacion/seguridad-informacion-documentacion.component';
import { SeguridadLosVehiculosComponent } from '../seguridad-los-vehiculos/seguridad-los-vehiculos.component';
import { SeguridadPersonalComponent } from '../seguridad-personal/seguridad-personal.component';
import { SeguridadProcesosComponent } from '../seguridad-procesos/seguridad-procesos.component';
import { SociosComercialesComponent } from '../socios-comerciales/socios-comerciales.component';
import { TEXTOS_ESTATICOS_MENSAJERIA } from '../../constantes/texto-estatico.enum';
import { Tramite32615PerfilesMensajeriaQuery } from '../../../../estados/queries/tramite32615_perfilesMensajeria.query';


/**
 * Componente principal para la sección de perfiles de mensajería del trámite 32615.
 *
 * Este componente se encarga de centralizar la lógica y visibilidad de las distintas
 * secciones del formulario relacionadas al perfil de la empresa.
 *
 * @export
 * @class PerfilesMensajeriaComponent
 */
@Component({
  selector: 'app-perfiles-mensajeria',
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
    InputRadioComponent
  ],
  templateUrl: './perfiles-mensajeria.component.html',
  styleUrls: ['./perfiles-mensajeria.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PerfilesMensajeriaComponent implements OnInit, OnDestroy {
    /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_MENSAJERIA
  /**
   * Formulario reactivo que agrupa los campos principales del perfil de mensajería.
   *
   * @type {FormGroup}
   * @memberof PerfilesMensajeriaComponent
   */
  public profileForm!: FormGroup;

  /**
   * Indica si se debe mostrar la sección de contenido general.
   * @type {boolean}
   * @public
   */
  public mostrarContenido:boolean = false;

  
  /** Opciones para los botones de radio */
  public opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

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
   * @memberof PerfilesMensajeriaComponent
   */
  public hasAgregar:boolean = false;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Estado interno de la solicitud, utilizado para manejar los datos relacionados a perfiles y mensajería.
   */
  private solicitudState!: Solicitud32615PerfilesMensajeriaState;

  /**
   * Subject utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria (memory leaks).
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Valor de fecha de inicio seleccionado, inicializado con la constante `FECHA_DE_PAGO`.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;
  
  /** Configuración del input de fecha de vigencia */
  public fechaVigenciaInput: InputFecha = VIGENCIA;

  /**
   * Crea una instancia de PerfilesMensajeriaComponent.
   *
   * Inicializa el formulario `profileForm` con los campos requeridos.
   *
   * @param {FormBuilder} fb Inyección del servicio FormBuilder para construir el formulario.
   * @memberof PerfilesMensajeriaComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite32615Store: Tramite32615PerfilesMensajeriaStore,
    private tramite32615Query: Tramite32615PerfilesMensajeriaQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    // Suscribe al estado de consulta para determinar si el formulario es de solo lectura
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
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
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  public inicializarEstadoFormulario(): void {
    this.tramite32615Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.crearFormularioProfileForm();

    if (this.esFormularioSoloLectura) {
      Object.keys(this.profileForm.controls).forEach((key) => {
        this.profileForm.get(key)?.disable();
      });
    } else {
      Object.keys(this.profileForm.controls).forEach((key) => {
        this.profileForm.get(key)?.enable();
      });
    }
  }

  /**
   * @method crearFormularioProfileForm
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para los controles físicos.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  public crearFormularioProfileForm(): void {
    this.profileForm = this.fb.group({
      domicilio: [this.solicitudState?.domicilio, Validators.required],
      antiguedad: [this.solicitudState?.antiguedad, Validators.required],
      actividad: [this.solicitudState?.actividad, Validators.required],
      productos: [this.solicitudState?.productos, Validators.required],
      embarquesExp: [this.solicitudState?.embarquesExp, Validators.required],
      embarquesImp: [this.solicitudState?.embarquesImp, Validators.required],
      empleados: [this.solicitudState?.empleados, Validators.required],
      superficie: [this.solicitudState?.superficie, Validators.required],
      nombre: [this.solicitudState?.nombre, Validators.required],
      categoria: [this.solicitudState?.categoria, Validators.required],
      vigencia: [this.solicitudState?.vigencia, Validators.required],
      nombre2: [this.solicitudState?.nombre2, Validators.required],
      categoria2: [this.solicitudState?.categoria2, Validators.required],
      vigencia2: [this.solicitudState?.vigencia2, Validators.required],
      nombre3: [this.solicitudState?.nombre3, Validators.required],
      categoria3: [this.solicitudState?.categoria3, Validators.required],
      vigencia3: [this.solicitudState?.vigencia3, Validators.required],
      pip: [this.solicitudState?.pip, Validators.required],
      numeroRegistroOEA: [this.solicitudState?.numeroRegistroOEA, Validators.required],
      oea: [this.solicitudState?.oea, Validators.required],
      numeroPrograma: [this.solicitudState?.numeroPrograma, Validators.required],
      otrosProgramas: [this.solicitudState?.otrosProgramas, Validators.required],
      numeroProgramaOtros: [this.solicitudState?.numeroProgramaOtros, Validators.required],
      numeroRegistroOtros: [this.solicitudState?.numeroRegistroOtros, Validators.required],
      fechaVigenciaProfile: [this.solicitudState?.fechaVigenciaProfile, Validators.required],
      numeroRegistro: [this.solicitudState?.numeroRegistro, Validators.required]
    });
  }

    /**
     * Actualiza la fecha de inicio en el formulario y en el store.
     * @param nuevo_valor Nuevo valor para la fecha
     * @param form Formulario reactivo
     * @param campo Nombre del campo a actualizar
     * @param metodoNombre Método del store a invocar
     */
    public cambioFechaInicio(
      nuevo_valor: string,
      form: FormGroup,
      campo: string,
      metodoNombre: keyof Tramite32615PerfilesMensajeriaStore
    ): void {
      this.profileForm.get(campo)?.setValue(nuevo_valor);
      this.profileForm.get(campo)?.markAsUntouched();
      const VALOR = form.get(campo)?.value;
      (this.tramite32615Store[metodoNombre] as (value: unknown) => void)(VALOR);
    }

  /**
   * Alterna la visibilidad de la sección "Contenido general".
   */
  public alternarContenido(): void {
    this.mostrarContenido = !this.mostrarContenido;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad física".
   */
  public alternarSeguridad(): void {
    this.mostrarSeguridad = !this.mostrarSeguridad;
  }

  /**
   * Alterna la visibilidad de la sección "Acceso físico".
   */
  public alternarAccesoFisico(): void {
    this.mostrarAccesoFisico = !this.mostrarAccesoFisico;
  }

  /**
   * Alterna la visibilidad de la sección "Socios comerciales".
   */
  public alternarSociosComerciales(): void {
    this.mostrarSociosComeciales = !this.mostrarSociosComeciales;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad en procesos".
   */
  public alternarSeguridadProcesos(): void {
    this.mostrarSeguridadProcesos = !this.mostrarSeguridadProcesos;
  }

  /**
   * Alterna la visibilidad de la sección "Gestión aduanera".
   */
  public alternarGestionAduanera(): void {
    this.mostrarGestionAduanera = !this.mostrarGestionAduanera;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad en vehículos".
   */
  public alternarSeguridadVehiculos(): void {
    this.mostrarSeguridadVehiculos = !this.mostrarSeguridadVehiculos;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad del personal".
   */
  public alternarSeguridadPersonal(): void {
    this.mostrarSeguridadPersonal = !this.mostrarSeguridadPersonal;
  }

  /**
   * Alterna la visibilidad de la sección "Seguridad de la información".
   */
  public alternarSeguridadInformacion(): void {
    this.mostrarSeguridadInformacion = !this.mostrarSeguridadInformacion;
  }

  /**
   * Alterna la visibilidad de la sección "Capacitación en seguridad".
   */
  public alternarCapacitacionSeguridad(): void {
    this.mostrarCapacitacionSeguridad = !this.mostrarCapacitacionSeguridad;
  }

  /**
   * Alterna la visibilidad de la sección "Manejo e investigación de incidentes".
   */
  public alternarManejoInvestigacion(): void {
    this.mostrarManejoInvestigacion = !this.mostrarManejoInvestigacion;
  }

  /**
   * @method setValoresStore
   * @description
   * Actualiza el estado del store con el valor de un campo específico del formulario.
   * @param {FormGroup} form - Formulario reactivo que contiene los valores.
   * @param {string} campo - Nombre del campo del formulario.
   * @param {keyof Tramite32615PerfilesMensajeriaStore} metodoNombre - Método del store que se debe invocar.
   */
  public setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32615PerfilesMensajeriaStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32615Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Actualiza el valor de la antigüedad desde el formulario al estado global (`store`).
   *
   * Obtiene el valor del campo `antiguedad` desde `profileForm` y lo envía al store mediante `setAntiguedad`.
   */
  public actualizarAntiguedad(): void {
    const ANTIGUEDAD = this.profileForm.get('antiguedad')?.value;
    this.tramite32615Store.setAntiguedad(ANTIGUEDAD);
  }
  /**
   * Actualiza el valor de la actividad desde el formulario al estado global (`store`).
   *
   * Obtiene el valor del campo `actividad` desde `profileForm` y lo envía al store mediante `setActividad`.
   */
  public actualizarActividad(): void {
    const ACTIVIDAD = this.profileForm.get('actividad')?.value;
    this.tramite32615Store.setActividad(ACTIVIDAD);
  }

  /**
   * Actualiza el número de productos desde el formulario al estado global (`store`).
   *
   * Obtiene el valor del campo `productos` desde `profileForm` y lo actualiza usando `setProductos`.
   */
  public actualizarProductos(): void {
    const PRODUCTOS = this.profileForm.get('productos')?.value;
    this.tramite32615Store.setProductos(PRODUCTOS);
  }

  /**
   * Actualiza la cantidad de embarques de exportación desde el formulario al store.
   *
   * Obtiene el valor del campo `embarquesExp` y lo guarda en el estado mediante `setEmbarquesExp`.
   */
  public actualizarEmbarquesExp(): void {
    const EMBARQUES_EXP = this.profileForm.get('embarquesExp')?.value;
    this.tramite32615Store.setEmbarquesExp(EMBARQUES_EXP);
  }

  /**
   * Actualiza la cantidad de embarques de importación desde el formulario al store.
   *
   * Obtiene el valor del campo `embarquesImp` y lo actualiza en el estado a través de `setEmbarquesImp`.
   */
  public actualizarEmbarquesImp(): void {
    const EMBARQUES_IMP = this.profileForm.get('embarquesImp')?.value;
    this.tramite32615Store.setEmbarquesImp(EMBARQUES_IMP);
  }

  /**
   * Actualiza el número de empleados desde el formulario al estado global.
   *
   * Toma el valor del campo `empleados` y lo establece en el estado usando `setEmpleados`.
   */
  public actualizarEmpleados(): void {
    const EMPLEADOS = this.profileForm.get('empleados')?.value;
    this.tramite32615Store.setEmpleados(EMPLEADOS);
  }

  /**
   * Actualiza el valor de la superficie desde el formulario al estado global (`store`).
   *
   * Obtiene el valor del campo `superficie` desde `profileForm` y lo envía al store mediante `setSuperficie`.
   */
  public actualizarSuperficie(): void {
    const SUPERFICIE = this.profileForm.get('superficie')?.value;
    this.tramite32615Store.setSuperficie(SUPERFICIE);
  }

  /**
   * Establece la primera vigencia seleccionada en el estado global.
   *
   * @param evento - Valor de la vigencia seleccionada, recibido desde un evento (por ejemplo, de un `<select>` o `<radio>`).
   */
  public seleccionarVigenciaUno(evento: string): void {
    this.tramite32615Store.setVigencia(evento);
  }

  /**
   * Establece la segunda vigencia seleccionada en el estado global.
   *
   * @param evento - Valor de la segunda vigencia seleccionada.
   */
  public seleccionarVigenciaDos(evento: string): void {
    this.tramite32615Store.setVigenciaDos(evento);
  }

  /**
   * Establece la tercera vigencia seleccionada en el estado global.
   *
   * @param evento - Valor de la tercera vigencia seleccionada.
   */
  public seleccionarVigenciaTres(evento: string): void {
    this.tramite32615Store.setVigenciaTres(evento);
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
