import { useState, useEffect } from "react";

const TODAY = new Date().toISOString().split("T")[0];
const KEY = "e_tasks_cloud";
const CAT_KEY = "e_cats_v2";

const PLBL = {high:"높음",mid:"보통",low:"낮음"};
const PCOL = {high:["#B91C1C","#FEE2E2"],mid:["#B45309","#FEF3C7"],low:["#15803D","#DCFCE7"]};
const SLBL = {todo:"예정",prog:"진행중",done:"완료"};
const SCOL = {todo:["#6B7280","#F3F4F6"],prog:["#2563EB","#DBEAFE"],done:["#16A34A","#DCFCE7"]};

const DEFAULT_CATS = [
  {name:"콘텐츠/마케팅",icon:"🎨",color:["#185FA5","#DBEAFE"]},
  {name:"온라인몰",icon:"🛒",color:["#7C3AED","#EDE9FE"]},
  {name:"B2B",icon:"🤝",color:["#0F6E56","#D1FAE5"]},
  {name:"지원업무",icon:"🗂",color:["#B45309","#FEF3C7"]},
  {name:"법인",icon:"🏢",color:["#9D174D","#FCE7F3"]},
];

const KR_HOLIDAYS = {
  "2026-01-01":"신정","2026-01-28":"설날연휴","2026-01-29":"설날","2026-01-30":"설날연휴",
  "2026-03-01":"삼일절","2026-05-05":"어린이날","2026-05-24":"부처님오신날",
  "2026-06-06":"현충일","2026-08-15":"광복절","2026-09-24":"추석연휴",
  "2026-09-25":"추석","2026-09-26":"추석연휴","2026-10-03":"개천절",
  "2026-10-09":"한글날","2026-12-25":"크리스마스"
};

const EXTRA_COLORS = [["#185FA5","#DBEAFE"],["#7C3AED","#EDE9FE"],["#0F6E56","#D1FAE5"],["#B45309","#FEF3C7"],["#9D174D","#FCE7F3"],["#1D4ED8","#EFF6FF"]];

