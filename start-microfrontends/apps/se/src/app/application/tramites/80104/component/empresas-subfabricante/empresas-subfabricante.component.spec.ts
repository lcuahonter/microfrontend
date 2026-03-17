import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresasSubfabricanteComponent } from './empresas-subfabricante.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { NuevoProgramaIndustrialService } from '../../services/modalidad-albergue.service';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';

describe('EmpresasSubfabricanteComponent', () => {
  let component: EmpresasSubfabricanteComponent;
  let fixture: ComponentFixture<EmpresasSubfabricanteComponent>;
  let mockQuery: Partial<Tramite80101Query>;
  let mockStore: Partial<Tramite80101Store>;
  let mockService: Partial<NuevoProgramaIndustrialService>;

  beforeEach(async () => {
    mockQuery = {
      datosSubcontratistaEstado$: of({ rfc: 'ABC123', estado: '1' }),
      plantasBuscadas$: of([]),
      plantasSubfabricantesAgregar$: of([])
    };

    mockStore = {
      setFormValida: jest.fn(),
      setDatosSubcontratista: jest.fn(),
      setPlantasBuscadas: jest.fn(),
      setPlantasSubfabricantesAgregar: jest.fn(),
      eliminarPlantas: jest.fn(),
      setPlantasPorCompletar: jest.fn(),
      setindicePrevioRuta: jest.fn()
    };

    mockService = {
      obtenerListaEstado: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Estado 1' }] })),
      getSubfabricantesDisponibles: jest.fn().mockReturnValue(of([]))
    };
    
    await TestBed.configureTestingModule({
      imports: [EmpresasSubfabricanteComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite80101Query, useValue: mockQuery },
        { provide: Tramite80101Store, useValue: mockStore },
        { provide: NuevoProgramaIndustrialService, useValue: mockService },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresasSubfabricanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con los campos rfc y estado', () => {
    expect(component.formularioDatosSubcontratista.contains('rfc')).toBeTruthy();
    expect(component.formularioDatosSubcontratista.contains('estado')).toBeTruthy();
  });

  it('debería llamar a obtenerDatosDelAlmacen y obtenerListaEstado en ngOnInit', () => {
    const obtenerDatosSpy = jest.spyOn(component, 'obtenerDatosDelAlmacen');
    const obtenerListaSpy = jest.spyOn(component, 'obtenerListaEstado');
    component.ngOnInit();
    expect(obtenerDatosSpy).toHaveBeenCalled();
    expect(obtenerListaSpy).toHaveBeenCalled();
  });

  it('debería llamar al servicio y actualizar el almacén al realizar la búsqueda', () => {
    component.formularioDatosSubcontratista.setValue({ rfc: 'ABC123', estado: '1' });
    component.realizarBusqueda();
    expect(mockService.getSubfabricantesDisponibles).toHaveBeenCalled();
  });

  it('debería almacenar plantas para agregar', () => {
    const spy = jest.spyOn(component['store'], 'setPlantasSubfabricantesAgregar');
    const mockPlantas = [{ calle: 'X', numExterior: 1, numInterior: 2, codigoPostal: 1111, colonia: 'Centro' }];
    component.agregarPlantas(mockPlantas as any);
    expect(spy).toHaveBeenCalledWith(mockPlantas);
  });

  it('debería llamar a eliminarPlantas en el store', () => {
    const spy = jest.spyOn(component['store'], 'eliminarPlantas');
    const plantas = [{ calle: 'X', numExterior: 1, numInterior: 2, codigoPostal: 1111, colonia: 'Centro' }];
    component.eliminarPlantas(plantas as any);
    expect(spy).toHaveBeenCalledWith(plantas);
  });

  it('debería establecer plantas por completar y navegar en complementarPlantas()', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    const setPlantasPorCompletarSpy = jest.spyOn(component['store'], 'setPlantasPorCompletar');
    const setIndicePrevioRutaSpy = jest.spyOn(component['store'], 'setindicePrevioRuta');

    const plantas = [{ calle: 'A', numExterior: 1, numInterior: 1, codigoPostal: 1234, colonia: 'Roma' }];
    component.tabIndex = 3;
    component.complementarPlantas(plantas as any);

    expect(setPlantasPorCompletarSpy).toHaveBeenCalledWith(plantas);
    expect(setIndicePrevioRutaSpy).toHaveBeenCalledWith(3);
    expect(navigateSpy).toHaveBeenCalled();
  });

   it('debería limpiar destroy$ en ngOnDestroy', () => {
    const destroy$Spy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(destroy$Spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
function done() {
  throw new Error('Function not implemented.');
}

