import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { GeneralDataMasterComponent } from '../../components/details/general-data/general-data-master.component';
import { HouseComponent } from '../../components/details/house/house.component';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { RoutingService } from '@/core/services/routing.service';
import { APP_ROUTES } from '@/app.routes.constants';
import { CONSULTAS_ROUTES, STORE_FRONT_ROUTES } from '@/routes.constants';
import { ActivatedRoute } from '@angular/router';
import { delay, tap } from 'rxjs';
import { AirWaybillService } from '../../services/air-waybill.service';
import { PeopleMerchandiseComponent } from '../../components/details/people-merchandise/people-merchandise.component';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { HouseGuide, TypeSearch } from '../../interfaces/air-waybill-forms.interface';
import { GeneralDataHouseComponent } from '../../components/details/general-data-house/general-data-house.component';
import { GUIAS_AEREAS_ROUTES } from '../../guias-aereas.routes.constants';

@Component({
  selector: 'app-guia-aerea-detalles',
  standalone: true,
  imports: [
    NgIf,
    GeneralDataMasterComponent,
    HouseComponent,
    ButtonComponent,
    PeopleMerchandiseComponent,
    GeneralDataHouseComponent,
  ],
  templateUrl: './guia-aerea-detalles.page.html',
})
export class GuiaAereaDetallesPage implements OnInit {
  @ViewChild(PeopleMerchandiseComponent) peopleComp!: PeopleMerchandiseComponent;
  private routingService = inject(RoutingService);
  private activatedRoute = inject(ActivatedRoute);
  private airWaybillService = inject(AirWaybillService);
  private sessionStorage = inject(SessionStorageService);
  isHouseSelected = signal<boolean | null>(null);
  dataLoaded = signal<boolean | null>(false);

  ngOnInit(): void {
    this.checkSessionStorage();
    this.activatedRoute.paramMap
      .pipe(
        tap((params) => {
          const idHead = params.get('idHeader') ?? '';
          this.airWaybillService.idHead.set(idHead);
          this.dataLoaded.set(true);
        }),
      )
      .subscribe();
  }

  houseClicked(house: HouseGuide) {
    this.airWaybillService.redirectHouseDetails(house, true);
    this.isHouseSelected.set(true);
    this.peopleComp.getMerchandisesAndPersons();
  }

  checkSessionStorage() {
    const searchBy = this.sessionStorage.get<string>('searchBy');
    if (searchBy) {
      this.isHouseSelected.set(searchBy === TypeSearch.HOUSE);
    }
    const comesFromDetailsPage = this.sessionStorage.get<boolean>('comesFromDetailsPage');
    if (comesFromDetailsPage) {
      this.isHouseSelected.set(true);
      this.airWaybillService.comesFromDetailsPage.set(comesFromDetailsPage);
    }
  }

  goBack() {
    if (this.airWaybillService.comesFromDetailsPage()) {
      const idHead = this.airWaybillService.masterDetails().idHead;
      this.airWaybillService.idHead.set(idHead);
      this.airWaybillService.comesFromDetailsPage.set(false);
      this.sessionStorage.set('comesFromDetailsPage', false);
      this.isHouseSelected.set(false);
      this.peopleComp.getMerchandisesAndPersons();
      this.routingService.navigate([
        STORE_FRONT_ROUTES.CONSULTAS,
        GUIAS_AEREAS_ROUTES.CONSULTA_AEREO_DETALLE,
        idHead,
      ]);
    } else {
      this.routingService.navigate([
        STORE_FRONT_ROUTES.CONSULTAS,
        CONSULTAS_ROUTES.CONSULTA_GUIAS_AEREAS,
      ]);
    }
  }
}
