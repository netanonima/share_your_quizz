import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoicesComponent } from './choices.component';

describe('ChoicesComponent', () => {
  let component: ChoicesComponent;
  let fixture: ComponentFixture<ChoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChoicesComponent]
    });
    fixture = TestBed.createComponent(ChoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
