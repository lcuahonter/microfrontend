import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatosDeChoferesExtranjerosDialogComponent } from './data.de.choferes.extranjeros.dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { REGEX_SOLO_DIGITOS } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';

describe('DatosDeChoferesExtranjerosDialogComponent', () => {
	it('should validate form and collect invalid fields in guardarFilaEditada', () => {
		component.formChoferes = component['fb'].group({
			nombre: [{ value: '', disabled: false }, [Validators.required]],
			email: [{ value: 'bademail', disabled: false }, [Validators.email]],
			telefono: [{ value: '', disabled: true }],
			// Se utiliza (!!!) para comprobar que falla la validación del patrón.
			patternField: [{ value: '!!!', disabled: false }, [Validators.pattern(REGEX_SOLO_DIGITOS)]],
		});
		
		let CAMPOS_INVALIDOS: string[] = [];
		jest.spyOn(component.formChoferes, 'markAllAsTouched');
		jest.spyOn(component.formChoferes, 'updateValueAndValidity');
		
		const originalMethod = component.guardarFilaEditada;
		component.guardarFilaEditada = function() {
			this.enviado = true;
			this.formChoferes.markAllAsTouched();
			this.formChoferes.updateValueAndValidity();
			const DATOS_FORMULARIO = this.formChoferes.getRawValue();
			CAMPOS_INVALIDOS = [];
			Object.keys(this.formChoferes.controls).forEach(clave => {
				const CONTROL = this.formChoferes.get(clave);
				if (CONTROL?.disabled) return;
				if (CONTROL?.invalid) {
					if (CONTROL.hasError('required')) {
						CAMPOS_INVALIDOS.push(clave);
					} else if (CONTROL.hasError('pattern') || CONTROL.hasError('email')) {
						CAMPOS_INVALIDOS.push(clave);
					}
				}
			});
		};
		component.guardarFilaEditada();
		expect(component.enviado).toBe(true);
		expect(CAMPOS_INVALIDOS).toContain('nombre');
		expect(CAMPOS_INVALIDOS).toContain('email');
		expect(CAMPOS_INVALIDOS).toContain('patternField');
		expect(CAMPOS_INVALIDOS).not.toContain('telefono');
		
		component.guardarFilaEditada = originalMethod;
	});
	it('should reset the form when limpiarFormulario is called', () => {
		component.formChoferes = component['fb'].group({ numero: ['123'] });
		const resetSpy = jest.spyOn(component.formChoferes, 'reset');
		component.limpiarFormulario();
		expect(resetSpy).toHaveBeenCalled();
	});
	it('should reset notification flags, form state, and emit cancelarEvent on cerrarModal', () => {
		component.formChoferes = component['fb'].group({});
		const markAsUntouchedSpy = jest.spyOn(component.formChoferes, 'markAsUntouched');
		const markAsPristineSpy = jest.spyOn(component.formChoferes, 'markAsPristine');
		const emitSpy = jest.spyOn(component.cancelarEvent, 'emit');
		component.alertaNotificacion = {} as any;
		component.showDigitsOnlyError = true;
		component.showNotification = true;
		component.cerrarModal();
		expect(component.alertaNotificacion).toBeUndefined();
		expect(component.showDigitsOnlyError).toBe(false);
		expect(component.showNotification).toBe(false);
		expect(markAsUntouchedSpy).toHaveBeenCalled();
		expect(markAsPristineSpy).toHaveBeenCalled();
		expect(emitSpy).toHaveBeenCalled();
	});

	it('should call buscarChoferExtranjero if numero length >= 3 in alIngresarNumero', async () => {
		component.formChoferes = component['fb'].group({ numero: ['123'] });
		const buscarSpy = jest.spyOn(component, 'buscarChoferExtranjero');
		component.alIngresarNumero();
		expect(buscarSpy).toHaveBeenCalledWith('123');
	});

	it('should not call buscarChoferExtranjero if numero is missing or too short in alIngresarNumero', async () => {
		component.formChoferes = component['fb'].group({ numero: ['12'] });
		const buscarSpy = jest.spyOn(component, 'buscarChoferExtranjero');
		component.alIngresarNumero();
		expect(buscarSpy).not.toHaveBeenCalled();
		component.formChoferes.get('numero')?.setValue('');
		component.alIngresarNumero();
		expect(buscarSpy).not.toHaveBeenCalled();
	});
	it('should call obtenerEstadosPorPais and reset estado control in alCambiarPais', async () => {
		const pais = { id: 1, descripcion: 'México' } as any;
		component.formChoferes = component['fb'].group({ estado: ['valor'] });
		const resetSpy = jest.spyOn(component.formChoferes.controls['estado'], 'reset');
		const obtenerEstadosPorPaisSpy = jest.spyOn(component as any, 'obtenerEstadosPorPais').mockReturnValue(Promise.resolve([]));
		await component.alCambiarPais(pais);
		expect(obtenerEstadosPorPaisSpy).toHaveBeenCalledWith(pais);
		expect(resetSpy).toHaveBeenCalled();
	});
	it('should call alCambiarPais when paisList is set and not empty', () => {
		const pais = { id: 1, descripcion: 'México' } as any;
		jest.spyOn(component, 'alCambiarPais');
		component.paisList = [pais];
		if (component.paisList.length > 0) {
			component.alCambiarPais(component.paisList[0]);
		}
		expect(component.alCambiarPais).toHaveBeenCalledWith(pais);
	});
	let component: DatosDeChoferesExtranjerosDialogComponent;
	let fixture: ComponentFixture<DatosDeChoferesExtranjerosDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
	imports: [DatosDeChoferesExtranjerosDialogComponent, HttpClientTestingModule],
			declarations: [],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(DatosDeChoferesExtranjerosDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should only allow digits in numeroDelSeguroSocial and show error for non-digits', () => {
		component.formChoferes = component.formChoferes || component['fb'].group({ numeroDelSeguroSocial: [''] });
		const input = document.createElement('input');
		input.value = '12abc34';
		const event = { target: input } as unknown as Event;
		component.enInputSoloDigitos(event);
		expect(input.value).toBe('1234');
		expect(component.formChoferes.get('numeroDelSeguroSocial')?.value).toBe('1234');
		expect(component.showDigitsOnlyError).toBe(true);
	});

	it('should emit eventoAgregarModal with correct data when form is valid', () => {
		component.formChoferes = component['fb'].group({
			nombre: ['Juan', [Validators.required]],
			pais: ['1'],
			estado: ['2'],
			paisDeResidencia: ['1'],
			nacionalidad: ['1'],
			email: ['juan@email.com', [Validators.email]],
			telefono: ['1234567890'],
			patternField: ['123', [Validators.pattern(REGEX_SOLO_DIGITOS)]],
		});
		component.paisList = [{ id: 1, descripcion: 'México' }];
		component.estadoList = [{ id: 2, descripcion: 'CDMX' }];
		component.datosDeChofere = { numero: '999' } as any;
		const emitSpy = jest.spyOn(component.eventoAgregarModal, 'emit');
		component.guardarFilaEditada();
		expect(emitSpy).toHaveBeenCalled();
		const emittedData = emitSpy.mock.calls[0][0];
		expect(emittedData).toBeDefined();
		expect(emittedData?.pais).toBe('México');
		expect(emittedData?.estado).toBe('CDMX');
		expect(emittedData?.numero).toBe('999');
	});

	it('should call mostrarNotificacionErrorValidacion with invalid fields when form is invalid', () => {
		component.formChoferes = component['fb'].group({
			nombre: ['', [Validators.required]],
			pais: [''],
			estado: [''],
			paisDeResidencia: [''],
			nacionalidad: [''],
			email: ['bademail', [Validators.email]],
			telefono: [''],
			patternField: ['!!!', [Validators.pattern(REGEX_SOLO_DIGITOS)]],
		});
		const notifSpy = jest.spyOn(component as any, 'mostrarNotificacionErrorValidacion');
		component.guardarFilaEditada();
		expect(notifSpy).toHaveBeenCalled();
		expect(component.showNotification).toBe(true);
		expect(component.alertaNotificacion).toBeDefined();
		if (component.alertaNotificacion) {
			expect(component.alertaNotificacion.titulo).toBe('Formulario inválido');
		}
	});
});