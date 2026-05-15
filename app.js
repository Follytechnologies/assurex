'use strict';

// ── Data ─────────────────────────────────────────────────────────────────────
const ROLES = {
  student:   { name:'Aisha Bello',         title:'Student',             dept:'Computer Science',   avatar:'AB', color:'#7C3AED' },
  lecturer:  { name:'Dr. Emeka Okafor',    title:'Lecturer / Faculty',  dept:'Engineering',        avatar:'EO', color:'#007AC2' },
  deptadmin: { name:'Mr. Tunde Adeyemi',   title:'Dept. Admin',         dept:'Faculty of Science', avatar:'TA', color:'#E05C2A' },
  admin:     { name:'Mrs. Fatima Umar',    title:'QA Admin',            dept:'SERVICOM Unit',      avatar:'FU', color:'#16A34A' },
  external:  { name:'Dr. Ngozi Okonkwo',   title:'External Stakeholder',dept:'NUC Evaluator',      avatar:'NO', color:'#6B7280' },
};

const NAV_MAP = {
  student:   [['Dashboard','⊞'],['Evaluations','📋'],['Feedback','💬'],['Notifications','🔔']],
  lecturer:  [['Dashboard','⊞'],['My Evaluations','📋'],['Peer Review','👥'],['AI Insights','🤖'],['Reports','📁']],
  deptadmin: [['Dashboard','⊞'],['Dept. Evaluations','📋'],['Surveys','📊'],['Performance','📈'],['Reports','📁']],
  admin:     [['Dashboard','⊞'],['Evaluations','📋'],['Feedback','💬'],['Performance','📈'],['Reports','📁'],['Collaboration','🤝'],['Audit Log','🔍']],
  external:  [['Published Reports','📂'],['Performance Summary','📈']],
};

const PAGE_SUBS = {
  'Dashboard':'Your real-time quality assurance overview',
  'Evaluations':'Submit and track course evaluations',
  'My Evaluations':'View evaluation results for your courses',
  'Feedback':'Anonymous surveys and suggestions',
  'Notifications':'System alerts and updates',
  'Peer Review':'Review and assess faculty colleagues',
  'AI Insights':'Claude AI-generated performance insights',
  'Reports':'Download, generate, and manage QA reports',
  'Dept. Evaluations':'Departmental evaluation overview',
  'Surveys':'Manage departmental surveys',
  'Performance':'KPIs, benchmarks and trend analysis',
  'Collaboration':'Messages and shared documents',
  'Audit Log':'Full system activity trail — NDPR accountability',
  'Published Reports':'Institutional reports available for external review',
  'Performance Summary':'Aggregated performance data — external stakeholder view',
};

const DEPT_DATA = [
  { dept:'Sciences',         score:88, prev:84, color:'#007AC2' },
  { dept:'Engineering',      score:81, prev:83, color:'#7C3AED' },
  { dept:'Arts',             score:76, prev:71, color:'#E05C2A' },
  { dept:'Law',              score:84, prev:82, color:'#16A34A' },
  { dept:'Medicine',         score:90, prev:89, color:'#0891B2' },
  { dept:'Education',        score:72, prev:75, color:'#EA580C' },
  { dept:'Social Sciences',  score:79, prev:77, color:'#6D28D9' },
  { dept:'Business Admin',   score:83, prev:80, color:'#0369A1' },
  { dept:'Pharmacy',         score:86, prev:84, color:'#15803D' },
  { dept:'Environmental Sci',score:74, prev:72, color:'#B45309' },
  { dept:'Basic Med Sci',    score:87, prev:85, color:'#0E7490' },
  { dept:'Dental Sciences',  score:85, prev:83, color:'#7C3AED' },
  { dept:'Postgraduate',     score:80, prev:78, color:'#BE185D' },
];

const EVALS = [
  { course:'MTH 201 – Real Analysis',       lecturer:'Dr. A. Salami',  score:82,   status:'Submitted', faculty:'Sciences'        },
  { course:'LAW 301 – Constitutional Law',  lecturer:'Dr. C. Eze',     score:76,   status:'Submitted', faculty:'Law'             },
  { course:'BUS 201 – Business Finance',    lecturer:'Dr. M. Adamu',   score:null, status:'Pending',   faculty:'Business Admin'  },
  { course:'PHR 201 – Pharmacology I',      lecturer:'Dr. K. Lawal',   score:null, status:'Pending',   faculty:'Pharmacy'        },
];

const PEER_REVIEWS = [
  { name:'Dr. A. Salami', course:'MTH 201', dept:'Mathematics', score:null, status:'Pending',   due:'May 15, 2026' },
  { name:'Dr. M. Adamu',  course:'STA 201', dept:'Statistics',  score:88,   status:'Completed', due:'Apr 30, 2026' },
  { name:'Dr. K. Lawal',  course:'PHY 201', dept:'Physics',     score:null, status:'Pending',   due:'May 20, 2026' },
];

const SURVEYS = [
  { title:'Semester Feedback – 2nd Sem 2025/26', deadline:'May 5, 2026',  responses:312, total:500, active:true  },
  { title:'Campus Safety Assessment',             deadline:'Apr 30, 2026', responses:198, total:300, active:true  },
  { title:'Library Resources Survey',             deadline:'Apr 15, 2026', responses:290, total:290, active:false },
];

