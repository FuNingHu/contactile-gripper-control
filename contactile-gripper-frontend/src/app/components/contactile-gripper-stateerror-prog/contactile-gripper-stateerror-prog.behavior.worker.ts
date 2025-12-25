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
import { ContactileGripperStateErrorProgNode } from './contactile-gripper-stateerror-prog.node';
import { ContactileGripperStateErrorProgConstants } from './contactile-gripper-stateerror-prog-constants';
import { numberAttribute } from '@angular/core';

// programNodeLabel is required
const createProgramNodeLabel = async (node: ContactileGripperStateErrorProgNode): Promise<string> => {
    let index = ContactileGripperStateErrorProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperStateErrorProgConstants.commandIsArg[ContactileGripperStateErrorProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
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
const createProgramNode = async(): Promise<ContactileGripperStateErrorProgNode> => ({
    type: 'contactile-contactile-gripper-contactile-gripper-stateerror-prog',
    version: '1.0.0',
    lockChildren: false,
    allowsChildren: false,
    parameters: { 
        commandStr:ContactileGripperStateErrorProgConstants.commandOpt[0],
        commandArgArray:ContactileGripperStateErrorProgConstants.commandArgDef,
        commandArgUnitArray:ContactileGripperStateErrorProgConstants.commandArgUnits,
        commandArgMinArray: ContactileGripperStateErrorProgConstants.commandArgMin,
        commandArgMaxArray: ContactileGripperStateErrorProgConstants.commandArgMax,
        commandArgDefArray: ContactileGripperStateErrorProgConstants.commandArgDef
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperStateErrorProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperStateErrorProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperStateErrorProgConstants.commandIsArg[ind] ) {
        // Check if commandArgArray is initialized before accessing
        const argValue = node.parameters.commandArgArray && node.parameters.commandArgArray[ind] !== undefined 
            ? node.parameters.commandArgArray[ind] 
            : ContactileGripperStateErrorProgConstants.commandArgDef[ind];
        builder.addStatements(`${ContactileGripperStateErrorProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperStateErrorProgConstants.commandRpcStr[ind]}(${argValue})\n`);
    }else{
        builder.addStatements(`${ContactileGripperStateErrorProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperStateErrorProgConstants.commandRpcStr[ind]}()\n`);
    }
    return builder;
};

// generateCodeAfterChildren is optional
const generateScriptCodeAfter = (node: ContactileGripperStateErrorProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// generateCodePreamble is optional
const generatePreambleScriptCode = (node: ContactileGripperStateErrorProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// validator is optional
const validate = async (node: ContactileGripperStateErrorProgNode, context: ValidationContext): Promise<ValidationResponse> => ({ 
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
