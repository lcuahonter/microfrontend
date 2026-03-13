import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DISCRIMINATOR_VALUE,
  TICPSE,
  TITULO,
} from '../../constantes/constantes90303.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogosService } from '../../service/catalogos.service';
import { CommonModule } from '@angular/common';
import { IniciarTramiteService } from '@libs/shared/data-access-user/src/core/services/shared/resolver/iniciar-tramite.service';
import { ListaProgramasComponent } from '../../../../shared/components/lista-programas/lista-programas.component';
import { LoginQuery } from '@libs/shared/data-access-user/src';
import { ProgramaLista } from '../../../../shared/models/lista-programa.model';
import { Tramite90303Store } from '../../state/Tramite90303.store';

/**
 * Componente que muestra la lista de programas PROSEC y permite seleccionar uno para continuar con el trámite.
 */
@Component({
  selector: 'app-programas-prosec',
  standalone: true,
  imports: [CommonModule, ListaProgramasComponent],
  templateUrl: './programas-prosec.component.html',
  styleUrl: './programas-prosec.component.scss',
})
/**
 * Clase que representa el componente de programas PROSEC.
 * @class ProgramasProsecComponent
 */
export class ProgramasProsecComponent implements OnInit, OnDestroy {
  /**
   * Título del componente que se muestra en la interfaz de usuario.
   * @type {string}
   */
  titulo: string = TITULO;

  /**
   * Datos de la lista de programas que se mostrarán en la tabla.
   * @type {ProgramaLista[]}
   */
  programaListaDatosTabla: ProgramaLista[] = [];

  /**
   * RFC del usuario actual.
   * @type {string}
   */
  private loginRfc: string = '';

  /**
   * Tipo de programa seleccionado (IMMEX o PROSEC).
   * @type {string}
   */
  tipoPrograma: string = '';

  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto ayuda a prevenir fugas de memoria al completar las suscripciones al destruir el componente.
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param service CatalogosService para obtener datos de la API.
   * @param tramite90303Store Tramite90303Store para manejar el estado del trámite.
   * @param loginQuery LoginQuery para obtener el estado de inicio de sesión.
   * @param route ActivatedRoute para manejar la ruta activa.
   * @param router Router para la navegación entre rutas.
   */
  constructor(
    private service: CatalogosService,
    private tramite90303Store: Tramite90303Store,
    private loginQuery: LoginQuery,
    private route: ActivatedRoute,
    private router: Router,
    private solicitudService: IniciarTramiteService
  ) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((loginState) => {
          this.loginRfc = loginState.rfc;
          this.tramite90303Store.setLoginRfc(this.loginRfc);
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama al método para obtener la lista de programas.
   * @return {void}
   */
  ngOnInit(): void {
    this.obtenerListaProgramas();
  }

  /**
   * Obtiene la lista de programas según el tipo de programa y el RFC de inicio de sesión.
   * Establece el tipo de programa en el store y actualiza la lista de programas en la tabla.
   * @return {void}
   */
  obtenerListaProgramas(): void {
    this.tipoPrograma = DISCRIMINATOR_VALUE.startsWith('80')
      ? TICPSE.TICPSE_IMMEX
      : TICPSE.TICPSE_PROSEC;

    this.tramite90303Store.setSelectedTipoPrograma(this.tipoPrograma);

    this.service
      .obtenerListaProgramas(this.loginRfc, this.tipoPrograma)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.programaListaDatosTabla =
          response.datos?.map((item: ProgramaLista) => ({
            tipoPrograma: item.tipoPrograma,
            idProgramaCompuesto: item.idProgramaCompuesto,
            idProgramaAutorizado: item.idProgramaAutorizado,
            rfc: item.rfc,
            folioPrograma: item.folioPrograma,
          })) || [];
        this.tramite90303Store.setProgramaListaDatos(
          this.programaListaDatosTabla
        );
      });
  }

  /**
   * Maneja el evento cuando se selecciona un programa de la lista.
   * @param event Objeto que contiene la información del programa seleccionado.
   * @return {void}
   */
  programaListaSeleccionado(event: ProgramaLista): void {
    this.actualizarSeleccionadaPrograma(event);
    this.solicitudService.setTramiteDatos({
      folio_programa: event.folioPrograma || '',
      id_programa_autorizado: event.idProgramaAutorizado || ''
    });
    this.router.navigate(['../solicitud'], {
      relativeTo: this.route });
  }

  /**
   * Método que actualiza la información del programa seleccionado en el store.
   * @param event Objeto que contiene la información del programa seleccionado.
   * @return {void}
   */
  actualizarSeleccionadaPrograma(event: ProgramaLista): void {
    this.tramite90303Store.setSelectedFolioPrograma(event.folioPrograma || '');
    this.tramite90303Store.setSelectedIdPrograma(
      event.idProgramaAutorizado || ''
    );
    this.tramite90303Store.setTipoPrograma(event.tipoPrograma || '');
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Completa el Subject `destroyNotifier$` para limpiar las suscripciones activas.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
