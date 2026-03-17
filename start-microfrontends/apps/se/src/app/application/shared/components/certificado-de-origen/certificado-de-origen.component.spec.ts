import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoDeOrigenComponent } from './certificado-de-origen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ToastrService, provideToastr } from 'ngx-toastr';

describe('CertificadoDeOrigenComponent', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
        FormBuilder,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #formularioControl', async () => {
    component.formCertificado = component.formCertificado || {};
    component.formCertificado.get = jest.fn();
    const formularioControl = component.formularioControl;
    expect(component.formCertificado.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.formCertificado = component.formCertificado || {};
    component.formCertificadoEvent = component.formCertificadoEvent || {};
    component.formCertificadoEvent.emit = jest.fn();
    component.ngOnInit();
  });

  it('should run #tipoEstadoSeleccion()', async () => {
    component.tipoEstadoSeleccionEvent = component.tipoEstadoSeleccionEvent || {};
    component.tipoEstadoSeleccionEvent.emit = jest.fn();
    component.tipoEstadoSeleccion({ id: 1, descripcion: 'someValue' });
    expect(component.tipoEstadoSeleccionEvent.emit).toHaveBeenCalled();
  });

  it('should run #tipoSeleccion()', async () => {
    component.paisBloquEvent = component.paisBloquEvent || {};
    component.paisBloquEvent.emit = jest.fn();
    component.tipoSeleccion({ id: 1, descripcion: 'someValue' });
    expect(component.paisBloquEvent.emit).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #buscarMercancia()', async () => {
    component.setbuscarMercanciaEvent = component.setbuscarMercanciaEvent || {};
    component.setbuscarMercanciaEvent.emit = jest.fn();
    component.buscarMercancia();
    expect(component.setbuscarMercanciaEvent.emit).toHaveBeenCalled();
  });
});
describe('CertificadoDeOrigenComponent extra logic', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;
  let validarInicialmenteCertificadoServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(() => {
    // Add these additional/fixed tests to your certificado-de-origen.component.spec.ts

    describe('CertificadoDeOrigenComponent additional logic', () => {
      let component: CertificadoDeOrigenComponent;
      let fixture: ComponentFixture<CertificadoDeOrigenComponent>;
      let validarInicialmenteCertificadoServiceMock: any;
      let tramiteStoreMock: any;
      let tramiteQueryMock: any;
      let validacionesServiceMock: any;
      let consultaioQueryMock: any;

      beforeEach(() => {
        validarInicialmenteCertificadoServiceMock = {
          getTratado: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Tratado' }] }) }) }),
          getPaisDestino: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Perú' }] }) }) }),
          getUMC: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'UMC' }] }) }) }),
          getUnidadMedida: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Unidad' }] }) }) }),
          getTipoFactura: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Factura' }] }) }) }),
        };
        tramiteStoreMock = {
          actualizarEstado: jest.fn(),
        };
        tramiteQueryMock = {
          selectSolicitud$: { pipe: () => ({ subscribe: (cb: any) => cb({ mercanciaSeleccionadasTablaData: [], mercanciaDisponsiblesTablaDatos: [] }) }) },
        };
        validacionesServiceMock = {
          isValid: jest.fn().mockReturnValue(true),
        };
        consultaioQueryMock = {
          selectConsultaioState$: { pipe: () => ({ subscribe: (cb: any) => cb({ readonly: false }) }) },
        };

        TestBed.configureTestingModule({
          imports: [FormsModule, ReactiveFormsModule],
          providers: [
            { provide: ValidarInicialmenteCertificadoService, useValue: validarInicialmenteCertificadoServiceMock },
            { provide: Tramite110221Store, useValue: tramiteStoreMock },
            { provide: Tramite110221Query, useValue: tramiteQueryMock },
            { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
            { provide: ConsultaioQuery, useValue: consultaioQueryMock },
            FormBuilder,
          ],
          declarations: [CertificadoDeOrigenComponent],
        }).overrideProvider(ValidarInicialmenteCertificadoService, { useValue: validarInicialmenteCertificadoServiceMock })
          .overrideProvider(Tramite110221Store, { useValue: tramiteStoreMock })
          .overrideProvider(Tramite110221Query, { useValue: tramiteQueryMock })
          .overrideProvider(ValidacionesFormularioService, { useValue: validacionesServiceMock })
          .overrideProvider(ConsultaioQuery, { useValue: consultaioQueryMock })
          .compileComponents();

        fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
        component = fixture.componentInstance;
        component.solicitudState = {
          tercerOperador: '',
          nombres: 'Juan',
          primerApellido: 'Pérez',
          segundoApellido: 'Gómez',
          numeroDeRegistroFiscal: '123456',
          razonSocial: 'Empresa S.A.',
          tratado: 1,
          rangoDeFecha: '',
          pais: 1,
          fraccionArancelaria: '123456',
          numeroRegistro: '789',
          nombreComercial: 'Comercial',
          fechaInicial: '2024-01-01',
          fechaFinal: '2024-12-31',
          archivo: 'archivo.pdf',
          fraccionMercanciaArancelaria: '654321',
          nombreTecnico: 'Tecnico',
          nombreComercialDelaMercancia: 'Mercancia',
          criterioParaConferir: 'A',
          nombreEnIngles: 'Technical',
          cantidad: '10',
          umc: 1,
          valorDelaMercancia: '100.00',
          complementoDelaDescripcion: 'Desc',
          tipoFactura: 1,
          fecha: '2024-06-01',
          numeroFactura: 'F123',
          mercanciaSeleccionadasTablaData: [],
          mercanciaDisponsiblesTablaDatos: [],
        } as any;
        component.donanteDomicilio();
        fixture.detectChanges();
      });

      it('should call ngOnDestroy and complete destroyNotifier$', () => {
        const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
        const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
        component.ngOnDestroy();
        expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
      });

      it('should not throw error if onSubmit called with invalid form', () => {
        component.registroForm.get('validacionForm.nombres')?.setValue('');
        expect(() => component.onSubmit()).not.toThrow();
      });

      it('should not update mercanciaSeleccionadasTablaData if mercanciaForm is invalid in agregar', () => {
        component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('');
        const prevLength = component.mercanciaSeleccionadasTablaData.length;
        component.agregar();
        expect(component.mercanciaSeleccionadasTablaData.length).toBe(prevLength);
      });

      it('should not call actualizarEstado if control does not exist in setValoresStore', () => {
        const storeSpy = jest.spyOn(component.store, 'actualizarEstado');
        component.setValoresStore(component.validacionForm, 'campoInexistente');
        expect(storeSpy).not.toHaveBeenCalled();
      });

      it('should set TEXTO_DE_ALERTA correctly', () => {
        expect(component.TEXTO_DE_ALERTA).toBe('Para continuar con el trámite, debes agregar por lo menos una mercancía.');
      });

      it('should initialize mercanciasHeader and mercanciasBody from getMercanciaTable', () => {
        component.mercanciatable();
        expect(Array.isArray(component.mercanciasHeader)).toBe(true);
        expect(Array.isArray(component.mercanciasBody)).toBe(true);
      });

      it('should have opcionDeBotonDeRadio with correct values', () => {
        expect(component.opcionDeBotonDeRadio.length).toBe(2);
        expect(component.opcionDeBotonDeRadio[0].value).toBe('periodo');
        expect(component.opcionDeBotonDeRadio[1].value).toBe('sola');
      });

      it('should set soloLectura and update form state', () => {
        component.soloLectura = true;
        component.inicializarEstadoFormulario();
        expect(component.registroForm.disabled).toBe(true);
        expect(component.mercanciaForm.disabled).toBe(true);
        component.soloLectura = false;
        component.inicializarEstadoFormulario();
        expect(component.registroForm.enabled).toBe(true);
        expect(component.mercanciaForm.enabled).toBe(true);
      });

      it('should call getTratado, getPais, getUMC, getUnidadMedida, getTipoFactura in buscarMercancias', () => {
        const tratadoSpy = jest.spyOn(component, 'getTratado');
        const paisSpy = jest.spyOn(component, 'getPais');
        const umcSpy = jest.spyOn(component, 'getUMC');
        const unidadSpy = jest.spyOn(component, 'getUnidadMedida');
        const tipoSpy = jest.spyOn(component, 'getTipoFactura');
        component.buscarMercancias();
        expect(tratadoSpy).toHaveBeenCalled();
        expect(paisSpy).toHaveBeenCalled();
        expect(umcSpy).toHaveBeenCalled();
        expect(unidadSpy).toHaveBeenCalled();
        expect(tipoSpy).toHaveBeenCalled();
      });

      it('should call setValoresStore with correct params in cambioFechaInicial', () => {
        const spy = jest.spyOn(component, 'setValoresStore');
        component.cambioFechaInicial('2024-01-05');
        // Mocks for dependencies
        const validarInicialmenteCertificadoServiceMock = {
          getTratado: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Tratado' }] }) }) }),
          getPaisDestino: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Perú' }] }) }) }),
          getUMC: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'UMC' }] }) }) }),
          getUnidadMedida: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Unidad' }] }) }) }),
          getTipoFactura: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Factura' }] }) }) }),
        };
        const tramiteStoreMock = {
          actualizarEstado: jest.fn(),
        };
        const tramiteQueryMock = {
          selectSolicitud$: { pipe: () => ({ subscribe: (cb: any) => cb({ mercanciaSeleccionadasTablaData: [], mercanciaDisponsiblesTablaDatos: [] }) }) },
        };
        const validacionesServiceMock = {
          isValid: jest.fn().mockReturnValue(true),
        };
        const consultaioQueryMock = {
          selectConsultaioState$: { pipe: () => ({ subscribe: (cb: any) => cb({ readonly: false }) }) },
        };

        describe('CertificadoDeOrigenComponent', () => {
          let component: CertificadoDeOrigenComponent;
          let fixture: ComponentFixture<CertificadoDeOrigenComponent>;

          beforeEach(async () => {
            await TestBed.configureTestingModule({
              imports: [FormsModule, ReactiveFormsModule],
              declarations: [CertificadoDeOrigenComponent],
              providers: [
                { provide: 'ValidarInicialmenteCertificadoService', useValue: validarInicialmenteCertificadoServiceMock },
                { provide: 'Tramite110221Store', useValue: tramiteStoreMock },
                { provide: 'Tramite110221Query', useValue: tramiteQueryMock },
                { provide: 'ValidacionesFormularioService', useValue: validacionesServiceMock },
                { provide: 'ConsultaioQuery', useValue: consultaioQueryMock },
                FormBuilder,
              ],
              schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            }).compileComponents();

            fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
            component = fixture.componentInstance;
            // Setup solicitudState for form initialization
            component.solicitudState = {
              tercerOperador: '',
              nombres: 'Juan',
              primerApellido: 'Pérez',
              segundoApellido: 'Gómez',
              numeroDeRegistroFiscal: '123456',
              razonSocial: 'Empresa S.A.',
              tratado: 1,
              rangoDeFecha: '',
              pais: 1,
              fraccionArancelaria: '123456',
              numeroRegistro: '789',
              nombreComercial: 'Comercial',
              fechaInicial: '2024-01-01',
              fechaFinal: '2024-12-31',
              archivo: 'archivo.pdf',
              fraccionMercanciaArancelaria: '654321',
              nombreTecnico: 'Tecnico',
              nombreComercialDelaMercancia: 'Mercancia',
              criterioParaConferir: 'A',
              nombreEnIngles: 'Technical',
              cantidad: '10',
              umc: 1,
              valorDelaMercancia: '100.00',
              complementoDelaDescripcion: 'Desc',
              tipoFactura: 1,
              fecha: '2024-06-01',
              numeroFactura: 'F123',
              mercanciaSeleccionadasTablaData: [],
              mercanciaDisponsiblesTablaDatos: [],
            } as any;
            component.donanteDomicilio();
            fixture.detectChanges();
          });

          it('should create', () => {
            expect(component).toBeTruthy();
          });

          it('should initialize forms with donanteDomicilio', () => {
            expect(component.registroForm).toBeDefined();
            expect(component.mercanciaForm).toBeDefined();
            expect(component.registroForm.get('validacionForm.nombres')?.value).toBe('Juan');
            expect(component.mercanciaForm.get('validacionMercanciaForm.nombreTecnico')?.value).toBe('Tecnico');
          });

          it('should set TEXTO_DE_ALERTA correctly', () => {
            expect(component.TEXTO_DE_ALERTA).toBe('Para continuar con el trámite, debes agregar por lo menos una mercancía.');
          });

          it('should call manejarClic and set esFormulario', () => {
            component.soloLectura = false;
            component.manejarClic();
            expect(component.esFormulario).toBe(true);
            component.soloLectura = true;
            component.manejarClic();
            expect(component.esFormulario).toBe(false);
          });

          it('should validate registroForm in validarDestinatarioFormulario', () => {
            const spy = jest.spyOn(component.registroForm, 'markAllAsTouched');
            component.registroForm.get('validacionForm.nombres')?.setValue('');
            component.validarDestinatarioFormulario();
            expect(spy).toHaveBeenCalled();
          });

          it('should validate mercanciaForm in validarMercanciaForm', () => {
            const spy = jest.spyOn(component.mercanciaForm, 'markAllAsTouched');
            component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanciaArancelaria')?.setValue('');
            component.validarMercanciaForm();
            expect(spy).toHaveBeenCalled();
          });

          it('should patch fechaInicial and call setValoresStore in cambioFechaInicial', () => {
            const spy = jest.spyOn(component, 'setValoresStore');
            component.cambioFechaInicial('2024-01-02');
            expect(component.validacionForm.get('fechaInicial')?.value).toBe('2024-01-02');
            expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaInicial');
          });

          it('should patch rangoDeFecha in radioBotonSeleccionado', () => {
            const event = { target: { value: 'periodo' } } as any;
            component.radioBotonSeleccionado(event);
            expect(component.validacionForm.get('rangoDeFecha')?.value).toBe('periodo');
          });

          it('should patch fechaFinal and call setValoresStore in cambioFechaFinal', () => {
            const spy = jest.spyOn(component, 'setValoresStore');
            component.cambioFechaFinal('2024-12-30');
            expect(component.validacionForm.get('fechaFinal')?.value).toBe('2024-12-30');
            expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaFinal');
          });

          it('should patch fecha in mercanciaForm and call setValoresStore in cambioFechaFactura', () => {
            const spy = jest.spyOn(component, 'setValoresStore');
            component.cambioFechaFactura('2024-06-02');
            expect(component.validacionMercanciaForm.get('fecha')?.value).toBe('2024-06-02');
            expect(spy).toHaveBeenCalledWith(component.validacionMercanciaForm, 'fecha');
          });

          it('should set hayMercanciasDisponibles in buscarMercancias', () => {
            component.registroForm.get('validacionForm.tratado')?.setValue(0);
            component.buscarMercancias();
            expect(component.hayMercanciasDisponibles).toBe(false);
            component.registroForm.get('validacionForm.tratado')?.setValue(1);
            component.buscarMercancias();
            expect(component.hayMercanciasDisponibles).toBe(true);
          });

          it('should set esFormulario and esMercanciaEnEdicion in cancelar', () => {
            component.cancelar();
            expect(component.esFormulario).toBe(false);
            expect(component.esMercanciaEnEdicion).toBe(true);
          });

          it('should call agregar and update mercanciaSeleccionadasTablaData', () => {
            component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('654321');
            component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue('10');
            component.mercanciaForm.get('validacionMercanciaForm.unidadMedida')?.setValue('Unidad');
            component.mercanciaForm.get('validacionMercanciaForm.valordelamercancia')?.setValue('100.00');
            component.mercanciaForm.get('validacionMercanciaForm.tipoFactura')?.setValue('Factura');
            component.mercanciaForm.get('validacionMercanciaForm.numeroFactura')?.setValue('F123');
            component.mercanciaForm.get('validacionMercanciaForm.complementoDelaDescripcion')?.setValue('Desc');
            component.mercanciaForm.get('validacionMercanciaForm.fecha')?.setValue('2024-06-01');
            component.agregar();
            expect(component.esMercanciaEnEdicion).toBe(true);
            expect(component.esFormulario).toBe(false);
            expect(component.mercanciaSeleccionadasTablaData.length).toBeGreaterThanOrEqual(1);
          });

          it('should call modificar and set esFormulario and esMercanciaEnEdicion', () => {
            component.modificar();
            expect(component.esFormulario).toBe(true);
            expect(component.esMercanciaEnEdicion).toBe(false);
          });

          it('should set mercanciasHeader and mercanciasBody in mercanciatable', () => {
            component.mercanciatable();
            expect(component.mercanciasHeader).toBeDefined();
            expect(component.mercanciasBody).toBeDefined();
          });

          it('should set cargarArchivo true in cargaArchivo', () => {
            component.cargarArchivo = false;
            component.cargaArchivo();
            expect(component.cargarArchivo).toBe(true);
          });

          it('should set mostrarErrores true and cargarArchivo false in darError', () => {
            component.mostrarErrores = false;
            component.cargarArchivo = true;
            component.darError();
            expect(component.mostrarErrores).toBe(true);
            expect(component.cargarArchivo).toBe(false);
          });

          it('should call getTratado and set optionsTratado', () => {
            component.getTratado();
            expect(validarInicialmenteCertificadoServiceMock.getTratado).toHaveBeenCalled();
            expect(component.optionsTratado).toEqual([{ id: 1, nombre: 'Tratado' }]);
          });

          it('should call getPais and set optionsPais', () => {
            component.getPais();
            expect(validarInicialmenteCertificadoServiceMock.getPaisDestino).toHaveBeenCalled();
            expect(component.optionsPais).toEqual([{ id: 1, nombre: 'Perú' }]);
          });

          it('should call getUMC and set optionsUMC', () => {
            component.getUMC();
            expect(validarInicialmenteCertificadoServiceMock.getUMC).toHaveBeenCalled();
            expect(component.optionsUMC).toEqual([{ id: 1, nombre: 'UMC' }]);
          });

          it('should call getUnidadMedida and set optionsUnidadMedida', () => {
            component.getUnidadMedida();
            expect(validarInicialmenteCertificadoServiceMock.getUnidadMedida).toHaveBeenCalled();
            expect(component.optionsUnidadMedida).toEqual([{ id: 1, nombre: 'Unidad' }]);
          });

          it('should call getTipoFactura and set optionsTipoFactura', () => {
            component.getTipoFactura();
            expect(validarInicialmenteCertificadoServiceMock.getTipoFactura).toHaveBeenCalled();
            expect(component.optionsTipoFactura).toEqual([{ id: 1, nombre: 'Factura' }]);
          });

          it('should set cargarArchivo false in cerrarAdjuntarArchivoMercancias', () => {
            component.cargarArchivo = true;
            component.cerrarAdjuntarArchivoMercancias();
            expect(component.cargarArchivo).toBe(false);
          });

          it('should set nombreArchivo in alSeleccionarArchivo', () => {
            const file = new File([''], 'testfile.txt');
            const event = { target: { files: [file] } } as any;
            component.alSeleccionarArchivo(event);
            expect(component.nombreArchivo).toBe('testfile.txt');
            const eventNone = { target: { files: [] } } as any;
            component.alSeleccionarArchivo(eventNone);
            expect(component.nombreArchivo).toBe('No se eligió ningún archivo');
          });

          it('should call actualizarEstado in setValoresStore if control has value', () => {
            const form = component.validacionForm;
            form.get('nombres')?.setValue('Nuevo Nombre');
            component.setValoresStore(form, 'nombres');
            expect(tramiteStoreMock.actualizarEstado).toHaveBeenCalledWith({ nombres: 'Nuevo Nombre' });
          });

          it('should not call actualizarEstado in setValoresStore if form is null', () => {
            component.setValoresStore(null, 'nombres');
            expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
          });

          it('should not call actualizarEstado in setValoresStore if control value is null', () => {
            const form = component.validacionForm;
            form.get('nombres')?.setValue(null);
            component.setValoresStore(form, 'nombres');
            expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
          });

          it('should call validacionesService.isValid in isValid', () => {
            component.isValid(component.validacionForm, 'nombres');
            expect(validacionesServiceMock.isValid).toHaveBeenCalled();
          });

          it('should return validacionForm getter', () => {
            expect(component.validacionForm).toBe(component.registroForm.get('validacionForm'));
          });

          it('should return validacionMercanciaForm getter', () => {
            expect(component.validacionMercanciaForm).toBe(component.mercanciaForm.get('validacionMercanciaForm'));
          });

          it('should disable forms and set flags in inicializarEstadoFormulario when soloLectura is true', () => {
            component.soloLectura = true;
            component.inicializarEstadoFormulario();
            expect(component.registroForm.disabled).toBe(true);
            expect(component.mercanciaForm.disabled).toBe(true);
            expect(component.hayMercanciasDisponibles).toBe(true);
            expect(component.esMercanciaEnEdicion).toBe(true);
          });

          it('should enable forms in inicializarEstadoFormulario when soloLectura is false', () => {
            component.soloLectura = false;
            component.inicializarEstadoFormulario();
            expect(component.registroForm.enabled).toBe(true);
            expect(component.mercanciaForm.enabled).toBe(true);
          });

          // Additional edge case tests
          it('should not update mercanciaSeleccionadasTablaData if mercanciaForm is invalid in agregar', () => {
            component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('');
            const prevLength = component.mercanciaSeleccionadasTablaData.length;
            component.agregar();
            expect(component.mercanciaSeleccionadasTablaData.length).toBe(prevLength);
          });

          it('should not throw error if onSubmit called with invalid form', () => {
            component.registroForm.get('validacionForm.nombres')?.setValue('');
            expect(() => component.onSubmit()).not.toThrow();
          });

          it('should call ngOnDestroy and complete destroyNotifier$', () => {
            const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
            const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
            component.ngOnDestroy();
            expect(nextSpy).toHaveBeenCalled();
            expect(completeSpy).toHaveBeenCalled();
          });

          it('should have opcionDeBotonDeRadio with correct values', () => {
            expect(component.opcionDeBotonDeRadio.length).toBe(2);
            expect(component.opcionDeBotonDeRadio[0].value).toBe('periodo');
            expect(component.opcionDeBotonDeRadio[1].value).toBe('sola');
          });

          it('should initialize mercanciasHeader and mercanciasBody from getMercanciaTable', () => {
            component.mercanciatable();
            expect(Array.isArray(component.mercanciasHeader)).toBe(true);
            expect(Array.isArray(component.mercanciasBody)).toBe(true);
          });

          it('should not call actualizarEstado if control does not exist in setValoresStore', () => {
            const storeSpy = jest.spyOn(component.store, 'actualizarEstado');
            component.setValoresStore(component.validacionForm, 'campoInexistente');
            expect(storeSpy).not.toHaveBeenCalled();
          });
        });
        expect(component.validacionForm.get('rangoDeFecha')?.value).toBe('sola');
      });

      it('should set cargarArchivo true in cargaArchivo', () => {
        component.cargarArchivo = false;
        component.cargaArchivo();
        expect(component.cargarArchivo).toBe(true);
      });

      it('should set mostrarErrores true and cargarArchivo false in darError', () => {
        component.mostrarErrores = false;
        component.cargarArchivo = true;
        component.darError();
        expect(component.mostrarErrores).toBe(true);
        expect(component.cargarArchivo).toBe(false);
      });

      it('should set cargarArchivo false in cerrarAdjuntarArchivoMercancias', () => {
        component.cargarArchivo = true;
        component.cerrarAdjuntarArchivoMercancias();
        expect(component.cargarArchivo).toBe(false);
      });

      it('should set nombreArchivo in alSeleccionarArchivo', () => {
        const file = new File([''], 'archivo.txt');
        const event = { target: { files: [file] } } as any;
        component.alSeleccionarArchivo(event);
        expect(component.nombreArchivo).toBe('archivo.txt');
        const eventNone = { target: { files: [] } } as any;
        component.alSeleccionarArchivo(eventNone);
        expect(component.nombreArchivo).toBe('No se eligió ningún archivo');
      });
    });
    component.donanteDomicilio();
    component.mercanciaForm = component.fb.group({
      validacionMercanciaForm: component.fb.group({
        fraccionMercanArancelaria: ['654321'],
        cantidad: ['10'],
        unidadMedida: ['Unidad'],
        valordelamercancia: ['100.00'],
        tipoFactura: ['Factura'],
        numeroFactura: ['F123'],
        complementoDelaDescripcion: ['Desc'],
        fecha: ['2024-06-01'],
      }),
    });
    fixture.detectChanges();
  });

  it('should call manejarClic and set esFormulario', () => {
    component.soloLectura = false;
    component.manejarClic();
    expect(component.esFormulario).toBe(true);
    component.soloLectura = true;
    component.manejarClic();
    expect(component.esFormulario).toBe(false);
  });

  it('should validate registroForm in validarDestinatarioFormulario', () => {
    const spy = jest.spyOn(component.registroForm, 'markAllAsTouched');
    component.registroForm.get('validacionForm.nombres')?.setValue('');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should validate mercanciaForm in validarMercanciaForm', () => {
    const spy = jest.spyOn(component.mercanciaForm, 'markAllAsTouched');
    component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('');
    component.validarMercanciaForm();
    expect(spy).toHaveBeenCalled();
  });

  it('should patch fechaInicial and call setValoresStore in cambioFechaInicial', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaInicial('2024-01-02');
    expect(component.validacionForm.get('fechaInicial')?.value).toBe('2024-01-02');
    expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaInicial');
  });

  it('should patch rangoDeFecha in radioBotonSeleccionado', () => {
    const event = { target: { value: 'periodo' } } as any;
    component.radioBotonSeleccionado(event);
    expect(component.validacionForm.get('rangoDeFecha')?.value).toBe('periodo');
  });

  it('should patch fechaFinal and call setValoresStore in cambioFechaFinal', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaFinal('2024-12-30');
    expect(component.validacionForm.get('fechaFinal')?.value).toBe('2024-12-30');
    expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaFinal');
  });

  it('should patch fecha in mercanciaForm and call setValoresStore in cambioFechaFactura', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaFactura('2024-06-02');
    expect(component.validacionMercanciaForm.get('fecha')?.value).toBe('2024-06-02');
    expect(spy).toHaveBeenCalledWith(component.validacionMercanciaForm, 'fecha');
  });

  it('should set hayMercanciasDisponibles in buscarMercancias', () => {
    component.registroForm.get('validacionForm.tratado')?.setValue(0);
    component.buscarMercancias();
    expect(component.hayMercanciasDisponibles).toBe(false);
    component.registroForm.get('validacionForm.tratado')?.setValue(1);
    component.buscarMercancias();
    expect(component.hayMercanciasDisponibles).toBe(true);
  });

  it('should set esFormulario and esMercanciaEnEdicion in cancelar', () => {
    component.cancelar();
    expect(component.esFormulario).toBe(false);
    expect(component.esMercanciaEnEdicion).toBe(true);
  });

  it('should call agregar and update mercanciaSeleccionadasTablaData', () => {
    component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('654321');
    component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue('10');
    component.mercanciaForm.get('validacionMercanciaForm.unidadMedida')?.setValue('Unidad');
    component.mercanciaForm.get('validacionMercanciaForm.valordelamercancia')?.setValue('100.00');
    component.mercanciaForm.get('validacionMercanciaForm.tipoFactura')?.setValue('Factura');
    component.mercanciaForm.get('validacionMercanciaForm.numeroFactura')?.setValue('F123');
    component.mercanciaForm.get('validacionMercanciaForm.complementoDelaDescripcion')?.setValue('Desc');
    component.mercanciaForm.get('validacionMercanciaForm.fecha')?.setValue('2024-06-01');
    component.agregar();
    expect(component.esMercanciaEnEdicion).toBe(true);
    expect(component.esFormulario).toBe(false);
    expect(component.mercanciaSeleccionadasTablaData.length).toBeGreaterThanOrEqual(1);
  });

  it('should call modificar and set esFormulario and esMercanciaEnEdicion', () => {
    component.modificar();
    expect(component.esFormulario).toBe(true);
    expect(component.esMercanciaEnEdicion).toBe(false);
  });

  it('should set mercanciasHeader and mercanciasBody in mercanciatable', () => {
    component.mercanciatable();
    expect(component.mercanciasHeader).toBeDefined();
    expect(component.mercanciasBody).toBeDefined();
  });

  it('should set cargarArchivo true in cargaArchivo', () => {
    component.cargarArchivo = false;
    component.cargaArchivo();
    expect(component.cargarArchivo).toBe(true);
  });

  it('should set mostrarErrores true and cargarArchivo false in darError', () => {
    component.mostrarErrores = false;
    component.cargarArchivo = true;
    component.darError();
    expect(component.mostrarErrores).toBe(true);
    expect(component.cargarArchivo).toBe(false);
  });

  it('should call getTratado and set optionsTratado', () => {
    component.getTratado();
    expect(validarInicialmenteCertificadoServiceMock.getTratado).toHaveBeenCalled();
    expect(component.optionsTratado).toEqual([{ id: 1, nombre: 'Tratado' }]);
  });

  it('should call getPais and set optionsPais', () => {
    component.getPais();
    expect(validarInicialmenteCertificadoServiceMock.getPaisDestino).toHaveBeenCalled();
    expect(component.optionsPais).toEqual([{ id: 1, nombre: 'Perú' }]);
  });

  it('should call getUMC and set optionsUMC', () => {
    component.getUMC();
    expect(validarInicialmenteCertificadoServiceMock.getUMC).toHaveBeenCalled();
    expect(component.optionsUMC).toEqual([{ id: 1, nombre: 'UMC' }]);
  });

  it('should call getUnidadMedida and set optionsUnidadMedida', () => {
    component.getUnidadMedida();
    expect(validarInicialmenteCertificadoServiceMock.getUnidadMedida).toHaveBeenCalled();
    expect(component.optionsUnidadMedida).toEqual([{ id: 1, nombre: 'Unidad' }]);
  });

  it('should call getTipoFactura and set optionsTipoFactura', () => {
    component.getTipoFactura();
    expect(validarInicialmenteCertificadoServiceMock.getTipoFactura).toHaveBeenCalled();
    expect(component.optionsTipoFactura).toEqual([{ id: 1, nombre: 'Factura' }]);
  });

  it('should set cargarArchivo false in cerrarAdjuntarArchivoMercancias', () => {
    component.cargarArchivo = true;
    component.cerrarAdjuntarArchivoMercancias();
    expect(component.cargarArchivo).toBe(false);
  });

  it('should set nombreArchivo in alSeleccionarArchivo', () => {
    const file = new File([''], 'testfile.txt');
    const event = { target: { files: [file] } } as any;
    component.alSeleccionarArchivo(event);
    expect(component.nombreArchivo).toBe('testfile.txt');
    const eventNone = { target: { files: [] } } as any;
    component.alSeleccionarArchivo(eventNone);
    expect(component.nombreArchivo).toBe('No se eligió ningún archivo');
  });

  it('should call actualizarEstado in setValoresStore if control has value', () => {
    const form = component.validacionForm;
    form.get('nombres')?.setValue('Nuevo Nombre');
    component.setValoresStore(form, 'nombres');
    expect(tramiteStoreMock.actualizarEstado).toHaveBeenCalledWith({ nombres: 'Nuevo Nombre' });
  });

  it('should not call actualizarEstado in setValoresStore if form is null', () => {
    component.setValoresStore(null, 'nombres');
    expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
  });

  it('should not call actualizarEstado in setValoresStore if control value is null', () => {
    const form = component.validacionForm;
    form.get('nombres')?.setValue(null);
    component.setValoresStore(form, 'nombres');
    expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
  });

  it('should call validacionesService.isValid in isValid', () => {
    component.isValid(component.validacionForm, 'nombres');
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
  });

  it('should return validacionForm getter', () => {
    expect(component.validacionForm).toBe(component.registroForm.get('validacionForm'));
  });

  it('should return validacionMercanciaForm getter', () => {
    expect(component.validacionMercanciaForm).toBe(component.mercanciaForm.get('validacionMercanciaForm'));
  });

  it('should disable forms and set flags in inicializarEstadoFormulario', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.registroForm.disabled).toBe(true);
    expect(component.mercanciaForm.disabled).toBe(true);
    expect(component.hayMercanciasDisponibles).toBe(true);
    expect(component.esMercanciaEnEdicion).toBe(true);
  });

  it('should enable forms in inicializarEstadoFormulario', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.registroForm.enabled).toBe(true);
    expect(component.mercanciaForm.enabled).toBe(true);
  });
});
describe('CertificadoDeOrigenComponent public API', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CommonModule],
      declarations: [CertificadoDeOrigenComponent],
      providers: [FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
    component = fixture.componentInstance;
    component.elementosRequeridos = ['entidadFederativa', 'bloque'];
    component.datosForm = { entidadFederativa: 'CDMX', bloque: '1' };
    component.createForm();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formCertificado with createForm()', () => {
    expect(component.formCertificado).toBeDefined();
    expect(component.formCertificado.get('entidadFederativa')).toBeDefined();
  });

  it('should disable formCertificado if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.formCertificado.disabled).toBe(true);
  });

  it('should enable formCertificado if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.formCertificado.enabled).toBe(true);
  });

  it('should update validators for elementosRequeridos in actualizarDatosFormularioSolicitud()', () => {
    component.actualizarDatosFormularioSolicitud();
    expect(component.formCertificado.get('entidadFederativa')?.validator).toBeTruthy();
    expect(component.formCertificado.get('bloque')?.validator).toBeTruthy();
  });

  it('should emit tipoEstadoSeleccionEvent in tipoEstadoSeleccion()', () => {
    const spy = jest.spyOn(component.tipoEstadoSeleccionEvent, 'emit');
    const estado = { id: 1, descripcion: 'Estado' } as any;
    component.tipoEstadoSeleccion(estado);
    expect(spy).toHaveBeenCalledWith(estado);
  });

  it('should emit paisBloquEvent in tipoSeleccion()', () => {
    const spy = jest.spyOn(component.paisBloquEvent, 'emit');
    const estado = { id: 2, descripcion: 'Bloque' } as any;
    component.tipoSeleccion(estado);
    expect(spy).toHaveBeenCalledWith(estado);
  });

  it('should call inicializarEstadoFormulario on ngOnInit()', () => {
    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy()', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should emit setbuscarMercanciaEvent on buscarMercancia()', () => {
    const spy = jest.spyOn(component.setbuscarMercanciaEvent, 'emit');
    component.buscarMercancia();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should set value and emit events in cambioFechaInicio()', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaInicio('2024-01-01');
    expect(component.formCertificado.get('fechaInicioInput')?.value).toBe('2024-01-01');
    expect(setValoresStoreSpy).toHaveBeenCalledWith('formCertificado', 'fechaInicioInput', '2024-01-01');
  });

  it('should set value and emit events in cambioFechaFinal()', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaFinal('2024-12-31');
    expect(component.formCertificado.get('fechaFinalInput')?.value).toBe('2024-12-31');
    expect(setValoresStoreSpy).toHaveBeenCalledWith('formCertificado', 'fechaFinalInput', '2024-12-31');
  });

  it('should emit filaClics in abrirModificarModal()', () => {
    const spy = jest.spyOn(component.filaClics, 'emit');
    const mercancia = { id: '1' } as any;
    component.abrirModificarModal(mercancia);
    expect(spy).toHaveBeenCalledWith(mercancia);
  });

  it('should emit filaClics in abrirModal()', () => {
    const spy = jest.spyOn(component.filaClics, 'emit');
    const mercancia = { id: '2' } as any;
    component.abrirModal(mercancia);
    expect(spy).toHaveBeenCalledWith(mercancia);
  });

  it('should set seleccionadaguardarClicado in obtenerSeleccionadoMercancia()', () => {
    const mercancia = { id: '3' } as any;
    component.obtenerSeleccionadoMercancia(mercancia);
    expect(component.seleccionadaguardarClicado).toEqual([mercancia]);
  });

  it('should clear guardarClicado in eliminarSeleccionados() if seleccionadaguardarClicado has items', () => {
    component.seleccionadaguardarClicado = [{ id: '4' } as any];
    component.guardarClicado = [{ id: '4' } as any];
    component.eliminarSeleccionados();
    expect(component.guardarClicado).toEqual([]);
  });

  it('should not clear guardarClicado in eliminarSeleccionados() if seleccionadaguardarClicado is empty', () => {
    component.seleccionadaguardarClicado = [];
    component.guardarClicado = [{ id: '5' } as any];
    component.eliminarSeleccionados();
    expect(component.guardarClicado).toEqual([{ id: '5' }]);
  });

  it('should emit formaValida and formCertificadoEvent in setValoresStore()', () => {
    const formaValidaSpy = jest.spyOn(component.formaValida, 'emit');
    const formCertificadoEventSpy = jest.spyOn(component.formCertificadoEvent, 'emit');
    component.formCertificado.get('entidadFederativa')?.setValue('CDMX');
    component.setValoresStore('formCertificado', 'entidadFederativa', 'CDMX');
    expect(formaValidaSpy).toHaveBeenCalledWith(component.formCertificado.valid);
    expect(formCertificadoEventSpy).toHaveBeenCalledWith({
      formGroupName: 'formCertificado',
      campo: 'entidadFederativa',
      valor: 'CDMX',
      storeStateName: 'CDMX',
    });
  });

  it('should return formularioControl getter', () => {
    expect(component.formularioControl).toBe(component.formCertificado.get(''));
  });

  it('should initialize fechaInicioInput and fechaFinalInput', () => {
    expect(component.fechaInicioInput).toEqual(FECHA_INICIO);
    expect(component.fechaFinalInput).toEqual(FECHA_FINAL);
  });

  it('should have default title', () => {
    expect(component.title).toBe('Validación inicial del certificado de circulación de mercancías');
  });

  it('should have TEXTOS property', () => {
    expect(component.TEXTOS).toBe(TEXTOS_REQUISITOS);
  });

  it('should have configuracionTabla arrays defined', () => {
    expect(Array.isArray(component.configuracionTabla)).toBe(true);
    expect(Array.isArray(component.configuracionTablaMercancia)).toBe(true);
    expect(Array.isArray(component.configuracionTablaMercanciaDisponible)).toBe(true);
    expect(Array.isArray(component.cargaMercanciaConfiguracionTabla)).toBe(true);
  });
});
describe('CertificadoDeOrigenComponent extra logic', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;
  let validarInicialmenteCertificadoServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(() => {
    // Add these additional/fixed tests to your certificado-de-origen.component.spec.ts

    describe('CertificadoDeOrigenComponent additional logic', () => {
      let component: CertificadoDeOrigenComponent;
      let fixture: ComponentFixture<CertificadoDeOrigenComponent>;
      let validarInicialmenteCertificadoServiceMock: any;
      let tramiteStoreMock: any;
      let tramiteQueryMock: any;
      let validacionesServiceMock: any;
      let consultaioQueryMock: any;

      beforeEach(() => {
        validarInicialmenteCertificadoServiceMock = {
          getTratado: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Tratado' }] }) }) }),
          getPaisDestino: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Perú' }] }) }) }),
          getUMC: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'UMC' }] }) }) }),
          getUnidadMedida: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Unidad' }] }) }) }),
          getTipoFactura: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Factura' }] }) }) }),
        };
        tramiteStoreMock = {
          actualizarEstado: jest.fn(),
        };
        tramiteQueryMock = {
          selectSolicitud$: { pipe: () => ({ subscribe: (cb: any) => cb({ mercanciaSeleccionadasTablaData: [], mercanciaDisponsiblesTablaDatos: [] }) }) },
        };
        validacionesServiceMock = {
          isValid: jest.fn().mockReturnValue(true),
        };
        consultaioQueryMock = {
          selectConsultaioState$: { pipe: () => ({ subscribe: (cb: any) => cb({ readonly: false }) }) },
        };

        TestBed.configureTestingModule({
          imports: [FormsModule, ReactiveFormsModule],
          providers: [
            { provide: ValidarInicialmenteCertificadoService, useValue: validarInicialmenteCertificadoServiceMock },
            { provide: Tramite110221Store, useValue: tramiteStoreMock },
            { provide: Tramite110221Query, useValue: tramiteQueryMock },
            { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
            { provide: ConsultaioQuery, useValue: consultaioQueryMock },
            FormBuilder,
          ],
          declarations: [CertificadoDeOrigenComponent],
        }).overrideProvider(ValidarInicialmenteCertificadoService, { useValue: validarInicialmenteCertificadoServiceMock })
          .overrideProvider(Tramite110221Store, { useValue: tramiteStoreMock })
          .overrideProvider(Tramite110221Query, { useValue: tramiteQueryMock })
          .overrideProvider(ValidacionesFormularioService, { useValue: validacionesServiceMock })
          .overrideProvider(ConsultaioQuery, { useValue: consultaioQueryMock })
          .compileComponents();

        fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
        component = fixture.componentInstance;
        component.solicitudState = {
          tercerOperador: '',
          nombres: 'Juan',
          primerApellido: 'Pérez',
          segundoApellido: 'Gómez',
          numeroDeRegistroFiscal: '123456',
          razonSocial: 'Empresa S.A.',
          tratado: 1,
          rangoDeFecha: '',
          pais: 1,
          fraccionArancelaria: '123456',
          numeroRegistro: '789',
          nombreComercial: 'Comercial',
          fechaInicial: '2024-01-01',
          fechaFinal: '2024-12-31',
          archivo: 'archivo.pdf',
          fraccionMercanciaArancelaria: '654321',
          nombreTecnico: 'Tecnico',
          nombreComercialDelaMercancia: 'Mercancia',
          criterioParaConferir: 'A',
          nombreEnIngles: 'Technical',
          cantidad: '10',
          umc: 1,
          valorDelaMercancia: '100.00',
          complementoDelaDescripcion: 'Desc',
          tipoFactura: 1,
          fecha: '2024-06-01',
          numeroFactura: 'F123',
          mercanciaSeleccionadasTablaData: [],
          mercanciaDisponsiblesTablaDatos: [],
        } as any;
        component.donanteDomicilio();
        fixture.detectChanges();
      });

      it('should call ngOnDestroy and complete destroyNotifier$', () => {
        const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
        const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
        component.ngOnDestroy();
        expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
      });

      it('should not throw error if onSubmit called with invalid form', () => {
        component.registroForm.get('validacionForm.nombres')?.setValue('');
        expect(() => component.onSubmit()).not.toThrow();
      });

      it('should not update mercanciaSeleccionadasTablaData if mercanciaForm is invalid in agregar', () => {
        component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('');
        const prevLength = component.mercanciaSeleccionadasTablaData.length;
        component.agregar();
        expect(component.mercanciaSeleccionadasTablaData.length).toBe(prevLength);
      });

      it('should not call actualizarEstado if control does not exist in setValoresStore', () => {
        const storeSpy = jest.spyOn(component.store, 'actualizarEstado');
        component.setValoresStore(component.validacionForm, 'campoInexistente');
        expect(storeSpy).not.toHaveBeenCalled();
      });

      it('should set TEXTO_DE_ALERTA correctly', () => {
        expect(component.TEXTO_DE_ALERTA).toBe('Para continuar con el trámite, debes agregar por lo menos una mercancía.');
      });

      it('should initialize mercanciasHeader and mercanciasBody from getMercanciaTable', () => {
        component.mercanciatable();
        expect(Array.isArray(component.mercanciasHeader)).toBe(true);
        expect(Array.isArray(component.mercanciasBody)).toBe(true);
      });

      it('should have opcionDeBotonDeRadio with correct values', () => {
        expect(component.opcionDeBotonDeRadio.length).toBe(2);
        expect(component.opcionDeBotonDeRadio[0].value).toBe('periodo');
        expect(component.opcionDeBotonDeRadio[1].value).toBe('sola');
      });

      it('should set soloLectura and update form state', () => {
        component.soloLectura = true;
        component.inicializarEstadoFormulario();
        expect(component.registroForm.disabled).toBe(true);
        expect(component.mercanciaForm.disabled).toBe(true);
        component.soloLectura = false;
        component.inicializarEstadoFormulario();
        expect(component.registroForm.enabled).toBe(true);
        expect(component.mercanciaForm.enabled).toBe(true);
      });

      it('should call getTratado, getPais, getUMC, getUnidadMedida, getTipoFactura in buscarMercancias', () => {
        const tratadoSpy = jest.spyOn(component, 'getTratado');
        const paisSpy = jest.spyOn(component, 'getPais');
        const umcSpy = jest.spyOn(component, 'getUMC');
        const unidadSpy = jest.spyOn(component, 'getUnidadMedida');
        const tipoSpy = jest.spyOn(component, 'getTipoFactura');
        component.buscarMercancias();
        expect(tratadoSpy).toHaveBeenCalled();
        expect(paisSpy).toHaveBeenCalled();
        expect(umcSpy).toHaveBeenCalled();
        expect(unidadSpy).toHaveBeenCalled();
        expect(tipoSpy).toHaveBeenCalled();
      });

      it('should call setValoresStore with correct params in cambioFechaInicial', () => {
        const spy = jest.spyOn(component, 'setValoresStore');
        component.cambioFechaInicial('2024-01-05');
        // Mocks for dependencies
        const validarInicialmenteCertificadoServiceMock = {
          getTratado: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Tratado' }] }) }) }),
          getPaisDestino: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Perú' }] }) }) }),
          getUMC: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'UMC' }] }) }) }),
          getUnidadMedida: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Unidad' }] }) }) }),
          getTipoFactura: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (cb: any) => cb({ code: 200, data: [{ id: 1, nombre: 'Factura' }] }) }) }),
        };
        const tramiteStoreMock = {
          actualizarEstado: jest.fn(),
        };
        const tramiteQueryMock = {
          selectSolicitud$: { pipe: () => ({ subscribe: (cb: any) => cb({ mercanciaSeleccionadasTablaData: [], mercanciaDisponsiblesTablaDatos: [] }) }) },
        };
        const validacionesServiceMock = {
          isValid: jest.fn().mockReturnValue(true),
        };
        const consultaioQueryMock = {
          selectConsultaioState$: { pipe: () => ({ subscribe: (cb: any) => cb({ readonly: false }) }) },
        };

        describe('CertificadoDeOrigenComponent', () => {
          let component: CertificadoDeOrigenComponent;
          let fixture: ComponentFixture<CertificadoDeOrigenComponent>;

          beforeEach(async () => {
            await TestBed.configureTestingModule({
              imports: [FormsModule, ReactiveFormsModule],
              declarations: [CertificadoDeOrigenComponent],
              providers: [
                { provide: 'ValidarInicialmenteCertificadoService', useValue: validarInicialmenteCertificadoServiceMock },
                { provide: 'Tramite110221Store', useValue: tramiteStoreMock },
                { provide: 'Tramite110221Query', useValue: tramiteQueryMock },
                { provide: 'ValidacionesFormularioService', useValue: validacionesServiceMock },
                { provide: 'ConsultaioQuery', useValue: consultaioQueryMock },
                FormBuilder,
              ],
              schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            }).compileComponents();

            fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
            component = fixture.componentInstance;
            // Setup solicitudState for form initialization
            component.solicitudState = {
              tercerOperador: '',
              nombres: 'Juan',
              primerApellido: 'Pérez',
              segundoApellido: 'Gómez',
              numeroDeRegistroFiscal: '123456',
              razonSocial: 'Empresa S.A.',
              tratado: 1,
              rangoDeFecha: '',
              pais: 1,
              fraccionArancelaria: '123456',
              numeroRegistro: '789',
              nombreComercial: 'Comercial',
              fechaInicial: '2024-01-01',
              fechaFinal: '2024-12-31',
              archivo: 'archivo.pdf',
              fraccionMercanciaArancelaria: '654321',
              nombreTecnico: 'Tecnico',
              nombreComercialDelaMercancia: 'Mercancia',
              criterioParaConferir: 'A',
              nombreEnIngles: 'Technical',
              cantidad: '10',
              umc: 1,
              valorDelaMercancia: '100.00',
              complementoDelaDescripcion: 'Desc',
              tipoFactura: 1,
              fecha: '2024-06-01',
              numeroFactura: 'F123',
              mercanciaSeleccionadasTablaData: [],
              mercanciaDisponsiblesTablaDatos: [],
            } as any;
            component.donanteDomicilio();
            fixture.detectChanges();
          });

          it('should create', () => {
            expect(component).toBeTruthy();
          });

          it('should initialize forms with donanteDomicilio', () => {
            expect(component.registroForm).toBeDefined();
            expect(component.mercanciaForm).toBeDefined();
            expect(component.registroForm.get('validacionForm.nombres')?.value).toBe('Juan');
            expect(component.mercanciaForm.get('validacionMercanciaForm.nombreTecnico')?.value).toBe('Tecnico');
          });

          it('should set TEXTO_DE_ALERTA correctly', () => {
            expect(component.TEXTO_DE_ALERTA).toBe('Para continuar con el trámite, debes agregar por lo menos una mercancía.');
          });

          it('should call manejarClic and set esFormulario', () => {
            component.soloLectura = false;
            component.manejarClic();
            expect(component.esFormulario).toBe(true);
            component.soloLectura = true;
            component.manejarClic();
            expect(component.esFormulario).toBe(false);
          });

          it('should validate registroForm in validarDestinatarioFormulario', () => {
            const spy = jest.spyOn(component.registroForm, 'markAllAsTouched');
            component.registroForm.get('validacionForm.nombres')?.setValue('');
            component.validarDestinatarioFormulario();
            expect(spy).toHaveBeenCalled();
          });

          it('should validate mercanciaForm in validarMercanciaForm', () => {
            const spy = jest.spyOn(component.mercanciaForm, 'markAllAsTouched');
            component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanciaArancelaria')?.setValue('');
            component.validarMercanciaForm();
            expect(spy).toHaveBeenCalled();
          });

          it('should patch fechaInicial and call setValoresStore in cambioFechaInicial', () => {
            const spy = jest.spyOn(component, 'setValoresStore');
            component.cambioFechaInicial('2024-01-02');
            expect(component.validacionForm.get('fechaInicial')?.value).toBe('2024-01-02');
            expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaInicial');
          });

          it('should patch rangoDeFecha in radioBotonSeleccionado', () => {
            const event = { target: { value: 'periodo' } } as any;
            component.radioBotonSeleccionado(event);
            expect(component.validacionForm.get('rangoDeFecha')?.value).toBe('periodo');
          });

          it('should patch fechaFinal and call setValoresStore in cambioFechaFinal', () => {
            const spy = jest.spyOn(component, 'setValoresStore');
            component.cambioFechaFinal('2024-12-30');
            expect(component.validacionForm.get('fechaFinal')?.value).toBe('2024-12-30');
            expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaFinal');
          });

          it('should patch fecha in mercanciaForm and call setValoresStore in cambioFechaFactura', () => {
            const spy = jest.spyOn(component, 'setValoresStore');
            component.cambioFechaFactura('2024-06-02');
            expect(component.validacionMercanciaForm.get('fecha')?.value).toBe('2024-06-02');
            expect(spy).toHaveBeenCalledWith(component.validacionMercanciaForm, 'fecha');
          });

          it('should set hayMercanciasDisponibles in buscarMercancias', () => {
            component.registroForm.get('validacionForm.tratado')?.setValue(0);
            component.buscarMercancias();
            expect(component.hayMercanciasDisponibles).toBe(false);
            component.registroForm.get('validacionForm.tratado')?.setValue(1);
            component.buscarMercancias();
            expect(component.hayMercanciasDisponibles).toBe(true);
          });

          it('should set esFormulario and esMercanciaEnEdicion in cancelar', () => {
            component.cancelar();
            expect(component.esFormulario).toBe(false);
            expect(component.esMercanciaEnEdicion).toBe(true);
          });

          it('should call agregar and update mercanciaSeleccionadasTablaData', () => {
            component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('654321');
            component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue('10');
            component.mercanciaForm.get('validacionMercanciaForm.unidadMedida')?.setValue('Unidad');
            component.mercanciaForm.get('validacionMercanciaForm.valordelamercancia')?.setValue('100.00');
            component.mercanciaForm.get('validacionMercanciaForm.tipoFactura')?.setValue('Factura');
            component.mercanciaForm.get('validacionMercanciaForm.numeroFactura')?.setValue('F123');
            component.mercanciaForm.get('validacionMercanciaForm.complementoDelaDescripcion')?.setValue('Desc');
            component.mercanciaForm.get('validacionMercanciaForm.fecha')?.setValue('2024-06-01');
            component.agregar();
            expect(component.esMercanciaEnEdicion).toBe(true);
            expect(component.esFormulario).toBe(false);
            expect(component.mercanciaSeleccionadasTablaData.length).toBeGreaterThanOrEqual(1);
          });

          it('should call modificar and set esFormulario and esMercanciaEnEdicion', () => {
            component.modificar();
            expect(component.esFormulario).toBe(true);
            expect(component.esMercanciaEnEdicion).toBe(false);
          });

          it('should set mercanciasHeader and mercanciasBody in mercanciatable', () => {
            component.mercanciatable();
            expect(component.mercanciasHeader).toBeDefined();
            expect(component.mercanciasBody).toBeDefined();
          });

          it('should set cargarArchivo true in cargaArchivo', () => {
            component.cargarArchivo = false;
            component.cargaArchivo();
            expect(component.cargarArchivo).toBe(true);
          });

          it('should set mostrarErrores true and cargarArchivo false in darError', () => {
            component.mostrarErrores = false;
            component.cargarArchivo = true;
            component.darError();
            expect(component.mostrarErrores).toBe(true);
            expect(component.cargarArchivo).toBe(false);
          });

          it('should call getTratado and set optionsTratado', () => {
            component.getTratado();
            expect(validarInicialmenteCertificadoServiceMock.getTratado).toHaveBeenCalled();
            expect(component.optionsTratado).toEqual([{ id: 1, nombre: 'Tratado' }]);
          });

          it('should call getPais and set optionsPais', () => {
            component.getPais();
            expect(validarInicialmenteCertificadoServiceMock.getPaisDestino).toHaveBeenCalled();
            expect(component.optionsPais).toEqual([{ id: 1, nombre: 'Perú' }]);
          });

          it('should call getUMC and set optionsUMC', () => {
            component.getUMC();
            expect(validarInicialmenteCertificadoServiceMock.getUMC).toHaveBeenCalled();
            expect(component.optionsUMC).toEqual([{ id: 1, nombre: 'UMC' }]);
          });

          it('should call getUnidadMedida and set optionsUnidadMedida', () => {
            component.getUnidadMedida();
            expect(validarInicialmenteCertificadoServiceMock.getUnidadMedida).toHaveBeenCalled();
            expect(component.optionsUnidadMedida).toEqual([{ id: 1, nombre: 'Unidad' }]);
          });

          it('should call getTipoFactura and set optionsTipoFactura', () => {
            component.getTipoFactura();
            expect(validarInicialmenteCertificadoServiceMock.getTipoFactura).toHaveBeenCalled();
            expect(component.optionsTipoFactura).toEqual([{ id: 1, nombre: 'Factura' }]);
          });

          it('should set cargarArchivo false in cerrarAdjuntarArchivoMercancias', () => {
            component.cargarArchivo = true;
            component.cerrarAdjuntarArchivoMercancias();
            expect(component.cargarArchivo).toBe(false);
          });

          it('should set nombreArchivo in alSeleccionarArchivo', () => {
            const file = new File([''], 'testfile.txt');
            const event = { target: { files: [file] } } as any;
            component.alSeleccionarArchivo(event);
            expect(component.nombreArchivo).toBe('testfile.txt');
            const eventNone = { target: { files: [] } } as any;
            component.alSeleccionarArchivo(eventNone);
            expect(component.nombreArchivo).toBe('No se eligió ningún archivo');
          });

          it('should call actualizarEstado in setValoresStore if control has value', () => {
            const form = component.validacionForm;
            form.get('nombres')?.setValue('Nuevo Nombre');
            component.setValoresStore(form, 'nombres');
            expect(tramiteStoreMock.actualizarEstado).toHaveBeenCalledWith({ nombres: 'Nuevo Nombre' });
          });

          it('should not call actualizarEstado in setValoresStore if form is null', () => {
            component.setValoresStore(null, 'nombres');
            expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
          });

          it('should not call actualizarEstado in setValoresStore if control value is null', () => {
            const form = component.validacionForm;
            form.get('nombres')?.setValue(null);
            component.setValoresStore(form, 'nombres');
            expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
          });

          it('should call validacionesService.isValid in isValid', () => {
            component.isValid(component.validacionForm, 'nombres');
            expect(validacionesServiceMock.isValid).toHaveBeenCalled();
          });

          it('should return validacionForm getter', () => {
            expect(component.validacionForm).toBe(component.registroForm.get('validacionForm'));
          });

          it('should return validacionMercanciaForm getter', () => {
            expect(component.validacionMercanciaForm).toBe(component.mercanciaForm.get('validacionMercanciaForm'));
          });

          it('should disable forms and set flags in inicializarEstadoFormulario when soloLectura is true', () => {
            component.soloLectura = true;
            component.inicializarEstadoFormulario();
            expect(component.registroForm.disabled).toBe(true);
            expect(component.mercanciaForm.disabled).toBe(true);
            expect(component.hayMercanciasDisponibles).toBe(true);
            expect(component.esMercanciaEnEdicion).toBe(true);
          });

          it('should enable forms in inicializarEstadoFormulario when soloLectura is false', () => {
            component.soloLectura = false;
            component.inicializarEstadoFormulario();
            expect(component.registroForm.enabled).toBe(true);
            expect(component.mercanciaForm.enabled).toBe(true);
          });

          // Additional edge case tests
          it('should not update mercanciaSeleccionadasTablaData if mercanciaForm is invalid in agregar', () => {
            component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('');
            const prevLength = component.mercanciaSeleccionadasTablaData.length;
            component.agregar();
            expect(component.mercanciaSeleccionadasTablaData.length).toBe(prevLength);
          });

          it('should not throw error if onSubmit called with invalid form', () => {
            component.registroForm.get('validacionForm.nombres')?.setValue('');
            expect(() => component.onSubmit()).not.toThrow();
          });

          it('should call ngOnDestroy and complete destroyNotifier$', () => {
            const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
            const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
            component.ngOnDestroy();
            expect(nextSpy).toHaveBeenCalled();
            expect(completeSpy).toHaveBeenCalled();
          });

          it('should have opcionDeBotonDeRadio with correct values', () => {
            expect(component.opcionDeBotonDeRadio.length).toBe(2);
            expect(component.opcionDeBotonDeRadio[0].value).toBe('periodo');
            expect(component.opcionDeBotonDeRadio[1].value).toBe('sola');
          });

          it('should initialize mercanciasHeader and mercanciasBody from getMercanciaTable', () => {
            component.mercanciatable();
            expect(Array.isArray(component.mercanciasHeader)).toBe(true);
            expect(Array.isArray(component.mercanciasBody)).toBe(true);
          });

          it('should not call actualizarEstado if control does not exist in setValoresStore', () => {
            const storeSpy = jest.spyOn(component.store, 'actualizarEstado');
            component.setValoresStore(component.validacionForm, 'campoInexistente');
            expect(storeSpy).not.toHaveBeenCalled();
          });
        });
        expect(component.validacionForm.get('rangoDeFecha')?.value).toBe('sola');
      });

      it('should set cargarArchivo true in cargaArchivo', () => {
        component.cargarArchivo = false;
        component.cargaArchivo();
        expect(component.cargarArchivo).toBe(true);
      });

      it('should set mostrarErrores true and cargarArchivo false in darError', () => {
        component.mostrarErrores = false;
        component.cargarArchivo = true;
        component.darError();
        expect(component.mostrarErrores).toBe(true);
        expect(component.cargarArchivo).toBe(false);
      });

      it('should set cargarArchivo false in cerrarAdjuntarArchivoMercancias', () => {
        component.cargarArchivo = true;
        component.cerrarAdjuntarArchivoMercancias();
        expect(component.cargarArchivo).toBe(false);
      });

      it('should set nombreArchivo in alSeleccionarArchivo', () => {
        const file = new File([''], 'archivo.txt');
        const event = { target: { files: [file] } } as any;
        component.alSeleccionarArchivo(event);
        expect(component.nombreArchivo).toBe('archivo.txt');
        const eventNone = { target: { files: [] } } as any;
        component.alSeleccionarArchivo(eventNone);
        expect(component.nombreArchivo).toBe('No se eligió ningún archivo');
      });
    });
    component.donanteDomicilio();
    component.mercanciaForm = component.fb.group({
      validacionMercanciaForm: component.fb.group({
        fraccionMercanArancelaria: ['654321'],
        cantidad: ['10'],
        unidadMedida: ['Unidad'],
        valordelamercancia: ['100.00'],
        tipoFactura: ['Factura'],
        numeroFactura: ['F123'],
        complementoDelaDescripcion: ['Desc'],
        fecha: ['2024-06-01'],
      }),
    });
    fixture.detectChanges();
  });

  it('should call manejarClic and set esFormulario', () => {
    component.soloLectura = false;
    component.manejarClic();
    expect(component.esFormulario).toBe(true);
    component.soloLectura = true;
    component.manejarClic();
    expect(component.esFormulario).toBe(false);
  });

  it('should validate registroForm in validarDestinatarioFormulario', () => {
    const spy = jest.spyOn(component.registroForm, 'markAllAsTouched');
    component.registroForm.get('validacionForm.nombres')?.setValue('');
    component.validarDestinatarioFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should validate mercanciaForm in validarMercanciaForm', () => {
    const spy = jest.spyOn(component.mercanciaForm, 'markAllAsTouched');
    component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('');
    component.validarMercanciaForm();
    expect(spy).toHaveBeenCalled();
  });

  it('should patch fechaInicial and call setValoresStore in cambioFechaInicial', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaInicial('2024-01-02');
    expect(component.validacionForm.get('fechaInicial')?.value).toBe('2024-01-02');
    expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaInicial');
  });

  it('should patch rangoDeFecha in radioBotonSeleccionado', () => {
    const event = { target: { value: 'periodo' } } as any;
    component.radioBotonSeleccionado(event);
    expect(component.validacionForm.get('rangoDeFecha')?.value).toBe('periodo');
  });

  it('should patch fechaFinal and call setValoresStore in cambioFechaFinal', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaFinal('2024-12-30');
    expect(component.validacionForm.get('fechaFinal')?.value).toBe('2024-12-30');
    expect(spy).toHaveBeenCalledWith(component.validacionForm, 'fechaFinal');
  });

  it('should patch fecha in mercanciaForm and call setValoresStore in cambioFechaFactura', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaFactura('2024-06-02');
    expect(component.validacionMercanciaForm.get('fecha')?.value).toBe('2024-06-02');
    expect(spy).toHaveBeenCalledWith(component.validacionMercanciaForm, 'fecha');
  });

  it('should set hayMercanciasDisponibles in buscarMercancias', () => {
    component.registroForm.get('validacionForm.tratado')?.setValue(0);
    component.buscarMercancias();
    expect(component.hayMercanciasDisponibles).toBe(false);
    component.registroForm.get('validacionForm.tratado')?.setValue(1);
    component.buscarMercancias();
    expect(component.hayMercanciasDisponibles).toBe(true);
  });

  it('should set esFormulario and esMercanciaEnEdicion in cancelar', () => {
    component.cancelar();
    expect(component.esFormulario).toBe(false);
    expect(component.esMercanciaEnEdicion).toBe(true);
  });

  it('should call agregar and update mercanciaSeleccionadasTablaData', () => {
    component.mercanciaForm.get('validacionMercanciaForm.fraccionMercanArancelaria')?.setValue('654321');
    component.mercanciaForm.get('validacionMercanciaForm.cantidad')?.setValue('10');
    component.mercanciaForm.get('validacionMercanciaForm.unidadMedida')?.setValue('Unidad');
    component.mercanciaForm.get('validacionMercanciaForm.valordelamercancia')?.setValue('100.00');
    component.mercanciaForm.get('validacionMercanciaForm.tipoFactura')?.setValue('Factura');
    component.mercanciaForm.get('validacionMercanciaForm.numeroFactura')?.setValue('F123');
    component.mercanciaForm.get('validacionMercanciaForm.complementoDelaDescripcion')?.setValue('Desc');
    component.mercanciaForm.get('validacionMercanciaForm.fecha')?.setValue('2024-06-01');
    component.agregar();
    expect(component.esMercanciaEnEdicion).toBe(true);
    expect(component.esFormulario).toBe(false);
    expect(component.mercanciaSeleccionadasTablaData.length).toBeGreaterThanOrEqual(1);
  });

  it('should call modificar and set esFormulario and esMercanciaEnEdicion', () => {
    component.modificar();
    expect(component.esFormulario).toBe(true);
    expect(component.esMercanciaEnEdicion).toBe(false);
  });

  it('should set mercanciasHeader and mercanciasBody in mercanciatable', () => {
    component.mercanciatable();
    expect(component.mercanciasHeader).toBeDefined();
    expect(component.mercanciasBody).toBeDefined();
  });

  it('should set cargarArchivo true in cargaArchivo', () => {
    component.cargarArchivo = false;
    component.cargaArchivo();
    expect(component.cargarArchivo).toBe(true);
  });

  it('should set mostrarErrores true and cargarArchivo false in darError', () => {
    component.mostrarErrores = false;
    component.cargarArchivo = true;
    component.darError();
    expect(component.mostrarErrores).toBe(true);
    expect(component.cargarArchivo).toBe(false);
  });

  it('should call getTratado and set optionsTratado', () => {
    component.getTratado();
    expect(validarInicialmenteCertificadoServiceMock.getTratado).toHaveBeenCalled();
    expect(component.optionsTratado).toEqual([{ id: 1, nombre: 'Tratado' }]);
  });

  it('should call getPais and set optionsPais', () => {
    component.getPais();
    expect(validarInicialmenteCertificadoServiceMock.getPaisDestino).toHaveBeenCalled();
    expect(component.optionsPais).toEqual([{ id: 1, nombre: 'Perú' }]);
  });

  it('should call getUMC and set optionsUMC', () => {
    component.getUMC();
    expect(validarInicialmenteCertificadoServiceMock.getUMC).toHaveBeenCalled();
    expect(component.optionsUMC).toEqual([{ id: 1, nombre: 'UMC' }]);
  });

  it('should call getUnidadMedida and set optionsUnidadMedida', () => {
    component.getUnidadMedida();
    expect(validarInicialmenteCertificadoServiceMock.getUnidadMedida).toHaveBeenCalled();
    expect(component.optionsUnidadMedida).toEqual([{ id: 1, nombre: 'Unidad' }]);
  });

  it('should call getTipoFactura and set optionsTipoFactura', () => {
    component.getTipoFactura();
    expect(validarInicialmenteCertificadoServiceMock.getTipoFactura).toHaveBeenCalled();
    expect(component.optionsTipoFactura).toEqual([{ id: 1, nombre: 'Factura' }]);
  });

  it('should set cargarArchivo false in cerrarAdjuntarArchivoMercancias', () => {
    component.cargarArchivo = true;
    component.cerrarAdjuntarArchivoMercancias();
    expect(component.cargarArchivo).toBe(false);
  });

  it('should set nombreArchivo in alSeleccionarArchivo', () => {
    const file = new File([''], 'testfile.txt');
    const event = { target: { files: [file] } } as any;
    component.alSeleccionarArchivo(event);
    expect(component.nombreArchivo).toBe('testfile.txt');
    const eventNone = { target: { files: [] } } as any;
    component.alSeleccionarArchivo(eventNone);
    expect(component.nombreArchivo).toBe('No se eligió ningún archivo');
  });

  it('should call actualizarEstado in setValoresStore if control has value', () => {
    const form = component.validacionForm;
    form.get('nombres')?.setValue('Nuevo Nombre');
    component.setValoresStore(form, 'nombres');
    expect(tramiteStoreMock.actualizarEstado).toHaveBeenCalledWith({ nombres: 'Nuevo Nombre' });
  });

  it('should not call actualizarEstado in setValoresStore if form is null', () => {
    component.setValoresStore(null, 'nombres');
    expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
  });

  it('should not call actualizarEstado in setValoresStore if control value is null', () => {
    const form = component.validacionForm;
    form.get('nombres')?.setValue(null);
    component.setValoresStore(form, 'nombres');
    expect(tramiteStoreMock.actualizarEstado).not.toHaveBeenCalled();
  });

  it('should call validacionesService.isValid in isValid', () => {
    component.isValid(component.validacionForm, 'nombres');
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
  });

  it('should return validacionForm getter', () => {
    expect(component.validacionForm).toBe(component.registroForm.get('validacionForm'));
  });

  it('should return validacionMercanciaForm getter', () => {
    expect(component.validacionMercanciaForm).toBe(component.mercanciaForm.get('validacionMercanciaForm'));
  });

  it('should disable forms and set flags in inicializarEstadoFormulario', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.registroForm.disabled).toBe(true);
    expect(component.mercanciaForm.disabled).toBe(true);
    expect(component.hayMercanciasDisponibles).toBe(true);
    expect(component.esMercanciaEnEdicion).toBe(true);
  });

  it('should enable forms in inicializarEstadoFormulario', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.registroForm.enabled).toBe(true);
    expect(component.mercanciaForm.enabled).toBe(true);
  });
});
describe('CertificadoDeOrigenComponent public API', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CommonModule],
      declarations: [CertificadoDeOrigenComponent],
      providers: [FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
    component = fixture.componentInstance;
    component.elementosRequeridos = ['entidadFederativa', 'bloque'];
    component.datosForm = { entidadFederativa: 'CDMX', bloque: '1' };
    component.createForm();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formCertificado with createForm()', () => {
    expect(component.formCertificado).toBeDefined();
    expect(component.formCertificado.get('entidadFederativa')).toBeDefined();
  });

  it('should disable formCertificado if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.formCertificado.disabled).toBe(true);
  });

  it('should enable formCertificado if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.formCertificado.enabled).toBe(true);
  });

  it('should update validators for elementosRequeridos in actualizarDatosFormularioSolicitud()', () => {
    component.actualizarDatosFormularioSolicitud();
    expect(component.formCertificado.get('entidadFederativa')?.validator).toBeTruthy();
    expect(component.formCertificado.get('bloque')?.validator).toBeTruthy();
  });

  it('should emit tipoEstadoSeleccionEvent in tipoEstadoSeleccion()', () => {
    const spy = jest.spyOn(component.tipoEstadoSeleccionEvent, 'emit');
    const estado = { id: 1, descripcion: 'Estado' } as any;
    component.tipoEstadoSeleccion(estado);
    expect(spy).toHaveBeenCalledWith(estado);
  });

  it('should emit paisBloquEvent in tipoSeleccion()', () => {
    const spy = jest.spyOn(component.paisBloquEvent, 'emit');
    const estado = { id: 2, descripcion: 'Bloque' } as any;
    component.tipoSeleccion(estado);
    expect(spy).toHaveBeenCalledWith(estado);
  });

  it('should call inicializarEstadoFormulario on ngOnInit()', () => {
    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy()', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should emit setbuscarMercanciaEvent on buscarMercancia()', () => {
    const spy = jest.spyOn(component.setbuscarMercanciaEvent, 'emit');
    component.buscarMercancia();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should set value and emit events in cambioFechaInicio()', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaInicio('2024-01-01');
    expect(component.formCertificado.get('fechaInicioInput')?.value).toBe('2024-01-01');
    expect(setValoresStoreSpy).toHaveBeenCalledWith('formCertificado', 'fechaInicioInput', '2024-01-01');
  });

  it('should set value and emit events in cambioFechaFinal()', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaFinal('2024-12-31');
    expect(component.formCertificado.get('fechaFinalInput')?.value).toBe('2024-12-31');
    expect(setValoresStoreSpy).toHaveBeenCalledWith('formCertificado', 'fechaFinalInput', '2024-12-31');
  });

  it('should emit filaClics in abrirModificarModal()', () => {
    const spy = jest.spyOn(component.filaClics, 'emit');
    const mercancia = { id: '1' } as any;
    component.abrirModificarModal(mercancia);
    expect(spy).toHaveBeenCalledWith(mercancia);
  });

  it('should emit filaClics in abrirModal()', () => {
    const spy = jest.spyOn(component.filaClics, 'emit');
    const mercancia = { id: '2' } as any;
    component.abrirModal(mercancia);
    expect(spy).toHaveBeenCalledWith(mercancia);
  });

  it('should set seleccionadaguardarClicado in obtenerSeleccionadoMercancia()', () => {
    const mercancia = { id: '3' } as any;
    component.obtenerSeleccionadoMercancia(mercancia);
    expect(component.seleccionadaguardarClicado).toEqual([mercancia]);
  });

  it('should clear guardarClicado in eliminarSeleccionados() if seleccionadaguardarClicado has items', () => {
    component.seleccionadaguardarClicado = [{ id: '4' } as any];
    component.guardarClicado = [{ id: '4' } as any];
    component.eliminarSeleccionados();
    expect(component.guardarClicado).toEqual([]);
  });

  it('should not clear guardarClicado in eliminarSeleccionados() if seleccionadaguardarClicado is empty', () => {
    component.seleccionadaguardarClicado = [];
    component.guardarClicado = [{ id: '5' } as any];
    component.eliminarSeleccionados();
    expect(component.guardarClicado).toEqual([{ id: '5' }]);
  });

  it('should emit formaValida and formCertificadoEvent in setValoresStore()', () => {
    const formaValidaSpy = jest.spyOn(component.formaValida, 'emit');
    const formCertificadoEventSpy = jest.spyOn(component.formCertificadoEvent, 'emit');
    component.formCertificado.get('entidadFederativa')?.setValue('CDMX');
    component.setValoresStore('formCertificado', 'entidadFederativa', 'CDMX');
    expect(formaValidaSpy).toHaveBeenCalledWith(component.formCertificado.valid);
    expect(formCertificadoEventSpy).toHaveBeenCalledWith({
      formGroupName: 'formCertificado',
      campo: 'entidadFederativa',
      valor: 'CDMX',
      storeStateName: 'CDMX',
    });
  });

  it('should return formularioControl getter', () => {
    expect(component.formularioControl).toBe(component.formCertificado.get(''));
  });

  it('should initialize fechaInicioInput and fechaFinalInput', () => {
    expect(component.fechaInicioInput).toEqual(FECHA_INICIO);
    expect(component.fechaFinalInput).toEqual(FECHA_FINAL);
  });

  it('should have default title', () => {
    expect(component.title).toBe('Validación inicial del certificado de circulación de mercancías');
  });

  it('should have TEXTOS property', () => {
    expect(component.TEXTOS).toBe(TEXTOS_REQUISITOS);
  });

  it('should have configuracionTabla arrays defined', () => {
    expect(Array.isArray(component.configuracionTabla)).toBe(true);
    expect(Array.isArray(component.configuracionTablaMercancia)).toBe(true);
    expect(Array.isArray(component.configuracionTablaMercanciaDisponible)).toBe(true);
    expect(Array.isArray(component.cargaMercanciaConfiguracionTabla)).toBe(true);
  });
});