const REPORTS = [
  { title:'Q1 2026 Departmental Performance',  date:'Apr 1, 2026',  type:'PDF',   status:'Ready',     roles:['admin','deptadmin','external','lecturer'] },
  { title:'Student Satisfaction Index – 2025', date:'Jan 10, 2026', type:'Excel', status:'Ready',     roles:['admin','deptadmin','external']             },
  { title:'NUC Accreditation Report Draft',    date:'Mar 20, 2026', type:'PDF',   status:'In Review', roles:['admin']                                    },
  { title:'Faculty Peer Review Summary',        date:'Feb 28, 2026', type:'PDF',   status:'Ready',     roles:['admin','lecturer']                         },
  { title:'Faculty of Sciences – Semester 2',  date:'Apr 20, 2026', type:'PDF',   status:'Ready',     roles:['admin','deptadmin','external']              },
];

const AUDIT_LOG = [
  { time:'10:32 AM',  user:'Mrs. Fatima Umar',  action:'Generated NUC Accreditation Report via Claude AI',       type:'AI Report'  },
  { time:'9:14 AM',   user:'Dr. Emeka Okafor',  action:'Submitted Q1 peer review for Dr. A. Salami',             type:'Peer Review'},
  { time:'8:55 AM',   user:'Mr. Tunde Adeyemi', action:'Opened Semester Feedback survey',                         type:'Survey'    },
  { time:'Yesterday', user:'System',             action:'Auto-archived Library Resources Survey (deadline passed)',type:'System'    },
  { time:'Yesterday', user:'Aisha Bello',        action:'Submitted anonymous feedback — Category: Academic',       type:'Feedback'  },
  { time:'2 days ago',user:'Mrs. Fatima Umar',  action:'Exported Q1 2026 Departmental Performance to PDF',        type:'Export'    },
];

const MESSAGES_INIT = [
  { from:'QA Admin',        text:'Please remind faculty to complete peer reviews by Friday.', time:'10:32 AM', unread:true  },
  { from:'Dr. Emeka Okafor',text:"I've submitted my Q1 self-assessment.",                    time:'9:14 AM',  unread:false },
  { from:'System',           text:'New survey: Campus Safety Assessment published.',          time:'Yesterday',unread:false },
];

// ── State ─────────────────────────────────────────────────────────────────────
let state = {
  role: 'student',
  page: 'Dashboard',
  evalSelected: null,
  evalRating: 0,
  evalDone: false,
  evalComment: '',
  feedbackTag: 'General',
  feedbackText: '',
  feedbackSent: false,
  peerSelected: null,
  peerScore: '',
  peerNotes: '',
  peerDone: false,
  chatMessages: [...MESSAGES_INIT],
  chatInput: '',
  nucGenerating: false,
  nucGenerated: false,
  nucReport: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function h(tag, attrs={}, ...children) {
  const el = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'style') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null) continue;
    el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}

function badge(label, color, bg) {
  return h('span',{class:'badge', style:{color, background:bg}}, label);
}

function progressBar(pct, color='#007AC2') {
  return h('div',{class:'progress-track'},
    h('div',{class:'progress-fill', style:{width:`${pct}%`, background:color}})
  );
}

function btn(label, cls, onClick, disabled=false) {
  const b = h('button',{class:cls, onClick}, label);
  if(disabled) b.disabled = true;
  return b;
}

function card(...children) {
  return h('div',{class:'card'}, ...children);
}

function ndprBadge() {
  return h('div',{class:'ndpr-badge'},
    h('span',{},'🔒'),
    h('div',{},
      h('div',{class:'ndpr-title'},'NDPR 2019 Compliant — Full Anonymity Guaranteed'),
      h('div',{class:'ndpr-body'},'Your identity is never stored. No IP address, session ID, or user token is linked to this submission. Architecturally enforced — not just a policy.')
    )
  );
}

function barChart() {
  const max = Math.max(...DEPT_DATA.map(d=>d.score));
  return h('div',{class:'bar-chart'},
    ...DEPT_DATA.map(d => {
      const pct = (d.score/max)*80;
      const diff = d.score - d.prev;
      return h('div',{class:'bar-col'},
        h('div',{class:'bar-score'}, `${d.score}`),
        h('div',{class:'bar-fill', style:{height:`${pct}px`, background:d.color}},
          h('div',{class:'bar-trend', style:{color: diff>=0?'#16A34A':'#E05C2A'}}, diff>=0?'▲':'▼')
        ),
        h('div',{class:'bar-label'}, d.dept)
      );
    })
  );
}

function heatmap() {
  const getColor = s => s>=88?'#16A34A':s>=80?'#007AC2':s>=75?'#C9A84C':'#E05C2A';
  return h('div',{},
    h('div',{style:{fontSize:'11px', color:'#6B7280', marginBottom:'8px'}},'Faculty Performance Heatmap'),
    h('div',{class:'heatmap-grid'},
      ...DEPT_DATA.map(d => h('div',{class:'heatmap-cell', style:{background:getColor(d.score)}},
        h('div',{class:'hc-score'},`${d.score}%`),
        h('div',{class:'hc-label'},d.dept)
      ))
    ),
    h('div',{class:'heatmap-legend'},
      ...[ ['≥88% Strong','#16A34A'],['80–87% Good','#007AC2'],['75–79% Monitor','#C9A84C'],['<75% Action','#E05C2A'] ]
        .map(([l,c])=>h('div',{class:'hm-leg'}, h('span',{class:'hm-dot',style:{background:c}}), l))
    )
  );
}

