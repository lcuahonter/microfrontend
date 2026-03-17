import { AVISO, AlertComponent, ConsultaioQuery, TituloComponent, doDeepCopy, esValidArray, getValidDatos } from '@ng-mf/data-access-user';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud260605State, Tramite260605Store } from '../../../../estados/tramites/tramite260605.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModificatNoticeService } from '../../services/modificat-notice.service';
import { ReprestantanteData } from '../../models/aduaneras-informaciones.model';
import { Tramite260605Query } from '../../../../estados/queries/tramite260605.query';


@Component({
  selector: 'app-represtantante', // Selector del componente en la plantilla HTML
  templateUrl: './representante.component.html', // Ruta a la plantilla HTML
  styleUrl: './representante.component.scss', // Ruta al archivo de estilos SCSS
  standalone: true, // Define que el componente puede funcionar de forma independiente (sin módulo específico)
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, FormsModule], // Módulos y componentes necesarios
})
/**
 * Componente para gestionar el formulario reactivo de los datos del representante.
 * Implementa las interfaces OnInit y OnDestroy para manejar el ciclo de vida del componente.
 * 
 * @class
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export class RepresentanteComponent implements OnInit, OnDestroy, OnChanges {
  /** 
   * Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. 
   */
  @Input() isContinuarTriggered: boolean = false;
  /**
   * Formulario reactivo para los datos del representante.
   * 
   * @type {FormGroup}
   * @memberof RepresentanteComponent
   */
  representante!: FormGroup;

  /**
   * Estado de la solicitud.
   * 
   * @type {Solicitud260605State}
   * @memberof RepresentanteComponent
   */
  public solicitudState!: Solicitud260605State;

  /**
   * Constantes importadas desde el archivo de enumeración para los mensajes de advertencia.
   * 
   * @type {Aviso}
   * @memberof RepresentanteComponent
   */
  public ADVERTENCIA = AVISO;

  /**
   * Sujeto para notificar la destrucción del componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof RepresentanteComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Datos de prueba del representante.
   * 
   * @type {ReprestantanteData}
   * @memberof RepresentanteComponent
   */
  ReprestantanteData: ReprestantanteData = {
    rfc: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  };

  /**
   * Constructor del componente.
   * 
   * @param {FormBuilder} fb - Instancia de FormBuilder para la creación de formularios.
   * @param {Tramite260605Store} tramite260605Store - Store para gestionar el estado del trámite.
   * @param {Tramite260605Query} tramite260605Query - Query para obtener el estado del trámite.
   * @memberof RepresentanteComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite260605Store: Tramite260605Store,
    private tramite260605Query: Tramite260605Query,
    private modificatNoticeService: ModificatNoticeService,
    private consultaioQuery: ConsultaioQuery
  ) {
    /**
         * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
         *
         * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
         * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
         * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
         */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo `aduanerasInformacionesForm` con los valores actuales del estado de la solicitud.
   * 
   * Suscribe al observable `selectSolicitud$` para obtener el estado más reciente de la solicitud y lo asigna a `solicitudState`.
   * Luego, crea el formulario utilizando los valores de `solicitudState` y aplica las validaciones requeridas.
   * 
   * @remarks
   * - Utiliza el operador `takeUntil` para limpiar la suscripción cuando el componente se destruye.
   * - Los campos del formulario incluyen `numeroDePermiso` y `cstumbresAtuales`, ambos requeridos.
   */
  inicializarFormulario(): void {
    this.tramite260605Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.representante = this.fb.group({
      rfc: [this.solicitudState?.rfc, Validators.required],
      nombre: [this.solicitudState?.nombre, Validators.required],
      apellidoPaterno: [this.solicitudState?.apellidoPaterno, Validators.required],
      apellidoMaterno: [this.solicitudState?.apellidoMaterno, Validators.required],
    });
    this.representante.get('nombre')?.disable();
    this.representante.get('apellidoPaterno')?.disable();
    this.representante.get('apellidoMaterno')?.disable();
  }

  /**
    * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
    * Luego reinicializa el formulario con los valores actualizados desde el store.
    */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.representante.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.representante.enable();
    }
  }


  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }



  /**
   * Método que se ejecuta al iniciar el componente.
   * 
   * @memberof RepresentanteComponent
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

/**
 * Detecta cambios en las propiedades de entrada del componente y ejecuta validaciones cuando se activa el botón continuar.
 * Utiliza Promise.resolve() para asegurar que la validación se ejecute en el próximo ciclo del event loop.
 */
  ngOnChanges(): void {
    if (this.isContinuarTriggered) {
      Promise.resolve().then(() => {
        this.representante.markAllAsTouched();
      });
    }
  }


  /**
   * Método para obtener los datos disponibles de los representantes.
   * Realiza una solicitud al servicio `modificatNoticeService` para recuperar
   * la información de los representantes y la asigna a la propiedad `ReprestantanteData`.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  public obtenerAduanasDisponiblesDatos(): void {
    const PAYLOAD = {
      "rfcRepresentanteLegal": this.representante.get('rfc')?.value
    }
    this.modificatNoticeService.ObtenerReprestantanteData(PAYLOAD)
      .pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe((response) => {
          const DATOS = doDeepCopy(response);
          if(esValidArray(DATOS.datos)) {
            this.representante.patchValue({
                nombre: getValidDatos(DATOS.datos[0].nombre) ? DATOS.datos[0].nombre : '',
                apellidoPaterno: getValidDatos(DATOS.datos[0].apellidoPaterno) ? DATOS.datos[0].apellidoPaterno : '',
                apellidoMaterno: getValidDatos(DATOS.datos[0].apellidoMaterno) ? DATOS.datos[0].apellidoMaterno : '',
            });
            this.setValoresStore(this.representante,'nombre', 'setNombre');
            this.setValoresStore(this.representante,'apellidoPaterno', 'setApellidoPaterno');
            this.setValoresStore(this.representante,'apellidoMaterno', 'setApellidoMaterno');
          }
      });
  }

  /**
   * Establece valores en el store.
   * 
   * @param {FormGroup} form - El grupo de formularios.
   * @param {string} campo - El nombre del campo.
   * @param {keyof Tramite260605Store} metodoNombre - El nombre del método del store.
   * @memberof RepresentanteComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260605Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260605Store[metodoNombre] as (value: string) => void)(VALOR);
    this.tramite260605Store.setFormValidity('representanteLegal',this.representante.valid);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * @memberof RepresentanteComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}