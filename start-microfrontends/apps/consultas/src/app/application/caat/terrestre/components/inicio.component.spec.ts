import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioTerrestreComponent } from './inicio.component';


describe('ConsultasCaatTerrestreComponent', () => {
  let component: InicioTerrestreComponent;
  let fixture: ComponentFixture<InicioTerrestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioTerrestreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioTerrestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
