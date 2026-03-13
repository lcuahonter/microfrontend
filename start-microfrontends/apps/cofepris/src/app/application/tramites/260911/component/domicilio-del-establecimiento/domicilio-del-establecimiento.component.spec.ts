import { DomicilioDelEstablecimientoService } from '../../services/domicilio-del-establecimiento/domicilio-del-establecimiento.service';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';

import { Tramite260911Query } from '../../estados/tramite260911.query';
import { Tramite260911Store } from '../../estados/tramite260911.store';
import { Location } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MERCANCIAS_DATA, NICO_TABLA, MercanciasInfo, NicoInfo } from '../../models/modificación-del-permiso-sanitario-de-importación-de-insumo.model';
import { DomicilioDelEstablecimientoComponent } from './domicilio-del-establecimiento.component';


describe('DomicilioDelEstablecimiento260911Component', () => {
	let component: DomicilioDelEstablecimientoComponent;
	let fixture: ComponentFixture<DomicilioDelEstablecimientoComponent>;
	let serviceSpy: jest.Mocked<DomicilioDelEstablecimientoService>;
	let querySpy: jest.Mocked<Tramite260911Query>;
	let storeSpy: jest.Mocked<Tramite260911Store>;
	let consultaioQuerySpy: jest.Mocked<ConsultaioQuery>;
	let locationSpy: jest.Mocked<Location>;

	beforeEach(async () => {
		serviceSpy = {
			obtenerTablaDatos: jest.fn().mockReturnValue(of({ code: 200, data: [], message: '' })),
			obtenerEstadoList: jest.fn().mockReturnValue(of({ code: 200, data: [], message: '' })),
			obtenerMercanciasDatos: jest.fn().mockReturnValue(of({ code: 200, data: [], message: '' })),
			getEntidad: jest.fn().mockReturnValue(of([])),
			getRepresentacion: jest.fn().mockReturnValue(of([])),
			buscarRepresentanteLegalPorRFC: jest.fn().mockReturnValue(of({})),
		} as any;
		const dummyTramite260911$ = of({});
		querySpy = {
			selectTramite260911$: dummyTramite260911$,
		} as any;
		storeSpy = {
			setTramite260911State: jest.fn(),
		} as any;
		consultaioQuerySpy = {
			selectConsultaioState$: of({ readonly: false }),
		} as any;
		locationSpy = {
			back: jest.fn(),
		} as any;

		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				DomicilioDelEstablecimientoComponent,
				HttpClientTestingModule
			],
			declarations: [

			],
			providers: [
				{ provide: DomicilioDelEstablecimientoService, useValue: serviceSpy },
				{ provide: Tramite260911Query, useValue: querySpy },
				{ provide: Tramite260911Store, useValue: storeSpy },
				{ provide: ConsultaioQuery, useValue: consultaioQuerySpy },
				{ provide: Location, useValue: locationSpy },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(DomicilioDelEstablecimientoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize forms and call service methods on ngOnInit', () => {
		serviceSpy.getEntidad.mockReturnValue(of([]));
		serviceSpy.getRepresentacion.mockReturnValue(of([]));
		serviceSpy.obtenerTablaDatos.mockReturnValue(of({ code: 200, data: [], message: '' }));
		serviceSpy.obtenerEstadoList.mockReturnValue(of({ code: 200, data: [], message: '' }));
		serviceSpy.obtenerMercanciasDatos.mockReturnValue(of({ code: 200, data: [], message: '' }));
		component.ngOnInit();
		expect(serviceSpy.getEntidad).toHaveBeenCalled();
		expect(serviceSpy.getRepresentacion).toHaveBeenCalled();
		expect(serviceSpy.obtenerTablaDatos).toHaveBeenCalled();
		expect(serviceSpy.obtenerEstadoList).toHaveBeenCalled();
		expect(serviceSpy.obtenerMercanciasDatos).toHaveBeenCalled();
	});

	it('should destroy subscriptions on ngOnDestroy', () => {
		const nextSpy = jest.spyOn(component['destroy$'], 'next');
		const completeSpy = jest.spyOn(component['destroy$'], 'complete');
		component.ngOnDestroy();
		expect(nextSpy).toHaveBeenCalled();
		expect(completeSpy).toHaveBeenCalled();
	});

	it('should create forms in crearFormulario', () => {
		component.solicitudState = {
			codigoPostal: '12345',
			estado: null,
			municipioOAlcaldia: 'test',
			localidad: '',
			colonias: '',
			calle: '',
			lada: '',
			telefono: '',
			entidad: null,
			representacion: null,
			licenciaSanitaria: '',
			regimen: null,
			aduanasEntradas: null,
			importPermitNumberCNSNS: '',
			acuerdoPublico: '',
			rfc: '',
			nombre: '',
			apellidoPaterno: '',
			apellidoMaterno: '',
			avisoCheckbox: '',
			aifaCheckbox: '',
			manifests: '',
			justificacion: '',
			btonDeRadio: '',
			rfcDel: '',
			denominacion: '',
			correo: '',
			claveDeReferencia: '',
			cadenaPagoDependencia: '',
			clave: '',
			llaveDePago: '',
			fecPago: '',
			impPago: '',
			fabricanteTablaDatos: [],
			proveedorTablaDatos: [],
			destinatarioFinalTablaDatos: [],
			facturadorTablaDatos: [],
			scianConfigDatos: [],
			claveScianModal: '',
			claveDescripcionModal: '',
			fabricanteTablaModificaDatos: [],
		};
		component.crearFormulario();
		expect(component.form).toBeDefined();
		expect(component.nicoTablaForm).toBeDefined();
		expect(component.domicilio).toBeDefined();
		expect(component.representanteLegal).toBeDefined();
	});

	it('should handle onBuscarRepresentanteLegal logic', () => {
		component.crearFormulario();
		const rfcControl = component.representanteLegal.get('rfc');
		rfcControl?.setValue('');
		rfcControl?.markAsTouched();
		rfcControl?.setErrors({ invalid: true });
		component.onBuscarRepresentanteLegal();
		expect(component.enableLegalFields).toBeTruthy();
		rfcControl?.setValue('validRFC');
		rfcControl?.setErrors(null);
		component.onBuscarRepresentanteLegal();
		expect(component.enableLegalFields).toBeFalsy();
	});

	it('should set value in store with setValorStore', () => {
		component.crearFormulario();
		component.form.get('codigoPostal')?.setValue('99999');
		component.setValorStore(component.form, 'codigoPostal');
		expect(storeSpy.setTramite260911State).toHaveBeenCalledWith({ codigoPostal: '99999' });
	});

	it('should mark manifests as touched and update store on onManifestsChange', () => {
		component.crearFormulario();
		component.onManifestsChange();
		expect(component.domicilio.get('manifests')?.touched).toBeTruthy();
		expect(storeSpy.setTramite260911State).toHaveBeenCalled();
	});

	it('should handle input events and set errors for form controls', () => {
		component.crearFormulario();
		const event = { target: { value: '123456789012' } } as any;
		component.onCodigoPostalInput(event);
		expect(component.form.get('codigoPostal')?.errors).toBeTruthy();
		component.onMunicipioOAlcaldiaInput({ target: { value: 'a'.repeat(120) } } as any);
		expect(component.form.get('municipioOAlcaldia')?.errors).toBeTruthy();
		component.onLocalidadInput({ target: { value: 'a'.repeat(121) } } as any);
		expect(component.form.get('localidad')?.errors).toBeTruthy();
		component.onColoniasInput({ target: { value: 'a'.repeat(120) } } as any);
		expect(component.form.get('colonias')?.errors).toBeTruthy();
		component.onCalleInput({ target: { value: 'a'.repeat(100) } } as any);
		expect(component.form.get('calle')?.errors).toBeTruthy();
		component.onLadaInput({ target: { value: '12345' } } as any);
		expect(component.form.get('lada')?.errors).toBeTruthy();
		component.onTelefonoInput({ target: { value: '1'.repeat(30) } } as any);
		expect(component.form.get('telefono')?.errors).toBeTruthy();
		component.onRfcInput({ target: { value: '1'.repeat(13) } } as any);
		expect(component.representanteLegal.get('rfc')?.errors).toBeTruthy();
	});

	it('should handle Mercancia row selection and modification', () => {
		component.mercanciasTablaDatos = [
			{
				clasificacion: '', especificar: '', denominacionEspecifica: '', denominacionDistintiva: '', denominacionComun: '',
				formaFarmaceutica: '', estadoFisico: '', fraccionArancelaria: '', descripcionFraccion: '', unidad: '', cantidadUMC: '',
				unidadUMT: '', cantidadUMT: '', presentacion: '', numeroRegistro: '', paisDeOrigen: '', paisDeProcedencia: '',
				tipoProducto: '', usoEspecifico: '', fechaCaducidad: ''
			},
			{
				clasificacion: '', especificar: '', denominacionEspecifica: '', denominacionDistintiva: '', denominacionComun: '',
				formaFarmaceutica: '', estadoFisico: '', fraccionArancelaria: '', descripcionFraccion: '', unidad: '', cantidadUMC: '',
				unidadUMT: '', cantidadUMT: '', presentacion: '', numeroRegistro: '', paisDeOrigen: '', paisDeProcedencia: '',
				tipoProducto: '', usoEspecifico: '', fechaCaducidad: ''
			}
		];
		component.onMercanciaRowSelected([component.mercanciasTablaDatos[1]]);
		expect(component.selectedMercanciaIndex).toBe(1);
		component.onMercanciaRowSelected([]);
		expect(component.selectedMercanciaIndex).toBeNull();
		// onAgregarMercancia add
		component.selectedMercanciaIndex = null;
		component.mercanciasTablaDatos = [];
		component.onAgregarMercancia({} as MercanciasInfo);
		expect(component.mercanciasTablaDatos.length).toBe(1);
		// onAgregarMercancia update
		component.selectedMercanciaIndex = 0;
		component.onAgregarMercancia({ test: true } as any);
		expect(component.mercanciasTablaDatos[0]).toEqual({ test: true });
	});

	it('should handle Mercancia modal logic', () => {
		component['modalSeleccionaRegistroMercanciaInstance'] = {
			hide: jest.fn(),
			toggle: jest.fn(),
			show: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component.cerrarSeleccionaRegistroMercanciaModal();
		expect(component['modalSeleccionaRegistroMercanciaInstance'].hide).toHaveBeenCalled();
		// mostrarSeleccionaRegistroMercancia
		jest.spyOn(document, 'getElementById').mockReturnValue({} as any);
		(window as any).bootstrap = { Modal: function () { return { show: jest.fn() }; } };
		component.mostrarSeleccionaRegistroMercancia();
		// onModificarMercancia
		component.mercanciasTablaDatos = [{}, {}] as MercanciasInfo[];
		component.datosMercanciaContenedoraComp = { mercanciaForm: { patchValue: jest.fn() } } as any;
		component.onModificarMercancia(0);
		expect(component.selectedMercanciaIndex).toBe(0);
	});

	it('should handle Mercancia delete logic', () => {
		component.mercanciaEliminarIndex = 0;
		component.mercanciasTablaDatos = [{}, {}] as MercanciasInfo[];
		component['modalConfirmarEliminarMercanciaInstance'] = {
			hide: jest.fn(),
			toggle: jest.fn(),
			show: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component.aceptarEliminarMercancia();
		expect(component.mercanciasTablaDatos.length).toBe(1);
		component.cancelarEliminarMercancia();
		expect(component['modalConfirmarEliminarMercanciaInstance'].hide).toHaveBeenCalled();
	});

	it('should handle SCIAN row selection and delete logic', () => {
		component.nicoTablaDatos = [
			{ clave_Scian: '', descripcion_Scian: '' },
			{ clave_Scian: '', descripcion_Scian: '' }
		];
		component.onScianRowSelected([component.nicoTablaDatos[1]]);
		expect(component.selectedScianIndex).toBe(1);
		component.onScianRowSelected([]);
		expect(component.selectedScianIndex).toBeNull();
		// onEliminarScian
		component['modalSeleccionaRegistroInstance'] = {
			show: jest.fn(),
			hide: jest.fn(),
			toggle: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component.onEliminarScian(null);
		expect(component['modalSeleccionaRegistroInstance'].show).toHaveBeenCalled();
		component['modalConfirmarEliminarScianInstance'] = {
			show: jest.fn(),
			hide: jest.fn(),
			toggle: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component.onEliminarScian(1);
		expect(component['modalConfirmarEliminarScianInstance'].show).toHaveBeenCalled();
		// aceptarEliminarScian
		component.selectedScianIndex = 0;
		component['modalConfirmarEliminarScianInstance'] = {
			hide: jest.fn(),
			show: jest.fn(),
			toggle: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component.aceptarEliminarScian();
		expect(component.nicoTablaDatos.length).toBe(1);
		expect(component['modalConfirmarEliminarScianInstance'].hide).toHaveBeenCalled();
	});

	it('should update representacion options', () => {
		component.allRepresentaciones = [{ id: 1, relacionadaUmtId: 2 }, { id: 2, relacionadaUmtId: 2 }] as any;
		component.updateRepresentacionOptions(2 as any);
		expect(component.representacion.length).toBeGreaterThan(0);
		component.updateRepresentacionOptions(null);
		expect(component.representacion.length).toBe(0);
	});

	it('should check esInvalido', () => {
		component.crearFormulario();

		const entidadControl = component.nicoTablaForm.get('entidad');
		expect(entidadControl).toBeTruthy();

		entidadControl?.setValue('');
		entidadControl?.markAsTouched();
		entidadControl?.setErrors({ required: true });
		fixture.detectChanges();

		expect(component.esInvalido('entidad')).toBe(false);
	});

	it('should add and clear SCIAN', () => {
		component.crearFormulario();
		component.entidad = [{ id: 1, descripcion: 'Entidad' } as any];
		component.subRepresentacion = [{ id: 2, descripcion: 'Rep' } as any];
		component.nicoTablaForm.get('entidad')?.setValue(1);
		component.nicoTablaForm.get('representacion')?.setValue(2);
		component['bootstrapModalNicoTablaInstance'] = {
			hide: jest.fn(),
			show: jest.fn(),
			toggle: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component.agregarScian();
		expect(component.nicoTablaDatos.length).toBeGreaterThan(0);
		component.limpiarScian();
		expect(component.nicoTablaForm.get('entidad')?.value).toBeNull();
	});

	it('should cancel modals', () => {
		component['bootstrapModalNicoTablaInstance'] = {
			hide: jest.fn(),
			show: jest.fn(),
			toggle: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component['bootstrapModalMercanciasInstance'] = {
			hide: jest.fn(),
			show: jest.fn(),
			toggle: jest.fn(),
			handleUpdate: jest.fn(),
			dispose: jest.fn()
		};
		component.cancelar(true);
		expect(component['bootstrapModalNicoTablaInstance'].hide).toHaveBeenCalled();
		component.cancelar(false);
		expect(component['bootstrapModalMercanciasInstance'].hide).toHaveBeenCalled();
	});

	it('should map MercanciasInfo to MercanciaForm and get empty MercanciaForm', () => {
		const info: MercanciasInfo = {
			clasificacion: 'A', especificar: 'B', denominacionEspecifica: 'C', denominacionDistintiva: 'D', denominacionComun: 'E',
			tipoProducto: 'F', formaFarmaceutica: 'G', estadoFisico: 'H', fraccionArancelaria: 'I', descripcionFraccion: 'J',
			unidadUMT: 'K', cantidadUMT: 'L', unidad: 'M', cantidadUMC: 'N', presentacion: 'O', numeroRegistro: 'P',
			fechaCaducidad: 'Q', paisDeOrigen: 'R', paisDeProcedencia: 'S', usoEspecifico: 'T'
		};
		const form = DomicilioDelEstablecimientoComponent.mapMercanciasInfoToForm(info);
		expect(form.clasificacionProducto).toBe('A');
		expect(DomicilioDelEstablecimientoComponent.getEmptyMercanciaForm()).toBeDefined();
	});
});
