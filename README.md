# README

# Mise en place de l’environnement

Pour suivre ce guide nous vous recommandons d’avoir un environnement Unix

## Application :

### Android

- Pour tester l’application Frinem une apk est disponible à la racine du projet
- Télécharger l’apk sur un appareil android
- Lancer l’application

### IOS

- Se placer dans le répertoire app/
- Ouvrir un terminal

```bash
yarn install
yarn start
```

- Connecter l’appareil IOS au même réseau internet que le PC
- Télécharger l’application expo go sur votre appareil IOS
- Scanner le QRcode
    - En scannant le QRcode expo build l’application sur votre appareil

## Serveur :

Afin d’être au plus proche de l’utilisation final du produit nous avons un VPS OVH qui tourne sur un raspberry pi, placée dans notre salle.

Cependant il est possible de lancer la solution en local

### Serveur local

- Installer une base postgres
    - Mise en place de la base
    
    ```bash
    sudo curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
    sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
    sudo apt install pgadmin4
    sudo -u postgres psql
    ALTER USER postgres PASSWORD 'newPassword';
    ```
    
    - Implémentation de la base
    
    ```bash
    cd server/
    yarn install
    yarn migrate
    yarn seed
    yarn dev
    ```
    

## Zigbee :

Pour faire fonctionner l’application nous devons lire les valeurs renvoyer par les capteurs de notre routeur.

- Autoriser la lecture des serial port : /dev/ttyUSB0

```bash
sudo usermod -a -G dialout rferrand
```

- Brancher le coordinateur
- Lancer le serveur zigbee

```bash
cd zigbee/
yarn install
yarn 
```