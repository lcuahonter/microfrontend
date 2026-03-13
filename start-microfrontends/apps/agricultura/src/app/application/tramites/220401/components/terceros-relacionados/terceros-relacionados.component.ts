/* eslint-disable no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ConsultaioQuery, MENSAJEDEALERTA, TableBodyData, TituloComponent } from '@ng-mf/data-access-user';

import { TableComponent } from '@ng-mf/data-access-user';

// eslint-disable-next-line @nx/enforce-module-boundaries
import establecimientoTable from '../../../../../../../../../libs/shared/theme/assets/json/220401/establecimiento-table.json'

// eslint-disable-next-line @nx/enforce-module-boundaries
import destinatarioTable from '../../../../../../../../../libs/shared/theme/assets/json/220401/destinatario-table.json'

// eslint-disable-next-line @nx/enforce-module-boundaries
import importardorTable from '../../../../../../../../../libs/shared/theme/assets/json/220401/importador-table.json'

import { AlertComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

import { Subject,map,takeUntil } from 'rxjs';
import { AgregarDestinatoriaComponent } from '../agregar-destinatoria/agregar-destinatoria.component';
import { AgregarImportadorComponent } from '../agregar-importador/agregar-importador.component';
import { ModalComponent } from '../modal/modal.component';

/**
 * @component
 * @description
 * Componente para gestionar y mostrar los terceros relacionados (Establecimiento, Destinatario, Importador)
 * en el trámite 220401. Permite alternar entre la vista de tabla y los formularios de agregado,
 * y controla el estado de solo lectura.
 */
@Component({
  selector: 'app-terceros-relacionados',
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    TableComponent,
    AlertComponent,
    AgregarDestinatoriaComponent,
    CommonModule,
    AgregarImportadorComponent,
    ModalComponent
  ],
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {

  /**
   * Encabezados de la tabla de Establecimiento.
   */
  public establecimientoHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla de Establecimiento.
   */
  public establecimientoBodyData: TableBodyData[] = [];

  /**
   * Encabezados de la tabla de Destinatario.
   */
  public destinatarioHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla de Destinatario.
   */
  public destinatarioBodyData: TableBodyData[] = [];

  /**
   * Encabezados de la tabla de Importador.
   */
  public importadorHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla de Importador.
   */
  public importadorBodyData: TableBodyData[] = [];

  /**
   * Datos JSON importados para la tabla de Establecimiento.
   */
  public getEstablecimientoTableData = establecimientoTable;

  /**
   * Datos JSON importados para la tabla de Destinatario.
   */
  public getDestinatarioTableData = destinatarioTable;

  /**
   * Datos JSON importados para la tabla de Importador.
   */
  public getImportadorTableData = importardorTable;

  /**
   * Constantes de mensajes de alerta.
   */
  public TEXTOS = MENSAJEDEALERTA;

  /**
   * Bandera para operaciones de agregado (no utilizada en el código mostrado).
   */
  public hasAgregar: boolean = false;

  /**
   * Clase CSS para el tipo de alerta.
   */
  public infoAlert = 'alert-info';

  /**
   * Controla la visibilidad de la división principal de la tabla.
   */
  public showTableDiv: boolean = true;

  /**
   * Controla la visibilidad del formulario para agregar destinatario.
   */
  public showAgregarDestinatario: boolean = false;

  /**
   * Controla la visibilidad del formulario para agregar importador.
   */
  public showAgregarImportador: boolean = false;

  /**
   * Sujeto para limpiar las suscripciones y evitar fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Se suscribe al estado de consulta para actualizar el modo solo lectura.
   * @param consultaioQuery Servicio de consulta de estado.
   */
  constructor( private consultaioQuery: ConsultaioQuery ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()
  }

  /**
   * Inicializa los datos de las tablas de Establecimiento, Destinatario e Importador.
   */
  ngOnInit(): void {
    this.getEstablecimiento();
    this.getDestinatario();
    this.getImportador();
  }

  /**
   * Obtiene y asigna los encabezados y datos del cuerpo de la tabla de Establecimiento.
   */
  public getEstablecimiento(): void {
    this.establecimientoHeaderData = this.getEstablecimientoTableData.tableHeader;
    this.establecimientoBodyData = this.getEstablecimientoTableData.tableBody;
  }

  /**
   * Obtiene y asigna los encabezados y datos del cuerpo de la tabla de Destinatario.
   */
  public getDestinatario(): void {
    this.destinatarioHeaderData = this.getDestinatarioTableData.tableHeader;
    this.destinatarioBodyData = this.getDestinatarioTableData.tableBody;
  }

  /**
   * Obtiene y asigna los encabezados y datos del cuerpo de la tabla de Importador.
   */
  public getImportador(): void {
    this.importadorHeaderData = this.getImportadorTableData.tableHeader;
    this.importadorBodyData = this.getImportadorTableData.tableBody;
  }

  /**
   * Alterna la visibilidad de la tabla y del formulario para agregar un destinatario.
   */
  toggleAgregarDestinatario(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showAgregarDestinatario = !this.showAgregarDestinatario;
  }

  /**
   * Alterna la visibilidad de la tabla y del formulario para agregar un importador.
   */
  toggleAgregarImportador(): void {
    this.showTableDiv = !this.showTableDiv;
    this.showAgregarImportador = !this.showAgregarImportador;
  }

  /**
   * Cierra el formulario para agregar un destinatario y muestra la tabla principal.
   */
  cerrarAgregarDestinatario(): void {
    this.showAgregarDestinatario = false;
    this.showTableDiv = true;
  }

  /**
   * Cierra el formulario para agregar un importador y muestra la tabla principal.
   */
  cerrarAgregarImportador(): void {
    this.showAgregarImportador = false;
    this.showTableDiv = true;
  }

  /**
   * Limpia las suscripciones al destruir el componente para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
