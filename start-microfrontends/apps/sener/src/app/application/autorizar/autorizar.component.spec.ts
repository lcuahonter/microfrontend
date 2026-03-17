import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AutorizarComponent } from "./autorizar.component";

describe('AutorizarComponent', () => {
    let component: AutorizarComponent;
    let fixture: ComponentFixture<AutorizarComponent>;
    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [AutorizarComponent],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(AutorizarComponent);
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
    it('enviarEvento no debe hacer nada si el evento es cancelar', () => {
        component.firmar = false;
        component.guardarFirmar = jest.fn();
        component.enviarEvento({ events: 'cancelar', datos: {} });
        expect(component.guardarFirmar).not.toHaveBeenCalled();
    });

    it('ngOnDestroy debe completar el notifier', () => {
        const spy = jest.spyOn(component['destroyNotifier$'], 'complete');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });
});
