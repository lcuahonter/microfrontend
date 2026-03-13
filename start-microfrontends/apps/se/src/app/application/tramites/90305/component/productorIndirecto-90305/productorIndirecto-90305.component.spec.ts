import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductorIndirecto90305Component } from './productorIndirecto-90305.component';
import { of } from 'rxjs';

import { ConfiguracionColumna } from '@ng-mf/data-access-user';

import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

import { CommonModule } from '@angular/common';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { ProductorIndirecto } from '../../models/prosec-modificacion.model';

describe('ProductorIndirecto90305Component', () => {
  let component: ProductorIndirecto90305Component;
  let fixture: ComponentFixture<ProductorIndirecto90305Component>;
  let mockService: ProsecModificacionServiceTsService;

  const MOCK_PRODUCTOR_DATA: ProductorIndirecto [] = [
    { registroFederal: 'ABC123', denominacion: 'Empresa A', correo: 'empresaA@example.com', eStatus: 'Activo' },
    { registroFederal: 'XYZ456', denominacion: 'Empresa B', correo: 'empresaB@example.com', eStatus: 'Inactivo' }
  ];

  beforeEach(async () => {
    // Creating a simple mock service manually
    mockService = {
      getProductoIndirecto: () => of(MOCK_PRODUCTOR_DATA),
    } as ProsecModificacionServiceTsService;

    await TestBed.configureTestingModule({
      imports: [ProductorIndirecto90305Component, CommonModule, TituloComponent, TablaDinamicaComponent],
      providers: [{ provide: ProsecModificacionServiceTsService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductorIndirecto90305Component);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call loadProductoIndirecto()', () => {
    component.ngOnInit();
    expect(component.productoIndData).toEqual(MOCK_PRODUCTOR_DATA);
  });

  it('should have the correct table configuration', () => {
    const EXPECTED_CONFIG: ConfiguracionColumna<ProductorIndirecto >[] = [
      { encabezado: 'Registro federal de contribuyentes', clave: (item: ProductorIndirecto ) => item.registroFederal, orden: 1 },
      { encabezado: 'Denominación o razón social', clave: (item: ProductorIndirecto ) => item.denominacion, orden: 2 },
      { encabezado: 'Correo', clave: (item: ProductorIndirecto ) => item.correo, orden: 3 },
      { encabezado: 'Estatus', clave: (item: ProductorIndirecto ) => item.eStatus, orden: 4 }
    ];
  
    expect(component.configuracionTabla.length).toBe(EXPECTED_CONFIG.length);
  
    EXPECTED_CONFIG.forEach((expectedCol, index) => {
      expect(component.configuracionTabla[index].encabezado).toBe(expectedCol.encabezado);
      expect(component.configuracionTabla[index].orden).toBe(expectedCol.orden);
      
      // Check if clave is a function that returns the expected types
      const TEST_ITEM = { registroFederal: 'RFC123', denominacion: 'Company X', correo: 'email@example.com', eStatus: "true" };
      const RESULT = component.configuracionTabla[index].clave(TEST_ITEM);
      
      expect(typeof RESULT).toMatch(/string|number|boolean|undefined/);
    });
  });
  

  it('should call loadProductoIndirecto() and populate productoIndData', () => {
    component.loadProductoIndirecto();
    expect(component.productoIndData).toEqual(MOCK_PRODUCTOR_DATA);
  });
});
