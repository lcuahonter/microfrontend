import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PERSONAS_TABLA } from '@libs/shared/data-access-user/src/tramites/constantes/32615/datos-comunes.enum';
import { PersonasInfo } from '@libs/shared/data-access-user/src/core/models/32615/dato-comunes.model';
import {RecintoFiscalizadoService} from '../../services/recinto-fiscalizado.service';

/**
 * Componente que muestra una tabla dinámica con información de personas relacionadas al trámite 32615.
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
  public personasTabla: ConfiguracionColumna<PersonasInfo>[] = PERSONAS_TABLA;

  /**
   * Datos obtenidos para mostrar en la tabla de personas.
   *
   * @type {PersonasInfo[]}
   * @memberof PersonaComponent
   */
  public personasTablaDatos: PersonasInfo[] = [];

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
    private service: RecintoFiscalizadoService,
  ) {
    //Añade lógica aquí
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
  public obtenerTablaDatos(): void {
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
