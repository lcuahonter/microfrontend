import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { PermisoDeHidrocarburosService } from '../../services/permiso-de-hidrocarburos.service';
import { Solocitud130121Service } from '../../services/service130121.service';
import { ViewChild } from '@angular/core';

/**
 * Componente PasoUnoComponent
 *
 * Este componente se encarga de gestionar la selección de pestañas en la aplicación.
 * Posee una propiedad "indice" que representa la pestaña actualmente seleccionada y un método
 * "seleccionaTab" que permite actualizar dicha selección.
 *
 * @export
 * @class PasoUnoComponent
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
   * Índice de la pestaña seleccionada actualmente.
   *
   * Por defecto, se inicializa en 1.
   *
   * @type {number}
   * @memberof PasoUnoComponent
   */
  indice: number = 1;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Estado actual de la consulta obtenido desde el store.
 *
 * Esta propiedad almacena el estado completo de la consulta (`ConsultaioState`), 
 * el cual es actualizado mediante la suscripción al observable `selectConsultaioState$`
 * del servicio `ConsultaioQuery`. Se utiliza para determinar si se deben cargar datos
 * adicionales o mostrar información de respuesta en el formulario.
 *
 * @type {ConsultaioState}
 * @memberof PasoUnoComponent
 */
  public consultaState!: ConsultaioState;
/**
   * Referencia al componente `solicitudComponent`.
   */
@ViewChild('solicitudComponent', { static: false }) solicitudComponent: DatosSolicitudComponent | undefined;

  /**
   * Actualiza el índice de la pestaña seleccionada.
   *
   * Este método recibe un número que representa el índice de la pestaña a activar
   * y actualiza la propiedad "indice" con dicho valor.
   *
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   * @memberof PasoUnoComponent
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }


  /**
 * Constructor del componente PasoUnoComponent.
 *
 * Inyecta los servicios necesarios para la gestión de permisos de hidrocarburos, 
 * la manipulación de datos del trámite y la consulta del estado desde el store.
 * La inicialización específica se realiza en los métodos del ciclo de vida del componente.
 *
 * @param {PermisoDeHidrocarburosService} permisoDeHidrocarburosSvc Servicio para operaciones de permisos de hidrocarburos.
 * @param {Solocitud130121Service} solocitud130121Service Servicio para manipulación de datos del trámite 130121.
 * @param {ConsultaioQuery} consultaQuery Servicio para consultar el estado de la solicitud desde el store.
 * @memberof PasoUnoComponent
 */
  constructor(
    public permisoDeHidrocarburosSvc: PermisoDeHidrocarburosService,
    private solocitud130121Service: Solocitud130121Service,
    private consultaQuery: ConsultaioQuery
  ) { }

  /**
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 *
 * Se suscribe al observable `selectConsultaioState$` del servicio `ConsultaioQuery` para obtener el estado actual de la consulta
 * y actualizar la propiedad `consultaState`. Dependiendo del valor de `update` en el estado, decide si cargar los datos del formulario
 * o mostrar la información de respuesta.
 *
 * @memberof PasoUnoComponent
 */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
 /*
  /**
   * Valida el primer paso del formulario.
   *
   * Este método verifica si el componente hijo `solicitudComponent` está definido y llama a su método
   * `validarContenedor` para realizar la validación del formulario. Si el componente no está definido,
   * retorna `false` por defecto.
   *
   * @returns {boolean} - Retorna `true` si el formulario es válido, de lo contrario `false`.
   * @memberof PasoUnoComponent
   */
  
  validarPasoUno(): boolean {
    return (
      this.solicitudComponent?.validarContenedor() ?? false
    );
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solocitud130121Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solocitud130121Service.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para liberar recursos y evitar fugas de memoria, completando el Subject destroyNotifier$.
   * Esto asegura que todas las suscripciones que dependen de este Subject se cancelen correctamente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
