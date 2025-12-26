
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, InputSignal, OnChanges, SimpleChanges, inject, signal} from '@angular/core';
import {RobotSettings, SidebarItem, SidebarItemPresenter, SidebarPresenterAPI } from '@universal-robots/contribution-api';
import { URCAP_ID, VENDOR_ID } from '../../../generated/contribution-constants';
import {TranslateService} from "@ngx-translate/core";
import {first} from "rxjs";
import { ReturnStatement } from '@angular/compiler';
import {ContactileConstants} from '../../../contactile-constants';
import { XmlRpcClient } from 'src/app/components/xmlrpc/xmlrpc-client';

@Component({
  templateUrl: './contactile-gripper-bar.component.html',
  styleUrls: ['./contactile-gripper-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class ContactileGripperBarComponent implements SidebarItemPresenter {
  public readonly translateService = inject(TranslateService);
  public readonly cd = inject(ChangeDetectorRef);
  // public showErrorMessage = signal<boolean>(false);
  private xmlrpc: XmlRpcClient;
  width: string;
  state: string;
  last_error: string; 
  message: string;

  // presenterAPI is optional
  @Input() presenterAPI: SidebarPresenterAPI;

  // robotSettings is optional
  @Input() robotSettings: RobotSettings;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.robotSettings) {
        if (!changes.robotSettings.currentValue) {
            return;
        }
        this.translateService.use(changes.robotSettings.currentValue.language).pipe(first()).subscribe();
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
      if (changes.presenterAPI?.isFirstChange()) {
        this.translateService.setDefaultLang('en');
        this.width = ContactileConstants.commandError;
        this.state = ContactileConstants.commandError;
        this.last_error = ContactileConstants.commandError;
      }
  
      let url = this.presenterAPI.getContainerContributionURL(VENDOR_ID, URCAP_ID, 'contactile-gripper-backend', 'xmlrpc');
      console.log("url: ", url);
      this.xmlrpc = new XmlRpcClient(`${location.protocol}//${url}/`);
      this.xmlrpc.methodCall('isReachable').then(res => 
        console.log("isReachable: ",res));
      // this.xmlrpc.doRequest('isSerialOpen',[]).then( res => 
      //   this.enableDisableAll(res));
  }

  async updateAllVals() {
    this.width = await this.xmlrpc.methodCall('gripper_get_width');
    if (this.width === ContactileConstants.commandError) {
      this.message = this.generateMessage('GET_WIDTH', this.width);
      return;
    }
    
    this.state = await this.xmlrpc.methodCall('gripper_get_state');
    if (this.state === ContactileConstants.commandError){
      this.message = this.generateMessage('GET_STATE', this.state);
      return;
    }
    
    this.last_error = await this.xmlrpc.methodCall('gripper_get_last_error');
    if (this.last_error === ContactileConstants.commandError){
      this.message = this.generateMessage('GET_LAST_ERROR', this.last_error);
      return;
    }
  }


  

  async onCloseButton() {
    let res: string = ContactileConstants.commandError;
    let curr_width: string = await this.xmlrpc.methodCall('gripper_get_width');
    if (curr_width !== ContactileConstants.commandError && !isNaN(parseFloat(curr_width))){
      let new_width: number = parseFloat(curr_width) - 2.0;
      res = await this.xmlrpc.methodCall('gripper_pc_move_to_width', new_width);
    }
    this.updateAllVals();
    console.log("onCloseButton: ", res);
  }

  async onOpenButton() {
    let res: string = ContactileConstants.commandError;
    let curr_width: string = await this.xmlrpc.methodCall('gripper_get_width');
    if (curr_width !== ContactileConstants.commandError && !isNaN(parseFloat(curr_width))){
      let new_width: number = parseFloat(curr_width) + 2.0;
      res = await this.xmlrpc.methodCall('gripper_pc_move_to_width', new_width);
    }
    this.updateAllVals();
    console.log("onOpenButton: ", res);
  }

  async onFFGripButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_ff_grip');
    this.message = this.generateMessage('FF_GRIP', res);
    console.log("onFFGripButton: ", res);
  }

  async onDFGripButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_df_grip');
    this.message = this.generateMessage('DF_GRIP', res);
    console.log("onDFGripButton: ", res);
  }

  async onReleaseButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_release');
    this.message = this.generateMessage('RELEASE', res);
    console.log("onReleaseButton: ", res);
  }

  async onStopButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_stop');
    this.message = this.generateMessage('STOP', res);
    console.log("onStopButton: ", res);
  }

  async onBiasButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_bias');
    this.message = this.generateMessage('BIAS', res);
    console.log("onBiasButton: ", res);
  }

  async onResetParamsButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_reset_params');
    this.message = this.generateMessage('RESET_PARAMS', res);
    console.log("onResetParamsButton: ", res);
  }

  async onClearErrorStateButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_clear_error_state');
    this.updateAllVals();
    this.message = this.generateMessage('CLEAR_ERROR_STATE', res);
    console.log("onClearErrorStateButton: ", res);
  }

  async onFlushButton() {
    let res: string = await this.xmlrpc.methodCall('gripper_flushSerialInputBuffer');
    this.message = this.generateMessage('FLUSH', res);
    console.log("onFlushButton: ", res);
  }

  // call saveNode to save node parameters
  private async saveNode() {
      //await this.presenterAPI.programNodeService.updateNode(this.contributedNode);
  }

  private generateMessage(commandStr: string, res: string): string{
      if (res === ContactileConstants.commandSuccess){  // res === 0
          return commandStr + ": Success!";
      }
      return commandStr + ": Failed with error code " + res;
  }
  
  protected readonly Object = Object;

}
