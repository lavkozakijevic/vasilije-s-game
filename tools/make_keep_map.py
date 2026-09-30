# Builds assets/maps/keep_l4.tmj (Level 4, The Hollow Keep) from a column height map.
# Run: python3 tools/make_keep_map.py   (tile ids are tileset_keep.tsj ids; the .tmj stores id + 1)
import json, random, os
random.seed(11)
W, H = 184, 12
FLIP = 0x80000000
ground = [[0] * W for _ in range(H)]; decor_back = [[0] * W for _ in range(H)]; decor = [[0] * W for _ in range(H)]; fg = [[0] * W for _ in range(H)]
ents = []
def put(layer, r, c, tid, flip=False): layer[r][c] = (tid + 1) | (FLIP if flip else 0)
def ent(type_, name, x, y, w=32, h=32):
    ents.append(dict(id=len(ents) + 1, name=name, type=type_, x=x, y=y, width=w, height=h, rotation=0, visible=True))

# ---- height map (None = abyss; 'bridge' columns get a shadow bridge on row 9 that only Kosta's light makes solid)
h = [9] * W; bridge = set(); abyss = set()
def pit(c0, c1, with_bridge=False):
    for c in range(c0, c1 + 1): h[c] = None; abyss.add(c); (bridge.add(c) if with_bridge else None)
pit(25, 30, True); pit(100, 106, True); pit(124, 125)

for c in range(W):
    put(ground, 0, c, 17)                             # castle ceiling
    r = h[c]
    if r is None:
        if c in bridge: put(ground, 9, c, 29)
        put(ground, 10, c, 36); put(ground, 11, c, 35); continue
    L = h[c - 1] if c > 0 else r; R_ = h[c + 1] if c < W - 1 else r
    lo = L is None or L > r; ro = R_ is None or R_ > r
    put(ground, r, c, 1 if lo and ro else 0 if lo else 2 if ro else 1)
    for y in range(r + 1, H):
        le = L is None or L > y; re = R_ is None or R_ > y
        put(ground, y, c, 15 if le and re else 8 if le else 10 if re else (random.choice([13, 14]) if random.random() < 0.07 else 9))

def ledge(r, c0, c1, ids=(19, 20, 21)):
    for c in range(c0, c1 + 1): put(ground, r, c, ids[0] if c == c0 else ids[2] if c == c1 else ids[1])
def hidden(r, c0, c1):
    for c in range(c0, c1 + 1): put(ground, r, c, 33)
def crumble(r, c0, c1):
    for c in range(c0, c1 + 1): put(ground, r, c, 25)
def coins(r, c0, c1, step=1):
    for c in range(c0, c1 + 1, step): ent('item_coin', 'coin', c * 32 + 8, r * 32 + 10, 16, 16)
def chand(c): ent('hazard_chandelier', 'chandelier', c * 32, 32, 32, 32)
for c in range(4, W - 20, 9): put(decor_back, 5, c, 41)   # cold blue torches along the walls

