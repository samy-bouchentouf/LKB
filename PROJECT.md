# Objectif cible — Conversations persistantes et RAG conversationnel

## Vision

Faire évoluer le chatbot d'un modèle :

```text
1 question
↓
1 réponse
```

vers un véritable assistant conversationnel capable :

- de conserver l'historique des conversations ;
- de permettre à l'utilisateur de retrouver ses anciennes discussions ;
- de comprendre les références implicites ("it", "this detector", "that incident", etc.) ;
- de conserver la qualité du RAG même au cours d'une longue conversation.

---

# 1. Historique des conversations utilisateur

L'application doit adopter un fonctionnement similaire à ChatGPT.

Une barre latérale affiche les conversations précédentes :

```text
+ New Chat

What is the PDA50B2?
Laser Locking Setup
Incident on Rack 12
Quantum Fisher Information
...
```

Chaque conversation est :

- sauvegardée ;
- persistante après redémarrage ;
- réouvrable depuis la sidebar.

Lorsqu'une conversation est sélectionnée :

- tous les messages utilisateur sont restaurés ;
- toutes les réponses du chatbot sont restaurées.

---

# 2. Création d'une conversation

Une conversation n'est pas créée au clic sur "New Chat".

Une conversation est créée automatiquement lorsque :

```text
Utilisateur envoie un premier message
↓
LLM répond
↓
Conversation créée et sauvegardée
```

Cela évite la création de conversations vides.

---

# 3. Première question d'une conversation

La première question conserve exactement le fonctionnement actuel.

Architecture actuelle :

```text
Question
↓
Hybrid Search
↓
Top Chunks
↓
Prompt
↓
LLM
↓
Réponse
```

Aucun historique n'est utilisé.

---

# 4. Questions suivantes

À partir de la deuxième question, le chatbot doit exploiter le contexte conversationnel.

Exemple :

```text
User:
What is the PDA50B2?

Assistant:
The PDA50B2 is a photodetector.

User:
What wavelength range does it support?
```

Le système doit comprendre que :

```text
it = PDA50B2
```

afin de récupérer les documents pertinents.

---

# 5. Reformulation de la question

Avant chaque recherche documentaire, une étape de reformulation est exécutée.

Entrées :

```text
Historique récent de la conversation
+
Nouvelle question utilisateur
```

Objectif :

```text
Transformer la question implicite
en question complètement explicite.
```

Exemple :

Entrée :

```text
User:
What is the PDA50B2?

Assistant:
The PDA50B2 is a photodetector.

User:
What wavelength range does it support?
```

Sortie attendue :

```text
What wavelength range does the PDA50B2 support?
```

La recherche documentaire utilisera la question reformulée.

---

# 6. Recherche documentaire (RAG)

Le moteur RAG ne travaillera plus sur la question brute.

Architecture cible :

```text
Historique
+
Nouvelle question
↓
Reformulation
↓
Question explicite
↓
Hybrid Search
↓
Top Chunks
```

Cela améliore considérablement le retrieval lorsque l'utilisateur utilise des références implicites.

Exemples :

```text
it
this detector
that component
the previous issue
that incident
this diagram
```

---

# 7. Construction du prompt principal

Une fois les chunks récupérés, le prompt envoyé au LLM doit contenir :

## A. Historique récent

Uniquement les derniers échanges de la conversation.

Limite :

```text
5 questions/réponses maximum
```

soit :

```text
User
Assistant
User
Assistant
User
Assistant
User
Assistant
User
Assistant
```

L'objectif est de conserver le contexte sans faire exploser la taille du prompt.

---

## B. Contexte documentaire

Les chunks retournés par le moteur RAG :

```text
Chunk 1
Chunk 2
Chunk 3
...
```

---

## C. Question actuelle

La question que l'utilisateur vient de poser.

---

# 8. Gestion des historiques

Deux niveaux d'historique seront utilisés.

## Historique de reformulation

Utilisé uniquement pour la réécriture de la question.

Conserve un contexte plus large :

```text
20 à 30 derniers échanges
```

afin de résoudre correctement les références à des éléments plus anciens de la conversation.

---

## Historique de réponse

Utilisé dans le prompt principal envoyé au LLM.

Limité à :

```text
5 derniers échanges
```

afin de conserver un prompt raisonnable.

---

# 9. Flux conversationnel complet

À partir de la seconde question :

```text
Nouvelle question
↓
Historique étendu
↓
LLM de reformulation
↓
Question explicite
↓
Hybrid Search
↓
Top Chunks
↓
Historique récent
+
Chunks
+
Question actuelle
↓
LLM principal
↓
Réponse
↓
Sauvegarde de la conversation
```

---

# 10. Principes de conception

✅ Historique persistant type ChatGPT

✅ Conversations réouvrables depuis la sidebar

✅ Création automatique d'une conversation au premier échange

✅ Reformulation des questions implicites

✅ Recherche documentaire basée sur la question reformulée

✅ Historique limité dans le prompt principal

✅ Historique plus large pour la reformulation

✅ Compatible avec l'architecture RAG actuelle

✅ Évolutif vers des fonctionnalités futures (renommage, recherche, favoris, dossiers, etc.)

---

# Architecture cible résumée

```text
Utilisateur
↓
Question
↓
Historique conversationnel
↓
LLM de reformulation
↓
Question explicite
↓
Hybrid Search
↓
Top Chunks
↓
Prompt final
    + Historique récent
    + Contextes récupérés
    + Question actuelle
↓
LLM principal
↓
Réponse
↓
Sauvegarde conversation
↓
Disponible dans la sidebar
```