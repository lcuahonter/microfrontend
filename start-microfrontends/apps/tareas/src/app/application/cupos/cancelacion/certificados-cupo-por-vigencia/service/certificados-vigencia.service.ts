import { CertificadoCancelado, ConsultaRfcResponse } from './model/response/certificados-vigencia.model';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CertificadosVigenciaService {
  private mockSolicitante: ConsultaRfcResponse = {
    datosSolicitante: {
      nombre: 'EUROFOODS DE MEXICO',
      primerApellido: 'GONZALEZ',
      segundoApellido: 'PINAL',
      actividadEconomica: 'Consultorios de medicina general pertenecientes al sector privado que cuenten con título de médico conforme a las leyes',
      rfc: 'MAVL621207C95',
      curp: 'MAVL621207HDGRLS06',
      email: 'vucem2.5@hotmail.com'
    },
    domicilioFiscal: {
      calle: 'LIBERTAD',
      numeroExterior: 'SN',
      numeroInterior: '',
      codigoPostal: '34000',
      colonia: 'VICTORIA DE DURANGO CENTRO',
      pais: 'ESTADOS UNIDOS MEXICANOS',
      estado: 'DURANGO',
      localidad: 'VICTORIA DE DURANGO',
      municipioAlcaldia: 'DURANGO',
      telefono: '618-256-2532'
    }
  };

  private mockCertificados: CertificadoCancelado[] = [
    {
      folioOficio: 'VUCEM-2023-001',
      rfc: 'MAVL621207C95',
      nombreRazonSocial: 'EUROFOODS DE MEXICO GONZALEZ PINAL',
      representacionFederal: 'Representación Federal en Durango'
    },
    {
      folioOficio: 'VUCEM-2023-002',
      rfc: 'MAVL621207C95',
      nombreRazonSocial: 'EUROFOODS DE MEXICO GONZALEZ PINAL',
      representacionFederal: 'Representación Federal en Durango'
    }
  ];

  /**
   * Obtiene los datos del solicitante por RFC.
   * @param rfc RFC a consultar.
   */
  getDatosSolicitante(rfc: string): Observable<ConsultaRfcResponse> {
    if (rfc === 'MAVL621207C95' || rfc === 'MAVL621207C94') {
       return of(this.mockSolicitante).pipe(delay(800));
    }
    return throwError(() => new Error('El RFC ingresado no tiene certificados cancelados en la Representación Federal que usted representa.'));
  }

  /**
   * Obtiene la lista de certificados cancelados por RFC.
   * @param rfc RFC a consultar.
   */
  getCertificadosCancelados(rfc: string): Observable<CertificadoCancelado[]> {
    if (rfc === 'MAVL621207C95') {
      return of(this.mockCertificados).pipe(delay(800));
    }
    return of([]);
  }
}
