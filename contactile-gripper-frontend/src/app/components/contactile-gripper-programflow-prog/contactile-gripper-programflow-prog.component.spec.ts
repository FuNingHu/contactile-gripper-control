import {ComponentFixture, TestBed} from '@angular/core/testing';
import {contactile-gripper-programflow-progComponent} from "./contactile-gripper-programflow-prog.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ContactileGripperActionsProgComponent', () => {
  let fixture: ComponentFixture<ContactileGripperProgramFlowProgComponent>;
  let component: ContactileGripperProgramFlowProgComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactileGripperProgramFlowProgComponent],
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

    fixture = TestBed.createComponent(ContactileGripperProgramFlowProgComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
