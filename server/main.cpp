#include <QCoreApplication>
#include <QCommandLineParser>
#include <QCommandLineOption>
#include "echoserver.h"

int main(int argc, char *argv[])
{
    QCoreApplication app(argc, argv);

    QCommandLineParser parser;
    parser.addHelpOption();
    parser.addPositionalArgument("name", QCoreApplication::translate("main", "Name to be greeted with"));
    parser.process(app);

    const QStringList args = parser.positionalArguments();
    QString name = args.isEmpty() ? "World" : args.first();

    qInfo() << "Hello, " << name;

    EchoServer server;
    if (!server.listen(QHostAddress::Any, 33333))
    {
        qFatal("Unable to start the server: %s", qPrintable(server.errorString()));
    }
    qInfo() << "Server started on port 33333";

    return app.exec();
}

