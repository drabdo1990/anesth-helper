import { subspecialtyEntry, type ConditionRecord } from './types';

export const SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS: ConditionRecord[] = [
  subspecialtyEntry(
    'aortic-stenosis',
    'Severe aortic stenosis (AS)',
    'Cardiac',
    ['aortic stenosis', 'calcific aortic stenosis', 'critical as'],
    {
      preop: [
        'Assess symptoms (angina, syncope, dyspnea) and review echocardiographic aortic valve area and mean gradient.',
        'Maintain hydration without precipitating overload; fixed left ventricular outflow obstruction cannot raise stroke volume.',
      ],
      intraop: [
        'Hemodynamic goals: preserve sinus rhythm (atrial kick provides up to 40% of LV filling), maintain normal-to-low heart rate (60–80 bpm), and maintain normal-to-high SVR.',
        'Treat hypotension immediately with phenylephrine to protect coronary perfusion pressure across the hypertrophied myocardium.',
        'Place external defibrillation pads and invasive arterial monitoring before induction in critical stenosis.',
      ],
      avoid: [
        'Tachycardia, which shortens diastolic filling time and precipitates subendocardial myocardial ischemia.',
        'Abrupt SVR drops (single-shot spinal anesthesia or heavy propofol boluses), which cause refractory hypotension.',
        'Loss of sinus rhythm or uncorrected hypovolemia.',
      ],
      postop: [
        'Monitor in an ICU or telemetry step-down unit with multimodal, opioid-sparing pain control to prevent postoperative tachycardia.',
        'Avoid rapid fluid boluses once sympathetic tone recovers.',
      ],
    },
  ),
  subspecialtyEntry(
    'aortic-regurgitation',
    'Aortic regurgitation (AR)',
    'Cardiac',
    ['aortic insufficiency', 'aortic regurgitation', 'ai'],
    {
      preop: [
        'Differentiate acute AR (endocarditis, aortic dissection — surgical emergency) from chronic compensated AR on echocardiography.',
        'Continue vasodilator and heart failure therapy while assessing LV dilation and systolic reserve.',
      ],
      intraop: [
        'Hemodynamic goals ("faster, fuller, forward"): keep heart rate normal-to-mildly elevated (80–90 bpm) to shorten diastole and limit regurgitant fraction.',
        'Maintain modest preload and mild afterload reduction (low-normal SVR) to favor forward aortic flow.',
        'Use arterial line and transesophageal echocardiography in moderate-to-severe ventricular dysfunction.',
      ],
      avoid: [
        'Bradycardia, which prolongs diastole and increases regurgitant volume overload.',
        'Acute SVR surges (light anesthesia, pain, pure vasoconstrictors) that drive backward regurgitation into the left ventricle.',
      ],
      postop: [
        'Monitor for pulmonary edema during emergence and prevent emergence hypertension with smooth analgesia.',
        'Manage acute decompensated AR post-repair with inodilators if LV ejection fraction drops.',
      ],
    },
  ),
  subspecialtyEntry(
    'mitral-stenosis',
    'Mitral stenosis (MS)',
    'Cardiac',
    ['mitral stenosis', 'rheumatic mitral stenosis'],
    {
      preop: [
        'Assess mitral valve area, transmitral gradient, pulmonary artery pressures, atrial fibrillation, and anticoagulation bridging status.',
        'Continue rate-controlling medications (beta-blockers, digoxin) up to the morning of surgery.',
      ],
      intraop: [
        'Hemodynamic goals: keep heart rate slow-to-normal (60–75 bpm) to preserve diastolic filling across the stenotic mitral orifice, and preserve sinus rhythm when present.',
        'Maintain preload carefully without over-distending the left atrium and avoid factors elevating PVR (maintain normocarbia, normothermia, and high oxygenation).',
        'Treat hypotension primarily with phenylephrine rather than ephedrine (which provokes tachycardia).',
      ],
      avoid: [
        'Tachycardia or fast atrial fibrillation, which slashes LV filling and precipitates flash pulmonary edema.',
        'Hypoxia, hypercarbia, acidosis, and nitrous oxide, which spike pulmonary vascular resistance and strain the right ventricle.',
      ],
      postop: [
        'Monitor closely in telemetry/ICU for acute atrial fibrillation, pulmonary edema, and right ventricular decompensation.',
        'Provide smooth analgesia avoiding pain-induced tachycardia and hypoventilation.',
      ],
    },
  ),
  subspecialtyEntry(
    'mitral-regurgitation',
    'Mitral regurgitation (MR)',
    'Cardiac',
    ['mitral regurgitation', 'mitral insufficiency'],
    {
      preop: [
        'Identify etiology (ischemic papillary dysfunction vs myxomatous prolapse), LV ejection fraction, and pulmonary hypertension severity.',
        'Optimize baseline vasodilator therapy and note that LVEF can overestimate true systolic function due to low-impedance backward ejection into the left atrium.',
      ],
      intraop: [
        'Hemodynamic goals ("faster, fuller, forward"): maintain high-normal heart rate (80–90 bpm), slightly lowered SVR to promote forward systemic output, and adequate preload.',
        'Preserve myocardial contractility and avoid PVR spikes (normocarbia, adequate oxygenation, normothermia).',
      ],
      avoid: [
        'Bradycardia, which increases LV end-diastolic volume, dilates the mitral annulus, and worsens regurgitant fraction.',
        'Sudden SVR elevation (sympathetic surge, high-dose phenylephrine) or hypercarbia.',
      ],
      postop: [
        'Control emergence pain and blood pressure tightly to prevent acute increases in afterload and pulmonary venous congestion.',
        'Monitor respiratory status and consider telemetry in severe MR.',
      ],
    },
  ),
  subspecialtyEntry(
    'hocm',
    'Hypertrophic obstructive cardiomyopathy (HOCM)',
    'Cardiac',
    ['hypertrophic obstructive cardiomyopathy', 'hocm', 'ihss', 'ash'],
    {
      preop: [
        'Evaluate dynamic left ventricular outflow tract (LVOT) gradient, systolic anterior motion (SAM) of the mitral valve, syncope history, and ICD presence.',
        'Continue baseline beta-blockers or verapamil through the morning of surgery and avoid prolonged dehydrating fasts.',
      ],
      intraop: [
        'Hemodynamic goals: maintain expanded intravascular preload, keep heart rate slow, preserve/augment SVR, and allow mild anesthetic myocardial depression to minimize dynamic LVOT obstruction.',
        'Treat hypotension aggressively with IV crystalloid boluses and pure alpha-1 agonist (phenylephrine) rather than beta-agonists.',
        'Maintain sinus rhythm to preserve stiff LV filling.',
      ],
      avoid: [
        'Beta-adrenergic inotropes and chronotropes (epinephrine, norepinephrine, dopamine, dobutamine, isoproterenol, ephedrine) that worsen dynamic outflow obstruction.',
        'Hypovolemia, vasodilators, and spinal sympathectomy causing decreased preload and afterload.',
        'Tachycardia and loss of atrial kick.',
      ],
      postop: [
        'Maintain telemetry monitoring and reactivate ICD if disabled for electrocautery.',
        'Prevent postoperative pain, hypovolemia, and emergence tachycardia.',
      ],
    },
  ),
  subspecialtyEntry(
    'cardiac-tamponade',
    'Cardiac tamponade & pericardial effusion',
    'Cardiac',
    ['cardiac tamponade', 'pericardial tamponade', 'pericardial effusion'],
    {
      preop: [
        'Recognize Beck triad (hypotension, jugular venous distension, muffled heart sounds), pulsus paradoxus, electrical alternans, and echocardiographic RV/RA diastolic collapse.',
        'Consider awake percutaneous pericardiocentesis under local anesthesia prior to general anesthesia when hemodynamics are unstable.',
      ],
      intraop: [
        'Hemodynamic goals ("full, fast, tight"): maintain high preload, elevated heart rate (do not slow compensatory tachycardia), contractility, and SVR.',
        'Prep and drape the patient awake before induction; induce cautiously (e.g., ketamine/etomidate) maintaining spontaneous ventilation until surgical pericardial decompression.',
        'Have resuscitation drugs, wide-bore IV access, and invasive arterial monitoring ready before induction.',
      ],
      avoid: [
        'High positive-pressure ventilation and PEEP before pericardial drainage, which abolish venous return and trigger cardiac arrest.',
        'Myocardial depressants, vasodilators, and beta-blockers that eliminate compensatory sympathetic tone.',
      ],
      postop: [
        'Watch carefully for acute post-decompression hypertensive rebound or paradoxical pulmonary edema.',
        'Monitor chest/pericardial drain output and ECG telemetry in ICU.',
      ],
    },
  ),
  subspecialtyEntry(
    'cied-pacemaker-icd',
    'Pacemakers & implantable defibrillators (CIED)',
    'Cardiac',
    ['pacemaker', 'icd', 'defibrillator', 'cied', 'biventricular pacemaker'],
    {
      preop: [
        'Identify device type, manufacturer, indication, pacemaker dependency, magnet behavior, and last interrogation (within 6 months for ICDs, 12 months for pacemakers).',
        'Reprogram pacing mode to asynchronous (VOO/DOO) in pacemaker-dependent patients or deactivate ICD antitachycardia therapies before monopolar electrosurgery above the umbilicus.',
      ],
      intraop: [
        'Place transcutaneous pacing/defibrillation pads (anteroposterior) away from the pulse generator whenever ICD therapy is disabled.',
        'Use bipolar electrocautery where possible; if monopolar is required, place the return pad so current path never crosses the CIED generator or leads, using short bursts.',
        'Monitor mechanical pulse continuously via arterial line or SpO2 plethysmography in case electromagnetic interference alters ECG display.',
      ],
      avoid: [
        'Succinylcholine fasciculations causing myopotential oversensing and inappropriate pacing inhibition in un-reprogrammed unipolar pacemakers.',
        'Monopolar electrosurgery directly over the generator or blind magnet application without verifying device-specific magnet programming.',
      ],
      postop: [
        'Keep external defibrillation pads applied and telemetry continuous until the CIED is formally re-interrogated and restored to baseline settings.',
        'Obtain formal device interrogation if emergency shocks or high-energy cautery near the generator occurred.',
      ],
    },
  ),
  subspecialtyEntry(
    'aortic-aneurysm',
    'Abdominal & thoracic aortic aneurysm (AAA / TAA)',
    'Vascular',
    ['aaa', 'taa', 'abdominal aortic aneurysm', 'thoracic aortic aneurysm'],
    {
      preop: [
        'Evaluate coronary disease, renal baseline, and aneurysm anatomy (infrarenal vs suprarenal vs thoracoabdominal; open vs EVAR/TEVAR).',
        'Ensure massive transfusion access, invasive arterial line (right radial if left subclavian clamped), central venous access, and lumbar CSF drain plan for high-risk TAA repair.',
      ],
      intraop: [
        'Anticipate severe afterload rise at aortic cross-clamp (prepare titrated vasodilator/volatile) followed by severe declamping hypotension upon clamp release.',
        'Prior to unclamping: optimize preload, reduce vasodilators, verify acid-base balance, and communicate closely for slow staged clamp release.',
        'For TAA repair: maintain MAP and low lumbar CSF pressure (typically <= 10 mmHg) to preserve spinal cord perfusion pressure.',
      ],
      avoid: [
        'Sudden hypovolemic unclamping ("declamping shock") or inadequate preload at reperfusion.',
        'Hyperthermia and spinal cord hypotension (causes ischemic paraplegia).',
      ],
      postop: [
        'Admit to ICU for close monitoring of hourly urine output, renal function, lower-extremity neurologic motor exams, and bowel perfusion.',
        'Maintain strict postoperative blood pressure control to protect aortic suture lines.',
      ],
    },
  ),
  subspecialtyEntry(
    'aortic-dissection',
    'Acute aortic dissection',
    'Vascular',
    ['aortic dissection', 'type a dissection', 'type b dissection'],
    {
      preop: [
        'Determine Stanford Type A (ascending — emergent cardiac surgery) vs Type B; check unequal limb blood pressures, aortic regurgitation, tamponade, and coronary/carotid malperfusion.',
        'Establish arterial line monitoring in the extremity with the highest reliable blood pressure.',
      ],
      intraop: [
        'Initiate strict anti-impulse therapy immediately: administer an IV beta-blocker (esmolol or labetalol) FIRST to reduce heart rate (< 60 bpm) and ventricular ejection velocity (dP/dt).',
        'Add an IV arterial vasodilator (nicardipine or clevidipine) AFTER beta-blockade if systolic pressure remains above target (100–120 mmHg).',
        'Maintain smooth deep induction preventing laryngoscopy shear spikes and verify coronary/valve integrity via TEE.',
      ],
      avoid: [
        'Administering vasodilators (nitroprusside, nicardipine, hydralazine) BEFORE beta-blockade, which triggers reflex tachycardia and propagates false-lumen tearing.',
        'Hypertensive surges during intubation or surgical stimulation.',
      ],
      postop: [
        'Maintain continuous ICU arterial monitoring and uninterrupted IV anti-impulse heart rate and blood pressure control.',
        'Monitor serially for acute kidney injury, stroke, paraplegia, and mesenteric ischemia.',
      ],
    },
  ),
  subspecialtyEntry(
    'carotid-endarterectomy',
    'Carotid artery stenosis & endarterectomy (CEA)',
    'Vascular',
    ['cea', 'carotid endarterectomy', 'carotid stenosis'],
    {
      preop: [
        'Document baseline focal neurologic deficits, TIA/stroke history, contralateral carotid patency, and severe coronary comorbidities.',
        'Continue aspirin, statins, and baseline beta-blockers through the morning of surgery.',
      ],
      intraop: [
        'Establish invasive arterial monitoring before induction under either cervical plexus block (awake neuro assessment) or general anesthesia with EEG/NIRS/stump pressure monitoring.',
        'Maintain arterial pressure at or up to 20% above baseline during carotid cross-clamping to preserve collateral cerebral perfusion.',
        'Maintain strict normocarbia (ETCO2 35–40 mmHg): avoid both hypercapnia (intracerebral steal) and hypocapnia (cerebral vasoconstriction).',
      ],
      avoid: [
        'Intraoperative hypotension during carotid cross-clamping.',
        'Routine aggressive hyperventilation or unrecognized carotid sinus baroreceptor reflex bradycardia during dissection.',
      ],
      postop: [
        'Perform immediate neurologic exam upon emergence and inspect neck dressing closely for expanding hematoma or stridor.',
        'Control severe postoperative hypertension promptly to prevent cerebral hyperperfusion syndrome, seizures, and hemorrhagic stroke.',
      ],
    },
  ),
  subspecialtyEntry(
    'pulmonary-hypertension',
    'Pulmonary hypertension & right heart failure',
    'Respiratory & Thoracics',
    ['pulmonary hypertension', 'pah', 'phtn', 'right heart failure'],
    {
      preop: [
        'Assess WHO group, right ventricular function, PA pressures on echocardiogram/RHC, and functional class; high perioperative morbidity warrants multidisciplinary planning.',
        'Strictly continue home pulmonary vasodilators (PDE5 inhibitors, endothelin receptor antagonists, prostacyclin infusions) without interruption.',
      ],
      intraop: [
        'Prevent acute PVR elevation: maintain high inspired oxygen, mild hypocarbia/normocarbia, normothermia, normal pH, and low mean airway pressures.',
        'Preserve right coronary perfusion pressure by maintaining systemic arterial pressure above pulmonary artery pressure (vasopressin raises SVR without raising PVR; norepinephrine/milrinone support RV output).',
        'Have inhaled pulmonary vasodilators (inhaled nitric oxide or epoprostenol) available for acute RV crisis.',
      ],
      avoid: [
        'Hypoxia, hypercarbia, metabolic/respiratory acidosis, hypothermia, and light anesthesia pain surges.',
        'Nitrous oxide and excessive PEEP, which increase pulmonary vascular resistance and precipitate acute cor pulmonale.',
      ],
      postop: [
        'Admit to ICU with continuous invasive monitoring, supplemental oxygen, and multimodal opioid-sparing analgesia preventing hypoventilation.',
        'Avoid abrupt withdrawal of inhaled pulmonary vasodilators (rebound pulmonary hypertension).',
      ],
    },
  ),
  subspecialtyEntry(
    'ludwig-angina',
    'Ludwig angina & deep neck infection',
    'Airway',
    ['ludwig angina', 'submandibular abscess', 'deep neck infection'],
    {
      preop: [
        'Rapidly progressive bilateral submandibular/sublingual cellulitis pushing the tongue posteriorly and superiorly; inspect for trismus, drooling, stridor, and tripod posture.',
        'Notify ENT surgery immediately and prepare a double setup with flexible fiberoptic intubation and surgical cricothyrotomy/tracheostomy.',
      ],
      intraop: [
        'Secure the airway awake (awake fiberoptic nasal or oral intubation under topical anesthesia) while preserving spontaneous ventilation.',
        'Maintain upright or ramped positioning during airway topicalization and instrumentation.',
      ],
      avoid: [
        'IV induction or neuromuscular blockers (succinylcholine/rocuronium) prior to definitive airway control, which causes complete loss of pharyngeal tone and cannot-intubate/cannot-ventilate catastrophe.',
        'Heavy preoperative sedatives, supine positioning, or repeated traumatic direct laryngoscopy.',
      ],
      postop: [
        'Leave the patient intubated in ICU until surgical drainage reduces floor-of-mouth edema and a cuff-leak test confirms patency.',
        'Continue broad-spectrum IV antibiotics and head elevation.',
      ],
    },
  ),
  subspecialtyEntry(
    'epiglottitis',
    'Acute epiglottitis / supraglottitis',
    'Airway',
    ['epiglottitis', 'supraglottitis'],
    {
      preop: [
        'Recognize classic dysphagia, drooling, muffled voice, stridor, high fever, and tripod posture (most often Hib/bacterial or viral in adults/unvaccinated children).',
        'Keep the patient calm in a comfortable upright position with parent presence in pediatrics and ENT surgeon scrubbed at bedside.',
      ],
      intraop: [
        'Pediatric patients: proceed directly to OR for calm inhalational sevoflurane induction in oxygen keeping spontaneous breathing, no IV until asleep.',
        'Adults: consider awake fiberoptic intubation vs inhalational induction; use an ETT 0.5–1.0 mm smaller than usual with rigid bronchoscopy and surgical airway ready.',
      ],
      avoid: [
        'Agitating the child (phlebotomy, tongue blade oral exam, or supine forcing) which can trigger immediate complete laryngospasm and arrest.',
        'Neuromuscular blocking agents prior to visualizing and securing the edematous supraglottic inlet.',
      ],
      postop: [
        'Keep intubated in ICU on humidified oxygen, IV antibiotics, and sedation until direct inspection or cuff leak confirms resolution of edema (24–48 h).',
      ],
    },
  ),
  subspecialtyEntry(
    'post-thyroidectomy-hematoma',
    'Post-thyroidectomy neck hematoma',
    'Airway',
    ['neck hematoma', 'post-thyroidectomy hematoma', 'thyroid hematoma'],
    {
      preop: [
        'Monitor every post-thyroid/parathyroid patient closely in PACU for neck tightness, fullness, voice change, agitation, and late stridor.',
        'Maintain suture/staple removal kit and difficult airway cart immediately at the bedside.',
      ],
      intraop: [
        'If acute airway compromise or stridor develops, IMMEDIATELY open all skin and platysmal sutures/staples at the bedside to evacuate the clot and decompress the trachea BEFORE attempting induction.',
        'Deliver 100% oxygen, call surgical team immediately, and secure airway via awake fiberoptic or video laryngoscopy with surgical airway backup once decompressed.',
      ],
      avoid: [
        'Delaying wound decompression while transferring to the operating room or waiting for imaging.',
        'Inducing general anesthesia and paralysis prior to releasing compressed neck hematoma (venous/lymphatic laryngeal edema makes intubation nearly impossible).',
      ],
      postop: [
        'Return to OR for surgical hemostasis and consider keeping intubated in ICU if significant supraglottic edema remains.',
        'Monitor serum ionized calcium and vocal cord mobility post-reexploration.',
      ],
    },
  ),
  subspecialtyEntry(
    'copd-bullous-emphysema',
    'COPD & bullous emphysema',
    'Respiratory & Thoracics',
    ['copd', 'emphysema', 'chronic bronchitis', 'bullae'],
    {
      preop: [
        'Assess baseline exercise tolerance, FEV1, baseline PaCO2 (CO2 retainers), cor pulmonale, smoking cessation, and active infection.',
        'Continue inhaled bronchodilators and steroids through the morning of surgery.',
      ],
      intraop: [
        'Use neuraxial or regional techniques when suitable to avoid instrumentation, though keep high sensory block below intercostal fatigue levels.',
        'Ventilate with moderate tidal volumes and prolonged expiratory time (low respiratory rate, longer I:E ratio) to prevent air trapping, auto-PEEP, and hypotension.',
        'Closely watch for barotrauma or sudden hemodynamic collapse from ruptured emphysematous bullae.',
      ],
      avoid: [
        'Nitrous oxide (N2O) in bullous emphysema, as rapid diffusion into closed bullae causes expansion and tension pneumothorax.',
        'Rapid respiratory rates causing incomplete exhalation (breath stacking) and severe intrinsic PEEP.',
      ],
      postop: [
        'Target baseline oxygen saturation rather than excessive hyperoxia to avoid worsening V/Q mismatch and hypercapnia.',
        'Provide early non-invasive ventilation (BiPAP/CPAP if not contraindicated), aggressive chest physiotherapy, and opioid-sparing analgesia.',
      ],
    },
  ),
  subspecialtyEntry(
    'bronchial-asthma',
    'Bronchial asthma',
    'Respiratory & Thoracics',
    ['asthma', 'reactive airway disease'],
    {
      preop: [
        'Evaluate attack frequency, oral steroid dependence, prior ICU intubations, and recent triggers; defer elective surgery during active exacerbation or URI.',
        'Administer inhaled short-acting beta-2 agonist shortly before induction and continue maintenance inhaled corticosteroids.',
      ],
      intraop: [
        'Induce smoothly with propofol or ketamine (bronchodilator) and achieve deep anesthetic plane with sevoflurane/isoflurane before laryngoscopy or ETT placement.',
        'Use LMA or regional anesthesia when appropriate to minimize tracheal stimulation; treat acute bronchospasm with 100% O2, deeper anesthesia, and inhaled/IV bronchodilators.',
      ],
      avoid: [
        'Rapidly stepping up pungent desflurane, which provokes airway irritation and severe bronchospasm.',
        'Histamine-releasing drugs (atracurium, mivacurium, morphine) and non-selective beta-blockers (propranolol).',
        'Light anesthesia during intubation or extubation (consider deep extubation or IV lidocaine when safe).',
      ],
      postop: [
        'Continue scheduled inhaled beta-agonists and monitor oxygenation and expiratory effort in PACU.',
        'Avoid NSAIDs/aspirin in patients with aspirin-exacerbated respiratory disease (Samter triad).',
      ],
    },
  ),
  subspecialtyEntry(
    'thoracic-olv',
    'One-lung ventilation (OLV) & thoracic surgery',
    'Respiratory & Thoracics',
    ['one lung ventilation', 'olv', 'double lumen tube', 'thoracotomy'],
    {
      preop: [
        'Evaluate predicted postoperative FEV1, DLCO, VO2 max, cardiac risk, and review chest CT to plan left- vs right-sided DLT or bronchial blocker.',
        'Place thoracic epidural or paravertebral catheter pre-induction for thoracotomy analgesia.',
      ],
      intraop: [
        'Confirm DLT or bronchial blocker placement via flexible fiberoptic bronchoscopy immediately after intubation AND again after lateral decubitus positioning.',
        'Ventilate dependent lung protectively (low PBW tidal volume, PEEP, low plateau pressures) and restrict excessive crystalloid administration.',
        'Treat OLV hypoxemia systematically: verify FiO2 1.0, check DLT position with bronchoscope, recruit dependent lung + adjust PEEP, and apply CPAP (or intermittent two-lung ventilation) to the non-dependent lung.',
      ],
      avoid: [
        'Excessive positive fluid balance in pneumonectomy/lobectomy patients (triggers post-pneumonectomy pulmonary edema).',
        'High plateau pressures or assuming DLT position remained intact after turning the patient lateral.',
      ],
      postop: [
        'Extubate early in the OR to eliminate positive-pressure stress on bronchial stumps and maintain thoracic regional analgesia.',
        'Obtain post-op chest radiograph in PACU and monitor chest tube air leaks and arrhythmias (post-thoracotomy AF).',
      ],
    },
  ),
  subspecialtyEntry(
    'septic-shock',
    'Sepsis & septic shock',
    'Critical Care',
    ['sepsis', 'septic shock', 'bacteremia'],
    {
      preop: [
        'Do not delay urgent surgical source control (abscess, necrotizing soft tissue, ischemic bowel); verify blood cultures, broad-spectrum antibiotics, lactate, and fluid status.',
        'Establish large-bore IV access, invasive arterial line, and central venous access with vasopressor infusion ready prior to induction.',
      ],
      intraop: [
        'Titrate hemodynamically stable induction agents cautiously (ketamine, low-dose etomidate/opioid); anticipate loss of endogenous catecholamines upon induction.',
        'Start norepinephrine first-line to maintain MAP >= 65 mmHg, add vasopressin or stress-dose hydrocortisone for refractory shock, and guide fluids dynamically rather than blindly.',
        'Apply ARDS-protective ventilation (low PBW tidal volumes, PEEP, plateau < 30 cmH2O) and actively warm the patient.',
      ],
      avoid: [
        'Full-dose propofol induction boluses in vasodilated hypotensive patients.',
        'Massive blind crystalloid overloading without dynamic preload responsiveness (worsens pulmonary and bowel edema).',
      ],
      postop: [
        'Transfer intubated to ICU for ongoing source-control resuscitation, serial lactate clearance, and organ support.',
        'Monitor closely for acute kidney injury, DIC, and ICU delirium.',
      ],
    },
  ),
  subspecialtyEntry(
    'brain-death-donor',
    'Brain death & organ donor management',
    'Critical Care',
    ['organ donor', 'brain death', 'rule of 100s'],
    {
      preop: [
        'Confirm formal brain death declaration, family/organ procurement consent, blood type crossmatch, and ongoing vasopressor/endocrine drips.',
        'Anticipate severe autonomic storm during herniation followed by loss of sympathetic tone, neurogenic diabetes insipidus, and hypothermia.',
      ],
      intraop: [
        'Apply the "Rule of 100s" physiological targets: systolic BP around 100 mmHg, urine output >= 100 mL/h, PaO2 >= 100 mmHg, hemoglobin ~100 g/L (10 g/dL), and normoglycemia.',
        'Treat spinal-reflex somatic movements and autonomic hypertension/tachycardia during surgical incision using neuromuscular blockers plus volatile anesthetics or opioids.',
        'Treat diabetes insipidus (hypernatremia + polyuria) with vasopressin infusion or desmopressin plus electrolyte replacement, and maintain active warming.',
      ],
      avoid: [
        'Uncorrected hypothermia, severe hypernatremia (> 150–155 mEq/L harms liver grafts), or severe hypovolemia risking graft ischemia.',
        'Assuming brain death prevents painful spinal autonomic hypertensive surges during surgical procurement.',
      ],
      postop: [
        'Coordinate cross-clamp timing and heparin administration directly with surgical procurement teams.',
        'Document exact hemodynamic, fluid, and preservation drug timings cleanly for recipient transplant records.',
      ],
    },
  ),
];
