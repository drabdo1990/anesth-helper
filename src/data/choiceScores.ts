// Scores whose items have several answers worth different points (the yes/no RiskScore cannot express them).
// The 4AT wording and points are copied from the 4AT form, version 1 (supplementary appendix of Bellelli 2014).

import type { RiskBand } from './riskScores';

export interface ChoiceOption {
  label: string;
  points: number;
}

export interface ChoiceItem {
  id: string;
  label: string;
  /** How to ask or observe, as the form words it. */
  prompt?: string;
  options: ChoiceOption[];
}

export interface ChoiceScore {
  id: string;
  name: string;
  items: ChoiceItem[];
  bands: RiskBand[];
  note?: string;
  /** One-sentence rationale for trainees. */
  why?: string;
  sourceIds: string[];
}

export const FOUR_AT: ChoiceScore = {
  id: '4at',
  name: '4AT delirium screen',
  items: [
    {
      id: '4at-alertness',
      label: 'Alertness',
      prompt:
        'This includes patients who may be markedly drowsy (eg. difficult to rouse and/or obviously sleepy during assessment) or agitated/hyperactive. Observe the patient. If asleep, attempt to wake with speech or gentle touch on shoulder. Ask the patient to state their name and address to assist rating.',
      options: [
        { label: 'Normal (fully alert, but not agitated, throughout assessment)', points: 0 },
        { label: 'Mild sleepiness for <10 seconds after waking, then normal', points: 0 },
        { label: 'Clearly abnormal', points: 4 },
      ],
    },
    {
      id: '4at-amt4',
      label: 'AMT4',
      prompt: 'Age, date of birth, place (name of the hospital or building), current year.',
      options: [
        { label: 'No mistakes', points: 0 },
        { label: '1 mistake', points: 1 },
        { label: '2 or more mistakes/untestable', points: 2 },
      ],
    },
    {
      id: '4at-attention',
      label: 'Attention',
      prompt:
        'Ask the patient: "Please tell me the months of the year in backwards order, starting at December." To assist initial understanding one prompt of "what is the month before December?" is permitted.',
      options: [
        { label: 'Achieves 7 months or more correctly', points: 0 },
        { label: 'Starts but scores < 7 months / refuses to start', points: 1 },
        { label: 'Untestable (cannot start because unwell, drowsy, inattentive)', points: 2 },
      ],
    },
    {
      id: '4at-change',
      label: 'Acute change or fluctuating course',
      prompt:
        'Evidence of significant change or fluctuation in: alertness, cognition, other mental function (eg. paranoia, hallucinations) arising over the last 2 weeks and still evident in last 24hrs.',
      options: [
        { label: 'No', points: 0 },
        { label: 'Yes', points: 4 },
      ],
    },
  ],
  bands: [
    { min: 0, label: 'Delirium or cognitive impairment unlikely', detail: 'But delirium is still possible if the acute change item (4) information is incomplete.' },
    { min: 1, label: 'Possible cognitive impairment', detail: 'A score of 1 to 3.' },
    { min: 4, label: 'Possible delirium +/- cognitive impairment', detail: 'A score of 4 or above.' },
  ],
  note: 'A screening instrument, not a diagnosis: a score of 4 or more suggests delirium, and more detailed assessment of mental status may be required. Items 1 to 3 are rated on observation of the patient at the time of assessment. Item 4 needs information from one or more sources (for example your own knowledge of the patient, other staff, case notes, carers). Take account of hearing impairment, dysphasia and lack of a common language. It was validated in hospitalised patients aged 70 or over, not specifically after surgery. This is version 1 of the form; check www.the4AT.com for the current one.',
  why: 'Four quick items (alertness, a short memory test, attention, and any recent change) add up to 0 to 12. A score of 4 or more flags possible delirium.',
  sourceIds: ['4at-bellelli-2014'],
};

export const CHOICE_SCORES: ChoiceScore[] = [FOUR_AT];
