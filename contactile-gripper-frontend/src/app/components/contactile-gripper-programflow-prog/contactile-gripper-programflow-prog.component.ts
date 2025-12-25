import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProgramPresenter, ProgramPresenterAPI, RobotSettings } from '@universal-robots/contribution-api';
import { ContactileGripperProgramFlowProgNode } from './contactile-gripper-programflow-prog.node';
import { ContactileGripperProgramFlowProgConstants } from './contactile-gripper-programflow-prog-constants';
import { first } from 'rxjs/operators';
import { StringToken } from '@angular/compiler';

@Component({
    templateUrl: './contactile-gripper-programflow-prog.component.html',
    styleUrls: ['./contactile-gripper-programflow-prog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class ContactileGripperProgramFlowProgComponent implements OnChanges, ProgramPresenter {
    // presenterAPI is optional
    @Input() presenterAPI: ProgramPresenterAPI;

    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // contributedNode is optional
    @Input() _contributedNode: ContactileGripperProgramFlowProgNode;
    
    private commandStr : string;
    private commandArg : number;
    private commandArgUnit : string;
    private commandArgMin : number;
    private commandArgMax : number;
    private commandArgDef : number;
    
    commandOpt : string[]; // Copy the list of options from ContactileGripperProgramFlowProgConstants (because can't access constants in html file)
    
    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef
    ) {
        this.commandOpt = ContactileGripperProgramFlowProgConstants.commandOpt; // Copy the list of options from ContactileGripperProgramFlowProgConstants (because can't access constants in html file
    }

    // contributedNode is optional
    get contributedNode(): ContactileGripperProgramFlowProgNode {
        return this._contributedNode;
    }

    @Input()
    set contributedNode(value: ContactileGripperProgramFlowProgNode) {
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
        return ContactileGripperProgramFlowProgConstants.commandOpt.indexOf(this.contributedNode.parameters.commandStr);
    }

    isArgInput(): boolean {
        const index = this.getCurrentCommandIndex();
        if (index < 0) return false;
        return ContactileGripperProgramFlowProgConstants.commandIsArg[index];
    }

    getCurrentArgUnit(): string {
        const index = this.getCurrentCommandIndex();
        if (index < 0) return '';
        return ContactileGripperProgramFlowProgConstants.commandArgUnits[index];
    }

    getCurrentArgMin(): number {
        const index = this.getCurrentCommandIndex();
        if (index < 0) return 0;
        return ContactileGripperProgramFlowProgConstants.commandArgMin[index];
    }

    getCurrentArgMax(): number {
        const index = this.getCurrentCommandIndex();
        if (index < 0) return 0;
        return ContactileGripperProgramFlowProgConstants.commandArgMax[index];
    }

    getCurrentArgDef(): number {
        const index = this.getCurrentCommandIndex();
        if (index < 0) return 0;
        return ContactileGripperProgramFlowProgConstants.commandArgDef[index];
    }

    onCommandChange($event: any): void{
        this.contributedNode.parameters.commandStr = $event.toString();
        this.saveNode();
    }

    onValueChange($event: any): void{
        const index = this.getCurrentCommandIndex();
        if(index>=0){
            // Ensure commandArgArray is initialised
            if(!this.contributedNode.parameters.commandArgArray){
                this.contributedNode.parameters.commandArgArray = [...ContactileGripperProgramFlowProgConstants.commandArgDef];
            }
            this.contributedNode.parameters.commandArgArray[index] = $event;
            this.saveNode;
        }
    }

     // call saveNode to save node parameters
     async saveNode() {
        this.cd.detectChanges();
        await this.presenterAPI.programNodeService.updateNode(this.contributedNode);
    }
}
