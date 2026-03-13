/**
 * Componente para la modificación de permisos de importación de tratamientos.
 */
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

import { CompleteForm, Destinatario, DomicilioEstablecimiento, Fabricante, Facturador, FormMercancias, PagoDeDerechos, Proveedor, ScianForm, SolicitanteData, SolicitudEstablecimientoForm, TercerosRelacionados, Tramite } from '../../models/modificacion-permiso.model';
import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { TercerosRelacionadosFabSeccionComponent } from '../../../../shared/components/terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';

import { PagoDeDerechosEntradaComponent } from '../../../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { TramitesAsociadosSeccionComponent } from '../../../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import {Subject, forkJoin, map, takeUntil } from 'rxjs';
import { ModificacionPermisoImportacionSanitario } from '../../service/modificacion-permiso.service';
/**
 * Clase que representa el componente de modificación de permisos de importación de tratamientos.
 */
@Component({
  selector: 'app-paso-uno-pages',
  templateUrl: './paso-uno-pages.component.html',
})
/**
 * Componente que representa la primera sección de un formulario de modificación de permisos de importación.
 * Este componente incluye varios subcomponentes para recopilar información del solicitante, datos de la solicitud,
 * terceros relacionados, pagos de derechos y trámites asociados.
 * 
 * @export
 * @class PasoUnoPagesComponent
 */
export class PasoUnoPagesComponent implements OnInit , OnDestroy {
    /**
       * showPreFillingOptions
       * Indica si se deben mostrar las opciones de prellenado.
       */
   showPreFillingOptions: boolean = false; 
  
     /**
     * Indica si se están mostrando los datos de respuesta.
     */
    public esDatosRespuesta: boolean = false;
    /**
     * Estado actual de la consulta.
     */
    public consultaState!: ConsultaioState;
    /**
     * Notificador para destruir las suscripciones y evitar fugas de memoria.
     */
    private destroyNotifier$: Subject<void> = new Subject();
  
    constructor( private consultaQuery: ConsultaioQuery,
      
          private solocitudService: ModificacionPermisoImportacionSanitario,
    ){
  
    }
    /**
     * Método que se ejecuta al inicializar el componente.
     */
     ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
            this.consultaState = seccionState;
        })).subscribe();
      if(this.consultaState.update) {
      this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    }
