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
import { ContactileGripperProgramFlowProgNode } from './contactile-gripper-programflow-prog.node';
import { ContactileGripperProgramFlowProgConstants } from './contactile-gripper-programflow-prog-constants';
import { numberAttribute } from '@angular/core';

// programNodeLabel is required
const createProgramNodeLabel = async (node: ContactileGripperProgramFlowProgNode): Promise<string> => {
    let index = ContactileGripperProgramFlowProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperProgramFlowProgConstants.commandIsArg[ContactileGripperProgramFlowProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
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
const createProgramNode = async(): Promise<ContactileGripperProgramFlowProgNode> => ({
    type: 'contactile-contactile-gripper-contactile-gripper-programflow-prog',
    version: '1.0.0',
    lockChildren: false,
    allowsChildren: false,
    parameters: { 
        commandStr:ContactileGripperProgramFlowProgConstants.commandOpt[0],
        commandArgArray:ContactileGripperProgramFlowProgConstants.commandArgDef,
        commandArgUnitArray:ContactileGripperProgramFlowProgConstants.commandArgUnits,
        commandArgMinArray: ContactileGripperProgramFlowProgConstants.commandArgMin,
        commandArgMaxArray: ContactileGripperProgramFlowProgConstants.commandArgMax,
        commandArgDefArray: ContactileGripperProgramFlowProgConstants.commandArgDef
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperProgramFlowProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperProgramFlowProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperProgramFlowProgConstants.commandIsArg[ind] ) {
        // Check if commandArgArray is initialized before accessing
        const argValue = node.parameters.commandArgArray && node.parameters.commandArgArray[ind] !== undefined 
            ? node.parameters.commandArgArray[ind] 
            : ContactileGripperProgramFlowProgConstants.commandArgDef[ind];
        builder.addStatements(`${ContactileGripperProgramFlowProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperProgramFlowProgConstants.commandRpcStr[ind]}(${argValue})\n`);
    }else{
        builder.addStatements(`${ContactileGripperProgramFlowProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperProgramFlowProgConstants.commandRpcStr[ind]}()\n`);
    }
    return builder;
};

// generateCodeAfterChildren is optional
const generateScriptCodeAfter = (node: ContactileGripperProgramFlowProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// generateCodePreamble is optional
const generatePreambleScriptCode = (node: ContactileGripperProgramFlowProgNode): OptionalPromise<ScriptBuilder> => new ScriptBuilder();

// validator is optional
const validate = async (node: ContactileGripperProgramFlowProgNode, context: ValidationContext): Promise<ValidationResponse> => ({ 
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
