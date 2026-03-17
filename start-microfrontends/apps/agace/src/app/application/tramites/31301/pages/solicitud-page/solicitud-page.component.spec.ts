import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let wizardMock: jest.Mocked<WizardComponent>;

  beforeEach(async () => {
    wizardMock = {
      siguiente: jest.fn(()=> of()),
      atras: jest.fn(()=>of())
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        WizardComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent,
        BtnContinuarComponent,
        SolicitudPageComponent,
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [{ provide: WizardComponent, useValue: wizardMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.wizardComponent = wizardMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not update indice for invalid tab values', () => {
    component.seleccionaTab(-1);
    expect(component.indice).toBe(-1);
  });

  it('should handle edge cases for getValorIndice', () => {
    const invalidEvent = { accion: 'invalid', valor: 5 };
    component.getValorIndice(invalidEvent);
    expect(component.indice).not.toBe(5);

    const nullActionEvent = { accion: 'cont', valor: 2 };
    component.getValorIndice(nullActionEvent);
    expect(component.indice).toBe(2);
  });
});