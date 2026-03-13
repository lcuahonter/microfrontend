import {
  CONFIGURATION_TABLA_DESTINATARIO,
  CONFIGURATION_TABLA_EXPORTADOR,
  Destinatario,
  Exportador,
  MENSAJE_TABLA_OBLIGATORIA,
} from '../../enum/sanidad.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { ConsultaioQuery,
  ConsultaioStore,} from "@ng-mf/data-access-user";
import { Subject, map, takeUntil } from 'rxjs';
import { SanidadService } from '../../service/sanidad.service';
/**
 * Decorador que define el componente de Angular.
 * Especifica el selector, la plantilla HTML y los estilos asociados al componente.
 *
 * selector Define el nombre del selector que se utiliza para insertar este componente en una plantilla.
 * templateUrl Ruta al archivo HTML que contiene la estructura de la interfaz de usuario del componente.
 * styleUrls Ruta al archivo SCSS que contiene los estilos específicos del componente.
 */
@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss'],
})
/**
 * Componente que representa la sección de terceros.
 * Gestiona la visualización y configuración de las tablas de exportadores y destinatarios.
 */
export class TercerosComponent implements OnInit, OnDestroy {
  /**
   * Mensaje que indica que la tabla es obligatoria.
   */
  TEXTOS: string = MENSAJE_TABLA_OBLIGATORIA;
  /**
   * Tipo de selección de la tabla (por ejemplo, selección por checkbox).
   */
  checkbox = TablaSeleccion.CHECKBOX;
  /**
   * Configuración de las columnas de la tabla de exportadores.
   * Define el encabezado, clave y el orden de las columnas para la tabla de exportadores.
   */
  configuracionTabla: ConfiguracionColumna<Exportador>[] =
    CONFIGURATION_TABLA_EXPORTADOR;
  /**
   * Configuración de las columnas de la tabla de destinatarios.
   * Define el encabezado, clave y el orden de las columnas para la tabla de destinatarios.
   */
  configuracionTablaDatos: ConfiguracionColumna<Destinatario>[] =
    CONFIGURATION_TABLA_DESTINATARIO;

  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Inyecta el servicio de sanidad para inicializar los datos de exportadores y destinatarios.
   * sanidadService Servicio que gestiona los datos relacionados con la sanidad.
   */
  constructor(
    public sanidadService: SanidadService,
    private consultaQuery: ConsultaioQuery,
    private consultaStore: ConsultaioStore
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }
  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa los datos de exportadores y destinatarios utilizando el servicio de sanidad.
   */
  ngOnInit(): void {
    this.sanidadService.inicializaDatosExportador();
    this.sanidadService.inicializaDatosDestinatario();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se destruye.
   * Libera los recursos y evita fugas de memoria completando el Subject destroyNotifier$.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
