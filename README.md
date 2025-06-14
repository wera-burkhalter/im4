# im4
*** KURZBESCHREIBUNG
"Invyte" ist eine Web-App zur einfachen Verwaltung von Events und Einladungen im Freundeskreis. Nutzer:innen können Veranstaltungen erstellen, ihre Freunde einladen, Eventdetails anzeigen und Rückmeldungen geben. Besonderer Fokus liegt auf einer klaren, intuitiven Bedienung – die Website ist speziell auf ältere Nutzer:innen zugeschnitten und daher bewusst visuell und einfach gestaltet.


*** LEARNINGS
- Das genaue Skizzieren des Screen-Flows und der Datenbankstruktur war anfangs zeitaufwendig und herausfordernd. Rückblickend hat sich diese Investition jedoch klar gelohnt: Die Umsetzung verlief dadurch deutlich strukturierter und effizienter. Auch der Prototyp in Figma war eine grosse Hilfe beim anschliessenden Umsetzen des Codes.
- Der Einsatz von ChatGPT hat uns oft weitergeholfen, aber wir mussten uns immer weider darin erinnern, dass wir nicht blind auf die Antworten vertrauen sollten. Auch KI kann falsche Vorschläge machen. Deshalb haben wird immer versucht die Antoworten von ChatGPT aktiv zu hinterfragen und nach zu prüfen. 


*** SCHWIERIGKEITEN
- Beim Erstellen eines Events wollten wir ein benutzerfreundliches Tool zum Einladen von Freunden integrieren. Funktional klappt es gut, jedoch konnten wir einen unschönen Strich (Focus-Styling) unterhalb der Elemente nicht wie gewünscht entfernen, zumindest nicht, ohne die Funktionalität zu gefährden. Auch mithilfe von ChatGPT konnte hier keine saubere Lösung gefunden werden.
- Die Umsetzung des Kalenders gemäss Design-Vorlage war technisch komplexer als erwartet. Besonders das einheitliche Layout mit festen Abständen und Spalten erforderte viel Feintuning und wiederholtes Testen. Letztlich konnte ich aber ein sauberes Ergebnis erzielen.
- Zudem war beim Kalender, resp. bei den Eventdetail Pop-Ups lange das Problem, das die Eventbilder nicht korrekt geladen wurden. Als das dann klappte, war die nächste Hürde festzulegen, dass bei den Events, die keine Bilder haben auch nichts angezeigt wird. 
- Das Sessions-Handling (inkl. Logout-Button und Weiterleitungen) war eine unerwartete Fehlerquelle. Es traten Probleme auf mit automatischen Browser-Nachrichten, nicht funktionierenden Logout-Buttons und Sessions, die nicht korrekt gelöscht wurden. Diese Stolpersteine konnten wir mit gezielten Anpassungen in PHP und JavaScript beheben – aber sie haben uns Zeit gekostet.


*** BENUTZTE RESSOURCEN
Wir haben auf die im Unterricht zur Verfügung gestellten Folien und das Tooling 101 zurückgegriffen.Zudem haben wir die Seite w3schools.com und ChatGPT oft genutzt.



***LOGINS (von uns erstellte User)
Hans Morgenthaler: 076 123 45 67  - hallo2002
Jürg Heinzmann: 076 987 65 43 - KatzeHund
Patricia Lüdi: 077 111 22 33 - PaprikaChips
Margrit Krummer: 076 191 10 02 - 1234hallo
Josef Ehlers: 077 991 80 09 - markusMann
Maria Toni: 079 040 90 02 - ElTonyMate
