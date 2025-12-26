#!/usr/bin/env python
# -*- coding: utf-8 -*-

import serial       # pip install pyserial 
import time         # time 
import logging
#from multiprocessing import Process, Queue
#from contactile_gripper_library import GripperConstants as gripConsts
import GripperConstants as gripConsts
COMMAND_SUCCESS = 0
COMMAND_FAIL = -999999
## ERROR CODES: +ve numbers reserved for error states of the gripper (See GripperConstants.py); -ve numbers reserved for errors from the contactile_gripper_library (see GripperClass.py)
ERR_COMMAND_NAME =      -1
ERR_RESP_TYPE =         -2
ERR_N_RET =             -3
ERR_SEND =              -4
ERR_RECIEVE =           -5
ERR_INVALID_ARG =       -6
ERR_BUTTON_INTERRUPT =  -7 # Not an error, but need a constant to define this
ERR_TIMEOUT =           -8
## TIMEOUTS: Suggested timeout durations for waitUntil functions
TIMEOUT_STOPPING =      0.1
TIMEOUT_BRAKING =       0.2
TIMEOUT_RELEASING =     0.5
TIMEOUT_CLEAR_ERROR =   0.05
TIMEOUT_READ =          0.1
TIMEOUT_RESPONSE = 	0.1
IS_DEBUG = False
IS_CONNECTED = False
# 配置日志 - 仅输出到控制台，避免文件权限问题
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()  # 只输出到控制台
    ]
)
logger = logging.getLogger('GripperDaemon')
# Build the command string
# Helper function of the sendGripper Command
def buildGripperCommand(commandName, argStrs):
	cmdStr = gripConsts.CMD_START + commandName
	if len(argStrs) > 0:
		cmdStr = cmdStr + gripConsts.ARG_START
		for argInd in range(len(argStrs)):
			cmdStr = cmdStr + str(argStrs[argInd])
			if argInd < len(argStrs)-1:
				cmdStr = cmdStr + gripConsts.ARG_DELIM
	cmdStr = cmdStr + gripConsts.CMD_END
	if IS_DEBUG:
		print('DBG: buildGripperCommand: ' + cmdStr)
	return cmdStr
