// Perfect casing: the choreography of a case from hello to recommendation.
// Adapted from the original Case Prep OS tracker ("Perfect Casing" tab).

export interface Moment { name: string; do: string; say?: string }
export interface Stage { n: number; slug: string; title: string; why: string; moments: Moment[]; mistake: string; lesson: string }
export interface Card { id: string; stage: number; situation: string; model: string; why: string }

export const STAGES_PC: Stage[] = [
  { n: 1, slug: 'listen', title: 'Listen and take notes', lesson: 'the-opening',
    why: 'Everything later links back to the goal you write down now.',
    mistake: 'Nodding along when you don’t understand, then getting lost ten minutes later.',
    moments: [
      { name: 'Listen and note', do: 'Shorthand notes on the left of your page. Write the client’s goal at the top, in a box, with its number and deadline.', say: '"Thank you for the case, this is an interesting problem."' },
      { name: 'Don’t fake understanding', do: 'Interrupt politely the moment something is unclear. Make it a conversation, not an interrogation.', say: '"Sorry, before you continue: when you say X, do you mean...?"' },
      { name: 'Draw early insights', do: 'React to interesting facts as they land. It shows commercial instinct and flags a branch to revisit.', say: '"Interesting that revenue fell while volume held. I may want to come back to pricing."' },
    ] },
  { n: 2, slug: 'recap', title: 'Recap', lesson: 'the-opening',
    why: 'Shows you listened, and checks you are solving the right problem.',
    mistake: 'Reading the whole prompt back word for word.',
    moments: [
      { name: 'Recap the key points only', do: 'The client, the problem and the measurable goal. Then check.', say: '"So our client is X, facing Y, and success means Z by [date]. Did I get that right?"' },
      { name: 'Ask for thinking time', do: 'After your recap and questions, formally ask for time to structure.', say: '"Thank you, that’s useful. May I take a moment to structure my thoughts?"' },
    ] },
  { n: 3, slug: 'clarify', title: 'Clarifying questions (three at most)', lesson: 'the-opening',
    why: 'The right question can split the whole case in two before you draw anything.',
    mistake: 'Asking a long list of questions to buy time.',
    moments: [
      { name: 'Pick from the question bank', do: 'Choose the 2-3 that matter most: business model, measurable goal and timeline, product mix, customers, geography, scope, suppliers.', say: '"How does the client actually make money?" / "Is there a specific target and timeline for this goal?"' },
      { name: 'Ask to build, not to stall', do: 'Only ask a question if its answer would change what you draw next.', say: '"Is this a problem the whole industry is facing, or just our client?"' },
    ] },
  { n: 4, slug: 'structure', title: 'Structure', lesson: 'structuring',
    why: 'The most heavily weighted skill. Your structure is your plan for the whole case.',
    mistake: 'Generic buckets that would fit any company, and no hypothesis.',
    moments: [
      { name: 'Draw it', do: '3-4 first-level buckets; under each, short second-level drivers tailored to THIS client.' },
      { name: 'Present it top-down', do: 'Big points first. Number them. Say which matters most and end with a hypothesis.', say: '"There are three areas I want to look at. First... I believe the second, the unit economics, is most likely the issue, so I’d start there."' },
      { name: 'Check it is MECE', do: 'Before speaking: do buckets overlap? Is anything big missing, like regulation, competition or industry-wide effects? Use factors for "why" questions, steps for "should we" questions.' },
    ] },
  { n: 5, slug: 'lead', title: 'Lead the case', lesson: 'driving-the-case',
    why: 'Interviewers score whether you drive. Waiting to be told what to do loses candidate-led cases.',
    mistake: 'Ending answers with "where would you like me to go next?"',
    moments: [
      { name: 'Propose, don’t wait', do: 'After your structure and after every answer, say where you want to go next, what data you need, and why.', say: '"As a next step, I’d like market data to test whether the decline is industry-wide. Do we have anything on that?"' },
      { name: 'Summarise at the turns', do: 'When you finish one area, summarise in two lines and steer.', say: '"Let me quickly summarise where we are: we know A and B; the open question is C."' },
    ] },
  { n: 6, slug: 'charts', title: 'Charts and exhibits', lesson: 'charts-and-exhibits',
    why: 'Exhibits are where cases are won: they test whether you can find what matters.',
    mistake: 'Describing the chart instead of drawing an insight from it.',
    moments: [
      { name: 'Take a moment', do: 'Ask for 30 seconds. Read title, axes, units and footnote. Write down two insights before you speak.', say: '"Thank you. May I take a moment to process this?"' },
      { name: 'Insights, not description', do: 'Find what matters, connect parts of the chart, do the maths without being asked, and link back to the goal.', say: '"Two things stand out. First... Second... Given our goal, the second matters more, and I’d like to quantify it."' },
      { name: 'If stuck or wrong', do: 'Say it out loud. Silence reads as panic; a structured step back reads as composure.', say: '"I’d like to take a step back. We know A, B and C, and we’re trying to get to X."' },
    ] },
  { n: 7, slug: 'maths', title: 'Maths', lesson: 'case-maths',
    why: 'Numbers turn opinions into evidence. Errors under pressure are the most common confidence killer.',
    mistake: 'Calculating in silence, and not checking whether the answer makes sense.',
    moments: [
      { name: 'Approach before arithmetic', do: 'Write down what is being asked. State your formula, get agreement, then calculate out loud.', say: '"My approach: market size × share × margin, minus the investment. Does that make sense before I run the numbers?"' },
      { name: 'Always sanity-check', do: 'Check the order of magnitude out loud after every result. Round smartly: 5.5B is not 5B.', say: '"Quick sanity check: 2M units at $50 is $100M, consistent with a $500M market at 20% share. Good."' },
      { name: 'Market sizing extras', do: 'Say a rough guess first, pick top-down or bottom-up, ask for the limiting factor, and cross-check if there’s time.', say: '"Before I size it, my instinct says this is a low single-digit millions market. Let me test that top-down."' },
    ] },
  { n: 8, slug: 'brainstorm', title: 'Brainstorm', lesson: 'brainstorming',
    why: 'Even open questions are structuring questions in disguise.',
    mistake: 'Listing ideas randomly, with no priority.',
    moments: [
      { name: 'Structure even here', do: 'Take a moment and answer as a mini-tree: internal vs external, short vs long term, revenue vs cost. Keep an idea in reserve.', say: '"Let me think about this in two buckets: what we can do with today’s capabilities, and what needs new ones. On the first..."' },
      { name: 'Add one real example', do: 'Tag an idea with real-world experience. It separates good from memorable.', say: '"Retention offers work well here; it’s what mobile operators do when contracts end."' },
    ] },
  { n: 9, slug: 'recommend', title: 'Recommendation', lesson: 'recommendation',
    why: 'The last 60 seconds are what the interviewer remembers and writes up.',
    mistake: 'Replaying the whole case from the start instead of giving the answer.',
    moments: [
      { name: 'Answer first', do: 'Prepare for 20 seconds, speak for about 60: recommendation, 2-3 reasons with numbers, risks, next steps.', say: '"I recommend entering through a joint venture. Two reasons: the market grows 12% a year, and a partner caps our investment at $20M with breakeven in year 2. The key risk is depending on the partner, so as next steps I’d agree exit terms and test demand in one city."' },
      { name: 'Park what you didn’t cover', do: 'Branches you never reached belong in next steps. It shows you tracked the whole problem.', say: '"...and as a next step I’d also look at the cost side, which we didn’t get to today."' },
    ] },
  { n: 10, slug: 'throughout', title: 'Throughout the case', lesson: 'how-you-come-across',
    why: 'You are being judged on how you come across in every minute, not just the answers.',
    mistake: 'Letting nerves show, and losing the link to the goal.',
    moments: [
      { name: 'Presence', do: 'Keep smiling, especially when struggling. Pauses read as confidence. Treat it as a conversation between colleagues, not a test.' },
      { name: 'Good habits', do: 'Ask for time before taking it. Bring in personal experience and current events. If they mention capital spending, ask about running costs too.' },
      { name: 'Link everything back', do: 'Every answer, insight and calculation connects to the goal at the top of your page. The most common differentiator in feedback.', say: '"...and this matters because our client’s goal is X."' },
    ] },
]

