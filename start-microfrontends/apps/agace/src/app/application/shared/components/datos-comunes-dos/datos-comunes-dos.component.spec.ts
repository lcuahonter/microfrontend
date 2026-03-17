import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComunesDosComponent } from './datos-comunes-dos.component';

describe('DatosComunesDosComponent', () => {
  let component: DatosComunesDosComponent;
  let fixture: ComponentFixture<DatosComunesDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosComunesDosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComunesDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
