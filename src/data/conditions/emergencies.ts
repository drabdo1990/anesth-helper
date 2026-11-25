import { emergencyEntry, type ConditionRecord } from './types';

export const EMERGENCY_CONDITIONS: ConditionRecord[] = [
  emergencyEntry(
    'airway-fire',
    'Airway fire',
    ['or fire', 'endotracheal fire', 'laser airway fire'],
    {
      preop: [
        'Identify high-risk procedures within the fire triangle zone (head, neck, and laser airway surgery).',
        'Use laser-resistant tubes when indicated, minimize inspired oxygen concentration, and avoid nitrous oxide.',
        'Allow alcohol-based skin preparations to dry completely and exclude pooled vapors before draping.',
      ],
      intraop: [
        'Recognize flames, smoke, foul odor, or sudden loss of circuit pressure and immediately shout "Airway fire!".',
        'Simultaneously remove the burning tracheal tube and halt fresh gas flow by disconnecting the breathing circuit.',
        'Flood the surgical field with sterile saline and extinguish any burning debris in water.',
        'Re-establish mask ventilation with air or minimal oxygen once the fire is out and assess the airway.',
      ],
      avoid: [
        'Avoid ventilating with high inspired oxygen or nitrous oxide while fire or smoldering debris remains.',
        'Do not attempt blind reintubation prior to direct visual inspection of the laryngeal lumen.',
      ],
      postop: [
        'Perform urgent rigid/flexible bronchoscopy to assess tracheobronchial mucosal burn injury and clear debris.',
        'Admit the patient intubated to the intensive care unit to monitor and manage progressive airway edema.',
      ],
    },
  ),
  emergencyEntry(
    'anaphylaxis',
    'Perioperative anaphylaxis',
    ['anaphylactic shock', 'allergic reaction'],
    {
      preop: [
        'Screen for previous adverse drug reactions, multiple surgical exposures, and latex allergy in high-risk groups.',
        'Verify immediate availability of resuscitation drugs, 100% oxygen, and difficult-airway equipment.',
      ],
      intraop: [
        'Detect sudden cardiovascular collapse, refractory hypotension, tachycardia, or acute bronchospasm with high airway pressures.',
        'Immediately discontinue all suspected triggers (antibiotics, NMBDs, colloids, chlorhexidine, blood products).',
        'Administer 100% oxygen, rapidly expand intravascular volume with crystalloids, and titrate IV epinephrine early.',
        'Elevate the legs if hypotensive and start CPR promptly for severe systolic collapse or cardiac arrest.',
      ],
      avoid: [
        'Avoid relying solely on fluid boluses or pure alpha-1 vasoconstrictors without administering epinephrine early.',
        'Do not continue infusing colloids, blood products, or antibiotics initiated shortly before hemodynamic collapse.',
      ],
      postop: [
        'Obtain serial serum tryptase samples immediately, at 1 to 2 hours, and at 24 hours post-event.',
        'Monitor in the intensive care unit for biphasic reactions and arrange formal outpatient allergy testing.',
      ],
    },
    { checklistId: 'crisis-anaphylaxis' },
  ),
  emergencyEntry(
    'aspiration-event',
    'Pulmonary aspiration of gastric contents',
    ['aspiration', 'mendelson syndrome', 'gastric aspiration'],
    {
      preop: [
        'Identify full-stomach or delayed gastric emptying risk (trauma, pregnancy, bowel obstruction, GLP-1 therapy, emergency cases).',
        'Enforce fasting intervals when elective and prepare rapid sequence induction with a cuffed tracheal tube.',
      ],
      intraop: [
        'Recognize gastric contents in the pharynx, sudden hypoxemia, wheezing, or acute loss of lung compliance.',
        'Immediately place the patient in Trendelenburg and lateral position if feasible, suction the oropharynx, and secure the airway.',
        'Ventilate with 100% oxygen and positive end-expiratory pressure; suction the trachea prior to positive-pressure breaths when possible.',
      ],
      avoid: [
        'Avoid routine large-volume bronchial lavage or alkaline washes that drive aspirated acid deeper into distal alveoli.',
        'Avoid empirical prophylactic antibiotics or high-dose corticosteroids unless bacterial superinfection is later proven.',
      ],
      postop: [
        'Obtain a chest radiograph to inspect for dependent infiltrates (classically right lower lobe).',
        'Monitor the patient in a high-dependency or ICU setting for 12 to 24 hours for chemical pneumonitis or ARDS.',
      ],
    },
  ),
  emergencyEntry(
    'bronchospasm',
    'Acute intraoperative bronchospasm',
    ['bronchospasm', 'status asthmaticus'],
    {
      preop: [
        'Screen for hyperreactive airways, active asthma, COPD, smoking, or recent viral upper respiratory tract infection.',
        'Optimize baseline bronchodilator therapy before surgery and defer purely elective cases during acute exacerbations.',
      ],
      intraop: [
        'Recognize rising peak inspiratory pressures, an upsloping shark-fin capnograph, and expiratory wheezing or silent chest.',
        'Switch to 100% oxygen, halt airway/surgical stimulation, and deepen anesthesia using non-pungent volatile or IV agents.',
        'Rule out mechanical mimics (kinked ETT, endobronchial intubation, secretions, tension pneumothorax) and deliver inhaled or IV bronchodilators.',
      ],
      avoid: [
        'Avoid rapidly escalating pungent volatile agents such as desflurane during reactive airway constriction.',
        'Avoid histamine-releasing neuromuscular blockers and high ventilator respiratory rates that worsen auto-PEEP.',
      ],
      postop: [
        'Confirm complete normalization of expiratory flow and gas exchange prior to deep or awake extubation.',
        'Recover the patient with continuous pulse oximetry and humidified supplemental oxygen.',
      ],
    },
    { checklistId: 'crisis-bronchospasm' },
  ),
  emergencyEntry(
    'compartment-syndrome',
    'Extremity & abdominal compartment syndrome',
    ['compartment syndrome', 'well leg syndrome'],
    {
      preop: [
        'Identify high-risk injuries (tibial/forearm fractures) and prolonged surgical positioning such as steep lithotomy.',
        'Ensure meticulous padding and avoid tight circumferential wraps around high-risk extremities.',
      ],
      intraop: [
        'Suspect acute compromise when observing tense woody limb swelling, severe out-of-proportion pain, or pain on passive stretch.',
        'Immediately remove all constrictive dressings, splints, or casts and notify the surgical team.',
        'Position the affected extremity strictly at heart level and maintain adequate systemic arterial perfusion pressure.',
      ],
      avoid: [
        'Avoid elevating the affected limb above heart level, which further lowers local arteriovenous perfusion gradient.',
        'Avoid relying on palpable distal pulses to rule out compartment syndrome, as pulses persist until irreversible ischemia.',
      ],
      postop: [
        'Measure intracompartmental pressures promptly if clinical exam is equivocal or in sedated patients.',
        'Coordinate emergent orthopedic or vascular surgical fasciotomy without delay to prevent myonecrosis and rhabdomyolysis.',
      ],
    },
  ),
  emergencyEntry(
    'delayed-emergence',
    'Delayed emergence from general anesthesia',
    ['delayed awakening', 'prolonged emergence'],
    {
      preop: [
        'Screen for baseline hepatic or renal impairment, cognitive decline, hypothermia risk, and chronic sedative use.',
        'Select short-acting agents and titrate anesthesia using processed EEG and quantitative neuromuscular monitoring.',
      ],
      intraop: [
        'Confirm volatile agent clearance and verify adequate minute ventilation to exclude severe hypercapnia or hypoxemia.',
        'Assess train-of-four neuromuscular recovery, core temperature, and point-of-care blood glucose immediately.',
        'Check pupillary symmetry and consider targeted reversal (naloxone or flumazenil) only after airway and metabolic checks.',
      ],
      avoid: [
        'Avoid administering broad pharmacologic antagonists blindly without ruling out residual neuromuscular blockade.',
        'Do not extubate or discharge an unresponsive patient to recovery without excluding hypothermia or hypercapnia.',
      ],
      postop: [
        'Obtain an emergent non-contrast head CT and neurology consult if pharmacologic and metabolic causes are excluded.',
        'Admit the patient to the intensive care unit for ongoing airway protection and serial neurologic exams.',
      ],
    },
  ),
  emergencyEntry(
    'dental-injury',
    'Perioperative dental injury',
    ['tooth avulsion', 'broken tooth', 'dental trauma'],
    {
      preop: [
        'Inspect dentition carefully before induction and document loose teeth, crowns, veneers, bridges, or partial dentures.',
        'Counsel high-risk patients on dental injury risk and plan gentle laryngoscopy or non-laryngoscopic airway techniques when feasible.',
      ],
      intraop: [
        'Inspect the oral cavity immediately if dental fracture or avulsion is noted during intubation or airway removal.',
        'Locate and retrieve every missing tooth fragment to prevent tracheobronchial aspiration or esophageal ingestion.',
        'Store an avulsed permanent tooth by the crown in normal saline or cold milk and avoid scrubbing the root.',
      ],
      avoid: [
        'Avoid blind oropharyngeal suctioning that can dislodge loose teeth further down the airway.',
        'Never reimplant an avulsed primary (deciduous) tooth in pediatric patients or store a permanent tooth dry.',
      ],
      postop: [
        'Obtain a chest or neck radiograph immediately if any tooth fragment remains unaccounted for.',
        'Inform the patient honestly upon full emergence, document thoroughly, and arrange urgent dental consultation.',
      ],
    },
  ),
  emergencyEntry(
    'extravasation-injury',
    'IV extravasation injury',
    ['extravasation', 'vasopressor extravasation', 'infiltration'],
    {
      preop: [
        'Verify central venous access or reliable large-bore proximal peripheral catheters before infusing vesicants or concentrated vasopressors.',
        'Ensure peripheral infusion sites remain visible or accessible for periodic inspection during prolonged procedures.',
      ],
      intraop: [
        'Suspect extravasation upon unexplained loss of drug effect, swelling, blanching, coolness, or rising pump occlusion pressure.',
        'Stop the infusion immediately while leaving the cannula briefly in place to gently aspirate residual drug from the tissue pocket.',
        'Remove the catheter, mark the border of induration, elevate the limb, and administer specific local antidote (e.g., subcutaneous phentolamine for catecholamines).',
      ],
      avoid: [
        'Avoid flushing the infiltrated catheter with saline, which forces concentrated vesicant deeper into surrounding tissue.',
        'Avoid running concentrated norepinephrine or calcium chloride continuously through distal hand or foot veins.',
      ],
      postop: [
        'Apply appropriate thermal therapy (warm compresses for vasopressors; cold for most non-vasoconstrictor vesicants per local protocol).',
        'Perform serial neurovascular checks and request early plastic or wound surgery consultation for skin blistering or necrosis.',
      ],
    },
  ),
  emergencyEntry(
    'fat-embolism',
    'Fat embolism syndrome',
    ['fes', 'fat embolism'],
    {
      preop: [
        'Identify patients with acute long-bone or pelvic fractures, particularly prior to intramedullary reaming or arthroplasty.',
        'Coordinate early orthopedic fracture immobilization to reduce marrow fat intravasation.',
      ],
      intraop: [
        'Recognize unexplained acute hypoxemia, tachycardia, fever, petechial rash, or acute right ventricular strain during bone instrumentation.',
        'Alert the surgical team during medullary reaming/cementing, deliver 100% oxygen, and support intravascular volume and right ventricular perfusion.',
      ],
      avoid: [
        'Avoid high airway pressures or aggressive PEEP swings that further impair right ventricular afterload in acute cor pulmonale.',
        'Do not delay supportive oxygenation or rely on high-dose corticosteroids, which lack established mortality benefit.',
      ],
      postop: [
        'Monitor closely in the intensive care unit for the classic triad of respiratory failure, neurologic dysfunction, and petechiae.',
        'Provide lung-protective mechanical ventilation if ARDS develops and evaluate for concurrent venous thromboembolism.',
      ],
    },
  ),
  emergencyEntry(
    'intraop-hypertension',
    'Acute intraoperative hypertension',
    ['intraoperative hypertension', 'hypertensive crisis'],
    {
      preop: [
        'Review baseline blood pressure, antihypertensive adherence, and screen for secondary causes such as pheochromocytoma or renal artery disease.',
        'Continue baseline beta-blockers and clonidine preoperatively to prevent severe rebound hypertension.',
      ],
      intraop: [
        'Confirm arterial pressure accuracy and exclude reversible triggers first: light anesthesia, surgical pain, hypercapnia, hypoxemia, or bladder distension.',
        'Deepen anesthesia and analgesia appropriately; if hypertension persists, titrate short-acting IV agents (e.g., esmolol, nicardipine, clevidipine, or labetalol).',
      ],
      avoid: [
        'Avoid precipitating precipitous hypotension in chronically hypertensive patients whose cerebral autoregulation curve is shifted rightward.',
        'Never treat suspected pheochromocytoma catecholamine surges with unopposed beta-blockade prior to alpha-blockade.',
      ],
      postop: [
        'Assess for end-organ ischemia (ECG changes, neurologic deficits, surgical site bleeding) before recovery discharge.',
        'Transition smoothly to scheduled oral antihypertensive therapy and manage postoperative pain and emergence agitation.',
      ],
    },
  ),
  emergencyEntry(
    'intraop-hypoglycemia',
    'Perioperative hypoglycemia',
    ['hypoglycemia', 'low blood glucose'],
    {
      preop: [
        'Identify insulin-dependent diabetes, sulfonylurea exposure, neonates, severe liver failure, or sepsis prior to fasting.',
        'Adjust basal insulin and withhold oral hypoglycemics on the morning of surgery while checking baseline point-of-care glucose.',
      ],
      intraop: [
        'Monitor point-of-care blood glucose hourly during prolonged cases because general anesthesia masks neuroglycopenic symptoms.',
        'Treat confirmed low glucose promptly with IV dextrose bolus, start a dextrose-containing maintenance infusion, and recheck glucose within 15 minutes.',
      ],
      avoid: [
        'Avoid attributing unexplained tachycardia, diaphoresis, or delayed emergence solely to anesthesia depth without checking glucose.',
        'Avoid administering insulin infusions without concurrent hourly glucose checks and a reliable dextrose carrier.',
      ],
      postop: [
        'Evaluate mental status and serial blood glucose measurements in PACU until stable oral or enteral intake resumes.',
        'Adjust postoperative insulin regimens to prevent recurrent delayed hypoglycemia.',
      ],
    },
  ),
  emergencyEntry(
    'intraop-hypotension',
    'Acute intraoperative hypotension',
    ['intraoperative hypotension', 'shock'],
    {
      preop: [
        'Assess baseline intravascular volume status, cardiac reserve, sepsis, and preoperative renin-angiotensin inhibitor exposure.',
        'Establish adequate venous access and invasive arterial monitoring before induction in high-risk cardiovascular patients.',
      ],
      intraop: [
        'Verify NIBP/arterial transducer zeroing and ECG rhythm while simultaneously reducing volatile depth and giving 100% oxygen.',
        'Administer prompt vasopressor boluses and balanced crystalloid challenge while inspecting surgical field for occult hemorrhage.',
        'Systematically rule out obstructive/distributive shock (tension pneumothorax, tamponade, anaphylaxis, VAE, myocardial ischemia).',
      ],
      avoid: [
        'Avoid tolerating sustained mean arterial pressure drops that impair renal, myocardial, and cerebral organ perfusion.',
        'Avoid attributing refractory hypotension solely to anesthetic depth when surgical bleeding or anaphylaxis is evolving.',
      ],
      postop: [
        'Verify hemoglobin, lactate, acid-base balance, and urine output in PACU or ICU after prolonged hypotensive episodes.',
        'Monitor for acute kidney injury, myocardial injury after noncardiac surgery, or postoperative delirium.',
      ],
    },
  ),
  emergencyEntry(
    'intraop-hypoxemia',
    'Acute intraoperative hypoxemia',
    ['hypoxemia', 'desaturation'],
    {
      preop: [
        'Screen for pre-existing cardiopulmonary disease, morbid obesity, or difficult airway anatomy before induction.',
        'Ensure thorough preoxygenation with a tight-fitting facemask to maximize functional residual capacity oxygen reserve.',
      ],
      intraop: [
        'Detect falling pulse oximetry saturation, verify plethysmograph waveform, and immediately switch to 100% inspired oxygen.',
        'Switch to manual bag ventilation to feel lung compliance and confirm circuit integrity, inspired oxygen concentration, and capnography.',
        'Auscultate bilateral breath sounds to exclude mainstem intubation, esophageal displacement, pneumothorax, bronchospasm, or mucus plugging.',
      ],
      avoid: [
        'Avoid dismissing desaturation as probe artifact before visually confirming cyanosis, arterial waveform, and ventilation.',
        'Avoid delaying airway inspection or circuit disconnection checks when manual bagging feels abnormal.',
      ],
      postop: [
        'Obtain an arterial blood gas and chest radiograph when persistent shunt, atelectasis, or pneumothorax is suspected.',
        'Transfer to PACU or ICU on continuous pulse oximetry and supplemental oxygen until oxygenation normalizes.',
      ],
    },
  ),
  emergencyEntry(
    'increased-airway-pressure',
    'Elevated airway pressure',
    ['high peak pressure', 'increased airway pressure', 'high plateau pressure'],
    {
      preop: [
        'Identify reactive airway disease, COPD, morbid obesity, or chest wall deformities and complete full circuit checks.',
        'Optimize bronchodilator therapy prior to induction in patients with reversible bronchoconstriction.',
      ],
      intraop: [
        'When high peak or plateau pressure alarms sound, switch immediately to manual bag ventilation to gauge compliance.',
        'Trace systematically from anesthesia machine to patient: check for kinked/bitten ETT, cuff herniation, secretions, bronchospasm, or pneumothorax.',
        'Compare peak minus plateau gradient to distinguish airway resistance issues from reduced lung or chest wall compliance.',
      ],
      avoid: [
        'Avoid forcefully bagging against sudden high resistance before ruling out tension pneumothorax or circuit obstruction.',
        'Avoid blindly deepening volatile anesthesia before confirming breathing circuit and tracheal tube patency.',
      ],
      postop: [
        'Reassess bilateral breath sounds and obtain a chest radiograph or bronchoscopy if barotrauma or plugging occurred.',
        'Monitor in recovery for recurrent bronchospasm, post-obstructive edema, or subglottic swelling.',
      ],
    },
  ),
  emergencyEntry(
    'increased-icp',
    'Acute intracranial hypertension (increased ICP)',
    ['increased icp', 'intracranial hypertension', 'cerebral edema'],
    {
      preop: [
        'Identify intracranial mass lesions, hydrocephalus, or traumatic brain injury prior to anesthetic planning.',
        'Avoid heavy preoperative sedation that causes hypoventilation, hypercapnia, and secondary cerebral vasodilation.',
      ],
      intraop: [
        'Recognize Cushing triad (hypertension, bradycardia, irregular respirations) or a tense, bulging dura on surgical exposure.',
        'Deliver 100% oxygen, initiate mild hyperventilation toward mild hypocapnia, elevate the head 30 degrees, and keep the neck midline.',
        'Administer osmotic therapy (mannitol or hypertonic saline) and support mean arterial pressure to preserve cerebral perfusion pressure.',
      ],
      avoid: [
        'Avoid hypoxemia, hypercapnia, excessive PEEP, tight ETT ties, and extreme neck rotation that obstruct jugular venous drainage.',
        'Avoid systemic hypotension that drops cerebral perfusion pressure across the injured brain.',
      ],
      postop: [
        'Maintain 30-degree head elevation and tight hemodynamic and carbon dioxide control during transfer.',
        'Obtain an emergent non-contrast head CT for sluggish pupils or delayed emergence and admit intubated to the neuro-ICU.',
      ],
    },
  ),
  emergencyEntry(
    'laryngospasm',
    'Laryngospasm',
    ['laryngeal spasm', 'stridor'],
    {
      preop: [
        'Identify pediatric age, active upper respiratory infection, passive smoke exposure, and airway surgery risk.',
        'Plan smooth deep or fully awake extubation and consider topical or IV lidocaine/opioid blunting when indicated.',
      ],
      intraop: [
        'Detect inspiratory stridor or silent complete airway obstruction with paradoxical chest-abdominal rocking.',
        'Clear blood or secretions from the oropharynx, apply 100% oxygen with gentle CPAP, and perform Larson maneuver (jaw thrust with styloid notch pressure).',
        'Deepen anesthesia with IV propofol or administer a small dose of succinylcholine promptly if obstruction does not break and SpO2 falls.',
      ],
      avoid: [
        'Avoid aggressive high-pressure mask breaths against closed vocal cords, which insufflate the stomach and worsen regurgitation risk.',
        'Never delay muscle relaxation or airway rescue when severe hypoxemia or bradycardia develops.',
      ],
      postop: [
        'Observe in PACU for at least 2 to 4 hours for delayed negative-pressure pulmonary edema.',
        'Maintain humidified oxygen and continuous pulse oximetry until laryngeal reflexes and respiratory effort are normal.',
      ],
    },
    { checklistId: 'crisis-laryngospasm' },
  ),
  emergencyEntry(
    'last-toxicity',
    'Local anesthetic systemic toxicity (LAST)',
    ['last', 'local anesthetic toxicity'],
    {
      preop: [
        'Identify extremes of age, low muscle mass, pregnancy, or cardiac/hepatic/renal disease requiring dose reduction.',
        'Use ultrasound guidance, incremental fractionated injections, and frequent gentle aspiration before every local anesthetic bolus.',
      ],
      intraop: [
        'Recognize CNS prodrome (perioral numbness, tinnitus, metallic taste, agitation, seizures) or abrupt arrhythmias and cardiac arrest.',
        'Stop local anesthetic injection immediately, call for the LAST kit, secure oxygenation/ventilation with 100% oxygen, and avoid hypercapnia/acidosis.',
        'Initiate 20% intravenous lipid emulsion therapy using the dedicated SOS LAST dosing calculator without delay.',
      ],
      avoid: [
        'Never substitute propofol for 20% lipid emulsion in cardiovascularly unstable LAST patients.',
        'Avoid vasopressin, calcium channel blockers, beta-blockers, local anesthetic antiarrhythmics (lidocaine), and large epinephrine boluses.',
      ],
      postop: [
        'Monitor in an intensive care unit for at least 12 to 24 hours for recurrent arrhythmias or delayed lipid rebound.',
        'Evaluate for pancreatitis or hyperlipidemia after large lipid infusions and document the event prominently.',
      ],
    },
    { crisis: 'last' },
  ),
  emergencyEntry(
    'perioperative-mi',
    'Perioperative myocardial infarction',
    ['pmi', 'myocardial infarction', 'acute coronary syndrome', 'stemi', 'nstemi'],
    {
      preop: [
        'Stratify cardiovascular risk using RCRI and functional capacity guidelines prior to major noncardiac surgery.',
        'Continue baseline beta-blockers and statins through the morning of surgery to avoid rebound myocardial ischemia.',
      ],
      intraop: [
        'Recognize new ST-segment elevation/depression, unexplained arrhythmias, hypotension, or regional wall motion changes on echocardiography.',
        'Administer 100% oxygen, correct tachycardia and hypotension to optimize myocardial oxygen supply-demand balance, and correct severe anemia.',
        'Titrate IV nitroglycerin for active ischemia when blood pressure tolerates and notify the surgical team to expedite closure.',
      ],
      avoid: [
        'Avoid persistent tachycardia, hypothermia-induced shivering, acute anemia, and prolonged hypotension.',
        'Avoid administering IV beta-blockers when acute decompensated heart failure or cardiogenic shock is present.',
      ],
      postop: [
        'Obtain an immediate 12-lead ECG, serial high-sensitivity cardiac troponins, and urgent cardiology consultation.',
        'Admit the patient to a cardiac ICU for telemetry, antiplatelet/anticoagulation risk assessment with surgery, and possible angiography.',
      ],
    },
  ),
  emergencyEntry(
    'povl',
    'Postoperative visual loss (POVL)',
    ['povl', 'ischemic optic neuropathy', 'blindness'],
    {
      preop: [
        'Identify prolonged prone spine fusion, cardiac surgery, or procedures expecting substantial blood loss and fluid shifts.',
        'Discuss the rare risk of ischemic optic neuropathy during preoperative consent for high-risk spine surgery.',
      ],
      intraop: [
        'Ensure zero external globe compression using padded foam/mirror frames and recheck eye position every 15 to 30 minutes.',
        'Maintain baseline mean arterial pressure, avoid extreme hemodilution, and stage prolonged prone spine cases when blood loss mounts.',
        'Keep the head neutral or slightly elevated (10 degrees reverse Trendelenburg) to minimize orbital venous congestion.',
      ],
      avoid: [
        'Avoid horseshoe headrests during prone spine surgery where slight patient shift can compress the globe (central retinal artery occlusion).',
        'Avoid prolonged deliberate hypotension and excessive crystalloid-only resuscitation in lengthy prone procedures.',
      ],
      postop: [
        'Perform a bedside visual acuity, visual field, and pupillary light reflex check as soon as the patient is awake.',
        'Obtain an emergent ophthalmology consultation immediately for any visual deficit or sluggish pupil.',
      ],
    },
  ),
  emergencyEntry(
    'perioperative-seizure',
    'Perioperative seizure',
    ['seizure', 'status epilepticus', 'convulsions'],
    {
      preop: [
        'Screen for epilepsy, intracranial lesions, alcohol withdrawal, and metabolic disorders; maintain oral antiepileptic drugs on surgery day.',
        'Consider proconvulsant drug interactions and minimize severe sleep deprivation or missed medication doses.',
      ],
      intraop: [
        'Recognize rhythmic tonic-clonic activity or unexplained tachycardia, hypertension, pupillary dilation, and surging ETCO2 under paralysis.',
        'Administer 100% oxygen, protect the airway and prevent physical injury, and terminate activity promptly with IV benzodiazepine or propofol.',
      ],
      avoid: [
        'Avoid proconvulsant exposures (high-dose local anesthetics, normeperidine, flumazenil in chronic benzodiazepine users).',
        'Never treat seizures with neuromuscular blockers alone, which mask motor convulsions while cerebral status epilepticus persists.',
      ],
      postop: [
        'Check point-of-care glucose, serum sodium/electrolytes, and arterial blood gases immediately to rule out metabolic triggers.',
        'Admit to ICU with neurology consultation and continuous EEG monitoring until seizure control is established.',
      ],
    },
  ),
  emergencyEntry(
    'tension-pneumothorax',
    'Tension pneumothorax',
    ['pneumothorax', 'tension ptx'],
    {
      preop: [
        'Screen patients with chest trauma, bullous emphysema, COPD, or planned central line placement, supraclavicular blocks, or thoracic/neck surgery.',
        'Review preoperative chest radiographs and verify immediate access to large-bore decompression angiocatheters.',
      ],
      intraop: [
        'Recognize acute unilateral absent breath sounds, escalating peak airway pressures, refractory hypoxemia, and shock with tracheal deviation.',
        'Turn off nitrous oxide, give 100% oxygen, alert the surgical team, and perform immediate needle thoracostomy decompression.',
        'Follow emergent needle decompression promptly with formal chest tube thoracostomy connected to water-seal suction.',
      ],
      avoid: [
        'Never delay needle decompression in an unstable patient to wait for a confirmatory chest radiograph.',
        'Avoid nitrous oxide whenever pneumothorax is suspected, as it rapidly diffuses into air spaces and expands pleural tension.',
      ],
      postop: [
        'Verify full bilateral lung re-expansion with post-insertion chest radiography and monitor water-seal bubbling.',
        'Transfer to ICU with thoracic surgical follow-up before considering extubation.',
      ],
    },
  ),
  emergencyEntry(
    'total-spinal',
    'Total spinal / high neuraxial block',
    ['total spinal', 'high spinal'],
    {
      preop: [
        'Verify spinal landmarks carefully and confirm epidural catheter position with a test dose and incremental fractionated dosing.',
        'Avoid excessive intrathecal or unintended subdural local anesthetic volumes, especially in shortened stature or pregnancy.',
      ],
      intraop: [
        'Detect rapid ascending sensory block, hand weakness, dysphonia/aphonia, apnea, profound bradycardia, and refractory hypotension.',
        'Reassure the patient if awake, immediately secure the airway with tracheal intubation, and ventilate with 100% oxygen.',
        'Support circulation aggressively with rapid IV fluids, vasopressors, and early IV epinephrine for severe bradycardia or arrest.',
      ],
      avoid: [
        'Avoid placing the patient in steep reverse Trendelenburg position to halt block spread, which triggers catastrophic venous pooling and arrest.',
        'Do not delay intubation or epinephrine when aphonia, unconsciousness, or severe hypotension occurs.',
      ],
      postop: [
        'Maintain controlled mechanical ventilation and vasopressor infusion until complete motor and respiratory block regression.',
        'Monitor in ICU with continuous arterial pressure tracking and confirm airway reflex recovery prior to extubation.',
      ],
    },
  ),
  emergencyEntry(
    'transfusion-reaction',
    'Acute transfusion reaction',
    ['transfusion reaction', 'ahtr', 'trali', 'taco'],
    {
      preop: [
        'Perform rigorous two-person clerical verification matching patient identity, blood group, and unit number before spiking any unit.',
        'Review antibody screen results, prior transfusion reactions, and known IgA deficiency preoperatively.',
      ],
      intraop: [
        'Suspect acute hemolytic reaction under anesthesia upon sudden unexplained hypotension, diffuse microvascular oozing, hemoglobinuria, bronchospasm, or fever.',
        'Immediately halt the blood transfusion, disconnect the tubing, and infuse 0.9% saline through new tubing to preserve renal perfusion.',
        'Support blood pressure and maintain brisk urine output with crystalloids and diuretics as needed.',
      ],
      avoid: [
        'Avoid discarding the implicated blood bag or administration tubing, which the blood bank needs for investigation.',
        'Never infuse additional units from the same donor batch before clerical and serologic crossmatch review completes.',
      ],
      postop: [
        'Send the remaining donor unit, tubing, and post-reaction patient blood and urine samples immediately to the blood bank.',
        'Monitor in ICU for disseminated intravascular coagulation, hyperkalemia, and acute kidney injury.',
      ],
    },
  ),
  emergencyEntry(
    'venous-air-embolism',
    'Venous air embolism (VAE)',
    ['vae', 'air embolism'],
    {
      preop: [
        'Identify high-risk procedures where non-collapsible veins sit above heart level (sitting craniotomy, laparoscopy, hysteroscopy, CVC insertion).',
        'Place precordial Doppler or transesophageal echocardiography and consider a multi-orifice right-atrial central catheter in high-risk cases.',
      ],
      intraop: [
        'Recognize abrupt plummet in ETCO2, rising end-tidal nitrogen, acute desaturation, millwheel murmur, and cardiovascular collapse.',
        'Immediately notify surgery to flood the operative field with saline and wax bone edges; halt nitrous oxide and ventilate with 100% oxygen.',
        'Support hemodynamics with vasopressors and fluids and attempt air aspiration through a central venous catheter when positioned.',
      ],
      avoid: [
        'Avoid nitrous oxide in air-entrainment cases, as it rapidly diffuses into intravascular bubbles and expands embolus volume.',
        'Avoid leaving the surgical site elevated above the heart or continuing laparoscopy insufflation during suspected VAE.',
      ],
      postop: [
        'Position the patient in Durant maneuver (left lateral decubitus Trendelenburg) to trap air in the right ventricular apex away from the outflow tract.',
        'Transfer to the intensive care unit to monitor for paradoxical arterial/cerebral air embolism and noncardiogenic pulmonary edema.',
      ],
    },
  ),
];
