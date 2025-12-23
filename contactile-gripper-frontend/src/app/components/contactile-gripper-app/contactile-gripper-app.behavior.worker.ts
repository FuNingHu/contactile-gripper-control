/// <reference lib="webworker" />
import { ApplicationBehaviors, registerApplicationBehavior, ScriptBuilder } from '@universal-robots/contribution-api';
import { ContactileGripperAppNode } from './contactile-gripper-app.node';

const createApplicationNode = (): ContactileGripperAppNode => ({
    type: 'contactile-contactile-gripper-contactile-gripper-app', // type is required
    version: '1.0.0', // version is required
});

const generatePreambleScriptCode = () => {
    const builder = new ScriptBuilder();
    builder.addStatements(
        '\n' +
            '#### Contactile Gripper Preamble #######################\n' +
            'set_tool_communication(True, 115200, 0, 1, 1.5, 3.5)\n' +
            'contactileRPC = rpc_factory("xmlrpc",' +
            ' "http://servicegateway/universal-robots/contactile-gripper/contactile-gripper-backend/xmlrpc/")\n' +
            '\n' +
            'g_returnStatus = -999999\n' +
            'g_width = -999999\n' +
            'g_velocity = -999999\n' +
            'g_imu = [0,0,0,0,0,0]\n' +
            'g_tactile = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]\n' +
            'g_tactile_glob = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]\n' +
            'g_state = -999999\n' +
            'g_last_error = -999999\n' +
            '\n' +
            '#####################################################\n',
    );
    return builder;
};

const behaviors: ApplicationBehaviors = {
    factory: createApplicationNode,
    generatePreamble: generatePreambleScriptCode,
};

registerApplicationBehavior(behaviors);
