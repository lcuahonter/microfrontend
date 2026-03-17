import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ReplaySubject, takeUntil } from 'rxjs';

import { AlertComponent } from '@libs/shared/data-access-user/src';
import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';
import { Solicitud } from '../../models/tabla-model';

import { SOLICITUD_HEADER, TEXTOS_SOLICITUD } from '../../constants/tabla-enum';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { TerceroResponseDto } from '../datosTramite.component';
/**
 * DTO de respuesta para una solicitud.
 * Contiene la información general de la solicitud,
 * los datos relacionados con el café y los lotes asociados.
 */
export interface SolicitudResponseDto {
  id_solicitud: number;
  formas_cafe: string;
  tipos_cafe: string;
  calidad_cafe: string;
  procesos_cafe: string;
  certificaciones_cafe: string | null;
  clave_aduana: string;
  pais_procedencia: string;
  entidades_solicitud: string;
  descripcion_generica1: string | null;
  lote: LoteResponseDto[];
  terceros: TerceroResponseDto[] | null;
}
export interface LoteResponseDto {
  id_mercancia: number |string;
  id_fraccion_gob: number;
  generica1: string;
  cantidad_presentacion: string;
  numero_oficio_caso_especial: string;
  condicion_almacenamiento_primario: string;
  cantidad_umc: string;
  aceptada: boolean;

  // Campos adicionales del backend
  [key: string]: unknown;
}

/**
 * Componente para gestionar los datos de la solicitud.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.css',
})
export class DatosDeLaSolicitudComponent implements OnDestroy, OnInit {
  /**
   * Observable que se utiliza para gestionar la destrucción del componente
   * y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Contiene los textos de enumeración definidos en `TEXTOS_SOLICITUD`.
   */
  TEXTOS = TEXTOS_SOLICITUD;

  /**
   * Controla la visibilidad del panel plegable.
   * El valor predeterminado está establecido en `true` (ampliado).
   */
  colapsable: boolean = true;

  /**
   * Contiene los datos del encabezado de la tabla, definidos en `SOLICITUD_HEADER.hSolicitud`.
   */
  tablaHeadData = SOLICITUD_HEADER.hSolicitud;

  /**
   * Recibe la lista de solicitudes como datos de fila de la tabla.
   */
  @Input() tablaFilaDatos: Solicitud[] = [];

  /**
 * Evento que emite la fila seleccionada de la tabla.
 */
@Output() filaSeleccionada: EventEmitter<Solicitud> = new EventEmitter<Solicitud>();

/**
 * Datos de ejemplo para una solicitud (MOCK).
 */
MOCK_SOLICITUD: Solicitud = {
  formasdelcafe: '1',
  tipos: '2',
  calidad: '3',
  procesos: '2',
  nombredeagencia: 'Agencia XYZ',
  certifications: '1',
  adunadesalida: '2',
  paisdestino: '1',
  entidaddeprocedencia: '1',
  ciclocafetalero: '1',
  id_solicitud: ''
};
  /**
   * Constructor del componente.
   * @param registrarsolicitud Servicio para gestionar las solicitudes.
   */
  constructor(private registrarsolicitud: RegistrarSolicitudService, private NOTIF: NotificacionesService) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama al método `getSolicitudData()` para obtener los datos de la solicitud.
   */
  ngOnInit(): void {
    this.getSolicitudData('290201');
  }

 /**
 * Método que se ejecuta al hacer clic en una fila de la tabla.
 * Emite el evento `filaSeleccionada` con los datos de la solicitud seleccionada.
 */
onRowClick(det:string): void {
  this.iniciarSolicitud('290201',det)
  
}
  /**
   * Alterna el estado del panel plegable (expandir/contraer).
   */
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Obtiene los datos de la solicitud desde el servicio `RegistrarSolicitudService`
   * y los asigna a la propiedad `tablaFilaDatos`.
   */
 getSolicitudData(tramite: string): void {
  this.registrarsolicitud
    .getSolicitudData(tramite)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      }

      this.tablaFilaDatos = data.datos.flat();
    });
}

/**
 * Inicia una solicitud, con o sin información prellenada.
 *
 * @param tramite - Identificador del trámite.
 * @param idSolicitudPrellenado - (Opcional) ID de la solicitud a prellenar.
 */
 iniciarSolicitud(
  tramite: string,
  idSolicitudPrellenado?: string
): void {
  this.registrarsolicitud
    .iniciarSolicitud(tramite, idSolicitudPrellenado)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data) => {
      if (data.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      const SOLICITUDE= DatosDeLaSolicitudComponent.mapSolicitudResponseToSolicitud(
        data.datos as SolicitudResponseDto
      );

      this.filaSeleccionada.emit(SOLICITUDE);
    });
}
private static mapSolicitudResponseToSolicitud(dto: SolicitudResponseDto): Solicitud {
  return {
   id_solicitud: dto.id_solicitud, 
    formasdelcafe: dto.formas_cafe,
    tipos: dto.tipos_cafe,
    calidad: dto.calidad_cafe,
    procesos: dto.procesos_cafe,
    certifications: dto.certificaciones_cafe ?? undefined,
    adunadesalida: dto.clave_aduana,
    paisdestino: dto.pais_procedencia,
    entidaddeprocedencia: dto.entidades_solicitud,
    descripcionGenerica1: dto.descripcion_generica1??'',
    lote: dto.lote,
    terceros: dto.terceros??undefined,
  };
}


  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
