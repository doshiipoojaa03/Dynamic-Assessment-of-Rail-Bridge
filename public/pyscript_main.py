'''                                                                     
                                                      __             
 _____    __  __                ___ ___       __     /\_\     ___    
/\ '__`\ /\ \/\ \             /' __` __`\   /'__`\   \/\ \  /' _ `\  
\ \ \L\ \\ \ \_\ \            /\ \/\ \/\ \ /\ \L\.\_  \ \ \ /\ \/\ \ 
 \ \ ,__/ \/`____ \           \ \_\ \_\ \_\\ \__/.\_\  \ \_\\ \_\ \_\
  \ \ \/   `/___/> \  _______  \/_/\/_/\/_/ \/__/\/_/   \/_/ \/_/\/_/
   \ \_\      /\___/ /\______\                                       
    \/_/      \/__/  \/______/                                       

'''

# this is sample code for python script.
# if you want to use other python files, import here and functions export your javascript code.
import numpy as np
import pandas 
import math
import matplotlib.pyplot as plt
import json , requests
from scipy.interpolate import make_interp_spline
from pyscript_engineers_web import set_g_values, get_g_values, requests_json
from pyscript_engineers_web import MidasAPI, Product

# Define global variables
base_url = None
mapi_key = None

civil = None

def initialize_globals():
    global base_url, mapi_key
    values = json.loads(get_g_values())
    g_base_uri = values["g_base_uri"]
    g_base_port = values["g_base_port"]
    base_url = f'https://{g_base_uri}:{g_base_port}/civil'
initialize_globals()
def HelloWorld():
	return (f'Hello World! this message is from def HelloWorld of PythonCode.py')

def ApiGet():
	values = json.loads(get_g_values())
	base_uri = values["g_base_uri"]
	res = requests_json.get(url=f'https://{base_uri}/health', headers={
		'Content-Type': 'application/json'
	})
	return json.dumps(res)

# Basic CRUD Sample
def py_db_create(item_name, items):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_create(item_name, json.loads(items)))

def py_db_create_item(item_name, item_id, item):
  civil = MidasAPI(Product.CIVIL, "KR")
  return json.dumps(civil.db_create_item(item_name, item_id, json.loads(item)))

def py_db_read(item_name):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_read(item_name))

def py_db_read_item(item_name, item_id):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_read_item(item_name, item_id))

def py_db_update(item_name, items):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_update(item_name, json.loads(items)))

def py_db_update_item(item_name, item_id, item):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_update_item(item_name, item_id, json.loads(item)))

def py_db_delete(item_name, item_id):
	civil = MidasAPI(Product.CIVIL, "KR")
	return json.dumps(civil.db_delete(item_name, item_id))

'''
                            __                         __                                
                     __    /\ \__                     /\ \                               
 __  __  __   _ __  /\_\   \ \ ,_\     __             \ \ \___       __    _ __     __   
/\ \/\ \/\ \ /\`'__\\/\ \   \ \ \/   /'__`\            \ \  _ `\   /'__`\ /\`'__\ /'__`\ 
\ \ \_/ \_/ \\ \ \/  \ \ \   \ \ \_ /\  __/             \ \ \ \ \ /\  __/ \ \ \/ /\  __/ 
 \ \___x___/' \ \_\   \ \_\   \ \__\\ \____\             \ \_\ \_\\ \____\ \ \_\ \ \____\
  \/__//__/    \/_/    \/_/    \/__/ \/____/  _______     \/_/\/_/ \/____/  \/_/  \/____/
                                             /\______\                                   
                                             \/______/                                   
'''
# ↓↓↓↓↓↓↓↓↓↓↓↓ write a main logic here ↓↓↓↓↓↓↓↓↓↓↓↓

# import matplotlib.pyplot as plt

# 입력
# '''
# name = input("Input Function Name :")#func name
# soilClass = input("Input sub soilClass:") #Site sub soil class name
# rf = float(input("Input return period factor:")) # return p factor
# hf=float(input("Input hazard factor:")) # hazard factor
# dist = float(input("Input the distance from Nearest major fault:")) # distance from nearest major fault
# df = float(input("Input design ductility factor :")) #ductility factor
# max_period = float(input("Input max_period(sec):")) #max_period


