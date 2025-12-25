export abstract class ContactileGripperActivateProgConstants{
    static commandOpt = [      "ACTIVATE",          "DEACTIVATE"];
    static commandIsArg = [    false,               false];
    static commandArgUnits = [ "",                  ""];
    static commandArgMin = [   0.0,                 0.0];
    static commandArgMax = [   0.0,                 0.0];
    static commandArgDef = [   0.0,                 0.0];
    static commandRpcStr = [   "serialStart",       "serialStop"];
    static commandRetVar = [   "g_returnStatus",    "g_returnStatus"];
}