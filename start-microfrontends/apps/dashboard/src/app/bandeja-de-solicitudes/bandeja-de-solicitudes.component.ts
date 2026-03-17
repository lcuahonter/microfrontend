import { BANDEJA_SOLICITUDES_FORMAS, BandejaDeSolicitudes, ConfiguracionColumna, JSONResponse, LibBandejaComponent } from '@libs/shared/data-access-user/src';
import { BandejaDeSolicitudesResponse, SolicitudesPendientesRequest } from '@libs/shared/data-access-user/src/core/models/shared/lib-bandeja.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject,map,takeUntil } from 'rxjs';
import { BandejaDeSolicitudeService } from '../services/bandeja-de-solicitude.service';
import { BandejaSolicitudTransformer } from './bandeja-solicitud.transformer';
import { CommonModule } from '@angular/common';
import { LoginQuery } from '@ng-mf/data-access-user';
import { SeleccionadoDepartamento } from '@libs/shared/data-access-user/src/core/models/shared/bandeja-de-tareas-pendientes.model';
/* 
  Componente bandeja-de-solicitudes:
  - selector: etiqueta HTML del componente.
  - standalone: es independiente de un módulo.
  - imports: módulos necesarios.
  - templateUrl: HTML del componente.
  - styleUrl: estilos del componente.
*/
@Component({
  selector: 'bandeja-de-solicitudes',
  standalone: true,
  imports: [CommonModule,LibBandejaComponent],
  templateUrl: './bandeja-de-solicitudes.component.html',
  styleUrl: './bandeja-de-solicitudes.component.scss',
})
/*
 * Componente responsable de mostrar la bandeja de solicitudes.
 * Implementa OnInit para inicializar los datos al cargar el componente
 * e implementa OnDestroy para limpiar suscripciones activas y evitar fugas de memoria.
 */
export class BandejaDeSolicitudesComponent implements OnInit,OnDestroy {
/*
 * Subject utilizado para emitir un valor y completar las suscripciones activas 
 * cuando el componente se destruye, evitando fugas de memoria.
 */
  private destroyNotifier$: Subject<void> = new Subject();
    /* 
   * Datos que se mostrarán en la tabla de solicitudes.
   */
  public bandejaTablaDatos: BandejaDeSolicitudes[] = [];

  /**
   * Almacena una copia de los datos mostrados en la tabla "Bandeja de Solicitudes".
   * Este arreglo se utiliza para mantener una versión sin modificar de los datos originales,
   * lo cual puede ser útil para operaciones como filtrado, búsqueda o restablecimiento
   * de la tabla a su estado inicial.
   */
  public copiarBandejaTablaDatos: BandejaDeSolicitudes[] = [];

    /**
     * Representa el objeto del departamento actualmente seleccionado.
     * 
     * @property {boolean} tieneDepartamento - Indica si un departamento está seleccionado.
     * @property {string} numeroDeProcedimiento - El número de procedimiento asociado al departamento.
     * @property {string} nombreDelDepartamento - El nombre del departamento seleccionado.
     */
    public selectedDepartamentoObj: SeleccionadoDepartamento = {
      tieneDepartamento: false,
      numeroDeProcedimiento: '',
      nombreDelDepartamento: '',
    };
  /*
   * Configuración de las columnas que se visualizarán en la tabla de solicitudes.
   */
  public bandejaConfiguracionTabla: ConfiguracionColumna<BandejaDeSolicitudes>[] = [
    {
      encabezado: 'Id solicitud',
      clave: (artículo:BandejaDeSolicitudes) => artículo.id,
      orden: 1,
    },
    {
      encabezado: 'Tipo de trámite',
      clave: (artículo:BandejaDeSolicitudes) => artículo.tipoDeTramite,
      orden: 2,
    },
    {
      encabezado: 'Fecha creación',
      clave: (artículo:BandejaDeSolicitudes) => artículo.fecha,
      orden: 3,
    },
    {
      encabezado: 'Fecha actualización',
      clave: (artículo:BandejaDeSolicitudes) => artículo.fechaActualizacion,
      orden: 4,
    },
    {
      encabezado: 'Dias transcurridos',
      clave: (artículo:BandejaDeSolicitudes) => artículo.diasTranscurridos,
      orden: 5,
    },
    {
      encabezado: 'Departamento',
      clave: (artículo:BandejaDeSolicitudes) => artículo.departamento,
      orden: 6,
    },
    {
      encabezado: 'Número de procedimiento',
      clave: (artículo:BandejaDeSolicitudes) => artículo.numeroDeProcedimiento,
      orden: 7,
    },
  ];
    /* 
   * Estructura del formulario usado en la bandeja de solicitudes.
   */
  public bandejaSolicitudeFormaDatos = BANDEJA_SOLICITUDES_FORMAS;
  /*
   * Valor del RFC obtenido del estado de login.
   */
  public rfcValor: string = '';
 /*
   * Constructor del componente.
   * Inyecta el servicio BandejaDeSolicitudeService para obtener los datos de la bandeja.
   */
  constructor(
    private bandejaSvc: BandejaDeSolicitudeService,
    private loginQuery: LoginQuery, 
  ) {

  }
/*
   * Hook de inicialización del componente.
   * Llama al método para obtener los datos de la tabla al cargar el componente.
   */
  ngOnInit(): void {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.rfcValor = seccionState.rfc;
        })
      )
      .subscribe();
    const BODYRQ: SolicitudesPendientesRequest = { // Datos de ejemplo para la solicitud
      rfc: this.rfcValor,
      rol_actual: 'PersonaMoral',
      rfc_Solicitante: this.rfcValor,
      id_solicitud: '',
      fecha_inicio: '',
      fecha_fin: '',
      certificado: {
        cert_serial_number: '',
        tipo_certificado: ''
      }
    };
    this.getSolicitudeTablaDatos(BODYRQ);
  }
 /*
   * Método para obtener los datos de la tabla de solicitudes desde el servicio.
   * Se suscribe al observable y asigna los datos obtenidos a la propiedad correspondiente.
   */
  public getSolicitudeTablaDatos(bodyRequest: SolicitudesPendientesRequest): void {
    
    this.bandejaSvc.getSolicitudeTablaDatos(bodyRequest).pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
      const RESPONSE_DATA: JSONResponse = {
        id: response.id,
        descripcion: response.descripcion,
        codigo: response.codigo,
        datos: response.datos,
        data: response.data,
      }
      this.bandejaTablaDatos = RESPONSE_DATA.datos?.map((item) => new BandejaSolicitudTransformer(item as BandejaDeSolicitudesResponse)) as unknown as BandejaDeSolicitudes[];
      this.copiarBandejaTablaDatos = this.bandejaTablaDatos;
    });
  }

  /**
   * Actualiza la propiedad `numeroDeProcedimiento` del objeto de departamento seleccionado
   * con el valor proporcionado en el evento.
   */
  public procedureNumero(evento: { campo: string; valor: string }): void {
    const NUMERO_DE_PROCEDIMIENTO = evento.valor;
    this.selectedDepartamentoObj.numeroDeProcedimiento = NUMERO_DE_PROCEDIMIENTO;
  }
 /*
   * Hook de destrucción del componente.
   * Finaliza las suscripciones activas al destruir el componente para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
