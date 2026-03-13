import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminacionModificacionComponent } from './modificacion.component';

describe('EliminacionModificacionComponent', () => {
  let component: EliminacionModificacionComponent<any>;
  let fixture: ComponentFixture<EliminacionModificacionComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminacionModificacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminacionModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
