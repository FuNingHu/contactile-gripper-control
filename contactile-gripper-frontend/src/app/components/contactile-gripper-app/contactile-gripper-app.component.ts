import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ApplicationPresenterAPI, ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { URCAP_ID, VENDOR_ID } from '../../../generated/contribution-constants';
import { ContactileGripperAppNode } from './contactile-gripper-app.node';
import {ContactileConstants} from '../../../contactile-constants';
import { XmlRpcClient } from 'src/app/xmlrpc/xmlrpc-client';


@Component({
    templateUrl: './contactile-gripper-app.component.html',
    styleUrls: ['./contactile-gripper-app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ContactileGripperAppComponent implements ApplicationPresenter, OnChanges {
    private xmlrpc: XmlRpcClient;
    private isDaemonReachable: boolean;
    private isSerialConnected: boolean;
    private message: string;

    constructor(protected readonly translateService: TranslateService) {}

    // presenterAPI is optional
    @Input() presenterAPI: ApplicationPresenterAPI;

    // applicationNode is required
    @Input() applicationNode: ContactileGripperAppNode;

    // robotSettings is optional
    @Input() robotSettings: RobotSettings;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.robotSettings) {
            if (!changes?.robotSettings?.currentValue) {
                return;
            }
        
            this.translateService.use(changes?.robotSettings?.currentValue?.language).pipe(first()).subscribe();
        }
        
        if (changes?.robotSettings?.isFirstChange()) {
            this.translateService.setDefaultLang('en');
            const path = this.presenterAPI.getContainerContributionURL(VENDOR_ID, URCAP_ID, 'contactile-gripper-backend', 'xmlrpc');
            this.xmlrpc = new XmlRpcClient(`//${path}/`);
            this.isDaemonReachable = true;
            this.isSerialConnected = true;
            this.message = "Serial Connected"
        }
        
        let url = this.presenterAPI.getContainerContributionURL(VENDOR_ID, URCAP_ID, 'contactile-gripper-backend', 'xmlrpc');
        this.xmlrpc = new XmlRpcClient(`${location.protocol}//${url}/`);
    }

    async handleToggle($event: any) {
        // Check if xmlrpc server is reachable
        var res = 0;
        var res = await this.xmlrpc.doRequest('isReachable',[]);
        this.enableDisableAll(res); // disable toggle switch if Daemon is not reachable
        this.message = this.generateMessage('isReachable',res);
        if (res!=0){
            return;
        }
        
        if (!this.isSerialConnected){ // Connect to the serial port
            this.xmlrpc.doRequest('serialStart',[]).then( res => 
                this.connect(res));
        }else{ // Disconnect from serial port
            this.xmlrpc.doRequest('serialStop',[]).then( res => 
                this.disconnect(-1));
        }
    }

    connect(res: number){
        this.isSerialConnected = (res == 0);
        console.log("Is serial connected: ",res)
    }

    disconnect(res: number){
        this.isSerialConnected = (res != 0);
        console.log("Is serial connected: ",res)
    }

    enableDisableAll(res: number){
        console.log("Is Daemon reachable: ",res)
        if(res == 0){
          this.enableAll();
        }else{
          this.disableAll()
        }
    }

    enableAll(){
        this.isDaemonReachable = true;
        this.message = this.generateMessage('isDaemonReachable',0);
    }
    
    disableAll(){
        this.isSerialConnected = false;
        this.isDaemonReachable = false;    
        this.message = this.generateMessage('isDaemonReachable',-1);
    }

    isConnected() : boolean {
        return this.isSerialConnected;
    }

    isDisable() : boolean{
        return !this.isDaemonReachable;
    }

    getMessage(): string{
        return this.message
    }

    private generateMessage(commandStr: string, res: number): string{
        if (res == ContactileConstants.commandSuccess){
            return commandStr + ": Success!";
        }
        return commandStr + ": Failed. ADD MORE DETAIL.";
    }

}