#ch_T함수
# def ch_T(max_period, period, soilClass):
#     DATA = []  # {period, Result}를 저장할 리스트
#     mp = max_period
#     increment = mp * 1/100  # 증가량
#     p = 0.0
#     for _ in range(len(period)):  # 0부터 101까지 102개의 데이터 생성
#         if soilClass == "A" or soilClass =="B":
#             while p <= max_period:  # p가 mp 이하인 동안 반복
#                 if p > 3:
#                     cht = 3.15 / (p ** 2)
#                 elif p > 1.5:
#                     cht = 1.05 / p
#                 elif p >= 0.3:
#                     cht = 1.6 * (0.5 / p) ** 0.75
#                 elif p > 0.1:
#                     cht = 2.35
#                 else:
#                     cht = 1
#                 DATA.append(cht)
#                 p += increment  # p 값을 증가

#         elif soilClass == "C":
#             while p <= mp:
#                 if p > 3:
#                     cht = 3.96 / (p ** 2)
#                 elif p > 1.5:
#                     cht = 1.32 / p
#                 elif p >= 0.3:
#                     cht = 2 * (0.5 / p) ** 0.75
#                 elif p > 0.1:
#                     cht = 2.93
#                 else:
#                     cht = 1.33
#                 DATA.append(cht)
#                 p += increment
#         elif soilClass == "D":
#             while p <= mp:
#                 if p > 3:
#                     cht = 6.42 / (p ** 2)
#                 elif p > 1.5:
#                     cht = 2.14 / p
#                 elif p >= 0.56:
#                     cht = 2.4 * (0.75 / p) ** 0.75
#                 elif p > 0.1:
#                     cht = 3
#                 elif p > 0:
#                     cht = 1.12 + 1.88 * (p / 0.1)
#                 else:
#                     cht = 1.12
#                 DATA.append(cht)
#                 p += increment
#         elif soilClass == "E":
#             while p <= mp:
#                 if p > 3:
#                     cht = 9.96 / (p ** 2)
#                 elif p > 1.5:
#                     cht = 3.32 / p
#                 elif p >= 1.0:
#                     cht = 3.0 / (p ** 0.75)
#                 elif p > 0.1:
#                     cht = 3
#                 elif p > 0:
#                     cht = 1.12 + 1.88 * (p / 0.1)
#                 else:
#                     cht = 1.12
#                 DATA.append(cht)
#                 p += increment
#     return DATA


# def nTD(max_period, period, dist):
#     DATA = []
#     mp = max_period
#     increment = mp * 1/100  # 증가량
#     p = 0.0  # 초기 p 값 설정
#     for _ in range(len(period)):
#         # nmax 계산
#         if p >= 5:
#             nmax = 1.72
#         elif p >= 4:
#             nmax = 0.12 * p + 1.12
#         elif p > 1.5:
#             nmax = 0.24 * p + 0.64
#         else:
#             nmax = 1
        
#         # nTD 계산
#         if dist > 20:
#             nTD = 1
#         elif dist > 2:
#             nTD = 1 + (nmax - 1) * (20 - dist) / 18
#         else:
#             nTD = nmax
        
#         DATA.append(nTD)
#         p += increment  # p 값을 증가시킴

#     return DATA


# def NZ_input(soilClass, rf, hf, dist, df, max_period):
#     #period 초기값 및 p 값을 증가시키면서 max_period까지 누적
#     p=0
#     per_list=[]
#     while p <= max_period:
#         per_list.append(round(p,5))
#         p+=max_period*0.01

#     period=sorted(set(per_list))
#     CHT= ch_T(max_period, period, soilClass)
#     NTD = nTD(max_period, period, dist)

#     NTCH=[a*b for a,b in zip(NTD,CHT)]
#     value= [x*rf*hf/df for x in NTCH]

#     return json.dumps({
# 		  "period": period,
# 			"value": value
# 		})
#     # ==================================== Convert Period, value to aFUNC ================================== #
# def to_aFUNC(period, value):
#     # 결과 출력
#     #print(period)
#     #print(value)
#     aFUNC = []
#     for i in range(len(period)):
#         PERIOD = period[i]
#         VALUE = value[i]
#         aFUNC.append({"PERIOD":PERIOD, "VALUE":VALUE})
#     return aFUNC

#     # ==================================== Ploting the Graph (Preview)================================== #
# # def plot(period,value):
# #     civilApp = MidasAPI(Product.CIVIL, "KR")
# #     plt.plot(period,value)
# #     plt.title("NZS1170.5 (2004)")
# #     plt.xlabel("Period(sec)")
# #     plt.ylabel("Spectral Data(g)")

