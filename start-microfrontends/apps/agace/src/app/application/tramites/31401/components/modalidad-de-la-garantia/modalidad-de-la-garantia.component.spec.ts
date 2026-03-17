import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalidadDeLaGarantiaComponent } from './modalidad-de-la-garantia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';

describe('ModalidadDeLaGarantiaComponent', () => {
  let component: ModalidadDeLaGarantiaComponent;
  let fixture: ComponentFixture<ModalidadDeLaGarantiaComponent>;
  let mockService: jest.Mocked<CancelacionGarantiaService>;

  beforeEach(async () => {
    mockService = {
      getModalidadDeGarantiaData: jest.fn().mockReturnValue(of([]))
    } as unknown as jest.Mocked<CancelacionGarantiaService>;

    await TestBed.configureTestingModule({
      imports: [ModalidadDeLaGarantiaComponent, HttpClientTestingModule, ReactiveFormsModule],
       providers: [
        FormBuilder,
        { provide: CancelacionGarantiaService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalidadDeLaGarantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty array from service', () => {
    mockService.getModalidadDeGarantiaData.mockReturnValue(of([]));
    component.ngOnInit();
    expect(component.modalidadDeGarantiaData).toEqual([]);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
