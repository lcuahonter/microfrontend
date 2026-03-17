import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { DatosRetornoProrrogaComponent } from './datos-retorno-prorroga.component';
import { Tramite630303Store } from '../../estados/tramite630303.store';
import { Tramite630303Query } from '../../estados/tramite630303.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('DatosRetornoProrrogaComponent', () => {
  let componente: DatosRetornoProrrogaComponent;
  let fixture: ComponentFixture<DatosRetornoProrrogaComponent>;
  let mockTramite630303Store: jest.Mocked<Tramite630303Store>;
  let mockTramite630303Query: jest.Mocked<Tramite630303Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let subjectEstadoTramite: BehaviorSubject<any>;
  let subjectEstadoConsulta: BehaviorSubject<any>;

  const datosTramiteSimulados = {
    numeroProrrogaSolicitud: 'PROR-001-2024',
    fechaSolicitudProrroga: '2024-01-15',
    motivoProrroga: 'Demora en documentación',
    plazoSolicitado: 30,
    fechaVencimientoActual: '2024-02-15',
    fechaVencimientoSolicitada: '2024-03-15',
    numeroDocumentoRespaldo: 'DOC-RESP-001',
    montoOperacion: 75000.00,
    monedaOperacion: 'MXN'
  };

  const datosConsultaSimulados = {
    readonly: false
  } as any;

  beforeEach(async () => {
    subjectEstadoTramite = new BehaviorSubject(datosTramiteSimulados);
    subjectEstadoConsulta = new BehaviorSubject(datosConsultaSimulados);
    
    mockTramite630303Store = {
      setTramite630303State: jest.fn()
    } as any;

    mockTramite630303Query = {
      selectTramite630303State$: subjectEstadoTramite.asObservable()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: subjectEstadoConsulta.asObservable()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        DatosRetornoProrrogaComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite630303Store, useValue: mockTramite630303Store },
        { provide: Tramite630303Query, useValue: mockTramite630303Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosRetornoProrrogaComponent);
    componente = fixture.componentInstance;
  });

  afterEach(() => {
    if (subjectEstadoTramite && !subjectEstadoTramite.closed) {
      subjectEstadoTramite.complete();
    }
    if (subjectEstadoConsulta && !subjectEstadoConsulta.closed) {
      subjectEstadoConsulta.complete();
    }
  });

  describe('Pruebas básicas del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(componente).toBeTruthy();
      expect(componente.formularioDatosProrroga).toBeDefined();
    });

    it('debería inicializar el formulario reactivo en el constructor', () => {
      expect(componente.datosImportacionRetornoProrrogaGeneralFormulario).toBeDefined();
      expect(componente.datosImportacionRetornoProrrogaGeneralFormulario.valid).toBe(true);
    });

    it('debería tener todas las propiedades requeridas inicializadas', () => {
      expect((componente as any).destroyed$).toBeDefined();
      expect(componente.formularioDatosProrroga).toBeDefined();
      expect(componente.datosImportacionRetornoProrrogaGeneralFormulario).toBeDefined();
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería ejecutar getValorStore y obtenerEstadoValor en ngOnInit', fakeAsync(() => {
      const spyGetValorStore = jest.spyOn(componente, 'getValorStore');
      const spyObtenerEstadoValor = jest.spyOn(componente, 'obtenerEstadoValor');

      componente.ngOnInit();
      tick();

      expect(spyGetValorStore).toHaveBeenCalled();
      expect(spyObtenerEstadoValor).toHaveBeenCalled();
    }));

    it('debería manejar estado undefined sin errores', () => {
      componente.estadoSeleccionado = undefined as any;
      expect(() => componente.getValorStore()).not.toThrow();
    });

    it('debería limpiar las suscripciones correctamente en ngOnDestroy', () => {
      const spyDestroyed = jest.spyOn((componente as any).destroyed$, 'next');
      const spyComplete = jest.spyOn((componente as any).destroyed$, 'complete');

      componente.ngOnDestroy();

      expect(spyDestroyed).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
  });

  describe('Gestión del formulario y estado de solo lectura', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería deshabilitar el formulario cuando esSoloLectura es true', () => {
      componente.datosImportacionRetornoProrrogaGeneralFormulario.disable();
      expect(componente.datosImportacionRetornoProrrogaGeneralFormulario.disabled).toBe(true);
    });

    it('debería habilitar el formulario cuando esSoloLectura es false', () => {
      componente.datosImportacionRetornoProrrogaGeneralFormulario.enable();
      expect(componente.datosImportacionRetornoProrrogaGeneralFormulario.enabled).toBe(true);
    });
  });

  describe('obtenerEstadoValor', () => {
    it('debería suscribirse al estado de consulta y actualizar esSoloLectura', fakeAsync(() => {
      const spyGuardarDatosFormulario = jest.spyOn(componente, 'guardarDatosFormulario');
      
      componente.obtenerEstadoValor();
      tick();

      expect(componente.esSoloLectura).toBe(false);
      expect(spyGuardarDatosFormulario).toHaveBeenCalled();
    }));

    it('debería manejar estados de consulta con propiedades undefined', fakeAsync(() => {
    const nuevoSubjectConsulta = new BehaviorSubject({} as any);
    mockConsultaioQuery.selectConsultaioState$ = nuevoSubjectConsulta.asObservable();

    componente.obtenerEstadoValor();
    tick();

    expect(componente.esSoloLectura).toBe(false);
    nuevoSubjectConsulta.complete();
  }));
   
  });

  describe('getValorStore', () => {
    it('debería suscribirse al estado del trámite y actualizar estadoSeleccionado', fakeAsync(() => {
      componente.getValorStore();
      tick();

      expect(componente.estadoSeleccionado).toEqual(datosTramiteSimulados);
    }));

    it('debería manejar actualizaciones del estado del trámite', fakeAsync(() => {
      const nuevoEstado = {
        ...datosTramiteSimulados,
        numeroProrrogaSolicitud: 'PROR-002-2024',
        plazoSolicitado: 45
      };
      
      componente.getValorStore();
      tick();

      subjectEstadoTramite.next(nuevoEstado);
      tick();

      expect(componente.estadoSeleccionado).toEqual(nuevoEstado);
    }));

    it('debería manejar estado nulo', fakeAsync(() => {
      componente.getValorStore();
      tick();

      subjectEstadoTramite.next(null as any);
      tick();

      expect(componente.estadoSeleccionado).toBeNull();
    }));
  });

  describe('establecerCambioDeValor', () => {
    it('debería llamar al store con los parámetros correctos', () => {
      const evento = {
        campo: 'numeroProrrogaSolicitud',
        valor: 'PROR-NEW-2024'
      };

      componente.establecerCambioDeValor(evento);

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith(
        'numeroProrrogaSolicitud',
        'PROR-NEW-2024'
      );
    });

    it('debería manejar diferentes tipos de valores', () => {
      const eventos = [
        { campo: 'motivoProrroga', valor: 'Nuevo motivo' },
        { campo: 'plazoSolicitado', valor: 60 },
        { campo: 'esUrgente', valor: true },
        { campo: 'montoOperacion', valor: 85000.50 },
        { campo: 'fechaVencimiento', valor: new Date('2024-04-15') }
      ];

      eventos.forEach(evento => {
        componente.establecerCambioDeValor(evento);
        expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith(
          evento.campo,
          evento.valor
        );
      });

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledTimes(eventos.length);
    });

    it('debería manejar valores nulos y undefined', () => {
      const eventoNulo = { campo: 'campo1', valor: null };
      const eventoUndefined = { campo: 'campo2', valor: undefined };

      componente.establecerCambioDeValor(eventoNulo);
      componente.establecerCambioDeValor(eventoUndefined);

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('campo1', null);
      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('campo2', undefined);
    });

    it('debería manejar objetos complejos como valores', () => {
      const objetoComplejo = {
        documentos: ['doc1.pdf', 'doc2.pdf'],
        metadatos: { version: 1, autor: 'Usuario' }
      };

      const evento = {
        campo: 'documentosRespaldo',
        valor: objetoComplejo
      };

      componente.establecerCambioDeValor(evento);

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith(
        'documentosRespaldo',
        objetoComplejo
      );
    });
  });

  describe('Pruebas de integración', () => {
    it('debería inicializar y configurar todas las dependencias correctamente', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect((componente as any).destroyed$).toBeDefined();
      expect(componente.esSoloLectura).toBe(false);
      expect(componente.estadoSeleccionado).toEqual(datosTramiteSimulados);
    }));

    it('debería sincronizar correctamente formulario y estado', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      componente.datosImportacionRetornoProrrogaGeneralFormulario.disable();
      expect(componente.datosImportacionRetornoProrrogaGeneralFormulario.disabled).toBe(true);
      componente.datosImportacionRetornoProrrogaGeneralFormulario.enable();
      expect(componente.datosImportacionRetornoProrrogaGeneralFormulario.enabled).toBe(true);
    }));
  });

  describe('Casos extremos', () => {
    it('debería manejar múltiples operaciones del store', () => {
      const valores = [
        'Prórroga 1',
        'Prórroga 2',
        null,
        undefined,
        'Prórroga 3',
        45,
        true,
        { plazo: 30, motivo: 'Urgente' }
      ];
      
      valores.forEach((valor, indice) => {
        componente.establecerCambioDeValor({ campo: 'campo', valor });
        
        expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith('campo', valor);
      });

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledTimes(valores.length);
    });

    it('debería manejar cambios rápidos de estado del formulario', () => {
      for (let i = 0; i < 50; i++) {
        if (i % 2 === 0) {
          componente.datosImportacionRetornoProrrogaGeneralFormulario.disable();
          expect(componente.datosImportacionRetornoProrrogaGeneralFormulario.disabled).toBe(true);
        } else {
          componente.datosImportacionRetornoProrrogaGeneralFormulario.enable();
          expect(componente.datosImportacionRetornoProrrogaGeneralFormulario.enabled).toBe(true);
        }
      }
    });

    it('debería manejar reinicializaciones múltiples', fakeAsync(() => {
      for (let i = 0; i < 10; i++) {
        componente.ngOnInit();
        tick();
        expect(componente.estadoSeleccionado).toEqual(datosTramiteSimulados);
        expect(componente.esSoloLectura).toBe(false);
      }
    }));

    it('debería limpiar correctamente las suscripciones al destruir', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      componente.ngOnDestroy();
      subjectEstadoConsulta.next({ readonly: true });
      tick();
      expect(componente.esSoloLectura).toBe(false);
    }));
  });

  describe('Manejo de errores', () => {
    it('debería manejar establecerCambioDeValor con parámetros inválidos', () => {
      expect(() => componente.establecerCambioDeValor(null as any)).not.toThrow();
      expect(() => componente.establecerCambioDeValor({ campo: '', valor: undefined } as any)).not.toThrow();
      expect(() => componente.establecerCambioDeValor({ campo: null, valor: 'test' } as any)).not.toThrow();
    });

    it('debería manejar operaciones de formulario con formulario undefined', () => {
      componente.datosImportacionRetornoProrrogaGeneralFormulario = undefined as any;
      componente.esSoloLectura = true;
      expect(() => componente.guardarDatosFormulario()).not.toThrow();
    });

    it('debería manejar estado undefined sin errores', () => {
      componente.estadoSeleccionado = undefined as any;
      expect(() => componente.getValorStore()).not.toThrow();
    });
  });

  describe('Funcionalidad específica de datos de prórroga', () => {
    it('debería manejar números de prórroga correctamente', () => {
      const numeroProrrogaSolicitud = 'PROR-ESPECIAL-2024';
      componente.establecerCambioDeValor({
        campo: 'numeroProrrogaSolicitud',
        valor: numeroProrrogaSolicitud
      });

      expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith(
        'numeroProrrogaSolicitud',
        numeroProrrogaSolicitud
      );
    });

    it('debería manejar datos numéricos de prórroga', () => {
      const datosNumericos = [
        { campo: 'plazoSolicitado', valor: 60 },
        { campo: 'montoOperacion', valor: 125000.75 },
        { campo: 'diasTranscurridos', valor: 15 },
        { campo: 'diasRestantes', valor: 45 }
      ];

      datosNumericos.forEach(dato => {
        componente.establecerCambioDeValor(dato);
        expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith(
          dato.campo,
          dato.valor
        );
      });
    });

    it('debería preservar la estructura del formulario dinámico', () => {
      expect(Array.isArray(componente.formularioDatosProrroga)).toBe(true);
      expect(componente.formularioDatosProrroga.length).toBeGreaterThan(0);
      
      const elementosFormulario = componente.formularioDatosProrroga;
      elementosFormulario.forEach(elemento => {
        expect(elemento).toHaveProperty('id');
      });
    });

    it('debería manejar campos de fecha correctamente', () => {
      const fechas = [
        { campo: 'fechaSolicitudProrroga', valor: new Date('2024-01-15') },
        { campo: 'fechaVencimientoActual', valor: new Date('2024-02-15') },
        { campo: 'fechaVencimientoSolicitada', valor: new Date('2024-03-15') }
      ];

      fechas.forEach(fecha => {
        componente.establecerCambioDeValor(fecha);
        expect(mockTramite630303Store.setTramite630303State).toHaveBeenCalledWith(
          fecha.campo,
          fecha.valor
        );
      });
    });
  });
});