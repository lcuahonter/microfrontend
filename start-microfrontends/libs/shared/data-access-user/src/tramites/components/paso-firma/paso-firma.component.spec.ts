import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoFirmaComponent } from './paso-firma.component';

describe('PasoFirmaComponent', () => {
  let component: PasoFirmaComponent;
  let fixture: ComponentFixture<PasoFirmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasoFirmaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
