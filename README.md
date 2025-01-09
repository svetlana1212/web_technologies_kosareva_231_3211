# Косарева Светлана Александровна­ 231-3211

# 1 задание:

Написать Dockerfile:

В качестве исходного образа взять ubuntu, версии 18.04. 
Разместить информацию об авторе как метку.
Установить модуль gcc.
Скопировать файлы проекта в контейнер в заданную папку MyProj_<Surname>_<Group>.
Скомпилировать проект в файл с именем exam_Program.
Установить значение параметра программы по умолчанию.
Запустить exam_Program c параметром.

Написать команды для сборки образа, для размещения его на DockerHub (или зеркале) в открытом доступе и для запуска.

За прикрепление скрина со сборкой образа и с запущенным контейнером доп. баллы.

В качестве ответа прикрепить dockerfile и скрины, команды написать текстом в поле ответа.

# 2 задание:

На основе проекта EchoServer написать 
многопользовательский сервер, который работает ровно с 5 клиентами.

При подключении очередного клиента сервер пишет приветствие. Если подключается шестой клиент, то сервер ему пишет, что занят и просит подключится позднее, затем сразу же разрывает соединение.
При подключении клиентов 1, 2, 3, 4 сервер дополнительно отправляет всем подключенным клиента информацию о текущем количестве подключенных клиентов.

При подключении пятого клиента Сервер отправляет всем клиентам информацию: "Игра начинается. Составьте слова из слова <Длинное слово>"

Клиенты отправляют серверу некоторое слово, составленное из букв заданного слова, (последовательность нескольких символов).
Сервер отправляет это слово всем, кроме отправителя. Затем сервер отправляет всем "Составьте слова из слова <Длинное слово>".

При отключении одного из пяти клиентов во время игры Сервер всем пишет: "Игра окончена" и всех отключает.

В качестве аргумента командной строки программа принимает параметр <Имя>. При старте программа выводит "Hello, <Имя>".
<Длинное слово> - одно из 10 слов, заданных  в программе; выбирается рандомно.
Для демонстрации работы прикрепить Скрины клиентов плюс вывод сервера. 
Скрины должны содержать весь экран компьютера.

# 3 задание:

Создать свой приватный репозиторий на github.com.
Добавить преподавателя по логину NikitaVorobiev:
settings -> Collaborators -> Manage Access -> add people

Работа с репозиторием осуществляется посредством консольных команд (PowerShell, GitBash, Terminal, etc). 
Скрины экрана можно загрузить в свою ветку путем перетаскивания. 

В основной ветке создать файл Readme, в который поместить информацию:
                              номер группы, ФИО
                              текстом ваш вариант заданий.
Клонировать удаленный репозиторий.
Из основной ветки создать вторую ветку с названием screens. В нее поместить скрины работы программы и докера.
Вернуться в основную ветку. 
Добавить под отслеживание только те файлы проекта, которые не переписываются при сборке и компиляции.
Зафиксировать изменения и отправить в удаленный репозиторий.

Сделать скрины всей работы с репозиторием и прикрепить в ветку screens путем перетаскивания, после окончания работы. Сюда тоже прикрепить скрины, а в текстовое поле ввести ссылку на репозиторий.
