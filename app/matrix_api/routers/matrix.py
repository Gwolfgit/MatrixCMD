from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse

from app.matrix_api.modules.matrix_request import HttpRequest
from app.matrix_api.modules.matrix_hex import MatrixHexCommands

router = APIRouter()
mhex = MatrixHexCommands()
matrix_http = HttpRequest()


@router.post("/set_dhcp")
async def set_dhcp(toggle: int, request: Request):
    dev_resp = matrix_http.send_command(mhex.set_dhcp(toggle))
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_power_status")
async def get_power_status():
    dev_resp = matrix_http.send_command(mhex.get_power_status())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_beep")
async def get_beep():
    dev_resp = matrix_http.send_command(mhex.get_beep())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_hdmi_status")
async def get_hdmi_status():
    dev_resp = matrix_http.send_command(mhex.get_hdmi_status())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.post("/switch_hdmi")
async def switch_hdmi(output: int, hinput: int, request: Request):
    values = await request.json()
    dev_resp = matrix_http.send_command(mhex.switch_hdmi(output, hinput))
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_dhcp")
async def get_dhcp():
    dev_resp = matrix_http.send_command(mhex.get_dhcp())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_network")
async def get_network():
    dev_resp = matrix_http.send_command(mhex.get_network())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.post("/set_gateway")
async def set_gateway(oct1: int, oct2: int, oct3: int, oct4: int):
    dev_resp = matrix_http.send_command(mhex.set_gateway(oct1, oct2, oct3, oct4))
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_address")
async def get_address():
    dev_resp = matrix_http.send_command(mhex.get_address())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.post("/set_address")
async def set_address(oct1: int, oct2: int, oct3: int, oct4: int):
    dev_resp = matrix_http.send_command(mhex.set_address(oct1, oct2, oct3, oct4))
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_gateway")
async def get_gateway():
    dev_resp = matrix_http.send_command(mhex.get_gateway())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_mac_address")
async def get_mac_address():
    dev_resp = matrix_http.send_command(mhex.get_mac_address())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_subnet")
async def get_subnet():
    dev_resp = matrix_http.send_command(mhex.get_subnet())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.post("/set_subnet")
async def set_subnet(oct1: int, oct2: int, oct3: int, oct4: int):
    dev_resp = matrix_http.send_command(mhex.set_subnet(oct1, oct2, oct3, oct4))
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_edid_all")
async def get_edid_all():
    dev_resp = matrix_http.send_command(mhex.get_edid_all())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.post("/get_edid_one")
async def get_edid_one(value: int, request: Request):
    dev_resp = matrix_http.send_command(mhex.get_edid_one(value))
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_audio")
async def get_audio():
    dev_resp = matrix_http.send_command(mhex.get_audio())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.post("/set_audio")
async def set_audio(value: int, request: Request):
    dev_resp = matrix_http.send_command(mhex.set_audio(value))
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_audio_status")
async def get_audio_status():
    dev_resp = matrix_http.send_command(mhex.get_audio_status())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_unknown_or_arc")
async def get_unknown_or_arc():
    dev_resp = matrix_http.send_command(mhex.get_unknown_or_arc())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_unknown_or_get_arc")
async def get_unknown_or_get_arc():
    dev_resp = matrix_http.send_command(mhex.get_unknown_or_get_arc())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/get_arc")
async def get_arc():
    dev_resp = matrix_http.send_command(mhex.get_arc())
    return JSONResponse({"response": dev_resp, "status": "success"})


@router.get("/upgrade")
def upgrade():
    raise ValueError('Not Implemented')
    # cmd = mhex.upgrade()
    # dev_resp = matrix_http.send_command(cmd)
    # return JSONResponse({"response": dev_resp, "status": "success"})
