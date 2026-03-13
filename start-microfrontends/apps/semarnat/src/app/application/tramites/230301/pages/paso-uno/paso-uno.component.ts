import {
  AVISO,
  AlertComponent,
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitudComponent } from '../../component/solicitud/solicitud.component';

import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AlertComponent],
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
   * Servicio de enrutamiento de Angular.
   * @private
   */
  private router = inject(Router);

  /**
   * Servicio de ruta activada de Angular.
   * @private
   */
  private route = inject(ActivatedRoute);

  /**
   * Objeto que contiene los textos de aviso.
   */
  TEXTOS = AVISO.Aviso;
  /**
   * Estado actual de la consulta.
   */
  public consultaState!: ConsultaioState;
  /**
   * Indica si los datos de respuesta están presentes.
   */
  public esDatosRespuesta: boolean = false;
  /**
   * Indica si el formulario está deshabilitado.
   */
  public formularioDeshabilitado: boolean = false;
  /**
   * Emite un evento para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * Indica si el componente de solicitud está activo.
   */
  public isSolicitudActive = false;
  /**
   * Indica si el componente de solicitante está activo.
   */
  public isSolicitanteActive = false;

  /** Referencia al componente de solicitud. */
  private solicitudComponent: SolicitudComponent | undefined;

  constructor(private consultaQuery: ConsultaioQuery) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.formularioDeshabilitado = seccionState.readonly;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.router.navigate(['solicitud'], { relativeTo: this.route });
  }

  /**
   * Maneja la activación de un componente hijo en el router outlet.
   * @param componentInstance
   */
  onActivate(
    componentInstance: SolicitudComponent | SolicitanteComponent
  ): void {
    if (componentInstance instanceof SolicitudComponent) {
      this.solicitudComponent = componentInstance;
      this.isSolicitanteActive = false;
      this.isSolicitudActive = true;
    } else {
      this.isSolicitanteActive = true;
      this.isSolicitudActive = false;
    }
  }

  /**
   * Valida los formularios de los componentes hijos.
   */
  public validarFormularios(): boolean {
    if (this.solicitudComponent) {
      return this.solicitudComponent.validarFormulario();
    }
    // If the solicitud tab hasn't been visited, the form is considered invalid.
    return false;
  }

  /**
   * Se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
