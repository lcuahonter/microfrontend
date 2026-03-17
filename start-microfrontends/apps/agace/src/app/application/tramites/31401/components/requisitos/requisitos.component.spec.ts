import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequisitosComponent } from './requisitos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of, throwError } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import {
  TablaDinamicaComponent,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

describe('RequisitosComponent', () => {
  let component: RequisitosComponent;
  let fixture: ComponentFixture<RequisitosComponent>;
  let mockService: jest.Mocked<CancelacionGarantiaService>;

  const mockRequisitosData = [
    { value: 1, label: 'Opción A' },
    { value: 2, label: 'Opción B' },
  ];

  const mockTablaRequisitos = [
    { nombre: 'Archivo', tipo: 'PDF' },
    { nombre: 'Documento', tipo: 'Word' },
    { nombre: '', tipo: null },
  ];

  beforeEach(async () => {
    mockService = {
      obtenerDatosTablaRequisitos: jest.fn().mockReturnValue(of([])),
      getRequisitosRadioData: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<CancelacionGarantiaService>;

    await TestBed.configureTestingModule({
      imports: [
        RequisitosComponent,
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        FormasDinamicasComponent,
        TablaDinamicaComponent,
        RequisitosComponent,
      ],
      providers: [
        { provide: CancelacionGarantiaService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RequisitosComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should load and filter tablaRequisitos if response has valid data', () => {
  //     mockService.obtenerDatosTablaRequisitos.mockReturnValue(of(mockTablaRequisitos));
  //     jest.spyOn(component, 'obtenerRequisitosDatos');
  //     component.ngOnInit();
  //     expect(mockService.obtenerDatosTablaRequisitos).toHaveBeenCalled();
  //     expect(component.tablaRequisitos.length).toBe(2);
  //     expect(component.obtenerRequisitosDatos).toHaveBeenCalled();
  //   });

  it('should set tablaRequisitos as empty array if data is empty or invalid', () => {
    mockService.obtenerDatosTablaRequisitos.mockReturnValue(of([]));
    component.ngOnInit();
    expect(component.tablaRequisitos).toEqual([]);
  });

  it('should populate requisitosRadioData with service data', () => {
    mockService.getRequisitosRadioData.mockReturnValue(of(mockRequisitosData));
    component.obtenerRequisitosDatos();
    expect(component.requisitosRadioData).toEqual(mockRequisitosData);
  });

  it('should initialize the form with default values', () => {
    const controls = component.forma.controls;
    expect(controls['rfc'].disabled).toBe(true);
    expect(controls['senaleEncuentra'].value).toBe(1);
    expect(controls['delMismo'].disabled).toBe(true);
  });

  it('should return the nested ninoFormGroup', () => {
    expect(component.ninoFormGroup).toBeTruthy();
    expect(component.ninoFormGroup instanceof FormGroup).toBe(true);
  });

  it('should handle empty array response from service', () => {
    mockService.getRequisitosRadioData.mockReturnValue(of([]));
    component.obtenerRequisitosDatos();
    expect(component.requisitosRadioData).toEqual([]);
  });

  it('should set tipoSeleccionTabla as CHECKBOX by default', () => {
    expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
  });

  it('should set tableHeaderRequisitos from constant', () => {
    expect(component.tableHeaderRequisitos).toBeDefined();
  });

  it('should set requisitosFormData from REQUISITOS', () => {
    expect(component.requisitosFormData).toBeDefined();
    expect(Array.isArray(component.requisitosFormData)).toBe(true);
  });

  it('should complete destroy$ subject on destroy', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
