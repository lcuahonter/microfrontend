import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PagoDerechosComponent } from './pago-derechos.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';



import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-pago-de-derechos',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StubPagoDeDerechosComponent),
      multi: true,
    },
  ],
})
class StubPagoDeDerechosComponent implements ControlValueAccessor {
  formularioSolicitudValidacion = jest.fn().mockReturnValue(true);
  isAnyFieldFilledButNotAll = jest.fn().mockReturnValue(false);
  continuarButtonClicked = false;
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

class MockPagoDerechosQuery {
  selectSolicitud$ = of({});
}
class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}

describe('PagoDerechosComponent', () => {
  let component: PagoDerechosComponent;
  let fixture: ComponentFixture<PagoDerechosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CommonModule],
      declarations: [StubPagoDeDerechosComponent, PagoDerechosComponent],
      providers: [
        { provide: 'PagoDerechosQuery', useClass: MockPagoDerechosQuery },
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
        provideHttpClient(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PagoDerechosComponent, {
      set: {
        providers: [
          { provide: 'PagoDerechosQuery', useClass: MockPagoDerechosQuery },
          { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
        ],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDerechosComponent);
    component = fixture.componentInstance;
    (component as any).pagoDeDerechosComponent = new StubPagoDeDerechosComponent();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call validarContenedor and return true', () => {
    expect(component.validarContenedor()).toBe(true);
  });

  it('should call isAnyFieldFilledButNotAll and return false', () => {
    expect(component.isAnyFieldFilledButNotAll()).toBe(false);
  });

  it('should get continuarButtonClicked as false', () => {
    expect(component.continuarButtonClicked).toBe(false);
  });

  it('should clean up on destroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
