FROM python:3.9
WORKDIR /var/lib/fastapi/data
COPY ./app ./app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
#CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]