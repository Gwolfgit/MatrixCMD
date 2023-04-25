from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List


class SubControl(BaseModel):
    id: int
    cmd_type: int
    cmd_index: int
    cmd_para1: Optional[int] = None
    cmd_para2: Optional[int] = None
    cmd_para3: Optional[int] = None
    cmd_para4: Optional[int] = None

    class Config:
        orm_mode = True


class SubControlResponse(BaseModel):
    id: int
    cmd_type: int
    cmd_index: int
    cmd_para1: Optional[int] = None
    cmd_para2: Optional[int] = None
    cmd_para3: Optional[int] = None
    cmd_para4: Optional[int] = None

    class Config:
        orm_mode = True


class ListItem(BaseModel):
    id: int
    label: str
    description: str
    triggers: Optional[str]
    created_at: datetime
    sub_tasks: Optional[List[SubControl]] = []


# schema/alter response that need to be sent to client
class Control(ListItem):
    id: int
    label: str
    description: str
    triggers: Optional[str]
    created_at: datetime
    sub_tasks: Optional[List[SubControl]] = []

    class Config:
        orm_mode = True


class ItemUpdate(BaseModel):
    id: int
    label: str
    description: str
    triggers: Optional[str]
    sub_tasks: Optional[List[SubControl]] = []


class TaskUpdate(BaseModel):
    cmd_type: int
    cmd_index: int
    cmd_para1: Optional[int] = None
    cmd_para2: Optional[int] = None
    cmd_para3: Optional[int] = None
    cmd_para4: Optional[int] = None


class FilterType(BaseModel):
    type: str


class Users(BaseModel):
    username: str
    password: str


class NewUser(Users):
    username: str


class TokenData(BaseModel):
    id: Optional[str] = None


# schema/alter response that need to be sent to client
class UsersResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        orm_mode = True


class TokenResponse(BaseModel):

    access_token: str
    token_type: str

    class Config:
        orm_mode = True
