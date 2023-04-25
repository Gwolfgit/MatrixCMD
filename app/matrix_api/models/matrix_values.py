"""
0xa5: A header value that signals the start of the command.
0x5b: A header value that signals the start of the command.
self.cmdType: A value that represents the type of command to be sent.
self.cmdIndex: A value that represents the index of the command to be sent.
self.cmdPara1: A parameter value for the command.
self.cmdPara2: A parameter value for the command.
CMD.Power: A constant value that represents the power command.
0x01: A value that represents the number of parameters for the command.
value: The value of the parameter for the command.
0x00: A padding value.
self.cmdVerify: A verification value for the command.
0x00: A padding value.

ARC = audio return channel
"""
from typing import Tuple, Union
from pydantic import BaseModel


vol_map = list(range(0, 20, 2)) + list(range(21, 38)) + list(range(50, 120, 2)) + list(range(121, 256, 2))


class MatrixBaseModel(BaseModel):
    def get_param_name(self, value: Union[Tuple[int, int], int]) -> str:
        for name, member in self.dict().items():
            if member == value:
                return name
        raise ValueError(f"No parameter found with value {value}")


class HexIdx(MatrixBaseModel):
    preamble1: int = 0
    preamble2: int = 1
    cmd_type: int = 2
    cmd_index: int = 3
    cmd_para1: int = 4
    cmd_para2: int = 6
    cmd_para3: int = 8
    cmd_verify: int = 12


class MatrixCommandModel(MatrixBaseModel):
    PowerStatus: Tuple[int, int] = (8, 12)
    GetBeep: Tuple[int, int] = (1, 11)

    GetHdmiStatus: Tuple[int, int] = (2, 17)
    SwitchHDMI: Tuple[int, int] = (2, 3)

    GetDHCP: Tuple[int, int] = (34, 112)
    SetDHCP: Tuple[int, int] = (34, 10)
    GetNetwork: Tuple[int, int] = (34, 11)
    SetGateway: Tuple[int, int] = (34, 12)
    GetAddress: Tuple[int, int] = (34, 13)
    SetAddress: Tuple[int, int] = (34, 14)
    GetGateway: Tuple[int, int] = (34, 15)
    GetMACAddr: Tuple[int, int] = (34, 20)
    SetSubnet: Tuple[int, int] = (34, 113)
    GetSubnet: Tuple[int, int] = (34, 114)

    SetEdid: Tuple[int, int] = (3, 2)
    GetEdidAll: Tuple[int, int] = (6, 1)
    GetEdidOne: Tuple[int, int] = (6, 2)

    GetAudio: Tuple[int, int] = (8, 67)
    SetAudio: Tuple[int, int] = (8, 66)
    AudioStatus: Tuple[int, int] = (8, 69)
    UnknownOrARC: Tuple[int, int] = (1, 20)
    UnknownOrGetARC: Tuple[int, int] = (1, 21)
    GetARC: Tuple[int, int] = (16, 2)

    Upgrade: Tuple[int, int] = (8, 7)
    UpgradeReady: Tuple[int, int] = (8, 8)


class UnknownCommands(MatrixBaseModel):
    # Undefined
    Unknown: int = 1
    UnknownSwitch: int = 3
    UnknownEDID: int = 2
    UnknownNetwork: int = 114
    UnknownDHCP: int = 113
    # page 1
    Power: int = 10
    GetPower: int = 11
    Beep: int = 12
    GetBeep: int = 13
    Restore: int = 14
    Reboot: int = 15
    GetSI: int = 16
    GetSO: int = 17
    # page 2
    ARC: int = 20
    GetARC: int = 21
    INOUT: int = 22
    GetOUT: int = 23
    Audio: int = 24
    GetAudio: int = 25
    GetEdidAll: int = 28
    # page 3
    AudioIn: int = 30
    GetAudioIn: int = 31
    Delay: int = 32
    GetDelay: int = 33
    Vol: int = 34
    GetVol: int = 35
    # page 4
    EDID: int = 40
    EDIDAll: int = 41
    EDIDCopy: int = 42
    EDIDCopyAll: int = 43
    GetEDID: int = 44
    # page 5
    DHCP: int = 45
    GetDHCP: int = 46
    IP: int = 47
    GetIP: int = 48
    Gate: int = 49
    GetGate: int = 50
    Subnet: int = 51
    GetSubnet: int = 52
    Mac: int = 53
    GetMac: int = 54
    # page 6
    Upgrade: int = 55
    UpgradeReady: int = 56


