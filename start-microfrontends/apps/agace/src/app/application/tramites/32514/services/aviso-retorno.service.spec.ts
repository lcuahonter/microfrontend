import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdaceService } from './aviso-retorno.service';
import { Tramite32514Store } from '../state/Tramite32514.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Solicitud32514State } from '../state/Tramite32514.store';

describe('AdaceService', () => {
    let service: AdaceService;
    let httpMock: HttpTestingController;
    let store: Tramite32514Store;

    beforeEach(() => {
        const storeMock = {
            update: jest.fn(),
            actualizarEstadoFormulario: function(datos: any) {
                this.update((state: any) => ({ ...state, ...datos }));
            }
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AdaceService,
                { provide: Tramite32514Store, useValue: storeMock }
            ]
        });

        service = TestBed.inject(AdaceService);
        httpMock = TestBed.inject(HttpTestingController);
        store = TestBed.inject(Tramite32514Store);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('obtenerDatosAno should return expected Catalogo[]', () => {
        const mockData: Catalogo[] = [{ id: 1, descripcion: '2023' }];
        service.obtenerDatosAno().subscribe(data => {
            expect(data).toEqual(mockData);
        });

        const req = httpMock.expectOne('assets/json/32514/ano.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockData);
    });

    it('obtenerDatosMes should return expected Catalogo[]', () => {
        const mockData: Catalogo[] = [{ id: 1, descripcion: 'Enero' }];
        service.obtenerDatosMes().subscribe(data => {
            expect(data).toEqual(mockData);
        });

        const req = httpMock.expectOne('assets/json/32514/mes.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockData);
    });

    it('getRegistroTomaMuestrasMercanciasData should return expected Solicitud32514State', () => {
        const mockState: Solicitud32514State = { some: 'value' } as any;
        service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
            expect(data).toEqual(mockState);
        });

        const req = httpMock.expectOne('assets/json/32514/datos.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockState);
    });

    it('actualizarEstadoFormulario should call store.update with merged state', () => {
        const datos: Solicitud32514State = { foo: 'bar' } as any;
        store.actualizarEstadoFormulario(datos);
        expect(store.update).toHaveBeenCalledWith(expect.any(Function));
        // Simulate the update function
        const state = { existing: 'value' };
        const updateFn = (store.update as jest.Mock).mock.calls[0][0];
        expect(updateFn(state)).toEqual({ ...state, ...datos });
    });
});