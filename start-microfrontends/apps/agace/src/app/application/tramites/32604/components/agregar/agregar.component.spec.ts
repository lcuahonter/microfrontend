

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Validators } from '@angular/forms';

import { AgregarComponent } from './agregar.component';

describe('AgregarComponent', () => {
  let component: AgregarComponent;
  let fixture: ComponentFixture<AgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.seccionState = { aduana: 'TestAduana' } as any;
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(component.form.get('aduana')).toBeDefined();
  });

  it('should call fetchEntidadList and set aduanaList.catalogos', () => {
    const mockCatalogos = [{ id: 1, nombre: 'Aduana1' }];
    jest.spyOn(component.empresasComercializadorasService, 'getEntidadList').mockReturnValue({
      pipe: () => ({ subscribe: (fn: any) => fn({ data: mockCatalogos }) })
    } as any);
    component.fetchEntidadList();
    expect(component.aduanaList.catalogos).toEqual(mockCatalogos);
  });

  it('should handle aduana selection change and load table data', () => {
  jest.spyOn(component, 'cargarDatosDeLaTabla');
    component.onAduanaSelectionChange({ id: 1, nombre: 'Aduana1' } as any);
    expect(component.cargarDatosDeLaTabla).toHaveBeenCalled();
    component.onAduanaSelectionChange(null as any);
    expect(component.datosTabla).toEqual([]);
    expect(component.aduanaSeleccionada).toBe(false);
  });

  it('should update datosTablaSeleccionados on table row selection', () => {
    const mockRows = [{ entidadFederativa: 'A', municipio: 'B', coloniaCalleNumero: 'C', codigoPostal: '12345' } as any];
    component.onTableRowSelected(mockRows);
    expect(component.datosTablaSeleccionados).toEqual(mockRows);
  });

  it('should verify duplicates correctly', () => {
    component.domiciliosExistentes = [{ entidadFederativa: 'A', municipioDelegacion: 'B', direccion: 'C', codigoPostal: '12345' } as any];
    const mockRows = [{ entidadFederativa: 'A', municipio: 'B', coloniaCalleNumero: 'C', codigoPostal: '12345' } as any];
    const result = component.verificarDuplicados(mockRows);
    expect(result.length).toBe(1);
  });

  it('should return true for tieneRegistrosDuplicados if duplicates exist', () => {
    component.datosTablaSeleccionados = [{ entidadFederativa: 'A', municipio: 'B', coloniaCalleNumero: 'C', codigoPostal: '12345' } as any];
    component.domiciliosExistentes = [{ entidadFederativa: 'A', municipioDelegacion: 'B', direccion: 'C', codigoPostal: '12345' } as any];
    expect(component.tieneRegistrosDuplicados()).toBe(true);
  });

  it('should emit datosSeleccionados and cerrarModalEvento on cerrarModal with valid data', () => {
    component.form = component.fb.group({ aduana: ['Test', Validators.required] });
    component.datosTablaSeleccionados = [{ entidadFederativa: 'A', municipio: 'B', coloniaCalleNumero: 'C', codigoPostal: '12345' } as any];
    component.domiciliosExistentes = [];
  jest.spyOn(component.datosSeleccionados, 'emit');
  jest.spyOn(component.cerrarModalEvento, 'emit');
    component.cerrarModal();
    expect(component.datosSeleccionados.emit).toHaveBeenCalled();
    expect(component.cerrarModalEvento.emit).toHaveBeenCalled();
  });

  it('should show error modal if no rows selected on cerrarModal', () => {
    component.form = component.fb.group({ aduana: ['Test', Validators.required] });
    component.datosTablaSeleccionados = [];
  component['mostrarModalError'] = jest.fn();
    component.cerrarModal();
    expect(component['mostrarModalError']).toHaveBeenCalledWith('Seleccione un registro.');
  });

  it('should mark form as touched if invalid on cerrarModal', () => {
    component.form = component.fb.group({ aduana: ['', Validators.required] });
    component.datosTablaSeleccionados = [{ entidadFederativa: 'A', municipio: 'B', coloniaCalleNumero: 'C', codigoPostal: '12345' } as any];
  jest.spyOn(component.form, 'markAllAsTouched');
    component.cerrarModal();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should show error modal if duplicates found on cerrarModal', () => {
    component.form = component.fb.group({ aduana: ['Test', Validators.required] });
    component.datosTablaSeleccionados = [{ entidadFederativa: 'A', municipio: 'B', coloniaCalleNumero: 'C', codigoPostal: '12345' } as any];
    component.domiciliosExistentes = [{ entidadFederativa: 'A', municipioDelegacion: 'B', direccion: 'C', codigoPostal: '12345' } as any];
  component['mostrarModalError'] = jest.fn();
    component.cerrarModal();
    expect(component['mostrarModalError']).toHaveBeenCalledWith('Los registros seleccionados ya han sido agregados anteriormente. Por favor, seleccione registros diferentes.');
  });

  it('should reset datosTablaSeleccionados on cancelarModal', () => {
    component.datosTablaSeleccionados = [{ entidadFederativa: 'A' } as any];
    component.cancelarModal();
    expect(component.datosTablaSeleccionados).toEqual([]);
  });

  it('should reset modal state on resetModalState', () => {
    component.datosTablaSeleccionados = [{ entidadFederativa: 'A' } as any];
    component.aduanaSeleccionada = true;
    component.datosTabla = [{ entidadFederativa: 'B' } as any];
    component.form = component.fb.group({ aduana: ['Test'] });
    component.resetModalState();
    expect(component.datosTablaSeleccionados).toEqual([]);
    expect(component.aduanaSeleccionada).toBe(false);
    expect(component.datosTabla).toEqual([]);
    expect(component.form.pristine).toBe(true);
  });
});