// Training cards: a realistic moment in the interview; say your line out loud, then compare.
export const CARDS: Card[] = [
  { id: 'c1', stage: 1, situation: 'The interviewer has just finished reading the prompt to you. What do you say first?', model: '"Thank you for the case, this is an interesting problem." Then write the goal at the top of your page.', why: 'A calm, warm opening buys you a second and sets the tone of a conversation between colleagues.' },
  { id: 'c2', stage: 1, situation: 'Mid-prompt, the interviewer says "the client’s contribution has fallen" and you’re not sure what they mean by contribution.', model: '"Sorry, before you continue: when you say contribution, do you mean contribution margin per unit?"', why: 'Clarifying immediately is far cheaper than building on a misunderstanding.' },
  { id: 'c3', stage: 1, situation: 'You hear: "volumes are stable but revenue is down 8%". React out loud.', model: '"Interesting that revenue fell while volume held. That points to price or mix, so I may want to come back to that."', why: 'Spotting implications as facts land shows commercial instinct.' },
  { id: 'c4', stage: 2, situation: 'The prompt was: a UK gym chain, revenue up 5%, profit halved, the CEO wants it fixed within a year. Give your recap.', model: '"So our client is a UK gym chain whose revenue is growing but profit has halved, and success means restoring profit within a year. Did I get that right?"', why: 'Client, problem, measurable goal, then a check. Three sentences at most.' },
  { id: 'c5', stage: 2, situation: 'You’ve recapped and asked your clarifying questions. You need time to think.', model: '"Thank you, that’s useful. May I take a moment to structure my thoughts?"', why: 'Silence is fine once you’ve asked for it.' },
  { id: 'c6', stage: 3, situation: 'A profitability case. Which single question splits the case in two?', model: '"Is this a problem the whole industry is facing, or just our client?"', why: 'Industry-wide points to the market; company-only points to the client’s own revenue or costs.' },
  { id: 'c7', stage: 3, situation: 'The prompt says the client "wants to grow" but gives no number. Ask about the goal.', model: '"Is there a specific growth target, and a timeline attached to it?"', why: 'A quantified goal is what you link every later answer back to.' },
  { id: 'c8', stage: 3, situation: 'You don’t understand how the client earns money (it’s a platform business).', model: '"How does the client actually make money? Is it a commission on each transaction, a subscription, or advertising?"', why: 'The business model decides how you split revenue in your structure.' },
  { id: 'c9', stage: 4, situation: 'You’ve drawn a three-bucket structure for a market entry case. Present it.', model: '"There are three areas I want to look at. First, whether the market is attractive; second, whether we can win against incumbents; third, whether the economics work. I believe the second is the deciding factor because the market is crowded, so I’d start there."', why: 'Top-down, numbered, prioritised, and ending with a hypothesis.' },
  { id: 'c10', stage: 4, situation: 'You finish presenting your structure. What do you NOT say?', model: 'Not: "Where would you like me to start?" Instead: "I believe X is most likely the issue, because... Do we have data on that?"', why: 'Stating a hypothesis shows you’re solving the problem, not just organising it.' },
  { id: 'c11', stage: 5, situation: 'You’ve just answered a question about costs. Keep driving the case.', model: '"So costs explain most of the drop. As a next step I’d like to see revenue by channel, to test whether delivery is adding any profit. Do we have that?"', why: 'Finding, next step, data needed, and why. Every time.' },
  { id: 'c12', stage: 5, situation: 'You’ve covered two of your three buckets. Summarise and steer.', model: '"Let me quickly summarise where we are: we know the market is attractive and our product can compete. The open question is whether the economics work, so I’d like to look at the investment needed."', why: 'Mini-summaries keep the interviewer with you and keep you oriented.' },
  { id: 'c13', stage: 6, situation: 'The interviewer hands you a dense chart.', model: '"Thank you. May I take a moment to process this?" Then read title, axes, units and footnote.', why: 'Thirty seconds of reading prevents the most common chart mistakes.' },
  { id: 'c14', stage: 6, situation: 'You’ve read the chart. Start your answer.', model: '"Two things stand out. First, demand overtakes supply from 2028. Second, the gap reaches 20% by 2030. Given our goal, the second matters more, and I’d like to quantify it for our client."', why: 'Insights with numbers, prioritised, linked to the goal.' },
  { id: 'c15', stage: 6, situation: 'You realise your reading of the chart was wrong.', model: '"I’d like to take a step back and re-examine this. We know A, B and C, and we’re trying to get to X."', why: 'Correcting yourself calmly reads as composure, not failure.' },
  { id: 'c16', stage: 7, situation: 'You’re asked to estimate the profit impact of a new product line. What do you say before any numbers?', model: '"My approach: units sold × contribution per unit, minus the fixed launch cost. Does that make sense before I run the numbers?"', why: 'Agreement on the approach means a small arithmetic slip costs you little.' },
  { id: 'c17', stage: 7, situation: 'You’ve calculated $100M of revenue from 2M units at $50. Finish the calculation properly.', model: '"Quick sanity check: that’s 20% of a $500M market, which seems plausible for a market leader. So about $100M, which would more than meet the client’s target."', why: 'Sanity check, then the so-what for the client.' },
  { id: 'c18', stage: 7, situation: 'A market sizing question: "How many dentists are there in Germany?" Open it.', model: '"Before I size it, my instinct says somewhere in the tens of thousands. Let me test that from the demand side: population, visits per person, and visits a dentist can handle."', why: 'A guess first gives you a sanity check and shows judgement.' },
  { id: 'c19', stage: 8, situation: '"What could the client do to retain customers?" Open your answer.', model: '"Let me think about this in two buckets: things we can do with today’s products and team, and things that need new capabilities. On the first..."', why: 'Buckets first, then ideas, then a priority.' },
  { id: 'c20', stage: 8, situation: 'Add a real-world example to a retention idea.', model: '"Retention offers at contract end work well; it’s what mobile operators do just before customers can switch."', why: 'One real example makes an answer memorable. Use it sparingly.' },
  { id: 'c21', stage: 9, situation: 'The interviewer says: "The CEO walks in. What do you tell her?"', model: '"I recommend X. Two reasons: [reason with a number], and [reason with a number]. The main risk is Y, so as next steps I’d Z."', why: 'Answer first, reasons with numbers, risk, next steps, in about 60 seconds.' },
  { id: 'c22', stage: 9, situation: 'You never got to the cost side of your structure. Where does it go?', model: 'In next steps: "...and I’d also look at the cost side, which we didn’t get to today."', why: 'It shows you tracked the whole problem.' },
  { id: 'c23', stage: 10, situation: 'You’ve just given an answer about falling sales in one region. Add the habit that most separates strong candidates.', model: '"...and this matters because our client’s goal is to get back to £10M profit within two years."', why: 'Linking back to the goal is the most common differentiator in feedback.' },
  { id: 'c24', stage: 10, situation: 'The interviewer mentions the new plant will cost $150M to build. What do you ask about?', model: '"And what would it cost to run each year?" (When you hear capital spending, ask about running costs.)', why: 'Investment cases are decided on both the upfront and the ongoing cost.' },
]

export const stageByN = (n: number) => STAGES_PC.find((s) => s.n === n)!
