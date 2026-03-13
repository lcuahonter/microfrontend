import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery,ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputRadioComponent, TituloComponent } from "@libs/shared/data-access-user/src";
import { Solicitude32612DosState, Tramite32612DosStore } from '../../estados/solicitud32612Dos.store';
import { Solicitude32612State, Tramite32612Store } from '../../estados/solicitud32612.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CONFIGURACION_DATOS } from '../../constants/perfiles.enum';
import { CommonModule } from '@angular/common';
import { ConcientizacionComponent } from '../concientizacion/concientizacion.component';
import { ControlesDeAccesoComponent } from '../controles-de-acceso/controles-de-acceso.component';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { GestionAduaneraComponent } from '../gestion-aduanera/gestion-aduanera.component';
import { ManejoComponent } from '../manejo/manejo.component';
import { PlaneacionComponent } from '../planeacion/planeacion.component';
import { SeccionDinamicaComponent } from '../../../../shared/components/seccion-dinamica/seccion-dinamica.component';
import { SeguridadDeLaComponent } from '../seguridad-de-la/seguridad-de-la.component';

import { SeccionDinamica } from '@libs/shared/data-access-user/src/core/models/shared/seccion-dinamica.model';
import { SeguridadFisicaComponent } from '../seguridad-fisica/seguridad-fisica.component';

import { SeguridadDeProcesosComponent } from '../seguridad-de-procesos/seguridad-de-procesos.component';
import { SociosComercialesComponent } from '../socios-comerciales/socios-comerciales.component';

import { SeguridadDelPersonalComponent } from '../seguridad-del-personal/seguridad-del-personal.component';
import { Tramite32612DosQuery } from '../../estados/solicitud32612Dos.query';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { VehiculosComponent } from '../vehiculos/vehiculos.component';


/**
 * Componente encargado de gestionar el formulario de perfiles dentro del trámite 32612.
 * Permite la visualización y edición de los datos relacionados con el perfil de la agencia aduanal,
 * así como la interacción con diferentes secciones dinámicas del proceso.
 *
 * @remarks
 * - Utiliza formularios reactivos para la captura y validación de datos.
 * - Integra múltiples componentes dinámicos para la visualización de secciones específicas.
 * - Controla el estado de solo lectura del formulario según el estado de la consulta.
 * - Sincroniza los datos del formulario con el store correspondiente.
 */
@Component({
  selector: 'app-perfiles',
  standalone: true,
  imports: [
    CommonModule, 
    TituloComponent,
    FormasDinamicasComponent,
    InputRadioComponent,
    ReactiveFormsModule,
    SeccionDinamicaComponent
  ],
  templateUrl: './perfiles.component.html',
  styleUrl: './perfiles.component.scss',
})
export class PerfilesComponent implements OnInit, OnDestroy {

  /**
   * Estado de la consulta que se recibe como entrada en el componente.
   * Proporciona información relevante sobre la consulta actual, permitiendo
   * que el componente gestione y muestre los datos correspondientes.
   *
   * @type {ConsultaioState}
   */
  @Input() consultaState!: ConsultaioState;
  /**
   * Instancia de FormGroup reactivo para gestionar los controles y la validación del formulario de perfil.
   * Se inicializa en el componente para manejar la entrada del usuario y el estado del formulario relacionado con los datos del perfil.
   */
  public formaPerfil!: FormGroup;
  /**
   * Arreglo de opciones para el botón de radio.
   * Cada opción contiene una `label` para mostrar y un `value` correspondiente.
   * Se utiliza para representar las opciones "Sí" o "No" en la interfaz de usuario.
   */
  public opcionDeBotonDeRadio = [
    {
      "label": "Si",
      "value": "Si"
    },
    {
      "label": "No",
      "value": "No"
    }
  ]

