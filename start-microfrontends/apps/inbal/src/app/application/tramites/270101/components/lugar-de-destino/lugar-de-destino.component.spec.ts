import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LugarDeDestinoComponent } from './lugar-de-destino.component';
import { HttpClientModule } from '@angular/common/http';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import { Tramite270101Store } from '../../../../estados/tramites/270101/tramite270101.store';
import { Tramite270101Query } from '../../../../estados/queries/270101/tramite270101.query';
import { of } from 'rxjs';

describe('LugarDeDestinoComponent', () => {
  let component: LugarDeDestinoComponent;
  let fixture: ComponentFixture<LugarDeDestinoComponent>;
  let exportarIlustracionesService: ExportarIlustracionesService;
  let tramite270101Store: Tramite270101Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LugarDeDestinoComponent, HttpClientModule],
      providers: [ExportarIlustracionesService,
        {
          provide: Tramite270101Store,
          useValue: { setDynamicFieldValue: jest.fn() }
        },
        {
          provide: Tramite270101Query,
          useValue: {
            selectExportarIlustraciones$: of({})
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LugarDeDestinoComponent);
    component = fixture.componentInstance;
    exportarIlustracionesService = TestBed.inject(ExportarIlustracionesService);
    tramite270101Store = TestBed.inject(Tramite270101Store);
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate lugarDeDestinoData and update form options on init', () => {
    const mockData = [
      { id: 1, descripcion: 'México' },
      { id: 2, descripcion: 'Argentina' }
    ];
    const getPaisDataSpy = jest
      .spyOn(exportarIlustracionesService, 'getPaisData')
      .mockReturnValue(of(mockData));
    component.lugarDeDestinoFormData = [
      { campo: 'pais', opciones: [] } as any
    ];
    component.ngOnInit();
    expect(getPaisDataSpy).toHaveBeenCalled();
    expect(component.lugarDeDestinoData).toEqual(mockData);
  });

  it('should not fail if no campo "pais" exists in lugarDeDestinoFormData', () => {
    const mockData = [{ id: 1, descripcion: 'Perú' }];
    jest
      .spyOn(exportarIlustracionesService, 'getPaisData')
      .mockReturnValue(of(mockData));
    component.lugarDeDestinoFormData = [
      { campo: 'ciudad' } as any
    ];
    expect(() => component.ngOnInit()).not.toThrow();
  });
  
  it('should call setDynamicFieldValue with the correct values when event is provided', () => {
    const mockEvent = { campo: 'sede', valor: 'sede' };
    const setDynamicFieldValueSpy = jest.spyOn(tramite270101Store, 'setDynamicFieldValue');
    const setFormSpy = jest.spyOn(exportarIlustracionesService, 'setForm');
    component.establecerCambioDeValor(mockEvent);
    expect(setDynamicFieldValueSpy).toHaveBeenCalledWith('sede', 'sede');
    expect(setFormSpy).toHaveBeenCalledWith('lugar', component.ninoFormGroup);
  });

  it('should do nothing if event is null or undefined', () => {
    const setDynamicFieldValueSpy = jest.spyOn(tramite270101Store, 'setDynamicFieldValue');
    const setFormSpy = jest.spyOn(exportarIlustracionesService, 'setForm');
    component.establecerCambioDeValor(null as any);
    expect(setDynamicFieldValueSpy).not.toHaveBeenCalled();
    expect(setFormSpy).not.toHaveBeenCalled();
    component.establecerCambioDeValor(undefined as any);
    expect(setDynamicFieldValueSpy).not.toHaveBeenCalled();
    expect(setFormSpy).not.toHaveBeenCalled();
  });

  it('should call setForm with "lugar" and ninoFormGroup', () => {
    const mockEvent = { campo: 'ciudad', valor: 'CIUDAD' };
    const setDynamicFieldValueSpy = jest.spyOn(tramite270101Store, 'setDynamicFieldValue');
    const setFormSpy = jest.spyOn(exportarIlustracionesService, 'setForm');
    component.establecerCambioDeValor(mockEvent);
    expect(setFormSpy).toHaveBeenCalledWith('lugar', component.ninoFormGroup);
  });
  
  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.ngOnDestroy();
  });

  it('should complete destroy$ on destroy', () => {
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
