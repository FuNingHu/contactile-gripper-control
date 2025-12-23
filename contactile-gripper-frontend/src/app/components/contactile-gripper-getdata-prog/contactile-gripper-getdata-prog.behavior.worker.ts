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
    if(node.parameters.commandStr !== undefined){  
        if( ContactileGripperGetDataProgConstants.commandIsArg[ContactileGripperGetDataProgConstants.commandOpt.indexOf(node.parameters.commandStr)] ) {
            return `${node.parameters.commandStr}:${node.parameters.commandArg} ${node.parameters.commandArgUnit}`;
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
        commandStr:"GET_WIDTH",
        commandArg:100,
        commandArgUnit:"mm",
        commandArgMin: 0,
        commandArgMax: 0,
        commandArgDef: 0
    },
});

// generateCodeBeforeChildren is optional
const generateScriptCodeBefore = async (node: ContactileGripperGetDataProgNode): Promise<ScriptBuilder> => {
    const builder = new ScriptBuilder();
    var ind = ContactileGripperGetDataProgConstants.commandOpt.indexOf(node.parameters.commandStr);
    if( ContactileGripperGetDataProgConstants.commandIsArg[ind] ) {
        builder.addStatements(`${ContactileGripperGetDataProgConstants.commandRetVar[ind]} = contactileRPC.${ContactileGripperGetDataProgConstants.commandRpcStr[ind]}(${node.parameters.commandArg})\n`);
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
