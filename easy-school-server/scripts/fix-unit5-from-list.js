import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const RAW_LIST = `take a class --> wziąć udział w zajęciach
take a holiday --> jechać na wakacje
take photographs --> robić zdjęcia
write a blog --> pisać blog
make healthy choices --> dokonywać wyborów prozdrowotnych
physical education class --> lekcja wychowania fizycznego
relaxed --> zrelaksowany, rozluźniony
simple --> prosty, zwyczajny
sleep in --> pospać dłużej
traditional --> tradycyjny, zwykły
unhealthy --> niezdrowy
bank holiday --> dzień ustawowo wolny od pracy
birthday cake --> tort urodzinowy
blow out candles --> zdmuchiwać świeczki
celebrate --> świętować
congratulations --> gratulacje
decorations --> ozdoby, dekoracje
give chocolates/flowers/presents --> dawać komuś czekolady/kwiaty/prezenty
holiday --> święto, dzień wolny od pracy, urlop, wakacje
honeymoon --> miesiąc miodowy
invite --> zapraszać
long weekend --> długi weekend
make a wish --> pomyśleć życzenie
marriage proposal --> oświadczyny
New Year’s Eve --> Sylwester
occasion --> okazja, wydarzenie
put up decorations --> rozwiesić dekoracje
special occasion --> specjalna okazja
surprise party --> przyjęcie niespodzianka
take turns --> robić coś na zmianę
throw/hold a party --> urządzić imprezę, wydać przyjęcie
wedding anniversary --> rocznica ślubu
wedding cake --> tort weselny
wedding ceremony --> ceremonia ślubna
wedding dress --> suknia ślubna
aisle --> nawa (w kościele)
best man --> drużba, świadek
bride --> panna młoda
burial --> pochówek, ceremonia pogrzebowa
carnival --> karnawał
cemetery --> cmentarz
church wedding --> ślub kościelny
civil wedding --> ślub cywilny
countdown --> odliczanie
fireworks --> fajerwerki, sztuczne ognie
float --> platforma (np. w paradzie)
funeral --> pogrzeb
gathering --> spotkanie, zgromadzenie
groom --> pan młody
maid of honour --> druhna, świadek
make a speech --> wygłosić mowę, przemówienie
newlyweds --> nowożeńcy
parade --> parada
reception --> przyjęcie
reunion --> zlot, zjazd, spotkanie
argue with somebody --> kłócić się z kimś
argument --> kłótnia, sprzeczka
bad attitude --> złe nastawienie
break up with somebody --> zerwać z kimś
change one’s mind --> zmienić zdanie
have a falling-out with somebody --> pokłócić się z kimś
have a long face --> mieć smutną minę
have an issue with somebody/something --> mieć problem z kimś/czymś
listen to reason --> słuchać głosu rozsądku
make fun of somebody --> naśmiewać się z kogoś
make up with somebody --> pogodzić się z kimś
misunderstanding --> nieporozumienie
pass judgement --> wydać osąd
remain objective --> pozostać obiektywnym
resolve an issue --> rozwiązać problem
row --> awantura, kłótnia, sprzeczka
ruin one’s reputation --> zrujnować reputację
speculation --> spekulacja, przypuszczenie
take a side --> stanąć po czyjejś stronie
take criticism well --> dobrze przyjąć krytykę
turn to somebody for advice --> zwrócić się do kogoś po radę
addiction --> uzależnienie
address issues --> rozwiązywać problemy
fall out with somebody --> pokłócić się z kimś
ground somebody --> dać komuś szlaban
have an impact on --> mieć wpływ na
keep to oneself --> trzymać się na uboczu
manage conflict --> rozwiązywać konflikty
overreact --> przesadnie reagować
rebellious behaviour --> buntownicze zachowanie
settle disagreements --> rozstrzygać spory
active --> aktywny
athletic --> wysportowany
break a sweat --> wysilać się, pocić się
couch potato --> kanapowiec, leń
favourite pastime --> ulubione zajęcie, rozrywka
have energy --> mieć energię
healthy --> zdrowy
lazy --> leniwy
adult --> dorosły
aunt --> ciocia
baby --> dziecko
brother --> brat
brother-in-law --> szwagier
cousin --> kuzyn/kuzynka
daughter --> córka
daughter-in-law --> synowa
ex-husband --> były mąż
extended family --> rodzina wielopokoleniowa
ex-wife --> była żona
father --> ojciec
father-in-law --> teść
first-born --> pierworodny
get engaged --> zaręczyć się
get married --> wziąć ślub
granddaughter --> wnuczka
grandfather --> dziadek
grandmother --> babcia
grandparents --> dziadkowie
grandson --> wnuk
great-grandfather --> pradziadek
great-grandmother --> prababcia
great-grandparents --> pradziadkowie
identical --> identyczny
look after --> zajmować się, opiekować się
mother --> matka
nephew --> bratanek, siostrzeniec
niece --> bratanica, siostrzenica
nuclear family --> rodzina dwupokoleniowa
only child --> jedynak
parents --> rodzice
pregnant --> w ciąży
siblings --> rodzeństwo
single --> w stanie wolnym
sister --> siostra
sister-in-law --> szwagierka
son --> syn
son-in-law --> zięć
take after --> być podobnym do
twins --> bliźniaki
uncle --> wujek
adopted --> adoptowany
be related to --> być spokrewnionym
biological father --> biologiczny ojciec
distant cousin --> daleki kuzyn
fellow members --> współczłonkowie
foster parents --> rodzice zastępczy
single parent family --> rodzina niepełna
a circle of friends --> krąg przyjaciół
best friend --> najlepszy przyjaciel
childhood friend --> przyjaciel z dzieciństwa
classmate --> kolega/koleżanka z klasy
close friend --> bliski przyjaciel
count on somebody --> liczyć na kogoś
family friend --> przyjaciel rodziny
get along with somebody --> dobrze się dogadywać
get together with somebody --> spotykać się
long-lost friend --> dawno niewidziany przyjaciel
mutual friend --> wspólny przyjaciel
neighbour --> sąsiad
online friend --> znajomy online
reconnect with somebody --> połączyć się ponownie
trust somebody --> ufać komuś
brush one’s teeth --> myć zęby
clip one’s nails --> przycinać paznokcie
comb one’s hair --> czesać włosy
do one’s homework --> odrabiać zadanie domowe
do the ironing --> prasować
do the laundry --> robić pranie
do the shopping --> robić zakupy
do the washing-up --> zmywać naczynia
get dressed --> ubrać się
get ready --> przygotowywać się
get up --> wstawać
go home --> iść do domu
go out --> wyjść z domu
go shopping --> iść na zakupy
go to bed --> iść spać
have a snack --> przekąsić coś
have breakfast --> jeść śniadanie
have dinner --> jeść obiad/kolację
iron the clothes --> prasować ubrania
make a mess --> zrobić bałagan
make breakfast/lunch/dinner --> przygotować posiłek
make the bed --> ścielić łóżko
shave one’s face --> ogolić twarz
stay awake --> nie zasnąć
stay home --> zostać w domu
stay in bed --> zostać w łóżku
take/have a shower --> wziąć prysznic
wake up --> obudzić się
wash the dishes --> zmywać naczynia
wear perfume/cologne --> używać perfum
at dawn --> o świcie
at dusk --> o zmierzchu
at Easter/Christmas --> na Wielkanoc/Boże Narodzenie
at night --> w nocy
at noon --> w południe
at present --> obecnie
at sunset --> o zachodzie słońca
at the weekend --> w weekend
bright and early --> bladym świtem
daily --> codziennie
evening --> wieczór
in an hour/a few minutes --> za godzinę/kilka minut
in autumn --> jesienią
in the morning/afternoon/evening --> rano/po południu/wieczorem
midday --> południe
midnight --> północ
on a regular basis --> regularnie
once a week --> raz w tygodniu
on Tuesday --> we wtorek
on weekdays --> w dni powszednie
sometimes --> czasami
twice a day --> dwa razy dziennie
chat online --> czatować online
do crosswords --> rozwiązywać krzyżówki
do exercise --> ćwiczyć
do karate --> uprawiać karate
do voluntary work --> pracować jako wolontariusz
go camping --> jechać na kemping
go for a walk --> iść na spacer
go hiking --> iść na pieszą wycieczkę
go jogging --> iść pobiegać
go rollerblading --> jeździć na rolkach
have/enjoy a night in --> spędzić wieczór w domu
have a hobby --> mieć hobby
have/enjoy a night out --> wybrać się gdzieś wieczorem
have friends over --> gościć przyjaciół
hang out --> spędzać czas
meet new people --> poznawać ludzi
play an instrument --> grać na instrumencie
play board games --> grać w gry planszowe
play chess --> grać w szachy
play in a band --> grać w zespole
play the guitar --> grać na gitarze
read a blog/a novel/the news --> czytać blog/powieść/wiadomości
spare/free time --> wolny czas
surf the Internet --> surfować po internecie
adrenaline rush --> zastrzyk adrenaliny
attend a fitness class --> uczestniczyć w zajęciach fitness
balanced diet --> zbilansowana dieta
be glued to --> być przyklejonym do czegoś
build stamina --> budować wytrzymałość
cholesterol level --> poziom cholesterolu
chronic disease --> choroba przewlekła
do a workout --> ćwiczyć
fitness routine --> regularny trening
get active --> być aktywnym
keep hydrated --> dbać o nawodnienie
moderate exercise --> umiarkowany wysiłek
participate in something --> brać udział w czymś
set a time limit --> wyznaczyć limit czasu
stress buster --> coś pomagającego zwalczyć stres
strict --> ścisły, restrykcyjny
suffer from --> cierpieć z powodu`;

