import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfraestructuraComponent } from './infraestructura.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { INFRAESTRUCTURA } from '../../constantes/cancelacion-garantia.enum';

describe('InfraestructuraComponent', () => {
  let component: InfraestructuraComponent;
  let fixture: ComponentFixture<InfraestructuraComponent>;

  const mockRadioOptions = [
    { value: 1, label: 'Opción A' },
    { value: 2, label: 'Opción B' },
  ];

  const cancelacionGarantiaServiceMock = {
    getRequisitosRadioData: jest.fn().mockReturnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfraestructuraComponent, HttpClientTestingModule, ReactiveFormsModule],
       providers: [
        {
          provide: CancelacionGarantiaService,
          useValue: cancelacionGarantiaServiceMock,
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InfraestructuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should initialize form with expected controls and values', () => {
    const form = component.forma;
    expect(form.get('porcentaje')?.value).toBe('54');
    expect(form.get('porcentaje')?.disabled).toBe(true);
    expect(form.get('monto')?.value).toBe('54');
    expect(form.get('manifiesteCuenta')?.value).toBe(1);
    expect(form.get('capture')?.value).toBe(434);
  });

  it('should return ninoFormGroup as a FormGroup', () => {
    const ninoGroup = component.ninoFormGroup;
    expect(ninoGroup instanceof Object).toBe(true);
  });

  it('should call obtenerRadioDatos on ngOnInit', () => {
    const spy = jest.spyOn(component, 'obtenerRadioDatos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

    it('should populate radioDatos if service returns valid data', () => {
    cancelacionGarantiaServiceMock.getRequisitosRadioData.mockReturnValue(of(mockRadioOptions));
    component.obtenerRadioDatos();
    expect(component.radioDatos).toEqual(mockRadioOptions);
  });


  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
