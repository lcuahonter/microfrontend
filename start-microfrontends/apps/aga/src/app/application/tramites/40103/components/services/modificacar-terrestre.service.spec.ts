
import { TestBed } from '@angular/core/testing';
import { modificarTerrestreService } from './modificacar-terrestre.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('modificarTerrestreService', () => {
	let service: modificarTerrestreService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [modificarTerrestreService]
		});
		service = TestBed.inject(modificarTerrestreService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should fetch tipo de vehiculo', () => {
		const mockData = { datos: [{ id: 1, nombre: 'Camioneta' }] };
		service.obtenerTipoDeVehiculo().subscribe(data => {
			expect(data).toEqual(mockData);
		});
		const req = httpMock.expectOne('assets/json/40103/tipo-de-vehiculo.json');
		expect(req.request.method).toBe('GET');
		req.flush(mockData);
	});

	it('should fetch color vehiculo', () => {
		const mockData = { datos: [{ id: 1, nombre: 'Rojo' }] };
		service.obtenerColorVehiculo().subscribe(data => {
			expect(data).toEqual(mockData);
		});
		const req = httpMock.expectOne('assets/json/40103/vehiculo-color.json');
		expect(req.request.method).toBe('GET');
		req.flush(mockData);
	});

	it('should fetch tipo arrastre', () => {
		const mockData = { datos: [{ id: 1, nombre: 'Remolque' }] };
		service.obtenerTipoArrastre().subscribe(data => {
			expect(data).toEqual(mockData);
		});
		const req = httpMock.expectOne('assets/json/40103/tipo-vehiculo-arrastre.json');
		expect(req.request.method).toBe('GET');
		req.flush(mockData);
	});

	it('should fetch año', () => {
		const mockData = { datos: [{ id: 2020 }] };
		service.obtenerAno().subscribe(data => {
			expect(data).toEqual(mockData);
		});
		const req = httpMock.expectOne('assets/json/40103/ano.json');
		expect(req.request.method).toBe('GET');
		req.flush(mockData);
	});

	it('should fetch pais emisor', () => {
		const mockData = { datos: [{ id: 1, nombre: 'México' }] };
		service.obtenerPaisEmisor().subscribe(data => {
			expect(data).toEqual(mockData);
		});
		const req = httpMock.expectOne('assets/json/40103/pais-emisor-2da-placa.json');
		expect(req.request.method).toBe('GET');
		req.flush(mockData);
	});

	it('should fetch pedimento tabla', () => {
		const mockData = { datos: [{ numero: '1', tipoDeVehiculo: 'Camioneta' }] };
		service.obtenerPedimentoTabla().subscribe(data => {
			expect(data).toEqual(mockData);
		});
		const req = httpMock.expectOne('assets/json/40103/vahiculo-dummy.json');
		expect(req.request.method).toBe('GET');
		req.flush(mockData);
	});
});