function normEnglish(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFC')
    .replace(/[’`´]/g, "'")
    .replace(/\?/g, "'")
    .replace(/\s+/g, ' ');
}

function parseDictionary(raw) {
  const map = new Map();
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const arrowIndex = trimmed.indexOf('-->');
    if (arrowIndex === -1) continue;
    const english = trimmed.slice(0, arrowIndex).trim();
    const polish = trimmed.slice(arrowIndex + 3).trim();
    if (!english || !polish) continue;
    map.set(normEnglish(english), polish);
  }
  return map;
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is missing in .env');
}

const dictionary = parseDictionary(RAW_LIST);

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db();
const sets = db.collection('sets');

const set = await sets.findOne({ name: /Unit 5/i });
if (!set) {
  console.log('Nie znaleziono zestawu Unit 5.');
  await client.close();
  process.exit(0);
}

let replaced = 0;
let alreadyOk = 0;
let missingMapping = 0;
const missingEntries = [];

const updatedWords = (set.words || []).map((word) => {
  const english = String(word.english ?? '').trim();
  const key = normEnglish(english);
  const targetPolish = dictionary.get(key);

  if (!targetPolish) {
    missingMapping += 1;
    missingEntries.push(english);
    return word;
  }

  const currentPolish = String(word.polish ?? '').trim();
  if (currentPolish === targetPolish) {
    alreadyOk += 1;
    return { ...word, polish: targetPolish, english: english.normalize('NFC') };
  }

  replaced += 1;
  return { ...word, polish: targetPolish, english: english.normalize('NFC') };
});

const nextName = 'Unit 5 Życie prywatne';

await sets.updateOne(
  { _id: set._id },
  {
    $set: {
      name: nextName,
      words: updatedWords,
      updatedAt: new Date()
    }
  }
);

const verify = await sets.findOne({ _id: set._id });
const unresolved = (verify.words || []).filter((w) => String(w.polish || '').includes('?')).length;

console.log(JSON.stringify({
  setId: set._id.toString(),
  oldName: set.name,
  newName: nextName,
  totalWords: (set.words || []).length,
  dictionarySize: dictionary.size,
  replaced,
  alreadyOk,
  missingMapping,
  missingEntriesPreview: missingEntries.slice(0, 20),
  unresolvedQuestionMarksAfterFix: unresolved
}, null, 2));

await client.close();
