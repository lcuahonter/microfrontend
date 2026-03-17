import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TramitesAsociados } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { CommonModule } from '@angular/common';

/**
 * Componente `TramitesAsociadosComponent` que representa una tabla dinámica
 * para mostrar los trámites asociados. Este componente es standalone y utiliza
 * el módulo común de Angular y el componente `TablaDinamicaComponent`.
 * @decorator `@Component`
 */
@Component({
  selector: 'app-tramites-asociados',
  standalone: true,
  imports: [CommonModule,TablaDinamicaComponent],
  templateUrl: './tramites-asociados.component.html',
  styleUrl: './tramites-asociados.component.scss',
})
export class TramitesAsociadosComponent implements OnInit,OnDestroy {

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Un arreglo que contiene los datos de los trámites asociados.
   * Cada elemento en el arreglo es de tipo `TramitesAsociados`.
   */
  public tramitesAsociadosDatos: TramitesAsociados[] = [];
  
  /** Configuración de la tabla de sectores */
  public configuracionTabla: ConfiguracionColumna<TramitesAsociados>[] = [
    { encabezado: 'Folio trámite', clave: (item: TramitesAsociados) => item.folioTramite, orden: 1 },
    { encabezado: 'Tipo trámite', clave: (item: TramitesAsociados) => item.tipoTramite, orden: 2 },
    { encabezado: 'Estatus', clave: (item: TramitesAsociados) => item.estatus, orden: 3 },
    { encabezado: 'Fecha alta de registro', clave: (item: TramitesAsociados) => item.fetchAlta, orden: 4 }
  ];

  /**
   * Constructor del componente TramitesAsociadosComponent.
   * 
   * @param certificadosLicenciasSvc - Servicio para manejar operaciones relacionadas 
   * con certificados y licencias. Esta dependencia se inyecta para su uso posterior.
   */
  constructor(
    private certificadosLicenciasSvc: CertificadosLicenciasService
  ) {
    // Dependencia inyectada para uso posterior
  }

  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * 
   * En esta implementación, se suscribe al método `getTramitesAsociados` del servicio `certificadosLicenciasSvc`.
   * La suscripción escucha actualizaciones de datos y asigna la respuesta parseada a la propiedad `tramitesAsociadosDatos`.
   * La suscripción se cancela automáticamente cuando el observable `destroyNotifier$` emite un valor,
   * asegurando una limpieza adecuada y previniendo fugas de memoria.
   */
  ngOnInit(): void {
    this.certificadosLicenciasSvc.getTramitesAsociados().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
        const DATOS = JSON.parse(JSON.stringify(response));
        this.tramitesAsociadosDatos = DATOS;
    });
  }

  /**
   * Gancho del ciclo de vida que se llama cuando el componente es destruido.
   * Libera recursos emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para notificar a cualquier suscripción que se desuscriba.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
