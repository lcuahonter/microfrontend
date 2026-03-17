import { Component, ViewChild } from '@angular/core';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitud } from '../../models/solicitud-pantallas.model';
import { DatosDelTramiteARealizarComponent } from '../../shared/datos-del-tramite-a-realizar/datos-del-tramite-a-realizar.component';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { RevisionDocumentalComponent } from '../../components/revision-documental/revision-documental.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
/** Componente para gestionar el primer paso del trámite */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  imports: [
    SolicitudComponent,
    CatalogoSelectComponent,
    CommonModule,
    SolicitanteComponent,
    DatosDelTramiteARealizarComponent,
    RevisionDocumentalComponent,
  ],
  standalone: true,
})
/** Componente para gestionar el primer paso del trámite */
export class PasoUnoComponent implements OnInit, OnDestroy {
  
  /** Realiza un seguimiento del índice de la pestaña seleccionada actualmente */
  indice: number = 1;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Indica si el trámite se encuentra en estado de revisión documental.
   * @default false
   */
  isRevisionDocumental: boolean = false;

  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar datos y gestionar las pantallas de solicitud.
   *
   * @param consultaQuery - Servicio Query para obtener la información de consulta.
   * @param solicitudPantallasService - Servicio para gestionar y obtener datos de las pantallas de solicitud.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitudPantallasService: SolicitudPantallasService
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
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
   * Actualiza el índice de la pestaña seleccionada.
   * @param i - The index of the selected tab
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solicitudPantallasService
      .getDatosDeLaSolicitud()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp: DatosDeLaSolicitud) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudPantallasService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Actualiza el estado de revisión documental según el valor recibido.
   *
   * @param evento - Valor booleano que indica si el trámite está en revisión documental.
   */
  certificadosAutorizValor(evento: boolean): void {
    this.isRevisionDocumental = evento;
  }
  @ViewChild(SolicitudComponent)
solicitud!: SolicitudComponent;

public marcarPasoUno(): void {
  this.solicitud?.marcarTodosLosControles();
}
public pasoUnoValido(): boolean {
  return this.solicitud?.formValid;
}

  /**
   * Método que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