  /**
   * Representa el grupo de formulario principal para el componente.
   *
   * @remarks
   * Este grupo de formulario contiene un `certificacionesFormGroup` anidado para gestionar los controles relacionados con certificaciones.
   */
  public forma: FormGroup = new FormGroup({
    certificacionesFormGroup: new FormGroup({}),
  });
  /**
   * Almacena los datos de configuración para certificaciones.
   * 
   * Esta propiedad se inicializa con el valor de `CONFIGURACION_DATOS`, que contiene
   * la configuración y la información necesaria para gestionar las certificaciones dentro del componente.
   *
   * @see CONFIGURACION_DATOS para la estructura y detalles de la configuración.
   */
  public certificacionesDatos = CONFIGURACION_DATOS;
  /**
   * Lista de secciones dinámicas para el componente de perfiles, cada una representa
   * una categoría de seguridad en la cadena de suministros. Cada sección contiene un título
   * descriptivo y la clase del componente asociado que se renderiza en el acordeón.
   *
   * Las secciones incluyen temas como planeación de seguridad, seguridad física,
   * controles de acceso, socios comerciales, procesos, gestión aduanera, vehículos,
   * seguridad del personal, información y documentación, capacitación y manejo de incidentes.
   *
   * @type {SeccionDinamica[]}
   */
  public accordionSecciones: SeccionDinamica[] = [
  {
    titulo: '1. Planeación de la seguridad en la cadena de suministros.',
    componentClase: PlaneacionComponent
  },
  {
    titulo: '2. Seguridad física',
    componentClase: SeguridadFisicaComponent
  },
  {
    titulo: '3. Controles de acceso físico',
    componentClase: ControlesDeAccesoComponent
  },
  {
    titulo: '4. Socios comerciales',
    componentClase: SociosComercialesComponent
  },
  {
    titulo: '5. Seguridad de procesos',
    componentClase: SeguridadDeProcesosComponent
  },
  {
    titulo: '6. Gestión aduanera',
    componentClase: GestionAduaneraComponent
  },
  {
    titulo: '7. Seguridad de los vehículos de carga, contenedores, remolques y/ó semirremolques.',
    componentClase: VehiculosComponent
  },
  {
    titulo: '8. Seguridad del personal',
    componentClase: SeguridadDelPersonalComponent
  },
  {
    titulo: '9. Seguridad de la información y documentación',
    componentClase: SeguridadDeLaComponent
  },
  {
    titulo: '10. Capacitación en seguridad y concientización',
    componentClase: ConcientizacionComponent
  },
  {
    titulo: '11. Manejo e investigación de incidentes',
    componentClase: ManejoComponent
  }
];
  /**
   * Subject utilizado para notificar y completar las suscripciones al limpiar cuando el componente se destruye.
   * Emite un valor void para señalar la finalización de los observables.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Representa el estado actual de la solicitud para el proceso 32612.
   * Esta propiedad contiene toda la información relevante y el estado de la solicitud.
   *
   * @type {Solicitude32612DosState}
   */
  public solicitudeState!: Solicitude32612DosState;
  /**
   * Almacena el estado actual del formulario de solicitud para el trámite 32612.
   *
   * @type {Solicitude32612State}
   */
  public solicitudeStateForm!: Solicitude32612State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando se establece en `true`, los campos del formulario no son editables por el usuario.
   */
  public esFormularioSoloLectura: boolean = false;


