// Importaciones necesarias de Angular y otros módulos.
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { Asociados } from '../../modelos/tramites-asociados.model';
import { CommonModule } from '@angular/common';
import { TramitesAsociadosService } from '../../services/tramites-asociados.service';
 
/**
 * Componente `TramitesAsociadoComponent`
 *
 * Este componente muestra una tabla dinámica que lista trámites asociados. Se conecta
 * a un servicio para obtener los datos, configurar las columnas de la tabla y mostrarlos
 * en la vista correspondiente.
 *
 * @component
 * @example
 * <app-tramites-asociado></app-tramites-asociado>
 */
@Component({
  selector: 'app-tramites-asociado', // Selector del componente para usar en plantillas HTML.
  standalone: true, // Este componente es independiente.
  imports: [CommonModule, TablaDinamicaComponent], // Módulos y componentes que se importan.
  providers: [TramitesAsociadosService], // Servicios proporcionados para este componente.
  templateUrl: './tramites-asociado.component.html', // Ruta al archivo HTML de la plantilla.
  styleUrl: './tramites-asociado.component.scss', // Ruta al archivo SCSS para los estilos.
})
export class TramitesAsociadoComponent implements OnInit, OnDestroy {
    @Input() disabled: boolean = false;
  @Input() tipoTramite?: string;

 
  /**
   * Configuración de las columnas de la tabla dinámica.
   * Define qué datos se mostrarán y en qué orden.
   *
   * @type {ConfiguracionColumna<Asociados>[]}
   */
  public configuracionTabla: ConfiguracionColumna<Asociados>[] = [
    { encabezado: '', clave: (item: Asociados) => item.id, orden: 1 },
    { encabezado: 'Folio trámite', clave: (item: Asociados) => item.folioTramite, orden: 2 },
    { encabezado: 'Tipo trámite', clave: (item: Asociados) => item.tipoTramite, orden: 3 },
    { encabezado: 'Estatus', clave: (item: Asociados) => item.estatus, orden: 4 },
    { encabezado: 'Fecha alta de registro', clave: (item: Asociados) => item.fechaAltaDeRegistro, orden: 5 },
  ];
 
  /**
   * Datos que se mostrarán en la tabla dinámica.
   * Inicialmente, la tabla está vacía.
   *
   * @type {Asociados[]}
   */
  public acuseTablaDatos: Asociados[] = [];
 
 /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   */
  public destroyed$ = new Subject<void>();
 
  /**
   * Constructor del componente `TramitesAsociadoComponent`.
   *
   * Inyecta el servicio `TramitesAsociadosService` para interactuar con los datos de trámites.
   *
   * @param {TramitesAsociadosService} servicios - Servicio para obtener la lista de trámites asociados.
   */
  constructor(private servicios: TramitesAsociadosService) {
    // Inicialización adicional no requerida.
  }
 
  /**
   * Método del ciclo de vida `ngOnInit()` de Angular.
   *
   * Este método se ejecuta una vez que el componente se ha inicializado.
   * Llama al método `getAsociadosList()` para obtener y mostrar los datos en la tabla dinámica.
   *
   * @returns {void} No retorna nada.
   */
  ngOnInit(): void {
    this.obtenerListaDeAsociados();
  }
 
  /**
   * Método para obtener la lista de trámites asociados.
   * Llama al servicio `TramitesAsociadosService` y suscribe los datos obtenidos a la propiedad `acuseTablaDatos`.
   *
   * @returns {void} No retorna nada.
   */
  obtenerListaDeAsociados(): void {
    this.servicios.enListaDeAsociados().pipe(takeUntil(this.destroyed$)).subscribe((data: Asociados[]) => {
      this.acuseTablaDatos = data; // Asigna los datos obtenidos a la tabla dinámica.
    });
  }

 // eslint-disable-next-line class-methods-use-this
public validateRequiredFields(): boolean {
  // No required fields in this component
  return true;
}

// eslint-disable-next-line class-methods-use-this
public markAllFieldsTouched(): void {
  // No fields to mark as touched in this component
}
 
  /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
 