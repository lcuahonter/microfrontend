import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPasoComponent } from './solicitud-paso.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { PASOS } from '@libs/shared/data-access-user/src/core/enums/31616/modificacion.enum';

describe('SolicitudPasoComponent', () => {
  let component: SolicitudPasoComponent;
  let fixture: ComponentFixture<SolicitudPasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPasoComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize indice to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should initialize pasos with PASOS', () => {
    expect(component.pasos).toBe(PASOS);
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should call wizardComponent.siguiente when getValorIndice is called with accion "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.getValorIndice({ accion: 'cont', valor: 2 });

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras when getValorIndice is called with accion "atras"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    component.getValorIndice({ accion: 'atras', valor: 1 });

    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not change indice if valor is out of range in getValorIndice', () => {
    const initialIndice = component.indice;

    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(initialIndice);

    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(initialIndice);
  });
});
