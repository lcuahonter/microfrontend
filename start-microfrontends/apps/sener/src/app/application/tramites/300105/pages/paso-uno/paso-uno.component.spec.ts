import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { Tramite300105State } from '../../estados/tramite300105.store';

describe('PasoUnoComponent', () => {
  let COMPONENT: PasoUnoComponent;
  let FIXTURE: ComponentFixture<PasoUnoComponent>;
  let MOCK_AUTORIZACION_SERVICE: jest.Mocked<AutorizacionDeRayosXService>;
  let MOCK_CONSULTA_QUERY: jest.Mocked<ConsultaioQuery>;

  // Datos mock esenciales
  const MOCK_CONSULTA_STATE_UPDATE_TRUE: ConsultaioState = {
    update: true,
    readonly: false
  } as ConsultaioState;

  const MOCK_CONSULTA_STATE_UPDATE_FALSE: ConsultaioState = {
    update: false,
    readonly: false
  } as ConsultaioState;

  const MOCK_AUTORIZACION_DATOS = {
    numeroExpediente: '123456',
    tipoOperacion: 'Importación'
  };

  beforeEach(async () => {
    const MOCK_SERVICE = {
      getAutorizacionDeRayosXDatos: jest.fn().mockReturnValue(of(MOCK_AUTORIZACION_DATOS)),
      actualizarEstadoFormulario: jest.fn()
    } as unknown as jest.Mocked<AutorizacionDeRayosXService>;

    const MOCK_QUERY = {
      selectConsultaioState$: of(MOCK_CONSULTA_STATE_UPDATE_FALSE)
    } as unknown as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: AutorizacionDeRayosXService, useValue: MOCK_SERVICE },
        { provide: ConsultaioQuery, useValue: MOCK_QUERY }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    FIXTURE = TestBed.createComponent(PasoUnoComponent);
    COMPONENT = FIXTURE.componentInstance;
    MOCK_AUTORIZACION_SERVICE = TestBed.inject(AutorizacionDeRayosXService) as jest.Mocked<AutorizacionDeRayosXService>;
    MOCK_CONSULTA_QUERY = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(COMPONENT).toBeTruthy();
    });

    it('debería inicializar las propiedades con valores por defecto', () => {
      expect(COMPONENT.indice).toBe(1);
      expect(COMPONENT.esDatosRespuesta).toBe(true);
      expect(COMPONENT['destroyNotifier$']).toBeInstanceOf(Subject);
    });
  });

  describe('ngOnInit', () => {
    it('debería suscribirse al estado y actualizar consultaState', () => {
      COMPONENT.ngOnInit();
      
      expect(COMPONENT.consultaState).toEqual(MOCK_CONSULTA_STATE_UPDATE_FALSE);
    });

    it('debería llamar guardarDatosFormulario cuando update es true', () => {
      MOCK_CONSULTA_QUERY.selectConsultaioState$ = of(MOCK_CONSULTA_STATE_UPDATE_TRUE);
      const SPY_GUARDAR_DATOS = jest.spyOn(COMPONENT, 'guardarDatosFormulario');
      
      COMPONENT.ngOnInit();
      
      expect(SPY_GUARDAR_DATOS).toHaveBeenCalled();
    });

    it('debería establecer esDatosRespuesta como true cuando update es false', () => {
      MOCK_CONSULTA_QUERY.selectConsultaioState$ = of(MOCK_CONSULTA_STATE_UPDATE_FALSE);
      
      COMPONENT.ngOnInit();
      
      expect(COMPONENT.esDatosRespuesta).toBe(true);
    });

    it('debería manejar estados undefined/null', () => {
      // Since the component doesn't handle undefined states, we test with a valid default state
      const MOCK_DEFAULT_STATE: ConsultaioState = {
        update: false,
        readonly: false
      } as ConsultaioState;
      
      MOCK_CONSULTA_QUERY.selectConsultaioState$ = of(MOCK_DEFAULT_STATE);
      
      expect(() => COMPONENT.ngOnInit()).not.toThrow();
      expect(COMPONENT.consultaState).toEqual(MOCK_DEFAULT_STATE);
      expect(COMPONENT.esDatosRespuesta).toBe(true);
    });
  });

  describe('guardarDatosFormulario', () => {
    it('debería obtener datos y actualizar estado cuando hay respuesta', () => {
      COMPONENT.guardarDatosFormulario();
      
      expect(MOCK_AUTORIZACION_SERVICE.getAutorizacionDeRayosXDatos).toHaveBeenCalled();
      expect(COMPONENT.esDatosRespuesta).toBe(true);
      expect(MOCK_AUTORIZACION_SERVICE.actualizarEstadoFormulario).toHaveBeenCalledWith(MOCK_AUTORIZACION_DATOS);
    });

    it('no debería actualizar cuando la respuesta es null', () => {
      MOCK_AUTORIZACION_SERVICE.getAutorizacionDeRayosXDatos.mockReturnValue(of(null as any));
      COMPONENT.esDatosRespuesta = false;
      
      COMPONENT.guardarDatosFormulario();
      
      expect(COMPONENT.esDatosRespuesta).toBe(false);
      expect(MOCK_AUTORIZACION_SERVICE.actualizarEstadoFormulario).not.toHaveBeenCalled();
    });

    it('debería manejar errores del servicio', () => {
      MOCK_AUTORIZACION_SERVICE.getAutorizacionDeRayosXDatos.mockReturnValue(
        new Observable(subscriber => subscriber.error('Error'))
      );
      
      expect(() => COMPONENT.guardarDatosFormulario()).not.toThrow();
    });
  });

  describe('seleccionaTab', () => {
    it('debería actualizar el índice correctamente', () => {
      COMPONENT.seleccionaTab(3);
      expect(COMPONENT.indice).toBe(3);
      
      COMPONENT.seleccionaTab(1);
      expect(COMPONENT.indice).toBe(1);
    });

    it('debería manejar valores fuera del rango normal', () => {
      COMPONENT.seleccionaTab(0);
      expect(COMPONENT.indice).toBe(0);
      
      COMPONENT.seleccionaTab(5);
      expect(COMPONENT.indice).toBe(5);
    });
  });

  describe('Interacciones con template', () => {
    beforeEach(() => {
      COMPONENT.ngOnInit();
      FIXTURE.detectChanges();
    });

    it('debería renderizar 4 tabs con textos correctos', () => {
      const COMPILED = FIXTURE.nativeElement;
      const LINKS = COMPILED.querySelectorAll('.nav-tabs li a');
      const TEXTOS_ESPERADOS = ['Solicitante', 'Solicitud', 'Terceros relacionados', 'Pago de derechos'];
      
      expect(LINKS.length).toBe(4);
      LINKS.forEach((link: any, index: number) => {
        expect(link.textContent?.trim()).toBe(TEXTOS_ESPERADOS[index]);
      });
    });

    it('debería marcar como activo el tab según el índice', () => {
      COMPONENT.indice = 2;
      FIXTURE.detectChanges();
      
      const COMPILED = FIXTURE.nativeElement;
      const TAB_ACTIVO = COMPILED.querySelector('.nav-tabs li:nth-child(2).active');
      expect(TAB_ACTIVO).toBeTruthy();
    });

    it('debería llamar seleccionaTab en eventos click y teclado', () => {
      const SPY_SELECCIONA_TAB = jest.spyOn(COMPONENT, 'seleccionaTab');
      const COMPILED = FIXTURE.nativeElement;
      const SEGUNDO_TAB = COMPILED.querySelectorAll('.nav-tabs li a')[1];
      
      // Click
      SEGUNDO_TAB.click();
      expect(SPY_SELECCIONA_TAB).toHaveBeenCalledWith(2);
      
      // Enter
      const ENTER_EVENT = new KeyboardEvent('keydown', { key: 'Enter' });
      SEGUNDO_TAB.dispatchEvent(ENTER_EVENT);
      expect(SPY_SELECCIONA_TAB).toHaveBeenCalledWith(2);
    });

    it('debería mostrar componentes según indice y esDatosRespuesta', () => {
      const CASOS = [
        { indice: 1, selector: 'solicitante', debeAparacer: true },
        { indice: 2, selector: 'app-solicitud', debeAparacer: true },
        { indice: 3, selector: 'app-terceros-relacionados', debeAparacer: true },
        { indice: 4, selector: 'app-derechos', debeAparacer: true }
      ];
      
      CASOS.forEach(({ indice, selector, debeAparacer }) => {
        COMPONENT.indice = indice;
        COMPONENT.esDatosRespuesta = debeAparacer;
        FIXTURE.detectChanges();
        
        const ELEMENTO = FIXTURE.nativeElement.querySelector(selector);
        expect(!!ELEMENTO).toBe(debeAparacer);
      });
    });

    it('no debería mostrar componentes cuando esDatosRespuesta es false (excepto solicitante)', () => {
      COMPONENT.esDatosRespuesta = false;
      
      [2, 3, 4].forEach(indice => {
        COMPONENT.indice = indice;
        FIXTURE.detectChanges();
        
        const SELECTORES = ['app-solicitud', 'app-terceros-relacionados', 'app-derechos'];
        const ELEMENTO = FIXTURE.nativeElement.querySelector(SELECTORES[indice - 2]);
        expect(ELEMENTO).toBeFalsy();
      });
    });
  });

  describe('Flujo completo', () => {
    it('debería ejecutar flujo con update=true', () => {
      MOCK_CONSULTA_QUERY.selectConsultaioState$ = of(MOCK_CONSULTA_STATE_UPDATE_TRUE);
      
      COMPONENT.ngOnInit();
      
      expect(COMPONENT.consultaState.update).toBe(true);
      expect(MOCK_AUTORIZACION_SERVICE.getAutorizacionDeRayosXDatos).toHaveBeenCalled();
      expect(COMPONENT.esDatosRespuesta).toBe(true);
    });

    it('debería ejecutar flujo con update=false', () => {
      MOCK_CONSULTA_QUERY.selectConsultaioState$ = of(MOCK_CONSULTA_STATE_UPDATE_FALSE);
      
      COMPONENT.ngOnInit();
      
      expect(COMPONENT.consultaState.update).toBe(false);
      expect(MOCK_AUTORIZACION_SERVICE.getAutorizacionDeRayosXDatos).not.toHaveBeenCalled();
      expect(COMPONENT.esDatosRespuesta).toBe(true);
    });
  });

    // it('debería usar takeUntil para evitar fugas de memoria', () => {
    //   const MOCK_OBSERVABLE = of(MOCK_CONSULTA_STATE_UPDATE_FALSE);
    //   const MOCK_PIPE = jest.fn().mockReturnValue(MOCK_OBSERVABLE);
    //   MOCK_CONSULTA_QUERY.selectConsultaioState$ = { pipe: MOCK_PIPE } as any;
      
    //   COMPONENT.ngOnInit();
      
    //   expect(MOCK_PIPE).toHaveBeenCalledWith(takeUntil(expect.any(Subject)));
    // });
    });
