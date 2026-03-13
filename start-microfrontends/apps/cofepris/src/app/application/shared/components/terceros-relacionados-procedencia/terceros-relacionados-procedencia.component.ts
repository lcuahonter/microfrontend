/**
 * Importaciones necesarias para el funcionamiento del componente.
 */
import { AlertComponent, Notificacion, NotificacionesComponent, TableBodyData, TableComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CatalogoSelectComponent,
} from '@libs/shared/data-access-user/src';
import { DatosGeneralesComponent } from '../datos-generales/datos-generales.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';

import { TableData, TipoMoModel } from '../../models/permiso-importacion-biologica.models';


import { MANIFIESTOS_ALERT } from '../../constantes/permiso-importacion-biologica.enum';

import { TercerosProcedenciaService } from '../../services/terceros-procedencia.service';
import { TramiteRelacionadaseStore } from '../../estados/stores/terceros-relacionados.stores';

import { Subject,map, takeUntil } from 'rxjs';
import { TercerosRelacionadosQuery } from '../../../shared/estados/queries/terceros-relacionados.query';


import { ConsultaioQuery } from '@ng-mf/data-access-user';
/**
 * Componente que gestiona los terceros relacionados.
 * Utiliza formularios reactivos y componentes personalizados para mostrar datos.
 */
@Component({
  selector: 'app-terceros-relacionados-procedencia',
  standalone: true,
  templateUrl: './terceros-relacionados-procedencia.component.html',
  styleUrls: ['./terceros-relacionados-procedencia.component.scss'],
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    FormsModule,
    TableComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    DatosGeneralesComponent,
    NotificacionesComponent
  ],
})

export class TercerosRelacionadosProcedenciaComponent implements OnInit {

  @Input() title: string = 'Información de procedencia*:';

  /** Subject para destruir el componente */
  private destroy$ = new Subject<void>();

  /**
   * Variable que controla la visibilidad del componente de datos generales.
   */
  isDatosGeneralesVisible = false;

  /**
   * @comdoc
   * Encabezados de la tabla para los fabricantes relacionados.
   * Este arreglo contiene los nombres de las columnas que se mostrarán en la tabla.
   */
  fabricanteHeaderData: string[] = [];
  /**
   * @comdoc
   * Datos de la tabla para los fabricantes relacionados.
   * Este arreglo contiene las filas de datos que se mostrarán en la tabla.
   */
  fabricanteRowData: TableData[] = [];

  selectedRowData: string[] = [];

  rowIndex: number[] = [];
  /**
   * @descripcion Texto de alerta utilizado para mostrar mensajes relacionados con los manifiestos.
   * @tipo {string}
   */
  TEXTO_DE_ALERTA: string = MANIFIESTOS_ALERT.DATOS_MANIFIESTOS;


  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /** Código del trámite recibido desde el componente padre,  
 *  utilizado para controlar la lógica y los datos que se muestran. */
  @Input() tramites!: string;

  public rowSelected: boolean = false;

  /**
   * Controla la visibilidad del modal de alerta.
   * @property {boolean} mostrarAlerta
   */
  public mostrarAlerta: boolean = false;

