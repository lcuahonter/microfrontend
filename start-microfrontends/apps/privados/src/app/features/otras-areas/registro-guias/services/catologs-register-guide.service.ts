import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import {
  LocationResponse,
  Location,
  Message,
  MessagePurposeResponse,
  PaymentIndicatorsResponse,
  PaymentIndicator,
  CurrencyResponse,
  Currency,
  UnitsWeightResponse,
  UnitsWeight,
  FareClassesResponse,
  FareClass,
  PersonType,
  PersonsTypeResponse,
  NameCountriesResponse,
  Country,
  TransportationStagesResponse,
  TransportationStages,
  TransportationModesResponse,
  TransportationMode,
  RolesPartsResponse,
  Rol,
  CodesSPHResponse,
  Code,
  RFCResponse,
  TransportSplitResponse,
  TransportSplit,
  SearchGuideResponse,
  LoadTypeResponse,
  LoadType,
  DateTimeResponse,
  DateTime,
  CodesSSRResponse,
  OperationTypeResponse,
  OperationType,
} from '../interfaces/catalogs.interface';
import { AuthInformationService } from '@/features/auth/services/auth-information.service';
import { RegisterGuideService } from './register-guide.service';

@Injectable({
  providedIn: 'root',
})
export class CatologsRegisterGuideService {
  private baseUrl = 'https://catalogos-frontend.v30.ultrasist.net/api/v1/catalogos-frontend';
  private baseUrlRfc = 'https://aereos-web.v30.ultrasist.net/api/aereos-web';
  private http = inject(HttpClient);
  private authService = inject(AuthInformationService);
  private registerService = inject(RegisterGuideService);

  getPurposeMessages(): Observable<Message[]> {
    return this.http.get<MessagePurposeResponse>(`${this.baseUrl}/propositos-mensaje`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los propósitos de mensaje'));
      }),
    );
  }

  getAirportsIata(): Observable<Location[]> {
    return this.http.get<LocationResponse>(`${this.baseUrl}/iata-aerpuertos`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los Aeropuertos IATA'));
      }),
    );
  }

  getControlledPremises(): Observable<Location[]> {
    return this.http.get<LocationResponse>(`${this.baseUrl}/recintos-fiscalizados`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los Recintos Fiscalizados'));
      }),
    );
  }

  getPaymentIndicators(): Observable<PaymentIndicator[]> {
    return this.http.get<PaymentIndicatorsResponse>(`${this.baseUrl}/indicadores-pago`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los Indicatores de Pago'));
      }),
    );
  }

  getCurrency(): Observable<Currency[]> {
    return this.http.get<CurrencyResponse>(`${this.baseUrl}/monedas`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener las Monedas'));
      }),
    );
  }

  getUnitsWeight(): Observable<UnitsWeight[]> {
    return this.http.get<UnitsWeightResponse>(`${this.baseUrl}/unidades-peso`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener las Unidades de Peso'));
      }),
    );
  }

  getFareClasses(): Observable<FareClass[]> {
    return this.http.get<FareClassesResponse>(`${this.baseUrl}/clases-de-tarifa`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener las Clases de Tarifa'));
      }),
    );
  }

  getTypePersons(): Observable<PersonType[]> {
    return this.http.get<PersonsTypeResponse>(`${this.baseUrl}/tipos-persona`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los Tipos de Persona'));
      }),
    );
  }

  getNameCountries(): Observable<Country[]> {
    return this.http.get<NameCountriesResponse>(`${this.baseUrl}/paises-nombre`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los Nombres de Países'));
      }),
    );
  }

  getTransportationStages(): Observable<TransportationStages[]> {
    return this.http.get<TransportationStagesResponse>(`${this.baseUrl}/etapas-transporte`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener las Etapas de Transporte'));
      }),
    );
  }

  getTransportationModes(): Observable<TransportationMode[]> {
    return this.http.get<TransportationModesResponse>(`${this.baseUrl}/modos-transporte`).pipe(
      map((response) => response.datos.filter((modes) => modes.clave === 'Air Transport')),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener las Modos de Transporte'));
      }),
    );
  }

  getOperationTypes(): Observable<OperationType[]> {
    return this.http.get<OperationTypeResponse>(`${this.baseUrl}/tipo-operacion`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener las Tipo de Operación'));
      }),
    );
  }

  getTransportationSplit(): Observable<TransportSplit[]> {
    return this.http.get<TransportSplitResponse>(`${this.baseUrl}/division-transporte`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener las Modos de Transporte'));
      }),
    );
  }

  getRolesParts(): Observable<Rol[]> {
    return this.http.get<RolesPartsResponse>(`${this.baseUrl}/roles-partes`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los Roles de las partes'));
      }),
    );
  }

  getCodesSPH(): Observable<Code[]> {
    return this.http.get<CodesSPHResponse>(`${this.baseUrl}/codigos-sph`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los códigos SPH'));
      }),
    );
  }

  getCodesSSR(): Observable<Code[]> {
    return this.http.get<CodesSSRResponse>(`${this.baseUrl}/mercancias-peligrosas`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los códigos SSR'));
      }),
    );
  }

  getLoadType(): Observable<LoadType[]> {
    return this.http.get<LoadTypeResponse>(`${this.baseUrl}/tipos-carga`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los tipos de carga'));
      }),
    );
  }

  getDateTime(): Observable<DateTime[]> {
    return this.http.get<DateTimeResponse>(`${this.baseUrl}/tipos-fecha-hora`).pipe(
      map((response) => response.datos),
      catchError((error) => {
        console.log('Error fetching ', error);
        return throwError(() => new Error('No se pudo obtener los tipos de fecha y hora'));
      }),
    );
  }

  getGuide(guide: string, typeCodeMHD: string): Observable<string> {
    return this.http
      .get<SearchGuideResponse>(`${this.baseUrlRfc}/buscar-guia-manifiesto`, {
        params: {
          rfc: this.authService.authInfo.rfc,
          guiaManifiesto: guide,
          typeCodeMHD,
        },
      })
      .pipe(
        map((response) => response.datos),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo consulta la guía'));
        }),
      );
  }

  getRFC(caat: string, tipoMensaje: string): Observable<string> {
    return this.http
      .get<RFCResponse>(`${this.baseUrlRfc}/consultar-caat-rfc`, {
        params: {
          caat,
          tipoMensaje,
        },
      })
      .pipe(
        map((response) => response.datos),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener el RFC'));
        }),
      );
  }

  getManifestTimeTypes(): Observable<string[]> {
    return of(['Arrival', 'Loading', 'Estimated', 'Actual']);
  }
}