# #     plt.grid(True)


# #     plt.show()

# # ==================================== Gravity Value by Unit ================================== #
# def UNIT_GET():
#     civilApp = MidasAPI(Product.CIVIL, "KR")
#     unit = civilApp.db_read("UNIT")
#     #유닛에 따른 GRAV 값을 지정합니다.
#     dist_unit = unit[1]['DIST']
#     GRAV_const = 9.806
#     if dist_unit == "M":
#         GRAV_const = 9.806
#     elif dist_unit == "CM":
#         GRAV_const = 980.6
#     elif dist_unit == "MM":
#         GRAV_const = 9806
#     elif dist_unit == "IN":
#         GRAV_const = 386.063
#     else:
#         GRAV_const = 32.1719
#     return GRAV_const

# # ==================================== RS 입력 ================================== #

# def SPFC_UPDATE(ID,name,GRAV, aFUNC):
#     civilApp = MidasAPI(Product.CIVIL, "KR")
#     data = {
#         "NAME": name,
#         "iTYPE": 1,
#         "iMETHOD": 0,
#         "SCALE": 1,
#         "GRAV": GRAV,
#         "DRATIO": 0.05,
#         "STR": {
#             "SPEC_CODE": "USER"
#         },
#         "aFUNC": aFUNC
#     }
#     civilApp.db_update_item("SPFC", ID, data)
    
#     result_message = {"success":"Updating SPFC is completed"}
#     return json.dumps(result_message)
    
# def main_NZS1170_5_2004(
#   func_name: str,
# 	soilClass: str, 
#  	rf: float, 
#  	hf: float, 
#   dist: float, 
#   df: float, 
#   max_period: float
# ):
#   # for graph data
# 	inputs = json.loads(NZ_input(soilClass, rf, hf, dist, df, max_period)) 	# Seismic Data, Maximum Period (sec)
# 	aPeriod = inputs["period"] 																# Period
# 	aValue = inputs["value"] 																	# Spectral Data
	
# 	# do SPFC_UPDATE
# 	civilApp = MidasAPI(Product.CIVIL, "KR")
# 	ID = civilApp.db_get_next_id("SPFC")
# 	name = func_name 																					# func name
# 	aFUNC = to_aFUNC(aPeriod, aValue)
# 	GRAV = UNIT_GET()
# 	return SPFC_UPDATE(ID,name,GRAV, aFUNC)

# ==================================== API CALL ================================== #
# inputs = json.loads(NZ_input("A",1.3,0.08,2.0,1.5,6.0)) 	# Seismic Data, Maximum Period (sec)
# aPeriod = inputs["period"] 									# Period
# aValue = inputs["value"] 										# Spectral Data
# plot(aPeriod,aValue)																	# Plotting the Graph
# ID=civilApp.db_get_next_id("SPFC")
# name="RS01" 																					#func name
# aFUNC = to_aFUNC(aPeriod, aValue)
# GRAV = UNIT_GET()
# SPFC_UPDATE(ID,name,GRAV, aFUNC)
def MidasAPI_gen(method, command, body=None):
    # base_url = "https://moa-engineers.midasit.com:443/civil"
    # mapi_key = "eyJ1ciI6IklOMjQwNkVRQ0YiLCJwZyI6ImNpdmlsIiwiY24iOiJiUmFYcldHYVNBIn0.fe07df5455b5a464e915494756a490c4b3af771c5ff922470fb09274fd1c4379"
    # global base_url, mapi_key  # Ensure the function uses the global variables
    # print(f"mapi_key {mapi_key}")
    # print(f"Sending {method} request to {base_url + command} with body: {body} and mapi_key: {mapi_key}")  // com`ment out for security`
    url = base_url + command
    headers = {"Content-Type": "application/json", "MAPI-Key": mapi_key}
    try:
        response = requests.request(method, url, headers=headers, json=body)  
        response.raise_for_status()
        # print(f"{method} {command}: {response.status_code}") // com`ment out for security`
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None
# Rail Load API 

# Expose PyScript global setter so React can access it
_g_values = {}
def set_g_values(payload):
    global _g_values, civil, base_url, mapi_key
    _g_values = json.loads(payload)
    g_base_uri = _g_values["g_base_uri"]
    g_base_port = _g_values["g_base_port"]
    mapi_key = _g_values["g_mapi_key"]
    base_url = f'https://{g_base_uri}:{g_base_port}/civil'
    civil = MidasAPI(Product.CIVIL, "KR")

