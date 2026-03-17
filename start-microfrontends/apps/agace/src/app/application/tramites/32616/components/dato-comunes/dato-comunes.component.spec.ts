import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatoComunesComponent } from './dato-comunes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('DatoComunesComponent', () => {
  let component: DatoComunesComponent;
  let fixture: ComponentFixture<DatoComunesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        DatoComunesComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatoComunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    component.ngOnInit();
    expect(component.datosComunesForma).toBeDefined();
    expect(component.tablaModalForma).toBeDefined();
    expect(component.tablaDosModalForma).toBeDefined();
    expect(component.miembroDeLaEmpresa).toBeDefined();
  });

  it('should open and close confirm modal', () => {
    const confirmModalSpy = jest.spyOn(component, 'openConfirmModal');
    const closeConfirmModalSpy = jest.spyOn(component, 'closeConfirmModal');

    component.openConfirmModal();
    expect(confirmModalSpy).toHaveBeenCalled();

    component.closeConfirmModal();
    expect(closeConfirmModalSpy).toHaveBeenCalled();
  });

  it('should call obtenerTablaDatos on initialization', () => {
    const obtenerTablaDatosSpy = jest.spyOn(component, 'obtenerTablaDatos');
    component.ngOnInit();
    expect(obtenerTablaDatosSpy).toHaveBeenCalled();
  });

  it('should call obtenerInstalacionesPrincipalesTablaDatos on initialization', () => {
    const obtenerInstalacionesSpy = jest.spyOn(component, 'obtenerInstalacionesPrincipalesTablaDatos');
    component.ngOnInit();
    expect(obtenerInstalacionesSpy).toHaveBeenCalled();
  });

  it('should destroy observables on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should toggle "changed" property on enCambioDeValor', () => {
    const initialChangedValue = component.changed;
    component.enCambioDeValor();
    expect(component.changed).toBe(!initialChangedValue);
  });
  it('should call tablaInstance.show() when tablaInstance exists', () => {
    const showMock = jest.fn();
    component['tablaInstance'] = { 
      show: showMock, 
      toggle: jest.fn(), 
      hide: jest.fn(), 
      handleUpdate: jest.fn(), 
      dispose: jest.fn() 
    };
  
    component.openTablaModal();
  
    expect(showMock).toHaveBeenCalled();
  });
  it('should call tablaInstance.hide() when tablaInstance exists', () => {
    const hideMock = jest.fn();
    component['tablaInstance'] = { 
      show: jest.fn(), 
      toggle: jest.fn(), 
      hide: hideMock, 
      handleUpdate: jest.fn(), 
      dispose: jest.fn() 
    };
  
    component.closeTablaModal();
  
    expect(hideMock).toHaveBeenCalled();
  });

  it('should call miembroDeLaEmpresaInstance.show() when it exists', () => {
    const showMock = jest.fn();
    component['miembroDeLaEmpresaInstance'] = { 
      show: showMock, 
      toggle: jest.fn(), 
      hide: jest.fn(), 
      handleUpdate: jest.fn(), 
      dispose: jest.fn() 
    };
  
    component.openMiembroDeLaEmpresaModal();
  
    expect(showMock).toHaveBeenCalled();
  });
  it('should call miembroDeLaEmpresaInstance.hide() when it exists', () => {
    const hideMock = jest.fn();
    component['miembroDeLaEmpresaInstance'] = { 
      show: jest.fn(), 
      toggle: jest.fn(), 
      hide: hideMock, 
      handleUpdate: jest.fn(), 
      dispose: jest.fn() 
    };
  
    component.closeMiembroDeLaEmpresaModal();
  
    expect(hideMock).toHaveBeenCalled();
  });
  it('should call obtenerTablaDatos() and closeTablaModal()', () => {
    const obtenerTablaDatosSpy = jest.spyOn(component, 'obtenerTablaDatos').mockImplementation(() => {});
    const closeTablaModalSpy = jest.spyOn(component, 'closeTablaModal').mockImplementation(() => {});
  
    component.crearTablaDatos();
  
    expect(obtenerTablaDatosSpy).toHaveBeenCalled();
    expect(closeTablaModalSpy).toHaveBeenCalled();
  });
  it('should call obtenerInstalacionesPrincipalesTablaDatos() and closeTablaDosModal()', () => {
    const obtenerSpy = jest.spyOn(component, 'obtenerInstalacionesPrincipalesTablaDatos').mockImplementation(() => {});
    const closeSpy = jest.spyOn(component, 'closeTablaDosModal').mockImplementation(() => {});
  
    component.crearTablaDosDatos();
  
    expect(obtenerSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });
  it('should call instalacionesPrincipalesTablaInstance.show() when it exists', () => {
    const showMock = jest.fn();
    component['instalacionesPrincipalesTablaInstance'] = { 
      show: showMock, 
      toggle: jest.fn(), 
      hide: jest.fn(), 
      handleUpdate: jest.fn(), 
      dispose: jest.fn() 
    };
  
    component.openTablaDosModal();
  
    expect(showMock).toHaveBeenCalled();
  });
  it('should call instalacionesPrincipalesTablaInstance.hide() when it exists', () => {
    const hideMock = jest.fn();
    component['instalacionesPrincipalesTablaInstance'] = { 
      show: jest.fn(), 
      toggle: jest.fn(), 
      hide: hideMock, 
      handleUpdate: jest.fn(), 
      dispose: jest.fn() 
    };
  
    component.closeTablaDosModal();
  
    expect(hideMock).toHaveBeenCalled();
  });
});
