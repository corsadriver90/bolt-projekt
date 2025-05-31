import React from 'react';
    import { BookOpen, Disc, Gamepad2, Film, Music, Puzzle, Car, Home, HelpCircle } from 'lucide-react';

    export const acceptedCategoriesData = [
      {
        title: 'Bücher (Romane, Fachbücher etc.)',
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        items: [
          'Romane (Hardcover & Taschenbuch)',
          'Krimis & Thriller',
          'Sachbücher & Fachbücher (alle Themen)',
          'Kinderbücher & Jugendbücher',
          'Comics, Mangas & Graphic Novels',
          'Ratgeber & Kochbücher',
          'Biografien & Autobiografien',
          'Reiseführer (auch ältere für Inspiration)',
        ],
        notes: 'Bücher sollten in einem akzeptablen, lesbaren Zustand sein. Kleinere Gebrauchsspuren sind okay. Wir geben jedem Buch eine Chance!',
      },
      {
        title: 'CDs, DVDs & Blu-rays',
        icon: <Disc className="h-8 w-8 text-primary" />,
        items: [
          'Musik-CDs (Alben, Sampler, Soundtracks)',
          'Spielfilme (DVD & Blu-ray)',
          'Serien (DVD & Blu-ray Boxen)',
          'Dokumentationen & Konzerte',
          'Hörbücher & Hörspiele auf CD',
        ],
        notes: 'Nur Originale. Hüllen sollten vorhanden sein, Booklets sind ein Plus, aber kein Muss. Leichte Kratzer sind meist kein Problem, solange die Medien abspielbar sind.',
      },
      {
        title: 'Konsolenspiele (Modern & Retro)',
        icon: <Gamepad2 className="h-8 w-8 text-primary" />,
        items: [
          'Spiele für aktuelle Konsolen (PlayStation 4/5, Xbox One/Series X|S, Nintendo Switch)',
          'Spiele für ältere Konsolen (z.B. PS2/PS3, Wii/Wii U, Xbox 360, Nintendo DS/3DS)',
          'Retro-Spiele (z.B. PS1, GameCube, N64, SNES, Mega Drive, Game Boy). Wir lieben Retro!',
        ],
        notes: 'Spiele sollten original sein. Hüllen sind ideal, aber auch lose Discs/Module werden geprüft. Anleitungen sind schön, aber nicht zwingend.',
      },
      {
        title: 'Schallplatten (Vinyl)',
        icon: <Music className="h-8 w-8 text-primary" />,
        items: ['LPs & Singles (alle Genres, von Pop bis Klassik)'],
        notes: 'Cover und Platte sollten in einem Zustand sein, der eine zweite Chance verdient. Leichte Gebrauchsspuren sind normal.',
      },
      {
        title: 'VHS & Musikkassetten (MC)',
        icon: <Film className="h-8 w-8 text-primary" />,
        items: [
            'Original VHS-Kaufkassetten (Spielfilme, Kinderfilme, Dokus)', 
            'Original Musikkassetten (Alben, Hörspiele)'
        ],
        notes: 'Nur Originale. Hüllen sollten vorhanden sein. Wir geben auch diesen Medien eine neue Bühne!',
      },
      {
        title: 'Modellautos & Modelleisenbahn',
        icon: <Car className="h-8 w-8 text-primary" />,
        items: [
          'Modellautos (z.B. Siku, Matchbox, Hot Wheels, Wiking - auch bespielt)', 
          'Sammlermodelle (alle Maßstäbe)',
          'Modelleisenbahnen (Loks, Waggons, Schienen, Zubehör - alle Spurweiten)',
        ],
        notes: 'Zustand von bespielt bis neuwertig. Originalverpackung ist schön, aber kein Muss. Auch Einzelteile oder Konvolute.',
      },
      {
        title: 'Lego & Playmobil',
        icon: <Home className="h-8 w-8 text-primary" />,
        items: [
          'Lego-Steine (lose Kiloware, gemischte Sammlungen)', 
          'Lego-Sets (auch unvollständig)',
          'Playmobil-Figuren, Tiere, Fahrzeuge und Zubehör (lose oder in Sets)',
        ],
        notes: 'Sauberkeit ist wünschenswert. Kleinere Defekte oder fehlende Teile bei Sets sind oft kein Problem.',
      },
      {
        title: 'Brettspiele & Puzzle',
        icon: <Puzzle className="h-8 w-8 text-primary" />,
        items: [
          'Gesellschaftsspiele für Kinder und Erwachsene', 
          'Puzzle (alle Teilezahlen)',
          'Sammelkartenspiele (z.B. Pokémon, Magic - auch einzelne Karten)'
        ],
        notes: 'Spiele sollten grundsätzlich spielbar sein. Fehlende Kleinteile (z.B. eine Spielfigur) sind oft okay, solange das Spielprinzip erhalten bleibt. Bei Puzzles ist Vollständigkeit wichtig. Originalverpackung ist ideal.',
      },
      {
        title: 'Sonstiges (Figuren, Sammelobjekte etc.)',
        icon: <HelpCircle className="h-8 w-8 text-primary" />,
        items: [
            'Actionfiguren (z.B. Star Wars, Superhelden)',
            'Sammelfiguren (z.B. Überraschungsei-Figuren, Comicsfiguren)',
            'Weitere Sammelobjekte auf Anfrage',
        ],
        notes: 'Für spezielle Sammlungen oder Artikel, die hier nicht explizit genannt sind, kontaktieren Sie uns bitte. Wir prüfen gerne Ihre Anfrage!',
      }
    ];

    export const generalExclusionsData = [
      'Artikel aus Raucherhaushalten (starker Rauchgeruch)',
      'Schimmlige, feuchte oder extrem stark riechende Artikel',
      'Massiv beschädigte oder unbrauchbare Artikel (z.B. zerrissene Bücher ohne Seiten, zerbrochene CDs, stark verrostetes Spielzeug)',
      'Kostenlose Werbeexemplare, Leseexemplare mit deutlicher Kennzeichnung (außer nach Absprache)',
      'Zeitschriften, Magazine, Kataloge, Zeitungen (außer gebundene Jahrgänge oder Sammlereditionen)',
      'Selbstgebrannte/kopierte CDs/DVDs/Spiele (Raubkopien)',
      'Software, PC-Spiele (generell schwierig, außer originalverpackt oder sehr spezielle Retro-Titel)',
      'Schulbücher mit vielen Eintragungen (außer Bleistift)',
      'Artikel mit illegalen, pornografischen oder gewaltverherrlichenden Inhalten',
      'Stark verschmutzte Artikel',
    ];