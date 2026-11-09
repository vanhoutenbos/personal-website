---
name: jp-blog-stem
description: Herschrijft blogteksten van Jean-Paul in zijn eigen stem, in foutloos Nederlands. Gebruik bij elk verzoek om een blog of concept van JP te herschrijven, te polijsten of naar het Nederlands te zetten.
---

# Blog herschrijven in de stem van JP

Deze skill herschrijft een blogtekst (concept, aantekeningen of Engelse versie) zodat het klinkt alsof Jean-Paul hem zelf schreef, in correct Nederlands.

## Werkwijze

1. Lees `references/voice-dna.md`. Daarin staat hoe JP schrijft: toon, opbouw, humor en wat je moet vermijden.
2. Bepaal wat de brontekst is: een Nederlands concept, een Engelse tekst, of losse aantekeningen. Behoud altijd de volgorde van de argumenten en de inhoud.
3. Herschrijf de tekst in JP's stem. Pas zinnen, toon en overgangen aan, maar niet de inhoud.
4. Loop daarna `references/spelling-controle.md` stap voor stap langs en verbeter alles wat daar genoemd wordt. Doe dit zonder het te melden.
5. Lever het resultaat zoals beschreven onder "Uitvoer".

## Harde regels

- Verander nooit code, YAML, commando's, bestandsnamen, URL's, versienummers, getallen of productnamen. Alleen de lopende tekst wordt herschreven.
- Voeg geen feiten, meningen of persoonlijke ervaringen toe die niet in de brontekst staan. Schrijf dus niet "ik heb dit zelf getest" als dat niet in de bron staat.
- Gebruik de officiële Nederlandse spelling (Woordenlijst Nederlandse Taal).
- Vermijd AI-clichés en holle openingen (zie `references/voice-dna.md`).
- Is iets in de bron onduidelijk of lijkt het inhoudelijk onjuist, laat het dan staan en meld het onder "Let op". Los het niet zelf op.

## Instellingen (pas hier aan wat je wilt)

- Aanspreekvorm: "je".
- Technische termen: Engelse vakterm blijft Engels (pipeline, namespace, deployment, Helm chart). Gebruik alleen een Nederlands woord als dat echt gangbaar is.
- Lengte: ongeveer gelijk aan het origineel, hooguit 10% langer.
- Toon: informeel maar vakkundig.

## Uitvoer

1. Eerst de herschreven tekst, zonder inleiding.
2. Daarna een kort kopje "Let op" met maximaal vijf punten: onduidelijkheden in de bron, termen waar je twijfelde en alles wat JP zelf moet controleren.
3. Sluit af met de suggestie om de tekst nog door een spellingcontrole (bijvoorbeeld LanguageTool) te halen.

## Onderhoud

Dit is versie 0.1, opgebouwd uit schoolwerk uit 2012 en 2013. Voeg recente blogposts toe en laat Claude `references/voice-dna.md` bijwerken. Dat verbetert de stem aanzienlijk.
