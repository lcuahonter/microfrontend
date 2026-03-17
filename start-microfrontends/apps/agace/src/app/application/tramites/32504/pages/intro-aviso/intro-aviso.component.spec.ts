import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { IntroAvisoComponent } from './intro-aviso.component';
import { WizardComponent, ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS_TRES_STEPS, DatosPasos } from '@ng-mf/data-access-user';
import { AccionBoton } from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';
describe('IntroAvisoComponent', () => {
  let component: IntroAvisoComponent;
  let fixture: ComponentFixture<IntroAvisoComponent>;
  let mockWizard: Partial<WizardComponent>;

  beforeEach(async () => {
    mockWizard = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [IntroAvisoComponent, ToastrModule.forRoot(), HttpClientModule],
      providers: [ToastrService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroAvisoComponent);
    component = fixture.componentInstance;

    // override ViewChild wizardComponent
    (component as any).wizardComponent = mockWizard as WizardComponent;
    fixture.detectChanges();
  });

  it('should create with default index and datosPasos', () => {
    expect(component).toBeTruthy();
    expect(component.indice).toBe(1);
    const expected: DatosPasos = {
      nroPasos: PASOS_TRES_STEPS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
    expect(component.datosPasos).toEqual(expected);
  });

  it('getValorIndice increments index and calls siguiente when accion is cont and valor in range', () => {
    const action: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(action);
    expect(component.indice).toBe(2);

    expect(mockWizard.atras).not.toHaveBeenCalled();
  });

  it('getValorIndice decrements index and calls atras when accion is ant and valor in range', () => {
    component.indice = 3;
    const action: AccionBoton = { valor: 2, accion: 'ant' };
    component.getValorIndice(action);
    expect(component.indice).toBe(2);

    expect(mockWizard.siguiente).not.toHaveBeenCalled();
  });

  it('getValorIndice does nothing for valor out of range', () => {
    component.indice = 1;
    const actionLow: AccionBoton = { valor: 0, accion: 'cont' };
    component.getValorIndice(actionLow);
    expect(component.indice).toBe(1);
    expect(mockWizard.siguiente).not.toHaveBeenCalled();
    expect(mockWizard.atras).not.toHaveBeenCalled();

    const actionHigh: AccionBoton = { valor: 4, accion: 'ant' };
    component.getValorIndice(actionHigh);
    expect(component.indice).toBe(1);
  });
});
