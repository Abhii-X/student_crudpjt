from pydantic import BaseModel

class StudentCreate(BaseModel):
    name: str
    email: str
    course: str
    age: int

class StudentUpdate(BaseModel):
    name: str
    email: str
    course: str
    age: int