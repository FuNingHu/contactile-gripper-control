import {ComponentFixture, TestBed} from '@angular/core/testing';
import {contactile-gripper-actions-progComponent} from "./contactile-gripper-actions-prog.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ContactileGripperActionsProgComponent', () => {
  let fixture: ComponentFixture<ContactileGripperActionsProgComponent>;
  let component: ContactileGripperActionsProgComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactileGripperActionsProgComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useValue: {
            getTranslation(): Observable<Record<string, string>> {
              return of({});
            }
          }
        }
      })],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactileGripperActionsProgComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
