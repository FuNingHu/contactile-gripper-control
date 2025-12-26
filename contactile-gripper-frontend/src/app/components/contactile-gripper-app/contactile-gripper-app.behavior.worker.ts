/// <reference lib="webworker" />
import { ApplicationBehaviors, registerApplicationBehavior, ScriptBuilder } from '@universal-robots/contribution-api';
import { ContactileGripperAppNode } from './contactile-gripper-app.node';

const createApplicationNode = (): ContactileGripperAppNode => ({
    type: 'contactile-contactile-gripper-contactile-gripper-app', // type is required
    version: '1.0.0', // version is required
    isSerialConnected: false,
    gripperResponse: '',
});

const generatePreambleScriptCode = () => {
    const builder = new ScriptBuilder();
    builder.comment('Contactile Gripper Preamble');
    builder.addStatements('set_tool_voltage(24)');
    builder.addStatements('set_tool_communication(True, 115200, 0, 1, 1.5, 3.5)');
    builder.addStatements('global contactileRPC = rpc_factory("xmlrpc", "http://servicegateway/universal-robots/contactile-gripper/contactile-gripper-backend/xmlrpc/")');
    builder.globalVariable('g_returnStatus', '-999999');
    builder.globalVariable('g_width', '-999999');
    builder.globalVariable('g_velocity', '-999999');
    builder.globalVariable('g_imu', '[0,0,0,0,0,0]');
    builder.addStatements('global g_tactile = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]');
    builder.addStatements('global g_tactile_glob = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]');
    builder.addStatements('global g_state = -999999');
    builder.addStatements('global g_last_error = -999999');
    builder.comment('Contactile Gripper Preamble End');
    return builder;
};

const behaviors: ApplicationBehaviors = {
    factory: createApplicationNode,
    generatePreamble: generatePreambleScriptCode,
};

registerApplicationBehavior(behaviors);
