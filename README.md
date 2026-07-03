# LKB

Ce projet est une solution complète combinant une interface utilisateur intuitive, un serveur backend et un pipeline de RAG. Elle permet aux chercheurs de téléverser des publications, de documenter les fiches techniquesndu matériel, et de déclarer des pannes pour alimenter automatiquement la base de connaissances d'un Chatbot IA.

## Installation & Configuration

**Prérequis**
Installer :
* [Node.js](https://nodejs.org/) (v18 ou supérieur)
* [Python](https://www.python.org/) (v3.9 ou supérieur)
* [PostgreSQL] (https://www.postgresql.org/) (v16 ou supérieur)
* Git


**Cloner le projet**
```bash```
git clone git@github.com:samy-bouchentouf/LKB.git
cd LKB


**Installations nécessaires**
cd backend
npm install
pip install -r requirements.txt


```bash
pip install -r requirements.txt
```

---

### 4. Configurer PostgreSQL

Créer une base PostgreSQL (par exemple `lab_knowledge`) puis renseigner les paramètres de connexion dans :


```backend/app/operators/database.py
DATABASE_URL = ...`
```


Enfin, créer les tables de la base de données :

```bash
python backend/app/create_db.py
```


---

**Lancer le serveur**
node src/server.js

**Lancer frontend**
Ouvrir le fichier frontend_site.html


### Manuel Utilisateur

L'application est divisée en 4 onglets principaux accessibles depuis la barre de navigation latérale :
1. Chatbot IA
    Utilisation : Posez vos questions en langage naturel sur les manips ou l'historique du labo.
    Fonctionnement : L'IA va chercher en temps réel les réponses dans les PDF et rapports importés.

2. Onglet Publications
    Utilisation : Glissez-déposez (Drag & Drop) vos articles scientifiques ou thèses au format PDF.
    Résultat : Le fichier est instantanément sauvegardé sur le serveur et apparaît dans la liste "Ajoutés récemment".

3. Onglet Documents Tech
    Utilisation : Déposez la notice PDF officielle d'un appareil. Une fenêtre pop-up (Modale) s'ouvre pour vous demander de remplir les critères du composant (Nom (obligatoire), Constructeur, Référence, Numéro de série, Stock, Description). Le système convertit ces informations logistiques pour enrichir le PDF. L'IA saura ainsi vous dire à la fois comment aligner un laser et dans quelle armoire il est rangé.
    Il y a aussi la partie pour faire son schéma d'experience et l'enregistrer. 

4. Onglet Troubleshooting (Pannes)
    Utilisation : En cas de dysfonctionnement sur un banc optique :
        Cliquez sur le ou les composants en panne (Boutons multi-sélection). Vous donnez un titre au problème, faites une description, et donnez une solution si celle-ci a été trouvé. 
        Résultat : L'IA a connaissance des problèmes et solutions rencontrés. 