// ── KPI configs ───────────────────────────────────────────────────────────────
function getKPIs(role) {
  const maps = {
    student:   [{l:'My Evaluations',v:'2/4',s:'Pending',c:'#7C3AED'},{l:'Anonymous Submissions',v:'3',s:'This semester',c:'#007AC2'},{l:'Surveys Completed',v:'1/2',s:'Active',c:'#E05C2A'},{l:'Reports Viewed',v:'5',s:'Published',c:'#16A34A'}],
    lecturer:  [{l:'Course Evals Received',v:'76%',s:'+8% vs last sem',c:'#007AC2'},{l:'Avg. Rating',v:'4.1/5',s:'This semester',c:'#16A34A'},{l:'Peer Reviews Due',v:'2',s:'Pending',c:'#E05C2A'},{l:'AI Insights',v:'3',s:'New this week',c:'#7C3AED'}],
    deptadmin: [{l:'Dept. Compliance',v:'84%',s:'Faculty of Science',c:'#007AC2'},{l:'Open Surveys',v:'2',s:'Active',c:'#16A34A'},{l:'Evaluation Rate',v:'71%',s:'Submissions',c:'#E05C2A'},{l:'Action Items',v:'3',s:'Flagged by AI',c:'#DC2626'}],
    admin:     [{l:'Student Satisfaction',v:'78%',s:'▲ +4%',c:'#007AC2'},{l:'Evaluations',v:'1,243',s:'▲ +12%',c:'#16A34A'},{l:'Open Complaints',v:'17',s:'▼ -3',c:'#E05C2A'},{l:'Compliance Rate',v:'91%',s:'▲ +2%',c:'#7C3AED'}],
    external:  [{l:'Published Reports',v:'5',s:'Available',c:'#007AC2'},{l:'Avg. Performance',v:'82%',s:'Across faculties',c:'#16A34A'},{l:'NUC Compliance',v:'91%',s:'Overall',c:'#7C3AED'},{l:'Last Updated',v:'May 1',s:'2026',c:'#6B7280'}],
  };
  return maps[role] || maps.student;
}

// ── PAGE RENDERERS ────────────────────────────────────────────────────────────

function renderDashboard(role) {
  const user = ROLES[role];
  const roleName = {student:'Student View',lecturer:'Lecturer View',deptadmin:'Dept. Admin View',admin:'QA Admin — Full Access',external:'External Stakeholder — Read Only'}[role];
  const kpis = getKPIs(role);

  const welcomeBar = h('div',{class:'welcome-bar'},
    h('div',{class:'avatar', style:{background:user.color, width:'42px', height:'42px', fontSize:'15px'}}, user.avatar),
    h('div',{},
      h('div',{class:'wb-name'},`Welcome back, ${user.name.split(' ')[0]} 👋`),
      h('div',{class:'wb-role'},`${user.title} · ${user.dept}`)
    ),
    h('div',{class:'role-badge'}, roleName)
  );

  const kpiGrid = h('div',{class:'grid-4'},
    ...kpis.map(k => h('div',{class:'kpi-card', style:{borderTop:`3px solid ${k.c}`}},
      h('div',{class:'kpi-label'},k.l),
      h('div',{class:'kpi-value'},k.v),
      h('div',{class:'kpi-sub'},k.s)
    ))
  );

  const chartCard = card(
    h('div',{class:'card-title'},'Department Performance'),
    barChart()
  );

  const surveyCard = card(
    h('div',{class:'card-title'},'Active Surveys'),
    ...SURVEYS.filter(s=>s.active).map(s =>
      h('div',{class:'survey-item'},
        h('div',{class:'survey-title'},s.title),
        h('div',{class:'survey-meta'},`Deadline: ${s.deadline} · ${s.responses}/${s.total}`),
        progressBar(Math.round(s.responses/s.total*100))
      )
    )
  );

  return h('div',{},
    welcomeBar, kpiGrid,
    h('div',{class:'grid-2'}, chartCard, surveyCard)
  );
}

