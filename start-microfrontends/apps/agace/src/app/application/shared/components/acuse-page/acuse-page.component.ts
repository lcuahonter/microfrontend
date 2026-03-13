import {
  ACUSE_SERVICIOS_EXTRAORDINARIOS,
  TITULO_ACUSE,
  TXT_ALERTA_ACUSE,
} from '@libs/shared/data-access-user/src/core/enums/constantes-alertas.enum';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccionesTabla } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { AcuseComponent } from '../../components/acuse/acuse.component';
import { CommonModule } from '@angular/common';
import { TramiteFolioQueries } from '@libs/shared/data-access-user/src/core/queries/tramiteFolio.query';
import { Solicitud32501State, Solicitud32501Store } from '../../../tramites/32501/estados/solicitud32501.store';
import { Subject} from 'rxjs';

@Component({
  templateUrl: './acuse-page.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, AcuseComponent],
})
export class AcusePageComponent implements OnInit, OnDestroy {

  /** Sujeto para manejar la destrucción del componente y cancelar suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @description Mensaje de alerta que se muestra al usuario en la página de acuse.
   */
  txtAlerta!: string;

  /**
   * @description Subtítulo que se muestra en la página de acuse.
   */
  subtitulo = TITULO_ACUSE;

  /**
   * @description Encabezado de la tabla de acuse que se muestra en la página.
   */
  encabezadoTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.encabezadoTablaAcuse;

  /**
   * @description Acciones disponibles en la tabla de acuse.
   */
  accionesTablaAcuse: AccionesTabla[] =
    ACUSE_SERVICIOS_EXTRAORDINARIOS.accionesTablaAcuse;

  /**
   * @description Datos que se muestran en la tabla de acuse.
   */
  datosTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.datosTablaAcuse;

  /**
   * @description Folio del trámite que se muestra en la página de acuse.
   */
  folio!: string;

  /**
   * @description URL de la aplicación, se utiliza para redirigir al usuario al acuse del trámite.
   */
  url!: string;


  idSolicitud!: number;
  /**
   * Código del procedimiento o trámite que se está procesando.
   * Valor 0 indica que no hay procedimiento definido.
   * 
   * @type {number}
   * @default 0
   */
  procedure: number = 0;


  constructor(
    private tramiteQueries: TramiteFolioQueries,
    private router: Router,
    private route: ActivatedRoute,
    private solicitud32501Store:Solicitud32501Store
  ) {

  }

  /**
   * Método de ciclo de vida de Angular que se llama una vez que el componente ha sido inicializado.
   *
   * En este método, se obtiene el folio del trámite utilizando el servicio `tramiteQueries` y se asigna a la propiedad `folio`.
   * Luego, se genera un mensaje de alerta utilizando la función `TXT_ALERTA_ACUSE` con el folio obtenido y se asigna a la propiedad `txtAlerta`.
   */
  ngOnInit(): void {
    const URL_ACTUAL = this.router.url;
    this.url = URL_ACTUAL.split('/')[2];

    this.folio = this.tramiteQueries.getTramite();
    this.idSolicitud = this.tramiteQueries.getIdSolicitud();
    this.procedure = this.tramiteQueries.getProcedure();
    // Si no se obtienen idSolicitud y procedure del servicio, intentar obtenerlos del localStorage.
    // los micro frontends no comparten estado, por lo que se usa localStorage como medio de comunicación.
    if (this.idSolicitud === 0 && this.procedure === 0) {
      const SOLICITUD_DATA = localStorage.getItem('solicitud');
      if (SOLICITUD_DATA) {
        const SOLICITUD = JSON.parse(SOLICITUD_DATA);
        this.idSolicitud = SOLICITUD.idsolicitud;
        this.folio = SOLICITUD.folio;
        this.procedure = SOLICITUD.procedure;
      }
    }
    this.txtAlerta = TXT_ALERTA_ACUSE(this.folio);
  }

    /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Libera los recursos utilizados por el componente:
   * - Emite un valor en el `destroyNotifier$` para cancelar las suscripciones activas y evitar fugas de memoria.
   * - Completa el `destroyNotifier$`.
   * - Limpia el estado del trámite llamando a `    this.solicitud32501Store.resetStore();
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.solicitud32501Store.resetStore();
  }
}
