import os
from typing import Optional
import traceback

import httpx
from loguru import logger
from fastapi import HTTPException, Response, Request, APIRouter
from fastapi.responses import FileResponse

from app.matrix_api.modules.utils import get_hex_dec_body, get_hex_dec_url
from app.matrix_api.modules.interpreter import HexInterpreter
from app.matrix_api.models.config import settings

from .. import BASE_DIR

router = APIRouter()
interpret = HexInterpreter()
INTERCEPT_HTML = False


@router.get("/favicon.ico")
async def proxy_favicon():
    return FileResponse(os.path.join(BASE_DIR, 'proxy_data', 'favicon.ico'))


@router.get("/css/{static_file}")
@router.get("/js/{static_file}")
async def proxy_static(static_file: str, request: Request):

    static_file_path = os.path.join(BASE_DIR, 'proxy_data', static_file)

    if not os.path.isfile(static_file_path):
        try:
            upstream_path = 'js' if '.js' in static_file else 'css'
            upstream_url = f"{settings.upstream}/{upstream_path}/" + static_file
            headers = dict(request.headers)
            async with httpx.AsyncClient() as client:
                response = await client.get(upstream_url, headers=headers)
                with open(static_file_path, 'wb') as f:
                    f.write(response.content)
        except Exception as exc:
            logger.debug(exc)
            raise HTTPException(status_code=500, detail="Upstream service error") from exc

    return FileResponse(static_file_path)


@router.get("/cgi-bin/{method}")
async def proxy_cgi(method: str, request: Request, cmd: Optional[str] = None, _: str = None):

    try:
        if method in ['instr', 'upload', 'upload?', 'upgrade']:
            raise HTTPException(status_code=500, detail="This proxy does not support firmware upgrades.")
        elif method == 'submit' and cmd is not None:
            upstream_url = f"{settings.upstream}/cgi-bin/submit?cmd={cmd}&_={_}"
            hex, dec = get_hex_dec_url(upstream_url)
            cmd_name, cmd_parameters, cmd_count = interpret(hex)
            logger.debug(
                f"REQUEST {cmd_name} {cmd_parameters} "
                f"hex({hex}), dec({dec}) #{cmd_count}"
            )

            if settings.proxy_log_commands:
                with open(os.path.join(BASE_DIR, 'output', 'commands.txt'), 'a') as f1:
                    f1.write(
                        f"{cmd_name} {cmd_parameters} "
                        f"hex({hex}), dec({dec}) #{cmd_count}\n"
                    )
        else:
            upstream_url = f"{settings.upstream}/cgi-bin/query?_={_}"

        headers = dict(request.headers)
        async with httpx.AsyncClient() as client:
            response = await client.get(upstream_url, headers=headers)
            if len(response.content):
                hex, dec = get_hex_dec_body(response.content.decode())
                cmd_name, cmd_parameters, cmd_count = interpret(hex)
                logger.debug(
                    f"RESPONSE {cmd_name} {cmd_parameters} "
                    f"hex({hex}), dec({dec}) #{cmd_count}"
                )

                if settings.proxy_log_responses:
                    with open(os.path.join(BASE_DIR, 'output', 'responses.txt'), 'a') as f2:
                        f2.write(
                            f"{cmd_name} {cmd_parameters} "
                            f"hex({hex}), dec({dec}) #{cmd_count}\n"
                        )
            return Response(content=response.content, status_code=response.status_code, headers=response.headers)
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Upstream service error") from exc


@router.get("/ui")
async def proxy_root(request: Request):

    if not INTERCEPT_HTML:
        try:
            headers = dict(request.headers)
            async with httpx.AsyncClient() as client:
                response = await client.get(settings.upstream, headers=headers)
            return Response(content=response.content, status_code=response.status_code, headers=response.headers)
        except Exception as exc:
            logger.debug(exc)
            raise HTTPException(status_code=500, detail="Upstream service error") from exc

    else:
        static_file_path = os.path.join(BASE_DIR, 'proxy_data', 'index.html')
        if not os.path.isfile(static_file_path):
            try:
                upstream_url = f"{settings.upstream}/index.html"
                headers = dict(request.headers)
                async with httpx.AsyncClient() as client:
                    response = await client.get(upstream_url, headers=headers)
                    with open(static_file_path, 'wb') as f:
                        f.write(response.content)
            except Exception as exc:
                logger.debug(exc)
                raise HTTPException(status_code=500, detail="Upstream service error") from exc

        with open(static_file_path) as idx:
            content = idx.read()
        return Response(content=content, status_code=response.status_code, headers=response.headers)
