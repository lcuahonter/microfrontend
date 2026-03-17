import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: ComponentFixture<SolicitantePageComponent>;
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
      imports:[SolicitantePageComponent,HttpClientModule],
      providers: [
        {  useValue: mockSeccionQuery },
        {  useValue: mockSeccionStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitantePageComponent);
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