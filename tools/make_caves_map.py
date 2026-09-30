# Builds assets/maps/caves_l3.tmj (Level 3, Cinderdeep Caves) from a column height map.
# Run: python3 tools/make_caves_map.py   (tile ids are tileset_caves.tsj ids; the .tmj stores id + 1)
import json, random, os
random.seed(11)
W, H = 184, 12
FLIP = 0x80000000
ground = [[0] * W for _ in range(H)]; decor_back = [[0] * W for _ in range(H)]; decor = [[0] * W for _ in range(H)]; fg = [[0] * W for _ in range(H)]
ents = []
def put(layer, r, c, tid, flip=False): layer[r][c] = (tid + 1) | (FLIP if flip else 0)
def ent(type_, name, x, y, w=32, h=32):
    ents.append(dict(id=len(ents) + 1, name=name, type=type_, x=x, y=y, width=w, height=h, rotation=0, visible=True))

# ---- height map (None = lava)
h = [9] * W; lava = set()
def pit(c0, c1):
    for c in range(c0, c1 + 1): h[c] = None; lava.add(c)
pit(20, 21); pit(30, 34)
for c in range(93, 99): h[c] = 3                      # the plateau at the top of the trap climb
for c in range(99, 102): h[c] = 5
for c in range(102, 105): h[c] = 7
pit(113, 121)                                         # the salamander's pool
pit(142, 145)

for c in range(W):
    put(ground, 0, c, 17)                             # cave ceiling
    r = h[c]
    if r is None:
        put(ground, 9, c, 30); put(ground, 10, c, 29); put(ground, 11, c, 29); continue
    L = h[c - 1] if c > 0 else r; R_ = h[c + 1] if c < W - 1 else r
    lo = L is None or L > r; ro = R_ is None or R_ > r
    put(ground, r, c, 1 if lo and ro else 0 if lo else 2 if ro else 1)
    for y in range(r + 1, H):
        le = L is None or L > y; re = R_ is None or R_ > y
        put(ground, y, c, 15 if le and re else 8 if le else 10 if re else (random.choice([13, 14]) if random.random() < 0.07 else 9))

def ledge(r, c0, c1, ids=(19, 20, 21)):
    for c in range(c0, c1 + 1): put(ground, r, c, ids[0] if c == c0 else ids[2] if c == c1 else ids[1])
def crumble(r, c0, c1):
    for c in range(c0, c1 + 1): put(ground, r, c, 25)
def wall(c, r0, r1):
    for r in range(r0, r1 + 1): put(ground, r, c, 9)
def coins(r, c0, c1, step=1):
    for c in range(c0, c1 + 1, step): ent('item_coin', 'coin', c * 32 + 8, r * 32 + 10, 16, 16)
def lavafall(c, r):
    put(decor_back, r, c, 38); put(decor_back, r + 1, c, 42)
def bubble(c): ent('hazard_lava_bubble', 'lava_bubble', c * 32 + 8, 272, 16, 16)
def rock(c): ent('hazard_falling_rock', 'falling_rock', c * 32 + 8, 32, 16, 16)
for c in range(3, W, 7): put(decor, 1, c, 47)          # stalactites along the ceiling

