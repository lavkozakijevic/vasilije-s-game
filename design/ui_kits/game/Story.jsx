// Story layer for "The Rescue of Baba Vera": intro cutscene, dialogue boxes and Baba's notes.
// Stand-in art (portraits, figures, scenes) is drawn in code from the 16-colour palette until the
// Claude Design story art arrives. Real files replace their stand-ins automatically when present:
//   assets/ui/portraits/portrait_<who>_<mood>.png          (64x64)
//   assets/cutscenes/intro/intro_0N_bg.png (+ _chars, _fx)  (640x360 layers)
// Script text comes from design/story/rescue-of-baba-vera.md.
const EHS_A = '../../../assets/';
const PAL = { ink: '#0d0b14', plum: '#2a2233', slate: '#4a3f55', stone: '#8a7f8e', bone: '#e8e0d0', pine: '#1d3b2e', moss: '#2f6b3a', leaf: '#6fae3e',
  bark: '#5a3a24', amber: '#a8703c', ember: '#8e1f1f', flame: '#e0521f', gold: '#ffc23d', tide: '#2e5fa8', frost: '#7fd4e8', void: '#6b3fa0' };

// ---------------------------------------------------------------- cast
const CAST = {
  kosta:     { name: 'Kosta',     hair: PAL.bark,  hairLo: PAL.plum,  shirt: PAL.stone, shirtLo: PAL.slate, legs: PAL.slate, gem: PAL.gold,  h: 22, style: 'short', sleeves: 'long',  pants: 'long' },
  katarina:  { name: 'Katarina',  hair: PAL.gold,  hairLo: PAL.amber, shirt: PAL.frost, shirtLo: PAL.tide,  legs: PAL.slate, gem: PAL.flame, h: 20, style: 'long',  sleeves: 'short', pants: 'long' },
  vasilije:  { name: 'Vasilije',  hair: PAL.amber, hairLo: PAL.bark,  shirt: PAL.flame, shirtLo: PAL.ember, legs: PAL.plum,  gem: PAL.frost, h: 18, style: 'messy', sleeves: 'short', pants: 'long' },
  dimitrije: { name: 'Dimitrije', hair: PAL.bone,  hairLo: PAL.gold,  shirt: PAL.leaf,  shirtLo: PAL.moss,  legs: PAL.slate, gem: PAL.leaf,  h: 16, style: 'short', sleeves: 'short', pants: 'shorts' },
};
const KIDS = ['kosta', 'katarina', 'vasilije', 'dimitrije'];
const SPEAKER = { ...Object.fromEntries(KIDS.map(k => [k, CAST[k].name])), baba: 'Baba Vera', mrak: 'Mrak', elder: 'Elder Rotroot', blightwarden: 'Blightwarden', yeti: 'Yeti Cub', warden: 'Frost Warden', salamander: 'Lava Salamander', colossus: 'Magma Colossus', umbra_sb: 'Umbra', ruby: 'Rubi', marija: 'Grandma Marija', mishika: 'Mishika', boys: 'Kosta, Vasilije & Dimitrije', ...{ cinder: 'Cinder', brine: 'Brine', basalt: 'Basalt', wisp: 'Wisp', rime: 'Rime', jolt: 'Jolt', umbra: 'Umbra', aurel: 'Aurel' }, all: 'Everyone', kosta_vasilije: 'Kosta & Vasilije' };
// sprite-based portraits for characters that already have art
// Claude Design portrait files: portrait_<file>_<mood>.png (64x64); moods fall back to neutral (or the speaker's default)
const PORTRAIT_FILE = { kosta: 'konstantin', katarina: 'katarina', vasilije: 'vasilije', dimitrije: 'dimitrije', baba: 'baba_vera', mrak: 'mrak', yeti: 'yeti_cub', warden: 'frost_warden', salamander: 'salamander', colossus: 'magma_colossus', umbra_sb: 'umbra', ruby: 'ruby', marija: 'marija', mishika: 'mishika',
  cinder: 'knight_fire', brine: 'knight_water', basalt: 'knight_earth', wisp: 'knight_air', rime: 'knight_ice', jolt: 'knight_lightning', umbra: 'knight_shadow', aurel: 'knight_light' };
// PORTRAIT_SKIP can stand a mood in for one that needs redrawing, e.g. { 'vasilije|ali': 'neutral' }
const PORTRAIT_MOOD = { ali: 'ali_vera' }, PORTRAIT_SKIP = {}, PORTRAIT_DEFAULT = { baba: 'warm', mrak: 'menacing', umbra_sb: 'spellbound' };
const SPRITE_PORTRAIT = {
  elder:        { src: 'sprites/bosses/forest/elder_rotroot/boss_rotroot_idle.png', crop: [6, 2, 52, 52] },
  blightwarden: { src: 'sprites/bosses/forest/blightwarden/boss_blightwarden_idle.png', crop: [18, 4, 64, 64] },
};

