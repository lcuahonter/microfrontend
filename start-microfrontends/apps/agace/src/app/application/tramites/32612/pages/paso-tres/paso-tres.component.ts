import { Component, OnDestroy } from '@angular/core';
import { Subject,catchError, map, takeUntil } from 'rxjs';
import { EsquemaDeCertificacionService } from '../../services/esquema-de-certificacion.service';
import { Router } from '@angular/router';
import { TramiteAgaceStore } from '../../../../estados/tramite.store';

@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent implements OnDestroy {

  /**
  * property {Subject<void>} destroyed$
  * description Sujeto utilizado para manejar la destrucción de observables.
  * private
  */
 private destroyed$ = new Subject<void>();
 /**
  * Constructor del componente.
  *
  * @param router - Servicio de enrutamiento para la navegación.
  * @param certificadosSvc - Servicio para manejar trámites extraordinarios.
  * @param TramiteCofeprisStore - Store para gestionar el estado del trámite.
  */
 constructor(
   private router: Router,
   private comercioExteriorSvc: EsquemaDeCertificacionService,
   private tramiteAgaceStore: TramiteAgaceStore
 ) {
   // 
 }
    
 /**
  * Maneja el evento para obtener la firma del usuario.
  * Si la firma es válida, obtiene el trámite correspondiente
  * y redirige a la pantalla de acuse.
  *
  * @param ev - La cadena de texto que representa la firma obtenida.
  */
 obtieneFirma(ev: string): void {
   const FIRMA: string = ev;
 
   if (FIRMA) {
     // Obtiene el número de trámite y establece el trámite en el store
     this.comercioExteriorSvc
       .obtenerTramite(19)
       .pipe(
         map((tramite) => {
           this.tramiteAgaceStore.establecerTramite(tramite.data, FIRMA);
           // Redirige a la pantalla de acuse
           this.router.navigate(['servicios-extraordinarios/acuse']);
         }),
         catchError((_error) => {
           return _error;
         }),
         takeUntil(this.destroyed$) 
       )
       .subscribe();
   }
 }
     
   /**
    * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
    * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
    */
   ngOnDestroy(): void {
     this.destroyed$.next();
     this.destroyed$.complete();
   }


}
