# A1–A2 grammar reference

A plain-text reference for checking question content. It covers the grammar on the A1 and A2 cheat sheets the app was built from, written up in our own words. The sheets themselves (Ankommo's German cheat sheets) are third-party material and stay out of the repo. Each section names the topic file in `src/content/topics/` that drills it.

---

## A1

### Noun gender — `noun-gender.ts`

| Signal                             | Gender | Examples                        |
| ---------------------------------- | ------ | ------------------------------- |
| -ung, -heit, -keit, -schaft, -tion | die    | die Wohnung, die Freiheit       |
| -in (a woman); -e (≈ 90 %)         | die    | die Lehrerin, die Lampe         |
| -chen, -lein; Ge- … -e             | das    | das Mädchen, das Gemüse         |
| -er (a person), -ling              | der    | der Lehrer, der Frühling        |
| days, months, seasons              | der    | der Montag, der Mai, der Winter |

Exceptions to know: der Junge, der Name. Compounds take the gender of the last part.

### Plurals — `plurals.ts`

| Ending         | Typical of                         | Example                                        |
| -------------- | ---------------------------------- | ---------------------------------------------- |
| -e             | most one-syllable masculines       | der Tisch → die Tische                         |
| -(e)n          | almost all feminines; -in → -innen | die Frau → die Frauen                          |
| -er (+ umlaut) | short neuters                      | das Kind → die Kinder, das Buch → die Bücher   |
| -s             | loanwords, words ending in a vowel | das Auto → die Autos                           |
| — (± umlaut)   | -er, -el, -en, -chen               | der Lehrer → die Lehrer, der Vater → die Väter |

Plural article is always **die**. Dative plural adds **-n** unless the plural already ends in -n or -s: mit den Kinder**n**, in den Hotels. No article after numbers: zwei Äpfel.

### Articles — `articles.ts`

|     | M               | F           | N           | Plural            |
| --- | --------------- | ----------- | ----------- | ----------------- |
| Nom | der / ein       | die / eine  | das / ein   | die / keine       |
| Akk | **den / einen** | die / eine  | das / ein   | die / keine       |
| Dat | dem / einem     | der / einer | dem / einem | den / keinen + -n |

kein and the possessives (mein, dein, sein, ihr, unser, euer, Ihr) take the ein endings. dieser, jeder, welcher take the der endings. Genitive is B1.

### Cases — `cases.ts`

| Case      | Job                 | Question  | Triggers                                                              |
| --------- | ------------------- | --------- | --------------------------------------------------------------------- |
| Nominativ | subject; after sein | wer? was? | —                                                                     |
| Akkusativ | direct object       | wen? was? | durch, für, gegen, ohne, um; es gibt                                  |
| Dativ     | receiver            | wem?      | aus, bei, mit, nach, seit, von, zu; helfen, danken, gefallen, gehören |

Only the masculine changes in the accusative (der → den, ein → einen).

### Pronouns — `pronouns.ts`

| Nom | Akk  | Dat   | Possessive   |
| --- | ---- | ----- | ------------ |
| ich | mich | mir   | mein-        |
| du  | dich | dir   | dein-        |
| er  | ihn  | ihm   | sein-        |
| sie | sie  | ihr   | ihr-         |
| es  | es   | ihm   | sein-        |
| wir | uns  | uns   | unser-       |
| ihr | euch | euch  | euer- / eur- |
| sie | sie  | ihnen | ihr-         |
| Sie | Sie  | Ihnen | Ihr-         |

Formal Sie/Ihnen/Ihr are always capitalised. _Wie geht es dir / Ihnen?_ takes the dative.

### Negation — `negation.ts`

- **kein-** negates a noun that would have _ein_ or no article; it takes the ein endings: Ich habe keine Zeit / keinen Hunger.
- **nicht** negates everything else: at the end for the whole sentence (Ich komme nicht), before the second verb part (Ich kann nicht kommen), or right before what it targets (nicht heute).
- **Doch!** answers a negative question with yes. noch nicht = not yet; nicht mehr = no longer.

### Present tense — `present-tense.ts`

|           | machen | arbeiten  | sein | haben |
| --------- | ------ | --------- | ---- | ----- |
| ich       | mache  | arbeite   | bin  | habe  |
| du        | machst | arbeitest | bist | hast  |
| er/sie/es | macht  | arbeitet  | ist  | hat   |
| wir       | machen | arbeiten  | sind | haben |
| ihr       | macht  | arbeitet  | seid | habt  |
| sie/Sie   | machen | arbeiten  | sind | haben |

- Stems in -t/-d keep an e (du arbeitest); stems in -s/-ß/-z drop the s of -st (du heißt).
- Stem changes affect only du and er/sie/es: e → i (sprechen → spricht), e → ie (sehen → sieht), a → ä (fahren → fährt), au → äu (laufen → läuft).
- wissen: ich weiß, du weißt, er weiß, wir wissen.
- No -ing form; future = present + time word.

### Modal verbs — `modal-verbs.ts`

können, müssen, wollen, sollen, dürfen, mögen, möchten. ich = er, with no ending (ich kann, er kann). The modal goes in position 2 and the infinitive goes last. _nicht müssen_ = don't have to; _nicht dürfen_ = must not.

### Separable verbs — `separable-verbs.ts`

Stressed prefixes ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, zu-, zurück-, weg-, fern- split off and go last: Ich stehe um sieben auf. Whole again after a modal (Ich muss früh aufstehen) and in the participle (auf**ge**standen). be-, er-, ge-, ver- never split, and their participle has no ge- (besucht).

### Perfekt — `perfekt.ts`

haben/sein in position 2, participle last. **sein** for movement from A to B (gehen, fahren, fliegen, kommen), change of state (aufstehen, einschlafen, werden), and sein, bleiben, passieren.

| Type                | Build                  | Examples                |
| ------------------- | ---------------------- | ----------------------- |
| regular             | ge- + stem + -t        | gemacht, gearbeitet     |
| irregular           | ge- + (new) stem + -en | gesehen, getrunken      |
| separable           | prefix + ge- + …       | aufgestanden, angerufen |
| inseparable, -ieren | no ge-                 | besucht, studiert       |

### Imperative — `imperative.ts`

|     | kommen      | nehmen      | sein       |
| --- | ----------- | ----------- | ---------- |
| du  | Komm!       | Nimm!       | Sei!       |
| ihr | Kommt!      | Nehmt!      | Seid!      |
| Sie | Kommen Sie! | Nehmen Sie! | Seien Sie! |

du-form is the stem without -st and with no pronoun. It keeps e → i/ie (Nimm! Lies!) but not a → ä (Fahr!). Soften with bitte, mal, doch.

### Word order — `word-order.ts`

Verb in **position 2**; anything can go in position 1 and the subject then follows the verb. Second verb part goes last. Yes/no questions and commands start with the verb. und, aber, oder, denn change nothing. weil and dass send the verb to the end.

### Prepositions of place and time — `prepositions-place-time.ts`

- Place: nach Berlin / zu Anna, zum Arzt, zur Bank / in die Schule, ins Büro / nach Hause (going) vs zu Hause (being) / aus Pakistan / mit dem Bus, zu Fuß.
- Time: **am** + days and parts of the day; **im** + months, seasons, im Jahr 2026; **um** + clock time; seit, vor, in, von … bis.
- Wo? takes the dative; Wohin? takes the accusative.

### Telling the time — `telling-time.ts`

Viertel nach / Viertel vor; **halb acht = 7:30** (halfway _to_ eight); the official form is sieben Uhr dreißig. Units come before tens: einundzwanzig. Ordinals: erste, zweite, dritte, siebte, achte, zwanzigste; am dritten Mai. Prices: 2,50 € = zwei Euro fünfzig.

---

## A2

### Adjective endings — `adjective-endings.ts`

After **der/die/das** (weak):

|     | M   | F   | N   | Pl  |
| --- | --- | --- | --- | --- |
| Nom | -e  | -e  | -e  | -en |
| Akk | -en | -e  | -e  | -en |
| Dat | -en | -en | -en | -en |

After **ein/kein/mein** (mixed):

|     | M   | F   | N   | Pl  |
| --- | --- | --- | --- | --- |
| Nom | -er | -e  | -es | -en |
| Akk | -en | -e  | -es | -en |
| Dat | -en | -en | -en | -en |

**No article** (strong):

|     | M   | F   | N   | Pl  |
| --- | --- | --- | --- | --- |
| Nom | -er | -e  | -es | -e  |
| Akk | -en | -e  | -es | -e  |
| Dat | -em | -er | -em | -en |

An adjective after the noun never changes (Der Kaffee ist gut). Comparatives take the same endings (ein besseres Angebot).

### Dative verbs and two objects — `dative-verbs.ts`

Dative verbs: helfen, danken, gefallen, gehören, antworten, glauben (a person), passen, schmecken, fehlen, gratulieren. Object order: a dative noun before an accusative noun (Ich gebe dem Kind den Ball); a pronoun before a noun (Ich gebe ihn dem Kind); with two pronouns, accusative first (Ich gebe ihn ihm).

### Two-way prepositions — `two-way-prepositions.ts`

an, auf, hinter, in, neben, über, unter, vor, zwischen: **Wo? → Dativ** (location), **Wohin? → Akkusativ** (movement towards). Verb pairs: stellen/stehen, legen/liegen, setzen/sitzen, hängen/hängen. Contractions: am, im, ans, ins.

### Comparatives — `comparatives.ts`

klein – kleiner – am kleinsten. Short adjectives with a, o, u usually add an umlaut (alt → älter, groß → größer, jung → jünger). Irregular: gut – besser – am besten; viel – mehr – am meisten; gern – lieber – am liebsten; hoch – höher – am höchsten; nah – näher – am nächsten; teuer – teurer. Comparing uses **als**; equality uses **so … wie**.

### Präteritum — `praeteritum.ts`

|           | sein  | haben   | können   | müssen   |
| --------- | ----- | ------- | -------- | -------- |
| ich / er  | war   | hatte   | konnte   | musste   |
| du        | warst | hattest | konntest | musstest |
| wir / sie | waren | hatten  | konnten  | mussten  |
| ihr       | wart  | hattet  | konntet  | musstet  |

wollte, sollte, durfte and mochte follow the same pattern, with no umlaut. es gibt → **es gab**. Speech uses the Perfekt for most other verbs. Regular -te forms (ich machte, er arbeitete) are mainly for reading.

### The 33 irregular verbs — `irregular-verbs.ts`

| Infinitive | er/sie/es | Präteritum | Partizip II      |
| ---------- | --------- | ---------- | ---------------- |
| sein       | ist       | war        | ist gewesen      |
| haben      | hat       | hatte      | gehabt           |
| werden     | wird      | wurde      | ist geworden     |
| gehen      | geht      | ging       | ist gegangen     |
| kommen     | kommt     | kam        | ist gekommen     |
| fahren     | fährt     | fuhr       | ist gefahren     |
| bleiben    | bleibt    | blieb      | ist geblieben    |
| laufen     | läuft     | lief       | ist gelaufen     |
| fliegen    | fliegt    | flog       | ist geflogen     |
| aufstehen  | steht auf | stand auf  | ist aufgestanden |
| sehen      | sieht     | sah        | gesehen          |
| geben      | gibt      | gab        | gegeben          |
| nehmen     | nimmt     | nahm       | genommen         |
| essen      | isst      | aß         | gegessen         |
| trinken    | trinkt    | trank      | getrunken        |
| sprechen   | spricht   | sprach     | gesprochen       |
| lesen      | liest     | las        | gelesen          |
| schreiben  | schreibt  | schrieb    | geschrieben      |
| finden     | findet    | fand       | gefunden         |
| helfen     | hilft     | half       | geholfen         |
| treffen    | trifft    | traf       | getroffen        |
| schlafen   | schläft   | schlief    | geschlafen       |
| wissen     | weiß      | wusste     | gewusst          |
| denken     | denkt     | dachte     | gedacht          |
| kennen     | kennt     | kannte     | gekannt          |
| bringen    | bringt    | brachte    | gebracht         |
| beginnen   | beginnt   | begann     | begonnen         |
| verstehen  | versteht  | verstand   | verstanden       |
| bekommen   | bekommt   | bekam      | bekommen         |
| vergessen  | vergisst  | vergaß     | vergessen        |
| anfangen   | fängt an  | fing an    | angefangen       |
| anrufen    | ruft an   | rief an    | angerufen        |
| einladen   | lädt ein  | lud ein    | eingeladen       |

A prefixed verb follows its base verb (ankommen like kommen).

### Reflexive verbs — `reflexive-verbs.ts`

mich, dich, sich, uns, euch, sich. With a body part the pronoun is dative (Ich wasche mir die Hände). Learn each verb with its preposition: sich freuen **auf** (something to come) / **über** (something here now), sich interessieren **für**, sich ärgern **über**, sich erinnern **an**, sich treffen **mit**.

### Connectors — `connectors.ts`

| Effect on the verb            | Connectors                                                 |
| ----------------------------- | ---------------------------------------------------------- |
| none (position 0)             | und, oder, aber, denn, sondern                             |
| verb to the end               | weil, dass, wenn, ob, obwohl, als, bevor, bis, damit       |
| take position 1, verb follows | deshalb, deswegen, dann, danach, trotzdem, außerdem, sonst |
| two-part                      | nicht nur … sondern auch, entweder … oder, weder … noch    |

A subordinate clause in position 1 is followed directly by the main verb: Wenn ich Zeit habe, koche ich. _wann_ asks about time; _wenn_ means if or whenever; _als_ is for one moment in the past. Indirect questions also put the verb at the end.

### zu + infinitive, future, man — `zu-infinitive.ts`

zu + infinitive after Lust/Zeit haben, vorhaben, anfangen, vergessen, versuchen, and es ist wichtig/schön, with a comma before the zu-part. Separable verbs take zu inside the verb: aufzustehen. No zu after modals or gehen. Future: werden + infinitive for plans. _man_ takes the er-form. Advice: Du solltest … / Du könntest …

### Inside the middle field — `sentence-middle.ts`

Te-Ka-Mo-Lo: time, then cause, then manner, then place (Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin). Object order follows the dative-verbs rules. nicht goes at the end, before the second verb part, or before what it targets.