// ---------------------------------------------------------------- script
const EH_DIALOGUE = {
  l1_start: [
    { who: 'kosta', text: 'Right. Everyone stay behind me.' },
    { who: 'vasilije', mood: 'ali', text: "Why you? I'm way faster." },
    { who: 'kosta', text: "Because I'm the oldest." },
    { who: 'vasilije', mood: 'ali', text: "That's not even a rule!" },
    { who: 'katarina', mood: 'ali', text: 'Baba said no arguing. It was literally the last thing she wrote.' },
    { who: 'dimitrije', text: "Then I'll lead." },
    { who: 'kosta_vasilije', mood: 'ali', text: 'YOU?' },
    { who: 'dimitrije', text: 'Baba said find her, not argue. You two are arguing. So I’ll take us through the forest.' },
    { who: 'dimitrije', mood: 'happy', text: 'You can keep arguing behind me.' },
    { who: 'katarina', mood: 'happy', text: "…Honestly? He's got a point." },
  ],
  l1_puppy: [
    { who: 'dimitrije', mood: 'happy', text: "Hey, buddy. You're guarding Baba's yarn?" },
    { who: 'katarina', mood: 'happy', text: "He's following her scent. A dog's nose is about ten thousand times better than ours." },
    { who: 'dimitrije', mood: 'happy', text: "Then he's coming with me." },
  ],
  l1_knight_air: [
    { who: 'wisp', text: 'The wind remembers you, little one. I am Wisp. Your stone woke me.' },
    { who: 'dimitrije', mood: 'happy', text: 'Cool! Want to help us find Baba?' },
    { who: 'wisp', text: 'Lead on. I will follow your wind.' },
  ],
  l1_knight_earth: [
    { who: 'basalt', text: "Hmph. Rocks don't hurry." },
    { who: 'basalt', text: "…But I'll come." },
    { who: 'katarina', mood: 'happy', text: 'Basalt is volcanic rock. It cools down really fast, you know.' },
    { who: 'basalt', text: '…She is correct.' },
  ],
  l1_finish: [
    { who: 'katarina', text: "It's almost down! Mita, this one's yours!" },
    { who: 'kosta', mood: 'happy', text: 'Go on, Mita. Finish it!' },
  ],
  l1_elder: [
    { who: 'elder', text: 'ROOTS CRUSH SMALL FEET!' },
    { who: 'dimitrije', text: 'My feet are small. They’re also fast.' },
    { who: 'vasilije', mood: 'happy', text: 'Get him, Mita!' },
  ],
  l1_blight: [
    { who: 'vasilije', mood: 'ali', text: 'My legs are dead. How are you not tired?' },
    { who: 'dimitrije', mood: 'happy', text: 'Football. Every day.' },
    { who: 'katarina', mood: 'ali', text: "I'm not tired. I'm just hungry." },
    { who: 'kosta', mood: 'happy', text: "You're always hungry." },
    { who: 'katarina', text: 'Exactly. So let’s find Baba. She has the cookies.' },
    { who: 'kosta', mood: 'happy', text: 'You were right back there, Mita. Lead the way.' },
    { who: 'dimitrije', mood: 'okej', text: 'Okej.' },
    { who: 'blightwarden', text: "The old woman is gone, little ones. Mrak's shadow-birds carried her over the mountains." },
    { who: 'katarina', text: 'Over the mountains… that’s where it snows.' },
  ],
  // ---- Level 2 · The Frostfang Peaks (Katarina)
  l2_start: [
    { who: 'vasilije', mood: 'ali', text: "It's FREEZING." },
    { who: 'katarina', text: 'Told you. Socks.' },
    { who: 'vasilije', mood: 'ali', text: 'Easy for you. Your stone is fire. Mine is ICE. Up here!' },
    { who: 'katarina', mood: 'happy', text: "Wait till the caves. You'll love yours down there." },
    { who: 'kosta', mood: 'happy', text: 'Katarina, you know the most about mountains. You lead this one.' },
    { who: 'vasilije', text: "Fine. But I'm second." },
    { who: 'katarina', mood: 'happy', text: 'Deal. And careful on the shiny ice. You slide.' },
    { who: 'dimitrije', mood: 'okej', text: 'Okej.' },
  ],
  l2_cheetah: [
    { who: 'katarina', mood: 'ali', text: 'A cheetah? Up HERE? You must be freezing.' },
    { who: 'vasilije', mood: 'ali', text: 'Is it going to eat us?' },
    { who: 'katarina', mood: 'happy', text: "Cheetahs almost never attack people. They can't even roar. They chirp, like birds." },
    { who: 'katarina', mood: 'happy', text: '(she puts the warm socks on its front paws) Here. Baba’s orders.' },
    { who: 'dimitrije', mood: 'happy', text: 'Told you I packed extra.' },
    { who: 'kosta', text: 'How do you know everything?' },
    { who: 'katarina', text: 'I read.' },
    { who: 'katarina', mood: 'ali', text: "Cheetahs only eat every few days. I can't even go an hour. I'm hungry." },
  ],
  l2_knight_ice: [
    { who: 'rime', text: 'Ice keeps what it loves. I will keep you safe.' },
    { who: 'katarina', mood: 'happy', text: 'Rime! Did you know every snowflake has six sides?' },
    { who: 'rime', text: '…I did not. Now I do.' },
  ],
  l2_knight_water: [
    { who: 'brine', text: 'Where ice melts, water follows.' },
    { who: 'vasilije', mood: 'happy', text: 'Another one for the team!' },
    { who: 'kosta', mood: 'happy', text: 'Welcome, Brine.' },
  ],
  l2_yeti: [
    { who: 'yeti', text: 'GRRR! MY BRIDGE! GO AWAY!' },
    { who: 'vasilije', mood: 'ali', text: 'Charge!' },
    { who: 'katarina', text: "Wait! He's only a cub. He's not mean, he's scared." },
    { who: 'katarina', text: "Tire him out and he'll let us cross. Watch out for the snowballs!" },
    { who: 'kosta', text: 'You heard her. Careful, everyone.' },
  ],
  l2_yeti_bye: [
    { who: 'yeti', mood: 'sad', text: '…Fine. You can cross.' },
    { who: 'yeti', mood: 'sad', text: 'Nobody ever comes up here to play with me.' },
    { who: 'dimitrije', mood: 'happy', text: "We'll come back and play. Promise." },
    { who: 'vasilije', mood: 'happy', text: 'Okay, stopping to think first was actually smart.' },
  ],
  l2_warden: [
    { who: 'warden', text: 'Turn back, little ones, or freeze where you stand.' },
    { who: 'katarina', text: '(flipping through her sketchbook) Wait. I drew him earlier. See the crack in his chest? That’s the weak spot!' },
    { who: 'kosta', mood: 'happy', text: 'Hit the crack when it glows! Fire melts ice, Katarina!' },
    { who: 'vasilije', mood: 'happy', text: 'You heard her!' },
  ],
  l2_finish: [
    { who: 'kosta', text: "It's cracking! Katarina, this one's yours!" },
    { who: 'vasilije', mood: 'happy', text: 'Go on, Katarina!' },
  ],
  // ---- Level 3 · Cinderdeep Caves (Vasilije)
  l3_start: [
    { who: 'vasilije', mood: 'happy', text: 'Captain Vasilije, going in!' },
    { who: 'kosta', mood: 'ali', text: 'Nobody voted for you!' },
    { who: 'vasilije', mood: 'happy', text: "And now I've got ICE. In a lava cave. Perfect." },
    { who: 'dimitrije', mood: 'okej', text: 'Okej.' },
  ],
  l3_fox: [
    { who: 'vasilije', mood: 'happy', text: "An ORANGE fox. That's MY fox." },
    { who: 'katarina', text: 'Red foxes are actually orange, you know.' },
    { who: 'vasilije', mood: 'happy', text: 'Best colour.' },
    { who: 'katarina', mood: 'ali', text: "It's so hot down here. Like an oven. …Now I'm thinking about cookies. I'm hungry." },
  ],
  l3_lava: [
    { who: 'katarina', mood: 'ali', text: 'Lava! Nobody can cross that.' },
    { who: 'vasilije', mood: 'happy', text: 'Nobody? Watch this. Ice freezes lava!' },
    { who: 'kosta', text: 'Shoot across the lava, Vasilije. Then run over it before it melts!' },
  ],
  l3_knight_fire: [
    { who: 'cinder', text: 'Your fire is young, but it burns true.' },
    { who: 'katarina', mood: 'happy', text: 'Thanks! Can you teach me to make it bigger?' },
    { who: 'cinder', text: 'Patience, little flame.' },
  ],
  l3_knight_lightning: [
    { who: 'jolt', text: 'Finally, some SPEED around here!' },
    { who: 'vasilije', mood: 'happy', text: 'Finally, someone gets it!' },
  ],
  l3_trap: [
    { who: 'vasilije', mood: 'ali', text: '…Guys? GUYS?' },
    { who: 'vasilije', mood: 'ali', text: "The lava's rising! I have to climb. Alone." },
  ],
  l3_trap_after: [
    { who: 'kosta', mood: 'happy', text: 'Need a hand?' },
    { who: 'vasilije', text: '…Maybe we need everybody.' },
    { who: 'kosta', text: 'Maybe.' },
    { who: 'katarina', mood: 'happy', text: 'Your fox ran all the way back to get us. Smart fox.' },
  ],
  l3_salamander: [
    { who: 'salamander', text: 'Hsss… who is splashing in MY lava?' },
    { who: 'vasilije', text: "Sorry! We're just passing through!" },
    { who: 'katarina', text: "It's not mean, it's sleepy. Hit it when it comes up, and dodge the fireballs!" },
  ],
  l3_salamander_bye: [
    { who: 'salamander', mood: 'sleepy', text: 'Yaaawn… fine… go… I need a nap…' },
    { who: 'dimitrije', mood: 'happy', text: 'Sweet dreams!' },
  ],
  l3_colossus: [
    { who: 'colossus', text: "The Keeper warms Mrak's halls now. You're too late." },
    { who: 'vasilije', text: "Not while I've got ice. Everyone, together!" },
    { who: 'kosta', mood: 'happy', text: 'Hit the glowing core, Vasilije!' },
  ],
  l3_finish: [
    { who: 'kosta', text: "It's cooling down! Vasilije, this one's yours!" },
    { who: 'vasilije', mood: 'happy', text: "That's for Baba!" },
  ],
  // ---- Level 4 · The Hollow Keep (Kosta)
  l4_start: [
    { who: 'katarina', mood: 'happy', text: 'A golden eagle! Their wingspan is over two metres!' },
    { who: 'kosta', text: 'Hold on, everyone.' },
    { who: 'katarina', mood: 'happy', text: "When we get Baba back, I'm eating ALL the cookies." },
    { who: 'boys', mood: 'ali', text: 'Ali Katarina!' },
  ],
  l4_bridge: [
    { who: 'dimitrije', text: 'The bridge is made of shadow. We fall right through it!' },
    { who: 'katarina', text: 'Shadow runs from light. Kosta, shine on it!' },
    { who: 'kosta', mood: 'happy', text: 'Stay close. Walk where my light goes.' },
  ],
  l4_knight_light: [
    { who: 'aurel', text: 'Light finds the lost. Lead on, Konstantin.' },
    { who: 'kosta', mood: 'happy', text: "Thanks. But I'm not leading alone." },
  ],
  l4_umbra: [
    { who: 'umbra_sb', text: 'Turn back. The Hollow King keeps what he takes.' },
    { who: 'vasilije', mood: 'ali', text: "That's a Hearth Knight! Why is he fighting us?" },
    { who: 'katarina', text: "Look at his eyes. It's a spell. Kosta, your light can break it!" },
  ],
  l4_knight_shadow: [
    { who: 'umbra', text: "I guarded Mrak's dark too long. Let me help you end it." },
    { who: 'dimitrije', mood: 'okej', text: 'Okej. Welcome, Umbra.' },
  ],
  l4_mrak: [
    { who: 'mrak', text: 'Welcome to the Hollow Keep. So cold. So quiet. Finally, someone to keep.' },
    { who: 'kosta', text: "We're here for our Baba." },
  ],
  l4_together: [
    { who: 'mrak', mood: 'laughing', text: 'My wardens fell? Then I wore their power myself! Four little children. What can you do?' },
    { who: 'vasilije', mood: 'ali', text: 'Kosta, let me lead this bit!' },
    { who: 'kosta', mood: 'ali', text: 'No, I should, it’s my level!' },
    { who: 'mrak', mood: 'laughing', text: 'Ha! Ha! Ha!' },
    { who: 'kosta', text: "Wait. We don't need a captain. We never did." },
    { who: 'kosta', mood: 'happy', text: 'Lead it with me? All four stones. Everyone hits him once!' },
    { who: 'vasilije', mood: 'happy', text: '…Together. On three!' },
    { who: 'katarina', mood: 'happy', text: 'One!' },
    { who: 'dimitrije', mood: 'happy', text: 'Two!' },
    { who: 'all', mood: 'happy', text: 'THREE!' },
  ],
  l4_finish: [
    { who: 'vasilije', mood: 'happy', text: 'Kosta, finish it! Together!' },
  ],
  // ---- Level 5 · The Big Tidy-Up (spring in Ivanovo)
  l5_start: [
    { who: 'ruby', text: 'One minute! Look everywhere: on the TV, on the chandeliers, under the beds, inside the cupboards!' },
  ],
  l5_win: [
    { who: 'marija', mood: 'proud', text: "Well, well… I can't believe it. You've grown so much, and you tidied up all the toys on your own!" },
    { who: 'ruby', mood: 'happy', text: 'Wow, fantastic! Kids, I knew I could count on you.' },
    { who: 'ruby', mood: 'happy', text: 'So now you can count on me!' },
  ],
  // ---- Level 6 · Mishika in the Attic (only Mita)
  l6_start: [
    { who: 'marija', mood: 'grumpy', text: 'Mishika? Mishika! Where is my little cat?' },
    { who: 'ruby', mood: 'worried', text: 'I heard something in the attic. She must be hiding up there with the old boxes.' },
    { who: 'ruby', text: 'Mita, you are the best climber. Go up and find her, quickly: you have ninety seconds!' },
    { who: 'ruby', mood: 'worried', text: 'And watch out for the rats!' },
    { who: 'dimitrije', mood: 'okej', text: 'Okej.' },
  ],
  l6_found: [
    { who: 'mishika', mood: 'happy', text: 'Mrrreow!' },
    { who: 'dimitrije', mood: 'happy', text: 'Got you! Now hold on tight. Back to the hatch!' },
    { who: 'ruby', text: 'Ninety seconds to bring her down, Mita!' },
  ],
  l6_win: [
    { who: 'marija', mood: 'happy', text: 'Mishika! My little one! Come here.' },
    { who: 'marija', mood: 'happy', text: 'Thank you, Mita. You climbed all the way up there for her. You are my hero.' },
    { who: 'mishika', mood: 'happy', text: 'Prrrr…' },
    { who: 'dimitrije', mood: 'okej', text: 'Okej.' },
  ],
  l6_lost: [
    { who: 'ruby', mood: 'sad', text: 'Oh no, time is up! Too bad. Try again!' },
  ],
  l4_free: [
    { who: 'baba', mood: 'warm', text: 'My brave ones! You came all this way.' },
    { who: 'kosta', mood: 'happy', text: 'All four of us, Baba. Together.' },
    { who: 'baba', mood: 'warm', text: 'Of course together. Now, where is that shadow?' },
  ],
};
const EH_NOTES = {
  l1: {
    item: 'knitting needles, stuck in a tree', itemImg: 'sprites/items/item_baba_knitting_needles.png',
    lines: ['Dimitrije, well done, my fast boy.', 'Katarina, it is cold where they are taking me.', 'Put on your socks. The warm ones.'],
    replies: [
      { who: 'katarina', mood: 'ali', text: 'Ali Vera! The warm ones are so itchy…' },
      { who: 'dimitrije', mood: 'happy', text: 'I packed extra soft ones. Here.' },
      { who: 'vasilije', mood: 'happy', text: 'Mita, you were right. We were arguing and you just… went.' },
      { who: 'kosta', mood: 'happy', text: 'Yeah. Less arguing, more going. Good leading, Mita.' },
      { who: 'dimitrije', mood: 'happy', text: 'Thanks. Now let’s go get Baba.' },
    ],
  },
};
EH_NOTES.l2 = {
  item: 'her red scarf, on the ice', itemImg: 'sprites/items/item_baba_red_scarf.png',
  lines: ['Katarina, you are so clever.', 'Vasilije, the next place is hot.', 'Wash your hands after you touch anything down there.', 'And do NOT run in first.'],
  replies: [
    { who: 'kosta', mood: 'happy', text: 'Katarina, you stopped and looked. We would have just kept hitting him.' },
    { who: 'vasilije', mood: 'happy', text: 'And the yeti. I wanted to charge. You were right.' },
    { who: 'katarina', mood: 'happy', text: "Thanks. I'm still hungry, though." },
    { who: 'dimitrije', mood: 'happy', text: 'I saved one cookie. We can share it.' },
    { who: 'vasilije', mood: 'ali', text: 'Ali Vera! A hot place? I’m going first!' },
    { who: 'kosta', mood: 'ali', text: 'Vasilije! She said do NOT run in first!' },
  ],
};
EH_NOTES.l3 = {
  item: 'the family photo, all four of you in it', itemImg: 'sprites/items/item_baba_family_photo.png',
  lines: ['Vasilije, I am proud of you.', 'Kosta, it is dark where I am now. You will know what to do.', 'Make your bed before you come.', 'And you two, stop fighting over who is captain.'],
  replies: [
    { who: 'kosta', mood: 'ali', text: 'Ali Vera…' },
    { who: 'vasilije', text: "…Maybe we don't need a captain. Whoever's level it is, leads." },
    { who: 'kosta', mood: 'happy', text: "Deal. And the next one's mine." },
    { who: 'vasilije', mood: 'happy', text: "I know. I've got your back." },
  ],
};
const INTRO_NOTE = ['Mrak has taken me. Don’t be scared.', 'Each stone holds an element. It will give you the power to fight the monsters ahead.', 'Follow my red yarn and bring me home before midnight.',
  'Share the cookies. Put on your socks.', 'No fighting over who is captain. Kosta, Vasilije, I mean you.'];
