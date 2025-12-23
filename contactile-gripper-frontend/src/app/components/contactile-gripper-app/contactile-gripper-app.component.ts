import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { ContactileGripperAppNode } from './contactile-gripper-app.node';

@Component({
    templateUrl: './contactile-gripper-app.component.html',
    styleUrls: ['./contactile-gripper-app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ContactileGripperAppComponent implements ApplicationPresenter, OnChanges {
    constructor(protected readonly translateService: TranslateService) {}

    // applicationNode is required
    @Input() applicationNode: ContactileGripperAppNode;

    // robotSettings is optional
    @Input() robotSettings: RobotSettings;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.robotSettings) {
            if (!changes?.robotSettings?.currentValue) {
                return;
            }

            if (changes?.robotSettings?.isFirstChange()) {
                this.translateService.setDefaultLang('en');
            }

            this.translateService.use(changes?.robotSettings?.currentValue?.language).pipe(first()).subscribe();
        }
    }

    handleToggle($event: any): void{
        // TODO: how do we call contactileRPC.startSerial()
    }


}
