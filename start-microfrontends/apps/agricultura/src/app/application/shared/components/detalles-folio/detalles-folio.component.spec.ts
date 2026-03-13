import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesFolioComponent } from './detalles-folio.component';

describe('DetallesFolioComponent', () => {
  let component: DetallesFolioComponent;
  let fixture: ComponentFixture<DetallesFolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesFolioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