// scene: duration (s) and timed lines { at, who, mood, text } ; who null = narration caption
const INTRO = [
  { d: 6,  lines: [{ at: 1.0, who: null, text: "New Year's Eve in Ivanovo." }] },
  { d: 9,  lines: [{ at: 0.6, who: 'katarina', mood: 'happy', text: "Baba, can I have a cookie? I'm SO hungry." }, { at: 2.6, who: 'baba', mood: 'stern', text: 'Wash your hands before you eat!' },
                   { at: 4.8, who: 'all', text: 'Ali Veraaa!' }, { at: 6.8, who: 'dimitrije', mood: 'happy', text: 'Already did.' }] },
  { d: 8,  lines: [{ at: 0.8, who: 'baba', mood: 'stern', text: 'And pick up your toys. All of them.' }, { at: 3.2, who: 'vasilije', mood: 'ali', text: "They're Kosta's toys!" }, { at: 5.4, who: 'kosta', mood: 'ali', text: 'Half of them are YOURS.' }] },
  { d: 7,  lines: [] },
  { d: 5,  lines: [{ at: 2.2, who: 'baba', mood: 'worried', text: 'Children—!' }] },
  { d: 9,  lines: [{ at: 2.0, who: null, text: 'The chair was empty. Baba Vera was gone.' }] },
  { d: 13, lines: [], note: 1.5 },
  { d: 12, lines: [{ at: 0.6, who: 'dimitrije', mood: 'happy', text: 'Mine is green. It feels like wind.' }, { at: 2.4, who: 'katarina', text: 'Each stone is an element. Ice, fire, wind, light. That’s our power.' },
                   { at: 5.0, who: 'kosta', text: "Okay. I'm the oldest, so I lead." }, { at: 6.8, who: 'vasilije', mood: 'ali', text: "No way. I'm faster, so I lead." },
                   { at: 8.6, who: 'katarina', mood: 'ali', text: 'She JUST said no fighting!' }, { at: 10.4, who: 'dimitrije', text: '…I’ll go first, then.' }] },
  { d: 7,  lines: [], title: 3.0 },
];

// ---------------------------------------------------------------- pixel helpers
function ehCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
// 1-art-pixel ink outline around everything opaque, per the pack's art rules
function ehOutline(c) {
  const g = c.getContext('2d'), w = c.width, h = c.height, d = g.getImageData(0, 0, w, h), s = d.data, o = new Uint8ClampedArray(s), op = i => s[i * 4 + 3] > 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (op(i)) continue;
    if ((x > 0 && op(i - 1)) || (x < w - 1 && op(i + 1)) || (y > 0 && op(i - w)) || (y < h - 1 && op(i + w))) { o[i * 4] = 13; o[i * 4 + 1] = 11; o[i * 4 + 2] = 20; o[i * 4 + 3] = 255; } }
  d.data.set(o); g.putImageData(d, 0, 0); return c;
}
const ehCache = {};
const SK = PAL.bone, SKD = PAL.amber;

// full-body stand-in figure (12 wide, height by age), frame 0 = stand, 1/2 = run
function ehKidFigure(who, frame = 0) {
  const key = `fig_${who}_${frame}`; if (ehCache[key]) return ehCache[key];
  const k = CAST[who], H = k.h, c = ehCanvas(14, H + 3), g = c.getContext('2d'), r = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x + 1, y + 2, w, h); };
  if (k.style === 'long') r(k.hair, 2, 1, 8, 9);
  r(SK, 3, 2, 6, 5); r(SKD, 8, 3, 1, 3);
  r(k.hair, 2, 0, 8, 2); r(k.hairLo, 6, 1, 4, 1);
  if (k.style === 'messy') { r(k.hair, 3, -1); r(k.hair, 6, -1); r(k.hair, 9, -1); }
  if (k.style !== 'long') { r(k.hair, 2, 2, 1, 2); r(k.hair, 9, 2, 1, 1); }
  r(PAL.ink, 4, 4); r(PAL.ink, 7, 4);
  const sh = Math.round((H - 7) * 0.5), y0 = 7 + sh, lh = H - y0;
  r(k.shirt, 2, 7, 8, sh); r(k.shirtLo, 2, 7 + sh - 1, 8, 1);
  if (k.sleeves === 'long') { r(k.shirt, 1, 8, 1, sh - 1); r(k.shirt, 10, 8, 1, sh - 1); r(SK, 1, 7 + sh, 1, 1); r(SK, 10, 7 + sh, 1, 1); }
  else { r(k.shirt, 1, 8, 1, 2); r(k.shirt, 10, 8, 1, 2); r(SK, 1, 10, 1, sh - 2); r(SK, 10, 10, 1, sh - 2); }
  r(k.gem, 5, 8, 2, 1);
  const lx = frame === 1 ? [2, 7] : frame === 2 ? [4, 6] : [3, 7];
  for (const x of lx) {
    if (k.pants === 'shorts') { r(k.legs, x, y0, 2, 2); r(SK, x, y0 + 2, 2, lh - 3); } else r(k.legs, x, y0, 2, lh - 1);
    r(PAL.ink, x, H - 1, 2, 1);
  }
  return (ehCache[key] = ehOutline(c));
}
function ehBabaFigure(frame = 0) {
  const key = `fig_baba_${frame}`; if (ehCache[key]) return ehCache[key];
  const c = ehCanvas(16, 25), g = c.getContext('2d'), r = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x + 1, y + 2, w, h); };
  r(PAL.stone, 5, 0, 4, 2); r(PAL.stone, 3, 2, 8, 2);
  r(SK, 4, 3, 6, 5); r(SKD, 9, 4, 1, 3); r(PAL.stone, 3, 3, 1, 2); r(PAL.stone, 10, 3, 1, 2);
  r(PAL.ink, 4, 5, 2, 1); r(PAL.ink, 8, 5, 2, 1); r(PAL.ink, 6, 5, 2, 1);
  r(PAL.ember, 3, 8, 8, 2); r(PAL.flame, 3, 8, 8, 1); r(PAL.ember, 9, 10, 2, 3);
  r(PAL.tide, 2, 10, 10, 10); r(PAL.bone, 4, 11, 6, 9);
  const arm = frame === 1 ? -3 : 0; r(PAL.tide, 1, 11 + (arm ? -2 : 0), 1, 4); r(SK, 1, 15 + arm, 1, 1); r(PAL.tide, 12, 11, 1, 4); r(SK, 12, 15, 1, 1);
  r(PAL.ink, 4, 20, 2, 1); r(PAL.ink, 8, 20, 2, 1);
  return (ehCache[key] = ehOutline(c));
}
// 32x32 stand-in portrait (+1px outline border)
function ehPortrait(who, mood = 'neutral') {
  const key = `por_${who}_${mood}`; if (ehCache[key]) return ehCache[key];
  const c = ehCanvas(34, 34), g = c.getContext('2d'), r = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(x + 1, y + 1, w, h); };
  const eyes = (m, browCol) => {
    if (m === 'happy') { for (const x of [12, 18]) { r(PAL.ink, x, 13, 2, 1); r(PAL.ink, x - 1, 14); r(PAL.ink, x + 2, 14); } }
    else if (m === 'ali') { r(PAL.ink, 12, 12, 2, 1); r(PAL.ink, 18, 12, 2, 1); r(browCol, 11, 10, 4, 1); r(browCol, 17, 10, 4, 1); }
    else if (m === 'okej') { r(PAL.ink, 12, 14, 2, 1); r(PAL.ink, 18, 14, 2, 1); }
    else if (m === 'stern') { r(PAL.ink, 12, 13, 2, 2); r(PAL.ink, 18, 13, 2, 2); r(browCol, 11, 11, 4, 1); r(browCol, 17, 11, 4, 1); r(browCol, 14, 12); r(browCol, 17, 12); }
    else { r(PAL.ink, 12, 13, 2, 3); r(PAL.ink, 18, 13, 2, 3); }
  };
  const mouth = m => {
    if (m === 'happy' || m === 'warm') { r(PAL.ink, 13, 18); r(PAL.ink, 14, 19, 4, 1); r(PAL.ink, 18, 18); }
    else if (m === 'ali' || m === 'worried') { r(PAL.ink, 14, 18, 4, 1); r(PAL.ember, 14, 19, 4, 2); r(PAL.ink, 14, 21, 4, 1); }
    else if (m === 'okej') { r(PAL.ink, 15, 19, 3, 1); r(PAL.ink, 18, 18); }
    else r(PAL.ink, 14, 19, 4, 1);
  };
  const face = () => { r(SK, 9, 7, 14, 15); r(SK, 10, 22, 12, 1); r(SKD, 21, 9, 2, 12); };
  if (CAST[who]) {
    const k = CAST[who];
    r(k.shirt, 5, 25, 22, 7); r(k.shirtLo, 5, 31, 22, 1); r(k.gem, 15, 27, 2, 2);
    r(SKD, 13, 21, 6, 4);
    if (k.style === 'long') r(k.hair, 7, 6, 18, 21);
    face();
    r(k.hair, 8, 3, 16, 5); r(k.hair, 7, 5, 2, k.style === 'long' ? 20 : 7); r(k.hair, 23, 5, 2, k.style === 'long' ? 20 : 7); r(k.hair, 9, 7, 9, 2); r(k.hairLo, 18, 7, 5, 1);
    if (k.style === 'messy') { r(k.hair, 10, 1, 2, 2); r(k.hair, 15, 0, 2, 3); r(k.hair, 20, 1, 2, 2); }
    eyes(mood, k.hairLo); mouth(mood);
  } else if (who === 'baba') {
    r(PAL.tide, 5, 25, 22, 7); r(PAL.bone, 11, 25, 2, 7); r(PAL.bone, 19, 25, 2, 7);
    r(SKD, 13, 20, 6, 3); face();
    r(PAL.ember, 8, 22, 16, 4); r(PAL.flame, 8, 22, 16, 1);
    r(PAL.stone, 8, 4, 16, 5); r(PAL.stone, 12, 0, 8, 4); r(PAL.stone, 7, 6, 2, 6); r(PAL.stone, 23, 6, 2, 6);
    eyes(mood === 'warm' ? 'happy' : mood, PAL.stone);
    r(PAL.ink, 10, 12, 6, 1); r(PAL.ink, 17, 12, 6, 1); r(PAL.ink, 16, 13); r(PAL.ink, 10, 16, 6, 1); r(PAL.ink, 17, 16, 6, 1); r(PAL.ink, 10, 12, 1, 5); r(PAL.ink, 22, 12, 1, 5);
    mouth(mood);
  } else if (who === 'mrak') {
    r(PAL.plum, 4, 19, 24, 13); r(PAL.void, 7, 21, 18, 11);
    r(PAL.slate, 10, 8, 12, 14); r(PAL.plum, 19, 9, 3, 12);
    r(PAL.frost, 12, 14, 3, 1); r(PAL.frost, 18, 14, 3, 1);
    r(PAL.void, 9, 5, 14, 3); for (const x of [10, 14, 18, 22]) r(PAL.void, x, 1, 1, 4);
  }
  return (ehCache[key] = ehOutline(c));
}

