#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm nodejs-legacy
#RUN git clone git://github.com/DuoSoftware/DVP-DiameterClient.git /usr/local/src/diameterclient
#RUN cd /usr/local/src/diameterclient; npm install
#CMD ["nodejs", "/usr/local/src/diameterclient/app.js"]

#EXPOSE 8887

FROM node:5.10.0
ARG VERSION_TAG
RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-DiameterClient.git /usr/local/src/diameterclient
RUN cd /usr/local/src/diameterclient;
WORKDIR /usr/local/src/diameterclient
RUN npm install
EXPOSE 8887
CMD [ "node", "/usr/local/src/diameterclient/app.js" ]
