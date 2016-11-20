# TheaterWecker

Im Wintersemester 2016/17 wurde an der _Technischen Universität Chemnitz_ das [Kulturticket](https://www.tu-chemnitz.de/stura/de/kulturticket) eingeführt.

Mit dem *TheaterWecker* können sich die Studenten über nicht ausverkaufte Aufführungen der _Theater Chemnitz_ Benachrichtigungen zusenden lassen. Es kann ausgewählt werden, für welche Kategorien (Oper, Schauspiel etc.) die Benachrichtigungen abonniert werden und ob diese 15 oder 30 Minuten oder eine Stunde vor Beginn verschickt werden sollen.

## Setup

Für das initiale Setup einfach folgenden Befehl in `ansible` ausführen (vorher die `secrets.yml` ausfüllen):

  ansible-playbook playbook.yml -i hosts

## Deployment

Für alle nachfolgenden Updates reicht es die Tasks mit dem Tag `deployment` auszuführen:

  ansible-playbook playbook.yml -i hosts --tags deployment

Dies aktualisiert die Nginx Config, rollt den aktuellen Stand des Git-Repos aus (und führt `update.sh` bei einer Änderung aus), aktualisiert die `.service` und die `settings_prod.py` Datei (sowie gegebenenfalls ein Neustart des Services bei Änderungen in diesen).
