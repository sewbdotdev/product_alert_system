# 
FROM python:3.9-alpine3.15


# 
WORKDIR /app
# 
COPY ./requirements.txt /requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /requirements.txt

COPY . .
RUN chmod u+x ./wait.sh
CMD ["./wait.sh"]