// ---------------------------------------------------------------- React pieces
// Portraits are resolved once and cached (loaded image, or 'missing'), and every portrait the script uses is
// preloaded at start-up, so switching speakers shows the real art at once instead of flashing the stand-in.
const ehPortraitCache = {};
function ehResolvePortrait(who, mood) {
  if (PORTRAIT_SKIP[who + '|' + mood]) mood = PORTRAIT_SKIP[who + '|' + mood];
  const key = who + '|' + mood, f = PORTRAIT_FILE[who];
  if (!ehPortraitCache[key]) ehPortraitCache[key] = !f ? Promise.resolve('missing') : new Promise(done => {
    const tries = [...new Set([PORTRAIT_MOOD[mood] || mood, PORTRAIT_DEFAULT[who] || 'neutral'])].map(m => EHS_A + `ui/portraits/portrait_${f}_${m}.png`);
    const next = i => { if (i >= tries.length) return done('missing'); const im = new Image(); im.onload = () => done(im); im.onerror = () => next(i + 1); im.src = tries[i]; };
    next(0);
  }).then(r => (ehPortraitCache[key].result = r));
  return ehPortraitCache[key];
}
function ehPreloadPortraits() {
  const lines = [...Object.values(EH_DIALOGUE).flat(), ...Object.values(EH_NOTES).flatMap(n => n.replies), ...INTRO.flatMap(sc => sc.lines), ...(typeof ENDING !== 'undefined' ? ENDING.flatMap(sc => sc.lines) : []), ...(typeof SPRING !== 'undefined' ? SPRING.flatMap(sc => sc.lines) : [])];
  for (const l of lines) { if (!l.who) continue; const who = l.who === 'all' ? KIDS : l.who === 'kosta_vasilije' ? ['kosta', 'vasilije'] : l.who === 'boys' ? ['kosta', 'vasilije', 'dimitrije'] : [l.who];
    for (const w of who) ehResolvePortrait(w, l.mood || (l.who === 'all' ? 'ali' : 'neutral')); }
}
function Portrait({ who, mood = 'neutral', size = 128 }) {
  const ref = React.useRef(null);
  const known = () => { const p = ehPortraitCache[who + '|' + (PORTRAIT_SKIP[who + '|' + mood] || mood)]; return p && p.result; };
  const [res, setRes] = React.useState(known);   // undefined = still loading, Image = real art, 'missing' = use the stand-in
  React.useEffect(() => { let on = true; const k = known(); setRes(k); if (!k) ehResolvePortrait(who, mood).then(r => on && setRes(r)); return () => { on = false; }; }, [who, mood]);
  const stand = res === 'missing' || (!PORTRAIT_FILE[who] && SPRITE_PORTRAIT[who]);
  React.useEffect(() => {
    const c = ref.current; if (!c || !stand) return; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.clearRect(0, 0, c.width, c.height);
    const sp = SPRITE_PORTRAIT[who];
    if (sp) { const i = new Image(); i.onload = () => { g.clearRect(0, 0, 64, 64); g.drawImage(i, sp.crop[0], sp.crop[1], sp.crop[2], sp.crop[3], 0, 0, 64, 64); }; i.src = EHS_A + sp.src; }
    else if (CAST[who] || who === 'baba' || who === 'mrak') g.drawImage(ehPortrait(who, mood), 0, 0);
  }, [who, mood, stand]);
  const st = { width: size, height: size, imageRendering: 'pixelated', display: 'block' };
  if (res && res !== 'missing') return <img src={res.src} style={st} />;
  if (!stand) return <div style={st} />;   // real art still loading: keep the frame empty rather than flash a stand-in
  const n = SPRITE_PORTRAIT[who] ? 64 : 34;   // stand-in portraits are 32px + 1px outline border
  return <canvas key={n} ref={ref} width={n} height={n} style={st} />;
}
function PortraitSlot({ who, mood }) {
  const box = { width: 128, height: 128, display: 'grid', placeItems: 'center', flex: 'none' };
  if (who === 'all') return <div style={box}><div style={{ display: 'grid', gridTemplateColumns: '64px 64px' }}>{KIDS.map(k => <Portrait key={k} who={k} mood={mood || 'ali'} size={64} />)}</div></div>;
  if (who === 'boys') return <div style={box}><div style={{ display: 'grid', gridTemplateColumns: '64px 64px' }}>{['kosta', 'vasilije', 'dimitrije'].map(k => <Portrait key={k} who={k} mood={mood || 'ali'} size={64} />)}</div></div>;
  if (who === 'kosta_vasilije') return <div style={box}><div style={{ display: 'flex' }}>{['kosta', 'vasilije'].map(k => <Portrait key={k} who={k} mood={mood} size={64} />)}</div></div>;
  return <div style={box}><Portrait who={who} mood={mood} size={128} /></div>;
}
// visual only; DialogueRunner / IntroCutscene drive it. Layout follows Claude Design's mock (640x360 art at 2x):
// box x 8, y 256, 624x96 · portrait (18, 272) · name tag at (92, 248) · text from (92, 272). pos 'top' mirrors it to the top edge.
function DialogueBox({ line, shown, done, interactive, pos = 'bottom' }) {
  if (!line) return null;
  const full = T(line.text), text = shown == null ? full : full.slice(0, shown);
  if (!line.who) return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 40, color: PAL.bone, textShadow: 'var(--text-outline)' }}>{text}</div>
  );
  const UI = EHS_A + 'ui/', px = { imageRendering: 'pixelated' };
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, height: 192, ...(pos === 'top' ? { top: 32 } : { bottom: 16 }) }}>
      <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderStyle: 'solid', borderWidth: 16, borderImage: `url(${UI}ui_dialogue_box.png) 8 fill / 16px stretch`, ...px }} />
      <div style={{ position: 'absolute', left: 20, top: 32 }}><PortraitSlot who={line.who} mood={line.mood} /></div>
      <div style={{ position: 'absolute', left: 168, top: -16, height: 32, boxSizing: 'border-box', borderStyle: 'solid', borderWidth: '0 12px', borderImage: `url(${UI}ui_name_tag.png) 0 6 fill / 0 12px stretch`, ...px,
        padding: '8px 4px 0', fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: '16px', color: PAL.bone, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{T(SPEAKER[line.who] || line.who)}</div>
      <div style={{ position: 'absolute', left: 168, right: 32, top: 34, fontFamily: 'var(--font-body)', fontSize: 30, lineHeight: 1.35, color: PAL.bone, textShadow: 'var(--text-outline)' }}>{text}</div>
      {interactive && done && <div style={{ position: 'absolute', right: 28, bottom: 20, fontFamily: 'var(--font-ui)', fontSize: 16, color: PAL.gold, animation: 'ehBlink 1s steps(2) infinite' }}>SPACE ▶</div>}
    </div>
  );
}
// key handling that runs before the game's own listeners, so Space/Esc don't also jump or pause
function useStoryKeys(handler) {
  const ref = React.useRef(handler); ref.current = handler;
  React.useEffect(() => {
    const k = e => { if (['Space', 'Enter', 'NumpadEnter', 'Escape', 'KeyF', 'KeyJ', 'KeyX'].includes(e.code)) { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) ref.current(e.code); } };
    window.addEventListener('keydown', k, true); return () => window.removeEventListener('keydown', k, true);
  }, []);
}
function useCutsceneLine() {
  const [line, setLineS] = React.useState(null), [shown, setShown] = React.useState(0);
  const hold = React.useRef(false), lineRef = React.useRef(null), shownRef = React.useRef(0); shownRef.current = shown;
  React.useEffect(() => { setShown(0); if (!line) return; const t = setInterval(() => setShown(v => Math.min(T(line.text).length, v + 1)), 28); return () => clearInterval(t); }, [line]);
  const setLine = ln => { lineRef.current = ln; if (ln) hold.current = true; setLineS(ln); };
  const advance = () => { const ln = lineRef.current; if (!hold.current) return; if (ln && shownRef.current < T(ln.text).length) setShown(T(ln.text).length); else hold.current = false; };
  const done = !!line && shown >= T(line.text).length;
  return { line, shown, done, setLine, advance, hold };
}
function DialogueRunner({ lines, onDone, pos = 'bottom' }) {
  const [i, setI] = React.useState(0), [shown, setShown] = React.useState(0);
  const line = lines[i], done = line && shown >= T(line.text).length;
  React.useEffect(() => { setShown(0); if (!line) return; const t = setInterval(() => setShown(s => Math.min(T(line.text).length, s + 1)), 28); return () => clearInterval(t); }, [i]);
  const next = () => { if (!line) return; if (!done) setShown(T(line.text).length); else if (i + 1 < lines.length) setI(i + 1); else onDone(); };
  useStoryKeys(code => (code === 'Escape' ? onDone() : next()));
  return <div style={{ position: 'absolute', inset: 0 }} onClick={next}><DialogueBox line={line} shown={shown} done={done} interactive pos={pos} /></div>;
}
// ui_note_paper.png is 320x200 (shown 2x): 36px red margin, ruled lines 16px apart from y 46 (measured; its README says 30)
function BabaNote({ lines, style }) {
  return (
    <div style={{ width: 640, height: 400, boxSizing: 'border-box', padding: '66px 36px 0 80px', background: `url(${EHS_A}ui/ui_note_paper.png) 0 0 / 640px 400px no-repeat`, imageRendering: 'pixelated',
      fontFamily: 'var(--font-body)', fontSize: 23, lineHeight: '32px', color: PAL.ink, ...style }}>
      {lines.map((l, i) => <div key={i}>{T(l)}</div>)}
      <div style={{ textAlign: 'right', color: PAL.ember }}>— Baba</div>
    </div>
  );
}
function NoteScreen({ level, onDone }) {
  const n = EH_NOTES[level]; const [phase, setPhase] = React.useState('note');
  React.useEffect(() => { if (!n) onDone(); }, []);
  if (!n) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,11,20,.7)' }}>
      <div style={{ position: 'absolute', top: phase === 'note' ? 90 : 40, left: 0, right: 0, display: 'grid', placeItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>{n.itemImg && <img src={EHS_A + n.itemImg} style={{ width: 96, height: 96, imageRendering: 'pixelated', animation: 'ehBob 1.2s steps(2) infinite' }} />}
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 18, color: PAL.gold, textShadow: 'var(--text-outline)', textTransform: 'uppercase' }}>{T('Found')}: {T(n.item)}</div></div>
        <BabaNote lines={n.lines} />
      </div>
      {phase === 'note' ? <NoteWait onNext={() => setPhase('reply')} /> : <DialogueRunner lines={n.replies} onDone={onDone} />}
    </div>
  );
}
function NoteWait({ onNext }) {
  useStoryKeys(() => onNext());
  return <div style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} onClick={onNext}>
    <div style={{ position: 'absolute', right: 40, bottom: 32, fontFamily: 'var(--font-ui)', fontSize: 18, color: PAL.gold, textShadow: 'var(--text-outline)', animation: 'ehBlink 1s steps(2) infinite' }}>SPACE ▶</div></div>;
}