class GripperClass_NoProcess:
	## INIT
	def __init__(self):
		self.gripperSerialPort = None
	#	self.gripperSerialPort.port = comPortStr
	#	self.gripperSerialPort.baudrate = 115200
	#	self.gripperSerialPort.parity = serial.PARITY_ODD 	# Testing to match set_communications_tool in URScript
	#	self.gripperSerialPort.stopbits = serial.STOPBITS_ONE 	# Testing to match set_communications_tool in URScript
	#	self.gripperSerialPort.timeout = TIMEOUT_READ # Time in s 
		self.buf = bytearray()
	## HELPERS
	def isSerialOpen(self):
		global IS_CONNECTED
		return IS_CONNECTED
	def serialStart(self, port_name):
		global IS_CONNECTED
		logger.info("Attempting to open serial port: %s" % port_name)
		try:
			#self.gripperSerialPort.open()
			self.gripperSerialPort = serial.Serial(
				port=port_name, 
				baudrate=115200, 
				bytesize=8,
				parity='N',
				stopbits=1,
				timeout=1.0
			)
			if self.gripperSerialPort.is_open:
				IS_CONNECTED = True
				logger.info("Serial port opened successfully")
			else:
				logger.error("Failed to open serial port: %s" % port_name)
		except Exception as e:
			logger.error("Failed to open serial port: %s" % str(e))
		return self.isSerialOpen()
	def serialStop(self):
		global IS_CONNECTED
		logger.info("Attempting to close serial port:" )
		try:
			if self.gripperSerialPort is not None:			
				logger.info("Serial port closed successfully")
				self.gripperSerialPort.close()
				IS_CONNECTED = False
				self.gripperSerialPort = None
			else: 
				logger.error("Failed to close serial port")
		except Exception as e:
			logger.error("Failed to close serial port: %s" % str(e))
		return not self.isSerialOpen()
	# Flush the serial input buffer - in case command/response is out of synch
	def __flushSerialInputBuffer__(self):
		if self.gripperSerialPort is None or not self.gripperSerialPort.is_open:
			if IS_DEBUG:
				print('DBG: GripperClass.flushSerialInputBuffer: COMPORT not open')
			return COMMAND_SUCCESS
		if self.gripperSerialPort.in_waiting == 0:
			if IS_DEBUG:
				print('DBG: GripperClass.flushSerialInputBuffer: Nothing in waiting')
			return COMMAND_SUCCESS
		self.gripperSerialPort.reset_input_buffer()
		if IS_DEBUG:
			print('DBG: GripperClass.flushSerialInputBuffer: Flushed')
		return COMMAND_SUCCESS
	def __readLine__(self):
		if self.gripperSerialPort is None:
			if IS_DEBUG:
				print('DBG: GripperClass.readLine: Serial port is None')
			return ""
		
		start_time = time.time()
		i = self.buf.find(b"\n")
		if i >= 0:
			r = self.buf[:i+1]
			self.buf = self.buf[i+1:]
			try:
				strResult = r.decode('ASCII')
			except:
				strResult = ""
			return strResult
		while True:
			if time.time() - start_time > TIMEOUT_RESPONSE:
				return ""
			try:
				i = max(1,min(2048,self.gripperSerialPort.in_waiting))
				data = self.gripperSerialPort.read(i)
			except Exception as e:
				if IS_DEBUG:
					print(f'ERR: GripperClass.readLine: {type(e).__name__}: {str(e)}')
				return ""
			i = data.find(b"\n")
			if i >= 0:
				r = self.buf + data[:i+1]
				self.buf[0:] = data[i+1:]
				try:
					strResult = r.decode('ASCII').strip()
				except:
					strResult = ""
				return strResult
			else:
				self.buf.extend(data)
	# Builds the command string and sends it to the gripper 
	def __sendGripperCommand__(self, cmdStr):
		if self.gripperSerialPort is None:
			if IS_DEBUG:
				print('DBG: GripperClass.sendGripperCommand: Serial port is None')
			return False
		try:
			nWritten = self.gripperSerialPort.write(cmdStr) # bytes(cmdStr,'ascii'))
			if IS_DEBUG:
				print('DBG: GripperClass.sendGripperCommand: Sent ' + str(nWritten) + ' characters')
			return nWritten > 0
		except Exception as e:
			if IS_DEBUG:
				print(f'ERR: GripperClass.sendGripperCommand: {type(e).__name__}: {str(e)}')
			return False
	# Helper function for the getGripperResponse function
	def __resolveRetVals__(self, argStrs):
		retVals = list()
		for returnStr in argStrs:
			retVals.append(float(returnStr))
		return retVals
	# Read a response from the gripper
	# Returns the command name <CMD_NAME> string, command ID <ID> integer, response type <RSP_TYPE> string and any return values <ARGS> list of floats
	def __getGripperResponse__(self, defaultReturn=None): 
		cmdId = -1
		cmdStr = ''
		respType = ''
		retVals = list()
		# Read a line from the COM Port
		recLine = self.__readLine__()
		# Find special characters
		cmdStartPos = recLine.find(gripConsts.CMD_START)
		cmdEndPos = recLine.find(gripConsts.CMD_END)
		ackDelimPos = recLine.find(gripConsts.ACK_DELIM)
		argStartPos = recLine.find(gripConsts.ARG_START)
		if (cmdStartPos == -1) or (cmdEndPos == -1):
			print('ERR: Received string; not a response to a command: ' + recLine) # or DATA_STREAM data
			return cmdStr, cmdId, respType, retVals
		# Extract <CMD_NAME> and <ARGS>
		args = ''
		if argStartPos == -1: # No arguments in response
			cmdStr = recLine[cmdStartPos+1:ackDelimPos]
		else:
			cmdStr = recLine[cmdStartPos+1:argStartPos]
			if ackDelimPos == -1: # Remove CMD_END
				retVals = self.__resolveRetVals__(recLine[argStartPos+1:-2].split(gripConsts.ARG_DELIM))
			else:
				retVals = self.__resolveRetVals__(recLine[argStartPos+1:ackDelimPos].split(gripConsts.ARG_DELIM))
		if (ackDelimPos != -1):
			# Extract <RSP_TYPE> and <ID>
			responsePart = recLine[ackDelimPos+1:cmdEndPos].split(gripConsts.ARG_DELIM)
			if len(responsePart) != 2: # Expecting <RESP_TYP>,<ID>
				print('ERR: Expected <RESP_TYPE>,<ID> Found: ' + responsePart + '\n')
			else: 
				respType = responsePart[0]
				cmdId = int(responsePart[-1])
		elif recLine.find(gripConsts.DATA_STREAM_STR) == -1:
			print('ERR: Malformed response: ' + recLine)
		if IS_DEBUG:
			print('DBG: GripperClass.getGripperResponse: Read ' + recLine )
		return cmdStr, cmdId, respType, retVals
	# Check the acknowledgement to a command
	def __checkCommandAcknowledge__(self, cmdStr, cmdId, respType, retVals, commandName, argStrs=list(), expectedNRet=0):
		if cmdStr != commandName:           # Check if this is a response to the correct command
			if IS_DEBUG:
				print('DBG: GripperClass.checkCommandAcknowledge: Wrong command; Expected: ' + commandName + '; Found: ' + cmdStr)
			return ERR_COMMAND_NAME
		if respType != gripConsts.ACK_STR:  # Check if this is an acknowledgement
			if IS_DEBUG:
				print('DBG: GripperClass.checkCommandAcknowledge: Wrong response type; Expected: ' + gripConsts.ACK_STR + '; Found: ' + respType)
			return ERR_RESP_TYPE
		if len(retVals) != expectedNRet:    # Check that the correct number of return values are present
			if IS_DEBUG:
				print('DBG: GripperClass.checkCommandAcknowledge: Wrong number of returns; Expected: ' + str(expectedNRet) + '; Found: ' + str(len(retVals)))
			return ERR_N_RET
		return COMMAND_SUCCESS
	def __queueGripperCommand__(self, commandName, argStrs=list()):
		# self.command_q.put(buildGripperCommand(commandName, argStrs))
		nWritten = self.__sendGripperCommand__(buildGripperCommand(commandName, argStrs))
		if IS_DEBUG:
			print('DBG: GripperClass.queueGripperCommand: Queued ' + commandName)
		return nWritten
	def __getQueuedGripperResponse__(self,defaultReturn=''):
		# while self.response_q.empty():
		#     time.sleep(0.01)
		# resp = self.response_q.get()
		# cmdStr = resp[0]
		# cmdId = resp[1]
		# respType = resp[2]
		# retVals = resp[3]
		# return cmdStr, cmdId, respType, retVals
		return self.__getGripperResponse__()
	def __getVariable__(self,commandStr,expectedNRet):
		defaultReturn = ''
		nWritten = self.__queueGripperCommand__(commandStr,list()) 
		cmdStr,cmdId,respType,retVals = self.__getQueuedGripperResponse__(defaultReturn='') 
		if self.__checkCommandAcknowledge__(cmdStr,cmdId,respType,retVals,commandStr,list(),expectedNRet) != COMMAND_SUCCESS:
			if IS_DEBUG:
				print('DBG: GripperClass.getVariable: Failed')
			return list()
		return retVals
	def __getFloat__(self,commandStr,defaultFloatReturn):
		retVals = self.__getVariable__(commandStr,1)
		if len(retVals) == 0:
			if IS_DEBUG:
				print('DBG: GripperClass.getFloat: Failed')
			return defaultFloatReturn
		return retVals[0]
	def __getInt__(self,commandStr,defaultIntReturn):
		retVals = self.__getVariable__(commandStr,1)
		if len(retVals) == 0:
			if IS_DEBUG:
				print('DBG: GripperClass.getInt: Failed')
			return defaultIntReturn
		return retVals[0]
	def __getFloatList__(self,commandStr,defaultListReturn):
		retVals = self.__getVariable__(commandStr,len(defaultListReturn))
		if len(retVals) == 0:
			if IS_DEBUG:
				print('DBG: GripperClass.getFloatList: Failed')
			return defaultListReturn
		return retVals
	def __setVariable__(self,commandStr,argumentList):
		self.__queueGripperCommand__(commandStr,argumentList) 
		cmdStr,cmdId,respType,retVals = self.__getQueuedGripperResponse__(defaultReturn='')
		res = self.__checkCommandAcknowledge__(cmdStr,cmdId,respType,retVals,commandStr,argumentList,len(argumentList))
		if res == COMMAND_SUCCESS:
			return COMMAND_SUCCESS
		if res == ERR_RESP_TYPE and respType == gripConsts.INV_STR:
			print('ERR: ' + commandStr + '(' + str(argumentList) + '): Invalid values')
			return ERR_INVALID_ARG
		return ERR_RECIEVE
	def __emptyCommand__(self,commandStr):
		self.__queueGripperCommand__(commandStr,list()) 
		cmdStr,cmdId,respType,retVals = self.__getQueuedGripperResponse__(defaultReturn='')
		return self.__checkCommandAcknowledge__(cmdStr,cmdId,respType,retVals,commandStr,list(),0)
	## COMMANDS: DATA STREAMING
	def data_stream(self):              # Sends DATA_STREAM, checks acknowledgement
		return self.__emptyCommand__(gripConsts.DATA_STREAM_STR)
	def data_stop(self):                # Sends DATA_STOP, discards acknowledgement, flushes input buffer
		if self.__emptyCommand__(gripConsts.DATA_STOP_STR) == COMMAND_SUCCESS:
			if IS_DEBUG:
				print('DBG: GripperClass.data_stop: May not have received acknowledgement')
		return COMMAND_SUCCESS
	## COMMANDS: GET/CLEAR STATE AND ERROR
	def clear_last_error(self):         # Sends CLEAR_LAST_ERROR, checks acknowledgement
		return self.__emptyCommand__(gripConsts.CLEAR_LAST_ERROR_STR)
	def clear_error_state(self):         # Sends CLEAR_ERROR_STATE, checks acknowledgement
		return self.__emptyCommand__(gripConsts.CLEAR_ERROR_STATE_STR)
	def get_state(self):                # Sends GET_STATE, checks acknowledgement, returns result
		return self.__getInt__(gripConsts.GET_STATE_STR,COMMAND_FAIL)
	def get_last_error(self):           # Sends GET_LAST_ERROR, checks acknowledgement, returns result
		return self.__getInt__(gripConsts.GET_LAST_ERROR_STR,COMMAND_FAIL)
	# def get_hardware_state(self):       # Sends GET_HARDWARE_STATE, checks acknowledgement, returns result
		#     return self.__getInt__(gripConsts.GET_HARDWARE_STATE_STR,COMMAND_FAIL)
	## COMMANDS: GET SENSOR DATA
	def get_width(self):                # Sends GET_WIDTH, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.GET_WIDTH_STR,COMMAND_FAIL)
	def get_vel(self):                  # Sends GET_VEL, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.GET_VEL_STR,COMMAND_FAIL)
	def get_imu(self):                  # Sends GET_IMU, checks acknowledgement, returns result
		imuDataDefault = list()
		for i in range(0,gripConsts.IMU_N):
			imuDataDefault.append(0)
		return self.__getFloatList__(gripConsts.GET_IMU_STR,imuDataDefault)
	def get_tactile(self):              # Sends GET_TACTILE, checks acknowledgement, returns result
		tactileDataDefault = list()
		for i in range(0,gripConsts.TACTILE_N):
			tactileDataDefault.append(0)
		return self.__getFloatList__(gripConsts.GET_TACTILE_STR,tactileDataDefault)
	def get_tactile_global(self):       # Sends GET_TACTILE_GLOBAL, checks acknowledgement, returns result
		tactileDataDefault = list()
		for i in range(0,gripConsts.TACTILE_GLOBAL_N):
			tactileDataDefault.append(0)
		return self.__getFloatList__(gripConsts.GET_TACTILE_GLOBAL_STR,tactileDataDefault)
	## COMMANDS: GET PARAMETERS
	def pc_get_vel(self):               # Sends PC_GET_VEL, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.PC_GET_VEL_STR,COMMAND_FAIL)
	def ff_get_vel(self):               # Sends FF_GET_VEL, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.FF_GET_VEL_STR,COMMAND_FAIL)
	def ff_get_force(self):             # Sends FF_GET_FORCE, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.FF_GET_FORCE_STR,COMMAND_FAIL)
	def df_get_vel(self):               # Sends DF_GET_VEL, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.DF_GET_VEL_STR,COMMAND_FAIL)
	def df_get_exf(self):               # Sends DF_GET_EXF, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.DF_GET_EXF_STR,COMMAND_FAIL)
	def df_get_mxf(self):               # Sends DF_GET_MXF, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.DF_GET_MXF_STR,COMMAND_FAIL)
	def df_get_dyn_exf(self):           # Sends DF_GET_DYN_EXF, checks acknowledgement, returns result
		return self.__getInt__(gripConsts.DF_GET_DYN_EXF_STR,COMMAND_FAIL)
	def df_get_shearg(self):               # Sends DF_GET_SHEARG, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.DF_GET_SHEARG_STR,COMMAND_FAIL)
	def df_get_torqg(self):               # Sends DF_GET_TORQG, checks acknowledgement, returns result
		return self.__getFloat__(gripConsts.DF_GET_TORQG_STR,COMMAND_FAIL)
	## COMMANDS: SET PARAMETERS 
	def reset_params(self):             # Sends RESET_PARAMS, checks acknowledgement
		return self.__emptyCommand__(gripConsts.RESET_PARAMS_STR)
	def pc_set_vel(self,vel):           # Sends PC_SET_VEL, checks acknowledgement
		return self.__setVariable__(gripConsts.PC_SET_VEL_STR,[vel])
	def ff_set_vel(self,vel):           # Sends FF_SET_VEL, checks acknowledgement
		return self.__setVariable__(gripConsts.FF_SET_VEL_STR,[vel])
	def ff_set_force(self,force):         # Sends FF_SET_FORCE, checks acknowledgement
		return self.__setVariable__(gripConsts.FF_SET_FORCE_STR,[force])
	def df_set_vel(self,vel):           # Sends DF_SET_VEL, checks acknowledgement
		return self.__setVariable__(gripConsts.DF_SET_VEL_STR,[vel])
	def df_set_exf(self,force):           # Sends DF_SET_EXF, checks acknowledgement
		return self.__setVariable__(gripConsts.DF_SET_EXF_STR,[force])
	def df_set_mxf(self,force):           # Sends DF_SET_MXF, checks acknowledgement
		return self.__setVariable__(gripConsts.DF_SET_MXF_STR,[force])
	def df_dyn_exf_en(self):            # Sends DF_DYN_EXF_EN, checks acknowledgement
		return self.__emptyCommand__(gripConsts.DF_DYN_EXF_EN_STR)
	def df_dyn_exf_dis(self):           # Sends DF_DYN_EXF_DIS, checks acknowledgement
		return self.__emptyCommand__(gripConsts.DF_DYN_EXF_DIS_STR)
	def df_set_shearg(self,gain):           # Sends DF_SET_SHEARG, checks acknowledgement
		return self.__setVariable__(gripConsts.DF_SET_SHEARG_STR,[gain])
	def df_set_torqg(self,gain):           # Sends DF_SET_TORQG, checks acknowledgement
		return self.__setVariable__(gripConsts.DF_SET_TORQG_STR,[gain])
	## COMMANDS: ACTION 
	def bias(self):                     # Sends BIAS, checks acknowledgement
		return self.__emptyCommand__(gripConsts.BIAS_STR)
	def pc_move_to_width(self,width):   # Sends PC_MOVE_TO_WIDTH, checks acknowledgement
		return self.__setVariable__(gripConsts.PC_MOVE_TO_WIDTH_STR,[width])
	def ff_grip(self):                  # Sends FF_GRIP, checks acknowledgement
		return self.__emptyCommand__(gripConsts.FF_GRIP_STR)
	def df_grip(self):                  # Sends DF_GRIP, checks acknowledgement
		return self.__emptyCommand__(gripConsts.DF_GRIP_STR)
	def stop(self):                     # Sends STOP, checks acknowledgement
		return self.__emptyCommand__(gripConsts.STOP_STR)
	def brake(self):                    # Sends BRAKE, checks acknowledgement
		return self.__emptyCommand__(gripConsts.BRAKE_STR)
	def release(self):                  # Sends RELEASE, checks acknowledgement
		return self.__emptyCommand__(gripConsts.RELEASE_STR)
	## Compound functions
	def printErrorCode(self, cmdStr, errorCode):
		print('ERR: While ' + cmdStr + ' Error Code: ' + str(errorCode))
	def waitUntil_idle_ready(self,timeout_s):
		start_time = time.time()
		error = gripConsts.ERR_NONE
		state = self.get_state()
		while state != gripConsts.IDLE_READY_STATE:
			if time.time() - start_time > timeout_s:
				return ERR_TIMEOUT
			if state == gripConsts.ERROR_STATE:
				error = self.get_last_error()
				self.printErrorCode('waitUntil_idle_ready',error)
				#if error == gripConsts.ERR_HARDWARE_FAULT:
				#	hardwareState = self.get_hardware_state()
				#	raise Exception('ERR: HARDWARE FAULT: ' + hardwareState)
				return error
			time.sleep(0.1) 
			state = self.get_state()
		return error
	def waitUntil_hold(self,holdState,timeout_s): # holdState can be gripConsts.FF_HOLD_STATE or gripConsts.DF_HOLD_STATE
		start_time = time.time()
		error = gripConsts.ERR_NONE
		state = self.get_state()
		while state != holdState:
			if time.time() - start_time > timeout_s:
				return ERR_TIMEOUT
			if state == gripConsts.ERROR_STATE:
				error = self.get_last_error()
				self.printErrorCode('waitUntil_hold',error)
				#if error == gripConsts.ERR_HARDWARE_FAULT:
				#	hardwareState = self.get_hardware_state()
				#	raise Exception('ERR: HARDWARE FAULT: ' + hardwareState)
				return error
			elif state == gripConsts.BUTTON_PRESS_STATE:
				return ERR_BUTTON_INTERRUPT
			time.sleep(0.1) 
			state = self.get_state()
		return error
	def waitUntil_ff_hold(self,timeout_s):
		return self.waitUntil_hold(gripConsts.FF_HOLD_STATE,timeout_s)
	def waitUntil_df_hold(self,timeout_s):
		return self.waitUntil_hold(gripConsts.DF_HOLD_STATE,timeout_s)
