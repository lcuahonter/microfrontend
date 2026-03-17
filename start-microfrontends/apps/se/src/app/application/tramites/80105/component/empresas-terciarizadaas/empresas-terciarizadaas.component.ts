import { Catalogo, ConfiguracionColumna, doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ComplimentosService } from '../../../../shared/services/complimentos.service';
import { DisponsibleFiscal } from '../../../../shared/models/empresas.model';
import { EmpresasComponent } from '../../../../shared/components/empresas/empresas.component';
import { NuevoProgramaIndustrialService } from '../../services/modalidad-terciarización.service';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';

@Component({
  selector: 'app-empresas-terciarizadaas',
  standalone: true,
  imports: [CommonModule, EmpresasComponent],
  templateUrl: './empresas-terciarizadaas.component.html',
  styleUrl: './empresas-terciarizadaas.component.scss',
})
export class EmpresasTerciarizadaasComponent implements OnDestroy, OnInit {

  /**
   * Referencia al componente EmpresasComponent.
   * permitiendo la comunicación directa y el control de su comportamiento.
   */
  @ViewChild(EmpresasComponent) empresasComponent!: EmpresasComponent;

  public estadosCatalogo$!: Observable<Catalogo[]>;
  
  constructor(private nuevoProgramaIndustrialService: NuevoProgramaIndustrialService,
    private tramite80104Store: Tramite80101Store, private tramite80104Query: Tramite80101Query,private _compartidaSvc: ComplimentosService
  ) {
  }

  ngOnInit(): void {
    this.estadosCatalogo$ = this.tramite80104Query.selectEstadosOpciones$;
  }

 /**
   * Arreglo que contiene las entidades fiscales disponibles para selección.
   * Cada elemento representa una instancia de `DisponsibleFiscal`.
   */
  disponiblesDatos: DisponsibleFiscal[] = []; 

  /**
   * Indica si existe un error relacionado con el RFC.
   * Se establece en `true` cuando el valor del RFC es inválido o no cumple con los requisitos esperados.
   */
  rfcError: boolean = false;

  /**
  * Notificador utilizado para manejar la destrucción o desuscripción de observables.
  * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
  *
  * @property {Subject<void>} destroyNotifier$
  */
  private destroyNotifier$: Subject<void> = new Subject();

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

  actualizarSeleccionadas(event: DisponsibleFiscal[]): void {
   if (event) {
    this.tramite80104Store.setSeleccionadas(event);
   }
  }

  actualizarEstados(event: Catalogo[]): void {
    if (event) {
      this.tramite80104Store.setEstadosOpciones(event);
    }
  }


  /**
   * Obtiene la lista de empresas terciarizadas disponibles según el RFC y estado proporcionados.
   * 
   * @param event - Objeto que contiene el RFC de la empresa submanufacturera y la entidad federativa.
   * 
   * Realiza una petición al servicio compartido para obtener las empresas terciarizadas disponibles,
   * filtra y transforma los datos recibidos, y los asigna a la propiedad `disponiblesDatos`.
   * La suscripción se cancela automáticamente al destruir el componente.
   */
  obtenerTerciarizadasDisponibles(event: { rfc: string; estado: string }): void {
    
    this.rfcError=false;
    const PAYLOAD = {
      "rfcEmpresaSubManufacturera": event.rfc,
      "entidadFederativa": event.estado,
      "idPrograma": null
    };

    if (this.empresasComponent && this.empresasComponent.empresasForm.valid) {
      this.empresasComponent.empresasForm.reset();
    }
  
    this._compartidaSvc
      .getTerciarizadasDisponibles(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
          if(esValidObject(response)) {
            const API_DATOS = doDeepCopy(response);
            if(esValidArray(API_DATOS.datos)) {
              this.disponiblesDatos = this._compartidaSvc.toDisponsibleFiscal(API_DATOS.datos);
            } 
          }
      },
        (err) => {  
        if(err.error.codigo==="01"){
          this.rfcError=true;
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
