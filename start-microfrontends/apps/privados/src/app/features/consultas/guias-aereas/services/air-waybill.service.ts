import { AuthInformationService } from '@/features/auth/services/auth-information.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  Flight,
  FlightsResponse,
  HouseDetail,
  HouseDetailsResponse,
  HouseGuide,
  HouseGuidesResponse,
  Manisfest,
  ManisfestsResponse,
  Master,
  MasterGuide,
  MasterGuidesResponse,
  MasterResponse,
  Merchandise,
  ParamsCaat,
  ParamsFlights,
  ParamsHouseGuides,
  ParamsManifests,
  ParamsMasterGuides,
  Persons,
  PersonsMerchandiseResponse,
  TypeSearch,
} from '../interfaces/air-waybill-forms.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { cleanParams } from '@/shared/utils/serviceUtils';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { RoutingService } from '@/core/services/routing.service';
import { APP_ROUTES } from '@/app.routes.constants';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { GUIAS_AEREAS_ROUTES } from '../guias-aereas.routes.constants';

@Injectable({
  providedIn: 'root',
})
export class AirWaybillService {
  private authInformationService = inject(AuthInformationService);
  private sessionStorage = inject(SessionStorageService);
  private http = inject(HttpClient);
  private routingService = inject(RoutingService);
  private baseUrl = 'https://consultas-frontend.v30.ultrasist.net/api/v1/aereos/manifiestos';
  paramsToGetManifests = signal<ParamsManifests>({} as ParamsManifests);
  paramsToGetCaat = signal<ParamsCaat>({} as ParamsCaat);
  paramsToGetMaster = signal<ParamsMasterGuides>({} as ParamsMasterGuides);
  paramsToGetHouseGuides = signal<ParamsHouseGuides>({} as ParamsHouseGuides);
  paramsToGetFlights = signal<ParamsFlights>({} as ParamsFlights);
  manifests = signal<Manisfest[]>([]);
  masterGuides = signal<MasterGuide[]>([]);
  houseGuides = signal<HouseGuide[]>([]);
  flights = signal<Flight[]>([]);
  idHeadManifest = signal<string>('');
  guideNum = signal<string>('');
  idHead = signal<string>('');
  masterByManifest = signal<Master[]>([]);
  housesDetails = signal<HouseDetail[]>([]);
  merchandises = signal<Merchandise[]>([]);
  persons = signal<Persons[]>([]);
  masterDetails = signal<Master>({} as Master);
  houseSelectedDetails = signal<HouseGuide>({} as HouseGuide);
  comesFromDetailsPage = signal<boolean>(false);
  searchType = signal<TypeSearch | null>(null);

  constructor() {
    this.loadFromSessionStorage();
  }

