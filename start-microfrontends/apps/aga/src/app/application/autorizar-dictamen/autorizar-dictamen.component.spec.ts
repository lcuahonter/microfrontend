import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluarComponent } from './autorizar-dictamen.component';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

// Mocks para los servicios y dependencias
const routerMock = { navigate: jest.fn() };
const consultaioStoreMock = { establecerConsultaio: jest.fn(), solicitanteConsultaio: jest.fn() };
const consultaioQueryMock = { select: jest.fn(() => of({})) };
const solicitudRequerimientoQueryMock = { select: jest.fn(() => of({})) };
const evaluarSolicitudServiceMock = { getEvaluacionTramite: jest.fn(() => of({ codigo: '00', datos: {} })), opcionesEvaluacion: jest.fn(() => of({ codigo: '00', datos: [] })) };
const tabsSolicitudServiceTsServiceMock = {
    getTabs: jest.fn(() => of({ codigo: '00', datos: {} })),
    getDocumentosSolicitud: jest.fn(() => of({ codigo: '00', datos: [] })),
    getRequerimientos: jest.fn(() => of({ codigo: '00', datos: [] })),
    getDictamenes: jest.fn(() => of({ codigo: '00', datos: [] })),
    getTareasSolicitud: jest.fn(() => of({ codigo: '00', datos: [] })),
    getOpiniones: jest.fn(() => of({ codigo: '00', datos: [] })),
    getAcusesResolucion: jest.fn(() => of({ codigo: '00', datos: {} })),
    getEnvioDigital: jest.fn(() => of({ codigo: '00', datos: {} })),
};
const iniciarServiceMock = { iniciarDictamen: jest.fn(() => of({ codigo: '00', datos: {} })), iniciarRequerimiento: jest.fn(() => of({ codigo: '00', datos: {} })) };
const guardarServiceMock = { getSentidosDisponibles: jest.fn(() => of({ codigo: '00', datos: [] })), guardarDictamen: jest.fn(() => of({ codigo: '00', datos: {} })) };
const guardarRequerimientoServiceMock = {};
const firmarDictamenServiceMock = {};
const firmarRequermientoServiceMock = {};

describe('EvaluarComponent', () => {
    let component: EvaluarComponent;
    let fixture: ComponentFixture<EvaluarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EvaluarComponent, require('@angular/common/http').HttpClientModule],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: 'ConsultaioStore', useValue: consultaioStoreMock },
                { provide: 'ConsultaioQuery', useValue: consultaioQueryMock },
                { provide: 'SolicitudRequerimientoQuery', useValue: solicitudRequerimientoQueryMock },
                { provide: 'EvaluarSolicitudService', useValue: evaluarSolicitudServiceMock },
                { provide: 'TabsSolicitudServiceTsService', useValue: tabsSolicitudServiceTsServiceMock },
                { provide: 'IniciarService', useValue: iniciarServiceMock },
                { provide: 'GuardarDictamenService', useValue: guardarServiceMock },
                { provide: 'GuardarRequerimientoService', useValue: guardarRequerimientoServiceMock },
                { provide: 'FirmarDictamenService', useValue: firmarDictamenServiceMock },
                { provide: 'FirmarRequermientoService', useValue: firmarRequermientoServiceMock },
                provideHttpClient(),
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EvaluarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    

    it('should clean up on ngOnDestroy', () => {
        const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });
});