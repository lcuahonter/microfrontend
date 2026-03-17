import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TercerosRelacionadosProcedenciaComponent } from './terceros-relacionados-procedencia.component';
import { TercerosProcedenciaService } from '../../services/terceros-procedencia.service';
import { of } from 'rxjs';
import { TableData, TipoMoModel } from '../../models/permiso-importacion-biologica.models';

describe('TercerosRelacionadosProcedenciaComponent', () => {
  let component: TercerosRelacionadosProcedenciaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosProcedenciaComponent>;
  let tercerosServiceMock: any;

  beforeEach(async () => {
    tercerosServiceMock = {
      getInformacioDeTabla: jest.fn(() => of({
        columns: ['Column1', 'Column2']
      })),
      getFabricanteDatos: jest.fn(() => of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule,TercerosRelacionadosProcedenciaComponent],
      providers: [{ provide: TercerosProcedenciaService, useValue: tercerosServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosProcedenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create the component', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should initialize fabricanteHeaderData on ngOnInit', () => {
  //   expect(component.fabricanteHeaderData).toEqual(['Column1', 'Column2']);
  // });

  it('should add a table row when agregarTabla is called', () => {
    const mockData: TipoMoModel = {
      razonSocial: 'Test Company',
      rfc: 'TESTRFC123',
      curp: 'TESTCURP123',
      telefono: '1234567890',
      correoElectronico: 'test@example.com',
      calle: 'Test Street',
      numeroExterior: '100',
      numeroInterior: '10A',
      pais: 'Test Country',
      colonia: 'Test Colony',
      municipio: 'Test Municipality',
      localidad: 'Test Locality',
      entidadFederativa: 'Test State',
      estado: 'Test State/Locality',
      codigoPostal: '123456',
      coloniaEquivalente: 'Test Colony Equiv',
      tipoPersona: false,
      lada: ''
    };

    component.agregarTabla(mockData);

    expect(component.fabricanteRowData.length).toBe(1);
    expect(component.fabricanteRowData[0].tbodyData).toEqual(Object.values({
      "Nombre/denominación o razón social": 'Test Company',
      "R.F.C": 'TESTRFC123',
      "CURP": 'TESTCURP123',
      "Teléfono": '1234567890',
      "Correo electrónico": 'test@example.com',
      "Calle": 'Test Street',
      "Número exterior": '100',
      "Número interior": '10A',
      "País": 'Test Country',
      "Colonia": 'Test Colony',
      "Municipio o alcaldía": 'Test Municipality',
      "Localidad": 'Test Locality',
      "Entidad federativa": 'Test State',
      "Estado/localidad": 'Test State/Locality',
      "Código postal": '123456',
      "Colonia o equivalente": 'Test Colony Equiv'
    }));
  });

  it('should update isDatosGeneralesVisible when abrirProcedencia and cerrarProcedencia are called', () => {
    component.abrirProcedencia();
    expect(component.isDatosGeneralesVisible).toBeTruthy();

    component.cerrarProcedencia();
    expect(component.isDatosGeneralesVisible).toBeFalsy();
  });
});
