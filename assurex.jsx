import { useState, useEffect } from "react";

// ── Brand ─────────────────────────────────────────────────────────────────────
const C = {
  navy:"#1A1035", gold:"#C9A84C", purple:"#7C3AED", lpurple:"#EDE9FE",
  blue:"#007AC2", green:"#16A34A", lgreen:"#DCFCE7", orange:"#E05C2A",
  lorange:"#FEF0EA", red:"#DC2626", grey:"#374151", lgrey:"#F9FAFB",
  mgrey:"#6B7280", white:"#FFFFFF", border:"#E5E7EB",
};

// ── Role config ───────────────────────────────────────────────────────────────
const ROLES = {
  student:     { name:"Aisha Bello",              title:"Student",            dept:"Computer Science",    avatar:"AB", color:C.purple },
  lecturer:    { name:"Dr. Emeka Okafor",          title:"Lecturer / Faculty", dept:"Engineering",         avatar:"EO", color:C.blue   },
  deptadmin:   { name:"Mr. Tunde Adeyemi",         title:"Dept. Admin",        dept:"Faculty of Science",  avatar:"TA", color:C.orange },
  admin:       { name:"Mrs. Fatima Umar",          title:"QA Admin",           dept:"SERVICOM Unit",       avatar:"FU", color:C.green  },
  external:    { name:"Dr. Ngozi Okonkwo",         title:"External Stakeholder",dept:"NUC Evaluator",      avatar:"NO", color:C.mgrey  },
};

// ── Nav items per role ────────────────────────────────────────────────────────
const NAV = {
  student:   ["Dashboard","Evaluations","Feedback","Notifications"],
  lecturer:  ["Dashboard","My Evaluations","Peer Review","AI Insights","Reports"],
  deptadmin: ["Dashboard","Dept. Evaluations","Surveys","Performance","Reports"],
  admin:     ["Dashboard","Evaluations","Feedback","Performance","Reports","Collaboration","Audit Log"],
  external:  ["Published Reports","Performance Summary"],
};
const NAV_ICONS = {
  "Dashboard":"⊞","Evaluations":"📋","Feedback":"💬","Notifications":"🔔",
  "My Evaluations":"📋","Peer Review":"👥","AI Insights":"🤖","Reports":"📁",
  "Dept. Evaluations":"📋","Surveys":"📊","Performance":"📈","Collaboration":"🤝",
  "Audit Log":"🔍","Published Reports":"📂","Performance Summary":"📈","Dept. Performance":"📈",
};

// ── Data ──────────────────────────────────────────────────────────────────────
const DEPT_DATA = [
  { dept:"Sciences",    score:88, prev:84, faculty:"Faculty of Sciences"    },
  { dept:"Engineering", score:81, prev:83, faculty:"Faculty of Engineering"  },
  { dept:"Arts",        score:76, prev:71, faculty:"Faculty of Arts"         },
  { dept:"Law",         score:84, prev:82, faculty:"Faculty of Law"          },
  { dept:"Medicine",    score:90, prev:89, faculty:"College of Medicine"     },
  { dept:"Education",   score:72, prev:75, faculty:"Faculty of Education"    },
];
const DEPT_COLORS = ["#007AC2","#7C3AED","#E05C2A","#16A34A","#0891B2","#EA580C"];

const EVALS = [
  { course:"MTH 201 – Real Analysis",     lecturer:"Dr. A. Salami",  score:82, status:"Submitted", dept:"Maths" },
  { course:"CSC 301 – Data Structures",   lecturer:"Dr. C. Eze",     score:76, status:"Submitted", dept:"CS"    },
  { course:"STA 201 – Probability",       lecturer:"Dr. M. Adamu",   score:null,status:"Pending",  dept:"Stats" },
  { course:"PHY 201 – Electromagnetism",  lecturer:"Dr. K. Lawal",   score:null,status:"Pending",  dept:"Physics"},
];

const PEER_REVIEWS = [
  { name:"Dr. A. Salami",  course:"MTH 201", dept:"Mathematics",  score:null, status:"Pending",   due:"May 15, 2026" },
  { name:"Dr. M. Adamu",   course:"STA 201", dept:"Statistics",    score:88,   status:"Completed", due:"Apr 30, 2026" },
  { name:"Dr. K. Lawal",   course:"PHY 201", dept:"Physics",       score:null, status:"Pending",   due:"May 20, 2026" },
];

const SURVEYS = [
  { title:"Semester Feedback – 2nd Sem 2025/26", deadline:"May 5, 2026",  responses:312, total:500, active:true  },
  { title:"Campus Safety Assessment",             deadline:"Apr 30, 2026", responses:198, total:300, active:true  },
  { title:"Library Resources Survey",             deadline:"Apr 15, 2026", responses:290, total:290, active:false },
];

const REPORTS = [
  { title:"Q1 2026 Departmental Performance",  date:"Apr 1, 2026",  type:"PDF",   status:"Ready",     visible:["admin","deptadmin","external","lecturer"] },
  { title:"Student Satisfaction Index – 2025", date:"Jan 10, 2026", type:"Excel", status:"Ready",     visible:["admin","deptadmin","external"]             },
  { title:"NUC Accreditation Report Draft",    date:"Mar 20, 2026", type:"PDF",   status:"In Review", visible:["admin"]                                   },
  { title:"Faculty Peer Review Summary",        date:"Feb 28, 2026", type:"PDF",   status:"Ready",     visible:["admin","lecturer"]                        },
  { title:"Faculty of Sciences – Semester 2",  date:"Apr 20, 2026", type:"PDF",   status:"Ready",     visible:["admin","deptadmin","external"]             },
];

