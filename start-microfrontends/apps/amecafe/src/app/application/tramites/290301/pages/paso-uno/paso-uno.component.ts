import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject,map,takeUntil } from 'rxjs';
import { NacionalRegistroDelCafeExportadoresService } from '../../services/nacional-registro-del-cafe-exportadores.service';

import { Solicitud290301State, Solicitud290301Store } from '../../estados/tramite290301.store';
import { Solicitud290301Query } from '../../estados/tramite290301.query';

/**
 * Componente que representa el paso uno del trámite.
 * Gestiona la selección de pestañas en el proceso.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnInit,OnDestroy{
  /** Índice de la pestaña seleccionada. */
  indice: number = 1;

  /** Indica si se están mostrando los datos de respuesta. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!:ConsultaioState;

  constructor(
    public solicitud290301Store: Solicitud290301Store,
    public solicitud290301Query: Solicitud290301Query,
    private nacionalRegistroDelCafeExportadoresService: NacionalRegistroDelCafeExportadoresService,
    public consultaQuery: ConsultaioQuery,
  ) {
     
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta y actualiza el estado local.
   * Si el estado indica que se está actualizando, guarda los datos del formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if(this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
  /**
   * Método para inicializar el estado del formulario.
   * Actualiza el estado del formulario con los datos de la consulta.
   */
  guardarDatosFormulario(): void {
    this.nacionalRegistroDelCafeExportadoresService
      .getConsultaData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp: Solicitud290301State) => {
        if(resp){    
        this.esDatosRespuesta = true;
        this.nacionalRegistroDelCafeExportadoresService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método para seleccionar una pestaña específica.
   * Actualiza el índice de la pestaña seleccionada.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Notifica que el componente ha sido destruido y completa el Subject.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); 
    this.destroyNotifier$.complete(); 
  }
}
