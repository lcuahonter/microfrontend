import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { NumericDecimalDirective } from '@/shared/directives/numeric-decimal.directive';
import { FormUtils } from '@/shared/utils/formUtils';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { take, tap } from 'rxjs';
import { FareClass, UnitsWeight } from '../../../interfaces/catalogs.interface';
import { CommodityForm } from '../../../interfaces/guides-register.interface';

@Component({
  selector: 'app-commodity-details-form',
  standalone: true,
  imports: [ReactiveFormsModule, Tooltip, NumericDecimalDirective, CommonModule, ButtonComponent],
  templateUrl: './commodity-details-form.component.html',
})
export class CommodityDetailsFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private registerGuideService = inject(RegisterGuideService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  formUtils = FormUtils;
  fareClasses: FareClass[] = [];
  weightUnits: UnitsWeight[] = [];
  commodityForm = this.formBuilder.group({
    rateType: [null, Validators.required],
    grossWeightMeasure: [null, [Validators.required]],
    grossWeightUnitCode: [null, [Validators.required]],
    pieceQuantity: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadFromSessionStorage();
    this.getUnitsWeight();
    this.getFareClasses();
  }

  onSubmit(): void {
    this.commodityForm.markAllAsTouched();

    if (this.commodityForm.valid) {
      const merchandiseDetails = this.commodityForm.value as unknown as CommodityForm;
      this.registerGuideService.merchandiseDetails = merchandiseDetails;
      this.sessionStorage.set('merchandiseDetails', merchandiseDetails);
      this.registerGuideService.goToTabsPage();
    }
  }

  onCancel(): void {
    this.registerGuideService.goToTabsPage();
  }

  private loadFromSessionStorage() {
    const commodityForm = this.sessionStorage.get<any>('commodityForm');

    if (!!commodityForm) {
      try {
        this.commodityForm.patchValue(commodityForm);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }

  private getFareClasses() {
    this.catalogsService
      .getFareClasses()
      .pipe(
        tap((fareClasses: FareClass[]) => {
          this.fareClasses = fareClasses;
        }),
        take(1),
      )
      .subscribe();
  }

  private getUnitsWeight() {
    this.catalogsService
      .getUnitsWeight()
      .pipe(
        tap((weightUnits: UnitsWeight[]) => {
          this.weightUnits = weightUnits;
        }),
        take(1),
      )
      .subscribe();
  }
}
