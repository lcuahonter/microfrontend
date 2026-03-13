import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambioDenominacionRazonSocialComponent } from './cambio-denominacion-razon-social.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { of } from 'rxjs';

describe('CambioDenominacionRazonSocialComponent', () => {
  let component: CambioDenominacionRazonSocialComponent;
  let fixture: ComponentFixture<CambioDenominacionRazonSocialComponent>;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setFolioAcuse: jest.fn()
    };
    queryMock = {
      selectSolicitud$: of({
        rfcVucem: 'RFCVUCEM',
        razonSocialVucem: 'SOCIALVUCEM',
        rfcIdc: 'RFCIDC',
        razonSocialIdc: 'SOCIALIDC',
        folioAcuse: 'FOLIO'
      })
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, CambioDenominacionRazonSocialComponent],
      providers: [
        FormBuilder,
        { provide: Solicitud30505Store, useValue: storeMock },
        { provide: Solicitud30505Query, useValue: queryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CambioDenominacionRazonSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize avisoCambioRazonSocialForm on ngOnInit', () => {
    expect(component.avisoCambioRazonSocialForm).toBeDefined();
    expect(component.avisoCambioRazonSocialForm.get('rfcVucem')).toBeTruthy();
    expect(component.avisoCambioRazonSocialForm.get('folioAcuse')).toBeTruthy();
  });

  it('should disable the form if soloLectura is true', () => {
    component.soloLectura = true;
    component.ngOnInit();
    expect(component.avisoCambioRazonSocialForm.disabled).toBe(true);
  });

  it('should call setFolioAcuse with correct value in validarFolioAcuse', () => {
    component.avisoCambioRazonSocialForm.patchValue({ folioAcuse: 'FOLIO123' });
    component.validarFolioAcuse();
    expect(storeMock.setFolioAcuse).toHaveBeenCalledWith('FOLIO123');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
