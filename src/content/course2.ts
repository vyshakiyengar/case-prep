import type { Lesson } from './course'

export const LESSONS_2: Lesson[] = [
  {
    slug: 'driving-the-case',
    title: 'Driving the case',
    minutes: 6,
    summary: 'In most interviews you are expected to steer. Propose next steps, summarise as you go, and keep linking back to the goal.',
    sections: [
      {
        h: 'Propose, don’t wait',
        body: `<p>After your structure, and after every answer, say what you want to look at next, what data you need, and why: "As a next step, I’d like to check whether the drop is industry-wide. Do we have market data?" This is what interviewers mean by <b>case leadership</b>, and it’s scored separately from getting the answers right.</p>`,
      },
      {
        h: 'Summarise at the turns',
        body: `<p>When you finish one branch of your structure, give a two-line summary before moving on: "So far: revenue is flat, and the profit drop is almost all delivery commissions. The open question is whether delivery adds any profit at all." It keeps the interviewer with you, and it keeps <i>you</i> oriented.</p>`,
      },
      {
        h: 'Link every finding to the goal',
        body: `<p>Finish each finding with why it matters for the client: "...which matters because our goal is to get back to £10M." If you can’t link a finding to the goal, it probably isn’t important.</p>`,
      },
      {
        h: 'When you get lost',
        body: `<p>It happens to everyone. Don’t go silent. Step back out loud: "Let me take a step back. We know A and B, and we’re trying to get to X, so the next thing to check is C." A calm step back reads as composure; panic reads as panic.</p>`,
      },
    ],
    example: {
      title: 'After reading a chart',
      body: `<p><b>Passive:</b> "So the North fell a lot. What would you like me to look at next?"</p>
<p><b>Driving:</b> "The North explains the whole decline, while other regions grew slightly. Given our goal is to restore sales, I’d like to understand what changed in the North: did we lose a big customer, close stores, or face a new competitor? Do we have sales by customer for the North?"</p>`,
    },
    takeaways: ['End every answer with your next step and the data you need.', 'Summarise when you finish a branch.', 'Link findings back to the goal; step back out loud when lost.'],
    quiz: [
      { q: 'You’ve just finished analysing costs. What should you do next?', options: ['Wait for the interviewer’s next question', 'Summarise what you found and propose the next area to look at', 'Start your recommendation immediately'], answer: 1, why: 'A quick summary plus a proposed next step is exactly what case leadership looks like.' },
      { q: 'You realise you’re lost mid-case. What’s the best move?', options: ['Keep talking until something comes to you', 'Pause and step back out loud: what we know, what we need, what to check next', 'Ask the interviewer for the answer'], answer: 1, why: 'Stepping back calmly shows composure and usually reveals the next step.' },
    ],
    practice: { label: 'Drive a candidate-led case: Nordwind E-Bikes', to: '/casebook/nordwind-e-bikes' },
  },
  {
    slug: 'market-sizing',
    title: 'Market sizing',
    minutes: 9,
    summary: 'How many, how big, how much. The structure earns the points, not the final number.',
    sections: [
      {
        h: 'Clarify what you are sizing',
        body: `<p>Units or value? One year or the total stock? Which country? Consumers, businesses, or both? Pin this down first: "home EV chargers installed in the UK per year, in units and pounds" is a very different question from "EV chargers in the UK".</p>`,
      },
      {
        h: 'Guess first, then choose top-down or bottom-up',
        body: `<p>Say an order of magnitude before you calculate: "My instinct is a few hundred thousand a year." It shows judgement and gives you something to check against.</p>
<ul><li><b>Top-down</b> starts from a big population and filters it: people → households → share with a driveway → share buying an EV.</li>
<li><b>Bottom-up</b> builds from a unit: chargers one installer fits per week × number of installers.</li></ul>
<p>Pick one, segment where it matters (urban vs rural, heavy vs light users), and use round numbers. Ask if there's a constraint on supply, such as fleet size, shelf space or installer capacity. Often the limiting factor is the real answer.</p>`,
      },
      {
        h: 'Sanity-check with the other method',
        body: `<p>If you have time, cross-check with the opposite approach or a known comparison. If top-down says 290,000 chargers and bottom-up says 30,000, one of your assumptions is wrong. Finding which is a great thing to say out loud.</p>`,
      },
    ],
    example: {
      title: 'A clean top-down estimate',
      body: `<p>"New cars sold per year, about 1.9M; about a quarter fully electric, so ~475k. Around 60% have off-street parking → ~285k, and most of those, say 80%, install a charger → ~230k. Add first-time EV owners buying used, roughly 60k. So about 290k units a year; at ~£1,000 installed, roughly £300M. The limit isn't demand, it's how many people have a driveway."</p>
<p><i>These are illustrative assumptions for practice, not real statistics.</i></p>`,
    },
    takeaways: ['Clarify units, time period and geography first.', 'State a rough guess before calculating.', 'Segment sensibly, round numbers, sanity-check, name the limiting factor.'],
    quiz: [
      { q: 'What earns most of the points in a market sizing question?', options: ['Getting the exact real-world number', 'A clear, logical structure with stated assumptions', 'Using as many segments as possible'], answer: 1, why: 'Interviewers know you can’t know the true number. They score your logic and judgement.' },
      { q: 'Why say a rough guess before calculating?', options: ['To save time', 'It shows judgement and gives you a sanity check', 'Interviewers require it'], answer: 1, why: 'If your calculation lands far from your guess, you know to re-check an assumption.' },
    ],
    practice: { label: 'Try case 11: Plugged In', to: '/casebook/plugged-in' },
  },
  {
    slug: 'brainstorming',
    title: 'Brainstorming with structure',
    minutes: 6,
    summary: '"What could the client do?" is still a structuring question. Use buckets, not a list.',
    sections: [
      {
        h: 'Never list randomly',
        body: `<p>When asked "what could explain this?" or "how could they fix it?", take ten seconds and answer as a mini-tree. Two or three buckets are enough: <b>internal vs external</b>, <b>short-term vs long-term</b>, <b>revenue vs cost</b>, <b>customers vs company vs competitors</b>. Then give 2-3 ideas under each.</p>`,
      },
      {
        h: 'Add one real-world example',
        body: `<p>One concrete example from a real company lifts an answer from "good" to "memorable": "Airlines solved a similar problem by unbundling bags and seats." Use at most one or two per case, as seasoning. Keep an idea or two in reserve, because the interviewer will often ask "anything else?"</p>`,
      },
      {
        h: 'Prioritise before you stop',
        body: `<p>End by saying which idea you'd pursue first and why, usually based on impact, cost and speed. A list without a priority leaves the interviewer to do your job.</p>`,
      },
    ],
    example: {
      title: 'How could a coffee chain make delivery more profitable?',
      body: `<p>"I'd think about it in two buckets: making each delivery order more profitable, and moving customers to cheaper channels. On the first: raise app menu prices, as many chains do; negotiate the commission down for volume; build a delivery menu around high-margin items. On the second: a click-and-collect option in our own app, with loyalty points to make the switch worth it. I'd start with app pricing, because it's fast and needs no investment."</p>`,
    },
    takeaways: ['Two or three buckets, then ideas under each.', 'One real example, used sparingly.', 'Finish with a priority.'],
    quiz: [
      { q: 'Which opening is strongest for a brainstorm?', options: ['"Lots of things could help, for example..."', '"I’d think about this in two buckets: internal and external."', '"Let me list every idea I can think of."'], answer: 1, why: 'Buckets show structure and make your ideas easy to follow.' },
    ],
    practice: { label: 'Practise in case 7: FreshMart', to: '/casebook/freshmart' },
  },
  {
    slug: 'recommendation',
    title: 'The recommendation',
    minutes: 6,
    summary: 'The last 60 seconds are what the interviewer remembers. Answer first, reasons with numbers, risks, next steps.',
    sections: [
      {
        h: 'Answer first',
        body: `<p>Open with the recommendation itself: "I recommend entering the US through a distributor." Not "So, first we looked at the market..." The interviewer has just watched the whole case and doesn't need a replay.</p>`,
      },
      {
        h: 'The structure: answer, reasons, risks, next steps',
        body: `<ul><li><b>Answer</b>: one sentence.</li><li><b>Two or three reasons, each with a number</b> from the case.</li>
<li><b>The main risk</b>, and how you'd manage it.</li><li><b>Next steps</b>, including any branch of your structure you didn't get to.</li></ul>
<p>Take 20 seconds to prepare ("May I take a moment to put this together?"), then speak for about 60. Talk to the interviewer as if they were the client's CEO.</p>`,
      },
    ],
    example: {
      title: 'A 60-second recommendation',
      body: `<p>"I recommend PackRight buys RePlast, but not at a flat €180M. Two reasons: recycled plastic becomes scarce from 2028, and RePlast covers two-thirds of what PackRight legally needs by 2030. With all synergies it's worth about €215M to us, but without the uncertain green premium only €155M. So I'd offer around €160M plus an earn-out tied to signed premium contracts. The key risk is food-grade quality, so next steps are technical due diligence and talks with three anchor customers."</p>`,
    },
    takeaways: ['Start with the answer.', 'Each reason gets a number from the case.', 'Risks and next steps show you see the whole picture.'],
    quiz: [
      { q: 'How should a recommendation begin?', options: ['With a summary of the case', 'With the recommendation itself', 'By thanking the interviewer'], answer: 1, why: 'Answer first. Reasons follow.' },
      { q: 'Where do unexplored parts of your structure belong?', options: ['Nowhere: don’t mention them', 'In next steps', 'At the start of the recommendation'], answer: 1, why: 'Naming them as next steps shows you tracked the whole problem.' },
    ],
    practice: { label: 'Record yourself on case 4: PackRight', to: '/casebook/packright' },
  },
  {
    slug: 'how-you-come-across',
    title: 'How you come across',
    minutes: 9,
    summary: 'The half of the interview most candidates never train: voice, composure and business fluency.',
    sections: [
      {
        h: 'Why this matters as much as the maths',
        body: `<p>Two candidates with the same structure can get different results. One speaks in calm, well-paced sentences and pauses before answering. The other rushes, fills silences with "um" and "like", and loses the thread under pressure. The interviewer is picturing you in front of their client. These habits are trainable, in about 10-20 minutes a day.</p>`,
      },
      {
        h: 'Voice: pace, pauses, no fillers',
        body: `<ul><li><b>Paced reading</b>: read a business article aloud slightly slower than feels natural, pausing at every full stop. Five minutes a day.</li>
<li><b>Pause practice</b>: record a 2-minute answer, count your filler words, re-record with a silent pause in place of each one. A pause sounds confident; "um" sounds nervous.</li>
<li><b>Explain to the CEO</b>: explain one concept in 60 seconds, top-down and jargon-free.</li></ul>`,
      },
      {
        h: 'Mind: hold more in your head',
        body: `<p>Mid-case you are juggling the goal, your structure, three numbers and the next step, while talking. Working memory can be trained: dual n-back apps, a 60-second recap of a podcast clip, redrawing a framework from memory. Ten minutes a day helps you avoid going blank.</p>`,
      },
      {
        h: 'Fluency and calm',
        body: `<p>Read 15 minutes of business press or a strategy book daily, and note one real company story you could use in a case. Before every mock and the real interview, do two minutes of box breathing (in 4, hold 4, out 4, hold 4). A calm voice starts with calm breathing.</p>`,
      },
    ],
    example: {
      title: 'The same answer, two ways',
      body: `<p><b>Rushed:</b> "So, um, I think like the main thing is basically costs, because, um, the delivery thing, like, they pay a lot of commission and stuff."</p>
<p><b>Composed:</b> "The main driver is cost. [pause] Specifically, delivery commissions, which grew from 1.5% to 7.6% of revenue."</p>
<p>Same idea. The second one gets the offer.</p>`,
    },
    takeaways: ['Interviewers judge every sentence, not just your structure.', 'Replace filler words with pauses.', '10-20 minutes a day of voice and mind practice compounds quickly.'],
    quiz: [
      { q: 'What is the best replacement for a filler word like "um"?', options: ['Speaking faster', 'A short silent pause', 'Saying "basically"'], answer: 1, why: 'Pauses read as confidence and give you thinking time.' },
    ],
    practice: { label: 'Open the voice and mind exercises', to: '/learn/how-you-come-across#exercises' },
  },
  {
    slug: 'fit-interview',
    title: 'The FIT interview',
    minutes: 8,
    summary: 'Behavioural questions often count as much as the case. Build 6-8 stories once, and use each for several questions.',
    sections: [
      {
        h: 'What firms are looking for',
        body: `<p>Most FIT questions test the same handful of qualities: <b>leadership</b> (do people follow you when it's hard?), <b>impact</b> (did things change because of you?), <b>initiative</b> (do you start things?), <b>persuasion</b> (can you bring people round?) and how you handle <b>failure</b>. McKinsey's version (the PEI) goes deep on one story at a time, so expect follow-up questions.</p>`,
      },
      {
        h: 'STAR-L: the story shape',
        body: `<ul><li><b>Situation</b>: the context, in one or two lines.</li><li><b>Task</b>: what you were responsible for.</li>
<li><b>Action</b>: what <i>you</i> did, step by step. This is the heart of the story; say "I", not "we".</li>
<li><b>Result</b>: what changed, with a number if possible.</li><li><b>Learning</b>: what you'd do differently.</li></ul>
<p>Aim for 90-120 seconds per story, told, never read.</p>`,
      },
      {
        h: 'Build a story bank',
        body: `<p>Write 6-8 stories and map each to the questions it can answer. One strong story often covers leadership, conflict and impact. Rehearse out loud weekly. Your "Tell me about yourself" (60-90 seconds) and "Why this firm?" (with specifics: people you spoke to, practice areas) need preparing too.</p>`,
      },
    ],
    example: {
      title: 'The action section, done well',
      body: `<p>"I rebuilt the pricing model over a weekend, then split the remaining work by each person's strengths rather than seniority. I went to the manager with a proposal to drop two low-value analyses, and set up a 15-minute daily check-in so problems surfaced early."</p>
<p>Specific, first person, and every sentence is something <i>you</i> did.</p>`,
    },
    takeaways: ['6-8 stories cover most questions.', 'The action section is the heart: specific, first person.', 'Quantify the result; finish with what you learned.'],
    quiz: [
      { q: 'Which part of a STAR-L story deserves the most time?', options: ['Situation', 'Action', 'Learning'], answer: 1, why: 'The interviewer is assessing what you did. Keep context short.' },
    ],
    practice: { label: 'Build your FIT stories', to: '/stories' },
  },
]
