import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationComponent } from './delete-confirmation.component';

describe('DeleteConfirmationComponent', () => {
  let component: DeleteConfirmationComponent;
  let fixture: ComponentFixture<DeleteConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteConfirmationComponent]
    });
    fixture = TestBed.createComponent(DeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
