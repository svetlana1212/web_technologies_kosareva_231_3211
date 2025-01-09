#ifndef ECHOSERVER_H
#define ECHOSERVER_H

#include <QTcpServer>
#include <QTcpSocket>
#include <QList>
#include <QString>
#include <QObject>

class ClientHandler;

class EchoServer : public QTcpServer
{
    Q_OBJECT

public:
    explicit EchoServer(QObject *parent = nullptr);

protected:
    void incomingConnection(qintptr socketDescriptor) override;

private:
    QList<ClientHandler*> clients;
    QStringList words;
    QString longWord;

    void startGame();
    void stopGame();
    void broadcastMessage(const QString &message);
};

#endif
