import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlesFisicoComponent } from './controles-fisico.component';

describe('ControlesFisicoComponent', () => {
  let component: ControlesFisicoComponent;
  let fixture: ComponentFixture<ControlesFisicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlesFisicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlesFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
