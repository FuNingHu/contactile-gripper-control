import { ProgramNode } from '@universal-robots/contribution-api';

export interface ContactileGripperSetParametersProgNode extends ProgramNode {
    type: string;
    parameters: {
        commandStr: string;
        // commandArg: number;
        commandArgArray: number[];
        commandArgUnitArray: string[];
        commandArgMinArray: number[];
        commandArgMaxArray: number[];
        commandArgDefArray: number[];
    };
    lockChildren?: boolean;
    allowsChildren?: boolean;
}
