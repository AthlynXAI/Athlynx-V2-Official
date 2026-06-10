# AthlynXAI OS — Full-Stack Sport Classification Matrix

**Locked at 2:55 AM CDT, Saturday, May 16, 2026 — Build 27 OS Drop**
**Captured from founder Chad A. Dozier Sr.:**

> *"I want it to classify all sports the whole AthlynXAI OS full stack layer cake with Tokenization baked in."*

This is the canonical sport-to-layer-to-token map for AthlynXAI. Every sport in the platform is classified against:

1. **All 9 layers of the Layer Cake** — what each sport looks like in Identity, Public Feed, Messenger, NIL Feed, NIL Messenger, Calendar, The Stack, AI on top, and Syndication.
2. **All 18 token classes from the Tokenization Layer** — with sport-specialized payload shapes for RoutineToken, ScoreToken, MilestoneToken, BidToken, EventToken, EquipmentToken.

The Studio Suite reads from this matrix at runtime. New sport = add a row + payload, the whole cake lights up automatically.

---

## Master Sport Roster (32 sports)

Drawn from `shared/sports.ts` + Build 27 additions (Cheer + Gymnastics sub-disciplines).

| # | Sport | Key | Gender | Group | NCAA | NIL Tier |
|---|---|---|---|---|---|---|
| 1 | Baseball | `baseball` | M | baseball_softball | D1·D2·D3·NAIA·JUCO | **S** |
| 2 | Softball | `softball` | W | baseball_softball | D1·D2·D3·NAIA·JUCO | A |
| 3 | Basketball (M) | `basketball_m` | M | basketball | D1·D2·D3·NAIA·JUCO | **S** |
| 4 | Basketball (W) | `basketball_w` | W | basketball | D1·D2·D3·NAIA·JUCO | **S** |
| 5 | Football | `football` | M | football | D1·D2·D3·NAIA·JUCO | **S** |
| 6 | Soccer (M) | `soccer_m` | M | soccer | D1·D2·D3·NAIA·JUCO | A |
| 7 | Soccer (W) | `soccer_w` | W | soccer | D1·D2·D3·NAIA·JUCO | A |
| 8 | Lacrosse (M) | `lacrosse_m` | M | lacrosse | D1·D2·D3 | B |
| 9 | Lacrosse (W) | `lacrosse_w` | W | lacrosse | D1·D2·D3 | B |
| 10 | Hockey (M) | `hockey_m` | M | hockey | D1·D3 | B |
| 11 | Hockey (W) | `hockey_w` | W | hockey | D1·D3 | C |
| 12 | Volleyball (W) | `volleyball_w` | W | volleyball | D1·D2·D3·NAIA·JUCO | A |
| 13 | Volleyball (M) | `volleyball_m` | M | volleyball | D1·D2·D3 | C |
| 14 | Gymnastics (W) | `gymnastics_w` | W | gymnastics | D1·D2·D3 | **S** |
| 15 | Gymnastics (M) | `gymnastics_m` | M | gymnastics | D1 | C |
| 16 | Track & Field (M) | `track_field_m` | M | track_field | D1·D2·D3·NAIA | B |
| 17 | Track & Field (W) | `track_field_w` | W | track_field | D1·D2·D3·NAIA | A |
| 18 | Cross Country (M) | `cross_country_m` | M | cross_country | D1·D2·D3·NAIA | C |
| 19 | Cross Country (W) | `cross_country_w` | W | cross_country | D1·D2·D3·NAIA | C |
| 20 | Swim & Dive (M) | `swim_dive_m` | M | swim_dive | D1·D2·D3 | B |
| 21 | Swim & Dive (W) | `swim_dive_w` | W | swim_dive | D1·D2·D3 | A |
| 22 | Tennis (M) | `tennis_m` | M | tennis | D1·D2·D3·NAIA | B |
| 23 | Tennis (W) | `tennis_w` | W | tennis | D1·D2·D3·NAIA | B |
| 24 | Golf (M) | `golf_m` | M | golf | D1·D2·D3·NAIA | A |
| 25 | Golf (W) | `golf_w` | W | golf | D1·D2·D3·NAIA | A |
| 26 | Wrestling (M) | `wrestling_m` | M | wrestling | D1·D2·D3·NAIA·JUCO | B |
| 27 | Wrestling (W) | `wrestling_w` | W | wrestling | D1·D2·D3·NAIA | C |
| 28 | Water Polo (M) | `water_polo_m` | M | water_polo | D1·D3 | C |
| 29 | Water Polo (W) | `water_polo_w` | W | water_polo | D1·D2·D3 | C |
| 30 | Rowing (W) | `rowing_w` | W | rowing | D1·D2·D3 | C |
| 31 | **Cheer** (All-Star + School) | `cheer` | Coed | cheer | non-NCAA (USASF/NCA/UCA) | **S** |
| 32 | **Gymnastics — Rhythmic** | `gymnastics_rhythmic` | W | gymnastics | USAG only | B |
| 33 | **Gymnastics — Acro** | `gymnastics_acro` | Coed | gymnastics | USAG only | C |
| 34 | **Gymnastics — T&T** (Trampoline & Tumbling) | `gymnastics_tt` | Coed | gymnastics | USAG only | C |
| 35 | **Marching Band** (BOA / state circuits) | `marching_band` | Coed | performing_arts | non-NCAA (BOA / USBands / state) | **S** |
| 36 | **Color Guard** (fall, w/ marching band) | `color_guard_fall` | Coed | performing_arts | non-NCAA | A |
| 37 | **Winter Guard** (indoor, WGI) | `winter_guard` | Coed | performing_arts | non-NCAA (WGI) | **S** |
| 38 | **Indoor Percussion** (WGI) | `indoor_percussion` | Coed | performing_arts | non-NCAA (WGI) | A |
| 39 | **Indoor Winds** (WGI Winds) | `indoor_winds` | Coed | performing_arts | non-NCAA (WGI) | B |
| 40 | **Drum Corps** (DCI — World / Open / All-Age) | `drum_corps` | Coed | performing_arts | non-NCAA (DCI 14–22 yo) | **S** |

