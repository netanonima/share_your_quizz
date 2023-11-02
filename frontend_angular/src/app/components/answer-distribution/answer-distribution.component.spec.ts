import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerDistributionComponent } from './answer-distribution.component';

describe('AnswerDistributionComponent', () => {
  let component: AnswerDistributionComponent;
  let fixture: ComponentFixture<AnswerDistributionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerDistributionComponent]
    });
    fixture = TestBed.createComponent(AnswerDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
