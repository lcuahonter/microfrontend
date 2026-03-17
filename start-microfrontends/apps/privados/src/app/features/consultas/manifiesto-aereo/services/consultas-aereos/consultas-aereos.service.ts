import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  ComplementInfoResponse,
  MessageConsultGrid,
  AirConsultsResponse,
  ContactsResponse,
  GuidesResponse,
  MeansTransportationResponse,
  DetailMessage,
  DetailMessageResponse,
  MovementsResponse,
  ParamsMessages,
  ThirdPartyDetailsReponse,
  TransportCompanyCAATResponse,
  TransportCompanyIATAResponse,
  TransportDocumentInformationDetailsResponse,
  TypeDocument,
} from '../../interfaces/consultas-aereos.interface';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthInformationService } from '@/features/auth/services/auth-information.service';
import { cleanParams, TypeResponseStatus } from '@/shared/utils/serviceUtils';
import {
  DimensionsResponse,
  GenerarReporteCompletoResponse,
  ShipmentResponse,
} from '../../interfaces/consultas-aereos.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultasAereosService {
  private authInformationService = inject(AuthInformationService);
  private http = inject(HttpClient);
  private sessionStorage = inject(SessionStorageService);
  private baseUrl = 'https://consultas-frontend.v30.ultrasist.net/api/v1/aereos';
  public messages = signal<MessageConsultGrid[]>([]);
  public paramsToGetMenssages = signal<ParamsMessages>({} as ParamsMessages);
  public idHeader = signal<string>('');
  public isManifest = signal<boolean>(false);
  public isHouse = signal<boolean>(false);
  public idPerson = signal<string>('');
  public searchedBy = signal<string>('');
  public folioFullReport = signal<string>('');

  constructor() {
    this.loadFromSessionStorage();
  }

  getMensajes(page: number): Observable<AirConsultsResponse> {
    const SIZE = 10;
    return this.http
      .get<AirConsultsResponse>(`${this.baseUrl}/mensajes`, {
        params: cleanParams({ ...this.paramsToGetMenssages(), page, size: SIZE }),
      })
      .pipe(
        tap((response) => {
          const isManifest =
            this.paramsToGetMenssages().tipoDocumentoTransporte === TypeDocument.manifest;
          this.isManifest.set(isManifest);
          const isHouse =
            this.paramsToGetMenssages().tipoDocumentoTransporte === TypeDocument.house;
          this.isHouse.set(isHouse);
          this.sessionStorage.set('isHouse', isHouse);
          this.messages.set(response.datos.consultaMensajeGrids);
        }),
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener mensajes'));
        }),
      );
  }

  createReport(
    dataList: { idEncabezado: number; tipoGuia: string }[],
  ): Observable<TypeResponseStatus> {
    const requestBody = {
      detallePeticionList: dataList.map((item) => ({
        idencabezado: item.idEncabezado,
        tipoGuia: item.tipoGuia,
      })),
      rfcSolicitante: this.authInformationService.authInfo.rfc,
    };
    return this.http
      .post<GenerarReporteCompletoResponse>(`${this.baseUrl}/reportes`, requestBody)
      .pipe(
        map((resp) => ({ success: resp.codigo === '00', msg: resp.datos })),
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo generar el reporte'));
        }),
      );
  }

  createCsvFile(): Observable<TypeResponseStatus> {
    return this.http
      .get(`${this.baseUrl}/reportes/mensajes`, {
        params: cleanParams({ ...this.paramsToGetMenssages() }),
        responseType: 'blob',
      })
      .pipe(
        tap((blob) => {
          // Immediate download
          const a = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = 'Mensajes.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        }),
        map(() => ({ success: true })),
        catchError((error: any) => {
          console.error('Error fetching', error);
          return throwError(() => new Error('No se pudo generar el archivo'));
        }),
      );
  }

  getMessageDetails(): Observable<DetailMessage> {
    const { tipoDocumentoTransporte } = this.paramsToGetMenssages();
    return this.http
      .get<DetailMessageResponse>(`${this.baseUrl}/mensajes-detalle/${this.idHeader()}`, {
        params: {
          TipoMensaje: tipoDocumentoTransporte,
        },
      })
      .pipe(
        map((resp) => resp.datos),
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener mensajes detalles'));
        }),
      );
  }

  getThirdPartyDetails(): Observable<ThirdPartyDetailsReponse> {
    return this.http
      .get<ThirdPartyDetailsReponse>(`${this.baseUrl}/mensajes-detalle/${this.idHeader()}/terceros`)
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener detalles de terceros'));
        }),
      );
  }

  getMeanTransportation(): Observable<MeansTransportationResponse> {
    return this.http
      .get<MeansTransportationResponse>(
        `${this.baseUrl}/mensajes-detalle/${this.idHeader()}/medios`,
        {
          params: {
            tipo: this.paramsToGetMenssages().tipoDocumentoTransporte,
          },
        },
      )
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener medios de transporte'));
        }),
      );
  }

  getMovements(): Observable<MovementsResponse> {
    return this.http
      .get<MovementsResponse>(`${this.baseUrl}/mensajes-detalle/${this.idHeader()}/maniobras`)
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener maniobras'));
        }),
      );
  }

  getComplementInfo(): Observable<ComplementInfoResponse> {
    return this.http
      .get<ComplementInfoResponse>(
        `${this.baseUrl}/mensajes-detalle/${this.idHeader()}/informacion-complementaria`,
      )
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener información complementaria'));
        }),
      );
  }

  getDimensions(): Observable<DimensionsResponse> {
    return this.http
      .get<DimensionsResponse>(`${this.baseUrl}/mensajes-detalle/${this.idHeader()}/dimensiones`)
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener dimensiones'));
        }),
      );
  }

  getShipments(): Observable<ShipmentResponse> {
    return this.http
      .get<ShipmentResponse>(`${this.baseUrl}/mensajes-detalle/${this.idHeader()}/partidas`)
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener partidas'));
        }),
      );
  }

  getGuides(): Observable<GuidesResponse> {
    return this.http
      .get<GuidesResponse>(`${this.baseUrl}/mensajes-detalle/${this.idHeader()}/guias`)
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener guias'));
        }),
      );
  }

  getTransportDocumentInformationDetails(): Observable<TransportDocumentInformationDetailsResponse> {
    return this.http
      .get<TransportDocumentInformationDetailsResponse>(
        `${
          this.baseUrl
        }/mensajes-detalle/${this.idHeader()}/detalle-informacion-documento-transporte`,
      )
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(
            () => new Error('No se pudo obtener detalle información del documento de transporte'),
          );
        }),
      );
  }

  getContacts(): Observable<ContactsResponse> {
    return this.http
      .get<ContactsResponse>(`${this.baseUrl}/personas-iata/${this.idPerson()}/contactos`)
      .pipe(
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener contactos'));
        }),
      );
  }

  getTransportCompanyCaat(caatCode: string) {
    return this.http
      .get<TransportCompanyCAATResponse>(
        `${this.baseUrl}/mensajes/consulta-empresa-transportista-caat/${caatCode}`,
      )
      .pipe(
        map((response) => response),
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener la empresa transportista CAAT'));
        }),
      );
  }

  getTransportCompanyIata(iataCode: string) {
    return this.http
      .get<TransportCompanyIATAResponse>(
        `${this.baseUrl}/mensajes/consulta-empresa-transportista-iata/${iataCode}`,
      )
      .pipe(
        map((response) => response),
        catchError((error: any) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener la empresa transportista IATA'));
        }),
      );
  }

  setParamsToGetMessage(formData: ParamsMessages) {
    const params: ParamsMessages = {
      ...formData,
      rfc: this.authInformationService.authInfo.rfc,
      rol: this.authInformationService.authInfo.subrol,
    };
    this.sessionStorage.set('paramsToGetMessages', params);
    this.paramsToGetMenssages.set(params);
    this.sessionStorage.set('searchedBy', params.buscarPor);
    this.searchedBy.set(params.buscarPor);
  }

  changeFilterByManifest(filterByManifest: boolean) {
    this.paramsToGetMenssages.set({
      ...this.paramsToGetMenssages(),
      filtroConsulta: filterByManifest,
    });
  }

  private loadFromSessionStorage() {
    const params = this.sessionStorage.get<ParamsMessages>('paramsToGetMessages');
    if (params) {
      this.paramsToGetMenssages.set(params);
    }

    const idPerson = this.sessionStorage.get<string>('idPerson');
    if (idPerson) {
      this.idPerson.set(idPerson);
    }

    const idHeader = this.sessionStorage.get<string>('idHeader');
    if (idHeader) {
      this.idHeader.set(idHeader);
    }

    const isManifest = this.sessionStorage.get<boolean>('isManifest');
    if (isManifest) {
      this.isManifest.set(isManifest);
    }

    const isHouse = this.sessionStorage.get<boolean>('isHouse');
    if (isHouse) {
      this.isHouse.set(isHouse);
    }

    const searchedBy = this.sessionStorage.get<string>('searchedBy');
    if (searchedBy) {
      this.searchedBy.set(searchedBy);
    }
  }
}