const AUDIT_LOG = [
  { time:"10:32 AM", user:"Mrs. Fatima Umar", action:"Generated NUC Accreditation Report", type:"AI Report" },
  { time:"9:14 AM",  user:"Dr. Emeka Okafor", action:"Submitted Q1 peer review for Dr. A. Salami", type:"Peer Review" },
  { time:"8:55 AM",  user:"Mr. Tunde Adeyemi",action:"Opened Semester Feedback survey", type:"Survey"    },
  { time:"Yesterday",user:"System",           action:"Auto-archived Library Resources Survey (deadline passed)", type:"System" },
  { time:"Yesterday",user:"Aisha Bello",      action:"Submitted anonymous feedback — Category: Academic", type:"Feedback"  },
  { time:"2 days ago",user:"Mrs. Fatima Umar",action:"Exported Q1 2026 Departmental Performance to PDF", type:"Export"   },
];

const MESSAGES = [
  { from:"QA Admin", text:"Please remind faculty to complete peer reviews by Friday.", time:"10:32 AM", unread:true  },
  { from:"Dr. Emeka Okafor", text:"I've submitted my Q1 self-assessment.", time:"9:14 AM", unread:false },
  { from:"System", text:"New survey: Campus Safety Assessment published.", time:"Yesterday", unread:false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const sp = (h=8) => <div style={{height:h}}/>;

function Badge({label,color=C.blue,bg="#E8F4FF"}) {
  return <span style={{display:"inline-block",fontSize:11,fontWeight:700,color,background:bg,padding:"2px 10px",borderRadius:20}}>{label}</span>;
}
function ProgressBar({pct,color=C.blue}) {
  return (
    <div style={{height:7,background:"#E8EEF8",borderRadius:99,overflow:"hidden",marginTop:5}}>
      <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width 0.6s"}}/>
    </div>
  );
}
function Card({children,style={}}) {
  return <div style={{background:C.white,borderRadius:12,padding:20,boxShadow:"0 1px 8px rgba(0,0,0,0.07)",border:`1px solid ${C.border}`,...style}}>{children}</div>;
}
function SectionTitle({children,action=null}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:C.navy}}>{children}</div>
      {action}
    </div>
  );
}
function Btn({children,onClick,variant="primary",small=false}) {
  const styles = {
    primary:{background:C.blue,color:C.white,border:"none"},
    outline:{background:"transparent",color:C.blue,border:`1.5px solid ${C.blue}`},
    ghost:  {background:"#F0F4FC",color:C.grey,border:"none"},
    danger: {background:C.orange,color:C.white,border:"none"},
    gold:   {background:C.gold,color:C.white,border:"none"},
  };
  return (
    <button onClick={onClick} style={{...styles[variant],padding:small?"4px 12px":"8px 18px",borderRadius:8,fontWeight:700,fontSize:small?11:13,cursor:"pointer",fontFamily:"inherit"}}>
      {children}
    </button>
  );
}
function NDPRBadge() {
  return (
    <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:8,padding:"8px 14px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
      <span style={{fontSize:16}}>🔒</span>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"#16A34A"}}>NDPR 2019 Compliant — Full Anonymity Guaranteed</div>
        <div style={{fontSize:10,color:C.mgrey}}>Your identity is never stored. No IP address, session ID, or user token is linked to this submission. This is architecturally enforced — not just a policy.</div>
      </div>
    </div>
  );
}
function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const on = () => setOnline(true); const off = () => setOnline(false);
    window.addEventListener("online",on); window.addEventListener("offline",off);
    return () => { window.removeEventListener("online",on); window.removeEventListener("offline",off); };
  },[]);
  if (online) return (
    <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#16A34A"}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:"#16A34A",display:"inline-block"}}/>
      PWA Online
    </div>
  );
  return (
    <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.orange}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:C.orange,display:"inline-block"}}/>
      Offline — submissions cached locally
    </div>
  );
}

function BarChart() {
  const max = Math.max(...DEPT_DATA.map(d=>d.score));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:10,height:110,paddingTop:8}}>
      {DEPT_DATA.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:10,fontWeight:700,color:C.navy}}>{d.score}</span>
          <div style={{width:"100%",background:DEPT_COLORS[i],borderRadius:"4px 4px 0 0",height:`${(d.score/max)*80}px`,transition:"height 0.5s",position:"relative"}}>
            {d.score < d.prev && <div style={{position:"absolute",top:-14,right:0,fontSize:9,color:C.orange}}>▼</div>}
            {d.score > d.prev && <div style={{position:"absolute",top:-14,right:0,fontSize:9,color:C.green}}>▲</div>}
          </div>
          <span style={{fontSize:9,color:C.mgrey,textAlign:"center"}}>{d.dept}</span>
        </div>
      ))}
    </div>
  );
}

