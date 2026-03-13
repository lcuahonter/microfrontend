import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { PERSONAS_TABLA, PersonasInfo } from '@libs/shared/data-access-user/src/core/models/32616/dato-comunes.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudDeRegistroInvocarService } from '../../services/solicitudDeRegistroInvocar/solicitud-de-registro-invocar.service';

/**
 * Componente que muestra una tabla dinámica con información de personas relacionadas al trámite 32616.
 *
 * @export
 * @class PersonaComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    TituloComponent
  ],
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.scss',
})
export class PersonaComponent implements OnInit, OnDestroy {

  /**
   * Configuración de las columnas que se mostrarán en la tabla de personas.
   *
   * @type {ConfiguracionColumna<PersonasInfo>[]}
   * @memberof PersonaComponent
   */
  personasTabla: ConfiguracionColumna<PersonasInfo>[] = PERSONAS_TABLA;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Datos obtenidos para mostrar en la tabla de personas.
   *
   * @type {PersonasInfo[]}
   * @memberof PersonaComponent
   */
  personasTablaDatos: PersonasInfo[] = [];

  /**
   * Notificador utilizado para cancelar suscripciones activas al destruir el componente
   * y evitar pérdidas de memoria.
   *
   * @private
   * @type {Subject<void>}
   * @memberof PersonaComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Crea una instancia del componente.
   *
   * @param {SolicitudDeRegistroInvocarService} service Servicio para obtener datos de personas.
   * @memberof PersonaComponent
   */
  constructor(
    private service: SolicitudDeRegistroInvocarService,
    private consultaioQuery: ConsultaioQuery,
  ) {
  
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Invoca la carga inicial de datos para la tabla.
   *
   * @memberof PersonaComponent
   */
  ngOnInit(): void {
    this.obtenerTablaDatos();
  }

  /**
   * Obtiene los datos de la tabla de personas desde el servicio.
   * La suscripción se cancela automáticamente al destruir el componente.
   *
   * @memberof PersonaComponent
   */
  obtenerTablaDatos(): void {
    this.service.obtenerPersonaTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.personasTablaDatos = DATOS;
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Completa el observable para liberar recursos y evitar fugas de memoria.
   *
   * @memberof PersonaComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
