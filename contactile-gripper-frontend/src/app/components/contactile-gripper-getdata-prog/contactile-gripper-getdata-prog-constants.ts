export abstract class ContactileGripperGetDataProgConstants{
    static commandOpt = [      "GET_WIDTH",            "GET_VEL",          "GET_IMU",          "GET_TACTILE",             "GET_TACTILE_GLOBAL"];
    static commandIsArg = [    false,                  false,              false,              false,                      false];
    static commandArgMin = [   0,                      0,                  0,                  0,                          0];
    static commandArgMax = [   0,                      0,                  0,                  0,                          0];
    static commandArgUnits = [  "",                     "",                 "",                 "",                         ""];
    static commandArgDef = [   0,                      0,                  0,                  0,                          0];
    static commandRpcStr = [   "gripper_get_width",    "gripper_get_vel",  "gripper_get_imu",  "gripper_get_tactile",     "gripper_get_tactile_global"];
    static commandRetVar = [   "g_width",              "g_velocity",       "g_imu",            "g_tactile",                "g_tactile_glob"];
}