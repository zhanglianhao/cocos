// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        map: {
            default: null,
            type: cc.Node,

        },
        area: {
            default: null,
            type: cc.Prefab
        },
        attack: {
            default: null,
            type: cc.Prefab
        },
        skill: {
            default: null,
            type: cc.Prefab
        },
        jumpDuration:0.1,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
      //  this.tile = cc.p(0, 0);
        this.enabled = false;
        this.areas = new Array();
        this.ski = new Array();
        this.count = 0;
        this.skill_count = 0;
        this.ran;
        cc.instantiate
    },

    start() {

    },
    //menu位置获取
    menupos: function () {
        var pos;
       // var height = this.map.tiledMap.getMapSize().height;
       // var width = this.map.tiledMap.getMapSize().width;
       // var x = this.person.gettile().x;
      //  var y = this.person.gettile().y;
        var x = this.person.getobj().getPosition().x + this.map.node.x;
        var y = this.person.getobj().getPosition().y + this.map.node.y;
        var height = cc.visibleRect.topRight.y ;
        var width = cc.visibleRect.topRight.x ;
        cc.log(height);
        cc.log(width);
        if (x <= width/ 2 && y <= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x + 40, this.person.getobj().getPosition().y + this.map.node.y+20);
        else if (x >= width / 2 && y <= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x - 60, this.person.getobj().getPosition().y + this.map.node.y+20);
        else if (x <= width / 2 && y >= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x + 40, this.person.getobj().getPosition().y + this.map.node.y - 170);
        else if (x >= width / 2 && y >= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x - 60, this.person.getobj().getPosition().y + this.map.node.y - 170);

        return pos;
    },

    //人物对象state切换
    onbutton: function () {
        if (this.map.game.lv_flag == 1)
            return;

       
        if (this.map.game.player_flag != 1)
            return;
        if (this.map.men_state.active == true)
            this.map.men_state.active = false;
        if (this.map.skilldis.active == true)
            this.map.skilldis.active = false;
        if (this.map.game.itemflag == 1)
            this.map.game.itemflag = 0;

        if (this.map.game.enemy_touch==0&&this.map.game.current_player != null && (this.map.game.current_player.move_flag == 1 || this.map.game.current_player.attack_flag == 1)) {
            this.map.game.current_player.getobj().getComponent('player').close();
            this.map.game.current_player.move_flag = 0;
            this.map.game.current_player.attack_flag = 0;
            for (var m = 0; m < this.map.game.enemy_group.getsize(); m++)
                this.map.game.enemy_group.find(m, 1).getobj().getComponent(cc.Button).interactable = true;
        }
        if (this.map.game.current_player != null &&this.map.game.current_player.skill_flag == 1) {
            this.map.game.current_player.skill_flag = 0;
            this.map.game.current_player.getobj().getComponent('player').skillclose();
            this.map.game.current_player.getobj().getComponent('player').close();
            for (var m = 0; m < this.map.game.enemy_group.getsize(); m++)
                this.map.game.enemy_group.find(m, 1).getobj().getComponent(cc.Button).interactable = true;
        }

        this.map.game.enemy_touch = 0;


        this.map.game.current_player = this.person;    
        this.map.menu.active = true;

        this.map.menu.setPosition(this.menupos());

        cc.log(this.map.menu);
        if (this.person.getstate() == 0) {           
            this.map.Menu_flag.move_flag = 1;
            this.map.Menu_flag.attack_flag = 1;
            this.map.Menu_flag.item_flag = 1;
            this.map.Menu_flag.skill_flag = 1;
            this.map.Menu_flag.standby_flag = 1;
            this.map.menu.getChildByName('move').opacity = 255;
            this.map.menu.getChildByName('attack').opacity = 255;
            this.map.menu.getChildByName('item').opacity = 255;
            this.map.menu.getChildByName('standby').opacity = 255;
            this.map.menu.getChildByName('skill').opacity = 255;
        }
        else if (this.person.getstate() == 1) {
            
            this.map.Menu_flag.move_flag = 0;       
            this.map.Menu_flag.skill_flag = 1;
            this.map.Menu_flag.attack_flag = 1;
            this.map.Menu_flag.item_flag = 1;
            this.map.Menu_flag.standby_flag = 1;
            this.map.menu.getChildByName('move').opacity = 90;
            this.map.menu.getChildByName('attack').opacity = 255;
            this.map.menu.getChildByName('item').opacity = 255;
            this.map.menu.getChildByName('standby').opacity = 255;
            this.map.menu.getChildByName('skill').opacity = 255;
        }
        else if (this.person.getstate() == 2) {
            this.map.Menu_flag.move_flag = 0;
            this.map.Menu_flag.attack_flag = 0;
            this.map.Menu_flag.item_flag = 0;
            this.map.Menu_flag.skill_flag = 0;
            this.map.Menu_flag.standby_flag = 0;
            this.map.menu.getChildByName('move').opacity = 90;
            this.map.menu.getChildByName('attack').opacity = 90;
            this.map.menu.getChildByName('item').opacity = 90;
            this.map.menu.getChildByName('standby').opacity = 90;
            this.map.menu.getChildByName('skill').opacity = 90;
        }

        

       // cc.log("player");
     //   cc.log(this.person.getstate());
  /*      if (this.person.getstate() == 0) {

           
            if (this.map.game.current_player != null) {
                if (this.map.game.current_player.getstate() == 1) {
                    this.map.game.current_player.setstate(0);
                    this.map.game.current_player.getobj().getComponent('player').close();
                }
                this.map.game.current_player = this.person;
            }
            else {
                this.map.game.current_player = this.person;
            }
            this.person.setstate(1);
            this.display();

        }
        else if (this.person.getstate() == 1) {
            this.person.setstate(0);
            this.map.game.current_player = null;
            this.close();
        }
        else if (this.person.getstate() == 2) {
            if (this.map.game.current_player != null) {
                if (this.map.game.current_player.getstate() == 1) {
                    this.map.game.current_player.setstate(0);
                    this.map.game.current_player.getobj().getComponent('player').close();
                }
                this.map.game.current_player = null;
            }
        }
*/

    },

    //显示移动或攻击范围
    display: function () {
        var i;
        this.pre;
        var pos;
        if (this.person.move_flag == 1) {
            i = this.person.getrange();
            this.pre = this.area;
        }
        else if (this.person.attack_flag == 1 || this.person.skill_flag == 1) {
            i = this.person.getattack_range();
            this.pre = this.attack;
        }
        cc.log(this.pre);
        for (var m = i; m >= 0; m--) {
            for (var n = m - i; n <= i - m; n++) {
                pos = cc.p(this.person.gettile().x - n, this.person.gettile().y + m);
                if (this.detection(pos) == 1) {
                this.areas[this.count] = cc.instantiate(this.pre);
                    this.areas[this.count].parent = this.map.node;
                    this.areas[this.count].setPosition(this.getpostile(pos));
                    this.count++;
                }
                if (m != 0) {
                    pos = cc.p(this.person.gettile().x - n, this.person.gettile().y - m);
                    if (this.detection(pos) == 1) {
                        this.areas[this.count] = cc.instantiate(this.pre);
                        this.areas[this.count].parent = this.map.node;
                        this.areas[this.count].setPosition(this.getpostile(pos));
                        this.count++;
                    }
                }
            }
        }
     //   cc.log(this.count);
    },
    onskilldisplay: function (position,range) {
        var pre;
        var pos;
        if (range != null)
            this.ran = range;
        this.pre = this.skill;
        for (var m = this.ran; m >= 0; m--) {
            for (var n = m - this.ran; n <= this.ran - m; n++) {
                pos = cc.p(position.x - n, position.y + m);
                if (this.detection(pos) == 1) {
                    this.ski[this.skill_count] = cc.instantiate(this.pre);
                    this.ski[this.skill_count].parent = this.map.node;
                    this.ski[this.skill_count].setPosition(this.getpostile(pos));
                    this.skill_count++;
                }
                if (m != 0) {
                    pos = cc.p(position.x - n, position.y - m);
                    if (this.detection(pos) == 1) {
                        this.ski[this.skill_count] = cc.instantiate(this.pre);
                        this.ski[this.skill_count].parent = this.map.node;
                        this.ski[this.skill_count].setPosition(this.getpostile(pos));
                        this.skill_count++;
                    }
                }
            }
        }
    },

    //检测生成移动或攻击显示范围是否超出地图大小
    detection: function (pos) {
        if (pos.x < 0 || pos.y < 0 || pos.x >= this.map.tiledMap.getMapSize().width || pos.y >= this.map.tiledMap.getMapSize().height)
            return 0;
        else
            return 1;
    },
    close: function () {
        var i = 0;
        for (i = 0; i < this.count; i++)
            this.areas[i].destroy();

        this.count = 0;
    },
    skillclose: function () {
        var i = 0;
        for (i = 0; i < this.skill_count; i++)
            this.ski[i].destroy();

        this.skill_count = 0;
    },

    //player move animation
    move: function (position) {
       
        var h = position.x - this.person.gettile().x;
        var v = this.person.gettile().y - position.y;
        this.map.game.player_map[this.person.gettile().x][this.person.gettile().y] = null;
        this.person.settile(position);
        this.map.game.player_map[position.x][position.y] = this.person;
      //  cc.log(this.getpostile(cc.p(h, this.map.tiledMap.getMapSize().height - 1)));
        var moveh = cc.moveBy(this.jumpDuration * Math.abs(h), this.getpostile(cc.p(h, this.map.tiledMap.getMapSize().height - 1)));//easing(cc.easeCubicActionOut());
        var movev = cc.moveBy(this.jumpDuration * Math.abs(v), this.getpostile(cc.p(0, this.map.tiledMap.getMapSize().height - 1 - v)));//easing(cc.easeCubicActionOut());
        var callback = cc.callFunc(this.complete, this);
        this.node.runAction(cc.sequence(moveh,movev, callback));
    },
    complete: function () {
        this.item();
        this.terrian();
        if (this.map.ondetection() == 0)//检测是否全部player行动完毕 
        {
            this.map.game.player_flag = 1;

        }
        else {
            
        }
        
      
    },
    terrian: function () {
        if (this.map.game.terrain_map[this.person.gettile().x][this.person.gettile().y] == null) {
            this.person.ATK_aid = 0;
            this.person.DEF_aid = 0;
        }
        else {
            this.person.ATK_aid = this.map.game.terrain_map[this.person.gettile().x][this.person.gettile().y].ATK;
            this.person.DEF_aid = this.map.game.terrain_map[this.person.gettile().x][this.person.gettile().y].DEF;

        }
    },
    item: function () {
        var flag = 0;
        if (this.map.game.item_map[this.person.gettile().x][this.person.gettile().y] != null) {
            for (var i = 0; i < this.person.item.getsize(); i++)
                if (this.map.game.item_map[this.person.gettile().x][this.person.gettile().y].string == this.person.item.find(i, 1).string) {
                    this.person.item.find(i, 1).count += this.map.game.item_map[this.person.gettile().x][this.person.gettile().y].count;
                    flag = 1;
                    break;
                }
            if (flag == 0)
                this.person.item.insert(this.map.game.item_map[this.person.gettile().x][this.person.gettile().y], this.person.item.getsize());

            
            this.map.itemuse.getComponent(cc.Label).string =this.map.game.item_map[this.person.gettile().x][this.person.gettile().y].string;
            this.map.itemuse.opacity = 255;
            this.map.itemuse.active = true;
            this.map.itemuse.getComponent('itemdisplay').enabled = true;
           

            this.map.game.item_map[this.person.gettile().x][this.person.gettile().y].obj.destroy();
            this.map.game.item_map[this.person.gettile().x][this.person.gettile().y] = null;

        }
       
    },

    init: function (map) {
        this.map = map;
        this.person = this.map.personpool.findperson(this.node);
        this.node.parent = this.map.node;
     //   cc.log(this.person);
        this.enabled = true;
        //  this.person.settile(cc.p(0, Math.floor(Math.random() * 15)));
        //this.tile = this.map.playerTile;
    },
    updatapos: function () {

        this.node.setPosition(this.getpostile(this.person.gettile()));
      //  cc.log(111);

    },
    getpostile: function (position) {
        // cc.log(position);
        let x = position.x * this.map.tiledMap.getTileSize().width;
        let y = (this.map.tiledMap.getMapSize().height - position.y - 1) * this.map.tiledMap.getTileSize().height;

        return cc.p(x, y);
    },

    update() {
        //cc.log(this.person);

      //  this.updatapos();

    },
});
