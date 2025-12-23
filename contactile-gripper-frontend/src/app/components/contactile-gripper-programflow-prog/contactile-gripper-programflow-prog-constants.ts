export abstract class ContactileGripperProgramFlowProgConstants{
    static commandOpt = [      "waitUntil_IDLE_READY",              "waitUntil_FF_HOLD",            "waitUntil_DF_HOLD"];
    static commandIsArg = [    true,                                true,                           true];
    static commandArgUnits = [ "s",                                 "s",                            "s"];
    static commandArgMin = [   0.1,                                 0.1,                            0.1];
    static commandArgMax = [   5.0,                                 5.0,                            5.0];
    static commandArgDef = [   5.0,                                 5.0,                            5.0];
    static commandRpcStr = [   "gripper_waitUntil_idle_ready",      "gripper_waitUntil_ff_hold",    "gripper_waitUntil_df_hold"];
    static commandRetVar = [   "g_returnStatus",                    "g_returnStatus",               "g_returnStatus"];
}