// ---------------------------------------------------------------- intro cutscene (watch-only, skippable)
function IntroCutscene({ onDone }) {
  const cv = React.useRef(null);
  const [realTitle, setRealTitle] = React.useState(false), [hover, setHover] = React.useState(false);
  const CL = useCutsceneLine(), { line, setLine } = CL;
  const [note, setNote] = React.useState(false), [title, setTitle] = React.useState(false), [skip, setSkip] = React.useState(false);
  const doneRef = React.useRef(false);
  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDone(); } };
  useStoryKeys(code => { if (code === 'Escape' || code === 'Enter' || code === 'NumpadEnter') finish(); else CL.advance(); });
  React.useEffect(() => {
    let alive = true, raf = 0; const img = {}, real = {};
    const ld = (k, p) => new Promise(r => { const i = new Image(); i.onload = () => { img[k] = i; r(true); }; i.onerror = () => r(false); i.src = EHS_A + p; });
    let t0 = null, ready = false; const began = performance.now(); let clock = 0, lastNow = 0; let lastLine = null, lastNote = false, lastTitle = false;   // the clock starts once the art has loaded, so stand-ins never flash
    const starts = []; let acc = 0; for (const s of INTRO) { starts.push(acc); acc += s.d; } const total = acc;
    const bgs = ['sky', 'far', 'mid', 'near'].map(k => ld(k, `backgrounds/forest/bg_forest_${k}.png`));
    fetch(EHS_A + 'cutscenes/intro/intro.json').then(r => r.ok ? r.json() : null).catch(() => null).then(j => {
      const scenes = !j ? [] : j.scenes.slice(0, INTRO.length).map((sc, n) =>
        Promise.all(sc.layers.map(l => ld(`L${n}_${l.name}`, 'cutscenes/intro/' + l.file))).then(ok => { if (ok[0]) real[n] = true; if (n === INTRO.length - 1 && img[`L${n}_title`]) setRealTitle(true); }));
      Promise.all([...bgs, ...scenes]).then(() => { ready = true; });
    });
    const setT = setTimeout(() => alive && setSkip(true), 1000);
    const g = cv.current.getContext('2d'); g.imageSmoothingEnabled = false;
    const R = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
    const fig = (c, x, y, s = 3, flip = false) => { g.save(); g.translate(Math.round(x) + (flip ? c.width * s : 0), Math.round(y - c.height * s)); g.scale(flip ? -s : s, s); g.drawImage(c, 0, 0); g.restore(); };
    const forest = (cam, dy = 0) => { for (const [k, p] of [['sky', 0], ['far', 0.1], ['mid', 0.25], ['near', 0.45]]) { if (!img[k]) continue; const o = Math.round(((cam * p) % 640 + 640) % 640); g.drawImage(img[k], -o, dy); g.drawImage(img[k], 640 - o, dy); } };
    const snow = (t, n = 90) => { for (let i = 0; i < n; i++) { const sp = 1 + (i % 3); R(PAL.bone, ((i * 97 + t * 12 * sp) % 660) - 10, (i * 53 + t * 30 * sp) % 370 - 10, sp > 2 ? 2 : 1, sp > 2 ? 2 : 1); } };
    const house = (x, y, t) => { const fl = 0.85 + 0.15 * Math.sin(t * 7);
      for (let i = 0; i < 40; i++) R(PAL.ink, x - 10 + i * 1.5, y - 40 + i, 150 - i * 3, 1);
      R(PAL.plum, x, y, 130, 70); R(PAL.slate, x, y, 130, 3); R(PAL.bark, x + 56, y + 36, 18, 34);
      g.globalAlpha = fl; for (const wx of [x + 14, x + 92]) { R(PAL.gold, wx, y + 18, 22, 18); R(PAL.flame, wx, y + 30, 22, 6); } g.globalAlpha = 0.25 * fl; R(PAL.gold, x - 20, y - 10, 170, 100); g.globalAlpha = 1;
      R(PAL.slate, x + 100, y - 46, 12, 22); for (let i = 0; i < 5; i++) R(PAL.stone, x + 104 + Math.sin(t * 2 + i) * 4, y - 56 - i * 10 - (t * 8 % 10), 5, 4); };
    const kitchen = (dark = 0) => {
      R(PAL.plum, 0, 0, 640, 360); for (let x = 0; x < 640; x += 32) R(PAL.slate, x, 0, 1, 230);
      R(PAL.bark, 0, 230, 640, 8); R(PAL.amber, 0, 300, 640, 140); for (let x = 0; x < 640; x += 40) R(PAL.bark, x, 300, 2, 140); R(PAL.bark, 0, 300, 640, 3);
      R(PAL.ink, 250, 60, 110, 90); R(PAL.pine, 256, 66, 98, 78); R(PAL.ink, 303, 60, 4, 90); R(PAL.ink, 250, 103, 110, 4); for (let i = 0; i < 6; i++) R(PAL.bone, 262 + i * 15, 76 + (i * 7) % 50, 2, 2);
      R(PAL.slate, 480, 200, 90, 100); R(PAL.stone, 480, 200, 90, 6); R(PAL.ink, 492, 222, 66, 50); R(PAL.ember, 496, 226, 58, 42); R(PAL.flame, 500, 250, 50, 14);
      R(PAL.stone, 40, 230, 70, 70); R(PAL.tide, 48, 238, 54, 16); R(PAL.stone, 70, 214, 6, 18);
      if (dark) { g.globalAlpha = dark; R(PAL.ink, 0, 0, 640, 360); g.globalAlpha = 1; } };
    const table = (x, y) => { R(PAL.bark, x, y, 150, 10); R(PAL.amber, x, y, 150, 3); R(PAL.bark, x + 10, y + 10, 8, 300 - y - 10); R(PAL.bark, x + 132, y + 10, 8, 300 - y - 10); };
    const cookies = (x, y) => { R(PAL.stone, x, y, 44, 4); for (let i = 0; i < 4; i++) { R(PAL.amber, x + 3 + i * 10, y - 6, 8, 6); R(PAL.bark, x + 5 + i * 10, y - 4, 2, 2); } };
    const kidsAt = (xs, t, run = false, s = 3, y = 300) => KIDS.forEach((k, i) => fig(ehKidFigure(k, run ? 1 + Math.floor(t * 8 + i) % 2 : 0), xs[i], y, s));
    const scenes = [
      t => { forest(t * 20); house(470 - t * 5, 230, t); snow(t); },
      t => { kitchen(); table(150, 250); cookies(200, 250);
        const e = Math.min(1, Math.max(0, (t - 0.4) / 1.6)), hop = t > 4.8 && t < 5.6 ? -Math.abs(Math.sin((t - 4.8) * 8)) * 10 : 0;
        const tx = [150, 205, 255, 300], xs = tx.map((x, i) => -60 + (x + 60) * e);
        if (t > 6.8) xs[3] = Math.max(60, 300 - (t - 6.8) * 160);
        KIDS.forEach((k, i) => fig(ehKidFigure(k, e < 1 || (i === 3 && t > 6.8 && xs[3] > 60) ? 1 + Math.floor(t * 8) % 2 : 0), xs[i], 300 + hop, 3, i === 3 && t > 6.8));
        fig(ehBabaFigure(t > 2.6 && t < 4.6 && Math.floor(t * 4) % 2 ? 1 : 0), 420, 300, 3, true); cookies(404, 236 - (t < 1 ? t * 10 : 10)); },
      t => { R(PAL.plum, 0, 0, 640, 360); R(PAL.slate, 0, 0, 640, 12); R(PAL.moss, 0, 300, 640, 140); R(PAL.pine, 120, 300, 400, 40);
        R(PAL.ink, 80, 70, 64, 92); R(PAL.ember, 84, 74, 56, 84); g.fillStyle = PAL.gold; g.font = '8px Silkscreen, monospace'; g.textAlign = 'center';
        ['THE RISE', 'OF THE', 'KARATE', 'BADASS'].forEach((w, i) => g.fillText(w, 112, 96 + i * 14)); R(PAL.bone, 100, 144, 24, 2);
        R(PAL.ink, 540, 200, 4, 100); R(PAL.ink, 528, 298, 28, 3); R(PAL.slate, 530, 186, 24, 16); R(PAL.frost, 534, 190, 16, 8);
        for (const [x, c] of [[190, PAL.tide], [230, PAL.gold], [330, PAL.flame], [380, PAL.leaf], [440, PAL.frost]]) R(c, x, 290, 12, 10);
        const bx = 280 + Math.sin(t * 2) * 40; R(PAL.bone, bx, 288, 12, 12); R(PAL.ink, bx + 4, 292, 4, 4);
        const slump = t > 3.8 ? 4 : 0; fig(ehKidFigure('kosta'), 150, 300 + slump, 3); fig(ehKidFigure('vasilije'), 200, 300 + slump, 3); fig(ehKidFigure('katarina'), 330, 300, 3, true); fig(ehKidFigure('dimitrije'), 380, 300, 3, true);
        fig(ehBabaFigure(Math.floor(t * 4) % 2), 460, 300, 3, true); },
      t => { R(PAL.ink, 0, 0, 640, 360); g.save(); g.beginPath(); g.rect(110, 40, 420, 260); g.clip(); forest(0);
        g.globalAlpha = 0.75; R(PAL.plum, 110, 40, 420, 260); g.globalAlpha = 1;
        for (let i = 0; i < 6; i++) { const cx = ((i * 140 + t * 30) % 700) - 60; R(PAL.slate, cx, 40 + (i % 3) * 18, 140, 22); R(PAL.stone, cx + 20, 44 + (i % 3) * 18, 90, 3); }
        const rise = Math.min(1, Math.max(0, (t - 1) / 4)), sy = 320 - rise * 220;
        R(PAL.void, 230, sy + 40, 180, 300); R(PAL.plum, 250, sy + 60, 140, 300); R(PAL.slate, 285, sy, 70, 80);
        for (let i = 0; i < 7; i++) R(PAL.ink, 280 + i * 12, sy - 26 + (i % 2) * 8, 5, 30);
        const eo = Math.min(1, Math.max(0, (t - 5.2) / 0.5)); R(PAL.frost, 298, sy + 38, 16, Math.max(0, Math.round(5 * eo))); R(PAL.frost, 326, sy + 38, 16, Math.max(0, Math.round(5 * eo)));
        if ((t > 2.2 && t < 2.35) || (t > 4.1 && t < 4.2)) { g.globalAlpha = 0.8; R(PAL.bone, 110, 40, 420, 260); g.globalAlpha = 1; }
        g.restore(); R(PAL.bark, 104, 34, 432, 6); R(PAL.bark, 104, 300, 432, 10); R(PAL.bark, 104, 34, 6, 276); R(PAL.bark, 530, 34, 6, 276); R(PAL.bark, 317, 34, 6, 276); R(PAL.bark, 104, 168, 432, 6); },
      t => { if (t < 1.2) kitchen(Math.floor(t * 12) % 3 === 0 ? 0.85 : 0.2); else R(PAL.ink, 0, 0, 640, 360);
        if (t > 2 && t < 2.12) { kitchen(0.5); fig(ehBabaFigure(1), 420, 300, 3, true); } },
      t => { g.save(); g.translate(-Math.min(120, t * 16), 0); kitchen(0.15); table(150, 250); cookies(200, 250);
        R(PAL.bark, 380, 220, 40, 6); R(PAL.bark, 380, 226, 6, 74); R(PAL.bark, 414, 226, 6, 74); R(PAL.bark, 380, 180, 6, 40); R(PAL.bone, 388, 196, 22, 30); R(PAL.ember, 388, 196, 22, 3);
        R(PAL.ink, 640, 110, 110, 190); R(PAL.pine, 646, 116, 98, 184); snow(t, 30); R(PAL.bark, 740, 110, 14, 190);
        g.fillStyle = PAL.flame; for (let x = 220; x < 760; x += 2) g.fillRect(x, 296 + Math.round(Math.sin(x / 18) * 2), 2, 2);
        g.restore(); snow(t, 20); },
      t => { R(PAL.bark, 0, 0, 640, 360); for (let y = 12; y < 360; y += 22) R(PAL.plum, 0, y, 640, 2);
        R(PAL.ink, 190, 150, 260, 130); R(PAL.bark, 194, 154, 252, 122); R(PAL.amber, 194, 154, 252, 6); R(PAL.ink, 190, 80, 260, 70); R(PAL.amber, 194, 84, 252, 62);
        [PAL.gold, PAL.frost, PAL.flame, PAL.leaf].forEach((c, i) => { const p = 0.6 + 0.4 * Math.sin(t * 3 + i); g.globalAlpha = 0.35 * p; R(c, 206 + i * 60, 172, 48, 48); g.globalAlpha = 1; R(PAL.ink, 216 + i * 60, 182, 28, 28); R(c, 218 + i * 60, 184, 24, 24); R(PAL.bone, 222 + i * 60, 188, 6, 6); }); },
      t => { kitchen(0.35); const who = INTRO[7].lines.filter(l => l.at <= t).pop(); const talk = k => who && (who.who === k || who.who === 'all') && t - who.at < 0.5 ? -6 : 0;
        fig(ehKidFigure('kosta'), 150, 310 + talk('kosta'), 4); fig(ehKidFigure('vasilije'), 230, 310 + talk('vasilije'), 4);
        fig(ehKidFigure('katarina'), 360, 310 + talk('katarina'), 4, true); fig(ehKidFigure('dimitrije'), 440, 310 + talk('dimitrije'), 4, true); },
      t => { forest(t * 90); snow(t, 60); g.fillStyle = PAL.flame; for (let x = 0; x < 640; x += 2) g.fillRect(x, 300 + Math.round(Math.sin((x + t * 90) / 18) * 2), 2, 2);
        kidsAt([140, 190, 235, 275].map((x, i) => x + Math.sin(t * 3 + i) * 6), t, true, 3, 300);
        R(PAL.bone, 600 - (t * 10) % 20, 290, 10, 7); R(PAL.bone, 606 - (t * 10) % 20, 286, 5, 5); },
    ];
    // Claude Design layers (bg, chars, fg, fx, title; 640x360 each) animated per cutscenes/intro/README.md, moved in whole 2px steps
    const real2 = (n, t) => {
      const L = k => img[`L${n}_${k}`], d = (im, x = 0, y = 0) => im && g.drawImage(im, Math.round(x / 2) * 2, Math.round(y / 2) * 2);
      const slide = (from, dur) => from * Math.max(0, 1 - t / dur);
      if (n === 0) { d(L('bg')); const y = (t * 24) % 360; d(L('fx'), 0, y); d(L('fx'), 0, y - 360); }
      else if (n === 1) { d(L('bg')); d(L('chars'), slide(-320, 1.2)); d(L('fx'), 0, -2 * (Math.floor(t * 3) % 3)); }
      else if (n === 2) { d(L('bg')); if (Math.floor(t * 8) % 11) d(L('fx')); }
      else if (n === 3) { d(L('bg')); d(L('chars'), 0, 40 - Math.min(40, t * 10)); d(L('fg')); if ((t > 2.2 && t < 2.35) || (t > 4.1 && t < 4.2) || (t > 5.9 && t < 6.0)) d(L('fx')); }
      else if (n === 4) { d(L('bg')); if ((t > 1.2 && t < 1.24) || t > 1.34) d(L('fx')); }
      else if (n === 5) { d(L('bg')); const x = (t * 40) % 640; d(L('fx'), x); d(L('fx'), x - 640); }
      else if (n === 6) { d(L('bg')); d(L('chars')); if (Math.floor(t / 0.4) % 2 === 0) d(L('fx')); }
      else if (n === 7) { d(L('bg')); const ch = L('chars'); if (ch) { const k = Math.min(1, t / 0.8), xl = Math.round(-320 * (1 - k) / 2) * 2, xr = Math.round(320 * (1 - k) / 2) * 2;
          g.drawImage(ch, 0, 0, 320, 360, xl, 0, 320, 360); g.drawImage(ch, 320, 0, 320, 360, 320 + xr, 0, 320, 360); } d(L('fx')); }
      else if (n === 8) { d(L('bg')); d(L('chars'), 0, -Math.min(16, t * 4) - 2 * (Math.floor(t * 8) % 2)); d(L('fx')); if (t > 1.5 && window.EH_LANG !== 'sr') d(L('title'), 0, -Math.max(0, 80 - (t - 1.5) * 200)); }
    };
    const loop = () => {
      if (!alive) return;
      if (t0 == null) { R(PAL.ink, 0, 0, 640, 360); if (ready || performance.now() - began > 6000) { t0 = performance.now(); lastNow = t0; } raf = requestAnimationFrame(loop); return; }
      const now = performance.now(); if (!CL.hold.current) clock += (now - lastNow) / 1000; lastNow = now; const T = clock;   // the story clock waits while a line (or Baba's note) is up
      if (T >= total) { finish(); return; }
      let n = starts.findIndex((s, i) => T >= s && (i === starts.length - 1 || T < starts[i + 1])); const t = T - starts[n], S = INTRO[n];
      g.globalAlpha = 1; R(PAL.ink, 0, 0, 640, 360);
      if (real[n]) real2(n, t);
      else { const lift = [1, 2, 4, 5, 7].includes(n) ? 72 : 0; g.save(); g.translate(0, -lift); scenes[n](t); g.restore(); }
      const fade = Math.min(1, t / 0.4, (S.d - t) / 0.3); if (fade < 1 && n !== 4) { g.globalAlpha = 1 - Math.max(0, fade); R(PAL.ink, 0, 0, 640, 360); g.globalAlpha = 1; }
      const ln = S.lines.filter(l => l.at <= t).pop() || null; if (ln !== lastLine) { lastLine = ln; setLine(ln); }
      const nt = S.note != null && t >= S.note; if (nt !== lastNote) { lastNote = nt; setNote(nt); if (nt) CL.hold.current = true; }
      const tt = S.title != null && t >= S.title && (!real[n] || window.EH_LANG === 'sr'); if (tt !== lastTitle) { lastTitle = tt; setTitle(tt); }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(setT); };
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAL.ink }} onClick={() => CL.advance()}>
      <canvas ref={cv} width={640} height={360} style={{ width: 1280, height: 720, imageRendering: 'pixelated', display: 'block' }} />
      {note && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', animation: 'ehFadeIn .6s' }}><BabaNote lines={INTRO_NOTE} />
        <div style={{ position: 'absolute', right: 40, bottom: 32, fontFamily: 'var(--font-ui)', fontSize: 18, color: PAL.gold, textShadow: 'var(--text-outline)', animation: 'ehBlink 1s steps(2) infinite' }}>SPACE ▶</div></div>}
      {title && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', animation: 'ehFadeIn 1s' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 110, lineHeight: 1, color: PAL.gold, textShadow: `-6px 0 0 ${PAL.ink},6px 0 0 ${PAL.ink},0 -6px 0 ${PAL.ink},0 6px 0 ${PAL.ink},6px 12px 0 ${PAL.ember}` }}>{T('Elemental Heroes')}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 30, color: PAL.bone, textShadow: 'var(--text-outline)', textTransform: 'uppercase', marginTop: 18 }}>{T('The Rescue of Baba Vera')}</div>
        </div></div>}
      <DialogueBox line={line} shown={CL.shown} done={CL.done} interactive pos={line && [1, 7].includes(INTRO.findIndex(sc => sc.lines.includes(line))) ? 'top' : 'bottom'} />
      {skip && <button onClick={finish} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-label="Skip intro"
        style={{ position: 'absolute', right: 28, top: 24, width: 160, height: 40, padding: 0, border: 'none', cursor: 'pointer', animation: 'ehFadeIn .4s', imageRendering: 'pixelated',
          background: `url(${EHS_A}ui/ui_skip_button.png) ${hover ? '-160px' : '0'} 0 / 320px 40px no-repeat` }}>
          {window.EH_LANG === 'sr' && <span style={{ position: 'absolute', inset: 2, display: 'grid', placeItems: 'center', background: hover ? PAL.slate : PAL.plum, color: PAL.bone, fontFamily: 'var(--font-ui)', fontSize: 16 }}>PRESKOČI ▶</span>}</button>}
    </div>
  );
}