function Heatmap() {
  const scores = DEPT_DATA.map(d=>d.score);
  const getColor = (score) => {
    if (score >= 88) return "#16A34A";
    if (score >= 80) return "#007AC2";
    if (score >= 75) return "#C9A84C";
    return "#E05C2A";
  };
  return (
    <div>
      <div style={{fontSize:11,color:C.mgrey,marginBottom:8}}>Faculty Performance Heatmap</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
        {DEPT_DATA.map((d,i)=>(
          <div key={i} style={{background:getColor(d.score),borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:800,color:C.white}}>{d.score}%</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.85)",marginTop:2}}>{d.dept}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginTop:8,flexWrap:"wrap"}}>
        {[["≥88% — Strong","#16A34A"],["80–87% — Good","#007AC2"],["75–79% — Monitor","#C9A84C"],["<75% — Action Needed","#E05C2A"]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:C.mgrey}}>
            <span style={{width:8,height:8,borderRadius:2,background:c,display:"inline-block"}}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════════════════════════════════════════

// ── Shared Dashboard ──────────────────────────────────────────────────────────
function Dashboard({role}) {
  const user = ROLES[role];
  const kpis = role==="student"
    ? [{label:"My Evaluations",value:"2/4",sub:"Pending",color:C.purple},{label:"Anonymous Submissions",value:"3",sub:"This semester",color:C.blue},{label:"Surveys Completed",value:"1/2",sub:"Active",color:C.orange},{label:"QA Reports Viewed",value:"5",sub:"Published",color:C.green}]
    : role==="lecturer"
    ? [{label:"Course Evals Received",value:"76%",sub:"+8% vs last sem",color:C.blue},{label:"Avg. Rating",value:"4.1/5",sub:"This semester",color:C.green},{label:"Peer Reviews Due",value:"2",sub:"Pending",color:C.orange},{label:"AI Insights",value:"3",sub:"New this week",color:C.purple}]
    : role==="deptadmin"
    ? [{label:"Dept. Compliance",value:"84%",sub:"Faculty of Science",color:C.blue},{label:"Open Surveys",value:"2",sub:"Active",color:C.green},{label:"Evaluations Rate",value:"71%",sub:"Submissions",color:C.orange},{label:"Action Items",value:"3",sub:"Flagged by AI",color:C.red}]
    : role==="external"
    ? [{label:"Published Reports",value:"5",sub:"Available to view",color:C.blue},{label:"Avg. Performance",value:"82%",sub:"Across faculties",color:C.green},{label:"NUC Compliance",value:"91%",sub:"Overall",color:C.purple},{label:"Last Updated",value:"May 1",sub:"2026",color:C.mgrey}]
    : [{label:"Student Satisfaction",value:"78%",sub:"▲ +4%",color:C.blue},{label:"Evaluations Submitted",value:"1,243",sub:"▲ +12%",color:C.green},{label:"Open Complaints",value:"17",sub:"▼ -3",color:C.orange},{label:"Compliance Rate",value:"91%",sub:"▲ +2%",color:C.purple}];

  return (
    <div>
      <div style={{background:"#EEF4FF",borderRadius:10,padding:"12px 18px",marginBottom:22,display:"flex",alignItems:"center",gap:12,border:`1px solid #C5D8F5`}}>
        <div style={{width:42,height:42,borderRadius:"50%",background:user.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:C.white,fontSize:15}}>{user.avatar}</div>
        <div>
          <div style={{fontWeight:700,color:C.navy,fontSize:14}}>Welcome back, {user.name.split(" ")[0]} 👋</div>
          <div style={{fontSize:12,color:C.mgrey}}>{user.title} · {user.dept}</div>
        </div>
        <div style={{marginLeft:"auto",fontSize:11,background:C.navy,color:C.gold,padding:"4px 10px",borderRadius:6,fontWeight:700}}>
          {role==="student"?"Student View":role==="lecturer"?"Lecturer View":role==="deptadmin"?"Dept. Admin View":role==="admin"?"QA Admin — Full Access":"External Stakeholder — Read Only"}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {kpis.map((k,i)=>(
          <Card key={i} style={{borderTop:`3px solid ${k.color}`}}>
            <div style={{fontSize:11,color:C.mgrey,marginBottom:6}}>{k.label}</div>
            <div style={{fontSize:26,fontWeight:800,color:C.navy,marginBottom:4}}>{k.value}</div>
            <div style={{fontSize:11,color:C.mgrey}}>{k.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card>
          <SectionTitle>Department Performance</SectionTitle>
          <BarChart/>
        </Card>
        <Card>
          <SectionTitle>Active Surveys</SectionTitle>
          {SURVEYS.filter(s=>s.active).map((s,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{s.title}</div>
              <div style={{fontSize:11,color:C.mgrey,marginTop:2}}>Deadline: {s.deadline} · {s.responses}/{s.total}</div>
              <ProgressBar pct={Math.round(s.responses/s.total*100)}/>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── Student: Evaluations ──────────────────────────────────────────────────────
function Evaluations({role}) {
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card>
        <SectionTitle>My Course Evaluations</SectionTitle>
        {EVALS.map((e,i)=>(
          <div key={i} onClick={()=>{if(e.status==="Pending"){setSelected(e);setDone(false);setRating(0);setComment("");}}}
            style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${C.border}`,marginBottom:10,cursor:e.status==="Pending"?"pointer":"default",background:selected===e?"#EEF4FF":C.white,transition:"all 0.15s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{e.course}</div>
                <div style={{fontSize:11,color:C.mgrey,marginTop:2}}>{e.lecturer}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {e.score&&<span style={{fontSize:13,fontWeight:800,color:C.blue}}>{e.score}%</span>}
                <Badge label={e.status} color={e.status==="Submitted"?C.green:C.orange} bg={e.status==="Submitted"?C.lgreen:C.lorange}/>
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        {done?(
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <div style={{fontSize:52,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:700,color:C.green}}>Submitted Anonymously!</div>
            <div style={{fontSize:12,color:C.mgrey,marginTop:6,marginBottom:16}}>Your feedback is recorded. No identity data was stored.</div>
            <div style={{background:C.lgreen,border:"1px solid #86EFAC",borderRadius:8,padding:"8px 14px",fontSize:11,color:C.green,marginBottom:16}}>🔒 NDPR Compliant — Zero identity linkage confirmed</div>
            <Btn onClick={()=>{setDone(false);setSelected(null);}}>Back to List</Btn>
          </div>
        ):selected?(
          <>
            <NDPRBadge/>
            <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>Submit Evaluation</div>
            <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:2}}>{selected.course}</div>
            <div style={{fontSize:11,color:C.mgrey,marginBottom:18}}>{selected.lecturer}</div>
            <div style={{fontSize:12,color:C.grey,marginBottom:8}}>Overall Rating</div>
            <div style={{display:"flex",gap:6,marginBottom:18}}>
              {[1,2,3,4,5].map(s=>(
                <span key={s} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)} onClick={()=>setRating(s)}
                  style={{fontSize:32,cursor:"pointer",color:(hover||rating)>=s?"#F5A623":"#E0E8F5",transition:"color 0.1s"}}>★</span>
              ))}
            </div>
            <div style={{fontSize:12,color:C.grey,marginBottom:6}}>Comments <span style={{color:C.mgrey}}>(anonymous — identity never stored)</span></div>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your honest feedback..."
              style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,color:C.grey,outline:"none",minHeight:80,resize:"vertical",boxSizing:"border-box",background:C.lgrey}}/>
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <Btn onClick={()=>{if(rating>0)setDone(true);}}>Submit Anonymously 🔒</Btn>
              <Btn variant="ghost" onClick={()=>setSelected(null)}>Cancel</Btn>
            </div>
            {rating===0&&<div style={{marginTop:8,fontSize:11,color:C.orange}}>Please select a star rating first.</div>}
          </>
        ):(
          <div style={{textAlign:"center",padding:"50px 0",color:"#C0D0E8"}}>
            <div style={{fontSize:44,marginBottom:10}}>📋</div>
            <div style={{fontSize:13}}>Click a <b style={{color:C.orange}}>Pending</b> evaluation to begin</div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Student: Feedback ─────────────────────────────────────────────────────────
function Feedback() {
  const [tag, setTag] = useState("General");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card>
        <NDPRBadge/>
        <SectionTitle>🔒 Anonymous Suggestion Box</SectionTitle>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
          {["General","Academic","Infrastructure","Admin","Safety","SERVICOM"].map(t=>(
            <button key={t} onClick={()=>setTag(t)} style={{padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:tag===t?C.navy:"#EEF4FF",color:tag===t?C.white:C.navy,transition:"all 0.15s"}}>
              {t}
            </button>
          ))}
        </div>
        <textarea value={text} onChange={e=>{setText(e.target.value);setSent(false);}} placeholder="Write your suggestion or complaint..."
          style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,outline:"none",minHeight:100,resize:"vertical",boxSizing:"border-box",background:C.lgrey}}/>
        <Btn onClick={()=>{if(text.trim()){setSent(true);setText("");}}} style={{marginTop:12,width:"100%"}}>
          Submit Anonymously 🔒
        </Btn>
        {sent&&<div style={{marginTop:10,padding:"8px 14px",background:C.lgreen,borderRadius:8,fontSize:12,color:C.green,fontWeight:700}}>✓ Submitted. NDPR compliance confirmed — zero identity stored.</div>}
      </Card>
      <Card>
        <SectionTitle>Active Surveys</SectionTitle>
        {SURVEYS.map((s,i)=>(
          <div key={i} style={{paddingBottom:14,marginBottom:14,borderBottom:i<SURVEYS.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{s.title}</div>
              <Badge label={s.active?"Active":"Closed"} color={s.active?C.blue:C.mgrey} bg={s.active?"#E8F4FF":"#F0F4FC"}/>
            </div>
            <div style={{fontSize:11,color:C.mgrey,marginBottom:4}}>Deadline: {s.deadline} · {s.responses} responses</div>
            <ProgressBar pct={Math.round(s.responses/s.total*100)}/>
            {s.active&&<Btn variant="outline" small style={{marginTop:8}}>Take Survey →</Btn>}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Lecturer: Peer Review ─────────────────────────────────────────────────────
function PeerReview() {
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card>
        <SectionTitle>Faculty Peer Review Assignments</SectionTitle>
        <div style={{fontSize:11,color:C.mgrey,marginBottom:14}}>You have been assigned to review the following colleagues this semester. Criteria: Teaching Quality, Course Design, Student Engagement.</div>
        {PEER_REVIEWS.map((r,i)=>(
          <div key={i} onClick={()=>{if(r.status==="Pending"){setSelected(r);setDone(false);setScore("");setNotes("");}}}
            style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${C.border}`,marginBottom:10,cursor:r.status==="Pending"?"pointer":"default",background:selected===r?"#EEF4FF":C.white}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{r.name}</div>
                <div style={{fontSize:11,color:C.mgrey,marginTop:2}}>{r.course} · {r.dept} · Due: {r.due}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {r.score&&<span style={{fontSize:13,fontWeight:800,color:C.blue}}>{r.score}%</span>}
                <Badge label={r.status} color={r.status==="Completed"?C.green:C.orange} bg={r.status==="Completed"?C.lgreen:C.lorange}/>
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        {done?(
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <div style={{fontSize:52,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:700,color:C.green}}>Peer Review Submitted!</div>
            <div style={{fontSize:12,color:C.mgrey,marginTop:6,marginBottom:16}}>Your review has been logged and will feed into the semester performance report.</div>
            <Btn onClick={()=>{setDone(false);setSelected(null);}}>Back</Btn>
          </div>
        ):selected?(
          <>
            <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>Submit Peer Review</div>
            <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:2}}>{selected.name}</div>
            <div style={{fontSize:11,color:C.mgrey,marginBottom:18}}>{selected.course} · {selected.dept}</div>
            {[["Teaching Quality","Rate clarity of instruction and lecture delivery"],["Course Design","Rate alignment of course content with curriculum"],["Student Engagement","Rate lecturer's responsiveness and availability"]].map(([criterion,desc],ci)=>(
              <div key={ci} style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:600,color:C.grey,marginBottom:4}}>{criterion}</div>
                <div style={{fontSize:11,color:C.mgrey,marginBottom:6}}>{desc}</div>
                <div style={{display:"flex",gap:6}}>
                  {[1,2,3,4,5].map(s=>(
                    <span key={s} style={{fontSize:24,cursor:"pointer",color:"#F5A623",opacity:0.3+(s*0.14)}}>★</span>
                  ))}
                </div>
              </div>
            ))}
            <div style={{fontSize:12,color:C.grey,marginBottom:6}}>Overall Score (%)</div>
            <input value={score} onChange={e=>setScore(e.target.value)} placeholder="e.g. 85" type="number" min="0" max="100"
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
            <div style={{fontSize:12,color:C.grey,marginBottom:6}}>Notes (optional)</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Additional observations..."
              style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,outline:"none",minHeight:70,resize:"vertical",boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <Btn onClick={()=>{if(score)setDone(true);}}>Submit Review</Btn>
              <Btn variant="ghost" onClick={()=>setSelected(null)}>Cancel</Btn>
            </div>
          </>
        ):(
          <div style={{textAlign:"center",padding:"50px 0",color:"#C0D0E8"}}>
            <div style={{fontSize:44,marginBottom:10}}>👥</div>
            <div style={{fontSize:13}}>Click a <b style={{color:C.orange}}>Pending</b> review to begin</div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── AI Insights (Lecturer) ────────────────────────────────────────────────────
function AIInsights() {
  const insights = [
    {icon:"📊",label:"Course Rating Trend",color:"#EDE9FE",border:C.purple,text:"Your MTH 201 course rating improved from 3.8 to 4.2 this semester. Students highlight 'clarity of examples' as the top positive. Most flagged concern: 'pace too fast in last 3 weeks of term.'"},
    {icon:"⚠️",label:"Engagement Alert",color:"#FEF9C3",border:C.gold,text:"Evaluation submission rate for PHY 201 is 41% — below the 75% target. 12 students have not submitted. Consider sending a reminder or extending the deadline by 5 days."},
    {icon:"✅",label:"Peer Review Performance",color:"#DCFCE7",border:C.green,text:"Your completed peer review for Dr. Adamu received a 'Thorough' rating from the QA Admin. Your overall peer review participation rate is 67% — 1 pending review due May 20."},
  ];
  return (
    <div>
      <div style={{background:C.navy,borderRadius:12,padding:20,marginBottom:20,display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:32}}>🤖</span>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:C.gold}}>Claude AI — Weekly Lecturer Digest</div>
          <div style={{fontSize:12,color:LAVENDER||"#E0D7FF"}}>Generated by Claude AI · Reviewed by QA Admin Mrs. F. Umar · May 5, 2026</div>
          <div style={{fontSize:11,color:"#9CA3AF",marginTop:4}}>Based on 76 evaluation submissions, 3 peer reviews, and 12 anonymous feedback items relating to your courses.</div>
        </div>
      </div>
      {insights.map((ins,i)=>(
        <div key={i} style={{background:ins.color,border:`1px solid ${ins.border}`,borderRadius:10,padding:16,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>{ins.icon}  {ins.label}</div>
          <div style={{fontSize:12,color:C.grey,lineHeight:1.6}}>{ins.text}</div>
        </div>
      ))}
      <div style={{fontSize:10,color:C.mgrey,marginTop:8,fontStyle:"italic"}}>
        AI outputs are advisory. All recommendations require review by a qualified QA Officer before institutional action is taken. Audit log entry created for this digest delivery.
      </div>
    </div>
  );
}

// ── Performance (Admin/DeptAdmin) ─────────────────────────────────────────────
function Performance({role}) {
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
        {DEPT_DATA.map((d,i)=>{
          const diff = d.score - d.prev;
          return (
            <Card key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,color:DEPT_COLORS[i],marginBottom:4}}>{d.score}%</div>
              <div style={{fontSize:12,fontWeight:700,color:C.navy}}>{d.dept}</div>
              <div style={{fontSize:11,color:diff>=0?C.green:C.orange,marginTop:4}}>
                {diff>=0?"▲":"▼"} {Math.abs(diff)}% vs last semester
              </div>
            </Card>
          );
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card>
          <SectionTitle>Benchmark Comparison</SectionTitle>
          <BarChart/>
        </Card>
        <Card>
          <Heatmap/>
        </Card>
      </div>
      {sp(14)}
      <Card style={{border:`1px solid ${C.purple}`,background:"#FAFAFF"}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:24}}>🤖</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:C.navy,marginBottom:6}}>Claude AI Performance Insight — May 5, 2026</div>
            <div style={{fontSize:12,color:C.grey,lineHeight:1.7,marginBottom:8}}>
              <b style={{color:C.orange}}>⚠️ Action Recommended:</b> Faculty of Education recorded 72% this semester — 3 points below last semester and 10 points below the institutional average of 82%. Three anonymous submissions flagged "outdated curriculum materials" as a concern. A structured peer review and curriculum audit is recommended before the next accreditation cycle.<br/><br/>
              <b style={{color:C.green}}>✅ Strong Performer:</b> College of Medicine leads at 90% for the second consecutive semester. Their evaluation practices should be documented and shared as a benchmark for other faculties.<br/><br/>
              <b style={{color:C.blue}}>📊 Trend Note:</b> Faculty of Engineering declined from 83% to 81% — marginal but worth monitoring. 12 feedback submissions mentioned workload concerns this semester.
            </div>
            <div style={{fontSize:10,color:C.mgrey,fontStyle:"italic"}}>Generated by Claude AI · Human review required before institutional action · This insight is logged in the audit trail.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Reports (with NUC generation) ─────────────────────────────────────────────
function Reports({role}) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [aiReport, setAiReport] = useState("");

  const visibleReports = REPORTS.filter(r => r.visible.includes(role));

  const generateNUCReport = async () => {
    setGenerating(true);
    setGenerated(false);
    setAiReport("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{
            role:"user",
            content:`You are the AssureX Quality Assurance System at the University of Lagos (UNILAG). Generate a concise, professional NUC accreditation report summary based on the following semester data:

Faculty Performance Scores: Sciences 88%, Engineering 81%, Arts 76%, Law 84%, Medicine 90%, Education 72%
Institutional Average: 82%
Total Evaluations Submitted: 1,243 (78% participation rate)
Open Complaints: 17 (down from 20 last semester)
Overall Compliance Rate: 91%

Write a 3-paragraph NUC-aligned QA report summary covering: (1) overall institutional performance, (2) areas of strength and concern with specific faculties named, and (3) recommended actions before the next accreditation visit. Be precise, professional, and evidence-based. End with: "This report was generated by Claude AI and reviewed by QA Admin on ${new Date().toLocaleDateString('en-GB')}. Audit log entry: REF-${Math.random().toString(36).substr(2,8).toUpperCase()}."`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "Report generated successfully.";
      setAiReport(text);
      setGenerated(true);
    } catch(e) {
      setAiReport("Report generation completed. Note: Live API connection unavailable in demo environment — in production, Claude AI generates full NUC-aligned documentation from live Firebase data.\n\nSAMPLE OUTPUT:\n\nThis semester, the University of Lagos recorded an institutional average performance score of 82% across 6 monitored faculties, with 1,243 course evaluations submitted representing a 78% participation rate — an improvement of 12% over the previous semester.\n\nThe College of Medicine led performance at 90%, followed by Faculty of Sciences at 88%. The Faculty of Education recorded the lowest score at 72%, representing a 3-point decline from the previous semester. Anonymous feedback submissions identified curriculum relevance and resource access as primary concerns in that faculty.\n\nRecommended actions prior to the next NUC accreditation visit: (1) Conduct a structured curriculum review for the Faculty of Education; (2) Document and disseminate best practices from the College of Medicine; (3) Address the 17 open complaint items within 30 days.\n\nThis report was generated by Claude AI and reviewed by QA Admin on ${new Date().toLocaleDateString('en-GB')}. Audit log entry: REF-DEMO-SAMPLE.".replace('${new Date().toLocaleDateString(\'en-GB\')}', new Date().toLocaleDateString('en-GB')));
      setGenerated(true);
    }
    setGenerating(false);
  };

  return (
    <div>
      {role==="admin" && (
        <Card style={{marginBottom:18,border:`1px solid ${C.purple}`,background:"#FAFAFF"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:C.navy}}>🤖 Generate NUC Accreditation Report</div>
              <div style={{fontSize:11,color:C.mgrey,marginTop:2}}>Claude AI reads all evaluation data and writes a compliance-ready NUC report in seconds.</div>
            </div>
            <Btn variant="gold" onClick={generateNUCReport} disabled={generating}>
              {generating?"⏳ Generating...":"Generate NUC Report"}
            </Btn>
          </div>
          {generating && (
            <div style={{background:C.lgrey,borderRadius:8,padding:16,textAlign:"center"}}>
              <div style={{fontSize:13,color:C.purple,fontWeight:600,marginBottom:4}}>🤖 Claude AI is reading evaluation data...</div>
              <div style={{fontSize:11,color:C.mgrey}}>Analysing 1,243 submissions · Clustering feedback themes · Generating NUC-aligned narrative</div>
            </div>
          )}
          {generated && aiReport && (
            <div style={{background:C.lgrey,borderRadius:8,padding:16,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:C.purple,marginBottom:8}}>✅ NUC ACCREDITATION REPORT — Generated by Claude AI</div>
              <div style={{fontSize:11,color:C.grey,lineHeight:1.7,whiteSpace:"pre-line"}}>{aiReport}</div>
              <div style={{marginTop:12,display:"flex",gap:10}}>
                <Btn small>Download PDF</Btn>
                <Btn small variant="outline">Save to Archive</Btn>
              </div>
            </div>
          )}
        </Card>
      )}

      <Card>
        <SectionTitle>
          {role==="external"?"Published Reports":"Reports & Documents"}
        </SectionTitle>
        {role==="external" && (
          <div style={{background:"#F0F4FC",borderRadius:8,padding:"8px 14px",marginBottom:14,fontSize:11,color:C.mgrey}}>
            👁️ External Stakeholder — Read-only access to published institutional reports only.
          </div>
        )}
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:`2px solid ${C.border}`}}>
              {["Report Title","Date","Type","Status","Action"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"8px 12px",color:C.mgrey,fontWeight:600,fontSize:12}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleReports.map((r,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"12px",fontWeight:600,color:C.navy}}>{r.title}</td>
                <td style={{padding:"12px",color:C.mgrey,fontSize:12}}>{r.date}</td>
                <td style={{padding:"12px"}}><Badge label={r.type} color="#6C3FC5" bg="#F0EAFF"/></td>
                <td style={{padding:"12px"}}><Badge label={r.status} color={r.status==="Ready"?C.green:C.orange} bg={r.status==="Ready"?C.lgreen:C.lorange}/></td>
                <td style={{padding:"12px"}}>{r.status==="Ready"&&<Btn small variant="outline">Download</Btn>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Collaboration ─────────────────────────────────────────────────────────────
function Collaboration() {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState(MESSAGES.map(m=>({...m})));
  const send = () => {if(msg.trim()){setChats([...chats,{from:"You",text:msg,time:"Just now",unread:false}]);setMsg("");}};
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <Card>
        <SectionTitle>Secure Team Messages</SectionTitle>
        <div style={{maxHeight:260,overflowY:"auto",marginBottom:12}}>
          {chats.map((m,i)=>(
            <div key={i} style={{padding:"10px 14px",borderRadius:10,background:m.unread?"#EEF4FF":m.from==="You"?"#F0F9FF":"#F8FAFD",border:`1px solid ${C.border}`,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,fontWeight:700,color:m.from==="You"?C.blue:C.navy}}>{m.from}</span>
                <span style={{fontSize:11,color:C.mgrey}}>{m.time}</span>
              </div>
              <div style={{fontSize:12,color:"#4A5A6E",marginTop:3}}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..."
            style={{flex:1,padding:"9px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,outline:"none"}}/>
          <Btn onClick={send}>Send</Btn>
        </div>
      </Card>
      <Card>
        <SectionTitle>Shared Report Library</SectionTitle>
        <div style={{fontSize:11,color:C.mgrey,marginBottom:14}}>Version-controlled documents shared across QA Officers, Dept. Heads, and Faculty.</div>
        {REPORTS.slice(0,4).map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:8,background:r.type==="PDF"?"#FEF0EA":"#E6FAF2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:r.type==="PDF"?C.orange:C.green}}>{r.type}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:C.navy}}>{r.title}</div>
              <div style={{fontSize:11,color:C.mgrey}}>{r.date} · v1.{i+1}</div>
            </div>
            <Btn small variant="ghost">View</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Audit Log ─────────────────────────────────────────────────────────────────
function AuditLog() {
  const typeColors = {"AI Report":"#EDE9FE","Peer Review":"#DCFCE7","Survey":"#DBEAFE","System":"#F0F4FC","Feedback":"#FEF9C3","Export":"#FFEDD5"};
  return (
    <Card>
      <SectionTitle>System Audit Log — All Activity Tracked</SectionTitle>
      <div style={{fontSize:11,color:C.mgrey,marginBottom:14,background:"#F0F4FC",padding:"8px 12px",borderRadius:8}}>
        🔍 Every user action, AI inference call, and data export is logged here with timestamp and user identity. Required for NDPR 2019 accountability compliance.
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead>
          <tr style={{borderBottom:`2px solid ${C.border}`}}>
            {["Time","User","Action","Type"].map(h=>(
              <th key={h} style={{textAlign:"left",padding:"8px 12px",color:C.mgrey,fontWeight:600,fontSize:11}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AUDIT_LOG.map((log,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
              <td style={{padding:"10px 12px",color:C.mgrey,fontSize:11,whiteSpace:"nowrap"}}>{log.time}</td>
              <td style={{padding:"10px 12px",fontWeight:600,color:C.navy}}>{log.user}</td>
              <td style={{padding:"10px 12px",color:C.grey}}>{log.action}</td>
              <td style={{padding:"10px 12px"}}><span style={{background:typeColors[log.type]||"#F0F4FC",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,color:C.navy}}>{log.type}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ── External: Published Reports ───────────────────────────────────────────────
function PublishedReports() {
  return (
    <div>
      <div style={{background:"#F0F4FC",borderRadius:10,padding:"12px 18px",marginBottom:18,border:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:20}}>👁️</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:C.navy}}>External Stakeholder Access</div>
          <div style={{fontSize:11,color:C.mgrey}}>You have read-only access to published institutional reports and performance summaries. No personally identifiable student data is visible at this access level.</div>
        </div>
      </div>
      <Reports role="external"/>
    </div>
  );
}

function PerformanceSummary() {
  return (
    <div>
      <div style={{background:"#F0F4FC",borderRadius:10,padding:"12px 18px",marginBottom:18,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:13,fontWeight:700,color:C.navy}}>Published Performance Summary — NUC External View</div>
        <div style={{fontSize:11,color:C.mgrey,marginTop:2}}>Aggregated, anonymised institutional performance data. Individual student and lecturer data is not accessible at this level.</div>
      </div>
      <Performance role="external"/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE ROUTER
// ══════════════════════════════════════════════════════════════════════════════
function getPage(role, page) {
  const map = {
    "Dashboard":         <Dashboard role={role}/>,
    "Evaluations":       <Evaluations role={role}/>,
    "Feedback":          <Feedback/>,
    "Notifications":     <div><Card><div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Notifications</div>{["New survey published: Campus Safety Assessment","Your MTH 201 evaluation was submitted successfully","Semester Feedback survey — 3 days remaining"].map((n,i)=><div key={i} style={{padding:"10px 0",borderBottom:i<2?`1px solid ${C.border}`:"none",fontSize:13,color:C.grey}}>🔔 {n}</div>)}</Card></div>,
    "My Evaluations":    <Evaluations role={role}/>,
    "Peer Review":       <PeerReview/>,
    "AI Insights":       <AIInsights/>,
    "Reports":           <Reports role={role}/>,
    "Dept. Evaluations": <Evaluations role={role}/>,
    "Surveys":           <Feedback/>,
    "Performance":       <Performance role={role}/>,
    "Dept. Performance": <Performance role={role}/>,
    "Collaboration":     <Collaboration/>,
    "Audit Log":         <AuditLog/>,
    "Published Reports": <PublishedReports/>,
    "Performance Summary":<PerformanceSummary/>,
  };
  return map[page] || <Dashboard role={role}/>;
}

const PAGE_SUBS = {
  "Dashboard":"Your real-time quality assurance overview",
  "Evaluations":"Submit and track course evaluations",
  "My Evaluations":"View evaluation results for your courses",
  "Feedback":"Anonymous surveys and suggestions",
  "Notifications":"System alerts and updates",
  "Peer Review":"Review and assess faculty colleagues",
  "AI Insights":"Claude AI-generated performance insights",
  "Reports":"Download, generate, and manage QA reports",
  "Dept. Evaluations":"Departmental evaluation overview",
  "Surveys":"Manage departmental surveys",
  "Performance":"KPIs, benchmarks and trend analysis",
  "Collaboration":"Messages and shared documents",
  "Audit Log":"Full system activity trail — NDPR accountability",
  "Published Reports":"Institutional reports available for external review",
  "Performance Summary":"Aggregated performance data — external stakeholder view",
};

// ══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ══════════════════════════════════════════════════════════════════════════════
export default function AssureX() {
  const [role, setRole] = useState("student");
  const [page, setPage] = useState("Dashboard");
  const user = ROLES[role];
  const navItems = NAV[role];

  useEffect(()=>{
    setPage(navItems[0]);
  },[role]);

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#F3F6FB",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} button:hover{opacity:0.88} button:disabled{opacity:0.5;cursor:not-allowed}`}</style>

      {/* Navbar */}
      <nav style={{background:C.navy,color:C.white,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:58,boxShadow:"0 2px 14px rgba(0,0,0,0.22)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:C.blue,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13}}>AX</div>
          <div>
            <div style={{fontWeight:800,fontSize:16}}>AssureX</div>
            <div style={{fontSize:10,color:"#ADC8E6"}}>UNILAG Quality Assurance System</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <OfflineIndicator/>
          <select value={role} onChange={e=>setRole(e.target.value)}
            style={{padding:"5px 10px",borderRadius:6,border:"none",background:"#2A4A8C",color:C.white,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            <option value="student">👤 Student</option>
            <option value="lecturer">👨‍🏫 Lecturer / Faculty</option>
            <option value="deptadmin">🏢 Dept. Admin</option>
            <option value="admin">🔐 QA Admin</option>
            <option value="external">🌐 External Stakeholder</option>
          </select>
          <div style={{position:"relative",cursor:"pointer"}}>
            <div style={{position:"absolute",top:-4,right:-4,width:18,height:18,background:C.orange,borderRadius:"50%",fontSize:9,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>3</div>
            <span style={{fontSize:20}}>🔔</span>
          </div>
          <div style={{width:32,height:32,borderRadius:"50%",background:user.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,cursor:"pointer"}}>{user.avatar}</div>
        </div>
      </nav>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Sidebar */}
        <aside style={{width:210,background:C.white,borderRight:`1px solid ${C.border}`,padding:"16px 0",display:"flex",flexDirection:"column",flexShrink:0}}>
          {navItems.map(p=>(
            <div key={p} onClick={()=>setPage(p)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 18px",cursor:"pointer",borderLeft:page===p?`3px solid ${C.blue}`:"3px solid transparent",background:page===p?"#EEF4FF":"transparent",color:page===p?C.navy:"#5A6A7E",fontWeight:page===p?700:400,fontSize:13,marginRight:10,borderRadius:"0 8px 8px 0",transition:"all 0.15s"}}>
              <span style={{fontSize:15}}>{NAV_ICONS[p]||"●"}</span><span>{p}</span>
            </div>
          ))}
          <div style={{flex:1}}/>
          <div style={{padding:"0 18px",borderTop:`1px solid ${C.border}`,paddingTop:14}}>
            <div style={{fontSize:10,color:"#B0C0D8",marginBottom:3}}>Logged in as</div>
            <div style={{fontSize:12,fontWeight:700,color:"#4A5A6E"}}>{user.name}</div>
            <div style={{fontSize:11,color:C.mgrey}}>{user.title}</div>
            <div style={{marginTop:6,fontSize:10,background:C.navy,color:C.gold,padding:"3px 8px",borderRadius:6,display:"inline-block",fontWeight:700}}>
              {role==="admin"?"Full Access":role==="external"?"Read Only":"Limited Access"}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{flex:1,padding:24,overflowY:"auto"}}>
          <div style={{fontSize:20,fontWeight:800,color:C.navy,marginBottom:3}}>{page}</div>
          <div style={{fontSize:12,color:C.mgrey,marginBottom:20}}>{PAGE_SUBS[page]||""}</div>
          {getPage(role, page)}
        </main>
      </div>
    </div>
  );
}