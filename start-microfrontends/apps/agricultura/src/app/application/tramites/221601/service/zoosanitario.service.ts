import { Observable,map,take,tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Solicitud221601State } from '../../../estados/tramites/tramite221601.store';
import { Tramite221601Query } from '../../../estados/queries/tramite221601.query';

import { HttpClient } from '@angular/common/http';

import { PreOperativo, ZoosanitarioPayload } from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';

@Injectable({
  providedIn: 'root'
})
export class ZoosanitarioService {
/** Variable para almacenar el estado de la solicitud. Se asume que será inicializada más tarde */
  solicitudState!: Solicitud221601State;

/** Constructor que inyecta el servicio `Tramite221601Query` en la clase, lo que permite consultar el
* estado de la solicitud. El servicio se utiliza para obtener y manejar el estado relacionado con
* la solicitud del trámite 221601
*/
  constructor(private tramite221601Query: Tramite221601Query, private http: HttpClient) {}
/**
   * @property {ZoosanitarioPayload | null} storedPayload
   * @description Almacena los datos del payload de tipo ZoosanitarioPayload. 
   * Puede ser nulo si no hay datos disponibles.
   */
  public storedPayload: ZoosanitarioPayload | null = null; //store payload data 
 /**
   * Método para obtener el payload desde el estado de la solicitud.
   * Realiza una transformación del estado y devuelve un Observable con el payload de tipo ZoosanitarioPayload.
   * 
   * @returns Observable<ZoosanitarioPayload | null> - Un Observable que emite el payload de la solicitud.
   */
   getPayload(): Observable<ZoosanitarioPayload | null> { 
      return this.tramite221601Query.selectSolicitud$
        .pipe(
          take(1), 
          map((state: Solicitud221601State): ZoosanitarioPayload => {
            return {
              datosSolicitud: {
                justificacion: state.justificacion,
                aduana: state.aduana,
                oficina: state.oficina,
                punto: state.punto,
                guia: state.guia,
                regimen: state.regimen,
                carro: state.carro,
                clave: state.clave,
                claves: state.claves,
                veterinario: state.veterinario,
                establecimiento: state.establecimiento,
                capturaMercancia: state.capturaMercancia,
              },
              medioForm: {
                medio: state.medio,
                transporte: state.transporte,
                verificacion: state.verificacion,
                empresa: state.empresa,
                coordenadas: state.coordenadas,
              },
              pagoDerechosForm: {
                claves: state.claves,
                dependencia: state.dependencia,
                banco: state.banco,
                llave: state.llave,
                fecha: state.fecha,
                importe: state.importe,
              },
              tipoPersonaForm: {
                tipoPersona: state.tipoPersona,
              },
              datosPersonales: {
                nombre: state.nombre,
                primerApellido: state.primerApellido,
                segundoApellido: state.segundoApellido,
                social: state.social,
                pais: state.pais,
                codigo: state.codigo,
                estado: state.estado,
                municipio: state.municipio,
                colonia: state.colonia,
                calle: state.calle,
                exterior: state.exterior,
                interior: state.interior,
                lada: state.lada,
                telefono: state.telefono,
                correoElectronico: state.correoElectronico,
                tif: state.tif,
              },
            };
          }),
          tap((data: ZoosanitarioPayload) => {
            this.storedPayload = data;                   
          })
        );
    }   

    /**
   * @description Obtiene una lista de objetos de tipo PreOperativo desde un archivo JSON local.
   * @returns {Observable<PreOperativo[]>} Un observable que emite un arreglo de objetos PreOperativo.
   * @method obtenerRadio
   * @memberof ExportacionService
   * @example
   * this.exportacionService.obtenerRadio().subscribe((data: PreOperativo[]) => {
   *   console.log(data);
   * });
   */
  obtenerRadio(): Observable<PreOperativo[]> {
    return this.http.get<PreOperativo[]>('assets/json/221601/tipoPersonaradio.json');
  }

  /**
   * @description Obtiene una lista de objetos de tipo PreOperativo desde un archivo JSON local.
   * @returns {Observable<PreOperativo[]>} Un observable que emite un arreglo de objetos PreOperativo.
   * @method obtenerRadio
   * @memberof ExportacionService
   * @example
   * this.exportacionService.obtenerRadio().subscribe((data: PreOperativo[]) => {
   *   console.log(data);
   * });
   */
  obtenerRadiooption(): Observable<PreOperativo[]> {
    return this.http.get<PreOperativo[]>('assets/json/221601/tipoPersona.json');
  }
  }
  
  


