/// <reference lib="webworker" />
import {
    InsertionContext,
    OptionalPromise,
    ProgramBehaviors,
    ProgramNode,
    registerProgramBehavior,
    ScriptBuilder,
    ValidationContext,
    ValidationResponse
} from '@universal-robots/contribution-api';
import { ContactileGripperActivateProgNode } from './contactile-gripper-activate-prog.node';
import { ContactileGripperActivateProgConstants } from './contactile-gripper-activate-prog-constants';
import { numberAttribute } from '@angular/core';

// programNodeLabel is required
const createProgramNodeLabel = async (node: ContactileGripperActivateProgNode): Promise<string> => {
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperActivateProgConstants.commandIsArg[ContactileGripperActivateProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
            return `${node.parameters.commandStr}:${node.parameters.commandArg} ${node.parameters.commandArgUnit}`;
        }else{
            return `${node.parameters.commandStr}`;
        }
    }
    return `Command not defined`;
};

// factory is required
const createProgramNode = async(): Promise<ContactileGripperActivateProgNode> => ({
    type: 'contactile-contactile-gripper-contactile-gripper-activate-prog',
    version: '1.0.0',
    lockChildren: false,
    allowsChildren: false,
    parameters: { 
        commandStr:"ACTIVATE",
        commandArg:0,
        commandArgUnit:"",
        commandArgMin:0,
        commandArgMax:0,
        commandArgDef:0
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperActivateProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperActivateProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    builder.addStatements('set_tool_communication(True, 115200, 0, 1, 1.5, 3.5)\n' +
        'contactileRPC = rpc_factory("xmlrpc",' +
        ' "http://servicegateway/universal-robots/contactile-gripper/contactile-gripper-backend/xmlrpc/")\n');
    if( ContactileGripperActivateProgConstants.commandIsArg[ind] ) {
        builder.addStatements(`${ContactileGripperActivateProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperActivateProgConstants.commandRpcStr[ind]}(${node.parameters.commandArg})\n`);
    }else{
        builder.addStatements(`${ContactileGripperActivateProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperActivateProgConstants.commandRpcStr[ind]}()\n`);
    }
    return builder;
};

// generateCodeAfterChildren is optional
const generateScriptCodeAfter = (node: ContactileGripperActivateProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// generateCodePreamble is optional
const generatePreambleScriptCode = (node: ContactileGripperActivateProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// validator is optional
const validate = async (node: ContactileGripperActivateProgNode, context: ValidationContext): Promise<ValidationResponse> => ({ 
    isValid: node.parameters.commandArg !== undefined
});

// allowsChild is optional
const allowChildInsert = (node: ProgramNode, childType: string): OptionalPromise<boolean> => true;

// allowedInContext is optional
const allowedInsert = (insertionContext: InsertionContext): OptionalPromise<boolean> => true;

// upgradeNode is optional
const nodeUpgrade = (loadedNode: ProgramNode): ProgramNode => loadedNode;

const behaviors: ProgramBehaviors = {
    programNodeLabel: createProgramNodeLabel,
    factory: createProgramNode,
    generateCodeBeforeChildren: generateScriptCodeBefore,
    generateCodeAfterChildren: generateScriptCodeAfter,
    generateCodePreamble: generatePreambleScriptCode,
    validator: validate,
    allowsChild: allowChildInsert,
    allowedInContext: allowedInsert,
    upgradeNode: nodeUpgrade
};

registerProgramBehavior(behaviors);