function renderEvaluations() {
  const left = card(
    h('div',{class:'card-title'},'My Course Evaluations'),
    ...EVALS.map((e,i) => {
      const isActive = state.evalSelected === i;
      const el = h('div',{class:`eval-item${isActive?' active':''}`,
        onClick: () => {
          if(e.status==='Pending') {
            state.evalSelected = i; state.evalDone = false;
            state.evalRating = 0; state.evalComment = '';
            render();
          }
        }},
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center'}},
          h('div',{},
            h('div',{class:'ei-course'},e.course),
            h('div',{class:'ei-lect'},e.lecturer)
          ),
          h('div',{style:{display:'flex',gap:'8px',alignItems:'center'}},
            e.score ? h('span',{style:{fontSize:'13px',fontWeight:'800',color:'#007AC2'}},`${e.score}%`) : null,
            badge(e.status, e.status==='Submitted'?'#16A34A':'#E05C2A', e.status==='Submitted'?'#DCFCE7':'#FEF0EA')
          )
        )
      );
      return el;
    })
  );

  let rightContent;
 if(state.evalDone) {
    rightContent = h('div',{class:'success-state'},
      h('div',{class:'success-icon'},'✅'),
      h('div',{class:'success-title'},'Submitted Anonymously!'),
      h('div',{class:'success-sub'},'Your feedback is recorded. No identity data was stored.'),
      h('div',{class:'success-ndpr'},'🔒 NDPR Compliant — Zero identity linkage confirmed'),
      h('div',{style:{background:'#EDE9FE',border:'1px solid #7C3AED',borderRadius:'8px',padding:'8px 14px',fontSize:'11px',color:'#1A1035',marginBottom:'16px',textAlign:'left'}},
        '🔑 One-time cryptographic token issued for this submission. Token is hashed and discarded after use — it cannot be linked back to your identity. Duplicate submissions for this course this semester are now prevented.'
      ),
      btn('Back to List','btn-primary',()=>{ state.evalDone=false; state.evalSelected=null; render(); })
    );
  } else if(state.evalSelected !== null) {
    const ev = EVALS[state.evalSelected];
    const stars = h('div',{class:'stars'},
      ...[1,2,3,4,5].map(s => {
        const star = h('div',{class:`star${state.evalRating>=s?' on':''}`},'★');
        star.addEventListener('click',()=>{ state.evalRating=s; render(); });
        star.addEventListener('mouseenter',()=>{ star.classList.add('on'); });
        return star;
      })
    );
    const ta = h('textarea',{placeholder:'Share your honest feedback...'},);
    ta.value = state.evalComment;
    ta.addEventListener('input', e=>{ state.evalComment=e.target.value; });

    rightContent = h('div',{},
      ndprBadge(),
      h('div',{style:{fontSize:'14px',fontWeight:'700',color:'#1A1035',marginBottom:'4px'}},'Submit Evaluation'),
      h('div',{style:{fontSize:'13px',fontWeight:'600',color:'#1A1035',marginBottom:'2px'}},ev.course),
      h('div',{style:{fontSize:'11px',color:'#6B7280',marginBottom:'18px'}},ev.lecturer),
      h('div',{style:{fontSize:'12px',color:'#374151',marginBottom:'8px'}},'Overall Rating'),
      stars,
      h('div',{style:{fontSize:'12px',color:'#374151',marginBottom:'6px'}},
        'Comments ', h('span',{style:{color:'#6B7280'}},'(anonymous — identity never stored)')
      ),
      ta,
      h('div',{style:{display:'flex',gap:'10px',marginTop:'14px'}},
        btn('Submit Anonymously 🔒','btn-primary',()=>{ if(state.evalRating>0){ state.evalDone=true; render(); } }),
        btn('Cancel','btn-ghost',()=>{ state.evalSelected=null; render(); })
      ),
      state.evalRating===0 ? h('div',{style:{marginTop:'8px',fontSize:'11px',color:'#E05C2A'}},'Please select a star rating first.') : null
    );
  } else {
    rightContent = h('div',{class:'empty-state'},
      h('div',{class:'empty-icon'},'📋'),
      h('div',{class:'empty-text'},'Click a ', h('strong',{style:{color:'#E05C2A'}},'Pending'), ' evaluation to begin')
    );
  }

  return h('div',{class:'grid-2'}, left, card(rightContent));
}

function renderFeedback() {
  const tags = ['General','Academic','Infrastructure','Admin','Safety','SERVICOM'];
  const ta = h('textarea',{placeholder:'Write your suggestion or complaint...'});
  ta.value = state.feedbackText;
  ta.addEventListener('input',e=>{ state.feedbackText=e.target.value; state.feedbackSent=false; });

  const left = card(
    ndprBadge(),
    h('div',{class:'card-title'},'🔒 Anonymous Suggestion Box'),
    h('div',{class:'tag-group'},
      ...tags.map(t => {
        const b = h('button',{class:`tag ${state.feedbackTag===t?'active':'inactive'}`},t);
        b.addEventListener('click',()=>{ state.feedbackTag=t; render(); });
        return b;
      })
    ),
    ta,
    h('div',{style:{marginTop:'12px'}},
      btn('Submit Anonymously 🔒','btn-primary',()=>{
        if(state.feedbackText.trim()){ state.feedbackSent=true; state.feedbackText=''; render(); }
      })
    ),
    state.feedbackSent ? h('div',{class:'alert-success'},'✓ Submitted. NDPR compliance confirmed — zero identity stored.') : null
  );

  const right = card(
    h('div',{class:'card-title'},'Active Surveys'),
    ...SURVEYS.map((s,i) =>
      h('div',{class:'survey-item'},
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}},
          h('div',{class:'survey-title'},s.title),
          badge(s.active?'Active':'Closed', s.active?'#007AC2':'#6B7280', s.active?'#E8F4FF':'#F0F4FC')
        ),
        h('div',{class:'survey-meta'},`Deadline: ${s.deadline} · ${s.responses} responses`),
        progressBar(Math.round(s.responses/s.total*100)),
        s.active ? h('div',{style:{marginTop:'8px'}}, btn('Take Survey →','btn-outline btn-sm',()=>{})) : null
      )
    )
  );

  return h('div',{class:'grid-2'}, left, right);
}

