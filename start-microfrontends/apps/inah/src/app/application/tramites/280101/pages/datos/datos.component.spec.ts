import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let consultaQueryMock: any;
  let permisoServiceMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ readonly: true, update: false })
    };
    permisoServiceMock = {
      indice: undefined,
      getPermisoExportacion: jest.fn().mockReturnValue(of({})),
      setDatosFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: PermisoDeExportacionService, useValue: permisoServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set consultaState, esFormularioSoloLectura, esDatosRespuesta on ngOnInit when update is false', () => {
    component.ngOnInit();
    expect(component['consultaState']).toBeDefined();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario on ngOnInit when update is true', () => {
    consultaQueryMock.selectConsultaioState$ = of({ readonly: false, update: true });
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    fixture.detectChanges(); // Trigger ngOnInit
    expect(component.esFormularioSoloLectura).toBe(false);
    component.ngOnInit();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should call setDatosFormulario and set esDatosRespuesta in guardarDatosFormulario', () => {
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(permisoServiceMock.getPermisoExportacion).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(permisoServiceMock.setDatosFormulario).toHaveBeenCalled();
  });

  it('should set indice and permisoService.indice in seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
    expect(permisoServiceMock.indice).toBe(3);
  });

  it('should return true for tabIndex 5 or 6 in isTabDisabled', () => {
    expect(component.isTabDisabled(5)).toBe(true);
    expect(component.isTabDisabled(6)).toBe(true);
    expect(component.isTabDisabled(4)).toBe(false);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});