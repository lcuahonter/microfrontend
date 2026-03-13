import { LibBandejaComponent } from './lib-bandeja.component';
import { Router } from '@angular/router';
import { ConsultaioStore } from '../../../core/estados/consulta.store';
import { BandejaDeSolicitudeService } from '../../../core/services/consultagenerica/bandeja-tareas-pendientes.service';

describe('LibBandejaComponent', () => {
    let component: LibBandejaComponent<any>;

    beforeEach(() => {
        const routerMock = { navigate: jest.fn() } as any;
        const consultaioStoreMock = {} as ConsultaioStore;
        const bandejaDeSolicitudeServiceMock = { postBandejaTareas: jest.fn() } as any;
        component = new LibBandejaComponent(routerMock, consultaioStoreMock, bandejaDeSolicitudeServiceMock);
    });

    describe('filterConfiguracionTabla', () => {
        it('should filter out columns with encabezado Departamento, Número de procedimiento, and Origin', () => {
            component.configuracionTabla = [
                { encabezado: 'Departamento' },
                { encabezado: 'Número de procedimiento' },
                { encabezado: 'Origin' },
                { encabezado: 'Otro' }
            ] as any;
            component.filterConfiguracionTabla();
            expect(component.configuracionTabla).toEqual([{ encabezado: 'Otro' }]);
        });
    });

    describe('enviarDatos', () => {
        it('should set configuracionTablaDatos and flags when form is valid', () => {
            // Mock form group and data
            const mockFormGroup = {
                get: jest.fn().mockReturnValue({ valid: true })
            };
            component.dinamicasBandejaForma = {
                get: jest.fn().mockReturnValue(mockFormGroup)
            } as any;
            component.duplicarDatos = [{ numeroDeProcedimiento: 1 }, { numeroDeProcedimiento: 2 }];
            component.seleccionadoDepartamento = { numeroDeProcedimiento: '1', tieneDepartamento: true, nombreDelDepartamento: '' };
            component.configuracionTablaDatos = [];
            component.hasValidForm = false;
            component.tieneConfiguracionTablaDatos = false;

            component.enviarDatos();

            expect(component.configuracionTablaDatos).toEqual([{ numeroDeProcedimiento: 1 }]);
            expect(component.hasValidForm).toBe(true);
            expect(component.tieneConfiguracionTablaDatos).toBe(true);
        });

        it('should reset configuracionTablaDatos and flags when form is invalid', () => {
            const mockFormGroup = {
                get: jest.fn().mockReturnValue({ valid: false })
            };
            component.dinamicasBandejaForma = {
                get: jest.fn().mockReturnValue(mockFormGroup)
            } as any;
            component.duplicarDatos = [{ numeroDeProcedimiento: 1 }];
            component.configuracionTablaDatos = [];
            component.hasValidForm = true;
            component.tieneConfiguracionTablaDatos = true;

            component.enviarDatos();

            expect(component.configuracionTablaDatos).toEqual([{ numeroDeProcedimiento: 1 }]);
            expect(component.hasValidForm).toBe(false);
            expect(component.tieneConfiguracionTablaDatos).toBe(false);
        });
    });
});