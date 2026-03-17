import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoComponent } from './aviso.component';
import { of, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EntregaActaService } from '../../services/entrega-acta.service';
import { Tramite32507Query } from '../../../../estados/queries/tramite32507.query';
import { Tramite32507Store } from '../../../../estados/tramites/tramite32507.store';
import { ValidacionesFormularioService, ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ElementRef } from '@angular/core';

jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn()
  }))
}));

declare global {
  interface Window {
    Modal: any;
  }
}

describe('AvisoComponent', () => {
  let component: AvisoComponent;
  let fixture: ComponentFixture<AvisoComponent>;
  let entregaActaServiceMock: any;
  let tramiteQueryMock: any;
  let storeMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    entregaActaServiceMock = {
      obtenerLevantaActa: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Mock Adace' }] })),
      obtenerUnidadMedida: jest.fn().mockReturnValue(of({ datos: [{ clave: 'kg', descripcion: 'Kilogramo' }] })),
      obtenerAvisoTabla: jest.fn().mockReturnValue(of({
        datos: [{
          idTransaccionVUCEM: 'TX-001',
          cantidad: '10',
          pesoKg: '5',
          descripcionUnidadMedida: 'kg',
          descripcion: 'Test Item'
        }]
      })),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        avisoFormulario: {
          adace: 'Mock Adace',
          valorProgramaImmex: '12345',
          valorAnioProgramaImmex: '2024',
          tipoBusqueda: 'tipo',
          levantaActa: 'Acta',
          transaccionId: 'TX-001',
          cantidad: '10',
          peso: '5',
          unidadMedida: 'kg',
          descripcion: 'Descripción mock',
        }
      })
    };

    storeMock = {
      setTransaccionId: jest.fn(),
      setCantidad: jest.fn(),
      setPeso: jest.fn(),
      setUnidadMedida: jest.fn(),
      setDescripcion: jest.fn(),
      setAvisoFormularioAdace: jest.fn(),
      setAvisoFormularioValorProgramaImmex: jest.fn(),
      setAvisoFormularioValorAnioProgramaImmex: jest.fn(),
      setAvisoFormularioTipoBusqueda: jest.fn(),
      setAvisoFormularioLevantaActa: jest.fn(),
      setAvisoFormularioTransaccionId: jest.fn(),
      setAvisoFormularioCantidad: jest.fn(),
      setAvisoFormularioPeso: jest.fn(),
      setAvisoFormularioUnidadMedida: jest.fn(),
      setAvisoFormularioDescripcion: jest.fn(),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
        update: false
      })
    };

    await TestBed.configureTestingModule({
      imports: [AvisoComponent],
      providers: [
        FormBuilder,
        { provide: EntregaActaService, useValue: entregaActaServiceMock },
        { provide: Tramite32507Query, useValue: tramiteQueryMock },
        { provide: Tramite32507Store, useValue: storeMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoComponent);
    component = fixture.componentInstance;

    const mockElementRef = {
      nativeElement: {
        click: jest.fn()
      }
    } as ElementRef;

    const mockDataElementRef = {
      nativeElement: document.createElement('div')
    } as ElementRef;

    component.closeMercancia = mockElementRef;
    component.datosAviso = mockDataElementRef;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    expect(component.avisoFormulario).toBeDefined();
    expect(component.datosEmpresa.get('valorProgramaImmex')?.value).toBe('12345');
  });

  it('should call cargarUnidadMedida and cargarLevantaActa on init', () => {
    expect(entregaActaServiceMock.obtenerLevantaActa).toHaveBeenCalled();
    expect(entregaActaServiceMock.obtenerUnidadMedida).toHaveBeenCalled();
  });

  it('should validate field with isValid()', () => {
    const result = component.isValid(component.avisoFormulario, 'adaceForm');
    expect(result).toBe(true);
  });

  it('should sanitize alphanumeric input', () => {
    const mockEvent = { target: { value: 'text123!@#' } } as unknown as Event;
    AvisoComponent.sanitizeAlphanumeric(component.adaceForm, 'descripcion', mockEvent);
    expect(component.adaceForm.get('descripcion')?.value).toBe('text123');
  });

  describe('agregarMercancia', () => {
    beforeEach(() => {
      component.closeMercancia = {
        nativeElement: {
          click: jest.fn()
        }
      } as ElementRef;
    });

    it('should add new mercancia to table and close modal when form is valid', () => {
      component.adaceForm.patchValue({
        transaccionId: 'TX-001',
        cantidad: '10',
        peso: '5',
        unidadMedida: '1',
        descripcion: 'Test Item'
      });
      
      Object.keys(component.adaceForm.controls).forEach(key => {
        component.adaceForm.get(key)?.setErrors(null);
      });
      
      component.unidadMedida = [
        { id: 1, descripcion: 'Kilogramos' }
      ];
      
      component.tablaDeDatos.datos = [];

      component.agregarMercancia();

      expect(component.tablaDeDatos.datos).toHaveLength(1);
      expect(component.tablaDeDatos.datos[0]).toEqual({
        idTransaccionVUCEM: 'TX-001',
        cantidad: '10',
        pesoKg: '5',
        descripcionUnidadMedida: 'Kilogramos',
        descripcion: 'Test Item'
      });
      expect(component.closeMercancia.nativeElement.click).toHaveBeenCalled();
      expect(component.esPopupAbierto).toBe(false);
    });
  });

  describe('cargarMercanciaTabla', () => {
    it('should load table data from service and assign to tablaDeDatos.datos', () => {
      const mockData = {
        datos: [
          {
            idTransaccionVUCEM: 'TX-001',
            cantidad: '10',
            pesoKg: '5',
            descripcionUnidadMedida: 'kg',
            descripcion: 'Test Item 1'
          },
          {
            idTransaccionVUCEM: 'TX-002',
            cantidad: '20',
            pesoKg: '10',
            descripcionUnidadMedida: 'gr',
            descripcion: 'Test Item 2'
          }
        ]
      };
      entregaActaServiceMock.obtenerAvisoTabla.mockReturnValue(of(mockData));

      component.cargarMercanciaTabla();

      expect(entregaActaServiceMock.obtenerAvisoTabla).toHaveBeenCalled();
      expect(component.tablaDeDatos.datos).toEqual(mockData.datos);
    });

    it('should handle subscription lifecycle with takeUntil', () => {
      const destroyNotifierSpy = jest.spyOn(component.destroyNotifier$, 'next');

      component.cargarMercanciaTabla();
      component.ngOnDestroy();

      expect(destroyNotifierSpy).toHaveBeenCalled();
    });
  });

  describe('eliminarDomicilio', () => {
    let item1: any, item2: any, item3: any;

    beforeEach(() => {
      item1 = {
        idTransaccionVUCEM: 'TX-001',
        cantidad: '10',
        pesoKg: '5',
        descripcionUnidadMedida: 'kg',
        descripcion: 'Item 1'
      };
      item2 = {
        idTransaccionVUCEM: 'TX-002',
        cantidad: '20',
        pesoKg: '10',
        descripcionUnidadMedida: 'gr',
        descripcion: 'Item 2'
      };
      item3 = {
        idTransaccionVUCEM: 'TX-003',
        cantidad: '30',
        pesoKg: '15',
        descripcionUnidadMedida: 'kg',
        descripcion: 'Item 3'
      };

      component.tablaDeDatos = {
        encabezadas: [],
        datos: [item1, item2, item3]
      };
    });

    it('should remove selected rows from tablaDeDatos.datos', () => {
      component.filaSeleccionadaLista = [item1, item3];

      component.eliminarDomicilio();

      expect(component.tablaDeDatos.datos).toEqual([item2]);
    });

    it('should clear filaSeleccionadaLista after deletion', () => {
      component.filaSeleccionadaLista = [item1];

      component.eliminarDomicilio();

      expect(component.filaSeleccionadaLista).toEqual([]);
    });

    it('should not remove any rows when filaSeleccionadaLista is empty', () => {
      const originalData = [...component.tablaDeDatos.datos];
      component.filaSeleccionadaLista = [];

      component.eliminarDomicilio();

      expect(component.tablaDeDatos.datos).toEqual(originalData);
    });
  });

  describe('inicializarAvisoFormulario', () => {
    beforeEach(() => {
      component.closeMercancia = {
        nativeElement: {
          click: jest.fn()
        }
      } as ElementRef;
    });

    it('should disable form when soloLectura is true', () => {
      component.soloLectura = true;
      jest.spyOn(component.avisoFormulario, 'disable');

      component.inicializarAvisoFormulario();

      expect(component.avisoFormulario.disable).toHaveBeenCalled();
    });

    it('should enable form when soloLectura is false', () => {
      component.soloLectura = false;
      jest.spyOn(component.avisoFormulario, 'enable');

      component.inicializarAvisoFormulario();

      expect(component.avisoFormulario.enable).toHaveBeenCalled();
    });
  });

  describe('setValoresStore', () => {
    let mockForm: FormGroup;

    beforeEach(() => {
      const fb = new FormBuilder();
      mockForm = fb.group({
        testField: ['testValue']
      });
    });

    it('should call store method with form field value', () => {
      component.setValoresStore(mockForm, 'testField', 'setAvisoFormularioAdace');

      expect(storeMock.setAvisoFormularioAdace).toHaveBeenCalledWith('testValue');
    });

    it('should handle undefined form field', () => {
      component.setValoresStore(mockForm, 'nonExistentField', 'setAvisoFormularioAdace');

      expect(storeMock.setAvisoFormularioAdace).toHaveBeenCalledWith(undefined);
    });

    it('should work with different store methods', () => {
      component.setValoresStore(mockForm, 'testField', 'setAvisoFormularioCantidad');

      expect(storeMock.setAvisoFormularioCantidad).toHaveBeenCalledWith('testValue');
    });
  });

  describe('abrirPopup', () => {
    it('should set esPopupAbierto to true', () => {
      component.esPopupAbierto = false;

      component.abrirPopup();

      expect(component.esPopupAbierto).toBe(true);
    });
  });

  describe('filaSeleccionada', () => {
    it('should update filaSeleccionadaLista with provided event data', () => {
      const mockData = [
        {
          idTransaccionVUCEM: 'TX-001',
          cantidad: '10',
          pesoKg: '5',
          descripcionUnidadMedida: 'kg',
          descripcion: 'Test Item'
        }
      ];

      component.filaSeleccionada(mockData);

      expect(component.filaSeleccionadaLista).toEqual(mockData);
    });

    it('should handle empty array', () => {
      component.filaSeleccionada([]);

      expect(component.filaSeleccionadaLista).toEqual([]);
    });
  });

  describe('Form getters', () => {
    it('should return adaceForm from avisoFormulario', () => {
      const result = component.adaceForm;

      expect(result).toBe(component.avisoFormulario.get('adaceForm'));
    });

    it('should return adaceFormulario from avisoFormulario', () => {
      const result = component.adaceFormulario;

      expect(result).toBe(component.avisoFormulario.get('adaceFormulario'));
    });

    it('should return datosEmpresa from avisoFormulario', () => {
      const result = component.datosEmpresa;

      expect(result).toBe(component.avisoFormulario.get('datosEmpresa'));
    });

    it('should return datosAdace from avisoFormulario', () => {
      const result = component.datosAdace;

      expect(result).toBe(component.avisoFormulario.get('datosAdace'));
    });
  });

  describe('Component lifecycle', () => {
    it('should complete destroyNotifier$ on ngOnDestroy', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should handle consultaioQuery subscription in ngOnInit', () => {
      expect(component.soloLectura).toBe(false);
    });

    it('should properly initialize all subscriptions in ngOnInit', () => {
      entregaActaServiceMock.obtenerLevantaActa.mockClear();
      entregaActaServiceMock.obtenerUnidadMedida.mockClear();

      component.ngOnInit();

      expect(entregaActaServiceMock.obtenerLevantaActa).toHaveBeenCalled();
      expect(entregaActaServiceMock.obtenerUnidadMedida).toHaveBeenCalled();
    });
  });

  describe('Additional method coverage', () => {
    it('should handle cargarLevantaActa service call and data assignment', () => {
      const mockData = { datos: [{ clave: 'test', descripcion: 'Test Adace' }] };
      entregaActaServiceMock.obtenerLevantaActa.mockReturnValue(of(mockData));

      component.cargarLevantaActa();

      expect(entregaActaServiceMock.obtenerLevantaActa).toHaveBeenCalled();
      expect(component.optoinAdace).toEqual(mockData.datos);
    });

    it('should handle cargarUnidadMedida service call and data assignment', () => {
      const mockData = { datos: [{ clave: 'test', descripcion: 'Test Unit' }] };
      entregaActaServiceMock.obtenerUnidadMedida.mockReturnValue(of(mockData));

      component.cargarUnidadMedida();

      expect(entregaActaServiceMock.obtenerUnidadMedida).toHaveBeenCalled();
      expect(component.unidadMedida).toEqual(mockData.datos);
    });

    it('should initialize form with tramiteState data', () => {
      expect(component.avisoFormulario.get('datosEmpresa.valorProgramaImmex')?.value).toBe('12345');
      expect(component.avisoFormulario.get('datosEmpresa.valorAnioProgramaImmex')?.value).toBe('2024');
      expect(component.avisoFormulario.get('datosAdace.levantaActa')?.value).toBe('Acta');
    });

    it('should handle readonly mode properly in consultaioQuery subscription', () => {
      component.consultaDatos = {
        readonly: true,
        update: true
      } as any;
      component.soloLectura = component.consultaDatos.readonly;

      component.closeMercancia = {
        nativeElement: {
          click: jest.fn()
        }
      } as ElementRef;

      component.inicializarAvisoFormulario();

      expect(component.soloLectura).toBe(true);
    });
  });

  describe('Error handling and edge cases', () => {
    beforeEach(() => {
      component.closeMercancia = {
        nativeElement: {
          click: jest.fn()
        }
      } as ElementRef;
    });

    it('should handle agregarMercancia when closeMercancia is undefined', () => {
      component.closeMercancia = undefined as any;
      
      component.adaceForm.patchValue({
        transaccionId: 'TX-001',
        cantidad: '10',
        peso: '5',
        unidadMedida: '1',
        descripcion: 'Test Item'
      });
      
      Object.keys(component.adaceForm.controls).forEach(key => {
        component.adaceForm.get(key)?.setErrors(null);
      });
      
      component.unidadMedida = [{ id: 1, descripcion: 'Kilogramos' }];

      expect(() => component.agregarMercancia()).toThrow();
    });

    it('should handle sanitizeAlphanumeric with null event', () => {
      const nullEvent = null as any;

      expect(() => {
        AvisoComponent.sanitizeAlphanumeric(component.adaceForm, 'descripcion', nullEvent);
      }).not.toThrow();
    });

    it('should handle sanitizeAlphanumeric with event missing target', () => {
      const eventWithoutTarget = {} as Event;

      expect(() => {
        AvisoComponent.sanitizeAlphanumeric(component.adaceForm, 'descripcion', eventWithoutTarget);
      }).not.toThrow();
    });

    it('should handle form validation when field does not exist', () => {
      const result = component.isValid(component.avisoFormulario, 'nonExistentField');
      expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.avisoFormulario, 'nonExistentField');
      expect(result).toBe(true);
    });

    it('should handle datosDelAviso when Modal is not available', () => {
      (window as any).Modal = undefined;
      component.esPopupAbierto = false;

      component.datosDelAviso();

      expect(component.esPopupAbierto).toBe(true);
    });

    it('should handle setValoresStore with null form get result', () => {
      const mockForm = {
        get: jest.fn().mockReturnValue(null)
      } as any;

      component.setValoresStore(mockForm, 'testField', 'setAvisoFormularioAdace');

      expect(storeMock.setAvisoFormularioAdace).toHaveBeenCalledWith(undefined);
    });
  });

});
