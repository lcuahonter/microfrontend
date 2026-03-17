// Componente para la vista de los anexos dos y tres en el trámite 80103
import { Catalogo, ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DisponsibleFiscal } from '../../../../shared/models/empresas.model';
import { EmpresasComponent } from '../../../../shared/components/empresas/empresas.component';
import { NuevoProgramaIndustrialService } from '../../services/modalidad-albergue.service';
/*
  * Componente para mostrar la lista de empresas terciarizadas en el trámite 80103.
  *
  * Este componente utiliza el servicio `NuevoProgramaIndustrialService` para obtener la lista de estados
  * y gestionar la información relacionada con las empresas terciarizadas.
  *
  * @export
  * @class EmpresasTerciarizadaasComponent
  */
@Component({
  selector: 'app-empresas-terciarizadaas',
  standalone: true,
  imports: [CommonModule,EmpresasComponent],
  templateUrl: './empresas-terciarizadaas.component.html',
  styleUrl: './empresas-terciarizadaas.component.scss',
})
/*
  * Clase que representa el componente de empresas terciarizadas.
  *
  * @class EmpresasTerciarizadaasComponent
  * @implements {OnDestroy}
  */
export class EmpresasTerciarizadaasComponent implements OnDestroy {

  /*
  * Constructor del componente.
  * @param {NuevoProgramaIndustrialService} nuevoProgramaIndustrialService - Servicio para gestionar la información del nuevo programa industrial.
  */
  constructor(private nuevoProgramaIndustrialService: NuevoProgramaIndustrialService,){

  }

  /**
  * Notificador utilizado para manejar la destrucción o desuscripción de observables.
  * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
  *
  * @property {Subject<void>} destroyNotifier$
  */
  private destroyNotifier$: Subject<void> = new Subject();
/*
* Lista de encabezados de la tabla de empresas terciarizadas.
* @type {ConfiguracionColumna<DisponsibleFiscal>[]}
*/
  public parentTablaConfig: ConfiguracionColumna<DisponsibleFiscal>[] = [
    { encabezado: 'Calle', clave: (item) => item.calle, orden: 1 },
    { encabezado: 'Número exterior', clave: (item) => item.numeroExterior, orden: 2 },
    { encabezado: 'Número interior', clave: (item) => item.numeroInterior || '', orden: 3 },
    { encabezado: 'Código postal', clave: (item) => item.codigoPostal, orden: 4 },
    { encabezado: 'Colonia', clave: (item) => item.colonia, orden: 5 },
    { encabezado: 'Municipio o delegación', clave: (item) => item.municipioDelegacion, orden: 6 },
    { encabezado: 'Entidad federativa', clave: (item) => item.entidadFederativa, orden: 7 },
    { encabezado: 'País', clave: (item) => item.pais, orden: 8 },
    { encabezado: 'Registro federal de contribuyentes', clave: (item) => item.registroFederalContribuyentes, orden: 9 },
    { encabezado: 'Domicilio fiscal del solicitante', clave: (item) => item.domicilioFiscalSolicitante, orden: 10 },
    { encabezado: 'Razón social', clave: (item) => item.razonSocial, orden: 11 },
  ];
  /**
   * Lista de encabezados de la tabla de empresas terciarizadas.
   * @type {ConfiguracionColumna<DisponsibleFiscal>[]}
   */
  estadosCatalogo: Catalogo[]=[];

   /**
   * Obtiene la lista de estados desde el servicio y actualiza la propiedad estadoCatalogo.
   * @method obtenerListaEstado
   */
    obtenerListaEstado(): void {
      this.nuevoProgramaIndustrialService
        .obtenerListaEstado()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((response) => {
          if (response) {
            this.estadosCatalogo = response.data;
          }
        });
    }
    /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}