
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CorreccionInternaDeLaCofeprisService } from '../../services/correccion-interna-de-la-cofepris.service';
import { DESTINATARIO_CONFIGURACION_TABLA } from '../../constants/column-config.enum';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TramitesAsociados } from '../../models/destinatario.model';

import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-tramites-asociados',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, TituloComponent],
  templateUrl: './tramites-asociados.component.html',
  styleUrl: './tramites-asociados.component.scss',
})
export class TramitesAsociadosComponent implements OnInit, OnDestroy {
  /**
   * Constructor del componente.
   * @param correccionService Servicio para obtener los trámites asociados.
   */
  constructor(private correccionService: CorreccionInternaDeLaCofeprisService) {}

  /**
   * Observable para gestionar la destrucción del componente.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Datos de las filas de la tabla para los trámites asociados.
   */
  tablaFilaDatos: TramitesAsociados[] = [];

  /**
   * Configuración de las columnas de la tabla para los trámites asociados.
   */
  destinatarioConfiguracionTabla = DESTINATARIO_CONFIGURACION_TABLA;

  /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene los trámites asociados.
   */
  ngOnInit(): void {
    this.getTramitesAsociados();
  }

  /**
   * Método para obtener los trámites asociados desde el servicio.
   */
  getTramitesAsociados(): void {
    this.correccionService
      .getTramitesAsociados()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tablaFilaDatos = data as TramitesAsociados[];
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Libera los recursos utilizados.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
