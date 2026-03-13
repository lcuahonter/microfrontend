import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeLaTabla } from '../../models/datos-tramite.model';
import { FormsModule } from '@angular/forms';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro-modificacion',
  standalone: true,
  imports: [TituloComponent, CommonModule, FormsModule, TablaDinamicaComponent],
  templateUrl: './registro-modificacion.component.html',
  styleUrl: './registro-modificacion.component.scss',
})
export class RegistroModificacionComponent implements OnInit, OnDestroy {
  /**
   * Constructor de la clase RegistroModificacionComponent.
   *
   * @param router - Servicio de Angular Router para la navegación entre rutas.
   * @param immerModificacionService - Servicio para manejar la lógica de modificación utilizando Immer.
   */
  constructor(
    private router: Router,
    private immerModificacionService: ImmerModificacionService
  ) {}

  /**
   * Configuración de las columnas para la tabla en el componente `registro-modificacion`.
   *
   * Cada objeto en el arreglo `encabezadoDeTabla` define las propiedades de una columna,
   * incluyendo el encabezado, la clave para acceder a los datos, el orden de la columna
   * y si debe mostrarse como un hiperenlace.
   *
   * @type {ConfiguracionColumna<datosDeLaTabla>[]}
   *
   * @property {string} encabezado - El texto que se mostrará como encabezado de la columna.
   * @property {(artículo: datosDeLaTabla) => any} clave - Una función que define cómo acceder
   * a los datos de la columna desde un objeto de tipo `datosDeLaTabla`.
   * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
   * @property {boolean} [hiperenlace] - Indica si el contenido de la columna debe mostrarse
   * como un hiperenlace. Este campo es opcional.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosDeLaTabla>[] = [
    {
      encabezado: 'Folio de programa',
      clave: (artículo) => artículo.folioDePrograma,
      orden: 1,
      hiperenlace: true,
    },
    {
      encabezado: 'Tipo de programa',
      clave: (artículo) => artículo.tipoDePrograma,
      orden: 2,
    },
  ];

  isTableCollapsed: boolean = false;

  /**
   * Arreglo que almacena los datos de la tabla relacionados con los contenedores.
   *
   * @type {datosDeLaTabla[]}
   */
  public datosDelContenedor: DatosDeLaTabla[] = [];

  /**
   * Observable para notificar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama al método `llenarLaTabla` para cargar los datos necesarios en la tabla.
   */
  ngOnInit(): void {
    this.llenarLaTabla();
  }
 toggleTableVisibility(): void {
    this.isTableCollapsed = !this.isTableCollapsed;
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Úselo para limpiar recursos, desuscribirse de observables o realizar otras tareas de limpieza.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.complete(); // Finaliza el Subject para evitar fugas de memoria.
  }

  /**
   * Navega a una ruta específica basada en la URL actual.
   *
   * Este método verifica si la URL actual contiene ciertas palabras clave
   * ('se' o 'pago') y redirige al usuario a la ruta correspondiente.
   *
   * - Si la URL actual incluye 'se', redirige a `/se/immex-modificacion/solicitud`.
   * - Si la URL actual incluye 'pago', redirige a `/pago/immex-modificacion/solicitud`.
   *
   * @returns {void} No retorna ningún valor.
   */
  valorDeAlternancia(): void {
    const CURRENT_URL = this.router.url;
    if (CURRENT_URL.includes('se')) {
      this.router.navigate(['/se/immex-modificacion-cambio-de-sector/solicitud']);
    }
    if (CURRENT_URL.includes('pago')) {
      this.router.navigate(['/pago/immex-modificacion-cambio-de-sector/solicitud']);
    }
  }

  /**
   * Llena la tabla con datos obtenidos desde el servicio `immerModificacionService`.
   * Realiza una solicitud para obtener los datos de la tabla identificada como 'tablaLista',
   * y los procesa para asignarlos a la propiedad `datosDelContenedor`.
   *
   * @remarks
   * - Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * - Los datos obtenidos se transforman en un formato específico que incluye `id`, `folioDePrograma` y `tipoDePrograma`.
   *
   * @returns {void} No retorna ningún valor.
   */
  llenarLaTabla(): void {
    this.immerModificacionService
      .getTablaData('tablaLista')
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.datosDelContenedor = resp.data.map((item: unknown) => {
          const TYPEITEM = item as { id: number; folioDePrograma: string; tipoDePrograma: string };
          return {
            id: TYPEITEM.id,
            folioDePrograma: TYPEITEM.folioDePrograma,
            tipoDePrograma: TYPEITEM.tipoDePrograma,
          };
        });
      });
  }
}
