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
    let index = ContactileGripperActivateProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperActivateProgConstants.commandIsArg[ContactileGripperActivateProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
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
const createProgramNode = async(): Promise<ContactileGripperActivateProgNode> => ({
    type: 'contactile-contactile-gripper-contactile-gripper-activate-prog',
    version: '1.0.0',
    lockChildren: false,
    allowsChildren: false,
    parameters: { 
        commandStr:ContactileGripperActivateProgConstants.commandOpt[0],
        commandArgArray:ContactileGripperActivateProgConstants.commandArgDef,
        commandArgUnitArray:ContactileGripperActivateProgConstants.commandArgUnits,
        commandArgMinArray: ContactileGripperActivateProgConstants.commandArgMin,
        commandArgMaxArray: ContactileGripperActivateProgConstants.commandArgMax,
        commandArgDefArray: ContactileGripperActivateProgConstants.commandArgDef
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperActivateProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperActivateProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperActivateProgConstants.commandIsArg[ind] ) {
        // Check if commandArgArray is initialized before accessing
        const argValue = node.parameters.commandArgArray && node.parameters.commandArgArray[ind] !== undefined 
            ? node.parameters.commandArgArray[ind] 
            : ContactileGripperActivateProgConstants.commandArgDef[ind];
        builder.addStatements(`${ContactileGripperActivateProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperActivateProgConstants.commandRpcStr[ind]}(${argValue})\n`);
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
