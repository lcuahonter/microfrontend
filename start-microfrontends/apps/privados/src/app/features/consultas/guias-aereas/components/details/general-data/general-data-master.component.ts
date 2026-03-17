import { Component, inject, OnInit, signal } from '@angular/core';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { Master } from '../../../interfaces/air-waybill-forms.interface';

@Component({
  selector: 'app-general-data-master',
  standalone: true,
  imports: [],
  templateUrl: './general-data-master.component.html',
})
export class GeneralDataMasterComponent implements OnInit {
  private airWaybillService = inject(AirWaybillService);
  masterDetails = signal<Master>({} as Master);

  ngOnInit(): void {
    this.masterDetails.set(this.airWaybillService.masterDetails());
  }
}
