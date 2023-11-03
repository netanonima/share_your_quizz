import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuizzParamsComponent } from './manage-quizz-params.component';

describe('ManageQuizzParamsComponent', () => {
  let component: ManageQuizzParamsComponent;
  let fixture: ComponentFixture<ManageQuizzParamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageQuizzParamsComponent]
    });
    fixture = TestBed.createComponent(ManageQuizzParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
