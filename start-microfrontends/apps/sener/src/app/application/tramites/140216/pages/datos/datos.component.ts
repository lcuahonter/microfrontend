import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';

import { BusquedaPermisosComponent } from '../../components/busqueda-permisos/busqueda-permisos.component';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { SuspensionPermisoService } from '../../services/suspension-permiso/suspension-permiso.service';
import { Tramite140216Store } from '../../estados/tramites/tramite140216.store';

/**
 * Componente para gestionar el paso uno del trámite.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styles: ``
})
export class DatosComponent implements OnInit, OnDestroy {
  /** 
   * Configuración del formulario para la persona moral 
   */
  persona: FormularioDinamico[] = [];

  /** 
   * Configuración del formulario para el domicilio fiscal 
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Referencia al componente de búsqueda de permisos.
   * @type {BusquedaPermisosComponent}
   */
  @ViewChild(BusquedaPermisosComponent) busquedaPermisosComponent!: BusquedaPermisosComponent;

  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Estado de la consulta, utilizado para manejar el estado del formulario.
   */
  public consultaState!: ConsultaioState;

  /** 
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   * @param consultaQuery - Consulta para obtener el estado de la consulta.
   * @param tramite140216Store - Store para manejar el estado del trámite 140216.
   * @param suspensionPermisoService - Servicio para manejar la suspensión de permisos.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite140216Store: Tramite140216Store,
    private suspensionPermisoService: SuspensionPermisoService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$),
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
   * Guarda los datos del formulario consultando el servicio de suspensión de permisos.
   * Este método se suscribe al servicio para obtener los datos y actualiza el estado del store.
   * @return {void}
   * @description Este método se encarga de obtener los datos del formulario desde el servicio
   */
  guardarDatosFormulario(): void {
    this.suspensionPermisoService
      .getConsultaSuspensionPermisoDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.tramite140216Store.setConsultaSuspensionPermisoState(resp);
        }
      });
  }

  /**
   * Selecciona la pestaña especificada.
   * 
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}