import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlDeInventariosComponent } from './control-de-inventarios.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of, throwError, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent, InputRadioComponent } from '@libs/shared/data-access-user/src';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { CommonModule } from '@angular/common';

describe('ControlDeInventariosComponent', () => {
  let component: ControlDeInventariosComponent;
  let fixture: ComponentFixture<ControlDeInventariosComponent>;
  let mockService: jest.Mocked<CancelacionGarantiaService>;

  beforeEach(async () => {

    mockService = {
      getRequisitosRadioData: jest.fn().mockReturnValue(of([])),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ControlDeInventariosComponent, HttpClientTestingModule],
      providers: [
        { provide: CancelacionGarantiaService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlDeInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with disabled default values', () => {
    const forma = component.forma;
    expect(forma.get('nombreDelSistema')?.value).toBe('dasda');
    expect(forma.get('nombreDelSistema')?.disabled).toBe(true);
    expect(forma.get('lugar')?.value).toBe('sadas');
    expect(forma.get('senaleSiIleva')?.value).toBe(1);
    expect(forma.get('senaleSiIngresa')?.value).toBe(1);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
