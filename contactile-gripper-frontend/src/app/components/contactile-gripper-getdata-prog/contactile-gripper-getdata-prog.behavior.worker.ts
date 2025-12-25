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
import { ContactileGripperGetDataProgNode } from './contactile-gripper-getdata-prog.node';
import { ContactileGripperGetDataProgConstants } from './contactile-gripper-getdata-prog-constants';
import { numberAttribute } from '@angular/core';

// programNodeLabel is required
const createProgramNodeLabel = async (node: ContactileGripperGetDataProgNode): Promise<string> => {
    let index = ContactileGripperGetDataProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperGetDataProgConstants.commandIsArg[ContactileGripperGetDataProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
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
const createProgramNode = async(): Promise<ContactileGripperGetDataProgNode> => ({
    type: 'contactile-contactile-gripper-contactile-gripper-getdata-prog',
    version: '1.0.0',
    lockChildren: false,
    allowsChildren: false,
    parameters: { 
        commandStr:ContactileGripperGetDataProgConstants.commandOpt[0],
        commandArgArray:ContactileGripperGetDataProgConstants.commandArgDef,
        commandArgUnitArray:ContactileGripperGetDataProgConstants.commandArgUnits,
        commandArgMinArray: ContactileGripperGetDataProgConstants.commandArgMin,
        commandArgMaxArray: ContactileGripperGetDataProgConstants.commandArgMax,
        commandArgDefArray: ContactileGripperGetDataProgConstants.commandArgDef
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperGetDataProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperGetDataProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperGetDataProgConstants.commandIsArg[ind] ) {
        // Check if commandArgArray is initialized before accessing
        const argValue = node.parameters.commandArgArray && node.parameters.commandArgArray[ind] !== undefined 
            ? node.parameters.commandArgArray[ind] 
            : ContactileGripperGetDataProgConstants.commandArgDef[ind];
        builder.addStatements(`${ContactileGripperGetDataProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperGetDataProgConstants.commandRpcStr[ind]}(${argValue})\n`);
    }else{
        builder.addStatements(`${ContactileGripperGetDataProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperGetDataProgConstants.commandRpcStr[ind]}()\n`);
    }
    return builder;
};

// generateCodeAfterChildren is optional
const generateScriptCodeAfter = (node: ContactileGripperGetDataProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// generateCodePreamble is optional
const generatePreambleScriptCode = (node: ContactileGripperGetDataProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// validator is optional
const validate = async (node: ContactileGripperGetDataProgNode, context: ValidationContext): Promise<ValidationResponse> => ({ 
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
