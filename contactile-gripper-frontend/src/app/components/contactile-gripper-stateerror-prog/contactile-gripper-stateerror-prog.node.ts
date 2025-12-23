import { ProgramNode } from '@universal-robots/contribution-api';

export interface ContactileGripperStateErrorProgNode extends ProgramNode {
    type: string;
    parameters: {
        commandStr: string;
        commandArg: number;
        commandArgUnit: string;
        commandArgMin: number;
        commandArgMax: number;
        commandArgDef: number;
    };
    lockChildren?: boolean;
    allowsChildren?: boolean;
}
