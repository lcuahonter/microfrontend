import { CargaDetalleMercanciaComponent } from './carga-detalle-mercancia.component';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

describe('CargaDetalleMercanciaComponent', () => {
    let component: CargaDetalleMercanciaComponent;
    let httpMock: any;

    beforeEach(() => {
        httpMock = { get: jest.fn() };
        component = new CargaDetalleMercanciaComponent(new FormBuilder(), httpMock as HttpClient);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('agregarAnimales should call ejecutarAccion', () => {
        const spy = jest.spyOn(component, 'ejecutarAccion');
        component.agregarAnimales();
        expect(spy).toHaveBeenCalled();
    });

    it('cancelar should call ejecutarAccion and ejecutarAccionLimpiaLista', () => {
        const spyAccion = jest.spyOn(component, 'ejecutarAccion');
        const spyLimpia = jest.spyOn(component, 'ejecutarAccionLimpiaLista');
        component.cancelar();
        expect(spyAccion).toHaveBeenCalled();
        expect(spyLimpia).toHaveBeenCalled();
    });

    it('ejecutarAccion should emit accionDelHijo', () => {
        const spy = jest.spyOn(component.accionDelHijo, 'emit');
        component.ejecutarAccion();
        expect(spy).toHaveBeenCalled();
    });

    it('ejecutarAccionLimpiaLista should emit accionDelHijoLimpiaLista', () => {
        const spy = jest.spyOn(component.accionDelHijoLimpiaLista, 'emit');
        component.ejecutarAccionLimpiaLista();
        expect(spy).toHaveBeenCalled();
    });

    it('descargarArchivo should call http.get', () => {
        httpMock.get.mockReturnValue({ subscribe: jest.fn() });
        component.descargarArchivo();
        expect(httpMock.get).toHaveBeenCalledWith('assets/txt/220201_carga_masiva.txt', { responseType: 'text' });
    });

    it('cargarArchivoMasivo should set mensajeError if header is invalid', () => {
        const fakeEvent = {
            target: {
                files: [
                    new Blob(['col1,col2\nval1,val2'], { type: 'text/plain' })
                ]
            }
        } as any;
        // Mock FileReader
        const originalFileReader = (global as any).FileReader;
        (global as any).FileReader = function () {
            this.readAsText = function () {
                this.onload({ target: { result: 'col1,col2\nval1,val2' } });
            };
            this.readAsDataURL = function () {};
        };
        component.cargarArchivoMasivo(fakeEvent);
        expect(component.mensajeError).toContain('Error en la linea 0');
        (global as any).FileReader = originalFileReader;
    });
});