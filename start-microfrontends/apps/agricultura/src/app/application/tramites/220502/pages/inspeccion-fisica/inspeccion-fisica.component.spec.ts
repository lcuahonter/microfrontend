import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPasos } from '@ng-mf/data-access-user';
import { InspeccionFisicaComponent } from './inspeccion-fisica.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WizardComponent } from '@ng-mf/data-access-user';
import { INSPECCION_FISICA_PASOS } from '../../enums/solicitud-pantallas.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('InspeccionFisicaComponent', () => {
  let component: InspeccionFisicaComponent;
  let fixture: ComponentFixture<InspeccionFisicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [WizardComponent, InspeccionFisicaComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspeccionFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasos with INSPECCIONFISIOPASOS', () => {
    expect(component.pasos).toEqual(INSPECCION_FISICA_PASOS);
  });

  it('should initialize datosPasos correctly', () => {
    const EXPECTEDDATOSPASOS: DatosPasos = {
      nroPasos: INSPECCION_FISICA_PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar'
    };
    expect(component.datosPasos).toEqual(EXPECTEDDATOSPASOS);
  });

  it('should update indice and call wizardComponent.siguiente on getValorIndice with accion "cont"', () => {
    component.wizardComponent = { 
      siguiente: jest.fn(()=> of()), 
      atras: jest.fn(()=> of()) 
    } as any;
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras on getValorIndice with accion "atras"', () => {
    component.wizardComponent = { 
      siguiente: jest.fn(()=> of()), 
      atras: jest.fn(()=> of()) 
    } as any;
    component.getValorIndice({ valor: 2, accion: 'atras' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods if valor is out of range', () => {
    const invalidEvent = { accion: 'invalid', valor: 5 };
    component.getValorIndice(invalidEvent);

    const nullActionEvent = { accion: 'cont', valor: 2 };
    component.getValorIndice(nullActionEvent);
  });
});