**NIL Tiers:** S = top-tier earning potential (Football, Basketball M/W, Gymnastics W, Cheer, Baseball — see [On3 NIL Valuations](https://www.on3.com/nil/rankings/player/nil-100/)). A = high (Olympic visibility, marquee sports). B = mid. C = developing.

**Performing Arts group — why it's first-class on AthlynXAI:**
Marching arts is the largest under-served athletic vertical in the country. BOA [Grand National Championships](https://marching.musicforall.org/grand-national-championships/) draws 100+ HS bands and 50,000+ spectators to Lucas Oil Stadium every November ([2025 results: Avon HS 97.825, Flower Mound 97.625, Carmel 96.450](https://marching.musicforall.org/result/grand-national-championships-2025/)). WGI [World Championships](https://www.wgi.org/color-guard/world-championships-cg/) sanctions Color Guard, Percussion, and Winds with hundreds of independent + scholastic groups. [DCI World Championship](https://www.dci.org/news/2025-dci-world-championship-caption-award-winners/) is the premier drum corps event, age 14–22. **0 platforms currently serve this market at scale.** This is the cleanest blue-ocean pickup in the entire AthlynXAI sport graph.

---

## The Layer × Sport Matrix (9 layers × 40 sports/disciplines)

Each layer behaves the same shape for every sport, but the **content** specializes. Read each row left→right as: *"How does Sport X show up in Layer Y?"*

### Layer 1 — IDENTITY (the profile)

| Sport | Position/Specialty Field | Vitals Above Fold | Level/Class System |
|---|---|---|---|
| Baseball / Softball | Position (P/C/IF/OF) + bat/throw hand | HT/WT, throws, GPA, 60-yd, exit velo | HS class · JUCO · NCAA D1-3 |
| Basketball M/W | Position (PG/SG/SF/PF/C) | HT/WT, wingspan, vertical | HS class · AAU circuit · NCAA · WNBA pipeline |
| Football | Position (QB/RB/WR/TE/OL/DL/LB/DB/K/P) | HT/WT, 40-yd, bench, vertical | HS · 247 stars · NCAA · NFL pipeline |
| Soccer M/W | Position (GK/D/M/F) + foot | HT/WT, sprint, ECNL/MLS Next club | HS · ECNL/MLS Next · NCAA · NWSL/MLS |
| Lacrosse M/W | Position (Att/Mid/Def/FOGO/Goalie) | HT/WT, shot speed, club team | HS · Inside Lax rank · NCAA |
| Hockey M/W | Position (F/D/G) + shot side | HT/WT, USA-H tier, OHL/USHL | Tier 1/2/3 · USHL/NAHL · NCAA · NHL draft |
| Volleyball W/M | Position (OH/MB/S/L/RS/DS) | HT, vert, approach reach, club | Club ranks · HS · NCAA |
| Gymnastics W/M | Specialty (AA / VT / UB / BB / FX / PH / SR / PB / HB) | HT/WT, level, club gym | USAG Level 1-10 · Xcel · Elite · NCAA |
| Track & Field M/W | Events (sprint/distance/jump/throw/multi) | PRs per event | HS · Foot Locker · NCAA · USATF |
| Cross Country M/W | Distance focus + 5K/8K/10K PR | HT/WT, 5K PR, state rank | HS · NCAA · USATF |
| Swim & Dive M/W | Strokes + PR times | HT, wingspan, FINA points | USA Swim · NCAA · Olympic Trials |
| Tennis M/W | Hand + 1H/2H BH + UTR | HT, UTR, ITF/ATP rank | UTR · USTA · ITF · NCAA |
| Golf M/W | Handicap + clubs spec | HT, handicap, AJGA/WAGR rank | AJGA · WAGR · NCAA · LPGA/PGA |
| Wrestling M/W | Weight class + style (FS/Greco/Folk) | Weight, record, state place | HS · NCAA · USAW |
| Water Polo M/W | Position (driver/center/goalie) | HT, vert, club tier | HS · ODP · NCAA |
| Rowing W | Side (port/stroke/cox) + seat | HT, 2K erg, 5K erg | Club · NCAA · USRowing |
| **Cheer** | Position (base/back/flyer/tumbler/dancer) + level | HT/WT, tumbling skills (BHS/Tuck/Full), stunt position | USASF L1-7 · HS · College DI/DII/Open/Game Day · Worlds/Summit history |
| **Gymnastics — Rhythmic** | Apparatus specialty (hoop/ball/clubs/ribbon/rope) | HT/WT, flex/grace metrics, level | USAG Rhythmic L4-10 · Elite · NCAA pre-elite |
| **Gymnastics — Acro** | Pair/trio role (top/middle/base) | HT/WT, pair partner ID | USAG Acro L4-10 · FIG Senior |
| **Gymnastics — T&T** | Discipline (trampoline / double mini / power tumbling) | HT, level, top score | USAG T&T L4-10 · World Age Group |
| **Marching Band** | Instrument + section (brass/woodwind/battery/front-ensemble/guard/drum-major) | HT, primary instrument, section leader status, audition tape | School band · BOA class A/AA/AAA/AAAA · state circuit · collegiate |
| **Color Guard (fall)** | Equipment (flag / rifle / sabre) + role (soloist/section/captain) | HT, equipment proficiencies, dance background | School · BOA · state circuit |
| **Winter Guard (WGI)** | Equipment + class (Regional A → Scholastic World → Independent World) | HT, equipment proficiencies, years in activity | WGI Regional A → A → Open → World (Scholastic + Independent) |
| **Indoor Percussion (WGI)** | Instrument (snare/tenors/bass/cymbals/keyboard/timpani/aux) + class | HT, primary instrument, audition tape | WGI Regional A → A → Open → World (Scholastic + Independent) |
| **Indoor Winds (WGI)** | Instrument + class | HT, primary instrument | WGI Regional A → A → Open → World |
| **Drum Corps (DCI)** | Section (brass/percussion/front-ensemble/guard/drum-major) + corps | HT, primary instrument, marching years, corps history | DCI World Class / Open Class / All-Age · age 14–22 |

**Token emission on Layer 1:** `AthleteToken` (one per sport per athlete; an athlete can carry multiple if they cross over — e.g., football + track + baseball is common in HS).

### Layer 2 — PUBLIC FEED

Same UI, sport-aware content:

| Sport | Default Feed Filters | Highest-Engagement Post Types |
|---|---|---|
| Football | Position + class year + state | Highlight reel · commit · combine PR · game-winner |
| Basketball M/W | Position + class year + AAU circuit | Highlight · dunk/clutch · commit · transfer portal |
| Baseball / Softball | Position + class year + state | Walk-off · no-hitter · commit · showcase video |
| Soccer M/W | Position + club + class | Goal of the week · golazo · commit · ID camp |
| Gymnastics W/M | Event + level + region | **Perfect 10** · stuck landing · career high · signing day · meet recap |
| **Cheer** | Level + division + region | **Bid reveal** · Hit Zero · banner · mat call · senior night · choreo drop |
| Lacrosse | Position + region + class | Goal · save · commit · tournament champ |
| Track/XC | Event + PR + state | PR card · race recap · meet schedule · split graphic |
| Swim/Dive | Event + region + class | PR cut · cut card · meet schedule · trials qualifier |
| Tennis/Golf | UTR/handicap + region | Tournament W · ranking jump · commit · tour invite |
| Wrestling | Weight + record + state | Pin · state place · NCAA seed · weight cert |
| Hockey | Position + tier + draft | Goal of week · USHL recap · draft commit |
| Volleyball | Position + club + class | Kill clip · club commit · NCAA commit · tourney recap |
| Water Polo | Position + region | Cap recap · ODP camp · NCAA commit |
| Rowing | Boat + seat + erg | Erg PR · Henley · Head of Charles · NCAA commit |

**Tokens emitted Layer 2:** `PostToken` (always), `RoutineToken` if it wraps a scored performance, `ScoreToken` if it wraps a result, `MilestoneToken` for hits/PRs/perfect-10s.

### Layer 3 — PRIVATE MESSENGER (1:1 + Group)

Same UI, sport-specialized **Group Templates** auto-created on connect:

| Sport | Auto-Created Groups |
|---|---|
| Baseball/Softball | Team · Travel team · Position group · Coaches · Scouts (verified) |
| Basketball M/W | Team · AAU squad · Position group · Coaches · Scouts |
| Football | Team · Position room (QB room, OL room) · Coordinators · Recruiters |
| Soccer M/W | Team · Club · Position line · Coaching staff · ID camp cohort |
| Gymnastics | Club gym · Level group · Event squad (bars squad, beam squad) · Recruiting class |
| **Cheer** | Team · Level · Stunt group · Choreo cohort · Bid trip group · Coaches |
| Lacrosse | Team · Club · Position group · Coaches |
| Track/XC | Team · Event group (sprinters/distance/throwers) · Travel squad |
| Swim/Dive | Team · Stroke group · Travel meet group · Trials prep |
| Tennis | Team · Doubles partner · Coach · Tournament travel |
| Golf | Team · Tournament travel · Coach · Caddie |
| Wrestling | Team · Weight class group · Travel · Camp cohort |
| Hockey | Team · Line (1st/2nd/3rd/4th) · Goalie group · Junior team |
| Volleyball | Team · Position group · Club · Recruiting class |

**Tokens:** `MessageToken` per send. `MessageToken.payload.context_group_kind` is sport-aware.

### Layer 4 — NIL PUBLIC FEED

| Sport | NIL Deal Density (avg deal $) | Common Brand Categories |
|---|---|---|
| Football | High volume, $1K-$50K typical | Apparel · Auto · Local restaurant · Energy drink |
| Basketball M/W | High, $1K-$25K | Apparel · Sneaker · Beauty (W) · Energy |
| **Gymnastics W** | **$7,100 avg deal — 2× football, 4× all-sports** ([Opendorse 2025 data](https://opendorse.com/blog/nil-deal-data/)) | Leos · Beauty · Lifestyle · Athletic apparel |
| **Cheer** | Growing, $500-$10K (FAMU × Mielle $250K precedent) | Bows/uniforms · Beauty · Lifestyle |
| Softball | $2K-$15K | Bats · Gloves · Apparel · Beauty |
| Volleyball W | $1K-$10K | Apparel · Beauty · Athleisure |
| Baseball | $1K-$10K | Bats · Gloves · Cleats · Local |
| Soccer W | $1K-$8K | Cleats · Apparel · Lifestyle |
| Track & Field W | $500-$5K | Spikes · Apparel · Beauty |
| Swim W | $500-$5K | Suits · Goggles · Sun care |
| Lacrosse | $500-$5K | Stick/glove · Apparel · Local |
| Tennis/Golf | $500-$8K | Equipment · Apparel · Country club partners |
| Hockey | $500-$3K | Stick · Pads · Local |
| Wrestling | $500-$3K | Singlet · Shoes · Supplements |
| Cross Country | $500-$2K | Shoes · Apparel |
| Water Polo / Rowing | $500-$2K | Apparel · Lifestyle |

**Tokens:** `DealToken` on creation, `BroadcastToken` when announcement publishes, `LedgerToken` when money moves, `VerificationToken` on signed contract.

### Layer 5 — NIL PRIVATE MESSENGER (Deal Rooms)

Same UI, sport-aware deal-room **templates**:

- Football/Basketball/Baseball: 3-way (athlete + agent + brand) standard, lawyer on-call
- Gymnastics/Cheer/Volleyball W: 4-way (athlete + parent + agent + brand) — high parent involvement at HS/college
- Track/Swim/Golf/Tennis: 2-way (athlete + brand) common — solo-sport athletes often self-rep early
- Hockey: 3-way (athlete + agent + brand) — junior agents standard
- Wrestling/Water Polo/Rowing: 2-way + lawyer

Every deal room thread carries the same `MessageToken` shape with `context.kind = "deal_room"`.

### Layer 6 — CALENDAR (the schedule layer)

| Sport | Standard Event Kinds |
|---|---|
| Baseball/Softball | game · double-header · tournament · showcase · PG event · travel ball weekend |
| Basketball M/W | game · AAU tournament · live period · combine · open gym |
| Football | game · 7-on-7 · combine · spring practice · official visit |
| Soccer M/W | match · ECNL/MLS Next event · ID camp · ODP camp |
| Gymnastics W/M | meet · state · regionals · JO nationals · Xcel regionals · NCAA dual · conference championships · Four on the Floor · Olympic Trials |
| **Cheer** | competition · NCA HS Nationals · NCA College Daytona · UCA Nationals · Summit · The Cheerleading Worlds · bid camp · choreo camp · tryouts · game day |
| Lacrosse | game · tournament (Inside Lax) · ID camp · showcase |
| Track/XC | dual · invitational · state · regionals · nationals · USATF · Olympic Trials |
| Swim/Dive | dual · invite · sectionals · championships · trials |
| Tennis | tournament · UTR event · ITF junior · NCAA dual |
| Golf | tournament (AJGA) · qualifier · NCAA event · invitational |
| Wrestling | dual · tournament · state · regionals · NCAAs · USAW |
| Hockey | game · USHL series · combine · IIHF · NHL draft |
| Volleyball | match · club tournament · NCAA tournament |
| Water Polo | match · ODP · NCAA |
| Rowing | regatta · Henley · Head of the Charles · NCAA |
| **Marching Band** | football halftime · local competition · BOA regional · BOA super regional · BOA Grand Nationals (Lucas Oil) · state championships · Macy's / Rose Parade · audition cycle · band camp |
| **Color Guard (fall)** | football halftime · BOA event · state championships · camp · captain auditions |
| **Winter Guard / Indoor Percussion / Winds** | WGI regional · WGI Power Regional · WGI World Championships (Dayton) · local circuit · prelims/finals · camp · auditions |
| **Drum Corps** | spring training · tour show · DCI regional · DCI Tour of Champions · DCI World Championship Prelims/Semis/Finals (Indianapolis) · alumni reunions |

**Tokens:** `EventToken` per calendar entry. `EventToken.payload.kind` keys off the sport list above.

### Layer 7 — THE STACK (people around the athlete)

| Sport | Stack Roles Most-Connected (in order) |
|---|---|
| Football D1 | Position coach · HC · Recruiting coordinator · Agent (post-NIL) · Lawyer · Family |
| Basketball M/W | AAU coach · HS coach · College coach · Trainer · Agent · Family |
| Baseball | Travel coach · HS coach · Scout · Agent · Family |
| Gymnastics | Club coach · Choreographer · Sports psych · NCAA coach (post-commit) · NIL agent · Family |
| **Cheer** | Gym owner · Choreographer · Stunt coach · Tumbling coach · School coach · Family · NIL agent |
| Soccer M/W | Club DOC · College coach · Agent (pro pathway) · Family |
| Lacrosse | Club coach · HS coach · College coach · Family |
| Track/XC | HS coach · College coach · Shoe rep (Nike/adidas elite) · Sports doc · Family |
| Swim/Dive | Club coach · College coach · Sports psych · Family |
| Tennis | Personal coach · Academy coach · Hitting partner · Agent · Family |
| Golf | Swing coach · Mental coach · Caddie · Family |
| Wrestling | Club coach · HS coach · Strength coach · Family |
| Hockey | Junior coach · NHL scout · Agent · Family |
| Volleyball | Club director · HS coach · College coach · Family |
| Water Polo/Rowing | Club coach · College coach · Family |

**Tokens:** `StackToken` per relationship. Permissions cascade through stack roles into messenger/calendar visibility.

### Layer 8 — AI ON TOP

Every sport gets the same five AI capabilities, sport-tuned:

1. **Caption Engine** — auto-writes social captions matching the sport's voice (cheer = "MAT CALL · we're up next 🤍"; gymnastics = "Stuck it. 9.95 on beam. 🐅"; football = "We comin'. 🐀")
2. **Highlight Reel Generator** — clips uploaded film into a sport-appropriate cut (cheer = full-routine + bid moment; gymnastics = per-apparatus 12s clips; football = play-of-game)
3. **NIL Valuation** — sport-tier-aware multiplier (S-tier multiplier > A > B > C)
4. **Recruiting Matchmaker** — matches athletes to sport-appropriate scouts/coaches
5. **Coach Lynx Chat** — sport-context-aware AI assistant (different system prompt per sport key)

**Tokens:** `AIToken` per inference. Metered into TraffickToken → LedgerToken.

### Layer 9 — SYNDICATION OUT

Same Buffer/Zapier broadcast bus. Sport-aware **hashtag autocomplete** + **best-time-to-post defaults**:

| Sport | Default hashtags | Best post times (CT) |
|---|---|---|
| Football | #CFB #NFL #Recruit #CollegeFootball | Sat 9am · Sun 12pm |
| Basketball M/W | #CBB #NCAAW #MarchMadness | M-F 6pm · weekends |
| Gymnastics W | #NCAAGymnastics #Perfect10 #Fouronthe Floor #LSUgym #Boomergymnastics #UCLAgym | Fri-Sat 6-9pm |
| **Cheer** | #HitZero #DaytonaBound #PaidBid #Worlds #Summit #NCAHSNationals #UCANationals | M-Th 7-9pm · meet days live |
| Baseball | #MLB #CWS #DraftClass #ProspectWatch | game days |
| Soccer | #MLS #NWSL #USMNT #USWNT #ECNL | M-W 6pm · matches live |
| Track/XC | #USATF #NCAATrack #FootLocker | Sat AM meets |
| Swim/Dive | #USASwimming #NCAASwim | Fri-Sat |
| Wrestling | #NCAAWrestling #FloWrestling | weekends |
| Hockey | #NHL #NCAAHockey #USHL #DraftDay | Sat night |
| Lacrosse | #InsideLax #NCAAlax #ClubLax | weekends |
| Volleyball | #NCAAVB #USAV #ClubVB | Fri night · weekends |
| Golf/Tennis | #AJGA #USTAJrs #PGAJrs #UTR | tournament weeks |
| Water Polo/Rowing | #USAWaterPolo #USRowing | event days |

**Tokens:** `BroadcastToken` per platform fan-out. Each platform = 1 token; a "post everywhere" = up to 5 BroadcastTokens billed.

---

## The Token × Sport Specialization Map

Every sport plugs into all 18 token classes, but specializes the **payload** of these six:

### `RoutineToken.<sport>.payload`

```ts
// Generic shape
interface RoutineToken {
  id: string;
  athleteTokenId: string;
  sport: SportKey;
  payload: SportSpecificRoutinePayload;
  videoUrl?: string;
  signedBy: string;
  signedAt: ISO8601;
}
```

| Sport | `payload` keys |
|---|---|
| Baseball / Softball | `{ atBat?: AtBat, pitch?: Pitch, defensive?: Play, situation: GameSituation }` |
| Basketball M/W | `{ possession: Possession, shotType, distance, result, assist?: AthleteId }` |
| Football | `{ drive: DriveContext, play: PlayCall, snap: SnapResult, yardage, td?: bool }` |
| Soccer M/W | `{ phase: "build"|"final_third"|"set_piece", shot?: ShotData, goal?: bool, assist?: AthleteId }` |
| Lacrosse | `{ position, shot?, save?, ground_ball?, faceoff?, transition?: bool }` |
| Hockey M/W | `{ shift: ShiftContext, shot?, save?, hit?, faceoff?, goal?, assist? }` |
| Volleyball | `{ rotation, set?: SetData, kill?: bool, dig?, block?, ace? }` |
| **Gymnastics W/M** | `{ apparatus: "VT"|"UB"|"BB"|"FX"|"PH"|"SR"|"PB"|"HB", level: GymLevel, dScore?, eScore?, startValue?, finalScore, stuck: bool, fall?: bool }` |
| **Gymnastics Rhythmic** | `{ apparatus: "hoop"|"ball"|"clubs"|"ribbon"|"rope", dScore, eScore, finalScore }` |
| **Gymnastics Acro** | `{ discipline: "balance"|"dynamic"|"combined", pairId, dScore, eScore, finalScore }` |
| **Gymnastics T&T** | `{ discipline: "trampoline"|"double_mini"|"power_tumbling", finalScore }` |
| **Cheer** | `{ section: "stunts"|"pyramid"|"baskets"|"tumbling"|"jumps"|"dance"|"cheer"|"game_day", level: 1-7, hit: bool, deductions: number, scoreSheetRows?: NCAScoreSheetRow[] | UCAGameDayRow[] }` |
| **Marching Band** | `{ caption: "music_ge"|"visual_ge"|"music_individual"|"music_ensemble"|"visual_individual"|"visual_ensemble"|"music_brass"|"music_percussion"|"visual_color_guard", segment: "opener"|"ballad"|"closer"|"production", class: "A"|"AA"|"AAA"|"AAAA", hit: bool, scoreSheetRows?: BOAScoreSheetRow[] }` |
| **Color Guard / Winter Guard** | `{ equipment: "flag"|"rifle"|"sabre"|"dance", caption: "equipment"|"movement"|"design"|"ge", class: "RA"|"A"|"Open"|"World", division: "Scholastic"|"Independent", scoreSheetRows?: WGIScoreSheetRow[] }` |
| **Indoor Percussion / Winds (WGI)** | `{ section: "battery"|"front_ensemble"|"winds", caption: "music_effect"|"music_ensemble"|"music_individual"|"visual_effect"|"visual_ensemble"|"visual_individual", class: "RA"|"A"|"Open"|"World", division: "Scholastic"|"Independent" }` |
| **Drum Corps (DCI)** | `{ section: "brass"|"percussion"|"front_ensemble"|"guard"|"drum_major", caption: "music_ge"|"visual_ge"|"music_brass"|"music_percussion"|"visual_proficiency"|"visual_analysis"|"visual_color_guard", class: "World"|"Open"|"All-Age", segment: "opener"|"ballad"|"closer"|"production" }` |
| Track & Field | `{ event: TFEvent, mark: string, wind?: number, heat?, place }` |
| Cross Country | `{ distance: "5K"|"6K"|"8K"|"10K", time: string, place, course?: string }` |
| Swim & Dive | `{ event: SwimEvent | DiveEvent, time?: string, score?: number, place }` |
| Tennis | `{ match: MatchContext, set: SetScore, point?: PointContext, result: "W"|"L"|"in-progress" }` |
| Golf | `{ hole: 1-18, par, strokes, putts, fairway?: bool, gir?: bool }` |
| Wrestling | `{ weight: number, opponent?: AthleteId, period: 1-3|"OT", result: "Pin"|"TF"|"MD"|"Dec"|"L", pinTime?: string }` |
| Water Polo | `{ quarter: 1-4|"OT", possession, shot?, save?, goal?: bool, exclusion?: bool }` |
| Rowing | `{ boat: "1V8"|"2V8"|"3V8"|"1V4"|"2V4"|..., seat?, ergTest?: ErgData, raceTime?: string, place }` |

### `ScoreToken.<sport>.payload`

| Sport | Scoring Model |
|---|---|
| Baseball/Softball | Box-score row (R/H/E + per-batter line: AB·R·H·RBI·BB·K·LOB) |
| Basketball | Box-score (PTS/REB/AST/STL/BLK/MIN/FG/3P/FT) |
| Football | Stat line by position (passing/rushing/receiving/defensive/special teams) |
| Soccer | Match stat line (shots, SOG, possession, passes, key passes) |
| Gymnastics W/M | 10.0 system per apparatus + AA total; OR D+E (Elite/FIG) |
| Gymnastics Rhythmic/Acro/T&T | D+E per apparatus + AA |
| **Cheer** | NCA Score Sheet rows OR UCA Game Day rows OR Varsity All-Star raw + deductions |
| **Marching Band (BOA)** | Music GE + Visual GE + Music Brass + Music Percussion + Visual Proficiency + Visual Color Guard, summed to 100-point total (e.g. Avon HS 97.825, Flower Mound 97.625) |
| **Color Guard / Winter Guard (WGI)** | Equipment + Movement + Design + General Effect sub-captions, summed to 100-point total per class |
| **Indoor Percussion / Winds (WGI)** | Music Effect + Music Ensemble + Music Individual + Visual Effect + Visual Ensemble + Visual Individual sub-captions → 100-point total |
| **Drum Corps (DCI)** | Music GE × 2 + Visual GE × 2 + Music Brass + Music Percussion + Visual Proficiency + Visual Analysis + Visual Color Guard, double-paneled, summed to 100-point total (e.g. Blue Devils, Bluecoats, Carolina Crown) |
| Track & Field | Time/distance/height + wind/place/personal best flag |
| Cross Country | Race time + place + team score contribution |
| Swim/Dive | Time + cut status (B/A/AA/AAA, Olympic Trials, US Open) OR dive degree-of-difficulty × judge avg |
| Tennis | Set scores + tiebreak + match W/L + UTR delta |
| Golf | Round score + to-par + position + putts/GIR/fairways |
| Wrestling | Match result + team points contribution + bonus pts |
| Hockey | Box (G/A/PTS/+/−/PIM/SOG/TOI/FO%) |
| Volleyball | Match stat line (K/A/D/B/SA/HE/HIT%) |
| Water Polo | Box (G/A/Steals/Exclusions/SV%) |
| Rowing | Race time + boat result + ergometer test result |
| Lacrosse | Match stat line (G/A/SH/GB/FO%/CT) |

### `MilestoneToken.<sport>.kinds`

| Sport | Milestone kinds |
|---|---|
| Baseball/Softball | `no_hitter`, `perfect_game`, `walkoff`, `cycle`, `home_run_record`, `commit`, `draft_pick`, `state_title` |
| Basketball M/W | `40_point_game`, `triple_double`, `1000_pt_club`, `state_title`, `commit`, `lottery_pick` |
| Football | `state_championship`, `combine_PR`, `commit`, `draft_pick`, `bowl_game`, `heisman_vote` |
| Soccer | `golden_boot`, `national_team_call`, `commit`, `pro_signing`, `state_cup` |
| **Gymnastics** | `perfect_10`, `career_high`, `stuck_landing`, `aa_champion`, `event_champion`, `team_total_record`, `state_qualifier`, `regional_qualifier`, `national_qualifier`, `olympic_trials`, `transfer_portal`, `commit`, `signing_day` |
| **Cheer** | `hit_zero`, `paid_bid`, `at_large_bid`, `summit_bid`, `worlds_bid`, `daytona_bound`, `banner_reveal`, `mat_call`, `nca_champion`, `uca_champion`, `senior_night`, `signing_day` |
| Track/XC | `PR`, `state_title`, `nationals_qualifier`, `olympic_trials`, `commit`, `school_record` |
| Swim/Dive | `cut_made`, `school_record`, `state_title`, `trials_cut`, `olympic_team`, `commit` |
| Tennis | `UTR_milestone` (e.g., UTR 12+), `ranking_jump`, `tournament_W`, `commit`, `pro_signing` |
| Golf | `tournament_W`, `hole_in_one`, `state_title`, `wagr_top100`, `commit`, `tour_card` |
| Wrestling | `state_place`, `state_title`, `pin_record`, `nationals_qualifier`, `commit`, `ncaa_aa` |
| Hockey | `hat_trick`, `shutout`, `draft_pick`, `commit`, `usntdp_select` |
| Volleyball | `match_high`, `state_title`, `aau_nationals`, `commit`, `usav_call` |
| Water Polo | `match_high`, `odp_select`, `commit` |
| Rowing | `erg_PR`, `regatta_W`, `national_team`, `commit` |
| Lacrosse | `inside_lax_top100`, `state_title`, `commit`, `pll_draft` |
| **Marching Band** | `boa_grand_finalist`, `state_champion`, `class_champion`, `super_regional_finalist`, `outstanding_music_performance`, `outstanding_visual_performance`, `outstanding_general_effect`, `rose_parade_invite`, `macys_parade_invite`, `section_leader_commit`, `drum_major_commit`, `collegiate_band_commit` |
| **Color Guard / Winter Guard** | `wgi_world_finalist`, `wgi_class_finalist`, `wgi_world_champion`, `power_regional_champion`, `state_champion`, `equipment_promotion`, `captain_appointed`, `independent_world_audition` |
| **Indoor Percussion / Winds** | `wgi_world_finalist`, `wgi_class_finalist`, `wgi_world_champion`, `power_regional_champion`, `audition_pass`, `section_leader_appointed` |
| **Drum Corps (DCI)** | `dci_world_finalist`, `dci_top_12`, `dci_world_champion`, `caption_award_best_brass`, `caption_award_best_percussion`, `caption_award_best_visual`, `caption_award_best_color_guard`, `caption_award_best_ge`, `corps_audition_pass`, `corps_contract_signed`, `age_out` |

### `BidToken.<sport>.kinds`

| Sport | Bid/Offer kinds |
|---|---|
| **Cheer** | `paid_bid_summit`, `paid_bid_worlds`, `at_large_bid_summit`, `at_large_bid_worlds`, `partial_bid`, `wildcard_bid` |
| **Gymnastics** | `ncaa_commit_offer`, `walkon_offer`, `transfer_portal_entry`, `transfer_portal_offer`, `elite_qualifier`, `olympic_invite` |
| Football | `ncaa_offer`, `walkon_offer`, `combine_invite`, `bowl_invite`, `transfer_portal` |
| Basketball M/W | `ncaa_offer`, `transfer_portal_offer`, `combine_invite`, `g_league_invite`, `wnba_combine_invite` |
| Baseball | `ncaa_offer`, `draft_interest`, `showcase_invite`, `usa_baseball_invite` |
| Soccer | `ncaa_offer`, `ecnl_id_camp_invite`, `mls_next_call`, `national_team_call` |
| Lacrosse | `ncaa_offer`, `inside_lax_camp_invite` |
| Hockey | `ncaa_offer`, `ushl_draft`, `nhl_draft`, `combine_invite` |
| Volleyball | `ncaa_offer`, `usa_volleyball_call` |
| Track/XC | `ncaa_offer`, `usatf_invite`, `foot_locker_qualifier` |
| Swim/Dive | `ncaa_offer`, `trials_qualifier`, `national_team_invite` |
| Tennis | `ncaa_offer`, `pro_circuit_invite`, `national_team_call` |
| Golf | `ncaa_offer`, `monday_qualifier_spot`, `invitational_invite` |
| Wrestling | `ncaa_offer`, `usaw_camp_invite`, `world_team_trial` |
| Water Polo / Rowing | `ncaa_offer`, `odp_invite`, `national_team_call` |
| **Marching Band** | `collegiate_band_offer` (Big Ten / SEC / HBCU bands), `drum_major_appointment`, `section_leader_appointment`, `corps_audition_callback`, `rose_parade_selection`, `macys_parade_selection` |
| **Color Guard / Winter Guard** | `independent_world_audition_invite`, `scholastic_world_callback`, `captain_appointment`, `tech_position_offer` |
| **Indoor Percussion / Winds / Drum Corps** | `corps_callback`, `corps_contract_offer`, `independent_world_invite`, `staff_position_offer` (post-age-out) |

### `EventToken.<sport>.kinds`

(See Layer 6 table above — each row's "Standard Event Kinds" map directly to `EventToken.payload.kind` enum values.)

### `EquipmentToken.<sport>` — concentrated brand graphs

| Sport | Key Brand Categories | Anchor Brands |
|---|---|---|
| Baseball | Bats, gloves, cleats, helmets, batting gloves | Marucci, Easton, Rawlings, Wilson, Mizuno, Louisville Slugger, New Balance |
| Softball | Bats, gloves, cleats | Easton, Rawlings, Mizuno, DeMarini, Worth |
| Basketball | Sneakers, apparel, training | Nike, adidas, Jordan, Under Armour, Puma, Curry |
| Football | Cleats, helmets, gloves, pads | Nike, adidas, Under Armour, Riddell, Schutt, Cutters |
| Soccer | Boots, balls, kits | Nike, adidas, Puma, Mizuno, New Balance |
| **Gymnastics** | Leos, grips, beam shoes, wrist supports, chalk | **GK Elite, Snowflake Designs, Reisport, Bailie, Adidas, Capezio** |
| **Cheer** | Bows, uniforms, mat shoes, poms, warm-ups | **Rebel Athletic, Varsity, Nfinity, Cheerleader's Choice, Bow Pop** |
| Lacrosse | Sticks, gloves, helmets, cleats | STX, Brine, Warrior, Maverik, Nike |
| Hockey | Sticks, skates, gloves, helmets | Bauer, CCM, Warrior, True, Sherwood |
| Volleyball | Shoes, knee pads, kits | Mizuno, Nike, asics, Under Armour |
| Track/XC | Spikes, training shoes | Nike, adidas, Saucony, New Balance, Brooks, On |
| Swim/Dive | Suits, goggles, caps | Speedo, Arena, TYR, FINIS |
| Tennis | Racquets, strings, shoes | Wilson, Babolat, Head, Yonex, Nike, adidas |
| Golf | Clubs, balls, bags | Titleist, TaylorMade, Callaway, PING, Cobra |
| Wrestling | Singlets, shoes, headgear | Asics, Adidas, Nike, Cliff Keen, RUDIS |
| Water Polo | Caps, suits, balls | TYR, Speedo, Mikasa, Turbo |
| Rowing | Singlets, blades, ergs | Concept2, Croker, Empacher, JL Racing |
| **Marching Band** | Instruments, uniforms, gloves, shoes, reeds, mouthpieces, mallets | Yamaha, Bach, Selmer, Conn-Selmer, Pearl, Vic Firth, Innovative Percussion, Fred J. Miller, DeMoulin, Stanbury, Drillmasters |
| **Color Guard / Winter Guard** | Flags, rifles, sabres, gloves, body suits, shoes | Field & Floor FX, Digital Performance Gear, DSI, Director's Showcase, StylePlus, Studio T |
| **Indoor Percussion / Winds** | Sticks, mallets, drumheads, electronics, mics, speakers | Vic Firth, Innovative Percussion, Yamaha, Pearl, Adams, Roland, Shure, JBL |
| **Drum Corps** | Brass, percussion, front-ensemble keyboards, electronics, uniforms, shoes | Yamaha, King, Bach, Pearl, Adams, Marimba One, Roland, Drillmasters, Stanbury |

---

## Studio Suite Template Catalog (sport × template matrix)

This is what the Studio Suite ships in Build 27. Cell = ✅ means a sport-specialized template exists out of the gate; ◯ = generic template available; ✕ = N/A.

| Template | FB | BB M | BB W | BSB | SBL | SOC M | SOC W | LAX M | LAX W | HKY M | HKY W | VB W | VB M | GYM W | GYM M | CHEER | TF M | TF W | XC M | XC W | SWM M | SWM W | TEN M | TEN W | GLF M | GLF W | WRS M | WRS W | WP M | WP W | ROW W |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Lineup / Roster Card | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ✅ |
| Match Day / Mat Call | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ |
| Score Reveal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Final Score / Recap | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Milestone Card (PR/Perfect 10/Hit Zero) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Commit / Signing Day | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Senior Night / Spotlight | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bid Reveal | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✅ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ |
| Hit Zero | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✅ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ |
| Perfect 10 | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✅ | ✅ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ |
| Rotation Tracker (4-event) | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✅ | ✅ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ |
| Countdown Series (7-day) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| NIL Deal Announcement | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Transfer Portal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Game Day / Sideline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ◯ | ◯ | ✅ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ | ◯ |

Total sport-specialized template specs: **40 sports/disciplines × ~14 template families = 250+ ship-ready template variants in Build 27.**

---

## Marching Arts — Studio Suite template pack (Band / Color Guard / Winter Guard / Percussion / Drum Corps)

Dedicated template family because the marching arts have unique visual conventions and a calendar that's the **inverse** of most sports (fall = field, winter+spring = indoor). All templates are class-aware (BOA A/AA/AAA/AAAA, WGI RA/A/Open/World, DCI World/Open/All-Age).

| # | Template | When posted | Fields |
|---|---|---|---|
| MB-1 | **Show Reveal** | Pre-season, summer band camp | Show title, theme art, composer, drill designer, music arranger, costume designer, premier date |
| MB-2 | **Field Lineup** | Pre-performance | Section roster cards, drum major callout, soloists, instrumentation count |
| MB-3 | **Score Reveal (BOA / state)** | Post-performance, live | Class, raw score, captions (Music GE, Visual GE, Music Brass, Music Percussion, Visual Proficiency, Visual Color Guard), placement |
| MB-4 | **Caption Award Card** | Post-finals | Caption won (Outstanding Music / Visual / GE), event, judges' panel, score margin |
| MB-5 | **Grand Nationals Countdown** | Oct–Nov, daily | Lucas Oil Stadium hero, countdown number, class, ranking position |
| MB-6 | **Senior Spotlight (band)** | Pre-state / pre-BOA | Section, instrument, years marched, drum-major status, post-grad plans |
| MB-7 | **Section Leader Reveal** | Spring auditions | Section, leader name, returning member highlight |
| MB-8 | **Audition Day** | Spring | Audition window, callbacks, link to audition prep |
| MB-9 | **Drum Major Appointment** | Spring | New DM headshot + sash hand-off, outgoing DM tribute |
| CG-1 | **Equipment Skill Card (Guard)** | Pre-season + WGI cycle | Flag / rifle / sabre proficiency, signature toss, hero photo |
| CG-2 | **WGI World Class Reveal** | Pre-WGI championships (Dayton) | Class banner, dome backdrop, prelims schedule, ticket link |
| CG-3 | **Independent World Audition** | Late summer / early fall | Group name, audition city, callback flow |
| WP-1 | **Indoor Percussion Battery Lineup** | Pre-show | Snares / tenors / basses / cymbals / front ensemble cards |
| WP-2 | **WGI Caption Reveal** | Live | Caption sub-scores (Music Effect / Music Ensemble / Music Individual / Visual Effect / Visual Ensemble / Visual Individual) |
| DC-1 | **Drum Corps Tour Stop** | Summer tour | Corps logo, venue, host show, projected matchups, ticket link |
| DC-2 | **DCI Caption Award Card** | Indianapolis finals week | Best Brass / Best Percussion / Best Visual / Best Guard / Best GE, corps + score |
| DC-3 | **Corps Contract Signed** | Late fall / winter | Corps logo, member headshot, section, contract year |
| DC-4 | **Age-Out Tribute** | August (DCI finals) | Final-performance frame, years of service, hometown corps |
| MA-NIL | **Marching Arts NIL / Sponsor Card** | Any | Athlete (musician/guard performer) + brand, FTC badge, promo code field |
| MA-PARADE | **Parade Selection** | Rose Parade / Macy's announcements | Parade logo, host school, route map, broadcast info |

**Brand truth check:** the marching arts community spends north of **$1B/year** on instruments, uniforms, custom flags, drill design, and tour fees. AthlynXAI is the first sports-platform-grade product built for it.

---

---

## Implementation handoff (codebase locations)

| File | Purpose | Build 27 work |
|---|---|---|
| `shared/sports.ts` | Master sport list | **ADD** `cheer`, `gymnastics_rhythmic`, `gymnastics_acro`, `gymnastics_tt`, `marching_band`, `color_guard_fall`, `winter_guard`, `indoor_percussion`, `indoor_winds`, `drum_corps` rows + a new `"performing_arts"` group |
| `shared/tokens.ts` *(new)* | Token class union + payload types | **CREATE** — 18 token types from Tokenization Addendum |
| `shared/sport-payloads.ts` *(new)* | Sport-specific payload schemas | **CREATE** — RoutineToken/ScoreToken/MilestoneToken/BidToken/EventToken/EquipmentToken per sport (including all marching arts) |
| `client/src/components/studio/` *(new)* | Studio Suite templates | **CREATE** — `<LineupStudio sport=... />`, `<MatchDayStudio sport=... />`, `<FinalScoreStudio sport=... />`, `<MilestoneStudio sport=... />`, `<CommitStudio />`, `<NILDealStudio />`, `<CountdownStudio />`, `<BidRevealStudio />` (cheer), `<HitZeroStudio />` (cheer), `<Perfect10Studio />` (gym), `<RotationStudio />` (gym) |
| `server/services/tokenBus.ts` *(new)* | The token bus | **CREATE** — emit/route/persist tokens; BroadcastToken fan-out via Buffer/Zapier |
| `server/services/stripeMetering.ts` | Bill TraffickToken | **WIRE** — meter token emissions into Stripe usage-based pricing |
| `server/routes/studio.ts` *(new)* | Studio API | **CREATE** — POST `/api/studio/render` returning PNG/MP4 + emitting BroadcastToken |
| `client/src/pages/portal/SocialOS.tsx` | Accounts UI | **ADD** Studio tab beside Accounts/Content |

---

## Build order locked

1. **Today (May 16):** Land this matrix doc, expand `shared/sports.ts` with the 4 new sport entries, create `shared/tokens.ts` + `shared/sport-payloads.ts` scaffolds
2. **Phase 2.1-2.4:** Studio Suite scaffold — Lineup/MatchDay/FinalScore/Milestone using token-aware renderers
3. **Phase 2.5:** AI Caption Engine + One-Tap Publish (BroadcastToken fan-out)
4. **Phase 3:** Multi-sport template pack — fill in every ✅ cell in the matrix above
5. **Phase 4:** Team Shared Workspace — role-based access lights up The Stack (Layer 7) for team admins

---

*Iron Sharpens Iron — Proverbs 27:17.*

*Locked at 2:55 AM CDT, Saturday, May 16, 2026, by an operator who took the founder's "classify all sports... with Tokenization baked in" order and made it the codebase's marching order.*