  /** Nueva notificación relacionada con el RFC. */
  public seleccionarNotificacion!: Notificacion;

  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir y gestionar formularios reactivos.
   * @param {tercerosProcedenciaService} TercerosProcedenciaService - Servicio para manejar la lógica relacionada con terceros en el módulo 260402.
   * 
   * La lógica del constructor se puede agregar aquí si es necesario.
   */
  constructor(private fb: FormBuilder, private consultaioQuery: ConsultaioQuery,
    private tercerosProcedenciaService: TercerosProcedenciaService, private tramiteRelacionadaseStore: TramiteRelacionadaseStore, private tramiteRelacionadaseQuery: TercerosRelacionadosQuery) {
    //La lógica del constructor se puede agregar aquí si es necesario
    this.consultaioQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroy$),
          map((seccionState)=>{
            this.esFormularioSoloLectura = seccionState.readonly; 
          })
        )
        .subscribe()
  }

  /**
   * @override
   * @method ngOnInit
   * @description Este método se ejecuta al inicializar el componente. 
   * Realiza una suscripción al servicio `TercerosProcedenciaService` para obtener 
   * información de la tabla y asignar los datos de las columnas a la 
   * propiedad `fabricanteHeaderData`.
   */
  ngOnInit(): void {
    this.tramiteRelacionadaseQuery.selectSolicitud$
        .pipe(
          takeUntil(this.destroy$),
          map((state)=>{
            this.fabricanteRowData = state.Destinatario; 
          })
        )
        .subscribe()
    this.tercerosProcedenciaService.getInformacioDeTabla().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const API_DATOS = JSON.parse(JSON.stringify(data));
      this.fabricanteHeaderData = API_DATOS.columns
    });
  }

  /**
   * Abre la sección de "Procedencia" estableciendo la visibilidad de los datos generales.
   * Cambia el estado de `isDatosGeneralesVisible` a `true`.
   */
  abrirProcedencia(): void {
    this.isDatosGeneralesVisible = true;
  }

  /**
   * Abre la sección de procedencia estableciendo la visibilidad de los datos generales.
   * 
   * @remarks
   * Este método cambia el estado de `isDatosGeneralesVisible` a `true`, 
   * lo que indica que la sección de datos generales debe mostrarse.
   */
  cerrarProcedencia(): void {
    this.isDatosGeneralesVisible = false;
  }

  /**
   * Agrega una nueva fila a la tabla con los datos proporcionados.
   *
   * @param data - Objeto de tipo `TipoMoModel` que contiene la información
   *               necesaria para llenar la fila de la tabla.
   */
  agregarTabla(data: TipoMoModel): void {

    const NEWROW = {
      "Nombre/denominación o razón social":
        data.razonSocial || `${data.nombre} ${data.primerApellido} ${data.segundoApellido}` || '',
      "R.F.C": data.rfc || '---',
      "CURP": data.curp || '---',
      "Teléfono": `${data.lada}-${data.telefono}` || '---',
      "Correo electrónico": data.correoElectronico || '',
      "Calle": data.calle || '---',
      "Número exterior": data.numeroExterior || '---',
      "Número interior": data.numeroInterior || '',
      "País": data.pais || '---',
      "Colonia": data.colonia || '---',
      "Municipio o alcaldía": data.municipio || '---',
      "Localidad": data.localidad || '---',
      "Entidad federativa": data.entidadFederativa || '---',
      "Estado/localidad": data.estado || '---',
      "Código postal": data.codigoPostal || '',
    };

    const NEW_ROW_VALUES = Object.values(NEWROW);
    let DATA: TableData[];

    if (this.rowIndex?.length > 0) {
      const EDIT_INDEX = this.rowIndex[0];

      DATA = this.fabricanteRowData.map((row, i) =>
        i === EDIT_INDEX ? { tbodyData: NEW_ROW_VALUES } : row
      );
    } else {
      DATA = [
        ...this.fabricanteRowData,
        { tbodyData: NEW_ROW_VALUES }
      ];
    }

    this.tramiteRelacionadaseStore.setDestinatario(DATA);

    this.rowIndex = [];
    this.cerrarProcedencia();
  }


  selectedRow(event: TableBodyData): void {
    if (event) {
      this.rowSelected = Boolean(event.selected);
      this.selectedRowData = event.tbodyData;
    }
  }

  eliminarConfirmacion(): void {
    if (this.selectedRowData.length > 0) {
      this.mostrarAlerta = true;
        this.seleccionarNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: '¿Confirma la eliminación?',
          cerrar: true,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
          alineacionBtonoCerrar:'flex-row-reverse'
        }
    }
  }

  cerrarModal(value: boolean): void {
    if (value) {
      this.eliminarSeleccionadosScian();
      this.mostrarAlerta = false;
    } else {
      this.mostrarAlerta = false;
    }
  }

  /**
   * Elimina las filas seleccionadas de la tabla SCIAN.
   */
  eliminarSeleccionadosScian(): void {
    this.fabricanteRowData = this.fabricanteRowData.filter(
      (_, index) => !this.rowIndex.includes(index)
    );
    this.tramiteRelacionadaseStore.setDestinatario(this.fabricanteRowData);
    this.rowIndex = [];
  }

  selectedRowIndex(index: number): void {
    if (!this.rowIndex.includes(index)) {
    this.rowIndex.push(index);
  }
  }

}
