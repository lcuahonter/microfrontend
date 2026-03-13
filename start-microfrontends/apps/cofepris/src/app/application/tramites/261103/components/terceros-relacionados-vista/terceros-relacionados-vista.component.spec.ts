import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TercerosRelacionadosFabricanteComponent } from './terceros-relacionados-vista.component';
import { FABRICANTE_TABLA, OTROS_TABLA } from '../../../../shared/constantes/terceros-relacionados-fabricante.enum';
import { Fabricante, TablaSeleccion, ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { DatosProcedureState } from '../../../../estados/tramites/tramites261103.store';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('TercerosRelacionadosFabricanteComponent', () => {
  let component: TercerosRelacionadosFabricanteComponent;
  let mockDatosProcedureQuery: jest.Mocked<Partial<DatosProcedureQuery>>;
  let mockConsultaioQuery: jest.Mocked<Partial<ConsultaioQuery>>;

  const mockProcedureState: Partial<DatosProcedureState> = {
    ideGenerica1: '',
    observaciones: '',
    denominacion: '',
    codigo: '',
    estado: '',
    municipio: '',
    localidad: '',
    colonia: '',
    calle: '',
    correo: '',
    sanitario: '',
    lada: '',
    telefono: '',
    funcionamiento: '',
    licencia: ''
  };

  const mockConsultaioState: Partial<ConsultaioState> = {
    readonly: false,
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: ''
  };

  beforeEach(() => {
    mockDatosProcedureQuery = {
      selectSeccionState$: of(mockProcedureState as DatosProcedureState)
    };
    
    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState as ConsultaioState)
    };

    TestBed.configureTestingModule({
      imports: [
        TercerosRelacionadosFabricanteComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: DatosProcedureQuery, useValue: mockDatosProcedureQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    });

    const FIXTURE = TestBed.createComponent(TercerosRelacionadosFabricanteComponent);
    component = FIXTURE.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar fabricanteTablaDatos como un arreglo vacío', () => {
    expect(component.fabricanteTablaDatos).toEqual([]);
  });

  it('debería inicializar checkbox con TablaSeleccion.CHECKBOX', () => {
    expect(component.checkbox).toBe(TablaSeleccion.CHECKBOX);
  });

  it('debería inicializar facturadorTablaDatos como un arreglo vacío', () => {
    expect(component.facturadorTablaDatos).toEqual([]);
  });

  it('debería inicializar otrosTablaDatos como un arreglo vacío', () => {
    expect(component.otrosTablaDatos).toEqual([]);
  });

  it('debería inicializar configuracionFabricante con FABRICANTE_TABLA', () => {
    expect(component.configuracionFabricante).toEqual(FABRICANTE_TABLA);
  });

  it('debería inicializar configuracionOtros con OTROS_TABLA', () => {
    expect(component.configuracionOtros).toEqual(OTROS_TABLA);
  });

  describe('generateConfiguracionTabla', () => {
    it('debería devolver un arreglo de configuración válido para una entrada dada', () => {
      const INPUT = [
        { encabezado: 'Nombre', clave: 'nombre' as keyof Fabricante },
        { encabezado: 'Calle', clave: 'calle' as keyof Fabricante },
      ];
      
      const resultado = TercerosRelacionadosFabricanteComponent.generateConfiguracionTabla(INPUT);
      
      expect(resultado.length).toBe(2);
      expect(resultado[0].encabezado).toBe('Nombre');
      expect(resultado[0].orden).toBe(1);
      expect(typeof resultado[0].clave).toBe('function');
      expect(resultado[1].encabezado).toBe('Calle');
      expect(resultado[1].orden).toBe(2);
      expect(typeof resultado[1].clave).toBe('function');

      // Test that the clave function works correctly
      const testObject: Partial<Fabricante> = { 
        nombre: 'TestNombre', 
        calle: 'TestCalle' 
      };
      expect(resultado[0].clave(testObject as Fabricante)).toBe('TestNombre');
      expect(resultado[1].clave(testObject as Fabricante)).toBe('TestCalle');
    });
  });
});