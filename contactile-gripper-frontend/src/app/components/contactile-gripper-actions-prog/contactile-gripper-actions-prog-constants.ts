export abstract class ContactileGripperActionsProgConstants{
    static commandOpt = [      "PC_MOVE_TO_WIDTH",            "FF_GRIP",          "DF_GRIP",          "STOP",             "BRAKE",            "RELEASE"];
    static commandIsArg = [    true,                          false,              false,              false,              false,              false];
    static commandArgUnits = [ "mm",                          "",                 "",                 "",                 "",                 ""];
    static commandArgMin = [   0.0,                           0.0,                0.0,                0.0,                0.0,                0.0];
    static commandArgMax = [   175.0,                         0.0,                0.0,                0.0,                0.0,                0.0];
    static commandArgDef = [   100.0,                         0.0,                0.0,                0.0,                0.0,                0.0];
    static commandRpcStr = [   "gripper_pc_move_to_width",    "gripper_ff_grip",  "gripper_df_grip",  "gripper_stop",     "gripper_brake",    "gripper_release"];
    static commandRetVar = [   "g_returnStatus",              "g_returnStatus",   "g_returnStatus",   "g_returnStatus",   "g_returnStatus",   "g_returnStatus"];
}