  /**
   * Inicializa el PerfilesComponent con los servicios requeridos y configura una suscripción
   * al observable de estado de consultaioQuery. Actualiza la bandera `esFormularioSoloLectura`
   * y recrea el formulario cada vez que cambia el estado de consultaio.
   *
   * @param fb - FormBuilder de Angular para construir formularios reactivos.
   * @param tramite32612Store - Servicio Store para gestionar el estado relacionado con el trámite 32612.
   * @param tramite32612Query - Servicio Query para acceder al estado del trámite 32612.
   * @param tramiteStore - Servicio Store para gestionar el estado general del trámite.
   * @param tramiteQuery - Servicio Query para acceder al estado general del trámite.
   * @param consultaioQuery - Servicio Query para acceder al estado de consultaio.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32612Store: Tramite32612DosStore,
    private tramite32612Query: Tramite32612DosQuery,
    private tramiteStore: Tramite32612Store,
    private tramiteQuery: Tramite32612Query,
    private consultaioQuery: ConsultaioQuery
  ) {
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.crearFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de un componente.
   * 
   * Se suscribe a los observables `selectSolicitudeDos$` y `selectSolicitude$` para actualizar las propiedades locales de estado
   * (`solicitudeState` y `solicitudeStateForm`) cada vez que sus valores cambian. Las suscripciones se cancelan automáticamente
   * cuando el componente se destruye utilizando el observable `destroyNotifier$`.
   * También inicializa el formulario llamando a `crearFormulario()`.
   */
  ngOnInit() {
    this.tramite32612Query.selectSolicitudeDos$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudeState = seccionState;
        })
      ).subscribe();

    this.tramiteQuery.selectSolicitude$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudeStateForm = seccionState;
        })
      ).subscribe();
    this.crearFormulario();
  }

  /**
   * Obtiene la instancia de `FormGroup` asociada al control 'certificacionesFormGroup'
   * del formulario principal (`forma`). Normalmente se utiliza para acceder o manipular
   * el grupo de controles relacionados con certificaciones dentro del formulario.
   *
   * @returns El `FormGroup` correspondiente a 'certificacionesFormGroup'.
   */
  get certificacionesFormGroup(): FormGroup {
    return this.forma.get('certificacionesFormGroup') as FormGroup;
  }

  /**
   * Inicializa el FormGroup `formaPerfil` con controles para la información del perfil de la agencia.
   * Cada control se pre-puebla con valores del `solicitudeState` actual si está disponible.
   * 
   * El formulario incluye los siguientes campos:
   * - nombreAgenciaAduanal: Nombre de la agencia aduanal.
   * - tipoInstalacion: Tipo de instalación.
   * - antiguedadInstalacion: Antigüedad de la instalación.
   * - actividadPreponderante: Actividad preponderante.
   * - tiposServicios: Tipos de servicios ofrecidos.
   * - operacionesMensualesExp: Operaciones mensuales de exportación.
   * - operacionesMensualesImp: Operaciones mensuales de importación.
   * - numeroEmpleados: Número de empleados.
   * - superficieInstalacion: Superficie de la instalación.
   * - opcion: Opción seleccionada.
   * - nombrePrograma: Nombre del programa.
   * - numeroDeRegistro: Número de registro.
   * - organismoCertificador: Organismo certificador.
   *
   * @private
   */
  private crearPerfilForm() {
    this.formaPerfil = this.fb.group({
      nombreAgenciaAduanal: [this.solicitudeState?.nombreAgenciaAduanal],
      tipoInstalacion: [this.solicitudeState?.tipoInstalacion],
      antiguedadInstalacion: [this.solicitudeState?.antiguedadInstalacion],
      actividadPreponderante: [this.solicitudeState?.actividadPreponderante],
      tiposServicios: [this.solicitudeState?.tiposServicios],
      operacionesMensualesExp: [this.solicitudeState?.operacionesMensualesExp],
      operacionesMensualesImp: [this.solicitudeState?.operacionesMensualesImp],
      numeroEmpleados: [this.solicitudeState?.numeroEmpleados],
      superficieInstalacion: [this.solicitudeState?.superficieInstalacion],
      opcion: [this.solicitudeState?.opcion],
      nombrePrograma: [this.solicitudeState?.nombrePrograma],
      numeroDeRegistro: [this.solicitudeState?.numeroDeRegistro],
      organismoCertificador: [this.solicitudeState?.organismoCertificador],
    });
  }

  /**
   * Establece un valor en el `tramite32612Store` invocando el método especificado con el valor
   * obtenido del control de formulario proporcionado.
   *
   * @param form - El `FormGroup` que contiene los controles del formulario.
   * @param campo - El nombre del control de formulario cuyo valor será obtenido.
   * @param metodoNombre - La clave del método en `Tramite32612DosStore` que será llamado con el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32612DosStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32612Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Emite un cambio de valor para un campo dinámico en el store de trámite.
   *
   * @param event - Un objeto que contiene el nombre del campo (`campo`) y su nuevo valor (`valor`).
   */
  public emitirCambioDeValor(event: {campo: string, valor: string}): void {
    this.tramiteStore.setDynamicFieldValue(event.campo, event.valor);
  }

  /**
   * Crea el formulario para el componente.
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), guarda los datos del formulario llamando a `guardarDatosFormulario()`.
   * De lo contrario, inicializa el formulario de perfil llamando a `crearPerfilForm()`.
   */
  public crearFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearPerfilForm();
    }
  }

  /**
   * Maneja el proceso de guardar los datos del formulario de perfil.
   * 
   * - Inicializa el formulario de perfil llamando a `crearPerfilForm()`.
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es `true`), deshabilita los controles del formulario.
   * - De lo contrario, habilita los controles del formulario para su edición.
   */
  public guardarDatosFormulario(): void {
    this.crearPerfilForm();
    if (this.esFormularioSoloLectura) {
      this.formaPerfil.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formaPerfil.enable();
    }
  }


  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a los suscriptores y limpiar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


}
