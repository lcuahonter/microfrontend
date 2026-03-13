import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertComponent, BtnContinuarComponent } from '@ng-mf/data-access-user';
import { RegistroSolicitudPageComponent } from './registro-solicitud-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';

describe('RegistroSolicitudPageComponent', () => {
  let fixture: ComponentFixture<RegistroSolicitudPageComponent>;
  let component: RegistroSolicitudPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule, 
        ReactiveFormsModule,
        WizardComponent,
        AlertComponent,
        BtnContinuarComponent
      ],
      declarations: [
        RegistroSolicitudPageComponent        
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroSolicitudPageComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', () => {
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('should run #getValorIndice()', () => {
    component.wizardComponent = component.wizardComponent || {} as WizardComponent;
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ valor: 1, accion: 'prev' });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });
});