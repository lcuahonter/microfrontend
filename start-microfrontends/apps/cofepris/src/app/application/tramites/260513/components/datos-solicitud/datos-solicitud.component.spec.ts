import { DatosSolicitudComponent } from './datos-solicitud.component';

describe('DatosSolicitudComponent', () => {
	let component: DatosSolicitudComponent;

	beforeEach(() => {
		component = new DatosSolicitudComponent();
		component.datosDeLaComponent = { validarClickDeBoton: jest.fn().mockReturnValue(true) } as any;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have default values', () => {
		expect(component.idProcedimiento).toBe(260513);
		expect(component.isAvisoLicenciaVisible).toBe(false);
		expect(component.isAduanasEntradaVisible).toBe(true);
		expect(component.configuracionVisibilidad).toBeDefined();
	});

	it('should call validarClickDeBoton on child component', () => {
		const spy = jest.spyOn(component.datosDeLaComponent, 'validarClickDeBoton');
		const result = component.validarClickDeBoton();
		expect(spy).toHaveBeenCalled();
		expect(result).toBe(true);
	});
});