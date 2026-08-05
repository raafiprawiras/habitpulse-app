(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(o){if(o.ep)return;o.ep=!0;const a=i(o);fetch(o.href,a)}})();const f={ACTIVITIES:"habitpulse_activities",THEME:"habitpulse_theme",WEEKLY_GOALS:"habitpulse_weekly_goals",UNITS:"habitpulse_units",USER_SETTINGS:"habitpulse_user_settings"},W=[{id:"act_seed_1",type:"running",title:"Lari Pagi Keliling Komplek",date:new Date().toISOString().split("T")[0],duration:35,distance:5.2,intensity:"moderate",calories:340,notes:"Kondisi badan fit, pace stabil 6:43/km"},{id:"act_seed_2",type:"cycling",title:"Gowes Santai Sore Hari",date:new Date(Date.now()-864e5).toISOString().split("T")[0],duration:60,distance:18.5,intensity:"moderate",calories:450,notes:"Rute Jalur Kota & Taman"},{id:"act_seed_3",type:"workout",title:"Upper Body Strength Workout",date:new Date(Date.now()-1728e5).toISOString().split("T")[0],duration:45,distance:0,intensity:"intense",calories:280,notes:"Focus Push-up, Dumbbell Press & Core"},{id:"act_seed_4",type:"walking",title:"Jalan Santai Malam Hari",date:new Date(Date.now()-2592e5).toISOString().split("T")[0],duration:30,distance:2.8,intensity:"light",calories:130,notes:"Jalan santai setelah makan malam"}],L={targetActivities:5,targetMinutes:150,targetDistance:20},g={get(t,e=null){try{const i=localStorage.getItem(t);if(!i)return e;const s=JSON.parse(i);return s!==null?s:e}catch(i){return console.error(`[StorageEngine] Corrupted data for key "${t}", resetting:`,i),this.remove(t),e}},set(t,e){try{return localStorage.setItem(t,JSON.stringify(e)),!0}catch(i){return console.error(`[StorageEngine] Error saving key "${t}":`,i),!1}},remove(t){try{localStorage.removeItem(t)}catch{}},getActivities(){const t=this.get(f.ACTIVITIES,null);return!t||!Array.isArray(t)?(this.set(f.ACTIVITIES,W),W):t},saveActivities(t){return this.set(f.ACTIVITIES,t)},getWeeklyGoals(){const t=this.get(f.WEEKLY_GOALS,null);return t||(this.set(f.WEEKLY_GOALS,L),L)},saveWeeklyGoals(t){const e={targetActivities:Number(t.targetActivities)||L.targetActivities,targetMinutes:Number(t.targetMinutes)||L.targetMinutes,targetDistance:Number(t.targetDistance)||L.targetDistance};return this.set(f.WEEKLY_GOALS,e)},getUnits(){return this.get(f.UNITS,"km")},saveUnits(t){return this.set(f.UNITS,t==="miles"?"miles":"km")},getTheme(){return this.get(f.THEME,"system")},saveTheme(t){return this.set(f.THEME,t)},exportAllData(){return{appName:"HabitPulse",schemaVersion:"1.0",exportedAt:new Date().toISOString(),activities:this.getActivities(),weeklyGoals:this.getWeeklyGoals(),units:this.getUnits(),theme:this.getTheme()}},importData(t){if(!t||typeof t!="object")return{success:!1,error:"File format invalid."};if(!Array.isArray(t.activities))return{success:!1,error:"No activities data array found in JSON file."};try{return this.saveActivities(t.activities),t.weeklyGoals&&this.saveWeeklyGoals(t.weeklyGoals),t.units&&this.saveUnits(t.units),t.theme&&this.saveTheme(t.theme),{success:!0}}catch(e){return{success:!1,error:e.message||"Import failed."}}},clearAllData(){try{return localStorage.clear(),this.set(f.ACTIVITIES,[]),this.set(f.WEEKLY_GOALS,L),!0}catch{return!1}}},H={currentTheme:"system",init(){this.currentTheme=g.getTheme()||"system",this.applyTheme(this.currentTheme),this.listenToSystemChanges()},applyTheme(t){this.currentTheme=t,g.saveTheme(t);const e=document.documentElement;if(t==="system"){const i=window.matchMedia("(prefers-color-scheme: dark)").matches;e.setAttribute("data-theme",i?"dark":"light")}else e.setAttribute("data-theme",t);this.updateThemeToggleIcons()},toggleTheme(){const e=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";this.applyTheme(e)},listenToSystemChanges(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{this.currentTheme==="system"&&(document.documentElement.setAttribute("data-theme",t.matches?"dark":"light"),this.updateThemeToggleIcons())})},updateThemeToggleIcons(){const t=document.querySelectorAll(".theme-toggle-btn"),e=document.documentElement.getAttribute("data-theme");t.forEach(i=>{e==="dark"?(i.innerHTML=`
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        `,i.setAttribute("aria-label","Switch to Light Mode")):(i.innerHTML=`
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        `,i.setAttribute("aria-label","Switch to Dark Mode"))})}},n=(t,e=document)=>e.querySelector(t),k=(t,e=document)=>e.querySelectorAll(t);function F(t){if(!t)return"-";const e=new Date(t);if(isNaN(e.getTime()))return t;const i={weekday:"short",day:"numeric",month:"short",year:"numeric"};return e.toLocaleDateString("id-ID",i)}function E(t){const e=Number(t)||0;if(e<60)return`${e}m`;const i=Math.floor(e/60),s=e%60;return s>0?`${i}j ${s}m`:`${i}j`}function T(t,e="km"){const i=Number(t)||0;return e==="miles"?`${(i*.621371).toFixed(2)} mi`:`${i.toFixed(2)} km`}function O(t,e,i="km"){const s=Number(t)||0;let o=Number(e)||0;if(s<=0||o<=0)return"-";i==="miles"&&(o=o*.621371);const a=s/o,r=Math.floor(a),l=Math.round((a-r)*60),c=l<10?`0${l}`:`${l}`;return`${r}'${c}" ${i==="miles"?"/mi":"/km"}`}function K(t,e,i,s="moderate"){const o=Number(e)||0,a=Number(i)||0;if(o<=0)return 0;const r={running:10,cycling:8,walking:4.5,workout:6.5},l={light:.8,moderate:1,intense:1.25},c=r[t]||6,u=l[s]||1;let v=o/60*c*u*70;return a>0&&t!=="workout"&&(v+=a*12),Math.round(v)}function U(t){if(!t)return!1;const e=new Date(t);if(isNaN(e.getTime()))return!1;const i=new Date,s=i.getDay(),o=i.getDate()-s+(s===0?-6:1),a=new Date(i.setDate(o));a.setHours(0,0,0,0);const r=new Date(a);return r.setDate(a.getDate()+6),r.setHours(23,59,59,999),e>=a&&e<=r}function P(){return"act_"+Date.now().toString(36)+"_"+Math.random().toString(36).substring(2,7)}function D(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function z(){const t=new Date().getHours();return t>=5&&t<12?"Good Morning":t>=12&&t<18?"Good Afternoon":"Good Evening"}const b={activities:[],init(){return this.activities=g.getActivities(),this.activities},getAll(){return[...this.activities]},getFiltered(t="all"){return t==="all"?this.getAll():this.activities.filter(e=>e.type===t)},query({category:t="all",timeRange:e="all",sortBy:i="newest",searchQuery:s=""}={}){let o=[...this.activities];if(t&&t!=="all"&&(o=o.filter(a=>a.type===t)),e&&e!=="all"){const a=new Date;if(e==="this-week")o=o.filter(r=>U(r.date));else if(e==="this-month"){const r=a.getFullYear(),l=a.getMonth();o=o.filter(c=>{const u=new Date(c.date);return!isNaN(u.getTime())&&u.getFullYear()===r&&u.getMonth()===l})}}if(s&&s.trim()!==""){const a=s.trim().toLowerCase();o=o.filter(r=>{const l=r.title&&r.title.toLowerCase().includes(a),c=r.notes&&r.notes.toLowerCase().includes(a);return l||c})}return o.sort((a,r)=>i==="oldest"?new Date(a.date).getTime()-new Date(r.date).getTime():i==="longest-duration"?(Number(r.duration)||0)-(Number(a.duration)||0):i==="highest-distance"?(Number(r.distance)||0)-(Number(a.distance)||0):i==="most-calories"?(Number(r.calories)||0)-(Number(a.calories)||0):new Date(r.date).getTime()-new Date(a.date).getTime()),o},getById(t){return this.activities.find(e=>e.id===t)||null},add(t){const e={id:P(),type:t.type,title:t.title.trim(),date:t.date,duration:Number(t.duration)||0,distance:Number(t.distance)||0,intensity:t.intensity||"moderate",calories:Number(t.calories)||0,notes:(t.notes||"").trim(),createdAt:new Date().toISOString()};return this.activities.unshift(e),g.saveActivities(this.activities),e},update(t,e){const i=this.activities.findIndex(a=>a.id===t);if(i===-1)return null;const s=this.activities[i],o={...s,type:e.type||s.type,title:(e.title||s.title).trim(),date:e.date||s.date,duration:Number(e.duration)||s.duration,distance:Number(e.distance)||0,intensity:e.intensity||s.intensity||"moderate",calories:Number(e.calories)||0,notes:(e.notes!==void 0?e.notes:s.notes).trim(),updatedAt:new Date().toISOString()};return this.activities[i]=o,g.saveActivities(this.activities),o},delete(t){const e=this.activities.length;return this.activities=this.activities.filter(i=>i.id!==t),this.activities.length<e?(g.saveActivities(this.activities),!0):!1}},C={calculateOverview(t=[]){const e=g.getWeeklyGoals(),i={totalActivities:t.length,totalDistanceKm:0,totalDurationMins:0,totalCalories:0,avgDurationMins:0,mostActiveSport:"-",currentStreak:0,bestStreak:0,weekly:{activitiesCount:0,totalDistanceKm:0,totalDurationMins:0,totalCalories:0,targetActivities:e.targetActivities,targetMinutes:e.targetMinutes,targetDistance:e.targetDistance,activitiesPct:0,minutesPct:0,distancePct:0,goalPercentage:0},byType:{running:{count:0,distance:0,duration:0,calories:0,percentage:0},cycling:{count:0,distance:0,duration:0,calories:0,percentage:0},walking:{count:0,distance:0,duration:0,calories:0,percentage:0},workout:{count:0,distance:0,duration:0,calories:0,percentage:0}},achievements:[],motivationalMessage:""};if(t.length===0)return i.achievements=this.calculateAchievements(t,i),i.motivationalMessage="Start your first activity this week to build your health streak!",i;t.forEach(r=>{const l=Number(r.distance)||0,c=Number(r.duration)||0,u=Number(r.calories)||0;i.totalDistanceKm+=l,i.totalDurationMins+=c,i.totalCalories+=u,U(r.date)&&(i.weekly.activitiesCount+=1,i.weekly.totalDistanceKm+=l,i.weekly.totalDurationMins+=c,i.weekly.totalCalories+=u),i.byType[r.type]&&(i.byType[r.type].count+=1,i.byType[r.type].distance+=l,i.byType[r.type].duration+=c,i.byType[r.type].calories+=u)}),i.avgDurationMins=Math.round(i.totalDurationMins/t.length);let s=-1;const o={running:"Lari",cycling:"Bersepeda",walking:"Jalan Kaki",workout:"Workout"};Object.keys(i.byType).forEach(r=>{const l=i.byType[r].count;l>s&&l>0&&(s=l,i.mostActiveSport=o[r]||r)}),i.weekly.activitiesPct=Math.min(Math.round(i.weekly.activitiesCount/e.targetActivities*100),100),i.weekly.minutesPct=Math.min(Math.round(i.weekly.totalDurationMins/e.targetMinutes*100),100),i.weekly.distancePct=Math.min(Math.round(i.weekly.totalDistanceKm/e.targetDistance*100),100),i.weekly.goalPercentage=i.weekly.activitiesPct;const a=this.calculateStreak(t);return i.currentStreak=a.currentStreak,i.bestStreak=a.bestStreak,i.achievements=this.calculateAchievements(t,i),i.motivationalMessage=this.generateMotivationalMessage(i.weekly),i},calculateStreak(t=[]){if(t.length===0)return{currentStreak:0,bestStreak:0};const e=new Set;t.forEach(u=>{u.date&&e.add(u.date.split("T")[0])});const i=Array.from(e).sort((u,v)=>new Date(u)-new Date(v));if(i.length===0)return{currentStreak:0,bestStreak:0};let s=1,o=1;for(let u=1;u<i.length;u++){const v=new Date(i[u-1]),y=new Date(i[u]).getTime()-v.getTime(),w=Math.round(y/(1e3*3600*24));w===1?(o++,o>s&&(s=o)):w>1&&(o=1)}const a=new Date;a.setHours(0,0,0,0);const r=new Date(a);r.setDate(a.getDate()-1);const l=new Date(i[i.length-1]);l.setHours(0,0,0,0);let c=0;return(l.getTime()===a.getTime()||l.getTime()===r.getTime())&&(c=o),{currentStreak:c,bestStreak:Math.max(s,c)}},calculateAchievements(t=[],e={}){const i=t.length,s=e.totalDistanceKm||0,o=Math.max(e.currentStreak||0,e.bestStreak||0);return[{id:"ach_first_act",title:"First Activity",description:"Record your very first workout activity",icon:"🎯",unlocked:i>=1,progressText:i>=1?"Unlocked":"0/1 Activity"},{id:"ach_5_acts",title:"5 Activities",description:"Complete 5 fitness sessions",icon:"🏆",unlocked:i>=5,progressText:i>=5?"Unlocked":`${i}/5 Activities`},{id:"ach_10_acts",title:"10 Activities",description:"Reach 10 completed activities milestone",icon:"🥇",unlocked:i>=10,progressText:i>=10?"Unlocked":`${i}/10 Activities`},{id:"ach_first_10km",title:"First 10 KM",description:"Accumulate 10 km total distance",icon:"📍",unlocked:s>=10,progressText:s>=10?"Unlocked":`${s.toFixed(1)}/10 KM`},{id:"ach_7day_streak",title:"7 Day Streak",description:"Maintain a 7 consecutive days activity streak",icon:"🔥",unlocked:o>=7,progressText:o>=7?"Unlocked":`${o}/7 Days`}]},generateMotivationalMessage(t={}){const e=t.activitiesCount||0,i=t.targetActivities||5;if(e===0)return"Start your first activity this week to build your health streak!";if(e>=i)return"Weekly goal completed. Keep the momentum going!";{const s=i-e;return s===1?"Great progress! You're 1 activity away from your weekly goal.":`Great progress! You're ${s} activities away from your weekly goal.`}}},R={validateActivity(t){const e={},i=["running","cycling","walking","workout"];if((!t.type||!i.includes(t.type))&&(e.type="Pilih jenis aktivitas olahraga yang valid."),(!t.title||typeof t.title!="string"||t.title.trim().length<3)&&(e.title="Judul aktivitas minimal 3 karakter."),!t.date)e.date="Pilih tanggal aktivitas.";else{const a=new Date(t.date);isNaN(a.getTime())&&(e.date="Format tanggal tidak valid.")}const s=Number(t.duration);if(isNaN(s)||s<=0?e.duration="Durasi harus berupa angka positif (min 1 menit).":s>1440&&(e.duration="Durasi maksimal 1440 menit (24 jam)."),["running","cycling","walking"].includes(t.type)){const a=Number(t.distance);isNaN(a)||a<=0?e.distance="Jarak tempuh harus berupa angka positif (min 0.1 km).":a>1e3&&(e.distance="Jarak tempuh terlalu besar (maks 1000 km).")}const o=["light","moderate","intense"];if(t.intensity&&!o.includes(t.intensity)&&(e.intensity="Pilih tingkat intensitas yang valid."),t.calories!==void 0&&t.calories!==""){const a=Number(t.calories);(isNaN(a)||a<0)&&(e.calories="Kalori terbakar tidak boleh negatif.")}return{isValid:Object.keys(e).length===0,errors:e}}},d={running:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
      <path d="M6 13 10 3l4 2 4-2"/>
      <path d="m14 7-2 6-4 1"/>
      <path d="M14 13 18 20"/>
      <path d="M8 14 3 22"/>
    </svg>
  `,cycling:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5"/>
      <circle cx="18.5" cy="17.5" r="3.5"/>
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
      <path d="M12 17.5V14l-3-3 4-3 2 3h3"/>
      <path d="m5.5 17.5 4-7.5"/>
    </svg>
  `,walking:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
      <path d="m6 21 3-9 2 2 2 6"/>
      <path d="m11 14 2-3 3 2"/>
      <path d="m9 9 2 2"/>
    </svg>
  `,workout:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6.5 6.5 11 11"/>
      <path d="m21 21-1-1"/>
      <path d="m3 3 1 1"/>
      <path d="m18 22 4-4"/>
      <path d="m2 6 4-4"/>
      <path d="m3 10 7-7"/>
      <path d="m14 21 7-7"/>
    </svg>
  `,distance:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `,duration:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  `,calories:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5Z"/>
    </svg>
  `,trophy:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  `,plus:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>
  `,trash:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  `,calendar:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  `,note:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  `,check:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  `,close:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  `,sun:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  `,moon:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  `,pulse:(t="icon")=>`
    <svg class="${t}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  `},I={init(){this.render()},render(){const t=n("#analytics-section-content");if(!t)return;const e=b.getAll(),i=g.getUnits();if(e.length===0){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${d.pulse("icon-xl")}</div>
          <h3 class="empty-title">Insufficient Data for Analytics</h3>
          <p class="empty-desc">Record your first sport activity to unlock detailed health statistics, weekly comparisons, and activity streak analytics.</p>
          <button class="btn btn-primary btn-trigger-modal">
            ${d.plus("icon-sm")} Add Activity Now
          </button>
        </div>
      `;const r=t.querySelector(".btn-trigger-modal");r&&r.addEventListener("click",()=>{const l=n("#btn-add-activity");l&&l.click()});return}const s=C.calculateOverview(e),o=C.calculateWeeklyComparison(e),a=C.generateSmartInsights(e,s);t.innerHTML=`
      <!-- 8 Key Metrics Cards Grid -->
      <div class="stats-8-grid">
        <div class="stat-card">
          <div class="stat-icon-box">${d.trophy("icon-lg")}</div>
          <div class="stat-details">
            <div class="stat-value">${s.totalActivities}</div>
            <div class="stat-label">Total Activities</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${d.distance("icon-lg")}</div>
          <div class="stat-details">
            <div class="stat-value">${T(s.totalDistanceKm,i)}</div>
            <div class="stat-label">Total Distance</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${d.duration("icon-lg")}</div>
          <div class="stat-details">
            <div class="stat-value">${E(s.totalDurationMins)}</div>
            <div class="stat-label">Total Active Time</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${d.calories("icon-lg")}</div>
          <div class="stat-details">
            <div class="stat-value">${s.totalCalories.toLocaleString()} kcal</div>
            <div class="stat-label">Estimated Calories</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${d.duration("icon-lg")}</div>
          <div class="stat-details">
            <div class="stat-value">${s.avgDurationMins}m</div>
            <div class="stat-label">Average Duration</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-box">${d.pulse("icon-lg")}</div>
          <div class="stat-details">
            <div class="stat-value" style="font-size: 1.2rem; text-transform: capitalize;">${s.mostActiveSport}</div>
            <div class="stat-label">Most Active Sport</div>
          </div>
        </div>

        <div class="stat-card" style="border-left: 4px solid var(--primary);">
          <div class="stat-icon-box" style="background-color: rgba(22, 163, 74, 0.15); color: var(--primary);">⚡</div>
          <div class="stat-details">
            <div class="stat-value">${s.currentStreak} ${s.currentStreak===1?"Day":"Days"}</div>
            <div class="stat-label">Current Streak</div>
          </div>
        </div>

        <div class="stat-card" style="border-left: 4px solid var(--secondary);">
          <div class="stat-icon-box" style="background-color: rgba(34, 197, 94, 0.15); color: var(--secondary);">🔥</div>
          <div class="stat-details">
            <div class="stat-value">${s.bestStreak} ${s.bestStreak===1?"Day":"Days"}</div>
            <div class="stat-label">Best Streak</div>
          </div>
        </div>
      </div>

      <!-- Weekly Comparison Banner -->
      <div class="weekly-comparison-card">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">This Week vs Last Week Comparison</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Perbandingan aktivitas fisik Anda minggu ini dengan minggu lalu.</p>
          </div>
          <div style="display: flex; gap: 1.5rem;">
            <div class="comp-item">
              <strong style="display: block; font-size: 1.1rem; font-weight: 800;">${o.thisWeek.count} Sesi</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">This Week (${o.deltas.count>=0?"+":""}${o.deltas.count})</span>
            </div>

            <div class="comp-item">
              <strong style="display: block; font-size: 1.1rem; font-weight: 800;">${E(o.thisWeek.duration)}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Active Time</span>
            </div>

            <div class="comp-item">
              <strong style="display: block; font-size: 1.1rem; font-weight: 800;">${T(o.thisWeek.distance,i)}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Distance</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Charts Grid -->
      <div class="charts-grid" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Weekly Activity Bar Chart -->
        <div class="card">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Weekly Active Minutes</h3>
          ${this.renderWeeklyBarChartSVG(s.dailyMins)}
        </div>

        <!-- Activity Distribution -->
        <div class="card">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Category Distribution</h3>
          ${this.renderDistributionSVG(s.byType,e.length)}
        </div>
      </div>

      <!-- Automated Smart Insights Card -->
      ${a.length>0?`
        <div class="insights-card">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.25rem;">💡</span>
            <h3 style="font-size: 1rem; font-weight: 800; color: var(--text-primary);">Smart Habit Insights</h3>
          </div>
          <ul class="insights-list">
            ${a.map(r=>`<li>• ${r}</li>`).join("")}
          </ul>
        </div>
      `:""}
    `},renderWeeklyBarChartSVG(t){const e=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],i=Math.max(...t,60);return`
      <div class="chart-wrapper" style="width: 100%; height: 220px; display: flex; align-items: flex-end; justify-content: space-between; gap: 0.75rem; padding-top: 1.5rem; border-bottom: 1px solid var(--border-color);">
        ${t.map((s,o)=>{const a=Math.round(s/i*100);return`
            <div class="chart-bar-col" style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative;">
              <div class="chart-tooltip">${e[o]}: ${s} mins</div>
              <div class="chart-bar-fill" style="width: 100%; max-width: 32px; height: ${Math.max(a,4)}%; background: linear-gradient(180deg, var(--secondary) 0%, var(--primary) 100%); border-radius: var(--radius-sm); transition: height 0.6s ease;"></div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-top: 0.5rem;">${e[o]}</span>
            </div>
          `}).join("")}
      </div>
    `},renderDistributionSVG(t,e){if(e===0)return'<p style="font-size: 0.85rem; color: var(--text-secondary);">No activity data available.</p>';const i=[{key:"running",name:"Lari",color:"var(--activity-running)"},{key:"cycling",name:"Bersepeda",color:"var(--activity-cycling)"},{key:"walking",name:"Jalan Kaki",color:"var(--activity-walking)"},{key:"workout",name:"Workout",color:"var(--activity-workout)"}];return`
      <div style="display: flex; flex-direction: column; gap: 0.875rem;">
        <div style="width: 100%; height: 12px; border-radius: var(--radius-full); overflow: hidden; display: flex; background-color: var(--bg-subtle);">
          ${i.map(s=>{const o=t[s.key]?t[s.key].percentage:0;return o>0?`<div style="width: ${o}%; background-color: ${s.color}; height: 100%;" title="${s.name}: ${o}%"></div>`:""}).join("")}
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
          ${i.map(s=>{const o=t[s.key],a=o?o.count:0,r=o?o.percentage:0;return`
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${s.color}; display: inline-block;"></span>
                  <span style="color: var(--text-primary); font-weight: 600;">${s.name}</span>
                </div>
                <span style="color: var(--text-secondary); font-weight: 700;">${a} Sesi (${r}%)</span>
              </div>
            `}).join("")}
        </div>
      </div>
    `}},N={options:{category:"all",timeRange:"all",sortBy:"newest",searchQuery:""},init(){this.bindEvents(),this.render()},bindEvents(){const t=n("#history-search"),e=n("#history-filter-category"),i=n("#history-filter-timerange"),s=n("#history-filter-sort"),o=n("#btn-clear-history-filters"),a=n("#btn-close-detail-modal"),r=n("#modal-activity-detail");t&&t.addEventListener("input",c=>{this.options.searchQuery=c.target.value,this.render()}),e&&e.addEventListener("change",c=>{this.options.category=c.target.value,this.render()}),i&&i.addEventListener("change",c=>{this.options.timeRange=c.target.value,this.render()}),s&&s.addEventListener("change",c=>{this.options.sortBy=c.target.value,this.render()}),o&&o.addEventListener("click",()=>this.resetFilters()),a&&a.addEventListener("click",()=>this.closeDetailModal()),r&&r.addEventListener("click",c=>{c.target===r&&this.closeDetailModal()});const l=n("#history-list-container");l&&l.addEventListener("click",c=>{const u=c.target.closest(".btn-view-activity"),v=c.target.closest(".btn-edit-activity"),h=c.target.closest(".btn-delete-activity");if(u){const y=u.dataset.id;this.openDetailModal(y)}else if(v){const y=v.dataset.id;p.openEditActivityModal(y)}else if(h){const y=h.dataset.id;p.openDeleteModal(y)}})},resetFilters(){this.options={category:"all",timeRange:"all",sortBy:"newest",searchQuery:""};const t=n("#history-search"),e=n("#history-filter-category"),i=n("#history-filter-timerange"),s=n("#history-filter-sort");t&&(t.value=""),e&&(e.value="all"),i&&(i.value="all"),s&&(s.value="newest"),this.render()},openDetailModal(t){const e=b.getById(t);if(!e)return;const i=g.getUnits(),s=n("#modal-activity-detail"),o=n("#detail-icon"),a=n("#detail-title"),r=n("#detail-type-badge"),l=n("#detail-intensity-badge"),c=n("#detail-date"),u=n("#detail-duration"),v=n("#detail-distance"),h=n("#detail-calories"),y=n("#detail-pace"),w=n("#detail-notes"),S={running:d.running("icon-lg"),cycling:d.cycling("icon-lg"),walking:d.walking("icon-lg"),workout:d.workout("icon-lg")},A={running:"Lari",cycling:"Bersepeda",walking:"Jalan Kaki",workout:"Workout"};o&&(o.innerHTML=S[e.type]||d.pulse("icon-lg")),a&&(a.textContent=e.title),r&&(r.textContent=A[e.type]||e.type,r.className=`badge badge-${e.type}`),l&&(l.textContent=`Intensity: ${e.intensity||"moderate"}`),c&&(c.textContent=F(e.date)),u&&(u.textContent=E(e.duration)),v&&(v.textContent=e.distance>0?T(e.distance,i):"-"),h&&(h.textContent=e.calories>0?`${e.calories} kcal`:"-");const m=e.type==="running"||e.type==="walking"||e.type==="cycling"?O(e.duration,e.distance,i):"-";y&&(y.textContent=m),w&&(w.textContent=e.notes||"Tidak ada catatan tambahan."),s&&s.classList.add("active")},closeDetailModal(){const t=n("#modal-activity-detail");t&&t.classList.remove("active")},render(){const t=n("#history-list-container"),e=n("#history-result-counter");if(!t)return;const i=b.query(this.options),s=g.getUnits();if(e){const r=i.length;e.textContent=`${r} ${r===1?"Activity":"Activities"} Found`}if(i.length===0){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${d.pulse("icon-xl")}</div>
          <h3 class="empty-title">No matching activities found</h3>
          <p class="empty-desc">Try adjusting your search terms or filters to find what you're looking for.</p>
          <button id="btn-clear-history-filters" class="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      `;const r=n("#btn-clear-history-filters");r&&r.addEventListener("click",()=>this.resetFilters());return}const o={running:d.running("icon-lg"),cycling:d.cycling("icon-lg"),walking:d.walking("icon-lg"),workout:d.workout("icon-lg")},a={running:"Lari",cycling:"Bersepeda",walking:"Jalan Kaki",workout:"Workout"};t.innerHTML=i.map(r=>{const l=o[r.type]||d.pulse("icon-lg"),c=a[r.type]||r.type;return(r.type==="running"||r.type==="walking"||r.type==="cycling")&&O(r.duration,r.distance,s),`
        <article class="activity-card card-hover" data-id="${r.id}">
          <div class="activity-main-info">
            <div class="activity-avatar badge-${r.type}">
              ${l}
            </div>
            <div class="activity-title-block">
              <h3>${D(r.title)}</h3>
              <div class="activity-meta">
                <span class="badge badge-${r.type}">${c}</span>
                <span class="meta-item">${d.calendar("icon-sm")} ${F(r.date)}</span>
                ${r.intensity?`<span class="badge" style="background-color: var(--bg-subtle); color: var(--text-secondary); text-transform: capitalize;">${r.intensity}</span>`:""}
              </div>
            </div>
          </div>

          <div class="activity-stats-row">
            ${r.distance>0?`
              <div class="stat-item-inline">
                <strong>${T(r.distance,s)}</strong>
                <span>Jarak</span>
              </div>
            `:""}

            <div class="stat-item-inline">
              <strong>${E(r.duration)}</strong>
              <span>Durasi</span>
            </div>

            ${r.calories>0?`
              <div class="stat-item-inline">
                <strong>${r.calories} kcal</strong>
                <span>Kalori (Est.)</span>
              </div>
            `:""}

            <div class="activity-actions">
              <button class="btn-icon btn-view-activity" data-id="${r.id}" title="View Details" aria-label="View Details">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="btn-icon btn-edit-activity" data-id="${r.id}" title="Edit Aktivitas" aria-label="Edit Aktivitas">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="btn-icon btn-delete-activity" data-id="${r.id}" title="Hapus Aktivitas" aria-label="Hapus Aktivitas">
                ${d.trash("icon-sm")}
              </button>
            </div>
          </div>
        </article>
      `}).join("")}},B={init(){this.bindEvents(),this.render()},bindEvents(){const t=n("#btn-edit-goals"),e=n("#modal-goal-settings"),i=n("#btn-close-goal-modal"),s=n("#btn-cancel-goal-modal"),o=n("#form-weekly-goals");t&&t.addEventListener("click",()=>this.openGoalModal()),i&&i.addEventListener("click",()=>this.closeGoalModal()),s&&s.addEventListener("click",()=>this.closeGoalModal()),e&&e.addEventListener("click",a=>{a.target===e&&this.closeGoalModal()}),o&&o.addEventListener("submit",a=>{a.preventDefault(),this.handleGoalSubmit()})},openGoalModal(){const t=n("#modal-goal-settings"),e=g.getWeeklyGoals(),i=n("#goal-target-activities"),s=n("#goal-target-minutes"),o=n("#goal-target-distance");i&&(i.value=e.targetActivities),s&&(s.value=e.targetMinutes),o&&(o.value=e.targetDistance),t&&t.classList.add("active")},closeGoalModal(){const t=n("#modal-goal-settings");t&&t.classList.remove("active")},handleGoalSubmit(){const t=n("#goal-target-activities"),e=n("#goal-target-minutes"),i=n("#goal-target-distance"),s={targetActivities:Number(t.value)||5,targetMinutes:Number(e.value)||150,targetDistance:Number(i.value)||20};g.saveWeeklyGoals(s),this.closeGoalModal(),p.render(),this.render(),p.showToast("Weekly goals updated successfully","success")},render(){const t=b.getAll(),e=C.calculateOverview(t),i=n("#motivational-banner-container");i&&(i.innerHTML=`
        <div class="motivational-banner">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: rgba(22, 163, 74, 0.15); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              ⚡
            </div>
            <div>
              <strong style="display: block; font-size: 0.95rem; color: var(--text-primary); font-weight: 800;">${e.motivationalMessage}</strong>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Keep pushing your boundaries every single day.</span>
            </div>
          </div>
          <div class="streak-badge-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--secondary);"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5Z"/></svg>
            <span>${e.currentStreak} Day Streak</span>
          </div>
        </div>
      `);const s=n("#achievements-grid-container");s&&(s.innerHTML=e.achievements.map(o=>`
        <div class="achievement-card ${o.unlocked?"unlocked":"locked"}">
          <div class="achievement-icon-box">
            ${o.icon}
          </div>
          <div class="achievement-content">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary);">${o.title}</h4>
              <span class="achievement-badge ${o.unlocked?"unlocked":"locked"}">
                ${o.unlocked?"Unlocked":"Locked"}
              </span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">${o.description}</p>
            <div style="font-size: 0.72rem; font-weight: 700; color: var(--primary); margin-top: 0.5rem;">
              ${o.progressText}
            </div>
          </div>
        </div>
      `).join(""))}},p={currentFilter:"all",targetDeleteId:null,isUserCaloriesTouched:!1,init(){b.init(),this.bindEvents(),this.renderStaticIcons(),this.render()},renderStaticIcons(){const t=n("#icon-stat-distance"),e=n("#icon-stat-duration"),i=n("#icon-stat-calories"),s=n("#icon-stat-count"),o=n("#icon-hero-pulse"),a=n("#icon-btn-add"),r=n("#btn-close-modal");t&&(t.innerHTML=d.distance("icon-lg")),e&&(e.innerHTML=d.duration("icon-lg")),i&&(i.innerHTML=d.calories("icon-lg")),s&&(s.innerHTML=d.trophy("icon-lg")),o&&(o.innerHTML=d.pulse("icon-sm")),a&&(a.innerHTML=d.plus("icon-sm")),r&&(r.innerHTML=d.close("icon-md"));const l=n("#icon-breakdown-running"),c=n("#icon-breakdown-cycling"),u=n("#icon-breakdown-walking"),v=n("#icon-breakdown-workout");l&&(l.innerHTML=d.running("icon-md")),c&&(c.innerHTML=d.cycling("icon-md")),u&&(u.innerHTML=d.walking("icon-md")),v&&(v.innerHTML=d.workout("icon-md"))},bindEvents(){const t=k(".btn-trigger-modal"),e=n("#btn-close-modal"),i=n("#btn-cancel-modal"),s=n("#modal-activity"),o=n("#form-activity"),a=n("#activity-type"),r=n("#activity-duration"),l=n("#activity-distance"),c=n("#activity-intensity"),u=n("#activity-calories"),v=n("#modal-delete-confirm"),h=n("#btn-close-delete-modal"),y=n("#btn-cancel-delete"),w=n("#btn-confirm-delete");t.forEach(m=>{m.addEventListener("click",()=>this.openActivityModal())}),e&&e.addEventListener("click",()=>this.closeActivityModal()),i&&i.addEventListener("click",()=>this.closeActivityModal()),s&&s.addEventListener("click",m=>{m.target===s&&this.closeActivityModal()}),a&&a.addEventListener("change",m=>{const $=n("#group-distance");$&&(m.target.value==="workout"?($.style.display="none",l&&(l.value="0")):$.style.display="flex"),this.recalculateEstimatedCalories()}),r&&r.addEventListener("input",()=>this.recalculateEstimatedCalories()),l&&l.addEventListener("input",()=>this.recalculateEstimatedCalories()),c&&c.addEventListener("change",()=>this.recalculateEstimatedCalories()),u&&u.addEventListener("input",()=>{this.isUserCaloriesTouched=!0}),o&&o.addEventListener("submit",m=>{m.preventDefault(),this.handleFormSubmit()}),h&&h.addEventListener("click",()=>this.closeDeleteModal()),y&&y.addEventListener("click",()=>this.closeDeleteModal()),v&&v.addEventListener("click",m=>{m.target===v&&this.closeDeleteModal()}),w&&w.addEventListener("click",()=>this.executeDeleteActivity()),k(".filter-tab").forEach(m=>{m.addEventListener("click",$=>{const x=$.currentTarget.dataset.filter;this.setFilter(x)})});const A=n("#activities-container");A&&A.addEventListener("click",m=>{const $=m.target.closest(".btn-edit-activity"),x=m.target.closest(".btn-delete-activity");if($){const M=$.dataset.id;this.openEditActivityModal(M)}else if(x){const M=x.dataset.id;this.openDeleteModal(M)}})},recalculateEstimatedCalories(){if(this.isUserCaloriesTouched)return;const t=n("#activity-type")?n("#activity-type").value:"running",e=n("#activity-duration")?n("#activity-duration").value:0,i=n("#activity-distance")?n("#activity-distance").value:0,s=n("#activity-intensity")?n("#activity-intensity").value:"moderate",o=K(t,e,i,s),a=n("#activity-calories");a&&o>0&&(a.value=o.toString())},setFilter(t){this.currentFilter=t,k(".filter-tab").forEach(e=>{e.dataset.filter===t?e.classList.add("active"):e.classList.remove("active")}),this.renderActivityList()},openActivityModal(){const t=n("#modal-activity"),e=n("#form-activity"),i=n("#modal-title"),s=n("#btn-submit-form"),o=n("#activity-id");e&&e.reset(),o&&(o.value=""),i&&(i.textContent="Catat Aktivitas Baru"),s&&(s.textContent="Simpan Aktivitas"),this.isUserCaloriesTouched=!1;const a=n("#activity-date");a&&(a.value=new Date().toISOString().split("T")[0]);const r=n("#group-distance");r&&(r.style.display="flex"),this.clearFormErrors(),t&&t.classList.add("active")},openEditActivityModal(t){const e=b.getById(t);if(!e)return;const i=n("#modal-activity"),s=n("#modal-title"),o=n("#btn-submit-form");s&&(s.textContent="Edit Aktivitas"),o&&(o.textContent="Perbarui Aktivitas"),n("#activity-id").value=e.id,n("#activity-type").value=e.type,n("#activity-title").value=e.title,n("#activity-date").value=e.date,n("#activity-duration").value=e.duration,n("#activity-distance").value=e.distance||0,n("#activity-intensity").value=e.intensity||"moderate",n("#activity-calories").value=e.calories||0,n("#activity-notes").value=e.notes||"",this.isUserCaloriesTouched=!0;const a=n("#group-distance");a&&(a.style.display=e.type==="workout"?"none":"flex"),this.clearFormErrors(),i&&i.classList.add("active")},closeActivityModal(){const t=n("#modal-activity");t&&t.classList.remove("active"),this.clearFormErrors()},openDeleteModal(t){this.targetDeleteId=t;const e=n("#modal-delete-confirm");e&&e.classList.add("active")},closeDeleteModal(){this.targetDeleteId=null;const t=n("#modal-delete-confirm");t&&t.classList.remove("active")},executeDeleteActivity(){if(!this.targetDeleteId)return;const t=b.delete(this.targetDeleteId);this.closeDeleteModal(),t&&(this.render(),this.showToast("Activity deleted","error"))},clearFormErrors(){k(".form-group").forEach(t=>t.classList.remove("has-error"))},showFormErrors(t){this.clearFormErrors(),Object.keys(t).forEach(e=>{const i=n(`#group-${e}`),s=n(`#error-${e}`);i&&i.classList.add("has-error"),s&&(s.textContent=t[e])})},handleFormSubmit(){const t=n("#activity-id").value,e={type:n("#activity-type").value,title:n("#activity-title").value,date:n("#activity-date").value,duration:n("#activity-duration").value,distance:n("#activity-type").value==="workout"?0:n("#activity-distance").value,intensity:n("#activity-intensity").value,calories:n("#activity-calories").value,notes:n("#activity-notes").value},i=R.validateActivity(e);if(!i.isValid){this.showFormErrors(i.errors);return}t?(b.update(t,e),this.closeActivityModal(),this.render(),this.showToast("Activity updated","success")):(b.add(e),this.closeActivityModal(),this.render(),this.showToast("Activity added","success"))},render(){this.renderGreeting(),this.renderStats(),this.renderActivityList(),I&&typeof I.render=="function"&&I.render(),N&&typeof N.render=="function"&&N.render(),B&&typeof B.render=="function"&&B.render()},renderGreeting(){const t=n("#dashboard-greeting-title");if(t){const e=z();t.textContent=`${e}, Athlete!`}},renderStats(){const t=b.getAll(),e=C.calculateOverview(t),i=g.getUnits(),s=n("#stat-total-distance"),o=n("#stat-total-duration"),a=n("#stat-total-calories"),r=n("#stat-total-count");s&&(s.textContent=T(e.totalDistanceKm,i)),o&&(o.textContent=E(e.totalDurationMins)),a&&(a.textContent=`${e.totalCalories.toLocaleString()} kcal`),r&&(r.textContent=e.totalActivities.toString());const l=n("#weekly-goal-number"),c=n("#weekly-goal-subtext"),u=n("#weekly-goal-fill"),v=n("#weekly-goal-badge");l&&(l.textContent=`${e.weekly.activitiesCount} / ${e.weekly.targetActivities} Activities`),c&&(c.textContent=`${e.weekly.activitiesPct}% of weekly activity goal`),v&&(v.textContent=`${e.weekly.activitiesPct}%`),u&&(u.style.width=`${e.weekly.activitiesPct}%`);const h=n("#goal-mins-number"),y=n("#goal-mins-fill");h&&(h.textContent=`${e.weekly.totalDurationMins} / ${e.weekly.targetMinutes} Mins`),y&&(y.style.width=`${e.weekly.minutesPct}%`);const w=n("#goal-dist-number"),S=n("#goal-dist-fill"),A=i==="miles"?(e.weekly.targetDistance*.621371).toFixed(1)+" mi":e.weekly.targetDistance+" KM",m=T(e.weekly.totalDistanceKm,i);w&&(w.textContent=`${m} / ${A}`),S&&(S.style.width=`${e.weekly.distancePct}%`),["running","cycling","walking","workout"].forEach(x=>{const M=e.byType[x],_=n(`#breakdown-count-${x}`),j=n(`#breakdown-fill-${x}`),G=n(`#breakdown-meta-${x}`);_&&(_.textContent=`${M.count} Sesi`),j&&(j.style.width=`${M.percentage}%`),G&&(x==="workout"?G.textContent=`${E(M.duration)} • ${M.calories} kcal`:G.textContent=`${T(M.distance,i)} • ${E(M.duration)}`)})},renderActivityList(){const t=n("#activities-container");if(!t)return;const e=b.getFiltered(this.currentFilter),i=g.getUnits();if(e.length===0){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">${d.pulse("icon-xl")}</div>
          <h3 class="empty-title">No activities yet</h3>
          <p class="empty-desc">Start your first activity and build your momentum.</p>
          <button class="btn btn-primary btn-trigger-modal">
            ${d.plus("icon-sm")} Add First Activity
          </button>
        </div>
      `;const a=t.querySelector(".btn-trigger-modal");a&&a.addEventListener("click",()=>this.openActivityModal());return}const s={running:d.running("icon-lg"),cycling:d.cycling("icon-lg"),walking:d.walking("icon-lg"),workout:d.workout("icon-lg")},o={running:"Lari",cycling:"Bersepeda",walking:"Jalan Kaki",workout:"Workout"};t.innerHTML=e.map(a=>{const r=s[a.type]||d.pulse("icon-lg"),l=o[a.type]||a.type,c=a.type==="running"||a.type==="walking"||a.type==="cycling"?O(a.duration,a.distance,i):"-";return`
        <article class="activity-card" data-id="${a.id}">
          <div class="activity-main-info">
            <div class="activity-avatar badge-${a.type}">
              ${r}
            </div>
            <div class="activity-title-block">
              <h3>${D(a.title)}</h3>
              <div class="activity-meta">
                <span class="badge badge-${a.type}">${l}</span>
                <span class="meta-item">${d.calendar("icon-sm")} ${F(a.date)}</span>
                ${a.intensity?`<span class="badge" style="background-color: var(--bg-subtle); color: var(--text-secondary); text-transform: capitalize;">${a.intensity}</span>`:""}
                ${a.notes?`<span class="meta-item" title="${D(a.notes)}">${d.note("icon-sm")} ${D(a.notes.length>24?a.notes.substring(0,24)+"...":a.notes)}</span>`:""}
              </div>
            </div>
          </div>

          <div class="activity-stats-row">
            ${a.distance>0?`
              <div class="stat-item-inline">
                <strong>${T(a.distance,i)}</strong>
                <span>Jarak</span>
              </div>
            `:""}

            <div class="stat-item-inline">
              <strong>${E(a.duration)}</strong>
              <span>Durasi</span>
            </div>

            ${a.calories>0?`
              <div class="stat-item-inline">
                <strong>${a.calories} kcal</strong>
                <span>Kalori (Est.)</span>
              </div>
            `:""}

            ${c!=="-"?`
              <div class="stat-item-inline">
                <strong>${c}</strong>
                <span>Pace Rata-rata</span>
              </div>
            `:""}

            <div class="activity-actions">
              <button class="btn-icon btn-edit-activity" data-id="${a.id}" title="Edit Aktivitas" aria-label="Edit Aktivitas">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
              <button class="btn-icon btn-delete-activity" data-id="${a.id}" title="Hapus Aktivitas" aria-label="Hapus Aktivitas">
                ${d.trash("icon-sm")}
              </button>
            </div>
          </div>
        </article>
      `}).join("")},showToast(t,e="success"){const i=n("#toast-container");if(!i)return;const s=document.createElement("div");s.className=`toast toast-${e}`;const o=e==="success"?d.check("icon-md"):d.trash("icon-md");s.innerHTML=`
      <span>${o}</span>
      <span>${D(t)}</span>
    `,i.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateY(10px)",s.style.transition="all 0.3s ease",setTimeout(()=>s.remove(),300)},3e3)}},V={init(){this.initMobileDrawer(),this.initScrollReveal(),this.initActiveNavObserver()},initMobileDrawer(){const t=n("#hamburger-btn"),e=n("#mobile-drawer"),i=k(".mobile-nav-link");t&&e&&(t.addEventListener("click",()=>{e.classList.contains("active")?(e.classList.remove("active"),t.setAttribute("aria-expanded","false")):(e.classList.add("active"),t.setAttribute("aria-expanded","true"))}),i.forEach(s=>{s.addEventListener("click",()=>{e.classList.remove("active"),t.setAttribute("aria-expanded","false")})}))},initScrollReveal(){const t=k(".reveal-on-scroll"),e=new IntersectionObserver(i=>{i.forEach(s=>{s.isIntersecting&&(s.target.classList.add("revealed"),e.unobserve(s.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});t.forEach(i=>e.observe(i))},initActiveNavObserver(){const t=k("section[id]"),e=k(".nav-link"),i=k(".mobile-bottom-item"),s=new IntersectionObserver(o=>{o.forEach(a=>{if(a.isIntersecting){const r=a.target.getAttribute("id");e.forEach(l=>{l.getAttribute("href")===`#${r}`?l.classList.add("active"):l.classList.remove("active")}),i.forEach(l=>{l.getAttribute("href")===`#${r}`?l.classList.add("active"):l.classList.remove("active")})}})},{threshold:.3});t.forEach(o=>s.observe(o))}},J={init(){this.bindEvents(),this.render()},bindEvents(){k('input[name="setting-theme"]').forEach(v=>{v.addEventListener("change",h=>{H.applyTheme(h.target.value),p.showToast(`Theme changed to ${h.target.value}`,"success")})}),k('input[name="setting-unit"]').forEach(v=>{v.addEventListener("change",h=>{g.saveUnits(h.target.value),p.render(),p.showToast(`Unit changed to ${h.target.value.toUpperCase()}`,"success")})});const i=n("#btn-export-data");i&&i.addEventListener("click",()=>this.exportJSON());const s=n("#btn-import-data"),o=n("#file-input-import");s&&o&&(s.addEventListener("click",()=>o.click()),o.addEventListener("change",v=>this.handleFileImport(v)));const a=n("#btn-trigger-clear-data"),r=n("#modal-clear-confirm"),l=n("#btn-close-clear-modal"),c=n("#btn-cancel-clear"),u=n("#btn-confirm-clear");a&&r&&a.addEventListener("click",()=>r.classList.add("active")),l&&l.addEventListener("click",()=>this.closeClearModal()),c&&c.addEventListener("click",()=>this.closeClearModal()),r&&r.addEventListener("click",v=>{v.target===r&&this.closeClearModal()}),u&&u.addEventListener("click",()=>this.executeClearAllData())},closeClearModal(){const t=n("#modal-clear-confirm");t&&t.classList.remove("active")},exportJSON(){const t=g.exportAllData(),e=JSON.stringify(t,null,2),i=new Blob([e],{type:"application/json"}),s=URL.createObjectURL(i),o=document.createElement("a"),a=new Date().toISOString().split("T")[0];o.href=s,o.download=`habitpulse_backup_${a}.json`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s),p.showToast("Data exported successfully JSON","success")},handleFileImport(t){const e=t.target.files[0];if(!e)return;const i=new FileReader;i.onload=s=>{try{const o=JSON.parse(s.target.result),a=g.importData(o);a.success?(p.render(),this.render(),p.showToast("Data imported successfully!","success")):p.showToast(a.error||"Import failed","error")}catch{p.showToast("Invalid JSON file format","error")}t.target.value=""},i.readAsText(e)},executeClearAllData(){g.clearAllData(),this.closeClearModal(),p.render(),this.render(),p.showToast("All data cleared successfully","error")},render(){const t=g.getTheme(),e=g.getUnits(),i=n(`input[name="setting-theme"][value="${t}"]`);i&&(i.checked=!0);const s=n(`input[name="setting-unit"][value="${e}"]`);s&&(s.checked=!0)}};document.addEventListener("DOMContentLoaded",()=>{H.init(),k(".theme-toggle-btn").forEach(e=>{e.addEventListener("click",()=>{H.toggleTheme()})}),V.init(),p.init(),N.init(),I.init(),B.init(),J.init()});
//# sourceMappingURL=index-CKudxde1.js.map
