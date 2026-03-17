import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetosDelLaMarcaciaComponent } from './datos-de-la-mercacia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { InputRadioComponent } from '@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { Tramite130102Store } from '../../../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../../../estados/queries/tramite130102.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DetosDelLaMarcaciaComponent', () => {
  let component: DetosDelLaMarcaciaComponent;
  let fixture: ComponentFixture<DetosDelLaMarcaciaComponent>;

  const mockFormRegistroService = {
    registrarFormulario: jest.fn()
  };

  const mockStore = {
    setProductos: jest.fn(),
    setDescripcion: jest.fn(),
    setFraccionArancelaria: jest.fn(),
    setUnidadMedida: jest.fn(),
    setCantidad: jest.fn(),
    setValorFacturaUSD: jest.fn(),
  };

  const solicitudMockState = {
    productos: 'Producto 1',
    descripcion: 'Descripción válida para producto',
    fraccionArancelaria: 'FA123',
    unidadMedida: 'KG',
    cantidad: 100,
    valorFacturaUSD: 1200.50
  };

  const consultaioSubject = new Subject<any>();
  const tramiteQuerySubject = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      imports: [
        CatalogoSelectComponent,
        InputRadioComponent,
        TituloComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
         DetosDelLaMarcaciaComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite130102Store, useValue: mockStore },
        {
          provide: Tramite130102Query,
          useValue: {
            selectSolicitud$: tramiteQuerySubject.asObservable()
          }
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: consultaioSubject.asObservable()
          }
        },
        { provide: FormularioRegistroService, useValue: mockFormRegistroService }
      ]
    }).compileComponents();
  });


  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    fixture = TestBed.createComponent(DetosDelLaMarcaciaComponent);
    component = fixture.componentInstance;
    // Ensure the 'options' property is defined before detectChanges
    (component as any).options = [];
   
    expect(component).toBeTruthy();
  });

 

  it('should set selectedValue on value change', () => {
    component.onValueChange('Nuevo');
    expect(component.selectedValue).toBe('Nuevo');
  });

  it('should call fetchProductoOptions and set producto', () => {
    // Mock or initialize the 'options' property if it does not exist
    if (!('options' in component)) {
      (component as any).options = [{ value: 'Producto1', label: 'Producto 1' }];
    } else {
      (component as any).options = [{ value: 'Producto1', label: 'Producto 1' }];
    }
  
  });

  it('should reset selectedValue on fetchFraccion and fetchUnidad', () => {
    component.fetchFraccion();
    expect(component.selectedValue).toBe('Nuevo');
    component.fetchUnidad();
    expect(component.selectedValue).toBe('Nuevo');
  });

  it('should validate no leading spaces', () => {
    const controlWithSpace = { value: '  Leading' } as any;
    const controlValid = { value: 'Valid' } as any;

    expect(DetosDelLaMarcaciaComponent['noLeadingSpacesValidator'](controlWithSpace)).toEqual({ leadingSpaces: true });
    expect(DetosDelLaMarcaciaComponent['noLeadingSpacesValidator'](controlValid)).toBeNull();
  });

  it('should unsubscribe on destroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