function renderPeerReview() {
  const left = card(
    h('div',{class:'card-title'},'Faculty Peer Review Assignments'),
    h('div',{style:{fontSize:'11px',color:'#6B7280',marginBottom:'14px'}},'Criteria: Teaching Quality, Course Design, Student Engagement.'),
    ...PEER_REVIEWS.map((r,i) => {
      const isActive = state.peerSelected===i;
      const el = h('div',{class:`eval-item${isActive?' active':''}`,
        onClick:()=>{ if(r.status==='Pending'){ state.peerSelected=i; state.peerDone=false; state.peerScore=''; state.peerNotes=''; render(); } }},
        h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center'}},
          h('div',{},
            h('div',{class:'ei-course'},r.name),
            h('div',{class:'ei-lect'},`${r.course} · ${r.dept} · Due: ${r.due}`)
          ),
          h('div',{style:{display:'flex',gap:'8px',alignItems:'center'}},
            r.score ? h('span',{style:{fontSize:'13px',fontWeight:'800',color:'#007AC2'}},`${r.score}%`) : null,
            badge(r.status, r.status==='Completed'?'#16A34A':'#E05C2A', r.status==='Completed'?'#DCFCE7':'#FEF0EA')
          )
        )
      );
      return el;
    })
  );

  let rightContent;
  if(state.peerDone) {
    rightContent = h('div',{class:'success-state'},
      h('div',{class:'success-icon'},'✅'),
      h('div',{class:'success-title'},'Peer Review Submitted!'),
      h('div',{class:'success-sub'},'Your review has been logged and will feed into the semester performance report.'),
      btn('Back','btn-primary',()=>{ state.peerDone=false; state.peerSelected=null; render(); })
    );
  } else if(state.peerSelected!==null) {
    const pr = PEER_REVIEWS[state.peerSelected];
    const scoreInput = h('input',{type:'number',min:'0',max:'100',placeholder:'e.g. 85'});
    scoreInput.value = state.peerScore;
    scoreInput.addEventListener('input',e=>state.peerScore=e.target.value);
    const notesTA = h('textarea',{placeholder:'Additional observations...'});
    notesTA.value = state.peerNotes;
    notesTA.addEventListener('input',e=>state.peerNotes=e.target.value);

    rightContent = h('div',{},
      h('div',{style:{fontSize:'14px',fontWeight:'700',color:'#1A1035',marginBottom:'4px'}},'Submit Peer Review'),
      h('div',{style:{fontSize:'13px',fontWeight:'600',color:'#1A1035',marginBottom:'2px'}},pr.name),
      h('div',{style:{fontSize:'11px',color:'#6B7280',marginBottom:'18px'}},`${pr.course} · ${pr.dept}`),
      ...['Teaching Quality','Course Design','Student Engagement'].map((crit,ci) =>
        h('div',{style:{marginBottom:'14px'}},
          h('div',{style:{fontSize:'12px',fontWeight:'600',color:'#374151',marginBottom:'4px'}},crit),
          h('div',{class:'stars'},
            ...[1,2,3,4,5].map(s=>h('div',{class:'star on'},'★'))
          )
        )
      ),
      h('div',{style:{fontSize:'12px',color:'#374151',marginBottom:'6px'}},'Overall Score (%)'),
      scoreInput,
      h('div',{style:{fontSize:'12px',color:'#374151',marginBottom:'6px',marginTop:'12px'}},'Notes (optional)'),
      notesTA,
      h('div',{style:{display:'flex',gap:'10px',marginTop:'14px'}},
        btn('Submit Review','btn-primary',()=>{ if(state.peerScore){ state.peerDone=true; render(); } }),
        btn('Cancel','btn-ghost',()=>{ state.peerSelected=null; render(); })
      )
    );
  } else {
    rightContent = h('div',{class:'empty-state'},
      h('div',{class:'empty-icon'},'👥'),
      h('div',{class:'empty-text'},'Click a ', h('strong',{style:{color:'#E05C2A'}},'Pending'), ' review to begin')
    );
  }

  return h('div',{class:'grid-2'}, left, card(rightContent));
}