// ---------------------------------------------------------------- ending cutscene (after Mrak; watch-only, skippable)
// Claude Design panels in cutscenes/ending (bg, chars, fx, + title on the credits), lines from the story bible section 6.
const SPRING = [
  { d: 9, lines: [{ at: 1.5, who: null, text: 'Spring has come to Ivanovo.' }] },
  { d: 9, lines: [{ at: 1.2, who: null, text: 'Baba Vera was home. The house was warm again, and full of toys.' },
    { at: 3.0, who: 'kosta', mood: 'happy', text: 'Good morning, everyone!' },
    { at: 4.6, who: 'katarina', text: '(yawning) Is it breakfast yet? I’m hungry.' },
    { at: 6.4, who: 'vasilije', text: 'Five more minutes…' }] },
  { d: 14, lines: [{ at: 0.8, who: 'ruby', mood: 'happy', text: 'Good morning, kids!' },
    { at: 2.2, who: 'all', mood: 'happy', text: 'Hi, Rubi!' },
    { at: 3.6, who: 'ruby', mood: 'worried', text: 'Look at this room. The toys are out again!' },
    { at: 5.2, who: 'ruby', mood: 'worried', text: 'Grandma Marija is still sleeping, but she will be up soon.' },
    { at: 6.8, who: 'ruby', mood: 'worried', text: "Pick them all up before she wakes, or she'll take a shovel and throw them in the trash. You'll lose those toys!" },
    { at: 8.6, who: 'vasilije', mood: 'ali', text: 'ALL of them?!' },
    { at: 10.0, who: 'ruby', mood: 'happy', text: 'Then hurry. You have one minute!' },
    { at: 11.6, who: 'dimitrije', mood: 'okej', text: 'Okej.' }] },
];
const ENDING = [
  { d: 14, top: true, lines: [{ at: 1.0, who: 'mrak', mood: 'sad', text: 'I only wanted… somewhere warm.' },
    { at: 3.4, who: 'baba', mood: 'warm', text: "Then come home with us. It's New Year's Eve. Nobody should be alone tonight." },
    { at: 7.0, who: 'mrak', mood: 'surprised', text: '…Ali Vera—' },
    { at: 8.8, who: 'baba', mood: 'stern', text: "No 'ali'. Wash your hands. There are cookies." },
    { at: 11.4, who: 'all', mood: 'ali', text: 'HE SAID IT!' }] },
  { d: 10, top: true, lines: [{ at: 0.8, who: 'katarina', mood: 'happy', text: '(mouth full) Finally. I was SO hungry.' },
    { at: 3.6, who: 'baba', mood: 'stern', text: 'Did you wash your hands?' },
    { at: 6.2, who: 'katarina', mood: 'ali', text: '…Ali Vera.' }] },
  { d: 10, top: true, lines: [{ at: 1.0, who: 'baba', mood: 'stern', text: 'Make your beds before you sleep!' },
    { at: 3.6, who: 'all', mood: 'ali', text: 'Ali Veraaa!' },
    { at: 6.0, who: 'dimitrije', mood: 'happy', text: '(already in bed) Night, Baba.' }] },
  { d: 12, credits: true, lines: [] },
];
function EndingCutscene({ onDone }) {
  const cv = React.useRef(null);
  const CL = useCutsceneLine(), { line, setLine } = CL;
  const [credits, setCredits] = React.useState(null), [skip, setSkip] = React.useState(false), [hover, setHover] = React.useState(false);
  const doneRef = React.useRef(false);
  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDone && onDone(); } };
  useStoryKeys(code => { if (code === 'Escape' || code === 'Enter' || code === 'NumpadEnter') finish(); else CL.advance(); });
  React.useEffect(() => {
    let alive = true, raf = 0; const img = {};
    const ld = (k, p) => new Promise(r => { const i = new Image(); i.onload = () => { img[k] = i; r(true); }; i.onerror = () => r(false); i.src = EHS_A + p; });
    let t0 = null, ready = false; const began = performance.now(); let clock = 0, lastNow = 0; let lastLine = null, lastCred = null;
    const starts = []; let acc = 0; for (const s of ENDING) { starts.push(acc); acc += s.d; } const total = acc;
    fetch(EHS_A + 'cutscenes/ending/ending.json').then(r => r.ok ? r.json() : null).catch(() => null).then(j => {
      Promise.all(!j ? [] : j.scenes.slice(0, ENDING.length).flatMap((sc, n) => sc.layers.map(l => ld(`L${n}_${l.name}`, 'cutscenes/ending/' + l.file)))).then(() => { ready = true; });
    });
    const setT = setTimeout(() => alive && setSkip(true), 1000);
    const g = cv.current.getContext('2d'); g.imageSmoothingEnabled = false;
    const d = (im, x = 0, y = 0) => im && g.drawImage(im, Math.round(x / 2) * 2, Math.round(y / 2) * 2);
    // motions from cutscenes/ending/README.md, moved in whole 2px steps
    const draw = (n, t) => {
      const L = k => img[`L${n}_${k}`];
      if (n === 0) {   // slow push in toward Baba and Mrak; dust drifts in the moonbeam
        const z = 1 + Math.min(0.08, t * 0.006), w = 640 * z, h = 360 * z, ox = (640 - w) / 2, oy = (360 - h) * 0.75;
        for (const k of ['bg', 'chars']) if (L(k)) g.drawImage(L(k), Math.round(ox), Math.round(oy), Math.round(w), Math.round(h));
        if (L('fx')) { g.globalAlpha = 1; g.drawImage(L('fx'), Math.round(ox), Math.round(oy - (t * 6) % 12), Math.round(w), Math.round(h)); } }
      else if (n === 1) { d(L('bg')); d(L('chars'), 0, Math.floor(t * 2) % 2 ? -2 : 0); d(L('fx'), 0, -2 * (Math.floor(t * 3) % 3)); }   // everyone chatting; steam rises
      else if (n === 2) { d(L('bg')); if (Math.floor(t * 5) % 7 < 5) d(L('fx')); d(L('chars'), 0, Math.floor(t * 8) % 2 ? -2 : 0); }   // fireworks burst by burst, kids run in place
      else { d(L('bg')); if (Math.floor(t * 3) % 2 === 0) d(L('fx')); d(L('chars'));   // credits: stones pulse, the title slides up (English art; Serbian is drawn as text)
        if (window.EH_LANG !== 'sr' && t > 4.2) d(L('title'), 0, Math.max(0, 60 - (t - 4.2) * 120)); }
    };
    const loop = () => {
      if (!alive) return;
      g.fillStyle = PAL.ink;
      if (t0 == null) { g.fillRect(0, 0, 640, 360); if (ready || performance.now() - began > 6000) { t0 = performance.now(); lastNow = t0; } raf = requestAnimationFrame(loop); return; }
      const now = performance.now(); if (!CL.hold.current) clock += (now - lastNow) / 1000; lastNow = now; const T = clock;   // the story clock waits while a line (or Baba's note) is up
      if (T >= total) { finish(); return; }
      const n = starts.findIndex((st, i) => T >= st && (i === starts.length - 1 || T < starts[i + 1])), t = T - starts[n], S = ENDING[n];
      g.globalAlpha = 1; g.fillRect(0, 0, 640, 360); draw(n, t);
      const fade = Math.min(1, t / 0.5, (S.d - t) / 0.5); if (fade < 1) { g.globalAlpha = 1 - Math.max(0, fade); g.fillRect(0, 0, 640, 360); g.globalAlpha = 1; }
      const ln = S.lines.filter(l => l.at <= t).pop() || null; if (ln !== lastLine) { lastLine = ln; setLine(ln); }
      const cr = !S.credits ? null : t < 4.2 ? 'makers' : window.EH_LANG === 'sr' ? 'directed' : null; if (cr !== lastCred) { lastCred = cr; setCredits(cr); }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(setT); };
  }, []);
  const credStyle = { position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: 'var(--font-ui)', color: PAL.bone, textShadow: 'var(--text-outline)', animation: 'ehFadeIn .8s' };
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAL.ink }} onClick={() => CL.advance()}>
      <canvas ref={cv} width={640} height={360} style={{ width: 1280, height: 720, imageRendering: 'pixelated', display: 'block' }} />
      {credits === 'makers' && <div key="m" style={credStyle}>
        <div style={{ fontSize: 26, color: PAL.gold }}>{T('FROM THE MAKERS OF')}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 1.1, marginTop: 14, color: PAL.gold, textShadow: `-4px 0 0 ${PAL.ink},4px 0 0 ${PAL.ink},0 -4px 0 ${PAL.ink},0 4px 0 ${PAL.ink},4px 8px 0 ${PAL.ember}` }}>The Rise of the Karate Badass</div></div>}
      {credits === 'directed' && <div key="d" style={credStyle}>
        <div style={{ fontSize: 30, color: PAL.gold }}>{T('DIRECTED BY')}</div>
        <div style={{ fontSize: 34, marginTop: 30, lineHeight: 1.5 }}>{T('KONSTANTIN, KATARINA,')}<br />{T('VASILIJE AND DIMITRIJE')}</div></div>}
      <DialogueBox line={line} shown={CL.shown} done={CL.done} interactive pos="top" />
      {skip && <button onClick={finish} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-label="Skip ending"
        style={{ position: 'absolute', right: 28, bottom: 24, width: 160, height: 40, padding: 0, border: 'none', cursor: 'pointer', animation: 'ehFadeIn .4s', imageRendering: 'pixelated',
          background: `url(${EHS_A}ui/ui_skip_button.png) ${hover ? '-160px' : '0'} 0 / 320px 40px no-repeat` }}>
          {window.EH_LANG === 'sr' && <span style={{ position: 'absolute', inset: 2, display: 'grid', placeItems: 'center', background: hover ? PAL.slate : PAL.plum, color: PAL.bone, fontFamily: 'var(--font-ui)', fontSize: 16 }}>PRESKOČI ▶</span>}</button>}
    </div>
  );
}

