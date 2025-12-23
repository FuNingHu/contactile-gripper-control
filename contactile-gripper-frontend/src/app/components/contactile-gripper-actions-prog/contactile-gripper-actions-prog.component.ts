import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProgramPresenter, ProgramPresenterAPI, RobotSettings } from '@universal-robots/contribution-api';
import { ContactileGripperActionsProgNode } from './contactile-gripper-actions-prog.node';
import { ContactileGripperActionsProgConstants } from './contactile-gripper-actions-prog-constants';
import { first } from 'rxjs/operators';
import { StringToken } from '@angular/compiler';
import { XmlRpc } from '../xmlRpc';

@Component({
    templateUrl: './contactile-gripper-actions-prog.component.html',
    styleUrls: ['./contactile-gripper-actions-prog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class ContactileGripperActionsProgComponent implements OnChanges, ProgramPresenter {
    // presenterAPI is optional
    @Input() presenterAPI: ProgramPresenterAPI;

    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // contributedNode is optional
    @Input() _contributedNode: ContactileGripperActionsProgNode;
    
    private commandStr : string;
    private commandArg : number;
    private commandArgUnit : string;
    private commandArgMin : number;
    private commandArgMax : number;
    private commandArgDef : number;
    
    commandOpt : string[]; // Copy the list of options from ContactileGripperActionsProgConstants (because can't access constants in html file)
    
    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef
    ) {
        this.commandOpt = ContactileGripperActionsProgConstants.commandOpt; // Copy the list of options from ContactileGripperActionsProgConstants (because can't access constants in html file
    }

    // contributedNode is optional
    get contributedNode(): ContactileGripperActionsProgNode {
        return this._contributedNode;
    }

    @Input()
    set contributedNode(value: ContactileGripperActionsProgNode) {
        this._contributedNode = value;
        this.cd.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.robotSettings) {
            if (!changes?.robotSettings?.currentValue) {
                return;
            }

            if (changes?.robotSettings?.isFirstChange()) {
                if (changes?.robotSettings?.currentValue) {
                    this.translateService.use(changes?.robotSettings?.currentValue?.language);
                }
                this.translateService.setDefaultLang('en');
            }

            this.translateService
                .use(changes?.robotSettings?.currentValue?.language)
                .pipe(first())
                .subscribe(() => {
                    this.cd.detectChanges();
                });
        }
        if(changes?.contributedNode){
            this.cd.detectChanges();
        }
    }

    getCurrentCommand(): string {
        return this.contributedNode.parameters.commandStr;
    }

    getCurrentCommandIndex(): number {
        if (!this.contributedNode?.parameters?.commandStr){
            return -1;
        }
        return ContactileGripperActionsProgConstants.commandOpt.indexOf(this.contributedNode.parameters.commandStr);
    }

    isArgInput(): boolean {
        return ContactileGripperActionsProgConstants.commandIsArg[ContactileGripperActionsProgConstants.commandOpt.indexOf(this.contributedNode.parameters.commandStr)];
    }

    getCurrentArgUnit(): string {
        return ContactileGripperActionsProgConstants.commandArgUnits[ContactileGripperActionsProgConstants.commandOpt.indexOf(this.contributedNode.parameters.commandStr)];
    }

    getCurrentArgMin(): number {
        return ContactileGripperActionsProgConstants.commandArgMin[ContactileGripperActionsProgConstants.commandOpt.indexOf(this.contributedNode.parameters.commandStr)];
    }
    
    getCurrentArgMax(): number {
        return ContactileGripperActionsProgConstants.commandArgMax[ContactileGripperActionsProgConstants.commandOpt.indexOf(this.contributedNode.parameters.commandStr)];
    }

    getCurrentArgDef(): number {
        return ContactileGripperActionsProgConstants.commandArgDef[ContactileGripperActionsProgConstants.commandOpt.indexOf(this.contributedNode.parameters.commandStr)];
    }


    onCommandChange($event: any): void{
        this.contributedNode.parameters.commandStr = $event.toString();
        this.contributedNode.parameters.commandArgUnit = this.getCurrentArgUnit();
        this.contributedNode.parameters.commandArgMin = this.getCurrentArgMin();
        this.contributedNode.parameters.commandArgMax = this.getCurrentArgMax();
        this.contributedNode.parameters.commandArgDef = this.getCurrentArgDef();
        this.saveNode();
    }

     // call saveNode to save node parameters
     async saveNode() {
        this.cd.detectChanges();
        await this.presenterAPI.programNodeService.updateNode(this.contributedNode);
    }
}
