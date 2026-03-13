import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { IvaeiepsComponent } from './ivaeieps.component';
import { RegistrosDeComercioExteriorService } from '../../services/registros-de-comercio-exterior.service';
import { Tramite31603IvaeiepsStore } from '../../estados/stores/tramite31603ivaeieps.store';
import { Tramite31603IvaeiepsQuery } from '../../estados/queries/tramite31603ivaeieps.query';

describe('IvaeiepsComponent', () => {
  let component: IvaeiepsComponent;
  let fixture: ComponentFixture<IvaeiepsComponent>;
  let comercioExteriorSvcMock: any;
  let tramite31603QueryMock: any;
  let bsModalServiceMock: { show: jest.Mock };

  beforeEach(async () => {
    comercioExteriorSvcMock = {
      getEmpresasTablaDatos: jest.fn().mockReturnValue(of([])),
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [] })),
      getInversionTablaDatos: jest.fn().mockReturnValue(of([])),
      getTipoInversionDatos: jest.fn().mockReturnValue(of({ data: [] })),
    };

    tramite31603QueryMock = {
      selectSolicitud$: of({
        indiqueIva: 'test',
        empleados: 10,
        infraestructura: 'test',
        monto: 1000,
        antiguedad: 5,
      }),
    };

    bsModalServiceMock = { show: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IvaeiepsComponent],
      providers: [
        { provide: RegistrosDeComercioExteriorService, useValue: comercioExteriorSvcMock },
        { provide: Tramite31603IvaeiepsQuery, useValue: tramite31603QueryMock },
        { provide: BsModalService, useValue: bsModalServiceMock },
        { provide: Tramite31603IvaeiepsStore, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IvaeiepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ivaEiepsFormGroup with default values', () => {
    expect(component.ivaEiepsFormGroup.value).toEqual({
      indiqueIva: 'test',
      empleados: 10,
      infraestructura: 'test',
      monto: 1000,
      antiguedad: 5,
    });
  });

  it('should call getEmpresasDelGrupoDatos and set empresasDelGrupoDatos', () => {
    comercioExteriorSvcMock.getEmpresasTablaDatos.mockReturnValue(of([{ id: 1, name: 'Empresa 1' }]));
    component.getEmpresasDelGrupoDatos();
    expect(comercioExteriorSvcMock.getEmpresasTablaDatos).toHaveBeenCalled();
    expect(component.empresasDelGrupoDatos).toEqual([{ id: 1, name: 'Empresa 1' }]);
  });

  it('should update predeterminadoSeleccionar when cambioDeValorIndique is called', () => {
    component.cambioDeValorIndique('newValue');
    expect(component.predeterminadoSeleccionar).toBe('newValue');
  });

  it('should initialize ivaForm with default values and validators', () => {
    const rfcControl = component.ivaForm.get('rfc');
    expect(rfcControl?.valid).toBeFalsy();
    rfcControl?.setValue('ABC123456789');
    expect(rfcControl?.valid).toBeTruthy();
  });

  it('should complete destroyNotifier$ on component destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should mark rfc as touched if empty', () => {
    component.ivaForm.get('rfc')?.setValue('');
    const markSpy = jest.spyOn(component.ivaForm.get('rfc')!, 'markAsTouched');
    component.buscarRFC();
    expect(markSpy).toHaveBeenCalled();
  });

  it('should not patch denominacion and domicilio if rfc invalid', () => {
    component.ivaForm.get('rfc')?.setValue('INVALID');
    component.buscarRFC();
    expect(component.ivaForm.get('denominacion')?.value).toBe('');
  });

  it('should patch denominacion and domicilio if rfc is valid', () => {
    component.ivaForm.get('rfc')?.setValue('ABC1234561Z1');
    component.buscarRFC();
    expect(component.ivaForm.get('denominacion')?.value).toContain('INTEGRADORA');
    expect(component.ivaForm.get('domicilio')?.value).toContain('CAMINO VIEJO');
  });

  it('should not add empresa if form is invalid', () => {
      component.ivaForm.get('rfc')?.setValue('');
      component.aceptar();
      expect(component.empresasDelGrupoDatos.length).toBe(0);
    });

    it('should add empresa if form is valid', () => {
      component.ivaForm.get('rfc')?.setValue('ABC1234561Z1');
      component.ivaForm.patchValue({
        denominacion: 'Empresa X',
        domicilio: 'Direccion Y'
      });
      component.aceptar();
      expect(component.empresasDelGrupoDatos.length).toBe(1);
      expect(component.empresasDelGrupoDatos[0].rfc).toBe('ABC1234561Z1');
    });
});
