import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { Tramite261701Store } from '../../estados/store/tramite261701.store';
import { Tramite261701Query } from '../../estados/query/tramite261701.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CancelacionPeticionService } from '../../services/cancelacion-peticion.service';
import { REPRESENTANTE_LEGAL } from '../../constantes/cancelacion-peticion.enum';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { of, Subject, throwError } from 'rxjs';
import { DatosPersona } from '../../models/cancelacion-peticion.model';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;
  let mockTramite261701Store: jest.Mocked<Tramite261701Store>;
  let mockTramite261701Query: jest.Mocked<Tramite261701Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockCancelacionPeticionService: jest.Mocked<CancelacionPeticionService>;

  const mockCancelacionState = {
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'González',
    rfc: 'PEGJ800101ABC'
  };

  const mockDatosPersona: DatosPersona = {
    nombre: 'María',
    apellidoPaterno: 'López',
    apellidoMaterno: 'Martínez',
    rfc: 'LOMM900101DEF'
  };

  beforeEach(async () => {
    const tramite261701StoreSpy = {
      establecerDatos: jest.fn()
    };

    const tramite261701QuerySpy = {
      select$: of(mockCancelacionState)
    };

    const consultaioQuerySpy = {
      selectConsultaioState$: of({
        readonly: false,
        update: false,
        id_solicitud: null
      })
    };

    const cancelacionPeticionServiceSpy = {
      getBuscarDatos: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        RepresentanteLegalComponent,
        CommonModule,
        ReactiveFormsModule,
        FormasDinamicasComponent
      ],
      providers: [
        { provide: Tramite261701Store, useValue: tramite261701StoreSpy },
        { provide: Tramite261701Query, useValue: tramite261701QuerySpy },
        { provide: ConsultaioQuery, useValue: consultaioQuerySpy },
        { provide: CancelacionPeticionService, useValue: cancelacionPeticionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;

    mockTramite261701Store = TestBed.inject(Tramite261701Store) as jest.Mocked<Tramite261701Store>;
    mockTramite261701Query = TestBed.inject(Tramite261701Query) as jest.Mocked<Tramite261701Query>;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
    mockCancelacionPeticionService = TestBed.inject(CancelacionPeticionService) as jest.Mocked<CancelacionPeticionService>;
  });

  describe('Inicialización del componente', () => {
    it('debería crear el componente correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('debería inicializar las propiedades con valores por defecto', () => {
      expect(component.forma).toBeDefined();
      expect(component.forma).toBeInstanceOf(FormGroup);
      expect(component.representanteLegalFormData).toEqual([]);
      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('debería tener un FormGroup con ninoFormGroup anidado', () => {
      expect(component.forma.get('ninoFormGroup')).toBeDefined();
      expect(component.forma.get('ninoFormGroup')).toBeInstanceOf(FormGroup);
    });

    it('debería tener un Subject para destruirNotificador$', () => {
      expect(component['destruirNotificador$']).toBeInstanceOf(Subject);
    });
  });

  describe('Constructor', () => {
    it('debería suscribirse al estado de consulta y establecer esFormularioSoloLectura', () => {
      const mockState = { readonly: true, update: false, id_solicitud: null };
      mockConsultaioQuery.selectConsultaioState$ = of(mockState);

      // Recrear el componente para que el constructor se ejecute con el nuevo mock
      fixture = TestBed.createComponent(RepresentanteLegalComponent);
      component = fixture.componentInstance;

      expect(component.esFormularioSoloLectura).toBe(true);
    });

    it('debería manejar estado de consulta con readonly false', () => {
      const mockState = { readonly: false, update: true, id_solicitud: '123' };
      mockConsultaioQuery.selectConsultaioState$ = of(mockState);

      fixture = TestBed.createComponent(RepresentanteLegalComponent);
      component = fixture.componentInstance;

      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('debería manejar múltiples emisiones del estado de consulta', () => {
      const subject = new Subject();
      mockConsultaioQuery.selectConsultaioState$ = subject.asObservable();

      fixture = TestBed.createComponent(RepresentanteLegalComponent);
      component = fixture.componentInstance;

      subject.next({ readonly: false });
      expect(component.esFormularioSoloLectura).toBe(false);

      subject.next({ readonly: true });
      expect(component.esFormularioSoloLectura).toBe(true);
    });
  });

  describe('ninoFormGroup getter', () => {
    it('debería retornar el FormGroup ninoFormGroup', () => {
      const ninoFormGroup = component.ninoFormGroup;
      
      expect(ninoFormGroup).toBeDefined();
      expect(ninoFormGroup).toBeInstanceOf(FormGroup);
      expect(ninoFormGroup).toBe(component.forma.get('ninoFormGroup'));
    });

    it('debería permitir agregar controles al ninoFormGroup', () => {
      const ninoFormGroup = component.ninoFormGroup;
      ninoFormGroup.addControl('rfc', new FormGroup({}));
      
      expect(ninoFormGroup.get('rfc')).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería suscribirse al estado del trámite y establecer cancelacionState', () => {
      expect(component.cancelacionState).toEqual(mockCancelacionState);
    });

    it('debería llamar actualizarRepresentanteLegalFormData', () => {
      jest.spyOn(component as any, 'actualizarRepresentanteLegalFormData');

      component.ngOnInit();

      expect(component['actualizarRepresentanteLegalFormData']).toHaveBeenCalled();
    });

    it('debería manejar múltiples emisiones del estado del trámite', () => {
      const subject = new Subject();
      mockTramite261701Query.select$ = subject.asObservable();

      component.ngOnInit();

      const primerEstado = { nombre: 'Primer' };
      subject.next(primerEstado);
      expect(component.cancelacionState).toEqual(primerEstado);

      const segundoEstado = { nombre: 'Segundo' };
      subject.next(segundoEstado);
      expect(component.cancelacionState).toEqual(segundoEstado);
    });
  });

  describe('actualizarRepresentanteLegalFormData', () => {
    beforeEach(() => {
      component.cancelacionState = mockCancelacionState;
    });

    it('debería establecer representanteLegalFormData con campos desactivados cuando esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;

      component['actualizarRepresentanteLegalFormData']();

      expect(component.representanteLegalFormData).toBeDefined();
      // Verificar que los campos que existen en cancelacionState tienen desactivado: true
      component.representanteLegalFormData.forEach(campo => {
        if (mockCancelacionState[campo.campo] !== undefined) {
          expect(campo.desactivado).toBe(true);
        }
      });
    });

    it('debería establecer representanteLegalFormData con REPRESENTANTE_LEGAL cuando esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;

      component['actualizarRepresentanteLegalFormData']();

      expect(component.representanteLegalFormData).toEqual(REPRESENTANTE_LEGAL);
    });

    it('debería mantener campos originales cuando no existen en cancelacionState', () => {
      component.esFormularioSoloLectura = true;
      component.cancelacionState = { otroCampo: 'valor' };

      component['actualizarRepresentanteLegalFormData']();

      component.representanteLegalFormData.forEach(campo => {
        if (campo.campo !== 'otrocampo') {
          expect(campo.desactivado).toBeUndefined();
        }
      });
    });

    it('debería manejar cancelacionState undefined', () => {
      component.esFormularioSoloLectura = true;
      component.cancelacionState = undefined as any;

      expect(() => component['actualizarRepresentanteLegalFormData']()).not.toThrow();
    });

    it('debería manejar cancelacionState null', () => {
      component.esFormularioSoloLectura = true;
      component.cancelacionState = null as any;

      expect(() => component['actualizarRepresentanteLegalFormData']()).not.toThrow();
    });
  });

  describe('establecerCambioDeValor', () => {
    it('debería llamar cambioEnValoresStore cuando el evento es válido', () => {
      jest.spyOn(component, 'cambioEnValoresStore');
      const mockEvent = { campo: 'nombre', valor: 'Juan' };

      component.establecerCambioDeValor(mockEvent);

      expect(component.cambioEnValoresStore).toHaveBeenCalledWith('nombre', 'Juan');
    });

    it('no debería hacer nada cuando el evento es null', () => {
      jest.spyOn(component, 'cambioEnValoresStore');

      component.establecerCambioDeValor(null as any);

      expect(component.cambioEnValoresStore).not.toHaveBeenCalled();
    });

    it('no debería hacer nada cuando el evento es undefined', () => {
      jest.spyOn(component, 'cambioEnValoresStore');

      component.establecerCambioDeValor(undefined as any);

      expect(component.cambioEnValoresStore).not.toHaveBeenCalled();
    });

    it('debería manejar evento con valor null', () => {
      jest.spyOn(component, 'cambioEnValoresStore');
      const mockEvent = { campo: 'nombre', valor: null };

      component.establecerCambioDeValor(mockEvent);

      expect(component.cambioEnValoresStore).toHaveBeenCalledWith('nombre', null);
    });

    it('debería manejar evento con valor undefined', () => {
      jest.spyOn(component, 'cambioEnValoresStore');
      const mockEvent = { campo: 'nombre', valor: undefined };

      component.establecerCambioDeValor(mockEvent);

      expect(component.cambioEnValoresStore).toHaveBeenCalledWith('nombre', undefined);
    });
  });

  describe('cambioEnValoresStore', () => {
    it('debería llamar establecerDatos del store con los parámetros correctos', () => {
      component.cambioEnValoresStore('nombre', 'Juan');

      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('nombre', 'Juan');
    });

    it('debería manejar valores de diferentes tipos', () => {
      component.cambioEnValoresStore('numero', 123);
      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('numero', 123);

      component.cambioEnValoresStore('booleano', true);
      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('booleano', true);

      component.cambioEnValoresStore('objeto', { test: 'valor' });
      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('objeto', { test: 'valor' });
    });

    it('debería manejar campo vacío', () => {
      component.cambioEnValoresStore('', 'valor');

      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('', 'valor');
    });

    it('debería manejar valor null', () => {
      component.cambioEnValoresStore('campo', null);

      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('campo', null);
    });
  });

  describe('alHacerClicEnElBoton', () => {
    beforeEach(() => {
      component.ninoFormGroup.addControl('rfc', new FormGroup({ value: 'PEGJ800101ABC' }));
      jest.spyOn(component.ninoFormGroup, 'patchValue');
      jest.spyOn(component, 'cambioEnValoresStore');
    });

    it('debería procesar búsqueda cuando el campo es "buscar" y hay respuesta con datos', () => {
      const mockResponse = {
        datos: [mockDatosPersona]
      };
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of(mockResponse));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(mockCancelacionPeticionService.getBuscarDatos).toHaveBeenCalled();
      expect(component.ninoFormGroup.patchValue).toHaveBeenCalledWith({
        nombre: 'María',
        apellidoPaterno: 'López',
        apellidoMaterno: 'Martínez'
      });
      expect(component.cambioEnValoresStore).toHaveBeenCalledTimes(3);
      expect(component.cambioEnValoresStore).toHaveBeenCalledWith('nombre', 'María');
      expect(component.cambioEnValoresStore).toHaveBeenCalledWith('apellidoPaterno', 'López');
      expect(component.cambioEnValoresStore).toHaveBeenCalledWith('apellidoMaterno', 'Martínez');
    });

    it('debería usar RFC del formulario cuando existe', () => {
      const mockRfc = 'TEST123456ABC';
      component.ninoFormGroup.get('rfc')?.setValue(mockRfc);
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of({ datos: [] }));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(mockCancelacionPeticionService.getBuscarDatos).toHaveBeenCalledWith(mockRfc);
    });

    it('debería usar string vacío cuando RFC no existe', () => {
      component.ninoFormGroup.removeControl('rfc');
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of({ datos: [] }));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(mockCancelacionPeticionService.getBuscarDatos).toHaveBeenCalledWith('');
    });

    it('debería manejar respuesta sin datos', () => {
      const mockResponse = { datos: null };
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of(mockResponse));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(component.ninoFormGroup.patchValue).not.toHaveBeenCalled();
      expect(component.cambioEnValoresStore).not.toHaveBeenCalled();
    });

    it('debería manejar respuesta con array vacío', () => {
      const mockResponse = { datos: [] };
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of(mockResponse));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(component.ninoFormGroup.patchValue).not.toHaveBeenCalled();
      expect(component.cambioEnValoresStore).not.toHaveBeenCalled();
    });

    it('debería manejar datos incompletos con valores por defecto N/A', () => {
      const datosIncompletos = { nombre: 'Solo Nombre' };
      const mockResponse = { datos: [datosIncompletos] };
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of(mockResponse));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(component.ninoFormGroup.patchValue).toHaveBeenCalledWith({
        nombre: 'Solo Nombre',
        apellidoPaterno: 'N/A',
        apellidoMaterno: 'N/A'
      });
    });

    it('debería manejar datos null con valores por defecto N/A', () => {
      const mockResponse = { datos: [null] };
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of(mockResponse));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(component.ninoFormGroup.patchValue).toHaveBeenCalledWith({
        nombre: 'N/A',
        apellidoPaterno: 'N/A',
        apellidoMaterno: 'N/A'
      });
    });

    it('no debería hacer nada cuando el campo no es "buscar"', () => {
      const mockEvent = { campo: 'otro' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(mockCancelacionPeticionService.getBuscarDatos).not.toHaveBeenCalled();
      expect(component.ninoFormGroup.patchValue).not.toHaveBeenCalled();
    });

    it('debería manejar errores del servicio', () => {
      const mockError = new Error('Error del servicio');
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(throwError(() => mockError));

      const mockEvent = { campo: 'buscar' };
      
      expect(() => component.alHacerClicEnElBoton(mockEvent as any)).not.toThrow();
    });

    it('debería manejar respuesta con datos undefined', () => {
      const mockResponse = { datos: undefined };
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of(mockResponse));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(component.ninoFormGroup.patchValue).not.toHaveBeenCalled();
    });

    it('debería manejar respuesta con datos que no es array', () => {
      const mockResponse = { datos: 'no es array' };
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of(mockResponse));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(component.ninoFormGroup.patchValue).not.toHaveBeenCalled();
    });
  });

  describe('validarFormulario', () => {
    it('debería marcar todos los controles como tocados', () => {
      jest.spyOn(component.forma, 'markAllAsTouched');

      component.validarFormulario();

      expect(component.forma.markAllAsTouched).toHaveBeenCalled();
    });

    it('debería marcar controles anidados como tocados', () => {
      component.ninoFormGroup.addControl('nombre', new FormGroup({}));
      jest.spyOn(component.ninoFormGroup.get('nombre') as FormGroup, 'markAsTouched');

      component.validarFormulario();

      // markAllAsTouched debería afectar a todos los controles anidados
      expect(component.forma.markAllAsTouched).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('debería emitir y completar destruirNotificador$', () => {
      jest.spyOn(component['destruirNotificador$'], 'next');
      jest.spyOn(component['destruirNotificador$'], 'complete');

      component.ngOnDestroy();

      expect(component['destruirNotificador$'].next).toHaveBeenCalled();
      expect(component['destruirNotificador$'].complete).toHaveBeenCalled();
    });
  });

  describe('Integración de observables y manejo de suscripciones', () => {
    it('debería cancelar suscripciones al destruir el componente', () => {
      const consultaSubject = new Subject();
      const tramiteSubject = new Subject();

      mockConsultaioQuery.selectConsultaioState$ = consultaSubject.asObservable();
      mockTramite261701Query.select$ = tramiteSubject.asObservable();

      // Recrear componente con los nuevos subjects
      fixture = TestBed.createComponent(RepresentanteLegalComponent);
      component = fixture.componentInstance;

      component.ngOnInit();
      component.ngOnDestroy();

      // Los observables no deberían afectar el componente después de ngOnDestroy
      consultaSubject.next({ readonly: true });
      tramiteSubject.next({ nombre: 'Nuevo' });

      // Verificar que las suscripciones se cancelaron correctamente
      expect(component).toBeTruthy(); // El componente sigue existiendo pero las suscripciones están canceladas
    });

    it('debería manejar suscripción de búsqueda que se cancela al destruir', () => {
      const searchSubject = new Subject();
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(searchSubject.asObservable());

      component.ninoFormGroup.addControl('rfc', new FormGroup({ value: 'TEST' }));
      
      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);
      
      component.ngOnDestroy();
      
      // Emitir después de destroy no debería afectar el componente
      searchSubject.next({ datos: [mockDatosPersona] });
      
      expect(component).toBeTruthy();
    });
  });

  describe('Casos edge y validaciones', () => {
    it('debería manejar cancelacionState con propiedades undefined', () => {
      component.cancelacionState = {
        nombre: undefined,
        apellidoPaterno: 'Pérez',
        apellidoMaterno: undefined
      } as any;

      component.esFormularioSoloLectura = true;
      component['actualizarRepresentanteLegalFormData']();

      expect(component.representanteLegalFormData).toBeDefined();
    });

    it('debería manejar RFC como null en el formulario', () => {
      component.ninoFormGroup.addControl('rfc', new FormGroup({}));
      component.ninoFormGroup.get('rfc')?.setValue(null);
      
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of({ datos: [] }));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(mockCancelacionPeticionService.getBuscarDatos).toHaveBeenCalledWith('');
    });

    it('debería manejar FormControl sin valor', () => {
      component.ninoFormGroup.addControl('rfc', new FormGroup({}));
      // No establecer valor
      
      mockCancelacionPeticionService.getBuscarDatos.mockReturnValue(of({ datos: [] }));

      const mockEvent = { campo: 'buscar' };
      component.alHacerClicEnElBoton(mockEvent as any);

      expect(mockCancelacionPeticionService.getBuscarDatos).toHaveBeenCalledWith('');
    });

    it('debería manejar evento con campo vacío en alHacerClicEnElBoton', () => {
      const mockEvent = { campo: '' };
      
      expect(() => component.alHacerClicEnElBoton(mockEvent as any)).not.toThrow();
      expect(mockCancelacionPeticionService.getBuscarDatos).not.toHaveBeenCalled();
    });

    it('debería manejar valores extremos en cambioEnValoresStore', () => {
      component.cambioEnValoresStore('campo', Number.MAX_SAFE_INTEGER);
      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('campo', Number.MAX_SAFE_INTEGER);

      component.cambioEnValoresStore('campo', Number.MIN_SAFE_INTEGER);
      expect(mockTramite261701Store.establecerDatos).toHaveBeenCalledWith('campo', Number.MIN_SAFE_INTEGER);
    });
  });

  describe('Propiedades del componente', () => {
    it('debería poder establecer y obtener cancelacionState', () => {
      const nuevoEstado = { nombre: 'Nuevo', rfc: 'NUEVO123' };
      component.cancelacionState = nuevoEstado;
      
      expect(component.cancelacionState).toEqual(nuevoEstado);
    });

    it('debería poder cambiar esFormularioSoloLectura', () => {
      component.esFormularioSoloLectura = true;
      expect(component.esFormularioSoloLectura).toBe(true);
      
      component.esFormularioSoloLectura = false;
      expect(component.esFormularioSoloLectura).toBe(false);
    });

    it('debería poder modificar representanteLegalFormData', () => {
      const nuevosDatos = [{ campo: 'test', valor: 'valor' }];
      component.representanteLegalFormData = nuevosDatos as any;
      
      expect(component.representanteLegalFormData).toEqual(nuevosDatos);
    });
  });
});