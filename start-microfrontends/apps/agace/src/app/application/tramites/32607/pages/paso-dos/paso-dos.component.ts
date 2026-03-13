import { AlertComponent, AnexarDocumentosComponent, CATALOGOS_ID, Catalogo, CatalogosService, TituloComponent } from '@libs/shared/data-access-user/src'; 
import { Component,OnDestroy, OnInit } from '@angular/core'; 
import { Subject, takeUntil } from 'rxjs'; 
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { TEXTOS } from '@ng-mf/data-access-user';


/**
 * Componente PasoDosComponent que representa el segundo paso del trámite 32607.
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    AnexarDocumentosComponent,
  ],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
/**
 * Clase PasoDosComponent encargada de manejar la lógica y vista del segundo paso del trámite 32607.
 */
export class PasoDosComponent implements OnInit, OnDestroy {
  /**
   * @description Constante que contiene los textos utilizados en el componente.
   */
  TEXTOS = TEXTOS;

  /**
   * @description Arreglo que contiene los documentos del catálogo.
   * Cada elemento es de tipo `Catalogo`, representando un ítem del catálogo disponible.
   */
  catalogoDocumentos: Catalogo[] = [];

  /** Sujeto para manejar la destrucción del componente y cancelar suscripciones */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @description Constructor del componente.
   * Se inyecta el servicio `CatalogosService` para obtener información desde el backend.
   * @param catalogosServices Servicio encargado de obtener los catálogos del sistema.
   */
  constructor(private catalogosServices: CatalogosService) {
    // Si es necesario, se puede agregar aquí la lógica de inicialización
  }

  /**
   * @description Método del ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   * Ideal para cargar datos necesarios al inicio del componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
   * @description Método encargado de obtener los tipos de documentos disponibles para el trámite desde el servicio de catálogos.
   * Realiza una suscripción al observable y asigna los datos a la variable `catalogoDocumentos` si la respuesta contiene elementos.
   * @returns {void}
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
      });
  }

  /**
   * Método de ciclo de vida que se ejecuta al destruir el componente
   * Se encarga de completar el subject y cancelar las suscripciones activas
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
