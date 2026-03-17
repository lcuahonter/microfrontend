/**
 * Componente para la modificación de permisos de importación de tratamientos.
 */
import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { TercerosRelacionadosFabSeccionComponent } from '../../../../shared/components/terceros-relacionados-fab-seccion/terceros-relacionados-fab-seccion.component';

import { PagoDeDerechosEntradaComponent } from '../../../../shared/components/pago-de-derechos-entrada/pago-de-derechos-entrada.component';
import { TramitesAsociadosSeccionComponent } from '../../../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import {
  CompleteForm,
 
  PagoDeDerechos,
  
  SolicitanteData,

  TercerosRelacionados,
  Tramite,
} from '../../models/mod-permiso.model';
import { FormDataService } from '../../services/form-data-service';

import { Subject ,forkJoin, map, takeUntil } from 'rxjs';
import { ModificacionPermisoMeds } from '../../services/modificacion-permiso-meds.service';
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
  /**
   * Referencia al componente `SolicitanteComponent` para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent, { static: false })
  solicitanteComponent!: SolicitanteComponent;
  /**
   * Referencia a una lista de componentes `DatosDelSolicitudModificacionComponent`.
   */ 

  @ViewChildren(DatosDelSolicitudModificacionComponent)
  datosSolicitudComponents!: QueryList<DatosDelSolicitudModificacionComponent>;
  /**
   * Referencia a una lista de componentes `TercerosRelacionadosFabSeccionComponent`.
   */ 
  @ViewChildren(TercerosRelacionadosFabSeccionComponent)
  tercerosRelacionadosComponents!: QueryList<TercerosRelacionadosFabSeccionComponent>;

  /**
   * Referencia a una lista de componentes `PagoDeDerechosEntradaComponent`.
   */ 
  @ViewChildren(PagoDeDerechosEntradaComponent)
  pagoDeDerechosComponents!: QueryList<PagoDeDerechosEntradaComponent>;

  /**
   * Referencia a una lista de componentes `TramitesAsociadosSeccionComponent`.
   */
  @ViewChildren(TramitesAsociadosSeccionComponent)
  tramitesAsociadosComponents!: QueryList<TramitesAsociadosSeccionComponent>;

  /**
   * Constructor del componente.
   *
   * @param formDataService Servicio para manejar los datos del formulario.
   */
  constructor(private formDataService: FormDataService ,
     private consultaQuery: ConsultaioQuery,
      private solocitudService: ModificacionPermisoMeds,
  ) {}
/**
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * Se suscribe al estado de consulta y, dependiendo de si hay una actualización,
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
    const FORM_VALUES = {
      solicitante: this.solicitanteComponent?.form?.value as SolicitanteData, // Fetch data from SolicitanteComponent
      datosSolicitud: this.datosSolicitudComponents?.map((component) => ({
        domicilioEstablecimiento: component.domicilioEstablecimiento?.value,
        solicitudEstablecimientoForm:
          component.solicitudEstablecimientoForm?.value,
        scianForm: component.scianForm?.value,
        formMercancias: component.formMercancias?.value,
      })) as CompleteForm[], // Fetch data from DatosDelSolicitudModificacionComponent
      tercerosRelacionados: this.tercerosRelacionadosComponents?.map(
        (component) => ({
          facturador: component.agregarFacturadorFormGroup?.value,
          fabricante: component.agregarFabricanteFormGroup?.value,
          destinatario: component.agregarDestinatarioFormGroup?.value,
          proveedor: component.agregarProveedorFormGroup?.value,
        })
      ) as TercerosRelacionados[], // Fetch data from TercerosRelacionadosFabSeccionComponent
      pagoDeDerechos: this.pagoDeDerechosComponents?.map(
        (component) => component.pagoDerechos?.value
      ) as PagoDeDerechos[], // Fetch data from PagoDeDerechosEntradaComponent
      tramitesAsociados: this.tramitesAsociadosComponents
        ?.map((component) =>
          component.acuseTablaDatos.map((item) => ({
            id: item.id, // Map `Asociados.id` to `Tramite.id`
            folioTramite: item.folioTramite,
            tipoTramite: item.tipoTramite, // Map `Asociados.tipo` to `Tramite.tipoTramite`
            estatus: item.estatus, // Map `Asociados.status` to `Tramite.estatus`
            fechaAltaDeRegistro: item.fechaAltaDeRegistro, // Map `Asociados.fechaRegistro` to `Tramite.fechaAltaDeRegistro`
          }))
        )
        .flat() as Tramite[], // Flatten the array if `acuseTablaDatos` is nested
    };

    // Actualice el servicio con los valores de formulario recopilados
    this.formDataService.updateFormData(
      'solicitanteData',
      FORM_VALUES.solicitante
    );
    
    this.formDataService.updateFormData(
      'completeForm',
      FORM_VALUES.datosSolicitud
    );
    this.formDataService.updateFormData(
      'tercerosRelacionados',
      FORM_VALUES.tercerosRelacionados
    );
    this.formDataService.updateFormData(
      'pagoDeDerechos',
      FORM_VALUES.pagoDeDerechos
    );
    this.formDataService.updateFormData(
      'tramitesAsociados',
      FORM_VALUES.tramitesAsociados
    ); 

    return FORM_VALUES;
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
