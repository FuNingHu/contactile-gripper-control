
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, InputSignal, OnChanges, SimpleChanges, inject, signal} from '@angular/core';
import {RobotSettings, SidebarItem, SidebarItemPresenter, SidebarPresenterAPI } from '@universal-robots/contribution-api';
import { URCAP_ID, VENDOR_ID } from '../../../generated/contribution-constants';
import {TranslateService} from "@ngx-translate/core";
import {first} from "rxjs";
import { ReturnStatement } from '@angular/compiler';
import {ContactileConstants} from '../../../contactile-constants';
import { XmlRpcClient } from 'src/app/xmlrpc/xmlrpc-client';

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
  private isSerialOpen: boolean;
  private width: number;
  private state: number;
  private last_error: number; 
  private message: string;

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

      if (changes.presenterAPI?.isFirstChange()) {
        this.translateService.setDefaultLang('en');
        this.isSerialOpen = true;
        this.width = ContactileConstants.commandError;
        this.state = ContactileConstants.commandError;
        this.last_error = ContactileConstants.commandError;
      }
  
      let url = this.presenterAPI.getContainerContributionURL(VENDOR_ID, URCAP_ID, 'contactile-gripper-backend', 'xmlrpc');
      this.xmlrpc = new XmlRpcClient(`${location.protocol}//${url}/`);
      this.xmlrpc.methodCall('isReachable').then(res => 
        console.log("isReachable: ",res));
      // this.xmlrpc.doRequest('isSerialOpen',[]).then( res => 
      //   this.enableDisableAll(res));
  }

  enableDisableAll(res: number){
    console.log("isSerialOpen: ",res)
    if(res == 0){
      this.enableAll();
    }else{
      this.disableAll()
    }
  }

  enableAll(){
    this.isSerialOpen = true;
  }

  disableAll(){
    this.isSerialOpen = false;    
    this.message = this.generateMessage('isSerialOpen',-1);
  }
  
  isDisable() : boolean{
    return !this.isSerialOpen;
  }

  async updateAllVals(){
    var res = 0;  
    this.width = await this.xmlrpc.doRequest('gripper_get_width',[]);
    if (this.width == ContactileConstants.commandError){
      this.message = this.generateMessage('GET_WIDTH',this.width);
      return;
    }
    this.state = await this.xmlrpc.doRequest('gripper_get_state',[]);
    if (this.state == ContactileConstants.commandError){
      this.message = this.generateMessage('GET_STATE',this.state);
      return;
    }
    this.last_error = await this.xmlrpc.doRequest('gripper_get_last_error',[]);
    if (this.last_error == ContactileConstants.commandError){
      this.message = this.generateMessage('GET_LAST_ERROR',this.last_error);
      return;
    }
    this.message = this.generateMessage('UPDATE',res);
  }

  getWidth(): number{
    return this.width;
  }

  getState(): number{
    return this.state;
  }

  getLastError(): number{
    return this.last_error;
  }

  getMessage(): string{
    return this.message
  }

  async onCloseButton() {
    var res = 0;
    var curr_width = await this.xmlrpc.doRequest('gripper_get_width',[]);
    if (curr_width != ContactileConstants.commandError){
      var new_width = curr_width-2.0;
      res = await this.xmlrpc.doRequest('gripper_pc_move_to_width',[new_width]);
    }else{
      this.message = this.generateMessage('GET_WIDTH',curr_width);
      return;
    }
    res = await this.xmlrpc.doRequest('gripper_waitUntil_idle_ready',[]);
    if(res != ContactileConstants.commandSuccess){
      this.message = this.generateMessage('waitUntil_IDLE_READY',res);
      return;
    }
    this.updateAllVals();
    this.message = this.generateMessage('OPEN',res);
  }

  async onOpenButton() {
    var res = 0;
    var curr_width = await this.xmlrpc.doRequest('gripper_get_width',[]);
    if (curr_width != ContactileConstants.commandError){
      var new_width = curr_width+2.0;
      res = await this.xmlrpc.doRequest('gripper_pc_move_to_width',[new_width]);
    }else{
      this.message = this.generateMessage('GET_WIDTH',curr_width);
      return;
    }
    res = await this.xmlrpc.doRequest('gripper_waitUntil_idle_ready',[]);
    if(res != ContactileConstants.commandSuccess){
      this.message = this.generateMessage('waitUntil_IDLE_READY',res);
      return;
    }
    this.updateAllVals();
    this.message = this.generateMessage('OPEN',res);
  }

  async onFFGripButton() {
    var res = await this.xmlrpc.doRequest('gripper_ff_grip',[]);
    this.message = this.generateMessage('FF_GRIP',res);
  }

  async onDFGripButton() {
    var res = await this.xmlrpc.doRequest('gripper_df_grip',[]);
    this.message = this.generateMessage('DF_GRIP',res);
  }

  async onReleaseButton() {
    var res = await this.xmlrpc.doRequest('gripper_release',[]);
    this.message = this.generateMessage('RELEASE',res);
  }

  async onStopButton() {
    var res = await this.xmlrpc.doRequest('gripper_stop',[]);
    this.message = this.generateMessage('STOP',res);
  }

  async onBiasButton() {
    var res = await this.xmlrpc.doRequest('gripper_bias',[]);
    this.message = this.generateMessage('BIAS',res);
  }

  async onResetParamsButton() {
    var res = await this.xmlrpc.doRequest('gripper_reset_params',[]);
    this.message = this.generateMessage('RESET_PARAMS',res);
  }

  async onClearErrorStateButton() {
    var res = await this.xmlrpc.doRequest('gripper_clear_error_state',[]);
    this.updateAllVals();
    this.message = this.generateMessage('CLEAR_ERROR_STATE',res);
  }

  async onFlushButton() {
    var res = await this.xmlrpc.doRequest('gripper_flushSerialInputBuffer',[]);
    this.message = this.generateMessage('FLUSH',res);
  }

  // call saveNode to save node parameters
  private async saveNode() {
      //await this.presenterAPI.programNodeService.updateNode(this.contributedNode);
  }

  private generateMessage(commandStr: string, res: number): string{
      if (res == ContactileConstants.commandSuccess){
          return commandStr + ": Success!";
      }
      return commandStr + ": Failed. ADD MORE DETAIL.";
  }
  
  protected readonly Object = Object;

}
