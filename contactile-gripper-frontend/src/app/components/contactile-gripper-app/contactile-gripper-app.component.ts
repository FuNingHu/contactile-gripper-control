import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
    // presenterAPI is optional
    @Input() applicationAPI: ApplicationPresenterAPI;

    // applicationNode is required
    @Input() applicationNode: ContactileGripperAppNode;

    // robotSettings is optional
    @Input() robotSettings: RobotSettings;


    private xmlrpc: XmlRpcClient;
    isDaemonReachable: boolean = false;
    private isSerialConnected: boolean = false;
    private message: string = '';

    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef
    ) {}

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

        
        // Check if presenterAPI is available before using it
        
            const url = this.applicationAPI.getContainerContributionURL(VENDOR_ID, URCAP_ID, 'contactile-gripper-backend', 'xmlrpc');
            this.xmlrpc = new XmlRpcClient(`${location.protocol}//${url}/`);
            
            // Check if daemon is reachable and update isDaemonReachable
            this.xmlrpc.methodCall('isReachable')
                .then(res => {
                    console.log("Is daemon reachable: ", res);
                    this.isDaemonReachable = res as unknown as boolean;
                    console.log("isDaemonReachable set to: ", this.isDaemonReachable);
                    this.cd.detectChanges();
                });
        }
    }

    // async handleToggle($event: any) {
    //     // Check if xmlrpc is initialized
    //     if (!this.xmlrpc) {
    //         console.error('XML-RPC client not initialized');
    //         return;
    //     }
        
    //     // Check if xmlrpc server is reachable
    //     try {
    //         var res = await this.xmlrpc.methodCall('isReachable');
    //         this.enableDisableAll(Number(res)); // disable toggle switch if Daemon is not reachable
    //         this.message = this.generateMessage('isReachable', Number(res));
    //         if (Number(res) !== 0) {
    //             return;
    //         }
            
    //         if (!this.isSerialConnected) { // Connect to the serial port
    //             this.xmlrpc.methodCall('serialStart').then(res => 
    //                 this.connect(res as number));
    //         } else { // Disconnect from serial port
    //             this.xmlrpc.methodCall('serialStop').then(res => 
    //                 this.disconnect(res as number));
    //         }
    //     } catch (error) {
    //         console.error('XML-RPC call failed:', error);
    //         this.disableAll();
    //     }
    // }
    async handleToggle($event: any) {
        console.log("Handle toggle event: ", $event);
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


    getMessage(): string{
        return this.message
    }

    private generateMessage(commandStr: string, res: number): string{
        if (res == ContactileConstants.commandSuccess){
            return commandStr + ": Success!";
        }
        return commandStr + ": Failed. ADD MORE DETAIL.";
    }
    // call saveNode to save node parameters
    saveNode() {
        this.cd.detectChanges();
        this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    }

}
