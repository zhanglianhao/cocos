/*
#CC.TiledMap:*****************************************
~properties:
tmxFile//地图文件
mapLoaded//地图加载是调用的函数
~function:
getMapSize()//图层尺寸，以瓦块为单位
setMapSize()//
getTileSize()//瓦块尺寸
setTileSize()//
getLayer(name)//returns TieldLayer
getObjectGroup(name)//returns TMXObjectGroup
getPropertiesForGID(GID)//returns Object(属性字典)

#CC.TieldLayer    ********************************************
getPositionAt(pos)//returns Vec2(像素坐标) 参数是瓦片坐标
removeTileAt(pos)//瓦片坐标
getTileGIDAt(pos)//returns Number(全局唯一标识，0为空)
getTileAt(pos)//returns _ccsg.Sprite   //removeChild(sprite);
setTileGID(gid，pos)//相当于在pos位置添加GID的图块（原来的图块删除）
getTileSize()//
setTleSize()//
getMapTileSize()

#TMXObjectGroup:   ******************************************
~properties:
~function:
var getObject(var objectName)//返回属性字典
#_ccsg.Sprite://cocos js 里的Sprite，继承自CC.Node,而不是组件
~properties：
x
y
width
height
opacity
...//节点的属性都有
~function:
var setSpriteFrame(var spriteFrameName)
var runAction(var action)
...//节点的方法都有

 
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        endd: {
            default: null,
            type: cc.Node,
        },
        tsx: {
            default: [],
            type: [cc.TiledMapAsset],
        },
        player: {
            default: null,
            type: cc.Node,
        },
        enemy: {
            default: null,
            type: cc.Prefab
        },
        goods: {
            default: [],
            type: [cc.Prefab]
        },
        players: {
            default: null,
            type: cc.Prefab
        },
        menu: {
            default: null,
            type: cc.Node,
        },
        men_state: {
            default: null,
            type: cc.Node,
        },
        add: {
            default: null,
            type: cc.Prefab,
        },
        dec: {
            default: null,
            type: cc.Prefab,
        },
        round: {
            default: null,
            type: cc.Label,
        },
        res: {
            default: null,
            type: cc.Node,
        },
        level: {
            default: null,
            type: cc.Label,
        },
        skilldis: {
            default: null,
            type: cc.Node,
        },
        Skill: {
            default: [],
            type: [cc.Label],
        },
        skill_des: {
            default: null,
            type: cc.Label,
        },
        curedis: {
            default: null,
            type: cc.Node,
        },
        hurtdis: {
            default: null,
            type: cc.Node,
        },
        exp: {
            default: null,
            type: cc.Label,
        },
        jineng: {
            default: null,
            type: cc.Label,
        },
        //升级加点
        pointup: {
            default: null,
            type: cc.Node,
        },
        itemuse: {
            default: null,
            type: cc.Node,
        },
        terrain: {
            default: null,
            type: cc.Prefab,
        },
        terdis: {
            default: null,
            type: cc.Label,
        },
        blow: {
            default: null,
            type: cc.Prefab,
        },


    },

    /*skill
     * 
        this.Lv = element[0];
        this.type = element[1];
        this.ATK = element[2];
        this.DEF = element[3];
        this.INT = element[4];
        this.MP = element[5];
        this.HP = element[6];
        this.string = element[7];
         element[8] description
        this.range = element[9];
     */

    // use this for initialization
    onLoad: function () {
        //
        // this.tsx = new Array();
        cc.log(cc.visibleRect);
        this.endd.setPosition(cc.p(cc.visibleRect.topRight.x - 100, cc.visibleRect.topRight.y-30));
        this.round.node.setPosition(cc.p(cc.visibleRect.topLeft.x / 2 + cc.visibleRect.topRight.x / 2 - 30, cc.visibleRect.topRight.y - 30));
        this.level.node.setPosition(cc.p(cc.visibleRect.topLeft.x+60, cc.visibleRect.topRight.y - 30));

        this.game = new gameparam();
        this.game.min_player = 8;
        this.game.max_player = 12;
        this.game.min_enemy = 2;
        this.game.max_enemy = 3;
        this.game.enemy_touch = 0;
        this.game.level = 1;
        this.game.lv_flag = 0;
        this.game.skill_flag = new Array();
        for (var i = 0; i < 4; i++)
            this.game.skill_flag[i] = 0;
        this.game.exp = new Array();
        this.game.exp = [10, 30, 80, 150, 250, 400,600,800,1000];
        // cc.log(this.game.exp[3]);
        //     this.game.player_flag = 1;
        //     this.game.enemy_flag = 0;
        //  cc.log(1234);
        this.cou = 0;//men id
        this.num = new Array();

        var ski;
        this.game.skill_group = new person();
        //skill type:0 hurt;type:1 cure
        ski = new skill();
        ski.init([1, 0, 1.2, 10, 10, 10, 0, "火球术", "威力1.2 范围：1", 1]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([2, 0, 1.4, 10, 10, 20, 0, "百万火焰", "威力1.4 范围：1", 1]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([3, 0, 1.6, 10, 10, 30, 0, "千万火焰", "威力1.6 范围：2", 2]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([4, 0, 1.8, 10, 10, 40, 0, "无尽火焰", "威力1.8 范围：3", 3]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([5, 0, 2.5, 10, 10, 70, 0, "炎魔", "威力2.5 范围：5", 5]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([1, 1, 0, 10, 10, 10, 30, "治疗术", "恢复少量Hp 范围：0", 0]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([2, 1, 0, 10, 10, 20, 50, "中级治疗术", "恢复中量Hp 范围：1", 1]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([3, 1, 0, 10, 10, 30, 90, "大治疗术", "恢复大量Hp 范围：1", 1]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([4, 1, 0, 10, 10, 50, 150, "终极治疗术", "恢复超量Hp 范围：2", 2]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        ski = new skill();
        ski.init([5, 1, 0, 10, 10, 70, 1000, "天使之吻", "恢复全部Hp 范围：4", 4]);
        this.game.skill_group.insert(ski, this.game.skill_group.getsize());

        // cc.log(this.game.skill_group.find(5, 1).string);
        this.loadMap();
        
        this.game.player_map = new Array();
        for (var i = 0; i < this.tiledMap.getMapSize().width; i++)
            this.game.player_map[i] = new Array();
        this.game.enemy_map = new Array();
        for (var i = 0; i < this.tiledMap.getMapSize().width; i++)
            this.game.enemy_map[i] = new Array();
        this.game.item_map = new Array();
        for (var i = 0; i < this.tiledMap.getMapSize().width; i++)
            this.game.item_map[i] = new Array();
        this.game.terrain_map = new Array();
        for (var i = 0; i < this.tiledMap.getMapSize().width; i++)
            this.game.terrain_map[i] = new Array();
        this.jiazaiterrian();//terrian加载
        this.restart();
        // this.player = this.node.getChildByName('player');
        /*
         鼠标事件类型

cc.Node.EventType.MOUSE_DOWN:当鼠标在目标节点区域按下时触发一次 _prevX                          事件名：‘mousedown’

cc.Node.EventType.MOUSE_ENTER:当鼠标移入目标节点区域时，不论是否按下                           事件名：‘mouseenter’

cc.Node.EventType.MOUSE_MOVE:当鼠标在目标节点在目标节点区域中移动时，不论是否按下    事件名：‘mousemove’

cc.Node.EventType.MOUSE_LEAVE:当鼠标移动出目标节点区域是，不论是否按下                         事件名：'mouseleave'

cc.Node.EventType.MOUSE_UP:当鼠标从按下状态松开时触发一次                                                  事件名：‘mouseup’

cc.Node.EventType.MOUSE_WHEEL:当鼠标滚轮滚动时                                                                    事件名：‘mousewheel’



触摸事件

触摸事件在移动平台和桌面平台都会触发。

cc.Node.EventType.TOUCH_START:当手指触点露在目标节点区域时currentTouch._point                                    事件名：‘touchstart’

cc.Node.EventType.TOUCH_MOVE:当手指在屏幕上目标点区域内移动时                                         事件名:'touchmove'

cc.Node.EventType.TOUCH_END:当手指在目标节点区域内离开屏幕时                                            事件名：‘touchend’

cc.Node.EventType.TOUCH_CANCEL:当手指在目标节点区域外离开屏幕时                                     事件名：'touchcancel'
         
         */
        //self = this;
        if (1) {
            this.down = 'mousedown';
            this.up = 'mouseup';
            this.move = 'mousemove';
            this.downup = 0;
        }
        else {
            this.down = 'touchstart';
            this.up = 'touchend';
            this.move = 'touchmove';
        }

        this.node.on(this.down, function (event) {
            //  cc.log(this.node.getPosition());
            //event.currentTouch._point为引用类型
            // cc.log(event);
            if (this.down == 'mousedown')
                this.downup = 1;

            if (this.game.lv_flag == 1)
                return;
            


            if (this.game.enemy_touch == 1) {
                this.game.enemy_touch = 0;
                this.game.current_player = null;
            }
            var x, y;
            if (this.down == 'mousedown') {
                x = Math.floor(event._prevX);
                y = Math.floor(event._prevY);
            }
            else {
                x = event.currentTouch._point.x;
                y = event.currentTouch._point.y;
            }
            var pos = cc.p(x,y);            
            pos = this.gettilepos(pos);
            if (this.game.terrain_map[pos.x][pos.y] != null) {
                this.terdis.string = "攻击力+" + this.game.terrain_map[pos.x][pos.y].ATK + "防御力+" + this.game.terrain_map[pos.x][pos.y].DEF;
            }

            if (this.menu.active == true)
                this.menu.active = false;
            if (this.men_state.active == true)
                this.men_state.active = false;
            if (this.skilldis.active == true)
                this.skilldis.active = false;
            if (this.game.itemflag == 1)
                this.game.itemflag = 0;

            if (this.game.current_player != null && (this.game.current_player.move_flag == 1 || this.game.current_player.attack_flag == 1)) {
                if (this.game.current_player.move_flag == 1) {
                    this.onmove(pos);
                }
                else if (this.game.current_player.attack_flag == 1) {
                    cc.log("attack");
                    this.onattack(pos);
                }
            }

            this.startpos = cc.p(x, y);
            this.map_pos = cc.p(this.node._position.x, this.node._position.y);

        }.bind(this)),
            this.node.on(this.move, function (event) {
            if (this.down == 'mousedown' && this.downup == 0)
                return;

                //  cc.log(this.move);    
                if (this.game.lv_flag == 1)
                    return;
            var pos;
            var x, y;
            if (this.down == 'mousedown') {
                x = Math.floor(event._prevX);
                y = Math.floor(event._prevY);
            }
            else {
                x = event.currentTouch._point.x;
                y = event.currentTouch._point.y;
            }
                pos= cc.p(x, y);
                pos = this.gettilepos(pos);
                if (this.game.current_player != null && this.game.current_player.skill_flag == 1) {
                    if ((Math.abs(pos.x - this.game.current_player.gettile().x) + Math.abs(pos.y - this.game.current_player.gettile().y)) <= this.game.current_player.getattack_range()) {
                        this.game.current_player.getobj().getComponent('player').skillclose();
                        this.game.current_player.getobj().getComponent('player').onskilldisplay(pos, null);
                    }
                }
                else {
                    this.move = cc.p(x - this.startpos.x, y - this.startpos.y);
                    let newpos = cc.p(this.map_pos.x + this.move.x, this.map_pos.y + this.move.y);
                    if (newpos.x >= 0)
                        newpos.x = 0;
                    if (newpos.y >= 0)
                        newpos.y = 0;
                    if (newpos.x <= (cc.visibleRect.topRight.x - this.node.getContentSize().width))
                        newpos.x = (cc.visibleRect.topRight.x - this.node.getContentSize().width);
                    if (newpos.y <= (cc.visibleRect.topRight.y - this.node.getContentSize().height))
                        newpos.y = (cc.visibleRect.topRight.y - this.node.getContentSize().height);

                    this.node.setPosition(newpos);
                    this.updatePlayerPos();

                }



            }.bind(this)),
            this.node.on(this.up, function (event) {
            if (this.terdis.string != "")
                this.terdis.string = "";

            if (this.down == 'mousedown')
                this.downup = 0;
            if (this.down == 'mousedown'&&this.mouse_up == 1) {
                this.mouse_up = 0;
                return;
            }

           // cc.log("mouseup");
                if (this.game.lv_flag == 1)
                    return;
            var x, y;
            if (this.down == 'mousedown') {
                x = Math.floor(event._prevX);
                y = Math.floor(event._prevY);
            }
            else {
                x = event.currentTouch._point.x;
                y = event.currentTouch._point.y;
            }
            var pos = cc.p(x, y);
                pos = this.gettilepos(pos);

                if (this.game.current_player != null && this.game.current_player.skill_flag == 1) {
                    this.game.current_player.getobj().getComponent('player').skillclose();
                    this.game.current_player.getobj().getComponent('player').close();
                    this.game.current_player.skill_flag = 0;

                    this.jineng.node.active = false;

                    for (var m = 0; m < this.game.enemy_group.getsize(); m++)
                        this.game.enemy_group.find(m, 1).getobj().getComponent(cc.Button).interactable = true;
                    for (var m = 0; m < this.game.player_group.getsize(); m++)
                        this.game.player_group.find(m, 1).getobj().getComponent(cc.Button).interactable = true;

                    if ((Math.abs(pos.x - this.game.current_player.gettile().x) + Math.abs(pos.y - this.game.current_player.gettile().y)) <= this.game.current_player.getattack_range())
                        this.skilldetect(pos);
                }

            }.bind(this)),

            cc.systemEvent.on(
                cc.SystemEvent.EventType.KEY_DOWN,
                function onKeyPressed(event) {
                    //  var newTile = cc.p(this.playerTile.x, this.playerTile.y);
                    var ene, enermy, i;
                    this.newTile = cc.p(this.playerTile.x, this.playerTile.y);
                    switch (event.keyCode) {
                        case cc.KEY.up:
                            //   if (++this.count >= this.ditu.getsize())
                            //       this.count = 0;
                            //    cc.log(this.count);
                            //     this.changemap(this.ditu.find(this.count).element);
                            if (this.current.up != null) {
                                this.current = this.current.up;
                                this.changemap(this.current.element);
                            }


                            this.newTile.y -= 1;
                            break;
                        case cc.KEY.down:
                            this.newTile.y += 1;
                            //    this.ditu.remove(1);
                            //map change
                            if (this.current.down != null) {
                                this.current = this.current.down;
                                this.changemap(this.current.element);
                            }

                            //测试数据

                            //    this.personpool.find(8, 1).settile(cc.p(1, 7));
                            /*     this.personpool.sortentire(this.personpool);
                                 for (i = 0; i < 9; i++) {
         
         
                                     cc.log(this.personpool.find(i, 1).gettype());
                                     if (this.personpool.find(i, 1).gettype() == 0) {
                                         
                                         cc.log(this.personpool.find(i, 1).nearenemy.getid());
                                         cc.log(this.personpool.find(i, 1).nearnpc.getid());
                                     }
                                     else if (this.personpool.find(i, 1).gettype() == 1) {
                                         cc.log(this.personpool.find(i, 1).nearplayer.getid());
                                        
                                         cc.log(this.personpool.find(i, 1).nearnpc.getid());
                                     }
                                     else if (this.personpool.find(i, 1).gettype() == 2) {
                                         cc.log(this.personpool.find(i, 1).nearplayer.getid());
                                         cc.log(this.personpool.find(i, 1).nearenemy.getid());
                                        
                                     }
                                 }
         */
                            break;
                        case cc.KEY.left:
                            this.newTile.x -= 1;
                            if (this.current.left != null) {
                                this.current = this.current.left;
                                this.changemap(this.current.element);
                            }
                            //  this.personpool.insert(enermy,0);
                            //   ene.getComponent('enemy').init(this);

                            break;
                        case cc.KEY.right:
                            this.newTile.x += 1;
                            if (this.current.right != null) {
                                this.current = this.current.right;
                                this.changemap(this.current.element);
                            }
                            break;
                        default:
                            return;
                    }
                    this.tryMoveToNewTile(this.newTile);
                }
                , this);
    },
    jiazaiterrian: function () {
        var terrian_count;
        var te;
        var ene;
        this.terrian_count = Math.floor(20 + 10 * Math.random());
        for (var i = 0; i < this.terrian_count; i++) {
            ene = cc.instantiate(this.terrain);
            ene.parent = this.node;

            this.num[0] = Math.floor(this.game.level * 5 + Math.random() * this.game.level * 2);
            this.num[1] = Math.floor(this.game.level * 3 + Math.random() * this.game.level);
            this.num[2] = ene;

            te = new ter(this.num);
            te.init(this.num);//数据初始化
            var x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
            var y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
            while (this.game.terrain_map[x][y] != null) {
                x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
                y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
            }
            ene.setPosition(this.getpostile(cc.p(x, y)));
            this.game.terrain_map[x][y] = te;
        }
    },

    //map切换时更新player位置或一些新图层的加载
    restart: function () {
        //全局参数

        this.level.string = "第" + this.game.level + "关";

        this.game.round_cound = 0;
        this.round.string = "第" + this.game.round_cound + "回合";


        this.game.player_flag = 1;
        this.game.enemy_flag = 0;
        this.game.death = 0;
        this.game.itemflag = 0;
        if (this.game.level == 1)
            this.game.player_group = new person();

        this.game.enemy_group = new person();
        this.game.npc_group = new person();


        this.Menu_flag = new Menu();
        this.Menu_flag.state_flag = 1;
        this.Menu_flag.standby_flag = 1;

        this.playerTile = cc.p(0, 0);
        this.newTile = cc.p(0, 0);



        this.count = -1;

        if (this.game.level == 1)
            this.personpool = new person();

        

        for (var i = 0; i < this.tiledMap.getMapSize().width; i++)
            for (var j = 0; j < this.tiledMap.getMapSize().height; j++) {
                if (this.game.item_map[i][j] != null) {
                    this.game.item_map[i][j].obj.destroy();
                }
            }

        for (var i = 0; i < this.tiledMap.getMapSize().width; i++)
            for (var j = 0; j < this.tiledMap.getMapSize().height; j++) {
                if (this.game.level == 1)
                    this.game.player_map[i][j] = null;

                this.game.enemy_map[i][j] = null;
                this.game.item_map[i][j] = null;
            }


        

        var player_count;
        var enemy_count;
        var item_count;
        var iitem;
        var ene;
        var play;
        var enermy;
        
        //create item
        //this.string = element[0];
        //this.HP = element[1];
        //this.count = element[2];
        //this.obj = element[3];
        //this.descrip = element[4];
        //this.MP = element[5];
        item_count = Math.floor(5 + (5 + this.game.level) * Math.random());
        for (var i = 0; i < item_count; i++) {
            var index = Math.floor(Math.random() * 6);
            ene = cc.instantiate(this.goods[index]);
            ene.parent = this.node;
            if (index == 0) {
                this.num[0] = "止血草";
                this.num[1] = 20;
                this.num[2] = 1;
                this.num[3] = ene;
                this.num[4] = "恢复少量血量";
                this.num[5] = 0;
            }
            else if (index == 1) {
                this.num[0] = "金创药";
                this.num[1] = 100;
                this.num[2] = 1;
                this.num[3] = ene;
                this.num[4] = "恢复中量血量";
                this.num[5] = 0;
            }
            else if (index == 2) {
                this.num[0] = "还神丹";
                this.num[1] = 0;
                this.num[2] = 1;
                this.num[3] = ene;
                this.num[4] = "恢复少量魔法";
                this.num[5] = 20;
            }
            else if (index == 3) {
                this.num[0] = "九花玉露丸";
                this.num[1] = 300;
                this.num[2] = 1;
                this.num[3] = ene;
                this.num[4] = "恢复大量血量";
                this.num[5] = 0;
            }
            else if (index == 4) {
                this.num[0] = "天仙玉露";
                this.num[1] = 0;
                this.num[2] = 1;
                this.num[3] = ene;
                this.num[4] = "恢复大量魔法";
                this.num[5] = 200;
            }
            else if (index == 5) {
                this.num[0] = "灵山仙芝";
                this.num[1] = 0;
                this.num[2] = 1;
                this.num[3] = ene;
                this.num[4] = "恢复中量魔法";
                this.num[5] = 80;
            }
            iitem = new item(this.num);
            iitem.init(this.num);//数据初始化
            var x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
            var y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
            while (this.game.player_map[x][y] != null || this.game.enemy_map[x][y] != null || this.game.item_map[x][y] != null || this.game.terrain_map[x][y] != null) {
                x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
                y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
            }
            ene.setPosition(this.getpostile(cc.p(x, y)));
            this.game.item_map[x][y] = iitem;
        }

        //create player 
        if (this.game.level == 1) {
            player_count = Math.floor(this.game.min_player + (this.game.max_player - this.game.min_player) * Math.random());
            for (var i = 0; i < player_count; i++) {
                ene = cc.instantiate(this.players);
                this.num[0] = 100;
                this.num[1] = 100;
                this.num[2] = Math.floor(8 + Math.random() * 5);
                this.num[3] = Math.floor(5 + Math.random() * 5);
                this.num[4] = Math.floor(10 + Math.random() * 5);
                this.num[5] = Math.floor(5 + Math.random() * 5);
                this.num[10] = 1;
                this.num[6] = ene;
                this.num[7] = this.cou++;
                this.num[8] = 3;//move range
                this.num[9] = 0;
                this.num[11] = Math.floor(2 * Math.random());//defence cure type
                play = new player(this.num);
                play.ini(this.num);//数据初始化
                play.skill = new Array();
                play.skill[0] = new person();
                play.skill[1] = new person();
                play.skill[2] = new person();
                play.item = new person();
                // play.cure = new person();
                this.personpool.insert(play, 0);
                ene.getComponent('player').init(this);
                var x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
                var y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
                while (this.game.player_map[x][y] != null || this.game.enemy_map[x][y] != null || this.game.item_map[x][y] != null || this.game.terrain_map[x][y] != null) {
                    x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
                    y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
                }
                this.game.player_map[x][y] = play;
                play.settile(cc.p(x, y));
                ene.getComponent('player').updatapos();
            }

        }

        //  cc.log(this.personpool.getsize());
        //create enemy
        enemy_count = Math.floor((this.game.min_enemy * this.game.level + (this.game.max_enemy - this.game.min_enemy) * Math.random()) * this.game.level * 0.7);
        for (var i = 0; i < enemy_count; i++) {
            ene = cc.instantiate(this.enemy);
            this.num[0] = 0 + this.game.level*50;
            this.num[1] = 100;
            this.num[2] = Math.floor(6 * this.game.level + Math.random() * 5 * this.game.level);
            this.num[3] = Math.floor(3 * this.game.level + Math.random() * 4 * this.game.level);
            this.num[4] = Math.floor(6 * this.game.level + Math.random() * 5 * this.game.level);
            this.num[5] = Math.floor(1 * this.game.level + Math.random() * 5 * this.game.level);
            this.num[10] = this.game.level;//Lv
            this.num[6] = ene;
            this.num[7] = this.cou++;
            this.num[8] = Math.floor(2 + this.game.level * 0.2);
            this.num[9] = 0;
            this.num[11] = Math.floor(2 * Math.random());
            enermy = new enemy(this.num);
            enermy.ini(this.num);//数据初始化
            enermy.skill = new Array();
            enermy.skill[0] = new person();
            enermy.skill[1] = new person();
            enermy.skill[2] = new person();
            this.personpool.insert(enermy, 0);
            ene.getComponent('enemy').init(this);
            var x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
            var y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
            while (this.game.player_map[x][y] != null || this.game.enemy_map[x][y] != null || this.game.item_map[x][y] != null || this.game.terrain_map[x][y] != null) {
                x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
                y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
            }
            this.game.enemy_map[x][y] = enermy;
            enermy.settile(cc.p(x, y));
            ene.getComponent('enemy').updatapos();

        }
        
        

        this.personpool.sortentire(this.personpool);
        this.player_init();
        //  cc.log(1234);
        this.group();
        for (var i = 0; i < this.game.player_group.getsize(); i++) {
            this.game.player_group.find(i, 1).MP = this.game.player_group.find(i, 1).MP_max;
        }
        //create terrian
        //this.ATK = element[0];
        //this.DEF = element[1];
        // this.obj = element[2];
        //var terrian_count;
        // var te;
        for (var i = 0; i < this.tiledMap.getMapSize().width; i++)
            for (var j = 0; j < this.tiledMap.getMapSize().height; j++) {

                if (this.game.terrain_map[i][j] != null) {
                    this.num[0] = Math.floor(this.game.level * 5 + Math.random() * this.game.level * 2);
                    this.num[1] = Math.floor(this.game.level * 3 + Math.random() * this.game.level);
                    this.game.terrain_map[i][j].ATK = this.num[0];
                    this.game.terrain_map[i][j].DEF = this.num[1];

                    var x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
                    var y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
                    while (this.game.player_map[x][y] != null || this.game.enemy_map[x][y] != null || this.game.item_map[x][y] != null || this.game.terrain_map[x][y] != null) {
                        x = Math.floor(this.tiledMap.getMapSize().width * Math.random());
                        y = Math.floor(this.tiledMap.getMapSize().height * Math.random());
                    }

                    this.game.terrain_map[x][y] = this.game.terrain_map[i][j];
                    this.game.terrain_map[i][j] = null;
                    this.game.terrain_map[x][y].obj.setPosition(this.game.player_group.find(0, 1).getobj().getComponent('player').getpostile(cc.p(x, y)));
                }
            }


        this.skillgroup();//初始技能分配
        this.terriangroup();//初始地形加成


    },
    //加载地图文件时调用
    loadMap: function () {
        this.ditu = new mmap();
        for (let i = 0; i < 4; i++)
            this.ditu.insert(this.tsx[i], i);
        for (let i = 0; i < 4; i++)
            this.ditu.insert(this.tsx[i], 4);
        this.ditu.relation(0, 1, 2);
        this.ditu.relation(1, 3, 3);
        this.ditu.relation(3, 2, 2);
        this.ditu.relation(2, 4, 1);
        this.ditu.relation(4, 1, 0);
        this.current = this.ditu.gethead();


        this.node.setPosition(cc.visibleRect.bottomLeft);

        this.node.setPosition(cc.p(0, 0));
        this.tiledMap = this.node.getComponent(cc.TiledMap);
       // this.tiledMap.tmxAsset = this.tsx[1];
       // this.barriers = this.tiledMap.getObjectGroup('barriers');
       // this.stars = this.tiledMap.getObjectGroup('stars');
        /*     cc.log(this.players.getTileGIDAt(cc.p(3,3)));
             for (var i = 1; i < this.tiledMap.getMapSize().width; i++)
                 for (var j = 1; j < this.tiledMap.getMapSize().height; j++) {
                     if (this.players.getTileGIDAt(cc.p(i, j))!=null)
                     cc.log(this.players.getTileGIDAt(cc.p(i, j)));
                 }
       */
    },

    //move way
    onmove: function (pos) {
        if (this.game.player_map[pos.x][pos.y] == null && this.game.enemy_map[pos.x][pos.y] == null && (Math.abs(pos.x - this.game.current_player.gettile().x) + Math.abs(pos.y - this.game.current_player.gettile().y)) <= this.game.current_player.getrange()) {
            // this.game.current_player.settile(pos);
            this.game.current_player.move_flag = 0;
            this.game.current_player.getobj().getComponent('player').move(pos);
            this.game.current_player.setstate(1);
            this.game.current_player.getobj().getComponent('player').close();
            this.game.current_player = null;

            this.game.player_flag = 0;
        }
        else
            cc.log("range move area");
    },

    lvdisplay: function () {
        this.pointup.active = true;
        this.pointup.getChildByName('ATK').getComponent(cc.Label).string = "攻击力 " + this.game.current_player.ATK ;
        this.pointup.getChildByName('DEF').getComponent(cc.Label).string = "防御力 " + this.game.current_player.DEF ;
        this.pointup.getChildByName('HP').getComponent(cc.Label).string = "血量上限 " + this.game.current_player.HP_max;
        this.pointup.getChildByName('MP').getComponent(cc.Label).string = "魔法上限 " + this.game.current_player.MP_max;
        this.pointup.getChildByName('RAN').getComponent(cc.Label).string = "移动范围 " + this.game.current_player.getrange();
        this.pointup.getChildByName('ATK_RAN').getComponent(cc.Label).string = "攻击范围 " + this.game.current_player.getattack_range();
        this.pointup.getChildByName('over').getComponent(cc.Label).string = "剩余点数 " + this.game.current_player.point + "   当前级别" + this.game.current_player.Lv;
    },


    levelup: function () {
        this.game.lv_flag = 1;
        this.game.current_player.point += this.game.current_player.Lv * 5;

        this.game.current_player.Lv++;
        for (var i = 0; i < this.game.skill_group.getsize(); i++) {
            if (this.game.skill_group.find(i, 1).Lv == this.game.current_player.Lv && this.game.skill_group.find(i, 1).type == this.game.current_player.play_type) {
                this.game.current_player.skill[this.game.skill_group.find(i, 1).type].insert(this.game.skill_group.find(i, 1), this.game.current_player.skill[this.game.skill_group.find(i, 1).type].getsize());
            }
        }
    },

    //attack formula
    onattack: function (pos) {
        if ((Math.abs(pos.x - this.game.current_player.gettile().x) + Math.abs(pos.y - this.game.current_player.gettile().y)) <= this.game.current_player.getattack_range()) {
            // this.game.current_player.settile(pos);
            if (this.game.enemy_map[pos.x][pos.y] != null) {
                this.game.current_player.attack_flag = 0;
                this.game.current_player.getobj().getComponent('player').close();
                var hp = (this.game.current_player.ATK + this.game.current_player.ATK_aid - (this.game.enemy_map[pos.x][pos.y].DEF + this.game.enemy_map[pos.x][pos.y].DEF_aid)) <= 0 ? 0 : Math.floor(this.game.current_player.ATK + this.game.current_player.ATK_aid - (this.game.enemy_map[pos.x][pos.y].DEF + this.game.enemy_map[pos.x][pos.y].DEF_aid));
                this.game.enemy_map[pos.x][pos.y].HP -= hp;
                this.game.current_player.exp += Math.floor(this.game.enemy_map[pos.x][pos.y].HP < 0 ? (this.game.enemy_map[pos.x][pos.y].HP+hp)*0.2:hp * 0.2);
                while (this.game.current_player.exp >= this.game.exp[this.game.current_player.Lv - 1])
                    this.levelup();
                if (this.game.lv_flag == 1) {
                   
                    this.lvdisplay();
                }


                this.blooddisplay(this.game.player_group.find(0, 1).getobj().getComponent('player').getpostile(pos), -1 * hp);
                //血量低于0,移除

                this.game.current_player.setstate(2);
                this.game.current_player.getobj().opacity = 150;
                this.ondeath(this.game.enemy_map[pos.x][pos.y], pos);

                for (var m = 0; m < this.game.enemy_group.getsize(); m++)
                    this.game.enemy_group.find(m, 1).getobj().getComponent(cc.Button).interactable = true;

                this.ondetection();
            }

            else
                cc.log("no enemy");
        }
        else
            cc.log("range attack area");
    },
    //检测enemy是否death
    ondeath: function (enemy, pos) {
        //血量低于0,移除
        if (enemy.HP <= 0) {
            this.game.enemy_group.removeobj(enemy, 1);
            this.personpool.removeperson(enemy, this.personpool);
            enemy.getobj().destroy();
            this.game.enemy_map[pos.x][pos.y] = null;
            if (this.game.enemy_group.getsize() == 0) {
                this.game.level++;
                this.player_init();
                this.restart();
                return 1;
            }

        }
    },


    onbuttonmove: function () {
        if (this.Menu_flag.move_flag == 0)
            return;

        this.game.current_player.move_flag = 1;
        this.game.current_player.getobj().getComponent('player').display();

        this.menu.active = false;
        cc.log("move");
    },
    onbuttonattack: function () {
        if (this.Menu_flag.attack_flag == 0)
            return;

        this.game.current_player.attack_flag = 1;
        this.game.current_player.getobj().getComponent('player').display();
        this.menu.active = false;
        cc.log(this.game.enemy_group.getsize());
        for (var m = 0; m < this.game.enemy_group.getsize(); m++)
            this.game.enemy_group.find(m, 1).getobj().getComponent(cc.Button).interactable = false;
        cc.log("attack");
    },
    onbuttonitem: function () {
        if (this.Menu_flag.item_flag == 0)
            return;
        this.game.itemflag = 1;
        for (var i = 0; i < 4; i++)
            this.Skill[i].string = "";
        this.skill_des.string = "";
        this.hurtdis.opacity = 255;
        this.hurtdis.getComponent(cc.Label).string = "物品"
        this.curedis.getComponent(cc.Label).string = "";
        this.menu.active = false;
        this.skilldis.active = true;
        this.skill_page = 0;
        this.skill_count = 4;

        for (var i = 0; i < (this.game.current_player.item.getsize() <= 4 ? this.game.current_player.item.getsize() : 4); i++) {
            this.Skill[i].string = this.game.current_player.item.find(i, 1).string + "  " + this.game.current_player.item.find(i, 1).count;
        }

        this.skill_init();

        cc.log("item");
    },
    onbuttonstate: function () {
        if (this.Menu_flag.state_flag == 0)
            return;
        this.menu.active = false;
        this.men_state.active = true;
        this.men_state.getChildByName('Lv').getComponent(cc.Label).string = "级别 " + this.game.current_player.Lv;
        this.men_state.getChildByName('HP').getComponent(cc.Label).string = "血量 " + this.game.current_player.HP;
        this.men_state.getChildByName('MP').getComponent(cc.Label).string = "魔法值 " + this.game.current_player.MP;
        this.men_state.getChildByName('ATK').getComponent(cc.Label).string = "攻击力 " + this.game.current_player.ATK + "+" + this.game.current_player.ATK_aid;
        this.men_state.getChildByName('DEF').getComponent(cc.Label).string = "防御力 " + this.game.current_player.DEF + "+" + this.game.current_player.DEF_aid;
        this.men_state.getChildByName('INT').getComponent(cc.Label).string = "攻击范围 " + this.game.current_player.getattack_range();
        this.men_state.getChildByName('SPD').getComponent(cc.Label).string = "移动范围 " + this.game.current_player.getrange();
        this.men_state.getChildByName('exp').getComponent(cc.Label).string = "经验值 " + this.game.current_player.exp + " 下一级" + (this.game.exp[this.game.current_player.Lv - 1] - this.game.current_player.exp);
        this.men_state.getChildByName('type').getComponent(cc.Label).string = this.game.current_player.play_type == 0 ? "伤害系" : "治疗系";
        //  cc.log("state");
    },
    onbuttonskill: function () {
        if (this.Menu_flag.skill_flag == 0)
            return;
        //重新渲染
        for (var i = 0; i < 4; i++)
            this.Skill[i].string = "";
        this.skill_des.string = "";

        this.hurtdis.opacity = 150;
        this.curedis.opacity = 255;
        this.hurtdis.getComponent(cc.Label).string = "伤害"
        this.curedis.getComponent(cc.Label).string = "治疗";
        this.menu.active = false;
        this.skilldis.active = true;
        this.skill_page = 0;
        this.skill_count = 4;

        this.game.skill_type = 0;
        //cc.log(this.game.current_player.skill[this.game.skill_type].getsize());
        for (var i = 0; i < (this.game.current_player.skill[this.game.skill_type].getsize() <= 4 ? this.game.current_player.skill[this.game.skill_type].getsize() : 4); i++) {
            this.Skill[i].string = this.game.current_player.skill[this.game.skill_type].find(i, 1).string + "  " + this.game.current_player.skill[this.game.skill_type].find(i, 1).MP;
        }

        this.skill_init();


    },
    onbuttonskill1: function () {
        if (this.game.skill_flag[0] == 0) {
            this.game.skill_flag[1] = 0;
            this.game.skill_flag[2] = 0;
            this.game.skill_flag[3] = 0;

            if (this.game.itemflag==0)
                this.skill_des.string = this.game.current_player.skill[this.game.skill_type].find(this.skill_page * this.skill_count, 1).descrip;
            else
                this.skill_des.string = this.game.current_player.item.find(this.skill_page * this.skill_count, 1).descrip;
            this.game.skill_flag[0] = 1;
            this.Skill[0].node.opacity = 100;
            this.Skill[1].node.opacity = 255;
            this.Skill[2].node.opacity = 255;
            this.Skill[3].node.opacity = 255;
        }
        else if (this.game.skill_flag[0] == 1 && this.game.enemy_touch == 0) {
            this.skilldisplay(0);
        }
    },
    onbuttonskill2: function () {
        if (this.game.skill_flag[1] == 0) {
            this.game.skill_flag[0] = 0;
            this.game.skill_flag[2] = 0;
            this.game.skill_flag[3] = 0;

            if (this.game.itemflag==0)
                this.skill_des.string = this.game.current_player.skill[this.game.skill_type].find(1 + this.skill_page * this.skill_count, 1).descrip;
            else
                this.skill_des.string = this.game.current_player.item.find(1+this.skill_page * this.skill_count, 1).descrip;
            this.game.skill_flag[1] = 1;
            this.Skill[0].node.opacity = 255;
            this.Skill[1].node.opacity = 100;
            this.Skill[2].node.opacity = 255;
            this.Skill[3].node.opacity = 255;
        }
        else if (this.game.skill_flag[1] == 1 && this.game.enemy_touch == 0) {
            this.skilldisplay(1);
        }
    },
    onbuttonskill3: function () {
        if (this.game.skill_flag[2] == 0) {
            this.game.skill_flag[1] = 0;
            this.game.skill_flag[0] = 0;
            this.game.skill_flag[3] = 0;

            if (this.game.itemflag==0)
                this.skill_des.string = this.game.current_player.skill[this.game.skill_type].find(2 + this.skill_page * this.skill_count, 1).descrip;
            else
                this.skill_des.string = this.game.current_player.item.find(2 + this.skill_page * this.skill_count, 1).descrip;
            this.game.skill_flag[2] = 1;
            this.Skill[0].node.opacity = 255;
            this.Skill[1].node.opacity = 255;
            this.Skill[2].node.opacity = 100;
            this.Skill[3].node.opacity = 255;
        }
        else if (this.game.skill_flag[2] == 1 && this.game.enemy_touch == 0) {
            this.skilldisplay(2);
        }
    },
    onbuttonskill4: function () {
        if (this.game.skill_flag[3] == 0) {
            this.game.skill_flag[1] = 0;
            this.game.skill_flag[2] = 0;
            this.game.skill_flag[0] = 0;

            if (this.game.itemflag==0)
                this.skill_des.string = this.game.current_player.skill[this.game.skill_type].find(3 + this.skill_page * this.skill_count, 1).descrip;
            else
                this.skill_des.string = this.game.current_player.item.find(3 + this.skill_page * this.skill_count, 1).descrip;
            this.game.skill_flag[3] = 1;
            this.Skill[0].node.opacity = 255;
            this.Skill[1].node.opacity = 255;
            this.Skill[2].node.opacity = 255;
            this.Skill[3].node.opacity = 100;
        }
        else if (this.game.skill_flag[3] == 1 && this.game.enemy_touch == 0) {
            this.skilldisplay(3);
        }
    },
    //skill display init
    skilldisplay: function (n) {
        //检测player剩余MP是否大于skill消耗mp

        if (this.game.itemflag == 0) {
            if (this.game.current_player.skill[this.game.skill_type].find(n + this.skill_page * this.skill_count, 1).MP > this.game.current_player.MP)
                return;
        }
        else {
            this.consumeitem(n); 
            return;
        }


        this.mouse_up = 1;//鼠标专用检测
        this.game.current_player.skill_flag = 1;
        this.game.skill_flag[n] = 0;
        this.skill_des.string = "";
        this.skilldis.active = false;
        this.game.current_player.getobj().getComponent('player').display();
        this.game.current_player.getobj().getComponent('player').onskilldisplay(this.game.current_player.gettile(), this.game.current_player.skill[this.game.skill_type].find(n + this.skill_page * this.skill_count, 1).range);
        for (var m = 0; m < this.game.enemy_group.getsize(); m++)
            this.game.enemy_group.find(m, 1).getobj().getComponent(cc.Button).interactable = false;
        for (var m = 0; m < this.game.player_group.getsize(); m++)
            this.game.player_group.find(m, 1).getobj().getComponent(cc.Button).interactable = false;
        this.game.current_skill = this.game.current_player.skill[this.game.skill_type].find(n + this.skill_page * this.skill_count, 1);
        this.jineng.node.active = true;
        this.jineng.string = this.game.current_skill.string;

    },

    onchange1: function () {
        this.skill_page = 0;
        for (var i = 0; i < 4; i++) {
            this.Skill[i].string = "";
        }
        if (this.game.itemflag == 0)
            for (var i = 0; i < (this.game.current_player.skill[this.game.skill_type].getsize() <= 4 ? this.game.current_player.skill[this.game.skill_type].getsize() : 4); i++) {
                this.Skill[i].string = this.game.current_player.skill[this.game.skill_type].find(i, 1).string + "  " + this.game.current_player.skill[this.game.skill_type].find(i, 1).MP;
            }
        else {
            for (var i = 0; i < (this.game.current_player.item.getsize() <= 4 ? this.game.current_player.item.getsize() : 4); i++) {
                this.Skill[i].string = this.game.current_player.item.find(i, 1).string + "  " + this.game.current_player.item.find(i, 1).count;
            }
        }
        this.skill_des.string = "";
        this.skill_init();
    },
    onchange2: function () {
        this.skill_page = 1;
        for (var i = 0; i < 4; i++) {
            this.Skill[i].string = "";
        }
        if (this.game.itemflag == 0) {
            if (this.game.current_player.skill[this.game.skill_type].getsize() > this.skill_page * this.skill_count)
                for (var i = this.skill_page * this.skill_count; i < this.game.current_player.skill[this.game.skill_type].getsize(); i++) {
                    this.Skill[i - this.skill_page * this.skill_count].string = this.game.current_player.skill[this.game.skill_type].find(i, 1).string + "  " + this.game.current_player.skill[this.game.skill_type].find(i, 1).MP;

                }
        }
        else {
            cc.log("123");
            if (this.game.current_player.item.getsize() > this.skill_page * this.skill_count)
                for (var i = this.skill_page * this.skill_count; i < this.game.current_player.item.getsize(); i++) {
                    this.Skill[i - this.skill_page * this.skill_count].string = this.game.current_player.item.find(i, 1).string + "  " + this.game.current_player.item.find(i, 1).count;

                }
            }

        this.skill_des.string = "";
        this.skill_init();
    },

    onbuttonstandby: function () {
        if (this.Menu_flag.standby_flag == 0)
            return;
        this.game.current_player.setstate(2);
        this.game.current_player.getobj().opacity = 150;
        this.menu.active = false;

        this.ondetection();

    },
    onbuttonrestart: function () {
        this.res.active = false;
        this.restart();
    },

    onbutton: function () {

    },
    onbuttonend: function () {
        if (this.game.lv_flag == 1)
            return 0;

        if (this.game.player_flag != 1)
            return;
        if (this.menu.active == true)
            this.menu.active = false;
        if (this.men_state.active == true)
            this.men_state.active = false;

        for (var i = 0; i < this.game.player_group.getsize(); i++) {
            this.game.player_group.find(i, 1).setstate(2);
            this.game.player_group.find(i, 1).getobj().opacity = 150;
        }

        cc.log("standby");
        this.ondetection();
    },
    onbuttondefence: function () {
        if (this.game.itemflag == 1)
            return;

        this.hurtdis.opacity = 150;
        this.curedis.opacity = 255;
        this.game.skill_type = 0;
        this.skill_page = 0;
        for (var i = 0; i < 4; i++)
            this.Skill[i].string = "";
        this.skill_des.string = "";
        this.skill_init();
        for (var i = 0; i < (this.game.current_player.skill[0].getsize() <= 4 ? this.game.current_player.skill[0].getsize() : 4); i++) {
            this.Skill[i].string = this.game.current_player.skill[0].find(i, 1).string + "  " + this.game.current_player.skill[0].find(i, 1).MP;
        }

    },
    onbuttoncure: function () {
        this.curedis.opacity = 150;
        this.hurtdis.opacity = 255;
        this.game.skill_type = 1;
        this.skill_page = 0;
        for (var i = 0; i < 4; i++)
            this.Skill[i].string = "";
        this.skill_des.string = "";
        this.skill_init();
        for (var i = 0; i < (this.game.current_player.skill[1].getsize() <= 4 ? this.game.current_player.skill[1].getsize() : 4); i++) {
            this.Skill[i].string = this.game.current_player.skill[1].find(i, 1).string + "  " + this.game.current_player.skill[1].find(i, 1).MP;
        }
    },

    skill_init: function () {
        this.Skill[0].node.opacity = 255;
        this.Skill[1].node.opacity = 255;
        this.Skill[2].node.opacity = 255;
        this.Skill[3].node.opacity = 255;
        this.game.skill_flag[0] = 0;
        this.game.skill_flag[2] = 0;
        this.game.skill_flag[3] = 0;
        this.game.skill_flag[4] = 0;
    },
    //升级加点
    atkup: function () {
        if (this.game.current_player.point <= 0)
            return;

        this.game.current_player.ATK += 1;
        this.game.current_player.point--;
        this.lvdisplay();
    },
    defup: function () {
        if (this.game.current_player.point <= 0)
            return;
        this.game.current_player.DEF += 1;
        this.game.current_player.point--;
        this.lvdisplay();
    },
    hpup: function () {
        if (this.game.current_player.point <= 0)
            return;
        this.game.current_player.HP_max += 10;
        this.game.current_player.point--;
        this.lvdisplay();
    },
    mpkup: function () {
        if (this.game.current_player.point <= 0)
            return;
        this.game.current_player.MP_max += 10;
        this.game.current_player.point--;
        this.lvdisplay();

    },
    rankup: function () {
        if (this.game.current_player.point < (this.game.current_player.getrange() - this.game.current_player.ran_init + 1) * 5)
            return;

        this.game.current_player.point -= (this.game.current_player.getrange() - this.game.current_player.ran_init + 1) * 5;
        this.game.current_player.setrange(this.game.current_player.getrange() + 1);
        this.lvdisplay();
    },
    atkrankup: function () {
        if (this.game.current_player.point < (this.game.current_player.getattack_range() - this.game.current_player.atkran_init + 1) * 5)
            return;
        this.game.current_player.point -= (this.game.current_player.getattack_range() - this.game.current_player.atkran_init + 1) * 5;
        this.game.current_player.setattack_range(this.game.current_player.getattack_range() + 1);
        this.lvdisplay();
    },
    okbutton: function () {
        this.game.current_player.HP = this.game.current_player.HP_max;
        this.game.lv_flag = 0;
        this.pointup.active = false;
     
    },


    //UI button控制
    onbuttonup: function () {
        this.newTile = cc.p(this.playerTile.x, this.playerTile.y);
        this.newTile.y -= 1;
        this.tryMoveToNewTile(this.newTile);
    },
    onbuttondown: function () {
        this.newTile = cc.p(this.playerTile.x, this.playerTile.y);
        this.newTile.y += 1;
        this.tryMoveToNewTile(this.newTile);
    },
    onbuttonleft: function () {
        this.newTile = cc.p(this.playerTile.x, this.playerTile.y);
        this.newTile.x -= 1;
        this.tryMoveToNewTile(this.newTile);
    },
    onbuttonright: function () {
        this.newTile = cc.p(this.playerTile.x, this.playerTile.y);
        this.newTile.x += 1;
        this.tryMoveToNewTile(this.newTile);
    },

    changemap: function (next) {
        this.tiledMap.tmxAsset = next;
    },


    tryMoveToNewTile: function(newTile) {
        let width = this.tiledMap.node.width;
        let height = this.tiledMap.node.height;
        if (newTile.x < 0 || newTile.x >= width) return;
        if (newTile.y < 0 || newTile.y >= height) return;
        //   cc.log(this.barriers.getTileGIDAt(newTile));
      //  cc.log(this.tiledMap.getMapSize());
        if (this.barriers.getTileGIDAt(newTile)) {//GID=0,则该Tile为空
            this.barriers.setTileGID(39, newTile);
            
            cc.log('This way is blocked!');
            return false;
        }
       
        this.tryCatchStar(newTile);

        this.playerTile = newTile;
        this.updatePlayerPos();

        if (cc.pointEqualToPoint(this.playerTile, this.endTile)) {
            cc.log('succeed');
        }
    },

    tryCatchStar: function(newTile){
        let GID = this.stars.getTileGIDAt(newTile);
        let prop = this.tiledMap.getPropertiesForGID(GID);

        if (this.stars.getTileGIDAt(newTile)) {//GID=0,则该Tile为空  
            this.stars.removeTileAt(newTile);
        }
        // if(prop && prop.isStar)
        // {
        //     this.stars.removeTileAt(newTile);
        // }
    },
    //将像素坐标转化为瓦片坐标
    gettilepos: function (posInPixel) {
        Math.floor
        let x = posInPixel.x - this.node.getPosition().x;
        let y = posInPixel.y - this.node.getPosition().y;
      //  cc.log(this.tiledMap.getTileSize().width);

        return cc.p(Math.floor(x / this.tiledMap.getTileSize().width), Math.floor(this.tiledMap.getMapSize().height - y / this.tiledMap.getTileSize().height));
    },
    //将瓦片坐标转化为像素坐标
    getpostile: function (position) {
        let x = position.x * this.tiledMap.getTileSize().width;
        let y = (this.tiledMap.getMapSize().height-position.y-1) * this.tiledMap.getTileSize().height;

        return cc.p(x + this.node.getPosition().x, this.node.getPosition().y + y);
    },
    //consume item
    consumeitem: function (n) {
        var hp,mp;
        this.game.skill_flag[n] = 0;
        this.game.current_player.setstate(2);
        this.skill_des.string = "";
        this.skilldis.active = false;
        
        this.game.current_item = this.game.current_player.item.find(n + this.skill_page * this.skill_count, 1);
        this.itemuse.getComponent(cc.Label).string = "使用" + this.game.current_item.string;
        this.itemuse.opacity = 255;
        this.itemuse.active = true;
        this.itemuse.getComponent('itemdisplay').enabled = true;
        

        this.game.current_player.HP += this.game.current_item.HP;
        hp = this.game.current_item.HP;
        if (this.game.current_player.HP > this.game.current_player.HP_max) {
            hp = this.game.current_item.HP - (this.game.current_player.HP - this.game.current_player.HP_max);
            this.game.current_player.HP = this.game.current_player.HP_max;
        }
        this.game.current_player.MP += this.game.current_item.MP;
        mp = this.game.current_item.MP;
        if (this.game.current_player.MP > this.game.current_player.MP_max) {
            mp = this.game.current_item.MP - (this.game.current_player.MP - this.game.current_player.MP_max);
            this.game.current_player.MP = this.game.current_player.MP_max;
        }

        if(hp!=0)
            this.blooddisplay(this.getpostile(this.game.current_player.gettile()), hp);
        else
            this.blooddisplay(this.getpostile(this.game.current_player.gettile()), mp);
        this.game.current_item.count--;
        if (this.game.current_item.count == 0)
            this.game.current_player.item.removeobj(this.game.current_item,1);

    },


    //减血与加血显示
    blooddisplay: function (pos, str) {
        var dis;
        if (str <= 0) {
            dis = cc.instantiate(this.dec);
            dis.parent = this.node;
            dis.getComponent(cc.Label).string = "-" + Math.abs(str);
            dis.setPosition(cc.p(pos.x,pos.y+40));
            dis.active = true;
            dis.opacity = 255;
            cc.log("adssd");
        }
        else {
            dis = cc.instantiate(this.add);
            dis.parent = this.node;
            dis.getComponent(cc.Label).string = "+" + str;
            dis.setPosition(cc.p(pos.x, pos.y + 40));
            dis.active = true;
            dis.opacity = 255;

        }
    },

    //技能释放后效果检测
    skilldetect: function (pos) {
        var flag = 0;
        var position;
        var range = this.game.current_player.getobj().getComponent('player').ran;
        var death_flag = 0;
        for (var i = -1 * range; i <= range; i++) {
            for (var j = Math.abs(i) - range; j <= range - Math.abs(i); j++) {
                position = cc.p(pos.x + i, pos.y + j);
                if (position.x >= 0 && position.y >= 0 && position.x < this.tiledMap.getMapSize().width && position.y < this.tiledMap.getMapSize().height)

                    if (this.game.current_skill.type == 0) {

                        if (this.game.enemy_map[position.x][position.y] != null) {
                            flag = 1;

                            var blow_state = cc.instantiate(this.blow);
                            blow_state.parent = this.node;
                            blow_state.setPosition(this.game.player_group.find(0, 1).getobj().getComponent('player').getpostile(position));
                            blow_state.getComponent(cc.Animation).play('2');                           
                            setTimeout(function () {
                                blow_state.destroy();
                            }.bind(this), 1000);

                            var hp = Math.floor((this.game.current_player.ATK + this.game.current_player.ATK_aid) * this.game.current_skill.ATK - (this.game.enemy_map[position.x][position.y].DEF + this.game.enemy_map[position.x][position.y].DEF_aid)) <= 0 ? 0 : Math.floor((this.game.current_player.ATK + this.game.current_player.ATK_aid) * this.game.current_skill.ATK - (this.game.enemy_map[position.x][position.y].DEF + this.game.enemy_map[position.x][position.y].DEF_aid));
                            this.game.enemy_map[position.x][position.y].HP -= hp;
                            this.blooddisplay(this.game.player_group.find(0, 1).getobj().getComponent('player').getpostile(this.game.enemy_map[position.x][position.y].gettile()), -1*hp);
                            this.game.current_player.exp += Math.floor(this.game.enemy_map[position.x][position.y].HP < 0 ? Math.floor((this.game.enemy_map[position.x][position.y].HP + hp) * 0.2) : Math.floor(hp * 0.2));
                            while (this.game.current_player.exp >= this.game.exp[this.game.current_player.Lv - 1])
                                this.levelup();
                            
                            if (this.ondeath(this.game.enemy_map[position.x][position.y], position) == 1) {
                                death_flag = 1;
                                break;
                            }
                        }
                    }
                    else if (this.game.current_skill.type == 1) {
                        if (this.game.player_map[position.x][position.y] != null) {

                            var xue = this.game.current_skill.HP;
                            this.game.player_map[position.x][position.y].HP += this.game.current_skill.HP;
                            if (this.game.player_map[position.x][position.y].HP >= this.game.player_map[position.x][position.y].HP_max) {
                                xue = this.game.current_skill.HP - (this.game.player_map[position.x][position.y].HP - this.game.player_map[position.x][position.y].HP_max);
                                this.game.player_map[position.x][position.y].HP = this.game.player_map[position.x][position.y].HP_max;
                            }
                            if (xue > 0) {
                                this.blooddisplay(this.game.player_group.find(0, 1).getobj().getComponent('player').getpostile(this.game.player_map[position.x][position.y].gettile()), xue);
                                flag = 1;
                            }
                        }
                    }
            }
            if (death_flag == 1)
                break;
        }

        //对skill range内的所有enemy进行伤害判断后再进行lv up
        if (this.game.lv_flag == 1) {
            this.lvdisplay();
        }
        if (flag == 1 && death_flag != 1) {
            this.game.current_player.MP -= this.game.current_skill.MP;
            this.game.current_player.setstate(2);
            this.game.current_player.getobj().opacity = 150;
            this.ondetection();
        }
    },
    //检测player是否全部行动完毕
    ondetection: function () {
        var flag = 1;
      
        for (var i = 0; i < this.game.player_group.getsize(); i++) {         
            if (this.game.player_group.find(i, 1).getstate() != 2) {
                flag = 0;
               //cc.log(this.game.player_group.find(i, 1).getid());
                    break;
            }
        }
        //cc.log(this.game.player_group.getsize());
        if (flag == 1) {
            this.game.player_flag = 0;
           // cc.log(1111);
            this.game.current_enemy = this.game.enemy_group.gethead().element;
          //  cc.log(this.game.enemy_group.gethead().element.getid());
            this.personpool.sortentire(this.personpool);
            this.game.enemy_flag = 1;
            return 1;
        }
        else
            return 0;
    },

    updatePlayerPos: function () {
        let pos = this.getpostile(this.playerTile);
        this.player.setPosition(pos);

      //  cc.log(this.playerTile + this.getpostile(this.playerTile) + this.node.getContentSize() + this.tiledMap.getTileSize() + this.tiledMap.getMapSize() + this.node.getPosition() + this.gettilepos(this.player.getPosition()));
    },

    //将player,enemy.npc分别组织
    group: function () {
        var i = 0;
        for (i = 0; i < this.personpool.getsize(); i++) {
            if (this.personpool.find(i, 1).gettype() == 0&&this.game.level == 1)
                this.game.player_group.insert(this.personpool.find(i, 1), this.game.player_group.getsize());
            else if (this.personpool.find(i, 1).gettype() == 1)
                this.game.enemy_group.insert(this.personpool.find(i, 1), this.game.enemy_group.getsize());
            else if (this.personpool.find(i, 1).gettype() == 2)
                this.game.npc_group.insert(this.personpool.find(i, 1), this.game.npc_group.getsize());
        }
      //  cc.log(this.game.player_group.getsize());

    },
    //将player,enemy技能分别组织
    skillgroup: function () {
        var i = 0;
        var j = 0;
        for (i = 0; i < this.game.skill_group.getsize(); i++) {
            if (this.game.level == 1) {
                for (j = 0; j < this.game.player_group.getsize(); j++) {
                    if (this.game.skill_group.find(i, 1).type == this.game.player_group.find(j, 1).play_type && this.game.skill_group.find(i, 1).Lv <= this.game.player_group.find(j, 1).Lv) {
                        this.game.player_group.find(j, 1).skill[this.game.skill_group.find(i, 1).type].insert(this.game.skill_group.find(i, 1), this.game.player_group.find(j, 1).skill[this.game.skill_group.find(i, 1).type].getsize());
                        cc.log(this.game.player_group.find(j, 1).Lv);
                    }
                }
            }
            for (j = 0; j < this.game.enemy_group.getsize(); j++) {
                if (this.game.skill_group.find(i, 1).type == this.game.enemy_group.find(j, 1).play_type && this.game.skill_group.find(i, 1).Lv <= this.game.enemy_group.find(j, 1).Lv) {
                    this.game.enemy_group.find(j, 1).skill[this.game.skill_group.find(i, 1).type].insert(this.game.skill_group.find(i, 1), this.game.enemy_group.find(j, 1).skill[this.game.skill_group.find(i, 1).type].getsize());
                }
            }
        }
      //  cc.log(this.game.player_group.find(0, 1).skill[0].getsize());
    },
    terriangroup: function () {
        var i;
        for (i = 0; i < this.personpool.getsize(); i++) {
            this.personpool.find(i, 1).ATK_aid = 0;
            this.personpool.find(i, 1).DEF_aid = 0;
        }
    },
    //所有player重新开始行动,state初始化
    player_init: function () {
        for (var i = 0; i < this.game.player_group.getsize(); i++) {
            this.game.player_group.find(i, 1).setstate(0);
            this.game.player_group.find(i, 1).getobj().opacity = 255;
        }  

        this.game.round_cound++;
        this.round.string = "第" + this.game.round_cound + "回合";
    },
    // called every frame, uncomment this function to activate update callback
    update: function () {
        // cc.log(this.game.enemy_flag);
        if (this.game.lv_flag == 1)
            return 0;

        if (this.game.enemy_flag == 1) {
            this.game.enemy_flag = 0;
            this.game.current_enemy.getobj().getComponent('enemy').move();
        }
        if (this.game.death == 1) {
            this.game.death = 0;
            
            for (var i = 0; i < this.game.player_group.getsize(); i++) {
                if (this.game.player_group.find(i, 1).HP <= 0) {                   
                    this.game.player_map[this.game.player_group.find(i, 1).gettile().x][this.game.player_group.find(i, 1).gettile().y] = null;
                    this.personpool.removeperson(this.game.player_group.find(i, 1), this.personpool);
                    this.game.player_group.find(i, 1).getobj().destroy();
                    this.game.player_group.removeobj(this.game.player_group.find(i, 1), 1);
                    if (this.game.player_group.getsize() == 0) {
                     //   cc.log("fail");
                        for (var j = 0; j < this.game.enemy_group.getsize(); j++) {
                            this.game.enemy_group.find(j, 1).getobj().getComponent('enemy').enabled = false;
                            this.game.enemy_group.find(j, 1).getobj().destroy();

                        }
                        this.cou = 0;//men id
                        this.game.level = 1;
                        this.game.lv_flag = 0;
                        this.res.active = true;
                    }
                    break;
                }
            }
        }


     },
});





//各种人物对象的基类
 function object() {
    var id;
     var type;
     this.play_type;
     this.Lv;
     this.HP;
     this.HP_max;
     this.MP;
     this.MP_max;
     this.ATK;
     this.ATK_aid;//地形加成
     this.DEF;
     this.DEF_aid;
     this.INT;
     this.SPD;
     this.exp;
    var obj;
    var tilex;
     var tiley;
     var range;
     this.ran_init;
     this.atkran_init;
     var attack_range;
     var state;
     this.skill;//skill 
     this.item;
     this.exp;
     this.init = function (element) {
         this.HP = element[0];
         this.MP = element[1];
         this.ATK = element[2];
         this.ATK_aid = 0;
         this.DEF = element[3];
         this.DEF_aid = 0;
         this.INT = element[4];
         this.SPD = element[5];
         this.Lv = element[10];
         obj = element[6];
         id = element[7];
         range = element[8];
         this.ran_init = range;
         state = element[9];
         this.play_type = element[11];
         this.exp = 0;
         this.HP_max = this.HP;
         this.MP_max = this.MP;
         

     };
     this.getstate = function () {
         return state;
     },
         this.setstate = function (sta) {
             state = sta;

         },
         this.getrange = function () {
             return range;
         },
         this.setrange = function (ran) {
         range = ran;
         },
         this.getattack_range = function () {
             return attack_range;
         },
         this.setattack_range = function (ran) {
             attack_range = ran;
         },
     
     this.gettile=function(){
         return cc.p(tilex, tiley);
     };
     this.settile=function(tile){
         tilex = tile.x;
         tiley = tile.y;
     };
    this.getid = function () {
        return id;
    };
    this.setid = function (number) {
        id = number;
    };
    this.gettype = function () {
        return type;
    };
    this.settype = function (number) {
        type = number;
    };
    this.getobj = function () {
        return obj;
    };
    this.setobj = function (element) {
        obj = element;
    };
    
   
}
var player = function (element) {
    this.nearplayer;
    this.point;
    this.nearenemy;
    this.nearnpc;
    this.move_flag;
    this.attack_flag;
    this.skill_flag;
    this.attack_range ;
    object.call(this);
    this.ini = function (element) {
        this.init(element);
        this.settype(0);
        this.move_flag = 0;
        this.setattack_range(2);
        this.skill_flag = 0;
        this.point = 0;
        this.atkran_init = this.getattack_range();
    };
}
var npc = function (element) {
    this.nearplayer;
    this.nearenemy;
    this.nearnpc;
    object.call(this);
    this.ini = function (element) {
        this.init(element);
        this.settype(2);
    };
}
var enemy = function (element) {
    object.call(this);
    this.nearplayer;
    this.nearenemy;
    this.nearnpc;   
    this.hit;
    this.ini = function (element) {
        this.init(element);
        this.settype(1);
        this.setattack_range(2);
        this.hit = 0;
    };
}

var skill = function (element) {
    this.Lv;
    this.type;
    this.range;
    this.ATK;
    this.DEF;
    this.INT;
    this.MP;
    this.HP;
    this.string;
    this.descrip;
    this.init = function (element) {
        this.Lv = element[0];
        this.type = element[1];
        this.ATK = element[2];
        this.DEF = element[3];
        this.INT = element[4];
        this.MP = element[5];
        this.HP = element[6];
        this.string = element[7];
        this.descrip = element[8];
        this.range = element[9];
    };

}

var item = function (element) {
    this.string;
    this.HP;
    this.count;
    this.obj;
    this.descrip;
    this.MP;
    this.init = function (element) {
        this.string = element[0];
        this.HP = element[1];
        this.count = element[2];
        this.obj = element[3];
        this.descrip = element[4];
        this.MP = element[5];
    }
}

//地形加成
var ter = function () {
    this.ATK;
    this.DEF;
    this.obj;
    this.range;
    this.attack_range;
    this.init = function (element) {
        this.ATK = element[0];
        this.DEF = element[1];
        this.obj = element[2];
    }

}

//用于存放player,enemy,npc的链表及组织它们之间的关系
var person = function () {
    Map.call(this);
    var head_enemy;
    var tail_enemy;

    this.getdistance = function (element1, element2) {
        return Math.abs(element1.gettile().x - element2.gettile().x) + Math.abs(element1.gettile().y - element2.gettile().y);
        
    };
    //根据object对象中obj成员进行寻找object对象
    this.findperson = function (element) {
        var position;
        for (position = 0; position < this.getsize(); position++)
            if (this.find(position, 1).getobj() == element)
                return this.find(position, 1);
        
    }
    //对各种人物对象寻找距离最近的其它两种人物对象
    this.sort = function (element, group) {
        var position = 0;
        for (position = 0; position < group.getsize(); position++) {
            if (group.find(position, 1).gettype() != element.gettype() && group.find(position, 1).getid() != element.getid()) {
                
                if (group.find(position, 1).gettype() == 0) {
                    if (element.nearplayer != null) {
                        if (this.getdistance(group.find(position, 1), element) < this.getdistance(element.nearplayer, element))
                            element.nearplayer = group.find(position, 1);
                    }
                    else {
                        element.nearplayer = group.find(position, 1);
                    }
                }
                else if (group.find(position, 1).gettype() == 1) {
                   
                    if (element.nearenemy != null) {
                        if (this.getdistance(group.find(position, 1), element) < this.getdistance(element.nearenemy, element))
                            element.nearenemy = group.find(position, 1);
                    }
                    else {
                        element.nearenemy = group.find(position, 1);
                    }
                }
                else if (group.find(position, 1).gettype() == 2) {
                    if (element.nearnpc != null) {
                        if (this.getdistance(group.find(position, 1), element) < this.getdistance(element.nearnpc, element))
                            element.nearnpc = group.find(position, 1);
                    }
                    else {
                        element.nearnpc = group.find(position, 1);
                    }
                }

            }

        }

    };

    //对所有人物对象进行sort
    this.sortentire = function (group) {
        var position;
        for (position = 0; position < group.getsize(); position++)
            this.sort(group.find(position, 1), group);

    };
    this.removeperson=function(obj,group){
        var position;
        for (position = 0; position < group.getsize(); position++) {
            if (obj.gettype() == 0) {
                
                if (group.find(position,1).nearplayer == obj) {
                    group.find(position,1).nearplayer = null;
                    
                }
            }
            else if (obj.gettype() == 1) {
                if (group.find(position,1).nearenemy == obj) {
                    group.find(position,1).nearenemy = null;
                    
                }
            }
            else if (obj.gettype() == 2) {
                if (group.find(position).nearnpc == obj)
                    group.find(position).nearnpc = null;
            }

        }

        group.removeobj(obj, 1);
        this.sortentire(group);//删除一个人物对象后重新对所有人物进行排序
    };


}


//node对象,链表中对象
var nnode=function(element) {
    this.element = element;
    this.prev = null;
    this.next = null;
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
}
var gameparam = function () {
    this.min_player;
    this.max_player;
    this.min_enemy;
    this.max_enemy;
    this.enemy_touch;
    this.exp;
    this.level;
    this.round_cound;
    this.death;
    this.lv_flag;
    this.player_flag ;
    this.enemy_flag;
    this.current_player ;
    this.current_enemy;
    this.current_item;
    this.player_group;
    this.enemy_group;
    
    this.npc_group;
    this.skill_group;
    this.skill_page;
    this.skill_count;
    this.skill_type;
    this.current_skill;
    this.player_map;
    this.enemy_map;
    this.npc_map;
    this.item_map;
    this.terrain_map;
    this.itemflag;
}
var Menu = function () {
    this.move_flag = 0;
    this.attack_flag = 0;
    this.item_flag = 0;
    this.state_flag = 1;
    this.skill_flag = 1;
    this.standby_flag = 1;
}

  function  Map() {
    var head = null;
    var tail = null

    var length = 0;
    this.getsize = function () {
        return length;
    }
    this.gethead = function () {
        return head;
      }

      this.gettail = function () {
          return tail;
      }
     //在指定position位置插入element构成的node对象
    this.insert = function (element, position) {
        var node = new nnode(element);
        if (position >= 0 && position <= length) {
            if (position == 0) {
                if (head == null) {
                    head = node;
                    tail = node;
                }
                else {
                    node.next = head;
                    head.prev = node;
                    head = node;
                }
            }
            else if (position == length) {
                tail.next = node;
                node.prev = tail;
                tail = node;
            }
            else {
                let temp = head;
                while (--position >= 0) {

                    temp = temp.next;

                }
                temp.prev.next = node;
                node.prev = temp.prev;
                node.next = temp;
                temp.prev = node;


            }
            length++;


        }
        else {
            return false;
        }
      }

      //删除position位置中node对象成员
     this.remove = function (position) {
        
         if (position >= 0 && position < length) {
             if (length == 1) {
                 head = null;
                 tail = null;
                 length = 0;
                 return;
             }

             if (position == 0) {
                
                  head = head.next;
                  head.prev = null;
             }
             else if (position == length - 1) {
                  tail = tail.prev;
                  tail.next = null;
             }
             else {
                 
                  let temp = this.find(position,0);
                  temp.prev.next = temp.next;
                  temp.next.prev = temp.prev;
             }
              length--;
         }
          else
             return "error";
      }

      //way=0时,object为node对象；way=1时，object为node对象中element成员
      //JS 0=false;
      this.removeobj = function (object, way) {
          cc.log(object.HP);
          if (this.findobject(object, way) != "error") {              
              this.remove(this.findobject(object, way));              
         }
          else
          return "error";       
      }
      //return way=0,node对象，way=1,node对象中element成员
      this.find = function (position,way) {
          if (position >= 0 && position < length) {
              if (position == 0) {
                  if (way == 0)
                      return head;
                  else if (way == 1)
                      return head.element;
                  else
                      return "error";
              }
              else if (position == length - 1) {
                  if (way == 0)
                      return tail;
                  else if (way == 1)
                      return tail.element;
                  else
                      return "error";
              }
              else {
                  let temp = head;
                  while (--position >= 0)
                      temp = temp.next;
                  if (way == 0)
                      return temp;
                  else if (way == 1)
                      return temp.element;
                  else
                      return "error";
              }

          }
          else
              return "error";
      }

      //way=0查询node对象，way=1时查询node对象中element成员
      //return 链表中位置
      this.findobject = function (element,way) {
          var current = head;
          var position = 0;

          if (way == 0) {
              if (element == head)
                  return 0;
              else if (element == tail)
                  return length - 1;
              else {

                  while (current != element && current != null) {
                      current = current.next;
                      position++;
                  }
                  if (current != null)
                      return position;
                  else
                      return "error";

              }
          }
          else if (way == 1) {
             
              if (element == head.element) {
                  
                  return 0;
              }
              else if (element == tail.element) {
                  return length - 1;
                 
              }
              else {
                
                  while (current.element != element && current != null) {
                      cc.log(position);
                      current = current.next;
                      position++;
                  }
                  
                  if (current != null)
                      return position;
                  else {
                      return "error";
                      
                  }

              }
          }

      }

}

function mmap() {
    //地图层通过链表连接，每个地图层有唯一ID，由传入链表中顺序决定
    //element: tmx类型文件
  /*  var nnode = function (element) {
        this.element = element;
        this.prev = null;
        this.next = null;
        this.up = null;
        this.down = null;
        this.left = null;
        this.right = null;
    }
  */
      Map.call(this);
  //  mmap.prototype = new Map();
    //对两个指定ID的地图层进行相应方位的连接
    this.relation = function (first, second, way) {
        let first_ele,second_ele;
        first_ele = this.find(first,0);
        second_ele = this.find(second,0);
        //0 1 2 3左上右下
        switch (way) {
            case 0: {
                first_ele.left = second_ele;
                second_ele.right = first_ele;
            } break;
            case 1: {
                first_ele.up = second_ele;
                second_ele.down = first_ele;
            } break;
            case 2: {
                first_ele.right = second_ele;
                second_ele.left = first_ele;
            } break;
            case 3: {
                first_ele.down = second_ele;
                second_ele.up = first_ele;
            } break;

        }

    }
    //对两个指定ID的地图层进行方位关系的解除
    this.unrelative = function (first, second) {
        first_ele = this.find(first);
        second_ele = this.find(second);
        if (first_ele.left == second_ele) {
            first_ele.left = null;
            second_ele.right = null;
        }
        else if (first_ele.right == second_ele) {
            first_ele.right = null;
            second_ele.left = null;
        }
        else if (first_ele.up == second_ele) {
            first_ele.up = null;
            second.down = null;
        }
        else if (first_ele.down == second_ele) {
            first_ele.down = null;
            second_ele = null;

        }
        else
            return false;
    }

}


//module.exports = map;