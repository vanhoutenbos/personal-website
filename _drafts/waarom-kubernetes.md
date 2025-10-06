---
title: "Waarom kiezen zoveel developers voor Kubernetes?"
date: 2025-10-03
draft: true
categories: [Kubernetes, Overzicht]
---

# Waarom kiezen zoveel developers voor Kubernetes?

## Introductie
- Wat is Kubernetes en waarom is het zo populair? 
Kubernetes is een platform ontworpen om schaalbaarheids problemen op te lossen, het is ontstaan binnen google als een intern product en uiteindelijk uitgegroeid tot een van de grootste platformen.
Het is extreem populair omdat het niet bedoelt is voor 1 hosting partij of 1 programmeer taal maar je kan er bijna alles op draaien van PHP tot C# tot java maar ook frontend websites of simpele cron jobs.
Door de flexibelheid van Kubernetes en de onafhankelijkheid van de onderliggende infrastructuur is het enorm populair geworden en heeft het de 'oude' toegevoegd aan 'VM's'

- Wat was jouw eerste ervaring met Kubernetes?
Mijn eerste ervaring was toen ik bij GGN zat, daar bouwde we een nieuw platform die automatisch bankbetalingen moest koppelen aan dossiers, soms waren dit een paar betalingen en soms wel duizenden. Dit moest schaalbaar want het proces moest klaar zijn voordat we werkdag begon zodat de medewerkers de uitval konden behandelen.
Hier kwam Docker Swarm om de hoek (een Kubernetes alternatief), samen met een externe partij hebben we een extreem schaalbaar platform gemaakt waar zowel de koppelings-tool op draaide als de frontend voor de medewerkers.

- Wat viel je op aan de leercurve?
Er was een grote leercurve omdat ik nog geen operations had gedraaid, ik had zelde iets met IIS gedaan of met VM's en alleen meegekeken met onze technische beheerders. En ineens kreeg ik de mogelijkheid om alles zelf op te spinnen en uit te schalen, super veel nieuwe impressies maar gelukkig had ik een extern-team erbij die al enorm veel ervaring had en mij de beginselen heeft geleerd.

## Wat lost Kubernetes op?
- Kun je een metafoor bedenken die het uitlegt?
Kubernetes lost het openbaar vervoer probleem op, tijdens piek uren zijn er te weinig treinen en tijdens dal uren veelste veel.
In Kubernetes kun je binnen enkele minuten je aantal treinen ver-tienvouwdigen zonder enige moeite.
Ook kun je de trein langer maken als meer treinen niet past.
En je kunt weer afschalen zodra het rustiger word, waardoor je nooit geld weggooid aan servers die niemand gebruikt.

- Welke problemen had je vóór Kubernetes?
Met name dat je niet wist hoeveel bezoekers je ging krijgen en daarom maar adhv loadtests en een goeie gok je servers opschaalde en regelmatig met een 5% bezetting zat en dus eigenlijk 95% van je maandelijkse server kosten weggooid.

## Wanneer is Kubernetes (niet) de juiste keuze?
- Voor wie is het bedoeld?
Het is bedoelt voor bedrijven die veel geven om schaalbaarheid, stabiliteit en ontwikkelgemak, hier excellereert Kubernetes in.

- Wanneer is het overkill?
Als je gewoon 1 simpele frontend (zoals een CV website bijvoorbeeld) wilt hosten of een paar kleine functies die wat data aggregeren.

## Voordelen voor developers
- Wat vind jij het grootste voordeel?
Je kunt elke taal programmeren die je wilt en kunt in multi-disciplinaire teams dus makkelijk ermee uit de voeten.

- Welke tooling gebruik je het liefst?
Het hosten van je eigen software is heerlijk op kubernetes bijvoorbeeld je eigen RabbitMQ cluster of een cachinglaag met Redis.
Je spint deze tools met gemak op en daarmee ondersteun je je interne applicaties.

## Voordelen voor bedrijven
- Heb je voorbeelden van schaalbaarheid of kostenbesparing?
Een van de mooiste voorbeelden die ik zelf heb gezien is dat tijdens een sport evenement er een 'paar honderd' gebruikers op het platform zitten, een voetbal wedstrijd duurt 90 minuten (+/-) en daardoor wisten wij dat we bij minuut 80 +/- moesten gaan opschalen want na de wedstrijd gingen alle gebruikers van onze app inloggen en kijken naar de sport uitslag.
Dit deden ze meestal voor zo'n 20-30 minuten en daarna nam het weer af, dit bracht een enorme kostenbesparing voor ons mee want we konden tijdens de wedstrijd inschalen op wat wij verwachtte aan gemiddelde drukte met autoschaling aan zodat er soms een machine bij kwam als het drukker was dan verwacht.
Zodra de 80e minuut sloeg schaalde we verder op naar de verwachte piek drukte, en zodra het weer weg was konden we weer afschalen.
Hierdoor draaide we niet 120 minuten op tientalle servers maar effectief maar 30 minuten.

## Valkuilen & misverstanden
- Welke fouten heb je zelf gemaakt?
Een van de meest voorkomen fouten is denk wijze hoe mensen kubernetes gebruiken, bijvoorbeeld door een statefull applicatie te maken en vergeten de state met andere pods te delen, of nog beter, de applicatie stateless te maken.
Hierdoor heb ik wel eens gehad dat iemand inlogde op mijn app en zodra ze de pagina ververste soms uitgelogd waren en soms weer ingelogged.

- Welke zie je vaak bij anderen?


## Conclusie & verder lezen
- Wat zou je een beginner aanraden?
100%! Dit misschien wel het mooiste startingpoint want je kunt python schrijven of C# of PHP, het maakt niet uit! Je kunt met welke programmeertaal dan ook je kubernetes kennis opschroeven en dingen van leren.

## FAQ
- Is Kubernetes moeilijk?
Relatieve vraag, maar nee, het is conceptueel een lastig concept en er is heel veel informatie en mogelijkheden, maar moeilijk is het niet zeker niet als je je focussed op 1 onderwerp per keer.
- Wat zijn alternatieven?
Er zijn een hoop opties die onderwater weer op Kubernetes draaien zoals ACA, ACI etc. maar de echte alternatieven zijn docker swarm, hashicorp nomad & apache mesos.
- Hoe begin ik?
Begin vooral op https://kubernetes.io daar staat alle informatie die je nodig hebt en daarnaast kun je (afhankelijk van wat je fijn vind) een video via youtube of udemy. Of blogs lezen met alle informatie erin.