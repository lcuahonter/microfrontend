import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { NumericDecimalDirective } from '@/shared/directives/numeric-decimal.directive';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { UnitsWeight } from '../../../interfaces/catalogs.interface';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { take, tap } from 'rxjs';
import { SequenceMerchandiseForm } from '../../../interfaces/guides-register.interface';

@Component({
  selector: 'app-sequence-merchandise-details-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    ButtonComponent,
    NgClass,
    NgIf,
    MaxLengthDirective,
    NumericDecimalDirective,
    NgFor,
  ],
  templateUrl: './sequence-merchandise-details-form.component.html',
})
export class SequenceMerchandiseDetailsComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private registerGuideService = inject(RegisterGuideService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);

  weightUnits: UnitsWeight[] = [];
  formUtils = FormUtils;
  commoditySequenceForm = this.formBuilder.group({
    grossWeightMeasure: [null, Validators.required],
    grossWeightUnitCode: [null, Validators.required],
    pieceQuantity: [null, Validators.required],
    description: [null, Validators.required],
    chargeableWeightMeasure: [null, Validators.required],
    chargeableWeightUnitCode: [null, Validators.required],
  });

  ngOnInit(): void {
    this.getUnitsWeight();
    this.loadFromSessionStorage();
  }

  onSubmit() {
    this.commoditySequenceForm.markAllAsTouched();

    if (this.commoditySequenceForm.valid) {
      const sequenceMerchandise = {
        ...this.commoditySequenceForm.value,
        temporalId: Date.now(),
      } as unknown as SequenceMerchandiseForm;

      this.registerGuideService.sequenceMerchandise = [
        ...(this.registerGuideService.sequenceMerchandise ?? []),
        sequenceMerchandise,
      ];
      this.sessionStorage.set('sequenceMerchandise', this.registerGuideService.sequenceMerchandise);
      this.registerGuideService.goToTabsPage();
    }
  }

  onCancel(): void {
    this.registerGuideService.goToTabsPage();
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

  private loadFromSessionStorage() {
    const commoditySequenceForm = this.sessionStorage.get<any>('commoditySequenceForm');

    if (!!commoditySequenceForm) {
      try {
        this.commoditySequenceForm.patchValue(commoditySequenceForm);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }
}
