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
import { ContactileGripperSetParametersProgNode } from './contactile-gripper-setparameters-prog.node';
import { ContactileGripperSetParametersProgConstants } from './contactile-gripper-setparameters-prog-constants';
import { numberAttribute } from '@angular/core';

// programNodeLabel is required
const createProgramNodeLabel = async (node: ContactileGripperSetParametersProgNode): Promise<string> => {
    let index = ContactileGripperSetParametersProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperSetParametersProgConstants.commandIsArg[ContactileGripperSetParametersProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
            // Check if arrays are initialized before accessing
            if (node.parameters.commandArgArray && node.parameters.commandArgUnitArray) {
                return `${node.parameters.commandStr}:${node.parameters.commandArgArray[index]} ${node.parameters.commandArgUnitArray[index]}`;
            }
            return `${node.parameters.commandStr}`;
        }else{
            return `${node.parameters.commandStr}`;
        }
    }
    return `Command not defined`;
};

// factory is required
const createProgramNode = async(): Promise<ContactileGripperSetParametersProgNode> => ({
    type: 'contactile-contactile-gripper-contactile-gripper-setparameters-prog',
    version: '1.0.0',
    lockChildren: false,
    allowsChildren: false,
    parameters: { 
        commandStr:"BIAS",
        commandArgArray:ContactileGripperSetParametersProgConstants.commandArgDef,
        commandArgUnitArray: ContactileGripperSetParametersProgConstants.commandArgUnits,
        commandArgMinArray: ContactileGripperSetParametersProgConstants.commandArgMin,
        commandArgMaxArray: ContactileGripperSetParametersProgConstants.commandArgMax,
        commandArgDefArray: ContactileGripperSetParametersProgConstants.commandArgDef,
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperSetParametersProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperSetParametersProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperSetParametersProgConstants.commandIsArg[ind] ) {
        // Check if commandArgArray is initialized before accessing
        const argValue = node.parameters.commandArgArray && node.parameters.commandArgArray[ind] !== undefined 
            ? node.parameters.commandArgArray[ind] 
            : ContactileGripperSetParametersProgConstants.commandArgDef[ind];
        builder.addStatements(`${ContactileGripperSetParametersProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperSetParametersProgConstants.commandRpcStr[ind]}(${argValue})\n`);
    }else{
        builder.addStatements(`${ContactileGripperSetParametersProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperSetParametersProgConstants.commandRpcStr[ind]}()\n`);
    }
    return builder;
};

// generateCodeAfterChildren is optional
const generateScriptCodeAfter = (node: ContactileGripperSetParametersProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// generateCodePreamble is optional
const generatePreambleScriptCode = (node: ContactileGripperSetParametersProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// validator is optional
const validate = async (node: ContactileGripperSetParametersProgNode, context: ValidationContext): Promise<ValidationResponse> => ({ 
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
