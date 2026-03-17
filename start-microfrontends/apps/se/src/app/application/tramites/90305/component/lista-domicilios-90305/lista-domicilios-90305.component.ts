/**
 * compo doc
 * @component ListaDomicilios90305Component
 * @description
 * Este componente muestra una lista de domicilios relacionados con Prosec.
 * Los datos se obtienen desde el servicio `ProsecModificacionServiceTsService`
 * y se presentan en una tabla dinámica.
 */

import {
  CatalogoResponse,
  ConsultaioQuery,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { ProsecModificacionModel } from '../../models/prosec-modificacion.model';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { Subject } from 'rxjs';
import { Tramite90305Query } from '../../estados/tramite90305.query';
import { Tramite90305Store } from '../../estados/tramite90305.store';

/**
 * compo doc
 * @selector app-lista-domicilios-90305
 * @standalone true
 */
@Component({
  selector: 'app-lista-domicilios-90305',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
  ],
  templateUrl: './lista-domicilios-90305.component.html',
  styleUrl: './lista-domicilios-90305.component.scss',
})
export class ListaDomicilios90305Component implements OnDestroy {
  /** Subject para destruir la consulta */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Formulario reactivo para la lista de domicilios */
  listaDomiciliosForm!: FormGroup;

  /** Consulta: variables para catálogo y formulario */
  estadoJson: CatalogoResponse[] = [];
  
  /** Formulario reactivo para la consulta de domicilios */
  formConsulta!: FormGroup;
  
  /** Observable para el estado seleccionado */
  public estadoCatalogo!: CatalogoResponse[];
  
  /** Indica si el formulario es de solo lectura */
  public esFormularioSoloLectura: boolean = false;

  /**
   * compo doc
   * @constructor
   * @param {ProsecModificacionServiceTsService} listaDomicilios - Servicio para obtener la lista de domicilios
   */
  constructor(
    private listaDomicilios: ProsecModificacionServiceTsService,
    private fb: FormBuilder,
    private tramite90305Store: Tramite90305Store,
    private tramite90305Query: Tramite90305Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
   this.consultaioQuery.selectConsultaioState$
       .pipe(
         takeUntil(this.destroyNotifier$),
         map((seccionState)=>{
           this.esFormularioSoloLectura = seccionState.readonly; 
         })
       )
       .subscribe()
  }

  /** Controla qué botón se muestra en la interfaz */
  showSecondButton = false;

  /** Alterna la visibilidad de los botones */
  toggleButtons(): void {
    this.showSecondButton = !this.showSecondButton;
  }

  /** Configuración de columnas para la tabla dinámica */
  configuracionTabla: ConfiguracionColumna<ProsecModificacionModel>[] = [
    {
      encabezado: 'Calle',
      clave: (item: ProsecModificacionModel) => item.calle,
      orden: 1,
    },
    {
      encabezado: 'Número exterior',
      clave: (item: ProsecModificacionModel) => item.numeroExterior,
      orden: 2,
    },
    {
      encabezado: 'Número interior',
      clave: (item: ProsecModificacionModel) => item.numeroInterior,
      orden: 3,
    },
    {
      encabezado: 'Código postal',
      clave: (item: ProsecModificacionModel) => item.codigoPostal,
      orden: 4,
    },
    {
      encabezado: 'Colonia',
      clave: (item: ProsecModificacionModel) => item.colonia,
      orden: 5,
    },
    {
      encabezado: 'Localidad',
      clave: (item: ProsecModificacionModel) => item.localidad,
      orden: 6,
    },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (item: ProsecModificacionModel) => item.municipioOAlcaldia,
      orden: 7,
    },
    {
      encabezado: 'Entidad Federativa',
      clave: (item: ProsecModificacionModel) => item.entidadFederativa,
      orden: 8,
    },
    {
      encabezado: 'País',
      clave: (item: ProsecModificacionModel) => item.pais,
      orden: 9,
    },
    {
      encabezado: 'RFC',
      clave: (item: ProsecModificacionModel) => item.rfc,
      orden: 10,
    },
    {
      encabezado: 'Razón social',
      clave: (item: ProsecModificacionModel) => item.razonSocial,
      orden: 11,
    },
  ];

  /** Enum para la selección de tablas */
  TablaSeleccion = TablaSeleccion;

  /** Datos de domicilios obtenidos del servicio */
 @Input() personaparas: ProsecModificacionModel[] = [];



  /**
   * Obtiene la lista de domicilios desde el servicio y la almacena en `personaparas`
   */
  loadDomicilios(): void {
    this.listaDomicilios
      .getListaDomicilios()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.personaparas = resp;
      });
  }

  /** Consulta: Obtiene el estado seleccionado del formulario y lo guarda en el store */
  getMunicipios(): void {
    const SELECTED_ESTADO = this.formConsulta.get('estadoControl')?.value;
    this.tramite90305Store.setSelectedEstado(SELECTED_ESTADO);
  }

  /*
   * Método del ciclo de vida de Angular - destruye el componente
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
