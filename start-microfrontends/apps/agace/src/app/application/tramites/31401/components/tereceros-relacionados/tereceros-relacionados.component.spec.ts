import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerecerosRelacionadosComponent } from './tereceros-relacionados.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { TituloComponent, TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TerecerosTabla } from '../../models/cancelacion-garantia.model';

describe('TerecerosRelacionadosComponent', () => {
  let component: TerecerosRelacionadosComponent;
  let fixture: ComponentFixture<TerecerosRelacionadosComponent>;
  let mockService: jest.Mocked<CancelacionGarantiaService>;
  const validData: TerecerosTabla[] = [
  {
    rfc: 'XAXX010101000',
    curp: 'XEXX010101HNEXXXA4',
    nombre: 'Juan',
    primerApellido: 'Perez',
    segundoApellido: 'Lopez',
  },
  {
    rfc: 'BADD110313HCMLNS09',
    curp: 'BADD110313HCMLNS09',
    nombre: 'Maria',
    primerApellido: 'Garcia',
    segundoApellido: 'Hernandez',
  }
];

const mixedData: TerecerosTabla[] = [
  {
    rfc: '',
    curp: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
  },
  {
    rfc: 'CUPU800825569',
    curp: 'CUPU800825HDFABC01',
    nombre: 'Pedro',
    primerApellido: 'Ramirez',
    segundoApellido: 'Flores',
  }
];

const invalidData: TerecerosTabla[] = [
  {
    rfc: '',
    curp: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
  },
  {
    rfc: null as unknown as string,
    curp: null as unknown as string,
    nombre: null as unknown as string,
    primerApellido: null as unknown as string,
    segundoApellido: null as unknown as string,
  }
];

  beforeEach(async () => {
    mockService = {
      obtenerDatosTablaTereceros: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<CancelacionGarantiaService>;

    await TestBed.configureTestingModule({
      imports: [
        TerecerosRelacionadosComponent,
        HttpClientTestingModule,
        CommonModule,
        TituloComponent,
        TablaDinamicaComponent,
      ],
      providers: [
        { provide: CancelacionGarantiaService, useValue: mockService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TerecerosRelacionadosComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have CHECKBOX as default tipoSeleccionTabla', () => {
    expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
  });

  it('should populate tablaTereceros with valid data', () => {
      mockService.obtenerDatosTablaTereceros.mockReturnValue(of(validData));
      component.ngOnInit();
      expect(mockService.obtenerDatosTablaTereceros).toHaveBeenCalled();
      expect(component.tablaTereceros).toEqual(validData);
    });
});
