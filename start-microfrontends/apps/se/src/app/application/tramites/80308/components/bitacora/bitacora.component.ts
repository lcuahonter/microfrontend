import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src/core/utils/utilerias';
import { Bitacora } from '../../../../shared/models/bitacora.model';
import { BitacoraTablaComponent } from '../../../../shared/components/bitacora/bitacora.component';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80308Store } from '../../estados/tramite80308.store';

/**
 * @component BitacoraComponent
 * Componente para mostrar la bitácora de modificaciones
 */
@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss',
  standalone: true,
  imports: [
    BitacoraTablaComponent,
    ComplementariaImmexComponent,
  ],
  providers: [ModificacionSolicitudeService, ToastrService],
})
/**
 * @class BitacoraComponent
 * Clase del componente de bitácora
 */
export class BitacoraComponent implements OnDestroy {
  /** Subject para limpiar observables */
  destroyNotifier$: Subject<void> = new Subject();

  /** Datos de la bitácora obtenidos desde el servicio */
  datos: Bitacora[] = [];

  /**
   * Constructor del componente
   * @param {ModificacionSolicitudeService} modificionService
   * @param {ToastrService} toastr
   * @param {Tramite80308Store} tramiteStore
   */
  constructor( public modificionService: ModificacionSolicitudeService, private toastr: ToastrService,
    private tramiteStore: Tramite80308Store
   ) {
    const PARAMS = { idPrograma: '121880' };
    this.modificionService
      .obtenerBitacora80308(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$)) // Se cancela la suscripción cuando se destruye el componente.
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
            if(esValidArray(RESPONSE.datos)) {
              this.datos = RESPONSE.datos;
              const DATOS_CON_PROPIEDADES = this.datos.map(item => ({
                ...item,
                tipoModificion: '',
                fetchModificion: ''
              }));
              this.tramiteStore.setDatosBitacora(DATOS_CON_PROPIEDADES);
            }
          }
        },
        () => {
          this.toastr.error('Error al cargar los estados'); // Manejo de errores.
        }
      );
  }

  /**
   * Método que se ejecuta cuando el componente es destruido
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
