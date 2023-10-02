Installation : 

    Postgres sur ubuntu : 
sudo curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
sudo apt install pgadmin4

    Modifier le mdp de l'utilisateur par defaut
$ sudo -u postgres psql
$ ALTER USER postgres PASSWORD 'newPassword';


Edition : 

    Pour ajouter une nouvelle table dans la bdd : 
$ knex migrate:make create_tablename_table --migrations-directory ./db/migrations
        --> nouveau fichier migrate dans le dossier ./db/migrations
Ajouter la description de la table dans le fichier ./db/definitions.js
Compléter le fichier migration qui vient d'être créé
$ yarn migrate
$ yarn seed

    Pour vider la base de données (pour faire des modifications sur des anciennes tables par exemple) : 
$ yarn reset