class SelectEdid(MatrixBaseModel):
    p720_Stereo_Audio_20: int = 1
    p1080_Stereo_Audio_20: int = 2
    p1080_Dolby_DTS_51: int = 3
    p1080_HD_Audio_71: int = 4
    i1080_Stereo_Audio_20: int = 5
    i1080_Dolby_DTS_51: int = 6
    i1080_HD_Audio_71: int = 7
    p3D_Stereo_Audio_20: int = 8
    p3D_Dolby_DTS_51: int = 9
    p3D_HD_Audio_71: int = 10
    p4K2K30_444_Stereo_Audio_20: int = 11
    p4K2K30_444_Dolby_DTS_51: int = 12
    p4K2K30_444_HD_Audio_71: int = 13
    p4K2K60_420_Stereo_Audio_20: int = 14
    p4K2K60_420_Dolby_DTS_51: int = 15
    p4K2K60_420_HD_Audio_71: int = 16
    p4K2K60_444_Stereo_Audio_20: int = 17
    p4K2K60_444_Dolby_DTS_51: int = 18
    p4K2K60_444_HD_Audio_71: int = 19


class SelectAudio(MatrixBaseModel):
    HDMI_INPUT_1: int = 1
    HDMI_INPUT_2: int = 2
    HDMI_INPUT_3: int = 3
    HDMI_INPUT_4: int = 4
    HDMI_INPUT_5: int = 5
    HDMI_INPUT_6: int = 6
    HDMI_INPUT_7: int = 7
    HDMI_INPUT_8: int = 8
    ARC_1: int = 9
    ARC_2: int = 10
    ARC_3_Remote_SPDIF1: int = 11
    ARC_4_Remote_SPDIF2: int = 12
    ARC_5_Remote_SPDIF3: int = 13
    ARC_6_Remote_SPDIF4: int = 14
    ARC_7_Remote_SPDIF5: int = 15
    ARC_8_Remote_SPDIF6: int = 16
    ANALOG_1: int = 17
    ANALOG_2: int = 18
    SPDIF_1: int = 19
    SPDIF_2: int = 20
    COAXIAL_1: int = 21
    COAXIAL_2: int = 22


class SelectAVDelay(MatrixBaseModel):
    DELAY_0MS: str = '1'
    DELAY_10MS: str = '2'
    DELAY_20MS: str = '3'
    DELAY_30MS: str = '4'
    DELAY_40MS: str = '5'
    DELAY_50MS: str = '6'
    DELAY_60MS: str = '7'
    DELAY_70MS: str = '8'
    DELAY_80MS: str = '9'
    DELAY_90MS: str = '10'
    DELAY_100MS: str = '11'
    DELAY_110MS: str = '12'
    DELAY_120MS: str = '13'
    DELAY_130MS: str = '14'
    DELAY_140MS: str = '15'
    DELAY_150MS: str = '16'
    DELAY_160MS: str = '17'
    DELAY_170MS: str = '18'
    DELAY_180MS: str = '19'
    DELAY_190MS: str = '20'
    DELAY_200MS: str = '21'
    DELAY_210MS: str = '22'
    DELAY_220MS: str = '23'
    DELAY_230MS: str = '24'
    DELAY_240MS: str = '25'
    DELAY_250MS: str = '26'
    DELAY_260MS: str = '27'
    DELAY_270MS: str = '28'
    DELAY_280MS: str = '29'
    DELAY_290MS: str = '30'
    DELAY_300MS: str = '31'


class SelectHDMI(MatrixBaseModel):
    HDMI_INPUT_1: str = '1'
    HDMI_INPUT_2: str = '2'
    HDMI_INPUT_3: str = '3'
    HDMI_INPUT_4: str = '4'
    HDMI_INPUT_5: str = '5'
    HDMI_INPUT_6: str = '6'
    HDMI_INPUT_7: str = '7'
    HDMI_INPUT_8: str = '8'



