from app.matrix_api.models.matrix_values import MatrixCommandModel, HexIdx, vol_map


class MatrixHexEncoder:

    def __init__(self):
        self.idx = HexIdx()

    def format_hex_cmd(self, params: list[int]):
        cmd_hex = [0x00] * 13
        cmd_hex[self.idx.cmd_type] = params[0]
        cmd_hex[self.idx.cmd_index] = params[1]
        cmd_hex[self.idx.cmd_para1] = params[2]
        cmd_hex[self.idx.cmd_para2] = params[3]
        cmd_hex[self.idx.cmd_para3] = params[4]

        # Handle double-byte parameters
        if params[2] > 0xff and params[3] > 0xff or params[4] > 0xff:
            cmd_hex[self.idx.cmd_para1] = params[2] // 0x100
            cmd_hex[self.idx.cmd_para1 + 1] = params[2] % 0x100
            cmd_hex[self.idx.cmd_para2] = params[3] // 0x100
            cmd_hex[self.idx.cmd_para2 + 1] = params[3] % 0x100
            cmd_hex[self.idx.cmd_para3] = params[4] // 0x100
            cmd_hex[self.idx.cmd_para3 + 1] = params[4] % 0x100
        else:
            cmd_hex[self.idx.cmd_para1] = params[2]
            cmd_hex[self.idx.cmd_para2] = params[3]
            cmd_hex[self.idx.cmd_para3] = params[4]

        # add verify
        cmd_hex = self.add_verify_byte(cmd_hex)
        # add preamble
        cmd_hex = self.add_preamble(cmd_hex)
        # convert to hex list
        return list(
            hex(x + 0x00)
            for x in cmd_hex
        )

    def add_verify_byte(self, cmd_hex):
        cmd_verify_index = 12
        cmd_hex[self.idx.cmd_verify] = 0xFF - (sum(cmd_hex) & 0xFF)
        # cmd_hex_str = [int(f'0x{x:02x}', 16) for x in cmd_hex]
        return cmd_hex

    def add_preamble(self, cmd_hex):
        cmd_hex[self.idx.preamble1] = 0xa5
        cmd_hex[self.idx.preamble2] = 0x5b
        return cmd_hex

    @staticmethod
    def pack_data(data) -> list:
        """
        Pack a list of bytes into 1029-byte packets.

        :param data: A list of bytes to be packed.
        :return: A list of packets, each consisting of 1029 bytes.
        """
        # Convert data to list of integers
        data = list(data)
        # Create list to hold upgrade packages
        upgrade_packages = []

        # Initialize variables
        num = 0xfe + 0xef
        verify = 0
        index = 0
        cmd = "fe,ef,00,00,"

        # Pad data with 0xFF to reach multiple of 1024
        if len(data) % 1024 != 0:
            count = 1024 - len(data) % 1024
            data += [255] * count

        # Split data into upgrade packages
        for i in range(len(data)):
            # Add data value to num
            num += data[i]
            # Append data value to cmd
            cmd += format(data[i], '02x') + ","
            # If 1024-byte boundary is reached, complete package and append to upgrade packages
            if (i + 1) % 1024 == 0:
                verify = (0x100 - num % 256)
                # Convert verify to hex string and remove leading 0x and trailing digit if it is 0
                verify = format(verify, '02x').replace("00", "")[-2:]
                cmd += verify
                upgrade_packages.append(cmd)
                index += 1
                num = 0xfe + 0xef + index
                if i == len(data) - 1 - 1024:
                    num += 0x80
                    cmd = "fe,ef,80," + format(index, '02x') + ","
                else:
                    cmd = "fe,ef,00," + format(index, '02x') + ","
        return upgrade_packages


mhe = MatrixHexEncoder()


