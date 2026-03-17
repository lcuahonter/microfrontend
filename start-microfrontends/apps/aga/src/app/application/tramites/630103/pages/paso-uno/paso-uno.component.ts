/**
 * paso-uno.component.ts
 * Componente que representa el primer paso en un proceso de múltiples pasos para el trámite 630103.
 * Permite inicializar el estado, gestionar la selección de pestañas y actualizar datos del formulario.
 */

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { map, takeUntil } from 'rxjs';
import { AutorizacionImportacionTemporalService } from '../../services/autorizacion-importacion-temporal.service';
import {SolicitudComponent} from '../solicitud/solicitud.component';

/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone: false,
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Indica si los datos de respuesta del servidor están disponibles para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones activas.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta actual, obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

   /**
   * @property {SolicitudComponent} solicitudComponent
   * @description
   * Referencia al componente hijo `SolicitudComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de pago de derechos,
   * especialmente para validar la información de pago y llave de pago.
   */
   @ViewChild('datosSolicitud') datosSolicitud!:SolicitudComponent;


  /**
   * El índice de la pestaña actualmente seleccionada.
   */
  indice: number = 1;

  /**
   * Selecciona una pestaña estableciendo su índice.
   * i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Constructor del componente.
   * autorizacionImportacionTemporalService - Servicio para obtener y actualizar datos del formulario.
   * consultaQuery - Query para observar el estado de la consulta.
   */
  constructor(
    private autorizacionImportacionTemporalService: AutorizacionImportacionTemporalService,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta y decide si cargar datos o mostrar respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.autorizacionImportacionTemporalService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.esDatosRespuesta = true;
        this.autorizacionImportacionTemporalService.actualizarEstadoFormulario(resp);
      });
  }

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método obtenerTipoPersona del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }
  /*
  * Valida los formularios del solicitante y de datos de solicitud.
  * @returns {string} - Indica el resultado de la validación:
  * */
  public validarFormularios(): boolean {
    
    let isValid = true;
    if (this.datosSolicitud) {
      if (!this.datosSolicitud.validarFormulario()) {
       
       
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;

  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}