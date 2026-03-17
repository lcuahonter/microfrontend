import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';
import { of, Subject } from 'rxjs';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let consultaQueryMock: any;
  let tercerosServiceMock: any;
  let tramiteQueryMock: any;
  let tramiteStoreMock: any;

  beforeEach(async () => {
    consultaQueryMock = {
      selectConsultaioState$: of({ readonly: true, update: false })
    };
    tercerosServiceMock = {
      getAvisoDatos: jest.fn().mockReturnValue(of({ selectedCheckbox: ['a', 'b'] })),
      setDatosFormulario: jest.fn()
    };
    tramiteQueryMock = {
      selectSolicitud$: of({ selectedCheckbox: ['a', 'b'] })
    };
    tramiteStoreMock = {
      setCheckboxDatos: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SolicitanteComponent,HttpClientTestingModule],
      declarations: [PasoUnoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: TercerosRelacionadosService, useValue: tercerosServiceMock },
        { provide: Solicitud30505Query, useValue: tramiteQueryMock },
        { provide: Solicitud30505Store, useValue: tramiteStoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set consultaState, esFormularioSoloLectura, esDatosRespuesta and call initializerFormulario on ngOnInit when update is false', () => {
    const initSpy = jest.spyOn(component, 'initializerFormulario');
    component.ngOnInit();
    expect(component['consultaState']).toBeDefined();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.esDatosRespuesta).toBe(true);
    expect(initSpy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario on ngOnInit when update is true', () => {
    consultaQueryMock.selectConsultaioState$ = of({ readonly: false, update: true });
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    fixture.detectChanges();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should set avisoState and selectedCheckboxes in initializerFormulario', () => {
    component.initializerFormulario();
    expect(component['avisoState']).toBeDefined();
    expect(component.selectedCheckboxes).toEqual(['a', 'b']);
  });

  it('should call setCheckboxDatos, set esDatosRespuesta, call initializerFormulario and setDatosFormulario in guardarDatosFormulario', () => {
    const initSpy = jest.spyOn(component, 'initializerFormulario');
    component.guardarDatosFormulario();
    expect(tercerosServiceMock.getAvisoDatos).toHaveBeenCalled();
    expect(tramiteStoreMock.setCheckboxDatos).toHaveBeenCalledWith(['a', 'b']);
    expect(component.esDatosRespuesta).toBe(true);
    expect(initSpy).toHaveBeenCalled();
    expect(tercerosServiceMock.setDatosFormulario).toHaveBeenCalled();
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should set selectedCheckboxes when toggleDataVisibility is called', () => {
    component.toggleDataVisibility(['x', 'y']);
    expect(component.selectedCheckboxes).toEqual(['x', 'y']);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
