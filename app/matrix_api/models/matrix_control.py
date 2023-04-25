from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from sqlalchemy.orm import relationship

# Local imports
from matrix_api.modules.database import Base


class MatrixControl(Base):
    __tablename__ = "matrix_config"

    id = Column(Integer, primary_key=True, nullable=False)
    label = Column(String, nullable=False)
    description = Column(String, nullable=False)
    triggers = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    owner_id = Column(Integer, ForeignKey("Users.id", ondelete="CASCADE"), nullable=False)
    sub_tasks = relationship("MatrixSubControl")


class MatrixSubControl(Base):
    __tablename__ = "matrix_sub_control"

    id = Column(Integer, primary_key=True, nullable=False)
    cmd_type = Column(Integer, nullable=False)
    cmd_index = Column(Integer, nullable=False)
    cmd_para1 = Column(Integer, nullable=True)
    cmd_para2 = Column(Integer, nullable=True)
    cmd_para3 = Column(Integer, nullable=True)
    cmd_para4 = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    ctrl_id = Column(Integer, ForeignKey("matrix_control.id", ondelete="CASCADE"), nullable=False)
