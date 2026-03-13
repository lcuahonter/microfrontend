import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { WizardComponent } from '@ng-mf/data-access-user';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    // Mock del WizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener los pasos y datosPasos inicializados correctamente', () => {
    expect(component.pantallasPasos).toBeDefined();
    expect(component.pasos).toBeDefined();
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('getValorIndice debe actualizar el índice y llamar wizardComponent.siguiente si accion es "cont"', () => {
    const evento = { accion: 'cont', valor: 2 };
    component.getValorIndice(evento);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('getValorIndice debe actualizar el índice y llamar wizardComponent.atras si accion no es "cont"', () => {
    const evento = { accion: 'atras', valor: 3 };
    component.getValorIndice(evento);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('getValorIndice no debe cambiar el índice ni llamar wizardComponent si valor está fuera de rango', () => {
    const evento = { accion: 'cont', valor: 0 };
    const indiceInicial = component.indice;
    component.getValorIndice(evento);
    expect(component.indice).toBe(indiceInicial);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});