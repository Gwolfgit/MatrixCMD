# MatrixCMD

Product: Monoprice Blackbird Pro 8x8 HDMI Switch

Product #: 39665

Link: https://www.monoprice.com/product?p_id=39665

The IP control provided by the Blackbird Pro doesn't have a usable API. 
I reverse-engineered the web UI using a reverse proxy and read through the javascript in order to produce this JSON API. 
Included is the JSON API as well as the debugging proxy and the classes and models that I used for reverse engineering.

The UI communicates with the device over http using strings of hex values. 
Each command has a command type and a command index. The command types are loosely associated with the tabs presented in the UI but otherwise, 
I don't completely understand their usage. Therefore, each command is represented by a Tuple containing two integers (the type and index) in the 
MatrixHexCommands model. 

The debugging proxy will download the device's static files to the local directory app/matrix_api/proxy_data if you visit the web UI through the proxy.
Once those files are present, the proxy will intercept them and return the local file instead of the file from the device. This is useful if you want 
to muck around and change things...


This code is not production ready, but it should work(ish).

To do:
- Finish reverse engineering commands
- Finish Docker implementation
- Finish custom 'saved configurations' API option
- Finish OAuth2 implementation
- Use pydantic parameter models for command parameters
- Remove deprecated code
- Add support for multiple upstreams (Matrix Switch Devices)
