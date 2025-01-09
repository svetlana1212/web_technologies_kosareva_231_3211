#include "echoserver.h"
#include "clienthandler.h"
#include <QTime>
#include <QTimer>
#include <cstdlib>

EchoServer::EchoServer(QObject *parent) : QTcpServer(parent)
{
    words = {"Трансформация",
             "Разнообразие",
             "Консервирование",
             "Пропагандирование",
             "Несогласованность",
             "Магнитопровод",
             "Экспериментирование",
             "Непротивоэпидемическому",
             "Интеллектуальность",
             "Антиретровирусный"};

    srand(QTime::currentTime().msec());
}

void EchoServer::incomingConnection(qintptr socketDescriptor)
{
    if (clients.size() >= 5)
    {
        QTcpSocket *tempSocket = new QTcpSocket();
        tempSocket->setSocketDescriptor(socketDescriptor);
        tempSocket->write("Сервер недоступен. Пожалуйста, попробуйте позже.\r\n");
        tempSocket->flush();
        QTimer::singleShot(1000, tempSocket, &QTcpSocket::disconnectFromHost);
        return;
    }

    int clientId = clients.size() + 1;
    ClientHandler *client = new ClientHandler(socketDescriptor, clientId, this);
    clients.append(client);

    connect(client, &ClientHandler::disconnected, [this, client]()
    {
        clients.removeAll(client);
        delete client;

        if (clients.size() < 5)
        {
            stopGame();
        }
    });

    connect(client, &ClientHandler::messageReceived, [this, client](const QString& message)
    {
        for (ClientHandler *otherClient : clients)
        {
            if (otherClient != client)
            {
                otherClient->sendMessage(message);
            }
        }
    });

    client->sendMessage("Welcome!\r\n");
    broadcastMessage(QString("Всего игроков: %1\r\n").arg(clients.size()));

    if (clients.size() == 5)
    {
        startGame();
    }
}

void EchoServer::startGame()
{
    longWord = words.at(rand() % words.size());
    broadcastMessage("Let's go! Составьте всевозможные слова из слова " + longWord + " \r\n");
}

void EchoServer::stopGame()
{
    broadcastMessage("Game over((\r\n");
    for (ClientHandler *client : clients)
    {
        client->disconnectFromServer();
    }
    clients.clear();
}

void EchoServer::broadcastMessage(const QString &message)
{
    for (ClientHandler *client : clients)
    {
        client->sendMessage(message);
    }
}
