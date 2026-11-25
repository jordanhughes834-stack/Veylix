(function(){
"use strict";

/* ============================= CONSTANTS ============================= */
var STORE_KEY = "veylix:v1:state";
var WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var WEEKDAY_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var RATE_LABELS = {1:"Very easy", 2:"Easy", 3:"Just right", 4:"Hard", 5:"Maxed out"};
var RATE_SIZES = {1:14, 2:18, 3:22, 4:26, 5:30};
var FIRST_TIME_REPS = 8;
var REP_CAP = 12;
var REP_FLOOR = 6;

var COMPARE_OBJECTS = [
  {name:"newborn baby", kg:3.5, emoji:"👶"},
  {name:"house cat", kg:4.5, emoji:"🐈"},
  {name:"labrador retriever", kg:30, emoji:"🐕"},
  {name:"adult human", kg:75, emoji:"🧍"},
  {name:"giant panda", kg:100, emoji:"🐼"},
  {name:"silverback gorilla", kg:170, emoji:"🦍"},
  {name:"motorbike", kg:220, emoji:"🏍️"},
  {name:"grizzly bear", kg:360, emoji:"🐻"},
  {name:"grand piano", kg:450, emoji:"🎹"},
  {name:"polar bear", kg:475, emoji:"🐻‍❄️"},
  {name:"giraffe", kg:800, emoji:"🦒"},
  {name:"small car", kg:1200, emoji:"🚗"},
  {name:"walrus", kg:1200, emoji:"🦭"},
  {name:"hippopotamus", kg:1500, emoji:"🦛"},
  {name:"white rhino", kg:2300, emoji:"🦏"},
  {name:"pickup truck", kg:2500, emoji:"🛻"},
  {name:"adult elephant", kg:6000, emoji:"🐘"},
  {name:"T. rex", kg:8000, emoji:"🦖"},
  {name:"London double-decker bus", kg:12000, emoji:"🚌"},
  {name:"sperm whale", kg:41000, emoji:"🐋"},
  {name:"space shuttle", kg:78000, emoji:"🚀"},
  {name:"blue whale", kg:130000, emoji:"🐳"}
];
// fix accidental space in walrus emoji literal above
COMPARE_OBJECTS.forEach(function(o){ o.emoji = o.emoji.replace(/\s+/g,""); });

var SVG_TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
var SVG_UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
var SVG_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
var SVG_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
var SVG_CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

/* ============================= STARTER TEMPLATE ============================= */
// Broad exercise library across Chest/Back/Legs/Shoulders/Arms/Core. Exercises
// are no longer auto-assigned to a day - see draftExerciseIds() - this just
// seeds a large catalog to pick from, grouped by muscle group in the add-
// exercise picker. (Fixed a few pre-existing miscategorizations while here:
// V-Bar/Single-Arm Pushdown and Preacher Curl are triceps/biceps work, not
// Chest/Back; "DB Bench" under Shoulders was renamed to Arnold Press since
// it's a distinct shoulder press variant, not a chest movement.)
function starterTemplate(){
  var ex = [
    // ---- Chest ----
    {id:"bench-press",          name:"Barbell Bench Press",        category:"Chest",     increment:2.5},
    {id:"incline-barbell-press",name:"Incline Barbell Bench Press",category:"Chest",     increment:2.5},
    {id:"decline-barbell-press",name:"Decline Barbell Bench Press",category:"Chest",     increment:2.5},
    {id:"incline-db-press",     name:"Incline DB Press",           category:"Chest",     increment:2},
    {id:"flat-db-fly",          name:"Flat Dumbbell Fly",          category:"Chest",     increment:2},
    {id:"incline-db-fly",       name:"Incline Dumbbell Fly",       category:"Chest",     increment:2},
    {id:"pec-deck",             name:"Pec Deck / Mid Flys",        category:"Chest",     increment:5},
    {id:"chest-press-machine",  name:"Chest Press Machine",        category:"Chest",     increment:5},
    {id:"hl-cable-fly",         name:"High-to-Low Cable Fly",      category:"Chest",     increment:5},
    {id:"lh-cable-fly",         name:"Low-to-High Cable Fly",      category:"Chest",     increment:5},
    {id:"weighted-dips",        name:"Weighted Dips",              category:"Chest",     increment:2.5},
    {id:"push-ups",             name:"Push-Ups",                   category:"Chest",     increment:1.25},
    {id:"svend-press",          name:"Svend Press",                category:"Chest",     increment:1.25},

    // ---- Back ----
    {id:"deadlift",             name:"Deadlift",                   category:"Back",      increment:5},
    {id:"barbell-row",          name:"Barbell Row",                category:"Back",      increment:2.5},
    {id:"pendlay-row",          name:"Pendlay Row",                category:"Back",      increment:2.5},
    {id:"seated-row",           name:"Seated Row",                 category:"Back",      increment:5},
    {id:"single-arm-latpd",     name:"Single-Arm Lat Pulldown",    category:"Back",      increment:2.5},
    {id:"latpd-wide",           name:"Lat Pulldown (Wide Grip)",   category:"Back",      increment:2.5},
    {id:"latpd-close",          name:"Lat Pulldown (Close Grip)",  category:"Back",      increment:2.5},
    {id:"pullups",              name:"Pull-Ups",                   category:"Back",      increment:2.5},
    {id:"chinups",              name:"Chin-Ups",                   category:"Back",      increment:2.5},
    {id:"straight-arm-pulldown",name:"Straight-Arm Pulldown",      category:"Back",      increment:2.5},
    {id:"face-pull",            name:"Face Pull",                  category:"Back",      increment:2.5},
    {id:"row-machine",          name:"Row Machine",                category:"Back",      increment:5},
    {id:"rack-pulls",           name:"Rack Pulls",                 category:"Back",      increment:5},
    {id:"back-extension",       name:"Back Extension",             category:"Back",      increment:2.5},
    {id:"barbell-shrug",        name:"Barbell Shrug",              category:"Back",      increment:5},

    // ---- Legs ----
    {id:"back-squat",           name:"Barbell Back Squat",         category:"Legs",      increment:5},
    {id:"front-squat",          name:"Front Squat",                category:"Legs",      increment:5},
    {id:"romanian-deadlift",    name:"Romanian Deadlift",          category:"Legs",      increment:5},
    {id:"split-squats",         name:"Split Squats",               category:"Legs",      increment:2.5},
    {id:"bulgarian-split-squat",name:"Bulgarian Split Squat",      category:"Legs",      increment:2.5},
    {id:"walking-lunges",       name:"Walking Lunges",             category:"Legs",      increment:2.5},
    {id:"goblet-squat",         name:"Goblet Squat",               category:"Legs",      increment:2.5},
    {id:"leg-press",            name:"Leg Press",                  category:"Legs",      increment:10},
    {id:"hack-squat",           name:"Hack Squat",                 category:"Legs",      increment:5},
    {id:"hip-thrust",           name:"Hip Thrust",                 category:"Legs",      increment:5},
    {id:"step-ups",             name:"Step-Ups",                   category:"Legs",      increment:2.5},
    {id:"inner-thigh",          name:"Inner Thigh Machine",        category:"Legs",      increment:5},
    {id:"outer-thigh",          name:"Outer Thigh Machine",        category:"Legs",      increment:5},
    {id:"leg-extensions",       name:"Leg Extensions",             category:"Legs",      increment:5},
    {id:"hamstring-curls",      name:"Hamstring Curls (Lying)",    category:"Legs",      increment:5},
    {id:"seated-leg-curl",      name:"Hamstring Curls (Seated)",   category:"Legs",      increment:5},
    {id:"calf-raises",          name:"Calf Raises (Standing)",     category:"Legs",      increment:5},
    {id:"seated-calf-raises",   name:"Calf Raises (Seated)",       category:"Legs",      increment:5},

    // ---- Shoulders ----
    {id:"overhead-press",       name:"Overhead Press (Barbell)",   category:"Shoulders", increment:2.5},
    {id:"shoulder-press",       name:"Shoulder Press",             category:"Shoulders", increment:2},
    {id:"db-bench",             name:"Arnold Press",               category:"Shoulders", increment:2},
    {id:"machine-shoulder-press",name:"Machine Shoulder Press",    category:"Shoulders", increment:5},
    {id:"front-raise",          name:"Front Raise",                category:"Shoulders", increment:1.25},
    {id:"lateral-raise",        name:"Lateral Raise",              category:"Shoulders", increment:1.25},
    {id:"cable-lateral-raise",  name:"Cable Lateral Raise",        category:"Shoulders", increment:1.25},
    {id:"rear-delts",           name:"Rear Delts (DB Fly)",        category:"Shoulders", increment:1.25},
    {id:"reverse-pec-deck",     name:"Reverse Pec Deck",           category:"Shoulders", increment:2.5},
    {id:"upright-row",          name:"Upright Row",                category:"Shoulders", increment:2.5},
    {id:"db-shrug",             name:"Dumbbell Shrug",             category:"Shoulders", increment:2},

    // ---- Arms ----
    {id:"barbell-curl",         name:"Barbell Curl",               category:"Arms",      increment:1.25},
    {id:"ez-bar-curl",          name:"EZ-Bar Curl",                category:"Arms",      increment:1.25},
    {id:"db-bicep-curl",        name:"Dumbbell Bicep Curl",        category:"Arms",      increment:1.25},
    {id:"hammer-curl",          name:"Hammer Curl",                category:"Arms",      increment:1.25},
    {id:"incline-db-curl",      name:"Incline Dumbbell Curl",      category:"Arms",      increment:1.25},
    {id:"preacher-curl",        name:"Preacher Curl",              category:"Arms",      increment:1.25},
    {id:"concentration-curl",   name:"Concentration Curl",         category:"Arms",      increment:1.25},
    {id:"cable-curl",           name:"Cable Curl",                 category:"Arms",      increment:2.5},
    {id:"high-rep-curls",       name:"High Reps Low Weight Curls", category:"Arms",      increment:1.25},
    {id:"zottman-curls",        name:"Zottman Curls",              category:"Arms",      increment:1.25},
    {id:"twentyones",           name:"21's",                       category:"Arms",      increment:1.25},
    {id:"skull-crushers",       name:"Skull Crushers",             category:"Arms",      increment:1.25},
    {id:"overhead-db-extension",name:"Overhead Tricep Extension",  category:"Arms",      increment:1.25},
    {id:"curved-bar-pushdown",  name:"Curved-Bar Push Downs",      category:"Arms",      increment:2.5},
    {id:"vbar-pushdown",        name:"V-Bar Pushdown",             category:"Arms",      increment:2.5},
    {id:"vbar-overhead",        name:"V-Bar Overhead",             category:"Arms",      increment:2.5},
    {id:"single-arm-pushdown",  name:"Single-Arm Pushdown",        category:"Arms",      increment:2},
    {id:"rope-hammer-curls",    name:"Rope Hammer Curls",          category:"Arms",      increment:1.25},
    {id:"close-grip-bench",     name:"Close-Grip Bench Press",     category:"Arms",      increment:2.5},
    {id:"diamond-pushups",      name:"Diamond Push-Ups",           category:"Arms",      increment:1.25},

    // ---- Core ----
    {id:"hanging-leg-raise",    name:"Hanging Leg Raise",          category:"Core",      increment:1.25},
    {id:"cable-crunch",         name:"Cable Crunch",               category:"Core",      increment:5},
    {id:"russian-twist",        name:"Russian Twist",              category:"Core",      increment:1.25},
    {id:"ab-wheel-rollout",     name:"Ab Wheel Rollout",           category:"Core",      increment:1.25},
    {id:"weighted-situp",       name:"Weighted Sit-Up",            category:"Core",      increment:1.25},
    {id:"decline-situp",        name:"Decline Sit-Up",             category:"Core",      increment:1.25},
    {id:"flutter-kicks",        name:"Flutter Kicks",              category:"Core",      increment:1.25},
    {id:"cable-woodchopper",    name:"Cable Woodchopper",          category:"Core",      increment:2.5}
  ];
  var dayTypes = {
    "Chest":     ["bench-press","incline-barbell-press","incline-db-press","flat-db-fly","chest-press-machine","hl-cable-fly","weighted-dips"],
    "Back":      ["deadlift","barbell-row","pendlay-row","seated-row","latpd-wide","single-arm-latpd","face-pull"],
    "Legs":      ["back-squat","romanian-deadlift","leg-press","bulgarian-split-squat","leg-extensions","hamstring-curls","calf-raises"],
    "Shoulders": ["overhead-press","shoulder-press","lateral-raise","cable-lateral-raise","rear-delts","upright-row"],
    "Arms":      ["barbell-curl","hammer-curl","preacher-curl","skull-crushers","close-grip-bench","rope-hammer-curls","diamond-pushups"],
    "Core":      ["hanging-leg-raise","cable-crunch","russian-twist","weighted-situp"]
  };
  var weekdays = {0:"Rest",1:"Chest",2:"Back",3:"Legs",4:"Shoulders",5:"Arms",6:"Rest"};
  return {exercises: ex, dayTypes: dayTypes, weekdays: weekdays};
}
function seedState(){
  var t = starterTemplate();
  return {
    exercises: t.exercises,
    split: {weekdays: t.weekdays, dayTypes: t.dayTypes},
    sessions: [],
    draft: null
  };
}
function applyStarterTemplate(){
  var t = starterTemplate();
  state.exercises = JSON.parse(JSON.stringify(t.exercises));
  state.split = {weekdays: JSON.parse(JSON.stringify(t.weekdays)), dayTypes: JSON.parse(JSON.stringify(t.dayTypes))};
  state.draft = null;
  save();
}

/* ============================= STORAGE ============================= */
var state = null;

function load(){
  try{
    var raw = localStorage.getItem(STORE_KEY);
    if(raw){ state = JSON.parse(raw); }
    else { state = seedState(); save(); }
  }catch(e){ state = seedState(); }
  if(!state.draft) state.draft = null;
  if(!state._updatedAt) state._updatedAt = 0;
}
function save(){
  state._updatedAt = Date.now();
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  scheduleCloudPush();
}

/* ============================= CLOUD SYNC =============================
 * Whole-state, last-write-wins sync against Supabase. localStorage (above)
 * is always the fast, synchronous path - everything below is best-effort
 * and never blocks the UI. A missing/zero _updatedAt always loses a
 * comparison on purpose: it's what a freshly-reseeded local template looks
 * like after iOS evicts localStorage, and that must never overwrite real
 * cloud data.
 */
var SUPABASE_URL = "REPLACE_WITH_SUPABASE_PROJECT_URL";
var SUPABASE_ANON_KEY = "REPLACE_WITH_SUPABASE_ANON_KEY";
var SYNC_DEBOUNCE_MS = 800;

var sb = (/^https:\/\//.test(SUPABASE_URL) && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

var currentSession = null;
var syncTimer = null;

function setSyncStatus(mode){
  var el = document.getElementById("syncStatus");
  if(!el) return;
  el.className = "sync-status" + (mode==="syncing" ? " syncing" : mode==="offline" ? " offline" : "");
  el.textContent = mode==="syncing" ? "Syncing…" : mode==="offline" ? "Offline" : mode==="synced" ? "Synced" : "";
}

function scheduleCloudPush(){
  if(!sb || !currentSession) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(pushCloudState, SYNC_DEBOUNCE_MS);
}

function pushCloudState(){
  if(!sb || !currentSession) return;
  clearTimeout(syncTimer);
  setSyncStatus("syncing");
  sb.from("veylix_state").upsert({user_id: currentSession.user.id, data: state, updated_at: new Date().toISOString()})
    .then(function(res){ setSyncStatus(res.error ? "offline" : "synced"); })
    .catch(function(){ setSyncStatus("offline"); });
}

// Fired on pagehide / tab-hidden, where there's no time left for the normal
// debounced push to run - iOS can suspend the page within moments of this
// event. keepalive lets the request survive page teardown; the supabase-js
// client has no way to set that flag, so this talks to the REST API directly.
function flushCloudStateKeepalive(){
  if(!sb || !currentSession) return;
  try{
    fetch(SUPABASE_URL + "/rest/v1/veylix_state", {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + currentSession.access_token,
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify([{user_id: currentSession.user.id, data: state, updated_at: new Date().toISOString()}])
    });
  }catch(e){}
}

function pullCloudState(){
  if(!sb || !currentSession) return Promise.resolve();
  setSyncStatus("syncing");
  return sb.from("veylix_state").select("data").eq("user_id", currentSession.user.id).maybeSingle()
    .then(function(res){
      if(res.error){ setSyncStatus("offline"); return; }
      var cloud = res.data && res.data.data;
      if(!cloud){ pushCloudState(); return; }
      var cloudTs = cloud._updatedAt || 0;
      var localTs = state._updatedAt || 0;
      if(cloudTs > localTs){
        state = cloud;
        if(!state.draft) state.draft = null;
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
        renderAll();
      } else if(localTs > cloudTs){
        pushCloudState();
      }
      setSyncStatus("synced");
    }).catch(function(){ setSyncStatus("offline"); });
}

/* ============================= HELPERS ============================= */
function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4); }
function esc(s){
  return String(s==null?"":s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}
function todayISO(){
  var d = new Date();
  return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
}
function pad(n){ return n<10?"0"+n:""+n; }
function fmtDateLong(iso){
  var d = new Date(iso+"T00:00:00");
  return d.toLocaleDateString(undefined,{weekday:"long", month:"long", day:"numeric"});
}
function fmtDateShort(iso){
  var d = new Date(iso+"T00:00:00");
  return d.toLocaleDateString(undefined,{weekday:"short", month:"short", day:"numeric"});
}
function fmtNum(n){
  if(n==null || isNaN(n)) return "—";
  return (Math.round(n*100)/100).toString();
}
function fmtElapsed(ms){
  var totalSec = Math.max(0, Math.floor(ms/1000));
  var h = Math.floor(totalSec/3600);
  var m = Math.floor((totalSec%3600)/60);
  var s = totalSec%60;
  return (h>0 ? h+":"+pad(m) : m) + ":" + pad(s);
}
function updateElapsedDisplay(){
  var el = document.getElementById("finishBarTimer");
  if(!el) return;
  if(!state.draft || !state.draft.startedAt){ el.textContent = "0:00"; return; }
  el.textContent = fmtElapsed(Date.now() - state.draft.startedAt);
}
function exerciseById(id){
  for(var i=0;i<state.exercises.length;i++){ if(state.exercises[i].id===id) return state.exercises[i]; }
  return null;
}
function exerciseName(id){
  var e = exerciseById(id);
  return e ? e.name : "Removed exercise";
}
function dayTypeNames(){ return Object.keys(state.split.dayTypes); }
function scheduledDayType(iso){
  var d = new Date(iso+"T00:00:00");
  return state.split.weekdays[d.getDay()] || "Rest";
}
function toast(msg){
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._h);
  toast._h = setTimeout(function(){ t.classList.remove("show"); }, 1800);
}

/* ============================= DRAFT ============================= */
function ensureDraft(){
  var iso = todayISO();
  if(!state.draft || state.draft.date !== iso){
    state.draft = { date: iso, dayType: scheduledDayType(iso), entries: {}, extras: [], startedAt: null };
    save();
  }
  if(state.draft.startedAt === undefined) state.draft.startedAt = null;
  return state.draft;
}
// Exercises are added freely via the picker (see exerciseOptionsByCategory) -
// today's scheduled day type is just a label, it doesn't restrict or
// auto-populate which exercises show. Also includes anything with logged
// entries even if it somehow isn't in extras, so an in-progress session
// never silently drops a card with sets already on it.
function draftExerciseIds(){
  var d = ensureDraft();
  var seen = {};
  var list = [];
  d.extras.concat(Object.keys(d.entries)).forEach(function(id){
    if(!seen[id] && exerciseById(id)){ seen[id] = true; list.push(id); }
  });
  return list;
}
function draftVolume(){
  return volumeOf(ensureDraft().entries);
}
function volumeOf(entries){
  var total = 0;
  Object.keys(entries).forEach(function(exId){
    entries[exId].forEach(function(s){ total += (s.weight||0) * (s.reps||0); });
  });
  return total;
}
/* ============================= PROGRESSION LOGIC ============================= */
function findLastEntry(exId){
  var best = null;
  state.sessions.forEach(function(sess){
    var sets = sess.entries[exId];
    if(sets && sets.length){
      if(!best || sess.date > best.date){
        best = {date: sess.date, set: sets[sets.length-1]};
      }
    }
  });
  return best;
}
function suggestNext(exId){
  var ex = exerciseById(exId);
  if(!ex) return {weight:null, reps:FIRST_TIME_REPS, note:"Exercise not found."};
  var last = findLastEntry(exId);
  if(!last){
    return {weight:null, reps:FIRST_TIME_REPS, note:"First time logging this — enter your starting weight."};
  }
  var w = last.set.weight, r = last.set.reps, diff = last.set.difficulty;
  var inc = ex.increment;
  if(diff === 1){
    return {weight: round(w + inc*2), reps: r, note:"Felt very easy last time — jumping up " + fmtNum(inc*2) + "kg."};
  }
  if(diff === 2){
    return {weight: round(w + inc), reps: r, note:"Felt easy last time — up " + fmtNum(inc) + "kg."};
  }
  if(diff === 3){
    if(r < REP_CAP){
      return {weight: w, reps: r+1, note:"Right at your limit — same weight, one more rep."};
    } else {
      return {weight: round(w + inc), reps: REP_FLOOR, note:"Reps capped at " + REP_CAP + " — stepping weight up, reps reset."};
    }
  }
  if(diff === 4){
    return {weight: w, reps: r, note:"Tough set — repeat this and consolidate."};
  }
  if(diff === 5){
    return {weight: round(Math.max(w - inc, 0)), reps: r, note:"Maxed out last time — easing back " + fmtNum(inc) + "kg."};
  }
  return {weight: w, reps: r, note:""};
}
function round(n){ return Math.round(n*100)/100; }

/* ============================= FUN COMPARISON ============================= */
function pickComparisons(totalKg){
  if(totalKg <= 0) return null;
  var scored = COMPARE_OBJECTS.map(function(o){
    return {o:o, dist: Math.abs(Math.log(totalKg / o.kg))};
  }).sort(function(a,b){ return a.dist - b.dist; });
  var primary = scored[0];
  var secondary = scored[1];
  return {
    primary: {obj: primary.o, ratio: totalKg / primary.o.kg},
    secondary: {obj: secondary.o, ratio: totalKg / secondary.o.kg}
  };
}
function article(name){
  return /^[aeiou]/i.test(name) ? "an" : "a";
}
function pictograph(ratio, emoji){
  var full = Math.floor(ratio);
  var frac = ratio - full;
  var out = "";
  var cap = Math.min(full, 12);
  for(var i=0;i<cap;i++) out += emoji;
  if(frac > 0.15 && cap < 12) out += '<span style="opacity:' + (0.35+frac*0.5) + '">' + emoji + '</span>';
  if(full > 12) out += " +" + (full-12);
  return out || emoji;
}

/* ============================= RENDER: HOME ============================= */
function renderHome(){
  var root = document.getElementById("view-home");
  var html = "";

  html += '<div class="card home-hero">'
    + '<img src="icon-192.png" alt="" class="home-hero-mark">'
    + '<div class="home-hero-title">VEYLIX</div>'
    + '<p class="home-hero-sub">Your personal training log. Log every set, rate how it felt, and let the app work out what to do next time.</p>'
    + '</div>';

  html += '<div class="manage-section">';
  html += '<div class="card home-card">'
    + '<div class="section-title">Today</div>'
    + '<p class="section-sub">Shows the exercises scheduled for today based on your weekly split. Log weight &times; reps per set, then rate how hard it felt from 1 (very easy) to 5 (maxed out). Each exercise shows a suggested weight/reps for next time, worked out from your last set and how hard it was.</p>'
    + '</div>';
  html += '<div class="card home-card">'
    + '<div class="section-title">History</div>'
    + '<p class="section-sub">Every past session, expandable to see each set. Pick an exercise at the top to see a trend chart of how the weight has moved over time.</p>'
    + '</div>';
  html += '<div class="card home-card">'
    + '<div class="section-title">Manage</div>'
    + '<p class="section-sub">Edit your weekly split, the exercises in each day type, and your exercise library. Also where you can export/import a backup of your data.</p>'
    + '</div>';
  html += '<div class="card home-card">'
    + '<div class="section-title">Finishing a workout</div>'
    + '<p class="section-sub">Tap "Finish workout" once you\'ve logged your sets for the day, and you\'ll get your total kg lifted plus a fun comparison - "that\'s like lifting 1.2&times; a silverback gorilla," that sort of thing.</p>'
    + '</div>';
  html += '<div class="card home-card">'
    + '<div class="section-title">Your data</div>'
    + '<p class="section-sub">Saved instantly on this device, and synced to the cloud in the background so it survives losing or resetting your phone.</p>'
    + '</div>';
  html += '</div>';

  root.innerHTML = html;
}

/* ============================= RENDER: TODAY ============================= */
function renderHeader(){
  document.getElementById("todayDate").textContent = fmtDateLong(todayISO());
  var d = ensureDraft();
  var pill = document.getElementById("todayPill");
  pill.textContent = d.dayType;
  pill.className = "pill" + (d.dayType==="Rest" ? " rest" : "");
}

function renderToday(){
  var d = ensureDraft();
  var root = document.getElementById("view-today");
  var html = "";

  html += '<div class="daytype-switch">';
  dayTypeNames().concat(["Rest"]).forEach(function(dt){
    html += '<button class="chip' + (dt===d.dayType?" active":"") + '" data-daytype="' + esc(dt) + '">' + esc(dt) + '</button>';
  });
  html += '</div>';

  if(!d.startedAt){
    html += '<div class="card rest-card">'
      + '<div class="big">Ready to train?</div>'
      + '<p>Start your workout to begin logging sets. You can log any mix of exercises - the day type above is just a label, not a restriction.</p>'
      + '<button class="btn btn-accent btn-block" id="startWorkoutBtn">Start Workout</button>'
      + '</div>';
  } else {
    var ids = draftExerciseIds();
    ids.forEach(function(exId){
      html += renderExerciseCard(exId, d);
    });
    html += '<div class="extra-row"><select id="extraExSelect"><option value="">+ Add an exercise…</option>'
      + exerciseOptionsByCategory(ids)
      + '</select></div>';
  }

  root.innerHTML = html;

  // finish bar
  var bar = document.getElementById("finishBar");
  if(d.startedAt){
    bar.style.display = "";
    document.getElementById("finishBarVol").textContent = fmtNum(draftVolume()) + " kg";
    updateElapsedDisplay();
  } else {
    bar.style.display = "none";
  }

  renderHeader();
}

// Builds <optgroup> options grouped by muscle group, excluding ids already
// in use - this is the free-mix exercise picker: pick any exercise from any
// category, not just whatever's scheduled for today.
function exerciseOptionsByCategory(excludeIds){
  var byCat = {};
  var order = [];
  state.exercises.forEach(function(e){
    if(excludeIds.indexOf(e.id)!==-1) return;
    var cat = e.category || "Other";
    if(!byCat[cat]){ byCat[cat] = []; order.push(cat); }
    byCat[cat].push(e);
  });
  return order.map(function(cat){
    return '<optgroup label="' + esc(cat) + '">'
      + byCat[cat].map(function(e){ return '<option value="' + esc(e.id) + '">' + esc(e.name) + '</option>'; }).join("")
      + '</optgroup>';
  }).join("");
}

function renderExerciseCard(exId, d){
  var ex = exerciseById(exId);
  if(!ex) return "";
  var sug = suggestNext(exId);
  var sets = d.entries[exId] || [];
  var html = '<div class="card ex-card" data-exid="' + esc(exId) + '">';
  html += '<div class="ex-card-head"><div><div class="ex-name">' + esc(ex.name) + '</div><div class="ex-cat">' + esc(ex.category||"") + '</div></div>';
  html += '<div class="ex-suggest"><span class="lbl">Suggested</span><span class="val">' + (sug.weight==null? "—" : fmtNum(sug.weight)+"kg") + ' × ' + sug.reps + '</span></div></div>';
  if(sug.note) html += '<p class="ex-note">' + esc(sug.note) + '</p>';

  if(sets.length){
    html += '<div class="set-rows">';
    sets.forEach(function(s, i){
      html += '<div class="set-row">'
        + '<span class="idx">' + (i+1) + '</span>'
        + '<span class="val">' + fmtNum(s.weight) + 'kg × ' + s.reps + '</span>'
        + '<span class="dot" style="background:var(--rate-' + s.difficulty + ')" title="' + RATE_LABELS[s.difficulty] + '"></span>'
        + '<button class="rm" data-rm-set="' + i + '" data-exid="' + esc(exId) + '">' + SVG_X + '</button>'
        + '</div>';
    });
    html += '</div>';
  }

  // Weight/reps inputs start blank each render (including right after adding a set) so
  // there's nothing to clear by hand — the suggestion is shown as a placeholder hint instead.
  var phW = sets.length ? fmtNum(sets[sets.length-1].weight) : (sug.weight==null? "" : fmtNum(sug.weight));
  var phR = sets.length ? sets[sets.length-1].reps : sug.reps;

  html += '<div class="set-input-row">'
    + '<div class="num-field"><label class="field">Kg<input type="number" step="0.5" inputmode="decimal" class="w-input" placeholder="' + esc(phW) + '"></label></div>'
    + '<div class="num-field"><label class="field">Reps<input type="number" step="1" inputmode="numeric" class="r-input" placeholder="' + esc(phR) + '"></label></div>'
    + '</div>';

  var selLvl = pendingDifficulty[exId];
  html += '<div class="rate-label"><span class="rate-title">How hard was it?</span><span class="rate-scale">1 very easy &middot; 5 maxed out</span></div>';
  html += '<div class="plate-picker" data-picker="' + esc(exId) + '">';
  for(var lvl=1; lvl<=5; lvl++){
    var sz = RATE_SIZES[lvl];
    html += '<button class="plate-btn' + (selLvl===lvl?" sel":"") + '" data-lvl="' + lvl + '" style="--r-color:var(--rate-' + lvl + ')" title="' + RATE_LABELS[lvl] + '">'
      + '<span class="ring" style="width:' + sz + 'px;height:' + sz + 'px;"></span>'
      + '<span class="n">' + lvl + '</span></button>';
  }
  html += '</div>';

  html += '<button class="btn btn-accent btn-block add-set-btn" data-exid="' + esc(exId) + '">Add set</button>';
  html += '</div>';
  return html;
}

var pendingDifficulty = {}; // exId -> selected level (per-card transient UI state)

function handleTodayClick(e){
  var chip = e.target.closest("[data-daytype]");
  if(chip){
    var d = ensureDraft();
    d.dayType = chip.getAttribute("data-daytype");
    save();
    renderToday();
    return;
  }
  var startBtn = e.target.closest("#startWorkoutBtn");
  if(startBtn){
    var dStart = ensureDraft();
    dStart.startedAt = Date.now();
    save();
    renderToday();
    return;
  }
  var plateBtn = e.target.closest(".plate-btn");
  if(plateBtn){
    var picker = plateBtn.closest(".plate-picker");
    var exId = picker.getAttribute("data-picker");
    var lvl = parseInt(plateBtn.getAttribute("data-lvl"),10);
    pendingDifficulty[exId] = lvl;
    picker.querySelectorAll(".plate-btn").forEach(function(b){ b.classList.remove("sel"); });
    plateBtn.classList.add("sel");
    return;
  }
  var addBtn = e.target.closest(".add-set-btn");
  if(addBtn){
    var exId2 = addBtn.getAttribute("data-exid");
    var card = addBtn.closest(".ex-card");
    var w = parseFloat(card.querySelector(".w-input").value);
    var r = parseInt(card.querySelector(".r-input").value,10);
    var lvl2 = pendingDifficulty[exId2];
    if(isNaN(w) || w < 0){ toast("Enter a weight first"); return; }
    if(isNaN(r) || r <= 0){ toast("Enter reps first"); return; }
    if(!lvl2){ toast("Rate the difficulty (tap a plate)"); return; }
    var d2 = ensureDraft();
    if(!d2.entries[exId2]) d2.entries[exId2] = [];
    d2.entries[exId2].push({weight:w, reps:r, difficulty:lvl2});
    delete pendingDifficulty[exId2];
    save();
    renderToday();
    return;
  }
  var rmBtn = e.target.closest("[data-rm-set]");
  if(rmBtn){
    var exId3 = rmBtn.getAttribute("data-exid");
    var idx = parseInt(rmBtn.getAttribute("data-rm-set"),10);
    var d3 = ensureDraft();
    d3.entries[exId3].splice(idx,1);
    if(d3.entries[exId3].length===0) delete d3.entries[exId3];
    save();
    renderToday();
    return;
  }
}
function handleTodayChange(e){
  if(e.target.id === "extraExSelect"){
    var val = e.target.value;
    if(val){
      var d = ensureDraft();
      if(d.extras.indexOf(val)===-1) d.extras.push(val);
      save();
      renderToday();
    }
  }
}

function finishWorkout(){
  var d = ensureDraft();
  var vol = draftVolume();
  if(vol <= 0){ toast("Log at least one set first"); return; }
  var sets = 0, reps = 0;
  var entries = {};
  Object.keys(d.entries).forEach(function(exId){
    if(d.entries[exId].length){
      entries[exId] = d.entries[exId];
      sets += d.entries[exId].length;
      d.entries[exId].forEach(function(s){ reps += s.reps; });
    }
  });
  var durationMs = d.startedAt ? Math.max(0, Date.now() - d.startedAt) : 0;
  var session = {
    id: uid(),
    date: d.date,
    dayType: d.dayType,
    entries: entries,
    volume: vol,
    durationMs: durationMs
  };
  state.sessions.push(session);
  state.draft = null;
  save();

  showFinishModal(session, sets, reps);
  renderToday();
  renderHistory();
}

function showFinishModal(session, sets, reps){
  var cmp = pickComparisons(session.volume);
  var body = document.getElementById("finishModalBody");
  var html = '<div class="finish-eyebrow">Workout complete</div>';
  html += '<div class="finish-kg">' + fmtNum(session.volume) + '<span>KG TOTAL</span></div>';
  if(cmp){
    html += '<div class="finish-pictograph">' + pictograph(cmp.primary.ratio, cmp.primary.obj.emoji) + '</div>';
    html += '<div class="finish-compare">That’s like lifting ' + fmtNum(cmp.primary.ratio) + '× ' + article(cmp.primary.obj.name) + ' ' + esc(cmp.primary.obj.name) + '</div>';
    html += '<div class="finish-compare-sub">…or ' + fmtNum(cmp.secondary.ratio) + '× ' + article(cmp.secondary.obj.name) + ' ' + esc(cmp.secondary.obj.name) + ' ' + cmp.secondary.obj.emoji + '</div>';
  }
  html += '<div class="finish-stats">'
    + '<div class="finish-stat"><b>' + Object.keys(session.entries).length + '</b><span>Exercises</span></div>'
    + '<div class="finish-stat"><b>' + sets + '</b><span>Sets</span></div>'
    + '<div class="finish-stat"><b>' + reps + '</b><span>Reps</span></div>'
    + '<div class="finish-stat"><b>' + fmtElapsed(session.durationMs||0) + '</b><span>Time</span></div>'
    + '</div>';
  html += '<button class="btn btn-accent btn-block" id="closeFinishBtn">Done</button>';
  body.innerHTML = html;
  document.getElementById("finishModal").classList.remove("hidden");
  document.getElementById("closeFinishBtn").onclick = function(){
    document.getElementById("finishModal").classList.add("hidden");
  };
}

/* ============================= RENDER: HISTORY ============================= */
var openSessions = {};
var progressExId = null;

function renderHistory(){
  var root = document.getElementById("view-history");
  var html = "";

  html += '<div class="card chart-wrap">';
  html += '<div class="progress-picker"><select id="progressSelect">';
  if(!progressExId && state.exercises.length) progressExId = state.exercises[0].id;
  state.exercises.forEach(function(e){
    html += '<option value="' + esc(e.id) + '"' + (e.id===progressExId?" selected":"") + '>' + esc(e.name) + '</option>';
  });
  html += '</select></div>';
  html += '<div id="chartHost">' + renderChart(progressExId) + '</div>';
  html += '</div>';

  var sessions = state.sessions.slice().sort(function(a,b){ return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });
  if(!sessions.length){
    html += '<div class="empty-state">No workouts logged yet. Head to the Today tab to log your first session.</div>';
  } else {
    sessions.forEach(function(sess){
      html += renderSessionCard(sess);
    });
  }

  root.innerHTML = html;
}

function renderChart(exId){
  var pts = [];
  state.sessions.slice().sort(function(a,b){ return a.date < b.date ? -1 : 1; }).forEach(function(sess){
    var sets = sess.entries[exId];
    if(sets && sets.length){
      var top = sets.reduce(function(m,s){ return s.weight > m ? s.weight : m; }, 0);
      pts.push({date: sess.date, w: top});
    }
  });
  if(pts.length < 2){
    return '<div class="chart-empty">Log this exercise a couple more times to see a trend line.</div>';
  }
  var W = 400, H = 120, PAD = 10, PADB = 20;
  var minW = Math.min.apply(null, pts.map(function(p){return p.w;}));
  var maxW = Math.max.apply(null, pts.map(function(p){return p.w;}));
  if(minW === maxW){ minW -= 5; maxW += 5; }
  var xStep = (W - PAD*2) / (pts.length-1);
  function X(i){ return PAD + i*xStep; }
  function Y(w){ return H - PADB - ((w-minW)/(maxW-minW)) * (H-PADB-PAD); }

  var linePts = pts.map(function(p,i){ return X(i)+","+Y(p.w); }).join(" ");
  var gridY = [];
  for(var g=0; g<=2; g++){
    var yy = PAD + g*((H-PADB-PAD)/2);
    gridY.push('<line x1="'+PAD+'" x2="'+(W-PAD)+'" y1="'+yy+'" y2="'+yy+'" stroke="var(--line)" stroke-width="1"/>');
  }
  var last = pts[pts.length-1];
  var svg = '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:120px;overflow:visible;" preserveAspectRatio="none">'
    + gridY.join("")
    + '<polyline points="' + linePts + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'
    + '<circle cx="' + X(pts.length-1) + '" cy="' + Y(last.w) + '" r="4.5" fill="var(--accent)"/>'
    + '<text x="' + X(pts.length-1) + '" y="' + (Y(last.w)-10) + '" text-anchor="end" font-family="GPT Mono, monospace" font-size="11" fill="var(--ink)" font-weight="700">' + fmtNum(last.w) + 'kg</text>'
    + '<text x="' + X(0) + '" y="' + (H-4) + '" font-family="GPT Body, sans-serif" font-size="9" fill="var(--ink-faint)">' + fmtDateShort(pts[0].date) + '</text>'
    + '<text x="' + X(pts.length-1) + '" y="' + (H-4) + '" text-anchor="end" font-family="GPT Body, sans-serif" font-size="9" fill="var(--ink-faint)">' + fmtDateShort(pts[pts.length-1].date) + '</text>'
    + '</svg>';
  return svg;
}

function renderSessionCard(sess){
  var open = !!openSessions[sess.id];
  var exCount = Object.keys(sess.entries).length;
  var html = '<div class="card session-card">';
  html += '<div class="session-head" data-toggle="' + sess.id + '">'
    + '<div><div class="session-date">' + fmtDateShort(sess.date) + '</div><div class="session-sub">' + esc(sess.dayType) + ' · ' + exCount + ' exercises' + (sess.durationMs ? ' · ' + fmtElapsed(sess.durationMs) : '') + '</div></div>'
    + '<div class="session-vol">' + fmtNum(sess.volume) + ' kg</div>'
    + '</div>';
  html += '<div class="session-body' + (open?" open":"") + '" data-body="' + sess.id + '">';
  Object.keys(sess.entries).forEach(function(exId){
    html += '<div class="session-ex"><div class="session-ex-name">' + esc(exerciseName(exId)) + '</div>';
    sess.entries[exId].forEach(function(s, i){
      html += '<div class="session-set-line"><span class="dot" style="background:var(--rate-' + s.difficulty + ')"></span>' + fmtNum(s.weight) + 'kg × ' + s.reps
        + '<button class="rm" data-rm-session-set="' + i + '" data-session="' + sess.id + '" data-exid="' + esc(exId) + '" title="Remove this set">' + SVG_X + '</button></div>';
    });
    html += '</div>';
  });
  html += '<button class="btn btn-danger btn-sm session-del" data-del-session="' + sess.id + '">Delete session</button>';
  html += '</div></div>';
  return html;
}

function handleHistoryClick(e){
  var head = e.target.closest("[data-toggle]");
  if(head){
    var id = head.getAttribute("data-toggle");
    openSessions[id] = !openSessions[id];
    renderHistory();
    return;
  }
  var del = e.target.closest("[data-del-session]");
  if(del){
    var sid = del.getAttribute("data-del-session");
    showConfirm("Delete this workout session? This can’t be undone.", {danger:true, confirmLabel:"Delete session"}, function(){
      state.sessions = state.sessions.filter(function(s){ return s.id !== sid; });
      save();
      renderHistory();
      toast("Session deleted");
    });
    return;
  }
  var rmSet = e.target.closest("[data-rm-session-set]");
  if(rmSet){
    var sessId = rmSet.getAttribute("data-session");
    var exId = rmSet.getAttribute("data-exid");
    var idx = parseInt(rmSet.getAttribute("data-rm-session-set"),10);
    var sess = null;
    for(var i=0;i<state.sessions.length;i++){ if(state.sessions[i].id===sessId){ sess = state.sessions[i]; break; } }
    if(!sess || !sess.entries[exId]) return;
    sess.entries[exId].splice(idx,1);
    if(sess.entries[exId].length===0) delete sess.entries[exId];
    if(Object.keys(sess.entries).length===0){
      state.sessions = state.sessions.filter(function(s){ return s.id !== sessId; });
      delete openSessions[sessId];
      toast("Set removed — that was the last one, so the session was removed too");
    } else {
      sess.volume = volumeOf(sess.entries);
      toast("Set removed");
    }
    save();
    renderHistory();
    return;
  }
}
function handleHistoryChange(e){
  if(e.target.id === "progressSelect"){
    progressExId = e.target.value;
    document.getElementById("chartHost").innerHTML = renderChart(progressExId);
  }
}

/* ============================= RENDER: MANAGE ============================= */
function renderManage(){
  var root = document.getElementById("view-manage");
  var html = "";

  // Starter template
  html += '<div class="manage-section">';
  html += '<div class="section-title">Starter template</div><div class="section-sub">Replaces your exercise library and weekly split below with the Chest / Back / Legs / Shoulders / Arms template. Logged workout history is never touched.</div>';
  html += '<button class="btn btn-line btn-block" id="loadStarterBtn">Load Chest / Back / Legs / Shoulders / Arms split</button>';
  html += '</div>';

  // Weekly split
  html += '<div class="card manage-section" style="padding:14px;">';
  html += '<div class="section-title">Weekly split</div><div class="section-sub">Which day type is scheduled for each weekday.</div>';
  for(var i=0;i<7;i++){
    html += '<div class="weekday-row"><div class="weekday-lbl">' + WEEKDAY_FULL[i].slice(0,3) + '</div>'
      + '<select data-weekday="' + i + '">';
    dayTypeNames().concat(["Rest"]).forEach(function(dt){
      html += '<option value="' + esc(dt) + '"' + (state.split.weekdays[i]===dt?" selected":"") + '>' + esc(dt) + '</option>';
    });
    html += '</select></div>';
  }
  html += '</div>';

  // Day types
  html += '<div class="manage-section">';
  html += '<div class="section-title">Day types<button class="btn btn-ghost btn-sm" id="addDayTypeBtn">+ New</button></div>';
  dayTypeNames().forEach(function(dt){
    html += renderDayTypeCard(dt);
  });
  html += '</div>';

  // Exercise library
  html += '<div class="manage-section">';
  html += '<div class="section-title">Exercise library<button class="btn btn-ghost btn-sm" id="addExerciseBtn">+ New</button></div>';
  html += '<div class="card" style="padding:4px 14px;">';
  state.exercises.forEach(function(e){
    html += '<div class="exlib-row">'
      + '<div><div style="font-weight:700;font-size:.86rem;">' + esc(e.name) + '</div><div class="ex-cat">' + esc(e.category||"") + '</div></div>'
      + '<input type="number" step="0.25" data-inc-id="' + esc(e.id) + '" value="' + e.increment + '" title="Weight increment (kg)">'
      + '<span style="font-size:.7rem;color:var(--ink-faint);">kg step</span>'
      + '<button class="icon-btn" data-del-ex="' + esc(e.id) + '">' + SVG_TRASH + '</button>'
      + '</div>';
  });
  if(!state.exercises.length) html += '<div class="empty-state">No exercises yet.</div>';
  html += '</div></div>';

  // Backup
  html += '<div class="manage-section">';
  html += '<div class="section-title">Backup</div><div class="section-sub">Your data lives only on this device (in this browser). Export a backup regularly.</div>';
  html += '<div class="backup-row">'
    + '<button class="btn btn-accent" id="exportBtn" style="flex:1;">Export backup</button>'
    + '<label class="file-btn">Import backup<input type="file" id="importFile" accept="application/json"></label>'
    + '</div>';
  html += '</div>';

  root.innerHTML = html;
}

function renderDayTypeCard(dt){
  var ids = state.split.dayTypes[dt] || [];
  var html = '<div class="card daytype-card" data-daytype-card="' + esc(dt) + '">';
  html += '<div class="daytype-card-head">'
    + '<input type="text" data-rename-daytype="' + esc(dt) + '" value="' + esc(dt) + '">'
    + '<button class="icon-btn" data-del-daytype="' + esc(dt) + '">' + SVG_TRASH + '</button>'
    + '</div>';
  html += '<div class="daytype-ex-list">';
  ids.forEach(function(exId, i){
    html += '<div class="daytype-ex-item">'
      + '<span class="nm">' + esc(exerciseName(exId)) + '</span>'
      + '<div class="ord">'
      + '<button class="icon-btn" data-move-up="' + i + '" data-dt="' + esc(dt) + '"' + (i===0?" disabled":"") + '>' + SVG_UP + '</button>'
      + '<button class="icon-btn" data-move-down="' + i + '" data-dt="' + esc(dt) + '"' + (i===ids.length-1?" disabled":"") + '>' + SVG_DOWN + '</button>'
      + '</div>'
      + '<button class="icon-btn" data-remove-from-daytype="' + i + '" data-dt="' + esc(dt) + '">' + SVG_X + '</button>'
      + '</div>';
  });
  html += '</div>';
  html += '<select data-add-to-daytype="' + esc(dt) + '"><option value="">+ Add exercise to this day…</option>';
  state.exercises.filter(function(e){ return ids.indexOf(e.id)===-1; }).forEach(function(e){
    html += '<option value="' + esc(e.id) + '">' + esc(e.name) + '</option>';
  });
  html += '</select>';
  html += '</div>';
  return html;
}

function handleManageClick(e){
  var addDT = e.target.closest("#addDayTypeBtn");
  if(addDT){ openDayTypeForm(); return; }
  var addEx = e.target.closest("#addExerciseBtn");
  if(addEx){ openExerciseForm(); return; }
  var exportBtn = e.target.closest("#exportBtn");
  if(exportBtn){ exportBackup(); return; }
  var loadStarter = e.target.closest("#loadStarterBtn");
  if(loadStarter){
    showConfirm("Load the Chest / Back / Legs / Shoulders / Arms split? This replaces your current exercise library and weekly split. Your logged workout history is kept.", {confirmLabel:"Load split"}, function(){
      applyStarterTemplate();
      renderAll();
      toast("Split loaded");
    });
    return;
  }

  var delEx = e.target.closest("[data-del-ex]");
  if(delEx){
    var exId = delEx.getAttribute("data-del-ex");
    showConfirm("Delete " + exerciseName(exId) + "? It will be removed from your split, but past history stays.", {danger:true, confirmLabel:"Delete exercise"}, function(){
      state.exercises = state.exercises.filter(function(e){ return e.id !== exId; });
      Object.keys(state.split.dayTypes).forEach(function(dt){
        state.split.dayTypes[dt] = state.split.dayTypes[dt].filter(function(id){ return id !== exId; });
      });
      save(); renderManage();
    });
    return;
  }
  var delDT = e.target.closest("[data-del-daytype]");
  if(delDT){
    var dt = delDT.getAttribute("data-del-daytype");
    showConfirm("Delete day type “" + dt + "”? Weekdays using it will switch to Rest.", {danger:true, confirmLabel:"Delete day type"}, function(){
      delete state.split.dayTypes[dt];
      Object.keys(state.split.weekdays).forEach(function(k){
        if(state.split.weekdays[k]===dt) state.split.weekdays[k] = "Rest";
      });
      save(); renderManage();
    });
    return;
  }
  var moveUp = e.target.closest("[data-move-up]");
  if(moveUp && !moveUp.disabled){
    var dt2 = moveUp.getAttribute("data-dt"); var i2 = parseInt(moveUp.getAttribute("data-move-up"),10);
    var arr = state.split.dayTypes[dt2];
    var tmp = arr[i2]; arr[i2] = arr[i2-1]; arr[i2-1] = tmp;
    save(); renderManage();
    return;
  }
  var moveDown = e.target.closest("[data-move-down]");
  if(moveDown && !moveDown.disabled){
    var dt3 = moveDown.getAttribute("data-dt"); var i3 = parseInt(moveDown.getAttribute("data-move-down"),10);
    var arr2 = state.split.dayTypes[dt3];
    var tmp2 = arr2[i3]; arr2[i3] = arr2[i3+1]; arr2[i3+1] = tmp2;
    save(); renderManage();
    return;
  }
  var rmFrom = e.target.closest("[data-remove-from-daytype]");
  if(rmFrom){
    var dt4 = rmFrom.getAttribute("data-dt"); var i4 = parseInt(rmFrom.getAttribute("data-remove-from-daytype"),10);
    state.split.dayTypes[dt4].splice(i4,1);
    save(); renderManage();
    return;
  }
}
function handleManageChange(e){
  var wd = e.target.closest("[data-weekday]");
  if(wd){
    state.split.weekdays[parseInt(wd.getAttribute("data-weekday"),10)] = wd.value;
    save();
    return;
  }
  var inc = e.target.closest("[data-inc-id]");
  if(inc){
    var ex = exerciseById(inc.getAttribute("data-inc-id"));
    var v = parseFloat(inc.value);
    if(ex && !isNaN(v) && v>0){ ex.increment = v; save(); }
    return;
  }
  var addToDT = e.target.closest("[data-add-to-daytype]");
  if(addToDT && addToDT.value){
    var dt = addToDT.getAttribute("data-add-to-daytype");
    state.split.dayTypes[dt].push(addToDT.value);
    save(); renderManage();
    return;
  }
  if(e.target.id === "importFile"){
    var file = e.target.files[0];
    if(file) importBackup(file);
  }
}
function handleManageBlur(e){
  var rn = e.target.closest("[data-rename-daytype]");
  if(rn){
    var oldName = rn.getAttribute("data-rename-daytype");
    var newName = rn.value.trim();
    if(newName && newName !== oldName){
      if(state.split.dayTypes[newName] || newName === "Rest"){ toast("A day type with that name already exists"); rn.value = oldName; return; }
      state.split.dayTypes[newName] = state.split.dayTypes[oldName];
      delete state.split.dayTypes[oldName];
      Object.keys(state.split.weekdays).forEach(function(k){
        if(state.split.weekdays[k]===oldName) state.split.weekdays[k] = newName;
      });
      if(state.draft && state.draft.dayType === oldName) state.draft.dayType = newName;
      save(); renderManage();
    } else if(!newName){
      rn.value = oldName;
    }
  }
}

/* ---- forms (add day type / add exercise) via generic modal ---- */
// Native confirm()/prompt() are unreliable (often a silent no-op) when this page
// is launched from the iOS Home Screen in standalone mode, since there's no browser
// chrome to host them. Use an in-app sheet instead for every confirmation.
function showConfirm(message, opts, onYes){
  if(typeof opts === "function"){ onYes = opts; opts = {}; }
  opts = opts || {};
  var html = '<div class="modal-head"><h2>' + esc(opts.title || "Please confirm") + '</h2><button class="icon-btn" id="cancelForm">' + SVG_X + '</button></div>'
    + '<div class="form-grid">'
    + '<p style="font-size:.88rem;color:var(--ink-dim);line-height:1.45;">' + esc(message) + '</p>'
    + '<button class="btn ' + (opts.danger ? "btn-danger" : "btn-accent") + ' btn-block" id="confirmYesBtn">' + esc(opts.confirmLabel || "Confirm") + '</button>'
    + '<button class="btn btn-ghost btn-block" id="confirmNoBtn">Cancel</button>'
    + '</div>';
  openFormModal(html);
  document.getElementById("cancelForm").onclick = closeFormModal;
  document.getElementById("confirmNoBtn").onclick = closeFormModal;
  document.getElementById("confirmYesBtn").onclick = function(){ closeFormModal(); onYes(); };
}
function openFormModal(html){
  document.getElementById("formModalBody").innerHTML = html;
  document.getElementById("formModal").classList.remove("hidden");
}
function closeFormModal(){
  document.getElementById("formModal").classList.add("hidden");
}
function openDayTypeForm(){
  var html = '<div class="modal-head"><h2>New day type</h2><button class="icon-btn" id="cancelForm">' + SVG_X + '</button></div>'
    + '<div class="form-grid">'
    + '<label class="field">Name<input type="text" id="newDayTypeName" placeholder="e.g. Upper Body"></label>'
    + '<button class="btn btn-accent btn-block" id="saveDayType">Create</button>'
    + '</div>';
  openFormModal(html);
  document.getElementById("cancelForm").onclick = closeFormModal;
  document.getElementById("saveDayType").onclick = function(){
    var name = document.getElementById("newDayTypeName").value.trim();
    if(!name){ toast("Enter a name"); return; }
    if(state.split.dayTypes[name] || name==="Rest"){ toast("That name is already used"); return; }
    state.split.dayTypes[name] = [];
    save(); closeFormModal(); renderManage();
  };
}
function openExerciseForm(){
  var html = '<div class="modal-head"><h2>New exercise</h2><button class="icon-btn" id="cancelForm">' + SVG_X + '</button></div>'
    + '<div class="form-grid">'
    + '<label class="field">Name<input type="text" id="newExName" placeholder="e.g. Cable Fly"></label>'
    + '<div class="form-row-2">'
    + '<label class="field">Category<input type="text" id="newExCat" placeholder="Push"></label>'
    + '<label class="field">Weight step (kg)<input type="number" id="newExInc" value="2.5" step="0.25"></label>'
    + '</div>'
    + '<button class="btn btn-accent btn-block" id="saveEx">Add exercise</button>'
    + '</div>';
  openFormModal(html);
  document.getElementById("cancelForm").onclick = closeFormModal;
  document.getElementById("saveEx").onclick = function(){
    var name = document.getElementById("newExName").value.trim();
    var cat = document.getElementById("newExCat").value.trim();
    var inc = parseFloat(document.getElementById("newExInc").value) || 2.5;
    if(!name){ toast("Enter a name"); return; }
    state.exercises.push({id: uid(), name: name, category: cat, increment: inc});
    save(); closeFormModal(); renderManage();
  };
}

/* ============================= BACKUP ============================= */
function exportBackup(){
  var data = JSON.stringify(state, null, 2);
  var filename = "veylix-backup-" + todayISO() + ".json";
  if(window.claude && window.claude.downloads){
    window.claude.downloads.save({filename: filename, data: data}).then(function(){
      toast("Backup saved");
    }).catch(function(){
      toast("Backup declined");
    });
  } else {
    var blob = new Blob([data], {type:"application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Backup downloaded");
  }
}
function importBackup(file){
  var reader = new FileReader();
  reader.onload = function(){
    try{
      var parsed = JSON.parse(reader.result);
      if(!parsed.exercises || !parsed.split || !parsed.sessions){ throw new Error("bad shape"); }
      showConfirm("Import this backup? It will replace all current data on this device.", {confirmLabel:"Import"}, function(){
        state = parsed;
        state.draft = null;
        save();
        renderAll();
        toast("Backup imported");
      });
    }catch(e){
      toast("That file doesn’t look like a Veylix backup");
    }
  };
  reader.readAsText(file);
}

/* ============================= TABS / INIT ============================= */
function setActiveTab(tab){
  document.querySelectorAll(".tab-btn").forEach(function(b){
    b.classList.toggle("active", b.getAttribute("data-tab")===tab);
  });
  document.querySelectorAll(".view").forEach(function(v){
    v.classList.toggle("active", v.id === "view-"+tab);
  });
  document.getElementById("finishBar").style.display = (tab==="today" && state.draft && state.draft.startedAt) ? "" : "none";
  window.scrollTo(0,0);
}

function renderAll(){
  renderHeader();
  renderHome();
  renderToday();
  renderHistory();
  renderManage();
}

/* ============================= AUTH GATE ============================= */
function showAuthGate(){
  document.getElementById("authGate").style.display = "";
  document.getElementById("mainApp").style.display = "none";
}
function showMainApp(){
  document.getElementById("authGate").style.display = "none";
  document.getElementById("mainApp").style.display = "";
}

function wireLoginForm(){
  document.getElementById("loginBtn").addEventListener("click", function(){
    var errEl = document.getElementById("loginError");
    errEl.textContent = "";
    if(!sb){ errEl.textContent = "Cloud sync isn't configured yet."; return; }
    var email = document.getElementById("loginEmail").value.trim();
    var pw = document.getElementById("loginPassword").value;
    if(!email || !pw){ errEl.textContent = "Enter your email and password."; return; }
    sb.auth.signInWithPassword({email:email, password:pw}).then(function(res){
      if(res.error){ errEl.textContent = res.error.message; return; }
      currentSession = res.data.session;
      showMainApp();
      startApp();
    });
  });
}

function startApp(){
  load();
  ensureDraft();
  renderAll();
  pullCloudState();
  setInterval(updateElapsedDisplay, 1000);

  document.querySelectorAll(".tab-btn").forEach(function(b){
    b.addEventListener("click", function(){ setActiveTab(b.getAttribute("data-tab")); });
  });
  document.getElementById("finishWorkoutBtn").addEventListener("click", finishWorkout);

  document.getElementById("view-today").addEventListener("click", handleTodayClick);
  document.getElementById("view-today").addEventListener("change", handleTodayChange);

  document.getElementById("view-history").addEventListener("click", handleHistoryClick);
  document.getElementById("view-history").addEventListener("change", handleHistoryChange);

  document.getElementById("view-manage").addEventListener("click", handleManageClick);
  document.getElementById("view-manage").addEventListener("change", handleManageChange);
  document.getElementById("view-manage").addEventListener("blur", handleManageBlur, true);

  document.getElementById("formModal").addEventListener("click", function(e){
    if(e.target.id === "formModal") closeFormModal();
  });
  document.getElementById("finishModal").addEventListener("click", function(e){
    if(e.target.id === "finishModal") e.currentTarget.classList.add("hidden");
  });

  // iOS suspends backgrounded PWA pages almost immediately, so `online`
  // listeners are unreliable - visibilitychange/pagehide/pageshow are the
  // signals that actually fire on resume and on teardown.
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "hidden"){ flushCloudStateKeepalive(); }
    else { pullCloudState(); }
  });
  window.addEventListener("pagehide", flushCloudStateKeepalive);
  window.addEventListener("pageshow", function(){ pullCloudState(); });
}

function init(){
  wireLoginForm();
  if(!sb){
    // No cloud configured yet - behave exactly like the fully-local app.
    showMainApp();
    startApp();
    return;
  }
  sb.auth.getSession().then(function(res){
    currentSession = res.data.session;
    sb.auth.onAuthStateChange(function(_event, session){ currentSession = session; });
    if(currentSession){ showMainApp(); startApp(); }
    else { showAuthGate(); }
  });
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

})();
