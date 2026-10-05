# Builds assets/maps/garden_l7.tmj (Level 7, The Lawn) from a column height map.
# Run: python3 tools/make_garden_map.py   (tile ids are tileset_garden.tsj ids; the .tmj stores id + 1)
import json, random, os
random.seed(11)
W, H = 60, 12
FLIP = 0x80000000
ground = [[0] * W for _ in range(H)]; decor_back = [[0] * W for _ in range(H)]; decor = [[0] * W for _ in range(H)]; fg = [[0] * W for _ in range(H)]
ents = []
def put(layer, r, c, tid, flip=False): layer[r][c] = (tid + 1) | (FLIP if flip else 0)
def ent(type_, name, x, y, w=32, h=32):
    ents.append(dict(id=len(ents) + 1, name=name, type=type_, x=x, y=y, width=w, height=h, rotation=0, visible=True))
def row(r, c0, ids, layer=None):
    for i, t in enumerate(ids): put(layer or ground, r, c0 + i, t)

# The garden at the kids' scale: a flat lawn (Misha mows it between the flower pots and the brick wall), two trees whose
# branches you reach from a bench or a table, the shed roof, a trampoline. Toys fall from the sky anywhere on the lawn.
for c in range(W):
    put(ground, 9, c, 1 if c % 2 == 0 else 3)
    put(ground, 10, c, 13); put(ground, 11, c, 16)
for c in range(W): put(decor_back, 8, c, 70)               # the fence along the back
put(decor_back, 8, 0, 71, True); put(decor_back, 8, W - 1, 71)
row(6, 1, [76, 77], decor); row(7, 1, [78, 79], decor); row(8, 1, [80, 81], decor)
ent('hero_kid', 'player_spawn', 3 * 32, 257)
put(ground, 7, 5, 46); put(ground, 8, 5, 47)              # flower pots: the left end of the lawn
row(8, 57, [48, 49, 50])                                  # brick wall: the right end
ent('misha', 'misha', 30 * 32, 288, 64, 48)
ent('lawn', 'lawn', 6 * 32, 288, (56 - 6) * 32, 32)       # where Misha mows and where the toys land
# blossom tree (reached from the bench)
row(4, 14, [18, 19, 20], fg); row(5, 14, [21, 22, 23], fg); row(6, 14, [24, 25, 26]); put(decor, 7, 15, 27); put(decor, 8, 15, 28)
row(8, 11, [40, 41]); put(decor, 8, 9, 64); put(decor, 8, 18, 62)
put(ground, 8, 22, 57)                                    # trampoline
row(7, 26, [51, 52, 53]); row(8, 26, [54, 55, 56], decor); put(decor, 8, 25, 65); put(decor, 8, 29, 67)
row(8, 37, [42, 43]); put(decor, 7, 33, 68); put(decor, 8, 33, 69)
# walnut tree (reached from the table... and the wheelbarrow)
row(4, 39, [29, 30, 31], fg); row(5, 39, [32, 33, 34], fg); row(6, 39, [35, 36, 37]); put(decor, 7, 40, 38); put(decor, 8, 40, 39)
row(8, 43, [44, 45]); put(decor, 8, 46, 63); put(decor, 8, 50, 66)
row(6, 51, [72, 73], decor_back); row(7, 51, [74, 75], decor_back); put(decor, 8, 54, 64)
flat = lambda layer: [v for row_ in layer for v in row_]
m = dict(compressionlevel=-1, height=H, width=W, infinite=False, orientation='orthogonal', renderorder='right-down', tilewidth=32, tileheight=32, type='map', version='1.10', tiledversion='1.10.2',
         nextlayerid=10, nextobjectid=len(ents) + 1, tilesets=[dict(firstgid=1, source='../tilesets/garden/tileset_garden.tsj')], layers=[])
for i, (n, px) in enumerate([('sky', 0), ('far', 0.2), ('mid', 0.45), ('near', 0.7)]):
    m['layers'].append(dict(id=i + 1, name='bg_' + n, type='imagelayer', image=f'../backgrounds/garden/bg_garden_{n}.png', repeatx=True, parallaxx=px, parallaxy=1, opacity=1, visible=True, x=0, y=0))
for i, (n, L) in enumerate([('decor_back', decor_back), ('ground', ground), ('decor', decor), ('foreground', fg)]):
    m['layers'].append(dict(id=5 + i, name=n, type='tilelayer', width=W, height=H, x=0, y=0, opacity=1, visible=True, data=flat(L)))
m['layers'].append(dict(id=9, name='entities', type='objectgroup', draworder='topdown', opacity=1, visible=True, x=0, y=0, objects=ents))
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'maps', 'garden_l7.tmj')
json.dump(m, open(out, 'w'), indent=1)
print('wrote', out, '| width', W)
