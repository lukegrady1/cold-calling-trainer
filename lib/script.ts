import type { Step } from './types';

export const scriptSteps: Step[] = [
  {
    id: 1,
    prospectLine: 'Hello?',
    repPrompt: "Confirm you've got the right person + drop the referral hook.",
    repExample:
      "Hey is this [their name / business name]? Hey what's up [name], my mom's friend Julie Becker referred me to you guys, she said you did super high quality work — the [niche] right?",
    notes:
      "Sound casual, not scripted. The Julie Becker line is a pattern interrupt — don't deliver it like a teleprompter.",
  },
  {
    id: 2,
    prospectLine: "Yeah that's right... wait, who's Julie Becker?",
    repPrompt: "Brush it off naturally — she's your mom's friend, you've never met her.",
    repExample:
      "Oh yeah she's just a friend of my mom's, I've actually never met her — she just gave me a list of people to call.",
    notes: "Don't get flustered. This is a normal, expected question.",
  },
  {
    id: 3,
    prospectLine: "Ok, so what's this about?",
    repPrompt: "Open the conversation about your offer (assume they don't have it).",
    repExample:
      "Sweet, yeah she told me to give you guys a call, said you guys don't have a website or a Google page or anything like that?",
    notes:
      "Either they agree, or they say they have a Google page — then you pivot to 'but you don't have a website right?' Either way, you're in conversation.",
  },
  {
    id: 4,
    prospectLine: "Yeah we don't have a website.",
    repPrompt: 'Make the pitch sound low-pressure and self-deprecating. Ask permission to build something.',
    repExample:
      "Ok cool, well I don't want to waste your time. Hey, I just graduated college and I've been building websites for a little while now — I'm finally making it official and starting my own little website agency. Right now I'm doing it pretty cheap, only $97 a month, just trying to get a few more clients and some testimonials lined up. Do you mind if I build something out for you to take a look at?",
    notes:
      "This framing lowers their guard — you're not 'selling', you're asking for a chance to prove yourself. Recent grad + experienced + cheap-for-testimonials = no threat.",
  },
  {
    id: 5,
    prospectLine: 'Yeah maybe, how much do you usually charge?',
    repPrompt: 'Anchor the price low. Frame it as covering hosting + domain. Offer the call.',
    repExample:
      "So I cover the cost of monthly hosting and the domain. Right now I'm only charging $97 a month to try to get some more clients and testimonials lined up for the future. If you have like 10 minutes today or tomorrow I could walk you through some of the work I've done and give you a little free audit of your business. All I'd need is for you to fill out a basic form with some info about your business.",
    notes:
      "The 'free audit' + 'basic form' framing makes it feel like a no-brainer. Stay consistent on price — $97/month is the anchor.",
  },
  {
    id: 6,
    prospectLine: 'Ok yeah why not, call me back later today or tomorrow.',
    repPrompt: "Don't accept the brush-off. Lock in a specific time on your calendar — give two options.",
    repExample:
      "Sweet! Even better than a call back, let me just schedule into my calendar, give me one sec. How's 2pm today, or I also have 10am open tomorrow — what works better for you?",
    notes: "Two specific times, never 'when are you free'. Reduces decision fatigue.",
  },
  {
    id: 7,
    prospectLine: 'Tomorrow at 10 should work.',
    repPrompt: 'Get commitment to reduce no-shows. Use the zombie apocalypse line or your own version.',
    repExample:
      "Sweet. Besides the off chance there's a zombie apocalypse at 10am tomorrow, any reason you wouldn't show up?",
    notes:
      'The joke gets a laugh AND a commitment. The more commitment you extract, the lower your no-show rate.',
  },
  {
    id: 8,
    prospectLine: 'Haha, should be fine.',
    repPrompt: 'Soft close. Reframe the call as value-for-them, not a sales pitch. Wrap warmly.',
    repExample:
      "Sweet, well at the very least you can learn a little about your business from an advertising perspective and see what some of your competitors are doing. Appreciate your time [name], talk to you tomorrow at 10!",
    notes: 'Last impression matters. Sound like a friend, not a salesperson.',
  },
];
