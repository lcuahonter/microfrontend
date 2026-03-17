import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { DomicilioComponent } from './domicilio.component';
import { Tramite120602Store } from '../../estados/tramite-120602.store';
import { SolicitanteService } from '@ng-mf/data-access-user';

describe('DomicilioComponent', () => {
  let component: DomicilioComponent;
  let fixture: ComponentFixture<DomicilioComponent>;
  let tramite120602StoreMock: any;
  let solicitanteServiceMock: any;

  beforeEach(async () => {
    tramite120602StoreMock = {
      setDomicilioFiscal: jest.fn(),
    };

    solicitanteServiceMock = {
      getDatosGenerales: jest.fn().mockReturnValue(of({
        data: JSON.stringify({
          domicilioFiscal: {
            calle: 'Calle 1',
            numero: '123',
            colonia: 'Centro',
          },
        }),
      })),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DomicilioComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite120602Store, useValue: tramite120602StoreMock },
        { provide: SolicitanteService, useValue: solicitanteServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should prefill the domicilioFiscal form with provided data', () => {
    const plantasData = [
      {
        calle: 'Calle 2',
        numeroInterior: '456',
        numeroExterior: '789',
        codigoPostal: '12345',
        colonia: 'Zona Norte',
        localidad: 'Localidad 1',
        municipio: 'Municipio 1',
        estado: 'Estado 1',
        pais: 'México',
        lada: '55',
        telefono: '1234567890',
      },
    ];
    component.prefillDomicilioForm(plantasData);
    expect(component.domicilioFiscalForm.value).toEqual({
      calle: 'Calle 2',
      nInt: '456',
      nExt: '789',
      codigoPostal: '12345',
      colonia: 'Zona Norte',
      localidad: 'Localidad 1',
      municipio: 'Municipio 1',
      entidadFederativa: 'Estado 1',
      pais: 'México',
      lada: '55',
      telefono: '1234567890',
    });
    expect(tramite120602StoreMock.setDomicilioFiscal).toHaveBeenCalled();
  });
});