import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivosProfesionalesComponent } from './objetivos-profesionales.component';

describe('ObjetivosProfesionalesComponent', () => {
  let component: ObjetivosProfesionalesComponent;
  let fixture: ComponentFixture<ObjetivosProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivosProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivosProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
