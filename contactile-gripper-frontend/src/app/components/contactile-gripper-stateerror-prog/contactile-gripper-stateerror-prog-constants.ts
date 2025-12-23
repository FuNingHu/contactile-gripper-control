export abstract class ContactileGripperStateErrorProgConstants{
    static commandOpt = [      "GET_STATE",            "GET_LAST_ERROR",          "CLEAR_ERROR_STATE",              "Flush Serial Buffer"];
    static commandIsArg = [    false,                  false,                       false,                          false];
    static commandArgUnits = [ "",                     "",                          "",                             ""];
    static commandArgMin = [   0.0,                    0.0,                         0.0,                            0.0];
    static commandArgMax = [   0.0,                    0.0,                         0.0,                            0.0];
    static commandArgDef = [   0.0,                    0.0,                         0.0,                            0.0];
    static commandRpcStr = [   "gripper_get_state",    "gripper_get_last_error",    "gripper_clear_error_state",    "gripper_flushSerialInputBuffer"];
    static commandRetVar = [   "g_returnStatus",       "g_returnStatus",            "g_returnStatus",               "g_returnStatus"];
}