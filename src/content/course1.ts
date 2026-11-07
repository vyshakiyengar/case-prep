import type { Lesson } from './course'

export const LESSONS_1: Lesson[] = [
  {
    slug: 'how-case-interviews-work',
    title: 'How case interviews work',
    minutes: 8,
    summary: 'What a case interview is, the two formats you will meet, and the six things every interviewer scores.',
    sections: [
      {
        h: 'What you are actually being tested on',
        body: `<p>A case interview is a 25-40 minute conversation about a business problem: <i>profits are falling, should we enter this market, what should we charge</i>. You are not expected to know the answer. You are expected to think like a consultant in front of the interviewer: break the problem into parts, find the part that matters, use numbers to test your ideas, and finish with a clear recommendation.</p>
<p>Interviewers are really asking two questions. <b>Can this person solve the problem?</b> And <b>would I put this person in front of a client?</b> The second question is judged on every sentence you say, which is why this course spends a whole lesson on how you come across.</p>`,
      },
      {
        h: 'The two formats',
        body: `<p><b>Interviewer-led</b> cases (common at McKinsey) move question by question. The interviewer asks for a structure, then a calculation, then a chart reading, then a recommendation. Each question is scored on its own.</p>
<p><b>Candidate-led</b> cases (common at BCG, Bain and most other firms) give you a prompt and expect you to drive. You decide what to look at next and ask for the data you need. Waiting to be told what to do is the most common way to lose these cases.</p>
<p>Prepare for both. The skills are the same; what changes is who holds the steering wheel.</p>`,
      },
      {
        h: 'The six stages interviewers score',
        body: `<p>Almost every firm's scorecard comes down to six things, and the Case Prep OS case log scores you on exactly these:</p>
<ul><li><b>Clarify and recap</b>: did you understand the problem and the goal?</li>
<li><b>Structure and hypothesis</b>: did you break it down sensibly and say where you'd start?</li>
<li><b>Maths and charts</b>: were your numbers right, and did you draw the insight?</li>
<li><b>Case leadership</b>: did you drive the case forward?</li>
<li><b>Recommendation</b>: did you give a clear answer with reasons?</li>
<li><b>Communication</b>: were you clear, calm and easy to follow?</li></ul>`,
      },
    ],
    example: {
      title: 'What a case sounds like in the first two minutes',
      body: `<p><b>Interviewer:</b> "Our client is a regional bakery chain. Sales are flat but profits have fallen by a third. The CEO wants to know why."</p>
<p><b>Strong candidate:</b> "So a regional bakery chain, flat sales, profit down a third, and we need to find out why and presumably fix it. Before I structure, two quick questions: is the goal to get back to the previous profit level, and by when? And is the whole bakery industry seeing this, or just our client?"</p>
<p>Notice what happened: a short recap, a check on the goal, and one question that splits the whole problem in two (industry-wide or company-specific).</p>`,
    },
    takeaways: ['Nobody expects you to know the answer; they want to watch you think.', 'You are judged on solving the case and on how you come across while you do it.', 'Six stages get scored. Practise all six, not just structuring.'],
    quiz: [
      { q: 'In a candidate-led case, what is the most common way to lose points?', options: ['Asking too many clarifying questions', 'Waiting for the interviewer to say what to do next', 'Using a framework you learnt from a book'], answer: 1, why: 'Candidate-led cases reward you for driving. After every answer, say where you want to go next and why.' },
      { q: 'Which question best splits a profitability case in two?', options: ['How many employees does the client have?', 'Is the whole industry affected, or just our client?', 'Who is the CEO?'], answer: 1, why: 'Industry-wide problems point to market causes; company-only problems point to the client’s own revenue or costs.' },
    ],
    practice: { label: 'Try case 1: Coastal Brew', to: '/casebook/coastal-brew' },
  },
  {
    slug: 'the-opening',
    title: 'The opening: listen, recap, clarify',
    minutes: 7,
    summary: 'The first three minutes set the tone. How to take notes, recap without repeating, and ask questions that actually help.',
    sections: [
      {
        h: 'Take notes that you can use',
        body: `<p>Split your page. Write the <b>client's goal at the top</b>, in a box, with any number and deadline attached ("£10M profit in 2 years"). Every answer you give later should connect back to that box. Put facts from the prompt on the left in shorthand, and leave the right side for your structure.</p>
<p>If you don't understand something, say so straight away: "Sorry, when you say margin, do you mean gross margin?" Faking understanding costs far more ten minutes later.</p>`,
      },
      {
        h: 'Recap the problem, not the paragraph',
        body: `<p>A recap shows you listened and lets you check the goal. Keep it to the client, the problem and what success looks like, in about three sentences. Never read the prompt back. Finish with a check: "Did I get that right?"</p>`,
      },
      {
        h: 'Ask at most three questions, and make them count',
        body: `<p>A good clarifying question changes what you draw next. If the answer wouldn't change your structure, don't ask it. The most useful questions are about:</p>
<ul><li><b>The goal</b>: is there a specific target and timeline?</li>
<li><b>The business model</b>: how does the client actually make money?</li>
<li><b>The scope</b>: are we looking only at this option, this country, this product?</li>
<li><b>The market</b>: is the whole industry affected?</li></ul>
<p>Then ask for time: "May I take a minute to structure my thoughts?" Silence while you think is fine once you've asked for it.</p>`,
      },
    ],
    example: {
      title: 'Weak vs strong opening',
      body: `<p><b>Weak:</b> "OK so the client is a telecom company in South-East Asia and they have revenue of $2 billion and it has fallen 6% and costs are flat and..." (reads the whole prompt back, asks five questions about the company's history).</p>
<p><b>Strong:</b> "Our client is a mobile operator whose revenue fell 6% in a year while costs stayed flat, and we need to find out why and what to do. Is the rest of the market also declining? And do we know which part of the business is falling: contracts or pay-as-you-go?"</p>`,
    },
    takeaways: ['Put the goal in a box at the top of your page.', 'Recap in three sentences, then check you have it right.', 'Only ask questions whose answers would change your structure.'],
    quiz: [
      { q: 'Which clarifying question is least useful?', options: ['Is there a profit target, and by when?', 'How many offices does the client have worldwide?', 'Is this happening to competitors too?'], answer: 1, why: 'Unless the case is about offices, it won’t change your structure. The other two shape the whole case.' },
      { q: 'What should a recap include?', options: ['Every number in the prompt', 'The client, the problem and what success looks like', 'Your hypothesis for the answer'], answer: 1, why: 'Keep it short and check the goal. Hypotheses come after your structure.' },
    ],
    practice: { label: 'Practise the opening of case 13: Vertex Mobile', to: '/casebook/vertex-mobile' },
  },
  {
    slug: 'structuring',
    title: 'Structuring: issue trees and hypotheses',
    minutes: 12,
    summary: 'The most heavily weighted skill. How to build a MECE structure for any problem, and why you must say where you would start.',
    sections: [
      {
        h: 'What a structure is for',
        body: `<p>A structure is your plan for solving the case, drawn as an issue tree: the question at the top, 3-4 big areas underneath, and the specific things you'd check under each. It tells the interviewer you have a plan, and it tells <i>you</i> what to look at next when you get lost.</p>`,
      },
      {
        h: 'MECE: no overlaps, no gaps',
        body: `<p>MECE stands for <b>mutually exclusive, collectively exhaustive</b>. In plain words: your buckets shouldn't overlap, and together they should cover everything big. "Revenue" and "costs" are MECE for profit. "Marketing" and "customers" overlap.</p>
<p>Two ways to build MECE buckets:</p>
<ul><li><b>By factors</b>: split the thing into its drivers. Profit = revenue - costs; revenue = volume × price. Best for "why" questions.</li>
<li><b>By steps</b>: a sequence of questions. Is the market attractive? Can we win? Do the economics work? How would we enter? Best for "should we" questions.</li></ul>`,
      },
      {
        h: 'Make it specific to this client',
        body: `<p>The most common feedback interviewers give is "too generic". A structure that would fit any company is a framework recited from a book. Tailor each branch: for a coffee chain, revenue isn't just "volume × price", it's <i>in-store vs delivery orders × average ticket</i>. That one change shows you're thinking about this business.</p>`,
      },
      {
        h: 'Always finish with a hypothesis',
        body: `<p>After presenting your structure, say which branch you think holds the answer and why, then ask for the data to test it: "Revenue is roughly flat, so I suspect a cost has grown. Delivery launched in this period, so I'd start with the cost of delivery orders. Do we have a cost breakdown?" This turns you from someone listing areas into someone solving the problem. Never end with "where would you like me to start?"</p>`,
      },
    ],
    example: {
      title: 'One prompt, two structures',
      body: `<p><b>Prompt:</b> A hotel group is considering launching a budget brand. Should it?</p>
<p><b>Generic:</b> Market / Competition / Customers / Company / Finances (overlapping, could be any company).</p>
<p><b>Tailored</b> (drawn below): each branch is a question about <i>this</i> hotel group. <i>Hypothesis: whether the new brand steals guests from our existing hotels is the deciding factor, because our mid-range hotels sit in the same cities.</i></p>`,
      tree: { root: 'Should we launch a budget hotel brand?', branches: [
        { head: 'Is the market attractive?', items: ['Budget hotel demand in our cities', 'Growth and occupancy', 'Competitors\u2019 prices'] },
        { head: 'Would it steal our guests?', items: ['Overlap with our mid-range hotels', 'Guests lost × their profit'] },
        { head: 'Do the economics work?', items: ['Build or convert cost', 'Room rate and occupancy', 'Breakeven and payback'] },
        { head: 'Can we run it?', items: ['Brand risk', 'Separate operations', 'Sites available'] },
      ] },
    },
    takeaways: ['3-4 buckets, MECE, specific to this client.', 'Factors for "why" questions; steps for "should we" questions.', 'Always end with where you’d start, and why.'],
    quiz: [
      { q: 'Which pair of buckets is MECE for "why did profit fall"?', options: ['Marketing and customers', 'Revenue and costs', 'Competitors and pricing'], answer: 1, why: 'Profit = revenue - costs. Every cause sits in one or the other.' },
      { q: 'What should you say right after presenting your structure?', options: ['"Where would you like me to start?"', 'Which branch you think matters most, and why', 'A summary of the prompt'], answer: 1, why: 'Stating a hypothesis shows you’re solving the problem, not just organising it.' },
      { q: 'A "should we enter this market" question is usually best structured by...', options: ['Factors (drivers)', 'Steps (a sequence of questions)', 'The 4Ps of marketing'], answer: 1, why: 'Attractiveness → can we win → economics → how to enter is a natural sequence.' },
    ],
    practice: { label: 'Run 5 structuring drills', to: '/drills?tab=structure' },
  },
  {
    slug: 'case-maths',
    title: 'Case maths without the panic',
    minutes: 10,
    summary: 'The arithmetic is simple; doing it out loud under pressure is not. Approach first, round smartly, sanity-check everything.',
    sections: [
      {
        h: 'Say the approach before the arithmetic',
        body: `<p>Before you touch a number, say what you're going to calculate and how: "Profit from the new line is units × contribution per unit, minus the fixed launch cost. Does that make sense?" Getting agreement first means a slip in the arithmetic costs you little, because the interviewer can see your logic was right.</p>`,
      },
      {
        h: 'Techniques that make it fast',
        body: `<ul><li><b>Percentages</b>: build from 10% and 1%. 17% of 340 = 34 + 23.8 = 57.8.</li>
<li><b>Big numbers</b>: separate digits from zeros. 3.5M × 240 = 3.5 × 24 = 84, then add zeros → 840M.</li>
<li><b>Division</b>: cancel zeros first. 4.5B ÷ 1.5M = 4,500 ÷ 1.5 = 3,000.</li>
<li><b>Growth</b>: the rule of 72. At 10% a year, something doubles in about 7 years.</li>
<li><b>Rounding</b>: round to make the maths easy, but say so, and don't round away the answer (5.5B is not 5B).</li></ul>`,
      },
      {
        h: 'Talk while you calculate, then sanity-check',
        body: `<p>Calculate out loud so the interviewer can follow, and catch slips together. After every result, check the size makes sense: "So about £1.5M a year. That's roughly 15% of their profit, which sounds plausible for a price change." Finally, say what the number means for the client. A number without a so-what is half an answer.</p>`,
      },
      {
        h: 'Formulas you must know cold',
        body: `<p>Profit, margin vs markup, contribution margin, breakeven volume, payback, ROI, CAGR and a simple perpetuity value come up again and again. The Frameworks section has all 20 with a test-yourself mode.</p>`,
      },
    ],
    example: {
      title: 'A breakeven question, done well',
      body: `<p><b>Question:</b> A snack company spends $12M to launch a bar that sells for $1.50 with a variable cost of $0.70. How many bars does it need to sell to break even?</p>
<p><b>Answer:</b> "Breakeven is fixed cost divided by contribution per unit. Contribution is $1.50 minus $0.70, so 80 cents. $12M ÷ 0.8 = 15M bars. Sanity check: 15M bars × 80 cents = $12M. ✓ So they need about 15M bars in year one. Next I'd want to know if that's realistic given the market size."</p>`,
    },
    takeaways: ['State the formula and get agreement before calculating.', 'Talk while you work; sanity-check the size of every answer.', 'Finish every calculation with what it means for the client.'],
    quiz: [
      { q: 'What is 15% of 480?', options: ['62', '72', '82'], answer: 1, why: '10% = 48, 5% = 24, total 72.' },
      { q: 'Fixed costs $3M, price $25, variable cost $10. Breakeven volume?', options: ['120,000', '200,000', '300,000'], answer: 1, why: 'Contribution = $15. $3M ÷ $15 = 200,000 units.' },
      { q: 'Cost $80, price $100. Which is true?', options: ['Margin 25%, markup 20%', 'Margin 20%, markup 25%', 'Both 20%'], answer: 1, why: 'Margin is on price (20/100); markup is on cost (20/80).' },
    ],
    practice: { label: 'Do a 10-question maths round', to: '/drills?tab=maths' },
  },
  {
    slug: 'charts-and-exhibits',
    title: 'Reading charts and exhibits',
    minutes: 8,
    summary: 'Exhibits are where cases are won or lost. A five-step routine for turning any chart into an insight.',
    sections: [
      {
        h: 'Ask for a moment, then read in order',
        body: `<p>When you're handed a chart, say "May I take a moment?" and then read it in this order: <b>title</b>, <b>axes and units</b>, <b>legend</b>, and the <b>footnote</b>. Footnotes hide the answer surprisingly often: "excludes our new stores", "values in real terms".</p>`,
      },
      {
        h: 'Insight, not description',
        body: `<p>Weak candidates describe: "This shows supply and demand from 2026 to 2030." Strong candidates find what matters: "Demand overtakes supply from 2028, and by 2030 there's a 20% shortfall." Look for the biggest number, the biggest change, the crossing point, or the outlier.</p>`,
      },
      {
        h: 'Do the maths unprompted, and link back',
        body: `<p>If a number on the chart can be turned into something more useful (a percentage, a gap, a growth rate), do it without being asked. Then connect it to the goal in the box at the top of your page: "...which matters because our client legally needs 120,000 tonnes by 2030." Finish with where you'd go next.</p>`,
      },
    ],
    example: {
      title: 'The five-step routine in one answer',
      body: `<p>"This shows bed occupancy for each of the client's 12 hospitals (1, read). Most sit between 60% and 78%, but three newer hospitals are around 40% (2, find the outlier). Those three drag the average down to 62% against a 75% benchmark (3, quantify). That matters because filling empty beds is the cheapest way to grow (4, link to goal). I'd like to understand why those three are empty: is it doctors or referrals? (5, next step)"</p>`,
    },
    takeaways: ['Title, axes, legend, footnote, every time.', 'Lead with the insight, not a description.', 'Quantify it, link it to the goal, say where you’d go next.'],
    quiz: [
      { q: 'What should you read before drawing any conclusion from a chart?', options: ['Only the biggest bar', 'Title, axes, units, legend and footnote', 'Nothing: speed matters most'], answer: 1, why: 'Units and footnotes change the meaning of a chart more often than you’d think.' },
      { q: 'Which is an insight rather than a description?', options: ['"The chart shows sales by region."', '"Sales fell in every region."', '"Two-thirds of the drop comes from one region, the North."'], answer: 2, why: 'It locates the problem and tells you where to dig next.' },
    ],
    practice: { label: 'Practise in the graph library', to: '/graphs' },
  },
]
