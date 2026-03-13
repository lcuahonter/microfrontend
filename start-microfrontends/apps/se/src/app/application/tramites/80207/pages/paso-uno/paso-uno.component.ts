import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject,takeUntil } from 'rxjs';
import { Component } from '@angular/core';
import {EmpresasSubFabricanteComponent} from '../../components/empresas-submanufactureras/empresas-subfabricante.component';
import{ OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import{SubfabricanteService} from '../../servicios/servicios-subfabricante.service';
import { ViewChild } from '@angular/core';
/**
 * @fileoverview Componente para la gestión del paso uno.
 * Este componente maneja la lógica y la presentación del primer paso del proceso,
 * incluyendo la inicialización de textos y la gestión de los controles del formulario.
 * @module pasoUno --80207
 */

/**
 * Componente para la gestión del paso uno.
 * @class PasoUnoComponent --80207
 */

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  providers: [SubfabricanteService]
})
export class PasoUnoComponent implements OnInit, OnDestroy {
   /**
   * Índice del paso actual.
   * @property {number} indice
   */
  indice: number = 1;

  /**
   * Indica si los datos de respuesta están disponibles.
   * Valor inicial: false.
   */

  public esDatosRespuesta: boolean = false;

  /**
   * Estado de la consulta actual.
   * Este estado se obtiene a través de ConsultaioQuery.
   */

  public consultaState!: ConsultaioState;

  /**
   * Subject para notificar la destrucción del componente.
   * Se utiliza para limpiar suscripciones y evitar fugas de memoria.
   */

  public destroyNotifier$: Subject<void> = new Subject();

   /**
   * Selecciona una pestaña del wizard.
   * @method seleccionaTab
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

   /**
   * Referencia al componente `solicitudComponent`.
   */
   @ViewChild('solicitudComponent', { static: false }) solicitudComponent: EmpresasSubFabricanteComponent| undefined;

     /**
 * @property solicitante - Referencia al componente `SolicitanteComponent` que se utiliza para manejar
 *                          la lógica y los datos relacionados con el solicitante en este paso del trámite.
 * @command Este decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
 */
  @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;

   /**

  /**
   * Constructor del componente.
   * Inicializa los servicios necesarios.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado actual.
   * @param {SubfabricanteService} subfabricanteService - Servicio para manejar datos de subfabricantes.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private subfabricanteService: SubfabricanteService,
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta para actualizar los datos del formulario según sea necesario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.subscribe((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState.update || this.consultaState.readonly) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    });
  }

  /**
   * Valida todos los formularios del paso uno.
   * 
   * Este método valida principalmente el formulario de solicitante que es el único
   * obligatorio. Los otros formularios solo se validan si están disponibles.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario.
   */
public validarTodosLosFormularios(): boolean {
  let allFormsValid = true;
  
  if (this.solicitante?.form && this.solicitante) {
    if (this.solicitante.form.invalid) {
      this.solicitante.form.markAllAsTouched();
      allFormsValid = false;
    }
  }
  else{
    allFormsValid = false;
  }
  
  if (this.solicitudComponent) {
    if (!this.solicitudComponent.validarCampos()) {
      allFormsValid = false;
    }
  }
    else{
    allFormsValid = false;
  }
  
  
  return allFormsValid;
}
  /**
   * Guarda los datos del formulario utilizando el servicio de ampliación de servicios.
   */
  guardarDatosFormulario(): void {
    this.subfabricanteService
    .getServiciosData().pipe(
      takeUntil(this.destroyNotifier$)
    )
    .subscribe((resp) => {
      if(resp) {
       this.esDatosRespuesta = true;
       this.subfabricanteService.actualizarEstadoFormulario(resp);

      }
    });
    }
   /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}
}
