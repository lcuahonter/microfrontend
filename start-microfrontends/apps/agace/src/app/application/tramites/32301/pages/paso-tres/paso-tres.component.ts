import { Component, Inject, OnDestroy } from '@angular/core';
import { Subject, catchError, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
import { TramiteAgaceStore } from '../../../../estados/tramite.store';
import { TramiteFolioService } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-paso-tres', // Selector del componente
  standalone: true, // El componente es independiente, no depende de un módulo adicional
  imports: [CommonModule, FirmaElectronicaComponent], // Componentes y módulos que se importan
  templateUrl: './paso-tres.component.html', // Ruta al archivo HTML
  styleUrl: './paso-tres.component.css', // Ruta al archivo de estilos CSS
})
export class PasoTresComponent implements OnDestroy {

   /**
     * Tipo de persona, puede ser un valor numérico que se asigna según la acción.
     */
    tipoPersona!: number;
    private destroy$: Subject<void> = new Subject<void>(); // Sujeto para manejar el ciclo de vida del componente y evitar fugas de memoria
  
    /**
     * Constructor que inyecta los servicios necesarios para el funcionamiento del componente.
     * @param router Servicio de enrutamiento para navegar entre rutas.
     * @param serviciosExtraordinariosServices Servicio para obtener información del trámite.
     * @param tramiteStore Almacén de estado del trámite para gestionar los datos del trámite.
     */
    constructor(
      private router: Router,
      private serviciosExtraordinariosServices: TramiteFolioService,
      @Inject(TramiteAgaceStore) private tramiteStore: TramiteAgaceStore
    ) {
      // El constructor se utiliza para la inyección de dependencias.
    }
  
    /**
     * Método que obtiene el tipo de persona y lo asigna a la propiedad 'tipoPersona'.
     * @param tipo Tipo de persona que se obtiene como parámetro.
     */
    obtenerTipoPersona(tipo: number): void {
      this.tipoPersona = tipo; // Asigna el tipo de persona al campo correspondiente
    }
  
    /**
     * Método que maneja el evento de obtener la firma electrónica y realiza acciones adicionales.
     * @param ev La cadena de texto que representa la firma obtenida desde el componente de firma electrónica.
     */
    obtieneFirma(ev: string): void {
      const FIRMA: string = ev; // Asigna la firma obtenida
      if (FIRMA) { // Si se obtiene una firma válida
        // Llamada al servicio para obtener los datos del trámite
        this.serviciosExtraordinariosServices
          .obtenerTramite(19)
          .pipe(
            map((tramite) => {
              // Al obtener el trámite, se guarda en el store y se navega a la siguiente página
              this.tramiteStore.establecerTramite(tramite.data, FIRMA);
              this.router.navigate(['servicios-extraordinarios/acuse']); // Navega al acuse de recibo
            }),
            catchError((_error) => {
              // Manejo de errores en caso de que falle la obtención del trámite
              return _error;
            }),
            takeUntil(this.destroy$) // Se asegura de que la suscripción se complete cuando el componente se destruya
          )
          .subscribe(); // Inicia la suscripción
      }
    }
  
    /**
     * Método de ciclo de vida para limpiar los recursos cuando el componente se destruye.
     */
    ngOnDestroy(): void {
      this.destroy$.next(); // Emite la señal de destrucción
      this.destroy$.complete(); // Completa el flujo del Subject para evitar fugas de memoria
    }
}
