
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL,
  FormularioDinamico,
  PERSONA_MORAL_NACIONAL,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { ReplaySubject, Subject, map, takeUntil } from 'rxjs';
import { Chofer40101Service } from '../../estado/chofer40101.service';
import { Tramite40101Query } from '../../estado/tramite40101.query';
import {
  ApiResponseSolicitante,
  ChoferesExtranjeros,
  DatosDelChoferNacional,
} from '../../models/registro-muestras-mercancias.model';

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
 * Referencia al componente hijo `SolicitanteComponent` dentro de la plantilla.
 * Permite acceder a las propiedades y métodos públicos del componente hijo.
 *
 * @type {SolicitanteComponent}
 */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  /**
   * Representa el tipo de persona asociado.
   * 
   * @type {number}
   * @remarks
   * Este valor puede ser utilizado para determinar el tipo de persona
   * (por ejemplo, física o moral) en el contexto de la aplicación.
   */
  tipoPersona!: number;


  /**
   * Arreglo que contiene objetos de tipo FormularioDinamico.
   * Representa la información relacionada con una persona en el formulario dinámico.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Arreglo que contiene los formularios dinámicos relacionados con el domicilio fiscal.
   * Este arreglo se utiliza para almacenar y gestionar los datos del formulario
   * en el paso uno del trámite.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice que representa un número inicial o posición en un flujo o proceso.
   * Se utiliza para controlar el estado o paso actual en la lógica de la aplicación.
   */
  indice: number = 1;

  /**
   * Indica si la validación es exitosa o no.
   * 
   * @type {boolean}
   * @default false
   */
  validacion: boolean = false;

  /**
     * Booleano para mostrar u ocultar el componente de director general.
     */
  isShowDirector: boolean = false;

  /**
   * Subject para destruir las suscripciones y evitar fugas de memoria de los datos del solicitante.
   */
  private destroySolicitante$ = new Subject<void>();

  /**
   * Propiedad de entrada que representa el número de pedimento.
   * Este valor es proporcionado desde el componente padre y se utiliza
   * para mostrar o procesar información relacionada con el pedimento.
   */
  @Input() datosNroPedimento!: string;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
  * @property {ConsultaioState} consultaDatos
  * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
  */
  consultaDatos!: ConsultaioState;

  /**
   * Gancho de ciclo de vida angular que se llama después de que la vista del componente se haya inicializado por completo.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
  }

  /**
   * Selecciona una pestaña.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Constructor del componente `PasoUnoComponent`.
   * 
   * @param chofer40101Service Servicio para gestionar los datos del chofer.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   * @param tramite40101Query Consulta para obtener el estado del trámite 40101.
   */
  constructor(
    private chofer40101Service: Chofer40101Service,
    private consultaQuery: ConsultaioQuery,
    private tramite40101Query: Tramite40101Query
  ) {
    // Lógica para el constructor si es necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializar el componente.
   * Se utiliza para suscribirse a los cambios en el estado del Consultatio
   * y cargar los datos necesarios para el componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })).subscribe();

    if (this.consultaDatos.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    this.tramite40101Query.solicitanteData$.pipe(takeUntil(this.destroySolicitante$)).subscribe((data: ApiResponseSolicitante['datos']) => {
      this.isShowDirector = data.mostrar_director_general;
    })
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.esDatosRespuesta = true
    this.chofer40101Service
      .obtenerTablaDatos<DatosDelChoferNacional>('mock-data-choferes-nacionales.json')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.chofer40101Service.loadInitialDrivers('nacional', response);
        this.esDatosRespuesta = true;

      });

    this.chofer40101Service
      .obtenerTablaDatos<ChoferesExtranjeros>('mock-data-choferes-extranjero.json')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.chofer40101Service.loadInitialDrivers('extranjero', response);
        this.esDatosRespuesta = true;
      });
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.destroySolicitante$.next();
    this.destroySolicitante$.complete();
  }
}
