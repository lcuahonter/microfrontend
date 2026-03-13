import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, LoginQuery,TablaDinamicaComponent, TituloComponent} from '@libs/shared/data-access-user/src';
import { DISCRIMINATOR_VALUE ,TICPSE } from '../../constantes/modificacion.enum';
import { Subject,map,takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDeLaTabla } from '../../models/datos-tramite.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80316Query } from '../../estados/tramite80316.query';
import { Tramite80316Store } from '../../estados/tramite80316.store';  
/**
 * Componente `RegistroModificacionComponent` utilizado para gestionar y mostrar la información relacionada.
 * Este componente es independiente (standalone) y puede ser utilizado en diferentes partes de la aplicación.
 */
@Component({
  selector: 'app-registro-modificacion',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    FormsModule,
    TablaDinamicaComponent],
  templateUrl: './registro-modificacion.component.html',
  styleUrl: './registro-modificacion.component.scss',
})
export class RegistroModificacionComponent implements OnInit, OnDestroy {

 
  /**
   * Configuración de las columnas para la tabla en el componente `registro-modificacion`.
   * 
   * Cada objeto en el arreglo `encabezadoDeTabla` define las propiedades de una columna,
   * incluyendo el encabezado, la clave para acceder a los datos, el orden de la columna
   * y si debe mostrarse como un hiperenlace.
   * 
   * @type {ConfiguracionColumna<DatosDeLaTabla>[]}
   * 
   * @property {string} encabezado - El texto que se mostrará como encabezado de la columna.
   * @property {(artículo: DatosDeLaTabla) => any} clave - Una función que define cómo acceder
   * a los datos de la columna desde un objeto de tipo `DatosDeLaTabla`.
   * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
   * @property {boolean} [hiperenlace] - Indica si el contenido de la columna debe mostrarse
   * como un hiperenlace. Este campo es opcional.
   */
  public encabezadoDeTabla: ConfiguracionColumna<DatosDeLaTabla>[] = [
    {
      encabezado: 'Folio de programa',
      clave: (artículo) => artículo.idProgramaCompuesto,
      orden: 1,
      hiperenlace: true,
    },
    {
      encabezado: 'Tipo de programa',
      clave: (artículo) => artículo.tipoPrograma,
      orden: 2,
    },
  ];

  /**
   * Arreglo que almacena los datos de la tabla relacionados con los contenedores.
   *
   * @type {DatosDeLaTabla[]}
   */
  public datosDelContenedor: DatosDeLaTabla[] = [];
  /**
   * Datos de la lista de programas que se mostrarán en la tabla.
   */
  public programaListaDatosTabla: DatosDeLaTabla[] = [];
  /**
    * Observable para notificar la destrucción del componente.
    * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
    */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
   * RFC del usuario actual.
   * @type {string}
   */
  private loginRfc: string = '';
  /**
   * Tipo de programa seleccionado (IMMEX o PROSEC).
   * @type {string}
   */
  public tipoPrograma: string = '';

   /**
   * Constructor de la clase RegistroModificacionComponent.
   * 
   * @param router - Servicio de Angular Router para la navegación entre rutas.
   * @param immerModificacionService - Servicio para manejar la lógica de modificación utilizando Immer.
   */
  constructor(
    private router: Router,
    private solicitudService: SolicitudService,
    private tramite80316Store: Tramite80316Store,
    private tramite80316Query: Tramite80316Query,
    private loginQuery: LoginQuery
  ) {

    this.loginQuery.selectLoginState$
          .pipe(
            takeUntil(this.destroyNotifier$),
            map((loginState) => {
              this.loginRfc = loginState.rfc;
              this.tramite80316Store.setLoginRfc(this.loginRfc);
            })
          )
          .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama al método `lenarLaTabla` para cargar los datos necesarios en la tabla.
   */
  ngOnInit(): void {
      this.obtenerListaProgramas();
  }


  /**
     * Método que obtiene la lista de programas desde el servicio.
     * Asigna los datos obtenidos a la variable `programaListaDatosTabla`.
     * @return {void}
     */
    obtenerListaProgramas(): void { 
      this.tipoPrograma = DISCRIMINATOR_VALUE.startsWith('80')
        ? TICPSE.TICPSE_IMMEX
        : TICPSE.TICPSE_PROSEC;
  
      this.tramite80316Store.setSelectedTipoPrograma(this.tipoPrograma);
  
      this.solicitudService
        .obtenerListaProgramas(this.loginRfc, this.tipoPrograma)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          this.datosDelContenedor =
            response.datos?.map((item: DatosDeLaTabla) => ({
              tipoPrograma: item.tipoPrograma,
              idProgramaCompuesto: item.idProgramaCompuesto,
              idProgramaAutorizado: item.idProgramaAutorizado,
              rfc: item.rfc,
              folioPrograma: item.folioPrograma,
            })) || [];
          this.tramite80316Store.setProgramaListaDatos(
            this.datosDelContenedor
          );
        });
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
  valorDeAlternancia(event:DatosDeLaTabla): void {
     this.actualizarSeleccionadaPrograma(event);
    const CURRENT_URL = this.router.url;
    if (CURRENT_URL.includes('se')) {
      this.router.navigate(['/se/modificaciones-immex/solicitud']);
    }
    if (CURRENT_URL.includes('pago')) {
      this.router.navigate(['/pago/modificaciones-immex/solicitud']);
    }
  }

  /**
     * Método que actualiza la información del programa seleccionado en el store.
     * @param event Objeto que contiene la información del programa seleccionado.
     * @return {void}
     */
    actualizarSeleccionadaPrograma(event: DatosDeLaTabla): void {
      this.tramite80316Store.setSelectedFolioPrograma(event.folioPrograma || '');
      this.tramite80316Store.setSelectedIdPrograma(
        event.idProgramaAutorizado || ''
      );
    }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Úselo para limpiar recursos, desuscribirse de observables o realizar otras tareas de limpieza.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.complete(); // Finaliza el Subject para evitar fugas de memoria.
  }
}
