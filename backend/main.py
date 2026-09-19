from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from schemas import StudentCreate, StudentUpdate
import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Student CRUD API is running"}

@app.post("/students")
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    new_student = models.Student(
        name=student.name,
        email=student.email,
        course=student.course,
        age=student.age
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student

@app.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(models.Student).all()
    return students

@app.put("/students/{student_id}")
def update_student(
    student_id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db)
):
    existing_student = db.query(models.Student).filter(
        models.Student.id == student_id
    ).first()

    if existing_student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    existing_student.name = student.name
    existing_student.email = student.email
    existing_student.course = student.course
    existing_student.age = student.age

    db.commit()
    db.refresh(existing_student)

    return existing_student

@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    existing_student = db.query(models.Student).filter(
        models.Student.id == student_id
    ).first()

    if existing_student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(existing_student)
    db.commit()

    return {"message": "Student deleted successfully"}