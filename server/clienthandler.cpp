#include "clienthandler.h"
#include <QTextStream>

ClientHandler::ClientHandler(qintptr socketDescriptor, int clientId, QObject *parent) : QObject(parent), socket(new QTcpSocket(this)), clientName("Client" + QString::number(clientId))
{
    socket->setSocketDescriptor(socketDescriptor);
    connect(socket, &QTcpSocket::readyRead, this, &ClientHandler::onReadyRead);
    connect(socket, &QTcpSocket::disconnected, this, &ClientHandler::onDisconnected);
}

void ClientHandler::sendMessage(const QString &message)
{
    socket->write(message.toUtf8());
}

void ClientHandler::disconnectFromServer()
{
    socket->disconnectFromHost();
}

void ClientHandler::setClientName(const QString &name)
{
    clientName = name;
}

void ClientHandler::onReadyRead()
{
    while (socket->canReadLine())
    {
        QString line = socket->readLine().trimmed();
        if (line.startsWith("NewName:"))
        {
            setClientName(line.section(':', 1, 1).trimmed());
            sendMessage("Новое имя: " + clientName + "\r\n");
        }
        else if (line.startsWith("\xFF\xFB\x1F\xFF\xFB \xFF\xFB\x18\xFF\xFB'\xFF\xFD\x01\xFF\xFB\x03\xFF\xFD\x03"))
        {
        }
        else
        {
            emit messageReceived("\r\n" + clientName + ": " + line);
        }
    }
}

void ClientHandler::onDisconnected()
{
    emit disconnected();
}