(function () { if (document.getElementById('eh-story-css')) return; const s = document.createElement('style'); s.id = 'eh-story-css';
  s.textContent = '@keyframes ehBob{0%{transform:translateY(0)}100%{transform:translateY(-2px)}}@keyframes ehBlink{0%{opacity:1}100%{opacity:0}}@keyframes ehFadeIn{from{opacity:0}to{opacity:1}}'; document.head.appendChild(s); })();
ehPreloadPortraits();
// spring morning (after the ending, before the toy level): sunrise pan, the cousins waking up, Rubi calling them
function SpringCutscene({ onDone }) {
  const cv = React.useRef(null), CL = useCutsceneLine(), { line, setLine } = CL;
  const [skip, setSkip] = React.useState(false), [hover, setHover] = React.useState(false), doneRef = React.useRef(false);
  const finish = () => { if (!doneRef.current) { doneRef.current = true; onDone && onDone(); } };
  useStoryKeys(code => { if (code === 'Escape' || code === 'Enter' || code === 'NumpadEnter') finish(); else CL.advance(); });
  React.useEffect(() => {
    let alive = true, raf = 0; const img = {};
    const ld = (k, p) => new Promise(r => { const i = new Image(); i.onload = () => { img[k] = i; r(true); }; i.onerror = () => r(false); i.src = EHS_A + p; });
    let t0 = null, ready = false, lastLine = null, clock = 0, lastNow = 0; const began = performance.now();
    const starts = []; let acc = 0; for (const sc of SPRING) { starts.push(acc); acc += sc.d; } const total = acc;
    fetch(EHS_A + 'cutscenes/spring/spring.json').then(r => r.ok ? r.json() : null).catch(() => null).then(j => {
      Promise.all(!j ? [] : j.scenes.slice(0, SPRING.length).flatMap((sc, n) => sc.layers.map(l => ld(`L${n}_${l.name}`, 'cutscenes/spring/' + l.file)))).then(() => { ready = true; }); });
    const setT = setTimeout(() => alive && setSkip(true), 1000);
    const g = cv.current.getContext('2d'); g.imageSmoothingEnabled = false;
    const d = (im, x = 0, y = 0) => im && g.drawImage(im, Math.round(x / 2) * 2, Math.round(y / 2) * 2);
    const draw = (n, t) => { const L = k => img[`L${n}_${k}`];
      if (n === 0) { const up = Math.min(1, t / 7); d(L('bg'), 0, 0); const fy = (t * 10) % 40; d(L('fx'), -((t * 20) % 40), -fy); }   // sunrise: petals and birds drift
      else if (n === 1) { const z = 1 + Math.min(0.06, t * 0.008), w = 640 * z, h = 360 * z; for (const k of ['bg', 'chars']) if (L(k)) g.drawImage(L(k), Math.round((640 - w) / 2), Math.round(360 - h), Math.round(w), Math.round(h));
        if (L('fx')) g.drawImage(L('fx'), Math.round((640 - w) / 2), Math.round(360 - h - (t * 8) % 16), Math.round(w), Math.round(h)); }
      else { const sh = t > 0.8 && t < 1.3 ? (Math.floor(t * 30) % 2 ? 2 : -2) : 0; d(L('bg'), sh); d(L('chars'), sh); if (Math.floor(t * 3) % 2 === 0) d(L('fx'), sh); } };
    const loop = () => { if (!alive) return; g.fillStyle = PAL.ink;
      if (t0 == null) { g.fillRect(0, 0, 640, 360); if (ready || performance.now() - began > 6000) { t0 = performance.now(); lastNow = t0; } raf = requestAnimationFrame(loop); return; }
      const now = performance.now(); if (!CL.hold.current) clock += (now - lastNow) / 1000; lastNow = now; const T2 = clock;
      if (T2 >= total) { finish(); return; }
      const n = starts.findIndex((st, i) => T2 >= st && (i === starts.length - 1 || T2 < starts[i + 1])), t = T2 - starts[n], S = SPRING[n];
      g.globalAlpha = 1; g.fillRect(0, 0, 640, 360); draw(n, t);
      const fade = Math.min(1, t / 0.5, (S.d - t) / 0.5); if (fade < 1) { g.globalAlpha = 1 - Math.max(0, fade); g.fillRect(0, 0, 640, 360); g.globalAlpha = 1; }
      const ln = S.lines.filter(l => l.at <= t).pop() || null; if (ln !== lastLine) { lastLine = ln; setLine(ln); }
      raf = requestAnimationFrame(loop); };
    loop(); return () => { alive = false; cancelAnimationFrame(raf); clearTimeout(setT); };
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, background: PAL.ink }} onClick={() => CL.advance()}>
      <canvas ref={cv} width={640} height={360} style={{ width: 1280, height: 720, imageRendering: 'pixelated', display: 'block' }} />
      <DialogueBox line={line} shown={CL.shown} done={CL.done} interactive pos="top" />
      {skip && <button onClick={finish} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-label="Skip"
        style={{ position: 'absolute', right: 28, bottom: 24, width: 160, height: 40, padding: 0, border: 'none', cursor: 'pointer', imageRendering: 'pixelated', background: `url(${EHS_A}ui/ui_skip_button.png) ${hover ? '-160px' : '0'} 0 / 320px 40px no-repeat` }}>
        {window.EH_LANG === 'sr' && <span style={{ position: 'absolute', inset: 2, display: 'grid', placeItems: 'center', background: hover ? PAL.slate : PAL.plum, color: PAL.bone, fontFamily: 'var(--font-ui)', fontSize: 16 }}>PRESKOČI ▶</span>}</button>}
    </div>
  );
}
Object.assign(window, { IntroCutscene, EndingCutscene, SpringCutscene, ENDING, DialogueRunner, NoteScreen, EH_DIALOGUE, EH_NOTES });
