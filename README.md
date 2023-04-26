# MatrixCMD

Product: Monoprice Blackbird Pro 8x8 HDMI Switch

Product #: 39665

Link: https://www.monoprice.com/product?p_id=39665

![alt text](https://github.com/Gwolfgit/MatrixCMD/blob/master/fastapidocs.png?raw=true)

## Synopsis

The Blackbird Pro doesn't have a usable API despite the company advertising IP control. 
I reverse-engineered the web UI using a debugging proxy in order to produce this API. 
Included is the API as well as the debugging proxy and the classes and models that I used for reverse engineering.

## Details

The UI communicates with the device over http using strings of hex values. 
Commands sent to the device's /cgi-bin/submit endpoint do not return results. 
Instead, another request to /cgi-bin/query is executed immediately after each command to fetch the result. 
This API eliminates the need to make two calls against the device endpoints and will return the appropriate results for a single request asynchronously. 
Each command has a command type and a command index. The command types are loosely associated with the tabs presented in the UI but otherwise, 
I don't completely understand their usage. Therefore, each command is represented by a Tuple containing two integers (the type and index) in the 
MatrixHexCommands model. 

The debugging proxy will download the device's static files to the local directory app/matrix_api/proxy_data if you visit the web UI through the proxy.
Once those files are present, the proxy will intercept them and return the local file instead of the file from the device. This is useful if you want 
to muck around and change things. The files "favicon.ico" and "normalize.min.css.map" are provided in the repo as they are not provided by the device.

The web ui proxy is accessible at /ui and as usual, the OpenAPI documentation is available at /docs and /redoc.

### Notes

This code is not production ready, but it should work(ish).

To do:
- Finish reverse engineering commands
- Finish Docker implementation
- Finish custom 'saved configurations' API option
- Finish OAuth2 implementation
- Use pydantic parameter models for command parameters
- Remove deprecated code
- Add support for multiple upstreams (Matrix Switch Devices)

## To use

clone the repo

cd MatrixCMD

python3.9 -m venv venv

. venv/bin/activate

pip install -r requirements.txt

mv .env.example to .env and set appropriate values

uvicorn app.main:app

