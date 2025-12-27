#!/usr/bin/env python

from logger import *
from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler
from socketserver import ThreadingMixIn

import GripperClass_NoProcess as GripperClass

LOCALHOST = "0.0.0.0"
CONTACTILE_RS485_PORT = 36963
G_TEXT = "Hello, Contactile Gripper!";
# XMLRPC_PORT = 40405

'''
if os.path.exists('/dev/ur-ttylink'):
	from modbus_communication import tool_modbus_read, tool_modbus_write
else:
	from modbus_sim import tool_modbus_read, tool_modbus_write
'''

class RequestHandler(SimpleXMLRPCRequestHandler):
	rpc_paths = ('/',)
	
	def log_message(self, format, *args):
		pass  # Suppress default logging

class MultithreadedSimpleXMLRPCServer(ThreadingMixIn, SimpleXMLRPCServer):
	pass




comPortStr = "/dev/ur-ttylink/ttyTool"
gripper = GripperClass.GripperClass_NoProcess()
# Don't auto-start serial - let frontend control it
# gripper.serialStart(comPortStr)

def isReachable():
	return True

def setText(text):
	global G_TEXT
	G_TEXT = text
	return G_TEXT

def getText():
	global G_TEXT
	return G_TEXT




server = MultithreadedSimpleXMLRPCServer(("0.0.0.0", CONTACTILE_RS485_PORT), requestHandler=RequestHandler)
server.RequestHandlerClass.protocol_version = "HTTP/1.1"

Logger.info(f'Gripper XMLRPC server started on port {CONTACTILE_RS485_PORT}')

server.register_function(isReachable, 				"isReachable")
server.register_function(setText, 					"setText")
server.register_function(getText, 					"getText")
server.register_function(gripper.serialStart, 		"serialStart")
server.register_function(gripper.serialStop, 		"serialStop")
server.register_function(gripper.isSerialOpen,		"isSerialOpen")

server.register_function(gripper.get_width,			"gripper_get_width")
server.register_function(gripper.get_vel,			"gripper_get_vel")
server.register_function(gripper.get_imu,			"gripper_get_imu")
server.register_function(gripper.get_tactile,		"gripper_get_tactile")
server.register_function(gripper.get_tactile_global,"gripper_get_tactile_global")

server.register_function(gripper.reset_params,		"gripper_reset_params")
server.register_function(gripper.pc_set_vel,		"gripper_pc_set_vel")
server.register_function(gripper.ff_set_vel,		"gripper_ff_set_vel")
server.register_function(gripper.ff_set_force,		"gripper_ff_set_force")
server.register_function(gripper.df_set_vel,		"gripper_df_set_vel")
server.register_function(gripper.df_set_exf,		"gripper_df_set_exf")
server.register_function(gripper.df_set_mxf,		"gripper_df_set_mxf")
server.register_function(gripper.df_dyn_exf_en,		"gripper_df_dyn_exf_en")
server.register_function(gripper.df_dyn_exf_dis,	"gripper_df_dyn_exf_dis")
server.register_function(gripper.df_set_shearg, 	"gripper_df_set_shearg")
server.register_function(gripper.df_set_torqg,  	"gripper_df_set_torqg")

server.register_function(gripper.bias,				"gripper_bias")
server.register_function(gripper.pc_move_to_width,	"gripper_pc_move_to_width")
server.register_function(gripper.ff_grip,			"gripper_ff_grip")
server.register_function(gripper.df_grip,			"gripper_df_grip")
server.register_function(gripper.stop,				"gripper_stop")
server.register_function(gripper.brake,				"gripper_brake")
server.register_function(gripper.release,			"gripper_release")

server.register_function(gripper.clear_last_error,	"gripper_clear_last_error")
server.register_function(gripper.clear_error_state,	"gripper_clear_error_state")
server.register_function(gripper.get_state,			"gripper_get_state")
server.register_function(gripper.get_last_error,	"gripper_get_last_error")

server.register_function(gripper.waitUntil_idle_ready,"gripper_waitUntil_idle_ready")
server.register_function(gripper.waitUntil_ff_hold,	"gripper_waitUntil_ff_hold")
server.register_function(gripper.waitUntil_df_hold,	"gripper_waitUntil_df_hold")

server.register_function(gripper.__flushSerialInputBuffer__, "gripper_flushSerialInputBuffer")

server.serve_forever()
