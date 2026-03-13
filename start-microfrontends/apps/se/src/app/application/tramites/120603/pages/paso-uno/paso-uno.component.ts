import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Solicitud120603State, Solicitud120603Store } from '../../estados/tramite120603.store';
import { Subject,map, takeUntil } from 'rxjs';
import { DatosEmpresaComponent } from '../../components/datos-empresa/datos-empresa.component';
import { RegistroComoEmpresaService } from '../../services/registro-como-empresa.service';
import { Solicitud120603Query } from '../../estados/tramite120603.query';

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

      /**
     * Referencia al componente DatosEmpresaComponent.
     * Se utiliza para acceder a las funcionalidades del componente de solicitud.
     * @type {DatosEmpresaComponent}
     */
    @ViewChild(DatosEmpresaComponent, { static: false })
    DatosEmpresaComponent!: DatosEmpresaComponent;
  /** Índice de la pestaña seleccionada. */
  indice: number = 1;
  
  /** Indica si los datos son una respuesta de consulta. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!:ConsultaioState;

  constructor(
    public solicitud120603Store: Solicitud120603Store,
    public solicitud120603Query: Solicitud120603Query,
    private registroComoEmpresa: RegistroComoEmpresaService,
    public consultaQuery: ConsultaioQuery,
  ) {
     
  }
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
   * Método para guardar los datos del formulario.
   * Obtiene los datos de la consulta y actualiza el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.registroComoEmpresa
      .getConsultaData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp: Solicitud120603State) => {
        if(resp){    
        this.esDatosRespuesta = true;
        this.registroComoEmpresa.actualizarEstadoFormulario(resp);
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
   * Método para manejar el evento de cambio de pestaña.
   * Actualiza el índice de la pestaña seleccionada.
   * @param i Índice de la pestaña a seleccionar.
   */
ngOnDestroy(): void {
  this.destroyNotifier$.next(); 
  this.destroyNotifier$.complete(); 
}
}
