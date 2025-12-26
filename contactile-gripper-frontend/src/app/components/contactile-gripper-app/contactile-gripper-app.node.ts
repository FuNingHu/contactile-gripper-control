import { ApplicationNode } from '@universal-robots/contribution-api';

export interface ContactileGripperAppNode extends ApplicationNode {
    type: string;
    version: string;
    isSerialConnected: boolean;
    gripperResponse: string;
}