def get_g_values():
    return json.dumps(_g_values)

def Track_details(group_name, groups, nodes):
    track_details = []
    track_nodes = None
    for group in groups['GRUP'].values():
        if group['NAME'] == group_name:
            track_nodes = group['N_LIST']
            break
    for node_id, node_details in nodes['NODE'].items():
        if int(node_id) in track_nodes:
            track_details.append([int(node_id), node_details['X'], node_details['Y'], node_details['Z']])
    coordinate = [[0, 0]] * (len(track_details) + 1)
    for x in range(0, len(track_details)):
        coordinate[x] = [track_details[x][0], math.sqrt((float(track_details[x][1]) - float(track_details[x-1][1])) ** 2 + (float(track_details[x][2]) - float(track_details[x-1][2])) ** 2 + (float(track_details[x][3]) - float(track_details[x-1][3])) ** 2)]
    coordinate[0][1] = 0
    bridge_length = sum(item[1] for item in coordinate)
    return coordinate, bridge_length

def damping(L, bridge_type):
    if L < 20:
        if bridge_type == "Steel and Composite":
            total_damping = (0.5 + 0.125 * (20 - L)) / 100
        elif bridge_type == "Prestressed Concrete":
            total_damping = (1 + 0.07 * (20 - L)) / 100
        else:
            total_damping = (1.5 + 0.07 * (20 - L)) / 100
    else:
        if bridge_type == "Steel and Composite":
            total_damping = 0.5 / 100
        elif bridge_type == "Prestressed Concrete":
            total_damping = 1.0 / 100
        else:
            total_damping = 1.5 / 100
    if L < 30:
        total_damping += ((0.0187 * L - 0.00064 * L**2) / (1 - 0.0441 * L - 0.0044 * L**2 + 0.000255 * L**3)) / 100
    return total_damping

def girder_nodes(group_name, groups):
    for group in groups['GRUP'].values():
        if group['NAME'] == group_name:
            return group['N_LIST']
    return []

def convert_numpy(obj):
    if isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(v) for v in obj]
    elif isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return float(obj)
    else:
        return obj

def force_functions(train_load, coordinate, speeds, bridge_length, train_length, damping, time_step):
    force_function_template = [[0, 0]] * len(train_load) * 3
    THFC = {"Assign": {}}
    THNL = {"Assign": {}}
    counter = 1
    epsilon = 1e-6
    for n in range(len(speeds)):
        v = int(speeds[n]) * 5 / 18
        for x in range(0, len(coordinate)-1):
            z = 0
            prev_time = -float('inf')
            force_function = [None] * len(force_function_template)
            for y in range(0, len(force_function)):
                if y % 3 == 0:
                    time = sum(train_load.iloc[0:z+1, 1]) / v
                    value = 0
                elif y % 3 == 1:
                    time = (sum(train_load.iloc[0:z+1, 1]) + coordinate[x][1]) / v
                    value = train_load.iloc[z, 2]
                else:
                    time = (sum(train_load.iloc[0:z+1, 1]) + coordinate[x][1] + coordinate[x+1][1]) / v
                    value = 0
                    z += 1
                if time <= prev_time:
                    time = prev_time + epsilon
                prev_time = time
                force_function[y] = [time, value]
            if x == 0:
                force_function = force_function[1:]
            afunc_data = [{"TIME": round(entry[0], 6), "VALUE": round(entry[1], 6)} for entry in force_function]
            THFC["Assign"][counter] = {
                "NAME": f"{speeds[n]}-{coordinate[x][0]}",
                "FUNCTYPE": 1,
                "iTYPE": 3,
                "iMETHOD": 0,
                "SCALE": 1,
                "GRAV": 9.806,
                "aFUNCDATA": afunc_data
            }
            key = str(coordinate[x][0])
            item = {
                "ID": n+1,
                "THLCNAME": str(speeds[n]),
                "FUNC_NAME": f"{speeds[n]}-{coordinate[x][0]}",
                "DIR": "Z",
                "ARRIVAL_TIME": sum(coordinate[i][1] for i in range(0, x)) / v,
                "SCALE_FACTOR": -1
            }
            if key not in THNL["Assign"]:
                THNL["Assign"][key] = {"ITEMS": []}
            THNL["Assign"][key]["ITEMS"].append(item)
            counter += 1
    THLC = {"Assign": {}}
    for x in speeds:
        THLC["Assign"][x] = {
            "COMMON": {
                "NAME": str(x),
                "iATYPE": 1,
                "iAMETHOD": 1,
                "iTHTYPE": 1,
                "iGEOM": 0,
                "ENDTIME": math.ceil((bridge_length + train_length) / (int(x) * 5 / 18)) + 5,
                "INC": time_step,
                "iOUT": 1,
                "INITLOAD": 0,
                "INITMETHOD": "ORDER",
                "bSUBSEQ": False,
                "bKEEP": False,
                "bDVA": False,
                "iMDTYPE": 1
            },
            "DALL": damping
        }
    return THLC, THFC, THNL