def format_hex_cmd(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return mhe.format_hex_cmd(result)
    return wrapper


class MatrixHexCommands:

    def __init__(self):
        self.cmd = MatrixCommandModel()

    @format_hex_cmd
    def get_power_status(self):
        return self.cmd.PowerStatus[0], self.cmd.PowerStatus[1], 0, 0, 0, 0

    @format_hex_cmd
    def get_beep(self):
        return self.cmd.GetBeep[0], self.cmd.GetBeep[1], 0, 0, 0, 0

    @format_hex_cmd
    def get_hdmi_status(self):
        return self.cmd.GetHdmiStatus[0], self.cmd.GetHdmiStatus[1], 0, 0, 0, 0

    @format_hex_cmd
    def switch_hdmi(self, value1, value2):
        return self.cmd.SwitchHDMI[0], self.cmd.SwitchHDMI[1], value1, value2, 0, 0

    @format_hex_cmd
    def get_dhcp(self):
        return self.cmd.GetDHCP[0], self.cmd.GetDHCP[1], 0, 0, 0, 0

    @format_hex_cmd
    def set_dhcp(self, value):
        return self.cmd.SetDHCP[0], self.cmd.SetDHCP[1], value, 0, 0, 0

    @format_hex_cmd
    def get_network(self):
        return self.cmd.GetNetwork[0], self.cmd.GetNetwork[1], 0, 0, 0, 0

    @format_hex_cmd
    def set_gateway(self, value1, value2, value3, value4):
        return self.cmd.SetGateway[0], self.cmd.SetGateway[1], value1, value2, value3, value4

    @format_hex_cmd
    def get_address(self):
        return self.cmd.GetAddress[0], self.cmd.GetAddress[1], 0, 0, 0, 0

    @format_hex_cmd
    def set_address(self, value1, value2, value3, value4):
        return self.cmd.SetAddress[0], self.cmd.SetAddress[1], value1, value2, value3, value4

    @format_hex_cmd
    def get_gateway(self):
        return self.cmd.GetGateway[0], self.cmd.GetGateway[1], 0, 0, 0, 0

    @format_hex_cmd
    def get_mac_address(self):
        return self.cmd.GetMACAddr[0], self.cmd.GetMACAddr[1], 0, 0, 0, 0

    @format_hex_cmd
    def set_subnet(self, value1, value2, value3, value4):
        return self.cmd.SetSubnet[0], self.cmd.SetSubnet[1], value1, value2, value3, value4

    @format_hex_cmd
    def get_subnet(self):
        return self.cmd.GetSubnet[0], self.cmd.GetSubnet[1], 0, 0, 0, 0

    @format_hex_cmd
    def set_edid(self, value1, value2):
        return self.cmd.SetEdid[0], self.cmd.SetEdid[1], value1

    @format_hex_cmd
    def get_edid_all(self):
        return self.cmd.GetEdidAll[0], self.cmd.GetEdidAll[1], 0, 0, 0, 0

    @format_hex_cmd
    def get_edid_one(self, value):
        return self.cmd.GetEdidOne[0], self.cmd.GetEdidOne[1], value, 0, 0, 0

    @format_hex_cmd
    def get_audio(self):
        return self.cmd.GetAudio[0], self.cmd.GetAudio[1], 0, 0, 0, 0

    @format_hex_cmd
    def set_audio(self, value):
        return self.cmd.SetAudio[0], self.cmd.SetAudio[1], value, 0, 0, 0

    @format_hex_cmd
    def get_audio_status(self):
        return self.cmd.AudioStatus[0], self.cmd.AudioStatus[1], 0, 0, 0, 0

    @format_hex_cmd
    def get_unknown_or_arc(self):
        return self.cmd.UnknownOrARC[0], self.cmd.UnknownOrARC[1], 0, 0, 0, 0

    @format_hex_cmd
    def get_unknown_or_get_arc(self):
        return self.cmd.UnknownOrGetARC[0], self.cmd.UnknownOrGetARC[1], 0, 0, 0, 0

    @format_hex_cmd
    def get_arc(self):
        return self.cmd.GetARC[0], self.cmd.GetARC[1], 0, 0, 0, 0

    @format_hex_cmd
    def upgrade(self):
        return self.cmd.Upgrade[0], self.cmd.Upgrade[1], 0, 0, 0, 0

    @format_hex_cmd
    def upgrade_ready(self):
        return self.cmd.UpgradeReady[0], self.cmd.UpgradeReady[1], 0, 0, 0, 0
