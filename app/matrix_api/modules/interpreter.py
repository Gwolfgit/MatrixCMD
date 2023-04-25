from typing import Union
from app.matrix_api.models.matrix_values import MatrixCommandModel


mcm = MatrixCommandModel()


class HexInterpreter:

    def __init__(self):
        self.count = 0

    def __call__(self, hex_values: Union[hex, str]):
        """
        Interprets the hex hex_values stored in the HexInterpreter object and returns
        a tuple containing the command type, name and its parameters.

        Returns:
        --------
        tuple
            A tuple containing the command type, name, its parameters
            and the number of calls since this object was instantiated.
        """
        self.count += 1

        if len(hex_values) != 13:
            raise ValueError("Invalid hex code: length is not 13")

        try:
            cmd_name = mcm.get_param_name((int(hex_values[2], 16), int(hex_values[3], 16)))
        except ValueError:
            cmd_name = f'Unknown {int(hex_values[2], 16)} {int(hex_values[3], 16)}'

        cmd_parameters = list(
            int(h, 16)
            for h in hex_values[4:len(hex_values)-1]
        )
        #for i in range(4, 13, 2):
        #    if i + 1 < len(hex_values):
        #        cmd_parameters.append(int(hex_values[i][2:] + hex_values[i + 1][2:], 16))

        return cmd_name, cmd_parameters, self.count
