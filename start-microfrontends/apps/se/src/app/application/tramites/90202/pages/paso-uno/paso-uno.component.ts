import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AfterViewInit } from '@angular/core';
import { DomiciliosDePlantasComponent } from '../../components/domicilios-de-plantas/domicilios-de-plantas.component';
import { Inject } from '@angular/core';
import { SectoresMercanciasService } from '../../../../shared/services/sectores-mercancias.service';
import { SectoresYMercanciasComponent } from '../../components/sectores-y-mercancias/sectores-y-mercancias.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
/**
 * Componente que representa el primer paso del proceso de solicitud.
 * Contiene un componente de solicitante y permite la navegación entre tabs.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() loginRfc: string = '';
  @Input() tramiteId: string = '';

  idProcedimiento:number = 90202;
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

   /**
     * @property {DomiciliosDePlantasComponent} domiciliosDePlantas
     * @description Referencia al componente de la sección "Domicilios de plantas" del formulario.
     */
    @ViewChild('domiciliosRef') domiciliosDePlantas!: DomiciliosDePlantasComponent;

    /**
     * @property {SectoresYMercanciasComponent} sectoresYMercancias
     * @description Referencia al componente de la sección "Sectores y mercancías" del formulario.
     */
    @ViewChild('sectoresRef') sectoresYMercancias!: SectoresYMercanciasComponent;

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Índice del tab seleccionado.
   */
  indice: number = 1;

  /**
   * Método para seleccionar un tab.
   * @param i Índice del tab.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de consulta que contiene la información del formulario y su estado.
   * Se obtiene a través de la consulta ConsultaioQuery.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   * @param sectoresMercanciasServicio Servicio para manejar sectores y mercancías.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   */
  constructor(
    @Inject(SectoresMercanciasService) private sectoresMercanciasServicio: SectoresMercanciasService,
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta para obtener la información del formulario.
   * Si el estado indica que se está actualizando, se llama a `guardarDatosFormulario`.
   * De lo contrario, se establece `esDatosRespuesta` como verdadero.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState?.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
   * Método para guardar los datos del formulario.
   * Se suscribe al servicio `getRegistroTomaMuestrasMercanciasData` para obtener los datos del formulario.
   * Si la respuesta es válida, se actualiza el estado del formulario con los datos obtenidos.
   */
  guardarDatosFormulario(): void {
    this.sectoresMercanciasServicio
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.sectoresMercanciasServicio.actualizarEstadoFormulario(resp);
        }
      });
  }
/**
   * Valida todos los formularios del paso uno.
   * Retorna true si todos los formularios son válidos, false en caso contrario.
   */
    validarFormularios(): boolean {
     

      //const IS_DOMICILIOS_VALID = this.domiciliosDePlantas?.validarFormulario() ?? false;
      const IS_SECTORES_VALID = this.sectoresYMercancias?.validarFormulario() ?? false;
  
      return  IS_SECTORES_VALID;
    } 
  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Cancela las suscripciones activas y libera recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
