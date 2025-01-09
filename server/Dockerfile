FROM ubuntu:18.04

LABEL maintainer="Косарева Светлана Александровна 231-3211 svetik.kosareva2004@mail.ru"

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    qt5-qmake \
    qtbase5-dev \
    qtdeclarative5-dev \
    build-essential \
    qt5-default


RUN mkdir -p /MyProj_Kosareva_231-3211


COPY . /MyProj_Kosareva_231-3211


WORKDIR /MyProj_Kosareva_231-3211


RUN qmake && make
