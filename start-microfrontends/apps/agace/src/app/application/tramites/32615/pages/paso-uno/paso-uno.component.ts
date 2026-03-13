import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { Solicitud32615Service } from '../../services/service32615.service';

/**
 * Componente correspondiente al primer paso del flujo del trámite.
 * Se encarga de gestionar la selección de pestañas y la configuración del solicitante.
 *
 * @export
 * @class PasoUnoComponent
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {

  /**
   * Índice para manejar la pestaña seleccionada.
   * Este valor determina cuál pestaña está activa en la interfaz de usuario.
   *
   * @type {number}
   * @memberof PasoUnoComponent
   */
  indice: number = 1;
  
  /**
   * Indica si ya se cargaron los datos de respuesta para mostrar en el formulario.
   */
  public esDatosRespuesta: boolean = false;
  
   /**
   * Observable para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Decorador `ViewChild` para acceder a la instancia del componente `SolicitanteComponent`.
   * Este componente se utiliza para gestionar información relacionada con el solicitante.
   *
   * @type {SolicitanteComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

     /**
   * Constructor del componente. Se inyectan servicios y queries necesarios para el flujo de datos.
   * @param consultaQuery Consulta a los datos del store.
   * @param solocitud31601Service Servicio para carga y actualización de datos del formulario.
   */
   constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud32615Service: Solicitud32615Service,
  ) {}

  
   /**
   * Hook de inicialización del componente. Verifica el estado de actualización del store
   * y carga datos en caso necesario.
   */
   ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
            this.guardarDatosFormularioPerfiles();
            this.guardarDatosFormularioMensajeria();
            this.guardarDatosFormularioPerfilesMensajeria();
            this.guardarDatosFormularioTerceros();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();    
  }

   /**
   * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
   * También establece la bandera de datos cargados en verdadero.
   */
    guardarDatosFormulario(): void {
      this.solocitud32615Service
        .getRegistroTomaMuestrasMercanciasData()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.solocitud32615Service.actualizarEstadoFormulario(resp);
          }
        });
    }
    /**
   * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
   * También establece la bandera de datos cargados en verdadero.
   */
    guardarDatosFormularioPerfiles(): void {
      this.solocitud32615Service
        .getRegistroTomaMuestrasMercanciasDataPerfiles()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.solocitud32615Service.actualizarEstadoFormularioPerfiles(resp);
          }
        });
    }
    /**
   * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
   * También establece la bandera de datos cargados en verdadero.
   */
    guardarDatosFormularioMensajeria(): void {
      this.solocitud32615Service
        .getRegistroTomaMuestrasMercanciasDataMensajeria()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.solocitud32615Service.actualizarEstadoFormularioMensajeria(resp);
          }
        });
    }
    /**
   * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
   * También establece la bandera de datos cargados en verdadero.
   */
    guardarDatosFormularioPerfilesMensajeria(): void {
      this.solocitud32615Service
        .getRegistroTomaMuestrasMercanciasDataPerfilesMensajeria()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.solocitud32615Service.actualizarEstadoFormularioPerfilesMensajeria(resp);
          }
        });
    }
    /**
   * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
   * También establece la bandera de datos cargados en verdadero.
   */
    guardarDatosFormularioTerceros(): void {
      this.solocitud32615Service
        .getRegistroTomaMuestrasMercanciasDataTerceros()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.solocitud32615Service.actualizarEstadoFormularioTerceros(resp);
          }
        });
    }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
   * En este método se llama al componente `SolicitanteComponent` para establecer el tipo de persona.
   *
   * @memberof PasoUnoComponent
   */
  ngAfterViewInit(): void {
    // Llama al método para obtener el tipo de persona (en este caso, una persona moral nacional)
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Permite que el usuario seleccione una pestaña cambiando el valor de `indice`.
   * 
   * @param {number} indice - El índice de la pestaña seleccionada.
   * @memberof PasoUnoComponent
   */
  seleccionaTab(indice: number): void {
    // Establece el índice de la pestaña seleccionada
    this.indice = indice;
  }
  /**
   * Hook de destrucción del componente. Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
