import { NgClass } from '@angular/common';
import {
  Component,
  forwardRef,
  inject,
  Input,
  OnChanges,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsDatepickerModule,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { Tooltip } from '../tooltip/tooltip.component';

@Component({
  selector: 'date-picker',
  standalone: true,
  imports: [BsDatepickerModule, NgClass, Tooltip],
  templateUrl: './date-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor, OnChanges {
  @ViewChild('dp', { static: false }) datepicker?: BsDatepickerDirective;
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() hasError: boolean | null = false;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() isDisable = false;
  @Input() isRange: boolean = false;
  @Input() initialValue?: Date;

  private localeService = inject(BsLocaleService);
  private onChange = (value: Date | undefined) => {};
  private onTouched = () => {};

  bsConfig = this.initDateConfig();
  value?: Date | null;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.bsConfig = {
      ...this.initDateConfig(),
      minDate: this.minDate,
      maxDate: this.maxDate,
    };
    if (changes['minDate'] && !changes['minDate'].isFirstChange()) {
      this.value = null;
      this.onChange(undefined);
      if (this.datepicker) {
        this.datepicker.bsValue = undefined;
      }
    }
  }

  onChangeValue(value: Date | undefined): void {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: Date | undefined): void {
    this.value = value ?? null;

    // Clear visual input if value is null
    if (!value && this.datepicker) {
      this.datepicker.bsValue = undefined;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleBlur(): void {
    this.onTouched();
  }

  private initDateConfig(): Partial<BsDatepickerConfig> {
    this.localeService.use('es');
    return {
      containerClass: 'theme-default',
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
      keepDatesOutOfRules: true,
    };
  }
}
