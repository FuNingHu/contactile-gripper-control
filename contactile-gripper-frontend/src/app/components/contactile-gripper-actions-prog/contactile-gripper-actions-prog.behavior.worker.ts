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
import { ContactileGripperActionsProgNode } from './contactile-gripper-actions-prog.node';
import { ContactileGripperActionsProgConstants } from './contactile-gripper-actions-prog-constants';
import { numberAttribute } from '@angular/core';

// programNodeLabel is required
const createProgramNodeLabel = async (node: ContactileGripperActionsProgNode): Promise<string> => {
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperActionsProgConstants.commandIsArg[ContactileGripperActionsProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
            return `${node.parameters.commandStr}:${node.parameters.commandArg} ${node.parameters.commandArgUnit}`;
        }else{
            return `${node.parameters.commandStr}`;
        }
    }
    return `Command not defined`;
};

// factory is required
const createProgramNode = async(): Promise<ContactileGripperActionsProgNode> => ({
    type: 'contactile-contactile-gripper-contactile-gripper-actions-prog',
    version: '1.0.0',
    lockChildren: false,
    allowsChildren: false,
    parameters: { 
        commandStr: "PC_MOVE_TO_WIDTH",
        commandArg: 0,
        commandArgUnit:"mm",
        commandArgMin:0,
        commandArgMax:175,
        commandArgDef:100,
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperActionsProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperActionsProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperActionsProgConstants.commandIsArg[ind] ) {
        builder.addStatements(`${ContactileGripperActionsProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperActionsProgConstants.commandRpcStr[ind]}(${node.parameters.commandArg})\n`);
    }else{
        builder.addStatements(`${ContactileGripperActionsProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperActionsProgConstants.commandRpcStr[ind]}()\n`);
    }
    return builder;
};

// generateCodeAfterChildren is optional
const generateScriptCodeAfter = (node: ContactileGripperActionsProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// generateCodePreamble is optional
const generatePreambleScriptCode = (node: ContactileGripperActionsProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// validator is optional
const validate = async (node: ContactileGripperActionsProgNode, context: ValidationContext): Promise<ValidationResponse> => ({ 
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
