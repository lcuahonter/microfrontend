import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentacionFederalComponent } from './representacion-federal.component';
import { Tramite120101Query } from '../../../../estados/queries/tramite120101.query';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { Tramite120101Store } from '../../../../estados/tramites/tramite120101.store';
import { ServicioDeFormularioService } from '../../services/forma-servicio/servicio-de-formulario.service';
import { of } from 'rxjs';

describe('RepresentacionFederalComponent', () => {
  let component: RepresentacionFederalComponent;
  let fixture: ComponentFixture<RepresentacionFederalComponent>;
  let tramiteQueryMock: any;
  let solicitudServiceMock: any;
  let formServiceMock: any;
  let storeMock: any;

  beforeEach(async () => {
    tramiteQueryMock = {
      selectSolicitudDeRegistroTpl$: of({ dummy: true }),
    };
    solicitudServiceMock = {
      getEstadosDatos: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Estado A' }])),
      getRepresentacionFederalDatos: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Fed A' }])),
    };
    formServiceMock = {
      registerForm: jest.fn(),
      setFormValue: jest.fn(),
    };
    storeMock = {
      setDynamicFieldValue: jest.fn(),
    };
    
    await TestBed.configureTestingModule({
      imports: [RepresentacionFederalComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite120101Query, useValue: tramiteQueryMock },
        { provide: SolicitudDeRegistroTplService, useValue: solicitudServiceMock },
        { provide: Tramite120101Store, useValue: storeMock },
        { provide: ServicioDeFormularioService, useValue: formServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentacionFederalComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update store and form value on change', () => {
    const mockEvent = { campo: 'estado', valor: 'NuevoValor' };
    component.establecerCambioDeValor(mockEvent);
    expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('estado', 'NuevoValor');
    expect(formServiceMock.setFormValue).toHaveBeenCalledWith('representacionFederal', {
      estado: 'NuevoValor',
    });
  });

  it('should complete destroy$ on destroy', () => {
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});