/**
 * Método para guardar los datos del formulario.
 * Utiliza `forkJoin` para realizar múltiples solicitudes simultáneamente y espera a que todas se completen.
 */
     guardarDatosFormulario(): void {
          forkJoin({
            registro: this.solocitudService.getRegistroTomaMuestrasMercanciasData(),
            permiso: this.solocitudService.getPagoDerechos()
          })
            .pipe(takeUntil(this.destroyNotifier$))
            .subscribe(({ registro, permiso }) => {
              if (registro) {
                this.esDatosRespuesta = true;
                this.solocitudService.actualizarEstadoFormulario(registro);
              }
              if (permiso) {
                this.solocitudService.actualizarPagoDerechosFormulario(permiso);
              }
            });
        }
  /**
     * Referencia al componente `SolicitanteComponent` para acceder a sus métodos y propiedades.
     */
    @ViewChild(SolicitanteComponent, { static: false })
    solicitante!: SolicitanteComponent;
  
    /**
     * Referencia a una lista de componentes `DatosDelSolicitudModificacionComponent`.
     * Se utiliza para recopilar los datos de las solicitudes de modificación.
     */
    @ViewChildren(DatosDelSolicitudModificacionComponent)
    datosSolicitudComponents!: QueryList<DatosDelSolicitudModificacionComponent>;
  
    /**
     * Referencia a una lista de componentes `TercerosRelacionadosFabSeccionComponent`.
     * Se utiliza para recopilar los datos de los terceros relacionados.
     */
    @ViewChildren(TercerosRelacionadosFabSeccionComponent)
    tercerosRelacionadosComponents!: QueryList<TercerosRelacionadosFabSeccionComponent>;
  
    /**
     * Referencia a una lista de componentes `PagoDeDerechosEntradaComponent`.
     * Se utiliza para recopilar los datos relacionados con los pagos de derechos de entrada.
     */
    @ViewChildren(PagoDeDerechosEntradaComponent)
    pagoDeDerechosEntradaComponent!: QueryList<PagoDeDerechosEntradaComponent>;
  
    /**
     * Referencia a una lista de componentes `TramitesAsociadosSeccionComponent`.
     * Se utiliza para recopilar los datos de los trámites asociados.
     */
    @ViewChildren(TramitesAsociadosSeccionComponent)
    tramitesAsociadosSeccionComponent!: QueryList<TramitesAsociadosSeccionComponent>;
  
    /**
     * Objeto para almacenar todos los valores recopilados de los formularios.
     */
   
  
    payload: {
      solicitante?: SolicitanteData;
      datosSolicitud?: CompleteForm[];
      tercerosRelacionados?: TercerosRelacionados[];
      pagoDeDerechos?: PagoDeDerechos[];
      tramitesAsociados?: Tramite[];
    } = {};
  
    
  
    /**
     * Método para recopilar los valores de los formularios de todos los componentes hijos.
     * 
     * Este método organiza los datos en un objeto estructurado por secciones o pestañas.
     * 
     * @returns Un objeto que contiene los valores de los formularios de todas las secciones.
     */
   
    collectFormValues(): {
      solicitante?: SolicitanteData;
      datosSolicitud?: CompleteForm[];
      tercerosRelacionados?: TercerosRelacionados[];
      pagoDeDerechos?: PagoDeDerechos[];
      tramitesAsociados?: Tramite[];
    } {
      const ALL_FORM_VALUES: {
        solicitante?: SolicitanteData;
        datosSolicitud?: CompleteForm[];
        tercerosRelacionados?: TercerosRelacionados[];
        pagoDeDerechos?: PagoDeDerechos[];
        tramitesAsociados?: Tramite[];
      } = {
        solicitante: undefined,
        datosSolicitud: [],
        tercerosRelacionados: [],
        pagoDeDerechos: [],
        tramitesAsociados: [],
      };
  
      // Tab 1: SolicitanteComponent
      if (this.solicitante?.form) {
        ALL_FORM_VALUES.solicitante = this.solicitante.form.value as SolicitanteData;
      }
  
      // Tab 2: DatosDelSolicitudModificacionComponent
      if (this.datosSolicitudComponents?.length > 0) {
        this.datosSolicitudComponents.toArray().forEach((component) => {
          const CHILD_DATA: CompleteForm = {
            domicilioEstablecimiento: component.domicilioEstablecimiento?.value as DomicilioEstablecimiento,
            scianForm: component.scianForm?.value as ScianForm,
            solicitudEstablecimientoForm: component.solicitudEstablecimientoForm?.value as SolicitudEstablecimientoForm,
            formMercancias: component.formMercancias?.value as FormMercancias,
          };
         
          ALL_FORM_VALUES.datosSolicitud?.push(CHILD_DATA);
        });
      }
  
      // Tab 3: TercerosRelacionadosFabSeccionComponent
      if (this.tercerosRelacionadosComponents?.length > 0) {
        this.tercerosRelacionadosComponents.toArray().forEach((component) => {
          const CHILD_DATA: TercerosRelacionados = {
            facturador: component.agregarFacturadorFormGroup?.value as Facturador,
            fabricante: component.agregarFabricanteFormGroup?.value as Fabricante,
            destinatario: component.agregarDestinatarioFormGroup?.value as Destinatario,
            proveedor: component.agregarProveedorFormGroup?.value as Proveedor,
          };
          ALL_FORM_VALUES.tercerosRelacionados?.push(CHILD_DATA);
        });
      }
  
      // Tab 4: PagoDeDerechosEntradaComponent
      if (this.pagoDeDerechosEntradaComponent?.length > 0) {
        this.pagoDeDerechosEntradaComponent.toArray().forEach((component) => {
          if (component?.pagoDerechos) {
            ALL_FORM_VALUES.pagoDeDerechos?.push(component.pagoDerechos.value as PagoDeDerechos);
          }
        });
      }
  
      // Tab 5: TramitesAsociadosSeccionComponent
      if (this.tramitesAsociadosSeccionComponent?.length > 0) {
        this.tramitesAsociadosSeccionComponent.toArray().forEach((component) => {
          if (component.acuseTablaDatos) {
            ALL_FORM_VALUES.tramitesAsociados?.push(...component.acuseTablaDatos as Tramite[]);
          }
        });
      }
  
      return ALL_FORM_VALUES;
    }
  
  
    /**
     * Índice actual del subtítulo seleccionado en la interfaz.
     */
    indice: number = 1;
  
    /**
     * Método para actualizar el índice del subtítulo seleccionado.
     *
     * @param i - Índice de la pestaña seleccionada.
     */
    seleccionaTab(i: number): void {
      this.indice = i;
    }
    /**
 * Método del ciclo de vida que se ejecuta al destruir el componente.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
