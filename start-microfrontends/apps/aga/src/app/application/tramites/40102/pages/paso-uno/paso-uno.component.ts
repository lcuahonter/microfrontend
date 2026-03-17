
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChoferesExtranjeros, DatosDelChoferNacional } from '../../models/registro-muestras-mercancias.model';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, SolicitanteComponent } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { ReplaySubject, Subject, map, takeUntil } from 'rxjs';
import { Chofer40102Service } from '../../estados/chofer40102.service';

import { Chofer40102Store, Choferesnacionales40102State } from '../../estados/chofer40102.store';
import { Chofer40102Query } from '../../estados/chofer40102.query';

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
   * Booleano para mostrar u ocultar el componente de director general.
   */
  isShowDirector: boolean = false;

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
   * Propiedad de entrada que representa el número de pedimento.
   * Este valor es proporcionado desde el componente padre y se utiliza
   * para mostrar o procesar información relacionada con el pedimento.
   */
  @Input() datosNroPedimento!: string;

  /**
   * Notificador para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * Se utiliza para limpiar recursos cuando el componente se destruye.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /**
* @property {ConsultaioState} consultaDatos
* @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
*/
  consultaDatos!: ConsultaioState;


  /**
   * Subject para destruir las suscripciones y evitar fugas de memoria de los datos del solicitante.
   */
  private destroySolicitante$ = new Subject<void>();
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
   *
   */
  constructor(
    private chofer40102Service: Chofer40102Service,
    private chofer40102Store: Chofer40102Store,
    private consultaQuery: ConsultaioQuery,
    private chofer40102Query: Chofer40102Query
  ) {

  }

  /**
   * Método del ciclo de vida de Angular que se llama al inicializar el componente.
   * Se utiliza para suscribirse a los cambios en el estado de la consulta
   * y cargar los datos necesarios para el formulario.
   * @returns void
   */
  ngOnInit(): void {
    this.chofer40102Query.selectSolicitud$
      .pipe(takeUntil(this.destroySolicitante$))
      .subscribe((data: Choferesnacionales40102State) => {
        this.isShowDirector = data?.isShowDirector;
      });
  
    this.esDatosRespuesta = true;
   
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {

    this.chofer40102Service
      .getDirectorGeneralData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        // Actualiza el estado del chofer40102Store con los datos del director general
        this.chofer40102Service.updateStateDirectorGeneralData(data);
        this.esDatosRespuesta = true;
      });

    this.chofer40102Service
      .obtenerTablaDatos<DatosDelChoferNacional>('mock-data-choferes-nacionales.json')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.chofer40102Service.updateDatosDelChoferNacional(response);
        this.chofer40102Service.updateDatosDelChoferNacionalModification(response);
        this.chofer40102Service.updateDatosDelChoferNacionalRetirada(response);
        this.esDatosRespuesta = true;
      });

    this.chofer40102Service
      .obtenerTablaDatos<ChoferesExtranjeros>('mock-data-choferes-extranjero.json')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.chofer40102Service.updateDatosDelChoferExtranjero(response);
        this.chofer40102Service.updateDatosDelChoferExtranjeroModification(response);
        this.chofer40102Service.updateDatosDelChoferExtranjeroRetirada(response);
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
  }

}
