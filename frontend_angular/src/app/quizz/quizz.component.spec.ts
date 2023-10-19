import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzComponent } from './quizz.component';

describe('QuizzComponent', () => {
  let component: QuizzComponent;
  let fixture: ComponentFixture<QuizzComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizzComponent]
    });
    fixture = TestBed.createComponent(QuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
