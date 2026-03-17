import { AlertComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AutoridadService } from '../../services/autoridad.service';
import { CapturarElTextoLibre } from '../../models/datos-tramite.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


/**
 * Componente que captura el texto libre
 * Utiliza varias dependencias para la funcionalidad y visualización.
 */
@Component({
  selector: 'app-capturar-el-texto-libre',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
  ],
  templateUrl: './capturar-el-texto-libre.component.html',
  styleUrl: './capturar-el-texto-libre.component.css',
})
/**
 * Componente que captura el texto libre
 * Utiliza varias dependencias para la funcionalidad y visualización.
 */
export class CapturarElTextoLibreComponent implements OnDestroy {
  /** Variable que contiene textos compartidos */
  TEXTOS = TEXTOS;

  /** Clase CSS utilizada para mostrar una alerta informativa */
  infoAlert = 'alert-info';

  /** Notificador utilizado para destruir observables al deshacerse del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Variable para capturar el texto libre.
   * Inicializa una instancia de la clase CapturarElTextoLibre.
   */
  capturarElTextoLibre: CapturarElTextoLibre = {} as CapturarElTextoLibre;

  /**
   * Constructor de la clase
   * Aquí se puede agregar lógica adicional si es necesario.
   */
  constructor(
    public router: Router,
    public autoridadService: AutoridadService
  ) {
    // Constructor vacío, se puede agregar lógica adicional si es necesario.
    this.agregarCapturarElTextoLibre();
  }

  /**
   * Método para agregar datos de captura de texto libre.
   * Utiliza el servicio de autoridad para obtener y procesar la información.
   * Se suscribe a los cambios y actualiza la variable capturarElTextoLibre.
   */
  agregarCapturarElTextoLibre(): void {
    this.autoridadService
      .agregarCapturarElTextoLibre()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (respuesta: CapturarElTextoLibre) => {
          this.capturarElTextoLibre = respuesta;
        },
      });
  }

  /**
   * Método para guardar y firmar
   * Navega a la ruta de la página para firmar el manifiesto aéreo
   */
  guardarYFirmar(): void {
    this.router.navigate(['/agace/manifiesto-aereo/firmar']);
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y finaliza observables.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
