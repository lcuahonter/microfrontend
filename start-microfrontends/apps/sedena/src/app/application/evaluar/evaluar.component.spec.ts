import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluarComponent } from "./evaluar.component";

describe('EvaluarComponent', () => {
    let component: EvaluarComponent;
    let fixture: ComponentFixture<EvaluarComponent>;
    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [EvaluarComponent],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(EvaluarComponent);
        component = fixture.componentInstance;
        component.listaTrimites = [
            { tramite: 1, listaComponentes: [] },
            { tramite: 2, listaComponentes: [] }
        ] as any;
        fixture.detectChanges();
    });

    it('debería crear el componente', (): void => {
        expect(component).toBeTruthy();
    });

    it('selectTramite debe seleccionar el trámite correcto', () => {
        component.selectTramite(2);
        fixture.detectChanges();
        expect(component.tramite).toBe(2);
    });
    it('seleccionaTab debe cambiar el índice de la pestaña', () => {
        component.seleccionaTab(3);
        expect(component.indice).toBe(3);
    });
    it('seleccionaTabRequerimiento debe cambiar el íandice de dictamen', () => {
        component.seleccionaTabRequerimiento(5);
        expect(component.indiceDictamen).toBe(5);
    });
    it('guardarFirmar debe activar la firma', () => {
        component.firmar = false;
        component.guardarFirmar();
        expect(component.firmar).toBe(true);
    });
    it('enviarEvento debe activar firmar si el evento es guardar', () => {
        component.firmar = false;
        component.enviarEvento({ events: 'guardar', datos: {} });
        expect(component.firmar).toBe(true);
    });
    it('enviarEvento debe poner indice a 0 si el evento es cancelar', () => {
        component.indice = 5;
        component.enviarEvento({ events: 'cancelar', datos: {} });
        expect(component.indice).toBe(0);
    });
    it('continuar debe activar firmar si indiceDictamen es 2', () => {
        component.indiceDictamen = 2;
        component.firmar = false;
        component.guardarFirmar = jest.fn();
        component.continuar();
        expect(component.guardarFirmar).toHaveBeenCalled();
    });
    it('continuar debe activar firmar si idTipoRequerimiento es 3', () => {
        component.indiceDictamen = 1;
        component.requerimientoState = { idTipoRequerimiento: 3 } as any;
        component.guardarFirmar = jest.fn();
        component.continuar();
        expect(component.guardarFirmar).toHaveBeenCalled();
    });
    it('continuar debe cambiar indiceDictamen a 2 si no se cumple ninguna condición', () => {
        component.indiceDictamen = 1;
        component.requerimientoState = { idTipoRequerimiento: 1 } as any;
        component.guardarFirmar = jest.fn();
        component.continuar();
        expect(component.indiceDictamen).toBe(2);
        expect(component.guardarFirmar).not.toHaveBeenCalled();
    });
    it('ngOnDestroy debe completar el notifier', () => {
        const spy = jest.spyOn(component['destroyNotifier$'], 'complete');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });
});
