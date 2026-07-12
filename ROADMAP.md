<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
<title>نظام تقارير اليومية</title>
<meta name="description" content="نظام إدارة تقارير المبيعات والنقد اليومية للفروع مع مزامنة سحابية." />
<meta name="theme-color" content="#173A31" />
<link rel="manifest" href="./manifest.webmanifest" />
<link rel="icon" type="image/svg+xml" href="./icon.svg" />
<link rel="apple-touch-icon" href="./icon-180.png" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="تقارير اليومية" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --paper:#F3EFE6; --card:#FFFFFF; --ink:#173A31; --ink2:#255043; --brass:#AF8228;
  --text:#22302C; --muted:#7C847D; --line:#E4DED1; --line2:#EFEBE0;
  --pos:#1E7A5A; --neg:#B4462F; --amber:#C9931F;
  --shadow:0 1px 2px rgba(23,58,49,.04),0 8px 24px rgba(23,58,49,.05);
  --font:'Tajawal',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--paper);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.5;-webkit-text-size-adjust:100%}
button,input,select,textarea{font-family:var(--font);font-size:14px;color:var(--text)}
button{cursor:pointer;border:none;background:none}
a{color:var(--brass)}
::-webkit-scrollbar{height:9px;width:9px}
::-webkit-scrollbar-thumb{background:#cfc7b6;border-radius:9px}
.tnum{font-variant-numeric:tabular-nums}

.appbar{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:30}
.appbar-in{max-width:1180px;margin:0 auto;padding:11px 16px;display:flex;flex-direction:column;gap:11px}
.brand{display:flex;align-items:center;gap:11px}
.brand .logo{width:42px;height:42px;border-radius:12px;overflow:hidden;flex:none;display:block}
.brand .logo svg{width:100%;height:100%;display:block}
.brand h1{margin:0;font-size:17px;font-weight:800;line-height:1.15;color:var(--ink)}
.brand small{color:var(--muted);font-size:12px}
.sync-pill{margin-inline-start:auto;display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;white-space:nowrap;color:var(--muted);background:var(--paper);border:1px solid var(--line);padding:6px 12px;border-radius:999px;cursor:pointer;font-family:inherit;transition:background .15s,border-color .15s,color .15s}
.sync-pill:hover{border-color:var(--brass)}
.sync-pill.s-on{background:#e7f3ec;border-color:#bfe0cd;color:#1c6b4d}
.sync-pill.s-busy{background:#f7f0dd;border-color:#e7d7ab;color:#8a6a1f}
.sync-pill.s-err{background:#fbe9e2;border-color:#f0c6b6;color:#a03d1f}
.sync-dot{width:7px;height:7px;border-radius:50%;background:#c9c2b3;flex:none}
.sync-dot.on{background:var(--pos)} .sync-dot.err{background:var(--neg)} .sync-dot.busy{background:var(--brass);animation:pulse 1s infinite}
@keyframes pulse{50%{opacity:.35}}
.tabs{display:flex;gap:4px;overflow-x:auto}
.tab{display:flex;align-items:center;gap:7px;padding:9px 15px;border-radius:10px;color:var(--muted);font-weight:700;white-space:nowrap}
.tab.active{background:var(--ink);color:#fff}
.tab svg{width:17px;height:17px}

main{max-width:1180px;margin:0 auto;padding:20px 16px 70px}
.sec-head{margin-bottom:16px}
.eyebrow{color:var(--brass);font-size:12px;font-weight:800;letter-spacing:.06em}
.sec-head h2{margin:2px 0 0;font-size:22px;font-weight:800;color:var(--ink)}
.card{background:var(--card);border:1px solid var(--line);border-radius:15px;padding:18px;margin-bottom:16px;box-shadow:var(--shadow)}
.card-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:14px;font-weight:800;color:var(--ink);font-size:15px}
.card-head .sub{font-size:12px;color:var(--muted);font-weight:500}
.grid{display:grid;gap:14px}
.kpis{grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.cols2{grid-template-columns:repeat(auto-fit,minmax(290px,1fr))}
.kpi{background:#fff;border:1px solid var(--line);border-radius:14px;padding:15px;box-shadow:var(--shadow);border-top:3px solid var(--ink)}
.kpi.brass{border-top-color:var(--brass)} .kpi.pos{border-top-color:var(--pos)} .kpi.neg{border-top-color:var(--neg)}
.kpi .lbl{font-size:12px;color:var(--muted);margin-bottom:6px}
.kpi .val{font-size:23px;font-weight:800;line-height:1;color:var(--ink)}
.kpi.brass .val{color:var(--brass)} .kpi.pos .val{color:var(--pos)} .kpi.neg .val{color:var(--neg)}
.kpi .val u{font-size:12px;font-weight:600;color:var(--muted);text-decoration:none;margin-inline-start:3px}

.btn{display:inline-flex;align-items:center;gap:7px;background:var(--ink);color:#fff;border-radius:10px;padding:10px 17px;font-weight:800}
.btn:disabled{opacity:.45;cursor:not-allowed}
.btn.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}
.btn.brass{background:var(--brass)}
.btn svg{width:16px;height:16px}
.link{color:var(--brass);font-weight:800;display:inline-flex;align-items:center;gap:4px}
.iconbtn{width:32px;height:32px;border-radius:9px;border:1px solid var(--line);background:#fff;color:var(--muted);display:grid;place-items:center;flex:none}
.iconbtn svg{width:15px;height:15px}
.iconbtn.danger:hover{color:var(--neg);border-color:var(--neg)}
.iconbtn.brass{color:var(--brass);border-color:#e6d3ab}
input,select{border:1px solid var(--line);border-radius:9px;padding:9px 11px;background:#fff;outline:none;width:100%}
input:focus,select:focus{border-color:var(--brass)}
select{font-weight:700}
label.fld{display:flex;flex-direction:column;gap:6px}
label.fld > span{font-size:12px;color:var(--muted);font-weight:700}
.badge{background:var(--paper);border:1px solid var(--line);color:var(--pos);padding:5px 11px;border-radius:8px;font-size:12px;font-weight:800}

.tw{overflow-x:auto;border-radius:10px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:var(--ink);color:#fff;padding:9px 10px;text-align:right;font-weight:700;font-size:12px;white-space:nowrap}
td{padding:7px 10px;border-bottom:1px solid var(--line2);text-align:right}
.num{text-align:right;font-variant-numeric:tabular-nums;direction:ltr;unicode-bidi:plaintext}
tr.total{background:var(--paper);font-weight:800}
.stick{position:sticky;right:0;z-index:1}
th.stick{background:var(--ink)} td.stick{background:#fff}
tr.total td.stick{background:var(--paper)}
tr.clk{cursor:pointer} tr.clk:hover{background:#faf7ef}

/* خانات الإدخال كصناديق واضحة */
#entryTbl td.cell{padding:0;border-bottom:1px solid var(--line2)}
.box{position:relative;border:1px solid var(--line);border-radius:9px;margin:4px;background:#fbfaf6;transition:.12s}
.vdot{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;border:1.4px solid var(--line);background:#fff;color:#fff;font-size:10px;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;opacity:.4;transition:.12s;font-weight:900;z-index:2}
.box:hover .vdot{opacity:.9}
.vdot.v-g{opacity:1;background:var(--pos);border-color:var(--pos)}
.vdot.v-r{opacity:1;background:var(--neg);border-color:var(--neg)}
#entryTbl td.cell.v-g .box{background:#dff1e8;border-color:#4caf88;box-shadow:inset 0 0 0 1.4px #4caf88}
#entryTbl td.cell.v-r .box{background:#fbe4db;border-color:#d9714f;box-shadow:inset 0 0 0 1.4px #d9714f}
.box.fx{border-color:var(--brass);box-shadow:0 0 0 2px rgba(175,130,40,.18)}
input.fx{border-color:var(--brass) !important;box-shadow:0 0 0 2px rgba(175,130,40,.18)}
.box .amt{border:none;background:transparent;width:104px;padding:9px 18px;text-align:center;font-weight:600}
.box .amt.txt{text-align:right;width:150px;font-weight:400;padding:9px 12px}
#entryTbl th{text-align:center}
#entryTbl th.lh{text-align:right}
#entryTbl td.num{text-align:center}
#entryTbl tr.total td.stick{text-align:right}
/* ===== ترويسة ثابتة لجدول الإدخال (تبقى ظاهرة أثناء التمرير) ===== */
.etw{max-height:max(340px,calc(100vh - 250px));overflow:auto;overscroll-behavior:contain}
#entryTbl thead th{position:sticky;top:0;z-index:5}
#entryTbl thead th.stick{right:0;z-index:7}
/* ===== تغيير عرض الأعمدة بالسحب ===== */
#entryTbl th .cgrip{position:absolute;top:0;left:0;width:9px;height:100%;cursor:col-resize;z-index:8;touch-action:none}
#entryTbl th .cgrip:hover,#entryTbl th .cgrip.on{background:rgba(175,130,40,.45)}
#entryTbl.fixedcols{table-layout:fixed}
#entryTbl.fixedcols td:not(.rowact){overflow:hidden;text-overflow:ellipsis}
#entryTbl td.rowact{white-space:nowrap}
#entryTbl td{vertical-align:middle}
#entryTbl td.rowact .iconbtn,#entryTbl td.rowact .grip{vertical-align:middle}
#entryTbl.fixedcols .box .amt{width:100%;min-width:0}
/* ===== زر الرجوع العام ===== */
.backbtn{width:34px;height:34px;border:1px solid var(--line);background:#fff;border-radius:10px;display:grid;place-items:center;color:var(--ink);cursor:pointer;margin-inline-end:2px}
.backbtn:hover{border-color:var(--brass)}
.backbtn svg{width:16px;height:16px}
/* ===== البحث الشامل في التقارير ===== */
.gswrap{display:flex;gap:8px;align-items:center}
.gswrap input{flex:1}
.gswrap>svg{width:18px;height:18px;flex:none;color:var(--muted)}
.gsrow{display:flex;gap:10px;align-items:center;width:100%;text-align:right;background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:8px;cursor:pointer;font-family:inherit;font-size:13px}
.gsrow:hover{border-color:var(--brass)}
.gsrow b{color:var(--ink)}
.gstag{font-size:10.5px;padding:2.5px 9px;border-radius:999px;background:var(--paper);color:var(--ink);font-weight:700;white-space:nowrap}
.gstag.t-exp{background:#f6e3dc;color:var(--neg)}.gstag.t-inc{background:#dcefe6;color:var(--pos)}.gstag.t-br{background:#efe6d2;color:var(--brass)}
.gssub{color:var(--muted);font-size:12px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gsdate{margin-inline-start:auto;color:var(--muted);font-size:11.5px;white-space:nowrap}
.gscount{color:var(--muted);font-size:11.5px;margin-top:8px}
/* ===== قائمة منسدلة مخصصة (بديل select الأصلية) ===== */
.dd{position:relative;display:inline-block}
.ddbtn{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff;border:1.5px solid var(--line);border-radius:10px;padding:8px 13px;font-weight:700;font-size:13px;color:var(--ink);cursor:pointer;font-family:inherit;min-width:140px}
.ddbtn:hover{border-color:var(--brass)}
.ddbtn svg{width:13px;height:13px;color:var(--muted);flex:none;transition:transform .12s}
.dd.open .ddbtn{border-color:var(--brass);box-shadow:0 0 0 3px rgba(175,130,40,.12)}
.dd.open .ddbtn svg{transform:rotate(180deg)}
.ddmenu{position:absolute;top:calc(100% + 6px);right:0;min-width:100%;max-height:290px;overflow:auto;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:0 14px 34px rgba(23,32,27,.16);padding:5px;z-index:60;display:none}
.dd.open .ddmenu{display:block}
.dditem{display:flex;align-items:center;gap:8px;width:100%;text-align:right;background:none;border:none;border-radius:8px;padding:8px 12px;font-size:13px;color:var(--ink);cursor:pointer;font-family:inherit;white-space:nowrap}
.dditem:hover{background:var(--paper)}
.dditem.sel{background:var(--paper);font-weight:700}
.dditem .ck{width:14px;flex:none;color:var(--brass);font-weight:700}
.warnbar{background:#fdf6df;border:1px solid #ecd9a0;color:#7a5b12;border-radius:12px;padding:9px 14px;margin:0 0 10px;font-size:12.5px}
.lockbar{background:#eef3f0;border:1px solid #cfe0d6;color:#1c5c44;border-radius:12px;padding:9px 14px;margin:0 0 10px;font-size:12.5px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.abdg{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:50%;font-size:10px;font-weight:900;margin-inline-start:5px;vertical-align:middle}
.abdg.g{background:#bfe6d1;color:#12694b}.abdg.r{background:#f6cabb;color:#9e3418}
.dbdg{display:inline-block;background:#f2e8cf;color:#7a5b12;border-radius:999px;font-size:10px;font-weight:800;padding:1.5px 8px;margin-inline-start:5px;vertical-align:middle}
#entryTbl input[disabled],.entryview input[disabled]{background:#f4f2ec;color:#8a8f88;cursor:not-allowed}
.fxbar{position:fixed;left:0;right:0;bottom:0;z-index:9000;display:flex;gap:6px;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px));background:#fffdf7;border-top:1.5px solid var(--line);box-shadow:0 -6px 18px rgba(30,40,30,.08);transform:translateY(115%);transition:transform var(--d2) var(--ease);pointer-events:none}
.fxbar.show{transform:none;pointer-events:auto}
.fxbar button{flex:1;font-size:18px;font-weight:800;padding:10px 0;border:1.5px solid var(--line);border-radius:10px;background:#fff;color:var(--ink)}
.fxbar button:active{background:#f2ead6;transform:scale(.94)}
/* ===== نظام الحركة (v1.4.1): سريع، هادف، RTL-صديق ===== */
:root{--ease:cubic-bezier(.22,.9,.32,1);--easeS:cubic-bezier(.34,1.35,.44,1);--d1:.15s;--d2:.24s;--d3:.42s}
main.view-in>*{animation:vIn var(--d3) var(--ease) both}
main.view-in>*:nth-child(2){animation-delay:40ms}main.view-in>*:nth-child(3){animation-delay:80ms}
main.view-in>*:nth-child(4){animation-delay:120ms}main.view-in>*:nth-child(5){animation-delay:160ms}
main.view-in>*:nth-child(6){animation-delay:200ms}main.view-in>*:nth-child(n+7){animation-delay:240ms}
@keyframes vIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.btn,.iconbtn,.histbtn,.tabbtn,.ddbtn,.backbtn,.movebtn,.chip,.kpi{transition:transform var(--d1) var(--ease),box-shadow var(--d2) var(--ease),background var(--d1),border-color var(--d1),color var(--d1),opacity var(--d1)}
.btn:hover,.iconbtn:hover,.backbtn:hover{transform:translateY(-1px)}
.btn:hover{box-shadow:0 7px 18px rgba(23,50,40,.16)}
.btn:active,.iconbtn:active,.histbtn:active,.ddbtn:active,.backbtn:active{transform:translateY(0) scale(.96)}
.kpi:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(23,50,40,.10)}
.vdot{transition:transform var(--d1) var(--easeS),background var(--d1),border-color var(--d1)}
.vdot:active{transform:scale(1.35)}
.tabbtn{position:relative}
.tabbtn::after{content:"";position:absolute;insetInlineStart:16%;insetInlineEnd:16%;bottom:4px;height:2.5px;border-radius:3px;background:var(--brass);transform:scaleX(0);transition:transform var(--d2) var(--ease)}
.tabbtn.active::after,.tabbtn.on::after{transform:scaleX(1)}
.dd.open .ddmenu{animation:ddIn var(--d2) var(--ease)}
@keyframes ddIn{from{opacity:0;transform:translateY(-7px) scale(.985)}to{opacity:1;transform:none}}
.toast{animation:tIn var(--d2) var(--easeS)}
.toast.out{animation:tOut var(--d2) var(--ease) forwards}
@keyframes tIn{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:none}}
@keyframes tOut{to{opacity:0;transform:translateY(10px) scale(.97)}}
.modal{animation:mIn var(--d2) var(--easeS)}
.modal-bg.closing{animation:mbgOut var(--d1) ease forwards}
.modal-bg.closing .modal{animation:mOut var(--d1) var(--ease) forwards}
@keyframes mIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
@keyframes mOut{to{opacity:0;transform:translateY(8px) scale(.98)}}
@keyframes mbgOut{to{opacity:0}}
#entryTbl tr.row-in>td{animation:vIn var(--d3) var(--ease)}
#entryTbl tr.row-in .box{animation:boxGlow 1s var(--ease)}
.exp-row.row-in{animation:vIn var(--d3) var(--ease)}
.exp-row.row-in input:first-child{animation:boxGlow 1s var(--ease)}
@keyframes boxGlow{0%{box-shadow:0 0 0 3px rgba(175,130,40,.4)}100%{box-shadow:0 0 0 0 rgba(175,130,40,0)}}
.warnbar,.lockbar{animation:vIn var(--d2) var(--ease)}
.abdg,.dbdg{animation:bIn var(--d2) var(--easeS)}
@keyframes bIn{from{transform:scale(.55);opacity:0}to{transform:scale(1);opacity:1}}
.histbtn.save.dirty{animation:savePulse 1.7s ease-in-out infinite}
@keyframes savePulse{0%,100%{box-shadow:0 0 0 0 rgba(31,111,76,0)}50%{box-shadow:0 0 0 6px rgba(31,111,76,.13)}}
.sync-pill{transition:background var(--d2),border-color var(--d2),color var(--d2)}
tr.clk{transition:background var(--d1)}
@media print{*{animation:none!important;transition:none!important}}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
  .fxbar{transform:none;display:none}.fxbar.show{display:flex}
}
.movecol{display:flex;flex-direction:column;gap:2px}
.movebtn{width:26px;height:17px;border:1px solid var(--line);background:#fff;color:var(--muted);border-radius:6px;display:grid;place-items:center;padding:0}
.movebtn svg{width:12px;height:12px}
.movebtn:hover{color:var(--ink);border-color:var(--brass)}
.box:focus-within{border-color:var(--brass);background:#fff;box-shadow:0 0 0 2px rgba(175,130,40,.14)}
.box .mk{position:absolute;top:50%;transform:translateY(-50%);right:6px;width:13px;height:13px;border-radius:50%;border:1.6px solid #cdc6b6;background:#fff;padding:0}
.box.mk-g{background:#e7f4ec;border-color:var(--pos)} .box.mk-g .mk{background:var(--pos);border-color:var(--pos)}
.box.mk-y{background:#fbf3dc;border-color:var(--amber)} .box.mk-y .mk{background:var(--amber);border-color:var(--amber)}
.box.mk-r{background:#fbe7e1;border-color:var(--neg)} .box.mk-r .mk{background:var(--neg);border-color:var(--neg)}
.branchbtn{width:100%;min-width:150px;text-align:right;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;font-weight:700;margin:4px 4px 4px 0;display:flex;justify-content:space-between;align-items:center;gap:6px}
.branchbtn .ph{color:var(--muted);font-weight:500}
.branchbtn svg{width:14px;height:14px;color:var(--muted)}
.rowact{white-space:nowrap;display:flex;gap:4px;padding-top:8px}
.mkhint{font-size:12px;color:var(--muted);display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;align-items:center}
.mkhint i{width:11px;height:11px;border-radius:50%;display:inline-block;margin-inline-end:4px;vertical-align:-1px}

/* التقويم بشكل الصورة */
.datenav{background:#fff;border:1px solid var(--line);border-radius:15px;padding:14px;margin-bottom:16px;box-shadow:var(--shadow)}
.dn-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.dn-arrows{display:flex;gap:6px}
.dn-cur{flex:1;min-width:170px;text-align:center}
.dn-cur .d{font-size:18px;font-weight:800;color:var(--ink)}
.dn-cur .s{font-size:12px;color:var(--muted)} .dn-cur .s.hasdata{color:var(--pos)}
.dn-quick{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.cal{margin-top:14px;display:none;max-width:320px;border:1px solid var(--line);border-radius:14px;padding:12px;background:#fff}
.cal.open{display:block}
.cal-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;padding-bottom:8px;border-bottom:1px solid var(--line2)}
.cal-nav2{width:30px;height:30px;border-radius:8px;border:1px solid var(--line);background:#fff;cursor:pointer;font-size:15px;color:var(--ink);line-height:1;display:grid;place-items:center;flex:none;transition:background .12s,border-color .12s}
.cal-nav2:hover{background:var(--paper);border-color:var(--brass)}
.cal-title{display:flex;gap:5px;flex:1;justify-content:center}
.cal-title button{border:none;background:var(--paper);border-radius:8px;padding:6px 12px;font-weight:800;cursor:pointer;color:var(--ink);font-size:14px;transition:background .12s,color .12s}
.cal-title button:hover{background:#e7f4ec;color:var(--pos)}
.calg{display:grid;grid-template-columns:repeat(7,1fr);grid-auto-rows:38px;gap:2px}
.cal-week{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:2px}
.cal-dow{font-size:11px;color:var(--muted);text-align:center;padding:2px 0 4px;font-weight:700}
.cal-day{display:grid;place-items:center;border:none;background:transparent;border-radius:9px;cursor:pointer;font-size:13.5px;color:var(--text);font-weight:600;font-variant-numeric:tabular-nums;position:relative;transition:background .1s;padding:0}
.cal-day:hover{background:var(--paper)}
.cal-day.today{box-shadow:inset 0 0 0 1.5px var(--brass)}
.cal-day.sel{background:var(--pos);color:#fff;font-weight:800}
.cal-day.empty{visibility:hidden;cursor:default}
.cal-day .dt{position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--pos)}
.cal-day.sel .dt{background:#fff}
.cal-foot{display:flex;justify-content:center;margin-top:6px;padding-top:8px;border-top:1px solid var(--line2)}
.cal-today-btn{border:1px solid var(--line);background:#fff;border-radius:8px;padding:6px 15px;cursor:pointer;font-size:12.5px;color:var(--pos);font-weight:700;transition:background .12s}
.cal-today-btn:hover{background:#e7f4ec}
.my-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding-top:2px}
.my-cell{padding:12px 4px;border:none;background:var(--paper);border-radius:9px;cursor:pointer;font-size:13.5px;color:var(--text);font-weight:700;transition:background .12s,color .12s}
.my-cell:hover{background:#e7f4ec}
.my-cell.cur{background:var(--pos);color:#fff}
.dp-x{display:flex;justify-content:flex-start;margin-bottom:4px}
.dp-x button{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:var(--muted);background:transparent}
.dp-x button:hover{background:var(--paper);color:var(--ink)}
.dp-x button svg{width:15px;height:15px}
.dpbtn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);border-radius:9px;padding:9px 12px;background:#fff;font-weight:700;color:var(--ink);min-width:150px;justify-content:space-between;transition:border-color .12s}
.dpbtn svg{width:15px;height:15px;color:var(--brass);flex:none}
.dpbtn:hover{border-color:var(--brass)}
.fld .dpbtn{width:100%;min-width:0}
.modal.cal-modal{max-width:314px;padding:14px}
.modal .cal{max-width:100%;border:none;padding:0;margin:0}

/* سحب الصفوف */
.grip{display:inline-grid;place-items:center;width:28px;height:32px;color:#b7b0a0;cursor:grab;touch-action:none;border-radius:7px;transition:background .12s,color .12s}
.grip:hover{background:var(--paper);color:var(--ink)}
.grip:active{cursor:grabbing}
.grip svg{width:17px;height:17px;pointer-events:none}
tr.dragging{box-shadow:0 8px 22px rgba(23,58,49,.18)}
tr.dragging td{background:#fbfaf6}
tr.dragging td.stick{background:#fbfaf6}

/* تلوين التحقق: الإجماليات + باقي الرصيد فقط */
.histbar{display:flex;gap:8px;margin:0 0 10px}
.histbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);background:#fff;border-radius:9px;padding:7px 13px;font-weight:700;color:var(--ink);font-size:13px;font-family:inherit;cursor:pointer;transition:border-color .12s,background .12s}
.histbtn:hover:not(:disabled){border-color:var(--brass);background:#fbf7ee}
.histbtn:disabled{opacity:.4;cursor:default}
.histbtn svg{width:15px;height:15px}
.histbtn.save .sicon{display:inline-flex;align-items:center}
.histbtn.save.dirty{border-color:var(--brass);background:var(--brass);color:#fff}
.histbtn.save.dirty:hover:not(:disabled){background:#946f24;border-color:#946f24}
.histbtn.save:disabled{opacity:.6}
.histbtn.save:disabled .slbl{color:var(--pos)}
.tcell,.vc{transition:background .12s;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tcell{cursor:pointer}
.tcell.c-g,.vc.c-g,tr.total td.tcell.c-g{background:#bfe6d1;color:#12694b;box-shadow:inset 0 0 0 1.6px #4caf88}
.tcell.c-r,.vc.c-r,tr.total td.tcell.c-r{background:#f6cabb;color:#9e3418;box-shadow:inset 0 0 0 1.6px #d9714f}
.carval{cursor:pointer;border-radius:8px;padding:1px 9px;transition:background .12s;font-variant-numeric:tabular-nums;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.carval.c-g{background:#bfe6d1;color:#12694b;box-shadow:inset 0 0 0 1.6px #4caf88}
.carval.c-r{background:#f6cabb;color:#9e3418;box-shadow:inset 0 0 0 1.6px #d9714f}

/* لوحة الإدخال المُدمجة */
.entryview .card{padding:14px;margin-bottom:12px}
.entryview .datenav{padding:12px;margin-bottom:12px}
.entryview .card-head{margin-bottom:9px}
.entryview #entryTbl th{padding:6px 8px;font-size:11.5px}
.entryview #entryTbl td{padding:1px 3px}
.entryview #entryTbl td.stick{padding:1px 6px}
.entryview .box{margin:2px}
.entryview .box .amt{width:86px;padding:6px 12px;font-size:13px}
.entryview .box .amt.txt{width:126px;padding:6px 9px}
.entryview .branchbtn{margin:2px 2px 2px 0;padding:7px 9px;min-width:126px}
.entryview .rowline{padding:5px 0}
.entryview .rowline.big{padding-top:8px}
.entryview .exp-row{margin-bottom:6px}
.entryview .mkhint{margin-top:8px}

/* نافذة تأكيد/تنبيه موحّدة */
.modal-sm{max-width:392px}
.modal-sm:focus{outline:none}
.mtitle{margin:0 0 8px;font-size:17px;color:var(--ink);font-weight:800;display:flex;align-items:center;gap:9px}
.mtitle .mi{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none}
.mtitle .mi.danger{background:#f7e4de;color:var(--neg)} .mtitle .mi.info{background:#e7f4ec;color:var(--pos)} .mtitle .mi svg{width:19px;height:19px}
.mbody{margin:0 0 18px;color:var(--muted);font-size:14px;line-height:1.75}
.mbody b{color:var(--text)}
.mlabel{display:block;font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:700}
.minput{width:100%;margin-bottom:18px}
.mactions{display:flex;gap:10px}
.mactions .btn{flex:1;justify-content:center}
.btn.danger{background:var(--neg)}

@keyframes mbgIn{from{opacity:0}to{opacity:1}}
@keyframes mpopIn{from{opacity:0;transform:translateY(10px) scale(.975)}to{opacity:1;transform:none}}
.modal-bg{animation:mbgIn .14s ease}
.modal{animation:mpopIn .19s cubic-bezier(.2,.85,.3,1)}
@media (prefers-reduced-motion:reduce){.modal-bg,.modal{animation:none}}



.rowline{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed var(--line);font-size:14px}
.rowline b{font-variant-numeric:tabular-nums}
.rowline.big{border-bottom:none;border-top:2px solid var(--line);margin-top:4px;padding-top:11px}
.rowline.big b{font-size:19px;color:var(--ink)}
.emptyline{color:var(--muted);font-size:13px;padding:8px 0}
.exp-row{display:flex;gap:8px;margin-bottom:8px}
.chip{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;margin:0 0 8px}
.audit{font-size:12px;color:var(--muted);margin-top:2px;display:flex;gap:14px;flex-wrap:wrap}
.audit b{color:var(--text);font-weight:700}
.empty{text-align:center;padding:46px 20px}
.empty .ic{width:58px;height:58px;border-radius:16px;background:var(--paper);display:grid;place-items:center;margin:0 auto 15px;color:var(--brass)}
.empty h3{margin:0 0 7px;color:var(--ink);font-size:18px}
.empty p{margin:0 0 19px;color:var(--muted)}
.subtabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.subtab{padding:8px 15px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--muted);font-weight:700;font-size:13px}
.subtab.active{background:var(--brass);color:#fff;border-color:var(--brass)}
.filterbar{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px;box-shadow:var(--shadow)}
.filterbar .fld{min-width:130px}
.note{font-size:12.5px;color:var(--muted);line-height:1.8}
.warn{background:#fdf6ea;border:1px solid #ecdcb6;color:#8a6d1f;border-radius:10px;padding:11px 13px;font-size:12.5px;line-height:1.7;margin-top:10px}
.ok{background:#f0f7f2;border-color:#bfe0cd;color:#1E7A5A}
.toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 20px;border-radius:12px;display:flex;gap:8px;align-items:center;font-weight:700;z-index:80;box-shadow:0 10px 30px rgba(0,0,0,.2);max-width:92vw}
.updbar{position:fixed;left:0;right:0;bottom:0;background:var(--ink);color:#fff;display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 18px;z-index:90;box-shadow:0 -8px 24px rgba(0,0,0,.18);font-weight:700}
.updbar svg{width:16px;height:16px;vertical-align:-3px}
.updbar .updacts{display:flex;gap:8px}
.updbar .u-now{background:var(--brass);color:#fff;border:none;border-radius:9px;padding:8px 16px;font-weight:800;cursor:pointer;font-family:inherit}
.updbar .u-x{background:transparent;color:#cfd8d3;border:1px solid rgba(255,255,255,.3);border-radius:9px;padding:8px 14px;cursor:pointer;font-family:inherit}
.updbar.cflt{background:var(--neg)}
.updbar.cflt .u-now{background:#fff;color:var(--neg)}
.toast.err{background:var(--neg)}
.modal-bg{position:fixed;inset:0;background:rgba(20,40,34,.5);z-index:70;display:flex;align-items:flex-start;justify-content:center;padding:22px 14px;overflow:auto}
.modal{background:#fff;border-radius:16px;max-width:460px;width:100%;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.25)}
.modal h3{margin:0 0 12px;color:var(--ink);display:flex;justify-content:space-between;align-items:center}
.pick-list{max-height:52vh;overflow:auto;display:flex;flex-direction:column;gap:4px;margin-top:10px}
.pick-item{text-align:right;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:#fff;font-weight:700}
.pick-item:hover{background:var(--paper);border-color:var(--brass)}
.svgchart{width:100%;height:auto;display:block;font-family:var(--font)}
.dayview-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}

#printroot{display:none}
#printroot{display:none}
#printroot .p-wrap{font-family:var(--font);color:#111;font-size:12px}
#printroot .p-head{display:flex;justify-content:space-between;align-items:center;border-bottom:2.5px solid #173A31;padding-bottom:9px;margin-bottom:12px;gap:14px}
#printroot .p-head .brandcol{display:flex;align-items:center;gap:12px}
#printroot .p-head .plogo{height:48px;max-width:150px;object-fit:contain}
#printroot .p-head .plogo-ph{height:48px;width:48px;border-radius:11px;flex:none}
#printroot .p-head .plogo-ph svg{width:100%;height:100%;display:block}
#printroot .p-head h2{margin:0;font-size:19px;color:#173A31;font-weight:800}
#printroot .p-head .sd{color:#173A31;font-weight:700;margin-top:3px}
#printroot .p-head .meta{text-align:left;font-size:11px;color:#666;line-height:1.7}
#printroot .p-tbl{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px}
#printroot .p-tbl th,#printroot .p-tbl td{border:1px solid #b7b7b7;padding:3.5px 6px}
#printroot .p-tbl th{background:#173A31;color:#fff;text-align:right;font-weight:700}
#printroot .p-tbl td.num{text-align:left;font-variant-numeric:tabular-nums}
#printroot .p-tbl tr.total{background:#eef1ec;font-weight:800}
#printroot .p-two{display:flex;gap:16px}#printroot .p-two>div{flex:1;min-width:0}#printroot .p-two+.p-two{margin-top:8px}
#printroot .p-title{font-weight:800;color:#173A31;margin:2px 0 5px;font-size:12.5px}
#printroot .p-sum td{padding:3.5px 6px;border-bottom:1px solid #ddd}
#printroot .p-sum tr.h td{background:#f4f1ea;font-weight:800;border-bottom:1px solid #cbb}
#printroot .p-sum .num{text-align:left}
#printroot .p-audit{margin-top:12px;font-size:10px;color:#666;border-top:1px solid #ccc;padding-top:7px}
@media print{
#printroot .p-page{page-break-after:always}
#printroot .p-page:last-child{page-break-after:auto}
  body{background:#fff}
  .appbar,main,.toast,.modal-bg{display:none!important}
  #printroot{display:block!important}
  @page{size:A4;margin:8mm}
}
@media (max-width:640px){
  main{padding:16px 12px 64px}
  .card{padding:15px;border-radius:14px}
  .sec-head h2{font-size:20px}
  .filterbar{padding:12px;gap:9px}
  .filterbar .fld{flex:1 1 100%;min-width:0}
  .filterbar .btn{width:100%;justify-content:center}
  .cols2{grid-template-columns:1fr}
  .kpis{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
  .dn-cur .d{font-size:16px}
  .appbar-in{padding:10px 12px}
}
@media (max-width:560px){.brand h1{font-size:15px}.brand small{font-size:11px}.kpi .val{font-size:20px}.dpbtn{min-width:120px}}
@media (max-width:400px){.kpis{grid-template-columns:1fr 1fr}.tab{padding:8px 12px}}
</style>
</head>
<body>
<div id="app"></div>
<div id="modalRoot"></div>
<div id="printroot"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="./config.js"></script>
<script>
"use strict";
(function(){
var AR_DAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
var AR_MONTHS=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
var DEFAULT_BRANCHES=["التميز","الرائد بن دايل","الضبيبي الأثاث الجموم","الضبيبي للاثاث العمرة","الضبيبي سجاد العمرة","الضبيبي موكيت الدواس","الضبيبي موكيت العمرة","الضبيبي موكيت بن دايل","العز للاثاث الدواس","الرائد الدواس","العز للمفروشات العمرة","قمر موكيت الدواس","قمر موكيت العمرة","الضبيبي اثاث بن دايل","الضبيبي سجاد الدواس","الضبيبي ولي العهد","الخياطة","الإدارة","التسويق","المشاريع"];
var DEFAULT_METHODS=[{id:"net",label:"الشبكة"},{id:"credit",label:"آجل"},{id:"refund",label:"مرتجع عربون"},{id:"transfer",label:"تحويل"},{id:"tabby",label:"تابي"},{id:"tamara",label:"تمارا"}];

function uid(){return Math.random().toString(36).slice(2,9)}
/* مُولّد UUID دائم (RFC-4122 v4) مع بدائل آمنة */
function uuid(){
  try{if(typeof crypto!=="undefined"&&crypto.randomUUID)return crypto.randomUUID();}catch(e){}
  try{if(typeof crypto!=="undefined"&&crypto.getRandomValues){var b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&0x0f)|0x40;b[8]=(b[8]&0x3f)|0x80;var h=[];for(var i=0;i<16;i++)h.push((b[i]+0x100).toString(16).slice(1));return h[0]+h[1]+h[2]+h[3]+"-"+h[4]+h[5]+"-"+h[6]+h[7]+"-"+h[8]+h[9]+"-"+h[10]+h[11]+h[12]+h[13]+h[14]+h[15];}}catch(e){}
  return "id-"+Date.now().toString(16)+"-"+Math.random().toString(16).slice(2,10);
}
/* ===== طبقة هوية الفروع: config.branches = [{id,name}] =====
   - r.branchId = الهوية الدائمة (لا تتغيّر). r.branch = الاسم (قيمة عرض تُحدَّث عند إعادة التسمية).
   - كل الدوال دفاعية: تتحمّل الفروع النصّية القديمة والصفوف بلا branchId. */
function normBranches(cfg){if(!cfg)return[];if(!Array.isArray(cfg.branches))cfg.branches=[];
  cfg.branches=cfg.branches.map(function(b){return (b&&typeof b==="object")?{id:b.id||uuid(),name:b.name||""}:{id:uuid(),name:String(b||"")}});
  return cfg.branches;}
function branchList(){return normBranches(S.config);}
function branchById(id){var l=branchList();for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i];return null;}
function branchByName(name){var l=branchList();for(var i=0;i<l.length;i++)if(l[i].name===name)return l[i];return null;}
function ensureBranch(name){name=String(name||"").trim();if(!name)return"";var b=branchByName(name);if(b)return b.id;var nb={id:uuid(),name:name};S.config.branches.push(nb);return nb.id;}
function rowBranchId(r){if(r.branchId)return r.branchId;var b=branchByName(r.branch||"");return b?b.id:"";}
function num(v){if(v===""||v==null)return 0;var n=typeof v==="number"?v:parseFloat(String(v).replace(/,/g,"").replace(/[^\d.\-]/g,""));return isNaN(n)?0:n}
function fmt(v){return num(v).toLocaleString("en-US",{maximumFractionDigits:2})}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function pad(n){return String(n).padStart(2,"0")}
function todayISO(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function ymOf(iso){return iso.slice(0,7)} function yOf(iso){return iso.slice(0,4)}
function prettyDate(iso){if(!iso)return"";var p=iso.split("-").map(Number);var d=new Date(p[0],p[1]-1,p[2]);return AR_DAYS[d.getDay()]+" "+p[2]+" "+AR_MONTHS[p[1]-1]+" "+p[0]}
function prettyMonth(ym){var p=ym.split("-").map(Number);return AR_MONTHS[p[1]-1]+" "+p[0]}
function shiftDate(iso,delta){var p=iso.split("-").map(Number);var d=new Date(p[0],p[1]-1,p[2]+delta);return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function nowStamp(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes())}
function monthStart(ym){return ym+"-01"}
function monthEnd(ym){var p=ym.split("-").map(Number);return ym+"-"+pad(new Date(p[0],p[1],0).getDate())}

/* التخزين */
var CLOUD=(typeof window.storage!=="undefined"&&window.storage&&typeof window.storage.get==="function");
/* ===== المزامنة السحابية عبر Cloudflare Worker (وسيط Dropbox الآمن) ===== */
var _CFG=(typeof window!=="undefined"&&window.DAYBOOK_CONFIG)||{};
var CLOUD_API=(_CFG.cloudUrl||"").replace(/\/+$/,"");
var CLOUD_TOKEN=_CFG.appToken||"";
function cloudOn(){return !!CLOUD_API&&!/YOUR-SUBDOMAIN/.test(CLOUD_API);}
function cloudHeaders(json){var h={};if(json)h["Content-Type"]="application/json";if(CLOUD_TOKEN)h["Authorization"]="Bearer "+CLOUD_TOKEN;return h;}
async function cloudLoad(){var r=await fetch(CLOUD_API+"/data",{method:"GET",headers:cloudHeaders(false),cache:"no-store"});
  if(r.status===204)return {payload:null,rev:(r.headers.get("X-Data-Rev")||"")};
  if(r.status===404)return {payload:null,rev:""};
  if(!r.ok)throw new Error("cloud GET "+r.status);
  var rev=r.headers.get("X-Data-Rev")||"";var txt=await r.text();return {payload:txt?JSON.parse(txt):null,rev:rev};}
async function cloudSave(payload,baseRev){var h=cloudHeaders(true);if(baseRev)h["X-Base-Rev"]=baseRev;
  var r=await fetch(CLOUD_API+"/data",{method:"POST",headers:h,body:JSON.stringify(payload)});
  if(r.status===409){var j={};try{j=await r.json()}catch(e){}var err=new Error("conflict");err.conflict=true;err.serverRev=j.serverRev||"";throw err;}
  if(!r.ok)throw new Error("cloud POST "+r.status);
  var jj={};try{jj=await r.json()}catch(e){}return jj.rev||"";}

var APP_VERSION="1.4.1";     /* رقم إصدار التطبيق — بدّله عند كل تحديث (وفي sw.js و version.json) */
var SCHEMA_VERSION=5;        /* نسخة بنية البيانات — ارفعه فقط عند تغيير شكل البيانات وأضف دالة ترحيل */
/* دوال الترحيل: MIGRATIONS[v-1] ترقّي البيانات من النسخة v إلى v+1.
   تُطبَّق تلقائياً عند فتح التطبيق أو سحب بيانات أقدم، دون مساس بأي بيانات موجودة. */
var MIGRATIONS=[
  function(st){ if(!Array.isArray(st.config.imports))st.config.imports=[]; },                 /* 1 → 2: سجل الملفات المستوردة */
  function(st){ if(!Array.isArray(st.config.trash))st.config.trash=[]; },                      /* 2 → 3: سلة المحذوفات */
  function(st){ Object.keys(st.data||{}).forEach(function(dt){var d=st.data[dt];if(!d)return;  /* 3 → 4: تطبيع اليوم + خرائط التحقق */
      d.rows=d.rows||[];d.expenses=d.expenses||[];d.incomes=d.incomes||[];d.tmarks=d.tmarks||{};d.verify=d.verify||{};}); },
  function(st){ /* 4 → 5: هويات UUID دائمة للفروع والأيام والصفوف وبنود المصروفات/الإيرادات */
    var cfg=st.config;
    /* الفروع: نص → {id,name} (لا تُعاد توليد أي هوية موجودة) */
    if(!Array.isArray(cfg.branches))cfg.branches=[];
    cfg.branches=cfg.branches.map(function(b){return (b&&typeof b==="object")?{id:b.id||uuid(),name:b.name||""}:{id:uuid(),name:String(b||"")};});
    var byName={};cfg.branches.forEach(function(b){if(b.name)byName[b.name]=b.id;});
    /* الأيام والصفوف والبنود */
    Object.keys(st.data||{}).forEach(function(dt){var d=st.data[dt];if(!d)return;
      if(!d.uuid)d.uuid=uuid();
      (d.rows||[]).forEach(function(r){
        if(!r.id)r.id=uuid();
        if(!r.branchId&&r.branch){ if(!byName[r.branch]){var nid=uuid();cfg.branches.push({id:nid,name:r.branch});byName[r.branch]=nid;} r.branchId=byName[r.branch]; }
        if("marks" in r)delete r.marks;
      });
      (d.expenses||[]).forEach(function(e){if(!e.id)e.id=uuid();});
      (d.incomes||[]).forEach(function(e){if(!e.id)e.id=uuid();});
    });
  }
];
function runMigrations(cfg,data,have){var st={config:cfg||{},data:data||{}};var from=Math.max(1,have||1);
  for(var v=from;v<SCHEMA_VERSION;v++){var fn=MIGRATIONS[v-1];if(fn){try{fn(st)}catch(e){}}}
  return st;}
var DB={
  async get(k){try{if(CLOUD){var r=await window.storage.get(k);return r?JSON.parse(r.value):null}var v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}},
  async set(k,v){try{var s=JSON.stringify(v);if(CLOUD){await window.storage.set(k,s)}else{localStorage.setItem(k,s)}return true}catch(e){return false}},
  async del(k){try{if(CLOUD){await window.storage.delete(k)}else{localStorage.removeItem(k)}return true}catch(e){return false}},
  async keys(prefix){try{if(CLOUD){var r=await window.storage.list(prefix);return r?r.keys:[]}return Object.keys(localStorage).filter(function(k){return k.indexOf(prefix)===0})}catch(e){return[]}}
};

var S={config:null,data:{},view:"dashboard",prevView:"dashboard",curDate:todayISO(),calMonth:ymOf(todayISO()),
  reportTab:"custom",day:null,dirty:false,sync:{status:"idle",last:null},saveTimer:null,dbxTimer:null,calOpen:false,calMode:"days",
  dash:{preset:"month",from:"",to:""},rf:{from:"",to:"",brs:[]},it:{type:"both",from:"",to:""},pickRow:null,dp:{ym:"",sel:"",target:"",mode:"days"}};

function defaultConfig(){return{businessName:"تقرير اليومية",openingBalance:0,branches:DEFAULT_BRANCHES.map(function(n){return{id:uuid(),name:n}}),
  methods:DEFAULT_METHODS.map(function(m){return{id:m.id,label:m.label}}),companyLogo:"",imports:[],trash:[],
  dropbox:{appKey:"",refreshToken:"",enabled:false}}}
function blankDay(date){return{uuid:uuid(),date:date,dateTo:"",rows:[],expenses:[],incomes:[],bankDeposit:0,createdAt:null,updatedAt:null,printedAt:null}}

/* الحساب — الرصيد قبل المصروفات/الإيرادات، والإجمالي النقدي أخيراً */
function computeDay(day,cfg){
  var methods=cfg.methods,byM={},i;for(i=0;i<methods.length;i++)byM[methods[i].id]=0;
  var sales=0,cash=0;(day.rows||[]).forEach(function(r){
    var s=num(r.sales),non=0;methods.forEach(function(m){var v=num((r.pays||{})[m.id]);byM[m.id]+=v;non+=v});
    sales+=s;cash+=s-non;});
  var totalExpenses=(day.expenses||[]).reduce(function(a,e){return a+num(e.amount)},0);
  var totalIncome=(day.incomes||[]).reduce(function(a,e){return a+num(e.amount)},0);
  var bankDeposit=num(day.bankDeposit);
  var netCash=cash-totalExpenses;
  var cashTotal=netCash+totalIncome; // يُحسب أخيراً بعد المصروفات والإيرادات
  return{sales:sales,byM:byM,cash:cash,totalExpenses:totalExpenses,totalIncome:totalIncome,bankDeposit:bankDeposit,netCash:netCash,cashTotal:cashTotal};
}
var _balCache=null,_dayNoCache=null;
function balances(){
  if(_balCache)return _balCache;
  var dates=Object.keys(S.data).sort(),out={},prev=num(S.config.openingBalance);
  dates.forEach(function(d){var day=S.data[d];
    var start=(day.carryIn!=null&&day.carryIn!=="")?num(day.carryIn):prev;
    var c=computeDay(day,S.config);var carried=start+c.cash-c.bankDeposit;
    out[d]={prev:start,carried:carried};prev=carried});
  _balCache=out;return out;
}
function invalidateBal(){_balCache=null;_dayNoCache=null;}
/* رقم اليومية: تسلسل زمني ثابت (اليومية الأقدم = 1) — محسوب لا مخزّن، متطابق على كل الأجهزة */
function dayNo(iso){
  if(!_dayNoCache){_dayNoCache={};var ks=Object.keys(S.data).sort();for(var i=0;i<ks.length;i++)_dayNoCache[ks[i]]=i+1;}
  return _dayNoCache[iso]||"";
}
function priorCarried(date){var bal=balances();var before=Object.keys(S.data).filter(function(x){return x<date}).sort();return before.length?bal[before[before.length-1]].carried:num(S.config.openingBalance)}
function dayPrev(day){return (day.carryIn!=null&&day.carryIn!=="")?num(day.carryIn):priorCarried(day.date)}

/* تحميل/حفظ */
async function loadAll(){
  var meta=await DB.get("dsr_meta");var have=(meta&&meta.schema)||1;
  var cfg=await DB.get("dsr_config");if(!cfg){cfg=defaultConfig();have=SCHEMA_VERSION;}
  if(!cfg.methods||!cfg.methods.length)cfg.methods=DEFAULT_METHODS.slice();
  if(!cfg.dropbox)cfg.dropbox={appKey:"",refreshToken:"",enabled:false};
  if(cfg.companyLogo==null)cfg.companyLogo="";
  if(!Array.isArray(cfg.imports))cfg.imports=[];
  if(!Array.isArray(cfg.trash))cfg.trash=[];
  if(cfg.github)delete cfg.github;
  S.config=cfg;normBranches(cfg);
  var ykeys=await DB.keys("dsr_y_");var all={};
  for(var i=0;i<ykeys.length;i++){var y=await DB.get(ykeys[i]);if(y)Object.assign(all,y)}
  if(have<SCHEMA_VERSION){var st=runMigrations(cfg,all,have);cfg=st.config;all=st.data;}
  S.config=cfg;S.data=all;invalidateBal();
  await DB.set("dsr_config",cfg);
  if(have<SCHEMA_VERSION){var years={};Object.keys(all).forEach(function(d){var yy=yOf(d);(years[yy]=years[yy]||{})[d]=all[d]});for(var yk in years)await DB.set("dsr_y_"+yk,years[yk]);}
  await DB.set("dsr_meta",{schema:SCHEMA_VERSION,appVersion:APP_VERSION,updatedAt:nowStamp()});
}
async function saveConfig(){queueConfigOps();await DB.set("dsr_config",S.config);invalidateBal();scheduleDbx()}
/* يلتقط سجلات الإعدادات القابلة للدمج كعمليات (كل مفتاح = سجل مستقل) */
function queueConfigOps(){ensureQueue();var rec=cfgRecords(S.config);Object.keys(rec).forEach(function(k){queueOp("cfg",k,rec[k])});}
async function persistDay(date){invalidateBal();var y=yOf(date),yk="dsr_y_"+y,obj={};
  Object.keys(S.data).forEach(function(d){if(yOf(d)===y)obj[d]=S.data[d]});
  if(Object.keys(obj).length)await DB.set(yk,obj);else await DB.del(yk);
  invalidateBal();scheduleDbx();}
async function persistEverything(){
  invalidateBal();
  await DB.set("dsr_config",S.config);
  var years={};Object.keys(S.data).forEach(function(d){var y=yOf(d);(years[y]=years[y]||{})[d]=S.data[d]});
  var yk=await DB.keys("dsr_y_");for(var i=0;i<yk.length;i++)await DB.del(yk[i]);
  for(var y in years)await DB.set("dsr_y_"+y,years[y]);
  invalidateBal();scheduleDbx();}
function scheduleSave(){S.dirty=true;updateSyncPill();updateSaveBtn();if(S.saveTimer)clearTimeout(S.saveTimer);S.saveTimer=setTimeout(commitDay,700)}
async function commitDay(){if(!S.day)return;var d=S.day;
  if(!d.uuid)d.uuid=uuid();
  if(!d.createdAt)d.createdAt=nowStamp();d.updatedAt=nowStamp();d.updatedBy=devLabel();d.updatedTs=Date.now();
  if(!S.data[d.date]&&!d.status)d.status="draft";
  var empty=(d.rows||[]).length===0&&(d.expenses||[]).length===0&&(d.incomes||[]).length===0&&num(d.bankDeposit)===0;
  if(empty){if(S.data[d.date])queueOp("day",d.date,null);delete S.data[d.date]}else{S.data[d.date]=d;queueOp("day",d.date,JSON.parse(JSON.stringify(d)))}
  await persistDay(d.date);S.dirty=false;updateSyncPill();updateSaveBtn();}

/* ===== مزامنة Dropbox (الاستضافة على GitHub، والبيانات على دروبوكس) ===== */
var DBX={access:null,exp:0};
function dbxCfg(){return S.config.dropbox}
function redirectUri(){return location.origin+location.pathname}
function b64url(buf){var a=btoa(String.fromCharCode.apply(null,new Uint8Array(buf)));return a.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
async function sha256url(s){var b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return b64url(b)}
function randStr(n){var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";var u=crypto.getRandomValues(new Uint8Array(n));var s="";for(var i=0;i<n;i++)s+=c[u[i]%c.length];return s}
async function dbxConnect(){var g=dbxCfg();if(!g.appKey){toast("أدخل App Key من دروبوكس أولاً","err");return}
  if(!(window.crypto&&crypto.subtle)){toast("الربط يتطلب تشغيل التطبيق عبر رابط https (GitHub Pages)","err");return}
  var v=randStr(64);try{localStorage.setItem("dbx_v",v);localStorage.setItem("dbx_ak",g.appKey)}catch(e){}
  var ch=await sha256url(v);
  location.href="https://www.dropbox.com/oauth2/authorize?client_id="+encodeURIComponent(g.appKey)+"&response_type=code&code_challenge="+ch+"&code_challenge_method=S256&token_access_type=offline&redirect_uri="+encodeURIComponent(redirectUri());}
async function dbxExchange(code){var v,ak;try{v=localStorage.getItem("dbx_v");ak=localStorage.getItem("dbx_ak")}catch(e){}
  if(!v||!ak)throw new Error("no verifier");
  var body=new URLSearchParams({code:code,grant_type:"authorization_code",client_id:ak,code_verifier:v,redirect_uri:redirectUri()});
  var r=await fetch("https://api.dropboxapi.com/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:body});
  if(!r.ok)throw new Error("token "+r.status);var j=await r.json();
  S.config.dropbox.appKey=ak;S.config.dropbox.refreshToken=j.refresh_token||"";S.config.dropbox.enabled=true;
  DBX.access=j.access_token;DBX.exp=Date.now()+((j.expires_in||14400)-60)*1000;
  try{localStorage.removeItem("dbx_v")}catch(e){}await DB.set("dsr_config",S.config);}
async function dbxToken(){var g=dbxCfg();if(DBX.access&&Date.now()<DBX.exp)return DBX.access;
  if(!g.refreshToken)throw new Error("غير مرتبط");
  var body=new URLSearchParams({grant_type:"refresh_token",refresh_token:g.refreshToken,client_id:g.appKey});
  var r=await fetch("https://api.dropboxapi.com/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:body});
  if(!r.ok)throw new Error("refresh "+r.status);var j=await r.json();
  DBX.access=j.access_token;DBX.exp=Date.now()+((j.expires_in||14400)-60)*1000;return DBX.access;}
async function dbxUpload(path,content){var t=await dbxToken();
  var r=await fetch("https://content.dropboxapi.com/2/files/upload",{method:"POST",headers:{Authorization:"Bearer "+t,"Content-Type":"application/octet-stream","Dropbox-API-Arg":JSON.stringify({path:path,mode:"overwrite",mute:true})},body:content});
  if(!r.ok)throw new Error("upload "+r.status);return r.json();}
async function dbxDownload(path){var t=await dbxToken();
  var r=await fetch("https://content.dropboxapi.com/2/files/download",{method:"POST",headers:{Authorization:"Bearer "+t,"Dropbox-API-Arg":JSON.stringify({path:path})}});
  if(r.status===409)return null;if(!r.ok)throw new Error("download "+r.status);return r.text();}
function gatherPayload(){var g=dbxCfg();var cfg=JSON.parse(JSON.stringify(S.config));cfg.dropbox={appKey:g.appKey,refreshToken:"",enabled:g.enabled};cfg.cloudDirty=false;cfg.baseRev="";delete cfg.pendingOps;delete cfg.baseSnap;delete cfg.syncRev;
  return{app:"dsr",version:3,schema:SCHEMA_VERSION,appVersion:APP_VERSION,rev:num(S.config.syncRev)||0,exportedAt:nowStamp(),config:cfg,data:S.data};}
var CONFLICT_MSG="تتوفّر بيانات أحدث في السحابة. رجاءً حدّث ثم أعد المحاولة.";
/* =====================================================================
   طابور العمليات المعلّقة (Pending Operation Queue)
   - كل عملية = تغيير على "سجل" واحد: يوم (day:YYYY-MM-DD) أو إعداد (cfg:key).
   - نوع العملية: put (إنشاء/تعديل) أو del (حذف)، مع قيمة السجل الجديدة.
   - baseSnap = آخر نسخة سحابية معروفة (الأساس الذي بُنيت عليه العمليات).
   - عند التعارض: نُنزّل السحابة، نُعيد تطبيق العمليات فوقها سجلاً بسجل،
     ونرفع تلقائياً — ولا نسأل المستخدم إلا إذا عُدّل نفس السجل في الجهازين.
   ===================================================================== */
function ensureQueue(){if(!Array.isArray(S.config.pendingOps))S.config.pendingOps=[];if(!S.config.baseSnap)S.config.baseSnap=null;}
function snapForMerge(){return{data:JSON.parse(JSON.stringify(S.data)),config:cfgRecords(S.config)};}
/* السجلّات القابلة للدمج من الإعدادات (نتجاهل حقول المزامنة/الأوث المحلية) */
function cfgRecords(cfg){var c=JSON.parse(JSON.stringify(cfg));["dropbox","syncRev","cloudDirty","baseRev","baseSnap","pendingOps"].forEach(function(k){delete c[k]});return c;}
function queueOp(kind,id,value){ensureQueue();
  /* دمج العمليات المتتابعة على نفس السجل في عملية واحدة (آخر حالة) */
  S.config.pendingOps=S.config.pendingOps.filter(function(o){return !(o.kind===kind&&o.id===id)});
  S.config.pendingOps.push({kind:kind,id:id,op:(value===null?"del":"put"),value:value,at:Date.now()});
}
/* التقاط أساس سحابي عند كل مزامنة ناجحة (نقطة الانطلاق للدمج) */
function setBaseSnap(){ensureQueue();S.config.baseSnap=snapForMerge();}
/* تطبيق طابور العمليات على حالة أساس (obj={config,data}) → يعيد {applied, conflicts[]} */
function replayOps(baseObj,ops,force){
  var out={config:JSON.parse(JSON.stringify(baseObj.config||{})),data:JSON.parse(JSON.stringify(baseObj.data||{}))};
  var prevBase=(S.config.baseSnap)||{data:{},config:{}};
  var conflicts=[];
  ops.forEach(function(o){
    if(o.kind==="day"){
      var remoteNow=out.data[o.id]||null, remoteWasSame=JSON.stringify(remoteNow)===JSON.stringify(prevBase.data[o.id]||null);
      if(remoteWasSame||force){ if(o.op==="del")delete out.data[o.id]; else out.data[o.id]=o.value; if(!remoteWasSame)conflicts.push({kind:"day",id:o.id}); }
      else { conflicts.push({kind:"day",id:o.id}); }   /* نفس السجل عُدّل سحابياً وعندنا → تعارض حقيقي */
    } else if(o.kind==="cfg"){
      var key=o.id, curVal=(out.config||{})[key], baseVal=(prevBase.config||{})[key];
      var same=JSON.stringify(curVal)===JSON.stringify(baseVal);
      if(same||force){ out.config[key]=o.value; if(!same)conflicts.push({kind:"cfg",id:key}); } else { conflicts.push({kind:"cfg",id:key}); }
    }
  });
  return {merged:out, conflicts:conflicts};
}
/* المزامنة: عند تفعيل الـ Worker يُستخدم كالمصدر الأساسي مع قفل تفاؤلي، وإلا يعود لمسار Dropbox المباشر (توافقية) */
function scheduleDbx(){if(S._noPush)return;
  S.config.syncRev=Date.now();S.config.cloudDirty=true;DB.set("dsr_config",S.config);
  if(cloudOn()){if(S.dbxTimer)clearTimeout(S.dbxTimer);S.dbxTimer=setTimeout(cloudPush,1200);return;}
  var g=dbxCfg();if(!g||!g.enabled||!g.refreshToken)return;if(S.dbxTimer)clearTimeout(S.dbxTimer);S.dbxTimer=setTimeout(dbxPush,2600);}
function scheduleRetry(){if(S._retryTimer)clearTimeout(S._retryTimer);S._retryTimer=setTimeout(function(){if(cloudOn()&&(S.config.cloudDirty||(S.config.pendingOps||[]).length))cloudPush();},12000);}
/* غلاف بقفل أحادي (single-flight) يمنع تداخل عمليات المزامنة */
async function cloudPush(){if(!cloudOn())return;if(S._io){S._ioWant=true;return;}S._io=true;
  try{await cloudPushCore();}finally{S._io=false;if(S._ioWant){S._ioWant=false;setTimeout(function(){if(cloudOn()&&S.config.cloudDirty)cloudPush()},50);}}}
async function cloudPushCore(){setSync("busy");
  try{var payload=gatherPayload();var newRev=await cloudSave(payload,S.config.baseRev||"");
    S.config.baseRev=newRev;S.config.cloudDirty=false;S.sync.conflict=false;
    S.config.pendingOps=[];setBaseSnap();               /* رُفع بنجاح → أفرغ الطابور وثبّت الأساس */
    await DB.set("dsr_config",S.config);setSync("on");S.sync.last=nowStamp();hideConflictBanner();}
  catch(e){if(e&&e.conflict){await resolveConflict()}else{setSync("err");scheduleRetry();/* يبقى الطابور لإعادة المحاولة */}}}
/* عند 409: نزّل الأحدث، أعد تطبيق الطابور تلقائياً، وارفع — أو اسأل فقط عند تعارض نفس السجل */
async function resolveConflict(){
  setSync("busy");
  try{
    var res=await cloudLoad();var remoteRev=res.rev||"",obj=res.payload;
    var base={config:(obj&&obj.config)?cfgRecords(runMigrations(obj.config,obj.data||{},(obj&&obj.schema)||1).config):cfgRecords(S.config),
              data:(obj&&obj.data)?runMigrations(obj.config||{},obj.data,(obj&&obj.schema)||1).data:{}};
    ensureQueue();
    var rep=replayOps(base,S.config.pendingOps);
    if(rep.conflicts.length){                            /* نفس السجل عُدّل في الجهازين → قرار المستخدم */
      onCloudConflict(rep.conflicts);return;
    }
    /* دمج آمن: طبّق النتيجة على الحالة المحلية وارفع بنسخة الخادم الجديدة */
    var localDbx=S.config.dropbox;
    var mergedCfg=JSON.parse(JSON.stringify(S.config));
    Object.keys(rep.merged.config).forEach(function(k){mergedCfg[k]=rep.merged.config[k]});
    mergedCfg.dropbox=localDbx;S.config=mergedCfg;S.data=rep.merged.data;
    S.config.baseRev=remoteRev;
    var payload=gatherPayload();var newRev=await cloudSave(payload,remoteRev);
    S.config.baseRev=newRev;S.config.cloudDirty=false;S.sync.conflict=false;S.config.pendingOps=[];setBaseSnap();
    S._noPush=true;invalidateBal();await persistEverything();S._noPush=false;
    setSync("on");S.sync.last=nowStamp();hideConflictBanner();
    if(S.day&&S.data[S.day.date]){loadDay(S.day.date);}render();
    toast("تمت مزامنة تعديلاتك تلقائياً");
  }catch(e){ if(e&&e.conflict){ /* تغيّر الخادم مجدداً أثناء المحاولة → أعد الحلقة مرة */ setSync("err"); setTimeout(function(){if(!S.sync.conflict)cloudPull(true)},800); }
    else { setSync("err"); scheduleRetry(); } }
}
async function cloudPull(silent){if(!cloudOn())return;if(S._io){if(!silent)toast("المزامنة جارية…");return;}S._io=true;
  try{await cloudPullCore(silent);}finally{S._io=false;}}
async function cloudPullCore(silent){setSync("busy");
  try{var res=await cloudLoad();var remoteRev=res.rev||"",obj=res.payload,base=S.config.baseRev||"";
    if(obj&&obj.data){
      if(remoteRev&&base&&remoteRev===base){                 /* السحابة لم تتغيّر منذ نسختنا */
        if(S.config.cloudDirty){await cloudPushCore();}       /* تعديلاتنا آمنة → ارفعها (رفع ذرّي) */
        else{S.sync.conflict=false;setSync("on");S.sync.last=nowStamp();if(!silent)toast("أنت على أحدث نسخة")}
        return;
      }
      /* السحابة تغيّرت: إن كان لدينا عمليات معلّقة، ادمجها تلقائياً بدل التعارض اليدوي */
      ensureQueue();
      if((S.config.pendingOps||[]).length&&base){ await resolveConflict(); if(!silent&&!S.sync.conflict)render(); return; }
      var localDbx=S.config.dropbox;var cfg=obj.config||S.config;
      var mig=runMigrations(cfg,obj.data,(obj.schema||1));S.config=mig.config;S.config.dropbox=localDbx;
      S.config.baseRev=remoteRev;S.config.cloudDirty=false;S.sync.conflict=false;S.data=mig.data;S.config.pendingOps=[];
      S._noPush=true;invalidateBal();await persistEverything();S._noPush=false;setBaseSnap();
      await DB.set("dsr_meta",{schema:SCHEMA_VERSION,appVersion:APP_VERSION,updatedAt:nowStamp()});
      hideConflictBanner();
    } else {                                                  /* لا يوجد ملف سحابي بعد (أول استخدام) */
      S.config.baseRev="";if(S.config.cloudDirty){await cloudPushCore();}
    }
    setSync("on");S.sync.last=nowStamp();if(!silent){toast("تم التحديث من السحابة");S.day=null;render();}
  }catch(e){S._noPush=false;setSync("err");if(!silent)toast("تعذّر الاتصال بالسحابة","err")}}
function onCloudConflict(records){S.sync.conflict=true;S.config.cloudDirty=true;S.sync.conflictRecords=records||[];DB.set("dsr_config",S.config);setSync("err");showConflictBanner(records);}
function showConflictBanner(records){var old=document.getElementById("cfltBar");if(old)old.remove();
  var list=(records||[]).map(function(r){return r.kind==="day"?prettyDate(r.id):r.id}).filter(Boolean);
  var extra=list.length?(" (السجلات: "+list.slice(0,3).join("، ")+(list.length>3?"…":"")+")"):"";
  var b=document.createElement("div");b.id="cfltBar";b.className="updbar cflt";
  b.innerHTML="<span>"+IC.cloud+" عُدّل نفس السجل من جهازين"+extra+". "+CONFLICT_MSG+"</span><span class='updacts'><button class='u-now' onclick='App.cloudKeepMine()'>اعتمد تعديلي</button><button class='u-x' onclick='App.cloudResolveRefresh()'>اعتمد السحابة</button></span>";
  document.body.appendChild(b);}
function hideConflictBanner(){var b=document.getElementById("cfltBar");if(b)b.remove();}
async function dbxPush(){var g=dbxCfg();if(!g.enabled||!g.refreshToken)return;setSync("busy");
  try{var rev=Date.now();S.config.syncRev=rev;await DB.set("dsr_config",S.config);var payload=gatherPayload();payload.rev=rev;await dbxUpload("/DailyReport/data.json",JSON.stringify(payload,null,2));setSync("on");S.sync.last=nowStamp();}catch(e){setSync("err")}}
async function dbxPull(silent){var g=dbxCfg();if(!g.refreshToken){if(!silent)toast("غير مرتبط بدروبوكس","err");return}setSync("busy");
  try{var txt=await dbxDownload("/DailyReport/data.json");
    if(txt){var obj=JSON.parse(txt);if(obj&&obj.data){
      var remoteRev=num(obj.rev)||0,localRev=num(S.config.syncRev)||0;
      if(remoteRev&&remoteRev<=localRev){setSync("on");S.sync.last=nowStamp();if(!silent)toast("أنت على أحدث نسخة");return;}
      var localDbx=g;var cfg=obj.config||S.config;cfg.dropbox=localDbx;
      var mig=runMigrations(cfg,obj.data,(obj.schema||1));S.config=mig.config;S.data=mig.data;S.config.syncRev=remoteRev||Date.now();
      S._noPush=true;invalidateBal();await persistEverything();S._noPush=false;
      await DB.set("dsr_meta",{schema:SCHEMA_VERSION,appVersion:APP_VERSION,updatedAt:nowStamp()});
    }}
    setSync("on");S.sync.last=nowStamp();if(!silent){toast("تم السحب من دروبوكس");S.day=null;render();}
  }catch(e){S._noPush=false;setSync("err");if(!silent)toast("تعذّر السحب: "+e.message,"err")}}
async function dbxBackup(){var g=dbxCfg();if(!g.refreshToken){toast("اربط دروبوكس أولاً","err");return}
  try{await dbxUpload("/DailyReport/backups/backup-"+todayISO()+"-"+Date.now()+".json",JSON.stringify(gatherPayload(),null,2));toast("تم حفظ نسخة في دروبوكس")}catch(e){toast("تعذّر الحفظ: "+e.message,"err")}}
function setSync(st){S.sync.status=st;updateSyncPill()}
function updateSyncPill(){var el=document.getElementById("syncPill");if(!el)return;
  var st=syncState();el.className="sync-pill"+(st.cls?" "+st.cls:"");
  var dot=el.querySelector(".sync-dot");if(dot)dot.className="sync-dot"+(st.dot?" "+st.dot:"");
  var txt=el.querySelector("span:last-child");if(txt)txt.textContent=st.text;}

/* أيقونات */
var LOGO_SVG='<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="شعار التطبيق"><rect width="48" height="48" rx="13" fill="#173A31"/><rect x="12" y="35.4" width="24" height="2.4" rx="1.2" fill="#3A5C50"/><path d="M13 30.5 L21 24 L27 27.2 L35 17.5" fill="none" stroke="#AF8228" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="35" cy="17.5" r="3.2" fill="#D9B45C" stroke="#173A31" stroke-width="1.3"/><circle cx="13" cy="30.5" r="2" fill="#AF8228"/></svg>';
function installIcons(){try{var uri="data:image/svg+xml,"+encodeURIComponent(LOGO_SVG);
  if(!document.querySelector("link[rel='icon']")){var l=document.createElement("link");l.rel="icon";l.type="image/svg+xml";l.href=uri;document.head.appendChild(l);}
  if(!document.querySelector("meta[name='theme-color']")){var tc=document.createElement("meta");tc.name="theme-color";tc.content="#173A31";document.head.appendChild(tc);}
  if(!document.querySelector("link[rel='manifest']")){var man={name:"نظام تقارير اليومية",short_name:"اليومية",start_url:".",display:"standalone",background_color:"#F3EFE6",theme_color:"#173A31",icons:[{src:uri,sizes:"any",type:"image/svg+xml"}]};
    var ml=document.createElement("link");ml.rel="manifest";ml.href="data:application/json,"+encodeURIComponent(JSON.stringify(man));document.head.appendChild(ml);}}catch(e){}}
var IC={
  dash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  entry:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  report:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="7"/><rect x="12" y="6" width="3" height="11"/><rect x="17" y="13" width="3" height="4"/></svg>',
  branch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/></svg>',
  data:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/></svg>',
  chevR:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 18l-6-6 6-6"/></svg>',
  chevL:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 18l6-6-6-6"/></svg>',
  chevD:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg>',
  chevU:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 15l6-6 6 6"/></svg>',
  grip:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21V9M7 14l5-5 5 5M5 3h14"/></svg>',
  print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z"/></svg>',
  save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.3A5 5 0 1 0 7 12a4 4 0 0 0-1 8h12a4 4 0 0 0 1-8Z"/></svg>',
  folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-1"/></svg>',
  redo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h1"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>'
};
function h(tag,attrs,inner){var a="";for(var k in attrs)if(attrs[k]!=null)a+=" "+k+'="'+attrs[k]+'"';return"<"+tag+a+">"+(inner||"")+"</"+tag+">"}
function toast(msg,kind){var t=document.createElement("div");t.className="toast"+(kind==="err"?" err":"");t.textContent=msg;document.body.appendChild(t);
  setTimeout(function(){if(t.classList)t.classList.add("out")},2450);
  setTimeout(function(){t.remove()},2800)}
function secHead(eye,title){return h("div",{class:"sec-head"},(eye?"<div class='eyebrow'>"+esc(eye)+"</div>":"")+"<h2>"+esc(title)+"</h2>")}
function cardHead(t,sub){return h("div",{class:"card-head"},"<span>"+t+"</span>"+(sub?"<span class='sub'>"+sub+"</span>":""))}
function kpi(lbl,val,unit,cls){return h("div",{class:"kpi "+cls},"<div class='lbl'>"+esc(lbl)+"</div><div class='val'>"+val+(unit?"<u>"+unit+"</u>":"")+"</div>")}
function emptyState(title,body,actions){var btns=(actions||[]).map(function(a){return "<button class='btn"+(a[2]?"":" ghost")+"' onclick=\""+a[1]+"\">"+esc(a[0])+"</button>"}).join("");
  return h("div",{class:"card empty"},"<div class='ic'>"+IC.entry+"</div><h3>"+esc(title)+"</h3><p>"+esc(body)+"</p><div style='display:flex;gap:10px;justify-content:center;flex-wrap:wrap'>"+btns+"</div>")}

/* ===== الرسم العام ===== */
/* ===== محرك القوائم المنسدلة المخصصة =====
   القيم لا تُحقن في onclick إطلاقاً (أسماء الفروع قد تحوي علامات اقتباس) —
   تُسجَّل في سجل ويُمرَّر فهرس رقمي فقط. السجل يُصفَّر مع كل render. */
var _ddReg=[];
function ddBtn(handler,options,selVal,opts){
  opts=opts||{};var multi=!!opts.multi;
  var idx=_ddReg.length;_ddReg.push({h:handler,pre:opts.pre||[],vals:options.map(function(o){return o[0]}),multi:multi});
  function isSel(v){if(multi){var a=selVal||[];return v==="__all"?a.length===0:a.indexOf(v)>=0}return String(v)===String(selVal)}
  var lbl=opts.label!=null?opts.label:(opts.placeholder||"اختر");
  if(opts.label==null)options.forEach(function(o){if(isSel(o[0])&&o[0]!=="__all")lbl=o[1]});
  var items=options.map(function(o,j){var is=isSel(o[0]);
    return "<button class='dditem"+(is?" sel":"")+"' onclick='App.ddPick("+idx+","+j+")'><span class='ck'>"+(is?"✓":"")+"</span>"+esc(String(o[1]))+"</button>"}).join("");
  var openCls=(opts.id&&S._ddOpen===opts.id)?" open":"";
  return "<span class='dd"+openCls+"'"+(opts.id?" data-dd='"+opts.id+"'":"")+"><button class='ddbtn' type='button' onclick='App.ddToggle(this)'><span>"+esc(String(lbl))+"</span>"+IC.chevD+"</button><div class='ddmenu'>"+items+"</div></span>";
}
function setupDD(){
  document.addEventListener("click",function(e){
    if(e.target&&e.target.closest&&e.target.closest(".dd"))return;
    S._ddOpen=null;
    Array.prototype.forEach.call(document.querySelectorAll(".dd.open"),function(x){x.classList.remove("open")});
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){S._ddOpen=null;Array.prototype.forEach.call(document.querySelectorAll(".dd.open"),function(x){x.classList.remove("open")})}
  });
}

/* ===== حقول المبالغ الذكية: أرقام فقط + صيغ (=200+300) تُحتسب فوراً =====
   الصيغة لا تُخزَّن أبداً — تُقيَّم لحظياً وتُحفظ النتيجة الرقمية فقط (لا تغيير في نموذج البيانات/المزامنة).
   التقييم بمحلل يدوي آمن (بلا eval): + - * / وأقواس وسالب أحادي. */
function sanitizeAmt(el){var v=String(el.value||"");
  var t=v.replace(/[٠-٩]/g,function(d){return String("٠١٢٣٤٥٦٧٨٩".indexOf(d))}).replace(/[^0-9=+\-*/().]/g,"");
  var eq=t.indexOf("=");
  if(eq>0)t=t.replace(/=/g,"");
  else if(eq===0)t="="+t.slice(1).replace(/=/g,"");
  if(t!==v){var p=el.selectionStart;el.value=t;if(el.setSelectionRange&&typeof p==="number"){try{el.setSelectionRange(Math.min(p,t.length),Math.min(p,t.length))}catch(e){}}}
  return t}
function evalExpr(src){var s=String(src||"");if(s.charAt(0)!=="=")return null;s=s.slice(1);
  if(!s||!/^[0-9+\-*/().]*$/.test(s))return null;
  var i=0;
  function rdNum(){var st=i,dot=false;while(i<s.length&&((s[i]>="0"&&s[i]<="9")||(s[i]==="."&&!dot))){if(s[i]===".")dot=true;i++}return i>st?parseFloat(s.slice(st,i)):NaN}
  function factor(){if(s[i]==="("){i++;var v=expr();if(s[i]!==")")return NaN;i++;return v}
    if(s[i]==="+"){i++;return factor()}
    if(s[i]==="-"){i++;return -factor()}
    return rdNum()}
  function term(){var v=factor();while(s[i]==="*"||s[i]==="/"){var c=s[i];i++;var r=factor();v=(c==="*")?v*r:v/r}return v}
  function expr(){var v=term();while(s[i]==="+"||s[i]==="-"){var c=s[i];i++;var r=term();v=(c==="+")?v+r:v-r}return v}
  var v=expr();
  if(i<s.length||!isFinite(v))return null;
  return Math.round(v*100)/100}
function _fxMark(el,fx){if(el.classList)el.classList.toggle("fx",!!fx);
  var p=el.parentNode;if(p&&p.classList&&String(p.className||"").indexOf("box")>=0)p.classList.toggle("fx",!!fx)}
/* أثناء الكتابة: يعقّم، يقيّم الصيغة إن وُجدت، يعيد القيمة الرقمية للتخزين ويلوّن الحقل */
function amtRead(el){var t=sanitizeAmt(el);var fx=t.charAt(0)==="=";var store;
  if(fx){var v=evalExpr(t);store=(v==null)?"":String(v);el.title=(v==null)?"صيغة غير مكتملة":("= "+fmt(v))}
  else{store=t;el.title=""}
  _fxMark(el,fx);return store}
/* عند مغادرة الحقل: تتحول الصيغة الظاهرة إلى نتيجتها الرقمية */
function amtSettle(el){if(String(el.value||"").charAt(0)!=="="){_fxMark(el,false);return null}
  var v=evalExpr(el.value);_fxMark(el,false);el.title="";
  el.value=(v==null)?"":String(v);return el.value}

/* التركيز على حقل مبلغ صف مصروف/إيراد بعد إعادة الرسم */
function focusItem(kind,i){setTimeout(function(){try{
  var el=document.querySelector(".exp-row input[data-k='"+kind+"'][data-i='"+i+"'][data-f='amount']");
  if(el){el.focus();if(el.select)el.select()}
}catch(e){}},40)}

/* التركيز على خلية «المبيعات» لصف معيّن في جدول الإدخال */
function focusCell(rid){setTimeout(function(){try{
  var el=document.querySelector(".amt[data-r='"+rid+"'][data-f='sales']");
  if(el){el.focus();if(el.select)el.select();if(el.scrollIntoView)el.scrollIntoView({block:"nearest"})}
}catch(e){}},40)}

function devLabel(){try{var n=localStorage.getItem("dsr_dev_name");if(n&&n.trim())return n.trim();
  var id=localStorage.getItem("dsr_dev_id");if(!id){id=Math.random().toString(36).slice(2,6);localStorage.setItem("dsr_dev_id",id)}
  return "جهاز-"+id}catch(e){return "جهاز"}}
function dayWarnings(d,cfg,c,prev){var w=[];
  (d.rows||[]).forEach(function(r){
    var non=cfg.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);
    var rc=num(r.sales)-non;
    if(rc<0)w.push("نقد سالب في صف «"+(r.branch||"بدون فرع")+"» ("+fmt(rc)+")");
    if(!r.branch&&(num(r.sales)||non))w.push("صف بقيم دون تحديد فرع");
  });
  if(num(d.bankDeposit)>prev+c.cash)w.push("الإيداع البنكي ("+fmt(d.bankDeposit)+") أكبر من النقد المتاح ("+fmt(prev+c.cash)+")");
  if(prev+c.cash-num(d.bankDeposit)<0)w.push("باقي الرصيد سالب ("+fmt(prev+c.cash-num(d.bankDeposit))+")");
  return w;}
function dayAudit(d){var vals=[];var v=d.verify||{},t=d.tmarks||{};
  Object.keys(v).forEach(function(k){vals.push(v[k])});Object.keys(t).forEach(function(k){vals.push(t[k])});
  if(!vals.length)return "";return vals.indexOf("r")>=0?"r":"g";}
function auditBadge(d){var a=dayAudit(d);if(!a)return "";
  return a==="g"?"<span class='abdg g' title='تحقق مكتمل'>✓</span>":"<span class='abdg r' title='توجد علامات خطأ'>✕</span>";}
function draftBadge(d){return d.status==="draft"?"<span class='dbdg'>مسودة</span>":""}
function eGuard(){if(S.day&&S.day.locked){toast("اليومية مقفلة بعد الطباعة — اضغط «فتح للتعديل» أولاً","err");return true}return false}
function syncState(){var g=dbxCfg();var active=cloudOn()||g.enabled;var label=cloudOn()?"سحابياً":"(دروبوكس)";
  var pend=(S.config&&S.config.pendingOps?S.config.pendingOps.length:0);
  if(typeof navigator!=="undefined"&&navigator&&navigator.onLine===false)
    return {cls:"s-busy",dot:"busy",text:"غير متصل"+(pend?" · بانتظار الرفع: "+pend:"")};
  if(!active)return {cls:"",dot:"",text:"بدون مزامنة"};
  if(S.sync.conflict)return {cls:"s-err",dot:"err",text:"تعارض — حدّث"};
  if(S.sync.status==="busy")return {cls:"s-busy",dot:"busy",text:"مزامنة…"};
  if(S.sync.status==="err")return {cls:"s-err",dot:"err",text:"تعذّرت المزامنة"+(pend?" · معلّق: "+pend:"")};
  return {cls:"s-on",dot:"on",text:S.dirty?"جارٍ الحفظ "+label:"متزامن "+label};}
async function backupNow(silent){
  if(!cloudOn()){if(!silent)toast("النسخ السحابي يتطلب المزامنة السحابية","err");return false}
  try{
    var r=await fetch(CLOUD_API+"/backup",{method:"POST",headers:cloudHeaders({"Content-Type":"application/json"}),body:JSON.stringify(gatherPayload())});
    if(r.ok){var st=nowStamp();try{localStorage.setItem("dsr_bk_day",todayISO());localStorage.setItem("dsr_bk_at",st)}catch(e){}
      if(!silent)toast("حُفظت نسخة احتياطية في Dropbox › DailyReport › backups");
      var el=document.getElementById("bkLine");if(el)el.textContent="آخر نسخة: "+st;return true}
  }catch(e){}
  if(!silent)toast("تعذّر إنشاء النسخة الاحتياطية","err");return false;}
function scheduleDailyBackup(){try{
  if(!cloudOn())return;var last=localStorage.getItem("dsr_bk_day");
  if(last===todayISO())return;
  setTimeout(function(){backupNow(true)},6000);
}catch(e){}}

/* ===== سجل التنقل (زر الرجوع العام) ===== */
var _nav=[],_navScroll=null;
function navPush(){try{_nav.push({view:S.view,curDate:S.curDate,reportTab:S.reportTab,rMonth:S._rMonth,year:S._year,scroll:(typeof scrollY==="number"?scrollY:0)});if(_nav.length>30)_nav.shift();}catch(e){}}
/* قائمة الأيام التي سيتنقّل عبرها تقرير اليوم (حسب الفلاتر الحالية وقت الفتح) */
function currentDayContext(){
  try{
    if(S.view==="reports"&&S.reportTab==="monthly"&&S._rMonth)return Object.keys(S.data).filter(function(d){return ymOf(d)===S._rMonth}).sort();
    if(S.view==="reports"&&S.reportTab==="custom"){var r=rfRange();return Object.keys(S.data).filter(function(d){return d>=r.from&&d<=r.to}).sort();}
    if(S.view==="reports"&&S.reportTab==="items"){var r2=itRange();return Object.keys(S.data).filter(function(d){return d>=r2.from&&d<=r2.to}).sort();}
    if(S.view==="dashboard"){var rr=dashRange();return Object.keys(S.data).filter(function(d){return d>=rr.from&&d<=rr.to}).sort();}
  }catch(e){}
  return Object.keys(S.data).sort();
}
function dayNavList(){var l=(S._navList&&S._navList.length)?S._navList.filter(function(d){return !!S.data[d]}):Object.keys(S.data).sort();if(l.indexOf(S.curDate)<0)l=Object.keys(S.data).sort();return l;}

/* ===== أعمدة قابلة لتغيير العرض (تُحفظ محلياً على هذا الجهاز) ===== */
var _colW=null;
function loadColW(){if(_colW)return _colW;try{_colW=JSON.parse(localStorage.getItem("dsr_colw")||"{}")}catch(e){_colW={}}if(!_colW||typeof _colW!=="object")_colW={};return _colW}
function saveColW(){try{localStorage.setItem("dsr_colw",JSON.stringify(_colW||{}))}catch(e){}}
function applyColWidths(){var t=document.getElementById("entryTbl");if(!t)return;var w=loadColW();var ths=t.querySelectorAll("thead th");var any=false;
  Array.prototype.forEach.call(ths,function(x){var k=x.getAttribute("data-col");if(k&&w[k])any=true});
  if(!any)return;
  /* ثبّت العرض الطبيعي لكل الأعمدة أولاً (بما فيها عمود الأدوات) — تحت table-layout:fixed
     أي عمود بلا عرض صريح يُمنح "المتبقي" وقد ينسحق للصفر، وهذا ما كان يخفي أزرار الصف */
  Array.prototype.forEach.call(ths,function(x){if(x.offsetWidth)x.style.width=x.offsetWidth+"px"});
  Array.prototype.forEach.call(ths,function(x){var k=x.getAttribute("data-col");if(k&&w[k])x.style.width=w[k]+"px"});
  t.classList.add("fixedcols");}
function setupColResize(){
  document.addEventListener("pointerdown",function(e){
    var g=e.target&&e.target.closest?e.target.closest(".cgrip"):null;if(!g)return;
    var th=g.parentNode,t=document.getElementById("entryTbl");if(!t||!th)return;
    e.preventDefault();e.stopPropagation();
    var allTh=t.querySelectorAll("thead th");
    if(!t.classList.contains("fixedcols")){Array.prototype.forEach.call(allTh,function(x){if(x.offsetWidth)x.style.width=x.offsetWidth+"px"});t.classList.add("fixedcols");}
    var startX=e.clientX,startW=th.offsetWidth;g.classList.add("on");
    function mv(ev){var w=Math.max(46,Math.round(startW+(startX-ev.clientX)));th.style.width=w+"px"}   /* RTL: السحب لليسار = توسيع */
    function up(){g.classList.remove("on");document.removeEventListener("pointermove",mv);document.removeEventListener("pointerup",up);
      var w=loadColW();Array.prototype.forEach.call(allTh,function(x){var k=x.getAttribute("data-col");if(k&&x.offsetWidth)w[k]=x.offsetWidth});_colW=w;saveColW();}
    document.addEventListener("pointermove",mv);document.addEventListener("pointerup",up);
  });
  document.addEventListener("dblclick",function(e){var g=e.target&&e.target.closest?e.target.closest(".cgrip"):null;if(!g)return;
    var th=g.parentNode;var k=th.getAttribute("data-col");if(!k)return;var w=loadColW();delete w[k];_colW=w;saveColW();th.style.width="";toast("أُعيد عرض العمود للوضع التلقائي");});
}

/* ===== البحث الشامل في كل السجلات ===== */
function gsResults(q){
  q=nrm(q);if(!q)return "";
  var res=[],total=0,dates=Object.keys(S.data).sort().reverse();
  function hit(t,cls,d,label,sub){total++;if(res.length<40)res.push("<button class='gsrow' onclick=\"App.openDay('"+d+"')\"><span class='gstag "+cls+"'>"+t+"</span><b>"+esc(label)+"</b><span class='gssub'>"+esc(sub||"")+"</span><span class='gsdate'>"+prettyDate(d)+"</span></button>")}
  dates.forEach(function(d){var day=S.data[d];
    if(nrm(prettyDate(d)).indexOf(q)>=0||d.indexOf(q)>=0)hit("يومية","",d,prettyDate(d),"فتح تقرير اليوم");
    (day.rows||[]).forEach(function(r){
      if(r.branch&&nrm(r.branch).indexOf(q)>=0)hit("فرع","t-br",d,r.branch,"مبيعات: "+fmt(r.sales));
      if(r.notes&&nrm(r.notes).indexOf(q)>=0)hit("ملاحظة","",d,r.notes,(r.branch||""));
      if(r.sales!=null&&String(r.sales).indexOf(q)>=0)hit("مبلغ","",d,fmt(r.sales),"مبيعات "+(r.branch||""));
    });
    (day.expenses||[]).forEach(function(e){
      if((e.details&&nrm(e.details).indexOf(q)>=0)||(e.amount!=null&&String(e.amount).indexOf(q)>=0))hit("مصروف","t-exp",d,e.details||fmt(e.amount),fmt(e.amount)+" ر.س");
    });
    (day.incomes||[]).forEach(function(e){
      if((e.details&&nrm(e.details).indexOf(q)>=0)||(e.amount!=null&&String(e.amount).indexOf(q)>=0))hit("إيراد","t-inc",d,e.details||fmt(e.amount),fmt(e.amount)+" ر.س");
    });
    if(day.bankDeposit!=null&&String(day.bankDeposit).indexOf(q)>=0&&num(day.bankDeposit))hit("إيداع بنكي","",d,fmt(day.bankDeposit),"الإيداع البنكي");
  });
  if(!total)return "<div class='emptyline'>لا نتائج مطابقة</div>";
  return res.join("")+"<div class='gscount'>"+total+" نتيجة"+(total>40?" · تُعرض أول 40 — دقّق البحث":"")+"</div>";
}

/* ===== تقرير المصروفات والإيرادات (فلترة + طباعة) ===== */
function itRange(){var f=S.it.from||monthStart(ymOf(todayISO()));var t=S.it.to||monthEnd(ymOf(todayISO()));return{from:f,to:t}}
function itemsCalc(){var r=itRange(),type=S.it.type||"both",list=[],te=0,ti=0;
  Object.keys(S.data).filter(function(d){return d>=r.from&&d<=r.to}).sort().forEach(function(d){var day=S.data[d];
    if(type!=="inc")(day.expenses||[]).forEach(function(e){list.push({d:d,k:"exp",amount:num(e.amount),details:e.details||""});te+=num(e.amount)});
    if(type!=="exp")(day.incomes||[]).forEach(function(e){list.push({d:d,k:"inc",amount:num(e.amount),details:e.details||""});ti+=num(e.amount)});});
  return {r:r,type:type,list:list,te:te,ti:ti};}
function itemsTableHTML(cc,forPrint){
  var list=forPrint?cc.list.filter(itemHas):cc.list;
  var rows=list.map(function(x){var tag=x.k==="exp"?"<span style='color:var(--neg);font-weight:700'>مصروف</span>":"<span style='color:var(--pos);font-weight:700'>إيراد</span>";
    if(forPrint)tag=x.k==="exp"?"مصروف":"إيراد";
    return "<tr"+(forPrint?"":" class='clk' onclick=\"App.openDay('"+x.d+"')\"")+"><td>"+prettyDate(x.d)+"</td><td>"+tag+"</td><td>"+esc(x.details||"—")+"</td><td class='num' style='font-weight:700'>"+(forPrint?pf(x.amount):fmt(x.amount))+"</td></tr>"}).join("");
  var tot="";
  if(cc.type!=="inc")tot+="<tr class='total'><td colspan='3'>اجمالي المصروفات</td><td class='num'>"+fmt(cc.te)+"</td></tr>";
  if(cc.type!=="exp")tot+="<tr class='total'><td colspan='3'>اجمالي الإيرادات</td><td class='num'>"+fmt(cc.ti)+"</td></tr>";
  if(cc.type==="both")tot+="<tr class='total'><td colspan='3'>الصافي (إيرادات − مصروفات)</td><td class='num'>"+fmt(cc.ti-cc.te)+"</td></tr>";
  return "<table"+(forPrint?" class='p-tbl'":"")+"><thead><tr><th>التاريخ</th><th>النوع</th><th>التفاصيل</th><th>المبلغ</th></tr></thead><tbody>"+(rows||"<tr><td colspan='4' class='emptyline'>لا بنود في هذه الفترة</td></tr>")+tot+"</tbody></table>";}
function repItems(){
  var cc=itemsCalc();
  var typeSel=ddBtn("itType",[["both","المصروفات والإيرادات"],["exp","المصروفات فقط"],["inc","الإيرادات فقط"]],cc.type);
  var bar=h("div",{class:"filterbar"},
    "<label class='fld'><span>النوع</span>"+typeSel+"</label>"+
    "<label class='fld'><span>من تاريخ</span>"+dateBtn("itFrom",cc.r.from)+"</label>"+
    "<label class='fld'><span>إلى تاريخ</span>"+dateBtn("itTo",cc.r.to)+"</label>"+
    "<button class='btn brass' onclick='App.printItems()'>"+IC.print+" طباعة (حسب الفلترة)</button>");
  var kpis=h("div",{class:"grid kpis"},kpi("عدد البنود",cc.list.length,"","")+ (cc.type!=="inc"?kpi("المصروفات",fmt(cc.te),"ر.س","neg"):"")+(cc.type!=="exp"?kpi("الإيرادات",fmt(cc.ti),"ر.س","pos"):"")+(cc.type==="both"?kpi("الصافي",fmt(cc.ti-cc.te),"ر.س","brass"):""));
  return bar+kpis+h("div",{class:"card"},cardHead("بنود المصروفات والإيرادات","التصفية باليوم (اضغط أي بند لفتح تقرير يومه) · لا يُخزَّن وقت للبنود")+"<div class='tw'>"+itemsTableHTML(cc,false)+"</div>");
}

/* ===== طباعة تقرير عام (بترويسة المنشأة) — تطبع المعروض بعد الفلترة فقط ===== */
function pf(v){var n=num(v);return n?fmt(n):""}   /* تنسيق طباعة: القيم الصفرية لا تُطبع */
function itemHas(e){return !!(num(e.amount)||String(e.details||"").trim())}   /* بند غير فارغ */
function printReport(title,sub,inner,widthHint){
  var cfg=S.config;var logoEl=cfg.companyLogo?"<img class='plogo' src='"+cfg.companyLogo+"'>":"<div class='plogo-ph'>"+LOGO_SVG+"</div>";
  var html="<div class='p-wrap'><div class='p-head'><div class='brandcol'>"+logoEl+"<div><h2>"+esc(cfg.businessName)+"</h2><div class='sd'>"+title+(sub?" — "+sub:"")+"</div></div></div><div class='meta'>طُبع: "+nowStamp()+"</div></div>"+inner+"</div>";
  var root=document.getElementById("printroot");root.innerHTML=html;
  fitPrint(root,widthHint||6);
  setTimeout(function(){window.print()},80);}
function printItems(){var cc=itemsCalc();var n=cc.list.filter(itemHas).length;
  var typeLbl=cc.type==="exp"?"المصروفات فقط":cc.type==="inc"?"الإيرادات فقط":"المصروفات والإيرادات";
  printReport("تقرير المصروفات والإيرادات",prettyDate(cc.r.from)+" ← "+prettyDate(cc.r.to)+" · "+typeLbl+" · "+n+" بند",itemsTableHTML(cc,true),4);}
function printCustom(){var cc=customCalc();if(!cc.days.length){toast("لا بيانات في هذه الفترة","err");return}
  var head="<th>#</th><th>التاريخ</th><th>المبيعات</th>"+cc.methods.map(function(m){return "<th>"+esc(m.label)+"</th>"}).join("")+"<th>النقد</th>"+(cc.all?"<th>المصروفات</th><th>الإيرادات</th><th>باقي الرصيد</th>":"");
  var rows=cc.per.map(function(p){var extra=cc.all?("<td class='num'>"+pf(p.exp)+"</td><td class='num'>"+pf(p.inc)+"</td><td class='num'>"+pf(p.car)+"</td>"):"";
    return "<tr><td class='num'>"+dayNo(p.d)+"</td><td>"+prettyDate(p.d)+"</td><td class='num'>"+pf(p.sales)+"</td>"+cc.methods.map(function(m){return "<td class='num'>"+pf(p.bm[m.id])+"</td>"}).join("")+"<td class='num'>"+pf(p.cash)+"</td>"+extra+"</tr>"}).join("");
  var tot="<tr class='total'><td colspan='2'>الإجمالي</td><td class='num'>"+pf(cc.T.sales)+"</td>"+cc.methods.map(function(m){return "<td class='num'>"+pf(cc.TM[m.id])+"</td>"}).join("")+"<td class='num'>"+pf(cc.T.cash)+"</td>"+(cc.all?"<td class='num'>"+pf(cc.T.exp)+"</td><td class='num'>"+pf(cc.T.inc)+"</td><td></td>":"")+"</tr>";
  var sub=prettyDate(cc.r.from)+" ← "+prettyDate(cc.r.to)+" · "+esc(cc.label)+" · "+cc.days.length+" يوم";
  printReport("تقرير مخصّص",sub,"<table class='p-tbl'><thead><tr>"+head+"</tr></thead><tbody>"+rows+tot+"</tbody></table>",cc.methods.length+(cc.all?2:0));}
function printMonthDays(){var mk=S._rMonth||monthList().pop();var days=Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).sort();
  if(!days.length){toast("لا بيانات في هذا الشهر","err");return}
  openConfirm({title:"طباعة أيام الشهر ("+days.length+" يوماً)؟",body:"سيُطبع كل يوم كتقرير يومية مستقل في صفحته، وتُختم الأيام كمطبوعة ومقفلة (يمكن فتح أي يوم لاحقاً للتعديل).",confirm:"طباعة الدفعة",onOk:function(){(async function(){
    var bal=balances(),cfg=S.config,stamp=nowStamp(),pages="";
    days.forEach(function(dd){var day=S.data[dd];var c=computeDay(day,cfg);
      day.printedAt=stamp;day.locked=true;day.status="approved";
      if(S.day&&S.day.date===dd){S.day.printedAt=stamp;S.day.locked=true;S.day.status="approved"}
      pages+="<div class='p-page'>"+dayPrintInner(day,cfg,c,bal[dd].prev,bal[dd].carried)+"</div>";});
    await persistEverything();updateSyncPill();
    var root=document.getElementById("printroot");root.innerHTML=pages;
    fitPrint(root,cfg.methods.length,true);
    setTimeout(function(){window.print();render()},120);
  })()}})}
function printMonth(){var mk=S._rMonth||monthList().pop();var days=Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).sort(),bal=balances();if(!days.length){toast("لا بيانات في هذا الشهر","err");return}
  var t={sales:0,cash:0,exp:0,inc:0};
  var rows=days.map(function(d){var c=computeDay(S.data[d],S.config);t.sales+=c.sales;t.cash+=c.cash;t.exp+=c.totalExpenses;t.inc+=c.totalIncome;
    return "<tr><td class='num'>"+dayNo(d)+"</td><td>"+prettyDate(d)+"</td><td class='num'>"+pf(c.sales)+"</td><td class='num'>"+pf(c.cash)+"</td><td class='num'>"+pf(c.bankDeposit)+"</td><td class='num'>"+pf(c.totalExpenses)+"</td><td class='num'>"+pf(c.totalIncome)+"</td><td class='num'>"+pf(c.cashTotal)+"</td><td class='num'>"+pf(bal[d].carried)+"</td></tr>"}).join("");
  var tot="<tr class='total'><td colspan='2'>الإجمالي</td><td class='num'>"+pf(t.sales)+"</td><td class='num'>"+pf(t.cash)+"</td><td></td><td class='num'>"+pf(t.exp)+"</td><td class='num'>"+pf(t.inc)+"</td><td></td><td></td></tr>";
  printReport("التقرير الشهري",prettyMonth(mk)+" · "+days.length+" يوم","<table class='p-tbl'><thead><tr><th>#</th><th>التاريخ</th><th>المبيعات</th><th>النقد</th><th>الإيداع</th><th>المصروفات</th><th>الإيرادات</th><th>الإجمالي النقدي</th><th>باقي الرصيد</th></tr></thead><tbody>"+rows+tot+"</tbody></table>",6);}

var KIOSK=false;try{KIOSK=/[?&]view=summary/.test(location.search)}catch(e){}
function kioskRender(){
  var ks=Object.keys(S.data).sort();var d=ks.length?ks[ks.length-1]:null;
  var body;
  if(!d){body="<div class='card'><div class='emptyline'>لا بيانات بعد</div></div>"}
  else{var day=S.data[d],c=computeDay(day,S.config),bal=balances();
    var rows=(day.rows||[]).filter(function(r){return r.branch}).map(function(r){var non=S.config.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);
      return "<tr><td style='font-weight:700'>"+esc(r.branch)+"</td><td class='num'>"+fmt(r.sales)+"</td><td class='num'>"+fmt(num(r.sales)-non)+"</td></tr>"}).join("");
    body=h("div",{class:"grid kpis"},kpi("المبيعات",fmt(c.sales),"ر.س","brass")+kpi("النقد",fmt(c.cash),"ر.س","pos")+kpi("الإجمالي النقدي",fmt(c.cashTotal),"ر.س","")+kpi("باقي الرصيد",fmt(bal[d].carried),"ر.س",""))+
      h("div",{class:"card"},cardHead("يومية "+prettyDate(d)+" (رقم "+dayNo(d)+")","عرض فقط — يتحدّث تلقائياً")+"<div class='tw'><table><thead><tr><th>الفرع</th><th>المبيعات</th><th>النقد</th></tr></thead><tbody>"+(rows||"<tr><td colspan='3' class='emptyline'>لا صفوف</td></tr>")+"</tbody></table></div>");}
  var out="<div class='appbar'><div class='appbar-in'><div class='brand'><div class='logo'>"+LOGO_SVG+"</div><div><h1>"+esc(S.config.businessName)+"</h1><small>شاشة عرض — قراءة فقط</small></div></div></div></div>"+h("main",{},body);
  var ap=document.getElementById("app");if(ap)ap.innerHTML=out;
  return out;
}
function animateKpis(){try{
  if(typeof requestAnimationFrame==="undefined")return;
  if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var els=document.querySelectorAll?document.querySelectorAll("main .kpi .val"):[];
  Array.prototype.forEach.call(els,function(el){
    var tn=el.firstChild;if(!tn||tn.nodeType!==3)return;
    var txt=String(tn.nodeValue||"").trim();
    if(!/^[\d,]+$/.test(txt))return;
    var target=parseInt(txt.replace(/,/g,""),10);if(!isFinite(target)||target<=0)return;
    var t0=null,DUR=460;
    function step(ts){if(t0==null)t0=ts;var p=Math.min(1,(ts-t0)/DUR);p=1-Math.pow(1-p,3);
      tn.nodeValue=fmt(Math.round(target*p));
      if(p<1)requestAnimationFrame(step);else tn.nodeValue=txt;}
    requestAnimationFrame(step);
  });
}catch(e){}}
function render(){
  if(KIOSK){kioskRender();return}
  _ddReg.length=0;
  var NAV=[["dashboard","الرئيسية",IC.dash],["entry","إدخال يومي",IC.entry],["reports","التقارير",IC.report],["files","الملفات",IC.folder],["branches","الإعدادات",IC.branch],["data","البيانات",IC.data]];
  var activeTab=S.view==="day"?"dashboard":S.view;
  var tabs=NAV.map(function(n){return h("button",{class:"tab"+(activeTab===n[0]?" active":""),onclick:"App.go('"+n[0]+"')"},n[2]+"<span>"+n[1]+"</span>")}).join("");
  var backBtn=(_nav.length||S.view==="day")?"<button class='backbtn' title='رجوع (يحفظ تلقائياً)' onclick='App.goBack()'>"+IC.back+"</button>":"";
  var head=h("div",{class:"appbar"},h("div",{class:"appbar-in"},
    h("div",{class:"brand"},backBtn+h("div",{class:"logo"},LOGO_SVG)+
      h("div",{},h("h1",{},esc(S.config.businessName))+h("small",{},"نظام تقارير اليومية"+(CLOUD?"":" · محلي")))+
      h("button",{class:"backbtn",title:"دليل الاستخدام",onclick:"App.help()",style:"min-width:36px;font-weight:900;font-size:15px"},"؟")+h("button",{id:"syncPill",class:"sync-pill",onclick:"App.go('data')"},'<span class="sync-dot"></span><span>—</span>'))+
    h("div",{class:"tabs"},tabs)));
  var body="";
  if(S.view==="dashboard")body=viewDashboard();
  else if(S.view==="entry")body=viewEntry();
  else if(S.view==="day")body=viewDay();
  else if(S.view==="reports")body=viewReports();
  else if(S.view==="branches")body=viewSettings();
  else if(S.view==="data")body=viewData();
  else if(S.view==="files")body=viewFiles();
  document.getElementById("app").innerHTML=head+h("main",{class:(S._lastView!==S.view?"view-in":"")},body);
  updateSyncPill();
  if(S.view==="entry"){var c=document.getElementById("cal");if(c&&S.calOpen)c.classList.add("open");applyColWidths()}
  if(_navScroll!=null){var sc=_navScroll;_navScroll=null;setTimeout(function(){try{scrollTo(0,sc)}catch(e){}},20)}
  var _nv=(S._lastView!==S.view);S._lastView=S.view;
  if(_nv&&S.view==="dashboard")animateKpis();
}

/* ===== الرئيسية ===== */
function dashRange(){
  var p=S.dash.preset;
  if(p==="all"){var ks=Object.keys(S.data).sort();return{from:ks[0]||todayISO(),to:ks[ks.length-1]||todayISO()}}
  if(p==="7")return{from:shiftDate(todayISO(),-6),to:todayISO()};
  if(p==="30")return{from:shiftDate(todayISO(),-29),to:todayISO()};
  if(p==="custom")return{from:S.dash.from||monthStart(ymOf(todayISO())),to:S.dash.to||todayISO()};
  var ym=ymOf(todayISO());return{from:monthStart(ym),to:monthEnd(ym)};
}
function weekGlance(){
  var t=todayISO();var A={from:shiftDate(t,-6),to:t},B={from:shiftDate(t,-13),to:shiftDate(t,-7)};
  function agg(r){var o={sales:0,cash:0,br:{}};Object.keys(S.data).forEach(function(d){if(d<r.from||d>r.to)return;var day=S.data[d];var c=computeDay(day,S.config);o.sales+=c.sales;o.cash+=c.cash;(day.rows||[]).forEach(function(x){if(x.branch)o.br[x.branch]=(o.br[x.branch]||0)+num(x.sales)})});return o}
  var a=agg(A),b=agg(B);if(!a.sales&&!b.sales)return "";
  function arw(v,p){var d=v-p;return d===0?"":(d>0?" <span style='color:var(--pos);font-size:11px'>▲ "+fmt(d)+"</span>":" <span style='color:var(--neg);font-size:11px'>▼ "+fmt(-d)+"</span>")}
  var top=Object.keys(a.br).sort(function(x,y){return a.br[y]-a.br[x]}).slice(0,5);
  var rows=top.map(function(n){return "<tr><td style='font-weight:700'>"+esc(n)+"</td><td class='num'>"+fmt(a.br[n])+arw(a.br[n],b.br[n]||0)+"</td></tr>"}).join("");
  return h("div",{class:"card"},cardHead("أسبوع في لمحة","آخر 7 أيام مقابل الأسبوع السابق")+
    "<div class='grid kpis' style='margin-bottom:10px'>"+kpi("مبيعات الأسبوع",fmt(a.sales)+arw(a.sales,b.sales),"ر.س","brass")+kpi("نقد الأسبوع",fmt(a.cash)+arw(a.cash,b.cash),"ر.س","pos")+"</div>"+
    (rows?"<div class='tw'><table><thead><tr><th>أعلى الفروع</th><th>مبيعات الأسبوع</th></tr></thead><tbody>"+rows+"</tbody></table></div>":""));
}
function viewDashboard(){
  if(!visDates().length)return secHead("لوحة","الرئيسية")+emptyState("لا توجد بيانات بعد","ابدأ بإدخال أول يومية، أو استورد ملفات إكسل السابقة.",[["إدخال يومية","App.go('entry')",1],["استيراد بيانات","App.go('data')",0]]);
  var r=dashRange(),bal=balances();
  var days=visDates().filter(function(d){return d>=r.from&&d<=r.to}).sort();
  var agg={sales:0,cash:0,exp:0,inc:0,total:0};days.forEach(function(d){var c=computeDay(S.data[d],S.config);agg.sales+=c.sales;agg.cash+=c.cash;agg.exp+=c.totalExpenses;agg.inc+=c.totalIncome;agg.total+=c.cashTotal});
  var lastAll=visDates().sort();var carriedNow=days.length?bal[days[days.length-1]].carried:(lastAll.length?bal[lastAll[lastAll.length-1]].carried:num(S.config.openingBalance));
  var chart=days.map(function(d){return{label:d.slice(8),value:computeDay(S.data[d],S.config).sales}});
  var presets=[["month","هذا الشهر"],["7","آخر 7 أيام"],["30","آخر 30 يوم"],["all","الكل"],["custom","مخصّص"]];
  var pillbar="<div style='display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:14px'>"+
    presets.map(function(x){return "<button class='subtab"+(S.dash.preset===x[0]?" active":"")+"' onclick=\"App.dashPreset('"+x[0]+"')\">"+x[1]+"</button>"}).join("")+
    (S.dash.preset==="custom"?"<span style='color:var(--muted)'>من</span>"+dateBtn("dashFrom",S.dash.from||monthStart(ymOf(todayISO())))+"<span style='color:var(--muted)'>إلى</span>"+dateBtn("dashTo",S.dash.to||todayISO()):"")+"</div>";
  var kpis=h("div",{class:"grid kpis"},kpi("المبيعات",fmt(agg.sales),"ر.س","brass")+kpi("النقد",fmt(agg.cash),"ر.س","pos")+kpi("الإيرادات",fmt(agg.inc),"ر.س","pos")+kpi("المصروفات",fmt(agg.exp),"ر.س","neg")+kpi("الإجمالي النقدي",fmt(agg.total),"ر.س","brass")+kpi("باقي الرصيد",fmt(carriedNow),"ر.س",""));
  var recent=days.slice().reverse().map(function(d){var c=computeDay(S.data[d],S.config);
    return "<tr class='clk' onclick=\"App.openDay('"+d+"')\"><td class='num' style='color:var(--muted)'>"+dayNo(d)+"</td><td>"+prettyDate(d)+auditBadge(S.data[d])+draftBadge(S.data[d])+"</td><td class='num'>"+fmt(c.sales)+"</td><td class='num'>"+fmt(c.cash)+"</td><td class='num' style='color:var(--neg)'>"+fmt(c.totalExpenses)+"</td><td class='num' style='color:var(--pos)'>"+fmt(c.totalIncome)+"</td><td class='num' style='font-weight:700'>"+fmt(c.cashTotal)+"</td><td class='num' style='font-weight:700'>"+fmt(bal[d].carried)+"</td><td class='rowact' style='white-space:nowrap' onclick='event.stopPropagation()'><button class='iconbtn' title='طباعة التقرير' onclick=\"App.printDay('"+d+"')\">"+IC.print+"</button><button class='iconbtn danger' title='حذف التقرير' onclick=\"App.delDay('"+d+"')\">"+IC.trash+"</button></td></tr>"}).join("");
  var totalsRow="<tr class='total'><td colspan='2'>الإجمالي ("+days.length+" يوم)</td><td class='num'>"+fmt(agg.sales)+"</td><td class='num'>"+fmt(agg.cash)+"</td><td class='num'>"+fmt(agg.exp)+"</td><td class='num'>"+fmt(agg.inc)+"</td><td class='num'>"+fmt(agg.total)+"</td><td class='num' style='color:var(--muted)'>—</td><td></td></tr>";
  return secHead("لوحة","الرئيسية")+pillbar+kpis+
    h("div",{class:"card"},cardHead("المبيعات اليومية",days.length+" يوم")+barChart(chart,"var(--brass)"))+
    weekGlance()+
    h("div",{class:"card"},cardHead("الأيام (اضغط لعرض التقرير)",'<button class="link" onclick="App.newDay()">يومية جديدة '+IC.chevL+'</button>')+
      (recent?"<div class='tw'><table><thead><tr><th class='num'>#</th><th class='lh'>التاريخ</th><th class='num'>المبيعات</th><th class='num'>النقد</th><th class='num'>المصروفات</th><th class='num'>الإيرادات</th><th class='num'>الإجمالي النقدي</th><th class='num'>باقي الرصيد</th><th class='lh'></th></tr></thead><tbody>"+recent+totalsRow+"</tbody></table></div>":"<div class='emptyline'>لا أيام في هذه الفترة</div>"));
}

/* ===== الإدخال اليومي ===== */
function loadDay(date){S.curDate=date;S.calMonth=ymOf(date);var d=S.data[date];S.day=d?JSON.parse(JSON.stringify(d)):blankDay(date);S.day.date=date;
  if(!d&&!(S.day.rows||[]).length&&(S.config.dayTemplate||[]).length){
    S.day.rows=(S.config.dayTemplate||[]).map(function(b){return {id:uuid(),branchId:b.id||"",branch:b.name||"",sales:"",pays:{},notes:""}});
  }
  S.dirty=false;histReset();}
function viewEntry(){
  if(!S.day||S.day.date!==S.curDate)loadDay(S.curDate);
  var d=S.day,cfg=S.config,c=computeDay(d,cfg);
  var prev=dayPrev(d),carried=prev+c.cash-c.bankDeposit;
  var marksN=Object.keys(d.verify||{}).length+Object.keys(d.tmarks||{}).length;
  var histbar="<div class='histbar'><button id='btnUndo' class='histbtn' onclick='App.undo()' title='تراجع (Ctrl+Z)'"+(_hist.undo.length?"":" disabled")+">"+IC.undo+"<span>تراجع</span></button><button id='btnRedo' class='histbtn' onclick='App.redo()' title='إعادة (Ctrl+Y)'"+(_hist.redo.length?"":" disabled")+">"+IC.redo+"<span>إعادة</span></button><button class='histbtn' onclick='App.clearMarks()'"+(marksN?"":" disabled")+" title='إعادة جميع ألوان التحقق (الأخضر/الأحمر) إلى الوضع الافتراضي — لا يمس أي قيم'><span>مسح ألوان التدقيق"+(marksN?" ("+marksN+")":"")+"</span></button><span style='flex:1'></span><button id='btnSave' class='histbtn save"+(S.dirty?" dirty":"")+"' onclick='App.saveNow()'"+(S.dirty?"":" disabled")+" title='حفظ التغييرات الآن (يُحفظ تلقائياً أيضاً)'><span class='sicon'>"+IC.save+"</span><span class='slbl'>"+(S.dirty?"حفظ التغييرات":"محفوظ")+"</span></button></div>";
  var warns=dayWarnings(d,cfg,c,prev);
  var warnbar=warns.length?"<div class='warnbar'><b>تنبيهات المراجعة ("+warns.length+"):</b> "+warns.map(esc).join(" · ")+"</div>":"";
  var lockbar=d.locked?"<div class='lockbar'>🔒 <b>اليومية مقفلة</b> (طُبعت واعتُمدت) — التعديل معطّل، والتلوين للتدقيق مسموح. <button class='btn ghost' style='padding:5px 12px' onclick='App.unlockDay()'>فتح للتعديل</button></div>":"";
  var copyBar=(!S.data[d.date]&&!(d.rows||[]).length)?"<div style='margin:0 0 10px'><button class='btn ghost' onclick='App.copyPrevDay()'>نسخ فروع آخر يوم (بقيم فارغة)</button></div>":"";
  return "<div class='entryview'>"+secHead("تسجيل","إدخال يومي")+dateNav()+lockbar+warnbar+copyBar+histbar+entryTable(d,cfg,c)+
    h("div",{class:"grid cols2"},balanceBeforeCard(d,c,prev,carried)+finalTotalCard(d,c))+
    h("div",{class:"grid cols2"},expensesCard(d,c)+incomesCard(d,c))+
    h("div",{class:"card",style:"padding:11px 16px"},h("div",{class:"audit"},auditText(d)))+
    "<div style='display:flex;gap:10px;justify-content:center;margin-top:2px;flex-wrap:wrap'>"+
      (d.status==="draft"?"<button class='btn' style='background:var(--pos);border-color:var(--pos)' onclick='App.approveDay()'>اعتماد اليومية ✓</button>":"")+
      "<button class='btn' onclick=\"App.openDay('"+d.date+"')\">عرض كتقرير</button>"+
      "<button class='btn brass' onclick=\"App.printDay('"+d.date+"')\">"+IC.print+" طباعة (A4)</button></div></div>";
}
function dateNav(){
  var d=S.day,hasData=!!S.data[d.date];
  return h("div",{class:"datenav"},
    h("div",{class:"dn-top"},
      h("div",{class:"dn-arrows"},"<button class='iconbtn' title='اليوم السابق' onclick='App.navDay(-1)'>"+IC.chevR+"</button><button class='iconbtn' title='اليوم التالي' onclick='App.navDay(1)'>"+IC.chevL+"</button>")+
      h("div",{class:"dn-cur"},"<div class='d'>"+prettyDate(d.date)+(d.dateTo?" ← "+prettyDate(d.dateTo):"")+"</div><div class='s "+(hasData?"hasdata":"")+"'>"+(hasData?"يومية محفوظة":"يومية جديدة")+(d.locked?" · 🔒 مقفلة":"")+(d.status==="draft"?" · <b style='color:#7a5b12'>مسودة</b>":"")+"</div>")+
      "<button class='iconbtn' title='التقويم' onclick='App.toggleCal()'>"+IC.cal+"</button>")+
    "<div class='dn-quick'>"+
      "<button class='btn ghost' style='padding:7px 13px' onclick='App.navToday()'>اليوم</button>"+
      "<label class='chip' style='margin:0'><input type='checkbox' style='width:auto' "+(d.dateTo?"checked":"")+" onchange='App.toggleTwoDay(this.checked)'> يومين</label>"+
      (d.dateTo?dateBtn("setDateTo",d.dateTo):"")+
      "<span style='flex:1'></span>"+(S.dirty?"<span class='badge' style='color:var(--brass)'>يُحفظ تلقائياً…</span>":(hasData?"<span class='badge'>محفوظ</span>":""))+"</div>"+
    h("div",{class:"cal",id:"cal"},calHTML("cal")));
}
function calState(kind){return kind==="dp"?{ym:S.dp.ym,mode:S.dp.mode||"days",sel:S.dp.sel}:{ym:S.calMonth,mode:S.calMode||"days",sel:S.curDate}}
function calHTML(kind){
  var st=calState(kind),p=st.ym.split("-").map(Number),y=p[0],m=p[1]-1;
  var A="App.calAct('"+kind+"',";
  if(st.mode==="months"){
    var h="<div class='cal-head'><button class='cal-nav2' onclick=\""+A+"'cy',-1)\">‹</button><div class='cal-title'><button onclick=\""+A+"'mode','years')\">"+y+"</button></div><button class='cal-nav2' onclick=\""+A+"'cy',1)\">›</button></div><div class='my-grid'>";
    for(var mm=0;mm<12;mm++)h+="<button class='my-cell"+(mm===m?" cur":"")+"' onclick=\""+A+"'pm',"+mm+")\">"+AR_MONTHS[mm]+"</button>";
    return h+"</div>";
  }
  if(st.mode==="years"){
    var sy=y-4,hy="<div class='cal-head'><button class='cal-nav2' onclick=\""+A+"'py',-9)\">‹</button><div class='cal-title'><button>"+sy+" – "+(sy+8)+"</button></div><button class='cal-nav2' onclick=\""+A+"'py',9)\">›</button></div><div class='my-grid'>";
    for(var yy=sy;yy<=sy+8;yy++)hy+="<button class='my-cell"+(yy===y?" cur":"")+"' onclick=\""+A+"'py2',"+yy+")\">"+yy+"</button>";
    return hy+"</div>";
  }
  var first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate();
  var html="<div class='cal-head'><button class='cal-nav2' onclick=\""+A+"'cm',-1)\">›</button><div class='cal-title'><button onclick=\""+A+"'mode','months')\">"+AR_MONTHS[m]+"</button><button onclick=\""+A+"'mode','years')\">"+y+"</button></div><button class='cal-nav2' onclick=\""+A+"'cm',1)\">‹</button></div><div class='cal-week'>";
  ["أحد","اثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"].forEach(function(x){html+="<div class='cal-dow'>"+x+"</div>"});
  html+="</div><div class='calg'>";
  for(var b=0;b<first;b++)html+="<button class='cal-day empty'></button>";
  for(var day=1;day<=dim;day++){var iso=y+"-"+pad(m+1)+"-"+pad(day);var has=!!S.data[iso];var cls="cal-day";if(iso===st.sel)cls+=" sel";else if(iso===todayISO())cls+=" today";
    html+="<button class='"+cls+"' onclick=\""+A+"'day','"+iso+"')\">"+day+(has?"<span class='dt'></span>":"")+"</button>";}
  return html+"</div><div class='cal-foot'><button class='cal-today-btn' onclick=\""+A+"'today',0)\">اليوم</button></div>";
}
function amtCell(r,key,val){
  var vk=r.id+"|"+key,vc=(S.day&&S.day.verify&&S.day.verify[vk])||"";
  var LK=(S.day&&S.day.locked)?" disabled":"";
  return "<td class='cell"+(vc?" v-"+vc:"")+"'><div class='box'><input class='amt' inputmode='decimal'"+LK+" data-r='"+r.id+"' data-f='"+key+"' value='"+(val==null?"":val)+"' oninput='App.cell(this)' onchange='App.cellDone(this)' onkeydown='App.rowKey(event,this)'><button class='vdot"+(vc?" v-"+vc:"")+"' tabindex='-1' title='تحقّق من هذا المبلغ (تم/خطأ)' onclick=\"App.vmark('"+r.id+"','"+key+"')\">"+(vc==="g"?"✓":vc==="r"?"✕":"")+"</button></div></td>";}
function totCell(d,key,val){var col=(d.tmarks&&d.tmarks[key])||"";return "<td class='num tcell"+(col?" c-"+col:"")+"' id='tot-"+key+"' title='اضغط لتلوين التحقق' onclick=\"App.tmark('"+key+"')\">"+fmt(val)+"</td>";}
function entryTable(d,cfg,c){
  var methods=cfg.methods;
  var grip="<span class='cgrip' title='اسحب لتغيير عرض العمود · نقرة مزدوجة لإعادة الضبط'></span>";
  var th="<th class='stick lh' data-col='branch'>الفرع"+grip+"</th><th class='num' data-col='sales'>المبيعات"+grip+"</th>"+methods.map(function(m){return "<th class='num' data-col='pay:"+m.id+"'>"+esc(m.label)+grip+"</th>"}).join("")+"<th class='num' data-col='cash'>النقد"+grip+"</th><th class='lh' data-col='notes'>ملاحظات"+grip+"</th><th class='lh' data-col='act'></th>";
  var rows=(d.rows||[]).map(function(r){
    var rowCash=num(r.sales)-methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);
    var payCells=methods.map(function(m){return amtCell(r,"pay:"+m.id,((r.pays||{})[m.id]))}).join("");
    var cv=(d.verify&&d.verify[r.id+"|cash"])||"";
    return "<tr"+(S._flashRow===r.id?" class='row-in'":"")+" data-id='"+r.id+"'"+">"+
      "<td class='stick cell'><button class='branchbtn'"+(d.locked?" disabled":"")+" onclick=\"App.pickBranch('"+r.id+"')\">"+(r.branch?esc(r.branch):"<span class='ph'>اختر الفرع</span>")+IC.chevD+"</button></td>"+
      amtCell(r,"sales",r.sales)+payCells+
      "<td class='num tcell"+(cv?" c-"+cv:"")+"' data-cash='"+r.id+"' title='اضغط لتلوين التحقق' onclick=\"App.vmarkCash('"+r.id+"')\" style='font-weight:700"+(cv?"":";color:"+(rowCash<0?"var(--neg)":"var(--pos)"))+"'>"+fmt(rowCash)+"</td>"+
      "<td class='cell'><div class='box'><input class='amt txt'"+((d.locked)?" disabled":"")+" data-r='"+r.id+"' data-f='notes' value='"+esc(r.notes||"")+"' oninput='App.cell(this)' onkeydown='App.rowKey(event,this)'></div></td>"+
      "<td class='rowact'><span class='grip' title='اسحب لإعادة الترتيب'>"+IC.grip+"</span><button class='iconbtn brass' title='إدراج صف تحت' onclick=\"App.insertBelow('"+r.id+"')\">"+IC.plus+"</button><button class='iconbtn danger' title='حذف' onclick=\"App.delRow('"+r.id+"')\">"+IC.x+"</button></td></tr>";
  }).join("");
  var totRow="<tr class='total'><td class='stick'>الإجماليات</td>"+totCell(d,"sales",c.sales)+methods.map(function(m){return totCell(d,m.id,c.byM[m.id])}).join("")+totCell(d,"cash",c.cash)+"<td></td><td></td></tr>";
  var actions="<div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px'>"+
    "<button class='btn' onclick='App.addRow()'>"+IC.plus+" صف جديد</button>"+
    "<button class='btn ghost' onclick='App.addAllBranches()'>إضافة الفروع غير المضافة</button>"+
    (Object.keys(loadColW()).length?"<button class='btn ghost' onclick='App.resetCols()' title='إعادة كل الأعمدة للعرض التلقائي'>إعادة ضبط الأعمدة</button>":"")+
    ((d.rows||[]).length?"<button class='btn ghost' style='color:var(--neg)' onclick='App.clearRows()'>مسح الصفوف</button>":"")+"</div>";
  var hint="<div class='mkhint'><span>التحقق من المبالغ: اضغط الدائرة الصغيرة في زاوية أي خلية دفع (تحويل/تابي/تمارا…) بعد مطابقتها فعلياً:</span><span><i style='background:var(--pos)'></i>تم التحقق</span><span><i style='background:var(--neg)'></i>خطأ/غير مطابق</span><span style='color:var(--muted)'>· يمكن أيضاً تلوين خلايا «النقد» و«الإجماليات» و«باقي الرصيد» بالضغط عليها · اسحب المقبض لإعادة الترتيب</span></div>";
  var empty=(d.rows||[]).length?"":"<div class='emptyline'>لا صفوف. أضف صفاً أو «إضافة الفروع».</div>";
  S._flashRow=null;
  return h("div",{class:"card"},cardHead("مبيعات الفروع","النقد يُحسب تلقائياً · يمكن تكرار الفرع")+
    "<div class='tw etw'><table id='entryTbl'><thead><tr>"+th+"</tr></thead><tbody id='entryBody'>"+rows+totRow+"</tbody></table></div>"+empty+hint+actions);
}
function balanceBeforeCard(d,c,prev,carried){
  var manual=(d.carryIn!=null&&d.carryIn!=="");
  return h("div",{class:"card"},cardHead("الرصيد النقدي (الخزينة)","النقد فقط يُضاف · المصروفات والإيرادات لا تدخل هنا")+
    "<label class='rowline'><span>رصيد سابق (تراكمي)"+(manual?" <b style='color:var(--brass);font-weight:700;font-size:11px'>مثبّت</b>":"")+" <button class='link' style='font-size:11px' onclick='App.carryAuto()'>تلقائي</button></span><input id='carryIn' inputmode='decimal'"+(d.locked?" disabled":"")+" value='"+(prev)+"' style='width:150px;text-align:left;font-weight:700' oninput='App.carry(this)' onchange='App.amtDone(this,\"carry\")'></label>"+
    "<div class='rowline'><span>+ نقد المبيعات</span><b id='cc-cash' style='color:var(--pos)'>"+fmt(c.cash)+"</b></div>"+
    "<label class='rowline'><span>− الإيداع البنكي</span><input id='bankDep' inputmode='decimal'"+(d.locked?" disabled":"")+" value='"+(d.bankDeposit||"")+"' placeholder='0' style='width:150px;text-align:left' oninput='App.bank(this)' onchange='App.amtDone(this,\"bank\")'></label>"+
    "<div class='rowline big'><span>باقي الرصيد (يُرحّل)</span><b id='cc-carried' class='carval"+((d.tmarks&&d.tmarks.carried)?" c-"+d.tmarks.carried:"")+"' title='اضغط لتلوين التحقق' onclick='App.cmark()'>"+fmt(carried)+" ر.س</b></div>");
}
function finalTotalCard(d,c){
  return h("div",{class:"card"},cardHead("الإجمالي النقدي","يُحسب أخيراً بعد المصروفات والإيرادات")+
    "<div class='rowline'><span>نقد المبيعات</span><b>"+fmt(c.cash)+"</b></div>"+
    "<div class='rowline'><span>− المصروفات</span><b id='cc-exp' style='color:var(--neg)'>"+fmt(c.totalExpenses)+"</b></div>"+
    "<div class='rowline'><span>= صافي النقد</span><b id='cc-net'>"+fmt(c.netCash)+"</b></div>"+
    "<div class='rowline'><span>+ الإيرادات</span><b id='cc-inc' style='color:var(--pos)'>"+fmt(c.totalIncome)+"</b></div>"+
    "<div class='rowline big'><span>الإجمالي النقدي</span><b id='cc-total'>"+fmt(c.cashTotal)+" ر.س</b></div>");
}
function expensesCard(d,c){
  var LK=d.locked?" disabled":"";var _fx=(S._flashItem==="exp");if(_fx)S._flashItem=null;var list=(d.expenses||[]).map(function(e,i){return "<div class='exp-row"+((_fx&&i===(d.expenses.length-1))?" row-in":"")+"'><input"+LK+" inputmode='decimal' placeholder='المبلغ' value='"+(e.amount==null?"":e.amount)+"' style='width:120px' data-k='exp' data-i='"+i+"' data-f='amount' oninput='App.exp("+i+",\"amount\",this)' onchange='App.itemDone(this,\"exp\","+i+")' onkeydown='App.itemKey(event,this,\"exp\","+i+")'><input"+LK+" placeholder='التفاصيل' value='"+esc(e.details||"")+"' style='flex:1' data-k='exp' data-i='"+i+"' data-f='details' oninput='App.exp("+i+",\"details\",this.value)' onkeydown='App.itemKey(event,this,\"exp\","+i+")'><button class='iconbtn danger' onclick='App.delExp("+i+")'>"+IC.x+"</button></div>"}).join("");
  return h("div",{class:"card"},cardHead("المصروفات",'<button class="link" onclick="App.addExp()">'+IC.plus+' إضافة</button>')+((d.expenses||[]).length?"":"<div class='emptyline'>لا مصروفات</div>")+list+"<div class='rowline' style='margin-top:6px'><span>اجمالي المصروفات</span><b id='expTot' style='color:var(--neg)'>"+fmt(c.totalExpenses)+" ر.س</b></div>");
}
function incomesCard(d,c){
  var LK=d.locked?" disabled":"";var _fx=(S._flashItem==="inc");if(_fx)S._flashItem=null;var list=(d.incomes||[]).map(function(e,i){return "<div class='exp-row"+((_fx&&i===(d.incomes.length-1))?" row-in":"")+"'><input"+LK+" inputmode='decimal' placeholder='المبلغ' value='"+(e.amount==null?"":e.amount)+"' style='width:120px' data-k='inc' data-i='"+i+"' data-f='amount' oninput='App.inc("+i+",\"amount\",this)' onchange='App.itemDone(this,\"inc\","+i+")' onkeydown='App.itemKey(event,this,\"inc\","+i+")'><input"+LK+" placeholder='التفاصيل' value='"+esc(e.details||"")+"' style='flex:1' data-k='inc' data-i='"+i+"' data-f='details' oninput='App.inc("+i+",\"details\",this.value)' onkeydown='App.itemKey(event,this,\"inc\","+i+")'><button class='iconbtn danger' onclick='App.delInc("+i+")'>"+IC.x+"</button></div>"}).join("");
  return h("div",{class:"card"},cardHead("الإيرادات (تُضاف للنقد)",'<button class="link" onclick="App.addInc()">'+IC.plus+' إضافة</button>')+((d.incomes||[]).length?"":"<div class='emptyline'>لا إيرادات إضافية</div>")+list+"<div class='rowline' style='margin-top:6px'><span>اجمالي الإيرادات</span><b id='incTot' style='color:var(--pos)'>"+fmt(c.totalIncome)+" ر.س</b></div>");
}
function auditText(d){return (d.createdAt?"<span>أُنشئ: <b>"+d.createdAt+"</b></span>":"")+(d.updatedAt?"<span>آخر تعديل: <b>"+d.updatedAt+"</b></span>":"")+(d.printedAt?"<span>آخر طباعة: <b>"+d.printedAt+"</b></span>":"")||"<span>لم تُحفظ بعد</span>"}
function set(id,v){var el=document.getElementById(id);if(el)el.textContent=v}
function recompute(){
  var d=S.day,cfg=S.config,c=computeDay(d,cfg);
  cfg.methods.forEach(function(m){set("tot-"+m.id,fmt(c.byM[m.id]))});
  set("tot-sales",fmt(c.sales));set("tot-cash",fmt(c.cash));
  (d.rows||[]).forEach(function(r){var rc=num(r.sales)-cfg.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);var el=document.querySelector("[data-cash='"+r.id+"']");if(el){el.textContent=fmt(rc);var mk=(d.verify&&d.verify[r.id+"|cash"])||"";el.style.color=mk?"":(rc<0?"var(--neg)":"var(--pos)")}});
  var prev=dayPrev(d),carried=prev+c.cash-num(d.bankDeposit);
  set("cc-cash",fmt(c.cash));var ccc=document.getElementById("cc-carried");if(ccc)ccc.textContent=fmt(carried)+" ر.س";
  set("cc-exp",fmt(c.totalExpenses));set("cc-net",fmt(c.netCash));set("cc-inc",fmt(c.totalIncome));var cct=document.getElementById("cc-total");if(cct)cct.textContent=fmt(c.cashTotal)+" ر.س";
  set("expTot",fmt(c.totalExpenses)+" ر.س");set("incTot",fmt(c.totalIncome)+" ر.س");
}
function refreshTable(){var card=document.getElementById("entryTbl");if(!card){render();return}card.closest(".card").outerHTML=entryTable(S.day,S.config,computeDay(S.day,S.config));applyColWidths();}

/* ===== عرض التقرير (للقراءة) مع تعديل/طباعة ===== */
function viewDay(){
  var d=S.data[S.curDate];
  if(!d)return secHead("تقرير","اليومية")+emptyState("لا توجد بيانات لهذا اليوم","اختر يوماً فيه بيانات، أو أنشئ يومية جديدة.",[["إدخال يومية","App.go('entry')",1]]);
  var cfg=S.config,c=computeDay(d,cfg),prev=dayPrev(d),carried=prev+c.cash-c.bankDeposit;
  var vcls=function(key){var col=(d.tmarks&&d.tmarks[key])||"";return col?" vc c-"+col:""};
  var vrc=function(r,key){var col=(d.verify&&d.verify[r.id+"|"+key])||"";return col?" vc c-"+col:""};
  var th="<th class='stick'>الفرع</th><th>المبيعات</th>"+cfg.methods.map(function(m){return "<th>"+esc(m.label)+"</th>"}).join("")+"<th>النقد</th><th>ملاحظات</th>";
  var body=(d.rows||[]).map(function(r){var non=cfg.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);var cm=vrc(r,"cash");
    return "<tr><td class='stick' style='font-weight:700'>"+esc(r.branch||"—")+"</td><td class='num"+vrc(r,"sales")+"'>"+fmt(r.sales)+"</td>"+cfg.methods.map(function(m){return "<td class='num"+vrc(r,"pay:"+m.id)+"'>"+fmt((r.pays||{})[m.id]||0)+"</td>"}).join("")+"<td class='num"+cm+"'"+(cm?"":" style='color:var(--pos)'")+">"+fmt(num(r.sales)-non)+"</td><td>"+esc(r.notes||"")+"</td></tr>"}).join("");
  var totRow="<tr class='total'><td class='stick'>الاجماليات</td><td class='num"+vcls("sales")+"'>"+fmt(c.sales)+"</td>"+cfg.methods.map(function(m){return "<td class='num"+vcls(m.id)+"'>"+fmt(c.byM[m.id])+"</td>"}).join("")+"<td class='num"+vcls("cash")+"'>"+fmt(c.cash)+"</td><td></td></tr>";
  var nl=dayNavList(),ni=nl.indexOf(S.curDate);
  var dnav="<button class='iconbtn' title='التقرير السابق' "+(ni>0?"onclick='App.dayNav2(-1)'":"disabled")+">"+IC.chevR+"</button><button class='iconbtn' title='التقرير التالي' "+(ni>=0&&ni<nl.length-1?"onclick='App.dayNav2(1)'":"disabled")+">"+IC.chevL+"</button><span class='note' style='align-self:center'>"+(ni+1)+" من "+nl.length+" · <b>يومية رقم "+dayNo(S.curDate)+"</b></span>";
  var head=h("div",{class:"card"},h("div",{class:"dayview-head"},
    "<div><div style='display:flex;gap:8px;align-items:center;flex-wrap:wrap'><button class='link' onclick='App.goBack()'>"+IC.back+" رجوع</button>"+dnav+"</div><h2 style='margin:6px 0 0;color:var(--ink)'>"+prettyDate(d.date)+(d.dateTo?" ← "+prettyDate(d.dateTo):"")+"</h2><div class='note'>"+auditText(d)+"</div></div>"+
    "<div style='display:flex;gap:8px;flex-wrap:wrap'><button class='btn' onclick=\"App.editDay('"+d.date+"')\">"+IC.edit+" تعديل</button><button class='btn brass' onclick=\"App.printDay('"+d.date+"')\">"+IC.print+" طباعة</button><button class='btn ghost' style='color:var(--neg)' onclick=\"App.delDay('"+d.date+"')\">"+IC.trash+" حذف</button></div>"));
  var kbar=h("div",{class:"grid kpis"},kpi("المبيعات",fmt(c.sales),"ر.س","brass")+kpi("النقد",fmt(c.cash),"ر.س","pos")+kpi("الإيرادات",fmt(c.totalIncome),"ر.س","pos")+kpi("المصروفات",fmt(c.totalExpenses),"ر.س","neg")+kpi("الإجمالي النقدي",fmt(c.cashTotal),"ر.س","brass")+kpi("باقي الرصيد",fmt(carried),"ر.س",""));
  var tbl=h("div",{class:"card"},cardHead("مبيعات الفروع","")+"<div class='tw'><table>"+"<thead><tr>"+th+"</tr></thead><tbody>"+body+totRow+"</tbody></table></div>");
  var sums=h("div",{class:"grid cols2"},
    h("div",{class:"card"},cardHead("الرصيد النقدي (قبل)","يُرحّل لليوم التالي")+
      "<div class='rowline'><span>رصيد سابق</span><b>"+fmt(prev)+"</b></div><div class='rowline'><span>نقد المبيعات</span><b>"+fmt(c.cash)+"</b></div><div class='rowline'><span>− الإيداع البنكي</span><b>"+fmt(c.bankDeposit)+"</b></div><div class='rowline big'><span>باقي الرصيد</span><b class='"+((d.tmarks&&d.tmarks.carried)?"carval c-"+d.tmarks.carried:"")+"'>"+fmt(carried)+" ر.س</b></div>")+
    h("div",{class:"card"},cardHead("الإجمالي النقدي (أخيراً)","")+
      "<div class='rowline'><span>نقد المبيعات</span><b>"+fmt(c.cash)+"</b></div><div class='rowline'><span>− المصروفات</span><b style='color:var(--neg)'>"+fmt(c.totalExpenses)+"</b></div><div class='rowline'><span>= صافي النقد</span><b>"+fmt(c.netCash)+"</b></div><div class='rowline'><span>+ الإيرادات</span><b style='color:var(--pos)'>"+fmt(c.totalIncome)+"</b></div><div class='rowline big'><span>الإجمالي النقدي</span><b>"+fmt(c.cashTotal)+" ر.س</b></div>"));
  var lists=h("div",{class:"grid cols2"},
    h("div",{class:"card"},cardHead("المصروفات","")+((d.expenses||[]).length?"<div class='tw'><table><tbody>"+(d.expenses||[]).map(function(e){return "<tr><td class='num'>"+fmt(e.amount)+"</td><td>"+esc(e.details||"")+"</td></tr>"}).join("")+"<tr class='total'><td class='num'>"+fmt(c.totalExpenses)+"</td><td>الإجمالي</td></tr></tbody></table></div>":"<div class='emptyline'>لا مصروفات</div>"))+
    h("div",{class:"card"},cardHead("الإيرادات","")+((d.incomes||[]).length?"<div class='tw'><table><tbody>"+(d.incomes||[]).map(function(e){return "<tr><td class='num'>"+fmt(e.amount)+"</td><td>"+esc(e.details||"")+"</td></tr>"}).join("")+"<tr class='total'><td class='num'>"+fmt(c.totalIncome)+"</td><td>الإجمالي</td></tr></tbody></table></div>":"<div class='emptyline'>لا إيرادات</div>")));
  return head+kbar+tbl+sums+lists;
}

/* ===== التقارير ===== */
function viewReports(){
  if(!Object.keys(S.data).length)return secHead("تحليل","التقارير")+emptyState("لا توجد بيانات للتقارير","أدخل يوميات أو استورد ملفاتك أولاً.",[["إدخال يومية","App.go('entry')",1]]);
  var gs=h("div",{class:"card",style:"padding:12px 16px"},
    "<div class='gswrap'>"+IC.report+"<input id='gsInput' placeholder='بحث شامل: فرع، ملاحظة، مصروف، إيراد، مبلغ، تاريخ…' value='"+esc(S._gsQ||"")+"' oninput='App.gsQ(this.value)'>"+((S._gsQ||"").trim()?"<button class='iconbtn' title='مسح البحث' onclick='App.gsClear()'>"+IC.x+"</button>":"")+"</div>"+
    "<div id='gsRes'>"+gsResults(S._gsQ||"")+"</div>");
  var tabs=[["custom","مخصّص (فلترة)"],["items","المصروفات والإيرادات"],["monthly","شهري"],["pm","طرق الدفع"],["branch","الفروع"],["compare","مقارنة"],["yearly","سنوي"]].map(function(t){return "<button class='subtab"+(S.reportTab===t[0]?" active":"")+"' onclick=\"App.rtab('"+t[0]+"')\">"+t[1]+"</button>"}).join("");
  var body=S.reportTab==="custom"?repCustom():S.reportTab==="items"?repItems():S.reportTab==="monthly"?repMonthly():S.reportTab==="pm"?repPM():S.reportTab==="branch"?repBranch():S.reportTab==="compare"?repCompare():repYearly();
  return secHead("تحليل","التقارير")+gs+h("div",{class:"subtabs"},tabs)+body;
}
function hiddenY(y){return (S.config.hiddenYears||[]).indexOf(String(y))>=0}
function visDates(){return Object.keys(S.data).filter(function(d){return !hiddenY(d.slice(0,4))})}
function monthList(){return Array.from(new Set(visDates().map(ymOf))).sort()}
function yearList(){return Array.from(new Set(visDates().map(yOf))).sort()}
function rfRange(){var f=S.rf.from||monthStart(ymOf(todayISO()));var t=S.rf.to||monthEnd(ymOf(todayISO()));return{from:f,to:t}}
/* حساب التقرير المخصّص — مشترك بين العرض والطباعة (نفس الفلترة تماماً) */
function brsSel(){return (S.rf.brs||[]).slice()}
function brsLabel(){var b=brsSel();return b.length===0?"كل الفروع":(b.length===1?b[0]:b.length+" فروع محددة")}
function customCalc(){
  var r=rfRange(),bal=balances(),brs=brsSel(),all=brs.length===0,methods=S.config.methods;
  var days=Object.keys(S.data).filter(function(d){return d>=r.from&&d<=r.to}).sort();
  var T={sales:0,cash:0,exp:0,inc:0};var TM={};methods.forEach(function(m){TM[m.id]=0});
  var per=days.map(function(d){
    var day=S.data[d];var rows=(day.rows||[]);if(!all)rows=rows.filter(function(x){return brs.indexOf(x.branch)>=0});
    var sales=0,cash=0,bm={};methods.forEach(function(m){bm[m.id]=0});
    rows.forEach(function(x){var non=0;methods.forEach(function(m){var v=num((x.pays||{})[m.id]);bm[m.id]+=v;non+=v});sales+=num(x.sales);cash+=num(x.sales)-non});
    var exp=0,inc=0,car=0;
    if(all){var c=computeDay(day,S.config);exp=c.totalExpenses;inc=c.totalIncome;car=bal[d].carried;T.exp+=exp;T.inc+=inc}
    T.sales+=sales;T.cash+=cash;methods.forEach(function(m){TM[m.id]+=bm[m.id]});
    return {d:d,sales:sales,cash:cash,bm:bm,exp:exp,inc:inc,car:car};
  });
  return {r:r,brs:brs,all:all,label:brsLabel(),methods:methods,days:days,per:per,T:T,TM:TM};
}
function repCustom(){
  var cc=customCalc(),r=cc.r,all=cc.all,methods=cc.methods,days=cc.days,T=cc.T,TM=cc.TM;
  var brOpts=[["__all","كل الفروع"]].concat(branchList().map(function(b){return [b.name,b.name]}));
  var bar=h("div",{class:"filterbar"},
    "<label class='fld'><span>من تاريخ</span>"+dateBtn("rfFrom",r.from)+"</label>"+
    "<label class='fld'><span>إلى تاريخ</span>"+dateBtn("rfTo",r.to)+"</label>"+
    "<div class='fld'><span>الفروع (متعدد)</span>"+ddBtn("rfBrToggle",brOpts,cc.brs,{multi:true,id:"rfbr",label:cc.label})+"</div>"+
    "<button class='btn brass' onclick='App.printCustom()'>"+IC.print+" طباعة (حسب الفلترة)</button>"+
    "<button class='btn ghost' onclick='App.exportCustom()'>"+IC.dl+" تصدير</button>");
  var head="<th>#</th><th>التاريخ</th><th>المبيعات</th>"+methods.map(function(m){return "<th>"+esc(m.label)+"</th>"}).join("")+"<th>النقد</th>"+(all?"<th>المصروفات</th><th>الإيرادات</th><th>باقي الرصيد</th>":"");
  var rowsHtml=cc.per.map(function(p){
    var extra=all?("<td class='num' style='color:var(--neg)'>"+fmt(p.exp)+"</td><td class='num' style='color:var(--pos)'>"+fmt(p.inc)+"</td><td class='num' style='font-weight:700'>"+fmt(p.car)+"</td>"):"";
    return "<tr class='clk' onclick=\"App.openDay('"+p.d+"')\"><td class='num' style='color:var(--muted)'>"+dayNo(p.d)+"</td><td>"+prettyDate(p.d)+"</td><td class='num'>"+fmt(p.sales)+"</td>"+methods.map(function(m){return "<td class='num'>"+fmt(p.bm[m.id])+"</td>"}).join("")+"<td class='num'>"+fmt(p.cash)+"</td>"+extra+"</tr>";
  }).join("");
  var totRow="<tr class='total'><td colspan='2'>الإجمالي</td><td class='num'>"+fmt(T.sales)+"</td>"+methods.map(function(m){return "<td class='num'>"+fmt(TM[m.id])+"</td>"}).join("")+"<td class='num'>"+fmt(T.cash)+"</td>"+(all?"<td class='num'>"+fmt(T.exp)+"</td><td class='num'>"+fmt(T.inc)+"</td><td></td>":"")+"</tr>";
  var kpis=h("div",{class:"grid kpis"},kpi("المبيعات",fmt(T.sales),"ر.س","brass")+kpi("النقد",fmt(T.cash),"ر.س","pos")+(all?kpi("الإيرادات",fmt(T.inc),"ر.س","")+kpi("المصروفات",fmt(T.exp),"ر.س","neg"):kpi("عدد الأيام",days.length,"","")));
  var chart=cc.per.map(function(p){return{label:p.d.slice(8),value:p.sales}});
  return bar+kpis+h("div",{class:"card"},cardHead("المبيعات في الفترة",esc(cc.label)+" · "+days.length+" يوم")+barChart(chart,"var(--brass)"))+
    h("div",{class:"card"},cardHead("تفاصيل الفترة","")+(days.length?"<div class='tw'><table><thead><tr>"+head+"</tr></thead><tbody>"+rowsHtml+totRow+"</tbody></table></div>":"<div class='emptyline'>لا بيانات في هذه الفترة</div>"));
}
function repMonthly(){
  var ms=monthList();if(!S._rMonth||ms.indexOf(S._rMonth)<0)S._rMonth=ms[ms.length-1];
  var mk=S._rMonth,days=Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).sort(),bal=balances();
  var t={sales:0,cash:0,exp:0,inc:0};var byM={};S.config.methods.forEach(function(m){byM[m.id]=0});
  days.forEach(function(d){var c=computeDay(S.data[d],S.config);t.sales+=c.sales;t.cash+=c.cash;t.exp+=c.totalExpenses;t.inc+=c.totalIncome;S.config.methods.forEach(function(m){byM[m.id]+=c.byM[m.id]})});
  var perBranch={};days.forEach(function(d){(S.data[d].rows||[]).forEach(function(r){if(r.branch)perBranch[r.branch]=(perBranch[r.branch]||0)+num(r.sales)})});
  var pb=Object.keys(perBranch).map(function(b){return{label:b,value:perBranch[b]}}).sort(function(a,b){return b.value-a.value});
  var sel=ddBtn("rMonth",ms.map(function(k){return [k,prettyMonth(k)]}),mk);
  var rows=days.map(function(d){var c=computeDay(S.data[d],S.config);return "<tr class='clk' onclick=\"App.openDay('"+d+"')\"><td class='num' style='color:var(--muted)'>"+dayNo(d)+"</td><td>"+prettyDate(d)+auditBadge(S.data[d])+draftBadge(S.data[d])+"</td><td class='num'>"+fmt(c.sales)+"</td><td class='num'>"+fmt(c.cash)+"</td><td class='num'>"+fmt(c.bankDeposit)+"</td><td class='num' style='color:var(--neg)'>"+fmt(c.totalExpenses)+"</td><td class='num' style='color:var(--pos)'>"+fmt(c.totalIncome)+"</td><td class='num'>"+fmt(c.cashTotal)+"</td><td class='num' style='font-weight:700'>"+fmt(bal[d].carried)+"</td><td class='rowact' style='white-space:nowrap' onclick='event.stopPropagation()'><button class='iconbtn' title='طباعة' onclick=\"App.printDay('"+d+"')\">"+IC.print+"</button><button class='iconbtn danger' title='حذف' onclick=\"App.delDay('"+d+"')\">"+IC.trash+"</button></td></tr>"}).join("");
  var mi=ms.indexOf(mk);
  var mnav="<button class='iconbtn' title='الشهر السابق' "+(mi>0?"onclick='App.rMonthNav(-1)'":"disabled")+">"+IC.chevR+"</button><button class='iconbtn' title='الشهر التالي' "+(mi<ms.length-1?"onclick='App.rMonthNav(1)'":"disabled")+">"+IC.chevL+"</button>";
  return "<div style='display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px'>"+mnav+sel+"<span class='note'>"+(mi+1)+" من "+ms.length+"</span><span style='flex:1'></span><button class='btn brass' onclick='App.printMonth()'>"+IC.print+" طباعة الشهر</button><button class='btn ghost' onclick='App.printMonthDays()' title='كل يوم في صفحة مستقلة'>"+IC.print+" طباعة الأيام (يومية/صفحة)</button><button class='btn ghost' onclick='App.exportMonth()'>"+IC.dl+" تصدير إكسل</button></div>"+
    h("div",{class:"grid kpis"},kpi("المبيعات",fmt(t.sales),"ر.س","brass")+kpi("النقد",fmt(t.cash),"ر.س","pos")+kpi("الإيرادات",fmt(t.inc),"ر.س","")+kpi("المصروفات",fmt(t.exp),"ر.س","neg"))+
    (function(){var dep=0;days.forEach(function(dd){dep+=computeDay(S.data[dd],S.config).bankDeposit});
      var act=num((S.config.bankRecon||{})[mk]);var diff=act-dep;
      return h("div",{class:"card"},cardHead("مطابقة الإيداعات البنكية","مجموع «الإيداع البنكي» مقابل ما وصل الحساب فعلاً")+
        "<div style='display:flex;gap:16px;flex-wrap:wrap;align-items:center'>"+
        "<div class='fld'><span>مجموع الإيداعات المسجّلة</span><b style='font-size:16px'>"+fmt(dep)+" ر.س</b></div>"+
        "<label class='fld'><span>الوارد للحساب فعلياً</span><input inputmode='decimal' style='max-width:160px;text-align:left' value='"+(act||"")+"' onchange='App.bankRecon(this.value)'></label>"+
        "<div class='fld'><span>الفرق</span><b style='font-size:16px;color:"+(diff===0?"var(--pos)":(diff<0?"var(--neg)":"var(--brass)"))+"'>"+(act?((diff>=0?"+":"")+fmt(diff)):"—")+"</b></div></div>"+
        (act&&diff!==0?"<p class='note' style='margin-top:8px;color:var(--neg)'>يوجد فرق — راجع إيداعات الشهر يوماً بيوم.</p>":act?"<p class='note' style='margin-top:8px;color:var(--pos)'>مطابق تماماً ✓</p>":""))})()+
    h("div",{class:"card"},cardHead("ترتيب الفروع بالمبيعات","")+barChartH(pb))+
    h("div",{class:"card"},cardHead("تفاصيل الأيام (اضغط للعرض)",days.length+" يوم")+"<div class='tw'><table><thead><tr><th>#</th><th>التاريخ</th><th>المبيعات</th><th>النقد</th><th>الإيداع</th><th>المصروفات</th><th>الإيرادات</th><th>الإجمالي النقدي</th><th>باقي الرصيد</th><th></th></tr></thead><tbody>"+rows+"<tr class='total'><td colspan='2'>الإجمالي</td><td class='num'>"+fmt(t.sales)+"</td><td class='num'>"+fmt(t.cash)+"</td><td></td><td class='num'>"+fmt(t.exp)+"</td><td class='num'>"+fmt(t.inc)+"</td><td></td><td></td><td></td></tr></tbody></table></div>");
}
function pmCalc(mk){var t={},sales=0,cash=0;S.config.methods.forEach(function(m){t[m.id]=0});
  Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).forEach(function(d){var c=computeDay(S.data[d],S.config);
    sales+=c.sales;cash+=c.cash;S.config.methods.forEach(function(m){t[m.id]+=c.byM[m.id]})});
  return {t:t,sales:sales,cash:cash};}
function repPM(){
  var ms=monthList();if(!S._rMonth||ms.indexOf(S._rMonth)<0)S._rMonth=ms[ms.length-1];
  var mk=S._rMonth,mi=ms.indexOf(mk),cur=pmCalc(mk),prevM=mi>0?pmCalc(ms[mi-1]):null;
  var mnav="<button class='iconbtn' "+(mi>0?"onclick='App.rMonthNav(-1)'":"disabled")+">"+IC.chevR+"</button><button class='iconbtn' "+(mi<ms.length-1?"onclick='App.rMonthNav(1)'":"disabled")+">"+IC.chevL+"</button>";
  var sel=ddBtn("rMonth",ms.map(function(k){return [k,prettyMonth(k)]}),mk);
  function row(label,val,pv){var dd=pv==null?null:val-pv;var ar=dd==null?"":(dd>=0?" <span style='color:var(--pos);font-size:11px'>▲ "+fmt(dd)+"</span>":" <span style='color:var(--neg);font-size:11px'>▼ "+fmt(-dd)+"</span>");
    var pct=cur.sales?(val/cur.sales*100).toFixed(1)+"%":"—";
    return "<tr><td style='font-weight:700'>"+esc(label)+"</td><td class='num'>"+fmt(val)+ar+"</td><td class='num'>"+pct+"</td></tr>"}
  var body=row("النقد",cur.cash,prevM?prevM.cash:null)+S.config.methods.map(function(m){return row(m.label,cur.t[m.id],prevM?prevM.t[m.id]:null)}).join("");
  var tot="<tr class='total'><td>اجمالي المبيعات</td><td class='num'>"+fmt(cur.sales)+"</td><td class='num'>100%</td></tr>";
  return "<div style='display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px'>"+mnav+sel+"<span style='flex:1'></span><button class='btn brass' onclick='App.printPM()'>"+IC.print+" طباعة</button></div>"+
    h("div",{class:"card"},cardHead("طرق الدفع — "+prettyMonth(mk),"للمطابقة مع كشوف البنك والمزوّدين"+(prevM?" · المقارنة مع "+prettyMonth(ms[mi-1]):""))+
      "<div class='tw'><table><thead><tr><th>الطريقة</th><th>المجموع الشهري</th><th>نسبة من المبيعات</th></tr></thead><tbody>"+body+tot+"</tbody></table></div>");
}
function printPM(){var ms=monthList(),mk=S._rMonth||ms[ms.length-1],cur=pmCalc(mk);
  var rows="<tr><td>النقد</td><td class='num'>"+pf(cur.cash)+"</td></tr>"+S.config.methods.map(function(m){return "<tr><td>"+esc(m.label)+"</td><td class='num'>"+pf(cur.t[m.id])+"</td></tr>"}).join("");
  printReport("تقرير طرق الدفع",prettyMonth(mk),"<table class='p-tbl'><thead><tr><th>الطريقة</th><th>المجموع</th></tr></thead><tbody>"+rows+"<tr class='total'><td>اجمالي المبيعات</td><td class='num'>"+pf(cur.sales)+"</td></tr></tbody></table>",3);}
function repBranch(){
  var ms=monthList();var scope=S._bScope||"all";
  var dates=Object.keys(S.data).filter(function(d){return scope==="all"||ymOf(d)===scope}).sort();
  var map={};dates.forEach(function(d){(S.data[d].rows||[]).forEach(function(r){if(!r.branch)return;if(!map[r.branch])map[r.branch]={sales:0,cash:0};var non=S.config.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);map[r.branch].sales+=num(r.sales);map[r.branch].cash+=num(r.sales)-non})});
  var rows=Object.keys(map).map(function(b){return{name:b,sales:map[b].sales,cash:map[b].cash}}).sort(function(a,b){return b.sales-a.sales});
  var grand=rows.reduce(function(a,r){return a+r.sales},0);
  var sel=ddBtn("bScope",[["all","كل الفترات"]].concat(ms.map(function(k){return [k,prettyMonth(k)]})),scope);
  var body=rows.map(function(r,i){return "<tr><td>"+(i+1)+"</td><td style='font-weight:700'>"+esc(r.name)+"</td><td class='num'>"+fmt(r.sales)+"</td><td class='num'>"+fmt(r.cash)+"</td><td class='num'>"+(grand?(r.sales/grand*100).toFixed(1):0)+"%</td></tr>"}).join("");
  return "<div style='margin-bottom:14px'>"+sel+"</div>"+h("div",{class:"card"},cardHead("أداء كل فرع","")+"<div class='tw'><table><thead><tr><th>#</th><th>الفرع</th><th>المبيعات</th><th>النقد</th><th>النسبة</th></tr></thead><tbody>"+(body||"<tr><td colspan='5' class='emptyline'>لا بيانات</td></tr>")+"<tr class='total'><td colspan='2'>الإجمالي</td><td class='num'>"+fmt(grand)+"</td><td colspan='2'></td></tr></tbody></table></div>");
}
function repCompare(){
  var ms=monthList();if(ms.length<1)return "<div class='card'>لا يوجد ما يكفي للمقارنة.</div>";
  if(!S._cA||ms.indexOf(S._cA)<0)S._cA=ms[Math.max(0,ms.length-2)];if(!S._cB||ms.indexOf(S._cB)<0)S._cB=ms[ms.length-1];
  function sum(mk){var t={sales:0,cash:0,exp:0,inc:0};Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).forEach(function(d){var c=computeDay(S.data[d],S.config);t.sales+=c.sales;t.cash+=c.cash;t.exp+=c.totalExpenses;t.inc+=c.totalIncome});return t}
  var A=sum(S._cA),B=sum(S._cB);var mets=[["المبيعات","sales"],["النقد","cash"],["الإيرادات","inc"],["المصروفات","exp"]];
  var selA=ddBtn("cmp",ms.map(function(k){return [k,prettyMonth(k)]}),S._cA,{pre:["A"]});
  var selB=ddBtn("cmp",ms.map(function(k){return [k,prettyMonth(k)]}),S._cB,{pre:["B"]});
  var chart=mets.map(function(m){return{label:m[0],a:A[m[1]],b:B[m[1]]}});
  var body=mets.map(function(m){var diff=B[m[1]]-A[m[1]];var pct=A[m[1]]?diff/A[m[1]]*100:0;var col=diff>=0?"var(--pos)":"var(--neg)";return "<tr><td style='font-weight:700'>"+m[0]+"</td><td class='num'>"+fmt(A[m[1]])+"</td><td class='num'>"+fmt(B[m[1]])+"</td><td class='num' style='color:"+col+"'>"+(diff>=0?"+":"")+fmt(diff)+"</td><td class='num' style='color:"+col+"'>"+(pct>=0?"+":"")+pct.toFixed(1)+"%</td></tr>"}).join("");
  return "<div style='display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px'>"+selA+"<span style='color:var(--muted)'>مقابل</span>"+selB+"</div>"+h("div",{class:"card"},dualBar(chart,prettyMonth(S._cA),prettyMonth(S._cB)))+h("div",{class:"card"},"<div class='tw'><table><thead><tr><th>البند</th><th>"+prettyMonth(S._cA)+"</th><th>"+prettyMonth(S._cB)+"</th><th>الفرق</th><th>النمو</th></tr></thead><tbody>"+body+"</tbody></table></div>");
}
function repYearly(){
  var ys=yearList();if(!S._year||ys.indexOf(S._year)<0)S._year=ys[ys.length-1];
  var y=S._year,rows=[];var tot={sales:0,cash:0,exp:0,inc:0};
  for(var i=1;i<=12;i++){var mk=y+"-"+pad(i);var dd=Object.keys(S.data).filter(function(d){return ymOf(d)===mk});var r={m:AR_MONTHS[i-1],sales:0,cash:0,exp:0,inc:0,days:dd.length};dd.forEach(function(d){var c=computeDay(S.data[d],S.config);r.sales+=c.sales;r.cash+=c.cash;r.exp+=c.totalExpenses;r.inc+=c.totalIncome});tot.sales+=r.sales;tot.cash+=r.cash;tot.exp+=r.exp;tot.inc+=r.inc;rows.push(r)}
  var sel=ddBtn("yr",ys.map(function(yy){return [yy,yy]}),y);
  var yi=ys.indexOf(y);
  var ynav="<button class='iconbtn' title='السنة السابقة' "+(yi>0?"onclick='App.yrNav(-1)'":"disabled")+">"+IC.chevR+"</button><button class='iconbtn' title='السنة التالية' "+(yi<ys.length-1?"onclick='App.yrNav(1)'":"disabled")+">"+IC.chevL+"</button>";
  var chart=rows.map(function(r){return{label:r.m.slice(0,3),value:r.sales}});
  var body=rows.map(function(r){return "<tr><td style='font-weight:700'>"+r.m+"</td><td class='num'>"+(r.days||"-")+"</td><td class='num'>"+fmt(r.sales)+"</td><td class='num'>"+fmt(r.cash)+"</td><td class='num' style='color:var(--pos)'>"+fmt(r.inc)+"</td><td class='num' style='color:var(--neg)'>"+fmt(r.exp)+"</td></tr>"}).join("");
  return "<div style='display:flex;gap:10px;align-items:center;margin-bottom:14px'>"+ynav+sel+"</div>"+h("div",{class:"card"},cardHead("مبيعات شهور "+y,"")+lineChart(chart))+h("div",{class:"card"},"<div class='tw'><table><thead><tr><th>الشهر</th><th>أيام</th><th>المبيعات</th><th>النقد</th><th>الإيرادات</th><th>المصروفات</th></tr></thead><tbody>"+body+"<tr class='total'><td colspan='2'>الإجمالي السنوي</td><td class='num'>"+fmt(tot.sales)+"</td><td class='num'>"+fmt(tot.cash)+"</td><td class='num'>"+fmt(tot.inc)+"</td><td class='num'>"+fmt(tot.exp)+"</td></tr></tbody></table></div>");
}

/* ===== الرسوم ===== */
function niceMax(v){if(v<=0)return 10;var e=Math.pow(10,Math.floor(Math.log10(v)));var m=v/e;var n=m<=1?1:m<=2?2:m<=5?5:10;return n*e}
function barChart(data,color){if(!data.length)return "<div class='emptyline'>لا بيانات</div>";var W=Math.max(320,data.length*38),H=230,pl=48,pb=28,pt=10,pr=8;var max=niceMax(Math.max.apply(null,data.map(function(d){return Math.abs(d.value)})));var gap=(W-pl-pr)/data.length,bw=gap*0.62;var bars=data.map(function(d,i){var hgt=max?Math.abs(d.value)/max*(H-pt-pb):0;var x=pl+i*gap+(gap-bw)/2;return "<rect x='"+x.toFixed(1)+"' y='"+(H-pb-hgt).toFixed(1)+"' width='"+bw.toFixed(1)+"' height='"+hgt.toFixed(1)+"' rx='3' fill='"+color+"'><title>"+esc(d.label)+": "+fmt(d.value)+"</title></rect>"+(data.length<=16?"<text x='"+(x+bw/2).toFixed(1)+"' y='"+(H-pb+13)+"' font-size='10' fill='#7C847D' text-anchor='middle'>"+esc(d.label)+"</text>":"")}).join("");var ticks="";for(var t=0;t<=2;t++){var yy=H-pb-(H-pt-pb)*t/2;ticks+="<line x1='"+pl+"' y1='"+yy+"' x2='"+(W-pr)+"' y2='"+yy+"' stroke='#eee'/><text x='"+(pl-6)+"' y='"+(yy+3)+"' font-size='9' fill='#9aa' text-anchor='end'>"+(max*t/2).toLocaleString("en-US")+"</text>"}return "<div class='tw'><svg class='svgchart' viewBox='0 0 "+W+" "+H+"' style='min-width:"+W+"px;max-height:260px'>"+ticks+bars+"</svg></div>";}
function barChartH(data){
  if(!data.length)return "<div class='emptyline'>لا بيانات</div>";
  var n=data.length,rowH=n>14?24:27,padT=6,padB=6,H=n*rowH+padT+padB,W=680;
  var longest=data.reduce(function(a,d){return Math.max(a,String(d.label).length)},0);
  var fs=longest>22?10:11;
  var LW=Math.min(Math.round(W*0.40),Math.max(96,Math.round(longest*fs*0.58)+14));
  var valW=66,x0=W-LW-8,plotW=x0-valW-6;
  var max=niceMax(Math.max.apply(null,data.map(function(d){return Math.abs(d.value)})))||1;
  var maxCh=Math.max(6,Math.floor((LW-6)/(fs*0.56)));
  function clip(s){s=String(s);return s.length>maxCh?s.slice(0,maxCh-1)+"…":s}
  var g=data.map(function(d,i){var y=padT+i*rowH,cy=y+rowH/2;var w=max?Math.abs(d.value)/max*plotW:0;var bx=x0-w;
    var name="<text x='"+(W-6)+"' y='"+(cy+fs*0.36).toFixed(1)+"' font-size='"+fs+"' fill='#22302C' text-anchor='end'>"+esc(clip(d.label))+"<title>"+esc(d.label)+"</title></text>";
    var bar="<rect x='"+bx.toFixed(1)+"' y='"+(y+5).toFixed(1)+"' width='"+Math.max(1.5,w).toFixed(1)+"' height='"+(rowH-10)+"' rx='3' fill='var(--ink)'><title>"+esc(d.label)+": "+fmt(d.value)+"</title></rect>";
    var val="<text x='"+(bx-5).toFixed(1)+"' y='"+(cy+3.5).toFixed(1)+"' font-size='9.5' fill='#7C847D' text-anchor='end'>"+fmt(d.value)+"</text>";
    return name+bar+val}).join("");
  var axis="<line x1='"+x0+"' y1='"+padT+"' x2='"+x0+"' y2='"+(H-padB)+"' stroke='#e7e1d4'/>";
  return "<div class='tw'><svg class='svgchart' viewBox='0 0 "+W+" "+H+"' preserveAspectRatio='xMidYMid meet' style='width:100%;min-width:480px;max-width:720px;height:auto;max-height:"+Math.min(H,560)+"px'>"+axis+g+"</svg></div>";
}
function dualBar(data,la,lb){var W=Math.max(360,data.length*90),H=260,pl=50,pb=40,pt=12,pr=8;var max=niceMax(Math.max.apply(null,data.map(function(d){return Math.max(d.a,d.b)})));var gap=(W-pl-pr)/data.length,bw=gap*0.28;var bars=data.map(function(d,i){var xa=pl+i*gap+gap/2-bw-3,xb=pl+i*gap+gap/2+3;var ha=max?d.a/max*(H-pt-pb):0,hb=max?d.b/max*(H-pt-pb):0;return "<rect x='"+xa+"' y='"+(H-pb-ha)+"' width='"+bw+"' height='"+ha+"' rx='3' fill='var(--muted)'><title>"+la+" "+esc(d.label)+": "+fmt(d.a)+"</title></rect><rect x='"+xb+"' y='"+(H-pb-hb)+"' width='"+bw+"' height='"+hb+"' rx='3' fill='var(--brass)'><title>"+lb+" "+esc(d.label)+": "+fmt(d.b)+"</title></rect><text x='"+(pl+i*gap+gap/2)+"' y='"+(H-pb+14)+"' font-size='10' fill='#7C847D' text-anchor='middle'>"+esc(d.label)+"</text>"}).join("");var legend="<rect x='"+pl+"' y='0' width='10' height='10' rx='2' fill='var(--muted)'/><text x='"+(pl+14)+"' y='9' font-size='10' fill='#555'>"+esc(la)+"</text><rect x='"+(pl+80)+"' y='0' width='10' height='10' rx='2' fill='var(--brass)'/><text x='"+(pl+94)+"' y='9' font-size='10' fill='#555'>"+esc(lb)+"</text>";return "<div class='tw'><svg class='svgchart' viewBox='0 0 "+W+" "+(H+4)+"' style='min-width:"+W+"px;max-height:290px'>"+legend+bars+"</svg></div>";}
function lineChart(data){var W=Math.max(360,data.length*44),H=240,pl=50,pb=28,pt=12,pr=10;var max=niceMax(Math.max.apply(null,data.map(function(d){return d.value})));var stepX=(W-pl-pr)/(Math.max(1,data.length-1));var pts=data.map(function(d,i){return[pl+i*stepX,H-pb-(max?d.value/max*(H-pt-pb):0),d]});var path=pts.map(function(p,i){return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)}).join(" ");var dots=pts.map(function(p){return "<circle cx='"+p[0].toFixed(1)+"' cy='"+p[1].toFixed(1)+"' r='3' fill='var(--brass)'><title>"+esc(p[2].label)+": "+fmt(p[2].value)+"</title></circle>"}).join("");var labels=pts.map(function(p){return "<text x='"+p[0].toFixed(1)+"' y='"+(H-pb+14)+"' font-size='9' fill='#7C847D' text-anchor='middle'>"+esc(p[2].label)+"</text>"}).join("");return "<div class='tw'><svg class='svgchart' viewBox='0 0 "+W+" "+H+"' style='min-width:"+W+"px;max-height:260px'><path d='"+path+"' fill='none' stroke='var(--brass)' stroke-width='2.5'/>"+dots+labels+"</svg></div>";}

/* ===== الإعدادات ===== */
function viewSettings(){
  var cfg=S.config;var usage={};branchList().forEach(function(b){usage[b.id]=0});
  Object.values(S.data).forEach(function(day){(day.rows||[]).forEach(function(r){var bid=rowBranchId(r);if(bid&&usage[bid]!=null)usage[bid]++})});
  var logoBox=cfg.companyLogo?"<img src='"+cfg.companyLogo+"' alt='شعار المنشأة' style='height:56px;max-width:180px;object-fit:contain;border:1px solid var(--line);border-radius:10px;padding:6px;background:#fff'>":"<div style='height:56px;width:110px;border:1.5px dashed var(--line);border-radius:10px;display:grid;place-items:center;color:var(--muted);font-size:12px'>لا يوجد شعار</div>";
  var logoCard=h("div",{class:"card"},cardHead("شعار المنشأة (للتقارير)","يظهر على التقارير المطبوعة وPDF")+"<div style='display:flex;gap:14px;align-items:center;flex-wrap:wrap'>"+logoBox+"<div style='display:flex;gap:8px;flex-wrap:wrap'><input id='logoFile' type='file' accept='image/png,image/jpeg,image/svg+xml' style='display:none' onchange='App.setLogo(this)'><button class='btn ghost' onclick=\"document.getElementById('logoFile').click()\">"+IC.up+" رفع شعار</button>"+(cfg.companyLogo?"<button class='btn ghost' style='color:var(--neg)' onclick='App.removeLogo()'>إزالة</button>":"")+"</div></div><p class='note' style='margin-top:10px'>يُفضّل صورة PNG بخلفية شفافة أو SVG. إذا لم تُرفع، يظهر شعار افتراضي بسيط لا يؤثر على تنسيق التقرير.</p>");
  var general=h("div",{class:"card"},cardHead("إعدادات عامة","")+h("div",{class:"grid",style:"grid-template-columns:repeat(auto-fit,minmax(220px,1fr))"},"<label class='fld'><span>اسم المنشأة / التقرير</span><input value='"+esc(cfg.businessName)+"' onchange='App.setBiz(this.value)'></label><label class='fld'><span>الرصيد الافتتاحي (ر.س)</span><input inputmode='decimal' value='"+cfg.openingBalance+"' onchange='App.setOpening(this.value)'></label>")+"<p class='note' style='margin-top:10px'>الرصيد الافتتاحي هو رصيد ما قبل أول يوم مسجّل، ومنه تبدأ سلسلة «باقي الرصيد».</p>")+logoCard;
  var brRows=branchList().map(function(b,i){return "<div class='chip' style='display:flex;width:100%;margin:0'><span class='movecol'><button class='movebtn' onclick='App.moveBranch(\""+b.id+"\",-1)'>"+IC.chevU+"</button><button class='movebtn' onclick='App.moveBranch(\""+b.id+"\",1)'>"+IC.chevD+"</button></span><span style='flex:1;font-weight:700'>"+esc(b.name)+"</span><span style='font-size:11px;color:var(--muted)'>"+(usage[b.id]||0)+" يوم</span><button class='iconbtn' onclick='App.renameBranch(\""+b.id+"\")'>"+IC.edit+"</button><button class='iconbtn danger' onclick='App.delBranch(\""+b.id+"\")'>"+IC.trash+"</button></div>"}).join("");
  var branches=h("div",{class:"card"},cardHead("الفروع ("+cfg.branches.length+")","")+"<div style='display:flex;gap:8px;margin-bottom:14px'><input id='newBranch' placeholder='اسم فرع جديد' style='flex:1' onkeydown='if(event.key===\"Enter\")App.addBranch()'><button class='btn' onclick='App.addBranch()'>"+IC.plus+" إضافة</button></div><div class='grid' style='grid-template-columns:repeat(auto-fill,minmax(240px,1fr))'>"+brRows+"</div>");
  var mRows=cfg.methods.map(function(m,i){return "<div class='chip' style='display:flex;width:100%;margin:0'><span class='movecol'><button class='movebtn' onclick='App.moveMethod("+i+",-1)'>"+IC.chevU+"</button><button class='movebtn' onclick='App.moveMethod("+i+",1)'>"+IC.chevD+"</button></span><span style='flex:1;font-weight:700'>"+esc(m.label)+"</span><button class='iconbtn' onclick='App.renameMethod("+i+")'>"+IC.edit+"</button><button class='iconbtn danger' onclick='App.delMethod("+i+")'>"+IC.trash+"</button></div>"}).join("");
  var methods=h("div",{class:"card"},cardHead("طرق الدفع ("+cfg.methods.length+")","عدا النقد")+"<div style='display:flex;gap:8px;margin-bottom:14px'><input id='newMethod' placeholder='طريقة دفع جديدة (مثال: STC Pay)' style='flex:1' onkeydown='if(event.key===\"Enter\")App.addMethod()'><button class='btn' onclick='App.addMethod()'>"+IC.plus+" إضافة</button></div><div class='grid' style='grid-template-columns:repeat(auto-fill,minmax(220px,1fr))'>"+mRows+"</div><p class='note' style='margin-top:10px'>النقد = اجمالي المبيعات − مجموع طرق الدفع أعلاه. رتّب الأعمدة بالأسهم ↑↓ (يغيّر ترتيب الأعمدة في جدول الإدخال والتقارير).</p>");
  var tpl=(cfg.dayTemplate||[]);
  var tplCard=h("div",{class:"card"},cardHead("قالب اليوم الجديد","صفوف الفروع التي تُنشأ تلقائياً في كل يومية جديدة")+
    (tpl.length?"<div class='note' style='margin-bottom:10px'>القالب الحالي ("+tpl.length+"): "+tpl.map(function(b){return esc(b.name)}).join("، ")+"</div>":"<div class='note' style='margin-bottom:10px'>لا يوجد قالب — كل يومية جديدة تبدأ فارغة.</div>")+
    "<div style='display:flex;gap:8px;flex-wrap:wrap'><button class='btn' onclick='App.tplSave()'>حفظ صفوف اليومية الحالية كقالب</button>"+(tpl.length?"<button class='btn ghost' style='color:var(--neg)' onclick='App.tplClear()'>إلغاء القالب</button>":"")+"</div>"+
    "<p class='note' style='margin-top:10px'>الطريقة: افتح «إدخال يومي»، رتّب صفوف فروعك المعتادة، ثم عد هنا واضغط «حفظ كقالب». يتزامن القالب بين أجهزتك.</p>")+
    h("div",{class:"card"},cardHead("اسم هذا الجهاز","يظهر في سجل «آخر التعديلات» — محلي لهذا الجهاز")+
    "<input style='max-width:260px' placeholder='مثال: كمبيوتر المكتب' value='"+esc((function(){try{return localStorage.getItem("dsr_dev_name")||""}catch(e){return ""}})())+"' onchange='App.devName(this.value)'>");
  return secHead("الضبط","الإعدادات")+general+tplCard+branches+methods;
}

/* ===== البيانات ===== */
function viewData(){
  var dayCount=Object.keys(S.data).length,monthCount=new Set(Object.keys(S.data).map(ymOf)).size;var g=S.config.dropbox;
  var stats=h("div",{class:"grid kpis"},kpi("أيام مسجّلة",dayCount,"","")+kpi("أشهر",monthCount,"","brass")+kpi("فروع",S.config.branches.length,"","pos"));
  var edits=Object.keys(S.data).map(function(k){return S.data[k]}).filter(function(x){return x&&x.updatedAt}).sort(function(a,b){return (b.updatedTs||0)-(a.updatedTs||0)||String(b.updatedAt).localeCompare(String(a.updatedAt))}).slice(0,20);
  var leRows=edits.map(function(x){return "<tr class='clk' onclick=\"App.openDay('"+x.date+"')\"><td>"+prettyDate(x.date)+(x.locked?" 🔒":"")+draftBadge(x)+"</td><td style='font-size:12px;color:var(--muted)'>"+esc(x.updatedAt||"")+"</td><td style='font-size:12px'>"+esc(x.updatedBy||"—")+"</td></tr>"}).join("");
  var lastEdits=h("div",{class:"card"},cardHead("آخر التعديلات","أحدث 20 يوماً حسب وقت آخر حفظ — «بواسطة» تعني الجهاز")+(leRows?"<div class='tw'><table><thead><tr><th>اليوم</th><th>آخر تعديل</th><th>بواسطة</th></tr></thead><tbody>"+leRows+"</tbody></table></div>":"<div class='emptyline'>لا سجلات بعد</div>"));
  var yrs={};Object.keys(S.data).forEach(function(k){var y=k.slice(0,4);yrs[y]=(yrs[y]||0)+1});
  var yrRows=Object.keys(yrs).sort().map(function(y){var hid=hiddenY(y);
    return "<div class='chip' style='display:flex;width:100%;margin:0;align-items:center;gap:6px"+(hid?";opacity:.65":"")+"'><span style='flex:1;font-weight:800'>"+y+(hid?" <span style='font-size:10px;color:var(--muted)'>(مخفية)</span>":"")+"</span><span style='font-size:11px;color:var(--muted)'>"+yrs[y]+" يوم</span>"+
    "<button class='iconbtn' title='تصدير إكسل' onclick='App.yrExportX(\""+y+"\")'>"+IC.dl+"</button>"+
    "<button class='iconbtn' title='تصدير JSON' style='font-size:10px;font-weight:900' onclick='App.yrExportJ(\""+y+"\")'>{&nbsp;}</button>"+
    "<button class='btn ghost' style='padding:5px 10px;font-size:11px' onclick='App."+(hid?"yrShow":"yrHide")+"(\""+y+"\")'>"+(hid?"إظهار":"إخفاء من القوائم")+"</button></div>"}).join("");
  var maint=h("div",{class:"card"},cardHead("صيانة وأرشفة السنوات","فحص دوري لسلامة الدفتر + إدارة السنوات المنتهية")+
    "<div style='margin-bottom:12px'><button class='btn' onclick='App.integrity()'>فحص سلامة البيانات</button></div>"+
    "<div class='grid' style='grid-template-columns:repeat(auto-fill,minmax(300px,1fr))'>"+yrRows+"</div>"+
    "<p class='note' style='margin-top:10px'>«الإخفاء» يزيل السنة من القوائم والتقارير فقط — تبقى محفوظة ومتزامنة وداخل سلسلة «باقي الرصيد»، ويمكن إظهارها متى شئت. صدّر السنة (إكسل + JSON) قبل إخفائها كأرشيف خارجي.</p>");
  var bkAt="";try{bkAt=localStorage.getItem("dsr_bk_at")||""}catch(e){}
  var bkCard=cloudOn()?h("div",{class:"card"},cardHead("نسخ احتياطي يومي تلقائي","إلى Dropbox › DailyReport › backups")+
    "<p class='note' style='margin-bottom:10px'>تُحفظ نسخة كاملة مؤرخة تلقائياً مرة كل يوم عند أول فتح للتطبيق. المزامنة ليست بديلاً عن النسخ: الحذف الخاطئ يتزامن لكل الأجهزة، أما النسخة فتبقى.</p>"+
    "<div style='display:flex;gap:10px;align-items:center;flex-wrap:wrap'><button class='btn' onclick='App.backupNow()'>نسخة احتياطية الآن</button><span id='bkLine' class='note'>"+(bkAt?"آخر نسخة: "+esc(bkAt):"لم تُنشأ نسخة بعد")+"</span></div>"+
    "<p class='note' style='margin-top:10px'>الاستعادة: نزّل ملف النسخة من مجلد backups في دروبوكس ثم استخدم زر «استعادة نسخة» أدناه.</p>"):"";
  var sync=cloudOn()?
    h("div",{class:"card"},cardHead(IC.cloud+" المزامنة السحابية","تلقائية")+
      "<div class='warn ok'><b>متصل بالسحابة ✓</b> — عبر خادم آمن (Cloudflare Worker) إلى Dropbox. كل جهاز يفتح الرابط يرى أحدث البيانات تلقائياً، دون تسجيل دخول.</div>"+
      "<p class='note' style='margin:10px 0'>يُحفظ كل تغيير فوراً في السحابة، ويُسحب أحدث نسخة عند فتح التطبيق وعند العودة إليه. الأسرار محفوظة داخل الخادم ولا تصل للمتصفح.</p>"+
      "<div style='display:flex;gap:8px;flex-wrap:wrap'><button class='btn' onclick='App.cloudSyncNow()'>"+IC.dl+" تحديث الآن</button><button class='btn ghost' onclick='App.cloudPushNow()'>"+IC.up+" رفع الآن</button></div>")
    :
    h("div",{class:"card"},cardHead(IC.cloud+" النسخ والمزامنة عبر Dropbox","")+
    "<p class='note' style='margin-bottom:12px'>بياناتك ونسخك الاحتياطية تُحفظ في حسابك على دروبوكس (مجلد <b>DailyReport</b>)، وتُفتح من أي جهاز. الاستضافة تكون على GitHub Pages المجاني.</p>"+
    (g.enabled&&g.refreshToken?
      "<div class='warn ok'><b>مرتبط بدروبوكس ✓</b> — المزامنة التلقائية مفعّلة.</div><div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px'><button class='btn' onclick='App.dbxPush()'>"+IC.up+" رفع الآن</button><button class='btn ghost' onclick='App.dbxPull()'>"+IC.dl+" سحب من دروبوكس</button><button class='btn ghost' onclick='App.dbxBackup()'>حفظ نسخة في دروبوكس</button><button class='btn ghost' style='color:var(--neg)' onclick='App.dbxDisconnect()'>فصل</button></div>"
      :
      "<label class='fld' style='max-width:420px'><span>Dropbox App Key</span><input value='"+esc(g.appKey)+"' placeholder='من console.dropbox.com/apps' oninput='App.dbxKey(this.value)'></label><div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px'><button class='btn' onclick='App.dbxConnect()'>"+IC.cloud+" ربط حساب دروبوكس</button></div><div class='warn'>الخطوات: أنشئ تطبيقاً على <b>dropbox.com/developers</b> (Scoped app · App folder)، فعّل صلاحيات files.content.read و files.content.write، أضف رابط موقعك في Redirect URIs، ثم انسخ الـ App Key هنا واضغط ربط. الربط يعمل بعد رفع التطبيق على GitHub (https).</div>"));
  var exp=h("div",{class:"grid cols2"},
    h("div",{class:"card"},cardHead(IC.dl+" تصدير إكسل","")+"<p class='note' style='margin-bottom:12px'>كل البيانات: ورقة تفصيلية وورقة ملخص شهري تشمل النقد والإيرادات والمصروفات والإجمالي النقدي.</p><button class='btn ghost' onclick='App.exportAll()' "+(dayCount?"":"disabled")+">"+IC.dl+" تصدير كل البيانات</button>")+
    h("div",{class:"card"},cardHead(IC.data+" نسخة احتياطية محلية","")+"<p class='note' style='margin-bottom:12px'>حفظ/استعادة نسخة (JSON) على جهازك مباشرة.</p><div style='display:flex;gap:8px;flex-wrap:wrap'><button class='btn ghost' onclick='App.backup()' "+(dayCount?"":"disabled")+">"+IC.dl+" حفظ نسخة</button><input id='bkFile' type='file' accept='.json' style='display:none' onchange='App.restore(this)'><button class='btn ghost' onclick=\"document.getElementById('bkFile').click()\">"+IC.up+" استعادة</button></div>"));
  var link=h("div",{class:"card"},"<div style='display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap'><div><b style='color:var(--ink)'>"+IC.folder+" الملفات المستوردة</b><div class='note'>لاستيراد ملفات إكسل وإدارة/حذف الملفات المستوردة سابقاً.</div></div><button class='btn' onclick=\"App.go('files')\">فتح صفحة الملفات "+IC.chevL+"</button></div>");
  var about=h("div",{class:"card"},cardHead(IC.folder+" حول التطبيق والتحديثات","")+
    "<div style='display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap'><div class='note'>الإصدار الحالي: <b style='color:var(--ink)'>"+APP_VERSION+"</b> · نسخة البيانات: <b>"+SCHEMA_VERSION+"</b><br>التحديثات تُطبَّق تلقائياً عند نشر نسخة جديدة، وبياناتك وإعداداتك تبقى محفوظة دائماً.</div><button class='btn ghost' onclick='App.checkUpdate()'>"+IC.up+" بحث عن تحديث</button></div>");
  return secHead("الإدارة","البيانات والمزامنة")+stats+bkCard+lastEdits+maint+link+about+sync+exp+(CLOUD?"":"<p class='note' style='text-align:center'>لرفع النظام على الإنترنت: أنشئ مستودع GitHub وارفع كل الملفات وفعّل GitHub Pages. راجع ملف README.</p>");
}
function viewFiles(){
  var dayCount=Object.keys(S.data).length;
  var imp=h("div",{class:"card"},cardHead(IC.up+" استيراد ملفات إكسل","")+"<p class='note' style='margin-bottom:12px'>اختر ملفاً أو أكثر بنفس تنسيق تقرير اليومية. تُسجَّل هنا تلقائياً، والأيام المكرّرة تُحدَّث.</p><input id='xlsFile' type='file' accept='.xlsx,.xls' multiple style='display:none' onchange='App.importXls(this)'><button class='btn' onclick=\"document.getElementById('xlsFile').click()\">"+IC.up+" اختيار ملفات إكسل</button><div id='impResult'></div>");
  var impList=(S.config.imports||[]).slice().sort(function(a,b){return (b.at||"").localeCompare(a.at||"")});
  var filesCard;
  if(impList.length){
    var frows=impList.map(function(r){var present=(r.dates||[]).filter(function(d){return S.data[d]&&S.data[d].importId===r.id}).length;
      var status=present===0?"<span style='color:var(--neg);font-weight:700'>محذوف/مُستبدل</span>":(present<r.count?"<span style='color:var(--amber);font-weight:700'>نشط جزئياً</span>":"<span style='color:var(--pos);font-weight:700'>نشط</span>");
      return "<tr><td style='font-weight:700'>"+esc(r.name)+"</td><td>"+(r.at||"—")+"</td><td class='num'>"+r.count+"</td><td class='num'>"+present+"</td><td>"+status+"</td><td class='rowact' style='white-space:nowrap'><button class='iconbtn' title='تصدير أيام هذا الملف' onclick=\"App.exportImport('"+r.id+"')\">"+IC.dl+"</button><button class='iconbtn danger' title='حذف الملف وبياناته' onclick=\"App.delImport('"+r.id+"')\">"+IC.trash+"</button></td></tr>"}).join("");
    filesCard=h("div",{class:"card"},cardHead(IC.folder+" الملفات المستوردة",impList.length+" ملف")+"<div class='tw'><table><thead><tr><th class='lh'>اسم الملف</th><th class='lh'>تاريخ الاستيراد</th><th class='num'>أيام</th><th class='num'>موجودة</th><th class='lh'>الحالة</th><th class='lh'></th></tr></thead><tbody>"+frows+"</tbody></table></div><p class='note' style='margin-top:10px'>«موجودة» = عدد الأيام التي ما زالت من هذا الملف (لم يُعد استيرادها من ملف أحدث). حذف الملف يزيل أيامه التابعة له فقط، ويمكنك إعادة استيراد نفس الملف في أي وقت.</p>");
  } else {
    filesCard=h("div",{class:"card"},cardHead(IC.folder+" الملفات المستوردة","0 ملف")+"<div class='emptyline' style='text-align:center;padding:14px'>لم تُسجَّل ملفات بعد. الملفات التي تستوردها من الآن تظهر هنا لإدارتها.</div>"+(dayCount?"<p class='note' style='margin-top:4px'>لديك بيانات مستوردة سابقاً (قبل هذه الميزة) لا تحمل سجلّ ملف. يمكنك إدارتها وحذفها حسب الشهر من الجدول بالأسفل، ثم إعادة استيراد الملف الصحيح.</p>":"")); 
  }
  // إدارة البيانات حسب الشهر (تشمل المستورد سابقاً وغير المسجّل)
  var months=monthList().slice().reverse();
  var monthCard="";
  if(months.length){
    var bal=balances();
    var mrows=months.map(function(mk){var dd=Object.keys(S.data).filter(function(d){return ymOf(d)===mk});var t=0;dd.forEach(function(d){t+=computeDay(S.data[d],S.config).sales});
      return "<tr><td style='font-weight:700'>"+prettyMonth(mk)+"</td><td class='num'>"+dd.length+"</td><td class='num'>"+fmt(t)+"</td><td class='rowact' style='white-space:nowrap'><button class='iconbtn' title='تصدير الشهر' onclick=\"App.exportMonthKey('"+mk+"')\">"+IC.dl+"</button><button class='iconbtn danger' title='حذف أيام هذا الشهر' onclick=\"App.delMonth('"+mk+"')\">"+IC.trash+"</button></td></tr>"}).join("");
    monthCard=h("div",{class:"card"},cardHead(IC.data+" إدارة البيانات حسب الشهر","")+"<p class='note' style='margin-bottom:10px'>لحذف أو تصدير كل أيام شهر معيّن — مفيد لإزالة استيراد قديم غير مسجّل ثم إعادة استيراد الملف الصحيح.</p><div class='tw'><table><thead><tr><th class='lh'>الشهر</th><th class='num'>أيام</th><th class='num'>المبيعات</th><th class='lh'></th></tr></thead><tbody>"+mrows+"</tbody></table></div>");
  }
  var trash=(S.config.trash||[]);
  var kindLbl={day:"تقرير يومي",month:"شهر",import:"ملف مستورد",branch:"فرع",method:"طريقة دفع"};
  var trashCard;
  if(trash.length){
    var trows=trash.map(function(e){var cnt=(e.days||[]).length;
      return "<tr><td style='font-weight:700'>"+esc(e.label||"عنصر")+"</td><td>"+(kindLbl[e.kind]||e.kind)+"</td><td class='num'>"+(cnt||"—")+"</td><td>"+(e.at||"—")+"</td><td class='rowact' style='white-space:nowrap'><button class='iconbtn' title='استعادة' onclick=\"App.restoreTrash('"+e.id+"')\">"+IC.back+"</button><button class='iconbtn danger' title='حذف نهائي' onclick=\"App.purgeTrash('"+e.id+"')\">"+IC.trash+"</button></td></tr>"}).join("");
    trashCard=h("div",{class:"card"},cardHead(IC.trash+" سلة المحذوفات",'<button class="link" style="color:var(--neg)" onclick="App.emptyTrash()">تفريغ السلة</button>')+"<div class='tw'><table><thead><tr><th class='lh'>العنصر</th><th class='lh'>النوع</th><th class='num'>أيام</th><th class='lh'>تاريخ الحذف</th><th class='lh'></th></tr></thead><tbody>"+trows+"</tbody></table></div><p class='note' style='margin-top:10px'>كل ما تحذفه (تقارير، ملفات مستوردة، شهور، فروع، طرق دفع) يُنقل هنا. استعده متى شئت أو احذفه نهائياً.</p>");
  } else {
    trashCard=h("div",{class:"card"},cardHead(IC.trash+" سلة المحذوفات","0 عنصر")+"<div class='emptyline' style='text-align:center;padding:14px'>السلة فارغة. أي عنصر تحذفه يظهر هنا لاستعادته لاحقاً.</div>");
  }
  return secHead("الإدارة","الملفات والمحذوفات")+imp+filesCard+monthCard+trashCard;
}

/* ===== استيراد إكسل ===== */
function nrm(s){return String(s==null?"":s).replace(/[\u200e\u200f\u202a-\u202e]/g,"").replace(/[إأآٱا]/g,"ا").replace(/\s+/g," ").trim()}
async function fileHash(buf){try{if(crypto&&crypto.subtle){var h=await crypto.subtle.digest("SHA-256",buf);return Array.prototype.map.call(new Uint8Array(h),function(b){return b.toString(16).padStart(2,"0")}).join("")}}catch(e){}
  var bytes=new Uint8Array(buf),h1=0x811c9dc5;for(var i=0;i<bytes.length;i++){h1^=bytes[i];h1=(h1*0x01000193)>>>0}return "f"+bytes.length.toString(16)+"-"+h1.toString(16)}
function activeImports(){return (S.config.imports||[]).filter(function(im){return (im.dates||[]).some(function(d){return S.data[d]&&S.data[d].importId===im.id})})}
function trashPush(entry){entry.id="t"+uid();entry.at=nowStamp();S.config.trash=S.config.trash||[];S.config.trash.unshift(entry);if(S.config.trash.length>200)S.config.trash=S.config.trash.slice(0,200)}
function sheetDate(sn){var m=String(sn||"").match(/(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);if(!m)return null;
  var y=m[3].length===2?"20"+m[3]:m[3];return y+"-"+pad(+m[2])+"-"+pad(+m[1]);}
function importWorkbook(wb,importId){
  var addedDays=0,skipped=0,sheets=0,newBranches={},newMethods={},writtenDates=[];
  var methodByLabel={};S.config.methods.forEach(function(m){methodByLabel[m.label]=m.id});
  var KNOWN={"الشبكة":"net","آجل":"credit","مرتجع عربون":"refund","تحويل":"transfer","تابي":"tabby","تمارا":"tamara"};
  wb.SheetNames.forEach(function(sn){sheets++;var ws=wb.Sheets[sn];var rows=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:null,blankrows:true});
    var date=sheetDate(sn);if(!date){skipped++;return}
    var hIdx=-1,cols={};for(var i=0;i<rows.length;i++){var r=rows[i]||[];var bi=r.findIndex(function(c){return String(c||"").trim()==="الفرع"});if(bi>=0){hIdx=i;r.forEach(function(c,ci){var t=String(c||"").trim();if(t==="الفرع")cols.branch=ci;else if(t==="اجمالي المبيعات")cols.sales=ci;else if(t==="النقد")cols.cash=ci;else if(t==="ملاحظات")cols.notes=ci;else if(t&&t!=="النقد"&&t!=="اجمالي المبيعات")cols["m:"+ci]=t});break}}
    if(hIdx<0||cols.branch==null){skipped++;return}var rowsOut=[],end=rows.length;
    for(var j=hIdx+1;j<rows.length;j++){var r=rows[j]||[];var name=String(r[cols.branch]||"").trim();if(!name)continue;if(name==="الاجماليات"||name.indexOf("اجمالي")===0){end=j;break}
      var pays={},hasVal=false,sales=cols.sales!=null?num(r[cols.sales]):0;
      Object.keys(cols).forEach(function(ck){if(ck.indexOf("m:")===0){var ci=+ck.slice(2);var label=cols[ck];var mid=KNOWN[label]||methodByLabel[label];if(!mid){mid="m"+uid();S.config.methods.push({id:mid,label:label});methodByLabel[label]=mid;newMethods[label]=1}var v=num(r[ci]);if(v)hasVal=true;pays[mid]=v}});
      if(sales||hasVal){var wasNew=!branchByName(name);var bid=ensureBranch(name);if(wasNew)newBranches[name]=1;rowsOut.push({id:uuid(),branchId:bid,branch:name,sales:sales,pays:pays,notes:cols.notes!=null?String(r[cols.notes]||"").trim():""})}}
    var expenses=[],incomes=[],bank=0,prevBal=null,mode=null;
    for(var k=end;k<rows.length;k++){var r=rows[k]||[];var label="",amount=null;
      for(var ci=0;ci<r.length;ci++){var c=r[ci];if(amount===null&&typeof c==="number")amount=c;if(!label&&typeof c==="string"&&c.trim())label=c.trim()}
      var L=nrm(label);
      if(L==="رصيد سابق"){prevBal=amount;continue}
      if(L==="الايداع البنكي"){bank=amount||0;continue}
      if(L==="المصروفات"){mode="exp";continue}
      if(L==="اجمالي المصروفات"||L==="اجمالى المصروفات"){mode=null;continue}
      if(L==="صافي النقد"||L==="صافى النقد"){mode="inc";continue}                 /* كل ما بعده = إيرادات */
      if(L==="الاجمالي النقدي"||L==="الاجمالى النقدي"){mode=null;continue}        /* نهاية قسم الإيرادات */
      if(["المبلغ","التفاصيل","النقد","الاجماليات","باقي الرصيد"].indexOf(L)>=0)continue;
      if(L.indexOf("اجماليات الشبكة")===0)continue;
      if(mode&&amount!=null&&label){(mode==="inc"?incomes:expenses).push({id:uuid(),amount:amount,details:label})}}
    S.data[date]={uuid:uuid(),date:date,dateTo:"",rows:rowsOut,expenses:expenses,incomes:incomes,bankDeposit:bank,carryIn:(prevBal==null?null:num(prevBal)),importId:importId||null,createdAt:nowStamp(),updatedAt:nowStamp(),printedAt:null};addedDays++;writtenDates.push(date);});
  var allDates=Object.keys(S.data).sort();if(allDates.length){var e0=S.data[allDates[0]];if(e0&&e0.carryIn!=null)S.config.openingBalance=e0.carryIn}
  return{addedDays:addedDays,skipped:skipped,sheets:sheets,newBranches:Object.keys(newBranches),newMethods:Object.keys(newMethods),opening:S.config.openingBalance,writtenDates:writtenDates};
}

/* ===== تصدير إكسل ===== */
function dl(blob,name){var u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;a.click();URL.revokeObjectURL(u)}
function aoaWidths(ws,aoa){var w=[];aoa.forEach(function(r){r.forEach(function(c,i){var l=c==null?0:String(c).length;w[i]=Math.max(w[i]||8,Math.min(l+2,42))})});ws["!cols"]=w.map(function(x){return{wch:x}})}
function exportSheet(aoa,name,file){var wb=XLSX.utils.book_new();var ws=XLSX.utils.aoa_to_sheet(aoa);ws["!dir"]="rtl";aoaWidths(ws,aoa);XLSX.utils.book_append_sheet(wb,ws,name);dl(new Blob([XLSX.write(wb,{bookType:"xlsx",type:"array"})]),file)}
function exportMonthNow(){var mk=S._rMonth||monthList().pop();var days=Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).sort(),bal=balances();
  var head=["التاريخ","المبيعات"].concat(S.config.methods.map(function(m){return m.label})).concat(["النقد","الإيداع البنكي","باقي الرصيد","المصروفات","الإيرادات","صافي النقد","الإجمالي النقدي"]);
  var aoa=[head];var T=new Array(head.length).fill(0);
  days.forEach(function(d){var c=computeDay(S.data[d],S.config);var row=[prettyDate(d),c.sales].concat(S.config.methods.map(function(m){return c.byM[m.id]})).concat([c.cash,c.bankDeposit,bal[d].carried,c.totalExpenses,c.totalIncome,c.netCash,c.cashTotal]);aoa.push(row);row.forEach(function(v,i){if(i>0&&typeof v==="number")T[i]+=v})});
  T[0]="الإجمالي";var totalRow=T.map(function(v,i){return i===0?"الإجمالي":(typeof v==="number"?v:"")});aoa.push(totalRow);
  exportSheet(aoa,"تقرير "+mk,"تقرير_شهري_"+mk+".xlsx");}
function exportDatesNow(dates,file){var wb=XLSX.utils.book_new();var bal=balances();
  var head=["التاريخ","المبيعات"].concat(S.config.methods.map(function(m){return m.label})).concat(["النقد","الإيداع البنكي","باقي الرصيد","المصروفات","الإيرادات","صافي النقد","الإجمالي النقدي"]);
  var aoa=[head];var T=new Array(head.length).fill(0);
  dates.slice().sort().forEach(function(d){if(!S.data[d])return;var c=computeDay(S.data[d],S.config);var row=[prettyDate(d),c.sales].concat(S.config.methods.map(function(m){return c.byM[m.id]})).concat([c.cash,c.bankDeposit,bal[d]?bal[d].carried:0,c.totalExpenses,c.totalIncome,c.netCash,c.cashTotal]);aoa.push(row);row.forEach(function(v,i){if(i>0&&typeof v==="number")T[i]+=v})});
  aoa.push(T.map(function(v,i){return i===0?"الإجمالي":(typeof v==="number"?v:"")}));
  var ws=XLSX.utils.aoa_to_sheet(aoa);ws["!dir"]="rtl";aoaWidths(ws,aoa);XLSX.utils.book_append_sheet(wb,ws,"الأيام");
  dl(new Blob([XLSX.write(wb,{bookType:"xlsx",type:"array"})]),file);}
function exportAllNow(){var wb=XLSX.utils.book_new();
  var dh=["التاريخ","الفرع","اجمالي المبيعات"].concat(S.config.methods.map(function(m){return m.label})).concat(["النقد","ملاحظات"]);var det=[dh];
  Object.keys(S.data).sort().forEach(function(d){(S.data[d].rows||[]).forEach(function(r){if(!r.branch)return;var non=S.config.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);det.push([d,r.branch,num(r.sales)].concat(S.config.methods.map(function(m){return num((r.pays||{})[m.id])})).concat([num(r.sales)-non,r.notes||""]))})});
  var w1=XLSX.utils.aoa_to_sheet(det);w1["!dir"]="rtl";aoaWidths(w1,det);XLSX.utils.book_append_sheet(wb,w1,"التفاصيل");
  var sh=["الشهر","أيام","المبيعات","النقد","الإيرادات","المصروفات","صافي النقد","الإجمالي النقدي"];var sum=[sh];
  monthList().forEach(function(mk){var dd=Object.keys(S.data).filter(function(x){return ymOf(x)===mk});var t={s:0,c:0,i:0,e:0};dd.forEach(function(d){var c=computeDay(S.data[d],S.config);t.s+=c.sales;t.c+=c.cash;t.i+=c.totalIncome;t.e+=c.totalExpenses});sum.push([prettyMonth(mk),dd.length,t.s,t.c,t.i,t.e,t.c-t.e,t.c-t.e+t.i])});
  var w2=XLSX.utils.aoa_to_sheet(sum);w2["!dir"]="rtl";aoaWidths(w2,sum);XLSX.utils.book_append_sheet(wb,w2,"الملخص الشهري");
  dl(new Blob([XLSX.write(wb,{bookType:"xlsx",type:"array"})]),"بيانات_اليومية_"+todayISO()+".xlsx");}
function exportCustomNow(){var cc=customCalc();
  var head=["#","التاريخ","المبيعات"].concat(cc.methods.map(function(m){return m.label})).concat(["النقد"]).concat(cc.all?["المصروفات","الإيرادات","باقي الرصيد"]:[]);
  var aoa=[head];
  cc.per.forEach(function(p){var row=[dayNo(p.d),prettyDate(p.d),p.sales].concat(cc.methods.map(function(m){return p.bm[m.id]})).concat([p.cash]);if(cc.all)row=row.concat([p.exp,p.inc,p.car]);aoa.push(row)});
  var fname=(cc.all?"تقرير":(cc.brs.length===1?"تقرير_"+cc.brs[0]:"تقرير_عدة_فروع"))+"_"+cc.r.from+"_"+cc.r.to+".xlsx";
  exportSheet(aoa,"مخصص",fname);}

/* ===== طباعة ===== */
function dayPrintInner(d,cfg,c,prev,carried){
  var date=d.date;
  var th="<th>الفرع</th><th>المبيعات</th>"+cfg.methods.map(function(m){return "<th>"+esc(m.label)+"</th>"}).join("")+"<th>النقد</th><th>ملاحظات</th>";
  var pv=function(key){var col=(d.tmarks&&d.tmarks[key])||"";return col?" vc c-"+col:""};
  var pvr=function(r,key){var col=(d.verify&&d.verify[r.id+"|"+key])||"";return col?" vc c-"+col:""};
  var prRows=(d.rows||[]).filter(function(r){return num(r.sales)||cfg.methods.some(function(m){return num((r.pays||{})[m.id])})||String(r.notes||"").trim()});
  var body=prRows.map(function(r){var non=cfg.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0);return "<tr><td>"+esc(r.branch||"—")+"</td><td class='num"+pvr(r,"sales")+"'>"+pf(r.sales)+"</td>"+cfg.methods.map(function(m){return "<td class='num"+pvr(r,"pay:"+m.id)+"'>"+pf((r.pays||{})[m.id])+"</td>"}).join("")+"<td class='num"+pvr(r,"cash")+"'>"+pf(num(r.sales)-non)+"</td><td>"+esc(r.notes||"")+"</td></tr>"}).join("");
  var totRow="<tr class='total'><td>الاجماليات</td><td class='num"+pv("sales")+"'>"+pf(c.sales)+"</td>"+cfg.methods.map(function(m){return "<td class='num"+pv(m.id)+"'>"+pf(c.byM[m.id])+"</td>"}).join("")+"<td class='num"+pv("cash")+"'>"+pf(c.cash)+"</td><td></td></tr>";
  var prExp=(d.expenses||[]).filter(itemHas),prInc=(d.incomes||[]).filter(itemHas);
  var exp=prExp.map(function(e){return "<tr><td class='num'>"+pf(e.amount)+"</td><td>"+esc(e.details||"")+"</td></tr>"}).join("");
  var inc=prInc.map(function(e){return "<tr><td class='num'>"+pf(e.amount)+"</td><td>"+esc(e.details||"")+"</td></tr>"}).join("");
  var logoEl=cfg.companyLogo?"<img class='plogo' src='"+cfg.companyLogo+"'>":"<div class='plogo-ph'>"+LOGO_SVG+"</div>";
  var html="<div class='p-wrap'><div class='p-head'><div class='brandcol'>"+logoEl+"<div><h2>"+esc(cfg.businessName)+"</h2><div class='sd'>تقرير اليومية رقم "+dayNo(date)+" — "+prettyDate(d.date)+(d.dateTo?" ← "+prettyDate(d.dateTo):"")+"</div></div></div><div class='meta'>طُبع: "+d.printedAt+"<br>أُنشئ: "+(d.createdAt||"—")+"<br>آخر تعديل: "+(d.updatedAt||"—")+"</div></div>"+
    "<table class='p-tbl'><thead><tr>"+th+"</tr></thead><tbody>"+body+totRow+"</tbody></table>"+
    /* ترتيب الطباعة يطابق ترتيب الشاشة تماماً: الجدول ← [الرصيد النقدي | الإجمالي النقدي] ← [المصروفات | الإيرادات] */
    "<div class='p-two'><div><div class='p-title'>الرصيد النقدي (يُرحّل)</div><table class='p-tbl p-sum'><tbody><tr><td>رصيد سابق</td><td class='num'>"+pf(prev)+"</td></tr><tr><td>نقد المبيعات</td><td class='num'>"+pf(c.cash)+"</td></tr><tr><td>− الإيداع البنكي</td><td class='num'>"+pf(c.bankDeposit)+"</td></tr><tr class='total'><td>باقي الرصيد</td><td class='num"+pv("carried")+"'>"+pf(carried)+"</td></tr></tbody></table></div>"+
    "<div><div class='p-title'>الإجمالي النقدي (بعد المصروفات والإيرادات)</div><table class='p-tbl p-sum'><tbody><tr><td>نقد المبيعات</td><td class='num'>"+pf(c.cash)+"</td></tr><tr><td>− المصروفات</td><td class='num'>"+pf(c.totalExpenses)+"</td></tr><tr><td>= صافي النقد</td><td class='num'>"+pf(c.netCash)+"</td></tr><tr><td>+ الإيرادات</td><td class='num'>"+pf(c.totalIncome)+"</td></tr><tr class='total'><td>الإجمالي النقدي</td><td class='num'>"+pf(c.cashTotal)+"</td></tr></tbody></table></div></div>"+
    (prExp.length||prInc.length?("<div class='p-two'>"+
      (prExp.length?"<div><div class='p-title'>المصروفات</div><table class='p-tbl'><thead><tr><th>المبلغ</th><th>التفاصيل</th></tr></thead><tbody>"+exp+"<tr class='total'><td class='num'>"+pf(c.totalExpenses)+"</td><td>الإجمالي</td></tr></tbody></table></div>":"")+
      (prInc.length?"<div><div class='p-title'>الإيرادات</div><table class='p-tbl'><thead><tr><th>المبلغ</th><th>التفاصيل</th></tr></thead><tbody>"+inc+"<tr class='total'><td class='num'>"+pf(c.totalIncome)+"</td><td>الإجمالي</td></tr></tbody></table></div>":"")+
    "</div>"):"")+
    "<div class='p-audit'>أُنشئ: "+(d.createdAt||"—")+" &nbsp;|&nbsp; آخر تعديل: "+(d.updatedAt||"—")+" &nbsp;|&nbsp; طُبع: "+(d.printedAt||"—")+"</div></div>";
  return html;}
async function printDay(iso){await commitDay();var date=iso||S.curDate;var d=S.data[date]||S.day;if(!d){toast("لا توجد بيانات لهذا اليوم","err");return}var cfg=S.config,c=computeDay(d,cfg);
  d.printedAt=nowStamp();d.locked=true;d.status="approved";
  if(S.data[date]){S.data[date].printedAt=d.printedAt;S.data[date].locked=true;S.data[date].status="approved";await persistDay(date)}
  if(S.day&&S.day.date===date){S.day.locked=true;S.day.status="approved"}
  var prev=dayPrev(d),carried=prev+c.cash-num(d.bankDeposit);
  var html=dayPrintInner(d,cfg,c,prev,carried);

  var root=document.getElementById("printroot");root.innerHTML=html;updateSyncPill();
  fitPrint(root,cfg.methods.length);
  setTimeout(function(){window.print()},80);}
function setPrintPage(orient,zoom){var st=document.getElementById("print-page-style");if(!st){st=document.createElement("style");st.id="print-page-style";document.head.appendChild(st)}
  st.textContent="@media print{@page{size:A4 "+orient+";margin:8mm}#printroot{zoom:"+zoom.toFixed(3)+"}}";}
function fitPrint(root,methodCount,widthOnly){
  var landscape=methodCount>=9;                                   // جداول عريضة → أفقي
  var mm=96/25.4;
  var pageWmm=landscape?281:194,pageHmm=landscape?194:281;        // A4 ناقص هوامش 8مم
  var prev=root.getAttribute("style")||"";
  root.style.cssText="display:block;position:fixed;left:-10000px;top:0;visibility:hidden;width:"+pageWmm+"mm";
  void root.offsetHeight;
  var contentH=root.scrollHeight,contentW=root.scrollWidth;
  root.setAttribute("style",prev);
  var zH=(pageHmm*mm)/contentH,zW=(pageWmm*mm)/contentW;
  var zoom=widthOnly?Math.min(1,zW):Math.min(1,zH,zW);
  if(!isFinite(zoom)||zoom<=0)zoom=1;
  if(zoom<0.5)zoom=0.5;                                            // حد أدنى للوضوح؛ ما بعده يمتد لصفحات
  setPrintPage(landscape?"landscape":"portrait",zoom);
}

/* ===== نافذة اختيار الفرع (احترافية) ===== */
function branchItems(q){q=(q||"").trim();var list=branchList().filter(function(b){return !q||(b.name||"").indexOf(q)>=0});if(!list.length)return "<div class='emptyline' style='text-align:center'>لا نتائج</div>";return list.map(function(b){return "<button class='pick-item' onclick=\"App.chooseBranch('"+b.id+"')\">"+esc(b.name)+"</button>"}).join("");}
function openBranchModal(){_modalType="branch";document.getElementById("modalRoot").innerHTML="<div class='modal-bg' onclick='if(event.target===this)App.closeModal()'><div class='modal'><h3><span>اختر الفرع</span><button class='iconbtn' onclick='App.closeModal()'>"+IC.x+"</button></h3><input placeholder='بحث…' autofocus oninput='App.branchSearch(this.value)'><div class='pick-list' id='brList'>"+branchItems("")+"</div></div></div>";}

/* ===== منتقي التاريخ (بدل حقول input) ===== */
function dateBtn(target,iso){return "<button class='dpbtn' onclick=\"App.openDP('"+target+"','"+(iso||"")+"')\"><span>"+(iso?prettyDate(iso):"اختر التاريخ")+"</span>"+IC.cal+"</button>";}
function renderDP(){_modalType="date";document.getElementById("modalRoot").innerHTML="<div class='modal-bg' onclick='if(event.target===this)App.closeModal()'><div class='modal cal-modal'><div class='dp-x'><button onclick='App.closeModal()'>"+IC.x+"</button></div><div class='cal open'>"+calHTML("dp")+"</div></div></div>";}

function refreshCal(){var el=document.getElementById("cal");if(el)el.innerHTML=calHTML("cal")}

/* ===== سجل التراجع/الإعادة (Undo/Redo) ===== */
var _hist={undo:[],redo:[],lastKey:null,lastAt:0};
function histSnap(){return S.day?JSON.stringify(S.day):null}
function histReset(){_hist.undo=[];_hist.redo=[];_hist.lastKey=null;_hist.lastAt=0;updateHistBtns()}
function histPushRaw(){if(!S.day)return;var s=histSnap();if(s==null)return;_hist.undo.push(s);if(_hist.undo.length>120)_hist.undo.shift();_hist.redo=[];_hist.lastKey=null;_hist.lastAt=0;updateHistBtns()}
function histMark(key){if(!S.day)return;var now=Date.now();if(key&&key===_hist.lastKey&&(now-_hist.lastAt)<900){_hist.lastAt=now;return}var s=histSnap();if(s==null)return;_hist.undo.push(s);if(_hist.undo.length>120)_hist.undo.shift();_hist.redo=[];_hist.lastKey=key||null;_hist.lastAt=now;updateHistBtns()}
function histApply(from,to){if(!S.day||!from.length)return;if(S.day.locked){toast("اليومية مقفلة — افتحها للتعديل","err");return}var cur=histSnap();if(cur!=null)to.push(cur);var s=from.pop();try{S.day=JSON.parse(s)}catch(e){return}_hist.lastKey=null;_hist.lastAt=0;if(S.data[S.day.date])S.data[S.day.date]=S.day;scheduleSave();render();updateHistBtns()}
function updateHistBtns(){var u=document.getElementById("btnUndo"),r=document.getElementById("btnRedo");if(u)u.disabled=!_hist.undo.length;if(r)r.disabled=!_hist.redo.length}
function updateSaveBtn(){var b=document.getElementById("btnSave");if(!b)return;var l=b.querySelector(".slbl");if(S.dirty){b.classList.add("dirty");b.disabled=false;if(l)l.textContent="حفظ التغييرات"}else{b.classList.remove("dirty");b.disabled=true;if(l)l.textContent="محفوظ"}}
function setupKeysUndo(){document.addEventListener("keydown",function(e){
  var mr=document.getElementById("modalRoot");if(mr&&mr.firstChild)return;               /* لا تتعارض مع النوافذ */
  if(!(e.ctrlKey||e.metaKey))return;var k=(e.key||"").toLowerCase();
  if(k==="z"&&!e.shiftKey){if(S.view==="entry"){e.preventDefault();App.undo()}}
  else if(k==="y"||(k==="z"&&e.shiftKey)){if(S.view==="entry"){e.preventDefault();App.redo()}}
});}

/* ===== PWA: تسجيل عامل الخدمة + تحديثات سلسة ===== */
var _updReg=null,_swReloaded=false;
function registerSW(){
  if(!("serviceWorker" in navigator))return;
  navigator.serviceWorker.register("./sw.js").then(function(reg){
    _updReg=reg;
    if(reg.waiting&&navigator.serviceWorker.controller)showUpdateBanner();
    reg.addEventListener("updatefound",function(){var nw=reg.installing;if(!nw)return;
      nw.addEventListener("statechange",function(){if(nw.state==="installed"&&navigator.serviceWorker.controller)showUpdateBanner();});});
    setInterval(function(){reg.update().catch(function(){})},60*60*1000);
  }).catch(function(){});
  navigator.serviceWorker.addEventListener("controllerchange",function(){if(_swReloaded)return;_swReloaded=true;location.reload();});
}
function showUpdateBanner(){
  if(document.getElementById("updBar"))return;
  var b=document.createElement("div");b.id="updBar";b.className="updbar";
  b.innerHTML="<span>"+IC.up+" يتوفّر تحديث جديد للتطبيق — بياناتك محفوظة ولن تتأثر.</span><span class='updacts'><button class='u-now' onclick='App.applyUpdate()'>تحديث الآن</button><button class='u-x' onclick=\"document.getElementById('updBar').remove()\">لاحقاً</button></span>";
  document.body.appendChild(b);
}
/* مزامنة تلقائية عند العودة للتطبيق أو عند عودة الاتصال (لأحدث بيانات عبر الأجهزة) */
function autoSync(){
  if(cloudOn()){if(S._syncing)return;if(S.dirty){scheduleDbx();return}
    S._syncing=true;cloudPull(true).then(function(){S._syncing=false;if(S.view!=="entry"){S.day=null}render();}).catch(function(){S._syncing=false});return;}
  var g=dbxCfg();if(!g||!g.enabled||!g.refreshToken)return;if(S._syncing)return;
  if(S.dirty){scheduleDbx();return}
  S._syncing=true;dbxPull(true).then(function(){S._syncing=false;if(S.view!=="entry"){S.day=null}render();}).catch(function(){S._syncing=false});}
function setupAutoSync(){
  document.addEventListener("visibilitychange",function(){if(!document.hidden)autoSync()});
  window.addEventListener("online",function(){updateSyncPill();autoSync()});
  window.addEventListener("offline",function(){updateSyncPill()});
  setInterval(function(){if(!document.hidden)autoSync()},5*60*1000);
}

/* ===== سحب الصفوف لإعادة الترتيب (يدعم اللمس) ===== */
function setupDrag(){
  var D={active:false,tr:null,pid:null,grip:null};
  document.addEventListener("pointerdown",function(e){
    var g=e.target.closest?e.target.closest(".grip"):null;if(!g)return;
    var tr=g.closest("tr");if(!tr||!tr.getAttribute("data-id"))return;
    if(S.day&&S.day.locked)return;
    e.preventDefault();D.active=true;D.tr=tr;D.grip=g;D.pid=e.pointerId;tr.classList.add("dragging");
    try{g.setPointerCapture(e.pointerId)}catch(_){}
  });
  document.addEventListener("pointermove",function(e){
    if(!D.active)return;
    var body=document.getElementById("entryBody");if(!body)return;
    var y=e.clientY,sibs=[],i;
    for(i=0;i<body.children.length;i++){var r=body.children[i];if(r!==D.tr&&r.getAttribute("data-id"))sibs.push(r)}
    var target=null;
    for(i=0;i<sibs.length;i++){var rc=sibs[i].getBoundingClientRect();if(y<rc.top+rc.height/2){target=sibs[i];break}}
    if(target){if(D.tr.nextSibling!==target)body.insertBefore(D.tr,target)}
    else{var tot=body.querySelector("tr.total");if(tot){if(D.tr.nextSibling!==tot)body.insertBefore(D.tr,tot)}else body.appendChild(D.tr)}
  });
  function end(){
    if(!D.active)return;
    if(D.tr)D.tr.classList.remove("dragging");
    try{D.grip.releasePointerCapture(D.pid)}catch(_){}
    var body=document.getElementById("entryBody");
    if(body&&S.day&&S.day.rows){
      var order=[],i;for(i=0;i<body.children.length;i++){var id=body.children[i].getAttribute("data-id");if(id)order.push(id)}
      var map={};S.day.rows.forEach(function(r){map[r.id]=r});
      var re=order.map(function(id){return map[id]}).filter(Boolean);
      var oldOrder=S.day.rows.map(function(r){return r.id}).join(",");
      if(re.length===S.day.rows.length&&order.join(",")!==oldOrder){histPushRaw();S.day.rows=re;scheduleSave();updateHistBtns()}
    }
    D.active=false;D.tr=null;D.grip=null;
  }
  document.addEventListener("pointerup",end);
  document.addEventListener("pointercancel",end);
}
function setupFxBar(){try{
  if(!window.matchMedia||!matchMedia("(pointer:coarse)").matches)return;
  if(!document.createElement||!document.body||!document.body.appendChild)return;
  var bar=document.createElement("div");bar.className="fxbar";bar.id="fxbar";
  [["=","="],["+","+"],["−","-"],["×","*"],["÷","/"],["(","("],[")",")"],["⌫","BS"]].forEach(function(bd){
    var btn=document.createElement("button");btn.type="button";btn.textContent=bd[0];
    btn.addEventListener("pointerdown",function(ev){ev.preventDefault();var el=S._fxEl;if(!el)return;
      var p1=el.selectionStart==null?String(el.value).length:el.selectionStart,p2=el.selectionEnd==null?p1:el.selectionEnd;
      if(bd[1]==="BS"){if(p1===p2&&p1>0)p1--;el.value=el.value.slice(0,p1)+el.value.slice(p2);}
      else{el.value=el.value.slice(0,p1)+bd[1]+el.value.slice(p2);p1+=1;}
      try{el.setSelectionRange(p1,p1)}catch(e){}
      el.dispatchEvent(new Event("input",{bubbles:true}));});
    bar.appendChild(btn)});
  document.body.appendChild(bar);
  document.addEventListener("focusin",function(e){var t=e.target;
    if(t&&t.tagName==="INPUT"&&t.getAttribute&&t.getAttribute("inputmode")==="decimal"&&!t.disabled){S._fxEl=t;bar.classList.add("show")}});
  document.addEventListener("focusout",function(){setTimeout(function(){
    var a=document.activeElement;
    if(a&&a.tagName==="INPUT"&&a.getAttribute&&a.getAttribute("inputmode")==="decimal")return;
    S._fxEl=null;bar.classList.remove("show")},150)});
}catch(e){}}
function setupKeys2(){
  document.addEventListener("keydown",function(e){
    var t=e.target,tag=(t&&t.tagName||"").toLowerCase();
    var typing=tag==="input"||tag==="textarea"||tag==="select"||(t&&t.isContentEditable);
    if((e.ctrlKey||e.metaKey)&&(e.key==="s"||e.key==="S")){e.preventDefault();window.App.saveNow();return}
    if((e.ctrlKey||e.metaKey)&&(e.key==="p"||e.key==="P")&&(S.view==="entry"||S.view==="day")){e.preventDefault();window.App.printDay(S.curDate);return}
    if(e.altKey&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){
      var dl=e.key==="ArrowRight"?-1:1;
      if(S.view==="entry"){e.preventDefault();window.App.navDay(dl)}
      else if(S.view==="day"){e.preventDefault();window.App.dayNav2(dl)}
      return}
    if(e.key==="/"&&!typing){e.preventDefault();
      var go=function(){setTimeout(function(){var i=document.getElementById("gsInput");if(i){i.focus();if(i.select)i.select()}},80)};
      if(S.view!=="reports"){window.App.go("reports");go()}else go();}
  });
}
function setupKeys(){
  document.addEventListener("keydown",function(e){
    var mr=document.getElementById("modalRoot");if(!mr||!mr.firstChild)return;
    if(e.key==="Escape"){e.preventDefault();if(_modalType==="confirm"||_modalType==="prompt")App.modalCancel();else App.closeModal()}
    else if(e.key==="Enter"){if(_modalType==="confirm"){e.preventDefault();App.modalOk()}else if(_modalType==="prompt"){e.preventDefault();App.modalPromptOk()}}
  });
}

/* ===== نوافذ التأكيد/التنبيه الموحّدة ===== */
var _modalType=null,_modalCb={ok:null,cancel:null};
var IC_WARN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>';
var IC_INFO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>';
function openConfirm(o){try{S._lastConfirm=o}catch(e){}_modalType="confirm";_modalCb={ok:o.onOk||null,cancel:o.onCancel||null};
  var icon=o.danger?"<span class='mi danger'>"+IC_WARN+"</span>":"<span class='mi info'>"+IC_INFO+"</span>";
  var body="<h3 class='mtitle'>"+icon+"<span>"+esc(o.title||"تأكيد")+"</span></h3>"+(o.body?"<p class='mbody'>"+o.body+"</p>":"")+
    "<div class='mactions'><button class='btn ghost' onclick='App.modalCancel()'>"+esc(o.cancel||"إلغاء")+"</button><button class='btn "+(o.danger?"danger":"")+"' onclick='App.modalOk()'>"+esc(o.confirm||"تأكيد")+"</button></div>";
  document.getElementById("modalRoot").innerHTML="<div class='modal-bg' onclick='if(event.target===this)App.modalCancel()'><div class='modal modal-sm' tabindex='-1'>"+body+"</div></div>";
  setTimeout(function(){var m=document.querySelector(".modal-sm");if(m)m.focus()},30);}
function openPrompt(o){_modalType="prompt";_modalCb={ok:o.onOk||null,cancel:null};
  var body="<h3 class='mtitle'><span class='mi info'>"+IC.edit+"</span><span>"+esc(o.title||"")+"</span></h3>"+(o.label?"<label class='mlabel'>"+esc(o.label)+"</label>":"")+
    "<input id='mInput' class='minput' value='"+esc(o.value==null?"":o.value)+"'>"+
    "<div class='mactions'><button class='btn ghost' onclick='App.modalCancel()'>إلغاء</button><button class='btn' onclick='App.modalPromptOk()'>"+esc(o.confirm||"حفظ")+"</button></div>";
  document.getElementById("modalRoot").innerHTML="<div class='modal-bg' onclick='if(event.target===this)App.modalCancel()'><div class='modal modal-sm'>"+body+"</div></div>";
  setTimeout(function(){var i=document.getElementById("mInput");if(i){i.focus();i.select()}},30);}

/* ===== App ===== */
window.App={
  go:function(v){flush(function(){if(v!==S.view)navPush();S.view=v;render()})},
  ddToggle:function(btn){var dd=btn.closest(".dd");if(!dd)return;var was=dd.classList.contains("open");
    S._ddOpen=null;
    Array.prototype.forEach.call(document.querySelectorAll(".dd.open"),function(x){x.classList.remove("open")});
    if(!was){dd.classList.add("open");S._ddOpen=dd.getAttribute?(dd.getAttribute("data-dd")||null):null;var s=dd.querySelector(".dditem.sel");if(s&&s.scrollIntoView){try{s.scrollIntoView({block:"nearest"})}catch(e){}}}},
  ddPick:function(i,j){var e=_ddReg[i];if(!e)return;if(!e.multi)S._ddOpen=null;var fn=window.App&&window.App[e.h];if(typeof fn!=="function")return;fn.apply(null,e.pre.concat([e.vals[j]]))},
  openDay:function(iso){if(!S.data[iso]){toast("لا توجد بيانات لهذا اليوم");return}flush(function(){navPush();S._navList=currentDayContext();S.prevView=(S.view==="day"?S.prevView:S.view);S.curDate=iso;S.view="day";render()})},
  goBack:function(){
    if(!_nav.length){if(S.view==="day"){flush(function(){S.view=(S.prevView&&S.prevView!=="day")?S.prevView:"dashboard";render()})}return}
    var st=_nav.pop();
    flush(function(){S.view=st.view||"dashboard";if(st.curDate)S.curDate=st.curDate;if(st.reportTab)S.reportTab=st.reportTab;if(st.rMonth)S._rMonth=st.rMonth;if(st.year)S._year=st.year;_navScroll=st.scroll||0;render()})},
  dayNav2:function(dl){var l=dayNavList();var i=l.indexOf(S.curDate),j=i+dl;if(i<0||j<0||j>=l.length)return;flush(function(){S.curDate=l[j];render()})},
  rMonthNav:function(dl){var ms=monthList();var i=ms.indexOf(S._rMonth),j=i+dl;if(j<0||j>=ms.length)return;S._rMonth=ms[j];render()},
  yrNav:function(dl){var ys=yearList();var i=ys.indexOf(S._year),j=i+dl;if(j<0||j>=ys.length)return;S._year=ys[j];render()},
  gsQ:function(v){S._gsQ=v;var el=document.getElementById("gsRes");if(el)el.innerHTML=gsResults(v)},
  gsClear:function(){S._gsQ="";render()},
  itType:function(v){S.it.type=v;render()},
  itFrom:function(v){S.it.from=v;render()},
  itTo:function(v){S.it.to=v;render()},
  printCustom:function(){printCustom()},
  printItems:function(){printItems()},
  printMonth:function(){printMonth()},
  printMonthDays:function(){printMonthDays()},
  printPM:function(){printPM()},
  bankRecon:function(v){var ms=monthList();var mk=S._rMonth||ms[ms.length-1];
    S.config.bankRecon=S.config.bankRecon||{};
    if(String(v==null?"":v).trim()===""){delete S.config.bankRecon[mk]}else{S.config.bankRecon[mk]=num(v)}
    saveConfig();render()},
  help:function(){openConfirm({title:"دليل الاستخدام السريع",confirm:"فهمت",onOk:function(){},body:
    "<div style='text-align:right;line-height:1.9;font-size:13px'>"+
    "<b>الصيغ الحسابية:</b> ابدأ أي خانة مبلغ بـ <b>=</b> مثل <b dir='ltr'>=200+300</b> (يدعم + − × ÷ والأقواس) — تُحتسب فوراً وتتحول لرقم عند مغادرة الخانة. الحقول تقبل أرقاماً فقط.<br>"+
    "<b>الإدخال السريع:</b> <b>Enter</b> في الجدول ينقلك لمبيعات الصف التالي (وينشئ صفاً في الآخر)، وفي المصروفات/الإيرادات ينقل للصف التالي أو ينشئه. <b>Tab</b> للتنقل داخل الصف.<br>"+
    "<b>الاختصارات:</b> Ctrl+S حفظ · Ctrl+P طباعة اليوم · Alt+←/→ تنقّل بين الأيام · <b>/</b> بحث شامل.<br>"+
    "<b>تلوين التدقيق:</b> اضغط النقطة بجوار أي خانة (أخضر=صحيح، أحمر=خطأ)، ونقد الصف يُلوَّن من خانته. «مسح ألوان التدقيق» يعيدها دون مساس بالقيم.<br>"+
    "<b>المسودة والاعتماد والقفل:</b> اليومية الجديدة «مسودة» حتى تضغط «اعتماد». الطباعة تعتمد اليوم وتقفله ضد التعديل السهوي (التلوين يبقى مسموحاً) — «فتح للتعديل» يفكّه.<br>"+
    "<b>قالب اليوم ونسخ الأمس:</b> من الإعدادات احفظ فروعك المعتادة كقالب لكل يوم جديد، أو استخدم زر «نسخ فروع آخر يوم» في يومية فارغة.<br>"+
    "<b>المزامنة والتعارض:</b> تعمل تلقائياً بين أجهزتك. إن عدّل جهازان نفس اليوم لحظياً تظهر رسالة تخيّرك: «اعتمد تعديلي» أو «اعتمد السحابة».<br>"+
    "<b>النسخ الاحتياطي:</b> نسخة يومية تلقائية إلى Dropbox › DailyReport › backups. للاستعادة: نزّل ملف النسخة ثم «استعادة نسخة» في صفحة البيانات.<br>"+
    "<b>التقارير:</b> «طرق الدفع» للمطابقة الشهرية مع البنك، و«طباعة الأيام (يومية/صفحة)» تطبع الشهر كله دفعة واحدة.</div>"})},
  integrity:function(){
    var days=Object.keys(S.data).sort();if(!days.length){toast("لا بيانات للفحص","err");return}
    var mism=[],gaps=[],orph=[],bad=[];var names={};branchList().forEach(function(b){names[b.name]=1});
    var run=num(S.config.openingBalance),prevD=null;
    days.forEach(function(dd){var d=S.data[dd];var c=computeDay(d,S.config);
      if(d.carryIn!=null&&Math.abs(num(d.carryIn)-run)>0.009)mism.push({d:dd,saved:num(d.carryIn),exp:run});
      var prev=(d.carryIn!=null)?num(d.carryIn):run;
      run=prev+c.cash-c.bankDeposit;
      if(prevD){var g=Math.round((new Date(dd)-new Date(prevD))/86400000);if(g>7)gaps.push({a:prevD,b:dd,g:g})}
      prevD=dd;
      (d.rows||[]).forEach(function(r){if(r.branch&&!names[r.branch]&&orph.indexOf(r.branch)<0)orph.push(r.branch)});
      (d.expenses||[]).concat(d.incomes||[]).forEach(function(e){var v=e.amount;var t=String(v==null?"":v).trim();if(t!==""&&!/^-?\d+(\.\d+)?$/.test(t))bad.push({d:dd,v:t})});
    });
    function li(t){return "<li style='margin:3px 0'>"+t+"</li>"}
    var out="<div style='text-align:right;line-height:1.8;font-size:13px'>";
    out+="<b>«رصيد سابق» مثبّت يخالف المحسوب:</b> "+(mism.length?("<ul style='margin:6px 18px'>"+mism.slice(0,8).map(function(x){return li(prettyDate(x.d)+": مثبّت "+fmt(x.saved)+" · المحسوب "+fmt(x.exp))}).join("")+(mism.length>8?li("… و"+(mism.length-8)+" أخرى"):"")+"</ul>"):"لا يوجد ✓")+"<br>";
    out+="<b>فجوات تواريخ أطول من 7 أيام:</b> "+(gaps.length?("<ul style='margin:6px 18px'>"+gaps.slice(0,8).map(function(x){return li(prettyDate(x.a)+" ← "+prettyDate(x.b)+" ("+x.g+" يوماً)")}).join("")+"</ul>"):"لا يوجد ✓")+"<br>";
    out+="<b>أسماء فروع غير موجودة في قائمة الفروع:</b> "+(orph.length?esc(orph.slice(0,10).join("، "))+(orph.length>10?" …":""):"لا يوجد ✓")+"<br>";
    out+="<b>مبالغ غير مفهومة في البنود:</b> "+(bad.length?("<ul style='margin:6px 18px'>"+bad.slice(0,8).map(function(x){return li(prettyDate(x.d)+": «"+esc(x.v)+"»")}).join("")+"</ul>"):"لا يوجد ✓")+"</div>";
    openConfirm({title:"فحص سلامة البيانات",body:out,confirm:"حسناً",onOk:function(){}})},
  yrHide:function(y){S.config.hiddenYears=S.config.hiddenYears||[];if(S.config.hiddenYears.indexOf(String(y))<0)S.config.hiddenYears.push(String(y));saveConfig();render();toast("أُخفيت سنة "+y+" من القوائم (البيانات محفوظة)")},
  yrShow:function(y){S.config.hiddenYears=(S.config.hiddenYears||[]).filter(function(x){return x!==String(y)});saveConfig();render();toast("أُظهرت سنة "+y)},
  yrExportX:function(y){if(!window.XLSX){toast("مكتبة إكسل غير محمّلة","err");return}
    var dates=Object.keys(S.data).filter(function(d){return d.slice(0,4)===String(y)}).sort();
    if(!dates.length){toast("لا أيام في هذه السنة","err");return}
    exportDatesNow(dates,"بيانات_"+y+".xlsx");toast("صُدّرت سنة "+y+" (إكسل)")},
  yrExportJ:function(y){var out={exportedAt:nowStamp(),year:String(y),schema:5,openingBalance:S.config.openingBalance,data:{}};
    Object.keys(S.data).forEach(function(d){if(d.slice(0,4)===String(y))out.data[d]=S.data[d]});
    dl(new Blob([JSON.stringify(out,null,1)],{type:"application/json"}),"بيانات_"+y+".json");toast("صُدّرت سنة "+y+" (JSON)")},
  approveDay:function(){if(!S.day)return;histMark("status");S.day.status="approved";if(S.data[S.day.date])S.data[S.day.date].status="approved";scheduleSave();render();toast("اعتُمدت اليومية ✓")},
  unlockDay:function(){openConfirm({title:"فتح اليومية للتعديل؟",body:"طُبعت هذه اليومية وأُقفلت لحمايتها من التعديل السهوي. فتحها يسمح بالتعديل مجدداً (يبقى تاريخ الطباعة).",confirm:"فتح للتعديل",onOk:function(){S.day.locked=false;if(S.data[S.day.date])S.data[S.day.date].locked=false;scheduleSave();render();toast("فُتحت اليومية للتعديل")}})},
  copyPrevDay:function(){if(eGuard())return;
    var ks=Object.keys(S.data).filter(function(x){return x<S.curDate}).sort();
    var src=ks.length?S.data[ks[ks.length-1]]:null;
    if(!src||!(src.rows||[]).length){toast("لا يوجد يوم سابق بصفوف لنسخها","err");return}
    histPushRaw();S.day.rows=(src.rows||[]).map(function(r){return {id:uuid(),branchId:r.branchId||"",branch:r.branch||"",sales:"",pays:{},notes:""}});
    scheduleSave();render();toast("نُسخت فروع "+prettyDate(src.date)+" بقيم فارغة")},
  tplSave:function(){var rows=(S.day&&S.day.rows||[]).filter(function(r){return r.branch});
    if(!rows.length){toast("أضف صفوف الفروع أولاً في يومية ثم احفظها كقالب","err");return}
    S.config.dayTemplate=rows.map(function(r){return {id:r.branchId||"",name:r.branch}});
    saveConfig();render();toast("حُفظ قالب اليوم ("+rows.length+" فرعاً)")},
  tplClear:function(){S.config.dayTemplate=[];saveConfig();render();toast("أُلغي قالب اليوم")},
  backupNow:function(){backupNow(false)},
  devName:function(v){try{localStorage.setItem("dsr_dev_name",String(v||"").trim())}catch(e){}toast("حُفظ اسم الجهاز محلياً")},
  resetCols:function(){_colW={};saveColW();refreshTable();toast("أُعيدت الأعمدة للوضع التلقائي")},
  clearMarks:function(){var d=S.day;if(!d)return;var n=Object.keys(d.verify||{}).length+Object.keys(d.tmarks||{}).length;if(!n){toast("لا توجد ألوان تحقق في هذا اليوم");return}
    openConfirm({title:"إعادة ألوان التدقيق؟",body:"سيتم مسح جميع ألوان التحقق (الأخضر/الأحمر) في هذا اليوم وإرجاع الخلايا لمظهرها الأصلي.<br><b>لن تتأثر أي قيم أو حسابات.</b> يمكنك التراجع بـ Ctrl+Z.",confirm:"مسح الألوان",onOk:function(){histPushRaw();S.day.verify={};S.day.tmarks={};scheduleSave();render();toast("أُعيدت الألوان للوضع الافتراضي")}})},
  editDay:function(iso){navPush();S.curDate=iso;loadDay(iso);S.view="entry";render()},
  newDay:function(){flush(function(){loadDay(todayISO());S.view="entry";render()})},
  navDay:function(dl){flush(function(){loadDay(shiftDate(S.curDate,dl));render()})},
  navToday:function(){flush(function(){loadDay(todayISO());render()})},
  pick:function(iso){flush(function(){S.calOpen=true;loadDay(iso);render()})},
  toggleCal:function(){S.calOpen=!S.calOpen;if(S.calOpen)S.calMode="days";var el=document.getElementById("cal");if(el){el.classList.toggle("open",S.calOpen);el.innerHTML=calHTML("cal")}},
  toggleTwoDay:function(on){if(eGuard())return;S.day.dateTo=on?shiftDate(S.curDate,1):"";scheduleSave();render()},
  setDateTo:function(v){if(eGuard())return;S.day.dateTo=v;scheduleSave();render()},
  addRow:function(){if(eGuard())return;histPushRaw();var nid=uuid();S.day.rows.push({id:nid,branchId:"",branch:"",sales:"",pays:{},notes:""});S._flashRow=nid;scheduleSave();refreshTable()},
  insertBelow:function(id){if(eGuard())return;histPushRaw();var i=S.day.rows.findIndex(function(r){return r.id===id});var nid=uuid();S.day.rows.splice(i+1,0,{id:nid,branchId:"",branch:"",sales:"",pays:{},notes:""});S._flashRow=nid;scheduleSave();refreshTable()},
  addAllBranches:function(){if(eGuard())return;var present={};S.day.rows.forEach(function(r){var bid=rowBranchId(r);if(bid)present[bid]=1});var toAdd=branchList().filter(function(b){return !present[b.id]});if(!toAdd.length){toast("كل الفروع مضافة");return}histPushRaw();toAdd.forEach(function(b){S.day.rows.push({id:uuid(),branchId:b.id,branch:b.name,sales:"",pays:{},notes:""})});scheduleSave();refreshTable()},
  clearRows:function(){if(eGuard())return;openConfirm({title:"مسح كل الصفوف؟",body:"سيتم حذف جميع صفوف هذا اليوم. يمكنك التراجع بـ Ctrl+Z.",danger:true,confirm:"مسح",onOk:function(){histPushRaw();S.day.rows=[];scheduleSave();refreshTable()}})},
  delRow:function(id){if(eGuard())return;histPushRaw();S.day.rows=S.day.rows.filter(function(r){return r.id!==id});scheduleSave();refreshTable()},
  cell:function(el){if(eGuard())return;var id=el.getAttribute("data-r"),f=el.getAttribute("data-f");var r=S.day.rows.find(function(x){return x.id===id});if(!r)return;histMark("cell:"+id+":"+f);
    if(f==="notes"){r.notes=el.value}
    else{var sv=amtRead(el);if(f==="sales")r.sales=sv;else if(f.indexOf("pay:")===0){r.pays=r.pays||{};r.pays[f.slice(4)]=sv}}
    if(f!=="notes"&&S.day.verify){var vk=id+"|"+f;if(S.day.verify[vk]){delete S.day.verify[vk];var td=el.closest("td");if(td){td.className="cell";var dot=td.querySelector(".vdot");if(dot){dot.className="vdot";dot.textContent=""}}}}
    recompute();scheduleSave()},
  tmark:function(key){histPushRaw();var d=S.day;d.tmarks=d.tmarks||{};var order=["","g","r"];var nx=order[(order.indexOf(d.tmarks[key]||"")+1)%order.length];if(nx)d.tmarks[key]=nx;else delete d.tmarks[key];var el=document.getElementById("tot-"+key);if(el)el.className="num tcell"+(nx?" c-"+nx:"");scheduleSave()},
  vmark:function(rid,field){histPushRaw();var d=S.day;d.verify=d.verify||{};var vk=rid+"|"+field;var order=["","g","r"];var nx=order[(order.indexOf(d.verify[vk]||"")+1)%order.length];if(nx)d.verify[vk]=nx;else delete d.verify[vk];
    var inp=document.querySelector(".amt[data-r='"+rid+"'][data-f=\""+field+"\"]");if(inp){var td=inp.closest("td"),dot=td.querySelector(".vdot");td.className="cell"+(nx?" v-"+nx:"");if(dot){dot.className="vdot"+(nx?" v-"+nx:"");dot.textContent=nx==="g"?"✓":nx==="r"?"✕":""}}scheduleSave()},
  rowKey:function(ev,el){
    if(!ev||ev.key!=="Enter")return;if(ev.preventDefault)ev.preventDefault();
    window.App.cellDone(el);                                  /* يثبّت الصيغة إن وُجدت (آمن التكرار) */
    var id=el.getAttribute("data-r");var rows=S.day.rows||[];
    var i=rows.findIndex(function(x){return x.id===id});if(i<0)return;
    if(i+1<rows.length){focusCell(rows[i+1].id)}
    else{window.App.addRow();focusCell(S.day.rows[S.day.rows.length-1].id)}},
  cellDone:function(el){if(S.day&&S.day.locked)return;var f=el.getAttribute("data-f");if(f==="notes")return;var res=amtSettle(el);if(res==null)return;
    var id=el.getAttribute("data-r");var r=S.day.rows.find(function(x){return x.id===id});if(!r)return;
    if(f==="sales")r.sales=res;else if(f.indexOf("pay:")===0){r.pays=r.pays||{};r.pays[f.slice(4)]=res}
    recompute();scheduleSave()},
  itemKey:function(ev,el,kind,i){
    if(!ev||ev.key!=="Enter")return;if(ev.preventDefault)ev.preventDefault();
    var arr=(kind==="exp"?S.day.expenses:S.day.incomes)||[];
    if((el.getAttribute("data-f")||"amount")==="amount"){var res=amtSettle(el);if(res!=null&&arr[i])arr[i].amount=res}
    if(i+1<arr.length){recompute();scheduleSave();focusItem(kind,i+1)}
    else{if(kind==="exp")window.App.addExp();else window.App.addInc();focusItem(kind,arr.length-1)}},
  itemDone:function(el,kind,i){if(S.day&&S.day.locked)return;var res=amtSettle(el);if(res==null)return;histMark(kind+":"+i+":amount");
    var arr=(kind==="exp"?S.day.expenses:S.day.incomes);if(!arr[i])return;arr[i].amount=res;recompute();scheduleSave()},
  amtDone:function(el,kind){if(S.day&&S.day.locked)return;var res=amtSettle(el);if(res==null)return;
    if(kind==="bank"){histMark("bank");S.day.bankDeposit=res}
    else{histMark("carry");if(res==="")delete S.day.carryIn;else S.day.carryIn=num(res)}
    recompute();scheduleSave()},
  vmarkCash:function(rid){histPushRaw();var d=S.day;d.verify=d.verify||{};var vk=rid+"|cash";var order=["","g","r"];var nx=order[(order.indexOf(d.verify[vk]||"")+1)%order.length];if(nx)d.verify[vk]=nx;else delete d.verify[vk];
    var el=document.querySelector("[data-cash='"+rid+"']");
    if(el){el.className="num tcell"+(nx?" c-"+nx:"");if(nx)el.style.color="";else{var i=(d.rows||[]).findIndex(function(x){return x.id===rid});var r=i>=0?d.rows[i]:null;var rc=r?num(r.sales)-S.config.methods.reduce(function(a,m){return a+num((r.pays||{})[m.id])},0):0;el.style.color=rc<0?"var(--neg)":"var(--pos)"}}
    scheduleSave()},
  cmark:function(){histPushRaw();var d=S.day;d.tmarks=d.tmarks||{};var order=["","g","r"];var nx=order[(order.indexOf(d.tmarks.carried||"")+1)%order.length];if(nx)d.tmarks.carried=nx;else delete d.tmarks.carried;var el=document.getElementById("cc-carried");if(el)el.className="carval"+(nx?" c-"+nx:"");scheduleSave()},
  undo:function(){histApply(_hist.undo,_hist.redo)},
  redo:function(){histApply(_hist.redo,_hist.undo)},
  saveNow:function(){if(!S.day)return;if(S.saveTimer){clearTimeout(S.saveTimer);S.saveTimer=null}commitDay().then(function(){updateSaveBtn();var b=document.getElementById("btnSave");if(b){var l=b.querySelector(".slbl");if(l)l.textContent="تم الحفظ ✓"}toast("تم حفظ اليومية")})},
  pickBranch:function(rid){S.pickRow=rid;openBranchModal()},
  branchSearch:function(q){var el=document.getElementById("brList");if(el)el.innerHTML=branchItems(q)},
  chooseBranch:function(id){if(eGuard())return;var b=branchById(id);var r=S.day.rows.find(function(x){return x.id===S.pickRow});if(r&&b){histPushRaw();r.branchId=b.id;r.branch=b.name}App.closeModal();scheduleSave();refreshTable()},
  closeModal:function(){var r=document.getElementById("modalRoot");_modalType=null;
    var bg=r&&r.firstChild;
    if(bg&&bg.classList){
      if(bg.classList.contains&&bg.classList.contains("closing"))return;
      bg.classList.add("closing");
      setTimeout(function(){if(r&&r.firstChild===bg)r.innerHTML=""},160);
    }else if(r){r.innerHTML=""}},
  modalOk:function(){var cb=_modalCb.ok;App.closeModal();_modalCb={ok:null,cancel:null};if(cb)cb()},
  modalCancel:function(){var cb=_modalCb.cancel;App.closeModal();_modalCb={ok:null,cancel:null};if(cb)cb()},
  modalPromptOk:function(){var el=document.getElementById("mInput");var v=el?el.value:"";var cb=_modalCb.ok;App.closeModal();_modalCb={ok:null,cancel:null};if(cb)cb(v)},
  openDP:function(target,cur){cur=cur||todayISO();S.dp={ym:ymOf(cur),sel:cur,target:target,mode:"days"};renderDP()},
  dpPick:function(iso){var t=S.dp.target;App.closeModal();if(App[t])App[t](iso)},
  calAct:function(kind,act,val){
    var isDp=(kind==="dp");
    var ym=isDp?S.dp.ym:S.calMonth;var p=ym.split("-").map(Number),y=p[0],m=p[1]-1;
    function setYM(ny,nm){var v=ny+"-"+pad(nm+1);if(isDp)S.dp.ym=v;else S.calMonth=v}
    function setMode(md){if(isDp)S.dp.mode=md;else S.calMode=md}
    if(act==="cm"){var nm=m+val,ny=y;if(nm<0){nm=11;ny--}if(nm>11){nm=0;ny++}setYM(ny,nm)}
    else if(act==="cy"||act==="py"){setYM(y+val,m)}
    else if(act==="mode"){setMode(val)}
    else if(act==="pm"){setYM(y,val);setMode("days")}
    else if(act==="py2"){setYM(val,m);setMode("months")}
    else if(act==="day"){if(isDp)App.dpPick(val);else{S.calMode="days";App.pick(val)}return}
    else if(act==="today"){var iso=todayISO();if(isDp)App.dpPick(iso);else{S.calMode="days";App.pick(iso)}return}
    if(isDp)renderDP();else refreshCal();
  },
  bank:function(v){if(eGuard())return;histMark("bank");S.day.bankDeposit=(v&&v.tagName)?amtRead(v):v;recompute();scheduleSave()},
  carry:function(v){if(eGuard())return;var val=(v&&v.tagName)?amtRead(v):v;histMark("carry");if(val===""||val==null){delete S.day.carryIn}else{S.day.carryIn=num(val)}recompute();scheduleSave()},
  carryAuto:function(){if(eGuard())return;histPushRaw();delete S.day.carryIn;scheduleSave();render()},
  addExp:function(){if(eGuard())return;histPushRaw();S.day.expenses.push({id:uuid(),amount:"",details:""});S._flashItem="exp";scheduleSave();render()},
  delExp:function(i){if(eGuard())return;histPushRaw();S.day.expenses.splice(i,1);scheduleSave();render()},
  exp:function(i,f,v){if(eGuard())return;histMark("exp:"+i+":"+f);S.day.expenses[i][f]=(f==="amount"&&v&&v.tagName)?amtRead(v):v;recompute();scheduleSave()},
  addInc:function(){if(eGuard())return;histPushRaw();S.day.incomes.push({id:uuid(),amount:"",details:""});S._flashItem="inc";scheduleSave();render()},
  delInc:function(i){if(eGuard())return;histPushRaw();S.day.incomes.splice(i,1);scheduleSave();render()},
  inc:function(i,f,v){if(eGuard())return;histMark("inc:"+i+":"+f);S.day.incomes[i][f]=(f==="amount"&&v&&v.tagName)?amtRead(v):v;recompute();scheduleSave()},
  printDay:function(iso){printDay(iso)},
  dashPreset:function(p){S.dash.preset=p;render()},dashFrom:function(v){S.dash.from=v;render()},dashTo:function(v){S.dash.to=v;render()},
  rtab:function(t){S.reportTab=t;render()},rMonth:function(v){S._rMonth=v;render()},bScope:function(v){S._bScope=v;render()},cmp:function(w,v){if(w==="A")S._cA=v;else S._cB=v;render()},yr:function(v){S._year=v;render()},
  rfFrom:function(v){S.rf.from=v;render()},rfTo:function(v){S.rf.to=v;render()},
  rfBrToggle:function(v){if(v==="__all")S.rf.brs=[];else{var a=S.rf.brs||[];var i=a.indexOf(v);if(i>=0)a.splice(i,1);else a.push(v);S.rf.brs=a}render()},
  exportCustom:function(){if(!window.XLSX){toast("مكتبة إكسل غير محمّلة","err");return}exportCustomNow();toast("تم التصدير")},
  exportMonth:function(){if(!window.XLSX){toast("مكتبة إكسل غير محمّلة","err");return}exportMonthNow()},
  exportAll:function(){if(!window.XLSX){toast("مكتبة إكسل غير محمّلة","err");return}exportAllNow();toast("تم التصدير")},
  importXls:async function(input){var files=Array.from(input.files||[]);if(!files.length)return;
    if(!window.XLSX){toast("مكتبة إكسل غير محمّلة","err");return}
    input.value="";
    var bufs=[],adds=[],reps=[],unread=[];
    for(var i=0;i<files.length;i++){
      try{var buf=await files[i].arrayBuffer();bufs.push(buf);
        var wb=XLSX.read(buf,{type:"array"});
        (wb.SheetNames||[]).forEach(function(nm){var d=sheetDate(nm);if(!d)return;(S.data[d]?reps:adds).push(d)});
      }catch(e){bufs.push(null);unread.push(files[i].name)}
    }
    adds=Array.from(new Set(adds)).sort();reps=Array.from(new Set(reps)).sort();
    function lst(a){var t=a.slice(0,10).map(prettyDate).join("، ");return t+(a.length>10?" … (+"+(a.length-10)+")":"")}
    var body="سيُضاف <b>"+adds.length+"</b> يوماً جديداً"+(adds.length?":<br><span style='font-size:12px;color:var(--muted)'>"+lst(adds)+"</span>":".")+"<br><br>"+
      (reps.length?("سيُستبدل <b style='color:var(--neg)'>"+reps.length+"</b> يوماً موجوداً بمحتوى الملف:<br><span style='font-size:12px;color:var(--neg)'>"+lst(reps)+"</span><br><br>"):"لن يُستبدل أي يوم موجود ✓<br><br>")+
      (unread.length?("تعذّرت قراءة: "+esc(unread.join("، "))+"<br><br>"):"")+
      "الأوراق بلا تاريخ صالح تُتجاهل، والملفات المكررة (نفس البصمة/الاسم) تُحجب تلقائياً في الخطوة التالية.";
    if(!adds.length&&!reps.length){openConfirm({title:"لا أيام قابلة للاستيراد",body:body+"<br>تأكد أن أسماء الأوراق تحمل تواريخ مثل 12-05-2026.",confirm:"حسناً",onOk:function(){}});return}
    openConfirm({title:"معاينة قبل الاستيراد",body:body,confirm:"استيراد الآن",danger:reps.length>0,onOk:function(){window.App._doImport(input,files,bufs)}});
  },
  _doImport:async function(input,files,bufs){
    var res={addedDays:0,skipped:0,sheets:0,newBranches:[],newMethods:[]};var blocked=[];
    for(var i=0;i<files.length;i++){try{var buf=bufs[i];if(!buf)continue;var hash=await fileHash(buf);
      var act=activeImports();
      var dupHash=act.find(function(im){return im.hash&&im.hash===hash});
      var dupName=act.find(function(im){return im.name===files[i].name});
      if(dupHash){blocked.push({name:files[i].name,why:"مطابق تماماً (نفس البصمة) لملف مستورد بتاريخ "+(dupHash.at||"—")+" ("+dupHash.count+" يوم). تم تجاهله لمنع تكرار البيانات."});continue}
      if(dupName){blocked.push({name:files[i].name,why:"يوجد ملف نشط بنفس الاسم مستورد بتاريخ "+(dupName.at||"—")+". لإعادة استيراده احذف الملف القديم أولاً من قائمة الملفات (يذهب لسلة المحذوفات)."});continue}
      var wb=XLSX.read(buf,{type:"array"});var impId="imp"+uid();var r=importWorkbook(wb,impId);
      res.addedDays+=r.addedDays;res.skipped+=r.skipped;res.sheets+=r.sheets;res.newBranches=res.newBranches.concat(r.newBranches);res.newMethods=res.newMethods.concat(r.newMethods);
      if(r.writtenDates&&r.writtenDates.length){S.config.imports=(S.config.imports||[]).filter(function(x){return x.name!==files[i].name});S.config.imports.push({id:impId,name:files[i].name,at:nowStamp(),count:r.writtenDates.length,dates:r.writtenDates.slice(),size:files[i].size,hash:hash})}
    }catch(e){toast("خطأ في ملف: "+e.message,"err")}}
    await persistEverything();render();var box=document.getElementById("impResult");
    if(box){var msg="";if(res.sheets)msg+="<div class='warn ok' style='margin-top:12px'><b>تم الاستيراد.</b> أوراق: "+res.sheets+" · أيام مضافة/محدّثة: <b>"+res.addedDays+"</b>"+(res.skipped?" · تخطّي: "+res.skipped:"")+"<br>الرصيد الافتتاحي (رصيد سابق لأول يوم): <b>"+fmt(S.config.openingBalance)+"</b> ر.س"+(res.newBranches.length?"<br>فروع جديدة: "+res.newBranches.map(esc).join("، "):"")+(res.newMethods.length?"<br>طرق دفع جديدة: "+res.newMethods.map(esc).join("، "):"")+"</div>";
      if(blocked.length)msg+="<div class='warn' style='margin-top:10px'><b>⛔ مُنع استيراد مكرّر ("+blocked.length+"):</b>"+blocked.map(function(b){return "<br>• <b>"+esc(b.name)+"</b> — "+esc(b.why)}).join("")+"</div>";
      box.innerHTML=msg;}
    toast(blocked.length?("مُنع "+blocked.length+" ملف مكرّر"):("تم استيراد "+res.addedDays+" يوم"),blocked.length&&!res.sheets?"err":undefined)},
  delImport:function(id){var rec=(S.config.imports||[]).find(function(x){return x.id===id});if(!rec)return;
    openConfirm({title:"حذف الملف المستورد؟",body:"سيُنقل «<b>"+esc(rec.name)+"</b>» وكل أيامه التابعة له إلى <b>سلة المحذوفات</b>. يمكنك استعادته أو إعادة استيراد الملف نفسه لاحقاً.",danger:true,confirm:"نقل للسلة",onOk:async function(){
      var days=[];(rec.dates||[]).forEach(function(d){if(S.data[d]&&S.data[d].importId===id){days.push({date:d,day:S.data[d]});delete S.data[d]}});
      var importRec=(S.config.imports||[]).find(function(x){return x.id===id});
      S.config.imports=(S.config.imports||[]).filter(function(x){return x.id!==id});
      trashPush({kind:"import",label:"ملف: "+rec.name,days:days,importRec:importRec});
      invalidateBal();await persistEverything();if(S.day&&!S.data[S.day.date])S.day=null;render();toast("نُقل الملف وبياناته إلى السلة")}})},
  exportImport:function(id){if(!window.XLSX){toast("مكتبة إكسل غير محمّلة","err");return}var rec=(S.config.imports||[]).find(function(x){return x.id===id});if(!rec)return;var dates=(rec.dates||[]).filter(function(d){return S.data[d]}).sort();if(!dates.length){toast("لا توجد أيام لتصديرها","err");return}exportDatesNow(dates,"استيراد_"+rec.name.replace(/\.(xlsx|xls)$/i,"")+".xlsx");toast("تم التصدير")},
  exportMonthKey:function(mk){if(!window.XLSX){toast("مكتبة إكسل غير محمّلة","err");return}var dates=Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).sort();if(!dates.length)return;exportDatesNow(dates,"تقرير_"+mk+".xlsx");toast("تم التصدير")},
  delMonth:function(mk){var dates=Object.keys(S.data).filter(function(d){return ymOf(d)===mk}).sort();if(!dates.length)return;
    openConfirm({title:"حذف بيانات "+prettyMonth(mk)+"؟",body:"سيُنقل كل أيام هذا الشهر (<b>"+dates.length+" يوم</b>) إلى <b>سلة المحذوفات</b>. يمكنك استعادتها لاحقاً.",danger:true,confirm:"نقل للسلة",onOk:async function(){
      var days=[];dates.forEach(function(d){days.push({date:d,day:S.data[d]});delete S.data[d]});
      (S.config.imports||[]).forEach(function(r){r.dates=(r.dates||[]).filter(function(d){return S.data[d]})});
      S.config.imports=(S.config.imports||[]).filter(function(r){return (r.dates||[]).length});
      trashPush({kind:"month",label:"شهر: "+prettyMonth(mk),days:days});
      invalidateBal();await persistEverything();if(S.day&&!S.data[S.day.date])S.day=null;render();toast("نُقلت بيانات الشهر إلى السلة")}})},
  delDay:function(iso){var d=S.data[iso];if(!d)return;
    openConfirm({title:"حذف تقرير "+prettyDate(iso)+"؟",body:"سيُنقل هذا التقرير بالكامل (مبيعات الفروع والمصروفات والإيرادات) إلى <b>سلة المحذوفات</b>. يمكنك استعادته لاحقاً.",danger:true,confirm:"نقل للسلة",onOk:async function(){
      trashPush({kind:"day",label:"تقرير "+prettyDate(iso),days:[{date:iso,day:d}]});
      delete S.data[iso];(S.config.imports||[]).forEach(function(r){r.dates=(r.dates||[]).filter(function(x){return S.data[x]})});
      invalidateBal();await persistEverything();if(S.day&&S.day.date===iso)S.day=null;if(S.curDate===iso&&S.view==="day")S.view=(S.prevView&&S.prevView!=="day"?S.prevView:"dashboard");render();toast("نُقل التقرير إلى السلة")}})},
  restoreTrash:function(id){var e=(S.config.trash||[]).find(function(x){return x.id===id});if(!e)return;
    (e.days||[]).forEach(function(o){S.data[o.date]=o.day});
    if(e.kind==="import"&&e.importRec){e.importRec.dates=(e.days||[]).map(function(o){return o.date});S.config.imports=(S.config.imports||[]).filter(function(x){return x.id!==e.importRec.id});S.config.imports.push(e.importRec)}
    if(e.kind==="branch"&&e.value){var bv=(typeof e.value==="object")?e.value:{id:uuid(),name:String(e.value)};if(!branchById(bv.id)&&!branchByName(bv.name))S.config.branches.push(bv)}
    if(e.kind==="method"&&e.value){if(!S.config.methods.some(function(m){return m.id===e.value.id}))S.config.methods.push(e.value)}
    S.config.trash=(S.config.trash||[]).filter(function(x){return x.id!==id});
    invalidateBal();persistEverything();render();toast("تمت الاستعادة")},
  purgeTrash:function(id){var e=(S.config.trash||[]).find(function(x){return x.id===id});if(!e)return;
    openConfirm({title:"حذف نهائي؟",body:"سيُحذف «<b>"+esc(e.label||"عنصر")+"</b>» نهائياً ولا يمكن استرجاعه.",danger:true,confirm:"حذف نهائي",onOk:function(){S.config.trash=(S.config.trash||[]).filter(function(x){return x.id!==id});persistEverything();render();toast("تم الحذف النهائي")}})},
  emptyTrash:function(){if(!(S.config.trash||[]).length)return;openConfirm({title:"تفريغ السلة؟",body:"سيتم حذف كل عناصر السلة نهائياً ولا يمكن استرجاعها.",danger:true,confirm:"تفريغ",onOk:function(){S.config.trash=[];persistEverything();render();toast("تم تفريغ السلة")}})},
  backup:function(){dl(new Blob([JSON.stringify(gatherPayload(),null,2)],{type:"application/json"}),"نسخة_احتياطية_"+todayISO()+".json");toast("تم حفظ النسخة")},
  restore:async function(input){var f=input.files&&input.files[0];if(!f)return;try{var obj=JSON.parse(await f.text());if(!obj.data)throw new Error("ملف غير صالح");openConfirm({title:"استبدال كل البيانات؟",body:"سيتم استبدال جميع البيانات الحالية بمحتوى الملف. لا يمكن التراجع.",danger:true,confirm:"استبدال",onOk:async function(){var localDbx=S.config.dropbox;var cfg=obj.config||S.config;cfg.dropbox=localDbx;var mig=runMigrations(cfg,obj.data||{},(obj.schema||1));S.config=mig.config;S.data=mig.data;invalidateBal();await persistEverything();await DB.set("dsr_meta",{schema:SCHEMA_VERSION,appVersion:APP_VERSION,updatedAt:nowStamp()});S.day=null;render();toast("تمت الاستعادة")}})}catch(e){toast("تعذّرت الاستعادة: "+e.message,"err")}input.value=""},
  applyUpdate:function(){var b=document.getElementById("updBar");if(b)b.remove();if(_updReg&&_updReg.waiting){_updReg.waiting.postMessage({type:"SKIP_WAITING"})}else{location.reload()}},
  checkUpdate:function(){toast("جارٍ البحث عن تحديث…");try{if("serviceWorker" in navigator)navigator.serviceWorker.getRegistration().then(function(reg){if(reg)reg.update()})}catch(e){}
    fetch("./version.json?ts="+Date.now(),{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){if(j&&j.version&&j.version!==APP_VERSION){toast("يتوفّر إصدار "+j.version+" — سيظهر زر التحديث");}else{toast("أنت على أحدث إصدار ("+APP_VERSION+")")}}).catch(function(){toast("تعذّر التحقق من التحديث","err")})},
  setBiz:function(v){S.config.businessName=v.trim()||"تقرير اليومية";saveConfig();render()},
  setLogo:function(input){var f=input.files&&input.files[0];if(!f)return;if(f.size>2*1024*1024&&f.type!=="image/svg+xml"){toast("الحجم كبير (أقصى 2MB)","err");return}
    var rd=new FileReader();rd.onload=function(){var data=rd.result;
      if(f.type==="image/svg+xml"){S.config.companyLogo=data;saveConfig();render();toast("تم حفظ الشعار");return}
      var img=new Image();img.onload=function(){var mx=320,sc=Math.min(1,mx/img.width);var cv=document.createElement("canvas");cv.width=Math.round(img.width*sc);cv.height=Math.round(img.height*sc);cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);try{S.config.companyLogo=cv.toDataURL("image/png");}catch(e){S.config.companyLogo=data}saveConfig();render();toast("تم حفظ الشعار")};img.onerror=function(){S.config.companyLogo=data;saveConfig();render()};img.src=data;};
    rd.readAsDataURL(f);input.value="";},
  removeLogo:function(){S.config.companyLogo="";saveConfig();render();toast("تمت إزالة الشعار")},
  setOpening:function(v){S.config.openingBalance=num(v);invalidateBal();saveConfig();render()},
  addBranch:function(){var el=document.getElementById("newBranch");var n=(el.value||"").trim();if(!n)return;if(branchByName(n)){toast("الفرع موجود","err");return}S.config.branches.push({id:uuid(),name:n});saveConfig();render()},
  delBranch:function(id){var b=branchById(id);if(!b)return;openConfirm({title:"حذف الفرع؟",body:"سيُنقل الفرع «<b>"+esc(b.name)+"</b>» إلى سلة المحذوفات. البيانات المسجّلة عليه لا تتأثر.",danger:true,confirm:"نقل للسلة",onOk:function(){S.config.branches=branchList().filter(function(x){return x.id!==id});trashPush({kind:"branch",label:"فرع: "+b.name,value:{id:b.id,name:b.name}});saveConfig();render();toast("نُقل الفرع إلى السلة")}})},
  renameBranch:function(id){var b=branchById(id);if(!b)return;var old=b.name;openPrompt({title:"تعديل اسم الفرع",label:"الاسم الجديد",value:old,onOk:function(n){n=(n||"").trim();if(!n||n===old)return;b.name=n;
    Object.keys(S.data).forEach(function(d){(S.data[d].rows||[]).forEach(function(r){if((r.branchId&&r.branchId===id)||(!r.branchId&&r.branch===old)){r.branchId=id;r.branch=n}})});
    persistEverything();render()}})},
  addMethod:function(){var el=document.getElementById("newMethod");var n=(el.value||"").trim();if(!n)return;if(S.config.methods.some(function(m){return m.label===n})){toast("موجودة","err");return}S.config.methods.push({id:"m"+uid(),label:n});saveConfig();render()},
  delMethod:function(i){var m=S.config.methods[i];openConfirm({title:"حذف طريقة الدفع؟",body:"ستُنقل «<b>"+esc(m.label)+"</b>» إلى سلة المحذوفات.",danger:true,confirm:"نقل للسلة",onOk:function(){S.config.methods.splice(i,1);trashPush({kind:"method",label:"طريقة دفع: "+m.label,value:m});saveConfig();render();toast("نُقلت إلى السلة")}})},
  renameMethod:function(i){openPrompt({title:"تعديل طريقة الدفع",label:"الاسم الجديد",value:S.config.methods[i].label,onOk:function(n){n=(n||"").trim();if(!n)return;S.config.methods[i].label=n;saveConfig();render()}})},
  moveMethod:function(i,dir){var j=i+dir;if(j<0||j>=S.config.methods.length)return;var t=S.config.methods[i];S.config.methods[i]=S.config.methods[j];S.config.methods[j]=t;saveConfig();render()},
  moveBranch:function(id,dir){var l=branchList();var i=l.findIndex(function(x){return x.id===id});if(i<0)return;var j=i+dir;if(j<0||j>=l.length)return;var t=l[i];l[i]=l[j];l[j]=t;saveConfig();render()},
  dbxKey:function(v){S.config.dropbox.appKey=v.trim();DB.set("dsr_config",S.config)},
  cloudSyncNow:function(){if(!cloudOn()){toast("المزامنة السحابية غير مُعدّة","err");return}if(S.sync.conflict){App.cloudResolveRefresh();return}var wasDirty=S.config.cloudDirty;cloudPull(false).then(function(){if(!wasDirty)render()})},
  cloudPushNow:function(){if(!cloudOn()){toast("المزامنة السحابية غير مُعدّة","err");return}if(S.sync.conflict){toast(CONFLICT_MSG,"err");return}S.config.cloudDirty=true;cloudPush().then(function(){if(!S.sync.conflict)toast("تم الرفع إلى السحابة")})},
  cloudResolveRefresh:function(){openConfirm({title:"اعتماد نسخة السحابة؟",body:"سيتم <b>جلب</b> أحدث نسخة من السحابة، وإلغاء تعديلاتك المحلية غير المرفوعة على السجلات المتعارضة. لن يُكتب فوق عمل الجهاز الآخر.",danger:true,confirm:"اعتمد السحابة",onOk:function(){S.sync.conflict=false;S.config.cloudDirty=false;S.config.pendingOps=[];S.config.baseRev="";DB.set("dsr_config",S.config);hideConflictBanner();cloudPull(false)}})},
  cloudKeepMine:function(){openConfirm({title:"اعتماد تعديلك؟",body:"سيتم دمج تعديلاتك فوق أحدث نسخة سحابية: نسختك تفوز في السجلات المتعارضة فقط، مع الحفاظ على تعديلات الجهاز الآخر في بقية السجلات.",danger:true,confirm:"اعتمد تعديلي",onOk:async function(){
    if(!cloudOn())return;if(S._io){toast("المزامنة جارية…");return;}S._io=true;hideConflictBanner();setSync("busy");
    try{var res=await cloudLoad();var remoteRev=res.rev||"",obj=res.payload;
      var base={config:(obj&&obj.config)?cfgRecords(runMigrations(obj.config,obj.data||{},(obj&&obj.schema)||1).config):cfgRecords(S.config),
                data:(obj&&obj.data)?runMigrations(obj.config||{},obj.data,(obj&&obj.schema)||1).data:{}};
      ensureQueue();var rep=replayOps(base,S.config.pendingOps,true);   /* force: نسختي تفوز في المتعارض */
      var localDbx=S.config.dropbox;var mergedCfg=JSON.parse(JSON.stringify(S.config));
      Object.keys(rep.merged.config).forEach(function(k){mergedCfg[k]=rep.merged.config[k]});
      mergedCfg.dropbox=localDbx;S.config=mergedCfg;S.data=rep.merged.data;S.config.baseRev=remoteRev;
      var newRev=await cloudSave(gatherPayload(),remoteRev);
      S.config.baseRev=newRev;S.config.cloudDirty=false;S.sync.conflict=false;S.config.pendingOps=[];setBaseSnap();
      S._noPush=true;invalidateBal();await persistEverything();S._noPush=false;
      setSync("on");S.sync.last=nowStamp();if(S.day&&S.data[S.day.date])loadDay(S.day.date);render();toast("تم اعتماد تعديلك");
    }catch(e){setSync("err");if(e&&e.conflict){onCloudConflict([])}else toast("تعذّر الاعتماد","err")}
    finally{S._io=false}}})},
  dbxConnect:function(){dbxConnect()},dbxPush:function(){dbxPush().then(function(){toast("تم الرفع لدروبوكس")})},dbxPull:function(){dbxPull(false)},dbxBackup:function(){dbxBackup()},
  dbxDisconnect:function(){openConfirm({title:"فصل حساب Dropbox؟",body:"تبقى بياناتك على جهازك. يمكنك إعادة الربط لاحقاً.",confirm:"فصل",onOk:function(){S.config.dropbox={appKey:S.config.dropbox.appKey,refreshToken:"",enabled:false};DBX={access:null,exp:0};DB.set("dsr_config",S.config);updateSyncPill();render()}})}
};
function flush(cb){if(S.saveTimer){clearTimeout(S.saveTimer);S.saveTimer=null;commitDay().then(cb)}else cb()}

/* ===== إقلاع ===== */
(async function init(){
  installIcons();setupDrag();setupKeys();setupKeys2();setupKeysUndo();setupColResize();setupDD();setupFxBar();scheduleDailyBackup();
  await loadAll();
  try{var qp=new URLSearchParams(location.search);if(qp.get("code")){try{await dbxExchange(qp.get("code"));toast("تم الربط مع دروبوكس")}catch(e){toast("تعذّر الربط مع دروبوكس","err")}try{history.replaceState({},"",redirectUri())}catch(e){}}}catch(e){}
  if(cloudOn()){try{await cloudPull(true)}catch(e){}}   /* نزّل أحدث نسخة من السحابة قبل العرض */
  loadDay(S.curDate);render();
  registerSW();setupAutoSync();
  if(!cloudOn()&&S.config.dropbox&&S.config.dropbox.enabled&&S.config.dropbox.refreshToken){await dbxPull(true);render()}
})();
})();
</script>
</body>
</html>
