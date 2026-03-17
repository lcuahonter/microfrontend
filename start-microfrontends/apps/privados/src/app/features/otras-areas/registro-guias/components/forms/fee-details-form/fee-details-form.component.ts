import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { NumericDecimalDirective } from '@/shared/directives/numeric-decimal.directive';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { take, tap } from 'rxjs';
import { Currency, FareClass, PaymentIndicator } from '../../../interfaces/catalogs.interface';
import { FeeDetailsForm } from '../../../interfaces/guides-register.interface';

@Component({
  selector: 'app-fee-details-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    CommonModule,
    ButtonComponent,
    MaxLengthDirective,
    NumericDecimalDirective,
  ],
  templateUrl: './fee-details-form.component.html',
})
export class FeeDetailsFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private registerGuideService = inject(RegisterGuideService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  paymentIndicators: PaymentIndicator[] = [];
  fareClasses: FareClass[] = [];
  currencyCodes: Currency[] = [];
  formUtils = FormUtils;
  rateForm = this.formBuilder.group({
    rateType: [null, Validators.required],
    prepaidIndicator: [null, Validators.required],
    agentTotalDuePayable: [null],
    agentCurrencyId: [null, Validators.required],
    grandTotalAmount: [null],
    grandCurrencyId: [null, Validators.required],
  });

  ngOnInit(): void {
    this.getFareClasses();
    this.getPaymentIndicators();
    this.getCurrency();
  }

  onSubmit(): void {
    this.rateForm.markAllAsTouched();

    if (this.rateForm.valid) {
      const feeDetails = this.rateForm.value as unknown as FeeDetailsForm;
      this.registerGuideService.feeDetails = feeDetails;
      this.sessionStorage.set('feeDetails', feeDetails);
      this.registerGuideService.goToTabsPage();
    }
  }

  onCancel(): void {
    this.registerGuideService.goToTabsPage();
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

  private getPaymentIndicators() {
    this.catalogsService
      .getPaymentIndicators()
      .pipe(
        tap((paymentIndicators: PaymentIndicator[]) => {
          this.paymentIndicators = paymentIndicators;
        }),
        take(1),
      )
      .subscribe();
  }

  private getCurrency() {
    this.catalogsService
      .getCurrency()
      .pipe(
        tap((currency: Currency[]) => {
          this.currencyCodes = currency;
        }),
        take(1),
      )
      .subscribe();
  }
}
