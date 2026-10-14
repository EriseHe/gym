/* Chinese training content. Photos: yuhonas/free-exercise-db, Unlicense.
   Real-person serratus punch video: Buidhe, Wikimedia Commons, CC BY-SA 4.0. */
window.GYM_DATA = {
  siteName: 'FORM / 健身手册',
  photoBase: './photos/',
  video: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Serratus_punch.webm',
  sourceRepo: 'https://github.com/yuhonas/free-exercise-db',
  weekdays: [
    { label:'一',long:'星期一',kind:'A',name:'肩部与上臂',type:'strength',sub:'稳定肩胛 · 练宽肩膀' },
    { label:'二',long:'星期二',kind:'M',name:'活动与恢复',type:'mobility',sub:'6–10 分钟轻练习' },
    { label:'三',long:'星期三',kind:'B',name:'下肢与核心',type:'strength',sub:'臀腿力量 · 身体稳定' },
    { label:'四',long:'星期四',kind:'M',name:'活动与恢复',type:'mobility',sub:'6–10 分钟轻练习' },
    { label:'五',long:'星期五',kind:'A',name:'肩部与上臂',type:'strength',sub:'再次练习 · 保持动作质量' },
    { label:'六',long:'星期六',kind:'W',name:'自然散步',type:'recovery',sub:'15–30 分钟 / 可选' },
    { label:'日',long:'星期日',kind:'R',name:'完整休息',type:'recovery',sub:'不安排力量训练' }
  ],
  program: {
    A: {id:'A',header:'肩胛稳定 & 肩臂增肌',short:'肩部与上臂',desc:'先练轻量肩胛控制，再完成肩部、背部和大臂训练。增肌和稳定同时进行，但不要强求肩胛外观完全对称。',segments:[
        {name:'01 · 动作准备',note:'保持低疲劳 · 不是重量挑战',ids:['punch','wallstretch']},
        {name:'02 · 主要训练',note:'轻重量起步 · 组间充分休息',ids:['row','lateral','floorpress','biceps','kickback','rotation']}
      ]},
    B: {id:'B',header:'臀腿力量 & 躯干控制',short:'下肢与核心',desc:'增强下肢承重与核心稳定性。脚部外旋的原因尚未确认，今天不要刻意将脚尖扭正。',segments:[
        {name:'01 · 动作准备',note:'上肢轻量激活',ids:['punch']},
        {name:'02 · 主要训练',note:'节奏放慢 · 不做脚部强行矫正',ids:['hinge','squat','hip','calf','deadbug']}
      ]},
    M: {id:'M',header:'恢复与肩胛觉察',short:'活动与恢复',desc:'恢复日只做两个低强度动作；如果肩部疲劳或不舒服，可以改为完全休息。',segments:[
        {name:'今日轻量动作',note:'不要练到力竭',ids:['punch','wallstretch']}
      ]}
  },
  exercises: {
    punch: {
      title:'仰卧前锯肌推拳',en:'Serratus punch',group:'肩胛控制',muscle:'前锯肌 / Scapular control',
      equipment:'徒手或 0.5–1 kg 小哑铃',sets:2,reps:'10–12 次 / 侧',seconds:35,min:4,unilateral:true,
      demo:{type:'video',src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Serratus_punch.webm',source:'https://commons.wikimedia.org/wiki/File:Serratus_punch.webm'},
      intro:'通过肩胛骨沿胸廓的滑动，练习轻柔向上伸手；不是用胳膊猛推。',
      steps:['平躺在地板，屈膝。单侧手臂基本伸直，拳头朝天花板。','手肘尽量保持原角度，用肩胛的移动让拳头再向上伸出一点点。','停留约 1 秒，再缓慢回落。左右两侧都练。'],
      cues:['肩胛自然前伸，不要夹紧背部','幅度小而稳定','放松颈部、自然呼吸'],
      pitfalls:['不要变成反复弯曲肘关节','不要使用过重哑铃','若出现明显疼痛、麻木或无力，停止'],
      note:'真人视频来自 Wikimedia Commons，由 Buidhe 拍摄，CC BY-SA 4.0。视频中的器材与起始姿势可能不同：实际按上面的仰卧轻负荷版本做。'
    },
    wallstretch: {
      title:'单臂贴墙轻柔伸展',en:'One arm against wall',group:'活动度',muscle:'肩周与躯干软组织',
      equipment:'一面墙；无需哑铃',sets:1,reps:'20 秒 / 侧 × 2',seconds:20,min:3,unilateral:true,
      photo:'One_Arm_Against_Wall',
      intro:'缓慢伸展肩周，不是通过强行向后拉肩胛去“纠正姿势”。',
      steps:['面向侧方站在墙旁，一侧手臂轻放在墙上或门框上。','保持肩膀放松，身体轻轻移动，直到肩部附近出现温和的拉伸感。','停留约 20 秒、自然呼吸，换边重复。'],
      cues:['仅拉伸至舒适程度','两侧对称进行','不憋气'],
      pitfalls:['不要强迫肩膀被动后扳','若有肩前方刺痛或神经牵拉感，立即停止'],
      note:'这项是温和活动练习，不是针对翼状肩胛的特异性康复治疗。'
    },
    row: {
      title:'俯身双哑铃划船',en:'Bent-over dumbbell row',group:'背部力量',muscle:'背阔肌 / 菱形肌 / 斜方肌',
      equipment:'两只哑铃',sets:2,reps:'10–12 次',seconds:75,min:7,photo:'Bent_Over_Two-Dumbbell_Row_With_Palms_In',
      intro:'用髋部折叠保持稳定，让肘部沿身体两侧拉起哑铃。',
      steps:['双脚与髋同宽，微屈膝，臀部向后、上身前倾，双手持哑铃自然下垂。','腹部轻度收紧，手掌相对，肘沿身侧向后拉，不耸肩。','到达控制范围后缓慢放下，整个过程中躯干尽量不晃动。'],
      cues:['上半身稳定','肘朝臀部方向移动','下降时肩胛允许自然移动'],
      pitfalls:['不要甩腰借力','不要过度夹住肩胛或把肩头向前顶','不要为了更重失去控制']
    },
    lateral: {
      title:'哑铃侧平举',en:'Side lateral raise',group:'肩部增肌',muscle:'三角肌中束 / Lateral deltoid',
      equipment:'两只轻哑铃',sets:2,reps:'12–20 次',seconds:60,min:6,photo:'Side_Lateral_Raise',
      intro:'增宽肩膀外观的重要动作：用轻重量，抬起到可控高度即可。',
      steps:['站稳，肩颈放松，双手各持一只哑铃，手臂自然垂下。','肘微屈，沿身体侧方略靠前的路径缓慢抬起。','抬到肩高以下的舒适位置，稍停后用 2–3 秒放回。'],
      cues:['注意肩部外侧发力','不耸肩','每一组的动作幅度一致'],
      pitfalls:['不要甩身体','不要强行把手腕向内倒','不要忍着肩部刺痛完成']
    },
    floorpress: {
      title:'哑铃地板卧推',en:'Dumbbell floor press',group:'推举力量',muscle:'胸肌 / 肱三头肌',
      equipment:'两只哑铃 + 地板',sets:2,reps:'8–12 次',seconds:90,min:7,photo:'Dumbbell_Floor_Press',
      intro:'利用地板限制下放幅度，练胸部和大臂后侧。',
      steps:['仰卧屈膝，双哑铃位于胸侧，掌心相对或微斜。','向上平稳推举，手腕保持稳定，肘不必完全锁死。','缓慢放到上臂轻触地面后再次推起；练完小心放下哑铃。'],
      cues:['肘部路径舒适','躯干稳定','先确保能安全把哑铃放回地面'],
      pitfalls:['不要猛砸手肘到地面','不要用过大的腰弓借力','明显肩痛时改用轻重量或暂停']
    },
    biceps: {
      title:'站姿哑铃弯举',en:'Dumbbell biceps curl',group:'上臂增肌',muscle:'肱二头肌 / 肱肌',
      equipment:'两只哑铃',sets:2,reps:'10–15 次',seconds:60,min:5,photo:'Dumbbell_Bicep_Curl',
      intro:'让上臂前侧更饱满，保持上臂不乱摆。',
      steps:['站稳，双哑铃置于身体两侧，手掌向前。','让上臂尽量贴近躯干，弯肘将哑铃平稳抬起。','用 2–3 秒下降到起点，不借腰部甩起。'],
      cues:['发力集中在上臂前侧','手腕保持中立','左右动作节奏一致'],
      pitfalls:['不要猛甩背部','不要让肘往前冲得很远']
    },
    kickback: {
      title:'俯身哑铃三头后踢',en:'Dumbbell triceps kickback',group:'上臂增肌',muscle:'肱三头肌 / Triceps',
      equipment:'两只轻哑铃',sets:2,reps:'12–15 次',seconds:60,min:5,photo:'Standing_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension',
      intro:'针对上臂后侧肌肉，用轻重量完成精确肘伸。',
      steps:['双膝微屈、从髋部前倾，双手持轻哑铃，保持背部稳定。','把上臂带到躯干两侧、肘部弯曲，再伸直肘关节把哑铃向后推出。','在手臂后侧收紧时略停，缓慢弯肘复位。'],
      cues:['上臂几乎不晃动','哑铃不需要踢得很高','颈部放松'],
      pitfalls:['不要甩腰','不要把肩膀硬抬高','动作中肩胛明显失控就降低重量']
    },
    rotation: {
      title:'侧卧肩关节外旋',en:'Side-lying external rotation',group:'肩袖稳定',muscle:'冈下肌 / 小圆肌',
      equipment:'徒手或约 0.5–1 kg 小哑铃',sets:2,reps:'10–15 次 / 侧',seconds:45,min:6,unilateral:true,photo:'External_Rotation',
      intro:'保持肘部靠近身体，缓慢旋转前臂，不靠身体翻转借力。',
      steps:['侧卧在地面，一侧手臂在上，肘弯成约 90°，肘部轻贴腰侧。','保持上臂靠近躯干，缓慢将前臂向上旋转。','在无痛舒适范围内停下，再用约 3 秒缓慢放下，换边。'],
      cues:['肩膀后侧轻度发力','身体一直侧卧','极轻重量更容易练出控制'],
      pitfalls:['不要扭腰翻身','不要让肘离身体很远','不要拿很重的哑铃'],
      note:'图库照片示范在长凳上侧卧；本计划没有长凳也可以在地板上做相同的肩关节旋转。'
    },
    hinge: {
      title:'哑铃髋铰链硬拉',en:'Dumbbell hip hinge (RDL pattern)',group:'臀腿力量',muscle:'臀大肌 / 腘绳肌',
      equipment:'两只哑铃',sets:2,reps:'8–12 次',seconds:90,min:7,photo:'Stiff-Legged_Dumbbell_Deadlift',
      intro:'把臀部向后送，而不是低头弓腰去找地面。',
      steps:['站稳，双膝轻微弯曲，哑铃置于大腿前侧或两旁。','向后送臀部、躯干从髋部折叠，哑铃靠近腿部慢慢下降。','当大腿后侧出现温和牵伸且背部稳定时停止，收缩臀部站起。'],
      cues:['臀部向后移动','上身和腿一起协调','下降深度由动作质量决定'],
      pitfalls:['不要强行膝盖完全锁死','不要弓腰求更低','不要把重量甩离身体'],
      note:'配图为直腿式哑铃硬拉；本计划采用膝轻屈、活动范围保守的髋铰链版本。'
    },
    squat: {
      title:'双哑铃深蹲',en:'Dumbbell squat',group:'臀腿力量',muscle:'股四头肌 / 臀大肌',
      equipment:'两只哑铃（也可先徒手）',sets:2,reps:'8–12 次',seconds:90,min:7,photo:'Dumbbell_Squat',
      intro:'让两腿在舒适的脚尖角度中稳定下蹲。',
      steps:['双脚摆在舒适宽度，双手持哑铃垂在身体两侧。','臀部与膝盖协同弯曲，保持全脚掌承重，缓慢下蹲。','蹲到你能保持骨盆和足部控制的位置后站起。'],
      cues:['脚跟保持着地','膝盖大体沿脚尖方向移动','整个动作平稳'],
      pitfalls:['不要强行把脚尖强行扭到正前方','不要为了深度而塌腰','若膝踝扭着痛就停下']
    },
    hip: {
      title:'扶墙站姿髋外展',en:'Standing side leg raise',group:'髋部稳定',muscle:'臀中肌 / 臀小肌',
      equipment:'徒手 + 墙面',sets:2,reps:'12–15 次 / 侧',seconds:45,min:5,unilateral:true,photo:'Side_Leg_Raises',
      intro:'训练髋外展控制；不意味着已经确定脚部外旋源于臀肌无力。',
      steps:['一只手轻扶墙，站立腿微屈，保持骨盆基本水平。','另一条腿伸直，缓慢向身体侧方抬起小幅度。','控制下降，不让身体明显向侧面歪；换侧。'],
      cues:['站立腿稳固','抬腿幅度不用很大','躯干不要摇摆'],
      pitfalls:['不要甩腿','不要强行将脚尖扭向内或向外']
    },
    calf: {
      title:'双脚提踵',en:'Standing calf raise',group:'踝部力量',muscle:'比目鱼肌 / 腓肠肌',
      equipment:'先扶墙徒手；熟练后可持哑铃',sets:2,reps:'12–20 次',seconds:45,min:4,photo:'Standing_Dumbbell_Calf_Raise',
      intro:'慢速踮脚、慢速回落，为走路及鼓踏板提供基础力量。',
      steps:['面对墙轻扶保持平衡，双脚在舒适角度站稳。','缓慢抬高脚跟，停 1 秒。','用 2–3 秒将脚跟放下，保持脚底和脚踝稳定。'],
      cues:['感觉小腿后侧发力','动作不依赖反弹','左右脚平稳承重'],
      pitfalls:['不要快速弹跳','不要脚踝滚向某一边','不要硬掰脚部自然角度'],
      note:'图库照片为手持哑铃、前脚掌踩台阶版本；家中按步骤在平地扶墙训练，不需要台阶。'
    },
    deadbug: {
      title:'死虫式（简化）',en:'Modified dead bug',group:'核心稳定',muscle:'腹部深层 / 躯干控制',
      equipment:'徒手 + 地板',sets:2,reps:'6–8 次 / 侧',seconds:45,min:5,unilateral:true,photo:'Dead_Bug',
      intro:'训练一侧腿运动时，胸廓与骨盆仍保持稳定。',
      steps:['仰卧屈膝，将双腿抬至约 90°；双臂向天花板伸直。','缓慢放下一只脚跟轻触地面，另一条腿保持稳定。','将腿收回，换侧；保持呼吸平稳，不追求超大幅度。'],
      cues:['腹部轻度稳定用力','腰部不过度拱起','换侧动作同样均匀'],
      pitfalls:['不要憋气','不要通过扭腰完成动作'],
      note:'图库展示标准死虫式的较大活动范围；本计划采用较轻松的单脚跟点地版本。'
    }
  }
};
