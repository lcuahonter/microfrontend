import { Component, inject, signal } from '@angular/core';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { HouseGuide } from '../../../interfaces/air-waybill-forms.interface';

@Component({
  selector: 'app-general-data-house',
  standalone: true,
  imports: [],
  templateUrl: './general-data-house.component.html',
})
export class GeneralDataHouseComponent {
  private airWaybillService = inject(AirWaybillService);
  houseDetails = signal<HouseGuide>({} as HouseGuide);

  ngOnInit(): void {
    this.houseDetails.set(this.airWaybillService.houseSelectedDetails());
  }
}