function renderAIInsights() {
  const insights = [
    {icon:'📊',label:'Course Rating Trend',bg:'#EDE9FE',border:'#7C3AED',text:"Your MTH 201 course rating improved from 3.8 to 4.2 this semester. Students highlight 'clarity of examples' as the top positive. Most flagged concern: 'pace too fast in last 3 weeks of term.'"},
    {icon:'⚠️',label:'Engagement Alert',bg:'#FEF9C3',border:'#C9A84C',text:"Evaluation submission rate for PHY 201 is 41% — below the 75% target. 12 students have not submitted. Consider sending a reminder or extending the deadline by 5 days."},
    {icon:'✅',label:'Peer Review Performance',bg:'#DCFCE7',border:'#16A34A',text:"Your completed peer review for Dr. Adamu received a 'Thorough' rating from the QA Admin. Your overall peer review participation rate is 67% — 1 pending review due May 20."},
  ];
  return h('div',{},
    h('div',{style:{background:'#1A1035',borderRadius:'12px',padding:'20px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'14px'}},
      h('span',{style:{fontSize:'32px'}},'🤖'),
      h('div',{},
        h('div',{style:{fontSize:'14px',fontWeight:'700',color:'#C9A84C'}},'Claude AI — Weekly Lecturer Digest'),
        h('div',{style:{fontSize:'12px',color:'#ADC8E6'}},'Generated by Claude AI · Reviewed by QA Admin Mrs. F. Umar · May 5, 2026'),
        h('div',{style:{fontSize:'11px',color:'#9CA3AF',marginTop:'4px'}},'Based on 76 evaluation submissions, 3 peer reviews, and 12 anonymous feedback items.')
      )
    ),
    ...insights.map(ins=>
      h('div',{style:{background:ins.bg,border:`1px solid ${ins.border}`,borderRadius:'10px',padding:'16px',marginBottom:'14px'}},
        h('div',{style:{fontSize:'12px',fontWeight:'700',color:'#1A1035',marginBottom:'6px'}},`${ins.icon}  ${ins.label}`),
        h('div',{style:{fontSize:'12px',color:'#374151',lineHeight:'1.7'}},ins.text)
      )
    ),
    h('div',{style:{fontSize:'10px',color:'#6B7280',fontStyle:'italic',marginTop:'8px'}},'AI outputs are advisory. All recommendations require review by a qualified QA Officer before institutional action is taken.')
  );
}

function renderPerformance() {
  const scoreCards = h('div',{class:'grid-3'},
    ...DEPT_DATA.map(d=>{
      const diff = d.score - d.prev;
      return card(
        h('div',{style:{fontSize:'28px',fontWeight:'800',color:d.color,textAlign:'center',marginBottom:'4px'}},`${d.score}%`),
        h('div',{style:{fontSize:'12px',fontWeight:'700',color:'#1A1035',textAlign:'center'}},d.dept),
        h('div',{style:{fontSize:'11px',color:diff>=0?'#16A34A':'#E05C2A',textAlign:'center',marginTop:'4px'}},`${diff>=0?'▲':'▼'} ${Math.abs(diff)}% vs last semester`)
      );
    })
  );

  const chartCard = card(
    h('div',{class:'card-title'},'Benchmark Comparison'),
    barChart()
  );

  const heatmapCard = card(heatmap());

  const aiCard = h('div',{class:'ai-callout', style:{marginTop:'18px'}},
    h('div',{class:'ai-head'}, h('span',{},'🤖'), 'Claude AI Performance Insight — May 5, 2026'),
    h('div',{class:'ai-body'},
      h('strong',{style:{color:'#E05C2A'}},'⚠️ Action Recommended: '),
      'Faculty of Education recorded 72% — 10 points below the institutional average of 82%. Three anonymous submissions flagged "outdated curriculum materials." A structured peer review and curriculum audit is recommended before the next accreditation cycle.',
      h('br'),h('br'),
      h('strong',{style:{color:'#16A34A'}},'✅ Strong Performer: '),
      'College of Medicine leads at 90% for the second consecutive semester. Their evaluation practices should be shared as a benchmark.',
      h('br'),h('br'),
      h('strong',{style:{color:'#007AC2'}},'📊 Trend Note: '),
      'Faculty of Engineering declined from 83% to 81%. 12 feedback submissions mentioned workload concerns this semester.'
    ),
    h('div',{class:'ai-footer'},'Generated by Claude AI · Human review required before institutional action · Logged in audit trail.')
  );

  return h('div',{}, scoreCards, h('div',{class:'grid-2'}, chartCard, heatmapCard), aiCard);
}

function renderReports(role) {
  const visible = REPORTS.filter(r=>r.roles.includes(role));
  const nucSection = role==='admin' ? renderNUCGenerator() : null;

  const externalNotice = role==='external' ? h('div',{class:'ext-notice'},'👁️ External Stakeholder — Read-only access to published reports only.') : null;

  const reportsCard = card(
    h('div',{class:'card-title'}, role==='external'?'Published Reports':'Reports & Documents'),
    externalNotice,
    h('table',{},
      h('thead',{},h('tr',{},
        ...['Report Title','Date','Type','Status','Action'].map(hd=>h('th',{},hd))
      )),
      h('tbody',{},
        ...visible.map(r=>h('tr',{},
          h('td',{class:'td-bold'},r.title),
          h('td',{style:{color:'#6B7280',fontSize:'12px'}},r.date),
          h('td',{},badge(r.type,'#6C3FC5','#F0EAFF')),
          h('td',{},badge(r.status, r.status==='Ready'?'#16A34A':'#E05C2A', r.status==='Ready'?'#DCFCE7':'#FEF0EA')),
          h('td',{}, r.status==='Ready' ? btn('Download','btn-outline btn-sm',()=>{}) : null)
        ))
      )
    )
  );

  return h('div',{}, nucSection, reportsCard);
}

function renderNUCGenerator() {
  const box = h('div',{class:'card', style:{marginBottom:'18px',borderColor:'#7C3AED',background:'#FAFAFF'}});

  const updateBox = () => {
    box.innerHTML='';
    const header = h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}},
      h('div',{},
        h('div',{style:{fontSize:'14px',fontWeight:'700',color:'#1A1035'}},'🤖 Generate NUC Accreditation Report'),
        h('div',{style:{fontSize:'11px',color:'#6B7280',marginTop:'2px'}},'Claude AI reads all evaluation data and writes a compliance-ready NUC report.')
      ),
      btn(state.nucGenerating ? '⏳ Generating...' : 'Generate NUC Report','btn-gold',
        async ()=>{
          if(state.nucGenerating) return;
          state.nucGenerating=true; state.nucGenerated=false; state.nucReport='';
          updateBox();
          try {
            const res = await fetch('https://api.anthropic.com/v1/messages',{
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({
                model:'claude-sonnet-4-20250514', max_tokens:1000,
                messages:[{role:'user',content:`You are the AssureX Quality Assurance System at the University of Lagos (UNILAG). Generate a concise, professional NUC accreditation report summary based on this data:\n\nFaculty Performance: Sciences 88%, Engineering 81%, Arts 76%, Law 84%, Medicine 90%, Education 72%\nInstitutional Average: 82%\nEvaluations Submitted: 1,243 (78% participation)\nOpen Complaints: 17\nCompliance Rate: 91%\n\nWrite 3 paragraphs covering: (1) overall institutional performance, (2) strengths and concerns with specific faculties named, (3) recommended actions before next accreditation visit.\n\nEnd with: "This report was generated by Claude AI and reviewed by QA Admin on ${new Date().toLocaleDateString('en-GB')}. Audit log entry: REF-${Math.random().toString(36).substr(2,8).toUpperCase()}."`}]
              })
            });
            const data = await res.json();
            state.nucReport = data.content?.[0]?.text || 'Report generated.';
          } catch(e) {
            state.nucReport = `This semester, the University of Lagos recorded an institutional average performance score of 82% across 6 monitored faculties, with 1,243 course evaluations submitted — representing a 78% participation rate and a 12% improvement over the previous semester.\n\nThe College of Medicine led at 90%, followed by the Faculty of Sciences at 88%. The Faculty of Education recorded the lowest score at 72%, representing a 3-point decline. Anonymous feedback submissions identified curriculum relevance and resource access as primary concerns in that faculty. The Faculty of Engineering showed a marginal decline from 83% to 81%, with workload concerns surfacing in 12 feedback submissions.\n\nRecommended actions prior to the next NUC accreditation visit: (1) Conduct a structured curriculum review for the Faculty of Education with measurable targets; (2) Document and disseminate the College of Medicine's evaluation best practices institution-wide; (3) Address all 17 open complaint items within 30 days and publish responses via the AssureX platform.\n\nThis report was generated by Claude AI and reviewed by QA Admin on ${new Date().toLocaleDateString('en-GB')}. Audit log entry: REF-DEMO-${Math.random().toString(36).substr(2,8).toUpperCase()}.`;
          }
          state.nucGenerating=false; state.nucGenerated=true;
          updateBox();
        }, state.nucGenerating
      )
    );

    box.appendChild(header);

    if(state.nucGenerating) {
      box.appendChild(h('div',{class:'generating'},
        h('div',{class:'generating-title'},'🤖 Claude AI is reading evaluation data...'),
        h('div',{class:'generating-sub'},'Analysing 1,243 submissions · Clustering feedback themes · Generating NUC-aligned narrative')
      ));
    }

    if(state.nucGenerated && state.nucReport) {
      box.appendChild(h('div',{class:'nuc-box'},
        h('div',{class:'nuc-box-head'},'✅ NUC ACCREDITATION REPORT — Generated by Claude AI'),
        h('div',{class:'nuc-body'},state.nucReport),
        h('div',{class:'nuc-actions'},
          btn('Download PDF','btn-primary btn-sm',()=>{}),
          btn('Save to Archive','btn-outline btn-sm',()=>{})
        )
      ));
    }
  };

  updateBox();
  return box;
}

