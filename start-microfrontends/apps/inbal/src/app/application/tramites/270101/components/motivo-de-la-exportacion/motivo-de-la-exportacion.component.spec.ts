import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotivoDeLaExportacionComponent } from './motivo-de-la-exportacion.component';
import { HttpClientModule } from '@angular/common/http';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { of } from 'rxjs';
import { Tramite270101Store } from '../../../../estados/tramites/270101/tramite270101.store';
import { Tramite270101Query } from '../../../../estados/queries/270101/tramite270101.query';
import { FormControl, FormGroup } from '@angular/forms';

describe('MotivoDeLaExportacionComponent', () => {
  let component: MotivoDeLaExportacionComponent;
  let fixture: ComponentFixture<MotivoDeLaExportacionComponent>;
  let exportarIlustracionesService: jest.Mocked<ExportarIlustracionesService>;
  let tramiteStore: jest.Mocked<Tramite270101Store>;
  let tramiteQuery: jest.Mocked<Tramite270101Query>;

  const mockMotivoData = [
    { id: 1, descripcion: 'Venta' },
    { id: 2, descripcion: 'Donación' },
  ];

  beforeEach(async () => {
    const mockExportService = {
      getMonedaData: jest.fn().mockReturnValue(of(mockMotivoData)),
      setForm: jest.fn(),
    };

    const mockStore = {
      setDynamicFieldValue: jest.fn(),
    };

    const mockQuery = {
      selectExportarIlustraciones$: of({ test: 'value' }),
    };
    
    await TestBed.configureTestingModule({
      imports: [MotivoDeLaExportacionComponent, HttpClientModule],
      providers: [
        { provide: ExportarIlustracionesService, useValue: mockExportService },
        { provide: Tramite270101Store, useValue: mockStore },
        { provide: Tramite270101Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MotivoDeLaExportacionComponent);
    component = fixture.componentInstance;
    exportarIlustracionesService = TestBed.inject(ExportarIlustracionesService) as jest.Mocked<ExportarIlustracionesService>;
    tramiteStore = TestBed.inject(Tramite270101Store) as jest.Mocked<Tramite270101Store>;
    tramiteQuery = TestBed.inject(Tramite270101Query) as jest.Mocked<Tramite270101Query>;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and set motivoData and MOTIVO_DE_LA_EXPORTACION options', () => {
    component.ngOnInit();
    expect(component.motivoData.length).toBe(2);
    const motivoField = component.motivoFormData.find(f => f.campo === 'motivo') as { opciones?: { id: number; descripcion: string }[] };
    expect(motivoField?.opciones?.length).toBe(2);
    expect(motivoField?.opciones).toEqual([
      { id: 1, descripcion: 'Venta' },
      { id: 2, descripcion: 'Donación' }
    ]);
  });

  it('should call setDynamicFieldValue and setForm when motivo is set', () => {
    const motivoControl = new FormControl('Venta');
    const mockFormGroup = new FormGroup({
      motivo: motivoControl
    });
    component.forma.setControl('ninoFormGroup', mockFormGroup);
    const nombreIndex = component.motivoFormData.findIndex(f => f.campo === 'nombre');
    if (nombreIndex !== -1) {
      component.motivoFormData[nombreIndex].mostrar = false;
    }
    component.establecerCambioDeValor({ campo: 'nombre', valor: 'Juan' });
    expect(tramiteStore.setDynamicFieldValue).toHaveBeenCalledWith('nombre', 'Juan');
    expect(exportarIlustracionesService.setForm).toHaveBeenCalled();
    expect(component.motivoFormData[nombreIndex].mostrar).toBe(true);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should not change "nombre" field visibility if motivo is not "Venta"', () => {
    const motivoControl = new FormControl('Consignación');
    const mockFormGroup = new FormGroup({ motivo: motivoControl });
    component.forma.setControl('ninoFormGroup', mockFormGroup);
    const nombreIndex = component.motivoFormData.findIndex(f => f.campo === 'nombre');
    if (nombreIndex !== -1) {
      component.motivoFormData[nombreIndex].mostrar = true;
    }
    component.establecerCambioDeValor({ campo: 'nombre', valor: 'Ana' });
    expect(tramiteStore.setDynamicFieldValue).toHaveBeenCalledWith('nombre', 'Ana');
    expect(component.motivoFormData[nombreIndex].mostrar).toBe(true);
  });
  
  it('should update dynamic field and toggle visibility when motivo is "Venta"', () => {
    const motivoControl = new FormControl('Venta');
    const mockFormGroup = new FormGroup({ motivo: motivoControl });
    component.forma.setControl('ninoFormGroup', mockFormGroup);
    const nombreIndex = component.motivoFormData.findIndex(f => f.campo === 'nombre');
    if (nombreIndex !== -1) {
      component.motivoFormData[nombreIndex].mostrar = false;
    }
    component.establecerCambioDeValor({ campo: 'nombre', valor: 'Lara' });
    expect(tramiteStore.setDynamicFieldValue).toHaveBeenCalledWith('nombre', 'Lara');
    expect(component.motivoFormData[nombreIndex].mostrar).toBe(true);
  });

  it('should call setForm only once when establecerCambioDeValor is called', () => {
    const motivoControl = new FormControl('Venta');
    const mockFormGroup = new FormGroup({ motivo: motivoControl });
    component.forma.setControl('ninoFormGroup', mockFormGroup);
    const nombreIndex = component.motivoFormData.findIndex(f => f.campo === 'nombre');
    if (nombreIndex !== -1) {
      component.motivoFormData[nombreIndex].mostrar = false;
    }
    component.establecerCambioDeValor({ campo: 'nombre', valor: 'Carlos' });
    expect(exportarIlustracionesService.setForm).toHaveBeenCalledTimes(1);
  });
  
  it('should update dynamic field and toggle visibility when motivo is "Venta"', () => {
    const motivoControl = new FormControl('Venta');
    const mockFormGroup = new FormGroup({ motivo: motivoControl });
    component.forma.setControl('ninoFormGroup', mockFormGroup);
    const nombreIndex = component.motivoFormData.findIndex(f => f.campo === 'nombre');
    if (nombreIndex !== -1) {
      component.motivoFormData[nombreIndex].mostrar = false;
    }
    component.establecerCambioDeValor({ campo: 'nombre', valor: 'Lara' });
    expect(tramiteStore.setDynamicFieldValue).toHaveBeenCalledWith('nombre', 'Lara');
    expect(component.motivoFormData[nombreIndex].mostrar).toBe(true);
  });
  
});
