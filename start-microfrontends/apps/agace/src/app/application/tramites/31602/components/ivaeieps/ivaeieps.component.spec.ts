import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IvaeiepsComponent } from './ivaeieps.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { Solicitud31602IvaeiepsState, Tramite31602IvaeiepsStore } from '../../estados/stores/tramite31602ivaeieps.store';
import { Tramite31602IvaeiepsQuery } from '../../estados/queries/tramite31602ivaeieps.query';

describe('IvaeiepsComponent', () => {
  let component: IvaeiepsComponent;
  let fixture: ComponentFixture<IvaeiepsComponent>;
  let comercioExteriorServiceMock: Partial<ComercioExteriorService>;
  let tramiteStoreMock: Partial<Tramite31602IvaeiepsStore>;
  let tramiteQueryMock: Partial<Tramite31602IvaeiepsQuery>;

  beforeEach(async () => {
  comercioExteriorServiceMock = {
  getEmpresasTablaDatos: jest.fn().mockReturnValue(of([])),
  getBancoDatos: jest.fn().mockReturnValue(of({ data: [] })),
  getInversionTablaDatos: jest.fn().mockReturnValue(of([])),
  getTipoInversionDatos: jest.fn().mockReturnValue(of({ data: [] })),
};

    tramiteStoreMock = {
      setIndiqueIva: jest.fn(),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        indiqueIva: '',
        empleados: '',
        infraestructura: '',
        monto: '',
        antiguedad: '',
        indiqueCheck: false,
        resigtro: '',
        telefono: '',
        correo: '',
        manifieste: '',
        tipoDe: '',
        valorPesos: 0,
        descripcion: ''
      } as unknown as Solicitud31602IvaeiepsState),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IvaeiepsComponent],
      providers: [
        { provide: ComercioExteriorService, useValue: comercioExteriorServiceMock },
        { provide: Tramite31602IvaeiepsStore, useValue: tramiteStoreMock },
        { provide: Tramite31602IvaeiepsQuery, useValue: tramiteQueryMock },
        BsModalService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IvaeiepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ivaEiepsFormGroup on init', () => {
    expect(component.ivaEiepsFormGroup).toBeDefined();
    expect(component.ivaEiepsFormGroup.controls['indiqueIva']).toBeDefined();
  });

  it('should call getEmpresasDelGrupoDatos on init', () => {
    const spy = jest.spyOn(component, 'getEmpresasDelGrupoDatos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call comercioExteriorSvc.getEmpresasTablaDatos when getEmpresasDelGrupoDatos is called', () => {
    component.getEmpresasDelGrupoDatos();
    expect(comercioExteriorServiceMock.getEmpresasTablaDatos).toHaveBeenCalled();
  });

  it('should update predeterminadoSeleccionar when cambioDeValorIndique is called', () => {
    component.cambioDeValorIndique('testValue');
    expect(component.predeterminadoSeleccionar).toBe('testValue');
  });

  it('should call setValoresStore with correct arguments', () => {
    const form = component.ivaEiepsFormGroup;
    const spy = jest.spyOn(tramiteStoreMock, 'setIndiqueIva' as any);
    component.setValoresStore(form, 'indiqueIva', 'setIndiqueIva');
    expect(spy).toHaveBeenCalledWith(form.get('indiqueIva')?.value);
  });

  it('should emit destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
