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
    let index = ContactileGripperActionsProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperActionsProgConstants.commandIsArg[ContactileGripperActionsProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
            // Check if arrays are initialized before accessing
            if (node.parameters.commandArgArray && node.parameters.commandArgUnitArray) {
                return `${node.parameters.commandStr} : ${node.parameters.commandArgArray[index]} ${node.parameters.commandArgUnitArray[index]}`;
            }
            return `${node.parameters.commandStr}`;
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
        commandStr:ContactileGripperActionsProgConstants.commandOpt[0],
        commandArgArray:ContactileGripperActionsProgConstants.commandArgDef,
        commandArgUnitArray:ContactileGripperActionsProgConstants.commandArgUnits,
        commandArgMinArray: ContactileGripperActionsProgConstants.commandArgMin,
        commandArgMaxArray: ContactileGripperActionsProgConstants.commandArgMax,
        commandArgDefArray: ContactileGripperActionsProgConstants.commandArgDef
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperActionsProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperActionsProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperActionsProgConstants.commandIsArg[ind] ) {
        // Check if commandArgArray is initialized before accessing
        const argValue = node.parameters.commandArgArray && node.parameters.commandArgArray[ind] !== undefined 
            ? node.parameters.commandArgArray[ind] 
            : ContactileGripperActionsProgConstants.commandArgDef[ind];
        builder.addStatements(`${ContactileGripperActionsProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperActionsProgConstants.commandRpcStr[ind]}(${argValue})\n`);
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
    isValid: true
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
