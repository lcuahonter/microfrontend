import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleDelPermisoComponent } from './detalle-del-permiso.component';
import { of } from 'rxjs';
import { BusquedaPermisos140216State } from '../../estados/tramites/tramite140216.store';
import { HttpClientModule } from '@angular/common/http';

describe('DetalleDelPermisoComponent', () => {
  let component: DetalleDelPermisoComponent;
  let fixture: ComponentFixture<DetalleDelPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleDelPermisoComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleDelPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component initialization', () => {
    component.crearDetallePermisoForm();
    expect(component.detallePermisoForm).toBeDefined();
    expect(component.detallePermisoForm.controls['folio']).toBeDefined();
    expect(component.detallePermisoForm.controls['tipoSolicitud']).toBeDefined();
    expect(component.detallePermisoForm.controls['regimen']).toBeDefined();
  });

  it('should populate the form with data from obtenerDetallePermiso', () => {
    const permisosMock = {
      code: 200,
      data: [
        {
          numeroResolucion: '123',
          tipoSolicitud: 'Solicitud 1',
          regimen: 'Regimen 1',
          clasificacionRegimen: 'Clasificacion 1',
          periodoDeVigencia: '2023',
          unidad: 'Unidad 1',
          cantidadAutorizada: '100',
          valorAutorizado: '200',
          saldo: '50',
          fraccionArancelaria: '1234',
          nico: 'Nico 1',
          nicoDescripcion: 'Descripcion Nico',
          acotacion: 'Acotacion 1',
          descripcionMercancia: 'Mercancia 1',
          paisProcedencia: 'Pais 1',
          fechaInicioVigencia: '2025-01-01',
          fechaFinVigencia: '2025-12-31'
        },
      ],
      message: 'Success'
    };

    jest.spyOn(component['suspensionPermisoService'], 'obtenerPermisosVigentes').mockReturnValue(of(permisosMock));

    component.obtenerDetallePermiso();

    expect(component.detallePermisoForm.value.folio).toBe('123');
    expect(component.detallePermisoForm.value.tipoSolicitud).toBe('Solicitud 1');
    expect(component.detallePermisoForm.value.regimen).toBe('Regimen 1');
  });

  it('should call setValoresStore and update store value', () => {
    const setFolioSpy = jest.spyOn(component['tramite140216Store'], 'setFolioTramiteBusqueda');
    component.detallePermisoForm.patchValue({ folio: 'test-value' });

    component.setValoresStore(component.detallePermisoForm, 'folio', 'setFolioTramiteBusqueda');

    expect(setFolioSpy).toHaveBeenCalledWith('test-value');
  });

  it('should complete destruirNotificador$ on ngOnDestroy', () => {
    const destruirNotificadorSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(destruirNotificadorSpy).toHaveBeenCalled();
  });
});