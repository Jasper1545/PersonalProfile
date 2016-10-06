var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.onloadmusic = function (event) {
        var snowloader = new egret.URLLoader();
        snowloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        snowloader.load(new egret.URLRequest("resource/snowhalation.mp3"));
        var flowerloader = new egret.URLLoader();
        flowerloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        flowerloader.load(new egret.URLRequest("resource/flowerdance.mp3"));
        var streetloader = new egret.URLLoader();
        streetloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        streetloader.load(new egret.URLRequest("resource/streetdreams.mp3"));
        var twiloader = new egret.URLLoader();
        twiloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        twiloader.load(new egret.URLRequest("resource/twilight.mp3"));
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        //页面滑动功能
        this.scrollRect = new egret.Rectangle(0, 0, stageW * 5, this.stage.stageHeight); //页面数修改处
        this.cacheAsBitmap = true;
        this.touchEnabled = true;
        var starttouchpointX = 0;
        var startstagepointX = 0;
        var movedistance = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startScroll, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, stopScroll, this);
        function startScroll(e) {
            if ((this.scrollRect.x % stageW) != 0) {
                this.scrollRect.x = startstagepointX; //如果图片位置错误，返回上一个正确位置；
            }
            starttouchpointX = e.stageX;
            startstagepointX = this.scrollRect.x;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this);
        }
        function onScroll(e) {
            var rect = this.scrollRect;
            movedistance = starttouchpointX - e.stageX;
            rect.x = (startstagepointX + movedistance);
            this.scrollRect = rect;
        }
        function stopScroll(e) {
            var rect = this.scrollRect;
            if ((movedistance >= (this.stage.stageWidth / 3)) && startstagepointX != stageW * 4) {
                rect.x = startstagepointX + stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else if ((movedistance <= (-(this.stage.stageWidth / 3))) && startstagepointX != 0) {
                rect.x = startstagepointX - stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else {
                movedistance = 0;
                rect.x = startstagepointX;
                this.scrollRect = rect;
            }
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this);
        }
        //页面滑动功能结束
        //第一页开始
        var page1 = new egret.DisplayObjectContainer();
        this.addChild(page1);
        page1.width = stageW;
        page1.height = stageH;
        var sky = this.createBitmapByName("02_jpg");
        page1.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        page1.addChild(topMask);
        var icon = this.createBitmapByName("egret_icon_png");
        page1.addChild(icon);
        icon.x = 26;
        icon.y = 33;
        var avatar = this.createBitmapByName("avatar_png");
        page1.addChild(avatar);
        avatar.width = 400;
        avatar.height = 400;
        avatar.anchorOffsetX = avatar.width / 2;
        avatar.anchorOffsetY = avatar.height / 2;
        avatar.x = this.stage.stageWidth / 2;
        avatar.y = this.stage.stageHeight / 2 - 50;
        var line1 = new egret.Shape();
        line1.graphics.lineStyle(2, 0xffffff);
        line1.graphics.moveTo(0, 0);
        line1.graphics.lineTo(0, 117);
        line1.graphics.endFill();
        line1.x = 172;
        line1.y = 61;
        page1.addChild(line1);
        var line2 = new egret.Shape();
        line2.graphics.lineStyle(4, 0xffffff);
        line2.graphics.moveTo(0, 0);
        line2.graphics.lineTo(stageW - 100, 0);
        line2.graphics.endFill();
        line2.anchorOffsetX = line2.width / 2;
        line2.anchorOffsetY = line2.height / 2;
        line2.x = avatar.x;
        line2.y = avatar.y + 250;
        page1.addChild(line2);
        var text1 = new egret.TextField();
        text1.textColor = 0xffffff;
        text1.width = stageW - 172;
        text1.textAlign = "center";
        text1.text = "个人简介";
        text1.size = 80;
        text1.anchorOffsetX = text1.width / 2;
        text1.anchorOffsetY = text1.height / 2;
        text1.x = avatar.x;
        text1.y = avatar.y + 350;
        page1.addChild(text1);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Powered By Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        page1.addChild(colorLabel);
        var textfield = new egret.TextField();
        page1.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        //第一页结束
        //第二页开始
        var page2 = new egret.DisplayObjectContainer();
        this.addChild(page2);
        page2.x = stageW;
        page2.width = stageW;
        page2.height = stageH;
        var sky2 = this.createBitmapByName("02_jpg");
        page2.addChild(sky2);
        sky2.width = stageW;
        sky2.height = stageH;
        var topMask2 = new egret.Shape();
        topMask2.graphics.beginFill(0x000000, 0.5);
        topMask2.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask2.graphics.endFill();
        topMask2.y = 95;
        page2.addChild(topMask2);
        var avatar2 = this.createBitmapByName("avatar_png");
        page2.addChild(avatar2);
        avatar2.width = 200;
        avatar2.height = 200;
        avatar2.anchorOffsetX = avatar2.width / 2;
        avatar2.anchorOffsetY = avatar2.height / 2;
        avatar2.x = this.stage.stageWidth / 4;
        avatar2.y = this.stage.stageHeight / 4;
        var changeavatar = function () {
            var avatartw = egret.Tween.get(avatar2);
            avatartw.to({ "rotation": 10 }, 100);
            avatartw.to({ "rotation": -10 }, 100);
            avatartw.to({ "rotation": 0 }, 100);
            avatartw.wait(2000);
            avatartw.call(changeavatar, self);
        };
        changeavatar();
        var page2text2 = new egret.TextField();
        page2text2.textColor = 0xffffff;
        page2text2.width = stageW - 172;
        page2text2.textAlign = "center";
        page2text2.text = "姓名  Jasper";
        page2text2.size = 40;
        page2text2.anchorOffsetX = page2text2.width / 2;
        page2text2.x = avatar2.x + 280;
        page2text2.y = avatar2.y - 100;
        page2.addChild(page2text2);
        var page2text3 = new egret.TextField();
        page2text3.textColor = 0xffffff;
        page2text3.width = stageW - 172;
        page2text3.textAlign = "center";
        page2text3.text = "性别  男";
        page2text3.size = 40;
        page2text3.anchorOffsetX = page2text2.width / 2;
        page2text3.x = page2text2.x;
        page2text3.y = page2text2.y + 80;
        page2.addChild(page2text3);
        var page2text4 = new egret.TextField();
        page2text4.textColor = 0xffffff;
        page2text4.width = stageW - 172;
        page2text4.textAlign = "center";
        page2text4.text = "年龄  保密";
        page2text4.size = 40;
        page2text4.anchorOffsetX = page2text4.width / 2;
        page2text4.x = page2text3.x;
        page2text4.y = page2text3.y + 80;
        page2.addChild(page2text4);
        var page2text5 = new egret.TextField();
        page2text5.textColor = 0xffffff;
        page2text5.width = stageW - 110;
        page2text5.text = "目前就读于北京某211大学";
        page2text5.size = 35;
        page2text5.x = avatar2.x - avatar2.width / 2 - 8;
        page2text5.y = page2text4.y + 100;
        page2.addChild(page2text5);
        var page2text6 = new egret.TextField();
        page2text6.textColor = 0xffffff;
        page2text6.width = stageW - 110;
        page2text6.text = "性格不算开朗，比较怕生";
        page2text6.size = 35;
        page2text6.x = page2text5.x;
        page2text6.y = page2text5.y + 70;
        page2.addChild(page2text6);
        var page2text7 = new egret.TextField();
        page2text7.textColor = 0xffffff;
        page2text7.width = stageW - 110;
        page2text7.text = "和朋友比较聊的开";
        page2text7.size = 35;
        page2text7.x = page2text6.x;
        page2text7.y = page2text6.y + 50;
        page2.addChild(page2text7);
        var page2text8 = new egret.TextField();
        page2text8.textColor = 0xffffff;
        page2text8.width = stageW - 110;
        page2text8.text = "兴趣爱好十分广泛";
        page2text8.size = 35;
        page2text8.x = page2text7.x;
        page2text8.y = page2text7.y + 70;
        page2.addChild(page2text8);
        var page2text9 = new egret.TextField();
        page2text9.textColor = 0xffffff;
        page2text9.width = stageW - 110;
        page2text9.text = "比较喜欢与见解深刻独特的人聊天";
        page2text9.size = 35;
        page2text9.x = page2text8.x;
        page2text9.y = page2text8.y + 70;
        page2.addChild(page2text9);
        var page2text10 = new egret.TextField();
        page2text10.textColor = 0xffffff;
        page2text10.width = stageW - 110;
        page2text10.text = "不太喜爱刻板的人";
        page2text10.size = 35;
        page2text10.x = page2text9.x;
        page2text10.y = page2text9.y + 70;
        page2.addChild(page2text10);
        var page2text11 = new egret.TextField();
        page2text11.textColor = 0xffffff;
        page2text11.width = stageW - 110;
        page2text11.text = "平时没事会宅在寝室或者是家里";
        page2text11.size = 35;
        page2text11.x = page2text10.x;
        page2text11.y = page2text10.y + 70;
        page2.addChild(page2text11);
        var page2text12 = new egret.TextField();
        page2text12.textColor = 0xffffff;
        page2text12.width = stageW - 110;
        page2text12.text = "接电话、回微信基本随缘";
        page2text12.size = 35;
        page2text12.x = page2text11.x;
        page2text12.y = page2text11.y + 70;
        page2.addChild(page2text12);
        //第二页结束
        //第三页开始
        var page3 = new egret.DisplayObjectContainer();
        this.addChild(page3);
        page3.x = stageW * 2;
        page3.width = stageW;
        page3.height = stageH;
        var sky3 = this.createBitmapByName("02_jpg");
        page3.addChild(sky3);
        sky3.width = stageW;
        sky3.height = stageH;
        var topMask3 = new egret.Shape();
        topMask3.graphics.beginFill(0x000000, 0.5);
        topMask3.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask3.graphics.endFill();
        topMask3.y = 95;
        page3.addChild(topMask3);
        var page3text1 = new egret.TextField();
        page3text1.textColor = 0xffffff;
        page3text1.width = stageW - 172;
        page3text1.textAlign = "center";
        page3text1.text = "喜爱的游戏";
        page3text1.size = 60;
        page3text1.anchorOffsetX = page3text1.width / 2;
        page3text1.anchorOffsetY = page3text1.height / 2;
        page3text1.x = stageW / 2;
        page3text1.y = topMask3.y + 60;
        page3.addChild(page3text1);
        var COD = this.createBitmapByName("COD_jpg");
        page3.addChild(COD);
        COD.scaleX = 0.15;
        COD.scaleY = 0.15;
        COD.anchorOffsetX = COD.width / 2;
        COD.anchorOffsetY = COD.height / 2;
        COD.x = this.stage.stageWidth / 4;
        COD.y = this.stage.stageHeight / 4 + 100;
        var CORPSE = this.createBitmapByName("CORPSE_jpg");
        page3.addChild(CORPSE);
        CORPSE.scaleX = COD.width * 0.15 / CORPSE.width;
        CORPSE.scaleY = COD.width * 0.15 / CORPSE.width;
        CORPSE.anchorOffsetX = CORPSE.width / 2;
        CORPSE.anchorOffsetY = CORPSE.height / 2;
        CORPSE.x = this.stage.stageWidth / 4 * 3;
        CORPSE.y = this.stage.stageHeight / 4 + 100;
        var HOI = this.createBitmapByName("HOI_jpg");
        page3.addChild(HOI);
        HOI.scaleX = COD.width * 0.15 / HOI.width;
        HOI.scaleY = COD.width * 0.15 / HOI.width;
        HOI.anchorOffsetX = HOI.width / 2;
        HOI.anchorOffsetY = HOI.height / 2;
        HOI.x = this.stage.stageWidth / 4;
        HOI.y = this.stage.stageHeight / 4 + 500;
        var SNH = this.createBitmapByName("SNH_jpg");
        page3.addChild(SNH);
        SNH.scaleX = COD.width * 0.15 / SNH.width;
        SNH.scaleY = COD.width * 0.15 / SNH.width;
        SNH.anchorOffsetX = SNH.width / 2;
        SNH.anchorOffsetY = SNH.height / 2;
        SNH.x = this.stage.stageWidth / 4 * 3;
        SNH.y = this.stage.stageHeight / 4 + 500;
        var pictureMask = new egret.Shape();
        pictureMask.graphics.beginFill(0x000000, 1);
        pictureMask.graphics.drawRect(0, 0, stageW, stageH - 200);
        pictureMask.graphics.endFill();
        pictureMask.y = 95;
        COD.touchEnabled = true;
        COD.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCODbig, this);
        var CODBIG = this.createBitmapByName("COD_jpg");
        CODBIG.scaleX = 0.25;
        CODBIG.scaleY = 0.25;
        CODBIG.anchorOffsetX = CODBIG.width / 2;
        CODBIG.anchorOffsetY = CODBIG.height / 2;
        CODBIG.x = this.stage.stageWidth / 2;
        CODBIG.y = this.stage.stageWidth / 5 * 4;
        CODBIG.touchEnabled = true;
        function onTouchCODbig(event) {
            page3.addChild(pictureMask);
            page3.addChild(CODBIG);
            COD.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCODbig, this);
            CODBIG.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCODsmall, this);
        }
        function onTouchCODsmall(event) {
            page3.removeChild(pictureMask);
            page3.removeChild(CODBIG);
            CODBIG.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCODsmall, this);
            COD.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCODbig, this);
        }
        HOI.touchEnabled = true;
        HOI.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchHOIbig, this);
        var HOIBIG = this.createBitmapByName("HOI_jpg");
        HOIBIG.scaleX = CODBIG.width * 0.25 / HOIBIG.width;
        HOIBIG.scaleY = CODBIG.width * 0.25 / HOIBIG.width;
        HOIBIG.anchorOffsetX = HOIBIG.width / 2;
        HOIBIG.anchorOffsetY = HOIBIG.height / 2;
        HOIBIG.x = this.stage.stageWidth / 2;
        HOIBIG.y = this.stage.stageWidth / 5 * 4;
        HOIBIG.touchEnabled = true;
        function onTouchHOIbig(event) {
            page3.addChild(pictureMask);
            page3.addChild(HOIBIG);
            HOI.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchHOIbig, this);
            HOIBIG.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchHOIsmall, this);
        }
        function onTouchHOIsmall(event) {
            page3.removeChild(pictureMask);
            page3.removeChild(HOIBIG);
            HOIBIG.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchHOIsmall, this);
            HOI.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchHOIbig, this);
        }
        SNH.touchEnabled = true;
        SNH.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchSNHbig, this);
        var SNHBIG = this.createBitmapByName("SNH_jpg");
        SNHBIG.scaleX = CODBIG.width * 0.25 / SNHBIG.width;
        SNHBIG.scaleY = CODBIG.width * 0.25 / SNHBIG.width;
        SNHBIG.anchorOffsetX = SNHBIG.width / 2;
        SNHBIG.anchorOffsetY = SNHBIG.height / 2;
        SNHBIG.x = this.stage.stageWidth / 2;
        SNHBIG.y = this.stage.stageWidth / 5 * 4;
        SNHBIG.touchEnabled = true;
        function onTouchSNHbig(event) {
            page3.addChild(pictureMask);
            page3.addChild(SNHBIG);
            SNH.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchSNHbig, this);
            SNHBIG.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchSNHsmall, this);
        }
        function onTouchSNHsmall(event) {
            page3.removeChild(pictureMask);
            page3.removeChild(SNHBIG);
            SNHBIG.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchSNHsmall, this);
            SNH.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchSNHbig, this);
        }
        CORPSE.touchEnabled = true;
        CORPSE.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCORPSEbig, this);
        var CORPSEBIG = this.createBitmapByName("CORPSE_jpg");
        CORPSEBIG.scaleX = CODBIG.width * 0.25 / CORPSEBIG.width;
        CORPSEBIG.scaleY = CODBIG.width * 0.25 / CORPSEBIG.width;
        CORPSEBIG.anchorOffsetX = CORPSEBIG.width / 2;
        CORPSEBIG.anchorOffsetY = CORPSEBIG.height / 2;
        CORPSEBIG.x = this.stage.stageWidth / 2;
        CORPSEBIG.y = this.stage.stageWidth / 5 * 4;
        CORPSEBIG.touchEnabled = true;
        function onTouchCORPSEbig(event) {
            page3.addChild(pictureMask);
            page3.addChild(CORPSEBIG);
            CORPSE.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCORPSEbig, this);
            CORPSEBIG.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCORPSEsmall, this);
        }
        function onTouchCORPSEsmall(event) {
            page3.removeChild(pictureMask);
            page3.removeChild(CORPSEBIG);
            CORPSEBIG.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCORPSEsmall, this);
            CORPSE.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchCORPSEbig, this);
        }
        //第四页开始
        var page4 = new egret.DisplayObjectContainer();
        this.addChild(page4);
        page4.x = stageW * 3;
        page4.width = stageW;
        page4.height = stageH;
        var sky4 = this.createBitmapByName("02_jpg");
        page4.addChild(sky4);
        sky4.width = stageW;
        sky4.height = stageH;
        var topMask4 = new egret.Shape();
        topMask4.graphics.beginFill(0x000000, 0.5);
        topMask4.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask4.graphics.endFill();
        topMask4.y = 95;
        page4.addChild(topMask4);
        var page4text1 = new egret.TextField();
        page4text1.textColor = 0xffffff;
        page4text1.width = stageW - 172;
        page4text1.textAlign = "center";
        page4text1.text = "最喜爱的音乐";
        page4text1.size = 60;
        page4text1.anchorOffsetX = page4text1.width / 2;
        page4text1.anchorOffsetY = page4text1.height / 2;
        page4text1.x = stageW / 2;
        page4text1.y = topMask4.y + 60;
        page4.addChild(page4text1);
        var snowhalation = this.createBitmapByName("snowhalation_jpg");
        page4.addChild(snowhalation);
        snowhalation.scaleX = 0.18;
        snowhalation.scaleY = 0.18;
        snowhalation.anchorOffsetX = snowhalation.width / 2;
        snowhalation.anchorOffsetY = snowhalation.height / 2;
        snowhalation.x = this.stage.stageWidth / 4;
        snowhalation.y = this.stage.stageHeight / 4 + 100;
        var flowerdance = this.createBitmapByName("flowerdance_png");
        page4.addChild(flowerdance);
        flowerdance.scaleX = snowhalation.width * 0.18 / flowerdance.width;
        flowerdance.scaleY = snowhalation.width * 0.18 / flowerdance.width;
        flowerdance.anchorOffsetX = flowerdance.width / 2;
        flowerdance.anchorOffsetY = flowerdance.height / 2;
        flowerdance.x = this.stage.stageWidth / 4 * 3;
        flowerdance.y = this.stage.stageHeight / 4 + 100;
        var streetdreams = this.createBitmapByName("streetdreams_jpg");
        page4.addChild(streetdreams);
        streetdreams.scaleX = snowhalation.width * 0.18 / streetdreams.width;
        streetdreams.scaleY = snowhalation.width * 0.18 / streetdreams.width;
        streetdreams.anchorOffsetX = streetdreams.width / 2;
        streetdreams.anchorOffsetY = streetdreams.height / 2;
        streetdreams.x = this.stage.stageWidth / 4;
        streetdreams.y = this.stage.stageHeight / 4 + 500;
        var twilight = this.createBitmapByName("twilight_jpg");
        page4.addChild(twilight);
        twilight.scaleX = snowhalation.width * 0.18 / twilight.width;
        twilight.scaleY = snowhalation.width * 0.18 / twilight.width;
        twilight.anchorOffsetX = twilight.width / 2;
        twilight.anchorOffsetY = twilight.height / 2;
        twilight.x = this.stage.stageWidth / 4 * 3;
        twilight.y = this.stage.stageHeight / 4 + 500;
        var page4text2 = new egret.TextField();
        page4text2.textColor = 0xffffff;
        page4text2.width = stageW - 172;
        page4text2.textAlign = "center";
        page4text2.text = "Snow Halation";
        page4text2.size = 30;
        page4text2.anchorOffsetX = page4text2.width / 2;
        page4text2.anchorOffsetY = page4text2.height / 2;
        page4text2.x = snowhalation.x;
        page4text2.y = snowhalation.y + 180;
        page4.addChild(page4text2);
        var page4text3 = new egret.TextField();
        page4text3.textColor = 0xffffff;
        page4text3.width = stageW - 172;
        page4text3.textAlign = "center";
        page4text3.text = "Flower Dance";
        page4text3.size = 30;
        page4text3.anchorOffsetX = page4text3.width / 2;
        page4text3.anchorOffsetY = page4text3.height / 2;
        page4text3.x = flowerdance.x;
        page4text3.y = flowerdance.y + 180;
        page4.addChild(page4text3);
        var page4text4 = new egret.TextField();
        page4text4.textColor = 0xffffff;
        page4text4.width = stageW - 172;
        page4text4.textAlign = "center";
        page4text4.text = "Street Dream";
        page4text4.size = 30;
        page4text4.anchorOffsetX = page4text4.width / 2;
        page4text4.anchorOffsetY = page4text4.height / 2;
        page4text4.x = streetdreams.x;
        page4text4.y = streetdreams.y + 180;
        page4.addChild(page4text4);
        var page4text5 = new egret.TextField();
        page4text5.textColor = 0xffffff;
        page4text5.width = stageW - 172;
        page4text5.textAlign = "center";
        page4text5.text = "Twilight";
        page4text5.size = 30;
        page4text5.anchorOffsetX = page4text5.width / 2;
        page4text5.anchorOffsetY = page4text5.height / 2;
        page4text5.x = twilight.x;
        page4text5.y = twilight.y + 180;
        page4.addChild(page4text5);
        //音频播放
        var channel = this.soundChannel;
        var playsign = false;
        var flowersign = false;
        var streetsign = false;
        var snowsign = false;
        var twisign = false;
        var floweranimesign = false;
        var snowanimesign = false;
        var streetanimesign = false;
        var twianimesign = false;
        function animestop() {
            floweranimesign = false;
            snowanimesign = false;
            streetanimesign = false;
            twianimesign = false;
            flowerdance.touchEnabled = true;
            streetdreams.touchEnabled = true;
            snowhalation.touchEnabled = true;
            twilight.touchEnabled = true;
        }
        var flowerloader = new egret.URLLoader();
        flowerloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        flowerloader.load(new egret.URLRequest("resource/flowerdance.mp3"));
        flowerloader.addEventListener(egret.Event.COMPLETE, function flowerloadOver(event) {
            flowersign = true;
        }, this);
        var twiloader = new egret.URLLoader();
        twiloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        twiloader.load(new egret.URLRequest("resource/twilight.mp3"));
        twiloader.addEventListener(egret.Event.COMPLETE, function twiloadOver(event) {
            twisign = true;
        }, this);
        var snowloader = new egret.URLLoader();
        snowloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        snowloader.load(new egret.URLRequest("resource/snowhalation.mp3"));
        snowloader.addEventListener(egret.Event.COMPLETE, function snowloadOver(event) {
            snowsign = true;
        }, this);
        var streetloader = new egret.URLLoader();
        streetloader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        streetloader.load(new egret.URLRequest("resource/streetdreams.mp3"));
        streetloader.addEventListener(egret.Event.COMPLETE, function streetloadOver(event) {
            streetsign = true;
        }, this);
        flowerdance.touchEnabled = true;
        flowerdance.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchflowerdance, this);
        snowhalation.touchEnabled = true;
        snowhalation.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchsnowhalation, this);
        streetdreams.touchEnabled = true;
        streetdreams.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchstreetdreams, this);
        twilight.touchEnabled = true;
        twilight.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchtwilight, this);
        //结束建造停止播放按钮
        //播放按钮开始
        function onTouchflowerdance(event) {
            animestop();
            flowerdance.touchEnabled = false;
            if (playsign == true) {
                channel.stop();
            }
            var sound = flowerloader.data;
            if (flowersign == true) {
                channel = sound.play(0, -1);
                playsign = true;
                floweranimesign = true;
                var flowerplayanime = function () {
                    if (floweranimesign == true) {
                        var flowerplaytw = egret.Tween.get(flowerdance);
                        flowerplaytw.to({ "rotation": 10 }, 800);
                        flowerplaytw.to({ "rotation": 0 }, 800);
                        flowerplaytw.to({ "rotation": -10 }, 800);
                        flowerplaytw.to({ "rotation": 0 }, 800);
                        flowerplaytw.call(flowerplayanime, self);
                    }
                };
                flowerplayanime();
            }
            else {
                var flowertw = egret.Tween.get(flowerdance);
                flowertw.to({ "rotation": 10 }, 100);
                flowertw.to({ "rotation": -10 }, 100);
                flowertw.to({ "rotation": 0 }, 100);
                flowerdance.touchEnabled = true;
            }
        }
        function onTouchsnowhalation(event) {
            animestop();
            snowhalation.touchEnabled = false;
            if (playsign == true) {
                channel.stop();
            }
            var sound = snowloader.data;
            if (snowsign == true) {
                channel = sound.play(0, -1);
                playsign = true;
                snowanimesign = true;
                var snowplayanime = function () {
                    if (snowanimesign == true) {
                        var snowplaytw = egret.Tween.get(snowhalation);
                        snowplaytw.to({ "rotation": 10 }, 800);
                        snowplaytw.to({ "rotation": 0 }, 800);
                        snowplaytw.to({ "rotation": -10 }, 800);
                        snowplaytw.to({ "rotation": 0 }, 800);
                        snowplaytw.call(snowplayanime, self);
                    }
                };
                snowplayanime();
            }
            else {
                var snowtw = egret.Tween.get(snowhalation);
                snowtw.to({ "rotation": 10 }, 100);
                snowtw.to({ "rotation": -10 }, 100);
                snowtw.to({ "rotation": 0 }, 100);
                snowhalation.touchEnabled = true;
            }
        }
        function onTouchstreetdreams(event) {
            animestop();
            streetdreams.touchEnabled = false;
            if (playsign == true) {
                channel.stop();
            }
            var sound = streetloader.data;
            if (streetsign == true) {
                channel = sound.play(0, -1);
                playsign = true;
                streetanimesign = true;
                var streetplayanime = function () {
                    if (streetanimesign == true) {
                        var streetplaytw = egret.Tween.get(streetdreams);
                        streetplaytw.to({ "rotation": 10 }, 800);
                        streetplaytw.to({ "rotation": 0 }, 800);
                        streetplaytw.to({ "rotation": -10 }, 800);
                        streetplaytw.to({ "rotation": 0 }, 800);
                        streetplaytw.call(streetplayanime, self);
                    }
                };
                streetplayanime();
            }
            else {
                var streettw = egret.Tween.get(streetdreams);
                streettw.to({ "rotation": 10 }, 100);
                streettw.to({ "rotation": -10 }, 100);
                streettw.to({ "rotation": 0 }, 100);
                streetdreams.touchEnabled = true;
            }
        }
        function onTouchtwilight(event) {
            animestop();
            twilight.touchEnabled = false;
            if (playsign == true) {
                channel.stop();
            }
            var sound = twiloader.data;
            if (twisign == true) {
                channel = sound.play(0, -1);
                playsign = true;
                twianimesign = true;
                var twiplayanime = function () {
                    if (twianimesign == true) {
                        var twiplaytw = egret.Tween.get(twilight);
                        twiplaytw.to({ "rotation": 10 }, 800);
                        twiplaytw.to({ "rotation": 0 }, 800);
                        twiplaytw.to({ "rotation": -10 }, 800);
                        twiplaytw.to({ "rotation": 0 }, 800);
                        twiplaytw.call(twiplayanime, self);
                    }
                };
                twiplayanime();
            }
            else {
                var twitw = egret.Tween.get(twilight);
                twitw.to({ "rotation": 10 }, 100);
                twitw.to({ "rotation": -10 }, 100);
                twitw.to({ "rotation": 0 }, 100);
                twilight.touchEnabled = true;
            }
        }
        //音频播放结束
        //第四页结束        
        //第五页开始
        var page5 = new egret.DisplayObjectContainer();
        this.addChild(page5);
        page5.x = stageW * 4;
        page5.width = stageW;
        page5.height = stageH;
        var sky5 = this.createBitmapByName("02_jpg");
        page5.addChild(sky5);
        sky5.width = stageW;
        sky5.height = stageH;
        var topMask5 = new egret.Shape();
        topMask5.graphics.beginFill(0x000000, 0.5);
        topMask5.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask5.graphics.endFill();
        topMask5.y = 95;
        page5.addChild(topMask5);
        var page5text1 = new egret.TextField();
        page5text1.textColor = 0xffffff;
        page5text1.width = stageW - 172;
        page5text1.textAlign = "center";
        page5text1.text = "最喜爱的书籍";
        page5text1.size = 60;
        page5text1.anchorOffsetX = page5text1.width / 2;
        page5text1.anchorOffsetY = page5text1.height / 2;
        page5text1.x = stageW / 2;
        page5text1.y = topMask5.y + 60;
        page5.addChild(page5text1);
        var changebrother = function () {
            var brothertw = egret.Tween.get(brother);
            brothertw.to({ "alpha": 1 }, 500);
            brothertw.wait(2000);
            brothertw.to({ "alpha": 0 }, 500);
            brothertw.call(changewealth, self);
        };
        var changewealth = function () {
            var wealthtw = egret.Tween.get(wealth);
            wealthtw.to({ "alpha": 1 }, 500);
            wealthtw.wait(2000);
            wealthtw.to({ "alpha": 0 }, 500);
            wealthtw.call(changeuniverse, self);
        };
        var changeuniverse = function () {
            var universetw = egret.Tween.get(universe);
            universetw.to({ "alpha": 1 }, 500);
            universetw.wait(2000);
            universetw.to({ "alpha": 0 }, 500);
            universetw.call(changebrother, self);
        };
        var brother = this.createBitmapByName("brother_jpg");
        page5.addChild(brother);
        brother.scaleX = 1;
        brother.scaleY = 1;
        brother.anchorOffsetX = brother.width / 2;
        brother.anchorOffsetY = brother.height / 2;
        brother.x = this.stage.stageWidth / 2;
        brother.y = this.stage.stageHeight / 2;
        brother.alpha = 1;
        var wealth = this.createBitmapByName("wealth_jpg");
        page5.addChild(wealth);
        wealth.scaleX = brother.width / wealth.width;
        wealth.scaleY = brother.width / wealth.width;
        wealth.anchorOffsetX = wealth.width / 2;
        wealth.anchorOffsetY = wealth.height / 2;
        wealth.x = this.stage.stageWidth / 2;
        wealth.y = this.stage.stageHeight / 2;
        wealth.alpha = 0;
        var universe = this.createBitmapByName("universe_jpg");
        page5.addChild(universe);
        universe.scaleX = brother.width / universe.width;
        universe.scaleY = brother.width / universe.width;
        universe.anchorOffsetX = universe.width / 2;
        universe.anchorOffsetY = universe.height / 2;
        universe.x = this.stage.stageWidth / 2;
        universe.y = this.stage.stageHeight / 2;
        universe.alpha = 0;
        changebrother(); //封面循环
        //第五页结束
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map