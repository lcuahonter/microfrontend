import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PantallasFormData } from '@libs/shared/data-access-user/src/core/models/220401/servicios-pantallas.model';
import { ServiciosPantallasService } from '@libs/shared/data-access-user/src/core/services/220471/servicios-pantallas.service';

/**
 * Interfaz que representa una solicitud individual.
 */
interface Solicitude {
  /** Fecha de creación de la solicitud */
  fechaCreacion: string;
  /** Nombre de la mercancía */
  mercancia: string;
  /** Cantidad de la mercancía */
  cantidad: number;
  /** Nombre del proveedor */
  proovedor: string;
}

/**
 * @component
 * @description
 * Este componente se utiliza para mostrar el formulario de solicitud del trámite 220401.
 * Gestiona la carga de datos de solicitudes, la visualización de secciones colapsables y la integración con el servicio de pantallas.
 */
@Component({
  selector: 'app-220401solicitud',
  templateUrl: './solicitud.component.html',
  standalone: true,
  imports: [CommonModule],
  providers : [ ],
  styleUrl: './solicitud.component.scss'
})
export class SolicitudPantallasComponent implements OnInit, OnDestroy {

  /**
   * Sujeto para destruir las suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Datos del formulario de las pantallas, recibidos desde el servicio.
   */
  public pantallasFormData!: PantallasFormData;

  /**
   * Arreglo de solicitudes cargadas desde el archivo JSON.
   */
  solicitudes: Solicitude[] = [];

  /**
   * Columnas que se mostrarán en la tabla de solicitudes.
   */
  displayedColumns: string[] = ['fechaCreacion', 'mercancia', 'cantidad', 'proovedor'];

  /**
   * Controla la visibilidad del contenido colapsable.
   */
  showContent = false;

  /**
   * Controla la visibilidad del listado de forma farmacéutica.
   */
  public formFormaceuticaColapsable = false;

  /**
   * Carga los datos de las solicitudes desde un archivo JSON ubicado en la carpeta de assets.
   * Realiza una solicitud HTTP GET para obtener los datos de 'assets/json/220401/solicitude.json'.
   * Al recuperar los datos exitosamente, los asigna a la propiedad `solicitudes`.
   * Si ocurre un error durante la solicitud, registra un mensaje de error en la consola.
   */
  loadSolicitudesData():void {
    this.http.get<Solicitude[]>('assets/json/220401/solicitude.json').subscribe(
      (data) => {
        this.solicitudes = data;
      },
      (error) => {
        console.error('Error loading solicitudes data', error);
      }
    );
  }

  /**
   * Alterna la visibilidad del contenido colapsable.
   */
  toggleContent():void {
    this.showContent = !this.showContent;
  }

  /**
   * Constructor del componente.
   * @param serviciosPantallasService Servicio para la gestión de datos de pantallas.
   * @param http Servicio HttpClient para realizar peticiones HTTP.
   */
  constructor(private serviciosPantallasService: ServiciosPantallasService, private http: HttpClient) {
    //
  }

  /**
   * Inicializa los datos del formulario de las pantallas y carga las solicitudes.
   * Suscribe a los datos del formulario y los establece en el servicio.
   */
  public ngOnInit(): void {
    this.serviciosPantallasService.pantallasFormObservable$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((formData: PantallasFormData) => {
        this.pantallasFormData = formData;
      });
    // Inicializa el arreglo de solicitudes en el formulario
    this.pantallasFormData['solict'] = [];
    this.serviciosPantallasService.setPantallasFormDataSubject(this.pantallasFormData);
    this.loadSolicitudesData();
  }

  /**
   * Alterna el estado colapsable de una sección específica basada en el orden proporcionado.
   *
   * @param orden Número que indica la sección a modificar:
   *   - 1: Alterna el estado de `formFormaceuticaColapsable`.
   */
  mostrarColapsable(orden: number): void {
    if (orden === 1) {
      this.formFormaceuticaColapsable = !this.formFormaceuticaColapsable;
    }
  }

  /**
   * Destruye las suscripciones al destruir el componente para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
                  
}
