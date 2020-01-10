FROM python:3.6-slim
WORKDIR /app
COPY . /app
RUN pip3 install discord.py
RUN pip3 install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
CMD [ "python3", "./seba.py" ]