# ---- A: the way in, the fire fox, Cinder
ent('hero_ice', 'player_spawn', 64, 257)
put(decor, 8, 2, 71); put(decor, 8, 5, 66); put(decor, 8, 8, 72); lavafall(12, 7)
coins(8, 3, 7, 2)
ent('companion_fire_fox', 'fire_fox', 11 * 32, 257)
ent('enemy_magma_slime', 'magma_slime', 16 * 32, 257)
bubble(20); coins(6, 19, 22)
ent('knight_statue', 'fire', 25 * 32, 257)
# ---- B: the first big lava pit (freeze it with ice)
ent('story_trigger', 'l3_lava', 27 * 32, 0, 32, 360)
ledge(5, 31, 33); coins(4, 31, 31); coins(4, 33, 33); ent('item_gem', 'gem', 32 * 32 + 8, 4 * 32 + 10, 16, 16); bubble(32)
lavafall(36, 7)
ent('enemy_ember_bat', 'ember_bat', 39 * 32, 32)
ent('enemy_cinder_golem', 'cinder_golem', 42 * 32, 257)
coins(8, 37, 41, 2)
# hidden high route: the steam vent blows you up into the roots
put(ground, 8, 45, 48)
ledge(3, 46, 55)
for c in range(45, 57): put(fg, 1, c, 61 if c == 45 else 63 if c == 56 else 62); put(fg, 2, c, 64)
coins(2, 47, 52); ent('item_gem', 'gem', 54 * 32 + 8, 2 * 32 + 10, 16, 16)
crumble(5, 56, 57)
ent('enemy_magma_slime', 'magma_slime', 50 * 32, 257)
ent('item_heart', 'heart', 57 * 32 + 8, 8 * 32 + 10, 16, 16)
# ---- C: the crystal grotto, falling rocks, checkpoint
put(ground, 7, 59, 53); put(ground, 7, 65, 53, True)
for c in range(60, 65): put(ground, 7, c, 54)
put(ground, 8, 59, 57); put(ground, 8, 65, 57, True)
for c in range(60, 65): put(decor_back, 8, c, 59 if c == 62 else 55); put(fg, 8, c, 60)
coins(8, 60, 62); ent('item_gem', 'gem', 64 * 32 + 8, 8 * 32 + 10, 16, 16)
rock(68); rock(70); put(decor, 8, 69, 70)
ent('checkpoint', 'checkpoint', 72 * 32, 224, 32, 64)
# ---- D: the trap (cols 74-93): a gate slams, the lava rises, climb out
ent('trap_zone', 'trap', 74 * 32, 0, 640, 360)
ent('cave_gate', 'gate', 75 * 32, 192, 32, 96)
wall(75, 1, 5)
ledge(7, 84, 88, (22, 23, 24)); ledge(5, 78, 82, (22, 23, 24)); ledge(3, 84, 92, (22, 23, 24))
coins(6, 85, 87); coins(4, 79, 81); coins(2, 86, 90, 2)
put(decor, 8, 77, 68); put(decor, 8, 80, 69)
ent('knight_statue', 'lightning', 103 * 32, 7 * 32 - 31)
ent('item_heart', 'heart', 96 * 32 + 8, 2 * 32 + 10, 16, 16)
coins(4, 99, 101); coins(6, 102, 104)
# ---- E: the Lava Salamander's pool (arena cols 108-127)
ent('sal_arena', 'salamander_arena', 108 * 32, 0, 640, 360)
ent('boss_lava_salamander', 'lava_salamander', 117 * 32 - 32, 288 - 58, 64, 64)
ledge(6, 114, 120)
put(decor, 8, 110, 73)                                 # Baba's red yarn on a rock
coins(5, 115, 119, 2)
# ---- F: bats, slimes, a golem, another pool, rocks
ent('enemy_ember_bat', 'ember_bat', 132 * 32, 32)
ent('enemy_magma_slime', 'magma_slime', 135 * 32, 257)
ent('item_heart', 'heart', 138 * 32 + 8, 8 * 32 + 10, 16, 16)
ent('enemy_cinder_golem', 'cinder_golem', 139 * 32, 257)
bubble(143); coins(6, 142, 145); lavafall(147, 7)
ent('enemy_ember_bat', 'ember_bat', 146 * 32, 32)
put(ground, 8, 150, 46)
ent('enemy_magma_slime', 'magma_slime', 153 * 32, 257)
rock(155); rock(157); coins(8, 154, 158, 2)
ent('checkpoint', 'checkpoint', 160 * 32, 224, 32, 64)
ent('item_heart', 'heart', 162 * 32 + 8, 8 * 32 + 10, 16, 16)
# ---- G: the Magma Colossus's hall (the last 20 columns)
ent('boss_magma_colossus', 'magma_colossus', 5600, 192, 96, 96)
ent('exit_arch', 'exit', 5760, 192, 64, 96)
for c in (166, 170): put(decor, 8, c, 67)

flat = lambda layer: [v for row in layer for v in row]
m = dict(compressionlevel=-1, height=H, width=W, infinite=False, orientation='orthogonal', renderorder='right-down', tilewidth=32, tileheight=32, type='map', version='1.10', tiledversion='1.10.2',
         nextlayerid=10, nextobjectid=len(ents) + 1, tilesets=[dict(firstgid=1, source='../tilesets/caves/tileset_caves.tsj')], layers=[])
for i, (n, px) in enumerate([('sky', 0), ('far', 0.2), ('mid', 0.45), ('near', 0.7)]):
    m['layers'].append(dict(id=i + 1, name='bg_' + n, type='imagelayer', image=f'../backgrounds/caves/bg_caves_{n}.png', repeatx=True, parallaxx=px, parallaxy=1, opacity=1, visible=True, x=0, y=0))
for i, (n, L) in enumerate([('decor_back', decor_back), ('ground', ground), ('decor', decor), ('foreground', fg)]):
    m['layers'].append(dict(id=5 + i, name=n, type='tilelayer', width=W, height=H, x=0, y=0, opacity=1, visible=True, data=flat(L)))
m['layers'].append(dict(id=9, name='entities', type='objectgroup', draworder='topdown', opacity=1, visible=True, x=0, y=0, objects=ents))
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'maps', 'caves_l3.tmj')
json.dump(m, open(out, 'w'), indent=1)
print('wrote', out, '| coins', sum(e['type'] == 'item_coin' for e in ents), '| gems', sum(e['type'] == 'item_gem' for e in ents))
