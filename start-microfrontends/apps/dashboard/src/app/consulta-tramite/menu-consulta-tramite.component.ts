import { BANDEJA_SOLICITUDES_FORMAS, ConfiguracionColumna, ConsultaTramite } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy } from '@angular/core';
import { BandejaDeSolicitudeService } from '../services/bandeja-de-solicitude.service';
import { CommonModule } from '@angular/common';
import { ConsultaTramiteBusquedaFolioComponent } from '../consulta-tramite-busqueda-folio/consulta-tramite-busqueda-folio.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SeleccionadoDepartamento } from '@libs/shared/data-access-user/src/core/models/shared/bandeja-de-tareas-pendientes.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'menu-consulta-tramite',
  standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      ConsultaTramiteBusquedaFolioComponent,
    ],
  templateUrl: './menu-consulta-tramite.component.html',
})
export class MenuConsultaTramiteComponent implements OnDestroy {

  /*
   * Subject utilizado para emitir un valor y completar las suscripciones activas 
   * cuando el componente se destruye, evitando fugas de memoria.
   */
    private destroyNotifier$: Subject<void> = new Subject();

  /* 
   * Datos que se mostrarán en la tabla de solicitudes.
   */
  public bandejaTablaDatos: ConsultaTramite[] = [];

    /* 
   * Estructura del formulario usado en la bandeja de solicitudes.
   */
  public bandejaSolicitudeFormaDatos = BANDEJA_SOLICITUDES_FORMAS;

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

  /**
   * Almacena una copia de los datos mostrados en la tabla "Bandeja de Solicitudes".
   * Este arreglo se utiliza para mantener una versión sin modificar de los datos originales,
   * lo cual puede ser útil para operaciones como filtrado, búsqueda o restablecimiento
   * de la tabla a su estado inicial.
   */
  public copiarBandejaTablaDatos: ConsultaTramite[] = [];
    
  /*
   * Constructor del componente.
   * Inyecta el servicio BandejaDeSolicitudeService para obtener los datos de la bandeja.
   */
  constructor(private bandejaSvc: BandejaDeSolicitudeService) {

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

  /*
   * Configuración de las columnas que se visualizarán en la tabla de solicitudes.
   */
  public bandejaConfiguracionTabla: ConfiguracionColumna<ConsultaTramite>[] = [
    {
      encabezado: 'Id solicitud',
      clave: (artículo:ConsultaTramite) => artículo.id,
      orden: 1,
    },
    {
      encabezado: 'Tipo de trámite',
      clave: (artículo:ConsultaTramite) => artículo.tipoDeTramite,
      orden: 2,
    },
    {
      encabezado: 'Fecha creación',
      clave: (artículo:ConsultaTramite) => artículo.fecha,
      orden: 3,
    },
    {
      encabezado: 'Fecha actualización',
      clave: (artículo:ConsultaTramite) => artículo.fechaActualizacion,
      orden: 4,
    },
    {
      encabezado: 'Dias transcurridos',
      clave: (artículo:ConsultaTramite) => artículo.diasTranscurridos,
      orden: 5,
    },
    {
      encabezado: 'Departamento',
      clave: (artículo:ConsultaTramite) => artículo.departamento,
      orden: 6,
    },
    {
      encabezado: 'Número de procedimiento',
      clave: (artículo:ConsultaTramite) => artículo.numeroDeProcedimiento,
      orden: 7,
    },
  ];
}
