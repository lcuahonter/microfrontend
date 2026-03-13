import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, Subject, map, takeUntil } from 'rxjs';
import { Solicitud140205State, Solicitud140205Store } from '../../estados/store/solicitud140205.store';
import { BUSCAR_EMPRESA_ERROR } from '../../constants/detalle.enum';
import { CommonModule } from '@angular/common';
import { REGEX_RFC } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Solicitud140205Query } from '../../estados/query/solicitud140205.query';
import { Solicitud140205Service } from '../../services/service140205.service';
import { TituloComponent } from '@libs/shared/data-access-user/src';


/**
 * @component
 * @name DatosEmpresaComponent
 * @description
 * Componente encargado de gestionar los datos de la empresa en el formulario de solicitud.
 * Este componente utiliza un formulario reactivo para capturar y validar la información de la empresa.
 *
 * @selector datos-empresa
 * @templateUrl ./datos-empresa.component.html
 * @styleUrl ./datos-empresa.component.scss
 * @standalone true
 * @imports [TituloComponent, ReactiveFormsModule]
 */
@Component({
  selector: 'datos-empresa',
  templateUrl: './datos-empresa.component.html',
  styleUrl: './datos-empresa.component.scss',
  standalone: true,
  imports: [TituloComponent, ReactiveFormsModule, CommonModule],
})
export class DatosEmpresaComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * Subject utilizado para gestionar la destrucción de suscripciones
   * y evitar fugas de memoria en el ciclo de vida del componente.
   *
   * @private
   * @type {ReplaySubject<boolean>}
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Evento de salida que emite un valor booleano al realizar
   * la búsqueda de empresa.
   *
   * @event
   * @type {EventEmitter<boolean>}
   */
  @Output() datosEmpresaBuscar = new EventEmitter<boolean>();

  /**
   * @property {FormGroup} solicitudForm
   * @description Grupo de formulario para gestionar los datos de la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * @property {boolean} mostrarDatosGenerales
   * @description Indica si se deben mostrar los datos generales de la empresa.
   */
  mostrarDatosGenerales: boolean = false;

  /**
   * @property {Solicitud140205State} solicitudState
   * @description Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud140205State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Notificador para destruir las suscripciones y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Mensaje de error que se genera al intentar realizar
   * la búsqueda de una empresa sin los parámetros requeridos
   * o cuando ocurre un fallo en la operación.
   *
   * @type {string}
   * @default ''
   */
  BUSCAR_EMPRESA_ERROR: string = '';

  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite140205Store} store - Store para gestionar el estado de la solicitud.
   * @param {Tramite140205Query} query - Query para obtener el estado de la solicitud.
   * @param {CancelacionCertificadosService} validacionesService - Servicio para validaciones adicionales.
   */
  constructor(
    private fb: FormBuilder,
    private store: Solicitud140205Store,
    private query: Solicitud140205Query,
    private servicio: Solicitud140205Service,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * @method ngOnInit
   * @description Método que se ejecuta al inicializar el componente.
   * Configura las suscripciones y el formulario inicial.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.solicitudForm?.get('grupoEmpresa')?.patchValue({
            nombre: this.solicitudState?.grupoEmpresa?.nombre,
            primerApellido: this.solicitudState?.grupoEmpresa?.primerApellido,
            segundoApellido: this.solicitudState?.grupoEmpresa?.segundoApellido,
            actividadEconomica:
              this.solicitudState?.grupoEmpresa?.actividadEconomica,
            datosRfc: this.solicitudState?.grupoEmpresa?.datosRfc,
            clave: this.solicitudState?.grupoEmpresa?.clave,
            correo: this.solicitudState?.grupoEmpresa?.correo,
            calle: this.solicitudState?.grupoEmpresa?.calle,
            numeroExterior: this.solicitudState?.grupoEmpresa?.numeroExterior,
            numeroInterior: this.solicitudState?.grupoEmpresa?.numeroInterior,
            codigoPostal: this.solicitudState?.grupoEmpresa?.codigoPostal,
            colonia: this.solicitudState?.grupoEmpresa?.colonia,
            pais: this.solicitudState?.grupoEmpresa?.pais,
            estado: this.solicitudState?.grupoEmpresa?.estado,
            localidad: this.solicitudState?.grupoEmpresa?.localidad,
            municipio: this.solicitudState?.grupoEmpresa?.municipio,
            telefono: this.solicitudState?.grupoEmpresa?.telefono,
          });
        })
      )
      .subscribe();
    this.initImpresaDatosFormulario();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Destruye el componente y libera recursos.
   *
   * Este método se llama cuando el componente se destruye, asegurando que no queden suscripciones activas.
   */
  inicializarFormulario(): void {
    if (this.soloLectura) {
      this.solicitudForm.disable();
      this.mostrarDatosGenerales = true;
    } else {
      this.solicitudForm.enable();
    }
  }

  /**
   * Maneja el cambio en el campo RFC.
   *
   * Este método se llama cuando el valor del campo RFC cambia y se encarga de
   * validar el nuevo valor ingresado.
   *
   * @param $event - Evento de cambio del campo RFC.
   */
  rfcChange($event: Event): void {
    const INPUT = ($event.target as HTMLInputElement).value;
    if (INPUT.length <=13 && REGEX_RFC.test(INPUT)) {
      this.BUSCAR_EMPRESA_ERROR = '';
      this.datosEmpresaBuscar.emit(false);
    } else {
      this.solicitudForm?.get('grupoEmpresa')?.get('rfc')?.markAsTouched();
      this.BUSCAR_EMPRESA_ERROR = BUSCAR_EMPRESA_ERROR;
      this.datosEmpresaBuscar.emit(true);
    }
  }

  /**
   * @method buscarEmpresa
   * @description Método para habilitar la visualización de los datos generales de la empresa.
   */
  buscarEmpresa(): void {
    const GRUPO_EMPRESA_CONTROL = this.solicitudForm?.get('grupoEmpresa');
    const RFC_CONTROL =
      GRUPO_EMPRESA_CONTROL instanceof FormGroup
        ? GRUPO_EMPRESA_CONTROL.get('rfc')
        : null;
        if(!RFC_CONTROL?.valid || (RFC_CONTROL.value as string).length > 13||!REGEX_RFC.test(RFC_CONTROL.value as string)){
          this.solicitudForm?.get('grupoEmpresa')?.get('rfc')?.markAsTouched();
          this.BUSCAR_EMPRESA_ERROR = BUSCAR_EMPRESA_ERROR;
          this.datosEmpresaBuscar.emit(true);
        }
        else{
          this.fetchGetDatos();
          this.mostrarDatosGenerales = true;
          this.BUSCAR_EMPRESA_ERROR = '';
          this.datosEmpresaBuscar.emit(false);
        }

   
  }

  /**
   * Hook del ciclo de vida de Angular que se ejecuta después de que la vista
   * y sus elementos hijos han sido inicializados.
   *
   * @description
   * - Deshabilita el grupo de formulario `grupoEmpresa`.
   * - Habilita el control específico `grupoEmpresa.rfc` dentro del formulario.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngAfterViewInit(): void {
    this.solicitudForm?.get('grupoEmpresa')?.disable();
    this.solicitudForm?.get('grupoEmpresa.rfc')?.enable();
  }

  /**
   * Método para obtener los datos de consulta del servicio.
   *  Este método realiza una llamada al servicio `CertificadosOrigenService`
   *  para obtener los datos necesarios para la consulta del certificado de origen.
   *  @returns {void}
   *  @memberof PasoUnoComponent
   * */
  public fetchGetDatos(): void {
    this.servicio
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.store.setGrupoEmpresa(respuesta.datos.GrupoEmpresa);
        }
      });
  }

  /**
   * @method grupoEmpresa
   * @description Getter para obtener el grupo de formulario relacionado con los datos de la empresa.
   * @returns {FormGroup} Grupo de formulario de la empresa.
   */
  get grupoEmpresa(): FormGroup {
    return this.solicitudForm.get('grupoEmpresa') as FormGroup;
  }

  /**
   * @method initImpresaDatosFormulario
   * @description Inicializa el formulario reactivo con los datos de la empresa.
   */
  initImpresaDatosFormulario(): void {
    this.solicitudForm = this.fb.group({
      grupoEmpresa: this.fb.group({
        rfc: [
          this.solicitudState?.grupoEmpresa?.rfc,
          [Validators.required, Validators.maxLength(13), Validators.pattern(REGEX_RFC)],
        ],
        nombre: [
          { value: this.solicitudState?.grupoEmpresa?.nombre, disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        primerApellido: [
          {
            value: this.solicitudState?.grupoEmpresa?.primerApellido,
            disabled: true,
          },
          [Validators.required, Validators.minLength(3)],
        ],
        segundoApellido: [
          {
            value: this.solicitudState?.grupoEmpresa?.segundoApellido,
            disabled: true,
          },
          [Validators.required, Validators.minLength(3)],
        ],
        actividadEconomica: [
          {
            value: this.solicitudState?.grupoEmpresa?.actividadEconomica,
            disabled: true,
          },
          [Validators.required, Validators.minLength(3)],
        ],
        datosRfc: [
          {
            value: this.solicitudState?.grupoEmpresa?.datosRfc,
            disabled: true,
          },
          [Validators.required, Validators.minLength(3)],
        ],
        clave: [
          { value: this.solicitudState?.grupoEmpresa?.clave, disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        correo: [
          { value: this.solicitudState?.grupoEmpresa?.correo, disabled: true },
          [Validators.required, Validators.email],
        ],
        calle: [
          { value: this.solicitudState?.grupoEmpresa?.calle, disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        numeroExterior: [
          {
            value: this.solicitudState?.grupoEmpresa?.numeroExterior,
            disabled: true,
          },
          [Validators.required, Validators.minLength(1)],
        ],
        numeroInterior: [
          {
            value: this.solicitudState?.grupoEmpresa?.numeroInterior,
            disabled: true,
          },
          [Validators.required, Validators.minLength(1)],
        ],
        codigoPostal: [
          {
            value: this.solicitudState?.grupoEmpresa?.codigoPostal,
            disabled: true,
          },
          [Validators.required, Validators.minLength(5)],
        ],
        colonia: [
          { value: this.solicitudState?.grupoEmpresa?.colonia, disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        pais: [
          { value: this.solicitudState?.grupoEmpresa?.pais, disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        estado: [
          { value: this.solicitudState?.grupoEmpresa?.estado, disabled: true },
          [Validators.required, Validators.minLength(3)],
        ],
        localidad: [
          {
            value: this.solicitudState?.grupoEmpresa?.localidad,
            disabled: true,
          },
          [Validators.required, Validators.minLength(3)],
        ],
        municipio: [
          {
            value: this.solicitudState?.grupoEmpresa?.municipio,
            disabled: true,
          },
          [Validators.required, Validators.minLength(3)],
        ],
        telefono: [
          {
            value: this.solicitudState?.grupoEmpresa?.telefono,
            disabled: true,
          },
          [Validators.required, Validators.minLength(10)],
        ],
      }),
    });
    this.inicializarFormulario();
  }

  /**
   * @method setValoresStore
   * @description Actualiza el estado del store con el valor seleccionado en el formulario.
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El nombre del campo en el formulario.
   * @param {keyof Solicitud140205Store} metodoNombre - El nombre del método en el store para actualizar el estado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud140205Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * @method ngOnDestroy
   * @description Método que se ejecuta al destruir el componente.
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
