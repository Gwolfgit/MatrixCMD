import time
import asyncio
from typing import Optional

import aiohttp
from loguru import logger


class HttpRequest:

    async def __aenter__(self, base_url, command_timeout: int = 3):
        self._headers = {
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "MatrixCmd v0.1"
        }
        self._base_url = base_url
        self._command_timeout = command_timeout
        self._session = aiohttp.ClientSession(
            base_url=self._base_url,
            headers=self._headers,
            timeout=self._command_timeout,
            auto_decompress=False,
        )
        return self

    async def send_command(self, cmd):
        path = "/cgi-bin/submit"
        params = {"cmd": f"hex({','.join(str(x) for x in cmd)})"}
        await self._execute_request(path, params)
        return await self._query_response()

    async def _query_response(self):
        return await self._execute_request(path="/cgi-bin/query")

    async def _execute_request(self, path: str, params: Optional[dict] = None):
        params = params or {}
        params["_"] = str(int(time.time() * 1000))
        try:
            async with self._session.get(
                    url=path,
                    params=params,
            ) as response:
                status, reason, headers = response.status, response.reason, response.headers
                response = await response.read()

        except asyncio.TimeoutError:
            raise TimeoutError(f'The Matrix command timed out.')
        except:
            raise
        else:
            resp = f"HTTP/1.1 {status} {reason}\r\n".encode("latin-1")
            for header in headers:
                resp += f"{header}: {headers[header]}\r\n".encode("latin-1")
            resp += b"\r\n" + response
            logger.debug(resp)
            if len(response):
                return response

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self._session.close()