  getManifests(isCaatForm = false): Observable<ManisfestsResponse> {
    let params: ParamsCaat | ParamsManifests;
    if (!isCaatForm) {
      this.paramsToGetManifests.set({
        ...this.paramsToGetManifests(),
        rfc: this.authInformationService.authInfo.rfc,
      });
      params = { ...this.paramsToGetManifests() };
    } else {
      this.paramsToGetCaat.set({
        ...this.paramsToGetCaat(),
        rfc: this.authInformationService.authInfo.rfc,
      });
      params = { ...this.paramsToGetCaat() };
    }

    return this.http
      .get<ManisfestsResponse>(`${this.baseUrl}`, {
        params: cleanParams({
          ...params,
        }),
      })
      .pipe(
        tap((response: ManisfestsResponse) => {
          this.manifests.set(response.datos);
          this.sessionStorage.set('manifests', this.manifests());
        }),
        tap(() => {
          if (isCaatForm) {
            this.sessionStorage.set('paramsToGetCaat', this.paramsToGetCaat());
          } else {
            this.sessionStorage.set('paramsToGetManifests', this.paramsToGetManifests());
          }
        }),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener los manifiestos'));
        }),
      );
  }

  getMasters(): Observable<MasterGuidesResponse> {
    this.paramsToGetMaster.set({
      ...this.paramsToGetMaster(),
      rfc: this.authInformationService.authInfo.rfc,
    });
    return this.http
      .get<MasterGuidesResponse>(`${this.baseUrl}/consulta-master-guia`, {
        params: cleanParams({
          ...this.paramsToGetMaster(),
        }),
      })
      .pipe(
        tap((response: MasterGuidesResponse) => {
          this.masterGuides.set(response.datos);
          this.sessionStorage.set('masterGuides', this.masterGuides());
        }),
        tap(() => this.sessionStorage.set('paramsToGetMaster', this.paramsToGetMaster())),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener las guias master'));
        }),
      );
  }

  getHouses(): Observable<HouseGuidesResponse> {
    this.paramsToGetHouseGuides.set({
      ...this.paramsToGetHouseGuides(),
      rfc: this.authInformationService.authInfo.rfc,
      esFuncionario: 'true',
    });
    return this.http
      .get<HouseGuidesResponse>(`${this.baseUrl}/consulta-house-guia`, {
        params: cleanParams({
          ...this.paramsToGetHouseGuides(),
        }),
      })
      .pipe(
        tap((response: HouseGuidesResponse) => {
          this.houseGuides.set(response.datos);
          this.sessionStorage.set('houseGuides', this.houseGuides());
        }),
        tap(() => this.sessionStorage.set('paramsToGetHouseGuides', this.paramsToGetHouseGuides())),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener las guias de house'));
        }),
      );
  }

  getFlights(): Observable<FlightsResponse> {
    this.paramsToGetFlights.set({
      ...this.paramsToGetFlights(),
      rfc: this.authInformationService.authInfo.rfc,
    });
    return this.http
      .get<FlightsResponse>(`${this.baseUrl}/consulta-vuelo`, {
        params: cleanParams({
          ...this.paramsToGetFlights(),
        }),
      })
      .pipe(
        tap((response: FlightsResponse) => {
          this.flights.set(response.datos);
          this.sessionStorage.set('flights', this.flights());
        }),
        tap(() => this.sessionStorage.set('paramsToGetFlights', this.paramsToGetFlights())),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener los vuelos'));
        }),
      );
  }

  getMasterByManifest(): Observable<MasterResponse> {
    return this.http
      .get<MasterResponse>(`${this.baseUrl}/consulta-master`, {
        params: cleanParams({
          idHead: this.idHeadManifest(),
        }),
      })
      .pipe(
        tap((response: MasterResponse) => {
          this.masterByManifest.set(response.datos);
          this.sessionStorage.set('masterByManifest', this.masterByManifest());
        }),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener los master del manifiesto'));
        }),
      );
  }

  getHouseDetails(): Observable<HouseDetailsResponse> {
    return this.http
      .get<HouseDetailsResponse>(`${this.baseUrl}/consulta-house`, {
        params: cleanParams({
          numGuia: this.guideNum(),
        }),
      })
      .pipe(
        tap((response: HouseDetailsResponse) => {
          this.housesDetails.set(response.datos);
          // this.sessionStorage.set('housesDetails', this.housesDetails());
        }),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener las houses'));
        }),
      );
  }

  getMerchandisesAndPersons(): Observable<PersonsMerchandiseResponse> {
    return this.http
      .get<PersonsMerchandiseResponse>(`${this.baseUrl}/consulta-detalle`, {
        params: cleanParams({
          idHead: this.idHead(),
        }),
      })
      .pipe(
        tap((response: PersonsMerchandiseResponse) => {
          this.merchandises.set(response.datos.mercancias);
          this.persons.set(response.datos.personas);
          this.sessionStorage.set('merchandises', this.merchandises());
          this.sessionStorage.set('persons', this.persons());
        }),
        catchError((error) => {
          console.log('Error fetching ', error);
          return throwError(() => new Error('No se pudo obtener las personas y las mercancias'));
        }),
      );
  }

  redirectMasterDetails(master: Master) {
    this.guideNum.set(master.numGuia);
    this.sessionStorage.set('guideNum', this.guideNum());
    this.masterDetails.set(master);
    this.sessionStorage.set('masterDetails', this.masterDetails());
    this.setIdHead(master.idHead);
    this.navigateToDetailsPage();
  }

  redirectHouseDetails(house: HouseGuide, comesFromDetailsPage: boolean) {
    this.setIdHead(house.idHead);
    this.houseSelectedDetails.set(house);
    this.comesFromDetailsPage.set(comesFromDetailsPage);
    this.sessionStorage.set('houseSelectedDetails', this.houseSelectedDetails());
    this.sessionStorage.set('comesFromDetailsPage', comesFromDetailsPage);
    this.navigateToDetailsPage();
  }

  checkManifestClicked() {
    const manifestClicked = this.sessionStorage.get<Manisfest>('manifestClicked');
    return !!manifestClicked;
  }

  checkFlightClicked() {
    const flightClicked = this.sessionStorage.get<Flight>('flightClicked');
    return !!flightClicked;
  }

  private navigateToDetailsPage() {
    this.routingService.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      GUIAS_AEREAS_ROUTES.CONSULTA_AEREO_DETALLE,
      this.idHead(),
    ]);
  }

  private setIdHead(idHead: string) {
    this.idHead.set(idHead);
  }

  private loadFromSessionStorage() {
    const params = this.sessionStorage.get<ParamsManifests>('paramsToGetManifests');
    if (params) {
      this.paramsToGetManifests.set(params);
    }

    const master = this.sessionStorage.get<Master>('masterDetails');
    if (master) {
      this.masterDetails.set(master);
    }

    const guideNum = this.sessionStorage.get<string>('guideNum');
    if (guideNum) {
      this.guideNum.set(guideNum);
    }

    const houseSelectedDetails = this.sessionStorage.get<HouseGuide>('houseSelectedDetails');
    if (houseSelectedDetails) {
      this.houseSelectedDetails.set(houseSelectedDetails);
    }
  }
}
