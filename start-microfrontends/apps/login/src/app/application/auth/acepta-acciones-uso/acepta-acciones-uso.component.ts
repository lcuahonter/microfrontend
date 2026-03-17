import { Component, OnInit } from '@angular/core';
import { CondicionesUsoService, CondicionesUsoState } from '../../../estados/condiciones-uso.store';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CondicionesUsoQuery } from '../../../queries/condiciones-uso.query';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';
import { UsuariosService } from '../../core/service/usuarios.service';

@Component({
  selector: 'app-acepta-acciones-uso',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './acepta-acciones-uso.component.html',
  styleUrl: './acepta-acciones-uso.component.scss',
})
export class AceptaAccionesUsoComponent implements OnInit {
  /** Notificador para destruir suscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado actual de aceptación de condiciones */
  public aceptaCondicion!: CondicionesUsoState;

  /**
   * Constructor con inyección de dependencias.
   * @param servicioUsuario Servicio para aceptar condiciones con firma.
   * @param router Servicio de navegación.
   * @param condiciones Consulta el estado de condiciones de uso.
   * @param regitroCondicion Servicio para registrar la aceptación.
   */
  constructor(
    private servicioUsuario: UsuariosService,
    private router: Router,
    private condiciones: CondicionesUsoQuery,
    private regitroCondicion: CondicionesUsoService,
  ) { }

  /**
   * Inicializa el componente y suscribe al estado de condiciones de uso.
   */
  ngOnInit(): void {
    this.condiciones.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.aceptaCondicion = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Recibe la firma electrónica y procesa la aceptación de condiciones.
   * Si la firma es válida, registra la aceptación y navega a la siguiente pantalla.
   * Si ocurre un error, lo maneja silenciosamente.
   * 
   * @param ev Firma electrónica recibida del componente hijo.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.servicioUsuario.aceptaCondicionesUso(FIRMA, true)
        .pipe(
          map((data) => {
            if (data) {
              this.regitroCondicion.registroCondicionesUso(true);
              this.router.navigate(['login/condiciones-uso']);
            }
          }),
          catchError((_error) => {
            return of(null);
          }),
          takeUntil(this.destroyNotifier$)
        )
        .subscribe();
    }
  }
}