# ---- A: the gate hall; the eagle shows the first hidden ledges
ent('hero_light', 'player_spawn', 64, 257)
put(decor, 8, 3, 67); put(decor, 8, 6, 67); put(decor, 8, 12, 68); put(decor, 2, 15, 69)
hidden(6, 9, 11); coins(5, 9, 11)
coins(8, 4, 8, 2)
ent('enemy_shadow_shade', 'shadow_shade', 17 * 32, 200)
ent('story_trigger', 'l4_bridge', 22 * 32, 0, 32, 360)
coins(7, 25, 30)                                       # over the first shadow bridge
ent('knight_statue', 'light', 33 * 32, 257)
# ---- B: knights, gargoyles, chandeliers, the chain route and the library
ent('enemy_hollow_knight', 'hollow_knight', 40 * 32, 257)
ledge(6, 45, 47); ent('enemy_stone_gargoyle', 'gargoyle', 46 * 32, 160)
chand(50); chand(52); coins(8, 49, 53, 2)
put(ground, 8, 55, 40); put(ground, 8, 57, 42)
put(ground, 8, 59, 46)                                 # the spring plate launches you up to the chains
ledge(3, 60, 70)
for c in range(59, 72): put(fg, 1, c, 59 if c == 59 else 61 if c == 71 else 60); put(fg, 2, c, 62)
coins(2, 61, 66); ent('item_gem', 'gem', 68 * 32 + 8, 2 * 32 + 10, 16, 16)
crumble(5, 71, 72)
put(ground, 7, 63, 51); put(ground, 7, 69, 51, True)
for c in range(64, 69): put(ground, 7, c, 52)
put(ground, 8, 63, 55); put(ground, 8, 69, 55, True)
for c in range(64, 69): put(decor_back, 8, c, 57 if c == 66 else 53); put(fg, 8, c, 58)
coins(8, 64, 66); ent('item_gem', 'gem', 68 * 32 + 8, 8 * 32 + 10, 16, 16)
ent('checkpoint', 'checkpoint', 74 * 32, 224, 32, 64)
ent('item_heart', 'heart', 76 * 32 + 8, 8 * 32 + 10, 16, 16)
# ---- C: Umbra's hall
put(decor, 8, 80, 65); put(decor, 8, 81, 66); put(decor, 8, 79, 64); put(decor, 8, 83, 64, True); put(decor, 3, 85, 70)
ent('npc_umbra', 'umbra', 90 * 32, 257)
coins(8, 84, 88, 2)
put(ground, 8, 96, 42)
# ---- D: the long shadow bridge, a hidden ledge with a gem, the gallery
coins(7, 100, 106, 2)
hidden(6, 102, 104); ent('item_gem', 'gem', 103 * 32 + 8, 5 * 32 + 10, 16, 16)
ent('enemy_shadow_shade', 'shadow_shade', 110 * 32, 200)
ent('enemy_hollow_knight', 'hollow_knight', 114 * 32, 257)
chand(116); chand(121); coins(8, 115, 121, 3)
ent('enemy_shadow_shade', 'shadow_shade', 119 * 32, 180)
# ---- E: the dining hall
for c, t in ((128, 64), (129, 65), (130, 66), (131, 64)): put(decor, 8, c, t)
ent('item_heart', 'heart', 133 * 32 + 8, 8 * 32 + 10, 16, 16)
ledge(5, 134, 136); ent('enemy_stone_gargoyle', 'gargoyle', 135 * 32, 128)
ent('enemy_hollow_knight', 'hollow_knight', 142 * 32, 257)
put(ground, 8, 147, 42)
put(ground, 8, 150, 46); coins(3, 150, 153)
hidden(5, 154, 156); coins(4, 154, 156)
ent('enemy_shadow_shade', 'shadow_shade', 155 * 32, 220)
ent('checkpoint', 'checkpoint', 160 * 32, 224, 32, 64)
ent('item_heart', 'heart', 162 * 32 + 8, 8 * 32 + 10, 16, 16)
# ---- F: the throne hall (the last 20 columns): Mrak, Baba's cage behind him
ent('boss_mrak', 'mrak', 5568, 160, 128, 128)
ent('baba_cage', 'baba_cage', 5776, 192, 64, 96)
for c in (166, 170, 174): put(decor, 8, c, 67)

flat = lambda layer: [v for row in layer for v in row]
m = dict(compressionlevel=-1, height=H, width=W, infinite=False, orientation='orthogonal', renderorder='right-down', tilewidth=32, tileheight=32, type='map', version='1.10', tiledversion='1.10.2',
         nextlayerid=10, nextobjectid=len(ents) + 1, tilesets=[dict(firstgid=1, source='../tilesets/keep/tileset_keep.tsj')], layers=[])
for i, (n, px) in enumerate([('sky', 0), ('far', 0.2), ('mid', 0.45), ('near', 0.7)]):
    m['layers'].append(dict(id=i + 1, name='bg_' + n, type='imagelayer', image=f'../backgrounds/keep/bg_keep_{n}.png', repeatx=True, parallaxx=px, parallaxy=1, opacity=1, visible=True, x=0, y=0))
for i, (n, L) in enumerate([('decor_back', decor_back), ('ground', ground), ('decor', decor), ('foreground', fg)]):
    m['layers'].append(dict(id=5 + i, name=n, type='tilelayer', width=W, height=H, x=0, y=0, opacity=1, visible=True, data=flat(L)))
m['layers'].append(dict(id=9, name='entities', type='objectgroup', draworder='topdown', opacity=1, visible=True, x=0, y=0, objects=ents))
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'maps', 'keep_l4.tmj')
json.dump(m, open(out, 'w'), indent=1)
print('wrote', out, '| coins', sum(e['type'] == 'item_coin' for e in ents), '| gems', sum(e['type'] == 'item_gem' for e in ents))
