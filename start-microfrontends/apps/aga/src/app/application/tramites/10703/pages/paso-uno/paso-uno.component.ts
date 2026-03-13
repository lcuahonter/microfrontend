import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExencionDeImpuestosComponent } from '../../components/exencionDeImpuestos/exencionDeImpuestos.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { Solocitud10703Service } from '../../services/service10703.service'
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, ExencionDeImpuestosComponent],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
    public esDatosRespuesta: boolean = false;
  
    /** Subject para notificar la destrucción del componente. */
    private destroyNotifier$: Subject<void> = new Subject();
    public consultaState!:ConsultaioState;
  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;
 constructor(
    private consultaQuery: ConsultaioQuery, private solocitud10703Service : Solocitud10703Service
  ) {
// Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
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
   * Selecciona la pestaña especificada.
   *
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solocitud10703Service
      .getExencionDeMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud10703Service.exencionDeMercancias(resp);
        }
      });
  }


/**
 * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
 * Emite un valor y completa el Subject `destroyNotifier$` para limpiar suscripciones activas.
 *
 * Se utiliza comúnmente junto con el operador `takeUntil` de RxJS
 * para evitar pérdidas de memoria al cancelar automáticamente las suscripciones.
 */
ngOnDestroy(): void {
  this.destroyNotifier$.next();
  this.destroyNotifier$.complete();
}

}
