#ifndef CLIENTHANDLER_H
#define CLIENTHANDLER_H

#include <QObject>
#include <QTcpSocket>

class ClientHandler : public QObject
{
    Q_OBJECT

public:
    explicit ClientHandler(qintptr socketDescriptor, int clientId, QObject *parent = nullptr);
    void sendMessage(const QString &message);
    void disconnectFromServer();
    void setClientName(const QString &name);

signals:
    void disconnected();
    void messageReceived(const QString &message);

private slots:
    void onReadyRead();
    void onDisconnected();

private:
    QTcpSocket *socket;
    QString clientName;
};

#endif
