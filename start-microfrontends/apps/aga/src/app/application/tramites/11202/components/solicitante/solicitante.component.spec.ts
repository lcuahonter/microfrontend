
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SolicitanteComponent } from './solicitante.component';
import { Solicitud11202Store } from "../../../../core/estados/tramites/solicitud11202.store";
import { Solicitud11202Query } from '../../../../core/queries/solicitud11202.query';
import { of } from 'rxjs';


@NgModule({
  declarations: [
    SolicitanteComponent,
  ],
  imports: [FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
class TestModule { }

describe('SolicitanteComponent', () => {
  let fixture: ComponentFixture<SolicitanteComponent>;
  let component: SolicitanteComponent;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;



  beforeEach(() => {
    tramiteStoreMock = {
      setGrupoTratadoFechaFinalInput: jest.fn(),
    };
    tramiteQueryMock = {
      selectSolicitud$: of({
        rfc: '',
        denominacion: '',
        actividadEconomica: '',
        correoElectronico: '',
        pais: '',
        codigoPostal: 0,
        estado: '',
        municipioAlcaldia: '',
        localidad: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        lada: '',
        telefono: 0,
      }),
    };
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [FormBuilder,
        { provide: Solicitud11202Store, useValue: tramiteStoreMock },
        { provide: Solicitud11202Query, useValue: tramiteQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    component.solicitudForm = new FormGroup({
      rfc: new FormControl(''),
      denominacion: new FormControl(''),
      actividadEconomica: new FormControl(''),
      correoElectronico: new FormControl(''),
    });
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = function () { };
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.ngOnInit();
  }); 

  it('should return the datosGenerales FormGroup', () => {
    component.solicitudForm = new FormBuilder().group({
      datosGenerales: new FormBuilder().group({
        rfc: ['testRFC'],
        denominacion: ['testDenominacion'],
      }),
    });
    const datosGenerales = component.datosGenerales;
    expect(datosGenerales).toBeDefined();
    expect(datosGenerales.get('rfc')?.value).toBe('testRFC');
    expect(datosGenerales.get('denominacion')?.value).toBe('testDenominacion');
  });
  it('should return the domicilioFiscal FormGroup', () => {
    component.solicitudForm = new FormBuilder().group({
      domicilioFiscal: new FormBuilder().group({
        pais: ['testPais'],
        codigoPostal: ['12345'],
      }),
    });
    const domicilioFiscal = component.domicilioFiscal;
    expect(domicilioFiscal).toBeDefined();
    expect(domicilioFiscal.get('pais')?.value).toBe('testPais');
    expect(domicilioFiscal.get('codigoPostal')?.value).toBe('12345');
  });
});
