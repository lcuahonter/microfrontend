import { CatalogoMock, CertificadoCupo } from './model/response/certificado-cupo.model';
import { ConsultaEspecificaRequest, ConsultaPorFolioRequest } from './model/request/consulta-certificado.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private mockData: CertificadoCupo[] = [
    {
      folioSolicitud: '2023-000001',
      rfc: 'ABC123456789',
      nombreRazonSocial: 'EMPRESA EJEMPLO S.A. DE C.V.',
      documento: 'Certificado_001.pdf',
      estatus: 'VIGENTE'
    },
    {
      folioSolicitud: '2023-000002',
      rfc: 'XYZ987654321',
      nombreRazonSocial: 'COMERCIALIZADORA DEL NORTE',
      documento: 'Certificado_002.pdf',
      estatus: 'EXPIRADO'
    }
  ];

  private mockTratadosAcuerdos: CatalogoMock[] = [
    {
      clave: 'TLCUE',
      descripcion: 'TLCUE'
    },
    {
      clave: 'TLCAELC',
      descripcion: 'TLCAELC'
    },
    {
      clave: 'ACE 6',
      descripcion: 'ACE 6'
    },
    {
      clave: 'T-MEC',
      descripcion: 'T-MEC'
    },
  ];

  private mockPaises: CatalogoMock[] = [
    {
      clave: 'MEX',
      descripcion: 'MEX'
    },
    {
      clave: 'USA',
      descripcion: 'USA'
    },
    {
      clave: 'CAN',
      descripcion: 'CAN'
    },
  ];

  private mockRepresentacionFederal: CatalogoMock[] = [
    {
      clave: 'CDMX',
      descripcion: 'CDMX'
    },
    {
      clave: 'DF',
      descripcion: 'DF'
    },
    {
      clave: 'GDL',
      descripcion: 'GDL'
    },
    {
      clave: 'MEX',
      descripcion: 'MEX'
    },
    {
      clave: 'PUE',
      descripcion: 'PUE'
    }
  ];

  /**
   * Obtiene los tratados y acuerdos
   * @returns Observable<CatalogoMock[]>
   */
  getTratadosAcuerdos(): Observable<CatalogoMock[]> {
    return of(this.mockTratadosAcuerdos).pipe(delay(1000));
  }

  /**
   * Obtiene los paises
   * @returns Observable<CatalogoMock[]>
   */
  getPaises(): Observable<CatalogoMock[]> {
    return of(this.mockPaises).pipe(delay(1000));
  }

  /**
   * Obtiene la representacion federal
   * @returns Observable<CatalogoMock[]>
   */
  getRepresentacionFederal(): Observable<CatalogoMock[]> {
    return of(this.mockRepresentacionFederal).pipe(delay(1000));
  }

  /**
   * Consulta especifica
   * @param request ConsultaEspecificaRequest
   * @returns Observable<CertificadoCupo[]>
   */
  consultarEspecifica(request: ConsultaEspecificaRequest): Observable<CertificadoCupo[]> {
    // Simulamos filtrado simple si RFC está presente
    let results = this.mockData;
    if (request.rfc) {
      results = this.mockData.filter(d => d.rfc.includes(request.rfc));
    }
    return of(results).pipe(delay(1000));
  }

  /**
   * Consulta por folio
   * @param request ConsultaPorFolioRequest
   * @returns Observable<CertificadoCupo[]>
   */
  consultarPorFolio(request: ConsultaPorFolioRequest): Observable<CertificadoCupo[]> {
    let results = this.mockData;
    if (request.numeroFolio) {
      results = this.mockData.filter(d => d.folioSolicitud.includes(request.numeroFolio));
    }
    return of(results).pipe(delay(1000));
  }
}
