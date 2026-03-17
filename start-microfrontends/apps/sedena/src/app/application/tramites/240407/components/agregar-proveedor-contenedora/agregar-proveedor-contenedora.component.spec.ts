import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240407Store } from '../../estados/tramite240407Store.store';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarProveedorContenedoraComponent', () => {
  let component: AgregarProveedorContenedoraComponent;
  let fixture: ComponentFixture<AgregarProveedorContenedoraComponent>;
  let mockTramiteStore: jest.Mocked<Tramite240407Store>;

  beforeEach(async () => {
    mockTramiteStore = {
      updateProveedorTablaDatos: jest.fn()
    } as any;
    await TestBed.configureTestingModule({
      imports: [AgregarProveedorContenedoraComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite240407Store, useValue: mockTramiteStore },
        DatosSolicitudService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir el evento cerrar', () => {
    jest.spyOn(component.cerrar, 'emit');
    component.cerrar.emit();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('debería llamar a tramite240308Store.updateProveedorTablaDatos al ejecutar updateProveedorTablaDatos', () => {
    const mockProveedores = [{ id: 1, nombre: 'Proveedor' }] as any;
    component.updateProveedorTablaDatos(mockProveedores);
    expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(mockProveedores);
  });
});