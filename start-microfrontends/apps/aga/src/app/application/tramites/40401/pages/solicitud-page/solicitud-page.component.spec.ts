import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { BtnContinuarComponent, CatalogosService, WizardComponent } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SeccionQuery } from '../../../../core/queries/seccion.query';
import { SeccionStore } from '../../../../core/estados/seccion.store';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('SolicitantePageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockSeccionQuery: any;
  let mockSeccionStore: any;

  beforeEach(async () => {
    mockSeccionQuery = {
      selectSeccionState$: of({}),
    };

    mockSeccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [WizardComponent, PasoUnoComponent, PasoTresComponent, BtnContinuarComponent, SolicitudPageComponent, HttpClientTestingModule],
      providers: [
        HttpClientTestingModule,
        provideHttpClientTesting(),
        { provide: SeccionQuery, useValue: mockSeccionQuery },
        { provide: SeccionStore, useValue: mockSeccionStore },
        CatalogosService
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  
  it('should set indice on seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should update indice and call wizardComponent methods on getValorIndice', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ accion: 'prev', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });


});