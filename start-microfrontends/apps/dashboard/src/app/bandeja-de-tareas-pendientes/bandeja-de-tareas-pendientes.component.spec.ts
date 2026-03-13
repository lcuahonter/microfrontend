import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BandejaDeTareasPendientesComponent } from './bandeja-de-tareas-pendientes.component';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LibBandejaComponent, MenuFuncionarioComponent, BANDEJA_DE_TAREAS_PENDIENTES_FORMA, esValidArray } from '@libs/shared/data-access-user/src';
import { BandejaDeSolicitudeService } from '../services/bandeja-de-solicitude.service';
import { ConsultaioStore, ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { LoginQuery, TareaStore } from '@ng-mf/data-access-user';
import tramiteDetailsData from '@libs/shared/theme/assets/json/tramiteList.json';

describe('BandejaDeTareasPendientesComponent', () => {
  let component: BandejaDeTareasPendientesComponent;
  let fixture: ComponentFixture<BandejaDeTareasPendientesComponent>;
  let mockBandejaSvc: any;
  let mockConsultaStore: any;
  let mockLoginQuery: any;
  let mockTareaStore: any;

  beforeEach(async () => {
    mockBandejaSvc = {
      getTareasPendientesTablaDatos: jasmine.createSpy().and.returnValue(of([{ id: 1 }])),
      getDepartamento: jasmine.createSpy().and.returnValue(of({ data: [{ ID_DEPENDENCIA: 1, ACRONIMO: 'DEP', NOMBRE: 'Departamento' }] })),
      getSolicitudesTablaDatos: jasmine.createSpy().and.returnValue(of({ data: [{ id: 1, descripcion: 'Tipo1' }] })),
      postBandejaTareas: jasmine.createSpy().and.returnValue(of([{ rfc: 'RFC', currentUser: 'user', folioTramite: 'folio', idSolicitud: 1, idTarea: 2, roleTarea: 'role', tareasUsuario: [] }]))
    };
    mockConsultaStore = {};
    mockLoginQuery = {
      selectLoginState$: of({ rfc: 'RFC123' })
    };
    mockTareaStore = {
      establecerTarea: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, LibBandejaComponent, MenuFuncionarioComponent],
      declarations: [BandejaDeTareasPendientesComponent],
      providers: [
        { provide: BandejaDeSolicitudeService, useValue: mockBandejaSvc },
        { provide: ConsultaioStore, useValue: mockConsultaStore },
        { provide: LoginQuery, useValue: mockLoginQuery },
        { provide: TareaStore, useValue: mockTareaStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BandejaDeTareasPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set rfcValor on ngOnInit', () => {
    expect(component.rfcValor).toBe('RFC123');
  });

  it('should call getNombreDelDepartamento, obtieneTipoSolicitudes, obtieneTareas on ngOnInit', () => {
    spyOn(component, 'getNombreDelDepartamento');
    spyOn(component, 'obtieneTipoSolicitudes');
    spyOn(component, 'obtieneTareas');
    component.ngOnInit();
    expect(component.getNombreDelDepartamento).toHaveBeenCalled();
    expect(component.obtieneTipoSolicitudes).toHaveBeenCalled();
    expect(component.obtieneTareas).toHaveBeenCalled();
  });

  it('should update banderafuncionariorecive on recibirCambioFuncionario', () => {
    component.recibirCambioFuncionario(true);
    expect(component.banderafuncionariorecive).toBe(true);
    component.recibirCambioFuncionario(false);
    expect(component.banderafuncionariorecive).toBe(false);
  });

  it('should get table data and copy it', () => {
    component.getBandejaDeTablaDatos();
    expect(component.dePendientesTablaDatos.length).toBe(1);
    expect(component.copiarDatos.length).toBe(1);
  });

  it('should get and set departamento data and update form options', () => {
    component.bandejaDeTareasForma = [
      {
        id: 'departamento',
        labelNombre: '',
        campo: '',
        clase: '',
        tipoInput: '',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: ''
      }
    ];
    component.getNombreDelDepartamento();
    expect(component.departamentoDatos.length).toBe(1);
  });

  it('should handle departamento event and call getProcedimiento', () => {
    component.departamentoDatos = [{ ID_DEPENDENCIA: 1, ACRONIMO: 'dep', NOMBRE: 'Departamento' } as any];
    spyOn(component, 'getProcedimiento');
    component.departamento({ campo: 'departamento', valor: '1' });
    expect(component.selectedDepartamentoObj.tieneDepartamento).toBe(true);
    expect(component.getProcedimiento).toHaveBeenCalledWith('dep');
  });

  it('should handle procedimiento event', () => {
    component.procedureNumero = [{ id: 2, tramite: 123 } as any];
    component.departamento({ campo: 'procedimiento', valor: '2' });
    expect(component.selectedDepartamentoObj.numeroDeProcedimiento).toBe('123');
  });

  it('should reset selectedDepartamentoObj on unknown event', () => {
    component.selectedDepartamentoObj.tieneDepartamento = true;
    component.departamento({ campo: 'other', valor: '' });
    expect(component.selectedDepartamentoObj.tieneDepartamento).toBe(false);
  });

  it('should call establecerTarea if esValidArray returns true', () => {
    spyOn(window as any, 'esValidArray').and.returnValue(true);
    component.rfcValor = 'RFC';
    component.obtieneTareas();
    expect(mockTareaStore.establecerTarea).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = spyOn(component['destroyNotifier$'], 'next').and.callThrough();
    const spy2 = spyOn(component['destroyNotifier$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});