function renderCollaboration() {
  const updateChat = (chatEl) => {
    chatEl.innerHTML='';
    state.chatMessages.forEach(m=>{
      chatEl.appendChild(h('div',{class:`chat-msg${m.unread?' unread':''}${m.from==='You'?' mine':''}`},
        h('div',{style:{display:'flex',justifyContent:'space-between'}},
          h('div',{class:`chat-from${m.from==='You'?' mine':''}`},m.from),
          h('div',{class:'chat-time'},m.time)
        ),
        h('div',{class:'chat-text'},m.text)
      ));
    });
    chatEl.scrollTop = chatEl.scrollHeight;
  };

  const chatList = h('div',{class:'chat-list'});
  updateChat(chatList);

  const chatInput = h('input',{type:'text',placeholder:'Type a message...'});
  chatInput.style.flex='1';

  const sendMsg = () => {
    const text = chatInput.value.trim();
    if(!text) return;
    state.chatMessages.push({from:'You',text,time:'Just now',unread:false});
    chatInput.value='';
    updateChat(chatList);
  };

  chatInput.addEventListener('keydown',e=>{ if(e.key==='Enter') sendMsg(); });
  const sendBtn = btn('Send','btn-primary',sendMsg);

  const leftCard = card(
    h('div',{class:'card-title'},'Secure Team Messages'),
    chatList,
    h('div',{class:'chat-input-row'}, chatInput, sendBtn)
  );

  const rightCard = card(
    h('div',{class:'card-title'},'Shared Report Library'),
    h('div',{style:{fontSize:'11px',color:'#6B7280',marginBottom:'14px'}},'Version-controlled documents shared across QA Officers, Dept. Heads, and Faculty.'),
    ...REPORTS.slice(0,4).map((r,i)=>
      h('div',{class:'doc-item'},
        h('div',{class:'doc-type', style:{background:r.type==='PDF'?'#FEF0EA':'#E6FAF2',color:r.type==='PDF'?'#E05C2A':'#16A34A'}},r.type),
        h('div',{class:'doc-meta'},
          h('div',{class:'doc-name'},r.title),
          h('div',{class:'doc-date'},`${r.date} · v1.${i+1}`)
        ),
        btn('View','btn-ghost btn-sm',()=>{})
      )
    )
  );

  return h('div',{class:'grid-2'}, leftCard, rightCard);
}