const INIT = [
  {id:1,title:"싱가폴 고객 리뷰 영상 수정 — 첫 번째 이미지로 교체",cat:"콘텐츠/마케팅",status:"todo",priority:"mid",due:TODAY,who:"",created:1},
  {id:2,title:"정은쌤 영상 수정 — 첫 번째 이미지로 교체",cat:"콘텐츠/마케팅",status:"todo",priority:"mid",due:TODAY,who:"",created:2},
  {id:3,title:"QR pop 수정",cat:"콘텐츠/마케팅",status:"todo",priority:"mid",due:TODAY,who:"",created:3},
  {id:4,title:"카카오 QR 시안 작업",cat:"콘텐츠/마케팅",status:"todo",priority:"mid",due:TODAY,who:"",created:4},
  {id:5,title:"해외바이어 발굴 — 이메일 자동발송 셋팅 완료",cat:"B2B",status:"done",priority:"mid",due:TODAY,who:"",created:5},
  {id:6,title:"카프_본평가 개선계획_보완 작성 및 제출",cat:"지원업무",status:"done",priority:"high",due:TODAY,who:"",created:6},
  {id:7,title:"비용책자_스킨케어_베트남, 중간체",cat:"콘텐츠/마케팅",status:"todo",priority:"mid",due:TODAY,who:"",created:7},
  {id:8,title:"매입세금계산서 체크",cat:"법인",status:"todo",priority:"mid",due:"2026-04-13",who:"",created:8},
  {id:9,title:"포스트 등록",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:9},
  {id:10,title:"BCB 블로그 등록 방법 공유 (한정은)",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"한정은",created:10},
  {id:11,title:"Tribeau 일본 업무 진행 여부 확인 (은경)",cat:"B2B",status:"done",priority:"mid",due:"2026-04-01",who:"은경",created:11},
  {id:12,title:"구인 등록 — 간호사/상담코디",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-01",who:"",created:12},
  {id:13,title:"상담 강리안 님 통화",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-01",who:"강리안",created:13},
  {id:14,title:"간호사 김예은 님 통화",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-01",who:"김예은",created:14},
  {id:15,title:"구글 리뷰 신규 연동 요청 확인",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:15},
  {id:16,title:"크트 3월 정산내역서 작성 및 확인",cat:"법인",status:"done",priority:"mid",due:"2026-04-01",who:"",created:16},
  {id:17,title:"후기영상 업로드 — 대만리뷰1 검토요청",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:17},
  {id:18,title:"후기영상 — 대만리뷰2",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:18},
  {id:19,title:"구글리뷰 댓글 요청 — 제은경/이나연",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:19},
  {id:20,title:"상담녹음 원장님 1개 스크립트 작업",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:20},
  {id:21,title:"상담녹음 상담 4개 스크립트 확인/수정",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:21},
  {id:22,title:"페북문의 대만 임영토스2",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:22},
  {id:23,title:"현진샵 리쥬란 주문 발주 및 종이백 요청",cat:"온라인몰",status:"done",priority:"mid",due:"2026-04-01",who:"",created:23},
  {id:24,title:"현진샵 구매영수증 작성 / 입금확인 현영발급",cat:"법인",status:"done",priority:"mid",due:"2026-04-01",who:"",created:24},
  {id:25,title:"3월 통장거래내역 정리 (하나&부산)",cat:"법인",status:"done",priority:"mid",due:"2026-04-01",who:"",created:25},
  {id:26,title:"4월 직원화장품 신청 공지",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-01",who:"",created:26},
  {id:27,title:"비용책자 스킨케어 — 국문 추가 수정 / 외국어 작업",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-01",who:"",created:27},
  {id:28,title:"상담 강리안 님 면접 확정",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-02",who:"강리안",created:28},
  {id:29,title:"간호사 김예은 면접 확정/취소 — 민경님 복직으로 구인 마감",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-02",who:"김예은",created:29},
  {id:30,title:"전후사진 제목정렬 수정 후 재공유",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-02",who:"",created:30},
  {id:31,title:"비용책자 스킨케어 외국어 작업",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-02",who:"",created:31},
  {id:32,title:"비용책자 스킨케어 외국어 작업 (2차)",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-03",who:"",created:32},
  {id:33,title:"구글애즈 영상/사진 작업",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-03",who:"",created:33},
  {id:34,title:"러시아 포스트 검수",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-03",who:"",created:34},
  {id:35,title:"포스트 등록",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-03",who:"",created:35},
  {id:36,title:"구글애즈 영상/사진 작업 (2차)",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-04",who:"",created:36},
  {id:37,title:"현진샵 전달 완료",cat:"온라인몰",status:"done",priority:"mid",due:"2026-04-06",who:"",created:37},
  {id:38,title:"4월 직원화장품 입금확인 / 현영발급 / 배부",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-06",who:"",created:38},
  {id:39,title:"비용책자 스킨케어 외국어 수정 / 베트남",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-06",who:"",created:39},
  {id:40,title:"PC 바탕화면 이미지 시안작업",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-06",who:"",created:40},
  {id:41,title:"상담 박아름 1차통화 / 면접조율",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-06",who:"박아름",created:41},
  {id:42,title:"상담 김정영 영어테스트 — 윤지순 님 연락",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-06",who:"김정영",created:42},
  {id:43,title:"면접 변경 — 강리안 8일→9일 1PM",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-06",who:"강리안",created:43},
  {id:44,title:"수술후주의사항 양식 수정",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-06",who:"",created:44},
  {id:45,title:"보고서 작성 — 경영지원 & 홍보대행 / BCB 유입",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-07",who:"",created:45},
  {id:46,title:"4월 화장품 공구 기획안 준비",cat:"온라인몰",status:"done",priority:"mid",due:"2026-04-07",who:"",created:46},
  {id:47,title:"PC 바탕화면 이미지+로고 4장",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-07",who:"",created:47},
  {id:48,title:"구글 전후사진 영상 수정 / 동의 재확인 가림처리",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-07",who:"",created:48},
  {id:49,title:"비용책자 스킨케어 외국어 수정 / 인쇄요청 / 홈페이지 업로드",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-07",who:"",created:49},
  {id:50,title:"상담 김정영 영어인터뷰 일정 조율 — 면접 취소",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-07",who:"김정영",created:50},
  {id:51,title:"간호사 구인 등록 (사람인)",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-07",who:"",created:51},
  {id:52,title:"간호사 김예은 재면접 의사 확인 연락",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-07",who:"김예은",created:52},
  {id:53,title:"리뷰영상 수정 — 리프팅",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-07",who:"",created:53},
  {id:54,title:"파스토 해외물류비용 입금",cat:"B2B",status:"done",priority:"mid",due:"2026-04-08",who:"",created:54},
  {id:55,title:"쇼피파이 주문처리 (미국) — 구매자 정보 요청 및 발송",cat:"온라인몰",status:"done",priority:"mid",due:"2026-04-08",who:"",created:55},
  {id:56,title:"포스트 등록",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-08",who:"",created:56},
  {id:57,title:"B2B 바이어발굴 자동화플로 셋팅",cat:"B2B",status:"done",priority:"mid",due:"2026-04-08",who:"",created:57},
  {id:58,title:"간호사 김예은 / 상담 박아름 면접 확정 (4/16)",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-08",who:"",created:58},
  {id:59,title:"구글 영상 업로드 및 링크 공유",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-08",who:"",created:59},
  {id:60,title:"포스트 등록",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-08",who:"",created:60},
  {id:61,title:"리뷰영상 수정 — 싱가폴",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-08",who:"",created:61},
  {id:62,title:"홈페이지 오시는길 / 구글 지도 수정 요청 확인",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-08",who:"",created:62},
  {id:63,title:"보고서 / 검수보고서 자동화플로 셋팅",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-09",who:"",created:63},
  {id:64,title:"비용책자 베트남 & 중간체",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-09",who:"",created:64},
  {id:65,title:"상담 강리안 면접 확인",cat:"지원업무",status:"done",priority:"mid",due:"2026-04-09",who:"강리안",created:65},
  {id:66,title:"포스트 등록",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-09",who:"",created:66},
  {id:67,title:"리뷰영상 수정2 — 싱가폴",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-09",who:"",created:67},
  {id:68,title:"상담녹음 상담 3개 확인/업로드, 원장님 2개 스크립트",cat:"콘텐츠/마케팅",status:"done",priority:"mid",due:"2026-04-09",who:"",created:68},
];

const fmtDate = d => { if(!d) return ""; const [y,m,dd]=d.split("-"); return y+"년 "+parseInt(m)+"월 "+parseInt(dd)+"일"; };
const todayLabel = () => { const n=new Date(); return n.getFullYear()+"년 "+(n.getMonth()+1)+"월 "+n.getDate()+"일"; };

const parseNatural = (text, cats) => {
  const t=text.trim();
  const cat=cats.map(c=>c.name).find(c=>t.includes(c))||cats[0].name;
  let status="todo";
  if(["완료","끝","했어","했다","마쳤","제출"].some(k=>t.includes(k))) status="done";
  else if(["진행","하는중","중이야"].some(k=>t.includes(k))) status="prog";
  let priority="mid";
  if(["급해","긴급","중요","빨리"].some(k=>t.includes(k))) priority="high";
  else if(["나중에","여유"].some(k=>t.includes(k))) priority="low";
  const dm=t.match(/(\d{1,2})월\s*(\d{1,2})일/);
  const due=dm?"2026-"+dm[1].padStart(2,"0")+"-"+dm[2].padStart(2,"0"):TODAY;
  const title=t.replace(/오늘|내일|해야해|해야함|추가해줘|저장해줘|완료했어|완료함/g,"").replace(/\d{1,2}월\s*\d{1,2}일/g,"").trim()||t;
  return {title,cat,status,priority,due,who:""};
};

const sortTasks = arr => {
  const pOrd={high:0,mid:1,low:2};
  const act=arr.filter(t=>t.status!=="done").sort((a,b)=>pOrd[a.priority]-pOrd[b.priority]||a.created-b.created);
  const dn=arr.filter(t=>t.status==="done").sort((a,b)=>a.created-b.created);
  return {act,dn};
};

const Badge = ({label,color,bg}) => (
  <span style={{padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:500,color,background:bg,display:"inline-block",whiteSpace:"nowrap"}}>{label}</span>
);
const Pill = ({label,active,color,bg,onClick}) => (
  <button onClick={onClick} style={{padding:"5px 13px",borderRadius:20,fontSize:12,cursor:"pointer",border:"1px solid "+(active?color:"#e0e0e0"),color:active?color:"#888",background:active?bg:"#fff",fontWeight:active?500:400}}>{label}</button>
);
const StatCard = ({label,val,color}) => (
  <div style={{background:"#fff",borderRadius:12,padding:"16px 18px",border:"1px solid #e8e8e8"}}>
    <div style={{fontSize:11,color:"#999",marginBottom:6}}>{label}</div>
    <div style={{fontSize:26,fontWeight:600,color:color||"#1a1a1a"}}>{val}</div>
  </div>
);
const selStyle={fontSize:11,borderRadius:6,border:"1px solid #d0d0d0",padding:"2px 4px",outline:"none",background:"#fff",cursor:"pointer"};

const MiniCalendar = ({tasks,catColor}) => {
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [month,setMonth]=useState(now.getMonth());
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const dayMap={};
  tasks.forEach(t=>{
    if(!t.due) return;
    const [y,m,d]=t.due.split("-");
    if(parseInt(y)===year&&parseInt(m)===month+1){
      if(!dayMap[parseInt(d)]) dayMap[parseInt(d)]=[];
      dayMap[parseInt(d)].push(t);
    }
  });
  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);
  const tn=new Date(),tD=tn.getDate(),tM=tn.getMonth(),tY=tn.getFullYear();
  const prev=()=>month===0?(setYear(y=>y-1),setMonth(11)):setMonth(m=>m-1);
  const next=()=>month===11?(setYear(y=>y+1),setMonth(0)):setMonth(m=>m+1);
  return (
    <div style={{padding:"0 12px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 4px 8px"}}>
        <button onClick={prev} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:16}}>‹</button>
        <span style={{fontSize:11,fontWeight:600,color:"#777"}}>{year}년 {month+1}월</span>
        <button onClick={next} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:16}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:3}}>
        {["일","월","화","수","목","금","토"].map((w,i)=>(
          <div key={w} style={{textAlign:"center",fontSize:9,fontWeight:500,color:i===0?"#ef4444":i===6?"#3b82f6":"#555",padding:"2px 0"}}>{w}</div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={"e"+i}/>;
          const dow=(firstDay+d-1)%7;
          const isToday=d===tD&&month===tM&&year===tY;
          const dateStr=year+"-"+String(month+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
          const holiday=KR_HOLIDAYS[dateStr];
          const isRed=!!holiday||dow===0; const isSat=dow===6;
          const dots=[]; const seen=new Set();
          (dayMap[d]||[]).forEach(t=>{if(!seen.has(t.cat)){seen.add(t.cat);dots.push(t.cat);}});
          return (
            <div key={d} style={{borderRadius:5,padding:"3px 1px 4px",textAlign:"center",background:isToday?"#1a1a1a":"transparent"}}>
              <div style={{fontSize:10,fontWeight:isToday?600:400,color:isToday?"#fff":isRed?"#ef4444":isSat?"#3b82f6":"#bbb",lineHeight:1.3}}>{d}</div>
              {dots.length>0&&(
                <div style={{display:"flex",justifyContent:"center",gap:1,marginTop:2}}>
                  {dots.slice(0,3).map(cat=>{
                    const cc=catColor[cat]||["#888"];
                    return <div key={cat} style={{width:4,height:4,borderRadius:"50%",background:isToday?"rgba(255,255,255,0.8)":cc[0]}}/>;
                  })}
                </div>
              )}
              {holiday&&<div style={{fontSize:7,color:isToday?"rgba(255,255,255,0.6)":"#ef4444",lineHeight:1,marginTop:1,overflow:"hidden",whiteSpace:"nowrap"}}>{holiday}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InputCard = ({onAdd,cats}) => {
  const [val,setVal]=useState("");
  const [selCat,setSelCat]=useState("");
  const go=()=>{ if(!val.trim()) return; onAdd(val,selCat||null); setVal(""); };
  return (
    <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",marginBottom:24,border:"1px solid #e8e8e8",display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="예: QR pop 수정 해야해 / 미팅 완료했어" style={{flex:1,border:"none",outline:"none",fontSize:14,background:"transparent"}}/>
        <button onClick={go} style={{background:"#1a1a1a",color:"#fff",border:"none",padding:"8px 18px",borderRadius:8,fontSize:13,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap"}}>추가</button>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button onClick={()=>setSelCat("")} style={{padding:"4px 12px",borderRadius:20,fontSize:12,cursor:"pointer",border:"1px solid "+(selCat===""?"#1a1a1a":"#e0e0e0"),color:selCat===""?"#1a1a1a":"#aaa",background:selCat===""?"#f5f5f5":"transparent",fontWeight:selCat===""?500:400}}>자동</button>
        {cats.map(c=>(
          <button key={c.name} onClick={()=>setSelCat(selCat===c.name?"":c.name)} style={{padding:"4px 12px",borderRadius:20,fontSize:12,cursor:"pointer",border:"1px solid "+(selCat===c.name?c.color[0]:"#e0e0e0"),color:selCat===c.name?c.color[0]:"#aaa",background:selCat===c.name?c.color[1]:"transparent",fontWeight:selCat===c.name?500:400}}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({task,onCycle,onEdit,onDelete,onCopy,onUpdate,catColor,catNames}) => {
  const [editing,setEditing]=useState(null);
  const isDone=task.status==="done", isOver=task.due&&task.due<TODAY&&!isDone;
  const sc=SCOL[task.status], pc=PCOL[task.priority], cc=catColor[task.cat]||["#666","#eee"];
  const commit=(field,val)=>{ onUpdate(task.id,field,val); setEditing(null); };
  const wrap=(field,el)=>(
    <span onClick={()=>setEditing(editing===field?null:field)} style={{cursor:"pointer",borderRadius:4,padding:"1px 2px"}}
      onMouseEnter={e=>e.currentTarget.style.background="#f0f0f0"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      {editing===field ? el :
        field==="due" ? (task.due?<span style={{fontSize:11,color:isOver?"#DC2626":"#bbb"}}>{isOver?"⚠ ":"📅 "}{task.due}</span>:<span style={{fontSize:11,color:"#ddd"}}>📅 날짜</span>)
        : field==="who" ? (task.who?<span style={{fontSize:11,color:"#aaa"}}>👤 {task.who}</span>:null)
        : field==="cat" ? <Badge label={task.cat} color={cc[0]} bg={cc[1]}/>
        : field==="status" ? <Badge label={SLBL[task.status]} color={sc[0]} bg={sc[1]}/>
        : <Badge label={PLBL[task.priority]} color={pc[0]} bg={pc[1]}/>
      }
    </span>
  );
  return (
    <div style={{background:isDone?"#fafafa":"#fff",borderRadius:12,padding:"14px 16px",border:"1px solid #e8e8e8",display:"grid",gridTemplateColumns:"28px 1fr auto",gap:12,alignItems:"center",opacity:isDone?0.6:1,marginBottom:8}}>
      <div onClick={()=>onCycle(task.id)} style={{width:22,height:22,borderRadius:"50%",cursor:"pointer",border:"2px solid "+(isDone?"#16A34A":task.status==="prog"?"#2563EB":"#d0d0d0"),background:isDone?"#16A34A":task.status==="prog"?"#EFF6FF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:isDone?"#fff":"#2563EB",flexShrink:0}}>
        {isDone?"✓":task.status==="prog"?"·":""}
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:isDone?400:500,marginBottom:6,textDecoration:isDone?"line-through":"none",color:isDone?"#aaa":"#1a1a1a",lineHeight:1.4}}>{task.title}</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
          {wrap("cat",<select autoFocus style={selStyle} value={task.cat} onChange={e=>commit("cat",e.target.value)} onBlur={()=>setEditing(null)}>{catNames.map(c=><option key={c}>{c}</option>)}</select>)}
          {wrap("status",<select autoFocus style={selStyle} value={task.status} onChange={e=>commit("status",e.target.value)} onBlur={()=>setEditing(null)}><option value="todo">예정</option><option value="prog">진행중</option><option value="done">완료</option></select>)}
          {wrap("priority",<select autoFocus style={selStyle} value={task.priority} onChange={e=>commit("priority",e.target.value)} onBlur={()=>setEditing(null)}><option value="high">높음</option><option value="mid">보통</option><option value="low">낮음</option></select>)}
          {wrap("due",<input autoFocus type="date" style={{...selStyle,fontSize:11}} value={task.due||""} onChange={e=>commit("due",e.target.value)} onBlur={()=>setEditing(null)}/>)}
          {wrap("who",<input autoFocus style={{...selStyle,width:80}} value={task.who||""} onChange={e=>onUpdate(task.id,"who",e.target.value)} onBlur={()=>setEditing(null)} onKeyDown={e=>e.key==="Enter"&&setEditing(null)} placeholder="담당자"/>)}
        </div>
      </div>
      <div style={{display:"flex",gap:2}}>
        <button onClick={()=>onCopy(task)} style={{width:28,height:28,border:"none",background:"transparent",cursor:"pointer",borderRadius:7,fontSize:13,color:"#ccc"}}>⧉</button>
        <button onClick={()=>onEdit(task)} style={{width:28,height:28,border:"none",background:"transparent",cursor:"pointer",borderRadius:7,fontSize:13,color:"#ccc"}}>✎</button>
        <button onClick={()=>onDelete(task.id)} style={{width:28,height:28,border:"none",background:"transparent",cursor:"pointer",borderRadius:7,fontSize:13,color:"#ccc"}}>✕</button>
      </div>
    </div>
  );
};

const TaskList = ({tasks,onCycle,onEdit,onDelete,onCopy,onUpdate,catColor,catNames}) => {
  const {act,dn}=sortTasks(tasks);
  const p={onCycle,onEdit,onDelete,onCopy,onUpdate,catColor,catNames};
  if(!act.length&&!dn.length) return <div style={{textAlign:"center",padding:"48px",color:"#ccc",fontSize:13}}>표시할 업무가 없습니다</div>;
  return (
    <div>
      {act.map(task=><TaskCard key={task.id} task={task} {...p}/>)}
      {dn.length>0&&<>
        <div style={{textAlign:"center",fontSize:11,color:"#ccc",margin:"12px 0 8px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{flex:1,height:1,background:"#ececec",display:"block"}}/>완료된 업무 {dn.length}건<span style={{flex:1,height:1,background:"#ececec",display:"block"}}/>
        </div>
        {dn.map(task=><TaskCard key={task.id} task={task} {...p}/>)}
      </>}
    </div>
  );
};

const ReportBody = ({rt,title,showDate,catColor,summaryHtml=""}) => {
  const bycat={};
  rt.forEach(t=>{ if(!bycat[t.cat]) bycat[t.cat]=[]; bycat[t.cat].push(t); });
  const rd=rt.filter(t=>t.status==="done").length, rp=rt.filter(t=>t.status==="prog").length, rto=rt.filter(t=>t.status==="todo").length;
  const buildHtml=sHtml=>{
    const rows=Object.keys(bycat).map(cat=>{
      const cc=catColor[cat]||["#666","#eee"];
      const tr=bycat[cat].map(t=>`<tr><td style="padding:7px 12px;border-bottom:1px solid #f5f5f5;font-size:13px"><span style="padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500;color:${SCOL[t.status][0]};background:${SCOL[t.status][1]}">${SLBL[t.status]}</span></td>${showDate?`<td style="padding:7px 12px;font-size:11px;color:#bbb">${t.due||""}</td>`:""}<td style="padding:7px 12px;font-size:13px;color:${t.status==="done"?"#aaa":"#1a1a1a"};text-decoration:${t.status==="done"?"line-through":"none"}">${t.title}</td></tr>`).join("");
      return `<tr><td colspan="${showDate?3:2}" style="padding:10px 12px 4px"><span style="padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;color:${cc[0]};background:${cc[1]}">${cat}</span></td></tr>${tr}`;
    }).join("");
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:-apple-system,sans-serif;margin:40px;color:#1a1a1a}h1{font-size:18px;font-weight:600;margin-bottom:20px}table{width:100%;border-collapse:collapse}.s{display:flex;gap:16px;margin-bottom:24px}.sc{background:#f5f5f3;border-radius:8px;padding:12px 20px;text-align:center}.sl{font-size:11px;color:#999;margin-bottom:4px}.sv{font-size:22px;font-weight:600}@media print{body{margin:20px}}</style></head><body><h1>${title}</h1>${sHtml}<div class="s"><div class="sc"><div class="sl">전체</div><div class="sv">${rt.length}</div></div><div class="sc"><div class="sl">완료</div><div class="sv" style="color:#16A34A">${rd}</div></div><div class="sc"><div class="sl">진행중</div><div class="sv" style="color:#2563EB">${rp}</div></div><div class="sc"><div class="sl">예정</div><div class="sv" style="color:#6B7280">${rto}</div></div></div><table>${rows}</table></body></html>`;
  };
  const dl=sHtml=>{ const blob=new Blob([buildHtml(sHtml)],{type:"text/html;charset=utf-8"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=title.replace(/[/\\:*?"<>|]/g,"_")+".html"; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);document.body.removeChild(a);},100); };
  const pr=sHtml=>{ const blob=new Blob([buildHtml(sHtml)],{type:"text/html;charset=utf-8"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.target="_blank"; a.rel="noopener"; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(url);document.body.removeChild(a);},100); };
  const cp=()=>{ const lines=[title,"","전체 "+rt.length+" · 완료 "+rd+" · 진행중 "+rp+" · 예정 "+rto,""]; Object.keys(bycat).forEach(cat=>{lines.push("■ "+cat);bycat[cat].forEach(t=>lines.push("  ["+SLBL[t.status]+"] "+(showDate&&t.due?"("+t.due+") ":"")+t.title));lines.push("");}); navigator.clipboard.writeText(lines.join("\n")).then(()=>alert("클립보드에 복사됐어요!")); };
  return (
    <div style={{background:"#fff",borderRadius:14,border:"1px solid #e8e8e8",overflow:"hidden"}}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:16,fontWeight:600}}>{title}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button onClick={cp} style={{border:"1px solid #e8e8e8",background:"#fff",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",color:"#555"}}>📋 복사</button>
          <button onClick={()=>dl(summaryHtml)} style={{border:"1px solid #e8e8e8",background:"#fff",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",color:"#555"}}>⬇ 다운로드</button>
          <button onClick={()=>pr(summaryHtml)} style={{border:"1px solid #1a1a1a",background:"#1a1a1a",borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",color:"#fff"}}>🖨 인쇄·PDF</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"1px solid #f0f0f0"}}>
        {[["전체",rt.length,"#1a1a1a"],["완료",rd,"#16A34A"],["진행중",rp,"#2563EB"],["예정",rto,"#6B7280"]].map(([l,v,c],i)=>(
          <div key={l} style={{padding:"14px 20px",textAlign:"center",borderRight:i<3?"1px solid #f0f0f0":"none"}}>
            <div style={{fontSize:11,color:"#aaa",marginBottom:4}}>{l}</div>
            <div style={{fontSize:20,fontWeight:600,color:c}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"20px 24px"}}>
        {Object.keys(bycat).length===0
          ? <div style={{textAlign:"center",padding:24,color:"#ccc",fontSize:13}}>등록된 업무가 없습니다</div>
          : Object.keys(bycat).map(cat=>{
            const cc=catColor[cat]||["#666","#eee"];
            return (
              <div key={cat} style={{marginBottom:20}}>
                <div style={{display:"inline-block",padding:"3px 12px",borderRadius:20,fontSize:12,fontWeight:600,color:cc[0],background:cc[1],marginBottom:10}}>{cat}</div>
                {bycat[cat].map(t=>{
                  const sc=SCOL[t.status];
                  return (
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid #f9f9f9",fontSize:13}}>
                      <Badge label={SLBL[t.status]} color={sc[0]} bg={sc[1]}/>
                      {showDate&&<span style={{fontSize:11,color:"#bbb",flexShrink:0}}>{t.due}</span>}
                      <span style={{color:t.status==="done"?"#aaa":"#1a1a1a",textDecoration:t.status==="done"?"line-through":"none"}}>{t.title}</span>
                    </div>
                  );
                })}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default function App() {
  const [tasks,setTasks]=useState([]);
  const [cats,setCats]=useState(DEFAULT_CATS);
  const [nextId,setNextId]=useState(69);
  const [loading,setLoading]=useState(true);
  const [saveStatus,setSaveStatus]=useState("saved");
  const [tab,setTab]=useState("tasks");
  const [filterCat,setFilterCat]=useState("all");
  const [filterStatus,setFilterStatus]=useState("all");
  const [filterDate,setFilterDate]=useState(TODAY);
  const [reportDate,setReportDate]=useState(TODAY);
  const [reportMonth,setReportMonth]=useState(TODAY.slice(0,7));
  const [reportShown,setReportShown]=useState(false);
  const [reportMode,setReportMode]=useState("daily");
  const [search,setSearch]=useState("");
  const [editTask,setEditTask]=useState(null);
  const [showCatEditor,setShowCatEditor]=useState(false);
  const [editingCat,setEditingCat]=useState(null);

  const catNames=cats.map(c=>c.name);
  const catColor=Object.fromEntries(cats.map(c=>[c.name,c.color]));

  useEffect(()=>{
    try {
      const s=localStorage.getItem(KEY);
      if(s){
        const d=JSON.parse(s);
        const saved=d.tasks||[];
        const ids=new Set(saved.map(t=>t.id));
        const merged=[...saved,...INIT.filter(t=>!ids.has(t.id))];
        const maxId=Math.max(...merged.map(t=>t.id),68);
        setTasks(merged); setNextId(Math.max(d.nextId||69,maxId+1));
      } else { setTasks(INIT); setNextId(69); }
    } catch(e){ setTasks(INIT); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{
    try{ const s=localStorage.getItem(CAT_KEY); if(s) setCats(JSON.parse(s)); else setCats(DEFAULT_CATS); }
    catch(e){ setCats(DEFAULT_CATS); }
  },[]);

  useEffect(()=>{
    if(loading) return;
    setSaveStatus("saving");
    const timer=setTimeout(()=>{
      try{ localStorage.setItem(KEY,JSON.stringify({tasks,nextId})); setSaveStatus("saved"); }
      catch(e){ setSaveStatus("local"); }
    },600);
    return ()=>clearTimeout(timer);
  },[tasks,nextId,loading]);

  useEffect(()=>{ if(loading) return; try{ localStorage.setItem(CAT_KEY,JSON.stringify(cats)); }catch(e){} },[cats,loading]);

  const addTask=(text,forceCat=null)=>{ const p=parseNatural(text,cats); if(forceCat) p.cat=forceCat; setTasks(prev=>[...prev,{...p,id:nextId,created:nextId}]); setNextId(n=>n+1); };
  const cycleStatus=id=>{ const o=["todo","prog","done"]; setTasks(prev=>prev.map(t=>t.id===id?{...t,status:o[(o.indexOf(t.status)+1)%3]}:t)); };
  const deleteTask=id=>setTasks(prev=>prev.filter(t=>t.id!==id));
  const copyTask=src=>{ setTasks(prev=>[...prev,{...src,id:nextId,created:nextId,status:"todo",title:src.title+" (복사)"}]); setNextId(n=>n+1); };
  const saveEdit=data=>{ setTasks(prev=>prev.map(t=>t.id===data.id?{...t,...data}:t)); setEditTask(null); };
  const inlineUpdate=(id,field,val)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,[field]:val}:t));
  const switchTab=k=>{ setTab(k); setFilterCat("all"); setFilterStatus("all"); setSearch(""); setReportShown(false); };
  const jumpCat=name=>{ setTab("tasks"); setFilterCat(name); setFilterStatus("all"); setSearch(""); };

  const exportData=()=>{
    const data=JSON.stringify({tasks,cats,nextId,exportedAt:new Date().toISOString()},null,2);
    const blob=new Blob([data],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download="e-backup-"+TODAY+".json"; document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);document.body.removeChild(a);},100);
  };

  const importData=e=>{
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const d=JSON.parse(ev.target.result);
        if(d.tasks){ setTasks(d.tasks); setNextId(d.nextId||d.tasks.length+1); }
        if(d.cats) setCats(d.cats);
        alert("가져오기 완료! "+(d.tasks?.length||0)+"건 로드됐어요.");
      } catch(err){ alert("파일을 읽을 수 없어요."); }
    };
    reader.readAsText(file); e.target.value="";
  };

  const stats={ total:tasks.length, done:tasks.filter(t=>t.status==="done").length, prog:tasks.filter(t=>t.status==="prog").length, over:tasks.filter(t=>t.due&&t.due<TODAY&&t.status!=="done").length };
  const filteredTasks=tasks.filter(t=>{
    if(filterCat!=="all"&&t.cat!==filterCat) return false;
    if(filterStatus!=="all"&&t.status!==filterStatus) return false;
    if(search&&!t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sbItem=active=>({display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,cursor:"pointer",fontSize:13,color:active?"#fff":"#999",background:active?"#2e2e2e":"transparent",fontWeight:active?500:400,marginBottom:2});
  const lp={onCycle:cycleStatus,onEdit:setEditTask,onDelete:deleteTask,onCopy:copyTask,onUpdate:inlineUpdate,catColor,catNames};

  return (
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif",background:"#F5F5F3",color:"#1a1a1a"}}>
      {loading&&<div style={{position:"fixed",inset:0,background:"rgba(245,245,243,.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,flexDirection:"column",gap:12}}><div style={{fontSize:22,fontWeight:700}}>E</div><div style={{fontSize:13,color:"#888"}}>불러오는 중...</div></div>}

      <aside style={{background:"#1a1a1a",display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
        <div style={{padding:"24px 24px 16px",borderBottom:"1px solid #2e2e2e"}}>
          <div style={{fontSize:22,fontWeight:700,color:"#fff"}}>E</div>
          <div style={{fontSize:11,color:"#666",marginTop:2}}>J님의 개인비서</div>
          <div style={{marginTop:6,fontSize:10,display:"flex",alignItems:"center",gap:4,color:saveStatus==="saving"?"#facc15":saveStatus==="local"?"#fb923c":"#4ade80"}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"currentColor",display:"inline-block"}}/>
            {saveStatus==="saving"?"저장 중...":saveStatus==="local"?"로컬 저장됨":"클라우드 저장됨"}
          </div>
        </div>
        <nav style={{padding:"12px 12px 0"}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:1,textTransform:"uppercase",padding:"0 12px",margin:"12px 0 6px"}}>메뉴</div>
          <div style={sbItem(tab==="tasks")} onClick={()=>switchTab("tasks")}>📋 전체 업무</div>
          <div style={sbItem(tab==="today")} onClick={()=>switchTab("today")}>📅 오늘 할일</div>
          <div style={sbItem(tab==="report")} onClick={()=>switchTab("report")}>📄 보고서</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px",margin:"12px 0 6px"}}>
            <span style={{fontSize:10,color:"#444",letterSpacing:1,textTransform:"uppercase"}}>분야</span>
            <button onClick={()=>setShowCatEditor(true)} style={{background:"#2e2e2e",border:"none",color:"#aaa",fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer"}}>편집</button>
          </div>
          {cats.map(c=>(
            <div key={c.name} style={sbItem(false)} onClick={()=>jumpCat(c.name)}>
              <span>{c.icon||"📁"}</span> {c.name}
            </div>
          ))}
        </nav>
        <div style={{borderTop:"1px solid #2e2e2e",marginTop:8}}>
          <MiniCalendar tasks={tasks} catColor={catColor}/>
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #2e2e2e"}}>
          {[["전체",stats.total,"#fff"],["진행중",stats.prog,"#fff"],["완료",stats.done,"#fff"],["기한초과",stats.over,"#ff6b6b"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12}}>
              <span style={{color:"#555"}}>{l}</span><span style={{color:c,fontWeight:500}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #2e2e2e",display:"flex",flexDirection:"column",gap:6}}>
          <button onClick={exportData} style={{background:"#2e2e2e",border:"none",color:"#ccc",fontSize:11,padding:"7px 10px",borderRadius:6,cursor:"pointer",textAlign:"left"}}>⬇ 데이터 내보내기</button>
          <label style={{background:"#2e2e2e",color:"#ccc",fontSize:11,padding:"7px 10px",borderRadius:6,cursor:"pointer",display:"block"}}>
            ⬆ 데이터 가져오기
            <input type="file" accept=".json" style={{display:"none"}} onChange={importData}/>
          </label>
        </div>
      </aside>

      <main style={{padding:"32px 36px",overflowY:"auto"}}>
        {tab==="tasks"&&<>
          <div style={{marginBottom:28}}><div style={{fontSize:20,fontWeight:600}}>전체 업무</div><div style={{fontSize:13,color:"#888",marginTop:2}}>{todayLabel()}</div></div>
          <InputCard onAdd={addTask} cats={cats}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            <StatCard label="전체" val={stats.total}/><StatCard label="진행중" val={stats.prog} color="#2563EB"/><StatCard label="완료" val={stats.done} color="#16A34A"/><StatCard label="기한초과" val={stats.over} color="#DC2626"/>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            <Pill label="전체" active={filterCat==="all"} color="#1a1a1a" bg="#f5f5f5" onClick={()=>setFilterCat("all")}/>
            {cats.map(c=><Pill key={c.name} label={c.name} active={filterCat===c.name} color={c.color[0]} bg={c.color[1]} onClick={()=>setFilterCat(c.name)}/>)}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            <Pill label="전체 상태" active={filterStatus==="all"} color="#1a1a1a" bg="#f5f5f5" onClick={()=>setFilterStatus("all")}/>
            {["todo","prog","done"].map(s=><Pill key={s} label={SLBL[s]} active={filterStatus===s} color={SCOL[s][0]} bg={SCOL[s][1]} onClick={()=>setFilterStatus(s)}/>)}
          </div>
          <div style={{position:"relative",marginBottom:16}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#bbb"}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="검색..." style={{width:"100%",border:"1px solid #e8e8e8",borderRadius:10,padding:"9px 14px 9px 36px",fontSize:13,background:"#fff",outline:"none"}}/>
          </div>
          <TaskList tasks={filteredTasks} {...lp}/>
        </>}

        {tab==="today"&&<>
          <div style={{marginBottom:28}}><div style={{fontSize:20,fontWeight:600}}>오늘 할일</div><div style={{fontSize:13,color:"#888",marginTop:2}}>{fmtDate(filterDate)}</div></div>
          <InputCard onAdd={addTask} cats={cats}/>
          <div style={{marginBottom:16}}><input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{border:"1px solid #e8e8e8",borderRadius:10,padding:"9px 14px",fontSize:13,background:"#fff",outline:"none"}}/></div>
          <TaskList tasks={tasks.filter(t=>t.due===filterDate)} {...lp}/>
        </>}

        {tab==="report"&&<>
          <div style={{marginBottom:28}}><div style={{fontSize:20,fontWeight:600}}>보고서</div><div style={{fontSize:13,color:"#888",marginTop:2}}>날짜를 선택하고 생성하세요</div></div>
          <div style={{display:"flex",gap:0,marginBottom:20,background:"#f0f0ee",borderRadius:10,padding:4,width:"fit-content"}}>
            {[["daily","일일 보고서"],["monthly","월별 보고서"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setReportMode(m);setReportShown(false);}} style={{padding:"7px 18px",borderRadius:8,border:"none",fontSize:13,cursor:"pointer",fontWeight:reportMode===m?500:400,background:reportMode===m?"#fff":"transparent",color:reportMode===m?"#1a1a1a":"#888",boxShadow:reportMode===m?"0 1px 4px rgba(0,0,0,.08)":"none"}}>{l}</button>
            ))}
          </div>

          {reportMode==="daily"&&<>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
              <input type="date" value={reportDate} onChange={e=>{setReportDate(e.target.value);setReportShown(false);}} style={{flex:1,border:"1px solid #e8e8e8",borderRadius:10,padding:"9px 14px",fontSize:13,background:"#fff",outline:"none"}}/>
              <button onClick={()=>setReportShown(true)} style={{background:"#1a1a1a",color:"#fff",border:"none",padding:"9px 20px",borderRadius:9,fontSize:13,fontWeight:500,cursor:"pointer"}}>보고서 생성</button>
            </div>
            {reportShown&&<ReportBody rt={tasks.filter(t=>t.due===reportDate)} title={"일일 업무 보고서 — "+fmtDate(reportDate)} catColor={catColor}/>}
          </>}

          {reportMode==="monthly"&&<>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
              <input type="month" value={reportMonth} onChange={e=>{setReportMonth(e.target.value);setReportShown(false);}} style={{flex:1,border:"1px solid #e8e8e8",borderRadius:10,padding:"9px 14px",fontSize:13,background:"#fff",outline:"none"}}/>
              <button onClick={()=>setReportShown(true)} style={{background:"#1a1a1a",color:"#fff",border:"none",padding:"9px 20px",borderRadius:9,fontSize:13,fontWeight:500,cursor:"pointer"}}>보고서 생성</button>
            </div>
            {reportShown&&(()=>{
              const [y,m]=reportMonth.split("-");
              const rt=tasks.filter(t=>t.due&&t.due.startsWith(reportMonth));
              const doneCnt=rt.filter(t=>t.status==="done").length, progCnt=rt.filter(t=>t.status==="prog").length;
              const doneRate=rt.length?Math.round(doneCnt/rt.length*100):0;
              const weekMap={};
              rt.forEach(t=>{if(!t.due)return;const wk=Math.ceil(new Date(t.due).getDate()/7)+"주";if(!weekMap[wk])weekMap[wk]={total:0,done:0};weekMap[wk].total++;if(t.status==="done")weekMap[wk].done++;});
              const weeks=Object.keys(weekMap).sort();
              const maxW=Math.max(...weeks.map(w=>weekMap[w].total),1);
              const catMap={};
              rt.forEach(t=>{if(!catMap[t.cat])catMap[t.cat]={total:0,done:0};catMap[t.cat].total++;if(t.status==="done")catMap[t.cat].done++;});
              const catKeys=Object.keys(catMap).sort((a,b)=>catMap[b].total-catMap[a].total);
              const maxC=Math.max(...catKeys.map(c=>catMap[c].total),1);
              const summaryHtml=`<div style="background:#f9f9f9;border:1px solid #e8e8e8;border-radius:12px;padding:20px 24px;margin-bottom:24px"><div style="font-size:14px;font-weight:600;margin-bottom:16px">${y}년 ${parseInt(m)}월 업무 요약</div><table style="width:100%;margin-bottom:16px"><tr>${[["총 업무",rt.length,"#1a1a1a","#f0f0ee"],["완료",doneCnt,"#16A34A","#dcfce7"],["진행중",progCnt,"#2563EB","#dbeafe"],["완료율",doneRate+"%","#B45309","#fef3c7"]].map(([l,v,c,bg])=>`<td style="text-align:center;padding:10px"><div style="background:${bg};border-radius:8px;padding:10px 14px"><div style="font-size:11px;color:${c};opacity:0.6;margin-bottom:4px">${l}</div><div style="font-size:22px;font-weight:700;color:${c}">${v}</div></div></td>`).join("")}</tr></table></div>`;
              return <>
                <div style={{background:"#fff",border:"1px solid #e8e8e8",borderRadius:14,padding:"24px 28px",marginBottom:16}}>
                  <div style={{fontSize:15,fontWeight:600,marginBottom:20}}>{y}년 {parseInt(m)}월 업무 요약</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
                    {[["총 업무",rt.length,"#1a1a1a","#f0f0ee"],["완료",doneCnt,"#16A34A","#dcfce7"],["진행중",progCnt,"#2563EB","#dbeafe"],["완료율",doneRate+"%","#B45309","#fef3c7"]].map(([l,v,c,bg])=>(
                      <div key={l} style={{background:bg,borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                        <div style={{fontSize:11,color:c,opacity:0.6,marginBottom:6,fontWeight:500}}>{l}</div>
                        <div style={{fontSize:26,fontWeight:700,color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {weeks.length>0&&<>
                    <div style={{fontSize:11,color:"#aaa",marginBottom:10}}>주차별 업무량</div>
                    <div style={{display:"flex",gap:10,alignItems:"flex-end",height:80,marginBottom:20}}>
                      {weeks.map(wk=>{
                        const pct=weekMap[wk].total/maxW, dp=weekMap[wk].total?weekMap[wk].done/weekMap[wk].total:0;
                        return <div key={wk} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                          <div style={{fontSize:10,color:"#888"}}>{weekMap[wk].total}</div>
                          <div style={{width:"100%",height:Math.max(pct*60,4),borderRadius:4,background:"#f0f0ee",position:"relative",overflow:"hidden"}}>
                            <div style={{position:"absolute",bottom:0,left:0,right:0,height:(dp*100)+"%",background:"#16A34A",borderRadius:4,opacity:0.7}}/>
                          </div>
                          <div style={{fontSize:10,color:"#aaa"}}>{wk}</div>
                        </div>;
                      })}
                    </div>
                  </>}
                  {catKeys.length>0&&<>
                    <div style={{fontSize:11,color:"#aaa",marginBottom:10}}>분야별 업무량</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {catKeys.map(cat=>{
                        const cc=catColor[cat]||["#888","#eee"];
                        const pct=catMap[cat].total/maxC, dp=catMap[cat].total?catMap[cat].done/catMap[cat].total:0;
                        return <div key={cat} style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{fontSize:11,color:"#888",width:110,flexShrink:0,textAlign:"right"}}>{cat}</div>
                          <div style={{flex:1,height:14,borderRadius:7,background:"#f0f0ee",position:"relative",overflow:"hidden"}}>
                            <div style={{position:"absolute",left:0,top:0,bottom:0,width:(pct*100)+"%",background:cc[1],borderRadius:7}}/>
                            <div style={{position:"absolute",left:0,top:0,bottom:0,width:(pct*dp*100)+"%",background:cc[0],borderRadius:7,opacity:0.75}}/>
                          </div>
                          <div style={{fontSize:11,color:"#888",width:40,flexShrink:0}}>{catMap[cat].done}/{catMap[cat].total}</div>
                        </div>;
                      })}
                    </div>
                  </>}
                </div>
                <ReportBody rt={rt} title={y+"년 "+parseInt(m)+"월 전체 업무 목록"} showDate={true} catColor={catColor} summaryHtml={summaryHtml}/>
              </>;
            })()}
          </>}
        </>}
      </main>

      {showCatEditor&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}} onClick={e=>e.target===e.currentTarget&&setShowCatEditor(false)}>
          <div style={{background:"#fff",borderRadius:16,padding:24,width:"min(460px,92vw)",display:"flex",flexDirection:"column",gap:12,boxShadow:"0 20px 60px rgba(0,0,0,.2)",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:16,fontWeight:600}}>분야 편집</div>
              <button onClick={()=>setEditingCat({index:-1,name:"",icon:"📁"})} style={{background:"#1a1a1a",color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,fontSize:12,cursor:"pointer",fontWeight:500}}>+ 추가</button>
            </div>
            {editingCat&&editingCat.index===-1&&(
              <div style={{background:"#f9f9f9",borderRadius:10,padding:"12px 14px",display:"flex",gap:8,alignItems:"center",border:"1px solid #e8e8e8"}}>
                <input value={editingCat.icon} onChange={e=>setEditingCat(p=>({...p,icon:e.target.value}))} style={{width:36,border:"1px solid #e8e8e8",borderRadius:6,padding:"5px",fontSize:16,textAlign:"center",outline:"none"}}/>
                <input value={editingCat.name} onChange={e=>setEditingCat(p=>({...p,name:e.target.value}))} placeholder="분야 이름" style={{flex:1,border:"1px solid #e8e8e8",borderRadius:6,padding:"5px 10px",fontSize:13,outline:"none"}}/>
                <button onClick={()=>{if(!editingCat.name.trim())return;setCats(p=>[...p,{name:editingCat.name.trim(),icon:editingCat.icon,color:EXTRA_COLORS[cats.length%EXTRA_COLORS.length]}]);setEditingCat(null);}} style={{background:"#1a1a1a",color:"#fff",border:"none",padding:"5px 12px",borderRadius:6,fontSize:12,cursor:"pointer"}}>저장</button>
                <button onClick={()=>setEditingCat(null)} style={{background:"#f0f0f0",color:"#555",border:"none",padding:"5px 12px",borderRadius:6,fontSize:12,cursor:"pointer"}}>취소</button>
              </div>
            )}
            {cats.map((c,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f5f5f5"}}>
                {editingCat&&editingCat.index===i?<>
                  <input value={editingCat.icon} onChange={e=>setEditingCat(p=>({...p,icon:e.target.value}))} style={{width:36,border:"1px solid #e8e8e8",borderRadius:6,padding:"5px",fontSize:16,textAlign:"center",outline:"none"}}/>
                  <input value={editingCat.name} onChange={e=>setEditingCat(p=>({...p,name:e.target.value}))} style={{flex:1,border:"1px solid #e8e8e8",borderRadius:6,padding:"5px 10px",fontSize:13,outline:"none"}}/>
                  <button onClick={()=>{if(!editingCat.name.trim())return;const oN=cats[i].name,nN=editingCat.name.trim();setCats(p=>p.map((x,j)=>j===i?{...x,name:nN,icon:editingCat.icon}:x));if(oN!==nN)setTasks(p=>p.map(t=>t.cat===oN?{...t,cat:nN}:t));setEditingCat(null);}} style={{background:"#1a1a1a",color:"#fff",border:"none",padding:"5px 12px",borderRadius:6,fontSize:12,cursor:"pointer"}}>저장</button>
                  <button onClick={()=>setEditingCat(null)} style={{background:"#f0f0f0",color:"#555",border:"none",padding:"5px 12px",borderRadius:6,fontSize:12,cursor:"pointer"}}>취소</button>
                </>:<>
                  <span style={{fontSize:18,width:28,textAlign:"center"}}>{c.icon||"📁"}</span>
                  <span style={{flex:1,fontSize:13,fontWeight:500}}>{c.name}</span>
                  <span style={{fontSize:11,color:"#aaa"}}>{tasks.filter(t=>t.cat===c.name).length}건</span>
                  <button onClick={()=>setEditingCat({index:i,name:c.name,icon:c.icon})} style={{background:"#f5f5f5",border:"none",padding:"4px 10px",borderRadius:6,fontSize:12,cursor:"pointer",color:"#555"}}>수정</button>
                  <button onClick={()=>{if(tasks.filter(t=>t.cat===c.name).length>0){alert("업무가 있어 삭제할 수 없어요.");return;}setCats(p=>p.filter((_,j)=>j!==i));}} style={{background:"#fff0f0",border:"none",padding:"4px 10px",borderRadius:6,fontSize:12,cursor:"pointer",color:"#DC2626"}}>삭제</button>
                </>}
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
              <button onClick={()=>{setShowCatEditor(false);setEditingCat(null);}} style={{background:"#1a1a1a",border:"none",padding:"9px 20px",borderRadius:8,fontSize:13,cursor:"pointer",color:"#fff",fontWeight:500}}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {editTask&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={e=>e.target===e.currentTarget&&setEditTask(null)}>
          <div style={{background:"#fff",borderRadius:16,padding:24,width:"min(420px,92vw)",display:"flex",flexDirection:"column",gap:14,boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
            <div style={{fontSize:16,fontWeight:600}}>태스크 편집</div>
            <div><div style={{fontSize:12,color:"#888",marginBottom:4}}>제목</div><input value={editTask.title||""} onChange={e=>setEditTask(p=>({...p,title:e.target.value}))} style={{width:"100%",border:"1px solid #e8e8e8",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{fontSize:12,color:"#888",marginBottom:4}}>분야</div><select value={editTask.cat} onChange={e=>setEditTask(p=>({...p,cat:e.target.value}))} style={{width:"100%",border:"1px solid #e8e8e8",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}>{catNames.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><div style={{fontSize:12,color:"#888",marginBottom:4}}>상태</div><select value={editTask.status} onChange={e=>setEditTask(p=>({...p,status:e.target.value}))} style={{width:"100%",border:"1px solid #e8e8e8",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}><option value="todo">예정</option><option value="prog">진행중</option><option value="done">완료</option></select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{fontSize:12,color:"#888",marginBottom:4}}>우선순위</div><select value={editTask.priority} onChange={e=>setEditTask(p=>({...p,priority:e.target.value}))} style={{width:"100%",border:"1px solid #e8e8e8",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}><option value="high">높음</option><option value="mid">보통</option><option value="low">낮음</option></select></div>
              <div><div style={{fontSize:12,color:"#888",marginBottom:4}}>마감일</div><input type="date" value={editTask.due||""} onChange={e=>setEditTask(p=>({...p,due:e.target.value}))} style={{width:"100%",border:"1px solid #e8e8e8",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/></div>
            </div>
            <div><div style={{fontSize:12,color:"#888",marginBottom:4}}>담당자</div><input value={editTask.who||""} onChange={e=>setEditTask(p=>({...p,who:e.target.value}))} placeholder="이름" style={{width:"100%",border:"1px solid #e8e8e8",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/></div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
              <button onClick={()=>setEditTask(null)} style={{background:"#f5f5f5",border:"none",padding:"9px 18px",borderRadius:8,fontSize:13,cursor:"pointer",color:"#555"}}>취소</button>
              <button onClick={()=>saveEdit(editTask)} style={{background:"#1a1a1a",border:"none",padding:"9px 18px",borderRadius:8,fontSize:13,cursor:"pointer",color:"#fff",fontWeight:500}}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
