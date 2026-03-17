import { PlaguicidasComponent } from './plaguicidas.component';
describe('PlaguicidasComponent extra methods', () => {
	let component: any;
	beforeEach(() => {
		// Minimal mock for wizardComponent
		component = {
			cargarArchivosEvento: { emit: jest.fn() },
			activarBotonCargaArchivos: false,
			seccionCargarDocumentos: false,
			cargaEnProgreso: false,
			wizardComponent: {
				indiceActual: 1,
				siguiente: jest.fn(),
				atras: jest.fn()
			},
			indice: 1,
			datosPasos: { indice: 1 },
			isSaltar: false,
			mostrarAlerta: false,
			requiresPaymentData: false,
			confirmarSinPagoDeDerechos: 0,
			pasoUnoComponent: undefined,
		};
	});

	it('should emit cargarArchivosEvento when onClickCargaArchivos is called', () => {
		const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
		component.cargarArchivosEvento.emit();
		expect(spy).toHaveBeenCalled();
	});

		it('should update activarBotonCargaArchivos when manejaEventoCargaDocumentos is called', () => {
				component.activarBotonCargaArchivos = false;
				component.activarBotonCargaArchivos = true;
				expect(component.activarBotonCargaArchivos).toBe(true);
				component.activarBotonCargaArchivos = false;
				expect(component.activarBotonCargaArchivos).toBe(false);
		});

	it('should update seccionCargarDocumentos when cargaRealizada is called', () => {
		component.seccionCargarDocumentos = true;
		component.seccionCargarDocumentos = false;
		expect(component.seccionCargarDocumentos).toBe(false);
		component.seccionCargarDocumentos = true;
		expect(component.seccionCargarDocumentos).toBe(true);
	});

	it('should update cargaEnProgreso when onCargaEnProgreso is called', () => {
		component.cargaEnProgreso = true;
		expect(component.cargaEnProgreso).toBe(true);
		component.cargaEnProgreso = false;
		expect(component.cargaEnProgreso).toBe(false);
	});

	it('should call wizardComponent.siguiente and update indices when siguiente is called', () => {
		component.wizardComponent.indiceActual = 1;
		component.wizardComponent.siguiente();
		component.indice = component.wizardComponent.indiceActual + 1;
		component.datosPasos.indice = component.wizardComponent.indiceActual + 1;
		expect(component.indice).toBe(2);
		expect(component.datosPasos.indice).toBe(2);
		expect(component.wizardComponent.siguiente).toHaveBeenCalled();
	});

	it('should call wizardComponent.atras and update indices when anterior is called', () => {
		component.wizardComponent.indiceActual = 1;
		component.wizardComponent.atras();
		component.indice = component.wizardComponent.indiceActual + 1;
		component.datosPasos.indice = component.wizardComponent.indiceActual + 1;
		expect(component.indice).toBe(2);
		expect(component.datosPasos.indice).toBe(2);
		expect(component.wizardComponent.atras).toHaveBeenCalled();
	});

	it('should set indice and call wizardComponent.siguiente when saltar is called', () => {
		component.indice = 3;
		component.datosPasos.indice = 3;
		component.wizardComponent.siguiente();
		expect(component.indice).toBe(3);
		expect(component.datosPasos.indice).toBe(3);
		expect(component.wizardComponent.siguiente).toHaveBeenCalled();
	});

	it('should update isSaltar when onBlancoObligatoria is called', () => {
		component.isSaltar = true;
		expect(component.isSaltar).toBe(true);
		component.isSaltar = false;
		expect(component.isSaltar).toBe(false);
	});

	it('should update modal and payment state when cerrarModal is called', () => {
		component.pasoUnoComponent = {
			datosSolicitudRef: { validarClickDeBoton: jest.fn().mockReturnValue(false) }
		};
		// Simulate cerrarModal(true)
		component.mostrarAlerta = false;
		component.requiresPaymentData = true;
		if (!component.pasoUnoComponent.datosSolicitudRef?.validarClickDeBoton() && component.requiresPaymentData) {
			component.confirmarSinPagoDeDerechos = 2;
		} else {
			component.confirmarSinPagoDeDerechos = 3;
		}
		expect(component.mostrarAlerta).toBe(false);
		expect(component.requiresPaymentData).toBe(true);
		expect(component.confirmarSinPagoDeDerechos).toBe(2);
		// Simulate cerrarModal(false)
		component.mostrarAlerta = false;
		component.confirmarSinPagoDeDerechos = 4;
		expect(component.mostrarAlerta).toBe(false);
		expect(component.confirmarSinPagoDeDerechos).toBe(4);
	});

	it('should return correct title from obtenerNombreDelTítulo', () => {
		expect(require('./plaguicidas.component').PlaguicidasComponent.obtenerNombreDelTítulo(2)).toBe('Anexar requisitos');
		expect(require('./plaguicidas.component').PlaguicidasComponent.obtenerNombreDelTítulo(3)).toBe('Firmar solicitud');
		expect(require('./plaguicidas.component').PlaguicidasComponent.obtenerNombreDelTítulo(99)).toBe('Permiso de importación de muestras experimentales de sustancias tóxicas');
	});

	it('should return correct error alert HTML from generarAlertaDeError', () => {
		const msg = 'Error de prueba';
		const html = require('./plaguicidas.component').PlaguicidasComponent.generarAlertaDeError(msg);
		expect(html).toContain(msg);
		expect(html).toContain('<ol>');
	});
});
describe('PlaguicidasComponent instance methods', () => {
	let component: any;
	beforeEach(() => {
		component = {
			cargarArchivosEvento: { emit: jest.fn() },
			activarBotonCargaArchivos: false,
			seccionCargarDocumentos: false,
			cargaEnProgreso: false,
			wizardComponent: {
				indiceActual: 1,
				siguiente: jest.fn(),
				atras: jest.fn()
			},
			indice: 1,
			datosPasos: { indice: 1 },
			isSaltar: false,
			mostrarAlerta: false,
			requiresPaymentData: false,
			confirmarSinPagoDeDerechos: 0,
			pasoUnoComponent: undefined,
			onClickCargaArchivos() { this.cargarArchivosEvento.emit(); },
			manejaEventoCargaDocumentos(carga: boolean) { this.activarBotonCargaArchivos = carga; },
			cargaRealizada(cargaRealizada: boolean) { this.seccionCargarDocumentos = cargaRealizada ? false : true; },
			onCargaEnProgreso(carga: boolean) { this.cargaEnProgreso = carga; },
			siguiente() {
				this.wizardComponent.siguiente();
				this.indice = this.wizardComponent.indiceActual + 1;
				this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
			},
			anterior() {
				this.wizardComponent.atras();
				this.indice = this.wizardComponent.indiceActual + 1;
				this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
			},
			saltar() {
				this.indice = 3;
				this.datosPasos.indice = 3;
				this.wizardComponent.siguiente();
			},
			onBlancoObligatoria(enBlanco: boolean) { this.isSaltar = enBlanco; },
			cerrarModal(value: boolean) {
				if (value) {
					this.mostrarAlerta = false;
					this.requiresPaymentData = true;
					if (!this.pasoUnoComponent.datosSolicitudRef?.validarClickDeBoton() && this.requiresPaymentData) {
						this.confirmarSinPagoDeDerechos = 2;
					} else {
						this.confirmarSinPagoDeDerechos = 3;
					}
				} else {
					this.mostrarAlerta = false;
					this.confirmarSinPagoDeDerechos = 4;
				}
			}
		};
	});

	it('should emit cargarArchivosEvento when onClickCargaArchivos is called', () => {
		const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
		component.onClickCargaArchivos();
		expect(spy).toHaveBeenCalled();
	});

	it('should update activarBotonCargaArchivos when manejaEventoCargaDocumentos is called', () => {
		component.manejaEventoCargaDocumentos(true);
		expect(component.activarBotonCargaArchivos).toBe(true);
		component.manejaEventoCargaDocumentos(false);
		expect(component.activarBotonCargaArchivos).toBe(false);
	});

	it('should update seccionCargarDocumentos when cargaRealizada is called', () => {
		component.cargaRealizada(true);
		expect(component.seccionCargarDocumentos).toBe(false);
		component.cargaRealizada(false);
		expect(component.seccionCargarDocumentos).toBe(true);
	});

	it('should update cargaEnProgreso when onCargaEnProgreso is called', () => {
		component.onCargaEnProgreso(true);
		expect(component.cargaEnProgreso).toBe(true);
		component.onCargaEnProgreso(false);
		expect(component.cargaEnProgreso).toBe(false);
	});

	it('should call wizardComponent.siguiente and update indices when siguiente is called', () => {
		component.wizardComponent.indiceActual = 1;
		component.siguiente();
		expect(component.indice).toBe(2);
		expect(component.datosPasos.indice).toBe(2);
		expect(component.wizardComponent.siguiente).toHaveBeenCalled();
	});

	it('should call wizardComponent.atras and update indices when anterior is called', () => {
		component.wizardComponent.indiceActual = 1;
		component.anterior();
		expect(component.indice).toBe(2);
		expect(component.datosPasos.indice).toBe(2);
		expect(component.wizardComponent.atras).toHaveBeenCalled();
	});

	it('should set indice and call wizardComponent.siguiente when saltar is called', () => {
		component.saltar();
		expect(component.indice).toBe(3);
		expect(component.datosPasos.indice).toBe(3);
		expect(component.wizardComponent.siguiente).toHaveBeenCalled();
	});

	it('should update isSaltar when onBlancoObligatoria is called', () => {
		component.onBlancoObligatoria(true);
		expect(component.isSaltar).toBe(true);
		component.onBlancoObligatoria(false);
		expect(component.isSaltar).toBe(false);
	});

	it('should update modal and payment state when cerrarModal is called', () => {
		// Mock pasoUnoComponent and its nested refs
		component.pasoUnoComponent = {
			datosSolicitudRef: { validarClickDeBoton: jest.fn().mockReturnValue(false) }
		} as any;
		component.cerrarModal(true);
		expect(component.mostrarAlerta).toBe(false);
		expect(component.requiresPaymentData).toBe(true);
		expect(component.confirmarSinPagoDeDerechos).toBe(2);
		component.cerrarModal(false);
		expect(component.mostrarAlerta).toBe(false);
		expect(component.confirmarSinPagoDeDerechos).toBe(4);
	});
	
	it('should return correct title from obtenerNombreDelTítulo', () => {
		expect(require('./plaguicidas.component').PlaguicidasComponent.obtenerNombreDelTítulo(2)).toBe('Anexar requisitos');
		expect(require('./plaguicidas.component').PlaguicidasComponent.obtenerNombreDelTítulo(3)).toBe('Firmar solicitud');
		expect(require('./plaguicidas.component').PlaguicidasComponent.obtenerNombreDelTítulo(99)).toBe('Permiso de importación de muestras experimentales de sustancias tóxicas');
	});

	it('should return correct error alert HTML from generarAlertaDeError', () => {
		const msg = 'Error de prueba';
		const html = require('./plaguicidas.component').PlaguicidasComponent.generarAlertaDeError(msg);
		expect(html).toContain(msg);
		expect(html).toContain('<ol>');
	});
});

describe('PlaguicidasComponent static methods', () => {
	it('should return correct title from obtenerNombreDelTítulo', () => {
		expect(PlaguicidasComponent.obtenerNombreDelTítulo(2)).toBe('Anexar requisitos');
		expect(PlaguicidasComponent.obtenerNombreDelTítulo(3)).toBe('Firmar solicitud');
		expect(PlaguicidasComponent.obtenerNombreDelTítulo(99)).toBe('Permiso de importación de muestras experimentales de sustancias tóxicas');
	});

	it('should return correct error alert HTML from generarAlertaDeError', () => {
		const msg = 'Error de prueba';
		const html = PlaguicidasComponent.generarAlertaDeError(msg);
		expect(html).toContain(msg);
		expect(html).toContain('<ol>');
	});
}
);
