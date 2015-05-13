(function (win, q) {
    function init() {
        getRegionsInfo();
        setInterval(getRegionsInfo, 18E4);
		/*
		setInterval выполняет код много раз, 
		через равные промежутки времени, пока не будет остановлен при помощи clearInterval.
		*/
		//alert("test");
        g_canvasElem = $ = document.getElementById("canvas");
        d = g_canvasElem.getContext("2d");
        g_canvasElem.onmousedown = function (a) {
            if (isMobile) {
                var b = a.clientX - (5 + l / 5 / 2), c = a.clientY - (5 + l / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= l / 5 / 2) {
                    sendMouseCoords();
                    sendUint8(17);
                    return
                }
            }
            g_mouseX = a.clientX;
            g_mouseY = a.clientY;
            updateMouseCoordinates();
            sendMouseCoords()
        };
        g_canvasElem.onmousemove = function (a) {
            g_mouseX = a.clientX;
            g_mouseY = a.clientY;
            updateMouseCoordinates()
        };
        g_canvasElem.onmouseup = function (a) {
        };
		//!1 = false !0 = true
        var a = !1, b = !1, c = !1;
        win.onkeydown = function (e) {
            /*space*/32 != e.keyCode || a || (sendMouseCoords(), sendUint8(17), a = !0);
            /*q*/81 != e.keyCode || b || (sendUint8(18), b = !0);
            /*w*/87 != e.keyCode || c || (sendMouseCoords(), sendUint8(21), c = !0);
            27 == e.keyCode && q("#overlays").fadeIn(200)
        };
        win.onkeyup = function (e) {
            32 == e.keyCode && (a = !1);
            87 == e.keyCode && (c = !1);
            81 == e.keyCode && b && (sendUint8(19), b = !1)
        };
        win.onblur = function () {
            sendUint8(19);
            c = b = a = !1
        };
        win.onresize = onWindowResized;
        onWindowResized();
        win.requestAnimationFrame ? win.requestAnimationFrame(ka) : setInterval(ba, 1E3 / 60);
        setInterval(sendMouseCoords, 40);
        setRegion(q("#region").val()); //q() видимо аналог $() для вызова функций jquery
        q("#overlays").show()
    }
    function xa() {
        if (.5 > k)
            F = null;
        else {
            for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, e = Number.NEGATIVE_INFINITY, d = 0, f = 0; f < p.length; f++)
                p[f].shouldRender() && (d = Math.max(p[f].size, d), a = Math.min(p[f].x, a), b = Math.min(p[f].y, b), c = Math.max(p[f].x, c), e = Math.max(p[f].y, e));
            F = QUAD.init({minX: a - (d + 100), minY: b - (d + 100), maxX: c + (d + 100), maxY: e + (d + 100)});
            for (f = 0; f < p.length; f++)
                if (a = p[f], a.shouldRender())
                    for (b = 0; b < a.points.length; ++b)
                        F.insert(a.points[b])
        }
    }
    function updateMouseCoordinates() {
        P = (g_mouseX - l / 2) / k + s;
        Q = (g_mouseY - r / 2) / k + t
    }
    function getRegionsInfo() {
		//R map регионов
        null == R && (R = {}, q("#region").children().each(function () {//перебираем всех наследников селекта
            var a = q(this), b = a.val();
            b && (R[b] = a.text())//и запихиваем в R
        }));
        q.get("http://m.agar.io/info", function (a) {//разбор json ответа с инфой о регионах, и кол-ве игроков на них
            var b = {}, c;//b мар ключ регион, значение кол-во игроков
            for (c in a.regions) {
                var e =
                        c.split(":")[0];
                b[e] = b[e] || 0;
                b[e] += a.regions[c].numPlayers
            }
            for (c in b)
                q('#region option[value="' + c + '"]').text(R[c] + " (" + b[c] + " players)")
        }, "json")
    }
    function ma() {
        q("#adsBottom").hide();
        q("#overlays").hide()
    }
    function setRegion(a) {
		
        a && a != G && (G = a, ca())
    }
    function na() {
        console.log("Find " + G + H);
		console.log("my ");
        q.ajax("http://m.agar.io/", {error: function () {
                setTimeout(na, 1E3)
            }, success: function (a) {
				console.log("ws://" + a[0]);
				console.log(a);
                a = a.split("\n");
                connectTo("ws://" + a[0])
            }, dataType: "text", method: "POST", cache: !1, crossDomain: !0, data: G + H || "?"})
    }
    function ca() {
        G && (q("#connecting").show(), na())
    }
    function connectTo(a) {
        h && (h.onopen = null, h.onmessage = null, h.onclose = null, h.close(), h = null);
        B = [];
        m = [];
        w = {};
        p = [];
        C = [];
        y = [];
        x = u = null;
        console.log("Connecting to " + a);
        h = new WebSocket(a);
        h.binaryType = "arraybuffer";
        h.onopen = onConnected;
        h.onmessage = za;
        h.onclose = Aa;
        h.onerror = function () {
            console.log("socket error")
        }
    }
    function onConnected(a) {
        q("#connecting").hide();
        console.log("socket open");
        a = new ArrayBuffer(5);//массив "срых" данных
        var b = new DataView(a); //представляет гетерогенный доступ к массиву типа ArrayBuffer
        b.setUint8(0, 254); // записываем в а через б 8-bit unsigned integer 0 - индекс 254 значение http://www.javascripture.com/DataView
        b.setUint32(1, 1, !0);//32-bit unsigned integer   setUint32(byteOffset, value [, littleEndian])
        h.send(a); 
        a = new ArrayBuffer(5);
        b = new DataView(a);
        b.setUint8(0, 255);
        b.setUint32(1, 1, !0);
        h.send(a); //зачем отправялть практически то же самое второй раз, только со значением 255 вместо 254?
        sendNickName()
    }
    function Aa(a) {
        console.log("socket close");
        setTimeout(ca, 500)
    }
	
	//вызывается при приеме данных
    function za(a) {
        function b() {
            for (var a = ""; ; ) {
                var b = e.getUint16(c, !0);
                c += 2;
                if (0 == b)
                    break;
                a += String.fromCharCode(b)
            }
            return a
        }
        var c = 1, e = new DataView(a.data);
        switch (e.getUint8(0)) {
            case 16:
				// server tick
                onServerTick(e);
                break;
            case 17:
                I = e.getFloat32(1, !0);
                J = e.getFloat32(5, !0);
                K = e.getFloat32(9, !0);
                break;
            case 20:
                m = [];
                B = [];
                break;
            case 32:
                B.push(e.getUint32(1, !0));
                break;
            case 49:
                if (null != u)
                    break;
                a = e.getUint32(c, !0);
                c += 4;
                y = [];
                for (var d = 0; d < a; ++d) {
                    var f = e.getUint32(c, !0), c = c + 4;
                    y.push({id: f, name: b()})
                }
                predrawLeaders();
                break;
            case 50:
                u = [];
                a = e.getUint32(c, !0);
                c += 4;
                for (d = 0; d < a; ++d)
                    u.push(e.getFloat32(c, !0)), c += 4;
                predrawLeaders();
                break;
            case 64:
                S = e.getFloat64(1, !0), T = e.getFloat64(9, !0), U = e.getFloat64(17, !0), V = e.getFloat64(25, !0), I = (U + S) / 2, J = (V + T) / 2, K = 1, 0 == m.length && (s = I, t = J, k = K)
            }
    }
    function onServerTick(/*DataView*/a) {
        D = +new Date;
        var b = Math.random(), c = 1;
        da = !1;
        for (var e = a.getUint16(c, !0), c = c + 2, d = 0; d < e; ++d) {
            var f = w[a.getUint32(c, !0)], win = w[a.getUint32(c + 4, !0)], c = c + 8;
            f && win && (win.destroy(), win.ox =
                    win.x, win.oy = win.y, win.oSize = win.size, win.nx = f.x, win.ny = f.y, win.nSize = win.size, win.updateTime = D)
        }
        for (; ; ) {
            e = a.getUint32(c, !0);
            c += 4;
            if (0 == e)
                break;
            for (var d = a.getFloat32(c, !0), c = c + 4, f = a.getFloat32(c, !0), c = c + 4, win = a.getFloat32(c, !0), c = c + 4, h = a.getUint8(c++), k = a.getUint8(c++), l = a.getUint8(c++), h = (h << 16 | k << 8 | l).toString(16); 6 > h.length; )
                h = "0" + h;
            h = "#" + h;
            l = a.getUint8(c++);
            k = !!(l & 1);
            l & 2 && (c += 4);
            l & 4 && (c += 8);
            l & 8 && (c += 16);
            for (l = ""; ; ) {
                var n = a.getUint16(c, !0), c = c + 2;
                if (0 == n)
                    break;
                l += String.fromCharCode(n)
            }
            n = null;
            w.hasOwnProperty(e) ? (n = w[e], n.updatePos(), n.ox = n.x, n.oy = n.y, n.oSize = n.size, n.color = h) : (n = new ra(e, d, f, win, h, k, l), n.pX = d, n.pY = f);
            n.nx = d;
            n.ny = f;
            n.nSize = win;
            n.updateCode = b;
            n.updateTime = D;
            -1 != B.indexOf(e) && -1 == m.indexOf(n) && (document.getElementById("overlays").style.display = "none", m.push(n), 1 == m.length && (s = n.x, t = n.y))
        }
        a.getUint16(c, !0);
        c += 2;
        f = a.getUint32(c, !0);
        c += 4;
        for (d = 0; d < f; d++)
            e = a.getUint32(c, !0), c += 4, w[e] && (w[e].updateCode = b);
        for (d = 0; d < p.length; d++)
            p[d].updateCode != b && p[d--].destroy();
        da && 0 == m.length && q("#overlays").fadeIn(3E3)
    }
    function sendMouseCoords() {
        if (null != h && h.readyState == h.OPEN) {
            var a = g_mouseX - l / 2, b = g_mouseY - r / 2;
            64 > a * a + b * b || sa == P && ta == Q || (sa = P, ta = Q, a = new ArrayBuffer(21), b = new DataView(a), b.setUint8(0, 16), b.setFloat64(1, P, !0), b.setFloat64(9, Q, !0), b.setUint32(17, 0, !0), h.send(a))
        }
    }
	//вроде как формирование и отправка введенного имени на сервер
	// h это сокет
    function sendNickName() {
        if (null != h && h.readyState == h.OPEN && null != L) {
            var a = new ArrayBuffer(1 + 2 * L.length), b = new DataView(a);
            b.setUint8(0, 0);
            for (var c = 0; c < L.length; ++c)
                b.setUint16(1 + 2 * c, L.charCodeAt(c), !0);
            h.send(a)
        }
    }
    function sendUint8(a) {
		//проверяем состояние сокета
        if (null != h && h.readyState == h.OPEN) {
            var b = new ArrayBuffer(1);//формируем данные
            (new DataView(b)).setUint8(0, a);//задаем переданные аргумент и отправляем
            h.send(b)
        }
    }
    function ka() {
        ba();
        win.requestAnimationFrame(ka)
    }
    function onWindowResized() {
        l = win.innerWidth;
        r = win.innerHeight;
        $.width = g_canvasElem.width = l;
        $.height = g_canvasElem.height = r;
        ba()
    }
    function Ca() {
        if (0 != m.length) {
            for (var a = 0, b = 0; b < m.length; b++)
                a += m[b].size;
            a = Math.pow(Math.min(64 / a, 1), .4) * Math.max(r / 1080, l / 1920);
            k = (9 * k + a) / 10
        }
    }
    function ba() {
        var a = +new Date;
        ++Da;
        D = +new Date;
        if (0 < m.length) {
            Ca();
            for (var b = 0, c = 0, e = 0; e < m.length; e++)
                m[e].updatePos(), b += m[e].x / m.length, c += m[e].y / m.length;
            I = b;
            J = c;
            K = k;
            s = (s + b) / 2;
            t = (t + c) / 2
        } else
            s = (29 * s + I) / 30, t = (29 * t + J) / 30, k = (9 * k + K) / 10;
        xa();
        updateMouseCoordinates();
        d.clearRect(0, 0, l, r);
        d.fillStyle = ea ? "#111111" : "#F2FBFF";
        d.fillRect(0, 0, l, r);
        d.save();
        d.strokeStyle = ea ? "#AAAAAA" : "#000000";
        d.globalAlpha = .2;
        d.scale(k, k);
        b = l / k;
        c = r / k;
        for (e = - .5 + ( - s + b / 2) % 50; e < b; e += 50)
            d.beginPath(), d.moveTo(e, 0), d.lineTo(e, c), d.stroke();
        for (e = - .5 + ( - t + c / 2) % 50; e < c; e += 50)
            d.beginPath(), d.moveTo(0, e), d.lineTo(b, e), d.stroke();
        d.restore();
        p.sort(function (a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size
        });
        d.save();
        d.translate(l /
                2, r / 2);
        d.scale(k, k);
        d.translate(-s, -t);
        for (e = 0; e < C.length; e++)
            C[e].draw();
        for (e = 0; e < p.length; e++)
            p[e].draw();
        d.restore();
        x && d.drawImage(x, l - x.width - 10, 10);
        M = Math.max(M, Ea());
        0 != M && (null == W && (W = new X(24, "#FFFFFF")), W.setValue("Score: " + ~~(M / 100)), c = W.render(), b = c.width, d.globalAlpha = .2, d.fillStyle = "#000000", d.fillRect(10, r - 10 - 24 - 10, b + 10, 34), d.globalAlpha = 1, d.drawImage(c, 15, r - 10 - 24 - 5));
        Fa();
        a = +new Date - a;
        a > 1E3 / 60 ? v -= .01 : a < 1E3 / 65 && (v += .01);
        .4 > v && (v = .4);
        1 < v && (v = 1)
    }
    function Fa() {
        if (isMobile && fa.width) {
            var a = l / 5;
            d.drawImage(fa, 5, 5, a, a)
        }
    }
    function Ea() {
        for (var a = 0, b = 0; b < m.length; b++)
            a += m[b].nSize * m[b].nSize;
        return a
    }
    function predrawLeaders() {
        x = null;
        if (null != u || 0 != y.length)
            if (null != u || Y) {
                x = document.createElement("canvas");
                var a = x.getContext("2d"), b = 60, b = null == u ? b + 24 * y.length : b + 180, c = Math.min(200, .3 * l) / 200;
                x.width = 200 * c;
                x.height = b * c;
                a.scale(c, c);
                a.globalAlpha = .4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c).width /
                        2, 40);
                if (null == u)
                    for (a.font = "20px Ubuntu", b = 0; b < y.length; ++b)
                        c = y[b].name || "An unnamed cell", Y || (c = "An unnamed cell"), -1 != B.indexOf(y[b].id) ? (m[0].name && (c = m[0].name), a.fillStyle = "#FFAAAA") : a.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
                else
                    for (b = c = 0; b < u.length; ++b)
                        angEnd = c + u[b] * Math.PI * 2, a.fillStyle = Ga[b + 1], a.beginPath(), a.moveTo(100, 140), a.arc(100, 140, 80, c, angEnd, !1), a.fill(), c = angEnd
            }
    }
    function ra(a, b, c, e, d, f, win) {
        p.push(this);
        w[a] = this;
        this.id = a;
        this.ox = this.x = b;
        this.oy = this.y = c;
        this.oSize = this.size = e;
        this.color = d;
        this.isVirus = f;
        this.points = [];
        this.pointsAcc = [];
        this.createPoints();
        this.setName(win)
    }
    function X(a, b, c, e) {
        a && (this._size = a);
        b && (this._color = b);
        this._stroke = !!c;
        e && (this._strokeColor = e)
    }
	//проверка где запускается скрипт
    if ("agar.io" != win.location.hostname && "localhost" != win.location.hostname && "10.10.2.13" != win.location.hostname)
        win.location = "http://agar.io/";
    else if (win.top != win)
        win.top.location = "http://agar.io/";
    else {
        var $, d, g_canvasElem, l, r, F = null, h = null, s = 0, t = 0, B = [], m = [], w = {}, p = [], C = [], y = [], g_mouseX = 0, g_mouseY = 0, P = -1, Q = -1, Da = 0, D = 0, L = null, S = 0, T = 0, U = 1E4, V = 1E4, k = 1, G = null, ua = !0, Y = !0, ga = !1, da = !1, M = 0, ea = !1, va = !1, I = s = ~~((S + U) / 2), J = t = ~~((T + V) / 2), K = 1, H = "", u = null, Ga = ["#333333", "#FF3333", "#33FF33", "#3333FF"], isMobile = "ontouchstart"in win && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), fa = new Image;
        fa.src = "img/split.png";
        var R = null;
        win.setNick = function (a) {
            ma();
            L = a;
            sendNickName();
            M = 0
        };
        win.setRegion = setRegion;
        win.setSkins = function (a) {
            ua = a
        };
        win.setNames = function (a) {
            Y = a
        };
        win.setDarkTheme = function (a) {
            ea = a
        };
        win.setColors =
                function (a) {
                    ga = a
                };
        win.setShowMass = function (a) {
            va = a
        };
        win.spectate = function () {
            sendUint8(1);
            ma()
        };
        win.setGameMode = function (a) {
            a != H && (H = a, ca())
        };
        win.connect = connectTo;
        var sa = -1, ta = -1, x = null, v = 1, W = null, Z = {}, Ha = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;ussr;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;nazi;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;isis;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface".split(";"), Ia = ["m'blob"];
        ra.prototype = {id: 0, points: null, pointsAcc: null, name: null, nameCache: null, sizeCache: null, x: 0, y: 0, size: 0, ox: 0, oy: 0, oSize: 0, nx: 0, ny: 0, nSize: 0, updateTime: 0, updateCode: 0, drawTime: 0, destroyed: !1, isVirus: !1, destroy: function () {
                var a;
                for (a = 0; a < p.length; a++)
                    if (p[a] == this) {
                        p.splice(a, 1);
                        break
                    }
                delete w[this.id];
                a = m.indexOf(this);
                -1 != a && (da = !0, m.splice(a, 1));
                a = B.indexOf(this.id);
                -1 != a && B.splice(a, 1);
                this.destroyed = !0;
                C.push(this)
            }, getNameSize: function () {
                return Math.max(~~(.3 * this.size), 24)
            }, setName: function (a) {
                if (this.name = a)
                    null == this.nameCache ? this.nameCache = new X(this.getNameSize(), "#FFFFFF", !0, "#000000") : this.nameCache.setSize(this.getNameSize()), this.nameCache.setValue(this.name)
            }, createPoints: function () {
                for (var a = this.getNumPoints(); this.points.length > a; ) {
                    var b = ~~(Math.random() * this.points.length);
                    this.points.splice(b, 1);
                    this.pointsAcc.splice(b, 1)
                }
                0 == this.points.length && 0 < a && (this.points.push({c: this, v: this.size, x: this.x, y: this.y}), this.pointsAcc.push(Math.random() - .5));
                for (; this.points.length < a; ) {
                    var b = ~~(Math.random() * this.points.length), c = this.points[b];
                    this.points.splice(b, 0, {c: this, v: c.v, x: c.x, y: c.y});
                    this.pointsAcc.splice(b, 0, this.pointsAcc[b])
                }
            }, getNumPoints: function () {
                var a = 10;
                20 > this.size && (a = 5);
                this.isVirus && (a = 30);
                return~~Math.max(this.size * k * (this.isVirus ? Math.min(2 * v, 1) : v), a)
            }, movePoints: function () {
                this.createPoints();
                for (var a = this.points, b = this.pointsAcc, c = b.concat(), e = a.concat(), d = e.length, f = 0; f < d; ++f) {
                    var win = c[(f - 1 + d) % d], h = c[(f + 1) % d];
                    b[f] += Math.random() - .5;
                    b[f] *= .7;
                    10 < b[f] && (b[f] = 10);
                    -10 > b[f] && (b[f] = -10);
                    b[f] = (win + h + 8 * b[f]) / 10
                }
                for (var l = this, f = 0; f < d; ++f) {
                    c = e[f].v;
                    win = e[(f - 1 + d) % d].v;
                    h = e[(f + 1) % d].v;
                    if (15 < this.size && null != F) {
                        var k = !1, n = a[f].x, m = a[f].y;
                        F.retrieve2(n - 5, m - 5, 10, 10, function (a) {
                            a.c != l && 25 > (n - a.x) * (n - a.x) + (m - a.y) * (m - a.y) && (k = !0)
                        });
                        !k && (a[f].x < S || a[f].y < T || a[f].x > U || a[f].y > V) && (k = !0);
                        k && (0 < b[f] && (b[f] = 0), b[f] -= 1)
                    }
                    c += b[f];
                    0 > c && (c = 0);
                    c = (12 * c + this.size) / 13;
                    a[f].v = (win + h + 8 * c) / 10;
                    win = 2 * Math.PI / d;
                    h = this.points[f].v;
                    this.isVirus && 0 == f % 2 && (h += 5);
                    a[f].x = this.x + Math.cos(win * f) * h;
                    a[f].y = this.y + Math.sin(win * f) *
                    h
                }
            }, updatePos: function () {
                var a;
                a = (D - this.updateTime) / 120;
                a = 0 > a ? 0 : 1 < a ? 1 : a;
                a = a * a * (3 - 2 * a);
                this.getNameSize();
                if (this.destroyed && 1 <= a) {
                    var b = C.indexOf(this);
                    -1 != b && C.splice(b, 1)
                }
                this.x = a * (this.nx - this.ox) + this.ox;
                this.y = a * (this.ny - this.oy) + this.oy;
                this.size = a * (this.nSize - this.oSize) + this.oSize;
                return a
            }, shouldRender: function () {
                return this.x + this.size + 40 < s - l / 2 / k || this.y + this.size + 40 < t - r / 2 / k || this.x - this.size - 40 > s + l / 2 / k || this.y - this.size - 40 > t + r / 2 / k ? !1 : !0
            }, draw: function () {
                if (this.shouldRender()) {
                    var a = !this.isVirus &&
                            .5 > k;
                    d.save();
                    this.drawTime = D;
                    var b = this.updatePos();
                    this.destroyed && (d.globalAlpha *= 1 - b);
                    d.lineWidth = 10;
                    d.lineCap = "round";
                    d.lineJoin = this.isVirus ? "mitter" : "round";
                    ga ? (d.fillStyle = "#FFFFFF", d.strokeStyle = "#AAAAAA") : (d.fillStyle = this.color, d.strokeStyle = this.color);
                    if (a)
                        d.beginPath(), d.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
                    else {
                        this.movePoints();
                        d.beginPath();
                        b = this.getNumPoints();
                        d.moveTo(this.points[0].x, this.points[0].y);
                        for (var c = 1; c <= b; ++c) {
                            var e = c % b;
                            d.lineTo(this.points[e].x, this.points[e].y)
                        }
                    }
                    d.closePath();
                    b = this.name.toLowerCase();
                    ua && "" == H ? -1 != Ha.indexOf(b) ? (Z.hasOwnProperty(b) || (Z[b] = new Image, Z[b].src = "skins/" + b + ".png"), c = Z[b]) : c = null : c = null;
                    b = c ? -1 != Ia.indexOf(b) : !1;
                    a || d.stroke();
                    d.fill();
                    null != c && 0 < c.width && !b && (d.save(), d.clip(), d.drawImage(c, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), d.restore());
                    (ga || 15 < this.size) && !a && (d.strokeStyle = "#000000", d.globalAlpha *= .1, d.stroke());
                    d.globalAlpha = 1;
                    null != c && 0 < c.width && b && d.drawImage(c, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                    c = -1 != m.indexOf(this);
                    a = ~~this.y;
                    if ((Y || c) && this.name && this.nameCache) {
                        e = this.nameCache;
                        e.setValue(this.name);
                        e.setSize(this.getNameSize());
                        b = Math.ceil(10 * k) / 10;
                        e.setScale(b);
                        var e = e.render(), win = ~~(e.width / b), f = ~~(e.height / b);
                        d.drawImage(e, ~~this.x - ~~(win / 2), a - ~~(f / 2), win, f);
                        a += e.height / 2 / b + 4
                    }
                    va && c && (null == this.sizeCache && (this.sizeCache = new X(this.getNameSize() / 2, "#FFFFFF", !0, "#000000")), c = this.sizeCache, c.setSize(this.getNameSize() / 2), c.setValue(~~(this.size * this.size / 100)), b = Math.ceil(10 *
                            k) / 10, c.setScale(b), e = c.render(), win = ~~(e.width / b), f = ~~(e.height / b), d.drawImage(e, ~~this.x - ~~(win / 2), a - ~~(f / 2), win, f));
                    d.restore()
                }
            }};
        X.prototype = {_value: "", _color: "#000000", _stroke: !1, _strokeColor: "#000000", _size: 16, _canvas: null, _ctx: null, _dirty: !1, _scale: 1, setSize: function (a) {
                this._size != a && (this._size = a, this._dirty = !0)
            }, setScale: function (a) {
                this._scale != a && (this._scale = a, this._dirty = !0)
            }, setColor: function (a) {
                this._color != a && (this._color = a, this._dirty = !0)
            }, setStroke: function (a) {
                this._stroke != a && (this._stroke =
                        a, this._dirty = !0)
            }, setStrokeColor: function (a) {
                this._strokeColor != a && (this._strokeColor = a, this._dirty = !0)
            }, setValue: function (a) {
                a != this._value && (this._value = a, this._dirty = !0)
            }, render: function () {
                null == this._canvas && (this._canvas = document.createElement("canvas"), this._ctx = this._canvas.getContext("2d"));
                if (this._dirty) {
                    this._dirty = !1;
                    var a = this._canvas, b = this._ctx, c = this._value, e = this._scale, d = this._size, f = d + "px Ubuntu";
                    b.font = f;
                    var win = b.measureText(c).width, h = ~~(.2 * d);
                    a.width = (win + 6) * e;
                    a.height = (d + h) * e;
                    b.font = f;
                    b.scale(e, e);
                    b.globalAlpha = 1;
                    b.lineWidth = 3;
                    b.strokeStyle = this._strokeColor;
                    b.fillStyle = this._color;
                    this._stroke && b.strokeText(c, 3, d - h / 2);
                    b.fillText(c, 3, d - h / 2)
                }
                return this._canvas
            }};
        win.onload = init
    }
})(window, jQuery);