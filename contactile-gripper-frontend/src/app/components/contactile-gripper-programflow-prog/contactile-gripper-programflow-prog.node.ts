import { ProgramNode } from '@universal-robots/contribution-api';

export interface ContactileGripperProgramFlowProgNode extends ProgramNode {
    type: string;
    parameters: {
        commandStr: string;
        commandArgArray: number[];
        commandArgUnitArray: string[];
        commandArgMinArray: number[];
        commandArgMaxArray: number[];
        commandArgDefArray: number[];
    };
    lockChildren?: boolean;
    allowsChildren?: boolean;
}