# ------------------ High-Level Callable ------------------
def run_analysis():
    Analysis = {}
    return MidasAPI_gen("POST", "/doc/ANAL", Analysis)

# ------------------ Main callable for plotting ------------------
def run_analysis_with_inputs(initial, final, step, time_step, bridge_type, damping_input, file_path, track_group, girder_group, global_key):
    globals()['mapi_key'] = global_key
    # print(mapi_key);
    # grp = MidasAPI_gen("GET","/db/grup",{})
    # print(grp);
    units = {"Assign": {"1": {"FORCE": "KN", "DIST": "M", "HEAT": "BTU", "TEMPER": "C"}}}
    MidasAPI_gen("PUT","/db/unit", units)
    # print(uni)

    groups = MidasAPI_gen("GET","/db/grup",{})
    nodes = MidasAPI_gen("GET","/db/node",{})
    # print(groups)
    # print(nodes)

    coordinate, bridge_length = Track_details(track_group, groups, nodes)
    # data = json.loads(file_path)
    # print(data)

    # train_load = pandas.DataFrame([data])
    #print(file)
    
    data_flat = json.loads(file_path)
    array = np.array(data_flat).reshape(-1, 3)
    train_load = pandas.DataFrame(array, columns=["Index", "Col1", "Col2"])
    
    # train_load = file_path
    # train_load = pandas.read_excel(file_path, sheet_name=0, header=None)
    # print(train_load)
    damping_val = float(damping_input) if bridge_type == "User defined" else damping(bridge_length, bridge_type)
    train_length = sum(train_load.iloc[:, 1])
    speeds = np.arange(initial, final + step, step).astype(int).astype(str)
    

    THLC, THFC, THNL = force_functions(train_load, coordinate, speeds, bridge_length, train_length, damping_val, time_step)
    # print(THLC,THFC,THNL)
    THFC_clean = convert_numpy(THFC)
    # print(THFC_clean)
    MidasAPI_gen("PUT","/db/thfc", THFC_clean)
    
    THLC_clean = convert_numpy(THLC)
    THNL_clean = convert_numpy(THNL)
    # print("THLC_CLEAN",THLC_clean)

    MidasAPI_gen("PUT","/db/this", THLC_clean)
    MidasAPI_gen("PUT","/db/thnl", THNL_clean)
    MidasAPI_gen("POST", "/doc/ANAL",THNL_clean)

    abs_max_values = []
    girder_nodes_list = girder_nodes(girder_group, groups)
    for x in speeds:
        acc = {
            "Argument": {
                "TABLE_TYPE": "THISABSOLUTEACCEL",
                "COMPONENTS": ["DZ/DZ"],
                "NODE_ELEMS": {"KEYS": girder_nodes_list},
                "LOAD_CASE_NAMES": [f"{x}(TH:max)", f"{x}(TH:min)"]
            }
        }
        response = MidasAPI_gen("POST", "/post/table",acc)
        if response and "empty" in response and "DATA" in response["empty"]:
            data_rows = response["empty"]["DATA"]
            dz_dz_values = [abs(float(row[1])) for row in data_rows]
            abs_max_values.append(max(dz_dz_values))
        else:
            abs_max_values.append(0)

    x_vals = np.array(speeds).astype(int)
    y_vals = np.array(abs_max_values)
    sorted_idx = np.argsort(x_vals)
    x_vals = x_vals[sorted_idx]
    y_vals = y_vals[sorted_idx]

    x_smooth = np.arange(initial, final + step, step)
    spline = make_interp_spline(x_vals, y_vals, k=2)
    y_smooth = spline(x_smooth)

    # Convert to regular lists for JS/React
    points = [{"x": float(x), "y": float(y)} for x, y in zip(x_smooth, y_smooth)]

    result = {
        "status": "completed",
        "points": points
    }
    return json.dumps(result)