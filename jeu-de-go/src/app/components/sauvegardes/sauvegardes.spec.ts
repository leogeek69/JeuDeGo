import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sauvegardes } from './sauvegardes';

describe('Sauvegardes', () => {
  let component: Sauvegardes;
  let fixture: ComponentFixture<Sauvegardes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sauvegardes],
    }).compileComponents();

    fixture = TestBed.createComponent(Sauvegardes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