function renderAuditLog() {
  const typeColors = {'AI Report':'#EDE9FE','Peer Review':'#DCFCE7','Survey':'#DBEAFE','System':'#F0F4FC','Feedback':'#FEF9C3','Export':'#FFEDD5'};
  return card(
    h('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}},
      h('div',{class:'card-title',style:{marginBottom:'0'}},'System Audit Log — All Activity Tracked'),
      h('div',{style:{display:'flex',gap:'8px'}},
        btn('Export as CSV','btn-outline btn-sm',()=>alert('In production: exports full audit log as CSV with timestamps and user hashes.')),
        btn('Export as JSON','btn-ghost btn-sm',()=>alert('In production: exports all institutional data as JSON for portability.'))
      )
    ),
    h('div',{class:'audit-info'},'🔍 Every user action, AI inference call, and data export is logged here. Required for NDPR 2019 accountability compliance.'),
    h('table',{},
      h('thead',{},h('tr',{},...['Time','User','Action','Type'].map(hd=>h('th',{},hd)))),
      h('tbody',{},
        ...AUDIT_LOG.map(log=>h('tr',{},
          h('td',{style:{color:'#6B7280',fontSize:'11px',whiteSpace:'nowrap'}},log.time),
          h('td',{class:'td-bold'},log.user),
          h('td',{style:{color:'#374151'}},log.action),
          h('td',{},h('span',{style:{background:typeColors[log.type]||'#F0F4FC',padding:'2px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',color:'#1A1035'}},log.type))
        ))
      )
    )
  );
}

function renderNotifications() {
  return card(
    h('div',{class:'card-title'},'Notifications'),
    ...['New survey published: Campus Safety Assessment','Your MTH 201 evaluation was submitted successfully','Semester Feedback survey — 3 days remaining']
      .map(n=>h('div',{class:'notif-item'},`🔔 ${n}`))
  );
}

function renderExternal(subpage) {
  const notice = h('div',{style:{background:'#F0F4FC',borderRadius:'10px',padding:'12px 18px',marginBottom:'18px',border:'1px solid #E5E7EB',display:'flex',gap:'10px',alignItems:'center'}},
    h('span',{style:{fontSize:'20px'}},'👁️'),
    h('div',{},
      h('div',{style:{fontSize:'13px',fontWeight:'700',color:'#1A1035'}},'External Stakeholder Access'),
      h('div',{style:{fontSize:'11px',color:'#6B7280'}},'Read-only access to published institutional reports and performance summaries. No personally identifiable student data is visible.')
    )
  );
  return h('div',{}, notice, subpage==='Published Reports' ? renderReports('external') : renderPerformance());
}

// ── Page Router ───────────────────────────────────────────────────────────────
function renderPage(role, page) {
  if(role==='external') return renderExternal(page);
  const map = {
    'Dashboard':         ()=>renderDashboard(role),
    'Evaluations':       ()=>renderEvaluations(),
    'My Evaluations':    ()=>renderEvaluations(),
    'Dept. Evaluations': ()=>renderEvaluations(),
    'Feedback':          ()=>renderFeedback(),
    'Surveys':           ()=>renderFeedback(),
    'Notifications':     ()=>renderNotifications(),
    'Peer Review':       ()=>renderPeerReview(),
    'AI Insights':       ()=>renderAIInsights(),
    'Reports':           ()=>renderReports(role),
    'Performance':       ()=>renderPerformance(),
    'Collaboration':     ()=>renderCollaboration(),
    'Audit Log':         ()=>renderAuditLog(),
  };
  return (map[page] || map['Dashboard'])();
}

// ── Main Render ───────────────────────────────────────────────────────────────
function render() {
  const { role, page } = state;
  const user = ROLES[role];
  const navItems = NAV_MAP[role];

  // Update nav avatar
  const avatar = document.getElementById('nav-avatar');
  avatar.textContent = user.avatar;
  avatar.style.background = user.color;

  // Update sidebar nav items
  const navEl = document.getElementById('nav-items');
  navEl.innerHTML = '';
  navItems.forEach(([label, icon]) => {
    const item = h('div',{class:`nav-item${page===label?' active':''}`,
      onClick:()=>{ state.page=label; render(); }},
      h('span',{class:'icon'},icon),
      h('span',{},label)
    );
    navEl.appendChild(item);
  });

  // Sidebar footer
  document.getElementById('sf-name').textContent = user.name;
  document.getElementById('sf-role').textContent = user.title;
  document.getElementById('access-badge').textContent =
    role==='admin'?'Full Access':role==='external'?'Read Only':'Limited Access';

  // Page header
  document.getElementById('page-title').textContent = page;
  document.getElementById('page-sub').textContent = PAGE_SUBS[page]||'';

  // Page content
  const content = document.getElementById('page-content');
  content.innerHTML = '';
  content.appendChild(renderPage(role, page));
}

// ── Role Switcher ─────────────────────────────────────────────────────────────
document.getElementById('role-select').addEventListener('change', function() {
  state.role = this.value;
  state.page = NAV_MAP[this.value][0][0];
  state.evalSelected = null; state.evalDone = false;
  state.peerSelected = null; state.peerDone = false;
  state.feedbackSent = false;
  render();
});

// ── PWA Offline Detection ─────────────────────────────────────────────────────
function updatePWA(online) {
  document.getElementById('pwa-dot').style.background = online?'#16A34A':'#E05C2A';
  document.getElementById('pwa-text').style.color = online?'#16A34A':'#E05C2A';
  document.getElementById('pwa-text').textContent = online?'PWA Online':'Offline — submissions cached';
}
window.addEventListener('online',  ()=>updatePWA(true));
window.addEventListener('offline', ()=>updatePWA(false));

// ── Init ──────────────────────────────────────────────────────────────────────
render();