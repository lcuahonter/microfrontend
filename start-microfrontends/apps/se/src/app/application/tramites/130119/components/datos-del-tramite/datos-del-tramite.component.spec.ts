import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { ID_PROCEDIMIENTO } from '../../constants/aviso-importacion-maquinas.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let mockService: jest.Mocked<DatosDeLaSolicitudService>;
  let mockStore: jest.Mocked<Tramite130119Store>;
  let mockQuery: jest.Mocked<Tramite130119Query>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;

  const mockRegimenData: Catalogo[] = [
    { id: 1, descripcion: 'Régimen 1', clave:"1" },
    { id: 2, descripcion: 'Régimen 2', clave:"2" }
  ];

  const mockClasificacionData: Catalogo[] = [
    { id: 1, descripcion: 'Clasificación 1', clave:"1"},
    { id: 2, descripcion: 'Clasificación 2', clave:"2" }
  ];

  const mockConsultaState: ConsultaioState = {
    readonly: false
  } as any;

  beforeEach(async () => {
    const serviceMock = {
      getRegimen: jest.fn(()=> of()),
      getClasificacionDeRegimen: jest.fn(()=> of())
    } as any;

    const storeMock = {
      establecerDatos: jest.fn(()=> of())
    } as any;

    const queryMock = {
      selectTramite130119$: of({ regimen: '1', clasificacionDeRegimen: '1' })
    } as jest.Mocked<Tramite130119Query>;

    const consultaQueryMock = {
      selectConsultaioState$: of(mockConsultaState)
    } as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [DatosDelTramiteComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: DatosDeLaSolicitudService, useValue: serviceMock },
        { provide: Tramite130119Store, useValue: storeMock },
        { provide: Tramite130119Query, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock }
      ]
    }).compileComponents();

    mockService = TestBed.inject(DatosDeLaSolicitudService) as jest.Mocked<DatosDeLaSolicitudService>;
    mockStore = TestBed.inject(Tramite130119Store) as jest.Mocked<Tramite130119Store>;
    mockQuery = TestBed.inject(Tramite130119Query) as jest.Mocked<Tramite130119Query>;
    mockConsultaQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;

    mockService.getRegimen.mockReturnValue(of(mockRegimenData));
    mockService.getClasificacionDeRegimen.mockReturnValue(of(mockClasificacionData));

    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    fixture.detectChanges();
    expect(component.datosDelTramiteForm).toBeDefined();
    expect(component.datosDelTramiteForm.get('regimen')).toBeTruthy();
    expect(component.datosDelTramiteForm.get('clasificacionDeRegimen')).toBeTruthy();
  });

  it('should set idProcedimiento to ID_PROCEDIMIENTO', () => {
    expect(component.idProcedimiento).toBe(ID_PROCEDIMIENTO);
  });

  it('should call getRegimen on ngOnInit', () => {
    fixture.detectChanges();
    expect(mockService.getRegimen).toHaveBeenCalledWith(ID_PROCEDIMIENTO.toString());
    expect(component.opcionesDeRegimen).toEqual(mockRegimenData);
  });

  it('should set esSoloLectura based on consultaQuery state', () => {
    fixture.detectChanges();
    expect(component.esSoloLectura).toBe(false);
  });

  it('should patch form values from store', () => {
    fixture.detectChanges();
    expect(component.datosDelTramiteForm.get('regimen')?.value).toBe('1');
    expect(component.datosDelTramiteForm.get('clasificacionDeRegimen')?.value).toBe('1');
  });

  it('should get clasificacion de regimen when regimen changes', () => {
    const regimenId = '2';
    component.getClasificacionDeRegimen(regimenId);
    expect(mockService.getClasificacionDeRegimen).toHaveBeenCalledWith(ID_PROCEDIMIENTO.toString(), regimenId);
  });

  it('should set valores in store and call getClasificacionDeRegimen when campo is regimen', () => {
    component.inicializarFormulario();
    component.datosDelTramiteForm.get('regimen')?.setValue('2');
    jest.spyOn(component, 'getClasificacionDeRegimen');
    
    component.setValoresStore(component.datosDelTramiteForm, 'regimen');
    
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ regimen: '2' });
    expect(component.getClasificacionDeRegimen).toHaveBeenCalledWith('2');
  });

  it('should set valores in store without calling getClasificacionDeRegimen when campo is not regimen', () => {
    component.inicializarFormulario();
    component.datosDelTramiteForm.get('clasificacionDeRegimen')?.setValue('1');
    jest.spyOn(component, 'getClasificacionDeRegimen');
    
    component.setValoresStore(component.datosDelTramiteForm, 'clasificacionDeRegimen');
    
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ clasificacionDeRegimen: '1' });
    expect(component.getClasificacionDeRegimen).not.toHaveBeenCalled();
  });

  it('should complete destroyed$ subject on ngOnDestroy', () => {
    jest.spyOn(component['destroyed$'], 'next');
    jest.spyOn(component['destroyed$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroyed$'].next).toHaveBeenCalled();
    expect(component['destroyed$'].complete).toHaveBeenCalled();
  });

  it('should unsubscribe on component destroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    
    fixture.destroy();
    
    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});